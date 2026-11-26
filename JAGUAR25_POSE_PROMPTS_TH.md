# จากัวร์ 2.5D — ภาพท่าเสริม (วาดแผ่นเดิมใหม่ในลุค 2.5D)

เจ้าของขอเมื่อ 2026-11-26 10:59 ว่า "ขอพร้อมท่าเสริมด้วย" (หลังได้พรอมต์ภาพยืน 2.5D 5 มุม · JAGUAR_LOOK_PROMPTS_TH.md หัวข้อ '2.5D แบบ Ragnarok 3')

ท่าเสริม 8 แผ่นที่ใส่เข้าเกมเมื่อเช้า (`assets/heroes/jaguar/poses/<ท่า>.webp` · JAGUAR_POSE_PROMPTS_TH.md) เป็นลายเส้น 2D แบบเดิม ถ้าตัวละครเปลี่ยนเป็น 2.5D จะใช้แผ่นพวกนั้นปนไม่ได้ (คนละลุค) จึงต้องวาดใหม่ในลุค 2.5D
วิธีนี้ไม่ได้คิดท่าใหม่ แต่ให้ ChatGPT เอาแผ่นเดิมมาวาดใหม่ทั้งแผ่นในลุค 2.5D โดยคงท่า ลำดับเฟรม และเลย์เอาต์ (2×2 / 2×4) ไว้เหมือนเดิม ไฟล์ spec `tools/clips/jaguar_<ท่า>.json` กับ `jaguar_pose.js` จึงใช้ต่อได้ แค่ต้องวัดสเกลกับจุดยึดใหม่

แผ่นท่า 2.5D ใช้ได้เมื่อมีแอตลาส 2.5D จากคลิป 20 ตัวแล้วเท่านั้น (ใช้ปนกับคลิปลุคเดิมไม่ได้) เจนรูปไว้ก่อนได้ตั้งแต่ได้รูป 2.5D มุม SE ที่โอเค

## แนบอะไร

ใช้แชต ChatGPT เดียวกับที่วาดภาพยืน 2.5D ก็ได้ วางกล่องทีละกล่อง แต่ละกล่องแนบรูปใหม่ทุกครั้ง (ได้รูปแล้วค่อยวางกล่องถัดไป):

1. รูป 2.5D มุม SE (เฉียงหน้า หันขวา) ที่ได้จากกล่องแรกของภาพยืน 2.5D ใช้เป็นหน้าตาและการเรนเดอร์
2. แผ่นท่าเดิมของท่านั้น (ส่งในแชตเป็น `jaguar_pose_<เลข>_<ท่า>.jpg` ไฟล์เดียวกับ `assets/heroes/jaguar/poses/<ท่า>.webp`) ใช้เป็นท่า ลำดับเฟรม และเลย์เอาต์
3. (ไม่บังคับ) ท่าหมุนกับท่านั่งต้องมีมุมหลังด้วย ถ้ามีรูป 2.5D มุม S / E / NE / N แล้วแนบเพิ่มได้ กล่องเขียนรองรับไว้แล้ว

ไม่แนบภาพหน้าโหลดหรือ design sheet 2D (มันจะดึงกลับเป็นภาพวาด 2D) · ห้ามแนบไฟล์ .md นี้ให้ ChatGPT

## ลำดับ

| # | ท่า | ใช้กับ | ความสำคัญ |
|---|---|---|---|
| 1 | ① ท่ากระโจนแทงลง (8 เฟรม) | Predator Drop · Sky-Pounce · Throne of Claws (หมอบ) | สำคัญ |
| 2 | ② ท่าพุ่งต่ำ (4 เฟรม) | Jaguar Step · Blood Chase · Shadow Slip (สไลด์หยุด) · Throne of Claws | สำคัญ |
| 3 | ③ ท่าตั้งการ์ดไขว้มีด (4 เฟรม) | Countercut · Obsidian Parry · Obsidian Mirror | สำคัญ |
| 4 | ④ ท่าคำราม (4 เฟรม) | Predator's Cry · Savage Tempo · Hunter's Focus | ดี |
| 5 | ⑤ ท่าชูมีดร่ายสุริยุปราคา (4 เฟรม) | Eclipse of the Fifth Sun · Blood Moon Hunt · Shadow Veil · Nightfall Dance · Phantom Riposte · แถบร่าย | ดี |
| 6 | ⑥ ท่าขว้าง (4 เฟรม) | Obsidian Seal · Moon Trap · Mirror Shatter | เสริม |
| 7 | ⑦ ท่าหมุนฟันรอบตัว (4 เฟรม = หมุน 1 รอบ) | Jaguar Cyclone | เสริม |
| 8 | ⑧ ท่านั่งพัก (8 มุม) | นั่งพัก (ปุ่ม Insert / 🧘) + สถานะนั่งพัก ×2 | เสริม |

## กล่องพรอมต์ (ภาษาอังกฤษ วางทีละกล่อง)

### ① ท่ากระโจนแทงลง (8 เฟรม)
ใช้กับ Predator Drop · Sky-Pounce · Throne of Claws (หมอบ) · แนบ: รูป 2.5D มุม SE + `jaguar_pose_1_pounce.jpg`

