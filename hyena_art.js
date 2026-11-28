/* =====================================================================
   PAINTED JESTER (hyena, hero #18) — vector art for the skill effects (hyena_vfx.js). Drawn by code once into canvases
   (FXLIB sprites: the palette decides the colours). Nothing here is a picture file. Owner 2026-11-28 'ทำเอฟเฟคสกิลของไฮยีน่าให้หน่อย'.
     hyStil    his rift-crystal stiletto (points right)          hyMask n3   enemy masks: 0 weeping (blue) · 1 scorn (crimson) · 2 sleepy (lavender)
     hyCard n2 the shadow Joker card: 0 face · 1 back             hyPot       a paint pot brimming with paint (palette = the paint)
     hyEye     the Evil Eye (slit pupil)                          hyBell      a gold jester bell
     hyDia n4  harlequin confetti diamond: 0 black · 1 white · 2 palette · 3 gold
     hyStar    the four-point star of his cheek paint             hyJawU / hyJawL  shadow hyena jaws (side view facing right, hinge = HYART.HINGE)
     hyGrin    a floating laughing grin                           hyHead      a laughing hyena shadow head (side view facing right, mouth open up)
     hyMirror  the Mirror Mask (masquerade mirror with a jester crown)
     hyTro n5  the five belt trophies: 0 silver rune bead (Norse) · 1 gold laurel leaf (Greek) · 2 blue scarab (Egypt) · 3 gold bell (Japan) · 4 red-yellow feather (Aztec)
     hyBone n2 0 a bone · 1 a snapped half                        hyBub n3    speech bubble: 0 '…' (whisper) · 1 crossed (silenced) · 2 '?' (lured)
     hyZ       sleep Z                                            hyTear      a tear drop
     hyRet     weak-point reticle (boss 'exposed')                hyCrk       a cracked armour plate (DEF broken)
     hyHat     a three-horned jester hat with bells
   HYART.ring(kind, palette, seed) → a 320² floor picture: 'stage' (circus ring of Grand Medley) · 'rift' (rift sigil) ·
     'splat' (a paint splat, seed = shape) · 'eye' (the hypnotic ring of Spellbound)
   Palettes added to FXLIB: rift (his violet) · jest (magenta flicks of the sheet) · ink (shadow ink) · weep · scorn · sleepy
   ===================================================================== */
