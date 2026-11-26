# แมพ 2.5D isometric แบบ Ragnarok 3 — ตัวอย่างโซนหิมะ (2026-11-26)

เจ้าของ: "อยากเปลี่ยนสไตล์แผนที่เป็น 2.5d isometric แบบ RAGnarok3 ลองทำแมพโซนหิมะเป็นตัวอย่างก่อนได้ไหม ต้องทำยังไงถึงจะสวยๆ" → "น่าจะต้องเจนภาพชุดใหม่เลยนะ"

สถานะ: รูป ② (พื้นล้วน) เข้าแล้ว → แมพทดลอง `isoSnow` · ทางแมพใหญ่ = **ชุดชิ้นส่วนให้โค้ดประกอบ** (ลายพื้น T1–T6 + แผ่นชิ้น ③–⑨) ส่งพรอมต์แล้ว รอรูป (หัวข้อ 7–9)

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

## 7. รูป ② เข้าแล้ว → แมพทดลอง isoSnow (2026-11-26 14:37)
เจ้าของส่งรูป ② (พื้นล้วน 1536×1024: ที่ราบสูง + บันไดหินซ้ายบน · แนวเสาหินผาขอบบน · ทางหิมะอัดมีหินเหยียบทแยงซ้ายล่าง → ขวาบน · บ่อน้ำแข็งร้าวขวา · ผาลงหุบหมอกขวาล่าง; โลกหมุน 45° จริง ทางลาดชัน ~2:1) + "แบบนี้ก็ได้แค่แมพเล็กๆสิ ไม่ใช้แมพ open world"
- `maps/iso/iso_floor_v1.webp` (รูปเต็ม q92) · `maps/iso-maps.js` (โหลดหลัง sea-maps.js) = `VK_MAPS.isoSnow` ทดสอบอย่างเดียว ไม่มีวาร์ปเข้า → `?map=isoSnow` ในโหมดทดสอบ
- รูปทั้งรูปเป็นพื้น (groundImg ×S, S = 1.5 · `?isok=1.2` ลองขนาดอื่น) · fieldScale 1 (ไม่งั้น scaleField ขยายแมพ ×2 แต่รูปไม่ขยายตาม) · noPretty · keepWarps · noAutoTrails · mirror · lit · noCritters
- ทางเดินได้ = ทุ่งล่าง (รวมบ่อน้ำแข็ง) + บนที่ราบ + บันได (LOW / TOP / STAIRS ในพิกัดรูป) · หน้าผา ขอบหลังที่ราบ แนวเสาบน ผาขวาล่าง = เดินไม่ได้ (ตรวจด้วย arenashot grid=1)
- กล้อง camZoom .8 / มือถือ .75 (แบบลานบอสโลก): รูป 1 px = 1.5 px บนจอ PC ยังพอคม · ฮีโร่ดูเล็กในโลกใหญ่แบบ RO · ซูมเท่าแมพเดิม (1.25) รูปขยาย ~1.9 เท่าจะเบลอ
- ภาพทดสอบ: `python3 tools/fx/arenashot.py isoSnow w=1280 h=720 views=all,mid,1900:1000 crowd=1 [hud=1 grid=1]` (หมาป่า 2.5D 10 ตัวรอบกลางแมพ)

## 8. แมพใหญ่ (open world) = เจนลายพื้นใหม่ (2026-11-26 14:47)
เจ้าของ: "แล้วทำไมไม่เจนลายพื้นล่ะ แบบนี้โคตรไม่สวยเลย" → ใช่: ไม่หั่นรูป ② มาใช้ เจนลายพื้นต่อกันไม่เห็นรอยในลุคนี้แทน แล้วให้โค้ดปูทั้งแมพ (แบบแมพเก็บเลเวลตอนนี้ 9,600 × 7,200) — รูป ② เป็นแบบลุค
- ลายพื้น 6 แบบ (แชต ChatGPT เดิมที่มี ① ②; T6 เพิ่มในหัวข้อ 9): T1 หิมะใหม่ (พื้นหลัก) · T2 หิมะลมพัด (หย่อมสลับ) · T3 ทางเดินเหยียบ (โค้ดตัดเป็นรูปทาง + วาดขอบหิมะเอง) · T4 น้ำแข็งบ่อ (โค้ดตัดเป็นรูปบ่อ) · T5 พื้นหินมีหิมะ
- เจนแบบมองตรงลงจากบน → ผมบีบแนวตั้ง ×0.62 (K ของเกม) ให้เข้ามุมกล้อง · `tools/seamless_tex.py` แก้รอยต่อที่เหลือ · ลงทะเบียน VK_CAT {t:'tex', d:'iso'}
- รอบถัดไป: ชิ้นที่มีความสูง (ขอบหน้าผา 2 ทิศทแยง + มุม + บันได / ทางลาด, ที่ราบสูงสำเร็จรูปขอบเป็นหิมะ, ผาลงหุบหมอกขอบแมพ) + ของตั้ง ③ ④ ⑤ → แมพทดลองใหญ่ `isoField`

