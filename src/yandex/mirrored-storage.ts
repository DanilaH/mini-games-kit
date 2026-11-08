import { withDeadline } from './deadline.js';
import type { StorageAdapter } from '../platform/storage.js';

export interface YandexPlayerDataLike {
  getData(keys?: readonly string[]): Promise<Record<string, unknown>>;
  setData(data: Record<string, unknown>, flush?: boolean): Promise<void>;
}

export interface MirroredStorageReconciler {
  (localRaw: string | null, cloudRaw: string | null): string | null;
}

export interface YandexMirroredStorageOptions {
  syncKey: string;
  cloudField: string;
  reconcile: MirroredStorageReconciler;
  shouldMirror?: (raw: string) => boolean;
  flushWrites?: boolean;
  onError?: (operation: 'read' | 'write' | 'clear', error: unknown) => void;
}

/** Prefer cloud when both copies exist. Suitable only when cloud is intentionally canonical. */
export const preferCloudCopy: MirroredStorageReconciler = (localRaw, cloudRaw) => cloudRaw ?? localRaw;

/**
 * Mirrors one selected local storage key into Yandex Player Data.
 * Conflict policy is injected by the game; the adapter knows nothing about save schemas,
 * progress counters or pending transactions.
 */
export class YandexMirroredStorageAdapter implements StorageAdapter {
  private epoch = 0;
  private localTail: Promise<unknown> = Promise.resolve();
  private cloudRunning = false;
  private cloudPending: {raw: string|null}|undefined;
  private localOperation<T>(fn: () => Promise<T>): Promise<T> {
    const result = this.localTail.then(fn);
    this.localTail = result.catch(() => undefined);
    return result;
  }
  private report(operation: 'read' | 'write' | 'clear', error: unknown): void {
    try { this.options.onError?.(operation, error); } catch { /* Diagnostic only. */ }
  }
  private queueMirror(raw: string | null): void {
    this.cloudPending = {raw};
    if (this.cloudRunning) return;
    this.cloudRunning = true;
    void (async () => {
      while (this.cloudPending) {
        const next = this.cloudPending.raw;
        this.cloudPending = undefined;
        try { await this.player.setData({[this.options.cloudField]: next}, next === null || (this.options.flushWrites ?? false)); }
        catch (error: unknown) { this.report(next === null ? 'clear' : 'write', error); }
      }
      this.cloudRunning = false;
    })();
  }

  public constructor(
    private readonly local: StorageAdapter,
    private readonly player: YandexPlayerDataLike,
    private readonly options: YandexMirroredStorageOptions,
  ) {}

  public async getItem(key: string): Promise<string | null> {
    if (key !== this.options.syncKey) return this.local.getItem(key);

    const epoch = this.epoch;
    const localRaw = await this.localOperation(() => this.local.getItem(key));
    let cloudRaw: string | null = null;
    try {
      const data = await withDeadline(this.player.getData([this.options.cloudField]), 3000);
      const value = data[this.options.cloudField];
      cloudRaw = typeof value === 'string' && value.length > 0 ? value : null;
    } catch (error: unknown) {
      this.report('read', error);
      return this.localOperation(() => this.local.getItem(key));
    }

    return this.localOperation(async () => {
      if (epoch !== this.epoch) return this.local.getItem(key);
      const selected = this.options.reconcile(localRaw, cloudRaw);
      if (selected !== null && selected !== localRaw) {
        this.epoch++;
        await this.local.setItem(key, selected);
      }
      if (selected !== null && selected !== cloudRaw && this.shouldMirror(selected)) this.queueMirror(selected);
      return selected;
    });
  }

  public setItem(key: string, value: string): Promise<void> {
    this.epoch++;
    return this.localOperation(async () => {
      await this.local.setItem(key, value);
      if (key === this.options.syncKey && this.shouldMirror(value)) this.queueMirror(value);
    });
  }

  public removeItem(key: string): Promise<void> {
    this.epoch++;
    return this.localOperation(async () => {
      await this.local.removeItem(key);
      if (key === this.options.syncKey) this.queueMirror(null);
    });
  }

  private shouldMirror(raw: string): boolean {
    return this.options.shouldMirror?.(raw) ?? true;
  }
}
