# อนูบิส — พรอมต์ภาพเอฟเฟกต์สกิล ชุดของชิ้นใหญ่ที่ถูกเรียกออกมา (ChatGPT)

เจ้าของถาม 2026-11-25 20:23 'อนูบิสมีสกิลไหนเจนรูปได้เพื่อความสวยงาม แต่ที่มีตอนนี้ก็สวยแล้ว' → 21:16 / 21:25 'ขอพรอมต์ทำรูป'
(ส่งเป็นกล่องในแชตแล้ว 21:28 พร้อมไฟล์แนบ 2 รูป) → **21:43 เจ้าของส่งครบ 5 รูป ใส่เกมแล้ว** (ดูหัวข้อ 'ใส่เกมแล้ว' ท้ายไฟล์)

ตอนนี้เอฟเฟกต์ของอนูบิสเป็นโค้ด + SVG ทั้งชุด (v4: anubis_vfx.js, anubis_art.js — ดู ANUBIS_FX_PLAN_TH.md)
ภาพที่ควรเจน = ของชิ้นใหญ่ที่ถูกเรียกออกมา (กติกาเจ้าของ 2026-11-20: ภาพวาดใช้กับของที่อัญเชิญออกมาและบัฟ · รอยฟัน ประกาย ฝุ่น = VFX โค้ด)
SVG วาดชิ้นใหญ่ได้แค่เงาแบน รายละเอียดน้อย: หัวอนูบิสยักษ์ · ตาชั่งยักษ์ · ประตูยมโลก · ธงสุริยะ

แนบทุกครั้ง (แชต ChatGPT เดียวกันทั้ง 5 รูป): ภาพปกแคมป์ไฟ `assets/loading/ld5.webp` (สไตล์) + ชีตลุคใหม่ `assets/heroes/anubis/sheet_reborn.webp` (สี / ลาย)
1 กล่อง = 1 รูป ส่งทีละกล่อง · พื้นหลังโปร่งใส (ถ้าออกมาเป็นลายตารางหมากรุกแทน ตัดได้ด้วย tools/checker_key.py)

| # | ไฟล์ | ใช้กับสกิล | มุม | วางในเกม (ตอนต่อโค้ด) |
|---|---|---|---|---|
| 1 | an_head_open | Anubis Verdict (C) · Avatar of Anubis (C) | ด้านข้าง หันขวา อ้าปาก (จัตุรัส) | `verdictOn`: หัวเอียงลงเหนือเป้า อ้าปาก → เฟรมดาเมจสลับเป็นรูป 2 + แสงม่วงข้างหลัง · `avatarBurst`: ผุดหลังตัวครั้งเดียว แสงทอง |
| 2 | an_head_closed | เหมือนข้อ 1 | **แก้จากรูป 1** (ระบายเลือกเฉพาะขากรรไกรล่างกับช่องปาก) | สลับตอนงับ — หัวส่วนอื่นต้องตรงกับรูป 1 ทุกจุด |
| 3 | an_scales | Hall of Two Truths (อัลติ B) · Final Judgment (ตาชั่งเล็กเหนือหัวเป้า) | มองตรง ฐานแบนด้านล่าง (จัตุรัส) | ตัดเป็น เสา+ฐาน / คาน / จาน+เชือก ×2 → `drawScales`: คานเอียงลงตามจำนวนครั้งที่ทุบ จานห้อยตรงเสมอ · หัวใจม่วง + ขนนกมาอัต = โค้ดเหมือนเดิม |
| 4 | an_gate | Underworld Gate (ตอนโผล่ออก) · Death's Door (บาปครบ 3) | มองตรง ธรณีประตูแบนด้านล่าง (แนวตั้ง) | `gateOut` / `pounceFx`: ผุดขึ้นจากพื้นแทน SVG `anGate` |
| 5 | an_standard | Standard of Ra | มองตรง ปลายเสาแหลมอยู่ล่างกลาง (แนวตั้งสูง) | `stdFx`: ปักพื้นแทน SVG `anStd` โยกเบา ๆ เหมือนเดิม |

