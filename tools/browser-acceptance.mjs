import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import {chromium} from '@playwright/test';
const root=resolve('.'),report={checks:[],errors:[]};
const fixture=process.argv.includes('--audio-fixture');
if(fixture){await mkdir('.test-output/road-lines',{recursive:true});await writeFile('.test-output/road-lines/consumer-feedback.wav',await readFile(process.argv[process.argv.indexOf('--audio-fixture')+1]));}
const server=createServer(async(req,res)=>{try{
 if(req.url==='/'){res.setHeader('content-type','text/html');res.end('<!DOCTYPE html><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0}#surface{height:240px;touch-action:none;background:#eee}#dock{height:100px}button{width:160px;height:80px}</style><div id="surface"></div><div id="dock"><button id="reset">Reset</button></div>');return;}
 const path=resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));if(!path.startsWith(root+sep))throw Error('path');
 res.setHeader('content-type',extname(path)==='.js'?'application/javascript':'application/octet-stream');res.end(await readFile(path));
}catch{res.statusCode=404;res.end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port;
let browser;
try{
 browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 for(const cpu of [1,4]){
 const context=await browser.newContext({hasTouch:true,isMobile:true,viewport:{width:390,height:844}});const p=await context.newPage();p.on('pageerror',e=>report.errors.push(e.message));
 const cdp=await context.newCDPSession(p);await cdp.send('Emulation.setCPUThrottlingRate',{rate:cpu});await p.goto(url);
 await p.evaluate(async()=>{
  window.mods={...await import('/dist/feel/touch-activation.js'),...await import('/dist/audio/one-shot-player.js'),...await import('/dist/phaser/destroy-renderer.js')};
  window.clicks=0;document.querySelector('#reset').addEventListener('click',()=>clicks++);
  window.disposeTouch=mods.installTouchActivation(document.querySelector('#dock'),{resolveButton:target=>target instanceof Element?target.closest('button'):null});
  document.querySelector('#surface').addEventListener('pointerdown',e=>{e.preventDefault();e.currentTarget.setPointerCapture(e.pointerId);});
 });
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:80,y:80,id:0}]});
 await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:80,y:280,id:0}]});
 await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 assert.equal(await p.evaluate(()=>clicks),0);await p.locator('#reset').tap();await p.locator('#reset').tap();assert.equal(await p.evaluate(()=>clicks),2);
 // Release away / cancellation cannot activate a dock button.
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:80,y:280,id:0}]});
 await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:200,y:200,id:0}]});
 await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});assert.equal(await p.evaluate(()=>clicks),2);
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:80,y:280,id:0}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});assert.equal(await p.evaluate(()=>clicks),2);
 await p.locator('#reset').click();await p.locator('#reset').focus();await p.keyboard.press('Enter');assert.equal(await p.evaluate(()=>clicks),4);
 await p.evaluate(()=>{disposeTouch();document.querySelector('#reset').disabled=true;});await p.evaluate(()=>document.querySelector('#reset').click());assert.equal(await p.evaluate(()=>clicks),4);
 report.checks.push('touch capture/repeat/cancel/mouse/keyboard/dispose CPU'+cpu);
 await p.evaluate(()=>{
  window.ctx=new AudioContext();window.starts=0;window.resumes=0;window.buffer=null;
  const create=ctx.createBufferSource.bind(ctx);ctx.createBufferSource=()=>{const n=create(),start=n.start.bind(n);n.start=(...args)=>{starts++;return start(...args)};return n;};
  window.fallback=c=>buffer??=(c.createBuffer(1,Math.ceil(c.sampleRate*.065),c.sampleRate));
  window.player=new mods.OneShotPlayer({groups:{ui:{minIntervalMs:0},route:{minIntervalMs:65,replacementFadeMs:20},star:{minIntervalMs:0},win:{minIntervalMs:0},coin:{minIntervalMs:0}},createContext:()=>ctx,maxVoices:4,resumeDeadlineMs:100});
  player.setEligibility({gameplay:false,ui:true});
  document.querySelector('#reset').disabled=false;document.querySelector('#reset').onclick=()=>player.play({group:'ui',channel:'ui',buffer:fallback});
 });
 await p.locator('#reset').tap();await p.waitForFunction(()=>starts===1&&player.activeVoices===0&&ctx.state==='suspended');
 if(fixture){await p.evaluate(async()=>{const real=await ctx.decodeAudioData(await(await fetch('/.test-output/road-lines/consumer-feedback.wav')).arrayBuffer());player.play({group:'ui',channel:'ui',buffer:real,offset:0,duration:.065});});await p.waitForFunction(()=>starts===2&&player.activeVoices===0&&ctx.state==='suspended');report.checks.push('Road Lines actual decoded sample CPU'+cpu);}
 const start=await p.evaluate(()=>starts);await p.evaluate(()=>{player.setEligibility({gameplay:false,ui:false});player.play({group:'ui',channel:'ui',buffer:fallback});});assert.equal(await p.evaluate(()=>starts),start);
 await p.evaluate(()=>{
  window.realResume=ctx.resume.bind(ctx);window.releaseResume=null;
  ctx.resume=()=>{resumes++;return new Promise(resolve=>{releaseResume=async()=>{await realResume();resolve();};});};
  player.setEligibility({gameplay:false,ui:true});
  for(let i=0;i<30;i++)player.play({group:'ui',channel:'ui',buffer:fallback});
  for(const group of ['star','win','coin'])player.play({group,channel:'ui',buffer:fallback});
  window.saturatedDrop=player.play({group:'route',channel:'ui',buffer:fallback});
 });
 assert.equal(await p.evaluate(()=>resumes),1);assert.equal(await p.evaluate(()=>player.activeVoices),4);assert.equal(await p.evaluate(()=>saturatedDrop),false);
 await p.waitForTimeout(150);assert.equal(await p.evaluate(()=>player.activeVoices),0);
 await p.evaluate(()=>releaseResume());await p.waitForFunction(()=>ctx.state==='suspended');assert.equal(await p.evaluate(()=>player.activeVoices),0);
 await p.evaluate(()=>{ctx.resume=realResume;player.setEligibility({gameplay:true,ui:true});for(let i=0;i<50;i++)player.play({group:'route',channel:'gameplay',buffer:fallback});});
 assert(await p.evaluate(()=>player.activeVoices)<=1);await p.evaluate(()=>{player.setEligibility({gameplay:false,ui:false});player.dispose();player.dispose();});await p.waitForFunction(()=>ctx.state==='closed');assert.equal(await p.evaluate(()=>player.activeVoices),0);
 await p.evaluate(async()=>{
  const borrowed=new AudioContext();await borrowed.resume();
  const shared=new mods.OneShotPlayer({groups:{ui:{minIntervalMs:0}},createContext:()=>borrowed,ownsContext:false});
  shared.setEligibility({gameplay:false,ui:true});shared.play({group:'ui',channel:'ui',buffer:c=>c.createBuffer(1,128,c.sampleRate)});shared.dispose();
  if(borrowed.state!=='running'||shared.activeVoices!==0)throw Error('Borrowed context ownership violated');await borrowed.close();
 });
 report.checks.push('real WebAudio cold UI/modal/hard block/single-flight resume/expiry/density/owned+borrowed dispose CPU'+cpu);
 await context.close();
 }
 const p=await browser.newPage();await p.goto(url);await p.addScriptTag({url:url+'/node_modules/phaser/dist/phaser.js'});
 await p.evaluate(async()=>{
 const {destroyRenderer}=await import('/dist/phaser/destroy-renderer.js');
 for(const sleep of [false,true]){
  let game;await new Promise(resolve=>{game=new Phaser.Game({type:Phaser.CANVAS,width:32,height:32,banner:false,audio:{noAudio:true},scene:{create(){this.add.rectangle(16,16,10,10,0xff00ff);this.game.events.once('postrender',resolve);}}});});
  if(sleep)game.loop.sleep();await new Promise(resolve=>destroyRenderer(game,resolve));if(document.querySelector('canvas'))throw Error('canvas retained');
 }
 });report.checks.push('actual Phaser4.2.1 active/sleeping destroy');await p.close();assert.deepEqual(report.errors,[]);
 console.log(JSON.stringify(report,null,2));
}catch(error){report.errors.push(String(error.stack));throw error;}finally{await mkdir('.test-output/road-lines',{recursive:true});await writeFile('.test-output/road-lines/browser.json',JSON.stringify(report,null,2));await browser?.close();await new Promise(r=>server.close(r));}
