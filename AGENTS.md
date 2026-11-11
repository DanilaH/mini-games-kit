# mini-games-kit agent contract

This repository is an experimental reusable kit for small games. It exists to preserve expensive production work without turning one game's architecture into a speculative framework.

## Mandatory new-project bootstrap

For every **new Yandex Games project using Phaser**, start from `bootstrap/yandex-phaser` before project-specific implementation. Do not cherry-pick only the convenient files. Use `npm run bootstrap:create -- <destination>` so the generated project pins an exact `mini-games-kit` commit.

After bootstrapping, independently inspect the current repository starting from `docs/API.md` and add any other reusable primitives that fit the new game's requirements. The bootstrap is the mandatory minimum, not a substitute for reviewing the rest of the kit.

A consumer may replace/remove bootstrap behavior when the new project genuinely needs a different contract, but that deviation must be explicit and evidence-backed in the generated project's `docs/PROJECT_DECISIONS.md`.

## Visual direction and visual UX preproduction

For **new games**, after establishing a viable gameplay prototype but **before mass UI/asset creation**, follow [docs/visual-preproduction/AGENT_PROTOCOL.md](docs/visual-preproduction/AGENT_PROTOCOL.md). Propose 2–3 cohesive visual concepts for the SAME game states, each including setting (including none), mascot (including none) with an explicit job, actual gameplay/layout composition, art-production cost, and app-icon/store identity. Show visual comparisons and request owner approval; do not declare a style approved yourself. Record the decision and approved Art Bible in the **consumer** project. For repairs to an existing approved UI, preserve the current direction unless a redesign is explicitly needed; do not restart preproduction as scope creep. The kit does not prescribe the mascot, theme, or palette.

## Store listing, ASO and conversion preproduction

When a game is preparing for a **specific** store release or a major listing redesign, consult [docs/store-presence/AGENT_PROTOCOL.md](docs/store-presence/AGENT_PROTOCOL.md), [current store rules](docs/store-presence/PLATFORM_REQUIREMENTS.md) and [independent evidence audit](docs/store-presence/INDEPENDENT_AUDIT.md). Keep one verified gameplay/visual master and export/translate only for **real target stores**, not automatically every store. Store screenshots depict the actual released product; all claims are supported by the game build. Store page compliance, creative suitability and measured conversion are separate evidence levels. Present creative direction for owner approval; **do not upload, submit, publish, change live storefront assets or run paid acquisition** without explicit owner authorization. This is documentation; no new ASO runtime subsystem is mandated.

## Organic discovery and launch (only when a real release or distribution problem exists)

For an actual store launch or a diagnosed shortfall in discovery, consult [Organic Discovery & Launch](docs/store-presence/ORGANIC_DISCOVERY_LAUNCH_2026-11-11.md) and its [independent audit](docs/store-presence/ORGANIC_DISCOVERY_INDEPENDENT_AUDIT_2026-11-11.md). Copy the [launch brief](docs/store-presence/LAUNCH_BRIEF_TEMPLATE.md) into the **consumer** only when useful. First verify real store/account/region/payment eligibility, then distinguish search, recommendations, editorial and external traffic; treat clicks, installs, first play and retention as different metrics. Unknown low-volume results justify HOLD. Do not assume a universal new-app ranking boost, submit to stores or contact editors/creators without owner authorization. No new acquisition subsystem in the kit is required.

## Puzzle game design research: selection is required, implementation is not

When asked to audit or improve a game's retention, challenge, experience, novelty, progression or advertising UX, consult [docs/puzzle-design/PROJECT_SELECTION.md](docs/puzzle-design/PROJECT_SELECTION.md). Record which research directions are **SELECT / HOLD / REJECT** in the **consumer's** docs, with a concrete problem, evidence, expected cost and test. Choosing no optional direction is valid; do **not** create a universal Director, add retention mechanics, or modify kit APIs merely because they appear in a study. Read only selected topic reports and [the independent evidence audit](docs/puzzle-design/INDEPENDENT_EVIDENCE_AUDIT_2026-11-11.md). These documents are dated snapshots, not live claims about another game's release status. Product rules, economy, and ad cadence remain consumer-owned.

Before changing kit code:

1. Identify the real source project and concrete production behavior being preserved.
2. Separate reusable mechanism from project policy, naming, balance, content and aesthetics.
3. Prefer small semantic APIs over scene/framework abstractions.
4. Keep gameplay/durable state independent from presentation.
5. Preserve deterministic lifecycle cleanup and repeated-use performance.
6. Treat `0.x` APIs as experimental: new real consumers may change them.
7. Start public-surface discovery from `docs/API.md` before adding a new primitive or duplicating an existing one.

Do not import Signal 2000 concepts such as CHIPS, Signal, Hidden Pocket, Overcharge, exact rarity policy, pouch geometry or Y2K presentation into generic contracts.

When extracting from a project, carry over or recreate focused tests that prove the reusable behavior. Record the original source revision and any intentional semantic changes in the PR description or nearby docs.

## First-time player experience research — only with a witnessed problem

When a game's cold start, onboarding or early enjoyment is in question, consult [FTUE Diagnostic Protocol](docs/puzzle-design/FTUE_DIAGNOSTIC_PROTOCOL_2026-11-12.md) and [its independent evidence audit](docs/puzzle-design/FTUE_INDEPENDENT_EVIDENCE_AUDIT_2026-11-12.md), then optionally copy [FTUE Playtest Record](docs/puzzle-design/FTUE_PLAYTEST_RECORD_TEMPLATE.md) into the **consumer**. Compare genuine cold starts, novice vs mechanic-experienced users, accepted actions, causal feedback, unassisted rule transfer and voluntary continuation. Never infer fun from tutorial completion or impose 30s/3m/15m time constants, mandatory tutorials, fake first wins or extra analytics without evidence. For durable onboarding, reuse [Event-driven onboarding playbook](docs/ONBOARDING_PLAYBOOK.md). HOLD/NO CHANGE is a valid outcome.

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
