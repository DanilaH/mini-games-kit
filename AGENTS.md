# mini-games-kit agent contract

This repository is an experimental reusable kit for small games. It exists to preserve expensive production work without turning one game's architecture into a speculative framework.

Before changing code:

1. Identify the real source project and concrete production behavior being preserved.
2. Separate reusable mechanism from project policy, naming, balance, content and aesthetics.
3. Prefer small semantic APIs over scene/framework abstractions.
4. Keep gameplay/durable state independent from presentation.
5. Preserve deterministic lifecycle cleanup and repeated-use performance.
6. Treat `0.x` APIs as experimental: new real consumers may change them.

Do not import Signal 2000 concepts such as CHIPS, Signal, Hidden Pocket, Overcharge, exact rarity policy, pouch geometry or Y2K presentation into generic contracts.

When extracting from a project, carry over or recreate focused tests that prove the reusable behavior. Record the original source revision and any intentional semantic changes in the PR description or nearby docs.
