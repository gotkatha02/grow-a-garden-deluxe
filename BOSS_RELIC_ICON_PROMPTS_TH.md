# รูปของบอส (วัตถุโบราณ 30 ชิ้น) — พรอมต์ ChatGPT (2026-11-21)

เจ้าของ: "ขอพรอมต์เจนรูปไอเทมก่อน" แล้ว **"ขอเป็นไอเทมที่ดีไซน์แบบบอสที่ดรอป"** → ของแต่ละชิ้นใช้สี วัสดุ ลวดลาย และชิ้นส่วนเด่นของบอสที่ดรอปมัน (ดูจากรูปบอสใน `assets/bosses/<แดน>/` และรูปเฟนเรียร์ในเกม `assets/monsters/fenrirBoss.webp`) · รายการของกับผลอยู่ใน GEAR_V3_PLAN_TH.md ข้อ 4

## วิธีใช้
1. เปิดแชทใหม่ใน ChatGPT แนบ **รูปปกแคมป์ไฟ** (สไตล์เกม) แล้วส่ง **พรอมต์กลาง (0)** รอให้ตอบ OK
2. ทีละชีต: แนบ **บอร์ดบอสของแดนนั้น** (`boss_ref_<แดน>.jpg` = บอส 6 ตัว มีเลข 1–6 ตรงกับลำดับของในพรอมต์) แล้วส่งพรอมต์ชีตนั้น
3. ส่งชีตกลับมา ผมตัดเป็นไฟล์ละชิ้นเอง (`tools/iconsheet.py`) เก็บ 128 px สำหรับช่องไอเทม
- **ทุกชีตพื้นเขียว** และห้ามมีสีเขียวบนของ (สีพื้นจะถูกตัดทิ้ง ของสีเดียวกันจะแหว่ง) · ฟ้าอมเขียว / เทอร์ควอยซ์ใช้ได้ · ม่วงใช้ได้ (ชีตแอซเท็กเคยวางไว้บนพื้นม่วงแดง แต่ผ้าคลุมดาวกับปีกค้างคาวมีม่วงตามบอส → ย้ายมาพื้นเขียว)
- ถ้าชิ้นไหนไม่ถูกใจ: ใน ChatGPT ใช้แปรงเลือกเฉพาะช่องนั้นแล้วสั่งวาดใหม่ อย่าสั่งแก้ทั้งรูป (มันจะวาดใหม่หมด)
- ทำบอร์ดบอสใหม่: `python3 tools/relic_boards.py [โฟลเดอร์]` (ไม่เก็บไฟล์บอร์ดในรีโป) · ไวกิ้งใช้ชีตออกแบบ = ตัวเต็ม + หน้า + อาวุธ (ดรอกร์ใช้มุมหลัง เพราะทั่งอยู่บนหลัง)

## ช่อง → ไฟล์
| ชีต | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|
| 1 ไวกิ้ง | relic_draugr ทั่งคนตาย | relic_huldra พิณฮุลดรา | relic_jotun กำปั้นโยตุน | **relic_fenrir เขี้ยวเฟนเรียร์** | relic_nidhogg เกล็ดนิดฮ็อกก์ | relic_ymir หัวใจยมีร์ |
| 2 กรีก | relic_polyphemus ผ้าคลุม "ไม่มีใคร" | relic_hecate คบเพลิงเฮคาที | relic_trojan ม้าไม้ทรอย | relic_minotaur เขามิโนทอร์ | relic_cerberus ปลอกคอสามหัว | relic_typhon ตาพายุไทฟอน |
| 3 อียิปต์ | relic_mummy ผ้าพันศพ | relic_sphinx ปริศนาสฟิงซ์ | relic_scorpion เหล็กไนราชา | relic_pharaoh หน้ากากทองฟาโรห์ | relic_set คทาเซ็ต | relic_apep เขี้ยวอาเปป |
| 4 ญี่ปุ่น | relic_tanuki ใบไม้ทานูกิ | relic_jorogumo ใยโจโรกุโมะ | relic_gashadokuro กะโหลกหิวโหย | relic_shogun ดาบโชกุนผี | relic_shuten น้ำเต้าสาเก | relic_orochi ดาบคุซานางิ |
| 5 แอซเท็ก | relic_camazotz ปีกค้างคาว | relic_ahuizotl มือหางอาฮุยซอตล์ | relic_eagle ขนนกนักรบอินทรี | relic_tzitzimitl ผ้าคลุมดาว | relic_mictlan ไม้เท้ามิกตลัน | relic_quetzal ขนนกเควตซัล |

