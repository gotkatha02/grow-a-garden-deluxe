/* =====================================================================
   TOTEM LEGEND — EXTRA SKILLS IN THE EMPTY SLOTS OF EVERY SKILL TREE  (owner 2026-11-19)
   The owner wanted more choice: 49 skill points, but many more skill levels to spend them on.
   Each hero gets enhancement skills that sit in the row of the skill they upgrade
   (a row holds up to 4 levels; ultimates get one 1-level enhancement; passive rows are left alone).
   Every hero's set follows its own play style (tank → shields, assassin → bleed / cooldowns,
   fox → tails, curse cat → hex, jackal → momentum / sin …). The wolf's were hand-made in index.html.

   Kinds (all flat numbers or counters — owner's rule: no percents):
     echo  [m…]        the skill strikes each target again 0.4 s later for ATK/MATK×m
     splash[m…],R      each hit also hurts enemies around the target
     flat  [v…]        ATK / MATK +v on this skill's hits
     vs    [v…],st     ATK / MATK +v against enemies with a status (slow, stun, bleed, poison, root, armor)
     cc    [s…],type   hits slow / stun / root for s seconds (bosses half)
     sp    [v…]        using the skill gives SP +v
     heal  [v…]        using the skill heals level × v
     shield[v…]        using the skill gives a shield of level × v (6 s)
     cdr   [v…]        using the skill cuts the other skills' cooldowns by v s
     buff  [v…],T      using the skill gives ATK / MATK +v for T s
     res   fn          hero-specific resource (tails, hex, souls, momentum, sin …)
   Damage numbers shown include the hero's coefficient like every other skill.
   ===================================================================== */
