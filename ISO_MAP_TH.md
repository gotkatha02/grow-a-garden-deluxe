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

## 11. ของลอย + วางของไม่สมเหตุสมผล → แก้แล้ว (2026-11-26)

เจ้าของ: 'ในแมพใหม่ต้นไม้ดูลอยๆ ของที่วางในแมพก็ลอย' + 'ของบางอย่างวางอย่างไม่สมเหตุสมผล … ของนั้นมันไม่ควรวางอยู่ตรงนั้น'

### ลอย → ติดพื้น
- `isoAO:{a,line,col,tree}` = เงาบังแสงสีน้ำเงินเย็นใต้ทุกชิ้น iso: วงนุ่มใต้ฐาน (ครึ่งล่างทาบบนหิมะหน้าชิ้น) + แกนเข้มตรงขอบล่างที่ชิ้นแตะพื้น · รั้ว (ชิ้นที่มีวงชนหลายวง `cs`) ได้เงาตามวงชน · บ้าน / ผา (`big`) ได้วงจางกว่า เพราะมีรอยต่อพื้นของมันเองอยู่แล้ว · วาดจากภาพวงนุ่มภาพเดียว (ยืดตามชิ้น) ลงชั้นเดียว multiply ครั้งเดียวต่อ chunk → ป่าทึบเงาต่อกันเป็นผืน ไม่ซ้อนจนดำ · ใช้เวลาเพิ่ม ~2 ms ต่อ chunk (software canvas, วาดตอนเดินเข้าพื้นใหม่เท่านั้น ไม่ใช่ทุกเฟรม)
- `sun:{a:.86}` = เงาแดดเข้มขึ้น (ค่าเดิม .72 · ใส่ kd / sx / sy / max ได้ด้วย ทุกแมพที่มี `lit`)
- `?isoao=0` = ปิดทั้งสองอย่างไว้เทียบ

### กติกาวางของของ isoField (เขียนไว้ใน maps/iso-maps.js)
- หิมะโล่งไม่มีของโปรย (`open:[]`, `decorOpen:0`) · ลานโล่ง / ลานค่าย ไม่มีของเกะกะ (`clearClean:1`)
- ไม้พุ่ม กล้าไม้ หญ้าแห้ง ขึ้นแค่ชิดขอบป่า (`edge` + `edgeN:.045` = แถบแคบ · ไม่มีหินในชุดนี้แล้ว)
- กิ่งไม้หักอยู่ใต้ต้นไม้เท่านั้น (`treeLitter`)
- หญ้า / ดอกหิมะ ขึ้นแค่บนหย่อมหิมะละลาย (`meadowPatch:'isoThaw'`) · แอ่งน้ำ + หินข้าม ก็บนหย่อมละลายเท่านั้น
- ผลึกน้ำแข็งอยู่แค่ข้างบ่อน้ำแข็ง น้ำตกน้ำแข็ง ปากถ้ำ (+ กลางวงหินรูน = ศาล)
- หินร่วงอยู่แค่ตีนผา และรอบหินแหลม / เนินหิน · พื้นหินโผล่ (patch isoRock) ก็เฉพาะที่นั่น
- ท่อนไม้ล้ม ต้นตาย พุ่มเบอร์รี่ ชิดขอบป่า แต่ไม่ลงบนเศษหินตีนผา (`not:CLIFF` — ป่าอยู่บนที่ราบสูงหลังผา)
- หินรูน: วงหินรูน + หลักบอกทางที่ทางแยกเท่านั้น
- ผาเป็นกำแพงต่อเนื่องปิดหุบทางเหนือ (ชิ้นทับกัน 16 %) มีน้ำตกน้ำแข็งกับถ้ำอยู่ในแนว ทางเดินไปจบที่ปากถ้ำ · หลังผาเป็นป่าบนที่ราบสูง (`woods` เดินไม่ได้)
- ค่าย: บ้านยาวหันประตู (ด้านจั่ว) มาทางลาน · โล่ + ขวานข้างประตู · กองฟืนพิงผนังยาว · เลื่อนข้างบ้าน · กองไฟกลางลาน มีท่อนไม้นั่ง + ตอไม้ · เต็นท์อยู่ในรั้ว · รั้วต่อกันจริงล้อมด้านหลัง (ปลายรั้วชนเสาพอดี) · หอสังเกตการณ์ที่ทางเข้าค่ายข้างทางเดิน (ไม่บังกองไฟ) · ทางเดินจากลานค่ายต่อทางหลัก · กองหิมะลมพัดพิงรั้วด้านนอก · ลานเป็นพื้นเหยียบ · มอนไม่เกิดในลาน (`safe`)
- ไม่มีผีเสื้อบนหิมะ (`flies:0`)

### ค่าใหม่ในตัวสร้างแมพ (maps/fieldmap.js · ทุกค่ามีเงื่อนไข แมพเดิมไม่เปลี่ยน — ตรวจ vikF2 grkF2 jpnF4 snowpine seaF1 grkT capT aztF1 แล้ว: วางของเหมือนเดิมทุกชิ้น พื้นเหมือนเดิมทุกพิกเซล ต่างแค่สัตว์เล็กที่เดินไปมา)
| ค่า | ทำอะไร |
|---|---|
| `isoAO` | เงาบังแสงใต้ชิ้น iso (ดูด้านบน) |
| `sun:{…}` | ปรับเงาแดด (a, kd, sx, sy, max, big) |
| `flies:0` | ไม่มีผีเสื้อ |
| `woods:[{e:[cx,cy,rx,ry]} หรือ {p:[x,y,…]}, m]` | ป่าทึบตามรูปที่เขียนเอง (วงรี / รูปหลายเหลี่ยม, ขอบสั่นตาม noise, m = ความกว้างขอบ) |
| patch `near:[[x,y,rx,ry]]` / `not:[…]` | หย่อมพื้นเกิดเฉพาะในวง / ไม่เกิดในวง |
| vign set `zone` / `not` / `patch` / `forest:[a,b]` / `open:d` | กลุ่มของเล็กลงได้แค่: ในวง / นอกวง / บนหย่อมพื้น / ชิดขอบป่า / ในที่โล่ง |
| vign `strict:1` | สมาชิกกลุ่มไม่ลงบนทางเดิน / ลานโล่ง และชิ้นแบนวาดเป็นพื้น |
| `meadowPatch` | ทุ่งดอกไม้เฉพาะบนหย่อมพื้นนี้ |
| `decorOpen:0` | ไม่วางต้นไม้ประดับกลางที่โล่ง |
| `treeLitter:{set,p,v}` | ของแบนข้างโคนต้นไม้ (กิ่งหัก) |
| `clearClean:1` | ลานโล่ง (clearings) ไม่มีของ |
| `edgeN` | ความกว้างแถบขอบป่าที่ของชุด `edge` ลง (ค่าเดิม .12) |
| `safe:[[x,y]]` | (index.html fieldSafe) มอนไม่เกิดแถวนี้ |

