/* =====================================================================
   MAP BOSSES (owner 2026-11-22 18:44: 'decide the 3 questions — players should farm and trade, no item / money inflation').
   Stand-in bosses for the 15 map-boss slots (D1b / H1 / H2 of every land = relics.js SLOT_TIER 'map'), so mutation / support gems,
   boss parts and tier stones have a source in every level band, not only Fenrir — DROP_TABLE_TH.md §11.
   • Body = a painted monster sheet drawn 1.9× (e.spr; the boss's real art / animation comes later), gold ring on the ground,
     a top bar with HP — or the way to it when it is far, or the respawn countdown when it is dead.
   • Kit (one clear question per fight): a slam on the hero's spot every 7 s (4.5 s under half HP) — a red circle fills for 1 s, step out —
     and 2 adds from the map's own monsters at 2/3 and at 1/3 HP (spread vs focus). Pulled > 1,000 px from home while the hero is
     away → back home at full HP (RO leash).
   • Level = top of the map's band (MAP_ZONE). Stats monStats(Lv,'boss') × HP 1.3 (Fenrir: × 2.2).
   • Loot = items.js dropFor → drop_table.js bossLoot(key,'map') (gems, the boss's own part, totem stones, essence, Star Ore, refine stones)
     + the usual boss zeny / drop-set chance. No relic yet (relics.js LIVE = Fenrir only).
   • Respawn (play mode): D1b 15 min · H1 / H2 30 min · Fenrir 60 min (boss_fenrir.js) — test mode 1 / 1 / 5 min.
     The timers are WORLD state: shared by every hero of the save mode and kept over a reload (localStorage af_bossT_<mode>,
     window.BOSS_T — boss_fenrir.js uses it too, so this file loads before it).
   window.MBOSS: info(mapId) for the world map, boss() = the live one, spawn() = spawn now (tests), list.
   ===================================================================== */
