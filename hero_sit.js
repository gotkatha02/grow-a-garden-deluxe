/* Sit (owner 2026-11-21, cat first): like Ragnarok — press Insert (PC) or the 🧘 button (phone) to sit down; HP / SP come back
   twice as fast while sitting (updatePlayer in index.html); moving, attacking or casting stands the hero up.
   One painted picture per direction (assets/sit/<hero>_<S|SE|E|NE|N|NW|W|SW>.webp), cut from the owner's 8-view sheet on green.
   k = sheet px → sprite-cell px (sprite idle height 228 / standing height 475 on the owner's matching standing sheet);
   cx = body centre across the picture (bottom quarter). Heroes without a SIT entry cannot sit yet.
   wukong (snow monkey, 2026-11-23): only 4 sitting views on the owner's sheet (S SE E N) → W side mirrored, NE / NW = the back view;
   cut by `tools/dir8cut.py sit`; cx = head centre (the staff lies across the feet); k = 230 / (342 × 1.09): the sitting row of
   his sheet is drawn 1.09× bigger than its standing rows (pompom + face size). Waits for char_wukong.js (CHAR 'wukong').
   jaguar (Eclipse Dancer, owner 2026-11-26 'ท่านั่งขอทุกมุม'): 8 real views, kneeling with her crossed daggers laid on the
   ground in front → fy = the body's ground line as a fraction of the picture height (the daggers lie below it, nearer
   the camera); cut by `tools/sheet_state.py tools/clips/jaguar_sit.json` (pics mode); k = the gold sun disc vs the idle SE
   frames. fy defaults to 1 (picture bottom on the feet) for the other heroes.
   jaguar 2.5D (window.JG25, 2026-11-26): the owner's 2.5D sit sheet, tools/clips/jaguar25_sit.json → assets/sit/jaguar25_*; k = her
   head vs the 2.5D idle frames, cx = where the standing idle head is, fy = the knees' ground line.
   cat (2.5D Nekomata, window.CAT25, 2026-11-27): the old white ronin's sitting pictures do not fit; his 2.5D sit sheet came the
   same morning (10:56): cross-legged, katana on the left hip, mask on the right, the straw hat on his back → assets/sit/cat25_*
   by `tools/sheet_state.py tools/clips/cat25_sit.json` (pics mode; the sheet drew the lower-right view twice and no lower-left
   one → SW = that view flipped, like the standing SW frames); k .41 = his head vs the 2.5D idle frames, cx = where the standing
   idle head is, fy = the bottom of the crossed legs (the tails lie beside / behind him, below it). The cat shows its own rest status.
   wolf (2.5D wolf, 2026-11-26): 8 views cross-legged, the axe upright beside his right shoulder; only with the 2.5D atlas (window.WLF25). */
