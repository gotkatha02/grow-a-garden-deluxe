# มอนสเตอร์รอบ 2 — เลิกใช้ภาพแคตาล็อก เจนเองทุกตัว (2026-11-21)

เจ้าของ: "ทำมอนสเตอร์ต่อ จะเปลี่ยนเป็นเจนเอง ตัวไหนที่เป็นรูปจากแคตาล็อกไม่เอาแล้ว"
มอนที่ยังใช้ภาพพิกเซลจากแคตาล็อก = **224 ตัว** (รายชื่อเต็มใน MONSTER_CATALOG_MAP_TH.md): ไวกิ้ง 16 · แอซเท็ก 45 · อียิปต์ 44 · กรีก 44 · ญี่ปุ่น 43 · เมืองหลวง / สุสาน 23 · รอยแยก 8 · ภาพวาดเดิม 30 ตัว + เฟนเรียร์ + หมาเงาเฟนเรียร์ ไม่แตะ

## ขั้นตอน
1. **รูปต้นแบบ** (ขั้นนี้): ชีต 2×2 = มอน 4 ตัวต่อรูป พื้นเขียว หันขวาล่าง 3/4 → ผมตัดเป็นรูปละตัว (`tools/iconsheet.py … 2,2 …` ไม่ใส่ GLOBAL เพราะมอนบางตัวโปร่ง)
2. **ท่าทาง** (ทีหลัง เลือกต่อตัว): (ก) ชีตท่าทาง 5 แถวแบบ 30 ตัวเดิม (idle 4 · walk 4 · attack 5 · hurt 2 · death 5, tools/monsheet.py) หรือ (ข) วิดีโอจากรูปต้นแบบแบบเฟนเรียร์ / หมาเงา (tools/vidclips.py, vidwalk.py)
3. ใส่ในเกม: บรรทัดใน `MS` ของ monster-sprites.js (ชนะภาพแคตาล็อกอัตโนมัติ) แล้วลบชื่อออกจาก MAP ใน monster-catalog.js

ลำดับ: ไวกิ้งก่อน (แดนเริ่มเกม) → เมืองหลวง / สุสาน → แอซเท็ก → กรีก → อียิปต์ → ญี่ปุ่น → รอยแยก · ชีตของแดนอื่นเขียนเพิ่มเมื่อถึงคิว

## ชีต → ไฟล์ (ไวกิ้ง)
| ชีต | 1 บนซ้าย | 2 บนขวา | 3 ล่างซ้าย | 4 ล่างขวา |
|---|---|---|---|---|
| V1 | Snow Pup ลูกหมาป่าหิมะ (snowpine) | Pass Wolf หมาป่าหิมะ (vikF6) | Shadow Wolf หมาป่าเงา (vikH1) | Wolf Priest นักบวชหมาป่า (vikD2a) |
| V2 | Gleipnir Weaver ช่างทอโซ่เกลปเนียร์ (vikD2a) | Draugr Wolf หมาป่าเดรากร์ (vikD2b) | Draugr เดรากร์ (vikD2b) | Chain Wraith วิญญาณโซ่ (vikD2b) |
| V3 | Fenrir Guard องครักษ์เฟนเรียร์ (vikD2c) | Wolf High Priest มหานักบวชหมาป่า (vikD2c) | Undying Viking ไวกิ้งอมตะ (vikE1) | Sea Ghost Wolf หมาป่าวิญญาณทะเล (vikE1) |
| V4 | Drowned Shieldmaiden วาลคิรีจมน้ำ (vikE1) | Frost Giant ยักษ์น้ำแข็ง (vikE2) | Dark Valkyrie Wolf หมาป่าวาลคิรีมืด (vikE2) | Glacier Wyrmling ลูกมังกรธารน้ำแข็ง (vikE2) |

**สถานะ:** เขียนพรอมต์ไวกิ้งแล้ว ยังไม่มีรูป

