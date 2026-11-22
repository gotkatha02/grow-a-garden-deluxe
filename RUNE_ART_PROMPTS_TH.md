# ภาพระบบรูน — พรอมต์เจนภาพ v2 (2026-11-23)

รอบก่อนมีแค่หินหน้าสัตว์ 6 ลูก กับหินเหลี่ยมเปล่า 3 สี → รอบนี้ **รูนทุกแบบมีภาพของตัวเอง**:
- **ก.** รูนวิญญาณ 18 แบบ (3 แผ่น)
- **ข.** รูนสลัก 18 แบบ (3 แผ่น)
- **ค.** สัตว์วิญญาณ 6 ตัว สำหรับเอฟเฟค (รูปละตัว)
- **ง.** ของในระบบ 13 ชิ้น (1 แผ่น)
- **จ.** พื้นหลังหน้าวงเศษโทเท็ม (1 รูป)

รวม **14 รูป**

**ทุกครั้ง**: แนบภาพคีย์อาร์ตกองไฟ (สไตล์) · ส่งทีละกล่อง ทีละรูป · ได้ภาพแล้วส่งกลับมาในแชทได้เลย ผมตัดและใส่เกมให้
**สไตล์** (เขียนไว้ในทุกพรอมต์แล้ว): การ์ตูนชิบิลงสีมือ · เส้นขอบน้ำตาลเข้มหนา · เงา 2–3 โทนแบบเซล · แสงเรืองแบบการ์ตูน · สดใส อบอุ่น · ไม่สมจริง ไม่ใช่ 3D · ไม่มีตัวหนังสือ / โลโก้ / ลายน้ำ

ระบบเกมรอภาพไว้แล้ว ส่งมาเมื่อไหร่ภาพจริงแทนภาพโค้ดได้เลย ไม่ต้องแก้ระบบเพิ่ม (ทดสอบด้วยภาพจำลองแล้ว)

---

## หลักการออกแบบ

**รูนวิญญาณ (ช่องใหญ่)**
- **สัตว์บอกตระกูล**: 6 ตัว ตัวละ 3 รูน
- **สีพื้นต่อสัตว์**: ผู้เล่นจำได้ว่าพื้นส้มคือหมี พื้นม่วงคือนกฮูก
  | สัตว์ | สีพื้น |
  |---|---|
  | หมี | ส้มสนิม |
  | นกฮูก | ม่วงเที่ยงคืน |
  | หมาป่า | ฟ้าน้ำแข็ง |
  | อินทรี | ฟ้ารุ่งอรุณสีทอง |
  | นกสายฟ้า | เมฆพายุเทา |
  | วาฬเพชฌฆาต | น้ำทะเลลึก |
- **ท่าของสัตว์ + ของ 1 ชิ้นบอกความสามารถ**: หมีหลบหลังโล่ = โล่ · หมียืนลูกธนูเด้ง = ลดดาเมจ · หมีหลับ + หัวใจ = ฟื้นเลือด
- **กรอบเกรดเกมวาดเอง**: วงสีรอบภาพ B เขียว · A ฟ้า · S ทอง + ตัวอักษร → ภาพเป็นแค่เหรียญกลมไม่มีกรอบ (ถ้ามีกรอบทองจะซ้อนกัน 2 ชั้น)

**รูนสลัก (ช่องเล็ก)**
- **สี = สีเส้นที่รูนวิญญาณต้องการ**: แดง โจมตี · ฟ้า ป้องกัน · ทอง วิญญาณ/เสริม
- **รูปทรงต่อสี**: แดง = ข้าวหลามตัด (ปลายใบมีด) · ฟ้า = ทรงโล่ · ทอง = หกเหลี่ยม → คนตาบอดสีก็จับคู่สีได้
- **สัญลักษณ์สลักกลางหิน = สเตตัส** (ใช้ภาษาภาพเดียวกับไอคอนในเกม เช่น หัวใจ = VIT, รองเท้ามีปีก = AGI, โคลเวอร์ = LUK)

**แผ่นที่เป็นตาราง**: ใช้พื้นเขียวล้วน แล้วห้ามมีสีเขียวในภาพ (ตัดพื้นออกได้สะอาด) · ยกเว้นแผ่น ง. ใช้พื้นชมพูบานเย็น เพราะหินเกรด B มีรอยแตกสีเขียว

