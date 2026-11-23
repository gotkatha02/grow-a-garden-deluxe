# ลิงหิมะ (Snow Monkey · ร่างสถิตหงอคง) — พรอมต์ภาพเอฟเฟกต์สกิล (ChatGPT)

เจ้าของถาม 2026-11-23 13:03 'ของลิงมีสกิลไหนต้องเจนภาพอีกมั้ย' → 13:16 'หมายถึงภาพแสดงผลของสกิล' (= ภาพเอฟเฟกต์ ไม่ใช่ไอคอน · พรอมต์ไอคอนอยู่ WUKONG_ICON_PROMPTS_TH.md)

ตอนนี้เอฟเฟกต์ของลิงเป็นโค้ดทั้งหมด (char_wukong.js: WkArc WkStaffFx WkFall WkCrack WkWhirl WkCloud WkMom WkMonkey WkGiant WkFlames WkCave WkPeach WkNeedle …) · ภาพที่ควรเจน = ของที่ถูกเรียกออกมา / วิญญาณ (กติกาเจ้าของ 2026-11-20: ภาพวาดใช้กับของที่เรียกออกมาและบัฟ · รอยฟัน รอยตี ประกาย = VFX โค้ด)

แนบทุกครั้ง: ภาพปกแคมป์ไฟ (สไตล์) + ชีตลิง 07:20 (`assets/heroes/wukong/sheet_snow_ascetic.webp` มุมขวาล่าง = วิญญาณยักษ์) · 1 พรอมต์ = 1 รูป · พื้นหลังโปร่งใส (ถ้า ChatGPT วาดลายตารางหมากรุกมาแทน ตัดได้เหมือนกัน)

| # | ไฟล์ | ใช้กับสกิล | มุม | วางในเกม (ตอนต่อโค้ด) |
|---|---|---|---|---|
| 1 | wk_spirit_rise | Havoc in Heaven (อัลติ A) · Flower-Fruit Mountain Army (อัลติ B) · Out of the Furnace | ตั้งตรง หันหน้า | ข้างหลังตัวลิงตลอดบัฟ 10–15 วิ (แทน WkGiant ที่ขยายสไปรต์ตัวเอง) หายใจ วูบ จาง |
| 2 | wk_spirit_plunge | Sky-Pillar Drop · Eastern Sea Treasure (ครั้งที่ 5) | ตั้งตรง ไม้เท้าดิ่งลง (แนวตั้ง 2:3) | ปลายไม้เท้าลงที่เป้าพอดีจังหวะดาเมจ (แทน WkMom form giant + WkFall) |
| 3 | wk_staff | Pillar Smash · Needle Strike · Ruyi Rhythm · Ten-Thousand-Jin Staff · Ruyi Jingu Bang | ด้านข้าง ชี้ขวา | ตัด 3 ท่อน (หัวห่วง · ด้าม · ปลาย) ยืดด้ามได้ หมุนตามแนวแทง / ตั้งดิ่งตอนตกจากฟ้า (แทน WkFall / WkStaffFx) |
| 4 | wk_cloud | Somersault Cloud · 108,000 Li · เมฆใต้วิญญาณ | ด้านข้าง บินไปขวา | ใต้เท้าตอนพุ่ง กลับด้านตามทิศ (แทน WkCloud) |
| 5 | wk_mountain | Mountain Splitter · Unbound · Equal to Heaven | ตั้งตรง ฐานแบน | โผล่บนเป้า แล้วโค้ดผ่าครึ่งตามรอยร้าวกลาง แยกซ้าย-ขวา หินร่วง |
| 6 | wk_furnace | Out of the Furnace | ตั้งตรง ฐานแบน | ครอบตัวลิง สั่น แล้วแตกออก ไฟทองพุ่ง (เสริม WkFlames) |
| 7 | wk_cave_pool | Water Curtain Cave | ราบกับพื้น วงรี 3/4 | เลเยอร์พื้น เต็มรัศมี 140 (แทน WkCave) |
| 8 | wk_cave_falls | Water Curtain Cave | ตั้งตรง ฐานแบน | ขอบหลังสระ ตัวละครยืนหน้าม่าน (แทน WkCaveTop) |
| 9 | wk_peach | Peach of Immortality · Peach Banquet · Peach Pit | มองตรง | ลอยเหนือมือ/หัวตอนกิน (แทน WkPeach) |
| 10 | wk_poof | Hair Clone · Pluck & Blow · Seventy-Two Transformations · Hair Recall · Hair Substitute · Thousand-Monkey Barrage | ตั้งตรง ฐานแบน | ทุกครั้งที่ร่างขนโผล่ / หาย / แปลงร่าง (เสริม hairPuff) |

