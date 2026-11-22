# ลานบอสโลก 7 ลาน — แมพเฉพาะของแต่ละตัว (2026-11-22)

เจ้าของ: *"ต่อไปอยากได้แมพเฉพาะสำหรับสู้กับบอสแต่ละตัวเข้าธีมกัน ขอพร้อมสร้างรูปมาทำแมพ"*
สถานะ: **สร้างแมพแล้วทั้ง 8 แมพ (2026-11-22)** · เข้าชมได้จากกิลด์มาสเตอร์ในเมืองหลวง (บอสยืนให้ดูเฉยๆ ยังไม่สู้) · รายละเอียดข้อ 7
- แทน "แอ่งเดียวเปลี่ยนของตกแต่งตามวัน" ใน WORLD_BOSS_WEEK_TH.md ข้อ 2 → บอสแต่ละตัวมีลานของตัวเอง (ตอบคำถามข้อ 12.2 แล้ว)
- ร่างปกติกับร่างแอดวานซ์ใช้ลานเดียวกัน (ร่างแอดวานซ์เพิ่มแค่ VFX ของกลไกเพิ่ม)

---

## 1. รูปกลายเป็นแมพยังไง
- **รูปพื้น 1 รูปต่อลาน** (1536×1024 มุมกล้องเดียวกับเกม)
  - วาดเฉพาะของที่แบนราบกับพื้น: กระเบื้อง ลายสลัก รอยแตก ทราย น้ำ กลีบดอก สัญลักษณ์ที่ทาบนพื้น
  - ในเกมขยาย 1.5 เท่า → แมพ 2,304 × 1,536 map px (โลก 2,304 × 2,477) · ลานกลม r ≈ 900–1,000 world px (ร่างเดิมของเออร์ทอค 1,100)
  - ขอบแมพคือส่วนที่รูปวาดไว้เอง: หน้าผา ทะเลเมฆ ห้วงดาว ป่า ขอบแอ่ง → ไม่ต้องใช้พื้นแบบลายซ้ำ
  - ทางเดินได้วัดจากรูป (ลานหิน สะพาน ที่ราบ) แล้วกันขอบด้วยช่องห้ามเดิน
- **รูปของตั้ง 1 แผ่นต่อลาน** (6 ชิ้น ตาราง 3×2 พื้นเขียว · มายาวีพื้นแดงม่วง)
  - ตัดเป็นชิ้นเหมือน VK_CAT (กว้าง สูง จุดเท้า วงชน) แล้ววางบนตำแหน่งที่รูปพื้นเว้นไว้ (ฐานเสา ฐานโคม หลุมเสียบเสา แปลงดอก)
  - ของที่มีหลายสถานะ (เสาล่อฟ้า ดอกตูม เศษหัวใจ โคม) อยู่ในแผ่นเดียวกัน
- **ค่ายกิลด์** (จุดเกิด ธงกิลด์ ร้านยา) ใช้ชิ้นจากแผ่นของเออร์ทอค วางที่ลานรับขอบล่างของทุกลาน
- **แสง**: วาดพื้นให้สว่างอ่านง่าย ส่วนอารมณ์ (กลางคืน พายุ รุ่งเช้า) ใส่ด้วยโทนสีแมพในเกม (mood)
- **ตัดรูป**: /home/claude/work/wb2/cut2.py แบบเดียวกับรูปบอส · ตรวจในเกมก่อนส่งให้ดู

