import fs from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const rootGuidance = 'docs/agent-workflows';
const templateRoot = 'bootstrap/game-guidance';
const sharedGuidance = ['TASK_ROUTER.md', 'REFERENCE_PROTOCOL.md', 'KIT_FEEDBACK_LOOP.md', 'NEW_PROJECT_SETUP.md'];
const platforms = new Set(['android', 'yandex', 'web']);

export const exactKitRef = (value) => {
  if (typeof value !== 'string' || !/^[a-fA-F0-9]{40}$/.test(value)) {
    throw new Error('mini-games-kit ref must be an exact 40-character commit SHA');
  }
  return value.toLowerCase();
};

export const resolveKitRef = (kitRef) => {
  if (kitRef) return exactKitRef(kitRef);
  try {
    return exactKitRef(execFileSync('git', ['rev-parse', 'HEAD'], {
      cwd: repoRoot, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'],
    }).trim());
  } catch {
    throw new Error('Could not resolve kit HEAD; pass --kit-ref <40-char-sha>');
  }
};

const npmName = (value) => {
  const name = value.trim().toLowerCase().replace(/[^a-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '');
  if (!name) throw new Error('Cannot derive a valid project name');
  return name;
};

const substitutions = (content, { kitRef, projectName, platform }) => content
  .replaceAll('__MINI_GAMES_KIT_REF__', kitRef)
  .replaceAll('__PROJECT_NAME__', projectName)
  .replaceAll('__PROJECT_PLATFORM__', platform);

const pinnedLinks = (content, kitRef) => content.replace(/\]\((\.\.\/[^)]+)\)/g, (_, relative) => {
  const [file, ...fragments] = relative.split('#');
  const normalized = path.posix.normalize(path.posix.join(rootGuidance, file));
  if (normalized.startsWith('../') || path.posix.isAbsolute(normalized)) throw new Error('Invalid guide link: ' + relative);
  return '](https://github.com/DanilaH/mini-games-kit/blob/' + kitRef + '/' + normalized +
    (fragments.length ? '#' + fragments.join('#') : '') + ')';
});

const ensureAvailable = async (destination, files) => {
  const target = path.resolve(destination);
  const unique = new Set();
  for (const item of files) {
    if (unique.has(item.path)) throw new Error('Duplicate guidance output: ' + item.path);
    unique.add(item.path);
    const output = path.join(target, item.path);
    try {
      await fs.lstat(output);
      throw new Error('Refusing to overwrite an existing project file: ' + output);
    } catch (error) {
      if (error?.code !== 'ENOENT') throw error;
    }
  }
  return target;
};

const writeGuidance = async (destination, files) => {
  const target = await ensureAvailable(destination, files);
  await fs.mkdir(target, { recursive: true });
  for (const item of files) {
    const full = path.join(target, item.path);
    await fs.mkdir(path.dirname(full), { recursive: true });
    await fs.writeFile(full, item.content, { flag: 'wx' });
  }
  return files.map((item) => item.path);
};

export const installKitGuidance = async ({ destination, kitRef }) => {
  const ref = resolveKitRef(kitRef);
  const files = await Promise.all(sharedGuidance.map(async (file) => {
    const raw = await fs.readFile(path.join(repoRoot, rootGuidance, file), 'utf8');
    return { path: 'docs/kit-guidance/' + file, content: pinnedLinks(raw, ref) };
  }));
  return writeGuidance(destination, files);
};

export const initGameGuidance = async ({ destination, kitRef, projectName, platform = 'android' }) => {
  if (!destination) throw new Error('Missing destination');
  if (!platforms.has(platform)) throw new Error('Unsupported platform for guidance: ' + platform);
  const ref = resolveKitRef(kitRef);
  const name = npmName(projectName ?? path.basename(path.resolve(destination)));
  const context = { kitRef: ref, projectName: name, platform };
  const files = await Promise.all([
    ['AGENTS.md', 'AGENTS.md'],
    ['CLAUDE.md', 'CLAUDE.md'],
    ['PROJECT_DECISIONS.md', 'docs/PROJECT_DECISIONS.md'],
  ].map(async ([source, output]) => {
    const raw = await fs.readFile(path.join(repoRoot, templateRoot, source), 'utf8');
    return { path: output, content: substitutions(raw, context) };
  }));
  const shared = await Promise.all(sharedGuidance.map(async (file) => {
    const raw = await fs.readFile(path.join(repoRoot, rootGuidance, file), 'utf8');
    return { path: 'docs/kit-guidance/' + file, content: pinnedLinks(raw, ref) };
  }));
  const written = await writeGuidance(destination, [...files, ...shared]);
  return { destination: path.resolve(destination), projectName: name, platform, kitRef: ref, files: written };
};

const parseArgs = (argv) => {
  const args = [...argv];
  const destination = args.shift();
  if (!destination) throw new Error('Usage: npm run guidance:init -- <destination> [--platform android|yandex|web] [--kit-ref <sha>] [--name <project>]');
  const values = { destination };
  while (args.length) {
    const flag = args.shift();
    const value = args.shift();
    if (!value) throw new Error('Missing value for ' + flag);
    if (flag === '--platform') values.platform = value;
    else if (flag === '--kit-ref') values.kitRef = value;
    else if (flag === '--name') values.projectName = value;
    else throw new Error('Unknown option ' + flag);
  }
  return values;
};

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const result = await initGameGuidance(parseArgs(process.argv.slice(2)));
    console.log('Created agent guidance for ' + result.projectName + ' (' + result.platform + ')');
    console.log('Pinned mini-games-kit: ' + result.kitRef);
    console.log('Wrote: ' + result.files.join(', '));
    console.log('Guidance only: no Phaser/Capacitor, SDK, ads, CI or store settings were installed.');
    console.log('Next: read AGENTS.md, docs/PROJECT_DECISIONS.md and the local task router before feature work.');
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