ตัดชีต: `GLOBAL=1 python3 -I tools/iconsheet.py <ชีต.png> assets/items 3,3 relic_draugr,relic_huldra,relic_jotun,relic_fenrir,relic_nidhogg,relic_ymir` (ชุดอื่นตามตาราง) แล้วเพิ่มชื่อใน assets/items/icons.json · `GLOBAL=1` = ตัดสีเขียวทุกจุด ไม่ใช่แค่พื้นรอบนอก (ของในชีตนี้ไม่มีสีเขียว) → พื้นเขียวที่มองทะลุห่วงโซ่ / ใยแมงมุม / แก้ว และแสงเรืองที่ติดเขียวหายไป

**สถานะ 2026-11-21:** ครบ 30 ชิ้นแล้ว (ชีต 1–5) ตัดเป็นไฟล์ใน assets/items (128 px) · เขี้ยวเฟนเรียร์ใช้รูปจริงในเกมแล้ว (ช่องเครื่องประดับ · ปุ่ม R · สมุดวัตถุโบราณ)

## ของแต่ละชิ้นเอาอะไรจากบอส
| ของ | จากบอส |
|---|---|
| ทั่งคนตาย | ทั่งที่ดรอกร์แบกบนหลัง: เหล็กดำ หมุดทองแดง ช่องเตาเรืองส้ม รอยร้าวลาวาแบบค้อนของเขา ปลายทั่งเป็นเขาสีครีมแบบหมวก สายหนัง ห่วง โซ่ ควัน |
| พิณฮุลดรา | แขนพิณ = เขากิ่งไม้ของนาง · ตัวพิณ = โพรงเปลือกไม้มีเห็ดเรืองส้ม · ใบไม้ร่วง ดอกไม้สีครีม พู่หางวัว |
| กำปั้นโยตุน | กำปั้นหินแบบกระบอง ผลึกน้ำแข็งแตกออก ขนครีมมีน้ำแข็งย้อย เชือกกับหนังพันไขว้ เหรียญทองแดงลายปม |
| เขี้ยวเฟนเรียร์ | เขี้ยวขาวปลายฟ้า เส้นร้าวเรืองฟ้าแบบในขน กระจุกขนครามมีดาว โซ่ทองแดงขาด แผ่นปลอกคอหนามกับเพชรฟ้า |
| เกล็ดนิดฮ็อกก์ | เกล็ดม่วงหม่น รอยร้าวบานเย็นเรือง รากต้นไม้โลกที่โดนแทะ หนามกระดูก หยดพิษ เศษใบเรือลายวนแดง (เรือแตกบนหลังมัน) |
| หัวใจยมีร์ | น้ำแข็งเหลี่ยมแบบกำปั้นยมีร์ มงกุฎผลึก เหรียญเกล็ดหิมะแบบหัวเข็มขัด เปียเคราห่วงทอง สายหนังรูน |
| ผ้าคลุม "ไม่มีใคร" | ขนแกะครีมแบบผ้าคลุมไซคลอปส์ ฮู้ดเป็นหน้าแกะน้อยของเขากำลังหลับ เข็มกลัดทองรูปตาเดียว "หลับตา" (มองไม่เห็นเรา) |
| คบเพลิงเฮคาที | คบเพลิงทองที่นางถือ ไฟม่วง 3 เปลว (เทพี 3 หน้า) จันทร์เสี้ยวกับดาว กุญแจ 3 ดอก ริบบิ้นม่วงลายดาว ผีเสื้อกลางคืนม่วง |
| ม้าไม้ทรอย | ตุ๊กตาไม้จำลองยักษ์ทรอยทั้งตัว: หมวกเหล็กหงอนแดง ตาเหลือง โล่แดงตะวันทอง ประตูท้องมีปลายหอกโผล่ |
| เขามิโนทอร์ | เขาสีครีม ปลอกทองลายเขาวงกต กระจุกขนน้ำตาล ห่วงจมูกทอง โซ่ทองขาด |
| ปลอกคอสามหัว | ปลอกคอหนามทองลายกรีก เหรียญหัวหมาม่วงดำ 3 หัวตาแดงส้ม โซ่ทอง ไฟผีฟ้า หางงูแดง |
| ตาพายุไทฟอน | ลูกแก้วพายุเหมือนลูกตา ม่านตาไฟส้ม สายฟ้าทองส้ม งูแดงลายลาวาพัน ปีกพายุสีเทา |
| ผ้าพันศพ | ม้วนผ้าลินินเก่า แถบลายน้ำเงินทอง เครื่องรางตาฮอรัสเทอร์ควอยซ์เรือง อังค์ทอง มุมม้วนปาปิรุส |
| ปริศนาสฟิงซ์ | นาฬิกาทรายหัวสฟิงซ์ (ผ้าคลุมหัวลายน้ำเงินทอง ตาเหลือง งูเห่าทอง) ปีกหินทราย ไพลินฟ้า ทรายทองไหลขึ้น (ย้อนเวลา) |
| เหล็กไนราชา | ปลายหางผลึกเกลือชมพูขาว ปลอกทองลาพิส เหล็กไนทอง หยดพิษอำพัน แมลงสคารับฟ้า |
| หน้ากากทองฟาโรห์ | หน้าฟาโรห์อมตะ: มงกุฎแดงขาวสองแผ่นดิน ตาเหลือง ไม้เท้าตะขอ + แส้ไขว้ ปลอกคอทองลูกปัดเทอร์ควอยซ์ ควันม่วง |
| คทาเซ็ต | คทาที่เซ็ตถือ หัวสัตว์เซ็ต (จมูกยาวโค้ง หูเหลี่ยม ตาแดง) ปลายแฉก ทรายแดงพัน ประกายสายฟ้าแดง |
| เขี้ยวอาเปป | เขี้ยวขาวปลายม่วง พิษม่วงเรือง ฐานทองรูปแม่เบี้ยงูเห่ามีตาม่วงเล็กๆ เข็มกลัดสุริยะปีกทอง โซ่ทองขาด |
| ใบไม้ทานูกิ | ใบไม้ทองบนหัวมัน ลายวนแดงแบบหน้ามัน เชือกแดง กระดิ่งทอง คุไน ควันม่วง |
| ใยโจโรกุโมะ | ใยแมงมุมเงินบนปิ่นทองรูปแมงมุม ดอกวิสทีเรีย แมงมุมดำลายทองตาแดง พู่แดง กระดาษซิกแซก |
| กะโหลกหิวโหย | กะโหลกอ้าปากกว้าง ไฟผีฟ้าในเบ้าตา หมวกซามูไรแดงพระจันทร์เสี้ยวทอง ลูกศรหักปัก พู่เชือกแดง |
| ดาบโชกุนผี | คาตานะใบเรืองฟ้าลายคลื่น ไฟผีฟ้า กระบังทองลายดอก ด้ามดำทองพันเชือกม่วง หน้ากากโอนิแดงห้อย |
| น้ำเต้าสาเก | น้ำเต้าแดงลายโทโมเอะทอง ผ้าลายเสือ เชือกขาวกับกระดาษซิกแซก ลูกประคำทอง หน้ากากโอนิทอง ไฟส้มที่จุก |
| ดาบคุซานางิ | ดาบตรงโผล่จากปลายหางมังกรแดงลายเมฆทอง (ตำนาน: ดาบอยู่ในหางโอโรจิ) กระบังหัวมังกรแดงเขาทอง สายฟ้าเหลือง เมฆพายุม่วง |
| ปีกค้างคาว | ปีกแดงลายขั้นบันไดทอง ตัวล็อกทองหน้าค้างคาวเขี้ยวตาแดง ขนม่วงน้ำตาล สร้อยเขี้ยวขาว |
| มือหางอาฮุยซอตล์ | หางขนกรมท่าลายน้ำวนฟ้า ปลายเป็นมือกรงเล็บ ปลอกทอง อุ้งชมพู ขนนกฟ้าขาว หยดน้ำ |
| ขนนกนักรบอินทรี | พัดขนนกแดง เทอร์ควอยซ์ น้ำตาลปลายขาว ตัวล็อกทองหัวอินทรีในวงแดงฟ้าแบบโล่ ใบมีดออบซิเดียน |
| ผ้าคลุมดาว | ผ้าคลุมจักรวาลม่วงกรมท่าดาวทอง เข็มกลัดสุริยคราสดำวงทอง ขนนกขาวทอง ตัวล็อกหัวจากัวร์ทอง |
| ไม้เท้ามิกตลัน | ไม้เท้าหัวกะโหลกออบซิเดียนดำตาส้ม พวงดาวเรือง กะโหลกเล็ก ขนนกแดง ธงกระดาษตัด นกฮูกเกาะ |
| ขนนกเควตซัล | ขนนกยาวแถบแดง ทอง เทอร์ควอยซ์ ฟ้า ตัวล็อกทองหัวงูขนนก เหรียญจานตะวันทอง ลมม้วนสีขาว |

