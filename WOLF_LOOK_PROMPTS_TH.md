# หมาป่าขาว (White Wolf): ลุคใหม่ 5 แบบ (2026-11-24 20:08)

เจ้าของ: "อยากเปลี่ยนดีไซน์หมาป่า" (ไม่ได้บอกแนว) → เขียนไว้หลายแนวให้เลือก:
- หมาป่าเต็มตัว 3 แบบ: แบบ 1 ครบสองสาย · แบบ 2 สาย A คลั่ง · แบบ 3 สาย B รูน
- สาวหมาป่า 1 แบบ (แบบ 4)
- ลุคเดิมแต่งให้เท่ 1 แบบ (แบบ 5)

ถ้าไม่ตรงใจ บอกแนวที่อยากได้มาได้เลย

**2026-11-25 08:34 คลิปมาแล้ว 19 คลิป → ร่างใหม่อยู่ในเกมแล้ว** (`assets_wolf.js`, ดู CLAUDE.md 'Wolf sprite BUILT') · ขาดคลิปฟันขวานเฉียงหลัง (NE): ทิศนั้นยืมท่าฟันด้านข้างแบบเดิม · หน้าในช่อง HUD = `assets/heroes/wolf/face.webp` (จากภาพยืนหน้าตรง) · แฟชั่น: เจ้าของบอก 'แฟชั่นไม่ต้องใส่ ใส่แค่ปีก' → ร่างใหม่ใส่ได้แค่ปีก (หมวก / หน้า / ไหล่ / ผ้าคลุม / ของติดหลัง / สกินขวาน / สีขน-สีชุดปิด)

**เลือกแล้ว 2026-11-24 20:28: แบบ 1 ทายาทเฟนรีร์** ("เอาอันนี้ เก็บภาพซ้ายไว้ด้วย จะเอาไปทำภาพในหน้าเลือกตัวละคร") → ชีต `assets/heroes/wolf/sheet_fenrir_heir.webp` · ภาพใหญ่ด้านซ้ายตัดพื้นออกแล้ว `assets/heroes/wolf/bigpose_fenrir_heir.webp` และเป็นภาพหน้าเลือกตัวแล้ว (`select.webp`) · หน้าตา + พรอมต์ภาพยืน 5 มุม: หัวข้อ 'เลือกแล้ว' ท้ายไฟล์ · คลิปท่า 20 ตัว: `WOLF_CLIP_PROMPTS_TH.md` · ภาพยืน 5 มุมครบแล้ว (20:50 สี่มุม + 20:57 มุมเฉียงหลัง → `assets/heroes/wolf/view_S|SE|E|NE|N.webp`) · ภาพตั้งต้นส่งครบ 5 ทิศแล้ว → รอคลิป 20 อัน

## หมาป่าผูกกับลุคเดิมมากกว่าทุกตัว
- **สไปร์ท `assets.js`** เป็นร่างของหมาป่า และเป็นร่างชั่วคราวของอีก 5 ตัว (จิ้งจอก อนูบิส สิงโต จระเข้ อีกา) · ความสูงของหมาป่าเป็นไม้บรรทัดของฮีโร่ทุกตัว (`CHAR_SCALE` วัดเทียบหมาป่า)
- **แฟชั่นที่ติดบนตัว:** หมวกทุกใบ (หมวกวาด Sunfire, หมวกโค้ดลอเรล / มงกุฎเควทซัล, หมวกเก่าจาก Aetherfall), ปีก 12 แบบ, ผ้าคลุม, ของหลัง, สกินขวาน — วางตามจุดหัว / หลัง / มือที่วัดไว้ทุกเฟรมของสไปร์ทเดิม (`FASHION.head` ใน `assets_fashion.js`) · ออร่ากับภูตโทเท็มไม่ผูกกับสไปร์ท ใช้ต่อได้เลย
- **สีขน / สีชุดตอนสร้างตัว:** หน้ากากสี `assets_fur.js` `assets_cloth.js` `assets_skin.js` ทำจากสไปร์ทเดิม
- **เอฟเฟกต์ฟันขวาน** (`wolf_fx.js` + `wolf_vfx3.js`) วิ่งตามตำแหน่งหัวขวานที่วัดไว้ทุกเฟรมของสไปร์ทเดิม
- **ภาพวาด:** ไอคอนสกิล 63 ภาพ · พื้นหลังผังสกิล 4 ภาพ · ภาพหน้าเลือกตัว · หน้า HUD (ฮีโร่ที่ยังไม่มีหน้าของตัวเองก็ใช้หน้าหมาป่านี้) · ภาพหน้าโหลด 7 จาก 8 ภาพมีหมาป่าตัวนี้ (ld1 ld2 ld4–ld8)
- ร่างโคลนทองของ Valhalla's Wrath ใช้สไปร์ทของหมาป่าเอง → เปลี่ยนตามเอง

**ถ้าเปลี่ยน ทำแบบนี้:**
- สไปร์ทใหม่เป็นไฟล์ใหม่ `assets_wolf.js` โหลดเฉพาะตอนเล่นหมาป่า ไม่เขียนทับ `assets.js` → 5 ตัวที่ยืมร่างยังใส่ร่างเดิมจนกว่าคลิปของตัวเองจะมา · หน้า HUD ของตัวอื่นไม่เปลี่ยน
- คลิป 20 ตัว คงเวลาเฟรมตี / ร่ายเดิม → ดาเมจกับจังหวะไม่เปลี่ยน · ตัวสูงบนจอเท่าเดิม → ไม่ต้องวัดฮีโร่ตัวอื่นใหม่
- งานที่ตามมา:
  - วัดจุดหัว / หลัง / มือใหม่ แล้วจูนหมวก ปีก ผ้าคลุมทีละชิ้น
  - หาตำแหน่งหัวขวานทุกเฟรม
  - หน้ากากสีขน / สีชุด ทำใหม่ หรือซ่อนไว้ก่อน (ลุคที่ขนขาวแยกจากชุดชัดๆ ทำง่ายกว่า)
  - หน้า HUD + ภาพหน้าเลือกตัว
  - ทีหลัง: ไอคอน 63 + ผังสกิล 4 ภาพ + ภาพหน้าโหลด