(function(){const SIT={cat:window.CAT25?{dir:'assets/sit/cat25_',k:.41,cx:{S:.5,SE:.396,E:.515,NE:.593,N:.487,NW:.407,W:.482,SW:.595},
    fy:{S:.984,SE:.986,E:.969,NE:.942,N:.923,NW:.917,W:.957,SW:.986}}:{dir:'assets/sit/cat_',k:228/475,cx:{S:.513,SE:.497,E:.506,NE:.516,N:.516,NW:.509,W:.496,SW:.488}},
  wukong:{dir:'assets/sit/wukong_',k:230/373,cx:{S:.581,SE:.457,E:.457,NE:.429,N:.429,NW:.429,W:.539,SW:.54}},
  jaguar:window.JG25?{dir:'assets/sit/jaguar25_',k:.465,cx:{S:.604,SE:.583,E:.582,NE:.607,N:.523,NW:.473,W:.407,SW:.422},
    fy:{S:.888,SE:.888,E:.913,NE:.973,N:.962,NW:.969,W:.943,SW:.941},rest:1}:{dir:'assets/sit/jaguar_',k:.489,cx:{S:.566,SE:.613,E:.636,NE:.556,N:.458,NW:.38,W:.363,SW:.358},
    fy:{S:.852,SE:.863,E:.867,NE:.868,N:.856,NW:.869,W:.864,SW:.863},rest:1},
  wolf:window.WLF25?{dir:'assets/sit/wolf25_',k:.75,cx:{S:.589,SE:.57,E:.569,NE:.46,N:.49,NW:.451,W:.449,SW:.49},fy:{S:.985,SE:.99,E:.99,NE:.995,N:.998,NW:.998,W:.995,SW:.981},rest:1}:null}[CHAR];   /* wolf: the 2.5D wolf only (owner's sit sheet 2026-11-26, tools/clips/wolf25_sit.json); his atlas boxes carry HERO_K (META_K), so the picture is scaled by it too */   /* rest:1 = this file shows the 'นั่งพัก ×2' status (the cat / monkey do it in their own code) */
if(!SIT)return;
const IM={};if(SIT.dir)for(const d of ['S','SE','E','NE','N','NW','W','SW']){const im=new Image();im.src=SIT.dir+d+'.webp?v=1';IM[d]=im;}   /* dir null = sitting works (×2 regen) but no sitting pictures yet: the hero stays drawn standing (the 2.5D cat used it for a morning, 2026-11-27, until its sit sheet came) */
player.sitting=false;let fade=0;
window.heroSit=function(on){if(on===undefined)on=!player.sitting;if(on&&(player.action||player.casting||player.hp<=0))return;player.sitting=!!on;
  if(typeof msg==='function')msg(on?'นั่งพัก · ฟื้น HP / SP เร็วขึ้น 2 เท่า':'ลุกขึ้น');};
const D0=window.drawPlayer;
window.drawPlayer=function(){const im=IM[player.dir];if(!player.sitting||!im||!im.complete||!im.naturalWidth)return D0.apply(this,arguments);
  const [x,y]=P(player.x,player.y,player.z||0),s=SIT.k*SPR*CHAR_SCALE*(window.META_K||1),w=im.naturalWidth*s,h=im.naturalHeight*s;
  ctx.save();ctx.fillStyle='rgba(20,15,30,.28)';ctx.beginPath();ctx.ellipse(x,y-1,w*.42,w*.12,0,0,Math.PI*2);ctx.fill();
  const mf=curMap&&mapHost()&&mapHost().charFilter,f=[typeof CHAR_FILTER!=='undefined'?CHAR_FILTER:'',mf,typeof sceneFilter==='function'?sceneFilter():''].filter(Boolean).join(' ');if(f)ctx.filter=f;
  const br=1+.012*Math.sin(performance.now()/650);   /* calm breathing */
  ctx.translate(x,y);ctx.scale(1,br);ctx.drawImage(im,-w*SIT.cx[player.dir],-h*(SIT.fy?SIT.fy[player.dir]:1),w,h);ctx.restore();};
/* stand up when the hero does anything */
const REST={n:'นั่งพัก — ฟื้น HP/SP ×2',c:'#8fd86a',i:'REST'};
(function tick(){if(player.sitting&&(player.moving||player.action||player.casting||player.hp<=0))player.sitting=false;
  if(SIT.rest&&player.buffs){if(player.sitting){if(BUFFDEF.rest!==REST)BUFFDEF.rest=REST;player.buffs.rest={t:1e9,total:1e9,lbl:'×2'};}else if(player.buffs.rest&&player.buffs.rest.lbl!=null)delete player.buffs.rest;}
  requestAnimationFrame(tick);})();
addEventListener('keydown',e=>{if(e.key==='Insert'&&!/INPUT|TEXTAREA/.test((e.target||{}).tagName||'')){e.preventDefault();heroSit();}});
/* phone button next to the chat / auto buttons */
const st=document.createElement('style');st.textContent='#mobSit{display:none;position:fixed;left:calc(150px + env(safe-area-inset-left));bottom:calc(160px + env(safe-area-inset-bottom));width:50px;height:50px;z-index:25;border-radius:50%;border:3px solid #e9b44c;background:#3a2a1ecc;color:#fff;font-size:24px;padding:0;touch-action:none}body.mob #mobSit{display:block}#mobSit.on{background:#e9b44c}';
document.head.appendChild(st);const b=document.createElement('button');b.id='mobSit';b.textContent='🧘';b.setAttribute('aria-label','Sit');document.body.appendChild(b);
b.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();heroSit();});
setInterval(()=>b.classList.toggle('on',!!player.sitting),200);
})();
