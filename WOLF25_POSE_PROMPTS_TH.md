# หมาป่า 2.5D — ภาพท่าเสริมสำหรับบางสกิล

เจ้าของถามเมื่อ 2026-11-26 10:33 ว่า "ต้องทำท่าไหนเพิ่มเติมอีกไหม แบบของแมวท่าเสริม" (หลังส่งภาพตั้งต้น + พรอมต์คลิป 2.5D ครบ 5 ทิศ)

สไปร์ตหมาป่า (`assets_wolf.js` ตอนนี้ และร่าง 2.5D ที่กำลังทำคลิป) มีแค่ 5 ชุดท่า: idle · walk · attack (ฟันขวานลง) · buff (ชูขวาน) · hurt (ทำจากท่ายืน) สกิลที่ไม่ใช่การฟันจึงต้องยืมท่าพวกนี้:

- 11 สกิลใช้ท่าชูขวานท่าเดียวกัน (`buffAct` / แถว buff): War Howl · War Fury · Fenrir's Spirit · War Banner · Rune Guard · Rune Burst · Ice Prison · Blizzard · Frozen Descent · Thunder Spear · Tempest Field — Ragnarok's Judgment ค้างท่าชูขวาน 2–2.5 วิ
- กระโดด (Predator's Leap · Cyclone Leap · Ravenous Leap · ท้าย Valhalla's Wrath): ค้างเฟรมชูขวานระหว่างลอย แล้วตัดเป็นเฟรมฟันตอนลงพื้น
- Axe Cyclone: วนเฟรม contact (ขวานจิกพื้น) ของ 8 ทิศ ทิศละ 0.055 วิ
- Battle Step / Storm Step: เล่นแถว walk เร็ว ×3.4 แล้วไถล
- Vampiric Axe / Blood Rush / Lightning Pursuit / Ice Break: ค้างเฟรม contact (ขวานจิกพื้น) 0.2 วิ ตลอดช่วงไถล
- Iron Counter: ค้างเฟรม 2 ของแถว buff 0.6–0.84 วิ ไม่มีท่าตั้งการ์ด
- Executioner = ท่าฟันปกติเล่นช้า ×0.7 · Wolf Finale = ชูขวานค้าง 0.24 วิ แล้วฟัน · Valhalla's Wrath ชาร์จ = ชูขวานค้าง 0.25 วิ
- ทุกท่าฟันของสาย A (Blood Cleave · Savage Rend · Axe Dance 3–7 ครั้ง · Reversal Slash · Revenge Breaker · Armor Break) = ท่าฟันลงท่าเดียว
- ไม่มีรูปท่านั่ง (`hero_sit.js` ไม่ได้โหลดให้หมาป่า) → หมาป่านั่งพักไม่ได้

ภาพทุกแผ่นวาดเป็นลุค 2.5D (ให้เข้ากับคลิปที่กำลังทำ) ในมุมเดียว คือหน้าเฉียงหันขวา (SE) เหมือน `view25_SE` · เกมกลับด้านให้เองเมื่อหันซ้าย (SW / W) · ตอนหันหลัง (N / NE / NW) ใช้เฟรมเดิมต่อไป แบบเดียวกับท่าชาร์จของแมวและท่าเสริมของจากัวร์ · ยกเว้นท่านั่ง (8 มุม) กับท่าหมุน (4 ด้าน = หมุน 1 รอบ)

## รอบแรกขวานผิด (2026-11-26 11:04)

เจ้าของส่งแผ่น ① กระโดด กับ ② หอน มา + "ขวานมันชอบผิดรูป · น่าจะผิดทุกรูปที่เจนมา" — ทุกเฟรมได้ขวานผิดแบบเดียวกัน: (1) ด้ามสั้นเหลือครึ่งเดียว กลายเป็นขวานมือเดียว (2) หัวขวานไปเสียบที่ปลายด้าม ใบยื่นไปทางเดียวกับด้าม (ของจริง: ด้ามทะลุขึ้นไปจบที่ลูกกลมเงิน ใบยื่นออกด้านข้างตั้งฉากกับด้าม) (3) ปลายล่างเป็นลูกกลม ไม่มีหัวแหลม · สาเหตุ: กล่องเดิมบอกขวานแค่ประโยคเดียว ('set in a wolf head' ชวนให้วาดหัวขวานครอบปลายด้าม) · ไม่บอกขนาดตัว ChatGPT วาดตัวใหญ่จนขวานยาวไม่พอที่ เลยหดขวาน · บางเฟรมสั่ง 'ถือขวานต่ำมือเดียว' ซึ่งขวานยาวทำไม่ได้ · ไม่มีภาพขวานเปล่าให้ดู (ภาพยืนทุกมุมมีมือบังกลางด้าม)

แก้แล้ว: ภาพอ้างอิงขวานเปล่า `tools/ref/wolf25_axe_ref.jpg` (ตัดจาก `view25_E` เอามือออก เติมด้ามใต้มือจากด้ามท่อนล่างที่ลายตรงกัน · ขวานเดียวกัน 3 ท่า ตั้ง / นอน / เอียง สเกลเดียว บนพื้นเขียว) + ทุกกล่องมีย่อหน้า Axe (ส่วนประกอบจากบนลงล่าง · ใบยื่นข้าง ตั้งฉากกับด้าม · ด้ามทะลุถึงลูกกลม · หัวแหลมอยู่ปลายล่าง · ห้ามหด ห้ามงอ) + ย่อหน้าการจับ (สองมือจับครึ่งล่างของด้าม · มือเดียวตอนยืน = ตั้งขวานบนหัวแหลมข้างตัวแบบภาพยืน) + สั่งขนาดตัว (ยืนตรงสูง ~40 % ของช่องในแผ่น 6 เฟรม · ~45 % ในแผ่น 4 เฟรม) + ทุกเฟรมเขียนว่าขวานยาวอยู่ตรงไหน

## แนบอะไร

**เปิดแชต ChatGPT ใหม่** (แชตเดิมจำขวานสั้นไว้แล้ว มันจะวาดซ้ำ) แนบ 3 รูปนี้ในข้อความแรก แล้ววางกล่องทีละกล่อง (ได้รูปแล้วค่อยวางกล่องต่อไป):

1. `tools/ref/wolf25_ref_SE.jpg` = รูป 2.5D หน้าเฉียงขวาตัวใหญ่ (ครอปจาก `assets/heroes/wolf/view25_SE_test.webp`) ใช้เป็นหน้าตา มุม และการเรนเดอร์
2. `tools/ref/wolf25_ref_views.jpg` = ภาพยืน 2.5D ครบ 5 มุม (`view25_S/SE/E/NE/N.webp`) เรียงกัน ให้เห็นด้านข้างกับด้านหลัง
3. `tools/ref/wolf25_axe_ref.jpg` = ขวานเปล่า 3 ท่า (ตั้ง / นอน / เอียง) ขนาดเดียวกัน — ให้มันเห็นรูปขวานทั้งเล่มโดยไม่มีมือบัง

ไม่แนบภาพหน้าโหลด (มันจะดึงกลับเป็นภาพวาด 2D) · ห้ามแนบไฟล์ .md นี้ให้ ChatGPT

## ลำดับ

| # | ท่า | ใช้กับ | ความสำคัญ |
|---|---|---|---|
| 1 | ① ท่ากระโดดฟันลง (6 เฟรม) | Predator's Leap · Cyclone Leap · Ravenous Leap · ช่วงกระโดดลงท้าย Valhalla's Wrath | สำคัญ |
| 2 | ② ท่าหอน (4 เฟรม) | War Howl · Fenrir's Spirit · War Banner (เฟรม 1–3) · War Fury (เฟรม 1 → 4) | สำคัญ |
| 3 | ③ ท่าเงื้อขวานชาร์จ (4 เฟรม) | Executioner · Wolf Finale · ช่วงชาร์จของ Valhalla's Wrath (ท่าค้างก่อนฟันแบบท่าชาร์จของแมว) | สำคัญ |
| 4 | ④ ท่าพุ่ง (4 เฟรม) | Battle Step · Storm Step (+ ช่วงไถลของ Vampiric Axe · Blood Rush · Lightning Pursuit · Ice Break ถ้าต่อเข้าได้) | สำคัญ |
| 5 | ⑤ ท่าตั้งการ์ด (4 เฟรม) | Iron Counter · Rune Guard (เฟรม 1–3) · Rune Burst (เฟรม 4) | ดี |
| 6 | ⑥ ท่าร่ายรูน (4 เฟรม) | Ice Prison · Thunder Spear (เฟรม 1–2) · Blizzard · Tempest Field · Frozen Descent · Ragnarok's Judgment (เฟรม 1 → 3–4) — ให้สาย B มีท่าของตัวเอง | ดี |
| 7 | ⑦ ท่าหมุนขวาน (4 เฟรม = หมุน 1 รอบ) | Axe Cyclone | ดี |
| 8 | ⑧ ท่าฟันกวาดแนวนอน (4 เฟรม) | Blood Cleave · Axe Dance (สลับกับท่าฟันลง) · Savage Rend (ฟันที่สอง) · Reversal Slash | เสริม |
| 9 | ⑨ ท่านั่งพัก (1 ภาพ 8 มุม) | นั่งพัก (ปุ่ม Insert / 🧘) แบบแมว ลิง จากัวร์ — ตอนนี้หมาป่านั่งไม่ได้ | เสริม |

## กล่องพรอมต์ (ภาษาอังกฤษ วางทีละกล่อง)

### ① ท่ากระโดดฟันลง (6 เฟรม)
ใช้กับ Predator's Leap · Cyclone Leap · Ravenous Leap · ช่วงกระโดดลงท้าย Valhalla's Wrath

