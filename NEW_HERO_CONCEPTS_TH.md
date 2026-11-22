# ฮีโร่ใหม่: ร่างแยก + ออโต้สเปล (2026-11-22)

เจ้าของ 22:22: "ถ้าจะสร้างตัวละครใหม่ มีสกิลแยกร่างที่กดโจมตีจังหวะตามเรา เน้น auto spell ทั้งเวทย์และกายภาพ คอนเซปตามนี้เป็นสัตว์อะไรดี" → เสนอ 3 ตัว (แนะนำหงส์)
เจ้าของ 22:25: "ขอพร้อมดีไซน์ทั้ง3ตัวหน่อย" → พรอมต์ชีตดีไซน์ 3 ตัวอยู่ข้างล่าง · **ยังไม่ได้สร้างอะไรในเกม รอเจ้าของเลือกตัว**
เจ้าของ 22:33: "แต่ละตัว เพลสไตล์ต่างกันไหม" → ร่างแรกใช้สูตรเดียวกันทั้ง 3 ตัว (A ทุกการตีครั้งที่ 4 ปล่อยท่าเอง · B ทุกครั้งที่ 3 ร่ายเวทเอง) ต่างแค่หน้าตา → แยกใหม่ให้ร่างแยกต่างกันที่ **ตีตามเราตอนไหน · ตรงไหน · กี่ร่าง** (ตารางข้างล่าง แทนร่างแรก)

