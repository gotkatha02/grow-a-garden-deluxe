# นกฮูกหิมะ (Snowy Owl): ลุคใหม่ 5 แบบ (2026-11-24 22:00)

เจ้าของ: "ทำดีไซน์นกฮูกใหม่ให้หน่อย" (ไม่ได้บอกแนว) → เขียนไว้หลายแนวให้เลือก:
- นกฮูกเต็มตัว 3 แบบ: แบบ 1 ครบสองสาย · แบบ 2 สาย A ซุ่มยิงแม่น · แบบ 3 สาย B พายุหิมะ กับดัก ล่องหน
- สาวนกฮูก 1 แบบ (แบบ 4)
- ลุคเดิมแต่งให้เท่ 1 แบบ (แบบ 5)

ถ้าไม่ตรงใจ บอกแนวที่อยากได้มาได้เลย (เช่น ตัวกลมน่ารักกว่านี้ หรือดุดันแบบนักล่า)

ภาพเทียบลุคเดิม (ส่งในแชตแล้ว, ไม่เก็บในรีโป): ในเกม · หน้าเลือกตัว · ผังสกิล · ภาพเอฟเฟกต์

## เปลี่ยนนกฮูกกระทบอะไรบ้าง (น้อย แบบเดียวกับแรด)
- **สไปร์ท `assets_owl.js`** (prefix OW) ทำจากคลิป มีครบ 5 ทิศ (S SE E NE N) · ใช้กับนกฮูกตัวเดียว → คลิปใหม่ 20 อันเขียนทับไฟล์เดิมได้เลย ฮีโร่ตัวอื่นไม่โดน
- **ไม่มี** แฟชั่นติดตัว (นกฮูกมีปีกของตัวเอง ปีก / ผ้าคลุมแฟชั่นไม่ใส่อยู่แล้ว) หน้ากากสีขน ท่านั่ง → ไม่มีงานวัดจุดแบบหมาป่า
- **หน้า HUD** ลุคเดิมฝังอยู่ใน `assets_owl.js` (`OW_PORTRAIT`) → เขียนทับ atlas แล้วหายไปด้วย ต้องตัดหัวใหม่จากภาพหน้าตรง (window.HUD_FACE)
- **ภาพวาดที่เป็นลุคเดิม:**
  - ไอคอนสกิล 48 (`assets/icons/owl`) เกือบทุกอันมีตัวนกฮูกเดิม · ex_ 7 ยังเป็นไอคอนโค้ด
  - พื้นหลังผังสกิล 4 ภาพ (มีตัวนกฮูกเดิม) · ภาพหน้าเลือกตัว
  - ภาพหน้าโหลดที่มีนกฮูกเดิม: ld1 (บินอยู่กลางภาพ) · ld4 (ส่องกล้อง) · ld8 (ถือม้วนกระดาษ)
  - ไอคอนอาวุธ (หน้าไม้แต่ละแดน `wp_<แดน>_owl`) เป็นไอเทม ไม่ต้องเปลี่ยน
- **ภาพเอฟเฟกต์ใช้ต่อได้ทุกแบบ:** `assets/fx/owl` 36 ภาพ (ลูกดอก ขนนก ผลึกน้ำแข็ง พระจันทร์ ตาทอง o17 วิญญาณนกฮูกขาว o18 โดมขนนก o31 โคม เต็นท์) และชีต `assets/skill-vfx/owl` (ปีก ขนนก ผลึก) ไม่มีตัวนกฮูกเดิม → ขอแค่ลุคใหม่ **ขนขาว ตาสีทอง** ก็เข้ากัน

**ถ้าเปลี่ยน ทำแบบนี้:**
- คลิป 20 อัน คงเวลาเฟรมตี / ร่ายเดิมทุกทิศ → ดาเมจกับจังหวะไม่เปลี่ยน · ตัวสูงบนจอเท่าเดิม
- งานที่ตามมา: หน้า HUD + ภาพหน้าเลือกตัว + ท่านั่ง (ใหม่ทั้งหมด)
- ทีหลัง: ไอคอน 48 + ex_ 7 + ผังสกิล 4 ภาพ + ภาพหน้าโหลด 3 ภาพ
- แบบ 5 ใกล้ลุคเดิมที่สุด ไอคอน ผังสกิล และภาพหน้าโหลดเดิมยังพอเข้ากันได้นานสุด