**ไม่ต้องเจน ใช้ภาพเดิม (ทำแล้ว 2026-11-25):** `assets/fx/anubis/ra_sun.webp` (ลูกตุ้มในดวงอาทิตย์จากชุดภาพวาดเก่า)
- Wheel of Ra: ลูกตุ้มที่โคจรรอบตัว = ภาพนี้ หันโซ่เข้าหามือเสมอ กว้าง 104
- Ra's Wrath: ดวงอาทิตย์ที่ตกใส่วงเป้า = ภาพนี้ โซ่ลากตามหลังไปทางที่ตกลงมา กว้าง 150
- ใช้ `raSun()` ใน anubis_vfx.js · ยังโหลดไม่เสร็จ = ดวงอาทิตย์ SVG · `?anpic=0` = SVG
- จังหวะโดนเท่าเดิม (`tools/fxlab.py hits`)

**ไม่ต้องเจน (โค้ดทำต่อ):** ลูกตุ้ม ตะขอ อังค์ ขนนก หัวใจ เงาหมาจิ้งจอก โซ่ ประกาย ฝุ่น พายุทราย วงบนพื้น (สุริยะ / ตัดสิน / ตราโอซิริส / อังค์ / ดอกบัว)
- ชิ้นพวกนี้บนจอเล็กและขยับเร็ว รายละเอียดภาพวาดแทบมองไม่เห็น
- โค้ดเปลี่ยนสีตามสายได้ และลงตรงเฟรมโดน

ภาพวาดชุดเก่า 26 ภาพ (assets/fx/anubis, ใช้กับ ?vfx3=0, พรอมต์เก่า ANUBIS_FX_PROMPTS_TH.md) วาดเป็นการ์ดที่มีไฟ / ประกายติดมาในภาพและมุมตายตัว ขยับให้งับหรือเอียงคานไม่ได้ จึงเจนใหม่ (ยกเว้น ra_sun)

STYLE (อยู่ในทุกพรอมต์แล้ว) = Friendly hand-painted chibi cartoon game effect matching the attached campfire key art: thick clean dark-brown outlines, cel shading with 2–3 flat tones, soft cartoon glow, bright and warm. Not realistic, not painterly smoke, not 3D. ONE single effect only, centered, transparent PNG background, generous empty space on every side, no text, no logo, no watermark.

ทุกชิ้นขอ 'solid / no glow halo' — แสงสีทอง / ม่วงรอบชิ้นให้โค้ดใส่ จะได้ใช้ภาพเดียวกับสองสาย (หัวอนูบิส: Avatar ทอง, Verdict ม่วง) และขอบตัดสะอาด

---

## 1 · an_head_open — หัวอนูบิสยักษ์ ตอนอ้าปาก
```
Friendly hand-painted chibi cartoon game effect matching the attached campfire key art: thick clean dark-brown outlines, cel shading with 2–3 flat tones, soft cartoon glow, bright and warm. Not realistic, not painterly smoke, not 3D. ONE single effect only, centered, transparent PNG background, generous empty space on every side, no text, no logo, no watermark.
Effect object: the giant spirit head of the god Anubis, the god form of the black jackal hero in the attached character sheet, about to bite. Only the head and the top of the neck. Glossy black jackal with plum-black shading: very tall pointed ears with dusty-pink insides, a long narrow muzzle with a black nose, the jaws WIDE OPEN (the lower jaw dropped about 35 degrees), sharp white fangs on both jaws, a dark-red mouth with a pink tongue, a narrow glowing gold eye with a gold kohl line and a small gold mark under it, a thin gold brow band. A royal headcloth with deep-blue and gold stripes covers the back of the head behind the ears and falls to the neck. At the bottom of the neck, a wide gold collar with lapis-blue and turquoise beads; its bottom edge is a clean straight line. Solid and opaque with a crisp outline: no body, no shoulders, no flames, no smoke, no sparkles, no glow halo around it.
Palette: glossy black, plum, gold, deep blue, turquoise, white fangs, dark-red mouth.
VIEW: exact side view (profile) facing RIGHT, the open jaws pointing to the right. Square image.
```