## กติกาที่ใช้กับทุกตัว
- ร่างแยกทำท่าเดียวกับเราตามจังหวะ (ตีปกติ + สกิล) · ดาเมจของร่างแยก = ส่วนหนึ่งของดาเมจเรา (ปรับด้วย bench)
- ออโต้สเปลใช้ตัวนับ ไม่ใช้โอกาสสุ่ม (กฎข้อ 2): "ทุกการตีครั้งที่ n"
- เป็นฮีโร่สองทาง: สาย A = ATK (กายภาพ) · สาย B = MATK (เวท) ตามกฎ 'แก้บัค 4' · สายพื้นฐาน = ร่างแยกเอง
- จุดขายข้อ 2 (เจม): เจมแปรสภาพเปลี่ยนว่าร่างแยกก็อปอะไร / ช่องออโต้สเปลให้ผู้เล่นเลือกสกิลที่จะร่ายเอง
- โค้ดวาดร่างโคลนจากสไปรต์ฮีโร่มีอยู่แล้ว: KClone (Shadow Dance ของแมว, cat_vfx.js) · WClone (Valhalla's Wrath ของหมาป่า, wolf_fx.js)

## จำนวนฮีโร่ต่อดินแดน (char_create.js)
นอร์ส 3 (หมาป่า แรด นกฮูก) · แอซเท็ก 3 (เสือจากัวร์ แอกโซลอเติล จระเข้) · ญี่ปุ่น 3 (แมว มังกร คิตสึเนะ) · อียิปต์ 3 (ฮิปโป บาสเต็ต อนูบิส) · **กรีก 2 (แกะ สิงโต)**

## เพลย์สไตล์ 3 ตัวต่างกันยังไง (22:33)
ทั้ง 3 ตัวร่างแยกก็อปท่าเรา ต่างกันที่ **ตอนไหน · ตรงไหน · กี่ร่าง**

| | หงส์ · คู่เต้นกระจก | อีกา · จำแล้วเล่นซ้ำ | ลิง · ฝูงร่างแยก |
|---|---|---|---|
| ร่างแยก | 1 ร่าง แข็ง · ยืนฝั่งตรงข้ามเป้าหมายเสมอ · ตีพร้อมเราเฟรมเดียวกัน | 2 ร่าง · มูนินตีตามเราช้ากว่า 1 จังหวะ (เสียงสะท้อน) · ฮูกินบินไปเป็นจุดร่ายที่สอง | หลายร่างเล็ก ตัวละอ่อน · ตีพร้อมเราทั้งฝูงรอบตัว · ล่อมอนให้หันไปตีแทน |
| ระยะ | ประชิด ขยับตัวเยอะ · สลับที่กับร่างเงาเพื่อหลบ | กลาง (หอก) | ประชิด–กลาง (กระบองยืดได้) |
| เก่ง / อ่อน | ดวลบอสตัวเดียว / โดนรุมเยอะ | ทุ่มดาเมจลงช่วงเปิดของบอส (4–8 วิ DEF / MDEF 0) / ตีต่อเนื่องยาวๆ | ฟาร์มมอนเป็นกลุ่ม · เหมาะออโต้ / บอสตัวเดียวช้ากว่าเพื่อน |
| ความยาก | กลาง (ตำแหน่ง) | ยาก (วางลำดับท่า) | ง่าย |
| เด่นกับบอส | จอมทัพอินทรี (โล่หน้า ต้องอ้อมไปตีหลัง) | ช่วงเปิดของบอสทุกตัว | ฮุลดรา 5 ร่าง · โจนินเงาปลอมตัว · มายาวีล่องหน (เนตรทองช่วยหา) |
| ใกล้ตัวเก่า | แมว: ดาบเร็ว + Shadow Dance (สกิล C บัฟชั่วคราว ร่างเงา 2 ร่างยืนข้างไหล่) → หงส์ทั้งชุดสร้างรอบร่างเงาที่ยืนอีกฝั่งของเป้า | นกฮูก: นกนอร์สเหมือนกัน → นกฮูกยิงไกล อีกาหอกระยะกลาง + เล่นซ้ำ | บาสเต็ต B: เรียกกองทัพ → ทหารบาสเต็ตเดินเอง ร่างลิงก็อปท่าเรา |

เลือกตามอะไร: เล่นไม่ซ้ำใครที่สุด = อีกา (ไม่มีฮีโร่ไหนเก็บท่าแล้วเล่นซ้ำ) · เติมดินแดนที่ขาด = หงส์ · คนไทยรู้จักที่สุด = ลิง

## 1. หงส์แฝดเจมิไน — กรีก (แนะนำ)
- ตำนาน: ซุสแปลงเป็นหงส์ → ฝาแฝดคาสเตอร์กับพอลลักซ์ฟักจากไข่หงส์ → กลุ่มดาวคนคู่ (Gemini) · ภาพหงส์ขาว–หงส์ดำ + เงาสะท้อนบนผิวน้ำ = ร่างแยก · ท่าทางนักดาบ–นักบัลเลต์ เข้ากับ "ตีตามจังหวะ"
- ทำให้กรีกครบ 3 ตัวเท่าดินแดนอื่น · เป็นฮีโร่หญิง (หญิงตอนนี้: มิโกะ บาสเต็ต แกะ)
- พื้นฐาน (22:33): เงาสะท้อนลุกจากวงน้ำ ยืน **ฝั่งตรงข้ามเป้าหมายเสมอ** (กระจกรอบตัวเป้า) ทำท่าเดียวกับเราในเฟรมเดียวกัน · สลับที่กับร่างเงาได้ (ท่าหลบ)
- A กายภาพ "หงส์ดำ · ดาบคู่": เรากับร่างเงาโดนเป้าเฟรมเดียวกันจากสองฝั่ง = 1 แต้มประกบ · ทุกการประกบครั้งที่ 3 → ท่าดาบคู่ปล่อยเอง (ออโต้กายภาพ) · ประกบติดกันไม่ขาด = แรงขึ้นทีละขั้น (บวกตรง) · ถนัดเป้าเดียว
- B เวท "ดาวเจมิไน · ถักกลุ่มดาว": ตีโดนแล้วทิ้งดาวไว้บนพื้น (สูงสุด 5) ดาวโยงเส้นกันเอง ศัตรูที่เดินผ่านเส้นโดนเวท · ครบรูปกลุ่มดาว → ร่ายเวทในช่องออโต้สเปล ร่างเงาร่ายกระจกอีกฝั่ง · คุมพื้นที่ระยะกลาง
- (ร่างแรก 22:22 ถูกแทน: A เพิ่มร่างตามการตีต่อเนื่องสูงสุด 3 · B ทุกการตีครั้งที่ 3 จุดดาว)

## 2. อีกาแห่งโอดิน — นอร์ส
- ตำนาน: ฮูกิน (ความคิด) กับมูนิน (ความจำ) อีกาสองตัวของโอดิน · โอดินเสียตาข้างหนึ่ง → ผ้าปิดตารูน · หมวกปีกกว้างของผู้พเนจร · หอกแบบกุงนีร์
- ตำนานเข้ากับคอนเซปต์ตรงที่สุด แต่นอร์สมี 3 ตัวแล้ว และมีนกฮูกอยู่แล้ว
- พื้นฐาน (22:33): ร่างแยก 2 ร่าง **ไม่ตีพร้อมเรา** — มูนิน (ร่างเงาควันม่วง) ตีตามเราช้ากว่า 1 จังหวะ · ฮูกิน (ร่างแสงรูนสีฟ้า) บินไปเกาะจุดหรือศัตรูไกลๆ เป็นจุดร่ายที่สอง · หอกระยะกลาง · เล่นแบบวางแผน
- A กายภาพ "มูนิน · ความจำ": ทุกการตีครั้งที่ 4 จดท่าล่าสุดที่โดนเป้าลงความจำ 1 ช่อง (สูงสุด 3) · กดปล่อยความจำเมื่อไหร่ก็ได้ → มูนินเล่นซ้ำทั้งชุดรวดเดียว = เก็บไว้ทุ่มในช่วงเปิดของบอส
- B เวท "ฮูกิน · ความคิด": เวททุกอันออกทั้งจากเราและจากฮูกิน (ตีได้สองมุม) · ทุกการตีครั้งที่ 3 สลักรูน 1 ตัวรอบฮูกิน ครบ 3 → ร่ายเวทรูนในช่องออโต้สเปลจากจุดนั้น

## 3. ราชาวานร — นอกห้าดินแดน
- ตำนาน: ไซอิ๋ว — ถอนขนเป่าเป็นร่างแยก คนไทยรู้จักที่สุด · ไม้กระบองแดงหัวท้ายทอง · มงกุฎห่วงทอง · หมวกขนหางไก่ฟ้ายาว · กระโปรงหนังเสือ · ตีลังกาเมฆ
- เป็นตำนานจีน ไม่อยู่ใน 5 ดินแดน → ถ้าเลือกตัวนี้ต้องตัดสินใจเรื่องดินแดนก่อน
- พื้นฐาน (22:33): ถอนขนเป่า → ร่างเล็กหลายร่าง (ขน = แต้มที่ได้จากการตีโดน) ตัวละอ่อน ก็อปท่าเราพร้อมกันทั้งฝูงรอบตัว · มอนบางตัวหันไปตีร่างแยกแทนเรา · เล่นง่าย เหมาะออโต้ ฟาร์มมอนกลุ่ม · ตีบอสตัวเดียวช้ากว่าเพื่อน
- A กายภาพ "กระบองวิเศษ": กระบองยืด–หด 3 ระยะ (สั้น ตีเร็ว · ยาว กวาดเป็นแนว) ร่างแยกหมุนกระบองตามทั้งฝูง · ทุกการตีครั้งที่ 4 ทั้งฝูงกระโดดทุบพร้อมกัน (ออโต้กายภาพ) · รอบตัวมีมอนเยอะยิ่งงอกร่างไว
- B เวท "เนตรทอง · เมฆไฟ": ร่างแยกกลายเป็นวิญญาณเมฆลอยรอบตัว พ่นไฟทองตามเรา · ทุกการตีครั้งที่ 3 ร่ายเวทในช่องออโต้สเปล ทุกร่างร่ายตามแบบอ่อนๆ (ปูพรมทั้งพื้นที่) · เนตรทองช่วยเห็นตัวจริงของบอสที่แยกร่าง / ปลอมตัว / ล่องหนเร็วขึ้น (ตัวช่วย ไม่ข้ามกลไก — กติกาบอสข้อ 6–7)

## พรอมต์ชีตดีไซน์ (ChatGPT · ทีละภาพ)
แนบทุกครั้ง: **ภาพปกแคมป์ไฟ** (สไตล์เกม) + **ชีตตัวละครฮีโร่ที่มีอยู่ 1 ตัว** ไว้เทียบสัดส่วน (หงส์ → สิงโต · อีกา → หมาป่า · ลิง → มังกรหรือแมว) · พื้นครีมเรียบ ไม่ต้องตัด · ภาพนี้ไว้เลือกตัวก่อน ได้ตัวแล้วค่อยทำชีต 8 ทิศ / คลิปท่า / ไอคอน

### 1. หงส์แฝดเจมิไน
```
Character design sheet for a NEW hero of my cute cartoon fantasy MMORPG (animal heroes from Greek, Norse, Egyptian, Japanese and Aztec myths). ONE wide image 1536×1024 on a plain soft cream background. No text, no labels, no names, no logo, no watermark.
Style: copy the first attached image (the game's key art) — friendly hand-painted chibi cartoon, thick clean dark-brown outlines (not black), cel shading with 2–3 flat tones, soft cartoon glow, bright and warm. Not realistic, not painterly, not 3D. The second attached image is an existing hero of the game: match its chibi body proportions, outline weight and finish, but do NOT copy that character.
Hero: a graceful Greek swan duelist-dancer — a cute chibi anthropomorphic white mute swan standing on two legs, long elegant neck, orange beak with a small black knob, big sapphire-blue eyes, a slim gold laurel tiara set with two small star gems. She wears a white Greek chiton dancer dress with a layered feather skirt, a royal-blue sash with gold Greek-key trim, gold arm cuffs, white wing-feather sleeves that flow like a short cape, and gold ribbon sandals. Weapon: a slender silver-and-gold sword with a crossguard shaped like two little stars. Bold silhouette that still reads when small.
Her power is a MIRROR TWIN: a black swan copy of herself (glossy black feathers, red beak, the same outfit in midnight blue and silver), half transparent with a soft violet starlight glow along its edges, rising from a shimmering ring of water reflection at its feet.
Layout: LEFT HALF — the hero large, full body, three-quarter front view, in an elegant fencing lunge with her sword forward. TOP RIGHT — a small turnaround of the same hero standing neutral: front, side facing right, back, all the same height. BOTTOM RIGHT — the hero and her black swan twin side by side doing the same sword thrust in perfect mirror sync, tiny star sparkles between their blades.
Keep the hero identical in every view: same colours, outfit and sword.
```

### 2. อีกาแห่งโอดิน
```
Character design sheet for a NEW hero of my cute cartoon fantasy MMORPG (animal heroes from Norse, Greek, Egyptian, Japanese and Aztec myths). ONE wide image 1536×1024 on a plain soft cream background. No text, no labels, no names, no logo, no watermark.
Style: copy the first attached image (the game's key art) — friendly hand-painted chibi cartoon, thick clean dark-brown outlines (not black), cel shading with 2–3 flat tones, soft cartoon glow, bright and warm. Not realistic, not painterly, not 3D. The second attached image is an existing hero of the game: match its chibi body proportions, outline weight and finish, but do NOT copy that character.
Hero: a Norse rune seer-warrior — a cute chibi anthropomorphic raven standing on two legs, glossy blue-black feathers with a violet sheen, a sharp dark beak, one bright gold eye and the other covered by a small silver eyepatch engraved with a rune, a wide-brimmed dark wanderer's hat with a raven feather tucked in the band. He wears a dark navy wool cloak with a grey fur collar and a gold raven-head brooch, a leather tunic with silver rune embroidery, silver arm rings, fur-trimmed boots and a belt of small carved rune stones. Weapon: a short rune-carved spear with a leaf-shaped silver head glowing frost blue. Bold silhouette that still reads when small.
His power is TWO RAVEN DOUBLES of himself, both half transparent, with the same outfit and spear simplified: the first double is made of glowing frost-blue rune light with tiny rune shapes floating around it (thought, magic); the second double is made of smoky violet-grey shadow with drifting black feathers (memory, strikes).
Layout: LEFT HALF — the hero large, full body, three-quarter front view, thrusting his spear forward with a burst of black feathers. TOP RIGHT — a small turnaround of the same hero standing neutral: front, side facing right, back, all the same height. BOTTOM RIGHT — the hero in the middle with the rune-light double on one side and the shadow double on the other, all three doing the same spear thrust in perfect sync.
Keep the hero identical in every view: same colours, outfit and spear.
```

### 3. ราชาวานร
```
Character design sheet for a NEW hero of my cute cartoon fantasy MMORPG (animal heroes from mythic lands). ONE wide image 1536×1024 on a plain soft cream background. No text, no labels, no names, no logo, no watermark.
Style: copy the first attached image (the game's key art) — friendly hand-painted chibi cartoon, thick clean dark-brown outlines (not black), cel shading with 2–3 flat tones, soft cartoon glow, bright and warm. Not realistic, not painterly, not 3D. The second attached image is an existing hero of the game: match its chibi body proportions, outline weight and finish, but do NOT copy that character.
Hero: a monkey king inspired by the classic legend Journey to the West — a cute chibi anthropomorphic golden-furred monkey standing on two legs, peach-pink face, big bright golden eyes with a fiery glint, a thin gold circlet around his head, and a small golden cap with two very long curved pheasant tail feathers. He wears a red-and-gold armoured vest with cloud patterns, a short tiger-skin kilt over yellow silk trousers, a yellow sash, gold bracers and cloud-toed boots. Weapon: a long staff, red in the middle with gold bands at both ends. Bold silhouette that still reads when small.
His power is HAIR CLONES: he blows on a small tuft of his golden fur and each hair becomes a smaller, half-transparent golden copy of himself made of glowing fur and light, with a little puff of golden cloud at its feet, each holding the same staff.
Layout: LEFT HALF — the hero large, full body, three-quarter front view, balancing on a small golden-orange cloud and swinging his staff. TOP RIGHT — a small turnaround of the same hero standing neutral: front, side facing right, back, all the same height. BOTTOM RIGHT — the hero blowing golden hairs from his palm while two golden clones beside him swing their staffs in the same pose, perfectly in sync.
Keep the hero identical in every view: same colours, outfit and staff.
```

## ขั้นต่อไป (หลังเจ้าของเลือก)
1. ชีตตัวละครจริง (หันหลายทิศ) → 2. ออกแบบสกิลทั้งทรี (Basic / A / B / C) ตามกติกาข้างบน → 3. คลิปวิดีโอท่า 5 ทิศ × idle / walk / attack / buff (แบบมังกร แอกโซลอเติล) → 4. ไอคอน + ภาพพื้นหลังทรี + เอฟเฟกต์
