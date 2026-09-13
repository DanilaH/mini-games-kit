# mini-games-kit agent contract

This repository is an experimental reusable kit for small games. It exists to preserve expensive production work without turning one game's architecture into a speculative framework.

Before changing code:

1. Identify the real source project and concrete production behavior being preserved.
2. Separate reusable mechanism from project policy, naming, balance, content and aesthetics.
3. Prefer small semantic APIs over scene/framework abstractions.
4. Keep gameplay/durable state independent from presentation.
5. Preserve deterministic lifecycle cleanup and repeated-use performance.
6. Treat `0.x` APIs as experimental: new real consumers may change them.
7. Start public-surface discovery from `docs/API.md` before adding a new primitive or duplicating an existing one.

Do not import Signal 2000 concepts such as CHIPS, Signal, Hidden Pocket, Overcharge, exact rarity policy, pouch geometry or Y2K presentation into generic contracts.

When extracting from a project, carry over or recreate focused tests that prove the reusable behavior. Record the original source revision and any intentional semantic changes in the PR description or nearby docs.

## Public API documentation is part of the implementation

Every exported reusable utility or subsystem must have focused explanatory documentation linked from `docs/API.md`.

For a new or materially changed public API, the same workstream must document:

- what problem the utility solves;
- the supported import path and public API;
- a normal usage example;
- lifecycle/semantic guarantees where relevant;
- what the utility deliberately does **not** own;
- any framework/runtime/optional-peer requirements.

Do not make future agents reverse-engineer intended usage from implementation source, Signal 2000, PR history or chat context. If code changes the public contract, update its focused doc and the API index before considering the change complete.

Keep provenance/history docs separate from usage docs: provenance explains where and why a primitive came from; focused API docs explain how the current contract is used now.
