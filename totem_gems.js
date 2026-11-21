/* =====================================================================
   TOTEM GEMS — constellation board (owner 2026-11-19 · design: TOTEM_GEM_SYSTEM_TH.md)
   Wolf board art: assets/gems/board/ (frame · sky · sock_main / sock_mut / sock_sup), painted by the owner.
   • 5 main sockets on the stars of the hero's spirit constellation, open at Lv 60/70/80/90/99 (the path of stars
     lights up as they open). Gem tier 1/2/3/4 needs Lv 60/70/80/90.
   • Each main gem has 1 mutation socket (opens with the gem) + 2 support sockets (open at gem level 3 / 5).
   • A thin rune ring between sky and frame turns slowly, and spins up + glows when a gem is set.
   • This file = screen + save data. Combat hooks come next (step 2 in the design doc).
   Save: localStorage 'af_gems_<hero>' = {v:2, own:{key:{lv}}, sock:[key|null ×5], mods:{key:[mut,sup,sup]}, mutOwn:{id:n}, supOwn:{id:n}}
   ===================================================================== */
(function(){
const HERO=window.CHAR||'wolf',AF=()=>window.AFItems||null,SKEY='af_gems_'+HERO+(AF()&&AF().MODE==='play'?'_play':''),NS=5,SOCK_LV=[60,70,80,90,99],TIER_LV=[0,60,70,80,90];
const GEM_DIR='assets/gems/'+HERO+'/',BD='assets/gems/board/';
const GD=window.GEMDATA;
const MUT=GD?GD.MUT:[ // mutation gems (gem_data.js; this copy is only a fallback): [id, name, symbol, colour, gain, cost]
 ['focus','รวมศูนย์','◎','#ffd23a','ศัตรูตัวแรกที่โดน ×1.6','ตัวอื่นที่โดน ×0.4'],
 ['spread','แผ่กว้าง','✺','#ff9a3a','ทุกตัวที่โดน แตกดาเมจ ×0.35 รัศมี 80','พลังหลัก ×0.75'],
 ['heavy','ทุ่มหนัก','⬇','#c9573a','พลัง ×1.5','คูลดาวน์ +4 วิ · SP +10'],
 ['rapid','รัวเร็ว','≫','#7fe08a','คูลดาวน์ ×0.6','พลัง ×0.65'],
 ['stack','สะสมแต้ม','⧉','#9fd8ff','เก็บได้ 2 ครั้ง','พลังครั้งละ ×0.8 · เติมคืนช้ากว่าเดิม'],
 ['fire','ธาตุไฟ','♨','#ff5a2a','ติดไหม้ต่อเนื่อง 4 วิ (สีไฟ)','ดาเมจทันที ×0.7'],
 ['ice','ธาตุน้ำแข็ง','❄','#8fe6ff','ทุกฮิตช้า −40 · ทุกครั้งที่ 4 แช่แข็ง 0.6 วิ','พลัง ×0.8'],
 ['volt','ธาตุสายฟ้า','ϟ','#5ad1ff','ฮิตสุดท้ายชิ่ง 2 ตัว ×0.4','พลัง ×0.8'],
 ['guard','ตั้งการ์ด','⛨','#c9ccd8','โล่ Lv×4 · รับดาเมจ −Lv×0.5 ต่อครั้ง 3 วิ','พลัง ×0.8'],
 ['rage','บ้าคลั่ง','✶','#e2435a','พลัง ×1.3','3 วิหลังใช้ รับดาเมจ +Lv×0.6 ต่อครั้ง'],
 ['siphon','ดูดพลัง','◆','#4aa8ff','ทุกฮิตคืน SP 2 (สูงสุด 12 ต่อการใช้)','พลัง ×0.85'],
 ['totem','เสาร่ายแทน','♆','#d9a441','ปักเสาร่ายสกิลทุก 2 วิ × 4 ครั้ง พลัง ×0.45','ระหว่างเสาอยู่ใช้สกิลนั้นเองไม่ได้']];
const SUP=GD?GD.SUP:[ // support gems: [id, name, symbol, colour, effect]
 ['echo','เงาสกิล','⟲','#9b7bff','0.5 วิหลังใช้ ออกซ้ำ ×0.35 (ท่าบัฟ: +3 วิ)'],['third','ทุกครั้งที่สาม','③','#ffb13b','ทุกครั้งที่ 3 แรง ×1.5 (ท่าบัฟ: รีเซ็ตคูลดาวน์)'],
 ['force','เพิ่มแรง','✚','#ff6a4a','ทุกฮิต +ATK×0.15 หรือ TAL×0.15 (ท่าบัฟ: +2 วิ)'],['splash','กระจาย','✺','#ff9a3a','ตัวที่โดนแตก ×0.3 รัศมี 70 (ท่าบัฟ: โล่ Lv×3)'],
 ['chain','ชิ่ง','ϟ','#5ad1ff','ฮิตสุดท้ายชิ่ง 2 ตัว ×0.3 (ท่าบัฟ: +2 วิ)'],['quick','เร่ง','⏱','#7fe08a','คูลดาวน์ −1.5 วิ'],
 ['thrift','ประหยัด','◆','#4aa8ff','SP −6'],['burn','เผาไหม้','♨','#ff5a2a','ทุกฮิตติดไฟ Lv×1/วิ 3 วิ (ท่าบัฟ: ไฟรอบตัว)'],
 ['frost','เยือกแข็ง','❄','#8fe6ff','ทุกครั้งที่ 3 ช้า −40 · ทุกครั้งที่ 6 แช่แข็ง 0.8 วิ'],['pierce','ทะลวง','➶','#d8d8e8','ไม่สน DEF 20 (ท่าบัฟ: +2 วิ)'],
 ['leech','ดูดชีวิต','♥','#e2435a','ทุกฮิตฟื้น Lv×1 สูงสุด 10 ฮิต (ท่าบัฟ: ฟื้น Lv×3)'],['impact','กระแทก','✸','#c9a46a','ทุกครั้งที่ 5 มึน 0.5 วิ + หลอด KO (ท่าบัฟ: ผลักรอบตัว)']];
const MUTD=Object.fromEntries(MUT.map(s=>[s[0],s])),SUPD=Object.fromEntries(SUP.map(s=>[s[0],s]));
const G=n=>{try{return (0,eval)(n);}catch(e){return undefined;}};   /* global lookup (indirect eval): this file has its own D / P / K */
const cKeys=()=>{const S=G('SKILLS')||{};return Object.keys(S).filter(k=>S[k].br==='C').sort((a,b)=>'basicAB'.indexOf(S[a].col)-'basicAB'.indexOf(S[b].col)||S[a].tier-S[b].tier);};
/* ---- gem farming v2 (owner 2026-11-21) ----
   own[k] = {lv 1…GEM_CAP, q 0 normal / 1 rare / 2 legend, lines [[id, rank 1–5, locked]], dup = spare copies}
   Mutation / support gems are bag goods (gmut_<id> / gsup_<id>, tradable in the central market): socketing takes one out
   of the bag, taking it out (or taking its main gem off the board) puts it back. */
const C=GD?GD.COST:{},QUAL=GD?GD.QUAL:[{n:'',c:'#ccc',lines:1}],CAP=GD?GD.GEM_CAP:5,BRK=GD?GD.BREAK:{};
const bagN=id=>{const a=AF();return a?(a.BAG[id]||0):0;},bagAdd=(id,n)=>{const a=AF();if(a)a.bagAdd(id,n);},bagSave=()=>{const a=AF();if(a)a.save();};
const zeny=()=>{const a=AF();return a?a.zeny:0;},payZ=z=>{const a=AF();if(!a||a.zeny<z)return false;a.zeny=a.zeny-z;return true;};
const fmtN=v=>{const a=AF();return a&&a.ui?a.ui.fmt(v):String(v);};
function rollLines(q,keep){const L=GD?GD.LINES:[],out=(keep||[]).slice(),n=QUAL[q].lines;
  while(out.length<n){const c=L.filter(l=>!out.some(o=>o[0]===l[0]));if(!c.length)break;const l=c[Math.floor(Math.random()*c.length)],x=Math.random(),P=GD.RANK_P;out.push([l[0],x<P[0]?1:x<P[0]+P[1]?2:3,0]);}
  return out;}
function load(){let d=null;try{d=JSON.parse(localStorage.getItem(SKEY)||'null');}catch(e){}
  if(!d||(d.v!==2&&d.v!==3)){d={v:2,own:{},sock:Array(NS).fill(null),mods:{},mutOwn:{},supOwn:{}};
    const LV=G('LV')||{};for(const k of cKeys())if(LV[k]>0){d.own[k]={lv:1};const i=d.sock.indexOf(null);if(i>=0)d.sock[i]=k;}}   /* old C points → owned (+ socketed) gems */
  if(d.v===2){   /* v2 → v3: quality + lines for owned gems; mutation / support counts move into the bag (what is socketed stays socketed) */
    for(const k in d.own){const o=d.own[k];o.q=o.q||0;o.lines=o.lines||[];o.dup=o.dup||0;}   /* gems from before farming have empty line slots: 'สุ่มบรรทัด' fills them (keeps the bench unchanged) */
    const useN={};for(const k in d.mods)(d.mods[k]||[]).forEach((id,j)=>{if(id){const key=(j===0||j===3?'gmut_':'gsup_')+id;useN[key]=(useN[key]||0)+1;}});
    for(const [own,pre] of [[d.mutOwn||{},'gmut_'],[d.supOwn||{},'gsup_']])for(const id in own){const free=(own[id]||0)-(useN[pre+id]||0);if(free>0&&!G('testMode'))bagAdd(pre+id,free);}
    delete d.mutOwn;delete d.supOwn;d.v=3;d.pity=0;d.tg=0;bagSave();}
  if(G('testMode')&&!d.tg){   /* test mode: every gem (Lv 5, rare) + goods to try carving / levelling / lines, once */
    for(const k of cKeys())if(!d.own[k])d.own[k]={lv:5,q:1,lines:rollLines(1),dup:2};
    const give=[['tess',3000],['sore',60],['guard',20]];for(let t=1;t<=4;t++)give.push(['tstone'+t,30],['tfrag'+t,80]);for(const m of MUT)give.push(['gmut_'+m[0],2]);for(const m of SUP)give.push(['gsup_'+m[0],3]);
    for(const [id,c] of give)if(bagN(id)<c)bagAdd(id,c-bagN(id));bagSave();d.tg=1;}
  for(const k in d.mods){const a=d.mods[k];while(a.length<4)a.push(null);}
  return d;}
let D=load();const save=()=>{try{localStorage.setItem(SKEY,JSON.stringify(D));}catch(e){}try{apply();}catch(e){}};
const lv=()=>(G('PS')||{}).lv||1,test=()=>!!G('testMode');
const sockOpen=i=>test()||lv()>=SOCK_LV[i];
const tierOK=k=>test()||lv()>=TIER_LV[G('SKILLS')[k].tier];
const modOpen=(k,j)=>{const l=(D.own[k]||{}).lv||1;return j===0||(j===1&&l>=3)||(j===2&&l>=5)||(j===3&&l>=CAP);};   /* j 3 = second mutation socket at the level cap */
const isMutJ=j=>j===0||j===3;
const used=(kind,id)=>{let n=0;for(const k of D.sock)if(k&&D.mods[k])D.mods[k].forEach((x,j)=>{if(x===id&&((kind==='mut')===isMutJ(j)))n++;});return n;};
const free=(kind,id)=>bagN((kind==='mut'?'gmut_':'gsup_')+id);   /* unsocketed gems = bag goods */
const giveBack=k=>{const a=D.mods[k];if(!a)return;a.forEach((id,j)=>{if(id)bagAdd((isMutJ(j)?'gmut_':'gsup_')+id,1);});D.mods[k]=[null,null,null,null];bagSave();};
const gemImg=k=>GEM_DIR+k+'.webp';

/* ---------- board geometry (board 680×680; frame art 1254², plain totem ring 2026-11-19, shifted so its inner rim circle sits at the centre 627,627 r 467.1) ---------- */
const BS=680,K=BS/1254,HX=627*K,HY=627*K,HR=446.6*K,FR=467.1*K;   /* centre + inner-rim radius FR fitted to the frame art (least squares on its inner edge) */
const SPREAD=1,PU=0,PV=0;
const P=(u,v)=>({x:HX+(u-PU)*HR*.96*SPREAD,y:HY+(v-PV)*HR*.96*SPREAD});
/* socket layout: 5 main stars round the sky, each with its 3 mod stars (repulsion-relaxed) */
const MAIN=[P(0.29,-0.40),P(-0.33,-0.40),P(-0.47,0.17),P(0.19,0.52),P(0.45,0.08)];   /* owner 2026-11-19: spread over the whole sky (relaxed so sockets keep ≥ 12 px apart) */
const MODS=[ // [mutation, support, support] per main socket
 [P(0.48,-0.68),P(0.61,-0.42),P(0.10,-0.65)],
 [P(-0.55,-0.65),P(-0.16,-0.66),P(-0.64,-0.32)],
 [P(-0.78,0.29),P(-0.69,-0.06),P(-0.41,0.48)],
 [P(0.13,0.85),P(-0.09,0.67),P(0.48,0.64)],
 [P(0.78,0.14),P(0.52,0.39),P(0.65,-0.17)]];
{/* place each second-mutation star in the most open spot around its main star (clearance = distance − both radii) */
  const nodes=()=>[...MAIN.map(p=>[p,40]),...MODS.flatMap(m=>m.slice(0,4).map((p,j)=>p&&[p,j===2||j===1?20:26]).filter(Boolean))];
  MODS.forEach((m,i)=>{const c=MAIN[i];let best=null,bs=-1e9;
    for(let a=0;a<6.28;a+=.1)for(const rr of [70,78,86,96]){const p={x:c.x+Math.cos(a)*rr,y:c.y+Math.sin(a)*rr};if(Math.hypot(p.x-HX,p.y-HY)>HR*.86)continue;
      let cl=1e9;for(const [q,r] of nodes()){if(q===c)continue;cl=Math.min(cl,Math.hypot(q.x-p.x,q.y-p.y)-r-26);}cl-=rr*.05;if(cl>bs){bs=cl;best=p;}}
    m[3]=best;});}
const SZ={main:80,mut:52,sup:39},CUP={main:{cx:.494,cy:.469,r:.28},mut:{cx:.498,cy:.506,r:.281},sup:{cx:.499,cy:.478,r:.341}};

/* ---------- DOM ---------- */
const css=document.createElement('style');css.textContent=`
#totemWin{position:fixed;inset:0;z-index:58;display:none;align-items:center;justify-content:center;background:rgba(6,4,10,.62)}
#totemWin.open{display:flex}
#tgBox{position:fixed;inset:8px;display:flex;gap:10px;padding:34px 12px 12px;box-sizing:border-box;border-radius:22px;background:linear-gradient(#3a2418,#24140c);border:4px solid #e9b44c;box-shadow:0 0 0 3px #3a1f14,0 14px 40px rgba(0,0,0,.6);font-family:Mitr,Sarabun,sans-serif;color:#fff3c8;user-select:none}
#tgBox h2{position:absolute;left:0;right:0;top:-24px;margin:0 auto;width:320px;height:48px;line-height:44px;text-align:center;font:700 20px Mitr,serif;color:#fff3c8;background:linear-gradient(#a8452c,#5a1a10);border:3px solid #e9b44c;border-radius:24px;box-shadow:0 4px 0 #1a0c06;text-shadow:0 2px 0 #3a1f14;z-index:2}
#tgX{position:absolute;right:-14px;top:-14px;width:40px;height:40px;border-radius:50%;border:3px solid #e9b44c;background:#a8452c;color:#fff;font:900 20px sans-serif;cursor:pointer;box-shadow:0 3px 0 #1a0c06;z-index:3}
#tgMid{flex:1;min-width:0;position:relative;display:flex;align-items:center;justify-content:center}
#tgBoard{position:relative;flex:none;width:${BS}px;height:${BS}px;transform-origin:center}
#tgBoard>img,#tgBoard>canvas{position:absolute;pointer-events:none}
#tgSky{left:${HX-FR*1.01}px;top:${HY-FR*1.01}px;width:${FR*2.02}px;height:${FR*2.02}px;border-radius:50%}
#tgLines,#tgRing{left:0;top:0;width:${BS}px;height:${BS}px}
#tgFrame{left:0;top:0;width:${BS}px;height:${BS}px;filter:drop-shadow(0 0 6px rgba(0,0,0,.6))}
.tgN{position:absolute;cursor:pointer;transform:translate(-50%,-50%)}
.tgN>img.sk{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;filter:drop-shadow(0 3px 3px rgba(0,0,0,.55))}
.tgN>.in{position:absolute;border-radius:50%;overflow:hidden;pointer-events:none}
.tgN>.in img{width:100%;height:100%;object-fit:contain;display:block;transform:scale(1.25)}
.tgN.lock>img.sk{filter:grayscale(1) brightness(.45) drop-shadow(0 3px 3px rgba(0,0,0,.55))}
.tgN .lk{position:absolute;left:0;right:0;top:40%;text-align:center;font:700 10px Mitr,sans-serif;color:#e9c98a;text-shadow:0 1px 2px #000;pointer-events:none}
.tgN.sel>img.sk{filter:drop-shadow(0 0 7px #ffe14a) drop-shadow(0 0 3px #fff17a)}
.tgN .lvd{position:absolute;left:50%;bottom:-7px;transform:translateX(-50%);font:900 10px sans-serif;color:#ffe9a8;text-shadow:0 1px 2px #000;letter-spacing:-1px;white-space:nowrap;pointer-events:none}
.tgSg{position:absolute;inset:0;border-radius:50%;display:flex;align-items:center;justify-content:center;font:700 12px sans-serif;color:#fff;text-shadow:0 1px 1px #000;
  background:radial-gradient(circle at 35% 30%,#fff9 0 12%,transparent 13%),radial-gradient(circle at 50% 55%,var(--c),color-mix(in srgb,var(--c),#000 50%));box-shadow:inset 0 -2px 3px rgba(0,0,0,.35)}
.tgSg>img{position:absolute;inset:0;width:100%;height:100%;border-radius:50%;opacity:0}
.tgSg.art{transform:none!important;background:none!important;border:0!important;box-shadow:0 0 6px rgba(0,0,0,.55)!important}.tgSg.art>span{display:none}.tgSg.art>img{opacity:1}
.tgSg.mut{border-radius:30%;transform:rotate(45deg) scale(.82)}.tgSg.mut>span{transform:rotate(-45deg)}
#tgLeft,#tgRight{flex:none;display:flex;flex-direction:column;gap:6px;min-height:0}
#tgLeft{width:clamp(170px,21vw,300px)}#tgRight{width:clamp(200px,25vw,340px);overflow:auto}
#tgSel{display:flex;gap:8px;align-items:center;background:rgba(0,0,0,.28);border-radius:12px;padding:8px}
#tgSel .big{width:clamp(48px,7vw,96px);aspect-ratio:1;flex:none;position:relative}#tgSel .big img{width:100%;height:100%}
#tgSel .big .tgSg{inset:12%}#tgSel b{font:700 clamp(12px,1.4vw,16px) Mitr,sans-serif;color:#ffe9a8}
#tgLeft h3,#tgRight h3{margin:0;font:700 12px Mitr,sans-serif;color:#e9c98a;border-bottom:1.5px solid #6a4a2a;padding-bottom:1px}
.tgInv{display:grid;gap:5px;background:rgba(0,0,0,.25);border-radius:10px;padding:5px}
#tgGems,#tgMuts,#tgSups{grid-template-columns:repeat(auto-fill,minmax(48px,1fr))}
.tgInv button{position:relative;border:0;background:none;padding:0;cursor:pointer;aspect-ratio:1;border-radius:8px}
.tgInv button img{width:100%;height:100%;display:block}
.tgInv button .tgSg{inset:3px}
.tgInv button.used img,.tgInv button.used .tgSg{opacity:.32}
.tgInv button.lock img{filter:grayscale(1) brightness(.45)}
.tgInv button.sel{box-shadow:0 0 0 2.5px #fff17a,0 0 9px #ffe14a}
.tgInv button i{position:absolute;right:-1px;bottom:-1px;font:700 8px sans-serif;color:#fff;background:#5a2e16;border-radius:5px;padding:0 2px;font-style:normal}
#tgInfo{flex:1;min-height:0;overflow:auto;background:rgba(255,248,230,.95);color:#3a1f14;border:2px solid #c9a46a;border-radius:10px;padding:8px 10px;font:500 clamp(11px,1.15vw,14px)/1.5 Mitr,sans-serif}
#tgInfo b{color:#7a2a1c}#tgInfo .g{color:#2a7a3a}#tgInfo .c{color:#a8302a}
#tgBtns{display:flex;gap:6px}
#tgBtns button{flex:1;padding:6px 0;border-radius:12px;border:2px solid #5a2e16;background:linear-gradient(#ffd77a,#e9a43c);font:700 12px Mitr,sans-serif;color:#3a1f14;cursor:pointer;box-shadow:0 2px 0 #1a0c06}
#tgBtns button:disabled{filter:grayscale(1);opacity:.45;cursor:default}
.tgInv button[data-q="1"]{box-shadow:0 0 0 2px #5ab4ff,0 0 8px rgba(90,180,255,.7)}.tgInv button[data-q="2"]{box-shadow:0 0 0 2px #ffc83a,0 0 10px rgba(255,200,58,.85)}
.tgInv button.sel[data-q]{box-shadow:0 0 0 2.5px #fff17a,0 0 9px #ffe14a}
.tgInv button b.dp{position:absolute;left:-1px;top:-1px;font:700 8px sans-serif;color:#fff;background:#2a5a8a;border-radius:5px;padding:0 2px}
.tgN .in.q1{box-shadow:0 0 10px 3px rgba(90,180,255,.75)}.tgN .in.q2{box-shadow:0 0 14px 5px rgba(255,200,58,.85);animation:tgLeg 2.4s linear infinite}
@keyframes tgLeg{50%{box-shadow:0 0 18px 7px rgba(255,226,120,.95)}}
#tgInfo .ln{display:flex;align-items:center;gap:4px;margin:2px 0;padding:2px 4px;border-radius:6px;background:rgba(201,164,106,.18)}
#tgInfo .ln i{font-style:normal;font-weight:700;color:#7a2a1c;min-width:20px}#tgInfo .ln span{flex:1}
#tgInfo .ln button,#tgInfo .rr button{border:1.5px solid #5a2e16;border-radius:8px;background:linear-gradient(#ffd77a,#e9a43c);font:700 10px Mitr,sans-serif;color:#3a1f14;cursor:pointer;padding:1px 5px}
#tgInfo .ln button:disabled,#tgInfo .rr button:disabled{filter:grayscale(1);opacity:.45;cursor:default}
#tgInfo .ln label{font-size:10px;color:#6a4a2a;white-space:nowrap}
#totemWin .q{font-weight:700;padding:0 6px;border-radius:8px;color:#1a1a2a;text-shadow:none}
#tgWsB{margin-top:2px;padding:7px 0;border-radius:12px;border:2px solid #5a2e16;background:linear-gradient(#9fe0ff,#3a8ad8);font:700 13px Mitr,sans-serif;color:#10243a;cursor:pointer;box-shadow:0 2px 0 #1a0c06}
#tgWs{position:absolute;inset:6px;z-index:5;display:none;flex-direction:column;gap:8px;padding:10px;border-radius:16px;background:rgba(30,18,10,.95);border:2px solid #e9b44c;overflow:auto}
#tgWs.open{display:flex}#tgWs h4{margin:0;font:700 15px Mitr,sans-serif;color:#ffe9a8}
#tgWs .tabs{display:flex;gap:6px;flex-wrap:wrap}#tgWs .tabs button{flex:1;min-width:90px;padding:6px 4px;border-radius:10px;border:2px solid #5a2e16;background:#5a3a22;color:#fff3c8;font:700 12px Mitr,sans-serif;cursor:pointer}
#tgWs .tabs button.on{background:linear-gradient(#ffd77a,#e9a43c);color:#3a1f14}
#tgWs .row{display:flex;align-items:center;gap:8px;flex-wrap:wrap;background:rgba(255,248,230,.08);border-radius:10px;padding:8px}
#tgWs .row .nm{flex:1;min-width:150px;font:500 12px/1.4 Mitr,sans-serif;color:#fff3c8}#tgWs .row .nm b{color:#ffe9a8}
#tgWs .go{padding:6px 12px;border-radius:10px;border:2px solid #5a2e16;background:linear-gradient(#ffd77a,#e9a43c);font:700 12px Mitr,sans-serif;color:#3a1f14;cursor:pointer;box-shadow:0 2px 0 #1a0c06}
#tgWs .go:disabled{filter:grayscale(1);opacity:.45;cursor:default}
#tgWs .ic{display:inline-flex;align-items:center;gap:2px;font:700 12px Mitr,sans-serif;color:#fff}#tgWs .ic.no{color:#ff8a7a}
#tgWs .res{min-height:44px;display:flex;align-items:center;gap:10px;padding:8px;border-radius:12px;background:rgba(0,0,0,.35);font:600 13px Mitr,sans-serif;color:#fff3c8}
#tgWs .res img{width:48px;height:48px}#tgWs .note{font:500 11px/1.5 Mitr,sans-serif;color:#e9c98a}
#tgWs .gg{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:6px}
#tgWs .gc{display:flex;gap:6px;align-items:center;padding:6px;border-radius:10px;background:rgba(255,248,230,.08);font:500 11px/1.35 Mitr,sans-serif;color:#fff3c8}
#tgWs .gc img{width:40px;height:40px;flex:none}#tgWs .gc button{margin-left:auto}
@keyframes tgPop{0%{transform:scale(.3);opacity:0}60%{transform:scale(1.25);opacity:1}100%{transform:scale(1)}}#tgWs .res .pop{animation:tgPop .5s ease-out}
`;document.head.appendChild(css);
const win=document.createElement('div');win.id='totemWin';
win.innerHTML=`<div id="tgBox"><h2>กลุ่มดาววิญญาณโทเท็ม</h2><button id="tgX">✕</button>
<div id="tgLeft"><h3>รายละเอียด</h3><div id="tgSel"></div><div id="tgInfo"></div><div id="tgBtns"><button id="tgOut">ถอดออก</button><button id="tgUp">อัปเลเวล</button></div></div>
<div id="tgMid"><div id="tgBoard"><img id="tgSky" src="${BD}sky.webp" alt=""><canvas id="tgLines" width="${BS*2}" height="${BS*2}"></canvas><canvas id="tgRing" width="${BS*2}" height="${BS*2}"></canvas><img id="tgFrame" src="${BD}frame.webp" alt=""></div><div id="tgWs"></div></div>
<div id="tgRight"><button id="tgWsB">⛏ ศาลโทเท็ม · แกะ / คราฟต์ / ย่อยเจม</button><h3>เจมหลัก (สกิล C)</h3><div class="tgInv" id="tgGems"></div><h3>เจมแปรสภาพ · ได้อย่าง เสียอย่าง</h3><div class="tgInv" id="tgMuts"></div><h3>เจมเสริม</h3><div class="tgInv" id="tgSups"></div></div></div>`;
document.body.appendChild(win);
const box=win.querySelector('#tgBox'),board=win.querySelector('#tgBoard'),lines=win.querySelector('#tgLines'),ringC=win.querySelector('#tgRing');
win.addEventListener('pointerdown',e=>{if(e.target===win)close();});win.querySelector('#tgX').onclick=()=>close();

/* ---------- constellation lines (dim when locked, lit when open, gold when both ends hold a gem) ---------- */
function drawLines(t){const g=lines.getContext('2d');g.setTransform(2,0,0,2,0,0);g.clearRect(0,0,BS,BS);
  const seg=(a,b,state)=>{g.save();g.lineCap='round';
    if(state===0){g.strokeStyle='rgba(160,170,210,.22)';g.lineWidth=1.5;g.setLineDash([3,5]);}
    else if(state===1){g.strokeStyle='rgba(190,220,255,.6)';g.lineWidth=2;g.shadowColor='#9fd8ff';g.shadowBlur=6;}
    else{g.strokeStyle='rgba(255,236,160,.95)';g.lineWidth=2.6;g.shadowColor='#ffd86a';g.shadowBlur=12;}
    g.beginPath();g.moveTo(a.x,a.y);g.lineTo(b.x,b.y);g.stroke();g.restore();};
  for(let i=0;i<NS-1;i++){const s=!sockOpen(i+1)?0:(D.sock[i]&&D.sock[i+1])?2:1;seg(MAIN[i],MAIN[i+1],s);}
  for(let i=0;i<NS;i++){const k=D.sock[i];MODS[i].forEach((p,j)=>{const on=sockOpen(i)&&k&&modOpen(k,j);seg(MAIN[i],p,!on?0:(D.mods[k]||[])[j]?2:1);});}
  for(let i=0;i<NS;i++)if(sockOpen(i)){const p=MAIN[i],r=SZ.main*.66+Math.sin(t*2+i)*2;g.save();g.globalAlpha=D.sock[i]?.5:.22;g.fillStyle=D.sock[i]?'#ffe9a0':'#bcd8ff';
    g.beginPath();for(let q=0;q<8;q++){const a=q*Math.PI/4+t*.4,rr=q%2?r*.35:r;g.lineTo(p.x+Math.cos(a)*rr,p.y+Math.sin(a)*rr);}g.closePath();g.fill();g.restore();}}
/* ---------- rotating rune ring between sky and frame ---------- */
let spin=0,boost=0;const RUNES='ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛞᛟ';
/* painted ring shared by every hero (assets/gems/board/ring.webp): when it exists it is turned instead of the code ring */
const ringImg=new Image();let ringOK=false;ringImg.onload=()=>{ringOK=true;};ringImg.src=BD+'ring.webp';
const SHOW_RING=false;   /* owner 2026-11-19: inner rune ring off — sky reaches the wooden frame */
function drawRing(dt){const g=ringC.getContext('2d');g.setTransform(2,0,0,2,0,0);g.clearRect(0,0,BS,BS);if(!SHOW_RING)return;
  boost=Math.max(0,boost-dt*.6);spin+=dt*(.06+boost*1.6);const R=HR*.94,glow=.35+boost*.65;
  if(ringOK){const sc=(FR+2*K)/506.5;g.save();g.translate(HX,HY);g.rotate(spin);   /* ring art: outer circle centre 510.4,511.3 r 506.5 (of 1024) */g.shadowColor=boost>0?'#7fe8ff':'rgba(0,0,0,.55)';g.shadowBlur=boost>0?18*boost:8;   /* outer edge tucks just under the frame's inner rim (≈362 px of 1254) */g.drawImage(ringImg,-510.4*sc,-511.3*sc,1024*sc,1024*sc);g.restore();return;}
  g.save();g.translate(HX,HY);g.rotate(spin);
  g.strokeStyle=`rgba(233,180,76,${.55+boost*.4})`;g.lineWidth=2;g.beginPath();g.arc(0,0,R,0,7);g.stroke();g.beginPath();g.arc(0,0,R-17,0,7);g.stroke();
  for(let q=0;q<96;q++){const a=q/96*Math.PI*2,l=q%8===0?7:3;g.beginPath();g.moveTo(Math.cos(a)*R,Math.sin(a)*R);g.lineTo(Math.cos(a)*(R-l),Math.sin(a)*(R-l));g.stroke();}
  g.font='bold 11px serif';g.textAlign='center';g.textBaseline='middle';g.fillStyle=`rgba(150,240,255,${glow})`;g.shadowColor='#7fe8ff';g.shadowBlur=6+boost*10;
  for(let q=0;q<24;q++){const a=q/24*Math.PI*2;g.save();g.rotate(a);g.translate(0,-(R-9));g.fillText(RUNES[q],0,0);g.restore();}
  g.restore();}
let raf=0,last=0;function loop(ts){if(!win.classList.contains('open'))return;const dt=Math.min(.05,(ts-last)/1000||0);last=ts;drawRing(dt);drawLines(ts/1000);raf=requestAnimationFrame(loop);}

/* ---------- render ---------- */
let sel=null;   // {gem:k} | {mut:id} | {sup:id} | {sock:i} | {mod:[i,j]}
const info=h=>{win.querySelector('#tgInfo').innerHTML=h;};
const qTag=q=>`<span class="q" style="background:${QUAL[q||0].c}">${QUAL[q||0].n}</span>`;
const gemPowOf=lv=>GD?GD.gemPow(lv||1):.03*((lv||1)-1);
function preview(){const e=win.querySelector('#tgSel');if(!e)return;const S=G('SKILLS');let k=sel&&(sel.gem||(sel.sock!=null&&D.sock[sel.sock])),art='',nm='';
  if(k){const o=D.own[k]||{};art=`<img src="${gemImg(k)}" onerror="this.onerror=null;this.src='assets/icons/${HERO}/${k}.webp'" alt="">`;nm=S[k].name+`<br><small style="font-weight:500;color:#e9c98a">เจมขั้น ${S[k].tier} · Lv ${o.lv||0}/${CAP}${o.lv?' · '+QUAL[o.q||0].n:''}</small>`;}
  else if(sel&&(sel.mut||sel.sup)){const id=sel.mut||sel.sup;art=sg(id,sel.mut?'mut':'sup');nm=(sel.mut?MUTD:SUPD)[id][1]+`<br><small style="font-weight:500;color:#e9c98a">${sel.mut?'เจมแปรสภาพ':'เจมเสริม'}</small>`;}
  else if(sel&&sel.mod){const kk=D.sock[sel.mod[0]],id=kk&&(D.mods[kk]||[])[sel.mod[1]];if(id){const m=isMutJ(sel.mod[1]);art=sg(id,m?'mut':'sup');nm=(m?MUTD:SUPD)[id][1];}}
  e.innerHTML=art?`<div class="big">${art}</div><b>${nm}</b>`:'<b style="opacity:.6;font-weight:500">แตะเจมหรือดาวเพื่อดูรายละเอียด</b>';}
function lvNeed(o){const l=o.lv||1;return {ess:C.lvEss?C.lvEss(l):0,z:C.lvZ?C.lvZ(l):0,dup:BRK[l]||0};}
function gemInfo(k){const S=G('SKILLS')[k],o=D.own[k],LD=GD?GD.LND:{};
  let h=`<b>${S.name}</b> · เจมขั้น ${S.tier} · สาย ${S.col==='basic'?'Basic':S.col}<br>${S.th||''}<br><span style="opacity:.75">ใส่ได้ตั้งแต่ Lv ${TIER_LV[S.tier]} · เงื่อนไขสกิล: ${S.rq||'-'}</span><br><span style="color:#2a5a8a">แปรสภาพ/เจมเสริม/บรรทัด มีผลกับ: ${tgtName(targetOf(k))} · พลังท่านั้น ×${(1+gemPowOf(o&&o.lv)).toFixed(3)} (เลเวลเจม)</span>`;
  if(!o)return h+'<br><i>ยังไม่มีเจมนี้ — แกะหินโทเท็มขั้น '+S.tier+' (สุ่มชนิด) หรือคราฟต์จากชิ้นส่วนที่ศาลโทเท็ม</i>';
  const nd=lvNeed(o),max=o.lv>=CAP;
  h+=`<br>${qTag(o.q)} เลเวลเจม <b>${o.lv}/${CAP}</b> · เจมซ้ำ ${o.dup||0} · ช่องเจมเสริม ${o.lv>=5?2:o.lv>=3?1:0}/2 (Lv 3 / 5)${o.lv>=CAP?' · ช่องแปรสภาพที่ 2 เปิดแล้ว':` · ช่องแปรสภาพที่ 2 เปิดที่ Lv ${CAP}`}`;
  h+=max?'<br><span class="g">เลเวลตันแล้ว (อัปเดตหน้าจะเพิ่มเลเวลตัน)</span>':`<br>อัปเลเวลถัดไป: แก่นโทเท็ม ${nd.ess} (มี ${fmtN(bagN('tess'))}) · ${fmtN(nd.z)}z${nd.dup?` · <b class="c">ทะลุขีด: ใช้เจมซ้ำ ${nd.dup} (มี ${o.dup||0})</b>`:''}`;
  const lk=(o.lines||[]).filter(l=>l[2]).length,rz=(C.rerollEss||8)+(C.lockEss||12)*lk;
  h+=`<div style="margin-top:4px"><b>บรรทัดสุ่ม</b> (${QUAL[o.q||0].n} ${QUAL[o.q||0].lines} บรรทัด)</div>`+(o.lines||[]).map((l,i)=>{const d=LD[l[0]],r=l[1],up=r<5?C.rankEss[r-1]:0;
    return `<div class="ln"><i>${GD.R(r)}</i><span><b>${d?d[1]:l[0]}</b> — ${d?d[3](r):''}</span>${r<5?`<button data-lup="${i}" ${bagN('tess')>=up&&zeny()>=C.rankZ(r)?'':'disabled'} title="อัปขั้น: แก่น ${up} · ${fmtN(C.rankZ(r))}z">ขั้น+ (${up})</button>`:'<small>ขั้นสูงสุด</small>'}<label><input type="checkbox" data-lock="${i}" ${l[2]?'checked':''}>ล็อก</label></div>`;}).join('')
    +Array.from({length:Math.max(0,QUAL[o.q||0].lines-(o.lines||[]).length)},()=>'<div class="ln"><i>–</i><span style="opacity:.6">ช่องบรรทัดว่าง — กดสุ่มเพื่อเติม</span></div>').join('')
    +`<div class="rr" style="margin-top:3px">สุ่มบรรทัดที่ไม่ล็อกใหม่ (ขั้นเริ่ม I–III): แก่น ${rz} · ${fmtN(C.rerollZ||5000)}z <button data-reroll ${bagN('tess')>=rz&&zeny()>=(C.rerollZ||5000)&&(lk<(o.lines||[]).length||(o.lines||[]).length<QUAL[o.q||0].lines)?'':'disabled'}>🎲 สุ่มใหม่</button></div>`;
  return h;}
function bindInfo(k){const el=win.querySelector('#tgInfo'),o=D.own[k];if(!o)return;
  el.querySelectorAll('[data-lock]').forEach(c=>c.onchange=()=>{o.lines[+c.dataset.lock][2]=c.checked?1:0;save();info(gemInfo(k));bindInfo(k);});
  el.querySelectorAll('[data-lup]').forEach(b=>b.onclick=()=>{const l=o.lines[+b.dataset.lup],r=l[1],e=C.rankEss[r-1],z=C.rankZ(r);if(r>=5||bagN('tess')<e||!payZ(z))return;bagAdd('tess',-e);bagSave();l[1]++;save();info(gemInfo(k)+`<br><span class="g">✔ ${GD.LND[l[0]][1]} ขึ้นเป็นขั้น ${GD.R(l[1])}</span>`);bindInfo(k);render(true);});
  const rr=el.querySelector('[data-reroll]');if(rr)rr.onclick=()=>{const lk=o.lines.filter(l=>l[2]),e=C.rerollEss+C.lockEss*lk.length;if(bagN('tess')<e||!payZ(C.rerollZ))return;bagAdd('tess',-e);bagSave();
    o.lines=rollLines(o.q||0,lk);save();info(gemInfo(k)+'<br><span class="g">✔ สุ่มบรรทัดใหม่แล้ว</span>');bindInfo(k);render(true);};}
function showGem(k,extra){info(gemInfo(k)+(extra||''));bindInfo(k);}
const mutInfo=id=>{const m=MUTD[id];return `<b>${m[1]}</b> (เจมแปรสภาพ)<br><span class="g">ได้: ${m[4]}</span><br><span class="c">เสีย: ${m[5]}</span>`;};
const supInfo=id=>{const s=SUPD[id];return `<b>${s[1]}</b> (เจมเสริม)<br>${s[4]}`;};
/* painted gem if the file exists (assets/gems/mut|support/<id>.webp), else the code-drawn badge */
const sg=(id,kind)=>{const d=kind==='mut'?MUTD[id]:SUPD[id];return `<span class="tgSg${kind==='mut'?' mut':''}" style="--c:${d[3]}"><span>${d[2]}</span><img src="assets/gems/${kind==='mut'?'mut':'support'}/${id}.webp" alt="" draggable="false" onload="this.parentNode.classList.add('art')" onerror="this.remove()"></span>`;};
function node(x,y,kind,inner,cls,title,onclick,icls){const el=document.createElement('div');const s=SZ[kind],c=CUP[kind];el.className='tgN '+(cls||'');el.style.cssText=`left:${x}px;top:${y}px;width:${s}px;height:${s}px`;
  const gs=c.r*2*s*(kind==='main'?1.18:1.05);
  el.innerHTML=`<img class="sk" src="${BD}sock_${kind}.webp" alt="">`+(inner?`<div class="in ${icls||''}" style="left:${c.cx*s-gs/2}px;top:${c.cy*s-gs/2}px;width:${gs}px;height:${gs}px">${inner}</div>`:'');
  el.title=title||'';el.onclick=onclick;board.appendChild(el);return el;}
function render(keepInfo){const S=G('SKILLS');if(!S)return;
  const inv=(id,list)=>{const e=win.querySelector(id);e.innerHTML='';list.forEach(b=>e.appendChild(b));};
  inv('#tgGems',cKeys().map(k=>{const b=document.createElement('button'),own=D.own[k];b.className=(own?'':'lock ')+(D.sock.includes(k)?'used ':'')+(sel&&sel.gem===k?'sel':'');if(own&&own.q)b.dataset.q=own.q;
    b.innerHTML=`<img src="${gemImg(k)}" onerror="this.onerror=null;this.src='assets/icons/${HERO}/${k}.webp'" alt="" draggable="false">`+(own?`<i>${own.lv}</i>`+(own.dup?`<b class="dp">×${own.dup}</b>`:''):'');b.title=S[k].name+(own?` · Lv ${own.lv} · ${QUAL[own.q||0].n}`:' · ยังไม่มี');b.onclick=()=>{sel=own?{gem:k}:null;showGem(k);render(true);};return b;}));
  for(const [kind,list,el] of [['mut',MUT,'#tgMuts'],['sup',SUP,'#tgSups']])
    inv(el,list.map(([id,n])=>{const fr=free(kind,id),u=used(kind,id);const b=document.createElement('button');b.className=(fr<=0?'used ':'')+(sel&&sel[kind]===id?'sel':'');
      b.innerHTML=sg(id,kind)+(fr||u?`<i>${fr}</i>`:'');b.title=n;
      b.onclick=()=>{sel=fr>0?{[kind]:id}:null;info((kind==='mut'?mutInfo(id):supInfo(id))+`<br><span style="opacity:.75">ในกระเป๋า ${fr} · ใส่อยู่ ${u} — ${fr>0?`แตะดาว${kind==='mut'?'กลาง (ขอบรูน)':'เล็ก'}ข้างเจมหลักเพื่อใส่`:'หาเพิ่ม: ดรอปจากมอนดันเจี้ยน · ตลาดกลาง (หมวดเจม/โทเท็ม)'}</span>`);render(true);};return b;}));
  board.querySelectorAll('.tgN').forEach(e=>e.remove());
  MAIN.forEach((p,i)=>{const k=D.sock[i],open=sockOpen(i);
    MODS[i].forEach((q,j)=>{if(!q)return;const on=open&&k&&modOpen(k,j),id=k&&(D.mods[k]||[])[j],kind=isMutJ(j)?'mut':'sup';
      if(j===3&&!on&&!id)return;   /* the second mutation star only shows once its gem reaches the cap */
      node(q.x,q.y,kind,id?sg(id,kind):'',(on?'':'lock ')+(sel&&sel.mod&&sel.mod[0]===i&&sel.mod[1]===j?'sel':''),
        !k?'ใส่เจมหลักก่อน':!on?`เปิดที่เลเวลเจม ${j===1?3:j===2?5:CAP}`:id?(kind==='mut'?MUTD[id][1]:SUPD[id][1]):(kind==='mut'?'ช่องแปรสภาพ':'ช่องเจมเสริม'),
        ()=>on?clickMod(i,j):info(!k?'ใส่เจมหลักในดาวดวงใหญ่ก่อน':`ช่องนี้เปิดเมื่อเจมหลักถึงเลเวล ${j===1?3:j===2?5:CAP}`));});
    const o=k&&D.own[k];
    const el=node(p.x,p.y,'main',k?`<img src="${gemImg(k)}" onerror="this.onerror=null;this.src='assets/icons/${HERO}/${k}.webp'" alt="">`:'',(open?'':'lock ')+(sel&&sel.sock===i?'sel':''),open?(k?S[k].name:'ช่องเจมหลัก'):`เปิดที่ Lv ${SOCK_LV[i]}`,()=>clickSock(i),o&&o.q?'q'+o.q:'');
    if(!open)el.insertAdjacentHTML('beforeend',`<div class="lk">🔒 Lv ${SOCK_LV[i]}</div>`);
    if(o)el.insertAdjacentHTML('beforeend',`<span class="lvd">Lv ${o.lv}</span>`);});
  const b1=win.querySelector('#tgOut'),b2=win.querySelector('#tgUp');
  b1.disabled=!(sel&&((sel.sock!=null&&D.sock[sel.sock])||(sel.mod&&(D.mods[D.sock[sel.mod[0]]]||[])[sel.mod[1]])));
  const gk=sel&&(sel.gem||(sel.sock!=null&&D.sock[sel.sock])),go=gk&&D.own[gk];
  if(go){const nd=lvNeed(go);b2.disabled=go.lv>=CAP||bagN('tess')<nd.ess||zeny()<nd.z||(go.dup||0)<nd.dup;b2.textContent=go.lv>=CAP?'เลเวลตัน':nd.dup?`ทะลุขีด Lv ${go.lv+1}`:`อัปเลเวล ${go.lv+1}`;}
  else{b2.disabled=true;b2.textContent='อัปเลเวล';}
  preview();if(!keepInfo&&gk&&go)bindInfo(gk);}
function clickSock(i){const S=G('SKILLS');
  if(!sockOpen(i)){info(`ดาวดวงนี้เปิดที่ Lv ${SOCK_LV[i]}`);return;}
  if(sel&&sel.gem){const k=sel.gem;if(!tierOK(k)){info(`${S[k].name} เป็นเจมขั้น ${S[k].tier} ใส่ได้ตั้งแต่ Lv ${TIER_LV[S[k].tier]}`);return;}
    const j=D.sock.indexOf(k),old=D.sock[i];if(j>=0&&j!==i)D.sock[j]=old;else if(old&&old!==k)giveBack(old);   /* a gem taken off the board gives its mutation / supports back */
    D.sock[i]=k;sel=null;boost=1;save();showGem(k,'<br>✔ ใส่เจมแล้ว');render(true);return;}
  if(sel&&sel.sock!=null&&sel.sock!==i){const a=sel.sock;[D.sock[a],D.sock[i]]=[D.sock[i],D.sock[a]];sel=null;boost=.6;save();render();return;}
  sel=D.sock[i]?{sock:i}:null;if(D.sock[i])showGem(D.sock[i],'<br>แตะดาวดวงใหญ่อื่นเพื่อสลับ หรือกด "ถอดออก"');else info('ดาวว่าง · เลือกเจมหลักทางขวาแล้วแตะดาวดวงนี้');render(true);}
function clickMod(i,j){const k=D.sock[i];const arr=D.mods[k]||(D.mods[k]=[null,null,null,null]);while(arr.length<4)arr.push(null);const kind=isMutJ(j)?'mut':'sup',pre=kind==='mut'?'gmut_':'gsup_';
  if(sel&&sel[kind]){const id=sel[kind];if(free(kind,id)<=0){info('ไม่มีเจมนี้เหลือในกระเป๋า');return;}
    if(kind==='sup'&&arr.includes(id)&&arr[j]!==id){info('เจมเสริมชนิดเดียวกันใส่ซ้ำในเจมเดียวกันไม่ได้');return;}
    if(kind==='mut'&&((j===0&&arr[3]===id)||(j===3&&arr[0]===id))){info('แปรสภาพสองช่องของเจมเดียวกันต้องเป็นคนละชนิด');return;}
    if(kind==='mut'&&used('mut',id)>=2&&arr[j]!==id){info('เจมแปรสภาพชนิดเดียวกันใส่ได้ไม่เกิน 2 เม็ดทั้งแผง');return;}
    if(arr[j])bagAdd(pre+arr[j],1);bagAdd(pre+id,-1);bagSave();
    arr[j]=id;sel=null;boost=.8;save();info(`ใส่ <b>${kind==='mut'?MUTD[id][1]:SUPD[id][1]}</b> ใน ${G('SKILLS')[k].name} แล้ว`);render(true);return;}
  if(sel&&(sel.mut||sel.sup)){info(sel.mut?'เจมแปรสภาพใส่ได้เฉพาะดาวกลาง (ขอบรูน)':'เจมเสริมใส่ได้เฉพาะดาวเล็ก');return;}
  sel={mod:[i,j]};info(arr[j]?(kind==='mut'?mutInfo(arr[j]):supInfo(arr[j]))+`<br>อยู่ใน ${G('SKILLS')[k].name} · กด "ถอดออก" เพื่อเก็บเข้ากระเป๋า`:(kind==='mut'?'ช่องแปรสภาพว่าง · เลือกเจมแปรสภาพทางขวา':'ช่องเจมเสริมว่าง · เลือกเจมเสริมทางขวา'));render(true);}
win.querySelector('#tgOut').onclick=()=>{if(!sel)return;
  if(sel.sock!=null){const k=D.sock[sel.sock];D.sock[sel.sock]=null;if(k)giveBack(k);}
  else if(sel.mod){const k=D.sock[sel.mod[0]],a=D.mods[k];if(a&&a[sel.mod[1]]){bagAdd((isMutJ(sel.mod[1])?'gmut_':'gsup_')+a[sel.mod[1]],1);bagSave();a[sel.mod[1]]=null;}}
  sel=null;save();info('ถอดออกแล้ว (เจมแปรสภาพ / เจมเสริมกลับเข้ากระเป๋า)');render();};
win.querySelector('#tgUp').onclick=()=>{const k=sel&&(sel.gem||(sel.sock!=null&&D.sock[sel.sock]));const o=k&&D.own[k];if(!o||o.lv>=CAP)return;
  const nd=lvNeed(o);if(bagN('tess')<nd.ess||(o.dup||0)<nd.dup||zeny()<nd.z)return;payZ(nd.z);bagAdd('tess',-nd.ess);bagSave();o.dup-=nd.dup;o.lv++;boost=.7;save();
  showGem(k,`<br><span class="g">✔ ${nd.dup?'ทะลุขีด! ':''}เลเวลเจม ${o.lv}${o.lv===3||o.lv===5?' · เปิดช่องเจมเสริมใหม่':''}${o.lv===CAP?' · เปิดช่องแปรสภาพที่ 2!':''}</span>`);render(true);};

/* ---------- totem shrine: carve (random gem) · craft from shards (the gem you choose) · dismantle spare copies ---------- */
let wsTab='carve',wsRes='';
const wsEl=win.querySelector('#tgWs');
function pickQ(){D.pity=(D.pity||0)+1;const x=Math.random();let q=x<QUAL[2].p?2:x<QUAL[2].p+QUAL[1].p?1:0;if(D.pity>=(C.pity||20))q=2;if(q===2)D.pity=0;return q;}
function gain(k,q){const o=D.own[k];if(!o){D.own[k]={lv:1,q,lines:rollLines(q),dup:0};return 'new';}
  if(q>(o.q||0)){o.q=q;o.lines=rollLines(q);o.dup=(o.dup||0)+1;return 'up';}   /* a better copy replaces quality + lines (level stays); the old one becomes a spare */
  o.dup=(o.dup||0)+1;return 'dup';}
function resHtml(k,q,how){const S=G('SKILLS')[k];return `<img class="pop" src="${gemImg(k)}" onerror="this.onerror=null;this.src='assets/icons/${HERO}/${k}.webp'" alt=""><div>${qTag(q)} <b style="color:${QUAL[q].c}">${S.name}</b><br><small>${how==='new'?'ได้เจมใหม่!':how==='up'?'คุณภาพดีกว่าเดิม — แทนที่ (เลเวลเดิมอยู่) เม็ดเก่ากลายเป็นเจมซ้ำ':'ได้เจมซ้ำ +1 (ใช้ทะลุขีด / ย่อยเป็นชิ้นส่วน)'}</small></div>`;}
const tierKeys=t=>cKeys().filter(k=>G('SKILLS')[k].tier===t);
const icn=(id,need)=>{const a=AF(),h=a&&a.ui?a.ui.etcIcon(id,22):'',have=bagN(id);return `<span class="ic ${have<need?'no':''}" title="${a?a.ui.etcName(id):id}">${h}${fmtN(have)}/${need}</span>`;};
function wsBuild(){if(!wsEl.classList.contains('open'))return;const S=G('SKILLS');let body='';
  if(wsTab==='carve'){body=[1,2,3,4].map(t=>{const ks=tierKeys(t),z=C.carveZ(t),ok=bagN('tstone'+t)>=C.carveStones&&zeny()>=z&&ks.length;
      return `<div class="row"><div class="nm"><b>หินโทเท็มขั้น ${t}</b> → เจมขั้น ${t} (สุ่ม 1 ใน ${ks.length}: ${ks.map(k=>S[k].name).join(' · ')})</div>${icn('tstone'+t,C.carveStones)}<span class="ic">${fmtN(z)}z</span><button class="go" data-carve="${t}" ${ok?'':'disabled'}>⛏ แกะ</button></div>`;}).join('')
      +`<div class="note">คุณภาพสุ่ม: ธรรมดา 70% (1 บรรทัด) · หายาก 25% (2) · ตำนาน 5% (3) · แกะครบ ${C.pity||20} ครั้งไม่ได้ตำนาน ครั้งถัดไปได้แน่นอน (ตอนนี้ ${D.pity||0}/${C.pity||20}) · หินขั้น 1 ดรอปจากมอน Lv 1–29, ขั้น 2 Lv 30–59, ขั้น 3 Lv 60–89, ขั้น 4 Lv 90+ · หาเพิ่มที่ตลาดกลาง (หมวดเจม/โทเท็ม)</div>`;}
  else if(wsTab==='craft'){body=`<div class="gg">${cKeys().map(k=>{const t=S[k].tier,z=C.craftZ(t),ok=bagN('tfrag'+t)>=C.craftFrag&&zeny()>=z;
      return `<div class="gc"><img src="${gemImg(k)}" onerror="this.onerror=null;this.src='assets/icons/${HERO}/${k}.webp'" alt=""><div><b>${S[k].name}</b><br>ขั้น ${t} · ${icn('tfrag'+t,C.craftFrag)} · ${fmtN(z)}z</div><button class="go" data-craft="${k}" ${ok?'':'disabled'}>คราฟต์</button></div>`;}).join('')}</div>
      <div class="note">เลือกชนิดเจมเองได้ (คุณภาพยังสุ่มและนับรวมแต้มตำนาน) · ชิ้นส่วนได้จากการย่อยเจมซ้ำ หรือซื้อที่ตลาดกลาง</div>`;}
  else{const ks=cKeys().filter(k=>D.own[k]&&D.own[k].dup>0);body=ks.length?`<div class="gg">${ks.map(k=>{const t=S[k].tier;
      return `<div class="gc"><img src="${gemImg(k)}" onerror="this.onerror=null;this.src='assets/icons/${HERO}/${k}.webp'" alt=""><div><b>${S[k].name}</b><br>เจมซ้ำ ×${D.own[k].dup} → ชิ้นส่วนขั้น ${t} ${C.dismFrag} + แก่น ${C.dismEss}</div><button class="go" data-dism="${k}">ย่อย 1</button></div>`;}).join('')}</div>`:'<div class="note">ยังไม่มีเจมซ้ำ</div>';
    body+=`<div class="note">เก็บเจมซ้ำไว้ใช้ทะลุขีดเลเวล 10 / 20 / 30 / 40 (ใช้ 1 / 1 / 2 / 2 เม็ด) — ย่อยเฉพาะที่เหลือ</div>`;}
  wsEl.innerHTML=`<div style="display:flex;align-items:center;gap:8px"><h4>⛏ ศาลโทเท็ม</h4><span class="note" style="margin-left:auto">แก่น ${fmtN(bagN('tess'))} · ${fmtN(zeny())}z</span><button class="go" id="wsX">✕ กลับแผง</button></div>
    <div class="tabs">${[['carve','⛏ แกะหิน (สุ่ม)'],['craft','🔨 คราฟต์จากชิ้นส่วน (เลือกได้)'],['dism','♻ ย่อยเจมซ้ำ']].map(([k,n])=>`<button data-wt="${k}" class="${wsTab===k?'on':''}">${n}</button>`).join('')}</div>
    <div class="res">${wsRes||'<span class="note">ผลการแกะ / คราฟต์จะแสดงที่นี่</span>'}</div>${body}`;
  wsEl.querySelector('#wsX').onclick=()=>{wsEl.classList.remove('open');render();};
  wsEl.querySelectorAll('[data-wt]').forEach(b=>b.onclick=()=>{wsTab=b.dataset.wt;wsRes='';wsBuild();});
  wsEl.querySelectorAll('[data-carve]').forEach(b=>b.onclick=()=>{const t=+b.dataset.carve,ks=tierKeys(t),z=C.carveZ(t);if(bagN('tstone'+t)<C.carveStones||!ks.length||!payZ(z))return;
    bagAdd('tstone'+t,-C.carveStones);bagSave();const k=ks[Math.floor(Math.random()*ks.length)],q=pickQ(),how=gain(k,q);save();wsRes=resHtml(k,q,how);wsBuild();});
  wsEl.querySelectorAll('[data-craft]').forEach(b=>b.onclick=()=>{const k=b.dataset.craft,t=G('SKILLS')[k].tier,z=C.craftZ(t);if(bagN('tfrag'+t)<C.craftFrag||!payZ(z))return;
    bagAdd('tfrag'+t,-C.craftFrag);bagSave();const q=pickQ(),how=gain(k,q);save();wsRes=resHtml(k,q,how);wsBuild();});
  wsEl.querySelectorAll('[data-dism]').forEach(b=>b.onclick=()=>{const k=b.dataset.dism,o=D.own[k];if(!o||!(o.dup>0))return;const t=G('SKILLS')[k].tier;o.dup--;bagAdd('tfrag'+t,C.dismFrag);bagAdd('tess',C.dismEss);bagSave();save();
    wsRes=`<span>♻ ย่อย ${G('SKILLS')[k].name} → ชิ้นส่วนขั้น ${t} +${C.dismFrag} · แก่น +${C.dismEss}</span>`;wsBuild();});}
win.querySelector('#tgWsB').onclick=()=>{wsEl.classList.add('open');wsRes='';wsBuild();};

function fit(){const m=win.querySelector('#tgMid');const s=Math.max(.3,Math.min(m.clientWidth,m.clientHeight)/BS);board.style.transform=`scale(${s})`;}
function open(){D=load();sel=null;win.classList.add('open');fit();render();info('เลือกเจมทางขวา แล้วแตะดาวบนแผง · ดาวใหญ่ = เจมหลัก · ดาวขอบรูน = แปรสภาพ · ดาวเล็ก = เจมเสริม · เส้นทางดาวเปิดเพิ่มทุก 10 เลเวล');win.classList.add('open');last=performance.now();cancelAnimationFrame(raf);raf=requestAnimationFrame(loop);}
function close(){win.classList.remove('open');}
addEventListener('resize',()=>{if(win.classList.contains('open'))fit();});
addEventListener('keydown',e=>{if(e.key==='Escape'&&win.classList.contains('open'))close();
  if((e.key==='g'||e.key==='G')&&!/INPUT|TEXTAREA/.test((e.target&&e.target.tagName)||''))win.classList.contains('open')?close():open();});
(function addBtn(){const mg=document.getElementById('mgrid');if(!mg||!mg.children.length){setTimeout(addBtn,300);return;}if(mg.querySelector('[data-m="tgem"]'))return;
  const b=document.createElement('button');b.dataset.m='tgem';b.title='กลุ่มดาวโทเท็ม (G)';
  b.innerHTML=`<span class="kb">G</span><img src="${BD}sock_main.webp" alt="" draggable="false" style="width:100%;height:100%;object-fit:contain">`;
  b.addEventListener('click',e=>{e.stopPropagation();e.stopImmediatePropagation();open();},true);mg.appendChild(b);})();

/* =====================================================================
   COMBAT HOOKS (design step 2–3) — generic for every hero
   • A socketed main gem = its C skill is learned (LV[k]=1); no C points any more. Unsocketed C skills are off.
     window.__GEMS_ALL=1 keeps every C skill on (old bench setup).
   • The mutation + supports of a gem work on its TARGET skill: the gem itself when it is a cast skill, else the
     cast skill it upgrades (last cast skill named in its requirement; TGT_OVR fixes odd ones). A passive with no
     cast parent (e.g. Endless Chain → Wolf Combo) targets normal attacks at half strength, no cooldown/SP effects.
   • Gem level: target skill power ×(1 + 0.03 per level above 1).
   • Hooks wrap hurt / castSkillNow / addBuff / ENH_ABSORB / canRaise / skChange; the per-frame work runs in one
     core fx (re-added if the bench clears fx).
   ===================================================================== */
const TGT_OVR={wolf:{stormChain:'thunderFang'}};
let ACT={},lastSig='';const REC={},STK={},NB={},LASTC={};let curCast=null,GU={sh:0,shT:0,guardT:0,rageT:0,drT:0,drV:0,allT:-99};
const now=()=>G('gameTime')||0,plv=()=>(G('PS')||{}).lv||1;
function targetOf(k){const S=G('SKILLS'),s=S[k],o=(TGT_OVR[HERO]||{})[k];if(o&&S[o])return o;if(!s.passive&&s.make)return k;
  const rq=s.rq||'';let best=null,bi=-1;for(const q in S){const t=S[q];if(t.br==='C'||t.passive||!t.make||!t.name)continue;const i=rq.lastIndexOf(t.name);if(i>bi){bi=i;best=q;}}
  return best||'@auto';}
const tgtName=t=>t==='@auto'?'ท่าตีธรรมดา (ผลครึ่งเดียว · ไม่มีผลกับคูลดาวน์/SP)':((G('SKILLS')[t]||{}).name||t);
function apply(){const S=G('SKILLS'),LV=G('LV');if(!S||!LV)return;let chg=false;
  if(!window.__GEMS_ALL)for(const k of cKeys()){const i=D.sock.indexOf(k),on=i>=0&&sockOpen(i)&&tierOK(k)&&!!D.own[k],w=on?1:0;if((LV[k]||0)!==w){LV[k]=w;chg=true;}}
  const sig=JSON.stringify([D.sock,D.mods,D.own,cKeys().map(k=>LV[k])]);if(sig===lastSig&&!chg)return;lastSig=sig;   /* rebuild only on change: ACT keeps its hit / cast counters */
  for(const k in S){const s=S[k];if(s._gb){s.mp=s._gb.mp;s.cd=s._gb.cd;delete s._gb;}}
  ACT={};
  const tgt=D.sock.map(k=>k&&LV[k]&&D.own[k]?targetOf(k):null);
  D.sock.forEach((k,i)=>{if(!k||!LV[k]||!D.own[k])return;const t=targetOf(k);if(t!=='@auto'&&!S[t])return;const m=D.mods[k]||[];
    const A=ACT[t]||(ACT[t]={gems:[],lv:1,mut:[],sup:[],n:0,casts:0,ln:{},elem:0,next:null,socks:[]});A.gems.push(k);A.lv=Math.max(A.lv,D.own[k].lv||1);A.socks.push(i);
    m.forEach((id,j)=>{if(id&&modOpen(k,j))(isMutJ(j)?A.mut:A.sup).push(id);});
    /* random lines (gem farming v2): ranks add up per line kind on the target skill */
    for(const l of (D.own[k].lines||[]))A.ln[l[0]]=(A.ln[l[0]]||0)+l[1];
    const lr=(D.own[k].lines||[]).find(l=>l[0]==='lelem');if(lr){const my=[m[0],m[3]].filter(Boolean);let c=0;for(const d of [-1,1]){const kn=D.sock[(i+d+NS)%NS],mm=kn&&D.mods[kn]||[];if(my.some(x=>x===mm[0]||x===mm[3]))c++;}A.elem+=.03*lr[1]*c;}
    if((D.own[k].lines||[]).some(l=>l[0]==='lnext')){for(let d=1;d<NS;d++){const tn=tgt[(i+d)%NS];if(tn&&tn!==t){A.next=tn;break;}}}});
  for(const t in ACT){if(t==='@auto')continue;const A=ACT[t],s=S[t];s._gb={mp:s.mp,cd:s.cd};const has=id=>A.mut.includes(id)||A.sup.includes(id);
    if(typeof s.cd==='number'){let cd=s.cd;if(has('heavy'))cd+=4;if(has('rapid'))cd*=.6;if(has('quick'))cd-=Math.min(1.5,cd*.2);   /* −1.5 s, at most a fifth of the cooldown (short skills would double up) */s.cd=Math.round(cd*10)/10;}
    if(typeof s.cd==='number'&&A.ln.lcd){s.cd=Math.round((s.cd-Math.min(.2*A.ln.lcd,s.cd*.2))*10)/10;}   /* line: cooldown −0.2 s per rank, at most a fifth */
    if(typeof s.mp==='number'){let mp=s.mp;if(has('heavy'))mp+=10;if(has('thrift'))mp=Math.max(0,mp-6);if(A.ln.lsp)mp=Math.max(0,mp-A.ln.lsp);s.mp=mp;}
    if(has('stack')){if(!STK[t])STK[t]={ch:2,rT:0};}else delete STK[t];}
  for(const t in STK)if(!ACT[t])delete STK[t];
  if(chg){try{G('buildHotbar')();}catch(e){}try{G('buildLevels')();}catch(e){}}}
const has=(A,id)=>A.mut.includes(id)||A.sup.includes(id);
function rec(key,fresh){let R=REC[key];if(fresh||!R||now()-R.t>(key==='@auto'?3:6))R=REC[key]={t:now(),first:null,hits:0,sp:0,heal:0,sum:0,tg:new Set(),third:false,chainAt:0,buffs:[]};return R;}
/* hit on behalf of a skill outside its own frame (echo, chains, pillar): set SKCTX so damage type + KO follow the skill */
function gh(e,m,key,x){if(!e||e.dead)return 0;const old=window.SKCTX;window.SKCTX=key==='@auto'?null:key;let d=0;try{d=hurt(e,m,Object.assign({_gem:1,skill:key==='@auto'?undefined:key,auto:key==='@auto'},x||{}));}catch(err){}window.SKCTX=old;return d;}
function mut(A,auto){let pm=1+gemPowOf(A.lv);const M={heavy:1.5,rapid:.65,stack:.8,fire:.7,ice:.8,volt:.8,guard:.8,rage:1.3,siphon:.85,spread:.75};for(const id of A.mut)if(M[id])pm*=M[id];return pm;}
function freeze(e,d){const s=e.st;if(!s)return;d=e.boss?d*.5:d;s.frozen=Math.max(s.frozen||0,d);s.slow=Math.max(s.slow||0,d+1);}

/* ---- damage ---- */
const _hurt=G('hurt');
if(_hurt)window.hurt=hurt=function(e,mult,o){o=o||{};if(o._gem||o.dot||!e||e.dead||!Object.keys(ACT).length)return _hurt(e,mult,o);
  const pa=G('player');const auto=!!o.auto,key=auto?'@auto':(o.skill||window.SKCTX||(pa&&pa.action&&pa.action.skill)||null);const A=key&&ACT[key];if(!A)return _hurt(e,mult,o);
  ensureCore();const R=rec(key);let m=mult;if(has(A,'force'))m+=auto?.075:.15;let pm=mut(A,auto);
  {const L=A.ln,h=auto?.5:1,st=e.st||{};let add=0;   /* random lines on the gem: flat additions to the hit (half on normal attacks) */
    if(L.lpow)add+=.03*L.lpow;if(L.lfirst&&!R.hits)add+=.15*L.lfirst;if(L.lboss&&(e.boss||(e.m&&e.m.role==='brute')))add+=.06*L.lboss;
    if(L.lsts&&(st.slow>0||st.stun>0||st.frozen>0||st.stagger>0||st.bleed>0||st.burn>0||st.poison>0||e._gBurn||e._gFlat))add+=.06*L.lsts;
    if(A.elem)add+=A.elem;const nb=NB[key];if(nb&&nb.u>now())add+=nb.v;m+=add*h;}
  if(A.mut.includes('focus')){if(!R.first)R.first=e;pm*=e===R.first?1.6:.4;}
  if(R.third)pm*=1.5;if(auto)pm=1+(pm-1)/2;
  let mon=e.m,dd=0;{const pv=(has(A,'pierce')?20:0)+4*(A.ln.lpier||0);if(pv&&mon&&mon.def){dd=Math.min(mon.def,pv);mon.def-=dd;}}
  let dmg=0;try{dmg=_hurt(e,m*pm,o);}finally{if(dd)mon.def+=dd;}
  if(!(dmg>0))return dmg;A.n++;R.hits++;R.sum+=m*pm;R.tg.add(e);const hm=m*pm,L=plv(),pl=G('player');
  if(A.ln.lslow&&A.n%4===0)G('applyCC')(e,{slow:1+.3*A.ln.lslow});
  if(A.ln.lkill&&(e.dead||e.hp<=0)&&!auto)pl.mp=Math.min(pl.maxMp,pl.mp+2*A.ln.lkill);
  if(A.ln.lpush&&!e.boss){const tag=R.hits;TIM.push({at:now()+.3,f:()=>{if(R.hits!==tag||e.dead)return;const a=Math.atan2(e.y-pl.y,e.x-pl.x),v=40+30*Math.min(5,A.ln.lpush);e.vx=(e.vx||0)+Math.cos(a)*v;e.vy=(e.vy||0)+Math.sin(a)*v;}});}
  if(has(A,'spread')||has(A,'splash')){const f=(A.mut.includes('spread')?.35:0)+(A.sup.includes('splash')?.3:0),r=A.mut.includes('spread')?80:70;
    for(const t of G('enemiesInCircle')(e.x,e.y,r))if(t!==e)gh(t,hm*f,key);}
  if(A.mut.includes('fire')){{const o=e._gBurn;e._gBurn={n:4,nt:o?o.nt:now()+1,m:Math.max(o?o.m:0,hm*.35/4),key};}   /* refresh keeps the tick timer, else fast hits would postpone every tick */}
  if(A.sup.includes('burn')){const o=e._gFlat;e._gFlat={n:3,nt:o?o.nt:now()+1,v:L,key};}
  if(A.mut.includes('ice')){G('applyCC')(e,{slow:2});if(A.n%4===0)freeze(e,.6);}
  if(A.sup.includes('frost')){if(A.n%3===0)G('applyCC')(e,{slow:2});if(A.n%6===0)freeze(e,.8);}
  if(A.sup.includes('impact')&&A.n%5===0){G('applyCC')(e,{stun:.5});try{G('koHit')(e,3,{skill:key==='@auto'?undefined:key,koMul:2});}catch(err){}}
  if(A.mut.includes('siphon')&&R.sp<12){const v=Math.min(2,12-R.sp);R.sp+=v;pl.mp=Math.min(pl.maxMp,pl.mp+v);}
  if(A.sup.includes('leech')&&R.heal<10){R.heal++;pl.hp=Math.min(pl.maxHp,pl.hp+L);}
  if(A.mut.includes('volt')||A.sup.includes('chain')){R.lastE=e;R.lastM=hm;R.chainAt=now()+.3;}
  if(A.sup.includes('echo')&&!auto)TIM.push({at:now()+.5,f:()=>{if(!e.dead){gh(e,hm*.35,key,{label:'ECHO',labelColor:'#c9b4ff'});}}});
  return dmg;};

/* ---- casting ---- */
const _cast=G('castSkillNow');
if(_cast)window.castSkillNow=castSkillNow=function(key,c){const A=ACT[key];if(!A)return _cast(key,c);ensureCore();
  const S=G('SKILLS'),pl=G('player'),st=STK[key];
  if(PIL.some(p=>p.key===key)){G('msg')('เสาโทเท็มกำลังร่ายท่านี้อยู่');return false;}
  const R=rec(key,true);A.casts++;R.third=has(A,'third')&&A.casts%3===0;curCast=key;let ok=false;try{ok=_cast(key,c);}finally{curCast=null;}
  if(!ok)return ok;const L=plv();
  if(R.third)G('addFx')(new (G('DText'))({x:pl.x,y:pl.y,z:110,text:'×3!',color:'#ffb13b',size:14,life:.9}));
  if(st){st.ch=Math.max(0,st.ch-1);if(st.rT<=0)st.rT=(S[key].cd||1)*1.25;pl.cd[key]=st.ch>0?0:st.rT;}
  if(A.mut.includes('guard')){GU.sh=L*4;GU.shT=now()+5;GU.guardT=now()+3;ring(pl.x,pl.y,'#c9ccd8',60);}
  {const N=A.ln;   /* random lines on cast */
    if(N.lshd){GU.sh=Math.max(GU.sh,L*.4*N.lshd);GU.shT=now()+5;}
    if(N.lheal)pl.hp=Math.min(pl.maxHp,pl.hp+L*.3*N.lheal);
    if(N.ldr){GU.drT=now()+1.5;GU.drV=Math.max(GU.drT>now()?GU.drV:0,L*.1*N.ldr);}
    if(N.lfree&&!st){const ev=N.lfree>=5?4:N.lfree>=3?5:6;if(A.casts%ev===0){pl.cd[key]=0;G('addFx')(new (G('DText'))({x:pl.x,y:pl.y,z:120,text:'FREE!',color:'#9fe0ff',size:13,life:.9}));}}
    if(N.lnext&&A.next)NB[A.next]={v:.05*N.lnext,u:now()+5};
    LASTC[key]=now();if(N.lall&&now()-GU.allT>20){const T=Object.keys(ACT).filter(t=>t!=='@auto');if(T.every(t=>LASTC[t]&&now()-LASTC[t]<=20)){GU.allT=now();GU.sh=Math.max(GU.sh,L*N.lall);GU.shT=now()+6;ring(pl.x,pl.y,'#ffd27a',90);}}}
  if(A.mut.includes('rage')){GU.rageT=now()+3;ring(pl.x,pl.y,'#e2435a',60);}
  if(A.mut.includes('totem')){const p={key,f:Math.min(.45,Math.max(.12,2.2/Math.max(1,S[key].cd||5))),x:pl.x+Math.cos(pl.phi||0)*-30,y:pl.y+Math.sin(pl.phi||0)*-30,n:4,nt:now()+2,R,born:now()};PIL.push(p);pl.cd[key]=Math.max(pl.cd[key]||0,8+(S[key].cd||0));}
  /* skills that hit nothing within 0.9 s count as buff skills → the support gems' buff-side effect */
  TIM.push({at:now()+.9,f:()=>{if(R.hits)return;const e0=G('enemiesInCircle')(pl.x,pl.y,90);
    if(A.sup.includes('splash')){GU.sh=Math.max(GU.sh,L*3);GU.shT=now()+5;}
    if(A.sup.includes('burn'))for(const e of e0)e._gFlat={n:3,nt:now()+1,v:L,key};
    if(A.sup.includes('frost'))for(const e of e0)G('applyCC')(e,{slow:2});
    if(A.sup.includes('leech'))pl.hp=Math.min(pl.maxHp,pl.hp+L*3);
    if(A.sup.includes('impact'))for(const e of e0)G('applyCC')(e,{flinch:.4}),e.vx+=Math.cos(Math.atan2(e.y-pl.y,e.x-pl.x))*160,e.vy+=Math.sin(Math.atan2(e.y-pl.y,e.x-pl.x))*160;
    if(A.sup.includes('third')&&R.third&&!st)pl.cd[key]=0;}});
  return ok;};
const _buff=G('addBuff');
if(_buff)window.addBuff=addBuff=function(k,dur){const key=curCast||window.SKCTX,A=key&&ACT[key];
  if(A){let x=0;if(A.sup.includes('echo'))x+=3;for(const id of['force','chain','pierce'])if(A.sup.includes(id))x+=2;dur+=x;const R=REC[key];if(R)R.buffs.push([k,dur]);}
  return _buff(k,dur);};
const _acc=G('applyCC');
if(_acc)window.applyCC=applyCC=function(e,cc){const key=curCast||window.SKCTX,A=key&&ACT[key];if(A&&A.ln&&A.ln.ldur&&cc){cc=Object.assign({},cc);for(const f of ['stun','flinch','slow'])if(cc[f])cc[f]+=.2*A.ln.ldur;}return _acc(e,cc);};
const _abs=window.ENH_ABSORB;
window.ENH_ABSORB=function(d){const t=now(),L=plv();if(GU.guardT>t)d=Math.max(0,d-L*.5);if(GU.drT>t)d=Math.max(0,d-GU.drV);if(GU.rageT>t)d+=L*.6;if(GU.sh>0&&GU.shT>t){const a=Math.min(GU.sh,d);GU.sh-=a;d-=a;}return _abs?_abs(d):d;};
/* the skill tree no longer takes C points: tapping a C node opens this board */
const _cr=G('canRaise');if(_cr)window.canRaise=canRaise=function(k){const s=G('SKILLS')[k];if(s&&s.br==='C'&&!window.__GEMS_ALL)return false;return _cr(k);};
const _skc=G('skChange');if(_skc)window.skChange=skChange=function(k,d){const s=G('SKILLS')[k];if(s&&s.br==='C'&&!window.__GEMS_ALL){open();return;}return _skc(k,d);};

/* ---- one fx for everything that runs per frame: burns, chains, echoes, totem pillars, charges ---- */
const TIM=[],PIL=[];
function ring(x,y,c,r){try{G('addFx')(new (G('GRing'))({x,y,r0:8,r1:r,w:8,color:c,life:.4}));}catch(e){}}
class GemZap{constructor(a,b,c){this.a={x:a.x,y:a.y};this.b={x:b.x,y:b.y};this.c=c;this.t=0;this.layer='top';}
  update(dt){this.t+=dt;return this.t<.25;}
  draw(){const P=G('P'),ctx=G('ctx');const [x1,y1]=P(this.a.x,this.a.y,30),[x2,y2]=P(this.b.x,this.b.y,30);ctx.save();ctx.globalAlpha=1-this.t/.25;ctx.strokeStyle=this.c;ctx.lineWidth=3;ctx.shadowColor=this.c;ctx.shadowBlur=10;
    ctx.beginPath();ctx.moveTo(x1,y1);for(let i=1;i<6;i++){const k=i/6;ctx.lineTo(x1+(x2-x1)*k+(Math.random()-.5)*14,y1+(y2-y1)*k+(Math.random()-.5)*14);}ctx.lineTo(x2,y2);ctx.stroke();ctx.restore();}}
const CORE={layer:'sorted',sy:0,_gemCore:1,
  update(dt){const t=now(),S=G('SKILLS'),pl=G('player'),en=G('enemies')||[];
    for(let i=TIM.length-1;i>=0;i--)if(t>=TIM[i].at){const f=TIM[i].f;TIM.splice(i,1);try{f();}catch(e){}}
    for(const e of en){if(e.dead)continue;
      const b=e._gBurn;if(b&&t>=b.nt){b.n--;b.nt=t+1;gh(e,b.m,b.key,{dot:true});try{G('sparks')(e.x,e.y,30,-Math.PI/2,3,'#ff7a2a',80,.6);}catch(er){}if(b.n<=0)e._gBurn=null;}
      const f=e._gFlat;if(f&&t>=f.nt){f.n--;f.nt=t+1;e.hp-=f.v;try{G('dmgNum')(e.x,e.y,40,f.v,'hit',{who:e});}catch(er){}if(e.hp<=0&&!e.dead)G('kill')(e);if(f.n<=0)e._gFlat=null;}}
    for(const key in REC){const R=REC[key],A=ACT[key];if(!A||!R.chainAt||t<R.chainAt)continue;R.chainAt=0;const src=R.lastE;if(!src)continue;
      const f=(A.mut.includes('volt')?.4:0)+(A.sup.includes('chain')?.3:0);let from=src;
      const pool=en.filter(o=>!o.dead&&o!==src&&Math.hypot(o.x-src.x,o.y-src.y)<170).sort((p,q)=>Math.hypot(p.x-src.x,p.y-src.y)-Math.hypot(q.x-src.x,q.y-src.y)).slice(0,2);
      for(const o of pool){G('addFx')(new GemZap(from,o,A.mut.includes('volt')?'#5ad1ff':'#bfe8ff'));gh(o,R.lastM*f,key);from=o;}}
    for(let i=PIL.length-1;i>=0;i--){const p=PIL[i];if(t<p.nt)continue;p.nt=t+2;p.n--;const R=p.R;ring(p.x,p.y,'#d9a441',150);
      if(R.hits){const m=R.sum/Math.max(1,R.tg.size)*p.f;   /* ×0.45 at most; long-cooldown skills get less (the pillar would out-cast the skill) */for(const e of G('enemiesInCircle')(p.x,p.y,150).slice(0,4))gh(e,m,p.key,{label:'TOTEM',labelColor:'#ffd27a'});}
      else for(const [k,d] of R.buffs)_buff(k,Math.min(d,2.5));
      if(p.n<=0)PIL.splice(i,1);}
    const cdm=(G('D')||{}).cdMul||1;
    for(const k in STK){const st=STK[k];if(st.ch<2){st.rT-=dt/cdm;if(st.rT<=0){st.ch++;st.rT=st.ch<2?(S[k].cd||1)*1.25:0;}}pl.cd[k]=st.ch>0?0:Math.max(.01,st.rT);}
    this.sy=PIL.length?PIL[0].y:-1e9;return true;},
  draw(){if(!PIL.length)return;const P=G('P'),ctx=G('ctx'),t=now();
    for(const p of PIL){const [x,y]=P(p.x,p.y,0),h=58,a=Math.min(1,(t-p.born)*4);ctx.save();ctx.globalAlpha=a;
      ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(x,y,14,5,0,0,7);ctx.fill();
      const cols=['#8a4b2a','#c94a3a','#e9b44c','#3a8a7a'];for(let i=0;i<4;i++){ctx.fillStyle=cols[i];ctx.fillRect(x-7,y-h+i*h/4,14,h/4);}
      ctx.strokeStyle='#3a1f14';ctx.lineWidth=2;ctx.strokeRect(x-7,y-h,14,h);
      ctx.fillStyle='#ffe9a0';ctx.shadowColor='#ffd27a';ctx.shadowBlur=12+6*Math.sin(t*6);ctx.beginPath();ctx.arc(x,y-h-6,5,0,7);ctx.fill();ctx.restore();}}};
function ensureCore(){const f=G('fx');if(f&&!f.includes(CORE))f.push(CORE);}
setInterval(()=>{if(!localStorage.getItem(SKEY))D=load();apply();if(Object.keys(ACT).length||PIL.length)ensureCore();},400);
setTimeout(apply,50);
window.totemGems={open,close,data:()=>D,apply,act:()=>ACT,targetOf,key:SKEY};
})();
