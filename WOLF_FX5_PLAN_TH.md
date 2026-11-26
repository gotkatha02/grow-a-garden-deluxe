# หมาป่า — เอฟเฟคสกิลชุดใหม่ (v5)
เจ้าของสั่ง 2026-11-25 21:26 “ทำเอฟเฟคสกิลใหม่ให้หมาป่าหน่อย อันไหนที่ควรเจนรูปก็ไม่ต้องทำแต่ส่งเป็นพร้อมมาแทน”
- สกิลที่วาดด้วยโค้ดได้สวย (ฟัน ระเบิด พื้นแตก น้ำแข็ง สายฟ้า พุ่ง) **ทำใหม่แล้ว 20 สกิล + ตีปกติ** ในไฟล์ `wolf_vfx5.js` (ใช้ชุดเครื่องมือ FXLIB ตัวเดียวกับอนูบิส)
- สกิลที่ควรเป็นภาพวาด (วิญญาณ ของที่เรียกออกมา ภาพบัฟ) **ใช้ภาพวาดชุดใหม่ 5 ภาพของคุณแล้ว** (2026-11-26, ข้อ 4b) · `?wpic=0` = ภาพชุดเก่า
- คลิปวิดีโอที่คุณทำเอง 6 สกิล + พายุ Blizzard ที่คุณเลือกไว้ **ไม่ได้แตะ**
- เปิดเกมด้วย `?wfx5=0` = หน้าตาก่อนชุดนี้ (เทียบกันได้ทุกเมื่อ)

## 1. หน้าตาของชุดใหม่

| ส่วน | สี / ลาย |
|---|---|
| ตีปกติ + สกิลพื้นฐาน | เหล็กน้ำเงินแบบเส้นรูนบนคมขวานของตัวละคร |
| สาย A Berserker | เสี้ยวสีเลือดขอบขาวร้อน · รอยกรงเล็บ 3 เส้น · เลือดเป็นเส้นสาดแล้วค้างเป็นแอ่งบนพื้น · ห่วงโซ่ Gleipnir ขาด |
| สาย B Runic | เขี้ยวน้ำแข็ง · วงรูนสลักและอักษรรูน · สายฟ้าสีม่วงน้ำเงิน |

หลักที่ใช้: รูปทรงสีทึบอิ่มสี + แกนขาว + เงาเข้มรองใต้ทุกชิ้น (อ่านออกบนหิมะ) · แสงเรืองน้อย เพราะบนหิมะแสงเรืองจะกลายเป็นก้อนขาว · ไม่ใช้จุดกลม · ชิ้นน้อยต่อสกิล ท่าตัวละครยังเห็นชัด

## 2. สกิลที่ทำใหม่ (โค้ด)