- แบบ 5 ใกล้ลุคเดิมที่สุด ไอคอน ผังสกิล และภาพหน้าโหลดเดิมยังพอเข้ากันได้นานสุด

## ทำไมลุคเดิมยังไม่เด่น
- หน้าเป็นคนมีหูหมาป่า ส่วนฮีโร่ชายตัวอื่นเป็นสัตว์เต็มตัว (อนูบิส ฮิปโป แมว ลิง มังกร แรด) → มองไกลๆ ไม่รู้ว่าเป็นหมาป่า
- ผมชมพูอ่อน ขนขาว ชุดน้ำตาลครีม สีจางทั้งตัว → บนแผนที่หิมะของนอร์ส (บ้านของมันเอง) กลืนไปกับพื้น
- ขวานเล็กเหมือนขวานผ่าฟืน ทั้งที่ไอเทมชื่อ Greataxe และสกิลเป็นการฟันขวานใหญ่ (Blood Cleave, Executioner, Axe Cyclone)
- ชุดหนังมีกระเป๋าคาดเอว ดูเป็นนักเดินทาง / พราน ไม่มีอะไรบอกสาย A (คลั่ง เลือด) หรือสาย B (รูน น้ำแข็ง สายฟ้า)
- บูทใหญ่หนา + ผ้าคลุมขนสัตว์ฟู + หางฟู → เงาตัวป้อม ช่วงล่างหนัก

## กติกา (อยู่ในพรอมต์ 0 แล้ว)
- **หมาป่าขาว:** ขนขาวหนา แผงขนคอฟูใหญ่ หูตั้งแหลม หางพวงยาว เห็นหางทุกมุม · แต่ละแบบบอกเองว่าเป็นหัวหมาป่าเต็มตัวมีปาก (แบบ 1–3) หรือหน้าคนมีหูหมาป่า (แบบ 4–5)
- **หัวโล่งเสมอ:** หน้า ตาสองข้าง หูสองข้าง เห็นทุกมุม · ห้ามหมวกเกราะ ฮู้ด หมวก · ใส่ได้แค่ผ้าคาดหัว วงแหวนบางๆ ห่วงถักเปีย → หมวกแฟชั่นใส่ได้ทีหลัง
- **ขวานใหญ่เล่มเดียวทุกมุม:** ด้ามยาว ใบขวานมีเครา ใหญ่กว่าหัว ไม่บังหน้า ถือในมือเสมอ (ไม่สะพายหลัง) · หัวขวานเห็นชัด → หาตำแหน่งหัวขวานในคลิปได้
- **เด่นบนหิมะ:** ขนขาว ชุดต้องสีเข้มสด (กรม ถ่าน แดงเข้ม) ไม่ใช่ครีม / พาสเทล
- **เงานักรบ:** ไหล่กับแขนแข็งแรง (แน่นกว่าอนูบิส เบากว่าแรด) · ชุดยาวไม่เกินเข่า ให้เห็นขาตอนเดิน · บูทพอดีเท้า
- **หลังโล่ง:** ผ้าคลุมสั้นแค่สะบัก หรือผ้าขนสัตว์คลุมไหล่ · ห้ามผ้าคลุมยาว ห้ามโล่หรืออาวุธบนหลัง → ปีก / ผ้าคลุมแฟชั่นใส่ได้ · ของห้อยน้อย
- **ไม่ซ้ำฮีโร่อื่น:** อนูบิส (หมาจิ้งจอกสีเข้ม ผอม ทองอียิปต์) · สิงโตขาว (กรีก ทอง) · จิ้งจอกเก้าหาง (สาวจิ้งจอกขาว ชุดศาลเจ้าแดงขาว) · แมวขาวผ้าพันคอแดง (อยู่ในภาพแนบ)
- **ห้ามสีเขียว** (คลิปตัดพื้นเขียว) · ห้ามตัวอักษร · รูนเป็นสัญลักษณ์เส้นตรงเรียบๆ อ่านไม่ออก
- **มุมขวาล่างของชีต:** ท่าสู้ 2 ท่า ใช้ดูว่าลุคนี้เวลาสู้เท่ไหม และเป็นแบบให้ไอคอนกับผังสกิลทีหลัง
  - ฟันขวานทแยง ทิ้งรอยแสงสีแดงกว้าง = สาย A Berserker
  - ชูขวานร่ายรูน รูนน้ำแข็งวนรอบตัว ผลึกน้ำแข็งพุ่งจากพื้น สายฟ้าขาวฟ้า = สาย B Runic

## วิธีใช้
1. เปิดแชต ChatGPT ใหม่
2. ส่งพรอมต์ 0 พร้อมแนบ 2 ภาพ (ส่งให้ในแชตแล้ว):
   - `keyart_style_ld3.jpg` = ภาพหน้าโหลดแมวตีกลอง (`assets/loading/ld3.webp`) ใช้เป็นแบบลายเส้น · **อย่าใช้ภาพปกแคมป์ไฟ (ld5) แบบที่ใช้กับตัวอื่น** เพราะมีหมาป่าตัวเดิมอยู่ ChatGPT จะลอกลุคเดิมมา (ภาพหน้าโหลดภาพอื่นก็มีหมาป่าเดิมแทบทุกภาพ ยกเว้น ld3)
   - `hero_ref_anubis.jpg` (`tools/ref/`) = อนูบิสบนพื้นครีม แบบสัดส่วนฮีโร่ชายที่เป็นสัตว์ตระกูลหมา ไม่ให้ลอกชุด
3. รอให้มันตอบ ready
4. ส่งแบบ 1–5 ทีละข้อความ (ข้อความละ 1 ภาพ) · **แบบ 5 แนบ `wolf_old_ref.jpg` (ลุคเดิม, `tools/ref/`) ไปกับข้อความนั้นด้วย**
5. ชอบคนละส่วน → ใช้พรอมต์ผสม

