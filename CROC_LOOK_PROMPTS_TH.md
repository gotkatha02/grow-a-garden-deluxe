# จระเข้ (Crocodile): ลุคใหม่ 5 แบบ (2026-11-25 18:51)

เจ้าของ: "อยากทำดีไซน์จระเข้ใหม่" (ไม่ได้บอกแนว) → เขียนไว้หลายแนวให้เลือก:
- จระเข้นักรบตัวใหญ่ 3 แบบ: แบบ 1 ครบสองสาย · แบบ 2 สาย A ทหารหอกวิหาร · แบบ 3 สาย B นักล่าในน้ำ
- สาวจระเข้ 1 แบบ (แบบ 4)
- ลุคเดิมแต่งให้เท่ 1 แบบ (แบบ 5)

ถ้าไม่ตรงใจ บอกแนวที่อยากได้มาได้เลย (เช่น อ้วนกลมน่ารักกว่านี้ หรือดุแบบนักล่าดึกดำบรรพ์)

ภาพเทียบลุคเดิม + ภาพทดสอบสีกับพื้นเขียว (ส่งในแชตแล้ว, ไม่เก็บในรีโป): ในเกม · หน้าเลือกตัว · ผังสกิล 4 ภาพ · ไอคอน

**กติกาใหม่ของพรอมต์ (2026-11-25):** ทุกกล่องจบในตัว (สไตล์ + กติกา + แบบชีต + ดีไซน์อยู่ในกล่องเดียว) ไม่มีพรอมต์ 0 ส่งก่อน · ห้ามแนบไฟล์ .md นี้ให้ ChatGPT

**เลือกแล้ว: แบบ 3 นักล่าแห่งทะเลสาบ (2026-11-25 19:27)** — เจ้าของส่งชีตแบบ 3 มาโดยไม่มีข้อความ → ถือว่าเลือกแบบนี้ → ภาพใหญ่เป็นภาพหน้าเลือกตัวแล้ว · พรอมต์ภาพยืน 5 มุม (ส่งในแชตแล้ว): หัวข้อ 'เลือกแล้ว' ท้ายไฟล์ · คลิป 20 ตัว: `CROC_CLIP_PROMPTS_TH.md`

## เปลี่ยนจระเข้กระทบอะไรบ้าง
- **ยังไม่มีสไปร์ทของตัวเอง:** ในเกมใช้ร่างหมาป่าเก่า (`assets.js`) ย้อมสีเขียวเทา (`CHAR_FILTER.croc`) → ไม่มีอะไรต้องรื้อ · ร่างใหม่ = ไฟล์ใหม่ `assets_croc.js` โหลดเฉพาะ `?char=croc` (แบบ `BST_ART` ของบาสเต็ด) · `assets.js` ไม่แตะ (ยังเป็นร่างชั่วคราวของจิ้งจอก อนูบิส สิงโต อีกา)
- **ขนาด:** `HERO_SIZE.croc` .882 = ตัวใหญ่สุดกลุ่มเดียวกับแรด (เจ้าของตั้งเองในหน้าปรับขนาด) → ดีไซน์ใหม่ต้องเป็นจระเข้ตัวใหญ่หนัก · `CHAR_SCALE.croc` 1 วัดใหม่จากท่ายืน
- **ไม่มี** แฟชั่นติดตัว หน้ากากสี ท่านั่ง · หน้า HUD ตอนนี้เป็นหน้าหมาป่าเก่า → ตัดหัวใหม่จากภาพหน้าตรง (`window.HUD_FACE`)
- **ภาพวาดที่เป็นลุคเดิม (หงอนขนนกแดงขาว ตัวเขียวมะกอก):**
  - ไอคอนสกิล 49 (`assets/icons/croc`) ทุกอันมีตัวจระเข้เดิม · ex_ 18 ยังเป็นไอคอนโค้ด
  - พื้นหลังผังสกิล 4 ภาพ (`SKILL_BG_ALL.croc` = `assets/inl/assets_skillbg/012–015`) · ภาพหน้าเลือกตัว
  - ภาพหน้าโหลดที่มีจระเข้เดิม: ld1 (ถือหอกขวาบน) · ld2 (กระโดดกลางภาพ) · ld8 (ซ้ายล่าง)
- **เอฟเฟกต์สกิลเป็นภาพโค้ดอยู่แล้ว** (`croc_art.js` + `croc_vfx3.js`): ใบหอกออบซิเดียนดำผูกทอง · ปากจระเข้ 3 สกิน (ธรรมดา **สีเขียว** / ทอง / เหล็ก) · วิญญาณ Cipactli สีทองขนนกเควทซัล · ศิลาสุริยะ ลายขั้นบันได → ลุคใหม่ใช้หอก **ใบออบซิเดียนดำ** ทุกแบบ เอฟเฟกต์เข้ากันเลย · ปากจระเข้สกินธรรมดาแก้จานสีให้ตรงผิวใหม่ได้ในบรรทัดเดียว
  - ภาพวาดเอฟเฟกต์เก่า `assets/fx/croc` 29 ภาพ + `assets/skill-vfx/crocodile` 9 ภาพ ใช้แค่ตอน `?vfx3=0` (ลุคเก่า)

**ถ้าเปลี่ยน ทำแบบนี้:**
- คลิป 20 อัน คงเวลาเฟรมของ `assets.js` ทุกทิศ (ตารางท้ายไฟล์) → ดาเมจกับจังหวะตี / ร่ายไม่เปลี่ยน
- งานที่ตามมา: หน้า HUD + ภาพหน้าเลือกตัว + ปิดสีย้อม `CHAR_FILTER.croc` + เปลี่ยนสีปากจระเข้ในโค้ด
- ทีหลัง: ไอคอน 49 + ex_ 18 + ผังสกิล 4 ภาพ + ภาพหน้าโหลด ld1 ld2 ld8
- แบบ 5 ใกล้ลุคเดิมที่สุด ไอคอน ผังสกิล และภาพหน้าโหลดเดิมยังพอเข้ากันได้นานสุด

## ทำไมลุคเดิมยังไม่เด่น
- **ในเกมยังไม่ใช่จระเข้เลย:** เป็นร่างหมาป่าเก่าย้อมเขียวเทา ตัวเล็ก ไม่มีหาง ไม่มีปาก และสีกลืนป่าเขียวของแดนแอซเท็ก (บ้านตัวเอง)
- **หัวไม่เป็นจระเข้:** หงอนขนนกแดงขาวใหญ่คลุมหัวด้านบนกับด้านหลัง ไม่เห็นสันคิ้ว ตา เกล็ดหลัง · ปากปิดไม่เห็นฟัน · หน้าบึ้ง → ดูเป็นกิ้งก่าทั่วไป · หงอนใหญ่ยังบังหมวกแฟชั่นทีหลังด้วย
- **ตัวเป็นผู้ชายหัวจระเข้:** อกเรียบมีซิกแพ็กแบบคน แขนเล็ก ทั้งที่เจ้าของตั้งขนาดไว้ใหญ่เท่าแรด · ไม่เห็นเกราะเกล็ด หลังหนา หางหนัก (สาย B งับ ม้วนตัว ลากลงน้ำ ควรดูหนักแน่น)
- **ชุดรก:** หงอน + กระโปรงขนนก + ผ้าห้อย + กางเกงหลวมน้ำตาล + ผ้าพันแข้ง + รองเท้า + สายหนัง + ลูกปัด → ขาไม่เห็น ตอนเดินอ่านท่าไม่ออก
- **ซ้ำเสือจากัวร์:** ขนนกสีแดงบนหัวเป็นไอเดียเดียวกับพัดขนนกแดงเทอร์ควอยซ์ของเสือจากัวร์ (ฮีโร่แอซเท็กอีกตัว)
- **ใบหอกดูเป็นเหล็ก** แต่เอฟเฟกต์สกิลในเกมวาดเป็นออบซิเดียนดำ (Obsidian Edge, Obsidian Rain, ใบหอกตอนแทง)
- **ไม่มีอะไรบอกสาย:** สาย A ทหารหอกวิหาร (แทงแม่น เกราะแตก หอกสุริยะ) กับสาย B นักล่าแม่น้ำ (งับ เลือดเดือด ม้วนตัว) ดูเหมือนกันหมด

**เรื่องสีผิว (ทดสอบแล้ว, ภาพส่งในแชต):** คลิปท่าทั้งหมดตัดพื้นเขียว · สีเขียวมะกอกแบบเดิม (ราว RGB 143,135,83 = แดงพอๆ เขียว) ผ่านการตัดได้ · แต่ถ้าเป็น **เขียวสด** ตัวจะโปร่งแสงและสีเพี้ยนเป็นม่วงเทา → ทุกแบบใช้ผิวบรอนซ์ / น้ำตาล / เทา / ทราย / เขียวมะกอกอมบรอนซ์ ห้ามเขียวสด

## กติกา (อยู่ในทุกกล่องแล้ว)
- **หัวจระเข้จริงๆ:** ปากยาวแบนมีปุ่มจมูกที่ปลาย · ยิ้มเห็นฟันขบกันตลอดแนวปากแบบจระเข้ · สันคิ้วกระดูกหนา ตาเล็กคมสีอำพันทอง ม่านตาเป็นขีด · ไม่มีใบหู · หัว ปาก ตา สันคิ้ว เห็นทุกมุม ห้ามหมวกขนนกใหญ่ หมวกเกราะ ฮู้ด หน้ากาก (เครื่องประดับเล็กได้ ยกเว้นแบบ 5 ที่คงหงอนแต่ย่อลง)
- **ตัวจระเข้:** เกล็ดกระดูกขรุขระตามแนวหลัง · อกเป็นเกล็ด ท้องสีอ่อนเกล็ดสี่เหลี่ยม · มือเท้ามีเล็บ · หางยาวหนักเท่าตัว มีเกล็ดสูงสองแถวบนหาง
- **ตัวใหญ่หนักเท่าแรด** ไหล่กว้าง แขนขาหนา หลังหนา ห้ามตัวผอมแบบคนมีซิกแพ็ก
- **ห้ามเขียวสด / มรกต / เขียวมะนาว / หยก** (คลิปตัดพื้นเขียว) · เทอร์ควอยซ์ต้องเป็นฟ้าอมเขียวที่ฟ้ามากกว่า · น้ำวาดเป็นฟ้าใสกับขาว
- **หอกยาวใบออบซิเดียนดำเหลือบม่วง 1 เล่ม ถือในมือทุกมุม** ยาวกว่าตัว ห้ามสะพายหลัง ทั้งเล่มต้องอยู่ในภาพ (ตรงกับเอฟเฟกต์สกิลในเกม)
- **นักรบแอซเท็ก:** เกราะผ้าฝ้ายบุนวม ผ้าเตี่ยว ผ้าคาด ทองกับโมเสกเทอร์ควอยซ์ ลายขั้นบันได ลายพระอาทิตย์ · ชุดยาวไม่เกินเข่า เห็นขาเกล็ดตอนเดิน · ของห้อยน้อย
- **เด่นบนป่าเขียว:** สีชุดอุ่นสด
- **ไม่ซ้ำฮีโร่อื่น:** เสือจากัวร์สาวนักระบำ (พัดขนนกแดง) · มังกรหลอมเพลิง (อัศวินมังกรแดง เกราะขาว ดาบใหญ่ → ห้ามเขา ห้ามปีก ห้ามเกราะแผ่น) · มังกรน้ำเงิน · ฮิปโป (ผ้าคลุมเกล็ดจระเข้สีเทล โล่) · แอกโซลอเติลชมพู · ฮีโร่อียิปต์ (ห้ามผ้าคลุมหัวฟาโรห์: จระเข้เป็นแอซเท็ก ไม่ใช่โซเบค)
- **ไม่ลอกจระเข้จากเกม / หนัง / หนังสือ** · ห้ามตัวอักษร (ลายมีแค่ขั้นบันได รังสีพระอาทิตย์ ซิกแซก)
- **ชีต:** ซ้าย = ภาพใหญ่ตามท่า · ขวาบน = หน้า / ข้างหันขวา / หลัง ถือหอกตั้งข้างตัว · ขวาล่าง = ท่าสู้ 2 ท่า: แทงหอกทะลุแผ่นเกราะหิน เศษออบซิเดียนกระเด็น (สาย A) · พุ่งงับต่ำออกจากน้ำ อ้าปากกว้าง (สาย B)