## 2 · an_head_closed — หัวอนูบิส ตอนหุบปาก (แก้จากรูป 1)
กด Edit ที่รูป 1 → ระบายเลือกเฉพาะขากรรไกรล่างกับช่องปากที่อ้า → ส่งกล่องนี้ (ห้ามเจนใหม่ทั้งรูป: ส่วนอื่นของหัวจะเปลี่ยน สลับกันแล้วกระตุก)
```
Close the jaws: the lower jaw shut tight against the upper jaw, the white fangs interlocking, only a thin dark mouth line showing. Same cartoon style. Change nothing else: same head, same size, same position, same headcloth, eye and collar, transparent background.
```

## 3 · an_scales — ตาชั่งมาอัตยักษ์
```
Friendly hand-painted chibi cartoon game effect matching the attached campfire key art: thick clean dark-brown outlines, cel shading with 2–3 flat tones, soft cartoon glow, bright and warm. Not realistic, not painterly smoke, not 3D. ONE single effect only, centered, transparent PNG background, generous empty space on every side, no text, no logo, no watermark.
Effect object: the giant golden Scales of Ma'at from the Egyptian Hall of Two Truths, the judgment scales of the black jackal hero in the attached character sheet. A tall straight golden post on a stepped base of black stone with gold trim, decorated with lapis-blue and turquoise inlays and gold bands; a small golden ankh stands on the very top of the post. The balance beam is ONE straight golden bar laid across the top of the post just under the ankh, PERFECTLY LEVEL, with a round gold pivot cap in the middle and a small ring at each end. From each end ring, three thin golden cords hang straight down to a round shallow golden pan with a lapis-blue rim. Both pans are EMPTY and hang at the same height, below the middle of the post. Leave clear empty space between each pan and the post: the pans and cords touch nothing except their own end ring. No heart, no feather, no figures, no flames, no sparkles, no glow halo.
Palette: bright gold, black stone, lapis blue, turquoise.
VIEW: seen straight from the front, upright, the flat stone base at the bottom. Square image.
```

## 4 · an_gate — ประตูยมโลก
```
Friendly hand-painted chibi cartoon game effect matching the attached campfire key art: thick clean dark-brown outlines, cel shading with 2–3 flat tones, soft cartoon glow, bright and warm. Not realistic, not painterly smoke, not 3D. ONE single effect only, centered, transparent PNG background, generous empty space on every side, no text, no logo, no watermark.
Effect object: the Gate of the Duat, the Egyptian underworld door that the black jackal hero in the attached character sheet steps out of. An Egyptian temple doorway of black stone with gold trim: two slightly sloping pillars and a heavy lintel with a gold winged sun disc in the middle, small simple gold carvings down each pillar (plain shapes, no letters, no writing), and a small golden jackal statue lying on each top corner of the lintel. The doorway is open and filled with swirling deep-violet underworld light, brightest and almost white at the bottom centre, with a few faint purple soul-fire wisps inside the opening only. The bottom is a flat stone threshold. Nothing outside the gate: no flames, no smoke, no sparkles, no ground, no shadow, no glow halo.
Palette: black stone, gold, deep violet, lavender, white light.
VIEW: seen straight from the front, upright, the flat threshold at the bottom. Portrait image.
```

## 5 · an_standard — ธงสุริยะของรา
```
Friendly hand-painted chibi cartoon game effect matching the attached campfire key art: thick clean dark-brown outlines, cel shading with 2–3 flat tones, soft cartoon glow, bright and warm. Not realistic, not painterly smoke, not 3D. ONE single effect only, centered, transparent PNG background, generous empty space on every side, no text, no logo, no watermark.
Effect object: the Standard of Ra, a sacred Egyptian battle standard that the black jackal hero in the attached character sheet plants in the ground. A tall straight golden pole with a pointed foot at the bottom. At the top: a glowing golden-orange sun disc with a small gold cobra in front of it, between two wide outstretched falcon wings with gold, lapis-blue and turquoise feathers. Under the wings, two long cloth streamers hang from the pole and wave a little to the left and right: one deep red, one lapis blue, each with a gold tip. A small gold ankh ornament on the pole below the streamers. No ground patch, no shadow, no flames, no sparkles, no glow halo.
Palette: gold, golden orange, lapis blue, turquoise, deep red.
VIEW: seen from the front, perfectly upright, the pointed foot at the bottom centre. Tall portrait image.
```

---

## ตอนภาพมาถึง (แผนเดิม — ทำแล้ว ดูหัวข้อถัดไป)

