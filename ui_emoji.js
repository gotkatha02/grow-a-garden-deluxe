/* ui_emoji.js — painted pictures instead of emoji (owner 2026-11-22 'อะไรที่ใช้อิโมจิ เจนเป็นภาพแทนได้ไหม').
   Every emoji in the UI text (windows, buttons, chat, tooltips cards, the buff bar …) and in canvas text (NPC signs, floating texts)
   is shown as a picture when one is known for it:
     1) assets/ui/emo/<key>.webp when <key> is listed in window.EMO_HAVE (assets/ui/emo/list.js — rebuilt by `python3 tools/emo_icons.py list`,
        new sheets are cut by `python3 tools/emo_icons.py cut <sheet#> <png>`; prompts: UI_ICON_PROMPTS_TH.md),
     2) else the painted art that is already in the game (FALLBACK column below; md = a gold-framed medallion → cropped round when small),
     3) else the emoji stays.
   How (no game file has to change):
     · Element.innerHTML setter + insertAdjacentHTML: HTML strings are rewritten before they are parsed — only text OUTSIDE tags (never inside
       attributes such as title / placeholder), never inside <select> <textarea> <script> <style> <svg>. The innerHTML GETTER gives back the
       original string while the element still holds exactly what was set, so `if(el.innerHTML!==h)el.innerHTML=h` does not rewrite every frame.
     · a MutationObserver wraps emoji in text nodes made by textContent / createTextNode / the HTML parser.
     · CanvasRenderingContext2D fillText / strokeText draw the picture in place of the emoji (textAlign / textBaseline respected).
   Markup: <emo-i class="e-<key>"><emo-g>🧭</emo-g></emo-i> — custom tags so no game CSS (span / i / b rules) touches them; the glyph stays inside,
   hidden, so textContent, copy / paste and every string comparison keep working. ?emo=0 = off (window.EMO.on(false) at runtime). */
