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

- [`GameplayActivityCoordinator` + browser blockers](platform/GAMEPLAY_ACTIVITY.md) — aggregate external blockers, visibility and viewport-orientation bridges without premature resume.
- [`ActionInterstitialGate`](platform/INTERSTITIAL_GATE.md) — local ad-request eligibility policy.
- [`StorageAdapter`](platform/STORAGE.md) — async storage seam and Web Storage adapter.
- [`JsonStorageRepository`](platform/JSON_REPOSITORY.md) — versioned JSON parsing/migration seam with serialized writes.
- [`recoverable save repair`](platform/SAVE_REPAIR.md) — policy for preserving valid durable progression while repairing only deterministic transient/current-version inconsistencies.

## Startup

- [`startup runtime`](startup/STARTUP_RUNTIME.md) — generic phase timing, queued-resource diagnostics, fake-progress preload lifecycle and clipboard/iframe-safe diagnostics export.

## Yandex Games

- [`Yandex platform runtime`](yandex/RUNTIME.md) — SDK script/init orchestration, pause/resume capture, safe-storage setup, optional Player Data mirroring, readiness and cleanup.
- [`YandexAdsAdapter`](yandex/ADS.md) — hardened fullscreen/rewarded/sticky ad lifecycle.
- [`YandexMirroredStorageAdapter`](yandex/MIRRORED_STORAGE.md) — local-first Player Data mirroring with injected conflict policy.
- [`MetricaAnalyticsAdapter`](yandex/METRICA.md) — minimal Metrica goals adapter.
- [`Yandex build audit`](yandex/BUILD_AUDIT.md) — Node-only upload-root validation and SHA-256 artifact hashing.
- [`Yandex DRAFT playbook`](yandex/DRAFT_RELEASE_PLAYBOOK.md) — hosted validation order and debug-build boundaries.

## Layout

- [`logical layout`](layout/LOGICAL_LAYOUT.md) — fixed-height landscape metrics, safe areas and a configurable Yandex 2:1 preset.
- [`mobile viewport runtime`](layout/VIEWPORT_RUNTIME.md) — coherent geometry resolution plus settle/watchdog observation for Android/WebView rotation behavior.

## Phaser

- [`planar-depth`](phaser/PLANAR_DEPTH.md) — Phaser 4 planar homography/material response.
- [`text sharpness`](phaser/TEXT_SHARPNESS.md) — Scene-scoped Phaser Text resolution.
- [`runtime image loader`](phaser/RUNTIME_IMAGE_LOADER.md) — shutdown-safe lazy image loading for projects that deliberately permit runtime loading.

## Image/runtime assets

- [`image asset pipeline`](assets/ASSET_PIPELINE.md) — background removal, normalization and validation for generated 2D art.
- [`runtime image production`](assets/RUNTIME_IMAGES.md) — transparent trimming, logical-frame metadata, AVIF companion generation/validation and encoded/RGBA budgeting.
- [`runtime image format selection`](runtime-assets/FORMAT_SELECTION.md) — browser AVIF probe and WebP fallback request mapping.
- [`runtime asset loading policy`](assets/LOADING_POLICY.md) — classify startup/session/deferred assets and make post-ready loading an explicit UX contract rather than an accidental stall.

## Production playbooks

- [`performance`](PERFORMANCE_PLAYBOOK.md) — measured startup/image optimization method and rejected shortcuts.
- [`onboarding`](ONBOARDING_PLAYBOOK.md) — event-driven first-run guidance and durable grant/recovery boundaries.

Additional modules added later must be linked here as part of the same change that exposes their public API.
