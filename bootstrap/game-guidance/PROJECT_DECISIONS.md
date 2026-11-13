# Project Decisions — __PROJECT_NAME__

**Target platform:** __PROJECT_PLATFORM__  
**Guidance snapshot SHA:** __MINI_GAMES_KIT_REF__  
**Installed runtime mini-games-kit dependency SHA (if any):** NOT INSTALLED / UNKNOWN / exact SHA  
**Status:** INITIAL / PROTOTYPE / PREVIEW / RELEASED / MAINTENANCE (choose based on actual evidence)  
**Source of truth:** newest owner-approved product decisions and actual code/build; this document is updated as changes become real.

## Exact project facts (not guessed from another game)

- Repo HEAD, branches, app/versionCode, content/rules/save versions:
- Public release/store account actual status, source links:
- Real target platforms and device/orientations:
- Core player action and repeatable payoff:
- What **must not** change without owner approval:
- Baseline build/test commands and last passing source SHA:

## Core and state architecture

- Core gameplay rules, available moves, scoring, failure/recovery:
- RNG and generator, reproducibility/versioning:
- Durable vs presentation state, save migration, completion:
- Main input methods, gesture alternatives, error/Undo:
- Input/lifecycle source of truth (DOM/Phaser/native):

## Kit adoption — update before inventing common functionality

| Needed capability | Pinned kit contract/API | Decision: REUSE / NOT APPLICABLE / PROJECT POLICY / MISSING | Tests / rationale |
| --- | --- | --- | --- |
| Startup, viewport, activity and pause | | | |
| JSON snapshots / receipts / durability | | | |
| UI, continuous input, feel, sound/haptics | | | |
| Android/Yandex platform and advertising | | | |
| Assets, loading/performance, QA | | | |

- Installed runtime dependency pin (may differ from newer guidance) and intentional upgrade decision:
- Source-specific deviations from a mandatory bootstrap:
- Provenance and tests for code extracted from an existing game:

## Reference register — only when original/reference supplied

| Reference URL/file/timecode + device/version | OBSERVED / INFERRED / NOT INSPECTED | Desired behavior and original differences | Our build + test | Decision |
| --- | --- | --- | --- | --- |
| | | | | |

Read the local REFERENCE_PROTOCOL before claiming parity. No copyrighted source art/audio/code transfer.

## Chosen research directions for current product problems

| Observed problem/request | Router topic and pinned docs actually read | SELECT / HOLD / REJECT | Minimal hypothesis and negative test | Final outcome |
| --- | --- | --- | --- | --- |
| | | | | |

Do not fill this with all studies every task. Record only decisions that matter to current or recurring work; avoid procedural documentation debt.

## Visual / content / platform release boundaries

- Approved visual direction, actual approval source, Art Bible if applicable:
- Asset production policy and source/master provenance:
- Content bank, player skill/novelty and release IDs:
- Real store listing/monetization/analytics and live acceptance:
- Native/Android device checks, screen-reader limitations, physical evidence:

## UI profile — fill only as choices become real

- Existing component/token source; roles for color, type, spacing and icons:
- Main actions and truthful states in the affected screens:
- Motion choices for press, selection, drag/release, panels and rewards; frequent-action limits:
- Cancellation/reduced-motion behavior and deliberate exceptions:
- Comparable screen/transition evidence at actual target sizes:

Keep project values here or link the existing Art Bible/style source. The kit supplies contracts and optional recipes; it does not prescribe one theme or global animation duration.

## Kit feedback / upstream proposals (non-automatic)

| Local commit and evidence | Kit current API or new candidate | NONE / REUSE / IMPROVE / CANDIDATE / EXTRACTED | Second consumer evidence if new API | Owner decision / kit PR |
| --- | --- | --- | --- | --- |
| | | | | |

For a generic bug in an existing kit API a single independent reproduction can justify improvement. For a new generic primitive prefer two genuine consumers; do not force every local feature upstream.

## Next verified milestone and stop condition

- Highest-priority one or two tasks:
- Exact baseline and proof needed:
- HOLD or NO CHANGE conditions:
- What was NOT verified (phone, users, live ads, store, bank):