---

## ก. รูนวิญญาณ 18 แบบ — 3 แผ่น (ตาราง 3×2 พื้นเขียว)

| แผ่น · ช่อง | key | รูน | ความสามารถ | ภาพ |
|---|---|---|---|---|
| ก1 · 1 | sr_bearHide | หนังหมีภูเขา | โดนตีครบ 6 → โล่ | หมีหมอบหลังโล่หนังสัตว์กลมใหญ่ |
| ก1 · 2 | sr_bearStand | ยืนหยัด | ทำท่าสกิลอยู่ รับดาเมจลด | หมียืน 2 ขาบนพื้นแตก ลูกธนูหักเด้งออกจากอก |
| ก1 · 3 | sr_bearSleep | หมีจำศีล | HP ต่ำ → ฟื้น + โล่ | หมีขดหลับในโพรง จันทร์เสี้ยว ฟองหลับ หัวใจชมพู |
| ก1 · 4 | sr_owlNight | ตาราตรี | สกิลครั้งที่ 4 → ทะลุเกราะ | หน้านกฮูกตาโตเรือง ลำแสงจากตาทะลุแผ่นเกราะแตก |
| ก1 · 5 | sr_owlWing | ปีกเงียบ | มึน / ช้า นานขึ้น | นกฮูกกางปีกร่อนเงียบ ขนปลิว ดาวมึนหมุนใต้กรง |
| ก1 · 6 | sr_owlMoon | ปัญญาจันทร์ | บัฟครบ 3 → ลดคูลดาวน์ | นกฮูกเกาะจันทร์เสี้ยว ถือนาฬิกาทรายเรืองแสง |
| ก2 · 1 | sr_wolfPack | สัญชาตญาณฝูง | สกิลโดน 3 ตัว+ → ATK ขึ้น | หัวหมาป่า 3 หัวชิดกันเป็นสามเหลี่ยม |
| ก2 · 2 | sr_wolfHowl | หอนเรียกฝูง | ฆ่าครบ 8 → หมาป่าวิญญาณ 2 ตัว | หมาป่านั่งหอนใส่จันทร์เต็มดวง วิญญาณหมาป่า 2 ตัวลอยขึ้นจากหิมะ |
| ก2 · 3 | sr_wolfHunt | ไล่ล่า | เป้าติดสถานะ โดนแรงขึ้น | หมาป่าหมอบย่อง จ้องเป้าล่าสีแดง (วงกลม + รอยกรงเล็บ) |
| ก2 · 4 | sr_eagleEye | ตาเหยี่ยว | ตีไกล → CRIT | หัวอินทรีด้านข้าง ตาเรือง เส้นสายตาพุ่งไปเป้าดาวไกลๆ |
| ก2 · 5 | sr_eagleSwoop | โฉบเหยื่อ | เดิน 2 วิ → ฮิตแรกแรงมาก | อินทรีดิ่งหัวลง หุบปีก ยื่นกรงเล็บ เส้นความเร็ว |
| ก2 · 6 | sr_eagleFeather | ขนนกลม | หลบได้ทุกครั้งที่ n | อินทรีบิดตัวหลบ ลูกธนูพลาดผ่าน ขนนกทองหมุนในวงลม |
| ก3 · 1 | sr_tbWing | ปีกนกสายฟ้า | สกิลครบ 6 → ฟ้าผ่า | นกสายฟ้ากางปีก สายฟ้าใหญ่ฟาดลงจากระหว่างปีก |
| ก3 · 2 | sr_tbRoar | ฟ้าคำราม | อัลติ → ฟ้าผ่ารอบตัว 4 ครั้ง | นกสายฟ้าอ้าปากกรีดร้อง สายฟ้า 4 สายตกเป็นวงรอบตัว |
| ก3 · 3 | sr_tbCharge | ประจุฟ้า | ฆ่า → 4 ฮิตแรกแรงขึ้น | นกสายฟ้ากำลูกบอลสายฟ้าในกรงเล็บ กำลังชาร์จ |
| ก3 · 4 | sr_orcaFlow | กระแสคืน | สกิลครบ 5 → คืน SP | วาฬว่ายวนกระแสน้ำวงกลม หยดน้ำสีฟ้าไหลกลับเข้าตัว |
| ก3 · 5 | sr_orcaDive | ดำดิ่ง | พุ่ง / ขยับ → ฟื้น HP | วาฬดำทะลุวงน้ำกระเซ็น ฟองหัวใจลอยขึ้น |
| ก3 · 6 | sr_orcaWave | คลื่นนำ | ไม่ได้สู้ → สกิลแรกไม่ติดคูลดาวน์ | วาฬลอยนิ่งบนน้ำสงบ คลื่นยักษ์ม้วนตัวรออยู่ข้างหลัง |

