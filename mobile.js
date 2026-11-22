/* =========================================================
   Aetherfall — Mobile mode (โหมดมือถือ)
   - Virtual joystick (เดิน), attack button, AUTO button
   - RoV-style skill wheel (2026-11-19): big attack button bottom-right, skills in two arcs around it.
     Tap = cast on the auto target · drag = aim (direction / ground spot) · drag onto ✕ = cancel.
   - Hold attack = keep attacking · 🎯 tap = next target / hold = release (target_lock.js) · floating joystick (touch anywhere on the left)
   - Long-press a skill in ✎ mode = skill info (potions are used automatically: items.js auto-potion)
   - Settings: button size S/M/L and opacity ('af_mob_sz', 'af_mob_op')
   - Landscape phone layout (ย่อ HUD)
   - Long-press = right click (ดูข้อมูลไอเทม), double-tap = double click (สวมใส่)
   - Pinch = zoom map
   Toggle: Settings (⚙) → MOBILE MODE   ·   saved in localStorage 'af_mobile'
   ========================================================= */
(function(){
'use strict';
const KEY='af_mobile';
const UI='assets/ui/';
const isTouch=matchMedia('(pointer:coarse)').matches||('ontouchstart' in window);
function pref(){try{return localStorage.getItem(KEY)||'auto';}catch(e){return 'auto';}}
function setPref(v){try{localStorage.setItem(KEY,v);}catch(e){}}
function wanted(){const p=pref();return p==='on'||(p==='auto'&&isTouch);}

/* ---------------- CSS ---------------- */
const css=`
#mobUI{display:none}
body.mob #mobUI{display:block}
body.mob{touch-action:none;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none;overscroll-behavior:none}
body.mob input,body.mob textarea{-webkit-user-select:text;user-select:text}
body.mob .kb,body.mob #hotbar .tabhint,body.mob .hbt .k{display:none!important}
body.mob #hotbar .hrow.shiftrow{display:none!important}
body.mob:has(#skw.open) #mobUI,body.mob:has(#wmw.open) #mobUI,body.mob:has(#kfw.open) #mobUI,body.mob:has(#smw.open) #mobUI,body.mob:has(#shw.open) #mobUI,body.mob:has(#mkw.open) #mobUI{display:none}

/* joystick */
#mobJoy{position:fixed;left:calc(18px + env(safe-area-inset-left));bottom:calc(18px + env(safe-area-inset-bottom));width:112px;height:112px;z-index:25;touch-action:none}
#mobJoy .base{position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle at 50% 45%,rgba(90,52,40,.55),rgba(40,22,18,.55));border:4px solid #e9b44c;box-shadow:0 0 0 3px #3a1f14,inset 0 0 18px rgba(0,0,0,.45),0 4px 10px rgba(0,0,0,.35)}
#mobJoy .base:before{content:'';position:absolute;inset:16px;border-radius:50%;border:2px dashed rgba(255,215,130,.35)}
#mobJoy .knob{position:absolute;left:50%;top:50%;width:58px;height:58px;margin:-29px 0 0 -29px;border-radius:50%;
  background:radial-gradient(circle at 38% 32%,#fff6c8,#f6c445 45%,#c5791e 100%);border:3px solid #3a1f14;box-shadow:0 3px 6px rgba(0,0,0,.4),inset 0 -4px 6px rgba(120,60,10,.45);transition:transform .08s}
#mobJoy.on .knob{transition:none}

/* action buttons (right): RoV skill wheel */
body.mob #hotbar{display:none!important}
body.mob #hbw{background:none!important;border:0!important;box-shadow:none!important;padding:0!important;pointer-events:none;backdrop-filter:none!important;-webkit-backdrop-filter:none!important}
body.mob .expw{position:fixed!important;left:0;right:0;bottom:0;height:5px;margin:0!important;padding:0!important;z-index:24;pointer-events:none}
body.mob .expw em,body.mob .expw b{display:none!important}
body.mob .expw .tr{height:5px!important;border-radius:0!important;border:0!important}
#mobAtk{position:fixed;width:var(--atk);height:var(--atk);z-index:26;border:0;padding:0;border-radius:50%;touch-action:none;
  background:radial-gradient(circle at 50% 38%,#ffe6a0,#e0902c 55%,#8a3f14 100%);box-shadow:0 0 0 4px #3a1f14,0 0 0 7px #e9b44c,0 6px 14px rgba(0,0,0,.45)}
#mobAtk:after{content:'';position:absolute;inset:20%;background:url(${UI}stat_atk.webp) center/contain no-repeat;filter:drop-shadow(0 2px 2px rgba(0,0,0,.5))}
#mobAtk.pr{transform:scale(.92);filter:brightness(1.2)}
.mobSk{position:fixed;width:var(--sz);height:var(--sz);margin:calc(var(--sz)/-2) 0 0 calc(var(--sz)/-2);z-index:26;border:0;padding:0;border-radius:50%;touch-action:none;
  background:#2a1a14;box-shadow:0 0 0 3px #3a1f14,0 0 0 5px #e9b44c,0 4px 10px rgba(0,0,0,.45);overflow:visible}
.mobSk .ic{position:absolute;inset:0;border-radius:50%;overflow:hidden}
.mobSk .ic img,.mobSk .ic svg{width:100%;height:100%;display:block;object-fit:cover;pointer-events:none}
.mobSk .sw{position:absolute;inset:0;border-radius:50%;pointer-events:none}
.mobSk .t{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font:900 calc(var(--sz)*.34) Cinzel,serif;color:#fff;text-shadow:0 0 3px #000,0 1px 2px #000;pointer-events:none}
.mobSk.nomp .ic{filter:grayscale(.85) brightness(.6)}
.mobSk.ult{box-shadow:0 0 0 3px #3a1f14,0 0 0 5px #ff9a3a,0 0 12px #ffb04a,0 4px 10px rgba(0,0,0,.45)}
.mobSk.cb{box-shadow:0 0 0 3px #3a1f14,0 0 0 5px #fff17a,0 0 16px #ffe14a;animation:mobCb .5s infinite alternate}
@keyframes mobCb{to{filter:brightness(1.3)}}
.mobSk.pr{transform:scale(.9)}
.mobSk .lb{position:absolute;left:50%;top:-14px;transform:translateX(-50%);white-space:nowrap;font:700 10px Mitr,sans-serif;color:#fff3c8;text-shadow:0 1px 2px #000;display:none;pointer-events:none}
.mobSk.cb .lb{display:block}
#mobTab{position:fixed;z-index:26;height:30px;padding:0 10px;border-radius:15px;border:2px solid #e9b44c;background:linear-gradient(#7a2a1c,#4a1810);color:#fff3c8;font:700 12px Mitr,sans-serif;touch-action:none;box-shadow:0 3px 6px rgba(0,0,0,.4);white-space:nowrap}
body.mob #hotbar .tabs{display:none}
.mobSk.empty{background:rgba(40,26,20,.45);box-shadow:0 0 0 2px rgba(233,180,76,.7);border:2px dashed rgba(255,230,160,.6)}
#mobSkW:not(.edit) .mobSk.empty{display:none}
#mobSkW.edit .mobSk{animation:mobWig .35s infinite alternate}
@keyframes mobWig{from{transform:rotate(-4deg)}to{transform:rotate(4deg)}}
#mobTray{position:fixed;left:calc(10px + env(safe-area-inset-left));top:56px;bottom:10px;width:min(44vw,380px);z-index:27;display:none;flex-direction:column;
  background:linear-gradient(#5a2a1c,#2e140c);border:3px solid #e9b44c;border-radius:14px;padding:8px;box-shadow:0 8px 24px rgba(0,0,0,.55);color:#fff3c8}
#mobTray.show{display:flex}
#mobTray.drop{border-color:#ff6a5a;box-shadow:0 0 0 3px rgba(255,90,80,.5),0 8px 24px rgba(0,0,0,.55)}
#mobTray h4{margin:0;font:700 13px Mitr,sans-serif;text-align:center}
#mobTray p{margin:2px 0 6px;font:500 10px Mitr,sans-serif;opacity:.75;text-align:center}
#mobTray .gr{flex:1;overflow:auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(62px,1fr));gap:6px;align-content:start;touch-action:pan-y}
#mobTray button{border:0;background:none;color:inherit;padding:2px 0;display:flex;flex-direction:column;align-items:center;gap:2px;touch-action:pan-y}
#mobTray button .ic{width:46px;height:46px;border-radius:50%;overflow:hidden;box-shadow:0 0 0 2px #e9b44c;background:#2a1a14;pointer-events:none}
#mobTray button .ic img,#mobTray button .ic svg{width:100%;height:100%;display:block}
#mobTray button .n{font:600 9px/1.15 Mitr,sans-serif;text-align:center;pointer-events:none}
#mobTray button.used .ic{opacity:.5}
#mobTray button.sel .ic,.mobSk.sel{box-shadow:0 0 0 3px #fff17a,0 0 14px #ffe14a!important}
.mobSk.hov{box-shadow:0 0 0 3px #3a1f14,0 0 0 6px #7fe0ff,0 0 16px #7fe0ff!important}
#mobGhost{position:fixed;z-index:70;width:56px;height:56px;margin:-28px 0 0 -28px;border-radius:50%;overflow:hidden;pointer-events:none;box-shadow:0 0 0 3px #fff17a,0 6px 14px rgba(0,0,0,.5);opacity:.9}
#mobGhost img,#mobGhost svg{width:100%;height:100%;display:block}
body.mobEdit #mobJoy,body.mobEdit #mobAuto,body.mobEdit #mobChat,body.mobEdit #mobTgt,body.mobEdit #chat{display:none!important}
#mobSkSet{position:fixed;z-index:26;width:44px;height:44px;border-radius:50%;border:3px solid #e9b44c;background:radial-gradient(circle at 50% 35%,#a8452c,#4a1810);color:#fff3c8;
  font:900 15px Cinzel,serif;touch-action:none;box-shadow:0 0 0 2px #3a1f14,0 3px 6px rgba(0,0,0,.45);padding:0;line-height:1}
#mobSkSet small{display:block;font:600 8px Mitr,sans-serif;opacity:.85}
#mobSkSet.pr{transform:scale(.9)}
#mobTgt{position:fixed;z-index:26;width:46px;height:46px;border-radius:50%;border:3px solid #e9b44c;padding:0;touch-action:none;
  background:radial-gradient(circle at 50% 35%,#5a6a8a,#1c2236);box-shadow:0 0 0 2px #3a1f14,0 3px 6px rgba(0,0,0,.45);color:#fff;font:20px sans-serif;line-height:1}
#mobTgt.pr{transform:scale(.9)}
;left:50%;top:50%;transform:translate(-50%,-50%);z-index:61;width:min(90vw,520px);max-height:82vh;overflow:auto;display:none;background:linear-gradient(#3a1d14,#1e0e08);
  border:3px solid #e9b44c;border-radius:14px;padding:12px 14px;color:#fff3c8;font:500 12px/1.5 Mitr,sans-serif;box-shadow:0 10px 30px rgba(0,0,0,.6)}
#mobInfo.show{display:block}
#mobInfo .x{position:sticky;top:0;float:right;border:2px solid #e9b44c;background:#7a2a1c;color:#fff;border-radius:12px;padding:2px 10px;font:700 12px Mitr,sans-serif}
#mobUI.op .mobSk,#mobUI.op #mobAtk,#mobUI.op #mobJoy,#mobUI.op #mobTgt,#mobUI.op #mobSkSet,#mobUI.op #mobTab{opacity:var(--mop)}
#mobJoy.float{transition:none}
#mobCancel{position:fixed;z-index:27;width:64px;height:64px;margin:-32px 0 0 -32px;border-radius:50%;display:none;align-items:center;justify-content:center;font:900 26px sans-serif;color:#fff;
  background:rgba(60,20,20,.75);border:3px solid #ff6a5a;pointer-events:none}
#mobCancel.show{display:flex}#mobCancel.hot{background:#d8322a;transform:scale(1.15)}
#mobAim{position:fixed;inset:0;width:100%;height:100%;z-index:23;pointer-events:none}
#mobAuto{position:fixed;left:calc(84px + env(safe-area-inset-left));bottom:calc(158px + env(safe-area-inset-bottom));width:56px;height:56px;z-index:25;border:0;padding:0;background:url(${UI}hud_auto_off.webp) center/contain no-repeat;touch-action:none}
#mobAuto.on{background-image:url(${UI}hud_auto_on.webp)}
#mobAuto b{position:absolute;left:0;right:0;bottom:-10px;font:900 11px Cinzel,serif;color:#fff3c8;text-shadow:0 1px 0 #3a1f14,0 0 3px #3a1f14}
#mobChat{position:fixed;left:calc(18px + env(safe-area-inset-left));bottom:calc(158px + env(safe-area-inset-bottom));width:52px;height:52px;z-index:25;border:0;padding:0;
  background:url(${UI}menu_chat.webp) center/contain no-repeat;font-size:0}

/* ---------- main menu medallion icons (all modes) ---------- */
#mgrid.mi{background:none!important;border:0!important;box-shadow:none!important;padding:0!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important}   /* no frosted glass behind the medallions (it blurred the map behind them) */
#mgrid.mi button{background:none!important;border:0!important;box-shadow:none!important;border-radius:50%!important;padding:0!important;filter:drop-shadow(0 3px 2px rgba(0,0,0,.35));transition:transform .12s,filter .12s}
#mgrid.mi button img{width:100%;height:100%;display:block;pointer-events:none}
#mgrid.mi button:hover{transform:translateY(-2px) scale(1.06)}
#mgrid.mi button:active{transform:scale(.92)}
#mgrid.mi button.on{filter:drop-shadow(0 0 6px #ffd257) drop-shadow(0 0 3px #fff3b0) brightness(1.12)}
#mgrid.mi .kb{z-index:2;background:#5a2a1c!important;color:#ffe9a8!important;border:2px solid #e9b44c;width:20px!important;height:20px!important;line-height:16px!important;top:-4px!important;right:-4px!important;left:auto!important}

/* ---------- LANDSCAPE PHONE ---------- */
@media (orientation:landscape){
 body.mob #top{zoom:.6;left:4px!important;top:4px!important}
 body.mob #buffs{zoom:.75;left:8px!important;top:86px!important}
 body.mob #mm{zoom:.55;right:6px!important;top:6px!important}
 body.mob #mm .zb{display:none}
 body.mob #mgrid{position:fixed;left:auto!important;bottom:auto!important;top:6px!important;right:calc(118px + env(safe-area-inset-right))!important;width:auto!important;
   display:grid!important;grid-template-columns:repeat(8,38px)!important;gap:4px!important;padding:4px!important;border-radius:12px!important;transform:none!important;z-index:22}
 body.mob #mgrid button{width:38px!important;height:38px!important;padding:3px!important;min-width:0}
 body.mob #mgrid button svg{width:100%;height:100%}
 body.mob #hotbar .hrow{display:grid!important;grid-template-columns:repeat(5,46px);gap:4px!important}
 body.mob .hbt{width:46px!important;height:46px!important;border-radius:10px!important;padding:2px!important}
 body.mob #hotbar .tabs{max-width:246px;overflow-x:auto;flex-wrap:nowrap!important;scrollbar-width:none}
 body.mob #hotbar .tabs::-webkit-scrollbar{display:none}
 body.mob #hotbar .tabs button{white-space:nowrap;font-size:10px!important;height:20px!important;padding:0 7px!important}
 body.mob #autow{display:none!important}
 body.mob #chat{left:calc(8px + env(safe-area-inset-left))!important;top:78px!important;bottom:auto!important;width:42vw!important;height:44vh!important;zoom:.85;z-index:26}
 body.mob > .ro,body.mob #stw,body.mob #eqw,body.mob #itw,body.mob #idw,body.mob #kfw,body.mob #shw,body.mob #wmw,body.mob #smw,body.mob #mkw{max-height:calc(128vh - 12px)!important;max-width:calc(128vw - 12px)!important;overflow:auto!important;
   left:50%!important;top:50%!important;right:auto!important;bottom:auto!important;transform:translate(-50%,-50%) scale(.78)!important;transform-origin:50% 50%!important}
 body.mob #panel{zoom:.8;top:4px!important;right:4px!important;bottom:auto!important;max-height:calc(125vh - 12px)!important;overflow:auto!important;z-index:45!important}
 body.mob #msg{zoom:.8}
 body.mob #kfdlg{bottom:8px!important;transform:translateX(-50%) scale(.72)!important;transform-origin:50% 100%!important}
 body.mob #hldlg{top:50%!important;bottom:auto!important;transform:translate(-50%,-50%) scale(.72)!important;transform-origin:50% 50%!important}
 body.mob:has(#kfdlg[style*="block"]) #mobUI,body.mob:has(#hldlg[style*="block"]) #mobUI{display:none}
}
/* ---------- PORTRAIT PHONE ---------- */
@media (orientation:portrait){
 body.mob #mobChat{display:none}
 body.mob #autow{display:none!important}
 body.mob #hotbar .shiftrow{display:none!important}
}
#mobRot{display:none;position:fixed;left:50%;top:40%;transform:translate(-50%,-50%);z-index:60;background:rgba(40,22,18,.85);color:#fff3c8;padding:8px 14px;border-radius:12px;border:2px solid #e9b44c;font:700 13px sans-serif;pointer-events:none;transition:opacity .6s}
@media (orientation:portrait){body.mob #mobRot.show{display:block}}
`;
const st=document.createElement('style');st.id='mobCSS';st.textContent=css;document.head.appendChild(st);

/* ---------------- DOM ---------------- */
const ui=document.createElement('div');ui.id='mobUI';
ui.innerHTML=`<div id="mobJoy"><div class="base"></div><div class="knob"></div></div>
<button id="mobAtk" aria-label="Attack"></button>
<button id="mobAuto" aria-label="Auto"><b>AUTO</b></button>
<div id="mobSkW"></div><button id="mobTab">✎ จัดสกิล</button><button id="mobSkSet"></button><button id="mobTgt" aria-label="Target">🎯</button><div id="mobInfo"></div><div id="mobTray"></div><div id="mobCancel">✕</div>
<button id="mobChat" aria-label="Chat">💬</button>
<div id="mobRot">หมุนจอเป็นแนวนอนจะเล่นง่ายกว่า ↻</div>`;
document.body.appendChild(ui);
function buzz(ms){if(navigator.vibrate)try{navigator.vibrate(ms);}catch(_){}}
const aimCv=document.createElement('canvas');aimCv.id='mobAim';document.body.appendChild(aimCv);
ui.addEventListener('pointerdown',e=>e.stopPropagation());
ui.addEventListener('contextmenu',e=>e.preventDefault());

/* ---------------- joystick ---------------- */
const joy=document.getElementById('mobJoy'),knob=joy.querySelector('.knob');
const J={id:null,cx:0,cy:0,dx:0,dy:0,on:false};
function joyPos(e){const R=joy.offsetWidth/2,mx=R*.62;let dx=e.clientX-J.cx,dy=e.clientY-J.cy;const L=Math.hypot(dx,dy);if(L>mx){dx*=mx/L;dy*=mx/L;}
  J.dx=dx/mx;J.dy=dy/mx;knob.style.transform=`translate(${dx}px,${dy}px)`;}
joy.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();const r=joy.getBoundingClientRect();J.id=e.pointerId;J.cx=r.left+r.width/2;J.cy=r.top+r.height/2;J.on=true;joy.classList.add('on');
  try{joy.setPointerCapture(e.pointerId);}catch(_){}joyPos(e);});
