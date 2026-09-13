# mini-games-kit

Experimental reusable production primitives extracted from small Yandex Games projects.

The goal is not to build a generic game engine. The goal is to preserve expensive, repeatedly useful mechanics and game-feel infrastructure so new projects do not have to rediscover or re-extract them from old games.

## Status

`0.x` / experimental. APIs are allowed to change when a new real project exposes a better abstraction.

Current reference project: `DanilaH/cases-yg` (`Signal 2000`).

## Extraction rule

- Reuse production knowledge immediately.
- Extract code when the implementation is already valuable enough to save meaningful future work.
- Keep project policy, content, economy and aesthetics outside the kit.
- A new consumer is allowed to correct or reshape an existing primitive.
- Durable gameplay state must never be owned by animation, audio or presentation callbacks.

## Available now

### `@danilah/mini-games-kit/core`

- presentation skip/checkpoint controller;
- explicit injectable gameplay RNG boundary;
- normalized continuous-interaction semantics;
- bounded value-transfer planning with semantic amount separated from visual/audio density.

### `@danilah/mini-games-kit/feel`

- pointer normalization;
- delayed idle micro-drift;
- frame-rate-independent pose response;
- layered environment parallax math.

### `@danilah/mini-games-kit/phaser`

- Phaser 4.2.1 pointer-responsive planar homography/material filter;
- explicit sheen/rim/material response parameters;
- bounded/idempotent filter supersampling attachment.

### `@danilah/mini-games-kit/audio`

- persistent presentation-state audio ownership/mixing;
- baseline ducking + state replacement + mute/block lifecycle;
- continuous progress/velocity-driven tactile noise texture;
- bounded repeated-cue pitch variation and accumulation contours.

## Public API documentation

Start at [`docs/API.md`](docs/API.md). Every exported reusable utility is expected to have a dedicated explanation of its purpose, public API, usage pattern and non-goals. Provenance and Signal 2000 parity notes remain in the older topic docs under `docs/`.

## Consuming the private repository

The package is intentionally not published yet. For local/private projects, install a pinned Git commit over SSH:

```bash
npm install git+ssh://git@github.com/DanilaH/mini-games-kit.git#<commit-sha>
```

The `prepare` script builds `dist` automatically for Git installs. Pin a commit rather than tracking `main`; `0.x` APIs are intentionally allowed to change.

CI must have credentials that can read this private repository. Do not silently add this dependency to a project whose CI token cannot access cross-repository private Git dependencies; configure access first or use an explicitly reviewed vendoring strategy.

`phaser` is an optional peer dependency. Projects consuming only framework-independent subpaths such as `/core`, `/feel` or `/audio` do not need Phaser merely because the repository also exposes `/phaser`.

## Still intentionally local to Signal 2000

Signal 2000-specific rarity tuning, CHIPS/Signal/Hidden Pocket/Overcharge rules, pouch geometry, Y2K art/audio identity and `OpeningScene` orchestration stay in the game repository.

Small helpers such as silhouette-following accents and contextual transformed-bounds placement remain candidates for a later extraction pass.
