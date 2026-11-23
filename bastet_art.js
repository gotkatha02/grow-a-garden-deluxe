/* Bastet curse priestess (Egypt) — vector art for the skill effects (owner 2026-11-23 "ทำของบาสเต็ด": the same brief as the cat,
   kitsune, axolotl, dragon, lion, croc and sheep — every skill effect made with SVG + VFX, following its concept and description).
   Every piece is an SVG drawn here (gradients + soft blur, no dark outlines), rasterised ONCE to a canvas at 2x and animated by bastet_vfx.js.
   Motifs: papyrus pages with soul-fire hieroglyphs, the gold ankh, the sistrum, the black cat of the omen, the temple obelisk,
   violet curse hieroglyphs and seals, the Pharaoh's eye (wedjat), locusts, Apep the chaos serpent, mummy linen, golden scarabs,
   the Anubis shade, servant mummies (warrior + pharaoh lord), the scales of Ma'at and her feather, Ammit the devourer, the Duat gate,
   ba-soul wisps, canopic jars, Sekhmet's red plague sun, the golden Bastet spirit, Osiris's crook and flail, hieroglyph floor rings.
   Same registry as the other heroes: window.KTA.get(name) -> canvas | null · window.KTA.size(name) -> [w,h] in world px. */
(()=>{
if(typeof CHAR!=='undefined'&&CHAR!=='bastet'&&!window.__BA_ART_PREVIEW)return;
const XL='xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"';
const S=(w,h,defs,body)=>({w,h,svg:`<svg ${XL} width="${w*2}" height="${h*2}" viewBox="0 0 ${w} ${h}"><defs>${defs}</defs>${body}</svg>`});
const stops=s=>s.map(([o,c,a])=>`<stop offset="${o}" stop-color="${c}"${a!=null?` stop-opacity="${a}"`:''}/>`).join('');
const lg=(id,x1,y1,x2,y2,s,extra='')=>`<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${extra}>${stops(s)}</linearGradient>`;
const rg=(id,cx,cy,r,s,extra='')=>`<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}" ${extra}>${stops(s)}</radialGradient>`;
const blur=(id,sd,pad=40)=>`<filter id="${id}" x="-${pad}%" y="-${pad}%" width="${100+2*pad}%" height="${100+2*pad}%"><feGaussianBlur stdDeviation="${sd}"/></filter>`;
const f1=v=>(+v).toFixed(1);
const A={};
const GOLDV=id=>lg(id,0,0,0,1,[[0,'#fff3c0'],[.45,'#ffc23a'],[1,'#a8620e']]),GOLDH=id=>lg(id,0,0,1,0,[[0,'#a8620e'],[.45,'#ffd86a'],[.6,'#fff3c0'],[1,'#a8620e']]);
const LINEN=id=>lg(id,0,0,1,1,[[0,'#fffaf0'],[.5,'#e8d3a0'],[1,'#9a8048']]);
const TQ='#2ad0e8',TQD='#127a8c',LAP='#2a4ab8',VIO='#b06aff',VIOD='#5a1ab0';

/* ---------- a papyrus page with soul-fire hieroglyphs (the Ankh Tome's shot) ---------- */
const GL=[ /* tiny hieroglyphs: eye, bird, water, ankh, reed, loaf */
  (x,y)=>`<path d="M${x-2.2} ${y} C${x-1} ${y-1.4} ${x+1} ${y-1.4} ${x+2.2} ${y} C${x+1} ${y+1.2} ${x-1} ${y+1.2} ${x-2.2} ${y}Z"/><circle cx="${x}" cy="${y}" r=".6"/>`,
  (x,y)=>`<path d="M${x-2} ${y+1.6} C${x-1} ${y-.6} ${x} ${y-1.8} ${x+1.6} ${y-1.4} L${x+2.2} ${y-.6} L${x+.8} ${y} L${x+1} ${y+1.6}Z"/>`,
  (x,y)=>`<path d="M${x-2.4} ${y} L${x-1.6} ${y-.8} L${x-.8} ${y} L${x} ${y-.8} L${x+.8} ${y} L${x+1.6} ${y-.8} L${x+2.4} ${y}" fill="none" stroke-width=".7"/>`,
  (x,y)=>`<circle cx="${x}" cy="${y-1}" r=".9" fill="none" stroke-width=".6"/><path d="M${x-1.4} ${y} L${x+1.4} ${y} M${x} ${y} L${x} ${y+2}" fill="none" stroke-width=".6"/>`,
  (x,y)=>`<path d="M${x} ${y+1.8} L${x} ${y-1.8} M${x} ${y-1.8} C${x+1} ${y-1.2} ${x+1.4} ${y-.4} ${x+.8} ${y+.2}" fill="none" stroke-width=".6"/>`,
  (x,y)=>`<path d="M${x-1.8} ${y+.8} C${x-1.8} ${y-1} ${x+1.8} ${y-1} ${x+1.8} ${y+.8}Z"/>`];
const glyphRows=(x0,y0,cols,rows,dx,dy,seed)=>{let s='';let k=seed;for(let c=0;c<cols;c++)for(let r=0;r<rows;r++){k=(k*7+3)%GL.length;s+=GL[k](x0+c*dx,y0+r*dy);}return s;};
A.page=S(26,32,lg('p',0,0,1,1,[[0,'#fffaf0'],[.55,'#f2e2b4'],[1,'#c4a462']])+lg('c',0,0,1,1,[[0,'#f2e2b4'],[1,'#8a6a32']])+blur('g',.7),
  `<path d="M3 3 C9 2.2 15 2.4 21.4 2 C22.4 10 23.2 19 23 26.6 L19.6 30 L4 30.2 C2.6 21 2.2 12 3 3Z" fill="url(#p)"/>
   <path d="M19.6 30 L23 26.6 C21.6 26.8 20.2 27.6 19.6 30Z" fill="url(#c)"/>
   <g stroke="#b8985a" stroke-width=".3" opacity=".45"><path d="M4 7 L21 6.4 M4 12 L21.6 11.6 M4 17 L22 16.8 M4 22 L22.2 22 M4.4 27 L19 27.2"/></g>
   <path d="M3 3 C9 2.2 15 2.4 21.4 2" stroke="#ffffff" stroke-width=".8" fill="none" opacity=".8"/>
   <g fill="${TQ}" stroke="${TQ}" filter="url(#g)" opacity=".8">${glyphRows(7,7,3,4,5.4,5.8,1)}</g>
   <g fill="${TQD}" stroke="${TQD}">${glyphRows(7,7,3,4,5.4,5.8,1)}</g>`);
/* the golden page of the Avatar (same sheet, gold leaf and glowing gold signs) */
A.pageG=S(26,32,lg('p',0,0,1,1,[[0,'#fff8d8'],[.55,'#ffd86a'],[1,'#b8741a']])+lg('c',0,0,1,1,[[0,'#ffe89a'],[1,'#8a5410']])+blur('g',.7),
  `<path d="M3 3 C9 2.2 15 2.4 21.4 2 C22.4 10 23.2 19 23 26.6 L19.6 30 L4 30.2 C2.6 21 2.2 12 3 3Z" fill="url(#p)"/>
   <path d="M19.6 30 L23 26.6 C21.6 26.8 20.2 27.6 19.6 30Z" fill="url(#c)"/>
   <g fill="#ffffff" stroke="#ffffff" filter="url(#g)" opacity=".85">${glyphRows(7,7,3,4,5.4,5.8,2)}</g>
   <g fill="#8a4a08" stroke="#8a4a08">${glyphRows(7,7,3,4,5.4,5.8,2)}</g>`);
/* torn papyrus scraps (debris) */
[['M1 2 L8 1 L9.2 7 L6 11 L1.6 10Z','M3 5 L6.6 4.6'],['M2 1 L9 2.4 L8 9 L3 11.2 L1 6Z','M3.6 4 L6 6 M3 8 L5 7.4'],['M1.4 3 L6 1 L9.4 4 L8 10.6 L2 9Z','M4 4.4 L4.4 8']].forEach(([d,m],i)=>{
  A['scrap'+i]=S(10,12,lg('p',0,0,1,1,[[0,'#fff6dc'],[1,'#c8a868']]),`<path d="${d}" fill="url(#p)"/><path d="${m}" stroke="${TQD}" stroke-width=".9" fill="none"/>`);});
/* linen strip (bandage debris) */
A.bandage=S(36,8,lg('l',0,0,0,1,[[0,'#fffaf0'],[.5,'#e8d3a0'],[1,'#a8874a']]),
  `<path d="M1 3 C8 1 14 4.6 22 2.6 C27 1.4 31 2 35 1 L35 5.4 C31 6.4 27 5.6 22 7 C14 8.6 8 5 1 7Z" fill="url(#l)"/><path d="M6 3.4 L6.6 6.2 M15 3.6 L15.4 6.6 M26 2.4 L26.4 5.8" stroke="#a8874a" stroke-width=".6" opacity=".6"/>`);

/* ---------- the gold ankh (turquoise inlay) ---------- */
const ANKH='M15 2 C7 2 4.5 9 4.5 13.5 C4.5 18.4 8.6 21.4 12.6 22.8 L4.4 22.8 C3.2 22.8 2.4 23.6 2.4 24.8 L2.4 27 C2.4 28.2 3.2 29 4.4 29 L12.4 29 L11.4 44 L18.6 44 L17.6 29 L25.6 29 C26.8 29 27.6 28.2 27.6 27 L27.6 24.8 C27.6 23.6 26.8 22.8 25.6 22.8 L17.4 22.8 C21.4 21.4 25.5 18.4 25.5 13.5 C25.5 9 23 2 15 2Z M15 7.6 C11.6 7.6 10.2 10.6 10.2 13.4 C10.2 16.4 12.6 18.8 15 20 C17.4 18.8 19.8 16.4 19.8 13.4 C19.8 10.6 18.4 7.6 15 7.6Z';
A.ankh=S(30,46,GOLDH('g')+blur('f',1.4),
  `<path d="${ANKH}" fill="#ffc23a" opacity=".55" filter="url(#f)" fill-rule="evenodd"/><path d="${ANKH}" fill="url(#g)" fill-rule="evenodd"/>
   <path d="M15 24 L15 41.4 M5 25.9 L25 25.9" stroke="${TQ}" stroke-width="1.6" opacity=".9"/>
   <path d="M8.4 9.4 C9.6 6.4 12.4 4.6 15 4.6" stroke="#ffffff" stroke-width="1.3" fill="none" opacity=".75" stroke-linecap="round"/>`);
/* the green-gold ankh of life (heal) */
A.ankhL=S(30,46,lg('g',0,0,1,0,[[0,'#3a8a2a'],[.45,'#c8ff8a'],[.6,'#ffffff'],[1,'#3a8a2a']])+blur('f',1.6),
  `<path d="${ANKH}" fill="#7aff6a" opacity=".6" filter="url(#f)" fill-rule="evenodd"/><path d="${ANKH}" fill="url(#g)" fill-rule="evenodd"/>
   <path d="M15 24 L15 41.4 M5 25.9 L25 25.9" stroke="#ffd36a" stroke-width="1.5" opacity=".95"/>`);
/* ---------- the sistrum (temple rattle) ---------- */
A.sistrum=S(22,42,GOLDH('g')+GOLDV('v'),
  `<path d="M5 22 C3 12 6 3 11 3 C16 3 19 12 17 22" stroke="url(#g)" stroke-width="2.6" fill="none"/>
   <path d="M5.2 9 L16.8 9 M4.4 14 L17.6 14 M4.8 19 L17.2 19" stroke="#c8872a" stroke-width="1.1"/>
   <g fill="#fff3c0" stroke="#a8620e" stroke-width=".4">${[[8,9],[14,9],[7.4,14],[14.6,14],[8,19],[14,19]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="1.6" ry="1.9"/>`).join('')}</g>
   <path d="M6.6 22 C6.6 26.6 8.4 28.4 11 28.4 C13.6 28.4 15.4 26.6 15.4 22Z" fill="url(#v)"/><circle cx="9.4" cy="24.4" r=".7" fill="${TQD}"/><circle cx="12.6" cy="24.4" r=".7" fill="${TQD}"/>
   <path d="M6.2 22.4 C4.6 22 4 23.6 5 25 M15.8 22.4 C17.4 22 18 23.6 17 25" stroke="#c8872a" stroke-width="1" fill="none"/>
   <rect x="9.6" y="28" width="2.8" height="13" rx="1.2" fill="url(#g)"/><rect x="9.6" y="32" width="2.8" height="1.6" fill="${TQ}"/>`);

/* ---------- the black cat of the omen (leaping, facing right) + the sitting shadow cat ---------- */
const CATL='M53.4 4.2 L55.6 0.8 L57.6 6.4 C60.6 7.8 62.6 10.4 62.4 13.2 C62.2 15.4 60.4 16.8 58 17.2 L62.4 20.6 C63.6 21.6 63 23.2 61.4 22.8 L53.8 20.2 C49.4 21.6 44.6 23 39.6 23.2 C33.6 23.6 28.2 23 24.2 22.2 L9.4 30.6 C7.8 31.6 6.2 30 7.4 28.8 L18.2 20 C16.2 18.6 15.4 16.6 16 15 C12 12.2 9.4 8 9.6 3.6 C9.7 2 11.6 1.8 12 3.4 C12.8 7.4 15.2 10.6 19.2 12.4 C25.4 10.6 33.2 10.2 40.2 10.6 C44.4 10.8 48.4 10.4 50.8 8.6 L51.2 2.4Z';
A.catL=S(64,34,lg('b',0,0,0,1,[[0,'#4a2a6a'],[.5,'#1c1028'],[1,'#0a0612']])+blur('g',2.2)+blur('s',.6),
  `<path d="${CATL}" fill="${VIO}" opacity=".55" filter="url(#g)"/><path d="${CATL}" fill="url(#b)"/>
   <path d="M19.2 12.4 C25.4 10.6 33.2 10.2 40.2 10.6 C44.4 10.8 48.4 10.4 50.8 8.6" stroke="#b07aff" stroke-width="1.3" fill="none" opacity=".75" filter="url(#s)"/>
   <ellipse cx="57.4" cy="10.4" rx="1.7" ry="1.1" fill="#ffe08a"/><ellipse cx="57.6" cy="10.4" rx=".5" ry="1" fill="#2a1406"/>
   <circle cx="53.6" cy="8.6" r="1.6" fill="none" stroke="#ffd36a" stroke-width=".8"/>
   <path d="M51.6 14.6 C52.6 16 54.6 16.6 56.4 16" stroke="#ffd36a" stroke-width="1.4" fill="none"/>`);
const CATS='M20.4 2.4 L22.8 9.6 C25.8 10 28 12.4 28 15.4 C28 17.8 26.8 19.4 25 20.2 L24.8 26.6 C27.2 30.6 28.6 36.2 28.4 42 L28.8 47.6 L24.6 47.6 L24.4 42.6 C22.2 44.6 18.4 46.4 14.4 47.6 C9.4 49 5.2 48.2 5 46.4 C4.8 44.8 7.2 44.6 10.2 44.4 C8.8 40 8.4 33.4 10.4 27.8 C12 23.4 15 20.2 17.4 18.6 C16.2 16.4 16 13.8 17 11.4 L16.4 3.4 L19.4 8.8Z';
A.catS=S(34,50,lg('b',0,0,1,1,[[0,'#4a2a6a'],[.45,'#1c1028'],[1,'#08040e']])+blur('g',2)+blur('s',.5),
  `<path d="${CATS}" fill="${VIO}" opacity=".5" filter="url(#g)"/><path d="${CATS}" fill="url(#b)"/>
   <path d="M17.4 18.6 C15 20.2 12 23.4 10.4 27.8 C8.4 33.4 8.8 40 10.2 44.4" stroke="#b07aff" stroke-width="1.1" fill="none" opacity=".7" filter="url(#s)"/>
   <ellipse cx="23.6" cy="14" rx="1.6" ry="1.1" fill="#ffe08a"/><ellipse cx="23.8" cy="14" rx=".45" ry=".95" fill="#2a1406"/>
   <circle cx="21.6" cy="11.6" r="1.4" fill="none" stroke="#ffd36a" stroke-width=".7"/>
   <path d="M17.6 21 C20 23 23.4 23.2 25.2 21.4" stroke="#ffd36a" stroke-width="2" fill="none"/><path d="M17.8 22.6 C20 24.4 23.2 24.6 25 23" stroke="${TQ}" stroke-width=".9" fill="none"/>`);
/* ---------- the temple obelisk (sandstone, gold pyramidion, glowing hieroglyph column) ---------- */
A.obelisk=S(28,100,lg('l',0,0,1,0,[[0,'#fff0c8'],[1,'#e2c486']])+lg('r',0,0,1,0,[[0,'#c8a464'],[1,'#8a6a34']])+lg('p',0,0,1,0,[[0,'#fff3c0'],[.5,'#ffd23a'],[1,'#a8620e']])+blur('g',.8),
  `<path d="M14 2 L7.4 14 L14 14Z" fill="#fff3c0"/><path d="M14 2 L20.6 14 L14 14Z" fill="url(#p)"/>
   <path d="M7.4 14 L14 14 L14 91 L4.6 91Z" fill="url(#l)"/><path d="M14 14 L20.6 14 L23.4 91 L14 91Z" fill="url(#r)"/>
   <path d="M7.4 14 L20.6 14 L20.8 17 L7.2 17Z" fill="#d8a83a"/>
   <g fill="${TQ}" stroke="${TQ}" filter="url(#g)">${glyphRows(10.6,23,1,11,0,6.1,4)}</g><g fill="${TQD}" stroke="${TQD}">${glyphRows(10.6,23,1,11,0,6.1,4)}</g>
   <path d="M1 91 L27 91 L27 98 L1 98Z" fill="#b89a5a"/><path d="M1 91 L27 91 L27 92.6 L1 92.6Z" fill="#f0dca8"/>`);

/* ---------- violet curse hieroglyphs (hex marks, glyph seals) ---------- */
const GP=['M3 12 C8 6 16 6 21 12 C16 17.4 8 17.4 3 12Z M12 9.4 A2.6 2.6 0 1 0 12.01 9.4 M9 16 L8 21.4 M14 16.4 C15.4 19.6 18.6 20.2 19.4 17.8',
  'M8.4 21 C4 18.6 5.6 13 11 13 C16.4 13 18.6 9 15.4 5 C13.4 2.8 10 3.6 10.4 6.4 M10.4 6.4 C11.6 5.6 13 6 13.4 7.2',
  'M12 7 C16 7 18 10.4 18 14 C18 18 15.4 20.4 12 20.4 C8.6 20.4 6 18 6 14 C6 10.4 8 7 12 7Z M12 7 L12 20.4 M6 11 L3 9 M6 15 L2.6 15.4 M6.6 18.4 L4 21 M18 11 L21 9 M18 15 L21.4 15.4 M17.4 18.4 L20 21 M12 2.6 A2.2 2.2 0 1 0 12.01 2.6',
  'M12 2.6 C16.6 6.6 16.8 14.4 13.4 21.4 L10.6 21.4 C8.4 14.4 8.6 7 12 2.6Z M12 4 L12 21',
  'M12 2.8 C9.4 2.8 8.4 5 8.4 6.8 C8.4 8.8 10 10.2 11.4 10.8 L7.4 10.8 L7.4 13 L11.2 13 L10.8 21.4 L13.2 21.4 L12.8 13 L16.6 13 L16.6 10.8 L12.6 10.8 C14 10.2 15.6 8.8 15.6 6.8 C15.6 5 14.6 2.8 12 2.8Z'];
GP.forEach((d,i)=>{A['glyph'+i]=S(24,24,blur('b',1.5),
  `<path d="${d}" stroke="${VIO}" stroke-width="3.6" fill="none" opacity=".9" filter="url(#b)" stroke-linecap="round" stroke-linejoin="round"/>
   <path d="${d}" stroke="#7a3ae0" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
   <path d="${d}" stroke="#f4e8ff" stroke-width="1.1" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`);});
/* the curse glyph seal: a dark violet disc, gold rim, the eye glyph glowing in it */
A.seal=S(40,40,rg('d',.42,.38,.62,[[0,'#7a3ae0'],[.6,'#3a1470'],[1,'#1c0a36']])+GOLDH('r')+blur('b',1.6),
  `<circle cx="20" cy="20" r="18.4" fill="${VIO}" opacity=".5" filter="url(#b)"/><circle cx="20" cy="20" r="16.6" fill="url(#d)"/>
   <circle cx="20" cy="20" r="16.6" fill="none" stroke="url(#r)" stroke-width="2.2"/><circle cx="20" cy="20" r="13.2" fill="none" stroke="#ffd36a" stroke-width=".6" stroke-dasharray="1.6 2.2" opacity=".8"/>
   <g transform="translate(8 8)"><path d="${GP[0]}" stroke="${VIO}" stroke-width="3" fill="none" filter="url(#b)"/><path d="${GP[0]}" stroke="#f4e8ff" stroke-width="1.2" fill="none" stroke-linecap="round"/></g>`);
/* a gold cartouche with three curse signs (full hex / doom) */
A.cartouche=S(30,58,GOLDH('r')+rg('i',.5,.5,.7,[[0,'#e4ccff',.9],[.6,'#9a4aff',.55],[1,'#3a1470',.3]])+blur('b',1.4),
  `<rect x="3" y="2" width="24" height="48" rx="12" fill="url(#i)"/><rect x="3" y="2" width="24" height="48" rx="12" fill="none" stroke="url(#r)" stroke-width="2.4"/>
   <path d="M2 55 L28 55" stroke="url(#r)" stroke-width="3"/><path d="M15 50 L15 55" stroke="url(#r)" stroke-width="2"/>
   ${[0,1,3].map((g,i)=>`<g transform="translate(9 ${5+i*14.4}) scale(.5)"><path d="${GP[g]}" stroke="#ffffff" stroke-width="3.6" fill="none" stroke-linecap="round" filter="url(#b)"/><path d="${GP[g]}" stroke="#3a1470" stroke-width="2.2" fill="none" stroke-linecap="round"/></g>`).join('')}`);
/* ---------- the Pharaoh's eye (wedjat): lapis brow, kohl line, violet iris ---------- */
A.eye=S(160,72,lg('br',0,0,0,1,[[0,'#3a6ae8'],[1,'#14246a']])+lg('k',0,0,1,0,[[0,'#1c1432'],[1,'#2a1c48']])+rg('ir',.42,.38,.6,[[0,'#ffffff'],[.25,'#e4ccff'],[.6,VIO],[1,'#3a1470']])+lg('sc',0,0,0,1,[[0,'#fffaf0'],[1,'#d8cbe8']])+GOLDH('g')+blur('b',3),
  `<ellipse cx="80" cy="34" rx="70" ry="26" fill="${VIO}" opacity=".35" filter="url(#b)"/>
   <path d="M20 13 C50 1 110 1 142 11 L140 18 C110 9 52 9 22 20Z" fill="url(#br)"/><path d="M22 13 C52 3 108 3 140 11.4" stroke="url(#g)" stroke-width="1.4" fill="none"/>
   <path d="M12 34 C40 13 112 11 148 30 L158 36 L148 36 C120 52 48 56 12 34Z" fill="url(#k)"/>
   <path d="M22 34 C46 20 106 18 136 30 C112 44 52 48 22 34Z" fill="url(#sc)"/>
   <circle cx="80" cy="32.6" r="13.4" fill="url(#ir)"/><circle cx="80" cy="32.6" r="5.6" fill="#1c0a36"/><circle cx="76.6" cy="29.4" r="2.4" fill="#ffffff"/>
   <path d="M22 34 C46 20 106 18 136 30" stroke="url(#g)" stroke-width="1.2" fill="none"/>
   <path d="M68 47 L63 68 L70.4 68 L75 48.6Z" fill="url(#k)"/><path d="M92 47 C96 59 110 65 118 57 C122.4 52.6 118.6 46.6 112.4 50.4" stroke="#1c1432" stroke-width="5" fill="none" stroke-linecap="round"/>
   <path d="M93.6 47.6 C97.4 57.4 109 62 115.4 56" stroke="url(#g)" stroke-width="1" fill="none"/>`);

/* ---------- locusts (side view, two wing frames) ---------- */
const LOC=(up)=>S(26,14,lg('b',0,0,0,1,[[0,'#a89a4a'],[.5,'#6a5a22'],[1,'#3a300e']])+lg('w',0,0,1,0,[[0,'#c8a8ff',.25],[1,'#e8d8a8',.75]]),
  `${up?'<path d="M10 6 C10 0 18 -1 22 2 C18 4 14 5.4 10 6.4Z" fill="url(#w)"/><path d="M9 6.4 C7 1.4 12 0 15 1.4 C13 3.4 11.4 5 9 6.4Z" fill="url(#w)" opacity=".7"/>':'<path d="M9 5.4 C12 2.6 20 2.6 23 5 C19 6 14 6.6 9 6.6Z" fill="url(#w)"/>'}
   <ellipse cx="8" cy="8.4" rx="7" ry="2.6" fill="url(#b)"/><ellipse cx="15.4" cy="7.6" rx="3.8" ry="3" fill="url(#b)"/><circle cx="20" cy="7.4" r="2.6" fill="#7a6a2a"/><circle cx="20.8" cy="6.8" r=".9" fill="#1c140a"/>
   <path d="M21 5.4 C23.4 2.4 24.6 2 25.6 1.4" stroke="#4a3a14" stroke-width=".5" fill="none"/>
   <path d="M13.4 9.4 L8.4 12.6 L4 11.6" stroke="#4a3a14" stroke-width="1.1" fill="none" stroke-linejoin="round"/><path d="M17 10 L18 13 M19 9.6 L21 12.4" stroke="#4a3a14" stroke-width=".6"/>`);
A.locust0=LOC(0);A.locust1=LOC(1);

/* ---------- Apep, the chaos serpent: the head (side, jaws open) and the giant rearing cobra ---------- */
A.apepH=S(48,30,lg('h',0,0,0,1,[[0,'#5a2a8a'],[.5,'#22103a'],[1,'#0e0618']])+lg('j',0,0,0,1,[[0,'#2a1442'],[1,'#120820']])+blur('g',1.6),
  `<path d="M2 11.6 C10 5.4 24 3.4 34 7.4 C40 9.6 44.4 12.6 44.6 14.8 L30 15.2 C22 15.2 12 16 2 18Z" fill="${VIO}" opacity=".5" filter="url(#g)"/>
   <path d="M30 15.2 L44.6 14.8 L40 24 L30 18.4Z" fill="#6a0a2a"/>
   <path d="M2 11.6 C10 5.4 24 3.4 34 7.4 C40 9.6 44.4 12.6 44.6 14.8 L30 15.2 C22 15.2 12 16 2 18Z" fill="url(#h)"/>
   <path d="M2 18.4 C12 18.4 22 19 30 18.4 L40 24 C30 26.6 14 26.4 2 22.4Z" fill="url(#j)"/>
   <path d="M41.4 14.8 L42.4 19.6 L43.4 14.8Z M35.4 15.2 L36.2 18.6 L37.2 15.2Z M37 21.6 L37.6 18.8 L38.8 22.2Z" fill="#ffffff"/>
   <ellipse cx="31" cy="9.6" rx="3.2" ry="2" fill="#e4ccff"/><ellipse cx="31.2" cy="9.6" rx=".7" ry="1.8" fill="#1c0a36"/>
   <path d="M8 9.6 C16 6.4 26 5.6 33 7.6" stroke="${VIO}" stroke-width="1" fill="none" opacity=".8"/><path d="M10 13 L14 12 M18 11.6 L22 10.8" stroke="#7a3ae0" stroke-width=".8" opacity=".6"/>`);
A.apepBig=S(96,118,lg('b',0,0,1,0,[[0,'#120820'],[.45,'#3a1a5a'],[1,'#0e0618']])+rg('hd',.5,.45,.6,[[0,'#4a2272'],[.7,'#1c0a32'],[1,'#0a0414']])+lg('h',0,0,0,1,[[0,'#6a3a9a'],[1,'#1c0a32']])+blur('g',3)+blur('s',1),
  `<path d="M48 12 C30 12 12 30 10 50 C8 68 24 80 40 82 L56 82 C72 80 88 68 86 50 C84 30 66 12 48 12Z" fill="${VIO}" opacity=".45" filter="url(#g)"/>
   <path d="M40 118 C37 98 39 82 43 72 L53 72 C57 82 59 98 56 118Z" fill="url(#b)"/>
   <g stroke="#7a3ae0" stroke-width=".9" opacity=".5" fill="none"><path d="M42 84 C46 86 50 86 54 84 M41 94 C46 96 50 96 55 94 M40.6 104 C46 106 50 106 55.4 104"/></g>
   <path d="M48 14 C31 14 15 31 13 50 C11.4 66 25 77 40 79 L56 79 C71 77 84.6 66 83 50 C81 31 65 14 48 14Z" fill="url(#hd)"/>
   <path d="M48 14 C31 14 15 31 13 50" stroke="${VIO}" stroke-width="1.6" fill="none" opacity=".8" filter="url(#s)"/><path d="M48 14 C65 14 81 31 83 50" stroke="${VIO}" stroke-width="1.6" fill="none" opacity=".8" filter="url(#s)"/>
   <g fill="${VIO}" opacity=".85"><path d="M24 48 C28 42 36 42 38 48 C36 54 28 54 24 48Z M58 48 C60 42 68 42 72 48 C68 54 60 54 58 48Z"/></g>
   <g fill="#f4e8ff"><circle cx="31" cy="48" r="2.2"/><circle cx="65" cy="48" r="2.2"/></g>
   <path d="M44 58 L48 70 L52 58 M40 64 L48 76 L56 64" stroke="#7a3ae0" stroke-width="1.2" fill="none" opacity=".7"/>
   <path d="M48 4 C39 4 33 10.6 33 19 C33 27 39 33.6 48 35.4 C57 33.6 63 27 63 19 C63 10.6 57 4 48 4Z" fill="url(#h)"/>
   <path d="M38.6 15.4 L45 17.6 L39 19.8Z M57.4 15.4 L51 17.6 L57 19.8Z" fill="#e4ccff"/><path d="M41.6 16 L41.8 19 M54.4 16 L54.2 19" stroke="#1c0a36" stroke-width="1"/>
   <path d="M39 25 C42 33.4 54 33.4 57 25 L53 28.6 L48 29.6 L43 28.6Z" fill="#6a0a2a"/><path d="M42.4 26.4 L43.4 31 L44.4 27.2Z M53.6 26.4 L52.6 31 L51.6 27.2Z" fill="#ffffff"/>
   <path d="M46.6 31 L46 37 L48 35 L50 37 L49.4 31Z" fill="#ff5a9a"/>`);

/* ---------- golden scarabs (top view): wings open / closed ---------- */
A.scarabO=S(34,30,GOLDV('g')+lg('w',0,0,1,0,[[0,'#2ad0e8',.25],[.6,'#8af4ff',.7],[1,'#ffffff',.55]])+lg('w2',1,0,0,0,[[0,'#2ad0e8',.25],[.6,'#8af4ff',.7],[1,'#ffffff',.55]]),
  `<path d="M15.4 13 C8 7 1.4 8 2 14.4 C2.6 20 9 21 15 17Z" fill="url(#w2)"/><path d="M18.6 13 C26 7 32.6 8 32 14.4 C31.4 20 25 21 19 17Z" fill="url(#w)"/>
   <g stroke="#3a2206" stroke-width=".9" fill="none"><path d="M13 16 L9 19 L8 23 M13 19 L10.6 24 M14 21.4 L13 26.4 M21 16 L25 19 L26 23 M21 19 L23.4 24 M20 21.4 L21 26.4"/></g>
   <path d="M16.2 12 C12.6 13 11 17 11.8 22 C12.6 25.6 14.6 27 16.6 26.6Z" fill="url(#g)"/><path d="M17.8 12 C21.4 13 23 17 22.2 22 C21.4 25.6 19.4 27 17.4 26.6Z" fill="url(#g)"/>
   <ellipse cx="17" cy="10" rx="5.4" ry="3.4" fill="url(#g)"/><path d="M13.4 5.4 L14.4 7.8 L15.8 5.6 L17 8 L18.2 5.6 L19.6 7.8 L20.6 5.4 L20 8.6 L14 8.6Z" fill="#c8872a"/>
   <path d="M14 9 C15.4 8 18.6 8 20 9" stroke="#ffffff" stroke-width=".8" fill="none" opacity=".8"/>`);
A.scarabC=S(24,28,GOLDV('g')+lg('s',0,0,1,0,[[0,'#a8620e'],[.5,'#ffe89a'],[1,'#a8620e']]),
  `<g stroke="#3a2206" stroke-width=".9" fill="none"><path d="M6 12 L2.6 10 L1.6 6 M5.6 16 L2 18 M6.4 20 L3.6 24 M18 12 L21.4 10 L22.4 6 M18.4 16 L22 18 M17.6 20 L20.4 24"/></g>
   <path d="M12 9.6 C17.6 9.6 19 15 18.6 19.6 C18.2 24 15.4 26.6 12 26.6 C8.6 26.6 5.8 24 5.4 19.6 C5 15 6.4 9.6 12 9.6Z" fill="url(#s)"/><path d="M12 10 L12 26.4" stroke="#7a4a0a" stroke-width=".8"/>
   <ellipse cx="12" cy="7.6" rx="4.8" ry="3" fill="url(#g)"/><path d="M8.6 3.4 L9.6 5.6 L10.8 3.6 L12 5.8 L13.2 3.6 L14.4 5.6 L15.4 3.4 L14.8 6.2 L9.2 6.2Z" fill="#c8872a"/>
   <path d="M8.6 13 C9.6 11.6 11 11 12 11" stroke="#ffffff" stroke-width=".9" fill="none" opacity=".75"/>`);

/* ---------- the Anubis shade: a black jackal (side, facing right), gold collar, turquoise eye ---------- */
const JCK='M13.4 22.4 C20 18.2 38 18 46 19.6 L49.6 13.8 C50.6 10 51.8 6 53.8 3.4 L55.4 10 L57.6 4.2 L58.6 11.8 C61.2 12.8 64.2 14.8 65.4 17 L58.2 19.8 C56.2 21.8 54 25.6 52.4 27.8 L52.6 40.6 L49.2 40.6 L48.6 30.4 C42 31.4 32 31.4 24.4 30.4 L22.2 40.6 L18.8 40.6 L19.2 30 C16 29 14 27.2 13 24.4 C8.4 25.4 4.4 23.4 2 19.2 C6 21.2 10 21.4 13.4 22.4Z';
A.jackal=S(66,44,lg('b',0,0,0,1,[[0,'#3a2458'],[.5,'#140c20'],[1,'#06030c']])+blur('g',2.4)+blur('s',.6),
  `<path d="${JCK}" fill="${VIO}" opacity=".5" filter="url(#g)"/><path d="${JCK}" fill="url(#b)"/>
   <path d="M13.4 22.4 C20 18.2 38 18 46 19.6 L49.6 13.8" stroke="#9a6ae0" stroke-width="1.1" fill="none" opacity=".7" filter="url(#s)"/>
   <path d="M48.4 18.4 C50.4 22.2 52.6 24.6 55 25.6" stroke="#ffd36a" stroke-width="3" fill="none"/><path d="M48.8 20 C50.6 23 52.4 24.8 54.6 25.8" stroke="${TQ}" stroke-width="1.1" fill="none" stroke-dasharray="1.4 1"/>
   <path d="M56.4 13.4 L60 13.8 L57 15.2Z" fill="${TQ}"/><path d="M56.4 13.4 L60 13.8 L57 15.2Z" fill="#c8f6ff" opacity=".6"/>
   <path d="M55.4 10 L54.6 6.6 M58.4 11.4 L57.6 6.2" stroke="#4a2a6a" stroke-width=".8"/>`);

/* ---------- servant mummies: the raised mummy, the warrior of the Duat, the mummy lord (pharaoh) ---------- */
const MUM='M18 2 C22.4 2 25.4 5.6 25.4 10 C25.4 13 24 15.4 22.4 16.8 C25 17.6 26.6 18.8 27.6 20.4 C31 18.6 33.4 15 33.6 10.6 L36.4 11.2 C36.2 16.6 32.6 21.4 28.4 23.4 C28.8 31 28.6 42 27.4 55.6 L21.8 55.6 L20.8 43 L16.6 43 L15.6 55.6 L10 55.6 C8.8 44 8.8 34 9.4 25.4 C7 27.8 6 31 6.4 34.6 L3.4 34.6 C3 29.6 5 24.6 9.6 21.2 C10.6 19 12 17.6 13.8 16.8 C12 15.4 10.6 13 10.6 10 C10.6 5.6 13.6 2 18 2Z';
const wraps=(x0,x1,y0,y1,n,col,o=.55)=>{let s='';for(let i=0;i<n;i++){const y=y0+(y1-y0)*i/(n-1),d=(i%2?1:-1)*1.6;s+=`M${x0} ${f1(y+d)} L${x1} ${f1(y-d)} `;}return `<path d="${s}" stroke="${col}" stroke-width=".8" opacity="${o}" fill="none"/>`;};
A.mummy=S(38,58,LINEN('l')+blur('g',1.4)+`<clipPath id="c"><path d="${MUM}"/></clipPath>`,
  `<path d="${MUM}" fill="url(#l)"/>
   <g clip-path="url(#c)">${wraps(0,38,6,54,14,'#8a7040')}${wraps(0,38,8.2,55,13,'#fffaf0',.4)}<path d="M12 16 C16 19 22 19 26 16" stroke="#6a5430" stroke-width="1.4" fill="none" opacity=".6"/></g>
   <path d="M28.4 23.4 C30 26 30.6 30 30 33 L31.6 33.6 C32.4 30 31.8 25.6 30 22.6Z" fill="#e8d3a0"/>
   <ellipse cx="15" cy="9.8" rx="2.6" ry="1.4" fill="#0e2a30"/><ellipse cx="21.4" cy="9.8" rx="2.6" ry="1.4" fill="#0e2a30"/>
   <ellipse cx="15" cy="9.8" rx="1.6" ry="1" fill="${TQ}" filter="url(#g)"/><ellipse cx="21.4" cy="9.8" rx="1.6" ry="1" fill="${TQ}" filter="url(#g)"/><circle cx="15" cy="9.8" r=".6" fill="#e8ffff"/><circle cx="21.4" cy="9.8" r=".6" fill="#e8ffff"/>`);
A.mummyW=S(48,64,LINEN('l')+lg('br',0,0,1,1,[[0,'#ffe0a0'],[.5,'#c8823a'],[1,'#5a3214']])+GOLDH('g')+rg('sh',.4,.35,.65,[[0,'#ffe8b8'],[.5,'#c8823a'],[1,'#5a3214']])+blur('g',1.4)+`<clipPath id="c"><path d="${MUM}"/></clipPath>`,
  `<g transform="translate(5 6)"><path d="${MUM}" fill="url(#l)"/><g clip-path="url(#c)">${wraps(0,38,8,54,13,'#8a7040')}</g>
   <ellipse cx="15" cy="9.8" rx="2.4" ry="1.3" fill="#0e2a30"/><ellipse cx="21.4" cy="9.8" rx="2.4" ry="1.3" fill="#0e2a30"/><ellipse cx="15" cy="9.8" rx="1.5" ry=".9" fill="${TQ}" filter="url(#g)"/><ellipse cx="21.4" cy="9.8" rx="1.5" ry=".9" fill="${TQ}" filter="url(#g)"/>
   <path d="M9 7.6 C10 1 26 1 27 7.6 L27.6 12 C25 9.4 11 9.4 8.4 12Z" fill="url(#br)"/><path d="M9.4 6.4 L26.6 6.4" stroke="#ffe0a0" stroke-width=".9"/></g>
   <path d="M39 16 C46 10 47.6 3 43.6 0.6 C46 6 42.6 11 37.4 14.6Z" fill="url(#g)"/><path d="M38.4 15.6 L36 22 L37.8 22.6 L40.2 16.4Z" fill="#5a3214"/>
   <ellipse cx="9" cy="38" rx="8.4" ry="10.4" fill="url(#sh)"/><ellipse cx="9" cy="38" rx="3" ry="3.6" fill="${TQ}"/><circle cx="9" cy="38" r="8" fill="none" stroke="#ffe8b8" stroke-width=".8" opacity=".6"/>`);
/* the mummy lord: gold death mask, lapis-striped nemes, crook and flail crossed, gold collar */
const NEM='M32 4 C20 4 14 12 13 22 L8 52 L18 52 L22 30 L42 30 L46 52 L56 52 L51 22 C50 12 44 4 32 4Z';
A.mummyL=S(64,92,LINEN('l')+GOLDV('gv')+GOLDH('gh')+`<pattern id="st" width="64" height="4" patternUnits="userSpaceOnUse"><rect width="64" height="2.2" fill="#ffd23a"/><rect y="2.2" width="64" height="1.8" fill="${LAP}"/></pattern>`+blur('g',1.6),
  `<path d="M16 38 C14 54 15 72 17 90 L28 90 L30 70 L34 70 L36 90 L47 90 C49 72 50 54 48 38Z" fill="url(#l)"/>${wraps(16,48,46,88,11,'#8a7040')}
   <path d="${NEM}" fill="url(#st)"/><path d="${NEM}" fill="none" stroke="#a8620e" stroke-width=".8"/>
   <path d="M22.6 12 C22.6 22 25 30 32 32.4 C39 30 41.4 22 41.4 12Z" fill="url(#gv)"/><path d="M28 31.6 L29 40 L35 40 L36 31.6Z" fill="url(#gh)"/><path d="M28.6 34 L35.4 34 M28.8 37 L35.2 37" stroke="${LAP}" stroke-width=".9"/>
   <path d="M25 17.6 C26.6 16.2 29 16.2 30 17.6 C29 18.8 26.6 18.8 25 17.6Z M34 17.6 C35 16.2 37.4 16.2 39 17.6 C37.4 18.8 35 18.8 34 17.6Z" fill="#14246a"/>
   <ellipse cx="27.6" cy="17.6" rx="1.2" ry=".8" fill="${TQ}" filter="url(#g)"/><ellipse cx="36.4" cy="17.6" rx="1.2" ry=".8" fill="${TQ}" filter="url(#g)"/>
   <path d="M24.4 15 L30 15.6 M34 15.6 L39.6 15" stroke="#14246a" stroke-width="1"/><path d="M32 19 L31 24.6 L33 24.6Z" fill="#c8872a"/><path d="M29.6 27 C31 27.8 33 27.8 34.4 27" stroke="#a8620e" stroke-width=".8" fill="none"/>
   <path d="M14 40 C20 49 44 49 50 40 C46 36 18 36 14 40Z" fill="url(#gh)"/><path d="M16.4 41 C22 47 42 47 47.6 41" stroke="${TQ}" stroke-width="1.6" fill="none"/><path d="M18.4 43.6 C24 48 40 48 45.6 43.6" stroke="${LAP}" stroke-width="1.2" fill="none"/>
   <path d="M20 70 L42 50" stroke="url(#st)" stroke-width="3"/><path d="M42 50 C44.4 47.4 47.6 47.8 47.8 50.6 C48 52.6 46.4 53.4 45.4 52.6" stroke="#ffd23a" stroke-width="2.4" fill="none" stroke-linecap="round"/>
   <path d="M44 70 L22 50" stroke="url(#st)" stroke-width="3"/><path d="M22 50 L17 46.6 M22 50 L16 49.4 M22 50 L17.4 52.6" stroke="${LAP}" stroke-width="2.2" stroke-linecap="round"/>
   <path d="M32 4 C20 4 14 12 13 22" stroke="#fff3c0" stroke-width="1.2" fill="none" opacity=".6"/>`);

/* ---------- the scales of Ma'at (gold), a heart and the feather in the pans ---------- */
const FEA='M7 2 C12 4 13.4 10 12.4 18 C11.4 26 9.4 33 8.2 38.6 L6.2 38.6 C5 30 4.2 20 4.2 12 C4.2 6.4 5.2 3.4 7 2Z';
A.feather=S(16,40,lg('f',0,0,1,0,[[0,'#d8e8ff'],[.5,'#ffffff'],[1,'#b8c8e8']]),
  `<path d="${FEA}" fill="url(#f)"/><path d="M7.4 3 C8 14 7.6 26 7.2 38.6" stroke="#8aa0c8" stroke-width=".6" fill="none"/><path d="M7 2 C10 2.6 11.4 4.4 11 6.6" stroke="#2a4ab8" stroke-width="1.4" fill="none"/><rect x="5.6" y="34.6" width="3.4" height="4" fill="#ffd23a"/>`);
A.scales=S(72,66,GOLDV('gv')+GOLDH('gh'),
  `<path d="M30 62 L42 62 L40 58 L32 58Z" fill="url(#gh)"/><rect x="34.4" y="13" width="3.2" height="46" fill="url(#gh)"/>
   <path d="M7 14 L65 14" stroke="url(#gh)" stroke-width="3" stroke-linecap="round"/><circle cx="36" cy="14" r="3.6" fill="url(#gv)"/>
   <path d="M8 14 L4 38 M8 14 L16 38 M64 14 L56 38 M64 14 L68 38" stroke="#c8872a" stroke-width=".8"/>
   <path d="M1 38 C3 44 17 44 19 38Z" fill="url(#gv)"/><path d="M53 38 C55 44 69 44 71 38Z" fill="url(#gv)"/>
   <path d="M10 37.4 C6 34 7 29 10 30.6 C13 29 14 34 10 37.4Z" fill="#d81e3a"/><path d="M8.6 31.6 C8 32.4 8 33.4 8.4 34" stroke="#ff9aa8" stroke-width=".8" fill="none"/>
   <g transform="translate(58 18) scale(.5)"><path d="${FEA}" fill="#ffffff"/><path d="M7 2 C10 2.6 11.4 4.4 11 6.6" stroke="#2a4ab8" stroke-width="2.4" fill="none"/></g>
   <g transform="translate(31 1) scale(.64)"><path d="${FEA}" fill="#ffffff"/><path d="M7 2 C10 2.6 11.4 4.4 11 6.6" stroke="#2a4ab8" stroke-width="2.2" fill="none"/></g>`);

/* ---------- Ammit the devourer: a crocodile head rising out of the ground, jaws wide open, a golden lion's mane ---------- */
A.ammit=S(112,108,lg('j',0,0,1,0,[[0,'#1e4a26'],[.55,'#5aa052'],[1,'#2a5a2e']])+lg('j2',1,0,0,0,[[0,'#1e4a26'],[.55,'#5aa052'],[1,'#2a5a2e']])+lg('b',0,0,1,0,[[0,'#c8d8a0'],[1,'#8aa868']])+rg('m',.5,.85,.75,[[0,'#ffe08a'],[.45,'#e8962a'],[1,'#7a3a0c']])+rg('mo',.5,.6,.6,[[0,'#ff6a5a'],[.6,'#8a0a1a'],[1,'#3a0408']])+blur('g',2.6),
  `<ellipse cx="56" cy="64" rx="50" ry="40" fill="#3aa860" opacity=".3" filter="url(#g)"/>
   <path d="M44 20 C50 40 54 58 56 72 L60 72 C64 56 74 40 84 27Z" fill="url(#mo)"/>
   <path d="M38 80 C34 60 30 40 28 22 C27.4 13 30.4 6.6 35.6 6.6 C40.6 6.6 43.6 11 44.4 18 C46.6 34 51 52 56 74Z" fill="url(#j)"/>
   <path d="M66 80 C64 66 70 50 78 36 C82 28 86 22 90 19 C94 16.4 98.6 18.6 98 23.4 C97.4 28 94 32.4 91 36 C82 48 74 62 70 82Z" fill="url(#j2)"/>
   <path d="M44.4 18 C46.6 34 51 52 56 74 M70 82 C74 62 82 48 91 36" stroke="url(#b)" stroke-width="3" fill="none"/>
   <g fill="#fffaf0">${[0,1,2,3,4,5].map(i=>{const u=i/6,x=45+u*10,y=21+u*50,x2=89-u*19,y2=37+u*42;return `<path d="M${f1(x)} ${f1(y)} L${f1(x+5)} ${f1(y+1.6)} L${f1(x+.6)} ${f1(y+4)}Z"/><path d="M${f1(x2)} ${f1(y2)} L${f1(x2-5)} ${f1(y2-.6)} L${f1(x2-1)} ${f1(y2+3.6)}Z"/>`;}).join('')}</g>
   <g fill="#2a5a2e"><circle cx="32" cy="10" r="1.6"/><circle cx="38" cy="9.4" r="1.6"/></g>
   <g fill="#7ac070" opacity=".8">${[0,1,2,3,4].map(i=>`<path d="M${f1(29.4-i*.4)} ${30+i*10} l-3 2 l3 2Z"/>`).join('')}</g>
   <path d="M6 106 C0 92 6 78 18 70 L16 60 L26 66 L28 54 L36 63 L42 54 L48 64 L56 56 L64 64 L70 54 L76 63 L84 54 L86 66 L96 60 L94 70 C106 78 112 92 106 106Z" fill="url(#m)"/>
   <g stroke="#8a4a14" stroke-width="1.4" fill="none" opacity=".55"><path d="M18 100 C16 90 20 82 28 76 M38 102 C36 92 40 84 46 78 M74 102 C76 92 72 84 66 78 M94 100 C96 90 92 82 84 76"/></g>
   <path d="M40 74 C44 70 50 70 54 74 C50 77 44 77 40 74Z M58 74 C62 70 68 70 72 74 C68 77 62 77 58 74Z" fill="#ffd23a"/><ellipse cx="47" cy="74" rx="1.2" ry="2.6" fill="#1c0a06"/><ellipse cx="65" cy="74" rx="1.2" ry="2.6" fill="#1c0a06"/>
   <path d="M38 70 C42 66 50 66 55 70 M57 70 C62 66 70 66 74 70" stroke="#1e4a26" stroke-width="2.4" fill="none"/>`);
/* ---------- the Duat gate: a sandstone pylon, winged sun on the lintel, a turquoise doorway ---------- */
A.gate=S(112,114,lg('t',0,0,1,0,[[0,'#fff0c8'],[.5,'#e2c486'],[1,'#a8874a']])+lg('t2',0,0,1,0,[[0,'#c8a464'],[.5,'#e2c486'],[1,'#fff0c8']])+rg('d',.5,.62,.62,[[0,'#ffffff'],[.3,'#8af4ff'],[.7,'#1a9ab0'],[1,'#06303a']])+GOLDH('g')+blur('b',2),
  `<path d="M38 112 L38 34 L74 34 L74 112Z" fill="url(#d)"/>
   <g stroke="#c8f6ff" stroke-width="1.2" fill="none" opacity=".55"><path d="M56 104 C44 98 44 80 56 74 C66 70 68 60 60 54 M56 90 C50 86 52 78 58 78"/></g>
   <path d="M4 112 L12 22 L40 22 L42 112Z" fill="url(#t)"/><path d="M70 112 L72 22 L100 22 L108 112Z" fill="url(#t2)"/>
   <path d="M10 22 L42 22 L42 17 L9 17Z M70 22 L102 22 L103 17 L70 17Z" fill="#c8a464"/>
   <g stroke="#127a8c" stroke-width=".9" opacity=".6">${[0,1,2,3,4,5,6].map(i=>`<path d="M${17+i*.4} ${34+i*11} L${33-i*.1} ${34+i*11} M${79-i*.1} ${34+i*11} L${95+i*.4} ${34+i*11}"/>`).join('')}</g>
   <path d="M30 18 L82 18 L84 34 L28 34Z" fill="url(#t)"/><path d="M28 32 L84 32 L84 35 L28 35Z" fill="#a8874a"/>
   <circle cx="56" cy="25.4" r="5.2" fill="url(#g)"/><path d="M50.6 25 C44 22 38 22 32.6 24 C38 27.4 44 28.4 50.6 27Z M61.4 25 C68 22 74 22 79.4 24 C74 27.4 68 28.4 61.4 27Z" fill="${LAP}"/><path d="M50.6 25.6 C45 24.4 40 24.6 35 25.4 M61.4 25.6 C67 24.4 72 24.6 77 25.4" stroke="#ffd23a" stroke-width=".9" fill="none"/>`);

/* ---------- ba souls: a turquoise wisp with a small face, and the wailing ghost of the harvest ---------- */
A.soul=S(22,30,rg('s',.5,.62,.6,[[0,'#ffffff'],[.32,'#c8f6ff'],[.7,'#2ad0e8'],[1,'#0a6a7c']])+blur('g',1.6),
  `<path d="M11 1.4 C14.6 7.4 19.4 12.4 19.4 19 C19.4 25 15.4 28.6 11 28.6 C6.6 28.6 2.6 25 2.6 19 C2.6 13.4 6.6 9.6 9 5.6 C9.4 8 10.4 9.4 11.4 9.8 C11 7 10.6 4.4 11 1.4Z" fill="#2ad0e8" opacity=".6" filter="url(#g)"/>
   <path d="M11 1.4 C14.6 7.4 19.4 12.4 19.4 19 C19.4 25 15.4 28.6 11 28.6 C6.6 28.6 2.6 25 2.6 19 C2.6 13.4 6.6 9.6 9 5.6 C9.4 8 10.4 9.4 11.4 9.8 C11 7 10.6 4.4 11 1.4Z" fill="url(#s)"/>
   <ellipse cx="8.6" cy="19.4" rx="1.3" ry="1.8" fill="#0a4a58"/><ellipse cx="13.4" cy="19.4" rx="1.3" ry="1.8" fill="#0a4a58"/><ellipse cx="11" cy="23.6" rx=".9" ry="1.1" fill="#0a4a58"/>`);
A.ghost=S(34,48,rg('s',.5,.32,.7,[[0,'#ffffff'],[.3,'#c8f6ff'],[.72,'#2ad0e8'],[1,'#0a6a7c',.2]])+blur('g',2),
  `<path d="M17 2 C25 2 30 8 30 16 C30 24 26 30 24 36 C22 42 16 46 6 46 C12 42 14 38 13 34 C8 30 4 24 4 16 C4 8 9 2 17 2Z" fill="#2ad0e8" opacity=".55" filter="url(#g)"/>
   <path d="M17 2 C25 2 30 8 30 16 C30 24 26 30 24 36 C22 42 16 46 6 46 C12 42 14 38 13 34 C8 30 4 24 4 16 C4 8 9 2 17 2Z" fill="url(#s)"/>
   <path d="M10.4 13 C10.4 10.6 14 10.6 14 13 C14 15.6 12.2 17 12.2 17 C12.2 17 10.4 15.6 10.4 13Z M20 13 C20 10.6 23.6 10.6 23.6 13 C23.6 15.6 21.8 17 21.8 17 C21.8 17 20 15.6 20 13Z" fill="#06303a"/>
   <ellipse cx="17" cy="23" rx="2.6" ry="3.6" fill="#06303a"/>`);
/* a canopic jar with a jackal lid (Duamutef) */
A.jar=S(24,36,lg('a',0,0,1,0,[[0,'#d8cbb0'],[.4,'#fffaf0'],[1,'#a8987a']])+lg('h',0,0,1,0,[[0,'#1c1428'],[.5,'#3a2a48'],[1,'#120c1c']]),
  `<path d="M5 15 C2.6 25 4.6 33 12 34.4 C19.4 33 21.4 25 19 15Z" fill="url(#a)"/><path d="M5.4 19 L18.6 19 M5 21.4 L19 21.4" stroke="${TQ}" stroke-width="1"/>
   <path d="M6.6 26 L17.4 26 M7.6 29 L16.4 29" stroke="#127a8c" stroke-width=".6" opacity=".5"/>
   <path d="M5 15 L19 15 L18 11 C17 9 15.6 8 15 8 L15.6 2 L13.2 6.2 L10.8 6.2 L8.4 2 L9 8 C7.4 8.6 5.6 10.6 5 15Z" fill="url(#h)"/><path d="M14.4 11 L17.6 11.6" stroke="#ffd23a" stroke-width=".8"/><circle cx="14.6" cy="10.6" r=".6" fill="${TQ}"/>`);

/* ---------- Sekhmet's red plague sun: flame corona, a lioness face, the uraeus ---------- */
A.sunR=(()=>{let fl='';for(let i=0;i<18;i++){const a=i/18*Math.PI*2,a2=a+Math.PI/18,r1=44,r0=32;fl+=`${i?'L':'M'}${f1(46+Math.cos(a)*r0)} ${f1(46+Math.sin(a)*r0)} Q${f1(46+Math.cos(a+.08)*r1*1.04)} ${f1(46+Math.sin(a+.08)*r1*1.04)} ${f1(46+Math.cos(a2)*r1)} ${f1(46+Math.sin(a2)*r1)} `;}
  return S(92,92,rg('c',.5,.5,.5,[[0,'#ffe08a'],[.6,'#ff6a2a'],[1,'#ff2a0a',0]])+rg('d',.42,.38,.62,[[0,'#fff3d8'],[.35,'#ffb04a'],[.75,'#e02a0c'],[1,'#7a0c04']])+blur('g',2.4)+GOLDV('gv'),
  `<path d="${fl}Z" fill="url(#c)" filter="url(#g)"/><circle cx="46" cy="46" r="31" fill="url(#d)"/>
   <g fill="#8a1404" opacity=".42"><path d="M30 26 L34 14 L40 24Z M62 26 L58 14 L52 24Z"/><path d="M33 34 C36 30 42 30 44 35 C40 37 36 37 33 34Z M59 34 C56 30 50 30 48 35 C52 37 56 37 59 34Z"/>
   <path d="M38 48 C38 56 42 60 46 62 C50 60 54 56 54 48 C51 52 41 52 38 48Z"/></g>
   <g fill="#ffe08a" opacity=".85"><path d="M35.4 33.6 C37 32.4 39 32.4 40.4 33.6 C39 34.6 37 34.6 35.4 33.6Z M51.6 33.6 C53 32.4 55 32.4 56.6 33.6 C55 34.6 53 34.6 51.6 33.6Z"/></g>
   <path d="M43 76 C39 72 40 66 46 66 C52 66 53 72 49 76 L48 84 L44 84Z" fill="url(#gv)"/><circle cx="46" cy="70" r="1.2" fill="#d81e1e"/>
   <circle cx="46" cy="46" r="31" fill="none" stroke="#fff3c0" stroke-width="1.4" opacity=".55"/>`);})();
/* ---------- the golden Bastet spirit (cat goddess head, front), the gold sun disc with the uraeus ---------- */
A.bastet=S(120,132,GOLDV('gv')+rg('h',.5,.42,.62,[[0,'#fff8d8'],[.5,'#ffd23a'],[1,'#a8620e']])+lg('ie',0,0,0,1,[[0,'#2ad0e8'],[1,'#127a8c']])+GOLDH('gh')+blur('g',3),
  `<ellipse cx="60" cy="62" rx="52" ry="50" fill="#ffd23a" opacity=".3" filter="url(#g)"/>
   <path d="M28 54 L20 4 L54 34Z" fill="url(#gv)"/><path d="M92 54 L100 4 L66 34Z" fill="url(#gv)"/><path d="M30 46 L25 14 L46 34Z" fill="url(#ie)"/><path d="M90 46 L95 14 L74 34Z" fill="url(#ie)"/>
   <path d="M24 56 C24 32 40 22 60 22 C80 22 96 32 96 56 C96 76 84 94 60 100 C36 94 24 76 24 56Z" fill="url(#h)"/>
   <path d="M34 58 C38 52 46 52 50 58 C46 62 38 62 34 58Z M70 58 C74 52 82 52 86 58 C82 62 74 62 70 58Z" fill="#14246a"/>
   <path d="M36.6 58 C39.6 54.6 44.4 54.6 47.4 58 C44.4 60.6 39.6 60.6 36.6 58Z M72.6 58 C75.6 54.6 80.4 54.6 83.4 58 C80.4 60.6 75.6 60.6 72.6 58Z" fill="${TQ}"/><ellipse cx="42" cy="57.8" rx="1.3" ry="2.4" fill="#06303a"/><ellipse cx="78" cy="57.8" rx="1.3" ry="2.4" fill="#06303a"/>
   <path d="M34 58 L26 55 M86 58 L94 55" stroke="#14246a" stroke-width="2" stroke-linecap="round"/>
   <path d="M55 74 L65 74 L60 80Z" fill="#7a3a0a"/><path d="M60 80 C58 84 54 85 51 83 M60 80 C62 84 66 85 69 83" stroke="#7a3a0a" stroke-width="1.4" fill="none"/>
   <path d="M60 30 C57 33 57 38 60 40 C63 38 63 33 60 30Z" fill="${TQ}"/><circle cx="60" cy="35.4" r="2" fill="#ffd23a"/>
   <circle cx="97" cy="36" r="5.4" fill="none" stroke="url(#gh)" stroke-width="2.2"/>
   <path d="M16 110 C32 96 88 96 104 110 C98 128 22 128 16 110Z" fill="url(#gh)"/><path d="M20 111 C36 100 84 100 100 111" stroke="${TQ}" stroke-width="3" fill="none"/><path d="M22 117 C38 106 82 106 98 117" stroke="${LAP}" stroke-width="2.6" fill="none"/>
   <path d="M30 32 C38 24 50 22 60 22" stroke="#ffffff" stroke-width="2" fill="none" opacity=".6"/>`);
A.sunG=S(64,64,rg('d',.42,.38,.62,[[0,'#ffffff'],[.3,'#fff3c0'],[.7,'#ffc23a'],[1,'#a8620e']])+GOLDV('gv')+blur('g',2.6),
  `<circle cx="32" cy="30" r="27" fill="#ffd23a" opacity=".4" filter="url(#g)"/><circle cx="32" cy="30" r="22" fill="url(#d)"/><circle cx="32" cy="30" r="22" fill="none" stroke="#fff3c0" stroke-width="1.2"/>
   <path d="M28 60 C24 56 25 50 32 50 C39 50 40 56 36 60 L35 63 L29 63Z" fill="url(#gv)"/><path d="M31 54 L33 54" stroke="#d81e1e" stroke-width="1.4"/>`);
/* ---------- the crook and flail of Osiris, crossed under the atef crown ---------- */
A.osiris=S(64,78,`<pattern id="st" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="2.2" height="4" fill="#ffd23a"/><rect x="2.2" width="1.8" height="4" fill="${LAP}"/></pattern>`+lg('cr',0,0,1,0,[[0,'#d8cbb0'],[.5,'#ffffff'],[1,'#c8bca0']])+GOLDV('gv'),
  `<path d="M14 76 L48 30" stroke="url(#st)" stroke-width="5" stroke-linecap="round"/><path d="M48 30 C52 25 58 26 58 31 C58 35 55 36.4 53.4 35" stroke="#ffd23a" stroke-width="4" fill="none" stroke-linecap="round"/>
   <path d="M50 76 L16 30" stroke="url(#st)" stroke-width="5" stroke-linecap="round"/>
   <path d="M16 30 L8 22 M16 30 L6 28 M16 30 L9 36" stroke="${LAP}" stroke-width="3.2" stroke-linecap="round" stroke-dasharray="3 1.4"/>
   <path d="M32 2 C27 6 26 14 27 22 L37 22 C38 14 37 6 32 2Z" fill="url(#cr)"/><circle cx="32" cy="3" r="2" fill="url(#gv)"/>
   <path d="M27 22 C22 16 21 8 23 4 C24 10 26 16 28 20Z M37 22 C42 16 43 8 41 4 C40 10 38 16 36 20Z" fill="#ffffff"/><path d="M25.6 22 L38.4 22 L38 25 L26 25Z" fill="url(#gv)"/>`);
/* ---------- the black grimoire (Black Grimoire passive) and the open ankh tome ---------- */
A.grimoire=S(32,28,lg('b',0,0,1,1,[[0,'#3a2458'],[.6,'#140c20'],[1,'#06030c']])+blur('g',1.2),
  `<path d="M4 4 L26 2 L28 24 L6 26Z" fill="url(#b)"/><path d="M26 2 L28 24 L30 23 L28.4 1.6Z" fill="#e8d3a0"/>
   <path d="M4 4 L8 4 L8.4 8 M26 2 L22 2.4 M6 26 L10 25.6 M28 24 L27.6 20" stroke="#ffd36a" stroke-width="1.2" fill="none"/>
   <g transform="translate(5 3) scale(.8)"><path d="${GP[0]}" stroke="${VIO}" stroke-width="3" fill="none" filter="url(#g)"/><path d="${GP[0]}" stroke="#f4e8ff" stroke-width="1" fill="none" stroke-linecap="round"/></g>`);
A.tome=S(36,24,lg('p',0,0,1,0,[[0,'#e8d3a0'],[.5,'#fffaf0'],[1,'#e8d3a0']])+GOLDH('g')+blur('g',1),
  `<path d="M2 6 C8 3 14 3 18 6 L18 22 C14 19 8 19 2 22Z" fill="url(#p)"/><path d="M34 6 C28 3 22 3 18 6 L18 22 C22 19 28 19 34 22Z" fill="url(#p)"/>
   <path d="M2 22 C8 19 14 19 18 22 C22 19 28 19 34 22 L34 23.4 C28 20.6 22 20.6 18 23.6 C14 20.6 8 20.6 2 23.4Z" fill="#6a3a1a"/>
   <g fill="${TQ}" stroke="${TQ}" filter="url(#g)">${glyphRows(6,9,2,3,5,4.4,3)}${glyphRows(23,9,2,3,5,4.4,5)}</g><g fill="${TQD}" stroke="${TQD}">${glyphRows(6,9,2,3,5,4.4,3)}${glyphRows(23,9,2,3,5,4.4,5)}</g>
   <path d="M18 6 L18 22" stroke="url(#g)" stroke-width="1"/>`);

/* ---------- hieroglyph floor rings (flat, seen from above): gold (temple), violet (curse), turquoise (Duat) ---------- */
const RING=(c,lt,band)=>{const N=20;let gs='';for(let i=0;i<N;i++){const a=i/N*360,g=GP[i%GP.length];gs+=`<g transform="rotate(${f1(a)} 110 110) translate(104 4) scale(.5)"><path d="${g}" stroke="${lt}" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`;}
  return S(220,220,rg('f',.5,.5,.5,[[0,c,0],[.72,c,.0],[.86,band,.32],[.95,c,.22],[1,c,0]])+blur('b',1.6),
  `<circle cx="110" cy="110" r="108" fill="url(#f)"/><circle cx="110" cy="110" r="106" fill="none" stroke="${c}" stroke-width="5" opacity=".55" filter="url(#b)"/>
   <circle cx="110" cy="110" r="106" fill="none" stroke="${lt}" stroke-width="2.2"/><circle cx="110" cy="110" r="86" fill="none" stroke="${lt}" stroke-width="1.4" opacity=".85"/>
   <circle cx="110" cy="110" r="82" fill="none" stroke="${c}" stroke-width=".8" stroke-dasharray="3 5" opacity=".8"/>${gs}`);};
A.ringG=RING('#ffc23a','#fff3c0','#ffd86a');A.ringV=RING('#9a4aff','#f0e0ff','#b06aff');A.ringT=RING('#2ad0e8','#d8fbff','#6ae0ff');A.ringR=RING('#ff5a2a','#ffe0b0','#ff7a3a');

/* ---------- loader: each SVG becomes a canvas at 2x ---------- */
const CV={};
for(const k in A){const im=new Image();im.onload=()=>{const c=document.createElement('canvas');c.width=A[k].w*2;c.height=A[k].h*2;c.getContext('2d').drawImage(im,0,0,c.width,c.height);CV[k]=c;};
  im.onerror=()=>console.warn('bastet art failed',k);im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(A[k].svg);}
window.KTA={get:k=>CV[k]||null,size:k=>A[k]?[A[k].w,A[k].h]:[0,0],names:Object.keys(A),ready:()=>Object.keys(A).every(k=>CV[k]),svg:k=>A[k]&&A[k].svg};
})();