```
2.5D game sprite sheet — the white wolf warrior's leaping axe smash, 6 frames.
Use the three attached pictures: the large picture shows exactly how he looks and how he is rendered, the row of five pictures shows him from every side, and the third picture shows his greataxe on its own (the same axe standing up, lying flat and tilted) — copy his look and his axe exactly.
Style: the same 2.5D look as the attached pictures — a stylized 3D game model with solid volume and depth, rendered with a toon shader that imitates hand-drawn art: clean dark-brown hand-drawn-looking outlines, soft cel shading in 2–3 tones that follows the 3D forms, one warm key light from the upper left, a thin bright rim light along the edges, matte painted textures (fluffy fur, cloth, worn leather, brushed steel). Not photorealistic, not glossy plastic, not a flat 2D drawing. Keep his body proportions exactly as in the pictures.
Camera: the same as in the attached pictures — looking down at him from about 30 degrees above, with no perspective distortion.
Character: a white wolf warrior with a full wolf head — a strong muzzle, a black nose, bright ice-blue eyes, a small red X-shaped scar above his RIGHT eye, tall pointed ears; snow-white fur with soft lavender-grey shading, a thick spiky mane of fur round his head, cheeks and neck, and a thin white braid with small silver rings beside his RIGHT cheek. A cream-white fur collar on a crimson fur-lined cape over both shoulders and down to the middle of his back, a round silver knotwork brooch on his LEFT chest, a dark-steel pauldron shaped like a snarling wolf head on his LEFT shoulder. A sleeveless deep-navy tunic with a silver knotwork band down the front, split into front panels over a crimson underlayer; a brown leather belt with a big round silver knotwork buckle. Bare white-furred arms with dark brown leather bracers; a heavy steel chain wrapped round his LEFT forearm with four broken links hanging. Baggy charcoal-black trousers, dark brown boots with crisscross straps and thick white fur cuffs. A huge bushy white tail.
Axe: copy his Viking greataxe exactly from the third attached picture. It is one rigid object that never changes from frame to frame: always the same length — almost as long as he is tall — always straight, never shorter, never bent, never a small one-handed axe. Its parts, from the top end down: a round silver ball cap; a short dark-steel section carved with knotwork; ONE broad silver crescent blade fixed to the side of that steel section and sticking out sideways at a right angle to the haft — the haft does not end in the blade, it carries on past the blade up to the silver ball; a snarling dark-iron wolf head on the blade's flat face next to the haft, and an ice-blue knotwork pattern along the blade; below the blade the long crimson haft wrapped with dark crisscross straps and silver bands; and at the bottom end a pointed silver spike. The ball is always at the blade end and the pointed spike always at the far end.
How he holds it, unless a frame says otherwise: with both hands he grips the lower half of the haft, one hand just above the pointed spike and the other a little higher, so the long haft and the blade reach far out beyond his hands; with one hand while standing, the axe stands upright beside him on its pointed spike, his hand round the haft at chest height and the blade beside his head, as in the standing pictures.
View: every frame shows him from the same front three-quarter view as the large attached picture — body and face turned toward the lower right of the picture.
Layout: landscape 1536×1024, 6 frames in 2 rows of 3, read left to right, top row first. Each frame sits in its own sixth of the picture, the wolf the same size in every frame, his whole body (ears, tail, boots) and the WHOLE axe inside his own area with clear empty space around it — frames never touch or overlap. Draw him small: standing up straight he would be only about 40% of a frame's height, so the long axe fits in every pose — never shorten the axe to make it fit.
Frames:
1. Crouch to spring: knees bent deep, body low and leaning forward, both hands on the lower part of the haft, the long axe held low behind him with the blade near the ground far behind his back, eyes on the target ahead.
2. Take-off: legs pushing off the ground, body rising and leaning forward, the long axe swinging back and up behind him.
3. Rising: in the air with his knees tucked up, both hands above his head on the lower part of the haft, the long axe pointing up and back with the blade high above him.
4. Top of the leap: body arched back, both hands above his head, the long axe swung back over his head and shoulders with the blade far down behind his back, ready to smash; his cape, braid, mane and tail streaming upward.
5. Smash landing: one knee down and one foot planted, both hands in front of his chest on the lower part of the haft, the long haft reaching forward and down and the blade driven into the ground about one body-length in front of him, head low, cape thrown forward.
6. Rising from the smash: still crouched, pulling the long axe back up out of the ground in front of him.
Frames 2 to 4 are in the air (feet off the ground); draw them the same size as the other frames.
Background: flat solid pure green #00FF00 everywhere, no gradient, no floor, no shadow under him.
No effects at all: no slash trails, motion lines, speed lines, glow, runes in the air, ice, lightning, sparkles, dust, cracks, impact bursts, symbols, text, numbers or frame borders — only the wolf and his axe; show the movement with the pose alone. The ice-blue pattern on the blade stays a flat painted pattern, never glowing. No green anywhere on him.
```

### ② ท่าหอน (4 เฟรม)
ใช้กับ War Howl · Fenrir's Spirit · War Banner (เฟรม 1–3) · War Fury (เฟรม 1 → 4)

```
2.5D game sprite sheet — the white wolf warrior's war howl, 4 frames.
Use the three attached pictures: the large picture shows exactly how he looks and how he is rendered, the row of five pictures shows him from every side, and the third picture shows his greataxe on its own (the same axe standing up, lying flat and tilted) — copy his look and his axe exactly.
Style: the same 2.5D look as the attached pictures — a stylized 3D game model with solid volume and depth, rendered with a toon shader that imitates hand-drawn art: clean dark-brown hand-drawn-looking outlines, soft cel shading in 2–3 tones that follows the 3D forms, one warm key light from the upper left, a thin bright rim light along the edges, matte painted textures (fluffy fur, cloth, worn leather, brushed steel). Not photorealistic, not glossy plastic, not a flat 2D drawing. Keep his body proportions exactly as in the pictures.
Camera: the same as in the attached pictures — looking down at him from about 30 degrees above, with no perspective distortion.
Character: a white wolf warrior with a full wolf head — a strong muzzle, a black nose, bright ice-blue eyes, a small red X-shaped scar above his RIGHT eye, tall pointed ears; snow-white fur with soft lavender-grey shading, a thick spiky mane of fur round his head, cheeks and neck, and a thin white braid with small silver rings beside his RIGHT cheek. A cream-white fur collar on a crimson fur-lined cape over both shoulders and down to the middle of his back, a round silver knotwork brooch on his LEFT chest, a dark-steel pauldron shaped like a snarling wolf head on his LEFT shoulder. A sleeveless deep-navy tunic with a silver knotwork band down the front, split into front panels over a crimson underlayer; a brown leather belt with a big round silver knotwork buckle. Bare white-furred arms with dark brown leather bracers; a heavy steel chain wrapped round his LEFT forearm with four broken links hanging. Baggy charcoal-black trousers, dark brown boots with crisscross straps and thick white fur cuffs. A huge bushy white tail.
Axe: copy his Viking greataxe exactly from the third attached picture. It is one rigid object that never changes from frame to frame: always the same length — almost as long as he is tall — always straight, never shorter, never bent, never a small one-handed axe. Its parts, from the top end down: a round silver ball cap; a short dark-steel section carved with knotwork; ONE broad silver crescent blade fixed to the side of that steel section and sticking out sideways at a right angle to the haft — the haft does not end in the blade, it carries on past the blade up to the silver ball; a snarling dark-iron wolf head on the blade's flat face next to the haft, and an ice-blue knotwork pattern along the blade; below the blade the long crimson haft wrapped with dark crisscross straps and silver bands; and at the bottom end a pointed silver spike. The ball is always at the blade end and the pointed spike always at the far end.
How he holds it, unless a frame says otherwise: with both hands he grips the lower half of the haft, one hand just above the pointed spike and the other a little higher, so the long haft and the blade reach far out beyond his hands; with one hand while standing, the axe stands upright beside him on its pointed spike, his hand round the haft at chest height and the blade beside his head, as in the standing pictures.
View: every frame shows him from the same front three-quarter view as the large attached picture — body and face turned toward the lower right of the picture.
Layout: landscape 1536×1024, 4 frames in a 2×2 grid read like a book (top-left, top-right, bottom-left, bottom-right). Each frame sits in its own quarter of the picture, the wolf the same size in every frame, his whole body (ears, tail, boots) and the WHOLE axe inside his own quarter with clear empty space around it — frames never touch or overlap. Draw him small: standing up straight he would be only about 45% of a frame's height, so the long axe fits in every pose — never shorten the axe to make it fit.
Frames:
1. Drawing breath: chest swelling, shoulders back, head lowered a little, the greataxe standing upright beside him on its pointed spike in his right hand, the blade beside his head, his left fist clenched.
2. Howl: head thrown back with the muzzle pointing up at the sky, mouth open in a long wolf howl, eyes closed, ears laid back, chest pushed out, mane and tail bristling, the greataxe still standing upright beside him in his right hand.
3. The same howl a moment later, almost identical — mane, braid, cape and tail swayed the other way — so frames 2 and 3 can loop.
4. Battle fury: hunched forward, fangs bared in a fierce snarl, fierce narrowed eyes, fur bristling, his right hand clenched tight round the upright greataxe beside him, his left fist clenched.
Background: flat solid pure green #00FF00 everywhere, no gradient, no floor, no shadow under him.
No effects at all: no slash trails, motion lines, speed lines, glow, runes in the air, ice, lightning, sparkles, dust, cracks, impact bursts, symbols, text, numbers or frame borders — only the wolf and his axe; show the movement with the pose alone. The ice-blue pattern on the blade stays a flat painted pattern, never glowing. No green anywhere on him.
```

### ③ ท่าเงื้อขวานชาร์จ (4 เฟรม)
ใช้กับ Executioner · Wolf Finale · ช่วงชาร์จของ Valhalla's Wrath (ท่าค้างก่อนฟันแบบท่าชาร์จของแมว)

