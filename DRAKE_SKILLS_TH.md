# มังกรเตาหลอม (Forgeborn Drake) — ร่างดีไซน์ฮีโร่ใหม่ · ไฟ + หิน · แปลงร่างเป็นมังกรตามสาย

เจ้าของ 2026-11-23 15:47: 'ออกแบบตัวละครใหม่ให้หน่อย อยากได้เป็นมังกร โจมตีใช้พลังหลายธาตุ 2 ธาตุก็ได้ แล้วก็แปลงร่างเป็นมังกรได้ มังกรแต่ละสายจะมีการโจมตีต่างกัน อีกสายนึงอาจจะเน้นดาเมจ อีกสายนึงอาจจะเน้นสตันหรือว่าเวท'

**สถานะ: สร้างในเกมแล้ว เล่นได้ (2026-11-23 · เจ้าของ 16:36 'ทำสกิลของมังกรเลย')** · `?char=drake` · ดูหัวข้อ "สร้างแล้ว" ข้างล่าง · ตารางสกิลด้านล่างคือดีไซน์ ตัวเลขจริงในเกมอยู่ใน char_drake.js (ZD_BAL)

เจ้าของ 16:10 'ดีไซน์แบบอื่นอีกไหม ขอดูอีก' + 16:14 'มังกรหินอยากได้เป็นแบบตัวใหญ่ ๆ บึกบึนกำยำ เพราะมันเน้นสตันใช่ไหม' → **ร่างสาย B เปลี่ยนจากงูไพธอนเป็น "มังกรภูผาแห่งไกอา"** ตัวใหญ่บึกบึน (×1.6) ทุบทีมึน · ลุคให้เลือก 3 แบบ (พรอมต์ 3ก / 3ข / 3ค) · มังกรไฟปรับให้เพรียวว่องไว ตัดกันชัด · คอนเซปต์อื่นทั้งตัวอีก 4 แบบอยู่หัวข้อท้ายไฟล์

## สร้างแล้ว (2026-11-23)
ไฟล์ `char_drake.js` (ฮีโร่ตัวที่ 17 · กรีก · เมืองเริ่ม `grkT` · ค้อน Forgeborn Hammer ATK 140 / MATK 130 · ระยะตีปกติ 70 · CHAR_ASPD 156 · CLASS_BASE str 8 agi 3 vit 7 int 7 dex 6 luk 5 · บิลด์เริ่ม STR · ฮีโร่สองทาง DT 'AB')
- **สกิลครบ 47 + สกิลเสริม 11** (skill_enh.js: Basalt Scales · Anvil Shock · Wyrm Call · Ember Wake · Second Strike · Obsidian Riposte · Ash Cloud · Bedrock Bind · Shard Rain · Marble Bulwark · Stone Gaze) · ทรี 4 แท็บ · อัปสลับ 3 คู่ (Forge Hammer ↔ Bellows Breath · Searing Hammer ↔ Heart of Etna · Stone Spike ↔ Heart of Gaia — สกิลโจมตีมาก่อนหัวใจ) · โหนด C ผูกกับ: Master Smith ← Forge Hammer 4 · White-Hot ← Searing Hammer 4 · Basilisk Stare ← Stone Spike 4 · Living Stone ← Stone Skin 3 · Molten Comet ← Anvil Breaker 2 · Medusa's Veil ← Vapour Vent 2 · Second Wind ← Cyclops Apprentice 4 · Lava Plate ← Obsidian Guard · Petrified Garden ← Monolith 2 · Primordial Ascension ← Dragon Roar 3 · Typhon's Wrath ← Etna Erupts · Gaia's Embrace ← Gorgon's Eye
- **เผาแล้วชุบ:** ความร้อน = ถ่านแดงเหนือหัวศัตรู + พื้นเรืองส้มใต้เท้า · ไหม้ทุกวิ (เลเวล × 0.4 ต่อขั้น) · ชุบ = ไอน้ำพวย → สาย A ระเบิดลาวา / สาย B รูปปั้น (ตัวเทาหิน ค้างท่า มีรอยร้าว แตกเป็นเศษหินตอนหลุด) · บอส / มินิบอส / ชิ้นส่วนบอส: ช้าลง 2 วิ + ลดเกจ KO หนัก + รอยร้าวสีอำพัน 4 วิ
- **ต่างจากดีไซน์ (เจอตอน bench):** ระเบิดลาวาโดนเป้าที่ถูกชุบเต็มแรง ศัตรูรอบ ๆ โดนครึ่งเดียว และโดนได้ครั้งเดียวต่อการร่าย 1 ครั้ง — แบบเดิมชุบทั้งฝูงพร้อมกันแล้วระเบิดใส่กันเองทุกตัว ดาเมจฝูงโตเป็นกำลังสอง (bench รอบแรก ลาวา = 81 % ของดาเมจฝูง)
- **เลือดมังกร:** แถบเหนือแถบสกิล (มือถือ: แถบล่างระหว่างจอยกับวงล้อ) + ไอคอนสถานะ · เต็มแล้วแถบเรืองทอง ปุ่มหัวใจกะพริบ · ร่างมังกร: แถบนับวิที่เหลือ · ปุ่มสายตัวเองมีหัวมังกรเล็กมุมขวาบน ปุ่มอีกสายมืด · ชื่อท่าตอนกดเป็นชื่อท่ามังกร
- **ร่างมังกร:** 0.8 วิแรกไม่โดนดาเมจ · ไม่ติดสตัน / ลอย / ชะงักจากมอน · โล่มังกรแสดงเป็นไอคอนสถานะ (ตัวเลข) · B เดินช้าลง 40 · อัลติตอนเป็นมังกร = ท่าปิดฉากแล้วคืนร่าง · นั่ง = คืนร่าง · กดหัวใจซ้ำ = คืนร่าง (เฉพาะผู้เล่นกดเอง: AUTO / bench ไม่คืนร่างเอง)
- **ภาพ:** ตั้งแต่ 2026-11-23 19:43 ใช้ภาพจากชีต 8 ทิศของเจ้าของแล้ว (หัวข้อ "หน้าตาจริง" ข้างล่าง) · ไอคอนโค้ด SVG ทั้ง 47 · เอฟเฟกต์โค้ด (ค้อนฟาด กรงเล็บ กัด กรวยไฟ / ลาวา ระเบิดลาวา หนามหิน พื้นแตก ไอน้ำ ภูเขาไฟเล็ก อุกกาบาต ดาวหางค้อน แท่งหินพยากรณ์ โซ่หิน ดวงตากอร์กอน มือไกอา)
- **AUTO:** แปลงร่างเมื่อมีบอสหรือมอนรอบตัว ≥ 3 · ใช้ท่าปิดฉากตอนร่างเหลือ < 3 วิ · เลือกสาย A / B ตาม ATK / MATK
- **เช็กแล้ว:** herosweep / lostev / ranges / combo / leak / gemfx_sweep ไม่มี error · แปลงร่างทั้ง 2 แบบ + ท่ามังกรทุกท่า + อัลติทั้ง 2 ร่าง (สคริปต์ในเครื่อง /home/claude/work/drake t1.py · t2.py)
- **bench (Lv 60, tools/qa/build_matrix.py RUNS 3):** สาย A บิลด์ STR **2,041** (dps1 997 · ฝูง 4,179 · รับดาเมจ 40/วิ) · AGI 1,790 · LUK 1,729 · VIT 1,583 · INT+DEX 1,512 · INT 1,466 · DEX 1,428 | สาย B บิลด์ INT **2,073** (dps1 908 · ฝูง 4,734 · รับดาเมจ 29/วิ — รูปปั้นไม่ตีกลับ) · INT+DEX 1,854 · บิลด์กายภาพ 641–748 (สาย B = MATK ล้วน ตามกฎ 2026-11-22) · `CHAR_COEF.drake = {A .63, B 1.6, basic 1}` · ทั้งสองสายแปลงร่างได้ราว 1 ครั้งในการต่อสู้ 40 วิ
- **ยังไม่ทำ:** คลิปท่าจริง 20 คลิปของร่างคน (ตอนนี้ท่าทำจากภาพนิ่ง) · ไอคอนวาด / พื้นหลังทรี · ภาพนั่ง · ท่ามังกรแบบคลิป (เฟส 2) · อาวุธ: ภาพของเจ้าของถือ **ดาบ** แต่ชื่อ / คำอธิบายสกิลยังเป็น **ค้อน** (รอเจ้าของเลือก)

## หน้าตาจริง (2026-11-23 · เจ้าของ 19:43 'หน้าตาประมาณนี้' + ชีต 8 ทิศ 3 ภาพ)
ชีตเก็บไว้ที่ `assets/heroes/drake/sheet_hero.webp` · `sheet_magma.webp` · `sheet_mountain.webp` (ร่างคน = อัศวินมังกรแดง เกราะขาวเงิน ผ้าคลุมแดงลายเปลวทอง แผงคอเปลวส้ม เขาแดงห่วงเงิน ถือดาบใหญ่ด้ามทอง · มังกรลาวา = มังกรแดงสี่ขาปีกส้ม เขาทอง เหรียญทองที่อก · มังกรภูผา = มังกรหินม่วงบึกบึน หนามสีน้ำตาลอ่อน ปลอกทองลายกรีกที่ขาและคอ)
- **ร่างคน:** `assets_drake.js` (prefix DRK) = `python3 -I tools/statichero.py <ชีต> assets_drake.js DRK 0,1,2,3,4 230 timing=assets.js` — ท่าทำจากภาพนิ่ง (โยก / ง้าง / พุ่ง / ยกตัว) จนกว่าจะมีคลิปจริง · **จังหวะ = ของสไปรต์หมาป่าที่ใช้ตอน bench ทุกทิศ** (ตัวเลือกใหม่ `timing=` คัดลอกจำนวนเฟรม เวลาแต่ละเฟรม เฟรมโดน และเฟรมปล่อยท่าของแต่ละทิศ รวม NE→E ของท่าตี) → ตีโดน / ปล่อยท่า / ความยาวท่าเท่าเดิมเป๊ะ (เช็กทุก 8 ทิศ) · index.html: DRK_ART สลับ atlas · CHAR_FILTER ว่าง · CHAR_SCALE 1.55 (สูงเท่าหมาป่า: 230 × 1.55 ≈ 356) · หน้าเลือกตัว = `assets/heroes/drake/portrait.webp` (ประกอบจากภาพเจ้าของ: อัศวินหน้า มังกร 2 ร่างข้างหลัง) · หน้าฮีโร่บน HUD = `face.webp` (ฮุกใหม่ `window.HUD_FACE` ใน drawPortrait ใช้กับฮีโร่อื่นได้)
- **ร่างมังกร:** ภาพนิ่ง 8 ทิศต่อร่าง `assets/heroes/drake/magma_<ทิศ>.webp` · `mountain_<ทิศ>.webp` (ตัดด้วย `python3 -I tools/dir8cut.py pics <ชีต> <prefix> S=0,SE=1,…` — โหมดใหม่ พิมพ์ตาราง [กว้าง, สูง, จุดเท้า x, y] · ชีตลาวาวางด้านข้างสลับกัน: E = ภาพที่ 6, W = ภาพที่ 2) · วาดเองใน `zdDrawDragon` (char_drake.js ZD_PIC): เลือกภาพตามทิศของเฟรมปัจจุบัน (ท่าหมุนก็หมุนตาม) · ทุกทิศใช้สเกลเดียว · ความสูงภาพทิศใต้ = ความสูงฮีโร่ × 1.35 (ลาวา) / × 1.6 (ภูผา) ตาม ZD_BAL · ท่าทางด้วยโค้ด: หายใจ · ก้าวเดินโยกขึ้นลง (ด้านข้างโยกหน้าหลัง) · ง้างย่อตัวก่อนโดน → พุ่งไปข้างหน้าตอนโดน · ยกตัวตอนร่าย · สั่น + แฟลชขาวตอนโดนตี · เงาแบบเดียวกับฮีโร่ (castShadow / แดดของเมือง) · ลาวา: แสงเรือง + ถ่านปลิว · ภูผา: ไม่เรือง (แสงบวกบนหิมะกลายเป็นขาว) มีเศษหินร่วงตอนเดิน · ภาพโหลดไม่ขึ้น = ใช้ชีตมอนย้อมสีแบบเก่าแทน
- **เช็กแล้ว:** 8 ทิศทั้ง 3 ร่าง · เดิน / ตีปกติ / ท่าร่าย / แปลงร่าง / คืนร่าง (คลิป) · ทุ่งกรีกข้างมอนจริง · มือถือ 844×390 · หน้าเลือกตัว 2 ขั้น · herosweep / lostev / combo / leak ไม่มี error · bench STR A 2,019 · INT B 2,032 (3 รอบ เทียบ 2,041 / 2,073 = อยู่ในช่วงแกว่ง)

