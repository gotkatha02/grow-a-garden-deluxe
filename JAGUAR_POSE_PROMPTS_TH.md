# จากัวร์ (Eclipse Dancer) — ภาพท่าเสริมสำหรับบางสกิล

เจ้าของถามเมื่อ 2026-11-26 06:37 ว่า "สำหรับจากั้วต้องเจนรูปท่าทางอะไรเพิ่มไหม สำหรับใช้บางสกิลให้มันดูเข้ากัน อันนี้จะทำแค่ทิศหันมาด้านหน้าทิศเดียว ทำเป็นรูป"

ตอนนี้ sprite จากคลิป (assets_jaguar.js, JAG) มีแค่ 5 ชุดท่า คือ idle · walk · attack (ฟันมีดคู่) · buff (ชูมีดเล่มเดียวเหนือหัว) · hurt
สกิลที่ไม่ใช่การฟันเลยต้องยืมท่าพวกนี้มาใช้ ตัวอย่าง:

- Predator Drop / Sky-Pounce: ระหว่างลอยใช้เฟรม buff 2 → peak (ยืนตรงชูมีดกลางอากาศ) แล้วตามด้วยเฟรม contact ของ attack
- Countercut / Obsidian Parry: ค้างเฟรม buff 2 (ง้างมีดข้างหัว) ไม่มีท่าตั้งรับ
- Jaguar Step / Blood Chase: เล่นแถว walk เร็ว ×3.6 ทำให้ดูเหมือนเดินไถล
- Predator's Cry / Savage Tempo / Blood Moon Hunt / Shadow Veil / Moon Trap / Obsidian Seal: ใช้ buffAct (ชูมีด) ทุกท่า
- Eclipse of the Fifth Sun: ค้างท่าชูมีดอยู่ 2.6 วิ

ทุกภาพวาดในมุมเดียว คือหน้าเฉียงหันไปทางขวา (SE) เหมือนรูปยืน view_SE.webp เกมจะกลับด้านให้เองเมื่อหันซ้าย (SW / W) ส่วนตอนหันหลัง (N / NE / NW) ใช้ท่าเดิมต่อไป แบบเดียวกับท่าชาร์จของแมว

## แนบอะไร

ใช้แชท ChatGPT เดียว แนบ 3 รูปนี้ในข้อความแรก แล้ววางกล่องทีละกล่อง (ได้รูปแล้วค่อยวางกล่องต่อไป):

1. `assets/heroes/jaguar/view_SE.webp` คือรูปยืนหน้าเฉียงขวา ใช้เป็นมุมและหน้าตาที่ถูกต้อง
2. `assets/heroes/jaguar/sheet_eclipse_dancer.webp` คือ design sheet
3. `assets/loading/ld5.webp` คือภาพรอบกองไฟ ใช้เป็นสไตล์

ห้ามแนบไฟล์ .md นี้ให้ ChatGPT

## ลำดับ

| # | ท่า | ใช้กับ | ความสำคัญ |
|---|---|---|---|
| 1 | ① ท่ากระโจนแทงลง (8 เฟรม) | Predator Drop · Sky-Pounce | สำคัญ |
| 2 | ② ท่าพุ่งต่ำ (4 เฟรม) | Jaguar Step · Blood Chase · Spiral Ambush · โผล่หลัง Shadow Slip / Throne of Claws (เฟรม 4) | สำคัญ |
| 3 | ③ ท่าตั้งการ์ดไขว้มีด (4 เฟรม) | Countercut · Obsidian Parry · Obsidian Mirror | สำคัญ |
| 4 | ④ ท่าคำราม (4 เฟรม) | Predator's Cry · Savage Tempo | ดี |
| 5 | ⑤ ท่าชูมีดร่ายสุริยุปราคา (4 เฟรม) | Eclipse of the Fifth Sun (อัลติ B) · Blood Moon Hunt · Shadow Veil · Nightfall Dance / Phantom Riposte | ดี |
| 6 | ⑥ ท่าขว้าง (4 เฟรม) | Obsidian Seal · Moon Trap · Mirror Shatter | เสริม |
| 7 | ⑦ ท่าหมุนฟันรอบตัว (4 เฟรม = หมุน 1 รอบ) | Jaguar Cyclone | เสริม |
| 8 | ⑧ ท่านั่งพัก (1 รูป) | นั่งพัก (ปุ่ม Insert / 🧘) แบบแมวกับลิง | เสริม |

