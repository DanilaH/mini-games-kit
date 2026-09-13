import { describe, expect, it, vi } from 'vitest';

import { GameplayActivityCoordinator } from '../src/platform/index';
import {
  AD_CALLBACK_TIMEOUT,
  YandexAdsAdapter,
  type YandexAdsSdk,
  type YandexFullscreenCallbacks,
  type YandexRewardedCallbacks,
} from '../src/yandex/index';

const createActivity = () => {
  const activity = new GameplayActivityCoordinator(() => undefined, () => undefined);
  const blocked: boolean[] = [];
  activity.onBlockedChange((value) => blocked.push(value));
  return { activity, blocked };
};

const createSdk = (handlers: {
  rewarded?: (callbacks: YandexRewardedCallbacks) => void;
  interstitial?: (callbacks: YandexFullscreenCallbacks) => void;
}): YandexAdsSdk => ({
  adv: {
    showRewardedVideo: ({ callbacks }) => handlers.rewarded?.(callbacks),
    showFullscreenAdv: ({ callbacks }) => handlers.interstitial?.(callbacks),
    showBannerAdv: async () => ({}),
    hideBannerAdv: async () => ({ stickyAdvIsShowing: false }),
    getBannerAdvStatus: async () => ({ stickyAdvIsShowing: true }),
  },
});

describe('YandexAdsAdapter', () => {
  it('grants rewarded persistence exactly once even if SDK repeats onRewarded', async () => {
    const { activity, blocked } = createActivity();
    const sdk = createSdk({ rewarded: (callbacks) => {
      callbacks.onRewarded?.();
      callbacks.onRewarded?.();
      callbacks.onClose?.();
    } });
    const onReward = vi.fn(async () => undefined);
    const result = await new YandexAdsAdapter(sdk, activity, { fullscreenTimeoutMs: 30 })
      .showRewarded({ rewardId: 'r1', onReward });
    expect(onReward).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ status: 'closed', rewardEarned: true });
    expect(blocked).toEqual([false, true, false]);
  });

  it('ignores a late reward callback after close', async () => {
    const { activity } = createActivity();
    const onReward = vi.fn();
    const sdk = createSdk({ rewarded: (callbacks) => {
      callbacks.onClose?.();
      callbacks.onRewarded?.();
    } });
    const result = await new YandexAdsAdapter(sdk, activity, { fullscreenTimeoutMs: 30 })
      .showRewarded({ rewardId: 'late', onReward });
    expect(onReward).not.toHaveBeenCalled();
    expect(result).toEqual({ status: 'closed', rewardEarned: false });
  });

  it('times out a missing SDK callback and releases the activity blocker', async () => {
    const { activity, blocked } = createActivity();
    const sdk = createSdk({ rewarded: () => undefined });
    const result = await new YandexAdsAdapter(sdk, activity, { fullscreenTimeoutMs: 5 })
      .showRewarded({ rewardId: 'timeout', onReward: vi.fn() });
    expect(result).toEqual({ status: 'error', rewardEarned: false, error: AD_CALLBACK_TIMEOUT });
    expect(blocked).toEqual([false, true, false]);
  });
});