```
2.5D game sprite sheet — the white wolf warrior gathering power for a huge overhead axe blow, 4 frames: a charge-up stance he holds before striking.
Use the three attached pictures: the large picture shows exactly how he looks and how he is rendered, the row of five pictures shows him from every side, and the third picture shows his greataxe on its own (the same axe standing up, lying flat and tilted) — copy his look and his axe exactly.
Style: the same 2.5D look as the attached pictures — a stylized 3D game model with solid volume and depth, rendered with a toon shader that imitates hand-drawn art: clean dark-brown hand-drawn-looking outlines, soft cel shading in 2–3 tones that follows the 3D forms, one warm key light from the upper left, a thin bright rim light along the edges, matte painted textures (fluffy fur, cloth, worn leather, brushed steel). Not photorealistic, not glossy plastic, not a flat 2D drawing. Keep his body proportions exactly as in the pictures.
Camera: the same as in the attached pictures — looking down at him from about 30 degrees above, with no perspective distortion.
Character: a white wolf warrior with a full wolf head — a strong muzzle, a black nose, bright ice-blue eyes, a small red X-shaped scar above his RIGHT eye, tall pointed ears; snow-white fur with soft lavender-grey shading, a thick spiky mane of fur round his head, cheeks and neck, and a thin white braid with small silver rings beside his RIGHT cheek. A cream-white fur collar on a crimson fur-lined cape over both shoulders and down to the middle of his back, a round silver knotwork brooch on his LEFT chest, a dark-steel pauldron shaped like a snarling wolf head on his LEFT shoulder. A sleeveless deep-navy tunic with a silver knotwork band down the front, split into front panels over a crimson underlayer; a brown leather belt with a big round silver knotwork buckle. Bare white-furred arms with dark brown leather bracers; a heavy steel chain wrapped round his LEFT forearm with four broken links hanging. Baggy charcoal-black trousers, dark brown boots with crisscross straps and thick white fur cuffs. A huge bushy white tail.
Axe: copy his Viking greataxe exactly from the third attached picture. It is one rigid object that never changes from frame to frame: always the same length — almost as long as he is tall — always straight, never shorter, never bent, never a small one-handed axe. Its parts, from the top end down: a round silver ball cap; a short dark-steel section carved with knotwork; ONE broad silver crescent blade fixed to the side of that steel section and sticking out sideways at a right angle to the haft — the haft does not end in the blade, it carries on past the blade up to the silver ball; a snarling dark-iron wolf head on the blade's flat face next to the haft, and an ice-blue knotwork pattern along the blade; below the blade the long crimson haft wrapped with dark crisscross straps and silver bands; and at the bottom end a pointed silver spike. The ball is always at the blade end and the pointed spike always at the far end.
How he holds it, unless a frame says otherwise: with both hands he grips the lower half of the haft, one hand just above the pointed spike and the other a little higher, so the long haft and the blade reach far out beyond his hands; with one hand while standing, the axe stands upright beside him on its pointed spike, his hand round the haft at chest height and the blade beside his head, as in the standing pictures.
View: every frame shows him from the same front three-quarter view as the large attached picture — body and face turned toward the lower right of the picture.
Layout: landscape 1536×1024, 4 frames in a 2×2 grid read like a book (top-left, top-right, bottom-left, bottom-right). Each frame sits in its own quarter of the picture, the wolf the same size in every frame, his whole body (ears, tail, boots) and the WHOLE axe inside his own quarter with clear empty space around it — frames never touch or overlap. Draw him small: standing up straight he would be only about 45% of a frame's height, so the long axe fits in every pose — never shorten the axe to make it fit.
Frames:
1. Bracing: feet wide apart, knees bending, both hands on the lower part of the haft, the long axe held diagonally across in front of him with the blade high beside his right shoulder.
2. Heaving: the long axe swung up and back over his right shoulder in both hands, body starting to twist.
3. Full charge: both hands beside his head on the lower part of the haft, the long axe drawn back over his right shoulder with the blade far behind his back, body coiled and leaning back, knees deeply bent, weight on the back foot, fangs bared, eyes locked on the target to the lower right, fur bristling.
4. The same full charge a moment later, almost identical — shoulders a little lower, cape, mane and tail swayed the other way — so frames 3 and 4 can loop.
He holds the axe up the whole time; he does not swing it down.
Background: flat solid pure green #00FF00 everywhere, no gradient, no floor, no shadow under him.
No effects at all: no slash trails, motion lines, speed lines, glow, runes in the air, ice, lightning, sparkles, dust, cracks, impact bursts, symbols, text, numbers or frame borders — only the wolf and his axe; show the movement with the pose alone. The ice-blue pattern on the blade stays a flat painted pattern, never glowing. No green anywhere on him.
```

### ④ ท่าพุ่ง (4 เฟรม)
ใช้กับ Battle Step · Storm Step (+ ช่วงไถลของ Vampiric Axe · Blood Rush · Lightning Pursuit · Ice Break ถ้าต่อเข้าได้)

```
2.5D game sprite sheet — the white wolf warrior's low sprinting dash, 4 frames.
Use the three attached pictures: the large picture shows exactly how he looks and how he is rendered, the row of five pictures shows him from every side, and the third picture shows his greataxe on its own (the same axe standing up, lying flat and tilted) — copy his look and his axe exactly.
Style: the same 2.5D look as the attached pictures — a stylized 3D game model with solid volume and depth, rendered with a toon shader that imitates hand-drawn art: clean dark-brown hand-drawn-looking outlines, soft cel shading in 2–3 tones that follows the 3D forms, one warm key light from the upper left, a thin bright rim light along the edges, matte painted textures (fluffy fur, cloth, worn leather, brushed steel). Not photorealistic, not glossy plastic, not a flat 2D drawing. Keep his body proportions exactly as in the pictures.
Camera: the same as in the attached pictures — looking down at him from about 30 degrees above, with no perspective distortion.
Character: a white wolf warrior with a full wolf head — a strong muzzle, a black nose, bright ice-blue eyes, a small red X-shaped scar above his RIGHT eye, tall pointed ears; snow-white fur with soft lavender-grey shading, a thick spiky mane of fur round his head, cheeks and neck, and a thin white braid with small silver rings beside his RIGHT cheek. A cream-white fur collar on a crimson fur-lined cape over both shoulders and down to the middle of his back, a round silver knotwork brooch on his LEFT chest, a dark-steel pauldron shaped like a snarling wolf head on his LEFT shoulder. A sleeveless deep-navy tunic with a silver knotwork band down the front, split into front panels over a crimson underlayer; a brown leather belt with a big round silver knotwork buckle. Bare white-furred arms with dark brown leather bracers; a heavy steel chain wrapped round his LEFT forearm with four broken links hanging. Baggy charcoal-black trousers, dark brown boots with crisscross straps and thick white fur cuffs. A huge bushy white tail.
Axe: copy his Viking greataxe exactly from the third attached picture. It is one rigid object that never changes from frame to frame: always the same length — almost as long as he is tall — always straight, never shorter, never bent, never a small one-handed axe. Its parts, from the top end down: a round silver ball cap; a short dark-steel section carved with knotwork; ONE broad silver crescent blade fixed to the side of that steel section and sticking out sideways at a right angle to the haft — the haft does not end in the blade, it carries on past the blade up to the silver ball; a snarling dark-iron wolf head on the blade's flat face next to the haft, and an ice-blue knotwork pattern along the blade; below the blade the long crimson haft wrapped with dark crisscross straps and silver bands; and at the bottom end a pointed silver spike. The ball is always at the blade end and the pointed spike always at the far end.
How he holds it, unless a frame says otherwise: with both hands he grips the lower half of the haft, one hand just above the pointed spike and the other a little higher, so the long haft and the blade reach far out beyond his hands; with one hand while standing, the axe stands upright beside him on its pointed spike, his hand round the haft at chest height and the blade beside his head, as in the standing pictures.
View: every frame shows him from the same front three-quarter view as the large attached picture — body and face turned toward the lower right of the picture.
Layout: landscape 1536×1024, 4 frames in a 2×2 grid read like a book (top-left, top-right, bottom-left, bottom-right). Each frame sits in its own quarter of the picture, the wolf the same size in every frame, his whole body (ears, tail, boots) and the WHOLE axe inside his own quarter with clear empty space around it — frames never touch or overlap. Draw him small: standing up straight he would be only about 45% of a frame's height, so the long axe fits in every pose — never shorten the axe to make it fit.
Frames:
1. Push-off: body low and leaning far forward toward the lower right, back leg pushing, front knee bent, his right hand on the lower end of the haft near the pointed spike, the long axe trailing far behind him with the blade just above the ground.
2. Full dash: body very low and stretched forward, one leg reaching forward and the other stretched back, the long axe trailing far behind him close to the ground, cape, braid and tail streaming straight back.
3. The same full dash with the legs swapped.
4. Sliding stop: skidding to a halt in a low, wide crouch, both hands on the lower part of the haft, the long axe swung forward with the blade out in front of him, ready to strike, cape swinging forward.
Background: flat solid pure green #00FF00 everywhere, no gradient, no floor, no shadow under him.
No effects at all: no slash trails, motion lines, speed lines, glow, runes in the air, ice, lightning, sparkles, dust, cracks, impact bursts, symbols, text, numbers or frame borders — only the wolf and his axe; show the movement with the pose alone. The ice-blue pattern on the blade stays a flat painted pattern, never glowing. No green anywhere on him.
```

### ⑤ ท่าตั้งการ์ด (4 เฟรม)
ใช้กับ Iron Counter · Rune Guard (เฟรม 1–3) · Rune Burst (เฟรม 4)

```
2.5D game sprite sheet — the white wolf warrior's axe guard and parry, 4 frames.
Use the three attached pictures: the large picture shows exactly how he looks and how he is rendered, the row of five pictures shows him from every side, and the third picture shows his greataxe on its own (the same axe standing up, lying flat and tilted) — copy his look and his axe exactly.
Style: the same 2.5D look as the attached pictures — a stylized 3D game model with solid volume and depth, rendered with a toon shader that imitates hand-drawn art: clean dark-brown hand-drawn-looking outlines, soft cel shading in 2–3 tones that follows the 3D forms, one warm key light from the upper left, a thin bright rim light along the edges, matte painted textures (fluffy fur, cloth, worn leather, brushed steel). Not photorealistic, not glossy plastic, not a flat 2D drawing. Keep his body proportions exactly as in the pictures.
Camera: the same as in the attached pictures — looking down at him from about 30 degrees above, with no perspective distortion.
Character: a white wolf warrior with a full wolf head — a strong muzzle, a black nose, bright ice-blue eyes, a small red X-shaped scar above his RIGHT eye, tall pointed ears; snow-white fur with soft lavender-grey shading, a thick spiky mane of fur round his head, cheeks and neck, and a thin white braid with small silver rings beside his RIGHT cheek. A cream-white fur collar on a crimson fur-lined cape over both shoulders and down to the middle of his back, a round silver knotwork brooch on his LEFT chest, a dark-steel pauldron shaped like a snarling wolf head on his LEFT shoulder. A sleeveless deep-navy tunic with a silver knotwork band down the front, split into front panels over a crimson underlayer; a brown leather belt with a big round silver knotwork buckle. Bare white-furred arms with dark brown leather bracers; a heavy steel chain wrapped round his LEFT forearm with four broken links hanging. Baggy charcoal-black trousers, dark brown boots with crisscross straps and thick white fur cuffs. A huge bushy white tail.
Axe: copy his Viking greataxe exactly from the third attached picture. It is one rigid object that never changes from frame to frame: always the same length — almost as long as he is tall — always straight, never shorter, never bent, never a small one-handed axe. Its parts, from the top end down: a round silver ball cap; a short dark-steel section carved with knotwork; ONE broad silver crescent blade fixed to the side of that steel section and sticking out sideways at a right angle to the haft — the haft does not end in the blade, it carries on past the blade up to the silver ball; a snarling dark-iron wolf head on the blade's flat face next to the haft, and an ice-blue knotwork pattern along the blade; below the blade the long crimson haft wrapped with dark crisscross straps and silver bands; and at the bottom end a pointed silver spike. The ball is always at the blade end and the pointed spike always at the far end.
How he holds it, unless a frame says otherwise: with both hands he grips the lower half of the haft, one hand just above the pointed spike and the other a little higher, so the long haft and the blade reach far out beyond his hands; with one hand while standing, the axe stands upright beside him on its pointed spike, his hand round the haft at chest height and the blade beside his head, as in the standing pictures.
View: every frame shows him from the same front three-quarter view as the large attached picture — body and face turned toward the lower right of the picture.
Layout: landscape 1536×1024, 4 frames in a 2×2 grid read like a book (top-left, top-right, bottom-left, bottom-right). Each frame sits in its own quarter of the picture, the wolf the same size in every frame, his whole body (ears, tail, boots) and the WHOLE axe inside his own quarter with clear empty space around it — frames never touch or overlap. Draw him small: standing up straight he would be only about 45% of a frame's height, so the long axe fits in every pose — never shorten the axe to make it fit.
Frames:
1. Raising his guard: feet apart, knees bent, both hands bringing the long haft up in front of him.
2. Guard: the long haft held across in front of his chest with both hands spread apart along it — his right hand nearer the blade, his left hand lower down — the blade end up beside his head on the left side of the picture and the pointed spike low on the right side of the picture, the haft sticking out far past his body on both sides; elbows out, knees bent, sharp eyes looking over the haft.
3. The same guard a moment later, almost identical — shoulders a little lower, cape and tail swayed the other way — so frames 2 and 3 can loop.
4. Shove: both arms thrust forward, pushing the long haft out toward the lower right to knock an attack away, body leaning forward, cape flaring.
Background: flat solid pure green #00FF00 everywhere, no gradient, no floor, no shadow under him.
No effects at all: no slash trails, motion lines, speed lines, glow, runes in the air, ice, lightning, sparkles, dust, cracks, impact bursts, symbols, text, numbers or frame borders — only the wolf and his axe; show the movement with the pose alone. The ice-blue pattern on the blade stays a flat painted pattern, never glowing. No green anywhere on him.
```