### กล่องลายพื้น T1–T6 (แชต ChatGPT เดิมที่มีรูป ① ② ทีละกล่อง · แชตใหม่ให้แนบรูป ② ไปด้วย · T6 เพิ่มรอบ 23:50)
**T1 หิมะใหม่ (พื้นหลัก)**
```
Draw ONE seamless, tileable ground texture for my 2.5D fantasy MMORPG: FRESH SNOW — painted like the open snowfield in the attached map picture (or the map picture earlier in this chat): same painting style, same colours, same light.

Seen straight from above: soft rounded lumps and gentle low drifts of white powdery snow spread evenly over the whole square; every lump is lit from the upper left (warm pinkish-white sunlit side) with a soft cool lavender-blue shadow on its lower right; a few tiny dark pebbles and very small brown twigs scattered sparsely; two or three faint trails of small animal footprints. The lumps are the same size everywhere and nothing is big or eye-catching (it repeats many times across a big map): no rocks, no path, no hole, no plants, no ice.

SEAMLESS: it must tile perfectly — what leaves the right edge comes back on the left edge and what leaves the bottom comes back at the top, with no visible seam or border, and the same brightness and colour all over (no vignette, no darker corner, no sunlight gradient across the picture).

LOOK: a hand-painted stylized game texture exactly like the attached map picture — soft painted shading in 2–3 tones, clean and readable, matte; not photorealistic, not blurry, not pixel art, no outlines.

FORMAT: 1024×1024 square, the texture fills it edge to edge. No text, no letters, no logo, no frame.
```

**T2 หิมะลมพัด (หย่อมสลับ)**
```
Draw ONE seamless, tileable ground texture for my 2.5D fantasy MMORPG: WIND-SWEPT SNOW — painted like the snowfield in the attached map picture (or the map picture earlier in this chat): same painting style, same colours, same light.

The same snow smoothed by the wind, seen straight from above: long soft ripples and shallow curved scoops all running the same way across the square, a little smoother and very slightly bluer than fresh snow, lit from the upper left with soft cool lavender-blue shadows, a few tiny ice glints. No footprints, no pebbles, no rocks, nothing big or eye-catching (it repeats many times).

SEAMLESS: it must tile perfectly — what leaves the right edge comes back on the left edge and what leaves the bottom comes back at the top, with no visible seam or border, and the same brightness and colour all over (no vignette, no darker corner, no sunlight gradient across the picture).

LOOK: a hand-painted stylized game texture exactly like the attached map picture — soft painted shading in 2–3 tones, clean and readable, matte; not photorealistic, not blurry, not pixel art, no outlines.

FORMAT: 1024×1024 square, the texture fills it edge to edge. No text, no letters, no logo, no frame.
```

**T3 ทางเดินเหยียบ**
```
Draw ONE seamless, tileable ground texture for my 2.5D fantasy MMORPG: TRAMPLED PATH — painted like the walked-on path with stepping stones in the attached map picture (or the map picture earlier in this chat): same painting style, same colours, same light.

Seen straight from above: packed light-brown earth and sandy soil showing through trodden grey-white slush, many overlapping boot and paw prints, a few small flat grey stepping stones half sunk into it, scattered gravel, each stone lit from the upper left with a cool shadow on its lower right. Even all over, because the game cuts it into the shape of each path and blends its edges softly into the snow: no snow bank, no edge, no straight line across it.

SEAMLESS: it must tile perfectly — what leaves the right edge comes back on the left edge and what leaves the bottom comes back at the top, with no visible seam or border, and the same brightness and colour all over (no vignette, no darker corner, no sunlight gradient across the picture).

LOOK: a hand-painted stylized game texture exactly like the attached map picture — soft painted shading in 2–3 tones, clean and readable, matte; not photorealistic, not blurry, not pixel art, no outlines.

FORMAT: 1024×1024 square, the texture fills it edge to edge. No text, no letters, no logo, no frame.
```

