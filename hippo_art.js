/* =====================================================================
   NILE HIPPO (Taweret's Guardian) — vector art for the skill effects v3 (hippo_vfx.js). Drawn by code once into canvases
   (FXLIB sprites: the palette decides mud / water / gold / lotus versions). Nothing here is a picture file — the owner's
   painted pieces that stay (mud ball, pool, geyser, lotus, lotus burst, melon, gulp vortex, ward dome, behemoth aura, sea,
   Hapi's jar, the cat's cracked-ground crater) are loaded by hippo_vfx.js.
     mudBlob   a glob of wet mud flying (round end leading, like FXLIB 'drop')   mudSplat  a splat of mud lying on the ground (top view)
     crown     a splash crown, side view, standing on its base (water / mud)     anger     the taunt mark over a provoked enemy
     jawU / jawL   the hippo's own mouth seen from the front: upper jaw with the nostrils · lower jaw with the two big tusks
     melonBit  a chunk of watermelon (3 shapes)                                   hpAnkh    Taweret's gold ankh
     hpPeek    the hippo's head above the water: ears, eyes and nostrils (the waterline is the bottom edge)
     lotusFl   a small lotus flower (3/4 view)                                     potBit    a shard of Hapi's blue-and-gold jar (3 shapes)
     hpPrint   a hippo footprint (four toes, top view)
   HIPART.ring(kind, palette) → a 320² floor picture: 'taweret' (lotus ring, ankhs, sun) · 'nile' (water band, lotus buds) ·
     'mire' (the quicksand's rim)
   ===================================================================== */