| สกิล | เอฟเฟคใหม่ |
|---|---|
| ตีปกติ (Wolf Combo) | คมขวานสีเหล็กน้ำเงินวาดตามหัวขวานของสไปรต์จริง · จังหวะปิดหนาขึ้น · โดน = รอยฟัน + ประกายเหล็ก |
| Battle Step | เส้นความเร็ว 3 เส้นตามทางพุ่ง + ฝุ่นหิมะตอนออกตัวและตอนหยุด (ภาพเงาตัวเดิมยังอยู่) |
| Reversal Slash | คมขวานกว้างสีเหล็กน้ำเงิน |
| Armor Break | คมขวานหนา · โดน = ดาวเหล็ก เศษแผ่นเกราะกระเด็นตกพื้น รอยร้าวใต้เป้า |
| Blood Cleave (+Savage Echo) | เสี้ยวสีเลือดขอบขาวร้อนตามหัวขวาน + คลื่นเสี้ยววิ่งไปตามพื้นบอกระยะกรวย · ฟันซ้ำ (Echo) เป็นเสี้ยวที่สอง · โดน = รอยฟัน เลือดเป็นเส้นสาด แอ่งเลือดค้างบนพื้น 2.4 วิ |
| Savage Rend | รอยกรงเล็บเฟนริล 3 เส้นขนานบนตัวเป้า · RUPTURE = ดาวเลือดระเบิด + แอ่งเลือดใหญ่ |
| Axe Dance | 6 จังหวะ วาดคนละระนาบรอบตัว (เฉียงขึ้น เฉียงลง หมุนรอบ ตวัดกลับ …) · ปิดด้วยเสี้ยวตั้ง + หอกแทงไปข้างหน้า |
| Revenge Breaker | เสี้ยวทอง + คลื่นทองตามพื้น · โดน = ดาวทอง ห่วงโซ่ขาดกระเด็น รอยร้าวทอง |
| Vampiric Axe | เสี้ยวสีชมพูเลือด · โดน = ก้อนเลือด 3 ก้อนโค้งกลับเข้าตัว แล้ววงฟื้นพลัง + หัวใจลอยขึ้น |
| Blood Rush | ลำสีเลือดตามทางพุ่ง + เลือดหยดตามทาง · โดน = รอยฟันยาวแนวนอน + วงฟื้นพลัง |
| Predator's Leap | ลงพื้น = รอยเล็บร้อนแดง 3 แนวบนพื้น วงกระแทก ฝุ่นหิมะ · โดน = รอยกรงเล็บ 3 เส้น |
| Frost Fang | เสี้ยวน้ำแข็ง แล้วเขี้ยวน้ำแข็งผุดเป็นแถววิ่งไปหาเป้า (ผุดตามคลื่นที่ทำดาเมจจริง) · โดน = ดาวน้ำแข็ง |
| Ice Break | โดน = ดาวน้ำแข็งใหญ่ วงกระแทก หนามน้ำแข็ง 5 แท่งแตกออกด้านหลังเป้า |
| Rune Burst | วงรูนสลักสว่างรอบตัว 2 ชั้น + อักษรรูน 8 ตัวพุ่งออกรอบทิศ |
| Thunder Fang | เสี้ยวสายฟ้าสีม่วงน้ำเงิน แล้วฟ้าผ่าลงตรงเป้า: รอยไหม้ รอยร้าว ดาวบนพื้น · โดน = สายฟ้าเล็กแลบรอบตัวเป้าครึ่งวินาที |
| Lightning Pursuit | สายฟ้าสองเส้นผูกจุดเริ่มกับตัวหมาป่าตลอดการพุ่ง + เสี้ยวสายฟ้าตอนถึง |
| Storm Step | เหมือนกัน: สายฟ้าตามตัวจนสุดทาง วงกระแทกที่จุดเริ่มและจุดจบ |
| Thunder Spear | วงรูนชี้เป้าขึ้นก่อน · หอกสายฟ้าออกจากหัวขวานพุ่งถึงเป้าพร้อมดาเมจ · ฟ้าผ่าซ้ำ รอยร้าว อักษรรูน |
| Rune Storm | วงรูนสลักใหญ่เท่าพื้นที่จริง อักษรรูน 6 ตัวลอยวนรอบวง (ครึ่งหลังอยู่หลังตัวละคร) ฟ้าผ่าในวง · ระเบิดปิด = วง 2 ชั้น + ฟ้าผ่าใหญ่ + รูนกระเด็น |
| Frozen Descent | วงรูนชี้จุดตก · ผลึกยักษ์ตกถึงพื้น = ระเบิดน้ำแข็ง หนาม 7 แท่งผุดรอบจุดตก รอยร้าว (พายุหิมะรอบๆ เป็นของ Blizzard เดิม) |

จังหวะ: เสี้ยวทุกอันคือท่าเหวี่ยงของเกมเอง (วาดตามหัวขวานของสไปรต์ จบที่เฟรมโดน) แค่เปลี่ยนหน้าตา · รอยบนตัวเป้ามาจากดาเมจจริง · ชิ้นบนพื้นใช้ตำแหน่งและเวลาของชิ้นเดิมที่เกมสร้าง ณ ตอนนั้น