### ⑥ ท่าร่ายรูน (4 เฟรม)
ใช้กับ Ice Prison · Thunder Spear (เฟรม 1–2) · Blizzard · Tempest Field · Frozen Descent · Ragnarok's Judgment (เฟรม 1 → 3–4) — ให้สาย B มีท่าของตัวเอง

```
2.5D game sprite sheet — the white wolf warrior casting a rune spell, 4 frames.
Use the three attached pictures: the large picture shows exactly how he looks and how he is rendered, the row of five pictures shows him from every side, and the third picture shows his greataxe on its own (the same axe standing up, lying flat and tilted) — copy his look and his axe exactly.
Style: the same 2.5D look as the attached pictures — a stylized 3D game model with solid volume and depth, rendered with a toon shader that imitates hand-drawn art: clean dark-brown hand-drawn-looking outlines, soft cel shading in 2–3 tones that follows the 3D forms, one warm key light from the upper left, a thin bright rim light along the edges, matte painted textures (fluffy fur, cloth, worn leather, brushed steel). Not photorealistic, not glossy plastic, not a flat 2D drawing. Keep his body proportions exactly as in the pictures.
Camera: the same as in the attached pictures — looking down at him from about 30 degrees above, with no perspective distortion.
Character: a white wolf warrior with a full wolf head — a strong muzzle, a black nose, bright ice-blue eyes, a small red X-shaped scar above his RIGHT eye, tall pointed ears; snow-white fur with soft lavender-grey shading, a thick spiky mane of fur round his head, cheeks and neck, and a thin white braid with small silver rings beside his RIGHT cheek. A cream-white fur collar on a crimson fur-lined cape over both shoulders and down to the middle of his back, a round silver knotwork brooch on his LEFT chest, a dark-steel pauldron shaped like a snarling wolf head on his LEFT shoulder. A sleeveless deep-navy tunic with a silver knotwork band down the front, split into front panels over a crimson underlayer; a brown leather belt with a big round silver knotwork buckle. Bare white-furred arms with dark brown leather bracers; a heavy steel chain wrapped round his LEFT forearm with four broken links hanging. Baggy charcoal-black trousers, dark brown boots with crisscross straps and thick white fur cuffs. A huge bushy white tail.
Axe: copy his Viking greataxe exactly from the third attached picture. It is one rigid object that never changes from frame to frame: always the same length — almost as long as he is tall — always straight, never shorter, never bent, never a small one-handed axe. Its parts, from the top end down: a round silver ball cap; a short dark-steel section carved with knotwork; ONE broad silver crescent blade fixed to the side of that steel section and sticking out sideways at a right angle to the haft — the haft does not end in the blade, it carries on past the blade up to the silver ball; a snarling dark-iron wolf head on the blade's flat face next to the haft, and an ice-blue knotwork pattern along the blade; below the blade the long crimson haft wrapped with dark crisscross straps and silver bands; and at the bottom end a pointed silver spike. The ball is always at the blade end and the pointed spike always at the far end.
How he holds it, unless a frame says otherwise: with both hands he grips the lower half of the haft, one hand just above the pointed spike and the other a little higher, so the long haft and the blade reach far out beyond his hands; with one hand while standing, the axe stands upright beside him on its pointed spike, his hand round the haft at chest height and the blade beside his head, as in the standing pictures.
View: every frame shows him from the same front three-quarter view as the large attached picture — body and face turned toward the lower right of the picture.
Layout: landscape 1536×1024, 4 frames in a 2×2 grid read like a book (top-left, top-right, bottom-left, bottom-right). Each frame sits in its own quarter of the picture, the wolf the same size in every frame, his whole body (ears, tail, boots) and the WHOLE axe inside his own quarter with clear empty space around it — frames never touch or overlap. Draw him small: standing up straight he would be only about 45% of a frame's height, so the long axe fits in every pose — never shorten the axe to make it fit.
Frames:
1. Gathering: the greataxe standing upright beside him on its pointed spike in his right hand, as in the standing pictures, his left hand raised in front of his chest with the palm open, eyes half closed, calm.
2. Casting forward: his left arm stretched out toward the lower right, the open palm aimed at a spot on the ground ahead, fingers spread, the greataxe still standing upright beside him in his right hand.
3. Calling the storm: both arms raised high — the greataxe held straight up above his head in his right hand, gripped at the middle of the haft, with the blade high in the air, and his left palm open to the sky — head tilted back, cape, mane and braid lifting as if in a rising wind.
4. The same pose a moment later, almost identical — cape, braid and tail drifting the other way — so frames 3 and 4 can loop.
Background: flat solid pure green #00FF00 everywhere, no gradient, no floor, no shadow under him.
No effects at all: no slash trails, motion lines, speed lines, glow, runes in the air, ice, lightning, sparkles, dust, cracks, impact bursts, symbols, text, numbers or frame borders — only the wolf and his axe; show the movement with the pose alone. The ice-blue pattern on the blade stays a flat painted pattern, never glowing. No green anywhere on him.
```

### ⑦ ท่าหมุนขวาน (4 เฟรม = หมุน 1 รอบ)
ใช้กับ Axe Cyclone

```
2.5D game sprite sheet — the white wolf warrior's spinning axe whirlwind, 4 frames = one full turn in place.
Use the three attached pictures: the large picture shows exactly how he looks and how he is rendered, the row of five pictures shows him from every side, and the third picture shows his greataxe on its own (the same axe standing up, lying flat and tilted) — copy his look and his axe exactly.
Style: the same 2.5D look as the attached pictures — a stylized 3D game model with solid volume and depth, rendered with a toon shader that imitates hand-drawn art: clean dark-brown hand-drawn-looking outlines, soft cel shading in 2–3 tones that follows the 3D forms, one warm key light from the upper left, a thin bright rim light along the edges, matte painted textures (fluffy fur, cloth, worn leather, brushed steel). Not photorealistic, not glossy plastic, not a flat 2D drawing. Keep his body proportions exactly as in the pictures.
Camera: the same as in the attached pictures — looking down at him from about 30 degrees above, with no perspective distortion.
Character: a white wolf warrior with a full wolf head — a strong muzzle, a black nose, bright ice-blue eyes, a small red X-shaped scar above his RIGHT eye, tall pointed ears; snow-white fur with soft lavender-grey shading, a thick spiky mane of fur round his head, cheeks and neck, and a thin white braid with small silver rings beside his RIGHT cheek. A cream-white fur collar on a crimson fur-lined cape over both shoulders and down to the middle of his back, a round silver knotwork brooch on his LEFT chest, a dark-steel pauldron shaped like a snarling wolf head on his LEFT shoulder. A sleeveless deep-navy tunic with a silver knotwork band down the front, split into front panels over a crimson underlayer; a brown leather belt with a big round silver knotwork buckle. Bare white-furred arms with dark brown leather bracers; a heavy steel chain wrapped round his LEFT forearm with four broken links hanging. Baggy charcoal-black trousers, dark brown boots with crisscross straps and thick white fur cuffs. A huge bushy white tail.
Axe: copy his Viking greataxe exactly from the third attached picture. It is one rigid object that never changes from frame to frame: always the same length — almost as long as he is tall — always straight, never shorter, never bent, never a small one-handed axe. Its parts, from the top end down: a round silver ball cap; a short dark-steel section carved with knotwork; ONE broad silver crescent blade fixed to the side of that steel section and sticking out sideways at a right angle to the haft — the haft does not end in the blade, it carries on past the blade up to the silver ball; a snarling dark-iron wolf head on the blade's flat face next to the haft, and an ice-blue knotwork pattern along the blade; below the blade the long crimson haft wrapped with dark crisscross straps and silver bands; and at the bottom end a pointed silver spike. The ball is always at the blade end and the pointed spike always at the far end.
How he holds it, unless a frame says otherwise: with both hands he grips the lower half of the haft, one hand just above the pointed spike and the other a little higher, so the long haft and the blade reach far out beyond his hands; with one hand while standing, the axe stands upright beside him on its pointed spike, his hand round the haft at chest height and the blade beside his head, as in the standing pictures.
View: the four frames are one full turn in place, all from the same camera; in every frame his feet stay on the same spot, both hands grip the haft just above the pointed spike and he holds the long axe out level at full arm's length, the blade far out to his right side, leaning a little into the spin, his cape, braid and tail flaring out.
Layout: landscape 1536×1024, 4 frames in a 2×2 grid read like a book (top-left, top-right, bottom-left, bottom-right). Each frame sits in its own quarter of the picture, the wolf the same size in every frame, his whole body (ears, tail, boots) and the WHOLE axe inside his own quarter with clear empty space around it — frames never touch or overlap. Draw him small: standing up straight he would be only about 45% of a frame's height, so the long axe fits in every pose — never shorten the axe to make it fit.
Frames:
1. Front view, facing us.
2. Side view, facing the right of the picture.
3. Back view: we see his cape, the back of his head and his tail.
4. Side view, facing the left of the picture.
Background: flat solid pure green #00FF00 everywhere, no gradient, no floor, no shadow under him.
No effects at all: no slash trails, motion lines, speed lines, glow, runes in the air, ice, lightning, sparkles, dust, cracks, impact bursts, symbols, text, numbers or frame borders — only the wolf and his axe; show the movement with the pose alone. The ice-blue pattern on the blade stays a flat painted pattern, never glowing. No green anywhere on him.
```

