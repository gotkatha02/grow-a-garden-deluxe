/* =====================================================================
   TOTEM LEGEND — CREATE CHARACTER (12 Tails style, owner 2026-11-19). Loaded after progress.js.
   First visit (no hero saved yet) or "start a new game": pick a hero from a big portrait carousel,
   then name it and roll its base stats (unlimited rerolls, radar chart), Okay → the game reloads as that hero.
   Portrait art: the hero's Basic skill-tree picture (SKILL_BG_ALL) until real portraits exist.
   ===================================================================== */
(function(){
if(!window.AFProgress||typeof CLASS_BASE==='undefined')return;
const HEROES=[
 {k:'wolf',n:'White Wolf',r:'Warrior',land:'นอร์ส',home:'frostheim',d:'นักรบขวานแห่งแดนหิมะ ฟันใกล้ตัวแรงและทน ใช้ได้ทั้งพลังขวานและเวทรูนน้ำแข็ง',A:'Berserker · ขวานคลั่ง ฟันรัว ดูดเลือด',B:'Runic · เวทรูน น้ำแข็ง สายฟ้า'},
 {k:'rhino',n:'Woolly Rhino',r:'Guardian',land:'นอร์ส',home:'frostheim',d:'แท้งก์ร่างยักษ์ ยืนรับดาเมจแทนเพื่อน ต่อยหนักจนศัตรูกระเด็น',A:'Iron Juggernaut · กำแพงเหล็ก ป้องกัน สวนกลับ',B:'Titan Breaker · หมัดยักษ์ ทุบพื้น'},
 {k:'owl',n:'Snowy Owl',r:'Marksman',land:'นอร์ส',home:'frostheim',d:'นักยิงหน้าไม้จากระยะไกล เล็งแม่น ซ่อนตัวในพายุหิมะ',A:'Moonlit Marksman · ยิงแม่น จุดอ่อน',B:'Snowstorm Trickster · หิมะ กับดัก ล่องหน'},
 {k:'raven',n:"Odin's Raven",r:'Rune Lancer',land:'นอร์ส',home:'frostheim',d:'อีกาของโอดินถือหอกรูน มีร่างแยก 2 ร่าง มูนินตีซ้ำตามจังหวะเรา ฮูกินเป็นจุดร่ายที่สอง',A:'Muninn · เก็บท่าลงความทรงจำ แล้วปล่อยซ้ำรวดเดียว',B:'Huginn · ส่งฮูกินไปร่ายรูนอีกมุม รูนครบระเบิดเอง'},
 {k:'jaguar',n:'Black Jaguar',r:'Assassin',land:'แอซเท็ก',home:'aztT',d:'นักฆ่ามีดคู่ออบซิเดียน เร็ว คริแรง ล่าเหยื่อในเงามืด',A:'Jaguar Fang · มีดคู่ เลือดไหล',B:'Eclipse Ritual · เวทสุริยคราส เงา พิษ'},
 {k:'axolotl',n:'Axolotl',r:'Tide Priest',land:'แอซเท็ก',home:'aztT',d:'นักบวชสายน้ำ ฮีลเก่ง ยิงลำน้ำแรงดันสูงจากระยะกลาง',A:'Pressure Weaver · เวทน้ำโจมตี',B:'Springkeeper · ฮีล โล่น้ำ'},
 {k:'croc',n:'Crocodile',r:'Lancer',land:'แอซเท็ก',home:'aztT',d:'นักรบหอกแห่งวิหาร แทงไกล ล็อกเหยื่อแล้วงับไม่ปล่อย',A:'Temple Lancer · หอกยาว ระยะ',B:'River Predator · งับ ม้วนตัว ลากลงน้ำ'},
 {k:'cat',n:'Ronin Cat',r:'Samurai',land:'ญี่ปุ่น',home:'jpnT',d:'ซามูไรพเนจรชักดาบเร็วดั่งลม หรือฟันหนักดั่งยักษ์',A:'Kaze Ronin · ชักดาบเร็ว ฟันต่อเนื่อง',B:'Oni Ronin · ฟันหนัก ทุบ'},
 {k:'dragon',n:'Azure Dragon',r:'Monk',land:'ญี่ปุ่น',home:'jpnT',d:'นักมวยมังกรสิงโต หมัดไหลดั่งคลื่น ฝ่ามือดั่งเมฆ',A:'Raging Tide Fist · หมัดต่อเนื่อง สะสมกระแส',B:'Cloud Dragon Palm · ฝ่ามือพลังลม ลูกแก้ว'},
 {k:'wukong',n:'Snow Monkey',r:'Yamabushi',land:'ญี่ปุ่น',home:'jpnT',d:'ลิงหิมะนักพรตภูเขา สวมห่วงที่วิญญาณหงอคงสิงอยู่ ยิ่งตีไว ร่างขนทองยิ่งปล่อยสกิลแทน',A:'Havoc in Heaven · อาละวาด ร่างขนโผล่หลังเป้า ล่าบอส',B:'Seventy-Two Transformations · ฝูงร่างขน ตีตาม ล่อมอน'},
 {k:'kitsune',n:'Nine-Tail Miko',r:'Shrine Mage',land:'ญี่ปุ่น',home:'jpnT',d:'มิโกะจิ้งจอกเก้าหาง ร่ายไฟจิ้งจอกและแสงจันทร์จากระยะไกล',A:'Kitsune-bi · ไฟจิ้งจอก สะสมหาง',B:'Moon Mirror · ลำแสงจันทร์ กระจก'},
 {k:'hippo',n:'Nile Hippo',r:'Bruiser',land:'อียิปต์',home:'egyT',d:'ฮิปโปจอมพลัง กระแทกด้วยพุงหรือเรียกน้ำท่วมแม่น้ำไนล์',A:'Taweret Guardian · กระแทก ป้องกัน',B:'Nile Flood Priest · น้ำ โคลน ฮีล'},
 {k:'bastet',n:'Bastet Priestess',r:'Curse Mage',land:'อียิปต์',home:'egyT',d:'นักบวชแมวแห่งคำสาป ร่ายคำสาปกัดกิน หรือเรียกผู้รับใช้จากสุสาน',A:'Hexweaver · คำสาปสะสม แล้วระเบิด',B:'Tomb Warden · เรียกมัมมี่ สคารับ อนูบิส'},
 {k:'anubis',n:'Anubis Jackal',r:'Flail Knight',land:'อียิปต์',home:'egyT',d:'หมาจิ้งจอกผู้เฝ้าดูอัต เหวี่ยงลูกตุ้มโซ่ หมุนรุม หรือเกี่ยวตัดสิน',A:'Flail Dervish · หมุน กวาด แรงเหวี่ยง',B:'Judge of the Dead · เกี่ยว ตรึง ตัดสิน'},
 {k:'sheep',n:'Golden Sheep',r:'Healer',land:'กรีก',home:'grkT',d:'แกะขนทองผู้รักษา ฮีลเพื่อนหรือสะกดศัตรูด้วยเพลง',A:'Asclepian Healer · ฮีล โล่',B:"Medea's Enchanter · สะกด หลับ คำสาป"},
 {k:'lion',n:'Olympian Lion',r:'Thunder Champion',land:'กรีก',home:'grkT',d:'สิงโตขาวนักมวยปล้ำแห่งโอลิมปัส ทุ่มศัตรู หรือเรียกสายฟ้าแบบซุส',A:'Olympian Pankration · จับ ทุ่ม ปล้ำ',B:'Thunder King · สายฟ้า หอก ประจุ'},
 {k:'drake',n:'Forgeborn Drake',r:'Dragon Smith',land:'กรีก',home:'grkT',d:'ลูกมังกรช่างตีเหล็กจากเตาใต้ภูเขาไฟเอตนา ไฟเผาให้ร้อนแล้วหินชุบ สู้จนเลือดมังกรเต็มแล้วแปลงร่างเป็นมังกร',A:"Etna's Magma Hammer · ชุบแล้วระเบิดลาวา แปลงเป็นมังกรลาวา",B:'Stone Oracle of Delphi · ชุบแล้วเป็นหิน แปลงเป็นมังกรภูผายักษ์'}];
const SN={str:'STR',agi:'AGI',vit:'VIT',int:'INT',dex:'DEX',luk:'LUK'},ORDER=['str','agi','vit','int','dex','luk'];   /* RO stats (2026-11-22): the hero bonus roll, hexagon */
const anySave=()=>{try{for(const h of HEROES){const o=JSON.parse(localStorage.getItem('af_prog_v1_'+h.k)||'{}');if(o.mode)return true;}}catch(e){}return false;};
function roll(k){const b=Object.assign({},CLASS_BASE[k]||CLASS_BASE.wolf);for(let i=0;i<3;i++)b[ORDER[Math.floor(Math.random()*6)]]++;for(let i=0;i<3;i++)b[ORDER[Math.floor(Math.random()*6)]]--;
  for(const s of ORDER)b[s]=Math.max(3,Math.min(12,b[s]+1));return b;}
const PORT={wukong:'assets/heroes/wukong/portrait.webp',drake:'assets/heroes/drake/portrait.webp'};   /* heroes without tree art yet: a crop of the owner's design sheet */
const art=k=>{try{return (SKILL_BG_ALL[k]&&SKILL_BG_ALL[k].basic)||PORT[k]||null;}catch(e){return PORT[k]||null;}};
function radar(st){const R=70,c=90,pts=ORDER.map((s,i)=>{const a=-Math.PI/2+i*Math.PI/3,v=(st[s]||0)/12;return [c+Math.cos(a)*R*v,c+Math.sin(a)*R*v];});
  const ring=f=>ORDER.map((s,i)=>{const a=-Math.PI/2+i*Math.PI/3;return `${c+Math.cos(a)*R*f},${c+Math.sin(a)*R*f}`;}).join(' ');
  const lab=ORDER.map((s,i)=>{const a=-Math.PI/2+i*Math.PI/3;return `<text x="${c+Math.cos(a)*(R+13)}" y="${c+Math.sin(a)*(R+13)+3}" text-anchor="middle">${SN[s]}</text>`;}).join('');
  return `<svg viewBox="0 0 180 180" class="cc-radar"><polygon points="${ring(1)}" class="g"/><polygon points="${ring(.66)}" class="g"/><polygon points="${ring(.33)}" class="g"/>
    ${ORDER.map((s,i)=>{const a=-Math.PI/2+i*Math.PI/3;return `<line x1="${c}" y1="${c}" x2="${c+Math.cos(a)*R}" y2="${c+Math.sin(a)*R}" class="g"/>`;}).join('')}
    <polygon points="${pts.map(p=>p.join(',')).join(' ')}" class="v"/>${lab}</svg>`;}
const css=document.createElement('style');css.textContent=`
#ccov{position:fixed;inset:0;z-index:70;display:none;align-items:center;justify-content:center;background:radial-gradient(ellipse at 50% 40%,#3a2a18,#120c08);font-family:Sarabun,Mali,sans-serif}
#ccov .cc{position:relative;width:min(1100px,98vw);height:min(680px,96vh);display:flex;flex-direction:column;border:6px solid #8a5a1e;border-radius:14px;
  background:linear-gradient(#f7ecd6,#efe0c2);box-shadow:0 0 0 3px #e8c27a inset,0 0 0 9px #3a2410,0 20px 60px rgba(0,0,0,.6);overflow:hidden}
#ccov .cc-hd{flex:none;text-align:center;padding:8px;background:linear-gradient(#c8903e,#8a5a1e);border-bottom:4px solid #e8c27a}
#ccov .cc-hd b{display:inline-block;padding:4px 40px;border-radius:30px;background:#f6ead0;border:3px solid #5a3a14;color:#3a2410;font:700 24px Cinzel,serif;letter-spacing:.04em}
#ccov .cc-bd{flex:1;position:relative;min-height:0;display:flex}
#ccov .cc-ft{flex:none;display:flex;justify-content:center;gap:10px;padding:8px;background:linear-gradient(#8a5a1e,#5a3a14);border-top:4px solid #e8c27a}
#ccov button.cb{border:3px solid #3a2410;border-radius:10px;background:linear-gradient(#f6d58a,#c8903e);color:#3a2410;font:800 15px Sarabun,sans-serif;padding:6px 22px;cursor:pointer;box-shadow:0 3px 0 #3a2410}
#ccov button.cb:active{transform:translateY(2px);box-shadow:0 1px 0 #3a2410}#ccov button.cb.dark{background:linear-gradient(#6a4a2a,#3a2410);color:#f6ead0;border-color:#e8c27a}
#ccov .cc-art{position:absolute;left:4%;top:0;bottom:0;width:58%;background-size:contain;background-repeat:no-repeat;background-position:50% 100%}

#ccov .cc-noart{position:absolute;left:8%;bottom:6%;width:36%;height:80%;display:flex;align-items:center;justify-content:center;border-radius:20px;border:3px dashed #b88a4a;color:#8a6a3a;font:700 16px Sarabun;text-align:center;background:rgba(255,255,255,.35)}
#ccov .cc-arrow{position:absolute;top:50%;transform:translateY(-50%);width:54px;height:54px;border-radius:50%;border:3px solid #3a2410;background:linear-gradient(#f6d58a,#c8903e);font:900 26px Sarabun;color:#3a2410;cursor:pointer;z-index:3}
#ccov .cc-info{position:absolute;right:5%;top:12%;width:min(400px,44%);z-index:2;text-align:center}
#ccov .cc-info .box{background:rgba(255,248,232,.92);border:2px solid #b88a4a;border-radius:12px;padding:14px 16px;color:#3a2410;line-height:1.6;font-size:15px;box-shadow:0 4px 16px rgba(0,0,0,.15)}
#ccov .cc-info .ln{display:inline-block;margin:0 0 6px;padding:2px 10px;border-radius:20px;background:#3a2410;color:#f6d58a;font-size:12px;font-weight:700}
#ccov .cc-info .st{margin-top:8px;font-size:13px;text-align:left;color:#5a3a14}#ccov .cc-info .st b{color:#a8501c}
#ccov .cc-name{font:italic 800 52px Cinzel,Georgia,serif;color:#5a3a14;text-shadow:0 2px 0 #fff,0 0 12px rgba(255,255,255,.8);margin-top:10px;line-height:1}
#ccov .cc-name small{display:block;font-size:30px;margin-top:4px;color:#7a5a2a}
#ccov .cc-dots{position:absolute;left:0;right:0;bottom:8px;display:flex;justify-content:center;gap:6px;z-index:2}
#ccov .cc-dots i{width:9px;height:9px;border-radius:50%;background:#c8a878;border:1px solid #5a3a14;cursor:pointer}#ccov .cc-dots i.on{background:#a8501c;transform:scale(1.3)}
#ccov .cc-form{position:relative;z-index:2;margin:auto;display:flex;gap:16px;padding:16px;border:5px solid #8a5a1e;border-radius:12px;background:linear-gradient(#e9d4a8,#d9bd88);box-shadow:0 0 0 2px #f6e2b6 inset,0 8px 30px rgba(0,0,0,.35)}
#ccov .cc-left{width:380px;background:rgba(255,248,232,.6);border:2px solid #b88a4a;border-radius:8px;padding:12px}
#ccov .cc-row{display:flex;align-items:center;gap:8px;margin-bottom:10px;font-weight:800;color:#3a2410}
#ccov .cc-row input{flex:1;height:30px;border:2px solid #8a6a4a;border-radius:6px;padding:0 8px;font:700 15px Sarabun;background:#fffaf0}
#ccov .cc-stats{display:flex;gap:10px;align-items:center}
#ccov .cc-stats table{border-collapse:collapse;font:800 15px Sarabun;color:#3a2410}#ccov .cc-stats td{padding:2px 6px}#ccov .cc-stats td.v{font-size:20px;width:30px;text-align:right}
#ccov .cc-stats td.k{width:44px;background:#5a3a14;color:#f6d58a;border-radius:4px;text-align:center;font-size:12px}
#ccov .cc-radar{width:190px;height:190px}#ccov .cc-radar .g{fill:none;stroke:#b8986a;stroke-width:1}#ccov .cc-radar .v{fill:rgba(226,87,76,.25);stroke:#e2574c;stroke-width:2}
#ccov .cc-radar text{font:700 9px Sarabun;fill:#5a3a14}
#ccov .cc-pv{width:300px;display:flex;flex-direction:column;gap:8px}
#ccov .cc-card{flex:1;border:3px solid #8a5a1e;border-radius:8px;background:#f6ead0 center 75%/cover no-repeat;min-height:300px;position:relative;overflow:hidden}
#ccov .cc-card .t{position:absolute;left:0;right:0;bottom:0;padding:6px;background:linear-gradient(transparent,rgba(58,36,16,.85));color:#f6ead0;font:800 14px Sarabun;text-align:center}
#ccov .cc-spr{background:radial-gradient(ellipse at 50% 85%,#fff6e0,#e9d4a8 70%)}#ccov .cc-spr canvas{position:absolute;left:50%;top:50%;transform:translate(-50%,-55%);width:240px;height:300px}
#ccov .cc-rot{position:absolute;bottom:36px;left:8px;width:34px;height:34px;border-radius:50%;border:2px solid #3a2410;background:linear-gradient(#f6d58a,#c8903e);font:900 18px Sarabun;cursor:pointer}#ccov .cc-rot.r{left:auto;right:8px}
#ccov .cc-pv .btns{display:flex;justify-content:flex-end;gap:8px}
#ccov .cc-hint{font-size:12px;color:#7a5a2a;margin-top:6px}
#ccov .cc-dye{margin-top:8px;border-top:1px dashed #b88a4a;padding-top:6px}
#ccov .cc-dr{display:flex;align-items:flex-start;gap:6px;margin-bottom:5px;font:800 13px Sarabun,sans-serif;color:#3a2410}
#ccov .cc-dr>span{flex:none;width:76px;padding-top:2px;line-height:1.15}#ccov .cc-dr>span small{display:block;font-weight:600;font-size:11px;color:#8a5a1e}
#ccov .cc-dr .sw{display:flex;flex-wrap:wrap;gap:4px}
#ccov .cc-dr button.s{width:21px;height:21px;border-radius:50%;border:2px solid #5a3a14;padding:0;cursor:pointer;box-shadow:inset 0 -3px 4px rgba(0,0,0,.18)}
#ccov .cc-dr button.s.on{box-shadow:0 0 0 2px #fff8e8,0 0 0 4px #e2574c}
#ccov .cc-dr input[type=color]{width:26px;height:23px;border:none;padding:0;background:none;cursor:pointer}
#ccov .cc-dye .cc-hint{margin-top:2px}
@media (max-height:520px) and (min-width:761px){#ccov .cc{height:98vh;border-width:4px}#ccov .cc-hd{padding:3px}#ccov .cc-hd b{font-size:16px;padding:1px 26px}#ccov .cc-ft{padding:2px;border-top-width:2px}
  #ccov .cc-form{max-height:calc(100% - 8px);overflow:auto;padding:8px;gap:10px;margin:4px auto}#ccov .cc-left{padding:8px;width:400px}#ccov .cc-row{margin-bottom:6px}
  #ccov .cc-radar{width:118px;height:118px}#ccov .cc-stats td{padding:0 5px}#ccov .cc-stats td.v{font-size:15px}#ccov .cc-left>.cc-hint{display:none}
  #ccov .cc-pv{width:210px}#ccov .cc-card{min-height:190px}#ccov .cc-spr canvas{width:176px;height:220px}#ccov .cc-rot{bottom:30px;width:30px;height:30px}
  #ccov .cc-left{width:490px}#ccov #ccroll{padding:3px 14px;font-size:13px}#ccov .cc-dye{margin-top:4px;padding-top:4px}
  #ccov .cc-dr{margin-bottom:3px;font-size:12px}#ccov .cc-dr>span{width:60px}#ccov .cc-dr>span small{font-size:10px}#ccov .cc-dr .sw{gap:3px}
  #ccov .cc-dr button.s{width:17px;height:17px;border-width:1.5px}#ccov .cc-dr input[type=color]{width:22px;height:18px}#ccov .cc-dye .cc-hint{font-size:11px}
  /* hero carousel on a phone held sideways: the big name ran into the footer buttons (2026-11-23) */
  #ccov .cc-info{top:4%;right:9%;width:min(400px,43%)}#ccov .cc-info .box{padding:7px 12px;line-height:1.4;font-size:13px}#ccov .cc-info .st{margin-top:4px;font-size:12px}#ccov .cc-name{font-size:30px;margin-top:5px}#ccov .cc-name small{font-size:17px;margin-top:2px}}
@media (max-width:760px){#ccov .cc-arrow{top:28%;width:44px;height:44px}#ccov .cc-info{right:3%;left:3%;width:auto;top:auto;bottom:40px}#ccov .cc-name{font-size:34px}#ccov .cc-name small{font-size:20px}#ccov .cc-info .box{font-size:13px;padding:8px}
  #ccov .cc-form{flex-direction:column;overflow:auto;max-height:100%;padding:10px}#ccov .cc-left{width:auto}#ccov .cc-pv{width:auto}#ccov .cc-card{min-height:160px}#ccov .cc-art{width:92%;opacity:.55}}`;
document.head.appendChild(css);
const ov=document.createElement('div');ov.id='ccov';document.body.appendChild(ov);ov.addEventListener('pointerdown',e=>e.stopPropagation());ov.addEventListener('keydown',e=>e.stopPropagation());
let idx=Math.max(0,HEROES.findIndex(h=>h.k===CHAR)),stats=null,closable=false;
function frame(body,foot){ov.innerHTML=`<div class="cc"><div class="cc-hd"><b>Create Character</b></div><div class="cc-bd">${body}</div><div class="cc-ft">${foot}</div></div>`;ov.style.display='flex';}
function pick(){const h=HEROES[idx],a=art(h.k);
  frame(`${a?`<div class="cc-art" style="background-image:url(${a})"></div>`:`<div class="cc-noart">ภาพ ${h.n}<br>กำลังวาด</div>`}
    <button class="cc-arrow" id="ccprev" style="left:2%">‹</button><button class="cc-arrow" id="ccnext" style="right:2%">›</button>
    <div class="cc-info"><div class="box"><span class="ln">${h.land} · ${h.r}</span><br>${h.d}<div class="st">A: <b>${h.A}</b><br>B: <b>${h.B}</b></div>
      <div style="margin-top:10px"><button class="cb" id="ccgo">Create Hero</button></div></div><div class="cc-name">${h.n.split(' ').slice(-1)[0]}<small>${h.r}</small></div></div>
    <div class="cc-dots">${HEROES.map((x,i)=>`<i class="${i===idx?'on':''}" data-i="${i}" title="${x.n}"></i>`).join('')}</div>`,
    `${closable?'<button class="cb dark" id="ccclose">Close</button>':''}<button class="cb dark" data-m="test" id="cctest" title="Lv ${window.LV_CAP||99} ทุกสกิล สำหรับทดสอบ">🧪 โหมดทดสอบ</button>`);
  ov.querySelector('#ccprev').onclick=()=>{idx=(idx+HEROES.length-1)%HEROES.length;pick();};ov.querySelector('#ccnext').onclick=()=>{idx=(idx+1)%HEROES.length;pick();};
  ov.querySelectorAll('.cc-dots i').forEach(d=>d.onclick=()=>{idx=+d.dataset.i;pick();});
  ov.querySelector('#ccgo').onclick=()=>{if(h.k!==CHAR){try{localStorage.setItem('af_cc_pending',JSON.stringify({k:h.k,closable}));}catch(e){}go(h.k);return;}stats=roll(h.k);form();};   /* the form shows the hero's own sprite, so the game loads that hero first */
  ov.querySelector('#cctest').onclick=()=>startTest(h.k);
  const c=ov.querySelector('#ccclose');if(c)c.onclick=()=>{ov.style.display='none';};}
function form(){const h=HEROES[idx],a=art(h.k);
  frame(`<div class="cc-form"><div class="cc-left"><div class="cc-row">Name <input id="ccname" maxlength="16" placeholder="Character Name" value="${(ov.dataset.name||'').replace(/"/g,'')}"></div>
      <div class="cc-stats"><table>${ORDER.map(s=>`<tr><td class="k">${SN[s]}</td><td class="v">${stats[s]}</td></tr>`).join('')}</table>${radar(stats)}</div>
      <div style="text-align:center;margin-top:6px"><button class="cb" id="ccroll">🎲 Random Stats</button></div>
      <div class="cc-hint">ค่าพื้นฐานของฮีโร่ตัวนี้ (3–12) สุ่มใหม่ได้ไม่จำกัด · เลเวลขึ้นแล้วค่านี้ช่วยให้สถานะโตเร็วขึ้น</div>${dyeRows(h)}</div>
    <div class="cc-pv"><div class="cc-card cc-spr"><canvas id="cccv" width="240" height="300"></canvas><button class="cc-rot" id="ccrl">‹</button><button class="cc-rot r" id="ccrr">›</button><div class="t">${h.n} · ${h.r}</div></div>
      <div class="btns"><button class="cb" id="ccok">Okay</button><button class="cb dark" id="cccancel">Cancel</button></div></div></div>`,'');
  const nm=ov.querySelector('#ccname');nm.oninput=()=>{ov.dataset.name=nm.value;};
  ov.querySelector('#ccrl').onclick=()=>{spDir=(spDir+1)%8;};ov.querySelector('#ccrr').onclick=()=>{spDir=(spDir+7)%8;};spLoop();
  ov.querySelector('#ccroll').onclick=()=>{stats=roll(h.k);form();};
  ov.querySelector('#cccancel').onclick=()=>{dyeUndo();pick();};
  ov.querySelector('#ccok').onclick=()=>{const name=(nm.value||'').trim();if(!name){nm.focus();nm.style.borderColor='#e2574c';return;}dyeKeep(h);create(h,name,stats);};
  dyeBind(h);
  setTimeout(()=>nm.focus(),50);}
/* FUR + OUTFIT COLOUR (owner 2026-11-23 'สีขนสีชุดตอนเลือกตัว'): heroes with dye masks (window.HERO_DYE from fashion.js — the wolf
   for now) pick them here; the face and hands keep their drawn colours. Live on the preview sprite; saved on Okay
   (af_fur_<hero> / af_cloth_<hero>, the same keys as the wardrobe, Alt+C), undone on Cancel. */
let dye=null,dyeT=false;
const DYE=h=>window.HERO_DYE&&HERO_DYE.ok&&h.k===CHAR?HERO_DYE:null;
const swBg=c=>!c?'linear-gradient(135deg,#f6c8d8 50%,#e8a8b8 50%)':c.includes('|')?`linear-gradient(135deg,${c.split('|')[0]} 50%,${c.split('|')[1]} 50%)`:c;
function dyeRows(h){const D=DYE(h);if(!D)return '';if(!dye)dye={f:D.fur||'',c:D.cloth||''};
  const nm=(L,v,def)=>(L.find(x=>x[0]===v)||[0,v?'สีที่เลือกเอง':def])[1];
  const row=(k,lab,L,cur,def,pk)=>`<div class="cc-dr" data-k="${k}"><span>${lab}<small>${nm(L,cur,def)}</small></span><div class="sw">${L.map(([c,n])=>
      `<button class="s${c===cur?' on':''}" data-v="${c}" title="${n}" style="background:${k==='c'&&!c?'linear-gradient(135deg,#a0582c 50%,#f0c89a 50%)':swBg(c)}"></button>`).join('')}<input type="color" value="${pk}" title="เลือกสีเอง"></div></div>`;
  return `<div class="cc-dye">${row('f','สีขน',D.FUR,dye.f,'สีเดิม',dye.f&&!dye.f.includes('|')?dye.f:'#f2c4d4')}${D.CLOTH?row('c','สีชุด',D.CLOTH,dye.c,'หนังเดิม',dye.c||'#a0582c'):''}
    <div class="cc-hint">หน้ากับมือคงสีเดิม · เปลี่ยนทีหลังได้ที่ตู้เสื้อผ้า</div></div>`;}
function dyeApply(h){const D=DYE(h);if(!D)return;dyeT=true;window.__DYE_PV=1;D.set(dye.f,dye.c);
  ov.querySelectorAll('.cc-dr').forEach(r=>{const k=r.dataset.k,cur=k==='f'?dye.f:dye.c,L=k==='f'?D.FUR:D.CLOTH;
    r.querySelectorAll('button.s').forEach(b=>b.classList.toggle('on',b.dataset.v===cur));
    r.querySelector('small').textContent=(L.find(x=>x[0]===cur)||[0,cur?'สีที่เลือกเอง':(k==='f'?'สีเดิม':'หนังเดิม')])[1];});}
function dyeBind(h){if(!DYE(h))return;
  ov.querySelectorAll('.cc-dr').forEach(r=>{const k=r.dataset.k;
    r.querySelectorAll('button.s').forEach(b=>b.onclick=()=>{dye[k]=b.dataset.v;dyeApply(h);});
    const pk=r.querySelector('input[type=color]');if(pk)pk.oninput=e=>{dye[k]=e.target.value;dyeApply(h);};});}
function dyeKeep(h){if(!DYE(h)||!dyeT)return;try{localStorage.setItem('af_fur_'+h.k,dye.f||'');localStorage.setItem('af_cloth_'+h.k,dye.c||'');}catch(e){}}
function dyeUndo(){const D=window.HERO_DYE;if(D&&dyeT)D.restore().then(()=>{window.__DYE_PV=0;});else window.__DYE_PV=0;dye=null;dyeT=false;}
/* sprite preview: the hero's idle animation, turned with the arrows (same drawing as the equipment window) */
let spDir=0,spRaf=0;const DIRS=['S','SW','W','NW','N','NE','E','SE'];
function spLoop(){cancelAnimationFrame(spRaf);const cv=document.getElementById('cccv');if(!cv||ov.style.display==='none')return;const g=cv.getContext('2d');
  try{g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,cv.width,cv.height);g.fillStyle='rgba(60,40,20,.2)';g.beginPath();g.ellipse(120,262,40,11,0,0,TAU);g.fill();
    const d=DIRS[spDir],D2=durs('idle',d),T=D2.reduce((a,b)=>a+b,0);let ms=performance.now()%T,f=0;while(f<D2.length-1&&ms>=D2[f]){ms-=D2[f];f++;}
    const S=2.8,old=ctx;ctx=g;g.setTransform(S,0,0,S,0,0);try{const e={st:'idle',d,f},FG=typeof drawGear==='function';if(FG)drawGear(e,120/S,262/S,0,false);drawFrame(e,120/S,262/S,1);if(FG)drawGear(e,120/S,262/S,1,false);}finally{ctx=old;}}catch(err){}
  spRaf=requestAnimationFrame(spLoop);}
function go(k){location.href=location.pathname+'?char='+k;}
function create(h,name,st){try{localStorage.setItem('af_prog_v1_'+h.k,JSON.stringify({mode:'play',save:{map:h.home},roll:st,name}));localStorage.removeItem('af_items_v1_'+h.k+'_play');localStorage.setItem('af_char',h.k);}catch(e){}go(h.k);}
function startTest(k){try{localStorage.setItem('af_prog_v1_'+k,JSON.stringify({mode:'test',save:{map:(HEROES.find(h=>h.k===k)||{}).home||'frostheim'}}));localStorage.setItem('af_char',k);}catch(e){}
  if(k===CHAR&&window.AFProgress&&AFProgress.setMode)AFProgress.setMode('test',true);else go(k);}
window.openCreate=(o={})=>{closable=!!o.closable;idx=Math.max(0,HEROES.findIndex(h=>h.k===CHAR));pick();};
window.CC_HEROES=HEROES;
/* first visit: the create screen replaces the mode picker */
if(!anySave()&&!AFProgress.mode&&!localStorage.getItem('af_cc_pending')){const hide=()=>document.querySelectorAll('body>div').forEach(d=>{if(d.style&&d.style.zIndex==='61'&&d.textContent.includes('เลือกโหมด'))d.style.display='none';});hide();openCreate();}
/* coming back from 'Create Hero' on another hero: open its form */
try{const pd=JSON.parse(localStorage.getItem('af_cc_pending')||'null');if(pd&&pd.k===CHAR){localStorage.removeItem('af_cc_pending');document.querySelectorAll('body>div').forEach(d=>{if(d.style&&d.style.zIndex==='61')d.style.display='none';});
  closable=!!pd.closable;idx=Math.max(0,HEROES.findIndex(h=>h.k===CHAR));stats=roll(CHAR);
  const open=()=>setTimeout(form,300);if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',open);else open();}}catch(e){}   /* after the page's scripts: fashion.js (colours) loads later than this file */
/* the hero's name on the HUD */
try{const o=JSON.parse(localStorage.getItem('af_prog_v1_'+CHAR)||'{}');if(o.name&&o.mode==='play'){const put=()=>{const b=document.querySelector('.nm b');if(b&&b.textContent!==o.name)b.textContent=o.name;};put();const b=document.querySelector('.nm b');if(b)new MutationObserver(put).observe(b,{childList:true,characterData:true,subtree:true});}}catch(e){}
})();