## 2b. สกิลที่ทำเพิ่ม 2026-11-26 (เจ้าของ "ทำต่อเลย") — ครบทุกสกิลกดใช้แล้ว

| สกิล | เอฟเฟกต์ใหม่ |
|---|---|
| Iron Counter | กำแพงแสงรูนเหล็กโค้งตั้งอยู่ด้านหน้าตลอดที่ตั้งรับ (อยู่หลังตัวเมื่อหันขึ้น) อักษรรูน 3 ตัวบนกำแพง วงที่เท้า · ปัดสำเร็จ = กำแพงวาบ ประกายเหล็กพุ่งใส่ผู้โจมตี คลื่นกระแทก วงขยาย (แทนภาพ w09 ที่บังตัว) |
| Cyclone Leap | ตอนลอย = เสี้ยวส้มแดง 3 ชั้นหมุนรอบตัวไล่ขึ้นเป็นกรวย + ฝุ่น · ตอนลง = เสี้ยวหมุนเต็มวงบนพื้น 2 ชั้น รอยร้าวร้อน วง 2 ชั้น หินกระเด็น (แทนภาพ w45 / w44 และหินภาพ) |
| Ravenous Leap (C) | วงรูนเฟนเรียร์ที่จุดกระโดด · วงรูนใหญ่เท่าพื้นที่จริงที่จุดลงตั้งแต่ลอยขึ้น · ขวานวิญญาณสีฟ้าของเดิมยังอยู่ · ลง = ระเบิดน้ำแข็ง รอยร้าว วง 2 ชั้น อักษรรูนกระจาย หนามน้ำแข็งผุดรอบวง (แทนวงกลมฟ้า จุดกลม ภาพหลุม) |
| Fenrir's Spirit (C) | วงรูนสลักใต้เท้า → เสาแสงเย็น วง 2 ชั้น หนามน้ำแข็ง 8 แท่งล้อมตัว อักษรรูนกระจาย → เฟนเรียร์ (สไปรต์เดิม) ออกมา · ทุกครั้งที่มันกัด = รอยเล็บน้ำแข็ง 3 เส้น + เศษน้ำแข็ง + อักษรรูนลอย |
| War Fury | วงรูนสีเลือดใต้เท้าตอนร่าย → วง 2 ชั้น + แฉกบนพื้น + เส้นพลังพุ่งขึ้น + อักษรรูน (ไม่มีไฟ ตามที่เจ้าของสั่งไว้ ตัวแดงเหมือนเดิม) |

ทั้งชุดใหม่: จุดกลมๆ ที่ดูดเข้าตัวตอนตั้งท่า (feel pass) ไม่ขึ้นแล้วในทุกสกิลของไฟล์นี้ · แสงขาวกว้างใต้เท้าตอนตั้งท่าไม่ขึ้นใน 5 สกิลนี้ (บนหิมะมันเป็นปื้นขาว)
ตรวจ: จังหวะโดนของ ironCounter → revengeBreaker · cycloneLeap · ravenousLeap · fenrirsSpirit · warFury เท่ากับ ?wfx5=0 (seed 7 + โดนแน่นอน) · herosweep = 7 ข้อเดิม · leak คงที่ · คลิป `DSF=1.5 python3 tools/fx/wfclip.py rest`

## 3. สกิลที่ใช้ภาพวาด / คลิป (ไม่ได้วาดด้วยโค้ด)