**T4 น้ำแข็งบ่อ**
```
Draw ONE seamless, tileable ground texture for my 2.5D fantasy MMORPG: FROZEN POND ICE — painted like the frozen pond in the attached map picture (or the map picture earlier in this chat): same painting style, same colours, same light.

Seen straight from above: smooth thick ice in clear turquoise and pale sky blue, a network of thin white cracks that splits it into big irregular plates, soft white frost dusting in a few patches, a few tiny trapped bubbles. Even all over, because the game cuts it into the shape of each pond and puts the snowy banks around it itself: no bank, no snow edge, no rocks, no reflections of anything.

SEAMLESS: it must tile perfectly — what leaves the right edge comes back on the left edge and what leaves the bottom comes back at the top, with no visible seam or border, and the same brightness and colour all over (no vignette, no darker corner, no sunlight gradient across the picture).

LOOK: a hand-painted stylized game texture exactly like the attached map picture — soft painted shading in 2–3 tones, clean and readable, matte; not photorealistic, not blurry, not pixel art, no outlines.

FORMAT: 1024×1024 square, the texture fills it edge to edge. No text, no letters, no logo, no frame.
```

**T5 พื้นหินมีหิมะ**
```
Draw ONE seamless, tileable ground texture for my 2.5D fantasy MMORPG: ROCKY GROUND WITH SNOW — painted like the grey-brown rock of the cliffs in the attached map picture (or the map picture earlier in this chat): same painting style, same colours, same light.

Seen straight from above, as a flat rocky floor: cracked flat stone slabs and small broken rocks with gravel between them, snow filling the cracks and lying in small soft patches on top, each stone lit from the upper left with a cool shadow on its lower right. Even all over: no cliff edge, no big boulder, no plants.

SEAMLESS: it must tile perfectly — what leaves the right edge comes back on the left edge and what leaves the bottom comes back at the top, with no visible seam or border, and the same brightness and colour all over (no vignette, no darker corner, no sunlight gradient across the picture).

LOOK: a hand-painted stylized game texture exactly like the attached map picture — soft painted shading in 2–3 tones, clean and readable, matte; not photorealistic, not blurry, not pixel art, no outlines.

FORMAT: 1024×1024 square, the texture fills it edge to edge. No text, no letters, no logo, no frame.
```

**T6 หิมะละลายเห็นหญ้า**
```
Draw ONE seamless, tileable ground texture for my 2.5D fantasy MMORPG: THAWING SNOW WITH WINTER GRASS — painted like the snow in the attached map picture (or the map picture earlier in this chat): same painting style, same colours, same light.

Seen straight from above: a thin, melting layer of snow with many small patches of short frosty winter grass showing through — muted olive-green and straw-gold blades — and a little damp brown earth here and there, a few tiny pebbles; every snow patch has soft rounded edges lit from the upper left. Even all over, nothing big or eye-catching (it repeats many times and the game blends it softly into the snow): no path, no rocks, no flowers, no puddles.

SEAMLESS: it must tile perfectly — what leaves the right edge comes back on the left edge and what leaves the bottom comes back at the top, with no visible seam or border, and the same brightness and colour all over (no vignette, no darker corner, no sunlight gradient across the picture).

LOOK: a hand-painted stylized game texture exactly like the attached map picture — soft painted shading in 2–3 tones, clean and readable, matte; not photorealistic, not blurry, not pixel art, no outlines.

FORMAT: 1024×1024 square, the texture fills it edge to edge. No text, no letters, no logo, no frame.
```

## 9. ชุดชิ้นส่วน ประกอบแมพได้ไม่จำกัด (2026-11-26 14:50)
เจ้าของ: "ทำเหมือนตอนแรกไม่ได้หรอที่เจนชิ้นส่วนมาเยอะๆแล้วเอามาประกอบเป็นแมพ แบบนี้จะทำกี่แมพก็ได้ไม่มีตายตัว" + ภาพแมพ Ragnarok 3 จากเกมจริง 3 ภาพ (**ไม่เก็บเข้า repo** — งานของคนอื่น repo มิเรอร์สาธารณะ) → ใช่ = วิธีเดียวกับทุกแมพในเกมตอนนี้ (ชิ้นใน VK_CAT + ลายพื้น + fieldmap.js วาง) แค่เปลี่ยนชุดภาพเป็นลุค 2.5D · รูป ② = แบบลุค + แมพทดลองเล็ก isoSnow

