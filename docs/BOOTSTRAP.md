# Mandatory Yandex + Phaser bootstrap policy

`bootstrap/yandex-phaser` is the required starting point for every new Yandex Games project that uses Phaser.

The purpose is operational memory: baseline production behavior that has already been paid for should not depend on an agent remembering to rediscover it from old games.

## Rule

1. Generate the project with `npm run bootstrap:create -- <destination>` from a reviewed `mini-games-kit` commit.
2. Keep the generated baseline intact through the first local build and hosted Yandex DRAFT gate.
3. Before feature implementation, inspect the current kit beginning at `docs/API.md` and add any other relevant reusable modules.
4. Treat the generated `AGENTS.md`, `BOOTSTRAP.md`, asset policy and release checklist as project source-of-truth documents, not disposable scaffolding.
5. If a project removes or replaces a baseline mechanism, record the previous contract, replacement, reason and validation evidence in `docs/PROJECT_DECISIONS.md`.

## What the bootstrap guarantees by default

The template wires the parts that should not be left to memory in a compact Yandex/Phaser game:

- strict TypeScript, Vite and Phaser 4.2.1;
- real Yandex SDK runtime separated from local mock runtime;
- `LoadingAPI.ready()` behind a semantic first-presentable-frame signal;
- GameplayAPI desired-state handoff through the shared activity coordinator;
- startup preload/failure presentation and startup timing snapshot;
- browser AVIF capability detection with fallback-format selection hook;
- hosted-iframe-safe diagnostic export;
- coherent mobile viewport/orientation observation with portrait gate and bounded settle/watchdog passes;
- production/debug Yandex build modes;
- baseline CI and upload-root audit;
- required decision documents for runtime assets, persistence, loading, onboarding and release acceptance.

## What remains project-owned

The template deliberately does not decide:

- game loop, content, economy, RNG or progression;
- save schema or cloud reconciliation policy;
- onboarding flow;
- canonical art dimensions, codec quality or loader concurrency;
- whether session-required art is fully preloaded or loaded behind authored transitions;
- DPR/render-density cap;
- ad placement/business policy;
- art/audio identity.

Those choices must come from the new game's product and measurement evidence. Reusing the mechanism does not mean inheriting another game's numbers.

## Visual direction before art production

For a **new game**, review [Visual Preproduction](visual-preproduction/README.md) after the core action is understood but before authoring the full UI, character/setting content or store art. Agents prepare comparable concept pitches and select a final setting / mascot / visual language with the owner; no character, story or rich artwork is mandatory. Capture the chosen direction in the consumer's project decisions and Art Bible. This documentation gate does not change the technical baseline or block a disposable mechanics prototype.

## Optional puzzle-design methods

For a new puzzle game, or when explicitly tasked with product/UX improvement, consult [Puzzle Design: choose directions](puzzle-design/PROJECT_SELECTION.md) after establishing the game's core loop and current evidence. Record SELECT / HOLD / REJECT for **relevant** directions in the generated project's decision log. **No selected direction is required**; these methods do not change the mandatory technical bootstrap or create an obligation to add new directors, meta systems or advertising.

## Generator behavior

`tools/bootstrap/create-yandex-phaser.mjs` copies the full template and substitutes project name plus an **exact 40-character kit commit SHA**. It refuses a non-empty destination and leaves no unresolved placeholders.

`npm run bootstrap:check` validates the mandatory manifest and generator output. `npm run bootstrap:smoke` creates a temporary real project, installs the current kit locally, and runs its typecheck, tests, production build and Yandex upload-root audit. Both are part of kit CI so template drift fails the repository gate rather than surfacing in the next game.

The generator accepts --orientation portrait or --orientation landscape (compatibility default). The template blocks game input and the Phaser loop during external blockers, uses sleeping-loop-safe renderer destruction, and deduplicates Phaser. Smoke installation uses a packed archive rather than a source symlink.
