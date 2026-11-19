/* =====================================================================
   AETHERFALL — LEVEL ZONES (Ragnarok-style). One table decides the level of every map.
   Loaded after all region map files; rewrites at load time:
     • every monster level range in VK_MONS (stats come from level, so difficulty follows)
     • the map's level label (VK_MAPS[id].lv → map list / HUD)
     • every warp label "… Lv a–b" so signposts match the new levels
   Design
     • EVERY town is a start town. Around each town the level rises with the number of warps
       you walk from it: maps next to town are Lv 1–10, side branches / dungeons go up to Lv 80
       (dungeon floors count as one step deeper).
     • TRAVEL ROUTES stay low: the maps on the shortest way from a town to the capital
       (and the capital fields that join the regions) are capped at ROUTE levels, so a young
       character can walk to another town.
     • High fields of every region: E1 78–86, E2 83–90.
     • ENDGAME: every town's big dungeon (D2 floors 1–3) and the capital's Aether Rift are
       Lv 90–99. Later each one will drop its own item line (drops not designed yet).
   Extra monsters and roles are added afterwards by maps/monster-roster.js.
   To retune: edit FIELD / ROUTE / LATE / FIXED below; nothing else needs to change.
   ===================================================================== */
(function(){
const TOWN={vik:'frostheim',azt:'aztT',grk:'grkT',egy:'egyT',jpn:'jpnT'};
const FIELD=[1,80];                                                            // non-route maps of a region, spread near → far
const ROUTE={1:[1,10],2:[10,20],3:[18,28],4:[25,35]};                         // route maps by warps from town: lowest of their distance, close to their neighbours
const LATE={E1:[78,86],E2:[83,90],D2a:[90,93],D2b:[93,96],D2c:[96,99]};      // same for every region (endgame dungeon = D2)
const FIXED={cN:[25,35],cW:[25,35],cS:[25,35],cE:[25,35],cNE:[32,45],cSW:[32,45],   // capital fields carry on from the routes (F6 18–28 → 25–35)
cata1:[45,52],cata2:[52,60],rift1:[90,93],rift2:[93,96],rift3:[96,99]};
const ORDER=['F1','F2','F3','F4','F5','F6','D1a','D1b','H1','H2'];             // tie-break when two maps are equally far from town

const MAPS=window.VK_MAPS||{},MONS=window.VK_MONS||{};
/* warp graph (both directions) */
const adj={};const link=(a,b)=>{(adj[a]=adj[a]||new Set()).add(b);(adj[b]=adj[b]||new Set()).add(a);};
for(const id in MAPS)for(const w of (MAPS[id].warps||[]))link(id,w.to);
for(const w of (window.SNOWPINE_WARPS||[]))link('snowpine',w.to);
const regionOf=id=>id==='frostheim'||id==='snowpine'?'vik':id.slice(0,3);
const roleOf=id=>id==='snowpine'?'F1':id.slice(3);

const ZONE={},ROUTES={};
for(const p in TOWN){const town=TOWN[p],dist={[town]:0},par={},q=[town];
  while(q.length){const a=q.shift();for(const b of adj[a]||[])if(dist[b]==null&&regionOf(b)===p){dist[b]=dist[a]+1;par[b]=a;q.push(b);}}   // walk inside the region only
  /* route = shortest path from town to every map that warps out of the region (to the capital) */
  const route=new Set();
  for(const id in dist)if([...(adj[id]||[])].some(b=>regionOf(b)!==p&&MAPS[b]))for(let c=id;c&&c!==town;c=par[c])route.add(c);
  ROUTES[p]=[...route];
  const ids=Object.keys(dist).filter(id=>id!==town&&!LATE[roleOf(id)]);
  for(const id of ids)if(route.has(id))ZONE[id]=ROUTE[Math.min(4,dist[id])];
  const depth=id=>dist[id]+(/^D1/.test(roleOf(id))?1:0);
  const rest=ids.filter(id=>!route.has(id)).sort((a,b)=>depth(a)-depth(b)||ORDER.indexOf(roleOf(a))-ORDER.indexOf(roleOf(b)));
  const [lo,hi]=FIELD,w=(hi-lo)/Math.max(1,rest.length);
  rest.forEach((id,i)=>{ZONE[id]=[Math.round(lo+i*w),Math.min(hi,Math.round(lo+(i+1)*w+3))];});
  for(const s in LATE){const id=p+s;if(MAPS[id])ZONE[id]=LATE[s];}}
Object.assign(ZONE,FIXED);
window.MAP_ZONE=ZONE;window.MAP_ROUTES=ROUTES;

const txt=r=>r[0]+'–'+r[1];
/* monsters: map each entry's old range proportionally into the new range */
for(const id in MONS){const z=ZONE[id],L=MONS[id];if(!z||!Array.isArray(L)||!L.length)continue;
  const A=Math.min(...L.map(m=>m.lv[0])),B=Math.max(...L.map(m=>m.lv[1])),span=Math.max(1,B-A),f=v=>Math.round(z[0]+(v-A)/span*(z[1]-z[0]));
  for(const m of L){const a=f(m.lv[0]),b=Math.max(a,f(m.lv[1]));m.lv=[Math.max(1,a),Math.min(99,b)];}}
/* map level labels */
for(const id in MAPS)if(ZONE[id])MAPS[id].lv=txt(ZONE[id]);
/* warp labels: a floor label ("ชั้น …") shows that floor; a dungeon entrance shows the whole dungeon span */
const floors=id=>{const m=/^(.*D\d)([a-c])$/.exec(id);if(!m)return null;return ['a','b','c'].map(c=>m[1]+c).filter(k=>ZONE[k]);};
const labelRange=(to,label)=>{const z=ZONE[to];if(!z)return null;if(/ชั้น/.test(label))return z;const fl=floors(to);
  if(fl&&/a$/.test(to)&&fl.length>1){const all=fl.map(k=>ZONE[k]);return [Math.min(...all.map(r=>r[0])),Math.max(...all.map(r=>r[1]))];}
  if(/^cata1$/.test(to))return [ZONE.cata1[0],ZONE.cata2[1]];if(/^rift1$/.test(to))return [ZONE.rift1[0],ZONE.rift3[1]];return z;};
const fixWarps=c=>{for(const w of (c.warps||[])){if(!w.label||!/Lv\s*\d+\s*[–-]\s*\d+/.test(w.label))continue;const r=labelRange(w.to,w.label);if(r)w.label=w.label.replace(/Lv\s*\d+\s*[–-]\s*\d+/,'Lv '+txt(r));}};
for(const id in MAPS)fixWarps(MAPS[id]);
if(window.SNOWPINE_WARPS)fixWarps({warps:window.SNOWPINE_WARPS});
})();