### ก1 — หมี + นกฮูก

```
A friendly hand-painted chibi cartoon game ICON SHEET for a fantasy RPG with a totem theme, matching the attached campfire key art: thick clean dark-brown outlines, cel shading with 2–3 flat tones, soft cartoon glow, bright and warm. Not realistic, not painterly smoke, not 3D.
A 3 by 2 grid of six separate ROUND SPIRIT-RUNE MEDALLIONS on a flat pure green (#00FF00) background. Every medallion is a perfect circle of the same size, with lots of empty green space around it, nothing touching.
Each medallion is a round disc of polished spirit stone with only a thin dark-brown outline at its edge — NO gold frame, NO rim ring, NO gems on the edge (the game adds its own frame). Its face is filled edge to edge with a coloured background with faint carved totem patterns (zigzags, spirals) near the edge. In the middle, a cute but heroic spirit animal, solid and clearly outlined, with glowing eyes and a soft spirit glow, acting out the rune's power, big and easy to read at small size.
Row 1, the BEAR runes, warm rust-orange background:
1. a bear crouching behind a big round shield of thick fur hide stretched on a wooden frame, the shield glowing amber.
2. a bear standing tall on its hind legs, feet planted on cracked ground, chest out, two small arrows snapping and bouncing off its chest.
3. a bear curled up asleep in a cosy den hollow under a crescent moon, small sleep bubbles, a warm golden glow and a small pink heart floating above it.
Row 2, the OWL runes, midnight-purple background with tiny stars:
4. an owl face close-up with huge glowing yellow eyes, two beams of light from its eyes piercing through a small cracked armour plate.
5. an owl gliding silently with its wings spread wide, soft feathers drifting, a little ring of dizzy stars spinning below its talons.
6. an owl perched on a crescent moon, holding a small glowing hourglass under one wing.
Same size, same style and same camera distance for all six. No green on the medallions. No text, no letters, no numbers, no logo, no watermark.
```

### ก2 — หมาป่า + อินทรี

```
A friendly hand-painted chibi cartoon game ICON SHEET for a fantasy RPG with a totem theme, matching the attached campfire key art: thick clean dark-brown outlines, cel shading with 2–3 flat tones, soft cartoon glow, bright and warm. Not realistic, not painterly smoke, not 3D.
A 3 by 2 grid of six separate ROUND SPIRIT-RUNE MEDALLIONS on a flat pure green (#00FF00) background. Every medallion is a perfect circle of the same size, with lots of empty green space around it, nothing touching.
Each medallion is a round disc of polished spirit stone with only a thin dark-brown outline at its edge — NO gold frame, NO rim ring, NO gems on the edge (the game adds its own frame). Its face is filled edge to edge with a coloured background with faint carved totem patterns (zigzags, spirals) near the edge. In the middle, a cute but heroic spirit animal, solid and clearly outlined, with glowing eyes and a soft spirit glow, acting out the rune's power, big and easy to read at small size.
Row 1, the WOLF runes, icy silver-blue snowy-night background with falling snowflakes:
1. three wolf heads close together in a triangle, the front one snarling, a pack ready to strike together.
2. a wolf sitting and howling up at a full moon, two ghostly pale-blue spirit wolves rising from the snow beside it.
3. a wolf crouched low and stalking, eyes locked on a glowing red hunting mark (a circle with three claw slashes) in front of it.
Row 2, the EAGLE runes, golden sunrise sky background (warm yellow to peach):
4. an eagle head in profile with a fierce glowing eye, a long straight beam of sight reaching a small star-shaped bullseye far away.
5. an eagle diving steeply downward with its wings tucked and talons out, strong speed lines behind it.
6. an eagle twisting sideways in mid-air as an arrow flies past and misses it, one big golden feather swirling in a loop of wind.
Same size, same style and same camera distance for all six. No green on the medallions. No text, no letters, no numbers, no logo, no watermark.
```

