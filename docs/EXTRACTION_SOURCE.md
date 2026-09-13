# Extraction source

Initial reusable code is being extracted from `DanilaH/cases-yg` / Signal 2000.

Reference product revision before the original feel/mechanics extraction work: `26598606c8b0e143c9c97961bcdd8e03fd37bc61`.

Later production-skeleton extraction also uses the shipped Signal 2000 platform/bootstrap, settings and persistence behavior visible on `main` after `853f498192d266848fabf932bdcf245a92781d9d`.

The source game remains the behavior reference. Generic contracts may improve naming and remove project-specific policy, but any migration back into Signal 2000 must preserve its gameplay, economy, input geometry and established presentation behavior unless explicitly reviewed as a separate product change.

The Yandex runtime extraction intentionally preserves early pause/resume subscription, safe-storage fallback, optional Player Data enhancement, idempotent LoadingAPI readiness and deterministic listener cleanup while removing Signal-specific save keys, language policy and analytics vocabulary.

The JSON repository extraction generalizes the settings/save persistence pattern into an injected codec boundary: JSON mechanics and write ordering are shared, while validation and migrations remain consumer policy.