ประโยคแก้ภาพ (ต่อท้ายแล้วส่ง):
- แบบ 1–3 ยังดูเป็นคนใส่หูหมา → `Make him a real wolf: a full wolf head with a muzzle and a black nose, fur on his face, no human face.`
- เหมือนอนูบิส / หมาจิ้งจอก → `He looks too much like a jackal: give him a broader head and muzzle, thick fluffy cheek fur, a big neck ruff and snow-white fur.`
- สีจาง กลืนหิมะ → `He must stand out on snow: make his outfit darker and more saturated (deep navy, charcoal, crimson); only his fur stays white.`
- ขวานเล็ก → `Make his axe a big Viking greataxe: a long haft and a broad bearded blade, clearly bigger than his head.`
- ใส่หมวก / ฮู้ดมา → `Remove the headgear: both ears, both eyes and his whole face must stay fully visible (a thin headband or braid rings only).`
- ผ้าคลุมยาว → `Shorten the cape to a small half-cape that ends at his shoulder blades, so his back and tail stay clear.`
- มีสีเขียว → `Remove every green: use ice blue, navy, silver or crimson instead.`
- ดุจนน่ากลัว → `Keep him cool, but in the friendly chibi cartoon style of the attached images: a bigger head, bigger eyes and simpler shapes.`
- อยากได้แบบไหนเป็นผู้หญิง → `Make the hero a girl, with the same outfit idea and colours.`
- แก้แค่บางส่วน → ใช้แปรงเลือกเฉพาะจุดใน ChatGPT (สั่งแก้ทั้งภาพ มันจะวาดใหม่หมด)

## 5 แบบ

| แบบ | ลุค | สีตัด | ท่าภาพใหญ่ | ผูกกับ |
|---|---|---|---|---|
| 1 ทายาทเฟนรีร์ | หมาป่าเต็มตัว ขนขาว หลังกับปลายหูเทาเงิน แผงคอฟูใหญ่ ตาฟ้าน้ำแข็ง แผลที่คิ้ว · เสื้อหนังแขนกุดสีกรมขอบลายถักเงิน · บ่าเหล็กรูปหัวหมาป่า + ผ้าคลุมสั้นสีแดงบุขนขาว · โซ่ Gleipnir ขาดพันแขน · ขวานใหญ่ใบเงินสลักหัวหมาป่า เส้นรูนฟ้าเรืองที่คม | กรม + แดง + เงิน | พาดขวานบนบ่า กำหมัดให้โซ่ขาดแกว่ง ยิ้มเห็นเขี้ยว | ครบสองสาย · บอสเฟนรีร์ของแดนนอร์ส + เศษ Gleipnir ที่บอสดรอป + สกิลวิญญาณเฟนรีร์ |
| 2 เบอร์เซิร์กเกอร์โลหิต | หมาป่าเต็มตัว ขนขาวฟูชี้ ตาอำพัน ลายสงครามแดงสามเส้นแบบรอยเล็บ · ผ้าขนหมีสีน้ำตาลคลุมไหล่ (นักรบคลั่งในตำนานนอร์สใส่หนังหมี) · อกกับแขนเปลือย ผ้าพันแขนแดง · กระโปรงรบแดงเย็บแผ่นเหล็ก · ขวานสองมือใบเหล็กดำคมแดง | แดง + เหล็กดำ + น้ำตาล | ย่อตัวคำราม เหวี่ยงขวานไปหลังไหล่พร้อมฟัน | สาย A (Blood Cleave, War Fury, Vampiric Axe, Executioner) |
| 3 ผู้พิทักษ์รูนน้ำแข็ง | หมาป่าเต็มตัว ขนขาวเงินอมฟ้า ผมยาวมัดต่ำ รอยรูนฟ้าเรืองที่แขนกับแก้ม · เสื้อกรมเกือบดำ เกราะเกล็ดเงิน ผ้าคลุมสั้นบุฟ้า หินรูนสามก้อนที่คอ · ขวานใบคริสตัลน้ำแข็ง ด้ามเงินสลักรูน | กรมเข้ม + ฟ้าน้ำแข็ง + เงิน | ยืนหันข้าง ถือขวานต่ำ อีกมือมีรูนน้ำแข็งลอย | สาย B (Rune Guard, Blizzard, Ice Prison, Thunder Fang) |
| 4 สาวหมาป่าชีลด์เมเดน | ผู้หญิง หน้าคน หูหมาป่า หางพวง · ผมขาวถักเปียสองข้าง ริบบิ้นแดง มงกุฎบางมีปีกเล็กที่ขมับ · เสื้อกรม เกราะอกเงินรูปหัวหมาป่า ผ้าคลุมสั้นแดง กระโปรงจีบแดง · ขวานใหญ่กว่าตัว | กรม + แดง + เงิน | โน้มตัว พาดขวานบนบ่า มือเท้าเอว ยิ้มมั่นใจ | ถ้าอยากได้หมาป่าเป็นผู้หญิง (ห้ามคล้ายจิ้งจอกเก้าหาง) |
| 5 หมาป่าขาวโฉมใหม่ | ลุคเดิมแต่งให้เท่: หน้าคนหูหมาป่า ผมขาวเงินอมฟ้า (ไม่ชมพู) เปียข้างเดิม ลายแดงที่แก้ม · เสื้อหนังน้ำตาลเข้มแผงกรม ผ้าพันคอแดง ผ้าขนขาวคลุมไหล่สั้น ไม่มีกระเป๋า บูทพอดีเท้า · ขวานใหญ่ใบเงินลายเกล็ดหิมะ | น้ำตาลเข้ม + กรม + แดง | พาดขวานบนบ่า กำหมัด ผมกับผ้าพันคอปลิวลม | ไอคอน ผังสกิล ภาพหน้าโหลดเดิมยังพอเข้ากันได้ |

แนะนำ:
- **แบบ 1** ครบสองสาย ผูกกับเฟนรีร์ที่เป็นบอสของแดนนอร์ส และอ่านออกทันทีว่าเป็นหมาป่า
- **แบบ 5** ประหยัดสุด (ไอคอน ผังสกิล ภาพหน้าโหลดเดิมใช้ต่อได้นานสุด)
- ชื่อในหน้าเลือกตัว "White Wolf · Warrior" ใช้ได้ทุกแบบ