## 0. พรอมต์กลาง (ส่งก่อน พร้อมรูปปกแคมป์ไฟ)
```
I am making inventory item icons for my 2D fantasy RPG. These are LEGENDARY BOSS RELICS — rare treasures dropped by mythic bosses. Each relic must look like it belongs to the boss that drops it.
Art style: copy the attached key art — friendly hand-painted chibi cartoon, thick clean dark-brown outlines (not black), cel shading with 2–3 flat tones, soft light from the top-left, bright warm colours, a little magical shine on the object itself. Not realistic, not painterly, not 3D.
With every sheet I will attach a board of the 6 bosses of one land, numbered 1–6. Relic number N is made from boss N or in boss N's own style: use that boss's main colours, materials, patterns, ornaments and signature parts, so a player instantly knows which boss it came from. The board is only a reference — never draw the bosses themselves and never copy the board's layout.
Rules for EVERY icon: one single object, centred, 3/4 view, filling about 80% of its square cell without touching the edges; long objects lie diagonally. No text, no letters, no numbers, no frame, no border, no ground shadow. No glow halo or aura around the object — the area around it stays one perfectly flat colour; magic shows only ON the object (glowing eyes, cracks, gems, inner light). Must read clearly at 32 px.
Draw each list on ONE 1536×1024 sheet: 3 columns × 2 rows of equal perfect-square cells with clear gaps, in the given order (left to right, top row first), on a SOLID FLAT PURE GREEN (#00FF00) background — no gradient, no texture, no shadow. Never use green on the objects (turquoise and teal are fine).
Reply OK and wait.
```