(()=>{
'use strict';
if(typeof CHAR!=='undefined'&&CHAR!=='hippo')return;
const FX=window.FXLIB;if(!FX)return;
const {defSprite:def,cv,F,ST,LG,RG,OV,inS,rgba,PAL,TAU}=FX.k;
/* palettes [ink, deep, mid, lite, core] (the vfx file uses them, the art sheet tool too) */
Object.assign(PAL,{mud:['#22120a','#5c3418','#9a6236','#cf9e66','#f3dcb4'],bronze:['#2a1606','#8a561c','#cf9132','#ffd88a','#fff6dc'],
  teal:['#04201e','#0e7a6c','#2fc2a8','#a8f2e0','#ffffff'],lotus:['#3a0c22','#c64a80','#ff8fbd','#ffd6e8','#ffffff'],
  burp:['#3a2a10','#b89048','#ecd38c','#fff1c4','#ffffff'],sand:['#3a2410','#9a6a2a','#d9a658','#f6dc9a','#fff6dc'],
  life:['#06301c','#1f9a5a','#8aff6a','#e0ffc8','#ffffff'],sleep:['#141a44','#5a6ad8','#a9b8ff','#e8ecff','#ffffff'],
  melon:['#2a0806','#c8202c','#ff5a5a','#ffb0a0','#fff0e8'],nile:['#04263a','#0f6aa0','#35b0e0','#a6e8ff','#ffffff']});
const GOLD=PAL.gold,SK0='#3e4a5e',SK1='#5f6d84',SK2='#7d8ca3',SK3='#a3b2c6',PK0='#8a2e48',PK1='#c8566e',PK2='#ec8aa0',CRM='#fff3d6';
let SEED=1;const rn=()=>{SEED=(SEED*16807)%2147483647;return SEED/2147483647;};

/* a glob of wet mud, round end leading (f = the way the round end faces, as FXLIB 'drop') */
def('mudBlob',26,34,(g,p,v)=>{const d=v%2?'M13 1 C15 8 23 13 23 22 C23 29 18 33 13 33 C7 33 3 29 3 23 C3 18 6 16 8 12 C9 14 11 14 11 11 C11 7 12 4 13 1Z':'M12 1 C14 9 22 14 22 23 C22 30 17 33 12 33 C6 33 2 29 2 23 C2 15 10 10 12 1Z';
  F(g,d,LG(g,0,2,0,33,0,p[3],.42,p[2],1,p[1]));g.save();g.clip(new Path2D(d));OV(g,15,30,9,4,0,rgba(p[0],.35));g.restore();OV(g,8.5,22,2.6,4.4,-.4,'rgba(255,255,255,.7)');OV(g,15,26,1.3,1.6,0,'rgba(255,255,255,.45)');},{n:2,f:Math.PI/2});
/* a splat of mud on the ground (top view, drawn flat): a pool with lobes and loose drops round it */
def('mudSplat',64,64,(g,p,v)=>{SEED=7+v*131;const C=[[32,32,13+rn()*3]];for(let i=0;i<7;i++){const a=i/7*TAU+rn()*.5,d=10+rn()*7;C.push([32+Math.cos(a)*d,32+Math.sin(a)*d,5+rn()*4]);}
  const S=[];for(let i=0;i<6;i++){const a=rn()*TAU,d=21+rn()*8;S.push([32+Math.cos(a)*d,32+Math.sin(a)*d,1.6+rn()*2.2]);}
  const blob=(k,dx,dy)=>{g.beginPath();for(const c of C){g.moveTo(c[0]+dx+c[2]*k,c[1]+dy);g.arc(c[0]+dx,c[1]+dy,c[2]*k,0,TAU);}for(const c of S){g.moveTo(c[0]+dx+c[2]*k,c[1]+dy);g.arc(c[0]+dx,c[1]+dy,c[2]*k,0,TAU);}};
  blob(1.08,1,1.5);g.fillStyle=rgba(p[0],.55);g.fill();blob(1,0,0);g.fillStyle=p[1];g.fill();blob(.78,-.6,-.8);g.fillStyle=p[2];g.fill();
  g.fillStyle=rgba(p[3],.8);for(const c of C.slice(0,4))OV(g,c[0]-c[2]*.35,c[1]-c[2]*.4,c[2]*.32,c[2]*.18,-.5,rgba(p[3],.75));OV(g,26,26,3.4,1.8,-.5,'rgba(255,255,255,.55)');},{n:3,noink:1});
/* a splash crown, side view, standing on its base (anchor the bottom middle): a cup of liquid with 7 tongues, a drop over each */
def('crown',68,52,(g,p,v)=>{SEED=3+v*57;const N=7,T=[];for(let i=0;i<N;i++){const u=i/(N-1),x=8+u*52,h=(i===0||i===N-1)?14+rn()*6:20+rn()*16;T.push([x,46-h-Math.sin(u*Math.PI)*4]);}
  const back=()=>{g.beginPath();g.moveTo(4,46);for(let i=0;i<N;i++){const [x,y]=T[i],px=i?T[i-1][0]:4;g.quadraticCurveTo((px+x)/2,y+12,x,y);}g.quadraticCurveTo(62,40,64,46);g.closePath();};
  back();g.fillStyle=LG(g,0,8,0,48,0,p[3],.55,p[2],1,p[1]);g.fill();g.save();back();g.clip();g.fillStyle=rgba(p[0],.22);g.fillRect(0,0,68,22);g.restore();
  for(const [x,y] of T){OV(g,x+.5,y-7-rn()*5,2.6+rn()*1.6,3.2+rn()*1.8,0,p[2]);OV(g,x-.4,y-8,1,1.3,0,rgba(p[4],.8));}
  OV(g,34,46,30,6.4,0,p[1]);OV(g,34,45,26,4.6,0,p[2]);OV(g,34,44.2,20,2.6,0,rgba(p[3],.9));
  g.strokeStyle=rgba(p[4],.75);g.lineWidth=1.3;g.lineCap='round';for(let i=1;i<N-1;i+=2){const [x,y]=T[i];g.beginPath();g.moveTo(x-2,y+14);g.quadraticCurveTo(x-1.2,y+6,x,y+1.5);g.stroke();}},{n:2});
/* the taunt mark: four bent veins (red), over a provoked enemy */
def('anger',32,32,(g)=>{const d='M5 12 C10 12 12 10 12 5 M20 5 C20 10 22 12 27 12 M27 20 C22 20 20 22 20 27 M12 27 C12 22 10 20 5 20';g.lineCap='round';ST(g,d,'#7a0a14',6.4);ST(g,d,'#e8283c',4.2);ST(g,d,'#ff9a9a',1.4);});
/* the hippo's mouth from the front — upper jaw: the wide muzzle with its nostril bumps, the pink palate at the bottom edge, two small fangs */
def('jawU',96,54,(g)=>{const m='M6 44 C4 26 14 8 34 6 C40 5 44 8 48 8 C52 8 56 5 62 6 C82 8 92 26 90 44 C80 52 62 53 48 52 C34 53 16 52 6 44Z';
  F(g,m,LG(g,0,4,0,54,0,SK3,.4,SK2,.85,SK1,1,SK0));g.save();g.clip(new Path2D(m));OV(g,48,58,46,12,0,PK1);OV(g,48,57,40,8,0,PK2);OV(g,30,14,16,6,-.25,'rgba(255,255,255,.16)');g.restore();
  for(const x of [33,63]){OV(g,x,16,9.5,6.5,0,SK3);OV(g,x,17.5,4,2.6,x<48?.35:-.35,'#1a1e2a');OV(g,x-2,14,2.6,1.4,0,'rgba(255,255,255,.4)');}
  for(const s of [-1,1]){const x=48+s*30;F(g,`M${x-4*s} 46 L${x} 54 L${x+3*s} 45 Z`,CRM);}
  ST(g,'M10 40 C24 46 72 46 86 40',rgba(SK0,.55),1.4);for(const [x,y] of [[24,30],[28,34],[68,30],[72,34],[20,35],[76,35]])OV(g,x,y,1.1,1.1,0,rgba(SK0,.5));});
/* lower jaw: the round chin, the tongue, two big curved tusks at the corners and two small teeth in front (the mouth line is 15 px from the top) */
def('jawL',96,64,(g)=>{g.translate(0,12);const m='M6 10 C10 4 30 3 48 3 C66 3 86 4 90 10 C92 30 74 48 48 48 C22 48 4 30 6 10Z';
  F(g,m,LG(g,0,0,0,50,0,SK2,.5,SK1,1,SK0));g.save();g.clip(new Path2D(m));OV(g,48,4,40,12,0,PK0);OV(g,48,8,30,9,0,PK1);OV(g,46,6,14,4,0,PK2);g.restore();
  for(const s of [-1,1]){const x=48+s*33,t=`M${x-5} 13 C${x-6} 2 ${x+s*2} -4 ${x+s*7} -10 C${x+s*3} -1 ${x+5} 5 ${x+5} 13Z`;F(g,t,LG(g,x-6,0,x+6,0,0,'#f3e2b8',.5,CRM,1,'#d8c08a'));ST(g,`M${x-2} 11 C${x-2} 3 ${x+s*1} -3 ${x+s*5} -8`,'rgba(255,255,255,.7)',1.1);}
  for(const x of [42,54])F(g,`M${x-3.4} 9 L${x} 1 L${x+3.4} 9 Z`,CRM);ST(g,'M14 18 C28 30 68 30 82 18',rgba(SK3,.5),1.4);},{noink:0});
/* a chunk of watermelon: rind, pale layer, red flesh, black seeds */
def('melonBit',28,24,(g,p,v)=>{g.translate(14,12);g.rotate(v*1.1);g.translate(-14,-12);const w='M2 18 C8 22 20 22 26 18 L15 2 Z';
  F(g,'M1.5 18.5 C8 24 20 24 26.5 18.5 L25 16.5 C19 20 9 20 3 16.5 Z','#2f7a2a');F(g,'M3 16.6 C9 20.2 19 20.2 25 16.6 L24 15 C18.5 18 9.5 18 4 15 Z','#d8f0b0');
  F(g,'M4 15 C9.5 18 18.5 18 24 15 L15 2 Z',LG(g,0,2,0,18,0,'#ff6a6a',.6,'#ef3a46',1,'#d42838'));for(const [x,y] of [[12,10],[17,11],[14,13.5]])OV(g,x,y,.9,1.5,.3,'#1a0a0a');OV(g,13,6,1.4,2.4,.4,'rgba(255,255,255,.45)');},{n:3});
/* Taweret's ankh, gold (palette) */
def('hpAnkh',32,50,(g,p)=>{const d=()=>{g.beginPath();g.ellipse(16,13,7.5,9.5,0,0,TAU);g.moveTo(16,23);g.lineTo(16,46);g.moveTo(4,26);g.lineTo(28,26);g.stroke();};g.lineCap='round';
  g.strokeStyle=p[1];g.lineWidth=8;d();g.strokeStyle=LG(g,0,2,0,48,0,p[4],.35,p[3],1,p[2]);g.lineWidth=5.2;d();g.strokeStyle='rgba(255,255,255,.75)';g.lineWidth=1.3;g.beginPath();g.ellipse(15,12,6,8,0,2.6,4.6);g.moveTo(14.6,25);g.lineTo(14.6,44);g.stroke();});
/* the hippo under the water: only the top of the head shows — ears, eyes, the nostril bumps; the bottom edge is the waterline */
def('hpPeek',88,46,(g)=>{const h='M10 46 C10 30 20 18 30 16 C36 14 40 18 44 18 C48 18 52 14 58 16 C68 18 78 30 78 46Z';
  for(const s of [-1,1]){g.save();g.translate(44+s*27,13);g.rotate(s*.5);OV(g,0,0,5.6,8,0,SK1);OV(g,0,1,3,5.2,0,PK2);g.restore();}
  F(g,h,LG(g,0,14,0,46,0,SK3,.45,SK2,1,SK1));
  for(const s of [-1,1]){const x=44+s*13;OV(g,x,19,10,8.6,0,SK2);OV(g,x,20,6.8,6,0,'#ffffff');OV(g,x+s*.6,21,3.6,4,0,'#5a3418');OV(g,x+s*.6,21.6,1.8,2.2,0,'#0e0a08');OV(g,x-1.6,18.6,1.5,1.5,0,'#ffffff');ST(g,`M${x-8} 14 C${x-3} 10 ${x+3} 10 ${x+8} 14`,rgba(SK0,.6),1.4);}
  for(const s of [-1,1]){const x=44+s*7;OV(g,x,41,6.4,4.8,0,SK2);OV(g,x,41.5,2.4,1.6,s*.4,'#1a1e2a');}OV(g,30,30,6,2.4,-.3,'rgba(255,255,255,.18)');},{noink:1});
/* a small lotus flower, 3/4 view: three petals behind, three in front, gold heart */
def('lotusFl',44,32,(g,p)=>{const pet=(x,y,a,L,W,col)=>{g.save();g.translate(x,y);g.rotate(a);g.fillStyle=col;g.beginPath();g.moveTo(0,0);g.quadraticCurveTo(-W,-L*.55,0,-L);g.quadraticCurveTo(W,-L*.55,0,0);g.fill();g.restore();};
  for(const [a,L] of [[-1.15,17],[0,20],[1.15,17]])pet(22,26,a,L,7.5,LG(g,0,6,0,26,0,p[3],1,p[1]));OV(g,22,24.5,9,3.6,0,GOLD[2]);OV(g,22,23.6,6,2,0,GOLD[3]);
  for(const [a,L] of [[-.62,16],[.62,16],[0,13]])pet(22,29,a,L,7,LG(g,0,14,0,29,0,p[4],.5,p[3],1,p[2]));OV(g,22,30,12,2.2,0,rgba(p[1],.6));});
/* a shard of Hapi's jar: blue glaze with a gold band */
def('potBit',24,22,(g,p,v)=>{SEED=11+v*19;const q=[];for(let i=0;i<5;i++){const a=i/5*TAU+rn()*.6,r=7+rn()*4;q.push([12+Math.cos(a)*r,11+Math.sin(a)*r]);}
  g.fillStyle=LG(g,0,0,24,22,0,'#4a7ad8',1,'#1f3f90');g.beginPath();q.forEach((z,i)=>i?g.lineTo(z[0],z[1]):g.moveTo(z[0],z[1]));g.closePath();g.fill();
  g.save();g.clip();g.fillStyle=GOLD[2];g.fillRect(0,9+v*2,24,3.4);g.fillStyle=GOLD[3];g.fillRect(0,9+v*2,24,1.2);g.restore();ST(g,`M${q[0][0]} ${q[0][1]} L${q[1][0]} ${q[1][1]}`,'rgba(255,255,255,.55)',1.2);},{n:3});
/* a hippo footprint (top view): a round pad and four toes in front (points up = the way it walked) */
def('hpPrint',40,40,(g,p)=>{OV(g,20,25,10,9,0,p[1]);for(const [x,y,r] of [[8,13,4.6],[15,8,4.8],[25,8,4.8],[32,13,4.6]])OV(g,x,y,r,r*1.15,0,p[1]);OV(g,20,24,6.5,5.5,0,rgba(p[0],.5));},{noink:1});

/* ---------- floor pictures (painted once per kind + palette) ---------- */
const RC={};
function ankhPath(g,s){g.beginPath();g.ellipse(0,-20*s,11*s,14*s,0,0,TAU);g.moveTo(0,-6*s);g.lineTo(0,34*s);g.moveTo(-18*s,-1*s);g.lineTo(18*s,-1*s);}
function petalPath(g,r0,r1,w){g.beginPath();g.moveTo(r0,0);g.quadraticCurveTo((r0+r1)/2,-w,r1,0);g.quadraticCurveTo((r0+r1)/2,w,r0,0);}
function ring(kind,pl){const p=FX.k.pal(pl),k=kind+p[1]+p[2];if(RC[k])return RC[k];return RC[k]=cv(320,320,g=>{g.translate(160,160);g.lineJoin='round';g.lineCap='round';
    const ci=(r,lw,c)=>{g.lineWidth=lw;g.strokeStyle=c;g.beginPath();g.arc(0,0,r,0,TAU);g.stroke();};
    g.fillStyle=RG(g,0,0,150,0,rgba(p[0],.38),.8,rgba(p[0],.26),1,rgba(p[0],0));g.beginPath();g.arc(0,0,150,0,TAU);g.fill();g.shadowColor=p[2];g.shadowBlur=9;
    if(kind==='taweret'){ci(144,4.5,p[2]);ci(136,1.6,p[3]);ci(100,2.6,p[2]);ci(52,2.6,p[3]);
      for(let i=0;i<16;i++){g.save();g.rotate(i*TAU/16);g.fillStyle=i%2?rgba(p[3],.95):rgba(p[2],.95);petalPath(g,104,i%2?128:134,9);g.fill();g.restore();}
      for(let i=0;i<4;i++){g.save();g.rotate(i*TAU/4);g.translate(0,-76);g.strokeStyle=p[3];g.lineWidth=3.2;ankhPath(g,.42);g.stroke();g.restore();}
      for(let i=0;i<4;i++){const a=i*TAU/4+TAU/8;g.fillStyle=p[4];g.beginPath();g.arc(Math.cos(a)*76,Math.sin(a)*76,5,0,TAU);g.fill();g.strokeStyle=p[2];g.lineWidth=1.6;g.beginPath();g.arc(Math.cos(a)*76,Math.sin(a)*76,9,0,TAU);g.stroke();}
      for(let i=0;i<12;i++){g.save();g.rotate(i*TAU/12);g.fillStyle=p[2];g.beginPath();g.moveTo(26,-4);g.lineTo(42,0);g.lineTo(26,4);g.closePath();g.fill();g.restore();}g.fillStyle=RG(g,0,0,24,0,p[4],.6,p[3],1,p[2]);g.beginPath();g.arc(0,0,22,0,TAU);g.fill();}
    else if(kind==='nile'){ci(144,4,p[2]);ci(112,2.4,p[2]);ci(56,2,p[3]);
      for(const r of [120,128,136]){g.lineWidth=2.2;g.strokeStyle=r===128?p[3]:p[2];g.beginPath();for(let i=0;i<=96;i++){const a=i/96*TAU,rr=r+(i%2?3.2:-3.2);i?g.lineTo(Math.cos(a)*rr,Math.sin(a)*rr):g.moveTo(Math.cos(a)*rr,Math.sin(a)*rr);}g.stroke();}
      for(let i=0;i<8;i++){g.save();g.rotate(i*TAU/8);g.translate(0,-84);g.fillStyle=rgba(p[3],.95);g.beginPath();g.moveTo(0,-14);g.quadraticCurveTo(9,-2,0,8);g.quadraticCurveTo(-9,-2,0,-14);g.fill();g.strokeStyle=p[2];g.lineWidth=1.6;g.beginPath();g.moveTo(0,8);g.lineTo(0,18);g.stroke();g.restore();}
      for(let i=0;i<8;i++){g.save();g.rotate(i*TAU/8+TAU/16);g.fillStyle=rgba(p[4],.9);petalPath(g,8,40,8);g.fill();g.restore();}}
    else{ci(146,6,p[1]);ci(138,2,p[3]);for(let i=0;i<40;i++){const a=i/40*TAU;g.fillStyle=i%2?p[2]:p[3];g.beginPath();g.arc(Math.cos(a)*142,Math.sin(a)*142,i%2?2.2:3.2,0,TAU);g.fill();}}});}
window.HIPART={ring};
})();
