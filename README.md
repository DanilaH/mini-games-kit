# mini-games-kit

Experimental reusable production primitives extracted from small Yandex Games projects.

The goal is not to build a generic game engine. The goal is to preserve expensive, repeatedly useful mechanics, platform plumbing, asset-production tooling and game-feel infrastructure so new projects do not have to rediscover or re-extract them from old games.

## Status

`0.x` / experimental. APIs are allowed to change when a new real project exposes a better abstraction.

Current reference project: `DanilaH/cases-yg` (`Signal 2000`).

## Extraction rule

- Reuse production knowledge immediately.
- Extract code when the implementation is already valuable enough to save meaningful future work.
- Keep project policy, content, economy and aesthetics outside the kit.
- A new consumer is allowed to correct or reshape an existing primitive.
- Durable gameplay state must never be owned by animation, audio or presentation callbacks.

## Public subpaths

- `@danilah/mini-games-kit/core` — generic state/presentation/RNG/value-transfer/render-density primitives.
- `@danilah/mini-games-kit/feel` — pointer response, idle drift and parallax math.
- `@danilah/mini-games-kit/audio` — WebAudio presentation lifecycle and tactile audio utilities.
- `@danilah/mini-games-kit/platform` — platform-independent activity, browser blockers, analytics, storage, versioned JSON repositories and interstitial eligibility seams.
- `@danilah/mini-games-kit/yandex` — Yandex SDK bootstrap/runtime, hardened ads, Player Data mirroring and Metrica adapters.
- `@danilah/mini-games-kit/layout` — configurable logical landscape layout/safe-area math.
- `@danilah/mini-games-kit/phaser` — Phaser 4 planar depth, text sharpness and runtime image loading.
- `@danilah/mini-games-kit/assets` — Node-only image cutout/normalization/validation tooling for generated game art.

## Public API documentation

Start at [`docs/API.md`](docs/API.md). Every exported reusable utility is expected to have a dedicated explanation of its purpose, public API, usage pattern and non-goals. Provenance and Signal 2000 parity notes remain in the older topic docs under `docs/`.

## Consuming the private repository

The package is intentionally not published yet. For local/private projects, install a pinned Git commit over SSH:

```bash
npm install git+ssh://git@github.com/DanilaH/mini-games-kit.git#<commit-sha>
```

The `prepare` script builds `dist` automatically for Git installs. Pin a commit rather than tracking `main`; `0.x` APIs are intentionally allowed to change.

CI must have credentials that can read this private repository. Do not silently add this dependency to a project whose CI token cannot access cross-repository private Git dependencies; configure access first or use an explicitly reviewed vendoring strategy.

`phaser` and `sharp` are optional peers. Browser/framework-independent consumers do not need either merely because other subpaths exist. A project that uses `/phaser` installs Phaser 4.2.1; a Node tool that uses `/assets` installs Sharp.

## Still intentionally local to Signal 2000

Signal 2000-specific rarity tuning, CHIPS/Signal/Hidden Pocket/Overcharge rules, pouch geometry, save conflict policy, Y2K art/audio identity and `OpeningScene` orchestration stay in the game repository.

Reusable platform, persistence and asset utilities deliberately accept injected policy rather than embedding those Signal 2000 decisions.