## 1. ไวกิ้ง (แนบ boss_ref_viking.jpg)
```
Sheet 1 — the 6 relics of the Norse / Viking bosses on the attached board (boss 1 = relic 1 … boss 6 = relic 6). Do not draw the bosses.
1) Deathforge Anvil (Draugr Forgemaster) — the dark-iron anvil he carries on his back, made small: battered dark iron with bronze rivets, a forge vent on its front glowing molten orange, glowing orange lava cracks like his hammer, its pointed end shaped like one of his curved cream helmet horns, leather straps with bronze rings and a short iron chain, a thin wisp of grey smoke.
2) Huldra's Lyre (Huldra) — a Norse lyre whose two arms are her branching twig antlers, the body a hollow of brown bark with tiny glowing orange mushrooms inside, glowing amber strings, orange, red and yellow autumn leaves and cream five-petal flowers on the frame, her cow-tail tuft hanging as a tassel.
3) Jotun's Fist (Jotun Brute) — a huge gauntlet shaped like his clenched fist: grey stone knuckles with frost-blue ice crystals bursting out, a cuff of shaggy cream-white fur with icicles, crossed brown rope and leather wraps, a round bronze medallion with a knot rune on the back of the hand.
4) Fenrir's Fang (Fenrir) — one huge curved fang, ivory white with an ice-blue tip and glowing ice-blue crack lines like the veins in his fur, its root wrapped in a tuft of his dark indigo fur sprinkled with tiny stars, hanging from a broken rusty-copper chain link and a spiked copper collar plate with a blue diamond gem.
5) Nidhogg's Scale (Nidhogg) — one big dusty-mauve dragon scale with glowing magenta cracks, wrapped by gnawed brown world-tree roots, a bone-white spike on its tip, one drop of glowing magenta venom, a scrap of torn sail cloth with a red spiral rune tied to it.
6) Heart of Ymir (Ymir) — a heart-shaped chunk of glacier-blue ice made of flat crystal facets like his ice fists, a small crown of ice crystals on top, a round silver snowflake medallion glowing pale blue in its centre, a white beard braid with gold rings and a brown leather rune strap wrapped round it, little icicles below.
Solid flat pure green (#00FF00) background, no green on the objects. Same style as the key art: friendly hand-painted chibi cartoon, thick clean dark-brown outlines, cel shading with 2–3 flat tones, bright and warm. No text, no frame, no glow halo, nothing touching the cell edges.
```

