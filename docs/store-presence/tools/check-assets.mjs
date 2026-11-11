#!/usr/bin/env node
// Optional 2026-11-11 static preflight; NOT a store moderation validator.
// Usage: node docs/store-presence/tools/check-assets.mjs store-pack.json
// store-pack.json: {store, page?, device?, metadata:{title,short,description,...},
//                   assets:{icon,feature?,cover?,screenshots:[...]}}
// Image paths are relative to the manifest. Requires Node 20+ only.
import fs from "node:fs";
import path from "node:path";
const mb=1000000;
function inspect(p){
  const b=fs.readFileSync(p), bytes=b.length;
  if(bytes>=45 && b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))){
    if(b.toString("ascii",12,16)!=="IHDR")throw Error("PNG IHDR missing");
    const width=b.readUInt32BE(16),height=b.readUInt32BE(20),depth=b[24],color=b[25];
    if(!width||!height)throw Error("Invalid PNG dimensions");
    let alpha=color===4||color===6,end=false;
    for(let o=8;o+12<=b.length;){
      const n=b.readUInt32BE(o);if(n>b.length-o-12)break;
      const t=b.toString("ascii",o+4,o+8);if(t==="tRNS")alpha=true;
      if(t==="IEND"){end=true;break;}o+=n+12;
    }
    if(!end)throw Error("PNG IEND missing; not a complete PNG");
    return {format:"png",width,height,depth,color,alpha,bytes};
  }
  if(bytes>=10&&b[0]===255&&b[1]===216){
    if(b.at(-2)!==255||b.at(-1)!==217)throw Error("JPEG EOI missing");
    let i=2;
    while(i<b.length-12){
      if(b[i]!==255){i++;continue;}
      while(b[i]===255)i++;
      const m=b[i++];if(m===216||m===217||m===1||(m>=208&&m<=215))continue;
      if(m===218)break;
      if(i+2>b.length)break;
      const n=b.readUInt16BE(i);if(n<2||i+n>b.length)break;
      if([192,193,194,195,197,198,199,201,202,203,205,206,207].includes(m)){
        return {format:"jpeg",width:b.readUInt16BE(i+5),height:b.readUInt16BE(i+3),alpha:false,bytes};
      }
      i+=n;
    }
    throw Error("JPEG dimensions not found");
  }
  throw Error("Unsupported/corrupt image (PNG/JPEG required)");
}
function run(file){
  const errors=[], warnings=[],checks=[];
  const err=(id,message)=>errors.push(id+": "+message);
  const warn=(id,message)=>warnings.push(id+": "+message);
  const root=path.dirname(path.resolve(file));
  const data=JSON.parse(fs.readFileSync(file,"utf8"));
  const a=data.assets||{},m=data.metadata||{};
  const text=(key,min,max,required=true,unit="chars")=>{
    const v=m[key];if(!v && !required)return;
    if(typeof v!=="string"||!v.trim()){err("metadata."+key,"missing");return;}
    const n=unit==="bytes"?Buffer.byteLength(v,"utf8"):[...v].length;
    if(n<min||n>max)err("metadata."+key,"length "+n+" outside "+min+".."+max+" "+unit);
    else checks.push(key+": "+n+" "+unit);
  };
  const pic=(id,f,opts={})=>{
    if(!f){if(opts.required)err(id,"missing");return null;}
    let v;try{v=inspect(path.resolve(root,f))}catch(e){err(id,e.message);return null;}
    if(opts.formats && !opts.formats.includes(v.format))err(id,"bad format "+v.format);
    if(opts.width && v.width!==opts.width)err(id,"width "+v.width+" != "+opts.width);
    if(opts.height && v.height!==opts.height)err(id,"height "+v.height+" != "+opts.height);
    if(opts.maxBytes && v.bytes>opts.maxBytes)err(id,"file too large: "+v.bytes);
    if(opts.png24 && v.format==="png" && (v.color!==2||v.depth!==8||v.alpha))err(id,"requires RGB 8-bit PNG without alpha");
    if(opts.png32 && v.format==="png" && (v.color!==6||v.depth!==8))err(id,"requires RGBA 8-bit PNG");
    if(opts.noAlpha && v.alpha)err(id,"alpha forbidden");
    checks.push(id+": "+v.width+"x"+v.height+" "+v.format+" "+v.bytes+" bytes");
    return v;
  };
  const shots=Array.isArray(a.screenshots)?a.screenshots:[];
  const count=(min,max)=>{if(shots.length<min||shots.length>max)err("screenshots","count "+shots.length+" expected "+min+".."+max);};
  switch(data.store){
  case "rustore":{
    const custom=data.page==="custom";
    text("title",1,30);text("short",1,80);text("description",1,4000);
    if(custom){
      const v=pic("icon",a.icon,{formats:["png","jpeg"],maxBytes:mb});
      if(v && (v.width!==v.height||v.width<32||v.width>512))err("icon","custom icon 32..512 square");
      count(0,10);
    }else{
      pic("icon",a.icon,{required:true,formats:["png","jpeg"],width:512,height:512,maxBytes:3*mb});
      count(3,10);
    }
    shots.forEach((f,i)=>{const v=pic("shot"+i,f,{formats:["png","jpeg"],maxBytes:data.device==="tablet"?5*mb:3*mb});
      if(v&&(Math.max(v.width,v.height)>3840||Math.min(v.width,v.height)>2160))err("shot"+i,"maximum mobile size 2160x3840");});
    warn("rustore","30/50 title docs conflict; 16:9 main vs 9:16 custom / portrait crop must be checked in console");
    warn("rustore","Icon opaque edges and installed launcher icon match need visual check");
    break;
  }
  case "google-play":{
    text("title",1,30);text("short",1,80);text("description",1,4000);
    pic("icon",a.icon,{required:true,formats:["png"],png32:true,width:512,height:512,maxBytes:1024*1024});
    pic("feature",a.feature,{required:true,formats:["png","jpeg"],png24:true,width:1024,height:500});
    count(2,8);let promo=0;
    shots.forEach((f,i)=>{const v=pic("shot"+i,f,{formats:["png","jpeg"],png24:true});if(!v)return;
      const lo=Math.min(v.width,v.height),hi=Math.max(v.width,v.height);
      if(lo<320||hi>3840||hi>2*lo)err("shot"+i,"dimensions outside Play rule");
      if(lo>=1080&&hi>=1920&&Math.abs(hi/lo-16/9)<.015)promo++;
    });
    if(promo<3)warn("google-play","Below 3 high-resolution 9:16 or 16:9 game screenshots; certain recommendation placements may be unavailable");
    break;
  }
  case "app-store":{
    text("title",2,30);text("subtitle",1,30,false);text("description",1,4000);
    text("keywords",1,100,false,"bytes");text("promotionalText",1,170,false);
    count(1,10);const allowed={
      "iphone-dynamic-island-medium":[[1179,2556],[1206,2622]],
      "ipad-13":[[2064,2752],[2048,2732]]
    }[data.device||"iphone-dynamic-island-medium"];
    shots.forEach((f,i)=>{const v=pic("shot"+i,f,{formats:["png","jpeg"],noAlpha:true});if(!v||!allowed)return;
      if(!allowed.some(([w,h])=>(v.width===w&&v.height===h)||(v.width===h&&v.height===w)))err("shot"+i,"wrong size for selected Apple group");
    });
    if(!allowed)warn("app-store","Device-size group not covered: check current App Store Connect screenshot table");
    warn("app-store","Need device support, built app icon and >half actual gameplay screenshots manual review");
    break;
  }
  case "yandex-games":{
    text("title",1,50);text("description",100,1000);text("howToPlay",100,1000);
    text("short",1,70,false);text("seo",50,160,false);
    pic("icon",a.icon,{required:true,formats:["png"],width:512,height:512});
    pic("cover",a.cover,{required:true,formats:["png"],width:800,height:470});
    if(shots.length<2)err("screenshots","count "+shots.length+" expected at least 2");const target=data.device==="mobile-portrait"||!data.device?9/16:16/9;
    shots.forEach((f,i)=>{const v=pic("shot"+i,f,{formats:["png","jpeg"],png24:true});if(!v)return;
      const long=Math.max(v.width,v.height);
      if(long<1280||long>2560)err("shot"+i,"long edge must be 1280..2560");
      if(Math.abs(v.width/v.height-target)>.008)err("shot"+i,"wrong aspect for device "+(data.device||"mobile-portrait"));
    });
    warn("yandex-games","70% authentic gameplay, video requirement and selected platform consistency need manual review");
    break;
  }
  default:err("store","unknown store: "+JSON.stringify(data.store));
  }
  warn("general","Header-only validation: no PNG CRC/full decode, screenshot truth, crop, rights, localization or moderation approval");
  const out={ruleSnapshot:"2026-11-11",store:data.store,page:data.page||"main",pass:errors.length===0,errors,warnings,checks};
  console.log(JSON.stringify(out,null,2));
  return errors.length?1:0;
}
if(process.argv.length!==3){console.error("Usage: node check-assets.mjs path/to/store-pack.json");process.exitCode=2;}
else try{process.exitCode=run(process.argv[2]);}catch(e){console.error(e.message);process.exitCode=2;}
