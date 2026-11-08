import { describe, expect, it, vi } from 'vitest';
import { GameplayActivityCoordinator } from '../src/platform/activity';
import { polylineMarkers } from '../src/feel/polyline-markers';
import { MusicalSampleSequence } from '../src/audio/sample-sequence';

describe('reason-aware activity consumers', () => {
  it('updates UI eligibility under pause without adding gameplay edges', () => {
    const start = vi.fn(), stop = vi.fn(), a = new GameplayActivityCoordinator(start, stop);
    const snapshots: (readonly string[])[] = []; const values: boolean[] = [];
    const dispose = a.onBlockReasonsChange(reasons => { snapshots.push(reasons); values.push(reasons.every(x => x === 'pause')); });
    a.setGameplayDesired(true); a.setBlocked('pause', true); a.setBlocked('background', true);
    a.setBlocked('background', true); a.setBlocked('background', false);
    expect(values).toEqual([true, true, false, true]); expect(start).toHaveBeenCalledTimes(1); expect(stop).toHaveBeenCalledTimes(1);
    expect(snapshots[1]).toEqual(['pause']); expect(Object.isFrozen(snapshots[1])).toBe(true);
    dispose(); a.setBlocked('pause', false); expect(values).toHaveLength(4); expect(start).toHaveBeenCalledTimes(2);
  });
});