joy.addEventListener('pointermove',e=>{if(e.pointerId!==J.id)return;e.preventDefault();joyPos(e);});
function joyEnd(e){if(e&&e.pointerId!==J.id)return;J.on=false;J.id=null;J.dx=J.dy=0;knob.style.transform='';joy.classList.remove('on');
  if(J.drove&&typeof player!=='undefined'){player.moveT=null;player.moveQ=null;}J.drove=false;}
joy.addEventListener('pointerup',joyEnd);joy.addEventListener('pointercancel',joyEnd);joy.addEventListener('lostpointercapture',joyEnd);

function joyTick(){requestAnimationFrame(joyTick);
/* floating joystick: a touch anywhere on the left 45% of the game view moves the stick there; it returns home on release */
function joyHome(){joy.classList.remove('float');joy.style.left='';joy.style.top='';joy.style.bottom='';}
const cvJ=document.getElementById('c');
if(cvJ)cvJ.addEventListener('pointerdown',e=>{if(!document.body.classList.contains('mob')||e.pointerType==='mouse'||J.on)return;if(e.clientX>innerWidth*.45)return;
  e.preventDefault();e.stopImmediatePropagation();const w=joy.offsetWidth;joy.classList.add('float');
  joy.style.left=Math.max(4,e.clientX-w/2)+'px';joy.style.top=Math.max(4,Math.min(innerHeight-w-4,e.clientY-w/2))+'px';joy.style.bottom='auto';
  const r=joy.getBoundingClientRect();J.id=e.pointerId;J.cx=r.left+r.width/2;J.cy=r.top+r.height/2;J.on=true;joy.classList.add('on');
  try{joy.setPointerCapture(e.pointerId);}catch(_){}joyPos(e);},true);
joy.addEventListener('lostpointercapture',()=>setTimeout(()=>{if(!J.on)joyHome();},0));
joy.addEventListener('pointerup',()=>setTimeout(()=>{if(!J.on)joyHome();},0));
  if(!document.body.classList.contains('mob')||!J.on)return;
  const m=Math.hypot(J.dx,J.dy);if(m<.18)return;
  try{
    if(typeof busy==='function'&&busy())return;
    if(typeof targeting!=='undefined'&&targeting)return;
    // screen → world: x unchanged, y is squashed by K in the projection
    const k=(typeof K==='number'&&K)?K:.62;let wx=J.dx,wy=J.dy/k;const L=Math.hypot(wx,wy)||1;wx/=L;wy/=L;
    const D=34+40*Math.min(1,m);
    player.attackTarget=null;player.pending=null;player.moveQ=null;
    player.moveT={x:player.x+wx*D,y:player.y+wy*D};J.drove=true;
  }catch(err){}
}
requestAnimationFrame(joyTick);

