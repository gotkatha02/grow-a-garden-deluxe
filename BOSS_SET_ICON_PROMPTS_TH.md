# ชุดบอส 30 ชุด — พรอมต์รูปไอคอน ChatGPT (2026-11-21)

เจ้าของ: "ทำเซ็ทบอสด้วยดีไหม เก็บไอเทมจากบอสมาทำ ขอพรอมต์ก่อน สเตตัสความสามารถค่อยคิด" → เอกสารนี้มีแค่ **โครง + พรอมต์รูป** · สเตตัส สูตรคราฟต์ ผลชุด ยังไม่คิด (รอคุยกับเจ้าของ) · ยังไม่มีอะไรในเกม

## โครง (ร่าง)
- บอส 30 ตัว (แดนละ 6 ตัว ชุดเดียวกับวัตถุโบราณ ดู relics.js) → **บอสละ 1 ชุด**
- ชุดหนึ่งมี 3 ชิ้น: **หมวก · เกราะ · รองเท้า** + ชิ้นที่ 4 = **วัตถุโบราณของบอสตัวเดียวกัน** (ช่องเครื่องประดับ มีในเกมแล้ว) → ใส่ครบ 4 ชิ้น = ครบชุด แต่ต้องเลือกระหว่างครบชุด กับวัตถุโบราณของบอสตัวอื่น
- **ไม่มีอาวุธ**: อาวุธแยกตามฮีโร่ 14 ตัว (30 บอส × 14 = 420 รูป) → อาวุธยังเป็นของคราฟต์เมือง / ตราโทเท็มเหมือนเดิม
- บอสทุกตัวดรอป **ชิ้นส่วนบอส** ของตัวเอง (ของในกระเป๋า ขายในตลาดกลางได้ ตรงกับแผน GEAR_GEM_LONGTERM_TH.md §2.3) → เอาไปคราฟต์ชิ้นในชุด
- เลเวลตามแมพบอส (ทุกแดนเท่ากัน): D1b 36–44 · H1 46–56 · H2 52–64 · D2c 73–80 · E1 76–86 · E2 84–94 → ทุกช่วงเลเวลมีให้เลือก 5 ชุด (แดนละชุด)
- ไฟล์ไอคอน (128 px): `assets/items/bs_<บอส>_top.png` · `bs_<บอส>_armor.png` · `bs_<บอส>_shoes.png` · ชิ้นส่วนบอส `bm_<บอส>.png` · ชื่อบอสตาม relics.js
- ในเกมเป็นไอคอนในกระเป๋า / ช่องสวมใส่เท่านั้น (ชุดคราฟต์ทุกแบบยังไม่ขึ้นบนตัวฮีโร่ ขึ้นบนตัวได้แค่ชุดแฟชั่น)

## วิธีใช้ (เหมือนชีตวัตถุโบราณ)
1. เปิดแชทใหม่ใน ChatGPT แนบ **รูปปกแคมป์ไฟ** (สไตล์เกม) แล้วส่ง **พรอมต์กลาง (0)** รอให้ตอบ OK
2. ทีละชีต: แนบ **บอร์ดบอส 3 ตัวของชีตนั้น** (`boss_set_<แดน>_<1|2>.jpg` เลข 1–3 บนบอร์ด = แถว 1–3) แล้วส่งพรอมต์ชีตนั้น
3. ส่งชีตกลับมา ผมตัดเป็นไฟล์ละชิ้นเอง
- ชีตละ 12 ชิ้น: 4 คอลัมน์ (หมวก · เกราะ · รองเท้า · ชิ้นส่วนบอส) × 3 แถว (บอส 3 ตัว) → ชิ้นในแถวเดียวกันวาดพร้อมกัน สีกับลายจะเข้าชุดกัน
- **พื้นเขียวทุกชีต** ห้ามมีสีเขียวบนของ (ฟ้าอมเขียว / เทอร์ควอยซ์ใช้ได้) · ใบไม้ของฮุลดราเป็นใบไม้ร่วงสีส้มแดงเหลืองเหมือนตอนทำวัตถุโบราณ
- ชิ้นไหนไม่ถูกใจ: ใน ChatGPT ใช้แปรงเลือกเฉพาะช่องนั้นแล้วสั่งวาดใหม่ อย่าสั่งแก้ทั้งรูป (มันจะวาดใหม่หมด)
- ถ้าเกราะมีตัวคนอยู่ข้างใน หรือรองเท้า 2 ข้างวางห่างกันไม่ติดกัน → แก้ช่องนั้น (ตัวตัดรูปต้องการรองเท้าที่ซ้อนกันเป็นชิ้นเดียว)
- ทำบอร์ดใหม่: `python3 tools/relic_boards.py <โฟลเดอร์> set` (ไม่เก็บไฟล์บอร์ดในรีโป)

## ชีต → ไฟล์
| ชีต | บอร์ดที่แนบ | แถว 1 | แถว 2 | แถว 3 |
|---|---|---|---|---|
| 1 ไวกิ้ง ก | boss_set_viking_1 | draugr | huldra | jotun |
| 2 ไวกิ้ง ข | boss_set_viking_2 | fenrir | nidhogg | ymir |
| 3 กรีก ก | boss_set_greek_1 | polyphemus | hecate | trojan |
| 4 กรีก ข | boss_set_greek_2 | minotaur | cerberus | typhon |
| 5 อียิปต์ ก | boss_set_egypt_1 | mummy | sphinx | scorpion |
| 6 อียิปต์ ข | boss_set_egypt_2 | pharaoh | set | apep |
| 7 ญี่ปุ่น ก | boss_set_japan_1 | tanuki | jorogumo | gashadokuro |
| 8 ญี่ปุ่น ข | boss_set_japan_2 | shogun | shuten | orochi |
| 9 แอซเท็ก ก | boss_set_aztec_1 | camazotz | ahuizotl | eagle |
| 10 แอซเท็ก ข | boss_set_aztec_2 | tzitzimitl | mictlan | quetzal |

ตัดชีต (ตัวอย่างชีต 1; แต่ละแถว = `bs_<บอส>_top, bs_<บอส>_armor, bs_<บอส>_shoes, bm_<บอส>`):
`GLOBAL=1 python3 -I tools/iconsheet.py <ชีต.png> assets/items 4,4,4 bs_draugr_top,bs_draugr_armor,bs_draugr_shoes,bm_draugr,bs_huldra_top,bs_huldra_armor,bs_huldra_shoes,bm_huldra,bs_jotun_top,bs_jotun_armor,bs_jotun_shoes,bm_jotun`
แล้วเพิ่มชื่อใน assets/items/icons.json

