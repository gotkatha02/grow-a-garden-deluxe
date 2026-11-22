# ฮีโร่ใหม่: ร่างแยก + ออโต้สเปล (2026-11-22)

เจ้าของ 22:22: "ถ้าจะสร้างตัวละครใหม่ มีสกิลแยกร่างที่กดโจมตีจังหวะตามเรา เน้น auto spell ทั้งเวทย์และกายภาพ คอนเซปตามนี้เป็นสัตว์อะไรดี" → เสนอ 3 ตัว (แนะนำหงส์)
เจ้าของ 22:25: "ขอพร้อมดีไซน์ทั้ง3ตัวหน่อย" → พรอมต์ชีตดีไซน์ 3 ตัวอยู่ข้างล่าง · **ยังไม่ได้สร้างอะไรในเกม รอเจ้าของเลือกตัว**

## กติกาที่ใช้กับทุกตัว
- ร่างแยกทำท่าเดียวกับเราตามจังหวะ (ตีปกติ + สกิล) · ดาเมจของร่างแยก = ส่วนหนึ่งของดาเมจเรา (ปรับด้วย bench)
- ออโต้สเปลใช้ตัวนับ ไม่ใช้โอกาสสุ่ม (กฎข้อ 2): "ทุกการตีครั้งที่ n"
- เป็นฮีโร่สองทาง: สาย A = ATK (กายภาพ) · สาย B = MATK (เวท) ตามกฎ 'แก้บัค 4' · สายพื้นฐาน = ร่างแยกเอง
- จุดขายข้อ 2 (เจม): เจมแปรสภาพเปลี่ยนว่าร่างแยกก็อปอะไร / ช่องออโต้สเปลให้ผู้เล่นเลือกสกิลที่จะร่ายเอง
- โค้ดวาดร่างโคลนจากสไปรต์ฮีโร่มีอยู่แล้ว: KClone (Shadow Dance ของแมว, cat_vfx.js) · WClone (Valhalla's Wrath ของหมาป่า, wolf_fx.js)

## จำนวนฮีโร่ต่อดินแดน (char_create.js)
นอร์ส 3 (หมาป่า แรด นกฮูก) · แอซเท็ก 3 (เสือจากัวร์ แอกโซลอเติล จระเข้) · ญี่ปุ่น 3 (แมว มังกร คิตสึเนะ) · อียิปต์ 3 (ฮิปโป บาสเต็ต อนูบิส) · **กรีก 2 (แกะ สิงโต)**

## 1. หงส์แฝดเจมิไน — กรีก (แนะนำ)
- ตำนาน: ซุสแปลงเป็นหงส์ → ฝาแฝดคาสเตอร์กับพอลลักซ์ฟักจากไข่หงส์ → กลุ่มดาวคนคู่ (Gemini) · ภาพหงส์ขาว–หงส์ดำ + เงาสะท้อนบนผิวน้ำ = ร่างแยก · ท่าทางนักดาบ–นักบัลเลต์ เข้ากับ "ตีตามจังหวะ"
- ทำให้กรีกครบ 3 ตัวเท่าดินแดนอื่น · เป็นฮีโร่หญิง (หญิงตอนนี้: มิโกะ บาสเต็ต แกะ)
- พื้นฐาน: เงาสะท้อนลุกจากวงน้ำ ยืนข้างตัว ทำท่าตามเราพร้อมกัน
- A กายภาพ "หงส์ดำ": ร่างเงาถือดาบ ยิ่งตีต่อเนื่องยิ่งเพิ่มร่าง (สูงสุด 3) · ทุกการตีครั้งที่ 4 ร่างเงาปล่อยสกิลกายภาพเอง
- B เวท "ดาวเจมิไน": ทุกการตีครั้งที่ 3 จุดดาว 1 ดวง ครบกลุ่มดาว → ร่ายเวทในช่องออโต้สเปลเอง · ร่างแยกกลายเป็นแสงดาวร่ายซ้ำ

## 2. อีกาแห่งโอดิน — นอร์ส
- ตำนาน: ฮูกิน (ความคิด) กับมูนิน (ความจำ) อีกาสองตัวของโอดิน · โอดินเสียตาข้างหนึ่ง → ผ้าปิดตารูน · หมวกปีกกว้างของผู้พเนจร · หอกแบบกุงนีร์
- ตำนานเข้ากับคอนเซปต์ตรงที่สุด แต่นอร์สมี 3 ตัวแล้ว และมีนกฮูกอยู่แล้ว
- A กายภาพ "มูนิน · ความจำ": จำท่าที่เราตี · ทุกการตีครั้งที่ 4 ร่างมูนินเล่นซ้ำ 3 ท่าล่าสุด
- B เวท "ฮูกิน · ความคิด": ทุกการตีครั้งที่ 3 สลักรูน 1 ตัว ครบ 3 รูน → ร่ายเวทรูนในช่องออโต้สเปลเอง

## 3. ราชาวานร — นอกห้าดินแดน
- ตำนาน: ไซอิ๋ว — ถอนขนเป่าเป็นร่างแยก คนไทยรู้จักที่สุด · ไม้กระบองแดงหัวท้ายทอง · มงกุฎห่วงทอง · หมวกขนหางไก่ฟ้ายาว · กระโปรงหนังเสือ · ตีลังกาเมฆ
- เป็นตำนานจีน ไม่อยู่ใน 5 ดินแดน → ถ้าเลือกตัวนี้ต้องตัดสินใจเรื่องดินแดนก่อน
- A กายภาพ: ร่างแยกหมุนกระบองตาม · ทุกการตีครั้งที่ 4 กระบองยืดยาวฟาดเอง
- B เวท: ตาทองไฟ · ทุกการตีครั้งที่ 3 ร่ายเวทไฟทองเอง · ร่างแยกกลายเป็นวิญญาณเมฆร่ายซ้ำ

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