/* ---------------- attack / auto / chat ---------------- */
const atk=document.getElementById('mobAtk');
/* hold = keep attacking: while held, a dead / missing target is replaced by the nearest enemy (the locked 🎯 target stays first) */
let atkHeld=null;
function atkPulse(first){try{let t=player.attackTarget&&!player.attackTarget.dead?player.attackTarget:null;
  if(!t&&window.TL){const lk=TL.near(640);if(lk){command({kind:'attack',e:lk});return;}}   /* the locked target (target_lock.js) */
  if(!t){t=nearestEnemy(player.x,player.y,520);if(t)command({kind:'attack',e:t});else if(first&&typeof msg==='function')msg('ไม่มีศัตรูอยู่ใกล้ ๆ');}
  else if(first)command({kind:'attack',e:t});}catch(err){}}
atk.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();atk.classList.add('pr');try{atk.setPointerCapture(e.pointerId);}catch(_){}
  atkPulse(true);clearInterval(atkHeld);atkHeld=setInterval(()=>atkPulse(false),180);buzz(8);});
['pointerup','pointercancel','lostpointercapture'].forEach(ev=>atk.addEventListener(ev,()=>{atk.classList.remove('pr');clearInterval(atkHeld);atkHeld=null;}));
const ab=document.getElementById('mobAuto');
function syncAuto(){try{ab.classList.toggle('on',!!autoMode);}catch(e){}}
ab.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();try{toggleAuto();}catch(err){}syncAuto();});
setInterval(syncAuto,500);