## วิธีใช้
1. เปิดแชต ChatGPT ใหม่
2. ส่งทีละกล่อง (ข้อความละ 1 ภาพ) แนบ 2 ภาพทุกข้อความ (ส่งให้ในแชตแล้ว):
   - `keyart_campfire_ld5.jpg` = ภาพปกแคมป์ไฟ (`assets/loading/ld5.webp`) แบบลายเส้น · ภาพนี้ไม่มีจระเข้ · **อย่าใช้ ld1 ld2 ld8** เพราะมีจระเข้เดิม ChatGPT จะลอกลุคเดิมมา
   - `hero_ref_rhino.jpg` (`tools/ref/`) = แรดลุคใหม่บนพื้นครีม แบบสัดส่วนฮีโร่ตัวใหญ่หนัก (ไม่ให้ลอกชุด)
   - **แบบ 5 แนบ `croc_old_ref.jpg` (`tools/ref/`, ลุคเดิม) เป็นภาพที่ 3 ด้วย**
3. ชอบคนละส่วน → พรอมต์ผสม (ส่งในแชตเดียวกับแบบที่วาดไปแล้ว)

ประโยคแก้ภาพ (ต่อท้ายแล้วส่ง):
- ตัวออกเขียวสด → `His scales must be warm and brownish as the design says, never bright leaf green, emerald or lime.`
- มีหมวก / หงอนคลุมหัว → `Remove the headdress / helmet: his whole crocodile head, the long snout, the brow ridges and both eyes must be fully visible.`
- ดูเป็นกิ้งก่า / ไดโนเสาร์ / มังกร → `Make him clearly a crocodile: a long flat snout with the interlocking teeth showing, eyes and nostrils on top of the head, rough bony scutes down the back and a double row of scutes along the tail. No horns, no wings.`
- ตัวผอมแบบคนมีซิกแพ็ก → `Make him big and heavy like the rhino in the second image: broad shoulders, thick arms, a scaly chest with pale square belly scales, not a slim human torso with abs.`
- หอกสั้น / หาย / สะพายหลัง → `Make the spear longer than he is tall, held in his hands in every view, with a black obsidian blade; keep the whole spear inside the picture.`
- ใบหอกเป็นเหล็ก → `The spear blade is black obsidian (volcanic glass with a violet sheen), not steel.`
- เทอร์ควอยซ์ออกเขียว / มีสีเขียว → `Make the turquoise sky-blue (more blue than green), and remove every green.`
- หางหายในบางมุม → `Give him his long heavy crocodile tail in every view.`
- ดุจนน่ากลัว / สมจริงไป → `Keep him cool, but in the friendly chibi cartoon style of the attached images: a bigger head, bigger eyes and simpler shapes.`
- อยากได้แบบไหนเป็นผู้หญิง → `Make the hero a girl, with the same outfit idea and colours.`
- แก้แค่บางส่วน → ใช้แปรงเลือกเฉพาะจุดใน ChatGPT (สั่งแก้ทั้งภาพ มันจะวาดใหม่หมด)

## 5 แบบ

| แบบ | ลุค | สีตัด | ท่าภาพใหญ่ | ผูกกับ |
|---|---|---|---|---|
| 1 ทายาทซิปัคตลี | ผิวบรอนซ์น้ำตาลลายแถบเข้ม ท้องครีม เกล็ดหางปลายทอง · ห่วงทองที่มุมปาก · **แผ่นอกโมเสกเทอร์ควอยซ์รูปหัวจระเข้ (สัญลักษณ์ Cipactli)** · เสื้อเกราะผ้าฝ้ายบุนวมสีครีมขอบแดง · ผ้าคาดแดง ผ้าเตี่ยวครีมลายขั้นบันได · สนับแขนหนังหมุดออบซิเดียน · **หอกแอซเท็กใบกว้าง ขอบเรียงใบมีดออบซิเดียน ปลอกทองรูปพระอาทิตย์** พู่ขนนกแดงครีม | บรอนซ์น้ำตาล + แดงโคชินีล + ทอง + เทอร์ควอยซ์ฟ้า + ดำออบซิเดียน | ย่อตัวพุ่งแทงหอกออกมาหาคนดู หางเหวี่ยงหลัง ยิ้มเห็นฟัน | ครบสองสาย + สาย C (Ancient Maw = Cipactli) · หอกตรงกับเอฟเฟกต์ออบซิเดียน + Sunpiercer |
| 2 ทหารหอกวิหารสุริยะ | ผิวเทาหินบะซอลต์เหลือบบรอนซ์ ท้องครีม · ขีดสีขาวข้างกราม · แถบทองบนจมูกมีจานพระอาทิตย์เล็กระหว่างตา · เสื้อเกราะผ้าฝ้ายขาวยาวกลางต้นขา ขอบทอง · **บ่าซ้ายเป็นศิลาสุริยะทองกลม** หมุดเทอร์ควอยซ์ · ผ้าคลุมครึ่งตัวแดงจากบ่าขวา · **หอกยาวเรียว ใบออบซิเดียนขอบทอง การ์ดรังสีพระอาทิตย์** ด้ามขาวพันเชือกแดง | เทาหิน + ขาว + ทอง + แดง | ท่าชาร์จ Sunpiercer: ถอยเท้า ดึงหอกระนาบข้างตัว ปลายหอกเรืองทองเหมือนดวงอาทิตย์เล็ก | สาย A (Armor Break, Temple Execution, Sunpiercer) |
| 3 นักล่าแห่งทะเลสาบ ✓ เลือกแล้ว | ตัวใหญ่หนักสุด ผิวน้ำตาลโคลนเหลือบบรอนซ์ · แผลเป็นบนจมูก · **เขี้ยวหน้าครอบบรอนซ์** (Iron Jaws) · สร้อยเขี้ยวใหญ่ · ผ้าแดงขาดพันบ่ากับเอว · เข็มขัดเชือกมีน้ำเต้า · ผ้าพันแขนขาสีน้ำเงินแม่น้ำ · **ฉมวกหนาใบออบซิเดียนมีเงี่ยง มัดเชือกขดไว้ลากเหยื่อ** | น้ำตาลโคลน + บรอนซ์ + แดง + น้ำเงินแม่น้ำ + ขาวกระดูก | หมอบต่ำเหมือนโผล่จากน้ำ มือเท้าพื้น อ้าปากคำราม ง้างฉมวก | สาย B (Jaw Lock, Death Roll, Drag, Blood Frenzy) |
| 4 สาวนักรบหอกบัวน้ำ | ผู้หญิง หน้าจระเข้น่ารัก ปากสั้นมน ตาอำพันโต ขนตายาว แก้มแดง เขี้ยวเล็กสองซี่ · ผิวทรายแทนลายบรอนซ์ · พวงดอกบัวขาวชมพูท้ายหัว (ไม่มีใบ) · ชุดเทอร์ควอยซ์ปักลายขั้นบันไดขาวแดงปะการัง · **หอกด้ามขาวเรียว ใบออบซิเดียนผูกทอง ตะขอเสี้ยวทอง** พู่ขนนกขาว | เทอร์ควอยซ์ฟ้า + ขาว + แดงปะการัง + ทอง | ควงหอกหลังตัว ยกเท้าข้างหนึ่ง ขยิบตา หางม้วน | ถ้าอยากได้จระเข้เป็นผู้หญิง (ตัวเบาลง) |
| 5 จระเข้โฉมใหม่ | ลุคเดิมแต่งให้เท่: หงอนขนนกแดงขาว **สั้นลง** ปัดไปหลังหัว เห็นจมูก สันคิ้ว ตา · ที่คาดหัวทองเพชรเทอร์ควอยซ์ จานเทอร์ควอยซ์ข้างหัว ขีดแดงที่แก้ม ลายก้นหอยที่บ่า สายหนังคาดอก หัวเข็มขัดทองกลม ผ้าเตี่ยวลายขั้นบันได หอกปลอกทองพู่ขนนก (เหมือนเดิม) · ผิว **บรอนซ์อมมะกอก** (ไม่เขียวสด) · ตัวหนาเกราะเกล็ด ไม่ใช่อกซิกแพ็ก · ยิ้มเห็นฟัน · ไม่มีกางเกงหลวม ผ้าพันแข้ง · ใบหอกเป็นออบซิเดียน | บรอนซ์มะกอก + แดง + ครีม + ทอง + เทอร์ควอยซ์ | ยืนตรง ปักหอกข้างตัว อีกมือเท้าเอว หงอนกับพู่ปลิวลม | ไอคอน ผังสกิล และภาพหน้าโหลดเดิมยังพอเข้ากันได้ |

