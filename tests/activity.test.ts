import { describe, expect, it, vi } from 'vitest';

import { GameplayActivityCoordinator } from '../src/platform/index';

describe('GameplayActivityCoordinator', () => {
  it('does not resume until every blocker is removed', () => {
    const start = vi.fn();
    const stop = vi.fn();
    const activity = new GameplayActivityCoordinator(start, stop);

    activity.setGameplayDesired(true);
    activity.setBlocked('ad', true);
    activity.setBlocked('platform', true);
    activity.setBlocked('ad', false);
    expect(start).toHaveBeenCalledTimes(1);
    activity.setBlocked('platform', false);
    expect(start).toHaveBeenCalledTimes(2);
    expect(stop).toHaveBeenCalledTimes(1);
  });

  it('replays current aggregate state to a late subscriber', () => {
    const activity = new GameplayActivityCoordinator(() => undefined, () => undefined);
    activity.setBlocked('platform', true);
    const listener = vi.fn();
    activity.onBlockedChange(listener);
    expect(listener.mock.calls).toEqual([[true]]);
    activity.setBlocked('platform', false);
    expect(listener.mock.calls).toEqual([[true], [false]]);
  });
});
