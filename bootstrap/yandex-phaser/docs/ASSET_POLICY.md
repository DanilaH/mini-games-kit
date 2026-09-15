# Runtime asset policy — fill before content scale-up

Image production is a mandatory project decision, not an afterthought. Start from the current `mini-games-kit` docs for `assets/RUNTIME_IMAGES.md`, `runtime-assets/FORMAT_SELECTION.md`, `assets/LOADING_POLICY.md` and `PERFORMANCE_PLAYBOOK.md`.

The bootstrap initializes the selected runtime image format before Phaser construction. Keep canonical manifests/asset ids on fallback `.webp` paths and call `runtimeImageRequestPath()` from `src/app/runtimeImages.ts` at the actual loader/request boundary. That preserves one logical asset identity while modern browsers request AVIF and unsupported browsers stay on WebP.

Before committing a large art set, record:

- source/master provenance and whether future re-encoding can start from pristine masters;
- actual maximum presentation size and DPR budget by asset category;
- canonical logical canvas policy where one is needed;
- transparent trim/logical-frame metadata policy;
- fallback codec and modern-codec companion policy;
- quality policy by category, based on visual QA rather than inherited numbers;
- encoded byte budget and physical-pixel/RGBA residency budget;
- startup-required, session-required and deferred asset classification;
- whether post-ready loading is allowed and where the authored loading boundary lives;
- CI validators and target-host/device acceptance procedure.

Do not copy numeric image settings from another game merely because the pipeline is shared. Request count, ZIP size, encoded transfer and decoded pixel residency are separate budgets.