แนะนำ:
- **แบบ 1** ครบสองสาย (หอกออบซิเดียน + พระอาทิตย์ = สาย A · ปาก หาง น้ำ = สาย B · แผ่นอก Cipactli = สาย C ร่างจระเข้โบราณ) และตรงกับเอฟเฟกต์ที่มีอยู่แล้ว (ใบออบซิเดียน ทอง ศิลาสุริยะ วิญญาณ Cipactli) · สีอุ่นเด่นบนป่า
- **แบบ 5** ประหยัดสุด (ไอคอน ผังสกิล ภาพหน้าโหลดเดิมใช้ต่อได้นานสุด)
- ทุกแบบ **ใบหอกออบซิเดียนดำ** → เอฟเฟกต์หอกในเกมใช้ต่อได้หมด · ชื่อในหน้าเลือกตัว "Crocodile · Lancer" ใช้ได้ทุกแบบ

### แบบ 1 — ทายาทซิปัคตลี
```
Character design sheet for ONE hero of my cute cartoon fantasy MMORPG (animal heroes from Norse, Greek, Egyptian, Japanese and Aztec myths).

STYLE: copy the first attached image (the game's key art): friendly hand-painted chibi cartoon, thick clean dark-brown outlines (not black), cel shading with 2-3 flat tones, soft cartoon glow, bright and warm. Not realistic, not painterly, not 3D. The wolf and the cat in the first image and the woolly rhino in the second image are other heroes of my game: match their proportions, outline weight, colouring and finish (the rhino shows how big and heavy this hero is), but do NOT copy their designs.

THE HERO: the Crocodile, the spear warrior of the Aztec temple lands - a big, powerful crocodile who fights with a long spear and with his own jaws. One path makes him a temple lancer: precise spear thrusts from reach that crack enemy armour piece by piece, then a finishing pierce and a golden sun-piercing charge. The other path makes him a river predator: crushing bites, a death roll that spins his prey, a tail sweep that knocks enemies off balance, dragging them into the water. His strongest form wakes the spirit of Cipactli, the ancient earth crocodile of Aztec myth. He must look COOL and STRONG - the big armoured warrior players pick for the front line - while staying in the game's cartoon style:
- a real CROCODILE head: a long, flat, powerful snout with nostril bumps at the tip, a toothy crocodile grin with the interlocking teeth showing along the closed jaw, heavy bony brow ridges, small sharp amber-gold eyes with slit pupils, no outer ears. His head, snout, eyes and brow ridges are always fully visible: no big feather headdress, no helmet, no hood, no mask (only small ornaments, unless the design below says otherwise)
- a crocodile body: rough bony scutes down his back, a scaly chest and a pale belly of square scales, clawed hands and feet, and a long heavy tail with a double row of tall scutes along the top, as long as his body
- big and heavy, as big as the rhino: broad shoulders, thick arms and legs, a heavy armoured back - never a slim human torso with abs
- his scales are the colour the design gives - never bright leaf green, emerald, lime or jade (the game's animation clips are cut on a green screen, and a green crocodile disappears with it). No green anywhere on him: turquoise is sky-blue turquoise (more blue than green), and water is clear sky blue and white
- his weapon is ONE long spear with a black OBSIDIAN blade (volcanic glass with a violet sheen), held in his hands in every view and never on his back, longer than he is tall; the whole spear always fits inside the picture
- an Aztec warrior: quilted cotton armour, a loincloth flap, sashes, gold and sky-turquoise mosaic, stepped-fret and sun patterns; the outfit ends above the knee so his scaly legs read when he walks; only a few dangling items
- he must stand out on green jungle maps: warm, saturated colours (the design gives them)
- he must look clearly different from my other heroes: a golden jaguar dancer girl with a black crop top, crimson and a scarlet-and-turquoise feather fan; a red dragon knight in white plate armour with a crimson cape and a greatsword (keep him a crocodile: no horns, no wings, no plate armour); a cobalt-blue dragon martial artist; a blue-grey hippo guardian with a teal crocodile-scale cape, a mace and a round shield; a pink axolotl water mage; the Egyptian heroes (no pharaoh headcloth: he is Aztec, not Egyptian)
- an original design, not based on any crocodile character from a game, film or book
- no letters, glyphs or words anywhere: patterns are only stepped frets, sun rays and zigzags

SHEET: ONE wide image 1536x1024 on a plain soft cream background. No text, no labels, no names, no logo, no watermark.
LEFT HALF - the hero large, full body, three-quarter front view, in the pose given below. TOP RIGHT - a small turnaround of the same hero standing neutral with the spear upright in one hand beside him: front, side facing right, back, all the same height. BOTTOM RIGHT - two small action poses of the same hero side by side: a temple-lancer thrust (the spear driven forward through a cracking stone armour plate, black obsidian chips flying, a small golden sun-glare at the spear tip) and a river-predator bite (lunging low out of a splash of clear blue river water, jaws wide open, tail whipping behind him).
Keep the hero identical in every view. This is a new, separate design: reuse nothing from earlier pictures in this chat.

THE DESIGN - "Heir of Cipactli": a young warrior who carries the blood of Cipactli, the great earth crocodile whose body became the world. Warm bronze-brown scales with darker brown bands across his back and tail, a pale sand-cream throat and belly, the tall scutes of his tail tipped with gold; sharp amber-gold eyes, a confident toothy grin, two small gold rings through the back corner of his jaw. On his chest a sky-turquoise mosaic pectoral shaped like a crocodile head with open jaws (the Cipactli sign), with a gold rim and two small black obsidian eyes, on a gold cord. A sleeveless padded vest of quilted cream cotton armour with a cochineal-red border and a gold stepped-fret band; a wide cochineal-red sash with fringed ends; a cream loincloth flap with a red stepped-fret border, ending above the knee. Gold armbands set with sky-turquoise, dark leather wrist guards with small obsidian studs, gold ankle cuffs, Aztec sandals with tall dark-leather heel guards, bare scaly legs. The spear: a long Aztec thrusting spear taller than he is - a dark polished wood shaft wrapped with red cord at the grip, a broad leaf-shaped spearhead edged on both sides with a row of black obsidian blades with a violet sheen, a gold sun-disc collar where the head meets the shaft, and a short tassel of red and cream feathers under the collar. Accent colours: bronze-brown and sand-cream with cochineal red, gold, sky-blue turquoise and obsidian black. Pose: a low lunging stance, thrusting the spear forward past the viewer with both hands, his tail swept out behind for balance, grinning with his teeth showing.
```

### แบบ 2 — ทหารหอกวิหารสุริยะ
```
Character design sheet for ONE hero of my cute cartoon fantasy MMORPG (animal heroes from Norse, Greek, Egyptian, Japanese and Aztec myths).

STYLE: copy the first attached image (the game's key art): friendly hand-painted chibi cartoon, thick clean dark-brown outlines (not black), cel shading with 2-3 flat tones, soft cartoon glow, bright and warm. Not realistic, not painterly, not 3D. The wolf and the cat in the first image and the woolly rhino in the second image are other heroes of my game: match their proportions, outline weight, colouring and finish (the rhino shows how big and heavy this hero is), but do NOT copy their designs.

THE HERO: the Crocodile, the spear warrior of the Aztec temple lands - a big, powerful crocodile who fights with a long spear and with his own jaws. One path makes him a temple lancer: precise spear thrusts from reach that crack enemy armour piece by piece, then a finishing pierce and a golden sun-piercing charge. The other path makes him a river predator: crushing bites, a death roll that spins his prey, a tail sweep that knocks enemies off balance, dragging them into the water. His strongest form wakes the spirit of Cipactli, the ancient earth crocodile of Aztec myth. He must look COOL and STRONG - the big armoured warrior players pick for the front line - while staying in the game's cartoon style:
- a real CROCODILE head: a long, flat, powerful snout with nostril bumps at the tip, a toothy crocodile grin with the interlocking teeth showing along the closed jaw, heavy bony brow ridges, small sharp amber-gold eyes with slit pupils, no outer ears. His head, snout, eyes and brow ridges are always fully visible: no big feather headdress, no helmet, no hood, no mask (only small ornaments, unless the design below says otherwise)
- a crocodile body: rough bony scutes down his back, a scaly chest and a pale belly of square scales, clawed hands and feet, and a long heavy tail with a double row of tall scutes along the top, as long as his body
- big and heavy, as big as the rhino: broad shoulders, thick arms and legs, a heavy armoured back - never a slim human torso with abs
- his scales are the colour the design gives - never bright leaf green, emerald, lime or jade (the game's animation clips are cut on a green screen, and a green crocodile disappears with it). No green anywhere on him: turquoise is sky-blue turquoise (more blue than green), and water is clear sky blue and white
- his weapon is ONE long spear with a black OBSIDIAN blade (volcanic glass with a violet sheen), held in his hands in every view and never on his back, longer than he is tall; the whole spear always fits inside the picture
- an Aztec warrior: quilted cotton armour, a loincloth flap, sashes, gold and sky-turquoise mosaic, stepped-fret and sun patterns; the outfit ends above the knee so his scaly legs read when he walks; only a few dangling items
- he must stand out on green jungle maps: warm, saturated colours (the design gives them)
- he must look clearly different from my other heroes: a golden jaguar dancer girl with a black crop top, crimson and a scarlet-and-turquoise feather fan; a red dragon knight in white plate armour with a crimson cape and a greatsword (keep him a crocodile: no horns, no wings, no plate armour); a cobalt-blue dragon martial artist; a blue-grey hippo guardian with a teal crocodile-scale cape, a mace and a round shield; a pink axolotl water mage; the Egyptian heroes (no pharaoh headcloth: he is Aztec, not Egyptian)
- an original design, not based on any crocodile character from a game, film or book
- no letters, glyphs or words anywhere: patterns are only stepped frets, sun rays and zigzags

SHEET: ONE wide image 1536x1024 on a plain soft cream background. No text, no labels, no names, no logo, no watermark.
LEFT HALF - the hero large, full body, three-quarter front view, in the pose given below. TOP RIGHT - a small turnaround of the same hero standing neutral with the spear upright in one hand beside him: front, side facing right, back, all the same height. BOTTOM RIGHT - two small action poses of the same hero side by side: a temple-lancer thrust (the spear driven forward through a cracking stone armour plate, black obsidian chips flying, a small golden sun-glare at the spear tip) and a river-predator bite (lunging low out of a splash of clear blue river water, jaws wide open, tail whipping behind him).
Keep the hero identical in every view. This is a new, separate design: reuse nothing from earlier pictures in this chat.

THE DESIGN - "Sun Temple Lancer": the disciplined guard of the Sun Temple's steps, who breaks armour piece by piece and then pierces with a spear of sunlight. Dark slate-grey scales like wet basalt with a faint bronze sheen, a pale bone-cream throat and belly; calm, sharp amber eyes; two short white paint stripes on each side of his jaw; a thin gold band across the top of his snout with a small gold sun disc between his eyes (his head stays uncovered). A white quilted cotton armour tunic to mid-thigh with gold stepped-fret borders; a round gold sun-stone shoulder plate on his left shoulder, carved with sun rays and ringed with small sky-turquoise studs; a short cochineal-red half-cape from his right shoulder to his waist (the scutes of his back still show); a gold belt with a sun-shaped buckle; gold vambraces with black obsidian inlays; bare scaly legs with gold knee rings and Aztec sandals with gold heel guards. The spear: a long slender lance taller than he is - a long blade of black obsidian with a gold edge-binding, a gold sun-ray guard at the base of the blade, a white shaft wrapped in red cord, a gold butt spike. Accent colours: slate grey and white with gold, cochineal red and a touch of sky-blue turquoise. Pose: the sun-piercing charge - one foot stepped back, the lance drawn back level at his side, its obsidian tip glowing gold like a small sun, his eyes locked forward.
```

