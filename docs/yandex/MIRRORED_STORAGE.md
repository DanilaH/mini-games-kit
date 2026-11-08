# `YandexMirroredStorageAdapter`

Import from `@danilah/mini-games-kit/yandex`.

## What it is

A local-first storage wrapper that mirrors one selected key to Yandex Player Data while leaving conflict policy entirely in the game.

## Public API

```ts
const storage = new YandexMirroredStorageAdapter(localStorageAdapter, player, {
  syncKey: 'game.save',
  cloudField: 'gameSave',
  reconcile: (localRaw, cloudRaw) => chooseNewestRevision(localRaw, cloudRaw),
  shouldMirror: (raw) => !JSON.parse(raw).pendingTransaction,
  onError: (operation, error) => console.warn(operation, error),
});
```

Reads load local and cloud copies, call `reconcile(local, cloud)`, refresh the local cache when cloud wins, and best-effort repair cloud when local wins and `shouldMirror` allows it.

`preferCloudCopy` is provided only for games where cloud is intentionally canonical and no domain-specific freshness comparison is required.

## Why policy is injected

Signal 2000 compared `totalOpens` and deliberately kept pending reveal transactions local. Those are game semantics, not a reusable storage rule. A different game might compare revision numbers, timestamps or deterministic transaction IDs.

## Failure behavior

Cloud read/write/clear failures can be reported through `onError`. A failed mirror does not erase the already-written local copy.

Local writes/removals resolve after local persistence, independently of cloud completion. One cloud write runs at a time; waiting complete snapshots coalesce into the newest value. A hung cloud request retains at most one waiting value and is never treated as cancelled. Cloud reads have a 3-second deadline; obsolete reads cannot overwrite a local mutation. Recreate the adapter on a new profile/session. This is best-effort synchronization, not guaranteed delivery or cross-device locking.
