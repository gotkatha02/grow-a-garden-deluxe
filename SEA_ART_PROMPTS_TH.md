# ภาพโซนทะเลห้าฝั่ง (Lv 60–70) — พรอมต์เจนรูปทั้งหมด (2026-11-25)

เจ้าของ 07:22: *"โซนทะเลผมจะให้เป็น 60-70 ขอพร้อมเจนรูปด้วย"*
สถานะ: **พรอมต์อย่างเดียว ยังไม่มีอะไรในเกม** · แผนโซน เรื่อง แมพ เลเวล: SEA_ZONE_TH.md

---

## 0. ต้องเจนอะไรบ้าง

| หมวด | รูป | อยู่ที่ |
|---|---|---|
| ภาพปกโซน (ภาพโหลด + ตัวคุมหน้าตาโซน) | 1 | ข้อ 2.1 |
| แผนที่โลก: เติมหมู่เกาะที่อ่าวขวาล่าง | 1 | ข้อ 2.2 |
| พื้นลายซ้ำ 15 + กำแพงดันเจี้ยน 3 | 18 | ข้อ 3 |
| ของประกอบแมพ (แผ่นละ 4 / 6 / 12 ชิ้น) | 21 แผ่น (150 ชิ้น) | ข้อ 4 |
| NPC 4 ตัว + ห้องช่าง | 5 | ข้อ 5 |
| บอส 4 ตัว + แผ่นหนวดคราเคน | 5 | ข้อ 6 |
| มอน 37 ตัว (แผ่นท่าทาง 5 แถว) | 37 | `monster_prompts/08_sea.txt` |
| มินิบอส 8 ตัว | 8 | `miniboss_prompts/7_sea.txt` |
| ไอคอนวัตถุดิบทะเล (ทีหลัง) | 1 | ข้อ 7 |

**ทำเป็น 4 ชุดตามชั้นของทะเล** — ชุดไหนครบ ผมสร้างแมพชั้นนั้นได้เลย

| ชุด | ชั้น (Lv) | รูปที่ต้องมี | จำนวน |
|---|---|---|---|
| **1 ★ เริ่มที่นี่** | ผิวน้ำ: ท่าเรือ + หาด 3 แมพ (60–64) | ภาพปก · แผนที่โลก · พื้น T1–T6 · แผ่น S1–S10 · NPC 4 + ห้อง · บอสราน · มอน #1–#11 · มินิบอส #1–#2 | 37 |
| 2 | น้ำตื้น: แนวปะการัง ป่าสาหร่าย เรือผีจม (63–67) | พื้น T7–T11 · กำแพง W1 · แผ่น S11–S14 · บอสฟุนะยูเรย์ · มอน #12–#24 · มินิบอส #3–#5 | 27 |
| 3 | น้ำกลาง: ซากนครห้าแดน วังมุก วิหารจมน้ำ (66–69) | พื้น T12–T14 · กำแพง W2 · แผ่น S15–S19 · บอสชาลชิวทลีกเว · มอน #25–#31 · มินิบอส #6 | 18 |
| 4 | ห้วงลึก: บ่อรากโลก 3 ชั้น (68–70) | พื้น T15 · กำแพง W3 · แผ่น S20–S21 · คราเคน + หนวด · มอน #32–#37 · มินิบอส #7–#8 | 14 |

**ไม่ต้องเจน (โค้ดทำ):** แสงคลื่นบนพื้น ลำแสงจากผิวน้ำ ฟอง ละอองลอย สีฟ้าตามความลึก ความมืดห้วงลึก สาหร่ายไหว ฝูงปลาเล็ก โดมฟองอากาศคลุมวังมุก ฟองอากาศรอบตัวฮีโร่
**ใช้ของที่มีอยู่แล้ว (ไม่ต้องเจนซ้ำ):** ต้นมะพร้าว / อินทผลัม (azPalmTall · azPalmShort · azPalmSmall · azPalmFruit · egPalmLean · egPalmTwin) · เรือญี่ปุ่น jpShip (จอดที่ท่า) · ท่าน้ำ azDock / azDock2 · ราวตากแห grNetRack / jpNetRack · ตลิ่งลำธาร grBank0–7 · หลังกำแพงถ้ำ caveTop

## 1. รูปที่ต้องแนบ (ผมทำให้แล้ว อยู่ใน repo ส่งให้ในแชทนี้ด้วย)
- **รูปปกแคมป์ไฟ** `assets/loading/ld5.webp` = สไตล์เกม → แนบทุกแชท
- **`tools/ref/sea_map_ref.jpg`** = ของประกอบแมพที่มีในเกมแล้ว 12 ชิ้น (ไม่มีหิมะ) → บอกมุมกล้อง ความหนาเส้น สีของชิ้นส่วนแมพ → แนบในแชทแมพ
- **`tools/ref/npc_ref.jpg`** = NPC ที่มีในเกม (บีเวอร์คลัง · ช่างวอลรัส · ช่างทานุกิ) → แนบในแชท NPC
- **`tools/ref/room_ref.jpg`** = ห้องช่างญี่ปุ่นที่มีในเกม → แนบตอนเจนห้องช่าง
- **`assets/ui/worldmap_bg.webp`** = ภาพแผนที่โลกตอนนี้ → แนบตอนแก้แผนที่โลก
- **รูปบอสที่เคยเจน 1 รูป** (เช่น ควอทซัลโคอาทล์ หรือ ไทฟอน) → แนบในแชทบอส
- พอได้ **ภาพปกทะเล (ข้อ 2.1)** ที่ชอบแล้ว ให้แนบมันเพิ่มในแชทแมพ / มอน / บอสของทะเลทุกแชท จะได้สีและบรรยากาศเดียวกันทั้งโซน

**วิธีส่ง**
- แชทแมพ: แนบ ld5 + sea_map_ref.jpg → ส่งพรอมต์ 0 (ข้อ 3.0) รอตอบ OK → ส่งทีละกล่อง (T…, W…, S…) ได้รูปแล้วส่งกล่องถัดไป
- ภาพเริ่มเพี้ยนหลังเจนไป ~15 รูป (สไตล์เปลี่ยน พื้นไม่เขียว ของชนกัน) → เปิดแชทใหม่ ส่งพรอมต์ 0 ใหม่
- ชิ้นไหนไม่ถูกใจ: แปรงเลือกเฉพาะชิ้นนั้นแล้วสั่งวาดใหม่ อย่าสั่งแก้ทั้งรูป (มันจะวาดใหม่หมด)
- มีสีเขียวติดบนของในแผ่นพื้นเขียว → แปรงเลือกชิ้นนั้นสั่งเปลี่ยนสี (ตอนตัด สีเขียวบนของจะหายไปด้วย)
- พื้นลายซ้ำที่ต่อขอบไม่เนียน ไม่เป็นไร ผมแก้รอยต่อเองตอนตัด
- ส่งรูปกลับมาพร้อมบอกรหัสกล่อง (เช่น "S4") จะได้ตัดชื่อถูก

