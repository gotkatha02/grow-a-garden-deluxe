/* Eclipse Jaguar dancer (Aztec) — vector art for the skill effects v3 (owner 2026-11-25 "ทำเอฟเฟกต์สกิลของจากัวใหม่ทั้งหมดให้หน่อย":
   the same brief as the cat, kitsune, axolotl, dragon, lion, croc, sheep and Bastet — every skill effect made with SVG + VFX,
   following its concept and what it does).
   Every piece is an SVG drawn here (gradients + soft blur, no dark outlines: shapes are separated by value, see VFX_STYLE_REF_TH.md),
   rasterised ONCE to a canvas at 2x and animated by jaguar_vfx.js.
   Motifs (her design sheet assets/heroes/jaguar/sheet_eclipse_dancer.webp): curved black obsidian daggers with a violet sheen and
   gold crescent guards; Blood Fang (A) = crimson claw rakes, blood, the golden spirit jaguar (paw, leap, roaring head), Prey Marks;
   Eclipse Shadow (B) = the black sun with a spiky gold corona, violet shadow wisps, turquoise rims, jade venom (serpent sigil, bloom),
   Tezcatlipoca's smoking obsidian mirror, the moon trap; Aztec craft everywhere: gold step-fret (xicalcoliuhqui) rings, turquoise
   chalchihuitl studs, crimson and turquoise feathers, the huehuetl war drum, the blood moon.
   Same registry as the other heroes: window.KTA.get(name) -> canvas | null · window.KTA.size(name) -> [w,h] in world px. */
