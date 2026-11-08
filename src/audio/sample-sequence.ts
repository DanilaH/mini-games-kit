export interface SampleSequenceOptions {
  variants: number;
  /** Semitone offsets from the common root of every supplied variant. */
  phrase: readonly number[];
  maxAdjacentSemitones: number;
  random?: () => number;
}
/** Pure cosmetic selector. Timbre changes do not introduce random detuning. */
export class MusicalSampleSequence {
  private last = -1;
  private position = 0;
  private readonly phrase: readonly number[];
  private readonly variants: number;
  private readonly random: () => number;
  constructor(options: SampleSequenceOptions) {
    const { variants, phrase, maxAdjacentSemitones } = options;
    if (!Number.isSafeInteger(variants) || variants < 1 || !phrase.length ||
      !Number.isFinite(maxAdjacentSemitones) || maxAdjacentSemitones < 0 ||
      phrase.some((s, i) => !Number.isFinite(s) || !Number.isFinite(2 ** (s / 12)) || 2 ** (s / 12) <= 0 ||
        Math.abs(s - phrase[(i + 1) % phrase.length]!) > maxAdjacentSemitones)) throw new RangeError('Invalid musical sample sequence');
    this.phrase = [...phrase];
    this.variants = variants; this.random = options.random ?? Math.random;
  }
  next(): { index: number; playbackRate: number } {
    const unit = this.random();
    if (!Number.isFinite(unit) || unit < 0 || unit >= 1) throw new RangeError('Cosmetic RNG must return [0,1)');
    const choices = this.variants - (this.last < 0 ? 0 : 1);
    let index = this.variants === 1 ? 0 : Math.floor(unit * choices);
    if (this.variants > 1 && this.last >= 0 && index >= this.last) index++;
    const semitones = this.phrase[this.position]!;
    this.position = (this.position + 1) % this.phrase.length; this.last = index;
    return { index, playbackRate: 2 ** (semitones / 12) };
  }
  reset(): void { this.position = 0; this.last = -1; }
}
