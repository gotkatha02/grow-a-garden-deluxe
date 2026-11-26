/* =====================================================================
   TOTEM LEGEND — CREATE CHARACTER (12 Tails style, owner 2026-11-19). Loaded after progress.js.
   First visit (no hero saved yet) or "start a new game": pick a hero on the 12 Tails select stage (owner 2026-11-24:
   the chosen hero big in colour, the others pale black-and-white shadows behind), then name it and roll its base stats
   (unlimited rerolls, radar chart), Okay → the game reloads as that hero.
   Stage art: assets/heroes/<hero>/select.webp (tools/select_cut.py, list SELA); without one: tree art vignette / silhouette.
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
 {k:'drake',n:'Forgeborn Drake',r:'Dragon Smith',land:'กรีก',home:'grkT',d:'ลูกมังกรช่างตีเหล็กจากเตาใต้ภูเขาไฟเอตนา ไฟเผาให้ร้อนแล้วหินชุบ สู้จนเลือดมังกรเต็มแล้วแปลงร่างเป็นมังกร',A:"Etna's Magma Blade · ชุบแล้วระเบิดลาวา แปลงเป็นมังกรลาวา",B:'Stone Oracle of Delphi · ชุบแล้วเป็นหิน แปลงเป็นมังกรภูผายักษ์'}];
const SN={str:'STR',agi:'AGI',vit:'VIT',int:'INT',dex:'DEX',luk:'LUK'},ORDER=['str','agi','vit','int','dex','luk'];   /* RO stats (2026-11-22): the hero bonus roll, hexagon */
const anySave=()=>{try{for(const h of HEROES){const o=JSON.parse(localStorage.getItem('af_prog_v1_'+h.k)||'{}');if(o.mode)return true;}}catch(e){}return false;};
function roll(k){const b=Object.assign({},CLASS_BASE[k]||CLASS_BASE.wolf);for(let i=0;i<3;i++)b[ORDER[Math.floor(Math.random()*6)]]++;for(let i=0;i<3;i++)b[ORDER[Math.floor(Math.random()*6)]]--;
  for(const s of ORDER)b[s]=Math.max(3,Math.min(12,b[s]+1));return b;}
