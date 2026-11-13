# mini-games-kit — agent contract

This experimental kit preserves repeatedly useful **production primitives, measured production lessons and opt-in research methods**. It must not become a universal game engine, an automatic director/monetization system or a warehouse of consumer-specific game policy.

## Every material task: choose the correct evidence, not every document

1. Identify **actual repository/branch/HEAD**, consumer source/version, current request, product owner decisions and what is already implemented. Do not trust stale README release claims.
2. Read [Task Router](docs/agent-workflows/TASK_ROUTER.md). Choose 1–2 relevant routes (or NONE for a small non-UI bugfix) and consult their real source/evidence audit. For any UI change, select the applicable UI route before implementation, use the game's approved components/tokens, and verify affected states; a small fix only needs its relevant section. Never install all design research, meta, ads, visual systems, analytics or new directors merely because a document exists.
3. If the task gives a reference game, screenshot, video or complaint «not like the original», follow [Reference Protocol](docs/agent-workflows/REFERENCE_PROTOCOL.md). **Inspect actual evidence**, distinguish OBSERVED / INFERRED / NOT INSPECTED and compare before/gesture/after, not only visual style. Do not copy third-party source code, branded assets or audio.
4. Before writing reusable code, inspect [Public API](docs/API.md) and the consumer's **exact pinned** dependency. Check for an existing solution. Keep project-specific balance, RNG, game content, art, store economics, ad cadence and save schema in the consumer.
5. After a substantial change, report real tests, unknowns and **KIT IMPACT**: NONE / REUSE / IMPROVE / CANDIDATE / EXTRACTED using [Kit Feedback Loop](docs/agent-workflows/KIT_FEEDBACK_LOOP.md). Existing common bug: fix with a reproducible consumer; new generic API: usually require two independent real consumer needs, not a hypothetical future game.

**Agent instruction verification:** run npm run guidance:doctor -- <consumer-path> --strict after generation or adoption, then smoke-test the actual harness by asking for instruction sources, selected task route and pinned runtime API. Claude Code uses a small CLAUDE.md bridge; Codex reads AGENTS.md; Copilot depends on client. Doctor only checks local files/refs and never upgrades a running game.

## Repo setup and platform boundaries

- **New Yandex Games + Phaser game:** mandatory tested [bootstrap/yandex-phaser](bootstrap/yandex-phaser/BOOTSTRAP.md). Use npm run bootstrap:create -- <destination> from reviewed kit SHA, then typecheck/test/build and appropriate hosted draft checks. It copies tested Yandex runtime plus the local task/reference/kit-feedback guides.
- **Android/RuStore or other host:** this repo does NOT yet have an equivalent verified Android/Capacitor runtime bootstrap. Use npm run guidance:init -- <destination> --platform android to set up **guidance only**, then a tested Android game-specific scaffold and [Android Ads](docs/android/ADS_AND_LIFECYCLE.md)/[release acceptance](docs/ANDROID_RELEASE_ACCEPTANCE.md). Never treat Yandex Games web SDK as Android Mobile Ads.
- Existing consumer AGENTS and project decisions are source-of-truth: don't overwrite them. Keep kit runtime dependencies and research guidance snapshots at **separately recorded exact commits**; existing consumers may need newer studies while retaining old runtime APIs. Upgrades are reviewed, never silent.
- [New Project Setup](docs/agent-workflows/NEW_PROJECT_SETUP.md) explains all modes, what is actually installed and how to select optional kit imports.

## Changes to the public kit

Before adding or changing an export:
- Identify real source consumer and exact provenance; preserve semantic contract, deterministic cleanup/repeated use, errors/timeout/recovery and tests. Fix the bug at the right layer instead of copying a consumer scene.
- Prefer small reusable semantic modules over frameworks and policy engines. Don't import Signal 2000 story concepts, unique rewards, rarity/geometry or other game-specific aesthetic/business logic into common APIs.
- Write focused tests AND a focused public usage document with normal example, guarantees/non-goals, accepted import path and platform dependencies; link from docs/API.md in the **same change**. [Contributing](CONTRIBUTING.md).
- Keep original consumers pinned and test deliberate adoption/migration rather than silently changing all other games. Documentation-only methodology changes do not grant permission to modify applications.

## Owner approval and honest verification

- New large visual direction/mascot: use routed Visual Preproduction and **owner approval** before mass asset work. Existing approved UI keeps its identity unless a documented defect calls for a targeted fix.
- Store metadata/publication/paid acquisition, contractual or financial changes, platform submissions and unverified account operations require owner authorization. Compiled builds, mock SDKs, screenshots and bots cannot prove live ads, public store ranking, human fun, accessibility, retention or publisher payout.
- For small fixes keep work focused; for major changes use reproducible baseline, comparison, independent tests/actual phone as needed, explicit limitations and a clear HOLD/REJECT option.
- No source claim from an unread reference, inaccessible document or outdated market rule. If pinned evidence unavailable, say so.

**Definition of done:** precise change + evidence/test scope + realistic next action + kit impact. Avoid giant summaries of all research when the user asked for one concrete fix.
