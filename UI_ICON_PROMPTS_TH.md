# ไอคอนวาดแทนอิโมจิ + พรอมต์ (2026-11-22)

เจ้าของ 20:48: "อะไรที่ใช้อิโมจิ เจนเป็นภาพแทนได้ไหม" → **ได้** — ทำระบบสลับให้แล้ว อิโมจิไหนมีภาพ เกมจะวาดภาพแทนเองทุกที่

## สถานะ
- **2026-11-22 21:54 ภาพครบ 6 ชีตแล้ว (61 ภาพ)** — ตัดด้วย `python3 tools/emo_icons.py cut 1…6` → assets/ui/emo/<key>.webp (128 px) · list.js EMO_V 7 · อิโมจิ 100 แบบในตาราง T เป็นภาพหมด: 61 ภาพใหม่ (👁 มี 2 ภาพ: ตาฮอรัส + ทรายเข้าตา) + 40 แบบใช้ภาพวาดเดิมของเกม (เหรียญเมนู ไอคอนไอเท็ม รูปเจม) · เหลือ 🔍 ในช่องพิมพ์ค้นหาที่ใส่ภาพไม่ได้
- **ยังไม่มีภาพ (แชทบอสกรีกเพิ่มหลังชีต 6, map_bosses_grk.js):** 🐎 ชนพุ่ง (โทรจัน) · 🪨 ขว้างหิน · 🐑 ขว้างแกะ (โพลีฟีมัส) = ชื่อท่าในแถบร่าย · 💫 เหนือหัวแกะที่มึน · 🍷 บนแอ่งไวน์ (วาดบนจอเกม) — ถ้าจะทำเป็นชีต 7
- **ใส่ระบบแล้ว** (`ui_emoji.js`): อิโมจิ 92 แบบที่เกมใช้ (รวมสถานะของบอสประจำแมพที่แชทอื่นเพิ่งใส่) — **47 แบบเปลี่ยนเป็นภาพวาดที่มีในเกมอยู่แล้วทันที** (เหรียญเมนู ไอคอนไอเท็ม รูปเจม) · อีก **45 แบบรอภาพใหม่จาก 5 ชีตข้างล่าง** (ระหว่างรอยังเป็นอิโมจิเดิม) · 🔍 อยู่ในช่องพิมพ์ค้นหา ใส่ภาพไม่ได้ (คงไว้) · สัญลักษณ์ตัวหนังสือ (★ ✔ ✦ ✕ ✎ ➜ ♥ ♪) เป็นตัวอักษรของ UI อยู่แล้ว ไม่เปลี่ยน
- เปลี่ยนให้ทุกที่: หน้าต่าง แท็บ ปุ่ม แชท การ์ดเควสต์ ทูลทิปการ์ด แถบบัฟ (สถานะติดพิษ ไฟไหม้ ฯลฯ) ปุ่มบนมือถือ (🎯 🧘) และตัวหนังสือที่วาดบนจอเกม (ป้ายเหนือหัว NPC เช่น 🌀 วาร์ป ⚒ ช่างคราฟ 🗡 🛡 ⚔ · ข้อความลอย 🗿 วัตถุโบราณ!)
- ภาพใหม่ชนะภาพเดิมเสมอ: ถ้าอยากได้ภาพใหม่ของตัวที่ใช้ภาพเดิมอยู่ (เช่น 🛒 หรือ ⚙) แค่เพิ่มเข้าชีต ไม่ต้องแก้โค้ด
- ปิดระบบดูของเดิม: ต่อท้ายลิงก์ `&emo=0`
- อิโมจิตัวเดียวแต่สองความหมาย: 👁 ในแถบสถานะ = ทรายเข้าตา (ภาพ `blind` ชีต 5) · ที่อื่น (ปริศนาสฟิงซ์ ป้ายประกาศ แชท) = ตาฮอรัส (ภาพ `horus` ชีต 6) → ตาราง `ALT` ใน ui_emoji.js: `'👁':[['#buffs','blind']]` = ในกรอบที่ตรง CSS นี้ใช้ภาพอื่น (บนจอเกม canvas ใช้ภาพหลักเสมอ)
- **ชีต 6 (2026-11-22 21:36 พรอมต์ → 21:54 รูปมา ตัดใส่เกมแล้ว):** 🍂 🧊 ⛓ (ชื่อท่าบอสไวกิ้ง) · ☀ 🌙 👁 (สัญลักษณ์ปริศนาสฟิงซ์) · 🌅 🚶 🦯 (ปริศนาเช้า / สองขา / สามขา) — ตรวจในเกมแล้ว: วงปริศนาบนพื้น ฟองคำถามเหนือหัวสฟิงซ์ ป้ายประกาศ แถบร่ายของบอส แชท · ตัดสะอาดทั้ง 9 ชิ้น (ช่องโซ่โปร่ง ดาวข้างจันทร์ รังสีพระอาทิตย์ขึ้น เท้า 2 ข้าง เกาะเป็นชิ้นเดียวกัน)

