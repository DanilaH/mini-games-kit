import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { auditYandexBuildDirectory, sha256File } from '../src/yandex-tooling/index';

const tempDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(tempDirectories.splice(0).map((directory) => fs.rm(directory, { recursive: true, force: true })));
});

describe('Yandex build audit', () => {
  it('requires index.html at the upload root and counts uncompressed bytes', async () => {
    const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'mini-games-kit-yandex-'));
    tempDirectories.push(directory);
    await fs.mkdir(path.join(directory, 'assets'));
    await fs.writeFile(path.join(directory, 'index.html'), 'abc');
    await fs.writeFile(path.join(directory, 'assets', 'game.js'), '12345');

    const report = await auditYandexBuildDirectory(directory, { maxUncompressedBytes: 100 });
    expect(report.errors).toEqual([]);
    expect(report.fileCount).toBe(2);
    expect(report.uncompressedBytes).toBe(8);
  });

  it('hashes the exact candidate artifact', async () => {
    const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'mini-games-kit-hash-'));
    tempDirectories.push(directory);
    const file = path.join(directory, 'candidate.zip');
    await fs.writeFile(file, 'abc');
    expect(await sha256File(file)).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
  });
});