### แบบ 3 — นักล่าแห่งทะเลสาบ
```
Character design sheet for ONE hero of my cute cartoon fantasy MMORPG (animal heroes from Norse, Greek, Egyptian, Japanese and Aztec myths).

STYLE: copy the first attached image (the game's key art): friendly hand-painted chibi cartoon, thick clean dark-brown outlines (not black), cel shading with 2-3 flat tones, soft cartoon glow, bright and warm. Not realistic, not painterly, not 3D. The wolf and the cat in the first image and the woolly rhino in the second image are other heroes of my game: match their proportions, outline weight, colouring and finish (the rhino shows how big and heavy this hero is), but do NOT copy their designs.

THE HERO: the Crocodile, the spear warrior of the Aztec temple lands - a big, powerful crocodile who fights with a long spear and with his own jaws. One path makes him a temple lancer: precise spear thrusts from reach that crack enemy armour piece by piece, then a finishing pierce and a golden sun-piercing charge. The other path makes him a river predator: crushing bites, a death roll that spins his prey, a tail sweep that knocks enemies off balance, dragging them into the water. His strongest form wakes the spirit of Cipactli, the ancient earth crocodile of Aztec myth. He must look COOL and STRONG - the big armoured warrior players pick for the front line - while staying in the game's cartoon style:
- a real CROCODILE head: a long, flat, powerful snout with nostril bumps at the tip, a toothy crocodile grin with the interlocking teeth showing along the closed jaw, heavy bony brow ridges, small sharp amber-gold eyes with slit pupils, no outer ears. His head, snout, eyes and brow ridges are always fully visible: no big feather headdress, no helmet, no hood, no mask (only small ornaments, unless the design below says otherwise)
- a crocodile body: rough bony scutes down his back, a scaly chest and a pale belly of square scales, clawed hands and feet, and a long heavy tail with a double row of tall scutes along the top, as long as his body
- big and heavy, as big as the rhino: broad shoulders, thick arms and legs, a heavy armoured back - never a slim human torso with abs
- his scales are the colour the design gives - never bright leaf green, emerald, lime or jade (the game's animation clips are cut on a green screen, and a green crocodile disappears with it). No green anywhere on him: turquoise is sky-blue turquoise (more blue than green), and water is clear sky blue and white
- his weapon is ONE long spear with a black OBSIDIAN blade (volcanic glass with a violet sheen), held in his hands in every view and never on his back, longer than he is tall; the whole spear always fits inside the picture
- an Aztec warrior: quilted cotton armour, a loincloth flap, sashes, gold and sky-turquoise mosaic, stepped-fret and sun patterns; the outfit ends above the knee so his scaly legs read when he walks; only a few dangling items
- he must stand out on green jungle maps: warm, saturated colours (the design gives them)
- he must look clearly different from my other heroes: a golden jaguar dancer girl with a black crop top, crimson and a scarlet-and-turquoise feather fan; a red dragon knight in white plate armour with a crimson cape and a greatsword (keep him a crocodile: no horns, no wings, no plate armour); a cobalt-blue dragon martial artist; a blue-grey hippo guardian with a teal crocodile-scale cape, a mace and a round shield; a pink axolotl water mage; the Egyptian heroes (no pharaoh headcloth: he is Aztec, not Egyptian)
- an original design, not based on any crocodile character from a game, film or book
- no letters, glyphs or words anywhere: patterns are only stepped frets, sun rays and zigzags

SHEET: ONE wide image 1536x1024 on a plain soft cream background. No text, no labels, no names, no logo, no watermark.
LEFT HALF - the hero large, full body, three-quarter front view, in the pose given below. TOP RIGHT - a small turnaround of the same hero standing neutral with the spear upright in one hand beside him: front, side facing right, back, all the same height. BOTTOM RIGHT - two small action poses of the same hero side by side: a temple-lancer thrust (the spear driven forward through a cracking stone armour plate, black obsidian chips flying, a small golden sun-glare at the spear tip) and a river-predator bite (lunging low out of a splash of clear blue river water, jaws wide open, tail whipping behind him).
Keep the hero identical in every view. This is a new, separate design: reuse nothing from earlier pictures in this chat.

THE DESIGN - "Lake Predator": the terror of the canals around the floating city on the lake - he waits in the water, the jaws close, and he never lets go. Bigger and bulkier than any other design: dark mud-brown scales with a bronze sheen on the scutes, a pale sand belly, an old scar across his snout, small fierce amber eyes, a wide toothy grin with bronze caps on his front fangs. A necklace of big curved fangs on a thick cord; a torn cochineal-red sash wrapped across one shoulder and around his waist; a thick rope belt with a small gourd flask; a short loincloth flap of dark brown leather with a red zigzag border; deep river-blue cloth wraps on his forearms and shins; a bare, heavily armoured scaly chest and back. The spear: a heavy barbed fishing spear taller than he is - a thick dark wood shaft, a long head of black obsidian with backward-hooked barbs bound in bronze, and a coil of thick rope tied below the head for dragging prey. Accent colours: mud brown and bronze with cochineal red, deep river blue and bone white. Pose: crouched low as if rising out of the water, one clawed hand on the ground, jaws wide open in a fierce snarl, the barbed spear held back ready, water drops sliding off his scales (water drawn clear blue).
```

### แบบ 4 — สาวนักรบหอกบัวน้ำ
```
Character design sheet for ONE hero of my cute cartoon fantasy MMORPG (animal heroes from Norse, Greek, Egyptian, Japanese and Aztec myths).

STYLE: copy the first attached image (the game's key art): friendly hand-painted chibi cartoon, thick clean dark-brown outlines (not black), cel shading with 2-3 flat tones, soft cartoon glow, bright and warm. Not realistic, not painterly, not 3D. The wolf and the cat in the first image and the woolly rhino in the second image are other heroes of my game: match their proportions, outline weight, colouring and finish (the rhino shows how big and heavy this hero is), but do NOT copy their designs.

THE HERO: the Crocodile, the spear warrior of the Aztec temple lands - a big, powerful crocodile who fights with a long spear and with his own jaws. One path makes him a temple lancer: precise spear thrusts from reach that crack enemy armour piece by piece, then a finishing pierce and a golden sun-piercing charge. The other path makes him a river predator: crushing bites, a death roll that spins his prey, a tail sweep that knocks enemies off balance, dragging them into the water. His strongest form wakes the spirit of Cipactli, the ancient earth crocodile of Aztec myth. He must look COOL and STRONG - the big armoured warrior players pick for the front line - while staying in the game's cartoon style:
- a real CROCODILE head: a long, flat, powerful snout with nostril bumps at the tip, a toothy crocodile grin with the interlocking teeth showing along the closed jaw, heavy bony brow ridges, small sharp amber-gold eyes with slit pupils, no outer ears. His head, snout, eyes and brow ridges are always fully visible: no big feather headdress, no helmet, no hood, no mask (only small ornaments, unless the design below says otherwise)
- a crocodile body: rough bony scutes down his back, a scaly chest and a pale belly of square scales, clawed hands and feet, and a long heavy tail with a double row of tall scutes along the top, as long as his body
- big and heavy, as big as the rhino: broad shoulders, thick arms and legs, a heavy armoured back - never a slim human torso with abs
- his scales are the colour the design gives - never bright leaf green, emerald, lime or jade (the game's animation clips are cut on a green screen, and a green crocodile disappears with it). No green anywhere on him: turquoise is sky-blue turquoise (more blue than green), and water is clear sky blue and white
- his weapon is ONE long spear with a black OBSIDIAN blade (volcanic glass with a violet sheen), held in his hands in every view and never on his back, longer than he is tall; the whole spear always fits inside the picture
- an Aztec warrior: quilted cotton armour, a loincloth flap, sashes, gold and sky-turquoise mosaic, stepped-fret and sun patterns; the outfit ends above the knee so his scaly legs read when he walks; only a few dangling items
- he must stand out on green jungle maps: warm, saturated colours (the design gives them)
- he must look clearly different from my other heroes: a golden jaguar dancer girl with a black crop top, crimson and a scarlet-and-turquoise feather fan; a red dragon knight in white plate armour with a crimson cape and a greatsword (keep him a crocodile: no horns, no wings, no plate armour); a cobalt-blue dragon martial artist; a blue-grey hippo guardian with a teal crocodile-scale cape, a mace and a round shield; a pink axolotl water mage; the Egyptian heroes (no pharaoh headcloth: he is Aztec, not Egyptian)
- an original design, not based on any crocodile character from a game, film or book
- no letters, glyphs or words anywhere: patterns are only stepped frets, sun rays and zigzags

SHEET: ONE wide image 1536x1024 on a plain soft cream background. No text, no labels, no names, no logo, no watermark.
LEFT HALF - the hero large, full body, three-quarter front view, in the pose given below. TOP RIGHT - a small turnaround of the same hero standing neutral with the spear upright in one hand beside him: front, side facing right, back, all the same height. BOTTOM RIGHT - two small action poses of the same hero side by side: a temple-lancer thrust (the spear driven forward through a cracking stone armour plate, black obsidian chips flying, a small golden sun-glare at the spear tip) and a river-predator bite (lunging low out of a splash of clear blue river water, jaws wide open, tail whipping behind him).
Keep the hero identical in every view. This is a new, separate design: reuse nothing from earlier pictures in this chat.

THE DESIGN - "Lake Lily Lancer": this time the hero is a girl - a young crocodile warrior girl of the lake, quick and bright. The rules above apply to her, but with a lighter, graceful build. A cute crocodile face with a shorter, rounded snout, big bright amber eyes with long lashes, rosy cheeks, a confident smile with two small fang tips showing; smooth sandy-tan scales with soft bronze bands and a cream belly; a long tail with small rounded scutes. A ring of white and pink water-lily flowers on the back of her head (flowers only, no leaves), small gold hoops at the corner of her jaw. A sky-turquoise sleeveless Aztec tunic dress above the knee with white and coral-red stepped-fret embroidery, a wide gold belt with a round sky-turquoise disc, gold armlets, coral-red cords at her wrists, gold anklets and light sandals. The spear: a slender white-wood spear taller than she is, with a leaf-shaped black obsidian blade bound in gold, a small gold crescent hook under the blade and a tassel of white feathers. Accent colours: sky turquoise and white with coral red, gold and sandy tan. Pose: twirling the spear behind her back, one foot lifted, winking, her tail curling playfully.
```