### ⑧ ท่าฟันกวาดแนวนอน (4 เฟรม)
ใช้กับ Blood Cleave · Axe Dance (สลับกับท่าฟันลง) · Savage Rend (ฟันที่สอง) · Reversal Slash

```
2.5D game sprite sheet — the white wolf warrior's wide horizontal axe sweep, 4 frames.
Use the three attached pictures: the large picture shows exactly how he looks and how he is rendered, the row of five pictures shows him from every side, and the third picture shows his greataxe on its own (the same axe standing up, lying flat and tilted) — copy his look and his axe exactly.
Style: the same 2.5D look as the attached pictures — a stylized 3D game model with solid volume and depth, rendered with a toon shader that imitates hand-drawn art: clean dark-brown hand-drawn-looking outlines, soft cel shading in 2–3 tones that follows the 3D forms, one warm key light from the upper left, a thin bright rim light along the edges, matte painted textures (fluffy fur, cloth, worn leather, brushed steel). Not photorealistic, not glossy plastic, not a flat 2D drawing. Keep his body proportions exactly as in the pictures.
Camera: the same as in the attached pictures — looking down at him from about 30 degrees above, with no perspective distortion.
Character: a white wolf warrior with a full wolf head — a strong muzzle, a black nose, bright ice-blue eyes, a small red X-shaped scar above his RIGHT eye, tall pointed ears; snow-white fur with soft lavender-grey shading, a thick spiky mane of fur round his head, cheeks and neck, and a thin white braid with small silver rings beside his RIGHT cheek. A cream-white fur collar on a crimson fur-lined cape over both shoulders and down to the middle of his back, a round silver knotwork brooch on his LEFT chest, a dark-steel pauldron shaped like a snarling wolf head on his LEFT shoulder. A sleeveless deep-navy tunic with a silver knotwork band down the front, split into front panels over a crimson underlayer; a brown leather belt with a big round silver knotwork buckle. Bare white-furred arms with dark brown leather bracers; a heavy steel chain wrapped round his LEFT forearm with four broken links hanging. Baggy charcoal-black trousers, dark brown boots with crisscross straps and thick white fur cuffs. A huge bushy white tail.
Axe: copy his Viking greataxe exactly from the third attached picture. It is one rigid object that never changes from frame to frame: always the same length — almost as long as he is tall — always straight, never shorter, never bent, never a small one-handed axe. Its parts, from the top end down: a round silver ball cap; a short dark-steel section carved with knotwork; ONE broad silver crescent blade fixed to the side of that steel section and sticking out sideways at a right angle to the haft — the haft does not end in the blade, it carries on past the blade up to the silver ball; a snarling dark-iron wolf head on the blade's flat face next to the haft, and an ice-blue knotwork pattern along the blade; below the blade the long crimson haft wrapped with dark crisscross straps and silver bands; and at the bottom end a pointed silver spike. The ball is always at the blade end and the pointed spike always at the far end.
How he holds it, unless a frame says otherwise: with both hands he grips the lower half of the haft, one hand just above the pointed spike and the other a little higher, so the long haft and the blade reach far out beyond his hands; with one hand while standing, the axe stands upright beside him on its pointed spike, his hand round the haft at chest height and the blade beside his head, as in the standing pictures.
View: every frame shows him from the same front three-quarter view as the large attached picture — body and face turned toward the lower right of the picture.
Layout: landscape 1536×1024, 4 frames in a 2×2 grid read like a book (top-left, top-right, bottom-left, bottom-right). Each frame sits in its own quarter of the picture, the wolf the same size in every frame, his whole body (ears, tail, boots) and the WHOLE axe inside his own quarter with clear empty space around it — frames never touch or overlap. Draw him small: standing up straight he would be only about 45% of a frame's height, so the long axe fits in every pose — never shorten the axe to make it fit.
Frames:
1. Wind-up: both hands on the lower part of the haft pulling the long axe far back to his right side at waist height (the left side of the picture), the blade far out behind him, body twisted away, weight on the back foot.
2. Mid-sweep: the long axe swinging level across in front of him at waist height, the blade far out in front of him toward the lower right with its edge leading, body turning.
3. Follow-through: the long axe swung all the way across to his left side (the right side of the picture), the blade far out on that side, body twisted the other way, weight on the front foot.
4. Recovering: back in a ready stance, the long axe held diagonally in front of him in both hands with the blade up beside his right shoulder.
Background: flat solid pure green #00FF00 everywhere, no gradient, no floor, no shadow under him.
No effects at all: no slash trails, motion lines, speed lines, glow, runes in the air, ice, lightning, sparkles, dust, cracks, impact bursts, symbols, text, numbers or frame borders — only the wolf and his axe; show the movement with the pose alone. The ice-blue pattern on the blade stays a flat painted pattern, never glowing. No green anywhere on him.
```

### ⑨ ท่านั่งพัก (1 ภาพ 8 มุม)
ใช้กับ นั่งพัก (ปุ่ม Insert / 🧘) แบบแมว ลิง จากัวร์ — ตอนนี้หมาป่านั่งไม่ได้

```
2.5D game sprite sheet — the white wolf warrior sitting down to rest, the same pose seen from 8 directions.
Use the three attached pictures: the large picture shows exactly how he looks and how he is rendered, the row of five pictures shows him from every side, and the third picture shows his greataxe on its own (the same axe standing up, lying flat and tilted) — copy his look and his axe exactly.
Style: the same 2.5D look as the attached pictures — a stylized 3D game model with solid volume and depth, rendered with a toon shader that imitates hand-drawn art: clean dark-brown hand-drawn-looking outlines, soft cel shading in 2–3 tones that follows the 3D forms, one warm key light from the upper left, a thin bright rim light along the edges, matte painted textures (fluffy fur, cloth, worn leather, brushed steel). Not photorealistic, not glossy plastic, not a flat 2D drawing. Keep his body proportions exactly as in the pictures.
Camera: the same as in the attached pictures — looking down at him from about 30 degrees above, with no perspective distortion.
Character: a white wolf warrior with a full wolf head — a strong muzzle, a black nose, bright ice-blue eyes, a small red X-shaped scar above his RIGHT eye, tall pointed ears; snow-white fur with soft lavender-grey shading, a thick spiky mane of fur round his head, cheeks and neck, and a thin white braid with small silver rings beside his RIGHT cheek. A cream-white fur collar on a crimson fur-lined cape over both shoulders and down to the middle of his back, a round silver knotwork brooch on his LEFT chest, a dark-steel pauldron shaped like a snarling wolf head on his LEFT shoulder. A sleeveless deep-navy tunic with a silver knotwork band down the front, split into front panels over a crimson underlayer; a brown leather belt with a big round silver knotwork buckle. Bare white-furred arms with dark brown leather bracers; a heavy steel chain wrapped round his LEFT forearm with four broken links hanging. Baggy charcoal-black trousers, dark brown boots with crisscross straps and thick white fur cuffs. A huge bushy white tail.
Axe: copy his Viking greataxe exactly from the third attached picture. It is one rigid object that never changes from frame to frame: always the same length — almost as long as he is tall — always straight, never shorter, never bent, never a small one-handed axe. Its parts, from the top end down: a round silver ball cap; a short dark-steel section carved with knotwork; ONE broad silver crescent blade fixed to the side of that steel section and sticking out sideways at a right angle to the haft — the haft does not end in the blade, it carries on past the blade up to the silver ball; a snarling dark-iron wolf head on the blade's flat face next to the haft, and an ice-blue knotwork pattern along the blade; below the blade the long crimson haft wrapped with dark crisscross straps and silver bands; and at the bottom end a pointed silver spike. The ball is always at the blade end and the pointed spike always at the far end.
Pose (the same in all 8 pictures): he sits cross-legged on the ground, back straight, his left hand resting on his knee and his right hand holding the greataxe, which stands upright beside his right shoulder on its pointed spike at its full length with the blade above his head; his tail curled around him, a calm, relaxed face with eyes open.
Layout: landscape 1536×1024, 8 pictures in 2 rows of 4, read left to right, top row first. Each picture sits in its own eighth of the picture, the wolf the same size in every picture, his whole body (ears, tail, boots) and the WHOLE axe inside his own area with clear empty space around it — pictures never touch or overlap. Draw him small enough that the whole upright axe fits in every picture — never shorten the axe to make it fit.
Pictures:
1. Front view, facing us.
2. Front three-quarter view, turned toward the lower right.
3. Side view, facing right.
4. Back three-quarter view, turned toward the upper right.
5. Back view: we see his cape and tail.
6. Back three-quarter view, turned toward the upper left.
7. Side view, facing left.
8. Front three-quarter view, turned toward the lower left.
Background: flat solid pure green #00FF00 everywhere, no gradient, no floor, no shadow under him.
No effects at all: no slash trails, motion lines, speed lines, glow, runes in the air, ice, lightning, sparkles, dust, cracks, impact bursts, symbols, text, numbers or frame borders — only the wolf and his axe. The ice-blue pattern on the blade stays a flat painted pattern, never glowing. No green anywhere on him.
```

แก้รูป (ส่งต่อท้ายในแชตเดิม):
- ขวานสั้น / หัวขวานผิดรูป → `Redo: in every frame the axe must be exactly the long greataxe in the third attached picture — almost as long as he is tall, the haft carrying on past the blade up to the round silver ball, the blade sticking out sideways, the pointed spike at the bottom end. Draw him smaller if the axe does not fit.`
- ตัวแบนเหมือนภาพวาด → `Redo: make him look like the attached 2.5D pictures — a 3D game model with rounded volume and soft 3D shading, clean hand-drawn outlines.`
- ขวานหลุดกรอบ / เฟรมชนกัน → `Redo: draw him smaller so each frame, including the whole axe, fits inside its own area with green space around it.`
- มีเอฟเฟกต์ (แสง เส้นความเร็ว ฝุ่น) → `Redo: remove every effect — only the wolf and his axe on flat green.`
- แผลเป็น / โซ่ / เกราะบ่าผิดข้าง → `Redo: the scar is above his RIGHT eye, the chain is on his LEFT forearm and the wolf-head pauldron is on his LEFT shoulder, as in the attached pictures.` (หรือใช้แปรงเลือกเฉพาะจุด)
- แก้แค่บางเฟรม → ใช้แปรงเลือกเฉพาะเฟรมนั้นใน ChatGPT (สั่งแก้ทั้งภาพ มันจะวาดใหม่หมด)

## พอได้รูปแล้วทำต่อยังไง (แผนสำหรับแชตที่ต่อจากนี้)