## ชุดของแต่ละบอส
| บอส (แมพ) | ชุด | หมวก | เกราะ | รองเท้า | ชิ้นส่วนบอส |
|---|---|---|---|---|---|
| ดรอกร์ช่างหลอม (D1b) | เตาหลอมคนตาย | หมวกเขาเหล็กดำ รอยร้าวลาวา หน้ากากตาไฟ เคราเปียห่วงทองแดง | ผ้ากันเปื้อนช่างหลอมเกราะเหล็ก ขนคลุมไหล่ โซ่ ช่องเตาเรือง | รองเท้าเหล็กดำ รอยร้าวลาวา ขนรอบข้อ | ก้อนตะกรันเตาหลอม |
| ฮุลดรา (H1) | ใบไม้ร่วงฮุลดรา | มงกุฎเขากิ่งไม้ ใบไม้ร่วง ดอกไม้ครีม | ชุดเปลือกไม้ซ้อนใบไม้ เข็มขัดเชือกกับเขาสัตว์ เห็ดเรือง | รองเท้าเปลือกไม้ รากพันข้อ | เห็ดเรืองแสงบนเปลือกไม้ |
| ยักษ์โยตุน (H2) | ขนน้ำแข็งโยตุน | ฮู้ดขนครีมน้ำแข็งย้อย งาสองข้าง | เสื้อขนสายรัดไขว้ เหรียญปมทองแดง สร้อยฟัน | รองเท้าขนพันเชือก หัวหินผลึกน้ำแข็ง | งาโยตุน |
| เฟนเรียร์ (D2c) | ขนดาวเฟนเรียร์ | ฮู้ดหัวหมาป่าขนครามมีดาว ตาฟ้า | เสื้อคลุมขนดาว ปลอกคอหนามเพชรฟ้า โซ่ขาด | รองเท้าอุ้งเท้าหมาป่า เล็บฟ้า ห่วงโซ่ | เศษโซ่เกลปนีร์ |
| นิดฮ็อกก์ (E1) | ผู้แทะราก | หมวกหัวมังกรเกล็ดม่วงหม่น เขากระดูกพันราก | เกราะเกล็ดรอยร้าวบานเย็น หนามกระดูก ผ้าใบเรือลายวน | รองเท้าเกล็ดหนามกรงเล็บ | รากต้นไม้โลกที่โดนแทะ |
| ยมีร์ (E2) | ราชาธารน้ำแข็ง | มงกุฎผลึกน้ำแข็ง เกล็ดหิมะ เปียห่วงทอง | เกราะไหล่น้ำแข็งก้อนใหญ่ เหรียญเกล็ดหิมะ สายรูน | รองเท้าหนังขนหัวน้ำแข็ง | เปียเคราราชายักษ์ |
| โพลีฟีมัส (D1b) | คนเลี้ยงแกะไซคลอปส์ | หมวกทองรูตาเดียว มงกุฎลอเรล | เสื้อขนแกะ เข็มขัดเหรียญลอเรล โถดินเผา | รองเท้าสานหนังยักษ์ ขอบขนแกะ | มัดขนแกะยักษ์ |
| เฮคาที (H1) | จันทร์สามดวง | มงกุฎทองจันทร์เสี้ยว 3 ดวง ผ้าคลุมดาว | ชุดคลุมม่วงดาวทอง กุญแจ 3 ดอก | รองเท้าม่วงทองจันทร์เสี้ยว ไฟม่วงที่ส้น | ผีเสื้อกลางคืนจันทรา |
| ยักษ์ทรอย (H2) | ม้าศึกทรอย | หมวกหัวม้าไม้ หงอนขนม้าแดง | เกราะไม้ซุงรัดทองแดง โล่ตะวัน ประตูท้องมีหอก | รองเท้าไม้มีล้อเล็กที่ส้น | ไม้ซุงม้าศึก |
| มิโนทอร์ (D2c) | กระทิงเขาวงกต | หมวกทองเขากระทิง ห่วงจมูก | เกราะอกทองลายเขาวงกต กระโปรงจีบแดง | สนับแข้งทอง เท้ากีบกระทิง | หินกลางเขาวงกต |
| เซอร์เบอรัส (E1) | หมาเฝ้านรก | หมวกหัวหมาดำม่วง ตาแดงส้ม ไฟผีฟ้า | เกราะขนปลอกคอหนาม หัวหมา 3 หัว โซ่ทอง | รองเท้าอุ้งเท้าเล็บฟ้า งูหางแดงพัน | ถ่านไฟผีแม่น้ำสติกซ์ |
| ไทฟอน (E2) | บิดาแห่งพายุ | มงกุฎหินร้าวลาวา ปีกพายุ งูแดง | เกราะหินลาวา งูพันไหล่ เข็มขัดทอง | รองเท้าหางงูลาวาขด | ขนปีกพายุสายฟ้าทอง |
| มัมมี่อัครเสนาบดี (D1b) | มัมมี่ราชสำนัก | ผ้าพันหัว เนเมสลายน้ำเงินทอง งูเห่าทอง | เสื้อคลุมกรมท่าทับผ้าพันศพ ปลอกคอทอง โถเล็ก | รองเท้าพันผ้า สายรัดทองเทอร์ควอยซ์ | โถคาโนปิก |
| สฟิงซ์ผู้พิทักษ์ (H1) | ผู้พิทักษ์สฟิงซ์ | หมวกหินทรายเนเมส ไพลินฟ้า | เกราะหินทรายอักษรทอง ปลอกคอปีก ปีกเล็ก | รองเท้าอุ้งเท้าสิงห์หินทราย | แผ่นศิลาปริศนา |
| ราชาแมงป่องเกลือ (H2) | แมงป่องเกลือ | มงกุฎผลึกเกลือชมพู สคารับฟ้า หางแมงป่อง | เกราะกระดองผลึกเป็นปล้อง ก้ามที่ไหล่ | รองเท้าผลึก ปลายเท้าเป็นก้าม | ผลึกเกลือชมพู |
| ฟาโรห์อมตะ (D2c) | ฟาโรห์อมตะ | มงกุฎคู่แดงขาวบนเนเมส | เกราะทองรูปฝาโลงศพ ปลอกคอลูกปัด | รองเท้าทองน้ำเงิน ปีกทองที่ส้น | เศษโลงทองฟาโรห์ |
| เซ็ต (E1) | ทะเลทรายแดง | หมวกหัวสัตว์เซ็ต ตาแดง | เกราะแดงทอง ผ้าคลุมแดงขาด ทรายแดงพัน | รองเท้าแดงทอง เล็บ ทรายแดงที่ส้น | แก้วสายฟ้าทรายแดง |
| อาเปป (E2) | งูโกลาหล | หมวกแม่เบี้ยงูเห่า ตาม่วงหลายดวง | เกราะเกล็ดม่วงดำ สุริยะมีปีก โซ่ขาด | รองเท้าเกล็ด หัวงูเห่าที่ข้อ | ขวดพิษอาเปป |
| โจนินเงา ทานูกิ (D1b) | นินจาเงา | ฮู้ดนินจาม่วง หูทานูกิ ใบไม้ทอง | ชุดนินจาม่วงลายเมฆทอง เชือกแดงกระดิ่ง | รองเท้าทาบิ ผ้าพันขา | ระเบิดควันทานูกิ |
| โจโรกุโมะ (H1) | ไหมแมงมุม | เครื่องประดับผมปิ่นขาแมงมุม แมงมุมทอง | เกราะกิโมโนม่วงลายใยแมงมุม โอบิแดง | รองเท้าส้นสูงดำทอง ขาแมงมุมพัน | รังไหมแมงมุม |
| กาชาโดคุโระ (H2) | โครงกระดูกหิวโหย | หมวกคาบุโตะแดง หน้ากากกะโหลก ไฟผีฟ้า | เกราะซามูไรแดงทับซี่โครง ลูกศรปัก | สนับแข้งแดง เท้ากระดูก | กระดูกต้องสาป |
| โชกุนผี (D2c) | โชกุนวิญญาณ | คาบุโตะดำทอง หน้ากากโอนิแดง ตาฟ้า | เกราะดำทองเชือกม่วง ไฟผีฟ้าที่ชาย | สนับแข้งดำทอง ไฟผีที่ส้น | โคมไฟผี |
| ชูเท็นโดจิ (E1) | ราชาอสูร | เขาทองคู่ แผงคอขาว หน้ากากโอนิ | เสื้อดำทองซากุระ ลายเสือ เชือกขาว ลูกประคำทอง | เกี๊ยะไม้ ผ้าพันขาลายเสือ | เขาอสูรหัก |
| ยามาตะโนะโอโรจิ (E2) | มังกรแปดเศียร | หมวกหัวมังกรแดงเขาทอง | เกราะเกล็ดแดงลายเมฆทอง หัวมังกรที่ไหล่ | รองเท้าเกล็ดแดงกรงเล็บ | เกล็ดโอโรจิ |
| คามาซอตซ์ (D1b) | ค้างคาวมรณะ | หมวกทองหูค้างคาวแดง หน้าค้างคาว | เกราะขนม่วงน้ำตาล ปลอกคอลายขั้นบันได สร้อยเขี้ยว | รองเท้าขนเล็บขาว ปีกค้างคาวที่ข้อ | รูปเคารพค้างคาวทอง |
| อาฮุยซอตล์ (H1) | หมาน้ำ | ฮู้ดขนกรมท่าลายน้ำวน คาดหัวทอง | เสื้อขนลายน้ำวน ปลอกคอทอง น้ำหยด | รองเท้าอุ้งเท้าชมพู น้ำวนที่พื้น | ไข่มุกวิญญาณทะเลสาบ |
| จอมทัพอินทรี (H2) | นักรบอินทรี | หมวกหัวอินทรี จะงอยทอง ขนนกแดงเทอร์ควอยซ์ | เกราะอกจานตะวันทอง บ่าขนนก | รองเท้าขนนก เท้ากรงเล็บเหลือง | กรงเล็บอินทรี |
| ทซิทซิมิทล์ (D2c) | ปีศาจดาว | คาดหัวทองสุริยคราส ขนนกขาวทอง | เกราะจักรวาลม่วงกรมท่าดาวทอง | รองเท้าดาว หัวจากัวร์ทองที่เข่า | เศษสุริยคราส |
| มิกตลันเตกูตลี (E1) | เจ้าแห่งมิกตลัน | หมวกขนนกกะโหลกเล็ก ธงกระดาษ ดาวเรือง | ผ้าคลุมแดงน้ำตาลทับซี่โครง พวงดาวเรือง นกฮูก | รองเท้าเท้ากระดูก สายแดง ไฟส้ม | ช่อดาวเรืองคนตาย |
| เควตซัลโคอาทล์ (E2) | งูขนนก | หมวกหัวงูเทอร์ควอยซ์ทอง จานตะวัน พัดขนนก | เกราะเกล็ดเทอร์ควอยซ์ บ่าปีกขนนก 4 สี | รองเท้าเกล็ด ปีกเล็กที่ข้อ ลมม้วน | เกล็ดงูสุริยะ |