### พรอมต์ 0 — กติกา (ส่งครั้งเดียวต่อแชต พร้อมแนบ 2 ภาพ)
```
I will ask you for several character design sheets of ONE hero for my cute cartoon fantasy MMORPG (animal heroes from Norse, Greek, Egyptian, Japanese and Aztec myths). These rules apply to every sheet in this chat. Do not draw anything yet: reply only "ready", then draw ONE sheet each time I send a design.

Style: copy the first attached image (the game's key art) — friendly hand-painted chibi cartoon, thick clean dark-brown outlines (not black), cel shading with 2–3 flat tones, soft cartoon glow, bright and warm. Not realistic, not painterly, not 3D. The cat in the first image and the jackal in the second image are other heroes of my game: match their proportions, outline weight, colouring and finish, but do NOT copy their designs.

The hero: the White Wolf, a young Norse warrior of the snowy north and the main hero of my game. He fights with a big Viking greataxe. One path makes him a berserker — frenzied axe combos, crimson slashes that make enemies bleed, life-stealing strikes, war howls and battle banners. The other path makes him a rune warrior — glowing frost runes, rune shields orbiting him, blizzards, ice prisons and lightning from the sky. His strongest skills call the giant spirit wolf Fenrir and the golden gates of Valhalla. He must look COOL and confident — a proud young warrior that players pick because he looks strong — while staying in the game's cartoon style (a hero, not a monster):
- a WHITE wolf: thick snow-white fur (each design gives its shading and markings), a big fluffy neck ruff, upright pointed wolf ears, a long bushy wolf tail visible in every view
- each design says whether he has a full wolf head with a muzzle or a human face with wolf ears
- his face, both eyes and both ears are always fully visible: no helmet, no hood, no hat, no big headdress — only a thin headband, a thin circlet or rings in his braids if the design gives them
- ONE big Viking greataxe in every view (each design gives its look): a long haft and a broad bearded blade, clearly bigger than his head, never covering his face. He holds it in his hand — never strapped to his back
- he must stand out on snow: his fur is white, so his outfit uses deep, saturated colours (each design gives them), never pale beige or pastel
- a clear warrior silhouette: strong arms and shoulders, sturdier than the jackal but much lighter than a heavy tank; the outfit ends at or above the knee so his legs read clearly when he walks; boots that fit his feet
- his back stays fairly clear: at most a short half-cape or a fur mantle that ends at the shoulder blades — no long cape, no shield or weapon on his back; only a few dangling items
- he must look clearly different from my other heroes: the jackal (dark, slim, Egyptian gold), a white Greek lion in gold, and a white fox shrine maiden in red and white
- no green anywhere on the character (use ice blue, navy, silver or crimson instead), and no letters or words anywhere — rune marks are simple angular carved symbols, never readable text

Every sheet: ONE wide image 1536×1024 on a plain soft cream background. No text, no labels, no names, no logo, no watermark.
Layout: LEFT HALF — the hero large, full body, three-quarter front view, in the pose the design gives. TOP RIGHT — a small turnaround of the same hero standing neutral with the axe held at his side: front, side facing right, back, all the same height. BOTTOM RIGHT — two small action poses of the same hero side by side: a frenzied berserker cleave, a big diagonal axe swing leaving a wide crimson energy arc, his fur bristling; and a rune spell, the axe raised overhead while glowing ice-blue runes circle him, frost crystals burst from the ground and white-blue lightning crackles down.
Keep the hero identical in every view of a sheet. Every design I send is a completely new look: reuse nothing from earlier sheets in this chat.
```

### แบบ 1 — ทายาทเฟนรีร์
```
Design 1 — "Fenrir's Heir". A young wolf who carries the blood of Fenrir, the giant wolf of Norse myth, and wears a broken piece of Gleipnir, the magic chain that once bound him. A full wolf head with a strong muzzle, a black nose and a few sharp fangs. Snow-white fur with pale blue-grey shading, a darker silver-grey saddle across his shoulders and silver-grey ear tips, a huge fluffy white neck ruff, a long bushy tail with a silver-grey tip. Sharp ice-blue eyes under strong brows, a small scar through his left brow, a confident fanged grin. A thin braid behind one ear with an iron ring. A sleeveless deep-navy leather jerkin with silver Norse knotwork trim and a round silver brooch; white-furred arms with dark leather bracers; an iron pauldron shaped like a snarling wolf head on his left shoulder; a short crimson half-cape lined with white fur over his right shoulder, ending at the shoulder blades. A wide dark leather belt with a round silver knotwork buckle, a short navy tunic skirt with a crimson hem above the knee, dark charcoal trousers wrapped with crisscross leather straps, sturdy dark boots with white fur tops. The broken chain: a thin silver ribbon-like chain wrapped around his left forearm, two broken links hanging from it. The axe: a big bearded Viking greataxe with a long dark-wood haft wrapped in crimson leather and a broad silver-steel blade carved with a wolf head, a thin ice-blue rune line glowing along its edge. Accent colours: deep navy and crimson with silver. Pose: the greataxe resting on his right shoulder, his left fist clenched so the broken chain swings, standing tall with his ruff blown by the wind, a cocky fanged grin.
```

### แบบ 2 — เบอร์เซิร์กเกอร์โลหิต
```
Design 2 — "Blood Berserker". The frenzied axe warrior who howls before battle and fights until his fur stands on end — like the berserkers of the sagas, he wears a bear pelt. A full wolf head with a broad muzzle and big fangs. Shaggy, spiky snow-white fur with warm grey shading, wild cheek fur, a huge spiky neck ruff, a shaggy tail. Fierce amber eyes, three crimson war-paint claw stripes across his right eye and down his right arm. His mane tied back with a leather cord, two small braids with iron rings and a wolf-fang bead. A short dark-brown bear-fur mantle over his shoulders, held at his chest by a big iron ring (no bear head; at the back it ends above his waist). A bare, white-furred muscular chest and arms; crimson cloth wraps on his forearms and hands; a wide black leather belt with iron studs and a round iron buckle shaped like a snarling wolf; a crimson war kilt cut above the knee with dark iron plates sewn on; dark iron greaves over fur leg wraps; dark leather boots. The axe: a huge two-handed bearded greataxe with a notched dark-iron blade, a crimson edge, a haft wrapped in crimson cloth and a wolf-fang charm tied below the blade. Accent colours: crimson and dark iron with dark brown fur. Pose: a battle roar in a low lunge, the greataxe swung back over his shoulder in both hands, ready to cleave, his ruff bristling.
```

