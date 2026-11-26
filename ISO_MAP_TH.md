# แมพ 2.5D isometric แบบ Ragnarok 3 — ตัวอย่างโซนหิมะ (2026-11-26)

เจ้าของ: "อยากเปลี่ยนสไตล์แผนที่เป็น 2.5d isometric แบบ RAGnarok3 ลองทำแมพโซนหิมะเป็นตัวอย่างก่อนได้ไหม ต้องทำยังไงถึงจะสวยๆ" → "น่าจะต้องเจนภาพชุดใหม่เลยนะ"

สถานะ: **ส่งพรอมต์แล้ว รอรูป** — ในเกมยังไม่เปลี่ยนอะไร

## 1. ทำไมแมพตอนนี้ยังไม่เหมือน RO3
- RO3 = ฉาก 3D ที่เรนเดอร์ให้ดูเหมือนวาดมือ มองจากกล้องสูงตายตัว (หาข่าวแล้ว ดูหัวข้อ 'ลอง 2.5D แบบ Ragnarok 3' ใน WOLF_LOOK_PROMPTS_TH.md)
- แมพเรา = ลายพื้นแบนปูซ้ำ + รูปของตั้งวางทับ → ไม่มีความสูง ไม่มีชั้นดิน
- ภาพของแต่ละชิ้นวาดคนละมุม คนละแสง และหันหน้าตรง (ถนน กำแพงขนานขอบจอ)
- ฮีโร่กำลังเปลี่ยนเป็นลุค 2.5D (หมาป่า แรด จากัวร์ ในแชตอื่น: โมเดล 3D เส้นขอบวาดมือ แสงซ้ายบน) → แมพต้องเป็นลุคเดียวกัน

## 2. สูตรให้สวย
1. **มุมกล้องเดียวทุกรูป:** โลกหมุน 45° (ถนน กำแพง หน้าผา รั้ว วิ่งทแยง · บ้านเห็น 2 ผนัง + หลังคา) กล้องมองลง ~38° = ค่า K 0.62 ของเกม (วงกลมบนพื้นเป็นวงรีกว้าง 1.6 เท่าของสูง) ไม่มีเพอร์สเปกทีฟ · ภาพไกด์ `tools/ref/iso_camera_guide.jpg` (ทำด้วย `python3 -I tools/iso_guide.py`: ตารางพื้น กล่องสีเทา บ้าน ที่ราบสูงมีบันได ต้นสน รั้ว 2 ทิศ วงกลมบนพื้น + หมาป่า / แรด 2.5D ขนาดจริงในเกม)
2. **ลุคเดียวกับฮีโร่ 2.5D:** มีมิติ เงาการ์ตูน 2–3 โทน แสงอุ่นซ้ายบน ด้านเงาฟ้าเย็น เงาตกขวาล่าง เส้นขอบน้ำตาลเข้มบางๆ แนบ `assets/heroes/wolf/view25_SE.webp` (ส่งเป็น style_ref_wolf25.jpg) · **ไม่แนบภาพแคมป์ไฟ** (มันจะดึงกลับไปเป็นภาพวาด 2D แบน)
3. **พื้นมีความสูง:** ที่ราบสูงหน้าผาหิน บันไดหินแกะ บ่อน้ำแข็ง ผาขอบแมพ → ตาอ่านเป็น 3D
4. **พื้นทั้งผืนเป็นรูปเดียว + ของตั้งเป็นชิ้นแยก** (แบบลานบอสโลก): ตัวละครเดินอ้อมหลังต้นไม้ / บ้านได้ · เงาของตั้ง เกมทำเอง (cfg.lit เงาตกขวาล่างตามแสง)
5. **บรรยากาศในเกม:** หิมะตก หมอกบาง แสงอุ่นจากหน้าต่าง / กองไฟตัดกับหิมะฟ้า

ความสูงในรูปแบนทำงานได้: ตำแหน่งในรูป = ตำแหน่งในเกม · ตัวละครยืนได้เฉพาะพื้นที่มองเห็น (หลังที่ราบสูงที่ถูกบังไม่มีในรูป) → ไม่มีปัญหาบังผิด · ต้องกันเดินที่หน้าผา + ขอบหลังของที่ราบ (blockLines) เปิดเฉพาะบันได

