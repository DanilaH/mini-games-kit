# Sudoku extraction implementation and integration boundary

This pass adds `RevisionSnapshotQueue` and `resolveNativeBannerPlacement`; usage contracts are linked from API.md. It does not change the released Sudoku APK or introduce a second profile/cloud engine.

## Reuse the receipt implementation already being extracted from Seeds

The combined API exposes [`DurableReceiptQueue`](../platform/DURABLE_RECEIPT_QUEUE.md) alongside the snapshot queue and [`native banner geometry`](../layout/NATIVE_BANNER_PLACEMENT.md). Use the [Android lifecycle specification](../android/ADS_AND_LIFECYCLE.md) for SDK integration. Do not introduce another receipt queue or banner coordinate contract. This integration is available on a kit revision containing both extractions; pin that revision rather than assuming a moving branch has landed.

The reviewed contract fits Sudoku's external SDK receipt: commit receipt effect + deduplication marker atomically, then acknowledge that exact receipt; serialized deliveries recover after a failure. The adapter owns durable deduplication, not the queue's in-memory lifetime. This complements DurablePendingTransactionSession, which handles locally staged actions; it does not replace an SDK-earned receipt with a locally generated reward.

For a future Sudoku/native consumer:
1. Pin a kit revision containing the receipt implementation after its integration. Do not depend on a moving branch.
2. A receipt needs stable ID plus profile ID, session/target ID, reward type and amount/version as appropriate to the game. Validate native payloads. Resolve the addressed profile rather than the currently open screen.
3. Commit atomically to that profile's durable storage; return applied/already-applied only when durable truth proves it. On ambiguous failure, retain receipt and reload/reconcile before retrying. Do not acknowledge an unknown profile/session as though it was granted; define an explicit terminal policy for removed targets.
4. Only then ack the exact native receipt. ack failure leaves it recoverable; next delivery must not re-grant.
5. Native callback and final show result may report the same ID. Feed both through the same serialized handoff. Run pending-journal recovery at startup before a conflicting new reward.
6. Account changes and background transitions must not retarget outstanding writes. Quiesce ordinary producers, flush their accepted state, commit through an exclusive writer, then rebase the ordinary snapshot queue from authoritative durable state before reopening producers. Flush alone is not a lock, and an old queue may accept a pre-reward revision with stale contents after the reward write. Follow the [combined storage protocol](../platform/DURABLE_RECEIPT_QUEUE.md#combining-with-revision-snapshot-saves); a separate transaction writer racing a snapshot queue can overwrite rewards even if both are individually correct.

Source shortcomings that must not become a reusable guarantee: native journal commit failure currently logs and still notifies JS; a crash then can lose the receipt. Last-reward-ID is not a permanent deduplication ledger. Source gameId alone does not provide multi-account isolation. A production adapter must address these cases and retain crash/retry tests; the generic queue cannot fix an unreliable producer or storage adapter.

## Consumer check performed

A temporary integration probe in the actual Sudoku repository imported the extracted queue, used its real initialState/newGame/input/openHint/withGame/validateState functions and bank entry, persisted coalesced snapshots and restored entries, undo history and opened-hint cache. The restored revision became the fresh queue's baseline. Passed on 2026-10-23. The probe was removed afterward to avoid leaving a sibling-checkout dependency in Sudoku's normal tests.

Kit runtime/type/build tests exercise the portable APIs. Real native banner rendering remains evidence from the original 0.17 implementation, not proof that the new helper has been deployed. Future consumer integration must run the Android orientation/process-death tests again.

## Cross-extraction review (2026-10-23)

Reviewed Sudoku extraction commit `5450f9d` together with Seeds PR #14. The modules own different boundaries: ordinary complete snapshot coalescing, native geometry math and external receipt delivery. They share no save schema or application balance. Portrait bottom and landscape side/bottom banner placements are consumer layout choices using the same geometry API.

Added executable cross-queue coverage in `tests/receipt-snapshot-integration.test.ts`: a slow ordinary write is drained before reward commit; stale producers are rejected after rebasing; acknowledgement failure preserves the rewarded baseline through later ordinary saves and duplicate delivery; ambiguous reward writes keep ordinary mutation blocked until recovery. These tests use both real kit queues with a controlled single-profile storage adapter; they do not claim native SDK or profile switching coverage.

The existing Sudoku CI fix (Node 20.19.0 with pinned npm 11.9.0) is retained, replacing the redundant Seeds-branch Node 24 workaround. The two extraction indexes and source histories are preserved together.

## Remaining planned extraction

Profile orchestration, catalog/daily selectors, stats aggregation and hint-cache policy remain specifications in SUDOKU_017.md until a real second consumer determines their domain contracts. No Sudoku State/schema, CSS skin, SDK keys, signing materials or bank contents were copied into kit.