/* ---------------- RoV skill wheel ----------------
   7 free slots per set (inner arc 3 big, outer arc 4) around the attack button — big thumb-reach buttons like RoV. The player puts any learned skill in any slot:
   ✎ button → edit mode (RoV style): a tray of learned skills opens on the left; drag a skill onto a slot, drag a slot onto
   another slot to swap, drag a slot back to the tray to empty it; or tap a skill then tap a slot. Long-press = skill info. 5 sets of 7 (button ①–⑤ switches set, for heroes with many skills).
   Saved per hero in localStorage 'af_mobsk_<hero>' (array of 5 sets) and 'af_mobsk_cur_<hero>' (current set).
   A set never saved fills with the learned active skills in skill-tree order (set 2 continues where set 1 stops).
   tap = cast like the PC hotbar (auto target; ground skills land on the target / in front)
   drag = aim: arrow for directional skills, circle for ground skills; release casts, release on ✕ cancels */
const W=document.getElementById('mobSkW'),setB=document.getElementById('mobSkSet'),tabB=document.getElementById('mobTab'),cancelEl=document.getElementById('mobCancel');
let L={},sig='',btns=[];
const G=n=>{try{return eval(n);}catch(e){return undefined;}};   // game globals (TABS, tab, LV …) are script-level lets/consts
const SZ={s:.88,m:1,l:1.1};function uiPref(k,d){try{return localStorage.getItem(k)||d;}catch(e){return d;}}
function layout(){const vh=innerHeight,vw=innerWidth;let sc=Math.max(.62,Math.min(1.05,Math.min(vh,vw)/480))*(SZ[uiPref('af_mob_sz','m')]||1);
  /* keep the top button (🎯) below the minimap: top = cy − r2 − 23 must stay ≥ 112 px */
  for(let n=0;n<20;n++){const atk=88*sc,cy=vh-22*sc-atk/2-6,top=cy-(atk/2+144*sc)*Math.sin(84*Math.PI/180)-23-5;if(top>=112||sc<.62)break;sc*=.97;}
  const ar=22*sc,atk=88*sc;
  L={sc,atk,cx:vw-ar-atk/2-8,cy:vh-ar-atk/2-6,r1:atk/2+60*sc,r2:atk/2+144*sc,s1:66*sc,s2:56*sc};   /* spacing searched so every button keeps ≥12px clear incl. its gold ring */
  atk_el.style.setProperty('--atk',atk+'px');atk_el.style.left=(L.cx-atk/2)+'px';atk_el.style.top=(L.cy-atk/2)+'px';
  tabB.style.left='auto';tabB.style.top='auto';tabB.style.right=(vw-L.cx+L.r2+L.s2/2+8)+'px';tabB.style.bottom=(vh-L.cy-L.s2/2-4)+'px';
  setB.style.right=(vw-L.cx+L.r2+L.s2/2+22)+'px';setB.style.bottom=(vh-L.cy-L.s2/2+36*sc)+'px';
  cancelEl.style.left=(L.cx-L.r2*.55)+'px';cancelEl.style.top=(L.cy-L.r2-L.s2/2-44*sc)+'px';
  {const a=84*Math.PI/180,R=L.r2;tgt.style.left=(L.cx+R*Math.cos(a)-23)+'px';tgt.style.top=(L.cy-R*Math.sin(a)-23)+'px';}
  const op=+uiPref('af_mob_op','1');ui.classList.toggle('op',op<1);ui.style.setProperty('--mop',op);
  btns.forEach(placeBtn);}
const atk_el=document.getElementById('mobAtk'),tgt=document.getElementById('mobTgt'),info=document.getElementById('mobInfo');
/* 🎯 target (target_lock.js, 12 Tails style lock): tap = next target (bosses first, then by distance; repeated taps walk
   the whole list instead of bouncing between the two nearest) · hold = release. Only locks — the hero keeps doing what it
   does (if it is attacking, the attack moves to the new target); the attack button / skills then go to the lock. */
let tgtHold=null,tgtLong=false;
tgt.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();tgt.classList.add('pr');buzz(6);tgtLong=false;try{tgt.setPointerCapture(e.pointerId);}catch(_){}
  clearTimeout(tgtHold);tgtHold=setTimeout(()=>{tgtLong=true;tgt.classList.remove('pr');if(window.TL&&TL.e){TL.release();buzz(18);}},450);});
['pointerup','pointercancel'].forEach(ev=>tgt.addEventListener(ev,e=>{e.preventDefault();e.stopPropagation();clearTimeout(tgtHold);tgt.classList.remove('pr');
  if(ev==='pointerup'&&!tgtLong){try{if(window.TL)TL.cycle(1);}catch(err){}}tgtLong=true;}));
