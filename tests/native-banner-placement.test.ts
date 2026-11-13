import { expect, it } from 'vitest';
import { resolveNativeBannerPlacement as place, type NativeBannerPlacementInput } from '../src/layout/native-banner-placement.js';
const base: NativeBannerPlacementInput = { slot:{x:0,y:750,width:390,height:60}, viewport:{width:390,height:844}, webView:{x:0,y:24,width:780,height:1688}, root:{width:780,height:1736}, adHeight:100 };
it('uses WebView scale and root offset, centers the SDK height, subtracts parent padding',()=>{
 const result=place({...base,parentPadding:{left:4,top:24}});
 expect(result).toEqual({kind:'place',rect:{x:0,y:1534,width:780,height:100},marginLeft:-4,marginTop:1510});
});
it('supports a landscape control-column slot without an orientation cutoff',()=>{
 expect(place({slot:{x:280,y:260,width:280,height:50},viewport:{width:568,height:320},webView:{x:0,y:0,width:1136,height:640},root:{width:1136,height:640},adHeight:100,minWidth:560}).kind).toBe('place');
});
it('requests CSS height before placement when SDK height exceeds reservation',()=>{
 const input={...base,slot:{...base.slot,height:30}}; const result=place(input); expect(result).toEqual({kind:'reserve',heightCss:50,widthNative:780});
 if(result.kind==='reserve')expect(place({...input,slot:{...input.slot,height:result.heightCss}}).kind).toBe('place');
});
it('fractional pixel reservation converges after remeasurement',()=>{
 const input={...base,slot:{x:0,y:100.3,width:390,height:10},webView:{x:0,y:0,width:585,height:1266},root:{width:585,height:1266},adHeight:76};
 const result=place(input); expect(result.kind).toBe('reserve');
 if(result.kind==='reserve')expect(place({...input,slot:{...input.slot,height:result.heightCss}}).kind).toBe('place');
});
it.each([{x:-1},{x:1},{y:-1},{y:820}])('hides slots outside the CSS viewport: %o',patch=>{
 expect(place({...base,slot:{...base.slot,...patch}})).toEqual({kind:'hidden',reason:'outside-viewport'});
});
it('rejects root safe area overlap on either axis',()=>{
 expect(place({...base,safeInsets:{left:1,top:0,right:0,bottom:0}})).toEqual({kind:'hidden',reason:'outside-root'});
 expect(place({...base,safeInsets:{left:0,top:0,right:0,bottom:150}})).toEqual({kind:'hidden',reason:'outside-root'});
});
it('rejects a mapped slot outside a shorter native WebView',()=>{
 expect(place({...base,webView:{...base.webView,height:1000}})).toEqual({kind:'hidden',reason:'outside-root'});
});
it.each([NaN, Infinity, 0, -1])('rejects invalid viewport width %s',width=>{
 expect(place({...base,viewport:{...base.viewport,width}})).toEqual({kind:'hidden',reason:'invalid-geometry'});
});
it('keeps the configured SDK minimum in native pixels',()=>{
 expect(place({...base,minWidth:781})).toEqual({kind:'hidden',reason:'too-narrow'});
});
it('returns stable identical placement and keeps rounded rect within slot',()=>{
 const input={...base,slot:{x:.3,y:200.2,width:389.1,height:60.3}}; const result=place(input);expect(result).toEqual(place(input));
 if(result.kind!=='place')throw Error('expected placement');
 expect(result.rect.x).toBeGreaterThanOrEqual(input.slot.x*2);
 expect(result.rect.x+result.rect.width).toBeLessThanOrEqual((input.slot.x+input.slot.width)*2);
});

it('opts into bottom alignment without changing the existing center default',()=>{
 const input={...base,slot:{x:0,y:700,width:390,height:80},webView:{x:0,y:0,width:780,height:1688}};
 expect(place(input)).toEqual(place({...input,verticalAlign:'center'}));
 expect(place(input)).toMatchObject({kind:'place',rect:{y:1430,height:100}});
 expect(place({...input,verticalAlign:'bottom',parentPadding:{left:0,top:24}})).toEqual({kind:'place',rect:{x:0,y:1460,width:780,height:100},marginLeft:0,marginTop:1436});
});

it.each(['center','bottom'] as const)('keeps height negotiation independent of %s alignment',verticalAlign=>{
 const input={...base,verticalAlign,slot:{...base.slot,height:30}};
 const required=place(input);
 expect(required).toEqual({kind:'reserve',heightCss:50,widthNative:780});
 if(required.kind!=='reserve')throw Error('expected reservation');
 expect(place({...input,slot:{...input.slot,height:required.heightCss}})).toMatchObject({kind:'place',rect:{height:100}});
});

it('bottom-aligns inward-rounded fractional edges and keeps the SDK height intact',()=>{
 const result=place({...base,slot:{x:.3,y:200.2,width:389.1,height:60.3},webView:{...base.webView,y:0},adHeight:100.2,verticalAlign:'bottom'});
 expect(result).toEqual({kind:'place',rect:{x:1,y:420,width:777,height:101},marginLeft:1,marginTop:420});
});

it.each([
 {cssWidth:390,webWidth:975,y:700,cssHeight:60,expectedBottom:1900},
 {cssWidth:312,webWidth:1170,y:700,cssHeight:40,expectedBottom:2775},
 {cssWidth:624,webWidth:1170,y:704,cssHeight:80,expectedBottom:1470},
])('accepts measured compact creative height independently of Android density: %o',fixture=>{
 // One 50dp/150-native-pixel creative maps to 60, 40 or 80 CSS px.
 // Width-based WebView scale, not density or a 45-CSS-pixel threshold, owns placement.
 const result=place({slot:{x:0,y:fixture.y,width:fixture.cssWidth,height:fixture.cssHeight},viewport:{width:fixture.cssWidth,height:1000},webView:{x:0,y:0,width:fixture.webWidth,height:4000},root:{width:2000,height:4000},adHeight:150,verticalAlign:'bottom'});
 expect(result.kind).toBe('place');
 if(result.kind==='place'){expect(result.rect.height).toBe(150);expect(result.rect.y+result.rect.height).toBe(fixture.expectedBottom);}
});

it('does not weaken safe bounds or SDK minimum width for bottom placement',()=>{
 expect(place({...base,verticalAlign:'bottom',safeInsets:{left:0,top:0,right:0,bottom:150}})).toEqual({kind:'hidden',reason:'outside-root'});
 expect(place({...base,verticalAlign:'bottom',minWidth:781})).toEqual({kind:'hidden',reason:'too-narrow'});
 expect(place({...base,verticalAlign:'start' as 'bottom'})).toEqual({kind:'hidden',reason:'invalid-geometry'});
});

it.each([null, 'start', 42])('rejects an invalid untyped alignment %s',verticalAlign=>{
 expect(place({...base,verticalAlign:verticalAlign as unknown as 'bottom'})).toEqual({kind:'hidden',reason:'invalid-geometry'});
});
