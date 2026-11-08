import { describe, expect, it, vi } from 'vitest';
import { GameplayActivityCoordinator } from '../src/platform/activity';
import { polylineMarkers } from '../src/feel/polyline-markers';
import { MusicalSampleSequence } from '../src/audio/sample-sequence';

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
