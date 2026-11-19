# นกฮูกหิมะ — พรอมต์เอฟเฟกต์สกิล (ใช้กับ ChatGPT)

ทำแบบเดียวกับจระเข้: ภาพละ 6 ชิ้น รวม 6 ภาพ (36 ชิ้น) ส่งให้ ChatGPT ทีละภาพ แล้วส่งภาพที่ได้กลับมาให้ Claude ตัดเป็นชิ้นและใส่ในเกม
ไฟล์ที่ตัดแล้วจะเก็บไว้ที่ `assets/fx/owl/oNN_name.webp`

ธีม: นักล่าหน้าไม้ชาวนอร์ดิก · สาย A = แสงจันทร์สีเงินและมาร์คสีทอง · สาย B = หิมะและน้ำแข็ง · ตะเกียง = สีส้มอุ่น

| ภาพ | ชิ้น | ใช้กับสกิล |
|---|---|---|
| 1 ลูกดอก | o01 bolt · o02 fan · o03 pierce · o04 heavy · o05 drill · o06 rico | Owl Bolt · Charged Bolt / Twin Fan · Piercing / Deep Pierce / Aimed · Heavy Bolt · Armor Drill · Ricochet |
| 2 โดนเป้า | o07 hitmoon · o08 hitgold · o09 mark · o10 weak · o11 deadeye · o12 pow | ตีปกติ · คริ / Critical Feather · Hunter's Mark / Twin Mark · Weakpoint · Aimed Shot / Deadeye · ตัวจบ Charged Bolt / Heavy |
| 3 แสงจันทร์ | o13 exec · o14 moonbeam · o15 moonring · o16 fatal · o17 goldeye · o18 spirit | Silent Execution · Moonfall / Moonwind Rain · พื้นของ Moonfall · Fatal Bolt / Last Light · Perfect Hunt / Night Hunter · Circling Hunt |
| 4 น้ำแข็ง | o19 flurry · o20 snare · o21 frost · o22 freeze · o23 shatter · o24 iceshards | Flurry / Double Flurry · Snow Snare · Frostbite / Deep Chill · แช่แข็ง / Brittle · Shatter · เศษน้ำแข็งกระเด็น |
| 5 พายุหิมะ | o25 skyfall · o26 cage · o27 storm · o28 volley · o29 veil · o30 flash | Skyfall Volley · Blizzard Cage / Permafrost · Avalanche Rain · Frost Volley · Snow Veil / White Out / Erase Tracks · Feather Flash |
| 6 ตัวเอง | o31 guard · o32 hop · o33 lantern · o34 glow · o35 tent · o36 feathers | Feather Guard / Feather Mantle · Wing Hop · Snow Lantern · แสงตะเกียงบนพื้น · Snow Tent · ขนนกปลิว |

---

## ภาพ 1 — ลูกดอก

```
Game VFX sprite sheet, 6 separate effects in a 3×2 grid on a fully transparent background (if transparency is not possible, use a flat plain dark grey #282c34 background). Wide image, 1536×1024.
Style: 2D hand-painted cartoon mobile-game effects, bold clean shapes, thick dark-tinted outlines, 2–3 tone cel shading, bright glossy highlights, high saturation, small sparkles. Theme: cute snowy owl fantasy hero, winter magic. Palette: moon silver-white, pale periwinkle blue, ice blue, accents of gold. Small Nordic rune details and white owl feathers.
Every piece is centered in its own cell with clear empty space around it; nothing touches the cell edge; no text, no labels, no numbers, no characters, no frames.
All magic projectiles travel horizontally to the RIGHT, pointed end on the right, trail on the left.
1. Magic light dart: a small silver spell dart with white feather tail and a short pale-blue sparkle trail.
2. Fan of three curved white feather blades spreading outward to the right like a fan wave, with frosty edges.
3. Very long thin moonlight streak: white glowing core, periwinkle glow, pointed tip.
4. Big chunky magic dart with a large silver crystal tip and two round energy rings around the tip.
5. Spiral dart: a spinning cone of silver light with twisting blue energy and gold sparkles.
6. Bouncing light trail: a zig-zag light streak with three bright bounce flashes, ending in a small glowing point.
```

## ภาพ 2 — โดนเป้า

```
Game VFX sprite sheet, 6 separate effects in a 3×2 grid on a fully transparent background (if transparency is not possible, use a flat plain dark grey #282c34 background). Wide image, 1536×1024.
Style: 2D hand-painted cartoon mobile-game effects, bold clean shapes, thick dark-tinted outlines, 2–3 tone cel shading, bright glossy highlights, high saturation, small sparkles. Theme: cute snowy owl fantasy hero, winter magic. Palette: moon silver-white, pale periwinkle blue, ice blue, gold.
Every piece is centered in its own cell with clear empty space around it; nothing touches the cell edge; no text, no letters, no labels, no characters, no frames.
1. Hit spark: sharp silver-white star burst with periwinkle glow and tiny feather bits.
2. Big golden star burst with sharp rays and white feather shards flying out.
3. Golden magic sigil shaped like an owl's face with two round eyes, Nordic rune ring around it, seen face-on.
4. Golden cracks spreading across a round silver plate, with small chips popping off.
5. Glowing focus ring: thin gold and silver circles with four small pointers and a bright dot in the center.
6. Cartoon impact burst (comic "pow" shape without letters) in ice blue and white with a spiky outline.
```

## ภาพ 3 — แสงจันทร์