## สรุป
- **ตัวตน:** มังกรหนุ่มกึ่งมนุษย์ (ยืนสองขา) ช่างตีเหล็กแห่งกรีก ถือ **ค้อนเตาหลอม** สองหน้า — หน้าหนึ่งร้อนแดงเป็นลาวา อีกหน้าเป็นหินอ่อนแกะสลัก · ชื่อคลาส (เสนอ) Forgeborn Drake · มังกรเตาหลอม · ชื่อเล่น ไพโรลิธ (Pyrolith = pyro ไฟ + lith หิน)
- **ดินแดน: กรีก** (กรีกมี 2 ตัว คือ แกะกับสิงโต ดินแดนอื่นมี 3–4 → ตัวนี้ทำให้ครบ 3) · เมืองเริ่ม ไอโอเนีย `grkT` · รหัสฮีโร่ `drake` · รหัสสกิล `zn` Basic · `za` A · `zb` B · `zx` C (เช็กแล้ว ไม่ชนชื่อไหนในโค้ด)
- **2 ธาตุ: ไฟ 🔥 + หิน 🪨** ใช้คู่กันตลอด: ไฟ "เผา" ศัตรูให้ร้อน → หิน "ชุบ" ล้างความร้อนออกมาเป็นผล (แบบการตีเหล็ก: เผาจนแดงแล้วทุบ / ชุบ)
- **ฮีโร่สองทาง:** A = ATK (บิลด์ STR) · B = MATK (บิลด์ INT) · Basic = ค่าที่สูงกว่า · ตีปกติ = ATK
- **แปลงร่าง:** สู้ไปเก็บ **เลือดมังกร** 0–100 → เต็มแล้วกดแปลงเป็นมังกรจริงของสายตัวเอง ~20–25 วิ
  - สาย A **มังกรลาวาเอตนา** — มังกรสี่ขามีปีก ตัวเพรียวว่องไว เน้น **ดาเมจ** (ตะปบ กัด ดิ่งทุบ พ่นลาวา หางกระบองฟาด)
  - สาย B **มังกรภูผาแห่งไกอา** — มังกรหินยักษ์บึกบึนกำยำ ไม่มีปีก ตัวใหญ่ช้าแต่ไม่มีอะไรหยุดได้ เน้น **สตัน + เวท** (ทุบพื้นแผ่นดินไหว คว้ากดลงพื้น คำรามให้เป็นหิน ขว้างหินยักษ์)
- ทุกสกิลกดของสาย A / B มี **"ท่ามังกร" บนปุ่มเดิม** — เป็นมังกรแล้วปุ่มเดิมกลายเป็นท่ามังกร (ใช้เลเวลและเจมของสกิลนั้น) ไม่ต้องจำปุ่มใหม่

## ที่มา
ไข่มังกรใบหนึ่งกลิ้งตกเตาหลอมของเฮฟเฟสตัสใต้ภูเขาไฟเอตนา — ภูเขาที่ทับไทฟอน (บอสใหญ่ของกรีก ยอดเขาโอลิมปัส `grkE2`) เอาไว้ ไข่ถูกเผาด้วยไฟเตาและชุบด้วยหินลาวาจนฟักออกมามีเลือดสองธาตุ ไซคลอปส์ช่างตีเหล็กของเฮฟเฟสตัสเลี้ยงเขาเป็นลูกมือ (ถ้ำไซคลอปส์ `grkD1a` = บ้านเก่า)
- เลือดไฟ = เลือดเอตนา มีเลือดไทฟอนปน → ตะขอเนื้อเรื่องกับบอสใหญ่ของกรีก
- เลือดหิน = พลังของไกอา แม่ธรณีผู้เป็นเจ้าของคำพยากรณ์แห่งเดลฟีคนแรก · ร่างมังกรหิน = ภูเขาลูกหนึ่งของไกอาที่ลุกขึ้นเดิน
- เมื่อเลือดเดือด เขาคืนร่างมังกรจริง = วิญญาณโทเท็มของตัวเขาเอง (ผูกกับเรื่องโทเท็มแตกของเกม)

## กลไก 1 · เผาแล้วชุบ (ไฟ–หิน)
- **🔥 ไฟ → ความร้อน:** การโจมตีธาตุไฟติดความร้อนบนศัตรู 1 ขั้น (สูงสุด 3 · ถ่านแดง 1–3 ดวงเหนือหัว) · ไหม้ทุกวิ = เลเวลเรา × 0.4 ต่อขั้น · อยู่ 6 วิ (ต่อเวลาเมื่อโดนไฟซ้ำ)
- **🪨 หิน → ชุบ:** ล้างความร้อนทั้งหมดบนเป้านั้น (ไอน้ำ "ฉ่า") แล้วได้ผลตามสาย
  - **สาย A ระเบิดลาวา:** ATK×0.5 ต่อขั้น ใส่เป้า + รอบเป้า 70
  - **สาย B กลายเป็นหิน:** หยุดนิ่ง 0.6 วิต่อขั้น (3 ขั้น = รูปปั้น 1.8 วิ · ตัวเทาเป็นหิน มีรอยร้าว ค้างท่า) · หลุดจากหินแล้ว **กันหิน 3 วิ**
  - **บอส / มินิบอส ไม่เป็นหิน** → ช้าลง 2 วิ + "ร้าว": ชุบแต่ละขั้นลดเกจ KO ของบอสหนักกว่าปกติ (เกจหมด = บอสมึน 1.5 วิ ตามระบบ KO ที่มีอยู่แล้ว)
  - สกิลสาย Basic ชุบตามค่าที่สูงกว่า (ATK สูงกว่า = ระเบิดลาวา · MATK สูงกว่า = เป็นหิน)
- สกิลที่เป็น **🔥🪨 ทั้งคู่** (ลาวา) ติดความร้อนแล้วชุบในทีเดียว — คุ้มสุดแต่คูลดาวน์ยาว
- ตีปกติก็เป็นจังหวะเผา–ชุบ: ฟาดค้อน 🔥🔥🔥 แล้วจังหวะสุดท้าย 🪨
- ไม่มีเปอร์เซ็นต์ ไม่มีสุ่ม (กฎ 12 Tails): ทุกอย่างเป็นค่าคงที่ / ตัวนับ

## กลไก 2 · เลือดมังกร → แปลงร่าง

| เรื่อง | กติกา |
|---|---|
| ได้เลือดมังกร (ร่างคน) | ตีปกติโดน +1 · สกิลโดน +2 ต่อเป้า (≤ +4 ต่อการร่าย) · ชุบสำเร็จ +3 (≤ +6 ต่อการร่าย) · โดนตี +1 (≤ +4 ต่อวิ) · ฆ่า +2 · Dragon Roar +15 → สู้เต็มที่ราว 25–35 วิต่อการแปลง 1 ครั้ง (ฝูง 15–20 วิ) |
| ไม่ได้สู้ | ร่างคนเกจไม่ลด · ออกจากการต่อสู้ 10 วิ → ลด 2 ต่อวิ |
| แปลงร่าง | เกจ 100 → ปุ่ม Heart of Etna / Heart of Gaia เรืองทอง → กด: 0.8 วิ ไม่โดนดาเมจ ระเบิดรอบตัว (A ลาวา · B แผ่นดินยกตัว ทั้งวงเป็นหิน) |
| ร่างมังกร | เกจลด 5 ต่อวิ (20 วิ) · ท่ามังกรเติมคืนได้บ้าง (A ตีโดน +1 ≤ +2 ต่อท่า · B ทำให้เป็นหิน +2 ≤ +4 ต่อท่า) · **นานสุด 25 วิต่อครั้ง** · กล่องชน / ทางเดินเท่าเดิม · ไม่ติดชะงัก · **A** ตัวใหญ่ ×1.35 โล่มังกร เลเวล × 6 · **B** ตัวใหญ่ ×1.6 โล่มังกร เลเวล × 8 ไม่โดนผลัก แต่เดินช้าลง 40 |
| ปุ่มในร่างมังกร | ตีปกติ + สกิลกดของสายตัวเอง → ท่ามังกรของสกิลนั้น (เลเวล / เจมเดิม) · สกิล Basic ใช้ได้ (ทำด้วยร่างมังกร) · สกิลอีกสายเป็นปุ่มเทา · อัลติตอนเป็นมังกร = ท่าปิดฉากแล้วคืนร่าง |
| คืนร่าง | เกจหมด / กด Heart ซ้ำ / ใช้อัลติ / นั่ง → คืนร่าง (ไอน้ำพุ่ง) · 8 วิแรกหลังคืนร่างเกจไม่เติม |

## มังกร 2 สายต่างกันยังไง

| | A · มังกรลาวาเอตนา | B · มังกรภูผาแห่งไกอา |
|---|---|---|
| ร่าง | มังกรสี่ขามีปีก ตัวเพรียวว่องไว เกราะออบซิเดียน รอยแตกลาวา หางเป็นกระบองรูปหัวค้อน | มังกรหินยักษ์บึกบึนกำยำ ไม่มีปีก ไหล่กว้าง แขนหน้าใหญ่เหมือนก้อนหิน ผิวหินอ่อน / หินทราย รอยแตกอำพันมีไอร้อนพวย (ลุคให้เลือก 3 แบบ) |
| ขนาดในเกม | ×1.35 | ×1.6 (ใหญ่สุดในเกมฝั่งฮีโร่) · เดินช้าลง 40 · ไม่โดนผลัก |
| ตีปกติ (มังกร) | **Magma Claw** ตะปบ 🔥🔥🔥 แล้วกัด 🪨 · ATK · ระยะ 85 | **Quake Stomp** ทุบพื้นด้วยกำปั้น คลื่นกระแทกสั้นหน้าตัว 130 · 🔥 ไอร้อนทุกครั้ง ครั้งที่ 3 🪨 ชุบ · MATK (นับเป็นสกิลสาย B) |
| เด่น | ดาเมจระเบิด เป้าเดียว + ฝูง · ทุ่มตอนบอสเปิดช่อง | ทุบทีมึนทั้งวง ยืนกลางฝูงได้ · บอส: ร้าว → KO บ่อย |
| ระยะ | ประชิด | ร่างคนยิงระยะกลาง → ร่างมังกรลุยประชิด |
| อ่อน | ไม่มีคุม โดนรุมต้องพึ่งโล่ | ตัวช้า · ดาเมจเป้าเดียวน้อยกว่า |
| ความยาก | ง่าย–กลาง (เก็บเกจไว้แปลงตอนบอสเปิด) | ง่าย–กลาง (เผาให้ครบ 3 ก่อนชุบ หินนานสุด แล้วแปลงร่างกระโดดลงกลางฝูง) |

## สกิลทั้งหมด (ร่างแรก · ตัวเลข ATK× / MATK× = ที่จะเห็นในเกม · 🐉 = ท่ามังกรบนปุ่มเดียวกัน)

### Basic · ลูกมังกรเตาหลอม (Forgeborn Hatchling)

| แถว | สกิล | ชนิด | CD / SP | ทำอะไร | เลเวลสูงสุด |
|---|---|---|---|---|---|
| 1 | **Forge Hammer** `znHammer` | Passive (ตีปกติ) | — | ฟาดค้อนต่อเนื่อง จังหวะแรก ๆ 🔥 (ร้อน 1) จังหวะสุดท้าย 🪨 (ชุบ) · 🐉 ใช้ตีปกติของมังกรสายตัวเองแทน | Lv 4 → 4 จังหวะ 🔥🔥🔥🪨 |
| 1 | **Bellows Breath** `znBreath` | กดใช้ | 6 วิ / SP 10 | พ่นไฟเป็นกรวยสั้นด้านหน้า 🔥 ทุกตัวร้อน 2 (อัปสลับกับ Forge Hammer) · 🐉 กรวยยาว ×1.5 | Lv 4 → ATK×1.2 กรวย 140 · Cooldown 6 วิ |
| 2 | **Stone Skin** `znSkin` | กดใช้ | 18 วิ / SP 12 | เกล็ดกลายเป็นหินอ่อน ดาเมจที่ได้รับลดลง โดนตีได้เลือดมังกร +2 แทน +1 (เพดาน +6 ต่อวิ) | Lv 3 → ดาเมจที่ได้รับ −30 ต่อครั้ง นาน 5 วิ · Cooldown 18 วิ |
| 2 | **Anvil Leap** `znLeap` | กดเลือกจุด | 10 วิ / SP 12 | กระโดดทุบค้อนลงจุดที่เลือก 🪨 ชุบทุกตัวในวง · 🐉 กระโจนด้วยร่างมังกร | Lv 3 → ระยะ 240 · ATK×1.4 รัศมี 80 · Cooldown 10 วิ |
| 3 | **Cyclops Apprentice** `znCyclops` | Passive | — | ศิษย์ไซคลอปส์ช่างตีเหล็ก ชุบได้แต่ละครั้งฟื้น HP | Lv 4 → ฟื้น HP เลเวล × 0.8 (ไม่เกิน 1 ครั้งต่อวิ) |
| 3 | **Molten Core** `znCore` | Passive | — | ความร้อนบนศัตรูอยู่นานขึ้นและไหม้แรงขึ้น | Lv 3 → อยู่ 6 → 8 วิ · ไหม้ + เลเวล × 0.2 ต่อขั้นต่อวิ |
| 4 | **Dragon Roar** `znRoar` | กดใช้ | 24 วิ / SP 16 | คำรามเลือดมังกร ศัตรูรอบตัวชะงัก (บอสไม่ติด) เลือดมังกร +15 · 🐉 ต่อเวลาร่างมังกร +3 วิแทน (ไม่เกินนานสุด) | Lv 3 → ชะงัก 1 วิ รัศมี 160 · Cooldown 24 วิ |

