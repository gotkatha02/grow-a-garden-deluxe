# หมาป่า — เอฟเฟคสกิลชุดใหม่ (v5)
เจ้าของสั่ง 2026-11-25 21:26 “ทำเอฟเฟคสกิลใหม่ให้หมาป่าหน่อย อันไหนที่ควรเจนรูปก็ไม่ต้องทำแต่ส่งเป็นพร้อมมาแทน”
- สกิลที่วาดด้วยโค้ดได้สวย (ฟัน ระเบิด พื้นแตก น้ำแข็ง สายฟ้า พุ่ง) **ทำใหม่แล้ว 20 สกิล + ตีปกติ** ในไฟล์ `wolf_vfx5.js` (ใช้ชุดเครื่องมือ FXLIB ตัวเดียวกับอนูบิส)
- สกิลที่ควรเป็นภาพวาด (วิญญาณ ของที่เรียกออกมา ภาพบัฟ) **ยังเป็นหน้าตาเดิม** รอภาพจากพรอมต์ 5 ภาพด้านล่าง
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

## 3. สกิลที่ยังเป็นหน้าตาเดิม

| สกิล | ตอนนี้ใช้ | ภาพใหม่ที่ขอ |
|---|---|---|
| War Howl | ภาพหัวหมาป่าหอน | n03 |
| War Fury | ตัวแดง (เคลือบสี) | - |
| Iron Counter | ภาพโล่ปัด | - |
| Executioner | ภาพขวานผี + ตรากะโหลก | n01 |
| Valhalla's Wrath | ภาพประตู ขวานทอง รอยฟันทอง | n02 |
| Rune Guard | ภาพโล่ลอยวน | n05 |
| War Banner | ภาพธง | n04 |
| Fenrir's Spirit | สไปรต์วิญญาณหมาป่าที่มีอยู่แล้ว | - |
| Axe Cyclone + Cyclone Leap | คลิปพายุของคุณ + ภาพเกลียว | - |
| Wolf Finale | คลิปของคุณ | - |
| Ice Prison · Shatter Pulse | คลิปของคุณ | - |
| Blizzard | พายุโค้ดที่คุณเลือกไว้ | - |
| Tempest Field · Ragnarok's Judgment | คลิปของคุณ + ภาพ Mjolnir | - |
| Ravenous Leap | ของเดิม | - |

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

เมื่อภาพมา: ตัดขอบ → `assets/fx/wolf/<ชื่อ>.webp` (n01_exec_axe · n02_valhalla_axe · n03_howl · n04_banner · n05_rune_shield) → เปลี่ยนชื่อภาพใน `wolf_fx.js` (w46 + w08 → n01 · w55 → n02 · w05 → n03 · w20 → n04 · w24 → n05) ขนาดและจุดยึดเดิม · เช็กด้วยคลิปก่อนส่ง

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

## 7. ยังไม่ได้ทำ

- ภาพ 5 ภาพในข้อ 4 (รอเจ้าของเจน) แล้วค่อยทำส่วนโค้ดของสกิลกลุ่มนั้นให้เข้าชุด
- สกิลเสริม ex_ / สกิล C ที่เป็น passive บางตัว (Storm Chain, Glacial Path, Valhalla Assault) ยังใช้ชิ้นเดิม
- ดูบนมือถือจริง · คำตัดสินของเจ้าของ