## 0. พรอมต์กลาง (แชทใหม่ แนบรูปปกแคมป์ไฟ + รูปมอนที่วาดแล้ว 1–2 ตัว เช่น moorWolf / runestoneGolem เป็นตัวอย่างสไตล์มอน)
```
I am making monster designs for my 2D isometric fantasy MMORPG (Ragnarok Online feel). Copy the art style of the attached pictures exactly: friendly hand-painted chibi cartoon, cute-but-dangerous, thick clean dark-brown outlines (not black), cel shading with 2–3 flat tones, soft light from the top-left, bright warm colours, clear readable silhouette. Not realistic, not painterly, not 3D.
With each message I describe 4 monsters. Draw them on ONE 1024×1024 image as a 2×2 grid (1 top-left, 2 top-right, 3 bottom-left, 4 bottom-right), each monster alone in its quarter with clear empty space around it, nothing touching the quarter's edges.
Every monster: full body, standing in a neutral ready pose, isometric 3/4 view from about 30° above, facing DOWN-RIGHT (south-east), feet on the ground. Chibi proportions (big head, short body) even for giants — size differences are shown in the description, but each monster fills about 75% of its quarter. These pictures are the master designs I will animate later, so keep the shapes simple and clear.
Background: SOLID FLAT PURE GREEN (#00FF00), no gradient, no ground, no shadow. Never use green on the monsters (teal and turquoise are fine). No text, no labels, no frames, no glow halo or magic effects floating around them — glow only ON the body (eyes, runes, cracks).
Reply OK and wait.
```

## V1 (ไวกิ้ง: ลูกหมาป่า · หมาป่าช่องเขา · หมาป่าเงา · นักบวช)
```
Sheet V1 — 4 Norse monsters, 2×2 grid, all facing down-right.
1) SNOW PUP (tiny, the weakest monster of the game) — a chubby fluffy white wolf pup with big round ice-blue eyes, ice-blue ear tips and paws, a frosty curly tail, two tiny fangs, a little snow clump on its head. Cute first enemy.
2) PASS WOLF (medium) — a lean grey-and-white mountain wolf with snow crusted in its shaggy fur, a darker blue-grey stripe along its back, a scar over one eye, a collar of bone beads, ears back, snarling.
3) SHADOW WOLF (medium) — a black wolf whose body is made of thick dark smoke, glowing violet eyes and mouth, violet wisps curling from its fur and tail, its paws fading into smoke, menacing low stance.
4) WOLF PRIEST (medium, human-sized) — a hunched cultist in a purple robe with a wolf-skull hood over a shadowed face with glowing ice-blue eyes, bone and fang necklaces, holding a bone staff topped with a small wolf skull and a hanging violet rune stone.
Solid flat pure green background, no green on the monsters. Same chibi hand-painted style, thick dark-brown outlines, cel shading. No text, no effects around them.
```

## V2 (ไวกิ้ง: ช่างทอโซ่ · หมาป่าเดรากร์ · เดรากร์ · วิญญาณโซ่)
```
Sheet V2 — 4 Norse monsters, 2×2 grid, all facing down-right.
1) GLEIPNIR WEAVER (medium) — a big cave spider with a dark-blue carapace etched with glowing silver runes, eight thin legs ringed with silver bands, a pale face with six small ice-blue eyes, spinning a shining silver silk ribbon (the magic cord that binds Fenrir) from its back end, the ribbon coiled loosely in front of it.
2) DRAUGR WOLF (medium) — an undead wolf, half skeleton: tattered grey fur, exposed ribs with blue soul-fire burning inside its chest, bone tail, empty eye sockets with blue flames, a rusty broken chain on its neck.
3) DRAUGR (medium, human-sized) — an undead Viking warrior with blue-grey rotting skin, a dented iron helmet, rusty torn chainmail and a ragged fur cloak, glowing blue eyes, a notched sword in the right hand and a cracked round wooden shield with a faded raven painting.
4) CHAIN WRAITH (medium, floating) — a floating hooded ghost in a tattered dark-blue cloak, no legs (the cloak fades into ragged tails), two glowing ice-blue eyes in the hood, wrapped in broken iron chains whose loose ends hang like whips from its bony hands.
Solid flat pure green background, no green on the monsters. Same chibi hand-painted style, thick dark-brown outlines, cel shading. No text, no effects around them.
```