### ตัวช่วยใน maps/iso-maps.js
- `fence(มุม…)` = รั้วจากจุดมุม: ต่อชิ้น isoFenceA / B ให้เสาปลายตรงมุมพอดี (ช่วงเสาวัดจากรูป A (63.6, −22.2) · B (65.7, 23.3))
- `wall(x0, ชื่อ…, y…)` = แนวผาต่อเนื่อง ทับกัน 16 % · `ring(ชื่อ, cx, cy, rx, ry, n, a0)` = วงหิน
- บ้านยาว: ด้านจั่ว / ประตู หันลงซ้าย ผนังยาวหันลงขวา — ของพิงผนังต้องวางตามมุมนี้ (มุมบ้าน ซ้าย (x−.45w, +20) · หน้า (x+.08w, +52) · ขวา (x+.43w, +8))
- กล้องมองจากทางใต้: ชิ้นที่อยู่ใต้ (y มากกว่า) วาดทับชิ้นทางเหนือ → ของสูงอย่าวางทางใต้ของของสำคัญ (หอสังเกตการณ์เคยบังกองไฟ)

### เครื่องมือ
tools/maps/spots.py และ tools/maps/overview.py รับ `q=` (ต่อท้าย URL เช่น `"q=&isoao=0"`) · overview.py รับ `port=` (เทียบเวอร์ชันเก่าบน 8766) · tools/perf/bakeall.py รับ query ตัวที่ 3

### ผล
เดินได้ 59.9 % (เดิม 63.8 %: ป่าหลังผา) · มอน ~380 · จัดแมพ 1.3 วิ · ทุกวาร์ปไปถึง · ทาสีพื้นต่อ chunk ~2 ms เพิ่ม

## 12. วิธีเข้าแมพทดลอง (2026-11-26 'ขอเข้าไปเทสแมพนี้')
- ลิงก์: `https://gotkatha02.github.io/grow-a-garden-deluxe/index.html?char=wolf&map=isoField` (เปลี่ยน `char=` เป็นฮีโร่อื่นได้ · `map=isoSnow` = แมพรูปเดียว · `map=seaF1` = หาดทะเล)
  — ตอนนี้ใช้ได้ทั้งโหมดเล่นจริงและโหมดทดสอบ (ก่อนหน้านี้โหมดเล่นจริงจะดึงกลับไปแมพที่เซฟไว้ทุกครั้ง)
- ในเกม: ⚙ ตั้งค่า → MAP → ช่อง "เลือกแมพ" → กลุ่ม **แมพทดลอง (ยังไม่เปิด)** = isoField · isoSnow · seaF1
- กลับ: วาร์ป "กลับเมืองหลวง" ตรงจุดเกิด (ล่างกลางแมพ)
- แก้บั๊กไปด้วย (progress.js / char_create.js): กด 🧪 โหมดทดสอบตอนเล่นจริงอยู่ = เดิมไม่เปลี่ยนโหมด (เซฟตอนออกจากหน้าเขียนทับกลับ) หรือบนมือถือบางเครื่องลบเลเวลเล่นจริงทิ้ง
  → ตอนนี้สลับได้ และเลเวลเล่นจริงยังอยู่ กด ⚙ ในหน้าต่าง Status → ▶ เล่นต่อ (Lv …) เพื่อกลับ · "เริ่มเกมใหม่" ของฮีโร่ตัวเดิมก็รีเซ็ตได้จริงแล้ว

## 13. แมพแบบไหนเข้ากับฮีโร่ 2.5D (2026-11-27 05:52)
เจ้าของ: "คุณน่าจะเห็นแล้วว่าผมเริ่มปรับหน้าตาฮีโร่เป็น 2.5d คำถามคือทำแมพแบบไหนดีให้มันเข้ากับฮีโร่"

**คำตอบ: ทุกแมพแบบ isoField (ชุดชิ้นส่วน iso ให้โค้ดประกอบ)** — เทียบในเกมแล้ว: หมาป่า 2.5D บน vikF2 · แรด 2.5D ในเมืองหลวง · ทั้งสองตัวในค่ายนายพรานของ isoField (ภาพเทียบ 2×2 ส่งในแชต ไม่เก็บเข้า repo; สคริปต์ /home/claude/work/mapq/py: zoomshot.py = ถ่ายแมพที่ซูมกล้องต่างๆ (ตั้ง MAPDEF[id].cz) · board.py)
- แมพเดิม = วาดชิบิ 2D เส้นขอบหนา สีแบน ไม่มีแสงเงา (หย่อมหิมะ vikF2 ยังเห็นขอบเป็นขั้นพิกเซล) → ฮีโร่ 2.5D ดูแปะ
- isoField = มิติ 2–3 โทน เส้นขอบบาง แสงอุ่นซ้ายบน เงาเย็นขวาล่าง พื้นนุ่มกลืนกัน → ฮีโร่อยู่ในโลกเดียวกัน

**ต้องเหมือนกันทุกแมพ:** มุมกล้องเดียว (โลกหมุน 45° มองลง ~38°) · แสงทิศเดียว + เงานุ่มที่โคนทุกชิ้น · ลายเส้นเดียวกับฮีโร่ 2.5D (แนบรูปฮีโร่ 2.5D เป็นตัวอย่างลุค ไม่แนบภาพแคมป์ไฟ) · พื้นเรียบ / อ่อนกว่าตัวละคร · ของใหญ่น้อยชิ้น ของเล็กจับกลุ่ม ขนาดสมจริง มีที่สูงต่ำ

**ยังไม่เข้ากัน:** มอนสเตอร์ (เยติ / กระต่ายในแมพ iso ยังเป็นชิบิเส้นหนา → วาดใหม่แบบ 2.5D ทีละโซน) · NPC · ชุดบ้าน / เมือง iso · ชิ้นความสูง (บันได ทางลาด ที่ราบ) · ซูมกล้อง: isoField ตั้ง .8 ฮีโร่เล็ก ลองแล้ว 1.0–1.2 ภาพยังคม (ภาพเทียบใช้ 1.15 / 1.2)