## 2. ตาราง 7 ลาน
| วัน | บอส | ลาน | บนรูปพื้น | ของตั้ง 6 ชิ้น | mood |
|---|---|---|---|---|---|
| อาทิตย์ | เคปรา | ลานนาฬิกาแดดกลางทะเลทราย | ลานหินทรายนาฬิกาแดด · ฐานเสา 6 ฐาน · รอยไหม้ลูกอาทิตย์กลิ้ง | โอเบลิสก์ · โอเบลิสก์หัก · รูปปั้นด้วง · ซากเสาคู่ · หินโผล่ทราย · ธงจานสุริยะ | กลางวันจ้า |
| จันทร์ | ปุยจันทรา | ลานหินจันทร์ลอยฟ้า | ลานหินขาว · ข้างขึ้นข้างแรม 8 ช่องพร้อมฐานโคม · ลายสลักกระต่ายตำครก · ห้วงดาวรอบนอก | โคมจันทร์ติด / ดับ · พงหญ้าสุสุกิเงิน · ชั้นวางดังโงะ · หินจันทร์ผลึกเรือง · ซุ้มประตูจันทร์เสี้ยว | กลางคืน |
| อังคาร | บุรุมบา | สมรภูมิกลองศึก | ดินสมรภูมิ · ลายก้นหอยชมพูกลางลาน · รอยเท้าช้าง · ตอกำแพงเป็นวง ช่องเข้า 4 ทิศ | กำแพงไม้แหลม · หอระวังพัง · ประตูทัพวิญญาณ (จุดเกิดทัพผี) · ธงศึก · เครื่องกีดขวางหนาม · ชั้นวางอาวุธ | เย็นฝุ่นตลบ |
| พุธ | มายาวี | สวนวัดร้างหลากสี | ลานวัดมีมอส · สีสาด · แปลงดอก 7 แปลง (เว้นทางเข้าด้านล่าง) · บ่อบัว · รอยเท้ากิ้งก่า | ดอกตูม ปิด / แตกสาดสี / เหี่ยวหลังแตก · เสาวัดพันเถาวัลย์ · รูปปั้นกิ้งก่าเฝ้าวัด · กอเฟิร์น (ขอบ) | กลางวันชื้น |
| พฤหัส | บรอนทารา | ยอดผาอัสนี | ที่ราบบนยอดผา · ภาพสลักนกอัสนีเรืองฟ้า · รอยฟ้าผ่า · หลุมเสียบเสา 5 หลุมรอบขอบ · เมฆพายุรอบนอก | เสาล่อฟ้า หลับ / ตื่น / เต็ม · ยอดหินแหลม · ต้นไม้ตายลู่ลม · แนวเมฆพายุ (วางตามขอบผา) | พายุ |
| ศุกร์ | ลูมินา | สะพานหินกลางทะเลเมฆ (+ ห้องในท้องวาฬ) | ลานหินขาวลอย · ดาวรุ่งทองกลางลาน · สะพาน 3 สายไปลานเล็ก · ทะเลเมฆรุ่งเช้า | โคมศาลเจ้า · ซุ้มหินหัก · เสายอดดาว · ก้อนเมฆรุ่งเช้า · เศษหัวใจดาว ปกติ / ร้าว | รุ่งเช้า |
| เสาร์ | เออร์ทอค | แอ่งโทเท็มแตก | แอ่งหินม่วงเทา · รอยรากโทเท็มกลางแอ่ง · 5 เขตสีตามแดน (ทิศตามแผนที่โลก) · ลานค่ายกิลด์ขอบล่าง | ซากโทเท็มหน้าหมี · ซากหน้านกฮูก + หมาป่า · หินขอบแอ่ง · เต็นท์กิลด์ · ธงกิลด์ + หินจุดเกิด · ลังเสบียง + แผงยา | พลบค่ำ |

- 5 เขตของแอ่งเออร์ทอคหันตามแผนที่โลก (worldmap.js): บน = ไวกิ้ง · ขวาบน = ญี่ปุ่น · ขวา = อียิปต์ · ล่าง = แอซเท็ก · ซ้าย = กรีก
- ห้องในท้องวาฬเป็นแมพเล็กแยก (ผู้เล่นที่ถูกกลืนย้ายไปที่นี่ 25 วิ) → รูปพื้นอีก 1 รูป เศษหัวใจดาวใช้ชิ้นจากแผ่นของลูมินา
- รวมรูปที่ต้องเจน: พื้น 8 · แผ่นของตั้ง 7 = **15 รูป**

