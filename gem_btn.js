/* Gems show on the skill BUTTONS — step 4 (owner 2026-11-22 'ทำต่อเลย' after steps 1–3 = the looks when a skill is used).
   Every PC hotbar button and phone skill-wheel button whose skill carries gems gets a live overlay, read from totem_gems.js
   (totemGems.act() / fxs(), read only — no gameplay):
     element (fire / ice / volt mutation) — the button itself burns / frosts / crackles: element frame + inner glow + flames on the
                                    top edge / ice crystals in the corners / sparks jumping round the frame
     stack  สะสมแต้ม   hex crystals along the bottom = the charges really stored (STK[k].ch of mx); the next one fills while it recharges
     third  ทุกครั้งที่สาม gold pips ①②③ = casts so far; before the 3rd the button glows gold with '×1.5' (the next cast is the strong one)
     totem  เสาร่ายแทน  while the pillar casts this skill for you the button dims (it cannot be cast), a totem badge shows the casts
                         left and a gold ring fills toward the pillar's next cast; with balance the button wakes up for the last cast
     rage   บ้าคลั่ง    red pulse for the 3 s you take more damage
     guard  ตั้งการ์ด    shield badge + silver frame while the gem shield holds
     support gems — their own gem pictures in a column on the left edge (½-strength ones from a skill hole are smaller)
   Buttons carry data-k (index.html buildHotbar, mobile.js build). Updated 20× a second; the overlay HTML is only rewritten when its
   state changes, moving parts are CSS animations / CSS variables. ?gemfx=0 = off. */