## วิธีใช้ (เจ้าของ)
1. แชทใหม่ใน ChatGPT แนบ **รูปปกแคมป์ไฟ** (สไตล์เกม) + **ref_ui_icons.png** (ไอคอนที่มีในเกมแล้ว — ผมส่งให้ในแชท) แล้วส่ง **พรอมต์กลาง (0)** รอให้ตอบ OK
2. ส่งพรอมต์ชีต 1 → ได้รูปแล้วส่งกลับมาให้ผม → ชีต 2 → 3 → 4 → 5 → 6 (ทีละชีต ชีตไหนก่อนก็ได้ · ชีต 1 เห็นบ่อยสุด · ชีต 6 ส่งต่อในแชทเดิมได้เลย)
3. ผมตัดเป็นไฟล์ละชิ้นแล้วใส่เกมเอง — ไม่ต้องแก้โค้ด เกมเปลี่ยนเป็นภาพใหม่เอง
- ชิ้นไหนไม่ถูกใจ: ใน ChatGPT ใช้แปรงเลือกเฉพาะชิ้นนั้นแล้วสั่งวาดใหม่ อย่าสั่งแก้ทั้งรูป
- **ชีต 1–3, 5, 6 พื้นเขียว** ห้ามมีสีเขียวบนตัวของ (จะถูกตัดหาย) · **ชีต 4 พื้นชมพูม่วง** (ของที่ต้องเป็นสีเขียว: ใบไม้ ต้นกล้า เต่า) ห้ามมีชมพู / ม่วงบนตัวของ

## ชีต → ไฟล์ (สำหรับแชทที่ตัดรูป)
| ชีต | พื้น | แถว 1 | แถว 2 | แถว 3 |
|---|---|---|---|---|
| 1 ปุ่ม + คู่มือ (4×3) | เขียว | `target` 🎯 `sit` 🧘 `compass` 🧭 `gift` 🎁 | `star` ⭐ `hint` 💡 `help` ❓ `tap` 👆 | `books` 📚 `skip` ⏭ `bell` 🔔 `belloff` 🔕 |
| 2 โทเท็ม + เจม (4×3) | เขียว | `balance` ⚖ `pick` ⛏ `alembic` ⚗ `cgem` 💠 | `mutgem` 🔶 `supgem` 🔹 `gem` 💎 `dismantle` ♻ | `pages` 📑 `relic` 🗿 `rule` 🔁 `build` 🧬 |
| 3 สถานะ + รางวัล + ตลาด (4×3) | เขียว | `poison` ☠ `bleed` 🩸 `skull` 💀 `warn` ⚠ | `broken` 💔 `crown` 👑 `trophy` 🏆 `party` 🎉 | `folder` 🗂 `chart` 📈 `mailbox` 📬 `news` 📰 |
| 4 ของสีเขียว + อื่น ๆ (4×2) | ชมพูม่วง | `herb` 🌿 `sprout` 🌱 `turtle` 🐢 `fashion` 👗 | `paw` 🐾 `blueprint` 📋 `wrench` 🔧 `chat` 💬 | – |
| 5 สถานะบอสประจำแมพ (4×2) | เขียว | `grab` ✋ `key` 🗝 `mute` 🔇 `note` 🎵 | `dark` 🌑 `blind` 👁 `web` 🕸 `scorpion` 🦂 | – |
| 6 ท่าบอส + ปริศนาสฟิงซ์ (3×3 จัตุรัส) | เขียว | `leaf` 🍂 `icecube` 🧊 `chains` ⛓ | `sun` ☀ `moon` 🌙 `horus` 👁 | `sunrise` 🌅 `feet` 🚶 `cane` 🦯 |

