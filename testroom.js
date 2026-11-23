/* =====================================================================
   TOTEM LEGEND — skill test room (owner 2026-11-19: "a room to test every skill, with dummies: one target and a full room")
   testroom.html → index.html?char=<hero>&testroom=1
   Empty arena (enterMap(null)), test mode (every skill max level), HP / SP refilled, cooldowns off (toggle),
   training dummies that never move or hit back: 1 dummy · boss dummy · full room (10).
   ===================================================================== */
(function(){
if(!/[?&]testroom=1/.test(location.search))return;
window.__GEMS_ALL=1;   /* every Class C skill on (normally they need a socketed Totem Gem) */
const HEROES=[['wolf','หมาป่า'],['dragon','มังกร'],['kitsune','คิตสึเนะ'],['anubis','อานูบิส'],['raven','อีกา'],['wukong','ลิงหิมะ'],['lion','สิงโต'],['cat','แมว'],['hippo','ฮิปโป'],['croc','จระเข้'],['jaguar','จากัวร์'],['owl','นกฮูก'],['rhino','แรด'],['bastet','บาสเตท'],['axolotl','แอกโซลอเติล'],['sheep','แกะ']];
let mode='one',noCd=true,dummies=[],dmg=[],el=null;
function layout(m){mode=m;try{enemies.length=0;}catch(e){return;}dummies=[];
  const P=[];if(m==='one')P.push([150,0,false]);else if(m==='boss')P.push([170,0,true]);
  else{for(let i=0;i<10;i++){const a=i/10*Math.PI*2,r=i%2?230:150;P.push([Math.cos(a)*r,Math.sin(a)*r*.8,false]);}}
  for(const [x,y,b] of P){const e=spawnEnemy(player.x+x,player.y+y,b,'snowwolf');if(b){e.sc*=1.7;e.r=Math.round(e.r*1.5);e.boss=true;}e.x=player.x+x;e.y=player.y+y;e.hx=e.x;e.hy=e.y;e.hp=e.maxHp=1e9;e._dummy=1;dummies.push(e);}
  render();}
function tick(){try{
  player.hp=player.maxHp;player.mp=player.maxMp;player.iframes=Math.max(player.iframes||0,.3);if(noCd)player.cd={};
  for(let i=enemies.length-1;i>=0;i--)if(!enemies[i]._dummy)enemies.splice(i,1);
  for(const e of dummies){if(e.dead){e.dead=false;e.deadT=0;}if(e.hp<1e9)dmg.push([gameTime,1e9-e.hp]);if(!enemies.includes(e))enemies.push(e);e.hp=e.maxHp=1e9;e.x=e.hx;e.y=e.hy;e.vx=e.vy=0;e.acd=9;e.atk=0;e.aggro=0;}
  const now=gameTime;dmg=dmg.filter(d=>now-d[0]<5);const v=el&&el.querySelector('#trDps');if(v){const sum=dmg.reduce((s,d)=>s+d[1],0);v.textContent='ดาเมจ 5 วิ: '+Math.round(sum).toLocaleString()+' · ต่อวิ: '+Math.round(sum/5).toLocaleString();}
}catch(e){}}
function render(){if(!el)return;const b=(id,t,on)=>`<button data-tr="${id}" class="${on?'on':''}">${t}</button>`;
  el.innerHTML=`<b>🎯 ห้องเทสสกิล</b><select data-tr="hero">${HEROES.map(([k,n])=>`<option value="${k}"${k===CHAR?' selected':''}>${n}</option>`).join('')}</select>`+
  b('one','หุ่น 1 ตัว',mode==='one')+b('boss','หุ่นบอส',mode==='boss')+b('room','หุ่นเต็มห้อง',mode==='room')+b('cd',noCd?'ไม่มีคูลดาวน์ ✓':'มีคูลดาวน์',noCd)+b('slow','🐢 ช้า',typeof timeScale!=='undefined'&&timeScale!==1)+`<span id="trDps"></span>`;}
function boot(){let n=0;const T=setInterval(()=>{n++;const t=document.getElementById('cctest');if(t&&t.offsetParent){t.click();return;}const t2=[...document.querySelectorAll('button')].find(b=>b.offsetParent&&/โหมดทดสอบ/.test(b.textContent)&&b.id!=='cctest');if(t2){t2.click();return;}
  if(typeof player==='undefined'||typeof spawnEnemy!=='function'||n<5)return;clearInterval(T);
  
  setTimeout(()=>{try{for(const k in SKILLS)if(SKILLS[k].max)LV[k]=SKILLS[k].max;if(typeof CSK!=='undefined')for(const k in CSK)LV[k]=Math.max(LV[k]||0,CSK[k].max||1);}catch(_){}
    const st=document.createElement('style');st.textContent='#trbar{position:fixed;top:6px;left:50%;transform:translateX(-50%);z-index:99998;background:rgba(22,16,34,.9);color:#fff;font:12px system-ui,sans-serif;padding:5px 8px;border-radius:10px;border:2px solid #6a52a8;display:flex;gap:5px;align-items:center;flex-wrap:wrap;max-width:96vw}#trbar button{background:#4a3a78;color:#fff;border:1px solid #8a72d8;border-radius:7px;padding:3px 7px;font-size:12px}#trbar button.on{background:#c98a1a;border-color:#ffd36a}#trbar select{background:#2d2344;color:#fff;border:1px solid #6a52a8;border-radius:6px;font-size:12px}#trDps{color:#ffd36a;margin-left:4px}';document.head.appendChild(st);
    el=document.createElement('div');el.id='trbar';document.body.appendChild(el);['pointerdown','pointerup','touchstart','touchend','mousedown','mouseup','click'].forEach(ev=>el.addEventListener(ev,e=>e.stopPropagation()));
    el.addEventListener('click',e=>{const t=e.target.closest('[data-tr]');if(!t||t.tagName==='SELECT')return;const a=t.dataset.tr;
      if(a==='one'||a==='boss'||a==='room')layout(a);else if(a==='cd'){noCd=!noCd;render();}else if(a==='slow'){timeScale=timeScale===1?.25:1;render();}});
    el.addEventListener('change',e=>{if(e.target.dataset.tr==='hero')location.href='index.html?char='+e.target.value+'&map=vikF2&testroom=1';});
    layout('one');setInterval(tick,50);},600);},700);}
addEventListener('load',()=>setTimeout(boot,800));
})();
