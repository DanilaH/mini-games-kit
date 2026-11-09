export interface HintBudget {
  /** Shared earned balance. Kept when a new attempt clears revealedKeys. */
  readonly wallet: number;
  /** Information identities for this attempt, including reveals paid from wallet. */
  readonly revealedKeys: readonly string[];
}

function count(value: number, name: string): void {
  if (!Number.isSafeInteger(value) || value < 0) throw new RangeError(`Invalid ${name}`);
}

function validate(budget: HintBudget): void {
  count(budget.wallet, 'hint wallet');
  if (!Array.isArray(budget.revealedKeys) || Array.from(budget.revealedKeys).some(key => typeof key !== 'string' || key.length === 0) ||
      new Set(budget.revealedKeys).size !== budget.revealedKeys.length) {
    throw new RangeError('Invalid revealed hint keys');
  }
}

export function getHintBalance(budget: HintBudget, freeLimit: number): {
  readonly free: number; readonly earned: number; readonly total: number;
} {
  validate(budget);
  count(freeLimit, 'free hint limit');
  const free = Math.max(0, freeLimit - budget.revealedKeys.length);
  const total = free + budget.wallet;
  count(total, 'total hint balance');
  return { free, earned: budget.wallet, total };
}

export interface HintRevealResult {
  readonly budget: HintBudget;
  readonly accepted: boolean;
  readonly repeated: boolean;
  readonly spentFromWallet: 0 | 1;
}

/** Charges information once. Caller owns board/pair identity, actual reveal and durable commit. */
export function revealHint(budget: HintBudget, key: string, freeLimit: number): HintRevealResult {
  validate(budget);
  count(freeLimit, 'free hint limit');
  if (typeof key !== 'string' || key.length === 0) throw new RangeError('Invalid hint key');
  if (budget.revealedKeys.includes(key)) return { budget, accepted: true, repeated: true, spentFromWallet: 0 };
  const spentFromWallet = budget.revealedKeys.length >= freeLimit ? 1 : 0;
  if (spentFromWallet && budget.wallet === 0) return { budget, accepted: false, repeated: false, spentFromWallet: 0 };
  return {
    budget: { wallet: budget.wallet - spentFromWallet, revealedKeys: [...budget.revealedKeys, key] },
    accepted: true, repeated: false, spentFromWallet,
  };
}

/** Pure credit only; externally earned reward deduplication belongs to DurableReceiptQueue + saved ledger. */
export function creditHints(budget: HintBudget, amount: number): HintBudget {
  validate(budget);
  count(amount, 'hint credit');
  const wallet = budget.wallet + amount;
  count(wallet, 'hint wallet');
  return amount === 0 ? budget : { wallet, revealedKeys: [...budget.revealedKeys] };
}
