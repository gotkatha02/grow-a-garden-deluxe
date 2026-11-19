(function(){'use strict';
window.createForestHost=function(base){
const D=FOREST,W=D.width,H=D.height,N=createForestNav(D);
let g=null,ready=false,failed=false,night=false,clock=0,dirty=true,debug=false;
const player={x:765,y:156},bg=new Image(),atlas=new Image(),details=new Image(),bgNight=document.createElement('canvas');bgNight.width=W;bgNight.height=H;
const waterBounds={x:775,y:20,w:645,h:1004},waterMask=document.createElement('canvas'),waterFrame=document.createElement('canvas');waterMask.width=waterFrame.width=waterBounds.w;waterMask.height=waterFrame.height=waterBounds.h;
let waterPixels=0,ambience,objects,energy=1.25,loaded=0,hideObjects=false;
const tourStops=['meadow','runes','ford','wolves','bridge','south'];
function say(s){}
function polygon(q,points){q.beginPath();points.forEach((p,i)=>i?q.lineTo(...p):q.moveTo(...p));q.closePath()}
function loadedAsset(){if(++loaded!==3)return;try{const nq=bgNight.getContext('2d');nq.filter='brightness(.58) saturate(.8)';nq.drawImage(bg,0,0,W,H);objects=createForestObjects({atlas,details,trees:D.trees,borderTrees:D.borderTrees,plants:D.vegetation,strength:()=>energy});makeWaterMask();ambience=createForestAmbience({image:bg,trees:D.trees,strength:()=>energy,treeOffsets:(i,t)=>objects.treeOffset(i,t)});ready=true;dirty=true;say('แตะลานหิมะเพื่อเดินสำรวจ · เดินผ่านพุ่มเพื่อให้กิ่งสะเทือน')}catch(e){failed=true;say('โหลดชิ้นส่วนฉากไม่สำเร็จ กรุณารีเฟรช')}}
bg.onload=atlas.onload=details.onload=loadedAsset;
function makeWaterMask(){const q=waterMask.getContext('2d'),b=waterBounds;q.drawImage(bg,b.x,b.y,b.w,b.h,0,0,b.w,b.h);const pixels=q.getImageData(0,0,b.w,b.h);for(let y=0;y<b.h;y++)for(let x=0;x<b.w;x++){const i=(y*b.w+x)*4,r=pixels.data[i],gg=pixels.data[i+1],bb=pixels.data[i+2],p={x:x+b.x,y:y+b.y};const inChannel=N.inside(p,D.river)&&!N.inside(p,D.crossings[0]);const wet=inChannel&&gg-r>7&&bb-r>9&&gg>65;pixels.data[i]=pixels.data[i+1]=pixels.data[i+2]=255;pixels.data[i+3]=wet?230:0;if(wet)waterPixels++}q.putImageData(pixels,0,0)}
bg.onerror=atlas.onerror=details.onerror=()=>{failed=true;say('โหลดภาพป่าไม่สำเร็จ กรุณารีเฟรชหน้า')};bg.src=base+'forest-ground-v3.webp';atlas.src=base+'forest-components-v2.webp';details.src=base+'forest-branches-plants-v3.webp';
const streamLine=[[1382,43],[1352,95],[1297,139],[1260,187],[1183,221],[1124,270],[1090,327],[1044,400],[1027,477],[1032,550],[1021,600],[989,660],[954,717],[934,769],[880,829],[866,898],[820,1009]];
const falls=[{x:1250,y:145,w:72,h:64},{x:1018,y:514,w:55,h:70},{x:902,y:757,w:67,h:80},{x:836,y:870,w:60,h:76},{x:1352,y:62,w:38,h:32}];
function water(){if(!waterPixels)return;const q=waterFrame.getContext('2d'),b=waterBounds,waterSource=night?bgNight:bg;q.clearRect(0,0,b.w,b.h);q.globalCompositeOperation='source-over';q.globalAlpha=1;
 // Sample the existing painted water with tiny travelling refraction bands.
 // A color-and-channel mask keeps rocks, banks and bridge completely stationary.
 for(let y=0;y<b.h;y+=5){const yy=y+b.y,dx=Math.sin(yy*.045-clock*.0028)*2.0*energy+Math.sin(yy*.013-clock*.0011)*1.0*energy,dy=Math.sin(yy*.029-clock*.0024)*1.5*energy;q.drawImage(waterSource,b.x+dx,yy+dy,b.w,Math.min(5,b.h-y),0,y,b.w,Math.min(5,b.h-y))}
 for(const f of falls){q.save();q.beginPath();q.rect(f.x-b.x,f.y-b.y,f.w,f.h);q.clip();for(let i=0;i<2;i++){const v=(clock*.0014+i*.5)%1;q.globalAlpha=Math.sin(v*Math.PI)**2*.55;q.drawImage(waterSource,f.x,f.y-v*13,f.w,f.h,f.x-b.x,f.y-b.y,f.w,f.h)}q.restore()}
 q.globalAlpha=1;for(let i=0;i<60;i++){const v=(clock*.000023+i/60)%1,p=v*(streamLine.length-1),j=Math.floor(p),k=p-j,a=streamLine[j],z=streamLine[Math.min(j+1,streamLine.length-1)],x=a[0]+(z[0]-a[0])*k+Math.sin(i*2.7+clock*.0005)*9,y=a[1]+(z[1]-a[1])*k;q.fillStyle='rgba(231,255,255,'+(.08+Math.sin(v*Math.PI)*.16)+')';q.beginPath();q.ellipse(x-b.x,y-b.y,1.8+i%3*.55,.65+i%2*.2,-.3,0,7);q.fill()}
 q.globalCompositeOperation='destination-in';q.drawImage(waterMask,0,0);q.globalCompositeOperation='source-over';g.save();g.globalAlpha=.78;g.drawImage(waterFrame,b.x,b.y);g.restore()}
function atmosphere(){ambience?.foreground(g,clock,night,!hideObjects);objects?.particles(g,clock,night,hideObjects)}

function polygon(q,points){q.beginPath();points.forEach((p,i)=>i?q.lineTo(...p):q.moveTo(...p));q.closePath()}
function drawDebug(){g.lineWidth=2;for(const p of D.walkAreas){polygon(g,p);g.strokeStyle='#39804b';g.stroke()}polygon(g,D.river);g.fillStyle='#4795c644';g.fill();for(const p of D.crossings){polygon(g,p);g.fillStyle='#57ae6855';g.fill()}g.strokeStyle='#c54f48';for(const o of D.solids){g.beginPath();g.arc(o.x,o.y,o.r+7,0,7);g.stroke()}}
function drawBase(gg,t,isNight){g=gg;night=!!isNight;clock=t;if(!ready)return false;
 g.drawImage(night?bgNight:bg,0,0,W,H);water();ambience?.ground(g,clock,night);return true}
function drawSorted(gg,t,isNight,items,cam){g=gg;night=!!isNight;clock=t;if(!ready)return false;
 objects?.draw(g,clock,night,items||[],null,hideObjects,cam||{x:W/2,y:H/2});
 return true}
function foreground(gg,t,isNight){g=gg;night=!!isNight;clock=t;if(!ready)return;atmosphere();if(debug)drawDebug()}
return {W,H,get ready(){return ready},get failed(){return failed},nav:N,
 setPlayer(x,y){player.x=x;player.y=y},update(t){clock=t;if(ready)objects?.update(t,player)},drawBase,drawSorted,foreground,
 clear:(a,b)=>N.clear(a,b),route:(a,b)=>N.route(a,b),blocked:(x,y)=>N.blocked(x,y),set debug(v){debug=v},
 spawn:{start:{x:765,y:156},fromVillage:{x:765,y:156}},landmarks:D.landmarks,
 exitHit(p){return p.y<65&&p.x>705&&p.x<815}};
};
})();