/* skill info (long-press in ✎ mode or in the picker) */
function showInfo(k){let h='';try{h=typeof skTip==='function'?skTip(k,(G('LV')||{})[k]||1):G('SKILLS')[k].name;}catch(e){h=G('SKILLS')[k].name;}
  info.innerHTML='<button class="x">ปิด ✕</button>'+h;info.querySelectorAll('*').forEach(n=>{if(!n.children.length&&/^\s*คลิก/.test(n.textContent))n.remove();});
  info.classList.add('show');buzz(15);   /* (the removed line is the PC-only 'click = set level' hint) */
  info.querySelector('.x').addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();info.classList.remove('show');});}
info.addEventListener('pointerdown',e=>e.stopPropagation());
function slotPos(i){const outer=i>=3,j=outer?i-3:i,R=outer?L.r2:L.r1,a=(outer?(188-j*26):(178-j*52))*Math.PI/180;return [L.cx+R*Math.cos(a),L.cy-R*Math.sin(a),outer?L.s2:L.s1];}
function placeBtn(o){const [x,y,sz]=slotPos(o.i);o.el.style.left=x+'px';o.el.style.top=y+'px';o.el.style.setProperty('--sz',sz+'px');}
function learned(){const TABS=G('TABS'),SK=G('SKILLS'),LV=G('LV')||{},out=[];if(!TABS)return out;
  for(const t of TABS)for(const k of t.keys)if(k&&SK[k]&&!SK[k].passive&&LV[k]>0&&!out.includes(k))out.push(k);return out;}
const LKEY=()=>'af_mobsk_'+(G('CHAR')||'x');
const NSET=5,NSLOT=7,CKEY=()=>'af_mobsk_cur_'+(G('CHAR')||'x');
let cur=(()=>{try{return Math.min(NSET-1,Math.max(0,+localStorage.getItem(CKEY())||0));}catch(e){return 0;}})();
function loadSets(){let v=null;try{v=JSON.parse(localStorage.getItem(LKEY())||'null');}catch(e){}
  if(Array.isArray(v)&&v.length&&!Array.isArray(v[0]))v=[v];   // old single-set save
  if(Array.isArray(v))v=v.map(x=>Array.isArray(x)&&x.length<NSLOT?x.concat(Array(NSLOT-x.length).fill(null)):x);   // 6-slot sets → add the empty 7th slot
  if(Array.isArray(v)&&v.some(x=>Array.isArray(x)&&x.length>NSLOT)){const f=[];for(const x of v)if(Array.isArray(x))for(const k of x)if(k&&!f.includes(k))f.push(k);   // old 10-slot sets → re-chunk
    v=[];for(let i=0;i<NSET;i++)v.push(i*NSLOT<f.length?Array.from({length:NSLOT},(_,j)=>f[i*NSLOT+j]||null):null);}   // sets past the old keys stay unsaved → auto-filled
  const out=[];for(let i=0;i<NSET;i++)out.push(Array.isArray(v)&&Array.isArray(v[i])&&v[i].length===NSLOT?v[i]:null);return out;}
function defSet(i){const L2=learned(),o=[];for(let j=0;j<NSLOT;j++)o.push(L2[i*NSLOT+j]||null);return o;}
function saveSlots(v){const S=loadSets();for(let i=0;i<NSET;i++)if(!S[i])S[i]=defSet(i);S[cur]=v;try{localStorage.setItem(LKEY(),JSON.stringify(S));}catch(e){}}
function slots(){const SK=G('SKILLS')||{},v=loadSets()[cur];return (v||defSet(cur)).map(k=>k&&SK[k]?k:null);}
let editing=false;
function icon(k){const sk=G('SKILLS')[k];try{return (typeof artFor==='function'&&artFor(k))||iconSVG(sk.icon)||'';}catch(e){return '';}}
function build(){const SK=G('SKILLS');if(!SK)return;W.innerHTML='';btns=[];W.classList.toggle('edit',editing);tabB.textContent=editing?'✓ เสร็จ':'✎ จัดสกิล';setB.innerHTML=`${'①②③④⑤'[cur]}<small>ชุดสกิล</small>`;
  const ks=slots();
  for(let i=0;i<NSLOT;i++){const k=ks[i],sk=k&&SK[k];const el=document.createElement('button');el.className='mobSk'+(sk?(sk.ult?' ult':''):' empty');if(sk)el.dataset.k=k;   /* gem_btn.js finds the skill of each button */
    el.innerHTML=sk?`<span class="ic">${icon(k)}</span>${window.gemMark?gemMark(k):''}<span class="sw"></span><span class="t"></span><span class="lb">${sk.follow&&SK[sk.follow]?SK[sk.follow].name:''}</span>`:'<span class="t">+</span>';
    if(editing&&edSel&&edSel.slot===i)el.classList.add('sel');const o={i,k,el,sw:el.querySelector('.sw'),t:el.querySelector('.t')};W.appendChild(el);btns.push(o);placeBtn(o);bindBtn(o);}
  layout();}
/* ---------- RoV-style skill placement (edit mode) ---------- */
const trayEl=document.getElementById('mobTray');let edSel=null,ED=null,ghost=null;
function tray(){if(!editing){trayEl.classList.remove('show');return;}const SK=G('SKILLS'),ks=slots();
  trayEl.innerHTML=`<h4>ชุดสกิล ${cur+1} · ลากสกิลไปวางในช่อง</h4><p>แตะสกิลแล้วแตะช่อง ก็วางได้ · ลากช่องมาที่นี่ = เอาออก · กดค้าง = ดูรายละเอียด</p><div class="gr">`+
    learned().map(k=>`<button data-k="${k}" class="${edSel&&edSel.k===k&&edSel.slot==null?'sel':''}${ks.includes(k)?' used':''}"><span class="ic">${icon(k)}</span><span class="n">${SK[k].name}</span></button>`).join('')+'</div>';
  trayEl.classList.add('show');
  trayEl.querySelectorAll('button[data-k]').forEach(b=>b.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();edStart(e,{k:b.dataset.k});}));}
trayEl.addEventListener('pointerdown',e=>e.stopPropagation());
function place(i,k){const v=slots();if(k){const j=v.indexOf(k);if(j>=0&&j!==i)v[j]=v[i];}v[i]=k||null;saveSlots(v);buzz(12);}
function swapSlots(a,b){const v=slots();[v[a],v[b]]=[v[b],v[a]];saveSlots(v);buzz(12);}
function slotAt(x,y){for(const o of btns){const r=o.el.getBoundingClientRect();if(!r.width)continue;if(Math.hypot(x-(r.left+r.width/2),y-(r.top+r.height/2))<r.width/2+10)return o.i;}return -1;}
function overTray(x,y){const r=trayEl.getBoundingClientRect();return trayEl.classList.contains('show')&&x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom;}
function refresh(){build();tray();sig=signature();}
function edStart(e,src){ED={src,id:e.pointerId,x0:e.clientX,y0:e.clientY,moved:false,t:setTimeout(()=>{if(ED&&!ED.moved&&ED.src.k){const k=ED.src.k;ED=null;showInfo(k);}},450)};}
addEventListener('pointermove',e=>{if(!ED||e.pointerId!==ED.id)return;
  if(!ED.moved&&Math.hypot(e.clientX-ED.x0,e.clientY-ED.y0)>10&&ED.src.k){ED.moved=true;clearTimeout(ED.t);
    ghost=document.createElement('div');ghost.id='mobGhost';ghost.innerHTML=icon(ED.src.k);document.body.appendChild(ghost);}
  if(ED.moved&&ghost){ghost.style.left=e.clientX+'px';ghost.style.top=e.clientY+'px';const si=slotAt(e.clientX,e.clientY);btns.forEach(o=>o.el.classList.toggle('hov',o.i===si));
    trayEl.classList.toggle('drop',ED.src.slot!=null&&overTray(e.clientX,e.clientY));}},true);
