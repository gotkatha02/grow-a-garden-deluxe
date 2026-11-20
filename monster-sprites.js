/* =====================================================================
   AETHERFALL — DRAWN MONSTER SPRITE SHEETS (ChatGPT 5-row sheets, processed by tools/monsheet.py)
   Sheet: 5 rows × 5 cells — idle 4 · walk 4 · attack 5 · hurt 2 · death 5 — every cell cw×ch, feet at (px,py).
   Art faces down-right; facing left = mirrored. (Back view not used yet.)
   h  = on-map height in world px (the hero is about 46). Sizes differ per monster, but are kept at or below
        about half of the drawn height so the art is always scaled DOWN, never blown up (stays sharp when zoomed in).
   sw = shadow width. fly = floats (shadow stays on the ground, a little smaller).
   To add a monster: run tools/monsheet.py on the sheet, put the .webp in assets/monsters/, add a line here
   keyed by the monster's name exactly as in the map files (VK_MONS / monster-roster.js).
   ===================================================================== */
(function(){
const S=(file,cw,ch,px,py,ref,h,o)=>Object.assign({file,cw,ch,px,py,ref,h,sw:h*.55},o||{});
const MS={
  'Pinecone Sprite':  S('pineconeSprite',267,199,131,197,168,34),
  'Fang Hare':        S('fangHare',225,195,112,193,170,34),
  'Big Frostling':    S('bigFrostling',272,231,133,229,183,54),
  'Icicle Bat':       S('icicleBat',256,177,126,175,169,36,{fly:1}),
  'Rune Wisp':        S('runeWisp',239,181,103,179,168,38,{fly:1}),
  'Moor Wolf':        S('moorWolf',256,197,130,195,178,46,{sw:34}),
  'Runestone Golem':  S('runestoneGolem',306,223,137,221,175,74),
  'Ice Crab':         S('iceCrab',282,206,130,204,173,34,{sw:26}),
  'Fjord Seal Spirit':S('sealSpirit',286,173,132,171,163,40,{sw:30}),
  'Narwhal Raider':   S('narwhalRaider',305,201,141,199,187,52),
  'Hound of the Raiders':S('raiderHound',279,188,140,186,173,46,{sw:34}),
  'Raider Hound':     S('raiderHound',279,188,140,186,173,46,{sw:34}),
  'Lost Villager':    S('lostVillager',290,207,139,205,187,54,{fly:1}),
  'Thatch Troll':     S('thatchTroll',306,216,133,214,188,66,{walk:12}),
  'Yeti Cub':         S('yetiCub',280,198,126,196,182,46,{walk:12}),
  'Avalanche Ram':    S('avalancheRam',301,200,151,198,181,48,{sw:34,walk:12}),
  'Mad Dwarf Ghost':  S('madDwarfGhost',280,235,138,233,187,42,{fly:1}),
  'Ore Golem':        S('oreGolem',308,212,153,210,177,70,{walk:12}),
  'Lamp Beetle':      S('lampBeetle',246,193,122,191,171,34,{walk:12,sw:26}),
  'Forge Golem':      S('forgeGolem',289,211,141,209,176,70,{walk:12}),
  'Ice Bat Pack':     S('iceBatPack',274,194,140,192,130,38,{walk:12,fly:1,sw:30}),
  'Runesmith Revenant':S('runesmithRevenant',257,212,128,210,175,50,{walk:12}),
  'Forest Witchling': S('forestWitchling',314,200,139,198,169,42,{walk:12}),
  'Blackpine Treant': S('blackpineTreant',300,219,142,217,178,72,{walk:12}),
  'Young Yeti':       S('youngYeti',297,202,142,200,183,70,{walk:12}),
  'Tundra Wolf':      S('tundraWolf',330,195,150,193,179,50,{walk:12,sw:36}),
  'Frost Mammoth Calf':S('mammothCalf',298,211,147,209,172,62,{sw:40,walk:12}),
  'Fenrir Spawn':     S('fenrirSpawn',274,203,138,201,182,44,{walk:12,sw:32})};
const ROW={idle:0,walk:1,attack:2,hurt:3,death:4};
/* walk:N = a separate smooth walk strip assets/monsters/<file>_walk.webp (N frames, same cell size), made from a walk video by tools/vidwalk.py */
/* 2026-11-20 load time: a sheet is downloaded the first time its monster is looked at (was: all 30 sheets, 11 MB, at every start) */
const MSLD={};
function msLoad(m,walk){let s=MSLD[m.file];if(!s){s=MSLD[m.file]={ok:0,wok:0,img:new Image(),wimg:null};s.img.onload=()=>{s.ok=1;};s.img.src='assets/monsters/'+m.file+'.webp';}
  if(walk&&m.walk&&!s.wimg){s.wimg=new Image();s.wimg.onload=()=>{s.wok=1;};s.wimg.src='assets/monsters/'+m.file+'_walk.webp';}return s;}
for(const k in MS){const m=MS[k];Object.defineProperties(m,{ok:{get:()=>msLoad(m,1).ok},wok:{get:()=>msLoad(m,1).wok},img:{get:()=>msLoad(m).img},wimg:{get:()=>msLoad(m,1).wimg}});}
const def=e=>e&&(e.vdef&&MS[e.vdef.name]||e.spr&&MS[e.spr]);   /* e.spr: sprite name for monsters made outside the map tables (world boss) */
window.MSPR_HAS=e=>{const m=def(e);return !!(m&&m.ok);};
window.MSPR_H=e=>{const m=def(e);return m?m.h*(e.boss?1.5:1):54;};
function frame(e,m){const t=gameTime,ph=e.bob||0;
  if(e.dead)return [ROW.death,Math.min(4,Math.floor(e.deadT/.16))];
  if(e.st&&e.st.frozen>0)return [ROW.idle,0];
  if(e.atk>0)return [ROW.attack,e.atk>.3?0:1];                      // wind-up: crouch → hold
  const ha=t-(e._hitT??-9);if(ha<.42)return [ROW.attack,ha<.14?2:ha<.28?3:4];   // strike → follow-through → recover
  const hu=t-(e._hurtT??-9);if(hu<.32)return [ROW.hurt,hu<.16?0:1];if(e.st&&e.st.stagger>0)return [ROW.hurt,0];
  if(e._mv>0){if(m&&m.wok)return ['W',Math.floor((e._wp||0)*m.walk)%m.walk];return [ROW.walk,Math.floor((e._wp||0)*4)%4];}          // walk frames follow the distance actually walked (no sliding feet)
  return [ROW.idle,Math.floor((t+ph)*4.5)%4];}
const tintC=document.createElement('canvas'),tg=tintC.getContext('2d');

/* ---- CLIP sprites: each animation cut from its own video by tools/vidclips.py (one frame grid per animation).
   Loaded only when that monster first appears. Bosses drive the animation themselves through e.clipA={k,t,rev};
   normal monsters pick idle / walk / attack / death from their state. ---- */
const CLIPS={
  fenrir:{"ref":200,"idle":{"f":"fenrirBoss_idle","cw":276,"ch":209,"px":151,"py":203,"n":16,"cols":8,"fps":10,"loop":1},"walk":{"f":"fenrirBoss_walk","cw":271,"ch":216,"px":150,"py":207,"n":16,"cols":8,"fps":12,"loop":1},"claw":{"f":"fenrirBoss_claw","cw":418,"ch":336,"px":213,"py":227,"n":26,"cols":8,"fps":12,"hit":10},"leap":{"f":"fenrirBoss_leap","cw":418,"ch":367,"px":213,"py":309,"n":38,"cols":8,"fps":12,"hit":21,"hold":[9,21]},"breath":{"f":"fenrirBoss_breath","cw":391,"ch":316,"px":186,"py":208,"n":41,"cols":8,"fps":12,"hit":20,"beam":[20,35]},"vanish":{"f":"fenrirBoss_vanish","cw":416,"ch":354,"px":212,"py":308,"n":33,"cols":8,"fps":16},"orb":{"f":"fenrirBoss_orb","cw":357,"ch":311,"px":196,"py":303,"n":31,"cols":8,"fps":12,"hit":24},"howl":{"f":"fenrirBoss_howl","cw":418,"ch":333,"px":213,"py":308,"n":42,"cols":8,"fps":12,"hit":11},"death":{"f":"fenrirBoss_death","cw":416,"ch":355,"px":213,"py":309,"n":34,"cols":8,"fps":9}},
  shadeHound:{"ref":130,"idle":{"f":"shadeHound_idle","cw":176,"ch":146,"px":95,"py":139,"n":12,"cols":8,"fps":10,"loop":1},"walk":{"f":"shadeHound_walk","cw":177,"ch":147,"px":95,"py":144,"n":12,"cols":8,"fps":12,"loop":1},"attack":{"f":"shadeHound_attack","cw":244,"ch":227,"px":120,"py":184,"n":21,"cols":8,"fps":12,"hit":11},"death":{"f":"shadeHound_death","cw":211,"ch":165,"px":126,"py":153,"n":35,"cols":8,"fps":12}}};
function clipLoad(m){if(m._ld)return;m._ld=1;for(const k in m.clip){const a=m.clip[k];if(!a||!a.f)continue;a.img=new Image();a.img.onload=()=>{a.ok=1;};a.img.src='assets/monsters/'+a.f+'.webp';}}
const C=(meta,h,o)=>{const m=Object.assign({clip:meta,h,ref:meta.ref,sw:h*.55},o||{});Object.defineProperty(m,'ok',{get(){clipLoad(m);return !!m.clip.idle.ok;}});return m;};
MS['Fenrir Shade Hound']=C(CLIPS.shadeHound,40,{sw:24});
MS['Fenrir']=C(CLIPS.fenrir,80,{sw:46});
window.MSPR_CLIPDUR=(name,k)=>{const m=MS[name],a=m&&m.clip&&m.clip[k];return a?a.n/a.fps:0;};
window.MSPR_DEADLEN=e=>{const m=def(e);return m&&m.clip&&m.clip.death?m.clip.death.n/m.clip.death.fps+.25:3.1;};
function cframe(e,m){const C=m.clip,t=gameTime,ok=k=>C[k]&&C[k].ok;
  if(e.dead&&ok('death')){const a=C.death;return ['death',Math.min(a.n-1,Math.floor(e.deadT*a.fps))];}
  const ca=e.clipA;if(ca&&ok(ca.k)){const a=C[ca.k];let f=Math.floor(ca.t*a.fps);f=a.loop?((f%a.n)+a.n)%a.n:Math.max(0,Math.min(a.n-1,f));return [ca.k,ca.rev?a.n-1-f:f];}
  if(e.st&&e.st.frozen>0)return ['idle',0];
  if(ok('attack')){const a=C.attack,hit=a.hit??Math.floor(a.n/2);
    if(e.atk>0)return ['attack',Math.min(hit,Math.floor((1-e.atk/(e.boss?.8:.6))*hit))];
    const ha=t-(e._hitT??-9),f=hit+Math.floor(ha*a.fps);if(f<a.n)return ['attack',f];}
  if(e._mv>0&&ok('walk')){const a=C.walk;return ['walk',Math.floor((e._wp||0)*a.n)%a.n];}
  const a=C.idle;return ['idle',Math.floor((t+(e.bob||0))*a.fps)%a.n];}
/* map colour grade (map charFilter) baked once per sheet instead of ctx.filter on every draw (ctx.filter per monster was the biggest frame cost on fields) */
const FSH=new Map();function fsrc(img){const f=window.MSPR_FILTER;if(!f||!img||!img.naturalWidth)return img;let m=FSH.get(img);if(!m){m={};FSH.set(img,m);}let c=m[f];if(c)return c;
  c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;const g=c.getContext('2d');g.filter=f;g.drawImage(img,0,0);m[f]=c;return c;}
function drawClip(e,m,x,y,al,cold,fl){const H=MSPR_H(e),k=H/m.ref;
  if(e._lx!==undefined&&!e.dead){const d=Math.hypot(e.x-e._lx,e.y-e._ly);if(d<60)e._wp=((e._wp||0)+d/(H*1.1))%1000;}e._lx=e.x;e._ly=e.y;
  const [ak,f]=cframe(e,m),a=m.clip[ak];
  if(!(e.clipA&&e.clipA.noShadow)&&!e.dead){ctx.save();ctx.globalAlpha=al*.26;ctx.fillStyle='#14182a';ctx.beginPath();const sw=m.sw*(e.boss?1.5:1);ctx.ellipse(x,y+1+(e.z||0),sw,sw*.27,0,0,TAU);ctx.fill();ctx.restore();}
  let src=fsrc(a.img),sx=(f%a.cols)*a.cw,sy=Math.floor(f/a.cols)*a.ch;
  if(fl>.02||cold>0){if(tintC.width!==a.cw||tintC.height!==a.ch){tintC.width=a.cw;tintC.height=a.ch;}
    tg.globalCompositeOperation='copy';tg.drawImage(src,sx,sy,a.cw,a.ch,0,0,a.cw,a.ch);tg.globalCompositeOperation='source-atop';
    if(cold>0){tg.fillStyle=`rgba(120,200,255,${cold*.5})`;tg.fillRect(0,0,a.cw,a.ch);}if(fl>.02){tg.fillStyle=`rgba(255,120,110,${fl*.45})`;tg.fillRect(0,0,a.cw,a.ch);}src=tintC;sx=sy=0;}
  ctx.save();ctx.globalAlpha=al;ctx.translate(x,y);ctx.scale((e.face||1)*(m.flip?-1:1)*k,k);ctx.drawImage(src,sx,sy,a.cw,a.ch,-a.px,-a.py,a.cw,a.ch);ctx.restore();return true;}
window.MSPR_DRAW=function(e,x,y,al,cold,fl){const m=def(e);if(!m||!m.ok)return false;if(m.clip)return drawClip(e,m,x,y,al,cold,fl);const H=MSPR_H(e),k=H/m.ref;
  /* walk phase: one full 4-frame cycle (= two steps) per ~0.9 body heights travelled */
  if(e._lx!==undefined&&!e.dead){const d=Math.hypot(e.x-e._lx,e.y-e._ly);if(d<40)e._wp=((e._wp||0)+d/(H*.9))%1000;}e._lx=e.x;e._ly=e.y;
  let bob=0,tilt=0;if(e._mv>0&&!e.dead&&!m.fly&&!m.wok&&!(e.st&&e.st.frozen>0)){const p=(e._wp||0)*Math.PI*2;bob=Math.abs(Math.sin(p))*H*.045;tilt=Math.sin(p)*.035;}
  /* ground shadow */
  ctx.save();ctx.globalAlpha=al*(m.fly?.16:.24);ctx.fillStyle='#27324a';ctx.beginPath();const sw=m.sw*(e.boss?1.5:1)*(m.fly?.8:1);ctx.ellipse(x,y+1,sw,sw*.27,0,0,TAU);ctx.fill();ctx.restore();
  const [r,f]=frame(e,m);let src=fsrc(r==='W'?m.wimg:m.img),sx=f*m.cw,sy=r==='W'?0:r*m.ch;
  if(fl>.02||cold>0){if(tintC.width!==m.cw||tintC.height!==m.ch){tintC.width=m.cw;tintC.height=m.ch;}
    tg.globalCompositeOperation='copy';tg.drawImage(src,sx,sy,m.cw,m.ch,0,0,m.cw,m.ch);tg.globalCompositeOperation='source-atop';
    if(cold>0){tg.fillStyle=`rgba(120,200,255,${cold*.55})`;tg.fillRect(0,0,m.cw,m.ch);}if(fl>.02){tg.fillStyle=`rgba(255,110,100,${fl*.55})`;tg.fillRect(0,0,m.cw,m.ch);}src=tintC;sx=sy=0;}
  const br=!e.dead&&r===ROW.idle?1+Math.sin(gameTime*3+(e.bob||0))*.012:1;
  ctx.save();ctx.globalAlpha=al;ctx.translate(x,y-bob);ctx.rotate(tilt*(e.face||1));ctx.scale((e.face||1)*k/br,k*br);   /* step bounce: body lifts on each stride, rocks a little side to side */
  ctx.drawImage(src,sx,sy,m.cw,m.ch,-m.px,-m.py,m.cw,m.ch);ctx.restore();
  return true;};
window.MSPR=MS;window.MSPR_C=C;   /* monster-catalog.js adds clip sprites through this */
})();
