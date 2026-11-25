/* =====================================================================
   ANUBIS JACKAL — vector art for the skill effects v4 (anubis_vfx.js). Drawn by code once into canvases (FXLIB sprites: the
   palette decides gold / violet / sun versions). Nothing here is a picture file.
     anFlail   the spiked iron ball of his flail (gold spikes, gold ankh)        anAnkh   gold ankh
     anHook    the Soul Hook's crescent hook (points right)                       anMaat   the feather of Ma'at (upright)
     anHeadU / anHeadL   the giant Anubis head, side view facing right: skull + ears + upper jaw / lower jaw (hinge = HINGE)
     anJackal  a leaping jackal shade (facing right)                              anStd    the Standard of Ra (pole, winged sun disc, streamers)
     anGate    the Underworld Gate (pylon doorway, lit from inside)               anLinen  a strip of mummy linen (2 shapes)
     anCrook / anFlailE   Osiris's crook and flail (for the seal)                 anPan    one pan of the scales
   ANUART.ring(kind, palette) → a 320² floor picture: 'sun' (wheel of Ra) · 'duat' (judgment ring) · 'seal' (Osiris's seal) ·
     'ankh' (the mark a Meteor Ankh leaves) · 'life' (lotus ring of the rites)
   ===================================================================== */
(()=>{
'use strict';
if(typeof CHAR!=='undefined'&&CHAR!=='anubis')return;
const FX=window.FXLIB;if(!FX)return;
const {defSprite:def,cv,F,ST,LG,RG,OV,inS,rgba,PAL,TAU}=FX.k;
const GOLD=PAL.gold,FUR0='#120c1c',FUR1='#241a38',FUR2='#3a2c58';
const tri=(g,a,b,c,col)=>{g.fillStyle=col;g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.lineTo(c[0],c[1]);g.closePath();g.fill();};

/* the flail ball: dark bronze iron, 8 gold spikes, a gold ankh on its face */
def('anFlail',52,52,(g,p)=>{g.save();g.translate(26,26);for(let i=0;i<8;i++){g.save();g.rotate(i*TAU/8+.2);g.fillStyle=LG(g,0,-11,0,-25,0,p[1],.5,p[2],1,p[4]);g.beginPath();g.moveTo(-4.6,-11);g.lineTo(0,-25);g.lineTo(4.6,-11);g.closePath();g.fill();g.fillStyle='rgba(255,255,255,.5)';g.beginPath();g.moveTo(-1.2,-12);g.lineTo(0,-23);g.lineTo(.8,-12);g.closePath();g.fill();g.restore();}
  g.fillStyle=RG(g,-5,-6,17,0,'#9a6e52',.45,'#5a3a30',1,'#1e1218');g.beginPath();g.arc(0,0,14,0,TAU);g.fill();g.strokeStyle=rgba(p[2],.85);g.lineWidth=1.6;g.beginPath();g.arc(0,0,13.2,.5,2.6);g.stroke();
  const a='M0 -1 L0 8 M-4.5 1.5 L4.5 1.5';g.lineCap='round';g.strokeStyle=p[1];g.lineWidth=4.2;g.stroke(new Path2D(a));g.beginPath();g.ellipse(0,-5,3,3.8,0,0,TAU);g.stroke();
  g.strokeStyle=p[3];g.lineWidth=2.2;g.stroke(new Path2D(a));g.beginPath();g.ellipse(0,-5,3,3.8,0,0,TAU);g.stroke();OV(g,-6,-7,3.2,2,-.6,'rgba(255,255,255,.55)');g.restore();});
def('anAnkh',32,50,(g,p)=>{const d=()=>{g.beginPath();g.ellipse(16,13,7.5,9.5,0,0,TAU);g.moveTo(16,23);g.lineTo(16,46);g.moveTo(4,26);g.lineTo(28,26);g.stroke();};g.lineCap='round';
  g.strokeStyle=p[1];g.lineWidth=8;d();g.strokeStyle=LG(g,0,2,0,48,0,p[4],.35,p[3],1,p[2]);g.lineWidth=5.2;d();g.strokeStyle='rgba(255,255,255,.75)';g.lineWidth=1.3;g.beginPath();g.ellipse(15,12,6,8,0,2.6,4.6);g.moveTo(14.6,25);g.lineTo(14.6,44);g.stroke();});
def('anHook',50,40,(g,p)=>{const d='M8 24 L26 24 C40 24 46 12 36 5';g.lineCap='round';g.lineJoin='round';ST(g,d,p[1],8.5);ST(g,d,LG(g,0,0,50,0,0,p[2],.6,p[3],1,p[4]),5.2);ST(g,'M10 22.6 L26 22.6 C37 22.6 42 13 35.5 7','rgba(255,255,255,.7)',1.3);
  F(g,'M36 5 L27 1 L31 10 Z',p[1]);F(g,'M35 5.4 L29.5 3 L32 8.6 Z',p[4]);g.strokeStyle=p[1];g.lineWidth=5;g.beginPath();g.arc(7,24,4.4,0,TAU);g.stroke();g.strokeStyle=p[3];g.lineWidth=2.4;g.beginPath();g.arc(7,24,4.4,0,TAU);g.stroke();},{f:0});
def('anMaat',28,62,(g,p)=>{const v='M14 58 C2 46 1 22 9 9 C11 4 16 2 18 5 C27 14 26 42 15 58 Z';F(g,v,LG(g,0,0,28,0,0,p[3],.45,'#ffffff',.55,'#ffffff',1,p[3]));g.save();g.clip(new Path2D(v));g.strokeStyle=rgba(p[2],.5);g.lineWidth=.9;for(let i=0;i<12;i++){const y=12+i*4;g.beginPath();g.moveTo(14,y+4);g.lineTo(1,y-3);g.moveTo(14,y+4);g.lineTo(27,y-3);g.stroke();}g.restore();
  ST(g,'M14 60 C14 40 13 20 16 6',GOLD[1],2.6);ST(g,'M14 60 C14 40 13 20 16 6',GOLD[3],1.3);ST(g,'M16 6 C19 2 23 4 21 8',GOLD[2],1.6);});
/* the giant head (side view, facing right). Art box 128×112; the lower jaw (84×36) turns about HINGE */
const HEAD_U='M12 110 L14 66 C15 56 20 47 30 42 L40 2 L48 38 C56 39 64 42 70 46 L118 60 C122 61 125 64 123 68 L110 71 L84 73 L64 76 C60 80 58 84 58 88 L56 110 Z';
def('anHeadU',128,112,(g,p)=>{F(g,'M17 54 L24 6 L35 43 Z',FUR0);F(g,HEAD_U,LG(g,0,0,0,112,0,FUR2,.4,FUR1,1,FUR0));
  g.save();g.clip(new Path2D(HEAD_U));for(let i=0;i<5;i++){g.fillStyle=i%2?'#2a3aa0':GOLD[2];g.beginPath();g.moveTo(6,88+i*5+4);g.quadraticCurveTo(34,84+i*5,62,90+i*5);g.lineTo(62,95+i*5);g.quadraticCurveTo(34,89+i*5,6,93+i*5+4);g.closePath();g.fill();}
  g.fillStyle='rgba(255,255,255,.07)';g.beginPath();g.moveTo(40,2);g.lineTo(48,38);g.lineTo(118,60);g.lineTo(118,66);g.lineTo(46,48);g.lineTo(36,18);g.closePath();g.fill();g.restore();
  F(g,'M39 13 L44.5 36 L34.5 40 Z',LG(g,0,12,0,40,0,GOLD[1],1,'#5a3418'));
  ST(g,'M30 42 L40 2 L48 38 C56 39 64 42 70 46 L118 60',rgba(p[2],.95),1.7);ST(g,'M17 54 L24 6',rgba(p[1],.9),1.2);
  for(const [x,h] of [[88,6],[95,6.5],[102,6],[109,9.5],[116,6]]){const y=73-(x-84)*.085;tri(g,[x,y],[x+2.6,y+h],[x+5.2,y-.3],'#fff6dc');}
  OV(g,121.5,64.5,3.3,2.6,.2,'#06040a');OV(g,120.6,63.6,1.1,.7,0,'rgba(255,255,255,.6)');
  const e='M57 54 C62 48.500 70 48.500 76 54 C70 58.500 62 58.500 57 54 Z';F(g,e,GOLD[1]);inS(g,66.5,54,.78,()=>F(g,e,RG(g,66.5,54,9,0,'#ffffff',.4,p[4],1,p[2])));OV(g,67,54,1.6,3.4,0,'#0a0612');
  ST(g,'M57 54 L48 57 M64 58.500 C63 62 62 65 59 67',GOLD[2],1.5);ST(g,'M56 49 C62 45 70 45 77 50',GOLD[2],1.3);},{noink:1});
const HINGE=[62,75];
def('anHeadL',84,36,(g,p)=>{const d='M4 4 L66 14 C74 15 78 19 74 23 C70 26 60 26 46 26 C28 26 12 20 4 12 Z';F(g,d,LG(g,0,0,0,36,0,FUR1,1,FUR0));ST(g,'M20 22 C34 26.500 56 26.500 72 24',rgba(p[1],.9),1.3);
  for(const [x,h] of [[40,6],[47,6.5],[54,6],[61,9]]){const y=4+(x-4)*10/62+1;tri(g,[x,y],[x+2.6,y-h],[x+5.2,y+.8],'#fff6dc');}},{noink:1});
def('anJackal',100,60,(g,p)=>{const d='M2 30 C10 24 18 24 26 28 C32 20 46 17 58 19 C64 17 68 13 71 11 L72 1 L78 9 L81 2 L85 11 C91 13 96 17 98 21 L90 24 C86 25 82 26 80 28 C79 32 75 35 72 37 L86 47 L93 49 L91 53 L82 52 L65 41 C58 42 50 42 44 41 L35 45 L22 54 L15 54 L17 50 L28 43 L30 36 C24 34 14 35 8 34 Z';
  F(g,d,LG(g,0,0,0,60,0,FUR2,.5,FUR1,1,FUR0));ST(g,'M26 28 C32 20 46 17 58 19 C64 17 68 13 71 11 L72 1 M78 9 L81 2 L85 11 C91 13 96 17 98 21',rgba(p[2],.95),1.5);OV(g,87,15.5,1.9,1.3,.3,p[4]);ST(g,'M66 24 L74 24',GOLD[2],1.4);},{noink:1});
def('anStd',52,106,(g,p)=>{F(g,'M24.4 26 L27.6 26 L28 104 L24 104 Z',LG(g,24,0,28,0,0,'#a8823c',1,'#5a4018'));g.fillStyle=GOLD[2];g.fillRect(23.4,58,5.2,2.6);g.fillRect(23.4,88,5.2,2.6);OV(g,26,104,6,2.2,0,'rgba(0,0,0,.25)');
  F(g,'M22 28 C12 34 18 44 9 54 L14 56 C22 46 17 36 25 30 Z','#c8322a');F(g,'M30 28 C40 36 33 46 41 60 L36 61 C29 48 35 38 27 31 Z','#2a3aa0');tri(g,[9,54],[14,56],[10,61],GOLD[2]);tri(g,[41,60],[36,61],[40,66],GOLD[2]);
  for(const m of [1,-1]){g.save();g.translate(26,0);g.scale(m,1);const w='M8 14 C16 8 22 8 26 13 C22 15 20 18 20 22 C15 18 11 19 8 21 Z';F(g,w,LG(g,8,0,26,0,0,p[2],1,p[1]));ST(g,'M11 16 L22 13 M12 19 L20 17',rgba(p[4],.7),1);g.restore();}
  g.fillStyle=RG(g,26,15,11,0,'#ffffff',.4,p[4],.75,p[3],1,p[2]);g.beginPath();g.arc(26,15,10,0,TAU);g.fill();g.strokeStyle=p[1];g.lineWidth=1.4;g.stroke();});
def('anGate',92,116,(g,p)=>{const o='M4 114 L12 22 L80 22 L88 114 Z',i='M26 114 L30 46 L62 46 L66 114 Z';F(g,o,LG(g,0,0,92,0,0,FUR2,.5,FUR1,1,FUR0));F(g,i,LG(g,0,46,0,114,0,p[1],.45,p[2],.85,p[3],1,p[4]));
  g.save();g.clip(new Path2D(i));g.fillStyle=RG(g,46,112,40,0,'rgba(255,255,255,.9)',1,'rgba(255,255,255,0)');g.fillRect(20,60,52,56);g.restore();
  F(g,'M8 22 L84 22 L91 11 L1 11 Z',LG(g,0,11,0,22,0,FUR2,1,FUR0));ST(g,'M1 11 L91 11 M8 22 L84 22 M12 26 L80 26',GOLD[2],1.5);ST(g,i,GOLD[2],1.6);ST(g,'M4 114 L12 22 M88 114 L80 22',rgba(p[2],.8),1.3);
  for(const m of [1,-1]){g.save();g.translate(46,0);g.scale(m,1);F(g,'M5 34 C12 29 18 30 24 34 C18 35 14 37 12 40 C10 37 7 36 5 37 Z',GOLD[2]);g.restore();}OV(g,46,34,5.5,5.5,0,p[3]);OV(g,46,34,3,3,0,'#ffffff');
  g.fillStyle=rgba(GOLD[2],.55);for(let k=0;k<7;k++)for(const x of [17,71]){const y=50+k*9;if(k%3===0)g.fillRect(x-2,y,4,5);else if(k%3===1){g.beginPath();g.arc(x,y+2.5,2.2,0,TAU);g.fill();}else{g.beginPath();g.moveTo(x-2.4,y+5);g.lineTo(x,y);g.lineTo(x+2.4,y+5);g.closePath();g.fill();}}});
def('anLinen',48,14,(g,p,v)=>{const d=v%2?'M2 9 C14 12 30 11 46 6 L45 1 C31 5 15 6 3 3 Z':'M2 4 C12 1 30 2 46 5 L45 11 C30 9 14 9 3 12 Z';F(g,d,LG(g,0,0,0,14,0,p[4],.5,p[3],1,p[2]));g.save();g.clip(new Path2D(d));g.strokeStyle=rgba(p[1],.45);g.lineWidth=.8;for(let x=5;x<48;x+=5){g.beginPath();g.moveTo(x,0);g.lineTo(x-2,14);g.stroke();}g.restore();},{n:2});
def('anPan',56,26,(g,p)=>{F(g,'M2 8 C8 26 48 26 54 8 Z',LG(g,0,8,0,26,0,p[3],.5,p[2],1,p[1]));OV(g,28,8,26,5,0,p[1]);OV(g,28,7.4,23.5,3.8,0,p[4]);ST(g,'M4 12 C12 24 44 24 52 12',rgba(p[4],.6),1.2);},{noink:1});
def('anCrook',30,70,(g,p)=>{const d='M12 68 L12 22 C12 4 28 6 26 18 C25 24 19 24 19 19';g.lineCap='round';ST(g,d,p[1],7);ST(g,d,p[2],4.4);g.strokeStyle='#2a3aa0';g.lineWidth=4.4;g.setLineDash([4,6]);g.stroke(new Path2D('M12 66 L12 24'));g.setLineDash([]);ST(g,'M10.6 66 L10.6 24','rgba(255,255,255,.55)',1);},{noink:1});
def('anFlailE',40,70,(g,p)=>{const d='M10 68 L10 12';g.lineCap='round';ST(g,d,p[1],7);ST(g,d,p[2],4.4);g.strokeStyle='#2a3aa0';g.lineWidth=4.4;g.setLineDash([4,6]);g.stroke(new Path2D('M10 66 L10 16'));g.setLineDash([]);
  for(const [x,y] of [[20,34],[27,38],[34,34]]){ST(g,'M10 10 Q'+(x-2)+' 10 '+x+' '+y,p[1],3.4);ST(g,'M10 10 Q'+(x-2)+' 10 '+x+' '+y,p[3],1.6);OV(g,x,y+3,2.6,3.6,0,p[2]);}OV(g,10,10,3.4,3.4,0,p[3]);},{noink:1});

/* ---------- floor pictures (painted once per kind + palette) ---------- */
const RC={};
function ankhPath(g,s){g.beginPath();g.ellipse(0,-20*s,11*s,14*s,0,0,TAU);g.moveTo(0,-6*s);g.lineTo(0,34*s);g.moveTo(-18*s,-1*s);g.lineTo(18*s,-1*s);}
function ring(kind,pl){const p=FX.k.pal(pl),k=kind+p[1]+p[2];if(RC[k])return RC[k];return RC[k]=cv(320,320,g=>{g.translate(160,160);g.lineJoin='round';g.lineCap='round';
    const ci=(r,lw,c)=>{g.lineWidth=lw;g.strokeStyle=c;g.beginPath();g.arc(0,0,r,0,TAU);g.stroke();};
    if(kind!=='ankh'){g.fillStyle=RG(g,0,0,150,0,rgba(p[0],.4),.8,rgba(p[0],.28),1,rgba(p[0],0));g.beginPath();g.arc(0,0,150,0,TAU);g.fill();}
    g.shadowColor=p[2];g.shadowBlur=9;
    if(kind==='sun'){ci(142,5,p[2]);ci(104,2.6,p[3]);ci(58,3,p[2]);ci(48,1.4,p[3]);for(let i=0;i<16;i++){g.save();g.rotate(i*TAU/16);g.fillStyle=i%2?p[2]:p[3];g.beginPath();g.moveTo(108,-7);g.lineTo(i%2?124:137,0);g.lineTo(108,7);g.closePath();g.fill();g.restore();}
      for(let i=0;i<8;i++){const a=i*TAU/8+TAU/16;g.fillStyle=p[4];g.beginPath();g.arc(Math.cos(a)*84,Math.sin(a)*84,3.2,0,TAU);g.fill();}g.strokeStyle=p[3];g.lineWidth=5;ankhPath(g,.9);g.stroke();}
    else if(kind==='duat'){ci(142,4.5,p[2]);ci(132,1.6,p[3]);ci(106,2.4,p[2]);ci(60,2.6,p[2]);for(let i=0;i<28;i++){g.save();g.rotate(i*TAU/28);g.translate(119,0);g.fillStyle=i%2?p[3]:p[2];g.beginPath();const m=i%4;if(m===0)g.rect(-5,-2,10,4);else if(m===1){g.moveTo(-5,4);g.lineTo(5,0);g.lineTo(-5,-4);}else if(m===2)g.arc(0,0,3.6,0,TAU);else{g.moveTo(-5,-3);g.lineTo(0,3);g.lineTo(5,-3);g.lineTo(5,-1);g.lineTo(0,5);g.lineTo(-5,-1);}g.closePath();g.fill();g.restore();}
      for(let i=0;i<3;i++){const a=-Math.PI/2+i*TAU/3;g.fillStyle=p[0];g.beginPath();g.arc(Math.cos(a)*83,Math.sin(a)*83,10,0,TAU);g.fill();g.lineWidth=2.2;g.strokeStyle=p[3];g.stroke();}
      g.strokeStyle=p[3];g.lineWidth=3.6;g.beginPath();g.moveTo(0,-34);g.lineTo(0,30);g.moveTo(-34,-26);g.lineTo(34,-26);g.moveTo(-16,30);g.lineTo(16,30);g.stroke();g.lineWidth=2.4;for(const s of [-1,1]){g.beginPath();g.moveTo(s*34,-26);g.lineTo(s*34-9,-4);g.moveTo(s*34,-26);g.lineTo(s*34+9,-4);g.stroke();g.beginPath();g.arc(s*34,-4,10,0,Math.PI);g.stroke();}}
    else if(kind==='seal'){ci(140,8,p[2]);ci(124,2.2,p[3]);ci(112,1.4,p[2]);for(let i=0;i<12;i++){g.save();g.rotate(i*TAU/12);g.fillStyle=p[3];g.fillRect(126,-3,10,6);g.restore();}
      g.strokeStyle=p[3];g.lineWidth=7;g.beginPath();g.moveTo(-52,70);g.lineTo(26,-44);g.bezierCurveTo(40,-66,70,-50,56,-28);g.stroke();g.beginPath();g.moveTo(52,70);g.lineTo(-30,-56);g.stroke();
      g.lineWidth=3.4;for(const [x,y] of [[-52,-18],[-64,-30],[-44,-4]]){g.beginPath();g.moveTo(-30,-56);g.quadraticCurveTo(x,-58,x,y);g.stroke();g.fillStyle=p[4];g.beginPath();g.arc(x,y+4,4.4,0,TAU);g.fill();}
      g.fillStyle=p[4];g.beginPath();g.arc(0,-86,11,0,TAU);g.fill();g.lineWidth=3;g.strokeStyle=p[2];g.stroke();}
    else if(kind==='life'){ci(142,4.5,p[2]);ci(92,2.4,p[3]);ci(50,2,p[2]);for(let i=0;i<12;i++){g.save();g.rotate(i*TAU/12);g.fillStyle=rgba(i%2?p[3]:p[2],.9);g.beginPath();g.moveTo(96,0);g.quadraticCurveTo(116,-12,136,0);g.quadraticCurveTo(116,12,96,0);g.fill();g.restore();}g.strokeStyle=p[4];g.lineWidth=4.6;ankhPath(g,.8);g.stroke();}
    else{g.shadowBlur=16;g.strokeStyle=p[1];g.lineWidth=34;ankhPath(g,3.1);g.stroke();g.shadowBlur=8;g.strokeStyle=p[2];g.lineWidth=22;ankhPath(g,3.1);g.stroke();g.shadowBlur=0;g.strokeStyle=p[4];g.lineWidth=8;ankhPath(g,3.1);g.stroke();}});}
window.ANUART={ring,HINGE,HEAD:[128,112],JAW:[84,36]};
})();
