# หมาป่า — Prompt ภาพเจมโทเท็ม (12 เม็ด) + ของกลางระบบเจม

> **ใช้ข้อ 6 (เจมทรงกลมใส่ช่อง) เป็นชุดล่าสุด** — ข้อ 1 และ 5 เป็นแบบเก่า (มีกรอบโลหะ) เก็บไว้อ้างอิง · แผงกลุ่มดาว (กรอบ / ท้องฟ้า / ช่อง 3 ขนาด / วงแหวนหมุน) ได้ภาพครบแล้วใน assets/gems/board/

ระบบเจมโทเท็ม: สกิล C แต่ละท่า = เจม 1 เม็ด · สีตัวเจมบอกขั้น (ขั้น 1 อำพัน · ขั้น 2 หยก · ขั้น 3 ไพลิน · ขั้น 4 ทับทิม)
· แสงสัญลักษณ์ข้างในบอกสาย (Basic ทองอุ่น · A แดงถ่านไฟ · B ฟ้าน้ำแข็ง/สายฟ้า)

**ก่อนส่ง prompt ใน ChatGPT แนบ 2 รูปเสมอ:** ภาพ key art กองไฟ (สไตล์) + character sheet หมาป่า (หน้าตา/ชุด)
ส่งทีละกล่อง รอให้เสร็จแล้วค่อยส่งกล่องถัดไป

---

## 1) เจมหมาป่า 12 เม็ด — 1 เม็ดต่อ 1 ภาพ · "ตัวเจมคือคอนเซปต์ของสกิล"

หลัก: เจมแต่ละเม็ดเป็น **วัตถุชิ้นหนึ่ง** ที่เล่าว่าสกิลทำอะไร — รูปทรง · วัสดุ · สิ่งที่ติดอยู่ในเนื้อผลึก
**ห้าม**วาดรูป/สัญลักษณ์สกิลแปะบนหน้าเจม · ทำทีละเม็ด (ถ้าสั่ง 12 เม็ดในแผ่นเดียว AI จะวาดทรงเดียวกันแล้วแปะลาย)
สีตามคอนเซปต์ · **ขั้นดูจากกรอบโลหะ**: ขั้น 1 ทองแดง · 2 เงิน · 3 ทอง · 4 ทองประดับเพชร

**วิธีส่ง:** แชทใหม่ใน ChatGPT → แนบ `totem_style_reference.png` + `wolf_reference_sheet.png` → ส่งกล่อง "ข้อความแรก" → แล้วส่งทีละเม็ด (1–12) ในแชทเดียวกัน

### ข้อความแรก (ส่งครั้งเดียว)
```
I am designing precious gem items for my 2D RPG "Totem Legend". Art style: copy the attached totem app icon — friendly hand-painted chibi cartoon, thick clean dark-brown outlines, cel shading with 2-3 flat tones, glossy jewel highlights, soft cartoon glow, bright and warm. Not realistic, not 3D render. The attached wolf sprite is only for the Norse wolf theme, not for colours.

Rules for every gem I send:
- The gem IS the idea of a skill: its shape, cut, material and what is trapped inside the crystal tell what the skill does. NEVER paint a picture, icon, emblem or symbol on the gem's face.
- A real cut jewel with facets and shine, held by a small metal setting. The setting metal is given in each request.
- One gem only, centered, fills about 80% of a square 1024x1024 canvas, fits inside an invisible circle, transparent background, empty space on every side.
- No text, no letters, no numbers, no logo, no watermark, no frame, no background scene.
Reply OK and wait for the first gem.
```