```
2.5D game sprite sheet — the jaguar dancer's leaping pounce with a downward double-dagger stab, 8 frames.
Use the attached pictures this way: the 2.5D picture of her (a 3D-looking render on green) shows exactly how she looks and how she is rendered — copy her look, colours, body proportions and face exactly from it; if more 2.5D pictures of her are attached, they show her from other sides. The flat 2D sprite sheet shows this same move: copy ONLY its poses, the order of its frames and its layout, and redraw every frame in the 2.5D look — do not copy its flat drawing style or its proportions.
Style: the same 2.5D look as the 2.5D picture — a stylized 3D game model with solid volume and depth, rendered with a toon shader that imitates hand-drawn art: clean dark-brown hand-drawn-looking outlines, soft cel shading in 2–3 tones that follows the 3D forms, one warm key light from the upper left with a soft cool shadow side, a thin bright rim light along the edges, matte painted textures (short soft fur with jaguar rosettes, soft hair strands, woven cloth, gold with soft painted highlights, polished black obsidian). Not photorealistic, not glossy plastic, not a flat 2D drawing. Her body proportions and her cute face stay exactly as in the 2.5D picture, the same in every frame.
Camera: the same in every frame and the same as in the 2.5D picture — looking down at her from about 30 degrees above, with no perspective distortion.
Her look (from the 2.5D picture, nothing added and nothing left out): a young jaguar woman with golden-amber fur and dark-brown jaguar rosettes, a cream muzzle, big golden-amber eyes, round ears with fluffy cream insides; long wavy dark-chocolate hair with bangs in a high ponytail with a gold ring; on her own right side of her head a round gold sun-disc ornament with short spiky rays, a small fan of scarlet and turquoise feathers and a little gold bell with a turquoise bead; small gold hoop earrings, a crimson choker, a wide gold collar with a big round turquoise gem, a black crop top with crimson trim, gold armbands and wide gold wrist cuffs with turquoise, dark-brown hands, a wide gold belt with an oval turquoise gem, a crimson sash tied in a big bow at the back of her waist, a layered skirt with a cream front panel over crimson layers and gold step-pattern borders, crimson ankle bands with small bows, gold sandals, and a long golden tail with dark-brown spots and rings. In every frame she holds one long curved black obsidian dagger with a violet sheen and a gold crescent-shaped guard in EACH hand. Her face stays pretty and confident.
View: every frame shows her from the same front three-quarter view as the 2.5D picture — body and face turned toward the lower right of the picture.
Layout: landscape 1536×1024, 8 frames in 2 rows of 4, read left to right, top row first, exactly like the flat sheet. Each frame sits in its own eighth of the picture, the character the same size in every frame, her whole body (ears, ponytail, feathers, both daggers, tail and feet) inside her own area with clear empty green space around it — frames never touch or overlap.
Frames:
1. Crouch to spring: knees bent deep, body low and leaning forward, both daggers held back low by her hips, eyes on the target ahead.
2. Take-off: legs pushing off the ground, body rising and leaning forward, both daggers pulled back behind her.
3. Rising: in the air with knees tucked up, back curved like a leaping cat, both daggers lifted high above her head.
4. Top of the leap: body stretched forward and tilted down toward the lower right, both daggers raised overhead with the blades pointing down, ponytail and tail streaming up behind her.
5. Diving down: falling toward the ground, both arms swinging down, both daggers pointing straight down in front of her.
6. Landing stab: one knee down and one foot planted, both daggers driven point-first into the ground in front of her, head low, ponytail thrown forward.
7. Getting up: still crouched, pulling both daggers out of the ground.
8. Ready stance: standing again, knees slightly bent, daggers held low.
Frames 2 to 5 are in the air (feet off the ground); draw them the same size as the other frames.
Background: flat solid pure green #00FF00 everywhere, no gradient, no floor, no shadow under her.
No effects at all: no slash trails, motion lines, speed lines, glow, sparkles, dust, cracks, impact bursts, black sun, shadow wisps, symbols, text, numbers or frame borders — only her body and her two daggers; show the movement with the pose alone. No green anywhere on her: every turquoise part is a clear sky-blue turquoise. The front panel of her skirt shows only the gold step pattern, no letters.
```

### ② ท่าพุ่งต่ำ (4 เฟรม)
ใช้กับ Jaguar Step · Blood Chase · Shadow Slip (สไลด์หยุด) · Throne of Claws · แนบ: รูป 2.5D มุม SE + `jaguar_pose_2_dash.jpg`

