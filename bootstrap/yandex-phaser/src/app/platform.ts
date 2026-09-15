import { WebStorageAdapter } from '@danilah/mini-games-kit/platform';
import {
  bootstrapYandexPlatformRuntime,
  createMockPlatformRuntime,
  type PlatformRuntime,
} from '@danilah/mini-games-kit/yandex';

import { normalizeGameLanguage, type GameLanguage } from './language';

export const isYandexBuild = (): boolean => import.meta.env.VITE_PLATFORM === 'yandex';

export const createPlatformRuntime = async (): Promise<PlatformRuntime<GameLanguage>> => {
  if (isYandexBuild()) {
    return bootstrapYandexPlatformRuntime<GameLanguage>({
      normalizeLanguage: normalizeGameLanguage,
      cloud: {
        onPlayerUnavailable: (error) => console.warn('Yandex Player Data unavailable; using safe storage only', error),
      },
    });
  }

  return createMockPlatformRuntime<GameLanguage>({
    language: normalizeGameLanguage(typeof navigator === 'undefined' ? undefined : navigator.language),
    storage: new WebStorageAdapter(window.localStorage),
  });
};