## กล่องพรอมต์ (ภาษาอังกฤษ วางทีละกล่อง)

### ① ท่ากระโจนแทงลง (8 เฟรม)
ใช้กับ Predator Drop · Sky-Pounce

```
2D game sprite sheet — the jaguar girl's leaping pounce with a downward double-dagger stab, 8 frames.
Use the attached pictures: her design sheet and her front three-quarter standing picture show her exact look, colors and proportions — copy them exactly; the campfire key art shows the art style only.
Style: friendly hand-painted chibi cartoon like the game, thick clean dark-brown outlines, cel shading with 2–3 flat tones, bright and warm colors. Not realistic, not painterly, not 3D.
Character: the Eclipse Dancer jaguar girl in chibi proportions (big head, small body): golden-amber fur with dark-brown jaguar rosettes, cream muzzle, big golden-amber eyes, round ears with cream insides, long glossy dark-chocolate hair with bangs in a high ponytail with a gold ring; on the right side of her head (the side shown in the standing picture) a gold spiky sun disc with a scarlet and turquoise feather fan and a small gold bell with a turquoise bead; gold hoop earrings, crimson choker, wide gold collar with turquoise stones, black crop top with crimson trim, gold armbands and wide gold wrist cuffs with turquoise, dark-brown hands, wide gold belt with an oval turquoise gem, crimson sash, layered cream-over-crimson skirt with gold step-pattern borders, crimson ankle bands, gold sandals, long spotted tail with dark rings. In every frame she holds one curved black obsidian dagger with a violet sheen and a gold crescent guard in EACH hand. Her face stays pretty and confident.
View: every frame shows her from the same front three-quarter view as the standing picture — body and face turned toward the lower right of the picture.
Layout: landscape 1536×1024, 8 frames in 2 rows of 4, read left to right, top row first. Each frame sits in its own eighth of the picture, the character the same size in every frame, her whole body (ears, ponytail, feathers, both daggers, tail and feet) inside her own area with clear empty space around it — frames never touch or overlap.
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
No effects at all: no slash trails, motion lines, speed lines, glow, sparkles, dust, cracks, impact bursts, symbols, text, numbers or frame borders — only her body and her two daggers; show the movement with the pose alone. Keep every turquoise ornament a clear sky-blue turquoise, never green.
```

### ② ท่าพุ่งต่ำ (4 เฟรม)
ใช้กับ Jaguar Step · Blood Chase · Spiral Ambush · โผล่หลัง Shadow Slip / Throne of Claws (เฟรม 4)

```
2D game sprite sheet — the jaguar girl's low sprinting dash, 4 frames.
Use the attached pictures: her design sheet and her front three-quarter standing picture show her exact look, colors and proportions — copy them exactly; the campfire key art shows the art style only.
Style: friendly hand-painted chibi cartoon like the game, thick clean dark-brown outlines, cel shading with 2–3 flat tones, bright and warm colors. Not realistic, not painterly, not 3D.
Character: the Eclipse Dancer jaguar girl in chibi proportions (big head, small body): golden-amber fur with dark-brown jaguar rosettes, cream muzzle, big golden-amber eyes, round ears with cream insides, long glossy dark-chocolate hair with bangs in a high ponytail with a gold ring; on the right side of her head (the side shown in the standing picture) a gold spiky sun disc with a scarlet and turquoise feather fan and a small gold bell with a turquoise bead; gold hoop earrings, crimson choker, wide gold collar with turquoise stones, black crop top with crimson trim, gold armbands and wide gold wrist cuffs with turquoise, dark-brown hands, wide gold belt with an oval turquoise gem, crimson sash, layered cream-over-crimson skirt with gold step-pattern borders, crimson ankle bands, gold sandals, long spotted tail with dark rings. In every frame she holds one curved black obsidian dagger with a violet sheen and a gold crescent guard in EACH hand. Her face stays pretty and confident.
View: every frame shows her from the same front three-quarter view as the standing picture — body and face turned toward the lower right of the picture.
Layout: landscape 1536×1024, 4 frames in a 2×2 grid read like a book (top-left, top-right, bottom-left, bottom-right). Each frame sits in its own quarter of the picture, the character the same size in every frame, her whole body (ears, ponytail, feathers, both daggers, tail and feet) inside her own quarter with clear empty space around it — frames never touch or overlap.
Frames:
1. Push-off: body low and leaning far forward toward the lower right, back leg pushing, front knee bent, both daggers held back behind her in a reverse grip.
2. Full dash: body very low and stretched almost flat, both arms swept back with the daggers trailing behind her, one leg reaching forward and the other stretched back, ponytail and tail streaming straight back.
3. The same full dash with the legs swapped.
4. Sliding stop: skidding to a halt in a low, wide crouch, one dagger held out behind her and the other forward, ready to strike, ponytail swinging forward.
Background: flat solid pure green #00FF00 everywhere, no gradient, no floor, no shadow under her.
No effects at all: no slash trails, motion lines, speed lines, glow, sparkles, dust, cracks, impact bursts, symbols, text, numbers or frame borders — only her body and her two daggers; show the movement with the pose alone. Keep every turquoise ornament a clear sky-blue turquoise, never green.
```

