# มอน 2.5D — ไวกิ้ง (โซนหิมะ)

เจ้าของ 2026-11-27 06:14 'ได้' (ต่อจาก ISO_MAP_TH.md §13: ฮีโร่ 2.5D แล้ว แมพเป็น iso แล้ว → มอนต้อง 2.5D ด้วย ทำทีละโซน ไวกิ้งก่อน)
ไฟล์นี้สร้างด้วย `python3 tools/monster25_prompts.py doc` — แก้ข้อความ / ข้อมูลมอนในไฟล์นั้น ไม่แก้ .md ตรงๆ

## หลัก
- มอนทุกตัว **คงดีไซน์เดิม** (ภาพในเกมตอนนี้) เปลี่ยนแค่การเรนเดอร์ให้เหมือนฮีโร่ 2.5D: มิติ 3D นุ่ม แรเงา 2–3 โทน แสงอุ่นซ้ายบน ขอบแสงเย็น เส้นขอบบาง สัดส่วนชิบิ
- แผ่นเดิม 5 แถว (ยืน 4 · เดิน 4 · โจมตี 5 · โดนตี 2 · ตาย 5) หันขวาล่าง → ตัดด้วย `tools/monster25_prompts.py cut` (ข้างล่าง)
- ตายเฟรม 5 = ท่าเดียวกับเฟรม 4 (เดิม ChatGPT วาดโปร่งใสแล้วสีเพี้ยนเป็นเขียวขี้ม้า เกมจางเองได้)
- พื้นเขียว ยกเว้นตัวที่มีสีเขียวบนตัว (มอส ใบไม้ ผิวโทรล ใบสน) = พื้นบานเย็น