### เจมแต่ละเม็ด (ส่งทีละกล่อง)
**1 · Endless Chain** (Basic ขั้น 1 — ปิดคอมโบแล้วปล่อยคลื่นฟัน)
```
Gem 1 "Endless Chain": a short chain of three linked chain-links, every link is a faceted golden topaz, the last link is cracked open and a golden crescent wave of light is bursting out of the crack. Copper setting.
```
**2 · War Banner** (Basic ขั้น 2 — ปักธง เพิ่ม ATK ลดดาเมจที่ได้รับ)
```
Gem 2 "War Banner": a jade crystal that grows up from a small stone base as a tall flag-shaped slab with a wind-swept cloth-like edge, frozen mid-flutter, and a small ring of tiny guard crystals around the base like a defended zone. Silver setting.
```
**3 · Echo Step** (Basic ขั้น 3 — ก้าวหลบทิ้งร่างเงาล่อศัตรู)
```
Gem 3 "Echo Step": a sapphire teardrop gem caught mid-motion, with three fading see-through copies of itself trailing behind it, each copy paler than the last, like afterimages. Gold setting.
```
**4 · Fenrir's Spirit** (Basic ขั้น 4 — ท่าไม้ตาย กลายร่างเป็นวิญญาณ Fenrir)
```
Gem 4 "Fenrir's Spirit": a large pale moonstone orb with a misty white wolf spirit swirling INSIDE the crystal, a broken iron chain hanging loose around the setting as if the spirit just broke free, faint silver glow. Ornate gold setting with a ring of tiny diamonds and sparkles.
```
**5 · Savage Echo** (A ขั้น 1 — Blood Cleave ฟันซ้ำด้วยเงาขวาน)
```
Gem 5 "Savage Echo": a blood-red garnet cut in the shape of a viking axe blade, fused with its own dark smoky twin offset just behind it, as if the same blow landed twice. Copper setting.
```
**6 · Ravenous Leap** (A ขั้น 2 — กระโดดฟาดขวานวิญญาณ)
```
Gem 6 "Ravenous Leap": a crescent-curved red crystal shaped like a leaping arc rising up and slamming down, with a small crater of cracked crystal shards where its tip lands. Silver setting.
```
**7 · Valhalla Assault** (A ขั้น 3 — พุ่งทะลุแล้วฟันกลับ)
```
Gem 7 "Valhalla Assault": a long ruby shard pierced straight through by a streak of golden light that bends back at the far end like a returning cut, with small feathered gold wings on the setting. Gold setting.
```
**8 · Einherjar's Call** (A ขั้น 4 — ฝูงหมาป่าเงาพุ่งกัด)
```
Gem 8 "Einherjar's Call": a dark garnet heart-stone with five small black-red crystal shards around it, all pointing the same way like a charging pack, set on a round viking-shield shaped base. Ornate gold setting with a ring of tiny diamonds and sparkles.
```
**9 · Hoarfrost Edge** (B ขั้น 1 — รอยน้ำแข็งบนพื้นทำให้ช้า)
```
Gem 9 "Hoarfrost Edge": a jagged pale-blue ice shard with a razor blade edge, and a trail of frost crystals spreading across the setting behind it as if it froze the ground it passed. Copper setting.
```
**10 · Glacial Path** (B ขั้น 2 — แนวเสาน้ำแข็ง)
```
Gem 10 "Glacial Path": three aquamarine ice pillars of rising height growing in one straight line from a single frozen base. Silver setting.
```
**11 · Storm Chain** (B ขั้น 3 — สายฟ้าชิ่ง 3 ตัว)
```
Gem 11 "Storm Chain": an electric-blue crystal with a living lightning bolt trapped inside, the lightning arcing out of it to three tiny floating crystals around it. Gold setting.
```
**12 · Worldstorm** (B ขั้น 4 — พายุค้างหลังท่าไม้ตาย)
```
Gem 12 "Worldstorm": a dark indigo crystal sphere containing a whole spinning storm inside the glass — swirling clouds, lightning and glowing rune marks orbiting the centre. Ornate gold setting with a ring of tiny diamonds and sparkles.
```

ได้ภาพแล้วส่งมา ผมตัดพื้นหลัง ย่อเป็น 128×128 ใส่ `assets/gems/wolf/` ตามตาราง · เม็ดไหนไม่ตรง ใช้แปรงเลือกแก้เฉพาะส่วนนั้นใน ChatGPT

| ช่อง | ไฟล์ | สกิล C | ขั้น | สาย |
|---|---|---|---|---|
| 1 | `endlessChain.webp` | Endless Chain | 1 | Basic |
| 2 | `warBanner.webp` | War Banner | 2 | Basic |
| 3 | `echoStep.webp` | Echo Step | 3 | Basic |
| 4 | `fenrirsSpirit.webp` | Fenrir's Spirit | 4 | Basic |
| 5 | `savageEcho.webp` | Savage Echo | 1 | A |
| 6 | `ravenousLeap.webp` | Ravenous Leap | 2 | A |
| 7 | `valhallaAssault.webp` | Valhalla Assault | 3 | A |
| 8 | `einherjarsCall.webp` | Einherjar's Call | 4 | A |
| 9 | `hoarfrostEdge.webp` | Hoarfrost Edge | 1 | B |
| 10 | `glacialPath.webp` | Glacial Path | 2 | B |
| 11 | `stormChain.webp` | Storm Chain | 3 | B |
| 12 | `worldstorm.webp` | Worldstorm | 4 | B |