### ก3 — นกสายฟ้า + วาฬเพชฌฆาต

```
A friendly hand-painted chibi cartoon game ICON SHEET for a fantasy RPG with a totem theme, matching the attached campfire key art: thick clean dark-brown outlines, cel shading with 2–3 flat tones, soft cartoon glow, bright and warm. Not realistic, not painterly smoke, not 3D.
A 3 by 2 grid of six separate ROUND SPIRIT-RUNE MEDALLIONS on a flat pure green (#00FF00) background. Every medallion is a perfect circle of the same size, with lots of empty green space around it, nothing touching.
Each medallion is a round disc of polished spirit stone with only a thin dark-brown outline at its edge — NO gold frame, NO rim ring, NO gems on the edge (the game adds its own frame). Its face is filled edge to edge with a coloured background with faint carved totem patterns (zigzags, spirals) near the edge. In the middle, a cute but heroic spirit animal, solid and clearly outlined, with glowing eyes and a soft spirit glow, acting out the rune's power, big and easy to read at small size.
Row 1, the THUNDERBIRD runes (an electric-blue bird with gold lightning marks and a small crest), dark grey storm-cloud background lit with yellow light:
1. a thunderbird with its wings spread wide, a big yellow lightning bolt striking down from between its wings.
2. a thunderbird screaming with its beak wide open, four lightning bolts falling in a circle around it.
3. a thunderbird gripping a crackling ball of lightning in its talons, charging it up, sparks flying.
Row 2, the ORCA runes (a black-and-white killer whale), deep ocean-blue background with white foam, no green and no teal:
4. an orca swimming around a circular water current, glowing blue water droplets flowing back into its body.
5. an orca diving through a ring of white splash, leaving a bubble trail, a small heart-shaped bubble rising.
6. an orca resting calmly on still water while a huge curling wave rises behind it, ready to break.
Same size, same style and same camera distance for all six. No green on the medallions. No text, no letters, no numbers, no logo, no watermark.
```

---

## ข. รูนสลัก 18 แบบ — 3 แผ่น (ตาราง 3×2 พื้นเขียว แผ่นละสี)

| แผ่น · ช่อง | key | สเตตัส | สัญลักษณ์ |
|---|---|---|---|
| ข1 · 1 | c_str | STR | กำปั้น |
| ข1 · 2 | c_dex | DEX | คันธนูง้างลูกธนู |
| ข1 · 3 | c_atk | ATK | ดาบตั้ง |
| ข1 · 4 | c_matk | MATK | คทาปลายดาวลุกโชน |
| ข1 · 5 | c_hit | HIT | เป้ากลมมีลูกธนูปักกลาง |
| ข1 · 6 | c_crit | CRIT | ดาวแตกหนาม (ประกายคริติคอล) |
| ข2 · 1 | c_vit | VIT | หัวใจ |
| ข2 · 2 | c_agi | AGI | รองเท้ามีปีก |
| ข2 · 3 | c_def | DEF | หมวกเกราะมีเขา |
| ข2 · 4 | c_mdef | MDEF | วงเวทป้องกัน มีดาวกลาง |
| ข2 · 5 | c_flee | FLEE | ลมหมุน ลูกธนูเลี้ยวพลาด |
| ข2 · 6 | c_dred | รับดาเมจ − | ใบดาบหักสองท่อน |
| ข3 · 1 | c_int | INT | ดวงตาเปิด ตาดำเป็นดาว |
| ข3 · 2 | c_luk | LUK | ใบโคลเวอร์ 4 แฉก |
| ข3 · 3 | c_aspd | ASPD | มีดสั้นไขว้ 2 เล่ม + เส้นความเร็ว |
| ข3 · 4 | c_cast | ร่ายเร็ว | นาฬิกาทราย + สายฟ้า |
| ข3 · 5 | c_cdr | คูลดาวน์ − | หน้าปัดนาฬิกา ลูกศรวนย้อน |
| ข3 · 6 | c_spc | ใช้ SP − | มือประคองหยดน้ำมานาสีฟ้า |

