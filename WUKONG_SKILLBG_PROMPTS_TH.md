# ลิงหิมะ (Snow Monkey · ร่างสถิตหงอคง) — พรอมต์ภาพพื้นหลังสายสกิล (ใช้กับ ChatGPT)

เจ้าของขอ 2026-11-23 19:58 ('ต่อไปขอพื้นหลังสกิลของลิง แต่ละสายต้องไม่เหมือนกัน แสดงถึงจุดเด่นแต่ละสาย') → ส่ง 4 พรอมต์ในแชต 20:05

ภาพแนวตั้ง 4 ภาพ (Basic / A / B / C) ลิงเต็มตัวกลางล่างในฉากที่บอกตัวตนของสาย → ในเกม 512×768 `assets_skillbg.js` → `SKILL_BG_ALL.wukong[basic|A|B|C]`

แต่ละภาพต่างกันทั้ง ที่ · เวลา · สี · ท่า · ของที่บอกจุดเด่นสาย (สีพื้นตรงกับสีพื้นไอคอนใน WUKONG_ICON_PROMPTS_TH.md):

| ภาพ | สาย | ที่ / เวลา / สี | ท่าลิง | อะไรบอกจุดเด่นของสาย |
|---|---|---|---|---|
| 1 | Basic · Stone Monkey | บ่อน้ำร้อนบนเขาหิมะ ยามเช้า · ฟ้าน้ำแข็ง ขาวหิมะ ชมพูพีช | ยืนพาดไม้เท้าบนบ่า ยิ้มกวน | จุดเริ่มเดินทาง: ร่างขนทอง **ร่างเดียว** (ท่าออโต้แรก) · เมฆตีลังกา · ลูกท้อเซียน · รูปปั้นลิงหินผูกผ้ากันเปื้อนแดง (ชื่อสาย Stone Monkey + ลิงเทพ Masaru) |
| 2 | A · Havoc in Heaven | วังสวรรค์บนเมฆทองถูกถล่ม · ฟ้าแดงเพลิง ส้ม ทอง | กระโดดฟาดกระบองที่โตเป็นเสา | สายเป้าเดียว: ศัตรู **ตัวเดียว** · ร่างขนทอง 3 ร่างโผล่ **ข้างหลังเป้า** แทงหลัง · ไฟโทสะจากขน (แต้มอาละวาด) |
| 3 | B · Seventy-Two Transformations | ถ้ำม่านน้ำตก ภูเขาดอกไม้ผลไม้ · เขียวหยก ฟ้าอมเขียว ละอองน้ำ | เป่าขนจากฝ่ามือ | สายฝูง: วงร่างขนทอง **6 ร่าง** รอบตัว · กำลังแปลงเป็นเสือ / ผึ้ง / รูปปั้นหิน (3 ร่างของ 72 แปลง) |
| 4 | C · Victorious Fighting Buddha | ยอดเขาหิมะเหนือทะเลเมฆ กลางคืน · ครามม่วงเข้ม + ทองสว่าง | ยืนบนเมฆรูปดอกบัวทอง ตาไฟทอง ขนปลายทอง | ตำนาน: วิญญาณหงอคงยักษ์ข้างหลัง (แบบมุมขวาล่างของชีต) ยกมือประทานพร ถือไม้เท้าเท่าภูเขา · วงรัศมีทอง + ลำแสงพุทธรัศมี |

ตั้งใจเลี่ยงซากุระ + โทริอิ + บันไดศาลเจ้า เพราะแมว / มังกร / จิ้งจอกใช้ครบแล้ว — ลิงใช้หิมะ บ่อน้ำร้อน วังสวรรค์ น้ำตก และคืนรัศมีทองแทน จะได้ไม่เหมือนตัวญี่ปุ่นตัวอื่น

วิธีใช้: แนบ 2 ภาพทุกครั้ง = ภาพปกแคมป์ไฟ (สไตล์) + ชีตลิง (`assets/heroes/wukong/sheet_snow_ascetic.webp` · jpg ที่ส่งในแชตตอนทำไอคอน) แล้ววางทีละพรอมต์ · ได้ภาพไหนส่งกลับมาก่อน · ถ้าหน้าลิงเพี้ยน ให้ brush เลือกเฉพาะตัวลิงแล้วสั่งแก้ (สั่งแก้ทั้งภาพจะวาดใหม่หมด)

