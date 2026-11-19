AETHERFALL — Viking zone maps
================================

Files
  maps/viking/*.webp        178 painted pieces (trees, rocks, ruins, coast, town, mine, cave) + 8 ground textures
  maps/viking-catalog.js    size / foot point / collision of every piece (window.VK_CAT)
  maps/fieldmap.js          map builder: lays out ground, trails, sea, trees, props, warps, wind, light (createFieldHost)
  maps/viking-maps.js       one config per map (window.VK_MAPS) + monster tables (window.VK_MONS)
  maps/snowpine.js          Snow Pine Woods (field 1), the hand-tuned map; now has warps too

Maps (16) and links
  frostheim (town)  <-> snowpine (Lv 1-8), vikF2 (Lv 4-12)
  snowpine          <-> vikF3 (Lv 10-18), vikF5 (Lv 18-26)
  vikF2             <-> vikF4 (Lv 14-22), vikD1a (Dwarven Mine 1, Lv 28-36) <-> vikD1b (Lv 36-44)
  vikF3             <-> vikH1 Blackpine Hollow (Lv 46-56) <-> vikD2a/b/c Fenrir's Den (Lv 58-80) <-> vikE2
  vikF4             <-> vikH2 Northern Icefield (Lv 52-64) <-> vikE1 Dragonship Graveyard (Lv 76-86) <-> vikE2 Eternal Glacier (Lv 84-94)
  vikF5             <-> vikF6 Wolf's Pass (Lv 22-30) -> capital warp (locked until the capital exists)

Editing a map (viking-maps.js)
  W,H            size in map px (fields 4800x3600, dungeon floors 3600x2700, town 3000x2400)
  seed           change it to get a different layout with the same rules
  trails         list of point lists; first = main trail. trailKind 'snow' (worn only near warps/landmarks), 'dirt', 'cobble', 'none'
  border/groves  which pieces form the outer wall and the inner groves; groves.thr higher = fewer groves, dens = how packed
  open/edge      props in the open / at grove edges.  decals = flat ground bits.  grass = swaying tufts
  land           placed pieces {n,x,y,flip,r}; r clears a ring around it; coast:<px> snaps it to the shoreline
  sea            {side:'N'|'E'|'S'|'W', d:depth} ; seaSet = floating pieces
  warps          {id,x,y,to,at,label}; 'at' is the warp id in the target map where the player arrives
  mood           sun | cold | storm | dark | glacier | town | mine | cave (light, colour grade, snow, darkness)

Monsters
  VK_MONS[map] = [{base:'frostling'|'snowwolf', name, th, lv:[min,max], sc, tint (frostling colour) | flt (wolf recolour)}]
  Stats come from the level. Only the Frostling and Snow Wolf models exist so far; the others are recoloured/rescaled variants
  until their own sprites are made.

Settings > MAP has a list of every Viking map (for testing).