(function(){
const T=(k,name,kind,v,o)=>Object.assign({main:k,name,kind,v},o||{});
const ST_TH={slow:'ช้าลง',stun:'มึน',bleed:'เลือดไหล',poison:'ติดพิษ',root:'ถูกตรึง',armor:'เกราะแตก',frozen:'แช่แข็ง'};
const HERO={
 jaguar:[
  T('jgStep','Phantom Pounce','cdr',[1,2]),T('jgCountercut','Bloodied Riposte','buff',[25,45],{T:6}),T('jgCry','Pack Terror','cc',[1],{cc:'stun'}),
  T('jgFocus','Killing Calm','sp',[10,20]),T('jgExpose','Open Wound','vs',[30,55],{st:'armor'}),T('jgDrop','Death From Above','splash',[.5,.8],{R:80}),
  T('jgThrone','Throne of Bones','buff',[60],{T:8}),T('jgVeil','Veiled Fang','buff',[30,55],{T:5}),T('jgHorizon','Dusk Echo','echo',[.5,.8]),T('jgFifthSun','Eclipse Corona','cc',[1.5],{cc:'stun'})],
 rhino:[
  T('rhCharge','Stampede','cc',[.6,1],{cc:'stun'}),T('rhRoar','Herd Roar','shield',[4]),T('rhCrusher','Plate Breaker','vs',[30,55],{st:'armor'}),
  T('rhRevenge','Payback','heal',[1,1.5]),T('rhColossus','Stone Skin','shield',[4,7]),T('rhAbsolute','Living Fortress','shield',[10]),
  T('rhBone','Marrow Crack','echo',[.5,.8]),T('rhRush','Wrecking Rush','splash',[.5,.8],{R:80}),T('rhFury','Titan Blood','heal',[1.5,2.5]),
  T('rhSkybreaker','Crater Wave','splash',[.6,1],{R:110}),T('rhWorldbreaker','World Scar','cc',[1.5],{cc:'stun'})],
 axolotl:[
  T('axSlip','Wet Trail','heal',[.5,1]),T('axPop','Fizz Pop','cc',[1.5],{cc:'slow'}),T('axRinse','Rinse Again','shield',[3]),
  T('axSaw','Spin Spray','splash',[.4],{R:70}),T('axCollapse','Undertow','cc',[1,1.5],{cc:'slow'}),T('axCannon','Pressure Wake','vs',[30,55],{st:'slow'}),
  T('axHeart','Tidal Pulse','buff',[50],{T:8}),T('asMist','Dew Shield','shield',[3]),T('asPurify','Clear Spring','sp',[10,20]),
  T('asCushion','Soft Bubble','heal',[1,1.5]),T('asLift','Bubble Trap','cc',[.6,1],{cc:'stun'}),T('asFloat','Lifebuoy','shield',[3,5]),
  T('asRenewal','Spring Rain','cdr',[1,2]),T('asMiracle','Lotus Halo','shield',[8])],
 croc:[
  T('crBite','Bone Grind','echo',[.5]),T('crTail','Tail Lash','cc',[1],{cc:'slow'}),T('crScales','Riverstone Scales','shield',[3,5]),
  T('crStride','Ambush Glide','buff',[25,45],{T:5}),T('caFracture','Weak Point','vs',[40],{st:'armor'}),T('caCrescent','Sun Arc','splash',[.4,.7],{R:70}),
  T('caHook','Drag Hook','cc',[.8,1.2],{cc:'root'}),T('caEdge','Glass Edge','buff',[30,55],{T:6}),T('caBoundary','Temple Ground','shield',[3,5]),
  T('caExecution','Final Rite','vs',[40,70],{st:'root'}),T('caSunpiercer','Noon Sun','buff',[60],{T:8}),T('cbTailBreaker','Bone Splinter','cc',[1],{cc:'slow'}),
  T('cbRip','Open Artery','vs',[30,55],{st:'bleed'}),T('cbBodyCrush','River Weight','cc',[.6,1],{cc:'stun'}),T('cbIronJaws','Iron Gullet','heal',[1,1.5]),
  T('cbDrag','Deep Water','echo',[.5,.8]),T('cbLunge','Apex Hunger','vs',[40,70],{st:'bleed'}),T('cbFrenzy','Feeding Frenzy','heal',[4])],
 cat:[
  T('knStep','Shadow Paw','cdr',[1,2]),T('knSheath','Second Draw','echo',[.4,.7]),T('knKi','Deep Breath','sp',[15]),T('knFocus','Hunter Eye','buff',[40],{T:6}),
  T('kaMirage','Phantom Cut','echo',[.5]),T('kaSakura','Falling Blossom','cdr',[1,2]),T('kaCrescent','Wind Scar','splash',[.4,.7],{R:70}),
  T('kaGale','Still Water','sp',[10,20]),T('kaTempest','Thousand Flashes','echo',[.6,1]),T('kaHana','Petal Storm','cdr',[3]),
  T('kbSky','Mountain Fall','cc',[.6,1],{cc:'stun'}),T('kbRoar','Demon Shout','buff',[30,55],{T:6}),T('kbQuake','Fault Line','splash',[.5,.8],{R:90}),
  T('kbExec','Oni Verdict','vs',[40,70],{st:'stun'}),T('kbAshura','Six Arms','buff',[60],{T:8})],
 hippo:[
  T('hnWaddle','Belly Bump','cc',[.5,.8],{cc:'stun'}),T('hnYawn','Big Yawn','cc',[1,1.5],{cc:'slow'}),T('hnNap','Sweet Dreams','shield',[4]),T('hnFeast','Second Helping','heal',[2]),
  T('haBounce','Aftershock','splash',[.5],{R:90}),T('haWard','Mother\'s Shield','shield',[4,7]),T('haPound','Mud Quake','cc',[1,1.5],{cc:'slow'}),
  T('haRoll','Snowball','splash',[.4,.7],{R:70}),T('haMountain','Landslide','echo',[.5,.8]),T('haBehemoth','River Titan','shield',[10]),
  T('hbWave','Undertow Wave','cc',[1.5],{cc:'slow'}),T('hbBounty','Flood Feast','heal',[1.5,2.5]),T('hbGeyser','Steam Burst','cc',[.6,1],{cc:'stun'}),
  T('hbQuick','Sinking Sand','vs',[30,55],{st:'slow'}),T('hbWrath','Nile Fury','echo',[.6,1]),T('hbSea','Black Silt','heal',[4])],
 sheep:[
  T('snLight','Bright Bead','cc',[1],{cc:'slow'}),T('snHop','Cloud Step','shield',[2,4]),T('snChannel','Quiet Prayer','sp',[15]),
  T('saShield','Thick Fleece','heal',[1.5]),T('saAegis','Owl Feather','shield',[3,5]),T('saSanct','Holy Ground','cdr',[1,2]),
  T('saHermes','Winged Dash','sp',[10,20]),T('saHand','Gentle Touch','shield',[3,5]),T('saOlympus','Olympian Choir','shield',[8]),
  T('sbHex','Deep Hex','vs',[30,55],{st:'slow'}),T('sbSong','Battle Hymn','buff',[30,55],{T:8}),T('sbRam','Golden Horns','cc',[.6,1],{cc:'stun'}),
  T('sbSiren','Drowning Song','cc',[1,1.5],{cc:'slow'}),T('sbCauldron','Bitter Brew','vs',[30,55],{st:'poison'}),T('sbColchis','Dragon\'s Fleece','buff',[60],{T:8})],
 owl:[
  T('owGuard','Down Feathers','shield',[3,5]),T('owHop','Silent Wing','cdr',[1,2]),T('owLantern','Moon Lantern','sp',[10,20]),
  T('obSnare','Hard Frost','vs',[30,55],{st:'slow'}),T('obSkyfall','Hail Mark','cc',[1,1.5],{cc:'slow'}),T('obCircle','Night Talon','echo',[.4,.7]),T('obFlash','White Out','cc',[.6,1],{cc:'stun'})],
 dragon:[
  T('dnGuard','Stone Lion','shield',[4]),T('dnRush','Horn Break','cc',[.8],{cc:'stun'}),T('dnBreath','Still Lake','sp',[10,20]),T('dnRoar','Shishi Roar','buff',[40],{T:6}),
  T('daHundred','Endless Tide','echo',[.5]),T('daEbb','Turning Tide','cdr',[1,2]),T('dkTwin','Twin Thunder','splash',[.5],{R:80}),T('dkPush','Heaven Gate','cc',[1],{cc:'stun'}),T('dkMirror','Moon in Water','shield',[3,5])],
 lion:[
  T('lnHide','Golden Fleece Hide','shield',[4]),T('lnPounce','Mane Crash','cc',[.8],{cc:'stun'}),T('lnRest','Ambrosia','heal',[1,2]),T('lnRoar','King of Beasts','buff',[40],{T:6}),
  T('laSpin','Crowd Roar','splash',[.5],{R:90}),T('laCounter','Iron Grip','buff',[30,55],{T:5}),T('lbCloud','Thunderhead','cc',[1],{cc:'stun'}),T('lbOver','Static Surge','sp',[20]),T('lbAegis','Aegis Bolt','shield',[3,5])],
 kitsune:[
  T('knStep','Fox Fire Step','res',[1],{res:'kiTail',th:'หาง +1'}),T('knWard','Fox Charm','sp',[15]),T('knBless','Inari Rice','shield',[2,4]),T('knTorii','Thousand Gates','cdr',[2]),
  T('kaRain','Ember Bloom','res',[1],{res:'kiTail',th:'หาง +1 เพิ่ม'}),T('kaVeil','Fox Mirage','res',[1,2],{res:'kiTail',th:'หาง +1 / +2'}),
  T('kbCircle','Tide of the Moon','vs',[40],{st:'slow'}),T('kbStar','Comet Tail','splash',[.4],{R:70}),T('kbMoonlight','Silver Veil','cdr',[1,2])],
 bastet:[
  T('bnGrace','Nine Lives','heal',[1.5]),T('bnVeil','Desert Mirage','sp',[15]),T('bnAnkh','Breath of Ra','shield',[2,4]),T('bnObelisk','Sun Disk','buff',[40],{T:8}),
  T('baApep','Coils of Apep','res',[1],{res:'baHex',th:'คำสาป +1 เพิ่ม'}),T('baWrap','Burial Linen','res',[1,2],{res:'baHex',th:'คำสาป +1 / +2 เพิ่ม'}),
  T('bbAnubis','Jackal Howl','res',[1],{res:'bbSoul',th:'วิญญาณ +1'}),T('bbGate','Tomb Door','res',[1,2],{res:'bbSoul',th:'วิญญาณ +1 / +2'})],
 anubis:[
  T('anLunge','Jackal Snap','echo',[.4]),T('anWraps','Sealed Linen','heal',[1.5]),T('anRite','Oils of Anubis','shield',[2,4]),T('anStandard','Banner of Ra','sp',[15]),
  T('aaMeteor','Second Orbit','res',[1],{res:'anMom',th:'แรงเหวี่ยง +1 เพิ่ม'}),T('aaGuard','Ring of Chains','res',[2,3],{res:'anMom',th:'แรงเหวี่ยง +2 / +3'}),
  T('abPounce','Heavy Heart','res',[1],{res:'anSin',th:'บาป +1 เพิ่ม'}),T('abGate','Gate of Judgment','res',[1,2],{res:'anSin',th:'บาป +1 / +2 กับผู้ถูกตัดสิน'})]};
/* hero resources the 'res' kind can feed */
const RES={
 kiTail:(n)=>{if(typeof kTail==='function')kTail(n);},
 baHex:(n,e)=>{if(e&&typeof bAddHex==='function')bAddHex(e,n);},
 bbSoul:(n)=>{if(typeof bSoul==='function')bSoul(n);},
 anMom:(n)=>{if(typeof uMom==='function')uMom(n);},
 anSin:(n,e)=>{const t=e||(window.ANU&&ANU.cond);if(t&&typeof uSin==='function')uSin(t,n);}};
const ENH={byMain:{},list:[],shield:0,shieldT:0,cast:{},castId:0,cdrT:{}};window.ENH=ENH;
const lvV=(d,lv)=>d.v[Math.min(lv,d.v.length)-1];
const num=v=>(+v).toFixed(2).replace(/0+$/,'').replace(/\.$/,'');
function stat(main){try{const t=skDT(main);return t==='m'||t==='h'||(t==='b'&&D.mag>D.patk)?'MATK':'ATK';}catch(e){return 'ATK';}}
function line(d,lv){const v=lvV(d,lv),S=stat(d.main);
  switch(d.kind){case 'echo':return `ตีซ้ำแต่ละเป้าหลัง 0.4 วิ ${S}×${num(v)}`;case 'splash':return `ศัตรูรอบเป้า (รัศมี ${d.R}) โดน ${S}×${num(v)}`;
   case 'flat':return `${S} +${v} กับสกิลนี้`;case 'vs':return `${S} +${v} กับศัตรูที่${ST_TH[d.st]||d.st}`;
   case 'cc':return `ศัตรูที่โดน${ST_TH[d.cc]||d.cc} ${v} วิ (บอสครึ่งเดียว)`;case 'sp':return `ใช้สกิลแล้ว SP +${v}`;
   case 'heal':return `ใช้สกิลแล้วฟื้น HP = เลเวล × ${v}`;case 'shield':return `ใช้สกิลแล้วได้โล่ = เลเวล × ${v} นาน 6 วิ`;
   case 'cdr':return `ใช้สกิลแล้ว คูลดาวน์สกิลอื่นลด ${v} วิ (ทุก 10 วิ ครั้งเดียว)`;case 'buff':return `ใช้สกิลแล้ว ${S} +${v} นาน ${d.T} วิ`;case 'res':return d.th||'';}return '';}
const ON_HIT=new Set(['echo','splash','cc','vs','flat']);
function install(){const L=HERO[CHAR];if(!L||typeof SKILLS==='undefined')return;
  const rowLv=k=>{let n=SKILLS[k].max;for(const f in SKILLS)if(SKILLS[f].parent===k||SKILLS[f].enh===k)n+=SKILLS[f].max;return n;};
  L.forEach((d,i)=>{const m=SKILLS[d.main];if(!m||m.passive)return;const used=rowLv(d.main);let max=m.ult?1:Math.min(2,4-used);if(max<1)return;max=Math.min(max,d.v.length>1?2:1)||1;
    const key='ex_'+d.main;if(SKILLS[key])return;d.key=key;d.max=max;
    /* hit effects need a skill that hits; a skill with no hits gets its effect on use instead */
    const sk={id:(m.id||'X')+'+',name:d.name,br:m.br,row:m.row,max,passive:1,enh:d.main,icon:Array.isArray(m.icon)?[m.icon[0],'#ffe9a8',m.icon[2]||'#2a1a10']:m.icon,th:line(d,1).slice(0,40),xtra:1};
    if(m.col)sk.col=m.col;SKILLS[key]=sk;LV[key]=max;
    /* painted icon if one exists: assets/icons/<hero>/ex_<main>.webp */
    if(typeof SKILL_ICON_ART!=='undefined'){const im=new Image(),src='assets/icons/'+CHAR+'/'+key+'.webp';im.onload=()=>{SKILL_ICON_ART[d.name]=src;if(typeof buildSkillWin==='function')try{buildSkillWin();}catch(_){}};im.src=src;}
    try{SK_DT[key]=skDT(d.main);}catch(e){}
    const desc={d:`(ต่อยอด ${m.name}) `+({echo:'ฟันซ้ำ',splash:'กระแทกรอบเป้า',flat:'แรงขึ้น',vs:'แรงขึ้นกับศัตรูที่ติดสถานะ',cc:'ติดสถานะ',sp:'คืน SP',heal:'ฟื้นเลือด',shield:'ได้โล่',cdr:'เร่งคูลดาวน์',buff:'เสริมพลัง',res:'เพิ่มพลังประจำสาย'}[d.kind]||''),lv:{}};
    for(let l=1;l<=max;l++)desc.lv[l]=[line(d,l)];
    (window.JG_DESC||(window.JG_DESC={}))[key]=desc;if(typeof SKILL_DESC!=='undefined'&&CHAR==='wolf')SKILL_DESC[key]=desc;
    (ENH.byMain[d.main]=ENH.byMain[d.main]||[]).push(d);ENH.list.push(d);});
  /* hits */
  const _hurt=hurt;
  hurt=function(e,mult,o={}){const key=o.skill||window.SKCTX||(player.action&&player.action.skill)||(player.action&&player.action.key);const E=key&&ENH.byMain[key];
    if(!E||e.dead)return _hurt(e,mult,o);
    let add=0;for(const d of E){const lv=LV[d.key]||0;if(!lv)continue;if(d.kind==='flat')add+=lvV(d,lv);else if(d.kind==='vs'&&e.st&&e.st[d.st]>0)add+=lvV(d,lv);}
    if(add){const mg=hitIsMagic(o),base=Math.max(1,mg?D.mag:D.patk);mult*=(base+add)/base;}
    const r=_hurt(e,mult,o);
    for(const d of E){const lv=LV[d.key]||0;if(!lv)continue;const v=lvV(d,lv);
      if(d.kind==='echo'){const tk='_ex'+d.key;if(e[tk]===ENH.castId)continue;e[tk]=ENH.castId;   /* once per target per use */setFxTimer(.4,()=>{if(e.dead)return;addFx(new Impact({pos:[e.x,e.y,24],size:26,color:'#ffe9a8',core:'#ffffff',rays:6,life:.15}));_hurt(e,v,{skill:d.key,br:o.br});});}
      else if(d.kind==='splash'){if(ENH.cast[d.key]===ENH.castId)continue;ENH.cast[d.key]=ENH.castId;   /* once per use, around the first target hit */addFx(new GRing({x:e.x,y:e.y,r0:10,r1:d.R,w:6,color:'#ffe9a8',life:.3}));for(const q of enemies)if(q!==e&&!q.dead&&Math.hypot(q.x-e.x,q.y-e.y)<d.R+q.r)_hurt(q,v,{skill:d.key,br:o.br});}
      else if(d.kind==='cc'&&!e.dead){if(d.cc==='root'){if(e.boss)applyCC(e,{slow:v*1.5});else{e.st.root=Math.max(e.st.root||0,v);}}else applyCC(e,{[d.cc]:v});}
      else if(d.kind==='res'&&(d.res==='baHex'||d.res==='anSin')){const tk='_ex'+d.key;if((e[tk]||-9)>gameTime-.5)continue;e[tk]=gameTime;RES[d.res](v,e);}}
    return r;};
  /* use */
  const _cast=castSkillNow;
  castSkillNow=function(key,c){ENH.castId=(ENH.castId||0)+1;const r=_cast(key,c);const E=ENH.byMain[key];if(r===false||!E)return r;
    for(const d of E){const lv=LV[d.key]||0;if(!lv)continue;const v=lvV(d,lv);
      switch(d.kind){case 'sp':player.mp=Math.min(player.maxMp,player.mp+v);break;
       case 'heal':{const h=Math.round(PS.lv*v);player.hp=Math.min(player.maxHp,player.hp+h);dmgNum(player.x,player.y,80,'+'+h,'heal');break;}
       case 'shield':ENH.shield=Math.round(PS.lv*v);ENH.shieldT=gameTime+6;addFx(new GRing({x:player.x,y:player.y,r0:10,r1:46,w:5,color:'#ffe9a8',life:.35}));break;
       case 'cdr':{if((ENH.cdrT[d.key]||-99)>gameTime)break;ENH.cdrT[d.key]=gameTime+10;for(const k in player.cd)if(k!==key&&player.cd[k]>0)player.cd[k]=Math.max(0,player.cd[k]-v);break;}   /* at most once every 10 s */
       case 'buff':ENH.buffV=v;ENH.buffT=gameTime+d.T*(D.buffMul||1);addBuff('exBuff',d.T);break;
       case 'res':if(d.res!=='baHex'&&d.res!=='anSin')RES[d.res](v);else if(d.res==='anSin')RES.anSin(v);break;
       default:if(!ON_HIT.has(d.kind))break;}}
    return r;};
  if(typeof BUFFDEF!=='undefined')BUFFDEF.exBuff={n:'Empowered',c:'#ffe9a8',i:'UP'};}
/* generic shield + empowered buff, used by hitPlayer / hurt in index.html */
window.ENH_ABSORB=d=>{if(ENH.shield>0&&ENH.shieldT>gameTime){const a=Math.min(ENH.shield,d);ENH.shield-=a;d-=a;}return d;};
window.ENH_FLAT=()=>(ENH.buffT>gameTime&&typeof hasBuff==='function'&&hasBuff('exBuff'))?ENH.buffV||0:0;
window.ENH_INSTALL=install;window.ENH_HERO=HERO;
})();