### ③ ท่าตั้งการ์ดไขว้มีด (4 เฟรม)
ใช้กับ Countercut · Obsidian Parry · Obsidian Mirror

```
2D game sprite sheet — the jaguar girl's crossed-dagger guard and parry, 4 frames.
Use the attached pictures: her design sheet and her front three-quarter standing picture show her exact look, colors and proportions — copy them exactly; the campfire key art shows the art style only.
Style: friendly hand-painted chibi cartoon like the game, thick clean dark-brown outlines, cel shading with 2–3 flat tones, bright and warm colors. Not realistic, not painterly, not 3D.
Character: the Eclipse Dancer jaguar girl in chibi proportions (big head, small body): golden-amber fur with dark-brown jaguar rosettes, cream muzzle, big golden-amber eyes, round ears with cream insides, long glossy dark-chocolate hair with bangs in a high ponytail with a gold ring; on the right side of her head (the side shown in the standing picture) a gold spiky sun disc with a scarlet and turquoise feather fan and a small gold bell with a turquoise bead; gold hoop earrings, crimson choker, wide gold collar with turquoise stones, black crop top with crimson trim, gold armbands and wide gold wrist cuffs with turquoise, dark-brown hands, wide gold belt with an oval turquoise gem, crimson sash, layered cream-over-crimson skirt with gold step-pattern borders, crimson ankle bands, gold sandals, long spotted tail with dark rings. In every frame she holds one curved black obsidian dagger with a violet sheen and a gold crescent guard in EACH hand. Her face stays pretty and confident.
View: every frame shows her from the same front three-quarter view as the standing picture — body and face turned toward the lower right of the picture.
Layout: landscape 1536×1024, 4 frames in a 2×2 grid read like a book (top-left, top-right, bottom-left, bottom-right). Each frame sits in its own quarter of the picture, the character the same size in every frame, her whole body (ears, ponytail, feathers, both daggers, tail and feet) inside her own quarter with clear empty space around it — frames never touch or overlap.
Frames:
1. Raising her guard: feet apart, knees bent, both daggers coming up in front of her chest.
2. Guard: both daggers crossed in an X in front of her chest and chin, blades pointing up, elbows out, knees bent, sharp eyes looking over the crossed blades.
3. The same guard a moment later, almost identical — shoulders a little lower, tail and ponytail swayed the other way — so frames 2 and 3 can loop.
4. Deflect: arms snapping apart outward, both daggers swept out to the sides, body leaning forward, ready to counterattack.
Background: flat solid pure green #00FF00 everywhere, no gradient, no floor, no shadow under her.
No effects at all: no slash trails, motion lines, speed lines, glow, sparkles, dust, cracks, impact bursts, symbols, text, numbers or frame borders — only her body and her two daggers; show the movement with the pose alone. Keep every turquoise ornament a clear sky-blue turquoise, never green.
```

