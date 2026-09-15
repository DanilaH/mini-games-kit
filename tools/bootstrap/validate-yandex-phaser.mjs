import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createYandexPhaserBootstrap } from './create-yandex-phaser.mjs';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '../..');
const templateRoot = path.join(repoRoot, 'bootstrap/yandex-phaser');
const manifest = JSON.parse(await fs.readFile(path.join(templateRoot, 'BOOTSTRAP_MANIFEST.json'), 'utf8'));
const errors = [];

for (const required of manifest.requiredFiles ?? []) {
  try {
    await fs.access(path.join(templateRoot, required));
  } catch {
    errors.push(`missing required template file: ${required}`);
  }
}

const packageTemplate = await fs.readFile(path.join(templateRoot, 'package.json'), 'utf8');
for (const placeholder of manifest.placeholders ?? []) {
  if (!packageTemplate.includes(placeholder) && placeholder !== '__PROJECT_NAME__') {
    errors.push(`package template does not contain required placeholder: ${placeholder}`);
  }
}

const templateFiles = [];
const collect = async (root, relative = '') => {
  for (const entry of await fs.readdir(path.join(root, relative), { withFileTypes: true })) {
    const next = relative ? path.join(relative, entry.name) : entry.name;
    if (entry.isDirectory()) await collect(root, next);
    else if (entry.isFile()) templateFiles.push(next);
  }
};
await collect(templateRoot);

const forbidden = [/\bCHIPS\b/i, /Hidden Pocket/i, /Overcharge/i, /Signal 2000/i, /\b672px\b/i, /\bq60\b/i, /\bq65\b/i, /\bq70\b/i];
for (const relative of templateFiles) {
  if (/\.(png|jpe?g|webp|avif|gif|woff2?|mp3|ogg|wav|zip)$/i.test(relative)) continue;
  const content = await fs.readFile(path.join(templateRoot, relative), 'utf8');
  for (const pattern of forbidden) {
    if (pattern.test(content)) errors.push(`${relative}: leaked project-specific policy/token ${pattern}`);
  }
}

const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'mini-games-kit-bootstrap-check-'));
try {
  const target = path.join(tempRoot, 'sample-game');
  const fakeSha = '0123456789abcdef0123456789abcdef01234567';
  const result = await createYandexPhaserBootstrap({ destination: target, kitRef: fakeSha, projectName: 'Sample Game' });
  const generatedPackage = JSON.parse(await fs.readFile(path.join(target, 'package.json'), 'utf8'));
  if (generatedPackage.name !== 'sample-game') errors.push('generator did not normalize project name');
  if (generatedPackage.dependencies?.['@danilah/mini-games-kit'] !== `github:DanilaH/mini-games-kit#${fakeSha}`) {
    errors.push('generator did not pin the exact mini-games-kit SHA');
  }
  for (const required of manifest.requiredFiles ?? []) {
    try {
      await fs.access(path.join(target, required));
    } catch {
      errors.push(`generated project missing required file: ${required}`);
    }
  }
  if (result.files !== templateFiles.length) errors.push('generator file count differs from template file count');
} finally {
  await fs.rm(tempRoot, { recursive: true, force: true });
}

if (errors.length > 0) {
  console.error(`Yandex Phaser bootstrap validation failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`Yandex Phaser bootstrap validation passed: ${templateFiles.length} template files, mandatory manifest intact.`);
}