ถ้าเม็ดไหนออกมาไม่ตรง: ใน ChatGPT ใช้แปรงเลือกเฉพาะเม็ดนั้น แล้วสั่งแก้ทีละเม็ด (แก้ทั้งภาพจะวาดใหม่หมด)

---

## 2) ของกลาง (ใช้ทุกฮีโร่) — หินโทเท็ม 4 ขั้น + แก่นโทเท็ม — แผ่นเดียว 3×2 (1536×1024)

```
Make a 3x2 sheet of 6 game item icons, 1536x1024, for my 2D RPG "Totem Legend". Copy the art style of the attached campfire key art: friendly hand-painted chibi cartoon, thick clean dark-brown outlines, cel shading with 2-3 flat tones, soft cartoon glow, bright and warm. Not realistic, not painterly smoke, not 3D.

Each icon is one single object, centered in its own perfect square cell, equal cells, clear empty gaps, transparent background, no text, no numbers, no letters, no logo, no watermark, no frame.

1) Rough Totem Stone tier 1: a rough grey-brown rock chunk with a faint carved animal face, small warm amber crystal veins
2) Rough Totem Stone tier 2: a rough mossy rock chunk with a carved animal face, green jade crystal veins
3) Rough Totem Stone tier 3: a dark rock chunk with a clearer carved animal face, deep blue sapphire crystals poking out
4) Rough Totem Stone tier 4: a black obsidian chunk with a carved animal face, glowing ruby red crystals and tiny sparkles
5) Totem Essence: a small round glass vial filled with swirling glowing golden spirit light, a tiny carved wooden totem cap on top
6) Totem Chisel: a small wooden-handled carving chisel with a gold blade and a little feather tied to the handle
```

| ช่อง | ไฟล์ (`assets/items/`) | ของ |
|---|---|---|
| 1 | `totem_stone1.png` | หินโทเท็ม ขั้น 1 (มินิบอส / มอนดันเจี้ยน) |
| 2 | `totem_stone2.png` | หินโทเท็ม ขั้น 2 (ผู้พิทักษ์ / บอสพื้นที่) |
| 3 | `totem_stone3.png` | หินโทเท็ม ขั้น 3 (MVP ชั้นลึกสุด) |
| 4 | `totem_stone4.png` | หินโทเท็ม ขั้น 4 (MVP ปลายดินแดน / Aether Wyrm) |
| 5 | `totem_essence.png` | แก่นโทเท็ม (อัปเลเวลเจม) |
| 6 | `totem_chisel.png` | สิ่วแกะโทเท็ม (ไอคอนปุ่ม "แกะเจม") |

---

## 3) ศาลโทเท็มในเมือง (NPC แกะเจม) — ภาพเดียว

```
Draw one game object for my 2D RPG "Totem Legend", copying the art style of the attached campfire key art: friendly hand-painted chibi cartoon, thick clean dark-brown outlines, cel shading with 2-3 flat tones, soft cartoon glow, bright and warm. Not realistic, not 3D.

A small totem shrine that stands in a town square: a carved wooden totem pole about two people tall with five stacked animal faces (wolf, jaguar, owl, fox, cat), gold trim, a stone base with three steps, a small carving table beside it with a chisel and glowing gems, soft golden spirit light rising from the top. Seen from the front at a slight 3/4 top-down angle like the other town buildings, flat base at the bottom, transparent background, empty space on every side, no text, no logo, no watermark.
```

ไฟล์: `assets/town/totem_shrine.png` (วางในทุกเมือง)

---

## 4) เสาโทเท็มหมาป่า (พื้นหลังหน้าจอใส่เจม) — ภาพเดียว แนวตั้ง 2:3

ช่องเจมจริงวาดด้วยโค้ดให้พอดีกับรูปเจม ภาพนี้จึง **ไม่ต้องมีหลุม** — ขอแค่เสาเรียบ ๆ มีแขนยื่นสั้น ๆ 5 คู่ไว้ให้เจมเกาะ
(ได้ภาพแล้วส่งมา ผมจะขยับตำแหน่งช่องให้ตรงกับแขนในภาพ)