**ลำดับที่เสนอ:** ทำโซนไวกิ้งให้ครบก่อน (มีชุดชิ้นส่วนแล้ว: เมือง + ทุ่ง + ดันเจียน + มอนของโซน) → ลองเล่นทั้งโซน → ค่อยทำชุดของแดนอื่นทีละแดน (แดนละ ~15 ภาพสำหรับแมพ + มอนของแดน) · แมพเก่ายังเล่นได้ระหว่างนั้น เปลี่ยนทีละแดน · รอเจ้าของตอบ

## 14. ชุดเมืองไวกิ้ง iso — ฟรอสต์เฮล์ม (2026-11-27 06:14)
เจ้าของ: 'ได้' (ต่อจาก §13: ทำโซนไวกิ้งแบบ iso ให้ครบก่อน) → พรอมต์ชุดเมือง + มอนโซนหิมะ 2.5D (มอนอยู่ใน MONSTER25_PROMPTS_TH.md)

**รูปอ้างอิง (ของเราเอง):** `tools/ref/iso_town_ref.jpg` = ชิ้น iso ที่ใช้อยู่ในเกม (บ้านยาว หอสังเกตการณ์ เต็นท์ รั้ว กองไฟ เลื่อน กองฟืน หินรูน สน) ขนาดจริงเทียบกัน + หมาป่า 2.5D ยืนหน้าประตูบ้านยาว (ประตู ≈ 1.5 เท่าตัวฮีโร่) → ลุค + มุมกล้อง + ขนาดในรูปเดียว · สร้างด้วย /home/claude/work/vik25/py/townref.py (ไม่อยู่ใน repo)

**เมืองในเกมตอนนี้ (frostheim):** โถงใหญ่ (greatHall) · บ้านหัวหน้า (chiefHall) · โรงตีเหล็ก (vkCraftHall = ประตูเข้าห้องคราฟของบียอร์น) · โรงเหล้า · ร้านค้า · หมอ · คอกม้า · โกดังหิน · บ้าน 4 หลัง · หอสังเกตการณ์ · เรือมังกร · ศาลรูน · บ่อน้ำ · รูปปั้นหมาป่า · แผง 2 · เกวียน · กองไฟ · ธง 2 · หุ่นซ้อม · เป้า · ราวตากปลา · ฟาง · กองฟืน · ถัง · ป้ายประกาศ · ป้ายทาง · โคมไฟ · ม้านั่ง · กระบะดอกไม้ → ชุดด้านล่างครบทุกอย่าง

**กติกาที่ใส่ในทุกกล่อง:**
- กล้องมองจากทางใต้ เห็นผนังแค่ 2 ด้าน (หันลงซ้าย / หันลงขวา) → ประตูต้องอยู่ด้านที่เห็น · ชิ้น iso ห้ามกลับซ้ายขวา (แสงซ้ายบนจะผิดด้าน) จึงสั่งบ้านให้ประตูหันลงซ้ายครึ่งหนึ่ง หันลงขวาครึ่งหนึ่ง: ถนนแนวลงซ้าย→ขึ้นขวา ใช้บ้านประตูหันลงขวา (ตั้งฝั่งบนของถนน) · ถนนแนวขึ้นซ้าย→ลงขวา ใช้บ้านประตูหันลงซ้าย
- ประตู ≈ 1.5 เท่าคน กว้างอย่างน้อยเท่าคน (ฮีโร่ตัวใหญ่สุดเดินเข้าได้) · บอกขนาดอาคารเทียบบ้านยาวในรูปอ้างอิง
- พื้นเขียว ห้ามสีเขียวบนชิ้น (หลังคาไม้มุงใต้หิมะ ไม่มีหลังคาหญ้า) · ไม่มีตัวหนังสือบนป้าย / ธง / กระดาษ

**ลำดับ (แชต ChatGPT ใหม่ 1 แชต · ส่งทีละกล่อง):** ⓐ ภาพลองลุค → ส่งให้ผมดู (ผมแปะฮีโร่จริงลงไปเทียบขนาด) → ⓑ ⓒ ⓓ อาคาร → ⓔ ⓕ ⓖ ของ → T7 T8 ลายพื้น · รอบสอง: ⓗ ของเสริม (เรือมังกร ฯลฯ) ⓘ รั้วไม้แหลม

**ตอนรูปมา:** เพิ่มชื่อชิ้นใน `tools/iso_art.py` (SHEETS รับ 2×2 ได้ · P ของอาคาร = `big`, fd ตามฐาน, ec, จุดประตู) → `sheet` → `cat` · ลายพื้น `tex` · เมืองใหม่ `isoTown` ใน maps/iso-maps.js แบบทดลองก่อน (ถนนหินกรวด + ลานหินแผ่น + ป่าล้อม + มอนไม่เกิด) แล้วค่อยย้ายบริการจาก frostheim (ประตูโรงตีเหล็ก → ห้องคราฟเดิม, คาฟร่า, ร้าน, วาร์ป 2 ทาง) · NPC ยังเป็นภาพแบน (รอบหน้า)

**ประโยคแก้ (ต่อท้ายส่งในแชตเดิม):**
- ประตูหันผิดด้าน → `Redo: the door of (n) must be on the wall facing lower right (lower left).`
- อาคารเล็ก / ใหญ่เทียบกันผิด → `Redo: keep the sizes compared with the attached longhouse — doors one and a half times a person's height.`
- ไม่ทแยง / เห็นผนังด้านเดียว → `Redo with the isometric camera of the attached pieces: every building shows two walls and its roof.`
- แบน 2D → `Redo: more 3D volume and soft 3D shading, keep the thin hand-drawn outlines.`
- มีตัวหนังสือ → `Redo with no letters anywhere — signs, banners and papers are blank or show simple pictures only.`

