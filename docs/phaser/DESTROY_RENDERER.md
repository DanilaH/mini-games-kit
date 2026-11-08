# Destroying a sleeping renderer

Import `destroyRenderer` from `@danilah/mini-games-kit/phaser`. Requires the optional Phaser4.2.1 peer; the import of Phaser in this helper is type-only.

```ts
destroyRenderer(game, () => releaseSaveWriter());
```

Phaser defers game.destroy(true) until a loop step. If a started loop is sleeping, wake it to complete that step. The optional callback observes the actual destroy event, not just the request. Call once per game; repeated callback registration is not deduplicated. Stop input/observers/workers and cancel application timers separately before destroying. The helper does not dispose application resources or prescribe an idle scene architecture.

Browser acceptance uses actual Phaser4.2.1 games, both running and sleeping, and checks canvas removal after destroy. Revalidate after a Phaser lifecycle upgrade.
