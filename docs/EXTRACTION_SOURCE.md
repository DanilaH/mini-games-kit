# Extraction source

Initial reusable code is being extracted from `DanilaH/cases-yg` / Signal 2000.

Reference product revision before the original feel/mechanics extraction work: `26598606c8b0e143c9c97961bcdd8e03fd37bc61`.

Later production-skeleton extraction also uses the shipped Signal 2000 platform/bootstrap, settings and persistence behavior visible on `main` after `853f498192d266848fabf932bdcf245a92781d9d`.

The source game remains the behavior reference. Generic contracts may improve naming and remove project-specific policy, but any migration back into Signal 2000 must preserve its gameplay, economy, input geometry and established presentation behavior unless explicitly reviewed as a separate product change.

The Yandex runtime extraction intentionally preserves early pause/resume subscription, safe-storage fallback, optional Player Data enhancement, idempotent LoadingAPI readiness and deterministic listener cleanup while removing Signal-specific save keys, language policy and analytics vocabulary.

The JSON repository extraction generalizes the settings/save persistence pattern into an injected codec boundary: JSON mechanics and write ordering are shared, while validation and migrations remain consumer policy.

## Seeds / Android puzzle extraction (2026-10-23)

Additional source: `DanilaH/seeds-bits` revision `96caff6aac357e06b8373301b2b895544c9ef179`; APK application source `86d950b970a69e5dec3ebc269075143a1c28f94a`. See [the extraction map](SEEDS_EXTRACTION.md) for exact files, intentional changes and exclusions. The new `DurableReceiptQueue` preserves native receipt → idempotent durable game commit → native acknowledgement, with injected persistence instead of a copied SDK plugin. Focused tests recreate duplicate delivery, interruption/ambiguous save, failed acknowledgement and queue recovery.

Android ads/layout, puzzle progression/feel and release/media workflows are captured as specifications. Existing kit activity, value-transfer and audio primitives are referenced rather than duplicated. Known source issues in cross-tab preferences, malformed dates and saturated audio resume are explicitly excluded from direct copying. No game-specific rules, catalog, reward balance, secret configuration or signing key is imported.
