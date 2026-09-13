# Yandex platform runtime

Import from `@danilah/mini-games-kit/yandex`.

## What it is

A production bootstrap/orchestration layer around the Yandex Games SDK. It assembles the already-shared ads, activity, storage and optional Player Data mirroring primitives into one runtime shape while keeping game-specific save policy and analytics vocabulary injected.

The important production detail preserved from Signal 2000 is that Yandex `game_api_pause` / `game_api_resume` listeners are attached **before** asynchronous storage/player initialization. A startup pause therefore cannot be lost while the rest of the app is still booting.

## Main public API

```ts
const platform = await bootstrapYandexPlatformRuntime({
  normalizeLanguage: (language) => (language === 'ru' ? 'ru' : 'en'),
  analytics,
  cloud: {
    syncKey: 'game.save',
    cloudField: 'gameSave',
    reconcile: reconcileGameSave,
    shouldMirror: canMirrorGameSave,
    onPlayerUnavailable: (error) => console.warn(error),
  },
});

platform.activity.setGameplayDesired(true);
platform.markReady();

// on application teardown
platform.destroy();
```

`bootstrapYandexPlatformRuntime()`:

1. reuses an existing global `YaGames` when available;
2. otherwise loads `/sdk.js` (or `sdkUrl`);
3. calls `YaGames.init()`;
4. creates the production runtime.

For tests, custom wrappers or hosts that initialize the SDK themselves, inject `initSdk`:

```ts
await bootstrapYandexPlatformRuntime({
  initSdk: () => hostProvidedSdk,
  visibilityBlockReason: false,
});
```

`createYandexPlatformRuntime(sdk, options)` skips script loading and accepts an already initialized structural SDK object.

## Runtime shape

```ts
interface PlatformRuntime<Language extends string = string> {
  kind: 'mock' | 'yandex';
  language: Language;
  storage: StorageAdapter;
  analytics: AnalyticsAdapter;
  ads: AdsAdapter;
  activity: GameplayActivityCoordinator;
  markReady(): void;
  destroy(): void;
}
```

`markReady()` is idempotent and forwards to `LoadingAPI.ready()` at most once.

`destroy()` removes the document-visibility bridge and Yandex pause/resume listeners.

## Cloud behavior

Cloud mirroring is opt-in. When `cloud` is configured, runtime asks Yandex for a Player and wraps safe storage with `YandexMirroredStorageAdapter`. If Player Data is unavailable, startup continues on safe storage and `onPlayerUnavailable` is called.

The runtime does **not** choose which save is newer. `reconcile()` and `shouldMirror()` remain game policy.

## Development runtime

`createMockPlatformRuntime()` creates the same consumer-facing runtime shape around an injected `StorageAdapter`, `MockAdsAdapter` and `GameplayActivityCoordinator`:

```ts
const platform = createMockPlatformRuntime({
  language: 'en',
  storage: new WebStorageAdapter(window.localStorage),
});
```

This keeps game boot code mostly platform-agnostic.

## Script loader

`loadYandexGamesGlobal({ sdkUrl, document, globalObject })` is exposed separately for hosts that only need controlled SDK script loading. It fails if the script loads but `YaGames.init` is still missing.

## Non-goals

The runtime does not:

- define your analytics event names;
- decide cloud-save freshness;
- own game save schemas;
- pause Phaser/audio directly;
- decide when gameplay is semantically active;
- add an orientation UI;
- grant ad rewards itself.

The game still wires `activity.onBlockedChange()` into Phaser/audio and calls `activity.setGameplayDesired()` around actual gameplay states.