(function(){
'use strict';
if(/[?&]emo=0\b/.test(location.search))return;
/* glyph → [key, fallback picture under assets/ (optional), 'md' = medallion with a gold frame] */
const T={
  /* menus · services (painted medallions already in assets/ui) */
  '🗺':['map','ui/menu_map.webp','md'],          '⚙':['gear','ui/menu_settings.webp','md'],     '📊':['status','ui/menu_status.webp','md'],
  '📘':['skills','ui/menu_skill.webp','md'],     '💬':['chat','ui/menu_chat.webp','md'],        '⏳':['hourglass','ui/menu_slow.webp','md'],
  '🛒':['shop','ui/svc_shop.webp','md'],         '🏛':['market','ui/svc_market.webp','md'],     '🏪':['stall','ui/svc_market.webp','md'],
  '💾':['save','ui/svc_save.webp','md'],         '🌀':['warp','ui/svc_teleport.webp','md'],     '🗡':['dagger','ui/svc_weapon.webp','md'],
  '⚔':['swords','ui/svc_guild.webp','md'],       '🛡':['shield','ui/stat_def.webp','md'],       '🔨':['hammer','ui/tab_refine.webp','md'],
  '⚒':['anvil','ui/tab_craft.webp','md'],        '🔱':['seal','ui/tab_trait.webp','md'],        '🔮':['fuse','ui/tab_merge.webp','md'],
  '✨':['sparkle','ui/set_vfx.webp','md'],        '🎲':['dice','ui/stat_lck.webp','md'],         '💚':['heal','ui/stat_vit.webp','md'],
  '🏹':['bow','ui/st_alt_bow.webp','md'],        '🔒':['lock','ui/hole_lock.webp','md'],
  /* frameless objects already in the game */
  '🎒':['bag','ui/inv_bag.webp'],                '💰':['zeny','ui/inv_gold.webp'],              '📦':['chest','ui/inv_storage.webp'],
  '📍':['pin','ui/npc_pin_red.webp'],            '📜':['scroll','items/capscroll.png'],         '📖':['book','items/manual.png'],
  '🧪':['potion','items/hp1.png'],               '🧰':['tools','items/pliers.png'],             '🔧':['wrench','items/pliers.png'],
  '🪽':['wing','items/wing.png'],                '🎩':['helm','items/eq_vik_top.png'],          '🏺':['sealcrystal','items/trait_egy.png'],
  '🐺':['fenrir','items/relic_fenrir.png'],      '💎':['gem','items/orb_atk.png'],
  '⚗':['alembic','items/elixir.png'],           '🌿':['herb','items/m_vik_0_a.png'],
  /* gem glyphs = the gems' own pictures */
  '❄':['ice','gems/mut/ice.webp'],               '♨':['fire','gems/mut/fire.webp'],            '🔥':['burn','gems/support/burn.webp'],
  '⚡':['volt','gems/mut/volt.webp'],             '🔗':['link','gems/support/chain.webp'],      '⏱':['quick','gems/support/quick.webp'],
  '🔶':['mutgem','gems/mut/heavy.webp'],         '🔹':['supgem','gems/support/echo.webp'],
  /* new art only (UI_ICON_PROMPTS_TH.md) — the emoji stays until the picture is cut in */
  '🎯':['target'],'🧘':['sit'],'🧭':['compass'],'🎁':['gift'],'⭐':['star'],'💡':['hint'],'❓':['help'],'👆':['tap'],'📚':['books'],'⏭':['skip'],
  '🔔':['bell'],'🔕':['belloff'],'⚖':['balance'],'⛏':['pick'],'💠':['cgem'],'♻':['dismantle'],'📑':['pages'],'🔁':['rule'],'🧬':['build'],
  '☠':['poison'],'🩸':['bleed'],'💀':['skull'],'⚠':['warn'],'💔':['broken'],'👑':['crown'],'🏆':['trophy'],'🎉':['party'],'🗂':['folder'],
  '📈':['chart'],'📬':['mailbox'],'📰':['news'],'📋':['blueprint'],'👗':['fashion'],'🌱':['sprout'],'🐾':['paw'],'🐢':['turtle'],
  '🗿':['relic'],   /* relic AND the map bosses' 'turned to stone' status → a stone idol head, not the Fenrir fang */
  /* map boss statuses + moves (map_boss_kit.js, map_bosses_*.js) */
  '✋':['grab'],'🗝':['key'],'🔇':['mute'],'🎵':['note'],'🌑':['dark'],'🕸':['web'],'🦂':['scorpion'],
  /* map boss moves (map_bosses_vik.js) + the Sphinx riddle (map_bosses_egy.js: SYM ☀ 🌙 👁 · TIME 🌅 ☀ 🌙 · LEGS 🐾 🚶 🦯) — sheet 6 */
  '🍂':['leaf'],'🧊':['icecube'],'⛓':['chains'],'☀':['sun'],'🌙':['moon'],'👁':['horus'],'🌅':['sunrise'],'🚶':['feet'],'🦯':['cane']
};
/* the same glyph with ANOTHER meaning inside some windows: glyph → [[CSS scope, key, fallback, md], …].
   Checked before T for text inside an element matching the scope (el.closest); canvas text always uses T.
   A scoped key without a picture leaves the emoji there (never the other meaning's picture).
   (A 4th field in T = that scope only, no default — same as one ALT row.) */
const ALT={
  '👁':[['#buffs','blind']]   /* buff bar = the map bosses' 'blinded by sand' status (map_boss_kit.js mbBlind); everywhere else = the Eye of Horus of the riddle */
};
const HAVE=new Set(window.EMO_HAVE||[]);
const EMO_V=window.EMO_V||1;
let ON=true;
const ST={cb:0,rec:0,ms:0,set:0,tx:0};   /* cost counters: window.EMO.st */
/* glyph → {k, src, md} for every glyph that has a picture now (P = everywhere, PA = scoped alternates) */
const pic=(k,f,md)=>HAVE.has(k)?{k,src:'assets/ui/emo/'+k+'.webp?v='+EMO_V,md:false}:f?{k,src:'assets/'+f,md:md==='md'}:null;
const P={},PA={};
for(const g in T){const [k,f,md,sc]=T[g];
  if(sc){(ALT[g]=ALT[g]||[]).push([sc,k,f,md]);continue;}
  const p=pic(k,f,md);if(p)P[g]=p;}
for(const g in ALT)PA[g]=ALT[g].map(([sc,k,f,md])=>({sc,p:pic(k,f,md)}));
const GL=[...new Set([...Object.keys(P),...Object.keys(PA).filter(g=>PA[g].some(a=>a.p))])].sort((a,b)=>b.length-a.length);
if(!GL.length)return;
const esc=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const SRC='(?:'+GL.map(esc).join('|')+')\\uFE0F?';
const RE1=new RegExp(SRC,'u'), REG=new RegExp(SRC,'gu');
const base=g=>g.replace(/️$/,'');
/* CSS: one rule per key */
{const st=document.createElement('style');st.id='emoCss';
  let c=`emo-i{display:inline-block;width:1.22em;height:1.22em;vertical-align:-.27em;background:center/contain no-repeat;position:relative;line-height:1;margin:0 .03em;font-style:normal}
emo-i.md{background-size:136%;border-radius:50%}
emo-g{position:absolute;left:0;top:0;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none;white-space:nowrap;clip-path:inset(50%)}
#buffs .buff b emo-i{width:24px;height:24px;vertical-align:middle;margin:0}
#mobTgt emo-i,#mobSit emo-i{width:31px;height:31px;vertical-align:middle;margin:0}
.emoOff emo-i{background:none!important;width:auto;height:auto;vertical-align:baseline;margin:0}.emoOff emo-g{position:static;width:auto;height:auto;opacity:1;clip-path:none;overflow:visible}`;
  const done=new Set(),rule=p=>{if(p&&!done.has(p.k)){done.add(p.k);c+=`\nemo-i.e-${p.k}{background-image:url("${p.src}")}`;}};
  for(const g in P)rule(P[g]);for(const g in PA)for(const a of PA[g])rule(a.p);
  st.textContent=c;(document.head||document.documentElement).appendChild(st);}
/* picture for a glyph in the DOM: a scoped alternate when el is inside its scope (even without a picture → emoji stays), else the default */
const picFor=(g,el)=>{const b=base(g),A=PA[b];
  if(A&&el&&el.closest)for(const a of A){let inn=false;try{inn=!!el.closest(a.sc);}catch(e){}if(inn)return a.p;}
  return P[b]||null;};
const tagOf=(p,g)=>p?`<emo-i class="e-${p.k}${p.md?' md':''}"><emo-g>${g}</emo-g></emo-i>`:g;
const wrapText=(s,el)=>RE1.test(s)?s.replace(REG,g=>tagOf(picFor(g,el),g)):s;
/* ---------- HTML strings ---------- */
const TAGRE=/<!--[\s\S]*?-->|<(?:[^>"']|"[^"]*"|'[^']*')*>/g;
const SKIPT=new Set(['select','textarea','script','style','svg','math','emo-g','title','option']);
function tx(html,el){
  if(!RE1.test(html))return html;
  let out='',last=0,skip=0,m;TAGRE.lastIndex=0;
  while((m=TAGRE.exec(html))){
    const txt=html.slice(last,m.index);out+=skip?txt:wrapText(txt,el);out+=m[0];last=m.index+m[0].length;
    const t=/^<(\/?)\s*([a-zA-Z][\w-]*)/.exec(m[0]);
    if(t&&SKIPT.has(t[2].toLowerCase())){if(t[1])skip=Math.max(0,skip-1);else if(!/\/\s*>$/.test(m[0]))skip++;}}
  const rest=html.slice(last);out+=skip?rest:wrapText(rest,el);return out;}
const SVGNS='http://www.w3.org/2000/svg';
const SKIPEL=new Set(['SELECT','OPTION','TEXTAREA','SCRIPT','STYLE','TITLE','EMO-G','NOSCRIPT','CANVAS','IFRAME']);
const badEl=el=>!el||SKIPEL.has(el.nodeName)||(el.namespaceURI&&el.namespaceURI!=='http://www.w3.org/1999/xhtml')||!!(el.closest&&el.closest('select,textarea,svg,emo-g,[contenteditable],.emoNo'));
const D=Object.getOwnPropertyDescriptor(Element.prototype,'innerHTML');
if(D&&D.set&&D.get){
  Object.defineProperty(Element.prototype,'innerHTML',{configurable:true,enumerable:D.enumerable,
    get(){const c=D.get.call(this);const r=this.__emR;if(r!==undefined){if(c===this.__emS)return r;this.__emR=undefined;}return c;},
    set(v){const s=v==null?'':String(v);
      if(!ON||!RE1.test(s)||SKIPEL.has(this.nodeName)||(this.namespaceURI&&this.namespaceURI===SVGNS)){if(this.__emR!==undefined)this.__emR=undefined;D.set.call(this,s);return;}
      const t0=performance.now(),t=tx(s,this);D.set.call(this,t);if(t!==s){this.__emR=s;this.__emS=D.get.call(this);}else if(this.__emR!==undefined)this.__emR=undefined;ST.set++;ST.tx+=performance.now()-t0;}});}
const IAH=Element.prototype.insertAdjacentHTML;
Element.prototype.insertAdjacentHTML=function(pos,h){const s=String(h);return IAH.call(this,pos,ON&&RE1.test(s)&&!SKIPEL.has(this.nodeName)?tx(s,/^(beforebegin|afterend)$/i.test(pos)?this.parentElement:this):s);};
/* ---------- text nodes (textContent, createTextNode, the parser) ---------- */
function fixText(n){
  const p=n.parentNode;if(!p||p.nodeType!==1||!ON)return;
  const s=n.data;if(!s||!RE1.test(s)||badEl(p))return;
  const f=document.createDocumentFragment();let last=0,m;REG.lastIndex=0;
  while((m=REG.exec(s))){const pp=picFor(m[0],p);if(!pp)continue;
    if(m.index>last)f.appendChild(document.createTextNode(s.slice(last,m.index)));
    const e=document.createElement('emo-i');e.className='e-'+pp.k+(pp.md?' md':'');const gg=document.createElement('emo-g');gg.textContent=m[0];e.appendChild(gg);f.appendChild(e);
    last=m.index+m[0].length;}
  if(!last)return;
  if(last<s.length)f.appendChild(document.createTextNode(s.slice(last)));
  p.replaceChild(f,n);}
const TW_SKIP=new Set(['SCRIPT','STYLE','SELECT','TEXTAREA','EMO-G','NOSCRIPT','CANVAS','svg','SVG','TEMPLATE','IFRAME']);
function walk(root){
  if(!root||TW_SKIP.has(root.nodeName))return;
  const w=document.createTreeWalker(root,NodeFilter.SHOW_ELEMENT|NodeFilter.SHOW_TEXT,{acceptNode(n){
    if(n.nodeType===1)return TW_SKIP.has(n.nodeName)||(n.namespaceURI&&n.namespaceURI===SVGNS)||n.isContentEditable?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_SKIP;
    return RE1.test(n.data)?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP;}});
  const L=[];let n;while((n=w.nextNode()))L.push(n);
  for(const t of L)fixText(t);}
const MO=new MutationObserver(recs=>{if(!ON)return;const t0=performance.now();ST.cb++;ST.rec+=recs.length;
  for(const r of recs){
    if(r.type==='characterData'){if(r.target.nodeType===3)fixText(r.target);continue;}
    for(const n of r.addedNodes){
      if(n.nodeType===3)fixText(n);
      else if(n.nodeType===1&&!TW_SKIP.has(n.nodeName)){const tc=n.textContent;if(tc&&RE1.test(tc))walk(n);}}}
  ST.ms+=performance.now()-t0;});
MO.observe(document.documentElement,{childList:true,subtree:true,characterData:true});
const first=()=>{if(document.body)walk(document.body);};
if(document.body)first();document.addEventListener('DOMContentLoaded',first);
/* ---------- canvas text ---------- */
const IMG={};
const imgOf=g=>{const p=P[base(g)];if(!p)return null;let o=IMG[p.k];if(!o){o=IMG[p.k]=new Image();o.decoding='async';o.src=p.src;}return o.complete&&o.naturalWidth?o:null;};
const C2=CanvasRenderingContext2D.prototype,CF=C2.fillText,CS=C2.strokeText,MT=C2.measureText;
function segs(s){const out=[];let last=0,m;REG.lastIndex=0;
  while((m=REG.exec(s))){if(!P[base(m[0])])continue;const im=imgOf(m[0]);if(!im)return null;if(m.index>last)out.push(s.slice(last,m.index));out.push({im,g:m[0]});last=m.index+m[0].length;}
  if(last<s.length)out.push(s.slice(last));return out.some(q=>typeof q!=='string')?out:null;}
function mixed(ctx,s,x,y,fill){
  const sg=segs(s);if(!sg)return false;
  const fm=/(\d+(?:\.\d+)?)px/.exec(ctx.font),fs=fm?+fm[1]:16,IS=fs*(sg.length===1?1.55:1.2),gap=fs*.06;   // a lone icon (NPC sign) reads bigger, like the emoji did
  let W=0;const ws=sg.map(p=>{const w=typeof p==='string'?MT.call(ctx,p).width:IS+gap*2;W+=w;return w;});
  const al=ctx.textAlign;let cx=al==='center'?x-W/2:(al==='right'||al==='end')?x-W:x;
  const bl=ctx.textBaseline,top=bl==='middle'?y-IS/2:(bl==='top'||bl==='hanging')?y:(bl==='bottom'||bl==='ideographic')?y-IS:y-IS*.8;
  ctx.textAlign='left';
  try{for(let i=0;i<sg.length;i++){const p=sg[i];
      if(typeof p==='string')(fill?CF:CS).call(ctx,p,cx,y);
      else if(fill)ctx.drawImage(p.im,cx+gap,top,IS,IS);
      cx+=ws[i];}}
  finally{ctx.textAlign=al;}
  return true;}
C2.fillText=function(s,x,y,mw){if(ON&&typeof s==='string'&&s.length<400&&RE1.test(s)&&mixed(this,s,x,y,true))return;return CF.apply(this,arguments);};
C2.strokeText=function(s,x,y,mw){if(ON&&typeof s==='string'&&s.length<400&&RE1.test(s)&&mixed(this,s,x,y,false))return;return CS.apply(this,arguments);};
/* warm the canvas pictures up (NPC signs, floating texts) */
setTimeout(()=>{for(const g of ['⚒','⚔','🗡','🛡','🌀','🗿'])imgOf(g);},1500);
window.EMO={T,ALT,P,PA,st:ST,on(v){ON=v!==false;document.documentElement.classList.toggle('emoOff',!ON);},tx,walk,have:HAVE};
})();