### ข1 — แดง (โจมตี) ทรงข้าวหลามตัด

```
A friendly hand-painted chibi cartoon game ICON SHEET for a fantasy RPG with a totem theme, matching the attached campfire key art: thick clean dark-brown outlines, cel shading with 2–3 flat tones, soft cartoon glow, bright and warm. Not realistic, not 3D.
A 3 by 2 grid of six separate CARVED RUNE GEMS on a flat pure green (#00FF00) background, lots of empty green space around each, nothing touching.
All six are the same shape and size: a polished fiery RED gemstone tablet cut as a pointed DIAMOND standing on its tip, with a thin carved border groove and a shiny highlight on the top facet. In the centre of each gem, one bold simple symbol is deeply carved into the stone and filled with glowing cream-white light; the symbol is big and easy to read at small size.
Symbols, left to right, top to bottom:
1. a clenched fist.
2. a bow drawn with an arrow.
3. an upright sword.
4. a magic staff with a blazing star at its tip.
5. a round target with an arrow stuck in its centre.
6. a spiky starburst with a jagged crack, like a critical-hit spark.
Same style for all six. No green on the gems. No text, no letters, no numbers, no logo, no watermark.
```

### ข2 — ฟ้า (ป้องกัน) ทรงโล่

```
A friendly hand-painted chibi cartoon game ICON SHEET for a fantasy RPG with a totem theme, matching the attached campfire key art: thick clean dark-brown outlines, cel shading with 2–3 flat tones, soft cartoon glow, bright and warm. Not realistic, not 3D.
A 3 by 2 grid of six separate CARVED RUNE GEMS on a flat pure green (#00FF00) background, lots of empty green space around each, nothing touching.
All six are the same shape and size: a polished cool SKY-BLUE gemstone tablet cut as a SHIELD shape (flat top, rounded sides, pointed bottom), with a thin carved border groove and a shiny highlight on the top facet. In the centre of each gem, one bold simple symbol is deeply carved into the stone and filled with glowing cream-white light; the symbol is big and easy to read at small size.
Symbols, left to right, top to bottom:
1. a heart.
2. a boot with small wings.
3. a sturdy horned helmet.
4. a magic circle with a small star in its centre, like a protective spell ward.
5. a swirling gust of wind with an arrow curving away past it.
6. a sword blade snapped in two.
Same style for all six. No green on the gems. No text, no letters, no numbers, no logo, no watermark.
```

### ข3 — ทอง (วิญญาณ / เสริม) ทรงหกเหลี่ยม

```
A friendly hand-painted chibi cartoon game ICON SHEET for a fantasy RPG with a totem theme, matching the attached campfire key art: thick clean dark-brown outlines, cel shading with 2–3 flat tones, soft cartoon glow, bright and warm. Not realistic, not 3D.
A 3 by 2 grid of six separate CARVED RUNE GEMS on a flat pure green (#00FF00) background, lots of empty green space around each, nothing touching.
All six are the same shape and size: a polished warm GOLDEN-AMBER gemstone tablet cut as a HEXAGON, with a thin carved border groove and a shiny highlight on the top facet. In the centre of each gem, one bold simple symbol is deeply carved into the stone and filled with glowing cream-white light; the symbol is big and easy to read at small size.
Symbols, left to right, top to bottom:
1. an open eye with a star-shaped pupil.
2. a four-leaf clover (cream-white like the other symbols, not green).
3. two crossed daggers with fast curved motion lines.
4. an hourglass with a small lightning bolt across it.
5. a clock face with a curved arrow turning backwards around it.
6. a cupped hand holding a bright blue drop of mana.
Same style for all six. No green on the gems. No text, no letters, no numbers, no logo, no watermark.
```

---

## ค. สัตว์วิญญาณ 6 ตัว (เอฟเฟคตอนรูนทำงาน) — รูปละ 1 ตัว พื้นหลังโปร่งใส

