import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const GUIDES = ['TASK_ROUTER.md', 'REFERENCE_PROTOCOL.md', 'KIT_FEEDBACK_LOOP.md', 'NEW_PROJECT_SETUP.md'];
const SHA = /^[0-9a-f]{40}$/i;
const routerPath = 'docs/kit-guidance/TASK_ROUTER.md';

const readIfExists = async (file) => {
  try { return await fs.readFile(file, 'utf8'); }
  catch (error) { if (error?.code === 'ENOENT') return null; throw error; }
};
const codeMessage = (category, message) => ({ category, message });

/** Read-only diagnostic; never upgrades dependency or rewrites project instructions. */
export async function inspectGameGuidance({ destination, expectedKitRef } = {}) {
  if (!destination) throw new Error('Missing consumer repository path');
  if (expectedKitRef && !SHA.test(expectedKitRef)) throw new Error('Expected kit ref must be a complete 40-character SHA');
  const root = path.resolve(destination);
  const errors = [], warnings = [], notes = [];
  const agents = await readIfExists(path.join(root, 'AGENTS.md'));
  const decisions = await readIfExists(path.join(root, 'docs/PROJECT_DECISIONS.md'));
  const claude = await readIfExists(path.join(root, 'CLAUDE.md'));
  const expected = expectedKitRef?.toLowerCase();

  if (!agents) errors.push(codeMessage('AGENTS_MISSING', 'No root AGENTS.md: agent-specific instruction loading cannot be assumed'));
  else {
    for (const required of ['TASK_ROUTER.md', 'REFERENCE_PROTOCOL.md', 'KIT_FEEDBACK_LOOP.md', 'KIT IMPACT']) {
      if (!agents.includes(required)) errors.push(codeMessage('AGENTS_CONTRACT', 'AGENTS.md lacks ' + required));
    }
  }
  const pins = [];
  if (agents) {
    const direct = [
      /Guidance snapshot pin:\*{0,2}\s*([0-9a-f]{40})/i,
      /Research guidance snapshot SHA:\s*([0-9a-f]{40})/i,
      /(?:Research )?Guidance snapshot:\s*([0-9a-f]{40})/i,
      /mini-games-kit pinned commit:\*{0,2}\s*([0-9a-f]{40})/i,
    ];
    for (const pattern of direct) {
      const result = agents.match(pattern);
      if (result) pins.push(result[1].toLowerCase());
    }
    if (!pins.length) errors.push(codeMessage('NO_GUIDANCE_PIN', 'AGENTS.md does not declare an exact guidance snapshot SHA'));
  }
  if (decisions) {
    // Project decisions are game-owned; they may contain another runtime SHA.
    if (!decisions.includes('Guidance snapshot SHA:') && !decisions.includes('mini-games-kit')) {
      warnings.push(codeMessage('DECISIONS_CONTEXT', 'PROJECT_DECISIONS.md exists but has no identifiable kit source'));
    }
  } else {
    warnings.push(codeMessage('DECISIONS_MISSING', 'No docs/PROJECT_DECISIONS.md: record pinned runtime and product decisions without overwriting an existing project log'));
  }

  const hrefPins = [];
  const linksWithoutPins = [];
  for (const name of GUIDES) {
    const file = path.join(root, 'docs/kit-guidance', name);
    const body = await readIfExists(file);
    if (!body) { errors.push(codeMessage('GUIDE_MISSING', 'Missing docs/kit-guidance/' + name)); continue; }
    const urls = [...body.matchAll(/https:\/\/github\.com\/DanilaH\/mini-games-kit\/blob\/([^/)\s]+)\/([^\s)#]+)/g)];
    if (!urls.length) warnings.push(codeMessage('NO_PINNED_LINKS', name + ' has no pinned kit source links'));
    for (const match of urls) {
      if (!SHA.test(match[1])) linksWithoutPins.push(name + ': ' + match[1]);
      else hrefPins.push(match[1].toLowerCase());
    }
    if (/https:\/\/github\.com\/DanilaH\/mini-games-kit\/blob\/main\//i.test(body)) {
      linksWithoutPins.push(name + ': main');
    }
  }
  if (linksWithoutPins.length) errors.push(codeMessage('UNPINNED_LINKS', linksWithoutPins.join('; ')));
  const guideRefs = [...new Set(hrefPins)];
  if (guideRefs.length > 1) errors.push(codeMessage('MIXED_GUIDANCE_REFS', 'Guidance links mix revisions: ' + guideRefs.join(', ')));
  const guidanceRef = pins[0] ?? guideRefs[0] ?? null;
  if (pins.length > 1 || pins.some(pin => pin !== guidanceRef) || guideRefs.some(ref => ref !== guidanceRef)) {
    errors.push(codeMessage('PIN_MISMATCH', 'AGENTS.md guidance pin and local research links differ'));
  }
  if (expected && guidanceRef && expected !== guidanceRef) {
    warnings.push(codeMessage('GUIDANCE_UPDATE_AVAILABLE', 'Local guidance ' + guidanceRef + ' differs from explicitly supplied target kit ref ' + expected + '; review and adopt deliberately'));
  }
  if (claude && (!claude.includes('AGENTS.md') || !claude.includes('TASK_ROUTER.md'))) {
    warnings.push(codeMessage('CLAUDE_SHIM', 'Existing CLAUDE.md does not point to the kit AGENTS/Task Router; review before changing this file'));
  }
  if (!claude) {
    notes.push('Claude Code does not reliably auto-load root AGENTS.md; a minimal reviewed CLAUDE.md bridge is recommended if Claude Code is used.');
  }

  const packageText = await readIfExists(path.join(root, 'package.json'));
  let runtimeRef = null, runtimeSpecifier = null;
  if (packageText) {
    let pkg;
    try { pkg = JSON.parse(packageText); }
    catch { warnings.push(codeMessage('INVALID_PACKAGE', 'package.json is not valid JSON')); }
    const spec = pkg && (pkg.dependencies?.['@danilah/mini-games-kit'] ?? pkg.devDependencies?.['@danilah/mini-games-kit']);
    if (typeof spec === 'string') {
      runtimeSpecifier = spec;
      const match = spec.match(/(?:^|#)([a-f0-9]{40})$/i);
      if (match) runtimeRef = match[1].toLowerCase();
      else warnings.push(codeMessage('RUNTIME_PIN_UNVERIFIED', 'Kit runtime specifier is not an exact visible commit: ' + spec));
    } else notes.push('No direct @danilah/mini-games-kit dependency found; Android guidance-only or vendored kit must be checked separately.');
  } else {
    notes.push('No package.json; cannot infer runtime API availability from guidance.');
  }
  if (guidanceRef && runtimeRef && guidanceRef !== runtimeRef) {
    notes.push('Guidance and runtime pins intentionally differ; API imports must use runtime ' + runtimeRef + ', not guidance ' + guidanceRef + '.');
  }
  if (expected && runtimeRef && expected !== runtimeRef) {
    notes.push('Runtime pin differs from supplied target kit ref; this is NOT an automatic dependency upgrade.');
  }
  // Only diagnose whether files are present and internally coherent.
  // Markdown cannot prove that a particular Codex/Copilot/Claude harness loaded them.
  return { destination: root, status: errors.length ? 'NEEDS_REVIEW' : 'READY_FOR_AGENT_DISCOVERY',
    guidanceRef, runtimeRef, runtimeSpecifier, expectedKitRef: expected ?? null,
    errors, warnings, notes };
}

const parseArgs = (args) => {
  const argv = [...args], destination = argv.shift();
  if (!destination) throw new Error('Usage: npm run guidance:doctor -- <repo> [--expected-kit-ref <sha>] [--json] [--strict]');
  const options = { destination, strict: false, json: false };
  while (argv.length) {
    const flag = argv.shift();
    if (flag === '--json') options.json = true;
    else if (flag === '--strict') options.strict = true;
    else if (flag === '--expected-kit-ref') options.expectedKitRef = argv.shift();
    else throw new Error('Unsupported flag: ' + flag);
  }
  return options;
};

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const args = parseArgs(process.argv.slice(2));
    const result = await inspectGameGuidance(args);
    if (args.json) console.log(JSON.stringify(result, null, 2));
    else {
      console.log('Agent guidance: ' + result.status);
      console.log('Consumer: ' + result.destination);
      console.log('Research guidance: ' + (result.guidanceRef ?? 'UNKNOWN'));
      console.log('Runtime dependency: ' + (result.runtimeRef ?? result.runtimeSpecifier ?? 'UNKNOWN / NOT INSTALLED'));
      for (const problem of result.errors) console.log('ERROR ' + problem.category + ': ' + problem.message);
      for (const problem of result.warnings) console.log('WARN  ' + problem.category + ': ' + problem.message);
      for (const note of result.notes) console.log('NOTE: ' + note);
      console.log('This verifies files and references, NOT whether an agent harness actually followed the instructions.');
    }
    if (args.strict && result.errors.length) process.exitCode = 1;
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
