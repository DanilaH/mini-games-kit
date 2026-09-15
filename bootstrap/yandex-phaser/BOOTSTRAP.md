# Mandatory Yandex + Phaser bootstrap

This directory is the minimum production baseline for a new small Yandex Games project using Phaser. It composes already-extracted `mini-games-kit` primitives; it is intentionally not a game architecture or design template.

## Included by default

- Phaser 4.2.1 + Vite + strict TypeScript;
- production Yandex runtime and local mock runtime behind one seam;
- `LoadingAPI.ready()` only after a semantic presentable event and paint settling;
- GameplayAPI desired-state ownership through the shared activity coordinator;
- Phaser sound muted while aggregate platform/visibility/ad/orientation blockers are active;
- startup preload/failure shell and generic startup timeline;
- AVIF capability detection with WebP fallback request resolution;
- debug JSON export that survives hosted iframe clipboard restrictions;
- coherent mobile viewport/orientation observation, portrait gate and landscape backing-store refresh;
- CI for typecheck, tests and production build;
- upload-root audit and hosted Yandex DRAFT release checklist;
- explicit asset-production and project-decision documents.

## After creation

Do **not** start by deleting baseline files. First inspect the whole current `mini-games-kit` repository from `docs/API.md` and identify additional primitives relevant to the game: persistence, durable pending transactions, audio, ads, rendering density, game feel, image tooling, runtime loading, etc.

Then replace the placeholder `BootstrapScene` with the first real presentable scene. Move the `GAME_PRESENTABLE_EVENT` emission to the point where the player can actually see/use the first correct frame. `LoadingAPI.ready()` must continue to follow that semantic signal rather than JS/module load.

If the game adds a custom WebAudio mixer, subscribe it to the same activity coordinator instead of creating a second pause/resume truth. The bootstrap only mutes Phaser's built-in sound manager.

Fill `docs/PROJECT_DECISIONS.md` before locking architecture. In particular, decide asset reachability/loading policy, save semantics, orientation/layout behavior, ad boundaries and onboarding durability from the new game's requirements.

## What is deliberately not universal

The bootstrap does not choose art dimensions, AVIF/WebP quality, loader concurrency, zero-runtime-loading, save schema, RNG, economy, onboarding engine or content structure. Those values were intentionally kept out because previous production evidence showed they must be measured per game.