### แบบ 3 — ผู้พิทักษ์รูนน้ำแข็ง
```
Design 3 — "Rune Frost Warden". The rune warrior of the north who carves frost runes into the air, calls blizzards and catches lightning on his axe. A full wolf head with an elegant, slightly long muzzle. Silver-white fur with pale ice-blue shading, a sleek long mane falling behind his shoulders and tied low with a silver ring, a fluffy neck ruff, a long silver-white tail. Calm, sharp pale-blue eyes, a confident smirk. Glowing ice-blue rune marks on his forearms and one on his left cheek (simple angular symbols). A fitted midnight-blue tunic with silver knotwork trim, a silver scale-mail vest over it, a silver pauldron with a carved snowflake on his right shoulder, a short midnight-blue shoulder cape lined with ice blue that ends at his shoulder blades; three small carved rune stones on a cord around his neck. A silver belt; the tunic's split skirt ends above the knee; navy trousers; grey-silver boots with white fur tops. The axe: an elegant greataxe with a silver haft carved with runes that glow faint blue, a broad blade of clear ice-blue crystal set in silver, and a small rune-stone pommel. Accent colours: midnight blue, ice blue and silver. Pose: standing side-on, the greataxe held low in his right hand, his left hand raised with a small glowing ice-blue rune floating above the palm, frosty breath, a cool smirk.
```

### แบบ 4 — สาวหมาป่าชีลด์เมเดน
```
Design 4 — "White Wolf Shieldmaiden". This time the hero is a girl: a young Norse shieldmaiden with a human face, wolf ears and a wolf tail, who swings a greataxe bigger than herself. All the rules above apply to her. A pretty cartoon face with big ice-blue eyes, a small dark wolf nose tip, a confident grin with one small fang, and a thin crimson war-paint line under each eye. Long snow-white hair with silver shading and bangs, two thick side braids tied with silver rings and short crimson ribbons, tall white wolf ears with silver-grey tips, a thin silver circlet with two tiny wing ornaments at her temples. A fitted navy tunic with silver knotwork trim under a silver breastplate shaped like a wolf head, a white fur collar, a short crimson half-cape on her left shoulder that ends at the shoulder blades, leather bracers with silver studs, a wide belt with a round silver buckle, a pleated crimson skirt above the knee over dark leggings, fur-topped boots. A long fluffy white tail. The axe: a big bearded greataxe with a silver blade and a crimson-wrapped haft. Accent colours: navy and crimson with silver. Pose: leaning forward with the greataxe swung over her shoulder, one hand on her hip, her braids and tail swinging, a cocky grin. She must not look like a fox shrine maiden: Norse clothes only, nothing Japanese, no red-and-white kimono.
```

### แบบ 5 — หมาป่าขาวโฉมใหม่ (แนบ `wolf_old_ref.jpg` ไปกับข้อความนี้)
```
Design 5 — "White Wolf Reborn". The hero my game already has (the image attached to this message): a young warrior with a human face, wolf ears and a wolf tail. Keep his idea — fluffy white hair with a side braid, wolf ears, the red mark on his cheek, the fur collar, the fluffy white tail, the snowflake emblem — but make him cool and strong. Pure silver-white hair with pale ice-blue shading (no pink), spiky and swept back, wolf ears with grey tips; sharper ice-blue eyes, a confident smirk with one fang, two crimson war-paint stripes on his cheek. A darker Norse outfit: a deep-brown leather jerkin with navy panels and silver knotwork trim, a short white fur mantle on his shoulders that ends at the shoulder blades, a crimson scarf, one leather pauldron with a silver snowflake emblem, dark leather bracers, a belt with a round silver buckle (no bags or pouches), a navy tunic skirt above the knee, dark trousers, fitted fur-topped leather boots (not big boots). The axe: a big bearded greataxe with a dark haft and a broad silver blade engraved with a snowflake. Accent colours: deep brown and navy with crimson. Pose: the greataxe resting on his shoulder, the other hand clenched in a fist, a cocky smirk, his hair and scarf blown by the snowy wind.
```

### พรอมต์ผสม (ตัวอย่าง — เปลี่ยนเลขกับส่วนได้)
```
Design 6 — a mix: the head and fur of design 1 with the outfit and colours of design 3, in the pose of design 2. Same rules and layout.
```

## เลือกแล้วทำอะไรต่อ
1. ส่งชีตที่เลือกมา → เขียนหัวข้อ 'เลือกแล้ว' ในไฟล์นี้ (หน้าตาตามที่วาด + พรอมต์ภาพยืน 5 มุมบนพื้นเขียว S SE E NE N ด้านข้างหันขวา ท่าเดียวกัน ขนาดเท่ากัน ถือขวานทุกมุม)
2. ภาพตั้งต้น (`tools/dir8cut.py startv`) + พรอมต์คลิป 20 ตัว (`tools/clip_prompts.py` เพิ่มรายการ wolf: ท่าตี = ฟันขวานทแยงลง · ท่าบัฟ = ชูขวานเหนือหัวค้างไว้ราว 1 วิ)
3. คลิปมา → `tools/cliphero.py` → **ไฟล์ใหม่ `assets_wolf.js`** (prefix เช่น WLF สลับเข้าเหมือนตัวอื่น เฉพาะ `?char=wolf` · `assets.js` ไม่แตะ) คงเวลาเฟรมของ `assets.js`:
   - ท่าตี 12 เฟรม 900 ms
     - S = 80, 50, 90, 50, 50, 50, 70, 200, 50, 50, 50, 110 (โดนเฟรม 6 = 370 ms)
     - SE = 50, 50, 190, 70, 90, 50, 50, 50, 50, 50, 90, 110 (เฟรม 4 = 360 ms)
     - E = 80, 50, 50, 100, 50, 120, 60, 120, 50, 50, 50, 120 (เฟรม 6 = 450 ms)
     - N = 110, 120, 50, 50, 70, 50, 120, 70, 50, 50, 50, 110 (เฟรม 6 = 450 ms)
     - NE ตอนนี้ใช้ท่าตีของ E (`atkRemap`) → คลิป NE ใหม่ใช้เวลาของ E
   - ท่าบัฟ 12 เฟรม 1.4 วิ จุดสูงสุดเฟรม 7: S 1,050 ms · E 510 · NE 460 · N 700 · SE มี 6 เฟรม 1.32 วิ จุดสูงสุดเฟรม 3 (660 ms)
   - เดิน 8 × 100 ms (E สลับ 110 / 90) · ยืน 12 เฟรม 2.4 วิ · โดนตี 7 เฟรม 550 ms
   - ตัวยืน S สูงบนจอเท่าเดิม (ไม้บรรทัดของทุกตัว) · ตำแหน่งหัวขวานทุกเฟรมของท่าตีกับท่าบัฟ (`sockets` เดิมมี attack + buff; เอฟเฟกต์ฟันขวานวิ่งตาม)