- ตัด: `python3 tools/emo_icons.py cut <เลขชีต> <ไฟล์ชีต.png>` → assets/ui/emo/<key>.webp (128 px) + เขียน assets/ui/emo/list.js ใหม่ + ขยับ `?v=` ของ list.js ใน index.html เอง (ใช้ `GLOBAL=1 tools/iconsheet.py` ข้างใน · สีพื้นเขียว / ชมพูม่วงหาเองจากขอบรูป)
- ภาพกระดานอ้างอิง: `python3 tools/emo_icons.py board ref_ui_icons.png` (ไม่ต้องเก็บใน repo)
- เพิ่มอิโมจิใหม่ในเกม: ใส่บรรทัดในตาราง `T` ของ ui_emoji.js (`'อิโมจิ':['key','ภาพสำรองใต้ assets/ (ถ้ามี)','md' ถ้าเป็นเหรียญกรอบทอง]`) แล้วเพิ่ม key ในชีตของ tools/emo_icons.py · อิโมจิตัวเดิมที่มีความหมายอื่นในบางหน้าต่าง → ใส่ในตาราง `ALT` (`'อิโมจิ':[['CSS ของหน้าต่างนั้น','key อื่น']]`)

## อิโมจิที่ใช้ภาพวาดเดิมแล้ว (47)
| อิโมจิ | key | ภาพตอนนี้ | ใช้ที่ |
|---|---|---|---|
| 🗺 ⚙ 📊 📘 💬 ⏳ | map gear status skills chat hourglass | เหรียญเมนู (แผนที่ ตั้งค่า สถานะ สกิล แชท นาฬิกาทราย) | คู่มือ · ปุ่มโหมด · ตลาด (รอบจอง) · บอสเกิดใหม่ |
| 🛒 🏛 🏪 💾 🌀 🗡 | shop market stall save warp dagger | เหรียญบริการ (ร้าน ตลาด บันทึก วาร์ป อาวุธ) | ร้าน · ตลาด · คาฟรา · ป้ายเหนือหัว NPC |
| ⚔ 🛡 🔨 ⚒ 🔱 🔮 | swords shield hammer anvil seal fuse | เหรียญกิลด์ / DEF / แท็บช่าง (ตีบวก คราฟต์ ตรา รวม) | ช่าง · ตีบวก · ตรา · หลอมเจม · ป้าย NPC · มอนตีก่อน |
| ✨ 🎲 💚 🏹 🔒 | sparkle dice heal bow lock | เหรียญ VFX / LUK / VIT / ธนู / หลุมล็อก | แผนที่โลก (มอนเวท ยิงไกล ฮีล) · สุ่ม · ล็อก |
| 🎒 💰 📦 📍 | bag zeny chest pin | กระเป๋า เหรียญทอง หีบ หมุดแผนที่ | กระเป๋า · เงิน · คลัง · บอสอยู่ไกล |
| 📜 📖 🧪 🧰 🔧 🪽 | scroll book potion tools wrench wing | ม้วนคัมภีร์ หนังสือ ยาแดง คีม ขนนก | ประวัติ · คู่มือ · ยา / โหมดทดสอบ · ของใช้ · ซ่อม · ปีกแฟชั่น |
| 🎩 🏺 🐺 💎 ⚗ 🌿 | helm sealcrystal fenrir gem alembic herb | หมวก ผลึกตรา เขี้ยวเฟนเรียร์ หินออฟแดง ขวดยาเขียว ขนสัตว์ | ของขวัญเควสต์ · ตรา · หอนแร็กนาร็อก · หินออฟ · สกัดเจม · วัตถุดิบ |
| ❄ ♨ 🔥 ⚡ 🔗 ⏱ 🔶 🔹 | ice fire burn volt link quick mutgem supgem | รูปเจมแปรสภาพ / เจมเสริมของเกม | เจม · สถานะช้า / ไฟไหม้ · เรโซแนนซ์ · แท็บเจม |

ภาพตอนนี้ที่ยังไม่ค่อยตรงความหมาย (💎 ⚗ 🌿 🔧 🔶 🔹 💬) มีภาพใหม่ในชีต 2 / 4 แล้ว — ได้รูปเมื่อไรเกมเปลี่ยนเอง · 🗿 ไม่ใช้เขี้ยวเฟนเรียร์แทนแล้ว เพราะบอสประจำแมพใช้ 🗿 เป็นสถานะ 'กลายเป็นหิน' ด้วย → รอหัวรูปปั้นหินในชีต 2 (ใช้ได้ทั้งวัตถุโบราณและกลายเป็นหิน)

