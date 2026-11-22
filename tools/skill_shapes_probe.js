/* =========================================================================
   SKILL SHAPE PROBE — dev tool, not loaded by the game. Used by tools/skill_shapes.py.
   Casts every active skill once in the empty test arena (enterMap(null)) with the hero at (0,0) facing +x,
   surrounded by rings of frozen dummies, and records which dummies lost HP. tools/skill_shapes.py fits a
   shape to those points and writes skill_shapes.js (the mobile aim indicator draws it).
   ========================================================================= */
async function probeSkillShapes(opts={}){
  const SIM=opts.sim||3,DT=1/60,TGT={x:70,y:0},GND={x:220,y:0};
  const follows=new Set(Object.values(SKILLS).map(s=>s.follow).filter(Boolean));
  const keys=Object.keys(SKILLS).filter(k=>{const s=SKILLS[k];return s.make&&!s.passive&&LV[k]>0&&!follows.has(k);});
  const pts=[[TGT.x,TGT.y],[GND.x,GND.y]];
  for(let r=20;r<=520;r+=20)for(let a=0;a<360;a+=(r<120?20:r<300?10:6)){const t=a*Math.PI/180;pts.push([Math.round(r*Math.cos(t)),Math.round(r*Math.sin(t))]);}
  const ENS=Object.keys(window).filter(n=>/Ensure$/.test(n)&&typeof window[n]==='function');
  timeScale=0;const out={};const base=fx.slice();   /* hero tickers living in fx stay; only the probe's own effects are cleared */
  for(const k of keys){
    for(const c in player.cd)player.cd[k]=0;for(const c in player.cd)player.cd[c]=0;player.buffs={};player.action=null;player.casting=null;player.combo=null;player.pending=null;player.attackTarget=null;
    player.moveT=null;player.queue=null;player.x=0;player.y=0;player.z=0;player.phi=0;player.face=1;player.hp=player.maxHp;player.mp=player.maxMp;player.ccT=0;
    fx.length=0;fx.push(...base);for(const n of ENS)try{window[n]();}catch(e){}   /* hero core tickers (uEnsure, kEnsure, bEnsure …) */
    if(typeof window.heroShapeReset==='function')try{window.heroShapeReset();}catch(e){}   /* a hero's lasting state from the previous cast (raven: Huginn's perch, storm, memory …) */
    enemies.length=0;for(const [x,y] of pts){const e=spawnEnemy(x,y,false);e.x=x;e.y=y;e.hp=e.maxHp=1e9;e.aggro=0;e.atkCd=1e9;e._px=x;e._py=y;}
    const T=enemies[0];let ok=true;
    try{ok=castSkill(k,{target:T,phi:0,gx:GND.x,gy:GND.y})!==false;}catch(e){ok=false;}
    const steps=Math.round(SIM/DT);
    for(let i=0;i<steps;i++){gameTime+=DT;   /* same step as the game loop (index.html), incl. SKCTX */
      for(const n of ENS)try{window[n]();}catch(e){}   /* keep hero core tickers alive (anubis UCore.update has no return true) */
      try{updatePlayer(DT);}catch(e){}try{updEnemies(DT);}catch(e){}try{updPrisons(DT);}catch(e){}try{updParticles(DT);}catch(e){}
      for(let j=fx.length-1;j>=0;j--){window.SKCTX=fx[j]._sk||null;try{if(!fx[j].update(DT))fx.splice(j,1);}catch(e){fx.splice(j,1);}}window.SKCTX=null;
      for(const e of enemies){e.x=e._px;e.y=e._py;e.dead=false;if(e.hp<1e8)e.hp=1e8-1;}}
    const hit=enemies.filter(e=>e.hp<1e9).map(e=>[e._px,e._py]);
    out[k]={ok,type:SKILLS[k].type||'',range:SKILLS[k].range||0,radius:SKILLS[k].radius?+SKILLS[k].radius():0,hit};
  }
  timeScale=1;enemies.length=0;return out;}
