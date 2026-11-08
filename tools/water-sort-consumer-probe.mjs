// Temporary integration into the actual Phaser3 consumer; never rewrites the source checkout.
import { cp, mkdir, mkdtemp, readFile, writeFile, symlink } from 'node:fs/promises';
import { resolve, join, relative, sep } from 'node:path';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { resolveNativeSafeAreaCss, resolveNativeBannerPlacement } from '../dist/layout/native-banner-placement.js';

const args = process.argv.slice(2), sourceIndex = args.indexOf('--source');
if (sourceIndex < 0 || !args[sourceIndex + 1] || args[sourceIndex + 1].startsWith('--')) throw Error('Pass --source /absolute/path/to/watery-water-sort');
const donor = resolve('.'), consumer = resolve(args[sourceIndex + 1]);
const git = (cwd, ...args) => {
  const r = spawnSync('git', args, { cwd, encoding: 'utf8', timeout: 30000 });
  if (r.status !== 0) throw Error(r.stderr || 'git failed'); return r.stdout.trim();
};
await mkdir('.test-output', { recursive: true });
const probe = await mkdtemp(resolve('.test-output/water-sort-consumer-'));
const excluded = new Set(['.git', 'node_modules', 'dist', 'android', '.test-output', 'test-results', 'playwright-report']);
await cp(consumer, probe, { recursive: true, filter: path => !excluded.has(relative(consumer, path).split(sep)[0]) });
await symlink(join(consumer, 'node_modules'), join(probe, 'node_modules'), 'dir');
const report = { donor: git(donor, 'rev-parse', 'HEAD'), consumer: git(consumer, 'rev-parse', 'HEAD'),
  donorDirty: Boolean(git(donor, 'status', '--porcelain')), consumerDirty: Boolean(git(consumer, 'status', '--porcelain')),
  donorFileHashes: {}, probe, checks: [], limits: [
    'Temporary Phaser3 integration, not a released consumer dependency upgrade.',
    'Native SDK callbacks are doubled; no physical device, live fill, audible/haptic quality or store acceptance is inferred.',
  ] };
async function saveReport() { await writeFile(resolve('.test-output/water-sort-consumer.json'), JSON.stringify(report, null, 2)); }
async function run(name, command, argv, cwd = probe) {
  const result = spawnSync(command, argv, { cwd, encoding: 'utf8', timeout: 300000, maxBuffer: 20 * 1024 * 1024 });
  await writeFile(join(probe, name + '.log'), (result.stdout ?? '') + (result.stderr ?? '') + (result.error ? '\n' + result.error.message : ''));
  report.checks.push({ name, exitCode: result.status, ...(result.error ? { error: result.error.message } : {}) });
  await saveReport(); console.log(name, result.status);
  if (result.status !== 0) throw Error(name + ' failed: ' + join(probe, name + '.log'));
}
for (const file of ['feel/damped-motion.ts', 'layout/native-banner-placement.ts']) {
  const contents = await readFile(join(donor, 'src', file));
  const dest = join(probe, 'vendor/mini-games-kit', file); await mkdir(resolve(dest, '..'), { recursive: true }); await writeFile(dest, contents);
  report.donorFileHashes[file] = createHash('sha256').update(contents).digest('hex');
}
// Replace only the proven analytic oscillator, preserving the game's tuning/stream/cork profiles.
const liquidPath = join(probe, 'src/game/liquid.ts');
let liquid = await readFile(liquidPath, 'utf8');
const match = /export function stepLiquid\(s:LiquidMotion,dt:number,force=0\)\{[\s\S]*?\n\}/g;
if ([...liquid.matchAll(match)].length !== 1) throw Error('Source oscillator changed; review the adapter');
liquid = "import {stepDampedMotion} from '../../vendor/mini-games-kit/feel/damped-motion';\n" + liquid.replace(match,
  'export function stepLiquid(s:LiquidMotion,dt:number,force=0){stepDampedMotion(s,dt,{angularFrequency:23,damping:5.2,force});}');
await writeFile(liquidPath, liquid);
// Dense numeric equivalence against the original source implementation, separate from visual tests.
const original = await readFile(join(consumer, 'src/game/liquid.ts'), 'utf8');
const body = original.match(/export function stepLiquid\(s:LiquidMotion,dt:number,force=0\)\{([\s\S]*?)\n\}/)?.[1];
if (!body) throw Error('Missing source oscillator');
await writeFile(join(probe, 'tests/kit-motion-equivalence.test.ts'), `import {expect,it} from 'vitest';
import {stepLiquid} from '../src/game/liquid';
const reference=new Function('s','dt','force',${JSON.stringify(body)});
it('matches the unchanged source oscillator under repeated impulses and phase changes',()=>{
 const a={x:1.4,v:27},b={...a};
 for(let i=0;i<600;i++){if(i%37===0){a.v+=13;b.v+=13;}const dt=[1/30,1/60,1/144,.08][i%4],force=i%83<30?11:0;
 reference(a,dt,force);stepLiquid(b,dt,force);expect(b.x).toBeCloseTo(a.x,10);expect(b.v).toBeCloseTo(a.v,9);}
});\n`);
await run('consumer-build', 'npm', ['run', 'build']);
await run('consumer-model', 'npx', ['vitest', 'run', 'tests/kit-motion-equivalence.test.ts', 'tests/liquid.test.ts', 'tests/liquid-surface.test.ts',
  'tests/economy.test.ts', 'tests/assist48.test.ts', 'tests/content-revisions.test.ts', 'tests/hidden.test.ts', 'tests/progress.test.ts', 'tests/stars.test.ts', 'tests/hint-route.test.ts']);