ใช้ในเกมตอนรูนทำงาน:
- หมีโผล่หลังฮีโร่ตอนได้โล่
- นกฮูกลอยเหนือหัวตอนตาราตรีพร้อม
- อินทรีบินวนตอนโฉบเหยื่อพร้อม
- หมาป่าวิญญาณวิ่งไปกัด
- นกสายฟ้ามากับสายฟ้า
- วาฬกระโดดเป็นคลื่น

สีตัวตรงกับสีเหรียญรูนของตัวเอง · ตัวเป็น "วิญญาณ" กึ่งโปร่งแสงเรืองแสง แต่เส้นขอบชัด (อ่านออกบนพื้นหิมะ / ทราย)
เป็นภาพเอฟเฟค → พื้นโปร่งใส ห้ามทำเป็นแผ่นบนพื้นเขียว

### ค1 หมี

```
A friendly hand-painted chibi cartoon SPIRIT ANIMAL for a fantasy action RPG, matching the attached campfire key art: thick clean dark-brown outlines, cel shading with 2–3 flat tones, soft cartoon glow, bright and warm. Not realistic, not painterly smoke, not 3D.
Subject: a heroic totem spirit BEAR, full body, rearing up on its hind legs with a protective roar, front paws raised like a shield. Its body is semi-translucent glowing amber-orange spirit light with darker amber fur strokes, carved totem patterns (zigzags, spirals) glowing faintly on its chest and shoulders, small floating sparks around it.
ONE character only, centred, empty space on every side, flat base at the bottom (it stands on the ground), transparent PNG background. No text, no logo, no watermark, no ground shadow.
```

### ค2 นกฮูก

```
A friendly hand-painted chibi cartoon SPIRIT ANIMAL for a fantasy action RPG, matching the attached campfire key art: thick clean dark-brown outlines, cel shading with 2–3 flat tones, soft cartoon glow, bright and warm. Not realistic, not painterly smoke, not 3D.
Subject: a wise totem spirit OWL, full body, front view, wings half open as it hovers, huge round glowing moon-yellow eyes, ear tufts. Its body is semi-translucent glowing violet-lavender spirit light with deeper purple feather strokes, a crescent-moon totem mark on its chest, small floating star sparkles around it.
ONE character only, centred, empty space on every side, transparent PNG background. No text, no logo, no watermark, no ground shadow.
```

### ค3 หมาป่า

```
A friendly hand-painted chibi cartoon SPIRIT ANIMAL for a fantasy action RPG, matching the attached campfire key art: thick clean dark-brown outlines, cel shading with 2–3 flat tones, soft cartoon glow, bright and warm. Not realistic, not painterly smoke, not 3D.
Subject: a fierce totem spirit WOLF, full body, side view facing right, running forward mid-leap with its jaws open, ready to bite. Its body is semi-translucent glowing pale frost-blue spirit light with darker blue fur strokes, carved rune marks glowing on its shoulders, a trail of small blue wisps behind its tail.
ONE character only, centred, empty space on every side, transparent PNG background. No text, no logo, no watermark, no ground shadow.
```

### ค4 อินทรี

```
A friendly hand-painted chibi cartoon SPIRIT ANIMAL for a fantasy action RPG, matching the attached campfire key art: thick clean dark-brown outlines, cel shading with 2–3 flat tones, soft cartoon glow, bright and warm. Not realistic, not painterly smoke, not 3D.
Subject: a proud totem spirit EAGLE, full body, diving down with its wings swept back and talons forward. Its body is semi-translucent glowing golden spirit light, a white head with a sharp golden hooked beak, warm brown wing feathers with gold edges, a sun-disc totem mark on its chest.
ONE character only, centred, empty space on every side, transparent PNG background. No text, no logo, no watermark, no ground shadow.
```

### ค5 นกสายฟ้า

```
A friendly hand-painted chibi cartoon SPIRIT ANIMAL for a fantasy action RPG, matching the attached campfire key art: thick clean dark-brown outlines, cel shading with 2–3 flat tones, soft cartoon glow, bright and warm. Not realistic, not painterly smoke, not 3D.
Subject: a mighty totem THUNDERBIRD spirit, full body, front view, huge wings spread wide, crackling cartoon lightning bolts along the wing edges, a small crest on its head. Its body is semi-translucent glowing electric-blue spirit light with gold lightning totem marks, bright white-yellow zigzag sparks around it.
ONE character only, centred, empty space on every side, transparent PNG background. No text, no logo, no watermark, no ground shadow.
```