## 3. แมพตัวอย่าง "Frostpine Hollow / ป่าสนหิมะ" (ทดสอบอย่างเดียว)
- รูปพื้น 1536×1024 → ขยาย ~×1.5 (เลือกจริงหลังวัดขนาดประตู / ฮีโร่ในรูป) ≈ 2,300 × 1,540 map px ≈ 2–3 จอ เท่าลานบอสโลก
- ซ้ายบน: ที่ราบสูงหินมีหิมะ + บันไดหินลงกลางแมพ · บนที่ราบ: บ้านยาวไวกิ้ง + หอระวัง
- ขอบบน: ผาหินหิมะ + ป่าสนทึบ (ปิดแมพ) · กลาง: ทุ่งหิมะโล่ง (ที่สู้) + ทางหิมะอัดวิ่งทแยงซ้ายล่าง → ขวาบน
- ขวา: บ่อน้ำแข็งร้าว · กลางซ้าย: ค่ายนายพราน (เต็นท์ กองไฟ เลื่อน ฟืน) · ขอบ: สน เบิร์ช หิน หินรูน รั้ว · ขวาล่าง: ขอบผาลงหุบหมอก
- ในเกม: `?map=isoSnow` ในโหมดทดสอบ (ไม่มีวาร์ปเข้า) · แมพเดิมไม่แตะ

## 4. รูปที่ต้องเจน 5 รูป (แชต ChatGPT เดียวกันทั้งหมด · ส่งทีละกล่อง)
- กล่อง ① แนบ 2 รูป: `iso_camera_guide.jpg` + `style_ref_wolf25.jpg`
- ① ภาพลองลุค (ฉากเต็ม ไม่มีตัวละคร) → ส่งให้ผมดูก่อน ผมแปะฮีโร่จริงลงไปให้ดูขนาด · ผ่านแล้วค่อยส่ง ②–⑤ ในแชตเดิม
- ② พื้นล้วน · ③ ต้นไม้ 6 (พื้นบานเย็น) · ④ หิน / น้ำแข็ง / ของเล็ก 6 (พื้นเขียว) · ⑤ ค่ายไวกิ้ง 6 (พื้นเขียว)

**① ภาพลองลุค**
```
Draw ONE finished game-scene picture of a map from my 2.5D fantasy MMORPG, as the player would see it — no characters, no animals, no UI, no text.

LOOK: a stylized 3D game world rendered to look hand-painted, exactly the rendering of the attached 2.5D wolf hero: every rock, cliff, snow drift, tree and building has solid rounded 3D volume; soft toon shading in 2–3 tones that follows the forms; one warm golden key light from the upper left, soft cool-blue shadow sides, soft shadows falling to the lower right; thin clean dark-brown hand-drawn outlines on the main shapes; matte painted textures that read clearly (soft powdery snow, rough grey stone, weathered wood, pine needles); warm, slightly retro storybook colours with clean white snow. Not photorealistic, not glossy plastic, not a flat 2D drawing, not pixel art, no blur, no depth of field.

CAMERA: copy the camera of the attached grey guide picture — copy only its angle and sizes, never its grid lines, grey blocks or colours. A fixed high isometric game camera looking down at about 38 degrees with the whole world turned 45 degrees: paths, cliff edges, walls and fences run diagonally across the picture, every building shows two walls and its roof, a round thing on the ground is an ellipse 1.6 times wider than tall; no perspective (far things are not smaller), no fisheye. Size: a hero would be about 40 pixels tall (the little figures on the guide), a house door about 50 pixels, a big pine about 220 pixels.

SCENE — Frostpine Hollow, a Viking snow valley on a sunny winter afternoon:
• Upper left: a raised plateau of layered grey rock about twice a hero's height, its flat top covered in snow; its two front cliff faces (one facing lower left, one facing lower right) have icicles. A wide carved stone stairway with snow on the steps comes down its lower-right face toward the middle of the picture. On the plateau: a small Viking longhouse (log walls, stone footing, steep wooden-shingle roof heavy with snow, carved dragon heads on the gable ends, warm light in a small window) and a wooden watchtower.
• Along the top edge: a wall of steep snowy rock cliffs and dark snow-dusted pine forest, closing the map.
• Middle: a wide open snowfield with soft drifts and footprints — keep it clear and roomy, players fight here. A trampled path of packed snow with a few flat stepping stones runs diagonally from the bottom-left corner to the top-right corner, with a branch to the stairway.
• Right: a frozen pond with pale blue cracked ice and snowy banks, a few blue ice crystals on the bank.
• Middle left, beside the path: a hunters' camp — a round hide tent, a stone campfire ring with logs and a small calm fire, a wooden sled with two crates, stacked firewood.
• Around the edges: snowy pines alone and in clumps, a bare frosted birch, snow-capped boulders, a carved Viking runestone by the path (a knotwork band and plain angular marks, no letters), short wooden fences along the path.
• Lower right corner: the snowfield ends at a rocky cliff edge dropping into a misty valley. Lower left: the path comes in between pines.

FORMAT: 1536×1024 landscape; the scene fills the whole picture to every edge (no frame, no border, no vignette, no sky). Never any text, letters, numbers, logo or UI.
```