## 3. รูปที่ต้องแนบ (ทุกครั้งที่เริ่มแชทใหม่)
- รูปปกแคมป์ไฟ (สไตล์)
- **tools/ref/arena_camera_ref.jpg** = ภาพในเกมจริง ไม่มีตัวหนังสือ (ลานน้ำพุเมืองหลวง + ฮีโร่ 10 ตัว) บอกมุมกล้องและขนาดตัวละคร · ลานกลมกลายเป็นวงรีแบบนี้
- ทำด้วย /home/claude/work/wb4/ref.py (ซ่อน HUD ปิดตัวหนังสือบนแคนวาส) + ลบป้ายเปล่าด้วย cv2.inpaint

## 4. พรอมต์ (แชทใหม่ · ส่งข้อ 0 ก่อนพร้อมรูปแนบ 2 รูป · แล้วส่งทีละข้อ)

**0 — กติกา (ส่งครั้งเดียวต่อแชท)**
```
I'm making boss arena maps for my 2D isometric fantasy MMORPG (Ragnarok Online feel). Attached: the campfire key art = the art style to copy exactly, and a screenshot of my game = the camera angle and scale to match.
Style for every picture: friendly hand-painted chibi cartoon like the key art, clean dark-brown outlines, cel shading with 2–3 flat tones, soft light from the top-left, bright warm colours, big clear shapes with simple texture (no tiny noisy detail, no photo texture). Not realistic, not painterly smoke, not 3D. Never any text, letters, numbers, logos, UI or characters.
Camera for every picture: the same high three-quarter top-down view as the screenshot, so anything round on the ground looks like a wide flat ellipse about 1.6 times wider than tall.
I will ask for two kinds of picture, one per reply:
FLOOR = a 1536×1024 picture of a whole arena ground, filling the image to every edge (no frame, no vignette). Only flat things that lie on the ground: tiles, carvings, cracks, sand, water, petals, painted symbols. No standing objects at all (no pillars, trees, statues, lanterns, walls, big rocks) — I add those separately. Scale: a hero from the screenshot would be about 55 pixels tall in this picture. Keep it bright and readable even for night or storm arenas; I add the mood in the game.
PROPS = a 1536×1024 sheet of 6 separate objects in a 3×2 grid, one per cell, each centred in its cell and as big as the cell allows with a little empty space around it, same camera angle, standing with its base at the bottom, no ground under it and no cast shadow. Background: solid flat pure green (#00FF00) unless I say otherwise; never use the background colour on the objects.
Reply only "OK" now. Then draw exactly one picture for each prompt I send.
```

**1 — พื้น อาทิตย์ เคปรา**
```
FLOOR — SUNDIAL SANDS, the arena of Khepra the sun scarab. A huge round sandstone sundial plaza in a red-gold desert, about 80% of the image wide. Outer ring: carved tiles of suns and scarabs with 12 gold hour marks. Inside: gold hour lines radiating to a big round sun mosaic in gold and ruby red in the centre. Six empty square stone plinths spaced evenly around the rim (flat tops: I place obelisks on them later). Two long curved scorched grooves cross the plaza, as if a burning ball rolled over it. Sand drifts spill over the plaza edge; rippled red-ochre dunes fill the rest of the image to every edge. A flat sandy clearing at the bottom centre (the arrival camp).
```

**2 — ของตั้ง อาทิตย์ เคปรา**
```
PROPS — SUNDIAL SANDS, 6 objects: (1) a tall sandstone obelisk with a gold pyramid cap, carved with sun discs and scarabs, about 4 times as tall as wide; (2) the same obelisk broken in half with a cracked top; (3) a big stone scarab statue sitting on a block; (4) two ruined sandstone columns joined by a cracked lintel; (5) a low sandstone rock outcrop half buried in a sand drift; (6) a tall gold sun-disk standard on a red pole with red ribbons. Red, gold and sandstone colours. Green background, no green on the objects.
```

