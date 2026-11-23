# หมวกแฟชั่น — รูปแบบภาพ + พรอมต์ (2026-11-23)

เจ้าของถาม 'พวกหมวกต้องเจนรูปแบบไหน' → ไฟล์นี้ = กติกาภาพหมวก + พรอมต์ ChatGPT + สิ่งที่โค้ดต้องทำเมื่อได้ภาพ

## 1. เกมใช้ภาพหมวกยังไง (ของที่มีอยู่แล้ว)

- หมวก 1 ใบ = ภาพ 5 มุม: หน้า (S) · เฉียงหน้าหันขวา (SE) · ข้างหันขวา (E) · เฉียงหลังหันขวา (NE) · หลัง (N)
  อีก 3 ทิศฝั่งซ้าย (SW W NW) เกมกลับภาพเอง (`isMir`) → ไม่ต้องวาด
- `drawFashion` ใน fashion.js วางภาพของมุมนั้นบน "จุดหัว" ที่ track ไว้ทุกเฟรมของสไปร์ท (`FASHION.head[state][dir][frame]` ใน assets_fashion.js)
  + เลื่อนตาม `off` ต่อมุม + ขนาด `size × scale` ทั้งใบ → หมวกเลื่อนตามหัวทุกเฟรม แต่ไม่หมุนตามหัว
- วาดทับตัวทั้งใบ แล้ว `harmonized()` ใส่เส้นขอบเข้มรอบชิ้น + เกรดสีให้เข้ากับตัว/ฉาก
- ตัวอย่างที่ใช้ได้แล้ว: หมวกเขาไวกิ้ง (`vikinghelm` → `FASHION.items.viking`, รูป 300×300 ต่อมุม, scale .84, off y −14)
- ใส่ได้เฉพาะหมาป่าตอนนี้ (ตัวเดียวที่มีจุดหัวทุกเฟรม)

## 2. กติกาภาพ (บอกเจ้าของ)

1. 1 รูป = หมวก 1 ใบ เรียง 5 มุมแถวเดียว ลำดับเดียวกับบอร์ดหัว
2. ทุกมุมขนาดเท่ากัน ขอบล่างของหมวกอยู่ระดับเดียวกัน เว้นช่องว่างระหว่างมุม (โค้ดแยกมุมจากช่องว่าง)
3. วาดหมวกอย่างเดียว — ไม่มีหัว หน้า หู ผม หรือหุ่น
4. ไม่มีอะไรห้อยต่ำกว่าขอบหมวก (สายรัดคาง ริบบิ้นยาว ผ้าคลุม ผม) — เกมวาดหมวกทับตัวทั้งใบ ส่วนที่ห้อยลงจะไปทับหน้า
5. หูหมาป่า เลือกต่อใบ:
   - **A ใหญ่ครอบหูมิด** (หมวกเหล็ก หมวกใหญ่) แบบหมวกไวกิ้ง
   - **B เล็ก นั่งบนหัวระหว่างหู** (มงกุฎ หมวกใบจิ๋ว พวงดอกไม้) หูโผล่สองข้างเอง
   - หมวกเจาะรูให้หูโผล่ = ยังทำไม่ได้ (ต้องเขียนโค้ดวาดหูทับหมวกก่อน)
6. มองเฉียงจากบนนิดๆ แบบบอร์ด · แสงจากซ้ายบนทุกมุม
7. พื้นเขียวล้วน #00FF00 (หมวกมีสีเขียว → ชมพูบานเย็น #FF00FF) · ไม่มีเงาบนพื้น แสงฟุ้ง ประกาย ตัวหนังสือ ตัวเลข
8. แนบ 2 ไฟล์: ภาพคีย์อาร์ตกองไฟ (สไตล์) + `tools/ref/hat_ref_wolf.png` (หัวหมาป่า 5 มุม = มุมกล้อง + ขนาด)
   ทำบอร์ดใหม่ได้ด้วย `python3 tools/hat_board.py wolf` (เกมต้องเปิดที่ 8765)
9. หลายใบ: ส่งพรอมต์ครั้งแรกพร้อมไฟล์แนบ ใบต่อไปในแชตเดิมพิมพ์ `next: <หมวกใบใหม่> · fit A/B`

