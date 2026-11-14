import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile, mkdir, writeFile} from 'node:fs/promises';
import {resolve, sep} from 'node:path';
import {chromium} from '@playwright/test';

const root = resolve('.');
const output = '.test-output/owned-dom-motion';
await mkdir(output, {recursive:true});
const report = {environment:'Playwright Chromium / real WAAPI; no device or game-authority claim', checks:[], errors:[]};
const server = createServer(async (req,res) => {
  try {
    if(req.url === '/') {
      res.setHeader('content-type','text/html');
      res.end(`<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1">
        <style>:root{--selected:rgb(210,235,220);--error:rgb(220,183,175)}body{background:#fafbf9;font:18px sans-serif;padding:30px}
        button{width:80px;height:80px;background:transparent;border:1px solid #739184;margin:8px}button.picked{background:var(--selected)}</style>
        <button id="a">3</button><button id="b">7</button><p id="state">Owned DOM motion acceptance</p><iframe id="frame" srcdoc="<button id='inside'>Frame</button>"></iframe>`);
      return;
    }
    const file=resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));
    if(!file.startsWith(root+sep))throw Error('path');
    res.setHeader('content-type','application/javascript');res.end(await readFile(file));
  } catch {res.statusCode=404;res.end();}
});
await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
let browser;
try {
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const page=await browser.newPage({viewport:{width:390,height:640}});
  page.on('pageerror',error => report.errors.push(error.message));
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  await page.evaluate(async()=>{
    const {OwnedDomMotion}=await import('/dist/feel/owned-dom-motion.js');
    window.owner=new OwnedDomMotion();window.a=document.querySelector('#a');window.b=document.querySelector('#b');
    window.oldDone=0;window.newDone=0;
  });
  const continuous=await page.evaluate(()=>{
    const old=owner.animate(a,[{opacity:.2},{opacity:1}],200,{onFinish:()=>oldDone++});
    old.pause();old.currentTime=80;
    const before=getComputedStyle(a).opacity;
    const next=owner.animate(a,[{opacity:0},{opacity:.9}],200,{onFinish:()=>newDone++});
    const after=getComputedStyle(a).opacity;
    old.dispatchEvent(new Event('finish'));window.next=next;
    return {before,after,oldState:old.playState,oldDone,frames:next.effect.getKeyframes()};
  });
  assert.equal(continuous.before,continuous.after);assert.equal(continuous.oldState,'idle');assert.equal(continuous.oldDone,0);
  await page.evaluate(()=>next.finish());await page.waitForFunction(()=>newDone===1);
  report.checks.push({case:'visible opacity handoff and guarded completion',data:continuous});

  const color=await page.evaluate(()=>{
    owner.cancelAll();
    const old=owner.animate(a,[{background:'var(--error)'},{background:'transparent'}],300);
    old.pause();old.currentTime=70;
    const before=getComputedStyle(a).backgroundColor;
    a.classList.add('picked');
    const selected=owner.animate(a,[{backgroundColor:'transparent'},{backgroundColor:'var(--selected)'}],180);
    selected.pause();
    const after=getComputedStyle(a).backgroundColor;
    selected.currentTime=60;
    const beforeRepeat=getComputedStyle(a).backgroundColor;
    const repeated=owner.animate(a,[{background:'var(--error)'},{background:'transparent'}],180);
    repeated.pause();
    const afterRepeat=getComputedStyle(a).backgroundColor;
    return {before,after,beforeRepeat,afterRepeat,oldState:old.playState,selectedState:selected.playState,frames:repeated.effect.getKeyframes()};
  });
  assert.equal(color.before,color.after);assert.equal(color.beforeRepeat,color.afterRepeat);
  assert.equal(color.oldState,'idle');assert.equal(color.selectedState,'idle');
  report.checks.push({case:'CSS variable shorthand ↔ longhand replacement',data:color});
  await page.screenshot({path:output+'/color-handoff.png'});

  const independent=await page.evaluate(()=>{
    owner.cancelAll();
    const opacity=owner.animate(a,[{opacity:.2},{opacity:1}],1000);
    const translation=owner.animate(a,[{translate:'0 3px'},{translate:'0 0'}],1000);
    const transform=owner.animate(a,[{transform:'scale(.9)'},{transform:'none'}],1000);
    const other=owner.animate(b,[{opacity:.2},{opacity:1}],1000);
    const count=a.getAnimations().length;
    owner.cancel(a);
    return {count,states:[opacity,translation,transform,other].map(x=>x.playState),otherCount:b.getAnimations().length};
  });
  assert.equal(independent.count,3);assert.deepEqual(independent.states,['idle','idle','idle','running']);assert.equal(independent.otherCount,1);
  report.checks.push({case:'independent properties, target cleanup',data:independent});

  const lifecycle=await page.evaluate(()=>{
    owner.cancelAll();window.late=0;
    const old=owner.animate(a,[{opacity:0},{opacity:1}],500,{onFinish:()=>late++});
    owner.cancelAll();owner.cancelAll();
    const fresh=owner.animate(a,[{opacity:.5},{opacity:1}],500);
    old.dispatchEvent(new Event('finish'));
    const count=a.getAnimations().length;
    a.remove();const detached=owner.animate(a,[{opacity:0},{opacity:1}],100);
    fresh.dispatchEvent(new Event('finish'));
    document.body.prepend(a);
    return {late,count,detached:detached===null,state:fresh.playState};
  });
  assert.deepEqual(lifecycle,{late:0,count:1,detached:true,state:'idle'});
  report.checks.push({case:'scope cancellation, reuse, DOM removal and stale event',data:lifecycle});

  await page.emulateMedia({reducedMotion:'reduce'});
  const reduced=await page.evaluate(()=>{
    const first=owner.animate(a,[{opacity:0},{opacity:1}],1000);
    a.classList.add('picked');
    const result=owner.animate(a,[{opacity:0},{opacity:1}],100,{enabled:!matchMedia('(prefers-reduced-motion: reduce)').matches});
    return {state:first.playState,skipped:result===null,count:a.getAnimations().length,color:getComputedStyle(a).backgroundColor};
  });
  assert.equal(reduced.state,'idle');assert.equal(reduced.skipped,true);assert.equal(reduced.count,0);assert.equal(reduced.color,'rgb(210, 235, 220)');
  report.checks.push({case:'host reduced-motion policy retains static state',data:reduced});

  const validation=await page.evaluate(()=>{
    const old=owner.animate(a,[{opacity:0},{opacity:1}],200);
    let failures=0;
    try{owner.animate(a,[{opacity:1}],200);}catch{failures++;}
    try{owner.animate(a,[{opacity:0},{opacity:1}],-1);}catch{failures++;}
    const state=old.playState;
    owner.cancelAll();
    const delayed=owner.animate(a,[{opacity:.3,offset:.3},{opacity:1}],300,{fromCurrent:'always'});
    delayed.pause();const frames=delayed.effect.getKeyframes();
    return {failures,state,firstOffset:frames[0].offset,count:frames.length};
  });
  assert.equal(validation.failures,2);assert.equal(validation.state,'running');assert.equal(validation.firstOffset,0);assert.equal(validation.count,3);
  report.checks.push({case:'invalid replacement leaves owner; explicit delayed start',data:validation});

  await page.waitForFunction(()=>document.querySelector('#frame').contentDocument?.querySelector('#inside'));
  const frame=await page.evaluate(()=>{
    const target=document.querySelector('#frame').contentDocument.querySelector('#inside');
    const effect=owner.animate(target,[{opacity:0},{opacity:1}],1000);
    const correct=effect instanceof target.ownerDocument.defaultView.Animation;
    owner.cancelAll();return {correct,state:effect.playState};
  });
  assert.deepEqual(frame,{correct:true,state:'idle'});
  report.checks.push({case:'target document realm and timeline',data:frame});
  assert.deepEqual(report.errors,[]);
  await page.close();
} finally {
  await writeFile(output+'/acceptance.json',JSON.stringify(report,null,2)+'\n');
  await browser?.close();
  await new Promise(resolve=>server.close(resolve));
}
console.log(`Owned DOM motion: ${report.checks.length} browser contracts passed`);
