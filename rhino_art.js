/* =====================================================================
   WOOLLY RHINO 'Glacier Titan' — vector art for the skill effects v3 (rhino_vfx.js). Drawn by code once into canvases
   (FXLIB sprites). These are the fallback / support drawings; the owner's painted pictures (assets/fx/rhino) are the main
   pieces wherever one exists (RHINO_FX_PLAN_TH.md).
     rxFist   his gauntlet, side view, knuckles pointing RIGHT: dark iron, wide copper band with rivets, iron spikes on the
              back of the hand, blocky glacier-ice crystals on the knuckles, a chestnut fur tuft at the cut-off forearm.
              v0 = real · v1 = glacier spirit (all ice-blue light) · v2 = copper-hot (Meteor / Fury) · v3 = crimson (Revenge)
              RXFIST = where the knuckle tip / the copper band sit in the art box (for aiming)
     rxStud   a copper momentum stud (diamond with a rivet)                        rxPlate  a riveted dark-iron shield plate
     rxIce    a blocky glacier crystal (3 shapes)                                  rxFur    a tuft of chestnut fur (debris)
   ===================================================================== */
(()=>{
'use strict';
if(typeof CHAR!=='undefined'&&CHAR!=='rhino')return;
const FX=window.FXLIB;if(!FX)return;
const {defSprite:def,F,ST,LG,RG,OV,rgba,TAU}=FX.k;
const INK='#24160f',ICEINK='#16324e';
const poly=(g,pts)=>{g.beginPath();pts.forEach((q,i)=>i?g.lineTo(q[0],q[1]):g.moveTo(q[0],q[1]));g.closePath();};
const fillP=(g,pts,col,ink,lw)=>{poly(g,pts);g.fillStyle=col;g.fill();if(ink){g.lineJoin='round';g.lineWidth=lw||2.4;g.strokeStyle=ink;g.stroke();}};
const rrect=(g,x,y,w,h,r)=>{g.beginPath();g.moveTo(x+r,y);g.lineTo(x+w-r,y);g.quadraticCurveTo(x+w,y,x+w,y+r);g.lineTo(x+w,y+h-r);g.quadraticCurveTo(x+w,y+h,x+w-r,y+h);g.lineTo(x+r,y+h);g.quadraticCurveTo(x,y+h,x,y+h-r);g.lineTo(x,y+r);g.quadraticCurveTo(x,y,x+r,y);g.closePath();};
/* colour sets of the gauntlet variants: fur · iron (top, mid, low) · copper (lite, mid, deep) · rivet · ice (lite, mid, deep) · outline */
const SET=[
 {fur:['#c97a3e','#9a5226','#6a3416'],iron:['#66748a','#3a4454','#1e242e'],cu:['#ffcf96','#e48c48','#9a4a18'],rv:'#ffe6c4',ice:['#f2fbff','#a9e2ff','#5aa6e0'],ink:INK},
 {fur:['#e8f7ff','#a9dcff','#5aa0e0'],iron:['#cfeeff','#7cc6f2','#2f7fd0'],cu:['#ffffff','#d4f2ff','#8fd0ff'],rv:'#ffffff',ice:['#ffffff','#e6f8ff','#9fdcff'],ink:'#1e4f86'},
 {fur:['#ffd08a','#e0702a','#8a2e0c'],iron:['#8a5a44','#4a2c22','#24140e'],cu:['#fff2c0','#ffb04a','#d0560e'],rv:'#fff6dc',ice:['#ffffff','#ffe9b8','#ffb46a'],ink:'#3a1406'},
 {fur:['#ff9a7a','#c8322a','#6a0e10'],iron:['#7a4a52','#4a2430','#24101a'],cu:['#ffd6b8','#ff7a4a','#b02a14'],rv:'#fff0e8',ice:['#fff6f2','#ffc0b0','#ff7a6a'],ink:'#2a0606'}];
/* art box 112×68; knuckle tip x≈108, band centre x≈38; everything sits on y 34 */
const RXFIST={w:112,h:68,tip:[108,34],band:[38,34],wrist:[22,34]};
def('rxFist',112,68,(g,p,v)=>{const S=SET[v%4];g.lineJoin='round';g.lineCap='round';
  /* fur tuft at the cut-off end of the forearm */
  const tuft=[[16,10],[6,12],[11,18],[1,24],[9,29],[0,36],[9,41],[2,49],[12,51],[8,58],[18,56],[22,62],[26,54]];
  fillP(g,tuft,LG(g,0,8,0,62,0,S.fur[0],.5,S.fur[1],1,S.fur[2]),S.ink,2.2);
  /* forearm of dark iron */
  rrect(g,16,15,40,38,6);g.fillStyle=LG(g,0,15,0,53,0,S.iron[0],.35,S.iron[1],1,S.iron[2]);g.fill();g.lineWidth=2.6;g.strokeStyle=S.ink;g.stroke();
  /* wide copper band + rivets */
  rrect(g,29,10,19,48,4);g.fillStyle=LG(g,0,10,0,58,0,S.cu[0],.3,S.cu[1],1,S.cu[2]);g.fill();g.lineWidth=2.6;g.strokeStyle=S.ink;g.stroke();
  g.strokeStyle=rgba(S.cu[2],.8);g.lineWidth=1.4;g.beginPath();g.moveTo(31,15);g.lineTo(46,15);g.moveTo(31,53);g.lineTo(46,53);g.stroke();
  for(const y of [20,34,48]){OV(g,38.5,y,3.4,3.4,0,S.ink);OV(g,38.5,y,2.5,2.5,0,S.rv);OV(g,37.7,y-.9,1,1,0,'#ffffff');}
  /* the hand: a heavy iron block */
  const hand=[[48,13],[78,8],[88,12],[90,56],[78,60],[48,55]];fillP(g,hand,LG(g,0,8,0,60,0,S.iron[0],.3,S.iron[1],1,S.iron[2]),S.ink,2.6);
  g.strokeStyle=rgba('#ffffff',.25);g.lineWidth=1.6;g.beginPath();g.moveTo(52,16);g.lineTo(77,12);g.stroke();
  /* iron spikes on the back of the hand */
  for(const [x0,x1,tx,ty] of [[54,62,52,1],[64,72,63,-1],[74,82,74,1]]){fillP(g,[[x0,11.5],[tx,ty],[x1,10]],LG(g,0,ty,0,12,0,S.iron[0],1,S.iron[1]),S.ink,1.8);}
  /* the knuckles: four blocky glacier crystals */
  const blk=(y0,j)=>{const h=11.6,x0=84,pts=[[x0,y0+1],[x0+14,y0-1+j],[x0+23,y0+3],[x0+24.5,y0+h-2],[x0+15,y0+h+1-j],[x0,y0+h]];
    fillP(g,pts,LG(g,x0,0,x0+25,0,0,S.ice[2],.45,S.ice[1],1,S.ice[0]),v===1?S.ink:ICEINK,2);
    g.fillStyle=rgba(S.ice[0],.95);g.beginPath();g.moveTo(x0+14,y0-1+j+1);g.lineTo(x0+22.4,y0+3.3);g.lineTo(x0+16,y0+6);g.closePath();g.fill();
    g.fillStyle=rgba(S.ice[2],.55);g.beginPath();g.moveTo(x0+2,y0+h-1);g.lineTo(x0+15,y0+h-j);g.lineTo(x0+12,y0+h-4);g.closePath();g.fill();};
  blk(10.5,0);blk(22,1);blk(33.5,0);blk(45,1);
  /* a thumb plate under the hand */
  fillP(g,[[56,54],[74,56],[80,63],[60,64]],LG(g,0,54,0,64,0,S.iron[1],1,S.iron[2]),S.ink,2.2);},{n:4,noink:1,f:0});
/* copper momentum stud */
def('rxStud',22,22,(g,p)=>{fillP(g,[[11,1],[21,11],[11,21],[1,11]],LG(g,0,1,0,21,0,'#ffe0b0',.45,'#e48c48',1,'#8a3e12'),INK,2);OV(g,11,11,3.2,3.2,0,'#fff2dc');OV(g,10.2,10.2,1.2,1.2,0,'#ffffff');},{noink:1});
/* riveted dark-iron shield plate (front view, 40×52) */
def('rxPlate',40,52,(g,p)=>{const pl=[[4,4],[36,4],[38,30],[20,50],[2,30]];fillP(g,pl,LG(g,0,4,0,50,0,'#7a889e',.4,'#3e4858',1,'#1e242e'),INK,2.6);
  const in2=[[9,9],[31,9],[32,28],[20,42],[8,28]];poly(g,in2);g.lineWidth=1.6;g.strokeStyle=rgba('#e48c48',.9);g.stroke();
  for(const [x,y] of [[8,8],[32,8],[20,44]]){OV(g,x,y,2.6,2.6,0,INK);OV(g,x,y,1.8,1.8,0,'#ffd9a8');}
  fillP(g,[[20,15],[26,24],[20,33],[14,24]],LG(g,0,15,0,33,0,'#ffffff',.5,'#a9e2ff',1,'#5aa6e0'),ICEINK,1.6);},{noink:1});
/* blocky glacier crystal debris */
def('rxIce',26,30,(g,p,v)=>{const S=[[[13,1],[24,9],[22,27],[6,29],[2,10]],[[10,2],[22,4],[25,20],[14,29],[3,19]],[[5,4],[19,1],[25,14],[18,28],[4,22]]][v%3];
  fillP(g,S,LG(g,0,0,26,30,0,'#ffffff',.35,'#a9e2ff',1,'#4a92d8'),ICEINK,1.8);g.fillStyle='rgba(255,255,255,.85)';g.beginPath();g.moveTo(S[0][0],S[0][1]+2);g.lineTo(S[1][0]-2,S[1][1]+1);g.lineTo(13,13);g.closePath();g.fill();},{n:3,noink:1});
/* a tuft of chestnut fur (mane debris for the roar / fury) */
def('rxFur',30,16,(g,p)=>{F(g,'M2 9 C8 2 18 1 28 4 C22 6 20 8 24 10 C16 11 14 13 18 15 C10 15 5 13 2 9 Z',LG(g,0,0,0,16,0,'#d08a4a',.5,'#9a5226',1,'#5a2a10'));},{});
/* floor seals, 320² pictures painted once (drawn flat on the ground, turned slowly):
     'iron'  = a riveted dark-iron hexagon with copper rivets and a glacier chevron (cast circle, Guardian Stance)
     'frost' = a glacier ring with ice teeth and a snowflake (Frozen Bastion, Eternal Fortress, Immovable Colossus) */
const SC={};
function seal(kind,pl){const p=FX.k.pal(pl||'glacier'),key=kind+p[1]+p[2];if(SC[key])return SC[key];return SC[key]=FX.k.cv(320,320,g=>{g.translate(160,160);g.lineJoin='round';g.lineCap='round';
  g.fillStyle=RG(g,0,0,150,0,rgba(p[0],.42),.78,rgba(p[0],.3),1,rgba(p[0],0));g.beginPath();g.arc(0,0,150,0,TAU);g.fill();
  const hex=(r,rot)=>{g.beginPath();for(let i=0;i<6;i++){const a=rot+i*TAU/6;i?g.lineTo(Math.cos(a)*r,Math.sin(a)*r):g.moveTo(Math.cos(a)*r,Math.sin(a)*r);}g.closePath();};
  const ci=(r,lw,c)=>{g.lineWidth=lw;g.strokeStyle=c;g.beginPath();g.arc(0,0,r,0,TAU);g.stroke();};
  if(kind==='iron'){g.shadowColor=p[2];g.shadowBlur=10;ci(146,3,rgba(p[2],.9));g.shadowBlur=0;
    hex(136,Math.PI/6);g.lineWidth=20;g.strokeStyle='#1c222c';g.stroke();g.lineWidth=14;g.strokeStyle=LG(g,0,-136,0,136,0,'#7d8aa0',.5,'#46505f',1,'#2a313c');g.stroke();g.lineWidth=2;g.strokeStyle='rgba(255,255,255,.35)';hex(142,Math.PI/6);g.stroke();
    for(let i=0;i<6;i++){const a=Math.PI/6+i*TAU/6,x=Math.cos(a)*136,y=Math.sin(a)*136;OV(g,x,y,10,10,0,'#24160f');OV(g,x,y,7.5,7.5,0,'#e48c48');OV(g,x-2,y-2,2.6,2.6,0,'#fff2dc');}
    for(let i=0;i<6;i++){const a=i*TAU/6,x=Math.cos(a)*136,y=Math.sin(a)*136;OV(g,x,y,4.4,4.4,0,'#e48c48');}
    g.shadowColor=p[2];g.shadowBlur=9;hex(86,0);g.lineWidth=3;g.strokeStyle=p[2];g.stroke();ci(60,2,rgba(p[3],.85));
    g.fillStyle=LG(g,0,-20,0,30,0,p[4],.5,p[3],1,p[2]);g.beginPath();g.moveTo(0,-40);g.lineTo(-40,12);g.lineTo(-24,12);g.lineTo(0,-16);g.lineTo(24,12);g.lineTo(40,12);g.closePath();g.fill();
    g.beginPath();g.moveTo(0,-8);g.lineTo(-30,32);g.lineTo(-16,32);g.lineTo(0,12);g.lineTo(16,32);g.lineTo(30,32);g.closePath();g.fill();g.shadowBlur=0;}
  else{g.shadowColor=p[2];g.shadowBlur=10;ci(142,4,p[2]);ci(124,2,rgba(p[3],.9));ci(66,2.4,p[2]);
    for(let i=0;i<16;i++){g.save();g.rotate(i*TAU/16);const L=i%2?126:142;g.fillStyle=LG(g,104,0,L,0,0,p[1],.5,p[2],1,p[4]);g.beginPath();g.moveTo(104,-7);g.lineTo(L,0);g.lineTo(104,7);g.closePath();g.fill();g.restore();}
    g.lineCap='round';for(const [lw,c] of [[9,rgba(p[1],.9)],[4.5,p[3]],[1.8,'#ffffff']]){g.lineWidth=lw;g.strokeStyle=c;for(let i=0;i<6;i++){g.save();g.rotate(i*Math.PI/3);g.beginPath();g.moveTo(0,0);g.lineTo(0,-52);g.moveTo(0,-30);g.lineTo(-13,-43);g.moveTo(0,-30);g.lineTo(13,-43);g.stroke();g.restore();}}g.shadowBlur=0;}});}
window.RXART={RXFIST,SET,seal};
})();