## 2. กรีก (แนบ boss_ref_greek.jpg)
```
Sheet 2 — the 6 relics of the Greek bosses on the attached board (boss 1 = relic 1 … boss 6 = relic 6). Do not draw the bosses.
1) Cloak of Nobody (Polyphemus) — a folded cloak of his thick cream sheep fleece, the hood made of his little grey-faced sheep's cute sleeping face, fastened by a gold brooch shaped like his single big eye, CLOSED in sleep, with a laurel border, a brown leather band with a gold Greek-key pattern.
2) Hecate's Torch (Hecate) — her golden torch with a cup of violet-purple fire burning as three flames, a gold crescent moon with a small star crowning the cup, three old bronze keys hanging on a chain from the handle, a purple starry ribbon and a cream band with a gold Greek key wrapped round the grip, a tiny purple moth resting on it.
3) Trojan Horse (Trojan Colossus) — a small wooden toy figurine of the Trojan Colossus: plank horse on bronze-rimmed wheels, bronze Greek helmet with a big red horsehair crest, glowing yellow eyes, a round red shield with a gold sun on its side, a little open belly hatch with spear tips peeking out, coils of rope.
4) Minotaur's Horn (Minotaur) — one big curved cream-white bull horn with two gold bands engraved with his labyrinth maze pattern, a tuft of his shaggy brown fur at the base, his gold nose ring hanging on a red cord, a broken gold chain link.
5) Three-Headed Collar (Cerberus) — his gold spiked collar with the Greek-key pattern, three dark purple-black dog-head medallions on it with glowing red-orange eyes and bared fangs, a heavy gold chain hanging below, small blue ghost flames flickering on the spike tips, his red-scaled snake tail curling through it.
6) Eye of Typhon (Typhon) — a round storm orb like a giant eye: dark grey-purple storm clouds swirling inside around a fiery orange slit pupil, gold-orange lightning crackling on it, two small red serpents with glowing lava-crack scales coiling round it, a pair of small dark grey storm wings on its sides, a gold chain hanging below. Lightning is gold-orange, never green.
Solid flat pure green (#00FF00) background, no green on the objects. Same style as the key art: friendly hand-painted chibi cartoon, thick clean dark-brown outlines, cel shading with 2–3 flat tones, bright and warm. No text, no frame, no glow halo, nothing touching the cell edges.
```

## 3. อียิปต์ (แนบ boss_ref_egypt.jpg)
```
Sheet 3 — the 6 relics of the Egyptian bosses on the attached board (boss 1 = relic 1 … boss 6 = relic 6). Do not draw the bosses.
1) Burial Wraps (Mummy Vizier) — a coiled roll of his old cream linen bandages with loose torn ends, tied with a blue-and-gold striped band, a turquoise Eye of Horus amulet glowing cyan on the knot, a small gold ankh charm hanging, the corner of his papyrus scroll tucked in.
2) Riddle of the Sphinx (Sphinx Guardian) — a sandstone-and-gold hourglass whose top is the sphinx's face in a blue-and-gold striped nemes with glowing yellow eyes and a gold cobra, small sandstone feathered wings on both sides, a big oval blue sapphire on the frame, glowing gold sand flowing UPWARD inside, faint glowing gold hieroglyphs on the base.
3) Scorpion King's Stinger (Salt Scorpion King) — his tail tip: three segments of pink-and-white salt crystal (rose-quartz chunks) with gold and lapis-blue bands, ending in a curved polished gold stinger with one drop of glowing amber venom, a small blue scarab gem on one band.
4) Golden Pharaoh Mask (Pharaoh Undying) — a gold funeral mask of his face: blue-and-gold striped nemes, the tall red-and-white double crown on top, softly glowing yellow eyes, a gold cobra on the brow, his blue-and-gold striped crook and gold flail crossed behind it, a broad gold collar with turquoise beads below, a thin wisp of purple smoke.
5) Scepter of Set (Set) — his tall scepter in dark red-brown and gold, the top carved as the Set-animal head (long curved snout, tall square-tipped ears, glowing red eyes), a forked bottom end, red gem studs and blue-and-gold striped bands, a ribbon of red desert sand swirling round it with tiny red lightning sparks.
6) Apep's Fang (Apep) — one long curved serpent fang, ivory white turning deep purple at the tip and dripping glowing purple venom, its root set in a gold band shaped like his cobra hood with small glowing purple eyes, a gold winged-sun brooch with a purple gem, a broken gold chain link.
Solid flat pure green (#00FF00) background, no green on the objects (turquoise is fine). Same style as the key art: friendly hand-painted chibi cartoon, thick clean dark-brown outlines, cel shading with 2–3 flat tones, bright and warm. No text, no frame, no glow halo, nothing touching the cell edges.
```