**สถานะ 2026-11-21:** เขียนพรอมต์แล้ว ยังไม่มีรูป ยังไม่ได้ทำระบบ

## 0. พรอมต์กลาง (ส่งก่อน พร้อมรูปปกแคมป์ไฟ)
```
I am making inventory item icons for my 2D fantasy RPG. These are BOSS SETS — legendary armour crafted from trophies of mythic bosses. Every boss has its own set: a helmet, a body armour and a pair of boots, plus one trophy (the crafting material that boss drops). Every piece must look like it was made from that boss: use the boss's main colours, materials, patterns, ornaments and signature parts, so a player instantly knows which boss it came from.
Art style: copy the attached key art — friendly hand-painted chibi cartoon, thick clean dark-brown outlines (not black), cel shading with 2–3 flat tones, soft light from the top-left, bright warm colours, a little magical shine on the object itself. Not realistic, not painterly, not 3D. Chunky, readable, a bit cute, like classic MMORPG inventory icons.
With every sheet I will attach a board of 3 bosses numbered 1–3. Row N of the sheet is the set of boss N. The board is only a reference — never draw the bosses themselves and never copy the board's layout.
Sheet layout, always the same: ONE 1536×1024 image, 4 columns × 3 rows, items evenly spaced with clear gaps. Column 1 = helmet, column 2 = body armour, column 3 = boots, column 4 = trophy. All 12 items about the same size.
Rules for EVERY icon: one single object, centred in its cell, filling about 80% of it without touching the edges or its neighbours. Helmet: 3/4 view turned to the left, empty (no head inside). Body armour: front view, upright and empty — no body, no mannequin, no stand, no arms, no head. Boots: a pair in 3/4 view, the front boot overlapping the back boot so the pair is ONE connected shape. Trophy: one object in 3/4 view; long objects lie diagonally. The three gear pieces of one row must clearly belong together as one matching set (same colours, same trims, same motif).
No text, no letters, no numbers, no frame, no border, no ground shadow. No glow halo or aura around any object — the area around it stays one perfectly flat colour; magic shows only ON the object (glowing eyes, cracks, gems, inner light). Must read clearly at 32 px.
Background: SOLID FLAT PURE GREEN (#00FF00) — no gradient, no texture, no shadow. Never use green on the objects (turquoise and teal are fine).
Reply OK and wait.
```

