import { describe, expect, it, vi } from 'vitest';
import { GameplayActivityCoordinator } from '../src/platform/activity';
import { polylineMarkers } from '../src/feel/polyline-markers';
import { MusicalSampleSequence } from '../src/audio/sample-sequence';

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