## ทำไมลุคเดิมยังไม่เด่น
- **ในเกมสีออกชมพูอมม่วงทั้งตัว** (ขน ชุด หน้าไม้ ตอนทำคลิปสีเพี้ยน) → ดูเป็นนกสีชมพู ไม่ใช่นกฮูกหิมะ · บนหิมะ (บ้านนอร์สของมันเอง) สีจางกลืนพื้น · ไม่เข้ากับไอคอน ผังสกิล และภาพเอฟเฟกต์ ที่วาดเป็นนกขาว + น้ำเงินกลางคืน + เงิน + ทอง
- **ตัวเป็นก้อนขนฟู:** ปีกทำเป็นผ้าคลุมขนฟูยาวถึงเท้า + ปลอกคอขนใหญ่ + ขนที่ข้อมือ + บูทขน → ไม่เห็นรูปร่าง (ปัญหาเดียวกับแรดตัวเดิม)
- **หน้าไม้เล็ก** สีไม้อ่อน ถือต่ำข้างสะโพก ตอนยิงก็ยกไม่สูง → อาวุธที่เป็นตัวตนของ "นักแม่นปืน" แทบไม่เห็นบนจอ
- **ชุดนักเดินป่าทั่วไป:** สายหนัง กระเป๋า ลูกปัดไม้ ผ้าคลุมกรมท่าลายถัก ธงเกล็ดหิมะแบบเดียวกับแรดตัวเดิม → ไม่มีอะไรบอกสาย A (แสงจันทร์ เล็งแม่น) หรือสาย B (พายุหิมะ กับดัก ล่องหน)
- **หน้าบึ้งตลอด** (คิ้วขมวด หน้า HUD ดูโกรธ) · จุดสีม่วงบนหัวดูเป็นลายจุด ไม่ใช่ลายนกฮูกหิมะจริง (นกฮูกหิมะจริงขาว มีจุดกับขีดสีดำบนหัว หลัง ปีก)