```
Draw one tall totem pole for the gem screen of my 2D RPG "Totem Legend", vertical 2:3 image. Copy the art style of the attached totem app icon and match the attached wolf hero: friendly hand-painted chibi cartoon, thick clean dark-brown outlines, cel shading with 2-3 flat tones, soft cartoon glow, bright and warm. Not realistic, not painterly, not 3D.

The pole: warm carved wood with gold trim, a big carved grey-and-white WOLF head on top with yellow eyes and a red rune mark on the forehead, two red-and-white carved wings spreading from just below the head, frosty Norse knotwork carvings on the wood. Below the head, the pole has 5 evenly spaced pairs of short carved wooden arms sticking out left and right (10 arms in total, at the same heights on both sides), each arm ending in a small flat round gold plate facing the viewer (gems will be placed on these plates later, so leave the plates EMPTY). Red-and-white zigzag bands between each pair of arms. The pole stands on a small snowy stone base.
Front view, centered, the whole pole visible with empty space around it, transparent background, no gems, no text, no letters, no logo, no watermark.
```

ไฟล์: `assets/gems/wolf/pole.webp`

---

## 5) เจมเสริม 12 เม็ด (ของกลาง ใช้ทุกฮีโร่) — แผ่นเดียว 4×3 (1536×1024)

ช่องเจมเสริมเป็น **วงกลม** — เจมเสริมต้องเป็นทรงกลมพอดีวง

```
Make a 4x3 sheet of 12 small game item icons, 1536x1024, for my 2D RPG "Totem Legend". Copy the art style of the attached totem app icon: friendly hand-painted chibi cartoon, thick clean dark-brown outlines, cel shading with 2-3 flat tones, soft cartoon glow, bright and warm. Not realistic, not 3D.

Each icon is a "Support Gem": a perfectly ROUND polished cabochon gem (a smooth dome, like a round button seen from the front) in a thin gold ring, with one simple glowing symbol inside. The gem fills the whole circle. Each icon centered in its own perfect square cell, equal cells, clear empty gaps, transparent background, no text, no numbers, no letters, no logo, no watermark.

Row 1: 1) purple gem, symbol: a faint ghost copy of a slash behind a slash (echo)  2) orange-gold gem, symbol: three stacked chevrons (every third)  3) red gem, symbol: a fist with a burst (more force)  4) amber gem, symbol: a burst splitting into small splashes (splash)
Row 2: 5) sky-blue gem, symbol: a lightning arrow bouncing between two dots (chain)  6) green gem, symbol: an hourglass with a speed line (quicker cooldown)  7) deep blue gem, symbol: a small water drop with a minus mark shape made of light, no letters (spirit saving)  8) fiery orange-red gem, symbol: a flame (burn)
Row 3: 9) ice-cyan gem, symbol: a snowflake (frost)  10) silver-white gem, symbol: a spearhead breaking a shield (armour pierce)  11) crimson gem, symbol: a heart with a small fang (life leech)  12) brown-gold gem, symbol: a hammer hitting the ground with shock rings (impact)
```

| ช่อง | ไฟล์ (`assets/gems/support/`) | เจมเสริม |
|---|---|---|
| 1 | `echo.webp` | เงาสกิล |
| 2 | `third.webp` | ทุกครั้งที่สาม |
| 3 | `force.webp` | เพิ่มแรง |
| 4 | `splash.webp` | กระจาย |
| 5 | `chain.webp` | ชิ่ง |
| 6 | `quick.webp` | เร่ง |
| 7 | `thrift.webp` | ประหยัด |
| 8 | `burn.webp` | เผาไหม้ |
| 9 | `frost.webp` | เยือกแข็ง |
| 10 | `pierce.webp` | ทะลวง |
| 11 | `leech.webp` | ดูดชีวิต |
| 12 | `impact.webp` | กระแทก |

---

## 6) เจมทรงกลมใส่ช่อง (ชุดล่าสุด) — ตัวหินอย่างเดียว ไม่มีกรอบ

ช่องในแผงมีกรอบทองอยู่แล้ว → เจมต้องเป็น **หินกลมเต็มวง ไม่มีกรอบโลหะ** · คอนเซปต์อยู่ในลายเจียระไน + สิ่งที่เรืองอยู่ในเนื้อหิน · ขั้น/เลเวลแสดงด้วยโค้ด
แนบ: `totem_style_reference.png` + ภาพช่องเจม 3 ขนาด