### ④ ท่าคำราม (4 เฟรม)
ใช้กับ Predator's Cry · Savage Tempo

```
2D game sprite sheet — the jaguar girl's war cry (a jaguar roar), 4 frames.
Use the attached pictures: her design sheet and her front three-quarter standing picture show her exact look, colors and proportions — copy them exactly; the campfire key art shows the art style only.
Style: friendly hand-painted chibi cartoon like the game, thick clean dark-brown outlines, cel shading with 2–3 flat tones, bright and warm colors. Not realistic, not painterly, not 3D.
Character: the Eclipse Dancer jaguar girl in chibi proportions (big head, small body): golden-amber fur with dark-brown jaguar rosettes, cream muzzle, big golden-amber eyes, round ears with cream insides, long glossy dark-chocolate hair with bangs in a high ponytail with a gold ring; on the right side of her head (the side shown in the standing picture) a gold spiky sun disc with a scarlet and turquoise feather fan and a small gold bell with a turquoise bead; gold hoop earrings, crimson choker, wide gold collar with turquoise stones, black crop top with crimson trim, gold armbands and wide gold wrist cuffs with turquoise, dark-brown hands, wide gold belt with an oval turquoise gem, crimson sash, layered cream-over-crimson skirt with gold step-pattern borders, crimson ankle bands, gold sandals, long spotted tail with dark rings. In every frame she holds one curved black obsidian dagger with a violet sheen and a gold crescent guard in EACH hand. Her face stays pretty and confident.
View: every frame shows her from the same front three-quarter view as the standing picture — body and face turned toward the lower right of the picture.
Layout: landscape 1536×1024, 4 frames in a 2×2 grid read like a book (top-left, top-right, bottom-left, bottom-right). Each frame sits in its own quarter of the picture, the character the same size in every frame, her whole body (ears, ponytail, feathers, both daggers, tail and feet) inside her own quarter with clear empty space around it — frames never touch or overlap.
Frames:
1. Drawing breath: shoulders hunched, head down, both daggers held low and back, knees bent.
2. Roar: chest out, head tilted back, mouth wide open showing small fangs, eyes narrowed fiercely, both arms flung wide and low to the sides with the daggers pointing outward, tail raised high, ponytail flying.
3. The same roar a moment later, a little stronger — shoulders pulled back further, hair and feathers blown back — so frames 2 and 3 can alternate.
4. Settling: mouth closing into a confident fanged smirk, arms lowering, back in a ready stance.
She stays pretty even while roaring.
Background: flat solid pure green #00FF00 everywhere, no gradient, no floor, no shadow under her.
No effects at all: no slash trails, motion lines, speed lines, glow, sparkles, dust, cracks, impact bursts, symbols, text, numbers or frame borders — only her body and her two daggers; show the movement with the pose alone. Keep every turquoise ornament a clear sky-blue turquoise, never green.
```

### ⑤ ท่าชูมีดร่ายสุริยุปราคา (4 เฟรม)
ใช้กับ Eclipse of the Fifth Sun (อัลติ B) · Blood Moon Hunt · Shadow Veil · Nightfall Dance / Phantom Riposte