ไม่ต้องเจน (โค้ดทำต่อ): รอยกระบองฟาด / แทง (WkArc, WkStaffFx เส้นแสง) · ประกายตอนโดน · พายุกระบอง (Staff Whirlwind, Storm of Ten Thousand Monkeys) · ออร่าอาละวาด · เส้นขนลอย · เข็ม · ร่างเสือ / ผึ้ง / หิน (ย้อมสี + ลายเสือ / ปีกผึ้งด้วยโค้ด) · รอยแตกพื้น = ใช้ภาพของแมว `assets/fx/cat/k_crater.webp` (Heaven-Smashing Leap, Quake Landing, ลงพื้นของ Pillar Smash / Jingu Bang)

## ใส่ในเกมแล้ว (2026-11-23 · เจ้าของส่งครบ 10 รูป 13:30)

ตัดพื้นหลัง: 9 รูปมาเป็น RGB ลายตารางหมากรุก → ตัดด้วยสคริปต์ (กลืนสีตามระดับเทาของตาราง · ด้านในเส้นขอบ = ทึบ · แสงฟุ้งนอกเส้น = โปร่งครึ่ง) · wk_spirit_rise มาโปร่งใสจริง (ตัดขอบอย่างเดียว) · ภูเขาผ่าเป็น 2 ไฟล์ตามรอยร้าวกลาง `wk_mountain_l` / `wk_mountain_r` (ขนาดเท่ากัน วางทับกัน = ภูเขาเต็ม) · รวม 11 ไฟล์ ≈ 610 KB

| ภาพ | ในเกม (char_wukong.js ส่วน 6a) |
|---|---|
| spirit_rise | `WkGiant`: ผงาดจากเมฆหลังตัวลิง 0.45 วิ → สว่าง → เหลือผีโปร่ง ~50 % หายใจช้าๆ ตลอดบัฟ → จางพร้อมลอยขึ้น · อัลติ A / อัลติ B / ออกจากเตา ใช้ตัวเดียวกัน (`giantOn` ไม่ซ้อน 2 ตัว) |
| spirit_plunge | `WkPlunge`: ดิ่งจากฟ้า ปลายไม้เท้าแตะเป้าตรงจังหวะดาเมจ (Sky-Pillar 0.34 วิ · ทุกครั้งที่ 5 ของ Ruyi Rhythm 0.14 / Thousand Staves 0.18) → ยุบ-เด้ง → ค้าง 0.2 วิ → แตกเป็นควันทอง · ร่างขนยักษ์เดิมเหลือขนาดปกติ |
| staff | `drawStaffPic` 3 ท่อน (หัวห่วง 0–288 · ด้ามยืด 288–444 · ปลาย 444–768): ไม้เท้าตกจากฟ้า (Pillar Smash, Needle, Leap, Mountain Splitter, Unbound, Equal to Heaven, Jingu Bang) ปลายทองลงพื้น · ไม้เท้ายืดแทง (Ruyi Rhythm, ไม้สุดท้ายของคอมโบ, Ruyi Shift) หัวห่วงพุ่งไปที่เป้า ไม้สั้นกว่าหัว+ปลาย = ตัดที่มือ |
| cloud | `WkCloud` (เลเยอร์เรียงลึก หน้าตัวลิง เท้าจมเมฆ): ใต้เท้าตอนพุ่ง หันตามทิศพุ่ง · ตอนลงจางแผ่ออก |
| mountain_l/_r | `WkMountain` (หลังเป้า/ตัวลิงแถวเดียวกัน): โผล่จากพื้น 0.07 วิ สั่น รอยร้าวสว่าง → แยกซ้าย-ขวา เอียงออก จม จาง + หินร่วงเด้งพื้น · Mountain Splitter สูง 145 · Equal to Heaven 190 แยกตรงจังหวะตี 0.2 วิ |
| furnace | `WkFurnace`: ครอบตัวลิง (มองไม่เห็นตัว) สั่นแรงขึ้น ไฟเรืองขึ้น 0.75 วิ → ระเบิด (ขยาย+จาง, เศษทองแดง, ไฟ, วงแหวน) → วิญญาณยักษ์ผงาดจนบัฟหมด |
| cave_pool | `WkCave` เลเยอร์พื้น ขอบหิน≈วงจริง (รัศมี 140) + ระลอกน้ำโค้ด |
| cave_falls | `WkCaveTop` (เรียงลึกที่ขอบหลังสระ: คนในสระอยู่หน้าม่าน) + เส้นน้ำไหล / ไอน้ำโค้ด |
| peach | `WkPeach`: เด้งขึ้นเหนือหัว → ถูกกิน หดลงที่ปาก |
| poof | `WkPoof` ทุก `hairPuff` (ร่างขนโผล่ / หาย / แปลงร่าง / ร่างแทน / ร่างยักษ์จาง) ขนาดตามจำนวนขน |