## 3. พรอมต์ (ก๊อปทั้งกล่อง แก้ 2 บรรทัดในวงเล็บ เขียนไทยได้)

```
Attached: (1) the campfire key art = the drawing style, (2) hat_ref_wolf.png = the hero's head from 5 angles.

Draw ONE costume hat for this hero: [describe the hat, e.g. "a red-lacquered samurai kabuto helmet with a small gold crescent crest"].
Fit: [A = a big hat or helmet that completely covers both pointed wolf ears / B = a small hat or crown that sits on top of the head between the two ears].

Layout: wide landscape image (3:2). One horizontal row of 5 views of the SAME hat, left to right in exactly the order and angles of the head board: 1 front, 2 front three-quarter turned to the right, 3 side view facing right, 4 back three-quarter turned to the right, 5 back. Same size and scale in every view, the bottom rims level on one line, wide empty gaps between the views. Seen from slightly above, like the head board, and sized to fit that head.

Draw ONLY the hat: no head, no face, no ears, no hair, no mannequin, nothing inside the opening. Nothing hangs below the rim: no chin straps, long ribbons, veils, hair or cloth flaps.

Style: friendly hand-painted chibi cartoon matching the attached art, thick clean dark-brown outlines, cel shading with 2-3 flat tones, bright and warm, soft light from the upper left in every view. Not realistic, not painterly, not 3D.

Background: flat solid pure green #00FF00 (if the hat has green parts, use flat magenta #FF00FF instead). No shadow on the ground, no glow, no sparkles, no text, no numbers, no logo, no watermark.
```

## 4. ฝั่งโค้ดเมื่อได้ภาพ (ยังไม่ได้ทำ)

1. คีย์พื้นเขียว/บานเย็น → แยก 5 มุมจากช่องว่างแนวตั้ง → `assets/fashion/hats/<key>_<S|SE|E|NE|N>.webp` (ตัดชิดขอบ วางกลางช่องสี่เหลี่ยม)
2. วัดต่อมุม: ความกว้างขอบล่าง + ตำแหน่งขอบล่าง → `scale` ทั้งใบ (จากมุมหน้าเทียบความกว้างหัว แบบ A ต้องกว้างพอปิดหู) + `off` ต่อมุมให้ขอบล่างอยู่ระดับคิ้ว
3. ลงทะเบียน: `FASHION.items[key] = {size, scale, off, img:{S:'assets/fashion/hats/…', …}}` (ใส่ path ได้ — `fashImgOf` ใช้ `Image.src`) + `FASH_VIS[<costume id>] = key` + รายการใน `COSTUME_ITEMS` (slot `top`)
4. เช็คทุกเฟรม idle / walk / attack / buff / hurt × 8 ทิศ เป็นภาพ แล้วส่งให้เจ้าของดู
5. ฮีโร่อื่น: ต้อง track จุดหัวต่อเฟรมก่อน (งานโค้ด ไม่ต้องเจนภาพ) · แมว (กาสะ) ฮิปโป (เนเมส) จากัวร์ (ขนนก) แอคเซอลอท (มงกุฎ) มีของบนหัวอยู่แล้ว → ใส่ได้แค่ชิ้นเล็ก/ของลอย · มังกร แรด มีเขา · 6 ตัวที่ยังใช้สไปร์ทหมาป่าชั่วคราว (จิ้งจอก บาสเตต อนูบิส สิงโต จระเข้ อีกา) + แกะ รอสไปร์ทจริง

## 5. ทางเลือก: หมวกวาดด้วยโค้ด (2026-11-23 11:24 เจ้าของถาม 'เจนภาพมาได้ไหมจะได้สวยๆ')

ในแชตนี้ไม่มีเครื่องมือเจนภาพแบบ ChatGPT → วาดด้วยโค้ดแทน: `fashion_hats.js` (โหลดต่อจาก fashion.js เฉพาะหมาป่า)
- หมวก = ชิ้น 3D เล็กๆ (ใบไม้ ขนนก แถบผ้า เหรียญ) บนกรอบหัว 3 มิติของ fashion.js (`headFrame` → `COSTUME`), เรียงตามความลึก
  ชิ้นที่อยู่หลังหัว (d < −6) วาดก่อนตัวละคร → หัวบังเอง · ถูกทุก 8 ทิศ ทุกเฟรม · ขยับได้ (ขนนกไหว ประกายวิ่ง) · ไม่ต้องตัดภาพ