## 0. พรอมต์กลาง (ส่งก่อน พร้อมรูปปกแคมป์ไฟ + ref_ui_icons.png)
```
I am making small UI icons for my 2D fantasy MMORPG (animal heroes from Norse, Greek, Egyptian, Japanese and Aztec myths). They replace emoji in menus, buttons, chat lines and window titles, so they are shown SMALL (16–48 px). Art style: copy the first attached image (the game's key art) — friendly hand-painted chibi cartoon, thick clean dark-brown outlines (not black), cel shading with 2–3 flat tones, soft light from the top-left, bright warm colours, a little shine ON the object. Not realistic, not painterly, not 3D, not flat vector clip-art.
The second attached image shows icons that are already in my game (a money sack, gold coins, a treasure chest, a scroll, a book, a potion, a feather, a map pin, pliers, a shield crystal, star ore, an essence vial). New icons must look like they belong to the same set: same outline weight, same chunky proportions, same finish. Never copy that image's layout.
Sheets: ONE 1536×1024 image each time, the grid I give (4 columns × 3 rows, or 4 × 2), icons evenly spaced with wide clear gaps, all about the same size.
Rules for EVERY icon: one single object with a bold, simple silhouette that still reads at 20 px; centred in its cell, filling about 75% of it, never touching the edges or its neighbours. No text, no letters, no numbers (only the symbol shapes I ask for), no frame, no badge circle behind the object, no border, no ground shadow. No glow halo or aura around any object — the area around it stays one perfectly flat colour; magic shows only ON the object.
Background: the colour I give for each sheet, SOLID and FLAT — no gradient, no texture, no shadow. Never use the background colour on the objects.
Reply OK and wait.
```

## 1. ชีต 1 — ปุ่ม + คู่มือ (เห็นบ่อยสุด · พื้นเขียว)
🎯 ล็อกเป้า (ปุ่มมือถือ) · 🧘 นั่งพัก (ปุ่มมือถือ) · 🧭 เดินไปเอง (คู่มือ) · 🎁 รางวัล / ของขวัญ · ⭐ ดาวสกิล · 💡 คำใบ้ · ❓ สอน · 👆 แตะตรงนี้ · 📚 สอนระบบ · ⏭ ข้ามเควสต์ · 🔔 / 🔕 แจ้งเตือนตลาด
```
Sheet 1 — BUTTONS AND GUIDE ICONS. 4 columns × 3 rows, read left to right, top row first. Background: SOLID FLAT PURE GREEN (#00FF00); never use green on the objects.
Row 1:
1) TARGET LOCK — a round archery bullseye (red and cream rings with a thin gold rim), seen slightly from the front, a short arrow with white fletching stuck in the centre.
2) SIT AND REST — a plump square floor cushion (zabuton) in deep indigo with gold piping and little gold tassels at the corners, a small white lotus flower resting on top (white petals, no leaves).
3) AUTO-WALK COMPASS — an antique brass explorer's compass with a glass face and a hinged lid, the needle red at one end and blue at the other pointing up-right, a tiny gold star at the north mark.
4) GIFT — a red gift box with a big gold ribbon bow on top, the lid lifted a little at one corner with a few gold sparkles peeking out.
Row 2:
5) STAR — a plump five-pointed gold star with soft rounded bevelled edges and one bright white highlight.
6) HINT — a glowing warm-yellow light bulb with a brass screw base, two tiny sparkle lines beside it.
7) HELP — a chunky question-mark symbol carved from a polished sapphire-blue gem, with a gold dot under it (this symbol is the only allowed glyph on the sheet).
8) TAP HERE — a cute white cartoon glove pointing its index finger straight up, with one short curved motion line.
Row 3:
9) LESSONS — a neat stack of three thick books (blue, red and brown leather covers with gold corner caps), the top book turned a little.
10) SKIP — two chunky gold triangle arrowheads pointing right, followed by a short vertical gold bar (a 'skip to the end' symbol), dark-brown outline.
11) BELL — a shiny gold hand bell with a small red ribbon on its handle, ringing: two short curved lines on each side.
12) BELL OFF — the same gold bell, silent, with a thick red diagonal bar across it.
Same style as the key art: friendly hand-painted chibi cartoon, thick clean dark-brown outlines, cel shading with 2–3 flat tones, bright and warm. No text, no frame, no glow halo, nothing touching the cell edges.
```

