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

## หลังได้รูป (สำหรับ Claude)
- ไฟล์: assets/gems/page/bg.webp · ring.webp · sky.webp · land_norse/greek/egypt/japan/aztec.webp · sock_skill.webp · plaque.webp
- กรอบ: หาวงในด้วย least squares แบบ frame.webp เดิม แล้วตั้ง FR / HX / HY · ฐานเจม: หารูกลาง (cx, cy, r) ต่อรูป → CUP ต่อรูป
- ดาว C ตำแหน่ง i ใช้ฐานดินแดน i (เปิด Lv 60/70/80/90/99) ทุกฮีโร่ · หมาป่าเก็บฐานหูหมาป่าเดิมไว้เป็นตัวเลือกได้ถ้าเจ้าของอยาก
- กระเป๋าเจมทำเป็นแท็บ · ช่องรายละเอียดใช้แผ่นป้าย (border-image) · เช็กมือถือ 844×390