ภาพ Basic จะกลายเป็นรูปในหน้าสร้างตัวละครด้วย (char_create.js ใช้ `SKILL_BG_ALL[hero].basic` ก่อน `PORT`) → ภาพ 1 ต้องเห็นตัวลิงชัด สวย

---

## ภาพ 1 — Basic · Stone Monkey

```
Friendly hand-painted chibi cartoon game art matching the attached campfire key art: thick clean dark-brown outlines, cel shading with 2–3 flat tones, soft cartoon glow, bright and warm. Not realistic, not painterly smoke, not 3D.
Vertical skill-tree background for a fantasy mobile game, portrait 2:3 (1024×1536), one full scene.
Hero (look at the attached character sheet): a cute chibi Japanese snow monkey mountain monk (yamabushi) — spiky silver-grey fur, bright red face, sharp brown eyes, a thin gold circlet with a cloud swirl at the front, a short fluffy grey tail, a white short-sleeved jacket with indigo cloud-swirl patterns, six fluffy vermilion pompoms on dark cords (three down each side of the chest), a red sash tied in a bow at the front over a thin navy belt, puffy indigo trousers, white leg wraps, straw sandals, a cream-and-brown striped conch-shell horn on a gold cord at his right hip, and a ringed staff (dark wood, a crown of dark iron rings at the top, gold bands under the rings and at the foot).
Branch theme: "Stone Monkey" — the start of his journey. A young snow monkey of the mountain shrine who has just put on the Monkey King's gold circlet: calm, bright and welcoming.
Pose: standing on a snow-dusted stepping stone at the edge of a steaming hot spring, facing the viewer at a 3/4 angle, the ringed staff resting across his shoulders with both wrists hooked over it, a cheeky confident grin, tail up. A small fluffy golden-white somersault cloud floats beside him at knee height, and ONE small glowing see-through golden copy of him (his first hair clone) stands at his side copying his pose.
Scene: a snowy Japanese mountain hot spring at sunrise — a rock-rimmed pool with soft white steam, snow-covered pine trees and round boulders, a small wooden mountain shrine with a thick straw rope, two little stone monkey guardian statues with snow on their heads and small red bibs beside a stone path, a small bare peach tree in the snow with two big glowing golden-pink peaches hanging on it, distant white peaks, gentle falling snow. No cherry blossoms.
Palette: pale icy blue and snow white, soft peach-pink and gold sunrise light, small vermilion and indigo accents.
Layout: the hero full body and big, in the lower middle of the picture (roughly from 40% down to 95% of the height). Keep the top 15% simple (plain sky, no objects): a title bar sits there. Medium-light colours and soft contrast everywhere, no big very dark or very busy areas, because rows of small round skill icons will sit on top of the whole picture. Keep the hero and the key objects away from the far left and right edges. No text, no letters, no logo, no frame, no UI.
```

## ภาพ 2 — A · Havoc in Heaven

```
Friendly hand-painted chibi cartoon game art matching the attached campfire key art: thick clean dark-brown outlines, cel shading with 2–3 flat tones, soft cartoon glow, bright and warm. Not realistic, not painterly smoke, not 3D.
Vertical skill-tree background for a fantasy mobile game, portrait 2:3 (1024×1536), one full scene.
Hero (look at the attached character sheet): a cute chibi Japanese snow monkey mountain monk (yamabushi) — spiky silver-grey fur, bright red face, sharp brown eyes, a thin gold circlet with a cloud swirl at the front, a short fluffy grey tail, a white short-sleeved jacket with indigo cloud-swirl patterns, six fluffy vermilion pompoms on dark cords (three down each side of the chest), a red sash tied in a bow at the front over a thin navy belt, puffy indigo trousers, white leg wraps, straw sandals, a cream-and-brown striped conch-shell horn on a gold cord at his right hip, and a ringed staff (dark wood, a crown of dark iron rings at the top, gold bands under the rings and at the foot).
Branch theme: "Havoc in Heaven" — the wild one-on-one fighter: his rage grows with every hit on the same foe, his staff grows into a pillar, and golden hair clones pop out BEHIND his target to strike its back.
Pose: leaping through the air in the lower middle, full body, seen from the side and facing right, a fierce wild grin, swinging his ringed staff down with both hands — the staff has grown into a huge glowing pillar as thick as a tree trunk, crashing down on ONE big dark shadow monster in heavy armour standing right of centre. Right behind that monster, three small glowing see-through golden copies of the hero pop out of little golden puffs and thrust their staffs into its back. Orange-red rage flames stream from his fur.
Scene: the heavenly palace high above the clouds being smashed — vermilion palace halls with golden roof tiles and tall vermilion gate pillars standing on swirling golden auspicious clouds, a white jade courtyard floor bursting with glowing gold cracks under the impact, broken roof tiles, torn banners and paper lanterns flying, golden sparks. Only one enemy.
Palette: fiery crimson and orange sky, swirling gold clouds, vermilion, gold and white jade. The upper sky is plain glowing orange.
Layout: the hero full body and big, in the lower middle of the picture (roughly from 40% down to 95% of the height). Keep the top 15% simple (plain sky, no objects): a title bar sits there. Medium-light colours and soft contrast everywhere, no big very dark or very busy areas, because rows of small round skill icons will sit on top of the whole picture. Keep the hero and the key objects away from the far left and right edges. No text, no letters, no logo, no frame, no UI.
```