// Cross-language fixtures run actual Java code, not a hand-transcribed second implementation.
const profiles = [[392,872,1080,2400,0,2400,130],[360,800,720,1600,0,1600,48],[393,852,1080,2340,0,2340,72],
  [412,915,1440,3200,0,3200,168],[360,704,720,1600,48,1408,144],[480,880,1200,2400,75,2200,120]];
const javaDir = join(probe, 'java'), classDir = join(javaDir, 'classes'); await mkdir(classDir, { recursive: true });
const nativeSource = await readFile(join(consumer, 'android/app/src/main/java/com/danilah/waterywatersort/BannerGeometry.java'));
await writeFile(join(javaDir, 'BannerGeometry.java'), nativeSource);
report.nativeGeometryHash = createHash('sha256').update(nativeSource).digest('hex');
const expected = [], statements = [];
for (const [vw,vh,width,rootHeight,top,height,bottom] of profiles) {
  const input = { viewport: { width: vw, height: vh }, webView: { x: 0, y: top, width, height },
    root: { width, height: rootHeight }, safeInsets: { left: 0, top: 0, right: 0, bottom } };
  const safe = resolveNativeSafeAreaCss(input); if (safe.kind !== 'safe') throw Error('fixture has no safe area');
  const y = vh - safe.insets.bottom - 60;
  const place = resolveNativeBannerPlacement({ ...input, slot: { x: 12, y, width: vw - 24, height: 60 }, adHeight: 60 });
  if (place.kind !== 'place') throw Error('fixture does not fit');
  expected.push(`${safe.insets.bottom}:${place.rect.x},${place.rect.y},${place.rect.width},${place.rect.height}`);
  statements.push(`{int inset=BannerGeometry.requiredBottomInsetCss(${vh},(double)${width}/${vw},${top},${height},${rootHeight},${bottom});
   BannerGeometry.Mapped m=BannerGeometry.map(12,${vh}-inset-60,${vw}-24,60,${vw},${vh},0,${top},${width},${height},${width},${rootHeight},0,0,0,${bottom});
   if(m==null)throw new AssertionError("fixture did not fit");System.out.println(inset+":"+m.x+","+m.centeredTop(60)+","+m.width+",60");}`);
}
await writeFile(join(javaDir, 'WaterKitProbe.java'), `package com.danilah.waterywatersort;public class WaterKitProbe{public static void main(String[] args){${statements.join('\n')}}}`);
await run('native-geometry-compile', 'java', ['-m', 'jdk.compiler/com.sun.tools.javac.Main', '-d', classDir, join(javaDir, 'BannerGeometry.java'), join(javaDir, 'WaterKitProbe.java')]);
await run('native-geometry', 'java', ['-cp', classDir, 'com.danilah.waterywatersort.WaterKitProbe']);
const actual = (await readFile(join(probe, 'native-geometry.log'), 'utf8')).trim().split(/\r?\n/);
if (JSON.stringify(actual) !== JSON.stringify(expected)) throw Error('Java/TypeScript banner mismatch');
report.checks.push({ name: 'native-typescript-geometry-parity', exitCode: 0, cases: profiles.length }); await saveReport();
await run('native-ads-negative-control', 'python3', ['tools/test-native-ads.py', '--baseline'], consumer);
await run('native-ads-current', 'python3', ['tools/test-native-ads.py'], consumer);
if (args.includes('--browser')) {
  // These source scenarios use an explicitly mocked native bridge; they exercise real game UI.
  await run('consumer-browser', 'npx', ['playwright', 'test', 'tests/browser/liquid22.spec.ts', 'tests/browser/direct51.spec.ts',
    'tests/browser/economy42.spec.ts', 'tests/browser/polish.spec.ts', '--workers=1']);
  await run('consumer-ad-return', 'npx', ['playwright', 'test', 'tests/browser/interstitial43.spec.ts', '--workers=1']);
  await run('consumer-assistance-ui', 'npx', ['playwright', 'test', 'tests/browser/assist48.spec.ts', 'tests/browser/header57.spec.ts', '--grep-invert', '640×320', '--workers=1']);
} else { report.limits.push('Browser scenarios not requested; rerun with --browser for visual/input lifecycle coverage.'); await saveReport(); }
console.log('Water Sort consumer probe PASS', probe);
