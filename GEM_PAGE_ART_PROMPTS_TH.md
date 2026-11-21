# หน้าจัดการเจมใหม่ "ศาลโทเท็มวิญญาณ" — พรอมต์เจนรูป (2026-11-21)

เจ้าของ: "อยากได้หน้าจัดการเจมใหม่ ตอนนี้ไม่สวยเลย" + "ถ้าดีไซน์เกี่ยวกับโทเท็มก็ดี เพราะเป็นเนื้อเรื่อง"

## แนวคิด (ผูกเนื้อเรื่อง: เสาโทเท็มใหญ่แตก → ผู้เล่นแกะเจมจากเศษโทเท็ม แล้วสลักวิญญาณโทเท็มของตัวเองขึ้นใหม่)
- **ฉากหลังทั้งหน้า** = ศาลโทเท็มบนยอดเขาตอนกลางคืน มีตอเสาโทเท็มใหญ่ที่แตก ชิ้นส่วนลอยขึ้นฟ้ารอบแผง = "กำลังสร้างใหม่"
- **แผงกลม (ตราวิญญาณโทเท็ม)** = วงไม้แกะสลักบาง ๆ สวยขึ้น (แทนวงหนาลายซิกแซกแดงขาว) ข้างในเป็นท้องฟ้าดาว ไม่มีรูปสัตว์ ใช้ได้ทุกฮีโร่
- **ดาว C 5 ดวง = ฐานเจม 5 ดินแดน** (นอร์ส / กรีก / อียิปต์ / ญี่ปุ่น / แอซเท็ก) เปิด Lv 60 / 70 / 80 / 90 / 99 ตามลำดับ → ปลดดินแดนไปทีละดวง ตรงกับ "ฮีโร่จาก 5 ดินแดนในตำนาน"
- **ดาวสกิลวงใน** = หินโทเท็มสีเงินจันทร์ (เล็กกว่า เรียบกว่า)
- ฐานแปรสภาพ (ขอบรูน) / ฐานเจมเสริม (วงทอง) ใช้รูปเดิม
- ช่องรายละเอียด = แผ่นป้ายไม้แกะสลัก · กระเป๋าเจมเป็นแท็บ (สกิล / เจม C / แปรสภาพ / เสริม) แทนรายการยาว — ทำด้วยโค้ด

## วิธีเจน
- แนบรูป **campfire key art** (สไตล์) ทุกครั้ง · ฐานเจม (ข้อ 4–5) แนบ **gem_ref_sheet.png** (ฐานเดิม + เจม) ด้วย ให้ขนาดรูตรงกับเจม
- ส่งทีละพรอมต์ = 1 รูป · ส่งรูปกลับมาลำดับไหนก็ได้ (บอกเลขข้อ) · ถ้ารูปไหนพื้นหลังไม่โปร่งใส ส่งมาได้ ตัดให้เอง
- จะวัดวงในของกรอบ / รูเจมของแต่ละฐานเอง แล้ววางตำแหน่งดาวให้ตรง

## 1. ฉากหลังศาลโทเท็ม (แนวนอน)
```
Game menu background, landscape 1536x1024. The Totem Shrine at night on a mountain top: in the lower centre stands the broken stump of a giant ancient totem pole carved with many animal spirits, cracked and glowing gold-turquoise from inside; its broken carved pieces float up into the sky around the centre, each glowing softly as if being rebuilt. Behind them a huge starry night sky with green-teal aurora ribbons. On the far left and far right, tall dark totem poles, hanging feathers and warm paper lanterns frame the scene; the left and right thirds stay dark and simple (menu panels will cover them). The middle of the sky stays open and calm (a round game board will float there). Friendly hand-painted chibi cartoon style matching the attached campfire art: thick clean dark-brown outlines, cel shading with 2-3 flat tones, soft cartoon glow, warm lantern light against a cool night. Not realistic, not painterly smoke, not 3D. No characters, no text, no logo, no watermark.
```

