// Isolated integration probe; never updates a consumer's tracked vendor snapshot.
import {cp,mkdir,mkdtemp,readFile,writeFile,symlink} from 'node:fs/promises';
import {resolve,join,relative,sep} from 'node:path';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const source=process.argv[process.argv.indexOf('--source')+1];
if(!process.argv.includes('--source')||!source)throw Error('Pass --source /absolute/path/to/road-lines');
const donor=resolve('.'),consumer=resolve(source);await mkdir('.test-output',{recursive:true});const probe=await mkdtemp(resolve('.test-output/road-lines-consumer-'));
const excluded=new Set(['.git','node_modules','dist','android','.test-output']);
await cp(consumer,probe,{recursive:true,filter:path=>!excluded.has(relative(consumer,path).split(sep)[0])});await symlink(join(consumer,'node_modules'),join(probe,'node_modules'),'dir');
const copied=['platform/activity.ts','feel/touch-activation.ts','feel/polyline-markers.ts','audio/sample-sequence.ts','audio/one-shot-player.ts','phaser/destroy-renderer.ts'];
const hashes={};for(const file of copied){const text=await readFile(join(donor,'src',file));const dest=join(probe,'vendor/mini-games-kit/src',file);await mkdir(resolve(dest,'..'),{recursive:true});await writeFile(dest,text);hashes[file]=createHash('sha256').update(text).digest('hex');}
await writeFile(join(probe,'src/services/thumb-controls.ts'),`import {installTouchActivation} from '../../vendor/mini-games-kit/src/feel/touch-activation';
export function installThumbControls(root:HTMLElement):()=>void{return installTouchActivation(root,{resolveButton:target=>target instanceof Element?target.closest<HTMLButtonElement>('.play-controls button'):null});}\n`);
await writeFile(join(probe,'src/platform/destroy-renderer.ts'),`export {destroyRenderer} from '../../vendor/mini-games-kit/src/phaser/destroy-renderer';\n`);
const geo=join(probe,'src/presentation/geometry.ts');let g=await readFile(geo,'utf8');g=g.slice(0,g.indexOf('/** A single arc-length phase'))+`export function routeDots(points:readonly {x:number;y:number}[],spacing:number,radius:number){return polylineMarkers(points,{spacing,minDistance:radius*3});}\n`;await writeFile(geo,`import {polylineMarkers} from '../../vendor/mini-games-kit/src/feel/polyline-markers';\n`+g);
const audio=join(probe,'src/presentation/sound-sequence.ts');let a=await readFile(audio,'utf8');a=`import {MusicalSampleSequence} from '../../vendor/mini-games-kit/src/audio/sample-sequence';\n`+a;a=a.replace("  private level = '';",`  private melody = new MusicalSampleSequence({variants:4,phrase:phrases[0],maxAdjacentSemitones:3,random:()=>this.random()});\n  private level = '';`);a=a.replace("    this.counters.set('cell', 0);",`    this.counters.set('cell', 0);\n    this.melody = new MusicalSampleSequence({variants:4,phrase:phrases[this.phrase]!,maxAdjacentSemitones:3,random:()=>this.random()});`);a=a.replace("    const count = this.counters.get(cue) ?? 0;",`    if(cue==='cell'){const pick=this.melody.next();return{index:this.family*4+pick.index,rate:pick.playbackRate,gain:.98+this.random()*.04};}\n    const count = this.counters.get(cue) ?? 0;`);
// Retain the non-cell branch without impossible narrowed 'cell' checks.
a=a.replace("const first = cue === 'cell' ? this.family * 4 : 0;","const first = 0;").replace("const size = cue === 'cell' ? 4 : soundBank[cue].length;","const size = soundBank[cue].length;").replace("const semitones = cue === 'cell' ? phrases[this.phrase]![count % 8]! : 0;","const semitones = 0;");await writeFile(audio,a);
const report={consumer:spawnSync('git',['rev-parse','HEAD'],{cwd:consumer,encoding:'utf8'}).stdout.trim(),donor:spawnSync('git',['rev-parse','HEAD'],{cwd:donor,encoding:'utf8'}).stdout.trim(),donorFileHashes:hashes,probe,checks:[],limits:['Temporary integration adapters, not a consumer vendor upgrade or native/device acceptance']};
async function run(name,cmd,args,cwd=probe){const r=spawnSync(cmd,args,{cwd,encoding:'utf8'});await writeFile(join(probe,name+'.log'),(r.stdout??'')+(r.stderr??''));report.checks.push({name,exitCode:r.status});await writeFile(join(donor,'.test-output/road-lines-consumer.json'),JSON.stringify(report,null,2));console.log(name,r.status);if(r.status!==0)throw Error(name+' failed; see '+join(probe,name+'.log'));}
await run('consumer-types','npm',['run','typecheck']);
await run('consumer-model-feedback','npx',['vitest','run','tests/playtest.test.ts','tests/celebrations.test.ts','tests/presentation.test.ts','tests/monetization-background.test.ts','tests/native-analytics-contract.test.ts']);
await run('consumer-touch-ui',process.execPath,['tools/playtest-smoke.mjs']);
await run('consumer-audio',process.execPath,['tools/audio-smoke.mjs']);
await run('consumer-optional-ads',process.execPath,['tools/startup-ads-smoke.mjs']);
await run('kit-real-sample-playback',process.execPath,['tools/road-lines-browser.mjs','--audio-fixture',join(consumer,'src/assets/audio/feedback.wav')],donor);
console.log('Consumer probe PASS',probe);
