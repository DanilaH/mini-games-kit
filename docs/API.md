# Public API guide

This index is the entry point for the public surface of `@danilah/mini-games-kit`.

Every reusable primitive should have a short dedicated document that answers four questions: what problem it solves, what its public API is, how a game should call it, and what it deliberately does **not** own. The code remains `0.x`/experimental; these docs describe the current contract, not a promise of permanent API stability.

## Choose storage by the operation

| Operation | Mechanism | Important boundary |
| --- | --- | --- |
| Settings or every ordered JSON write | JsonStorageRepository | Codec owns validation and migration |
| Frequent complete save snapshots | RevisionSnapshotQueue | Intermediate snapshots may coalesce |
| Locally staged reward/action | DurablePendingTransactionSession | Exact pending identity survives interruption |
| Externally earned SDK reward | DurableReceiptQueue | Persist effect and deduplication before acknowledging |
| Optional Yandex cloud copy | YandexMirroredStorageAdapter | Local durability and best-effort cloud completion are distinct |

For combined receipt/snapshot writers, follow [the coordination contract](platform/DURABLE_RECEIPT_QUEUE.md#combining-with-revision-snapshot-saves).

## Core

- [Calendar days and daily streaks](core/DAILY_STREAK.md) — explicit calendar policy, immutable current-day recording, record and next-count projection.
- [Hint budget](core/HINT_BUDGET.md) — configurable free information reveals and a persistent earned balance; repeat reveals are free.
- [Tier progress](core/TIER_PROGRESS.md) — keep an earned milestone visible and expose the following reward; no renderer or reward ownership.

- [`PresentationSkipController`](core/PRESENTATION_SKIP.md) — skippable presentation beats without durable-state ownership.
- [`DurablePendingTransactionSession`](core/DURABLE_PENDING_TRANSACTION.md) — interruption-safe staged durable work with exact pending recovery and ambiguous-write verification.
- [`RandomSource`, `pickWeighted`](core/RANDOM.md) — injectable gameplay-randomness boundary.
- [`continuous interaction`](core/CONTINUOUS_INTERACTION.md) — normalized progress/velocity semantics.
- [`value transfer`](core/VALUE_TRANSFER.md) — bounded visual/audio density for already-owned values.
- [`render density`](core/RENDER_DENSITY.md) — DPR caps and backing-store sizing.

## Feel

- [`OwnedDomMotion`](feel/OWNED_DOM_MOTION.md) — scoped DOM/WAAPI property ownership, visible-value handoff and cancellation; game state and lifecycle policy stay in the consumer.

- [`continuous damped motion`](feel/DAMPED_MOTION.md) — impulse-preserving underdamped motion with explicit game tuning; no scheduler.

- [`pointer-response`](feel/POINTER_RESPONSE.md) — normalized pointer input, idle drift, response smoothing and parallax math.

- [`touch activation`](feel/TOUCH_ACTIVATION.md) — completed touch semantics after captured gestures.
- [`polyline markers`](feel/POLYLINE_MARKERS.md) — continuous arc-length phase with corner clearance.

## Audio

- [`PresentationAudioMixer`](audio/PRESENTATION_MIXER.md) — base ambience + one persistent foreground state, ducking and lifecycle ownership.
- [`ContinuousNoiseTexture`](audio/CONTINUOUS_NOISE_TEXTURE.md) — progress/velocity-driven tactile WebAudio texture.
- [`pitch`](audio/PITCH.md) — bounded one-shot variation and rising accumulation pitch contours.

- [`musical sample sequences`](audio/SAMPLE_SEQUENCE.md) — tuned discrete phrases and nonrepeating timbres.
- [`one-shot player`](audio/ONE_SHOT_PLAYER.md) — cold UI feedback, channel eligibility and bounded source lifecycle.

## Platform-independent runtime

- [`RevisionSnapshotQueue`](platform/REVISION_SNAPSHOT_QUEUE.md) — opt-in coalescing of complete revisioned save snapshots with immediate capture and conflict rejection.

- [`GameplayActivityCoordinator` + browser blockers](platform/GAMEPLAY_ACTIVITY.md) — aggregate external blockers, visibility and viewport-orientation bridges without premature resume.
- [`ActionInterstitialGate`](platform/INTERSTITIAL_GATE.md) — local ad-request eligibility policy.
- [`StorageAdapter`](platform/STORAGE.md) — async storage seam and Web Storage adapter.
- [`JsonStorageRepository`](platform/JSON_REPOSITORY.md) — versioned JSON parsing/migration seam with serialized writes.
- [`DurableReceiptQueue`](platform/DURABLE_RECEIPT_QUEUE.md) — serialized delivery of externally persisted earned receipts, with acknowledgement only after an idempotent durable commit.
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

- [`native banner placement`](layout/NATIVE_BANNER_PLACEMENT.md) — CSS-to-native slot geometry, safe containment, SDK-height reservation and optional bottom alignment (center by default); pure math, no bundled native SDK.

- [`logical layout`](layout/LOGICAL_LAYOUT.md) — fixed-height landscape metrics, safe areas and a configurable Yandex 2:1 preset.
- [`mobile viewport runtime`](layout/VIEWPORT_RUNTIME.md) — coherent geometry resolution plus settle/watchdog observation for Android/WebView rotation behavior.

## Phaser

- [`planar-depth`](phaser/PLANAR_DEPTH.md) — Phaser 4 planar homography/material response.
- [`text sharpness`](phaser/TEXT_SHARPNESS.md) — Scene-scoped Phaser Text resolution.
- [`runtime image loader`](phaser/RUNTIME_IMAGE_LOADER.md) — shutdown-safe lazy image loading for projects that deliberately permit runtime loading.

- [`destroy renderer`](phaser/DESTROY_RENDERER.md) — finish deferred Phaser teardown even from sleep.

## Image/runtime assets

- [`image asset pipeline`](assets/ASSET_PIPELINE.md) — background removal, normalization and validation for generated 2D art.
- [`runtime image production`](assets/RUNTIME_IMAGES.md) — transparent trimming, logical-frame metadata, AVIF companion generation/validation and encoded/RGBA budgeting.
- [`runtime image format selection`](runtime-assets/FORMAT_SELECTION.md) — browser AVIF probe and WebP fallback request mapping.
- [`runtime asset loading policy`](assets/LOADING_POLICY.md) — classify startup/session/deferred assets and make post-ready loading an explicit UX contract rather than an accidental stall.

## Production playbooks

- [Foreground transition recipe](platform/FOREGROUND_TRANSITION_RECIPE.md) — exactly-once continuation after independent ad dismissal and foreground conditions; copyable example, not an SDK adapter.



- [`Android ads and lifecycle`](android/ADS_AND_LIFECYCLE.md) — native banner reservation/geometry in both orientations, earned rewards, blockers and live-integration proof; specification, not a Capacitor plugin.
- [Local daily reminders](android/LOCAL_REMINDERS.md) — permission, inexact local scheduling, truthful state-based text and current-day entry; Android recipe, no bundled scheduler.
- [In-app review](android/IN_APP_REVIEW.md) — rare eligibility, prepare/launch generations and external-window coordination; SDK integration recipe.
- [Native haptics](android/HAPTICS.md) — priority, monotonic generation cancellation and device acceptance; recipe, profiles remain in the game.
- [Stable progress UI](layout/STABLE_PROGRESS_UI.md) — counters, initial no-scroll action checks, saved completion, native time input and transition acceptance; no shared CSS component.
- [Committed analytics recipe](platform/COMMITTED_ANALYTICS.md) — publish state-changing milestone IDs only from successful save snapshots; no new queue export.
- [`puzzle UI, progress and feel`](PUZZLE_PRODUCTION.md) — undo-safe progression, daily/catalog validation, bounded worker analysis, large-field UX and restrained feedback.
- [`Android release acceptance`](ANDROID_RELEASE_ACCEPTANCE.md) — release shrinking, signing/artifact identity, independent test layers and honest evidence.
- [`performance`](PERFORMANCE_PLAYBOOK.md) — measured startup/image optimization method and rejected shortcuts.
- [`onboarding`](ONBOARDING_PLAYBOOK.md) — event-driven first-run guidance and durable grant/recovery boundaries.
- [`localization and authentic store media`](LOCALIZATION_AND_STORE_MEDIA.md) — context-aware game copy, counted-resource formatting, in-engine screenshot provenance and per-locale acceptance; guidance only, no new API.

Additional modules added later must be linked here as part of the same change that exposes their public API.

## Visual preproduction (not public API)

- [Visual Direction & UX Preproduction](visual-preproduction/README.md) — pre-art methodology: setting, brand identity, mascot/no-mascot, design concepts, layouts and visual approval.
- [How to compare concepts](visual-preproduction/METHOD.md) — UX skeleton, same-state A/B/C visual pitches, production costs and evidence gates.
- [Agent presentation protocol](visual-preproduction/AGENT_PROTOCOL.md) — coherent visual options before mass art creation; project owns the final approved visual identity.

## Store Presence / ASO (not public API)

- [Store Listing, ASO & Conversion Design](store-presence/README.md) — platform-aware, source-verified production method for RuStore, Google Play, App Store and Yandex Games.
- [Current rules and conflicts](store-presence/PLATFORM_REQUIREMENTS.md) — required vs recommended vs conditional; revalidate at submission.
- [Store release agent protocol](store-presence/AGENT_PROTOCOL.md) — truthful gameplay capture, per-target exports, owner approval and A/B handoff.

## Agent task routing and project initialization (not public API)

- [Task Router](agent-workflows/TASK_ROUTER.md) — choose the one or two relevant game/research/production contracts per task instead of reading the entire research library.
- [Reference Teardown](agent-workflows/REFERENCE_PROTOCOL.md) — observable gameplay, input, state/motion/feel comparison for video/GIF/competitor/reference requests, with evidence vs inference.
- [Kit Feedback Loop](agent-workflows/KIT_FEEDBACK_LOOP.md) — consumer agent reports NONE/REUSE/IMPROVE/CANDIDATE/EXTRACTED; only verified shared behavior migrates upstream.
- [New Game Repo Setup](agent-workflows/NEW_PROJECT_SETUP.md) — tested Yandex Phaser runtime bootstrap plus guidance-only init for Android/web; pins docs and dependency to exact kit SHA when applicable.

These are **process docs**, not public runtime exports. Full research studies are selected by the router and stay in the kit, not copied to every consumer.

**Agent guidance verification:** npm run guidance:doctor -- <consumer> --strict checks local task-router/reference/feedback links and pins; optional --expected-kit-ref <sha> reports research drift without changing consumer files. Generated CLAUDE.md bridges Claude Code to the canonical project AGENTS.md; actual harness loading must be separately tested.

## Design research (not public API)

- [Puzzle Design entry point](puzzle-design/README.md) — **optional design and evaluation methodology**, not a new runtime export.
- [Choose directions per project](puzzle-design/PROJECT_SELECTION.md) — inspect evidence, record SELECT / HOLD / REJECT, usually test only 1–2 hypotheses per pass; no automatic directors or meta.
- [Boundaries to existing kit APIs](puzzle-design/INTEGRATION_BOUNDARIES.md) — avoid duplicating the primitives above; keep balance, content, aesthetics and monetization policy in the game.

## Provenance and consumer evidence

These record extraction history and validation limits; they are not required setup steps.

- [Water Sort extraction](extraction/WATER_SORT_INTEGRATION.md) — safe-area feedback, continuous motion, consumer acceptance and additional puzzle/UX contracts.
- [Road Lines extraction](extraction/ROAD_LINES_INTEGRATION.md) — code provenance, semantic changes and integration limits.
- [Sudoku 0.17 extraction plan](extraction/SUDOKU_017.md) — Android ads/rewards, optional profiles, daily catalogs, progress and responsive UX; implementation specification and evidence, no new runtime API.
- [`Seeds extraction map`](SEEDS_EXTRACTION.md) — code versus specification boundaries, source revisions and known defects excluded from reuse.
- [Seeds 1.1 follow-up](extraction/SEEDS_110.md) — daily progression, shared hints, engagement and stable presentation; source revisions, intentional changes and validation limits.

- [Seeds 1.1.2 follow-up](extraction/SEEDS_112.md) — compact banners, initial-action acceptance, saved finales and analytics status; explicit donor and adoption limits.