## 1. ไวกิ้ง ก (แนบ boss_set_viking_1.jpg)
```
Sheet 1 — Viking boss sets, bosses 1–3 on the attached board. Row 1 = boss 1, row 2 = boss 2, row 3 = boss 3. Do not draw the bosses.

Row 1 — DRAUGR FORGEMASTER set (undead dwarf smith). Colours: battered dark iron, bronze rivets, glowing molten-orange lava cracks, shaggy dark-brown fur, cream curved horns.
1) Helmet: his horned Viking helmet — dark iron with bronze rivets, two cream curved horns, glowing orange lava cracks across the brow, an iron face guard with two glowing orange eye slits, a short braided grey beard with bronze rings hanging below it.
2) Body armour: a heavy smith's war-apron — dark iron chest plates with bronze rivets over a brown leather apron, a shaggy dark-brown fur mantle on the shoulders, an iron chain hanging across the chest, a small forge vent glowing orange in the middle, thin lava cracks on the plates.
3) Boots: chunky dark iron boots with bronze toe caps and rivets, glowing orange lava cracks, shaggy dark-brown fur cuffs, leather straps with bronze buckles.
4) Trophy — Deathforge Slag: a lumpy chunk of black iron slag with glowing molten-orange cracks, a few orange embers, one bronze rivet stuck in it.

Row 2 — HULDRA set (Norse forest spirit). Colours: brown bark, autumn leaves in orange, red and golden yellow, cream five-petal flowers, glowing orange mushrooms. No green leaves.
1) Helmet: a crown of branching twig antlers wrapped with orange, red and yellow autumn leaves and cream flowers, pale cream lichen strands hanging from the branches, a small amber gem in the middle.
2) Body armour: a gown-armour of overlapping brown bark plates and layered autumn leaves, cream flowers on the shoulders, a rope belt with a carved drinking horn and a cow-tail tassel, tiny glowing orange mushrooms growing on the bark.
3) Boots: bark boots with roots curling round the ankles, orange and red leaves at the cuffs, a cream flower, tiny glowing orange mushrooms on the heels.
4) Trophy — Glowcap Mushrooms: a cluster of three glowing orange mushrooms growing on a chunk of brown bark, one red autumn leaf beside them.

Row 3 — JOTUN BRUTE set (frost giant). Colours: blue-grey stone, shaggy cream-white fur, frost-blue ice crystals, brown rope and leather, a bronze knot medallion, ivory tusks.
1) Helmet: a shaggy cream-white fur hood with icicles hanging from its rim, a blue-grey stone brow plate, two small ivory tusks curving up at the sides, brown leather straps with bronze rings.
2) Body armour: a shaggy cream-white fur vest with icicles, crossed brown ropes and leather straps, a round bronze medallion with a knot rune in the middle, a necklace of big white teeth, frost-blue ice crystals on the shoulders.
3) Boots: huge furry boots wrapped with brown rope and leather strips, cream fur cuffs with icicles, blue-grey stone toe caps with frost-blue ice crystals.
4) Trophy — Jotun Tusk: one big curved ivory tusk with frost-blue ice crystals at its root, wrapped with a brown leather strip.

4 columns × 3 rows: helmet, body armour, boots, trophy (left to right), row 1 at the top. Solid flat pure green (#00FF00) background, no green on the objects. Same style as the key art: friendly hand-painted chibi cartoon, thick clean dark-brown outlines, cel shading with 2–3 flat tones, bright and warm. No text, no frame, no glow halo, no body inside the armour, nothing touching the cell edges.
```

## 2. ไวกิ้ง ข (แนบ boss_set_viking_2.jpg)
```
Sheet 2 — Viking boss sets, bosses 1–3 on the attached board. Row 1 = boss 1, row 2 = boss 2, row 3 = boss 3. Do not draw the bosses.

Row 1 — FENRIR set (giant chained wolf). Colours: dark indigo fur sprinkled with tiny stars, glowing ice-blue crack lines, ice-blue claws and eyes, rusty-copper chains and a spiked copper collar, a blue diamond gem.
1) Helmet: a hood shaped like Fenrir's head — dark indigo starry fur, pointed ears, glowing ice-blue eyes, a row of white fangs over the brow, glowing ice-blue crack lines.
2) Body armour: a dark indigo fur mantle-armour sprinkled with tiny stars and glowing ice-blue crack lines, a spiked rusty-copper collar plate with a blue diamond gem at the throat, broken copper chain links draped across the chest.
3) Boots: dark indigo furry boots shaped like big wolf paws with ice-blue claws, rusty-copper shackle bands with broken chain links, tiny stars in the fur.
4) Trophy — Gleipnir Fragment: a short broken piece of chain, three rusty-copper links with glowing ice-blue rune marks, the last link snapped open.

Row 2 — NIDHOGG set (dragon that gnaws the roots of the world tree). Colours: dusty-mauve dragon scales, glowing magenta cracks, bone-white spikes and horns, gnawed brown roots, magenta venom, a red spiral rune.
1) Helmet: a dragon-head helmet of dusty-mauve scales, curved bone-white horns wrapped with gnawed brown roots, glowing magenta eyes, a fanged jaw rim over the face, glowing magenta cracks.
2) Body armour: dusty-mauve dragon-scale armour with glowing magenta cracks, bone-white spikes on the shoulders, gnawed brown roots winding round it, a scrap of torn sail cloth with a red spiral rune tied as a sash.
3) Boots: dusty-mauve scaled boots with bone-white spikes on the shins and dark dragon claws at the toes, brown roots twined round them, glowing magenta cracks.
4) Trophy — Gnawed World-Root: a thick chunk of brown world-tree root with deep bite marks, one drop of glowing magenta venom dripping from it.

Row 3 — YMIR set (frost giant king). Colours: glacier-blue faceted ice, silver, white fur, white beard braids with gold rings, brown leather straps with carved runes, a glowing pale-blue snowflake.
1) Helmet: a crown-helm of sharp glacier-blue ice crystals on a silver band with a glowing pale-blue snowflake gem, white fur trim, two short white braids with gold rings hanging at the sides.
2) Body armour: chest armour with huge faceted glacier-blue ice shoulder pads dripping icicles, a white fur collar, a big round silver snowflake medallion glowing pale blue in the middle, brown leather straps carved with runes.
3) Boots: brown leather and white fur boots with faceted glacier-blue ice toe caps and shin guards, small icicles, rune straps with gold buckles.
4) Trophy — Frost King's Beard Braid: a thick white beard braid with three gold rings, frost and tiny icicles on it, tied at the top with a brown leather rune cord.

4 columns × 3 rows: helmet, body armour, boots, trophy (left to right), row 1 at the top. Solid flat pure green (#00FF00) background, no green on the objects. Same style as the key art: friendly hand-painted chibi cartoon, thick clean dark-brown outlines, cel shading with 2–3 flat tones, bright and warm. No text, no frame, no glow halo, no body inside the armour, nothing touching the cell edges.
```