**ⓐ ภาพลองลุคเมือง (ฉากเต็ม)** · แนบ `iso_town_ref.jpg`
```
Draw ONE finished game-scene picture of a Viking town from my 2.5D fantasy MMORPG, as the player would see it — no characters, no animals, no UI, no text.

LOOK: exactly the rendering of my attached picture of game pieces (a Viking longhouse with a little hero standing at its door, a watchtower, a tent, fences, a campfire, a sled, firewood, a runestone and pines): a stylized 3D game look painted by hand — solid rounded volume, soft toon shading in 2–3 tones, one warm golden light from the upper left with soft cool-blue shadow sides, thin clean dark-brown hand-drawn outlines, matte painted textures (weathered wood, grey stone, iron, canvas, soft powdery snow), warm slightly retro storybook colours. Not photorealistic, not glossy, not flat 2D, not pixel art.

CAMERA: copy the camera of those pieces — a fixed high isometric game camera looking down at about 38 degrees with the whole world turned 45 degrees: streets, walls and fences run diagonally across the picture, every building shows two walls and its roof, a round thing on the ground is an ellipse 1.6 times wider than tall; no perspective (far things are not smaller), no fisheye. Size: the little hero at the longhouse door in the attached picture is the size of a person; every door is about one and a half times a person's height and at least as wide as a person, like that longhouse door.

SCENE — Frostheim, a Viking town in deep snow on a sunny winter afternoon:
• Top middle: the Great Hall of the jarl — a long, tall mead hall, much bigger than the attached longhouse, with a high roof whose ridge curves like an upturned ship, thick snow on it, carved dragon heads on both gable ends; its tall gable end with big double doors at the top of three wide stone steps faces lower left; round painted shields hang along its long wall that faces lower right; two iron fire baskets burn beside the steps.
• Centre: a round town square paved with big flat flagstones with snow in the joints; in the middle a stone well with a small wooden roof; a big stone statue of a sitting, howling wolf on a square plinth; two market stalls with striped canvas roofs (one with furs, one with fish and goods); a wooden notice board with blank pinned papers.
• Two cobblestone streets cross the town diagonally (one from the bottom-left corner up to the Great Hall, one from the left edge to the bottom-right corner), lined with timber houses with snowy roofs whose doors face the street, and wooden lamp posts with iron lanterns.
• Left of the square: the blacksmith — a stone-and-timber workshop with a big stone chimney glowing orange at the top; on its lower-right side an open-sided shelter with an anvil, a water barrel and tools on a rack.
• Right of the square: the tavern — a wide longhouse with warm glowing windows, barrels by its door and a hanging wooden sign shaped like a drinking horn.
• Lower right: a stable with big double doors and golden hay in a loft opening; a two-wheeled cart with sacks.
• Around the town: snow drifts and snowy pine forest; a wooden palisade of sharpened logs with a gate tower at the bottom left where the street leaves town.

FORMAT: 1536×1024 landscape; the scene fills the whole picture to every edge (no frame, no border, no vignette, no sky). Never any text, letters, numbers, logo or UI — not on the signs, banners or notice board either.
```

**ⓑ อาคารใหญ่ 4 หลัง (พื้นเขียว 2×2)** · แชตเดิมต่อจาก ⓐ (แชตใหม่: แนบ `iso_town_ref.jpg` + รูป ⓐ)
```
Draw FOUR separate buildings for the same snowy Viking town, rendered exactly like my attached picture of game pieces (a Viking longhouse with a little hero standing at its door, a watchtower, a tent, fences, a campfire, a sled, firewood, a runestone and pines) and the town picture from earlier in this chat if there is one: a stylized 3D game look painted by hand — solid rounded volume, soft toon shading in 2–3 tones, one warm golden light from the upper left with soft cool-blue shadow sides, thin clean dark-brown hand-drawn outlines, matte painted textures (weathered wood, grey stone, iron, canvas, soft powdery snow), warm slightly retro storybook colours. Not photorealistic, not glossy, not flat 2D, not pixel art.

Seen from the same high isometric game camera as those pieces (about 38 degrees down, the world turned 45 degrees, no perspective): every building shows two walls — one facing lower left, one facing lower right — and its roof.

Size: the little hero at the longhouse door in the attached picture is the size of a person; every door is about one and a half times a person's height and at least as wide as a person, like that longhouse door.

The 4 pieces: (1) the Great Hall of the jarl, the biggest building of the town, about three times as long and twice as tall as the attached longhouse: a long mead hall of logs and planks on a stone footing, a high roof whose ridge curves like an upturned ship, thick snow on the roof, carved dragon heads on both gable ends; its tall gable end faces lower left with three wide stone steps up to big double doors under a carved arch; round painted shields (red-and-white, blue-and-white) hang along its long wall that faces lower right; small shuttered windows glowing warm; a smoke hole with a little roof on the ridge; (2) the chieftain's house, a big two-storey longhouse about twice the size of the attached longhouse: its gable end with the door faces LOWER RIGHT under a small porch roof held by two carved posts, a balcony with a railing under the gable above the porch, a long wall facing lower left with warm glowing windows, a long dark-blue banner with a white wolf head hanging beside the door; (3) the blacksmith's forge, about the size of the attached longhouse: a sturdy workshop of grey stone and timber with a big square stone chimney glowing orange at the top with a little smoke; its door is on the wall facing lower left; against its lower-right side an open-sided shelter with a snowy roof on log posts, under it a glowing forge hearth, an iron anvil on a tree stump, a water barrel and hammers and tongs hanging on a rack; (4) the tavern, a wide longhouse about one and a half times the attached longhouse: warm glowing windows, its door on the long wall that faces LOWER RIGHT, beside the door a wooden sign shaped like a drinking horn hanging from an iron bracket, two barrels and a bench by the door, a stone chimney with a little smoke, thick snow on the roof.

SHEET: 1536×1024, a 2×2 grid, one piece per cell, centred, as big as the cell allows with empty space all round; each piece stands with its base at the bottom, with a little soft snow piled against its foot; no ground patch around it, no cast shadow. Background: solid flat pure green (#00FF00), no gradient — never use green on the buildings (no moss, no grass roofs, no leaves: roofs are wooden shingles under snow). No text, letters, numbers or logo anywhere — not on signs, banners, boards or shields either.
```