## V3 (ไวกิ้ง: องครักษ์เฟนเรียร์ · มหานักบวช · ไวกิ้งอมตะ · หมาป่าวิญญาณทะเล)
```
Sheet V3 — 4 Norse monsters, 2×2 grid, all facing down-right.
1) FENRIR GUARD (large) — a huge armoured black wolf: dark iron plates on its back and shoulders, a spiked iron collar, an ice-blue flame mane, glowing ice-blue eyes, heavy paws with iron claw caps.
2) WOLF HIGH PRIEST (medium, tall) — a tall priest in layered crimson-and-violet robes with gold trim, a crown made of a wolf skull with small horns, a long grey beard braid, both hands raised with small floating violet rune stones above the palms.
3) UNDYING VIKING (large) — a hulking undead Viking chieftain: horned helmet, barnacles and shells crusted on his rusty armour, a beard of dark seaweed, glowing teal eyes, a huge two-handed bearded axe resting on his shoulder.
4) SEA GHOST WOLF (medium) — a translucent pale-teal ghost wolf made of sea water, wave-foam white mane and tail curling like breaking waves, dripping water drops, glowing white eyes.
Solid flat pure green background, no green on the monsters (teal is fine). Same chibi hand-painted style, thick dark-brown outlines, cel shading. No text, no effects around them.
```

## V4 (ไวกิ้ง: วาลคิรีจมน้ำ · ยักษ์น้ำแข็ง · หมาป่าวาลคิรีมืด · ลูกมังกรธารน้ำแข็ง)
```
Sheet V4 — 4 Norse monsters, 2×2 grid, all facing down-right.
1) DROWNED SHIELDMAIDEN (medium, human-sized) — a pale drowned Viking shieldmaiden with wet dark braids, a winged helmet with a dent, a coral-crusted round shield and a long spear, torn dress and armour with barnacles, an eerie teal glow in her eyes.
2) FROST GIANT (very large) — a towering blue-skinned Jotun giant with an icicle beard, white fur loincloth, glacier-ice armour plates on the shoulders, glowing pale-blue eyes, carrying a club made of a big ice boulder on a log.
3) DARK VALKYRIE WOLF (large) — a black wolf with two big dark-feathered wings folded on its back, a silver winged valkyrie helmet on its head, silver chest armour, glowing silver eyes.
4) GLACIER WYRMLING (large) — a young ice dragon on four legs: pale-blue scales, a row of clear ice-crystal spikes along its back and tail, small frosty wings, big curious eyes, a little frost breath puffing from its nose.
Solid flat pure green background, no green on the monsters. Same chibi hand-painted style, thick dark-brown outlines, cel shading. No text, no effects around them.
```

---
# ขั้น 2: ท่าทาง (พรอมต์กลาง ใช้ได้กับทุกตัว)

เจ้าของ 2026-11-21: "เอาท่า idle · เดินให้ขาซ้ายกับขวาสลับ · ท่าเจ็บ · ท่าตาย" · เกมต้องมี **ท่าตี** ด้วย (มอนตีแล้วใช้แถวนี้) จึงใส่ไว้ด้วย
1 มอน = 1 แชทใหม่: **SETUP** (แนบรูปต้นแบบของตัวนั้นที่ผมตัดให้ + รูปปกแคมป์ไฟ) → IDLE → WALK (เลือกแบบตามขา) → ATTACK → HURT → DEATH
- ได้ภาพละ 1 แถว พื้นเขียว ผมต่อเป็น 5 แถว (idle 4 · walk 4 · attack 5 · hurt 2 · death 5) แล้วตัดด้วย tools/monsheet.py
- หน้าตาเริ่มเพี้ยน: แนบรูปต้นแบบซ้ำแล้วสั่งท่านั้นใหม่ · ขาไม่สลับ: ส่ง FIX WALK