**3 — พื้น จันทร์ ปุยจันทรา**
```
FLOOR — MOONSTONE TERRACE, the arena of Puijantra the moon rabbit. A huge round terrace of smooth pale moonstone floating in a starry night sky, about 80% of the image wide. Around its rim, eight carved moon phases from new moon to full moon, inlaid in pale gold, each with a small round lantern base beside it. In the centre, a big gold line carving of a rabbit pounding a mortar. Small meteor craters and soft silver cracks in the stone. The terrace edge crumbles into a deep-blue starry void with a few tiny floating rocks; the void fills the corners. A flat stone landing at the bottom centre (the arrival camp).
```

**4 — ของตั้ง จันทร์ ปุยจันทรา**
```
PROPS — MOONSTONE TERRACE, 6 objects: (1) a tall pale stone moon lantern in Japanese style with a crescent-shaped window, glowing warm pale gold inside; (2) the same lantern unlit and dark; (3) a clump of silver-white pampas grass with feathery plumes; (4) a small wooden moon-viewing offering stand with a pyramid of white rice dumplings; (5) a pale moon-rock boulder with glowing gold crystal veins; (6) a crescent-moon shaped stone arch gate. Silver-white, pale gold and soft blue. Green background, no green on the objects.
```

**5 — พื้น อังคาร บุรุมบา**
```
FLOOR — WAR-DRUM BATTLEFIELD, the arena of Burumba the war mammoth. A wide round battlefield of trampled brown earth with patches of dry yellow-brown grass, about 80% of the image wide. In the centre, a giant faded pink spiral war emblem painted on the ground. Huge round mammoth footprints, chariot wheel ruts, broken spears and shields lying flat, scorched patches. Around the field runs a ring of flat burnt stumps where a wooden wall once stood, with four wide gaps (top, right, bottom, left) where trampled paths lead out to the image edges. A flat clearing outside the bottom gap (the arrival camp). No green grass.
```

**6 — ของตั้ง อังคาร บุรุมบา**
```
PROPS — WAR-DRUM BATTLEFIELD, 6 objects: (1) a straight segment of a broken wooden palisade wall of sharpened logs tied with pink war ribbons, wider than tall; (2) a small broken wooden watchtower; (3) a ghost-army gate: two tall war poles with pink banners and a swirl of pale-blue spirit mist between them; (4) a tall pink war banner on a pole with a spiral emblem; (5) a spiked wooden barricade; (6) a weapon rack with spears and round shields. Rose-pink, brown wood and bronze. Green background, no green on the objects.
```

**7 — พื้น พุธ มายาวี**
```
FLOOR — GARDEN OF A THOUSAND HUES, the arena of Mayawee the chameleon. A round courtyard of an overgrown jungle temple, about 80% of the image wide: mossy grey-gold stone tiles, roots creeping across the stones, bright paint splashes in red, orange, yellow, turquoise and blue, and drifts of colourful petals. Seven round soil flower beds spaced evenly around the courtyard rim, leaving the bottom open for the entrance path (empty: I place giant flower buds in them later). A shallow lotus pond curves along one side. Small chameleon footprints wander across the tiles. Lush jungle floor (ferns and big leaves lying flat) fills the image outside the courtyard to every edge. A flat tiled landing at the bottom centre (the arrival camp).
```

**8 — ของตั้ง พุธ มายาวี** (พื้นแดงม่วง เพราะของเป็นสีเขียว)
```
PROPS — GARDEN OF A THOUSAND HUES, 6 objects: (1) a giant closed flower bud as tall as a person, glossy turquoise and gold petals with swirling paint glowing inside; (2) the same bud bursting open, splashing bright red, orange, yellow and blue paint upward; (3) the same flower after bursting: open, drained and drooping; (4) a ruined temple pillar wrapped in jungle vines; (5) a stone chameleon guardian statue on a plinth; (6) a big clump of jungle ferns and broad leaves with twisted roots. Background: solid flat pure MAGENTA (#FF00FF); never use pink, purple or magenta on the objects.
```