## 2. กรอบแผงกลม (ตราวิญญาณโทเท็ม)
```
Game UI asset: one round frame for a totem spirit board, seen straight from the front, perfectly circular and centred. A slim carved totem ring: warm brown wood carved with small totem faces and feather patterns, a thin polished gold band on its inner and outer edge, five small turquoise gems spaced evenly around it, two short feathers hanging at the bottom. Slim and elegant: the ring band is about one tenth of the diameter. The inside of the ring is completely empty and transparent, and so is everything outside it. The ring fills about 90% of a square 1024x1024 image with empty space on every side, transparent PNG background. Friendly hand-painted chibi cartoon style matching the attached campfire art: thick clean dark-brown outlines, cel shading with 2-3 flat tones, soft cartoon glow, bright and warm. Not realistic, not 3D. No animals' full bodies, no text, no logo, no watermark.
```

## 3. ท้องฟ้าในแผง
```
Game UI asset: the night sky that fills the inside of a round totem board. Deep navy to violet sky, soft green-teal aurora ribbons near the top, many small sparkling white stars, soft lilac clouds along the bottom edge. The middle stays calm and fairly dark (glowing gems will sit on it). No animals, no spirits, no silhouettes, no characters. Square 1024x1024, the sky fills the whole square. Friendly hand-painted chibi cartoon style matching the attached campfire art: clean dark-brown outlines on the clouds, cel shading with 2-3 flat tones, soft cartoon glow. Not realistic, not 3D. No text, no logo, no watermark.
```

## 4. ฐานเจมหลัก 5 ดินแดน (ดาว C) — 5 รูป
แนบ campfire key art + gem_ref_sheet.png ทุกรูป · ทุกรูปโครงเดียวกัน ต่างแค่ลายดินแดน (ไม่มีหน้าสัตว์ที่เป็นฮีโร่: หมาป่า แมว จิ้งจอก สิงโต นกฮูก ฯลฯ)

### 4.1 นอร์ส (ดาว Lv 60)
```
Game UI asset: one gem socket for a totem spirit board, seen straight from the front, symmetrical and centred. A round empty gem hole in the middle, flat dark warm brown inside, about half the width of the whole piece, framed like a carved Norse totem: polished gold ring with silver knotwork, two small raven wings curving up on top, icy-blue rune stones on both sides, a carved wooden feather hanging below. Compact, it fits inside a square. The piece fills about 85% of a square 1024x1024 image with empty space on every side, transparent PNG background. Friendly hand-painted chibi cartoon style matching the attached art: thick clean dark-brown outlines, cel shading with 2-3 flat tones, soft cartoon glow, bright and warm. Not realistic, not 3D. No text, no logo, no watermark.
```
### 4.2 กรีก (ดาว Lv 70)
```
Game UI asset: one gem socket for a totem spirit board, seen straight from the front, symmetrical and centred. A round empty gem hole in the middle, flat dark warm brown inside, about half the width of the whole piece, framed like a carved Greek totem: white marble and gold ring with a Greek key pattern, a small golden laurel wreath around the top, two tiny white wings on the sides, a sky-blue gem drop hanging below. Compact, it fits inside a square. The piece fills about 85% of a square 1024x1024 image with empty space on every side, transparent PNG background. Friendly hand-painted chibi cartoon style matching the attached art: thick clean dark-brown outlines, cel shading with 2-3 flat tones, soft cartoon glow, bright and warm. Not realistic, not 3D. No text, no logo, no watermark.
```
### 4.3 อียิปต์ (ดาว Lv 80)
```
Game UI asset: one gem socket for a totem spirit board, seen straight from the front, symmetrical and centred. A round empty gem hole in the middle, flat dark warm brown inside, about half the width of the whole piece, framed like a carved Egyptian totem: gold and lapis-blue ring like a pharaoh's collar, two spread falcon wings on the sides, a small golden sun disc on top, turquoise beads hanging below. Compact, it fits inside a square. The piece fills about 85% of a square 1024x1024 image with empty space on every side, transparent PNG background. Friendly hand-painted chibi cartoon style matching the attached art: thick clean dark-brown outlines, cel shading with 2-3 flat tones, soft cartoon glow, bright and warm. Not realistic, not 3D. No text, no logo, no watermark.
```
### 4.4 ญี่ปุ่น (ดาว Lv 90)
```
Game UI asset: one gem socket for a totem spirit board, seen straight from the front, symmetrical and centred. A round empty gem hole in the middle, flat dark warm brown inside, about half the width of the whole piece, framed like a carved Japanese shrine totem: red lacquer and gold ring, a small torii-gate crest on top, white cloud scrolls on both sides, a tiny gold bell with a red tassel hanging below. Compact, it fits inside a square. The piece fills about 85% of a square 1024x1024 image with empty space on every side, transparent PNG background. Friendly hand-painted chibi cartoon style matching the attached art: thick clean dark-brown outlines, cel shading with 2-3 flat tones, soft cartoon glow, bright and warm. Not realistic, not 3D. No text, no logo, no watermark.
```
### 4.5 แอซเท็ก (ดาว Lv 99)
```
Game UI asset: one gem socket for a totem spirit board, seen straight from the front, symmetrical and centred. A round empty gem hole in the middle, flat dark warm brown inside, about half the width of the whole piece, framed like a carved Aztec totem: jade-green and gold stone ring with stepped Aztec patterns, green quetzal feathers fanning out on top, two small feathered-serpent heads on the sides, a gold sun pendant hanging below. Compact, it fits inside a square. The piece fills about 85% of a square 1024x1024 image with empty space on every side, transparent PNG background. Friendly hand-painted chibi cartoon style matching the attached art: thick clean dark-brown outlines, cel shading with 2-3 flat tones, soft cartoon glow, bright and warm. Not realistic, not 3D. No text, no logo, no watermark.
```

