# mini-games-kit

Experimental reusable production primitives extracted from small Yandex Games projects.

The goal is not to build a generic game engine. The goal is to preserve expensive, repeatedly useful mechanics, platform plumbing, asset-production tooling and game-feel infrastructure so new projects do not have to rediscover or re-extract them from old games.

## Status

`0.x` / experimental. APIs are allowed to change when a new real project exposes a better abstraction.

Current reference project: `DanilaH/cases-yg` (`Signal 2000`). The v0.2 extraction additionally incorporates its real mobile-browser, cold-start and hosted Yandex DRAFT evidence from September 2026.

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

- `@danilah/mini-games-kit/core` — generic state/presentation/RNG/value-transfer/render-density primitives.
- `@danilah/mini-games-kit/feel` — pointer response, idle drift and parallax math.
- `@danilah/mini-games-kit/audio` — WebAudio presentation lifecycle and tactile audio utilities.
- `@danilah/mini-games-kit/platform` — platform-independent activity, browser blockers, analytics, storage, versioned JSON repositories and interstitial eligibility seams.
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

## Still intentionally local to Signal 2000

Signal 2000-specific rarity tuning, CHIPS/Signal/Hidden Pocket/Overcharge rules, pouch geometry, save conflict policy, Y2K art/audio identity and `OpeningScene` orchestration stay in the game repository.

Likewise, measured Signal values such as a 672px collectible budget, its current AVIF quality profile and its exact loader concurrency are evidence, not universal kit defaults. Reusable utilities accept policy instead of embedding those numbers.
