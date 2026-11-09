# Free reveals and a persistent hint budget

Import `HintBudget`, `getHintBalance`, `revealHint` and `creditHints` from `@danilah/mini-games-kit/core`. These are pure computations; there is no SDK or storage dependency.

The problem is information ownership: pressing Hint again after deselection, undo or reload should not spend another unit for information already revealed in that attempt. Earned hints can also survive starting a different puzzle.

```ts
import { getHintBalance, revealHint, creditHints } from '@danilah/mini-games-kit/core';

const freeLimit = rules.freeHintsPerAttempt;
const balance = getHintBalance(progress.hints, freeLimit); // { free, earned, total }
const result = revealHint(progress.hints, canonicalInformationKey, freeLimit);
if (result.accepted) {
  // Save result.budget with the board/attempt before presenting the reveal.
  // result.repeated and result.spentFromWallet describe the change.
}

// A verified bonus joins the earned balance; this call alone does not deduplicate it.
const credited = creditHints(progress.hints, projectRewardAmount);

// Starting another attempt resets ONLY attempt-owned information:
const nextAttemptHints = { wallet: credited.wallet, revealedKeys: [] };
```

## Guarantees and ownership

- A new information key uses the free allowance first, then one earned unit. An existing key is accepted free even if the total available for new information is zero. A denied new reveal changes nothing.
- `wallet` is a nonnegative safe integer. `revealedKeys` is a unique array of nonempty strings for the current attempt. Free limit and credit are nonnegative safe integers. Invalid values, duplicates and unsafe sums throw `RangeError`; codecs must repair legacy state explicitly.
- Functions never mutate their inputs. Repeated/denied reveals and zero credit preserve the original budget reference. New values are not durable until the consumer commits them.
- Include every successful new reveal in `revealedKeys`, including paid reveals. Persist the attempt's keys across undo/reload; reset them on an actual new attempt, not on every board redraw. Keep wallet shared across modes as the product requires.
- The consumer creates a bounded, stable information identity. For a pair puzzle this includes board identity and an unordered pair. Different information must not collide. An unknown/cancelled solver response has no useful reveal and must not call `revealHint` as a paid success.

`creditHints` deliberately grants on every call. For rewarded video use the existing [`DurableReceiptQueue`](../platform/DURABLE_RECEIPT_QUEUE.md): verify the receipt, persist credit plus deduplication identity in the same commit, then acknowledge native deletion. Do not add another ad receipt processor or keep the ledger only in animation state. See the shared-writer protocol in that document before composing ordinary saves with credits.

For old per-attempt bonuses, migrate the remaining earned portions into wallet once, retaining spent-information identities. Advance the migration/schema marker in the same durable snapshot. Never sum those old fields on every launch. The exact subtraction and handling of damaged attempts belong to the old game's codec; kit has no universal legacy schema. Newer/future schemas must not be silently overwritten by old readers.

No free quota, video bonus amount, hashing implementation, maximum task count, solver, purchase UI or reward schedule is a package default.
