/* =====================================================================
   AETHERFALL — MONSTER VARIETY. Loaded after items.js.
   Every monster in VK_MONS gets (from its name + region, override in OVERRIDE below):
     el     element  — Neutral · Water · Fire · Earth · Wind · Poison · Holy · Dark · Ghost · Undead
     race   race     — Formless · Undead · Brute · Plant · Insect · Fish · Demon · Demi-Human · Angel · Dragon
     atype  attack   — melee (default) · ranged (keeps distance, shoots) · caster (long wind-up magic orb) · + healer (heals allies)
     ability on hit  — by element: Poison→poison · Water→slow · Fire→burn · Dark→bleed · Earth→armour crack · Undead→weaken · Wind→knock-back · Ghost→SP drain
   Player debuffs show in the buff bar; VIT shortens physical ones (poison, burn, bleed, slow, armour crack), INT weaken (RO stats 2026-11-22). Poison/burn/bleed never kill (stop at 1 HP).
   ===================================================================== */
(function(){
if(typeof enemyAI!=='function'||!window.VK_MONS)return;
const has=(n,re)=>re.test(n);
const R=(s)=>new RegExp(s,'i');
const EL_RULES=[
  ['Undead',R('skeleton|mumm|draugr|undead|bone|zombie|lich|undying|drowned|embalmer|revenant|hatamoto')],
  ['Ghost',R('ghost|wisp|wraith|shade|yurei|onryo|phantom|soul|lost one|lost villager|lost priest|haunted|hollow|mist spirit|spirit wolf|canopic|rokurokubi|mote')],
  ['Poison',R('dart|serpent|snake|cobra|scorpion|spider|leech|toad|witch|medusa|gorgon|shroom|beetle|vine')],
  ['Fire',R('fire|flame|sun |sunfeather|sun guardian|sun priest|sun sentinel|sun barge|volcano|forge|ember|salamander|solar|golden statue|phoenix')],
  ['Water',R('frost|ice|snow|glacier|icicle|rime|yeti|blizzard|frozen|winter|seal|narwhal|penguin|crab|octopus|kappa|siren|triton|umibozu|water sprite|rain|onsen|steam|tundra|mammoth|sea ')],
  ['Wind',R('wind|storm|thunder|harpy|hawk|eagle|crow|bat|pegasus|griffin|raijin|kirin|quetzal|macaw|bird|tengu|feather')],
  ['Holy',R('seraph|angel|holy|valkyrie|priestess|oracle|nymph|kodama|lotus')],
  ['Dark',R('shadow|dark|void|obsidian|oni|demon|cursed|blood|cerberus|set beast|ammit|night|hecate|rift|wyrm|fenrir|black')],
  ['Earth',R('stone|rock|golem|statue|ore|marble|granite|sand|earth|mud|boar|bull|ram|scarab|ant|mole|troll|giant|cyclops|minotaur|automaton|sentinel|ent|treant|bronze|jade|maize|corn|hippo')]];
const RACE_RULES=[
  ['Undead',R('skeleton|mumm|draugr|undead|bone|zombie|lich|undying|drowned|revenant|hatamoto')],
  ['Dragon',R('dragon|wyrm|drake|wyrmling|kirin|feathered serpent|great serpent|sand worm')],
  ['Angel',R('seraph|angel|valkyrie')],
  ['Demon',R('demon|oni|djinn|cerberus|ammit|set beast|imp|fenrir shade|void|shadow|shade|hecate')],
  ['Insect',R('bee|ant|beetle|scarab|spider|scorpion|glowworm|mantis|leech')],
  ['Fish',R('crab|seal|narwhal|octopus|kappa|penguin|walrus|tuskwal|triton|siren|umibozu|toad|frog|axolotl')],
  ['Plant',R('shroom|treant|ent\\b|pinecone|olive sprite|petal|corn|bamboo|lotus|kodama|vine|dandelion|maize|scarecrow')],
  ['Demi-Human',R('warrior|raider|soldier|priest|knight|ninja|ronin|samurai|amazon|villager|dwarf|smith|witch|shaman|archer|guard|bandit|pirate|hoplite|spartan|philosopher|scribe|embalmer|drummer|oarsman|weaver|bomber|jonin|ashigaru|wako|trainee|slave|cyclops|minotaur|giant|troll|centaur|sphinx|priestess|ghost samurai|demon swordsman|doll|mask')],
  ['Formless',R('golem|statue|wisp|slime|mote|crystal|lantern|trap|automaton|sentinel|puff|sprite|spirit|wraith|ghost|mist|soul')]];
const CASTER=R('priest|shaman|witch|mage|wisp|djinn|oracle|seraph|talisman|lantern|philosopher|scribe|embalmer|weaver|mote|medusa|gorgon|siren|wraith|yurei|onryo|rain spirit|steam spirit|water sprite|mist spirit|hecate|drummer|canopic');
const RANGED=R('archer|bow|dart shaman|bomber|ninja|harpy|hawk|eagle|crow|kunai|octopus|frog bandit|cyclops|macaw|tengu|bee|raider$');
const HEALER=R('priest|shaman|seraph|priestess|lotus|kodama|nymph|weaver');
const REG_EL={vik:'Water',azt:'Earth',grk:'Neutral',egy:'Earth',jpn:'Neutral',cap:'Neutral'};
const OVERRIDE={/* 'Monster Name':{el:'Fire',race:'Brute',atype:'ranged',healer:1} */};
const ABIL={Poison:'poison',Water:'slow',Fire:'burn',Dark:'bleed',Earth:'armor',Undead:'weak',Wind:'knock',Ghost:'drain',Holy:null,Neutral:null};
const EL_COL={Neutral:'#d8d8d8',Water:'#7fd0ff',Fire:'#ff8a4a',Earth:'#c8a060',Wind:'#9fe8a0',Poison:'#b07ad8',Holy:'#fff2a0',Dark:'#8a6aa8',Ghost:'#c8d8ff',Undead:'#9aa88a'};
const EL_TH={Neutral:'ไร้ธาตุ',Water:'น้ำ',Fire:'ไฟ',Earth:'ดิน',Wind:'ลม',Poison:'พิษ',Holy:'ศักดิ์สิทธิ์',Dark:'มืด',Ghost:'วิญญาณ',Undead:'อมตะ'};
const RACE_TH={Formless:'ไร้รูปร่าง',Undead:'อมตะ',Brute:'สัตว์',Plant:'พืช',Insect:'แมลง',Fish:'สัตว์น้ำ',Demon:'ปีศาจ','Demi-Human':'มนุษย์',Angel:'เทวดา',Dragon:'มังกร'};
const regionOf=id=>id==='snowpine'?'vik':/^(c[A-Z]|cata|rift)/.test(id)?'cap':id.slice(0,3);

for(const id in VK_MONS)for(const d of VK_MONS[id]){const n=d.name,o=OVERRIDE[n]||{};
  const el=o.el||(EL_RULES.find(([,re])=>has(n,re))||[REG_EL[regionOf(id)]||'Neutral'])[0];
  const race=o.race||(RACE_RULES.find(([,re])=>has(n,re))||[d.base==='snowwolf'?'Brute':'Formless'])[0];
  const healer=o.healer??(d.role!=='critter'&&HEALER.test(n));
  let atype=o.atype||(d.role==='critter'?'melee':CASTER.test(n)?'caster':RANGED.test(n)?'ranged':'melee');if(healer&&atype==='melee')atype='caster';   // healers stay at range
  d._t={el,race,atype,healer,ab:ABIL[el]||null};}

/* monsters keep their element / race in the stat object (Status window, world map) */
const _vk=vkVar;
vkVar=function(def,lv){const v=_vk(def,lv);if(def._t){v.el=EL_TH[def._t.el]||def._t.el;v.race=RACE_TH[def._t.race]||def._t.race;v.atype=def._t.atype;v.healer=def._t.healer;}return v;};

/* ---------------- player debuffs ---------------- */
Object.assign(BUFFDEF,{dbPoison:{n:'ติดพิษ',c:'#b07ad8',i:'☠'},dbBurn:{n:'ไฟไหม้',c:'#ff8a4a',i:'🔥'},dbBleed:{n:'เลือดไหล',c:'#e2574c',i:'🩸'},
  dbSlow:{n:'ช้าลง',c:'#7fd0ff',i:'❄'},dbArmor:{n:'เกราะร้าว (รับดาเมจเพิ่มต่อครั้ง)',c:'#c8a060',i:'⛨'},dbWeak:{n:'อ่อนแรง (ATK/MATK ลดลง)',c:'#9aa88a',i:'↓'}});
/* owner's rule: no percents — every debuff value is the monster's level × n, stored when it lands */
const DOT={dbPoison:1.2,dbBurn:1,dbBleed:.8};                                   // HP per second = monster level × n
const DBV={dbArmor:.5,dbWeak:.3};                                               // damage taken +lv×n per hit · ATK/MATK −lv×n
const DEBV={};
const DEB={poison:['dbPoison',4],burn:['dbBurn',3],bleed:['dbBleed',4],slow:['dbSlow',3],armor:['dbArmor',4],weak:['dbWeak',4]};
function debuff(k,dur){if(window.MSF){dur=MSF.debuffT(k,dur);if(!dur)return;}   /* stat tiers: VIT / INT 90 immune, VIT 60 / LUK 90 halve (milestones.js) */
  dur*=(typeof resMul==='function'?resMul(k==='dbWeak'?'weaken':k):1);const b=player.buffs[k];if(!b||b.t<dur)player.buffs[k]={t:dur,total:dur};}
function applyAbility(e,every){const t=e.vdef&&e.vdef._t;if(!t||!t.ab||player.iframes>0)return;e._abN=(e._abN||0)+1;if(e._abN%every)return;   /* every 4th hit that lands, no chance roll */
  if(window.MSF&&MSF.immuneAb(t.ab))return;   /* stat tiers: STR 30 no knock-back, VIT 90 physical statuses, INT 90 weaken + SP drain (milestones.js) */
  const mlv=(e.m&&e.m.lv)||PS.lv;
  if(t.ab==='knock'){const a=Math.atan2(player.y-e.y,player.x-e.x);player.x+=Math.cos(a)*40;player.y+=Math.sin(a)*40;return;}
  if(t.ab==='drain'){const d=Math.round(mlv*.4);player.mp=Math.max(0,player.mp-d);addFx(new DText({x:player.x,y:player.y,z:84,text:`-${d} SP`,color:'#c8d8ff',size:12,life:.8}));return;}
  const [k,dur]=DEB[t.ab]||[];if(!k)return;debuff(k,dur);DEBV[k]=Math.round(mlv*(DOT[k]||DBV[k]||0));addFx(new DText({x:player.x,y:player.y,z:84,text:BUFFDEF[k].n,color:BUFFDEF[k].c,size:12,life:.9}));}
const _hitPlayer=hitPlayer;
hitPlayer=function(e,o){const h0=player.hp;_hitPlayer(e,o);if(player.hp<h0)applyAbility(e,4);};
let dotAcc=0;
const _upd=updEnemies;
updEnemies=function(dt){_upd(dt);dotAcc+=dt;if(dotAcc>=1){dotAcc-=1;for(const k in DOT)if(hasBuff(k)&&player.hp>1){const d=Math.max(1,DEBV[k]||1);player.hp=Math.max(1,player.hp-d);dmgNum(player.x,player.y,60,d,'taken',{scale:.6});}}};
const fx0={dmgMul:itemFx.dmgMul,takenMul:itemFx.takenMul,moveMul:itemFx.moveMul};
{const _flat=window.ENH_FLAT,_abs=window.ENH_ABSORB;
  window.ENH_FLAT=()=>(_flat?_flat():0)-(hasBuff('dbWeak')?DEBV.dbWeak||0:0);                 // weaken: ATK / MATK − monster lv × .3
  window.ENH_ABSORB=d=>(_abs?_abs(d+(hasBuff('dbArmor')?DEBV.dbArmor||0:0)):d);}         // armour crack: damage taken + monster lv × .5 per hit
itemFx.moveMul=()=>fx0.moveMul()*(hasBuff('dbSlow')?Math.max(.2,(player.speed-60)/player.speed):1);   // slow: move speed −60

/* ---------------- projectiles ---------------- */
class MonShot{
  constructor(o){Object.assign(this,{t:0,layer:'top',life:3,z:30,r:5},o);const a=Math.atan2(player.y-this.y,player.x-this.x);this.vx=Math.cos(a)*this.speed;this.vy=Math.sin(a)*this.speed;}
  update(dt){this.t+=dt;if(this.home){const a=Math.atan2(player.y-this.y,player.x-this.x),sp=this.speed,k=Math.min(1,dt*3);this.vx+=(Math.cos(a)*sp-this.vx)*k;this.vy+=(Math.sin(a)*sp-this.vy)*k;}
    this.x+=this.vx*dt;this.y+=this.vy*dt;
    if(Math.hypot(player.x-this.x,player.y-this.y)<16){if(!this.e.dead){const h0=player.hp;_hitPlayer(this.e,{magic:!!this.magic});if(player.hp<h0)applyAbility(this.e,.35);}return false;}
    return this.t<this.life;}
  draw(){const [x,y]=P(this.x,this.y,this.z);ctx.save();ctx.globalAlpha=Math.min(1,(this.life-this.t)*4);
    const g=ctx.createRadialGradient(x,y,0,x,y,this.r*2.4);g.addColorStop(0,'#ffffff');g.addColorStop(.35,this.color);g.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,this.r*2.4,0,Math.PI*2);ctx.fill();ctx.restore();}}

/* ---------------- ranged / caster / healer AI ---------------- */
const AT={ranged:{range:190,wind:.45,cd:2.1,speed:330,r:4},caster:{range:220,wind:.95,cd:2.9,speed:210,r:6,home:1}};
const _ai=enemyAI;
enemyAI=function(e,dt){const T=e.vdef&&e.vdef._t;if(!T||T.atype==='melee')return _ai(e,dt);
  const s=e.st,A=AT[T.atype];e.acd=Math.max(0,(e.acd||0)-dt);e.aggro=Math.max(0,(e.aggro||0)-dt);
  if(s.frozen||s.stagger||s.stun){e.atk=0;return true;}
  const dx=player.x-e.x,dy=player.y-e.y,L=Math.hypot(dx,dy)||1;
  if(e.atk>0){e.atk-=dt;if(e.atk<=0){e._hitT=gameTime;e.acd=A.cd;
      addFx(new MonShot({e,x:e.x,y:e.y,speed:A.speed,r:A.r,home:A.home,magic:T.atype==='caster',color:EL_COL[T.el]||'#fff',life:1.6}));   /* RO: a caster's orb is magic (MDEF, cannot be dodged), an archer's shot is physical (FLEE) */}return true;}
  if(e.vdef.aggr&&e.aggro<=0&&L<A.range+40)e.aggro=4;
  if(e.aggro<=0)return false;
  if(T.healer&&gameTime-(e._healT||-9)>5){const hurt=enemies.filter(o=>!o.dead&&o!==e&&o.hp<o.maxHp*.7&&Math.hypot(o.x-e.x,o.y-e.y)<220).sort((a,b)=>a.hp/a.maxHp-b.hp/b.maxHp)[0];
    if(hurt){e._healT=gameTime;const h=Math.round(hurt.maxHp*.12);hurt.hp=Math.min(hurt.maxHp,hurt.hp+h);addFx(new DText({x:hurt.x,y:hurt.y,z:60,text:'+'+h,color:'#7fe08a',size:13,life:.9}));}}
  const sp=58*((e.m&&e.m.spd)||1)*(s.slow?.4:1)*(s.root?0:1);
  if(L>A.range){e.x+=dx/L*sp*dt;e.y+=dy/L*sp*dt;}else if(L<A.range*.45){e.x-=dx/L*sp*.8*dt;e.y-=dy/L*sp*.8*dt;}
  e.face=dx>0?1:-1;if(L<=A.range+10&&e.acd<=0)e.atk=A.wind;return true;};

window.AFMonsters={EL_TH,RACE_TH,EL_COL,count(){const c={};for(const id in VK_MONS)for(const d of VK_MONS[id]){const k=d._t.atype+(d._t.healer?'+heal':'');c[k]=(c[k]||0)+1;}return c;}};
})();