## กติกา (อยู่ในพรอมต์ 0 แล้ว)
- **นกฮูกหิมะจริงๆ:** หัวกลมใหญ่ หน้าแบน ตากลมโต **สีทอง** (สกิลใช้ "ตาทอง": มาร์ค Owl's Eye, Perfect Hunt ตาทองลุกโชน, ภาพ o17) · คิ้วขนแหลม จะงอยปากดำงุ้มเล็ก จุกขนสั้น 2 จุกบนหัว · **ขนขาวล้วน** เงาเทาฟ้า มีจุดและขีดสีดำเข้มชัดๆ บนหัว หลัง ปีก · ห้ามชมพู ม่วง ครีม
- **ปีกพับไว้ข้างหลังเหมือนผ้าคลุมขนนกเพรียว** (บางสกิลกางปีก) · มีแขนกับมือแยกต่างหาก ถือหน้าไม้ · ขาเป็นขนขาวหนาถึงเท้าเหมือนรองเท้าขนฟู มีกรงเล็บดำ (ขานกฮูกหิมะจริง)
- **หัวโล่งเสมอ:** หัว จุกขนทั้งสอง ตาทั้งสอง เห็นทุกมุม · ห้ามฮู้ด หมวก หมวกเกราะ แว่นบังตา · ใส่ได้แค่มงกุฎบาง กิ๊บ หรือเลนส์ข้างเดียวถ้าแบบนั้นบอก
- **หน้าไม้ 1 คันในมือทุกมุม:** ต้องเป็นหน้าไม้ (คันธนูขวางบนด้ามแบบปืน) ไม่ใช่ธนู · อย่างน้อยกว้างเท่าไหล่ · ห้ามสะพายหลัง · ซองลูกดอกเล็กที่สะโพก
- **นักล่าตัวเบา:** ตัวเพรียว ยืนตรง เล็กกว่าสายต่อย · ไม่ใช่ก้อนขนกลม: ขนหน้าอกเรียบ เห็นรูปร่าง ขนฟูแค่ที่คอกับเท้า
- **เด่นบนหิมะ:** ชุดสีเข้มสด (แต่ละแบบบอกสีเอง) + ลายจุดดำบนหลัง ปีก หัว ทำให้ตัวขาวไม่จมหิมะ
- **ชุดยาวไม่เกินเข่า** เห็นขาตอนเดิน · ของห้อยน้อย
- **ไม่ซ้ำฮีโร่อื่น:** หมาป่าขาว (ไวกิ้งขวานใหญ่ ผ้าคลุมแดงเข้ม เสื้อกรมท่า) · แรดขนยาว (ขนเกาลัด เหล็กดำ ฟ้าธารน้ำแข็ง ทองแดง) · อีกาดำ (หอก เงาม่วง) · ลิงหิมะ (เสื้อขาวลายเมฆครามกับพู่แดง) · จิ้งจอกเก้าหาง (ขาวชมพู มิโกะ)
- **ไม่ลอกนกฮูกจากเกม / หนัง / หนังสือ:** ห้ามฮู้ดคลุมหัว ห้ามขนนกเป็นรูปใบไม้
- **ห้ามสีเขียว** (คลิปตัดพื้นเขียว) · ห้ามตัวอักษร · รูนเป็นสัญลักษณ์เส้นตรงเรียบๆ อ่านไม่ออก
- **มุมขวาล่างของชีต:** ท่าสู้ 2 ท่า ใช้ดูว่าลุคนี้เวลาสู้เท่ไหม และเป็นแบบให้ไอคอนกับผังสกิลทีหลัง
  - คุกเข่ายิงหน้าไม้ ลูกดอกเงินพุ่งออกไป พระจันทร์เสี้ยวบางๆ เรืองหลังตัว = สาย A Moonlit Marksman
  - กระโดดถอยหลัง ตัวครึ่งหนึ่งหายไปในลมหิมะกับขนนกขาว วงผลึกน้ำแข็งผุดจากพื้นข้างหน้า = สาย B Snowstorm Trickster

## วิธีใช้
1. เปิดแชต ChatGPT ใหม่
2. ส่งพรอมต์ 0 พร้อมแนบ 2 ภาพ (ส่งให้ในแชตแล้ว):
   - `keyart_campfire_ld5.jpg` = ภาพปกแคมป์ไฟ (`assets/loading/ld5.webp`) ใช้เป็นแบบลายเส้น · ภาพนี้ไม่มีนกฮูก · **อย่าใช้ ld1 ld4 ld8** เพราะมีนกฮูกเดิมอยู่ ChatGPT จะลอกลุคเดิมมา
   - `hero_ref_wukong.jpg` (`tools/ref/`) = แบบสัดส่วนฮีโร่ชายตัวเพรียว ไม่ให้ลอกชุด
3. รอให้มันตอบ ready
4. ส่งแบบ 1–5 ทีละข้อความ (ข้อความละ 1 ภาพ) · **แบบ 5 แนบ `owl_old_ref.jpg` (ลุคเดิม, `tools/ref/`) ไปกับข้อความนั้นด้วย**
5. ชอบคนละส่วน → ใช้พรอมต์ผสม

ประโยคแก้ภาพ (ต่อท้ายแล้วส่ง):
- ขนออกชมพู / ม่วง / ครีม → `His feathers must be pure snowy white with cool grey shading and bold charcoal-black speckles: no pink, no lavender, no cream.`
- ตัวขาวจมหิมะ → `He must stand out on snow: make his outfit deeper and more saturated, and give his crest, back and wings bolder dark speckles.`
- ตัวเป็นก้อนขน → `Show his body shape: smooth chest feathers and the wings folded slim behind him, fluff only at the neck and the feet, not a round feather ball.`
- หน้าไม้เล็ก / หาย → `Make the crossbow bigger and clearly visible in his hands in every view, at least as wide as his shoulders.`
- วาดเป็นธนู → `It must be a crossbow (a bow mounted across a stock and shot like a gun), not a bow.`
- ใส่ฮู้ด / หมวกมา → `Remove the hood or hat: his whole head, both feather tufts and both eyes must stay fully visible.`
- ปีกกลายเป็นแขน → `Keep his wings folded on his back like a feathered cape, and give him separate arms with hands that hold the crossbow.`
- ตาไม่ใช่สีทอง → `Give him big round gold-yellow eyes.`
- ตัวใหญ่หนักไป → `Make him slimmer and lighter: an agile marksman, not a heavy brawler.`
- มีสีเขียว → `Remove every green: use midnight blue, frost blue, silver or gold instead.`
- ดุจนน่ากลัว → `Keep him cool, but in the friendly chibi cartoon style of the attached images: a bigger head, bigger eyes and simpler shapes.`
- อยากได้แบบไหนเป็นผู้หญิง → `Make the hero a girl, with the same outfit idea and colours.`
- แก้แค่บางส่วน → ใช้แปรงเลือกเฉพาะจุดใน ChatGPT (สั่งแก้ทั้งภาพ มันจะวาดใหม่หมด)

## 5 แบบ

| แบบ | ลุค | สีตัด | ท่าภาพใหญ่ | ผูกกับ |
|---|---|---|---|---|
| 1 นักแม่นปืนราตรีขาว | นกฮูกหิมะขาวลายจุดดำ ตาทองคม มงกุฎเงินบางมีพระจันทร์เสี้ยวเรือง · ผ้าคลุมไหล่สั้นน้ำเงินเที่ยงคืน ซับทองจันทร์ กลัดพระจันทร์เงิน · เสื้อหนังเทาเข้ม สายคาดลูกดอกเงิน · กระโปรงน้ำเงินขอบลายพระจันทร์ทอง · **หน้าไม้เงินรูปพระจันทร์เสี้ยว** ด้ามไม้น้ำเงินแกะหน้านกฮูก ศูนย์เล็งทองมีหินจันทร์ | น้ำเงินเที่ยงคืน + เงิน + ทองจันทร์ + ฟ้าน้ำแข็งนิดหน่อย | ยกหน้าไม้ประทับไหล่ เล็งผ่านคนดู ตาข้างหนึ่งหรี่ ปีกพลิ้ว | ครบสองสาย · สาย C ราตรีขาว (White Night: Moonfall, Perfect Hunt) · สีตรงกับเอฟเฟกต์ ไอคอน ผังสกิลเดิม (เงิน น้ำเงินกลางคืน ทอง) |
| 2 นักซุ่มยิงตาเหยี่ยว | ขนลายเข้มขึ้น ตาทองดุ **เลนส์ข้างเดียวขอบทอง** ที่ตาขวา · เสื้อกั๊กหนังเทาน้ำตาลคอสูง สายรัดหัวเข็มขัดเยอะ · ผ้าพันคอสั้นน้ำเงินเข้ม · สายคาดลูกดอกปลายทอง · **หน้าไม้หนักยาวเกือบเท่าตัว** ไม้เข้มคาดทองเหลืองลายถักนอร์ส กล้องส่องทองเหลืองบนหน้าไม้ | หนังเทาน้ำตาล + น้ำเงินเข้ม + ทองเหลือง | คุกเข่าข้างเดียว ประทับหน้าไม้ มองผ่านกล้องส่อง นิ่งสนิท | สาย A (Aimed Shot, Deadeye, Far Sight, Hyper Range, Weakpoint) · นกฮูกส่องกล้องในภาพหน้าโหลด ld4 |
| 3 นักเล่นกลพายุหิมะ | ตาทองกวนๆ คิ้วข้างหนึ่งยก ลายฟ้าน้ำแข็งใต้ตา · ผ้าพันคอยาวฟ้าน้ำแข็งพันสองรอบ ปลายปลิว · เสื้อสั้นน้ำเงินโคบอลต์ขอบลายเกล็ดหิมะ · ผ้าคาดเอวเรียงลูกระเบิดหิมะ (ลูกแก้วมีหิมะหมุนข้างใน) · **หน้าไม้น้ำแข็งใส** ศูนย์เล็งรูปเกล็ดหิมะ | โคบอลต์ + ฟ้าน้ำแข็ง + ขาว + เงิน | กระโดดลอยด้านข้าง ยิงมือเดียว ขยิบตา อีกมือโยนระเบิดหิมะ ปีกครึ่งหนึ่งสลายเป็นหิมะ | สาย B (Flurry, Snow Snare, Snow Veil, White Out, Feather Flash, Blizzard Cage) |
| 4 สาวนักล่าแสงจันทร์ | ผู้หญิง หน้านกฮูกน่ารัก ตาทองโต ขนตายาว แก้มแดง จุกขนบนหัวปัดไปข้างหลังเหมือนหางม้าเล็ก มัดกิ๊บพระจันทร์เงิน · ผ้าคลุมสั้นน้ำเงินไพลินขอบขนขาว · ชุดสั้นน้ำเงินไพลินปักพระจันทร์ · **หน้าไม้ขาวทอง ปีกหน้าไม้เป็นรูปปีกนกฮูกกาง** | น้ำเงินไพลิน + เงิน + ทองอ่อน | พาดหน้าไม้บนไหล่ มือเท้าเอว ขยิบตา ปีกกางครึ่งหนึ่ง | ถ้าอยากได้นกฮูกเป็นผู้หญิง |
| 5 นกฮูกหิมะโฉมใหม่ | ลุคเดิมแต่งให้เท่: ขนขาวล้วนลายจุดดำ (ไม่ชมพู) จุกขน ตาทอง หน้านิ่งมั่นใจ (ไม่บึ้ง) · ผ้าคลุมไหล่กรมท่าลายถักขาว เข็มกลัดเกล็ดหิมะ ธงเกล็ดหิมะเหมือนเดิม · ปีกพับเพรียว ปลอกคอขนเล็กลง ไม่มีกระเป๋า · **หน้าไม้ใหญ่ขึ้นสองเท่า** ไม้วอลนัท ข้อต่อเงิน ศูนย์เล็งเกล็ดหิมะทอง | กรมท่า + หนังน้ำตาล + เงิน | ถือหน้าไม้พร้อมยิงพาดอก ผ้าคลุมกับธงปลิวลมหิมะ | ไอคอน ผังสกิล และภาพหน้าโหลดเดิมยังพอเข้ากันได้ |

แนะนำ:
- **แบบ 1** ครบสองสาย (พระจันทร์ = สาย A · ขาว / น้ำแข็ง = สาย B · ราตรีขาว = สาย C) และสีตรงกับภาพเอฟเฟกต์ที่มีอยู่แล้ว (เงิน น้ำเงินกลางคืน ทอง ฟ้าน้ำแข็ง) · พื้นหลังไอคอนเดิมก็เป็นน้ำเงินกลางคืนอยู่แล้ว
- **แบบ 5** ประหยัดสุด (ไอคอน ผังสกิล ภาพหน้าโหลดเดิมใช้ต่อได้นานสุด)
- ทุกแบบ **ขนขาว ตาสีทอง** → ภาพเอฟเฟกต์ 36 ภาพ (ขนนก ปีก วิญญาณนกฮูก ตาทอง) ใช้ต่อได้หมด
- ชื่อในหน้าเลือกตัว "Snowy Owl · Marksman" ใช้ได้ทุกแบบ

### พรอมต์ 0 — กติกา (ส่งครั้งเดียวต่อแชต พร้อมแนบ 2 ภาพ)
```
I will ask you for several character design sheets of ONE hero for my cute cartoon fantasy MMORPG (animal heroes from Norse, Greek, Egyptian, Japanese and Aztec myths). These rules apply to every sheet in this chat. Do not draw anything yet: reply only "ready", then draw ONE sheet each time I send a design.

Style: copy the first attached image (the game's key art) — friendly hand-painted chibi cartoon, thick clean dark-brown outlines (not black), cel shading with 2–3 flat tones, soft cartoon glow, bright and warm. Not realistic, not painterly, not 3D. The wolf and the cat in the first image and the monkey in the second image are other heroes of my game: match their proportions, outline weight, colouring and finish, but do NOT copy their designs.

The hero: the Snowy Owl, the marksman of the frozen north — a calm, sharp-eyed Norse hunter who never misses, fighting from far away with a crossbow. One path makes him a moonlit marksman — bolts soaked in moonlight, aimed shots at weak points, piercing and ricocheting bolts, and a silent execution under a crescent moon. The other path makes him a snowstorm trickster — rapid frost bolts, ice snares, a rain of bolts from the sky, vanishing into blowing snow and trapping enemies in a blizzard cage. His strongest skills call down moonbeams and set his golden eyes blazing. He must look COOL and SHARP — the precise hunter players pick to strike from afar — while staying in the game's cartoon style (a hero, not a wild bird):
- a real SNOWY OWL: a big round head with a flat facial disc, big round GOLD-YELLOW eyes (his skills make them blaze gold), sharp feathered brows, a small hooked black beak, two short feather tufts on top of his head; snow-white feathers with cool grey shading and bold charcoal-black speckles and short bars on his crest, back and wings, like a real snowy owl — pure white, never pink, lavender or cream
- his own wings are folded on his back like a slim feathered cape (each design gives the length); he has separate arms with hands that hold the crossbow; his legs are covered in thick white feathers down to the feet like fluffy slippers, with black talons
- his head, both feather tufts and both eyes are always fully visible: no hood, no hat, no helmet, no goggles over the eyes — only a thin circlet, a clip or a monocle if the design gives one
- his weapon is ONE CROSSBOW (a bow mounted across a stock and shot like a gun, not a bow), held in his hands in every view and never on his back, big enough to read: at least as wide as his shoulders (each design gives its look); a small quiver of bolts at his hip
- a light, agile hunter: slim and upright, smaller and lighter than a brawler — never a round feather ball: smooth chest feathers so his body shape reads, fluff only at the neck and the feet
- he must stand out on snow: his outfit uses deep, saturated colours (each design gives them), and the dark speckles on his crest, back and wings keep his white feathers from melting into the snow
- the outfit ends at or above the knee so his legs read when he walks; only a few dangling items
- he must look clearly different from my other heroes: a white wolf Viking with a greataxe, a crimson cape and a navy tunic; a woolly rhino brawler in chestnut wool, dark iron and glacier blue; a black raven spear fighter with violet shadow doubles; a snow monkey monk in a white jacket with indigo cloud swirls and red pompoms; a pink-and-white nine-tailed fox shrine maiden
- an original design, not based on any owl from a game, film or book: no hood or cowl, no leaf-shaped feathers
- no green anywhere on the character (use midnight blue, frost blue, silver or gold instead), and no letters or words anywhere — rune marks are simple angular carved symbols, never readable text

Every sheet: ONE wide image 1536×1024 on a plain soft cream background. No text, no labels, no names, no logo, no watermark.
Layout: LEFT HALF — the hero large, full body, three-quarter front view, in the pose the design gives. TOP RIGHT — a small turnaround of the same hero standing neutral, holding his crossbow low in both hands: front, side facing right, back, all the same height. BOTTOM RIGHT — two small action poses of the same hero side by side: a moonlit shot, kneeling and firing the crossbow while a silver bolt streaks away and a thin crescent moon glows behind him; and a snowstorm trick, leaping backward as half of him vanishes into a swirl of snow and white feathers while a ring of ice crystals bursts from the ground ahead.
Keep the hero identical in every view of a sheet. Every design I send is a completely new look: reuse nothing from earlier sheets in this chat.
```

### แบบ 1 — นักแม่นปืนราตรีขาว
```
Design 1 — "White Night Marksman". The silent hunter of the polar night: he waits under the moon, then one bolt finds its mark. Snow-white feathers with bold charcoal speckles on his crest, back and wings; piercing gold-yellow eyes with sharp dark rims, calm and focused; a thin silver circlet across his brow with a small glowing moonstone crescent in the middle. A short deep midnight-blue capelet over his shoulders, lined with pale moon-gold and fastened by a silver crescent-moon brooch; his folded wings hang below it like a slim feathered cape to the backs of his knees. A fitted dark slate-grey leather jerkin with a silver bolt bandolier across his chest, a midnight-blue tunic skirt above the knee with a pale-gold crescent-and-star border, dark leather gloves with small silver knuckle plates, silver bracers with a tiny crescent. His legs: thick white feathered legs like fluffy slippers with black talons, a thin dark leather strap around each ankle. The crossbow: a silver crescent-moon crossbow — the bow limbs are one polished silver crescent moon, the stock is dark midnight-blue wood carved with a small owl face at the back, a pale-gold ring sight with a tiny glowing moonstone, silver bolts with white feather fletching; a small dark-leather quiver at his right hip. Accent colours: midnight blue and silver with pale moon gold and a touch of glowing ice blue. Pose: a sharp three-quarter stance, the crossbow raised to his shoulder aiming just past the viewer, one eye narrowed along the sight, his wing-cape flaring a little behind him, a silver glint on the bolt tip.
```

### แบบ 2 — นักซุ่มยิงตาเหยี่ยว
```
Design 2 — "Deadeye Sharpshooter". The far-sighted sniper of the fjords: he spots a weak point from across the valley. Snow-white feathers with heavy charcoal bars on his back and wings, fierce gold-yellow eyes under heavy feathered brows, a round gold-rimmed monocle lens clipped over his right eye (the eye clearly visible through the glass), his feather tufts swept back. A sleeveless charcoal-brown leather sniper vest with a high collar and many small buckled straps, a short deep royal-blue scarf wrapped around his neck with the ends tucked in, a bandolier of gold-tipped bolts across his chest, a wide belt with a small brass spyglass case and a bolt quiver at his hip, royal-blue cloth wraps on his forearms, dark fingerless leather gloves, a short charcoal kilt with brass studs above the knee; his folded wings hang behind him to his hips. His legs: thick white feathered legs with black talons and brass ankle rings. The crossbow: a long, heavy arbalest almost as long as he is tall — dark wood bound with brass bands carved with simple Norse knotwork, heavy steel bow limbs, a brass spyglass sight mounted on top and a winding crank at the back. Accent colours: charcoal-brown leather and deep royal blue with polished brass. Pose: crouched low on one knee, the arbalest's stock against his shoulder, peering through the brass spyglass sight with his monocle eye, perfectly still, a faint gold glint at the far end of his aim.
```

### แบบ 3 — นักเล่นกลพายุหิมะ
```
Design 3 — "Snowstorm Trickster". The prankster of the blizzard: now you see him, now you are stuck in his snow trap. Snow-white feathers with charcoal speckles, mischievous half-lidded gold-yellow eyes, one feathered brow raised, a small frost-cyan zigzag marking under each eye. A long frost-cyan scarf with a white zigzag pattern wrapped twice around his neck, its two ends fluttering; a short deep cobalt-blue tunic above the knee with a white snowflake-and-zigzag hem, a cobalt sash with a row of small round glass snow-bombs (each a clear orb with swirling snow inside), white fur cuffs on his forearms, frost-blue fingerless gloves; his folded wings hang behind him to his hips, their tips dipped in frost cyan. His legs: thick white feathered legs with black talons, cobalt cord wraps at the ankles. The crossbow: an ice crossbow — clear frost-blue crystal bow limbs, a pale silver stock, a snowflake-shaped sight, bolts tipped with small ice crystals. Accent colours: deep cobalt and frost cyan with white and silver. Pose: leaping sideways in mid-air, firing the ice crossbow one-handed while winking, the other hand tossing a snow-bomb, half of his wing-cape dissolving into swirling snowflakes and white feathers.
```

### แบบ 4 — สาวนักล่าแสงจันทร์
```
Design 4 — "Moonlight Huntress". This time the hero is a girl: a young Norse snowy owl huntress, graceful and sharp. All the rules above apply to her. A cute snowy owl face with soft white feathers and a few dark speckles, big bright gold-yellow eyes with long lashes, rosy cheeks, a confident smile, her two feather tufts swept back like little ponytails held by silver crescent clips. A short deep sapphire-blue hunting cape on her shoulders with a white fur trim and a pale-gold crescent clasp, her folded wings below it to the backs of her knees. A fitted sapphire-blue tunic dress above the knee with pale-gold crescent embroidery, a wide dark belt with a round silver moon buckle and a small quiver, sapphire gloves with gold cuffs, thick white feathered legs with black talons and thin silver anklets. The crossbow: an elegant white-and-gold crossbow whose bow limbs are shaped like a pair of spread owl wings carved in ivory with gold edges, a pale-blue moonstone sight, white-fletched bolts. Accent colours: deep sapphire blue and silver with soft gold and a touch of ice blue. Pose: the crossbow resting on her shoulder, the other hand on her hip, winking, her wings half open behind her.
```

### แบบ 5 — นกฮูกหิมะโฉมใหม่ (แนบ `owl_old_ref.jpg` ไปกับข้อความนี้)
```
Design 5 — "Snowy Owl Reborn". The hero my game already has (the image attached to this message). Keep his idea — the fluffy feather tufts, the big gold eyes, the navy Nordic capelet with white zigzag knotwork and the round snowflake brooch, the brown leather belt, the navy snowflake banner on the front, the wooden crossbow, the feathered feet with talons — but make him cool and sharp. His feathers become pure snowy white with cool grey shading and bold charcoal speckles (no pink, no lavender, and no purple spots). A calm, confident look instead of an angry frown. His wings fold slim behind him to the backs of his knees and the big fur collar becomes a small white neck ruff, so his body shape reads (not a feather ball). A crisper outfit: the navy capelet with clean white knotwork, a fitted dark-brown leather jerkin with one bolt bandolier across the chest (no pouches, no beads), the navy snowflake banner hanging from a wide belt with a silver buckle, navy gloves. The crossbow: twice as big as before, dark walnut wood with silver fittings and a gold snowflake sight, held ready in both hands. Thin leather ankle wraps over his feathered feet with black talons (no big boots). Accent colours: navy and warm brown leather with silver and a touch of gold. Pose: the crossbow held ready across his chest, a confident look, his capelet and the banner blown by the snowy wind.
```

### พรอมต์ผสม (ตัวอย่าง — เปลี่ยนเลขกับส่วนได้)
```
Design 6 — a mix: the head and feathers of design 1 with the outfit and colours of design 3, holding the crossbow of design 2, in the pose of design 1. Same rules and layout.
```

## เลือกแล้วทำอะไรต่อ
1. ส่งชีตที่เลือกมา → เขียนหัวข้อ 'เลือกแล้ว' ในไฟล์นี้ (หน้าตาตามที่วาด + พรอมต์ภาพยืน 5 มุมบนพื้นเขียว S SE E NE N ด้านข้างหันขวา ท่าเดียวกัน ขนาดเท่ากัน ถือหน้าไม้ต่ำด้วยสองมือทุกมุม) · ภาพใหญ่ของชีต → หน้าเลือกตัว (`tools/bigpose_cut.py` แล้ว `select_cut.py` แบบหมาป่า / แรด / อนูบิส)
2. ภาพตั้งต้น (`tools/dir8cut.py startv` size=900 feet .9 clean=0 · เว้นที่ด้านหน้าให้ยกหน้าไม้ประทับไหล่ และด้านข้างให้กางปีก) + พรอมต์คลิป 20 อัน (`tools/clip_prompts.py` เพิ่มรายการ owl) — ท่าที่เกมใช้:
   - **ท่าตี** = ยกหน้าไม้ขึ้นประทับไหล่ เล็งนิ่ง ยิง (สะบัดนิดเดียว) แล้วลดลง · เกมใช้ 2 เฟรมเป็นหลัก: เฟรม 'โดน−2' (เฟรม 6) = เล็งนิ่ง ค้างตอนเล็ง · เฟรม 'โดน−1' (เฟรม 7) = จังหวะยิง ค้างทุกนัด → ใช้กับตีปกติและสกิลยิงทุกสกิล (Piercing, Aimed Shot, Deadeye, Hunter's Mark, Heavy Bolt, Armor Drill, Ricochet, Flurry, Snow Snare, Circling Hunt) · Silent Execution เล่นต่อตั้งแต่เฟรมโดนจนจบ → เฟรมหลังยิงต้องลดหน้าไม้ลงสวย
   - **ท่าบัฟ** = ย่อตัว → กางปีกที่พับอยู่ออกกว้าง ชูหน้าไม้ขึ้นเหนือหัว ค้างราว 1 วิ (แนะนำ):
     - เฟรม 1 (ย่อตัวเตรียมกระโดด) ค้างตอน Wing Hop · Snow Veil · Skyfall ตอนกระโดดขึ้น · Snow Tent ค้างเฟรมนี้ตลอดเวลาพัก
     - เฟรม 3 (ท่ากลางทาง ดูลอยกลางอากาศได้) ค้างตอน Skyfall ลอยกลางอากาศ 0.42 วิ · Feather Flash
     - เฟรม 7 จุดสูงสุด ค้างตอน Feather Guard, Snow Lantern, Fatal Bolt, Frost Volley, Shatter, Blizzard Cage, Avalanche Rain, Moonfall, Perfect Hunt · Silent Execution ค้างท่านี้ตอนเล็งก่อนยิง
3. คลิปมา → `tools/cliphero.py` → **เขียนทับ `assets_owl.js`** (prefix OW เดิม ใช้กับนกฮูกตัวเดียว) คงเวลาเฟรมเดิม:
   - ท่าตี 12 เฟรม โดนเฟรม 8 ทุกทิศ (สกิลยิงค้างเฟรม 6 / 7 ตามเวลาเล็งของสกิลเอง → จังหวะยิงไม่ขึ้นกับเวลาพวกนี้)
     - S = 50, 50, 50, 50, 50, 50, 50, 121, 160, 180, 121, 110 (โดน 471 ms · เฟรมเล็งเริ่ม 300 ms)
     - SE = 69, 50, 50, 69, 69, 69, 69, 69, 160, 104, 104, 110 (514 ms)
     - E = 85, 50, 50, 50, 50, 50, 50, 50, 160, 171, 128, 110 (435 ms)
     - NE = 69, 50, 50, 69, 69, 50, 50, 69, 160, 173, 104, 110 (476 ms)
     - N = 72, 72, 50, 50, 50, 50, 50, 72, 160, 143, 143, 110 (466 ms)
   - ท่าบัฟ 12 เฟรม จุดสูงสุดเฟรม 7 ค้าง 480 ms
     - S = 76, 76, 76, 76, 76, 76, 76, 480, 189, 76, 76, 50 (ถึงจุดสูงสุด 532 ms)
     - SE = 50, 50, 79, 79, 79, 79, 79, 480, 158, 79, 79, 52 (495 ms)
     - E = 50, 50, 90, 90, 90, 90, 90, 480, 181, 90, 50, 60 (550 ms)
     - NE = 82, 50, 82, 82, 82, 82, 82, 480, 165, 124, 50, 55 (542 ms)
     - N = 79, 50, 79, 79, 79, 79, 79, 480, 158, 118, 79, 53 (524 ms)
   - เดิน 8 × 100 ms (E สลับ 110 / 90) · ยืน 12 เฟรม 2.4 วิ · โดนตี 7 เฟรม 550 ms (ทำจากท่ายืน)
   - ตัวยืน S สูงบนจอเท่าเดิม (`CHAR_SCALE.owl` .97 วัดใหม่) · จุดหน้าไม้ทุกเฟรมของท่าตีกับท่าบัฟ (`sockets` attack + buff, head / grip) — ลูกดอกออกจากจุดคงที่หน้าตัว (`owMuzzle`) ไม่ได้อ่านจุดนี้ จุดนี้ใช้แค่ประกายตอนร่าย
4. ตามมา: หน้า HUD (`window.HUD_FACE`, แทน `OW_PORTRAIT` เดิม) + ภาพหน้าเลือกตัว + ท่านั่ง (`hero_sit.js`)
5. ทีหลัง: ไอคอน 48 + ex_ 7 + ผังสกิล 4 ภาพ + ภาพหน้าโหลด ld1 ld4 ld8 (เขียนพรอมต์ให้ตอนลุคนิ่งแล้ว)