```
2.5D game sprite sheet — the jaguar dancer's low sprinting dash, 4 frames.
Use the attached pictures this way: the 2.5D picture of her (a 3D-looking render on green) shows exactly how she looks and how she is rendered — copy her look, colours, body proportions and face exactly from it; if more 2.5D pictures of her are attached, they show her from other sides. The flat 2D sprite sheet shows this same move: copy ONLY its poses, the order of its frames and its layout, and redraw every frame in the 2.5D look — do not copy its flat drawing style or its proportions.
Style: the same 2.5D look as the 2.5D picture — a stylized 3D game model with solid volume and depth, rendered with a toon shader that imitates hand-drawn art: clean dark-brown hand-drawn-looking outlines, soft cel shading in 2–3 tones that follows the 3D forms, one warm key light from the upper left with a soft cool shadow side, a thin bright rim light along the edges, matte painted textures (short soft fur with jaguar rosettes, soft hair strands, woven cloth, gold with soft painted highlights, polished black obsidian). Not photorealistic, not glossy plastic, not a flat 2D drawing. Her body proportions and her cute face stay exactly as in the 2.5D picture, the same in every frame.
Camera: the same in every frame and the same as in the 2.5D picture — looking down at her from about 30 degrees above, with no perspective distortion.
Her look (from the 2.5D picture, nothing added and nothing left out): a young jaguar woman with golden-amber fur and dark-brown jaguar rosettes, a cream muzzle, big golden-amber eyes, round ears with fluffy cream insides; long wavy dark-chocolate hair with bangs in a high ponytail with a gold ring; on her own right side of her head a round gold sun-disc ornament with short spiky rays, a small fan of scarlet and turquoise feathers and a little gold bell with a turquoise bead; small gold hoop earrings, a crimson choker, a wide gold collar with a big round turquoise gem, a black crop top with crimson trim, gold armbands and wide gold wrist cuffs with turquoise, dark-brown hands, a wide gold belt with an oval turquoise gem, a crimson sash tied in a big bow at the back of her waist, a layered skirt with a cream front panel over crimson layers and gold step-pattern borders, crimson ankle bands with small bows, gold sandals, and a long golden tail with dark-brown spots and rings. In every frame she holds one long curved black obsidian dagger with a violet sheen and a gold crescent-shaped guard in EACH hand. Her face stays pretty and confident.
View: every frame shows her from the same front three-quarter view as the 2.5D picture — body and face turned toward the lower right of the picture.
Layout: landscape 1536×1024, 4 frames in a 2×2 grid read like a book (top-left, top-right, bottom-left, bottom-right), exactly like the flat sheet. Each frame sits in its own quarter of the picture, the character the same size in every frame, her whole body (ears, ponytail, feathers, both daggers, tail and feet) inside her own quarter with clear empty green space around it — frames never touch or overlap.
Frames:
1. Push-off: body low and leaning far forward toward the lower right, back leg pushing, front knee bent, both daggers held back behind her in a reverse grip.
2. Full dash: body very low and stretched almost flat, both arms swept back with the daggers trailing behind her, one leg reaching forward and the other stretched back, ponytail and tail streaming straight back.
3. The same full dash with the legs swapped.
4. Sliding stop: skidding to a halt in a low, wide crouch, one dagger held out behind her and the other forward, ready to strike, ponytail swinging forward.
Background: flat solid pure green #00FF00 everywhere, no gradient, no floor, no shadow under her.
No effects at all: no slash trails, motion lines, speed lines, glow, sparkles, dust, cracks, impact bursts, black sun, shadow wisps, symbols, text, numbers or frame borders — only her body and her two daggers; show the movement with the pose alone. No green anywhere on her: every turquoise part is a clear sky-blue turquoise. The front panel of her skirt shows only the gold step pattern, no letters.
```

### ③ ท่าตั้งการ์ดไขว้มีด (4 เฟรม)
ใช้กับ Countercut · Obsidian Parry · Obsidian Mirror · แนบ: รูป 2.5D มุม SE + `jaguar_pose_3_guard.jpg`