**ⓒ ร้าน / บริการ 4 หลัง (พื้นเขียว 2×2)** · แชตเดิม
```
Draw FOUR separate buildings for the same snowy Viking town, rendered exactly like my attached picture of game pieces (a Viking longhouse with a little hero standing at its door, a watchtower, a tent, fences, a campfire, a sled, firewood, a runestone and pines) and the town picture from earlier in this chat if there is one: a stylized 3D game look painted by hand — solid rounded volume, soft toon shading in 2–3 tones, one warm golden light from the upper left with soft cool-blue shadow sides, thin clean dark-brown hand-drawn outlines, matte painted textures (weathered wood, grey stone, iron, canvas, soft powdery snow), warm slightly retro storybook colours. Not photorealistic, not glossy, not flat 2D, not pixel art.

Seen from the same high isometric game camera as those pieces (about 38 degrees down, the world turned 45 degrees, no perspective): every building shows two walls — one facing lower left, one facing lower right — and its roof.

Size: the little hero at the longhouse door in the attached picture is the size of a person; every door is about one and a half times a person's height and at least as wide as a person, like that longhouse door.

The 4 pieces: (1) the trading post, a timber shop about the size of the attached longhouse: its gable end facing lower left has a wide open counter window under a red-and-cream striped canvas awning, with furs, bundles and small crates on the counter; its door is on the long wall facing lower right; crates and a sack stacked outside; (2) the healer's hut, small and cosy: round-ended walls of logs and stone, a steep snowy roof, bundles of dried herbs (brown, gold and lavender) hanging under the eaves, a small iron cauldron on a tripod beside the door, its door faces LOWER RIGHT, a round window glowing warm; (3) the stable, a long low barn of planks on a stone footing: big double plank doors on its gable end facing lower left with a hay-loft opening above them full of golden hay, small shuttered windows along its long wall facing lower right, a hay bale and a wooden water trough outside; (4) the stone storehouse, squat and strong: walls of grey stone blocks, a steep snowy plank roof, a heavy iron-bound door on the wall facing LOWER RIGHT reached by two stone steps, an iron lantern above the door, barrels and sacks against the wall.

SHEET: 1536×1024, a 2×2 grid, one piece per cell, centred, as big as the cell allows with empty space all round; each piece stands with its base at the bottom, with a little soft snow piled against its foot; no ground patch around it, no cast shadow. Background: solid flat pure green (#00FF00), no gradient — never use green on the buildings (no moss, no grass roofs, no leaves: roofs are wooden shingles under snow). No text, letters, numbers or logo anywhere — not on signs, banners, boards or shields either.
```

**ⓓ บ้านคน 4 หลัง (พื้นเขียว 2×2)** · แชตเดิม
```
Draw FOUR separate houses for the same snowy Viking town (homes of the townsfolk, simpler than the attached longhouse, no dragon heads), rendered exactly like my attached picture of game pieces (a Viking longhouse with a little hero standing at its door, a watchtower, a tent, fences, a campfire, a sled, firewood, a runestone and pines) and the town picture from earlier in this chat if there is one: a stylized 3D game look painted by hand — solid rounded volume, soft toon shading in 2–3 tones, one warm golden light from the upper left with soft cool-blue shadow sides, thin clean dark-brown hand-drawn outlines, matte painted textures (weathered wood, grey stone, iron, canvas, soft powdery snow), warm slightly retro storybook colours. Not photorealistic, not glossy, not flat 2D, not pixel art.

Seen from the same high isometric game camera as those pieces (about 38 degrees down, the world turned 45 degrees, no perspective): every building shows two walls — one facing lower left, one facing lower right — and its roof.

Size: the little hero at the longhouse door in the attached picture is the size of a person; every door is about one and a half times a person's height and at least as wide as a person, like that longhouse door.

The 4 pieces: (1) a small family cottage of logs on a stone footing, a steep snowy roof, its gable end with the door faces lower left, one small glowing window on the long wall facing lower right; (2) the same kind of cottage turned the other way: its gable end with the door faces LOWER RIGHT, the long wall with a window faces lower left; darker wood, a woodpile stacked against the long wall; (3) a long family house of logs: its door is on the long wall facing lower right; a lean-to woodshed full of chopped logs under a sloping roof against its gable end facing lower left; a carved horse head on the roof ridge; (4) a tall narrow two-storey house of planks on a stone base: a small balcony with a railing on the upper floor facing lower right, the door on the wall facing lower left, a stone chimney with a little smoke.

SHEET: 1536×1024, a 2×2 grid, one piece per cell, centred, as big as the cell allows with empty space all round; each piece stands with its base at the bottom, with a little soft snow piled against its foot; no ground patch around it, no cast shadow. Background: solid flat pure green (#00FF00), no gradient — never use green on the houses (no moss, no grass roofs, no leaves: roofs are wooden shingles under snow). No text, letters, numbers or logo anywhere — not on signs, banners, boards or shields either.
```

**ⓔ ของลานเมือง 6 ชิ้น (พื้นเขียว 3×2)** · แชตเดิม
```
Draw SIX separate objects for the town square of the same snowy Viking town, rendered exactly like my attached picture of game pieces (a Viking longhouse with a little hero standing at its door, a watchtower, a tent, fences, a campfire, a sled, firewood, a runestone and pines) and the town picture from earlier in this chat if there is one: a stylized 3D game look painted by hand — solid rounded volume, soft toon shading in 2–3 tones, one warm golden light from the upper left with soft cool-blue shadow sides, thin clean dark-brown hand-drawn outlines, matte painted textures (weathered wood, grey stone, iron, canvas, soft powdery snow), warm slightly retro storybook colours. Not photorealistic, not glossy, not flat 2D, not pixel art.

Seen from the same high isometric game camera as those pieces (about 38 degrees down, the world turned 45 degrees, no perspective): every object shows its top and its two front sides — one facing lower left, one facing lower right.

Size: the little hero at the longhouse door in the attached picture is the size of a person; size every object like the real thing next to that person (a barrel reaches a person's waist, a market-stall roof is a little higher than a person, a lamp post or a banner pole is about twice a person's height).

The 6 pieces: (1) a round stone well with a small wooden roof on two posts and a wooden bucket on a rope; (2) a big stone statue of a wolf sitting and howling at the sky, on a square stone plinth with a carved knotwork band, snow on its head and back; (3) a small rune shrine: a flat stone altar with a carved standing stone behind it (knotwork and plain angular marks, no letters), two small offering bowls and a little fire burning in an iron bowl; (4) a market stall selling furs: a wooden counter under a red-and-cream striped canvas roof on four posts, pelts hanging from the roof and folded furs on the counter; (5) a market stall selling fish and goods: a wooden counter under a blue-and-cream striped canvas roof on four posts, baskets of fish, clay pots, sacks and a small lantern; (6) a wooden notice board on two posts under a small snowy roof, with several blank pinned papers (nothing written on them).

SHEET: 1536×1024, a 3×2 grid, one piece per cell, centred, as big as the cell allows with empty space all round; each piece stands with its base at the bottom, with a little soft snow piled against its foot; no ground patch around it, no cast shadow. Background: solid flat pure green (#00FF00), no gradient — never use green on the objects (no moss, no grass roofs, no leaves: roofs are wooden shingles under snow). No text, letters, numbers or logo anywhere — not on signs, banners, boards or shields either.
```