## 2. ชีต 2 — โทเท็ม + เจม (พื้นเขียว)
⚖ สมดุล · ⛏ สลักหลุม / หินตีบวก · ⚗ สกัดเจม · 💠 เจม C · 🔶 เจมแปรสภาพ · 🔹 เจมเสริม · 💎 หินออฟ / เจม · ♻ ย่อยเจม · 📑 หน้าโทเท็ม 3 หน้า · 🗿 วัตถุโบราณ · 🔁 / 🧬 ชนิดวัตถุโบราณ (เปลี่ยนกติกา / ปลดบิลด์)
```
Sheet 2 — TOTEM AND GEM ICONS. 4 columns × 3 rows, read left to right, top row first. Background: SOLID FLAT PURE GREEN (#00FF00); never use green on the objects (teal and turquoise are fine as long as they lean blue).
Row 1:
1) BALANCE — golden balance scales with two round pans hanging level, a small turquoise gem on top of the post.
2) CARVING PICK — a stone-carver's pick hammer: a steel head with one pointed end and one flat chisel end on a short wooden handle wrapped in brown leather, three small stone chips flying off the point.
3) EXTRACTION FLASK — a round glass alchemy alembic with a long curved spout, glowing violet-blue liquid inside, a small faceted blue gem forming at the tip of the spout.
4) LEGENDARY GEM — a big octagonal cut gem with a flat top, seen from slightly above, brilliant sky-blue with white facet highlights, held in a thin gold crown rim.
Row 2:
5) MUTATION GEM — a round glossy gem like a polished marble, orange with a swirling orange-red inner flame pattern, in a slim bronze rim.
6) SUPPORT GEM — a smaller round turquoise-blue gem with a soft white plus-shaped light inside, in a slim silver rim.
7) GEM — a classic faceted diamond-cut gem (flat top, pointed bottom) in rich sapphire blue with bright white facet highlights.
8) DISMANTLE — three chunky gold arrows chasing each other in a triangle loop around a small cracked blue gem in the middle (arrows gold, not green).
Row 3:
9) PAGES — three stacked parchment pages with coloured bookmark tabs sticking out on the right side (red, blue, gold).
10) RELIC — a small ancient carved stone idol head, a totem face of grey-teal stone with gold-inlaid eyes and a crack across one cheek (turquoise lichen spots, no green moss).
11) RULE CHANGE — two curved blue arrows forming a circle (a swap / repeat symbol) around a tiny gold gear.
12) NEW BUILD — a short twisted double-helix ribbon in violet and gold with small glowing white beads along it.
Same style as the key art: friendly hand-painted chibi cartoon, thick clean dark-brown outlines, cel shading with 2–3 flat tones, bright and warm. No text, no frame, no glow halo, nothing touching the cell edges.
```

## 3. ชีต 3 — สถานะ + รางวัล + ตลาด (พื้นเขียว)
☠ ติดพิษ · 🩸 เลือดไหล · 💀 พ่ายแพ้ · ⚠ บอสคลั่ง / เตือน · 💔 ของแตก · 👑 บอสประจำแมพ · 🏆 ล้มบอส · 🎉 ได้ของ / จบเส้นทาง · 🗂 ทั้งหมด · 📈 กระดานราคา · 📬 กล่องรับของ · 📰 ข่าวตลาด
```
Sheet 3 — STATUS, REWARD AND MARKET ICONS. 4 columns × 3 rows, read left to right, top row first. Background: SOLID FLAT PURE GREEN (#00FF00); never use green on the objects.
Row 1:
1) POISON — a small round glass bottle of bubbling purple poison with a cork, a cream label showing a tiny dark skull shape, two purple bubbles rising (no green).
2) BLEED — a big glossy dark-red blood drop with a white highlight, two small drops beside it.
3) DEFEAT — a cute cartoon bone-white skull with round dark eye holes and a small crack on the forehead, friendly, not scary.
4) WARNING — a rounded yellow-orange triangle sign with a thick dark-brown border and a bold exclamation-mark shape in the middle (the only symbol allowed).
Row 2:
5) BROKEN — a red heart split in two by a jagged crack, the halves slightly apart with tiny shards.
6) CROWN — a chunky gold crown with three points, each topped with a gem (red, blue, white).
7) TROPHY — a shiny gold trophy cup with two curled handles on a dark wooden base.
8) CELEBRATION — a gold party-popper cone bursting with red, blue, gold and violet confetti and curly streamers (no green confetti).
Row 3:
9) ALL ITEMS — an open brown leather folder with several coloured paper tabs sticking out (red, blue, yellow).
10) PRICE BOARD — a small parchment board with three rising bars (red, blue, gold) and a bold gold arrow zig-zagging up to the right.
11) CLAIM BOX — a wooden mailbox on a short post with its red flag raised and a sealed envelope with a red wax seal sticking out of the slot.
12) MARKET NEWS — a rolled newspaper tied with string, its lines shown only as simple grey bars (no readable text), a small gold coin stamp in the corner.
Same style as the key art: friendly hand-painted chibi cartoon, thick clean dark-brown outlines, cel shading with 2–3 flat tones, bright and warm. No text, no frame, no glow halo, nothing touching the cell edges.
```

