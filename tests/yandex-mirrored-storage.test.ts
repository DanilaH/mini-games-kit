import { describe, expect, it } from 'vitest';

import type { StorageAdapter } from '../src/platform/index';
import { YandexMirroredStorageAdapter, type YandexPlayerDataLike } from '../src/yandex/index';

class MemoryStorage implements StorageAdapter {
  public readonly data = new Map<string, string>();
  public async getItem(key: string): Promise<string | null> { return this.data.get(key) ?? null; }
  public async setItem(key: string, value: string): Promise<void> { this.data.set(key, value); }
  public async removeItem(key: string): Promise<void> { this.data.delete(key); }
}

class FakePlayer implements YandexPlayerDataLike {
  public readonly data = new Map<string, unknown>();
  public writes = 0;
  public async getData(keys?: readonly string[]): Promise<Record<string, unknown>> {
    const selected = keys ?? [...this.data.keys()];
    return Object.fromEntries(selected.flatMap((key) => this.data.has(key) ? [[key, this.data.get(key)]] : []));
  }
  public async setData(data: Record<string, unknown>): Promise<void> {
    this.writes += 1;
    for (const [key, value] of Object.entries(data)) {
      if (value === null) this.data.delete(key);
      else this.data.set(key, value);
    }
  }
}

const newerJson = (localRaw: string | null, cloudRaw: string | null): string | null => {
  if (localRaw === null) return cloudRaw;
  if (cloudRaw === null) return localRaw;
  const local = JSON.parse(localRaw) as { revision: number };
  const cloud = JSON.parse(cloudRaw) as { revision: number };
  return local.revision > cloud.revision ? localRaw : cloudRaw;
};

describe('YandexMirroredStorageAdapter', () => {
  it('uses injected reconciliation policy and repairs stale cloud data', async () => {
    const local = new MemoryStorage();
    const player = new FakePlayer();
    await local.setItem('save', JSON.stringify({ revision: 8 }));
    player.data.set('cloudSave', JSON.stringify({ revision: 3 }));
    const adapter = new YandexMirroredStorageAdapter(local, player, {
      syncKey: 'save',
      cloudField: 'cloudSave',
      reconcile: newerJson,
    });
    const selected = await adapter.getItem('save');
    expect(selected).toBe(JSON.stringify({ revision: 8 }));
    expect(player.data.get('cloudSave')).toBe(selected);
  });

  it('can keep staged local state local until game policy allows mirroring', async () => {
    const local = new MemoryStorage();
    const player = new FakePlayer();
    const adapter = new YandexMirroredStorageAdapter(local, player, {
      syncKey: 'save',
      cloudField: 'cloudSave',
      reconcile: newerJson,
      shouldMirror: (raw) => !(JSON.parse(raw) as { pending?: boolean }).pending,
    });
    await adapter.setItem('save', JSON.stringify({ revision: 2, pending: true }));
    expect(player.writes).toBe(0);
    await adapter.setItem('save', JSON.stringify({ revision: 3, pending: false }));
    expect(player.writes).toBe(1);
  });
});
