import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { installKitGuidance, resolveKitRef } from './init-game-guidance.mjs';

const marker = '## mini-games-kit: task-routed research and kit feedback';

export const adoptGameGuidance = async ({ destination, kitRef }) => {
  if (!destination) throw new Error('Missing destination');
  const target = path.resolve(destination);
  const ref = resolveKitRef(kitRef);
  const agentsPath = path.join(target, 'AGENTS.md');
  let before;
  try {
    before = await fs.readFile(agentsPath, 'utf8');
  } catch (error) {
    if (error?.code === 'ENOENT') {
      throw new Error('This repository has no AGENTS.md; use guidance:init for a new project instead.');
    }
    throw error;
  }
  if (before.includes(marker)) throw new Error('Refusing to adopt twice: existing task routing found in AGENTS.md');
  // Preflight is performed by installKitGuidance: any existing guide is a hard error.
  const guides = await installKitGuidance({ destination: target, kitRef: ref });
  const appendix = [
    '',
    marker,
    '',
    'The existing game-specific instructions above remain authoritative for this consumer.',
    'Before a substantial task, open docs/kit-guidance/TASK_ROUTER.md and select only the',
    'relevant pinned mini-games-kit research/contracts. Do not apply the full framework',
    'or create new directors, SDKs or store features without a concrete observed need.',
    'If an original/reference screenshot, GIF, game or video is supplied, first follow',
    'docs/kit-guidance/REFERENCE_PROTOCOL.md and separate observed facts from inference.',
    'Before reusable code, inspect mini-games-kit docs/API.md at exact kit revision ' + ref + '.',
    'At the end of a material change, report KIT IMPACT: NONE / REUSE / IMPROVE /',
    'CANDIDATE / EXTRACTED per docs/kit-guidance/KIT_FEEDBACK_LOOP.md with real evidence.',
    'Upstream kit changes and consumer dependency upgrades are separate reviewed work.',
    '',
  ].join('\n');
  await fs.appendFile(agentsPath, appendix);
  return { destination: target, kitRef: ref, guides, agentsAppended: true };
};

const parse = (args) => {
  const argv = [...args];
  const destination = argv.shift();
  if (!destination) throw new Error('Usage: npm run guidance:adopt -- <existing-repository> [--kit-ref <40-char-sha>]');
  let kitRef;
  while (argv.length) {
    const flag = argv.shift(), value = argv.shift();
    if (flag !== '--kit-ref' || !value) throw new Error('Unknown or incomplete argument: ' + flag);
    kitRef = value;
  }
  return { destination, kitRef };
};

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const result = await adoptGameGuidance(parse(process.argv.slice(2)));
    console.log('Adopted task routing without replacing existing AGENTS.md: ' + result.destination);
    console.log('Pinned mini-games-kit: ' + result.kitRef);
    console.log('Guide files: ' + result.guides.join(', '));
    console.log('Review the appended section before committing; no game/runtime files were changed.');
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