**สิ่งที่เห็นในภาพ RO3 (ทุ่งหญ้ามีหย่อมดิน + ทางดิน · ทะเลทรายมีปาล์ม กระบองเพชร · ป่าปาล์มข้างกำแพงหิน):**
1. พื้นเป็นลายเนียนต่อกันทั้งผืน หย่อมดิน / ทางเดินขอบนุ่มกลืนเข้าหากัน ไม่มีเส้นคม ไม่เห็นตาราง
2. ของใหญ่ไม่กี่ชิ้น เว้นที่โล่งเยอะ + ของเล็กกระจายเป็นกลุ่ม (ดอกไม้ พุ่มไม้ ก้อนหิน กระดูก ของตกพื้น)
3. ทุกชิ้นมีเงานุ่มยาวจากแดดทิศเดียว → ของติดพื้น ดูเป็น 3D
4. กล้องสูง ซูมออก ฮีโร่เล็ก (~1/8 ของความสูงจอ)
5. ของแรเงานุ่มแบบ 3D ไม่มีเส้นขอบหนา

**ในเกมมีระบบตรงกับข้อ 1–4 อยู่แล้ว:** ลายพื้นหลัก + หย่อมขอบนุ่ม (patches soft) + ทางเดินขอบนุ่ม (PRETTY path painter) · cfg.vign = กลุ่มของเล็ก · cfg.lit = เงาแดดทั้งแมพ (ใช้ที่เมืองหลวง) · camZoom .8 แบบลานบอส → งานคือเจนชุดภาพใหม่ + ตั้งชุดโซนหิมะ iso ใน fieldmap.js

**ชุดภาพ (เจนในแชต ChatGPT เดิมที่มีรูป ① ② ทีละกล่อง · แชตใหม่: แนบรูป ② (+ ① ถ้ามี)):**
- ลายพื้น T1–T6 (หัวข้อ 8) · แผ่นชิ้น ③ ต้นไม้ ④ หิน / น้ำแข็ง / ของเล็ก ⑤ ค่ายไวกิ้ง (หัวข้อ 4) · ⑥ หินผา ขอบแมพ ถ้ำ ⑦ ต้นไม้เล็ก พุ่ม ดอกไม้ ⑧ ของเล็กบนพื้น ⑨ กองหิมะ ขอบบ่อ (ด้านล่าง)
- รอบแรก (พอทำแมพทดลองใหญ่): T1 T3 T4 ③ ④ ⑨ · รอบสอง: T2 T5 T6 ⑥ ⑦ ⑧ ⑤
- ชิ้นไม่มีเงา ไม่มีพื้น (เกมวาดเงาเอง) · ขนาดจริงในเกมโค้ดตั้งต่อชิ้น (ฮีโร่ 2.5D ~57 map px; สนใหญ่ ~330)

**ตอนรูปมา:** `tools/iso_art.py` แบบ `tools/sea_art.py` (ตาราง SHEETS / P, `sheet` ตัดแผ่น 3×2 ด้วยคีย์บอส, `cat` → `maps/iso-cat.js`) · ลายพื้น: `seamless_tex.py` + บีบแนวตั้ง ×0.62 · theme ใหม่ใน fieldmap.js (ชุดต้นไม้ / หิน / ของเล็ก / ลายพื้นของโซนนี้, กองหิมะ ⑨ เรียงตามขอบบ่อและทาง) · แมพทดลองใหญ่ `isoField` 9,600 × 7,200 (ทดสอบอย่างเดียว) + ภาพจากในเกมส่งให้เจ้าของ