## 5. ฐานดาวสกิล (วงใน)
```
Game UI asset: one small round socket for the inner ring of a totem spirit board, seen straight from the front, centred. A carved round totem stone: pale moonstone-silver ring with a soft icy-blue glow, five tiny star points evenly around the rim, small carved notches like a talisman. The round empty hole in the middle is flat deep navy blue and takes about 65% of the width. Simple and light, calmer than a gold socket. It fills about 85% of a square 1024x1024 image with empty space on every side, transparent PNG background. Friendly hand-painted chibi cartoon style matching the attached art: thick clean dark-brown outlines, cel shading with 2-3 flat tones, soft cartoon glow, bright and warm. Not realistic, not 3D. No text, no logo, no watermark.
```

## 6. แผ่นป้ายไม้ ช่องรายละเอียด (ไม่บังคับ)
```
Game UI asset: an empty vertical wooden plaque that sits behind a menu panel, portrait 1024x1536. Dark warm wood carved like a totem panel: ornate carved corners with small feathers and turquoise studs, plain straight edges between the corners (so the middle can be stretched), and a large flat empty centre in dark parchment brown. Front view, centred, transparent PNG background around it. Friendly hand-painted chibi cartoon style matching the attached campfire art: thick clean dark-brown outlines, cel shading with 2-3 flat tones, soft cartoon glow, bright and warm. Not realistic, not 3D. No text, no logo, no watermark.
```

## ผลรอบแรก (2026-11-21) — ได้รูปครบ 10 รูป
- ใช้อยู่: bg.webp (พื้นหลังศาล), plq_top / plq_mid / plq_bot.webp (แผ่นป้ายไม้ ตัด 3 ส่วนจากรูป 1024×1536: แถว 0–460 / 460–1136 / 1136–1536; ไม้ด้านใน x 131–890, y 262–1240; ใช้เฉพาะจอสูง ≥ 521 px — มือถือแนวนอนยังเป็นแผงไม้เรียบ)
- วงแหวน ring.webp (ตัดขนนกที่ห้อยล่างออก วงในกลาง 616.8, 580.9 r 402.6 ของ 1254) + ท้องฟ้า sky.webp + ฐาน 5 ดินแดน land_*.webp + sock_skill.webp: ต่อเข้ากระดานแล้ว แต่เจ้าของบอก "ช่องใส่เจมตามธีมดูรก ไม่สวย" → ออกแบบใหม่เป็นเสาโทเท็ม (ข้อ 7–8) ไฟล์เดิมเก็บไว้ในโฟลเดอร์