## 3. กรีก ก (แนบ boss_set_greek_1.jpg)
```
Sheet 3 — Greek boss sets, bosses 1–3 on the attached board. Row 1 = boss 1, row 2 = boss 2, row 3 = boss 3. Do not draw the bosses.

Row 1 — POLYPHEMUS set (one-eyed cyclops shepherd). Colours: cream sheep fleece, warm brown leather, gold Greek-key bands, a gold laurel, his big yellow single eye.
1) Helmet: a round bronze-gold helmet with ONE big round eye-hole in the middle of the brow (cyclops style), a gold laurel wreath round it, a gold Greek-key band, fluffy cream fleece tufts at the sides.
2) Body armour: a fluffy cream sheep-fleece vest over a short white tunic with a gold Greek-key hem, a brown leather belt with a round gold laurel medallion, a small clay amphora with a Greek-key band hanging from the belt.
3) Boots: big strapped brown leather sandal-boots with gold Greek-key ankle bands and fluffy cream fleece cuffs.
4) Trophy — Giant Fleece: a big fluffy bundle of cream sheep fleece tied with brown rope and a small gold bell.

Row 2 — HECATE set (triple goddess of witchcraft and the moon). Colours: deep purple with tiny gold stars, gold crescent moons, cream drapes with a gold Greek key, violet-purple flames, bronze keys.
1) Helmet: a gold diadem with a crescent moon and a star on top and two smaller crescent moons at the sides (three moons), a purple gem, a short sheer purple veil with tiny gold stars at the back.
2) Body armour: a purple robe-armour sprinkled with tiny gold stars, a cream drape with a gold Greek-key border, a gold belt with a triple-moon emblem (waxing, full, waning), three bronze keys hanging on a gold chain.
3) Boots: purple-and-gold boots with a gold crescent moon on each, gold Greek-key bands, tiny violet flames flickering at the heels.
4) Trophy — Moonmoth: one purple moth with spread violet wings marked with gold crescent-moon spots and sparkling dust.

Row 3 — TROJAN COLOSSUS set (giant wooden siege horse). Colours: wooden planks, bronze bands and rivets, a red horsehair crest and mane, red shields with a gold sun, rope, glowing yellow eyes.
1) Helmet: a wooden horse-head helmet made of planks with bronze bands, glowing yellow eyes, a big red horsehair crest on top.
2) Body armour: a cuirass of wooden planks bound with bronze bands and rope, a round red shield with a gold sun as the chest plate, a little hatch door on the belly with spear tips peeking out, red cloth strips hanging.
3) Boots: wooden plank boots with bronze bands and Greek-key trims, a tiny bronze-rimmed wooden wheel at each heel, red horsehair tufts at the cuffs.
4) Trophy — Siege Timber: a thick wooden plank with bronze nails and a bronze band, a coil of rope and a scrap of red cloth tied to it.

4 columns × 3 rows: helmet, body armour, boots, trophy (left to right), row 1 at the top. Solid flat pure green (#00FF00) background, no green on the objects. Same style as the key art: friendly hand-painted chibi cartoon, thick clean dark-brown outlines, cel shading with 2–3 flat tones, bright and warm. No text, no frame, no glow halo, no body inside the armour, nothing touching the cell edges.
```

## 4. กรีก ข (แนบ boss_set_greek_2.jpg)
```
Sheet 4 — Greek boss sets, bosses 1–3 on the attached board. Row 1 = boss 1, row 2 = boss 2, row 3 = boss 3. Do not draw the bosses.

Row 1 — MINOTAUR set (bull-man of the labyrinth). Colours: gold engraved with a labyrinth maze, shaggy brown fur, cream horns with gold bands, a red pleated kilt, broken gold chains, a gold nose ring.
1) Helmet: a gold bull helmet with two big curved cream horns with gold bands, a labyrinth maze engraved on the brow, a gold nose ring hanging at the front, tufts of shaggy brown fur at the sides.
2) Body armour: a gold muscle cuirass engraved with a labyrinth maze, gold Greek-key shoulder guards, a red pleated kilt below, a gold belt with a round labyrinth emblem, broken gold chain links hanging.
3) Boots: gold greaves with Greek-key bands and shaggy brown fur cuffs, the feet shaped like dark bull hooves, gold shackles with broken chain links.
4) Trophy — Labyrinth Keystone: a square carved stone tile with a glowing gold labyrinth maze pattern, one corner chipped.

Row 2 — CERBERUS set (three-headed hound of the underworld). Colours: dark purple-black fur, glowing red-orange eyes, gold spiked collars with a Greek key, heavy gold chains, blue ghost flames, a red-scaled snake tail.
1) Helmet: a dark purple-black hound-head helmet with pointed ears, glowing red-orange eyes and bared white fangs, a gold Greek-key band with gold spikes, small blue ghost flames on the ear tips.
2) Body armour: dark purple-black fur armour with a gold spiked Greek-key collar, a small hound-head guard on each shoulder and one on the chest (three heads with glowing red-orange eyes), a heavy gold chain draped across, small blue ghost flames.
3) Boots: dark purple-black furry paw boots with glowing blue claws, gold spiked Greek-key bands, small blue ghost flames at the heels, a red-scaled snake coiled round one boot.
4) Trophy — Ember of the Styx: a lump of black-purple underworld rock with blue ghost flames burning in its cracks and a broken gold spike stuck in it.

Row 3 — TYPHON set (father of storms). Colours: dark purple-grey stone with glowing orange lava cracks, dark grey storm wings, red serpents with lava-crack scales and cream bellies, gold-orange lightning, gold. Lightning is gold-orange, never green.
1) Helmet: a dark purple-grey crown-helm with glowing orange lava cracks, a small dark grey storm wing on each side, two little red serpents with lava-crack scales coiled on top, gold-orange lightning crackling on it.
2) Body armour: dark purple-grey stone chest armour with glowing orange lava cracks, red lava-scaled serpents coiled round both shoulders, a gold belt with a fiery orange gem, a cream-and-gold loincloth below.
3) Boots: boots made of coiled red serpent tails with glowing lava-crack scales and cream bellies, a gold band at the top, small gold-orange lightning sparks.
4) Trophy — Storm Feather: one long dark grey storm-wing feather crackling with gold-orange lightning along its edge.

4 columns × 3 rows: helmet, body armour, boots, trophy (left to right), row 1 at the top. Solid flat pure green (#00FF00) background, no green on the objects. Same style as the key art: friendly hand-painted chibi cartoon, thick clean dark-brown outlines, cel shading with 2–3 flat tones, bright and warm. No text, no frame, no glow halo, no body inside the armour, nothing touching the cell edges.
```