คำสั่งตัดที่ใช้ (ภาพดิบจากแชต, พิกัดเป็นพิกเซลของภาพดิบ):
```
K="python3 -I tools/checker_key.py"
$K peach.png wk_peach.png maxside=384 "seal=195,740,224,752;1036,757,1002,787"
$K falls.png wk_cave_falls.png maxside=640
$K furnace.png wk_furnace.png maxside=512
$K mountain.png wk_mountain.png maxside=512     # แล้วผ่าตามรอยร้าว: เส้น (257,0)(265,58)(267,64)(263,150)(256,200)(254,250)(250,300)(248,350)(246,400)(250,450)(262,490)(265,ล่างสุด) ขอบนุ่ม 1.5 px → _l / _r
$K poof.png wk_poof.png maxside=384 abar=0.3 sealw=9 "seal=180,465,220,473" "fillc=978,585,42"
$K pool.png wk_cave_pool.png maxside=640
$K cloud.png wk_cloud.png maxside=512
$K plunge.png wk_spirit_plunge.png maxside=640 abar=0.3
$K staff.png wk_staff.png maxside=768
# spirit_rise มาโปร่งใสแล้ว: ตัดขอบ (alpha > 6) + เผื่อ 6 px + ย่อ 640
```
แล้วแปลง webp (quality 86, alpha_quality 90)

ดาเมจ / จังหวะตีไม่เปลี่ยน (tools/fxlab.py hits ก่อน-หลังเท่ากัน) · `?wkfx=0` = ลุคโค้ดเดิม · ภาพยังโหลดไม่เสร็จ = วาดโค้ดเดิมแทน

ไฟล์ในเกม: `assets/fx/wukong/<ไฟล์>.webp` · ทีหลังถ้าอยากได้คลิป: วิญญาณยักษ์ (ภาพ 1) ทำเป็นวิดีโอพื้นดำแบบโอนิของแมวได้ ใช้ภาพที่ได้เป็นเฟรมแรก

STYLE (อยู่ในทุกพรอมต์แล้ว) = Friendly hand-painted chibi cartoon game effect matching the attached campfire key art: thick clean dark-brown outlines, cel shading with 2–3 flat tones, soft cartoon glow, bright and warm. Not realistic, not painterly smoke, not 3D. ONE single effect only, centered, transparent PNG background, generous empty space on every side, no text, no logo, no watermark.

---

