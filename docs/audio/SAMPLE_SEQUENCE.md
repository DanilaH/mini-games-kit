# Musical sample sequences

Import `MusicalSampleSequence` from `@danilah/mini-games-kit/audio`. Pure math; no AudioContext required.

```ts
const phrase = new MusicalSampleSequence({
  variants: 4, phrase: [0, 2, 4, 7, 4, 2], maxAdjacentSemitones: 3,
  random: cosmeticRandom.next.bind(cosmeticRandom),
});
const {index, playbackRate} = phrase.next();
phrase.reset(); // start a new phrase explicitly
```

Every variant supplied by the consumer must have the same tuned root. Offsets are semitones from that root; playbackRate=2**(offset/12). Adjacent offsets, including the loop seam, must satisfy the injected maximum. The selector avoids immediate variant repetition where possible; one variant is supported. It snapshots the phrase. RNG must return finite [0,1); bad configuration/output throws RangeError. reset resets note position and variant history.

This separates timbre variation from pitch. It cannot tune an off-key recording, equalize loudness, choose a good scale, limit voices, own level IDs or prove subjective pleasantness. Keep cosmetic RNG separate from rewards. The example C-major subset and three-semitone step are Road Lines choices, not defaults. Existing random pitch/accumulation helpers remain available for effects where continuous variation is appropriate.