---

## 2. ภาพปก + แผนที่โลก

### 2.1 ภาพปกโซน (แชทใหม่ · แนบ ld5)
ใช้เป็นภาพโหลดเกมรูปที่ 9 และเป็น "ตัวคุมหน้าตา" ของทั้งโซน (ครึ่งบนผิวน้ำ ครึ่งล่างใต้น้ำ) · ไม่มีฮีโร่ในภาพ (ใส่ฮีโร่ทีหลังได้ถ้าอยาก)
```
Loading-screen key art for the new sea region of my 2D fantasy MMORPG, in exactly the art style of the attached key art: friendly hand-painted chibi cartoon, thick clean dark-brown outlines, cel shading with 2–3 flat tones, soft warm light, bright saturated colours, cosy and magical. Not realistic, not painterly, not 3D. No text, no logo, no UI.
Landscape 1536×1024. Keep everything important inside the middle band: the top and bottom 7% may be cropped.
THE SEA OF FIVE SHORES — one picture split by the water line across the middle: half above the sea, half below it.
ABOVE, at golden sunset: a turquoise lagoon framed by giant golden roots that arch out of the sea like the roots of a colossal tree, faint turquoise light glowing in their cracks. On the roots sits a small harbour town of wooden stilt houses with seashell roofs, rope ladders and lanterns, and a lighthouse wrapped around a root with a glowing turquoise crystal lamp. Five ships of five cultures are moored at the wooden pier: a Viking dragon longship, a Greek warship with a painted eye, a Japanese ship with a straw-mat sail, an Egyptian reed boat and an Aztec feathered canoe. An old sea turtle in a straw hat waves from the pier.
BELOW, in clear sunlit water full of light rays and bubbles: a reef of pink, orange and clear-blue crystal coral, tall golden kelp, drowned ruins (a toppled marble column, a red sea shrine gate, a giant pharaoh head half in the sand), schools of small bright fish, and at the very bottom, where the water turns dark, the glowing tip of a giant golden root with one huge golden eye of an enormous kraken looking up from the darkness.
```

### 2.2 แผนที่โลก (แชทใหม่ · แนบ worldmap_bg.webp)
1. แนบรูปแผนที่โลก → ใช้แปรงเลือก **เฉพาะทะเลมุมขวาล่าง** (ใต้ชายฝั่งทะเลทราย และทางขวาของชายฝั่งป่า — ทะเลว่างทั้งมุม) 2. ส่งพรอมต์นี้
- ผมจะเก็บรูปที่ได้เป็น `worldmap_bg_sea.webp` ก่อน ใช้จริงตอนเปิดโซน (ไม่ให้เกาะโผล่บนแผนที่ก่อนมีแมพ)
```
Edit only the selected area of this fantasy world map and keep everything outside it exactly as it is. In the same hand-painted parchment-map style as the rest of the map, paint a chain of six to eight small tropical islands in that sea: golden sand beaches with a few palm trees, turquoise shallow lagoons around them, and on the largest island several giant golden roots arching out of the sea like the roots of a colossal tree, with a tiny harbour town on them. In the middle of the island ring, a patch of very dark deep-blue water with a faint glowing golden spot (a deep sea well). No text, no labels, no icons, no compass.
```

---

## 3. แมพ: พรอมต์กลาง + พื้นลายซ้ำ + กำแพง

### 3.0 พรอมต์กลาง (ส่งครั้งแรกของทุกแชทแมพ · แนบ ld5 + sea_map_ref.jpg)
```
I'm making a new sea region for my 2D isometric fantasy MMORPG (Ragnarok Online feel): golden-root islands, a harbour town, turquoise lagoons, coral reefs, golden kelp forests, a sunken ghost ship, drowned cities and a dark abyss. Attached: (1) the campfire key art = the art style to copy exactly, (2) a board of map pieces that are already in my game = the camera angle, outline weight, colours and finish to match. Never copy the board's layout or its objects.
Style for every picture: friendly hand-painted chibi cartoon like the key art, clean dark-brown outlines, cel shading with 2–3 flat tones, soft light from the top-left, bright warm saturated colours, big clear shapes with simple texture (no tiny noisy detail, no photo texture). Not realistic, not painterly, not 3D. Never any text, letters, numbers, logos, UI or characters unless I ask for one.
Underwater things are drawn fully lit in their own bright colours, not tinted blue, with no water drawn around them — I add the underwater blue, light rays, bubbles and floating specks in the game.
I will ask for three kinds of picture, one per reply:
TEXTURE = a 1024×1024 square of ground seen from straight above. Flat even light, no shadows falling into it, no big landmark and no object, small details spread evenly. It must tile seamlessly: its left edge continues into its right edge and its top edge into its bottom edge.
PIECES = a 1536×1024 sheet of separate objects in the grid I give (2×2, 3×2 or 4×3), one object per cell, each centred in its cell and as big as the cell allows with clear empty space around it — nothing touches a neighbour or the image edge. The same high three-quarter top-down camera as the board (about 35° from above). Each object stands upright on its own small footing (a little sand, rock or planks right under it) with no other ground and no cast shadow. Objects that stand in the sea have only a thin white foam ring where they meet the water. Flat objects (piers, pools, mats) are drawn lying flat on the ground from the same camera.
WALL = a 1536×1024 picture of one long straight dungeon wall seen from the front, drawn across the full width as a band about 300 pixels tall in the middle of the image, repeating seamlessly left to right: its top edge is the wall's top rim, its bottom edge is where it meets the floor, flat background above and below.
Background for PIECES and WALL: solid flat pure GREEN (#00FF00), or solid flat pure MAGENTA (#FF00FF) when I say so — never use the background colour on the objects (green background: no green on the objects; magenta background: no pink, purple or magenta on the objects).
Reply only "OK" now. Then draw exactly one picture for each prompt I send.
```

### 3.1 พื้นลายซ้ำ (ชื่อไฟล์ในวงเล็บ = ชื่อที่ผมจะตั้งตอนตัด)

**ชุด 1 — ผิวน้ำ**

T1 ทรายหาด (`ocSand`) — พื้นหลักของหาด / ท่าเรือ
```
TEXTURE — GOLDSHELL SAND: warm golden beach sand with soft wind ripples, a few tiny scattered flecks of golden and cream shell and small round pebbles. Bright and warm.
```
T2 ทรายเปียกตอนน้ำลง (`ocWetSand`) — ทางเดิน / ริมน้ำ / สันทรายตอนน้ำลง
```
TEXTURE — WET SAND AT LOW TIDE: darker caramel wet sand with long tide ripples, a few small shallow puddles reflecting pale sky blue, tiny crab holes and little bubble dots.
```
T3 น้ำตื้นลากูน (`ocLagoon`)
```
TEXTURE — LAGOON SHALLOWS: very clear shallow turquoise water over pale golden sand; the sand ripples show through the water, soft bright net-like light patterns on the sand, a few small sparkles. Even colour everywhere, no breaking waves, no foam.
```
T4 ทะเลลึก (`ocDeep`)
```
TEXTURE — OPEN SEA: deep teal-blue sea seen from above, small rounded wave shapes and little white wave caps spread evenly, a few light sparkles.
```
T5 ทางเดินไม้ท่าเรือ (`ocPlanks`)
```
TEXTURE — HARBOUR BOARDWALK: weathered driftwood planks in long straight rows running left to right, pale grey-brown wood with dark gaps between the planks, iron nails, a few white salt stains and tiny shells caught in the cracks.
```
T6 ลานหินฝังเปลือกหอย (`ocShellPave`) — ถนน / ลานในเมืองท่า
```
TEXTURE — SHELL MOSAIC PAVING: rounded pale sandstone paving stones with flat seashells inlaid in them and small turquoise sea-glass pieces in the joints; thin golden root lines run through a few stones like veins.
```

