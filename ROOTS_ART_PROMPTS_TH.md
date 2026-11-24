# หน้ารากโทเท็ม — พรอมต์เจนภาพ (2026-11-22)

เจ้าของ 17:57: "เสร็จแล้วขอพรอมต์เจนภาพด้วย เอาให้มันสวยๆ" (หลังเปลี่ยนโหนดรากให้หลากหลายแบบ ROM)
ระบบ: RUNE_SYSTEM_TH.md ข้อ 2 · ม็อคอัปตอนนี้วาดด้วยโค้ด: `tools/mock_rune/roots.html?v=all` / `?v=zoom`

## แนวภาพ
- เรื่องเดียวกับหน้าศาลโทเท็ม: โทเท็มยักษ์แตก → **รากใต้ตอโทเท็ม** ยังมีพลัง ผู้เล่นจุดรากทีละดวงเพื่อปลุกสกิล C
- มองจากบนลงไปในดิน: **กลางอุ่น** (หัวใจราก สีทองอำพัน) → ดินทราย → ดินดำ → หินชนวนฟ้า → ขอบนอกหินม่วงมีคริสตัลฟ้าเทอร์ควอยซ์ = ความลึก 4 ชั้น (ยิ่งลึกยิ่งยาก)
- **ไม่วาดรากกับโหนดลงในฉาก** — ผัง 572 โหนดวาดด้วยโค้ดบนฉาก (ปรับผังได้ไม่ต้องเจนใหม่) · ภาพที่เจน = ฉาก + หัวใจ + ชิ้นโหนด
- โทนเดียวกับหน้าศาลโทเท็ม: ไม้น้ำตาลอุ่น ขอบทอง ลายซิกแซก / ก้นหอย พลอยเทอร์ควอยซ์ แสงทองอมฟ้า
- สีหินรูนตามกลุ่มค่า (ตรงกับม็อคอัป): แดง = สเตตัส · ส้ม = โจมตี · ชมพูปะการัง = เผ่า / ธาตุ · น้ำเงิน = ป้องกัน · ฟ้า = ใช้งาน · ทอง = สกิล C

## วิธีเจน
- แนบ 3 รูปทุกครั้ง: **campfire key art** (สไตล์เกม) + **ref_shrine.png** (ฉากศาลโทเท็ม) + **ref_base.png** (แท่นหินโทเท็ม) — 2 รูปหลังส่งให้แล้วในแชท
- ส่งทีละพรอมต์ = 1 รูป · รูปไหนพื้นไม่โปร่งใสก็ส่งมาได้ ตัดให้เอง (ข้อ 3–4 พื้นเขียวตั้งใจ ไว้ตัด)
- ได้รูปแล้ว: ตัดด้วย `GLOBAL=1 tools/iconsheet.py` (ข้อ 3–4) · วัดรูกลางกรอบด้วยสคริปต์แบบ tools/gems/totlay.py · ใส่แทนภาพในม็อคอัป แล้วส่งภาพให้ดู
- **2026-11-22 18:44 ได้ครบ 4 รูปแล้ว** → `assets/rune/roots/`: `bg.webp` (ฉาก 1536×1024) · `heart.webp` (640² โปร่งใสมาแล้ว) · `rs_<stat|off|slay|def|util|skill|dim|hole>.webp` (192², ตัดด้วย `tools/iconsheet.py <แผ่น> <ที่เก็บ> 4,4 …`) · `fr_c / fr_n / fr_b.webp` (512²; รูกลาง: เหรียญปม C ศูนย์ 254.9, 238.4 r 111.3 · หกเหลี่ยมสูงครึ่ง 239 รูใน ≈ r 128–140). ม็อคอัป `tools/mock_rune/roots.html` ใช้ภาพจริงแล้ว (`?art=0` = แบบวาดโค้ดเดิม): ฉากผูกกับผัง: วงรีดินในภาพ (ศูนย์ 756, 488 · ครึ่งแกน 503 × 386 จาก 1536 × 1024 รวมขอบดินสีเข้ม ไม่รวมหิน/คริสตัล) = ผังทั้งหมด + ขอบ 100 px (กรอบปม C ริมนอก + ชื่อ) → ผังอยู่ในดินเสมอทุกระดับซูม (เจ้าของ 19:09 'ผังตกขอบ ไหลขึ้นไปบนเพชร อยากให้อยู่แต่ในดิน') · ภาพรวมเห็นภาพเต็มความสูง · ภาพใกล้ขยาย ×3.4 จึงเติมเม็ดดินละเอียด (noise .28) · หินจุดแล้ว = หินของหมวด + แสงสีหมวด · ยังไม่จุด = หินทึบ + วงสีหมวดบาง · เลเวลยังไม่ถึง = เบ้าหินว่าง · โหนดใหญ่ = กรอบหกเหลี่ยม + สีหมวด · โบนัสสาย = เพชร · ปมสกิล C = ไอคอนสกิลตัดวงกลมใต้กรอบเหรียญ

