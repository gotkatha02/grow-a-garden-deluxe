/* =========================================================
   Aetherfall — "Golden Forge" UI skin (theme: th-gold)
   Uses the generated art in assets/ui (same style as the blacksmith).
   Default theme. Switch in ⚙ → UI THEME (เดิม / A / B / C / Golden Forge).
   Everything is scoped under body.th-gold so the old themes are untouched.
   ========================================================= */
(function(){
'use strict';
const U='assets/ui/';
const u=n=>`url(${U}${n}.webp)`;
const G='body.th-gold';
const STAT=['atk','tal','vit','def','int','agi','cha','lck'];
const EQMAP={top:'eq_head',mid:'eq_face',low:'eq_face',armor:'eq_armor',rhand:'eq_weapon',lhand:'eq_shield',garment:'eq_cape',shoes:'eq_shoes',acc1:'eq_acc1',acc2:'eq_acc2'};

const FRAME=`border:26px solid transparent!important;border-image:${u('win9')} 150 fill / 26px stretch!important;background:none!important;box-shadow:none!important;filter:drop-shadow(0 6px 10px rgba(0,0,0,.45))`;
const FRAME_S=`border:16px solid transparent!important;border-image:${u('win9')} 150 fill / 16px stretch!important;background:none!important;box-shadow:none!important`;
const INK='#4a2a16';

const css=`
/* ---------- fonts / colours ---------- */
${G} .ro,${G} #kfdlg,${G} #panel{color:${INK}}

/* ---------- windows (.ro) ---------- */
${G} .ro{${FRAME};border-radius:0!important;padding:0!important;font:600 12px/1.45 Mali,Sarabun,sans-serif!important}
${G} .ro .tb{position:static!important;display:block;width:fit-content;min-width:150px;max-width:calc(100% - 50px);box-sizing:border-box;height:42px!important;line-height:36px!important;margin:-16px auto 4px!important;padding:5px 46px 0!important;border:0!important;border-radius:0!important;
  background:${u('win_ribbon')} center/100% 100% no-repeat!important;text-align:center;color:#fff6dc!important;
  font:800 14px/36px Mali,Sarabun,sans-serif!important;text-shadow:0 1px 0 #5a1a10,0 0 3px #5a1a10,0 2px 2px rgba(0,0,0,.4);overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
${G} .ro .tb:before,${G} .ro .tb:after{display:none!important}
${G} .ro .tb .x,${G} #skw .x{position:absolute!important;right:-14px!important;top:-14px!important;z-index:5;width:34px!important;height:34px!important;border:0!important;padding:0!important;
  background:${u('win_close')} center/contain no-repeat!important;color:transparent!important;font-size:0!important;box-shadow:none!important;border-radius:0!important;cursor:pointer}
${G} .ro .tb .x:hover,${G} #skw .x:hover{filter:brightness(1.15)}
${G} .ro .bd{background:none!important;padding:4px 6px!important;border:0!important}
${G} .ro .ft{background:none!important;border:0!important;border-top:0!important;border-radius:0!important;color:${INK}!important;padding:8px 6px 0!important;position:relative;font-weight:700}
${G} .ro .ft:before{content:'';position:absolute;left:0;right:0;top:-2px;height:14px;background:${u('win_divider')} center/auto 100% no-repeat;opacity:.9}

/* buttons */
${G} .rob{height:26px!important;line-height:22px!important;padding:0 12px!important;border:0!important;border-radius:0!important;box-shadow:none!important;
  border-style:solid!important;border-width:0 11px!important;border-image:${u('btn_gold')} 0 46 fill / 0 11px stretch!important;background:none!important;
  color:#5a2a08!important;font:800 11.5px/26px Mali,Sarabun,sans-serif!important;text-shadow:0 1px 0 rgba(255,255,255,.55)}
${G} .rob:hover{filter:brightness(1.08)}
${G} .rob:active{transform:translateY(1px)}
${G} .rob:disabled{filter:grayscale(.8) brightness(.95);opacity:.75}

/* tabs */
${G} .ro-tabs,${G} .ix-tabs{gap:4px!important;margin-bottom:6px!important}
${G} .ro-tabs button,${G} .ix-tabs button,${G} #hotbar .tabs button,${G} #skw .tt-ch button{border:0!important;border-radius:0!important;box-shadow:none!important;
  background:${u('win_tab')} center/100% 100% no-repeat!important;color:#5a3418!important;font:800 11.5px Mali,Sarabun,sans-serif!important;min-width:64px;height:28px!important;padding:2px 12px 0!important}
${G} .ro-tabs button.on,${G} .ix-tabs button.on,${G} #hotbar .tabs button.on,${G} #skw .tt-ch button.on{background-image:${u('win_tab_on')}!important;color:#5a1a00!important;text-shadow:0 1px 0 #fff3b0}

/* ---------- ITEM grid ---------- */
${G} .ro-grid{gap:4px!important;background:none!important;border:0!important}
${G} .ro-grid .c{background:${u('inv_slot_common')} center/100% 100% no-repeat!important;border:0!important;border-radius:0!important;box-shadow:none!important;padding:5px!important;position:relative}
${G} .ro-grid .c:not([data-id]){filter:saturate(.4) brightness(.92);opacity:.85}
${G} .ro-grid .c[data-id]:hover{filter:drop-shadow(0 0 4px #ffd257) brightness(1.08)}
${G} .ro-grid .c em{color:#fff!important;text-shadow:0 0 2px #000,0 0 2px #000}

/* ---------- EQUIP ---------- */
${G} .ro-eq .sl{background:rgba(255,248,226,.55)!important;border:2px solid #c99a4a!important;border-radius:10px!important;box-shadow:inset 0 1px 0 #fff!important}
${G} .ro-eq .sl:hover{border-color:#f2b84a!important;background:rgba(255,240,200,.9)!important}
${G} .ro-eq .sl .ic{background:${u('inv_slot_common')} center/100% 100% no-repeat!important;border:0!important;border-radius:0!important;padding:4px;box-sizing:border-box}
${Object.entries(EQMAP).map(([k,f])=>`${G} .ro-eq .sl.empty[data-sl="${k}"] .ic{background-image:${u(f)}!important;padding:0}`).join('\n')}
${G} .ro-eq .pv{background:none!important;border:0!important}   /* owner 2026-11-19: no pedestal under the hero */
${G} .ro-eq .pv canvas{background:none!important}
${G} #eqrl,${G} #eqrr{width:40px!important;height:32px!important;border:0!important;border-image:none!important;background:${u('eq_rot_l')} center/contain no-repeat!important;color:transparent!important;font-size:0!important;padding:0!important}
${G} #eqrr{background-image:${u('eq_rot_r')}!important}

/* ---------- STATUS ---------- */
${G} .ro-st .r{background:rgba(255,248,226,.6)!important;border:2px solid #c99a4a!important;border-radius:10px!important}
${G} .ro-st .r b{display:flex;align-items:center;gap:3px;color:#6a2a10!important;width:50px!important}
${G} .ro-st .r b:before{content:'';flex:none;width:22px;height:22px;background:center/contain no-repeat}
${STAT.map(k=>`${G} .ro-st .r:has([data-s="${k}"]) b:before{background-image:${u('stat_'+k)}}`).join('\n')}
${G} .ro-st .r .up,${G} .ro-st .r .dn{width:22px!important;height:22px!important;border:0!important;border-radius:50%!important;box-shadow:none!important;padding:0!important;
  background:${u('win_plus')} center/contain no-repeat!important;color:transparent!important;font-size:0!important}
${G} .ro-st .r .up:after{display:none!important}
${G} .ro-st .r .dn{background-image:${u('win_minus')}!important;margin-right:3px}
${G} .ro-st .k{background:rgba(255,248,226,.6)!important;border:2px solid #c99a4a!important;border-radius:10px!important}
${G} .ro-st .k span{color:#6a2a10!important}
${G} .ro-st .k.sp{background:linear-gradient(#fff3c4,#ffd97a)!important;border-color:#e2a12a!important}
${G} .ro-x{background:rgba(255,248,226,.6)!important;border:2px solid #c99a4a!important;border-radius:10px!important;color:${INK}!important}

/* ---------- HUD: portrait + bars ---------- */
${G} #top .pf{background:none!important;border:0!important;box-shadow:none!important;overflow:visible!important}
${G} #top .pf:after{content:'';position:absolute;left:-17%;top:-14%;width:134%;height:141%;background:${u('hud_portrait')} center/contain no-repeat;pointer-events:none;z-index:2}
${G} #top .pf canvas{border-radius:50%!important;border:0!important;box-shadow:none!important}
${G} #top .lvb{z-index:3!important;background:linear-gradient(#ffe27a,#e8a428)!important;border:2px solid #5a2a10!important;color:#4a1a00!important;text-shadow:0 1px 0 #fff4c0!important;box-shadow:0 2px 0 #5a2a10!important}
${G} #top .info{${FRAME_S};border-radius:0!important;filter:drop-shadow(0 4px 6px rgba(0,0,0,.35))}
${G} #top .nm b{color:#5a2a10!important}
${G} #top .nm .cls{background:linear-gradient(#ffe9a8,#f2c060)!important;border:2px solid #8a4a14!important;color:#5a2a08!important}
${G} #top .gb em{color:#fff!important;background:linear-gradient(#8a3a1a,#5a1e0c)!important;border:2px solid #e9b44c!important;border-radius:8px!important;text-shadow:0 1px 0 #2a0800}
${G} #top .gb .tr{background:linear-gradient(#3a1810,#5a2a1c)!important;border:2px solid #e9b44c!important;box-shadow:0 0 0 2px #4a2010,inset 0 2px 3px rgba(0,0,0,.5)!important;border-radius:20px!important;overflow:hidden}
${G} #hpb{background:${u('hud_hp_fill')} left center/auto 100% repeat-x!important;background-size:100% 100%!important;border-radius:20px!important;box-shadow:none!important}
${G} #mpb{background:${u('hud_mp_fill')} left center/100% 100% no-repeat!important;border-radius:20px!important;box-shadow:none!important}
${G} #expb{background:${u('hud_exp_fill')} left center/100% 100% no-repeat!important;border-radius:20px!important;box-shadow:none!important}
${G} #top .gb .tr b{color:#fff!important;text-shadow:0 1px 0 #000,0 0 3px #000!important}

/* ---------- minimap ---------- */
${G} #mm .mmf{${FRAME_S};border-radius:0!important}
${G} #mm canvas{border-radius:6px!important}
${G} #mm .rib{background:${u('win_ribbon')} center/100% 100% no-repeat!important;border:0!important;box-shadow:none!important;color:#fff6dc!important;padding:7px 26px 10px!important;white-space:nowrap;font-size:11px!important;max-width:none!important;text-shadow:0 1px 0 #5a1a10,0 0 3px #5a1a10}
${G} #mm .zb{border:0!important;background:${u('hud_zoom_in')} center/contain no-repeat!important;color:transparent!important;box-shadow:none!important;width:30px!important;height:30px!important}
${G} #mm #mmout{background-image:${u('hud_zoom_out')}!important}
${G} #mm .crd{color:#fff3d0!important;text-shadow:0 1px 0 #3a1a08,0 0 3px #3a1a08!important}

/* ---------- hotbar / exp / auto ---------- */
${G} .hbt{background:linear-gradient(#3a1e14,#24120c)!important;border:0!important;border-radius:8px!important;box-shadow:none!important;position:relative;overflow:visible!important}
${G} .hbt:after{content:'';position:absolute;inset:-4px;background:${u('hud_buff')} center/100% 100% no-repeat;pointer-events:none;z-index:3}
${G} .hbt.empty{opacity:.6}
${G} .hbt .k{z-index:4!important;background:#5a2a1c!important;color:#ffe9a8!important;border:1.5px solid #e9b44c!important}
${G} #autob{border:0!important;box-shadow:none!important;background:${u('hud_auto_off')} center/contain no-repeat!important;width:70px!important;height:70px!important;
  color:#fff3c8!important;font:900 12px Cinzel,serif!important;padding-top:58px!important;text-shadow:0 1px 0 #3a1f14,0 0 3px #3a1f14;border-radius:50%!important}
${G} #autob.on{background-image:${u('hud_auto_on')}!important}
${G} #autob .kb{top:-2px!important;left:-2px!important}

/* chat + hotbar container keep the original frosted-glass look (owner's choice) */

/* ---------- settings panel ---------- */
${G} #panel{${FRAME};border-radius:0!important;z-index:45!important;color:${INK}!important}
${G} #panel *{border-color:#c99a4a}
${G} #panel small,${G} #panel .sub,${G} #panel span:not(.on){color:#7a4a26!important}
${G} #panel #lvls>div{color:${INK}!important}
${G} #panel h3 #spu{float:none!important;display:block;font-size:10px;color:#ffe6b0!important}
${G} #panel label{color:${INK}!important}
${G} #panel h3{color:#fff6dc!important;background:${u('win_ribbon')} center/100% 100% no-repeat!important;padding:6px 18px 9px!important;text-align:center;text-shadow:0 1px 0 #5a1a10,0 0 3px #5a1a10;border:0!important;font-family:Mali,Sarabun,sans-serif!important}
${G} #panel .seg button{border:0!important;background:${u('win_tab')} center/100% 100% no-repeat!important;color:#5a3418!important;box-shadow:none!important;font-weight:800}
${G} #panel .seg button.on{background-image:${u('win_tab_on')}!important}

/* ---------- skill window ---------- */
${G} #skw{${FRAME};border-radius:0!important}
${G} #skw .tt-top{background:rgba(255,248,226,.7)!important;border:2px solid #c99a4a!important;border-radius:10px!important;color:${INK}!important}
${G} #skw .tt-col{background:rgba(255,248,226,.35)!important;border-radius:12px!important}
${G} #skw .tt-pn{border:2px solid #c99a4a!important;border-radius:12px!important}
${G} #skw .tc{border-radius:10px!important;box-shadow:0 0 0 2px #e9b44c,0 0 0 4px #5a2a10!important}
${G} #skw .tc.ult{box-shadow:0 0 0 2px #ffe27a,0 0 0 4px #5a2a10,0 0 10px 2px #ffd257!important}

/* ---------- NPC dialogs ---------- */
${G} #kfdlg{${FRAME};border-radius:0!important;overflow:visible!important}
${G} #kfdlg .hd{background:${u('win_ribbon')} left center/100% 100% no-repeat!important;color:#fff6dc!important;margin:-12px -10px 4px!important;padding:6px 26px 12px!important;text-shadow:0 1px 0 #5a1a10,0 0 3px #5a1a10}
${G} #kfdlg .hd small{color:#ffe0b8!important}
${G} #kfdlg .hd img{border:3px solid #e9b44c!important;box-shadow:0 0 0 2px #5a2a10!important}
${G} #kfdlg .tx{color:${INK}!important}
${G} #kfdlg .bt button{border:0!important;border-radius:0!important;background:${u('npc_choice')} center/100% 100% no-repeat!important;padding:9px 22px 11px 92px!important;color:#5a3418!important;min-height:38px}
${G} #kfdlg .bt button:hover:not(:disabled){background-image:${u('npc_choice_on')}!important}

/* ---------- level up ---------- */
${G} #lvup .lu-rib{background:${u('sys_levelup')} center/contain no-repeat!important;border:0!important;box-shadow:none!important;width:430px;height:272px;padding:150px 0 0!important;box-sizing:border-box;text-align:center;border-radius:0!important}
${G} #lvup .lu-rib:before,${G} #lvup .lu-rib:after{display:none!important}
${G} #lvup .lu-t{font-size:40px!important}
@media (max-width:640px){${G} #lvup .lu-rib{width:300px;height:190px;padding-top:104px!important}${G} #lvup .lu-t{font-size:28px!important}}

/* ---------- popups (mode picker / death) ---------- */
${G} #deathov .ro{border-image-source:${u('win9')}!important;filter:drop-shadow(0 0 18px rgba(120,40,160,.55))}
${G} #deathov .ro .tb{filter:hue-rotate(250deg) saturate(.8)}

/* ---------- mobile tweaks ---------- */
${G}.mob > .ro .tb .x{right:0!important;top:0!important}
${G}.mob > .ro .tb{margin-top:-4px!important}
${G}.mob #top .info{border-width:12px!important;border-image-width:12px!important}
`;
const st=document.createElement('style');st.id='uiSkinCSS';st.textContent=css;document.head.appendChild(st);

/* ---------- theme button + default ---------- */
const box=document.getElementById('uith');
if(box&&!box.querySelector('[data-t="th-gold"]')){const b=document.createElement('button');b.dataset.t='th-gold';b.textContent='★ Golden Forge';box.insertBefore(b,box.firstChild);}
const orig=window.setTheme;
window.setTheme=function(t){document.body.classList.remove('th-gold');if(typeof orig==='function')orig(t==='th-gold'?'':t);
  if(t==='th-gold'){document.body.classList.add('th-gold');try{localStorage.setItem('af_theme2','th-gold');}catch(e){}}
  document.querySelectorAll('#uith button').forEach(x=>x.classList.toggle('on',x.dataset.t===t));};
if(box)box.querySelectorAll('button').forEach(b=>b.onclick=()=>window.setTheme(b.dataset.t));
let saved=null;try{saved=localStorage.getItem('af_theme2');}catch(e){}
window.setTheme(saved==null||saved==='th-gold'?'th-gold':saved);
})();