**ชุด 2 — น้ำตื้น**

T7 ทรายพื้นทะเล (`ocSeabed`) — พื้นหลักใต้น้ำ
```
TEXTURE — SEABED SAND: pale cream seabed sand with soft round ripple marks, tiny scattered shells, small pebbles and a few sand dollars. Bright true colours (the game tints it blue).
```
T8 พื้นแนวปะการัง (`ocReefFloor`)
```
TEXTURE — CORAL REEF FLOOR: sand mixed with broken coral rubble in pink, orange and white, small clear-blue crystal chips and tiny shells.
```
T9 พื้นป่าสาหร่าย (`ocKelpFloor`)
```
TEXTURE — KELP FOREST FLOOR: darker golden-brown sand with fallen golden-amber kelp blades lying flat in loose curls, rounded grey stones and a few small shells.
```
T10 ดาดฟ้าเรือจม (`ocDeck`) — พื้นดันเจี้ยนเรือผี
```
TEXTURE — SUNKEN SHIP DECK: old dark wet wooden deck planks in long straight rows running left to right, iron nails, a few barnacles and tiny shells stuck in the gaps, pale water stains.
```
T11 หลุมน้ำลึก (`ocTrench`) — "บึง" ของแมพใต้น้ำ = หลุมดำลงห้วงลึก (เดินข้ามไม่ได้)
```
TEXTURE — DEEP SINKHOLE: looking down into very deep dark navy-blue water, soft lighter blue swirls and a few tiny glowing pale specks; no floor visible.
```

**ชุด 3 — น้ำกลาง**

T12 พื้นนครจม (`ocRuinPave`)
```
TEXTURE — DROWNED CITY PAVING: big old cream-and-grey stone paving slabs with faded mosaic bands of waves, shells and fish, cracks with coral crust growing in them and drifts of pale sand.
```
T13 พื้นวังมุก (`ocNacre`)
```
TEXTURE — PEARL PALACE FLOOR: smooth pearl-white nacre tiles with a soft rainbow sheen, thin gold seams between the tiles and a small inlaid pearl at every tile corner.
```
T14 พื้นวิหารจมน้ำ (`ocTempleStone`)
```
TEXTURE — DROWNED TEMPLE FLOOR: big turquoise and sand-coloured stone blocks carved with gold step patterns, a thin film of shallow water shining in some joints, tiny shells.
```

**ชุด 4 — ห้วงลึก**

T15 พื้นห้วงลึก (`ocAbyss`)
```
TEXTURE — ABYSS FLOOR: dark blue-black volcanic rock with faint glowing golden and turquoise root veins running through it, tiny glowing specks and a few small pale fish bones.
```

### 3.2 กำแพงดันเจี้ยน (แถบยาว ต่อซ้ายขวาได้ · พื้นเขียว)

W1 ผนังในท้องเรือผี (`ocWallHull`) — ชุด 2
```
WALL — INSIDE A SUNKEN SHIP: curved dark wooden hull planks with thick wooden ribs every few steps, round brass portholes glowing pale ghost-blue, barnacles, hanging ropes and small paper lanterns burning with blue ghost fire.
```
W2 ผนังวิหารจมน้ำ (`ocWallTemple`) — ชุด 3
```
WALL — DROWNED AZTEC TEMPLE: big carved stone blocks in turquoise, cream and gold; a band of carvings of water swirls, shells and the round face of a water goddess with round earrings repeated along the wall; thin streams of water trickle down the face.
```
W3 ผนังบ่อรากโลก (`ocWallRoot`) — ชุด 4
```
WALL — THE WORLD-ROOT WELL: a wall of giant twisted dark roots grown into black rock, golden and turquoise light glowing in the roots' cracks, small glowing crystal buds and tiny glowing sea anemones.
```

---

## 4. แมพ: ของประกอบ (แชทแมพเดิม ต่อจากพื้น)

ตารางชื่อชิ้น (ลำดับ = อ่านซ้ายไปขวา แถวบนก่อน) อยู่ใต้แต่ละกล่อง · ขนาดในเกมผมตั้งเองตอนตัด

### ชุด 1 — ผิวน้ำ (หาด ลากูน ชายฝั่งเรือแตก ท่าเรือซุ้มราก)

**S1 รากทอง** — เอกลักษณ์ของโซน: รากโทเท็มที่จมทะเลดันขึ้นมาเป็นซุ้ม · ใช้แทน "ต้นไม้" ในแมพผิวน้ำ
```
PIECES — GOLDEN ROOTS, 3×2, green background. These are the sunken roots of a giant world-totem that pushed up through the sea floor: thick living roots with twisted rope-like golden bark, glowing gold-turquoise veins, white barnacles and small shells clinging to them.
(1) a giant root arch rising out of the sand and curving back down into it, wide and tall enough for heroes to walk under (about 4 heroes tall);
(2) the same kind of root arch standing in the sea, a thin foam ring at both feet;
(3) a thick root tip breaking up out of the sand and ending in a big glowing clear-blue crystal;
(4) a low twisted root stump with shells, one small new root sprout and a coil of old rope around it;
(5) a long fallen root lying on the sand, covered in barnacles;
(6) three thin root tips poking up from the sand like fingers, each with a tiny crystal bud.
```
`ocRootArch` `ocRootArchW` `ocRootCrystal` / `ocRootStump` `ocRootLog` `ocRootFingers`

**S2 หินชายฝั่ง**
```
PIECES — COAST ROCKS, 3×2, green background. Warm grey and sandy rock, white barnacles, orange starfish; any seaweed is golden-brown.
(1) a big round beach boulder with barnacles and two starfish;
(2) a rock pool: a ring of low rocks holding a small pool of clear turquoise water with a starfish and shells inside;
(3) a tall sea stack (a pillar of rock) standing in the sea with a thin foam ring;
(4) three low flat stepping stones in shallow water, each with a thin foam ring;
(5) a cluster of small rounded beach rocks and pebbles;
(6) a small rock arch standing in the sea with a hole through it, foam at its feet.
```
`ocBoulder` `ocRockPool` `ocStack` / `ocStepStones` `ocPebbles` `ocRockArch`

