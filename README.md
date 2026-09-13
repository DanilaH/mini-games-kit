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

## Planned first slice

- pure core utilities: presentation checkpoints, RNG boundary, bounded value-transfer planning;
- continuous interaction semantics;
- Phaser 4 pointer-responsive planar depth/material response;
- presentation-audio ownership primitives;
- small Phaser feel helpers such as silhouette-following accents and contextual placement.

Signal 2000-specific rarity tuning, CHIPS/Signal/Hidden Pocket/Overcharge rules, pouch geometry, Y2K art/audio identity and `OpeningScene` orchestration stay in the game repository.