```
2.5D game sprite sheet — the jaguar dancer's crossed-dagger guard and parry, 4 frames.
Use the attached pictures this way: the 2.5D picture of her (a 3D-looking render on green) shows exactly how she looks and how she is rendered — copy her look, colours, body proportions and face exactly from it; if more 2.5D pictures of her are attached, they show her from other sides. The flat 2D sprite sheet shows this same move: copy ONLY its poses, the order of its frames and its layout, and redraw every frame in the 2.5D look — do not copy its flat drawing style or its proportions.
Style: the same 2.5D look as the 2.5D picture — a stylized 3D game model with solid volume and depth, rendered with a toon shader that imitates hand-drawn art: clean dark-brown hand-drawn-looking outlines, soft cel shading in 2–3 tones that follows the 3D forms, one warm key light from the upper left with a soft cool shadow side, a thin bright rim light along the edges, matte painted textures (short soft fur with jaguar rosettes, soft hair strands, woven cloth, gold with soft painted highlights, polished black obsidian). Not photorealistic, not glossy plastic, not a flat 2D drawing. Her body proportions and her cute face stay exactly as in the 2.5D picture, the same in every frame.
Camera: the same in every frame and the same as in the 2.5D picture — looking down at her from about 30 degrees above, with no perspective distortion.
Her look (from the 2.5D picture, nothing added and nothing left out): a young jaguar woman with golden-amber fur and dark-brown jaguar rosettes, a cream muzzle, big golden-amber eyes, round ears with fluffy cream insides; long wavy dark-chocolate hair with bangs in a high ponytail with a gold ring; on her own right side of her head a round gold sun-disc ornament with short spiky rays, a small fan of scarlet and turquoise feathers and a little gold bell with a turquoise bead; small gold hoop earrings, a crimson choker, a wide gold collar with a big round turquoise gem, a black crop top with crimson trim, gold armbands and wide gold wrist cuffs with turquoise, dark-brown hands, a wide gold belt with an oval turquoise gem, a crimson sash tied in a big bow at the back of her waist, a layered skirt with a cream front panel over crimson layers and gold step-pattern borders, crimson ankle bands with small bows, gold sandals, and a long golden tail with dark-brown spots and rings. In every frame she holds one long curved black obsidian dagger with a violet sheen and a gold crescent-shaped guard in EACH hand. Her face stays pretty and confident.
View: every frame shows her from the same front three-quarter view as the 2.5D picture — body and face turned toward the lower right of the picture.
Layout: landscape 1536×1024, 4 frames in a 2×2 grid read like a book (top-left, top-right, bottom-left, bottom-right), exactly like the flat sheet. Each frame sits in its own quarter of the picture, the character the same size in every frame, her whole body (ears, ponytail, feathers, both daggers, tail and feet) inside her own quarter with clear empty green space around it — frames never touch or overlap.
Frames:
1. Raising her guard: feet apart, knees bent, both daggers coming up in front of her chest.
2. Guard: both daggers crossed in an X in front of her chest and chin, blades pointing up, elbows out, knees bent, sharp eyes looking over the crossed blades.
3. The same guard a moment later, almost identical — shoulders a little lower, tail and ponytail swayed the other way — so frames 2 and 3 can loop.
4. Deflect: arms snapping apart outward, both daggers swept out to the sides, body leaning forward, ready to counterattack.
Background: flat solid pure green #00FF00 everywhere, no gradient, no floor, no shadow under her.
No effects at all: no slash trails, motion lines, speed lines, glow, sparkles, dust, cracks, impact bursts, black sun, shadow wisps, symbols, text, numbers or frame borders — only her body and her two daggers; show the movement with the pose alone. No green anywhere on her: every turquoise part is a clear sky-blue turquoise. The front panel of her skirt shows only the gold step pattern, no letters.
```

### ④ ท่าคำราม (4 เฟรม)
ใช้กับ Predator's Cry · Savage Tempo · Hunter's Focus · แนบ: รูป 2.5D มุม SE + `jaguar_pose_4_roar.jpg`

```
2.5D game sprite sheet — the jaguar dancer's war cry (a jaguar roar), 4 frames.
Use the attached pictures this way: the 2.5D picture of her (a 3D-looking render on green) shows exactly how she looks and how she is rendered — copy her look, colours, body proportions and face exactly from it; if more 2.5D pictures of her are attached, they show her from other sides. The flat 2D sprite sheet shows this same move: copy ONLY its poses, the order of its frames and its layout, and redraw every frame in the 2.5D look — do not copy its flat drawing style or its proportions.
Style: the same 2.5D look as the 2.5D picture — a stylized 3D game model with solid volume and depth, rendered with a toon shader that imitates hand-drawn art: clean dark-brown hand-drawn-looking outlines, soft cel shading in 2–3 tones that follows the 3D forms, one warm key light from the upper left with a soft cool shadow side, a thin bright rim light along the edges, matte painted textures (short soft fur with jaguar rosettes, soft hair strands, woven cloth, gold with soft painted highlights, polished black obsidian). Not photorealistic, not glossy plastic, not a flat 2D drawing. Her body proportions and her cute face stay exactly as in the 2.5D picture, the same in every frame.
Camera: the same in every frame and the same as in the 2.5D picture — looking down at her from about 30 degrees above, with no perspective distortion.
Her look (from the 2.5D picture, nothing added and nothing left out): a young jaguar woman with golden-amber fur and dark-brown jaguar rosettes, a cream muzzle, big golden-amber eyes, round ears with fluffy cream insides; long wavy dark-chocolate hair with bangs in a high ponytail with a gold ring; on her own right side of her head a round gold sun-disc ornament with short spiky rays, a small fan of scarlet and turquoise feathers and a little gold bell with a turquoise bead; small gold hoop earrings, a crimson choker, a wide gold collar with a big round turquoise gem, a black crop top with crimson trim, gold armbands and wide gold wrist cuffs with turquoise, dark-brown hands, a wide gold belt with an oval turquoise gem, a crimson sash tied in a big bow at the back of her waist, a layered skirt with a cream front panel over crimson layers and gold step-pattern borders, crimson ankle bands with small bows, gold sandals, and a long golden tail with dark-brown spots and rings. In every frame she holds one long curved black obsidian dagger with a violet sheen and a gold crescent-shaped guard in EACH hand. Her face stays pretty and confident.
View: every frame shows her from the same front three-quarter view as the 2.5D picture — body and face turned toward the lower right of the picture.
Layout: landscape 1536×1024, 4 frames in a 2×2 grid read like a book (top-left, top-right, bottom-left, bottom-right), exactly like the flat sheet. Each frame sits in its own quarter of the picture, the character the same size in every frame, her whole body (ears, ponytail, feathers, both daggers, tail and feet) inside her own quarter with clear empty green space around it — frames never touch or overlap.
Frames:
1. Drawing breath: shoulders hunched, head down, knees bent, both daggers held low and out to the sides.
2. Roar: chest out, head tilted back, mouth wide open showing small fangs, eyes narrowed fiercely, both arms flung wide and low to the sides with the daggers pointing outward, tail raised high, ponytail flying.
3. The same roar a moment later, a little stronger — shoulders pulled back further, hair and feathers blown back — so frames 2 and 3 can alternate.
4. Settling: mouth closing into a confident fanged smirk, arms lowering, back in a ready stance.
She stays pretty even while roaring.
Background: flat solid pure green #00FF00 everywhere, no gradient, no floor, no shadow under her.
No effects at all: no slash trails, motion lines, speed lines, glow, sparkles, dust, cracks, impact bursts, black sun, shadow wisps, symbols, text, numbers or frame borders — only her body and her two daggers; show the movement with the pose alone. No green anywhere on her: every turquoise part is a clear sky-blue turquoise. The front panel of her skirt shows only the gold step pattern, no letters.
```