**S3 ของบนหาด (12 ชิ้น)**
```
PIECES — BEACH BITS, 4×3, green background:
(1) a pile of colourful seashells; (2) one big spiral conch shell; (3) two starfish, one orange and one blue; (4) a cute sandcastle with shell decorations and a tiny blank flag; (5) a bleached driftwood log; (6) a forked driftwood branch; (7) a fishing net hung between two poles with round glass floats; (8) a wicker crab trap; (9) a washed-up wooden barrel lying on its side; (10) a broken wooden crate with gold coins spilling out; (11) a cluster of round glass fishing floats in rope nets; (12) a small overturned rowboat on the sand.
```
`ocShells` `ocConch` `ocStarfish` `ocSandcastle` / `ocDriftLog` `ocDriftBranch` `ocNetPoles` `ocCrabTrap` / `ocBarrel` `ocCrateCoins` `ocFloats` `ocRowboat`

**S4 ซากเรือ 5 แดน** — ชายฝั่งเรือแตก (แมพบอสราน)
```
PIECES — WRECKS OF THE FIVE LANDS, 3×2, green background. Each wreck lies on its own small patch of sand, about 5 heroes long:
(1) a Viking longship broken in the middle, dragon-head prow, round shields along the side, a torn red-and-white striped sail;
(2) a Greek warship tilted on its side, a big painted eye on the bow, a bronze ram, broken oars;
(3) a Japanese wooden cargo ship with a torn square straw-mat sail and a red lacquer stern;
(4) an Egyptian reed boat with a curled papyrus prow, a snapped mast and faded blue-and-gold paint;
(5) an Aztec dugout war canoe with a carved feathered-serpent prow and turquoise and red paint;
(6) a huge whale skeleton half buried in the sand: curved ribs and a big skull.
```
`ocWreckVik` `ocWreckGrk` `ocWreckJpn` / `ocWreckEgy` `ocWreckAzt` `ocWhaleBones`

**S5 ของลอยน้ำ** — ลอยโยกในทะเล
```
PIECES — SEA FLOATS, 3×2, green background. Things that float on the sea; each has only a thin foam ring at the waterline, no water around it:
(1) a floating wooden barrel; (2) a red-and-white buoy with a small brass bell; (3) a floating raft of golden-brown seaweed with round air bladders; (4) a carved wooden totem pole floating on its side, with a bear face and a thunderbird face, barnacles on it; (5) a tiny rocky islet with a small golden root sprout and two shells; (6) a small breaking wave crest of white foam.
```
`ocFloatBarrel` `ocBuoy` `ocKelpRaft` / `ocTotemLog` `ocIslet` `ocWaveCurl`

**S6 บ้านเมืองท่า (4 หลัง)**
```
PIECES — HARBOUR TOWN HOUSES, 2×2, green background. The town of Rootarch Haven, home of friendly sea-turtle folk, built on top of giant golden roots that arch out of the sea; each building about 3 heroes tall, front door facing the viewer:
(1) a stilt house on top of a golden root arch: wooden walls, a roof of overlapping big seashell plates, round windows, a rope ladder, lanterns and shell wind chimes;
(2) a stilt house on wooden piles wrapped by roots, a thatched roof of dried golden kelp, a small balcony with drying fish and nets;
(3) the turtle elder's round hut: a big dome roof shaped like a sea-turtle shell with hexagon plates, a round wooden door, a carved totem post beside the door;
(4) the harbour office: a wooden building with a big blank notice board beside the door, a ship's bell, and five small pennants showing simple emblems (a raven, a pegasus, a scarab, a crane, a feathered serpent).
```
`ocStiltHouse1` `ocStiltHouse2` / `ocElderHut` `ocHarbourOffice`

**S7 สถานที่สำคัญเมืองท่า (4 หลัง)**
```
PIECES — HARBOUR TOWN LANDMARKS, 2×2, green background:
(1) a tall lighthouse built around a twisted golden root, spiral wooden stairs, a seashell-shingle roof and a lamp room with a big glowing turquoise totem crystal instead of a fire (about 6 heroes tall);
(2) an open-air smithy under a shell roof: a stone forge with a glowing fire, an anvil shaped like a ship's anchor, tools on the wall, a water barrel;
(3) a storage warehouse on stilts with crates and barrels stacked by the door and a small wooden crane arm holding a cargo net;
(4) a round tavern with a giant conch shell as its chimney, warm window lights, a blank hanging sign shaped like a fish and two small tables outside.
```
`ocLighthouse` `ocSmithy` / `ocWarehouse` `ocTavern`

**S8 ท่าเรือ**
```
PIECES — HARBOUR, 3×2, green background:
(1) a long straight wooden pier on posts with rope railings, drawn lying flat from the same camera, a thin foam ring around each post;
(2) the end of a pier with mooring posts, a small lamp post and coiled ropes;
(3) a ferry gate: a wooden archway at the start of a pier with five small pennants showing simple emblems (a raven, a pegasus, a scarab, a crane, a feathered serpent) and a hanging lantern;
(4) a fish market stall under a striped blue-and-white awning;
(5) a stall of shells and pearls under a sailcloth canopy;
(6) a giant clam fountain: an open giant clam on a round stone base, water bubbling up from a big pearl in the middle.
```
`ocPier` `ocPierEnd` `ocFerryGate` / `ocStallFish` `ocStallPearl` `ocClamFountain`

**S9 เรือจอดท่า** — เรือข้ามฟาก 5 สาย (เรือญี่ปุ่นใช้ jpShip ที่มีแล้ว)
```
PIECES — SHIPS IN HARBOUR, 3×2, green background. Each ship floats with only a thin foam ring at the waterline, sails up, about 6 heroes long:
(1) a Viking dragon longship with a red-and-white striped sail and round shields;
(2) a Greek warship with a white sail, a bronze ram and a big painted eye on the bow;
(3) a large Egyptian reed ship with a blue-and-gold sail and a curled papyrus prow and stern;
(4) an Aztec war canoe with feather banners and turquoise and red paint;
(5) the turtle ferry: a wide wooden raft with a striped canopy and benches, harnessed to a giant friendly sea turtle with an amber-and-brown shell;
(6) a small fishing boat of the turtle folk with a patched sail and a net.
```
`ocShipVik` `ocShipGrk` `ocShipEgy` / `ocShipAzt` `ocTurtleFerry` `ocFishBoat`

**S10 ของในท่าเรือ (12 ชิ้น)**
```
PIECES — HARBOUR BITS, 4×3, green background:
(1) a pearl lamp post: a glowing pearl held in a shell on a wooden post; (2) a stack of wooden crates; (3) a group of barrels; (4) a mooring bollard with a coil of rope; (5) a stack of lobster pots; (6) a wooden rack hung with drying fish; (7) a signpost with five blank arrow boards; (8) a driftwood bench; (9) a big iron anchor standing as a display; (10) a small cooking fire with fish on sticks; (11) a rack of oars and harpoons; (12) a wooden treasure chest decorated with shells.
```
`ocPearlLamp` `ocCrates` `ocBarrels` `ocBollard` / `ocLobsterPots` `ocFishRack` `ocSignpost` `ocBench` / `ocAnchorPost` `ocCookFire` `ocOarRack` `ocChest`