4. ตามมา:
   - จุดหัว / หลัง / มือของแฟชั่น: ทำเครื่องมือวัดจากสไปร์ทใหม่ (ตอนนี้ `FASHION.head` ฝังมากับไฟล์ ไม่มีเครื่องมือสร้าง) แล้วจูนหมวก ปีก ผ้าคลุมทีละชิ้น
   - หน้ากากสีขน / สีชุด: ทำใหม่ หรือซ่อนแถบสีตอนสร้างตัวไว้ก่อน
   - หน้า HUD (`window.HUD_FACE`) + ภาพหน้าเลือกตัว + ท่านั่ง
5. ทีหลัง: ไอคอน 63 + ผังสกิล 4 ภาพ + ภาพหน้าโหลดที่มีหมาป่า (เขียนพรอมต์ให้ตอนลุคนิ่งแล้ว)

## เลือกแล้ว: แบบ 1 ทายาทเฟนรีร์ (2026-11-24 20:28)
- เจ้าของส่งชีต + "เอาอันนี้ เก็บภาพซ้ายไว้ด้วย จะเอาไปทำภาพในหน้าเลือกตัวละคร" → ชีตเก็บที่ `assets/heroes/wolf/sheet_fenrir_heir.webp` (1536×1024 พื้นครีม)
- ภาพใหญ่ด้านซ้าย: ตัดพื้นครีม + เงาพื้นออก (ไล่จากขอบภาพ หยุดที่เส้นขอบตัว · เก็บข้อโซ่ที่หล่น · ไม่เอาหางของภาพท่าสู้ข้างๆ) → `assets/heroes/wolf/bigpose_fenrir_heir.webp` (675×1007 พื้นใส) → ใส่หน้าเลือกตัวแล้ว `assets/heroes/wolf/select.webp` (`tools/select_cut.py` วางสเกลเดียวกับตัวอื่น · `char_create.js` SELV wolf 2 = กันแคชภาพเก่า) · ภาพเลือกตัวเดิม (ลุคเก่า) อยู่ในประวัติ git
- ในเกมตอนนี้: หน้าเลือกตัวเป็นลุคใหม่แล้ว แต่ตัวในเกม หน้า HUD ไอคอน ผังสกิล ยังเป็นลุคเดิมจนกว่าคลิป 20 ตัวจะมา

**หน้าตาตามที่วาดออกมา** (ใช้ในพรอมต์ต่อๆ ไปทุกตัว):
- **หัว:** หมาป่าเต็มตัว ขนขาว เงาม่วงเทาอ่อน ขนหัวกับแก้มชี้ฟู · ปากยาวพอดี จมูกดำ เขี้ยวเล็ก · ตาฟ้าสด คิ้วเข้ม · แผลเป็นสีแดงพาดคิ้ว · หูตั้งแหลม ในหูม่วงเทา · เปียขาวเส้นเล็กมีห่วงเงินสองห่วง ห้อยหลังหู
- **คอ / ไหล่:** ขนคอสีครีมฟูหนา บนผ้าคลุมแดงเข้มบุขนขาว คลุมไหล่ทั้งสองข้าง ด้านหลังยาวถึงกลางหลัง ขอบขนขาวหยัก · เข็มกลัดเงินกลมลายปมนอร์ส · **บ่าซ้าย** = เกราะบ่าเหล็กเข้มรูปหัวหมาป่าคำราม ตาฟ้าเรือง
- **ตัว:** เสื้อตัวยาวแขนกุดสีกรมเข้ม แถบลายปมเงินยาวลงด้านหน้า ชายผ่าหน้าสองแผ่นยาวถึงกลางต้นขา ขอบลายปมเงิน ซับในแดง · เข็มขัดหนังน้ำตาล หัวเข็มขัดเงินกลมใหญ่ลายปม
- **แขน:** แขนเปลือยขนขาว ปลอกแขนหนังน้ำตาลเข้มทั้งสองข้าง · **ข้อมือซ้าย** = กำไลเหล็กมีโซ่ขาดห้อย 4 ข้อ (โซ่ Gleipnir) · กำปั้นขาวใหญ่
- **ขา:** กางเกงพองสีดำถ่าน · บูทหนังน้ำตาลเข้ม ขอบขนขาวหนาใต้เข่า สายหนังพันไขว้
- **หาง:** พวงใหญ่ฟูมาก ขาว เงาม่วงอ่อน
- **ขวาน (มือขวา):** ขวานยาวเกือบเท่าตัว ด้ามแดงเข้มพันสายดำ ห่วงเงิน ปลายด้ามเงินแหลม · ใบขวานเงินรูปจันทร์เสี้ยว สลักหัวหมาป่าเหล็กเข้มตาฟ้า เส้นรูนฟ้าเรืองที่คม · บนสุดมีหัวเหล็ก
- **สี:** ขาว + กรม + แดงเข้ม + เงิน + เหล็กเข้ม + หนังน้ำตาล · ไม่มีสีเขียวเลย (นับแล้ว 0 จุด) → ตัดพื้นเขียวได้ปลอดภัย