### แบบ 5 — จระเข้โฉมใหม่ (แนบ `croc_old_ref.jpg` เป็นภาพที่ 3 ด้วย)
```
Character design sheet for ONE hero of my cute cartoon fantasy MMORPG (animal heroes from Norse, Greek, Egyptian, Japanese and Aztec myths).

STYLE: copy the first attached image (the game's key art): friendly hand-painted chibi cartoon, thick clean dark-brown outlines (not black), cel shading with 2-3 flat tones, soft cartoon glow, bright and warm. Not realistic, not painterly, not 3D. The wolf and the cat in the first image and the woolly rhino in the second image are other heroes of my game: match their proportions, outline weight, colouring and finish (the rhino shows how big and heavy this hero is), but do NOT copy their designs.

THE HERO: the Crocodile, the spear warrior of the Aztec temple lands - a big, powerful crocodile who fights with a long spear and with his own jaws. One path makes him a temple lancer: precise spear thrusts from reach that crack enemy armour piece by piece, then a finishing pierce and a golden sun-piercing charge. The other path makes him a river predator: crushing bites, a death roll that spins his prey, a tail sweep that knocks enemies off balance, dragging them into the water. His strongest form wakes the spirit of Cipactli, the ancient earth crocodile of Aztec myth. He must look COOL and STRONG - the big armoured warrior players pick for the front line - while staying in the game's cartoon style:
- a real CROCODILE head: a long, flat, powerful snout with nostril bumps at the tip, a toothy crocodile grin with the interlocking teeth showing along the closed jaw, heavy bony brow ridges, small sharp amber-gold eyes with slit pupils, no outer ears. His head, snout, eyes and brow ridges are always fully visible: no big feather headdress, no helmet, no hood, no mask (only small ornaments, unless the design below says otherwise)
- a crocodile body: rough bony scutes down his back, a scaly chest and a pale belly of square scales, clawed hands and feet, and a long heavy tail with a double row of tall scutes along the top, as long as his body
- big and heavy, as big as the rhino: broad shoulders, thick arms and legs, a heavy armoured back - never a slim human torso with abs
- his scales are the colour the design gives - never bright leaf green, emerald, lime or jade (the game's animation clips are cut on a green screen, and a green crocodile disappears with it). No green anywhere on him: turquoise is sky-blue turquoise (more blue than green), and water is clear sky blue and white
- his weapon is ONE long spear with a black OBSIDIAN blade (volcanic glass with a violet sheen), held in his hands in every view and never on his back, longer than he is tall; the whole spear always fits inside the picture
- an Aztec warrior: quilted cotton armour, a loincloth flap, sashes, gold and sky-turquoise mosaic, stepped-fret and sun patterns; the outfit ends above the knee so his scaly legs read when he walks; only a few dangling items
- he must stand out on green jungle maps: warm, saturated colours (the design gives them)
- he must look clearly different from my other heroes: a golden jaguar dancer girl with a black crop top, crimson and a scarlet-and-turquoise feather fan; a red dragon knight in white plate armour with a crimson cape and a greatsword (keep him a crocodile: no horns, no wings, no plate armour); a cobalt-blue dragon martial artist; a blue-grey hippo guardian with a teal crocodile-scale cape, a mace and a round shield; a pink axolotl water mage; the Egyptian heroes (no pharaoh headcloth: he is Aztec, not Egyptian)
- an original design, not based on any crocodile character from a game, film or book
- no letters, glyphs or words anywhere: patterns are only stepped frets, sun rays and zigzags

SHEET: ONE wide image 1536x1024 on a plain soft cream background. No text, no labels, no names, no logo, no watermark.
LEFT HALF - the hero large, full body, three-quarter front view, in the pose given below. TOP RIGHT - a small turnaround of the same hero standing neutral with the spear upright in one hand beside him: front, side facing right, back, all the same height. BOTTOM RIGHT - two small action poses of the same hero side by side: a temple-lancer thrust (the spear driven forward through a cracking stone armour plate, black obsidian chips flying, a small golden sun-glare at the spear tip) and a river-predator bite (lunging low out of a splash of clear blue river water, jaws wide open, tail whipping behind him).
Keep the hero identical in every view. This is a new, separate design: reuse nothing from earlier pictures in this chat.

THE DESIGN - "Crocodile Reborn": the hero my game already has is the third attached image. Keep his idea - the red-and-white feather crest, the gold headband with a turquoise diamond on his brow, the round turquoise discs at the sides of his head, the two red cheek marks, the red spiral tattoo on his shoulder, the brown leather strap across his chest, the gold belt with the big round gold buckle and its turquoise gem, the cream loincloth flap with the red stepped-fret pattern, and the spear with its gold socket, turquoise diamond and red-and-white feather tassels - but make him cool and strong. The feather crest becomes SHORT and swept back, set behind his eyes along the back of his head and neck, so the top of his snout, his brow ridges and both eyes are fully visible. His scales become warm olive-bronze (more bronze than olive, never leaf green) with darker bands and a pale cream belly. A heavier, broader, armoured crocodile body: a scaly chest with square belly scales instead of a smooth human torso with abs, rough scutes down his back and a double row of tall gold-tipped scutes along his tail. A confident toothy crocodile grin instead of a frown. The feather skirt becomes a short fringe on the belt, and the baggy trousers and the bandages are gone: bare scaly legs with gold anklets and Aztec sandals. The spear blade becomes black obsidian with the same gold socket. Accent colours: olive-bronze and cream with red, gold and sky-blue turquoise. Pose: standing tall with the spear planted beside him in one hand, the other fist on his hip, a confident grin, the feather crest and the tassels blown by the wind.
```

### พรอมต์ผสม (ส่งในแชตเดียวกับแบบที่วาดไปแล้ว · เปลี่ยนชื่อแบบกับส่วนได้)
```
A mix of the sheets you drew in this chat: the head and scales of "Heir of Cipactli", the outfit and colours of "Lake Predator", holding the spear of "Sun Temple Lancer", in the pose of "Heir of Cipactli". Same style, rules and layout as before.
```

## เลือกแล้วทำอะไรต่อ
1. ส่งชีตที่เลือกมา → เขียนหัวข้อ "เลือกแล้ว" ในไฟล์นี้ (หน้าตาตามที่วาด + พรอมต์ภาพยืน 5 มุมบนพื้นเขียว S SE E NE N ด้านข้างหันขวา ท่าเดียวกัน ขนาดเท่ากัน ถือหอกตั้งข้างตัวทุกมุม หางเห็นทุกมุม) · ภาพใหญ่ของชีต → หน้าเลือกตัว (`tools/bigpose_cut.py` แล้ว `tools/select_cut.py`, เลข `SELV.croc`)
2. ภาพตั้งต้น (`tools/dir8cut.py startv` size=900 feet .88 clean=0 · หอกยาว → ตัวเล็กลงหน่อยให้มีที่ด้านหน้าตอนแทงสุดแขน) + พรอมต์คลิป 20 อัน (`tools/clip_prompts.py` เพิ่มรายการ croc) — ท่าที่เกมใช้:
   - **ท่าตี** = ง้างหอกไปข้างหลัง แล้วพุ่งแทงตรงไปข้างหน้าสุดแขนด้วยสองมือ (= เฟรมโดน) ค้างนิด แล้วดึงกลับ · เกมใช้คลิปนี้ทั้งตอน **แทงหอก** และตอน **งับ** (ปากจระเข้ที่งับเป็นภาพโค้ดที่ตัวศัตรู) · สกิลแทงรัว (Serpent Strike ฯลฯ) เล่นเฟรม "โดน−2 … โดน+1" ซ้ำ → แทงต้องเป็นเส้นตรงชัดๆ · Obsidian Rain เล่นท่าบัฟถึงจุดสูงสุด (ลอย) แล้วต่อท่าตีจากเฟรมโดน (ปักหอกลงพื้น)
   - **ท่าบัฟ** = ท่าพลัง (ชูหอกเหนือหัว หรือปักหอกคำราม) ค้างจุดสูงสุดราว 1 วิ · Tail Sweep เล่นท่าบัฟเร็ว ×2.2 (หางเป็นภาพโค้ด) · Stride, Scales, Obsidian Edge, Iron Jaws, Feeding Frenzy ใช้จุดสูงสุด
   - **ท่าเดิน** ใช้ตอน Body Crush, Drag, Low Ambush (เล่นเร็ว) · Death Roll หมุนตัวด้วยเฟรมแรกของท่าเดินกับท่าโดนตีวน 8 ทิศ
3. คลิปมา → `tools/cliphero.py` → **ไฟล์ใหม่ `assets_croc.js`** โหลดเฉพาะ `?char=croc` (assets.js ไม่แตะ) คงเวลาเฟรมของ assets.js:
   - ท่าตี 12 เฟรม 900 ms
     - S = 80, 50, 90, 50, 50, 50, 70, 200, 50, 50, 50, 110 (โดนเฟรม 6 = 370 ms)
     - SE = 50, 50, 190, 70, 90, 50, 50, 50, 50, 50, 90, 110 (โดนเฟรม 4 = 360 ms)
     - E = 80, 50, 50, 100, 50, 120, 60, 120, 50, 50, 50, 120 (โดนเฟรม 6 = 450 ms)
     - N = 110, 120, 50, 50, 70, 50, 120, 70, 50, 50, 50, 110 (โดนเฟรม 6 = 450 ms)
     - NE เล่นแถวของ E (`atkRemap` NE→E แบบเดิม) — หรือใส่คลิป NE เองโดยใช้เวลาของ E แล้วตั้ง `atkRemap:{}`
   - ท่าบัฟ 12 เฟรม 1,400 ms จุดสูงสุดเฟรม 7
     - S = 170, 50, 50, 230, 50, 110, 390, 50, 50, 50, 50, 150 (ถึงจุดสูงสุด 1,050 ms)
     - E = 70, 50, 50, 50, 50, 70, 170, 580, 50, 50, 50, 160 (510 ms)
     - NE = 80, 60, 50, 50, 50, 50, 120, 160, 480, 60, 60, 180 (460 ms)
     - N = 130, 50, 50, 50, 50, 110, 260, 450, 60, 50, 50, 90 (700 ms)
     - SE = 6 เฟรม × 220 ms จุดสูงสุดเฟรม 3 (660 ms)
   - เดิน 8 × 100 ms · ยืน 12 เฟรม 2.4 วิ · โดนตี 7 เฟรม 550 ms
   - `CHAR_SCALE.croc` วัดใหม่ (ตัวยืน S สูงบนจอตาม `HERO_SIZE.croc` .882) · `CHAR_FILTER.croc` = "" ตอนมีร่างใหม่ · จุดปลายหอก (`sockets` attack + buff) ใส่ไว้ แต่เอฟเฟกต์หอก v3 คำนวณจากตัวฮีโร่ ไม่ได้อ่านจุดนี้
