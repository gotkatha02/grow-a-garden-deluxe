/* Frost Raider Wolf — vector art for the skill effects (owner 2026-11-20: "then do the wolf" — same brief as the cat and
   the kitsune: SVG + code VFX, each effect matching its skill's concept, timing in step with the hits; the six skills
   that play the owner's own video clips are not touched).
   Every piece is an SVG drawn here (gradients + soft blur, no dark outlines: shapes are separated by value, see
   VFX_STYLE_REF_TH.md), rasterised ONCE to a canvas at 2x and then animated by wolf_vfx4.js.
   The concepts follow the wolf's painted set in assets/fx/wolf (howling spirit wolf, ghost axe, Valhalla gate and golden
   axe, rune shield, war banner, thunder spear, execution emblem) so each skill keeps the idea the owner approved.
   Same registry as the cat's: window.KTA.get(name) -> canvas | null · window.KTA.size(name) -> [w,h] in world px. */
(()=>{
if(typeof CHAR!=='undefined'&&CHAR!=='wolf'&&!window.__WF_ART_PREVIEW)return;
const XL='xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"';
const S=(w,h,defs,body)=>({w,h,svg:`<svg ${XL} width="${w*2}" height="${h*2}" viewBox="0 0 ${w} ${h}"><defs>${defs}</defs>${body}</svg>`});
const lg=(id,x1,y1,x2,y2,stops,extra='')=>`<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${extra}>${stops.map(([o,c,a])=>`<stop offset="${o}" stop-color="${c}"${a!=null?` stop-opacity="${a}"`:''}/>`).join('')}</linearGradient>`;
const rg=(id,cx,cy,r,stops,extra='')=>`<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}" ${extra}>${stops.map(([o,c,a])=>`<stop offset="${o}" stop-color="${c}"${a!=null?` stop-opacity="${a}"`:''}/>`).join('')}</radialGradient>`;
const blur=(id,sd,pad=40)=>`<filter id="${id}" x="-${pad}%" y="-${pad}%" width="${100+2*pad}%" height="${100+2*pad}%"><feGaussianBlur stdDeviation="${sd}"/></filter>`;
const A={};

/* ---------- War Howl: the spirit of a wolf howling at the sky (head thrown back, ear laid flat, neck fur like flames) ---------- */
A.howl=S(130,150,
  rg('h',.5,.4,.5,[[0,'#ffd36a',.6],[.6,'#ffb23a',.22],[1,'#ffb23a',0]])+lg('a',0,1,0,0,[[0,'#b8620e',0],[.2,'#d07a12',.95],[.55,'#f59a1a'],[1,'#ffc23a']])+lg('k',0,1,0,0,[[0,'#7a3a06',0],[.25,'#8a4408',.9],[1,'#a85a10',.95]])+lg('b',0,1,0,0,[[0,'#ffe08a',.2],[.5,'#fff0b8',.85],[1,'#ffffff',.98]])+blur('f',.7),
  `<ellipse cx="66" cy="60" rx="62" ry="60" fill="url(#h)"/>
   <g filter="url(#f)"><path d="M44.1 69.7 L41.1 59.3 L20.0 70.4 L47.0 46.0 L56.3 38.1 L67.9 33.5 L83.3 19.0 L93.1 9.0 L99.4 7.7 L102.3 12.8 L91.0 25.5 L82.0 40.1 L108.7 28.5 L113.5 31.3 L101.4 47.3 L90.1 60.0 L86.9 71.6 L93.5 82.4 L105.7 83.5 L94.2 90.8 L103.7 101.4 L90.9 101.1 L93.6 116.4 L81.6 109.0 L78.5 122.0 L69.7 110.7 L61.4 120.7 L57.3 106.9 L44.8 109.4 L49.2 94.8 L43.8 82.5 Z" fill="none" stroke="url(#k)" stroke-width="5" stroke-linejoin="round"/><path d="M44.1 69.7 L41.1 59.3 L20.0 70.4 L47.0 46.0 L56.3 38.1 L67.9 33.5 L83.3 19.0 L93.1 9.0 L99.4 7.7 L102.3 12.8 L91.0 25.5 L82.0 40.1 L108.7 28.5 L113.5 31.3 L101.4 47.3 L90.1 60.0 L86.9 71.6 L93.5 82.4 L105.7 83.5 L94.2 90.8 L103.7 101.4 L90.9 101.1 L93.6 116.4 L81.6 109.0 L78.5 122.0 L69.7 110.7 L61.4 120.7 L57.3 106.9 L44.8 109.4 L49.2 94.8 L43.8 82.5 Z" fill="url(#a)"/>
   <path d="M45.2 57.5 L49.3 47.9 L58.6 40.0 L69.8 35.1 L85.3 20.6 L95.0 10.6 L99.4 11.6 L88.7 23.5 L79.0 38.9 L67.0 47.1 L55.7 55.9 Z" fill="url(#b)"/><path d="M85.6 40.5 L108.5 31.0 L111.1 31.9 L99.5 45.7 L89.7 55.7 Z" fill="#fff0b8" opacity=".7"/><path d="M42.0 57.4 L25.1 66.7 L45.9 48.9 Z" fill="#fff6d6" opacity=".75"/>
   <path d="M74.3 89.8 L86.3 97.2 L75.0 98.2 Z M60.7 96.6 L72.9 106.9 L60.1 106.6 Z M82.2 83.4 L91.8 87.5 L84.3 90.3 Z" fill="#fff0b8" opacity=".55"/><path d="M93.1 9.0 L99.4 7.7 L102.3 12.8 L96.7 13.3 Z" fill="#b8741a"/><path d="M93.6 22.5 L99.8 25.1 L96.9 18.7 Z M100.2 33.2 L96.2 27.9 L104.6 31.0 Z" fill="#ffffff"/></g>
   <path d="M64.7 45.2 L65.9 38.3 L72.3 34.6" stroke="#ffffff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`);

/* ---------- axes: haft to the right, the bearded blade's edge faces DOWN (the pose of a chop), Tiwaz rune on the blade ----------
   axeRed = the Executioner's ghost axe · axeGold = Valhalla's Wrath · axeIce = the spirit axe of Ravenous Leap */
const AXE={Red:['#5a0610','#7a0812','#e8303c','#ff9a8f','#fff1ec','#ff3a48'],Gold:['#6a3f0c','#a8640f','#ffb62e','#ffe89a','#ffffff','#ffc23a'],Ice:['#123a7a','#1f5fc0','#59c8ff','#c8f2ff','#ffffff','#59c8ff']};
for(const k in AXE){const p=AXE[k];A['axe'+k]=S(176,128,
  rg('h',.5,.5,.5,[[0,p[5],.5],[.6,p[5],.16],[1,p[5],0]])+lg('a',0,0,0,1,[[0,p[1]],[.5,p[2]],[1,p[3]]])+lg('s',0,0,1,0,[[0,p[2]],[.5,p[0]],[1,p[1]]])+lg('e',0,0,1,0,[[0,p[4],.2],[.5,p[4]],[1,p[4],.3]])+blur('f',.6),
  `<ellipse cx="48" cy="72" rx="52" ry="52" fill="url(#h)"/>
   <g filter="url(#f)"><path d="M16 25 L160 21 Q167 26 160 32 L16 38 Q11 31 16 25Z" fill="url(#s)"/>
   <path d="M70 23.5 h6 v12.6 h-6Z M100 22.6 h6 v11.8 h-6Z M130 21.8 h6 v10.9 h-6Z" fill="${p[3]}" opacity=".55"/>
   <path d="M28 18 L52 18 L54 42 C60 64 74 84 94 98 C68 118 24 114 2 94 C14 78 24 60 27 42 Z" fill="url(#a)"/>
   <path d="M6 91 C26 106 64 110 87 96 C68 86 56 68 50 46 L33 46 C29 64 18 78 6 91Z" fill="${p[3]}" opacity=".3"/>
   <path d="M28 18 L52 18 L53 30 L27.4 30Z" fill="${p[0]}" opacity=".55"/>
   <path d="M2 94 C24 114 68 118 94 98 C70 107 26 105 2 94Z" fill="url(#e)"/></g>
   <g stroke="${p[4]}" stroke-width="2.2" stroke-linecap="round" fill="none" opacity=".42"><path d="M46 66 V92"/><path d="M46 66 L38 74"/><path d="M46 66 L54 74"/></g>`);}

/* ---------- shields ---------- */
/* Rune Guard: a round shield of ice with the Algiz rune (protection) */
A.shieldR=S(80,80,
  rg('h',.5,.5,.5,[[.55,'#7fd8ff',.55],[1,'#7fd8ff',0]])+rg('d',.4,.34,.75,[[0,'#f6fcff'],[.5,'#8fd4ff'],[1,'#2a78d8']])+blur('g',2.2),
  `<circle cx="40" cy="40" r="40" fill="url(#h)"/><circle cx="40" cy="40" r="32" fill="url(#d)"/>
   <g stroke="#ffffff" fill="none"><path d="M40 9 V71 M13 24.5 L67 55.5 M67 24.5 L13 55.5" stroke-width="1.2" opacity=".2"/><circle cx="40" cy="40" r="31" stroke-width="3.6" opacity=".92"/><circle cx="40" cy="40" r="25.5" stroke-width="1.2" opacity=".45"/></g>
   <g fill="#ffffff" opacity=".9"><circle cx="40" cy="12.5" r="1.9"/><circle cx="40" cy="67.5" r="1.9"/><circle cx="12.5" cy="40" r="1.9"/><circle cx="67.5" cy="40" r="1.9"/></g>
   <g stroke-linecap="round" stroke-linejoin="round" fill="none"><g stroke="#1f5fc0" stroke-width="9" opacity=".55" filter="url(#g)"><path d="M40 57 V22 M40 38 L28 24 M40 38 L52 24"/></g><g stroke="#ffffff" stroke-width="4.6"><path d="M40 57 V22 M40 38 L28 24 M40 38 L52 24"/></g></g>`);
/* Iron Counter: the steel shield of a parry, with the glint of the blow it turns */
A.shieldS=S(80,80,
  rg('h',.5,.5,.5,[[.55,'#dfe8ff',.5],[1,'#dfe8ff',0]])+rg('d',.38,.32,.8,[[0,'#ffffff'],[.4,'#a9b8d2'],[1,'#3f5278']])+rg('b',.4,.35,.6,[[0,'#ffffff'],[1,'#8f9fbc']]),
  `<circle cx="40" cy="40" r="40" fill="url(#h)"/><circle cx="40" cy="40" r="32" fill="url(#d)"/>
   <path d="M40 8 L45 35 L72 40 L45 45 L40 72 L35 45 L8 40 L35 35Z" fill="#ffffff" opacity=".28"/>
   <circle cx="40" cy="40" r="33.4" stroke="#3a4c70" stroke-width="2.6" fill="none"/><g stroke="#ffffff" fill="none"><circle cx="40" cy="40" r="30.4" stroke-width="3.4" opacity=".95"/><circle cx="40" cy="40" r="24" stroke-width="1.2" opacity=".5"/></g>
   <circle cx="40" cy="40" r="9" fill="url(#b)"/><circle cx="37.4" cy="37.2" r="3" fill="#ffffff"/>
   <g fill="#ffffff" opacity=".9"><circle cx="40" cy="13" r="2"/><circle cx="40" cy="67" r="2"/><circle cx="13" cy="40" r="2"/><circle cx="67" cy="40" r="2"/><circle cx="21" cy="21" r="1.7"/><circle cx="59" cy="21" r="1.7"/><circle cx="21" cy="59" r="1.7"/><circle cx="59" cy="59" r="1.7"/></g>`);
/* Armor Break: the badge over an enemy whose armour is broken — a shield split by a crack */
A.shieldX=S(64,64,
  rg('d',.4,.34,.8,[[0,'#fff3c8'],[.5,'#d9a84a'],[1,'#6a4514']])+`<mask id="m"><rect width="64" height="64" fill="#fff"/><path d="M36 0 L27 20 L37 30 L25 44 L32 64 L39 64 L31 44 L44 30 L34 20 L42 0Z" fill="#000"/></mask>`,
  `<g mask="url(#m)"><g transform="rotate(-7 16 32)"><path d="M32 6 A26 26 0 0 0 32 58Z" fill="url(#d)"/><path d="M32 8.5 A23.5 23.5 0 0 0 32 55.5" stroke="#fff3c8" stroke-width="3" fill="none" opacity=".9"/></g>
   <g transform="rotate(7 48 32) translate(2.5 1)"><path d="M32 6 A26 26 0 0 1 32 58Z" fill="url(#d)"/><path d="M32 8.5 A23.5 23.5 0 0 1 32 55.5" stroke="#fff3c8" stroke-width="3" fill="none" opacity=".9"/></g></g>
   <path d="M39 2 L31 20 L41 30 L29 44 L35 62" stroke="#fff8dc" stroke-width="1.6" fill="none" opacity=".85" stroke-linejoin="round"/>
   <path d="M9 11 l3 5 l-5 0Z M53 50 l5 2 l-4 4Z M54 9 l4 -2 l-1 5Z" fill="#ffe08a"/>`);

/* ---------- War Banner: spear pole, crossbar, a red swallow-tailed cloth with a golden wolf's head ---------- */
A.banner=S(84,168,
  rg('h',.5,.42,.5,[[0,'#ffd36a',.42],[1,'#ffd36a',0]])+lg('p',0,0,1,0,[[0,'#7a4a1c'],[.45,'#e0b068'],[1,'#5a3410']])+lg('c',0,0,0,1,[[0,'#f04a48'],[.5,'#c01c26'],[1,'#7a0812']])+lg('g',0,0,0,1,[[0,'#fff3c4'],[.5,'#ffc23a'],[1,'#b8741a']]),
  `<ellipse cx="46" cy="70" rx="40" ry="64" fill="url(#h)"/>
   <rect x="13" y="12" width="5.6" height="154" rx="2" fill="url(#p)"/><path d="M15.8 0 L22 13 L15.8 18 L9.6 13Z" fill="url(#g)"/>
   <rect x="9" y="21" width="64" height="5" rx="2.4" fill="url(#g)"/><circle cx="73" cy="23.5" r="4" fill="#ffe89a"/>
   <path d="M22 26 H70 V120 L58 104 L46 122 L34 104 L22 120 Z" fill="url(#c)"/>
   <path d="M31 26 h5 v82 l-5 -4Z M54 26 h5 v80 l-5 6Z" fill="#ffffff" opacity=".11"/><path d="M40 26 h6 v94 l-6 -8Z" fill="#3a0206" opacity=".16"/>
   <path d="M22 26 H70 V33 H22Z" fill="url(#g)"/><path d="M24.5 33 V114 M67.5 33 V114" stroke="#ffc23a" stroke-width="1.6" opacity=".8"/>
   <path d="M46 50 L35 38 L37.5 57 L31 68 L46 90 L61 68 L54.5 57 L57 38 Z" fill="url(#g)"/>
   <path d="M38 62 L44 66 L39 68Z M54 62 L48 66 L53 68Z" fill="#7a0812"/><path d="M46 76 L43 82 H49Z" fill="#7a0812"/>`);

/* ---------- Valhalla's Wrath: the gate of light ---------- */
A.gate=S(170,200,
  rg('h',.5,.45,.5,[[0,'#fff3c4',.6],[.55,'#ffc23a',.22],[1,'#ffc23a',0]])+lg('a',0,0,0,1,[[0,'#fff6d6'],[.4,'#ffc23a'],[1,'#b8741a',.85]])+lg('d',0,0,0,1,[[0,'#ffffff',.98],[.45,'#ffe89a',.8],[1,'#ffc23a',0]])+lg('r',0,1,0,0,[[0,'#fff6d6',.5],[1,'#fff6d6',0]])+blur('f',.7),
  `<ellipse cx="85" cy="92" rx="85" ry="92" fill="url(#h)"/>
   <g fill="url(#r)"><path d="M85 120 L30 0 L52 0Z"/><path d="M85 120 L74 0 L96 0Z"/><path d="M85 120 L118 0 L140 0Z"/><path d="M85 120 L0 40 L6 22Z"/><path d="M85 120 L170 40 L164 22Z"/></g>
   <path d="M47 196 V82 A38 38 0 0 1 123 82 V196 Z" fill="url(#d)"/>
   <g filter="url(#f)"><path d="M26 196 V80 A59 59 0 0 1 144 80 V196 H123 V82 A38 38 0 0 0 47 82 V196 Z" fill="url(#a)"/>
   <path d="M30 196 V80 A55 55 0 0 1 140 80 V196 H136 V80 A51 51 0 0 0 34 80 V196Z" fill="#ffffff" opacity=".55"/>
   <path d="M85 14 L93 26 L85 38 L77 26Z" fill="#ffffff"/><path d="M36.5 108 l6 9 l-6 9 l-6 -9Z M36.5 146 l6 9 l-6 9 l-6 -9Z M133.5 108 l6 9 l-6 9 l-6 -9Z M133.5 146 l6 9 l-6 9 l-6 -9Z" fill="#fff6d6" opacity=".9"/></g>`);
/* a golden feather (the Valkyries'): falls and settles after the axe of Valhalla lands */
[['M14 62 C3 46 3 22 14 2 C25 22 25 46 14 62Z','M14 60 V8'],['M13 62 C2 44 5 20 16 2 C24 24 23 46 13 62Z','M13.4 60 Q13 30 15.6 8']].forEach(([d,r],i)=>{
  A['feather'+i]=S(28,64,lg('g',0,1,0,0,[[0,'#d98a1e'],[.5,'#ffcf5a'],[1,'#fff6d6']]),`<path d="${d}" fill="url(#g)"/><path d="${r}" stroke="#ffffff" stroke-width="1.5" fill="none" opacity=".8"/><path d="M14 44 L7 36 M14 34 L7 26 M14 44 L21 36 M14 34 L21 26" stroke="#b8741a" stroke-width="1" opacity=".45"/>`);});

/* ---------- Executioner: the emblem of a kill — a wolf's skull ---------- */
A.skull=S(88,92,
  rg('h',.5,.5,.5,[[0,'#ff3a48',.65],[.6,'#e8303c',.25],[1,'#e8303c',0]])+lg('b',0,0,0,1,[[0,'#ffffff'],[.6,'#ffe6dc'],[1,'#e8b0a0']])+blur('f',.5),
  `<circle cx="44" cy="44" r="44" fill="url(#h)"/>
   <g filter="url(#f)"><path d="M44 10 C24 10 12 23 13 39 C14 48 19 53 24 57 L28 72 L33 68 L37 80 L44 72 L51 80 L55 68 L60 72 L64 57 C69 53 74 48 75 39 C76 23 64 10 44 10Z" fill="url(#b)"/>
   <path d="M21 35 L38 40 L34 51 L24 47Z M67 35 L50 40 L54 51 L64 47Z" fill="#5a0810"/><path d="M44 52 L39.5 63 H48.5Z" fill="#5a0810"/>
   <path d="M26 12 L16 2 L18 20Z M62 12 L72 2 L70 20Z" fill="url(#b)"/><path d="M44 14 V34" stroke="#e8b0a0" stroke-width="1.4" opacity=".7"/></g>`);

/* ---------- Thunder Spear: a spear of lightning thrown from the sky, point down ---------- */
A.spear=S(56,230,
  rg('h',.5,.5,.5,[[0,'#7fc8ff',.6],[.6,'#3d7bff',.2],[1,'#3d7bff',0]])+lg('s',0,0,0,1,[[0,'#59a8ff',.0],[.25,'#59a8ff'],[1,'#d6ecff']])+lg('b',0,0,0,1,[[0,'#7fc8ff'],[.6,'#e6f6ff'],[1,'#ffffff']])+blur('f',.6),
  `<ellipse cx="28" cy="180" rx="28" ry="50" fill="url(#h)"/>
   <g filter="url(#f)"><path d="M25 0 L31 0 L30.2 160 L25.8 160Z" fill="url(#s)"/>
   <path d="M8 152 L28 143 L48 152 L28 160Z" fill="#bfe4ff"/><path d="M28 226 L11 178 L28 148 L45 178Z" fill="url(#b)"/><path d="M28 218 L19.5 180 L28 160 L36.5 180Z" fill="#ffffff"/></g>
   <path d="M28 30 L21 58 L33 82 L22 108 L31 136" stroke="#ffffff" stroke-width="2.2" fill="none" stroke-linejoin="round" opacity=".9"/>`);

/* ---------- runes (Elder Futhark): B = the ice-blue runes of branch B, G = golden, R = blood-red ----------
   0 Fehu · 1 Uruz · 2 Thurisaz · 3 Algiz (guard) · 4 Tiwaz (war) · 5 Sowilo (sun / lightning) */
const RUNE=['M15 50 V6 M15 31 L33 15 M15 19 L31 5','M13 50 V7 L32 24 V50','M17 50 V5 M17 16 L33 27 L17 38','M22 50 V6 M22 28 L8 9 M22 28 L36 9','M22 50 V7 M22 7 L8 22 M22 7 L36 22','M32 6 L12 21 L32 34 L12 49'];
const RCOL={B:['#1f5fc0','#8fd4ff'],G:['#b8741a','#ffd36a'],R:['#7a0812','#ff6a5a']};
for(const c in RCOL)RUNE.forEach((d,i)=>{A['rune'+c+i]=S(60,72,blur('g',2.4,80),
  `<g transform="translate(8 8)" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="${d}" stroke="${RCOL[c][0]}" stroke-width="10" opacity=".6" filter="url(#g)"/><path d="${d}" stroke="${RCOL[c][1]}" stroke-width="6.4"/><path d="${d}" stroke="#ffffff" stroke-width="2.6"/></g>`);});

/* ---------- loader: each SVG becomes a canvas at 2x ---------- */
const CV={};
for(const k in A){const im=new Image();im.onload=()=>{const c=document.createElement('canvas');c.width=A[k].w*2;c.height=A[k].h*2;c.getContext('2d').drawImage(im,0,0,c.width,c.height);CV[k]=c;};
  im.onerror=()=>console.warn('wolf art failed',k);im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(A[k].svg);}
window.KTA={get:k=>CV[k]||null,size:k=>A[k]?[A[k].w,A[k].h]:[0,0],names:Object.keys(A),ready:()=>Object.keys(A).every(k=>CV[k])};
})();