(()=>{
if(typeof CHAR!=='undefined'&&CHAR!=='jaguar'&&!window.__JG_ART_PREVIEW)return;
const XL='xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"';
const S=(w,h,defs,body)=>({w,h,svg:`<svg ${XL} width="${w*2}" height="${h*2}" viewBox="0 0 ${w} ${h}"><defs>${defs}</defs>${body}</svg>`});
const stops=s=>s.map(([o,c,a])=>`<stop offset="${o}" stop-color="${c}"${a!=null?` stop-opacity="${a}"`:''}/>`).join('');
const lg=(id,x1,y1,x2,y2,s,extra='')=>`<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${extra}>${stops(s)}</linearGradient>`;
const rg=(id,cx,cy,r,s,extra='')=>`<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}" ${extra}>${stops(s)}</radialGradient>`;
const blur=(id,sd,pad=40)=>`<filter id="${id}" x="-${pad}%" y="-${pad}%" width="${100+2*pad}%" height="${100+2*pad}%"><feGaussianBlur stdDeviation="${sd}"/></filter>`;
const f1=v=>(+v).toFixed(1),RAD=Math.PI/180;
const A={};
/* palettes */
const OBS=['#05030a','#1a0f2a','#3a2260','#8a5ad0','#e4d0ff'],GLD=['#4a2a06','#b8741a','#ffc23a','#ffe89a','#fff8e0'],
  CRM=['#2a0408','#9a0c22','#e8243c','#ff8a7a','#fff0ea'],TRQ=['#04282c','#138a8a','#38e0d0','#bff8f0','#ffffff'],
  JAD=['#04281c','#14825a','#2fd6a0','#b8ffe0','#f4fffa'],VIO=['#0c0618','#3a1a6a','#8a4ae0','#d8b8ff','#ffffff'];
const OBSG=id=>lg(id,0,0,1,1,[[0,'#4a2e7a'],[.35,'#1c1030'],[.7,'#0a0612'],[1,'#2a1846']]);
const GOLDV=id=>lg(id,0,0,0,1,[[0,'#fff3c0'],[.45,'#ffc23a'],[1,'#a8620e']]);

/* ---------- the obsidian dagger (her weapon): curved black glass crescent, violet sheen, gold crescent guard — points right ---------- */
const DAG=`<path d="M3 10.6 L13 10.2 L13 13.8 L3 13.4Z" fill="#3a2210"/><path d="M6 10.3 L6 13.7 M9.4 10.2 L9.4 13.8" stroke="#ffc23a" stroke-width="1.2"/>
  <circle cx="2.6" cy="12" r="2" fill="url(#gd)"/>
  <path d="M15 8 C30 2 47 -.4 63 3.4 C50 7.2 36 12.4 15 16.4Z" fill="url(#ob)"/>
  <path d="M17.5 8.6 C31 3.4 46 1.4 60.5 3.6" stroke="#b48aff" stroke-width="1.3" fill="none" stroke-linecap="round" opacity=".95"/>
  <path d="M22 11.6 C34 8.2 46 6 57 4.6" stroke="#5a3a9a" stroke-width=".8" fill="none" opacity=".8"/>
  <path d="M53 2.2 C57 2.2 60 2.6 62.4 3.4" stroke="#ffffff" stroke-width="1" fill="none" stroke-linecap="round"/>
  <path d="M14.2 3.4 C19.4 7.4 19.4 16.6 14.2 20.6 C16.6 15.4 16.6 8.6 14.2 3.4Z" fill="url(#gd)"/><circle cx="11.6" cy="12" r="1.5" fill="#38e0d0"/>`;
const DAGDEF=OBSG('ob')+GOLDV('gd');
A.dagger=S(64,24,DAGDEF+blur('b',1.4),`<path d="M15 8 C30 2 47 -.4 63 3.4 C50 7.2 36 12.4 15 16.4Z" fill="#8a4ae0" opacity=".55" filter="url(#b)"/>${DAG}`);
/* crossed daggers held up as a guard (Countercut / Obsidian Parry) */
A.xdag=S(84,84,DAGDEF+blur('b',2.2)+rg('h',.5,.5,.5,[[0,'#ffe89a',.75],[.5,'#ffc23a',.22],[1,'#ffc23a',0]]),
  `<circle cx="42" cy="42" r="34" fill="url(#h)"/>
   <g transform="translate(42 42) rotate(-45) translate(-34 -12)"><path d="M15 8 C30 2 47 -.4 63 3.4 C50 7.2 36 12.4 15 16.4Z" fill="#b48aff" opacity=".6" filter="url(#b)"/>${DAG}</g>
   <g transform="translate(42 42) rotate(-135) translate(-34 -12) scale(1 -1) translate(0 -24)"><path d="M15 8 C30 2 47 -.4 63 3.4 C50 7.2 36 12.4 15 16.4Z" fill="#b48aff" opacity=".6" filter="url(#b)"/>${DAG}</g>`);
/* obsidian spear head that falls point-down from the Fifth Sun (wooden stub, gold binding, feather tuft) */
A.spear=S(22,72,OBSG('ob')+GOLDV('gd')+lg('v',0,0,0,1,[[0,'#2a1844'],[.55,'#0c0614'],[1,'#4a2e86']])+blur('b',1.6),
  `<path d="M11 22 C18 29 20 41 16 53 C14 59 12 65 11 71 C10 65 8 59 6 53 C2 41 4 29 11 22Z" fill="#8a4ae0" opacity=".7" filter="url(#b)"/>
   <path d="M9.6 0 L12.4 0 L12.4 21 L9.6 21Z" fill="#5a3418"/>
   <path d="M10 5 C6 4 3 6 1 10 C4 9 7 9 10 8Z" fill="#e8243c"/><path d="M12 5 C16 4 19 6 21 10 C18 9 15 9 12 8Z" fill="#38e0d0"/>
   <path d="M7.4 18 L14.6 18 L14.6 23 L7.4 23Z" fill="url(#gd)"/><circle cx="11" cy="20.5" r="1.4" fill="#38e0d0"/>
   <path d="M11 22 C18 29 20 41 16 53 C14 59 12 65 11 71 C10 65 8 59 6 53 C2 41 4 29 11 22Z" fill="url(#v)"/>
   <path d="M11 24 C6 31 5 41 7.6 52 L11 70Z" fill="#6a4ab0" opacity=".38"/>
   <path d="M11 25 L11 68" stroke="#b48aff" stroke-width=".9"/><path d="M13.6 28 C16 34 16.6 42 15 50" stroke="#ffffff" stroke-width=".8" fill="none" opacity=".7"/>`);
/* obsidian glass chips (debris) */
[['M2 6 L7 1 L13 5 L11 12 L4 13Z','M7 1 L13 5 L8 7Z'],['M1 8 L5 2 L12 1 L13 9 L6 13Z','M5 2 L12 1 L8 6Z'],['M3 3 L10 1 L13 8 L8 13 L2 10Z','M3 3 L10 1 L7 6Z']].forEach(([d,f],i)=>{
  A['chip'+i]=S(14,14,lg('c',0,0,1,1,[[0,'#3a2260'],[1,'#0a0612']]),`<path d="${d}" fill="url(#c)"/><path d="${f}" fill="#8a5ad0" opacity=".85"/><path d="${d}" fill="none" stroke="#c9a8ff" stroke-width=".7" opacity=".7"/>`);});
/* broken armour plates (Expose Armor) */
A.plate0=S(24,20,lg('p',0,0,1,1,[[0,'#dfe6f0'],[.45,'#8a96a8'],[1,'#3a4250']]),`<path d="M2 5 L14 1 L22 6 L19 17 L6 19 L4 12Z" fill="url(#p)"/><path d="M2 5 L14 1 L22 6" stroke="#ffffff" stroke-width="1" fill="none" opacity=".8"/><circle cx="8" cy="8" r="1.3" fill="#2a3240"/><circle cx="16" cy="9" r="1.3" fill="#2a3240"/><path d="M10 12 L13 15 L11 18" stroke="#1a2028" stroke-width=".8" fill="none"/>`);
A.plate1=S(24,20,lg('p',0,0,1,1,[[0,'#ffe0b0'],[.45,'#c8803a'],[1,'#5a3010']]),`<path d="M3 3 L18 2 L22 12 L14 18 L2 14Z" fill="url(#p)"/><path d="M3 3 L18 2" stroke="#fff3d8" stroke-width="1" opacity=".85"/><circle cx="7" cy="7" r="1.2" fill="#3a1a08"/><circle cx="15" cy="7" r="1.2" fill="#3a1a08"/>`);

/* ---------- jungle: leaves and feathers ---------- */
A.leaf0=S(16,30,lg('g',0,0,1,1,[[0,'#9adc6a'],[.5,'#3aa04a'],[1,'#14602a']]),`<path d="M8 1 C14 8 15 20 8 29 C1 20 2 8 8 1Z" fill="url(#g)"/><path d="M8 3 C8.6 12 8.4 20 8 28" stroke="#e0f8b0" stroke-width=".8" fill="none" opacity=".85"/><path d="M8 10 L12 7 M8 15 L12.6 12 M8 20 L12 17.6 M8 12 L4 9 M8 17 L3.6 14.4" stroke="#bfe890" stroke-width=".5" opacity=".6"/>`);
A.leaf1=S(18,30,lg('g',0,0,1,1,[[0,'#6ac85a'],[.5,'#1f8a3a'],[1,'#0a4a1e']]),`<path d="M9 1 C16 5 17 16 13 24 L10 20.6 L9 29 L8 20.6 L5 24 C1 16 2 5 9 1Z" fill="url(#g)"/><path d="M9 3 L9 27" stroke="#c8f0a0" stroke-width=".7" opacity=".8"/>`);
A.leaf2=S(14,32,lg('g',0,0,0,1,[[0,'#b8e870'],[1,'#2a7a30']]),`<path d="M7 1 C9 3 10 6 9 8 L12 9 L9 12 L12.6 14 L9 17 L12 20 L8.6 23 L10 27 L7 31 L4 27 L5.4 23 L2 20 L5 17 L1.4 14 L5 12 L2 9 L5 8 C4 6 5 3 7 1Z" fill="url(#g)"/><path d="M7 2 L7 30" stroke="#e8ffc0" stroke-width=".6" opacity=".8"/>`);
const FEATH=(c0,c1,c2)=>S(12,40,lg('f',0,0,1,0,[[0,c2],[.5,c0],[1,c1]]),`<path d="M6 1 C11 10 12 24 7.4 38 L4.6 38 C0 24 1 10 6 1Z" fill="url(#f)"/><path d="M6 2 C8 9 9 8 11 13 C8 12 7 13 6 12Z" fill="#ffe89a" opacity=".85"/><path d="M6 4 C6.6 16 6.4 28 6 39" stroke="#fff3d8" stroke-width=".7" fill="none"/><path d="M6 18 L9.6 15 M6 24 L10 21 M6 18 L2.6 15.6 M6 24 L2.4 21.6" stroke="#000" stroke-width=".35" opacity=".35"/>`);
A.feather0=FEATH('#e8243c','#7a0a1c','#ff8a6a');A.feather1=FEATH('#38e0d0','#0f6a70','#c8fff4');

/* ---------- Blood Fang: claw rakes (3 parallel curved cuts), ground gouges, blood ---------- */
const RAKE=(p,id)=>{let s='';const L=(ox,oy,w)=>`M${f1(8+ox)} ${f1(8+oy)} Q${f1(50+ox+w)} ${f1(30+oy-w*.6)} ${f1(92+ox)} ${f1(70+oy)} Q${f1(48+ox-w)} ${f1(38+oy+w*.6)} ${f1(8+ox)} ${f1(8+oy)}Z`;
  for(const o of [-12,0,12]){const ox=-.6*o,oy=.8*o;s+=`<path d="${L(ox,oy,9)}" fill="${p[0]}" opacity=".55" filter="url(#b)"/><path d="${L(ox,oy,6)}" fill="url(#${id})"/><path d="${L(ox,oy,2.2)}" fill="${p[4]}"/>`;}
  return S(100,80,lg(id,0,0,1,1,[[0,p[3]],[.4,p[2]],[1,p[1]]])+blur('b',1.6),s);};
A.rakeC=RAKE(CRM,'r');A.rakeG=RAKE(GLD,'r');A.rakeT=RAKE(TRQ,'r');A.rakeV=RAKE(VIO,'r');
/* claw gouges torn in the ground (lies flat): dark furrows with a lit lip and thrown dirt */
const GOUGE=(lip,glow)=>{let s=`<ellipse cx="50" cy="22" rx="46" ry="18" fill="${glow}" opacity=".16" filter="url(#b)"/>`;
  [[-11,0],[0,0],[11,0]].forEach(([oy],i)=>{const y=22+oy,d=`M6 ${y+4} C30 ${y-2} 64 ${y-6} 94 ${y-10} C66 ${y-1} 34 ${y+5} 6 ${y+4}Z`;
    s+=`<path d="${d}" fill="#140a06" opacity=".82" transform="translate(${i*2} 0)"/><path d="M8 ${y+3} C32 ${y-2.6} 64 ${y-6.6} 92 ${y-10}" stroke="${lip}" stroke-width="1.6" fill="none" opacity=".9" transform="translate(${i*2} 0)"/>
      <path d="M10 ${y+5} C30 ${y+3} 50 ${y+1} 70 ${y-2}" stroke="${glow}" stroke-width="1.1" fill="none" opacity=".75" filter="url(#g)" transform="translate(${i*2} 0)"/>`;});
  for(let k=0;k<7;k++){const x=84+((k*13)%14),y=6+((k*19)%30);s+=`<path d="M${x} ${y} l2.4 -1.6 l1.8 2 l-2.6 1.4Z" fill="#3a2414" opacity=".8"/>`;}
  return S(100,44,blur('b',4)+blur('g',1),s);};
A.gougeC=GOUGE('#ff8a6a','#e8243c');A.gougeG=GOUGE('#ffe89a','#ffc23a');A.gougeT=GOUGE('#bff8f0','#38e0d0');
/* a crown of blood thrown up by Open Wound / the bleeding cut (upright, base at the bottom) */
A.splash=S(96,58,lg('s',0,0,0,1,[[0,'#ff8a7a'],[.4,'#e8243c'],[1,'#6a0614']])+blur('b',1.4),
  `<path d="M8 50 C14 40 18 30 20 18 C24 30 26 38 30 42 C32 30 36 16 40 6 C42 18 44 32 48 40 C52 28 56 14 62 4 C62 18 60 32 62 40 C66 32 72 24 78 16 C76 28 74 38 74 46 C80 42 86 40 90 40 C86 46 80 52 70 55 L24 56 C18 55 12 53 8 50Z" fill="#2a0408" opacity=".6" filter="url(#b)" transform="translate(1.5 2)"/>
   <path d="M8 50 C14 40 18 30 20 18 C24 30 26 38 30 42 C32 30 36 16 40 6 C42 18 44 32 48 40 C52 28 56 14 62 4 C62 18 60 32 62 40 C66 32 72 24 78 16 C76 28 74 38 74 46 C80 42 86 40 90 40 C86 46 80 52 70 55 L24 56 C18 55 12 53 8 50Z" fill="url(#s)"/>
   <path d="M38 12 C39 22 41 32 44 38 M60 9 C59 20 58 30 59 38 M21 24 C22 32 24 38 27 42" stroke="#ffd0c8" stroke-width="1.2" fill="none" opacity=".8" stroke-linecap="round"/>
   <circle cx="30" cy="10" r="2.6" fill="#e8243c"/><circle cx="70" cy="8" r="2.2" fill="#e8243c"/><circle cx="52" cy="2.6" r="1.8" fill="#ff5a4a"/><circle cx="86" cy="30" r="1.8" fill="#e8243c"/>`);
const DROP=(c0,c1,c2,id)=>S(12,16,rg(id,.35,.6,.7,[[0,c2],[.45,c0],[1,c1]]),`<path d="M6 .5 C8.6 5.4 11.6 8.6 11.6 11 A5.6 5 0 0 1 .4 11 C.4 8.6 3.4 5.4 6 .5Z" fill="url(#${id})"/><ellipse cx="4.2" cy="10" rx="1.3" ry="2" fill="#ffffff" opacity=".75"/>`);
A.bdrop=DROP('#e8243c','#5a0610','#ffb0a0','d');A.vdrop=DROP('#2fd6a0','#0a4a34','#d8fff0','d');

/* ---------- the golden spirit jaguar ---------- */
const FUR=id=>lg(id,0,0,0,1,[[0,'#ffe2a0'],[.42,'#f0a838'],[1,'#a85e12']]);
const ROS=(x,y,r)=>`<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="#c87a20" fill-opacity=".45" stroke="#3a2008" stroke-width="${f1(r*.42)}" stroke-dasharray="${f1(r*1.6)} ${f1(r*.55)}"/>`;
/* a giant spirit paw swiping down (claws at the bottom): Rending Fang's echo, Sky-Pounce, Throne of Claws, Godfall */
A.paw=S(124,150,FUR('f')+lg('m',0,0,0,1,[[0,'#fff',0],[.3,'#fff',.3],[.55,'#fff',1],[1,'#fff',1]])+OBSG('ob')+blur('b',3)+blur('s',1.2),
  `<mask id="mk"><rect width="124" height="150" fill="url(#m)"/></mask>
   <path d="M42 0 C40 24 38 48 36 66 C24 76 18 92 22 106 C24 116 30 122 38 122 C44 126 50 128 56 126 C60 128 66 128 70 126 C76 128 82 126 86 122 C94 122 100 116 102 106 C106 92 100 76 88 66 C86 48 84 24 82 0Z" fill="#ffc23a" opacity=".6" filter="url(#b)" mask="url(#mk)"/>
   <g mask="url(#mk)"><path d="M42 0 C40 24 38 48 36 66 C24 76 18 92 22 106 C24 116 30 122 38 122 C44 126 50 128 56 126 C60 128 66 128 70 126 C76 128 82 126 86 122 C94 122 100 116 102 106 C106 92 100 76 88 66 C86 48 84 24 82 0Z" fill="url(#f)"/>
   <path d="M30 44 C22 34 24 20 30 10 C30 22 34 30 38 36Z M94 48 C102 38 100 24 94 14 C94 26 90 34 86 40Z" fill="#ffd27a" opacity=".7"/>
   ${ROS(54,28,5)}${ROS(70,44,5.5)}${ROS(50,60,6)}${ROS(74,72,5)}${ROS(44,88,4.6)}${ROS(80,94,4.6)}${ROS(62,100,4)}${ROS(80,22,4)}
   <path d="M30 80 C44 72 80 72 94 80" stroke="#fff3d8" stroke-width="2" fill="none" opacity=".75" filter="url(#s)"/></g>
   <path d="M45 108 L46 124 M62 112 L62 127 M79 108 L78 124" stroke="#7a4410" stroke-width="2" stroke-linecap="round" opacity=".85"/>
   ${[[36,119,-1],[52,125,-.45],[71,125,.45],[87,119,1]].map(([x,y,s])=>{const d=`M${x-4.4} ${y} C${f1(x-4-s*4)} ${y+10} ${f1(x-s*2.6)} ${y+18} ${f1(x+s*4.4)} ${y+22} C${f1(x+1.4+s*1.6)} ${y+13} ${f1(x+4)} ${y+7} ${x+4.6} ${y}Z`;
     return `<path d="${d}" fill="#8a4ae0" opacity=".65" filter="url(#s)"/><path d="${d}" fill="url(#ob)"/><path d="M${x-2} ${y+1.4} C${f1(x-2-s*2.6)} ${y+9} ${f1(x-s*1.2)} ${y+15} ${f1(x+s*3)} ${y+19}" stroke="#d8b8ff" stroke-width="1" fill="none"/>`;}).join('')}`);
/* the golden spirit jaguar leaping (faces right): Predator's pounce, Predator Drop, Sky-Pounce, Throne finisher */
const LEAP='M177 44 C177 37 171 30 162 28 C158 21 150 18 144 23 C139 19 127 18 117 21 C99 15 77 15 59 21 C49 23 41 26 33 31 C23 29 12 24 2 18 C10 29 19 36 28 42 C24 48 16 55 7 63 C5 67 8 72 13 69 C23 63 33 58 44 55 C61 62 85 63 105 60 C119 58 129 61 138 66 C148 73 159 79 170 85 C175 88 179 83 175 79 C168 73 160 66 155 59 C162 57 170 55 177 51Z';
A.jagLeap=S(182,96,FUR('f')+lg('m',0,0,1,0,[[0,'#fff',0],[.22,'#fff',.35],[.45,'#fff',1],[1,'#fff',1]])+lg('bl',0,0,0,1,[[0,'#fff',0],[.6,'#000',0],[1,'#3a1a08',.55]])+blur('b',3)+blur('s',1.1),
  `<mask id="mk"><rect width="182" height="96" fill="url(#m)"/></mask>
   <g mask="url(#mk)">
   <path d="${LEAP}" fill="#ffc23a" opacity=".6" filter="url(#b)"/>
   <path d="${LEAP}" fill="url(#f)"/><path d="${LEAP}" fill="url(#bl)"/>
   ${ROS(66,32,4.4)}${ROS(84,30,4.8)}${ROS(100,34,4.4)}${ROS(118,32,4)}${ROS(76,44,4)}${ROS(94,46,4.2)}${ROS(112,46,3.8)}${ROS(50,38,4)}${ROS(134,38,3.6)}
   <path d="M60 26 C78 20 100 20 118 25 C128 22 140 22 145 25" stroke="#fff3d8" stroke-width="1.6" fill="none" opacity=".85" filter="url(#s)"/>
   <path d="M2 20 C12 26 22 32 34 34" stroke="#ffd27a" stroke-width="2" fill="none" opacity=".8"/></g>
   <path d="M146 25 C147 18 152 15 156 19 C157 23 156 26 153 28Z" fill="#d8922a"/><path d="M148.6 24 C149.4 20 152 19 153.6 21" stroke="#ffb090" stroke-width="1.2" fill="none"/>
   <path d="M158 36 C162 34 167 34.6 170 37 C166 39 161 39 158 36Z" fill="#ffe89a"/><ellipse cx="164" cy="36.8" rx="1" ry="2" fill="#140a04"/><circle cx="165.2" cy="35.8" r=".6" fill="#ffffff"/>
   <path d="M155 33 C160 30.6 166 30.8 171 33" stroke="#3a2008" stroke-width="1.3" fill="none"/>
   <path d="M174 43 C176 44 177 46 176 48" stroke="#3a2008" stroke-width="2" fill="none" stroke-linecap="round"/>
   <path d="M168 49 L170 55 L172 50Z" fill="#ffffff"/>
   <path d="M168 44 C174 42 180 41 182 40 M168 46 C174 46 180 47 181 48" stroke="#fff3d8" stroke-width=".6" opacity=".8"/>
   ${[[170,85],[174,83],[177,80]].map(([x,y])=>`<path d="M${x} ${y} C${x+3} ${y+2} ${x+4} ${y+5} ${x+2} ${y+7} C${x+2} ${y+5} ${x+1} ${y+3} ${x-1} ${y+2}Z" fill="#1a0f2a"/>`).join('')}`);
/* the roaring spirit head of the jaguar (faces right): Predator's Cry */
const HEAD='M10 80 C8 54 22 32 44 24 C52 14 60 10 66 14 C72 10 80 12 84 20 C98 22 110 30 118 40 C124 44 130 48 131 54 C132 59 128 62 122 62 L104 64 C98 65 94 68 90 72 L96 78 C104 82 114 84 120 82 C122 88 116 94 104 96 C92 100 76 102 62 104 C44 106 24 102 10 98Z';
A.jagHead=S(136,110,FUR('f')+lg('m',0,0,1,0,[[0,'#fff',0],[.25,'#fff',.5],[.5,'#fff',1],[1,'#fff',1]])+blur('b',3)+blur('s',1.2)+rg('e',.5,.5,.5,[[0,'#bff8f0',1],[.5,'#38e0d0',.6],[1,'#38e0d0',0]]),
  `<mask id="mk"><rect width="136" height="110" fill="url(#m)"/></mask>
   <g mask="url(#mk)"><path d="${HEAD}" fill="#ffc23a" opacity=".6" filter="url(#b)"/><path d="${HEAD}" fill="url(#f)"/>
   ${ROS(36,48,5)}${ROS(52,40,4.4)}${ROS(30,70,5)}${ROS(48,64,4.6)}${ROS(64,32,3.6)}${ROS(40,88,4.4)}${ROS(62,86,4)}
   <path d="M14 56 C8 44 10 30 18 22 C18 34 22 44 26 50Z" fill="#ffd27a" opacity=".7"/></g>
   <path d="M44 24 C40 12 48 4 58 8 C60 14 58 20 54 24Z" fill="#d8922a"/><path d="M47 20 C46 13 50 10 55 12" stroke="#ff9a7a" stroke-width="2" fill="none"/>
   <path d="M90 72 L122 62 L120 82 L96 78Z" fill="#5a0c14"/><path d="M96 74 C104 72 112 70 120 72" stroke="#c8303a" stroke-width="2.4" fill="none"/>
   <path d="M108 63.4 L111 74 L114 62.6Z M116 62.2 L118.4 70 L120.4 62Z M104 79.6 L107 71 L110 80.4Z" fill="#ffffff"/>
   <path d="M122 50 C127 48 131 50 131 54 C128 55 124 55 122 50Z" fill="#3a2008"/>
   <path d="M100 32 C110 36 120 42 126 48" stroke="#a8620e" stroke-width="1.4" fill="none" opacity=".8"/>
   <ellipse cx="97" cy="38" rx="11" ry="7" fill="url(#e)"/>
   <path d="M89 38 C93 33 101 33 104 37 C100 41 93 41 89 38Z" fill="#ffe89a"/><ellipse cx="97" cy="37.4" rx="1.3" ry="3" fill="#140a04"/><circle cx="98.6" cy="36" r=".9" fill="#ffffff"/>
   <path d="M86 32 C92 28 100 28 107 32" stroke="#3a2008" stroke-width="2.2" fill="none" stroke-linecap="round"/>
   <path d="M118 60 C124 58 130 58 135 59 M117 62 C124 62 130 64 134 66" stroke="#fff3d8" stroke-width=".8" fill="none" opacity=".85"/>`);
/* slit jaguar eyes glowing in the dark (Hunter's Focus, Blood Moon Hunt marks, the Throne's charge, Unseen Rhythm) */
const EYES=(c0,c1,glow)=>S(44,16,lg('e',0,0,0,1,[[0,c0],[1,c1]])+blur('b',1.6),
  `${[12,32].map(x=>`<path d="M${x-10} 8 Q${x} 1 ${x+10} 8 Q${x} 14 ${x-10} 8Z" fill="${glow}" opacity=".8" filter="url(#b)"/><path d="M${x-9} 8 Q${x} 2.4 ${x+9} 8 Q${x} 12.6 ${x-9} 8Z" fill="url(#e)"/><ellipse cx="${x}" cy="8" rx="1.3" ry="4.2" fill="#0a0604"/><circle cx="${x+2.4}" cy="6.4" r="1" fill="#ffffff"/>`).join('')}
   <path d="M3 4.6 C8 1.6 15 1.6 21 4 M23 4 C29 1.6 36 1.6 41 4.6" stroke="#1a0a04" stroke-width="1.4" fill="none" stroke-linecap="round"/>`);
A.eyesG=EYES('#fff3c0','#ffb020','#ffc23a');A.eyesR=EYES('#ffd0c0','#e8243c','#ff3a3a');A.eyesT=EYES('#e8fffb','#38e0d0','#38e0d0');

/* ---------- Eclipse Shadow: the black sun, the Brand, wisps, venom ---------- */
/* the black sun with a spiky gold corona (her sheet's spell): Fifth Sun, Shadow Burst, the Pact */
{const cx=70,cy=70;let sp='';for(let i=0;i<16;i++){const a=i*22.5*RAD,R=i%2?54:68,b0=a-.16,b1=a+.16;sp+=`M${f1(cx+Math.cos(b0)*36)} ${f1(cy+Math.sin(b0)*36)} L${f1(cx+Math.cos(a)*R)} ${f1(cy+Math.sin(a)*R)} L${f1(cx+Math.cos(b1)*36)} ${f1(cy+Math.sin(b1)*36)}Z `;}
 A.eclipse=S(140,140,rg('co',.5,.5,.5,[[0,'#fff8e0'],[.5,'#ffe89a'],[.72,'#ffc23a'],[1,'#e8742a']])+rg('gl',.5,.5,.5,[[0,'#ffd27a',.75],[.55,'#ffb030',.3],[1,'#ffb030',0]])
   +rg('d',.4,.38,.62,[[0,'#2a1a44'],[.6,'#0c0618'],[1,'#030206']])+blur('b',2.4),
   `<circle cx="70" cy="70" r="70" fill="url(#gl)"/><path d="${sp}" fill="url(#co)"/><path d="${sp}" fill="#ffffff" opacity=".25" filter="url(#b)"/>
    <circle cx="70" cy="70" r="37.5" fill="#fff3c0"/><circle cx="70" cy="70" r="35.6" fill="#38e0d0"/><circle cx="70" cy="70" r="33.4" fill="url(#d)"/>
    <path d="M47 58 C52 46 62 40 74 39" stroke="#8a5ad0" stroke-width="2" fill="none" opacity=".6" stroke-linecap="round"/>
    <circle cx="70" cy="70" r="35.6" fill="none" stroke="#ffffff" stroke-width=".8" opacity=".85"/>`);}
/* the Eclipse Brand over a marked enemy: a small black sun (bold, reads at 20 px) */
{let sp='';for(let i=0;i<8;i++){const a=(i*45+22.5)*RAD,b0=a-.3,b1=a+.3;sp+=`M${f1(15+Math.cos(b0)*9)} ${f1(15+Math.sin(b0)*9)} L${f1(15+Math.cos(a)*14.4)} ${f1(15+Math.sin(a)*14.4)} L${f1(15+Math.cos(b1)*9)} ${f1(15+Math.sin(b1)*9)}Z `;}
 A.brand=S(30,30,rg('d',.4,.38,.62,[[0,'#3a2260'],[1,'#05030a']]),`<circle cx="15" cy="15" r="14.6" fill="#0a0612" opacity=".55"/><path d="${sp}" fill="#ffc23a"/><circle cx="15" cy="15" r="9.6" fill="#38e0d0"/><circle cx="15" cy="15" r="8.2" fill="url(#d)"/><path d="M10.4 12 C11.6 9.6 13.6 8.6 15.8 8.4" stroke="#b48aff" stroke-width="1" fill="none"/>`);}
/* the Prey Mark: three gold claw scratches */
{const L=(x0,y0,x1,y1,w)=>`M${x0} ${y0} Q${f1((x0+x1)/2+w)} ${f1((y0+y1)/2-w*.4)} ${x1} ${y1} Q${f1((x0+x1)/2-w)} ${f1((y0+y1)/2+w*.4)} ${x0} ${y0}Z`;let s='';
 for(const [x0,y0,x1,y1] of [[5,6,13,25],[10,3,19,23],[16,2,24,20]])s+=`<path d="${L(x0,y0,x1,y1,4)}" fill="#2a1408" opacity=".9"/><path d="${L(x0,y0,x1,y1,2.4)}" fill="url(#g)"/><path d="${L(x0,y0,x1,y1,.8)}" fill="#fff8e0"/>`;
 A.prey=S(28,28,lg('g',0,0,1,1,[[0,'#fff3c0'],[.5,'#ffc23a'],[1,'#c86a10']]),s);}
/* violet shadow wisps (Shadow Veil, Slip, the clones, Black Horizon): a smoky tongue rising and curling */
const WISP=(d,inner,c)=>S(60,100,lg('w',0,1,0,0,[[0,c[1],.9],[.45,c[2],.75],[1,c[3],0]])+lg('i',0,1,0,0,[[0,c[3],.6],[1,c[4],0]])+blur('b',1.4),
  `<path d="${d}" fill="url(#w)" filter="url(#b)"/><path d="${inner}" fill="url(#i)"/>`);
A.wisp0=WISP('M30 99 C14 88 10 70 22 56 C32 44 24 30 16 20 C30 22 40 34 38 48 C36 60 46 66 48 76 C50 88 42 96 30 99Z','M30 94 C22 84 20 72 28 62 C34 54 30 44 26 36 C34 40 38 50 34 58 C30 66 40 74 38 84 C37 90 34 93 30 94Z',VIO);
A.wisp1=WISP('M28 99 C42 90 50 74 40 60 C30 46 40 28 50 14 C34 18 24 30 26 46 C28 58 16 64 14 76 C12 88 18 96 28 99Z','M28 94 C36 86 40 74 34 64 C28 54 32 42 38 32 C30 38 26 48 30 56 C34 66 22 72 22 82 C22 88 25 92 28 94Z',VIO);
A.wispT=WISP('M30 99 C14 88 10 70 22 56 C32 44 24 30 16 20 C30 22 40 34 38 48 C36 60 46 66 48 76 C50 88 42 96 30 99Z','M30 94 C22 84 20 72 28 62 C34 54 30 44 26 36 C34 40 38 50 34 58 C30 66 40 74 38 84 C37 90 34 93 30 94Z',TRQ);
/* jade venom: the serpent sigil (lies flat) and the venom bloom (stands) */
A.sigilV=S(120,120,lg('s',0,0,1,1,[[0,'#b8ffe0'],[.5,'#2fd6a0'],[1,'#0e6a4a']])+rg('h',.5,.5,.5,[[0,'#2fd6a0',.3],[.7,'#2fd6a0',.12],[1,'#2fd6a0',0]])+blur('b',2),
  `<circle cx="60" cy="60" r="58" fill="url(#h)"/>
   <circle cx="60" cy="60" r="52" fill="none" stroke="#2fd6a0" stroke-width="2.2" stroke-dasharray="3 5" opacity=".9"/>
   <circle cx="60" cy="60" r="46" fill="none" stroke="#b8ffe0" stroke-width="1" opacity=".7"/>
   ${[0,60,120,180,240,300].map(a=>{const x=60+Math.cos(a*RAD)*52,y=60+Math.sin(a*RAD)*52;return `<path d="M${f1(x)} ${f1(y-3.4)} C${f1(x+2)} ${f1(y-.6)} ${f1(x+2.4)} ${f1(y+1)} ${f1(x)} ${f1(y+3)} C${f1(x-2.4)} ${f1(y+1)} ${f1(x-2)} ${f1(y-.6)} ${f1(x)} ${f1(y-3.4)}Z" fill="#7affc8"/>`;}).join('')}
   <path d="M34 84 C22 66 40 44 60 56 C80 68 98 48 86 30" stroke="#04281c" stroke-width="15" fill="none" stroke-linecap="round" opacity=".75" filter="url(#b)"/>
   <path d="M34 84 C22 66 40 44 60 56 C80 68 98 48 86 30" stroke="url(#s)" stroke-width="10" fill="none" stroke-linecap="round"/>
   <path d="M34 84 C22 66 40 44 60 56 C80 68 98 48 86 30" stroke="#04281c" stroke-width="2.2" fill="none" stroke-dasharray="1.5 5" stroke-linecap="round" opacity=".7"/>
   <path d="M80 22 C86 16 96 18 96 26 C96 32 90 36 84 34 C80 31 78 26 80 22Z" fill="url(#s)"/><circle cx="90" cy="24" r="1.8" fill="#ffe89a"/>
   <path d="M95 30 L99 37 L94 33Z M88 35 L88 42 L85 35Z" fill="#ffffff"/><path d="M96 27 C101 28 104 31 104 34" stroke="#e8243c" stroke-width="1.2" fill="none"/>
   <path d="M34 84 C28 92 22 94 16 92 C22 88 24 84 28 80Z M30 88 C30 96 26 100 22 102 C24 96 26 92 26 86Z" fill="#38e0d0"/>`);
A.bloom=S(92,86,lg('pj',0,0,0,1,[[0,'#d8fff0'],[.45,'#2fd6a0'],[1,'#0a5a3a']])+lg('pv',0,0,0,1,[[0,'#e8d0ff'],[.45,'#8a4ae0'],[1,'#2a1050']])+rg('c',.5,.5,.5,[[0,'#ffffff'],[.4,'#d8ff8a'],[1,'#2fd6a0',0]])+blur('b',1.6),
  `${[-62,-20,22,64].map(a=>`<path d="M46 76 C34 56 36 30 46 12 C56 30 58 56 46 76Z" fill="url(#pv)" transform="rotate(${a} 46 76)"/>`).join('')}
   ${[-40,0,40].map(a=>`<path d="M46 78 C32 60 34 34 46 18 C58 34 60 60 46 78Z" fill="url(#pj)" transform="rotate(${a} 46 78)"/><path d="M46 74 C44 60 44 44 46 26" stroke="#eafff8" stroke-width=".9" fill="none" opacity=".7" transform="rotate(${a} 46 78)"/>`).join('')}
   <circle cx="46" cy="62" r="14" fill="url(#c)" filter="url(#b)"/>
   ${[-30,-10,10,30].map(a=>`<path d="M46 62 L${f1(46+Math.sin(a*RAD)*16)} ${f1(62-Math.cos(a*RAD)*16)}" stroke="#ffe89a" stroke-width="1.1"/><circle cx="${f1(46+Math.sin(a*RAD)*16)}" cy="${f1(62-Math.cos(a*RAD)*16)}" r="1.6" fill="#ffe89a"/>`).join('')}
   <path d="M18 24 C20 28 21 30 19 32 C17 30 17 28 18 24Z M74 20 C76 24 77 26 75 28 C73 26 73 24 74 20Z" fill="#7affc8"/>`);

/* ---------- Aztec craft: the sun-stone ring, the trap, the mirror, the blood moon, the seal, the war drum ---------- */
/* sun-stone floor ring (lies flat): step-fret band, chalchihuitl studs, sun rays — the cast circle and every ritual ring */
const SUNRING=(band,stud,ray,ink)=>{let fret='';const N=24;for(let i=0;i<N;i++){const a=i/N*360;fret+=`<path d="M-5 -97 L-5 -103 L1 -103 L1 -100 L4 -100 L4 -107" stroke="${ink}" stroke-width="2.2" fill="none" stroke-linejoin="miter" transform="rotate(${f1(a)})"/>`;}
  let studs='';for(let i=0;i<20;i++){const a=i/20*360;studs+=`<circle cx="0" cy="-86" r="2.6" fill="${stud}" transform="rotate(${f1(a)})"/>`;}
  let rays='';for(let i=0;i<8;i++){const a=i*45+22.5;rays+=`<path d="M-5 -62 L0 -78 L5 -62Z" fill="${ray}" transform="rotate(${a})"/>`;}
  return S(220,220,rg('h',.5,.5,.5,[[0,band,0],[.5,band,0],[.88,band,.28],[1,band,0]])+blur('b',2.2),
   `<circle cx="110" cy="110" r="110" fill="url(#h)"/><g transform="translate(110 110)">
    <circle r="102" fill="none" stroke="${band}" stroke-width="13" opacity=".55" filter="url(#b)"/><circle r="102" fill="none" stroke="${band}" stroke-width="10"/>${fret}
    <circle r="108.4" fill="none" stroke="#fff8e0" stroke-width="1.2" opacity=".85"/><circle r="95.6" fill="none" stroke="#fff8e0" stroke-width="1" opacity=".7"/>
    ${studs}<circle r="80" fill="none" stroke="${band}" stroke-width="1.6" opacity=".9"/>${rays}<circle r="61" fill="none" stroke="${band}" stroke-width="2.2"/><circle r="57" fill="none" stroke="${stud}" stroke-width="1" stroke-dasharray="2 4"/></g>`);};
A.sunG=SUNRING('#ffc23a','#38e0d0','#ffe89a','#4a2a06');A.sunC=SUNRING('#e8243c','#ffc23a','#ff8a7a','#2a0408');
A.sunV=SUNRING('#8a4ae0','#38e0d0','#d8b8ff','#0c0618');A.sunJ=SUNRING('#2fd6a0','#ffc23a','#b8ffe0','#04281c');
/* the Moon Trap sigil (lies flat): obsidian teeth inward, a gold fret band, the eclipse moon in the middle */
{let teeth='';for(let i=0;i<16;i++){const a=i/16*360;teeth+=`<path d="M-6 -62 L0 -45 L6 -62Z" fill="url(#ob)" transform="rotate(${a})"/><path d="M-5 -61 L0 -47" stroke="#b48aff" stroke-width=".9" transform="rotate(${a})"/>`;}
 let fr='';for(let i=0;i<18;i++){const a=i/18*360;fr+=`<path d="M-2 -42 L2 -42 L2 -39 L-1 -39" stroke="#4a2a06" stroke-width="1.2" fill="none" transform="rotate(${a})"/>`;}
 A.trap=S(130,130,OBSG('ob')+rg('g',.5,.5,.5,[[0,'#ffd27a',.6],[1,'#ffd27a',0]])+rg('d',.4,.38,.62,[[0,'#3a2260'],[1,'#05030a']])+blur('b',2),
   `<circle cx="65" cy="65" r="64" fill="#0a0612" opacity=".35"/><g transform="translate(65 65)">${teeth}
    <circle r="41" fill="none" stroke="#ffc23a" stroke-width="6"/>${fr}<circle r="44.4" fill="none" stroke="#fff3c0" stroke-width=".8"/>
    <circle r="24" fill="url(#g)"/><circle r="15.5" fill="#38e0d0"/><circle r="14" fill="url(#d)"/><circle cx="6" cy="-3" r="12" fill="#0a0612"/>
    <path d="M-10 -6 C-8 -10 -4 -12 0 -13" stroke="#b48aff" stroke-width="1.2" fill="none"/></g>`);}
/* an obsidian spike (the trap snaps shut, Black Horizon's teeth) */
A.spike=S(18,56,lg('s',0,0,1,0,[[0,'#4a2e86'],[.45,'#120a1c'],[1,'#2a1846']])+GOLDV('gd')+blur('b',1.2),
  `<path d="M9 0 L15 30 L13 50 L5 50 L3 28Z" fill="#8a4ae0" opacity=".6" filter="url(#b)"/><path d="M9 0 L15 30 L13 50 L5 50 L3 28Z" fill="url(#s)"/>
   <path d="M9 0 L3 28 L7 49 L9 26Z" fill="#7a5ac0" opacity=".4"/><path d="M9 1 L14 30" stroke="#d8b8ff" stroke-width=".9"/><path d="M4 46 L14 46 L14 52 L4 52Z" fill="url(#gd)"/><circle cx="9" cy="3.4" r="1" fill="#ffffff"/>`);
/* Tezcatlipoca's smoking obsidian mirror (Obsidian Mirror) + its cracked state */
const MIR=crack=>S(74,98,rg('d',.38,.32,.75,[[0,'#3a2468'],[.55,'#0e0820'],[1,'#030206']])+GOLDV('gd')+blur('b',1.6)+blur('s',2.6),
  `<circle cx="37" cy="40" r="33" fill="#8a4ae0" opacity=".4" filter="url(#s)"/>
   ${[0,1,2,3,4].map(i=>{const a=(-90+(i-2)*24)*RAD;return `<path d="M${f1(37+Math.cos(a-.12)*29)} ${f1(40+Math.sin(a-.12)*29)} L${f1(37+Math.cos(a)*(i===2?40:36))} ${f1(40+Math.sin(a)*(i===2?40:36))} L${f1(37+Math.cos(a+.12)*29)} ${f1(40+Math.sin(a+.12)*29)}Z" fill="url(#gd)"/>`;}).join('')}
   <path d="M30 70 C26 80 26 88 28 96 C31 88 32 80 32 70Z" fill="#e8243c"/><path d="M37 70 C35 82 36 90 37 97 C39 90 40 82 38 70Z" fill="#38e0d0"/><path d="M44 70 C48 80 48 88 46 96 C43 88 42 80 42 70Z" fill="#e8243c"/>
   <circle cx="37" cy="40" r="28" fill="url(#gd)"/>${Array.from({length:12},(_,i)=>{const a=i/12*Math.PI*2;return `<circle cx="${f1(37+Math.cos(a)*28)}" cy="${f1(40+Math.sin(a)*28)}" r="1.7" fill="#38e0d0"/>`;}).join('')}
   <circle cx="37" cy="40" r="24.4" fill="url(#d)"/>
   <path d="M26 50 C22 42 28 36 34 40 C40 44 46 38 42 32" stroke="#8a5ad0" stroke-width="2.4" fill="none" opacity=".45" filter="url(#b)"/>
   <path d="M30 56 C28 50 32 47 36 50 C40 53 45 50 44 45" stroke="#b48aff" stroke-width="1.2" fill="none" opacity=".35"/>
   <path d="M19 33 C22 24 30 18 40 17" stroke="#e8d8ff" stroke-width="2.2" fill="none" opacity=".55" stroke-linecap="round"/>
   ${crack?`<path d="M34 18 L38 30 L31 38 L40 47 L35 61 M38 30 L48 33 L52 41 M31 38 L21 41 M40 47 L50 52" stroke="#ffffff" stroke-width="1.3" fill="none" stroke-linejoin="round"/><path d="M38 30 L48 33 L52 41 M31 38 L21 41" stroke="#b48aff" stroke-width="2.6" fill="none" opacity=".45"/>`:''}`);
A.mirror=MIR(0);A.mirrorK=MIR(1);
/* the blood moon (Blood Moon Hunt) */
A.moon=S(96,96,rg('m',.36,.34,.7,[[0,'#ffd0c0'],[.35,'#ff6a5a'],[.7,'#c81828'],[1,'#4a0610']])+rg('h',.5,.5,.5,[[0,'#ff4a3a',.6],[.5,'#ff4a3a',.22],[1,'#ff4a3a',0]])+blur('b',1),
  `<circle cx="48" cy="48" r="48" fill="url(#h)"/><circle cx="48" cy="48" r="40" fill="none" stroke="#ffc23a" stroke-width="1.4" stroke-dasharray="6 3 2 3" opacity=".9"/>
   <circle cx="48" cy="48" r="32" fill="url(#m)"/>
   <g fill="#5a0610" opacity=".42" filter="url(#b)"><ellipse cx="58" cy="40" rx="7" ry="6"/><ellipse cx="40" cy="58" rx="6" ry="5"/><ellipse cx="44" cy="34" rx="3.6" ry="3"/><ellipse cx="60" cy="60" rx="3.4" ry="3"/></g>
   <path d="M24 40 C28 28 38 21 50 20" stroke="#ffe0d8" stroke-width="2" fill="none" opacity=".6" stroke-linecap="round"/>`);
/* the Obsidian Seal: a thrown black disc with a gold jaguar glyph */
A.seal=S(50,50,rg('d',.38,.32,.75,[[0,'#3a2468'],[1,'#05030a']])+GOLDV('gd'),
  `<circle cx="25" cy="25" r="23" fill="url(#gd)"/><circle cx="25" cy="25" r="20" fill="url(#d)"/>
   <path d="M15 18 C14 13 18 11 21 14 C23 12 27 12 29 14 C32 11 36 13 35 18 C37 24 34 31 25 34 C16 31 13 24 15 18Z" fill="none" stroke="#ffc23a" stroke-width="1.8"/>
   <path d="M18 22 L22 23 M28 23 L32 22" stroke="#38e0d0" stroke-width="2" stroke-linecap="round"/><path d="M23 28 L25 30 L27 28" stroke="#ffc23a" stroke-width="1.4" fill="none"/>
   ${[0,1,2,3].map(i=>{const a=i*Math.PI/2+Math.PI/4;return `<circle cx="${f1(25+Math.cos(a)*21.6)}" cy="${f1(25+Math.sin(a)*21.6)}" r="1.8" fill="#38e0d0"/>`;}).join('')}`);
/* the huehuetl war drum (Savage Tempo): jaguar-skin body, gold bands, notched feet */
A.drum=S(56,68,lg('b',0,0,1,0,[[0,'#8a4a10'],[.35,'#f0b850'],[.6,'#ffd27a'],[1,'#8a4a10']])+GOLDV('gd')+rg('h',.4,.4,.7,[[0,'#fff3d8'],[1,'#c8a070']]),
  `<path d="M9 14 L47 14 L45 50 L11 50Z" fill="url(#b)"/>${ROS(18,26,3.6)}${ROS(30,32,4)}${ROS(41,24,3.4)}${ROS(22,40,3.6)}${ROS(38,42,3.2)}
   <path d="M8 13 L48 13 L48 18 L8 18Z M10 46 L46 46 L46 51 L10 51Z" fill="url(#gd)"/>${[12,20,28,36,44].map(x=>`<circle cx="${x}" cy="15.6" r="1.2" fill="#38e0d0"/>`).join('')}
   <ellipse cx="28" cy="13" rx="20" ry="5.6" fill="url(#h)"/><ellipse cx="28" cy="13" rx="20" ry="5.6" fill="none" stroke="#5a3418" stroke-width="1"/>
   <path d="M11 51 L45 51 L44 66 L38 66 L38 60 L32 60 L32 66 L24 66 L24 60 L18 60 L18 66 L12 66Z" fill="#9a0c22"/><path d="M11 51 L45 51 L45 54 L11 54Z" fill="#5a0610"/>`);
/* a jaguar paw print pressed into the ground (Jaguar Step, the pounce landings; lies flat) */
A.print=S(30,30,rg('g',.5,.5,.5,[[0,'#ffd27a',.55],[1,'#ffd27a',0]])+blur('b',1),
  `<ellipse cx="15" cy="16" rx="14" ry="13" fill="url(#g)"/>
   <path d="M8 21 C8 16 11 14 15 14 C19 14 22 16 22 21 C22 25 19 26 15 25.4 C11 26 8 25 8 21Z" fill="#1a0f08" opacity=".72"/>
   ${[[7.4,11.6],[12,8],[18,8],[22.6,11.6]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="2.6" ry="3.2" fill="#1a0f08" opacity=".72"/>`).join('')}
   <path d="M9 20.4 C10 17 12.6 15.6 15 15.6" stroke="#ffe89a" stroke-width=".9" fill="none" opacity=".8"/>`);
/* obsidian chain link (Dark Sun Chain) */
A.link=S(18,12,lg('l',0,0,1,1,[[0,'#6a4aa8'],[.5,'#1a0f2a'],[1,'#3a2260']]),`<path d="M9 1 C14 1 17 3.4 17 6 C17 8.6 14 11 9 11 C4 11 1 8.6 1 6 C1 3.4 4 1 9 1Z M9 3.8 C6 3.8 4.4 4.8 4.4 6 C4.4 7.2 6 8.2 9 8.2 C12 8.2 13.6 7.2 13.6 6 C13.6 4.8 12 3.8 9 3.8Z" fill="url(#l)" fill-rule="evenodd"/><path d="M3 4.4 C5 2.4 9 1.8 12 2.4" stroke="#2fd6a0" stroke-width=".9" fill="none"/>`);

/* ---------- loader: each SVG becomes a canvas at 2x ---------- */
const CV={};
for(const k in A){const im=new Image();im.onload=()=>{const c=document.createElement('canvas');c.width=A[k].w*2;c.height=A[k].h*2;c.getContext('2d').drawImage(im,0,0,c.width,c.height);CV[k]=c;};
  im.onerror=()=>console.warn('jaguar art failed',k);im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(A[k].svg);}
window.KTA={get:k=>CV[k]||null,size:k=>A[k]?[A[k].w,A[k].h]:[0,0],names:Object.keys(A),ready:()=>Object.keys(A).every(k=>CV[k]),svg:k=>A[k]&&A[k].svg};
})();