**⑥ หินผา ขอบแมพ ถ้ำ 6 ชิ้น (พื้นเขียว)**
```
Draw SIX separate rock pieces for the same snowy map, rendered exactly like the cliffs and rocks in the map picture from earlier in this chat (or the attached one): a stylized 3D game look painted by hand — solid rounded volume, soft toon shading in 2–3 tones, one warm golden light from the upper left with soft cool-blue shadow sides, thin clean dark-brown hand-drawn outlines, matte painted textures, warm slightly retro storybook colours. Not photorealistic, not flat 2D, not pixel art.

Seen from the same high isometric game camera (about 38 degrees down, the world turned 45 degrees, no perspective): we see the snowy top of each piece and its two front faces.

The six pieces, all of the same layered warm grey-brown rock as the cliffs in the map picture: (1) a wide section of cliff wall — five tall rock columns standing side by side, about four times a person's height, thick soft snow on their flat tops, a few icicles hanging from the snow; (2) a narrow section of the same cliff wall, two columns; (3) one tall rock spire standing alone, with a snow cap; (4) a low wide rocky mound — rounded snowy boulders heaped into a small hill, much wider than tall; (5) a frozen waterfall — a short rock cliff with a fall of pale sky-blue ice frozen down its front into a small frozen pool at its foot; (6) a cave entrance — a mound of snowy rock with a dark arched cave opening in its lower-left face, wide enough for two people side by side, icicles hanging over the opening.

SHEET: 1536×1024, a 3×2 grid, one piece per cell, centred, as big as the cell allows with empty space all round; the bottom of each piece is where it sits on the ground, with a little soft snow piled against its foot; no ground patch around it, no cast shadow. Background: solid flat pure green (#00FF00), no gradient — never use green on the pieces (no moss, no grass; the ice is sky blue, not turquoise). No text, letters or logo.
```

**⑦ ต้นไม้เล็ก พุ่มไม้ ดอกไม้ 6 ชิ้น (พื้นบานเย็น)**
```
Draw SIX separate small plants for the same snowy map, rendered exactly like the map picture from earlier in this chat (or the attached one): a stylized 3D game look painted by hand — solid rounded volume, soft toon shading in 2–3 tones, one warm golden light from the upper left with soft cool-blue shadow sides, thin clean dark-brown hand-drawn outlines, matte painted textures, warm slightly retro storybook colours. Not photorealistic, not flat 2D, not pixel art.

Seen from the same high isometric game camera (about 38 degrees down, no perspective): we look a little down onto them.

The six plants: (1) a young snowy pine sapling about as tall as a person, deep teal-green needles under soft snow; (2) a round low evergreen bush, deep teal-green leaves, half covered in soft snow; (3) a low bush of bare brown twigs with clusters of bright red winter berries and snow on top; (4) a tuft of tall dry straw-gold grass poking up through a little snow; (5) a small cluster of white snowdrop flowers with drooping heads and slim leaves; (6) a small cluster of pale ice-blue frost flowers with crystal-like petals and slim leaves.

SHEET: 1536×1024, a 3×2 grid, one plant per cell, centred, as big as the cell allows with empty space all round; the bottom of each plant is where it sits on the ground, with a little soft snow piled against its foot; no ground patch around it, no cast shadow. Background: solid flat pure magenta (#FF00FF), no gradient — never use magenta, pink or purple on the plants (the berries are bright red, the flowers white or pale ice blue). No text, letters or logo.
```

**⑧ ของเล็กบนพื้น 6 ชิ้น (พื้นเขียว)**
```
Draw SIX separate small objects for the same snowy map, rendered exactly like the map picture from earlier in this chat (or the attached one): a stylized 3D game look painted by hand — solid rounded volume, soft toon shading in 2–3 tones, one warm golden light from the upper left with soft cool-blue shadow sides, thin clean dark-brown hand-drawn outlines, matte painted textures, warm slightly retro storybook colours. Not photorealistic, not flat 2D, not pixel art.

Seen from the same high isometric game camera (about 38 degrees down, the world turned 45 degrees, no perspective). Things that lie flat on the ground look squashed, like the flat stepping stones in the map picture.

The six objects: (1) a fallen snowy log lying on the ground, running from lower left to upper right, with the stub of a broken branch; (2) an old tree stump with a snow cap and a few roots; (3) a fallen bare brown branch lying flat on the snow; (4) three flat grey stepping stones lying flat in a short row, a little snow on their edges; (5) a small frozen puddle lying flat — smooth sky-blue ice with one thin white crack and a soft snowy rim; (6) an old round Viking wooden shield and a rusty axe lying half buried in the snow, battle remains.

SHEET: 1536×1024, a 3×2 grid, one object per cell, centred, as big as the cell allows with empty space all round; the bottom of each object is where it sits on the ground, with a little soft snow piled against its foot; no ground patch around it, no cast shadow. Background: solid flat pure green (#00FF00), no gradient — never use green on the objects (the ice is sky blue, not turquoise). No text, letters or logo.
```