function edEnd(e){if(!ED||e.pointerId!==ED.id)return;clearTimeout(ED.t);const d=ED;ED=null;if(ghost){ghost.remove();ghost=null;}btns.forEach(o=>o.el.classList.remove('hov'));trayEl.classList.remove('drop');
  if(e.type==='pointercancel')return;const src=d.src;
  if(d.moved){const si=slotAt(e.clientX,e.clientY);
    if(si>=0){if(src.slot!=null){if(si!==src.slot)swapSlots(src.slot,si);}else place(si,src.k);}
    else if(src.slot!=null&&overTray(e.clientX,e.clientY))place(src.slot,null);
    edSel=null;refresh();return;}
  /* taps: skill then slot, or slot then skill, or slot then slot (swap) */
  if(src.slot==null){if(edSel&&edSel.slot!=null){place(edSel.slot,src.k);edSel=null;}else edSel=edSel&&edSel.k===src.k?null:{k:src.k};}
  else if(edSel&&edSel.slot==null){place(src.slot,edSel.k);edSel=null;}
  else if(edSel&&edSel.slot!=null){if(edSel.slot!==src.slot)swapSlots(edSel.slot,src.slot);edSel=null;}
  else edSel={slot:src.slot};
  refresh();}
addEventListener('pointerup',edEnd,true);addEventListener('pointercancel',edEnd,true);
function signature(){const LV=G('LV');return (editing?'e':'')+cur+'|'+(window.GEM_V||0)+'|'+(localStorage.getItem(LKEY())||'')+'|'+learned().map(k=>k+(LV[k]||0)).join(',');}
tabB.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();editing=!editing;edSel=null;document.body.classList.toggle('mobEdit',editing);build();tray();sig=signature();});
setB.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();if(A)return;setB.classList.add('pr');setTimeout(()=>setB.classList.remove('pr'),120);cur=(cur+1)%NSET;try{localStorage.setItem(CKEY(),cur);}catch(_){}edSel=null;build();tray();sig=signature();});

/* aim state */
let A=null;const AIM_MAX=()=>70*L.sc;
function aimWorld(o){const SK=G('SKILLS'),sk=SK[o.k],k=G('K')||.62;let dx=A.dx,dy=A.dy;const len=Math.hypot(dx,dy);
  let wx=dx,wy=dy/k;const wl=Math.hypot(wx,wy)||1;wx/=wl;wy/=wl;const frac=Math.min(1,len/AIM_MAX());
  const R=sk.type==='ground'?(sk.range||300):Math.max(sk.range||0,140);const d=sk.type==='ground'?R*frac:R;
  return {x:player.x+wx*d,y:player.y+wy*d,R,phi:Math.atan2(wy,wx)};}
function overCancel(x,y){const r=cancelEl.getBoundingClientRect();return Math.hypot(x-(r.left+r.width/2),y-(r.top+r.height/2))<44;}
function bindBtn(o){const el=o.el;
  el.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();if(editing){edStart(e,{slot:o.i,k:o.k});return;}if(!o.k||A)return;el.classList.add('pr');try{el.setPointerCapture(e.pointerId);}catch(_){}
    A={o,id:e.pointerId,x0:e.clientX,y0:e.clientY,dx:0,dy:0,moved:false,cancel:false};});
  el.addEventListener('pointermove',e=>{if(!A||A.id!==e.pointerId)return;A.dx=e.clientX-A.x0;A.dy=e.clientY-A.y0;
    if(!A.moved&&Math.hypot(A.dx,A.dy)>14){const sk=G('SKILLS')[o.k];if(sk.type!=='self'){A.moved=true;cancelEl.classList.add('show');}}
    if(A.moved){A.cancel=overCancel(e.clientX,e.clientY);cancelEl.classList.toggle('hot',A.cancel);}});
  const end=e=>{if(!A||A.id!==e.pointerId)return;el.classList.remove('pr');cancelEl.classList.remove('show','hot');const a=A;A=null;
    if(e.type==='pointercancel'||a.cancel)return;try{fire(o.k,a.moved?aimWorldFrom(o,a):null);}catch(err){console.warn(err);}};
  el.addEventListener('pointerup',end);el.addEventListener('pointercancel',end);}
function aimWorldFrom(o,a){const keep=A;A=a;const r=aimWorld(o);A=keep;return r;}
function canDirect(k){const sk=G('SKILLS')[k],LV=G('LV');return LV[k]&&!(player.ccT>0)&&!busy()&&!(player.cd[k]>0)&&player.mp>=(sk.mp||0)&&!(player.combo&&player.combo.parent===k&&LV[sk.follow]>0);}
function fire(k,aim){const sk=G('SKILLS')[k];
  if(aim&&canDirect(k)){
    if(sk.type==='ground'){player.pending={key:k,gx:aim.x,gy:aim.y};player.attackTarget=null;player.moveT=null;if(player.action&&player.action.ended)endAction();return;}
    if(sk.type==='self'){useSkill(k);return;}
    const t=nearestEnemy(aim.x,aim.y,140)||nearestEnemy(player.x,player.y,aim.R+40,aim.phi);if(t&&window.TL)TL.set(t,{sync:1});
    if(sk.type==='melee'&&t){player.attackTarget=null;mouse.wx=t.x;mouse.wy=t.y;useSkill(k);return;}
    endAction();player.pending=null;player.attackTarget=null;castSkill(k,{target:t||null,phi:t?Math.atan2(t.y-player.y,t.x-player.x):aim.phi,gx:aim.x,gy:aim.y});return;}
  /* tap (or aim while busy → queued like the PC hotbar) */
  useSkill(k);
  if(G('targeting')&&G('targeting').key===k){   // ground skill: land it on the target / nearest enemy, else in front
    const R=sk.range||300;let t=(player.attackTarget&&!player.attackTarget.dead)?player.attackTarget:(window.TL&&TL.near(R+60+120))||nearestEnemy(player.x,player.y,R+60);
    let gx,gy;if(aim){gx=aim.x;gy=aim.y;}else if(t){gx=t.x;gy=t.y;}else{const ph=player.phi||0;gx=player.x+Math.cos(ph)*R*.5;gy=player.y+Math.sin(ph)*R*.5;}
    groundClick(gx,gy);}}

