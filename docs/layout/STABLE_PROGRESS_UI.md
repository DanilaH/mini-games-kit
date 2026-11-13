# Progress UI without layout jumps

Production acceptance recipe from Seeds 1.1; no exported CSS component or new layout runtime.

Keep the icon/label, numeric counter and earned indicator in distinct semantic elements. A count going from one to several digits must not move the action label to another row. Use deliberate flex/grid columns, tabular numerals and bounded wrapping; a permanent badge slot can preserve geometry when earned state appears. Numeric size assumptions are per project: test the actual maximum, not just zero and nine.

For a filling collection meter, the percentage and earned badge occupy stable space. A word appearing at 100% must not push the header, board or action row. Keep following-goal information in its own block. Reserve result metadata even when a reward line changes; keep Continue available while presentation is cancelled or skipped.

Native `input[type=time]` needs its own intrinsic dimensions. A global fixed input height/width can clip the browser's hour/minute/AM-PM segments even while its outer rectangle fits. Allow height to grow, prevent unwanted shrinking and wrap the containing settings row at enlarged text sizes. Validate the actual control, not only a string matching HH:mm.

## Acceptance matrix

| Transition | Check |
| --- | --- |
| Hint allowance/earned balance: 0, 1, 9, 10 and maximum | Label baseline and hit target stay stable; long counts remain visible |
| Collection 99% → 100% → next object | Header/action/board bounds do not jump; earned badge stays readable |
| Tier immediately before/at/after threshold | One main reward, clear earned marker, following target and remaining amount |
| Save pending → saved/error/retry | No false receipt; recovery message does not cover Continue |
| Time control in 12/24-hour locales | Hour, minute and AM/PM are fully visible and editable |
| Narrow portrait, short landscape and tablet; text 150% | Essential controls remain reachable; scrolling stays in the intended region |
| Background/navigation/rotation during celebration | Final durable total survives, owned effects disappear, no stale callback starts a new effect |

Use before/after element bounds plus actual screenshots. Internal time-input segments may require browser shadow-tree inspection or native/device screenshots; a passing DOM overflow scan is not sufficient. Preserve [banner reservation and native safe-area geometry](NATIVE_BANNER_PLACEMENT.md) while fixing composition. Repeated success messages should not cause a screen reader to announce decorative content twice.

See [donor revisions and tested source flows](../extraction/SEEDS_110.md). Text, badge design, transitions and CSS selectors remain consumer-owned.

## Critical actions in the initial viewport

Seeds 1.1.2 found actions that tests could reach only after Playwright silently
scrolled them into view. The accepted correction separated pinned actions from
scrollable explanations, result details and optional decorations.

1. Open a screen in its initial scroll position and wait only for intentional
   layout/font settling. Inspect all essential controls **together**, before
   `scrollIntoViewIfNeeded`, locator click/tap/focus or keyboard navigation.
2. Check complete bounds inside the viewport and clipping ancestors, then hit-test
   center and interior corners. A bounding box alone misses overlays and clipping.
   After inspection use raw coordinate taps/clicks and assert the intended action.
3. Let details scroll independently; keep the result continuation, dismiss/cancel,
   save recovery and relevant game actions visible. On short landscape, a control
   row spanning both columns may fit better than a scrolling sidebar. Measure
   actual rendered labels; a width breakpoint alone misses Android text zoom.
4. On a short result, reduce/remove the illustration before hiding statistics or
   continuation. Use equal statistics columns with wrapping inside each column,
   and test the group's center and number baselines. Keep state readable without
   color alone and disabled boundary choices explicit.

An opt-in Playwright **test helper**, not a package export:

```js
import { assertInitialActions } from './tools/critical-actions-check.mjs';
const targets = await assertInitialActions(page, ['#continue', '#cancel'], {
  minimumCssSize: projectMinimumTargetCss,
}); // no scrolling or interaction
for (const {rect} of targets) {
  await page.mouse.click(rect.x + rect.width/2, rect.y + rect.height/2);
  // Assert the expected state after each action; reopen the screen as needed.
}
```

Choose only enabled, essential actions for that state. The minimum is a consumer
CSS setting, not an automatic dp conversion. The helper rejects missing/ambiguous
selectors, hidden/disabled controls, clipped edges and intercepted hit points.
It checks axis-aligned DOM rectangles; text glyph clipping, arbitrary shapes,
canvas semantics, native overlays and TalkBack still need separate inspection.
Do not copy the example's sequential clicks when the first click replaces the screen.

`npm run test:browser` exercises narrow/tall/short-landscape/tablet fixtures, 100%
and 200% text, inset changes, coordinate clicks and deliberately broken controls.
Its screenshots/report are in `.test-output/ui-acceptance/`. It is evidence for
the QA helper and layout pattern, not acceptance of every game using the kit.

## Saved completion and presentation

Decide the semantic result from actual completion order and group membership,
not a task number divisible by a group size. Completing a group out of order must
still be recognized; replaying an already completed group must not replay its reward.
Group sizes, result artwork, sound and haptic profiles remain consumer-owned.

Keep Continue enabled during presentation. Use the [tier presentation contract](../core/TIER_PROGRESS.md#presentation-recipe)
for saved-state ownership, finite motion and cleanup. Capture the pending milestone
identity before waiting for its write. Retain it until confirmation or an explicit
stale-presentation drop policy; a visual timer must not accidentally erase it.
If an old celebration is intentionally dropped, keep the static earned state and
continuation truthful. Test delays beyond the visual timer as well as short delays.
After navigation, background or replacement, obsolete completions cannot restart
particles/sound/haptics. Reduced motion shows the static saved outcome.

Consumer acceptance must include: pending/failed save (no earned celebration),
slow successful save, retry once, duplicate callback/reopen, completion out of
order, navigation during saving/animation, reduced motion, and visible continuation
plus statistics at enlarged text. Use the actual source's save and presentation
paths; a toy promise test does not prove the application's ownership boundary.
See [Seeds 1.1.2 evidence](../extraction/SEEDS_112.md).
