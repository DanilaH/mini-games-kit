# Extraction source

Initial reusable code is being extracted from `DanilaH/cases-yg` / Signal 2000.

Reference product revision before the first extraction work: `26598606c8b0e143c9c97961bcdd8e03fd37bc61`.

The durable pending transaction extraction was reviewed against the current Signal 2000 implementation after the reuse-policy alignment pass (`93355df95626b476b74d97d448c91a3ca5789893`), primarily `src/game/systems/openingSession.ts`, `src/game/systems/save.ts` and `tests/opening-session.test.ts`.

The source game remains the behavior reference. Generic contracts may improve naming, harden failure handling and remove project-specific policy, but any migration back into Signal 2000 must preserve its gameplay, economy, input geometry and established presentation behavior unless explicitly reviewed as a separate product change.

The shared durable-transaction kernel intentionally strengthens one edge case beyond the source implementation: after a write becomes ambiguous and the immediate recovery reload also fails, further mutations are blocked until a successful authoritative `load()` occurs. This closes the possibility of rerolling/reapplying while durable truth is still unknown.