1. รอแอตลาส 2.5D จากคลิป 20 ตัวก่อน (`tools/clips/wolf25_plan.json` คัดเวลาเฟรมจาก `wolf_plan.json`) แล้วตัดแต่ละแผ่นเป็น state ใหม่ในแอตลาสนั้นด้วย `python3 -I tools/sheet_state.py tools/clips/wolf25_<ท่า>.json [preview.png]` (แบบ cat_charge / wukong_jump / jaguar_<ท่า>)
   - state `jump` `howl` `charge` `dash` `guard` `cast` `spin` `sweep` · rows / cols 2×3 (กระโดด) หรือ 2×2
   - scale = ขนาดหัวหมาป่าเหล็กบนใบขวานหรือหัวตัวเอง เทียบท่ายืน idle SE · เฟรมลอยกลางอากาศใช้เท้าข้างที่ต่ำที่สุด (เกมยกตัวด้วย player.z)
   - `clean` / `erase` ถ้า ChatGPT ทิ้งคราบแสงหรือเส้นไว้ · ห้ามเปลี่ยนเวลาแถว attack / buff เดิม
2. ผูกท่ากับสกิลในไฟล์ใหม่ `wolf_pose.js` (แบบ `jaguar_pose.js`): เปลี่ยนแค่เฟรมที่โชว์ ความยาวรวม เวลาตี เวลาพุ่ง event ทุกอันเท่าเดิม (ตรวจ make() ทุกสกิล × 8 ทิศ + `tools/fxlab.py hits` ใช้ FXSEED + sure hits)
   - กระโดด: หมอบ → ถีบตัว → ลอย ไล่ตามช่วงลอย (`dashUpd` / player.z) · เฟรมลงพื้นตรง event ลงพื้น
   - หอน: 1 → ลูป 2–3 · War Fury 1 → 4 ค้าง · ชาร์จ: 1–2 แล้วลูป 3–4 แทนเฟรมง้างของท่าฟัน (เก็บ 2 เฟรมสุดท้ายก่อน contact ไว้ เพราะเส้นฟันอ่านตำแหน่งหัวขวานจากเฟรมพวกนั้น)
   - ร่าย: 1 → 2 (ชี้เป้า) หรือ 1 → ลูป 3–4 (เรียกพายุ) · Ragnarok ลูป 3–4 ตลอดช่วงค้าง แล้วต่อท่าฟัน
   - หมุน: วน 4 ด้านแทนการวนเฟรม contact 8 ทิศใน mkAxeCyclone
   - พุ่งฟัน (Vampiric / Blood Rush / Lightning Pursuit / Ice Break): เส้นฟันผูกกับตำแหน่งเฟรม contact → ใส่ท่าพุ่งได้เฉพาะช่วงหลังเฟรมที่เส้นฟันอ่าน ต้องลองก่อน
   - ฟันกวาด: ต้องหาตำแหน่งหัวขวานทุกเฟรมของแผ่นนี้ (ลายรูนฟ้าบนใบขวาน แบบ cliphero `axe`) เส้นฟันถึงจะวิ่งตาม
3. ท่านั่ง: โหลด `hero_sit.js` ให้หมาป่า + เพิ่ม wolf ในตาราง SIT (ตัด 8 มุมด้วยโหมด `pics` ของ sheet_state.py แบบ `jaguar_sit.json`)
4. ใส่ `?wpose=0` ไว้ดูท่าเดิมเทียบ แล้วส่งคลิปเทียบให้เจ้าของดู

## สร้างแล้ว (2026-11-26 · แผ่นท่าเสริมชุดแก้ขวาน 11:45 + คลิป 2.5D 20 ตัว 11:44)

หมาป่า 2.5D เป็นร่างหลักในเกมแล้ว (`assets_wolf25.js` · `?wlf25=0` = ร่างแบนเดิม) · ท่าเสริมอยู่ในไฟล์แยก `assets_wolf25_pose.js` (prefix WLFP เซลล์ / จุดหมุนเดียวกัน · index.html รวมเข้าแอตลาส WLF ก่อนคูณ HERO_K) เล่นโดย `wolf_pose.js` · `?wpose=0` = ไม่โหลด (ท่าเดิมทุกสกิล)

| แผ่น | state | ใช้กับสกิล |
|---|---|---|
| ① กระโดดฟันลง | `jump` 6 เฟรม | Predator's Leap (ย่อ → ถีบ → ลอยตามช่วงลอยจริง → ลงพื้น 4–5) · Cyclone Leap · Ravenous Leap (ย่อ · ถีบ · ลอยค้าง แล้วต่อเฟรมฟันเดิมตรงจุดกระแทก เพราะเส้นฟันอ่านเฟรมพวกนั้น) |
| ② หอน | `howl` 4 | War Howl / Fenrir's Spirit / War Banner (ยืน → เงยหน้า → หอนเต็มตั้งแต่บัฟติด → ลดหัว) · War Fury = เฟรม 4 แยกเขี้ยวคำราม |
| ③ ชาร์จ | `charge` 4 | Executioner (แทนเฟรมง้างทีละช่อง เวลาแต่ละช่องเท่าเดิม — เส้นฟันอ่าน a.seq ตามลำดับ) · Wolf Finale (แทนช่วงยกขวาน แล้วฟันด้วยเฟรมเดิม) |
| ④ พุ่ง | `dash` 4 | Battle Step · Storm Step (ภาพมุมข้าง: ใช้เมื่อพุ่งไปทางขวา / ซ้าย ไม่ใช้ตอนพุ่งขึ้น / ลงตรงๆ) |
| ⑤ การ์ด | `guard` 4 | Iron Counter (ตั้งการ์ด → โดนตีแล้วสลับเป็นเฟรมรับแรง) · Rune Guard · Rune Burst (การ์ด → แทงขวานสวนตอนรูนระเบิด) |
| ⑦ หมุน | `spin` 4 ด้าน (S E N W) | Axe Cyclone (ทุกช่วงที่ตัวหมุน = ภาพด้านของทิศนั้น · ทุกทิศที่หันอยู่) |
| ⑨ นั่ง | `assets/sit/wolf25_<8 ทิศ>.webp` | กด Insert / ปุ่ม 🧘 (hero_sit.js · ฟื้น HP / SP ×2) |
| ⑥ ร่ายรูน | — | ยังไม่ได้แผ่น (ขอใหม่ได้ด้วยกล่อง ⑥ ข้างบน) |
| ⑧ ฟันกวาด | (มา 2 แบบ เก็บไว้ `poses25/sweep_a`, `sweep_b`) | ยังไม่ใส่: เส้นฟันวาดตามตำแหน่งหัวขวานของเฟรม ต้องหาจุดหัวขวานทุกเฟรมก่อน |

- ภาพยืน / ท่าเสริมเป็นมุมเดียว (เฉียงหน้า หันขวา = SE · เกมกลับด้านให้ SW / W) → ใช้เฉพาะตอนหันลง / ข้าง (S SE E SW W) · หันขึ้น (N NE NW) ยังเป็นเฟรมเดิม
- เวลาเหมือนเดิมทุกอย่าง: ความยาวท่า เวลาตี เวลาพุ่ง event ทุกตัว (เปลี่ยนแค่ภาพที่โชว์) — เช็กเวลาโดนตีเทียบ `?wpose=0` แล้ว
- ตัดแผ่น: `python3 -I tools/sheet_state.py tools/clips/wolf25_<ท่า>.json` (แผ่นดิบ `assets/heroes/wolf/poses25/<ท่า>.webp`) · scale เทียบหัว / ช่วงบนกับภาพยืน idle (jump .88 · charge .72 · ที่เหลือ .76) · `store` 1.5478 = เก็บภาพเล็กลงแบบแอตลาสคลิป · `clean` ลบคราบเขียว · `head` = จุดหัวทุกเฟรม (อ่านด้วยตา) ให้ปีกแฟชั่นตามท่า — ท่าหมุนไม่มี = ไม่วาดปีกช่วงหมุน
- ท่านั่ง: โหมด `pics` ของ sheet_state (`tools/clips/wolf25_sit.json`) k .75 · ขนาด × META_K เหมือนกรอบแอตลาสหมาป่า
- คลิปโชว์ท่า: `DSF=1.5 python3 tools/fx/wfclip.py pose` (ท่าใหม่) · เติม `'&wpose=0'` = ท่าเดิม

## Axe Dance ชุดใหม่ (2026-11-26 23:26)

เจ้าของ: "ท่าฟันตอนใช้ axedandce ดูไม่เท่เลยขอพร้มเจนท่าใหม่ได้ไหม"

**ทำไมไม่เท่:** `mkAxeDance` เล่นเฟรม attack `ct-2 … ct+1` (ท่าฟันลง 4 เฟรม) ซ้ำทุกจังหวะ 3 / 5 / 7 ครั้ง ครั้งละ 0.10–0.17 วิ แล้วจบด้วยท่าฟันลงเต็มท่า 0.78 วิ · เส้นฟัน v5 (`danceSwing` + ตาราง `DANCE` ใน `wolf_vfx5.js`) วนรอบตัว 6 แบบ แต่ตัวละครฟันลงท่าเดิมทุกครั้ง ท่ากับเส้นเลยไม่ตรงกัน · คลิป 2.5D มุม SE ยังหมุนตัวหันหลังให้กล้องตอนฟันโดนทุกครั้ง ตัวเลยสะบัดหน้า-หลังทุก 0.13 วิ

**แผ่นใหม่ 2 แผ่น** (2.5D มุมเดียว หน้าเฉียงหันขวา SE แบบท่าเสริมอื่น · เกมกลับด้านเองตอนหันซ้าย · ตอนหันหลังยังใช้เฟรมเดิม):

| # | แผ่น | เฟรม |
|---|---|---|
| ⑩ | ท่าฟัน 4 ท่า | 1 ฟันเสยขึ้น (ขวานสูงเหนือไหล่ ซ้ายภาพ) · 2 ฟันทแยงลง (ใบขวานต่ำหน้าเท้า ขวาภาพ) · 3 กวาดระดับเอวไปขวา · 4 กวาดกลับระดับไหล่ไปซ้าย (ยกเข่า) |
| ⑪ | ท่าปิด 4 ท่า | 1 ย่อบิดตัว ลากขวานไว้ข้างหลัง · 2 กระโดดหมุนกลางอากาศ (หันหลัง) · 3 ลงพื้นฟันกวาดใหญ่ · 4 พาดขวานบนบ่า |

วางในแชต ChatGPT เดียวกับแผ่นท่าเสริมชุดล่าสุด (ที่ขวานถูกแล้ว) · ถ้าเปิดแชตใหม่ แนบ 3 รูปเดิม (`tools/ref/wolf25_ref_SE.jpg`, `wolf25_ref_views.jpg`, `wolf25_axe_ref.jpg`)