```
Game VFX sprite sheet, 6 separate effects in a 3×2 grid on a fully transparent background (if transparency is not possible, use a flat plain dark grey #282c34 background). Wide image, 1536×1024.
Style: 2D hand-painted cartoon mobile-game effects, bold clean shapes, thick dark-tinted outlines, 2–3 tone cel shading, bright glossy highlights, high saturation, small sparkles. Theme: cute snowy owl fantasy hero, night and moonlight magic. Palette: moon silver-white, pale periwinkle, deep night blue, gold.
Every piece is centered in its own cell with clear empty space around it; nothing touches the cell edge; no text, no labels, no characters, no frames.
1. Crescent swipe: a huge thin crescent-moon shaped arc of light, deep night blue edge with a white-hot inner line and stars.
2. Moonfall pillar: a tall vertical beam of moonlight falling from the top of the cell to the ground, wider at the bottom, with a small crescent moon at the top. Its bottom edge sits on the ground line.
3. Ground moon circle: a flat glowing moon-rune circle seen from a 3/4 top-down view (wide squashed ellipse), silver and periwinkle, with a crescent symbol in the middle.
4. Silver glint aura: a tall upright silver-white flame aura with a bright four-point star glint at the top, standing on the ground line.
5. Golden owl eyes emblem: two big glowing golden owl eyes with feather brows, radiant rays behind, face-on.
6. Owl spirit: a translucent glowing snowy-owl spirit gliding with wings spread, made of moonlight and ice, simple cartoon shape, flying to the right.
```

## ภาพ 4 — น้ำแข็ง

```
Game VFX sprite sheet, 6 separate effects in a 3×2 grid on a fully transparent background (if transparency is not possible, use a flat plain dark grey #282c34 background). Wide image, 1536×1024.
Style: 2D hand-painted cartoon mobile-game effects, bold clean shapes, thick dark-tinted outlines, 2–3 tone cel shading, bright glossy highlights, high saturation, small sparkles. Theme: snowy owl, Nordic frost magic. Palette: ice blue, cyan, white, a little periwinkle.
Every piece is centered in its own cell with clear empty space around it; nothing touches the cell edge; no text, no labels, no characters, no frames.
1. Small ice-shard bolt flying horizontally to the RIGHT, crystal tip on the right, short snowy trail on the left.
2. Snow snare trap: a flat icy ring on the ground seen from a 3/4 top-down view (wide squashed ellipse) with short ice spikes around the rim.
3. Frostbite burst: a big snowflake crystal burst with frosty mist, face-on.
4. Freeze: a cluster of tall ice crystals growing up from the ground, sized to cover a small creature, its bottom edge sitting on the ground line.
5. Shatter: an ice explosion burst with big shards flying outward and white frost puffs.
6. A strip of 8 small separate ice shards in one horizontal row, all different shapes, evenly spaced, same size. (This cell is one long row.)
```

## ภาพ 5 — พายุหิมะ

```
Game VFX sprite sheet, 6 separate effects in a 3×2 grid on a fully transparent background (if transparency is not possible, use a flat plain dark grey #282c34 background). Wide image, 1536×1024.
Style: 2D hand-painted cartoon mobile-game effects, bold clean shapes, thick dark-tinted outlines, 2–3 tone cel shading, bright glossy highlights, high saturation, small sparkles. Theme: snowy owl, Nordic snowstorm. Palette: ice blue, white, periwinkle, a little silver.
Every piece is centered in its own cell with clear empty space around it; nothing touches the cell edge; no text, no labels, no characters, no frames.
1. Ice rain: many ice-blue light darts falling diagonally from the upper left to the lower right, with snowy trails.
2. Blizzard cage: a ring of tall ice pillars standing in a circle, seen from a 3/4 top-down view (circle is a wide squashed ellipse), swirling snow between the pillars.
3. Snowstorm: a swirling blizzard vortex on the ground seen from a 3/4 top-down view (wide squashed ellipse), white and ice-blue spiral with snowflakes.
4. A radial burst of frost feathers and ice darts flying out in all directions from the center.
5. Snow veil: a big puffy cartoon cloud of white snow smoke with a few snowflakes, soft and round.
6. Feather flash: a bright white flash ring with many white owl feathers bursting outward in a circle.
```

## ภาพ 6 — ตัวเอง

```
Game VFX sprite sheet, 6 separate effects in a 3×2 grid on a fully transparent background (if transparency is not possible, use a flat plain dark grey #282c34 background). Wide image, 1536×1024.
Style: 2D hand-painted cartoon mobile-game effects, bold clean shapes, thick dark-tinted outlines, 2–3 tone cel shading, bright glossy highlights, high saturation, small sparkles. Theme: cute snowy owl fantasy hero, winter magic. Palette: white, silver, ice blue, warm amber.
Every piece is centered in its own cell with clear empty space around it; nothing touches the cell edge; no text, no labels, no characters, no frames.
1. Feather guard: a protective dome made of overlapping white owl feathers with a silver glow, its bottom edge sitting on the ground line.
2. Wing dash: two white wings in a fast motion streak pointing to the RIGHT, with speed lines and a few loose feathers.
3. Snow lantern: a small Nordic iron lantern standing on the ground with a warm amber glow inside and a frosty top, its bottom edge on the ground line.
4. Warm glow circle: a soft amber light circle on the ground seen from a 3/4 top-down view (wide squashed ellipse), with tiny warm sparkles.
5. Snow tent: a small cosy Nordic tent covered in snow with a warm glow from the doorway, its bottom edge on the ground line.
6. A strip of 8 small separate white owl feathers in one horizontal row, all at different angles, evenly spaced, same size. (This cell is one long row.)
```
