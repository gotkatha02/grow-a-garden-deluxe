# จากัวร์ (Eclipse Dancer) — พรอมต์ภาพเอฟเฟกต์สกิล (ChatGPT)

เจ้าของถาม 2026-11-25 20:25 'มีสกิลไหนเจนรูปได้เพื่อความสวยงาม แต่ที่มีตอนนี้ก็สวยแล้ว'

> **ใส่ในเกมแล้ว (2026-11-25 21:21 เจ้าของส่งครบ 5 รูป พื้นเขียว)** · ตัดพื้นเขียวด้วย `python3 -I tools/glow_cut.py <ภาพ> assets/fx/jaguar/<ชื่อ>.webp long=<512|540|768>` (เก็บแสงเรืองเป็นแสงนุ่ม แสงแดง/ส้มบนพื้นเขียวไม่กลายเป็นขอบสีขี้ม้า ขอบเส้นสีน้ำตาลไม่กลายเป็นเส้นแดง) · ต้นฉบับพื้นเขียวเก็บที่ `assets/fx/jaguar/raw/<ชื่อ>_green.webp` (ตัดซ้ำได้ผลเท่าเดิม) · ต่อโค้ด: `JPIC` ใน jaguar_vfx.js → `window.KPIC` → `art()` / `sprite()` ของ cat_vfx.js วาดภาพวาดแทนชิ้น SVG ชื่อเดียวกัน ที่ขนาด จุดยึด การหมุน การกลับด้าน และจังหวะเดิม (ภาพยังโหลดไม่เสร็จ = SVG ไปก่อน) · `?jgpic=0` = ลุค SVG เดิม · จังหวะโดนเหมือนเดิมทุกสกิล (fxlab hits เทียบกับ ?jgpic=0) · ปรับเพิ่ม: อุ้งเท้า ×.85 (ภาพวาดมีแขนไฟยาวกว่า SVG มาก) · หัวคำราม ×1.15 · เงาตามหลังตอนกระโจนเหลือเฉพาะห่างกัน (ภาพละเอียดซ้อนหลายชั้นแล้วเลอะ) · Godfall ยึดที่หัว (หัวลงถึงเป้าพอดี ไม่จมพื้นครึ่งตัว) · คลิปเทียบ: `DSF=2 python3 tools/fx/jgclip.py pic` กับ `pic '&jgpic=0'`

ตอนนี้เอฟเฟกต์ของจากัวร์เป็น SVG + โค้ดทั้งหมด (jaguar_vfx.js, ภาพ SVG ใน jaguar_art.js — ดู JAGUAR_FX_PLAN_TH.md)
ภาพที่ควรเจน = ตัวสัตว์วิญญาณ และของชิ้นใหญ่ที่ถูกเรียกออกมา เพราะ SVG วาดสัตว์ได้ไม่สวย (กติกาเจ้าของ 2026-11-20: ภาพวาดใช้กับของที่เรียกออกมาและบัฟ · รอยฟัน รอยตี ประกาย = VFX โค้ด)
ตรวจในเกมแล้ว (ภาพเทียบส่งเจ้าของในแชต ไม่เก็บใน repo): อุ้งเท้ายักษ์ดูเป็นถุงสีส้ม · วิญญาณเสือกระโจนเป็นก้อนทองมีจุด · หัวเสือคำรามแบน · จันทร์เลือดเป็นลูกบอลชมพูเรียบ · ดวงอาทิตย์ดำสวยอยู่แล้ว (ภาพ 5 = ไม่บังคับ)

แนบทุกครั้ง (แชต ChatGPT เดียวกันทั้ง 5 รูป): ภาพปกแคมป์ไฟ `assets/loading/ld5.webp` (สไตล์) + ชีตจากัวร์ `assets/heroes/jaguar/sheet_eclipse_dancer.webp` (สีขน ลายจุด) · 1 กล่อง = 1 รูป ส่งทีละกล่อง · พื้นหลังโปร่งใส (ถ้า ChatGPT วาดลายตารางหมากรุกมาแทน ตัดได้ด้วย tools/checker_key.py)

