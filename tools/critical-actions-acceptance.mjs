import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {chromium} from '@playwright/test';
import {assertInitialActions,inspectInitialActions} from './critical-actions-check.mjs';
const out='.test-output/ui-acceptance', report={method:'Rendered DOM fixtures with independent negative controls and coordinate clicks; no source-game/device acceptance',cases:[],errors:[]};
await mkdir(out,{recursive:true});
const selectors=['#easier','#again','#harder'];
function html(scale,inset){return `<!doctype html><meta name="viewport" content="width=device-width, initial-scale=1"><style>
*{box-sizing:border-box}html,body{margin:0;height:100%;font:${16*scale}px/1.25 Arial;background:#fafbf9;color:#283e36}main{height:100dvh;display:grid;grid-template-rows:minmax(0,1fr) auto;padding:12px 12px ${inset+8}px;gap:8px}.details{min-height:0;overflow:auto}h1{font-size:1.2em}.decoration{height:900px;background:linear-gradient(#e2efe9,#fafbf9)}.actions{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:4px;min-width:0}button{font:inherit;min-height:44px;min-width:0;padding:8px 2px;border:1px solid #376b5d;background:#e2efe9;color:#254b40;border-radius:5px;overflow-wrap:anywhere}
</style><main><article class="details"><h1>Complete</h1><p>Saved result details may scroll.</p><div class="decoration"></div></article><footer class="actions"><button id="easier">Easier</button><button id="again">Again</button><button id="harder">Harder</button></footer></main><script>window.clicks=[];for(const button of document.querySelectorAll('button'))button.onclick=()=>clicks.push(button.id);</script>`;}
let browser;
try {
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  for(const [width,height] of [[320,568],[568,320],[390,844],[960,540]])
    for(const scale of [1,2]) for(const inset of [0,24]) {
      const page=await browser.newPage({viewport:{width,height}});
      page.on('pageerror',e=>report.errors.push(String(e)));
      await page.setContent(html(scale,inset));
      const geometry=await assertInitialActions(page,selectors,{minimumCssSize:44});
      assert.deepEqual(await page.evaluate(()=>({window:scrollY,details:document.querySelector('.details').scrollTop})),{window:0,details:0});
      // Raw coordinate clicks cannot use Playwright locator auto-scroll to conceal a failure.
      for(const {rect} of geometry)await page.mouse.click(rect.x+rect.width/2,rect.y+rect.height/2);
      assert.deepEqual(await page.evaluate(()=>clicks),['easier','again','harder']);
      const name=`${width}-${height}-text${scale}-inset${inset}`;
      await page.screenshot({path:`${out}/${name}.png`});
      report.cases.push({name,passed:true,geometry});await page.close();
    }
  const page=await browser.newPage({viewport:{width:320,height:568}});
  const negative=[
    {name:'actions-below-scroll',reason:'outside-viewport',mutate:()=>document.querySelector('.details').append(document.querySelector('.actions'))},
    {name:'overlay',reason:'occluded-or-not-interactive',mutate:()=>{const r=document.querySelector('#again').getBoundingClientRect(),p=document.createElement('div');p.style=`position:fixed;z-index:20;left:${r.x}px;top:${r.y}px;width:${r.width}px;height:${r.height}px;background:red`;document.body.append(p);}},
    {name:'partial-clip',reason:'clipped-y',mutate:()=>{document.querySelector('.actions').style='overflow:hidden;height:24px;min-height:24px;position:relative;top:-60px';}},
    {name:'disabled',reason:'disabled',mutate:()=>{document.querySelector('#again').disabled=true;}},
    {name:'hidden',reason:'hidden',mutate:()=>{document.querySelector('#again').style.visibility='hidden';}},
    {name:'missing',reason:'missing-or-ambiguous',mutate:()=>document.querySelector('#again').remove()},
    {name:'ambiguous',reason:'missing-or-ambiguous',mutate:()=>document.querySelector('.actions').append(document.querySelector('#again').cloneNode(true))},
  ];
  for(const control of negative){
    await page.setContent(html(1,0));await page.evaluate(control.mutate);
    const geometry=await inspectInitialActions(page,selectors,{minimumCssSize:44});
    assert(geometry.some(x=>x.reason===control.reason),`${control.name}: ${JSON.stringify(geometry)}`);
    await assert.rejects(()=>assertInitialActions(page,selectors,{minimumCssSize:44}));
    report.cases.push({name:control.name,expectedRejection:true,passed:true,geometry});
  }
  await page.close();assert.deepEqual(report.errors,[]);
  console.log(JSON.stringify({passed:report.cases.length,negativeControls:negative.length}));
}catch(e){report.errors.push(String(e.stack));throw e;}
finally{await writeFile(`${out}/acceptance.json`,JSON.stringify(report,null,2)+'\n');await browser?.close();}
