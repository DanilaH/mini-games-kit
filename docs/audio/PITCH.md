# Pitch helpers

Import from `@danilah/mini-games-kit/audio`.

## What it is

Small presentation-only helpers for avoiding mechanically identical repeated cues and for giving a banking/accumulation sequence a controlled rising contour.

## Public API

```ts
const playbackRate = applyBoundedPitchVariation(0.03, cosmeticRandom.next());

const multiplier = getAccumulationPitchMultiplier(
  transferProgress,
  { startMultiplier: 0.92, endMultiplier: 1.18, jitterAmount: 0.012 },
  cosmeticRandom.next(),
);
```

Both APIs expect a unit random sample in `[0, 1]` and keep output bounded by the configured range.

## Important boundary

This randomness is presentation-only. Do not consume gameplay/loot RNG to vary sound pitch. A game should use a separate cosmetic source or `Math.random()` when determinism is not required.

## Applicability: bounded variation is not musical tuning

Random playbackRate and a rising continuous contour can suit noises/clacks. For tonal cues, first tune all timbre variants to one root and choose compatible discrete intervals/chords. Arbitrary detune on already mismatched samples remains dissonant even inside a bounded range. Use [MusicalSampleSequence](SAMPLE_SEQUENCE.md) for discrete phrases; it complements rather than changes these helpers. Match loudness/short tails, share forward/reverse audio density, keep haptics independent and drop obsolete cues. Phone listening remains a separate acceptance layer.
