import { GameplayActivityCoordinator, installDocumentVisibilityBlocker } from '../platform/activity.js';
import { ConsoleAnalyticsAdapter, type AnalyticsAdapter } from '../platform/analytics.js';
import { WebStorageAdapter, type StorageAdapter } from '../platform/storage.js';
import {
  MockAdsAdapter,
  YandexAdsAdapter,
  type AdsAdapter,
  type AdsAdapterOptions,
  type YandexAdsSdk,
} from './ads.js';
import {
  YandexMirroredStorageAdapter,
  type YandexMirroredStorageOptions,
  type YandexPlayerDataLike,
} from './mirrored-storage.js';

export interface PlatformRuntime<Language extends string = string> {
  kind: 'mock' | 'yandex';
  language: Language;
  storage: StorageAdapter;
  analytics: AnalyticsAdapter;
  ads: AdsAdapter;
  activity: GameplayActivityCoordinator;
  markReady(): void;
  destroy(): void;
}

export interface YandexPlatformSdk extends YandexAdsSdk {
  environment: { i18n: { lang?: string } };
  features: {
    GameplayAPI?: { start(): void; stop(): void };
    LoadingAPI?: { ready(): void };
  };
  on(event: 'game_api_pause' | 'game_api_resume', listener: () => void): void;
  off(event: 'game_api_pause' | 'game_api_resume', listener: () => void): void;
  getStorage(): Promise<Storage>;
  getPlayer(): Promise<YandexPlayerDataLike>;
}

export interface YandexGamesGlobal {
  init(): Promise<YandexPlatformSdk>;
}

export interface YandexSdkScriptOptions {
  sdkUrl?: string;
  document?: Document;
  globalObject?: typeof globalThis;
}

export interface YandexRuntimeCloudOptions extends YandexMirroredStorageOptions {
  onPlayerUnavailable?: (error: unknown) => void;
}

export interface YandexPlatformRuntimeOptions<Language extends string = string> {
  analytics?: AnalyticsAdapter;
  normalizeLanguage?: (detectedLanguage: string | undefined) => Language;
  cloud?: YandexRuntimeCloudOptions;
  ads?: Omit<AdsAdapterOptions, 'analytics'>;
  platformBlockReason?: string;
  visibilityBlockReason?: string | false;
}

export interface BootstrapYandexPlatformRuntimeOptions<Language extends string = string>
  extends YandexPlatformRuntimeOptions<Language>, YandexSdkScriptOptions {
  initSdk?: () => Promise<YandexPlatformSdk>;
}

export interface MockPlatformRuntimeOptions<Language extends string> {
  language: Language;
  storage: StorageAdapter;
  analytics?: AnalyticsAdapter;
  startGameplay?: () => void;
  stopGameplay?: () => void;
  visibilityBlockReason?: string | false;
  ads?: Omit<AdsAdapterOptions, 'analytics'>;
}

const resolveYandexGlobal = (globalObject: typeof globalThis): YandexGamesGlobal | null => {
  const value = (globalObject as typeof globalThis & { YaGames?: unknown }).YaGames;
  if (typeof value !== 'object' || value === null || !('init' in value) || typeof value.init !== 'function') {
    return null;
  }
  return value as YandexGamesGlobal;
};

/** Load `/sdk.js` (or another configured URL) only when `YaGames` is not already present. */
export const loadYandexGamesGlobal = async (options: YandexSdkScriptOptions = {}): Promise<YandexGamesGlobal> => {
  const globalObject = options.globalObject ?? globalThis;
  const existing = resolveYandexGlobal(globalObject);
  if (existing) return existing;

  const targetDocument = options.document ?? (typeof document === 'undefined' ? null : document);
  if (targetDocument === null) throw new Error('Yandex Games SDK is unavailable and no Document was provided');

  const sdkUrl = options.sdkUrl ?? '/sdk.js';
  await new Promise<void>((resolve, reject) => {
    const script = targetDocument.createElement('script');
    script.src = sdkUrl;
    script.async = true;
    script.addEventListener('load', () => resolve(), { once: true });
    script.addEventListener('error', () => reject(new Error(`Failed to load Yandex Games SDK: ${sdkUrl}`)), {
      once: true,
    });
    targetDocument.head.append(script);
  });

  const loaded = resolveYandexGlobal(globalObject);
  if (!loaded) throw new Error('Yandex Games SDK script loaded but YaGames.init is unavailable');
  return loaded;
};