- ลุค: สีเรียบ 2–3 โทนตามแสงซ้ายบน + เส้นน้ำตาลเข้ม (`shade` / `tone` / `blade` ใน fashion_hats.js)
- ทำแล้ว 2 ใบ (แทนภาพวาดเดิมแบบโค้ดเก่าจาก Aetherfall ของไอเทมเดิม ชื่อ / ค่าเดิม):
  `laurel` มงกุฎลอเรลทอง (ใบทองรอบหัวใต้หู + โบว์แดงข้างหลัง) · `quetzalcrown` มงกุฎขนนกเควตซัล (แถบเทอร์ควอยซ์ขอบทอง + เหรียญสุริยะหยกที่หน้าผาก + พัดขนนก 11 เส้นหลังหู)
- ไอคอนในตู้เสื้อผ้า = วาดจากหมวกจริง (`hatIcon`) · `?toonhat=0` = ภาพโค้ดเก่า (เทียบ) · `window.TOON_HATS {TOON, OLD}`
- เทียบกับภาพวาด: โค้ดหมุนถูกทุกทิศและซ่อนส่วนหลังหัวได้ แต่ลายละเอียดน้อยกว่าภาพวาดจาก ChatGPT
- เพิ่มใบใหม่: เขียน `TOON.<id>=(H,t)=>[…parts]` แล้วใส่ id ของไอเทมเดิม (หรือเพิ่มไอเทมใน FITEMS) · ทดสอบ: /home/claude/work/hat oldnew.py (เก่า/ใหม่ 8 ทิศ), ingame.py (ในเกม), wr2.py (ตู้เสื้อผ้า)

## 6. พรอมต์: มงกุฎขนนกเพลิง (Sunfire Plume Crown) — 2026-11-23 12:21

เจ้าของส่งรูปตัวอย่างหมวกจากเกมอื่น (คาดทอง + พลอยแดง + พัดขนนกสีเพลิง) → เขียนเป็นดีไซน์ของเราเอง ไม่แนบรูปตัวอย่างให้ ChatGPT (จะลอกของเกมอื่น)
แนบ: คีย์อาร์ตกองไฟ + tools/ref/hat_ref_wolf.png · ภาพวาดแปะทับตัวทั้งใบ → ขนนกที่อยู่หลังหัวจะทับหู จึงสั่งให้พัดขนนกบังหูมิด (แบบ A)

```
Attached: (1) the campfire key art = the drawing style, (2) hat_ref_wolf.png = the hero's head from 5 angles.

Draw ONE original costume hat for this hero: a "Sunfire Plume Crown". A gold circlet worn around the forehead, engraved with small sun-ray patterns, with a raised gold sun-ray crest at the front holding one red teardrop ruby, and small gold plates with tiny ruby studs at the temples. From the back half of the circlet rises a tall, lush fan of about eleven long feathers, swept slightly back and curling at the tips like flames, coloured deep crimson at the base, then orange and warm gold, with pale cream tips, each feather with a thin light quill line.
Fit: the circlet sits around the head at the forehead; the feather fan is full enough to completely hide both pointed wolf ears from every angle.

Layout: wide landscape image (3:2). One horizontal row of 5 views of the SAME crown, left to right in exactly the order and angles of the head board: 1 front, 2 front three-quarter turned to the right, 3 side view facing right, 4 back three-quarter turned to the right, 5 back. Same size and scale in every view, the bottom of the circlet level on one line, wide empty gaps between the views. Seen from slightly above, like the head board, and sized to fit that head.

Draw ONLY the crown, as if it sits on an invisible head: no head, face, ears or hair, and wherever the head would be, leave plain background — the inside of the circlet and the parts the head would hide are not drawn. Nothing hangs below the circlet: no chin straps, ribbons or chains.

Style: friendly hand-painted chibi cartoon matching the attached art, thick clean dark-brown outlines, cel shading with 2-3 flat tones, bright and warm, soft light from the upper left in every view. Not realistic, not painterly, not 3D.

Background: flat solid pure green #00FF00. No shadow on the ground, no glow, no sparkles, no fire, no text, no numbers, no logo, no watermark.
```