**9 — พื้น พฤหัส บรอนทารา**
```
FLOOR — THUNDER PEAK, the arena of Brontara the thunderbird. A wide rocky mountain-top plateau of grey-brown stone high above a sea of storm clouds, about 80% of the image wide. In the centre, a giant thunderbird carved into the rock like an ancient petroglyph, its grooves glowing faint blue. Black lightning scorch stars with glassy centres, rain puddles, windswept yellow-brown grass lying flat. Five round carved stone sockets spaced evenly around the plateau rim (empty: I place lightning-rod totems in them later). The plateau edges drop away as cliffs into dark rolling clouds that fill the image to every edge. A flat rock landing at the bottom centre (the arrival camp).
```

**10 — ของตั้ง พฤหัส บรอนทารา**
```
PROPS — THUNDER PEAK, 6 objects: (1) a carved wooden totem pole topped with a copper lightning rod, asleep: dull wood, no glow; (2) the same totem awake: its carvings glow blue-white and small arcs crackle around the copper rod; (3) the same totem fully charged: three bright glowing notches and blinding blue-white light at the top; (4) a tall weathered rock spire; (5) a wind-bent dead tree without leaves; (6) a low bank of dark storm clouds with gold-lit edges (to lay along cliff edges). Orange wood, copper, grey stone, blue-white light. Green background, no green on the objects, no green lightning.
```

**11 — พื้น ศุกร์ ลูมินา**
```
FLOOR — CLOUD-SEA BRIDGE, the arena of Lumina the sky whale. A big round floating platform of white stone with gold star inlays and carved constellation lines, about 75% of the image wide, in a sea of fluffy clouds at dawn (pink, peach and gold light). In the centre of the platform, a big gold eight-pointed morning-star mosaic. Three narrow stone bridges lead from the platform to small round floating landings: one at the bottom centre (the arrival camp), one at the far left, one at the far right. Clouds fill every gap and the image to every edge.
```

**12 — ของตั้ง ศุกร์ ลูมินา**
```
PROPS — CLOUD-SEA BRIDGE, 6 objects: (1) a white-and-gold shrine lantern post with a glowing star inside; (2) a broken white stone arch with gold trim; (3) a slim white pillar topped with a glowing gold star; (4) a big fluffy dawn cloud in pink and gold, to lay along the platform edges; (5) the star-heart shard: a big glowing pale-blue crystal shard as tall as two people, set in a gold ring base, stars twinkling inside; (6) the same shard badly cracked with light leaking out. White, gold, light blue and dawn pink. Green background, no green on the objects.
```

**13 — พื้น ห้องในท้องลูมินา**
```
FLOOR — INSIDE LUMINA, the small room players are swallowed into. The inside of a gentle sky whale seen from the same camera: a round chamber about 85% of the image wide, edged by a ring of soft ribbed walls in pale blue and lilac with glowing gold star veins. The floor is smooth and slightly glossy, with a shallow glowing turquoise pool along the outer edge. In the centre, an empty round glowing crater (a big crystal shard goes there later). Swallowed things lie around: a ship's wheel, barrels, coins, feathers, bubbles. Cute and dreamy, not gross. Flat things only, except the soft walls around the edge.
```

**14 — พื้น เสาร์ เออร์ทอค**
```
FLOOR — TOTEM CRATER, the arena of Urtok the totem-bearing tortoise. A huge round crater of cracked violet-grey stone, about 85% of the image wide, sloping gently up to a rocky rim at the image edges. In the centre, the burnt spiral scar where the roots of the Great Totem were torn out. The crater floor is split into five wedge zones, each tinted by its land: top = icy blue stone with frost and Norse runes, top right = dark stone strewn with cherry-blossom petals, right = golden sand with Egyptian hieroglyph slabs, left = white-gold marble tiles with a Greek key border, bottom = turquoise and black obsidian Aztec step-pattern tiles. At the bottom centre the rim opens onto a flat clearing (the guild camp).
```