1. **ตัดพื้นหลัง**
   - โปร่งใสจริง: ตัดขอบ (alpha > 6) + เผื่อ 6 px
   - ลายตารางหมากรุก: `python3 -I tools/checker_key.py <ภาพ> <ออก.png> maxside=…` (ค่า seal= / fillc= / abar= ตามภาพ เหมือน WUKONG_FX_PROMPTS_TH.md)
   - แปลงเป็น webp (quality 86, alpha 90) → `assets/fx/anubis/an_<ชื่อ>.webp` ห้ามทับไฟล์เก่า 26 ไฟล์ (ใช้กับ ?vfx3=0)
2. **หัวอนูบิส**
   - ตรวจว่ารูปหุบปากซ้อนรูปอ้าปากตรงทุกจุด (หู ตา ผ้าคลุม ปลอกคอ) ถ้าการแก้ทำให้ภาพเลื่อนหรือย่อ ให้จัดตำแหน่งใหม่ให้ตรงกัน แล้วใช้ผืนภาพขนาดเดียวกัน
   - จุดยึดอยู่ที่ขอบปลอกคอด้านล่างกลาง
   - ตอนงับ ไล่จากรูปอ้าไปรูปหุบภายใน 0.05 วิ ตรงเวลาดาเมจ (`verdictOn` ใช้ `T = .3`)
3. **ตาชั่ง**
   - ตัดเป็น 4 ชิ้น:
     - เสา + ฐาน + อังค์ (ส่วนของเสาที่คานบังอยู่ เติมสีจากแถวเสาด้านล่าง)
     - คาน + ฝาครอบจุดหมุน + ห่วงปลายคาน
     - จานซ้าย + เชือก 3 เส้น
     - จานขวา + เชือก 3 เส้น
   - จดพิกัดจุดหมุนกับห่วงปลายคาน → `drawScales` วาดคานหมุนรอบจุดหมุนตามค่า tilt เดิม จานห้อยตรงจากห่วง
   - หัวใจกับขนนกวาดลงในจานด้วยโค้ดเหมือนเดิม
4. **anubis_vfx.js**
   - เพิ่มชื่อภาพใหม่ในตาราง `PSRC` (ตอนนี้มีแค่ `raSun`)
   - `img(name)` = ภาพเมื่อโหลดเสร็จ ไม่งั้นได้ null และโค้ด SVG เดิมวาดแทน · `?anpic=0` = SVG ทั้งหมด
   - ขนาด / จุดยึด / เวลา ให้ใช้ของ SVG เดิม
   - แสงด้านหลังให้โค้ดใส่: หัว Avatar สีทอง · หัว Verdict สีม่วง · ประตูยมโลกสีม่วง · ธงสีทอง
5. **ตรวจ**
   - `tools/fxlab.py hits` ต้องได้เท่าเดิม (ภาพไม่แตะดาเมจ)
   - ภาพนิ่ง (`tools/fxlab.py strip`) + คลิป (`DSF=2 MAP=egyF1 python3 tools/fx/anclip.py b|c`) แล้วส่งเจ้าของ

## ใส่เกมแล้ว (2026-11-25)

ภาพที่ได้ = PNG โปร่งใสจริงทั้ง 5 รูป (1254 px) → `python3 -I tools/fx/anubis_pics.py OPEN.png CLOSED.png SCALES.png GATE.png STANDARD.png [preview=PNG]`
- ย่อ 0.5 ตัดขอบ + เผื่อ 6 px → `assets/fx/anubis/an_head_open / an_head_closed / an_gate / an_standard / an_sc_post / an_sc_beam / an_sc_panL / an_sc_panR .webp` (รวม ~285 KB โหลดเฉพาะตอนเล่นอนูบิส)
- หัว 2 รูปใช้กรอบเดียวกัน (รูปหุบถูกวาดใหม่บางเส้นแต่ตรงกันภายใน 1 px) → สลับรูปตอนงับได้ไม่กระตุก
- ตาชั่งตัด 4 ชิ้นด้วยมาสก์ตามพิกัด: คาน = แท่ง + ห่วงปลาย + ปีก + อัญมณีจุดหมุน · จาน = ห่วงใต้ปลายคาน + เชือก 3 เส้น + จาน · เสา = อังค์ + เสา + ฐาน (ช่วงเสาที่คานบังเติมจากแถวเสาด้านล่าง คานเอียงแล้วไม่เห็นรู)
- เครื่องมือพิมพ์ตารางจุดยึด `ANPIC` (หน่วยพิกเซลของภาพที่ย่อแล้ว) → คัดลอกไว้ใน anubis_vfx.js