```
2D game sprite sheet — the jaguar girl summoning an eclipse spell with both arms raised to the sky, 4 frames.
Use the attached pictures: her design sheet and her front three-quarter standing picture show her exact look, colors and proportions — copy them exactly; the campfire key art shows the art style only.
Style: friendly hand-painted chibi cartoon like the game, thick clean dark-brown outlines, cel shading with 2–3 flat tones, bright and warm colors. Not realistic, not painterly, not 3D.
Character: the Eclipse Dancer jaguar girl in chibi proportions (big head, small body): golden-amber fur with dark-brown jaguar rosettes, cream muzzle, big golden-amber eyes, round ears with cream insides, long glossy dark-chocolate hair with bangs in a high ponytail with a gold ring; on the right side of her head (the side shown in the standing picture) a gold spiky sun disc with a scarlet and turquoise feather fan and a small gold bell with a turquoise bead; gold hoop earrings, crimson choker, wide gold collar with turquoise stones, black crop top with crimson trim, gold armbands and wide gold wrist cuffs with turquoise, dark-brown hands, wide gold belt with an oval turquoise gem, crimson sash, layered cream-over-crimson skirt with gold step-pattern borders, crimson ankle bands, gold sandals, long spotted tail with dark rings. In every frame she holds one curved black obsidian dagger with a violet sheen and a gold crescent guard in EACH hand. Her face stays pretty and confident.
View: every frame shows her from the same front three-quarter view as the standing picture — body and face turned toward the lower right of the picture.
Layout: landscape 1536×1024, 4 frames in a 2×2 grid read like a book (top-left, top-right, bottom-left, bottom-right). Each frame sits in its own quarter of the picture, the character the same size in every frame, her whole body (ears, ponytail, feathers, both daggers, tail and feet) inside her own quarter with clear empty space around it — frames never touch or overlap.
Frames:
1. Gathering power: both daggers crossed in front of her chest, eyes half closed, knees soft.
2. Raising: both arms sweeping up past her face.
3. Summoning: both arms stretched straight up, the two daggers crossed in an X high above her head, body arched slightly back, face looking up, ponytail, feathers and skirt lifting as if in a rising wind, feet together.
4. The same summoning pose a moment later, almost identical — ponytail and skirt drifting the other way — so frames 3 and 4 can loop.
Background: flat solid pure green #00FF00 everywhere, no gradient, no floor, no shadow under her.
No effects at all: no slash trails, motion lines, speed lines, glow, sparkles, dust, cracks, impact bursts, symbols, text, numbers or frame borders — only her body and her two daggers; show the movement with the pose alone. Keep every turquoise ornament a clear sky-blue turquoise, never green.
```

### ⑥ ท่าขว้าง (4 เฟรม)
ใช้กับ Obsidian Seal · Moon Trap · Mirror Shatter

```
2D game sprite sheet — the jaguar girl's overhand throw, 4 frames.
Use the attached pictures: her design sheet and her front three-quarter standing picture show her exact look, colors and proportions — copy them exactly; the campfire key art shows the art style only.
Style: friendly hand-painted chibi cartoon like the game, thick clean dark-brown outlines, cel shading with 2–3 flat tones, bright and warm colors. Not realistic, not painterly, not 3D.
Character: the Eclipse Dancer jaguar girl in chibi proportions (big head, small body): golden-amber fur with dark-brown jaguar rosettes, cream muzzle, big golden-amber eyes, round ears with cream insides, long glossy dark-chocolate hair with bangs in a high ponytail with a gold ring; on the right side of her head (the side shown in the standing picture) a gold spiky sun disc with a scarlet and turquoise feather fan and a small gold bell with a turquoise bead; gold hoop earrings, crimson choker, wide gold collar with turquoise stones, black crop top with crimson trim, gold armbands and wide gold wrist cuffs with turquoise, dark-brown hands, wide gold belt with an oval turquoise gem, crimson sash, layered cream-over-crimson skirt with gold step-pattern borders, crimson ankle bands, gold sandals, long spotted tail with dark rings. In every frame she holds one curved black obsidian dagger with a violet sheen and a gold crescent guard in EACH hand. Her face stays pretty and confident.
View: every frame shows her from the same front three-quarter view as the standing picture — body and face turned toward the lower right of the picture.
Layout: landscape 1536×1024, 4 frames in a 2×2 grid read like a book (top-left, top-right, bottom-left, bottom-right). Each frame sits in its own quarter of the picture, the character the same size in every frame, her whole body (ears, ponytail, feathers, both daggers, tail and feet) inside her own quarter with clear empty space around it — frames never touch or overlap.
Frames:
1. Wind-up: body turned back, the arm nearest to us drawn back behind her head, the other dagger held at her chest, weight on the back foot.
2. Throw: that arm snapped forward and down toward the lower right in a flicking throw, body leaning forward, weight on the front foot.
3. Follow-through: the throwing arm swung low across her body, eyes following where the throw went.
4. Back to a ready stance, daggers held low.
Her hands keep their daggers the whole time; do not draw the thrown object — the game adds it.
Background: flat solid pure green #00FF00 everywhere, no gradient, no floor, no shadow under her.
No effects at all: no slash trails, motion lines, speed lines, glow, sparkles, dust, cracks, impact bursts, symbols, text, numbers or frame borders — only her body and her two daggers; show the movement with the pose alone. Keep every turquoise ornament a clear sky-blue turquoise, never green.
```

