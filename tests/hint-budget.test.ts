import { describe, expect, it } from 'vitest';
import { creditHints, getHintBalance, revealHint } from '../src/core/index';
import type { HintBudget } from '../src/core/index';

describe('free information reveals and persistent earned balance', () => {
  it('uses a configurable free allowance before earned hints', () => {
    let budget: HintBudget = Object.freeze({ wallet: 2, revealedKeys: Object.freeze([]) });
    for (const key of ['board1:pairA', 'board1:pairB']) {
      const result = revealHint(budget, key, 2);
      expect(result.spentFromWallet).toBe(0); budget = result.budget;
    }
    const paid = revealHint(budget, 'board1:pairC', 2);
    expect(paid.spentFromWallet).toBe(1);
    expect(getHintBalance(paid.budget, 2)).toEqual({ free: 0, earned: 1, total: 1 });
    expect(budget.wallet).toBe(2);
  });
  it('a repeat after reload/undo is free even at zero balance', () => {
    let budget: HintBudget = { wallet: 1, revealedKeys: [] };
    budget = revealHint(budget, 'state:unordered-pair', 0).budget;
    const restored = JSON.parse(JSON.stringify(budget)) as HintBudget;
    const repeat = revealHint(restored, 'state:unordered-pair', 0);
    expect(repeat).toMatchObject({ accepted: true, repeated: true, spentFromWallet: 0 });
    expect(repeat.budget).toBe(restored);
    const denied = revealHint(restored, 'another-state:pair', 0);
    expect(denied).toMatchObject({ accepted: false, repeated: false, spentFromWallet: 0 });
    expect(denied.budget).toBe(restored);
  });
  it('credits stay shared when the consumer starts another attempt', () => {
    const old: HintBudget = { wallet: 0, revealedKeys: ['a', 'b'] };
    const credited = creditHints(old, 4);
    const next: HintBudget = { wallet: credited.wallet, revealedKeys: [] };
    expect(getHintBalance(next, 2)).toEqual({ free: 2, earned: 4, total: 6 });
    expect(old.wallet).toBe(0);
    expect(creditHints(next, 0)).toBe(next);
  });
  it('retains already revealed information when the allowance changes', () => {
    const old: HintBudget = { wallet: 0, revealedKeys: ['a', 'b', 'c'] };
    expect(getHintBalance(old, 1).free).toBe(0);
    expect(revealHint(old, 'a', 1).accepted).toBe(true);
    expect(revealHint(old, 'd', 1).accepted).toBe(false);
  });
  it('does not infer idempotency from a credit amount', () => {
    const once = creditHints({ wallet: 0, revealedKeys: [] }, 2);
    expect(creditHints(once, 2).wallet).toBe(4);
    // SDK receipt identity/deduplication must be saved by the existing receipt protocol.
  });
  it('rejects invalid/duplicated keys, balances and unsafe arithmetic', () => {
    for (const budget of [
      { wallet: -1, revealedKeys: [] }, { wallet: 1.1, revealedKeys: [] },
      { wallet: 1, revealedKeys: ['a', 'a'] }, { wallet: 1, revealedKeys: [''] },
    ]) expect(() => revealHint(budget, 'b', 1)).toThrow(RangeError);
    expect(() => revealHint({ wallet: 0, revealedKeys: [] }, '', 1)).toThrow(RangeError);
    expect(() => getHintBalance({ wallet: 0, revealedKeys: [] }, -1)).toThrow(RangeError);
    expect(() => creditHints({ wallet: 0, revealedKeys: [] }, NaN)).toThrow(RangeError);
    expect(() => creditHints({ wallet: Number.MAX_SAFE_INTEGER, revealedKeys: [] }, 1)).toThrow(RangeError);
    expect(() => getHintBalance({ wallet: Number.MAX_SAFE_INTEGER, revealedKeys: [] }, 1)).toThrow(RangeError);
  });
  it('rejects sparse arrays before charging a new reveal', () => {
    expect(() => revealHint({ wallet: 1, revealedKeys: new Array<string>(1) }, 'new', 1)).toThrow(RangeError);
  });
});