## 7. เสาโทเท็ม (ช่องเจม C 5 ชั้น) — รอบสอง
เสาเดียวกลางหน้า 5 ชั้น ล่าง→บน หมี Lv60 · นกฮูก Lv70 · หมาป่า Lv80 · อินทรี Lv90 · นกสายฟ้า Lv99 ชั้นละหลุมใหญ่ 1 (เจม C) + ปีก/แขนข้างละ 2 หลุม (ในซ้าย = แปรสภาพ, นอกซ้าย = เสริม 1, นอกขวา = เสริม 2, ในขวา = แปรสภาพที่ 2 เมื่อเจมเลเวลตัน) ชั้นที่ยังไม่ถึงเลเวลเป็นเงาจาง
```
Game UI art for a gem-socket screen of a cartoon fantasy RPG. One tall carved wooden totem pole, straight front view, centred, on a fully transparent background, with empty space on every side. Portrait image 1024×1536.

The pole has exactly FIVE carved animal sections stacked on top of each other, from bottom to top:
1. Bear
2. Owl
3. Wolf
4. Eagle
5. Thunderbird at the very top, wings spread wide

Each section has ONE large empty round gem socket set into the middle of the animal (its forehead or chest — not replacing its eyes): a deep, dark, hollow round hole with a thin gold rim, completely empty inside.
Each section also holds out a short carved wing or arm to the left and to the right, and each wing/arm carries TWO small empty round gem sockets side by side (same look: dark hollow hole, thin gold rim, empty).
So every section has 1 large socket + 4 small sockets — 25 sockets in total. All sockets are perfectly round, face the viewer and are completely empty. All large sockets are the same size and sit on the centre line of the pole; all small sockets are the same size.

The five sections are evenly spaced, the same height, and clearly separated by thin carved bands. The bottom of the pole ends in a plain round wooden foot.
Warm brown carved wood with painted details in red, teal and cream, small gold trims and a few teal beads. Clean and tidy: no hanging feathers, no ropes, no lanterns, no glowing gems, nothing extra.

Style: friendly hand-painted chibi cartoon matching the attached game art, thick clean dark-brown outlines, cel shading with 2–3 flat tones, soft cartoon glow, bright and warm. Not realistic, not painterly, not 3D. No text, no logo, no watermark.
```

## 8. แท่นหินฐานเสา (ดาวสกิล Lv 10–50) — รอบสอง
หลุมใหญ่ 5 = ดาวสกิล · หลุมเล็กใต้ขอบขวาของแต่ละหลุม = เจมแปรสภาพของดาวสกิลนั้น
```
Game UI art for a gem-socket screen of a cartoon fantasy RPG. A wide round carved stone platform for a totem pole to stand on, seen from a 3/4 top-down view (a flat wide ellipse with its thick front side visible), centred, on a fully transparent background, with empty space on every side. Landscape image 1536×1024.

The flat top surface has a plain round carved circle in the middle where a totem pole will stand — keep it empty, do not draw a pole.
On the front side of the platform there are FIVE large empty round gem sockets in a gentle curve, evenly spaced and the same size: deep, dark, hollow round holes with a thin pale moonstone-silver rim, completely empty inside, facing the viewer. Next to each large socket, just below its right edge, there is one small empty round socket with a thin gold rim.

Grey-blue stone with carved spirals and zigzags painted teal and cream, small gold trims, a little snow along the top edge. Clean and tidy, nothing else on it.

Style: friendly hand-painted chibi cartoon matching the attached game art, thick clean dark-brown outlines, cel shading with 2–3 flat tones, soft cartoon glow, bright and warm. Not realistic, not painterly, not 3D. No text, no logo, no watermark.
```
วิธีเจนรอบสอง: แนบรูปกองไฟ + รูปพื้นหลังศาล (bg) เป็นแบบสไตล์ · ถ้าจำนวนหลุมผิด ใช้แปรงเลือกเฉพาะชั้นนั้นแล้วสั่งแก้