### ชุด 2 — น้ำตื้น (แนวปะการังคริสตัล ป่าสาหร่ายยักษ์ เรือผีจม)

**S11 ต้นปะการัง** — "ต้นไม้" ของแมพใต้น้ำ
```
PIECES — CORAL TREES, 3×2, green background. Each stands on a small patch of sand; no fish:
(1) a big branching coral tree in bright pink, about 3 heroes tall;
(2) a wide fan coral in orange-red;
(3) a clump of purple staghorn coral;
(4) coral growing on a glowing golden root, with clear-blue crystal tips;
(5) a cluster of clear-blue crystal coral spires;
(6) a tall tower of yellow-orange tube sponges.
```
`ocCoralTree` `ocFanCoral` `ocStaghorn` / `ocRootCoral` `ocCrystalCoral` `ocSponge`

**S12 สาหร่ายทอง** — **พื้นแดงม่วง** (สาหร่ายสีทองอมเขียว กันตัดหาย)
```
PIECES — GOLDEN KELP, 3×2, MAGENTA background (no pink, purple or magenta on the objects). The kelp here is golden-amber with round air bladders and long wavy blades; each stands on a few stones:
(1) one very tall giant kelp stalk, about 4 heroes tall;
(2) a cluster of three kelp stalks of different heights;
(3) a short bushy kelp clump;
(4) two tall kelp stalks crossing into an arch;
(5) a wide low bed of short golden sea grass (lying low, almost flat);
(6) a giant kelp pillar: many stalks twisted together into a thick column with a glowing golden root inside.
```
`ocKelp1` `ocKelp3` `ocKelpBush` / `ocKelpArch` `ocSeaGrass` `ocKelpPillar`

**S13 ของในแนวปะการัง (12 ชิ้น)**
```
PIECES — REEF BITS, 4×3, green background:
(1) a brain-coral boulder; (2) a cluster of orange-and-white sea anemones; (3) a giant clam, closed; (4) the same giant clam open, with a big white pearl; (5) a sunken treasure chest, half open, with gold coins; (6) a pile of old clay amphorae with shells; (7) a rusty anchor stuck in the sand; (8) a rock covered with starfish; (9) a cluster of spiky purple sea urchins; (10) a barnacle-covered rock; (11) a cluster of clear-blue crystal shards; (12) a sunken bronze ship's bell lying on its side.
```
`ocBrainCoral` `ocAnemone` `ocClam` `ocClamOpen` / `ocTreasure` `ocAmphorae` `ocAnchor` `ocStarRock` / `ocUrchins` `ocBarnRock` `ocCrystals` `ocBell`

**S14 ของในเรือผีจม**
```
PIECES — SUNKEN GHOST SHIP, 3×2, green background. Inside a Japanese ghost ship at the bottom of the sea:
(1) a broken mast leaning, with a torn sail and tangled ropes;
(2) a ship's steering wheel on its wooden post;
(3) cargo barrels and crates tied together in a rope net;
(4) a Japanese paper lantern on a pole, burning with pale blue ghost fire;
(5) a wooden bucket full of long-handled wooden ladles, dripping;
(6) a harpoon launcher (a giant crossbow) on a wooden mount.
```
`ocMast` `ocWheel` `ocCargoNet` / `ocGhostLantern` `ocLadleBucket` `ocBallista`

### ชุด 3 — น้ำกลาง (ซากนครห้าแดน วังมุกใต้สมุทร วิหารจมน้ำ)

**S15 ซากนคร: กรีก + อียิปต์** (แอตแลนติส · เฮราคลีออน เมืองจมจริงของอียิปต์)
```
PIECES — DROWNED RUINS: GREEK AND EGYPTIAN, 3×2, green background. Ancient ruins at the bottom of the sea, crusted with coral, shells and barnacles:
(1) a toppled white marble column whose capital is shaped like a trident;
(2) a broken marble statue of a bearded sea god holding a trident, one arm missing, about 3 heroes tall;
(3) a standing marble archway with a broken top;
(4) a colossal pharaoh head statue half buried in the sand, striped headdress, starfish on it;
(5) a sandstone sphinx statue lying in the sand;
(6) a fallen obelisk broken in two pieces.
```
`ocColumn` `ocSeaGod` `ocArch` / `ocPharaohHead` `ocSphinx` `ocObelisk`

**S16 ซากนคร: ญี่ปุ่น + ไวกิ้ง + แอซเท็ก** (ประตูวังริวงู · โถงของเอกีร์ · วิหารตะวันที่สี่)
```
PIECES — DROWNED RUINS: JAPANESE, NORSE AND AZTEC, 3×2, green background. Ancient ruins at the bottom of the sea, crusted with coral, shells and barnacles:
(1) a big red sea shrine gate with faded paint, coral around its feet;
(2) a stone lantern with a sea anemone growing on top;
(3) the front of a sunken Norse hall: two carved wooden pillars and a beam ending in a dragon head, round shields on the pillars;
(4) a tall standing stone carved with spiral dragon knots (no letters);
(5) the corner of an Aztec step pyramid in turquoise and sand-coloured stone with a gold sun disc;
(6) a carved stone stele of a water goddess with a big headdress and round earrings, turquoise paint.
```
`ocSeaGate` `ocStoneLantern` `ocNorseHall` / `ocKnotStone` `ocStepTemple` `ocGoddessStele`

**S17 วังมุกใต้สมุทร (4 หลัง)** — เมืองใต้น้ำ (โดมฟองอากาศ = โค้ด)
```
PIECES — PEARL PALACE TOWN, 2×2, green background. An undersea town of shells and pearls (the bubble dome over it is added in the game, do not draw it):
(1) the Pearl Palace: a grand palace of pearl-white nacre and pink coral with shell-shaped domes, gold trim and a huge pearl on its highest dome (about 7 heroes tall);
(2) a house made of a giant spiral conch shell, a round door and round windows, small pearl lanterns;
(3) a house made of a giant scallop shell with a coral chimney;
(4) a storage house made of a giant nautilus shell with a counter and crates in front.
```
`ocPalace` `ocConchHouse` / `ocScallopHouse` `ocNautilusStore`

**S18 ของในวังมุก (12 ชิ้น)**
```
PIECES — PEARL PALACE BITS, 4×3, green background:
(1) a lamp: a glowing pearl on a coral stand; (2) a coral bench; (3) a stall of pearls and jewellery under a shell canopy; (4) a stall of colourful sea-glass pots; (5) a banner of golden kelp cloth on a pole with a pearl emblem; (6) a giant pearl on a gold stand; (7) a seahorse statue; (8) a small coral archway; (9) a basket of shells, coins and pearls; (10) a signpost made of a shell mosaic plate (blank); (11) an open giant clam used as a bed; (12) a coral planter with orange sea anemones.
```
`ocCoralLamp` `ocCoralBench` `ocStallJewel` `ocStallGlass` / `ocKelpBanner` `ocGiantPearl` `ocSeahorseStatue` `ocCoralGate` / `ocTreasureBasket` `ocMosaicSign` `ocClamBed` `ocAnemonePlanter`