4. ตามมา: หน้า HUD (`window.HUD_FACE`) + ภาพหน้าเลือกตัว + จานสีปากจระเข้สกินธรรมดาใน `croc_art.js` ให้ตรงผิวใหม่ + ท่านั่ง (`hero_sit.js`, ถ้าเจ้าของอยากได้)
5. ทีหลัง: ไอคอน 49 + ex_ 18 + ผังสกิล 4 ภาพ + ภาพหน้าโหลด ld1 ld2 ld8 (เขียนพรอมต์ให้ตอนลุคนิ่งแล้ว)

## เลือกแล้ว: แบบ 3 นักล่าแห่งทะเลสาบ (2026-11-25 19:27)
- เจ้าของส่งภาพชีตแบบ 3 มา 1 ภาพ ไม่มีข้อความ → ถือว่าเลือกแบบนี้ (เหมือนครั้งก่อนๆ ที่ส่งชีตมาเฉยๆ) · ชีตเก็บที่ `assets/heroes/croc/sheet_lake_predator.webp` (1536×1024 พื้นครีม: ภาพใหญ่ซ้าย หมอบโผล่จากน้ำ อ้าปากคำราม ง้างฉมวกพาดไหล่ · ภาพหมุนรอบตัว หน้า / ข้างหันขวา / หลัง ถือฉมวกตั้งมือขวา · ท่าสู้ 2 ท่า: แทงฉมวกทะลุแผ่นหิน + โผล่จากน้ำงับ)
- ภาพใหญ่ → หน้าเลือกตัว: `tools/bigpose_cut.py` (รันกับไฟล์ PNG ที่เจ้าของอัปโหลด):
  ```
  python3 -I tools/bigpose_cut.py SHEET.png OUT.png xmax=720 pockets=0 drop=720,798 'pockbox=25,290,150,400;355,180,420,245;615,715,690,835;625,480,660,535;225,735,305,792;245,494,274,524;262,420,280,440;165,535,223,564;60,715,95,745;10,815,32,830;74,775,92,793;688,676,702,690' pockgrow=22 rimfix=1 wedge=24
  ```
  - `drop=720,798` (ตัวเลือกใหม่ของเครื่องมือ): น้ำกระเซ็นด้านขวาของภาพใหญ่แตะชายผ้าแดงกับปลายด้ามฉมวกของท่าแทง (ภาพท่าสู้ข้างล่าง) อยู่ไม่กี่จุด → สองภาพติดเป็นชิ้นเดียว · จุดนี้อยู่บนผ้าพันแขนของท่าแทง เครื่องมือไล่ทั้งตัวท่าแทงโดยไม่ข้ามละอองน้ำ แล้วทาเป็นพื้นครีมก่อนตัด
  - `pockets=0` + `pockbox` เฉพาะช่องโหว่จริง: รูห่วงเชือก 2 ขด (ที่ด้ามกับใต้หัวฉมวก) · ช่องระหว่างละอองน้ำ · ช่องปากด้านไกลหลังเขี้ยวทองล่าง · ช่องระหว่างผ้าแดงกับลำตัว / แขน · ห้ามเจาะแอ่งครีมทั้งหมดเพราะฟัน เขี้ยวในสร้อย เล็บ ไฮไลต์น้ำเต้า สีเกือบเท่าพื้นครีม
  - `pockgrow=22 rimfix=1 wedge=24` = เก็บขอบครีมเศษๆ รอบห่วงเชือกกับด้าม (ดูบนพื้นมืดแล้วสะอาด น้ำกระเซ็นยังอยู่ครบ)
  - ผล `assets/heroes/croc/bigpose_lake_predator.webp` (710×919 พื้นใส) → `tools/select_cut.py` → `assets/heroes/croc/select.webp` (ตัวกว้าง ชนกรอบด้านกว้าง 690 ของ 720 สูง 893) · `char_create.js` SELV croc 2 + `char_create.js?v=18` ใน index.html · ภาพเลือกตัวเดิม (ลุคเก่า) อยู่ในประวัติ git · ตรวจแล้ว PC 1280×720 + มือถือแนวนอน 844×390 (ปลายจมูกชิดขอบการ์ดข้อมูลพอดี)
- ในเกมตอนนี้: หน้าเลือกตัวเป็นลุคใหม่แล้ว · ตัวในเกม หน้า HUD ไอคอน ผังสกิล ยังเป็นลุคเดิมจนกว่าคลิป 20 ตัวจะมา
- ป้ายหน้าเลือกตัว "Crocodile · Lancer" + คำโปรย "นักรบหอกแห่งวิหาร แทงไกล ล็อกเหยื่อแล้วงับไม่ปล่อย" ยังใช้ได้ (ฉมวกเป็นหอกชนิดหนึ่ง) · ชื่อสกิล / ชื่ออาวุธในเกม (Spear …) ไม่ได้เปลี่ยน

**หน้าตาตามที่วาดออกมา** (ใช้ในพรอมต์ต่อๆ ไปทุกตัว):
- **หัว:** จระเข้เต็มตัว ปากยาวแบน · ยิ้มเห็นฟันเรียงตามแนวปากที่หุบ · **เขี้ยวหน้าใหญ่ครอบทอง** (พรอมต์สั่งบรอนซ์ วาดออกมาเป็นทอง → ใช้ทอง) · สันคิ้วหนาเข้ม ตาเล็กสีเหลืองอำพันดุ · แผลเป็นสีแดงพาดบนจมูก · หนามสีส้มทองเรียงจากกลางหัวลงคอ หลัง จนสุดหาง
- **ผิว:** เกล็ดน้ำตาลโคลน แผ่นเกล็ดน้ำตาลช็อกโกแลตเข้ม ไฮไลต์แทนอุ่นที่กล้ามเนื้อ · ขากรรไกรล่าง คอ อก ท้อง สีครีมแทน
- **สร้อย:** เขี้ยวสัตว์ใหญ่สีครีมโค้ง ครอบทอง สลับลูกปัดน้ำตาลเข้ม บนเชือกส้มทอง
- **ผ้าแดง:** ผ้าแดงเข้มลายขั้นบันไดสีครีม ขอบขาดรุ่ย · พาด **บ่าซ้าย** ของตัว (ภาพหน้า = ขวาภาพ) ไขว้อกลงสะโพกขวา มีชายผ้าแดงห้อยที่สะโพกขวา · กระโปรงผ้าแดงขาดสั้นๆ รอบสะโพก
- **เข็มขัด:** เชือกเส้นใหญ่สีแทนพันเอว 2 รอบ ผูกปมหน้า · **น้ำเต้ากลมในตาข่ายเชือก** ห้อยหน้าเข็มขัดค่อนไปทางซ้ายของตัว (ภาพหน้า = ขวาภาพ)
- **ผ้าเตี่ยว:** แผ่นผ้าน้ำตาลเข้มด้านหน้า ขอบซิกแซกขั้นบันไดสีส้มแดง
- **แขน:** แขนกล้ามใหญ่เกล็ดน้ำตาล · ปลอกแขนทองที่ต้นแขน · ผ้าพันแขนท่อนล่างสีน้ำเงินกรมเข้ม แถบทองส้มที่ข้อมือ · **มือเป็นกำปั้นสีเทาอมม่วง** (ภาพหมุนรอบตัว / ท่าแทง) — ภาพใหญ่เป็นอุ้งมือน้ำตาลเล็บครีมที่วางบนพื้น
- **ขา / หาง:** ขาเกล็ดหนา ผ้าพันแข้งน้ำเงินกรม แถบทองส้มที่ข้อเท้า · เท้าใหญ่สีน้ำตาล เล็บครีม 3 เล็บ · หางยาวหนัก ด้านบนน้ำตาลมีหนามส้มทอง ด้านล่างครีมแทน
- **ฉมวก (มือขวา):** ยาวกว่าตัว · ด้ามไม้น้ำตาลเข้ม แถบโลหะทองส้ม · หัวฉมวกออบซิเดียนดำอมม่วงมันวาว มีเงี่ยงโค้งย้อนกลับ · เชือกสีแทนขดเป็นห่วงมัดใต้หัวฉมวก · ปลายด้ามล่างครอบทองแหลม
- **สี:** น้ำตาลโคลน + ครีมแทน + แดงเข้ม + น้ำเงินกรม + ทองส้ม + ดำอมม่วง · **ไม่มีสีเขียวบนตัว** (นับในชีต: 0 จุดที่เขียวเกินแดง / น้ำเงิน 8 ขึ้นไป · ผ้าพันน้ำเงิน ≈ RGB 57, 63, 100 · ใบออบซิเดียน ≈ 75, 56, 73 · กำปั้นเทา ≈ 138, 123, 135) → ตัดพื้นเขียวได้ปลอดภัย

**บนชีตต้องระวัง** (ใส่ไว้ในพรอมต์ข้างล่างแล้ว):
- ผ้าแดง: ภาพหน้าพาดบ่าซ้ายของตัว แต่ภาพหลังวาดกลับข้าง (บ่าขวา) → พรอมต์ใช้ตามภาพหน้า บอกฝั่งของผ้าทุกมุม และมุมหลังสั่งให้ทำตามนี้แม้ชีตจะวาดกลับข้าง
- น้ำเต้า: ภาพหน้าอยู่ฝั่งซ้ายของตัว แต่ภาพใหญ่ห้อยฝั่งขวา → ใช้ตามภาพหน้า
- ภาพข้างถือฉมวกตั้งไว้หลังตัว (ไม่บังจมูกยาว) → ใช้แบบนั้นในภาพข้าง
- ภาพใหญ่อ้าปากคำราม น้ำกระเซ็น น้ำหยดจากปาก → ภาพยืนหุบปากยิ้มเห็นฟัน ไม่มีน้ำ
- ท่าสู้มีประกายทอง แผ่นหินแตก น้ำ → ภาพยืนห้ามเอฟเฟกต์ (ใส่ด้วยโค้ดในเกม)
- ฉมวกสูงกว่าตัว + หางยาว → สั่งขนาดราว 2/3 ของภาพ มีที่ว่างรอบตัวให้แทงไปข้างหน้า / ชูฉมวกได้