const PORT={wukong:'assets/heroes/wukong/portrait.webp',drake:'assets/heroes/drake/portrait.webp',sheep:'assets/heroes/sheep/portrait.webp'};   /* heroes without tree art yet: a crop of the owner's design sheet */
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
/* 12 Tails hero select stage (owner 2026-11-24): the chosen hero big and in colour, the others pale black-and-white shadows behind */
@font-face{font-family:TLScript;src:url(assets/fonts/Fondamento-Italic-latin.woff2) format('woff2');font-style:italic;font-weight:400;font-display:swap}
@property --lc{syntax:'<color>';inherits:true;initial-value:#fff3dc}
#ccov .ccs{position:absolute;inset:0;overflow:hidden;touch-action:pan-y;background:radial-gradient(ellipse 85% 100% at 45% 42%,#fffdf8 0%,#faf1df 50%,#eddcb8 100%);--lc:#fff3dc;transition:--lc .6s}
#ccov .ccs-glow{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse var(--gw,30%) var(--gh,62%) at var(--gx,34%) var(--gy,46%),var(--lc) 0%,color-mix(in srgb,var(--lc) 45%,transparent) 48%,transparent 74%);transition:background-position .6s}
#ccov .ccf{position:absolute;left:0;top:0;transform-origin:50% 0;opacity:0;will-change:transform,opacity;cursor:pointer;-webkit-tap-highlight-color:transparent}
#ccov .ccs.anim .ccf{transition:transform .6s cubic-bezier(.22,.78,.24,1),opacity .5s ease}
#ccov .ccs.anim .ccf.nt{transition:none}
#ccov .ccf img,#ccov .ccf>i,#ccov .ccf svg{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;user-select:none;-webkit-user-drag:none;pointer-events:none}
#ccov .ccf .g{filter:grayscale(1) contrast(.52) brightness(1.24);transition:opacity .5s ease}
#ccov .ccf .c{opacity:0;transition:opacity .5s ease}
#ccov .ccf.on{cursor:default}#ccov .ccf.on .g{opacity:0}#ccov .ccf.on .c{opacity:1;animation:ccBr 3.8s ease-in-out .6s infinite}
#ccov .ccf .sh{inset:auto 22% .4% 22%;height:5%;border-radius:50%;background:radial-gradient(closest-side,rgba(70,45,20,.34),rgba(70,45,20,0));opacity:0;transition:opacity .5s}#ccov .ccf.on .sh{opacity:1}
@keyframes ccBr{50%{transform:translateY(-.55%)}}
#ccov .ccf.card>i{inset:3% 1% 1%;background:50% 86%/cover no-repeat;-webkit-mask-image:radial-gradient(ellipse 50% 50% at 50% 56%,#000 58%,transparent 100%);mask-image:radial-gradient(ellipse 50% 50% at 50% 56%,#000 58%,transparent 100%)}
#ccov .ccf.sil svg{opacity:.32;transition:opacity .5s}#ccov .ccf.sil.on svg{opacity:.85}
#ccov .ccf .todo{position:absolute;left:10%;right:10%;bottom:9%;text-align:center;font:800 14px Sarabun,sans-serif;color:#5a3a14;background:rgba(255,248,232,.85);border:2px dashed #b88a4a;border-radius:10px;padding:4px 6px;opacity:0;transition:opacity .4s}
#ccov .ccf.on .todo{opacity:1}
#ccov .cc-arr{position:absolute;top:50%;width:44px;height:68px;margin-top:-40px;border:0;background:none;padding:0;cursor:pointer;z-index:8;filter:drop-shadow(0 2px 2px rgba(40,25,10,.45));transition:transform .15s;-webkit-tap-highlight-color:transparent}
#ccov .cc-arr svg{width:100%;height:100%;display:block}#ccov .cc-arr.l{left:1.4%}#ccov .cc-arr.r{right:1.4%}#ccov .cc-arr.r svg{transform:scaleX(-1)}
#ccov .cc-arr:hover{transform:scale(1.1)}#ccov .cc-arr:active{transform:scale(.92)}
#ccov .cc-info{position:absolute;right:5.5%;top:11%;width:min(410px,37%);z-index:6;text-align:center}
#ccov .cc-info.in{animation:ccIn .4s ease}
@keyframes ccIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
#ccov .cc-info .box{background:rgba(255,252,244,.74);-webkit-backdrop-filter:blur(2px);backdrop-filter:blur(2px);border:2px solid rgba(176,132,70,.75);border-radius:10px;padding:13px 18px 12px;color:#3a2410;line-height:1.6;font-size:15px;
  box-shadow:0 0 0 4px rgba(255,255,255,.4),0 6px 18px rgba(60,40,20,.18)}
#ccov .cc-info .ln{display:inline-block;margin:0 0 6px;padding:2px 12px;border-radius:20px;background:#3a2410;color:#f6d58a;font-size:12px;font-weight:700}
#ccov .cc-info .st{margin-top:8px;font-size:13px;text-align:left;color:#5a3a14}#ccov .cc-info .st b{color:#a8501c}
#ccov .cc-info .go{margin-top:10px}#ccov #ccgo{background:linear-gradient(#7a4a1e,#4a2a10);color:#ffe9b8;border-color:#2a1808;box-shadow:0 0 0 2px #c8903e inset,0 3px 0 #2a1808;padding:6px 26px}
#ccov .cc-name{font:italic 400 64px TLScript,Georgia,serif;color:#5a3a14;text-align:left;padding-left:12%;margin-top:6px;line-height:.92;letter-spacing:.01em;
  text-shadow:2px 0 0 #fff,-2px 0 0 #fff,0 2px 0 #fff,0 -2px 0 #fff,1.5px 1.5px 0 #fff,-1.5px -1.5px 0 #fff,1.5px -1.5px 0 #fff,-1.5px 1.5px 0 #fff,0 6px 12px rgba(70,45,20,.38)}
