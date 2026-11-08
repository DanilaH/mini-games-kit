# Bounded one-shot playback

Import `OneShotPlayer` from `@danilah/mini-games-kit/audio`. Browser WebAudio; no Phaser/Capacitor. Uses one AudioContext, created lazily (or returned by createContext). By default it owns suspend/close. For an application-owned context shared with PresentationAudioMixer, inject it and set ownsContext:false; the application owns aggregate suspension/closure and must block every channel/mixer consistently. This mode cancels only its own voices, never another subsystem’s context.

```ts
const player = new OneShotPlayer({
  groups: { ui: { minIntervalMs: 0 }, route: { minIntervalMs: 65, replacementFadeMs: 20 } },
  maxVoices: 12, resumeDeadlineMs: 100,
});
player.setEligibility({ gameplay: false, ui: true }); // paused modal
// Execute the accepted action first, then evaluate its final blocker state.
player.play({ group: 'ui', channel: 'ui', buffer: tinyCachedFallback });
player.setEligibility({ gameplay: false, ui: false }); // background/ad/mute
player.dispose();
```

`buffer` is an already decoded AudioBuffer or a synchronous `(context)=>AudioBuffer|null` provider. The consumer can cache a tiny fallback to make the first button independent of a large sprite decoder. Loading/decoding remain external; no promise of cues is queued. Optional gain/rate/offset/duration select a clip. `play` returns whether a source was scheduled, not proof it was audible. Invalid configuration/cue or an unknown group throws; unavailable audio/provider failures return false.

Each configured group replaces its previous voice; fade is optional and meaningful only while running. Fading sources count toward maxVoices. Rejected cues are dropped, never delayed. Limits and groups are copied at construction; last-use storage cannot grow from arbitrary cue names. Route forward/reverse should share a group. Haptics have their own budgets.

UI/gameplay eligibility are separate. In pause/shop permit only UI; hard blockers and mute permit neither. Disallowed active/pending voices stop immediately. Pending resume is single-flight; sources scheduled while suspended expire after resumeDeadlineMs, so a late resume cannot replay old clicks. Cleanup releases source/gain nodes and timers without depending on an ended event while suspended. After the last UI voice ends in a gameplay-blocked modal, context is suspended again. cancel stops voices; dispose is idempotent and closes an owned context; a borrowed context remains untouched. It does not issue DOM actions or decide which blocker names are soft/hard.

Defaults are maxVoices12 and resumeDeadlineMs100; group cadence/fade is consumer policy. Tests run real WebAudio at CPU1×/4×, including cold UI, late resume, replacement, blocked feedback and closure. They do not establish phone loudness/pleasantness.