const normalizeDefaultLanguage = (language: string | undefined): string => language ?? 'en';

/**
 * Build the production runtime around an already initialized Yandex SDK.
 * SDK pause/resume listeners are attached before async storage/player setup so an
 * early platform pause cannot be lost during application boot.
 */
export const createYandexPlatformRuntime = async <Language extends string = string>(
  sdk: YandexPlatformSdk,
  options: YandexPlatformRuntimeOptions<Language> = {},
): Promise<PlatformRuntime<Language>> => {
  const analytics = options.analytics ?? new ConsoleAnalyticsAdapter(false);
  const activity = new GameplayActivityCoordinator(
    () => sdk.features.GameplayAPI?.start(),
    () => sdk.features.GameplayAPI?.stop(),
  );
  const ads = new YandexAdsAdapter(sdk, activity, { ...options.ads, analytics });
  const platformBlockReason = options.platformBlockReason ?? 'platform';
  const handlePause = (): void => activity.setBlocked(platformBlockReason, true);
  const handleResume = (): void => activity.setBlocked(platformBlockReason, false);

  sdk.on('game_api_pause', handlePause);
  sdk.on('game_api_resume', handleResume);

  const removeVisibilityBlocker = options.visibilityBlockReason === false
    ? () => undefined
    : installDocumentVisibilityBlocker(activity, options.visibilityBlockReason ?? 'visibility');

  try {
    const safeStorage = new WebStorageAdapter(await sdk.getStorage());
    let storage: StorageAdapter = safeStorage;

    if (options.cloud) {
      try {
        const player = await sdk.getPlayer();
        const { onPlayerUnavailable: _onPlayerUnavailable, ...mirrorOptions } = options.cloud;
        storage = new YandexMirroredStorageAdapter(safeStorage, player, mirrorOptions);
      } catch (error: unknown) {
        options.cloud.onPlayerUnavailable?.(error);
      }
    }

    let readySent = false;
    const normalizeLanguage = options.normalizeLanguage ?? (normalizeDefaultLanguage as (value: string | undefined) => Language);

    return {
      kind: 'yandex',
      language: normalizeLanguage(sdk.environment.i18n.lang),
      storage,
      analytics,
      ads,
      activity,
      markReady: () => {
        if (readySent) return;
        readySent = true;
        sdk.features.LoadingAPI?.ready();
      },
      destroy: () => {
        removeVisibilityBlocker();
        sdk.off('game_api_pause', handlePause);
        sdk.off('game_api_resume', handleResume);
      },
    };
  } catch (error: unknown) {
    removeVisibilityBlocker();
    sdk.off('game_api_pause', handlePause);
    sdk.off('game_api_resume', handleResume);
    throw error;
  }
};

export const bootstrapYandexPlatformRuntime = async <Language extends string = string>(
  options: BootstrapYandexPlatformRuntimeOptions<Language> = {},
): Promise<PlatformRuntime<Language>> => {
  const sdk = options.initSdk
    ? await options.initSdk()
    : await (await loadYandexGamesGlobal(options)).init();
  return createYandexPlatformRuntime(sdk, options);
};

/** Lightweight development runtime with the same consumer-facing shape as production. */
export const createMockPlatformRuntime = <Language extends string>(
  options: MockPlatformRuntimeOptions<Language>,
): PlatformRuntime<Language> => {
  const analytics = options.analytics ?? new ConsoleAnalyticsAdapter(false);
  const activity = new GameplayActivityCoordinator(
    options.startGameplay ?? (() => undefined),
    options.stopGameplay ?? (() => undefined),
  );
  const ads = new MockAdsAdapter(activity, { ...options.ads, analytics });
  const removeVisibilityBlocker = options.visibilityBlockReason === false
    ? () => undefined
    : installDocumentVisibilityBlocker(activity, options.visibilityBlockReason ?? 'visibility');

  return {
    kind: 'mock',
    language: options.language,
    storage: options.storage,
    analytics,
    ads,
    activity,
    markReady: () => undefined,
    destroy: removeVisibilityBlocker,
  };
};