#ccov .cc-name small{display:block;font-size:.56em;padding-left:22%;color:#7a5a2a}
#ccov .cc-dots{position:absolute;right:5.5%;width:min(410px,37%);bottom:9px;display:flex;flex-wrap:wrap;justify-content:center;gap:6px;z-index:7}
#ccov .cc-dots i{width:9px;height:9px;border-radius:50%;background:#c8a878;border:1px solid #5a3a14;cursor:pointer;transition:transform .2s,background .2s}#ccov .cc-dots i.on{background:#a8501c;transform:scale(1.35)}
/* phone held sideways: a short stage */
#ccov .ccs.short .cc-info{top:4%;right:7.5%;width:min(400px,41%)}#ccov .ccs.short .cc-info .box{padding:6px 12px 7px;line-height:1.38;font-size:12.5px}
#ccov .ccs.short .cc-info .ln{margin-bottom:3px;font-size:11px}#ccov .ccs.short .cc-info .st{margin-top:4px;font-size:11.5px}#ccov .ccs.short .cc-info .go{margin-top:5px}
#ccov .ccs.short #ccgo{padding:3px 18px;font-size:13px}#ccov .ccs.short .cc-name{font-size:38px;margin-top:3px}
#ccov .ccs.short .cc-arr{width:34px;height:52px;margin-top:-30px}#ccov .ccs.short .cc-dots{bottom:5px;gap:5px;right:7.5%;width:min(400px,41%)}#ccov .ccs.short .cc-dots i{width:7px;height:7px}
/* phone held upright: hero on top, the card below */
#ccov .ccs.tall .cc-info{left:4%;right:4%;width:auto;top:auto;bottom:24px}#ccov .ccs.tall .cc-dots{left:4%;right:4%;width:auto;bottom:7px}#ccov .ccs.tall .cc-info .box{font-size:13px;padding:8px 12px;line-height:1.45}
#ccov .ccs.tall .cc-name{position:absolute;left:0;right:0;bottom:100%;margin:0 0 4px;padding-left:6%;font-size:44px}#ccov .ccs.tall .cc-name small{padding-left:24%}
#ccov .ccs.tall .cc-arr{top:30%;width:36px;height:56px}
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
}
@media (max-width:760px){#ccov .cc{height:min(900px,97vh)}#ccov .cc-form{flex-direction:column;overflow:auto;max-height:100%;padding:10px}#ccov .cc-left{width:auto}#ccov .cc-pv{width:auto}#ccov .cc-card{min-height:160px}}`;
document.head.appendChild(css);
const ov=document.createElement('div');ov.id='ccov';document.body.appendChild(ov);ov.addEventListener('pointerdown',e=>e.stopPropagation());ov.addEventListener('keydown',e=>e.stopPropagation());
let idx=Math.max(0,HEROES.findIndex(h=>h.k===CHAR)),stats=null,closable=false;
function frame(body,foot){ov.innerHTML=`<div class="cc"><div class="cc-hd"><b>Create Character</b></div><div class="cc-bd">${body}</div><div class="cc-ft">${foot}</div></div>`;ov.style.display='flex';}
/* 12 TAILS HERO SELECT (owner 2026-11-24 'ทำหน้าเลือกตัวแบบ12หาง … ตัวไหนไม่ได้เลือกจะเป็นเงาๆขาวดำอยู่ด้านหลัง'):
   the owner's full-body pictures assets/heroes/<hero>/select.webp (720×960, one scale for all, transparent) stand on a stage —
   the chosen hero big and in colour, its neighbours as pale black-and-white shadows behind on both sides; ‹ › / swipe /
   ← → keys / a tap on a shadow / the dots turn the line like a carousel. Heroes without a picture yet: their tree art in a
   soft vignette, else a plain silhouette (raven). Hippo 2026-11-24: his front three-quarter view of the new look. */
const SELA=['wolf','rhino','owl','jaguar','axolotl','croc','cat','dragon','wukong','kitsune','bastet','anubis','sheep','lion','drake','hippo'];
const LANDC={'นอร์ส':'#c6e6f8','แอซเท็ก':'#ffd9a0','ญี่ปุ่น':'#fbcfdc','อียิปต์':'#f8de98','กรีก':'#d6defb'};
const ARR=`<svg viewBox="0 0 44 68"><defs><linearGradient id="ccag" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffeab0"/><stop offset=".48" stop-color="#d9a24a"/><stop offset="1" stop-color="#8e5a1c"/></linearGradient></defs>
  <path d="M38 4 L5 34 L38 64 L29 34 Z" fill="url(#ccag)" stroke="#3a2410" stroke-width="3.2" stroke-linejoin="round"/><path d="M31 15 L14 34 L31 53" fill="none" stroke="#fff4d2" stroke-width="2" stroke-linecap="round" opacity=".75"/>
  <circle cx="29" cy="34" r="3.2" fill="#fff4d2" stroke="#3a2410" stroke-width="1.6"/></svg>`;
const SIL=`<svg viewBox="0 0 300 400"><path fill="#3a2a1a" d="M96 40 L118 92 Q150 78 182 92 L204 40 L214 100 Q232 124 230 150 Q228 196 186 212 L214 236 Q236 252 244 300 L250 352 L206 352 L200 320 L196 378 Q196 392 182 392 L162 392 L158 340 L142 340 L138 392 L118 392 Q104 392 104 378 L100 320 L94 352 L50 352 L56 300 Q64 252 86 236 L114 212 Q72 196 70 150 Q68 124 86 100 Z"/>
  <text x="150" y="176" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="96" fill="#f6ead0" opacity=".85">?</text></svg>`;
const SELV={wolf:2,rhino:2,anubis:2,dragon:2,owl:2,jaguar:2,croc:2,cat:2};   /* bump a hero's number when its select.webp is replaced (cache) — wolf 2 = Fenrir's Heir big pose, rhino 2 = Glacier Titan big pose, anubis 2 = Anubis Reborn big pose, dragon 2 = Thunder Palm Sage big pose, owl 2 = Snowy Owl Reborn big pose, jaguar 2 = Eclipse Dancer big pose, 2026-11-24 · croc 2 = Lake Predator big pose, 2026-11-25 · cat 2 = Nekomata Wanderer big pose, 2026-11-26 */
const selSrc=k=>SELA.includes(k)?`assets/heroes/${k}/select.webp?v=${SELV[k]||1}`:null;
function selFig(h,i){const s=selSrc(h.k);
  if(s)return `<div class="ccf" data-i="${i}"><i class="sh"></i><img class="g" src="${s}" alt="" draggable="false" decoding="async"><img class="c" src="${s}" alt="" draggable="false" decoding="async"></div>`;
  const a=art(h.k);
  if(a)return `<div class="ccf card" data-i="${i}"><i class="g" style="background-image:url(${a})"></i><i class="c" style="background-image:url(${a})"></i><b class="todo">ภาพเต็มตัวกำลังวาด</b></div>`;
  return `<div class="ccf sil" data-i="${i}">${SIL}<b class="todo">ภาพ ${h.n}<br>กำลังวาด</b></div>`;}
let FIGS=[],OFF=[],swT=0;
function selOff(i){const N=HEROES.length;let o=((i-idx)%N+N)%N;if(o>N/2)o-=N;return o;}
/* where each figure stands: off 0 = the chosen one; ±1, ±2 = shadows; |off| ≥ 3 = hidden just outside */
function place(anim){const st=ov.querySelector('#ccs');if(!st)return;const W=st.clientWidth,H=st.clientHeight;if(!W||!H)return;
  const tall=W/H<1.15;st.classList.toggle('tall',tall);st.classList.toggle('short',!tall&&H<400);
  let bh,cx0,y0,S;
  if(tall){bh=Math.min(H*.6,W*1.18);cx0=W*.5;y0=H*.012;const u=bh;
    S={0:[0,1,0,1,5],1:[.6*u,1.1,-.03*H,.55,3],2:[1.12*u,1.18,-.05*H,0,2],3:[1.6*u,1.24,-.06*H,0,1]};}
  else{bh=H*.985;const bw=bh*.75;cx0=Math.max(bw*.55,W*(st.classList.contains('short')?.51:.555)-H*.3);y0=H*.012;const u=H;
    S={0:[0,1,0,1,5],'-1':[-.56*u,1.2,-.075*H,.56,3],'-2':[-1.1*u,1.34,-.13*H,.38,2],'-3':[-1.72*u,1.45,-.16*H,0,1],
       1:[.88*u,1.2,-.075*H,.56,3],2:[1.52*u,1.34,-.13*H,.38,2],3:[2.2*u,1.45,-.16*H,0,1]};}
  const bw=bh*.75;
  FIGS.forEach((f,i)=>{const o=selOff(i),c=Math.max(-3,Math.min(3,o));let p=S[c]||S[Math.abs(c)];if(tall&&c<0)p=[-p[0],p[1],p[2],p[3],p[4]];
    const cx=cx0+p[0],y=c===0?y0:p[2];
    const jump=anim&&OFF[i]!==undefined&&Math.abs(OFF[i]-o)>6;f.classList.toggle('nt',jump);
    f.style.width=bw+'px';f.style.height=bh+'px';f.style.transform=`translate(${(cx-bw/2).toFixed(1)}px,${y.toFixed(1)}px) scale(${p[1]})`;
    f.style.opacity=p[3];f.style.zIndex=p[4];f.style.pointerEvents=p[3]>0?'auto':'none';f.classList.toggle('on',o===0);OFF[i]=o;});
  st.style.setProperty('--gx',(cx0/W*100).toFixed(1)+'%');st.style.setProperty('--gy',((y0+bh*.48)/H*100).toFixed(1)+'%');
  st.style.setProperty('--gw',(bw*.78/W*100).toFixed(1)+'%');st.style.setProperty('--gh',(bh*.56/H*100).toFixed(1)+'%');
  st.style.setProperty('--lc',LANDC[HEROES[idx].land]||'#fff3dc');}
function selInfo(anim){const h=HEROES[idx],el=ov.querySelector('#ccinfo');if(!el)return;
  el.innerHTML=`<div class="box"><span class="ln">${h.land} · ${h.r}</span><div class="ds">${h.d}</div><div class="st">A: ${window.ROLES?ROLES.chip(h.k,'A'):''}<b>${h.A}</b><br>B: ${window.ROLES?ROLES.chip(h.k,'B'):''}<b>${h.B}</b></div>
    <div class="go"><button class="cb" id="ccgo">Create Hero</button></div></div><div class="cc-name">${h.n.split(' ').slice(-1)[0]}<small>${h.r}</small></div>`;
  if(anim){el.classList.remove('in');void el.offsetWidth;el.classList.add('in');}
  ov.querySelectorAll('.cc-dots i').forEach((d,i)=>d.classList.toggle('on',i===idx));
  el.querySelector('#ccgo').onclick=()=>{const h=HEROES[idx];if(h.k!==CHAR){try{localStorage.setItem('af_cc_pending',JSON.stringify({k:h.k,closable}));}catch(e){}go(h.k);return;}stats=roll(h.k);form();};}   /* the form shows the hero's own sprite, so the game loads that hero first */
function selGo(i){const N=HEROES.length;i=(i%N+N)%N;if(i===idx)return;idx=i;place(true);selInfo(true);}
function pick(){
  frame(`<div class="ccs" id="ccs"><div class="ccs-glow"></div>${HEROES.map(selFig).join('')}
      <button class="cc-arr l" id="ccprev" aria-label="ก่อนหน้า">${ARR}</button><button class="cc-arr r" id="ccnext" aria-label="ถัดไป">${ARR}</button>
      <div class="cc-info" id="ccinfo"></div>
      <div class="cc-dots">${HEROES.map((x,i)=>`<i data-i="${i}" title="${x.n}"></i>`).join('')}</div></div>`,
    `${closable?'<button class="cb dark" id="ccclose">Close</button>':''}<button class="cb dark" data-m="test" id="cctest" title="Lv ${window.LV_CAP||99} ทุกสกิล สำหรับทดสอบ">🧪 โหมดทดสอบ</button>`);
  const st=ov.querySelector('#ccs');FIGS=[...st.querySelectorAll('.ccf')];OFF=[];
  ov.querySelector('#ccprev').onclick=()=>selGo(idx-1);ov.querySelector('#ccnext').onclick=()=>selGo(idx+1);
  ov.querySelectorAll('.cc-dots i').forEach(d=>d.onclick=()=>selGo(+d.dataset.i));
  FIGS.forEach(f=>f.onclick=()=>{if(performance.now()-swT<350)return;selGo(+f.dataset.i);});
  let sx=null,sy=0;
  st.addEventListener('pointerdown',e=>{if(e.target.closest('button,.cc-info,.cc-dots'))return;sx=e.clientX;sy=e.clientY;});
  st.addEventListener('pointerup',e=>{if(sx===null)return;const dx=e.clientX-sx,dy=e.clientY-sy;sx=null;
    if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy)*1.2){swT=performance.now();selGo(idx+(dx<0?1:-1));}});
  st.addEventListener('pointercancel',()=>{sx=null;});
  ov.querySelector('#cctest').onclick=()=>startTest(HEROES[idx].k);
  const c=ov.querySelector('#ccclose');if(c)c.onclick=()=>{ov.style.display='none';};
  selInfo(false);place(false);requestAnimationFrame(()=>requestAnimationFrame(()=>st.classList.add('anim')));}
