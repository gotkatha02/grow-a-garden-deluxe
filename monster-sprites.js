/* =====================================================================
   AETHERFALL — DRAWN MONSTER SPRITE SHEETS (ChatGPT 5-row sheets, processed by tools/monsheet.py)
   Sheet: 5 rows × 5 cells — idle 4 · walk 4 · attack 5 · hurt 2 · death 5 — every cell cw×ch, feet at (px,py).
   Art faces down-right; facing left = mirrored. (Back view not used yet.)
   h  = on-map height in world px (the hero is about 46). Sizes differ per monster, but are kept at or below
        about half of the drawn height so the art is always scaled DOWN, never blown up (stays sharp when zoomed in).
   sw = shadow width. fly = floats (shadow stays on the ground, a little smaller).
   To add a monster: run tools/monsheet.py on the sheet, put the .webp in assets/monsters/, add a line here
   keyed by the monster's name exactly as in the map files (VK_MONS / monster-roster.js).
   ===================================================================== */
(function(){
const S=(file,cw,ch,px,py,ref,h,o)=>Object.assign({file,cw,ch,px,py,ref,h,sw:h*.55},o||{});
const MS={
  'Pinecone Sprite':  S('pineconeSprite',267,199,131,197,168,34),
  'Fang Hare':        S('fangHare',225,195,112,193,170,34),
  'Big Frostling':    S('bigFrostling',272,231,133,229,183,54),
  'Icicle Bat':       S('icicleBat',256,177,126,175,169,36,{fly:1}),
  'Rune Wisp':        S('runeWisp',239,181,103,179,168,38,{fly:1}),
  'Moor Wolf':        S('moorWolf',256,197,130,195,178,46,{sw:34}),
  'Runestone Golem':  S('runestoneGolem',306,223,137,221,175,74),
  'Ice Crab':         S('iceCrab',282,206,130,204,173,34,{sw:26}),
  'Fjord Seal Spirit':S('sealSpirit',286,173,132,171,163,40,{sw:30}),
  'Narwhal Raider':   S('narwhalRaider',305,201,141,199,187,52),
  'Hound of the Raiders':S('raiderHound',279,188,140,186,173,46,{sw:34}),
  'Raider Hound':     S('raiderHound',279,188,140,186,173,46,{sw:34}),
  'Lost Villager':    S('lostVillager',290,207,139,205,187,54,{fly:1}),
  'Thatch Troll':     S('thatchTroll',306,216,133,214,188,66,{walk:12}),
  'Yeti Cub':         S('yetiCub',280,198,126,196,182,46,{walk:12}),
  'Avalanche Ram':    S('avalancheRam',301,200,151,198,181,48,{sw:34,walk:12}),
  'Mad Dwarf Ghost':  S('madDwarfGhost',280,235,138,233,187,42,{fly:1}),
  'Ore Golem':        S('oreGolem',308,212,153,210,177,70,{walk:12}),
  'Lamp Beetle':      S('lampBeetle',246,193,122,191,171,34,{walk:12,sw:26}),
  'Forge Golem':      S('forgeGolem',289,211,141,209,176,70,{walk:12}),
  'Ice Bat Pack':     S('iceBatPack',274,194,140,192,130,38,{walk:12,fly:1,sw:30}),
  'Runesmith Revenant':S('runesmithRevenant',257,212,128,210,175,50,{walk:12}),
  'Forest Witchling': S('forestWitchling',314,200,139,198,169,42,{walk:12}),
  'Blackpine Treant': S('blackpineTreant',300,219,142,217,178,72,{walk:12}),
  'Young Yeti':       S('youngYeti',297,202,142,200,183,70,{walk:12}),
  'Tundra Wolf':      S('tundraWolf',330,195,150,193,179,50,{walk:12,sw:36}),
  'Frost Mammoth Calf':S('mammothCalf',298,211,147,209,172,62,{sw:40,walk:12}),
  /* 2026-11-22 monster art v2: the owner's own sheets (tools/monsheet2.py), replacing catalog pixel art */
  "Glacier Wyrmling":S('glacierWyrmling',314,227,156,207,169,62),
  "Dark Valkyrie Wolf":S('darkValkyrieWolf',320,211,161,204,185,60),
  "Frost Giant":S('frostGiant',318,225,141,208,177,84),
  "Drowned Shieldmaiden":S('drownedShieldmaiden',330,198,144,195,184,52),
  "Sea Ghost Wolf":S('seaGhostWolf',307,203,163,192,172,48),
  "Undying Viking":S('undyingViking',306,223,145,212,185,66),
  "Wolf High Priest":S('wolfHighPriest',353,204,213,195,190,54),
  "Fenrir Guard":S('fenrirGuard',310,211,150,198,177,62),
  "Chain Wraith":S('chainWraith',324,196,143,190,180,48,{fly:1}),
  "Draugr":S('draugr',284,199,135,191,181,52),
  "Bone Archer":S('boneArcher',287,243,142,208,170,50),
  "Wraith Knight":S('wraithKnight',318,217,154,204,178,58),
  "Crypt Spider":S('cryptSpider',325,214,157,195,149,42),
  "Sewer Rat":S('sewerRat',312,235,153,197,150,34),
  "Skeleton Soldier":S('skeletonSoldier',313,216,154,204,187,50),
  "Frog Bandit":S('frogBandit',307,211,150,199,176,40),
  "Rusted Soldier":S('rustedSoldier',321,221,157,209,192,50),
  "Water Sprite":S('waterSprite',324,212,160,203,193,42,{fly:1}),
  "Scarecrow Knight":S('scarecrowKnight',318,210,167,201,199,52),
  "Giant Crow":S('giantCrow',337,208,166,201,198,46),
  "Haunted Mill Spirit":S('hauntedMillSpirit',276,242,142,233,231,50,{fly:1}),
  "Antler Beetle":S('antlerBeetle',331,206,173,192,158,36),
  "Golden Stag":S('goldenStag',289,216,151,209,179,56),
  "Wild Boar":S('wildBoar',295,221,147,209,174,44),
  "Wild Rooster":S('wildRooster',287,204,147,199,179,36),
  "Giant Bee":S('giantBee',255,193,128,184,158,34,{fly:1}),
  "Wild Bull":S('wildBull',290,207,155,199,172,56),
  "Dandelion Puff":S('dandelionPuff',282,205,143,178,153,30,{fly:1}),
  "Meadow Slime":S('meadowSlime',345,181,221,172,145,32),
  "Field Hawk":S('fieldHawk',293,211,144,182,180,38,{fly:1}),
  "Field Rabbit":S('fieldRabbit',212,199,110,194,170,30),
  "Plains Wolf":S('plainsWolf',279,179,142,171,168,44),
  "Wild Horse":S('wildHorse',277,227,139,221,174,56),
  "Pass Wolf":S('passWolf',277,205,147,196,177,46),
  "Gleipnir Weaver":S('gleipnirWeaver',307,200,152,188,184,44),
  "Shadow Wolf":S('shadowWolf',297,189,160,184,178,46),
  "Wolf Priest":S('wolfPriest',290,203,131,200,176,50),
  "Snow Pup":S('snowPup',241,205,123,199,172,30),
  "Draugr Wolf":S('draugrWolf',293,190,154,181,167,46),
  /* 2026-11-22 Aztec sheets (tools/monsheet2.py W mode: frames found from the dark outlines) */
  "Volcano Salamander":S('volcanoSalamander',366,210,140,188,168,50),
  "Fire Bird":S('fireBird',425,224,140,221,185,50,{fly:1}),
  "Obsidian Golem":S('obsidianGolem',376,215,147,204,182,74),
  "Golden Serpent":S('goldenSerpent',345,205,151,200,198,46),
  "Obsidian Priest":S('obsidianPriest',447,207,139,204,198,52),
  "Jade Golem":S('jadeGolem',460,203,174,194,185,70),
  "Sun Sentinel":S('sunSentinel',382,202,138,198,189,54),
  "Temple Jaguar":S('templeJaguar',359,208,171,201,184,50),
  "Obsidian Jaguar":S('obsidianJaguar',346,207,158,200,198,52),
  "Jungle Titan":S('jungleTitan',372,216,154,213,187,80),
  "Golden Statue":S('goldenStatue',434,215,147,212,190,70),
  "Jaguar King":S('jaguarKing',474,206,164,197,191,62),
  "Sun Guardian":S('sunGuardian',450,212,145,205,197,62),
  "Sunfeather Priestess":S('sunfeatherPriestess',424,215,143,204,191,52),
  "Sun Priest":S('sunPriest',385,212,178,206,204,52),
  "Eagle Warrior":S('eagleWarrior',367,211,140,206,204,52),
  "Blood Priest":S('bloodPriest',437,214,149,206,201,52),
  "Jaguar Warrior":S('jaguarWarrior',323,202,138,189,187,52),
  "Rain Spirit":S('rainSpirit',398,218,136,208,200,50,{fly:1}),
  "Dart Shaman":S('dartShaman',372,194,130,188,185,46),
  "Cave Shaman":S('caveShaman',360,197,138,193,191,44),
  "Stone Slave":S('stoneSlave',317,203,154,199,180,64),
  "Cave Spider":S('caveSpider',335,188,147,184,172,44),
  "Glowworm Swarm":S('glowwormSwarm',363,192,124,185,173,38,{fly:1}),
  "Giant Bat":S('giantBat',358,198,179,190,179,48,{fly:1}),
  "Vine Snapper":S('vineSnapper',333,197,158,194,189,50),
  "Lost Priest":S('lostPriest',346,208,128,203,195,50,{fly:1}),
  "Black Jaguar":S('blackJaguar',328,211,145,204,201,48),
  "Macaw Raider":S('macawRaider',362,205,148,202,200,44),
  "Stone Mask Warrior":S('stoneMaskWarrior',360,204,138,198,196,50),
  "Giant Frog":S('giantFrog',331,205,139,199,197,44),
  "Swamp Leech":S('swampLeech',363,183,163,177,175,34),
  "Feathered Serpent":S('featheredSerpent',365,214,172,211,209,46),
  "Scarecrow God":S('scarecrowGod',273,198,125,195,189,50),
  "Young Crocodile":S('youngCrocodile',331,208,142,200,198,48),
  "Maize Rat":S('maizeRat',262,181,130,178,169,30),
  "Baby Tapir":S('babyTapir',233,186,115,181,144,34),
  "Howler Monkey":S('howlerMonkey',261,199,125,195,168,36),
  "Quetzal":S('quetzal',309,224,163,212,208,34,{fly:1}),
  "Wild Axolotl":S('wildAxolotl',272,188,148,180,160,30),
  "Dart Frog":S('dartFrog',242,175,105,166,120,24),
  "Leafcutter Ant":S('leafcutterAnt',248,191,121,185,162,26),
  /* 2026-11-22 Greek sheets (monsheet2.py W) */
  "Mountain Goat":S('mountainGoat',345,192,129,187,174,38),
  "Olive Sprite":S('oliveSprite',261,203,106,195,175,32),
  "Marble Crab":S('marbleCrab',288,186,131,180,171,36),
  "Walking Statue":S('walkingStatue',311,207,126,200,184,52),
  "Honey Bee":S('honeyBee',353,199,109,195,185,28,{fly:1}),
  "Satyr":S('satyr',235,205,128,201,184,42),
  "Olive Beetle":S('oliveBeetle',233,183,112,177,155,28),
  "Wild Lamb":S('wildLamb',215,189,111,184,160,30),
  "Nymph":S('nymph',336,198,126,193,182,50),
  "Cracked Soldier":S('crackedSoldier',297,205,160,200,190,52),
  "Young Centaur":S('youngCentaur',299,207,131,201,191,58),
  "Philosopher Ghost":S('philosopherGhost',381,212,124,204,187,50,{fly:1}),
  "Little Medusa":S('littleMedusa',347,199,133,192,184,40),
  "Griffin":S('griffin',290,193,144,190,175,62),
  "Bronze Automaton":S('bronzeAutomaton',286,206,136,197,189,54),
  "Siren":S('siren',360,220,150,215,213,48),
  "Triton Scout":S('tritonScout',318,205,146,200,187,50),
  "Gorgon Shade":S('gorgonShade',311,212,134,205,198,52),
  "Harpy":S('harpy',298,204,143,196,189,46,{fly:1}),
  "Black Wolf":S('blackWolf',296,209,144,201,184,46),
  "Erymanthian Boar":S('erymanthianBoar',354,209,148,203,190,62),
  "Little Cyclops":S('littleCyclops',336,207,133,202,185,42),
  "Giant Ram":S('giantRam',337,208,150,199,195,60),
  "Rock Lizard":S('rockLizard',334,196,156,191,178,36),
  "Cave Bat":S('caveBat',338,205,170,198,185,36,{fly:1}),
  "Cyclops":S('cyclops',322,216,161,208,192,78),
  "Cave Hound":S('caveHound',340,201,165,196,176,46),
  "Hecate Witch":S('hecateWitch',285,213,142,203,192,52),
  'Fenrir Spawn':     S('fenrirSpawn',274,203,138,201,182,44,{walk:12,sw:32}),
  /* sea (Lv 60–70, SEA_ZONE_TH.md): sheets in 2026-11-25, maps not built yet — cut by `python3 -I tools/sea_art.py mon` */
  "Goldshell Hermit Crab":S('goldshellHermitCrab',238,189,104,185,174,34),
  "Coconut Crab Brute":S('coconutCrabBrute',329,214,146,203,192,70,{sw:46}),
  "Thief Gull":S('thiefGull',281,215,135,186,167,36,{fly:1}),
  "Tidepool Starfish":S('tidepoolStarfish',251,202,122,192,175,34),
  "Foam Sprite":S('foamSprite',274,213,138,195,182,38,{fly:1}),
  "Lagoon Ray":S('lagoonRay',317,193,139,177,168,46,{fly:1,sw:40}),
  "Shellback Turtle":S('shellbackTurtle',309,209,137,201,191,46,{sw:40}),
  "Barnacle Golem":S('barnacleGolem',325,207,149,201,182,72,{sw:46}),
  "Net Wraith":S('netWraith',332,211,156,198,184,54,{fly:1}),
  "Barrel Mimic":S('barrelMimic',292,206,137,199,178,38),
  "Drowned Oarsman":S('drownedOarsman',309,222,145,207,188,54)};
/* 2026-11-27 2.5D monster sheets (monster25.js, made by tools/monster25_prompts.py cut) replace the flat sheet of the same name;
   same h / fly / sw as the flat one, so sizes and hit boxes do not change. ?mon25=0 = the flat sheets. */
if(window.MS25&&!/[?&]mon25=0(&|$)/.test(location.search))for(const k in MS25){const o=MS25[k];MS[k]=Object.assign({sw:o.h*.55},o);}
const ROW={idle:0,walk:1,attack:2,hurt:3,death:4};
/* walk:N = a separate smooth walk strip assets/monsters/<file>_walk.webp (N frames, same cell size), made from a walk video by tools/vidwalk.py */
/* 2026-11-20 load time: a sheet is downloaded the first time its monster is looked at (was: all 30 sheets, 11 MB, at every start) */
const MSLD={};
/* a sheet counts as loaded only once it is decoded (done off the main thread), so the first monster of a kind that walks into view does not freeze a frame */
function msReady(im,f){if(im.decode)im.decode().then(f,f);else f();}
function msLoad(m,walk){let s=MSLD[m.file];if(!s){s=MSLD[m.file]={ok:0,wok:0,img:new Image(),wimg:null};s.img.onload=()=>msReady(s.img,()=>{s.ok=1;});s.img.src='assets/monsters/'+m.file+'.webp';}
  if(walk&&m.walk&&!s.wimg){s.wimg=new Image();s.wimg.onload=()=>msReady(s.wimg,()=>{s.wok=1;});s.wimg.src='assets/monsters/'+m.file+'_walk.webp';}return s;}
for(const k in MS){const m=MS[k];Object.defineProperties(m,{ok:{get:()=>msLoad(m,1).ok},wok:{get:()=>msLoad(m,1).wok},img:{get:()=>msLoad(m).img},wimg:{get:()=>msLoad(m,1).wimg}});}
const def=e=>e&&(e.vdef&&MS[e.vdef.name]||e.spr&&MS[e.spr]);   /* e.spr: sprite name for monsters made outside the map tables (world boss) */
window.MSPR_HAS=e=>{const m=def(e);return !!(m&&m.ok);};
const BK=e=>e.boss?(e.bsc||1.5):1;   /* boss size: 1.5×, or e.bsc (map_bosses.js stand-ins 1.9×) */
window.MSPR_H=e=>{const m=def(e);return m?m.h*BK(e):54;};
function frame(e,m){const t=gameTime,ph=e.bob||0;
  if(e.dead)return [ROW.death,Math.min(4,Math.floor(e.deadT/.16))];
  if(e.st&&e.st.frozen>0)return [ROW.idle,0];
  if(e.atk>0)return [ROW.attack,e.atk>.3?0:1];                      // wind-up: crouch → hold
  const ha=t-(e._hitT??-9);if(ha<.42)return [ROW.attack,ha<.14?2:ha<.28?3:4];   // strike → follow-through → recover
  const hu=t-(e._hurtT??-9);if(hu<.32)return [ROW.hurt,hu<.16?0:1];if(e.st&&e.st.stagger>0)return [ROW.hurt,0];
  if(e._mv>0){if(m&&m.wok)return ['W',Math.floor((e._wp||0)*m.walk)%m.walk];return [ROW.walk,Math.floor((e._wp||0)*4)%4];}          // walk frames follow the distance actually walked (no sliding feet)
  return [ROW.idle,Math.floor((t+ph)*4.5)%4];}
const tintC=document.createElement('canvas'),tg=tintC.getContext('2d');

/* ---- CLIP sprites: each animation cut from its own video by tools/vidclips.py (one frame grid per animation).
   Loaded only when that monster first appears. Bosses drive the animation themselves through e.clipA={k,t,rev};
   normal monsters pick idle / walk / attack / death from their state. ---- */
const CLIPS={
  fenrir:{"ref":200,"idle":{"f":"fenrirBoss_idle","cw":276,"ch":209,"px":151,"py":203,"n":16,"cols":8,"fps":10,"loop":1},"walk":{"f":"fenrirBoss_walk","cw":271,"ch":216,"px":150,"py":207,"n":16,"cols":8,"fps":12,"loop":1},"claw":{"f":"fenrirBoss_claw","cw":418,"ch":336,"px":213,"py":227,"n":26,"cols":8,"fps":12,"hit":10},"leap":{"f":"fenrirBoss_leap","cw":418,"ch":367,"px":213,"py":309,"n":38,"cols":8,"fps":12,"hit":21,"hold":[9,21]},"breath":{"f":"fenrirBoss_breath","cw":391,"ch":316,"px":186,"py":208,"n":41,"cols":8,"fps":12,"hit":20,"beam":[20,35]},"vanish":{"f":"fenrirBoss_vanish","cw":416,"ch":354,"px":212,"py":308,"n":33,"cols":8,"fps":16},"orb":{"f":"fenrirBoss_orb","cw":357,"ch":311,"px":196,"py":303,"n":31,"cols":8,"fps":12,"hit":24},"howl":{"f":"fenrirBoss_howl","cw":418,"ch":333,"px":213,"py":308,"n":42,"cols":8,"fps":12,"hit":11},"death":{"f":"fenrirBoss_death","cw":416,"ch":355,"px":213,"py":309,"n":34,"cols":8,"fps":9}},
  shadeHound:{"ref":130,"idle":{"f":"shadeHound_idle","cw":176,"ch":146,"px":95,"py":139,"n":12,"cols":8,"fps":10,"loop":1},"walk":{"f":"shadeHound_walk","cw":177,"ch":147,"px":95,"py":144,"n":12,"cols":8,"fps":12,"loop":1},"attack":{"f":"shadeHound_attack","cw":244,"ch":227,"px":120,"py":184,"n":21,"cols":8,"fps":12,"hit":11},"death":{"f":"shadeHound_death","cw":211,"ch":165,"px":126,"py":153,"n":35,"cols":8,"fps":12}}};
function clipLoad(m){if(m._ld)return;m._ld=1;for(const k in m.clip){const a=m.clip[k];if(!a||!a.f)continue;a.img=new Image();a.img.onload=()=>{a.ok=1;};a.img.src='assets/monsters/'+a.f+'.webp';}}
const C=(meta,h,o)=>{const m=Object.assign({clip:meta,h,ref:meta.ref,sw:h*.55},o||{});Object.defineProperty(m,'ok',{get(){clipLoad(m);return !!m.clip.idle.ok;}});return m;};
MS['Fenrir Shade Hound']=C(CLIPS.shadeHound,40,{sw:24});
MS['Fenrir']=C(CLIPS.fenrir,80,{sw:46});
window.MSPR_CLIPDUR=(name,k)=>{const m=MS[name],a=m&&m.clip&&m.clip[k];return a?a.n/a.fps:0;};
window.MSPR_DEADLEN=e=>{const m=def(e);return m&&m.clip&&m.clip.death?m.clip.death.n/m.clip.death.fps+.25:3.1;};
function cframe(e,m){const C=m.clip,t=gameTime,ok=k=>C[k]&&C[k].ok;
  if(e.dead&&ok('death')){const a=C.death;return ['death',Math.min(a.n-1,Math.floor(e.deadT*a.fps))];}
  const ca=e.clipA;if(ca&&ok(ca.k)){const a=C[ca.k];let f=Math.floor(ca.t*a.fps);f=a.loop?((f%a.n)+a.n)%a.n:Math.max(0,Math.min(a.n-1,f));return [ca.k,ca.rev?a.n-1-f:f];}
  if(e.st&&e.st.frozen>0)return ['idle',0];
  if(ok('attack')){const a=C.attack,hit=a.hit??Math.floor(a.n/2);
    if(e.atk>0)return ['attack',Math.min(hit,Math.floor((1-e.atk/(e.boss?.8:.6))*hit))];
    const ha=t-(e._hitT??-9),f=hit+Math.floor(ha*a.fps);if(f<a.n)return ['attack',f];}
  if(e._mv>0&&ok('walk')){const a=C.walk;return ['walk',Math.floor((e._wp||0)*a.n)%a.n];}
  const a=C.idle;return ['idle',Math.floor((t+(e.bob||0))*a.fps)%a.n];}
/* map colour grade (map charFilter) baked once per sheet instead of ctx.filter on every draw (ctx.filter per monster was the biggest frame cost on fields) */
/* 2026-11-21 memory: graded copies belong to ONE colour grade. When the grade changes (another map, day ↔ night) the old copies are given back —
   before, every sheet kept one full copy per map visited (≈ 5 MB each) for the whole session. */
let FSHF=null;
const FSH=new Map();function fsrc(img){const f=window.MSPR_FILTER;if(!f||!img||!img.naturalWidth)return img;
  if(f!==FSHF){for(const o of FSH.values())for(const k in o){try{o[k].width=o[k].height=0;}catch(e){}}FSH.clear();FSHF=f;}
  let m=FSH.get(img);if(!m){m={};FSH.set(img,m);}let c=m[f];if(c)return c;
  c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;const g=c.getContext('2d');g.filter=f;g.drawImage(img,0,0);m[f]=c;return c;}
function drawClip(e,m,x,y,al,cold,fl){const H=MSPR_H(e),k=H/m.ref;
  if(e._lx!==undefined&&!e.dead){const d=Math.hypot(e.x-e._lx,e.y-e._ly);if(d<60)e._wp=((e._wp||0)+d/(H*1.1))%1000;}e._lx=e.x;e._ly=e.y;
  const [ak,f]=cframe(e,m),a=m.clip[ak];
  if(!(e.clipA&&e.clipA.noShadow)&&!e.dead){ctx.save();ctx.globalAlpha=al*.26;ctx.fillStyle='#14182a';ctx.beginPath();const sw=m.sw*BK(e);ctx.ellipse(x,y+1+(e.z||0),sw,sw*.27,0,0,TAU);ctx.fill();ctx.restore();}
  let src=fsrc(a.img),sx=(f%a.cols)*a.cw,sy=Math.floor(f/a.cols)*a.ch;
  if(fl>.02||cold>0){if(tintC.width!==a.cw||tintC.height!==a.ch){tintC.width=a.cw;tintC.height=a.ch;}
    tg.globalCompositeOperation='copy';tg.drawImage(src,sx,sy,a.cw,a.ch,0,0,a.cw,a.ch);tg.globalCompositeOperation='source-atop';
    if(cold>0){tg.fillStyle=`rgba(120,200,255,${cold*.5})`;tg.fillRect(0,0,a.cw,a.ch);}if(fl>.02){tg.fillStyle=`rgba(255,120,110,${fl*.45})`;tg.fillRect(0,0,a.cw,a.ch);}src=tintC;sx=sy=0;}
  ctx.save();ctx.globalAlpha=al;ctx.translate(x,y);ctx.scale((e.face||1)*(m.flip?-1:1)*k,k);ctx.drawImage(src,sx,sy,a.cw,a.ch,-a.px,-a.py,a.cw,a.ch);ctx.restore();return true;}
window.MSPR_DRAW=function(e,x,y,al,cold,fl){const m=def(e);if(!m||!m.ok)return false;if(m.clip)return drawClip(e,m,x,y,al,cold,fl);const H=MSPR_H(e),k=H/m.ref;
  /* walk phase: one full 4-frame cycle (= two steps) per ~0.9 body heights travelled */
  if(e._lx!==undefined&&!e.dead){const d=Math.hypot(e.x-e._lx,e.y-e._ly);if(d<40)e._wp=((e._wp||0)+d/(H*.9))%1000;}e._lx=e.x;e._ly=e.y;
  let bob=0,tilt=0;if(e._mv>0&&!e.dead&&!m.fly&&!m.wok&&!(e.st&&e.st.frozen>0)){const p=(e._wp||0)*Math.PI*2;bob=Math.abs(Math.sin(p))*H*.045;tilt=Math.sin(p)*.035;}
  /* ground shadow */
  ctx.save();ctx.globalAlpha=al*(m.fly?.16:.24);ctx.fillStyle='#27324a';ctx.beginPath();const sw=m.sw*BK(e)*(m.fly?.8:1);ctx.ellipse(x,y+1,sw,sw*.27,0,0,TAU);ctx.fill();ctx.restore();
  const [r,f]=frame(e,m);let src=fsrc(r==='W'?m.wimg:m.img),sx=f*m.cw,sy=r==='W'?0:r*m.ch;
  if(fl>.02||cold>0){if(tintC.width!==m.cw||tintC.height!==m.ch){tintC.width=m.cw;tintC.height=m.ch;}
    tg.globalCompositeOperation='copy';tg.drawImage(src,sx,sy,m.cw,m.ch,0,0,m.cw,m.ch);tg.globalCompositeOperation='source-atop';
    if(cold>0){tg.fillStyle=`rgba(120,200,255,${cold*.55})`;tg.fillRect(0,0,m.cw,m.ch);}if(fl>.02){tg.fillStyle=`rgba(255,110,100,${fl*.55})`;tg.fillRect(0,0,m.cw,m.ch);}src=tintC;sx=sy=0;}
  const br=!e.dead&&r===ROW.idle?1+Math.sin(gameTime*3+(e.bob||0))*.012:1;
  ctx.save();ctx.globalAlpha=al;ctx.translate(x,y-bob);ctx.rotate(tilt*(e.face||1));ctx.scale((e.face||1)*k/br,k*br);   /* step bounce: body lifts on each stride, rocks a little side to side */
  ctx.drawImage(src,sx,sy,m.cw,m.ch,-m.px,-m.py,m.cw,m.ch);ctx.restore();
  return true;};
window.MSPR=MS;window.MSPR_C=C;   /* monster-catalog.js adds clip sprites through this */
})();