## 4. ชีต 4 — ของสีเขียว + อื่น ๆ (พื้นชมพูม่วง · 4×2)
🌿 วัตถุดิบ · 🌱 เริ่มเกมใหม่ · 🐢 สโลว์ (ห้องเทส) · 👗 แต่งตัว · 🐾 ผู้ขาย · 📋 ต้นแบบ · 🔧 ซ่อม · 💬 แชท (ปุ่มมือถือ)
```
Sheet 4 — MIXED ICONS. 4 columns × 2 rows, read left to right, top row first. Background: SOLID FLAT PURE MAGENTA (#FF00FF); never use pink, purple, violet or magenta on the objects (green is fine on this sheet).
Row 1:
1) CRAFTING MATERIALS — a small bundle of fresh green herb leaves and a sprig, tied with brown twine.
2) NEW GAME — a tiny green sprout with two round leaves growing from a small mound of brown soil, one dew drop on a leaf.
3) SLOW MOTION — a cute little green turtle walking slowly, round brown shell with a hexagon pattern.
4) FASHION — an elegant little dress on a wooden hanger, teal with gold trim and a small gold ribbon (no pink).
Row 2:
5) SELLER — a single brown animal paw print with four round toe pads and one big pad, carved like a wooden stamp.
6) BLUEPRINT — a half-unrolled blueprint sheet (blue paper with a white line drawing of a sword), tied with string.
7) WRENCH — a steel wrench with a brass ring on its grip and a tiny spark at its jaw.
8) CHAT — two overlapping speech bubbles, one cream and one light blue, each with three small dots.
Same style as the key art: friendly hand-painted chibi cartoon, thick clean dark-brown outlines, cel shading with 2–3 flat tones, bright and warm. No text, no frame, no glow halo, nothing touching the cell edges.
```

## 5. ชีต 5 — สถานะบอสประจำแมพ (พื้นเขียว · 4×2)
✋ ถูกคว้า · 🗝 สกิลถูกผนึก · 🔇 เงียบ ใช้สกิลไม่ได้ · 🎵 ถูกดึงด้วยเพลง · 🌑 มืด · 👁 ทรายเข้าตา · 🕸 ติดใย · 🦂 ท่าเหล็กไนของราชาแมงป่อง (map_boss_kit.js / map_bosses_egy.js)
```
Sheet 5 — BOSS FIGHT STATUS ICONS (they appear on the player's buff bar). 4 columns × 2 rows, read left to right, top row first. Background: SOLID FLAT PURE GREEN (#00FF00); never use green on the objects.
Row 1:
1) GRABBED — a big rough monster hand closing in a grab: dark brown skin, three thick fingers with bone-white claws.
2) SKILL SEALED — an old ornate bronze skeleton key with a round bow holding a small violet gem, a short violet chain wrapped around its shaft.
3) SILENCED — a small golden horn (trumpet) with a thick red diagonal bar across it.
4) PULLED BY SONG — a glowing pink-violet double music note with two tiny sparkles, as if sung by a siren.
Row 2:
5) DARKNESS — a dark navy new-moon disc with a thin silver rim, two small violet wisps of shadow curling around it.
6) BLINDED BY SAND — a big cartoon eye squinting shut with a teardrop, a small puff of golden sand grains blowing into it.
7) WEB — a round silvery-white spider web with thick strands and a few shiny dew drops on it.
8) GIANT SCORPION — a golden-sand desert scorpion seen from above at an angle, claws open, segmented tail raised with a glowing orange stinger tip.
Same style as the key art: friendly hand-painted chibi cartoon, thick clean dark-brown outlines, cel shading with 2–3 flat tones, bright and warm. No text, no frame, no glow halo, nothing touching the cell edges.
```

