/* sfx.js — the game's sound (2026-11-25, owner 'ทำอีกได้ไหมแบบใช้ทั้งเกม สมจริงๆ'). ?sfx=0 = off · ?sfxlog=1 = window.SFX.log
   Sounds: assets/sfx/<name>_<n>.mp3 + assets/sfx/list.js (built by tools/sfx/build_sfx.py; recorded layers = CC0 Kenney packs,
   the rest synthesised). Part 1 = engine (Web Audio: lazy loading, random variant / pitch / gain, voice caps, stereo by where it
   happens, distance fall-off, a compressor on the master, crossfaded ambience beds, phone unlock on the first touch, silent when the
   tab is hidden). Part 2 = hooks into the game (swings, hits, elements, deaths, footsteps, ambience, UI, systems). Part 3 = the
   'เสียง' block in the ⚙ panel (master / effects / UI / steps / ambience + mute, saved in af_sfx_v1). */
(function(){'use strict';
const Q=new URLSearchParams(location.search);if(Q.get('sfx')==='0')return;
const L=window.SFX_LIST||{},DIR='assets/sfx/',VER=window.SFX_V||1;
const ST={m:.85,fx:1,ui:.75,step:.7,amb:.5,mus:.45,mute:0};try{Object.assign(ST,JSON.parse(localStorage.getItem('af_sfx_v1')||'{}'));}catch(e){}
const saveST=()=>{try{localStorage.setItem('af_sfx_v1',JSON.stringify(ST));}catch(e){}};
const CAT=n=>/^amb_/.test(n)?'amb':/^step_/.test(n)?'step':/^(ui_|levelup|refine_|smith_|gem_|carve|extract|skill_learn|hatch|tame|door|potion|sit)/.test(n)?'ui':'fx';
let ac=null,master=null,comp=null,unlocked=false;const bus={},buf={},pend={},lastV={},lastT={},active={};
const LOG=(Q.get('sfxlog')==='1'||window.__SFX_LOG)?[]:null;
const clock=()=>window.__fx&&window.__fx.T!=null?window.__fx.T/1000:performance.now()/1000;   /* fxlab / test harness clock when present */

/* ================= part 1: engine ================= */
function mk(){if(ac)return ac;const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;
  try{ac=new C({latencyHint:'interactive'});}catch(e){try{ac=new C();}catch(e2){return null;}}
  comp=ac.createDynamicsCompressor();comp.threshold.value=-12;comp.knee.value=10;comp.ratio.value=4;comp.attack.value=.003;comp.release.value=.2;
  master=ac.createGain();master.connect(comp);comp.connect(ac.destination);
  for(const c of ['fx','ui','step','amb','mus']){const g=ac.createGain();g.connect(master);bus[c]=g;}
  vol();return ac;}
function vol(){if(!ac)return;const t=ac.currentTime;master.gain.setTargetAtTime(ST.mute?0:ST.m,t,.03);for(const c in bus)bus[c].gain.setTargetAtTime(ST[c],t,.03);}
function unlock(){if(!mk())return;if(ac.state!=='running')ac.resume().catch(()=>{});if(!unlocked){unlocked=true;preload();amb.kick();mus.kick();}}
for(const ev of ['pointerdown','touchend','keydown','mousedown'])window.addEventListener(ev,unlock,{capture:true,passive:true});
document.addEventListener('visibilitychange',()=>{if(!ac)return;if(document.hidden)ac.suspend().catch(()=>{});else if(unlocked)ac.resume().catch(()=>{});});
const url=(n,i)=>DIR+n+'_'+i+'.mp3?v='+VER;
function decode(ab){return new Promise((res,rej)=>{try{const p=ac.decodeAudioData(ab,res,rej);if(p&&p.then)p.then(res,rej);}catch(e){rej(e);}});}
function lead(b){const d=b.getChannelData(0),m=Math.min(d.length,Math.floor(b.sampleRate*.07));let i=0;while(i<m&&Math.abs(d[i])<2e-4)i++;return i/b.sampleRate;}   /* MP3 encoder delay */
function load(n,i){const k=n+'_'+i;if(k in buf)return Promise.resolve(buf[k]);if(pend[k])return pend[k];if(!ac)return Promise.resolve(null);
  return pend[k]=fetch(url(n,i)).then(r=>{if(!r.ok)throw 0;return r.arrayBuffer();}).then(decode).then(b=>{b._off=lead(b);return buf[k]=b;}).catch(()=>buf[k]=null);}
function loadAll(n){const S=L[n];if(S)for(let i=1;i<=S[0];i++)load(n,i);}
function preload(){const H=hero();for(const n of [H.sw,H.hit,H.cast&&H.cast+'_cast',H.cast&&H.cast+'_hit','mon_die','hurt','hit_crit','sw_light','ui_click','ui_open','ui_close','ui_item',stepName()])if(n)loadAll(n);
  setTimeout(()=>{for(const n in L)if(!L[n][3])loadAll(n);},2500);}
/* where the sound happens → pan and distance fall-off (relative to the hero, the camera follows him) */
function place(o){if(o.x==null||typeof player==='undefined')return [1,0];const dx=o.x-player.x,dy=(o.y-player.y)*1.3,d=Math.hypot(dx,dy);
  return [d<380?1:Math.max(.1,1-(d-380)/1000),Math.max(-.75,Math.min(.75,dx/520))];}
/* play(name,{v gain, rate, pv pitch spread, x,y world point, at seconds from now, gap min seconds between two of this name, max voices}) */
function play(n,o){o=o||{};const S=L[n];if(!S)return null;const t=clock(),gap=o.gap!=null?o.gap:.04;
  if(lastT[n]!=null&&t-lastT[n]>=0&&t-lastT[n]<gap)return null;lastT[n]=t;
  if(LOG){const p=typeof player!=='undefined'?player:{x:0,y:0};LOG.push({t:+t.toFixed(3),n,v:+(o.v||1).toFixed(2),at:+(o.at||0).toFixed(3),x:o.x==null?null:Math.round(o.x),y:o.y==null?null:Math.round(o.y),px:Math.round(p.x),py:Math.round(p.y),r:o.rate||1});if(LOG.length>4000)LOG.splice(0,1000);}
  if(!ac||!unlocked||ST.mute)return null;
  let i=1+Math.floor(Math.random()*S[0]);if(S[0]>1&&i===lastV[n])i=1+(i%S[0]);lastV[n]=i;const b=buf[n+'_'+i];
  if(b===undefined){load(n,i).then(bb=>{if(bb&&clock()-t<.15)go(bb,n,o);});return null;}
  return b?go(b,n,o):null;}
function go(b,n,o){const c=o.cat||CAT(n);if(!bus[c])return null;if((active[n]|0)>=(o.max||5))return null;
  const [dg,pn]=place(o),src=ac.createBufferSource();src.buffer=b;const pv=o.pv!=null?o.pv:.05;src.playbackRate.value=(o.rate||1)*(1+(Math.random()*2-1)*pv);
  const g=ac.createGain();g.gain.value=(o.v||1)*(1+(Math.random()*2-1)*.07)*dg;src.connect(g);let out=g;
  if(pn&&ac.createStereoPanner){const p=ac.createStereoPanner();p.pan.value=pn;g.connect(p);out=p;}
  out.connect(bus[c]);src.start(ac.currentTime+Math.max(0,o.at||0),b._off||0);active[n]=(active[n]|0)+1;
  src.onended=()=>{active[n]--;try{out.disconnect();g.disconnect();}catch(e){}};return src;}
/* ambience: copies of one bed crossfaded (equal power) from random points of the file, so there is no loop seam to hear */
const XC=(()=>{const n=64,a=new Float32Array(n),b=new Float32Array(n);for(let i=0;i<n;i++){a[i]=Math.sin(i/(n-1)*Math.PI/2);b[i]=Math.cos(i/(n-1)*Math.PI/2);}return {up:a,down:b};})();
const amb={want:null,lev:1,cur:null,nodes:[],tm:0,
  set(n,lev){this.want=n;this.lev=lev||1;if(LOG)LOG.push({t:+clock().toFixed(3),n:'amb:'+(n||'-')});this.kick();},
  kick(){if(!ac||!unlocked)return;const n=this.want;if(n===this.cur&&this.nodes.length)return;this.cur=n;clearTimeout(this.tm);
    const t=ac.currentTime;for(const x of this.nodes){try{x.g.gain.cancelScheduledValues(t);x.g.gain.setValueAtTime(x.g.gain.value,t);x.g.gain.linearRampToValueAtTime(0,t+1.5);x.s.stop(t+1.6);}catch(e){}}this.nodes=[];
    if(!n||!L[n])return;load(n,1).then(b=>{if(b&&this.cur===n)this.copy(n,b);});},
  copy(n,b){if(this.cur!==n)return;const XF=2.5,len=b.duration,seg=Math.min(len,Math.max(9,len*.75)),off=Math.random()*Math.max(0,len-seg),lv=this.lev;
    const s=ac.createBufferSource();s.buffer=b;const g=ac.createGain();g.gain.value=0;s.connect(g);g.connect(bus.amb);const t0=ac.currentTime+.05;
    try{g.gain.setValueCurveAtTime(XC.up.map(v=>v*lv),t0,XF);g.gain.setValueCurveAtTime(XC.down.map(v=>v*lv),t0+seg-XF,XF);}catch(e){g.gain.value=lv;}
    s.start(t0,off,seg);const node={s,g};this.nodes.push(node);s.onended=()=>{this.nodes=this.nodes.filter(x=>x!==node);};
    this.tm=setTimeout(()=>this.copy(n,b),(seg-XF)*1000);}};

/* music: one composed loop per kind of map (tools/music/compose.py). A file = the loop + XF seconds of its next
   repeat → copies start every LOOP seconds and cross linearly over XF: both hold the same audio there, no seam. */
const ML=window.MUS_L||{},MDIR='assets/music/',MV=window.MUS_V||1,mbuf={},mpend={};
function mload(n){if(n in mbuf)return Promise.resolve(mbuf[n]);if(mpend[n])return mpend[n];if(!ac)return Promise.resolve(null);
  return mpend[n]=fetch(MDIR+n+'.mp3?v='+MV).then(r=>{if(!r.ok)throw 0;return r.arrayBuffer();}).then(decode).then(b=>mbuf[n]=b).catch(()=>mbuf[n]=null);}
const mus={want:null,cur:null,nodes:[],tm:0,boss:0,
  set(n){this.want=n;if(LOG)LOG.push({t:+clock().toFixed(3),n:'mus:'+(n||'-')});this.kick();},
  pick(){return this.boss?'boss':this.want;},
  kick(){if(!ac||!unlocked)return;const n=this.pick();if(n===this.cur&&(this.nodes.length||!n))return;this.cur=n;clearTimeout(this.tm);
    const t=ac.currentTime;for(const x of this.nodes){try{x.g.gain.cancelScheduledValues(t);x.g.gain.setValueAtTime(x.g.gain.value,t);x.g.gain.linearRampToValueAtTime(0,t+2.2);x.s.stop(t+2.3);}catch(e){}}this.nodes=[];
    if(!n||!ML[n])return;mload(n).then(b=>{if(b&&this.cur===n&&!this.nodes.length)this.copy(n,b,ac.currentTime+(t>0?.6:.05),1);});},
  copy(n,b,t0,first){if(this.cur!==n)return;const [LP,XF2]=ML[n],len=Math.min(b.duration,LP+XF2);
    const s=ac.createBufferSource();s.buffer=b;const g=ac.createGain();s.connect(g);g.connect(bus.mus);
    const fi=first?2.5:XF2;g.gain.setValueAtTime(0,t0);g.gain.linearRampToValueAtTime(1,t0+fi);
    g.gain.setValueAtTime(1,t0+LP);g.gain.linearRampToValueAtTime(0,t0+len);
    s.start(t0,0,len);const node={s,g};this.nodes.push(node);s.onended=()=>{this.nodes=this.nodes.filter(x=>x!==node);try{g.disconnect();}catch(e){}};
    const nx=t0+LP;this.tm=setTimeout(()=>this.copy(n,b,nx,0),Math.max(0,(nx-ac.currentTime-1.5)*1000));}};
/* a fight with a big boss near the hero → boss music, back to the map's track 8 s after it ends */
let bossT=0;setInterval(()=>{let on=0;try{const S=window.WBOSS&&WBOSS.S;if(S&&S.state==='fight'&&!S.gone)on=1;
    if(!on&&typeof enemies!=='undefined'&&typeof player!=='undefined')for(const e of enemies){if(e.boss&&!e.mini&&!e.dead&&!e.hidden&&Math.hypot(e.x-player.x,e.y-player.y)<900&&((e.aggro||0)>0||e.hp<e.maxHp)){on=1;break;}}}catch(e){}
  const t=performance.now()/1000;if(on)bossT=t;const b=on||(bossT&&t-bossT<8)?1:0;if(b!==mus.boss){if(b&&unlocked)bossRoar();mus.boss=b;mus.kick();}},500);

/* ================= part 2: the game ================= */
const HERO={   /* weapon swing + impact for normal attacks and physical skills; cast = element of a magic basic; el = default element per branch */
  wolf:{sw:'sw_heavy',hit:'hit_heavy',el:{A:'phys',B:'ice'}},jaguar:{sw:'sw_light',hit:'hit_slash',el:{A:'phys',B:'dark'},twin:1},
  rhino:{sw:'sw_gauntlet',hit:'hit_punch_heavy',el:{A:'phys',B:'earth'}},axolotl:{sw:'',cast:'water',hit:'water_hit',el:{A:'water',B:'water'}},
  croc:{sw:'sw_thrust',hit:'hit_pierce',el:{A:'phys',B:'phys'}},cat:{sw:'sw_sharp',hit:'hit_slash',el:{A:'phys',B:'phys'}},
  owl:{sw:'shot_xbow',hit:'hit_pierce',el:{A:'phys',B:'ice'},shot:1},hippo:{sw:'sw_heavy',hit:'hit_blunt',el:{A:'phys',B:'water'}},
  sheep:{sw:'',cast:'holy',hit:'holy_hit',el:{A:'holy',B:'dark'}},dragon:{sw:'sw_fist',hit:'hit_punch',el:{A:'water',B:'wind'}},
  lion:{sw:'sw_fist',hit:'hit_punch',el:{A:'phys',B:'bolt'}},kitsune:{sw:'',cast:'fire',hit:'fire_hit',el:{A:'fire',B:'holy'}},
  bastet:{sw:'',cast:'dark',hit:'dark_hit',el:{A:'dark',B:'dark'}},anubis:{sw:'sw_chain',hit:'hit_blunt',el:{A:'phys',B:'dark'}},
  raven:{sw:'sw_thrust',hit:'hit_pierce',el:{A:'phys',B:'holy'}},wukong:{sw:'sw_staff',hit:'hit_blunt',el:{A:'phys',B:'phys'},rings:1,only:['fire','water','wind']},
  drake:{sw:'sw_heavy',hit:'hit_heavy',el:{A:'fire',B:'earth'}}};
const ch=()=>{try{return CHAR;}catch(e){return 'wolf';}};
function hero(){return HERO[ch()]||HERO.wolf;}
/* element / kind of a skill from its name + Thai text (works for skills added later too); OVR = hand fixes */
const EL=[['bolt',/thunder|lightning|storm|spark|static|volt|tempest|zeus|keraunos|electr|อัสนี|สายฟ้า/],
  ['fire',/fire|flame|ember|blaze|burn|inferno|magma|lava|molten|scorch|forge|etna|\bsun\b|sun'|solar|phoenix|cinder|pyre|sekhmet|tamamo|lantern|wisp|ไฟ|เพลิง|ลาวา|แมกมา/],
  ['ice',/frost|\bice|glaci|snow|blizzard|frozen|freez|hail|hoarfrost|winter|น้ำแข็ง|หิมะ/],
  ['water',/water|tide|wave|aqua|bubble|torrent|maelstrom|splash|flood|river|ocean|\bmist|geyser|spray|drip|droplet|\brain\b|lotus|spring|nile|ripple|น้ำ/],
  ['wind',/wind|gale|gust|tornado|typhoon|breeze|cloud|เมฆ/],
  ['earth',/earth|stone|rock|quake|mountain|gaia|\bsand\b|dust|boulder|tremor|avalanche|landslide|terra|หิน|ทราย/],
  ['poison',/poison|venom|toxic|plague|locust|miasma|พิษ/],['blood',/blood|bleed|vampir|savage|crimson|เลือด/],
  ['holy',/holy|\blight\b|divine|sacred|bless|grace|prayer|radian|halo|olymp|apollo|moon|lunar|\bstar|celestial|laurel|tsukuyomi|inari|mirror|prism|rune|sigil|ศักดิ์สิทธิ์|แสง|จันทร์|ดาว|รูน/],
  ['dark',/shadow|dark|night|eclipse|curse|\bhex|soul|\bsin\b|doom|death|duat|void|grave|abyss|ghost|wraith|apep|ammit|osiris|jackal|cobra|\boni\b|เงา|คำสาป|วิญญาณ|ความมืด/]];
const PRE=[[/sandstorm|sand storm/,'earth'],[/locust|scarab swarm/,'poison'],[/thought storm/,'holy'],[/monkeys?\b|monkey mob/,'phys']];
const OVR={owl:{},cat:{}};
const SKI={};
function info(k){if(SKI[k])return SKI[k];const s=(typeof SKILLS!=='undefined'&&SKILLS[k])||{},H=hero(),tx=((s.name||k)+' '+(s.th||'')).toLowerCase(),ty=s.type||'';
  let el=null;for(const [re,e] of PRE)if(re.test(tx)){el=e;break;}if(!el)for(const [e,re] of EL)if(re.test(tx)){el=e;break;}
  if(H.only&&el&&!H.only.includes(el))el=null;
  const col=s.br==='C'?(s.col||'basic'):(s.br||'basic');
  if(!el)el=col==='A'||col==='B'?H.el[col]:(H.cast||'phys');
  let kind=ty==='melee'?'melee':ty==='ground'?'area':ty==='dir'?'wave':ty==='self'?'buff':'other';
  if(/heal|mend|restor|\brest\b|renew|regen|ฟื้น hp|รักษา/.test(tx)&&ty!=='melee')kind='heal';
  else if(/guard|ward|shield|aegis|barrier|dome|fortress|cocoon|protect|bulwark|parry|counter|เกราะ|โล่|ป้องกัน/.test(tx)&&!/break/.test(tx)&&ty==='self')kind='shield';
  else if(/howl|roar|\bcry\b|shout|rally|banner|\bwar\b|drum|\bfury\b|\brage\b|berserk|frenzy|หอน|คำราม/.test(tx)&&(ty==='self'||ty==='ground'))kind='war';
  else if(/summon|army|\bclone|decoy|servant|minion|wolves|legion|\bcall\b|spirit\b|spirit'|อัญเชิญ/.test(tx)&&(ty==='self'||ty==='ground')&&!/flame|fire/.test(tx))kind='summon';
  else if(/\bstep\b|dash|rush|pursuit|charge|blink|lunge|vault|retreat|teleport|sprint|พุ่ง|วาร์ป/.test(tx)&&ty!=='ground')kind=kind==='melee'?'melee':'dash';
  if(kind==='buff'&&/(atk|matk)\s*[×x]|ฟัน|โจมตี|หมุน|ทุบ|ยิง|ระเบิด|กวาด|กระแทก|ดาเมจ/.test(String(s.th||'').toLowerCase()))kind='other';
  if(H.shot&&kind!=='heal'&&kind!=='shield'&&kind!=='dash'&&/bolt|shot|volley|rain|flurry|deadeye|aim|drill|rico|snare|hunt|moonfall|avalanche|cage|execution|arrow/.test(tx))kind='shot';
  const slam=/leap|pounce|jump|\bdrop\b|descent|slam|quake|smash|crash|stomp|belly|meteor|crush|earthfall|landing|กระโดด|ทุบ/.test(tx);
  const o=Object.assign({el,kind,slam,ult:!!(s.ult||/ULTIMATE/.test(s.th||'')),t:ty,col},(OVR[ch()]||{})[k]||{});return SKI[k]=o;}
const ELS={fire:1,ice:1,bolt:1,water:1,wind:1,earth:1,holy:1,dark:1,poison:1};
const castName=el=>ELS[el]?el+'_cast':null,hitName=(el,H)=>el==='blood'?'blood_hit':ELS[el]?el+'_hit':H.hit;

/* ---- swings and casts: one sound per action, timed so its loudest moment lands on the contact frame ---- */
const pk=n=>(L[n]&&L[n][1])||0;
function onAction(a){if(!a||a.key==='hurt')return;const H=hero(),tc=Math.max(0,(a.windup||0)/(typeof ACTION_TEMPO!=='undefined'?ACTION_TEMPO:1)),px=player.x,py=player.y;
  const at=n=>Math.max(0,tc-pk(n));
  if(!a.skill){   /* normal attack */
    if(H.cast){play(H.cast+'_cast',{v:.5,at:Math.max(0,tc-.06),rate:1.12,gap:.08,x:px,y:py});return;}
    if(H.sw){play(H.sw,{v:H.shot?.85:.8,at:at(H.sw),gap:.06,x:px,y:py});if(H.twin)play(H.sw,{v:.6,at:at(H.sw)+.07,gap:0,force:1,x:px,y:py});if(H.rings)play('rings',{v:.55,at:at(H.sw),x:px,y:py});}
    return;}
  const I=info(a.skill),cn=castName(I.el);
  switch(I.kind){
    case 'heal':play('heal',{v:.9});break;
    case 'shield':play('shield_up',{v:.9});break;
    case 'war':play('buff_war',{v:.9});break;
    case 'summon':play('summon',{v:.9});break;
    case 'dash':play('dash',{v:.9,at:Math.max(0,tc*.3-pk('dash'))});if(cn)play(cn,{v:.45,at:tc});break;
    case 'buff':if(I.ult)play('buff_war',{v:.8});play('buff_up',{v:.85});if(cn&&I.el!=='holy')play(cn,{v:.35,at:.1});break;
    case 'shot':play(H.sw,{v:.95,at:tc,gap:.03});if(cn)play(cn,{v:.45,at:tc});break;
    case 'melee':if(H.sw&&!H.shot&&(I.el==='phys'||I.el==='blood')){play(H.sw,{v:.95,rate:.94,at:at(H.sw)});if(H.rings)play('rings',{v:.5,at:at(H.sw)});}
      else if(H.shot&&(I.el==='phys'))play(H.sw,{v:.95,at:tc});
      if(cn)play(cn,{v:H.cast?.85:.6,at:Math.max(0,tc-.1)});break;
    default:if(cn)play(cn,{v:.9,at:Math.max(0,tc-.12)});else if(H.sw)play(H.sw,{v:.9,rate:.92,at:at(H.sw)});}
  if(I.ult&&I.kind!=='buff')play('buff_up',{v:.6,rate:.8,gap:.5});}

/* ---- hits on monsters ---- */
const HK={on:0,crit:0},hb={t:0,n:0},DOT={fire:1,poison:1,blood:1,dark:1};
function onHit(e,d,o,wasKO){const H=hero(),x=e.x,y=e.y;
  if(o._miss){play('st_miss',{v:.75,x,y,gap:.1,max:3});return;}
  if(!(d>0))return;
  const k=o.skill||(o.owShot&&o.owShot.key)||window.SKCTX||null,I=k&&k!=='basic'&&typeof SKILLS!=='undefined'&&SKILLS[k]?info(k):null;
  if(o.dot){const el=I?I.el:(H.cast||'');if(DOT[el])play(hitName(el,H),{v:.18,x,y,gap:.4,rate:1.2});return;}
  const t=clock();if(t-hb.t>.045||t<hb.t){hb.t=t;hb.n=0;}if(hb.n>=2)return;hb.n++;
  const el=I?I.el:(H.cast||'phys'),n=hitName(el,H),v=(I?1:.85)*(o.big?1.15:1);
  play(n,{v,x,y,gap:.03,max:6});
  if(I&&I.t==='melee'&&ELS[el]&&!H.cast)play(H.hit,{v:.4,x,y,gap:.05});
  if(HK.crit)play('hit_crit',{v:.4,x,y,gap:.2});
  const a=player.action;if(I&&a&&a.skill===k&&!a._sfx1){a._sfx1=1;if(I.slam)play('slam',{v:.85,x,y,gap:.2});if(I.ult)play('ult_boom',{v:.8,x,y,gap:.6});}
  if(!wasKO&&e.koOut)play('ko',{v:.65,x,y,gap:.3});
  if(!e.dead&&e.hp>0){const tt=clock();if(!(e._mvH&&tt-e._mvH<.4&&tt>=e._mvH)){e._mvH=tt;mv(e,'hu',e.boss?.75:.45);}}}

/* ---- footsteps, sitting (ticker on the game clock) ---- */
function curMapId(){try{return curMap;}catch(e){return null;}}
function isRoom(id){try{return typeof ROOMS!=='undefined'&&!!ROOMS[id];}catch(e){return false;}}
function mood(id){const c=(window.VK_MAPS||{})[id];return c?(c.mood||''):'';}
function stepName(){const id=curMapId()||'';if(isRoom(id))return 'step_wood';const c=(window.VK_MAPS||{})[id]||{},m=c.mood||'';
  if(c.walls||/mine|cave|rift/.test(m))return 'step_stone';
  if(/^(vik|snow|village|forest|frost)/.test(id)||/glacier|cold/.test(m)||id==='wbBrontara')return 'step_snow';
  if(/^(egy|sea)/.test(id)||/desert|sand|dusk|beach/.test(m))return 'step_sand';
  if(/T$/.test(id)||/light|dream/.test(m)||/^wb(Lumina|Puijantra)/.test(id))return 'step_stone';
  return 'step_grass';}
const FT={px:null,py:null,acc:0,side:1,sit:false,n:null};
function stepTick(dt){if(typeof player==='undefined')return;const p=player;
  if(FT.px==null){FT.px=p.x;FT.py=p.y;}const dx=p.x-FT.px,dy=p.y-FT.py;FT.px=p.x;FT.py=p.y;const d=Math.hypot(dx,dy);
  const sit=!!p.sitting;if(sit!==FT.sit){FT.sit=sit;play('sit',{v:sit?.8:.5,gap:.3});}
  if(d<.05||d>60||(p.z||0)>2||p.hp<=0||sit){FT.acc=Math.min(FT.acc,10);return;}
  const stride=66;   /* ≈ 2.5 steps a second at the base walk speed 165 */FT.acc+=d;if(FT.acc>=stride){FT.acc-=stride;FT.side=-FT.side;const n=FT.n||(FT.n=stepName());
    play(n,{v:.75,x:p.x+FT.side*25,y:p.y,gap:.12,pv:.07,max:3});}}

/* ---- ambience per map ---- */
function ambOf(id){if(!id)return null;if(isRoom(id))return ['amb_forge',/^craft/.test(id)?1:.55];const m=mood(id),night=(()=>{try{return !!mapNight;}catch(e){return false;}})();
  let n='amb_forest',lv=1;
  if(id==='capT')n='amb_town';
  else if(/^(vik|snow|village|forest|frost)/.test(id)&&!/mine|cave/.test(m))n=(m==='dark')?'amb_crypt':'amb_snow';
  else if(/mine|cave/.test(m))n=/^(egy|jpn|cata|azt)/.test(id)&&/temple/.test(((window.VK_MAPS||{})[id]||{}).theme||'')?'amb_crypt':'amb_cave';
  else if(/necro|hades|dark|oni/.test(m))n='amb_crypt';
  else if(/rift|spirit|olympus|dream|dragon/.test(m)&&id!=='wbBrontara')n='amb_mystic';
  else if(id==='wbBrontara'||(m==='storm'&&!/^vik/.test(id)))n='amb_storm';
  else if(m==='volcano')n='amb_volcano';
  else if(/desert|sandstorm|dusk/.test(m)||/^egy/.test(id))n='amb_desert';
  else if(/jungle|cloud|gold/.test(m)||/^azt/.test(id))n='amb_jungle';
  else if(m==='beach'||/^sea/.test(id)||id==='jpnF6'||id==='grkF2')n='amb_sea';
  else if(m==='moon')n='amb_night';
  else if(/greek/.test(m)||/^grk/.test(id)||id==='jpnF2'||id==='jpnF4')n='amb_summer';
  else if(/^wbLumina/.test(id))n='amb_mystic';
  if(night&&/amb_(forest|summer|town)/.test(n)){n='amb_night';}
  if(/T$/.test(id)&&id!=='capT')lv=.8;
  return [n,lv];}
/* ---- music per map ---- */
function musOf(id){if(!id)return null;if(isRoom(id))return mus.want;const c=(window.VK_MAPS||{})[id]||{},m=c.mood||'',night=(()=>{try{return !!mapNight;}catch(e){return false;}})();
  const reg=/^(vik|snow|frost|iso)/.test(id)?'vik':/^(grk|egy|jpn|azt|sea)/.test(id)?id.slice(0,3):null;
  const town=id==='capT'||id==='frostheim'||id==='isoTown'||/^[a-z]{3}T\d?$/.test(id)||m==='town';
  if(/^wb/.test(id))return 'mystic';
  if(/^rift/.test(id))return 'mystic';
  if(/^c(N|E|S|W|NE|NW|SE|SW)$/.test(id))return 'night';
  if(town){if(id==='capT')return night?'night':'capital';if(reg==='sea')return 'sea';return reg?(night?'night':reg+'_town'):'capital';}
  if(/^cata/.test(id)||c.walls||/mine|cave|necro|hades|dark|oni/.test(m))return 'dungeon';
  if(/^rift/.test(id)||/rift|spirit|olympus|dream|dragon/.test(m))return 'mystic';
  if(reg==='sea'||m==='beach')return 'sea';
  if(reg)return reg;
  return night?'night':'capital';}
let mapSeen0=null;
function onMap(id,prev){FT.n=null;FT.px=null;try{if(unlocked)mvPreload(id);}catch(x){}const A=ambOf(id);amb.set(A&&A[0],A&&A[1]);mus.set(musOf(id));
  if(prev==null)return;if(isRoom(id)||isRoom(prev))play('door',{v:.8,gap:.5});else play('warp',{v:.55,gap:1});}


/* ---- monster voices (2026-11-28): family from the name → mv_<fam>_ag (notices the hero) / _at (attacks) / _hu (is hit, lower on death);
   bigger monsters play slower / deeper. Big bosses: boss_roar when the fight starts, boss_step while they walk. ---- */
const MF=[['ghost',/ghost|spirit|wraith|yurei|siren|djinn|lost one|phantom|spect|banshee|\bsoul|styx|\bmist\b|haunt/],
  ['wisp',/wisp|sprite|petal|fairy|firefly|\bglow|aether/],
  ['undead',/skeleton|draugr|undying|mumm|rusted|cracked soldier|\bbone|zombie|undead|lich|shadow soldier|ghoul|corpse|revenant|ghost slave/],
  ['golem',/golem|statue|\bstone(?! mask)|automaton|sentinel|\btrap\b|living trap|\bdoll|bronze bull|construct|marble|scarecrow|kunai|forge|ore\b|colossus|gashadokuro/],
  ['human',/warrior|soldier|guard(?!ian)|priest|ninja|samurai|ronin|witch|amazon|pirate|villager|satyr|swordsman|shogun|spartan|trainee|dwarf|viking|witchling|hecate|vizier|jonin|bandit|slave|huldra/],
  ['bat',/\bbats?\b|camazotz/],['bird',/hawk|crow|vulture|harpy|eagle|quetzal|ibis|gull|bird|griffin|tengu|\bowl\b|raven|phoenix|crane|thunderbird/],
  ['insect',/spider|scorpion|beetle|scarab|\bbees?\b|wasp|\bworm|crab|locust|\bants?\b|mantis|centipede|starfish|jorogumo/],
  ['reptile',/serpent|snake|cobra|crocodile|\bcroc|wyrm|lizard|salamander|naga|viper|medusa|nidhogg|ahuizotl/],
  ['slime',/slime|frog|toad|octopus|kappa|jelly|blob|ooze|squid|axolotl|frostling/],
  ['critter',/\brat\b|hare|monkey|panda|squirrel|rabbit|mouse|pup\b|cub\b/],
  ['big',/bear|yeti|bull|boar|\bram\b|horse|goat|stag|giant|cyclops|\boni\b|minotaur|hippo|jaguar|\blion|tiger|centaur|sphinx|set beast|gorilla|mammoth|rhino|polyphemus|jotun|ymir|troll/],
  ['beast',/wolf|hound|jackal|\bfox|dog|fenrir|cerberus|hyena|\bcat\b|lynx|panther|seal|kitsune|tanuki/]];
const FAMC={};
function famOf(e){const m=e.m||{},n=String(m.name||(e.vdef&&e.vdef.name)||e.name||e.kind||'').toLowerCase();if(n in FAMC)return FAMC[n];
  let f=null;for(const [k,re] of MF)if(re.test(n)){f=k;break;}if(!f)f=e.kind==='snowwolf'?'beast':'human';return FAMC[n]=f;}
function mvRate(e){const sc=e.sc||1;let k=Math.max(.72,Math.min(1.3,1/Math.sqrt(sc)));if(e.mini)k*=.85;if(e.boss&&!e.mini)k*=.75;return k;}
const MVG={ag:0,at:0,hu:0};
function mv(e,ev,v,o){if(!e||(e.hidden))return;const x=e.x,y=e.y;if(typeof player!=='undefined'&&Math.hypot(x-player.x,y-player.y)>(e.boss?1100:760))return;
  const t=clock(),gap={ag:.35,at:.09,hu:.07}[ev]||.1;if(t-MVG[ev]>=0&&t-MVG[ev]<gap)return;MVG[ev]=t;
  play('mv_'+famOf(e)+'_'+ev,Object.assign({v,x,y,rate:mvRate(e),pv:.07,gap:0,max:ev==='ag'?2:4},o||{}));}
function mvAI(e,a0,g0){if(e.dead||e.hp<=0)return;const t=clock();
  if(a0<=0&&e.atk>0)mv(e,'at',e.boss?.95:.6);
  if(g0<=0&&e.aggro>0&&!(e._mvN&&t-e._mvN<9&&t>=e._mvN)){e._mvN=t;if(!(e.boss&&!e.mini))mv(e,'ag',e.mini?.95:.55);}}
W('enemyAI',f=>function(e){const a0=(e&&e.atk)||0,g0=(e&&e.aggro)||0;const r=f.apply(this,arguments);try{if(e)mvAI(e,a0,g0);}catch(x){}return r;});
/* boss footfalls (map / mini bosses walk outside enemyAI too) */
setInterval(()=>{if(typeof enemies==='undefined'||typeof player==='undefined'||!unlocked)return;
  for(const e of enemies){if(!e.boss||e.dead||e.hidden||Math.hypot(e.x-player.x,e.y-player.y)>1000){if(e)e._mvSx=null;continue;}
    if(e._mvSx==null){e._mvSx=e.x;e._mvSy=e.y;e._mvSa=0;continue;}const d=Math.hypot(e.x-e._mvSx,e.y-e._mvSy);e._mvSx=e.x;e._mvSy=e.y;
    if(d>80)continue;e._mvSa+=d;const stride=e.mini?95:70;if(e._mvSa>=stride){e._mvSa=0;play('boss_step',{v:e.mini?.45:.8,x:e.x,y:e.y,rate:e.mini?1.15:mvRate(e)/.75*.95,gap:.12,max:3});}}},120);
function bossRoar(){try{let b=null,bd=1e9;for(const e of enemies){if(e.boss&&!e.mini&&!e.dead){const d=Math.hypot(e.x-player.x,e.y-player.y);if(d<bd){bd=d;b=e;}}}
  play('boss_roar',{v:1,x:b&&b.x,y:b&&b.y,gap:6,max:1});}catch(e){play('boss_roar',{v:1,gap:6});}}
function mvPreload(id){try{const L2=(window.VK_MONS||{})[id];if(!L2)return;const seen={};for(const d of [].concat(...Object.values(L2).map(v=>Array.isArray(v)?[v]:[v]).flat()))
  {const n=d&&d.name;if(!n)continue;const f=famOf({m:{name:n},kind:d.base==='snowwolf'?'snowwolf':null});if(seen[f])continue;seen[f]=1;for(const ev of ['ag','at','hu'])loadAll('mv_'+f+'_'+ev);}}catch(e){}}
/* ---- wrap the game's functions (this file loads last, so these wrappers are the outermost) ---- */
function W(name,mk){try{const g=(0,eval)(name);if(typeof g!=='function')return false;window.__sfxW=mk(g);(0,eval)(name+'=window.__sfxW;');delete window.__sfxW;return true;}catch(e){if(!(e instanceof ReferenceError))console.warn('sfx wrap',name,e);return false;}}
W('startAction',f=>function(a){const r=f.apply(this,arguments);try{onAction(a);}catch(e){}return r;});
W('dmgNum',f=>function(x,y,z,val,kind){if(HK.on&&kind==='crit')HK.crit=1;return f.apply(this,arguments);});
W('hurt',f=>function(e,mult,o,...rest){if(!o)o={};const ko=!!(e&&e.koOut);HK.on++;HK.crit=0;let d;try{d=f.call(this,e,mult,o,...rest);}finally{HK.on--;}try{if(e)onHit(e,d,o,ko);}catch(x){}return d;});
W('kill',f=>function(e){const r=f.apply(this,arguments);try{if(e){const big=e.boss&&!e.mini;play(big?'boss_die':'mon_die',{v:e.mini?1.1:.85,rate:e.mini?.85:1,x:e.x,y:e.y,gap:big?1:.07,max:4});mv(e,'hu',big?1:.6,{rate:mvRate(e)*.82,max:3});}}catch(x){}return r;});
W('hitPlayer',f=>function(e,o){o=o||{};const h0=player.hp,a=player.action;let s0=0;try{s0=shieldSum();}catch(x){}const r=f.apply(this,arguments);try{const d=h0-player.hp,s1=shieldSum(),abs=s1<s0-.01;
  if(d>0)play(o.magic?'hurt_magic':'hurt',{v:.7+Math.min(.5,d/Math.max(1,player.maxHp)*3),gap:.07});
  else if(a&&a.blocked)play('block',{v:.9,gap:.1});else if(abs)play('block',{v:.45,rate:1.25,gap:.12});else play('st_dodge',{v:.8,gap:.25});
  if(d>0||abs)STS.hurtT=clock();}catch(x){}return r;});
W('levelUpFx',f=>function(){const r=f.apply(this,arguments);play('levelup',{v:1,gap:1});return r;});
W('enterMap',f=>function(id){const prev=curMapId();const r=f.apply(this,arguments);try{onMap(curMapId(),prev);}catch(x){}return r;});
W('updatePlayer',f=>function(dt){const r=f.apply(this,arguments);try{stepTick(dt);}catch(x){}return r;});
W('addFx',f=>function(o){try{if(o&&o.text&&typeof o.text==='string'){const t=o.text;
    if(t==='ขัดจังหวะ!')play('st_interrupt',{v:.85,x:o.x,y:o.y,gap:.2});
    else if(/^-\d+ SP$/.test(t)&&o.color==='#c8d8ff')play('st_curse',{v:.7,gap:.6});
    if(t==='FULL'||(o.z===76&&/^\+\d+( SP)?$/.test(t)&&(o.color==='#7fe08a'||o.color==='#7fb8ff')))play('potion',{v:.8,gap:.4});}}catch(x){}return f.apply(this,arguments);});
W('chatLog',f=>function(type,t){try{chatSfx(String(t||''),type);}catch(x){}return f.apply(this,arguments);});
W('msg',f=>function(t){try{if(/ไม่พอ|ไม่ได้|ไม่มี|ยังไม่|เต็ม|ต้องเลเวล|ติดสถานะ/.test(String(t)))play('ui_error',{v:.8,gap:.5});}catch(x){}return f.apply(this,arguments);});
function chatSfx(t,type){
  if(/ได้รับอุปกรณ์/.test(t))play('ui_rare',{v:.8,gap:.4});
  else if(/^ได้รับ/.test(t)&&type==='bat')play(/#e0a020|#9a6ae0/.test(t)?'ui_rare':'ui_item',{v:.7,gap:.25});
  else if(/ตีบวกสำเร็จ/.test(t))play('refine_ok',{v:1,gap:.5});
  else if(/ตีบวกพลาด/.test(t))play(/แตก/.test(t)?'refine_break':'refine_fail',{v:1,gap:.5});
  else if(/^ซ่อม/.test(t))play('smith_hit',{v:.9,gap:.3});
  else if(/^ซื้อ|ขายได้|ขายของได้|^ขาย/.test(t))play('ui_coin',{v:.8,gap:.3});
  else if(/ผูกใจสำเร็จ|ความผูกพัน/.test(t))play('tame',{v:.8,gap:.5});
  else if(/ฟักไข่/.test(t))play('hatch',{v:.9,gap:.5});
  else if(/^กิน /.test(t))play('potion',{v:.7,gap:.5});
  else if(/🗿/.test(t))play('ui_rare',{v:.7,gap:.5});
  else if(/สลัก|เจาะ/.test(t)&&type==='sys')play('carve',{v:.8,gap:.4});
  else if(/สกัด/.test(t)&&type==='sys')play('extract',{v:.8,gap:.5});}
/* equipping, relics, boss telegraphs (objects that exist after load) */
function lateHooks(){
  if(window.equipItem&&!window.equipItem.__sfx){const f=window.equipItem;window.equipItem=function(){const r=f.apply(this,arguments);play('ui_equip',{v:.8,gap:.15});return r;};window.equipItem.__sfx=1;try{(0,eval)('equipItem=window.equipItem');}catch(e){}}
  if(window.unequip&&!window.unequip.__sfx){const f=window.unequip;window.unequip=function(){const r=f.apply(this,arguments);play('ui_equip',{v:.6,gap:.15});return r;};window.unequip.__sfx=1;try{(0,eval)('unequip=window.unequip');}catch(e){}}
  const R=window.RELIC;if(R&&R.use&&!R.use.__sfx){const f=R.use;R.use=function(){const c0=R.cdLeft?R.cdLeft():0;const r=f.apply(this,arguments);try{if(!R.cdLeft||R.cdLeft()>c0+.5)play('relic',{v:.9,gap:2});}catch(e){}return r;};R.use.__sfx=1;}
  const M=window.MBK;if(M&&M.warn&&!M.warn.__sfx){const f=M.warn;M.warn=function(o){const w=f.apply(this,arguments);try{const s=o&&o.shape;play('boss_warn',{v:.7,gap:.8,x:s&&s.x,y:s&&s.y});}catch(e){}return w;};M.warn.__sfx=1;}
  if(M&&M.boom&&!M.boom.__sfx){const f=M.boom;M.boom=function(s){try{play('slam',{v:.8,gap:.15,x:s&&s.x,y:s&&s.y});}catch(e){}return f.apply(this,arguments);};M.boom.__sfx=1;}}
lateHooks();setTimeout(lateHooks,1500);setTimeout(lateHooks,6000);

/* ---- UI: clicks, windows opening / closing, the smith's hammer ---- */
const NOCLICK='#hotbar,#mobSkW,.mobSk,#mobJoy,#mobAtk,#mobTgt,#mobAuto,#mobSit,canvas,#sfxBox input';
document.addEventListener('pointerdown',ev=>{const t=ev.target;if(!t||!t.closest)return;if(t.closest(NOCLICK))return;
  const b=t.closest('button,[data-m],[data-tab],.tab,.rob,.tb,a,[role=button]');if(!b)return;
  if(/^\s*[✕×x]\s*$/i.test(b.textContent||''))return;   /* close buttons: the window poll plays the close sound */
  if(b.id==='rfgo'&&!b.disabled){for(const tm of [.3,.66,1.02])play('smith_hit',{v:.75,at:tm,gap:0,force:1});return;}
  play(b.closest('[data-tab],.tab')?'ui_tab':'ui_click',{v:.8,gap:.05});},{capture:true,passive:true});
const WIN=new Map();
function winScan(){const els=document.querySelectorAll('body > .ro, body > [id$="w"], body > [id$="Win"], body > [id$="Book"], #mkx, #rfw, #skw, #smw, #totemWin');
  for(const el of els){if(!el.id||/^(gear|menu|boot|msg)$/.test(el.id))continue;const open=el.getClientRects().length>0&&getComputedStyle(el).visibility!=='hidden';
    const was=WIN.get(el);if(was===undefined){WIN.set(el,open);continue;}if(open!==was){WIN.set(el,open);if(unlocked)play(open?'ui_open':'ui_close',{v:.8,gap:.12});}}}
setInterval(winScan,180);

/* ================= part 3: the 'เสียง' block in the ⚙ panel ================= */
function ui(){const p=document.getElementById('panel');if(!p||document.getElementById('sfxBox'))return;
  const box=document.createElement('div');box.id='sfxBox';
  const rows=[['m','เสียงรวม'],['mus','เพลง'],['fx','ต่อสู้ / สกิล'],['ui','เมนู / ไอเทม'],['step','ฝีเท้า'],['amb','บรรยากาศ']];
  box.innerHTML='<h3>เสียง <button id="sfxMute" class="rob" style="float:right;padding:0 8px">'+(ST.mute?'🔇 ปิดอยู่':'🔊 เปิดอยู่')+'</button></h3>'+
    rows.map(([k,t])=>`<label class="sfxRow" style="display:flex;align-items:center;gap:8px;margin:3px 0"><span style="width:92px">${t}</span><input type="range" min="0" max="100" value="${Math.round(ST[k]*100)}" data-k="${k}" style="flex:1"><b style="width:30px;text-align:right">${Math.round(ST[k]*100)}</b></label>`).join('');
  const h=[...p.querySelectorAll('h3')].find(x=>/VFX QUALITY/.test(x.textContent));p.insertBefore(box,h||p.firstChild.nextSibling);
  box.querySelectorAll('input').forEach(inp=>inp.addEventListener('input',()=>{ST[inp.dataset.k]=inp.value/100;inp.nextElementSibling.textContent=inp.value;vol();saveST();}));
  box.querySelectorAll('input').forEach(inp=>inp.addEventListener('change',()=>{if(inp.dataset.k==='amb'||inp.dataset.k==='mus')return;unlock();play(inp.dataset.k==='step'?stepName():inp.dataset.k==='ui'?'ui_click':'hit_heavy',{v:1,gap:.2});}));
  document.getElementById('sfxMute').onclick=e=>{ST.mute=ST.mute?0:1;e.target.textContent=ST.mute?'🔇 ปิดอยู่':'🔊 เปิดอยู่';vol();saveST();};}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ui);else ui();
try{const id=curMapId();if(id){const A=ambOf(id);amb.set(A&&A[0],A&&A[1]);mus.set(musOf(id));}}catch(e){}

/* ================= combat statuses (2026-11-28, owner '2') ================= */
/* monsters: index.html statusProxy calls window.ST_HOOK(e,key,now,before) when a status goes up → sound on the rising edge
   from nothing. us: player.buffs db* keys + player.ccT, shields of every hero + the gem guard, low HP heartbeat. */
const STS={hurtT:-9,pb:{},cc:0,sh:0,hb:0};
const ESND={frozen:['st_freeze',.85],stun:['st_stun',.8],bleed:['st_bleed',.75],poison:['st_poison',.75],burn:['st_burn',.8],
  slow:['st_slow',.5],root:['st_root',.75],armor:['st_armor',.75],defdown:['st_armor',.6]};
{const prev=window.ST_HOOK;window.ST_HOOK=function(e,k,now,before){if(prev)try{prev.apply(this,arguments);}catch(x){}
  try{const S=ESND[k];if(!S||!e||e.dead||before>.05||!(now>.05))return;if(typeof player!=='undefined'&&Math.hypot(e.x-player.x,e.y-player.y)>760)return;
    play(S[0],{v:S[1]*(e.boss?1.1:1),x:e.x,y:e.y,gap:k==='slow'?.6:.18,max:3});}catch(x){}};}
const PSND={dbPoison:'st_poison',dbBurn:'st_burn',dbBleed:'st_bleed',dbSlow:'st_slow',dbArmor:'st_armor',dbWeak:'st_curse'};
function shieldSum(){let s=0;const g=n=>{try{const o=(0,eval)('typeof '+n+'!=="undefined"?'+n+':null');return o;}catch(e){return null;}};
  for(const [n,k] of [['AX','shield'],['BA','shield'],['HIP','shield'],['RH','shield'],['ZD','shield'],['ENH','shield']]){const o=g(n);if(o&&+o[k]>0)s+=+o[k];}
  try{const G=window.totemGems&&totemGems.fxs&&totemGems.fxs().GU;if(G&&G.sh>0&&(!G.shT||G.shT>gameTime-.001))s+=G.sh;}catch(e){}return s;}
setInterval(()=>{if(typeof player==='undefined'||!unlocked)return;const p=player,t=clock();
  for(const k in PSND){const on=!!(p.buffs&&p.buffs[k]&&p.buffs[k].t>0);if(on&&!STS.pb[k])play(PSND[k],{v:.85,gap:.5});STS.pb[k]=on;}
  const cc=(p.ccT||0)>0;if(cc&&!STS.cc&&p.ccK==='stun')play('st_stun',{v:.9,gap:1});STS.cc=cc;
  const sh=shieldSum();if(STS.sh>0&&sh<=0&&t-STS.hurtT<.35&&t>=STS.hurtT)play('st_shield',{v:1,gap:.6});STS.sh=sh;
  const low=p.hp>0&&p.maxHp>0&&p.hp/p.maxHp<.25&&t-STS.hurtT<8&&t>=STS.hurtT;
  if(low&&t-STS.hb>(p.hp/p.maxHp<.12?.7:.95)){STS.hb=t;play('st_heart',{v:.9,gap:.5,pv:0});}},100);

window.SFX={STS,shieldSum,famOf,mvRate,play,amb,mus,musOf,info,hero,stepName,ambOf,ST,vol,get log(){return LOG;},get ctx(){return ac;},unlock,L};
})();
