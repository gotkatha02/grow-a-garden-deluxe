# พรอมต์ภาพหินตีบวก + หินโทเท็ม + หินออฟ DEX (2026-11-22)

เจ้าของ 17:57: "เสร็จแล้วขอพรอมต์เจนภาพหินพวกนี้มาใส่ในเกมด้วย" (หินจาก DROP_TABLE_TH.md)

> **สถานะ 2026-11-22 18:44: ใส่ในเกมแล้วทั้ง 2 ชีต (20 ภาพ)** — ตัดด้วย `GLOBAL=1 tools/iconsheet.py` ตามคำสั่งท้ายไฟล์ → assets/items/wore1–4 · ore1–4 (ทับภาพแร่เดิม) · tstone1–4 · tfrag1–4 · ro_orb_dex · sore · tess · pliers (ทับคีมเดิม) · เพิ่มชื่อใน icons.json · sw.js V tl-v5 · ป้ายดาบแดง / โล่ฟ้าบนหินตีบวกหายเองเพราะมีภาพ wore แล้ว (items.js etcIcon) · หินโทเท็ม / ชิ้นส่วนไม่มีเลขขั้นบนภาพแล้ว ขั้นดูจากสี (เทาน้ำตาล / ฟ้า / ม่วง / ทอง) เหมือนหินตีบวก

- **ชีต 1 (ต้องทำ)** = หินตีบวกอาวุธ 4 ขั้น + หินตีบวกชุดเกราะ 4 ขั้น → ตอนนี้ในเกมใช้ภาพแร่เดิมแปะป้ายดาบแดง / โล่ฟ้าไว้ก่อน
- **ชีต 2 (เสริม)** = ของที่ยังเป็นไอคอนวาดด้วยโค้ด: หินโทเท็มดิบ 4 ขั้น · ชิ้นส่วนเจม 4 ขั้น · หินออฟ DEX (ตอนนี้ใช้รูปหนังสือของ INT เก่า) · แร่ดาวตก · แก่นโทเท็ม · คีมถอดหิน
- หินออฟอีก 6 แบบ (STR ดาบ · AGI ปีก · VIT หัวใจ · INT ประกาย · LUK โคลเวอร์ · DEF โล่) มีรูปสวยอยู่แล้ว ไม่ต้องทำใหม่
- ชิ้นส่วนบอส (ขยะบอส) 30 แบบ = คอลัมน์ที่ 4 ของชีตใน BOSS_SET_ICON_PROMPTS_TH.md (ทำพร้อมชุดบอส)

## วิธีใช้
1. เปิดแชทใหม่ใน ChatGPT แนบ **รูปปกแคมป์ไฟ** (สไตล์เกม) + **ref_items.png** (ไอคอนแร่และหินออฟที่มีในเกมตอนนี้ — ผมส่งให้ในแชท) แล้วส่ง **พรอมต์กลาง (0)** รอให้ตอบ OK
2. ส่งพรอมต์ชีต 1 → ได้รูปแล้วส่งกลับมาให้ผม → (ถ้าอยากทำต่อ) ส่งพรอมต์ชีต 2
3. ผมตัดเป็นไฟล์ละชิ้นแล้วใส่เกมเอง — เกมสลับไปใช้รูปใหม่เองเมื่อไฟล์อยู่ใน assets/items/icons.json (ป้ายดาบ / โล่หายไปเองเมื่อมีรูปหินอาวุธ)
- ชิ้นไหนไม่ถูกใจ: ใน ChatGPT ใช้แปรงเลือกเฉพาะชิ้นนั้นแล้วสั่งวาดใหม่ อย่าสั่งแก้ทั้งรูป (มันจะวาดใหม่หมด)
- ถ้ามีสีเขียวติดบนหิน (เช่น ขอบเรืองเขียว) ให้สั่งแก้ชิ้นนั้น — พื้นเขียวจะถูกตัดออก สีเขียวบนตัวของจะหายไปด้วย