**S19 วิหารจมน้ำ** — แมพบอสชาลชิวทลีกเว (แท่นยืน = กลไกน้ำท่วม)
```
PIECES — DROWNED TEMPLE, 3×2, green background. An Aztec temple of the water goddess at the bottom of the sea, turquoise, cream and gold stone:
(1) a statue of the water goddess (big headdress of blue and white cotton bands with turquoise discs, round earrings, a skirt of turquoise beads) with water pouring from her open hands, about 4 heroes tall;
(2) a raised square stone platform with steps on the front, big enough for four heroes to stand on;
(3) a stone brazier burning with blue-white magic fire;
(4) a carved feathered-serpent pillar with turquoise and gold feathers;
(5) a round flood pool: a low carved stone ring around a pool of turquoise water, lying flat;
(6) an offering altar with shells, pearls and a turquoise bowl.
```
`ocGoddess` `ocPlatform` `ocBlueBrazier` / `ocSerpentPillar` `ocFloodPool` `ocOffering`

### ชุด 4 — ห้วงลึก (บ่อรากโลก 3 ชั้น)

**S20 บ่อรากโลก**
```
PIECES — THE WORLD-ROOT WELL, 3×2, green background. The dark abyss where the last root of the Great Totem glows; things that glow are drawn bright:
(1) a giant root column rising from black rock, golden bark with turquoise light in its cracks, about 5 heroes tall;
(2) a cluster of glowing clear-blue crystal roots;
(3) a hydrothermal vent chimney of black rock with glowing orange cracks (no smoke);
(4) a whale skeleton lying on the abyss floor with small glowing sea lilies growing between the ribs;
(5) a garden of glowing cyan and pink anemones;
(6) a glowing golden seed pod hanging from a short curled root (a root seed).
```
`ocRootColumn` `ocCrystalRoots` `ocVent` / `ocWhaleFall` `ocAnemoneGarden` `ocRootSeed`

**S21 ของในห้วงลึก (12 ชิ้น)**
```
PIECES — ABYSS BITS, 4×3, green background:
(1) a dark rock with glowing golden veins; (2) a cluster of white tube worms with red tips; (3) a glowing sea lily on a long stalk; (4) a pale lacy glass sponge (painted solid); (5) a small black vent; (6) a rock with huge round sucker marks and scratches; (7) a giant fossil tooth; (8) an empty giant isopod shell; (9) a rock splashed with black ink; (10) a few small crystal shards; (11) a glowing root tip; (12) a small glowing deep-sea coral.
```
`ocAbyssRock` `ocTubeWorms` `ocSeaLily` `ocGlassSponge` / `ocVentSmall` `ocSuckerRock` `ocFossilTooth` `ocIsopodShell` / `ocInkRock` `ocCrystalBits` `ocRootTip` `ocDeepCoral`

---

## 5. NPC เมืองท่า + ห้องช่าง (ชุด 1)

ชาวเมืองท่าซุ้มราก: ผู้เฒ่าเต่า (เส้นเรื่อง) · หนูแมวน้ำ (คลัง) · ช่างกุ้งมังกร (ช่างตีเหล็ก) · กัปตันกระทุง (เรือข้ามฟาก) — วังมุกใต้น้ำใช้ NPC ชุดเดียวกัน
1 รูป = ตัวเดียว 2 ท่า (ซ้าย = หน้าตรง · ขวา = หันไปทางซ้ายตอนคุย) ผมตัดแยกเป็น `_front` / `_side` แบบ NPC เดิม

**N0 พรอมต์กลาง (แชทใหม่ · แนบ ld5 + npc_ref.jpg)**
```
I'm making townspeople for my 2D fantasy MMORPG: friendly animal-folk shown as full-body chibi standing pictures. Attached: (1) the campfire key art = the art style, (2) a board of NPCs already in my game = their proportions, outline weight and finish (never copy their designs).
Every picture: ONE character drawn TWICE side by side on a 1536×1024 image. LEFT = standing straight and facing the viewer (front view) in a friendly idle pose. RIGHT = the same character in a three-quarter view turned toward the screen-left, as if talking to someone on the left. Same size, same height, feet on the same baseline, whole body visible with empty space around it, each figure about 75% of the image height. Chibi proportions (the head about a third of the height) like the board.
Style: friendly hand-painted chibi cartoon, thick clean dark-brown outlines, cel shading with 2–3 flat tones, soft light from the top-left, bright warm colours. Not realistic, not 3D.
Background: solid flat pure GREEN (#00FF00), no ground, no shadow; never green on the character. No text, no speech bubbles, no frame.
Reply only "OK" and wait.
```
**N1 ผู้เฒ่าเต่ากระ** (`sea_elder`) — คนเล่าเรื่องรากโทเท็มที่จมทะเล และเรื่องเออร์ทอค
```
NPC — THE TURTLE ELDER of the harbour town: an old hawksbill sea turtle standing upright on his back flippers, an amber-and-brown patterned shell on his back, sandy wrinkled skin, a long white beard, round wire spectacles, a wide straw hat with a band of small shells, a woven blue-and-cream shawl, a necklace of shells, and a driftwood walking staff topped with a small glowing turquoise totem crystal. Kind, wise smile.
```
**N2 หนูแมวน้ำ คนเฝ้าคลัง** (`kafra_sea`)
```
NPC — THE STORAGE KEEPER: a cheerful young harbour-seal girl with soft grey fur and darker spots, big black eyes and whiskers, a white sailor collar with a navy ribbon, a short navy sailor jacket with gold buttons, a big leather satchel with a shell clasp, holding a ledger book and a quill in her flippers.
```
**N3 ช่างกุ้งมังกร** (`craft_sea`)
```
NPC — THE BLACKSMITH: a burly red lobster smith standing upright, shiny red shell and long antennae, one big claw holding a smith's hammer and the smaller claw holding tongs, a thick leather apron full of tools, brass goggles pushed up on his forehead, a white knitted sailor cap and a big grin.
```
**N4 กัปตันกระทุง เรือข้ามฟาก** (`sea_ferry`) — ยืนที่ท่าเรือ 5 แดนกับที่เมืองท่า รับเฉพาะ Lv 60 ขึ้นไป
```
NPC — THE FERRY CAPTAIN: a jolly pelican with white feathers and a big orange beak whose pouch holds a bundle of blank paper tickets, a navy captain's coat with gold buttons, a captain's hat with a gold anchor badge, a brass spyglass under one wing, a little round belly.
```
**R1 ห้องช่างเมืองท่า** (`assets/rooms/craft_sea`) — **แชทใหม่ · แนบ ld5 + room_ref.jpg**
```
A room picture for my 2D fantasy MMORPG, drawn exactly like the attached room picture: the same cut-away isometric room seen from above at the same angle, the same octagon shape, the same size in the image and the same black background outside the room, a door with steps at the bottom-left, an open floor in the middle. Same art style as the attached key art: friendly hand-painted chibi cartoon, clean dark-brown outlines, cel shading, warm cosy light. No characters, no text.
THE SMITHY OF ROOTARCH HAVEN (a harbour town built on giant golden roots): walls of wooden planks and big pearly shell panels, golden root beams across the ceiling, a stone forge with a glowing fire, an anvil shaped like a ship's anchor, racks of harpoons and tridents, fishing nets and glass floats on the walls, a big round porthole window showing the sea, a shell lamp, a workbench with tools, a corner with a woven mat and a sea chest.
```