**⑨ กองหิมะ ขอบบ่อ 6 ชิ้น (พื้นเขียว)**
```
Draw SIX separate heaps of snow for the same snowy map, rendered exactly like the snowy pond banks and drifts in the map picture from earlier in this chat (or the attached one): a stylized 3D game look painted by hand — solid rounded volume, soft toon shading in 2–3 tones, one warm golden light from the upper left with soft cool-blue shadow sides, thin clean dark-brown hand-drawn outlines, matte painted textures, warm slightly retro storybook colours. Not photorealistic, not flat 2D, not pixel art.

Seen from the same high isometric game camera (about 38 degrees down, no perspective). The game lines them up along pond shores and paths and scatters them as drifts, so they are soft rounded lumps of clean white snow with cool lavender-blue shadow sides, lit from the upper left, with real 3D volume.

The six heaps: (1) one big round soft snow lump; (2) a long bank of four snow lumps of different sizes in a row, running from lower left to upper right; (3) the same kind of bank running from upper left to lower right; (4) a long low wind-shaped snow drift with a smooth curved crest; (5) a snow heap with a grey rock showing through its side; (6) a snow heap at a pond's edge with a few slabs of pale sky-blue ice pushed up against it.

SHEET: 1536×1024, a 3×2 grid, one heap per cell, centred, as big as the cell allows with empty space all round; the bottom of each heap is where it sits on the ground, with a little soft snow piled against its foot; no ground patch around it, no cast shadow. Background: solid flat pure green (#00FF00), no gradient — never use green on the snow or ice (the ice is sky blue, not turquoise). No text, letters or logo.
```

## 10. ชุดชิ้นส่วนเข้าแล้ว → แมพทดลอง isoField (2026-11-26)

เจ้าของส่งรูปมาครบ 13 รูป: ลายพื้น T1–T6 + แผ่นชิ้นส่วน ③–⑨ (42 ชิ้น) → ประกอบเป็นแมพด้วยตัวสร้างแมพตัวเดียวกับทุกแมพ (maps/fieldmap.js) = ทำกี่แมพก็ได้ เปลี่ยนแค่การจัดวาง

**เปิดดู:** โหมดทดสอบ `index.html?char=wolf&map=isoField` (ยังไม่มีวาร์ปพามา · วาร์ป 'กลับเมืองหลวง' ทางใต้พากลับ capT)

### เครื่องมือ tools/iso_art.py
| คำสั่ง | ทำอะไร |
|---|---|
| `sheet S3 <png>` | ตัดแผ่น 3×2 บนพื้นเขียว/บานเย็น (ตัวคีย์เดียวกับลานบอสโลก) → maps/iso/<ชื่อ>.webp · เก็บแผ่นดิบไว้ที่ assets/iso/sheets/S3.webp |
| `recut` | ตัดทุกแผ่นที่เก็บไว้ใหม่ (หลังแก้ตาราง P) |
| `tex T1 <png>` | ลายพื้น → ต่อขอบไร้รอย (seamless_tex.py) → maps/iso/<ชื่อ>.webp 1024² |
| `cat` | เขียน maps/iso-cat.js (VK_CAT ทุกชิ้น + ลายพื้น) |
| `preview <out.jpg>` | แผ่นตรวจ: จุดแดง = จุดยืน, เหลือง = ชนได้ |

ตาราง SHEETS = ชื่อชิ้นตามช่องของแต่ละแผ่น · ตาราง P = ข้อมูลต่อชิ้น: `h` สูงในเกม (หรือ `w` กว้าง สำหรับชิ้นแบน) · `fd` ความลึกฐาน (จุดยืน = กลางฐาน ไม่ใช่ขอบล่างของรูป) · `cr` วงชน (สัดส่วนความกว้าง) หรือ `cw` วงรีชน · `diag` = ของแนวทแยง (รั้ว, แนวกองหิมะ) → วงชน 4 วงตามแนว · `cap` = ซ้ำได้แค่ไหน (common / mid / semi / unique) · `sw` = ไหวลม · `fill` = ป่าทึบใช้ซ้ำได้