## ชีต → ไฟล์ (สำหรับแชทที่ตัดรูป)
| ชีต | แถว 1 | แถว 2 | แถว 3 |
|---|---|---|---|
| 1 (4×2) | `wore1` `wore2` `wore3` `wore4` (หินอาวุธ ขั้น 1–4) | `ore1` `ore2` `ore3` `ore4` (หินชุดเกราะ ขั้น 1–4 · ทับรูปแร่เดิม) | – |
| 2 (4×3) | `tstone1`–`tstone4` | `tfrag1`–`tfrag4` | `ro_orb_dex` `sore` `tess` `pliers` |

- ชีต 1: `GLOBAL=1 python3 -I tools/iconsheet.py <ชีต1.png> assets/items 4,4 wore1,wore2,wore3,wore4,ore1,ore2,ore3,ore4`
- ชีต 2: `GLOBAL=1 python3 -I tools/iconsheet.py <ชีต2.png> assets/items 4,4,4 tstone1,tstone2,tstone3,tstone4,tfrag1,tfrag2,tfrag3,tfrag4,ro_orb_dex,sore,tess,pliers`
- แล้วเพิ่มชื่อใน assets/items/icons.json · ขยับ V ใน sw.js (รูปเก่าถูกแคช) · ไม่ต้องแก้โค้ด: items.js etcIcon ใช้รูปตามไอดีถ้ามีใน icons.json (`ro_orb_<สเตตัส>` ชนะรูปหินออฟเดิม · ป้ายดาบ / โล่ขึ้นเฉพาะตอนยังไม่มี `wore1`–`wore4`)

## 0. พรอมต์กลาง (ส่งก่อน พร้อมรูปปกแคมป์ไฟ + ref_items.png)
```
I am making inventory item icons for my 2D fantasy MMORPG (animal heroes from Norse, Greek, Egyptian, Japanese and Aztec myths). Art style: copy the first attached image (the game's key art) — friendly hand-painted chibi cartoon, thick clean dark-brown outlines (not black), cel shading with 2–3 flat tones, soft light from the top-left, bright warm colours, a little magical shine ON the object. Not realistic, not painterly, not 3D. Chunky, readable, a bit cute, like classic MMORPG inventory icons.
The second attached image shows icons that are already in my game: four refine ore crystals (grey, blue, purple, gold = tiers 1–4), a guard stone, a drill and seven socket orbs in bronze claw settings. New icons must look like they belong to the same set: same outline weight, same chunky size, same finish. Never copy that image's layout.
Sheets: ONE 1536×1024 image each time, the grid I give (4 columns × 2 or 3 rows), items evenly spaced with clear gaps, all about the same size.
Rules for EVERY icon: one single object, centred in its cell, filling about 80% of it without touching the edges or its neighbours. No text, no letters, no numbers, no frame, no border, no ground shadow. No glow halo or aura around any object — the area around it stays one perfectly flat colour; magic shows only ON the object (inner light, sparkles on its surface). Must read clearly at 32 px.
Background: SOLID FLAT PURE GREEN (#00FF00) — no gradient, no texture, no shadow. Never use green on the objects (cyan, teal and turquoise are fine as long as they lean blue).
Reply OK and wait.
```