## ภาพ 3 — B · Seventy-Two Transformations

```
Friendly hand-painted chibi cartoon game art matching the attached campfire key art: thick clean dark-brown outlines, cel shading with 2–3 flat tones, soft cartoon glow, bright and warm. Not realistic, not painterly smoke, not 3D.
Vertical skill-tree background for a fantasy mobile game, portrait 2:3 (1024×1536), one full scene.
Hero (look at the attached character sheet): a cute chibi Japanese snow monkey mountain monk (yamabushi) — spiky silver-grey fur, bright red face, sharp brown eyes, a thin gold circlet with a cloud swirl at the front, a short fluffy grey tail, a white short-sleeved jacket with indigo cloud-swirl patterns, six fluffy vermilion pompoms on dark cords (three down each side of the chest), a red sash tied in a bow at the front over a thin navy belt, puffy indigo trousers, white leg wraps, straw sandals, a cream-and-brown striped conch-shell horn on a gold cord at his right hip, and a ringed staff (dark wood, a crown of dark iron rings at the top, gold bands under the rings and at the foot).
Branch theme: "Seventy-Two Transformations" — the swarm master: he blows his hairs into a whole troop of golden copies of himself that fight beside him and change into a tiger, a hornet or a stone statue.
Pose: standing on a wet rock in a shallow turquoise pool, facing the viewer at a 3/4 angle, the ringed staff in one hand, the other open palm raised to his lips as he blows a stream of shining golden hairs, a playful proud grin. The hairs pop with little white-and-gold puffs into a ring of six small glowing see-through golden copies of him around him, each holding a little staff and copying his pose; one copy is turning into a small golden tiger, one into a golden hornet, one into a grey stone monkey statue.
Scene: Flower-Fruit Mountain and its Water Curtain Cave — a tall shining white-blue waterfall pouring over a natural stone arch that hides a dark cave mouth, misty jade-green cliffs with a little snow on the high rocks, peach trees heavy with round golden-pink peaches, mist and a faint small rainbow in the spray, sparkling water drops, ripples on the turquoise pool.
Palette: jade green and teal, misty white, turquoise water, warm gold glow from the copies, small peach-pink accents. The upper sky is plain soft mint-blue mist.
Layout: the hero full body and big, in the lower middle of the picture (roughly from 40% down to 95% of the height). Keep the top 15% simple (plain sky, no objects): a title bar sits there. Medium-light colours and soft contrast everywhere, no big very dark or very busy areas, because rows of small round skill icons will sit on top of the whole picture. Keep the hero and the key objects away from the far left and right edges. No text, no letters, no logo, no frame, no UI.
```

## ภาพ 4 — C · Victorious Fighting Buddha