| สกิล | ตอนนี้ใช้ | ภาพใหม่ (2026-11-26) |
|---|---|---|
| War Howl | หัวหมาป่าวิญญาณสีขาวหอนอยู่หลังหัวฮีโร่ + คลื่นบัฟทอง | n03 ✓ |
| War Fury | ตัวแดง (เคลือบสี) — ตอนร่ายเป็นโค้ดแล้ว ดูข้อ 2b | - |
| Executioner | ขวานผีสีแดงลอยเหนือเป้าแล้วฟันลง + รอยฟัน / ตรากะโหลกเดิม | n01 ✓ |
| Valhalla's Wrath | ประตูเดิม · ขวานทองเหวี่ยงตามทุกครั้งที่ฟัน (ภาพไม่มีแสง) · ขวานทองพร้อมลำแสงตกกลางวง · รอยฟันทองเดิม | n02 ✓ |
| Rune Guard | โล่รูนน้ำแข็ง 3 ใบลอยวนรอบตัว | n05 ✓ |
| War Banner | ธงศึกปักบนกองหินที่จุดเป้า | n04 ✓ |
| Fenrir's Spirit | สไปรต์วิญญาณหมาป่าที่มีอยู่แล้ว (ตัวมันเอง) — ตอนเรียกและรอยกัดเป็นโค้ดแล้ว ดูข้อ 2b | - |
| Axe Cyclone | คลิปพายุของคุณ | - |
| Wolf Finale | คลิปของคุณ | - |
| Ice Prison · Shatter Pulse | คลิปของคุณ | - |
| Blizzard | พายุโค้ดที่คุณเลือกไว้ | - |
| Tempest Field · Ragnarok's Judgment | คลิปของคุณ + ภาพ Mjolnir | - |

## 4. พรอมต์ภาพ 5 ภาพ (ส่งให้ ChatGPT ทีละกล่อง)

แนบ 2 ไฟล์ทุกครั้ง: **ชีตตัวละครหมาป่า** (`assets/heroes/wolf/sheet_fenrir_chibi.webp` = ดีไซน์ขวาน) + **บอร์ดสไตล์เอฟเฟค** (`tools/ref/wolf_fx_ref.jpg` = ภาพเอฟเฟคหมาป่าชุดเดิมของเราเอง 6 ภาพ ให้เส้นและแสงเหมือนกัน)

กติกา: 1 ภาพ = 1 เอฟเฟค · พื้นหลังโปร่งใส · ถ้าออกมาเป็นลายตารางหมากรุกก็ส่งมาได้ ตัดให้เอง (`tools/checker_key.py`)

### 1. ขวานประหาร (Executioner)

ใช้แทน: ขวานผีสีแดงที่ลอยเหนือเป้าแล้วตกลงมา ตอนนี้เป็นขวานสองคมของดีไซน์เก่า

```
Game skill-effect picture for a 2D chibi fantasy RPG. Style: friendly hand-painted chibi cartoon exactly like the attached effect pictures: thick clean dark-brown outlines, cel shading with 2-3 flat tones, soft cartoon glow, bright and warm. Not realistic, not painterly smoke, not 3D. SUBJECT: a giant spectral executioner's greataxe falling straight down. It is the ghost of the hero's own axe from the attached character sheet, so copy that design: ONE big crescent blade on one side only (single-bladed, never double-bladed), a snarling wolf head carved where the blade meets the haft, a line of small angular rune marks along the cutting edge, a long haft wrapped with straps and bands, a small cap at the end. COLOURS: the whole axe is made of translucent crimson spirit light: deep crimson body, bright red glow, a white-hot cutting edge, the wolf head's eyes glow white. Jagged crimson flames stream UP from the blade along the haft like a comet tail, and three broken iron chain links float beside it. VIEW: front view, perfectly upright: the blade is at the BOTTOM pointing down, the haft points straight up. Tall portrait picture, about 2:3. FORMAT: ONE effect only, centred, with empty space on every side, nothing cut off by the picture edge. Transparent PNG background (real transparency, not a drawn checkerboard, no background colour, no ground, no shadow on a floor). No character, no text, no letters, no logo, no watermark.
```

### 2. ขวานทองวัลฮัลลา (Valhalla's Wrath)