## 4. ญี่ปุ่น (แนบ boss_ref_japan.jpg)
```
Sheet 4 — the 6 relics of the Japanese bosses on the attached board (boss 1 = relic 1 … boss 6 = relic 6). Do not draw the bosses.
1) Tanuki's Leaf (Jonin Shadow, the tanuki ninja) — the golden-yellow leaf from his head (the tanuki's shape-shifting leaf) with his red swirl mark painted on it, tied at the stem with red rope and two small gold bells, a dark steel kunai crossed behind it, a small puff of purple smoke curling from the stem.
2) Jorogumo's Silk (Jorogumo) — a round silvery-white spider web woven on her gold spider-shaped hairpin, lavender wisteria blossoms hanging from it, a little black spider with gold stripes and red eyes in the middle of the web, red tassels and a white zigzag paper charm.
3) Hungry Skull (Gashadokuro) — his bone-white skull with its jaw wide open as if hungry, blue ghost fire glowing in the eye sockets, wearing a small red samurai helmet with a gold crescent crest, a broken arrow stuck in the helmet, red rope tassels.
4) Ghost Shogun's Blade (Ghost Shogun) — his katana: the blade glowing ghostly ice-blue with a wave pattern and blue ghost flames along the edge, a round gold guard with his flower crest, a black-and-gold hilt wrapped in purple cord with purple tassels, a small red oni-mask charm hanging from it.
5) Sake Gourd (Shuten-doji) — his big red lacquered sake gourd with a gold tomoe swirl crest, a tiger-stripe cloth tied round its waist, thick white rope with white zigzag paper charms, a string of big gold prayer beads, a small gold oni-mask charm with a purple tassel, little orange flames flickering at the cork.
6) Kusanagi Sword (Yamata no Orochi) — the legendary straight double-edged bronze sword sliding out of the tip of his red-scaled dragon tail (red scales with gold cloud patterns, cream belly), the guard made of small red dragon heads with gold horns, yellow lightning crackling along the blade, a small purple storm-cloud curl at the pommel.
Solid flat pure green (#00FF00) background, no green on the objects. Same style as the key art: friendly hand-painted chibi cartoon, thick clean dark-brown outlines, cel shading with 2–3 flat tones, bright and warm. No text, no frame, no glow halo, nothing touching the cell edges.
```

## 5. แอซเท็ก (แนบ boss_ref_aztec.jpg)
```
Sheet 5 — the 6 relics of the Aztec bosses on the attached board (boss 1 = relic 1 … boss 6 = relic 6). Do not draw the bosses.
1) Camazotz Wing (Camazotz) — one folded red bat wing with gold stepped-fret patterns on the membrane and dark claw tips, a gold clasp at its joint shaped like his fanged bat face with red eyes, a tuft of dark purple-brown fur, a short string of white fang beads.
2) Ahuizotl's Tail-Hand (Ahuizotl) — his long tail ending in a grabbing clawed hand: dark navy fur with light-blue spiral water patterns, two gold stepped-fret bands, pink palm pads and white claws, blue-and-white feathers tied near the base, water drops dripping and a small white-blue splash curl.
3) Eagle Warrior Plume (Eagle Warlord) — a fan of his feathers (red, turquoise, and white-tipped brown eagle feathers) bound by a round gold clasp showing his golden eagle-head emblem inside red and turquoise rings like his shield, a small black obsidian blade with a gold fret pattern tucked in.
4) Starry Eclipse Cloak (Tzitzimitl) — a folded cosmic cloak of deep purple and midnight-navy cloth sprinkled with gold stars, pinned by a brooch of a black eclipse sun with a glowing gold ring, white-and-gold feathers fanning behind the brooch, a small gold jaguar-head clasp.
5) Staff of Mictlan (Mictlantecuhtli) — his short staff of dark wood and bone topped with a black obsidian skull with glowing orange eyes, a garland of orange marigold flowers and tiny white skulls round its neck, red feathers and a strip of white cut-paper banner hanging, a tiny brown owl perched on the skull.
6) Quetzal Feather (Quetzalcoatl) — one long feather in his colours (bands of red, golden yellow, turquoise and blue) bound by a gold clasp shaped like his small feathered-serpent head, a gold sun-disc charm hanging from it, a little white wind swirl curling round its tip.
Solid flat pure green (#00FF00) background, no green on the objects (turquoise and teal are fine). Same style as the key art: friendly hand-painted chibi cartoon, thick clean dark-brown outlines, cel shading with 2–3 flat tones, bright and warm. No text, no frame, no glow halo, nothing touching the cell edges.
```