(()=>{
'use strict';
if(typeof CHAR!=='undefined'&&CHAR!=='hyena')return;
const FX=window.FXLIB;if(!FX)return;
const {defSprite:def,cv,F,ST,LG,RG,OV,rgba,PAL,BIT,TAU}=FX.k;
/* palettes  [ink, deep, mid, lite, core] */
Object.assign(PAL,{
  rift:['#12061f','#5a1fa8','#a24bff','#e0b8ff','#ffffff'],jest:['#2a0628','#b0168a','#ff4fd8','#ffb0ef','#ffffff'],
  ink:['#030108','#1a0a33','#3b1a6e','#8a63c8','#d9c8ff'],weep:['#0b1f44','#2d6fd6','#6fb8ff','#c8e6ff','#ffffff'],
  scorn:['#2a0412','#b3123e','#ff3d6e','#ffb0c4','#fff0f4'],sleepy:['#1a1440','#5b4bb8','#a99cf0','#e0daff','#ffffff']});
const GD=['#8a5210','#ffc23a','#fff3c0'],INK0='#0c0418',INK1='#24103f',INK2='#3e1f6e';
const gold=(g,x0,y0,x1,y1)=>LG(g,x0,y0,x1,y1,0,GD[2],.45,GD[1],1,GD[0]);
const poly=(g,pts,fill)=>{g.beginPath();pts.forEach((q,i)=>i?g.lineTo(q[0],q[1]):g.moveTo(q[0],q[1]));g.closePath();g.fillStyle=fill;g.fill();};

/* his stiletto: purple-wrapped grip, gold pommel + crescent guard, faceted rift crystal blade (palette) */
def('hyStil',56,16,(g,p)=>{
  g.fillStyle=RG(g,4.4,7,4.2,0,GD[2],.5,GD[1],1,GD[0]);g.beginPath();g.arc(4.8,8,3.4,0,TAU);g.fill();
  g.fillStyle=LG(g,0,5,0,11,0,'#8a4ad0',1,'#2e1258');g.fillRect(7.5,5.3,11,5.4);g.strokeStyle='rgba(16,4,34,.75)';g.lineWidth=.9;for(let i=0;i<4;i++){g.beginPath();g.moveTo(8.4+i*2.7,5.3);g.lineTo(10.4+i*2.7,10.7);g.stroke();}
  F(g,'M18.5 1.2 C21.6 4 21.6 12 18.5 14.8 L22 14.2 C24.2 11 24.2 5 22 1.8 Z',gold(g,18,0,23,16));OV(g,21.2,8,1.4,1.9,0,'#a24bff');
  F(g,'M22.6 4 L54 8 L22.6 12 Z',p[1]);F(g,'M23 4.5 L53.4 8 L23 8 Z',LG(g,22,0,54,0,0,p[3],.65,p[4],1,'#ffffff'));F(g,'M23 8 L53.4 8 L23 11.5 Z',LG(g,22,0,54,0,0,p[1],.6,p[2],1,p[3]));
  ST(g,'M24 8 L52 8','rgba(255,255,255,.85)',.8);ST(g,'M31 5.4 L33 8 L31 10.6 M40.5 6.6 L42 8 L40.5 9.4',rgba(p[0],.45),.7);},{f:0});

/* the three masks a Shadow Chaser paints on enemies (fixed colours, the palette is not used) */
const MC=[['#2d6fd6','#6fb8ff','#c8e6ff'],['#b3123e','#ff3d6e','#ffb0c4'],['#5b4bb8','#a99cf0','#e0daff']];
def('hyMask',34,32,(g,p,v)=>{const c=MC[v],face='M17 2 C27 2 32 8 32 15 C32 23 25 30 17 30.5 C9 30 2 23 2 15 C2 8 7 2 17 2 Z',dk='#2a1a3a';
  F(g,face,LG(g,0,2,0,31,0,'#ffffff',.6,'#f1ecf8',1,'#cbbfdc'));ST(g,face,c[0],1.7);
  const hole=(x,y,rx,ry)=>OV(g,x,y,rx,ry,0,dk);
  if(v===0){ST(g,'M5.5 9 L13 12.2 M28.5 9 L21 12.2',c[0],2.3);hole(11,15.4,3.2,2.1);hole(23,15.4,3.2,2.1);
    for(const x of [11,23])F(g,'M'+x+' 18 C'+(x-1.8)+' 21.2 '+(x-1.6)+' 24 '+x+' 24.6 C'+(x+1.6)+' 24 '+(x+1.8)+' 21.2 '+x+' 18Z',c[1]);
    ST(g,'M12 27 C15 24.4 19 24.4 22 27',dk,1.6);}
  else if(v===1){ST(g,'M5.5 11 L13 12.6',c[0],2.3);ST(g,'M21 11 L28.5 6.8',c[0],2.3);hole(11,15.6,3.2,1.4);hole(23,14.8,3,2.3);
    F(g,'M25.4 18 L28 21.6 L25.4 25.2 L22.8 21.6Z',c[1]);ST(g,'M10.5 25.4 C15 26.8 19 25.8 23.6 22.4',dk,1.7);F(g,'M20.6 24.6 L21.6 27.4 L22.6 24Z','#ffffff');}
  else{for(const x of [11,23]){F(g,'M'+(x-3.8)+' 15 C'+(x-3.8)+' 11.6 '+(x+3.8)+' 11.6 '+(x+3.8)+' 15Z',c[1]);ST(g,'M'+(x-3.8)+' 15 C'+(x-2)+' 17.6 '+(x+2)+' 17.6 '+(x+3.8)+' 15',dk,1.5);}
    OV(g,17,25.2,2.3,2.9,0,dk);OV(g,7.5,20.5,2.8,1.6,0,rgba(c[1],.8));OV(g,26.5,20.5,2.8,1.6,0,rgba(c[1],.8));}
  OV(g,10.5,6.2,4.2,1.9,-.35,'rgba(255,255,255,.95)');},{n:3});

/* the shadow Joker card: 0 face (harlequin diamond, violet corners) · 1 back (violet with a gold lattice) */
def('hyCard',26,36,(g,p,v)=>{const rr=(x,y,w,h,r)=>{g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath();};
  if(v===0){rr(1.5,1.5,23,33,3.2);g.fillStyle='#fbf6ee';g.fill();g.lineWidth=1.6;g.strokeStyle=p[1];g.stroke();rr(4,4,18,28,2);g.lineWidth=.8;g.strokeStyle=p[2];g.stroke();
    const c=[13,18],d=[[13,8],[20,18],[13,28],[6,18]];poly(g,[c,d[0],d[1]],'#1a1428');poly(g,[c,d[1],d[2]],'#ffffff');poly(g,[c,d[2],d[3]],'#1a1428');poly(g,[c,d[3],d[0]],'#ffffff');
    g.beginPath();d.forEach((q,i)=>i?g.lineTo(q[0],q[1]):g.moveTo(q[0],q[1]));g.closePath();g.lineWidth=1.3;g.strokeStyle=p[1];g.stroke();
    poly(g,[[6.5,5.6],[8.4,8],[6.5,10.4],[4.6,8]],p[2]);poly(g,[[19.5,25.6],[21.4,28],[19.5,30.4],[17.6,28]],p[2]);}
  else{rr(1.5,1.5,23,33,3.2);g.fillStyle=LG(g,0,0,26,36,0,p[2],.5,p[1],1,p[0]);g.fill();g.save();g.clip();g.strokeStyle=rgba(GD[1],.7);g.lineWidth=.8;
    for(let i=-6;i<10;i++){g.beginPath();g.moveTo(i*5,0);g.lineTo(i*5+36,36);g.moveTo(i*5+36,0);g.lineTo(i*5,36);g.stroke();}g.restore();
    rr(1.5,1.5,23,33,3.2);g.lineWidth=1.6;g.strokeStyle=GD[1];g.stroke();poly(g,[[13,11],[18,18],[13,25],[8,18]],gold(g,8,11,18,25));}},{n:2});

/* paint pot: dark clay, gold rim, the paint (palette) brimming over and dripping */
def('hyPot',28,30,(g,p)=>{g.fillStyle=RG(g,10,16,14,0,'#7a5aa8',.55,'#3e2466',1,'#170a2a');g.beginPath();g.ellipse(14,19.5,11,9.5,0,0,TAU);g.fill();
  OV(g,14,9.5,8.2,2.8,0,gold(g,6,7,22,12));OV(g,14,9.3,6.6,2,0,p[1]);OV(g,13.4,9,4.6,1.2,0,p[2]);
  F(g,'M7.4 9.6 C7 12.6 8.4 15 7.6 17.2 C7.4 18.6 9.4 18.6 9.4 17.2 C9.4 15 10.6 12.4 10.4 10.4 Z',p[2]);F(g,'M17.6 10.2 C18.6 13 19.8 13.6 19.6 15.4 C19.6 16.6 21.4 16.6 21.4 15.4 C21.4 13.6 20.6 12 20.4 10 Z',p[2]);
  OV(g,8.4,16.6,.9,1.3,0,p[4]);OV(g,9.5,21,2.2,3.6,-.4,'rgba(255,255,255,.35)');});

/* the Evil Eye: almond shape, palette iris, slit pupil */
def('hyEye',46,26,(g,p)=>{const al='M2 13 C12 1 34 1 44 13 C34 25 12 25 2 13 Z';F(g,al,INK0);g.save();g.translate(23,13);g.scale(.86,.8);g.translate(-23,-13);F(g,al,LG(g,0,4,0,22,0,p[4],1,p[3]));g.restore();
  g.fillStyle=RG(g,23,13,8.6,0,p[4],.3,p[3],.7,p[2],1,p[1]);g.beginPath();g.arc(23,13,8.4,0,TAU);g.fill();OV(g,23,13,1.8,6.8,0,'#0a0212');OV(g,19.6,9.6,2.4,1.7,0,'#ffffff');
  ST(g,'M2 13 C12 1 34 1 44 13',p[1],1.8);ST(g,'M9 6.2 L6 2 M15 3.6 L13.6 -.2 M31 3.6 L32.4 -.2 M37 6.2 L40 2',INK0,1.6);});

/* gold jester bell */
def('hyBell',16,18,(g)=>{F(g,'M8 2 C12.6 2 14.2 6.6 14.2 10.6 L15.4 13.6 L.6 13.6 L1.8 10.6 C1.8 6.6 3.4 2 8 2 Z',gold(g,0,2,16,14));F(g,'M4.4 13.6 L11.6 13.6 L8 12.2Z',GD[0]);
  OV(g,8,15.2,2,1.8,0,GD[0]);g.strokeStyle=GD[0];g.lineWidth=1;g.beginPath();g.arc(8,1.8,1.6,0,TAU);g.stroke();OV(g,5.4,6.6,1.4,2.6,-.3,'rgba(255,255,255,.75)');});

/* harlequin confetti */
def('hyDia',12,16,(g,p,v)=>{const d=[[6,1],[11,8],[6,15],[1,8]];const fill=v===0?LG(g,0,0,12,16,0,'#3a3050',1,'#0c0814'):v===1?LG(g,0,0,12,16,0,'#ffffff',1,'#d8d0e8'):v===2?LG(g,0,0,12,16,0,p[3],.5,p[2],1,p[1]):gold(g,0,0,12,16);
  poly(g,d,fill);g.beginPath();d.forEach((q,i)=>i?g.lineTo(q[0],q[1]):g.moveTo(q[0],q[1]));g.closePath();g.lineWidth=.9;g.strokeStyle=v===1?p[1]:v===0?'#ffffff':GD[0];g.stroke();OV(g,4.6,5.4,1.1,1.7,-.5,'rgba(255,255,255,.7)');},{n:4});

/* the cheek star of his face paint */
def('hyStar',18,18,(g,p)=>{F(g,'M9 .6 L10.8 7.2 L17.4 9 L10.8 10.8 L9 17.4 L7.2 10.8 L.6 9 L7.2 7.2 Z',LG(g,0,0,18,18,0,p[4],.4,p[3],1,p[2]));});

/* shadow hyena jaws, side view facing right (upper: skull + muzzle + fangs down · lower: mandible + fangs up) */
def('hyJawU',74,30,(g,p)=>{const sk='M6 25 C5 16 12 7 22 5 C32 3 42 4 52 8 C58 10 64 11 69 12.5 C72.6 13.6 72.4 18 69.6 19.8 L66 22.4 C50 23.6 26 25.4 9 27 Z';
  for(const x of [16,24,32,40,48,56])poly(g,[[x-2.6,24.6-(x-16)*.08],[x,30.4-(x-16)*.06],[x+2.6,24.4-(x-16)*.08]],'#f6f0ff');poly(g,[[57,22.6],[60,29],[62.6,22.2]],'#ffffff');poly(g,[[20,25],[22.4,31],[25,24.6]],'#ffffff');
  F(g,sk,LG(g,0,2,0,28,0,INK2,.6,INK1,1,INK0));ST(g,'M8 18 C10 10 18 6 26 5 C38 3.6 48 5 56 8.6 C61 10.6 66 11.6 69.4 12.8',p[2],1.6);
  OV(g,69.6,15.6,2.6,2.2,0,'#05020a');F(g,'M33 12.6 C37 10.4 41 10.6 44.4 12.6 C41 13.6 37 13.8 33 12.6Z',p[4]);OV(g,38.8,12.4,3.6,1.2,0,rgba(p[2],.9));
  F(g,'M36 7.4 L38.6 12 L41 7.4 L38.6 3.6Z',p[2]);},{f:0});
def('hyJawL',66,20,(g,p)=>{const jw='M6 3 C24 3.6 46 3.2 62 4.6 C64.4 5 64.4 8 62.4 9.2 C54 13 40 16.6 24 17.4 C14 17.8 7 13 6 3 Z';
  for(const x of [18,26,34,42,50,57])poly(g,[[x-2.4,4.4],[x,-1.4+(x-18)*.04],[x+2.4,4.4]],'#f6f0ff');
  F(g,jw,LG(g,0,2,0,18,0,INK2,.5,INK1,1,INK0));ST(g,'M10 12 C20 17 40 16 58 9.6',p[2],1.4);},{f:0});

/* a floating laughing grin (Cheshire-style) */
def('hyGrin',68,32,(g,p)=>{const out='M3 7 C14 30 54 30 65 7 C52 18 16 18 3 7 Z';F(g,'M3 7 C14 31.5 54 31.5 65 7 C54 14 14 14 3 7 Z',rgba(p[2],.55));
  F(g,out,'#14061f');g.save();g.clip(new Path2D(out));for(let i=0;i<9;i++){const x=10+i*6;poly(g,[[x-3,8],[x,15.6-Math.abs(i-4)*.4],[x+3,8]],'#ffffff');}for(let i=0;i<8;i++){const x=13+i*6;poly(g,[[x-2.6,29],[x,21.4+Math.abs(i-3.5)*.4],[x+2.6,29]],'#ece4ff');}g.restore();
  ST(g,'M3 7 C14 30 54 30 65 7',p[2],2.2);ST(g,'M3 7 C16 18 52 18 65 7',p[3],1.4);});

/* laughing hyena shadow head: side view facing right, head thrown back, mouth wide open (big round ear, short blunt muzzle, black nose) */
def('hyHead',92,80,(g,p)=>{const bodyG=LG(g,0,6,0,74,0,INK2,.55,INK1,1,INK0);
  for(const [a,b,c] of [[[14,40],[0,30],[18,32]],[[16,32],[2,18],[24,26]],[[22,24],[12,8],[30,20]],[[30,20],[28,4],[38,18]],[[16,50],[2,48],[18,44]]])poly(g,[a,b,c],INK1);
  g.fillStyle=bodyG;g.beginPath();g.ellipse(38,44,23,21,0,0,TAU);g.fill();
  g.fillStyle=RG(g,30,15,13,0,INK2,1,INK0);g.beginPath();g.ellipse(31,16,11.5,13,-.3,0,TAU);g.fill();OV(g,31.6,17.4,6.8,8.6,-.3,rgba(p[1],.85));OV(g,32,18.4,3.6,5,-.3,rgba(p[2],.6));
  F(g,'M50 34 C58 28 68 24 78 23 C83 22.6 86 25 85.4 28.4 C85 31 82.6 32 79.6 32.2 C71 33 62 36.6 55 41 Z',bodyG);
  F(g,'M52 48 C60 51 68 55 75 58 C78.4 59.4 77.6 63.4 74 63.4 C65 63.4 56 59 50 54 Z',LG(g,0,48,0,64,0,INK1,1,INK0));
  F(g,'M55 41 C62 36.6 71 33 79.6 32.2 C78 41 76 50 75 58 C68 55 60 51 52 48 Z','#2a0626');F(g,'M58 47 C64 46 70 50 73 55 C66 53 61 51 58 47 Z','#c2185b');
  for(let i=0;i<4;i++){const x=60+i*5.4,y=38.4-i*1.6;poly(g,[[x-2.2,y],[x+.2,y+4.6],[x+2.4,y-.6]],'#ffffff');}poly(g,[[76,33],[77.6,38.6],[79.4,32.6]],'#ffffff');
  for(let i=0;i<3;i++){const x=58+i*5.6,y=49.6+i*2;poly(g,[[x-2,y+1.4],[x+.4,y-3.8],[x+2.6,y+1.8]],'#efe6ff');}
  OV(g,84,26.4,3.6,3,-.2,'#05020a');OV(g,83,25.2,1.2,.8,0,'rgba(255,255,255,.6)');
  ST(g,'M52 27.6 C55 24 60 24 62.4 27.8',p[4],2.2);F(g,'M47.4 44 L48.8 47.6 L52.4 49 L48.8 50.4 L47.4 54 L46 50.4 L42.4 49 L46 47.6Z',p[3]);
  for(const [x,y,r] of [[28,46,2.2],[34,54,1.8],[24,54,1.6],[40,36,1.6],[30,36,1.4]])OV(g,x,y,r,r*.8,0,rgba(p[1],.9));
  ST(g,'M17 38 C18 28 24 22 32 20 M50 33 C58 28 68 24 78 23 C82 22.6 85 24 85.4 27',p[2],1.7);});

/* the Mirror Mask: oval mirror glass, gold rim, a jester crown with bells, a stick at the side */
def('hyMirror',44,56,(g,p)=>{ST(g,'M34 42 L42 55',GD[0],3.4);ST(g,'M34 42 L42 55',p[1],1.8);
  for(const [x,y,tx,ty] of [[9,16,4,4],[22,12,22,1.6],[35,16,40,4]]){F(g,'M'+(x-4)+' '+(y+4)+' C'+(x-2)+' '+(y-2)+' '+(tx-1)+' '+(ty+5)+' '+tx+' '+ty+' C'+(tx+1)+' '+(ty+6)+' '+(x+3)+' '+(y-1)+' '+(x+4)+' '+(y+4)+' Z',LG(g,0,0,0,20,0,p[2],1,p[1]));
    OV(g,tx,ty,2.3,2.3,0,GD[1]);OV(g,tx-.6,ty-.6,.8,.8,0,'#ffffff');}
  g.fillStyle=gold(g,4,14,40,52);g.beginPath();g.ellipse(22,32,17,19,0,0,TAU);g.fill();
  g.fillStyle=LG(g,8,16,36,50,0,'#ffffff',.25,'#e6dcff',.6,'#a894e0',1,'#5a3fa0');g.beginPath();g.ellipse(22,32,14,16,0,0,TAU);g.fill();
  g.save();g.beginPath();g.ellipse(22,32,14,16,0,0,TAU);g.clip();g.fillStyle='rgba(255,255,255,.8)';g.beginPath();g.moveTo(6,30);g.lineTo(26,10);g.lineTo(31,10);g.lineTo(11,32);g.closePath();g.fill();g.fillStyle='rgba(255,255,255,.45)';g.beginPath();g.moveTo(13,38);g.lineTo(36,15);g.lineTo(38,18);g.lineTo(16,41);g.closePath();g.fill();g.restore();
  g.strokeStyle=p[2];g.lineWidth=1;g.beginPath();g.ellipse(22,32,14,16,0,0,TAU);g.stroke();poly(g,[[22,10],[25,14],[22,18],[19,14]],p[2]);});

/* the five belt trophies */
def('hyTro',18,20,(g,p,v)=>{
  if(v===0){g.fillStyle=RG(g,7,8,9,0,'#ffffff',.4,'#c8d0e0',1,'#6a7488');g.beginPath();g.arc(9,10,7.4,0,TAU);g.fill();ST(g,'M6 5.4 L6 14.6 M6 8 L11.4 5.4 M6 11 L11.4 8.4 M12 11 L12 15',  '#3a4258',1.4);}
  else if(v===1){F(g,'M3 17 C2 9 8 3 15 2 C16 9 11 16 3 17 Z',gold(g,2,2,16,17));ST(g,'M3.6 16.4 C7 12 11 7 14.4 2.8',GD[0],1);for(let i=0;i<3;i++)ST(g,'M'+(6+i*2.6)+' '+(13-i*3.2)+' l3 -.4',GD[0],.7);}
  else if(v===2){g.fillStyle=RG(g,8,8,9,0,'#bfe6ff',.4,'#3a8ae0',1,'#0c2a66');g.beginPath();g.ellipse(9,11,6,7.6,0,0,TAU);g.fill();OV(g,9,3.8,3.6,2.6,0,'#14306a');ST(g,'M9 4 L9 18',  '#0c2050',1);
    ST(g,'M3.2 8 L.6 6 M3 12 L.4 12.6 M3.4 16 L1 18 M14.8 8 L17.4 6 M15 12 L17.6 12.6 M14.6 16 L17 18','#0c2050',1.1);OV(g,6.6,9,1.4,2.4,-.3,'rgba(255,255,255,.7)');}
  else if(v===3){F(g,'M9 3 C13.6 3 15 7.6 15 11.4 L16.2 14.4 L1.8 14.4 L3 11.4 C3 7.6 4.4 3 9 3 Z',gold(g,1,3,17,15));OV(g,9,16,2,1.8,0,GD[0]);OV(g,6.4,7.4,1.3,2.4,-.3,'rgba(255,255,255,.75)');}
  else{F(g,'M9 19 C4 14 3 7 8 1 C13 6 14 13 9 19 Z',LG(g,0,0,0,20,0,'#ffe04a',.5,'#ff8a1f',1,'#c8140c'));ST(g,'M9 19 L8.4 3',  '#7a1206',.9);for(let i=0;i<4;i++)ST(g,'M8.6 '+(6+i*3.2)+' l-3.4 -2 M8.8 '+(6+i*3.2)+' l3.4 -2','rgba(122,18,6,.55)',.6);}},{n:5});

/* bone: 0 whole · 1 snapped half */
def('hyBone',32,12,(g,p,v)=>{const c=LG(g,0,0,0,12,0,'#ffffff',.6,'#ece2d6',1,'#b8a890');
  const knob=x=>{OV(g,x,3.6,3.4,3.4,0,c);OV(g,x,8.4,3.4,3.4,0,c);};
  if(v===0){g.fillStyle=c;g.fillRect(4,4,24,4);knob(4);knob(28);}else{g.fillStyle=c;g.fillRect(4,4,13,4);knob(4);poly(g,[[17,4],[20,3],[18.4,6],[21,8.6],[17,8]],c);}
  ST(g,'M6 6 L'+(v?16:26)+' 6','rgba(255,255,255,.8)',.8);});

/* speech bubble: 0 '…' · 1 crossed (silenced) · 2 '?' (lured) */
def('hyBub',28,24,(g,p,v)=>{F(g,'M14 2 C22 2 26.6 5.6 26.6 10.6 C26.6 15.6 22 19 14 19 C12.6 19 11.4 18.9 10.2 18.6 L5 22.6 L6.6 17.2 C3.4 15.6 1.4 13.4 1.4 10.6 C1.4 5.6 6 2 14 2 Z','#ffffff');
  ST(g,'M14 2 C22 2 26.6 5.6 26.6 10.6 C26.6 15.6 22 19 14 19 C12.6 19 11.4 18.9 10.2 18.6 L5 22.6 L6.6 17.2 C3.4 15.6 1.4 13.4 1.4 10.6 C1.4 5.6 6 2 14 2 Z',p[1],1.4);
  if(v===0){for(const x of [8.6,14,19.4])OV(g,x,10.6,1.9,1.9,0,p[1]);}else if(v===1){ST(g,'M9 6.6 L19 14.6 M19 6.6 L9 14.6',p[1],2.4);}else{ST(g,'M10.6 8 C10.6 4.6 17.4 4.6 17.4 8 C17.4 10.4 14 10.6 14 13',p[1],2.2);OV(g,14,16,1.4,1.4,0,p[1]);}},{n:3});

/* sleep Z */
def('hyZ',14,16,(g,p)=>{F(g,'M2 2 L12.4 2 L12.4 4.8 L6 12.2 L12.6 12.2 L12.6 14.6 L1.6 14.6 L1.6 11.8 L8 4.4 L2 4.4 Z',LG(g,0,0,0,16,0,p[4],.5,p[3],1,p[2]));});
/* tear drop */
def('hyTear',10,14,(g,p)=>{F(g,'M5 1 C3 5 1.4 7.6 1.4 9.6 C1.4 11.8 3 13 5 13 C7 13 8.6 11.8 8.6 9.6 C8.6 7.6 7 5 5 1 Z',LG(g,0,0,0,14,0,p[4],.4,p[3],1,p[2]));OV(g,3.6,9.4,1,1.8,-.3,'rgba(255,255,255,.85)');});

/* weak-point reticle (bosses 'exposed') and a cracked armour plate (DEF broken) */
def('hyRet',40,40,(g)=>{const d=[[20,2],[38,20],[20,38],[2,20]];g.beginPath();d.forEach((q,i)=>i?g.lineTo(q[0],q[1]):g.moveTo(q[0],q[1]));g.closePath();g.lineWidth=3.2;g.strokeStyle=GD[0];g.stroke();g.lineWidth=1.8;g.strokeStyle=GD[2];g.stroke();
  ST(g,'M20 8 L20 14 M32 20 L26 20 M20 32 L20 26 M8 20 L14 20',GD[1],2.4);ST(g,'M20 20 L23 16.6 L22 13 M20 20 L16.4 22 L15 25.6 M20 20 L24.6 23',  '#ffffff',1.1);OV(g,20,20,2,2,0,'#ffffff');});
def('hyCrk',24,26,(g,p)=>{const sh='M12 1.6 L22 5 L21 14 C20 19 16.4 22.6 12 24.6 C7.6 22.6 4 19 3 14 L2 5 Z';F(g,sh,LG(g,0,0,0,26,0,'#e8e4f0',.5,'#9a92b0',1,'#4a4460'));
  ST(g,'M12 3 L10.4 9 L14 12 L11 17 L13 23 M10.4 9 L6 10.6 M14 12 L18.4 11',INK0,1.6);ST(g,'M12 3 L10.4 9 L14 12 L11 17 L13 23',p[2],.7);ST(g,sh,INK0,1);});

/* three-horned jester hat with bells */
def('hyHat',42,30,(g,p)=>{for(const [d,c] of [['M8 26 C4 18 2 10 4 3 C10 8 15 16 18 24 Z',INK1],['M16 24 C16 14 18 6 22 1 C26 6 28 14 28 24 Z',p[1]],['M26 24 C29 16 34 8 40 3 C41 10 38 18 34 26 Z',INK1]]){F(g,d,c);}
  ST(g,'M5 4 C10 9 15 16 17.6 23.4 M22 2 C25 7 27 14 27.6 23',rgba(p[3],.7),1);F(g,'M6 23 C14 20.6 28 20.6 36 23 L35 28.4 C26 26.6 16 26.6 7 28.4 Z',gold(g,6,20,36,29));
  for(const [x,y] of [[4,3],[22,1],[40,3]]){OV(g,x,y,2.8,2.8,0,GD[1]);OV(g,x-.8,y-.8,1,1,0,'#ffffff');}poly(g,[[21,22],[23.2,24.4],[21,26.8],[18.8,24.4]],p[2]);});

/* ---------- floor pictures (320²) ---------- */
const RC={};
function ring(kind,el,seed){const p=FX.k.pal(el||'rift'),key=kind+'|'+p[2]+'|'+(seed||0);if(RC[key])return RC[key];let s=(seed||1)*9301+49297;const rn=()=>{s=(s*9301+49297)%233280;return s/233280;};
  return RC[key]=cv(320,320,g=>{g.translate(160,160);
    if(kind==='stage'){/* circus ring: harlequin band, gold rims, deep floor with an 8-point star */
      g.fillStyle=RG(g,0,0,150,0,rgba(p[1],.55),.7,rgba(p[0],.62),1,rgba(p[0],.7));g.beginPath();g.arc(0,0,150,0,TAU);g.fill();
      const N=32;for(let i=0;i<N;i++){const a0=i/N*TAU,a1=(i+1)/N*TAU;g.fillStyle=i%2?'rgba(250,246,255,.92)':'rgba(20,12,34,.92)';g.beginPath();g.arc(0,0,150,a0,a1);g.arc(0,0,124,a1,a0,true);g.closePath();g.fill();}
      for(const [r,w,c] of [[152,4,GD[1]],[150,1.4,GD[2]],[123,3.4,GD[1]],[121,1,GD[2]]]){g.lineWidth=w;g.strokeStyle=c;g.beginPath();g.arc(0,0,r,0,TAU);g.stroke();}
      for(let i=0;i<16;i++){const a=i/16*TAU;g.fillStyle=GD[1];g.beginPath();g.arc(Math.cos(a)*112,Math.sin(a)*112,3,0,TAU);g.fill();}
      g.fillStyle=RG(g,0,0,80,0,rgba(p[2],.5),1,rgba(p[2],0));g.beginPath();g.arc(0,0,80,0,TAU);g.fill();
      g.beginPath();for(let i=0;i<16;i++){const a=-Math.PI/2+i*Math.PI/8,r=i%2?26:74;g.lineTo(Math.cos(a)*r,Math.sin(a)*r);}g.closePath();g.fillStyle=rgba(p[2],.55);g.fill();g.lineWidth=2;g.strokeStyle=rgba(p[3],.85);g.stroke();
      g.beginPath();for(let i=0;i<8;i++){const a=-Math.PI/2+i*Math.PI/4,r=i%2?12:34;g.lineTo(Math.cos(a)*r,Math.sin(a)*r);}g.closePath();g.fillStyle=gold(g,-30,-30,30,30);g.fill();}
    else if(kind==='rift'){/* cracked violet ring with diamond glyphs */
      g.fillStyle=RG(g,0,0,150,0,rgba(p[0],.5),.75,rgba(p[0],.32),1,rgba(p[0],0));g.beginPath();g.arc(0,0,150,0,TAU);g.fill();g.shadowColor=p[2];g.shadowBlur=10;
      for(const [r,w,c] of [[136,5,p[2]],[124,1.6,p[3]],[60,2.4,p[2]]]){g.lineWidth=w;g.strokeStyle=c;g.beginPath();for(let i=0;i<=48;i++){const a=i/48*TAU,rr=r+(i%2?2.4:-2.4)*(w>2?1:0);i?g.lineTo(Math.cos(a)*rr,Math.sin(a)*rr):g.moveTo(Math.cos(a)*rr,Math.sin(a)*rr);}g.stroke();}
      for(let i=0;i<6;i++){const a=-Math.PI/2+i*TAU/6,x=Math.cos(a)*130,y=Math.sin(a)*130;g.save();g.translate(x,y);g.rotate(a+Math.PI/2);poly(g,[[0,-12],[8,0],[0,12],[-8,0]],i%2?'#f6f0ff':'#1a1030');g.lineWidth=1.6;g.strokeStyle=p[3];g.stroke();g.restore();}
      g.lineWidth=2.2;g.strokeStyle=p[3];for(let i=0;i<7;i++){let a=rn()*TAU,r=58;g.beginPath();g.moveTo(Math.cos(a)*r,Math.sin(a)*r);while(r<124){r+=10+rn()*14;a+=(rn()-.5)*.5;g.lineTo(Math.cos(a)*r,Math.sin(a)*r);}g.stroke();}
      g.shadowBlur=0;g.fillStyle=rgba(p[4],.7);g.beginPath();g.arc(0,0,6,0,TAU);g.fill();}
    else if(kind==='splat'){/* a glossy paint splat: lumpy body, spikes, droplets */
      const N=22,rad=[];for(let i=0;i<N;i++)rad.push(62+rn()*34);g.beginPath();for(let i=0;i<=N*2;i++){const j=i%(N*2),a=j/(N*2)*TAU,r=j%2?rad[j>>1]*.82:rad[j>>1]*(rn()<.3?1.55:1);i?g.lineTo(Math.cos(a)*r,Math.sin(a)*r):g.moveTo(Math.cos(a)*r,Math.sin(a)*r);}g.closePath();
      g.fillStyle=RG(g,-14,-16,120,0,p[3],.3,p[2],.75,p[1],1,p[0]);g.fill();
      for(let i=0;i<14;i++){const a=rn()*TAU,d=110+rn()*36,r=3+rn()*8;g.fillStyle=i%3?p[2]:p[1];g.beginPath();g.arc(Math.cos(a)*d,Math.sin(a)*d,r,0,TAU);g.fill();}
      g.fillStyle='rgba(255,255,255,.55)';g.beginPath();g.ellipse(-24,-26,26,11,-.5,0,TAU);g.fill();g.fillStyle='rgba(255,255,255,.35)';g.beginPath();g.ellipse(20,18,12,5,-.5,0,TAU);g.fill();}
    else if(kind==='eye'){/* hypnotic spiral ring */
      g.fillStyle=RG(g,0,0,150,0,rgba(p[0],.5),.8,rgba(p[0],.3),1,rgba(p[0],0));g.beginPath();g.arc(0,0,150,0,TAU);g.fill();g.shadowColor=p[2];g.shadowBlur=8;
      for(let k=0;k<3;k++){g.lineWidth=k?2:4;g.strokeStyle=k?p[3]:p[2];g.beginPath();for(let i=0;i<=220;i++){const u=i/220,a=u*TAU*3+k*TAU/3,r=12+u*124;i?g.lineTo(Math.cos(a)*r,Math.sin(a)*r):g.moveTo(Math.cos(a)*r,Math.sin(a)*r);}g.stroke();}
      g.lineWidth=4;g.strokeStyle=p[2];g.beginPath();g.arc(0,0,140,0,TAU);g.stroke();g.shadowBlur=0;}
  });}

/* debris families used by the effects (bits(S,'rift',…) etc.) */
BIT.rift=[['hyDia',{up:[70,220],g:460,sp:170,sz:[7,12],s1:.8,life:[.5,.9],spin:9}],['star4',{up:[10,70],g:-10,sp:110,sz:[10,20],s1:.2,life:[.35,.7],add:1}]];
BIT.ink=[['hyDia',{up:[40,160],g:420,sp:150,sz:[6,10],s1:.7,life:[.45,.8],spin:9}],['ember',{up:[30,100],g:-50,sp:60,sz:[6,11],s1:.2,life:[.5,.9],wob:4}]];
BIT.jest=[['hyDia',{up:[90,240],g:420,sp:190,sz:[8,13],s1:.8,life:[.6,1],spin:10}],['star4',{up:[10,70],g:-10,sp:110,sz:[10,20],s1:.2,life:[.35,.7],add:1}]];
BIT.weep=[['hyTear',{up:[40,140],g:620,sp:120,sz:[8,12],life:[.4,.7],face:1}],['drop',{up:[80,200],g:760,sp:140,sz:[7,11],life:[.4,.7],face:1}]];
BIT.scorn=[['drop',{up:[120,280],g:820,sp:170,sz:[8,13],s1:.8,life:[.4,.75],face:1}],['hyDia',{up:[80,200],g:500,sp:160,sz:[7,11],life:[.4,.7],spin:8}]];
BIT.sleepy=[['hyZ',{up:[30,70],g:-30,sp:30,sz:[10,16],s1:1.1,life:[.8,1.3],wob:6}],['puff',{up:[10,40],g:-10,sp:60,sz:[14,22],s1:1.4,life:[.6,1],wob:2}]];
window.HYART={ring,HINGE:{u:[8,25],l:[8,4]},MASKC:MC,GOLD:GD,INK:[INK0,INK1,INK2]};
})();
