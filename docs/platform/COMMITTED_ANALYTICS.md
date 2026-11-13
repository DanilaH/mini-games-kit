# State-changing analytics after a successful save

Integration recipe from Seeds 1.1.2, **not a new public queue or SDK adapter**.
Use the existing single save writer / `RevisionSnapshotQueue` for state and the
existing `AnalyticsAdapter` transport boundary. Analytics delivery is a separate
operation from `DurableReceiptQueue`'s valuable reward commit/ack protocol.

## Ownership and ordering

1. Assign the gameplay attempt a stable identity. Meaningful first input marks
   start; screen open/resume is a separate event. Start and completion carry the
   same attempt identity. Task IDs, event names and cohort policy belong to the game.
2. If durable milestone reporting is needed, stage a small bounded journal in the
   **same candidate snapshot** as the completion/start marker. Capture an independent
   list of that snapshot's event IDs before submitting it to the single writer.
3. Publish only the events belonging to the exact snapshot whose write succeeded.
   An event existing in mutable memory is not permission to send it. A failed write
   sends no completion; a successful retry may publish the retained event.
4. Keep stable event IDs across replay, bound the outstanding journal and coalesce
   successfully saved snapshots while a bridge is slow. Retry in the background;
   timeout/failure cannot block play or saving. Ignore obsolete attempt callbacks.
5. Remove acknowledged IDs through the coordinated save path. A crash between SDK
   acceptance and journal cleanup can replay an event, so local/native deduplication
   must use the same ID and have an explicit retention policy. Do not rely on a
   process-local Set as crash-proof deduplication.

A native bridge accepting an event generally means **local SDK enqueue**, not
server delivery. Best-effort SDK delivery, finite local deduplication and replay
are not globally exactly-once telemetry. Loss beyond a bounded journal/ledger is
an explicit trade-off. Do not use analytics events as authoritative reward receipts.
Keep ad callback telemetry separate from state-changing gameplay milestones.

## Required consumer checks

| Case | Expected result |
| --- | --- |
| Staged milestone, write pending or failed | No milestone sent to the SDK |
| Successful write followed by send failure | Saved event retained for a later eligible retry |
| Newer in-memory state while an older write completes | Only IDs captured by the successful snapshot are eligible |
| Duplicate snapshot, app restart before cleanup | Stable IDs reach the consumer's dedup boundary; no new completion identity |
| Never-resolving/late native report | Bounded outstanding work; play/save remain available |
| Retry/restart on the same attempt | Start/completion remain linked; no new completion from reopening a screen |
| Native whitelist/configuration mismatch | Contract check fails visibly; no claim of dashboard delivery |

The donor uses `src/analytics.ts::CommittedAnalytics` and publishes from
`src/main.ts::save` only after `platform.saveState` succeeds. `game_complete` now
includes `attempt`. Source and test scope: [Seeds 1.1.2 follow-up](../extraction/SEEDS_112.md).
The class remains a **candidate** for a portable queue: one real donor does not
justify another storage/telemetry subsystem. This recipe does not upgrade a game,
change its schema or fix historical analytics data.