### ⑤ ท่าชูมีดร่ายสุริยุปราคา (4 เฟรม)
ใช้กับ Eclipse of the Fifth Sun · Blood Moon Hunt · Shadow Veil · Nightfall Dance · Phantom Riposte · แถบร่าย · แนบ: รูป 2.5D มุม SE + `jaguar_pose_5_cast.jpg`

```
2.5D game sprite sheet — the jaguar dancer summoning an eclipse spell with both arms raised to the sky, 4 frames.
Use the attached pictures this way: the 2.5D picture of her (a 3D-looking render on green) shows exactly how she looks and how she is rendered — copy her look, colours, body proportions and face exactly from it; if more 2.5D pictures of her are attached, they show her from other sides. The flat 2D sprite sheet shows this same move: copy ONLY its poses, the order of its frames and its layout, and redraw every frame in the 2.5D look — do not copy its flat drawing style or its proportions.
Style: the same 2.5D look as the 2.5D picture — a stylized 3D game model with solid volume and depth, rendered with a toon shader that imitates hand-drawn art: clean dark-brown hand-drawn-looking outlines, soft cel shading in 2–3 tones that follows the 3D forms, one warm key light from the upper left with a soft cool shadow side, a thin bright rim light along the edges, matte painted textures (short soft fur with jaguar rosettes, soft hair strands, woven cloth, gold with soft painted highlights, polished black obsidian). Not photorealistic, not glossy plastic, not a flat 2D drawing. Her body proportions and her cute face stay exactly as in the 2.5D picture, the same in every frame.
Camera: the same in every frame and the same as in the 2.5D picture — looking down at her from about 30 degrees above, with no perspective distortion.
Her look (from the 2.5D picture, nothing added and nothing left out): a young jaguar woman with golden-amber fur and dark-brown jaguar rosettes, a cream muzzle, big golden-amber eyes, round ears with fluffy cream insides; long wavy dark-chocolate hair with bangs in a high ponytail with a gold ring; on her own right side of her head a round gold sun-disc ornament with short spiky rays, a small fan of scarlet and turquoise feathers and a little gold bell with a turquoise bead; small gold hoop earrings, a crimson choker, a wide gold collar with a big round turquoise gem, a black crop top with crimson trim, gold armbands and wide gold wrist cuffs with turquoise, dark-brown hands, a wide gold belt with an oval turquoise gem, a crimson sash tied in a big bow at the back of her waist, a layered skirt with a cream front panel over crimson layers and gold step-pattern borders, crimson ankle bands with small bows, gold sandals, and a long golden tail with dark-brown spots and rings. In every frame she holds one long curved black obsidian dagger with a violet sheen and a gold crescent-shaped guard in EACH hand. Her face stays pretty and confident.
View: every frame shows her from the same front three-quarter view as the 2.5D picture — body and face turned toward the lower right of the picture.
Layout: landscape 1536×1024, 4 frames in a 2×2 grid read like a book (top-left, top-right, bottom-left, bottom-right), exactly like the flat sheet. Each frame sits in its own quarter of the picture, the character the same size in every frame, her whole body (ears, ponytail, feathers, both daggers, tail and feet) inside her own quarter with clear empty green space around it — frames never touch or overlap.
Frames:
1. Gathering power: both daggers crossed in front of her chest, eyes closed, knees soft.
2. Raising: both arms sweeping up, the crossed daggers passing in front of her face.
3. Summoning: both arms stretched straight up, the two daggers crossed in an X high above her head, body arched slightly back, face looking up with her mouth open in a fierce call, ponytail, feathers and skirt lifting as if in a rising wind, feet together.
4. The same summoning pose a moment later, almost identical — ponytail and skirt drifting the other way — so frames 3 and 4 can loop.
Background: flat solid pure green #00FF00 everywhere, no gradient, no floor, no shadow under her.
No effects at all: no slash trails, motion lines, speed lines, glow, sparkles, dust, cracks, impact bursts, black sun, shadow wisps, symbols, text, numbers or frame borders — only her body and her two daggers; show the movement with the pose alone. No green anywhere on her: every turquoise part is a clear sky-blue turquoise. The front panel of her skirt shows only the gold step pattern, no letters.
```