**สถานะ 2026-11-22 21:54:** ชีต 1–6 ครบ (ชีต 6 1254×1254 พื้นเขียว) · 21:28 ชีต 1–5 ครบ — เจ้าของส่งรูปทั้ง 5 ชีต ตัดใส่เกมแล้ว 52 ภาพ (ชีต 1–3 1536×1024 พื้นเขียว · ชีต 4 1774×887 พื้นชมพูม่วง · ชีต 5 1774×887 พื้นเขียว)

## 6. ชีต 6 — ท่าบอส + ปริศนาสฟิงซ์ (พื้นเขียว · 3×3 จัตุรัส)
แถว 1 = ชื่อท่าบอสไวกิ้ง: 🍂 ร่างลวงใบไม้ (ฮุลดรา) · 🧊 ทุบธารน้ำแข็ง (โยตุน) · ⛓ โซ่ตะขอ (ดรากร์) · แถว 2 = สัญลักษณ์ปริศนาสฟิงซ์: ☀ ดวงอาทิตย์ · 🌙 จันทร์ · 👁 ตาฮอรัส · แถว 3 = ปริศนาจริงช่วงหลัง: 🌅 เช้า · 🚶 สองขา · 🦯 สามขา (☀ เที่ยง กับ 🌙 เย็น ใช้รูปแถว 2 · 🐾 สี่ขา ใช้รูปอุ้งเท้าชีต 4 ที่มีแล้ว)
```
Sheet 6 — BOSS MOVE AND SPHINX RIDDLE ICONS. This sheet is SQUARE: 1024×1024, 3 columns × 3 rows, read left to right, top row first, icons evenly spaced with wide clear gaps. Background: SOLID FLAT PURE GREEN (#00FF00); never use green on the objects (no green leaves, no grass, no green glow).
Row 1 (boss moves):
1) FALLEN LEAVES — two overlapping autumn leaves, an orange maple leaf and a rust-red oak leaf, with one short curling wind-swirl line; autumn colours only (orange, rust red, gold, brown), no green anywhere, not even on the veins or stems.
2) ICE BLOCK — a chunky cube of clear glacier ice with bevelled edges and bright white highlights, a jagged crack across its front face and two small chips breaking off; pale icy blue leaning toward lavender, never cyan, teal or mint.
3) CHAIN HOOK — a short length of heavy dark iron chain (four or five chunky links) ending in a sharp curved iron hook, cold blue-grey steel with warm highlights.
Row 2 (riddle symbols):
4) SUN — a round golden sun disc with short triangular orange rays all around and one bright white highlight, warm and cheerful, no face.
5) MOON — a plump cream-gold crescent moon with soft shading and one tiny four-point star sparkle beside it, no face.
6) EYE OF HORUS — an ancient Egyptian Wedjat eye amulet of polished gold with deep lapis-blue enamel lines: the stylised eye with its long eyebrow, the straight drop line under the eye and the curled spiral tail.
Row 3 (the riddle of the legs):
7) SUNRISE — the upper half of an orange-gold sun with fanned rays rising from behind a small golden sand dune, two thin pink-orange cloud wisps across it.
8) TWO FEET — a pair of bare human footprints, left and right, one a step ahead of the other, warm tan-brown, carved like small wooden stamps with five round toes each (the same carved style as the paw print of sheet 4).
9) WALKING CANE — an old man's wooden walking cane with a curved crook handle, polished gnarled brown wood and a small brass tip, standing slightly tilted.
Same style as the key art: friendly hand-painted chibi cartoon, thick clean dark-brown outlines, cel shading with 2–3 flat tones, bright and warm. No text, no frame, no glow halo, nothing touching the cell edges.
```
- ตัด: `python3 tools/emo_icons.py cut 6 <ไฟล์ชีต.png>` (ถ้าได้รูป 1536×1024 แทนจัตุรัสก็ตัดได้เหมือนกัน — ตัวตัดหาชิ้นจากพื้นเขียวเอง)