**ⓕ ของริมถนน 6 ชิ้น (พื้นเขียว 3×2)** · แชตเดิม
```
Draw SIX separate street objects for the same snowy Viking town, rendered exactly like my attached picture of game pieces (a Viking longhouse with a little hero standing at its door, a watchtower, a tent, fences, a campfire, a sled, firewood, a runestone and pines) and the town picture from earlier in this chat if there is one: a stylized 3D game look painted by hand — solid rounded volume, soft toon shading in 2–3 tones, one warm golden light from the upper left with soft cool-blue shadow sides, thin clean dark-brown hand-drawn outlines, matte painted textures (weathered wood, grey stone, iron, canvas, soft powdery snow), warm slightly retro storybook colours. Not photorealistic, not glossy, not flat 2D, not pixel art.

Seen from the same high isometric game camera as those pieces (about 38 degrees down, the world turned 45 degrees, no perspective): every object shows its top and its two front sides — one facing lower left, one facing lower right.

Size: the little hero at the longhouse door in the attached picture is the size of a person; size every object like the real thing next to that person (a barrel reaches a person's waist, a market-stall roof is a little higher than a person, a lamp post or a banner pole is about twice a person's height).

The 6 pieces: (1) a wooden lamp post with an iron lantern glowing warm hanging from a bracket; (2) an iron fire basket on three tall legs with a calm fire burning in it; (3) a tall wooden banner pole with a long dark-blue cloth banner showing a white howling wolf head; (4) a tall wooden banner pole with a long red cloth banner showing two crossed white axes (simple shapes, no letters); (5) a wooden signpost with three blank arrow-shaped boards pointing different ways (no writing); (6) a long wooden bench with snow on its seat.

SHEET: 1536×1024, a 3×2 grid, one piece per cell, centred, as big as the cell allows with empty space all round; each piece stands with its base at the bottom, with a little soft snow piled against its foot; no ground patch around it, no cast shadow. Background: solid flat pure green (#00FF00), no gradient — never use green on the objects (no moss, no grass roofs, no leaves: roofs are wooden shingles under snow). No text, letters, numbers or logo anywhere — not on signs, banners, boards or shields either.
```

**ⓖ ของในลาน / ร้าน 6 ชิ้น (พื้นเขียว 3×2)** · แชตเดิม
```
Draw SIX separate yard objects for the same snowy Viking town, rendered exactly like my attached picture of game pieces (a Viking longhouse with a little hero standing at its door, a watchtower, a tent, fences, a campfire, a sled, firewood, a runestone and pines) and the town picture from earlier in this chat if there is one: a stylized 3D game look painted by hand — solid rounded volume, soft toon shading in 2–3 tones, one warm golden light from the upper left with soft cool-blue shadow sides, thin clean dark-brown hand-drawn outlines, matte painted textures (weathered wood, grey stone, iron, canvas, soft powdery snow), warm slightly retro storybook colours. Not photorealistic, not glossy, not flat 2D, not pixel art.

Seen from the same high isometric game camera as those pieces (about 38 degrees down, the world turned 45 degrees, no perspective): every object shows its top and its two front sides — one facing lower left, one facing lower right.

Size: the little hero at the longhouse door in the attached picture is the size of a person; size every object like the real thing next to that person (a barrel reaches a person's waist, a market-stall roof is a little higher than a person, a lamp post or a banner pole is about twice a person's height).

The 6 pieces: (1) three wooden barrels with iron hoops, two side by side and one on top; (2) a stack of wooden crates and grain sacks; (3) a two-wheeled wooden hand cart loaded with sacks and a rolled fur, its handles resting on the snow, running from lower left to upper right; (4) a wooden rack for drying fish, with rows of dried fish hanging from its poles; (5) a stack of golden hay bales tied with rope, snow on top; (6) a straw training dummy on a wooden post with a round wooden shield tied to its arm.

SHEET: 1536×1024, a 3×2 grid, one piece per cell, centred, as big as the cell allows with empty space all round; each piece stands with its base at the bottom, with a little soft snow piled against its foot; no ground patch around it, no cast shadow. Background: solid flat pure green (#00FF00), no gradient — never use green on the objects (no moss, no grass roofs, no leaves: roofs are wooden shingles under snow). No text, letters, numbers or logo anywhere — not on signs, banners, boards or shields either.
```

**T7 ถนนหินกรวด (ลายพื้นต่อกันไม่เห็นรอย)** · แชตเดิม
```
Draw ONE seamless, tileable ground texture for my 2.5D fantasy MMORPG: COBBLESTONE STREET of the Viking town — painted like the cobbled streets in the town picture from earlier in this chat (or the attached one): same painting style, same colours, same light.

Seen straight from above: rounded grey cobblestones of slightly different sizes and tones laid tightly together, thin lines of snow filling the gaps, a few soft thin patches of snow and some boot prints, each cobble lit from the upper left with a cool shadow on its lower right. Even all over, because the game cuts it into the shape of each street and blends its edges softly into the snow: no kerb, no edge, no straight line across it, no puddles, nothing big or eye-catching.

SEAMLESS: it must tile perfectly — what leaves the right edge comes back on the left edge and what leaves the bottom comes back at the top, with no visible seam or border, and the same brightness and colour all over (no vignette, no darker corner, no sunlight gradient across the picture).

LOOK: a hand-painted stylized game texture exactly like the ground in the town picture from earlier in this chat (or the attached one) — soft painted shading in 2–3 tones, clean and readable, matte; not photorealistic, not blurry, not pixel art, no outlines.

FORMAT: 1024×1024 square, the texture fills it edge to edge. No text, no letters, no logo, no frame.
```

**T8 ลานหินแผ่น (ลายพื้นต่อกันไม่เห็นรอย)** · แชตเดิม
```
Draw ONE seamless, tileable ground texture for my 2.5D fantasy MMORPG: FLAGSTONE TOWN SQUARE of the Viking town — painted like the paved square in the town picture from earlier in this chat (or the attached one): same painting style, same colours, same light.

Seen straight from above: big flat irregular grey-brown flagstones fitted together, thin lines of snow in the joints, a light dusting of snow and a few footprints, each slab lit from the upper left with a soft cool shadow along its lower-right edge. Even all over (it repeats across the whole square and the game blends its edge into the streets): no pattern in the middle, no edge, no well, no drain, nothing big or eye-catching.

SEAMLESS: it must tile perfectly — what leaves the right edge comes back on the left edge and what leaves the bottom comes back at the top, with no visible seam or border, and the same brightness and colour all over (no vignette, no darker corner, no sunlight gradient across the picture).

LOOK: a hand-painted stylized game texture exactly like the ground in the town picture from earlier in this chat (or the attached one) — soft painted shading in 2–3 tones, clean and readable, matte; not photorealistic, not blurry, not pixel art, no outlines.

FORMAT: 1024×1024 square, the texture fills it edge to edge. No text, no letters, no logo, no frame.
```

