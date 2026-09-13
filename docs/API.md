# Public API guide

This index is the entry point for the public surface of `@danilah/mini-games-kit`.

Every reusable primitive should have a short dedicated document that answers four questions: what problem it solves, what its public API is, how a game should call it, and what it deliberately does **not** own. The code remains `0.x`/experimental; these docs describe the current contract, not a promise of permanent API stability.

## Core

- [`PresentationSkipController`](core/PRESENTATION_SKIP.md) — skippable presentation beats without durable-state ownership.
- [`DurablePendingTransactionSession`](core/DURABLE_PENDING_TRANSACTION.md) — interruption-safe staged durable work with exact pending recovery and ambiguous-write verification.
- [`RandomSource`, `pickWeighted`](core/RANDOM.md) — injectable gameplay-randomness boundary.
- [`continuous interaction`](core/CONTINUOUS_INTERACTION.md) — normalized progress/velocity semantics.
- [`value transfer`](core/VALUE_TRANSFER.md) — bounded visual/audio density for already-owned values.
- [`render density`](core/RENDER_DENSITY.md) — DPR caps and backing-store sizing.

## Feel

- [`pointer-response`](feel/POINTER_RESPONSE.md) — normalized pointer input, idle drift, response smoothing and parallax math.

## Audio

- [`PresentationAudioMixer`](audio/PRESENTATION_MIXER.md) — base ambience + one persistent foreground state, ducking and lifecycle ownership.
- [`ContinuousNoiseTexture`](audio/CONTINUOUS_NOISE_TEXTURE.md) — progress/velocity-driven tactile WebAudio texture.
- [`pitch`](audio/PITCH.md) — bounded one-shot variation and rising accumulation pitch contours.

## Platform-independent runtime

- [`GameplayActivityCoordinator`](platform/GAMEPLAY_ACTIVITY.md) — aggregate external blockers without premature resume.
- [`ActionInterstitialGate`](platform/INTERSTITIAL_GATE.md) — local ad-request eligibility policy.
- [`StorageAdapter`](platform/STORAGE.md) — async storage seam and Web Storage adapter.

## Yandex Games

- [`YandexAdsAdapter`](yandex/ADS.md) — hardened fullscreen/rewarded/sticky ad lifecycle.
- [`YandexMirroredStorageAdapter`](yandex/MIRRORED_STORAGE.md) — local-first Player Data mirroring with injected conflict policy.
- [`MetricaAnalyticsAdapter`](yandex/METRICA.md) — minimal Metrica goals adapter.

## Layout

- [`logical layout`](layout/LOGICAL_LAYOUT.md) — fixed-height landscape metrics, safe areas and a configurable Yandex 2:1 preset.

## Phaser

- [`planar-depth`](phaser/PLANAR_DEPTH.md) — Phaser 4 planar homography/material response.
- [`text sharpness`](phaser/TEXT_SHARPNESS.md) — Scene-scoped Phaser Text resolution.
- [`runtime image loader`](phaser/RUNTIME_IMAGE_LOADER.md) — shutdown-safe lazy image loading.

## Node asset tooling

- [`image asset pipeline`](assets/ASSET_PIPELINE.md) — background removal, normalization and validation for generated 2D art.

Additional modules added later must be linked here as part of the same change that exposes their public API.