/* cooldown sweep, SP, combo — every frame */
const g=aimCv.getContext('2d');
function wheelTick(){requestAnimationFrame(wheelTick);if(!document.body.classList.contains('mob'))return;
  const s2=signature();if(s2!==sig){sig=s2;build();}
  const SK=G('SKILLS'),LV=G('LV');if(!SK)return;
  for(const o of btns){if(!o.k)continue;const sk=SK[o.k],cd=player.cd[o.k]||0;
    o.sw.style.background=cd>0&&sk.cd?`conic-gradient(rgba(10,6,4,.7) ${cd/sk.cd*360}deg,transparent 0)`:'';
    o.t.textContent=cd>0?cd.toFixed(cd<1?1:0):'';o.el.classList.toggle('nomp',player.mp<(sk.mp||0)||!LV[o.k]);
    o.el.classList.toggle('cb',!!(player.combo&&player.combo.parent===o.k&&LV[sk.follow]>0));}
  /* aim overlay — shown from the moment a skill button is pressed (RoV): the skill's real hit area from skill_shapes.js */
  const dpr=devicePixelRatio||1,w=innerWidth,h=innerHeight;if(aimCv.width!==w*dpr||aimCv.height!==h*dpr){aimCv.width=w*dpr;aimCv.height=h*dpr;}
  g.setTransform(dpr,0,0,dpr,0,0);g.clearRect(0,0,w,h);if(!A||editing)return;
  const Zs=G('Z'),oxs=G('ox'),oys=G('oy'),k=G('K')||.62;if(Zs==null)return;const S=(x,y)=>[oxs+x*Zs,oys+y*k*Zs];
  drawAim(g,S,Zs,k);}
/* where the skill will go: dragged → the drag direction; just pressed → the auto target (like a tap cast) */
function aimNow(o){const sk=G('SKILLS')[o.k];if(A&&A.moved)return aimWorld(o);
  const R=sk.type==='ground'?(sk.range||300):Math.max(sk.range||0,140);
  const t=(player.attackTarget&&!player.attackTarget.dead)?player.attackTarget:(window.TL&&TL.forSkill(sk))||nearestEnemy(player.x,player.y,Math.max(240,R+60));
  const phi=t?Math.atan2(t.y-player.y,t.x-player.x):(player.phi||0);
  if(sk.type==='ground'){const d=t?Math.min(R,Math.hypot(t.x-player.x,t.y-player.y)):R*.5;return {x:player.x+Math.cos(phi)*d,y:player.y+Math.sin(phi)*d,R,phi,t};}
  return {x:player.x+Math.cos(phi)*R,y:player.y+Math.sin(phi)*R,R,phi,t};}
function shapeOf(k){const T=window.SKILL_SHAPES&&SKILL_SHAPES[G('CHAR')];return (T&&T[k])||null;}
function drawAim(g,S,Zs,k){const SK=G('SKILLS'),key=A.o.k,sk=SK[key];if(!sk)return;const a=aimNow(A.o),sh=shapeOf(key)||{k:sk.type==='ground'?'aim':sk.type==='self'?'none':'arrow'};
  const col=A.cancel?'255,90,80':'120,210,255',[px,py]=S(player.x,player.y);
  const poly=pts=>{g.beginPath();pts.forEach(([x,y],i)=>{const [sx,sy]=S(x,y);i?g.lineTo(sx,sy):g.moveTo(sx,sy);});g.closePath();};
  const area=()=>{g.fillStyle=`rgba(${col},.28)`;g.strokeStyle=`rgba(${col},.95)`;g.lineWidth=2.5;g.fill();g.stroke();};
  const ring=(x,y,r,a1)=>{const [sx,sy]=S(x,y);g.beginPath();g.ellipse(sx,sy,r*Zs,r*Zs*k,0,0,7);if(a1){g.fillStyle=`rgba(${col},${a1})`;g.fill();}};
  g.save();
  if(sh.k!=='self'&&sh.k!=='none'){ring(player.x,player.y,a.R,.06);g.strokeStyle=`rgba(${col},.45)`;g.lineWidth=1.5;g.setLineDash([6,5]);g.stroke();g.setLineDash([]);}   // reach
  const X=player.x,Y=player.y,c=Math.cos(a.phi),s2=Math.sin(a.phi);
  if(sh.k==='cone'){const n=18,pts=[[X,Y]];for(let i=0;i<=n;i++){const t=a.phi-sh.h+2*sh.h*i/n;pts.push([X+Math.cos(t)*sh.r,Y+Math.sin(t)*sh.r]);}poly(pts);area();}
  else if(sh.k==='line'){const L=sh.len,W2=sh.w/2;poly([[X-s2*W2,Y+c*W2],[X+c*L-s2*W2,Y+s2*L+c*W2],[X+c*L+s2*W2,Y+s2*L-c*W2],[X+s2*W2,Y-c*W2]]);area();
    const [ex,ey]=S(X+c*L,Y+s2*L);g.fillStyle=`rgba(${col},.95)`;g.beginPath();g.arc(ex,ey,4,0,7);g.fill();}
  else if(sh.k==='self'){ring(X,Y,sh.r,.24);g.strokeStyle=`rgba(${col},.95)`;g.lineWidth=2.5;g.stroke();}
  else if(sh.k==='aim'){const r=typeof sk.radius==='function'?sk.radius():80;const [ax,ay]=S(a.x,a.y);g.strokeStyle=`rgba(${col},.6)`;g.lineWidth=1.5;g.beginPath();g.moveTo(px,py);g.lineTo(ax,ay);g.stroke();ring(a.x,a.y,r,.28);g.strokeStyle=`rgba(${col},.95)`;g.lineWidth=2.5;g.stroke();}
  else if(sh.k==='target'){const t=(A.moved?(nearestEnemy(a.x,a.y,140)||nearestEnemy(X,Y,a.R+40,a.phi)):a.t);
    if(t&&!t.dead){const [tx,ty]=S(t.x,t.y);g.strokeStyle=`rgba(${col},.7)`;g.lineWidth=2;g.setLineDash([5,4]);g.beginPath();g.moveTo(px,py);g.lineTo(tx,ty);g.stroke();g.setLineDash([]);
      ring(t.x,t.y,(t.r||20)+10,.3);g.strokeStyle=`rgba(${col},1)`;g.lineWidth=3;g.stroke();g.lineWidth=2;for(let q=0;q<4;q++){const an=q*Math.PI/2+gameTime*2;const r1=((t.r||20)+16)*Zs;g.beginPath();g.moveTo(tx+Math.cos(an)*r1,ty+Math.sin(an)*r1*k);g.lineTo(tx+Math.cos(an)*(r1+8),ty+Math.sin(an)*(r1+8)*k);g.stroke();}}
    else{const [ax,ay]=S(a.x,a.y);g.strokeStyle=`rgba(${col},.8)`;g.lineWidth=2;g.beginPath();g.moveTo(px,py);g.lineTo(ax,ay);g.stroke();}}
  else if(sh.k==='none'){ring(X,Y,46,.18);g.strokeStyle=`rgba(${col},.8)`;g.lineWidth=2;g.stroke();}   // buff / heal on the hero
  else{const [ax,ay]=S(a.x,a.y),ang=Math.atan2(ay-py,ax-px),wd=16*Zs,L2=Math.hypot(ax-px,ay-py);g.translate(px,py);g.rotate(ang);
    g.fillStyle=`rgba(${col},.35)`;g.strokeStyle=`rgba(${col},.95)`;g.lineWidth=2;g.beginPath();g.moveTo(0,-wd/2);g.lineTo(L2-wd*1.4,-wd/2);g.lineTo(L2-wd*1.4,-wd*1.2);g.lineTo(L2,0);g.lineTo(L2-wd*1.4,wd*1.2);g.lineTo(L2-wd*1.4,wd/2);g.lineTo(0,wd/2);g.closePath();g.fill();g.stroke();}
  g.restore();}