**anubis_vfx.js** (`PSRC` / `img()` / `pdraw()` / `halo()`; ภาพยังโหลดไม่เสร็จ = SVG เดิม · `?anpic=0` = SVG ทั้งหมด)
- `halo(ภาพ, สี)` = แสงนุ่มรอบขอบภาพ สร้างครั้งเดียวที่ขนาด 1/4 (ไม่ใช้ canvas filter) วาดหลังภาพแบบ lighter → หัวสีดำเห็นชัดทั้งบนทราย บนหิมะ และบนบ่อเงา
- **Anubis Verdict** (`verdictPic`): หัวอ้าปาก (กว้าง 172, บอส ×1.3) ผุดขึ้น**หลังเป้าฝั่งไกล หันหน้าเข้าหาฮีโร่** (ไม่บังตัวเรา) → เงยหัวถอย → พุ่งลงใน 75 ms สุดท้าย → **ตรงเวลาดาเมจ (T = .3) สลับเป็นรูปหุบปาก** จุดงับอยู่บนตัวเป้า + บีบ / เด้ง / สั่น → ค่อยลอยขึ้นจาง · แสงม่วง
- **Avatar of Anubis** (`avatarPic`): หัวกว้าง 190 × HERO_K ผุดจากพื้นหลังตัว (จุดยึด = ใต้ปลอกคอ) อ้าปากคำราม → 0.55 วิ หุบปาก (บีบเบา ๆ) → ลอยขึ้นช้า ๆ แล้วจาง · หันตามทิศฮีโร่ · แสงทอง
- **ตาชั่ง** (`scalesPic` ใน `drawScales`, SCF = 0.1876 พิกเซลต่อพิกเซลภาพที่ k = 1): เสายืนที่จุดฐาน · จานห้อยตรงจากห่วงปลายคานที่หมุนแล้ว (วาดใต้คาน) · คานหมุนรอบอัญมณีตามค่า tilt เดิม (+ = ฝั่งหัวใจลง) · หัวใจม่วง / ขนนก = โค้ดบนขอบจาน → ใช้ทั้ง Hall of Two Truths (k 1.55 สูง ~180) และ Final Judgment (k .82 เหนือหัวเป้า)
- **Second Verdict** (`panFall`): จานขวาภาพวาดตกใส่เป้า (สเกล .36) แทนจาน SVG + เส้น 2 เส้น
- **Underworld Gate** ตอนโผล่ (`gatePic`, กว้าง 128 × HERO_K) + **Death's Door** (กว้าง 118, บอส ×1.3): ประตูงอกขึ้นจากพื้น (ความสูงเด้งเกิน) ฝุ่นหินที่ฐาน ช่องประตูเรืองม่วงเป็นจังหวะ แล้วจมกลับลงพื้น · แสงม่วงรอบขอบ
- **Standard of Ra** (`stdPic`, กว้าง 64): ปักครั้งแรก = ตกจากฟ้า 0.16 วิ ปลายหอกแทงลงพื้น (ส่วนที่จมถูกตัดที่เส้นพื้น) ฝุ่น + วงทอง + แสงวาบ แล้วสั่นค้างก่อนโยกเบา ๆ ตามลม · กลับมาหลังเปลี่ยนแมพ = ไม่ตกซ้ำ · จานสุริยะมีแสงทอง + ดาวหมุน
- จังหวะโดนเท่าเดิม: `tools/fxlab.py hits` ของ acVerdict, acAvatar, abHall, abJudge, abGate, abPounce, anStandard (สุ่มตายตัว + ไม่มี MISS) ตรงกับ `q=anpic=0` ทุกค่า
- คลิปโชว์: `DSF=2 MAP=egyF1 OUT=dir python3 tools/fx/anclip.py pics`

