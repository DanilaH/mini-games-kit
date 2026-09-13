# Yandex Metrica adapter

Import from `@danilah/mini-games-kit/yandex`.

## What it is

A minimal Metrica tag installer plus an `AnalyticsAdapter` implementation that forwards semantic game events to `reachGoal`.

## Public API

```ts
installYandexMetricaTag(12345678);
const analytics = new MetricaAnalyticsAdapter(12345678);
analytics.track('run_complete', { score: 1200 });
```

A fallback analytics adapter can be supplied to the constructor for local logging or parallel telemetry.

## Boundary

The library does not read Vite/env variables and does not define event names. The game owns counter configuration and its analytics vocabulary. Analytics failures are deliberately non-fatal to gameplay.