### ค่าใหม่ใน VK_CAT (ใช้กับชิ้น iso เท่านั้น)
- `nf` = ไม่กลับซ้ายขวา (แสงมาจากซ้ายบน กลับแล้วเงาผิดด้าน)
- `ec` = วงชนอยู่ที่จุดยืนพอดี (ฐานบ้าน iso อยู่กลางรูป ฮีโร่เดินหน้าผนังทั้งสองด้านแล้วถูกวาดทับถูกต้อง)
- `fill` = ป่าทึบเลือกชิ้นนี้ซ้ำได้ (กติกาห้ามซ้ำใกล้กันใช้กับต้นไม้ชุดเก่าที่มีหลายแบบ)
- `cs` = วงชนหลายวง (รั้วแนวทแยง)

### ค่าใหม่ในแมพ (ทุกค่ามีเงื่อนไข แมพเดิมไม่เปลี่ยน — ตรวจแล้ว 8 แมพ: วางของเหมือนเดิมทุกชิ้น พื้นเหมือนเดิมทุกพิกเซล ต่างแค่สัตว์เล็กที่เดินไปมา)
- `_scaled:1` + `_pretty:1` = ไม่ขยาย ×2 ไม่ตัดของเหลือแต่ต้นไม้ ไม่ย้ายวาร์ป แต่ยังได้พื้นนุ่ม ทุ่งดอกไม้ ต้นไม้ขอบแมพนอกขอบ
- `texScale` = ลายพื้นชุดนี้วาดของใหญ่กว่าฮีโร่มาก (รอยเท้าบนทาง ~170 px) → ย่อ .22–.4
- `snowPath:1` = ทางเดินแบบทางดินสึก (ตัววาดทาง) ใช้บนแมพหิมะได้ · `pathTex:'isoPath'` · `trailW` · `noPrints:1` = ไม่วาดรอยเท้าเดิม
- `snowy:1` = บอกว่าพื้นเป็นหิมะ (ชื่อ isoSnow ไม่ตรงคำค้นเดิม)
- `meadow:[…]` = ชิ้นที่ใช้ในกอดอกไม้ · `pool:0` = ไม่วาดวงเงากลมใต้ชิ้น (ชิ้นวาดเงาที่เท้ามาเองแล้ว)
- `lakeBank:{set,sp,skip,off,v}` = วางกองหิมะ / หินรอบขอบบ่อทุก sp px (บ่อเป็นที่ห้ามเดินเสมอ)

### isoField ที่ได้
7,200 × 5,400 · Lv 4–12 (เขียนตรง · มอนชุดเดียวกับ vikF2 ไว้ก่อน) · เดินได้ 64 % · มอน 416 · ค่ายนายพราน (บ้านยาว หอสังเกตการณ์ เต็นท์ กองไฟ เลื่อน กองฟืน โล่กับขวาน รั้ว) · แนวผาทางเหนือ (ผา น้ำตกน้ำแข็ง ถ้ำ หินแหลม มีช่องเดินผ่าน) · บ่อน้ำแข็งมีกองหิมะรอบ · วงหินรูน 6 ก้อน + ผลึกน้ำแข็งกลางวง · ทางเดิน 3 สาย · ป่าสนเป็นผืน + ขอบแมพ · หย่อมหิมะลมพัด / หญ้าโผล่ / หินโผล่ · กลุ่มของเล็กจัดเป็นชุด (vign)

### ทำแมพใหม่จากชุดนี้
คัดลอกก้อน isoField ใน maps/iso-maps.js → เปลี่ยน seed, ขนาด, trails, lakes, land (ของที่วางเอง), clearings, warps → เปิดดูด้วย tools/maps/spots.py / overview.py / layout.py (เดินได้ ≥ ~60 %) · ชิ้นใหม่ = เพิ่มชื่อใน SHEETS + P → `sheet` → `cat`

### ยังไม่ได้ทำ
ชิ้นความสูง (บันได ทางลาด ที่ราบสูง ขอบผาลงล่าง) · บ้าน / เมืองแบบ iso · มอนประจำโซน · ต้นไม้ / หินแบบที่สองให้ป่าไม่ซ้ำ · คำตัดสินของเจ้าของ