### ⑥ ท่าขว้าง (4 เฟรม)
ใช้กับ Obsidian Seal · Moon Trap · Mirror Shatter · แนบ: รูป 2.5D มุม SE + `jaguar_pose_6_throw.jpg`

```
2.5D game sprite sheet — the jaguar dancer's overhand throw, 4 frames.
Use the attached pictures this way: the 2.5D picture of her (a 3D-looking render on green) shows exactly how she looks and how she is rendered — copy her look, colours, body proportions and face exactly from it; if more 2.5D pictures of her are attached, they show her from other sides. The flat 2D sprite sheet shows this same move: copy ONLY its poses, the order of its frames and its layout, and redraw every frame in the 2.5D look — do not copy its flat drawing style or its proportions.
Style: the same 2.5D look as the 2.5D picture — a stylized 3D game model with solid volume and depth, rendered with a toon shader that imitates hand-drawn art: clean dark-brown hand-drawn-looking outlines, soft cel shading in 2–3 tones that follows the 3D forms, one warm key light from the upper left with a soft cool shadow side, a thin bright rim light along the edges, matte painted textures (short soft fur with jaguar rosettes, soft hair strands, woven cloth, gold with soft painted highlights, polished black obsidian). Not photorealistic, not glossy plastic, not a flat 2D drawing. Her body proportions and her cute face stay exactly as in the 2.5D picture, the same in every frame.
Camera: the same in every frame and the same as in the 2.5D picture — looking down at her from about 30 degrees above, with no perspective distortion.
Her look (from the 2.5D picture, nothing added and nothing left out): a young jaguar woman with golden-amber fur and dark-brown jaguar rosettes, a cream muzzle, big golden-amber eyes, round ears with fluffy cream insides; long wavy dark-chocolate hair with bangs in a high ponytail with a gold ring; on her own right side of her head a round gold sun-disc ornament with short spiky rays, a small fan of scarlet and turquoise feathers and a little gold bell with a turquoise bead; small gold hoop earrings, a crimson choker, a wide gold collar with a big round turquoise gem, a black crop top with crimson trim, gold armbands and wide gold wrist cuffs with turquoise, dark-brown hands, a wide gold belt with an oval turquoise gem, a crimson sash tied in a big bow at the back of her waist, a layered skirt with a cream front panel over crimson layers and gold step-pattern borders, crimson ankle bands with small bows, gold sandals, and a long golden tail with dark-brown spots and rings. In every frame she holds one long curved black obsidian dagger with a violet sheen and a gold crescent-shaped guard in EACH hand. Her face stays pretty and confident.
View: every frame shows her from the same front three-quarter view as the 2.5D picture — body and face turned toward the lower right of the picture.
Layout: landscape 1536×1024, 4 frames in a 2×2 grid read like a book (top-left, top-right, bottom-left, bottom-right), exactly like the flat sheet. Each frame sits in its own quarter of the picture, the character the same size in every frame, her whole body (ears, ponytail, feathers, both daggers, tail and feet) inside her own quarter with clear empty green space around it — frames never touch or overlap.
Frames:
1. Wind-up: body turned back, the arm nearest to us drawn back behind her head, the other dagger held at her chest, weight on the back foot.
2. Throw: that arm snapped forward and down toward the lower right in a flicking throw, body leaning forward, weight on the front foot.
3. Follow-through: the throwing arm swung low across her body, eyes following where the throw went.
4. Back to a ready stance, daggers held low.
Her hands keep their daggers the whole time; do not draw the thrown object — the game adds it.
Background: flat solid pure green #00FF00 everywhere, no gradient, no floor, no shadow under her.
No effects at all: no slash trails, motion lines, speed lines, glow, sparkles, dust, cracks, impact bursts, black sun, shadow wisps, symbols, text, numbers or frame borders — only her body and her two daggers; show the movement with the pose alone. No green anywhere on her: every turquoise part is a clear sky-blue turquoise. The front panel of her skirt shows only the gold step pattern, no letters.
```

### ⑦ ท่าหมุนฟันรอบตัว (4 เฟรม = หมุน 1 รอบ)
ใช้กับ Jaguar Cyclone · แนบ: รูป 2.5D มุม SE + `jaguar_pose_7_spin.jpg`

