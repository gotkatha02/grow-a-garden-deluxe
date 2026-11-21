/* =========================================================================
   PROGRESSION BENCHMARK — dev tool (not loaded by the game)
   Open the game, F12 console, paste this file, run:  progressionBench()
   For each level it builds a typical player (stat points 45% ATK / 20% VIT / 12% DEF …) wearing
     exp   = crafted 7-piece set one step behind (item Lv ≈ player Lv − 5), refine +3, average special stats
     naked = no gear
     max   = item grade of that level, +10, every hole (weapon/armour 4, others 2) a max ATK orb, perfect 3 special stats
   and prints how many plain hits kill a normal monster of that level / how many monster hits kill the player.
   Targets (2026-11-16): exp ≈ 11–13 / 17–23 · naked ≈ 2× slower and dies faster → players must craft gear.
   ========================================================================= */
function progressionBench(){
  const sv={eq:{...EQ},inv:[...INV],ps:{...PS}},slots=['rhand','armor','top','shoes','acc'],towns=['vik','azt','grk','egy','jpn'];
  const setup=(L,mode,role)=>{const pts=pointsAt(L);PS.lv=L;Object.assign(PS,{atk:1+Math.round(pts*.45),tal:1,vit:1+Math.round(pts*.2),def:1+Math.round(pts*.12),int:1+Math.round(pts*.06),agi:1+Math.round(pts*.1),cha:1+Math.round(pts*.04),lck:1});fitStats();
    const m=monStats(L,role),res=[];for(const tw of (mode==='naked'?['x']:towns)){for(const k in EQ)EQ[k]=null;INV.length=0;
      if(mode!=='naked'){const g=mode==='max'?Math.min(9,Math.floor(L/10)):Math.max(0,Math.min(9,Math.floor((L-5)/10)));
        for(const s of slots){const id=AFItems.craftItem(tw,s,g),it=ITEMS[id];it.lvReq=1;it.ref=mode==='max'?10:3;
          const A=AFItems.AFF,code={rhand:'W',armor:'B',top:'T',shoes:'S',acc:'A'}[s],sc=.4+.6*g/9;
          const pool=Object.keys(A).filter(k=>A[k].s.includes(code)&&!['exp','zeny','drop'].includes(k));
          const pick=mode==='max'?pool.sort((a,b)=>A[b].max-A[a].max).slice(0,3).map(k=>({k,v:A[k].max*sc})):pool.slice(0,1).map(k=>({k,v:A[k].max*sc*.65*1.5}));   // ≈ an average roll: 1.5 stats at 65%
          it.aff=pick;it.x={};for(const a of pick)it.x[a.k]=a.v;
          if(mode==='max'){const n=(s==='rhand'||s==='armor')?4:2,t=L<30?1:L<60?2:L<90?3:4;it.sockets=n;it.orbs=Array.from({length:n},()=>({s:'atk',v:t*5,t}));}
          EQ[s==='acc'?'acc1':s]=id;}}
      applyStats();const e={boss:0,m,hp:m.hp,maxHp:m.hp,st:{}},o={auto:1};
      res.push([m.hp/(D.patk*defMul(m.def)*itemFx.dmgMul(e,o,false)),D.maxHp/((m.atk[0]+m.atk[1])/2*defMul(D.def)*(1-Math.min(.3,(BON.dmgRed||0)/100)))]);}
    const k=res.length;return `${Math.ceil(res.reduce((a,b)=>a+b[0],0)/k)} / ${Math.round(res.reduce((a,b)=>a+b[1],0)/k)}`;};
  const rows=[];for(const L of [1,10,20,29,30,45,59,60,75,89,90,99])rows.push({Lv:L,มีของ:setup(L,'exp'),ไม่มีของ:setup(L,'naked'),ของเต็ม:setup(L,'max'),มอนถึก:setup(L,'exp','brute'),มอนอ่อน:setup(L,'exp','critter')});
  for(const id of Object.keys(ITEMS))if(/^i\d+$/.test(id)&&ITEMS[id].crafted&&!sv.inv.includes(id)&&!Object.values(sv.eq).includes(id))delete ITEMS[id];
  for(const k in EQ)EQ[k]=sv.eq[k];INV.length=0;INV.push(...sv.inv);Object.assign(PS,sv.ps);applyStats();
  console.log('ตีมอนตาย (ที) / มอนตีเราตาย (ที)');console.table(rows);return rows;}
