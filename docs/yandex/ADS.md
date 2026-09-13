# Yandex ads adapter

Import from `@danilah/mini-games-kit/yandex`.

## What it is

A hardened wrapper around the small Yandex Games advertising surface needed by mini-games: fullscreen interstitial, rewarded video and sticky banner.

The adapter uses a minimal structural `YandexAdsSdk` interface, so the kit does not require the Yandex SDK type package at runtime.

## Public API

```ts
const ads = new YandexAdsAdapter(ysdk, activity, {
  analytics,
  fullscreenTimeoutMs: 120_000,
  activityBlockReason: 'ad',
});

const interstitial = await ads.showInterstitial();
const rewarded = await ads.showRewarded({
  rewardId: 'continue-1',
  onReward: async () => {
    await persistGrantedRewardExactlyOnce();
  },
});
await ads.setStickyBannerVisible(true);
```

`MockAdsAdapter` implements the same `AdsAdapter` for local development.

## Guarantees

- only one fullscreen request can be in flight;
- gameplay/activity is blocked for the fullscreen surface;
- missing SDK callbacks are released by a watchdog timeout;
- duplicate `onRewarded` callbacks grant at most once;
- a reward callback arriving after the ad already settled is ignored;
- ad close can unblock presentation immediately while reward persistence finishes before another fullscreen grant may start.

## Critical boundary

`onReward` is where the **game** makes the reward durable. The adapter does not invent currency, retries or idempotency keys. The callback itself should be safe for the game's persistence model.