### ขั้น 1 — ภาพยืน 5 มุม ภาพละมุม พื้นเขียว (ส่งในแชตแล้ว 2026-11-25)
วิธีใช้:
1. ส่งต่อในแชต ChatGPT เดิมที่เจนชีตนี้ แนบชีต (ภาพที่เจ้าของส่งมา) ไปกับทุกข้อความ · ถ้าเปิดแชตใหม่ แนบชีต + `keyart_campfire_ld5.jpg`
2. ส่งทีละกล่อง (ข้อความละ 1 ภาพ) · ทุกกล่องจบในตัว ไม่ต้องส่งอะไรก่อน
3. ครบแล้วส่ง 5 ภาพมา → `assets/heroes/croc/view_S|SE|E|NE|N.webp`

ทำไมแยกภาพละมุม: ภาพใหญ่ = รายละเอียดชัดในคลิป · ทุกภาพท่ายืนเดียวกัน ขนาดเท่ากัน · บอกฝั่งของฉมวก ผ้าแดง น้ำเต้า หาง ทุกมุม · มุมไหนหันซ้ายมาไม่ต้องแก้ ผมกลับด้านให้

แก้ภาพ (ต่อท้ายแล้วส่ง):
- หันผิดทาง → `Redo picture 3: he must face the RIGHT side of the picture.`
- ตัวใหญ่เต็มภาพ ไม่มีที่ว่าง → `Redo picture 1: draw him smaller — from the tip of the harpoon to his feet only about two thirds of the picture's height, with empty green space all around.`
- ฉมวกผิดข้าง (มุมหน้า) → `Redo picture 1: the harpoon must stand on the LEFT side of the picture.`
- ผ้าแดงพาดผิดบ่า (มุมหน้า) → `Redo picture 1: the red sash goes over the shoulder on the RIGHT side of the picture and down to the hip on the left side.`
- ผ้าแดงพาดผิดบ่า (มุมหลัง) → `Redo picture 5: the red sash goes from the shoulder on the LEFT side of the picture down to the hip on the RIGHT side.`
- อ้าปาก / คำราม → `Redo picture 2: his jaws closed in a confident toothy grin, no roar.`
- มีน้ำ / เอฟเฟกต์ติดมา → `Redo picture 2: no water, no splashes, no drops, no glow — just the crocodile standing.`
- มุมหลังเห็นหน้า → `Redo picture 4: turn him further away, we must not see his eyes or his face.`
- หางหาย / ล้นกรอบ → `Redo picture 3: his whole long tail must show and stay inside the picture.`
- ฉมวกเปลี่ยนไป → `Redo picture 2: keep the harpoon exactly as on the sheet: taller than he is, with the black-violet barbed obsidian head, the rope coil below it, the gold bands and the gold end.`
- แก้แค่บางส่วน → ใช้แปรงเลือกเฉพาะจุดใน ChatGPT (สั่งแก้ทั้งภาพ มันจะวาดใหม่หมด)

#### ภาพ — หน้าตรง (S)
```
Picture 1 of 5 — FRONT view: he faces straight toward us, like the front view on the sheet. The harpoon stands on the LEFT side of the picture (his right hand); the red sash comes over the shoulder on the RIGHT side of the picture and crosses his chest down to the hip on the left side, where the torn red panel hangs; the netted gourd hangs at the front of the belt toward the right side of the picture. The end of his long tail curls out on the ground behind his feet.

Draw the crocodile warrior from the attached character sheet: the same character in the same drawing style — a friendly hand-painted chibi cartoon with thick clean dark-brown outlines and flat cel shading in 2–3 tones, bright and warm. Not realistic, not painterly, not 3D.

ONE square picture showing only this one crocodile, alone, on a plain flat pure green background (#00FF00): no gradient, no floor, no shadow under him, no water, no other views, no text, no logo, no frame.

His look, exactly as on the sheet: a big, heavy crocodile warrior with a long, flat crocodile snout, a confident toothy grin with the interlocking teeth showing along his closed jaw and gold caps on his big front fangs, heavy brow ridges, small fierce amber-gold eyes and a red scar across the top of his snout. Mud-brown scales with darker chocolate-brown scale plates and warm tan highlights; a tan-cream lower jaw, throat, chest and belly; a row of tall orange-gold spikes from the top of his head down his neck, his back and his whole tail. A necklace of big curved cream fangs with gold caps and dark brown beads on a gold-orange cord. A torn crimson-red sash with a cream stepped-fret pattern over his LEFT shoulder, crossing his chest down to his RIGHT hip, where a torn red cloth panel with the same pattern hangs, and a short torn red cloth skirt with the cream pattern around his hips. A thick tan rope belt wound twice round his waist and knotted, with a round tan gourd in a gold-brown cord net hanging at the front of the belt on his LEFT side. A short dark brown loincloth flap at the front with an orange-red stepped zigzag border. Bulky muscular arms with gold bands on the upper arms and deep navy-blue cloth wraps with gold-orange bands at the wrists; big dark slate-grey hands. Thick scaly legs with deep navy-blue cloth wraps on the shins and gold-orange bands at the ankles; big brown feet with three cream claws each. A long, heavy tail, brown on top with the orange-gold spikes and tan-cream underneath. His harpoon, taller than he is, in his RIGHT hand: a dark brown wooden shaft with gold-orange metal bands, a big glossy black-violet obsidian head with sharp backward-hooked barbs, a coil of tan rope tied in loops just below the head, and a pointed gold cap at the bottom end.

Pose, the same in all five pictures: standing still in a firm, heavy stance, feet apart; the harpoon held upright in his right hand beside him, its gold end resting on the ground and the obsidian head above his head, never covering his face or his snout; his left hand a loose fist at his side; his tail resting on the ground behind him; jaws closed in a confident toothy grin, calm and fierce.

Size and room, the same in all five pictures: from the tip of the harpoon to the soles of his feet he fills about two thirds of the picture's height. He stands in the middle with his feet about 12% above the bottom edge, with empty green space above the harpoon and wide empty green margins on both sides, so a later animation can thrust and raise the long harpoon. The whole harpoon, his whole tail and his feet stay inside the picture.

No green anywhere on him (his blues are deep navy). No water, no splashes, no drops, no glow, no light rays, no sparkles, no motion lines, no effects.
```

#### ภาพ — เฉียงหน้า (หันขวา) (SE)
```
Picture 2 of 5 — FRONT THREE-QUARTER view: he is turned toward the RIGHT side of the picture, facing down and to the right. We see his face with his long snout pointing to the right, and mostly his right side. His near hand holds the upright harpoon on the left side of the picture, in front of him; his far hand is a loose fist on the right side, partly behind his body. The red sash comes over his far shoulder on the right and crosses his chest down to his near hip on the left; the netted gourd hangs at the front of the belt toward the right. His long tail curves out behind him on the left side of the picture.

Draw the crocodile warrior from the attached character sheet: the same character in the same drawing style — a friendly hand-painted chibi cartoon with thick clean dark-brown outlines and flat cel shading in 2–3 tones, bright and warm. Not realistic, not painterly, not 3D.

ONE square picture showing only this one crocodile, alone, on a plain flat pure green background (#00FF00): no gradient, no floor, no shadow under him, no water, no other views, no text, no logo, no frame.

His look, exactly as on the sheet: a big, heavy crocodile warrior with a long, flat crocodile snout, a confident toothy grin with the interlocking teeth showing along his closed jaw and gold caps on his big front fangs, heavy brow ridges, small fierce amber-gold eyes and a red scar across the top of his snout. Mud-brown scales with darker chocolate-brown scale plates and warm tan highlights; a tan-cream lower jaw, throat, chest and belly; a row of tall orange-gold spikes from the top of his head down his neck, his back and his whole tail. A necklace of big curved cream fangs with gold caps and dark brown beads on a gold-orange cord. A torn crimson-red sash with a cream stepped-fret pattern over his LEFT shoulder, crossing his chest down to his RIGHT hip, where a torn red cloth panel with the same pattern hangs, and a short torn red cloth skirt with the cream pattern around his hips. A thick tan rope belt wound twice round his waist and knotted, with a round tan gourd in a gold-brown cord net hanging at the front of the belt on his LEFT side. A short dark brown loincloth flap at the front with an orange-red stepped zigzag border. Bulky muscular arms with gold bands on the upper arms and deep navy-blue cloth wraps with gold-orange bands at the wrists; big dark slate-grey hands. Thick scaly legs with deep navy-blue cloth wraps on the shins and gold-orange bands at the ankles; big brown feet with three cream claws each. A long, heavy tail, brown on top with the orange-gold spikes and tan-cream underneath. His harpoon, taller than he is, in his RIGHT hand: a dark brown wooden shaft with gold-orange metal bands, a big glossy black-violet obsidian head with sharp backward-hooked barbs, a coil of tan rope tied in loops just below the head, and a pointed gold cap at the bottom end.

Pose, the same in all five pictures: standing still in a firm, heavy stance, feet apart; the harpoon held upright in his right hand beside him, its gold end resting on the ground and the obsidian head above his head, never covering his face or his snout; his left hand a loose fist at his side; his tail resting on the ground behind him; jaws closed in a confident toothy grin, calm and fierce.

Size and room, the same in all five pictures: from the tip of the harpoon to the soles of his feet he fills about two thirds of the picture's height. He stands in the middle with his feet about 12% above the bottom edge, with empty green space above the harpoon and wide empty green margins on both sides, so a later animation can thrust and raise the long harpoon. The whole harpoon, his whole tail and his feet stay inside the picture.

No green anywhere on him (his blues are deep navy). No water, no splashes, no drops, no glow, no light rays, no sparkles, no motion lines, no effects.
```

