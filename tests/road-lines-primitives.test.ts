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
describe('arc-length markers', () => {
  it('preserves a single phase across unequal segments and zero-length vertices', () => {
    const points = [{x:0,y:0},{x:40,y:0},{x:40,y:0},{x:40,y:37},{x:84,y:37}];
    const dots = polylineMarkers(points, { spacing:9, minDistance:3.6 });
    const distances = dots.map(p => p.y === 0 ? p.x : p.x === 40 ? 40+p.y : 77+p.x-40);
    for(let i=1;i<distances.length;i++) expect(distances[i]!-distances[i-1]!).toBeCloseTo(9);
    expect(distances[0]).toBe(4.5); expect(polylineMarkers([], {spacing:9})).toEqual([]);
  });
  it('omits close corner dots without moving later positions and bounds pathological work', () => {
    const path=[{x:0,y:0},{x:10,y:0},{x:10,y:10}];
    const all=polylineMarkers(path,{spacing:4}); const sparse=polylineMarkers(path,{spacing:4,minDistance:5});
    expect(sparse.length).toBeLessThan(all.length); for(const dot of sparse) expect(all).toContainEqual(dot);
    for(const spacing of [0,-1,NaN,Infinity]) expect(()=>polylineMarkers(path,{spacing})).toThrow();
    expect(()=>polylineMarkers(path,{spacing:.00001,maxMarkers:10})).toThrow(/budget/);
    expect(()=>polylineMarkers([{x:NaN,y:0}],{spacing:1})).toThrow();
  });
});
describe('musical sample selection', () => {
  it('keeps source tuning separate from timbre and never repeats a variant immediately', () => {
    const phrase=[0,2,4,7,4,2], sequence=new MusicalSampleSequence({variants:4,phrase,maxAdjacentSemitones:3,random:()=>.5});
    let last=-1;
    for(let i=0;i<60;i++){const cue=sequence.next();expect(cue.index).not.toBe(last);last=cue.index;expect(12*Math.log2(cue.playbackRate)).toBeCloseTo(phrase[i%phrase.length]!);}
    sequence.reset();expect(sequence.next().playbackRate).toBe(1);
  });
  it('validates the loop boundary as well as adjacent notes and handles a single variant', () => {
    expect(()=>new MusicalSampleSequence({variants:2,phrase:[0,3,6],maxAdjacentSemitones:3})).toThrow();
    const sequence=new MusicalSampleSequence({variants:1,phrase:[0],maxAdjacentSemitones:0,random:()=>0});
    expect(sequence.next()).toEqual({index:0,playbackRate:1});expect(sequence.next().index).toBe(0);
    expect(()=>new MusicalSampleSequence({variants:0,phrase:[0],maxAdjacentSemitones:0})).toThrow();
  });
});
