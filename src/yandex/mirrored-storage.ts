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
  public constructor(
    private readonly local: StorageAdapter,
    private readonly player: YandexPlayerDataLike,
    private readonly options: YandexMirroredStorageOptions,
  ) {}

  public async getItem(key: string): Promise<string | null> {
    if (key !== this.options.syncKey) return this.local.getItem(key);

    const localRaw = await this.local.getItem(key);
    let cloudRaw: string | null = null;
    try {
      const data = await this.player.getData([this.options.cloudField]);
      const value = data[this.options.cloudField];
      cloudRaw = typeof value === 'string' && value.length > 0 ? value : null;
    } catch (error: unknown) {
      this.options.onError?.('read', error);
      return localRaw;
    }

    const selected = this.options.reconcile(localRaw, cloudRaw);
    if (selected !== null && selected !== localRaw) await this.local.setItem(key, selected);

    if (selected !== null && selected !== cloudRaw && this.shouldMirror(selected)) {
      await this.mirrorBestEffort(selected);
    }

    return selected;
  }

  public async setItem(key: string, value: string): Promise<void> {
    await this.local.setItem(key, value);
    if (key !== this.options.syncKey || !this.shouldMirror(value)) return;
    await this.mirrorBestEffort(value);
  }

  public async removeItem(key: string): Promise<void> {
    await this.local.removeItem(key);
    if (key !== this.options.syncKey) return;

    try {
      await this.player.setData({ [this.options.cloudField]: null }, true);
    } catch (error: unknown) {
      this.options.onError?.('clear', error);
    }
  }

  private shouldMirror(raw: string): boolean {
    return this.options.shouldMirror?.(raw) ?? true;
  }

  private async mirrorBestEffort(raw: string): Promise<void> {
    try {
      await this.player.setData(
        { [this.options.cloudField]: raw },
        this.options.flushWrites ?? false,
      );
    } catch (error: unknown) {
      this.options.onError?.('write', error);
    }
  }
}