### SETUP
```
I am making 2D sprite animations for a monster in my isometric fantasy MMORPG. The attached master picture is the monster — copy its design, colours and proportions EXACTLY in every image of this chat; never redesign it. Art style: friendly hand-painted chibi cartoon, thick clean dark-brown outlines, cel shading with 2–3 flat tones, soft light from the top-left, bright warm colours.
Rules for EVERY image I ask for:
- One horizontal row of frames on a 1536×1024 canvas, equal-width cells, the monster centred in each cell with empty space around it, nothing cropped or touching another frame.
- Same size and scale in every frame; feet / lowest point on the SAME baseline in every frame.
- View: isometric 3/4 from about 30° above, the monster facing DOWN-RIGHT (south-east), like the master picture.
- Background SOLID FLAT PURE GREEN (#00FF00): no gradient, no ground, no shadow. No green on the monster.
- No text, no numbers, no frame borders, no motion lines, no dust, no glow halo or magic effects around it (the game adds effects).
Reply OK and wait.
```

### IDLE
```
IDLE loop, 4 frames, calm breathing while waiting: 1) neutral stance, 2) body rises slightly, chest in, 3) neutral stance, 4) body sinks slightly, a small natural detail moves (ears, tail, cloak, hair or flame). Feet stay planted in all 4 frames.
```

### WALK — สองขา (คน ยักษ์ นักบวช)
```
WALK cycle, 4 frames, walking in place facing down-right. The legs MUST alternate and the arms swing opposite to the legs:
1) LEFT leg forward and planted, right leg behind, right arm forward.
2) passing pose: legs together under the body, RIGHT leg lifted and bent, body slightly higher.
3) RIGHT leg forward and planted, left leg behind, left arm forward.
4) passing pose: legs together under the body, LEFT leg lifted and bent, body slightly higher.
Frames 1 and 3 must clearly be mirror steps: the leg in front is different.
```

### WALK — สี่ขา (หมาป่า สัตว์ มังกร)
```
WALK cycle, 4 frames, a trot in place facing down-right. Diagonal leg pairs MUST alternate:
1) front-LEFT leg and back-RIGHT leg reach forward, the other two push back.
2) passing pose: all legs under the body, front-RIGHT and back-LEFT legs lifted, body slightly higher.
3) front-RIGHT leg and back-LEFT leg reach forward, the other two push back.
4) passing pose: all legs under the body, front-LEFT and back-RIGHT legs lifted, body slightly higher.
Frames 1 and 3 must clearly show different legs in front. Tail and ears swing a little.
```

### WALK — ลอย / ไม่มีขา (ผี ภูต แมงกะพรุน)
```
MOVE cycle, 4 frames, floating forward in place facing down-right: 1) high, body leaning forward, 2) middle, cloak / tail tips trailing back, 3) low, 4) middle, trailing parts swinging the other way. The body bobs up and down; no legs touch the ground.
```

### ATTACK (เกมใช้ตอนมอนตี)
```
ATTACK, 5 frames, its own attack (bite, claw, weapon swing, spell or slam — whatever fits the monster): 1) ready stance, 2) wind-up, pulling back, 3) strike at full reach toward down-right, 4) follow-through, 5) recovering back to the stance.
```

### HURT
```
HURT, 2 frames: 1) hit from the front — head and body jerk back, eyes squeezed shut, mouth open in pain, 2) recoiling, body bent and leaning back, about to recover. Same spot on the ground, no effects.
```

### DEATH
```
DEATH, 5 frames: 1) staggering back in shock, 2) knees buckling, falling, 3) hitting the ground, 4) lying on the ground motionless, 5) the same lying pose but fading / starting to dissolve (spirits and ghosts may break into wisps). Keep it cute-cartoon, no blood or gore.
```

### FIX WALK
```
The legs are not alternating. Redraw the walk: in frame 1 the LEFT leg is in front, in frame 3 the RIGHT leg is in front, and frames 2 and 4 are passing poses with the other leg lifted. Look at frames 1 and 3: the front leg must clearly be a different leg.
```
