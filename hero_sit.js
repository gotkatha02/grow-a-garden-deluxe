/* Sit (owner 2026-11-21, cat first): like Ragnarok — press Insert (PC) or the 🧘 button (phone) to sit down; HP / SP come back
   twice as fast while sitting (updatePlayer in index.html); moving, attacking or casting stands the hero up.
   One painted picture per direction (assets/sit/<hero>_<S|SE|E|NE|N|NW|W|SW>.webp), cut from the owner's 8-view sheet on green.
   k = sheet px → sprite-cell px (sprite idle height 228 / standing height 475 on the owner's matching standing sheet);
   cx = body centre across the picture (bottom quarter). Heroes without a SIT entry cannot sit yet. */
(function(){const SIT={cat:{dir:'assets/sit/cat_',k:228/475,cx:{S:.513,SE:.497,E:.506,NE:.516,N:.516,NW:.509,W:.496,SW:.488}}}[CHAR];
if(!SIT)return;
const IM={};for(const d of ['S','SE','E','NE','N','NW','W','SW']){const im=new Image();im.src=SIT.dir+d+'.webp?v=1';IM[d]=im;}
player.sitting=false;let fade=0;
window.heroSit=function(on){if(on===undefined)on=!player.sitting;if(on&&(player.action||player.casting||player.hp<=0))return;player.sitting=!!on;
  if(typeof msg==='function')msg(on?'นั่งพัก · ฟื้น HP / SP เร็วขึ้น 2 เท่า':'ลุกขึ้น');};
const D0=window.drawPlayer;
window.drawPlayer=function(){const im=IM[player.dir];if(!player.sitting||!im||!im.complete||!im.naturalWidth)return D0.apply(this,arguments);
  const [x,y]=P(player.x,player.y,player.z||0),s=SIT.k*SPR*CHAR_SCALE,w=im.naturalWidth*s,h=im.naturalHeight*s;
  ctx.save();ctx.fillStyle='rgba(20,15,30,.28)';ctx.beginPath();ctx.ellipse(x,y-1,w*.42,w*.12,0,0,Math.PI*2);ctx.fill();
  const mf=curMap&&mapHost()&&mapHost().charFilter,f=[typeof CHAR_FILTER!=='undefined'?CHAR_FILTER:'',mf,typeof sceneFilter==='function'?sceneFilter():''].filter(Boolean).join(' ');if(f)ctx.filter=f;
  const br=1+.012*Math.sin(performance.now()/650);   /* calm breathing */
  ctx.translate(x,y);ctx.scale(1,br);ctx.drawImage(im,-w*SIT.cx[player.dir],-h,w,h);ctx.restore();};
/* stand up when the hero does anything */
(function tick(){if(player.sitting&&(player.moving||player.action||player.casting||player.hp<=0))player.sitting=false;requestAnimationFrame(tick);})();
addEventListener('keydown',e=>{if(e.key==='Insert'&&!/INPUT|TEXTAREA/.test((e.target||{}).tagName||'')){e.preventDefault();heroSit();}});
/* phone button next to the chat / auto buttons */
const st=document.createElement('style');st.textContent='#mobSit{display:none;position:fixed;left:calc(150px + env(safe-area-inset-left));bottom:calc(160px + env(safe-area-inset-bottom));width:50px;height:50px;z-index:25;border-radius:50%;border:3px solid #e9b44c;background:#3a2a1ecc;color:#fff;font-size:24px;padding:0;touch-action:none}body.mob #mobSit{display:block}#mobSit.on{background:#e9b44c}';
document.head.appendChild(st);const b=document.createElement('button');b.id='mobSit';b.textContent='🧘';b.setAttribute('aria-label','Sit');document.body.appendChild(b);
b.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();heroSit();});
setInterval(()=>b.classList.toggle('on',!!player.sitting),200);
})();