## 5. อียิปต์ ก (แนบ boss_set_egypt_1.jpg)
```
Sheet 5 — Egyptian boss sets, bosses 1–3 on the attached board. Row 1 = boss 1, row 2 = boss 2, row 3 = boss 3. Do not draw the bosses.

Row 1 — MUMMY VIZIER set (undead royal advisor). Colours: old cream linen bandages, a blue-and-gold striped nemes, a gold cobra, deep navy-purple cloth with gold borders, turquoise gems, glowing cyan magic.
1) Helmet: a head cover of wound cream linen bandages with loose ends, a blue-and-gold striped nemes headdress over it, a gold cobra on the brow, two glowing cyan eye slits.
2) Body armour: a deep navy-purple robe-armour with gold borders over cream linen bandages with loose torn ends, a broad gold collar with a turquoise gem, a gold belt with a blue scarab, two small canopic jars hanging from it.
3) Boots: cream linen-wrapped boots with loose bandage ends, gold sandal straps with turquoise gems, gold ankle bands.
4) Trophy — Canopic Jar: a small cream stone jar with blue-and-gold bands, its lid carved as a little head in a blue-and-gold nemes, a faint cyan glow at the seal.

Row 2 — SPHINX GUARDIAN set (winged stone sphinx). Colours: warm sandstone with faint glowing gold hieroglyphs, a blue-and-gold striped nemes, gold, a big oval blue sapphire, sandstone feathered wings.
1) Helmet: a sandstone helmet in the shape of the sphinx's head-dress — blue-and-gold striped nemes, a gold cobra on the brow, a big oval blue sapphire, small gold ankh earrings at the sides.
2) Body armour: a sandstone chest plate with faint glowing gold hieroglyphs, a broad gold winged collar with a big oval blue sapphire, small sandstone feathered wings on the shoulders, a blue-and-gold striped front panel.
3) Boots: sandstone boots shaped like lion paws with blue-and-gold striped bands and gold anklets with blue gems.
4) Trophy — Riddle Tablet: a chipped sandstone tablet carved with glowing gold hieroglyphs (an eye and an ankh).

Row 3 — SALT SCORPION KING set (giant scorpion of pink salt crystal). Colours: pink-and-white salt crystal, gold and lapis-blue bands, a blue scarab crest, glowing orange eyes, a gold stinger, amber venom.
1) Helmet: a crown-helm of pink-and-white salt crystals with gold and lapis-blue bands, a gold-winged blue scarab on the brow, a small curled scorpion-tail crest on top ending in a gold stinger.
2) Body armour: segmented pink-and-white salt-crystal carapace armour with gold and lapis-blue bands, a gold-winged blue scarab crest in the middle, small crystal pincers as shoulder guards.
3) Boots: pink-and-white crystal boots with gold and lapis-blue bands, the toes shaped like small scorpion pincers, little salt crystals growing on the shins.
4) Trophy — Rose Salt Crystal: a cluster of pink-and-white salt crystals with one drop of glowing amber venom on top.

4 columns × 3 rows: helmet, body armour, boots, trophy (left to right), row 1 at the top. Solid flat pure green (#00FF00) background, no green on the objects (turquoise is fine). Same style as the key art: friendly hand-painted chibi cartoon, thick clean dark-brown outlines, cel shading with 2–3 flat tones, bright and warm. No text, no frame, no glow halo, no body inside the armour, nothing touching the cell edges.
```

## 6. อียิปต์ ข (แนบ boss_set_egypt_2.jpg)
```
Sheet 6 — Egyptian boss sets, bosses 1–3 on the attached board. Row 1 = boss 1, row 2 = boss 2, row 3 = boss 3. Do not draw the bosses.

Row 1 — PHARAOH UNDYING set (mummy pharaoh). Colours: gold, blue-and-gold stripes, the tall red-and-white double crown, turquoise beads, cream bandages, wisps of purple smoke.
1) Helmet: the tall red-and-white double crown of Egypt over a blue-and-gold striped nemes, a gold cobra on the brow, a turquoise gem, a thin wisp of purple smoke.
2) Body armour: gold chest armour shaped like the lid of his sarcophagus (gold with blue stripes, folded gold wings, a turquoise gem), a broad gold collar with turquoise beads, cream bandage strips hanging below.
3) Boots: gold-and-blue boots with turquoise gems, cream bandage wraps at the ankles, small gold wings at the heels, a curl of purple smoke.
4) Trophy — Sarcophagus Gold Shard: a broken piece of his golden sarcophagus lid with blue stripes and a turquoise inlay, cracked edges.

Row 2 — SET set (god of desert storms). Colours: dark red-brown, gold, red gems, black-and-gold stripes, a torn crimson cape, swirling red sand, red lightning.
1) Helmet: a helmet shaped like the Set-animal head — long curved snout, tall square-tipped ears, dark red-brown with glowing red eyes — over a black-and-gold striped head-dress with red gems.
2) Body armour: dark red-brown and gold armour with red gems, a black-and-gold striped collar, a torn crimson cape, a ribbon of red sand with tiny red lightning sparks wrapped round the waist.
3) Boots: dark red-brown boots with gold bands and red gems, dark claws at the toes, a small curl of red sand at the heels.
4) Trophy — Storm Glass: a jagged branch of dark red fulgurite (sand glass melted by lightning) with glowing red cracks and a tiny red spark.

Row 3 — APEP set (giant chaos serpent). Colours: purple-black scales, gold bands with blue stripes, many small glowing purple eyes on the cobra hood, purple venom, glowing purple cracks, a gold winged sun.
1) Helmet: a cobra-hood helmet of purple-black scales with gold bands and blue stripes, rows of small glowing purple eyes on the hood, two fangs dripping purple venom at the brow.
2) Body armour: purple-black scale armour with gold bands, a gold winged-sun emblem with a purple gem on the chest, broken gold chain links, glowing purple cracks.
3) Boots: purple-black scaled boots with gold bands, a small cobra head with glowing purple eyes at each ankle, a drop of purple venom.
4) Trophy — Apep's Venom Vial: a small glass vial of glowing purple venom with a gold cap shaped like a cobra head.

4 columns × 3 rows: helmet, body armour, boots, trophy (left to right), row 1 at the top. Solid flat pure green (#00FF00) background, no green on the objects (turquoise is fine). Same style as the key art: friendly hand-painted chibi cartoon, thick clean dark-brown outlines, cel shading with 2–3 flat tones, bright and warm. No text, no frame, no glow halo, no body inside the armour, nothing touching the cell edges.
```