---

## 6. บอส (แชทใหม่ · แนบ ld5 + รูปบอสที่เคยเจน 1 รูป · ส่งทีละตัว)

รูปต้นแบบ 1 ตัว = 1 รูป (ไว้ทำวิดีโอท่าทางทีหลังแบบบอสเดิม) · กลไกการต่อสู้ออกแบบด้วยกันตอนทำแมพชั้นนั้น (SEA_ZONE_TH.md ข้อ 6)
ส่วนที่เกมวาดแยกเพื่อใช้ในกลไก: ปมตาข่ายทองของราน (◎ ให้ตีขาด) · หนวดคราเคน (แผ่น B5)

**B1 ราน เจ้าแม่ตาข่าย** — บอสชายฝั่งเรือแตก (ชุด 1)
```
Boss master design for my 2D isometric fantasy MMORPG (Ragnarok Online feel). Copy the art style of the attached pictures exactly: friendly hand-painted chibi cartoon, cute-but-dangerous, thick clean dark-brown outlines (not black), cel shading with 2–3 flat tones, soft light from the top-left, bright warm colours, clear readable silhouette. Not realistic, not painterly, not 3D. The attached boss is another boss of the same game: match its style and level of detail.
Draw ONE boss alone on a 1024×1024 image: full body, isometric 3/4 view from about 30° above, facing DOWN-RIGHT (south-east), filling about 85% of the image with clear empty space on every side.
RAN, MISTRESS OF THE DROWNING NET — the Norse goddess of the sea who catches sailors in her great net, cold and proud but not evil. Chibi proportions: big head, long wild silver-blue hair flowing like waves with white foam curls, pale sea-blue skin, fierce glowing pale-gold eyes, a crown of whale bone set with gold coins, gold arm rings and a necklace of gold coins (sailors brought her gold). A long deep-blue gown whose hem turns into a curling wave instead of feet. An enormous fishing net hangs from her hands and wraps around her like a cloak, full of glass floats and caught treasures (gold coins, a horned helmet, a small anchor, a ship's wheel), tied with big gold knots. Any seaweed is amber-gold. Deep blue, silver and gold dominate.
Background: SOLID FLAT PURE GREEN (#00FF00), no gradient, no ground, no shadow. Never use green on the boss. No text, no labels, no frames, no effects floating around her — glow only ON the body. Paint everything solid (water and foam are opaque).
```
**B2 กัปตันฟุนะยูเรย์** — บอสเรือผีจม ชั้น 2 (ชุด 2) · ต้องไม่เหมือนโชกุนผี (นั่นซามูไรเกราะ ตัวนี้กัปตันเรือ)
```
Boss master design for my 2D isometric fantasy MMORPG (Ragnarok Online feel). Copy the art style of the attached pictures exactly: friendly hand-painted chibi cartoon, cute-but-dangerous, thick clean dark-brown outlines (not black), cel shading with 2–3 flat tones, soft light from the top-left, bright warm colours, clear readable silhouette. Not realistic, not painterly, not 3D. The attached boss is another boss of the same game: match its style and level of detail.
Draw ONE boss alone on a 1024×1024 image: full body, isometric 3/4 view from about 30° above, facing DOWN-RIGHT (south-east), filling about 85% of the image with clear empty space on every side.
THE FUNAYUREI CAPTAIN — the ghost captain of a sunken Japanese ship who tries to sink every boat by scooping sea water into it, gloomy and stubborn but not evil. Chibi proportions: a big pale blue-white ghost face with sad glowing pale-gold eyes and long wet black hair, a white triangular ghost headband on his forehead under a battered black lacquer sailor's hat; a tattered indigo captain's coat with a white wave crest and white wave patterns along the hem, a rope belt with a ship's bell; below the waist his body becomes a swirl of dark sea water and white foam instead of legs. He holds a huge wooden ladle like a halberd, dripping water, and blue ghost-fire flames burn on his shoulders. Indigo, pale blue-white and wood brown dominate.
Background: SOLID FLAT PURE GREEN (#00FF00), no gradient, no ground, no shadow. Never use green on the boss (his ghost skin is blue-white, not green). No text, no labels, no frames, no effects floating around him — glow only ON the body. Paint everything solid (ghost parts, water and fire are opaque).
```
**B3 ชาลชิวทลีกเว นางกระโปรงหยก** — บอสวิหารจมน้ำ (ชุด 3) · กระโปรงหยกวาดเป็นเทอร์ควอยซ์ (กันพื้นเขียว)
```
Boss master design for my 2D isometric fantasy MMORPG (Ragnarok Online feel). Copy the art style of the attached pictures exactly: friendly hand-painted chibi cartoon, cute-but-dangerous, thick clean dark-brown outlines (not black), cel shading with 2–3 flat tones, soft light from the top-left, bright warm colours, clear readable silhouette. Not realistic, not painterly, not 3D. The attached boss is another boss of the same game: match its style and level of detail.
Draw ONE boss alone on a 1024×1024 image: full body, isometric 3/4 view from about 30° above, facing DOWN-RIGHT (south-east), filling about 85% of the image with clear empty space on every side.
CHALCHIUHTLICUE, SHE OF THE TURQUOISE SKIRT — the Aztec goddess of rivers and the sea who once drowned the world to end an age, sorrowful and powerful but not evil. Chibi proportions: a big head with a calm face, gold eyes, two short vertical black paint lines on each cheek, round turquoise ear spools; a big headdress of blue-and-white cotton bands with turquoise discs and white tassels; a necklace of turquoise beads with a gold pendant; a wide skirt of turquoise beads and shells from which clear blue water pours down in a waterfall around her feet; gold bracelets; a rattle staff hung with shells in one hand and a round shield painted with a water spiral in the other. Turquoise, white and gold dominate (turquoise leaning blue, never green).
Background: SOLID FLAT PURE GREEN (#00FF00), no gradient, no ground, no shadow. Never use green on the boss. No text, no labels, no frames, no effects floating around her — glow only ON the body. Paint everything solid (the water is opaque).
```
**B4 คราเคน ผู้พันรากโลก** — บอสหลัก บ่อรากโลก ชั้น 3 (ชุด 4)
```
Boss master design for my 2D isometric fantasy MMORPG (Ragnarok Online feel). Copy the art style of the attached pictures exactly: friendly hand-painted chibi cartoon, cute-but-dangerous, thick clean dark-brown outlines (not black), cel shading with 2–3 flat tones, soft light from the top-left, bright warm colours, clear readable silhouette. Not realistic, not painterly, not 3D. The attached boss is another boss of the same game: match its style and level of detail.
Draw ONE colossal boss alone on a 1024×1024 image: full body, isometric 3/4 view from about 30° above, facing DOWN-RIGHT (south-east), filling about 85% of the image with clear empty space on every side.
THE KRAKEN, COILER OF THE WORLD ROOT — a colossal kraken that has wrapped itself around the last glowing root of a giant world-totem at the bottom of the sea; hurt and angry, not evil. Chibi proportions: a huge round mantle-head with big golden eyes full of pain, a small beak, dark crimson-violet skin with glowing turquoise spots and gold speckles, barnacles; sharp clear-blue crystal shards stuck into its mantle (they are what hurts it); eight huge arms with pale suckers coiling around a thick glowing golden root that rises from the bottom edge of the picture, turquoise light shining from the root's cracks. Crimson-violet, gold and turquoise dominate.
Background: SOLID FLAT PURE GREEN (#00FF00), no gradient, no ground, no shadow. Never use green on the boss. No text, no labels, no frames, no effects floating around it — glow only ON the body and the root.
```
**B5 หนวดคราเคน 6 ท่า** (`kraken_arms`) — ชิ้นส่วนที่ตีได้ในการต่อสู้ (ทำพร้อมออกแบบการต่อสู้ก็ได้)
```
Boss parts sheet for my 2D isometric fantasy MMORPG, in exactly the art style of the attached pictures (friendly hand-painted chibi cartoon, thick clean dark-brown outlines, cel shading with 2–3 flat tones). A 1536×1024 sheet, 3 columns × 2 rows, one pose per cell, centred, nothing touching a neighbour or the edge, high three-quarter view from about 35° above. Six poses of ONE kraken arm rising out of the sea floor, the same arm in every cell: crimson-violet skin, pale suckers, glowing turquoise spots and one small clear-blue crystal shard stuck in it:
(1) rising tall with its tip curled; (2) coiled in a spiral, ready; (3) raised high to strike; (4) slammed down flat along the ground; (5) wrapped around a broken stone pillar (draw the pillar too); (6) hurt and pulling back down, its tip curled tight.
Background: SOLID FLAT PURE GREEN (#00FF00), no ground, no shadow, never green on the arm. No text, no effects around it.
```

