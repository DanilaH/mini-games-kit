import type { AnalyticsAdapter, AnalyticsParams } from '../platform/analytics.js';

export type MetricaFunction = ((...args: unknown[]) => void) & {
  a?: unknown[][];
  l?: number;
};

type MetricaWindow = Window & { ym?: MetricaFunction };

const METRICA_SCRIPT_BASE = 'https://mc.yandex.ru/metrika/tag.js';

const installMetricaFunction = (): MetricaFunction => {
  const target = window as MetricaWindow;
  if (target.ym) return target.ym;

  const queued: MetricaFunction = (...args: unknown[]): void => {
    queued.a ??= [];
    queued.a.push(args);
  };
  queued.l = Date.now();
  target.ym = queued;
  return queued;
};

export interface MetricaInstallOptions {
  clickmap?: boolean;
  trackLinks?: boolean;
  accurateTrackBounce?: boolean;
}

export const installYandexMetricaTag = (
  counterId: number,
  options: MetricaInstallOptions = {},
): void => {
  if (!Number.isSafeInteger(counterId) || counterId <= 0) throw new Error('counterId must be a positive integer');
  const ym = installMetricaFunction();
  const scriptSrc = `${METRICA_SCRIPT_BASE}?id=${counterId}`;
  const alreadyInstalled = Array.from(document.scripts).some((script) => script.src.startsWith(METRICA_SCRIPT_BASE));

  if (!alreadyInstalled) {
    const script = document.createElement('script');
    script.src = scriptSrc;
    script.async = true;
    document.head.append(script);
  }

  ym(counterId, 'init', {
    clickmap: options.clickmap ?? false,
    trackLinks: options.trackLinks ?? false,
    accurateTrackBounce: options.accurateTrackBounce ?? true,
  });
};

export class MetricaAnalyticsAdapter implements AnalyticsAdapter {
  public constructor(
    private readonly counterId: number,
    private readonly fallback?: AnalyticsAdapter,
  ) {}

  public track(event: string, params?: AnalyticsParams): void {
    this.fallback?.track(event, params);
    if (typeof window === 'undefined') return;
    const ym = (window as MetricaWindow).ym;
    if (!ym) return;
    try {
      ym(this.counterId, 'reachGoal', event, params ?? {});
    } catch {
      // Analytics must never own or break gameplay flow.
    }
  }
}