| # | ไฟล์ | ใช้กับสกิล | มุม | วางในเกม (ตอนต่อโค้ด) |
|---|---|---|---|---|
| 1 | jg_paw | Rending Fang (เล็ก) · Predator Drop · Sky-Pounce · Godfall · Predator's Echo | ตั้งตรง อุ้งเท้าชี้ลง (แนวตั้ง 2:3) | `GiantClaw` ตกจากฟ้า ปลายเล็บแตะเป้าตรง hitT (จุดยึด ay .86 = ปลายเล็บ) เอียงตามทิศ แล้วโค้ดตะปบ (rakeG) · สาย B ไม่วาดอุ้งเท้า (คงเดิม) |
| 2 | jg_spirit_leap | Predator Drop · Godfall (ดิ่งลง = หมุน 90°) | ด้านข้าง กระโจนไปขวา (กว้าง 3:2) | `SpectralPounce` pounce: บินตามเส้นโค้งของเกม เอียงหัวขึ้น→ลง + เงาจางตามหลัง (ภาพเดียวกันโปร่ง) |
| 3 | jg_spirit_roar | Predator's Cry (+ Death Defiance ถ้ากลับมาในสาย C) | ตั้งตรง หัว+ไหล่ หันขวา 3/4 ฐานเปลวไฟ (สี่เหลี่ยมจัตุรัส) | `SpectralPounce` aura: ผงาดหลังไหล่จากัวร์ คำราม 1.1 วิ กลับด้านตามทิศที่หัน |
| 4 | jg_blood_moon | Blood Moon Hunt (C) | มองตรง วงกลม (จัตุรัส) | `BloodMoon`: ขึ้นใหญ่หลังตัว (กว้าง ~100) แสงแดงส่องลง (โค้ด) แล้วหดเป็นดวงเล็กเหนือหัว |
| 5 | jg_black_sun *(ไม่บังคับ)* | Eclipse of the Fifth Sun (อัลติ B) · ระเบิดตราคราส (Eclipse Backstab, Black Horizon) | มองตรง วงกลม สมมาตรรอบตัว (จัตุรัส) | `DarkSun` ลอยเหนือพื้นที่ หมุนช้า ยุบตอนจบ · ชิ้นเล็กตอนตราคราสระเบิด |

ไม่ต้องเจน (โค้ดทำต่อ): รอยฟันมีดคู่ / รอยเล็บ / แผล / ประกาย (ต้องตรงเฟรมโดนและเปลี่ยนสีตามสาย) · วงหินปฏิทินบนพื้น (เปลี่ยนสีตามสาย) · ตราอสรพิษ ดอกพิษ กับดักจันทร์ หนามออบซิเดียน หอกตก ควันเงา · กระจกควัน (Obsidian Mirror) กับกลองศึก (Savage Tempo) เจนได้แต่ในเกมตัวเล็กมาก (~30–40 px) ภาพวาดไม่ช่วย ต้องขยายก่อน

ภาพวาดชุดเก่า 36 ภาพ (assets/fx/jaguar/j01–j36, ใช้กับ ?vfx3=0, พรอมต์เก่า JAGUAR_FX_PROMPTS_TH.md) วาดแบบไอคอน มีกรอบ / ลายฟัน / สีเขียวติดมา ใช้กับลุคใหม่ไม่เข้า จึงเจนใหม่

STYLE (อยู่ในทุกพรอมต์แล้ว) = Friendly hand-painted chibi cartoon game effect matching the attached campfire key art: thick clean dark-brown outlines, cel shading with 2–3 flat tones, soft cartoon glow, bright and warm. Not realistic, not painterly smoke, not 3D. ONE single effect only, centered, transparent PNG background, generous empty space on every side, no text, no logo, no watermark.

---

## 1 · jg_paw — อุ้งเท้าวิญญาณเสือยักษ์
```
Friendly hand-painted chibi cartoon game effect matching the attached campfire key art: thick clean dark-brown outlines, cel shading with 2–3 flat tones, soft cartoon glow, bright and warm. Not realistic, not painterly smoke, not 3D. ONE single effect only, centered, transparent PNG background, generous empty space on every side, no text, no logo, no watermark.
Effect: a giant spirit paw of a golden jaguar striking down from the sky. ONE front paw and a short forearm, seen from the side: the paw points straight DOWN, the toe pads at the bottom, big curved ivory-white claws fully out and hooking forward to the RIGHT. Golden-amber fur with dark-brown jaguar rosettes, the same fur as the jaguar dancer in the attached character sheet, made of glowing golden light and slightly see-through, a bright warm-white glow along the claws. The top of the forearm melts into rising golden spirit flames: no shoulder, no body, no character. No leaves, no slash marks, no speed lines.
Palette: golden amber and bright gold, dark-brown rosettes, ivory claws, warm white light.
VIEW: upright, the paw points straight down with the claw tips at the bottom centre of the image, the spirit-flame forearm at the top. Tall portrait image.
```

## 2 · jg_spirit_leap — วิญญาณเสือทองกระโจน
```
Friendly hand-painted chibi cartoon game effect matching the attached campfire key art: thick clean dark-brown outlines, cel shading with 2–3 flat tones, soft cartoon glow, bright and warm. Not realistic, not painterly smoke, not 3D. ONE single effect only, centered, transparent PNG background, generous empty space on every side, no text, no logo, no watermark.
Effect: the golden spirit jaguar of the jaguar dancer in the attached character sheet, in a full flying pounce to the RIGHT. Its body is stretched long and low: both front legs reach far forward with the paws open and the claws out, both back legs stretch far back, the long tail streams behind, mouth open with fangs, fierce glowing golden eyes, ears back. Golden-amber fur with dark-brown jaguar rosettes, cream muzzle and belly, made of glowing golden light and slightly see-through, a soft gold glow all around it. Only the tip of the tail dissolves into a short wisp of golden spirit flame. No ground, no shadow, no speed lines, no leaves.
Palette: bright gold, golden amber, cream, dark-brown rosettes, warm white light.
VIEW: side view, leaping to the right, the body almost horizontal across the middle of the image. Wide image.
```