### ⑩ Axe Dance — ท่าฟัน 4 ท่า (4 เฟรม)

```
2.5D game sprite sheet — the white wolf warrior's axe dance, 4 frames: the end poses of four big swings in a fast, flowing combo.
Use the three attached pictures: the large picture shows exactly how he looks and how he is rendered, the row of five pictures shows him from every side, and the third picture shows his greataxe on its own (the same axe standing up, lying flat and tilted) — copy his look and his axe exactly.
Style: the same 2.5D look as the attached pictures — a stylized 3D game model with solid volume and depth, rendered with a toon shader that imitates hand-drawn art: clean dark-brown hand-drawn-looking outlines, soft cel shading in 2–3 tones that follows the 3D forms, one warm key light from the upper left, a thin bright rim light along the edges, matte painted textures (fluffy fur, cloth, worn leather, brushed steel). Not photorealistic, not glossy plastic, not a flat 2D drawing. Keep his body proportions exactly as in the pictures.
Camera: the same as in the attached pictures — looking down at him from about 30 degrees above, with no perspective distortion.
Character: a white wolf warrior with a full wolf head — a strong muzzle, a black nose, bright ice-blue eyes, a small red X-shaped scar above his RIGHT eye, tall pointed ears; snow-white fur with soft lavender-grey shading, a thick spiky mane of fur round his head, cheeks and neck, and a thin white braid with small silver rings beside his RIGHT cheek. A cream-white fur collar on a crimson fur-lined cape over both shoulders and down to the middle of his back, a round silver knotwork brooch on his LEFT chest, a dark-steel pauldron shaped like a snarling wolf head on his LEFT shoulder. A sleeveless deep-navy tunic with a silver knotwork band down the front, split into front panels over a crimson underlayer; a brown leather belt with a big round silver knotwork buckle. Bare white-furred arms with dark brown leather bracers; a heavy steel chain wrapped round his LEFT forearm with four broken links hanging. Baggy charcoal-black trousers, dark brown boots with crisscross straps and thick white fur cuffs. A huge bushy white tail.
Axe: copy his Viking greataxe exactly from the third attached picture. It is one rigid object that never changes from frame to frame: always the same length — almost as long as he is tall — always straight, never shorter, never bent, never a small one-handed axe. Its parts, from the top end down: a round silver ball cap; a short dark-steel section carved with knotwork; ONE broad silver crescent blade fixed to the side of that steel section and sticking out sideways at a right angle to the haft — the haft does not end in the blade, it carries on past the blade up to the silver ball; a snarling dark-iron wolf head on the blade's flat face next to the haft, and an ice-blue knotwork pattern along the blade; below the blade the long crimson haft wrapped with dark crisscross straps and silver bands; and at the bottom end a pointed silver spike. The ball is always at the blade end and the pointed spike always at the far end.
How he holds it, unless a frame says otherwise: with both hands he grips the lower half of the haft, one hand just above the pointed spike and the other a little higher, so the long haft and the blade reach far out beyond his hands; with one hand while standing, the axe stands upright beside him on its pointed spike, his hand round the haft at chest height and the blade beside his head, as in the standing pictures.
View: every frame shows him from the same front three-quarter view as the large attached picture — body and face turned toward the lower right of the picture.
Layout: landscape 1536×1024, 4 frames in a 2×2 grid read like a book (top-left, top-right, bottom-left, bottom-right). Each frame sits in its own quarter of the picture, the wolf the same size in every frame, his whole body (ears, tail, boots) and the WHOLE axe inside his own quarter with clear empty space around it — frames never touch or overlap. Draw him small: standing up straight he would be only about 45% of a frame's height, so the long axe fits in every pose — never shorten the axe to make it fit.
This is a dance of heavy axe swings: in every frame his whole body twists, leans and stretches into the swing like a dancer — weight clearly on one foot, hips and shoulders turned, cape, braid, mane and tail swinging with the movement. Each frame shows the moment just after a swing ends, and the axe is in a clearly different place in every frame. Never a stiff stance with the haft held level in front of him like a stick.
Frames:
1. Rising cut: he has just whipped the long axe up from the ground. He stands tall, stretched up on the ball of his front foot with the back heel lifted, chest open, upper body twisted toward the left of the picture; both hands high above his head on the lower part of the haft, the long axe pointing up and back with the blade high in the air above his right shoulder on the LEFT side of the picture, its edge facing up; chin up, fangs bared; cape, braid and tail swinging upward.
2. Diving chop: he has just brought the long axe down in a big diagonal chop. Body folded low and forward, the front knee deeply bent and the back leg stretched far out behind, both hands low in front of his hips on the lower part of the haft, the long haft slanting steeply down and forward with the blade near the ground at the lower RIGHT of the picture, just in front of his front foot, its edge down; head low, eyes fierce, cape thrown forward.
3. Level sweep: he has just swung the long axe flat across in front of him from the left of the picture to the right. Wide, low stance, hips and upper body twisted toward the right of the picture, both arms stretched out, the long axe held level at waist height and reaching far out to the RIGHT side of the picture with the blade at the far end, its edge leading; cape and tail swinging out to the right.
4. Backhand sweep: he has just swung the long axe back flat across in front of him from the right of the picture to the left, at shoulder height. Upper body twisted toward the left of the picture, his arms crossed in front of his chest, the long axe held level at shoulder height and reaching far out to the LEFT side of the picture with the blade at the far end, its edge leading; one knee raised high like a dancer's step, balancing on the other foot; cape, braid and tail swinging out to the left.
Background: flat solid pure green #00FF00 everywhere, no gradient, no floor, no shadow under him.
No effects at all: no slash trails, motion lines, speed lines, glow, runes in the air, ice, lightning, sparkles, dust, cracks, impact bursts, symbols, text, numbers or frame borders — only the wolf and his axe; show the movement with the pose alone. The ice-blue pattern on the blade stays a flat painted pattern, never glowing. No green anywhere on him.
```

### ⑪ Axe Dance — ท่าปิด (4 เฟรม)

```
2.5D game sprite sheet — the white wolf warrior's axe dance finisher, 4 frames: coil, spinning leap, huge landing cleave, victory pose.
Use the three attached pictures: the large picture shows exactly how he looks and how he is rendered, the row of five pictures shows him from every side, and the third picture shows his greataxe on its own (the same axe standing up, lying flat and tilted) — copy his look and his axe exactly.
Style: the same 2.5D look as the attached pictures — a stylized 3D game model with solid volume and depth, rendered with a toon shader that imitates hand-drawn art: clean dark-brown hand-drawn-looking outlines, soft cel shading in 2–3 tones that follows the 3D forms, one warm key light from the upper left, a thin bright rim light along the edges, matte painted textures (fluffy fur, cloth, worn leather, brushed steel). Not photorealistic, not glossy plastic, not a flat 2D drawing. Keep his body proportions exactly as in the pictures.
Camera: the same as in the attached pictures — looking down at him from about 30 degrees above, with no perspective distortion.
Character: a white wolf warrior with a full wolf head — a strong muzzle, a black nose, bright ice-blue eyes, a small red X-shaped scar above his RIGHT eye, tall pointed ears; snow-white fur with soft lavender-grey shading, a thick spiky mane of fur round his head, cheeks and neck, and a thin white braid with small silver rings beside his RIGHT cheek. A cream-white fur collar on a crimson fur-lined cape over both shoulders and down to the middle of his back, a round silver knotwork brooch on his LEFT chest, a dark-steel pauldron shaped like a snarling wolf head on his LEFT shoulder. A sleeveless deep-navy tunic with a silver knotwork band down the front, split into front panels over a crimson underlayer; a brown leather belt with a big round silver knotwork buckle. Bare white-furred arms with dark brown leather bracers; a heavy steel chain wrapped round his LEFT forearm with four broken links hanging. Baggy charcoal-black trousers, dark brown boots with crisscross straps and thick white fur cuffs. A huge bushy white tail.
Axe: copy his Viking greataxe exactly from the third attached picture. It is one rigid object that never changes from frame to frame: always the same length — almost as long as he is tall — always straight, never shorter, never bent, never a small one-handed axe. Its parts, from the top end down: a round silver ball cap; a short dark-steel section carved with knotwork; ONE broad silver crescent blade fixed to the side of that steel section and sticking out sideways at a right angle to the haft — the haft does not end in the blade, it carries on past the blade up to the silver ball; a snarling dark-iron wolf head on the blade's flat face next to the haft, and an ice-blue knotwork pattern along the blade; below the blade the long crimson haft wrapped with dark crisscross straps and silver bands; and at the bottom end a pointed silver spike. The ball is always at the blade end and the pointed spike always at the far end.
How he holds it, unless a frame says otherwise: with both hands he grips the lower half of the haft, one hand just above the pointed spike and the other a little higher, so the long haft and the blade reach far out beyond his hands; with one hand while standing, the axe stands upright beside him on its pointed spike, his hand round the haft at chest height and the blade beside his head, as in the standing pictures.
View: frames 1, 3 and 4 show him from the same front three-quarter view as the large attached picture — body and face turned toward the lower right of the picture. Frame 2 is a moment in the middle of a spin, so there we see his back.
Layout: landscape 1536×1024, 4 frames in a 2×2 grid read like a book (top-left, top-right, bottom-left, bottom-right). Each frame sits in its own quarter of the picture, the wolf the same size in every frame, his whole body (ears, tail, boots) and the WHOLE axe inside his own quarter with clear empty space around it — frames never touch or overlap. Draw him small: standing up straight he would be only about 45% of a frame's height, so the long axe fits in every pose — never shorten the axe to make it fit.
This is the big finish of an axe dance: in every frame his whole body twists, leans and stretches like a dancer — weight clearly on one foot, hips and shoulders turned, cape, braid, mane and tail swinging with the movement — and the axe is in a clearly different place in every frame. Never a stiff stance with the haft held level in front of him like a stick.
Frames:
1. Coil: crouched very low with one knee almost touching the ground, his upper body twisted far round to the left so his back is half toward us, both hands on the lower part of the haft, the long axe dragged far behind him on the LEFT side of the picture with the blade touching the ground; he looks back over his shoulder toward the lower right with fierce eyes, fangs bared.
2. Spinning leap: he springs up into a short spinning jump, both feet off the ground and the knees tucked, his back toward us (we see his crimson cape, the back of his head and his big tail), the long axe swung round him at full arm's length and held out level far to the RIGHT side of the picture; cape, braid and tail whirling out around him.
3. Landing cleave: he lands in a long, deep lunge toward the lower right, the front knee bent and the back leg stretched far behind, both arms stretched forward, the long axe swung all the way round in a huge flat sweep so it reaches far out in front of him toward the lower RIGHT of the picture with the blade just above the ground, its edge leading; mouth wide open in a roaring battle cry; cape, braid and tail thrown forward.
4. Victory pose: standing tall and proud with his feet apart, the long axe swung up to rest on his right shoulder — the haft lying over the shoulder, his right hand gripping it in front of his chest near the pointed spike, the blade behind his head on the LEFT side of the picture; his left fist clenched at his side, a fierce, confident grin.
Frame 2 is in the air (feet off the ground); draw him the same size as in the other frames.
Background: flat solid pure green #00FF00 everywhere, no gradient, no floor, no shadow under him.
No effects at all: no slash trails, motion lines, speed lines, glow, runes in the air, ice, lightning, sparkles, dust, cracks, impact bursts, symbols, text, numbers or frame borders — only the wolf and his axe; show the movement with the pose alone. The ice-blue pattern on the blade stays a flat painted pattern, never glowing. No green anywhere on him.
```