### ค6 วาฬเพชฌฆาต

```
A friendly hand-painted chibi cartoon SPIRIT ANIMAL for a fantasy action RPG, matching the attached campfire key art: thick clean dark-brown outlines, cel shading with 2–3 flat tones, soft cartoon glow, bright and warm. Not realistic, not painterly smoke, not 3D.
Subject: a playful totem spirit ORCA (killer whale), full body, side view, leaping in an arc as if jumping out of a wave. Its body is semi-translucent glowing deep-navy and white spirit light, a curling cartoon water wave and bubbles around its tail, a carved spiral totem mark on its side.
ONE character only, centred, empty space on every side, flat base at the bottom (the wave touches the ground), transparent PNG background. No text, no logo, no watermark, no ground shadow.
```

---

## ง. ของในระบบ 13 ชิ้น (ไอคอน) — 1 แผ่น พื้นชมพูบานเย็น

ใช้พื้นชมพูเพราะหินรูนดิบเกรด B มีรอยแตกสีเขียว (บนพื้นเขียวจะโดนตัดหาย) → ห้ามมีสีชมพู / ม่วงในของ
สีในเกมปรับตามภาพนี้แล้ว: ยางวิญญาณเป็นสีอำพัน · ผงวิญญาณเป็นสีเงิน · เจมสกิลรากขั้น 1–4 เป็นสีอำพัน / หยก / ไพลิน / ทอง

ลำดับในภาพ (ซ้าย→ขวา บน→ล่าง):

| แถว | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| 1 | rsap ยางวิญญาณ | rmedal เหรียญโทเท็มทอง | rdew น้ำค้างราก | rfeather ขนนกหมอผี | |
| 2 | rstone0 หินรูนดิบ B | rstone1 หินรูนดิบ A | rstone2 หินรูนดิบ S | rbag ถุงรูนสลัก | |
| 3 | sdust ผงวิญญาณ | rg1 เจมสกิลราก ขั้น 1 | rg2 ขั้น 2 | rg3 ขั้น 3 | rg4 ขั้น 4 |

```
A friendly hand-painted chibi cartoon game ITEM ICON SHEET for a fantasy RPG with a totem theme, matching the attached campfire key art: thick clean dark-brown outlines, cel shading with 2–3 flat tones, soft cartoon glow, bright and warm. Not realistic, not 3D.
Thirteen separate items in three rows (4 + 4 + 5) on a flat pure MAGENTA (#FF00FF) background, each item centred with lots of empty space around it, nothing touching:
Row 1 (4 items): a glowing drop of golden-amber tree sap with a tiny root curl; a gold coin stamped with a smiling totem face; a small glass flask of shimmering sky-blue dew with a wooden cork; a long orange-and-cream shaman feather with small red, blue and gold beads tied to it.
Row 2 (4 items): a small rough grey raw rune stone with a glowing GREEN crack; a medium raw rune stone with a glowing BLUE crack; a big raw rune stone with a glowing GOLD crack and tiny golden crystals poking out; a small brown leather pouch tied with string, red, blue and gold glints peeking out.
Row 3 (5 items): a little heap of glittering silver-white spirit dust with tiny gold sparkles; then four root gems with the same cut (a five-sided gem with a carved tree-root pattern inside), from plain to precious: warm amber-tan, jade green, sapphire blue, and radiant gold with a soft glow.
No pink, purple or magenta on the items. No text, no numbers, no logo, no watermark.
```

---

## จ. พื้นหลังหน้าวงเศษโทเท็ม — สี่เหลี่ยมจัตุรัส 1:1