## 7. ญี่ปุ่น ก (แนบ boss_set_japan_1.jpg)
```
Sheet 7 — Japanese boss sets, bosses 1–3 on the attached board. Row 1 = boss 1, row 2 = boss 2, row 3 = boss 3. Do not draw the bosses.

Row 1 — JONIN SHADOW set (tanuki ninja master). Colours: dark purple cloth with gold cloud-swirl patterns, a red scarf, red rope with gold bells, brown-orange tanuki fur, a golden leaf, purple smoke.
1) Helmet: a dark purple ninja hood with gold swirl patterns and round tanuki ears, a golden leaf on top, a red scarf tail flowing behind, a red rope with two gold bells.
2) Body armour: a dark purple ninja jacket with gold cloud-swirl patterns, a dark mesh undershirt at the collar, a red rope belt with gold bells and red tassels, a brown pouch with a gold tomoe mark.
3) Boots: dark purple split-toe tabi boots with white leg wraps and red straps, gold swirl patterns, a tiny puff of purple smoke at one heel.
4) Trophy — Tanuki Smoke Bomb: a round dark purple bomb with a gold tomoe mark and a red cord, its fuse sparking.

Row 2 — JOROGUMO set (spider woman). Colours: black lacquer and gold, purple kimono silk with pale sakura flowers, silver spider webs, red bands and tassels, lavender wisteria, red eyes.
1) Helmet: a black-lacquered hair-ornament crown with gold hairpins spreading like spider legs, a big gold spider crest with red eyes in the middle, lavender wisteria hanging at one side, red tassels.
2) Body armour: a purple kimono-armour with pale sakura flowers and silver spider-web patterns, a red obi with a gold spider brooch, black-and-gold striped spider-leg shoulder guards with red bands.
3) Boots: tall black-lacquered platform boots with gold spider-leg ornaments curling round them, red bands, silver web threads and a small lavender wisteria.
4) Trophy — Spider-Silk Cocoon: a silvery-white silk cocoon wrapped in web threads, a tiny black spider with gold stripes sitting on it.

Row 3 — GASHADOKURO set (giant starving skeleton samurai). Colours: bone white, red lacquered samurai plates with gold flower crests, a gold crescent crest, blue ghost fire, red rope, torn purple cloth, broken arrows.
1) Helmet: a red samurai kabuto with a gold crescent crest, a bone-white skull face mask with its jaw open and blue ghost fire in the eyes, a broken arrow stuck in the helmet, red rope tassels.
2) Body armour: red lacquered samurai chest armour with gold flower crests worn over a bone-white ribcage, blue ghost flames glowing between the ribs, torn purple cloth, red rope knots, a broken arrow stuck in it.
3) Boots: red lacquered samurai shin guards over bony bone-white feet with clawed toes, red rope ties, small blue ghost flames.
4) Trophy — Cursed Bone: a big cracked bone-white bone with blue ghost fire flickering on it and a red rope tied round its middle.

4 columns × 3 rows: helmet, body armour, boots, trophy (left to right), row 1 at the top. Solid flat pure green (#00FF00) background, no green on the objects. Same style as the key art: friendly hand-painted chibi cartoon, thick clean dark-brown outlines, cel shading with 2–3 flat tones, bright and warm. No text, no frame, no glow halo, no body inside the armour, nothing touching the cell edges.
```

## 8. ญี่ปุ่น ข (แนบ boss_set_japan_2.jpg)
```
Sheet 8 — Japanese boss sets, bosses 1–3 on the attached board. Row 1 = boss 1, row 2 = boss 2, row 3 = boss 3. Do not draw the bosses.

Row 1 — GHOST SHOGUN set (phantom samurai lord). Colours: black-and-gold lacquer, purple cords and tassels, a gold crescent crest with a flower crest, a red oni mask, ghostly ice-blue flames and hair.
1) Helmet: a black-lacquered kabuto with a big gold crescent crest and a gold flower crest, a red oni face mask with glowing ice-blue eyes, wisps of ghostly white-blue hair, purple cords.
2) Body armour: black-and-gold lacquered samurai armour laced with purple cords and tassels, gold flower crests, a tattered purple cape edge with gold patterns, ice-blue ghost flames along the hem.
3) Boots: black-and-gold lacquered shin guards with purple cords, ice-blue ghost flames curling at the heels.
4) Trophy — Ghostfire Lantern: a small black-and-gold lacquered lantern glowing with an ice-blue ghost flame inside, a purple tassel hanging below.

Row 2 — SHUTEN-DOJI set (king of the oni). Colours: red, gold horns, a wild white mane, a black-and-gold kimono with pale sakura, tiger stripes, thick white rope with white paper zigzags, gold prayer beads, orange flames.
1) Helmet: a gold horned headband with two big curved gold horns, a wild white mane, a red oni face plate with fangs, gold beads, small orange flames at the horn tips.
2) Body armour: a black-and-gold kimono jacket with pale sakura flowers, tiger-stripe cloth at the waist, a thick white rope belt with white zigzag paper charms, a big string of gold prayer beads, a small gold oni mask on the belt.
3) Boots: tiger-stripe fur leg wraps on tall wooden geta sandals with red straps and gold studs.
4) Trophy — Oni Horn: one big curved gold oni horn broken at the base, a tuft of white mane on it, a small orange flame at the tip.

Row 3 — YAMATA NO OROCHI set (eight-headed dragon). Colours: red dragon scales with gold cloud patterns, a cream belly, white manes, gold horns, glowing yellow eyes, yellow lightning, purple storm clouds.
1) Helmet: a red dragon-head helmet with gold horns, a white mane, red scales with gold cloud patterns, glowing yellow eyes, small yellow lightning sparks.
2) Body armour: red dragon-scale armour with gold cloud patterns and a cream belly plate, a small red dragon head with gold horns on each shoulder, a purple storm-cloud sash with yellow lightning.
3) Boots: red scaled boots with gold cloud patterns and cream fronts, dragon claws at the toes, white mane tufts at the cuffs.
4) Trophy — Orochi Scale: one big red dragon scale with a gold cloud pattern and a cream edge, a small yellow lightning spark.

4 columns × 3 rows: helmet, body armour, boots, trophy (left to right), row 1 at the top. Solid flat pure green (#00FF00) background, no green on the objects. Same style as the key art: friendly hand-painted chibi cartoon, thick clean dark-brown outlines, cel shading with 2–3 flat tones, bright and warm. No text, no frame, no glow halo, no body inside the armour, nothing touching the cell edges.
```