## หลังได้รูปเสา (สำหรับ Claude) — ทำแล้ว 2026-11-21
- ได้รูปแล้ว: assets/gems/page/totem.webp (1024×1536, 25 หลุม ครบ) + base.webp (1536×1024, หลุมใหญ่ 5 + เล็ก 5) · ตารางวัดด้วย `python3 tools/gems/totlay.py assets/gems/page/totem.webp assets/gems/page/base.webp 766 339 1500 1140 885 625 362` (จุดยืน = กลางวงทองบนแท่น · ตีนเสา 1500 · เส้นแบ่งชั้นที่แถบแกะสลัก) แล้ววางใน `const TOT=` ของ totem_gems.js
- จัดวาง: เสาย่อ/ขยาย 1.25 เท่าของแท่น (ตีนเสาพอดีวงทอง) เต็มความสูงกระดาน · จอเตี้ย (มือถือแนวนอน) = เสาเต็มความกว้างคอลัมน์ เลื่อนขึ้นลง เปิดมาอยู่ล่างสุด
- แตะหลุมว่างก่อนแล้วแตะเจมในกระเป๋าก็ใส่ได้เลย (เดิมต้องเลือกเจมก่อน)
### บันทึกตอนเตรียมโค้ด
- โหมดเสาใน totem_gems.js พร้อมแล้ว แค่ยังปิด (`const TOT=window.__TOT||null`): ทดสอบด้วยรูปหลอก ph_totem / ph_base (ไม่ commit) ผ่าน add_init_script('window.__TOT=…')
- ขั้นตอน: แปลงรูปเป็น assets/gems/page/totem.webp (สูง ~1536) + base.webp → `python3 tools/gems/totlay.py assets/gems/page/totem.webp assets/gems/page/base.webp [standX standY]` (stand = จุดที่ตีนเสาวางบนแท่น ดูจากรูป) → วางผลแทน `null` ใน `const TOT=` → เช็กภาพ (เดสก์ท็อป + 844×390, ต้น / เต็ม, หมาป่า + แมว) → ลบไฟล์ ph_*
- holes.py หาหลุม = พื้นที่มืดกลม (alpha > 200, ความสว่าง < 70) หลังตัดเส้นขอบบางๆ ออก · totlay.py แยก 5 ชั้นจากหลุมใหญ่ 5 อัน (ล่าง→บน) แล้วจับหลุมเล็กซ้าย 2 ขวา 2 ต่อชั้น ถ้า assert ไม่ผ่าน = รูปมีหลุมไม่ครบ → แก้รูปหรือเติมหลุมเองในตาราง
- ในเกม: ชั้น i = ช่อง C i (หลุมใหญ่ = เจมหลัก, ในซ้าย = แปรสภาพ, นอกซ้าย/นอกขวา = เสริม, ในขวา = แปรสภาพที่ 2) · หลุมใหญ่บนแท่น = ดาวสกิล, หลุมเล็ก = แปรสภาพของดาวสกิล · ชั้นที่ยังไม่ถึงเลเวล = เสาส่วนนั้นเป็นวิญญาณสีฟ้าจาง (clip-path ต่อชั้น) · วงแหวน / ท้องฟ้า / เส้นกลุ่มดาวซ่อน · แสงในหลุมที่มีเจม + ประกายลอยขึ้นตามเสาส่วนที่สร้างแล้ว

## หลังได้รูปรอบแรก (สำหรับ Claude, ทำแล้ว)
- ไฟล์: assets/gems/page/bg.webp · ring.webp · sky.webp · land_norse/greek/egypt/japan/aztec.webp · sock_skill.webp · plaque.webp
- กรอบ: หาวงในด้วย least squares แบบ frame.webp เดิม แล้วตั้ง FR / HX / HY · ฐานเจม: หารูกลาง (cx, cy, r) ต่อรูป → CUP ต่อรูป
- ดาว C ตำแหน่ง i ใช้ฐานดินแดน i (เปิด Lv 60/70/80/90/99) ทุกฮีโร่ · หมาป่าเก็บฐานหูหมาป่าเดิมไว้เป็นตัวเลือกได้ถ้าเจ้าของอยาก
- กระเป๋าเจมทำเป็นแท็บ · ช่องรายละเอียดใช้แผ่นป้าย (border-image) · เช็กมือถือ 844×390