## ทำยังไง
1. ChatGPT แชตใหม่ต่อกลุ่ม (ด้านล่าง) · แนบ 2 รูป: **บอร์ดของกลุ่มนั้น** (`monster25_board_viking<กลุ่ม>.jpg` — ภาพมอนตอนนี้ ใส่เลข #) + **`style_ref_wolf25.jpg`** (ฮีโร่ 2.5D = ลุค)
2. ส่งกล่องทีละกล่อง ได้แผ่นแล้วค่อยส่งกล่องถัดไปในแชตเดิม
3. **ลองลุคก่อน: กลุ่ม 1 กล่อง #1 แล้วส่งรูปให้ผมดู** — ผ่านแล้วค่อยทำตัวอื่น · ตั้งแต่กลุ่ม 2 แนบแผ่น 2.5D ที่ผ่านแล้ว 1 แผ่นเป็นรูปที่ 3 ด้วย (กล่องบอกให้ทำลุค / ขนาดในช่องตามนั้น)
4. รูปเสร็จ → ส่งมาทั้งแผ่น ผมตัดเข้าเกมเอง

## ตอนรูปมา
- ตัดด้วย `python3 -I tools/monster25_prompts.py cut <เลข> <แผ่น.png>` → `assets/monsters/<ไฟล์>25.webp` + บรรทัดใน `monster25.js` (สร้างเอง ไม่แก้มือ) · ขนาดในเกม (h) / บิน / เงา ลอกจากแผ่นเดิม · เกมใช้แผ่น 2.5D แทนแผ่นเดิมชื่อเดียวกันเลย · `?mon25=0` = กลับไปแผ่นเดิม (ไว้เทียบ)
- โหมดตัด = A (ช่องว่างสีพื้นระหว่างเฟรม) ไม่ใช่ W: แผ่น 2.5D ห่างกันชัด ไม่มีเอฟเฟกต์ลอย และโหมด W ตัดปีกไกลของค้างคาวไปติดเฟรมก่อนหน้า · เศษจุดเล็กโดนลบ เงาที่วาดใต้เท้าเก็บไว้ (เหมือนแผ่นเดิม)
- ตัวที่เข้าเกมแล้วมี ✓ ในตารางรายชื่อ
- หมาเงาเฟนเรียร์ (#38) ตอนนี้เป็นคลิปวิดีโอ (CLIPS.shadeHound) → แผ่น 2.5D แทนคลิปได้ หรือทำคลิปใหม่จากภาพยืน 2.5D (เลือกทีหลัง)
- บอสประจำแมพ / บอสโลก / มินิบอส ไม่อยู่ในไฟล์นี้ (บอสรอวิดีโอทีละท่าตามที่เจ้าของบอก)

## ประโยคแก้ (ต่อท้ายส่งในแชตเดิม)
- แบนเหมือนเดิม → `Redo: make it look like a 3D game character — stronger rounded volume and soft 3D shading, thinner outlines, keep the same design.`
- เหมือนจริง / มันวาว → `Redo: less realistic — matte painted textures, simple soft toon shading, clean thin outlines.`
- ดีไซน์เปลี่ยน → `Redo: keep the monster exactly like #<เลข> on the board — same shape, colours and details; only the rendering is 3D.`
- หันผิดทาง → `Redo: every frame faces down-right (south-east), seen from about 30 degrees above.`
- แถวไม่ครบ / ปนกัน → `Redo with exactly 5 rows: 4 idle, 4 walk, 5 attack, 2 hurt, 5 death frames, each frame in its own cell.`
- ตายเฟรมสุดท้ายโปร่ง → `Redo the last death frame as the same solid lying pose as frame 4.`

## รายชื่อ (44 ตัว)
| # | มอน (✓ = เข้าเกมแล้ว) | ไทย | แมพ | เดิน | พื้น | กลุ่ม |
|---|---|---|---|---|---|---|
| 1 | Snow Pup ✓ | ลูกหมาป่าหิมะ | snowpine | FOUR LEGS | เขียว | 1 |
| 2 | Pinecone Sprite ✓ | ภูตลูกสน | snowpine | TWO LEGS | บานเย็น | 1 |
| 3 | Fang Hare ✓ | กระต่ายเขี้ยวน้ำแข็ง | vikF2 | HOPPING | เขียว | 1 |
| 4 | Big Frostling ✓ | ฟรอสต์ลิงใหญ่ | vikF2 | TWO LEGS | เขียว | 1 |
| 5 | Icicle Bat ✓ | ค้างคาวหินย้อยน้ำแข็ง | vikF2 | FLYING | เขียว | 1 |
| 6 | Rune Wisp | ภูตหินรูน | vikF3 | FLOATING | เขียว | 2 |
| 7 | Moor Wolf | หมาป่าทุ่ง | vikF3 | FOUR LEGS | บานเย็น | 2 |
| 8 | Runestone Golem | โกเลมหินรูน | vikF3 | TWO LEGS | บานเย็น | 2 |
| 9 | Ice Crab | ปูหิมะ | vikF4 | MANY LEGS | เขียว | 2 |
| 10 | Fjord Seal Spirit | ภูตแมวน้ำ | vikF4 | SEAL-LIKE | เขียว | 2 |
| 11 | Narwhal Raider | นาร์วาลจอมปล้น | vikF4 | TWO LEGS | เขียว | 2 |
| 12 | Hound of the Raiders | หมาล่าเนื้อ | vikF5 | FOUR LEGS | เขียว | 2 |
| 13 | Lost Villager | ผีชาวบ้าน | vikF5 | FLOATING | เขียว | 2 |
| 14 | Thatch Troll | โทรลหลังคาฟาง | vikF5 | TWO LEGS | บานเย็น | 3 |
| 15 | Pass Wolf | หมาป่าหิมะ | vikF6 | FOUR LEGS | เขียว | 3 |
| 16 | Yeti Cub | ลูกเยติ | vikF6 | TWO LEGS | เขียว | 3 |
| 17 | Avalanche Ram | แกะเขาหิมะถล่ม | vikF6 | FOUR LEGS | เขียว | 3 |
| 18 | Mad Dwarf Ghost | วิญญาณคนแคระ | vikD1a | FLOATING | เขียว | 3 |
| 19 | Ore Golem | โกเลมแร่ | vikD1a | TWO LEGS | เขียว | 3 |
| 20 | Lamp Beetle | ด้วงตะเกียง | vikD1a | MANY LEGS | เขียว | 3 |
| 21 | Forge Golem | โกเลมเตาหลอม | vikD1b | TWO LEGS | เขียว | 3 |
| 22 | Ice Bat Pack | ค้างคาวน้ำแข็ง | vikD1b | FLYING | เขียว | 4 |
| 23 | Runesmith Revenant | ช่างรูนอมตะ | vikD1b | TWO LEGS | เขียว | 4 |
| 24 | Shadow Wolf | หมาป่าเงา | vikH1 | FOUR LEGS | เขียว | 4 |
| 25 | Forest Witchling | แม่มดป่า | vikH1 | TWO LEGS | บานเย็น | 4 |
| 26 | Blackpine Treant | ต้นสนดำมีชีวิต | vikH1 | TWO LEGS | บานเย็น | 4 |
| 27 | Young Yeti | เยติ | vikH2 | TWO LEGS | เขียว | 4 |
| 28 | Tundra Wolf | หมาป่าทุนดรา | vikH2 | FOUR LEGS | เขียว | 4 |
| 29 | Frost Mammoth Calf | ลูกช้างแมมมอธ | vikH2 | FOUR LEGS | เขียว | 4 |
| 30 | Fenrir Spawn | ลูกเฟนเรียร์ | vikD2a | FOUR LEGS | เขียว | 5 |
| 31 | Wolf Priest | นักบวชหมาป่า | vikD2a | TWO LEGS | เขียว | 5 |
| 32 | Gleipnir Weaver | ช่างทอโซ่เกลปเนียร์ | vikD2a | MANY LEGS | เขียว | 5 |
| 33 | Draugr Wolf | หมาป่าเดรากร์ | vikD2b | FOUR LEGS | เขียว | 5 |
| 34 | Draugr | เดรากร์ | vikD2b | TWO LEGS | เขียว | 5 |
| 35 | Chain Wraith | วิญญาณโซ่ | vikD2b | FLOATING | เขียว | 5 |
| 36 | Fenrir Guard | องครักษ์เฟนเรียร์ | vikD2c | FOUR LEGS | เขียว | 5 |
| 37 | Wolf High Priest | มหานักบวชหมาป่า | vikD2c | TWO LEGS | เขียว | 5 |
| 38 | Fenrir Shade Hound | หมาเงาเฟนเรียร์ | vikD2c | FOUR LEGS | เขียว | 6 |
| 39 | Undying Viking | ไวกิ้งอมตะ | vikE1 | TWO LEGS | เขียว | 6 |
| 40 | Sea Ghost Wolf | หมาป่าวิญญาณทะเล | vikE1 | FOUR LEGS | เขียว | 6 |
| 41 | Drowned Shieldmaiden | วาลคิรีจมน้ำ | vikE1 | TWO LEGS | เขียว | 6 |
| 42 | Frost Giant | ยักษ์น้ำแข็ง | vikE2 | TWO LEGS | เขียว | 6 |
| 43 | Dark Valkyrie Wolf | หมาป่าวาลคิรีมืด | vikE2 | FOUR LEGS | เขียว | 6 |
| 44 | Glacier Wyrmling | ลูกมังกรธารน้ำแข็ง | vikE2 | FOUR LEGS | เขียว | 6 |

## กลุ่ม 1 · #1–#5 · ป่าสนหิมะ + หุบเขี้ยวน้ำแข็ง (มอนของแมพทดลอง isoField) · #1 = ภาพลองลุค
แนบ: `monster25_board_viking1.jpg` + `style_ref_wolf25.jpg`

**#1 Snow Pup** · ลูกหมาป่าหิมะ (snowpine)
```
Make ONE sprite sheet of a monster for my 2.5D fantasy MMORPG (Ragnarok 3 style).

THE MONSTER: #1 SNOW PUP on the attached board of my current monsters (attached here or earlier in this chat) — tiny, the weakest monster of the game — a chubby fluffy white wolf pup with big round shiny blue eyes, pale-blue ear tips, paws and tail tip, a soft clump of snow on top of its head, two tiny fangs. Keep its design exactly: the same creature, shape, proportions, colours, clothes, weapon and details as on the board. Only the rendering changes.

LOOK: render it exactly like my attached 2.5D hero picture — a stylized 3D game character painted by hand: solid rounded 3D volume, soft toon shading in 2–3 tones that follows the forms, one warm key light from the upper left, a soft cool rim light on the shadow side, thin clean dark-brown outlines, matte painted textures (fur, stone, wood, iron, ice). Cute-but-dangerous chibi proportions (big head, short body) like the board. Not a flat 2D cartoon, no thick outlines, not photorealistic, not glossy plastic, not pixel art. If one of my finished 2.5D monster sheets is attached too, match its look, size in the frame and sheet layout.

CAMERA: the same game camera as the hero — about 30 degrees from above, three-quarter view, the monster facing DOWN-RIGHT (south-east) in every frame.

SHEET: ONE 1536×1024 image, 5 rows. The SAME monster in every frame — identical design, colours and size, never redesigned between frames. Every frame in its own equal-size cell with empty space around it; feet (or lowest point) on the same baseline within a row; nothing cropped, nothing overlapping another frame.
Row 1 — IDLE, 4 frames: calm breathing — neutral, body rises slightly, neutral, body sinks slightly with one small detail moving (ear, tail, cloak, flame).
Row 2 — WALK, 4 frames, four legs: trotting in place, diagonal pairs MUST alternate: 1) front-LEFT + back-RIGHT legs reach forward, 2) passing pose, legs under the body, 3) front-RIGHT + back-LEFT legs reach forward, 4) passing pose. Frames 1 and 3 clearly show different legs in front; the tail swings.
Row 3 — ATTACK, 5 frames: a little pounce forward with a nip, mouth open — 1) ready, 2) wind-up, 3) strike at full reach toward down-right, 4) follow-through, 5) back to ready.
Row 4 — HURT, 2 frames: 1) hit from the front, head and body jerk back, eyes squeezed shut, 2) recoiling, about to recover.
Row 5 — DEATH, 5 frames: 1) staggers back, 2) falling, 3) hits the ground, 4) lying still, 5) exactly the same lying pose as frame 4 (the game fades it out itself — do not draw it see-through). Cartoon, no blood.

Background: SOLID FLAT PURE GREEN (#00FF00) — no gradient, no ground, no cast shadow. NEVER use green on the monster: anything that would be green is drawn teal, turquoise, blue or gold instead. No text, no labels, no numbers, no borders, no motion lines, no dust, no magic effects floating around it (small glows ON the body are fine).
```

**#2 Pinecone Sprite** · ภูตลูกสน (snowpine)
```
Make ONE sprite sheet of a monster for my 2.5D fantasy MMORPG (Ragnarok 3 style).

THE MONSTER: #2 PINECONE SPRITE on the attached board of my current monsters (attached here or earlier in this chat) — small — a walking brown pinecone with snow on its top scales and two small dark-green pine sprigs sticking up from it, a dark hollow face with two glowing teal eyes, short stubby brown legs with red-striped wrappings, holding a crooked twig staff with a tiny pinecone and a dry orange leaf. Keep its design exactly: the same creature, shape, proportions, colours, clothes, weapon and details as on the board. Only the rendering changes.

LOOK: render it exactly like my attached 2.5D hero picture — a stylized 3D game character painted by hand: solid rounded 3D volume, soft toon shading in 2–3 tones that follows the forms, one warm key light from the upper left, a soft cool rim light on the shadow side, thin clean dark-brown outlines, matte painted textures (fur, stone, wood, iron, ice). Cute-but-dangerous chibi proportions (big head, short body) like the board. Not a flat 2D cartoon, no thick outlines, not photorealistic, not glossy plastic, not pixel art. If one of my finished 2.5D monster sheets is attached too, match its look, size in the frame and sheet layout.

CAMERA: the same game camera as the hero — about 30 degrees from above, three-quarter view, the monster facing DOWN-RIGHT (south-east) in every frame.

SHEET: ONE 1536×1024 image, 5 rows. The SAME monster in every frame — identical design, colours and size, never redesigned between frames. Every frame in its own equal-size cell with empty space around it; feet (or lowest point) on the same baseline within a row; nothing cropped, nothing overlapping another frame.
Row 1 — IDLE, 4 frames: calm breathing — neutral, body rises slightly, neutral, body sinks slightly with one small detail moving (ear, tail, cloak, flame).
Row 2 — WALK, 4 frames, two legs: walking in place, legs MUST alternate: 1) LEFT leg forward and planted, 2) passing pose with the RIGHT leg lifted, 3) RIGHT leg forward and planted, 4) passing pose with the LEFT leg lifted. Frames 1 and 3 clearly show a different leg in front; arms swing opposite to the legs.
Row 3 — ATTACK, 5 frames: jabs its twig staff forward with a small hop, a little teal spark at its tip — 1) ready, 2) wind-up, 3) strike at full reach toward down-right, 4) follow-through, 5) back to ready.
Row 4 — HURT, 2 frames: 1) hit from the front, head and body jerk back, eyes squeezed shut, 2) recoiling, about to recover.
Row 5 — DEATH, 5 frames: 1) staggers back, 2) falling, 3) hits the ground, 4) lying still, 5) exactly the same lying pose as frame 4 (the game fades it out itself — do not draw it see-through). Cartoon, no blood.

Background: SOLID FLAT PURE MAGENTA (#FF00FF) — no gradient, no ground, no cast shadow. NEVER use magenta, pink or purple on the monster (its greens stay green). No text, no labels, no numbers, no borders, no motion lines, no dust, no magic effects floating around it (small glows ON the body are fine).
```

**#3 Fang Hare** · กระต่ายเขี้ยวน้ำแข็ง (vikF2)
```
Make ONE sprite sheet of a monster for my 2.5D fantasy MMORPG (Ragnarok 3 style).

THE MONSTER: #3 FANG HARE on the attached board of my current monsters (attached here or earlier in this chat) — small — a fluffy white hare with a soft pale-pink tint, long ears with pink insides and pale-blue tips, angry red eyes, two long ice-blue fangs, a small blue ribbon bow on its neck. Keep its design exactly: the same creature, shape, proportions, colours, clothes, weapon and details as on the board. Only the rendering changes.

LOOK: render it exactly like my attached 2.5D hero picture — a stylized 3D game character painted by hand: solid rounded 3D volume, soft toon shading in 2–3 tones that follows the forms, one warm key light from the upper left, a soft cool rim light on the shadow side, thin clean dark-brown outlines, matte painted textures (fur, stone, wood, iron, ice). Cute-but-dangerous chibi proportions (big head, short body) like the board. Not a flat 2D cartoon, no thick outlines, not photorealistic, not glossy plastic, not pixel art. If one of my finished 2.5D monster sheets is attached too, match its look, size in the frame and sheet layout.

CAMERA: the same game camera as the hero — about 30 degrees from above, three-quarter view, the monster facing DOWN-RIGHT (south-east) in every frame.

SHEET: ONE 1536×1024 image, 5 rows. The SAME monster in every frame — identical design, colours and size, never redesigned between frames. Every frame in its own equal-size cell with empty space around it; feet (or lowest point) on the same baseline within a row; nothing cropped, nothing overlapping another frame.
Row 1 — IDLE, 4 frames: calm breathing — neutral, body rises slightly, neutral, body sinks slightly with one small detail moving (ear, tail, cloak, flame).
Row 2 — WALK, 4 frames, hopping: 1) crouched low, 2) pushing off, 3) highest point in the air, 4) landing squashed.
Row 3 — ATTACK, 5 frames: rears up on its hind legs and bites down with its two long ice fangs — 1) ready, 2) wind-up, 3) strike at full reach toward down-right, 4) follow-through, 5) back to ready.
Row 4 — HURT, 2 frames: 1) hit from the front, head and body jerk back, eyes squeezed shut, 2) recoiling, about to recover.
Row 5 — DEATH, 5 frames: 1) staggers back, 2) falling, 3) hits the ground, 4) lying still, 5) exactly the same lying pose as frame 4 (the game fades it out itself — do not draw it see-through). Cartoon, no blood.

Background: SOLID FLAT PURE GREEN (#00FF00) — no gradient, no ground, no cast shadow. NEVER use green on the monster: anything that would be green is drawn teal, turquoise, blue or gold instead. No text, no labels, no numbers, no borders, no motion lines, no dust, no magic effects floating around it (small glows ON the body are fine).
```

**#4 Big Frostling** · ฟรอสต์ลิงใหญ่ (vikF2)
```
Make ONE sprite sheet of a monster for my 2.5D fantasy MMORPG (Ragnarok 3 style).

THE MONSTER: #4 BIG FROSTLING on the attached board of my current monsters (attached here or earlier in this chat) — medium — a stocky furry snow creature with shaggy white fur, sharp pale-blue ice crystals growing from its head and shoulders, glowing blue eyes, small icy fangs, a brown leather belt, carrying a club of blue ice crystals on a short wooden handle. Keep its design exactly: the same creature, shape, proportions, colours, clothes, weapon and details as on the board. Only the rendering changes.

LOOK: render it exactly like my attached 2.5D hero picture — a stylized 3D game character painted by hand: solid rounded 3D volume, soft toon shading in 2–3 tones that follows the forms, one warm key light from the upper left, a soft cool rim light on the shadow side, thin clean dark-brown outlines, matte painted textures (fur, stone, wood, iron, ice). Cute-but-dangerous chibi proportions (big head, short body) like the board. Not a flat 2D cartoon, no thick outlines, not photorealistic, not glossy plastic, not pixel art. If one of my finished 2.5D monster sheets is attached too, match its look, size in the frame and sheet layout.

CAMERA: the same game camera as the hero — about 30 degrees from above, three-quarter view, the monster facing DOWN-RIGHT (south-east) in every frame.

SHEET: ONE 1536×1024 image, 5 rows. The SAME monster in every frame — identical design, colours and size, never redesigned between frames. Every frame in its own equal-size cell with empty space around it; feet (or lowest point) on the same baseline within a row; nothing cropped, nothing overlapping another frame.
Row 1 — IDLE, 4 frames: calm breathing — neutral, body rises slightly, neutral, body sinks slightly with one small detail moving (ear, tail, cloak, flame).
Row 2 — WALK, 4 frames, two legs: walking in place, legs MUST alternate: 1) LEFT leg forward and planted, 2) passing pose with the RIGHT leg lifted, 3) RIGHT leg forward and planted, 4) passing pose with the LEFT leg lifted. Frames 1 and 3 clearly show a different leg in front; arms swing opposite to the legs.
Row 3 — ATTACK, 5 frames: swings its ice-crystal club over its head and smashes it down in front — 1) ready, 2) wind-up, 3) strike at full reach toward down-right, 4) follow-through, 5) back to ready.
Row 4 — HURT, 2 frames: 1) hit from the front, head and body jerk back, eyes squeezed shut, 2) recoiling, about to recover.
Row 5 — DEATH, 5 frames: 1) staggers back, 2) falling, 3) hits the ground, 4) lying still, 5) exactly the same lying pose as frame 4 (the game fades it out itself — do not draw it see-through). Cartoon, no blood.

Background: SOLID FLAT PURE GREEN (#00FF00) — no gradient, no ground, no cast shadow. NEVER use green on the monster: anything that would be green is drawn teal, turquoise, blue or gold instead. No text, no labels, no numbers, no borders, no motion lines, no dust, no magic effects floating around it (small glows ON the body are fine).
```

**#5 Icicle Bat** · ค้างคาวหินย้อยน้ำแข็ง (vikF2)
```
Make ONE sprite sheet of a monster for my 2.5D fantasy MMORPG (Ragnarok 3 style).

THE MONSTER: #5 ICICLE BAT on the attached board of my current monsters (attached here or earlier in this chat) — small — a small fluffy lavender-white bat with big pointed ears, glowing cyan eyes, frosty pale-blue wings with icicle tips, a tiny red scarf. Keep its design exactly: the same creature, shape, proportions, colours, clothes, weapon and details as on the board. Only the rendering changes.

LOOK: render it exactly like my attached 2.5D hero picture — a stylized 3D game character painted by hand: solid rounded 3D volume, soft toon shading in 2–3 tones that follows the forms, one warm key light from the upper left, a soft cool rim light on the shadow side, thin clean dark-brown outlines, matte painted textures (fur, stone, wood, iron, ice). Cute-but-dangerous chibi proportions (big head, short body) like the board. Not a flat 2D cartoon, no thick outlines, not photorealistic, not glossy plastic, not pixel art. If one of my finished 2.5D monster sheets is attached too, match its look, size in the frame and sheet layout.

CAMERA: the same game camera as the hero — about 30 degrees from above, three-quarter view, the monster facing DOWN-RIGHT (south-east) in every frame.

SHEET: ONE 1536×1024 image, 5 rows. The SAME monster in every frame — identical design, colours and size, never redesigned between frames. Every frame in its own equal-size cell with empty space around it; feet (or lowest point) on the same baseline within a row; nothing cropped, nothing overlapping another frame.
Row 1 — IDLE, 4 frames: calm breathing — neutral, body rises slightly, neutral, body sinks slightly with one small detail moving (ear, tail, cloak, flame).
Row 2 — WALK, 4 frames, flying: hovering in place: 1) wings up, 2) wings half down, 3) wings fully down, 4) wings half up; the body bobs a little, feet tucked.
Row 3 — ATTACK, 5 frames: dives forward and bites, mouth wide open — 1) ready, 2) wind-up, 3) strike at full reach toward down-right, 4) follow-through, 5) back to ready.
Row 4 — HURT, 2 frames: 1) hit from the front, head and body jerk back, eyes squeezed shut, 2) recoiling, about to recover.
Row 5 — DEATH, 5 frames: 1) staggers back, 2) falling, 3) hits the ground, 4) lying still, 5) exactly the same lying pose as frame 4 (the game fades it out itself — do not draw it see-through). Cartoon, no blood.

Background: SOLID FLAT PURE GREEN (#00FF00) — no gradient, no ground, no cast shadow. NEVER use green on the monster: anything that would be green is drawn teal, turquoise, blue or gold instead. No text, no labels, no numbers, no borders, no motion lines, no dust, no magic effects floating around it (small glows ON the body are fine).
```


## กลุ่ม 2 · #6–#13 · ทุ่งหินรูน · ฟยอร์ดน้ำแข็ง · หมู่บ้านไวกิ้งร้าง
แนบ: `monster25_board_viking2.jpg` + `style_ref_wolf25.jpg` + แผ่น 2.5D ที่ผ่านแล้ว 1 แผ่น

**#6 Rune Wisp** · ภูตหินรูน (vikF3)
```
Make ONE sprite sheet of a monster for my 2.5D fantasy MMORPG (Ragnarok 3 style).

THE MONSTER: #6 RUNE WISP on the attached board of my current monsters (attached here or earlier in this chat) — small — a floating little spirit made of soft pale-teal flame with a cute round face and two glowing eyes, holding in front of it a round grey stone carved with one glowing teal rune mark (a simple angular mark, not a letter), three small grey pebbles floating around it, small teal flames for hands. Keep its design exactly: the same creature, shape, proportions, colours, clothes, weapon and details as on the board. Only the rendering changes.

LOOK: render it exactly like my attached 2.5D hero picture — a stylized 3D game character painted by hand: solid rounded 3D volume, soft toon shading in 2–3 tones that follows the forms, one warm key light from the upper left, a soft cool rim light on the shadow side, thin clean dark-brown outlines, matte painted textures (fur, stone, wood, iron, ice). Cute-but-dangerous chibi proportions (big head, short body) like the board. Not a flat 2D cartoon, no thick outlines, not photorealistic, not glossy plastic, not pixel art. If one of my finished 2.5D monster sheets is attached too, match its look, size in the frame and sheet layout.

CAMERA: the same game camera as the hero — about 30 degrees from above, three-quarter view, the monster facing DOWN-RIGHT (south-east) in every frame.

SHEET: ONE 1536×1024 image, 5 rows. The SAME monster in every frame — identical design, colours and size, never redesigned between frames. Every frame in its own equal-size cell with empty space around it; feet (or lowest point) on the same baseline within a row; nothing cropped, nothing overlapping another frame.
Row 1 — IDLE, 4 frames: calm breathing — neutral, body rises slightly, neutral, body sinks slightly with one small detail moving (ear, tail, cloak, flame).
Row 2 — WALK, 4 frames, floating: 1) high, leaning forward, 2) middle, trailing parts swept back, 3) low, 4) middle, trailing parts swinging the other way. Nothing touches the ground.
Row 3 — ATTACK, 5 frames: pushes its rune stone forward and flings a small teal flame ball (the ball just leaving its hand) — 1) ready, 2) wind-up, 3) strike at full reach toward down-right, 4) follow-through, 5) back to ready.
Row 4 — HURT, 2 frames: 1) hit from the front, head and body jerk back, eyes squeezed shut, 2) recoiling, about to recover.
Row 5 — DEATH, 5 frames: 1) staggers back, 2) falling, 3) hits the ground, 4) lying still, 5) exactly the same lying pose as frame 4 (the game fades it out itself — do not draw it see-through). Cartoon, no blood.

Background: SOLID FLAT PURE GREEN (#00FF00) — no gradient, no ground, no cast shadow. NEVER use green on the monster: anything that would be green is drawn teal, turquoise, blue or gold instead. No text, no labels, no numbers, no borders, no motion lines, no dust, no magic effects floating around it (small glows ON the body are fine).
```

**#7 Moor Wolf** · หมาป่าทุ่ง (vikF3)
```
Make ONE sprite sheet of a monster for my 2.5D fantasy MMORPG (Ragnarok 3 style).

THE MONSTER: #7 MOOR WOLF on the attached board of my current monsters (attached here or earlier in this chat) — medium — a shaggy brown wolf with patches of green moss growing on its back and shoulders, a cream muzzle, chest and paws, yellow eyes, a leather collar with small teal studs. Keep its design exactly: the same creature, shape, proportions, colours, clothes, weapon and details as on the board. Only the rendering changes.

LOOK: render it exactly like my attached 2.5D hero picture — a stylized 3D game character painted by hand: solid rounded 3D volume, soft toon shading in 2–3 tones that follows the forms, one warm key light from the upper left, a soft cool rim light on the shadow side, thin clean dark-brown outlines, matte painted textures (fur, stone, wood, iron, ice). Cute-but-dangerous chibi proportions (big head, short body) like the board. Not a flat 2D cartoon, no thick outlines, not photorealistic, not glossy plastic, not pixel art. If one of my finished 2.5D monster sheets is attached too, match its look, size in the frame and sheet layout.

CAMERA: the same game camera as the hero — about 30 degrees from above, three-quarter view, the monster facing DOWN-RIGHT (south-east) in every frame.

SHEET: ONE 1536×1024 image, 5 rows. The SAME monster in every frame — identical design, colours and size, never redesigned between frames. Every frame in its own equal-size cell with empty space around it; feet (or lowest point) on the same baseline within a row; nothing cropped, nothing overlapping another frame.
Row 1 — IDLE, 4 frames: calm breathing — neutral, body rises slightly, neutral, body sinks slightly with one small detail moving (ear, tail, cloak, flame).
Row 2 — WALK, 4 frames, four legs: trotting in place, diagonal pairs MUST alternate: 1) front-LEFT + back-RIGHT legs reach forward, 2) passing pose, legs under the body, 3) front-RIGHT + back-LEFT legs reach forward, 4) passing pose. Frames 1 and 3 clearly show different legs in front; the tail swings.
Row 3 — ATTACK, 5 frames: a lunging bite — 1) ready, 2) wind-up, 3) strike at full reach toward down-right, 4) follow-through, 5) back to ready.
Row 4 — HURT, 2 frames: 1) hit from the front, head and body jerk back, eyes squeezed shut, 2) recoiling, about to recover.
Row 5 — DEATH, 5 frames: 1) staggers back, 2) falling, 3) hits the ground, 4) lying still, 5) exactly the same lying pose as frame 4 (the game fades it out itself — do not draw it see-through). Cartoon, no blood.

Background: SOLID FLAT PURE MAGENTA (#FF00FF) — no gradient, no ground, no cast shadow. NEVER use magenta, pink or purple on the monster (its greens stay green). No text, no labels, no numbers, no borders, no motion lines, no dust, no magic effects floating around it (small glows ON the body are fine).
```

**#8 Runestone Golem** · โกเลมหินรูน (vikF3)
```
Make ONE sprite sheet of a monster for my 2.5D fantasy MMORPG (Ragnarok 3 style).

THE MONSTER: #8 RUNESTONE GOLEM on the attached board of my current monsters (attached here or earlier in this chat) — large — a hulking golem built from grey-brown stone blocks, green moss and a few small white flowers growing on its shoulders and head, a glowing teal rune mark carved on its chest stone (an angular mark, not a letter), small dark eyes in a block head, orange rope wound round one arm. Keep its design exactly: the same creature, shape, proportions, colours, clothes, weapon and details as on the board. Only the rendering changes.

LOOK: render it exactly like my attached 2.5D hero picture — a stylized 3D game character painted by hand: solid rounded 3D volume, soft toon shading in 2–3 tones that follows the forms, one warm key light from the upper left, a soft cool rim light on the shadow side, thin clean dark-brown outlines, matte painted textures (fur, stone, wood, iron, ice). Cute-but-dangerous chibi proportions (big head, short body) like the board. Not a flat 2D cartoon, no thick outlines, not photorealistic, not glossy plastic, not pixel art. If one of my finished 2.5D monster sheets is attached too, match its look, size in the frame and sheet layout.

CAMERA: the same game camera as the hero — about 30 degrees from above, three-quarter view, the monster facing DOWN-RIGHT (south-east) in every frame.

SHEET: ONE 1536×1024 image, 5 rows. The SAME monster in every frame — identical design, colours and size, never redesigned between frames. Every frame in its own equal-size cell with empty space around it; feet (or lowest point) on the same baseline within a row; nothing cropped, nothing overlapping another frame.
Row 1 — IDLE, 4 frames: calm breathing — neutral, body rises slightly, neutral, body sinks slightly with one small detail moving (ear, tail, cloak, flame).
Row 2 — WALK, 4 frames, two legs: walking in place, legs MUST alternate: 1) LEFT leg forward and planted, 2) passing pose with the RIGHT leg lifted, 3) RIGHT leg forward and planted, 4) passing pose with the LEFT leg lifted. Frames 1 and 3 clearly show a different leg in front; arms swing opposite to the legs.
Row 3 — ATTACK, 5 frames: raises both stone fists and slams them down on the ground in front — 1) ready, 2) wind-up, 3) strike at full reach toward down-right, 4) follow-through, 5) back to ready.
Row 4 — HURT, 2 frames: 1) hit from the front, head and body jerk back, eyes squeezed shut, 2) recoiling, about to recover.
Row 5 — DEATH, 5 frames: 1) staggers back, 2) falling, 3) hits the ground, 4) lying still, 5) exactly the same lying pose as frame 4 (the game fades it out itself — do not draw it see-through). Cartoon, no blood.

Background: SOLID FLAT PURE MAGENTA (#FF00FF) — no gradient, no ground, no cast shadow. NEVER use magenta, pink or purple on the monster (its greens stay green). No text, no labels, no numbers, no borders, no motion lines, no dust, no magic effects floating around it (small glows ON the body are fine).
```

**#9 Ice Crab** · ปูหิมะ (vikF4)
```
Make ONE sprite sheet of a monster for my 2.5D fantasy MMORPG (Ragnarok 3 style).

THE MONSTER: #9 ICE CRAB on the attached board of my current monsters (attached here or earlier in this chat) — small — an orange-red crab whose shell is covered in snow and spiky pale-blue ice crystals, one claw made of solid ice, small stalk eyes. Keep its design exactly: the same creature, shape, proportions, colours, clothes, weapon and details as on the board. Only the rendering changes.

LOOK: render it exactly like my attached 2.5D hero picture — a stylized 3D game character painted by hand: solid rounded 3D volume, soft toon shading in 2–3 tones that follows the forms, one warm key light from the upper left, a soft cool rim light on the shadow side, thin clean dark-brown outlines, matte painted textures (fur, stone, wood, iron, ice). Cute-but-dangerous chibi proportions (big head, short body) like the board. Not a flat 2D cartoon, no thick outlines, not photorealistic, not glossy plastic, not pixel art. If one of my finished 2.5D monster sheets is attached too, match its look, size in the frame and sheet layout.

CAMERA: the same game camera as the hero — about 30 degrees from above, three-quarter view, the monster facing DOWN-RIGHT (south-east) in every frame.

SHEET: ONE 1536×1024 image, 5 rows. The SAME monster in every frame — identical design, colours and size, never redesigned between frames. Every frame in its own equal-size cell with empty space around it; feet (or lowest point) on the same baseline within a row; nothing cropped, nothing overlapping another frame.
Row 1 — IDLE, 4 frames: calm breathing — neutral, body rises slightly, neutral, body sinks slightly with one small detail moving (ear, tail, cloak, flame).
Row 2 — WALK, 4 frames, many legs: the legs move in two alternating groups: 1) group A reaches forward, 2) passing pose, 3) group B reaches forward, 4) passing pose. Frames 1 and 3 clearly differ.
Row 3 — ATTACK, 5 frames: snaps its big ice claw forward — 1) ready, 2) wind-up, 3) strike at full reach toward down-right, 4) follow-through, 5) back to ready.
Row 4 — HURT, 2 frames: 1) hit from the front, head and body jerk back, eyes squeezed shut, 2) recoiling, about to recover.
Row 5 — DEATH, 5 frames: 1) staggers back, 2) falling, 3) hits the ground, 4) lying still, 5) exactly the same lying pose as frame 4 (the game fades it out itself — do not draw it see-through). Cartoon, no blood.

Background: SOLID FLAT PURE GREEN (#00FF00) — no gradient, no ground, no cast shadow. NEVER use green on the monster: anything that would be green is drawn teal, turquoise, blue or gold instead. No text, no labels, no numbers, no borders, no motion lines, no dust, no magic effects floating around it (small glows ON the body are fine).
```

**#10 Fjord Seal Spirit** · ภูตแมวน้ำ (vikF4)
```
Make ONE sprite sheet of a monster for my 2.5D fantasy MMORPG (Ragnarok 3 style).

THE MONSTER: #10 FJORD SEAL SPIRIT on the attached board of my current monsters (attached here or earlier in this chat) — small — a seal made of clear light-blue sea water with white foam swirls on its body and tail, shiny dark eyes, a little brown rope knot on one flipper, a few water drops on its back. Keep its design exactly: the same creature, shape, proportions, colours, clothes, weapon and details as on the board. Only the rendering changes.

LOOK: render it exactly like my attached 2.5D hero picture — a stylized 3D game character painted by hand: solid rounded 3D volume, soft toon shading in 2–3 tones that follows the forms, one warm key light from the upper left, a soft cool rim light on the shadow side, thin clean dark-brown outlines, matte painted textures (fur, stone, wood, iron, ice). Cute-but-dangerous chibi proportions (big head, short body) like the board. Not a flat 2D cartoon, no thick outlines, not photorealistic, not glossy plastic, not pixel art. If one of my finished 2.5D monster sheets is attached too, match its look, size in the frame and sheet layout.

CAMERA: the same game camera as the hero — about 30 degrees from above, three-quarter view, the monster facing DOWN-RIGHT (south-east) in every frame.

SHEET: ONE 1536×1024 image, 5 rows. The SAME monster in every frame — identical design, colours and size, never redesigned between frames. Every frame in its own equal-size cell with empty space around it; feet (or lowest point) on the same baseline within a row; nothing cropped, nothing overlapping another frame.
Row 1 — IDLE, 4 frames: calm breathing — neutral, body rises slightly, neutral, body sinks slightly with one small detail moving (ear, tail, cloak, flame).
Row 2 — WALK, 4 frames, seal-like: humping forward in place on its belly: 1) the front of the body lifted on the flippers, 2) the back arched, tail end pulled forward, 3) the front lands flat with the flippers out, 4) the body stretched long.
Row 3 — ATTACK, 5 frames: rears up and spits a ball of water forward (the ball just leaving its mouth) — 1) ready, 2) wind-up, 3) strike at full reach toward down-right, 4) follow-through, 5) back to ready.
Row 4 — HURT, 2 frames: 1) hit from the front, head and body jerk back, eyes squeezed shut, 2) recoiling, about to recover.
Row 5 — DEATH, 5 frames: 1) staggers back, 2) falling, 3) hits the ground, 4) lying still, 5) exactly the same lying pose as frame 4 (the game fades it out itself — do not draw it see-through). Cartoon, no blood.

Background: SOLID FLAT PURE GREEN (#00FF00) — no gradient, no ground, no cast shadow. NEVER use green on the monster: anything that would be green is drawn teal, turquoise, blue or gold instead. No text, no labels, no numbers, no borders, no motion lines, no dust, no magic effects floating around it (small glows ON the body are fine).
```

**#11 Narwhal Raider** · นาร์วาลจอมปล้น (vikF4)
```
Make ONE sprite sheet of a monster for my 2.5D fantasy MMORPG (Ragnarok 3 style).

THE MONSTER: #11 NARWHAL RAIDER on the attached board of my current monsters (attached here or earlier in this chat) — medium — a grey-blue narwhal standing upright like a little Viking: a long twisted ivory horn on its forehead coming out under a horned iron Viking helmet, a cream fur cape, a brown leather belt, a round wooden shield with an iron rim. Keep its design exactly: the same creature, shape, proportions, colours, clothes, weapon and details as on the board. Only the rendering changes.

LOOK: render it exactly like my attached 2.5D hero picture — a stylized 3D game character painted by hand: solid rounded 3D volume, soft toon shading in 2–3 tones that follows the forms, one warm key light from the upper left, a soft cool rim light on the shadow side, thin clean dark-brown outlines, matte painted textures (fur, stone, wood, iron, ice). Cute-but-dangerous chibi proportions (big head, short body) like the board. Not a flat 2D cartoon, no thick outlines, not photorealistic, not glossy plastic, not pixel art. If one of my finished 2.5D monster sheets is attached too, match its look, size in the frame and sheet layout.

CAMERA: the same game camera as the hero — about 30 degrees from above, three-quarter view, the monster facing DOWN-RIGHT (south-east) in every frame.

SHEET: ONE 1536×1024 image, 5 rows. The SAME monster in every frame — identical design, colours and size, never redesigned between frames. Every frame in its own equal-size cell with empty space around it; feet (or lowest point) on the same baseline within a row; nothing cropped, nothing overlapping another frame.
Row 1 — IDLE, 4 frames: calm breathing — neutral, body rises slightly, neutral, body sinks slightly with one small detail moving (ear, tail, cloak, flame).
Row 2 — WALK, 4 frames, two legs: walking in place, legs MUST alternate: 1) LEFT leg forward and planted, 2) passing pose with the RIGHT leg lifted, 3) RIGHT leg forward and planted, 4) passing pose with the LEFT leg lifted. Frames 1 and 3 clearly show a different leg in front; arms swing opposite to the legs.
Row 3 — ATTACK, 5 frames: lowers its head and thrusts its long horn forward from behind its shield — 1) ready, 2) wind-up, 3) strike at full reach toward down-right, 4) follow-through, 5) back to ready.
Row 4 — HURT, 2 frames: 1) hit from the front, head and body jerk back, eyes squeezed shut, 2) recoiling, about to recover.
Row 5 — DEATH, 5 frames: 1) staggers back, 2) falling, 3) hits the ground, 4) lying still, 5) exactly the same lying pose as frame 4 (the game fades it out itself — do not draw it see-through). Cartoon, no blood.

Background: SOLID FLAT PURE GREEN (#00FF00) — no gradient, no ground, no cast shadow. NEVER use green on the monster: anything that would be green is drawn teal, turquoise, blue or gold instead. No text, no labels, no numbers, no borders, no motion lines, no dust, no magic effects floating around it (small glows ON the body are fine).
```

**#12 Hound of the Raiders** · หมาล่าเนื้อ (vikF5)
```
Make ONE sprite sheet of a monster for my 2.5D fantasy MMORPG (Ragnarok 3 style).

THE MONSTER: #12 HOUND OF THE RAIDERS on the attached board of my current monsters (attached here or earlier in this chat) — medium — a brown war hound wearing spiked brown leather armour plates with iron rivets on its back, red war-paint stripes on its face and legs, yellow eyes, a bandage on one leg. Keep its design exactly: the same creature, shape, proportions, colours, clothes, weapon and details as on the board. Only the rendering changes.

LOOK: render it exactly like my attached 2.5D hero picture — a stylized 3D game character painted by hand: solid rounded 3D volume, soft toon shading in 2–3 tones that follows the forms, one warm key light from the upper left, a soft cool rim light on the shadow side, thin clean dark-brown outlines, matte painted textures (fur, stone, wood, iron, ice). Cute-but-dangerous chibi proportions (big head, short body) like the board. Not a flat 2D cartoon, no thick outlines, not photorealistic, not glossy plastic, not pixel art. If one of my finished 2.5D monster sheets is attached too, match its look, size in the frame and sheet layout.

CAMERA: the same game camera as the hero — about 30 degrees from above, three-quarter view, the monster facing DOWN-RIGHT (south-east) in every frame.

SHEET: ONE 1536×1024 image, 5 rows. The SAME monster in every frame — identical design, colours and size, never redesigned between frames. Every frame in its own equal-size cell with empty space around it; feet (or lowest point) on the same baseline within a row; nothing cropped, nothing overlapping another frame.
Row 1 — IDLE, 4 frames: calm breathing — neutral, body rises slightly, neutral, body sinks slightly with one small detail moving (ear, tail, cloak, flame).
Row 2 — WALK, 4 frames, four legs: trotting in place, diagonal pairs MUST alternate: 1) front-LEFT + back-RIGHT legs reach forward, 2) passing pose, legs under the body, 3) front-RIGHT + back-LEFT legs reach forward, 4) passing pose. Frames 1 and 3 clearly show different legs in front; the tail swings.
Row 3 — ATTACK, 5 frames: a lunging bite — 1) ready, 2) wind-up, 3) strike at full reach toward down-right, 4) follow-through, 5) back to ready.
Row 4 — HURT, 2 frames: 1) hit from the front, head and body jerk back, eyes squeezed shut, 2) recoiling, about to recover.
Row 5 — DEATH, 5 frames: 1) staggers back, 2) falling, 3) hits the ground, 4) lying still, 5) exactly the same lying pose as frame 4 (the game fades it out itself — do not draw it see-through). Cartoon, no blood.

Background: SOLID FLAT PURE GREEN (#00FF00) — no gradient, no ground, no cast shadow. NEVER use green on the monster: anything that would be green is drawn teal, turquoise, blue or gold instead. No text, no labels, no numbers, no borders, no motion lines, no dust, no magic effects floating around it (small glows ON the body are fine).
```

**#13 Lost Villager** · ผีชาวบ้าน (vikF5)
```
Make ONE sprite sheet of a monster for my 2.5D fantasy MMORPG (Ragnarok 3 style).

THE MONSTER: #13 LOST VILLAGER on the attached board of my current monsters (attached here or earlier in this chat) — medium — the sad ghost of a grey cat villager: grey-and-white cat face with pointed ears, pale glowing teal eyes, a torn brown hooded cloak with patches, a faded red scarf, holding a rusty pitchfork and an old iron lantern with a teal flame, its lower body fading into pale teal mist. Keep its design exactly: the same creature, shape, proportions, colours, clothes, weapon and details as on the board. Only the rendering changes.

LOOK: render it exactly like my attached 2.5D hero picture — a stylized 3D game character painted by hand: solid rounded 3D volume, soft toon shading in 2–3 tones that follows the forms, one warm key light from the upper left, a soft cool rim light on the shadow side, thin clean dark-brown outlines, matte painted textures (fur, stone, wood, iron, ice). Cute-but-dangerous chibi proportions (big head, short body) like the board. Not a flat 2D cartoon, no thick outlines, not photorealistic, not glossy plastic, not pixel art. If one of my finished 2.5D monster sheets is attached too, match its look, size in the frame and sheet layout.

CAMERA: the same game camera as the hero — about 30 degrees from above, three-quarter view, the monster facing DOWN-RIGHT (south-east) in every frame.

SHEET: ONE 1536×1024 image, 5 rows. The SAME monster in every frame — identical design, colours and size, never redesigned between frames. Every frame in its own equal-size cell with empty space around it; feet (or lowest point) on the same baseline within a row; nothing cropped, nothing overlapping another frame.
Row 1 — IDLE, 4 frames: calm breathing — neutral, body rises slightly, neutral, body sinks slightly with one small detail moving (ear, tail, cloak, flame).
Row 2 — WALK, 4 frames, floating: 1) high, leaning forward, 2) middle, trailing parts swept back, 3) low, 4) middle, trailing parts swinging the other way. Nothing touches the ground.
Row 3 — ATTACK, 5 frames: pokes forward with its pitchfork — 1) ready, 2) wind-up, 3) strike at full reach toward down-right, 4) follow-through, 5) back to ready.
Row 4 — HURT, 2 frames: 1) hit from the front, head and body jerk back, eyes squeezed shut, 2) recoiling, about to recover.
Row 5 — DEATH, 5 frames: 1) staggers back, 2) falling, 3) hits the ground, 4) lying still, 5) exactly the same lying pose as frame 4 (the game fades it out itself — do not draw it see-through). Cartoon, no blood.

Background: SOLID FLAT PURE GREEN (#00FF00) — no gradient, no ground, no cast shadow. NEVER use green on the monster: anything that would be green is drawn teal, turquoise, blue or gold instead. No text, no labels, no numbers, no borders, no motion lines, no dust, no magic effects floating around it (small glows ON the body are fine).
```


## กลุ่ม 3 · #14–#21 · หมู่บ้านไวกิ้งร้าง · ช่องเขาหมาป่า · เหมืองคนแคระ ชั้น 1–2
แนบ: `monster25_board_viking3.jpg` + `style_ref_wolf25.jpg` + แผ่น 2.5D ที่ผ่านแล้ว 1 แผ่น

**#14 Thatch Troll** · โทรลหลังคาฟาง (vikF5)
```
Make ONE sprite sheet of a monster for my 2.5D fantasy MMORPG (Ragnarok 3 style).

THE MONSTER: #14 THATCH TROLL on the attached board of my current monsters (attached here or earlier in this chat) — large — a big hunched olive-green troll with mottled skin, its back and head covered by a straw-thatched roof like a hut roof with a small brick chimney on top, a big round nose (darker olive, never pink), one small tusk, a bandaged arm, an iron shackle on one wrist, holding a broken wooden log as a club. Keep its design exactly: the same creature, shape, proportions, colours, clothes, weapon and details as on the board. Only the rendering changes.

LOOK: render it exactly like my attached 2.5D hero picture — a stylized 3D game character painted by hand: solid rounded 3D volume, soft toon shading in 2–3 tones that follows the forms, one warm key light from the upper left, a soft cool rim light on the shadow side, thin clean dark-brown outlines, matte painted textures (fur, stone, wood, iron, ice). Cute-but-dangerous chibi proportions (big head, short body) like the board. Not a flat 2D cartoon, no thick outlines, not photorealistic, not glossy plastic, not pixel art. If one of my finished 2.5D monster sheets is attached too, match its look, size in the frame and sheet layout.

CAMERA: the same game camera as the hero — about 30 degrees from above, three-quarter view, the monster facing DOWN-RIGHT (south-east) in every frame.

SHEET: ONE 1536×1024 image, 5 rows. The SAME monster in every frame — identical design, colours and size, never redesigned between frames. Every frame in its own equal-size cell with empty space around it; feet (or lowest point) on the same baseline within a row; nothing cropped, nothing overlapping another frame.
Row 1 — IDLE, 4 frames: calm breathing — neutral, body rises slightly, neutral, body sinks slightly with one small detail moving (ear, tail, cloak, flame).
Row 2 — WALK, 4 frames, two legs: walking in place, legs MUST alternate: 1) LEFT leg forward and planted, 2) passing pose with the RIGHT leg lifted, 3) RIGHT leg forward and planted, 4) passing pose with the LEFT leg lifted. Frames 1 and 3 clearly show a different leg in front; arms swing opposite to the legs.
Row 3 — ATTACK, 5 frames: swings its log club down in front — 1) ready, 2) wind-up, 3) strike at full reach toward down-right, 4) follow-through, 5) back to ready.
Row 4 — HURT, 2 frames: 1) hit from the front, head and body jerk back, eyes squeezed shut, 2) recoiling, about to recover.
Row 5 — DEATH, 5 frames: 1) staggers back, 2) falling, 3) hits the ground, 4) lying still, 5) exactly the same lying pose as frame 4 (the game fades it out itself — do not draw it see-through). Cartoon, no blood.

Background: SOLID FLAT PURE MAGENTA (#FF00FF) — no gradient, no ground, no cast shadow. NEVER use magenta, pink or purple on the monster (its greens stay green). No text, no labels, no numbers, no borders, no motion lines, no dust, no magic effects floating around it (small glows ON the body are fine).
```

**#15 Pass Wolf** · หมาป่าหิมะ (vikF6)
```
Make ONE sprite sheet of a monster for my 2.5D fantasy MMORPG (Ragnarok 3 style).

THE MONSTER: #15 PASS WOLF on the attached board of my current monsters (attached here or earlier in this chat) — medium — a lean grey-and-white mountain wolf with snow crusted in its shaggy fur, a darker blue-grey stripe along its back, a scar over one eye, amber eyes, a collar of bone beads. Keep its design exactly: the same creature, shape, proportions, colours, clothes, weapon and details as on the board. Only the rendering changes.

LOOK: render it exactly like my attached 2.5D hero picture — a stylized 3D game character painted by hand: solid rounded 3D volume, soft toon shading in 2–3 tones that follows the forms, one warm key light from the upper left, a soft cool rim light on the shadow side, thin clean dark-brown outlines, matte painted textures (fur, stone, wood, iron, ice). Cute-but-dangerous chibi proportions (big head, short body) like the board. Not a flat 2D cartoon, no thick outlines, not photorealistic, not glossy plastic, not pixel art. If one of my finished 2.5D monster sheets is attached too, match its look, size in the frame and sheet layout.

CAMERA: the same game camera as the hero — about 30 degrees from above, three-quarter view, the monster facing DOWN-RIGHT (south-east) in every frame.

SHEET: ONE 1536×1024 image, 5 rows. The SAME monster in every frame — identical design, colours and size, never redesigned between frames. Every frame in its own equal-size cell with empty space around it; feet (or lowest point) on the same baseline within a row; nothing cropped, nothing overlapping another frame.
Row 1 — IDLE, 4 frames: calm breathing — neutral, body rises slightly, neutral, body sinks slightly with one small detail moving (ear, tail, cloak, flame).
Row 2 — WALK, 4 frames, four legs: trotting in place, diagonal pairs MUST alternate: 1) front-LEFT + back-RIGHT legs reach forward, 2) passing pose, legs under the body, 3) front-RIGHT + back-LEFT legs reach forward, 4) passing pose. Frames 1 and 3 clearly show different legs in front; the tail swings.
Row 3 — ATTACK, 5 frames: a lunging bite — 1) ready, 2) wind-up, 3) strike at full reach toward down-right, 4) follow-through, 5) back to ready.
Row 4 — HURT, 2 frames: 1) hit from the front, head and body jerk back, eyes squeezed shut, 2) recoiling, about to recover.
Row 5 — DEATH, 5 frames: 1) staggers back, 2) falling, 3) hits the ground, 4) lying still, 5) exactly the same lying pose as frame 4 (the game fades it out itself — do not draw it see-through). Cartoon, no blood.

Background: SOLID FLAT PURE GREEN (#00FF00) — no gradient, no ground, no cast shadow. NEVER use green on the monster: anything that would be green is drawn teal, turquoise, blue or gold instead. No text, no labels, no numbers, no borders, no motion lines, no dust, no magic effects floating around it (small glows ON the body are fine).
```

**#16 Yeti Cub** · ลูกเยติ (vikF6)
```
Make ONE sprite sheet of a monster for my 2.5D fantasy MMORPG (Ragnarok 3 style).

THE MONSTER: #16 YETI CUB on the attached board of my current monsters (attached here or earlier in this chat) — small — a round fluffy cream-white yeti cub with a pale blue face, rosy cheeks, two little curved horns, blue-grey hands and feet, a red-and-white knitted scarf. Keep its design exactly: the same creature, shape, proportions, colours, clothes, weapon and details as on the board. Only the rendering changes.

LOOK: render it exactly like my attached 2.5D hero picture — a stylized 3D game character painted by hand: solid rounded 3D volume, soft toon shading in 2–3 tones that follows the forms, one warm key light from the upper left, a soft cool rim light on the shadow side, thin clean dark-brown outlines, matte painted textures (fur, stone, wood, iron, ice). Cute-but-dangerous chibi proportions (big head, short body) like the board. Not a flat 2D cartoon, no thick outlines, not photorealistic, not glossy plastic, not pixel art. If one of my finished 2.5D monster sheets is attached too, match its look, size in the frame and sheet layout.

CAMERA: the same game camera as the hero — about 30 degrees from above, three-quarter view, the monster facing DOWN-RIGHT (south-east) in every frame.

SHEET: ONE 1536×1024 image, 5 rows. The SAME monster in every frame — identical design, colours and size, never redesigned between frames. Every frame in its own equal-size cell with empty space around it; feet (or lowest point) on the same baseline within a row; nothing cropped, nothing overlapping another frame.
Row 1 — IDLE, 4 frames: calm breathing — neutral, body rises slightly, neutral, body sinks slightly with one small detail moving (ear, tail, cloak, flame).
Row 2 — WALK, 4 frames, two legs: walking in place, legs MUST alternate: 1) LEFT leg forward and planted, 2) passing pose with the RIGHT leg lifted, 3) RIGHT leg forward and planted, 4) passing pose with the LEFT leg lifted. Frames 1 and 3 clearly show a different leg in front; arms swing opposite to the legs.
Row 3 — ATTACK, 5 frames: throws a snowball forward with both arms (the snowball just leaving its hands) — 1) ready, 2) wind-up, 3) strike at full reach toward down-right, 4) follow-through, 5) back to ready.
Row 4 — HURT, 2 frames: 1) hit from the front, head and body jerk back, eyes squeezed shut, 2) recoiling, about to recover.
Row 5 — DEATH, 5 frames: 1) staggers back, 2) falling, 3) hits the ground, 4) lying still, 5) exactly the same lying pose as frame 4 (the game fades it out itself — do not draw it see-through). Cartoon, no blood.

Background: SOLID FLAT PURE GREEN (#00FF00) — no gradient, no ground, no cast shadow. NEVER use green on the monster: anything that would be green is drawn teal, turquoise, blue or gold instead. No text, no labels, no numbers, no borders, no motion lines, no dust, no magic effects floating around it (small glows ON the body are fine).
```

**#17 Avalanche Ram** · แกะเขาหิมะถล่ม (vikF6)
```
Make ONE sprite sheet of a monster for my 2.5D fantasy MMORPG (Ragnarok 3 style).

THE MONSTER: #17 AVALANCHE RAM on the attached board of my current monsters (attached here or earlier in this chat) — medium — a woolly cream-white ram with snow piled on its back, big curled horns made of pale-blue ice crystal, a dark grey face, a brass bell on a red collar. Keep its design exactly: the same creature, shape, proportions, colours, clothes, weapon and details as on the board. Only the rendering changes.

LOOK: render it exactly like my attached 2.5D hero picture — a stylized 3D game character painted by hand: solid rounded 3D volume, soft toon shading in 2–3 tones that follows the forms, one warm key light from the upper left, a soft cool rim light on the shadow side, thin clean dark-brown outlines, matte painted textures (fur, stone, wood, iron, ice). Cute-but-dangerous chibi proportions (big head, short body) like the board. Not a flat 2D cartoon, no thick outlines, not photorealistic, not glossy plastic, not pixel art. If one of my finished 2.5D monster sheets is attached too, match its look, size in the frame and sheet layout.

CAMERA: the same game camera as the hero — about 30 degrees from above, three-quarter view, the monster facing DOWN-RIGHT (south-east) in every frame.

SHEET: ONE 1536×1024 image, 5 rows. The SAME monster in every frame — identical design, colours and size, never redesigned between frames. Every frame in its own equal-size cell with empty space around it; feet (or lowest point) on the same baseline within a row; nothing cropped, nothing overlapping another frame.
Row 1 — IDLE, 4 frames: calm breathing — neutral, body rises slightly, neutral, body sinks slightly with one small detail moving (ear, tail, cloak, flame).
Row 2 — WALK, 4 frames, four legs: trotting in place, diagonal pairs MUST alternate: 1) front-LEFT + back-RIGHT legs reach forward, 2) passing pose, legs under the body, 3) front-RIGHT + back-LEFT legs reach forward, 4) passing pose. Frames 1 and 3 clearly show different legs in front; the tail swings.
Row 3 — ATTACK, 5 frames: lowers its ice horns and charges forward — 1) ready, 2) wind-up, 3) strike at full reach toward down-right, 4) follow-through, 5) back to ready.
Row 4 — HURT, 2 frames: 1) hit from the front, head and body jerk back, eyes squeezed shut, 2) recoiling, about to recover.
Row 5 — DEATH, 5 frames: 1) staggers back, 2) falling, 3) hits the ground, 4) lying still, 5) exactly the same lying pose as frame 4 (the game fades it out itself — do not draw it see-through). Cartoon, no blood.

Background: SOLID FLAT PURE GREEN (#00FF00) — no gradient, no ground, no cast shadow. NEVER use green on the monster: anything that would be green is drawn teal, turquoise, blue or gold instead. No text, no labels, no numbers, no borders, no motion lines, no dust, no magic effects floating around it (small glows ON the body are fine).
```

**#18 Mad Dwarf Ghost** · วิญญาณคนแคระ (vikD1a)
```
Make ONE sprite sheet of a monster for my 2.5D fantasy MMORPG (Ragnarok 3 style).

THE MONSTER: #18 MAD DWARF GHOST on the attached board of my current monsters (attached here or earlier in this chat) — medium — the glowing ghost of a dwarf miner: a copper mining helmet with a lit candle on top, a big nose, a long white beard, brown work clothes, gripping a pickaxe, his legs fading into a pale golden-yellow wisp. Keep its design exactly: the same creature, shape, proportions, colours, clothes, weapon and details as on the board. Only the rendering changes.

LOOK: render it exactly like my attached 2.5D hero picture — a stylized 3D game character painted by hand: solid rounded 3D volume, soft toon shading in 2–3 tones that follows the forms, one warm key light from the upper left, a soft cool rim light on the shadow side, thin clean dark-brown outlines, matte painted textures (fur, stone, wood, iron, ice). Cute-but-dangerous chibi proportions (big head, short body) like the board. Not a flat 2D cartoon, no thick outlines, not photorealistic, not glossy plastic, not pixel art. If one of my finished 2.5D monster sheets is attached too, match its look, size in the frame and sheet layout.

CAMERA: the same game camera as the hero — about 30 degrees from above, three-quarter view, the monster facing DOWN-RIGHT (south-east) in every frame.

SHEET: ONE 1536×1024 image, 5 rows. The SAME monster in every frame — identical design, colours and size, never redesigned between frames. Every frame in its own equal-size cell with empty space around it; feet (or lowest point) on the same baseline within a row; nothing cropped, nothing overlapping another frame.
Row 1 — IDLE, 4 frames: calm breathing — neutral, body rises slightly, neutral, body sinks slightly with one small detail moving (ear, tail, cloak, flame).
Row 2 — WALK, 4 frames, floating: 1) high, leaning forward, 2) middle, trailing parts swept back, 3) low, 4) middle, trailing parts swinging the other way. Nothing touches the ground.
Row 3 — ATTACK, 5 frames: swings his pickaxe down in front — 1) ready, 2) wind-up, 3) strike at full reach toward down-right, 4) follow-through, 5) back to ready.
Row 4 — HURT, 2 frames: 1) hit from the front, head and body jerk back, eyes squeezed shut, 2) recoiling, about to recover.
Row 5 — DEATH, 5 frames: 1) staggers back, 2) falling, 3) hits the ground, 4) lying still, 5) exactly the same lying pose as frame 4 (the game fades it out itself — do not draw it see-through). Cartoon, no blood.

Background: SOLID FLAT PURE GREEN (#00FF00) — no gradient, no ground, no cast shadow. NEVER use green on the monster: anything that would be green is drawn teal, turquoise, blue or gold instead. No text, no labels, no numbers, no borders, no motion lines, no dust, no magic effects floating around it (small glows ON the body are fine).
```

**#19 Ore Golem** · โกเลมแร่ (vikD1a)
```
Make ONE sprite sheet of a monster for my 2.5D fantasy MMORPG (Ragnarok 3 style).

THE MONSTER: #19 ORE GOLEM on the attached board of my current monsters (attached here or earlier in this chat) — large — a golem of dark grey rock studded with shiny gold ore nuggets, two wooden mine-cart wheels mounted on its shoulders, small glowing orange eyes, brown leather straps with buckles round its arms and waist. Keep its design exactly: the same creature, shape, proportions, colours, clothes, weapon and details as on the board. Only the rendering changes.

LOOK: render it exactly like my attached 2.5D hero picture — a stylized 3D game character painted by hand: solid rounded 3D volume, soft toon shading in 2–3 tones that follows the forms, one warm key light from the upper left, a soft cool rim light on the shadow side, thin clean dark-brown outlines, matte painted textures (fur, stone, wood, iron, ice). Cute-but-dangerous chibi proportions (big head, short body) like the board. Not a flat 2D cartoon, no thick outlines, not photorealistic, not glossy plastic, not pixel art. If one of my finished 2.5D monster sheets is attached too, match its look, size in the frame and sheet layout.

CAMERA: the same game camera as the hero — about 30 degrees from above, three-quarter view, the monster facing DOWN-RIGHT (south-east) in every frame.

SHEET: ONE 1536×1024 image, 5 rows. The SAME monster in every frame — identical design, colours and size, never redesigned between frames. Every frame in its own equal-size cell with empty space around it; feet (or lowest point) on the same baseline within a row; nothing cropped, nothing overlapping another frame.
Row 1 — IDLE, 4 frames: calm breathing — neutral, body rises slightly, neutral, body sinks slightly with one small detail moving (ear, tail, cloak, flame).
Row 2 — WALK, 4 frames, two legs: walking in place, legs MUST alternate: 1) LEFT leg forward and planted, 2) passing pose with the RIGHT leg lifted, 3) RIGHT leg forward and planted, 4) passing pose with the LEFT leg lifted. Frames 1 and 3 clearly show a different leg in front; arms swing opposite to the legs.
Row 3 — ATTACK, 5 frames: punches forward with a gold-studded rock fist — 1) ready, 2) wind-up, 3) strike at full reach toward down-right, 4) follow-through, 5) back to ready.
Row 4 — HURT, 2 frames: 1) hit from the front, head and body jerk back, eyes squeezed shut, 2) recoiling, about to recover.
Row 5 — DEATH, 5 frames: 1) staggers back, 2) falling, 3) hits the ground, 4) lying still, 5) exactly the same lying pose as frame 4 (the game fades it out itself — do not draw it see-through). Cartoon, no blood.

Background: SOLID FLAT PURE GREEN (#00FF00) — no gradient, no ground, no cast shadow. NEVER use green on the monster: anything that would be green is drawn teal, turquoise, blue or gold instead. No text, no labels, no numbers, no borders, no motion lines, no dust, no magic effects floating around it (small glows ON the body are fine).
```

**#20 Lamp Beetle** · ด้วงตะเกียง (vikD1a)
```
Make ONE sprite sheet of a monster for my 2.5D fantasy MMORPG (Ragnarok 3 style).

THE MONSTER: #20 LAMP BEETLE on the attached board of my current monsters (attached here or earlier in this chat) — small — a big dark-brown beetle with a curved horn, carrying on its back a brass mining-lantern cage that glows warm orange, copper bands on its legs. Keep its design exactly: the same creature, shape, proportions, colours, clothes, weapon and details as on the board. Only the rendering changes.

LOOK: render it exactly like my attached 2.5D hero picture — a stylized 3D game character painted by hand: solid rounded 3D volume, soft toon shading in 2–3 tones that follows the forms, one warm key light from the upper left, a soft cool rim light on the shadow side, thin clean dark-brown outlines, matte painted textures (fur, stone, wood, iron, ice). Cute-but-dangerous chibi proportions (big head, short body) like the board. Not a flat 2D cartoon, no thick outlines, not photorealistic, not glossy plastic, not pixel art. If one of my finished 2.5D monster sheets is attached too, match its look, size in the frame and sheet layout.

CAMERA: the same game camera as the hero — about 30 degrees from above, three-quarter view, the monster facing DOWN-RIGHT (south-east) in every frame.

SHEET: ONE 1536×1024 image, 5 rows. The SAME monster in every frame — identical design, colours and size, never redesigned between frames. Every frame in its own equal-size cell with empty space around it; feet (or lowest point) on the same baseline within a row; nothing cropped, nothing overlapping another frame.
Row 1 — IDLE, 4 frames: calm breathing — neutral, body rises slightly, neutral, body sinks slightly with one small detail moving (ear, tail, cloak, flame).
Row 2 — WALK, 4 frames, many legs: the legs move in two alternating groups: 1) group A reaches forward, 2) passing pose, 3) group B reaches forward, 4) passing pose. Frames 1 and 3 clearly differ.
Row 3 — ATTACK, 5 frames: lowers its head and rams forward with its horn — 1) ready, 2) wind-up, 3) strike at full reach toward down-right, 4) follow-through, 5) back to ready.
Row 4 — HURT, 2 frames: 1) hit from the front, head and body jerk back, eyes squeezed shut, 2) recoiling, about to recover.
Row 5 — DEATH, 5 frames: 1) staggers back, 2) falling, 3) hits the ground, 4) lying still, 5) exactly the same lying pose as frame 4 (the game fades it out itself — do not draw it see-through). Cartoon, no blood.

Background: SOLID FLAT PURE GREEN (#00FF00) — no gradient, no ground, no cast shadow. NEVER use green on the monster: anything that would be green is drawn teal, turquoise, blue or gold instead. No text, no labels, no numbers, no borders, no motion lines, no dust, no magic effects floating around it (small glows ON the body are fine).
```

**#21 Forge Golem** · โกเลมเตาหลอม (vikD1b)
```
Make ONE sprite sheet of a monster for my 2.5D fantasy MMORPG (Ragnarok 3 style).

THE MONSTER: #21 FORGE GOLEM on the attached board of my current monsters (attached here or earlier in this chat) — large — a golem built like a blacksmith's forge: a brown iron-plated body with copper rivets, a chimney for a head puffing a little smoke, two small glowing orange eyes under it, a glowing fire grate in its chest, iron anvil blocks for fists, a padlock hanging at its hip. Keep its design exactly: the same creature, shape, proportions, colours, clothes, weapon and details as on the board. Only the rendering changes.

LOOK: render it exactly like my attached 2.5D hero picture — a stylized 3D game character painted by hand: solid rounded 3D volume, soft toon shading in 2–3 tones that follows the forms, one warm key light from the upper left, a soft cool rim light on the shadow side, thin clean dark-brown outlines, matte painted textures (fur, stone, wood, iron, ice). Cute-but-dangerous chibi proportions (big head, short body) like the board. Not a flat 2D cartoon, no thick outlines, not photorealistic, not glossy plastic, not pixel art. If one of my finished 2.5D monster sheets is attached too, match its look, size in the frame and sheet layout.

CAMERA: the same game camera as the hero — about 30 degrees from above, three-quarter view, the monster facing DOWN-RIGHT (south-east) in every frame.

SHEET: ONE 1536×1024 image, 5 rows. The SAME monster in every frame — identical design, colours and size, never redesigned between frames. Every frame in its own equal-size cell with empty space around it; feet (or lowest point) on the same baseline within a row; nothing cropped, nothing overlapping another frame.
Row 1 — IDLE, 4 frames: calm breathing — neutral, body rises slightly, neutral, body sinks slightly with one small detail moving (ear, tail, cloak, flame).
Row 2 — WALK, 4 frames, two legs: walking in place, legs MUST alternate: 1) LEFT leg forward and planted, 2) passing pose with the RIGHT leg lifted, 3) RIGHT leg forward and planted, 4) passing pose with the LEFT leg lifted. Frames 1 and 3 clearly show a different leg in front; arms swing opposite to the legs.
Row 3 — ATTACK, 5 frames: raises both anvil fists and slams them down in front — 1) ready, 2) wind-up, 3) strike at full reach toward down-right, 4) follow-through, 5) back to ready.
Row 4 — HURT, 2 frames: 1) hit from the front, head and body jerk back, eyes squeezed shut, 2) recoiling, about to recover.
Row 5 — DEATH, 5 frames: 1) staggers back, 2) falling, 3) hits the ground, 4) lying still, 5) exactly the same lying pose as frame 4 (the game fades it out itself — do not draw it see-through). Cartoon, no blood.

Background: SOLID FLAT PURE GREEN (#00FF00) — no gradient, no ground, no cast shadow. NEVER use green on the monster: anything that would be green is drawn teal, turquoise, blue or gold instead. No text, no labels, no numbers, no borders, no motion lines, no dust, no magic effects floating around it (small glows ON the body are fine).
```


## กลุ่ม 4 · #22–#29 · เหมืองคนแคระ ชั้น 2 · ป่าสนดำ · ทุ่งน้ำแข็งเหนือ
แนบ: `monster25_board_viking4.jpg` + `style_ref_wolf25.jpg` + แผ่น 2.5D ที่ผ่านแล้ว 1 แผ่น

**#22 Ice Bat Pack** · ค้างคาวน้ำแข็ง (vikD1b)
```
Make ONE sprite sheet of a monster for my 2.5D fantasy MMORPG (Ragnarok 3 style).

THE MONSTER: #22 ICE BAT PACK on the attached board of my current monsters (attached here or earlier in this chat) — small (three bats) — a pack of THREE small dark-violet bats flying close together as one group, wings tipped with pale-blue ice, glowing blue eyes, little red tongues. Keep its design exactly: the same creature, shape, proportions, colours, clothes, weapon and details as on the board. Only the rendering changes.

LOOK: render it exactly like my attached 2.5D hero picture — a stylized 3D game character painted by hand: solid rounded 3D volume, soft toon shading in 2–3 tones that follows the forms, one warm key light from the upper left, a soft cool rim light on the shadow side, thin clean dark-brown outlines, matte painted textures (fur, stone, wood, iron, ice). Cute-but-dangerous chibi proportions (big head, short body) like the board. Not a flat 2D cartoon, no thick outlines, not photorealistic, not glossy plastic, not pixel art. If one of my finished 2.5D monster sheets is attached too, match its look, size in the frame and sheet layout.

CAMERA: the same game camera as the hero — about 30 degrees from above, three-quarter view, the monster facing DOWN-RIGHT (south-east) in every frame.

SHEET: ONE 1536×1024 image, 5 rows. The SAME monster in every frame — identical design, colours and size, never redesigned between frames. Every frame in its own equal-size cell with empty space around it; feet (or lowest point) on the same baseline within a row; nothing cropped, nothing overlapping another frame.
Row 1 — IDLE, 4 frames: calm breathing — neutral, body rises slightly, neutral, body sinks slightly with one small detail moving (ear, tail, cloak, flame).
Row 2 — WALK, 4 frames, flying: hovering in place: 1) wings up, 2) wings half down, 3) wings fully down, 4) wings half up; the body bobs a little, feet tucked.
Row 3 — ATTACK, 5 frames: the three bats dive forward together and bite — 1) ready, 2) wind-up, 3) strike at full reach toward down-right, 4) follow-through, 5) back to ready.
Row 4 — HURT, 2 frames: 1) hit from the front, head and body jerk back, eyes squeezed shut, 2) recoiling, about to recover.
Row 5 — DEATH, 5 frames: 1) staggers back, 2) falling, 3) hits the ground, 4) lying still, 5) exactly the same lying pose as frame 4 (the game fades it out itself — do not draw it see-through). Cartoon, no blood.

Background: SOLID FLAT PURE GREEN (#00FF00) — no gradient, no ground, no cast shadow. NEVER use green on the monster: anything that would be green is drawn teal, turquoise, blue or gold instead. No text, no labels, no numbers, no borders, no motion lines, no dust, no magic effects floating around it (small glows ON the body are fine).
```

**#23 Runesmith Revenant** · ช่างรูนอมตะ (vikD1b)
```
Make ONE sprite sheet of a monster for my 2.5D fantasy MMORPG (Ragnarok 3 style).

THE MONSTER: #23 RUNESMITH REVENANT on the attached board of my current monsters (attached here or earlier in this chat) — medium — an undead badger blacksmith: a black-and-white badger face with glowing blue eyes, a dark fur beard, a torn brown leather apron over iron armour pieces, carrying on his shoulder a big iron war hammer whose head is carved with a glowing blue rune mark (an angular mark, not a letter). Keep its design exactly: the same creature, shape, proportions, colours, clothes, weapon and details as on the board. Only the rendering changes.

LOOK: render it exactly like my attached 2.5D hero picture — a stylized 3D game character painted by hand: solid rounded 3D volume, soft toon shading in 2–3 tones that follows the forms, one warm key light from the upper left, a soft cool rim light on the shadow side, thin clean dark-brown outlines, matte painted textures (fur, stone, wood, iron, ice). Cute-but-dangerous chibi proportions (big head, short body) like the board. Not a flat 2D cartoon, no thick outlines, not photorealistic, not glossy plastic, not pixel art. If one of my finished 2.5D monster sheets is attached too, match its look, size in the frame and sheet layout.

CAMERA: the same game camera as the hero — about 30 degrees from above, three-quarter view, the monster facing DOWN-RIGHT (south-east) in every frame.

SHEET: ONE 1536×1024 image, 5 rows. The SAME monster in every frame — identical design, colours and size, never redesigned between frames. Every frame in its own equal-size cell with empty space around it; feet (or lowest point) on the same baseline within a row; nothing cropped, nothing overlapping another frame.
Row 1 — IDLE, 4 frames: calm breathing — neutral, body rises slightly, neutral, body sinks slightly with one small detail moving (ear, tail, cloak, flame).
Row 2 — WALK, 4 frames, two legs: walking in place, legs MUST alternate: 1) LEFT leg forward and planted, 2) passing pose with the RIGHT leg lifted, 3) RIGHT leg forward and planted, 4) passing pose with the LEFT leg lifted. Frames 1 and 3 clearly show a different leg in front; arms swing opposite to the legs.
Row 3 — ATTACK, 5 frames: swings his rune hammer over his head and smashes it down — 1) ready, 2) wind-up, 3) strike at full reach toward down-right, 4) follow-through, 5) back to ready.
Row 4 — HURT, 2 frames: 1) hit from the front, head and body jerk back, eyes squeezed shut, 2) recoiling, about to recover.
Row 5 — DEATH, 5 frames: 1) staggers back, 2) falling, 3) hits the ground, 4) lying still, 5) exactly the same lying pose as frame 4 (the game fades it out itself — do not draw it see-through). Cartoon, no blood.

Background: SOLID FLAT PURE GREEN (#00FF00) — no gradient, no ground, no cast shadow. NEVER use green on the monster: anything that would be green is drawn teal, turquoise, blue or gold instead. No text, no labels, no numbers, no borders, no motion lines, no dust, no magic effects floating around it (small glows ON the body are fine).
```

**#24 Shadow Wolf** · หมาป่าเงา (vikH1)
```
Make ONE sprite sheet of a monster for my 2.5D fantasy MMORPG (Ragnarok 3 style).

THE MONSTER: #24 SHADOW WOLF on the attached board of my current monsters (attached here or earlier in this chat) — medium — a black wolf made of thick dark smoke, glowing violet eyes and mouth, violet wisps curling off its fur and tail, its paws fading into smoke. Keep its design exactly: the same creature, shape, proportions, colours, clothes, weapon and details as on the board. Only the rendering changes.

LOOK: render it exactly like my attached 2.5D hero picture — a stylized 3D game character painted by hand: solid rounded 3D volume, soft toon shading in 2–3 tones that follows the forms, one warm key light from the upper left, a soft cool rim light on the shadow side, thin clean dark-brown outlines, matte painted textures (fur, stone, wood, iron, ice). Cute-but-dangerous chibi proportions (big head, short body) like the board. Not a flat 2D cartoon, no thick outlines, not photorealistic, not glossy plastic, not pixel art. If one of my finished 2.5D monster sheets is attached too, match its look, size in the frame and sheet layout.

CAMERA: the same game camera as the hero — about 30 degrees from above, three-quarter view, the monster facing DOWN-RIGHT (south-east) in every frame.

SHEET: ONE 1536×1024 image, 5 rows. The SAME monster in every frame — identical design, colours and size, never redesigned between frames. Every frame in its own equal-size cell with empty space around it; feet (or lowest point) on the same baseline within a row; nothing cropped, nothing overlapping another frame.
Row 1 — IDLE, 4 frames: calm breathing — neutral, body rises slightly, neutral, body sinks slightly with one small detail moving (ear, tail, cloak, flame).
Row 2 — WALK, 4 frames, four legs: trotting in place, diagonal pairs MUST alternate: 1) front-LEFT + back-RIGHT legs reach forward, 2) passing pose, legs under the body, 3) front-RIGHT + back-LEFT legs reach forward, 4) passing pose. Frames 1 and 3 clearly show different legs in front; the tail swings.
Row 3 — ATTACK, 5 frames: a fast lunging bite, its smoky body stretching — 1) ready, 2) wind-up, 3) strike at full reach toward down-right, 4) follow-through, 5) back to ready.
Row 4 — HURT, 2 frames: 1) hit from the front, head and body jerk back, eyes squeezed shut, 2) recoiling, about to recover.
Row 5 — DEATH, 5 frames: 1) staggers back, 2) falling, 3) hits the ground, 4) lying still, 5) exactly the same lying pose as frame 4 (the game fades it out itself — do not draw it see-through). Cartoon, no blood.

Background: SOLID FLAT PURE GREEN (#00FF00) — no gradient, no ground, no cast shadow. NEVER use green on the monster: anything that would be green is drawn teal, turquoise, blue or gold instead. No text, no labels, no numbers, no borders, no motion lines, no dust, no magic effects floating around it (small glows ON the body are fine).
```

**#25 Forest Witchling** · แม่มดป่า (vikH1)
```
Make ONE sprite sheet of a monster for my 2.5D fantasy MMORPG (Ragnarok 3 style).

THE MONSTER: #25 FOREST WITCHLING on the attached board of my current monsters (attached here or earlier in this chat) — small — a small hunched hedgehog forest witch: a back of spiky brown quills, a hooded cloak of moss-green and autumn-orange leaves, a long wooden mask-like face with glowing green eyes, holding an antler staff with a bone charm and a little gold bell tied on with red string. Keep its design exactly: the same creature, shape, proportions, colours, clothes, weapon and details as on the board. Only the rendering changes.

LOOK: render it exactly like my attached 2.5D hero picture — a stylized 3D game character painted by hand: solid rounded 3D volume, soft toon shading in 2–3 tones that follows the forms, one warm key light from the upper left, a soft cool rim light on the shadow side, thin clean dark-brown outlines, matte painted textures (fur, stone, wood, iron, ice). Cute-but-dangerous chibi proportions (big head, short body) like the board. Not a flat 2D cartoon, no thick outlines, not photorealistic, not glossy plastic, not pixel art. If one of my finished 2.5D monster sheets is attached too, match its look, size in the frame and sheet layout.

CAMERA: the same game camera as the hero — about 30 degrees from above, three-quarter view, the monster facing DOWN-RIGHT (south-east) in every frame.

SHEET: ONE 1536×1024 image, 5 rows. The SAME monster in every frame — identical design, colours and size, never redesigned between frames. Every frame in its own equal-size cell with empty space around it; feet (or lowest point) on the same baseline within a row; nothing cropped, nothing overlapping another frame.
Row 1 — IDLE, 4 frames: calm breathing — neutral, body rises slightly, neutral, body sinks slightly with one small detail moving (ear, tail, cloak, flame).
Row 2 — WALK, 4 frames, two legs: walking in place, legs MUST alternate: 1) LEFT leg forward and planted, 2) passing pose with the RIGHT leg lifted, 3) RIGHT leg forward and planted, 4) passing pose with the LEFT leg lifted. Frames 1 and 3 clearly show a different leg in front; arms swing opposite to the legs.
Row 3 — ATTACK, 5 frames: shakes its antler staff forward and the bell rings, a small yellow-green glow at the bell — 1) ready, 2) wind-up, 3) strike at full reach toward down-right, 4) follow-through, 5) back to ready.
Row 4 — HURT, 2 frames: 1) hit from the front, head and body jerk back, eyes squeezed shut, 2) recoiling, about to recover.
Row 5 — DEATH, 5 frames: 1) staggers back, 2) falling, 3) hits the ground, 4) lying still, 5) exactly the same lying pose as frame 4 (the game fades it out itself — do not draw it see-through). Cartoon, no blood.

Background: SOLID FLAT PURE MAGENTA (#FF00FF) — no gradient, no ground, no cast shadow. NEVER use magenta, pink or purple on the monster (its greens stay green). No text, no labels, no numbers, no borders, no motion lines, no dust, no magic effects floating around it (small glows ON the body are fine).
```

**#26 Blackpine Treant** · ต้นสนดำมีชีวิต (vikH1)
```
Make ONE sprite sheet of a monster for my 2.5D fantasy MMORPG (Ragnarok 3 style).

THE MONSTER: #26 BLACKPINE TREANT on the attached board of my current monsters (attached here or earlier in this chat) — large — a dark pine tree come alive: a crown of dark green pine needles dusted with snow with a few pinecones, a gnarled dark-brown bark body with an angry carved face glowing orange inside, long twisted branch arms, walking on its roots. Keep its design exactly: the same creature, shape, proportions, colours, clothes, weapon and details as on the board. Only the rendering changes.

LOOK: render it exactly like my attached 2.5D hero picture — a stylized 3D game character painted by hand: solid rounded 3D volume, soft toon shading in 2–3 tones that follows the forms, one warm key light from the upper left, a soft cool rim light on the shadow side, thin clean dark-brown outlines, matte painted textures (fur, stone, wood, iron, ice). Cute-but-dangerous chibi proportions (big head, short body) like the board. Not a flat 2D cartoon, no thick outlines, not photorealistic, not glossy plastic, not pixel art. If one of my finished 2.5D monster sheets is attached too, match its look, size in the frame and sheet layout.

CAMERA: the same game camera as the hero — about 30 degrees from above, three-quarter view, the monster facing DOWN-RIGHT (south-east) in every frame.

SHEET: ONE 1536×1024 image, 5 rows. The SAME monster in every frame — identical design, colours and size, never redesigned between frames. Every frame in its own equal-size cell with empty space around it; feet (or lowest point) on the same baseline within a row; nothing cropped, nothing overlapping another frame.
Row 1 — IDLE, 4 frames: calm breathing — neutral, body rises slightly, neutral, body sinks slightly with one small detail moving (ear, tail, cloak, flame).
Row 2 — WALK, 4 frames, two legs: walking in place, legs MUST alternate: 1) LEFT leg forward and planted, 2) passing pose with the RIGHT leg lifted, 3) RIGHT leg forward and planted, 4) passing pose with the LEFT leg lifted. Frames 1 and 3 clearly show a different leg in front; arms swing opposite to the legs.
Row 3 — ATTACK, 5 frames: whips a long branch arm forward — 1) ready, 2) wind-up, 3) strike at full reach toward down-right, 4) follow-through, 5) back to ready.
Row 4 — HURT, 2 frames: 1) hit from the front, head and body jerk back, eyes squeezed shut, 2) recoiling, about to recover.
Row 5 — DEATH, 5 frames: 1) staggers back, 2) falling, 3) hits the ground, 4) lying still, 5) exactly the same lying pose as frame 4 (the game fades it out itself — do not draw it see-through). Cartoon, no blood.

Background: SOLID FLAT PURE MAGENTA (#FF00FF) — no gradient, no ground, no cast shadow. NEVER use magenta, pink or purple on the monster (its greens stay green). No text, no labels, no numbers, no borders, no motion lines, no dust, no magic effects floating around it (small glows ON the body are fine).
```

**#27 Young Yeti** · เยติ (vikH2)
```
Make ONE sprite sheet of a monster for my 2.5D fantasy MMORPG (Ragnarok 3 style).

THE MONSTER: #27 YOUNG YETI on the attached board of my current monsters (attached here or earlier in this chat) — large — a big shaggy white yeti with a blue-grey face, two curved pale-blue horns, frosty pale-blue fists and feet, a leather belt with a brown pouch. Keep its design exactly: the same creature, shape, proportions, colours, clothes, weapon and details as on the board. Only the rendering changes.

LOOK: render it exactly like my attached 2.5D hero picture — a stylized 3D game character painted by hand: solid rounded 3D volume, soft toon shading in 2–3 tones that follows the forms, one warm key light from the upper left, a soft cool rim light on the shadow side, thin clean dark-brown outlines, matte painted textures (fur, stone, wood, iron, ice). Cute-but-dangerous chibi proportions (big head, short body) like the board. Not a flat 2D cartoon, no thick outlines, not photorealistic, not glossy plastic, not pixel art. If one of my finished 2.5D monster sheets is attached too, match its look, size in the frame and sheet layout.

CAMERA: the same game camera as the hero — about 30 degrees from above, three-quarter view, the monster facing DOWN-RIGHT (south-east) in every frame.

SHEET: ONE 1536×1024 image, 5 rows. The SAME monster in every frame — identical design, colours and size, never redesigned between frames. Every frame in its own equal-size cell with empty space around it; feet (or lowest point) on the same baseline within a row; nothing cropped, nothing overlapping another frame.
Row 1 — IDLE, 4 frames: calm breathing — neutral, body rises slightly, neutral, body sinks slightly with one small detail moving (ear, tail, cloak, flame).
Row 2 — WALK, 4 frames, two legs: walking in place, legs MUST alternate: 1) LEFT leg forward and planted, 2) passing pose with the RIGHT leg lifted, 3) RIGHT leg forward and planted, 4) passing pose with the LEFT leg lifted. Frames 1 and 3 clearly show a different leg in front; arms swing opposite to the legs.
Row 3 — ATTACK, 5 frames: raises both fists and pounds the ground in front — 1) ready, 2) wind-up, 3) strike at full reach toward down-right, 4) follow-through, 5) back to ready.
Row 4 — HURT, 2 frames: 1) hit from the front, head and body jerk back, eyes squeezed shut, 2) recoiling, about to recover.
Row 5 — DEATH, 5 frames: 1) staggers back, 2) falling, 3) hits the ground, 4) lying still, 5) exactly the same lying pose as frame 4 (the game fades it out itself — do not draw it see-through). Cartoon, no blood.

Background: SOLID FLAT PURE GREEN (#00FF00) — no gradient, no ground, no cast shadow. NEVER use green on the monster: anything that would be green is drawn teal, turquoise, blue or gold instead. No text, no labels, no numbers, no borders, no motion lines, no dust, no magic effects floating around it (small glows ON the body are fine).
```

**#28 Tundra Wolf** · หมาป่าทุนดรา (vikH2)
```
Make ONE sprite sheet of a monster for my 2.5D fantasy MMORPG (Ragnarok 3 style).

THE MONSTER: #28 TUNDRA WOLF on the attached board of my current monsters (attached here or earlier in this chat) — medium — a big pale grey-white wolf with cool blue-grey shading, a thick snow-crusted ruff round its neck, ice-blue eyes. Keep its design exactly: the same creature, shape, proportions, colours, clothes, weapon and details as on the board. Only the rendering changes.

LOOK: render it exactly like my attached 2.5D hero picture — a stylized 3D game character painted by hand: solid rounded 3D volume, soft toon shading in 2–3 tones that follows the forms, one warm key light from the upper left, a soft cool rim light on the shadow side, thin clean dark-brown outlines, matte painted textures (fur, stone, wood, iron, ice). Cute-but-dangerous chibi proportions (big head, short body) like the board. Not a flat 2D cartoon, no thick outlines, not photorealistic, not glossy plastic, not pixel art. If one of my finished 2.5D monster sheets is attached too, match its look, size in the frame and sheet layout.

CAMERA: the same game camera as the hero — about 30 degrees from above, three-quarter view, the monster facing DOWN-RIGHT (south-east) in every frame.

SHEET: ONE 1536×1024 image, 5 rows. The SAME monster in every frame — identical design, colours and size, never redesigned between frames. Every frame in its own equal-size cell with empty space around it; feet (or lowest point) on the same baseline within a row; nothing cropped, nothing overlapping another frame.
Row 1 — IDLE, 4 frames: calm breathing — neutral, body rises slightly, neutral, body sinks slightly with one small detail moving (ear, tail, cloak, flame).
Row 2 — WALK, 4 frames, four legs: trotting in place, diagonal pairs MUST alternate: 1) front-LEFT + back-RIGHT legs reach forward, 2) passing pose, legs under the body, 3) front-RIGHT + back-LEFT legs reach forward, 4) passing pose. Frames 1 and 3 clearly show different legs in front; the tail swings.
Row 3 — ATTACK, 5 frames: a lunging bite with a short puff of frost from its jaws — 1) ready, 2) wind-up, 3) strike at full reach toward down-right, 4) follow-through, 5) back to ready.
Row 4 — HURT, 2 frames: 1) hit from the front, head and body jerk back, eyes squeezed shut, 2) recoiling, about to recover.
Row 5 — DEATH, 5 frames: 1) staggers back, 2) falling, 3) hits the ground, 4) lying still, 5) exactly the same lying pose as frame 4 (the game fades it out itself — do not draw it see-through). Cartoon, no blood.

Background: SOLID FLAT PURE GREEN (#00FF00) — no gradient, no ground, no cast shadow. NEVER use green on the monster: anything that would be green is drawn teal, turquoise, blue or gold instead. No text, no labels, no numbers, no borders, no motion lines, no dust, no magic effects floating around it (small glows ON the body are fine).
```

**#29 Frost Mammoth Calf** · ลูกช้างแมมมอธ (vikH2)
```
Make ONE sprite sheet of a monster for my 2.5D fantasy MMORPG (Ragnarok 3 style).

THE MONSTER: #29 FROST MAMMOTH CALF on the attached board of my current monsters (attached here or earlier in this chat) — large — a baby woolly mammoth with shaggy reddish-brown fur dusted with snow, small curved white tusks, a short trunk, blue cloth bands round its legs. Keep its design exactly: the same creature, shape, proportions, colours, clothes, weapon and details as on the board. Only the rendering changes.

LOOK: render it exactly like my attached 2.5D hero picture — a stylized 3D game character painted by hand: solid rounded 3D volume, soft toon shading in 2–3 tones that follows the forms, one warm key light from the upper left, a soft cool rim light on the shadow side, thin clean dark-brown outlines, matte painted textures (fur, stone, wood, iron, ice). Cute-but-dangerous chibi proportions (big head, short body) like the board. Not a flat 2D cartoon, no thick outlines, not photorealistic, not glossy plastic, not pixel art. If one of my finished 2.5D monster sheets is attached too, match its look, size in the frame and sheet layout.

CAMERA: the same game camera as the hero — about 30 degrees from above, three-quarter view, the monster facing DOWN-RIGHT (south-east) in every frame.

SHEET: ONE 1536×1024 image, 5 rows. The SAME monster in every frame — identical design, colours and size, never redesigned between frames. Every frame in its own equal-size cell with empty space around it; feet (or lowest point) on the same baseline within a row; nothing cropped, nothing overlapping another frame.
Row 1 — IDLE, 4 frames: calm breathing — neutral, body rises slightly, neutral, body sinks slightly with one small detail moving (ear, tail, cloak, flame).
Row 2 — WALK, 4 frames, four legs: trotting in place, diagonal pairs MUST alternate: 1) front-LEFT + back-RIGHT legs reach forward, 2) passing pose, legs under the body, 3) front-RIGHT + back-LEFT legs reach forward, 4) passing pose. Frames 1 and 3 clearly show different legs in front; the tail swings.
Row 3 — ATTACK, 5 frames: lowers its head and charges with its tusks — 1) ready, 2) wind-up, 3) strike at full reach toward down-right, 4) follow-through, 5) back to ready.
Row 4 — HURT, 2 frames: 1) hit from the front, head and body jerk back, eyes squeezed shut, 2) recoiling, about to recover.
Row 5 — DEATH, 5 frames: 1) staggers back, 2) falling, 3) hits the ground, 4) lying still, 5) exactly the same lying pose as frame 4 (the game fades it out itself — do not draw it see-through). Cartoon, no blood.

Background: SOLID FLAT PURE GREEN (#00FF00) — no gradient, no ground, no cast shadow. NEVER use green on the monster: anything that would be green is drawn teal, turquoise, blue or gold instead. No text, no labels, no numbers, no borders, no motion lines, no dust, no magic effects floating around it (small glows ON the body are fine).
```


## กลุ่ม 5 · #30–#37 · ถ้ำเฟนเรียร์ ชั้น 1–3
แนบ: `monster25_board_viking5.jpg` + `style_ref_wolf25.jpg` + แผ่น 2.5D ที่ผ่านแล้ว 1 แผ่น

**#30 Fenrir Spawn** · ลูกเฟนเรียร์ (vikD2a)
```
Make ONE sprite sheet of a monster for my 2.5D fantasy MMORPG (Ragnarok 3 style).

THE MONSTER: #30 FENRIR SPAWN on the attached board of my current monsters (attached here or earlier in this chat) — medium — a dark navy-blue wolf with spiky fur, glowing ice-blue eyes and mouth, broken iron shackles round its legs with short chains. Keep its design exactly: the same creature, shape, proportions, colours, clothes, weapon and details as on the board. Only the rendering changes.

LOOK: render it exactly like my attached 2.5D hero picture — a stylized 3D game character painted by hand: solid rounded 3D volume, soft toon shading in 2–3 tones that follows the forms, one warm key light from the upper left, a soft cool rim light on the shadow side, thin clean dark-brown outlines, matte painted textures (fur, stone, wood, iron, ice). Cute-but-dangerous chibi proportions (big head, short body) like the board. Not a flat 2D cartoon, no thick outlines, not photorealistic, not glossy plastic, not pixel art. If one of my finished 2.5D monster sheets is attached too, match its look, size in the frame and sheet layout.

CAMERA: the same game camera as the hero — about 30 degrees from above, three-quarter view, the monster facing DOWN-RIGHT (south-east) in every frame.

SHEET: ONE 1536×1024 image, 5 rows. The SAME monster in every frame — identical design, colours and size, never redesigned between frames. Every frame in its own equal-size cell with empty space around it; feet (or lowest point) on the same baseline within a row; nothing cropped, nothing overlapping another frame.
Row 1 — IDLE, 4 frames: calm breathing — neutral, body rises slightly, neutral, body sinks slightly with one small detail moving (ear, tail, cloak, flame).
Row 2 — WALK, 4 frames, four legs: trotting in place, diagonal pairs MUST alternate: 1) front-LEFT + back-RIGHT legs reach forward, 2) passing pose, legs under the body, 3) front-RIGHT + back-LEFT legs reach forward, 4) passing pose. Frames 1 and 3 clearly show different legs in front; the tail swings.
Row 3 — ATTACK, 5 frames: a lunging bite, its mouth glowing — 1) ready, 2) wind-up, 3) strike at full reach toward down-right, 4) follow-through, 5) back to ready.
Row 4 — HURT, 2 frames: 1) hit from the front, head and body jerk back, eyes squeezed shut, 2) recoiling, about to recover.
Row 5 — DEATH, 5 frames: 1) staggers back, 2) falling, 3) hits the ground, 4) lying still, 5) exactly the same lying pose as frame 4 (the game fades it out itself — do not draw it see-through). Cartoon, no blood.

Background: SOLID FLAT PURE GREEN (#00FF00) — no gradient, no ground, no cast shadow. NEVER use green on the monster: anything that would be green is drawn teal, turquoise, blue or gold instead. No text, no labels, no numbers, no borders, no motion lines, no dust, no magic effects floating around it (small glows ON the body are fine).
```

**#31 Wolf Priest** · นักบวชหมาป่า (vikD2a)
```
Make ONE sprite sheet of a monster for my 2.5D fantasy MMORPG (Ragnarok 3 style).

THE MONSTER: #31 WOLF PRIEST on the attached board of my current monsters (attached here or earlier in this chat) — medium — a hunched cultist in a purple robe with gold trim, wearing a pale wolf-skull hood with violet swirl marks over a dark shadowed face with glowing cyan eyes, a necklace of big fangs, holding a staff topped with a horned animal skull and a hanging pink crystal. Keep its design exactly: the same creature, shape, proportions, colours, clothes, weapon and details as on the board. Only the rendering changes.

LOOK: render it exactly like my attached 2.5D hero picture — a stylized 3D game character painted by hand: solid rounded 3D volume, soft toon shading in 2–3 tones that follows the forms, one warm key light from the upper left, a soft cool rim light on the shadow side, thin clean dark-brown outlines, matte painted textures (fur, stone, wood, iron, ice). Cute-but-dangerous chibi proportions (big head, short body) like the board. Not a flat 2D cartoon, no thick outlines, not photorealistic, not glossy plastic, not pixel art. If one of my finished 2.5D monster sheets is attached too, match its look, size in the frame and sheet layout.

CAMERA: the same game camera as the hero — about 30 degrees from above, three-quarter view, the monster facing DOWN-RIGHT (south-east) in every frame.

SHEET: ONE 1536×1024 image, 5 rows. The SAME monster in every frame — identical design, colours and size, never redesigned between frames. Every frame in its own equal-size cell with empty space around it; feet (or lowest point) on the same baseline within a row; nothing cropped, nothing overlapping another frame.
Row 1 — IDLE, 4 frames: calm breathing — neutral, body rises slightly, neutral, body sinks slightly with one small detail moving (ear, tail, cloak, flame).
Row 2 — WALK, 4 frames, two legs: walking in place, legs MUST alternate: 1) LEFT leg forward and planted, 2) passing pose with the RIGHT leg lifted, 3) RIGHT leg forward and planted, 4) passing pose with the LEFT leg lifted. Frames 1 and 3 clearly show a different leg in front; arms swing opposite to the legs.
Row 3 — ATTACK, 5 frames: raises the skull staff and thrusts it forward, the crystal glowing — 1) ready, 2) wind-up, 3) strike at full reach toward down-right, 4) follow-through, 5) back to ready.
Row 4 — HURT, 2 frames: 1) hit from the front, head and body jerk back, eyes squeezed shut, 2) recoiling, about to recover.
Row 5 — DEATH, 5 frames: 1) staggers back, 2) falling, 3) hits the ground, 4) lying still, 5) exactly the same lying pose as frame 4 (the game fades it out itself — do not draw it see-through). Cartoon, no blood.

Background: SOLID FLAT PURE GREEN (#00FF00) — no gradient, no ground, no cast shadow. NEVER use green on the monster: anything that would be green is drawn teal, turquoise, blue or gold instead. No text, no labels, no numbers, no borders, no motion lines, no dust, no magic effects floating around it (small glows ON the body are fine).
```

**#32 Gleipnir Weaver** · ช่างทอโซ่เกลปเนียร์ (vikD2a)
```
Make ONE sprite sheet of a monster for my 2.5D fantasy MMORPG (Ragnarok 3 style).

THE MONSTER: #32 GLEIPNIR WEAVER on the attached board of my current monsters (attached here or earlier in this chat) — medium — a big cave spider with a rounded dark-blue body etched with glowing silver-blue rune marks (angular marks, not letters), eight legs ringed with pale silver bands and curved pale claws, small ice-blue eyes, a strand of silvery silk trailing from its back. Keep its design exactly: the same creature, shape, proportions, colours, clothes, weapon and details as on the board. Only the rendering changes.

LOOK: render it exactly like my attached 2.5D hero picture — a stylized 3D game character painted by hand: solid rounded 3D volume, soft toon shading in 2–3 tones that follows the forms, one warm key light from the upper left, a soft cool rim light on the shadow side, thin clean dark-brown outlines, matte painted textures (fur, stone, wood, iron, ice). Cute-but-dangerous chibi proportions (big head, short body) like the board. Not a flat 2D cartoon, no thick outlines, not photorealistic, not glossy plastic, not pixel art. If one of my finished 2.5D monster sheets is attached too, match its look, size in the frame and sheet layout.

CAMERA: the same game camera as the hero — about 30 degrees from above, three-quarter view, the monster facing DOWN-RIGHT (south-east) in every frame.

SHEET: ONE 1536×1024 image, 5 rows. The SAME monster in every frame — identical design, colours and size, never redesigned between frames. Every frame in its own equal-size cell with empty space around it; feet (or lowest point) on the same baseline within a row; nothing cropped, nothing overlapping another frame.
Row 1 — IDLE, 4 frames: calm breathing — neutral, body rises slightly, neutral, body sinks slightly with one small detail moving (ear, tail, cloak, flame).
Row 2 — WALK, 4 frames, many legs: the legs move in two alternating groups: 1) group A reaches forward, 2) passing pose, 3) group B reaches forward, 4) passing pose. Frames 1 and 3 clearly differ.
Row 3 — ATTACK, 5 frames: rears up and stabs down with its front legs — 1) ready, 2) wind-up, 3) strike at full reach toward down-right, 4) follow-through, 5) back to ready.
Row 4 — HURT, 2 frames: 1) hit from the front, head and body jerk back, eyes squeezed shut, 2) recoiling, about to recover.
Row 5 — DEATH, 5 frames: 1) staggers back, 2) falling, 3) hits the ground, 4) lying still, 5) exactly the same lying pose as frame 4 (the game fades it out itself — do not draw it see-through). Cartoon, no blood.

Background: SOLID FLAT PURE GREEN (#00FF00) — no gradient, no ground, no cast shadow. NEVER use green on the monster: anything that would be green is drawn teal, turquoise, blue or gold instead. No text, no labels, no numbers, no borders, no motion lines, no dust, no magic effects floating around it (small glows ON the body are fine).
```

**#33 Draugr Wolf** · หมาป่าเดรากร์ (vikD2b)
```
Make ONE sprite sheet of a monster for my 2.5D fantasy MMORPG (Ragnarok 3 style).

THE MONSTER: #33 DRAUGR WOLF on the attached board of my current monsters (attached here or earlier in this chat) — medium — an undead half-skeleton wolf with tattered mauve-grey fur, exposed ribs with blue soul-fire glowing inside its chest, a bone tail, blue flames in its eye sockets, a rusty broken chain round its neck. Keep its design exactly: the same creature, shape, proportions, colours, clothes, weapon and details as on the board. Only the rendering changes.

LOOK: render it exactly like my attached 2.5D hero picture — a stylized 3D game character painted by hand: solid rounded 3D volume, soft toon shading in 2–3 tones that follows the forms, one warm key light from the upper left, a soft cool rim light on the shadow side, thin clean dark-brown outlines, matte painted textures (fur, stone, wood, iron, ice). Cute-but-dangerous chibi proportions (big head, short body) like the board. Not a flat 2D cartoon, no thick outlines, not photorealistic, not glossy plastic, not pixel art. If one of my finished 2.5D monster sheets is attached too, match its look, size in the frame and sheet layout.

CAMERA: the same game camera as the hero — about 30 degrees from above, three-quarter view, the monster facing DOWN-RIGHT (south-east) in every frame.

SHEET: ONE 1536×1024 image, 5 rows. The SAME monster in every frame — identical design, colours and size, never redesigned between frames. Every frame in its own equal-size cell with empty space around it; feet (or lowest point) on the same baseline within a row; nothing cropped, nothing overlapping another frame.
Row 1 — IDLE, 4 frames: calm breathing — neutral, body rises slightly, neutral, body sinks slightly with one small detail moving (ear, tail, cloak, flame).
Row 2 — WALK, 4 frames, four legs: trotting in place, diagonal pairs MUST alternate: 1) front-LEFT + back-RIGHT legs reach forward, 2) passing pose, legs under the body, 3) front-RIGHT + back-LEFT legs reach forward, 4) passing pose. Frames 1 and 3 clearly show different legs in front; the tail swings.
Row 3 — ATTACK, 5 frames: a lunging bite — 1) ready, 2) wind-up, 3) strike at full reach toward down-right, 4) follow-through, 5) back to ready.
Row 4 — HURT, 2 frames: 1) hit from the front, head and body jerk back, eyes squeezed shut, 2) recoiling, about to recover.
Row 5 — DEATH, 5 frames: 1) staggers back, 2) falling, 3) hits the ground, 4) lying still, 5) exactly the same lying pose as frame 4 (the game fades it out itself — do not draw it see-through). Cartoon, no blood.

Background: SOLID FLAT PURE GREEN (#00FF00) — no gradient, no ground, no cast shadow. NEVER use green on the monster: anything that would be green is drawn teal, turquoise, blue or gold instead. No text, no labels, no numbers, no borders, no motion lines, no dust, no magic effects floating around it (small glows ON the body are fine).
```

**#34 Draugr** · เดรากร์ (vikD2b)
```
Make ONE sprite sheet of a monster for my 2.5D fantasy MMORPG (Ragnarok 3 style).

THE MONSTER: #34 DRAUGR on the attached board of my current monsters (attached here or earlier in this chat) — medium — an undead Viking warrior with blue-grey skin, a white beard, a dented iron helmet, rusty chainmail, a ragged brown fur cloak, glowing blue eyes, a notched sword and a cracked round wooden shield. Keep its design exactly: the same creature, shape, proportions, colours, clothes, weapon and details as on the board. Only the rendering changes.

LOOK: render it exactly like my attached 2.5D hero picture — a stylized 3D game character painted by hand: solid rounded 3D volume, soft toon shading in 2–3 tones that follows the forms, one warm key light from the upper left, a soft cool rim light on the shadow side, thin clean dark-brown outlines, matte painted textures (fur, stone, wood, iron, ice). Cute-but-dangerous chibi proportions (big head, short body) like the board. Not a flat 2D cartoon, no thick outlines, not photorealistic, not glossy plastic, not pixel art. If one of my finished 2.5D monster sheets is attached too, match its look, size in the frame and sheet layout.

CAMERA: the same game camera as the hero — about 30 degrees from above, three-quarter view, the monster facing DOWN-RIGHT (south-east) in every frame.

SHEET: ONE 1536×1024 image, 5 rows. The SAME monster in every frame — identical design, colours and size, never redesigned between frames. Every frame in its own equal-size cell with empty space around it; feet (or lowest point) on the same baseline within a row; nothing cropped, nothing overlapping another frame.
Row 1 — IDLE, 4 frames: calm breathing — neutral, body rises slightly, neutral, body sinks slightly with one small detail moving (ear, tail, cloak, flame).
Row 2 — WALK, 4 frames, two legs: walking in place, legs MUST alternate: 1) LEFT leg forward and planted, 2) passing pose with the RIGHT leg lifted, 3) RIGHT leg forward and planted, 4) passing pose with the LEFT leg lifted. Frames 1 and 3 clearly show a different leg in front; arms swing opposite to the legs.
Row 3 — ATTACK, 5 frames: a sword slash — 1) ready, 2) wind-up, 3) strike at full reach toward down-right, 4) follow-through, 5) back to ready.
Row 4 — HURT, 2 frames: 1) hit from the front, head and body jerk back, eyes squeezed shut, 2) recoiling, about to recover.
Row 5 — DEATH, 5 frames: 1) staggers back, 2) falling, 3) hits the ground, 4) lying still, 5) exactly the same lying pose as frame 4 (the game fades it out itself — do not draw it see-through). Cartoon, no blood.

Background: SOLID FLAT PURE GREEN (#00FF00) — no gradient, no ground, no cast shadow. NEVER use green on the monster: anything that would be green is drawn teal, turquoise, blue or gold instead. No text, no labels, no numbers, no borders, no motion lines, no dust, no magic effects floating around it (small glows ON the body are fine).
```

**#35 Chain Wraith** · วิญญาณโซ่ (vikD2b)
```
Make ONE sprite sheet of a monster for my 2.5D fantasy MMORPG (Ragnarok 3 style).

THE MONSTER: #35 CHAIN WRAITH on the attached board of my current monsters (attached here or earlier in this chat) — medium — a floating hooded ghost in a tattered dark-blue cloak that fades into ragged tails (no legs), glowing ice-blue eyes in the dark hood, bony grey hands, wrapped in broken iron chains. Keep its design exactly: the same creature, shape, proportions, colours, clothes, weapon and details as on the board. Only the rendering changes.

LOOK: render it exactly like my attached 2.5D hero picture — a stylized 3D game character painted by hand: solid rounded 3D volume, soft toon shading in 2–3 tones that follows the forms, one warm key light from the upper left, a soft cool rim light on the shadow side, thin clean dark-brown outlines, matte painted textures (fur, stone, wood, iron, ice). Cute-but-dangerous chibi proportions (big head, short body) like the board. Not a flat 2D cartoon, no thick outlines, not photorealistic, not glossy plastic, not pixel art. If one of my finished 2.5D monster sheets is attached too, match its look, size in the frame and sheet layout.

CAMERA: the same game camera as the hero — about 30 degrees from above, three-quarter view, the monster facing DOWN-RIGHT (south-east) in every frame.

SHEET: ONE 1536×1024 image, 5 rows. The SAME monster in every frame — identical design, colours and size, never redesigned between frames. Every frame in its own equal-size cell with empty space around it; feet (or lowest point) on the same baseline within a row; nothing cropped, nothing overlapping another frame.
Row 1 — IDLE, 4 frames: calm breathing — neutral, body rises slightly, neutral, body sinks slightly with one small detail moving (ear, tail, cloak, flame).
Row 2 — WALK, 4 frames, floating: 1) high, leaning forward, 2) middle, trailing parts swept back, 3) low, 4) middle, trailing parts swinging the other way. Nothing touches the ground.
Row 3 — ATTACK, 5 frames: lashes a chain forward — 1) ready, 2) wind-up, 3) strike at full reach toward down-right, 4) follow-through, 5) back to ready.
Row 4 — HURT, 2 frames: 1) hit from the front, head and body jerk back, eyes squeezed shut, 2) recoiling, about to recover.
Row 5 — DEATH, 5 frames: 1) staggers back, 2) falling, 3) hits the ground, 4) lying still, 5) exactly the same lying pose as frame 4 (the game fades it out itself — do not draw it see-through). Cartoon, no blood.

Background: SOLID FLAT PURE GREEN (#00FF00) — no gradient, no ground, no cast shadow. NEVER use green on the monster: anything that would be green is drawn teal, turquoise, blue or gold instead. No text, no labels, no numbers, no borders, no motion lines, no dust, no magic effects floating around it (small glows ON the body are fine).
```

**#36 Fenrir Guard** · องครักษ์เฟนเรียร์ (vikD2c)
```
Make ONE sprite sheet of a monster for my 2.5D fantasy MMORPG (Ragnarok 3 style).

THE MONSTER: #36 FENRIR GUARD on the attached board of my current monsters (attached here or earlier in this chat) — large — a huge armoured black wolf with dark iron plates on its back and shoulders, a round shoulder plate with a glowing blue mark, a spiked iron collar, a mane of ice-blue flame, glowing ice-blue eyes, iron claw caps. Keep its design exactly: the same creature, shape, proportions, colours, clothes, weapon and details as on the board. Only the rendering changes.

LOOK: render it exactly like my attached 2.5D hero picture — a stylized 3D game character painted by hand: solid rounded 3D volume, soft toon shading in 2–3 tones that follows the forms, one warm key light from the upper left, a soft cool rim light on the shadow side, thin clean dark-brown outlines, matte painted textures (fur, stone, wood, iron, ice). Cute-but-dangerous chibi proportions (big head, short body) like the board. Not a flat 2D cartoon, no thick outlines, not photorealistic, not glossy plastic, not pixel art. If one of my finished 2.5D monster sheets is attached too, match its look, size in the frame and sheet layout.

CAMERA: the same game camera as the hero — about 30 degrees from above, three-quarter view, the monster facing DOWN-RIGHT (south-east) in every frame.

SHEET: ONE 1536×1024 image, 5 rows. The SAME monster in every frame — identical design, colours and size, never redesigned between frames. Every frame in its own equal-size cell with empty space around it; feet (or lowest point) on the same baseline within a row; nothing cropped, nothing overlapping another frame.
Row 1 — IDLE, 4 frames: calm breathing — neutral, body rises slightly, neutral, body sinks slightly with one small detail moving (ear, tail, cloak, flame).
Row 2 — WALK, 4 frames, four legs: trotting in place, diagonal pairs MUST alternate: 1) front-LEFT + back-RIGHT legs reach forward, 2) passing pose, legs under the body, 3) front-RIGHT + back-LEFT legs reach forward, 4) passing pose. Frames 1 and 3 clearly show different legs in front; the tail swings.
Row 3 — ATTACK, 5 frames: a claw swipe forward — 1) ready, 2) wind-up, 3) strike at full reach toward down-right, 4) follow-through, 5) back to ready.
Row 4 — HURT, 2 frames: 1) hit from the front, head and body jerk back, eyes squeezed shut, 2) recoiling, about to recover.
Row 5 — DEATH, 5 frames: 1) staggers back, 2) falling, 3) hits the ground, 4) lying still, 5) exactly the same lying pose as frame 4 (the game fades it out itself — do not draw it see-through). Cartoon, no blood.

Background: SOLID FLAT PURE GREEN (#00FF00) — no gradient, no ground, no cast shadow. NEVER use green on the monster: anything that would be green is drawn teal, turquoise, blue or gold instead. No text, no labels, no numbers, no borders, no motion lines, no dust, no magic effects floating around it (small glows ON the body are fine).
```

**#37 Wolf High Priest** · มหานักบวชหมาป่า (vikD2c)
```
Make ONE sprite sheet of a monster for my 2.5D fantasy MMORPG (Ragnarok 3 style).

THE MONSTER: #37 WOLF HIGH PRIEST on the attached board of my current monsters (attached here or earlier in this chat) — medium — an old priest with a long grey beard and glowing violet eyes, wearing a big horned wolf-skull crown, a thick red cloak with a cream fur collar over purple robes with gold trim, gold rings and a gold medallion. Keep its design exactly: the same creature, shape, proportions, colours, clothes, weapon and details as on the board. Only the rendering changes.

LOOK: render it exactly like my attached 2.5D hero picture — a stylized 3D game character painted by hand: solid rounded 3D volume, soft toon shading in 2–3 tones that follows the forms, one warm key light from the upper left, a soft cool rim light on the shadow side, thin clean dark-brown outlines, matte painted textures (fur, stone, wood, iron, ice). Cute-but-dangerous chibi proportions (big head, short body) like the board. Not a flat 2D cartoon, no thick outlines, not photorealistic, not glossy plastic, not pixel art. If one of my finished 2.5D monster sheets is attached too, match its look, size in the frame and sheet layout.

CAMERA: the same game camera as the hero — about 30 degrees from above, three-quarter view, the monster facing DOWN-RIGHT (south-east) in every frame.

SHEET: ONE 1536×1024 image, 5 rows. The SAME monster in every frame — identical design, colours and size, never redesigned between frames. Every frame in its own equal-size cell with empty space around it; feet (or lowest point) on the same baseline within a row; nothing cropped, nothing overlapping another frame.
Row 1 — IDLE, 4 frames: calm breathing — neutral, body rises slightly, neutral, body sinks slightly with one small detail moving (ear, tail, cloak, flame).
Row 2 — WALK, 4 frames, two legs: walking in place, legs MUST alternate: 1) LEFT leg forward and planted, 2) passing pose with the RIGHT leg lifted, 3) RIGHT leg forward and planted, 4) passing pose with the LEFT leg lifted. Frames 1 and 3 clearly show a different leg in front; arms swing opposite to the legs.
Row 3 — ATTACK, 5 frames: points a clawed hand forward, a small violet glow in the palm — 1) ready, 2) wind-up, 3) strike at full reach toward down-right, 4) follow-through, 5) back to ready.
Row 4 — HURT, 2 frames: 1) hit from the front, head and body jerk back, eyes squeezed shut, 2) recoiling, about to recover.
Row 5 — DEATH, 5 frames: 1) staggers back, 2) falling, 3) hits the ground, 4) lying still, 5) exactly the same lying pose as frame 4 (the game fades it out itself — do not draw it see-through). Cartoon, no blood.

Background: SOLID FLAT PURE GREEN (#00FF00) — no gradient, no ground, no cast shadow. NEVER use green on the monster: anything that would be green is drawn teal, turquoise, blue or gold instead. No text, no labels, no numbers, no borders, no motion lines, no dust, no magic effects floating around it (small glows ON the body are fine).
```


## กลุ่ม 6 · #38–#44 · ถ้ำเฟนเรียร์ ชั้น 3 · สุสานเรือมังกร · ธารน้ำแข็งนิรันดร์
แนบ: `monster25_board_viking6.jpg` + `style_ref_wolf25.jpg` + แผ่น 2.5D ที่ผ่านแล้ว 1 แผ่น

**#38 Fenrir Shade Hound** · หมาเงาเฟนเรียร์ (vikD2c)
```
Make ONE sprite sheet of a monster for my 2.5D fantasy MMORPG (Ragnarok 3 style).

THE MONSTER: #38 FENRIR SHADE HOUND on the attached board of my current monsters (attached here or earlier in this chat) — medium — a lean wolf made of dark violet-blue shadow smoke with glowing electric-blue veins, glowing blue eyes, a smoky mane and tail of drifting violet wisps, a gold bead chain round its neck. Keep its design exactly: the same creature, shape, proportions, colours, clothes, weapon and details as on the board. Only the rendering changes.

LOOK: render it exactly like my attached 2.5D hero picture — a stylized 3D game character painted by hand: solid rounded 3D volume, soft toon shading in 2–3 tones that follows the forms, one warm key light from the upper left, a soft cool rim light on the shadow side, thin clean dark-brown outlines, matte painted textures (fur, stone, wood, iron, ice). Cute-but-dangerous chibi proportions (big head, short body) like the board. Not a flat 2D cartoon, no thick outlines, not photorealistic, not glossy plastic, not pixel art. If one of my finished 2.5D monster sheets is attached too, match its look, size in the frame and sheet layout.

CAMERA: the same game camera as the hero — about 30 degrees from above, three-quarter view, the monster facing DOWN-RIGHT (south-east) in every frame.

SHEET: ONE 1536×1024 image, 5 rows. The SAME monster in every frame — identical design, colours and size, never redesigned between frames. Every frame in its own equal-size cell with empty space around it; feet (or lowest point) on the same baseline within a row; nothing cropped, nothing overlapping another frame.
Row 1 — IDLE, 4 frames: calm breathing — neutral, body rises slightly, neutral, body sinks slightly with one small detail moving (ear, tail, cloak, flame).
Row 2 — WALK, 4 frames, four legs: trotting in place, diagonal pairs MUST alternate: 1) front-LEFT + back-RIGHT legs reach forward, 2) passing pose, legs under the body, 3) front-RIGHT + back-LEFT legs reach forward, 4) passing pose. Frames 1 and 3 clearly show different legs in front; the tail swings.
Row 3 — ATTACK, 5 frames: a lunging bite — 1) ready, 2) wind-up, 3) strike at full reach toward down-right, 4) follow-through, 5) back to ready.
Row 4 — HURT, 2 frames: 1) hit from the front, head and body jerk back, eyes squeezed shut, 2) recoiling, about to recover.
Row 5 — DEATH, 5 frames: 1) staggers back, 2) falling, 3) hits the ground, 4) lying still, 5) exactly the same lying pose as frame 4 (the game fades it out itself — do not draw it see-through). Cartoon, no blood.

Background: SOLID FLAT PURE GREEN (#00FF00) — no gradient, no ground, no cast shadow. NEVER use green on the monster: anything that would be green is drawn teal, turquoise, blue or gold instead. No text, no labels, no numbers, no borders, no motion lines, no dust, no magic effects floating around it (small glows ON the body are fine).
```

**#39 Undying Viking** · ไวกิ้งอมตะ (vikE1)
```
Make ONE sprite sheet of a monster for my 2.5D fantasy MMORPG (Ragnarok 3 style).

THE MONSTER: #39 UNDYING VIKING on the attached board of my current monsters (attached here or earlier in this chat) — large — a hulking undead Viking chieftain with grey-blue skin and glowing blue eyes, a horned iron helmet, a long dark brown-purple beard like seaweed, rusty armour crusted with barnacles, shells and a starfish, holding a huge two-handed axe with a big crescent blade. Keep its design exactly: the same creature, shape, proportions, colours, clothes, weapon and details as on the board. Only the rendering changes.

LOOK: render it exactly like my attached 2.5D hero picture — a stylized 3D game character painted by hand: solid rounded 3D volume, soft toon shading in 2–3 tones that follows the forms, one warm key light from the upper left, a soft cool rim light on the shadow side, thin clean dark-brown outlines, matte painted textures (fur, stone, wood, iron, ice). Cute-but-dangerous chibi proportions (big head, short body) like the board. Not a flat 2D cartoon, no thick outlines, not photorealistic, not glossy plastic, not pixel art. If one of my finished 2.5D monster sheets is attached too, match its look, size in the frame and sheet layout.

CAMERA: the same game camera as the hero — about 30 degrees from above, three-quarter view, the monster facing DOWN-RIGHT (south-east) in every frame.

SHEET: ONE 1536×1024 image, 5 rows. The SAME monster in every frame — identical design, colours and size, never redesigned between frames. Every frame in its own equal-size cell with empty space around it; feet (or lowest point) on the same baseline within a row; nothing cropped, nothing overlapping another frame.
Row 1 — IDLE, 4 frames: calm breathing — neutral, body rises slightly, neutral, body sinks slightly with one small detail moving (ear, tail, cloak, flame).
Row 2 — WALK, 4 frames, two legs: walking in place, legs MUST alternate: 1) LEFT leg forward and planted, 2) passing pose with the RIGHT leg lifted, 3) RIGHT leg forward and planted, 4) passing pose with the LEFT leg lifted. Frames 1 and 3 clearly show a different leg in front; arms swing opposite to the legs.
Row 3 — ATTACK, 5 frames: swings his huge axe over his head and down — 1) ready, 2) wind-up, 3) strike at full reach toward down-right, 4) follow-through, 5) back to ready.
Row 4 — HURT, 2 frames: 1) hit from the front, head and body jerk back, eyes squeezed shut, 2) recoiling, about to recover.
Row 5 — DEATH, 5 frames: 1) staggers back, 2) falling, 3) hits the ground, 4) lying still, 5) exactly the same lying pose as frame 4 (the game fades it out itself — do not draw it see-through). Cartoon, no blood.

Background: SOLID FLAT PURE GREEN (#00FF00) — no gradient, no ground, no cast shadow. NEVER use green on the monster: anything that would be green is drawn teal, turquoise, blue or gold instead. No text, no labels, no numbers, no borders, no motion lines, no dust, no magic effects floating around it (small glows ON the body are fine).
```

**#40 Sea Ghost Wolf** · หมาป่าวิญญาณทะเล (vikE1)
```
Make ONE sprite sheet of a monster for my 2.5D fantasy MMORPG (Ragnarok 3 style).

THE MONSTER: #40 SEA GHOST WOLF on the attached board of my current monsters (attached here or earlier in this chat) — medium — a see-through pale-teal ghost wolf made of sea water, a white wave-foam mane and tail curling like breaking waves, glowing white eyes, a few water drops. Keep its design exactly: the same creature, shape, proportions, colours, clothes, weapon and details as on the board. Only the rendering changes.

LOOK: render it exactly like my attached 2.5D hero picture — a stylized 3D game character painted by hand: solid rounded 3D volume, soft toon shading in 2–3 tones that follows the forms, one warm key light from the upper left, a soft cool rim light on the shadow side, thin clean dark-brown outlines, matte painted textures (fur, stone, wood, iron, ice). Cute-but-dangerous chibi proportions (big head, short body) like the board. Not a flat 2D cartoon, no thick outlines, not photorealistic, not glossy plastic, not pixel art. If one of my finished 2.5D monster sheets is attached too, match its look, size in the frame and sheet layout.

CAMERA: the same game camera as the hero — about 30 degrees from above, three-quarter view, the monster facing DOWN-RIGHT (south-east) in every frame.

SHEET: ONE 1536×1024 image, 5 rows. The SAME monster in every frame — identical design, colours and size, never redesigned between frames. Every frame in its own equal-size cell with empty space around it; feet (or lowest point) on the same baseline within a row; nothing cropped, nothing overlapping another frame.
Row 1 — IDLE, 4 frames: calm breathing — neutral, body rises slightly, neutral, body sinks slightly with one small detail moving (ear, tail, cloak, flame).
Row 2 — WALK, 4 frames, four legs: trotting in place, diagonal pairs MUST alternate: 1) front-LEFT + back-RIGHT legs reach forward, 2) passing pose, legs under the body, 3) front-RIGHT + back-LEFT legs reach forward, 4) passing pose. Frames 1 and 3 clearly show different legs in front; the tail swings.
Row 3 — ATTACK, 5 frames: a leaping bite — 1) ready, 2) wind-up, 3) strike at full reach toward down-right, 4) follow-through, 5) back to ready.
Row 4 — HURT, 2 frames: 1) hit from the front, head and body jerk back, eyes squeezed shut, 2) recoiling, about to recover.
Row 5 — DEATH, 5 frames: 1) staggers back, 2) falling, 3) hits the ground, 4) lying still, 5) exactly the same lying pose as frame 4 (the game fades it out itself — do not draw it see-through). Cartoon, no blood.

Background: SOLID FLAT PURE GREEN (#00FF00) — no gradient, no ground, no cast shadow. NEVER use green on the monster: anything that would be green is drawn teal, turquoise, blue or gold instead. No text, no labels, no numbers, no borders, no motion lines, no dust, no magic effects floating around it (small glows ON the body are fine).
```

**#41 Drowned Shieldmaiden** · วาลคิรีจมน้ำ (vikE1)
```
Make ONE sprite sheet of a monster for my 2.5D fantasy MMORPG (Ragnarok 3 style).

THE MONSTER: #41 DROWNED SHIELDMAIDEN on the attached board of my current monsters (attached here or earlier in this chat) — medium — a drowned shieldmaiden with pale blue-grey skin and glowing teal eyes, wet dark-blue braids, a dented iron helmet with white wings and a little red coral on it, a torn teal-blue tunic with barnacles, a round teal shield crusted with orange starfish and coral, a long spear. Keep its design exactly: the same creature, shape, proportions, colours, clothes, weapon and details as on the board. Only the rendering changes.

LOOK: render it exactly like my attached 2.5D hero picture — a stylized 3D game character painted by hand: solid rounded 3D volume, soft toon shading in 2–3 tones that follows the forms, one warm key light from the upper left, a soft cool rim light on the shadow side, thin clean dark-brown outlines, matte painted textures (fur, stone, wood, iron, ice). Cute-but-dangerous chibi proportions (big head, short body) like the board. Not a flat 2D cartoon, no thick outlines, not photorealistic, not glossy plastic, not pixel art. If one of my finished 2.5D monster sheets is attached too, match its look, size in the frame and sheet layout.

CAMERA: the same game camera as the hero — about 30 degrees from above, three-quarter view, the monster facing DOWN-RIGHT (south-east) in every frame.

SHEET: ONE 1536×1024 image, 5 rows. The SAME monster in every frame — identical design, colours and size, never redesigned between frames. Every frame in its own equal-size cell with empty space around it; feet (or lowest point) on the same baseline within a row; nothing cropped, nothing overlapping another frame.
Row 1 — IDLE, 4 frames: calm breathing — neutral, body rises slightly, neutral, body sinks slightly with one small detail moving (ear, tail, cloak, flame).
Row 2 — WALK, 4 frames, two legs: walking in place, legs MUST alternate: 1) LEFT leg forward and planted, 2) passing pose with the RIGHT leg lifted, 3) RIGHT leg forward and planted, 4) passing pose with the LEFT leg lifted. Frames 1 and 3 clearly show a different leg in front; arms swing opposite to the legs.
Row 3 — ATTACK, 5 frames: a spear thrust from behind her shield — 1) ready, 2) wind-up, 3) strike at full reach toward down-right, 4) follow-through, 5) back to ready.
Row 4 — HURT, 2 frames: 1) hit from the front, head and body jerk back, eyes squeezed shut, 2) recoiling, about to recover.
Row 5 — DEATH, 5 frames: 1) staggers back, 2) falling, 3) hits the ground, 4) lying still, 5) exactly the same lying pose as frame 4 (the game fades it out itself — do not draw it see-through). Cartoon, no blood.

Background: SOLID FLAT PURE GREEN (#00FF00) — no gradient, no ground, no cast shadow. NEVER use green on the monster: anything that would be green is drawn teal, turquoise, blue or gold instead. No text, no labels, no numbers, no borders, no motion lines, no dust, no magic effects floating around it (small glows ON the body are fine).
```

**#42 Frost Giant** · ยักษ์น้ำแข็ง (vikE2)
```
Make ONE sprite sheet of a monster for my 2.5D fantasy MMORPG (Ragnarok 3 style).

THE MONSTER: #42 FROST GIANT on the attached board of my current monsters (attached here or earlier in this chat) — very large — a towering blue-skinned frost giant with a white icicle beard, a horned helmet, shoulder plates of pale-blue ice crystal, white fur, a leather harness with a round iron buckle, a club made of a blue ice boulder on a wooden handle. Keep its design exactly: the same creature, shape, proportions, colours, clothes, weapon and details as on the board. Only the rendering changes.

LOOK: render it exactly like my attached 2.5D hero picture — a stylized 3D game character painted by hand: solid rounded 3D volume, soft toon shading in 2–3 tones that follows the forms, one warm key light from the upper left, a soft cool rim light on the shadow side, thin clean dark-brown outlines, matte painted textures (fur, stone, wood, iron, ice). Cute-but-dangerous chibi proportions (big head, short body) like the board. Not a flat 2D cartoon, no thick outlines, not photorealistic, not glossy plastic, not pixel art. If one of my finished 2.5D monster sheets is attached too, match its look, size in the frame and sheet layout.

CAMERA: the same game camera as the hero — about 30 degrees from above, three-quarter view, the monster facing DOWN-RIGHT (south-east) in every frame.

SHEET: ONE 1536×1024 image, 5 rows. The SAME monster in every frame — identical design, colours and size, never redesigned between frames. Every frame in its own equal-size cell with empty space around it; feet (or lowest point) on the same baseline within a row; nothing cropped, nothing overlapping another frame.
Row 1 — IDLE, 4 frames: calm breathing — neutral, body rises slightly, neutral, body sinks slightly with one small detail moving (ear, tail, cloak, flame).
Row 2 — WALK, 4 frames, two legs: walking in place, legs MUST alternate: 1) LEFT leg forward and planted, 2) passing pose with the RIGHT leg lifted, 3) RIGHT leg forward and planted, 4) passing pose with the LEFT leg lifted. Frames 1 and 3 clearly show a different leg in front; arms swing opposite to the legs.
Row 3 — ATTACK, 5 frames: swings his ice-boulder club over his head and smashes it down — 1) ready, 2) wind-up, 3) strike at full reach toward down-right, 4) follow-through, 5) back to ready.
Row 4 — HURT, 2 frames: 1) hit from the front, head and body jerk back, eyes squeezed shut, 2) recoiling, about to recover.
Row 5 — DEATH, 5 frames: 1) staggers back, 2) falling, 3) hits the ground, 4) lying still, 5) exactly the same lying pose as frame 4 (the game fades it out itself — do not draw it see-through). Cartoon, no blood.

Background: SOLID FLAT PURE GREEN (#00FF00) — no gradient, no ground, no cast shadow. NEVER use green on the monster: anything that would be green is drawn teal, turquoise, blue or gold instead. No text, no labels, no numbers, no borders, no motion lines, no dust, no magic effects floating around it (small glows ON the body are fine).
```

**#43 Dark Valkyrie Wolf** · หมาป่าวาลคิรีมืด (vikE2)
```
Make ONE sprite sheet of a monster for my 2.5D fantasy MMORPG (Ragnarok 3 style).

THE MONSTER: #43 DARK VALKYRIE WOLF on the attached board of my current monsters (attached here or earlier in this chat) — large — a black wolf with two big dark-feathered wings folded on its back, a silver valkyrie helmet with small white wings, silver chest armour, glowing silver eyes. Keep its design exactly: the same creature, shape, proportions, colours, clothes, weapon and details as on the board. Only the rendering changes.

LOOK: render it exactly like my attached 2.5D hero picture — a stylized 3D game character painted by hand: solid rounded 3D volume, soft toon shading in 2–3 tones that follows the forms, one warm key light from the upper left, a soft cool rim light on the shadow side, thin clean dark-brown outlines, matte painted textures (fur, stone, wood, iron, ice). Cute-but-dangerous chibi proportions (big head, short body) like the board. Not a flat 2D cartoon, no thick outlines, not photorealistic, not glossy plastic, not pixel art. If one of my finished 2.5D monster sheets is attached too, match its look, size in the frame and sheet layout.

CAMERA: the same game camera as the hero — about 30 degrees from above, three-quarter view, the monster facing DOWN-RIGHT (south-east) in every frame.

SHEET: ONE 1536×1024 image, 5 rows. The SAME monster in every frame — identical design, colours and size, never redesigned between frames. Every frame in its own equal-size cell with empty space around it; feet (or lowest point) on the same baseline within a row; nothing cropped, nothing overlapping another frame.
Row 1 — IDLE, 4 frames: calm breathing — neutral, body rises slightly, neutral, body sinks slightly with one small detail moving (ear, tail, cloak, flame).
Row 2 — WALK, 4 frames, four legs: trotting in place, diagonal pairs MUST alternate: 1) front-LEFT + back-RIGHT legs reach forward, 2) passing pose, legs under the body, 3) front-RIGHT + back-LEFT legs reach forward, 4) passing pose. Frames 1 and 3 clearly show different legs in front; the tail swings.
Row 3 — ATTACK, 5 frames: leaps forward with its wings spread and bites — 1) ready, 2) wind-up, 3) strike at full reach toward down-right, 4) follow-through, 5) back to ready.
Row 4 — HURT, 2 frames: 1) hit from the front, head and body jerk back, eyes squeezed shut, 2) recoiling, about to recover.
Row 5 — DEATH, 5 frames: 1) staggers back, 2) falling, 3) hits the ground, 4) lying still, 5) exactly the same lying pose as frame 4 (the game fades it out itself — do not draw it see-through). Cartoon, no blood.

Background: SOLID FLAT PURE GREEN (#00FF00) — no gradient, no ground, no cast shadow. NEVER use green on the monster: anything that would be green is drawn teal, turquoise, blue or gold instead. No text, no labels, no numbers, no borders, no motion lines, no dust, no magic effects floating around it (small glows ON the body are fine).
```

**#44 Glacier Wyrmling** · ลูกมังกรธารน้ำแข็ง (vikE2)
```
Make ONE sprite sheet of a monster for my 2.5D fantasy MMORPG (Ragnarok 3 style).

THE MONSTER: #44 GLACIER WYRMLING on the attached board of my current monsters (attached here or earlier in this chat) — large — a young four-legged ice dragon with pale-blue scales and a white belly, clear ice-crystal spikes along its back and tail, small frosty wings, big curious eyes. Keep its design exactly: the same creature, shape, proportions, colours, clothes, weapon and details as on the board. Only the rendering changes.

LOOK: render it exactly like my attached 2.5D hero picture — a stylized 3D game character painted by hand: solid rounded 3D volume, soft toon shading in 2–3 tones that follows the forms, one warm key light from the upper left, a soft cool rim light on the shadow side, thin clean dark-brown outlines, matte painted textures (fur, stone, wood, iron, ice). Cute-but-dangerous chibi proportions (big head, short body) like the board. Not a flat 2D cartoon, no thick outlines, not photorealistic, not glossy plastic, not pixel art. If one of my finished 2.5D monster sheets is attached too, match its look, size in the frame and sheet layout.

CAMERA: the same game camera as the hero — about 30 degrees from above, three-quarter view, the monster facing DOWN-RIGHT (south-east) in every frame.

SHEET: ONE 1536×1024 image, 5 rows. The SAME monster in every frame — identical design, colours and size, never redesigned between frames. Every frame in its own equal-size cell with empty space around it; feet (or lowest point) on the same baseline within a row; nothing cropped, nothing overlapping another frame.
Row 1 — IDLE, 4 frames: calm breathing — neutral, body rises slightly, neutral, body sinks slightly with one small detail moving (ear, tail, cloak, flame).
Row 2 — WALK, 4 frames, four legs: trotting in place, diagonal pairs MUST alternate: 1) front-LEFT + back-RIGHT legs reach forward, 2) passing pose, legs under the body, 3) front-RIGHT + back-LEFT legs reach forward, 4) passing pose. Frames 1 and 3 clearly show different legs in front; the tail swings.
Row 3 — ATTACK, 5 frames: a lunging bite with a claw swipe — 1) ready, 2) wind-up, 3) strike at full reach toward down-right, 4) follow-through, 5) back to ready.
Row 4 — HURT, 2 frames: 1) hit from the front, head and body jerk back, eyes squeezed shut, 2) recoiling, about to recover.
Row 5 — DEATH, 5 frames: 1) staggers back, 2) falling, 3) hits the ground, 4) lying still, 5) exactly the same lying pose as frame 4 (the game fades it out itself — do not draw it see-through). Cartoon, no blood.

Background: SOLID FLAT PURE GREEN (#00FF00) — no gradient, no ground, no cast shadow. NEVER use green on the monster: anything that would be green is drawn teal, turquoise, blue or gold instead. No text, no labels, no numbers, no borders, no motion lines, no dust, no magic effects floating around it (small glows ON the body are fine).
```