(function(){
'use strict';
if(/[?&]gemfx=0/.test(location.search))return;
const G=n=>{try{return (0,eval)(n);}catch(e){return undefined;}};
const ELS=['fire','ice','volt'];
const SUPC={echo:'#9b7bff',third:'#ffb13b',force:'#ff6a4a',splash:'#ff9a3a',chain:'#5ad1ff',quick:'#7fe08a',thrift:'#4aa8ff',burn:'#ff5a2a',frost:'#8fe6ff',pierce:'#d8d8e8',leech:'#e2435a',impact:'#c9a46a'};
const svg=s=>`url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(s)}")`;
const FLAME=svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 30"><path d="M10 29.4C3.4 28.6 1.2 22.8 3.2 17.2C5 12.4 5.2 8.2 8.2 3.2C8.4 8 10 10 11 7.2C12 4.4 12 2.2 13.2.6C16.4 6.4 19 11.4 18.2 18.2C17.4 24.8 15.2 29 10 29.4Z" fill="#ff5a14" stroke="#5a1404" stroke-width="1.1" stroke-linejoin="round"/><path d="M10 28.4C6.4 27.8 5.4 24.8 6.2 21.4C7 18.4 8.2 16.4 10 13.4C10.2 16.4 11.8 17.4 12.2 15.4C14 18.2 15 21.4 14.2 24.2C13.4 27 12.2 28.4 10 28.4Z" fill="#ffd84a"/><path d="M10 27.6C8.6 27.2 8.2 25.6 8.8 24C9.2 22.8 9.8 22 10.4 21C10.8 22.4 11.8 23 11.8 24.6C11.8 26.4 11.2 27.4 10 27.6Z" fill="#fffbe0"/></svg>`);
const ICE=svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g stroke="#0a3a6a" stroke-width="1.2" stroke-linejoin="round"><path d="M12 1L15 9L12 13L9 9Z" fill="#e8fbff"/><path d="M12 13L15 9L12 1Z" fill="#7fc8f0"/><path d="M4 9L9 11L8.6 15.4L3.6 13.6Z" fill="#c8f0ff"/><path d="M20 10L15.4 11.6L15.8 15.6L20.6 14Z" fill="#9fd8f6"/></g><circle cx="12.4" cy="5" r="1" fill="#fff"/></svg>`);
const ZAP=svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 12"><path d="M1 7L7 2L11 8L16 3L20 9L27 4" fill="none" stroke="#2a1068" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M1 7L7 2L11 8L16 3L20 9L27 4" fill="none" stroke="#b79cff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M1 7L7 2L11 8L16 3L20 9L27 4" fill="none" stroke="#fff" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"/></svg>`);
const POLE=`<svg viewBox="0 0 16 24" width="100%" height="100%"><g stroke="#3a1f14" stroke-width="1.1" stroke-linejoin="round"><path d="M1 6L5 4L5 9L1 9Z" fill="#c9473a"/><path d="M15 6L11 4L11 9L15 9Z" fill="#c9473a"/><rect x="4.5" y="2" width="7" height="20.5" rx="1.2" fill="#b8784a"/><rect x="4.5" y="2" width="7" height="7" rx="1.2" fill="#c9473a"/><rect x="4.5" y="9.5" width="7" height="6" fill="#2f8f80"/><path d="M2.5 23H13.5" stroke-width="1.6"/></g><circle cx="6.6" cy="5.4" r="1" fill="#ffd23a"/><circle cx="9.4" cy="5.4" r="1" fill="#ffd23a"/><circle cx="6.6" cy="12.2" r="1" fill="#ffd23a"/><circle cx="9.4" cy="12.2" r="1" fill="#ffd23a"/></svg>`;
const SHIELD=`<svg viewBox="0 0 20 22" width="100%" height="100%"><path d="M10 1L18 4V10C18 15 14.6 18.8 10 21C5.4 18.8 2 15 2 10V4Z" fill="#b8cdf2" stroke="#24345a" stroke-width="1.5" stroke-linejoin="round"/><path d="M10 3.2L16 5.4V10C16 13.8 13.6 16.8 10 18.6Z" fill="#e8f0ff"/><path d="M10 3.2V18.6" stroke="#7f9fe0" stroke-width="1"/></svg>`;

const css=document.createElement('style');css.id='gemBtnCss';css.textContent=`
.gbb,.gbo,.gbf{position:absolute;inset:0;pointer-events:none;z-index:2;border-radius:inherit;font-size:10px}
.gbb{z-index:-1}   /* behind the button: flames / frost peek out round its edges, the key badge and the icon stay clean */
.gbf{z-index:5}    /* above the hotbar's key badges and cooldown canvases (at z-index 2 a ring was half covered by the neighbours) */
.mobSk .gbb,.mobSk .gbo,.mobSk .gbf{font-size:calc(var(--sz,60px)*.19);z-index:1}.mobSk .gbb{z-index:-1}.mobSk .gbf{z-index:3}.mobSk .t{z-index:2}
.gbb>*,.gbo>*,.gbf>*{position:absolute;pointer-events:none}
.gbf .ge{inset:-3px;border-radius:inherit}
.gbx-fire .gbf .ge{animation:gbFire .38s ease-in-out infinite alternate}
.gbx-ice .gbf .ge{animation:gbIce 1.7s ease-in-out infinite alternate}
.gbx-volt .gbf .ge{animation:gbVolt .9s steps(1,end) infinite}
@keyframes gbFire{from{box-shadow:0 0 0 2px #ff5a14,0 0 6px 1px #ff7a1a,inset 0 0 7px 1px rgba(255,110,20,.45)}to{box-shadow:0 0 0 2.6px #ffb02a,0 0 13px 3px #ff4a10,inset 0 0 12px 3px rgba(255,170,50,.62)}}
@keyframes gbIce{from{box-shadow:0 0 0 2px #4ab4ff,0 0 6px 1px #8fe6ff,inset 0 0 8px 2px rgba(140,220,255,.45)}to{box-shadow:0 0 0 2.4px #c8f2ff,0 0 12px 3px #5ac4ff,inset 0 0 13px 3px rgba(200,240,255,.6)}}
@keyframes gbVolt{0%{box-shadow:0 0 0 2px #7b5cff,0 0 8px 2px #9a7bff,inset 0 0 9px 2px rgba(150,120,255,.5)}22%{box-shadow:0 0 0 2.8px #e6dcff,0 0 15px 4px #8f74ff,inset 0 0 14px 3px rgba(210,200,255,.7)}30%{box-shadow:0 0 0 2px #7b5cff,0 0 8px 2px #9a7bff,inset 0 0 9px 2px rgba(150,120,255,.5)}64%{box-shadow:0 0 0 2.6px #c8b8ff,0 0 13px 3px #7b5cff,inset 0 0 12px 3px rgba(190,170,255,.62)}72%{box-shadow:0 0 0 2px #7b5cff,0 0 8px 2px #9a7bff,inset 0 0 9px 2px rgba(150,120,255,.5)}}
.gbf .gf{width:1.25em;height:1.85em;bottom:-.25em;background:${FLAME} center bottom/contain no-repeat;transform-origin:50% 100%;animation:gbFl .32s ease-in-out infinite alternate;filter:drop-shadow(0 0 2px #ff7a1a)}
.gbf .gf.f2{animation-delay:-.11s;animation-duration:.27s;height:2.2em}.gbf .gf.f3{animation-delay:-.2s;animation-duration:.36s}
.gbf .gh{left:0;right:0;bottom:0;height:55%;border-radius:inherit;background:linear-gradient(0deg,rgba(255,110,20,.55),rgba(255,160,40,0));mix-blend-mode:screen;animation:gbHt .38s ease-in-out infinite alternate}
@keyframes gbHt{from{opacity:.55}to{opacity:1}}
@keyframes gbFl{from{transform:scale(.82,.72) skewX(-6deg)}to{transform:scale(1,1.08) skewX(5deg)}}
.gbf .gi{width:1.3em;height:1.3em;background:${ICE} center/contain no-repeat;filter:drop-shadow(0 0 2px #bfeaff);animation:gbIc 1.7s ease-in-out infinite alternate}
@keyframes gbIc{from{opacity:.82;transform:scale(.92)}to{opacity:1;transform:scale(1.06)}}
.gbf .gs{inset:-3px;border-radius:inherit;overflow:hidden}
.gbf .gs::before{content:'';position:absolute;inset:-40%;background:linear-gradient(115deg,transparent 42%,rgba(255,255,255,.75) 50%,transparent 58%);animation:gbSh 2.6s linear infinite}
@keyframes gbSh{from{transform:translateX(-60%)}to{transform:translateX(60%)}}
.gbf .gz{width:2em;height:.86em;background:${ZAP} center/contain no-repeat;opacity:0;filter:drop-shadow(0 0 2px #9a7bff);animation:gbZp .9s steps(1,end) infinite}
.gbf .gz.z2{animation-delay:-.45s}
@keyframes gbZp{0%{opacity:1}12%{opacity:0}22%{opacity:1}28%{opacity:0}100%{opacity:0}}
.gbf .gpr{left:50%;bottom:-.42em;transform:translateX(-50%);display:flex;gap:.16em;align-items:center}
.gbf .gpr i{display:block;width:.66em;height:.66em;border-radius:50%;background:#3a2a1c;box-shadow:0 0 0 .1em #1a0e06}
.gbf .gpr i.on{background:radial-gradient(circle at 35% 30%,#fff6d8 0 18%,#ffc23a 50%,#c46a0a);box-shadow:0 0 0 .1em #4a2604,0 0 .35em #ffb13b}
.gbf .gpr i.nx{animation:gbBk .42s ease-in-out infinite alternate}
@keyframes gbBk{from{background:#5a3a1c;box-shadow:0 0 0 .1em #4a2604}to{background:radial-gradient(circle at 35% 30%,#fff6d8 0 18%,#ffc23a 50%,#c46a0a);box-shadow:0 0 0 .1em #4a2604,0 0 .5em #ffb13b}}
.gbf .gpr u{display:block;width:.25em}
.gbf .gpr b{display:block;width:.72em;height:.82em;clip-path:polygon(50% 0,100% 25%,100% 75%,50% 100%,0 75%,0 25%);background:#102438;position:relative}
.gbf .gpr b.on{background:linear-gradient(160deg,#f4fcff 0 22%,#8fd0ff 48%,#2a7ac4)}
.gbf .gpr b.fl{background:linear-gradient(0deg,#5ab4ff 0 var(--gp,0%),#102438 var(--gp,0%) 100%)}
.gbf .gpr .hx{display:block;padding:.08em;background:#06223a;clip-path:polygon(50% 0,100% 25%,100% 75%,50% 100%,0 75%,0 25%)}
.gbt3 .gbf .ga{inset:-3px;border-radius:inherit;animation:gbGo .45s ease-in-out infinite alternate}
@keyframes gbGo{from{box-shadow:0 0 0 2px #e8901a,0 0 6px 2px #ffb13b}to{box-shadow:0 0 0 2.8px #ffe08a,0 0 14px 4px #ffb13b}}
.cb .gbf .gl{display:none}
.gbf .gl{left:50%;bottom:.55em;transform:translateX(-50%);font:900 1.15em/1 Mali,Sarabun,sans-serif;color:#ffe9a8;text-shadow:0 0 .2em #4a2604,0 1px 0 #4a2604,1px 0 0 #4a2604,-1px 0 0 #4a2604,0 -1px 0 #4a2604;white-space:nowrap;animation:gbLb .45s ease-in-out infinite alternate}
@keyframes gbLb{from{transform:translateX(-50%) scale(.92)}to{transform:translateX(-50%) scale(1.1)}}
.gbo .gd{inset:0;border-radius:inherit;background:rgba(24,14,6,.52)}
.gbf .gbp{right:-.1em;bottom:.15em;width:1.6em;height:2em;display:flex;flex-direction:column;align-items:center}
.gbf .gbp svg{filter:drop-shadow(0 0 .2em #ffc84a)}
.gbf .gbp em{position:absolute;right:-.2em;top:-.55em;font:900 .95em/1 Mali,Sarabun,sans-serif;font-style:normal;color:#fff3c8;text-shadow:0 0 .15em #3a1f14,0 1px 0 #3a1f14,1px 0 0 #3a1f14,-1px 0 0 #3a1f14,0 -1px 0 #3a1f14}
.gbo .gpc{inset:-3px;border-radius:inherit;background:conic-gradient(#ffd23a var(--gpt,0%),transparent 0);-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask:linear-gradient(#000 0 0) content-box exclude,linear-gradient(#000 0 0);padding:3px;opacity:.95}
.gbr .gbf .gr{inset:-3px;border-radius:inherit;animation:gbRg .3s ease-in-out infinite alternate}
@keyframes gbRg{from{box-shadow:0 0 0 2px #a8102a,0 0 6px 2px #e2435a,inset 0 0 8px 2px rgba(226,67,90,.45)}to{box-shadow:0 0 0 2.8px #ff6a86,0 0 14px 4px #e2435a,inset 0 0 12px 3px rgba(255,90,120,.6)}}
.gbf .gbg{right:-.15em;bottom:.3em;width:1.75em;height:1.95em;filter:drop-shadow(0 0 .25em #a8c6ff)}.gbf .gbp~.gbg{bottom:2.2em}
.gbf .gbg em{position:absolute;right:1.55em;left:auto;top:auto;bottom:.15em;transform:none;font:900 .95em/1 Mali,Sarabun,sans-serif;font-style:normal;color:#eef4ff;white-space:nowrap;text-shadow:0 0 .15em #24345a,0 1px 0 #24345a,1px 0 0 #24345a,-1px 0 0 #24345a,0 -1px 0 #24345a}
.gbg-on .gbf .gq{inset:-3px;border-radius:inherit;box-shadow:0 0 0 1.4px #24345a,0 0 0 3.2px #e8f0ff,0 0 10px 3px #7f9fe0;animation:gbGq 1.2s ease-in-out infinite alternate}
@keyframes gbGq{from{opacity:.75}to{opacity:1}}
.gbf .gbu{left:-.2em;top:.95em;display:flex;flex-direction:column;gap:.12em}
.gbf .gbu span{display:block;width:1.05em;height:1.05em;border-radius:50%;background:var(--c) center/cover no-repeat;box-shadow:0 0 0 .12em #1a120c,0 0 .3em var(--c)}
.gbf .gbu span.h{width:.82em;height:.82em;margin-left:.12em}
`;
document.head.appendChild(css);

const PL=()=>{try{return player;}catch(e){return null;}};
const sw=(a,id)=>((a.sup||[]).includes(id)?1:0)+(a.supH?a.supH.filter(x=>x===id).length*.5:0);
let els=[],scanT=-1,live=1;
function scan(){els=Array.from(document.querySelectorAll('.hbt[data-k],.mobSk[data-k]'));}
const RT={};   /* stack recharge: the longest time seen since a charge was spent = the full recharge, for the filling crystal */
function layer(el,cls){let o=el.querySelector(':scope>.'+cls);if(!o){o=document.createElement('span');o.className=cls;el.appendChild(o);}return o;}
function render(el,s){let h='<span class="ga"></span><span class="gr"></span><span class="gq"></span>',lo='';
  let bk='';
  if(s.el){h+='<span class="ge"></span>';
    if(s.el==='fire')h+='<span class="gh"></span><span class="gf" style="left:4%"></span><span class="gf f2" style="left:35%"></span><span class="gf f3" style="left:66%"></span>';
    else if(s.el==='ice')h+='<span class="gs"></span><span class="gi" style="left:-.5em;bottom:-.45em;transform:rotate(-110deg)"></span><span class="gi" style="right:-.5em;bottom:-.4em;transform:rotate(120deg)"></span>';
    else h+='<span class="gz" style="left:-.5em;bottom:.6em;transform:rotate(-80deg)"></span><span class="gz z2" style="right:-.55em;top:1.3em;transform:rotate(95deg)"></span>';}
  if(s.pole){lo='<span class="gd"></span><span class="gpc"></span>';h+=`<span class="gbp">${POLE}<em>${s.pole.n}</em></span>`;}
  if(s.guard)h+=`<span class="gbg">${SHIELD}<em>${s.guard}</em></span>`;
  if(s.sups.length)h+='<span class="gbu">'+s.sups.map(([id,w])=>`<span class="${w<1?'h':''}" style="--c:${SUPC[id]||'#ccc'};background-image:url(assets/gems/support/${id}.webp)"></span>`).join('')+'</span>';
  if(s.third!=null||s.stk){h+='<span class="gpr">';
    if(s.third!=null)for(let i=0;i<3;i++)h+=`<i class="${i<s.third?'on':i===2&&s.third===2?'nx':''}"></i>`;
    if(s.third!=null&&s.stk)h+='<u></u>';
    if(s.stk)for(let i=0;i<s.stk.mx;i++)h+=`<span class="hx"><b class="${i<s.stk.ch?'on':i===s.stk.ch?'fl':''}"></b></span>`;
    h+='</span>';}
  if(s.third===2)h+='<span class="gl">×1.5</span>';
  if(bk||el.querySelector(':scope>.gbb'))layer(el,'gbb').innerHTML=bk;layer(el,'gbo').innerHTML=lo;layer(el,'gbf').innerHTML=h;}
function clear(el){for(const c of ['gbb','gbo','gbf']){const o=el.querySelector(':scope>.'+c);if(o)o.remove();}el.classList.remove('gbx-fire','gbx-ice','gbx-volt','gbt3','gbr','gbg-on');el._gbs='';}
function tick(){const T=G('totemGems');if(!T||!T.act)return;const A=T.act(),S=T.fxs?T.fxs():null,t=G('gameTime')||0;
  if(!els.length||t-scanT>.5||els.some(e=>!e.isConnected)){scan();scanT=t;}
  for(const el of els){const k=el.dataset.k,a=k&&A[k];
    if(!a||a.fol){if(el._gbs)clear(el);continue;}
    const elem=ELS.find(x=>a.mut.includes(x))||'',st=S&&S.STK[k],pole=S&&S.PIL.find(p=>p.key===k),GU=S&&S.GU;
    const third=sw(a,'third')?a.casts%3:null,rage=a.mut.includes('rage')&&GU&&GU.rageT>t,
      guard=a.mut.includes('guard')&&GU&&GU.sh>0&&GU.shT>t?Math.max(1,Math.round(GU.sh)):0,
      sups=(a.sup||[]).map(x=>[x,1]).concat((a.supH||[]).map(x=>[x,.5])).slice(0,4),
      hold=pole&&!(pole.bal&&pole.n<=1);
    const s={el:elem,third,stk:st?{ch:st.ch,mx:st.mx||2}:null,pole:hold?{n:pole.n}:null,guard,sups};
    const sig=[elem,third,st?st.ch+'/'+(st.mx||2):'',hold?pole.n:'',guard,sups.map(x=>x[0]+x[1]).join('')].join('|');
    if(sig!==el._gbs){el._gbs=sig;render(el,s);}
    el.classList.toggle('gbx-fire',elem==='fire');el.classList.toggle('gbx-ice',elem==='ice');el.classList.toggle('gbx-volt',elem==='volt');
    el.classList.toggle('gbt3',third===2);el.classList.toggle('gbr',!!rage);el.classList.toggle('gbg-on',!!guard);
    if(st&&st.ch<(st.mx||2)){const r=RT[k]=Math.max(RT[k]||0,st.rT||0);el.style.setProperty('--gp',Math.round(100*(1-Math.max(0,st.rT||0)/(r||1)))+'%');}else if(st){RT[k]=0;}
    if(hold){el.style.setProperty('--gpt',Math.round(100*Math.min(1,Math.max(0,1-(pole.nt-t)/2)))+'%');}}}
let last=0;
function loop(ts){requestAnimationFrame(loop);if(!live||ts-last<50)return;last=ts;try{tick();}catch(e){}}
requestAnimationFrame(loop);
window.GEMBTN={tick,scan,off(){live=0;els.forEach(clear);},on(){live=1;}};
})();
