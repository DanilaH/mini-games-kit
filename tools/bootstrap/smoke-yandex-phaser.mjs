import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { createYandexPhaserBootstrap } from './create-yandex-phaser.mjs';
import { inspectGameGuidance } from './doctor-game-guidance.mjs';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '../..');
const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'mini-games-kit-bootstrap-smoke-'));
const target = path.join(tempRoot, 'bootstrap-smoke');

const runNpm = (args) => execFileSync('npm', args, { cwd: target, stdio: 'inherit', env: process.env });

try {
  const head = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: repoRoot, encoding: 'utf8' }).trim();
  await createYandexPhaserBootstrap({ destination: target, kitRef: head, projectName: 'bootstrap-smoke' });

  const guidance = await inspectGameGuidance({ destination: target, expectedKitRef: head });
  if (guidance.errors.length || guidance.uiRoutes.missing.length ||
      guidance.guidanceRef !== head || guidance.runtimeRef !== head) {
    throw new Error('Generated bootstrap guidance is incomplete: ' + JSON.stringify({
      errors: guidance.errors, missingUiRoutes: guidance.uiRoutes.missing,
      guidanceRef: guidance.guidanceRef, runtimeRef: guidance.runtimeRef,
    }));
  }

  const packagePath = path.join(target, 'package.json');
  const pkg = JSON.parse(await fs.readFile(packagePath, 'utf8'));
  execFileSync('npm', ['pack', '--pack-destination', tempRoot], { cwd: repoRoot, stdio: 'ignore' });
  const archive = (await fs.readdir(tempRoot)).find(name => name.endsWith('.tgz'));
  if (!archive) throw new Error('Package archive missing');
  pkg.dependencies['@danilah/mini-games-kit'] = `file:${path.join(tempRoot, archive)}`;
  await fs.writeFile(packagePath, `${JSON.stringify(pkg, null, 2)}\n`);

  runNpm(['install', '--no-audit', '--no-fund']);
  runNpm(['run', 'typecheck']);
  runNpm(['test']);
  runNpm(['run', 'build']);
  execFileSync('node', ['tools/yandex-audit.mjs'], { cwd: target, stdio: 'inherit', env: process.env });
  console.log('Generated Yandex Phaser bootstrap smoke test passed.');
} finally {
  await fs.rm(tempRoot, { recursive: true, force: true });
}
