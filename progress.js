/* =====================================================================
   AETHERFALL — GAME PROGRESS (single-player). Loaded last.
   • Two modes per hero:  play = real game from Lv1 (saved)  ·  test = Lv 60 (the level cap, level_cap.js), every skill unlocked (the old dev mode)
   • Saves level, EXP, stat points, skill levels, map, position, HP/SP, save point — every 5 s and on leave.
   • Save point: the last town you entered (each start town + the capital). Starts at the hero's home town.
   • Death (play mode): lose 2% EXP of the current level (never de-levels), then return to the save point with 50% HP/SP.
   ===================================================================== */
(function(){
if(typeof PS==='undefined'||!window.AFItems)return;
const KEY='af_prog_v1_'+CHAR,TOWN_MAPS=['frostheim','aztT','grkT','egyT','jpnT','capT'],DEATH_EXP=.02;
const HOME_MAP=(typeof HERO_TOWN!=='undefined'&&HERO_TOWN[CHAR])||'frostheim';
const P={mode:null,save:{map:HOME_MAP},dead:false};
try{Object.assign(P,JSON.parse(localStorage.getItem(KEY)||'{}'));}catch(e){}
const townName=id=>(MAPDEF[id]&&MAPDEF[id].name)||id;

function snapshot(){return {v:1,mode:P.mode,name:P.name||null,lv:PS.lv,exp:player.exp,ps:Object.assign(Object.fromEntries(STATK.map(k=>[k,PS[k]])),{_ro:1}),roll:ROLL||null,skills:{...LV},
  map:curMap||null,x:player.x,y:player.y,hp:player.hp/player.maxHp,mp:player.mp/player.maxMp,save:P.save};}
function save(){if(P.mode!=='play'||P.dead)return;try{localStorage.setItem(KEY,JSON.stringify(snapshot()));}catch(e){}}
function setMode(m,fresh){const o={mode:m,save:{map:HOME_MAP}};if(!fresh&&m==='play'){try{Object.assign(o,JSON.parse(localStorage.getItem(KEY)||'{}'),{mode:m});}catch(e){}}
  if(fresh&&m==='play')localStorage.removeItem('af_items_v1_'+CHAR+'_play');
  localStorage.setItem(KEY,JSON.stringify(o));location.reload();}

/* ---------------- apply the saved state ---------------- */
function startPlay(){testMode=false;if(P.roll)ROLL=typeof rollFrom12==='function'?rollFrom12(P.roll):P.roll;
  if(P.lv){PS.lv=Math.min(P.lv,window.LV_CAP||99);   /* level cap 60 (2026-11-22): an older save above the cap comes back at the cap; fitStats below hands back the extra points */
    /* RO stats (2026-11-22): a save from the 12 Tails stat system comes back with every point refunded (stats at 1) — spend them again under the new rules */
    const ro=P.ps&&P.ps._ro;for(const k of STATK)PS[k]=ro&&P.ps[k]!=null?P.ps[k]:1;if(P.ps&&!ro)setTimeout(()=>chatLog('sys','ระบบสเตตัสเปลี่ยนเป็นแบบ Ragnarok (STR AGI VIT INT DEX LUK) — <b>คืนแต้มทั้งหมดแล้ว</b> เปิด Status (Alt+A) แจกใหม่ได้เลย'),1500);player.exp=P.lv>PS.lv?0:(P.exp||0);for(const k in SKILLS)LV[k]=(P.skills&&P.skills[k])||0;if(!LV[BASIC_KEY])LV[BASIC_KEY]=1;}
  else{PS.lv=1;for(const k of STATK)PS[k]=1;player.exp=0;for(const k in SKILLS)LV[k]=k===BASIC_KEY?1:0;}   // brand-new hero: 48 status points to spend (RO)
  fitStats();if(typeof skValidate==='function')skValidate();applyStats();
  const map=P.map!==undefined?P.map:HOME_MAP;if(map&&MAPDEF[map]&&curMap!==map)enterMap(map);
  if(P.lv&&P.map===curMap&&P.x!=null){player.x=P.x;player.y=P.y;cam.x=player.x;cam.y=player.y;}
  player.hp=Math.max(1,Math.round(player.maxHp*(P.hp??1)));player.mp=Math.round(player.maxMp*(P.mp??1));
  buildLevels();buildHotbar();if(!P.lv){if(!P.roll)setTimeout(()=>openRollWin(r=>{P.roll=r;save();}),400);chatLog('sys',`เริ่มการผจญภัย! ได้ <b>${pointsAt(1)} Status Point</b> — เปิดหน้าต่าง Status (Alt+A) เพื่ออัปสเตตัส · Skill (K) เมื่อได้ Skill Point`);P.lv=1;}
  save();}
/* play mode hides the cheat controls (old settings panel + Skill window "Test" box) */
const _buildLevels=buildLevels;
buildLevels=function(){_buildLevels();if(P.mode==='play'){const t=document.querySelector('#lvls .tm');if(t)t.remove();}};
if(typeof buildSkillWin==='function'){const _bsw=buildSkillWin;
  buildSkillWin=function(){_bsw.apply(this,arguments);if(P.mode!=='play')return;const t=document.querySelector('#skw #sktm');if(t){t.checked=false;(t.closest('label')||t).style.display='none';const n=t.nextSibling;if(n&&n.nodeType===3)n.textContent='';}}};
if(P.mode==='play')startPlay();

/* ---------------- save point = last town entered ---------------- */
const _enterMap=enterMap;
/* with warp NPCs (npcs.js sets AF_KAFRA_SAVE) the save point is chosen at the warp NPC, RO style — entering a town no longer saves */
enterMap=function(id,sp){_enterMap(id,sp);if(P.mode==='play'&&!window.AF_KAFRA_SAVE&&TOWN_MAPS.includes(id)&&P.save.map!==id){P.save={map:id};chatLog('sys',`บันทึกจุดเกิดที่ <b>${townName(id)}</b>`);}save();};

/* ---------------- death ---------------- */
const ov=document.createElement('div');ov.id='deathov';
ov.style.cssText='position:fixed;inset:0;z-index:60;display:none;align-items:center;justify-content:center;background:rgba(20,8,8,.55);backdrop-filter:grayscale(.8)';
ov.innerHTML=`<div class="ro open" style="position:relative;display:block;width:min(360px,92vw);text-align:center"><div class="tb">💀 คุณพ่ายแพ้</div><div class="bd"><p id="deathtxt" style="margin:6px 0 12px"></p><button class="rob" id="deathbtn" style="height:32px;font-size:13px"></button></div></div>`;
document.body.appendChild(ov);ov.addEventListener('pointerdown',e=>e.stopPropagation());
if(P.mode==='play')window.onPlayerDeath=function(e){if(P.dead)return;P.dead=true;
  const lose=Math.min(player.exp,DEATH_EXP);player.exp-=lose;player.hp=1;player.iframes=1e9;player.moveT=null;player.attackTarget=null;autoMode=false;
  for(const o of enemies)o.aggro=0;
  ov.querySelector('#deathtxt').innerHTML=`ถูก <b>${(e&&e.m&&(e.m.th||e.m.name))||'มอนสเตอร์'}</b> สังหาร<br>เสีย EXP <b>${(lose*100).toFixed(2)}%</b> (Lv ไม่ลด)`;
  ov.querySelector('#deathbtn').textContent=`กลับจุดเกิด: ${townName(P.save.map)}`;ov.style.display='flex';chatLog('sys',`<span style="color:#e2574c">พ่ายแพ้</span> — เสีย EXP ${(lose*100).toFixed(2)}%`);};
ov.querySelector('#deathbtn').onclick=()=>{ov.style.display='none';P.dead=false;enterMap(P.save.map||HOME_MAP);
  player.hp=Math.round(player.maxHp*.5);player.mp=Math.round(player.maxMp*.5);player.iframes=2;save();};

/* ---------------- Status window: hide level / preset cheats in play mode, add the mode button ---------------- */
const _buildStatus=buildStatus;
buildStatus=function(){_buildStatus();const w=document.getElementById('stw');if(!w||!w.classList.contains('open'))return;
  if(P.mode==='play')w.querySelectorAll('[data-l],#lutest,[data-p],#fastreg').forEach(b=>{(b.id==='fastreg'?b.parentElement:b).style.display='none';});
  const f=w.querySelector('.ft');if(f&&!f.querySelector('#modebtn')){f.insertAdjacentHTML('beforeend',`<button class="rob" id="modebtn" title="เปลี่ยนโหมด / เริ่มใหม่">⚙ ${P.mode==='play'?'เล่นจริง':'ทดสอบ'}</button>`);f.querySelector('#modebtn').onclick=openModes;}};

/* ---------------- mode picker (first visit, or ⚙ in the Status window) ---------------- */
const md=document.createElement('div');md.style.cssText='position:fixed;inset:0;z-index:61;display:none;align-items:center;justify-content:center;background:rgba(10,14,24,.6)';
document.body.appendChild(md);md.addEventListener('pointerdown',e=>e.stopPropagation());
function openModes(){const hasPlay=(()=>{try{return !!JSON.parse(localStorage.getItem(KEY)||'{}').lv;}catch(e){return false;}})();
  md.innerHTML=`<div class="ro" style="position:relative;display:block;width:min(420px,92vw)"><div class="tb">Totem Legend — เลือกโหมด</div><div class="bd" style="display:flex;flex-direction:column;gap:8px">
    ${hasPlay?`<button class="rob" data-m="continue" style="height:40px;font-size:14px">▶ เล่นต่อ (Lv ${Math.min(JSON.parse(localStorage.getItem(KEY)).lv,window.LV_CAP||99)})</button>`:''}
    <button class="rob" data-m="new" style="height:40px;font-size:14px">🌱 เริ่มเกมใหม่ — Lv 1 ที่เมืองเกิด${hasPlay?' (ลบความคืบหน้าเดิมของฮีโร่นี้)':''}</button>
    <button class="rob" data-m="test" style="height:34px">🧪 โหมดทดสอบ — Lv ${window.LV_CAP||99} ทุกสกิล (ไม่เซฟเลเวล)</button>
    <small style="color:#8a6a4a">เซฟแยกตามฮีโร่ · คลังเก็บของใช้ร่วมกันทุกฮีโร่</small>${P.mode?'<button class="rob" data-m="close">ปิด</button>':''}</div></div>`;
  md.style.display='flex';
  md.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{const m=b.dataset.m;
    if(m==='close'){md.style.display='none';return;}
    if(m==='new'&&hasPlay&&!confirm('ลบความคืบหน้าของฮีโร่นี้แล้วเริ่มใหม่ที่ Lv 1?'))return;
    if(m==='continue'){if(P.mode==='play'){md.style.display='none';return;}setMode('play',false);}
    else if(m==='new'){if(window.openCreate){md.style.display='none';openCreate({closable:true});}else setMode('play',true);}else setMode('test',true);});}
if(!P.mode)openModes();

setInterval(save,5000);addEventListener('beforeunload',save);
window.AFProgress={setMode,get mode(){return P.mode;},get savePoint(){return P.save;},setSave(m){P.save={map:m};save();},townName,save,openModes};
})();