## 1. ฉากใต้ดิน (แนวนอน 1536×1024)
```
Game menu background, landscape 1536x1024, seen from directly above, looking straight down into the magical earth under an ancient totem shrine. In the exact centre a soft warm golden-amber glow, as if a sacred seed were sleeping just below the surface; keep that centre empty and smooth (a glowing heart will be placed there later). Around it the ground changes in soft concentric zones going outward: warm sandy-brown soil near the centre, then rich dark loam with small pebbles and tiny spiral fossils, then deep slate-blue bedrock, and at the far edges dark violet stone with clusters of glowing turquoise crystals and faint aurora-coloured mist seeping up through the cracks. A few thin glowing turquoise mineral veins and a few carved stone fragments with totem zigzag and spiral patterns, placed sparsely, mostly near the outer edges. The middle area must stay calm, even and fairly dark, because hundreds of small glowing rune stones and roots will be drawn on top of it: no roots, no circles, no paths, no stones in a pattern, no characters, no animals, no text. Gentle dark vignette at the corners. Friendly hand-painted chibi cartoon style matching the attached art: clean dark-brown outlines, cel shading with 2-3 flat tones, soft cartoon glow, warm, magical and rich. Not realistic, not 3D, no painterly smoke.
```

## 2. หัวใจราก (จัตุรัส 1024×1024 พื้นโปร่งใส)
```
Game UI asset seen from directly above: the Root Heart, the place where all the roots of a great totem pole meet deep underground. A round flat totem medallion carved from warm brown wood, with a polished gold rim, small turquoise gems spaced around it and carved zigzag and spiral totem patterns; in its middle a large glowing amber-gold crystal seed with soft warm light pulsing out of it. Around the medallion, the beginnings of six thick twisted golden-brown roots spread outward evenly and end after a short distance (the game continues them). A soft golden glow and a few floating sparkles around it. The whole piece fills about 80% of a square 1024x1024 image with empty space on every side, transparent PNG background. Friendly hand-painted chibi cartoon style matching the attached art: clean dark-brown outlines, cel shading with 2-3 flat tones, soft cartoon glow. Not realistic, not 3D. No text, no letters.
```

## 3. หินรูนเล็ก 8 แบบ (แผ่นเดียว 4×2 พื้นเขียว)
ช่อง 1–6 = 6 กลุ่มค่าตอนจุดแล้ว · 7 = ยังไม่จุด · 8 = หลุมว่าง (ยังเดินไม่ถึง) · ตัวย่อค่า (STR, ATK …) โค้ดเขียนให้ใต้หิน
```
Game UI asset sheet: 8 small round rune stones for a magical skill web, arranged in a neat grid of 4 columns and 2 rows on a flat pure green (#00FF00) background, each stone centred in its cell with plenty of empty green around it, all exactly the same size and round shape, seen straight from the front. Each stone is a smooth, rounded, polished gem-stone set in a thin gold ring, with one simple bold glyph softly engraved and glowing in its middle.
Row 1: (1) ruby-red stone with a four-point star glyph, (2) bright orange stone with two crossed swords, (3) coral-pink stone with a fang-and-claw mark, (4) sapphire-blue stone with a small round shield.
Row 2: (5) sky-cyan stone with a feather, (6) gold-amber stone with a little flame crown, (7) the same stone NOT lit: dull grey-brown rock in a dark bronze ring, a faint carved ring and no glow, (8) an empty round socket dug into dark earth with a carved stone rim and a dark hole.
The lit stones glow softly in their own colour and have a small white highlight on the top-left like polished glass. Bold, simple, readable shapes, because they will be shown very small. Do not use any green inside the stones. Friendly hand-painted chibi cartoon style matching the attached art: clean dark-brown outlines, cel shading with 2-3 flat tones, soft cartoon glow. Not realistic, not 3D. No text, no letters, no numbers.
```

## 4. กรอบโหนดพิเศษ 3 แบบ (แผ่นเดียวแถวเดียว พื้นเขียว)
1 = เหรียญกรอบปมสกิล C (ไอคอนสกิลใส่ในรูกลาง) · 2 = โหนดใหญ่หกเหลี่ยม (โค้ดใส่สีตามกลุ่ม + ตัวย่อ) · 3 = โบนัสสายรูปเพชร
```
Game UI asset sheet on a flat pure green (#00FF00) background: 3 pieces in one row with lots of empty green between and around them, all seen straight from the front and perfectly symmetrical.
(1) A big round medallion frame for a legendary skill: a ring of carved warm-brown wood and grey stone with a polished gold rim, small turquoise gems, little totem zigzag and spiral carvings, and two short feathers hanging from the bottom. Its middle is a completely empty round hole, flat dark brown, about two thirds of the medallion's width (a skill icon will be placed inside).
(2) A hexagon-shaped carved stone tile with a polished gold rim and small turquoise studs on its six corners; its middle is an empty, flat, dark-brown hexagon.
(3) A diamond-shaped tile (a square turned 45 degrees) of carved stone with a gold rim and a glowing amber crystal in the middle.
The medallion is about twice as wide as each of the other two. Do not use any green inside the pieces. Friendly hand-painted chibi cartoon style matching the attached art: clean dark-brown outlines, cel shading with 2-3 flat tones, soft cartoon glow. Not realistic, not 3D. No text, no letters.
```

## ถ้าอยากได้เพิ่ม (ยังไม่ต้องเจน)
- ไอคอนความสามารถขั้นสเตตัส 99 / 200 / 300 (6 ค่า × 3) สำหรับหน้าต่างสเตตัส (MILESTONES_TH.md)
- ฉากวงเศษโทเท็ม + รูนวิญญาณ 18 ไอคอน + รูนสี (RUNE_SYSTEM_TH.md ข้อ 5 ข้อ 2–4) — รอเคาะระบบวงเศษก่อน