### A · ค้อนลาวาแห่งเอตนา (Etna's Magma Hammer · กายภาพ ATK) → ร่าง มังกรลาวาเอตนา

| แถว | สกิล | ชนิด | CD / SP | ทำอะไร | เลเวลสูงสุด |
|---|---|---|---|---|---|
| 1 | **Heart of Etna** `zaHeart` | กดใช้ (เลือดมังกร 100) | — / SP 0 | **แปลงร่างเป็นมังกรลาวาเอตนา** · ภูเขาไฟเล็กระเบิดรอบตัว ทุกตัวร้อน 2 แล้วชุบ · อยู่จนเลือดมังกรหมด · กดซ้ำ = คืนร่าง (อัปสลับกับ Searing Hammer) | Lv 4 → ระเบิด ATK×2.2 รัศมี 140 · โล่ เลเวล × 6 · นานสุด 25 วิ (Lv 1 = 16 วิ) |
| 1 | **Searing Hammer** `zaSear` | กดใช้ (ใส่เป้า) | 5 วิ / SP 9 | ฟาดค้อนร้อน 2 ครั้ง: ครั้งแรก 🔥 ร้อน 2 · ครั้งที่สอง 🪨 ชุบ · 🐉 **Molten Maul** ตะปบซ้าย–ขวา 🔥🔥 แล้วกัด 🪨 | Lv 4 → ATK×1.3 × 2 (🐉 ATK×1.0 × 3) · Cooldown 5 วิ |
| 2 | **Magma Burst** `zaBurst` | Passive | — | ระเบิดลาวาตอนชุบแรงขึ้นและกว้างขึ้น | Lv 3 → ต่อขั้น ATK×0.5 → ×0.8 · รัศมี 70 → 100 |
| 3 | **Forge Quake** `zaQuake` | กดใช้ | 9 วิ / SP 14 | ทุบพื้นรอบตัว 🪨 ชุบทุกตัวในวง · 🐉 **Volcano Dive** กระพือปีกขึ้นฟ้า ดิ่งลงที่เป้า เหลือหลุมลาวา (ร้อน 1 แล้วชุบทั้งวง) | Lv 2 → ATK×1.7 รัศมี 120 (🐉 ATK×2.3 รัศมี 150) · Cooldown 9 วิ |
| 3 | **Aftershock** `zaAfter` | Passive | — | (ต่อยอด Forge Quake) 0.6 วิต่อมาพื้นแตกวงที่สองใหญ่กว่า 🔥 ร้อน 1 | Lv 2 → ATK×1.0 รัศมี 180 |
| 4 | **Bellows Rush** `zaRush` | กดใช้ (ใส่เป้า) | 8 วิ / SP 12 | พุ่ง 200 ด้วยแรงลมเป่าเตา ทะลุศัตรู 🔥 ร้อน 1 ทุกตัวในแนว · 🐉 **Inferno Charge** พุ่งเอาเขาชน 260 ร้อน 2 ทั้งแนว (ไม่ผลักบอส) | Lv 2 → ATK×1.5 (🐉 ATK×1.9) · Cooldown 8 วิ |
| 4 | **Cinder Path** `zaCinder` | Passive | — | (ต่อยอด Bellows Rush) รอยไฟค้างพื้น 3 วิ ศัตรูที่เดินผ่านร้อน 1 ทุก 1 วิ | ATK×0.3 ทุก 0.5 วิ |
| 5 | **Anvil Breaker** `zaAnvil` | กดใช้ (ใส่เป้า) | 10 วิ / SP 14 | ทุบเป้าเดียวสุดแรง 🪨 ชุบโดยนับความร้อนเป็น 2 เท่า · 🐉 **Tail Hammer** หมุนตัวฟาดหางกระบองรอบตัว ชุบ ×2 ทุกตัว | Lv 2 → ATK×2.4 (🐉 ATK×2.0 รัศมี 130) · Cooldown 10 วิ |
| 5 | **Cracked Plate** `zaCrack` | Passive | — | (ต่อยอด Anvil Breaker) เป้าที่ถูกชุบตั้งแต่ 2 ขั้น เกราะร้าว DEF ลด 6 วิ | DEF − (เลเวล ÷ 4) |
| 6 | **Lava Geyser** `zaGeyser` | กดเลือกจุด | 11 วิ / SP 16 | ลาวาพุ่งจากพื้น 3 ครั้งที่จุดเลือก 🔥 ร้อน 1 ต่อครั้ง · 🐉 **Magma Breath** พ่นลาวาเป็นกรวยหน้า 1.2 วิ ร้อนครบ 3 ทุกตัว | Lv 2 → ATK×1.0 × 3 รัศมี 90 (🐉 ATK×0.6 ทุก 0.2 วิ กรวย 180) · Cooldown 11 วิ |
| 6 | **Molten Pool** `zaPool` | Passive | — | (ต่อยอด Lava Geyser / Magma Breath) เหลือบ่อลาวา 4 วิ | ATK×0.35 ทุก 0.5 วิ · ร้อน 1 ทุก 1 วิ |
| 7 | **Forge Fury** `zaFury` | Passive | — | ทุกศัตรูที่ติดความร้อนรอบตัว 220 ATK เพิ่ม (สูงสุด 5 ตัว) | Lv 3 → ATK +12 ต่อตัว |
| 7 | **Obsidian Guard** `zaGuard` | กดใช้ | 14 วิ / SP 12 | ยกค้อนรับ 1 วิ โดนตีประชิด = กันได้ สวนด้วยระเบิดลาวา + เลือดมังกร +10 · 🐉 **Obsidian Hide** เกล็ดออบซิเดียนกัน 2 ครั้งใน 3 วิ | สวน ATK×2.4 · Cooldown 14 วิ |
| 8 | **Etna Erupts** `zaUlt` | กดใช้ | 60 วิ / SP 50 | ULTIMATE A · ร่างคน: ทุบพื้นจนภูเขาไฟเล็กโผล่ พ่นลาวา 10 ลูกรอบตัว ทุกตัวร้อนเต็มแล้วชุบพร้อมกัน + เลือดมังกร +40 · 🐉 **Cataclysm** (ท่าปิดฉาก) บินขึ้นสูง ฝนอุกกาบาตลาวา 12 ลูก ดิ่งลงกลางวง ชุบ ×2 แล้วคืนร่าง | Lv 2 → ATK×1.3 × 10 รัศมี 220 (🐉 ATK×1.4 × 12 + ATK×4.0) · Cooldown 60 วิ |
| 8 | **Heir of Typhon** `zaHeir` | Passive | — | (ต่อยอด Etna Erupts) เลือดไทฟอนในตัวตื่น ร่างมังกรอยู่นานขึ้น | นานสุด +8 วิ · เลือดมังกรลด 5 → 4 ต่อวิ |

### B · ศิลาพยากรณ์แห่งเดลฟี (Stone Oracle of Delphi · เวท MATK) → ร่าง มังกรภูผาแห่งไกอา

| แถว | สกิล | ชนิด | CD / SP | ทำอะไร | เลเวลสูงสุด |
|---|---|---|---|---|---|
| 1 | **Heart of Gaia** `zbHeart` | กดใช้ (เลือดมังกร 100) | — / SP 0 | **แปลงร่างเป็นมังกรภูผา** · แผ่นดินรอบตัวยกตัวขึ้น ไอร้อนพวยจากรอยแยก ทุกตัวร้อน 2 แล้วชุบ = เป็นหินทั้งวง · กดซ้ำ = คืนร่าง (อัปสลับกับ Stone Spike) | Lv 4 → MATK×1.8 รัศมี 170 · โล่ เลเวล × 8 · นานสุด 25 วิ (Lv 1 = 16 วิ) |
| 1 | **Stone Spike** `zbSpike` | กดใช้ (ใส่เป้า) | 4 วิ / SP 10 | ไอร้อนพ่นใต้เป้า 🔥 ร้อน 1 แล้วหนามหินแทงขึ้น 🪨 ชุบ · 🐉 **Petrifying Roar** คำรามเป็นกรวย ตาอำพันเรือง ทุกตัวในกรวยชุบ | Lv 4 → MATK×1.15 ระยะ 300 (🐉 MATK×0.9 กรวย 200) · Cooldown 4 วิ |
| 2 | **Gorgon's Mark** `zbMark` | Passive | — | ศัตรูเป็นหินนานขึ้น และโดนเวทเราแรงขึ้นระหว่างเป็นหิน | Lv 3 → หิน 0.6 → 0.8 วิต่อขั้น · เวทเรา + เลเวล × 1 ต่อครั้ง |
| 3 | **Vapour Vent** `zbVent` | กดเลือกจุด | 9 วิ / SP 14 | เปิดรอยแยกพ่นไอร้อนแห่งเดลฟี 5 วิ ทุก 1 วิ 🔥 ร้อน 1 + ดาเมจ · 🐉 **Fumarole Stomp** กระทืบพื้น 3 ที ไอร้อนพวยจากพื้นรอบตัว ตามไปทุกที่ | Lv 2 → MATK×0.5 ทุก 1 วิ รัศมี 110 · Cooldown 9 วิ |
| 3 | **Pythia's Trance** `zbTrance` | Passive | — | (ต่อยอด Vapour Vent) ยืนในไอครบ 2 วิ มึน (บอสช้าลงแทน) | มึน 0.5 วิ ทุก 2 วิ |
| 4 | **Earth Chains** `zbChain` | กดใช้ (ใส่เป้า) | 10 วิ / SP 14 | โซ่หินโผล่จากพื้นตรึงเป้า 🪨 ชุบ (บอสช้าลงแทน) · 🐉 **Mountain Grip** คว้าเป้าเดียวยกขึ้นแล้วกระแทกลงพื้น 2 ครั้ง (บอสคว้าไม่ได้: ทุบแทน ลดเกจ KO หนัก) | Lv 2 → ตรึง 1.5 วิ MATK×1.4 (🐉 MATK×1.5 × 2 + มึน 1.5 วิ) · Cooldown 10 วิ |
| 4 | **Linked Fetters** `zbLink` | Passive | — | (ต่อยอด Earth Chains) โซ่แตกแขนงไปตรึงอีก 2 ตัวใกล้ ๆ | +2 ตัว ระยะ 150 |
| 5 | **Quake Ring** `zbQuake` | กดใช้ | 12 วิ / SP 18 | กระแทกค้อนลงพื้น แผ่นดินไหวรอบตัว 🪨 ชุบทุกตัว · 🐉 **Mountain Quake** กระโดดตัวลอยแล้วทิ้งตัวลงพื้น วงใหญ่กว่า | Lv 2 → MATK×1.6 รัศมี 140 (🐉 MATK×1.9 รัศมี 200) · Cooldown 12 วิ |
| 5 | **Fault Line** `zbFault` | Passive | — | (ต่อยอด Quake Ring) แผ่นดินแยกเป็นแนวตรงไปข้างหน้าต่อ 🪨 | MATK×1.0 แนว 260 |
| 6 | **Monolith** `zbMono` | กดเลือกจุด | 14 วิ / SP 18 | เรียกแท่งหินพยากรณ์ขึ้นที่จุด 6 วิ มอนรอบ ๆ หันไปตีหิน (บอสไม่หลง) หมดเวลาระเบิด 🪨 ชุบรอบ 120 · 🐉 **Boulder Toss** ฉีกหินยักษ์จากพื้นขว้างลงจุด ระเบิดชุบรอบ แล้วหินค้างเป็นเป้าล่อ 4 วิ | Lv 2 → ระเบิด MATK×2.0 (🐉 MATK×2.4 รัศมี 140) · Cooldown 14 วิ |
| 6 | **Oracle Stone** `zbOracle` | Passive | — | (ต่อยอด Monolith) แท่งหินพ่นไอใส่ตัวที่ใกล้ที่สุดทุก 1 วิ 🔥 ร้อน 1 | MATK×0.35 ระยะ 220 |
| 7 | **Gaia's Favour** `zbGaia` | Passive | — | ทุกศัตรูที่เป็นหิน / ร้าวรอบตัว 260 MATK เพิ่ม (สูงสุด 5 ตัว) | Lv 3 → MATK +12 ต่อตัว |
| 7 | **Marble Aegis** `zbAegis` | กดใช้ | 18 วิ / SP 14 | เกราะหินอ่อนดูดดาเมจ แตกหรือหมดเวลา 🪨 ชุบทุกตัวรอบตัว · 🐉 **Mountain Hide** ผิวภูเขา ดูดได้ 2 เท่า คนที่ตีเราประชิดถูกชุบ | ดูด เลเวล × 5 + VIT × 3 นาน 6 วิ · Cooldown 18 วิ |
| 8 | **Gorgon's Eye** `zbUlt` | กดใช้ | 60 วิ / SP 50 | ULTIMATE B · ร่างคน: รอยแยกเดลฟีเปิดเป็นวง ไอร้อนพวย 3 ระลอก แล้วดวงตากอร์กอนบนฟ้าลืมตา ทุกตัวกลายเป็นรูปปั้นพร้อมกัน (ข้ามกันหิน) + เลือดมังกร +40 · 🐉 **Mountainfall** (ท่าปิดฉาก) กระโดดสูงแล้วทิ้งตัวลงกลางวง แผ่นดินยกเป็นหนามหินทั่วจอ ทุกตัวในจอชุบ ×2 แล้วคืนร่าง | Lv 2 → MATK×1.2 × 3 + รูปปั้น 2 วิ รัศมี 240 (🐉 MATK×2.4 + MATK×1.5) · Cooldown 60 วิ |
| 8 | **Oracle's Prophecy** `zbProph` | Passive | — | (ต่อยอด Gorgon's Eye) ร่างมังกรภูผาอยู่นานขึ้น · 6 วิหลังคืนร่าง ชุบทุกครั้งนับเต็ม 3 ขั้น | นานสุด +8 วิ |