**ⓗ ของเสริม 6 ชิ้น (พื้นเขียว 3×2) — รอบสอง** · แชตเดิม
```
Draw SIX separate extra objects for the same snowy Viking town, rendered exactly like my attached picture of game pieces (a Viking longhouse with a little hero standing at its door, a watchtower, a tent, fences, a campfire, a sled, firewood, a runestone and pines) and the town picture from earlier in this chat if there is one: a stylized 3D game look painted by hand — solid rounded volume, soft toon shading in 2–3 tones, one warm golden light from the upper left with soft cool-blue shadow sides, thin clean dark-brown hand-drawn outlines, matte painted textures (weathered wood, grey stone, iron, canvas, soft powdery snow), warm slightly retro storybook colours. Not photorealistic, not glossy, not flat 2D, not pixel art.

Seen from the same high isometric game camera as those pieces (about 38 degrees down, the world turned 45 degrees, no perspective): every object shows its top and its two front sides — one facing lower left, one facing lower right.

Size: the little hero at the longhouse door in the attached picture is the size of a person; size every object like the real thing next to that person (a barrel reaches a person's waist, a market-stall roof is a little higher than a person, a lamp post or a banner pole is about twice a person's height).

The 6 pieces: (1) a Viking longship pulled up on log rollers on the snow, its carved dragon prow pointing upper right, round shields along its side, a furled striped sail on the mast, snow in the hull; (2) a wooden weapon rack with spears, two axes and three round painted shields; (3) a blacksmith's yard set: an iron anvil on a stump, a grindstone wheel on a wooden frame and a quench barrel of water; (4) a round straw archery target on a wooden stand with two arrows in it; (5) a big iron cauldron on a stone fire ring with a little steam; (6) a wooden cart with a canvas cover, loaded with barrels.

SHEET: 1536×1024, a 3×2 grid, one piece per cell, centred, as big as the cell allows with empty space all round; each piece stands with its base at the bottom, with a little soft snow piled against its foot; no ground patch around it, no cast shadow. Background: solid flat pure green (#00FF00), no gradient — never use green on the objects (no moss, no grass roofs, no leaves: roofs are wooden shingles under snow). No text, letters, numbers or logo anywhere — not on signs, banners, boards or shields either.
```

**ⓘ รั้วไม้แหลมรอบเมือง 6 ชิ้น (พื้นเขียว 3×2) — รอบสอง** · แชตเดิม
```
Draw SIX separate pieces of a wooden town palisade for the same snowy Viking town, rendered exactly like my attached picture of game pieces (a Viking longhouse with a little hero standing at its door, a watchtower, a tent, fences, a campfire, a sled, firewood, a runestone and pines) and the town picture from earlier in this chat if there is one: a stylized 3D game look painted by hand — solid rounded volume, soft toon shading in 2–3 tones, one warm golden light from the upper left with soft cool-blue shadow sides, thin clean dark-brown hand-drawn outlines, matte painted textures (weathered wood, grey stone, iron, canvas, soft powdery snow), warm slightly retro storybook colours. Not photorealistic, not glossy, not flat 2D, not pixel art.

Seen from the same high isometric game camera as those pieces (about 38 degrees down, the world turned 45 degrees, no perspective): every object shows its top and its two front sides — one facing lower left, one facing lower right. The two directions must line up so the game can join them into one long wall.

Size: the little hero at the longhouse door in the attached picture is the size of a person; size every object like the real thing next to that person (a barrel reaches a person's waist, a market-stall roof is a little higher than a person, a lamp post or a banner pole is about twice a person's height).

The 6 pieces: (1) a straight section of palisade — a row of eight tall sharpened logs bound with rope, on a low bank of snow-covered earth, about two people high — running from lower left to upper right; (2) the same palisade section running from upper left to lower right; (3) a gate in the palisade running from lower left to upper right: two square log towers with snowy roofs and a big double plank gate between them, wide enough for three people; (4) the same gate in a palisade running from upper left to lower right; (5) a round corner tower of logs with a platform and a pointed snowy roof, where two palisade lines meet; (6) a short end piece of the palisade: three sharpened logs and a fallen one, as if the wall is broken off.

SHEET: 1536×1024, a 3×2 grid, one piece per cell, centred, as big as the cell allows with empty space all round; each piece stands with its base at the bottom, with a little soft snow piled against its foot; no ground patch around it, no cast shadow. Background: solid flat pure green (#00FF00), no gradient — never use green on the pieces (no moss, no grass roofs, no leaves: roofs are wooden shingles under snow). No text, letters, numbers or logo anywhere — not on signs, banners, boards or shields either.
```

## 15. เมืองไวกิ้ง iso เข้าเกมแล้ว → เมืองทดลอง isoTown (2026-11-27 07:24)
เจ้าของส่งรูป 13 รูปไม่มีข้อความ = อาคาร ⓑ ⓒ ⓓ · ของ ⓔ ⓕ ⓖ · ลายพื้น T7 T8 + มอน 2.5D กลุ่ม 1 ครบ 5 ตัว (ข้ามภาพลองลุค ⓐ — ลุคผ่านแล้วจากชุดหิมะ)