requestAnimationFrame(wheelTick);
addEventListener('resize',()=>{if(btns.length||document.body.classList.contains('mob'))layout();});
document.getElementById('mobChat').addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();const c=document.getElementById('chat');if(!c)return;
  if(matchMedia('(max-width:640px)').matches)c.classList.toggle('mob');else c.style.display=c.style.display==='none'?'':'none';});

/* ---------------- pinch zoom on the game canvas ---------------- */
const cv=document.getElementById('c');const pts=new Map();let pinch0=0,zoom0=1;
if(cv){
  cv.addEventListener('pointerdown',e=>{if(e.pointerType!=='touch')return;pts.set(e.pointerId,[e.clientX,e.clientY]);if(pts.size===2){const [a,b]=[...pts.values()];pinch0=Math.hypot(a[0]-b[0],a[1]-b[1]);try{zoom0=mapZoom;}catch(_){}}},true);
  cv.addEventListener('pointermove',e=>{if(!pts.has(e.pointerId))return;pts.set(e.pointerId,[e.clientX,e.clientY]);
    if(pts.size===2&&pinch0>0){const [a,b]=[...pts.values()];const d=Math.hypot(a[0]-b[0],a[1]-b[1]);try{if(curMap)mapZoom=Math.max(.7,Math.min(1.6,zoom0*d/pinch0));}catch(_){}}});
  const up=e=>{pts.delete(e.pointerId);if(pts.size<2)pinch0=0;};
  cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
}

/* ---------------- long-press = right click · double-tap = double click ---------------- */
let lp=null,lastTap={t:0,el:null},synthDbl=0,suppressClick=0;
document.addEventListener('pointerdown',e=>{
  if(!document.body.classList.contains('mob')||e.pointerType!=='touch')return;
  if(e.target===cv||e.target.closest('#mobUI'))return;
  const el=e.target;const x=e.clientX,y=e.clientY;
  clearTimeout(lp&&lp.t);
  lp={el,x,y,t:setTimeout(()=>{suppressClick=Date.now();
    el.dispatchEvent(new MouseEvent('contextmenu',{bubbles:true,cancelable:true,clientX:x,clientY:y,button:2}));
    if(navigator.vibrate)try{navigator.vibrate(15);}catch(_){} },520)};
},true);
document.addEventListener('pointermove',e=>{if(lp&&Math.hypot(e.clientX-lp.x,e.clientY-lp.y)>10){clearTimeout(lp.t);lp=null;}},true);
document.addEventListener('pointerup',e=>{
  if(lp){clearTimeout(lp.t);}
  if(!document.body.classList.contains('mob')||e.pointerType!=='touch'||!lp)return;
  const el=lp.el;lp=null;const now=Date.now();
  if(lastTap.el===el&&now-lastTap.t<330){synthDbl=now;lastTap={t:0,el:null};
    el.dispatchEvent(new MouseEvent('dblclick',{bubbles:true,cancelable:true,clientX:e.clientX,clientY:e.clientY}));}
  else lastTap={t:now,el};
},true);
document.addEventListener('pointercancel',()=>{if(lp){clearTimeout(lp.t);lp=null;}},true);
document.addEventListener('dblclick',e=>{if(e.isTrusted&&Date.now()-synthDbl<500){e.stopPropagation();e.preventDefault();}},true);
document.addEventListener('click',e=>{if(Date.now()-suppressClick<400){e.stopPropagation();e.preventDefault();}},true);

/* ---------------- settings toggle ---------------- */
function addSetting(){const p=document.getElementById('panel');if(!p||document.getElementById('mobSet'))return;
  const h=document.createElement('h3');h.textContent='MOBILE MODE · โหมดมือถือ';
  const s=document.createElement('div');s.className='seg';s.id='mobSet';
  s.innerHTML='<button data-m="auto">อัตโนมัติ</button><button data-m="on">เปิด</button><button data-m="off">ปิด</button>';
  p.insertBefore(s,p.firstChild);p.insertBefore(h,s);
  const sync=()=>s.querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.m===pref()));
  s.querySelectorAll('button').forEach(b=>b.onclick=e=>{e.stopPropagation();setPref(b.dataset.m);apply();sync();});sync();
  const mk=(title,key,opts,def)=>{const h2=document.createElement('h3');h2.textContent=title;const g2=document.createElement('div');g2.className='seg';
    g2.innerHTML=opts.map(([v,t])=>`<button data-v="${v}">${t}</button>`).join('');const at=s.nextSibling;p.insertBefore(h2,at);p.insertBefore(g2,at);
    const sy=()=>g2.querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.v===(localStorage.getItem(key)||def)));
    g2.querySelectorAll('button').forEach(b=>b.onclick=e=>{e.stopPropagation();try{localStorage.setItem(key,b.dataset.v);}catch(_){}sy();try{layout();}catch(_){}});sy();return g2;};
  const g3=mk('MOBILE · ความโปร่งใสปุ่ม','af_mob_op',[['1','100%'],['0.8','80%'],['0.6','60%']],'1');
  mk('MOBILE · ขนาดปุ่ม','af_mob_sz',[['s','เล็ก'],['m','กลาง'],['l','ใหญ่']],'m');}

/* ---------------- enable / disable ---------------- */
function apply(){const on=wanted();document.body.classList.toggle('mob',on);
  if(on){const c=document.getElementById('chat');if(c&&!c.dataset.mobInit){c.dataset.mobInit=1;if(!matchMedia('(max-width:640px)').matches)c.style.display='none';}
    const r=document.getElementById('mobRot');if(r&&matchMedia('(orientation:portrait)').matches&&!sessionStorage.getItem('mobRot')){r.classList.add('show');sessionStorage.setItem('mobRot',1);setTimeout(()=>{r.style.opacity=0;setTimeout(()=>r.classList.remove('show'),700);},2600);}
    try{if(typeof buildHotbar==='function')buildHotbar();}catch(e){}sig='';}
  setTimeout(()=>dispatchEvent(new Event('resize')),50);}
window.mobileMode={apply,set:v=>{setPref(v);apply();},get:pref};
/* ---------------- main menu icons → medallion art ---------------- */
const MENU_ART={statb:'menu_status',skb:'menu_skill',itb:'menu_item',eqb:'menu_equip',mgmap:'menu_map',mgchat:'menu_chat',mgslow:'menu_slow',mggear:'menu_settings'};
function menuArt(){const g=document.getElementById('mgrid');if(!g)return;g.classList.add('mi');
  g.querySelectorAll('button[data-m]').forEach(b=>{const f=MENU_ART[b.dataset.m];if(!f)return;const sv=b.querySelector('svg');
    if(sv){const im=new Image();im.src=UI+f+'.webp';im.alt='';im.draggable=false;sv.replaceWith(im);}});}
menuArt();
addSetting();apply();
addEventListener('orientationchange',()=>setTimeout(()=>dispatchEvent(new Event('resize')),200));
})();