**ข้อความแรก**
```
I am making gem stones that drop into round gold sockets (attached sheet) in my 2D RPG "Totem Legend". Art style: friendly hand-painted chibi cartoon like the attached totem icon, thick clean dark-brown outlines, cel shading with 2-3 flat tones, glossy jewel highlights, soft cartoon glow. Not realistic, not 3D render.

Rules for every gem:
- ONLY the stone: a perfectly ROUND gem seen straight from the front, filling a circle edge to edge. NO metal setting, NO frame, NO chain, NO base — the socket is the setting.
- The skill idea lives in the cut pattern of the facets and in what glows trapped INSIDE the stone. Never paint an icon or symbol on the surface.
- One gem per image, 1024x1024, centered, transparent background outside the circle. No text, no letters, no logo, no watermark.
Reply OK and wait.
```

**เจมหลักหมาป่า (ทีละกล่อง)**
```
Gem "Endless Chain": round golden topaz; inside, a ribbon of golden light loops endlessly in a figure-eight, with three small claw-slash streaks of light across it.
```
```
Gem "War Banner": round green jade; inside, a glowing banner of light ripples in the wind above a small ring of tiny guard crystals.
```
```
Gem "Echo Step": round sapphire; inside, a bright blue spark dashes sideways leaving three fading ghost copies of itself.
```
```
Gem "Fenrir's Spirit": round white moonstone with silver shimmer; inside, a misty white wolf spirit howls, and broken chain links of light float around it.
```
```
Gem "Savage Echo": round blood-red garnet; inside, two crossing axe-shaped slashes of light, one bright and one dark like a shadow echo.
```
```
Gem "Ravenous Leap": round deep red crystal; inside, a glowing arc leaps up and crashes down into a burst of cracked shards at the bottom.
```
```
Gem "Valhalla Assault": round ruby; inside, a golden streak pierces straight through the centre and curves back, with two tiny feathered wings of light.
```
```
Gem "Einherjar's Call": round black-red garnet; inside, five small shadow wolves of red light run together in one direction like a charging pack.
```
```
Gem "Hoarfrost Edge": round pale ice-blue crystal; inside, a jagged frost blade of light with frost crystals spreading across the inner surface.
```
```
Gem "Glacial Path": round aquamarine; inside, three ice pillars of light rise in a straight row, getting taller one after another.
```
```
Gem "Storm Chain": round electric-blue crystal; inside, a lightning bolt jumps between three tiny bright points.
```
```
Gem "Worldstorm": round dark indigo crystal; inside, a whole swirling storm with clouds, lightning and glowing runes spinning around the centre.
```

**เจมแปรสภาพ 12 เม็ด (ของกลาง · แผ่นเดียว)** → `assets/gems/mut/<id>.webp` (focus spread heavy rapid · stack fire ice volt · guard rage siphon totem)
```
Make a 4x3 sheet of 12 ROUND gem stones, 1536x1024, same rules as before (stone only, no setting, each a perfect circle centered in its own square cell, transparent background, clear gaps, no text). These are "mutation" gems: each stone has a ring of glowing rune-like facets around its edge and one idea glowing inside.
Row 1: 1) gold gem, a single bright focused point of light 2) orange gem, light bursting outward in rings 3) heavy dark-red gem, one big glowing weight pressing down 4) green gem, three fast streaks of light
Row 2: 5) pale blue gem, two stacked glowing layers 6) fire-orange gem, flames 7) ice-cyan gem, frost crystals 8) sky-blue gem, lightning
Row 3: 9) silver gem, a glowing shield shape of light 10) crimson gem, red rage flames swirling 11) deep blue gem, glowing spirit droplets flowing inward 12) amber gem, a tiny glowing totem pole of light
```

**เจมเสริม 12 เม็ด (ของกลาง · แผ่นเดียว)** → `assets/gems/support/<id>.webp` (echo third force splash · chain quick thrift burn · frost pierce leech impact)
```
Make a 4x3 sheet of 12 small ROUND polished cabochon stones, 1536x1024, same rules as before (stone only, no setting, each a perfect circle centered in its own square cell, transparent background, clear gaps, no text). Smooth domed stones, simpler than the main gems, one soft glow inside each.
Row 1: 1) purple, a faint double afterimage glow (echo) 2) orange-gold, three stacked glowing dots (every third) 3) red, a strong bright core (force) 4) amber, a burst splitting into small sparks (splash)
Row 2: 5) sky-blue, a light bouncing between two points (chain) 6) green, a swirling quick spiral (quick) 7) deep blue, a calm glowing droplet (thrift) 8) orange-red, an ember (burn)
Row 3: 9) ice-cyan, a snowflake glow (frost) 10) silver-white, a sharp piercing point of light (pierce) 11) crimson, a glowing heart-shaped core (leech) 12) brown-gold, shock rings (impact)
```