**บนชีตต้องระวัง** (ใส่ไว้ในพรอมต์ข้างล่างแล้ว):
- ภาพใหญ่ยิ้มอ้าปาก + ท่าสู้คำราม → ภาพยืนปากปิด (ทุกภาพหน้าเหมือนกัน คลิปไม่กระตุก)
- แผลเป็น: ภาพใหญ่อยู่คิ้วซ้าย แต่ภาพหมุนรอบตัวอยู่คิ้วขวา → พรอมต์ใช้ **คิ้วขวา** ตามภาพหมุนรอบตัว (ภาพหน้าเลือกตัวไม่ต้องแก้ จุดเล็ก)
- เปีย: ภาพใหญ่ห้อยหลังหูซ้าย ภาพข้างห้อยหลังหูขวา → ใช้ **หูขวา**
- ภาพข้างบนชีตไม่ถือขวาน → พรอมต์สั่งถือขวานทุกมุม
- ท่าสู้มีแสงแดง สายฟ้า น้ำแข็ง รูน → ภาพยืนห้ามเอฟเฟกต์ (ใส่ด้วยโค้ดในเกม)
- ขวานยาวเกือบเท่าตัว + หางใหญ่ → สั่งให้อยู่ในกรอบหมด มีพื้นเขียวเหลือรอบตัว

### ขั้น 1 — ภาพยืน 5 มุม ภาพละมุม พื้นเขียว · ✓ ครบแล้ว 2026-11-24 (4 มุม 20:50 + เฉียงหลัง 20:57)
เจ้าของส่ง 4 ภาพ (หลัง · ข้าง · เฉียงหน้า · หน้า, 1254² พื้นเขียว หันขวาทุกภาพ ถือขวานทุกมุม รวมมุมข้าง · ไม่มีสีเขียวบนตัว · ตัวสูงต่างกัน ≤ 2 %) → `assets/heroes/wolf/view_S|SE|E|N.webp` · แผลเป็นมุมหน้าเป็นขีดเดียว มุมเฉียงหน้า / ข้างเป็นกากบาท (เล็ก ไม่ต้องแก้) · ภาพ 4 มุมเฉียงหลังมาทีหลัง 20:57 ('ลืมรูปนึง') → `view_NE.webp` (สูง 1,219 px อยู่ในช่วงเดียวกับอีก 4 มุม · ตัวไม่มีสีเขียว) · ในภาพนี้หัวหันไปทางขวาจนเห็นข้างหน้า (ตาฟ้าข้างเดียว แผลเป็นกากบาท ปาก) ไม่ใช่แค่ขอบปากแบบที่พรอมต์ขอ → ใช้ได้ (มุมเฉียงหลังของมังกรก็เห็นตาข้างเดียว) พรอมต์คลิป NE เขียนตามภาพแทน · เศษโซ่ขาด 2 ชิ้นลอยใต้ข้อมือ

วิธีใช้:
1. ส่งต่อในแชต ChatGPT เดิมที่เจนชีตนี้ (มันจำตัวได้) แนบชีตไปกับพรอมต์ 0 อีกครั้ง · ถ้าเปิดแชตใหม่ แนบชีต + ภาพแมวตีกลอง (`keyart_style_ld3.jpg`)
2. ส่งพรอมต์ 0 → รอมันตอบ ready
3. ส่งภาพ 1–5 ทีละข้อความ (ข้อความละ 1 ภาพ)
4. ครบแล้วส่ง 5 ภาพมาให้ผม

ทำไมแยกภาพละมุม: ภาพใหญ่ = รายละเอียดชัดในคลิป (480p) · ทุกภาพท่ายืนเดียวกัน ขนาดเท่ากัน · บอกว่าขวาน โซ่ เกราะบ่า หาง ต้องอยู่ฝั่งไหนของภาพ · มุมไหนหันซ้ายมาไม่ต้องแก้ ผมกลับด้านให้

แก้ภาพ (ต่อท้ายแล้วส่ง):
- หันผิดทาง → `Redo picture 2: he must face the RIGHT side of the picture.`
- มุมหลังเห็นหน้า → `Redo picture 4: turn him further away, we must not see his eyes or his face.`
- ขนาดไม่เท่ากัน → `Redo picture 3: draw him the same size as in picture 1.`
- มีหลายตัว → `Redo picture 1: only ONE wolf in the picture, nothing else.`
- ไม่ถือขวาน (มุมข้างโดนบ่อย เพราะภาพข้างบนชีตไม่มีขวาน) → `Redo picture 3: he must hold his greataxe upright in his near hand, the whole axe visible.`
- ขวานกับโซ่สลับข้าง (มุมหน้า) → `Redo picture 1: the axe must be on the LEFT side of the picture and the broken chain on the RIGHT side.`
- มีเอฟเฟกต์ติดมา → `Redo picture 2: no glow, no runes, no ice, no lightning, no red energy — just the wolf standing.`
- อ้าปากยิ้ม / คำราม → `Redo picture 1: his mouth closed, a calm, confident look.`
- ขวาน / หาง / หูล้นกรอบ → `Redo picture 3: draw him a little smaller so his whole axe, both ears and his whole tail fit inside the picture.`
- แก้แค่บางส่วน → ใช้แปรงเลือกเฉพาะจุดใน ChatGPT (สั่งแก้ทั้งภาพ มันจะวาดใหม่หมด)

