import {describe, expect, it, vi} from 'vitest';
import {OwnedDomMotion} from '../src/feel/owned-dom-motion';

// Timing/ownership doubles only. Browser acceptance checks real WAAPI property
// normalization, interpolation, DOM removal and animation event delivery.
class Effect {
  frames: Keyframe[];
  composite: CompositeOperation = 'replace';
  constructor(_target: Element, frames: Keyframe[], timing: number | KeyframeEffectOptions) {
    if (typeof timing === 'number' && timing < 0) throw new TypeError('duration');
    if (typeof timing !== 'number') this.composite = timing.composite ?? 'replace';
    this.frames = frames.map(f => ({...f}));
  }
  getKeyframes() { return this.frames.map(f => ({computedOffset: 0, easing: 'linear', composite: 'replace', ...f})); }
  setKeyframes(frames: Keyframe[]) { this.frames = frames.map(f => ({...f})); }
}
class Motion {
  static instances: Motion[] = [];
  playState = 'idle';
  listeners = new Map<string, Set<() => void>>();
  seenFinish: Array<() => void> = [];
  onCancel = () => {};
  constructor(public effect: Effect) { Motion.instances.push(this); }
  play() { this.playState = 'running'; }
  cancel() { this.playState = 'idle'; this.onCancel(); this.emit('cancel'); }
  addEventListener(type: string, listener: () => void) {
    const listeners = this.listeners.get(type) ?? new Set();
    listeners.add(listener); this.listeners.set(type, listeners);
    if (type === 'finish') this.seenFinish.push(listener);
  }
  removeEventListener(type: string, listener: () => void) { this.listeners.get(type)?.delete(listener); }
  emit(type: string) { for (const listener of [...(this.listeners.get(type) ?? [])]) listener(); }
  finish() { this.playState = 'finished'; this.emit('finish'); }
}
function setup() {
  Motion.instances = [];
  const values: Record<string, string> = {opacity: '0.42', transform: 'matrix(1, 0, 0, 1, 3, 0)', 'background-color': 'rgb(30, 80, 60)'};
  const read = vi.fn(() => ({getPropertyValue: (key: string) => values[key] ?? ''}));
  const document = {defaultView: {Animation: Motion, KeyframeEffect: Effect, getComputedStyle: read}, timeline: {}, createElementNS: () => {
    let property = '';
    return {style: {cssText: '', setProperty: (key: string) => {property=key;}, [Symbol.iterator]: function* () {yield property;}}};
  }};
  const target = {ownerDocument: document, isConnected: true} as unknown as Element;
  const second = {ownerDocument: document, isConnected: true} as unknown as Element;
  return {owner: new OwnedDomMotion(), target, second, values, read};
}
const opacity = [{opacity: 0}, {opacity: 1}];
const transform = [{transform: 'scale(.8)'}, {transform: 'none'}];
const fake = (animation: Animation | null) => animation as unknown as Motion;

