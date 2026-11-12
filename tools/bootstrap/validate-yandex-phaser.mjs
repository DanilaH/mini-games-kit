import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createYandexPhaserBootstrap } from './create-yandex-phaser.mjs';
import { initGameGuidance } from './init-game-guidance.mjs';
import { adoptGameGuidance } from './adopt-agent-guidance.mjs';
import { inspectGameGuidance } from './doctor-game-guidance.mjs';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '../..');
const templateRoot = path.join(repoRoot, 'bootstrap/yandex-phaser');
const manifestPath = path.join(templateRoot, 'BOOTSTRAP_MANIFEST.json');
const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
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
  if (!packageTemplate.includes(placeholder)) {
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
  const guidanceNames = ['TASK_ROUTER.md', 'REFERENCE_PROTOCOL.md', 'KIT_FEEDBACK_LOOP.md', 'NEW_PROJECT_SETUP.md'];
  for (const name of guidanceNames) {
    const file = path.join(target, 'docs', 'kit-guidance', name);
    try {
      const contents = await fs.readFile(file, 'utf8');
      if (!contents.includes(fakeSha)) errors.push('guidance missing pinned source SHA: ' + name);
      if (contents.includes('github.com/DanilaH/mini-games-kit/blob/main/docs/')) {
        errors.push('guidance refers to unpinned main: ' + name);
      }
    } catch {
      errors.push('missing generated guidance: ' + name);
    }
  }
  const gameDoctor = await inspectGameGuidance({ destination: target, expectedKitRef: fakeSha });
  if (gameDoctor.errors.length || gameDoctor.guidanceRef !== fakeSha || gameDoctor.runtimeRef !== fakeSha) {
    errors.push('generated Yandex guidance doctor failed: ' + JSON.stringify(gameDoctor.errors));
  }
  const gameClaude = await fs.readFile(path.join(target, 'CLAUDE.md'), 'utf8');
  if (!gameClaude.includes('AGENTS.md') || !gameClaude.includes('TASK_ROUTER.md') || !gameClaude.includes(fakeSha)) {
    errors.push('generated Yandex CLAUDE.md does not bridge AGENTS and pinned router');
  }
  const gameAgents = await fs.readFile(path.join(target, 'AGENTS.md'), 'utf8');
  if (!gameAgents.includes('docs/kit-guidance/TASK_ROUTER.md') || !gameAgents.includes('KIT IMPACT')) {
    errors.push('generated AGENTS does not route tasks and kit feedback');
  }

  // Guidance-only initialization must work without copying the Yandex web SDK.
  const androidTarget = path.join(tempRoot, 'sample-android');
  const android = await initGameGuidance({
    destination: androidTarget, kitRef: fakeSha, projectName: 'Sample Android', platform: 'android',
  });
  for (const required of ['AGENTS.md', 'CLAUDE.md', 'docs/PROJECT_DECISIONS.md', ...guidanceNames.map((n) => 'docs/kit-guidance/' + n)]) {
    try { await fs.access(path.join(androidTarget, required)); }
    catch { errors.push('guidance-only init missing: ' + required); }
  }
  if (android.files.length !== 7) errors.push('guidance-only init produced wrong file count');
  const androidAgents = await fs.readFile(path.join(androidTarget, 'AGENTS.md'), 'utf8');
  if (!androidAgents.includes(fakeSha) || !androidAgents.includes('docs/kit-guidance/TASK_ROUTER.md')) {
    errors.push('guidance-only AGENTS missing pinned routing');
  }
  let refusedOverwrite = false;
  try {
    await initGameGuidance({ destination: androidTarget, kitRef: fakeSha, platform: 'android' });
  } catch (error) {
    refusedOverwrite = /Refusing to overwrite/.test(String(error?.message));
  }
  if (!refusedOverwrite) errors.push('guidance-only init overwrote existing project files');
  const preserved = await fs.readFile(path.join(androidTarget, 'AGENTS.md'), 'utf8');
  if (preserved !== androidAgents) errors.push('guidance-only init changed existing AGENTS after refusal');
  // An existing game must retain its own contract and receive only a small appendix.
  const existingTarget = path.join(tempRoot, 'existing-android-game');
  await fs.mkdir(existingTarget);
  const existingAgents = '# Existing product contract\n\nCore rules and release history are game-owned.\n';
  await fs.writeFile(path.join(existingTarget, 'AGENTS.md'), existingAgents);
  await adoptGameGuidance({ destination: existingTarget, kitRef: fakeSha });
  const adoptedAgents = await fs.readFile(path.join(existingTarget, 'AGENTS.md'), 'utf8');
  if (!adoptedAgents.startsWith(existingAgents) || !adoptedAgents.includes('KIT IMPACT') ||
      !adoptedAgents.includes(fakeSha) || !adoptedAgents.includes('docs/kit-guidance/TASK_ROUTER.md')) {
    errors.push('guidance:adopt damaged or failed to extend existing instructions');
  }
  for (const name of guidanceNames) {
    try { await fs.access(path.join(existingTarget, 'docs', 'kit-guidance', name)); }
    catch { errors.push('guidance:adopt missing guide: ' + name); }
  }
  let adoptRefusedDuplicate = false;
  try {
    await adoptGameGuidance({ destination: existingTarget, kitRef: fakeSha });
  } catch (error) {
    adoptRefusedDuplicate = /Refusing to adopt twice/.test(String(error?.message));
  }
  if (!adoptRefusedDuplicate) errors.push('guidance:adopt allowed a duplicate setup');
  if (await fs.readFile(path.join(existingTarget, 'AGENTS.md'), 'utf8') !== adoptedAgents) {
    errors.push('duplicate adopt modified existing instructions');
  }

  try {
    await fs.access(path.join(target, 'BOOTSTRAP_MANIFEST.json'));
    errors.push('template-only BOOTSTRAP_MANIFEST.json leaked into generated project');
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
  }

  const generatedFiles = [];
  const collectGenerated = async (relative = '') => {
    for (const entry of await fs.readdir(path.join(target, relative), { withFileTypes: true })) {
      const next = relative ? path.join(relative, entry.name) : entry.name;
      if (entry.isDirectory()) await collectGenerated(next);
      else if (entry.isFile()) generatedFiles.push(next);
    }
  };
  await collectGenerated();
  if (result.files !== generatedFiles.length) errors.push('generator reported file count differs from actual generated output');

  for (const relative of generatedFiles) {
    if (/\.(png|jpe?g|webp|avif|gif|woff2?|mp3|ogg|wav|zip)$/i.test(relative)) continue;
    const content = await fs.readFile(path.join(target, relative), 'utf8');
    for (const placeholder of manifest.placeholders ?? []) {
      if (content.includes(placeholder)) errors.push(`${relative}: unresolved generated placeholder ${placeholder}`);
    }
  }
} finally {
  await fs.rm(tempRoot, { recursive: true, force: true });
}

if (errors.length > 0) {
  console.error(`Yandex Phaser bootstrap validation failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`Yandex Phaser bootstrap validation passed: ${templateFiles.length - 1} generated files, mandatory manifest intact.`);
}