```
Friendly hand-painted chibi cartoon game art matching the attached campfire key art: thick clean dark-brown outlines, cel shading with 2–3 flat tones, soft cartoon glow, bright and warm. Not realistic, not painterly smoke, not 3D.
Vertical skill-tree background for a fantasy mobile game, portrait 2:3 (1024×1536), one full scene.
Hero (look at the attached character sheet): a cute chibi Japanese snow monkey mountain monk (yamabushi) — spiky silver-grey fur, bright red face, sharp brown eyes, a thin gold circlet with a cloud swirl at the front, a short fluffy grey tail, a white short-sleeved jacket with indigo cloud-swirl patterns, six fluffy vermilion pompoms on dark cords (three down each side of the chest), a red sash tied in a bow at the front over a thin navy belt, puffy indigo trousers, white leg wraps, straw sandals, a cream-and-brown striped conch-shell horn on a gold cord at his right hip, and a ringed staff (dark wood, a crown of dark iron rings at the top, gold bands under the rings and at the foot).
Branch theme: "Victorious Fighting Buddha" — the legendary form: the Monkey King's great spirit, enlightened and victorious, fights through him.
Pose: standing tall and triumphant on a glowing golden lotus-shaped cloud on a snowy mountain summit above a sea of clouds, facing the viewer, the ringed staff planted upright beside him, a proud fearless smile, his eyes glowing fiery gold, the tips of his silver fur shining gold, his gold circlet blazing.
Behind him: the Monkey King's giant spirit rising out of a bank of golden clouds, like the lower right of the attached character sheet — a huge glowing see-through golden ape spirit with glowing yellow eyes, a flaming golden mane and the same gold circlet; only the head, the shoulders and two huge hands. Here it is calm and victorious: a proud closed-mouth smile, one huge hand raised in a gentle blessing gesture, the other gripping a mountain-sized glowing ringed staff. A huge golden halo ring behind the spirit's head (below the plain top band) and a wide fan of golden light rays.
Scene: a deep indigo-violet night sky with a few twinkling stars, a sea of soft clouds below lit gold, small glowing golden lotus petals and sparks drifting up, snowy peaks around.
Palette: deep indigo and violet, brilliant gold and amber, white snow. Night, but keep the picture medium-light: the golden glow lights everything, no pitch-black areas. The upper sky is plain indigo with only a few stars.
Layout: the hero full body and big, in the lower middle of the picture (roughly from 40% down to 95% of the height). Keep the top 15% simple (plain sky, no objects): a title bar sits there. Medium-light colours and soft contrast everywhere, no big very dark or very busy areas, because rows of small round skill icons will sit on top of the whole picture. Keep the hero and the key objects away from the far left and right edges. No text, no letters, no logo, no frame, no UI.
```

---

## ตอนภาพมาถึง (โน้ตสำหรับแชตที่ใส่เข้าเกม)
- **ใส่แล้ว 2026-11-23 20:13** (เจ้าของส่ง 4 ภาพ): basic `044_5b6761` · A `045_b80cdd` · B `046_9893aa` · C `047_849ff4` (.webp, 512×768 q85, ชื่อแบบเดียวกับไฟล์อื่นในโฟลเดอร์) · หน้าสร้างตัวใช้ภาพ Basic แล้ว (เช็ก PC + มือถือแนวนอน: ตอนนั้นชื่อฮีโร่ตัวใหญ่ทับปุ่มล่างบนจอเตี้ย ≤ 520 px ทุกตัว → char_create.js ย่อกล่อง / ชื่อในจอแบบนั้น)
- (เดิม) ย่อเป็น 512×768 webp (ครอปให้ได้ 2:3 ถ้า ChatGPT ส่งขนาดอื่นมา) → `assets/inl/assets_skillbg/044_wkbasic.webp` … `047_wkC.webp` แล้วเพิ่ม `"wukong": {"basic": …, "A": …, "B": …, "C": …}` ใน `SKILL_BG_ALL` (assets_skillbg.js เก็บแค่ path แล้ว ไม่ต้องรัน externalize.py)
- ในเกมแผงทรีกว้าง 236 px สูง ≈ 404 px (`center 30%/cover`) → ขอบซ้าย-ขวาโดนตัดราว 6 % ต่อข้าง · ทั้งความสูงเห็นครบ
- ภาพ Basic ขึ้นเป็นรูปหน้าสร้างตัวละครเอง (เลิกใช้ `assets/heroes/wukong/portrait.webp`) → เช็กหน้าสร้างตัวด้วย
- เช็กด้วยภาพจากเกม: หน้าต่างสกิล (K) ทั้ง 4 แท็บ + หน้าสร้างตัว ก่อนบอกว่าเสร็จ