ใช้แทน: ขวานทองที่ฟาดผ่านศัตรูและตกลงกลางวงตอนอัลติสาย A

```
Game skill-effect picture for a 2D chibi fantasy RPG. Style: friendly hand-painted chibi cartoon exactly like the attached effect pictures: thick clean dark-brown outlines, cel shading with 2-3 flat tones, soft cartoon glow, bright and warm. Not realistic, not painterly smoke, not 3D. SUBJECT: a giant divine golden greataxe descending from the sky. It is the ghost of the hero's own axe from the attached character sheet, so copy that design: ONE big crescent blade on one side only (single-bladed, never double-bladed), a snarling wolf head carved where the blade meets the haft, a line of small angular rune marks along the cutting edge, a long haft wrapped with straps and bands, a small cap at the end. COLOURS: the whole axe is made of radiant gold: rich gold body with orange-gold shading, a white-gold shining cutting edge, glowing white eyes on the wolf head, a few crimson ribbons tied under the blade. Straight golden light rays fall from above behind it and four small golden feathers drift down around it. VIEW: front view, perfectly upright: the blade is at the BOTTOM pointing down, the haft points straight up. Tall portrait picture, about 2:3. FORMAT: ONE effect only, centred, with empty space on every side, nothing cut off by the picture edge. Transparent PNG background (real transparency, not a drawn checkerboard, no background colour, no ground, no shadow on a floor). No character, no text, no letters, no logo, no watermark.
```

### 3. วิญญาณหมาป่าหอน (War Howl)

ใช้แทน: หัวหมาป่าทองตอนกดบัฟหอน ตอนนี้เป็นหมาป่าสีทองล้วน ไม่เหมือนตัวละครใหม่

```
Game skill-effect picture for a 2D chibi fantasy RPG. Style: friendly hand-painted chibi cartoon exactly like the attached effect pictures: thick clean dark-brown outlines, cel shading with 2-3 flat tones, soft cartoon glow, bright and warm. Not realistic, not painterly smoke, not 3D. SUBJECT: the giant spirit head of a white wolf howling. Only the head and the thick neck fur, no body. The muzzle is raised to the upper right, the mouth open in a long howl, one eye visible and glowing ice-blue, a small red scar slash above that eye. COLOURS: white and pale ice-blue spirit fur whose tips turn into small cold flames, a warm golden glow round the whole head. Three curved golden sound-wave arcs spread to the right from the open mouth, each arc bigger than the one before. VIEW: side view facing RIGHT. Wide landscape picture, about 3:2. FORMAT: ONE effect only, centred, with empty space on every side, nothing cut off by the picture edge. Transparent PNG background (real transparency, not a drawn checkerboard, no background colour, no ground, no shadow on a floor). No character, no text, no letters, no logo, no watermark.
```

### 4. ธงศึก (War Banner)

ใช้แทน: ธงที่ปักลงพื้น ตอนนี้เป็นธงแดงลายหมาป่าของดีไซน์เก่า

```
Game skill-effect picture for a 2D chibi fantasy RPG. Style: friendly hand-painted chibi cartoon exactly like the attached effect pictures: thick clean dark-brown outlines, cel shading with 2-3 flat tones, soft cartoon glow, bright and warm. Not realistic, not painterly smoke, not 3D. SUBJECT: a Norse war banner planted in the ground. A dark wooden pole with an iron spear tip and two small curved horns at the top; a crossbar with white fur tufts at both ends; a long crimson banner cloth hanging from the crossbar, its lower edge cut into two pointed tails, a silver-white snarling wolf-head emblem in the middle of the cloth, a silver knotwork border, a thin cream zigzag band near the top; two broken iron chain links hang from one end of the crossbar; a small pile of grey stones holds the foot of the pole. VIEW: front view, upright, the foot of the pole and the stones are a flat base at the BOTTOM of the picture. Tall portrait picture, about 2:3. FORMAT: ONE effect only, centred, with empty space on every side, nothing cut off by the picture edge. Transparent PNG background (real transparency, not a drawn checkerboard, no background colour, no ground, no shadow on a floor). No character, no text, no letters, no logo, no watermark.
```