### ⑦ ท่าหมุนฟันรอบตัว (4 เฟรม = หมุน 1 รอบ)
ใช้กับ Jaguar Cyclone

```
2D game sprite sheet — the jaguar girl's spinning blade dance, 4 frames = one full turn in place.
Use the attached pictures: her design sheet and her front three-quarter standing picture show her exact look, colors and proportions — copy them exactly; the campfire key art shows the art style only.
Style: friendly hand-painted chibi cartoon like the game, thick clean dark-brown outlines, cel shading with 2–3 flat tones, bright and warm colors. Not realistic, not painterly, not 3D.
Character: the Eclipse Dancer jaguar girl in chibi proportions (big head, small body): golden-amber fur with dark-brown jaguar rosettes, cream muzzle, big golden-amber eyes, round ears with cream insides, long glossy dark-chocolate hair with bangs in a high ponytail with a gold ring; on the right side of her head (the side shown in the standing picture) a gold spiky sun disc with a scarlet and turquoise feather fan and a small gold bell with a turquoise bead; gold hoop earrings, crimson choker, wide gold collar with turquoise stones, black crop top with crimson trim, gold armbands and wide gold wrist cuffs with turquoise, dark-brown hands, wide gold belt with an oval turquoise gem, crimson sash, layered cream-over-crimson skirt with gold step-pattern borders, crimson ankle bands, gold sandals, long spotted tail with dark rings. In every frame she holds one curved black obsidian dagger with a violet sheen and a gold crescent guard in EACH hand. Her face stays pretty and confident.
View: the four frames are one full turn in place; in every frame her feet stay on the same spot, both arms are stretched out wide to the sides with a dagger in each hand, blades pointing outward, and her skirt, ponytail and tail flare out from the spin.
Layout: landscape 1536×1024, 4 frames in a 2×2 grid read like a book (top-left, top-right, bottom-left, bottom-right). Each frame sits in its own quarter of the picture, the character the same size in every frame, her whole body (ears, ponytail, feathers, both daggers, tail and feet) inside her own quarter with clear empty space around it — frames never touch or overlap.
Frames:
1. Front view, facing us.
2. Side view, facing the right of the picture.
3. Back view: we see her ponytail, the back of the feather fan and her tail.
4. Side view, facing the left of the picture.
Background: flat solid pure green #00FF00 everywhere, no gradient, no floor, no shadow under her.
No effects at all: no slash trails, motion lines, speed lines, glow, sparkles, dust, cracks, impact bursts, symbols, text, numbers or frame borders — only her body and her two daggers; show the movement with the pose alone. Keep every turquoise ornament a clear sky-blue turquoise, never green.
```

### ⑧ ท่านั่งพัก (1 รูป)
ใช้กับ นั่งพัก (ปุ่ม Insert / 🧘) แบบแมวกับลิง

```
2D game sprite — the jaguar girl sitting down to rest, 1 picture.
Use the attached pictures: her design sheet and her front three-quarter standing picture show her exact look, colors and proportions — copy them exactly; the campfire key art shows the art style only.
Style: friendly hand-painted chibi cartoon like the game, thick clean dark-brown outlines, cel shading with 2–3 flat tones, bright and warm colors. Not realistic, not painterly, not 3D.
Character: the Eclipse Dancer jaguar girl in chibi proportions (big head, small body): golden-amber fur with dark-brown jaguar rosettes, cream muzzle, big golden-amber eyes, round ears with cream insides, long glossy dark-chocolate hair with bangs in a high ponytail with a gold ring; on the right side of her head (the side shown in the standing picture) a gold spiky sun disc with a scarlet and turquoise feather fan and a small gold bell with a turquoise bead; gold hoop earrings, crimson choker, wide gold collar with turquoise stones, black crop top with crimson trim, gold armbands and wide gold wrist cuffs with turquoise, dark-brown hands, wide gold belt with an oval turquoise gem, crimson sash, layered cream-over-crimson skirt with gold step-pattern borders, crimson ankle bands, gold sandals, long spotted tail with dark rings. Her two daggers lie crossed on the ground in front of her. Her face stays pretty and confident.
View: every frame shows her from the same front three-quarter view as the standing picture — body and face turned toward the lower right of the picture.
Layout: square 1024×1024, one picture, her whole body in the middle with clear empty space around it.
Frames:
1. She sits on the ground: legs folded to one side, hands resting on her knees, the two daggers laid crossed on the ground in front of her, tail curled around her, relaxed happy smile, eyes open.
Background: flat solid pure green #00FF00 everywhere, no gradient, no floor, no shadow under her.
No effects at all: no slash trails, motion lines, speed lines, glow, sparkles, dust, cracks, impact bursts, symbols, text, numbers or frame borders — only her body and her two daggers; show the movement with the pose alone. Keep every turquoise ornament a clear sky-blue turquoise, never green.
```

