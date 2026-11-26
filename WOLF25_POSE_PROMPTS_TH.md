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

## แนบอะไร

ใช้แชต ChatGPT เดียว (แชตที่วาดภาพยืน 2.5D ก็ได้) แนบ 2 รูปนี้ในข้อความแรก แล้ววางกล่องทีละกล่อง (ได้รูปแล้วค่อยวางกล่องต่อไป):

1. `tools/ref/wolf25_ref_SE.jpg` = รูป 2.5D หน้าเฉียงขวาตัวใหญ่ (ครอปจาก `assets/heroes/wolf/view25_SE_test.webp`) ใช้เป็นหน้าตา มุม และการเรนเดอร์
2. `tools/ref/wolf25_ref_views.jpg` = ภาพยืน 2.5D ครบ 5 มุม (`view25_S/SE/E/NE/N.webp`) เรียงกัน ให้เห็นด้านข้างกับด้านหลัง

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
Use the two attached pictures: the large picture shows exactly how he looks and how he is rendered, and the row of five pictures shows him from every side — copy his look exactly.
Style: the same 2.5D look as the attached pictures — a stylized 3D game model with solid volume and depth, rendered with a toon shader that imitates hand-drawn art: clean dark-brown hand-drawn-looking outlines, soft cel shading in 2–3 tones that follows the 3D forms, one warm key light from the upper left, a thin bright rim light along the edges, matte painted textures (fluffy fur, cloth, worn leather, brushed steel). Not photorealistic, not glossy plastic, not a flat 2D drawing. Keep his body proportions exactly as in the pictures.
Camera: the same as in the attached pictures — looking down at him from about 30 degrees above, with no perspective distortion.
Character: a white wolf warrior with a full wolf head — a strong muzzle, a black nose, bright ice-blue eyes, a small red X-shaped scar above his RIGHT eye, tall pointed ears; snow-white fur with soft lavender-grey shading, a thick spiky mane of fur round his head, cheeks and neck, and a thin white braid with small silver rings beside his RIGHT cheek. A cream-white fur collar on a crimson fur-lined cape over both shoulders and down to the middle of his back, a round silver knotwork brooch on his LEFT chest, a dark-steel pauldron shaped like a snarling wolf head on his LEFT shoulder. A sleeveless deep-navy tunic with a silver knotwork band down the front, split into front panels over a crimson underlayer; a brown leather belt with a big round silver knotwork buckle. Bare white-furred arms with dark brown leather bracers; a heavy steel chain wrapped round his LEFT forearm with four broken links hanging. Baggy charcoal-black trousers, dark brown boots with crisscross straps and thick white fur cuffs. A huge bushy white tail. His Viking greataxe, almost as tall as he is, in his RIGHT hand (in both hands where a frame says so): a crimson haft wrapped with dark crisscross straps and silver bands, a pointed silver end at the bottom, a dark-steel upper haft with a round silver knob on top, and a broad silver crescent blade with an ice-blue knotwork pattern, set in a snarling dark-iron wolf head.
View: every frame shows him from the same front three-quarter view as the large attached picture — body and face turned toward the lower right of the picture.
Layout: landscape 1536×1024, 6 frames in 2 rows of 3, read left to right, top row first. Each frame sits in its own sixth of the picture, the wolf the same size in every frame, his whole body (ears, tail, boots) and the WHOLE axe inside his own area with clear empty space around it — frames never touch or overlap.
Frames:
1. Crouch to spring: knees bent deep, body low and leaning forward, both hands gripping the haft with the axe held low behind him, eyes on the target ahead.
2. Take-off: legs pushing off the ground, body rising and leaning forward, the axe swinging back and up behind him.
3. Rising: in the air with his knees tucked up, the axe lifted above his head in both hands.
4. Top of the leap: body arched back, the axe raised high behind his head in both hands, ready to smash, his cape, braid, mane and tail streaming upward.
5. Smash landing: one knee down and one foot planted, the axe swung down in front of him with the blade driven into the ground, head low, cape thrown forward.
6. Rising from the smash: still crouched, pulling the axe up out of the ground.
Frames 2 to 4 are in the air (feet off the ground); draw them the same size as the other frames.
Background: flat solid pure green #00FF00 everywhere, no gradient, no floor, no shadow under him.
No effects at all: no slash trails, motion lines, speed lines, glow, runes in the air, ice, lightning, sparkles, dust, cracks, impact bursts, symbols, text, numbers or frame borders — only the wolf and his axe; show the movement with the pose alone. The ice-blue pattern on the blade stays a flat painted pattern, never glowing. No green anywhere on him.
```

### ② ท่าหอน (4 เฟรม)
ใช้กับ War Howl · Fenrir's Spirit · War Banner (เฟรม 1–3) · War Fury (เฟรม 1 → 4)

```
2.5D game sprite sheet — the white wolf warrior's war howl, 4 frames.
Use the two attached pictures: the large picture shows exactly how he looks and how he is rendered, and the row of five pictures shows him from every side — copy his look exactly.
Style: the same 2.5D look as the attached pictures — a stylized 3D game model with solid volume and depth, rendered with a toon shader that imitates hand-drawn art: clean dark-brown hand-drawn-looking outlines, soft cel shading in 2–3 tones that follows the 3D forms, one warm key light from the upper left, a thin bright rim light along the edges, matte painted textures (fluffy fur, cloth, worn leather, brushed steel). Not photorealistic, not glossy plastic, not a flat 2D drawing. Keep his body proportions exactly as in the pictures.
Camera: the same as in the attached pictures — looking down at him from about 30 degrees above, with no perspective distortion.
Character: a white wolf warrior with a full wolf head — a strong muzzle, a black nose, bright ice-blue eyes, a small red X-shaped scar above his RIGHT eye, tall pointed ears; snow-white fur with soft lavender-grey shading, a thick spiky mane of fur round his head, cheeks and neck, and a thin white braid with small silver rings beside his RIGHT cheek. A cream-white fur collar on a crimson fur-lined cape over both shoulders and down to the middle of his back, a round silver knotwork brooch on his LEFT chest, a dark-steel pauldron shaped like a snarling wolf head on his LEFT shoulder. A sleeveless deep-navy tunic with a silver knotwork band down the front, split into front panels over a crimson underlayer; a brown leather belt with a big round silver knotwork buckle. Bare white-furred arms with dark brown leather bracers; a heavy steel chain wrapped round his LEFT forearm with four broken links hanging. Baggy charcoal-black trousers, dark brown boots with crisscross straps and thick white fur cuffs. A huge bushy white tail. His Viking greataxe, almost as tall as he is, in his RIGHT hand (in both hands where a frame says so): a crimson haft wrapped with dark crisscross straps and silver bands, a pointed silver end at the bottom, a dark-steel upper haft with a round silver knob on top, and a broad silver crescent blade with an ice-blue knotwork pattern, set in a snarling dark-iron wolf head.
View: every frame shows him from the same front three-quarter view as the large attached picture — body and face turned toward the lower right of the picture.
Layout: landscape 1536×1024, 4 frames in a 2×2 grid read like a book (top-left, top-right, bottom-left, bottom-right). Each frame sits in its own quarter of the picture, the wolf the same size in every frame, his whole body (ears, tail, boots) and the WHOLE axe inside his own quarter with clear empty space around it — frames never touch or overlap.
Frames:
1. Drawing breath: chest swelling, shoulders back, head lowered a little, the axe held low in his right hand with the blade near the ground, his left fist clenched.
2. Howl: head thrown back with the muzzle pointing up at the sky, mouth open in a long wolf howl, eyes closed, ears laid back, chest pushed out, mane and tail bristling, the axe still held low at his side.
3. The same howl a moment later, almost identical — mane, braid, cape and tail swayed the other way — so frames 2 and 3 can loop.
4. Battle fury: hunched forward, fangs bared in a fierce snarl, fierce narrowed eyes, fur bristling, both fists clenched, the axe gripped tight in his right hand at his side.
Background: flat solid pure green #00FF00 everywhere, no gradient, no floor, no shadow under him.
No effects at all: no slash trails, motion lines, speed lines, glow, runes in the air, ice, lightning, sparkles, dust, cracks, impact bursts, symbols, text, numbers or frame borders — only the wolf and his axe; show the movement with the pose alone. The ice-blue pattern on the blade stays a flat painted pattern, never glowing. No green anywhere on him.
```

### ③ ท่าเงื้อขวานชาร์จ (4 เฟรม)
ใช้กับ Executioner · Wolf Finale · ช่วงชาร์จของ Valhalla's Wrath (ท่าค้างก่อนฟันแบบท่าชาร์จของแมว)

```
2.5D game sprite sheet — the white wolf warrior gathering power for a huge overhead axe blow, 4 frames: a charge-up stance he holds before striking.
Use the two attached pictures: the large picture shows exactly how he looks and how he is rendered, and the row of five pictures shows him from every side — copy his look exactly.
Style: the same 2.5D look as the attached pictures — a stylized 3D game model with solid volume and depth, rendered with a toon shader that imitates hand-drawn art: clean dark-brown hand-drawn-looking outlines, soft cel shading in 2–3 tones that follows the 3D forms, one warm key light from the upper left, a thin bright rim light along the edges, matte painted textures (fluffy fur, cloth, worn leather, brushed steel). Not photorealistic, not glossy plastic, not a flat 2D drawing. Keep his body proportions exactly as in the pictures.
Camera: the same as in the attached pictures — looking down at him from about 30 degrees above, with no perspective distortion.
Character: a white wolf warrior with a full wolf head — a strong muzzle, a black nose, bright ice-blue eyes, a small red X-shaped scar above his RIGHT eye, tall pointed ears; snow-white fur with soft lavender-grey shading, a thick spiky mane of fur round his head, cheeks and neck, and a thin white braid with small silver rings beside his RIGHT cheek. A cream-white fur collar on a crimson fur-lined cape over both shoulders and down to the middle of his back, a round silver knotwork brooch on his LEFT chest, a dark-steel pauldron shaped like a snarling wolf head on his LEFT shoulder. A sleeveless deep-navy tunic with a silver knotwork band down the front, split into front panels over a crimson underlayer; a brown leather belt with a big round silver knotwork buckle. Bare white-furred arms with dark brown leather bracers; a heavy steel chain wrapped round his LEFT forearm with four broken links hanging. Baggy charcoal-black trousers, dark brown boots with crisscross straps and thick white fur cuffs. A huge bushy white tail. His Viking greataxe, almost as tall as he is, in his RIGHT hand (in both hands where a frame says so): a crimson haft wrapped with dark crisscross straps and silver bands, a pointed silver end at the bottom, a dark-steel upper haft with a round silver knob on top, and a broad silver crescent blade with an ice-blue knotwork pattern, set in a snarling dark-iron wolf head.
View: every frame shows him from the same front three-quarter view as the large attached picture — body and face turned toward the lower right of the picture.
Layout: landscape 1536×1024, 4 frames in a 2×2 grid read like a book (top-left, top-right, bottom-left, bottom-right). Each frame sits in its own quarter of the picture, the wolf the same size in every frame, his whole body (ears, tail, boots) and the WHOLE axe inside his own quarter with clear empty space around it — frames never touch or overlap.
Frames:
1. Bracing: feet wide apart, knees bending, both hands gripping the haft, the axe held diagonally in front of him with the blade beside his right shoulder.
2. Heaving: the axe swung up and back over his right shoulder in both hands, body starting to twist.
3. Full charge: the axe raised high behind his head in both hands with the blade hanging down behind his back, body coiled and leaning back, knees deeply bent, weight on the back foot, fangs bared, eyes locked on the target to the lower right, fur bristling.
4. The same full charge a moment later, almost identical — shoulders a little lower, cape, mane and tail swayed the other way — so frames 3 and 4 can loop.
He holds the axe up the whole time; he does not swing it down.
Background: flat solid pure green #00FF00 everywhere, no gradient, no floor, no shadow under him.
No effects at all: no slash trails, motion lines, speed lines, glow, runes in the air, ice, lightning, sparkles, dust, cracks, impact bursts, symbols, text, numbers or frame borders — only the wolf and his axe; show the movement with the pose alone. The ice-blue pattern on the blade stays a flat painted pattern, never glowing. No green anywhere on him.
```

### ④ ท่าพุ่ง (4 เฟรม)
ใช้กับ Battle Step · Storm Step (+ ช่วงไถลของ Vampiric Axe · Blood Rush · Lightning Pursuit · Ice Break ถ้าต่อเข้าได้)

```
2.5D game sprite sheet — the white wolf warrior's low sprinting dash, 4 frames.
Use the two attached pictures: the large picture shows exactly how he looks and how he is rendered, and the row of five pictures shows him from every side — copy his look exactly.
Style: the same 2.5D look as the attached pictures — a stylized 3D game model with solid volume and depth, rendered with a toon shader that imitates hand-drawn art: clean dark-brown hand-drawn-looking outlines, soft cel shading in 2–3 tones that follows the 3D forms, one warm key light from the upper left, a thin bright rim light along the edges, matte painted textures (fluffy fur, cloth, worn leather, brushed steel). Not photorealistic, not glossy plastic, not a flat 2D drawing. Keep his body proportions exactly as in the pictures.
Camera: the same as in the attached pictures — looking down at him from about 30 degrees above, with no perspective distortion.
Character: a white wolf warrior with a full wolf head — a strong muzzle, a black nose, bright ice-blue eyes, a small red X-shaped scar above his RIGHT eye, tall pointed ears; snow-white fur with soft lavender-grey shading, a thick spiky mane of fur round his head, cheeks and neck, and a thin white braid with small silver rings beside his RIGHT cheek. A cream-white fur collar on a crimson fur-lined cape over both shoulders and down to the middle of his back, a round silver knotwork brooch on his LEFT chest, a dark-steel pauldron shaped like a snarling wolf head on his LEFT shoulder. A sleeveless deep-navy tunic with a silver knotwork band down the front, split into front panels over a crimson underlayer; a brown leather belt with a big round silver knotwork buckle. Bare white-furred arms with dark brown leather bracers; a heavy steel chain wrapped round his LEFT forearm with four broken links hanging. Baggy charcoal-black trousers, dark brown boots with crisscross straps and thick white fur cuffs. A huge bushy white tail. His Viking greataxe, almost as tall as he is, in his RIGHT hand (in both hands where a frame says so): a crimson haft wrapped with dark crisscross straps and silver bands, a pointed silver end at the bottom, a dark-steel upper haft with a round silver knob on top, and a broad silver crescent blade with an ice-blue knotwork pattern, set in a snarling dark-iron wolf head.
View: every frame shows him from the same front three-quarter view as the large attached picture — body and face turned toward the lower right of the picture.
Layout: landscape 1536×1024, 4 frames in a 2×2 grid read like a book (top-left, top-right, bottom-left, bottom-right). Each frame sits in its own quarter of the picture, the wolf the same size in every frame, his whole body (ears, tail, boots) and the WHOLE axe inside his own quarter with clear empty space around it — frames never touch or overlap.
Frames:
1. Push-off: body low and leaning far forward toward the lower right, back leg pushing, front knee bent, the axe held low in his right hand, trailing behind him.
2. Full dash: body very low and stretched forward, one leg reaching forward and the other stretched back, the axe trailing behind him close to the ground, cape, braid and tail streaming straight back.
3. The same full dash with the legs swapped.
4. Sliding stop: skidding to a halt in a low, wide crouch, the axe swung forward in both hands, ready to strike, cape swinging forward.
Background: flat solid pure green #00FF00 everywhere, no gradient, no floor, no shadow under him.
No effects at all: no slash trails, motion lines, speed lines, glow, runes in the air, ice, lightning, sparkles, dust, cracks, impact bursts, symbols, text, numbers or frame borders — only the wolf and his axe; show the movement with the pose alone. The ice-blue pattern on the blade stays a flat painted pattern, never glowing. No green anywhere on him.
```

### ⑤ ท่าตั้งการ์ด (4 เฟรม)
ใช้กับ Iron Counter · Rune Guard (เฟรม 1–3) · Rune Burst (เฟรม 4)

```
2.5D game sprite sheet — the white wolf warrior's axe guard and parry, 4 frames.
Use the two attached pictures: the large picture shows exactly how he looks and how he is rendered, and the row of five pictures shows him from every side — copy his look exactly.
Style: the same 2.5D look as the attached pictures — a stylized 3D game model with solid volume and depth, rendered with a toon shader that imitates hand-drawn art: clean dark-brown hand-drawn-looking outlines, soft cel shading in 2–3 tones that follows the 3D forms, one warm key light from the upper left, a thin bright rim light along the edges, matte painted textures (fluffy fur, cloth, worn leather, brushed steel). Not photorealistic, not glossy plastic, not a flat 2D drawing. Keep his body proportions exactly as in the pictures.
Camera: the same as in the attached pictures — looking down at him from about 30 degrees above, with no perspective distortion.
Character: a white wolf warrior with a full wolf head — a strong muzzle, a black nose, bright ice-blue eyes, a small red X-shaped scar above his RIGHT eye, tall pointed ears; snow-white fur with soft lavender-grey shading, a thick spiky mane of fur round his head, cheeks and neck, and a thin white braid with small silver rings beside his RIGHT cheek. A cream-white fur collar on a crimson fur-lined cape over both shoulders and down to the middle of his back, a round silver knotwork brooch on his LEFT chest, a dark-steel pauldron shaped like a snarling wolf head on his LEFT shoulder. A sleeveless deep-navy tunic with a silver knotwork band down the front, split into front panels over a crimson underlayer; a brown leather belt with a big round silver knotwork buckle. Bare white-furred arms with dark brown leather bracers; a heavy steel chain wrapped round his LEFT forearm with four broken links hanging. Baggy charcoal-black trousers, dark brown boots with crisscross straps and thick white fur cuffs. A huge bushy white tail. His Viking greataxe, almost as tall as he is, in his RIGHT hand (in both hands where a frame says so): a crimson haft wrapped with dark crisscross straps and silver bands, a pointed silver end at the bottom, a dark-steel upper haft with a round silver knob on top, and a broad silver crescent blade with an ice-blue knotwork pattern, set in a snarling dark-iron wolf head.
View: every frame shows him from the same front three-quarter view as the large attached picture — body and face turned toward the lower right of the picture.
Layout: landscape 1536×1024, 4 frames in a 2×2 grid read like a book (top-left, top-right, bottom-left, bottom-right). Each frame sits in its own quarter of the picture, the wolf the same size in every frame, his whole body (ears, tail, boots) and the WHOLE axe inside his own quarter with clear empty space around it — frames never touch or overlap.
Frames:
1. Raising his guard: feet apart, knees bent, both hands bringing the haft up in front of him.
2. Guard: the haft held across in front of his chest with both hands — his right hand near the blade, his left hand lower down the haft — the blade up beside his head on the left side of the picture, elbows out, knees bent, sharp eyes looking over the haft.
3. The same guard a moment later, almost identical — shoulders a little lower, cape and tail swayed the other way — so frames 2 and 3 can loop.
4. Shove: both arms thrust forward, pushing the haft out toward the lower right to knock an attack away, body leaning forward, cape flaring.
Background: flat solid pure green #00FF00 everywhere, no gradient, no floor, no shadow under him.
No effects at all: no slash trails, motion lines, speed lines, glow, runes in the air, ice, lightning, sparkles, dust, cracks, impact bursts, symbols, text, numbers or frame borders — only the wolf and his axe; show the movement with the pose alone. The ice-blue pattern on the blade stays a flat painted pattern, never glowing. No green anywhere on him.
```

### ⑥ ท่าร่ายรูน (4 เฟรม)
ใช้กับ Ice Prison · Thunder Spear (เฟรม 1–2) · Blizzard · Tempest Field · Frozen Descent · Ragnarok's Judgment (เฟรม 1 → 3–4) — ให้สาย B มีท่าของตัวเอง

```
2.5D game sprite sheet — the white wolf warrior casting a rune spell, 4 frames.
Use the two attached pictures: the large picture shows exactly how he looks and how he is rendered, and the row of five pictures shows him from every side — copy his look exactly.
Style: the same 2.5D look as the attached pictures — a stylized 3D game model with solid volume and depth, rendered with a toon shader that imitates hand-drawn art: clean dark-brown hand-drawn-looking outlines, soft cel shading in 2–3 tones that follows the 3D forms, one warm key light from the upper left, a thin bright rim light along the edges, matte painted textures (fluffy fur, cloth, worn leather, brushed steel). Not photorealistic, not glossy plastic, not a flat 2D drawing. Keep his body proportions exactly as in the pictures.
Camera: the same as in the attached pictures — looking down at him from about 30 degrees above, with no perspective distortion.
Character: a white wolf warrior with a full wolf head — a strong muzzle, a black nose, bright ice-blue eyes, a small red X-shaped scar above his RIGHT eye, tall pointed ears; snow-white fur with soft lavender-grey shading, a thick spiky mane of fur round his head, cheeks and neck, and a thin white braid with small silver rings beside his RIGHT cheek. A cream-white fur collar on a crimson fur-lined cape over both shoulders and down to the middle of his back, a round silver knotwork brooch on his LEFT chest, a dark-steel pauldron shaped like a snarling wolf head on his LEFT shoulder. A sleeveless deep-navy tunic with a silver knotwork band down the front, split into front panels over a crimson underlayer; a brown leather belt with a big round silver knotwork buckle. Bare white-furred arms with dark brown leather bracers; a heavy steel chain wrapped round his LEFT forearm with four broken links hanging. Baggy charcoal-black trousers, dark brown boots with crisscross straps and thick white fur cuffs. A huge bushy white tail. His Viking greataxe, almost as tall as he is, in his RIGHT hand (in both hands where a frame says so): a crimson haft wrapped with dark crisscross straps and silver bands, a pointed silver end at the bottom, a dark-steel upper haft with a round silver knob on top, and a broad silver crescent blade with an ice-blue knotwork pattern, set in a snarling dark-iron wolf head.
View: every frame shows him from the same front three-quarter view as the large attached picture — body and face turned toward the lower right of the picture.
Layout: landscape 1536×1024, 4 frames in a 2×2 grid read like a book (top-left, top-right, bottom-left, bottom-right). Each frame sits in its own quarter of the picture, the wolf the same size in every frame, his whole body (ears, tail, boots) and the WHOLE axe inside his own quarter with clear empty space around it — frames never touch or overlap.
Frames:
1. Gathering: the greataxe upright in his right hand with its pointed end on the ground, his left hand raised in front of his chest with the palm open, eyes half closed, calm.
2. Casting forward: his left arm stretched out toward the lower right, the open palm aimed at a spot on the ground ahead, fingers spread, the axe still upright in his right hand.
3. Calling the storm: both arms raised high — the greataxe lifted straight up to the sky in his right hand and his left palm open to the sky — head tilted back, cape, mane and braid lifting as if in a rising wind.
4. The same pose a moment later, almost identical — cape, braid and tail drifting the other way — so frames 3 and 4 can loop.
Background: flat solid pure green #00FF00 everywhere, no gradient, no floor, no shadow under him.
No effects at all: no slash trails, motion lines, speed lines, glow, runes in the air, ice, lightning, sparkles, dust, cracks, impact bursts, symbols, text, numbers or frame borders — only the wolf and his axe; show the movement with the pose alone. The ice-blue pattern on the blade stays a flat painted pattern, never glowing. No green anywhere on him.
```

### ⑦ ท่าหมุนขวาน (4 เฟรม = หมุน 1 รอบ)
ใช้กับ Axe Cyclone

```
2.5D game sprite sheet — the white wolf warrior's spinning axe whirlwind, 4 frames = one full turn in place.
Use the two attached pictures: the large picture shows exactly how he looks and how he is rendered, and the row of five pictures shows him from every side — copy his look exactly.
Style: the same 2.5D look as the attached pictures — a stylized 3D game model with solid volume and depth, rendered with a toon shader that imitates hand-drawn art: clean dark-brown hand-drawn-looking outlines, soft cel shading in 2–3 tones that follows the 3D forms, one warm key light from the upper left, a thin bright rim light along the edges, matte painted textures (fluffy fur, cloth, worn leather, brushed steel). Not photorealistic, not glossy plastic, not a flat 2D drawing. Keep his body proportions exactly as in the pictures.
Camera: the same as in the attached pictures — looking down at him from about 30 degrees above, with no perspective distortion.
Character: a white wolf warrior with a full wolf head — a strong muzzle, a black nose, bright ice-blue eyes, a small red X-shaped scar above his RIGHT eye, tall pointed ears; snow-white fur with soft lavender-grey shading, a thick spiky mane of fur round his head, cheeks and neck, and a thin white braid with small silver rings beside his RIGHT cheek. A cream-white fur collar on a crimson fur-lined cape over both shoulders and down to the middle of his back, a round silver knotwork brooch on his LEFT chest, a dark-steel pauldron shaped like a snarling wolf head on his LEFT shoulder. A sleeveless deep-navy tunic with a silver knotwork band down the front, split into front panels over a crimson underlayer; a brown leather belt with a big round silver knotwork buckle. Bare white-furred arms with dark brown leather bracers; a heavy steel chain wrapped round his LEFT forearm with four broken links hanging. Baggy charcoal-black trousers, dark brown boots with crisscross straps and thick white fur cuffs. A huge bushy white tail. His Viking greataxe, almost as tall as he is, in his RIGHT hand (in both hands where a frame says so): a crimson haft wrapped with dark crisscross straps and silver bands, a pointed silver end at the bottom, a dark-steel upper haft with a round silver knob on top, and a broad silver crescent blade with an ice-blue knotwork pattern, set in a snarling dark-iron wolf head.
View: the four frames are one full turn in place, all from the same camera; in every frame his feet stay on the same spot, he holds the axe out at full arm's length in both hands with the haft level and the blade pointing outward, leaning a little into the spin, his cape, braid and tail flaring out.
Layout: landscape 1536×1024, 4 frames in a 2×2 grid read like a book (top-left, top-right, bottom-left, bottom-right). Each frame sits in its own quarter of the picture, the wolf the same size in every frame, his whole body (ears, tail, boots) and the WHOLE axe inside his own quarter with clear empty space around it — frames never touch or overlap.
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
Use the two attached pictures: the large picture shows exactly how he looks and how he is rendered, and the row of five pictures shows him from every side — copy his look exactly.
Style: the same 2.5D look as the attached pictures — a stylized 3D game model with solid volume and depth, rendered with a toon shader that imitates hand-drawn art: clean dark-brown hand-drawn-looking outlines, soft cel shading in 2–3 tones that follows the 3D forms, one warm key light from the upper left, a thin bright rim light along the edges, matte painted textures (fluffy fur, cloth, worn leather, brushed steel). Not photorealistic, not glossy plastic, not a flat 2D drawing. Keep his body proportions exactly as in the pictures.
Camera: the same as in the attached pictures — looking down at him from about 30 degrees above, with no perspective distortion.
Character: a white wolf warrior with a full wolf head — a strong muzzle, a black nose, bright ice-blue eyes, a small red X-shaped scar above his RIGHT eye, tall pointed ears; snow-white fur with soft lavender-grey shading, a thick spiky mane of fur round his head, cheeks and neck, and a thin white braid with small silver rings beside his RIGHT cheek. A cream-white fur collar on a crimson fur-lined cape over both shoulders and down to the middle of his back, a round silver knotwork brooch on his LEFT chest, a dark-steel pauldron shaped like a snarling wolf head on his LEFT shoulder. A sleeveless deep-navy tunic with a silver knotwork band down the front, split into front panels over a crimson underlayer; a brown leather belt with a big round silver knotwork buckle. Bare white-furred arms with dark brown leather bracers; a heavy steel chain wrapped round his LEFT forearm with four broken links hanging. Baggy charcoal-black trousers, dark brown boots with crisscross straps and thick white fur cuffs. A huge bushy white tail. His Viking greataxe, almost as tall as he is, in his RIGHT hand (in both hands where a frame says so): a crimson haft wrapped with dark crisscross straps and silver bands, a pointed silver end at the bottom, a dark-steel upper haft with a round silver knob on top, and a broad silver crescent blade with an ice-blue knotwork pattern, set in a snarling dark-iron wolf head.
View: every frame shows him from the same front three-quarter view as the large attached picture — body and face turned toward the lower right of the picture.
Layout: landscape 1536×1024, 4 frames in a 2×2 grid read like a book (top-left, top-right, bottom-left, bottom-right). Each frame sits in its own quarter of the picture, the wolf the same size in every frame, his whole body (ears, tail, boots) and the WHOLE axe inside his own quarter with clear empty space around it — frames never touch or overlap.
Frames:
1. Wind-up: both hands pulling the axe far back to his right side at waist height (the left side of the picture), body twisted away, weight on the back foot.
2. Mid-sweep: the axe swinging level across in front of him at waist height, the edge of the blade leading toward the lower right, body turning.
3. Follow-through: the axe swung all the way across to his left side (the right side of the picture), body twisted the other way, weight on the front foot.
4. Recovering: back in a ready stance, the axe held in front of him.
Background: flat solid pure green #00FF00 everywhere, no gradient, no floor, no shadow under him.
No effects at all: no slash trails, motion lines, speed lines, glow, runes in the air, ice, lightning, sparkles, dust, cracks, impact bursts, symbols, text, numbers or frame borders — only the wolf and his axe; show the movement with the pose alone. The ice-blue pattern on the blade stays a flat painted pattern, never glowing. No green anywhere on him.
```

### ⑨ ท่านั่งพัก (1 ภาพ 8 มุม)
ใช้กับ นั่งพัก (ปุ่ม Insert / 🧘) แบบแมว ลิง จากัวร์ — ตอนนี้หมาป่านั่งไม่ได้

```
2.5D game sprite sheet — the white wolf warrior sitting down to rest, the same pose seen from 8 directions.
Use the two attached pictures: the large picture shows exactly how he looks and how he is rendered, and the row of five pictures shows him from every side — copy his look exactly.
Style: the same 2.5D look as the attached pictures — a stylized 3D game model with solid volume and depth, rendered with a toon shader that imitates hand-drawn art: clean dark-brown hand-drawn-looking outlines, soft cel shading in 2–3 tones that follows the 3D forms, one warm key light from the upper left, a thin bright rim light along the edges, matte painted textures (fluffy fur, cloth, worn leather, brushed steel). Not photorealistic, not glossy plastic, not a flat 2D drawing. Keep his body proportions exactly as in the pictures.
Camera: the same as in the attached pictures — looking down at him from about 30 degrees above, with no perspective distortion.
Character: a white wolf warrior with a full wolf head — a strong muzzle, a black nose, bright ice-blue eyes, a small red X-shaped scar above his RIGHT eye, tall pointed ears; snow-white fur with soft lavender-grey shading, a thick spiky mane of fur round his head, cheeks and neck, and a thin white braid with small silver rings beside his RIGHT cheek. A cream-white fur collar on a crimson fur-lined cape over both shoulders and down to the middle of his back, a round silver knotwork brooch on his LEFT chest, a dark-steel pauldron shaped like a snarling wolf head on his LEFT shoulder. A sleeveless deep-navy tunic with a silver knotwork band down the front, split into front panels over a crimson underlayer; a brown leather belt with a big round silver knotwork buckle. Bare white-furred arms with dark brown leather bracers; a heavy steel chain wrapped round his LEFT forearm with four broken links hanging. Baggy charcoal-black trousers, dark brown boots with crisscross straps and thick white fur cuffs. A huge bushy white tail. His Viking greataxe, almost as tall as he is, in his RIGHT hand (in both hands where a frame says so): a crimson haft wrapped with dark crisscross straps and silver bands, a pointed silver end at the bottom, a dark-steel upper haft with a round silver knob on top, and a broad silver crescent blade with an ice-blue knotwork pattern, set in a snarling dark-iron wolf head.
Pose (the same in all 8 pictures): he sits cross-legged on the ground, back straight, both hands resting on his knees, his greataxe laid on the ground in front of him, his tail curled around him, a calm, relaxed face with eyes open.
Layout: landscape 1536×1024, 8 pictures in 2 rows of 4, read left to right, top row first. Each picture sits in its own eighth of the picture, the wolf the same size in every picture, his whole body (ears, tail, boots) and the WHOLE axe inside his own area with clear empty space around it — pictures never touch or overlap.
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