## 1 · wk_spirit_rise — วิญญาณหงอคงยักษ์คำราม
```
Friendly hand-painted chibi cartoon game effect matching the attached campfire key art: thick clean dark-brown outlines, cel shading with 2–3 flat tones, soft cartoon glow, bright and warm. Not realistic, not painterly smoke, not 3D. ONE single effect only, centered, transparent PNG background, generous empty space on every side, no text, no logo, no watermark.
Effect: the giant golden spirit of the Monkey King rising out of a bank of golden clouds, like the lower right of the attached character sheet. A huge glowing see-through golden ape spirit with a fierce roaring face, open mouth with fangs, glowing yellow eyes, a flaming golden mane and a gold circlet with a cloud swirl on its forehead. Only the head, the shoulders and two huge open hands raised on both sides; the body fades into the golden clouds at the bottom.
Palette: bright gold, amber and warm white light.
VIEW: upright, facing the viewer, the flat bank of clouds as its base at the bottom. Portrait image, taller than wide.
```

## 2 · wk_spirit_plunge — วิญญาณหงอคงปักไม้เท้าลงจากฟ้า
```
Friendly hand-painted chibi cartoon game effect matching the attached campfire key art: thick clean dark-brown outlines, cel shading with 2–3 flat tones, soft cartoon glow, bright and warm. Not realistic, not painterly smoke, not 3D. ONE single effect only, centered, transparent PNG background, generous empty space on every side, no text, no logo, no watermark.
Effect: the giant golden spirit of the Monkey King high in the sky on golden clouds, gripping a gigantic glowing ringed staff with both fists and plunging it straight down. Top of the image: the spirit's roaring head with glowing yellow eyes, flaming golden mane and gold circlet, its shoulders and both fists around the staff, wrapped in golden clouds. The staff runs straight down through the middle of the image to the very bottom: a crown of dark iron rings sticking up above the fists, a long dark-wood shaft with gold bands and glowing gold edges, and a gold-capped tip at the bottom with a small burst of light where it strikes. Speed lines along the staff.
Palette: bright gold, amber, warm white light, dark wood and iron for the staff.
VIEW: upright, seen from the front, the staff perfectly vertical, its tip at the bottom centre of the image. Tall portrait image.
```

## 3 · wk_staff — ไม้เท้าห่วง (ยืด / แทง / ตกจากฟ้า)
```
Friendly hand-painted chibi cartoon game effect matching the attached campfire key art: thick clean dark-brown outlines, cel shading with 2–3 flat tones, soft cartoon glow, bright and warm. Not realistic, not painterly smoke, not 3D. ONE single effect only, centered, transparent PNG background, generous empty space on every side, no text, no logo, no watermark.
Effect object: the snow monkey's ringed staff on its own (look at the attached character sheet), perfectly straight and horizontal, pointing to the right. On the LEFT end a crown of dark iron rings with a gold knob, then a gold band, a long dark-wood shaft, and a gold-capped tip on the RIGHT end. The whole staff glows with a soft golden outline as if charged with power, a few sparkles along it. No hands, no character, no motion trail.
VIEW: side view, pointing right, the staff runs across almost the whole width of the image with empty space above and below. Wide image.
```

## 4 · wk_cloud — เมฆตีลังกา
```
Friendly hand-painted chibi cartoon game effect matching the attached campfire key art: thick clean dark-brown outlines, cel shading with 2–3 flat tones, soft cartoon glow, bright and warm. Not realistic, not painterly smoke, not 3D. ONE single effect only, centered, transparent PNG background, generous empty space on every side, no text, no logo, no watermark.
Effect object: the Monkey King's somersault cloud, a fluffy golden-white auspicious cloud with round puffy lumps and curly swirl tails trailing to the LEFT as it flies to the right, glowing warm gold underneath, a few small sparkles. Big enough for a small character to stand on its fairly flat top. No character on it.
VIEW: side view, flying to the right. Wide image.
```

## 5 · wk_mountain — ภูเขาห้านิ้ว
```
Friendly hand-painted chibi cartoon game effect matching the attached campfire key art: thick clean dark-brown outlines, cel shading with 2–3 flat tones, soft cartoon glow, bright and warm. Not realistic, not painterly smoke, not 3D. ONE single effect only, centered, transparent PNG background, generous empty space on every side, no text, no logo, no watermark.
Effect object: the Five-Finger Mountain, a huge grey-brown rock mountain shaped like a giant hand rising out of the ground, its five rocky peaks shaped like fingers, snow on the peaks, small rocks around its base. A thin glowing gold crack runs straight down the middle from the top to the base, as if it is about to split in two.
Palette: grey and brown stone, white snow, gold light in the crack.
VIEW: upright, seen from the front, flat base at the bottom. Square image.
```