## 3 · jg_spirit_roar — หัววิญญาณเสือคำราม
```
Friendly hand-painted chibi cartoon game effect matching the attached campfire key art: thick clean dark-brown outlines, cel shading with 2–3 flat tones, soft cartoon glow, bright and warm. Not realistic, not painterly smoke, not 3D. ONE single effect only, centered, transparent PNG background, generous empty space on every side, no text, no logo, no watermark.
Effect: the head and shoulders of a giant golden spirit jaguar roaring, the spirit animal of the jaguar dancer in the attached character sheet. The head is turned three-quarters to the RIGHT, jaws wide open with big fangs and a pink tongue, fierce glowing golden eyes, ears back, whiskers. Golden-amber fur with dark-brown jaguar rosettes and a cream muzzle, made of glowing golden light and slightly see-through. Below the chest it melts into rising golden spirit flames that make a soft flat base at the bottom: no legs, no body. No shock lines, no sound waves, no leaves.
Palette: bright gold, golden amber, cream, dark-brown rosettes, warm white light.
VIEW: upright, head and shoulders in three-quarter view facing right, the flat flame base at the bottom. Square image.
```

## 4 · jg_blood_moon — จันทร์เลือด
```
Friendly hand-painted chibi cartoon game effect matching the attached campfire key art: thick clean dark-brown outlines, cel shading with 2–3 flat tones, soft cartoon glow, bright and warm. Not realistic, not painterly smoke, not 3D. ONE single effect only, centered, transparent PNG background, generous empty space on every side, no text, no logo, no watermark.
Effect object: a huge blood moon for a jaguar hunter's night hunt. A perfectly round full moon glowing deep crimson, with darker wine-red craters and lighter rose-red highlights, a thin bright red-orange rim light and a soft crimson glow all around it, two thin wisps of dark-red mist drifting across its lower half. No face, no frame, no symbols, no text.
Palette: crimson, blood red, dark wine red, rose and orange light.
VIEW: seen straight from the front, one perfect circle in the middle of the image. Square image.
```

## 5 · jg_black_sun — ดวงอาทิตย์ดำ (ไม่บังคับ: ของเดิมสวยแล้ว)
```
Friendly hand-painted chibi cartoon game effect matching the attached campfire key art: thick clean dark-brown outlines, cel shading with 2–3 flat tones, soft cartoon glow, bright and warm. Not realistic, not painterly smoke, not 3D. ONE single effect only, centered, transparent PNG background, generous empty space on every side, no text, no logo, no watermark.
Effect object: the Black Sun of the Aztec Fifth Sun legend, a total eclipse like the one above the jaguar dancer's hand in the attached character sheet. A perfectly round deep black-violet disc with a faint purple swirl inside, ringed by a thin bright turquoise glowing rim, surrounded by a big spiky golden corona of sharp sun rays, long and short rays alternating evenly all the way round, a few small turquoise gems at the base of the long rays, a warm gold glow behind. Evenly symmetric all the way round so it can spin: no face, no top or bottom, no symbols, no text.
Palette: deep black-violet, turquoise, bright gold, warm orange glow.
VIEW: seen straight from the front, one perfect circle in the middle of the image. Square image.
```

---

## ตอนภาพมาถึง (ทำในแชตถัดไป)
1. ตัดพื้นหลัง: โปร่งใสจริง = ตัดขอบ (alpha > 6) + เผื่อ 6 px · ลายตารางหมากรุก = `python3 -I tools/checker_key.py <ภาพ> <ออก.png> maxside=…` (ค่า seal= / fillc= / abar= ตามภาพ เหมือน WUKONG_FX_PROMPTS_TH.md) → webp (quality 86, alpha 90) → `assets/fx/jaguar/jg_<ชื่อ>.webp` (ไม่ทับไฟล์เก่า j01–j36)
2. jaguar_vfx.js: ตาราง JPIC ชื่อภาพ → ไฟล์ · `art(n,…)` วาดภาพวาดแทน SVG เมื่อโหลดเสร็จ (paw ← jg_paw, jagLeap ← jg_spirit_leap, jagHead ← jg_spirit_roar, moon ← jg_blood_moon, eclipse ← jg_black_sun) ขนาด / จุดยึด / การเอียง / กลับด้าน เดิม · ยังไม่โหลด = SVG เดิม · `?jgpic=0` = ลุค SVG
3. ตรวจ: tools/fxlab.py hits เท่าเดิม (ภาพไม่แตะดาเมจ) · ภาพนิ่ง + คลิป (tools/fx/jgclip.py) ส่งเจ้าของ