**ตัดเข้าเกม** (`tools/iso_art.py`, ชีตเก็บใน assets/iso/sheets/):
- `sheet B1 / B2 / B3` (2×2) → isoGreatHall isoChiefHouse isoSmithy isoTavern · isoTradePost isoHealer isoStable isoStorehouse · isoHomeA isoHomeB isoHomeC isoHomeD
- `sheet P1 / P2 / P3` (3×2) → isoWell isoWolfStatue isoShrine isoStallFur isoStallFish isoNotice · isoLampPost isoBrazier isoBannerWolf isoBannerAxe isoSignpost isoBench · isoBarrels isoCrates isoCart isoFishRack isoHay isoDummy
- `tex T7 / T8` → isoCobble (หินกรวด) · isoFlag (หินแผ่น) · `cat` → maps/iso-cat.js (80 รายการ)
- **ขนาดอาคารวัดจากประตู:** ChatGPT วาดประตูแต่ละหลังคนละสเกล → ตั้งความสูงให้บานประตู ≈ 62–70 พิกเซลแมพ (ฮีโร่ตัวใหญ่สุด 64, หมาป่า 2.5D 57, ประตูบ้านยาวชุดหิมะ 69) · ประตูคู่โถงใหญ่ ≈ 92 · ประตูคอกม้า ≈ 87 → บ้าน 245–350 สูง, โถงใหญ่ 375 (กว้าง 557)
- ควันปล่องไฟที่วาดมาออกเขียวหลังตัดพื้น → ตัวเลือก `dsp=1` ใน P (โรงตีเหล็ก โรงเหล้า บ้าน B บ้าน D) ทำให้เป็นควันเทาขาว · เสาตะเกียงตั้งจุดยึดที่ฐานเสา (`foot=1`) ไม่ใช่กลางรูป

**ผังเมือง isoTown** (maps/iso-maps.js · 4,000 × 3,000):
- โลกหมุน 45°: **ถนน A** จากประตูเมืองล่างซ้ายขึ้นไปจบที่บันไดโถงใหญ่ (ขวาบน) · **ถนน B** จากประตูบ้านหัวหน้า (ซ้ายบน) ลงไปประตูเมืองขวาล่าง · สองถนนตัดกันที่ลานหินแผ่น (รูปปั้นหมาป่าหอน บ่อน้ำ ศาลรูน แผงตลาด 2 แผง กระดานประกาศ ม้านั่ง กระถางไฟ)
- **กติกาประตู:** เห็นแค่ผนังหันลงซ้าย (SW) กับหันลงขวา (SE) และชิ้น iso ห้ามกลับด้าน → บ้านประตู SE อยู่ฝั่งตะวันตกเฉียงเหนือของถนน A (มองลงถนนทางขวาล่าง) · บ้านประตู SW อยู่ฝั่งตะวันออกเฉียงเหนือของถนน B · โถงใหญ่ปิดปลายถนน A บ้านหัวหน้าปิดปลายถนน B · ทุกบ้านมีทางหินกรวดสั้นๆ จากประตูลงถนน (helper `house(n, จุดถนน, ด้าน)` + ตาราง DOOR = จุดประตูวัดจากรูป)
- แถวหลังมีตรอกขนานถนน (ตรอกตะวันตก ตะวันออก เหนือ 2 ตรอก) · ทางแยกลงใต้ไปคอกม้า + ลานฝึก (หุ่นฟาง ราวตากปลา รั้ว) · หอสังเกตการณ์เฝ้าประตูเมือง 2 ข้าง · เสาตะเกียงสลับฝั่ง · ป่าสนล้อม + กลุ่มสน 8 กลุ่ม
- วาร์ป 'กลับเมืองหลวง' (ปลายถนน A) · 'ทุ่งสนน้ำแข็ง (iso)' (ปลายถนน B → isoField) · ไม่มีมอน · บ้านหลังอื่นยังเดินเข้าไม่ได้ (บริการ / NPC อื่นยังอยู่ frostheim เดิม)
- **โรงตีเหล็กเข้าห้องเดิม** (เจ้าของ 2026-11-27 'บ้านช่างตีเหล้กให้ลิ้งเข้าไปที่ห้องเดิมที่ทำไว้'): เดินเข้าประตูโรงตีเหล็ก (ประตูที่หน้าจั่วซ้าย) หรือคลิกตัวบ้าน → ห้องคราฟเดิมของฟรอสต์เฮล์ม (craft_vik, บียอร์น — ห้องเดียวกับที่เข้าจาก frostheim) · เดินออกพรมทางออก → กลับมายืนหน้าประตูโรงตีเหล็กใน isoTown (เข้าจาก frostheim ก็ยังออกไป frostheim เหมือนเดิม) · ป้าย '⚒ โรงคราฟ' ลอยเหนือประตู
  - วิธีทำ = **ประตูลิงก์** ใน npcs.js: ชิ้นในแมพที่มี `room:'<id ห้อง>'` เปิดห้องนั้น · `door` / `out` = จุดบันไดประตู / จุดยืนตอนออก (ระยะจากจุดยึดชิ้น, house() ใส่ให้ทุกหลังแล้ว: out = บันไดประตูขยับเข้าหาถนน 50 px) · `signH` = ความสูงป้าย · ทางกลับจำใน localStorage af_roomfrom_<ฮีโร่> (รีโหลดในห้องด้วยลิงก์ ?map=craft_vik ก็ยังออกมาที่ประตูนี้) · บ้านหลังอื่นจะลิงก์ห้องไหนก็ใส่ room ได้เลย
- ตรวจแล้ว: ตัวบ้านทุกหลังเดินทะลุไม่ได้ · เดินถึงหน้าประตูทุกหลัง (ห่างบันไดประตู 0–40 px) · จุดเกิด ลาน วาร์ปไปถึงได้ · isoField / vikF2 / frostheim ผังเหมือนเดิมทุกชิ้น (tools/perf/cmp.py)

**เข้าแมพ:** ⚙ → เลือกแมพ → กลุ่ม 'แมพทดลอง' → ฟรอสต์เฮล์ม (ทดลอง iso) · หรือลิงก์ `index.html?map=isoTown` (โหมดทดสอบ)

**มอน 2.5D กลุ่ม 1** (MONSTER25_PROMPTS_TH.md): ลูกหมาป่าหิมะ ภูตลูกสน กระต่ายเขี้ยวน้ำแข็ง ฟรอสต์ลิงใหญ่ ค้างคาวหินย้อยน้ำแข็ง → `tools/monster25_prompts.py cut` → assets/monsters/<ไฟล์>25.webp + monster25.js · เกมใช้แทนแผ่นเดิมทันที (`?mon25=0` = แผ่นเดิม) · เห็นได้ใน isoField / หุบเขี้ยวน้ำแข็ง (vikF2) / ป่าสนหิมะ

**ยังไม่ได้ทำ:** ของเสริมรอบสอง ⓗ (เรือมังกร) · รั้วไม้แหลม ⓘ (กำแพงเมือง) · ห้องในบ้านหลังอื่น / ย้ายบริการอื่นจาก frostheim (คาฟร่า คลัง ร้านค้า) · NPC 2.5D · ชิ้นความสูง · มอนกลุ่ม 2–6
