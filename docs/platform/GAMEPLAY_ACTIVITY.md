# `GameplayActivityCoordinator`

Import from `@danilah/mini-games-kit/platform`.

## What it is

A single source for whether the game **wants** gameplay active and whether external systems currently **allow** it. Multiple blockers (ad, platform pause, visibility, orientation, modal, etc.) can overlap without accidentally resuming gameplay too early.

## Public API

```ts
const activity = new GameplayActivityCoordinator(
  () => yandexGameplayApi.start(),
  () => yandexGameplayApi.stop(),
);

activity.setGameplayDesired(true);
activity.setBlocked('ad', true);
activity.setBlocked('platform', true);
activity.setBlocked('ad', false);      // still blocked
activity.setBlocked('platform', false); // resumes

const unsubscribe = activity.onBlockedChange((blocked) => audio.setBlocked(blocked));
```

Late subscribers immediately receive the current aggregate blocked state.

`installDocumentVisibilityBlocker(activity)` is a convenience bridge for `document.hidden` and returns an uninstall function.

## Non-goals

The coordinator does not pause Phaser, audio or timers directly. It only owns blocker aggregation and the start/stop edge; consumers wire those edges to their runtime.