## พอได้รูปแล้วทำต่อยังไง (แผนสำหรับแชทที่ต่อจากนี้)

1. ตัดแต่ละแผ่นด้วย `python3 -I tools/sheet_state.py tools/clips/jaguar_<ท่า>.json [preview.png]` (ใช้แบบเดียวกับ cat_charge / wukong_jump / hippo_jump)
   - js `assets_jaguar.js`, prefix `JAG`, state `pounce` / `dash` / `guard` / `roar` / `cast` / `throw` / `spin`
   - rows / cols 2×4 (ท่ากระโจน) หรือ 2×2
   - scale: ให้ความสูงหัวและตัวเท่ากับ idle SE (ประมาณ 229 cell px)
   - anchors: เฟรมที่ลอยกลางอากาศใช้เท้าข้างที่ต่ำที่สุด เพราะเกมยกตัวด้วย player.z อยู่แล้ว
   - dirs: S SE E NE N
   - ห้ามเปลี่ยนเวลาของแถว attack / buff เดิม
2. เปลี่ยนเฉพาะเฟรมที่โชว์ โดยความยาวรวมและเวลาของทุก event ต้องเท่าเดิม (ตรวจด้วย `tools/fxlab.py hits` ใช้ FXSEED + sure hits)
   - Predator Drop / Sky-Pounce: crouch → take-off … dive ไล่ตามช่วงลอย (dashUpd) ส่วนเฟรม landing stab ให้ค้างตรง contact
   - Jaguar Step / Blood Chase / Spiral Ambush: ใช้ dash 1–3 แทนแถว walk ส่วนเฟรม 4 ใช้ตอนหยุด
   - Countercut / Parry: guard 1 → ลูป 2–3 แล้วใช้ deflect ตอนปัดสำเร็จ
   - Cry / Tempo: roar 1 → ลูป 2–3 → 4
   - Fifth Sun: cast 1–2 ระหว่างร่าย แล้วลูป 3–4 ตลอดช่วงค้าง
3. ใช้เมื่อหันหน้า S / SE / E / SW / W เท่านั้น (SE หรือ SW เลือกตามด้านซ้ายขวา) ถ้าหันหลังให้ใช้เฟรมเดิม
   - ท่านั่ง: ใส่ในตาราง SIT ของ hero_sit.js ใช้รูปเดียวกันทุกทิศ
   - ท่าหมุน: ใช้วน 4 เฟรมแทนการหมุนผ่านเฟรม attack ใน mkJgCyclone
4. ใส่ `?jgpose=0` ไว้ดูท่าเดิมเทียบ แล้วส่งคลิปเทียบให้เจ้าของดู

## สร้างแล้ว (2026-11-26)

เจ้าของส่งรูปมาครบ 8 แผ่น (07:13–07:14 · ท่านั่งขอเป็น 8 มุม) — เก็บรูปดิบไว้ที่ `assets/heroes/jaguar/poses/<ท่า>.webp`

