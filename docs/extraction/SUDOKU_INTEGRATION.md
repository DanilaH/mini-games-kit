# Sudoku extraction implementation and integration boundary

This pass adds `RevisionSnapshotQueue` and `resolveNativeBannerPlacement`; usage contracts are linked from API.md. It does not change the released Sudoku APK or introduce a second profile/cloud engine.

## Reuse the receipt implementation already being extracted from Seeds

At inspection time `extract/seeds-production-practices` contains `DurableReceiptQueue` in `src/platform/durable-receipt-queue.ts`, plus `docs/platform/DURABLE_RECEIPT_QUEUE.md` and `docs/android/ADS_AND_LIFECYCLE.md`. Do not introduce a duplicate queue here. That branch's runtime API is not promised by this branch before it lands in main.

The reviewed contract fits Sudoku's external SDK receipt: commit receipt effect + deduplication marker atomically, then acknowledge that exact receipt; serialized deliveries recover after a failure. The adapter owns durable deduplication, not the queue's in-memory lifetime. This complements DurablePendingTransactionSession, which handles locally staged actions; it does not replace an SDK-earned receipt with a locally generated reward.

For a future Sudoku/native consumer:
1. Pin a kit revision containing the receipt implementation after its integration. Do not depend on a moving branch.
2. A receipt needs stable ID plus profile ID, session/target ID, reward type and amount/version as appropriate to the game. Validate native payloads. Resolve the addressed profile rather than the currently open screen.
3. Commit atomically to that profile's durable storage; return applied/already-applied only when durable truth proves it. On ambiguous failure, retain receipt and reload/reconcile before retrying. Do not acknowledge an unknown profile/session as though it was granted; define an explicit terminal policy for removed targets.
4. Only then ack the exact native receipt. ack failure leaves it recoverable; next delivery must not re-grant.
5. Native callback and final show result may report the same ID. Feed both through the same serialized handoff. Run pending-journal recovery at startup before a conflicting new reward.
6. Account changes and background transitions must not retarget outstanding writes. Flush ordinary state before the transaction and route all storage work through one coordinated writer. A separate transaction writer racing a snapshot queue can overwrite rewards even if both are individually correct.

Source shortcomings that must not become a reusable guarantee: native journal commit failure currently logs and still notifies JS; a crash then can lose the receipt. Last-reward-ID is not a permanent deduplication ledger. Source gameId alone does not provide multi-account isolation. A production adapter must address these cases and retain crash/retry tests; the generic queue cannot fix an unreliable producer or storage adapter.

## Consumer check performed

A temporary integration probe in the actual Sudoku repository imported the extracted queue, used its real initialState/newGame/input/openHint/withGame/validateState functions and bank entry, persisted coalesced snapshots and restored entries, undo history and opened-hint cache. The restored revision became the fresh queue's baseline. Passed on 2026-10-23. The probe was removed afterward to avoid leaving a sibling-checkout dependency in Sudoku's normal tests.

Kit runtime/type/build tests exercise the portable APIs. Real native banner rendering remains evidence from the original 0.17 implementation, not proof that the new helper has been deployed. Future consumer integration must run the Android orientation/process-death tests again.

## Remaining planned extraction

Profile orchestration, catalog/daily selectors, stats aggregation and hint-cache policy remain specifications in SUDOKU_017.md until a real second consumer determines their domain contracts. No Sudoku State/schema, CSS skin, SDK keys, signing materials or bank contents were copied into kit.
