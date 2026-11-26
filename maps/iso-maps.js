/* =====================================================================
   Isometric 2.5D maps like Ragnarok 3 (owner 2026-11-26, ISO_MAP_TH.md) — TEST ONLY: no warp leads here.
   isoSnow = the owner's ground picture ② (Frostpine Hollow, maps/iso/iso_floor_v1.webp, 1536×1024) laid over the whole map
   like the world-boss arenas (fieldmap.js groundImg): the plateau, stairs, cliffs and the frozen pond are painted in,
   the walk shapes below follow them (picture px × S). ?map=isoSnow in test mode · ?isok=1.2 tries another size
   (S = map px per picture px; heroes stand 57–64 map px tall).
   ===================================================================== */
(function(){
Object.assign(window.VK_CAT=window.VK_CAT||{},{isoFloor1:{t:'tex',d:'iso',f:'iso_floor_v1'}});
const S=+(new URLSearchParams(location.search).get('isok'))||1.5,W=Math.round(1536*S),H=Math.round(1024*S);
const P=a=>({p:a.map(v=>Math.round(v*S))});
/* picture px: the lower snowfield (path, pond ice), the plateau top, the carved stairs */
const LOW=[0,365,60,372,110,405,200,422,300,460,420,470,500,482,600,497,650,492,770,466,800,388,845,372,850,300,848,215,900,248,1000,246,1100,244,1200,234,1300,250,1400,262,1536,272,
  1536,712,1480,722,1400,740,1340,748,1280,758,1200,795,1110,826,1060,860,1000,890,900,930,790,985,720,1024,0,1024];
const TOP=[0,240,60,200,130,185,200,140,300,92,420,64,500,80,570,102,650,112,720,142,770,190,772,245,700,248,620,255,600,258,500,258,480,295,400,315,300,295,200,265,100,255,0,250];
const STAIRS=[495,250,602,250,772,466,648,496];
window.VK_MAPS=Object.assign(window.VK_MAPS||{},{
isoSnow:{name:'ป่าสนหิมะ Frostpine Hollow (ทดลอง iso)',lv:'4–12',seed:9300,W,H,mood:'sun',theme:'snow',ground:'snow',
  groundImg:{n:'isoFloor1',r:[0,0,W,H]},clean:1,noDetails:1,colorMatch:0,lit:1,noCritters:1,mirror:1,camZoom:.8,camZoomMob:.75,fieldScale:1,keepWarps:1,noAutoTrails:1,noPretty:1,
  walk:[P(LOW),P(TOP),P(STAIRS)],
  start:[Math.round(560*S),Math.round(700*S)],
  warps:[{id:'home',x:Math.round(150*S),y:Math.round(985*S),to:'capT',at:'toS',label:'กลับเมืองหลวง'}]}
});
window.VK_MONS=window.VK_MONS||{};
if(!window.VK_MONS.isoSnow&&window.VK_MONS.vikF2)window.VK_MONS.isoSnow=window.VK_MONS.vikF2.slice();
})();