#### ภาพ — ข้าง (หันขวา) (E)
```
Picture 3 of 5 — SIDE view facing RIGHT, like the side view on the sheet: his long snout points to the right edge of the picture and we see his right side — one eye, the scar on his snout, the fang necklace on his chest and the row of spikes down his back on the left. His near hand holds the harpoon upright just behind his body, on the left side of the picture, so it never covers his snout; his other arm is mostly hidden behind his body. The red sash crosses his chest from his far shoulder down to his near hip, where the torn red panel hangs. His long tail lies on the ground behind him, curving out to the left.

Draw the crocodile warrior from the attached character sheet: the same character in the same drawing style — a friendly hand-painted chibi cartoon with thick clean dark-brown outlines and flat cel shading in 2–3 tones, bright and warm. Not realistic, not painterly, not 3D.

ONE square picture showing only this one crocodile, alone, on a plain flat pure green background (#00FF00): no gradient, no floor, no shadow under him, no water, no other views, no text, no logo, no frame.

His look, exactly as on the sheet: a big, heavy crocodile warrior with a long, flat crocodile snout, a confident toothy grin with the interlocking teeth showing along his closed jaw and gold caps on his big front fangs, heavy brow ridges, small fierce amber-gold eyes and a red scar across the top of his snout. Mud-brown scales with darker chocolate-brown scale plates and warm tan highlights; a tan-cream lower jaw, throat, chest and belly; a row of tall orange-gold spikes from the top of his head down his neck, his back and his whole tail. A necklace of big curved cream fangs with gold caps and dark brown beads on a gold-orange cord. A torn crimson-red sash with a cream stepped-fret pattern over his LEFT shoulder, crossing his chest down to his RIGHT hip, where a torn red cloth panel with the same pattern hangs, and a short torn red cloth skirt with the cream pattern around his hips. A thick tan rope belt wound twice round his waist and knotted, with a round tan gourd in a gold-brown cord net hanging at the front of the belt on his LEFT side. A short dark brown loincloth flap at the front with an orange-red stepped zigzag border. Bulky muscular arms with gold bands on the upper arms and deep navy-blue cloth wraps with gold-orange bands at the wrists; big dark slate-grey hands. Thick scaly legs with deep navy-blue cloth wraps on the shins and gold-orange bands at the ankles; big brown feet with three cream claws each. A long, heavy tail, brown on top with the orange-gold spikes and tan-cream underneath. His harpoon, taller than he is, in his RIGHT hand: a dark brown wooden shaft with gold-orange metal bands, a big glossy black-violet obsidian head with sharp backward-hooked barbs, a coil of tan rope tied in loops just below the head, and a pointed gold cap at the bottom end.

Pose, the same in all five pictures: standing still in a firm, heavy stance, feet apart; the harpoon held upright in his right hand beside him, its gold end resting on the ground and the obsidian head above his head, never covering his face or his snout; his left hand a loose fist at his side; his tail resting on the ground behind him; jaws closed in a confident toothy grin, calm and fierce.

Size and room, the same in all five pictures: from the tip of the harpoon to the soles of his feet he fills about two thirds of the picture's height. He stands in the middle with his feet about 12% above the bottom edge, with empty green space above the harpoon and wide empty green margins on both sides, so a later animation can thrust and raise the long harpoon. The whole harpoon, his whole tail and his feet stay inside the picture.

No green anywhere on him (his blues are deep navy). No water, no splashes, no drops, no glow, no light rays, no sparkles, no motion lines, no effects.
```

#### ภาพ — เฉียงหลัง (หันขวา) (NE)
```
Picture 4 of 5 — BACK THREE-QUARTER view: he is turned away from us, facing up and to the RIGHT. We see mostly his back: the back of his head, the row of orange-gold spikes running down his neck, back and tail, and of his face only the side of his long snout on the right — not his eyes and not his face. His near hand holds the upright harpoon on the RIGHT side of the picture; his far hand is a loose fist on the left side, partly behind his body. The red sash crosses his back from his far shoulder, on the left side of the picture, down to his near hip on the right. His long tail lies on the ground behind him, curving toward us and out to the lower left.

Draw the crocodile warrior from the attached character sheet: the same character in the same drawing style — a friendly hand-painted chibi cartoon with thick clean dark-brown outlines and flat cel shading in 2–3 tones, bright and warm. Not realistic, not painterly, not 3D.

ONE square picture showing only this one crocodile, alone, on a plain flat pure green background (#00FF00): no gradient, no floor, no shadow under him, no water, no other views, no text, no logo, no frame.

His look, exactly as on the sheet: a big, heavy crocodile warrior with a long, flat crocodile snout, a confident toothy grin with the interlocking teeth showing along his closed jaw and gold caps on his big front fangs, heavy brow ridges, small fierce amber-gold eyes and a red scar across the top of his snout. Mud-brown scales with darker chocolate-brown scale plates and warm tan highlights; a tan-cream lower jaw, throat, chest and belly; a row of tall orange-gold spikes from the top of his head down his neck, his back and his whole tail. A necklace of big curved cream fangs with gold caps and dark brown beads on a gold-orange cord. A torn crimson-red sash with a cream stepped-fret pattern over his LEFT shoulder, crossing his chest down to his RIGHT hip, where a torn red cloth panel with the same pattern hangs, and a short torn red cloth skirt with the cream pattern around his hips. A thick tan rope belt wound twice round his waist and knotted, with a round tan gourd in a gold-brown cord net hanging at the front of the belt on his LEFT side. A short dark brown loincloth flap at the front with an orange-red stepped zigzag border. Bulky muscular arms with gold bands on the upper arms and deep navy-blue cloth wraps with gold-orange bands at the wrists; big dark slate-grey hands. Thick scaly legs with deep navy-blue cloth wraps on the shins and gold-orange bands at the ankles; big brown feet with three cream claws each. A long, heavy tail, brown on top with the orange-gold spikes and tan-cream underneath. His harpoon, taller than he is, in his RIGHT hand: a dark brown wooden shaft with gold-orange metal bands, a big glossy black-violet obsidian head with sharp backward-hooked barbs, a coil of tan rope tied in loops just below the head, and a pointed gold cap at the bottom end.

Pose, the same in all five pictures: standing still in a firm, heavy stance, feet apart; the harpoon held upright in his right hand beside him, its gold end resting on the ground and the obsidian head above his head, never covering his face or his snout; his left hand a loose fist at his side; his tail resting on the ground behind him; jaws closed in a confident toothy grin, calm and fierce.

Size and room, the same in all five pictures: from the tip of the harpoon to the soles of his feet he fills about two thirds of the picture's height. He stands in the middle with his feet about 12% above the bottom edge, with empty green space above the harpoon and wide empty green margins on both sides, so a later animation can thrust and raise the long harpoon. The whole harpoon, his whole tail and his feet stay inside the picture.

No green anywhere on him (his blues are deep navy). No water, no splashes, no drops, no glow, no light rays, no sparkles, no motion lines, no effects.
```

#### ภาพ — หลัง (N)
```
Picture 5 of 5 — BACK view: his back faces us, like the back view on the sheet. The harpoon stands on the RIGHT side of the picture (his right hand); his left hand is a loose fist on the left side. The red sash crosses his back from the shoulder on the LEFT side of the picture down to the hip on the RIGHT side (follow this, even where the back view on the sheet shows it the other way). We see the back of his head and the row of orange-gold spikes running down his neck, back and tail; his face does not show. His long tail lies on the ground behind him, curving out to the left side of the picture.

Draw the crocodile warrior from the attached character sheet: the same character in the same drawing style — a friendly hand-painted chibi cartoon with thick clean dark-brown outlines and flat cel shading in 2–3 tones, bright and warm. Not realistic, not painterly, not 3D.

ONE square picture showing only this one crocodile, alone, on a plain flat pure green background (#00FF00): no gradient, no floor, no shadow under him, no water, no other views, no text, no logo, no frame.

His look, exactly as on the sheet: a big, heavy crocodile warrior with a long, flat crocodile snout, a confident toothy grin with the interlocking teeth showing along his closed jaw and gold caps on his big front fangs, heavy brow ridges, small fierce amber-gold eyes and a red scar across the top of his snout. Mud-brown scales with darker chocolate-brown scale plates and warm tan highlights; a tan-cream lower jaw, throat, chest and belly; a row of tall orange-gold spikes from the top of his head down his neck, his back and his whole tail. A necklace of big curved cream fangs with gold caps and dark brown beads on a gold-orange cord. A torn crimson-red sash with a cream stepped-fret pattern over his LEFT shoulder, crossing his chest down to his RIGHT hip, where a torn red cloth panel with the same pattern hangs, and a short torn red cloth skirt with the cream pattern around his hips. A thick tan rope belt wound twice round his waist and knotted, with a round tan gourd in a gold-brown cord net hanging at the front of the belt on his LEFT side. A short dark brown loincloth flap at the front with an orange-red stepped zigzag border. Bulky muscular arms with gold bands on the upper arms and deep navy-blue cloth wraps with gold-orange bands at the wrists; big dark slate-grey hands. Thick scaly legs with deep navy-blue cloth wraps on the shins and gold-orange bands at the ankles; big brown feet with three cream claws each. A long, heavy tail, brown on top with the orange-gold spikes and tan-cream underneath. His harpoon, taller than he is, in his RIGHT hand: a dark brown wooden shaft with gold-orange metal bands, a big glossy black-violet obsidian head with sharp backward-hooked barbs, a coil of tan rope tied in loops just below the head, and a pointed gold cap at the bottom end.

Pose, the same in all five pictures: standing still in a firm, heavy stance, feet apart; the harpoon held upright in his right hand beside him, its gold end resting on the ground and the obsidian head above his head, never covering his face or his snout; his left hand a loose fist at his side; his tail resting on the ground behind him; jaws closed in a confident toothy grin, calm and fierce.

Size and room, the same in all five pictures: from the tip of the harpoon to the soles of his feet he fills about two thirds of the picture's height. He stands in the middle with his feet about 12% above the bottom edge, with empty green space above the harpoon and wide empty green margins on both sides, so a later animation can thrust and raise the long harpoon. The whole harpoon, his whole tail and his feet stay inside the picture.

No green anywhere on him (his blues are deep navy). No water, no splashes, no drops, no glow, no light rays, no sparkles, no motion lines, no effects.
```

### ขั้น 2 — ภาพตั้งต้น (ทำเมื่อภาพยืนมาถึง)
- แนวนอน 1200×900 (4:3) ไม่ใช่สี่เหลี่ยมจัตุรัส: ฉมวกยาวกว่าตัว ตอนแทงสุดแขนในมุมข้างปลายฉมวกพุ่งไปข้างหน้าไกล ภาพ 900² แคบไป (บาสเต็ดเคยใช้ 480×640 แนวตั้ง เครื่องมือของเจ้าของเก็บสัดส่วนตามภาพ) · คำสั่ง + ตัวเลข: `CROC_CLIP_PROMPTS_TH.md`

### ขั้น 3 — คลิป 20 ตัว
พรอมต์: `CROC_CLIP_PROMPTS_TH.md` (สร้างจาก `python3 tools/clip_prompts.py croc`)