(function(){
const PLAY=(()=>{try{return JSON.parse(localStorage.getItem('af_prog_v1_'+CHAR)||'{}').mode==='play';}catch(e){return false;}})();
/* ---- shared boss timers (world state) ---- */
const SK='af_bossT_'+(PLAY?'play':'test');
const BT=(()=>{try{return JSON.parse(localStorage.getItem(SK)||'{}')||{};}catch(e){return {};}})();
window.BOSS_T={play:PLAY,get:k=>+BT[k]||0,set:(k,v)=>{BT[k]=v;try{localStorage.setItem(SK,JSON.stringify(BT));}catch(e){}},clear:k=>{delete BT[k];try{localStorage.setItem(SK,JSON.stringify(BT));}catch(e){}}};
if(typeof enemyAI!=='function'||typeof vkMake!=='function'||typeof monStats!=='function')return;

/* map → [relics.js key, monster of that map whose stats / element / race the boss takes, boss name (en), body sprite if not that monster's]
   — Thai names from drop_table.js BOSSES. Bodies: painted sheets where one fits (Giant Bat for Camazotz, Bronze Automaton for the Trojan
   Colossus, Skeleton Soldier for Gashadokuro, Cave Spider for Jorogumo, Black Jaguar for Ahuizotl, Griffin (winged lion) for the Sphinx), else the map monster's own sprite */
const MB={vikD1b:['draugr','Runesmith Revenant','Draugr Forgemaster'],vikH1:['huldra','Forest Witchling','Huldra'],vikH2:['jotun','Young Yeti','Jotun Brute'],
  grkD1b:['polyphemus','Cyclops','Polyphemus'],grkH1:['hecate','Hecate Witch','Hecate'],grkH2:['trojan','Bronze Hoplite','Trojan Colossus','Bronze Automaton'],
  egyD1b:['mummy','Cursed Scribe','Mummy Vizier'],egyH1:['sphinx','Sphinx Cat','Sphinx Guardian','Griffin'],egyH2:['scorpion','Giant Scorpion','Salt Scorpion King'],
  jpnD1b:['tanuki','Shadow Ninja','Jonin Shadow'],jpnH1:['jorogumo','Rokurokubi','Jorogumo','Cave Spider'],jpnH2:['gashadokuro','Ashigaru Ghost','Gashadokuro','Skeleton Soldier'],
  aztD1b:['camazotz','Vampire Bat Pack','Camazotz','Giant Bat'],aztH1:['ahuizotl','Jaguar Warrior','Ahuizotl','Black Jaguar'],aztH2:['eagle','Eagle Warrior','Eagle Warlord']};
const RESP_MIN={D1b:15,H1:30,H2:30};
const HPMUL=1.3,SIZE=1.9,LEASH=1000,SLAM_R=105,SLAM_T=1.0,SLAM_MUL=1.7,SLAM_CD=7,SLAM_CD2=4.5,SEE=300;
const slotOf=id=>(/D1b$/.test(id)?'D1b':/H1$/.test(id)?'H1':'H2');
const respMs=id=>PLAY?RESP_MIN[slotOf(id)]*60e3:60e3;
const thOf=key=>{const b=window.DROPTAB&&DROPTAB.BOSSES[key];return b?b[2]:key;};
const lvOf=id=>{const z=(window.MAP_ZONE||{})[id];return Math.min(60,(z&&z[1])||30);};
let cur=null,bar=null;   /* cur = {map, e} — the live boss on this map */

/* ---------------- pieces ---------------- */
class MbAura{   /* gold ring under the boss */
  constructor(e){this.e=e;this.t=0;this.a=0;this.layer='ground';}
  update(dt){this.t+=dt;const e=this.e,on=!e.dead&&enemies.includes(e);this.a=Math.max(0,Math.min(1,this.a+(on?dt*2:-dt*1.6)));return on||this.a>0;}
  draw(){const e=this.e;if(e.hidden)return;const [x,y]=P(e.x,e.y),R=56+4*Math.sin(this.t*2.4),a=this.a;
    ctx.save();ctx.translate(x,y);ctx.scale(1,K*.92);ctx.globalAlpha=a;
    const g=ctx.createRadialGradient(0,0,R*.15,0,0,R*1.2);g.addColorStop(0,'rgba(255,214,110,.30)');g.addColorStop(.7,'rgba(255,165,40,.13)');g.addColorStop(1,'rgba(255,165,40,0)');
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,R*1.2,0,TAU);ctx.fill();
    ctx.lineWidth=3.2;ctx.strokeStyle='rgba(120,60,10,.55)';ctx.beginPath();ctx.arc(0,0,R+1.5,0,TAU);ctx.stroke();
    ctx.lineWidth=2.4;ctx.strokeStyle='rgba(255,215,110,.9)';ctx.beginPath();ctx.arc(0,0,R,0,TAU);ctx.stroke();
    ctx.setLineDash([9,8]);ctx.lineDashOffset=-this.t*20;ctx.lineWidth=1.8;ctx.strokeStyle='rgba(255,243,200,.75)';ctx.beginPath();ctx.arc(0,0,R*.78,0,TAU);ctx.stroke();ctx.setLineDash([]);
    for(let i=0;i<4;i++){const an=this.t*.7+i*TAU/4;ctx.save();ctx.translate(Math.cos(an)*R,Math.sin(an)*R);ctx.rotate(an);
      ctx.fillStyle='#ffe08a';ctx.strokeStyle='#7a4210';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(0,-6);ctx.lineTo(4.5,0);ctx.lineTo(0,6);ctx.lineTo(-4.5,0);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();}
    ctx.restore();ctx.globalAlpha=1;}}
class MbWarn{   /* slam telegraph: fills until the hit lands */
  constructor(o){Object.assign(this,{t:0,layer:'ground'},o);}
  update(dt){this.t+=dt;return this.t<this.life&&this.e.mbCast===this.c&&!this.e.dead;}
  draw(){const k=Math.min(1,this.t/this.life),[x,y]=P(this.x,this.y),pulse=.75+.25*Math.sin(this.t*18);
    ctx.save();ctx.translate(x,y);ctx.scale(1,K);
    ctx.globalAlpha=.16;ctx.fillStyle='#ff3a2a';ctx.beginPath();ctx.arc(0,0,this.r,0,TAU);ctx.fill();
    ctx.globalAlpha=.34*pulse;ctx.beginPath();ctx.arc(0,0,Math.max(2,this.r*k),0,TAU);ctx.fill();
    ctx.globalAlpha=.9*pulse;ctx.strokeStyle='#ff5a3a';ctx.lineWidth=2.4;ctx.beginPath();ctx.arc(0,0,this.r,0,TAU);ctx.stroke();
    ctx.restore();ctx.globalAlpha=1;}}
class MbShock{   /* the slam lands: a ring of dust rolling out + cracks */
  constructor(o){Object.assign(this,{t:0,life:.45,layer:'ground'},o);this.cr=Array.from({length:7},(_,i)=>({a:i/7*TAU+Math.random()*.5,l:.55+Math.random()*.45}));}
  update(dt){this.t+=dt;return this.t<this.life+.5;}
  draw(){const k=Math.min(1,this.t/this.life),[x,y]=P(this.x,this.y),fade=Math.max(0,1-Math.max(0,this.t-this.life*.4)/(this.life+.1));
    ctx.save();ctx.translate(x,y);ctx.scale(1,K);
    ctx.globalAlpha=fade*.85;ctx.strokeStyle='#5a3a20';ctx.lineWidth=2.6;ctx.lineCap='round';
    for(const c of this.cr){ctx.beginPath();ctx.moveTo(0,0);const L=this.r*c.l*Math.min(1,k*2.2);ctx.lineTo(Math.cos(c.a)*L*.55,Math.sin(c.a)*L*.55+3);ctx.lineTo(Math.cos(c.a+.15)*L,Math.sin(c.a+.15)*L);ctx.stroke();}
    ctx.globalAlpha=(1-k)*.9;ctx.strokeStyle='#ffd8a0';ctx.lineWidth=5*(1-k)+1;ctx.beginPath();ctx.arc(0,0,this.r*(.35+.75*k),0,TAU);ctx.stroke();
    ctx.restore();ctx.globalAlpha=1;}}
function say(e,txt,col){addFx(new DText({x:e.x,y:e.y,z:MSPR_H(e)+36,text:txt,color:col||'#ffd77a',size:17,life:1.4}));}

/* ---------------- spawn ---------------- */
function homeOf(h){const W=h.W||4800,H=h.H||W*.75,cx=W/2,cy=H/2,pm=W2M(player.x,player.y);
  let L=(h.spawns||[]).filter(p=>!h.blocked||!h.blocked(p.x,p.y));
  const far=L.filter(p=>Math.hypot(p.x-pm.x,p.y-pm.y)>420);if(far.length)L=far;
  L=L.slice().sort((a,b)=>Math.hypot(a.x-cx,a.y-cy)-Math.hypot(b.x-cx,b.y-cy)).slice(0,6);
  return L.length?L[Math.floor(Math.random()*L.length)]:{x:cx,y:cy};}
function spawn(id){const d=MB[id],h=mapHosts[id],L=(window.VK_MONS||{})[id]||[],def=L.find(x=>x.name===d[1])||L[0];if(!def||!h)return null;
  const LV=lvOf(id),th=thOf(d[0]);let [x,y]=M2W(homeOf(h));
  const e=vkMake(def,x,y);if(!enemies.includes(e))enemies.push(e);
  const st=monStats(LV,'boss');
  e.m=Object.assign({},vkVar(def,LV),st,{name:d[2],th,boss:1,size:'large',role:'boss'});e.m.hp=Math.round(st.hp*HPMUL);e.maxHp=e.hp=e.m.hp;
  e.vdef=Object.assign({},def,{name:d[2],th,lv:[LV,LV],role:'boss',aggr:1,w:0});e.spr=d[3]||def.name;   /* sprite of the stand-in body (monster-sprites.js def(e)) */
  Object.assign(e,{boss:true,bossKey:d[0],mboss:id,mbDef:def.name,bsc:SIZE,r:30,homeX:x,homeY:y,face:-1,mbCd:2.5,mbAdd:0,mbCast:null,bossName:d[2]});
  {const h0=MSPR_H(e)/SIZE;if(h0<52)e.bsc=Math.min(3.6,96/h0);}   /* small sheets (scorpion, catalog art) still stand ~96 px tall */
  cur={map:id,e};addFx(new MbAura(e));
  if(typeof chatLog==='function')chatLog('sys',`👑 <b style="color:#f0b440">${th}</b> (บอสประจำแมพ Lv ${LV}) ปรากฏตัวแถวกลางแมพ — ดูทางที่แถบด้านบน`);
  return e;}

/* ---------------- AI: the normal monster AI + slam + adds + leash ---------------- */
function startSlam(e){e.mbCast={t:0};e.atk=.5;e.face=player.x>=e.x?1:-1;
  addFx(new MbWarn({x:player.x,y:player.y,r:SLAM_R,life:SLAM_T,e,c:e.mbCast}));e.mbCast.x=player.x;e.mbCast.y=player.y;}
function slamLand(e){const c=e.mbCast;e.mbCast=null;e.atk=0;e._hitT=gameTime;e.acd=1.2;e.mbCd=e.hp<e.maxHp/2?SLAM_CD2:SLAM_CD;
  addFx(new MbShock({x:c.x,y:c.y,r:SLAM_R}));if(typeof dustPuff==='function')dustPuff(c.x,c.y,10,'#c8b49a',90,12);if(typeof shake==='function')shake(3);
  if(player.hp>0&&Math.hypot(player.x-c.x,player.y-c.y)<=SLAM_R+8){const sv=e.m;e.m=Object.assign({},sv,{atk:[sv.atk[0]*SLAM_MUL,sv.atk[1]*SLAM_MUL]});try{hitPlayer(e);}finally{e.m=sv;}}}
function summon(e,n){const L=((window.VK_MONS||{})[e.mboss]||[]).filter(d=>d.name!==e.mbDef&&d.role!=='critter');const pool=L.length?L:((window.VK_MONS||{})[e.mboss]||[]);if(!pool.length)return;
  let k=0;for(let i=0;i<n*3&&k<n;i++){const d=pool[Math.floor(Math.random()*pool.length)],a=Math.random()*TAU,x=e.x+Math.cos(a)*95,y=e.y+Math.sin(a)*65;
    if(typeof mapBlockedW==='function'&&mapBlockedW(x,y))continue;const m=vkMake(d,x,y);if(!enemies.includes(m))enemies.push(m);m.summon=1;m.mbOf=e;m.aggro=8;k++;
    if(typeof dustPuff==='function')dustPuff(x,y,6,'#d8c8a8',60,8);}
  if(k)say(e,'เรียกลูกน้อง!');}
function mbAI(e,dt){const s=e.st,cc=s.frozen||s.stagger||s.stun;
  if(e.mbCast){if(cc){e.mbCast=null;e.atk=0;e.mbCd=2;return true;}e.mbCast.t+=dt;if(e.mbCast.t>=SLAM_T)slamLand(e);return true;}
  const dp=Math.hypot(player.x-e.x,player.y-e.y);
  if(Math.hypot(e.x-e.homeX,e.y-e.homeY)>LEASH&&dp>450){e.x=e.homeX;e.y=e.homeY;e.hp=e.maxHp;e.aggro=0;e.mbAdd=0;e.atk=0;return false;}
  e.mbCd=Math.max(0,(e.mbCd||0)-dt);
  if(e.aggro<=0&&dp<SEE&&player.hp>0)e.aggro=4;
  if(e.aggro>0&&!cc&&player.hp>0){
    const r=e.hp/e.maxHp;if(e.mbAdd<2&&r<(e.mbAdd?1/3:2/3)){e.mbAdd++;summon(e,2);}
    if(e.mbCd<=0&&e.atk<=0&&dp<420){startSlam(e);return true;}}
  return _ai(e,dt);}
const _ai=enemyAI;enemyAI=function(e,dt){return e.mboss?mbAI(e,dt):_ai(e,dt);};
const _fr=fieldRespawn;fieldRespawn=function(e){if(e.mboss||e.mbOf){e.gone=1;return true;}return _fr(e);};
const _upd=updEnemies;updEnemies=function(dt){_upd(dt);
  if(cur&&cur.e.dead&&!cur.e._paid)onDead(cur.e);
  for(let i=enemies.length-1;i>=0;i--){const o=enemies[i];if((o.mboss||o.mbOf)&&o.gone&&o.dead&&o.deadT>3.4)enemies.splice(i,1);}};
function onDead(e){e._paid=1;e.mbCast=null;const id=e.mboss,ms=respMs(id),th=thOf(MB[id][0]);BOSS_T.set(MB[id][0],Date.now()+ms);
  for(const o of enemies)if(o.mbOf===e&&!o.dead){o.hp=0;kill(o);}
  if(typeof shake==='function')shake(4);
  if(typeof chatLog==='function')chatLog('sys',`🏆 ล้ม <b style="color:#f0b440">${th}</b> ได้แล้ว! (เกิดใหม่ใน ${Math.round(ms/60000)} นาที)`);
  if(typeof msg==='function')msg('ล้มบอส '+th+'!');}

/* spawn when the map is ready (after its field monsters); the timer is world state */
function tick(){requestAnimationFrame(tick);
  if(cur&&(curMap!==cur.map||!enemies.includes(cur.e)))cur=null;
  const id=curMap,d=id&&MB[id];
  if(d&&!cur&&!mapFadeDir){const h=mapHosts[id];if(h&&h.ready&&enemies.length&&Date.now()>=BOSS_T.get(d[0]))spawn(id);}
  drawBar(id,d);}

/* ---------------- top bar: HP · the way to the boss · respawn countdown ---------------- */
const ARW=['→','↘','↓','↙','←','↖','↑','↗'];
const mmss=ms=>{const s=Math.max(0,Math.ceil(ms/1000));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0');};
let lastTxt='';
function drawBar(id,d){
  if(!bar){bar=document.createElement('div');bar.id='mbBar';bar.innerHTML='<div class="fn"><b></b><span></span></div><div class="fb"><i></i><em></em></div><div class="fp"></div>';
    const st=document.createElement('style');st.textContent=`#mbBar{position:fixed;left:50%;top:112px;transform:translateX(-50%);width:min(380px,62vw);z-index:12;pointer-events:none;font-family:Mitr,Mali,Sarabun,sans-serif;color:#fff3d6;text-shadow:0 1px 2px #000,0 0 3px #000;display:none}
#mbBar .fn{display:flex;justify-content:space-between;align-items:baseline;gap:8px;font-size:13px;margin-bottom:2px}#mbBar .fn b{font-weight:600}#mbBar .fn span{font-size:11px;color:#ffd77a;white-space:nowrap}
#mbBar .fb{position:relative;height:11px;background:rgba(20,10,4,.8);border:1px solid #c8913a;border-radius:6px;overflow:hidden;box-shadow:0 0 10px rgba(255,180,60,.35)}
#mbBar .fb i{position:absolute;inset:0;width:100%;background:linear-gradient(#ffe08a,#e8962e 60%,#a85a14);transition:width .15s}
#mbBar .fb em{position:absolute;right:6px;top:-1px;font:700 9.5px Mitr,sans-serif;font-style:normal;color:#fff}
#mbBar .fp{font-size:11.5px;color:#ffe9a8;margin-top:2px;text-align:center}
#mbBar.wait .fb{display:none}#mbBar.wait{opacity:.9;width:auto;min-width:220px}#mbBar.wait .fn{justify-content:center;gap:10px}
body.mob #mbBar{top:98px;width:min(250px,38vw)}body.mob #mbBar .fn{font-size:11px}body.mob #mbBar .fn span{display:none}body.mob #mbBar .fb{height:7px}body.mob #mbBar .fb em{display:none}body.mob #mbBar .fp{font-size:10.5px}`;
    document.head.appendChild(st);document.body.appendChild(bar);}
  let show=false,txt='';
  if(d&&!mapFadeDir){
    const e=cur&&cur.map===id&&!cur.e.dead?cur.e:null,th=thOf(d[0]);
    if(e){show=true;const r=e.hp/e.maxHp,dx=e.x-player.x,dy=(e.y-player.y)*K,dist=Math.hypot(dx,dy);
      const far=dist>650?`📍 ห่าง ~${Math.round(dist/60)} ม. ${ARW[((Math.round(Math.atan2(dy,dx)/(Math.PI/4))%8)+8)%8]}`:'';
      txt=`a|${th}|${lvOf(id)}|${(r*100).toFixed(1)}|${far}|${r<.5?1:0}`;
      if(txt!==lastTxt){bar.className='';bar.querySelector('.fn b').textContent=`👑 ${th} · ${d[2]}`;bar.querySelector('.fn span').textContent=`Lv ${lvOf(id)} · บอสประจำแมพ`;
        bar.querySelector('i').style.width=(r*100).toFixed(1)+'%';bar.querySelector('em').textContent=Math.ceil(r*100)+'%';
        bar.querySelector('.fp').textContent=far||(r<.5?'⚠ โกรธ — ทุบถี่ขึ้น (วงแดง = ถอยออก)':'วงแดงใต้เท้า = ถอยออกก่อนมันทุบ');}}
    else{const left=BOSS_T.get(d[0])-Date.now();if(left>0){show=true;txt=`w|${th}|${mmss(left)}`;
      if(txt!==lastTxt){bar.className='wait';bar.querySelector('.fn b').textContent=`👑 ${th} · ${d[2]}`;bar.querySelector('.fn span').textContent='บอสประจำแมพ';
        bar.querySelector('.fp').textContent=`⏳ เกิดใหม่ใน ${mmss(left)}`;}}}}
  /* phone: the target frame already shows the locked boss's HP (and an arrow when it is off screen) — the top of the screen is full there */
  if(show&&cur&&window.TL&&TL.e===cur.e&&document.body.classList.contains('mob'))show=false;
  lastTxt=txt;bar.style.display=show?'block':'none';}

/* ---------------- world map / tests ---------------- */
window.MBOSS={list:MB,play:PLAY,
  get boss(){return cur&&cur.e;},
  spawn(){const id=curMap;if(!MB[id])return null;if(cur&&!cur.e.dead)return cur.e;BOSS_T.clear(MB[id][0]);return null;},   /* clears the timer: the boss comes on the next frame */
  info(id){if(MB[id]){const d=MB[id];return {key:d[0],th:thOf(d[0]),en:d[2],lv:lvOf(id),tier:'บอสประจำแมพ',min:PLAY?RESP_MIN[slotOf(id)]:1,left:Math.max(0,BOSS_T.get(d[0])-Date.now())};}
    if(id==='vikD2c'&&window.AFFenrir)return {key:'fenrir',th:'เฟนเรียร์',en:'Fenrir',lv:AFFenrir.lv||49,tier:'MVP',min:AFFenrir.respMin||60,left:Math.max(0,BOSS_T.get('fenrir')-Date.now())};
    return null;}};
requestAnimationFrame(tick);   /* started last: drawBar needs the constants above */
})();