#### พรอมต์ 0 — กติกา (ส่งครั้งเดียว พร้อมแนบชีต)
```
Next I need this same hero — the white wolf warrior on the attached sheet — drawn standing in 5 directions for my game's animation, ONE picture per message. Do not draw anything yet: reply only "ready", then draw one picture each time I send a direction.

Every picture:
- ONE wolf alone in a square picture on a plain flat pure green background (#00FF00): no gradient, no floor, no shadow under him, no other views, no text, no logo, no watermark.
- exactly the same character and drawing style as the sheet, nothing added and nothing left out: friendly hand-painted chibi cartoon, thick clean dark-brown outlines, flat cel shading with 2–3 tones. A white wolf with a full wolf head: a strong muzzle, a black nose, bright ice-blue eyes under strong brows, a red scar slash through the brow above his RIGHT eye, upright pointed ears with grey-lavender insides; snow-white fur with soft lavender-grey shading, spiky fur on his head and cheeks, and a thin white braid with two small silver rings hanging behind his RIGHT ear. A thick cream-white fur collar round his neck on a crimson fur-lined cape that covers both shoulders and reaches the middle of his back, edged with white fur, fastened with a round silver knotwork brooch on his chest. On his LEFT shoulder a dark-steel pauldron shaped like a snarling wolf head with glowing ice-blue eyes. A sleeveless deep-navy tunic with a silver Norse knotwork band running down the front, split at the front into two panels that end at mid-thigh with silver knotwork borders over a crimson underlayer. A brown leather belt with a big round silver knotwork buckle. Bare white-furred arms with dark brown leather bracers on both forearms; on his LEFT wrist a steel cuff with a broken chain of four heavy steel links hanging from it. Big white fists. Baggy charcoal-black trousers; dark brown leather boots with thick white fur cuffs below the knee and crisscross brown straps. A huge bushy white tail with lavender shading.
- his weapon in every picture: a long Viking greataxe almost as tall as he is, held upright in his RIGHT hand beside him, the pointed silver end of the haft resting on the ground and the axe head at the height of his head. A dark crimson haft wrapped with dark straps and silver bands, a broad silver-steel crescent blade carved with a snarling dark-iron wolf head with ice-blue eyes, a thin ice-blue rune line along its edge, and a steel cap on top. The whole axe is always visible and never covers his face.
- the same standing pose in every picture: standing tall in a firm, ready stance, feet about shoulder-width apart, the axe upright in his right hand, his left fist clenched at his side with the broken chain hanging from the cuff, his tail curving out behind him; a calm, confident look with his mouth closed (no grin, no roar).
- the same size in every picture: from the tips of his ears to the soles of his boots he fills about three quarters of the picture's height, his feet near the bottom with a small margin; the whole axe, both ears and his whole tail inside the picture with green space all round.
- no green anywhere on him: the blues are navy and ice blue. No glow, no runes in the air, no ice, no lightning, no red energy, no sparkles, no motion lines, no effects.
```

#### ภาพ 1 — หน้าตรง
```
Picture 1 — FRONT view: he faces straight toward us, like the front view on the sheet. The greataxe stands upright on the LEFT side of the picture, in his right hand; his left fist with the cuff and the broken chain hangs on the RIGHT side of the picture, and the wolf-head pauldron sits on the shoulder on the right side of the picture. The red scar is over the eye on the left side of the picture. His bushy tail curves out behind him on one side.
```

#### ภาพ 2 — เฉียงหน้า หันขวา
```
Picture 2 — FRONT THREE-QUARTER view: he is turned toward the RIGHT side of the picture, facing down and to the right. We see his face with his muzzle pointing to the right and mostly his right side, with the red scar over his near eye. His near hand holds the upright greataxe on the left side of the picture, in front of him; his far fist with the broken chain is on the right side, partly behind his body, and the wolf-head pauldron shows on his far shoulder. His bushy tail curves out behind him on the left side of the picture.
```

#### ภาพ 3 — ข้าง หันขวา
```
Picture 3 — SIDE view facing RIGHT, like the side view on the sheet but holding his axe: his muzzle points to the right edge of the picture and we see his right side — one ear, one eye with the red scar over it and the braid with its two silver rings behind his ear. His near hand holds the greataxe upright at his side, the end of the haft standing on the ground just in front of his boots and the axe head beside his head, the whole axe visible. His far arm is mostly hidden behind his body. His bushy tail curves out behind him on the left side of the picture.
```

#### ภาพ 4 — เฉียงหลัง หันขวา
```
Picture 4 — BACK THREE-QUARTER view: he is turned away from us, facing up and to the RIGHT. We see mostly his back: the crimson cape with its white fur edge, the back of his head with both ears, and his bushy tail curving out toward the left; of his face only the edge of his muzzle on the right — not his eyes and not his face. His near hand holds the upright greataxe on the right side of the picture; his far fist with the broken chain shows on the left, partly behind his body, with the wolf-head pauldron on that far shoulder.
```

#### ภาพ 5 — หลัง
```
Picture 5 — BACK view: his back faces us, like the back view on the sheet: the back of his head with both ears, the crimson cape with its white fur edge across his shoulders and down to the middle of his back, the back of the belt and tunic, and his bushy tail hanging down behind him; no face. The greataxe stands upright on the RIGHT side of the picture, in his right hand; his left fist with the broken chain is on the LEFT side, and the wolf-head pauldron sits on the shoulder on the left side of the picture.
```

### ขั้น 2 — ภาพตั้งต้น + คลิปท่า 20 ตัว (ส่งภาพตั้งต้นครบ 5 ทิศแล้ว 2026-11-24 · รอคลิป)
ภาพ 5 มุมมาแล้ว → ตัดภาพตั้งต้น `wolf_1_S.png … wolf_5_N.png` (`tools/dir8cut.py startv`) ส่งพร้อม `WOLF_CLIP_PROMPTS_TH.md` (คลิป 20 ตัว ยืน · เดิน · ฟันขวาน · ชูขวาน × 5 ทิศ สร้างจาก `python3 tools/clip_prompts.py wolf`)

### ขั้น 3 เป็นต้นไป
3. **สไปร์ทจากคลิป** — `cliphero.py` → **ไฟล์ใหม่ `assets_wolf.js`** โหลดเฉพาะตอนเล่นหมาป่า (`assets.js` เดิมไม่แตะ = ร่างชั่วคราวของจิ้งจอก อนูบิส สิงโต จระเข้ อีกา) · เวลาเฟรมเท่า `assets.js` ทุกทิศ = ดาเมจ / จังหวะไม่เปลี่ยน (ตารางอยู่ท้าย `WOLF_CLIP_PROMPTS_TH.md`) · ตัวยืนสูงบนจอเท่าเดิม (ไม้บรรทัดของทุกตัว)
4. **ของที่ผูกกับสไปร์ท** — ตำแหน่งหัวขวานทุกเฟรม (เอฟเฟกต์ฟันขวาน) · จุดหัว / หลัง / มือของแฟชั่น แล้วจูนหมวก ปีก ผ้าคลุมทีละชิ้น · หน้ากากสีขน / สีชุดตอนสร้างตัว (ทำใหม่ หรือซ่อนไว้ก่อน) · หน้า HUD (ตัดหัวจากภาพหน้าตรง)
5. **ทีหลัง** — ไอคอนสกิล 63 + พื้นหลังผังสกิล 4 ภาพ + ภาพหน้าโหลด 7 ภาพที่มีหมาป่า ตามลุคใหม่ · ท่านั่ง 8 ทิศ