**② พื้นล้วน**
```
Now draw the GROUND ONLY of the same map — the map picture you drew earlier in this chat (or the attached one): the same camera, size, light, colours and layout, but with every standing object removed: no trees, no stumps, no boulders, no ice crystals, no buildings, no watchtower, no tent, no campfire, no sled, no firewood, no fences, no runestone. Where they stood, continue the snow and ground naturally — no holes, no leftover shadows. Keep everything that is the land itself: the snowfields, drifts and footprints, the packed-snow path and its flat stepping stones, the raised rock plateau with its cliff faces, icicles and the carved stone stairway, the frozen pond with its cracks and snowy banks, the cliff walls along the top edge, the cliff edge and misty valley in the lower right, and small flat details (pebbles, fallen pine needles, twigs).

LOOK: the same stylized 3D game world rendered to look hand-painted: solid rounded 3D volume on the cliffs, plateau and snow drifts, soft toon shading in 2–3 tones, one warm golden light from the upper left with soft cool-blue shadows falling to the lower right, thin clean dark-brown hand-drawn outlines on the main shapes, matte painted textures, warm slightly retro storybook colours. Not photorealistic, not a flat 2D drawing, not pixel art, no blur.

CAMERA: the same fixed high isometric game camera — about 38 degrees down, the world turned 45 degrees so the path and cliff edges run diagonally, no perspective.

FORMAT: 1536×1024 landscape, filling the picture to every edge, no frame, no vignette. Never any text, letters, logo, characters or UI.
```

**③ ต้นไม้ 6 ต้น (พื้นบานเย็น)**
```
Draw SIX separate trees for the same snowy map, rendered exactly like the trees in the map picture from earlier in this chat (or the attached one): a stylized 3D game look painted by hand — solid rounded volume, soft toon shading in 2–3 tones, one warm golden light from the upper left with soft cool-blue shadow sides, thin clean dark-brown hand-drawn outlines, matte painted textures, warm slightly retro storybook colours. Not photorealistic, not flat 2D, not pixel art.

Seen from the same high isometric game camera (about 38 degrees down, no perspective): we look a little down onto the snowy branches.

The six trees: (1) a tall Viking pine, deep teal-green needles in layered tiers heavy with white snow; (2) a medium snowy pine; (3) a young snowy pine about twice a person's height; (4) a clump of three snowy pines growing together, one tall and two smaller; (5) a bare frosted birch with white bark and dark marks, no leaves, snow on its branches; (6) a broken dead pine trunk with a few bare branches and snow on top.

SHEET: 1536×1024, a 3×2 grid, one tree per cell, centred, as big as the cell allows with empty space all round; each tree stands with the bottom of its trunk at the bottom of the tree; no ground, no snow mound under it, no cast shadow. Background: solid flat pure magenta (#FF00FF), no gradient — never use magenta or pink on the trees (the snow is white with cool blue shadows). No text, letters or logo.
```

**④ หิน น้ำแข็ง ของเล็ก 6 ชิ้น (พื้นเขียว)**
```
Draw SIX separate objects for the same snowy map, rendered exactly like the map picture from earlier in this chat (or the attached one): a stylized 3D game look painted by hand — solid rounded volume, soft toon shading in 2–3 tones, one warm golden light from the upper left with soft cool-blue shadow sides, thin clean dark-brown hand-drawn outlines, matte painted textures, warm slightly retro storybook colours. Not photorealistic, not flat 2D, not pixel art.

Seen from the same high isometric game camera (about 38 degrees down, the world turned 45 degrees, no perspective).

The six objects: (1) a big grey boulder with a thick snow cap, about as tall as a person; (2) a cluster of three smaller snow-capped rocks; (3) a tall carved Viking runestone of grey granite with a knotwork band and plain angular marks (no letters), snow on its top; (4) a cluster of pale blue ice crystals growing out of the ground, slightly translucent; (5) a wooden sled loaded with two crates and a rolled fur, snow on top; (6) a neat stack of chopped firewood logs with snow on top.

SHEET: 1536×1024, a 3×2 grid, one object per cell, centred, as big as the cell allows with empty space all round, standing with its base at the bottom; no ground, no snow mound under it, no cast shadow. Background: solid flat pure green (#00FF00), no gradient — never use green on the objects. No text, letters or logo.
```