ตอโทเท็มยักษ์อยู่ตรงกลาง ช่องรูนเรียงตามหน้าในเกม:
- **วงนอก**: เศษใหญ่ 6 ชิ้นที่ 12 / 2 / 4 / 6 / 8 / 10 นาฬิกา (ช่องรูนวิญญาณ) สลับกับหินกลมเล็ก 6 ก้อนที่ 1 / 3 / 5 / 7 / 9 / 11 นาฬิกา
- **วงใน**: หินกลมเล็กอีก 6 ก้อน แต่ละก้อนอยู่ในแนวเศษใหญ่ของมัน
- **เส้นแสง**: เศษใหญ่แต่ละชิ้นต่อกับหินเล็กข้างๆ 2 ก้อนบนวงนอก และหินเล็กวงในของมัน (= 3 ช่องที่ส่งสีให้รูนวิญญาณ)

เกมวางรูนทับรูหลุมเอง ได้ภาพแล้วผมวัดตำแหน่งรูให้ตรง

```
A friendly hand-painted chibi cartoon GAME MENU BACKGROUND for a fantasy RPG, matching the attached campfire key art: thick clean dark-brown outlines, cel shading with 2–3 flat tones, soft cartoon glow. Not realistic, not 3D. Square 1:1.
Top-down night view. In the exact centre, the cut-off stump of a GIANT ANCIENT TOTEM POLE seen from above (about a quarter of the picture wide): carved wood rings, a glowing golden crack across its top.
Around it, on one big circle about three quarters of the picture wide: six LARGE floating shards of the broken totem at the 12, 2, 4, 6, 8 and 10 o'clock positions, each a carved painted wooden fragment with an EMPTY ROUND HOLE in its middle; and between each pair of large shards, one SMALL round carved socket stone with an empty hole (at 1, 3, 5, 7, 9 and 11 o'clock).
On an inner circle about half as wide: six more SMALL round socket stones with empty holes, each one lined up between the stump and a large shard.
Thin glowing violet lines link each large shard to the two small sockets beside it on the big circle and to its own inner small socket. Soft violet magic light, deep purple-blue starry night sky behind, darker at the edges. Keep the empty holes plain and dark (the game places the runes in them).
No characters, no text, no logo, no watermark.
```

---

## สำหรับแชทถัดไป — ตัดภาพ / ใส่เกม

ระบบรอภาพไว้แล้ว (`rune_data.js` ICON_HAVE / SPIRIT_HAVE)

**ก. รูนวิญญาณ**
```
GLOBAL=1 python3 tools/iconsheet.py <sheet.png> assets/rune/icons 3,3 sr_bearHide,sr_bearStand,sr_bearSleep,sr_owlNight,sr_owlWing,sr_owlMoon
```
- ก2 / ก3 ใช้คำสั่งเดียวกัน เปลี่ยน key ตามตาราง
- เติม key ลง `ICON_HAVE`
- ภาพจะถูกตัดเป็นวงกลมใต้กรอบเกรดเอง (clipPath `srClip`)

**ข. รูนสลัก**
- คำสั่งเดียวกัน → `assets/rune/icons/c_<stat>.png` (key ตามตาราง)
- เติม key ลง `ICON_HAVE`

**ค. สัตว์วิญญาณ**
- ตัดขอบใส → `assets/rune/spirit/<bear|owl|wolf|eagle|tbird|orca>.webp`
- เติมชื่อลง `SPIRIT_HAVE`
- ภาพไม่ต้องเป็นจัตุรัส: `artFit` ใน `totem_ring.js` รักษาสัดส่วนให้

**ง. ของในระบบ**
```
GLOBAL=1 python3 tools/iconsheet.py <sheet.png> assets/items 4,4,5 rsap,rmedal,rdew,rfeather,rstone0,rstone1,rstone2,rbag,sdust,rg1,rg2,rg3,rg4
```
- เติม key ลง `icons.json` (`etcIcon` เช็ค ICONS ก่อนภาพโค้ด)

**จ. พื้นหลัง**
- วางที่ `assets/rune/ring/bg.webp`
- วัดจุดกลางรูทั้ง 18 → แก้ `POS` ใน `totem_ring.js` (ตอนนี้: ใหญ่ r 38% · เล็กนอก r 38% +30° · เล็กใน r 21%)
- ใส่ภาพไว้หลัง `ringSVG()` แล้วปิดพื้นที่โค้ดวาด

**ทุกครั้ง**: bump `V` ใน `sw.js` · ถ่ายภาพหน้าวงเศษ (`tools/rune/r1.py`) ส่งให้เจ้าของดู
