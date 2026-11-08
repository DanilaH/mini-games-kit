# Puzzle assistance, presentation and acceptance: Water Sort additions

Source: `DanilaH/watery-water-sort@2f86c1eaa311e2da1de11f69d5df8b11f28e6c0d`. These are implementation/acceptance recipes, not exported inventory, solver, campaign or UI frameworks. They supplement [puzzle production](../PUZZLE_PRODUCTION.md), [Android lifecycle](../android/ADS_AND_LIFECYCLE.md), [performance](../PERFORMANCE_PLAYBOOK.md) and [release acceptance](../ANDROID_RELEASE_ACCEPTANCE.md).

## Help must remain useful across the whole player path

Water Sort originally recomputed a fresh winning DFS path for every hint. Individually legal answers reversed previous advice:25 of 80 historical configurations failed to finish under repeated advice. Preserve the remainder of one validated winning route while the player follows it. Before reuse, compare the exact current board **and rule state**; consume the route step only after accepting that exact action. Deviation, Undo, restart, changed entitlement or rule state invalidate it. Copy the input path; a rejected malformed/nonwinning route must not erase a valid one. Advisory routes never execute moves or own saved truth. Source: `src/core/hintRoute.ts`, `tests/hint-route.test.ts`, `docs/SCENARIO_PERFORMANCE_38.md`.

Run a scenario agent that repeatedly follows actual hint output until the terminal condition; a test asserting one legal first move cannot catch contradictory routes. Also test manual deviation, reload, multiple mechanic combinations and purchased extra capacity. Route witnesses prove reachability under tested rules, not optimality, enjoyable difficulty or a guaranteed runtime solver budget.

Keep `FOUND`, proven `UNSOLVABLE` and `UNKNOWN` distinct. A repeated state can have an exit; repetition count does not establish a dead end. A bounded search can report unknown. Announce no legal moves immediately; announce an otherwise cyclic dead position only on proof. Never debit for cancelled/failed/stale/useless analysis. For a paid useful reveal, define whether repeat requests are free and how its identity survives reload. Water Sort retains only the current purchased advice, not an unbounded archive.

## Hidden information is not the complete simulation state

Source: `src/core/knowledge.ts`, `visibleHint.ts`, `docs/HIDDEN_36.md`. Give assistance a player-visible information view. An omniscient solver may validate physical reachability offline, but must not select a player-facing recommendation using undiscovered content. Describe exploration honestly instead of promising an optimal route. Scope learned facts to content identity/version and preserve them across Undo/restart when the design represents human memory. Track stable element identities through moves and shuffles, not destination coordinates. Full-history replay cannot reconstruct every legitimately learned fact after history was undone; validation must preserve that distinction.

## Verified rescue transformations

Source: `src/core/assist.ts`, `shuffle.ts`, `session.ts`, `tests/assist48.test.ts`. For a shuffle/rescue operation, define game-specific invariants: complete element multiset/identities, fill counts, protected goals/frozen/completed objects, legal target board, changed position and a valid completion witness. Validate externally/worker-produced results before applying. Bind the result to request+attempt revision; cancel/ignore stale replies after navigation, Undo or other mutations. Timeout/unknown/cancel/failure preserves the charge. Persist accepted result and resource debit together. Shuffle need not generate free completed objectives; that is explicit game policy, never a generic assumption. The witness checker remains game-owned.

## Inventory, purchase and rewarded return

Source: `src/core/economy.ts`, `src/main.ts` (`buyBoost`, `offerPack`, `coinShop`, `watchForCoins`), `tests/browser/direct51.spec.ts`, `polish.spec.ts`.

| Starting condition | Accepted action and visible result |
| --- | --- |
| Resource in stock | Use the selected type directly; debit only when its useful effect commits |
| Empty stock, enough currency | Clearly identified price/quantity/type; one authorized purchase updates currency+that inventory atomically |
| Empty stock, insufficient currency | Offer currency reward; show current balance, exact gain, resulting balance and intended purchase |
| Reward earned and saved | Close/replace the old offer and return to the selected purchase proposal; do not automatically spend or use a charge |
| Closed/no-fill/error | No invented reward or purchase; usable retry/exit |
| Earned, game save not confirmed | Retain the receipt for recovery; another ad is not required |
| Reward save confirmed, ack failed | Funds remain confirmed; retry exact ack without crediting twice |

Keep each boost's type/stock/icon/price badges consistent. A hint and shuffle must not accidentally share a mutable counter. Revalidate price, availability and balance at purchase time. Rapid clicks/late callbacks must not create duplicate active purchases or revive a cancelled UI. A receipt has independent durable meaning; closing the shop cannot destroy it. Recovery should credit valid receipts against latest coordinated state without unexpectedly reopening a stale screen. Use the existing [receipt queue](../platform/DURABLE_RECEIPT_QUEUE.md), not another ledger abstraction.

Version the **meaning** of externally earned reward targets. If a future offer pays a different amount, old receipts still grant the amount they promised. Water Sort's fixed coins SKU is a source example, not a universal currency or price policy. Do not infer real-money billing from a soft-currency shop.

## Rebalanced content and replay-safe progression

Source: `src/core/session.ts`, `campaign.ts`, `progress.ts`, `economy.ts`, `tests/content-revisions.test.ts`, `docs/CAMPAIGN_54.md`.

