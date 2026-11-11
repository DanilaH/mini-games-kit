# mini-games-kit

Experimental reusable production primitives extracted from small Yandex Games projects.

The goal is not to build a generic game engine. The goal is to preserve expensive, repeatedly useful mechanics, platform plumbing, asset-production tooling and game-feel infrastructure so new projects do not have to rediscover or re-extract them from old games.

## Start here

| Need | Entry point | Status |
| --- | --- | --- |
| New Yandex + Phaser game | [Bootstrap](docs/BOOTSTRAP.md) | Generated runnable project |
| Select reusable mechanisms | [API guide](docs/API.md) | Implemented APIs with focused usage docs |
| Android advertising | [Integration contract](docs/android/ADS_AND_LIFECYCLE.md) | Specification and geometry; no bundled native SDK |
| Daily progression and engagement | [Calendar/streaks](docs/core/DAILY_STREAK.md), [hints](docs/core/HINT_BUDGET.md), [tiers](docs/core/TIER_PROGRESS.md) | Portable models; Android reminders/review/haptics are linked recipes |
| Choose puzzle-design research directions | [Puzzle Design selection](docs/puzzle-design/PROJECT_SELECTION.md) | Opt-in design methods; each project records SELECT / HOLD / REJECT instead of installing all mechanics |
| Review source-game evidence | [Extraction history](docs/EXTRACTION_SOURCE.md) | Historical acceptance, not a deployed consumer upgrade |

Choose portrait or landscape explicitly when generating a game:
`npm run bootstrap:create -- ../game --orientation portrait`.

## Status

`0.x` / experimental. APIs are allowed to change when a new real project exposes a better abstraction.

Source-game history and integration limits are indexed in [extraction provenance](docs/EXTRACTION_SOURCE.md). Current usage contracts live in [the API guide](docs/API.md).

## Mandatory bootstrap for new Yandex + Phaser games

Every new Yandex Games project using Phaser starts from [`bootstrap/yandex-phaser`](bootstrap/yandex-phaser). This is the mandatory minimum production baseline: real/mock platform separation, semantic Game Ready, startup shell/diagnostics, AVIF/WebP selection hook, hardened mobile viewport handling, strict TS/Vite/Phaser setup, CI and Yandex release audit/checklist.

Create a project from an exact kit revision:

```bash
npm run bootstrap:create -- ../my-new-game
```

The generator pins the produced project to the current exact `mini-games-kit` commit. After creation, the agent must still inspect the whole kit beginning at [`docs/API.md`](docs/API.md) and add any other relevant primitives. Bootstrap is the floor, not the complete architecture.

See [`docs/BOOTSTRAP.md`](docs/BOOTSTRAP.md) for the repository policy and upgrade/deviation rules.

## Extraction rule

- Reuse production knowledge immediately.
- Extract code when the implementation is already valuable enough to save meaningful future work.
- Keep project policy, content, economy and aesthetics outside the kit.
- A new consumer is allowed to correct or reshape an existing primitive.
- Durable gameplay state must never be owned by animation, audio or presentation callbacks.
- Measure startup on the target host before making CDN/request-count conclusions from a convenience host.

## Public subpaths

- `@danilah/mini-games-kit/core` — generic state/presentation/RNG/value-transfer/render-density primitives, calendar/streak models, hint budgets and tier progress.
- `@danilah/mini-games-kit/feel` — pointer response, idle drift and parallax math.
- `@danilah/mini-games-kit/audio` — WebAudio presentation lifecycle and tactile audio utilities.
- `@danilah/mini-games-kit/platform` — platform-independent activity, browser blockers, analytics, storage, versioned JSON repositories and interstitial eligibility seams.
- The same `/platform` subpath exports `DurableReceiptQueue` for commit-before-ack delivery of externally persisted rewards; storage and reward policy remain consumer-owned.
- `@danilah/mini-games-kit/yandex` — Yandex SDK bootstrap/runtime, hardened ads, Player Data mirroring and Metrica adapters.
- `@danilah/mini-games-kit/yandex-tooling` — Node-only Yandex upload-directory audit and artifact hashing.
- `@danilah/mini-games-kit/layout` — configurable logical landscape layout/safe-area math plus hardened mobile viewport/orientation observation.
- `@danilah/mini-games-kit/phaser` — Phaser 4 planar depth, text sharpness and runtime image loading.
- `@danilah/mini-games-kit/assets` — Node-only image cutout, normalization, transparent trimming, runtime budget and AVIF companion tooling.
- `@danilah/mini-games-kit/runtime-assets` — browser-safe AVIF capability detection and WebP fallback path selection.
- `@danilah/mini-games-kit/startup` — phase timing, Resource Timing diagnostics, resilient diagnostic export and startup preload orchestration.

## Public API documentation

Start at [`docs/API.md`](docs/API.md). Every exported reusable utility is expected to have a dedicated explanation of its purpose, public API, usage pattern and non-goals.

Production lessons that should shape a new project before code is copied live in [`docs/PERFORMANCE_PLAYBOOK.md`](docs/PERFORMANCE_PLAYBOOK.md), [`docs/ONBOARDING_PLAYBOOK.md`](docs/ONBOARDING_PLAYBOOK.md) and the Yandex DRAFT playbook.

## Consuming the repository

The package is intentionally not published yet. Install a pinned Git commit:

```bash
npm install github:DanilaH/mini-games-kit#<commit-sha>
```

The `prepare` script builds `dist` automatically for Git installs. Pin a commit rather than tracking `main`; `0.x` APIs are intentionally allowed to change.

`phaser` and `sharp` are optional peers. Browser/framework-independent consumers do not need either merely because other subpaths exist. A project that uses `/phaser` installs Phaser 4.2.1; a Node tool that uses `/assets` installs Sharp.

## Scope and verification

Game rules, economy, content, art and platform policy stay in consuming projects.
The kit supplies mechanisms with explicit ownership and lifecycle boundaries.

- `npm ci && npm run typecheck && npm test` checks portable contracts.
- `npm run bootstrap:check && npm run bootstrap:smoke` validates generation and installs/builds the packed kit in a separate project.
- `npm run test:browser` checks browser input, audio and Phaser teardown.
- Consumer probes under `tools/*consumer-probe.mjs` are opt-in integration experiments requiring a source checkout; they do not upgrade released games.

See [test organization](tests/README.md) for the scope and limits of each layer.