---

## 7. ไอคอนวัตถุดิบทะเล (ทีหลัง · ตอนกำหนดของดรอป)
แชทใหม่ → ส่งพรอมต์กลาง 0 ใน REFINE_STONE_ICON_PROMPTS_TH.md (แนบ ld5 + ref_items.png แบบเดิม) → ส่งกล่องนี้ · ชื่อไอเทมยังเป็นชื่อร่าง
```
Sheet — SEA MATERIALS. 4 columns × 3 rows, read left to right, top row first:
(1) a white pearl resting in a small open clam shell; (2) a glossy black pearl with a violet sheen; (3) a spiral conch shell; (4) three pieces of frosted sea glass (blue, amber, white); (5) a branch of pink coral; (6) a bundle of golden kelp tied with twine; (7) a blue-violet crab claw; (8) a clear-blue crystal shark tooth; (9) a small glass vial of glowing dark-purple ink with a cork; (10) a glowing golden anglerfish lure bulb on a short stalk; (11) an old gold coin crusted with barnacles; (12) a piece of crimson kraken hide with round suckers.
Solid flat pure green (#00FF00) background, no green on the objects, no text, no frame, no glow halo, nothing touching the cell edges.
```
ชื่อร่าง: `sea_pearl` `sea_bpearl` `sea_conch` `sea_glass` / `sea_coral` `sea_kelp` `sea_claw` `sea_tooth` / `sea_ink` `sea_lure` `sea_coin` `sea_hide`

---

## 8. ตอนได้รูปมา (สำหรับแชทที่ตัดรูปเข้าเกม)
- **ภาพปก** → `assets/loading/ld9.webp` + `ld9_s.webp` (1672 / 960 px, ครอป 16:9) แล้วเพิ่ม N ในสคริปต์หน้าโหลด
- **แผนที่โลก** → `assets/ui/worldmap_bg_sea.webp` (ย่อกลับ 1448×1086) · เปลี่ยนเป็นภาพหลักตอนเปิดโซน
- **พื้นลายซ้ำ** → ย่อเป็น 640×640 + ทำขอบให้ต่อกันเนียน (เลื่อนครึ่งภาพแล้วผสมรอยต่อ) → `maps/sea/<ชื่อ>.webp` + `{t:'tex'}` ใน VK_CAT
- **กำแพง** → ตัดพื้นเขียว เล็มเป็นแถบสูง 300 px ต่อซ้ายขวาเนียน → `maps/sea/ocWall*.webp` (แบบ grWallCave)
- **แผ่นของประกอบ** → ตัดพื้นเขียว / แดงม่วงด้วยตัวตัดแบบรูปบอส (เก็บแสงเรือง) แล้วแบ่งตามช่อง (ชิ้นที่ล้นช่องไปอยู่กับช่องที่จุดกลางชิ้นอยู่) → `maps/sea/<ชื่อตามตาราง>.webp` + VK_CAT (กว้าง สูง จุดเท้า ชนิด tree / prop / big / flat / water วงชน) — ยังไม่มีเครื่องมือตัดแผ่นแมพทั่วไป ทำตอนรูปแผ่นแรกมา (ใช้ key_sheet + split จาก tools/wboss_arenas.py ได้)
- **NPC** → แบ่งครึ่งซ้าย / ขวา → `assets/npc/<ชื่อ>_front.webp` / `_side.webp` + ค่า AX ใน npcs.js
- **ห้องช่าง** → `assets/rooms/craft_sea.webp` + วัดพื้นที่เดินในห้องแบบห้องเดิม
- **บอส** → `assets/bosses/sea/<ran|funayurei|chalchiuhtlicue|kraken|kraken_arms>.png` (ต้นฉบับ) + `_cut.webp` (ตัวตัดบอสเดิม)
- **มอน** → `tools/monsheet2.py <แผ่น> <ออก> W` → `assets/monsters/<ชื่อ>.webp` + MS ใน monster-sprites.js (ตอนแมพมีแล้ว)
- **มินิบอส** → `python3 -I tools/miniboss_art.py add <key> <รูป>` (key อยู่ใน PLANNED ของ tools/miniboss_prompts.py) — ตอนสร้างแมพย้ายข้อมูลจาก PLANNED ไป LANDS แล้วรันใหม่ (เข้า mini_boss_data.js เอง)