แก้รูปเพิ่มจากรายการด้านบน:
- ท่าแข็ง ถือขวานขวางเหมือนไม้ → `Redo: make every frame a big, dynamic swing pose — twist the whole body into the swing, lean, step and lift a foot, cape and tail flying; never a stiff stance holding the haft level like a stick.`
- ขวานอยู่ที่เดิมสองเฟรม → `Redo: the axe must be in a clearly different place in each frame, exactly where each frame's text says.`

### แผนตอนได้รูป (สำหรับแชตที่ต่อจากนี้)

1. ตัดเป็น state `dance` (⑩) และ `dfin` (⑪) ในแอตลาส `assets_wolf25_pose.js` ด้วย `tools/sheet_state.py` (สเปก `tools/clips/wolf25_dance.json` / `wolf25_dfin.json` แบบท่าอื่น: scale ~.76, store 1.5478, จุดหัว head ทุกเฟรม) · ⑪ เฟรม 2 (กระโดด) ตั้ง anchor ให้เท้าลอยเหนือพื้น ~25 px เพราะสกิลนี้ไม่ยกตัวด้วย player.z
2. `wolf_pose.js` สลับ `axeDance`: ทุกจังหวะยังเป็น 4 ช่องเดิม เวลาเดิม (เงื้อ เงื้อ โดน ตามแรง — `slashAt` อ่าน a.seq ตามลำดับ) · ท่าจบของจังหวะก่อน = ท่าเงื้อของจังหวะถัดไป:
   - จังหวะ 1 ทแยงลง ⑩1 → ⑩2 · 2 เสยขึ้น ⑩2 → ⑩1 · 3 หมุนกวาด (ท่าหมุนเดิม `spin` ด้านหลัง + ด้านข้าง) → ⑩3 · 4 กวาดกลับ ⑩3 → ⑩4 · 5 ทแยงลง ⑩4 → ⑩2 · 6 เสยขึ้น ⑩2 → ⑩1
   - ท่าปิด (12 ช่องเดิม): ⑪1 ย่อ → ⑪2 กระโดด (ช่องก่อน contact) → ⑪3 ฟัน (ช่อง contact ขึ้นไป) → ⑪4 พาดบ่า (ช่วงท้าย) · Lv1 = จังหวะ 1–2 + ปิด · Lv2 = 1–4 + ปิด · Lv3 = 1–6 + ปิด
3. `wolf_vfx5.js` ตาราง `DANCE`: เล็งเส้นแต่ละจังหวะใหม่ให้ตรงท่า (ทแยงกากบาท · หมุนแบน · กวาดกลับระดับไหล่) และกลับด้านเมื่อท่ากลับด้าน (หันซ้าย) · ท่าปิด = วงกวาดแบนใหญ่จากหลังซ้ายมาหน้าขวา + คลื่นพื้น แทนวงเอียง + เส้นพุ่ง
4. ⑩3 / ⑩4 ใช้ต่อกับ Blood Cleave / Reversal Slash ได้ แต่เส้นฟันของสกิลพวกนั้นอ่านตำแหน่งหัวขวานจากเฟรม → ต้องใส่ sockets หัวขวาน / ด้ามทุกเฟรมก่อน (อ่านด้วยตาหรือแบบ cliphero `axe`)
5. ตรวจ: make() × 8 ทิศ เวลาเท่ากับ `?wpose=0` · `tools/fxlab.py hits` (FXSEED + sure hits) · strips + คลิปเทียบใหม่ / เดิม (`tools/fx/wfclip.py pose`)

## Axe Dance สร้างแล้ว (2026-11-26 · แผ่น ⑩ ⑪ ของเจ้าของ 23:49)

แผ่นดิบ `assets/heroes/wolf/poses25/dance.webp` (⑩) · `dfin.webp` (⑪) → state `dance` 4 เฟรม + `dfin` 4 เฟรม ใน `assets_wolf25_pose.js` (?v=2)

- ⑩ เฟรม 4 ออกมาเป็น "พาดขวานบนบ่า" ไม่ใช่กวาดกลับระดับไหล่ → ใช้เป็นจังหวะ **เหวี่ยงขวานกลับขึ้นบ่า** (อยากได้ท่ากวาดกลับจริง = ขอกล่องแก้เฉพาะเฟรมนั้น)
- ตัด: `python3 -I tools/sheet_state.py tools/clips/wolf25_dance.json` · `wolf25_dfin.json` — scale .78 (ความสูงเทียบภาพยืน idle) · store 1.5478 · clean · ตัวเลือกใหม่ `sheet_coords` (anchor / sockets / head ในสเปกเป็นพิกัดบนแผ่น) · anchor = หัวเข็มขัด −35 px / ระดับพื้นรองเท้า · ⑪2 กระโดด anchor ต่ำกว่าเท้า 103 px บนแผ่น (ลอยจากพื้นในภาพเอง) · ตัวเลือกใหม่ `sockets` = จุดหัวขวานทุกเฟรม (อ่านด้วยตา) → ได้ socket head + grip ในแอตลาส · index.html รวม sockets ของไฟล์ท่าเสริมเข้าแอตลาส WLF → เส้นฟันอ่านตำแหน่งใบขวานจริงของท่า · `head` = จุดหัวทุกเฟรม (ปีกแฟชั่นตามท่า) · สเปกเก่าสร้างซ้ำได้ไฟล์เดิมทุกไบต์
- `wolf_pose.js` `swap('axeDance')` — ทุกจังหวะยังเป็น 4 ช่องเดิม เวลาเดิม (ช่องเงื้อ 2 ช่อง = ท่าจบของจังหวะก่อน · ช่องโดน 2 ช่อง = ท่าจบของจังหวะนี้):

| จังหวะ | Lv1 | Lv2 | Lv3 | ท่า |
|---|---|---|---|---|
| 1 สับลง | ✓ | ✓ | ✓ | ⑩1 ขวานสูง → ⑩2 ใบขวานต่ำหน้าเท้า |
| 2 ฟันขึ้น | ✓ | ✓ | ✓ | ⑩2 → ⑩1 |
| 3 หมุนกวาด | | ✓ | ✓ | ภาพหมุน (หลัง → ข้าง) → ⑩3 กวาดระดับเอว |
| 4 เหวี่ยงขึ้นบ่า | | ✓ | ✓ | ⑩3 → ⑩4 |
| 5 สับลง | | | ✓ | ⑩4 → ⑩2 |
| 6 ฟันขึ้น | | | ✓ | ⑩2 → ⑩1 |
| ปิด | ✓ | ✓ | ✓ | ⑪1 ย่อ (¼ แรกของช่วงเงื้อ) → ⑪2 กระโดดหมุน (ที่เหลือ: ลอยขึ้นลงสูง 24 px ด้วย player.z ลงพื้นพอดีจังหวะโดน · ถ้าโดนขัดกลางอากาศ startAction / endAction วางตัวลงพื้นให้) → ⑪3 ฟันกวาดตั้งแต่ช่องโดน → ⑪4 พาดบ่า 2 ช่องสุดท้าย |

- ปิดเส้นตามอาวุธ (ระหว่างสองท่าที่ห่างกันมันลากเส้นตรงพาดตัว) · พุ่งเข้า 12 px ตอนเริ่มเหมือนเดิม (`a._melee0` = คำตอบ "เป็นท่าฟันระยะประชิดไหม" ของเฟรมเดิม ก่อนสลับภาพ; feel_hits.js อ่านค่านี้)
- ใช้ตอนหัน S SE E SW W · หันขึ้น (N NE NW) = เฟรมเดิม + เส้น DANCE เดิม
- `wolf_vfx5.js` `dancePosed()`: สับลง / ฟันขึ้น / เหวี่ยงขึ้นบ่า = เส้นโค้งจากใบขวานท่าเงื้อไปใบขวานท่าโดน โค้งขึ้นเหนือหัว (วงกลมผ่านสองจุด จุดศูนย์กลางต่ำกว่าเส้นเชื่อม .18 ของระยะ = เกินครึ่งวงนิดเดียว) แทนวงรอบไหล่ของเกม (ท่าสับลงต่ำเคยได้วงสูง 1.4 เท่าตัว) · หมุนกวาด = วงแบนรอบเอวจบที่ใบขวาน · ปิด = วงกวาดแบนใหญ่เหนือพื้น + คลื่นเสี้ยวพุ่งไปข้างหน้า + วงแหวน + ฝุ่น · หันซ้ายกลับด้านให้เอง (วงหมุน / วงปิดวางในระนาบของภาพ SE / SW ไม่ใช่ทิศจริง) · ตัวเลขทั้งหมดอยู่ในตาราง `DP`
- ตรวจแล้ว: make() 3 เลเวล × 8 ทิศ ความยาว / windup / dur / recover / event ทุกตัวเท่ากับ `?wpose=0` · `tools/fxlab.py hits` (FXSEED 7 + โดนแน่) เวลาโดน 7 จังหวะเท่าเดิม · herosweep (ข้อผิดพลาดเดิม 7 ตัวของท่าต่อ) / lostev 0 / combo 0 / leak คงที่ · ปีกแฟชั่นตามทุกท่า (ช่วงหมุนไม่มีปีกเหมือน Axe Cyclone)
- คลิป: `DSF=1.5 python3 tools/fx/wfclip.py dance` (ความเร็วจริง · ช้าครึ่งหนึ่ง · หันซ้าย) · เติม `'&wpose=0'` = ท่าเดิม · wfclip รับระยะติดลบ (= ยืนขวาของหุ่น หันซ้าย) และช่องที่ 9 = เฟรมเกมต่อเฟรมคลิป (1 = ช้าครึ่ง)
- ยังไม่ได้: ใช้ ⑩3 / ⑩4 กับ Blood Cleave / Reversal Slash (มีจุดหัวขวานแล้ว) · ท่าตอนหันหลัง (N NE NW)