**⑤ ค่ายไวกิ้ง 6 ชิ้น (พื้นเขียว)**
```
Draw SIX separate objects for the same snowy map, rendered exactly like the buildings and camp in the map picture from earlier in this chat (or the attached one): a stylized 3D game look painted by hand — solid rounded volume, soft toon shading in 2–3 tones, one warm golden light from the upper left with soft cool-blue shadow sides, thin clean dark-brown hand-drawn outlines, matte painted textures, warm slightly retro storybook colours. Not photorealistic, not flat 2D, not pixel art.

Seen from the same high isometric game camera (about 38 degrees down, the world turned 45 degrees, no perspective): buildings show two walls and the roof.

The six objects: (1) a small Viking longhouse seen from its front corner — the left wall with a round-topped wooden door big enough for a person, the right wall with a small shuttered window glowing warm, log walls on a stone footing, a steep wooden-shingle roof heavy with snow, carved dragon heads on the gable ends; (2) a wooden watchtower on four log legs with a ladder and a small snowy roof; (3) a round hide tent with poles sticking out of the top and a fur door flap; (4) a stone campfire ring with logs, a small calm fire and a little iron cooking pot on a tripod; (5) a short wooden fence of four posts and two rails with snow on top, running from lower left to upper right; (6) the same fence running from upper left to lower right.

SHEET: 1536×1024, a 3×2 grid, one object per cell, centred, as big as the cell allows with empty space all round, standing with its base at the bottom; no ground, no snow mound under it, no cast shadow. Background: solid flat pure green (#00FF00), no gradient — never use green on the objects (no moss, no grass roofs). No text, letters or logo.
```

**ประโยคแก้รูป (ต่อท้ายแล้วส่งในแชตเดิม)**
- ไม่ทแยง / กล้องต่ำ → `Redo: the same picture with the isometric camera of the grey guide — the world turned 45 degrees so paths and walls run diagonally, seen from higher above.`
- แบนเหมือนภาพวาด 2D → `Redo: make it look more like a 3D game world — stronger rounded volume and soft 3D shading on the rocks, snow and trees, keep the hand-drawn outlines.`
- เหมือนจริง / มันวาวไป → `Redo: less realistic — matte painted textures, simple soft toon shading, clean hand-drawn outlines.`
- ลอกเส้นตารางของไกด์มา → `Redo without any grid lines on the ground.`
- ของใหญ่ / เล็กไป → `Redo: everything smaller (bigger) — a person would be about 40 pixels tall and a door about 50 pixels.`
- อยากได้ถนนตรงแบบเดิม (ไม่หมุน 45°) → `Redo with the world NOT turned: paths and walls run straight left-right and up-down, buildings show their front wall.`
- รูปพื้นยังมีของตั้งเหลือ → `Remove every remaining tree, rock, tent, fence and building; keep only the ground.`

## 5. ตอนรูปมา (ยังไม่ได้ทำ)
- `tools/iso_snow.py` แบบเดียวกับ `tools/wboss_arenas.py`: ตัดแผ่น ③–⑤ (คีย์บานเย็น / เขียว แบ่ง 3×2) → `maps/iso/*.webp` · เขียน `maps/iso-snow.js` (VK_CAT ชิ้น + VK_MAPS.isoSnow) — แก้ตัวเลขในเครื่องมือ ไม่แก้ .js
- ขนาด: วัดประตูบ้าน / ขั้นบันไดในรูป → เลือกตัวคูณให้ฮีโร่สูง ~38–43 px ในรูป (ประตู ≥ ฮีโร่ใหญ่สุด 64 map px)
- พื้นที่เดิน: cfg.walk (ทุ่ง ทาง บนที่ราบ บันได บ่อน้ำแข็ง = เดินได้) ลบหน้าผา ขอบหลังที่ราบ ผาขอบแมพ ขอบผาขวาล่าง (block / blockLines)
- วางของตามตำแหน่งในภาพ ① · cfg.lit (เงาขวาล่าง) · mood หิมะ (หิมะตก) · mirror:1 · ไม่มีมอน หรือมอนหิมะเลเวลต่ำไว้ลองสู้
- โหลดใน index.html หลัง maps/wboss-arenas.js · ตรวจด้วยภาพจาก Playwright ทั้งเดินหลังต้นไม้ / บ้าน บนที่ราบ บันได + มือถือ

## 6. ถ้าลุคผ่าน — แมพเก็บเลเวลจริง
- รูปเดียวได้แมพ ~2–3 จอ · ทุ่งจริงใหญ่ ~9,600 × 7,200 (~20 จอ) → วาดรูปเดียวไม่ไหว
- ทางที่คิดไว้: **ชุดชิ้นส่วน iso** ให้โค้ดประกอบ = พื้นหิมะต่อกันไม่เห็นรอย (หลายแบบผสมด้วยนอยส์แบบ fieldmap.js) + "แผ่นภูมิประเทศ" วาดสำเร็จขอบจางเป็นหิมะ (ที่ราบสูงมีบันได บ่อน้ำแข็ง ลานหิน ซากปรักหักพัง) วางกระจาย + ของตั้งชุดนี้ + ผาขอบแมพหลายทิศ
- ฮีโร่ 2.5D (คลิปใหม่) จะเข้ากับแมพนี้ · ฮีโร่แบบเดิมเดินบนแมพนี้ได้เลย แต่ลุคจะแบนกว่า
