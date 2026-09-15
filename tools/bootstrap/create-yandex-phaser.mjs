import fs from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '../..');
const templateRoot = path.join(repoRoot, 'bootstrap/yandex-phaser');
const TEMPLATE_MANIFEST = 'BOOTSTRAP_MANIFEST.json';
const PLACEHOLDER_PROJECT = '__PROJECT_NAME__';
const PLACEHOLDER_REF = '__MINI_GAMES_KIT_REF__';

const normalizeProjectName = (value) => {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (!normalized) throw new Error('Could not derive a valid npm project name');
  return normalized;
};

const assertExactGitSha = (value) => {
  if (!/^[0-9a-f]{40}$/i.test(value)) {
    throw new Error(`mini-games-kit ref must be an exact 40-character commit SHA, got: ${value}`);
  }
  return value.toLowerCase();
};

const resolveCurrentSha = () => {
  try {
    return assertExactGitSha(execFileSync('git', ['rev-parse', 'HEAD'], {
      cwd: repoRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim());
  } catch {
    throw new Error('Could not resolve mini-games-kit HEAD. Pass --kit-ref <40-char-sha> explicitly.');
  }
};

const listFiles = async (root, relative = '') => {
  const entries = await fs.readdir(path.join(root, relative), { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const next = relative ? path.join(relative, entry.name) : entry.name;
    if (entry.isDirectory()) files.push(...await listFiles(root, next));
    else if (entry.isFile()) files.push(next);
  }
  return files;
};

const isTextFile = (file) => !/\.(png|jpe?g|webp|avif|gif|woff2?|mp3|ogg|wav|zip)$/i.test(file);

export const createYandexPhaserBootstrap = async ({ destination, kitRef, projectName }) => {
  const target = path.resolve(destination);
  const ref = assertExactGitSha(kitRef ?? resolveCurrentSha());
  const name = normalizeProjectName(projectName ?? path.basename(target));

  try {
    const existing = await fs.readdir(target);
    if (existing.length > 0) throw new Error(`Destination is not empty: ${target}`);
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
  }
  await fs.mkdir(target, { recursive: true });

  const files = (await listFiles(templateRoot)).filter((relative) => relative !== TEMPLATE_MANIFEST);
  for (const relative of files) {
    const source = path.join(templateRoot, relative);
    const output = path.join(target, relative);
    await fs.mkdir(path.dirname(output), { recursive: true });
    if (!isTextFile(relative)) {
      await fs.copyFile(source, output);
      continue;
    }
    const content = (await fs.readFile(source, 'utf8'))
      .replaceAll(PLACEHOLDER_PROJECT, name)
      .replaceAll(PLACEHOLDER_REF, ref);
    await fs.writeFile(output, content);
  }

  const unresolved = [];
  for (const relative of await listFiles(target)) {
    if (!isTextFile(relative)) continue;
    const content = await fs.readFile(path.join(target, relative), 'utf8');
    if (content.includes(PLACEHOLDER_PROJECT) || content.includes(PLACEHOLDER_REF)) unresolved.push(relative);
  }
  if (unresolved.length > 0) throw new Error(`Unresolved bootstrap placeholders: ${unresolved.join(', ')}`);

  return { destination: target, projectName: name, kitRef: ref, files: files.length };
};

const parseCli = (argv) => {
  const args = [...argv];
  const destination = args.shift();
  if (!destination) throw new Error('Usage: npm run bootstrap:create -- <destination> [--kit-ref <sha>] [--name <npm-name>]');
  let kitRef;
  let projectName;
  while (args.length > 0) {
    const flag = args.shift();
    const value = args.shift();
    if (!value) throw new Error(`Missing value for ${flag}`);
    if (flag === '--kit-ref') kitRef = value;
    else if (flag === '--name') projectName = value;
    else throw new Error(`Unknown option: ${flag}`);
  }
  return { destination, kitRef, projectName };
};

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const result = await createYandexPhaserBootstrap(parseCli(process.argv.slice(2)));
    console.log(`Created ${result.projectName} from mandatory Yandex Phaser bootstrap (${result.files} files).`);
    console.log(`Pinned mini-games-kit: ${result.kitRef}`);
    console.log(`Next: cd ${result.destination} && npm install && npm run typecheck && npm test && npm run build`);
    console.log('Then read AGENTS.md/BOOTSTRAP.md and inspect the full current mini-games-kit docs/API.md before feature work.');
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
