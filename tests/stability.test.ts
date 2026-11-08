import { describe, it, expect } from 'vitest';
import { YandexAdsAdapter } from '../src/yandex/ads';
import { createValueTransferPlan, shouldPlayValueTransferCue } from '../src/core/value-transfer';
import { DurablePendingTransactionSession } from '../src/core/durable-pending-transaction';
import { YandexMirroredStorageAdapter } from '../src/yandex/mirrored-storage';

describe('production failure boundaries', () => {
  it('settles ads even when every telemetry call throws', async () => {
    const blocks: boolean[] = [];
    const sdk = { adv: { showFullscreenAdv: ({callbacks}: any) => callbacks.onClose(true) } };
    const ads = new YandexAdsAdapter(sdk as any, {setBlocked: (_, blocked) => { blocks.push(blocked); }}, { analytics: {track: () => {throw Error('offline');}} });
    expect((await ads.showInterstitial()).status).toBe('closed');
    expect((await ads.showInterstitial()).status).toBe('closed');
    expect(blocks).toEqual([true,false,true,false]);
  });
  it('reserves the final sound inside the budget', () => {
    for (let tokens=1;tokens<60;tokens++) for(let budget=1;budget<20;budget++) {
      const plan=createValueTransferPlan(tokens,{minDurationMs:300,maxDurationMs:900,maxVisualTokens:tokens,maxAudioEvents:budget});
      const count=Array.from({length:tokens},(_,i)=>shouldPlayValueTransferCue(plan,i)).filter(Boolean).length;
      expect(count).toBeLessThanOrEqual(budget);
      expect(shouldPlayValueTransferCue(plan,tokens-1)).toBe(true);
    }
  });
  it('serializes simultaneous prepares into one durable pending identity', async () => {
    type State = {pending: number|null}; let durable: State={pending:null};let created=0;
    const session=new DurablePendingTransactionSession<State,number>({load:async()=>durable,getPending:s=>s.pending,createPending:async()=>++created,stage:async(_,p)=>durable={pending:p},commit:async()=>durable={pending:null},isSamePending:(a,b)=>a===b,isCommitted:s=>s.pending===null});
    await session.load();expect(await Promise.all([session.prepare(),session.prepare()])).toEqual([1,1]);expect(created).toBe(1);
  });
  it('does not wait for cloud to confirm a durable local write', async () => {
    let raw: string|null=null;
    const storage=new YandexMirroredStorageAdapter({getItem:async()=>raw,setItem:async(_,v)=>{raw=v;},removeItem:async()=>{raw=null;}},{getData:async()=>({}),setData:()=>new Promise(()=>{})},{syncKey:'s',cloudField:'s',reconcile:l=>l});
    await storage.setItem('s','one');await storage.setItem('s','two');expect(raw).toBe('two');
  });
  it('discards a cloud read made obsolete by a local mutation', async () => {
    let raw: string|null='one';let finish!: (v: Record<string,unknown>)=>void;const sent: unknown[]=[];
    const storage=new YandexMirroredStorageAdapter({getItem:async()=>raw,setItem:async(_,v)=>{raw=v;},removeItem:async()=>{raw=null;}},{getData:()=>new Promise(r=>{finish=r;}),setData:async v=>{sent.push(v.s);}},{syncKey:'s',cloudField:'s',reconcile:l=>l});
    const read=storage.getItem('s');await Promise.resolve();await storage.setItem('s','two');finish({s:'old'});expect(await read).toBe('two');expect(sent).toEqual(['two']);
  });
  it('returns the latest local save when an obsolete cloud read rejects', async () => {
    let raw: string|null='one';let fail!: (e: Error)=>void;
    const storage=new YandexMirroredStorageAdapter({getItem:async()=>raw,setItem:async(_,v)=>{raw=v;},removeItem:async()=>{raw=null;}},{getData:()=>new Promise((_,reject)=>{fail=reject;}),setData:async()=>{}},{syncKey:'s',cloudField:'s',reconcile:l=>l});
    const read=storage.getItem('s');
    while (!fail) await Promise.resolve();
    await storage.setItem('s','two');fail(Error('offline'));
    expect(await read).toBe('two');
  });

});