### 5. โล่รูน (Rune Guard)

ใช้แทน: โล่ 3 ใบที่ลอยวนรอบตัว ตอนนี้เป็นโล่ลายเกล็ดหิมะ

```
Game skill-effect picture for a 2D chibi fantasy RPG. Style: friendly hand-painted chibi cartoon exactly like the attached effect pictures: thick clean dark-brown outlines, cel shading with 2-3 flat tones, soft cartoon glow, bright and warm. Not realistic, not painterly smoke, not 3D. SUBJECT: a round Norse shield made of ice and rune light. A silver rim with knotwork carving and four round studs; the face of the shield is translucent glacier-blue ice with a snarling wolf head drawn in glowing white lines in the middle; a ring of eight small angular rune marks glows between the wolf head and the rim; small sharp ice crystals grow on the outside of the rim. COLOURS: silver, glacier blue, ice white; no green. VIEW: straight front view, a perfect circle. Square picture, 1:1. FORMAT: ONE effect only, centred, with empty space on every side, nothing cut off by the picture edge. Transparent PNG background (real transparency, not a drawn checkerboard, no background colour, no ground, no shadow on a floor). No character, no text, no letters, no logo, no watermark.
```

## 4b. ภาพที่ใส่แล้ว (2026-11-26)

ภาพ 5 ภาพของคุณมาเป็น PNG โปร่งใสจริง ไม่ต้องตัดพื้นหลัง → `python3 -I tools/fx/wolf_pics.py EXEC VALHALLA HOWL BANNER SHIELD [preview=PNG]` ตัดขอบ ย่อ และพิมพ์จุดยึด → `assets/fx/wolf/`

| ไฟล์ | ใช้ที่ | จุดยึด |
|---|---|---|
| `n01_exec_axe` | Executioner: ลอยเหนือเป้าแล้วฟันลง | ปลายคมขวาน (ลอยเหนือหัวเป้า ตอนฟันปลายคมจมเข้าตัว) |
| `n02_valhalla_axe` | Valhalla's Wrath: ขวานตกกลางวง (มีลำแสง) | ปลายคมขวานแตะจุดตก |
| `n02_valhalla_core` | Valhalla's Wrath: ขวานเหวี่ยงตามทุกครั้งที่ฟัน | ปลายด้าม (หมุนรอบจุดนี้) · ตัดลำแสง/ขนนกออกจากภาพเดียวกัน (เส้นขอบเข้ม + เส้นที่ลากรอบใบขวานไว้ในเครื่องมือ) · กลับด้านเมื่อเหวี่ยงขวาไปซ้าย ให้คมนำ |
| `n03_howl` | War Howl | กลางหัวหมาป่า · วาดในชั้นเรียงลำดับ หลังตัวฮีโร่ (ไม่โดนเรืองแสงชั้นบน ไม่โดนตัดรูปฮีโร่) · หันตามทิศฮีโร่ |
| `n04_banner` | War Banner | เสาธงที่พื้น |
| `n05_rune_shield` | Rune Guard | กลางโล่ |

- โค้ด: ตาราง `WP` ใน `wolf_fx.js` = [ภาพ, ตัวคูณขนาด, จุดยึด] ต่อชิ้น + ฟังก์ชัน `wP()` · ตัวคูณทำให้สูงบนจอเท่าภาพเดิม (ขวานเหวี่ยงใหญ่ขึ้น 10 %)
- `?wpic=0` = ภาพชุดเก่า (w46 · w55 · w05 · w20 · w24) ตำแหน่งเดิมทุกอย่าง
- `wolf_vfx3.js` KEEP รู้จักชื่อ `n0x_` (ภาพวาดไม่ถูกแทนด้วยโค้ด)
- คลิปโชว์: `DSF=1.5 python3 tools/fx/wfclip.py pic ['&wpic=0']`