| ท่า (state ในแอตลาส) | เฟรม | ใช้กับสกิล |
|---|---|---|
| pounce (8) | หมอบ · ถีบตัว · ลอยขึ้นชูมีด · พุ่งเฉียง · ดิ่งแทง · ลงพื้นมีดปักดิน · ลุก · พร้อม | Predator Drop, Sky-Pounce (หมอบช่วงก่อนกระโดด), Throne of Claws (หมอบก่อนหายตัว + ตอนร่าย) |
| dash (4) | ย่อตัว · ก้าวพุ่ง · ก้าวพุ่งอีกขา · สไลด์หยุด | Jaguar Step, Blood Chase, Shadow Slip (สไลด์หยุด), Throne (ร่างเงาตอนฟันวาร์ป + สไลด์ตอนโผล่) |
| guard (4) | ยกมีด · ไขว้มีด · ไขว้มีด (หายใจ) · กางมีดปัด | Countercut, Obsidian Parry (ไขว้สลับ 2-3 · ปัด/สวนสำเร็จ = 4), Obsidian Mirror, Throne (ท้ายท่า) |
| roar (4) | ย่อตัว · คำรามกางแขน · คำรามสุดเสียง · ผ่อนลง | Predator's Cry, Savage Tempo, Hunter's Focus (ท่าย่อตัวจ้อง) |
| cast (4) | หลับตาไขว้มีด · ชูมีด · ชูมีดเหนือหัว · ค้าง | Hunter's Focus (หลับตา), Blood Moon Hunt, Shadow Veil, Nightfall Dance, Phantom Riposte, Eclipse of the Fifth Sun (สลับ 3-4 ตลอดช่วงค้าง), ตอนร่าย (แถบร่าย) ของ Fifth Sun / Blood Moon Hunt / Spirit |
| throw (4) | เงื้อ · ขว้าง · ส่งแขน · กลับท่า | Obsidian Seal, Moon Trap, Mirror Shatter |
| spin (4) | หน้า · ข้างขวา · หลัง · ข้างซ้าย | Jaguar Cyclone (หมุน 1 รอบต่อการโดน 1 ครั้ง ตามเข็มนาฬิกาบนจอ เริ่มจากทิศที่หันอยู่ ใช้ได้ทุกทิศ) |
| sit (8 ทิศ) | นั่งคุกเข่า วางมีดไขว้ไว้ข้างหน้า | ปุ่ม Insert / ปุ่ม 🧘 บนมือถือ (hero_sit.js) + สถานะ "นั่งพัก ×2" |

- ตัดด้วย `python3 -I tools/sheet_state.py tools/clips/jaguar_<ท่า>.json [preview.png]` (ไฟล์ spec บอกเฟรม จุดยึด สเกล ไว้ครบ) — ท่านั่ง `tools/clips/jaguar_sit.json` (โหมด pics เขียนรูปแยก `assets/sit/jaguar_<ทิศ>.webp`)
- สเกล = จับขนาดดวงอาทิตย์ทองบนหัวให้เท่าท่ายืน (idle SE) · `clean` = ลบคราบแสงเขียว/เหลืองที่ ChatGPT ทิ้งไว้บนตัว · `tone` = ทำให้สี/ความคมใกล้เฟรมคลิป
- ผูกท่ากับสกิลใน `jaguar_pose.js`: เปลี่ยนแค่เฟรมที่โชว์ ความยาวท่า เวลาตี เวลาพุ่ง event ทุกอันเท่าเดิม (ตรวจแล้ว: make() ทุกสกิล × 8 ทิศ ตรงกันหมด · `tools/fxlab.py hits` 21 สกิลเหมือนเดิมทุกตัว · herosweep / lostev / combo ไม่มี error)
- ท่าที่วาดเป็นมุมเดียว (หันขวาเฉียงหน้า) ใช้เมื่อหันหน้า S / SE / E / SW / W เท่านั้น (ฝั่งซ้ายใช้ภาพกลับด้าน) — หันหลัง N / NE / NW ยังใช้เฟรมเดิม
- `?jgpose=0` = ท่าเดิม (ไว้เทียบ) · คลิปเทียบ: `DSF=1.5 python3 tools/fx/jgclip.py pose1|pose2|sit ['&jgpose=0']`
- ยังไม่ได้ทำ: ท่ามุมหลัง (ถ้าอยากให้ครบทุกทิศ ต้องเจนแผ่นมุมหลังเพิ่ม), Spiral Ambush ยังใช้ท่าฟันเดิม (จังหวะฟันผูกกับเฟรม)
