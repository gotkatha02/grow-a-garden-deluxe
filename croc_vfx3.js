/* Aztec crocodile — code VFX pass (owner 2026-11-20), uses the wolf kit window.VK (reference style: no outlines, white-hot core, glow).
   Code now: spear thrusts / lunges (cxStreak → CThrust / CStreak), crescent + hook sweeps (CSlash), tail sweep ring, hit sparks
   (jade / red / splash / pow → GX flare + sparks), rips (CRip), shatter / fracture bursts (flare + shards), shards and water drops (GX).
   Still painted: jaw / lock bites, rain, boundary, sun circle, ambush, drag, roll, ironjaw, scales, stride, feast, spirit, charge, edge.
   ?vfx3=0 = old painted version. */
(()=>{
if(typeof CHAR==='undefined'||CHAR!=='croc'||!window.VK||/[?&]vfx3=0/.test(location.search))return;
const V=window.VK,{CSlash,CRip,CStreak,CThrust,G,sys,R_}=V;
const JADE=['#0f6b5a','#2fd3a0','#eafff6'],GOLD=['#a8501a','#ffb62e','#fff3c4'],RED=['#8a1a10','#e8303c','#ffd0c0'],MUD=['#3a5a3a','#7fb08a','#e8fff0'];
const isThrust=n=>/^c(01|02|04|11|40)_/.test(n),isLunge=n=>/^c20_/.test(n);
const o_streak=window.cxStreak;
window.cxStreak=function(n,phi,len,o={}){
  if(isThrust(n)){const gold=/^c11_/.test(n),L=len*(gold?.85:.8);addFx(new CThrust({x:player.x,y:player.y,phi,L,z:o.z??26,cols:gold?['#ffb62e','#fffbe8']:['#2fd3a0','#f2fffa'],grow:.05,hold:gold?.12:.06,fade:gold?.2:.13}));
    if(gold){const S=sys('top');G.flare(S,player.x+Math.cos(phi)*L*.6,player.y+Math.sin(phi)*L*.6,26,110,'#ffcf5a',.3);}return;}
  if(isLunge(n)){const L=len*.9;addFx(new CStreak([player.x-Math.cos(phi)*L*.2,player.y-Math.sin(phi)*L*.2],[player.x+Math.cos(phi)*L*.8,player.y+Math.sin(phi)*L*.8],MUD));return;}
  return o_streak.apply(this,arguments);};
const o_spark=window.cxSpark;
window.cxSpark=function(n,e,w,o={}){if(!e)return;const S=()=>sys('top'),z=(e.boss?44:24),go=(f)=>o.delay?setTimeout(f,o.delay*1000):f();
  if(/^c31_/.test(n))return go(()=>{const s=S();G.flare(s,e.x,e.y,z,w*1.1,'#2fd3a0',.18);G.sparks(s,e.x,e.y,z,7,'#c8fff0',220,150,.3);});
  if(/^c32_/.test(n))return go(()=>{const s=S();G.flare(s,e.x,e.y,z,w*1.1,'#ff4a3a',.18);G.sparks(s,e.x,e.y,z,7,'#ffd0c0',220,150,.3);});
  if(/^c33_/.test(n))return go(()=>{const s=S();G.flare(s,e.x,e.y,z,w*1.4,'#fff3c4',.22);});
  if(/^c34_/.test(n))return go(()=>{const s=S();G.flare(s,e.x,e.y,8,w,'#7fd0ff',.2);drops(s,e.x,e.y,8);});
  if(/^c(07|42|06)_/.test(n))return go(()=>{const s=S();G.flare(s,e.x,e.y,z,w*1.2,/^c06/.test(n)?'#2fd3a0':'#ffcf5a',.26);G.sparks(s,e.x,e.y,z,10,'#fff3c4',260,200,.4);stones(s,e.x,e.y,z,8);});
  if(/^c15_/.test(n))return go(()=>{addFx(new CRip({x:e.x,y:e.y,z,ang:.5,cols:['#e8303c','#fff3ee']}));});
  return o_spark.apply(this,arguments);};
const drops=(S,x,y,n)=>{for(let i=0;i<n;i++){const a=Math.random()*6.283,v=R_(60,170);S.add({im:V.tx('core','#7fd0ff'),x,y,z:8,vx:Math.cos(a)*v,vy:Math.sin(a)*v*.6,vz:R_(140,260),g:700,s0:R_(5,8),s1:3,life:R_(.45,.7),add:1,str:1.6,fo:.4});}};
const stones=(S,x,y,z,n)=>{for(let i=0;i<n;i++){const a=Math.random()*6.283,v=R_(80,200);S.add({im:V.tx('shard',i%2?'#2fa080':'#8a7a5a',i%5),x,y,z,vx:Math.cos(a)*v,vy:Math.sin(a)*v*.6,vz:R_(160,300),g:820,s0:R_(8,14),s1:R_(7,11),life:R_(.6,.9),fo:.3,rot:Math.random()*6,vr:R_(-12,12),bounce:.3});}};
const o_bits=window.cxBits;
window.cxBits=function(n,x,y,count,o={}){if(/^c35_/.test(n)){stones(sys('top'),x,y,o.z??20,Math.min(12,count));return;}if(/^c36_/.test(n)){drops(sys('top'),x,y,Math.min(12,count));return;}return o_bits.apply(this,arguments);};
/* crescent / hook sweeps + tail sweep → glowing crescents */
const add0=window.addFx;
window.addFx=function(f){const n=f&&typeof CxImg!=='undefined'&&f instanceof CxImg&&f.n||'';
  if(/^c0[35]_/.test(n)){const phi=player.phi,d=Math.cos(phi)<0?-1:1,hook=/^c05/.test(n);return add0(new CSlash({x:player.x,y:player.y,a0:phi-(hook?.6:1.1)*d,a1:phi+(hook?1.4:1.1)*d,R:hook?78:92,W:hook?24:28,z:f.z??22,cols:JADE,grow:.07,hold:.05,fade:.17}));}
  if(/^c17_/.test(n)){const phi=player.phi;return add0(new CSlash({x:player.x,y:player.y,a0:phi,a1:phi+6.0,R:(f.w||180)*.45,W:20,z:6,cols:MUD,grow:.16,hold:.04,fade:.2}));}
  return add0(f);};
})();