window.addEventListener('keydown',e=>{if(ov.style.display==='none'||!ov.querySelector('#ccs'))return;
  if(e.target&&/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName))return;
  if(e.key==='ArrowLeft'||e.key==='ArrowRight')selGo(idx+(e.key==='ArrowLeft'?-1:1));
  else if(e.key==='Enter'){if(e.target&&e.target.tagName==='BUTTON')return;const b=ov.querySelector('#ccgo');if(b)b.click();}
  else if(e.key==='Escape'&&closable)ov.style.display='none';
  else return;
  e.preventDefault();e.stopPropagation();},true);
window.addEventListener('resize',()=>{const st=ov.querySelector('#ccs');if(!st||ov.style.display==='none')return;st.classList.remove('anim');place(false);requestAnimationFrame(()=>st.classList.add('anim'));});
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
    const S=2.8/(window.META_K||1),old=ctx;ctx=g;g.setTransform(S,0,0,S,0,0);try{const e={st:'idle',d,f},FG=typeof drawGear==='function';if(FG)drawGear(e,120/S,262/S,0,false);drawFrame(e,120/S,262/S,1);if(FG)drawGear(e,120/S,262/S,1,false);}finally{ctx=old;}}catch(err){}
  spRaf=requestAnimationFrame(spLoop);}
function go(k){location.href=location.pathname+'?char='+k;}
function create(h,name,st){try{if(h.k===CHAR&&window.AFProgress&&AFProgress.lock)AFProgress.lock();localStorage.setItem('af_prog_v1_'+h.k,JSON.stringify({mode:'play',save:{map:h.home},roll:st,name}));localStorage.removeItem('af_items_v1_'+h.k+'_play');localStorage.setItem('af_char',h.k);}catch(e){}go(h.k);}
/* test mode keeps the hero's play progress in its save (2026-11-26: it used to erase it; ▶ เล่นต่อ brings it back) */
function startTest(k){try{let o={};try{o=JSON.parse(localStorage.getItem('af_prog_v1_'+k)||'{}')||{};}catch(e){}
  o.mode='test';if(!o.save)o.save={map:(HEROES.find(h=>h.k===k)||{}).home||'frostheim'};localStorage.setItem('af_prog_v1_'+k,JSON.stringify(o));localStorage.setItem('af_char',k);}catch(e){}
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