**15 — ของตั้ง เสาร์ เออร์ทอค + ค่ายกิลด์**
```
PROPS — TOTEM CRATER and the GUILD CAMP, 6 objects: (1) a huge fallen chunk of the Great Totem: carved brown wood with a roaring bear face, its broken ends glowing gold; (2) another fallen chunk with an owl face and a wolf face; (3) a pile of crater-rim boulders in violet-grey stone; (4) a big guild camp tent of red and gold canvas with an open front; (5) a tall guild banner pole beside a round respawn totem stone glowing teal; (6) supply crates, barrels and a small potion stall with coloured bottles. Green background, no green on the objects.
```

## 5. ขั้นตอนสร้าง (ทำแล้ว 2026-11-22 — ผลอยู่ข้อ 7)
1. เก็บรูปดิบที่ assets/bosses/world/arena/<ชื่อลาน>_floor.png + _props.png · ตัดของตั้งเป็นชิ้น (cut2.py + แบ่งช่อง 3×2)
2. สร้างแมพ (fieldmap.js host แบบเมืองหลวง: groundImg = รูปพื้น ×1.5 · land = ของตั้งบนตำแหน่งที่วัดจากรูป · ช่องห้ามเดินจากรูป · mood ต่อลาน)
3. วางบอสกลางลาน + ฮีโร่เทียบขนาด → ส่งภาพให้ดูทีละลาน
4. ทางเข้า: กิลด์มาสเตอร์ในเมืองหลวง (แทนประตูบอสโลกเดิม Aether Wyrm)

## 6. คำถามถึงเจ้าของ
1. ~~ลานขนาด r ≈ 900–1,000 (เล็กกว่าร่างแรกของเออร์ทอคเล็กน้อย เพื่อให้รูปพื้นไม่เบลอ) โอเคไหม~~ → **ตอบแล้ว (2026-11-22 23:50): ขนาดโอเค**
2. ~~ดอกตูมของมายาวี: รูปพื้นวาดแปลงดอกมา 7 แปลง (ไม่ใช่ 8) → ใช้ 7 ดอก หรือจะให้เจนรูปพื้นใหม่ที่มี 8 แปลง~~ → **ตอบแล้ว (2026-11-22 23:49): ใช้ 7 ดอก** (แก้ในเอกสารบอสสัปดาห์และพรอมต์รูปพื้นแล้ว)

## 7. สร้างแล้ว (2026-11-22)
| แมพ (id) | ลาน | mood | ของตั้งที่วาง |
|---|---|---|---|
| wbKhepra | ลานนาฬิกาแดด | desert | โอเบลิสก์ 4 + หัก 2 บนฐาน 6 ฐาน · ธงจานสุริยะ 2 (ประตูเข้าลาน) · หิน 4 · ซากเสาคู่ 2 · รูปปั้นด้วง 2 · ค่ายกิลด์ |
| wbPuijantra | ลานหินจันทร์ | moon | โคมจันทร์ติด 6 + ดับ 2 (ใกล้จันทร์ดับ) บนฐานโคมในรูป · ซุ้มจันทร์เสี้ยวคร่อมทางเข้า · ดังโงะ · หินจันทร์ 2 · หญ้าสุสุกิ 4 · หินจุดเกิด |
| wbBurumba | สมรภูมิกลองศึก | dusk (ใหม่) | ตอกำแพงเป็นแนวกั้น ช่องเข้า 4 ทิศ · กำแพงไม้ 3 · ประตูทัพวิญญาณ 2 (ช่องซ้าย/ขวา) · เครื่องกีดขวางช่องบน 2 · ธงศึก 2 · หอระวัง 2 · ชั้นอาวุธ 2 · ค่ายกิลด์ |
| wbMayawee | สวนวัดร้างหลากสี | jungle | ดอกตูม 7 ในแปลง 7 แปลง · เสาวัด 4 มุม · รูปปั้นกิ้งก่า 2 (ประตู) · กอเฟิร์น 4 · บ่อบัว/แปลงดอกเดินไม่ได้ · หินจุดเกิด + ร้านยา |
| wbBrontara | ยอดผาอัสนี | dragon (ฝน พายุ) | เสาล่อฟ้า (หลับ) 5 ในหลุม 5 หลุม · ยอดหิน 2 · ต้นไม้ตาย 2 · เมฆพายุ 4 รอบหน้าผา · ค่ายกิลด์ · นกลอยเหนือเงา |
| wbLumina | สะพานทะเลเมฆ | sun | เสายอดดาวบนลานข้าง 2 · โคมศาลเจ้า 2 · ซุ้มหักคร่อมสะพานล่าง · ก้อนเมฆ 4 · หินจุดเกิดบนลานล่าง · วาฬลอยเหนือเงา |
| wbLuminaIn | ในท้องลูมินา | dream (ใหม่) | เศษหัวใจดาว (สูง 400) กลางหลุม · ของที่ถูกกลืนในรูปเดินชนได้ · ทางออก → สะพานของลูมินา |
| wbUrtok | แอ่งโทเท็มแตก | dusk (ใหม่) | ซากโทเท็มหน้าหมี + หน้านกฮูก/หมาป่า ริมแอ่ง · เสา / โคม / ศิลาที่วาดในรูปเดินชนได้ · ค่ายกิลด์ |