```
2.5D game sprite sheet — the jaguar dancer's spinning blade dance, 4 frames = one full turn in place.
Use the attached pictures this way: the 2.5D picture of her (a 3D-looking render on green) shows exactly how she looks and how she is rendered — copy her look, colours, body proportions and face exactly from it; if more 2.5D pictures of her are attached, they show her from other sides. The flat 2D sprite sheet shows this same move: copy ONLY its poses, the order of its frames and its layout, and redraw every frame in the 2.5D look — do not copy its flat drawing style or its proportions.
Style: the same 2.5D look as the 2.5D picture — a stylized 3D game model with solid volume and depth, rendered with a toon shader that imitates hand-drawn art: clean dark-brown hand-drawn-looking outlines, soft cel shading in 2–3 tones that follows the 3D forms, one warm key light from the upper left with a soft cool shadow side, a thin bright rim light along the edges, matte painted textures (short soft fur with jaguar rosettes, soft hair strands, woven cloth, gold with soft painted highlights, polished black obsidian). Not photorealistic, not glossy plastic, not a flat 2D drawing. Her body proportions and her cute face stay exactly as in the 2.5D picture, the same in every frame.
Camera: the same in every frame and the same as in the 2.5D picture — looking down at her from about 30 degrees above, with no perspective distortion.
Her look (from the 2.5D picture, nothing added and nothing left out): a young jaguar woman with golden-amber fur and dark-brown jaguar rosettes, a cream muzzle, big golden-amber eyes, round ears with fluffy cream insides; long wavy dark-chocolate hair with bangs in a high ponytail with a gold ring; on her own right side of her head a round gold sun-disc ornament with short spiky rays, a small fan of scarlet and turquoise feathers and a little gold bell with a turquoise bead; small gold hoop earrings, a crimson choker, a wide gold collar with a big round turquoise gem, a black crop top with crimson trim, gold armbands and wide gold wrist cuffs with turquoise, dark-brown hands, a wide gold belt with an oval turquoise gem, a crimson sash tied in a big bow at the back of her waist, a layered skirt with a cream front panel over crimson layers and gold step-pattern borders, crimson ankle bands with small bows, gold sandals, and a long golden tail with dark-brown spots and rings. In every frame she holds one long curved black obsidian dagger with a violet sheen and a gold crescent-shaped guard in EACH hand. Her face stays pretty and confident.
View: the four frames are one full turn in place, all seen from the same camera; in every frame her feet stay on the same spot, both arms are stretched out wide to the sides with a dagger in each hand, blades pointing outward, and her skirt, ponytail and tail flare out from the spin.
Layout: landscape 1536×1024, 4 frames in a 2×2 grid read like a book (top-left, top-right, bottom-left, bottom-right), exactly like the flat sheet. Each frame sits in its own quarter of the picture, the character the same size in every frame, her whole body (ears, ponytail, feathers, both daggers, tail and feet) inside her own quarter with clear empty green space around it — frames never touch or overlap.
Frames:
1. Front view, facing us.
2. Side view, facing the right of the picture.
3. Back view: we see her ponytail, the back of the feather fan, the big crimson bow of her sash and her tail.
4. Side view, facing the left of the picture.
Background: flat solid pure green #00FF00 everywhere, no gradient, no floor, no shadow under her.
No effects at all: no slash trails, motion lines, speed lines, glow, sparkles, dust, cracks, impact bursts, black sun, shadow wisps, symbols, text, numbers or frame borders — only her body and her two daggers; show the movement with the pose alone. No green anywhere on her: every turquoise part is a clear sky-blue turquoise. The front panel of her skirt shows only the gold step pattern, no letters.
```

### ⑧ ท่านั่งพัก (8 มุม)
ใช้กับ นั่งพัก (ปุ่ม Insert / 🧘) + สถานะนั่งพัก ×2 · แนบ: รูป 2.5D มุม SE + `jaguar_pose_8_sit.jpg`

```
2.5D game sprite sheet — the jaguar dancer kneeling to rest, the same pose seen from 8 directions.
Use the attached pictures this way: the 2.5D picture of her (a 3D-looking render on green) shows exactly how she looks and how she is rendered — copy her look, colours, body proportions and face exactly from it; if more 2.5D pictures of her are attached, they show her from other sides. The flat 2D sprite sheet shows this same move: copy ONLY its poses, the order of its frames and its layout, and redraw every frame in the 2.5D look — do not copy its flat drawing style or its proportions.
Style: the same 2.5D look as the 2.5D picture — a stylized 3D game model with solid volume and depth, rendered with a toon shader that imitates hand-drawn art: clean dark-brown hand-drawn-looking outlines, soft cel shading in 2–3 tones that follows the 3D forms, one warm key light from the upper left with a soft cool shadow side, a thin bright rim light along the edges, matte painted textures (short soft fur with jaguar rosettes, soft hair strands, woven cloth, gold with soft painted highlights, polished black obsidian). Not photorealistic, not glossy plastic, not a flat 2D drawing. Her body proportions and her cute face stay exactly as in the 2.5D picture, the same in every frame.
Camera: the same in every frame and the same as in the 2.5D picture — looking down at her from about 30 degrees above, with no perspective distortion.
Her look (from the 2.5D picture, nothing added and nothing left out): a young jaguar woman with golden-amber fur and dark-brown jaguar rosettes, a cream muzzle, big golden-amber eyes, round ears with fluffy cream insides; long wavy dark-chocolate hair with bangs in a high ponytail with a gold ring; on her own right side of her head a round gold sun-disc ornament with short spiky rays, a small fan of scarlet and turquoise feathers and a little gold bell with a turquoise bead; small gold hoop earrings, a crimson choker, a wide gold collar with a big round turquoise gem, a black crop top with crimson trim, gold armbands and wide gold wrist cuffs with turquoise, dark-brown hands, a wide gold belt with an oval turquoise gem, a crimson sash tied in a big bow at the back of her waist, a layered skirt with a cream front panel over crimson layers and gold step-pattern borders, crimson ankle bands with small bows, gold sandals, and a long golden tail with dark-brown spots and rings. Her two daggers: long curved black obsidian blades with a violet sheen and gold crescent-shaped guards. Her face stays pretty and confident.
Pose (the same in all 8 pictures): she kneels sitting back on her heels, back straight, both hands resting on her knees, her two daggers laid crossed on the ground in front of her knees, her tail curled round beside her, a calm happy smile with her eyes open.
Layout: landscape 1536×1024, 8 pictures in 2 rows of 4, read left to right, top row first, exactly like the flat sheet. Each picture sits in its own eighth of the sheet, the character the same size in every picture, her whole body, her tail and both daggers inside her own area with clear empty green space around it — pictures never touch or overlap.
Pictures:
1. Front view, facing us.
2. Front three-quarter view, turned toward the lower right.
3. Side view, facing right.
4. Back three-quarter view, turned toward the upper right.
5. Back view: we see her long hair, the big crimson bow of her sash and her tail.
6. Back three-quarter view, turned toward the upper left.
7. Side view, facing left.
8. Front three-quarter view, turned toward the lower left.
Background: flat solid pure green #00FF00 everywhere, no gradient, no floor, no shadow under her.
No effects at all: no slash trails, motion lines, speed lines, glow, sparkles, dust, cracks, impact bursts, black sun, shadow wisps, symbols, text, numbers or frame borders — only her body and her two daggers. No green anywhere on her: every turquoise part is a clear sky-blue turquoise. The front panel of her skirt shows only the gold step pattern, no letters.
```

