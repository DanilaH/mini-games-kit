# Agent contract — __PROJECT_NAME__

**Target platform:** __PROJECT_PLATFORM__ · **Guidance snapshot pin:** __MINI_GAMES_KIT_REF__ · **Runtime kit dependency:** record separately if installed

## Do this before a material task (without being reminded)

1. Read this file and docs/PROJECT_DECISIONS.md; inspect the **actual code, repo HEAD, current game version, active branch**, and latest accepted build. Old README/experiment notes cannot override proven current source or the owner's newest request.
2. Open docs/kit-guidance/TASK_ROUTER.md and select the **one or two applicable research/playbook routes** by the user’s present task. Read the selected **pinned kit** documents, their independent audit if evaluating uncertain claims, and any code contract needed. Do **not** read or apply every framework topic on simple bugfixes.
3. If the task refers to another game, screenshot, video, GIF or says “as in the original”, follow docs/kit-guidance/REFERENCE_PROTOCOL.md **before** redesigning or modifying gameplay. Separate observed frame/input sequence from inferred internal algorithms and unavailable evidence.
4. Before introducing a reusable helper, inspect the relevant public APIs in mini-games-kit at the **actually installed runtime dependency pin** (if any). Guidance/docs may be newer than runtime. Reuse correct primitives; don't copy kit code into local source or silently upgrade its version. Record selected imports, intentional differences and game-owned policy in docs/PROJECT_DECISIONS.md.
5. Implement the **smallest evidence-backed change** and verify true behavior with source-specific tests: accepted inputs, rule/save integrity, presentation, device/viewport, SDK errors and regression as applicable. Test/CI proves engineering behavior, not human pleasure, accessibility, market success or revenue.
6. At the end of each **substantial implementation**, explicitly report **KIT IMPACT** as NONE / REUSE / IMPROVE / CANDIDATE / EXTRACTED using docs/kit-guidance/KIT_FEEDBACK_LOOP.md. For a reusable bug/feature, show an exact source path/reproducer, target kit API and why upstream matters. Do not automatically modify other consumer repos or upstream kit without a reviewed change.
7. End with: actual changes; tests and honest gaps; decisions needing owner approval; kit impact. Avoid long copied checklists unless the task is an independent audit.

## Source-of-truth and boundaries

- **Project rules, content, RNG, level banks, art, economy, ad frequency and save schema are consumer-owned.** The kit exports infrastructure and optional methods, not a universal gameplay director or theme.
- Preserve durable progress, saved content IDs, exact-once rewards, ad SDK lifecycle, input parity, deterministic replay and installed signatures unless a specific approved migration is required.
- External reference is an observed product, **not source code or an asset library**. Reproduce interaction principles with original art/audio and explicit differences.
- Development/demo ads, emulator screenshots and synthetic bots cannot prove live payouts, physical-phone performance or retention.
- No automatic store submission, payment, paid ads, outreach, mass asset generation, owner art approval or silent gameplay/economy changes.
- If pinned kit documents are inaccessible, mark NOT READ and explain what can be verified locally; do not claim automatic access. If a fix only changes one local UI element, no new architecture or research framework required.

## Local entry points

- Task selection: docs/kit-guidance/TASK_ROUTER.md
- Gameplay/reference comparison: docs/kit-guidance/REFERENCE_PROTOCOL.md
- Upstream reuse/reporting: docs/kit-guidance/KIT_FEEDBACK_LOOP.md
- Project decisions, actual versions and deliberate deviations: docs/PROJECT_DECISIONS.md
- Research and discovery snapshot: https://github.com/DanilaH/mini-games-kit/blob/__MINI_GAMES_KIT_REF__/docs/API.md (for actual imports, verify the installed runtime SHA separately)

For project-specific scripts/build commands add a concise tested section here or in README; keep AGENTS short rather than duplicating the entire research library.
