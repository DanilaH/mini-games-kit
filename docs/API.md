# Public API guide

This index is the entry point for the public surface of `@danilah/mini-games-kit`.

Every reusable primitive should have a short dedicated document that answers four questions: what problem it solves, what its public API is, how a game should call it, and what it deliberately does **not** own. The code remains `0.x`/experimental; these docs describe the current contract, not a promise of permanent API stability.

## Core

- [`PresentationSkipController`](core/PRESENTATION_SKIP.md) — make presentation beats skippable without moving durable/gameplay state into animation callbacks.
- [`RandomSource`, `pickWeighted`](core/RANDOM.md) — explicit injectable gameplay-randomness boundary.
- [`normalizePositiveProgress`, `sampleContinuousInteraction`](core/CONTINUOUS_INTERACTION.md) — convert project-specific geometry into normalized progress/velocity semantics.
- [`createValueTransferPlan`](core/VALUE_TRANSFER.md) — animate large semantic value transfers with bounded visual/audio density.

## Feel

- [`pointer-response`](feel/POINTER_RESPONSE.md) — normalized pointer input, idle drift, response smoothing and parallax math.

## Audio

- [`PresentationAudioMixer`](audio/PRESENTATION_MIXER.md) — base ambience + one persistent foreground state, ducking and lifecycle ownership.
- [`ContinuousNoiseTexture`](audio/CONTINUOUS_NOISE_TEXTURE.md) — progress/velocity-driven tactile WebAudio texture.
- [`pitch`](audio/PITCH.md) — bounded one-shot variation and rising accumulation pitch contours.

## Phaser

- [`planar-depth`](phaser/PLANAR_DEPTH.md) — Phaser 4 planar homography, material sheen/rim response and bounded supersampling.

Additional modules added later must be linked here as part of the same change that exposes their public API.