## 1. ชีต 1 — หินตีบวกอาวุธ + หินตีบวกชุดเกราะ (ต้องทำ)
คอลัมน์ = ขั้น 1 → 4 (ซ้ายไปขวา) · แถวบน = อาวุธ (หนามคมเหมือนปลายดาบ + ตราดาบไขว้) · แถวล่าง = ชุดเกราะ (ก้อนมนซ้อนเป็นโล่ + ตราโล่) · สีตามขั้นเหมือนแร่เดิม (เทา ฟ้า ม่วง ทอง) ขั้นสูงยิ่งใหญ่และวิจิตรขึ้น
```
Sheet 1 — REFINE STONES (the blacksmith uses them to upgrade gear). 4 columns × 2 rows. Columns = tier 1 → 4 from left to right. Row 1 = WEAPON refine stones, row 2 = ARMOUR refine stones.
Tier colours, the same in both rows and the same as the ore crystals in the attached board, so a tier reads at a glance: tier 1 = plain steel-grey stone with a few silver flecks · tier 2 = icy sky-blue crystal · tier 3 = rich violet crystal · tier 4 = shining gold crystal with warm amber glints. Each tier up = a little bigger, more facets, more ornament and a brighter inner light: tier 1 is a small rough rock, tier 4 a splendid jewel-like chunk.
Row 1 — WEAPON refine stones: a chunk of ore whose crystals grow into SHARP BLADE-LIKE SHARDS pointing up and to the right like sword tips, their edges catching a thin warm orange-red glint. On the front face sits one small emblem of two crossed swords, engraved and inlaid in bronze (tiers 1–2) or gold (tiers 3–4). It must feel sharp and aggressive.
Row 2 — ARMOUR refine stones: a sturdy ROUNDED chunk of ore shaped like a small layered shield of stacked bevelled plates, smooth faces with a cool blue-white rim light. On the front face sits one small round shield emblem with a boss in the middle, engraved and inlaid in bronze (tiers 1–2) or gold (tiers 3–4). It must feel solid and protective.
A weapon stone and the armour stone of the same tier share the same colour but have clearly different silhouettes: spiky blades versus a rounded shield.
4 columns × 2 rows, solid flat pure green (#00FF00) background, no green on the objects. Same style as the key art: friendly hand-painted chibi cartoon, thick clean dark-brown outlines, cel shading with 2–3 flat tones, bright and warm. No text, no numbers, no frame, no glow halo, nothing touching the cell edges.
```

## 2. ชีต 2 — หินโทเท็ม ชิ้นส่วนเจม หินออฟ DEX แร่ดาวตก แก่นโทเท็ม คีม (เสริม)
แถว 1 = หินโทเท็มดิบ 4 ขั้น (หินแกะสลักลายโทเท็ม มีผลึกเรืองข้างใน) · แถว 2 = ชิ้นส่วนเจม 4 ขั้น (เศษเจมเหลี่ยม 3 ชิ้นกองกัน) · แถว 3 = หินออฟ DEX (ชุดเดียวกับหินออฟเดิม เปลี่ยนรูปหนังสือเป็นเป้ายิงธนู) · แร่ดาวตก · แก่นโทเท็ม · คีมถอดหิน
```
Sheet 2 — TOTEM STONES, GEM SHARDS AND TOOLS. 4 columns × 3 rows, read left to right, top row first.
Tier colours for rows 1 and 2 (left to right = tier 1 → 4): warm sand-beige · sea-teal (leaning blue) · violet · gold.
Row 1 — RAW TOTEM STONES, tiers 1–4: a rough grey-brown boulder chunk carved on its front with a simple tribal totem face (two eyes and a mouth in carved grooves); a vein of glowing crystal in the tier colour breaks out of the stone at the top and fills the carved grooves with inner light. Tier 1 a small plain rock with a thin vein, tier 4 a big carved stone with a large crystal crown and a gold band.
Row 2 — GEM SHARDS, tiers 1–4: a small heap of three sharp faceted gem shards of the tier colour, one large and two small, with bright white facet highlights. Tier 4 shards are bigger and more brilliant, with tiny star sparkles on them.
Row 3:
1) DEX SOCKET ORB — exactly the same design family as the seven orbs in the attached board (a polished round gemstone orb held in a bronze claw-setting ring with a pointed bronze crest at the bottom): a cornflower-blue orb with a bold lighter-blue symbol inside: a bullseye target with an arrow stuck in its centre.
2) STAR ORE — a dark indigo meteorite chunk with sharp pink-magenta star-shaped crystals growing out of it and tiny white star sparkles on its surface.
3) TOTEM ESSENCE — a teardrop of glowing warm-amber spirit essence in a small round glass vial with a cork and a twine knot, a tiny carved totem charm hanging from the twine.
4) ORB PLIERS — a pair of blacksmith pliers with brown leather-wrapped handles and steel jaws gently holding a small round blue orb.
4 columns × 3 rows, solid flat pure green (#00FF00) background, no green on the objects. Same style as the key art: friendly hand-painted chibi cartoon, thick clean dark-brown outlines, cel shading with 2–3 flat tones, bright and warm. No text, no letters, no numbers, no frame, no glow halo, nothing touching the cell edges.
```

**สถานะ 2026-11-22:** เขียนพรอมต์แล้ว รอรูปจากเจ้าของ