describe('OwnedDomMotion', () => {
  it('keeps a fresh authored start and caller-owned frames', () => {
    const {owner, target, read} = setup();
    const frames = Object.freeze([Object.freeze({opacity: 0}), Object.freeze({opacity: 1})]);
    const animation = fake(owner.animate(target, frames, 120));
    expect(animation.effect.frames).toEqual(opacity);
    expect(read).not.toHaveBeenCalled();
    expect(frames[0]!.opacity).toBe(0);
  });

  it('samples visible properties before cancelling a replacement', () => {
    const {owner, target, values, read} = setup();
    const old = fake(owner.animate(target, opacity, 100));
    old.onCancel = () => { values.opacity = '0'; };
    const next = fake(owner.animate(target, opacity, 100));
    expect(old.playState).toBe('idle');
    expect(next.effect.frames[0]!.opacity).toBe('0.42');
    expect(next.playState).toBe('running');
    expect(read).toHaveBeenCalledTimes(1);
    expect(opacity[0]!.opacity).toBe(0);
  });

  it('can start a fresh pulse from the visible state without a global preference', () => {
    const {owner, target, read} = setup();
    const animation = fake(owner.animate(target, [{backgroundColor: 'red'}, {backgroundColor: 'transparent'}], 160, {fromCurrent: 'always'}));
    expect(animation.effect.frames[0]!.backgroundColor).toBe('rgb(30, 80, 60)');
    expect(read).toHaveBeenCalledTimes(1);
  });

  it('inserts a zero-offset visible frame when the authored first frame is delayed', () => {
    const {owner, target} = setup();
    const animation = fake(owner.animate(target, [{opacity: .2, offset: .3}, {opacity: 1}], 120, {fromCurrent: 'always'}));
    expect(animation.effect.frames).toEqual([{opacity: '0.42', offset: 0}, {opacity: .2, offset: .3}, {opacity: 1}]);
  });

  it('round-trips vendor-prefixed CSS names through computed style', () => {
    const {owner, target, values} = setup();
    values['-webkit-text-fill-color'] = 'rgb(1, 2, 3)';
    const animation = fake(owner.animate(target, [{webkitTextFillColor: 'red'}, {webkitTextFillColor: 'blue'}], 100, {fromCurrent:'always'}));
    expect(animation.effect.frames[0]!.webkitTextFillColor).toBe('rgb(1, 2, 3)');
  });

  it('does not cancel a different target or independent visual property', () => {
    const {owner, target, second, read} = setup();
    const a = fake(owner.animate(target, opacity, 100));
    const b = fake(owner.animate(target, transform, 100));
    const c = fake(owner.animate(second, opacity, 100));
    expect([a,b,c].map(m => m.playState)).toEqual(['running','running','running']);
    expect(read).not.toHaveBeenCalled();
    owner.cancel(target);
    expect([a,b,c].map(m => m.playState)).toEqual(['idle','idle','running']);
  });

  it('replaces an indivisible multi-property effect if any property overlaps', () => {
    const {owner, target} = setup();
    const old = fake(owner.animate(target, [{opacity: 0, transform: 'scale(.8)'}, {opacity: 1, transform: 'none'}], 100));
    const next = fake(owner.animate(target, opacity, 100));
    expect(old.playState).toBe('idle');
    expect(next.effect.frames[0]!.opacity).toBe('0.42');
  });

  it('disabled motion cancels only overlapping effects, with no style read or replacement', () => {
    const {owner, target, read} = setup();
    const old = fake(owner.animate(target, opacity, 100));
    const other = fake(owner.animate(target, transform, 100));
    expect(owner.animate(target, opacity, 100, {enabled: false})).toBeNull();
    expect(old.playState).toBe('idle');
    expect(other.playState).toBe('running');
    expect(read).not.toHaveBeenCalled();
    expect(Motion.instances).toHaveLength(2);
  });

  it('ignores a stale queued finish and retains the new completion', () => {
    const {owner, target} = setup();
    const oldDone = vi.fn(), nextDone = vi.fn();
    const old = fake(owner.animate(target, opacity, 100, {onFinish: oldDone}));
    const queued = old.seenFinish[0]!;
    old.playState = 'finished';
    const next = fake(owner.animate(target, opacity, 100, {onFinish: nextDone}));
    queued();
    expect(oldDone).not.toHaveBeenCalled();
    expect(next.playState).toBe('running');
    next.finish(); next.emit('finish');
    expect(nextDone).toHaveBeenCalledTimes(1);
    expect(next.listeners.get('cancel')?.size).toBe(0);
  });

  it('allows an unrelated queued finish instead of discarding it on any new animation', () => {
    const {owner, target, second} = setup();
    const done = vi.fn();
    const old = fake(owner.animate(target, opacity, 100, {onFinish: done}));
    old.playState = 'finished';
    const other = fake(owner.animate(second, opacity, 100));
    old.emit('finish');
    expect(done).toHaveBeenCalledOnce();
    expect(other.playState).toBe('running');
  });

  it('releases before finish callbacks, so a new effect survives old cleanup', () => {
    const {owner, target} = setup();
    let next: Motion | undefined;
    const old = fake(owner.animate(target, opacity, 100, {onFinish: () => { next = fake(owner.animate(target, opacity, 100)); }}));
    old.finish(); old.seenFinish[0]!();
    expect(next?.playState).toBe('running');
    owner.cancelAll();
    expect(next?.playState).toBe('idle');
  });

  it('cancelAll is idempotent, suppresses stale handlers and permits later reuse', () => {
    const {owner, target, second} = setup();
    const done = vi.fn();
    const a = fake(owner.animate(target, opacity, 100, {onFinish: done}));
    const b = fake(owner.animate(second, transform, 100));
    owner.cancelAll(); owner.cancelAll();
    const next = fake(owner.animate(target, opacity, 100));
    a.seenFinish[0]!();
    expect([a,b,next].map(m => m.playState)).toEqual(['idle','idle','running']);
    expect(done).not.toHaveBeenCalled();
  });

  it('handles external cancellation and detached targets without a late callback', () => {
    const {owner, target, second, read} = setup();
    const done = vi.fn();
    const a = fake(owner.animate(target, opacity, 100, {onFinish: done}));
    a.cancel(); a.seenFinish[0]!();
    const b = fake(owner.animate(target, transform, 100, {onFinish: done}));
    (target as unknown as {isConnected: boolean}).isConnected = false;
    b.finish();
    expect(owner.animate(target, opacity, 100)).toBeNull();
    expect(owner.animate(null, opacity, 100)).toBeNull();
    expect(done).not.toHaveBeenCalled();
    expect(read).not.toHaveBeenCalled();
    expect(fake(owner.animate(second, opacity, 100)).playState).toBe('running');
  });

  it('rejects invalid replacement frames/timing before cancelling the old effect', () => {
    const {owner, target} = setup();
    const old = fake(owner.animate(target, opacity, 100));
    expect(() => owner.animate(target, [{opacity: 1}], 100)).toThrow(TypeError);
    expect(() => owner.animate(target, opacity, -1)).toThrow(TypeError);
    expect(() => owner.animate(target, opacity, {duration: 100, composite: 'add'})).toThrow(TypeError);
    expect(() => owner.animate(target, opacity, {duration: 100, fill: 'forwards'})).toThrow(TypeError);
    expect(() => owner.animate(target, [{opacity: 0, composite: 'accumulate'}, {opacity: 1}], 100)).toThrow(TypeError);
    expect(old.playState).toBe('running');
  });
});