## 5. วิธีทำงานของไฟล์ (สำหรับแชตถัดไป)

- `wolf_vfx5.js` โหลดเฉพาะหมาป่า ต่อจาก `fxlib.js` (index.html บรรทัดถัดจากของอนูบิส) · ไม่ได้แก้ `wolf_vfx3.js` · `wolf_fx.js` แก้ 1 บรรทัด (ชิ้นของ FXLIB ไม่ถูกกรองทิ้ง เพราะชื่อคลาสซ้ำกับของเก่า: Bolt Ring Burst Crack)
- ตาราง `ST` = สกิลที่ไฟล์นี้วาด (สีเสี้ยว `el` · แบบรอยโดน `hit` · ความหนา `ws`) → เพิ่ม / ถอดสกิลที่นี่
- ตัวห่อชั้นนอกสุด: `addFx` (ขณะสกิลใน ST ทำงาน: ชิ้นภาพเก่าถูกทิ้งตามชื่อคลาสใน `DROP` หรือแปลงเป็นชิ้นใหม่ใน `CONV` — ชิ้นเก่าเป็นตัวบอกตำแหน่งและเวลา) · `emit` (ทิ้งจุดกลม) · `hurt` (รอยโดน) · `slashAt` (ทุกท่าเหวี่ยงผ่าน Slash ของเกม → `VSlash`) · `mkBasic` · `SKILLS[k].make` (ตาราง `MK`: ชิ้นตอนกดสกิล)
- ของที่มีผลกับเกม (FrostWave FrostPath FallObj Decoy Ticker เงา Ghost ไอคอนสถานะ) ผ่านหมด ไม่ถูกแตะ
- ทดสอบ: `DSF=1.5 python3 tools/fx/wfclip.py a|b ['&wfx5=0']` = คลิปโชว์พร้อมป้ายไทย (คอมโบต่อเนื่องใช้คีย์ `fu:<สกิล>`)

## 6. ผลตรวจ (2026-11-25)

- เวลาโดนของ 21 คีย์ (รวมคอมโบต่อเนื่อง) เทียบ `?wfx5=0`: เท่ากันทุกตัว ยกเว้น Rune Storm ที่ฟ้าผ่าสุ่มจุด (ต่างเพราะลำดับเลขสุ่ม เหมือนที่เคยบันทึกไว้)
- tools/qa: herosweep = error เดิม 7 ตัวของสกิลต่อเนื่องที่ถูกกดตรง · combo 0 error ผลเท่าหน้าตาเดิม · leak คงที่ · โหมดเล่นจริง (สร้างตัว → ทุ่ง → สู้) ไม่มี error
- เจมธาตุ (gemfx_sweep) ไม่มี error ชิ้นใหม่เปลี่ยนสีตามเจม
- เวลาต่อเฟรมเท่าหน้าตาเดิม (ค่ากลาง 7–9 ms ทั้งสองแบบ)
- ดูบนหิมะ (vikF2) และป่า (aztF1)
- 2026-11-26 ภาพ 5 ภาพ: แก้แค่ส่วนวาด (ไม่แตะดาเมจ / เวลาโดน) · herosweep = error เดิม 7 ตัว · combo 0 error · ภาพเฟรมเทียบ `?wpic=0` ทุกสกิล + หอนทั้งหันซ้ายและขวา

## 7. ยังไม่ได้ทำ

- สกิลกดใช้ครบทุกสกิลแล้ว (2026-11-26) · เหลือ passive ที่มีชิ้นของตัวเอง (Storm Chain, Glacial Path, Valhalla Assault, Worldstorm, Echo Step, Endless Chain) ยังใช้ชิ้นเดิม
- ดูบนมือถือจริง · คำตัดสินของเจ้าของ
