import { describe, expect, it, vi } from 'vitest';

import type { YandexPlayerDataLike } from '../src/yandex/mirrored-storage';
import {
  bootstrapYandexPlatformRuntime,
  createYandexPlatformRuntime,
  type YandexPlatformSdk,
} from '../src/yandex/runtime';

class MemoryWebStorage implements Storage {
  private readonly values = new Map<string, string>();

  public get length(): number {
    return this.values.size;
  }

  public clear(): void {
    this.values.clear();
  }

  public getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  public key(index: number): string | null {
    return [...this.values.keys()][index] ?? null;
  }

  public removeItem(key: string): void {
    this.values.delete(key);
  }

  public setItem(key: string, value: string): void {
    this.values.set(key, value);
  }
}

class FakeSdk implements YandexPlatformSdk {
  public readonly start = vi.fn();
  public readonly stop = vi.fn();
  public readonly ready = vi.fn();
  public readonly storage = new MemoryWebStorage();
  public playerError: unknown = null;
  public storagePromise: Promise<Storage> = Promise.resolve(this.storage);
  private readonly listeners = new Map<'game_api_pause' | 'game_api_resume', Set<() => void>>();

  public readonly environment = { i18n: { lang: 'ru' } };
  public readonly features = {
    GameplayAPI: { start: this.start, stop: this.stop },
    LoadingAPI: { ready: this.ready },
  };
  public readonly adv: YandexPlatformSdk['adv'] = {
    showFullscreenAdv: () => undefined,
    showRewardedVideo: () => undefined,
    showBannerAdv: async () => ({}),
    hideBannerAdv: async () => ({ stickyAdvIsShowing: false }),
    getBannerAdvStatus: async () => ({ stickyAdvIsShowing: false }),
  };

  public on(event: 'game_api_pause' | 'game_api_resume', listener: () => void): void {
    const listeners = this.listeners.get(event) ?? new Set<() => void>();
    listeners.add(listener);
    this.listeners.set(event, listeners);
  }

  public off(event: 'game_api_pause' | 'game_api_resume', listener: () => void): void {
    this.listeners.get(event)?.delete(listener);
  }

  public emit(event: 'game_api_pause' | 'game_api_resume'): void {
    for (const listener of this.listeners.get(event) ?? []) listener();
  }

  public getStorage(): Promise<Storage> {
    return this.storagePromise;
  }

  public async getPlayer(): Promise<YandexPlayerDataLike> {
    if (this.playerError) throw this.playerError;
    return {
      getData: async () => ({}),
      setData: async () => undefined,
    };
  }
}

describe('Yandex platform runtime', () => {
  it('captures an SDK pause that arrives while storage initialization is still pending', async () => {
    const sdk = new FakeSdk();
    let resolveStorage: ((value: Storage) => void) | undefined;
    sdk.storagePromise = new Promise<Storage>((resolve) => {
      resolveStorage = resolve;
    });

    const runtimePromise = createYandexPlatformRuntime(sdk, {
      visibilityBlockReason: false,
      normalizeLanguage: (language) => (language === 'ru' ? 'ru' : 'en'),
    });
    sdk.emit('game_api_pause');
    resolveStorage?.(sdk.storage);

    const runtime = await runtimePromise;
    expect(runtime.language).toBe('ru');
    expect(runtime.activity.isBlocked()).toBe(true);

    runtime.activity.setGameplayDesired(true);
    expect(sdk.start).not.toHaveBeenCalled();
    sdk.emit('game_api_resume');
    expect(sdk.start).toHaveBeenCalledTimes(1);

    runtime.markReady();
    runtime.markReady();
    expect(sdk.ready).toHaveBeenCalledTimes(1);

    runtime.destroy();
    sdk.emit('game_api_pause');
    expect(runtime.activity.isBlocked()).toBe(false);
  });

  it('falls back to safe storage when Player Data is unavailable', async () => {
    const sdk = new FakeSdk();
    sdk.playerError = new Error('player unavailable');
    const unavailable = vi.fn();

    const runtime = await createYandexPlatformRuntime(sdk, {
      visibilityBlockReason: false,
      cloud: {
        syncKey: 'save',
        cloudField: 'save',
        reconcile: (local, cloud) => cloud ?? local,
        onPlayerUnavailable: unavailable,
      },
    });

    await runtime.storage.setItem('save', 'local');
    await expect(runtime.storage.getItem('save')).resolves.toBe('local');
    expect(unavailable).toHaveBeenCalledTimes(1);
  });

  it('can bootstrap through an injected SDK initializer without DOM script loading', async () => {
    const sdk = new FakeSdk();
    const initSdk = vi.fn(async () => sdk);

    const runtime = await bootstrapYandexPlatformRuntime({
      initSdk,
      visibilityBlockReason: false,
    });

    expect(initSdk).toHaveBeenCalledTimes(1);
    expect(runtime.kind).toBe('yandex');
    runtime.destroy();
  });
});
