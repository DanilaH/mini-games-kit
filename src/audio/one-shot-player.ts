export type OneShotChannel = 'gameplay' | 'ui';
export interface OneShotGroup { minIntervalMs: number; replacementFadeMs?: number; }
export interface OneShotOptions {
  groups: Readonly<Record<string, OneShotGroup>>;
  createContext?: () => AudioContext;
  /** False when an application/mixer owns the injected context's suspend/close lifecycle. */
  ownsContext?: boolean;
  now?: () => number;
  maxVoices?: number;
  resumeDeadlineMs?: number;
}
export interface OneShotCue {
  group: string;
  channel: OneShotChannel;
  /** Already decoded buffer or a tiny synchronous, consumer-cached fallback. Never await decoding here. */
  buffer: AudioBuffer | ((context: AudioContext) => AudioBuffer | null);
  gain?: number;
  playbackRate?: number;
  offset?: number;
  duration?: number;
}
interface Voice {
  source: AudioBufferSourceNode; gain: GainNode; channel: OneShotChannel; group: string;
  timer?: ReturnType<typeof setTimeout>; ended: boolean;
}
/** One context and bounded voices. Dropped/expired cues are never queued or replayed. */
export class OneShotPlayer {
  private context?: AudioContext;
  private resumePending = false;
  private disposed = false;
  private eligibility = { gameplay: true, ui: true };
  private voices = new Set<Voice>();
  private last = new Map<string, number>();
  private readonly groups: Readonly<Record<string, OneShotGroup>>;
  private readonly maxVoices: number;
  private readonly deadline: number;
  constructor(private readonly options: OneShotOptions) {
    this.groups = Object.fromEntries(Object.entries(options.groups).map(([key, value]) => [key, { ...value }]));
    this.maxVoices = options.maxVoices ?? 12; this.deadline = options.resumeDeadlineMs ?? 100;
    if (!Number.isSafeInteger(this.maxVoices) || this.maxVoices < 1 || !Number.isFinite(this.deadline) || this.deadline <= 0 ||
      Object.values(this.groups).some(g => !Number.isFinite(g.minIntervalMs) || g.minIntervalMs < 0 ||
        g.replacementFadeMs !== undefined && (!Number.isFinite(g.replacementFadeMs) || g.replacementFadeMs < 0))) throw new RangeError('Invalid one-shot limits');
  }
  get activeVoices(): number { return this.voices.size; }
  setEligibility(value: { gameplay: boolean; ui: boolean }): void {
    this.eligibility = { ...value };
    for (const voice of [...this.voices]) if (!value[voice.channel]) this.stop(voice);
    this.suspendIfIdle();
  }
  private suspendIfIdle(): void {
    if (this.options.ownsContext !== false && !this.eligibility.gameplay && !this.voices.size && this.context?.state === 'running') void this.context.suspend().catch(() => {});
  }
  /** Call from an accepted user activation. Audio failures never decide gameplay success. */
  play(cue: OneShotCue): boolean {
    if (this.disposed || !this.eligibility[cue.channel]) return false;
    const profile = Object.hasOwn(this.groups, cue.group) ? this.groups[cue.group] : undefined;
    if (!profile) throw new RangeError('Unknown one-shot group');
    const { gain: volume = 1, playbackRate = 1, offset = 0, duration } = cue;
    if (!Number.isFinite(volume) || volume < 0 || !Number.isFinite(playbackRate) || playbackRate <= 0 ||
      !Number.isFinite(offset) || offset < 0 || duration !== undefined && (!Number.isFinite(duration) || duration <= 0)) throw new RangeError('Invalid cue');
    const now = (this.options.now ?? (() => performance.now()))();
    if (now - (this.last.get(cue.group) ?? -Infinity) < profile.minIntervalMs) return false;
    try {
      const context = this.context ??= (this.options.createContext ?? (() => new AudioContext()))();
      // Resume before the voice-budget check: saturation must not prevent recovery.
      if (context.state === 'suspended' && !this.resumePending) {
        this.resumePending = true;
        void context.resume().catch(() => {}).finally(() => { this.resumePending = false; this.suspendIfIdle(); });
      }
      if (context.state !== 'running' && context.state !== 'suspended') return false;
      const buffer = typeof cue.buffer === 'function' ? cue.buffer(context) : cue.buffer;
      if (!buffer || offset >= buffer.duration) return false;
      const previous = [...this.voices].filter(v => v.group === cue.group);
      for (const voice of previous) {
        const fade = profile.replacementFadeMs ?? 0;
        if (fade && context.state === 'running') {
          voice.gain.gain.setTargetAtTime(0, context.currentTime, fade / 5000);
          voice.source.stop(context.currentTime + fade / 1000);
        } else this.stop(voice);
      }
      if (this.voices.size >= this.maxVoices) { this.suspendIfIdle(); return false; }
      const source = context.createBufferSource(), gain = context.createGain();
      const voice: Voice = { source, gain, channel: cue.channel, group: cue.group, ended: false };
      source.buffer = buffer; source.playbackRate.value = playbackRate; gain.gain.value = volume;
      source.connect(gain); gain.connect(context.destination); this.voices.add(voice);
      source.onended = () => this.finish(voice);
      if (context.state === 'suspended') voice.timer = setTimeout(() => { if (context.state !== 'running') this.stop(voice); }, this.deadline);
      try { source.start(context.currentTime, offset, duration ?? buffer.duration - offset); }
      catch { this.stop(voice); return false; }
      this.last.set(cue.group, now); return true;
    } catch { return false; }
    finally { this.suspendIfIdle(); }
  }
  private finish(voice: Voice): void {
    if (voice.ended) return;
    voice.ended = true; clearTimeout(voice.timer); voice.source.onended = null;
    voice.source.disconnect(); voice.gain.disconnect(); this.voices.delete(voice); this.suspendIfIdle();
  }
  private stop(voice: Voice): void { try { voice.source.stop(); } catch {} this.finish(voice); }
  cancel(): void { for (const voice of [...this.voices]) this.stop(voice); }
  dispose(): void {
    if (this.disposed) return;
    this.disposed = true; this.cancel(); this.last.clear();
    if (this.options.ownsContext !== false) void this.context?.close().catch(() => {});
  }
}