## 6 · wk_furnace — เตาแปดทิศ
```
Friendly hand-painted chibi cartoon game effect matching the attached campfire key art: thick clean dark-brown outlines, cel shading with 2–3 flat tones, soft cartoon glow, bright and warm. Not realistic, not painterly smoke, not 3D. ONE single effect only, centered, transparent PNG background, generous empty space on every side, no text, no logo, no watermark.
Effect object: the Eight Trigrams Furnace from the Journey to the West legend, a big round bronze furnace on three short legs with a domed lid and a round knob, eight trigram symbols made only of straight bars around its body (no letters, no characters), bright golden fire glowing through its vents and the gap under the lid, little flames licking out, small cracks shining with golden light as if it is about to burst open.
Palette: bronze and dark brown, bright gold and orange fire.
VIEW: upright, seen from the front, flat base at the bottom. Square image.
```

## 7 · wk_cave_pool — สระหน้าถ้ำม่านน้ำ (ราบกับพื้น)
```
Friendly hand-painted chibi cartoon game effect matching the attached campfire key art: thick clean dark-brown outlines, cel shading with 2–3 flat tones, soft cartoon glow, bright and warm. Not realistic, not painterly smoke, not 3D. ONE single effect only, centered, transparent PNG background, generous empty space on every side, no text, no logo, no watermark.
Effect: the pool in front of the Water Curtain Cave lying flat on the ground, a round pool of clear turquoise water with gentle ripples and foam, rimmed by smooth grey rocks with a little snow, white splash foam along the far edge where a waterfall lands, sparkles on the water.
VIEW: flat on the ground, a wide ellipse seen from 3/4 top-down, nothing standing up. Wide image.
```

## 8 · wk_cave_falls — ม่านน้ำตกหน้าถ้ำ (ตั้งตรง)
```
Friendly hand-painted chibi cartoon game effect matching the attached campfire key art: thick clean dark-brown outlines, cel shading with 2–3 flat tones, soft cartoon glow, bright and warm. Not realistic, not painterly smoke, not 3D. ONE single effect only, centered, transparent PNG background, generous empty space on every side, no text, no logo, no watermark.
Effect object: the Water Curtain Cave, a natural stone arch of grey rock with a little snow on top, a curtain of shining white-blue waterfall pouring down across the whole opening of the arch, mist and splashes at the bottom, the dark cave mouth faintly visible behind the falling water.
VIEW: upright, seen from the front, flat base at the bottom. Wide image.
```

## 9 · wk_peach — ลูกท้อเซียน
```
Friendly hand-painted chibi cartoon game effect matching the attached campfire key art: thick clean dark-brown outlines, cel shading with 2–3 flat tones, soft cartoon glow, bright and warm. Not realistic, not painterly smoke, not 3D. ONE single effect only, centered, transparent PNG background, generous empty space on every side, no text, no logo, no watermark.
Effect object: the Peach of Immortality, one big plump peach blushing from pink to warm gold, with a small stem and two leaves, glowing softly with a golden halo and a few sparkles around it.
VIEW: seen face-on, centered. Square image.
```

## 10 · wk_poof — ควันแปลงร่าง
```
Friendly hand-painted chibi cartoon game effect matching the attached campfire key art: thick clean dark-brown outlines, cel shading with 2–3 flat tones, soft cartoon glow, bright and warm. Not realistic, not painterly smoke, not 3D. ONE single effect only, centered, transparent PNG background, generous empty space on every side, no text, no logo, no watermark.
Effect: a cartoon transformation puff, a burst of round white-and-golden smoke clouds popping outward with a few sparkles and two or three floating golden hairs, like the magic poof when a plucked hair turns into a copy of the hero.
VIEW: upright, seen from the front, flat base at the bottom. Square image.
```