## 9. แอซเท็ก ก (แนบ boss_set_aztec_1.jpg)
```
Sheet 9 — Aztec boss sets, bosses 1–3 on the attached board. Row 1 = boss 1, row 2 = boss 2, row 3 = boss 3. Do not draw the bosses.

Row 1 — CAMAZOTZ set (bat god of death). Colours: dark purple-brown fur, red bat wings with gold stepped-fret patterns, gold, red and cream feathers, white fang beads, red eyes.
1) Helmet: a gold stepped-fret helm with big red bat ears, a fanged bat face with red eyes on the front, red and cream feathers on top.
2) Body armour: a dark purple-brown fur chestpiece with a gold stepped-fret collar, a necklace of white fang beads, small red bat-wing shoulder capes with gold patterns, a skirt of red and cream feathers.
3) Boots: dark purple-brown furry boots with gold fret bands and white curved claws, a small red bat wing on each ankle.
4) Trophy — Golden Bat Idol: a small gold idol of a bat with spread wings, red gem eyes and stepped-fret carvings.

Row 2 — AHUIZOTL set (water hound). Colours: dark navy fur with light-blue spiral water patterns, gold stepped-fret bands, blue-and-white feathers, pink paw pads, water drops.
1) Helmet: a dark navy fur hood with round ears and light-blue water spirals, a gold stepped-fret headband with a square gold jewel, blue-and-white feathers, a few water drops.
2) Body armour: a dark navy fur vest with light-blue water spirals, a gold fret collar and gold bands, cream chest fur, a blue-and-white feather tassel, water dripping from the hem.
3) Boots: dark navy furry paw boots with pink paw pads and white claws, gold fret anklets, a light-blue water swirl at the soles.
4) Trophy — Lake-Spirit Pearl: a big light-blue pearl in a gold stepped-fret setting with a few water drops.

Row 3 — EAGLE WARLORD set (eagle warrior chief). Colours: brown and cream eagle feathers, red and turquoise feathers, gold, a gold sun disc, golden-yellow talons.
1) Helmet: an eagle-head helmet of brown and cream feathers with an open golden beak over the brow and yellow eyes, a fan of red and turquoise feathers on top, a gold fret headband with a turquoise gem.
2) Body armour: a gold sun-disc breastplate over brown and white eagle feathers, red and turquoise feather shoulder pieces, a red-and-cream loincloth with a gold fret pattern.
3) Boots: brown-feathered boots with gold fret bands and turquoise beads, golden-yellow eagle talons with dark claws at the toes.
4) Trophy — Eagle Talon: one big golden-yellow eagle talon with a dark curved claw, tied with a red and turquoise bead cord.

4 columns × 3 rows: helmet, body armour, boots, trophy (left to right), row 1 at the top. Solid flat pure green (#00FF00) background, no green on the objects (turquoise and teal are fine). Same style as the key art: friendly hand-painted chibi cartoon, thick clean dark-brown outlines, cel shading with 2–3 flat tones, bright and warm. No text, no frame, no glow halo, no body inside the armour, nothing touching the cell edges.
```

## 10. แอซเท็ก ข (แนบ boss_set_aztec_2.jpg)
```
Sheet 10 — Aztec boss sets, bosses 1–3 on the attached board. Row 1 = boss 1, row 2 = boss 2, row 3 = boss 3. Do not draw the bosses.

Row 1 — TZITZIMITL set (star demon of the eclipse). Colours: deep purple and midnight-navy cosmic cloth with gold stars, a black eclipse sun with a glowing gold ring, white-and-gold feathers, gold jaguar heads.
1) Helmet: a gold headband with a black eclipse sun with a glowing gold ring in the middle, white-and-gold feathers fanning out behind, small gold stars and crescent moons hanging from it.
2) Body armour: deep purple and midnight-navy cosmic armour sprinkled with gold stars, a gold fret collar with a gold star, a rope belt with white shell beads, a small gold jaguar-head clasp.
3) Boots: starry midnight-navy boots with gold bands, a gold jaguar head at each knee, dark claws at the toes.
4) Trophy — Eclipse Shard: a sharp piece of black crystal with a glowing gold rim along one edge and tiny gold stars inside.

Row 2 — MICTLANTECUHTLI set (lord of the dead). Colours: bone white, brown-red cloth with gold fret borders, red and dark brown feathers, orange marigolds, white cut-paper banners, small white skulls, orange flames.
1) Helmet: a gold fret headdress with a small white skull at the front, red and dark brown feathers, a strip of white cut-paper banner, a little orange marigold.
2) Body armour: a brown-red mantle with gold fret borders over a bone-white ribcage chest plate, a garland of orange marigolds and tiny white skulls, white cut-paper strips, a small brown owl perched on one shoulder.
3) Boots: bone-white foot bones in red sandal-boots with gold fret anklets, small orange marigolds, tiny orange flames at the heels.
4) Trophy — Marigold of the Dead: a bunch of bright orange marigold flowers tied with red string, a tiny white skull charm hanging from it.

Row 3 — QUETZALCOATL set (feathered serpent god). Colours: turquoise and gold scales, a cream belly, feathers in red, golden yellow, turquoise and blue, a gold sun disc, white wind swirls.
1) Helmet: a turquoise-and-gold feathered-serpent-head helmet with a big gold sun-disc crest behind it and a fan of red, yellow, turquoise and blue feathers.
2) Body armour: turquoise-and-gold scale armour with a cream belly plate, feathered wing shoulder pieces in red, yellow, turquoise and blue, a gold fret collar with a turquoise gem.
3) Boots: turquoise-scaled boots with gold fret bands, small feathered wings at the ankles (red, yellow, turquoise), a white wind swirl at the soles.
4) Trophy — Sun Serpent Scale: one big turquoise scale with a gold rim and a small engraved gold sun.

4 columns × 3 rows: helmet, body armour, boots, trophy (left to right), row 1 at the top. Solid flat pure green (#00FF00) background, no green on the objects (turquoise and teal are fine). Same style as the key art: friendly hand-painted chibi cartoon, thick clean dark-brown outlines, cel shading with 2–3 flat tones, bright and warm. No text, no frame, no glow halo, no body inside the armour, nothing touching the cell edges.
```
