/* Azure Dragon-Lion (shishi-ryu fist master) — vector art for the skill effects (owner 2026-11-21 "ทำของมังกรต่อ":
   the same brief as the cat, the kitsune and the axolotl — skill effects made with SVG + VFX, following each skill's
   concept and description). Every piece is an SVG drawn here (gradients + soft blur, no dark outlines), rasterised ONCE to a
   canvas at 2x and animated by dragon_vfx.js. Motifs come from the dragon's own painted icons and effects
   (assets/icons/dragon, assets/fx/dragon): Hokusai waves with claw-like foam and gold seigaiha scales (A · Raging Tide Fist),
   auspicious curling clouds, gold lightning and the mitsudomoe thunder seal (B · Cloud Dragon Palm), the gold komainu guardian,
   the roaring shishi and the azure dragon with its pearl (Basic / C).
   Same registry as the other heroes: window.KTA.get(name) -> canvas | null · window.KTA.size(name) -> [w,h] in world px. */
(()=>{
if(typeof CHAR!=='undefined'&&CHAR!=='dragon'&&!window.__DG_ART_PREVIEW)return;
const XL='xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"';
const S=(w,h,defs,body)=>({w,h,svg:`<svg ${XL} width="${w*2}" height="${h*2}" viewBox="0 0 ${w} ${h}"><defs>${defs}</defs>${body}</svg>`});
const stops=s=>s.map(([o,c,a])=>`<stop offset="${o}" stop-color="${c}"${a!=null?` stop-opacity="${a}"`:''}/>`).join('');
const lg=(id,x1,y1,x2,y2,s,extra='')=>`<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${extra}>${stops(s)}</linearGradient>`;
const rg=(id,cx,cy,r,s,extra='')=>`<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}" ${extra}>${stops(s)}</radialGradient>`;
const blur=(id,sd,pad=40)=>`<filter id="${id}" x="-${pad}%" y="-${pad}%" width="${100+2*pad}%" height="${100+2*pad}%"><feGaussianBlur stdDeviation="${sd}"/></filter>`;
const f1=v=>(+v).toFixed(1);
const A={};
/* materials: [ink, deep, mid, lite, core] — the same order as the palettes in dragon_vfx.js */
const SEA=['#04203a','#0b5fa8','#2fa8f0','#bfe8ff','#ffffff'],CLD=['#1e1240','#5a3cb0','#a58cf0','#ece6ff','#ffffff'],
  THU=['#2a1a04','#c88a12','#ffd23a','#fff3a0','#ffffff'],AZU=['#06123a','#1f4fd8','#4a8aff','#bcd4ff','#ffffff'],
  GLD=['#3a2206','#b8741a','#ffc23a','#ffe89a','#ffffff'],JAD=['#063a22','#17a865','#6ff0a8','#d8ffe6','#ffffff'],
  STN=['#1e1c1a','#6a645c','#a8a094','#e4ded2','#ffffff'];
const AU=(id,dir='v')=>dir==='v'?lg(id,0,0,0,1,[[0,'#fff3c0'],[.45,'#ffc23a'],[1,'#a8620e']]):lg(id,0,0,1,0,[[0,'#a8620e'],[.5,'#ffd86a'],[1,'#a8620e']]);

/* ---------- a fist of water (pointing right): knuckles lit white, the wrist dissolves into a curling tail with a gold cuff ---------- */
const fist=(p,au)=>S(72,44,lg('t',0,0,1,0,[[0,p[1],0],[.35,p[1],.8],[1,p[2]]])+rg('k',.82,.42,.6,[[0,'#ffffff'],[.35,p[3]],[1,p[2]]])+lg('c',0,0,0,1,[[0,au[0]],[.5,au[1]],[1,au[2]]])+blur('f',.7),
  `<path d="M1 23 C8 15 18 11 31 11 L33 34 C22 35 11 31 1 23Z" fill="url(#t)"/>
   <path d="M5 21 C10 17 15 16 19 18 C15 19 12 21 10 24Z M12 29 C17 31 22 31 26 30 C22 33 17 33 12 31Z" fill="${p[3]}" opacity=".75"/>
   <path d="M33 9 C40 6 50 6 57 7 C62 6 66 9 66 13 C69 14 70 18 69 21 C71 23 71 27 69 29 C70 32 68 36 64 36 C60 39 50 39 42 38 C37 38 33 36 33 34Z" fill="${p[1]}"/>
   <path d="M34 10 C41 7.5 50 7.5 56 8.6 C61 7.8 64.6 10.4 64.6 13.6 C67.4 14.8 68.4 18 67.4 21 C69.4 23 69.4 26.6 67.6 28.6 C68.4 31.6 66.4 34.6 62.8 34.8 C58.6 37.4 50 37.6 42.4 36.6 C37.6 36.4 34.6 35 34.4 33.4Z" fill="url(#k)"/>
   <g stroke="${p[1]}" stroke-width="1.3" stroke-linecap="round" fill="none" opacity=".55"><path d="M58 14 C62 14.5 64 16.5 64.5 19.5"/><path d="M58 21 C62 21.5 64.5 23.5 64.8 26.5"/><path d="M57 28 C60.5 28.5 63 30.5 63.4 33"/></g>
   <path d="M36 26 C42 23 50 23.5 55 27.5 C50 29.5 42 30.5 36 29Z" fill="${p[3]}" opacity=".9"/>
   <g filter="url(#f)"><path d="M40 12.5 C47 10.6 54 10.4 60 11.4" stroke="#ffffff" stroke-width="2.6" stroke-linecap="round" fill="none"/></g>
   <rect x="29.5" y="10" width="5.5" height="25.5" rx="2" fill="url(#c)"/><circle cx="32.2" cy="22.7" r="2" fill="#fff6d0"/>`);
A.fist=fist(SEA,['#fff3c0','#ffc23a','#a8620e']);
A.fistG=fist(GLD,['#ffffff','#ffd86a','#b06a14']);
A.fistC=fist(CLD,['#fff3c0','#ffc23a','#a8620e']);

/* ---------- a Hokusai wave (crest curling to the right, standing on its bottom edge): foam claws, gold seigaiha in the body ---------- */
A.wave=(()=>{let sg='';for(let r=0;r<3;r++)for(let i=0;i<5-r;i++){const cx=22+i*20+r*10,cy=102-r*12;for(const rr of [9,6,3])sg+=`<path d="M${cx-rr} ${cy} A${rr} ${rr} 0 0 1 ${cx+rr} ${cy}" stroke="#ffe08a" stroke-width="1" fill="none" opacity="${.5-r*.12}"/>`;}
  let claws='';[[70,21],[84,15],[98,12],[112,12],[125,15],[137,21],[147,29],[153,38]].forEach(([x,y],i)=>{claws+=`<path d="M${x} ${y} c${2+i*.2} -6 ${8} -8 ${11} -4 c-3 -1 -5 1 -6 3 c3 -2 6 -1 7 2 c-4 -1 -8 1 -10 3Z" fill="#ffffff"/>`;});
  return S(164,112,lg('b',0,1,.25,0,[[0,SEA[0]],[.3,SEA[1]],[.72,SEA[2]],[1,SEA[3]]])+lg('fc',0,0,0,1,[[0,'#ffffff'],[1,SEA[3]]])+rg('g',.6,.35,.6,[[0,'#ffffff',.5],[1,'#ffffff',0]])+blur('f',1),
   `<path d="M2 112 C8 74 36 32 88 16 C118 7 150 14 158 36 C161 48 152 60 140 57 C147 51 147 41 139 35 C128 27 110 32 102 46 C94 62 106 88 132 112Z" fill="url(#b)"/>
    <path d="M139 57 C130 63 115 59 111 48 C117 40 131 39 138 46 C142 50 142 54 139 57Z" fill="${SEA[0]}" opacity=".85"/>
    <g>${sg}</g>
    <path d="M60 30 C74 18 96 12 118 13 C100 16 82 22 66 34Z" fill="url(#fc)" opacity=".75"/>
    <path d="M140 57 C148 58 156 52 158 42 C160 52 152 62 140 60Z" fill="#ffffff"/>
    ${claws}
    <g filter="url(#f)"><path d="M14 98 C24 70 46 44 74 30" stroke="#ffffff" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".55"/><path d="M108 50 C104 64 110 82 124 98" stroke="${SEA[3]}" stroke-width="2" fill="none" stroke-linecap="round" opacity=".6"/></g>
    <g fill="#ffffff"><circle cx="160" cy="26" r="2.2"/><circle cx="150" cy="10" r="1.6"/><circle cx="135" cy="6" r="2"/><circle cx="162" cy="48" r="1.4"/></g>
    <g fill="#ffe08a"><path d="M42 60 l1.5 3.5 3.5 1.5 -3.5 1.5 -1.5 3.5 -1.5 -3.5 -3.5 -1.5 3.5 -1.5Z"/><path d="M118 80 l1.2 2.8 2.8 1.2 -2.8 1.2 -1.2 2.8 -1.2 -2.8 -2.8 -1.2 2.8 -1.2Z"/></g>`);})();

/* ---------- a crown splash (front view, standing on its bottom edge): a fan of water tongues thrown out of a foamy base ---------- */
const crown=p=>{let t='';const T=[[-64,30,6],[-40,46,7],[-18,56,8],[4,60,8],[24,52,7],[46,42,6.5],[68,28,5.5]];
  T.forEach(([a,L,w],i)=>{const r=a*Math.PI/180,bx=42+a*.14,tx=42+Math.sin(r)*L*1.05,ty=62-Math.cos(r)*L,cx=bx+Math.sin(r)*L*.35,cy=62-Math.cos(r)*L*.55,cu=a<0?-1:1;
    t+=`<path d="M${f1(bx-w)} 62 Q${f1(cx-w*.8+cu*2)} ${f1(cy)} ${f1(tx)} ${f1(ty)} Q${f1(cx+w*.8+cu*4)} ${f1(cy+4)} ${f1(bx+w)} 62Z" fill="url(#b)" opacity="${i%2?.82:.95}"/>
      <path d="M${f1(bx-w*.25)} 60 Q${f1(cx-w*.2)} ${f1(cy+2)} ${f1(tx)} ${f1(ty+1)}" stroke="#ffffff" stroke-width="${f1(w*.32)}" fill="none" stroke-linecap="round" opacity=".8"/>
      <circle cx="${f1(tx+Math.sin(r)*4)}" cy="${f1(ty-5)}" r="${f1(w*.42)}" fill="${i%2?p[3]:'#ffffff'}"/>`;});
  return S(84,64,lg('b',0,1,0,0,[[0,p[2],.5],[.4,p[2],.85],[.8,p[3]],[1,'#ffffff']])+rg('h',.5,.9,.6,[[0,'#ffffff',.9],[1,'#ffffff',0]])+blur('f',.8),
   `${t}<path d="M14 63 C16 56 24 53 30 56 C33 50 42 49 46 54 C51 49 60 51 62 57 C68 55 74 59 72 63Z" fill="#ffffff" opacity=".92"/><path d="M20 63 C24 59 30 59 34 61 C40 58 48 58 52 61 C58 59 64 60 66 63Z" fill="${p[3]}"/>
    <ellipse cx="42" cy="61" rx="30" ry="4" fill="url(#h)"/>`);};
A.crown=crown(SEA);A.crownC=crown(CLD);A.crownG=crown(GLD);

/* ---------- Tsunami Uppercut's geyser (upright, base at the bottom): foam ring at the foot, a white-streaked trunk, a bursting head ---------- */
A.geyser=S(70,160,lg('b',0,0,1,0,[[0,SEA[1]],[.4,SEA[2]],[.62,SEA[3]],[1,SEA[1]]])+lg('v',0,0,0,1,[[0,'#ffffff',.9],[.25,'#ffffff',0]])+rg('h',.5,.5,.5,[[0,'#ffffff'],[.55,SEA[3]],[1,SEA[2],0]])+blur('f',.9),
  `<path d="M21 158 C24 120 22 80 25 40 L45 40 C48 80 46 120 49 158Z" fill="url(#b)"/>
   <path d="M21 158 C24 120 22 80 25 40 L45 40 C48 80 46 120 49 158Z" fill="url(#v)"/>
   <g filter="url(#f)" stroke="#ffffff" stroke-linecap="round" fill="none" opacity=".8"><path d="M31 150 C29 110 30 80 31 48" stroke-width="2.2"/><path d="M41 140 C42 110 40 84 41 60" stroke-width="1.4"/></g>
   <path d="M35 4 C46 6 56 14 58 24 C64 22 68 28 64 34 C58 42 46 44 35 42 C24 44 12 42 6 34 C2 28 6 22 12 24 C14 14 24 6 35 4Z" fill="url(#h)"/>
   <g fill="#ffffff"><path d="M14 26 c-6 -4 -8 -10 -4 -14 c0 5 3 8 7 10Z"/><path d="M56 26 c6 -4 8 -10 4 -14 c0 5 -3 8 -7 10Z"/><path d="M33 4 c-2 -4 0 -6 3 -6 c-1 2 0 4 1 5Z"/></g>
   <path d="M8 156 C14 146 26 144 35 148 C44 144 56 146 62 156Z" fill="${SEA[3]}"/><path d="M14 157 C20 151 28 150 35 152 C42 150 50 151 56 157Z" fill="#ffffff"/>
   <g fill="${SEA[3]}"><circle cx="4" cy="14" r="2.4"/><circle cx="66" cy="10" r="2"/><circle cx="58" cy="2" r="1.6"/><circle cx="12" cy="4" r="1.8"/></g>`);

/* ---------- a sea drop (tip up) and a gold plum blossom (the gold flowers of the painted effects) ---------- */
const DROP='M12 1 C14 8 23 15 23 22.5 C23 28.8 18.2 33 12 33 C5.8 33 1 28.8 1 22.5 C1 15 10 8 12 1Z';
const drop=p=>S(24,34,lg('b',0,0,0,1,[[0,p[3]],[.5,p[2]],[1,p[1]]])+blur('f',.5),`<path d="${DROP}" fill="url(#b)"/><g filter="url(#f)"><path d="M9 11 C6 15 4.5 19 4.8 23.5 C5.8 19.6 7.5 15.6 10.6 12.6Z" fill="#ffffff"/></g><ellipse cx="16" cy="26" rx="2.4" ry="1.5" fill="#ffffff" opacity=".7" transform="rotate(-30 16 26)"/>`);
A.drop=drop(SEA);A.dropC=drop(CLD);
A.ume=(()=>{let p='';for(let i=0;i<5;i++){const a=i*72;p+=`<g transform="rotate(${a} 16 16)"><path d="M16 15 C11 12 10 4 16 2.2 C22 4 21 12 16 15Z" fill="url(#pt)"/></g>`;}
  return S(32,32,rg('pt',.5,.7,.6,[[0,'#ffffff'],[.4,'#fff0b0'],[1,'#e8a020']])+rg('c',.5,.5,.5,[[0,'#ffffff'],[1,'#ffb020']]),`${p}<circle cx="16" cy="16" r="3.4" fill="url(#c)"/><g fill="#c86a10"><circle cx="16" cy="11.6" r=".9"/><circle cx="20.2" cy="14.6" r=".9"/><circle cx="18.6" cy="19.4" r=".9"/><circle cx="13.4" cy="19.4" r=".9"/><circle cx="11.8" cy="14.6" r=".9"/></g>`);})();

/* ---------- whirlpool, seen from above (lies on the ground): spiral arms of water and foam round a dark eye ---------- */
A.whirl=(()=>{let arms='';for(let i=0;i<4;i++){const a=i*90;arms+=`<g transform="rotate(${a} 100 100)"><path d="M100 100 C112 70 150 58 178 74 C160 70 128 76 112 104Z" fill="url(#am)"/><path d="M106 96 C122 76 150 68 170 74 C150 74 126 82 112 100Z" fill="#ffffff" opacity=".75"/></g>`;}
  return S(200,200,rg('b',.5,.5,.5,[[0,SEA[0]],[.25,SEA[1]],[.7,SEA[2],.85],[.92,SEA[3],.5],[1,SEA[3],0]])+lg('am',0,0,1,1,[[0,SEA[3]],[1,SEA[2]]])+rg('e',.5,.5,.5,[[0,'#020d18'],[1,SEA[1],0]])+blur('f',1.2),
    `<circle cx="100" cy="100" r="98" fill="url(#b)"/>${arms}<circle cx="100" cy="100" r="24" fill="url(#e)"/>
     <g filter="url(#f)" stroke="#ffffff" fill="none" stroke-linecap="round" opacity=".7"><path d="M40 120 C30 90 44 54 76 40" stroke-width="2.4"/><path d="M160 80 C170 110 156 146 124 160" stroke-width="2.4"/></g>
     <g fill="#ffe08a" opacity=".85"><circle cx="150" cy="40" r="1.6"/><circle cx="46" cy="160" r="1.6"/><circle cx="172" cy="126" r="1.3"/></g>`);})();

/* ---------- Ebb and Flow's water dome (front view, standing on its bottom edge): seigaiha band, gold rim ---------- */
A.dome=(()=>{let sg='';for(let i=0;i<8;i++){const cx=20+i*20;for(const rr of [9,6,3])sg+=`<path d="M${cx-rr} 108 A${rr} ${rr} 0 0 1 ${cx+rr} 108" stroke="#ffffff" stroke-width="1.1" fill="none" opacity=".55"/>`;}
  return S(180,112,rg('b',.5,1,.95,[[0,SEA[3],.08],[.6,SEA[2],.2],[.86,SEA[2],.5],[.97,SEA[3],.85],[1,SEA[3],0]])+lg('rim',0,0,1,0,[[0,'#a8620e'],[.5,'#ffd86a'],[1,'#a8620e']])+blur('f',1.1),
    `<path d="M4 110 A86 104 0 0 1 176 110Z" fill="url(#b)"/>${sg}
     <g filter="url(#f)"><path d="M22 70 A80 96 0 0 1 82 14" stroke="#ffffff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".85"/><path d="M150 86 A80 96 0 0 0 132 42" stroke="#ffffff" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".6"/></g>
`);})();

/* ---------- auspicious clouds: lobes with spiral curls, white with a lilac underside and a thin gold rim ---------- */
const kumo=(p,rim,storm)=>S(124,64,lg('b',0,0,0,1,[[0,storm?p[2]:'#ffffff'],[.55,storm?p[1]:p[3]],[1,storm?p[0]:p[2]]])+blur('f',.8),
  `<path d="M10 52 C2 52 2 40 10 38 C8 28 20 22 28 28 C30 14 48 8 58 18 C64 6 86 6 90 20 C100 14 114 20 112 32 C122 34 122 50 112 52Z" fill="url(#b)"/>
   <g stroke="${rim}" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".95"><path d="M10 38 C8 28 20 22 28 28 C30 14 48 8 58 18 C64 6 86 6 90 20 C100 14 114 20 112 32"/></g>
   <g stroke="${storm?p[3]:p[2]}" stroke-width="2" fill="none" stroke-linecap="round"><path d="M28 28 C34 30 36 38 30 40 C26 41 24 37 27 35"/><path d="M58 18 C66 22 66 32 58 33 C53 33 52 28 55 26"/><path d="M90 20 C96 26 92 34 86 32 C82 30 84 26 87 26"/></g>
   <path d="M4 56 C20 54 34 58 46 56 C40 60 22 62 4 56Z M70 57 C84 55 100 58 116 56 C108 61 86 62 70 57Z" fill="${storm?p[1]:p[3]}" opacity=".9"/>
   <g filter="url(#f)"><path d="M36 22 C42 14 52 12 58 16" stroke="#ffffff" stroke-width="2.4" fill="none" stroke-linecap="round" opacity="${storm?.5:.9}"/></g>`);
A.kumo=kumo(CLD,'#ffd86a',0);A.kumoS=kumo(['#120a2a','#2e1f66','#5a44b0','#a890ff','#ffffff'],'#ffe45a',1);A.kumoJ=kumo(JAD,'#ffd86a',0);

/* ---------- Wind Palm: a crescent of wind (pointing right), wind streaks and a cloud curl at its tail ---------- */
const windP=(p,glint,rim)=>S(150,84,lg('c',0,0,1,0,[[0,p[1],0],[.35,p[1],.95],[.72,p[2]],[.92,p[3]],[1,'#ffffff']])+lg('s',0,0,1,0,[[0,p[1],0],[.6,p[2],.85],[1,p[3]]])+blur('f',.9),
  `<path d="M90 2 C124 13 147 30 149 42 C147 54 124 71 90 82 C113 65 123 53 123 42 C123 31 113 19 90 2Z" fill="${p[0]}" opacity=".45"/>
   <path d="M92 4 C124 14 146 30 148 42 C146 54 124 70 92 80 C114 64 124 52 124 42 C124 32 114 20 92 4Z" fill="url(#c)"/>
   <path d="M108 14 C128 24 140 34 141 42 C140 50 128 60 108 70 C120 58 126 50 126 42 C126 34 120 26 108 14Z" fill="#ffffff" opacity=".9"/>
   ${rim?`<path d="M92 4 C124 14 146 30 148 42 C146 54 124 70 92 80" stroke="${rim}" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".95"/>`:''}
   <g fill="url(#s)"><path d="M6 30 C40 25 76 27 112 33 C76 31 40 32 6 33Z"/><path d="M20 43 C52 40 84 40 120 43 C84 45 52 46 20 47Z"/><path d="M10 56 C44 53 76 51 108 49 C76 55 44 58 10 59Z"/><path d="M40 17 C62 17 84 21 100 25 C82 23 62 21 40 20Z"/><path d="M40 66 C60 66 82 62 98 58 C82 63 62 68 40 69Z"/></g>
   <g transform="translate(2 34)"><path d="M18 14 C6 14 4 4 12 2 C14 -6 28 -6 30 2 C38 0 42 10 34 14Z" fill="${p[3]}"/><path d="M14 6 C18 4 22 7 19 10" stroke="${p[2]}" stroke-width="1.6" fill="none" stroke-linecap="round"/></g>
   ${glint?`<g fill="#ffe45a"><path d="M126 22 l3 6 -4 1 5 7 -2 -6 4 -1Z"/><path d="M118 62 l3 5 -3 1 4 6 -1 -5 3 -1Z"/></g>`:''}
   <g filter="url(#f)"><path d="M100 10 C126 20 140 32 142 42" stroke="#ffffff" stroke-width="2.2" fill="none" stroke-linecap="round"/></g>`);
A.windP=windP(['#1a0e3a','#4a2aa0','#8a6ae8','#e8e0ff','#ffffff'],1,'#ffd86a');A.windT=windP(['#2a1a04','#c88a12','#ffd23a','#fff3a0','#ffffff'],0,'#ffffff');A.windS=windP(SEA,0,'');

/* ---------- Heaven Push: a great open palm of ki light (front view), gold rim, the dragon pearl in its centre ---------- */
A.palm=S(124,150,rg('b',.5,.62,.62,[[0,'#ffffff'],[.3,CLD[3]],[.75,CLD[2],.85],[1,CLD[1],.6]])+lg('rim',0,0,0,1,[[0,'#fff3c0'],[1,'#e8a020']])+rg('pr',.42,.38,.6,[[0,'#ffffff'],[.5,'#fff0c8'],[1,'#ffb020']])+blur('f',1.4)+blur('g',3.5),
  `<g filter="url(#g)" opacity=".7"><path d="M30 148 C18 120 14 96 16 78 C12 62 8 50 12 44 C18 38 26 46 30 58 L30 24 C30 14 42 14 42 24 L44 50 L46 10 C46 0 60 0 60 10 L62 50 L66 16 C66 6 80 6 80 16 L80 54 L88 30 C92 20 104 24 100 34 L96 74 C100 110 92 132 84 148Z" fill="#ffd86a"/></g>
   <path d="M30 148 C18 120 14 96 16 78 C12 62 8 50 12 44 C18 38 26 46 30 58 L30 24 C30 14 42 14 42 24 L44 50 L46 10 C46 0 60 0 60 10 L62 50 L66 16 C66 6 80 6 80 16 L80 54 L88 30 C92 20 104 24 100 34 L96 74 C100 110 92 132 84 148Z" fill="url(#b)"/>
   <path d="M30 148 C18 120 14 96 16 78 C12 62 8 50 12 44 C18 38 26 46 30 58 L30 24 C30 14 42 14 42 24 L44 50 L46 10 C46 0 60 0 60 10 L62 50 L66 16 C66 6 80 6 80 16 L80 54 L88 30 C92 20 104 24 100 34 L96 74 C100 110 92 132 84 148" stroke="url(#rim)" stroke-width="2.4" fill="none" stroke-linejoin="round"/>
   <circle cx="56" cy="94" r="15" fill="url(#pr)"/><g filter="url(#f)"><path d="M50 88 A8 8 0 0 1 58 83" stroke="#ffffff" stroke-width="2.4" fill="none" stroke-linecap="round"/></g>
   <g stroke="#ffd86a" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".85"><path d="M36 92 C38 80 46 74 54 74"/><path d="M76 98 C74 110 66 116 58 116"/></g>`);

/* ---------- the thunder seal: a gold ring with lightning ticks, and the tomoe comma that fills it (1–3 shown) ---------- */
A.sealR=(()=>{let t='';for(let i=0;i<8;i++){const a=i*45+22.5;t+=`<g transform="rotate(${a} 32 32)"><path d="M32 1 L34.5 7 L31.5 7.5 L33.5 12 L29.5 6.5 L32.5 6Z" fill="#fff3a0"/></g>`;}
  return S(64,64,rg('g',.5,.5,.5,[[0,'#ffe45a',.0],[.62,'#ffe45a',.0],[.8,'#ffd23a',.55],[1,'#ffd23a',0]])+lg('r',0,0,1,1,[[0,'#fff3c0'],[.5,'#ffc23a'],[1,'#c07a10']]),
    `<circle cx="32" cy="32" r="31" fill="url(#g)"/><circle cx="32" cy="32" r="21" fill="none" stroke="url(#r)" stroke-width="3.4"/><circle cx="32" cy="32" r="17.4" fill="#3a2a08" opacity=".28"/>${t}`);})();
A.comma=S(32,32,rg('c',.4,.35,.7,[[0,'#ffffff'],[.45,'#fff3a0'],[1,'#e8a020']]),
  `<path d="M16 3 C23 3 27 8 27 13 C27 18 23 21 18.5 21 C21 24 20.5 29 16 31 C9 27 5 21 5.4 14.6 C5.8 7.6 10.4 3 16 3Z" fill="url(#c)"/><circle cx="16.6" cy="12.6" r="4.2" fill="#fffbe0"/>`);

/* ---------- the dragon's pearl (a Ki Orb): a glowing pearl wrapped in three gold flame wisps ---------- */
A.pearl=(()=>{let fl='';for(let i=0;i<3;i++){fl+=`<g transform="rotate(${i*120} 24 24)"><path d="M24 4 C32 6 38 12 40 20 C36 14 30 12 26 14 C30 10 28 6 24 4Z" fill="url(#fl)"/></g>`;}
  return S(48,48,rg('p',.4,.36,.55,[[0,'#ffffff'],[.45,'#f2ecff'],[.8,'#b8a4ff'],[1,'#7a5ae0']])+lg('fl',0,0,1,1,[[0,'#fff3c0'],[.6,'#ffc23a'],[1,'#ff8a20',.4]])+rg('h',.5,.5,.5,[[0,'#d8ccff',.6],[1,'#d8ccff',0]]),
    `<circle cx="24" cy="24" r="23" fill="url(#h)"/>${fl}<circle cx="24" cy="24" r="10.5" fill="url(#p)"/><ellipse cx="20.6" cy="20" rx="3.4" ry="2.2" fill="#ffffff" transform="rotate(-35 20.6 20)"/>`);})();

/* ---------- the azure dragon's head (side view, looking right): open jaws, gold horns, white whiskers, flame mane ---------- */
const dhead=(p,mane)=>S(100,64,lg('s',0,0,0,1,[[0,p[3]],[.45,p[2]],[1,p[1]]])+lg('h',0,0,1,0,[[0,'#a8620e'],[.6,'#ffd86a'],[1,'#fff3c0']])+lg('m',1,0,0,0,[[0,mane[3]],[.5,mane[2]],[1,mane[1],0]])+lg('bl',0,0,0,1,[[0,'#ffffff'],[1,p[3]]])+blur('f',.7),
  `<path d="M30 30 C18 18 8 22 2 14 C6 28 16 34 26 36 C14 40 6 50 0 50 C12 54 24 46 32 42Z" fill="url(#m)"/>
   <path d="M30 20 C38 12 50 10 60 14 C68 12 80 14 90 20 C96 22 98 26 96 29 L70 30 C74 34 86 36 94 38 C96 41 92 46 86 46 C76 47 66 44 58 42 C52 46 42 48 34 46 C26 44 24 26 30 20Z" fill="url(#s)"/>
   <path d="M70 30 L96 29 C95 33 92 35 88 35 C82 35 76 33 70 30Z" fill="#7a0e18"/><path d="M72 30.5 L94 29.6 L91 32.4 L88 30.8 L85 33 L82 31 L79 32.6 L76 31Z" fill="#ffffff"/>
   <path d="M60 42 C70 44 80 46 88 45 C80 48 70 48 60 45Z" fill="url(#bl)"/>
   <path d="M44 15 C40 6 30 2 20 4 C28 6 36 10 40 18Z" fill="url(#h)"/><path d="M52 13 C52 4 46 -2 38 -2 C44 2 48 8 48 15Z" fill="url(#h)"/>
   <ellipse cx="62" cy="21" rx="4.6" ry="3.4" fill="#fff3c0"/><ellipse cx="63" cy="21" rx="2" ry="2.8" fill="#2a0a06"/><circle cx="62.2" cy="19.8" r=".9" fill="#ffffff"/>
   <g stroke="#ffffff" stroke-width="1.6" fill="none" stroke-linecap="round"><path d="M86 22 C82 12 70 8 60 6"/><path d="M84 40 C78 52 66 56 54 60"/></g>
   <g filter="url(#f)"><path d="M36 22 C46 16 58 15 70 17" stroke="#ffffff" stroke-width="2" fill="none" stroke-linecap="round" opacity=".7"/></g>
   <g fill="${p[3]}" opacity=".8"><path d="M40 30 c3 -2 6 -2 8 0 c-3 1 -5 1 -8 0Z"/><path d="M46 36 c3 -2 6 -2 8 0 c-3 1 -5 1 -8 0Z"/></g>`);
A.dhead=dhead(AZU,['','#1f4fd8','#7aa8ff','#ffffff']);A.dheadC=dhead(CLD,['','#5a3cb0','#c8b8ff','#ffffff']);A.dheadW=dhead(SEA,['','#0b5fa8','#7fd0ff','#ffffff']);

/* ---------- the komainu guardian (Komainu Guard): a round gold shield with the lion-dog face, curly mane, red tassels ---------- */
const komainu=(p,stone)=>{let mane='';for(let i=0;i<12;i++){const a=i*30;mane+=`<g transform="rotate(${a} 50 48)"><path d="M50 4 C58 4 62 10 58 15 C55 12 52 12 50 14 C48 12 45 12 42 15 C38 10 42 4 50 4Z" fill="url(#mn)"/><circle cx="50" cy="9" r="2.2" fill="${p[1]}" opacity=".6"/></g>`;}
  return S(100,112,rg('d',.42,.38,.62,[[0,p[4]],[.4,p[3]],[.8,p[2]],[1,p[1]]])+lg('mn',0,0,0,1,[[0,p[3]],[1,p[1]]])+rg('fc',.5,.4,.6,[[0,stone?'#f2ede4':'#fffaf0'],[1,stone?'#b8b0a2':'#ffe2a8']])+blur('f',.8),
    `${stone?'':`<g><path d="M30 86 C28 96 30 104 26 110 M70 86 C72 96 70 104 74 110" stroke="#b8141c" stroke-width="2.4" fill="none"/><path d="M22 102 C22 98 30 98 30 102 L31 111 L21 111Z M70 102 C70 98 78 98 78 102 L79 111 L69 111Z" fill="#e0242c"/></g>`}
     ${mane}<circle cx="50" cy="48" r="33" fill="url(#d)"/><circle cx="50" cy="48" r="27" fill="url(#fc)"/>
     <path d="M30 38 C34 30 42 30 46 36 C40 34 34 36 30 38Z M70 38 C66 30 58 30 54 36 C60 34 66 36 70 38Z" fill="${p[1]}"/>
     <ellipse cx="40" cy="43" rx="6" ry="5" fill="#ffffff"/><ellipse cx="60" cy="43" rx="6" ry="5" fill="#ffffff"/><circle cx="41" cy="44" r="3" fill="${stone?'#3a3630':'#2a1606'}"/><circle cx="59" cy="44" r="3" fill="${stone?'#3a3630':'#2a1606'}"/>
     <path d="M44 52 C46 49 54 49 56 52 C54 55 46 55 44 52Z" fill="${p[1]}"/>
     <path d="M36 60 C40 70 60 70 64 60 C58 63 42 63 36 60Z" fill="${stone?'#4a4540':'#8a1016'}"/><path d="M40 61 L42 66 L44 62 M56 62 L58 66 L60 61" fill="#ffffff" stroke="#ffffff" stroke-width="1.2"/>
     <g stroke="${p[1]}" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".8"><path d="M26 58 C24 64 28 70 34 72"/><path d="M74 58 C76 64 72 70 66 72"/><path d="M50 22 C46 26 54 30 50 34"/></g>
     <g filter="url(#f)"><path d="M28 30 A26 26 0 0 1 48 20" stroke="#ffffff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".85"/></g>`);};
A.komainu=komainu(GLD,0);A.komainuS=komainu(STN,1);

/* ---------- the shishi spirit roaring (front view): gold mane in curls round an azure-masked face; a blue-flame twin for Awakening ---------- */
const shishi=(p,mn,flame)=>{let m='';for(let i=0;i<14;i++){const a=i*360/14,L=(i%2?38:46)+(i%3)*3,b=flame?14:10;
    m+=`<g transform="rotate(${f1(a)} 70 64)"><path d="M70 64 C${70-b} ${64-L*.5} ${70-b*.4} ${64-L*.9} ${70+b*.6} ${64-L-8} C${70+b*.2} ${64-L*.8} ${70+b*1.2} ${64-L*.6} ${70+b*.9} ${64-L*.25} C${70+b*.6} ${64-L*.1} ${70+2} 64 70 64Z" fill="url(#mn)"/>
      <path d="M${70+b*.55} ${64-L-4} C${70+b*.1} ${64-L*.82} ${70+b*.7} ${64-L*.6} ${70+b*.5} ${64-L*.4}" stroke="${mn[3]}" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".9"/></g>`;}
  return S(140,128,`<radialGradient id="mn" gradientUnits="userSpaceOnUse" cx="70" cy="64" r="64">${stops([[0,mn[3]],[.6,mn[2]],[1,mn[1]]])}</radialGradient>`+rg('fc',.5,.42,.6,[[0,'#ffffff'],[.6,'#f2f4ff'],[1,'#c8d0ec']])+lg('h',0,0,0,1,[[0,'#fff3c0'],[1,'#c07a10']])+blur('f',1),
    `${m}<circle cx="70" cy="64" r="34" fill="url(#mn)"/>
     <path d="M48 46 C40 30 44 18 52 12 C52 24 56 34 60 40Z M92 46 C100 30 96 18 88 12 C88 24 84 34 80 40Z" fill="url(#h)"/>
     <path d="M70 34 C88 34 98 48 96 66 C94 84 84 96 70 96 C56 96 46 84 44 66 C42 48 52 34 70 34Z" fill="url(#fc)"/>
     <path d="M52 52 C56 44 64 44 66 50 L60 56Z M88 52 C84 44 76 44 74 50 L80 56Z" fill="${p[1]}"/><path d="M62 38 L70 50 L78 38 C74 42 66 42 62 38Z" fill="${p[1]}"/>
     <path d="M54 54 L62 52 L60 58Z M86 54 L78 52 L80 58Z" fill="#ffd23a"/><circle cx="59" cy="55" r="1.6" fill="#2a0a06"/><circle cx="81" cy="55" r="1.6" fill="#2a0a06"/>
     <path d="M64 64 C66 61 74 61 76 64 C74 67 66 67 64 64Z" fill="${p[0]}"/>
     <path d="M54 72 C58 90 82 90 86 72 C80 76 60 76 54 72Z" fill="#8a1016"/><path d="M56 73 L59 79 L62 74Z M84 73 L81 79 L78 74Z M60 86 L63 81 L66 86Z M80 86 L77 81 L74 86Z" fill="#ffffff"/>
     <g filter="url(#f)"><path d="M50 46 C54 38 62 35 70 35" stroke="#ffffff" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".8"/></g>`);};
A.shishi=shishi(AZU,['','#b8741a','#ffd23a','#fff3c0'],0);A.shishiB=shishi(AZU,['','#1f4fd8','#4ab8ff','#e8f6ff'],1);

/* ---------- a blue flame tongue (upright, base at the bottom) and a gold horn (pointing right) ---------- */
A.flameB=S(40,84,lg('o',0,1,0,0,[[0,AZU[1]],[.5,'#3ab8ff'],[1,'#bfe8ff',.2]])+lg('i',0,1,0,0,[[0,'#ffffff'],[.6,'#bfefff'],[1,'#bfefff',0]])+blur('f',.8),
  `<path d="M20 83 C6 82 2 70 6 58 C10 46 8 34 14 22 C14 32 18 38 22 40 C20 28 24 14 32 2 C30 18 36 30 36 46 C38 58 38 72 32 78 C28 82 24 83 20 83Z" fill="url(#o)"/>
   <g filter="url(#f)"><path d="M20 80 C12 78 12 68 16 60 C18 54 18 48 20 44 C22 52 28 56 28 64 C28 74 26 80 20 80Z" fill="url(#i)"/></g>`);
A.horn=S(96,40,lg('g',0,0,0,1,[[0,'#fff3c0'],[.45,'#ffc23a'],[1,'#a8620e']])+lg('s',0,0,1,0,[[0,'#ffd86a',0],[1,'#ffe89a',.9]])+blur('f',.7),
  `<g fill="url(#s)"><path d="M2 14 C20 13 38 14 52 16 C38 15 20 15 2 16Z"/><path d="M8 24 C24 23 40 23 54 24 C40 25 24 26 8 26Z"/></g>
   <path d="M40 30 C50 18 66 10 94 6 C76 14 64 22 58 34 C52 36 44 35 40 30Z" fill="url(#g)"/>
   <g stroke="#a8620e" stroke-width="1.2" fill="none" opacity=".6"><path d="M48 28 C52 24 56 22 60 22"/><path d="M56 24 C60 20 64 18 68 17"/><path d="M64 19 C68 16 72 14 76 13"/></g>
   <g filter="url(#f)"><path d="M46 26 C56 16 70 11 88 8" stroke="#ffffff" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".85"/></g>`);

/* ---------- Mirror Pond: a still round pool seen from above, reflected light, a gold rim with plum blossoms ---------- */
A.mirror=(()=>{let fl='';for(let i=0;i<4;i++){const a=i*90+45,x=100+Math.cos(a*Math.PI/180)*92,y=100+Math.sin(a*Math.PI/180)*92;fl+=`<g transform="translate(${f1(x-8)} ${f1(y-8)}) scale(.5)">${'<path d="M16 15 C11 12 10 4 16 2.2 C22 4 21 12 16 15Z" fill="#ffe08a"/>'.repeat(1)}<circle cx="16" cy="16" r="5" fill="#ffd23a"/></g>`;}
  return S(200,200,rg('b',.46,.42,.6,[[0,'#ffffff',.9],[.25,SEA[3],.75],[.7,SEA[2],.55],[1,SEA[1],.6]])+lg('rim',0,0,1,1,[[0,'#fff3c0'],[.5,'#ffc23a'],[1,'#b06a14']])+blur('f',1.4),
    `<circle cx="100" cy="100" r="92" fill="url(#b)"/>
     <g stroke="#ffffff" fill="none" opacity=".55"><circle cx="100" cy="100" r="34" stroke-width="1.4"/><circle cx="100" cy="100" r="58" stroke-width="1.1"/><circle cx="100" cy="100" r="78" stroke-width=".9"/></g>
     <g filter="url(#f)"><path d="M40 80 C52 56 74 42 100 38" stroke="#ffffff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".85"/><path d="M150 132 C140 148 124 158 106 162" stroke="#ffffff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".6"/></g>
     <circle cx="100" cy="100" r="93" fill="none" stroke="url(#rim)" stroke-width="4"/>${fl}`);})();

/* ---------- loader: each SVG becomes a canvas at 2x ---------- */
const CV={};
for(const k in A){const im=new Image();im.onload=()=>{const c=document.createElement('canvas');c.width=A[k].w*2;c.height=A[k].h*2;c.getContext('2d').drawImage(im,0,0,c.width,c.height);CV[k]=c;};
  im.onerror=()=>console.warn('dragon art failed',k);im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(A[k].svg);}
window.KTA={get:k=>CV[k]||null,size:k=>A[k]?[A[k].w,A[k].h]:[0,0],names:Object.keys(A),ready:()=>Object.keys(A).every(k=>CV[k]),svg:k=>A[k]&&A[k].svg};
})();