- Separate stable level id, content version, attempt identity and save schema. Store campaign order separately where it can change.
- Continue and ordinary Restart can preserve the in-progress historical puzzle; explicit level selection can open the latest authored version. Define this distinction and keep the old content/rating data needed to support it.
- Evaluate historical best results against their own rule/content version. A new shortest-path threshold must not reinterpret an old recorded attempt silently.
- Persist the awarded high-water mark with currency/progression. Replay, Undo, presentation, migration or content replacement cannot repeatedly farm an already-awarded achievement. Water Sort rewards deltas of best stars by stable level id; another product can choose a different entitlement scope explicitly.
- Preserve unlocked/completed content through campaign reorder/extension. Do not confuse a save read failure with a corrupt save or absence of data; unavailable storage should not silently overwrite progress with fresh defaults.
- Independently verify finite catalog witnesses/score thresholds; audit physical duplicates modulo irrelevant color renaming and object permutations. A greedy bot success rate is diagnostic, not measured human difficulty. Test useful rescue from noninitial branches, not just whether it shortens the starting optimum.

## Feel has one continuous state and cancellable presentation

Use the [damped motion primitive](../feel/DAMPED_MOTION.md) for impulse-preserving movement. The game owns clamps/tuning, not the kit. Material shape, stream, receiving surface and settle should meet continuously in position/velocity; do not replace each phase with a newly initialized sine. Width/opacity can ease to zero with smooth endpoints; adjacent material bands should share one boundary. Render connected contours rather than independent antialiased pieces with visible internal seams. Stronger highlights are not a substitute for moving the depicted material. These geometry/material choices remain renderer-specific.

Drive sound/haptics from the corresponding **visible contact**, not independent delayed queues. One clock can overlap celebration text, stars, fountains and actions without making the player wait through each separately. If a frame skips across several decorative beats, choose a bounded catch-up/drop policy; do not fire every missed pulse on resume. Touch strength, palette, sample timbre and celebration durations require device listening/playtesting. Successful functional tests did not establish quality: the first procedural sounds and generic UI in Water Sort were rejected by the owner.

Bind transient effects to attempt/revision and ownership. Undo must remove the cancelled achievement's labels/particles/sounds; reusing an object cancels its old seal beats. Navigation/background/dispose remove overlays and stop owned audio/haptics. Do not replay old celebration on resume. Reduced motion conveys completion without animated displacement. Skipping settles counters to the already-owned value and preserves Continue. Reuse [value transfer](../core/VALUE_TRANSFER.md), [skip](../core/PRESENTATION_SKIP.md), [one-shot audio](../audio/ONE_SHOT_PLAYER.md) and existing activity reasons.

Before caching/sleeping, account for **every** active presentation: entry, reflow, waves, reveals, contact, return, UI state and finale. Water Sort slept after 260 ms entry while 480 ms reflow was unfinished; a real sprite-position test caught the overlap. Invalidate only changing objects, avoid caching moving geometry, and render the final frame before idle. Test cached versus uncached settled appearances and actual object transforms; calling a layout calculator during the assertion can accidentally finish the transition and conceal the bug. Do not globally increase DPR to hide seams without measuring decoded/backing pixels and frame cost.

## UI matrix and evidence

| Surface | Conditions to inspect in the actual runtime |
| --- | --- |
| HUD | Short/tall portrait, maximum counters, long text, centered title independent of wallet; exclusive tappable regions |
| Help dock | Each stock0/1/many, each price/quantity, enabled/disabled/working, useful dead-end help; matching icon and accessible name |
| Currency/purchase | Every boost type, shortage/exact funds, earned/closed/failed/save-pending reward; Back and reopening |
| Pause/preferences | Separate action hierarchy, nested return, visible close, safe top/bottom, enlarged text; help belongs near play |
| Outcome | 1/2/3 stars with unmistakably inactive stars, saved victory after reload/interruption; Continue survives skipped effects |
| Field transitions | Entry, added capacity/reflow, Undo, restart, shuffle, foreground return; intermediate and final geometry |
| Status/overlay | Notice above controls in correct stacking context; screen-wide decorative canvas cannot intercept input or inherit board clipping |
| Content/recovery | Historical attempt, new version selection, backup restore, inaccessible storage, interrupted valuable write |

Center content by its intended anchor, not equal-looking offsets beside asymmetric widgets. Make the requested object's target visual when possible instead of adding another explanatory label. Do not show contradictory mathematical/technical statuses to players. Restart confirmation is contextual product policy: normally useful against accidental destruction, potentially redundant at a proven dead end. A supported orientation is a product decision; do not require landscape merely because another game supports it.

For first entry, bind input and compute theme/font/geometry before revealing controls. Bound critical asset waits and provide a coherent fallback; late audio/optional SDK cannot strand Play. A synchronous layout flush is not evidence of an uncovered painted frame: retain the stricter [first-paint contract](../startup/STARTUP_RUNTIME.md). Test the first accepted tap under throttling and asset failures. An icon drawn for the store is not proof the same launcher resources reached the APK.

Capture real runtime screenshots and inspect both full-resolution and thumbnail forms. Keep raw frames separate from captioned/composited marketing images; a horizontal store composition can retain the complete portrait game without claiming landscape gameplay. Parameterize capture tooling paths/profiles rather than copying Water Sort's workspace paths or fixed emulator coordinates. GIF's 256-color palette can create misleading gradients/edges; use original PNG or lossless animated WebP when assessing material quality. Record actual capture timing and build/asset hashes; a DOM assertion can pass before a visible foreground frame is presented.

Use a manifest recording source revision, donor hashes, exact scenario/fixture, commands/results, environment and unresolved limits. See [consumer integration](WATER_SORT_INTEGRATION.md) for the extraction's own evidence. Automated flow tests do not establish pleasing sound, motor strength, live ad fill, physical-device frame pacing or store moderation.
