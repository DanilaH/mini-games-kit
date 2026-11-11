# Project agent contract

This project was created from the mandatory `mini-games-kit/bootstrap/yandex-phaser` baseline.

Before mass art/UI production, consult the [Visual Preproduction methodology](https://github.com/DanilaH/mini-games-kit/tree/__MINI_GAMES_KIT_REF__/docs/visual-preproduction) from the **pinned kit revision**, prepare 2–3 comparable concepts (including setting/mascot **none** as valid options), and record the **owner-approved** direction in this project's decisions and art bible. A visual concept is not approval to add extra gameplay/meta. For disposable gameplay prototypes or isolated fixes, do not block mechanics work on illustrative art.

Before preparing a Yandex Games listing, consult the [pinned kit Store Presence methodology](https://github.com/DanilaH/mini-games-kit/tree/__MINI_GAMES_KIT_REF__/docs/store-presence) and current Yandex draft rules. Use real production-rendered gameplay screenshots, one icon and cover adapted for catalog, only the device/orientation targets actually supported; verify localization, min counts and gameplay occupancy. Get owner approval before store submission. Do not mistake compiled/signed assets for a published listing.

Before material implementation work:

1. Read `BOOTSTRAP.md`, `docs/PROJECT_DECISIONS.md`, `docs/ASSET_POLICY.md` and `docs/RELEASE_CHECKLIST.md`.
2. Inspect the current `DanilaH/mini-games-kit` repository starting from `docs/API.md`; the bootstrap is the minimum baseline, not the complete menu of reusable primitives.
3. Reuse suitable kit primitives instead of reimplementing them locally.
4. Keep the pinned `@danilah/mini-games-kit` commit until an intentional upgrade is reviewed.
5. Record any deliberate removal or replacement of bootstrap infrastructure in `docs/PROJECT_DECISIONS.md` with evidence and the replacement contract.

The following baseline contracts are not accidental boilerplate: real/mock platform separation, semantic Game Ready, startup failure/preload handling, mobile viewport/orientation handling, strict TypeScript, CI, target-host release validation and explicit runtime-asset policy.

Do not treat bootstrap defaults as game design. Economy, RNG, progression, save schema, onboarding flow, content, visuals, audio identity, asset dimensions/codec quality and runtime-loading policy belong to this project and must be chosen from evidence.

When a second real project proves a local mechanism reusable, prefer extracting it back into `mini-games-kit` rather than letting copies drift.
