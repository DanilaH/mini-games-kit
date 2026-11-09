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