### C · มังกรบรรพกาล (Primordial Dragon · 12 โหนด = เจม C บนเสาโทเท็ม / รากโทเท็ม)

| แถว | สกิล | ชนิด | CD / SP | ทำอะไร | ค่า |
|---|---|---|---|---|---|
| T1 basic | **Master Smith** `zxSmith` | Passive | — | Forge Hammer ต่อได้อีก 1 จังหวะ จังหวะสุดท้ายชุบรอบตัว (ไม่ใช่แค่เป้า) | 🔥🔥🔥🔥🪨 · ชุบรอบตัว 90 |
| T1 A | **White-Hot** `zxWhite` | Passive | — | ความร้อนบนศัตรูสูงสุด 4 ขั้น | ระเบิดลาวาได้ถึง 4 ลูกต่อการชุบ |
| T1 B | **Basilisk Stare** `zxStare` | Passive | — | Stone Spike / Petrifying Roar แตกไปชุบอีก 1 ตัวที่ใกล้ที่สุด | +1 เป้า ระยะ 150 |
| T2 basic | **Living Stone** `zxLiving` | Passive | — | ระหว่าง Stone Skin คนที่ตีเราประชิดร้อน 1 · หมดเวลาแล้วเกล็ดหินระเบิดชุบรอบตัว | ระเบิด ATK×1.2 รัศมี 110 |
| T2 A | **Molten Comet** `zxComet` | กดใช้ (ใส่เป้า) | 18 วิ / SP 20 | ขว้างค้อนลาวาเป็นดาวหางทะลุแนว ร้อน 2 ทุกตัว ค้อนบินกลับชุบอีกรอบ · 🐉 พ่นก้อนลาวาเป็นดาวหางแทน | ATK×2.0 ไป + ATK×1.2 กลับ แนว 320 |
| T2 B | **Medusa's Veil** `zxVeil` | กดใช้ | 22 วิ / SP 22 | ม่านไอหินรอบตัว 5 วิ ศัตรูในม่านร้อน 1 ทุก 1 วิและช้าลง อยู่ในม่านครบ 2 วิถูกชุบ | MATK×0.4 ทุก 0.5 วิ รัศมี 150 |
| T3 basic | **Dragon's Second Wind** `zxWind` | Passive | — | คืนร่างแล้วฟื้น HP และเลือดมังกรเริ่มไม่ใช่ศูนย์ | ฟื้น HP เลเวล × 4 · เลือดมังกรเริ่ม 25 |
| T3 A | **Lava Plate** `zxPlate` | Passive | — | ร่างมังกรลาวา: ศัตรูที่ตีโดนเราร้อน 1 · โล่มังกรหนาขึ้น | โล่ + VIT × 2 |
| T3 B | **Petrified Garden** `zxGarden` | Passive | — | ศัตรูที่ตายตอนเป็นหิน แตกเป็นเศษหินกระเด็นชุบรอบ ๆ | MATK×1.0 รัศมี 100 |
| T4 basic | **Primordial Ascension** `zxAscend` | กดใช้ | 90 วิ / SP 40 | Signature · ร่างคน: เลือดมังกรเต็มทันที และ 15 วิแรกของร่างมังกรครั้งต่อไปเป็น "ร่างบรรพกาล" · เป็นมังกรอยู่: เข้าร่างบรรพกาลทันที + ต่อเวลา 10 วิ · ร่างบรรพกาล = ตัวใหญ่ขึ้นอีก ทุกการโจมตีนับทั้งไฟและหิน | 15 วิ · Cooldown 90 วิ |
| T4 A | **Typhon's Wrath** `zxTyphon` | กดใช้ (ใส่เป้า) | 50 วิ / SP 40 | ทุบเป้าเดียว 3 ครั้ง ทุกครั้งร้อนเต็มแล้วชุบ (ระเบิดลาวา 3 รอบ) — ไว้ทุ่มตอนบอสเปิดช่อง · 🐉 กัด–ตะปบ–ฟาดหาง | ATK×3.0 × 3 + ระเบิด · Cooldown 50 วิ |
| T4 B | **Gaia's Embrace** `zxEmbrace` | กดเลือกจุด | 50 วิ / SP 40 | มือหินของไกอาโผล่จากพื้นโอบวง 3 วิ ทุกตัวในวงเป็นหินตลอด (ข้ามกันหิน) · บอส: ร้าวเต็ม + ลดเกจ KO หนัก | MATK×0.8 ทุก 0.5 วิ รัศมี 160 · Cooldown 50 วิ |

สกิลเสริม 11 อัน (skill_enh.js) ทำตอนสร้างจริง เหมือนตัวอื่น

อัปสลับ (zigzag) แถว 1: Forge Hammer ↔ Bellows Breath · Heart of Etna ↔ Searing Hammer · Heart of Gaia ↔ Stone Spike · ทรีรวม Basic 24 · A 31 · B 30 + สกิลเสริม → แต้มไม่พอเก็บครบ ต้องเลือกสาย · ได้แปลงร่างตั้งแต่ Lv 2 (แถว 1) ท่ามังกรเพิ่มตามสกิลที่เรียน

## วิธีเล่น
- **สาย A (STR):** Searing Hammer / Bellows Rush / Lava Geyser ติดความร้อน → Anvil Breaker / Forge Quake ชุบให้ระเบิด → เกจเต็มแล้ว **เก็บไว้แปลงตอนบอสเปิดช่อง** → Magma Breath ให้ร้อนครบ 3 → Tail Hammer ชุบ ×2 → ท้ายร่างกด Cataclysm ปิดฉาก
- **สาย B (INT):** Vapour Vent ปูไอร้อน → Quake Ring เป็นหินทั้งฝูง → Stone Spike เก็บตัวที่หลุด → แปลงร่าง = ทั้งวงเป็นหิน แล้วร่างยักษ์ลุยกลางฝูง → Mountain Quake / Mountain Grip / Petrifying Roar → ท้ายร่าง Mountainfall · เจอบอส: ชุบรัว ๆ ให้บอส KO บ่อย
- AUTO รู้จักทั้งสองสาย (MATK > ATK หรือไม่): แปลงร่างเมื่อมีบอส หรือมีมอนรอบตัว ≥ 3 · ใช้อัลติปิดฉากตอนเกจ < 15

## เจม (จุดขายข้อ 2)
- เจมที่ใส่สกิล = มีผลกับท่ามังกรของสกิลนั้นด้วย (เห็นสี / ภาพเจมบนท่ามังกรเหมือนกัน)
- **เจมธาตุเปลี่ยนธาตุของสกิล** (ผูกกับเผา–ชุบ) นอกจากผลปกติของเจม: ไฟ → สกิลนั้นติดความร้อน 🔥 · น้ำแข็ง → นับเป็นชุบ 🪨 (ช็อกความร้อน แตกแบบน้ำแข็ง) · สายฟ้า → นับทั้งสอง 🔥🪨
- **Heart of Etna / Gaia ใส่หลุมสกิลได้** แต่ไม่มีคูลดาวน์ → เจมที่ปกติแก้คูลดาวน์ ไปแก้ "เกจที่ต้องใช้" แทน: ทุ่มหนัก = ต้อง 120 แต่ระเบิดตอนแปลง ×1.5 · รัวเร็ว = ใช้แค่ 70 แต่ร่างนานสุด −6 วิ
- โจทย์บอสที่ตอบได้: ช่วงเปิด 4–8 วิ → สาย A เก็บเกจไว้แปลง + Typhon's Wrath · ลูกน้องบอสเป็นฝูง → สาย B หินทั้งฝูง · บอสที่ต้องทำให้มึน → สาย B ลดเกจ KO

## บิลด์สเตตัส (จุดขายข้อ 3)

| บิลด์ | สาย | เล่นยังไง |
|---|---|---|
| STR + AGI | A | ตีปกติไว → ความร้อนติดไว เกจเต็มไว แปลงบ่อย |
| STR + VIT | A | ยืนแลก: โดนตีก็ได้เกจ · โล่มังกร + Lava Plate |
| INT ล้วน | B | เวทแรง ทุ่มอัลติ / Gaia's Embrace |
| INT + DEX | B | หินนานขึ้น (สถานะที่เราติด = DEX เทียบ VIT/2 ของมอน) + ร่ายไว = คุมฝูงเก่งสุด |
| INT + VIT | B | ทนทาน Marble Aegis หนาขึ้นตาม VIT |