- **ไฟล์**: รูปดิบแผ่นของตั้ง assets/bosses/world/arena/<ลาน>_props.png · รูปพื้น + ชิ้นที่ตัดแล้ว maps/wboss/*.webp · แมพ maps/wboss-arenas.js (สร้างจาก **tools/wboss_arenas.py** — แก้ตำแหน่งในไฟล์นั้นแล้วรันใหม่ อย่าแก้ .js ตรงๆ) · `python3 -I tools/wboss_arenas.py preview` = ภาพเช็คเลย์เอาต์ที่ /tmp/wboss_pv
- **ขนาด**: แมพ 2,304 × 1,536 map px (รูปพื้น ×1.5) · กล้องถอยในลาน ×0.8 (มือถือ ×0.7, cfg.camZoom / camZoomMob) · บอส 400 px กว้าง · นอกขอบแมพวาดรูปพื้นแบบกระจกสะท้อนเข้มลง (cfg.mirror) แทนพื้นว่างเทาๆ ใต้ค่ายกิลด์
- **เดินได้**: cfg.walk (วงรี / รูปหลายเหลี่ยม) ลบ cfg.block ลบ cfg.blockLines (เส้นหนา เช่น แนวตอไม้บุรุมบา) · ช่องที่หลุดจากพื้นที่หลักถูกถมทิ้ง ไม่เจาะทาง
- **ทางกลับ**: วาร์ป "กลับเมืองหลวง" บนวงเรืองแสงหน้าหินจุดเกิด (ไปประตูใต้เมืองหลวง) · ห้องในท้องวาฬ → ออกไปสะพานของลูมินา
- **บอส**: ตอนนี้เป็นรูปต้นแบบยืนนิ่งกลางลาน (land preview:1) — พอสร้างการต่อสู้จริงให้ลบออกจาก tools/wboss_arenas.py
- **ทางเข้า**: กิลด์มาสเตอร์ลีโอนาร์ด → "🗺 ลานบอสโลก 7 ลาน" (ทดสอบ: ?map=wbKhepra … wbUrtok, wbLuminaIn) · ประตูบอสโลกเดิม Aether Wyrm ยังอยู่จนกว่าจะสร้างบอสจริง
- **ยังไม่ทำ**: กลไกบอส / ของที่เปลี่ยนสถานะ (ดอกตูมแตก เสาล่อฟ้าตื่น โคมดับ เศษหัวใจร้าว — รูปพร้อมแล้วใน VK_CAT: wbMaBudBurst/Drained · wbBrRod1/2 · wbPuToroDark · wbLuShardCrack) · ร่างแอดวานซ์ใช้ลานเดียวกัน