แก้รูป (พิมพ์ต่อท้ายในแชตเดิม):
- ยังแบน / ติดลายเส้นแผ่นเก่า → `Redo: render every frame like the attached 2.5D picture — a 3D game model with rounded volume and soft 3D shading, clean hand-drawn outlines; the flat sheet is only for the poses.`
- หน้า สัดส่วน สี ไม่เหมือนรูป 2.5D → `Redo: copy her face, body proportions and colours exactly from the attached 2.5D picture, the same in every frame.`
- ท่าไม่ตรงแผ่นเดิม / เฟรมสลับลำดับ → `Redo: keep the same poses in the same order and the same layout as the attached flat sprite sheet.`
- มีด ผม หรือหาง หลุดกรอบ / เฟรมชนกัน → `Redo: draw her a little smaller so each frame, including both daggers, her hair and her tail, fits inside its own area with green space around it.`
- มีเอฟเฟกต์ (แสง เส้นความเร็ว ฝุ่น) → `Redo: remove every effect — only her and her two daggers on flat green.`
- เทอร์ควอยซ์ออกเขียว → `Redo: the turquoise feathers and gems must be sky-blue turquoise, not green.`
- แก้แค่บางเฟรม → ใช้แปรงเลือกเฉพาะเฟรมนั้นใน ChatGPT (สั่งแก้ทั้งภาพ มันจะวาดใหม่หมด)

## พอได้รูปแล้วทำต่อยังไง (แผนสำหรับแชตที่ต่อจากนี้)

1. เก็บรูปดิบไว้ที่ `assets/heroes/jaguar/poses25/<ท่า>.webp` (แผ่นเดิม 2D ยังอยู่ที่ `poses/`)
2. รอแอตลาส 2.5D จากคลิป 20 ตัวก่อน (JAGUAR25_CLIP_PROMPTS_TH.md · `tools/clips/jaguar25_plan.json` คัดเวลาเฟรมจาก `jaguar_plan.json` · ไฟล์แยก เช่น `assets_jaguar25.js` prefix `J25` + สวิตช์ URL ไว้เทียบ)
3. คัด spec ใหม่ `tools/clips/jaguar25_<ท่า>.json` จาก `jaguar_<ท่า>.json`: เปลี่ยน js / prefix / sheet → วัด scale ใหม่ (ขนาดดวงอาทิตย์ทองบนหัวเทียบ idle SE ของแอตลาส 2.5D) + anchors ใหม่ (เท้า · เฟรมลอยใช้สะโพกเหนือเท้าที่ต่ำที่สุด) · ลอง `tone` ใหม่หรือไม่ใช้ เพราะคลิป 2.5D อาจคมกว่าเดิม · `clean` / `erase` ถ้ามีคราบแสง
   - ตัดด้วย `python3 -I tools/sheet_state.py tools/clips/jaguar25_<ท่า>.json [preview.png]` · ท่านั่ง = โหมด `pics` เขียนทับ `assets/sit/jaguar_<ทิศ>.webp` (หรือแยกชื่อถ้ายังเก็บลุคเดิมไว้เทียบ)
4. `jaguar_pose.js` ใช้ต่อได้เลยถ้าชื่อ state เหมือนเดิม (pounce dash guard roar cast throw spin) — ไฟล์นี้ปิดตัวเองถ้าแอตลาสไม่มี state ท่าเสริม · ตรวจเหมือนรอบแรก: make() ทุกสกิล × 8 ทิศเวลาเท่าเดิม + `tools/fxlab.py hits` (FXSEED + sure hits) + herosweep / lostev / combo
5. ส่งคลิปเทียบให้เจ้าของดู (`tools/fx/jgclip.py pose1|pose2|sit`)