## กันโกง (คิดไว้ก่อนสร้าง)
1. หินซ้อนไม่ได้: หลุดแล้วกันหิน 3 วิ (ชุบตอนกันหิน = ดาเมจเล็กแทน) — ฝูงไม่ถูกล็อกตลอด (ยกเว้นอัลติ / Gaia's Embrace ที่เขียนไว้ว่าข้าม)
2. บอส / มินิบอส / ชิ้นส่วนบอส ไม่เป็นหิน ไม่ถูกตรึง / รัด → ช้าลง + ลดเกจ KO · ไม่ข้ามกลไกบอส · ท่าคว้า (Mountain Grip) ใช้กับบอสไม่ได้ เปลี่ยนเป็นทุบแทน
3. เกจจากการโดนตี ≤ +4 ต่อวิ (Stone Skin ≤ +6) — ยืนให้รุมแล้วแปลงไม่หยุดไม่ได้ · ร่างมังกรนานสุด 25 วิ (+8 จาก Heir of Typhon / Oracle's Prophecy) · หลังคืนร่าง 8 วิเกจไม่เติม
4. แปลงร่าง 0.8 วิไม่โดนดาเมจ หลบท่าบอสได้ แต่ต้องเกจเต็ม 100 (ไม่ใช่ท่าหลบฟรี)
5. โล่มังกรไม่สะสม หายตอนคืนร่าง · ร่างใหญ่แต่กล่องชนเท่าเดิม (ไม่ติดกำแพง)
6. ท่ามังกรต้องเรียนสกิลต้นทางก่อน (ยังไม่เรียน = ปุ่มว่าง)
7. bench 40 วิแปลงได้ราว 1 ครั้ง → วัดสู้ยาว 2 นาทีเพิ่ม (แบบที่ทำกับลิง) ให้ร่างมังกรเป็นราว 35–45 % ของดาเมจ ไม่ใช่ทุกอย่างอยู่ในร่างมังกร · ร่างคนต้องเล่นสนุกเองได้

## ไม่ชนกับฮีโร่เดิม

| ตัวเดิม | ต่างกันตรงไหน |
|---|---|
| มังกรสิงห์คราม (ญี่ปุ่น) | หมัด / ฝ่ามือ น้ำ ลม สายฟ้า ไม่แปลงร่าง ↔ ค้อน ไฟ + หิน แปลงร่างจริง 2 แบบ |
| สิงโตขาว (กรีก) | มวยแพงเครชั่น + สายฟ้าซุส ↔ ช่างตีเหล็ก ลาวา หินอ่อน |
| แกะขนทอง (กรีก) | ฮีล / เวทช่วย ↔ B คุมฝูงด้วยหิน |
| แรด | แทงค์ หมัดกายภาพ · สาย B Titan Breaker ทุบพื้น ↔ A เป็นสายดาเมจ · ร่างมังกรภูผา (B) ทุบเหมือนกันแต่เป็นเวท MATK ที่ทำให้ศัตรูเป็นหิน คุมฝูง และร่างคนเป็นสายร่ายระยะกลาง |
| คิตสึเนะ / แมว | ไฟจิ้งจอก / ไฟอสูร ↔ ไฟลาวาหนัก ๆ ที่ต้องชุบ · พื้นแตกของแมวเป็นท่าเดี่ยว ↔ ของตัวนี้คือทั้งระบบ |

## สร้างจริงต้องทำอะไร
- **โค้ด:** `char_drake.js` (สกิล 47 + สกิลเสริม 11 ใน skill_enh.js, เกจเลือดมังกร, ความร้อน / หิน / ร้าว, ท่ามังกร, AUTO, ไอคอนโค้ด) · ลงทะเบียนแบบอีกา / ลิง: index.html (CHAR_ASPD เสนอ 156 · CLASS_BASE str 8 agi 3 vit 7 int 7 dex 6 luk 5 · BASIC_RANGE 70 · ฮีโร่สองทาง), char_create.js (กรีก), items.js (บ้าน grk, อาวุธ Forge Hammer ATK + MATK), skill_rules.js, stat_help.js, testroom, skill_shapes, bench / QA
- **แปลงร่างในเอนจิน (ยังไม่มีฮีโร่ไหนทำ):** สไปรต์ร่างมังกรโหลดเป็นท่าเพิ่ม (state ใหม่ใน SPR_META / SPR_ATLAS) แล้วสลับตอนแปลง · ขนาด A ×1.35 / B ×1.6 (กล่องชนเท่าเดิม · วงเตือนของบอสต้องมองเห็นทะลุร่างใหญ่: วาดวงเตือนทับ หรือร่างจางลงตอนยืนบนวงเตือน) · แคชภาพแยกตามท่าอยู่แล้ว · แถบสกิล PC / วงล้อมือถือเปลี่ยนไอคอนเป็นท่ามังกร (ช่วงแรก = ไอคอนเดิม + กรอบหัวมังกรโค้ด) · castSkillNow เลือกท่าตามร่าง · นั่ง = คืนร่างก่อน
- **อาร์ต (ทำทีละขั้น):**
  1. ชีตดีไซน์ 3 ภาพ (พรอมต์ข้างล่าง) → เลือก / แก้
  2. ร่างคน: ชีต 8 ทิศพื้นเขียว (+ ท่านั่ง) → คลิป 20 ตัว (idle / walk / attack / buff × 5 ทิศ) → tools/cliphero.py
  3. ร่างมังกร **เฟส 1** = ชีตยืน 8 ทิศ ร่างละ 1 ภาพ ขยับด้วยโค้ด (หายใจ เดินโยก โน้มตัวก่อนตี พุ่งตอนโดน — วิธีเดียวกับมินิบอส) → เล่นได้เลย · **เฟส 2** = คลิป 20 ตัวต่อร่าง
  4. ไอคอน 47 + 11, พื้นหลังทรี 4 ใบ (C = มังกรบรรพกาลยักษ์อยู่ด้านหลัง), เอฟเฟกต์

## ทางเลือกคู่ธาตุ / คอนเซปต์อื่น
ย้ายไปหัวข้อ "คอนเซปต์อื่นทั้งตัว 4 แบบ" ท้ายไฟล์ (ไฟ + น้ำแข็ง นอร์ส · แสงอาทิตย์ + พิษ อียิปต์ · ไฟสุริยะ + ดวงดาว แอซเท็ก · แสง + ความว่าง รอยแยก) · กลไกเผา–ชุบใช้กับคู่ธาตุไหนก็ได้ (ธาตุแรกติดสถานะ ธาตุที่สองล้างออกมาเป็นผล)

## พรอมต์ชีตดีไซน์ (ChatGPT · ทีละภาพ)
วิธีใช้: แชตใหม่ → พรอมต์ 0 + แนบ **ภาพปกแคมป์ไฟ** + **ชีตฮีโร่ที่มีอยู่ 1 ตัว** ไว้เทียบสัดส่วน (เช่น สิงโต หรือมังกรสิงห์คราม) → มันตอบ ready → ส่งพรอมต์ 1 → ได้ภาพร่างคนแล้ว ส่งพรอมต์ 2 และ 3ก / 3ข / 3ค (ส่งทีละข้อความ จะเจนลุคไหนก่อนก็ได้) **พร้อมแนบภาพร่างคนที่ได้เป็นภาพที่ 3** (ให้มังกรเป็นตัวเดียวกัน) · อยากได้ตัวเมีย: ต่อท้ายพรอมต์ 1 ว่า `Make the hero female, keep the cool look.`

สิ่งที่ต้องเหมือนกันทั้ง 3 ร่าง (อยู่ในพรอมต์ 0 แล้ว): เขาทองแดงลู่หลัง 2 ข้าง + ห่วงทองสลักรูปทั่งที่เขาซ้าย · ตาอำพันม่านตาเรียว · ปลอกคอทองแดงลายกรีกคีย์ทอง · สี: เกล็ดดำถ่านมีรอยแตกลาวาส้มเรือง (ไฟ) + แผ่นหินอ่อนสีครีม (หิน) + ทองแดง / ทอง · ห้ามสีเขียว

### พรอมต์ 0 — กติกา (ส่งครั้งเดียวต่อแชต พร้อมแนบ 2 ภาพ)
```
I will ask you for several character design sheets of ONE new hero for my cute cartoon fantasy MMORPG (animal heroes from Greek, Norse, Egyptian, Japanese and Aztec myths). These rules apply to every sheet in this chat. Do not draw anything yet: reply only "ready", then draw ONE sheet each time I send a design.

Style: copy the first attached image (the game's key art) — friendly hand-painted chibi cartoon, thick clean dark-brown outlines (not black), cel shading with 2–3 flat tones, soft cartoon glow, bright and warm. Not realistic, not painterly, not 3D. The second attached image is an existing hero of the game: match its chibi body proportions, outline weight and finish, but do NOT copy that character.

The hero: a young dragon from Greek myth, hatched in the god Hephaestus's forge under the volcano Mount Etna. His blood holds two elements, FIRE and STONE. He fights with a forge hammer and can transform into a real dragon. These must look the same in every sheet, on the hero and on both of his dragon forms, so players always know it is him:
- two swept-back bronze horns, the left horn with a small gold ring engraved with an anvil
- bright amber eyes with slit pupils
- a bronze collar with a gold Greek-key pattern
- colours: charcoal-black scales with thin glowing molten-orange seams (fire), cream-white marble plates (stone), bronze and gold metal
He must look COOL and heroic, like a stylish action-game hero in chibi form, not a baby mascot: a strong readable silhouette, confident eyes, a few bold shapes. No green anywhere (the animation clips are cut from a green screen).

Every sheet: ONE wide image 1536×1024 on a plain soft cream background. No text, no labels, no names, no logo, no watermark.
Layout: LEFT HALF — the character large, full body, three-quarter front view, in the pose the design gives. TOP RIGHT — a small turnaround of the same character standing neutral: front, side facing right, back, all the same height. BOTTOM RIGHT — what the design asks for. Keep the character identical in every view of a sheet.
```

### พรอมต์ 1 — ร่างคน (ฮีโร่)
```
Sheet 1 — the hero, "Forgeborn Drake". A chibi anthropomorphic young dragon standing on two legs: a dragon head with a short snout and one small fang showing, the bronze horns, the amber eyes, a sturdy tail, and two small folded wings on his back (too small to fly — a hint of his dragon forms). Charcoal-black scales with thin glowing molten-orange seams on the arms, the back and the tail; cream-white marble plates on the chest, the belly and the top of the tail. Outfit of a Greek smith: a short off-white chiton tied over one shoulder, a dark-brown leather apron with bronze rivets, bronze bracers, a gold belt with a Greek-key pattern, the bronze collar, simple leather sandals with straps around the ankles. Weapon: a big two-handed forge hammer with a bronze head that has two different faces — one face glowing white-hot orange with molten cracks (fire), the other face carved white marble (stone) — and a dark wooden handle wrapped in leather. Pose: swinging the hammer overhead, the molten face leaving an arc of fire. BOTTOM RIGHT: two small action scenes side by side — on the left he breathes a short burst of fire from his mouth; on the right he slams the marble face of the hammer into the ground and white marble spikes burst up around it.
```

### พรอมต์ 2 — ร่างมังกรสาย A: มังกรลาวาเอตนา (แนบภาพร่างคนเป็นภาพที่ 3)
16:14 ปรับให้เพรียวว่องไว (เดิม "chunky") จะได้ตัดกับมังกรหินที่ตัวใหญ่บึกบึน
```
Sheet 2 — his FIRE dragon form, "Etna Magma Drake". The third attached image is the hero: this dragon is the same character, keep him recognisable. A fierce, lean and agile four-legged western dragon built for speed, still chibi cartoon: a big head, a sleek strong body (much slimmer than his stone form), long legs, sharp claws. Charcoal obsidian armour plates with glowing molten-orange cracks between them, lava glowing inside the mouth and dripping slowly from the jaw, small cream marble plates on the belly, the same bronze horns with the gold ring on the left horn, the same amber eyes, the bronze Greek-key collar. Large bat-like wings with a dark red membrane that glows orange near the wing bones. The tail ends in a heavy club shaped like a bronze-and-marble hammer head. No rider, no saddle. Pose: lunging forward with the wings spread wide and one front claw raised, embers rising around him. BOTTOM RIGHT: the small hero from the third image standing beside the dragon for size — the dragon is about one and a third times as tall as the hero — both facing the viewer.
```

### พรอมต์ 3 — ร่างมังกรสาย B: มังกรภูผาแห่งไกอา · ลุคให้เลือก 3 แบบ (แนบภาพร่างคนเป็นภาพที่ 3)
เจ้าของ 16:14 'ตัวใหญ่ ๆ บึกบึนกำยำ เพราะเน้นสตัน' → แทนงูไพธอนเดิม · ทั้ง 3 แบบไม่มีปีก ผิวหินอ่อน / หินทราย รอยแตกอำพันมีไอร้อน (ไฟ) · ในเกมตัวใหญ่ ×1.6 เดินช้า ไม่โดนผลัก

| แบบ | ทรง | จุดเด่น | ท่าภาพใหญ่ |
|---|---|---|---|
| 3ก รูปปั้นหินอ่อน (Marble Colossus) | ยืนสองขาแบบรูปปั้นนักรบกรีกมีชีวิต | กล้ามหินอ่อนขัดเงา แขนใหญ่ กำปั้นหิน ตอเสาดอริกหักเรียงบนหลัง | ชูกำปั้นสองข้างจะทุบพื้น |
| 3ข ยักษ์ภูผาผลึก (Crystal Mountain Brute) | เดินสี่ขาแบบกอริลลา ท้าวสันมือ | แขนหน้า + ไหล่ใหญ่มหึมา หลังโก่งเป็นสันเขา ผลึกอำพันงอกตามไหล่ หลัง สันมือ | ทุบกำปั้นสองข้างลงพื้น หนามหินพุ่งเป็นวง |
| 3ค มังกรอะโครโพลิส (Acropolis Drake) | สี่ขาเหมือนเนินเขาเดินได้ | ขาเป็นเสาหิน เกราะแผ่นหินอ่อนซ้อน มีวิหารกรีกเล็ก ๆ พังอยู่บนหลัง | ยืนสองขาหลังจะกระทืบลงพื้น |

```
Sheet 3 — his STONE dragon form, "Mountain Drake of Gaia", look A: "Marble Colossus". The third attached image is the hero: this dragon is the same character, keep him recognisable. He is HUGE, burly and heavily muscled — a slow, unstoppable brute whose blows stun enemies — much bigger and bulkier than his fire dragon form, still chibi cartoon (a big head and a heroic face, not scary). He stands upright on two thick legs like a sculpted Greek hero statue come alive: polished cream-white marble muscles, a huge chest, very broad shoulders, enormous arms and big stone fists, gold Greek-key bands around the forearms, short broken Doric column stumps standing along his back like spikes, a short thick tail. Thin glowing amber cracks in the marble let out small wisps of hot vapour. The same bronze horns with the gold ring on the left horn, the same glowing amber eyes, the bronze Greek-key collar around his thick neck. No wings. No rider, no saddle. Pose: both fists raised high, about to smash the ground, pebbles lifting off the floor around his feet. BOTTOM RIGHT: the small hero from the third image standing beside the dragon for size — the dragon is about one and a half times as tall as the hero and much wider — both facing the viewer.
```

```
Sheet 3 — his STONE dragon form, "Mountain Drake of Gaia", look B: "Crystal Mountain Brute". The third attached image is the hero: this dragon is the same character, keep him recognisable. He is HUGE, burly and heavily muscled — a slow, unstoppable brute whose blows stun enemies — much bigger and bulkier than his fire dragon form, still chibi cartoon (a big head and a heroic face, not scary). He walks on all fours like a gorilla, leaning on huge knuckles: massive forearms and shoulders, shorter hind legs, a hunched back shaped like a rocky mountain ridge, a heavy jaw. His hide is warm sandstone and cream marble, with big clusters of amber crystals growing from his shoulders, back and knuckles, and thin glowing amber cracks that let out small wisps of hot vapour. The same bronze horns with the gold ring on the left horn, the same glowing amber eyes, the bronze Greek-key collar around his thick neck. No wings. No rider, no saddle. Pose: slamming both fists into the ground, a ring of stone spikes bursting up around them. BOTTOM RIGHT: the small hero from the third image standing beside the dragon for size — the dragon is about one and a half times as tall as the hero and much wider — both facing the viewer.
```

```
Sheet 3 — his STONE dragon form, "Mountain Drake of Gaia", look C: "Acropolis Drake". The third attached image is the hero: this dragon is the same character, keep him recognisable. He is HUGE, burly and heavy — a slow, unstoppable brute whose blows stun enemies — much bigger and bulkier than his fire dragon form, still chibi cartoon (a big head and a heroic face, not scary). A four-legged dragon like a walking hill: legs like stone pillars, a thick muscular neck, a body covered in overlapping cream-white marble armour slabs, and a small ruined white-marble Greek temple (a few columns and a broken roof) standing on his broad back. No plants. Thin glowing amber cracks between the slabs let out small wisps of hot vapour. A short thick tail with stone plates. The same bronze horns with the gold ring on the left horn, the same glowing amber eyes, the bronze Greek-key collar around his neck. No wings. No rider, no saddle. Pose: rearing up on his hind legs, about to stomp down with both front feet, dust and pebbles rising. BOTTOM RIGHT: the small hero from the third image standing beside the dragon for size — the dragon is about one and a half times as tall as the hero and much wider — both facing the viewer.
```

## ร่างคน: ลุคใหม่ 4 แบบ (เจ้าของ 16:25 'ดีไซน์ร่างคนใหม่ด้วยเพิ่มเติม')
ทางเลือกแทนพรอมต์ 1 (ช่างตีเหล็กกรีก ผ้าจีวร + ผ้ากันเปื้อน) · ทุกแบบยังเป็นมังกรกึ่งคนถือค้อนสองหน้า (หน้าลาวา / หน้าหินอ่อน) และเก็บ **จุดจำ** ที่มังกร 2 ร่างใช้ร่วมกันไว้ครบ: เขาทองแดงลู่หลัง + ห่วงทองสลักทั่งที่เขาซ้าย · ตาอำพัน · ปลอกคอลายกรีกคีย์ · เกล็ดดำถ่านมีรอยแตกลาวา + แผ่นหินอ่อนที่อก–ท้อง · หาง → เลือกลุคไหนพรอมต์มังกร 2 และ 3ก–3ค ใช้ต่อได้เลย

| ลุค | หน้าตา | สีตัด | ท่าภาพใหญ่ |
|---|---|---|---|
| 1 นักรบโฮพไลต์เตาหลอม (Forge Hoplite) | เกราะอกสำริดแบบนักรบกรีก กระโปรงสายหนัง ผ้าคลุมสั้นสีแดง โล่กลมสลักทั่ง + เปลวไฟสะพายหลัง หนามส้มบนหัวเรียงเป็นหงอนแบบหมวกนักรบ (หัวยังโล่ง เห็นเขา) | แดงเข้ม + สำริด | พุ่งชาร์จ ชูค้อนสูง ผ้าคลุมปลิว |
| 2 สองสายเลือด (Twin Blood) | ซีกหนึ่งไฟ: เกล็ดแตกลาวาสว่าง แขนสวมถุงมือลาวา ตาข้างนี้เรืองกว่า · อีกซีกหิน: เกราะหินอ่อนที่ไหล่และแขน ถุงมือหินมีผลึกอำพันที่สันมือ · จีวรพาดไหล่ฝั่งหิน สายหนังคาดอก | ส้มลาวา + ขาวหินอ่อน + ทอง | เหวี่ยงค้อนขวางตัว ไฟลากข้างหนึ่ง เศษหินกระเด็นอีกข้าง |
| 3 ศิษย์ไซคลอปส์ (Cyclops' Apprentice) | ตัวล่ำ ไหล่กว้าง แขนใหญ่ (เข้ากับร่างหินยักษ์) เขม่าเปื้อนจมูก เสื้อกั๊กหนังหมุดสำริด ผ้ากันเปื้อนหนังยาว เข็มขัดเครื่องมือ (คีม สิ่ว) ผ้าคาดหัวมีตราดวงตาเดียวของไซคลอปส์ แผลไฟไหม้เล็ก ๆ ที่แขน | น้ำตาลหนัง + สำริด + ดำเขม่า | ทุบค้อนลงทั่งที่ร้อนแดง ประกายไฟพุ่ง |
| 4 ทายาทไทฟอน (Heir of Typhon) | ลุคดุ ขรึม: ปีกใหญ่ขึ้นเยื่อแดงเข้มพับไว้เหมือนผ้าคลุม หนามออบซิเดียนตามหลังและหาง มงกุฎหนามดำเล็ก ๆ ระหว่างเขา เส้นลาวาเรืองแรงขึ้น เกราะดำ–สำริด ผ้าคลุมแดงเข้มขาด ๆ · ค้อนด้านหลังเป็นหินอ่อนรูปยอดภูเขาไฟ | แดงเข้ม + ทอง + ดำออบซิเดียน | ยืนตระหง่านบนพื้นแตกที่มีลาวา ปักค้อนลงพื้น สองมือจับด้าม |

แนะนำ: **ลุค 2** ผูกกับระบบที่สุด (เห็นตัวก็รู้ว่าแปลงได้ 2 แบบ) · **ลุค 4** เท่สุด · **ลุค 3** เข้ากับมังกรหินยักษ์ · **ลุค 1** ดูเป็นฮีโร่กรีกชัดสุด

วิธีใช้: แชตใหม่ → พรอมต์ลุค 0 + แนบภาพปกแคมป์ไฟ + ชีตฮีโร่ที่มีอยู่ 1 ตัว (เช่น สิงโต) → มันตอบ ready → ส่งลุค 1–4 ทีละข้อความ (ข้อความละภาพ) → ชอบคนละส่วนใช้พรอมต์ผสม · อยากได้ตัวเมีย ต่อท้ายลุคไหนก็ได้ว่า `Make the hero female, keep the cool look.` · ได้ลุคที่เลือกแล้ว ใช้ภาพนั้นเป็นภาพที่ 3 ของพรอมต์ 2 และ 3ก–3ค (ในแชตของพรอมต์ 0 ชุดมังกร)

### พรอมต์ลุค 0 — กติกา (ส่งครั้งเดียวต่อแชต พร้อมแนบ 2 ภาพ)
```
I will ask you for several character design sheets of ONE new hero for my cute cartoon fantasy MMORPG (animal heroes from Greek, Norse, Egyptian, Japanese and Aztec myths). These rules apply to every sheet in this chat. Do not draw anything yet: reply only "ready", then draw ONE sheet each time I send a design.

Style: copy the first attached image (the game's key art) — friendly hand-painted chibi cartoon, thick clean dark-brown outlines (not black), cel shading with 2–3 flat tones, soft cartoon glow, bright and warm. Not realistic, not painterly, not 3D. The second attached image is an existing hero of the game: match its chibi body proportions, outline weight and finish, but do NOT copy that character.

The hero: a young dragon from Greek myth who stands on two legs, hatched in the god Hephaestus's forge under the volcano Mount Etna. His blood holds two elements, FIRE and STONE, and he fights with a big two-handed forge hammer whose head has two faces: one glowing white-hot and molten (fire), the other carved white marble (stone). Later he transforms into real dragons, so every design keeps these marks:
- a dragon head with a short snout, two swept-back bronze horns, the left horn with a small gold ring engraved with an anvil
- bright amber eyes with slit pupils
- a bronze collar with a gold Greek-key pattern
- charcoal-black scales with thin glowing molten-orange seams, and cream-white marble plates on the chest and belly
- a sturdy tail
He must look COOL and heroic, like a stylish action-game hero in chibi form, not a baby mascot: a strong readable silhouette, confident eyes, a few bold shapes. The head, both horns and the eyes are always fully visible: no helmet, no hood, no high collar hiding the face. Only a few dangling items. No green anywhere (the animation clips are cut from a green screen).

Every sheet: ONE wide image 1536×1024 on a plain soft cream background. No text, no labels, no names, no logo, no watermark.
Layout: LEFT HALF — the hero large, full body, three-quarter front view, in the pose the design gives. TOP RIGHT — a small turnaround of the same hero standing neutral: front, side facing right, back, all the same height. BOTTOM RIGHT — two small action scenes side by side: on the left he swings the hammer's molten face and leaves an arc of fire; on the right he slams the marble face into the ground and white marble spikes burst up.
Keep the hero identical in every view of a sheet. Every design I send is a completely new look: reuse nothing from earlier sheets in this chat.
```

### ลุค 1 — นักรบโฮพไลต์เตาหลอม
```
Design 1 — "Forge Hoplite". A proud young warrior-smith dressed like a Greek hoplite: a bronze muscle cuirass with thin glowing molten seams along its edges, a leather strap skirt over a short off-white chiton, bronze greaves and arm guards, a short crimson cape fastened at the bronze collar. A row of short flame-orange spines runs over the top of his head and down his neck like the crest of a hoplite helmet (his head stays bare, horns free). A round bronze shield embossed with an anvil and a flame hangs on his back. Accent colours: crimson and bronze. Hammer: a long-handled war hammer with a bronze head and a leather-wrapped grip. Pose: charging forward with the hammer raised high, the crimson cape streaming behind him.
```

### ลุค 2 — สองสายเลือด
```
Design 2 — "Twin Blood". An asymmetric look that shows both of his bloods. One side of his body is FIRE: the charcoal scales there crack with bright molten light, that forearm is wrapped in a smouldering black-and-orange lava gauntlet, and the eye on this side glows a brighter amber. The other side is STONE: heavy cream-white marble plates cover the shoulder and arm, ending in a stone gauntlet with small amber crystals on the knuckles. A short off-white chiton is draped over the stone shoulder only, a dark leather harness crosses the chest, a gold Greek-key belt buckle, leather leg wraps. Accent colours: molten orange, marble white and gold. Hammer: the molten face points to his fire side and the marble face to his stone side. Pose: the hammer swung across his body, flames trailing from one side and stone chips flying from the other.
```

### ลุค 3 — ศิษย์ไซคลอปส์
```
Design 3 — "Cyclops' Apprentice". A stocky, strong young smith who learned his craft from the Cyclopes: very broad shoulders and big forearms, a few soot smudges on his snout and scales, a sleeveless dark-brown leather vest with bronze studs, a long thick leather smith's apron with a bronze anvil badge, thick leather wrist wraps, a tool belt with tongs and a chisel, a leather headband with one round bronze eye emblem (the Cyclops' sign) on his forehead between the horns, a small healed burn mark on one arm, sturdy sandals. Accent colours: leather brown, bronze and soot black with orange glow. Hammer: an oversized blocky smith's hammer. Pose: bringing the hammer down onto a glowing red-hot anvil, a fountain of sparks bursting up.
```

### ลุค 4 — ทายาทไทฟอน
```
Design 4 — "Heir of Typhon". A darker, royal look: the blood of Typhon, the storm giant trapped under the volcano, wakes in him. Larger dark wings with deep red membranes folded behind him like a cloak, a row of sharp black obsidian spines down his back and tail, a small crown of obsidian spikes between his bronze horns, brighter glowing molten veins. Sleek black-and-bronze armour with molten seams, a long tattered deep-red cape held by the bronze collar, black wrapped greaves. Accent colours: deep red, gold and obsidian black. Hammer: a heavy war hammer whose striking face glows white-hot and whose back face is carved marble shaped like a volcano peak. Pose: standing tall on cracked ground with lava glowing in the cracks, the hammer planted head-down in front of him, both hands on the handle, cape blowing.
```

### พรอมต์ผสม (ตัวอย่าง — เปลี่ยนเลขกับส่วนได้)
```
Design 5 — a mix: the head, spines and wings of design 4 with the armour and cape of design 1, in the pose of design 2. Same rules and layout.
```

## ขั้นต่อไป
1. ~~เลือกลุค + เจนชีต~~ (เสร็จ 19:43: ชีต 8 ทิศ 3 ภาพ ใส่ในเกมแล้ว) → 2. เจ้าของเลือกว่าอาวุธเป็น **ดาบ** ตามภาพ (เปลี่ยนชื่อ / คำอธิบายสกิลค้อน) หรือคง **ค้อน** (เจนภาพใหม่) → 3. คลิปท่า 20 คลิปของร่างคน (idle / walk / attack / buff × S SE E NE N, ทำแบบลิง: `tools/dir8cut.py start` ทำเฟรมแรก แล้วต่อด้วย `tools/cliphero.py`; จังหวะใช้ของหมาป่าแบบ timing= เดิม) → 4. ไอคอน / พื้นหลังทรี / ภาพนั่ง

## คอนเซปต์อื่นทั้งตัว 4 แบบ (เจ้าของ 16:10 'ดีไซน์แบบอื่นอีกไหม ขอดูอีก')
ถ้าอยากเปลี่ยนทั้งตัว (ธาตุ / ดินแดน / มังกร 2 ร่าง) · ทุกแบบยังเป็นมังกรกึ่งคนที่แปลงร่างได้ สาย A ดาเมจ / สาย B สตัน–เวท แต่ **กติกาแปลงร่างไม่ซ้ำกันเลย** (หยิบกติกาข้ามแบบได้ เช่น ลุคแบบ 1 + กติกาแปลงร่างแบบ 3) · ถ้าเจ้าของเลือกแบบไหน ค่อยเขียนทรีสกิลเต็มแบบแบบ 1

| แบบ | ดินแดน (ฮีโร่ตอนนี้) | 2 ธาตุ | อาวุธ | แปลงร่างยังไง | มังกร A ดาเมจ | มังกร B สตัน / เวท |
|---|---|---|---|---|---|---|
| 1 มังกรเตาหลอม (แบบหลักข้างบน) | กรีก (2) | ไฟ + หิน | ค้อนเตาหลอม | เกจเลือดมังกรจากการสู้ | มังกรลาวาเอตนา | มังกรภูผาแห่งไกอา (ยักษ์บึกบึน) |
| 2 มังกรเพลิงหิมะ | นอร์ส (4) | ไฟ + น้ำแข็ง | ง้าวหัวเรือมังกร | ตาชั่งร้อน–เย็น ดันสุดทางไหนแปลงเป็นมังกรทางนั้น | มังกรเพลิงมุสเปล | ลินด์เวิร์มน้ำแข็ง (แช่แข็ง) |
| 3 อูเรอัสแห่งรา (ตัวเมีย) | อียิปต์ (3) | แสงอาทิตย์ + พิษ | ดาบโคเปช | ลอกคราบ ทิ้งคราบเป็นหุ่นล่อ · ร่างมังกรมีเกราะ HP ของตัวเอง | งูเห่ามังกรสุริยะ | งูเห่ามังกรราตรี (สะกด อัมพาต) |
| 4 ซิวโคอาทล์ งูไฟคราม | แอซเท็ก (3) | ไฟสุริยะ + ดวงดาว | แส้ไฟงู | เก็บเกล็ดที่หลุดลงพื้น 12 ชิ้น | งูไฟแห่งพระอาทิตย์ | งูเมฆทางช้างเผือก (ตาข่ายดาว) |
| 5 มังกรเอเธอร์ | รอยแยก · บ้านเมืองหลวง (ช่องที่ว่างอยู่) | แสง + ความว่าง | จักรวงแหวน | เปิดรอยแยกบนพื้น ร่างมังกรอยู่ได้เฉพาะในวง | มังกรปริซึม | มังกรหลุมดำ (ดูด หยุดเวลา) |

### แบบ 2 · มังกรเพลิงหิมะ (Rimefire Drake) — นอร์ส · ไฟ 🔥 + น้ำแข็ง ❄️
- ตำนาน: ต้นกำเนิดโลกนอร์ส ไฟมุสเปลไฮม์ชนน้ำแข็งนิฟล์ไฮม์กลางช่องว่างกินนุงกากัป น้ำแข็งละลายเกิดยมีร์ (บอสใหญ่ของนอร์ส `vikE2`) — และไข่มังกรใบหนึ่งที่ครึ่งไฟครึ่งน้ำแข็ง
- ลุค: ร่างแบ่งครึ่ง — ซีกหนึ่งน้ำแข็ง (เกล็ดขาวฟ้า เขาผลึกใส ตาฟ้า) อีกซีกไฟ (เกล็ดดำถ่าน รอยแตกถ่านแดง เขาออบซิเดียนเรืองส้ม ตาส้ม) · ชุดนักรบไวกิ้ง ผ้าคลุมขนสัตว์ข้างเดียว สนับแขนรูน · **ง้าวหัวเรือมังกร** (ใบง้าวเป็นหัวมังกรแบบหัวเรือไวกิ้ง คมหนึ่งเป็นน้ำแข็ง อีกคมร้อนแดง)
- ผสมธาตุ: ❄ หนาว 3 ขั้น = แข็งเป็นน้ำแข็ง (สตัน) · 🔥 ตีตัวที่แข็งอยู่ = แตกกระจาย (ดาเมจก้อนใหญ่)
- แปลงร่าง: **ตาชั่งอุณหภูมิ** −100 ↔ +100 บนตัวเรา สกิลไฟดัน + สกิลน้ำแข็งดึง − · ร้อนสุด = มังกรไฟ (สาย A) · เย็นสุด = มังกรน้ำแข็ง (สาย B) · เกจวิ่งข้ามเลข 0 = ไอน้ำระเบิดรอบตัว (มึน 0.5 วิ) → เลือกเอาว่าจะดันสุดทางเพื่อแปลง หรือสลับธาตุเก็บไอระเบิด
- A **มังกรเพลิงมุสเปล** (มังกรปีก ตัวเป็นหินหลอมเหลว): พ่นไฟเซิร์ต · กระพือปีกถ่าน · ดิ่งอุกกาบาต · ตะปบตัวที่แข็งให้แตก
- B **ลินด์เวิร์มนิฟล์ไฮม์** (งูมังกร 2 ขาหน้าตามนิทานนอร์ส ตัวเป็นธารน้ำแข็ง): ลมหายใจแช่แข็ง · ขดรัดน้ำแข็ง · พายุลูกเห็บ · ทุ่งคุกน้ำแข็ง
- เด่น: สีแดง–ฟ้าตัดกันชัดสุด เข้าใจง่ายสุด (ไฟ = ดาเมจ · น้ำแข็ง = สตัน) · ความยาก กลาง · **ชน:** หมาป่าสาย B ใช้น้ำแข็ง (Frost Fang / Ice Prison / Blizzard) · นอร์สมี 4 ตัวแล้ว

### แบบ 3 · อูเรอัสแห่งรา (Uraeus of Ra) — อียิปต์ · แสงอาทิตย์ ☀️ + พิษ 🐍 · ตัวเมีย
- ตำนาน: งูเห่าบนมงกุฎฟาโรห์ = "ดวงตาแห่งรา" พ่นไฟใส่ศัตรูของพระอาทิตย์ · ทุกคืนอาเปป (บอสใหญ่ของอียิปต์ `egyE2`) พยายามกลืนดวงอาทิตย์ ยูเรียสคือผู้ขวาง · เทพีวาเจตถูกวาดเป็นงูเห่ามีปีกอยู่แล้ว → เป็นมังกรได้เต็มตัว
- ลุค: งูเห่ามังกรกึ่งคน ตัวเมีย แม่เบี้ยแผ่ลายแถบน้ำเงินลาพิส–ทอง เขาสั้นทอง จานสุริยะเล็กกลางหน้าผาก ปีกขนนกพับเล็ก ๆ · ชุดลินินขาว ปลอกคอทองกว้างฝังคาร์เนเลียนแดง · **ดาบโคเปช** (ดาบเคียวสำริด จานสุริยะที่ด้าม)
- ผสมธาตุ: 🐍 พิษติดศัตรู 0–5 ขั้น · ☀ แสงตีตัวที่มีพิษ = จุดพิษระเบิดตามขั้น (A) · พิษเต็ม 5 = อัมพาต (B)
- แปลงร่าง: **ลอกคราบ** — พิษที่ไหม้ใส่ศัตรูเติมเกจ "เกิดใหม่" → เต็มแล้วกด: คราบเก่าทิ้งไว้เป็นหุ่นล่อ (มอนหันไปตี 3 วิแล้วระเบิด) เราผุดออกมาเป็นมังกร · **ร่างมังกรมีเกราะ HP ของตัวเอง** (เลเวล × 12) โดนตีหักเกราะก่อน อยู่ได้จนเกราะแตกหรือ 30 วิ = เล่นดีไม่โดนตีก็อยู่นาน
- A **อูเรอัสสุริยะ** (งูเห่ามังกรปีกทองลุกเป็นไฟ จานสุริยะหลังแม่เบี้ย): ลำแสงดวงตาแห่งรา · เขี้ยวสุริยะ · ปีกฟัน · จานสุริยะยักษ์ตกทับ
- B **งูเห่าราตรี** (งูเห่ามังกรปีกน้ำเงินลาพิส ลายดาวบนแม่เบี้ย พิษม่วงเรือง): แม่เบี้ยสะกดจิต (สตัน) · ถ่มพิษอัมพาต · ฝนพิษ · ขดรัด
- เด่น: ฮีโร่หญิง · หุ่นล่อตอนแปลง + ร่างอยู่นานด้วยฝีมือ ไม่ใช่เวลา · ความยาก กลาง · **ชน:** บาสเต็ต (อียิปต์ หญิง สายคำสาป) แต่ไม่มีพิษ / งู · อียิปต์มี 3 ตัว

### แบบ 4 · ซิวโคอาทล์ งูไฟคราม (Xiuhcoatl) — แอซเท็ก · ไฟสุริยะ 🔥 + ดวงดาว ✨
- ตำนาน: วิตซิโลโปชตลี เทพพระอาทิตย์–สงคราม ใช้ซิวโคอาทล์ งูไฟสีเทอร์คอยส์ ปราบพี่สาว (ดวงจันทร์) กับดวงดาวทิศใต้ 400 ดวง · ฮีโร่ = งูไฟที่หลุดจากมือเทพมาเป็นฮีโร่ พกไฟพระอาทิตย์กับพลังดวงดาวที่กลืนไว้ (กลางวัน + กลางคืน)
- ลุค: ทรงตามรูปสลักซิวโคอาทล์จริง **จมูกงอนม้วนขึ้นประดับวงดาว 7 ดวง** ลำตัวเป็นปล้องเกราะ หางปลายเป็นใบมีดรูปรังสีพระอาทิตย์ · เกล็ดแดง–ทอง โมเสกเทอร์คอยส์ (ฟ้าอมคราม ห้ามเขียว) · ชุดนักรบแอซเท็ก เกราะฝ้ายบุนวม ผ้าคลุมขนนกสีทองแดง · **แส้ไฟงู** (ยังไม่มีฮีโร่ไหนใช้แส้)
- ผสมธาตุ: ✨ ดาวปักลงพื้น (สูงสุด 5) โยงเส้นเป็นกลุ่มดาว · 🔥 ไฟวิ่งตามเส้น = ระเบิดทั้งรูป (A) / กลุ่มดาวปิดรูปครบ = ตรึงทุกตัวข้างใน (B)
- แปลงร่าง: **เก็บเกล็ด** — ตีโดนแล้วเกล็ดไฟครามหลุดลงพื้น เดินเก็บ (ดูดเข้าตัวในรัศมี 70 · AUTO เก็บให้) ครบ 12 = แปลง · วิ่งเก็บเก่งแปลงไว
- A **ซิวโคอาทล์ งูไฟแห่งพระอาทิตย์** (งูไฟยักษ์เกราะปล้องลุกไฟ 2 ขาสั้น): พุ่งทะลวงแบบหอก · หางรังสีกวาด · ระเบิดสุริยะ · มุดดินโผล่ใต้เป้า
- B **มิซโคอาทล์ งูเมฆทางช้างเผือก** (มังกรยาวตัวเป็นเมฆกลางคืนเต็มไปด้วยดาว): ตาข่ายกลุ่มดาว (ตรึง) · ฝนดาวตก · ดึงดาว (ดูดเข้าหา) · หลุมดาวดับ (สตันทั้งวง)
- เด่น: แส้ระยะกลาง เล่นเคลื่อนที่ · ลุคจากหินสลักแอซเท็กจริงไม่ซ้ำใคร · ความยาก กลาง–ยาก · **ชน:** เควตซัลโคอาทล์ (บอสใหญ่แอซเท็ก) เป็นงูเหมือนกันแต่เป็นงูขนนก ของเราเป็นงูไฟ / งูดาว ไม่มีขนนก · แอซเท็กมี 3 ตัว

### แบบ 5 · มังกรเอเธอร์ (Aether Drake) — รอยแยก (บ้านเมืองหลวง) · แสง ✦ + ความว่าง ◉
- ตำนาน: ลูกของแม่มังกรเอเธอร์ (มินิบอสในดันเจี้ยนรอยแยก rift3) ที่เดินออกจากรอยแยกมาอยู่ข้างผู้คน · ใช้ช่อง "ผู้หลุดมาจากรอยแยก" ที่ว่างอยู่ (ลิงย้ายไปญี่ปุ่นแล้ว)
- ลุค: มังกรกึ่งคนตัวเพรียว เกล็ดขาวมุกไล่เป็นม่วงอวกาศที่แขน หาง ปลายปีก มีจุดดาวในสีม่วง เขาผลึกใส ตาทองอ่อน · เกราะเบาขาว–ม่วงขอบทอง ผ้าคลุมด้านในเป็นท้องฟ้าดาว · **จักรวงแหวน** ลอยข้างมือ ขอบทอง ตรงกลางเป็นรอยแยกม่วงหมุนวน
- ผสมธาตุ: ✦ แสงติด "ประกาย" บนศัตรู · ◉ ความว่างดูดศัตรูเข้าหาจุด · ตัวที่มีประกายถูกดูดเข้าหลุม = ระเบิดแสง (A) / ศัตรูถูกอัดแน่นเป็นก้อน = หยุดนิ่งทั้งก้อน (B)
- แปลงร่าง: **เปิดรอยแยก** — เก็บพลังเอเธอร์ครบแล้วกดเปิดรอยแยกบนพื้นตรงที่ยืน ก้าวเข้าไปแล้วออกมาเป็นมังกร · **ร่างมังกรอยู่ได้เฉพาะในวงรอยแยก** (รัศมี 380 · ออกนอกวงเกิน 2 วิ = คืนร่าง · นานสุด 30 วิ) → ต้องเลือกจุดเปิดดี ๆ (ลากมอนเข้าวง / ยืนกลางลานบอส)
- A **มังกรปริซึม** (มังกรปีกผลึกใส หักเหแสง): ลำแสงปริซึมแตก 7 สาย · ดิ่งแสง · กรงเล็บดาวตก · ซูเปอร์โนวา
- B **มังกรหลุมดำ** (งูมังกรม่วงดำ มีวงแหวนแสงหมุนรอบตัวแบบหลุมดำ): หลุมโน้มถ่วง (ดูด + สตัน) · หยุดเวลา (ช้าลงจนนิ่ง) · ประตูรอยแยก (ย้ายศัตรูไปอีกจุด · บอสไม่ได้) · ขอบฟ้าเหตุการณ์
- เด่น: ธาตุที่ไม่มีฮีโร่ไหนมี · ร่างมังกรผูกกับพื้นที่ (เล่นตำแหน่ง) · ผูกเรื่องกับดันเจี้ยนรอยแยก · ความยาก กลาง–ยาก · **ชน:** ไม่มีตัวไหนใกล้ (มอนรอยแยกเป็นมังกรเอเธอร์ → ดีไซน์ให้เป็นญาติแต่คนละลุค)

### พรอมต์ภาพรวม (1 ภาพต่อแบบ: ฮีโร่ + มังกร 2 ร่าง ไว้เทียบกัน)
วิธีใช้: แชตใหม่ (แยกจากแชตชีตแบบ 1) → พรอมต์ภาพรวม 0 + แนบ **ภาพปกแคมป์ไฟ** + **ชีตฮีโร่ที่มีอยู่ 1 ตัว** → มันตอบ ready → ส่งแบบที่อยากเห็นทีละข้อความ · แบบ 1 ก็มีภาพรวมให้ จะได้เทียบบนหน้าตาแบบเดียวกัน

#### ภาพรวม 0 — กติกา
```
I will ask you for concept sheets of several DIFFERENT new dragon heroes for my cute cartoon fantasy MMORPG (animal heroes from Greek, Norse, Egyptian, Japanese and Aztec myths). Each hero is a young anthropomorphic dragon who can transform into a real dragon, and each of his two skill branches has its own dragon form. These rules apply to every sheet in this chat. Do not draw anything yet: reply only "ready", then draw ONE sheet each time I send a design. Every design is a completely new character: reuse nothing from earlier sheets in this chat.

Style: copy the first attached image (the game's key art) — friendly hand-painted chibi cartoon, thick clean dark-brown outlines (not black), cel shading with 2–3 flat tones, soft cartoon glow, bright and warm. Not realistic, not painterly, not 3D. The second attached image is an existing hero of the game: match its chibi body proportions, outline weight and finish, but do NOT copy that character. Every hero must look COOL and heroic, like a stylish action-game hero in chibi form, not a baby mascot. No green anywhere (the animation clips are cut from a green screen).

Every sheet: ONE wide image 1536×1024 on a plain soft cream background. No text, no labels, no names, no logo, no watermark.
Layout: LEFT HALF — the hero large, full body, three-quarter front view, in the pose the design gives. TOP RIGHT — his first dragon form, full body, in its action pose. BOTTOM RIGHT — his second dragon form, full body, in its action pose. Both dragon forms keep the identity marks the design lists, so they clearly read as the same character.
```

#### ภาพรวม แบบ 1 — มังกรเตาหลอม
```
Design 1 — "Forgeborn Drake", a Greek dragon hatched in the god Hephaestus's forge under the volcano Mount Etna; his blood holds FIRE and STONE. Hero: a chibi anthropomorphic young dragon: charcoal-black scales with thin glowing molten-orange seams, cream-white marble plates on the chest and belly, two swept-back bronze horns (a small gold ring engraved with an anvil on the left horn), amber eyes with slit pupils, two small folded wings, a sturdy tail. Greek smith outfit: a short off-white chiton, a dark-brown leather apron with bronze rivets, bronze bracers, a gold Greek-key belt, a bronze Greek-key collar. Weapon: a big two-handed forge hammer with one face glowing white-hot and molten, the other face carved white marble. Identity marks for both dragons: the bronze horns with the gold ring, the amber eyes, the Greek-key collar. Pose: swinging the hammer overhead, the molten face leaving an arc of fire.
TOP RIGHT — "Etna Magma Drake" (fire, damage): a lean, agile four-legged winged dragon of charcoal obsidian plates with glowing molten cracks, dark red wings, a tail ending in a hammer-head club; lunging forward breathing lava.
BOTTOM RIGHT — "Mountain Drake of Gaia" (stone, stun): a HUGE, burly, heavily muscled wingless dragon of cream marble and sandstone with glowing amber cracks and wisps of hot vapour, massive arms and stone fists, much bigger than the fire form; smashing both fists into the ground, a ring of stone spikes bursting up.
```

#### ภาพรวม แบบ 2 — มังกรเพลิงหิมะ
```
Design 2 — "Rimefire Drake", a Norse dragon born where fire and ice met at the dawn of the world. Hero: a chibi anthropomorphic young dragon split in two: one side of his body is frost (pale blue-white scales, a clear ice-crystal horn, an ice-blue eye), the other side is fire (charcoal-black scales with glowing ember cracks, a black obsidian horn glowing orange at the tip, an ember-orange eye). Viking warrior outfit: a dark leather jerkin with iron rivets, a grey fur mantle over the frost-side shoulder only, rune-carved iron bracers, a round iron belt buckle shaped like a coiled dragon, wrapped boots, a short braided mane. Weapon: a long glaive whose blade is a carved dragon head like the prow of a Viking longship, one edge rimed with frost, the other glowing red-hot. Identity marks for both dragons: the two-coloured eyes, the two horn shapes, the coiled-dragon emblem. Pose: a wide glaive swing, frost trailing from one edge and fire from the other.
TOP RIGHT — "Muspel Wyrm" (fire, damage): a winged western dragon whose body is cooling lava rock with glowing cracks, dark red wings edged with flame; breathing a stream of fire.
BOTTOM RIGHT — "Niflheim Lindworm" (ice, freezing control): a long wingless dragon with only two front legs and a serpent body of glacier ice, frosted blue-white scales, icicle spikes along the spine, freezing mist around it; exhaling a cloud of frost that freezes the ground.
```

#### ภาพรวม แบบ 3 — อูเรอัสแห่งรา
```
Design 3 — "Uraeus of Ra", an Egyptian cobra-dragon, the fire-spitting cobra on the pharaoh's crown. Hero: a chibi anthropomorphic young cobra-dragon WOMAN standing on two legs: a cobra head with a wide flared hood striped lapis-blue and gold, two short gold horns, a small golden sun disc on her forehead, warm amber eyes, two small folded feathered wings on her back (like the winged cobra goddess Wadjet), a slim tail. Outfit: a white linen dress, a wide gold-and-red carnelian broad collar, gold arm cuffs, a lapis-blue sash, gold sandals. Weapon: a bronze khopesh (curved sickle sword) with a small sun disc on the hilt. Identity marks for both dragons: the striped hood, the sun disc, the amber eyes, the broad collar. Pose: a graceful slash with the khopesh leaving a trail of golden sunlight.
TOP RIGHT — "Sun Uraeus" (sun, damage): a big winged cobra dragon of blazing gold and white-hot light, a huge sun disc behind its hood, feathered wings glowing like sunrise; spitting a stream of golden sun-fire.
BOTTOM RIGHT — "Night Cobra" (venom, hypnotic control): a big winged cobra dragon in deep lapis blue with tiny silver stars across its hood, the hood spread wide with two glowing gold eye-spots, violet venom dripping from its fangs; rearing up and staring.
```

#### ภาพรวม แบบ 4 — ซิวโคอาทล์
```
Design 4 — "Xiuhcoatl", the turquoise fire serpent that the Aztec sun god used to defeat the moon and the four hundred stars. Hero: a chibi anthropomorphic young fire-serpent dragon shaped like the Xiuhcoatl of Aztec stone carvings: a long snout that curls UPWARD at the tip with a row of seven small star circles on it, a body of segmented armour plates, a tail ending in a blade shaped like a sun ray, deep red and gold scales with turquoise mosaic plates (turquoise that leans blue, never green), amber eyes. Aztec warrior outfit: quilted white cotton armour with red trim, a gold sun-disc pectoral, gold ear spools, a short cape of copper-red feathers, sandals with ankle straps. Weapon: a long whip made of living flame shaped like a thin serpent with a small head at its tip. Identity marks for both dragons: the curled star snout, the segmented plates, the amber eyes. Pose: cracking the flame whip in a spiral above his head, small stars sparkling along it.
TOP RIGHT — "Xiuhcoatl, Fire Serpent of the Sun" (fire, damage): a long armoured fire-serpent dragon with gold-and-red segments, gold flames with blue-turquoise tips along its back, the sun-ray tail blade, two short clawed legs; diving forward like a thrown spear, flames streaming behind.
BOTTOM RIGHT — "Mixcoatl, Cloud Serpent" (stars, binding magic): a long flowing dragon whose body is deep night-blue cloud full of stars with a pale milky band down its back, the same curled snout with seven glowing star circles; coiling in the air around a net of glowing star lines.
```

#### ภาพรวม แบบ 5 — มังกรเอเธอร์
```
Design 5 — "Aether Drake", a young dragon who walked out of a magical rift between worlds. Hero: a slim, elegant chibi anthropomorphic young dragon: pearl-white scales fading to deep cosmic violet on the arms, tail and wing tips, with tiny star speckles in the violet, two clear crystal horns, glowing pale-gold eyes, small folded crystal-edged wings. Outfit: light white-and-violet armour with gold edges, a short asymmetric cape lined with a starry violet sky, gold arm bands. Weapon: a floating ring-blade (a chakram) with a gold edge whose open centre shows a swirling violet rift; it hovers beside his hand. Identity marks for both dragons: the crystal horns, the gold eyes, the white-to-violet colours with star speckles. Pose: throwing the ring-blade, which leaves a bright arc of light and a violet trail.
TOP RIGHT — "Prism Drake" (light, damage): a big winged dragon of clear crystal with a glowing white core, wings like shards of stained glass; breathing a beam of white light that splits into gold, orange, blue and violet rays (no green).
BOTTOM RIGHT — "Void Wyrm" (gravity, binding magic): a long dark-violet serpent dragon with a glowing pale-gold ring of light spinning around its body like the disc of a black hole; coiled around a small swirling black-violet sphere that bends the light around it.
```
