# แรดขนยาว (Woolly Rhino): ลุคใหม่ 5 แบบ (2026-11-24 20:30)

เจ้าของ: "ทำดีไซน์ใหม่ของแรดให้หน่อย" (ไม่ได้บอกแนว) → เขียนไว้หลายแนวให้เลือก:
- แรดเต็มตัว 3 แบบ: แบบ 1 ครบสองสาย · แบบ 2 สาย A กำแพงเหล็ก · แบบ 3 สาย B หมัดยักษ์
- สาวแรด 1 แบบ (แบบ 4)
- ลุคเดิมแต่งให้เท่ 1 แบบ (แบบ 5)

ถ้าไม่ตรงใจ บอกแนวที่อยากได้มาได้เลย (เช่น กลมน่ารักแบบฮิปโป หรือดุดันแบบมังกร)

**เลือกแล้ว: แบบ 1 ไททันธารน้ำแข็ง (2026-11-24 20:56)** → ภาพใหญ่อยู่หน้าเลือกตัวแล้ว · ภาพยืน 5 มุมมาแล้ว (21:48) + ส่งภาพตั้งต้นแล้ว → รอคลิป 20 ตัว (พรอมต์: `RHINO_CLIP_PROMPTS_TH.md`) · ดูหัวข้อ 'เลือกแล้ว' ท้ายไฟล์

## เปลี่ยนแรดกระทบอะไรบ้าง (น้อยกว่าหมาป่ามาก)
- **สไปร์ท `assets_rhino.js`** (prefix RH) ทำจากคลิป 17 อัน ไม่มีคลิปหันหลัง (N ใช้ภาพ NE แทน) · ใช้กับแรดตัวเดียว → คลิปใหม่ 20 อันเขียนทับไฟล์เดิมได้เลย ฮีโร่ตัวอื่นไม่โดน
- **ไม่มี** แฟชั่นติดตัว หน้ากากสีขน ท่านั่ง → ไม่มีงานวัดจุดแบบหมาป่า
- **หน้า HUD** ลุคเดิมฝังอยู่ใน `assets_rhino.js` (`RH_PORTRAIT`) → เขียนทับ atlas แล้วหายไปด้วย ต้องตัดหัวใหม่จากภาพหน้าตรง (window.HUD_FACE)
- **ภาพวาดที่เป็นลุคเดิม:**
  - ไอคอนสกิล 53 (`assets/skill-icons/rhino`) · พื้นหลังผังสกิล 4 ภาพ · ภาพหน้าเลือกตัว
  - ภาพเอฟเฟกต์ที่วาดถุงมือเดิม: หมัดพุ่ง `r01_jab` · หมัดหนัก `r02_heavy` (ถุงมือเหล็ก ขอบขนสัตว์ คาดลายถักทอง)
  - ภาพเอฟเฟกต์ที่มีตัวแรดเดิม: วิญญาณยักษ์ `colossus-spirit` · `worldbreaker` (`assets/skill-vfx/rhino`) · หน้าวิญญาณน้ำแข็ง `r35_spirit` เป็นวิญญาณสีฟ้า ใช้ต่อได้
  - ภาพหน้าโหลดที่มีแรดเดิม: ld1 ld7 ld8
  - ไอคอนอาวุธ (ถุงมือแต่ละแดน `wp_<แดน>_rhino`) เป็นไอเทม ไม่ต้องเปลี่ยน

**ถ้าเปลี่ยน ทำแบบนี้:**
- คลิป 20 อัน (ได้คลิปหันหลัง N ครั้งแรก) คงเวลาเฟรมตี / ร่ายเดิมทุกทิศ → ดาเมจกับจังหวะไม่เปลี่ยน · ตัวสูงบนจอเท่าเดิม
- งานที่ตามมา: หน้า HUD + ภาพหน้าเลือกตัว + ท่านั่ง (ใหม่ทั้งหมด)
- ทีหลัง: ไอคอน 53 + ex_ 11 + ผังสกิล 4 ภาพ + ภาพเอฟเฟกต์ที่มีถุงมือ / ตัวแรดเดิม + ภาพหน้าโหลด 3 ภาพ
- แบบ 5 ใกล้ลุคเดิมที่สุด ไอคอน ผังสกิล ภาพเอฟเฟกต์ และภาพหน้าโหลดเดิมยังพอเข้ากันได้นานสุด

## ทำไมลุคเดิมยังไม่เด่น
- ขนสีครีมอมชมพูฟูคลุมตั้งแต่หัวถึงเข่า → ตัวกลมเป็นก้อนขน มองไกลๆ เหมือนแกะหรือมนุษย์หิมะ · ตอนนี้แกะ (นักบวชสาว) ก็ผมขนแกะสีชมพู → สีซ้ำกัน
- หัวแรดเล็ก จมอยู่ในขน เขาเดียวสั้น · มุมหลัง (NE, N) เห็นแต่ขน ไม่รู้ว่าเป็นแรด · แรดขนยาวตัวจริงมี 2 เขา (เขาหน้ายาว + เขาเล็กข้างหลัง) และหนอกไหล่ใหญ่ ซึ่งลุคเดิมยังไม่มี
- ขนครีมชมพู + ชุดส้มอ่อน → สีจาง บนหิมะ (บ้านนอร์สของมันเอง) กลืนพื้น
- ขนคลุมไหล่กับแขนหมด → ไม่เห็นรูปทรงนักชก ทั้งที่สกิลเป็นหมัดล้วน · ถุงมือเหล็กเป็นสิ่งเดียวที่บอกว่าสู้
- ไม่มีอะไรบอกสาย A (กำแพงเหล็ก ป้องกัน สวนกลับ) หรือสาย B (หมัดยักษ์ ทุบพื้น)

## กติกา (อยู่ในพรอมต์ 0 แล้ว)
- **แรดขนยาวยุคน้ำแข็งจริงๆ:** หัวแรดยาว ผิวหนังเทา **2 เขา** (เขาหน้ายาว + เขาเล็กข้างหลัง) หูเล็ก ตาเล็กดุใต้คิ้วหนา ขนยาวหยาบบนหนอกไหล่กับหลังคอ (แต่ละแบบบอกสีเอง) หางสั้นมีพู่
- **หัวโล่งเสมอ:** หัว เขาทั้งสอง ตาสองข้าง หูสองข้าง เห็นทุกมุม · ห้ามหมวกเกราะ ฮู้ด หมวก · ใส่ได้แค่ห่วงหรือแถบรัดเขา → หมวกแฟชั่นใส่ได้ทีหลัง
- **ถุงมือยักษ์ 2 ข้างทุกมุม:** สู้มือเปล่า ถุงมือแต่ละข้างใหญ่กว่าหัว · ห้ามถืออาวุธ ห้ามโล่ (ฮิปโปมีโล่แล้ว)
- **ตัวหนักที่สุดในเกม:** เงาสามเหลี่ยมกลับหัว ไหล่ใหญ่ หนอกสูง แขนหนา อกกว้าง ขาสั้นแข็งแรง · ไม่ใช่ลูกบอลกลม ไม่ใช่พุงพลุ้ย (ไม่ให้ซ้ำฮิปโป)
- **เด่นบนหิมะ:** ขนกับชุดใช้สีเข้มสด · ขนสีอ่อนได้แค่ขอบเล็กๆ ห้ามโค้ทขนสีครีม / ชมพูทั้งตัว
- **ชุดยาวไม่เกินเข่า** เห็นขาตอนเดิน · รองเท้าพอดีเท้า
- **หลังโล่ง:** ผ้า / ขนคลุมไหล่สั้นแค่สะบัก ห้ามผ้าคลุมยาว ห้ามของบนหลัง → ปีก / ผ้าคลุมแฟชั่นใส่ได้ · ของห้อยน้อย
- **ไม่ซ้ำฮีโร่อื่น:** ฮิปโป (กลม น่ารัก เทาฟ้า อียิปต์ ผ้าคลุมเขียวอมฟ้า ทอง กระบอง + โล่) · มังกรหลอมเพลิง (อัศวินมังกรแดง เกราะขาว ดาบ ผ้าคลุมแดง) · มังกรฟ้า (นักมวยมังกรตัวเพรียว สนับมือทอง) · หมาป่าขาว (ไวกิ้งขวานใหญ่) · แกะ (ผมขนแกะชมพู)
- **ห้ามสีเขียว** (คลิปตัดพื้นเขียว) · ห้ามตัวอักษร · รูนเป็นสัญลักษณ์เส้นตรงเรียบๆ อ่านไม่ออก
- **มุมขวาล่างของชีต:** ท่าสู้ 2 ท่า ใช้ดูว่าลุคนี้เวลาสู้เท่ไหม และเป็นแบบให้ไอคอนกับผังสกิลทีหลัง
  - ไขว้ถุงมือบังหน้า กำแพงเหล็กหมุดย้ำผุดจากพื้นตรงหน้า ประกายไฟกระเด็น = สาย A Iron Juggernaut
  - ต่อยทุบลงพื้น พื้นแตก หินกับเกล็ดน้ำแข็งกระเด็นขึ้น = สาย B Titan Breaker

## วิธีใช้
1. เปิดแชต ChatGPT ใหม่
2. ส่งพรอมต์ 0 พร้อมแนบ 2 ภาพ (ส่งให้ในแชตแล้ว):
   - `keyart_campfire_ld5.jpg` = ภาพปกแคมป์ไฟ (`assets/loading/ld5.webp`) ใช้เป็นแบบลายเส้น · ภาพนี้ไม่มีแรดตัวเดิม · **อย่าใช้ ld1 ld7 ld8** เพราะมีแรดเดิมอยู่ ChatGPT จะลอกลุคเดิมมา
   - `hero_ref_anubis.jpg` (`tools/ref/`) = แบบสัดส่วนฮีโร่ชายตัวสัตว์ ไม่ให้ลอกชุด (แรดต้องตัวใหญ่กว่ามาก)
3. รอให้มันตอบ ready
4. ส่งแบบ 1–5 ทีละข้อความ (ข้อความละ 1 ภาพ) · **แบบ 5 แนบ `rhino_old_ref.jpg` (ลุคเดิม, `tools/ref/`) ไปกับข้อความนั้นด้วย**
5. ชอบคนละส่วน → ใช้พรอมต์ผสม

ประโยคแก้ภาพ (ต่อท้ายแล้วส่ง):
- เหมือนฮิปโป / ตัวกลม → `He looks too much like a hippo: give him a long rhino head with two horns, a big shoulder hump covered in shaggy wool, and a broad-shouldered triangle silhouette instead of a round body.`
- มีเขาเดียว → `Give him two horns: a long front horn on his nose and a smaller second horn just behind it.`
- ขนคลุมตัวเป็นก้อน → `Show his body shape: keep the wool on his shoulder hump, neck and forearms only, so his big shoulders and thick arms read clearly.`
- สีจาง กลืนหิมะ → `He must stand out on snow: make his wool and outfit darker and more saturated; no big pale cream or pink fur.`
- ถุงมือเล็ก → `Make his gauntlets huge: each one clearly bigger than his head, on both hands.`
- ถืออาวุธ / โล่มา → `Remove the weapon and the shield: he fights only with his two huge gauntlets.`
- ใส่หมวก / ฮู้ดมา → `Remove the headgear: his head, both horns, both eyes and both ears must stay fully visible (only rings or a band on a horn).`
- ผ้าคลุมยาว → `Shorten the cape to a small shoulder cloth that ends at his shoulder blades, so his back and tail stay clear.`
- มีสีเขียว → `Remove every green: use frost blue, steel, copper or crimson instead.`
- ดุจนน่ากลัว → `Keep him strong, but in the friendly chibi cartoon style of the attached images: a bigger head, bigger eyes and simpler shapes.`
- อยากได้แบบไหนเป็นผู้หญิง → `Make the hero a girl, with the same outfit idea and colours.`
- แก้แค่บางส่วน → ใช้แปรงเลือกเฉพาะจุดใน ChatGPT (สั่งแก้ทั้งภาพ มันจะวาดใหม่หมด)

## 5 แบบ

| แบบ | ลุค | สีตัด | ท่าภาพใหญ่ | ผูกกับ |
|---|---|---|---|---|
| 1 ไททันธารน้ำแข็ง ✓ เลือกแล้ว | แรดเต็มตัว ผิวเทาหิน ขนยาวสีน้ำตาลเกาลัดบนหนอกไหล่ · เขาหน้าสีงาช้างรัดห่วงเหล็กสลักรูน ลายสงครามฟ้าที่แก้ม · สายหนังไขว้อก แผ่นทองแดงรูปหัวแรดกลางอก · บ่าเหล็กฝังผลึกน้ำแข็ง + ผ้าคลุมไหล่สั้นสีฟ้าธารน้ำแข็งขอบขนขาว · ถุงมือเหล็กดำหมุดทองแดง สนับข้อนิ้วเป็นผลึกน้ำแข็งเรืองฟ้า ขอบขนน้ำตาล | น้ำตาลเกาลัด + เหล็กดำ + ฟ้าธารน้ำแข็ง + ทองแดง | ชนถุงมือสองข้างเข้าหากันหน้าอก เกล็ดน้ำแข็งแตกกระจาย ยิ้มมั่นใจ | ครบสองสาย · สาย C ธารน้ำแข็ง (Glacier Charge, Frozen Bastion, Glacier Bulwark) + วิญญาณยักษ์น้ำแข็ง · แรดขนยาวเป็นสัตว์ยุคน้ำแข็งจริง |
| 2 ป้อมเหล็กเดินได้ | แรดเต็มตัว ผิวเทาเหล็ก ขนสั้นสีเทาถ่าน เขาหน้าหนาครอบปลายเหล็ก แผลเป็นที่จมูก · เกราะแผ่นเหล็กหมุดย้ำ แผ่นบนหนอกไหล่เป็นรูปกำแพงปราสาทมีเชิงเทินเล็กๆ · ปุ่มเหล็กกลมกลางอกสลักหัวแรด · เสื้อบุนวมสีแดงเลือดหมูขอบทองแดง · ถุงมือเหล็กสี่เหลี่ยมใหญ่เหมือนกำแพงพกพา | เหล็กเทา + แดงเลือดหมู + ทองแดง | ย่อตัวกว้าง ยกถุงมือสองข้างชิดกันหน้าอกเหมือนกำแพง ตาโผล่พ้นขอบ ประกายไฟกระเด็น | สาย A แท้งก์ (Iron Skin, Steel Wall, Rhino Fortress, Immovable Colossus, Absolute Fortress) |
| 3 ไททันผู้ทุบภูเขา | แรดเต็มตัว ผิวเทาหินผุ เขาหน้าใหญ่ปลายบิ่น แผลเป็นรูนเรืองฟ้าที่จมูกกับแขน · แผงขนยาวสีแดงสนิมหนาบนหนอกไหล่ยาวลงหลัง · อกเปลือย สายหนังเส้นเดียว ผ้าพันต้นแขนแดง · กระโปรงหนังแมมมอธสั้น ขอบขนแดงสนิม · ถุงมือก้อนหินยักษ์รัดห่วงเหล็กกับโซ่สั้น รอยแตกเรืองฟ้า | แดงสนิม + เทาหิน + ฟ้าเรือง | โน้มตัวคำราม ชูหมัดหินข้างหนึ่งสูงจะทุบ หินก้อนเล็กลอยขึ้นรอบตัว | สาย B ควบคุม (Heavy Knuckle, Double Hammer Fist, Meteor Knuckle, Earthshaker, Skybreaker, Worldbreaker) |
| 4 สาวแรดนักชก | ผู้หญิง หน้าแรดน่ารัก ผิวเทานวล เขาหน้ายาวผูกริบบิ้นฟ้า + เขาเล็ก ตาฟ้าโต ขนตายาว แก้มแดง · ขนน้ำตาลบนหนอกไหล่ถักเป็นเปียหนาสองข้าง ห่วงทองแดง · เสื้อน้ำเงินเข้มขอบขนขาว บ่าทองแดงข้างเดียว กระโปรงจีบกรมท่าเหนือเข่า · ถุงมือเหล็กกลมใหญ่ สนับทองแดง ขอบขนขาว | น้ำเงินเข้ม + เหล็ก + ทองแดง | เบ่งกล้ามแขนข้างหนึ่งชูถุงมือ อีกมือเท้าเอว ขยิบตา เปียแกว่ง | ถ้าอยากได้แรดเป็นผู้หญิง (ตัวใหญ่แข็งแรงแบบแท้งก์ ห้ามผอมบาง) |
| 5 แรดขนยาวโฉมใหม่ | ลุคเดิมแต่งให้เท่: 2 เขา หัวสูงพ้นขน ขนสั้นแค่ไหล่สีน้ำตาลคาราเมล (ไม่ชมพู) เห็นไหล่กับแขน · เสื้อแดงเข้มลายซิกแซกส้มขาว ธงเกล็ดหิมะขาวเหมือนเดิม สายหนังไขว้อก ป้ายหัวแรดทองแดง · ถุงมือเหล็กใหญ่ขึ้น ลายเกล็ดหิมะ ขอบขนสัตว์ คาดลายถักทองแดง · บูทพอดีเท้า | แดงเข้ม + ส้มไหม้ + เหล็ก + ทองแดง | กำหมัดสองข้างข้างตัว อกผาย ยิ้มมั่นใจ ขนกับธงปลิวลม | ไอคอน ผังสกิล ภาพเอฟเฟกต์ (หมัด r01 r02 มีขอบขนกับคาดลายถัก) และภาพหน้าโหลดเดิมยังพอเข้ากันได้ |

แนะนำ:
- **แบบ 1** ครบสองสาย อ่านออกทันทีว่าเป็นแรดขนยาว เด่นบนหิมะ และเข้ากับสาย C ที่เป็นธารน้ำแข็ง
- **แบบ 5** ประหยัดสุด (ไอคอน ผังสกิล ภาพเอฟเฟกต์เดิมใช้ต่อได้นานสุด)
- ชื่อในหน้าเลือกตัว "Woolly Rhino · Guardian" ใช้ได้ทุกแบบ
- ทองแดงกับเหล็กเป็นสีเอฟเฟกต์หมัดของแรดในเกมอยู่แล้ว (`RHC.copper` / `RHC.steel`) → ทุกแบบใช้ทองแดงเป็นสีรอง

### พรอมต์ 0 — กติกา (ส่งครั้งเดียวต่อแชต พร้อมแนบ 2 ภาพ)
```
I will ask you for several character design sheets of ONE hero for my cute cartoon fantasy MMORPG (animal heroes from Norse, Greek, Egyptian, Japanese and Aztec myths). These rules apply to every sheet in this chat. Do not draw anything yet: reply only "ready", then draw ONE sheet each time I send a design.

Style: copy the first attached image (the game's key art) — friendly hand-painted chibi cartoon, thick clean dark-brown outlines (not black), cel shading with 2–3 flat tones, soft cartoon glow, bright and warm. Not realistic, not painterly, not 3D. The wolf and the cat in the first image and the jackal in the second image are other heroes of my game: match their proportions, outline weight, colouring and finish, but do NOT copy their designs.

The hero: the Woolly Rhino, the guardian of the frozen north — a big-hearted Norse brawler who fights with two huge gauntlets and stands in front of his friends to take the hits. One path makes him an iron juggernaut — iron skin, steel walls rising from the ground, shield pulses and crushing counter-punches. The other path makes him a titan breaker — giant punches, double hammer-fists, rising uppercuts and fist slams that crack the ground and send rocks and frost flying. His strongest skills call an ancient glacier and the giant ice spirit of a colossus rhino. He must look COOL and STRONG — the heavyweight players pick to protect their team — while staying in the game's cartoon style (a hero, not a monster):
- a real WOOLLY RHINO, the Ice Age rhino: a long rhino head with a grey hide snout, TWO horns — a long front horn on his nose and a smaller second horn just behind it — small ears, small fierce eyes under heavy brows, shaggy wool on his big shoulder hump and the back of his neck (each design gives its colour), a short tail with a tuft
- his head, both horns, both eyes and both ears are always fully visible: no helmet, no hood, no hat, no big headdress — only rings or a band on a horn if the design gives them
- he fights bare-handed with TWO HUGE GAUNTLETS, one on each hand in every view, each one bigger than his head (each design gives their look); no weapon in his hands and no shield
- the heaviest hero of my game: a broad triangle silhouette — huge shoulders and hump, thick arms, a barrel chest, short sturdy legs — never a round ball and never a fat belly; much bulkier than the jackal
- he must stand out on snow: his wool and outfit use deep, saturated colours (each design gives them); light fur only as small trims, never a big pale cream or pink fur coat
- the outfit ends at or above the knee so his legs read clearly when he walks; boots or foot wraps that fit his feet
- his back stays fairly clear: at most a short shoulder cloth or fur mantle that ends at the shoulder blades — no long cape, nothing carried on his back; only a few dangling items
- he must look clearly different from my other heroes: a round, cute blue-grey Egyptian hippo with a teal cape, gold jewellery, a mace and a shield; a red dragon knight in white plate armour with a sword and a crimson cape; a slim blue Japanese dragon martial artist with gold knuckle guards; a white wolf Viking with a greataxe; a sheep priestess with pink wool hair
- no green anywhere on the character (use frost blue, steel, copper or crimson instead), and no letters or words anywhere — rune marks are simple angular carved symbols, never readable text

Every sheet: ONE wide image 1536×1024 on a plain soft cream background. No text, no labels, no names, no logo, no watermark.
Layout: LEFT HALF — the hero large, full body, three-quarter front view, in the pose the design gives. TOP RIGHT — a small turnaround of the same hero standing neutral with his gauntlets at his sides: front, side facing right, back, all the same height. BOTTOM RIGHT — two small action poses of the same hero side by side: an iron guard, both gauntlets crossed in front of his face while a riveted iron wall rises from the ground in front of him and sparks fly off it; and a titan smash, a huge punch driven down into the ground, the ground cracking open with rocks and frost bursting up.
Keep the hero identical in every view of a sheet. Every design I send is a completely new look: reuse nothing from earlier sheets in this chat.
```

### แบบ 1 — ไททันธารน้ำแข็ง
```
Design 1 — "Glacier Titan". An ancient guardian of the glaciers, as old and as tough as the Ice Age. A full rhino head with a slate-grey hide, a long, slightly curved ivory front horn with two dark iron rings carved with simple runes, a short second horn behind it, small fierce frost-blue eyes under heavy brows, a notch in his left ear, a confident grin. Thick shaggy dark chestnut-brown wool with lighter chestnut tips on his big shoulder hump, the back of his neck and his forearms; slate-grey hide on his face, chest and legs; frost-blue war paint, two angular stripes on each cheek. A sleeveless harness of dark leather straps crossing his chest with a round copper plate in the middle carved with a rhino head; one big dark-iron pauldron with a glacier-ice crystal set in it on his left shoulder; a short deep glacier-blue cloth with a white fur trim over his right shoulder, ending at the shoulder blades. A wide dark leather belt with a round copper buckle, a short deep glacier-blue tunic skirt with an angular copper knotwork hem above the knee, dark-iron greaves over chestnut fur leg wraps, heavy iron-shod boots that fit his feet. The gauntlets: two huge dark-iron gauntlets with copper rivets, every knuckle capped with a blocky glacier-ice crystal plate glowing faint blue, thick chestnut fur cuffs at the wrists. Accent colours: chestnut brown, dark iron and deep glacier blue with copper. Pose: punching his two gauntlets together in front of his chest so frost bursts from the knuckles, standing tall, a confident grin.
```

### แบบ 2 — ป้อมเหล็กเดินได้
```
Design 2 — "Iron Juggernaut". A walking fortress: when he plants his feet, nothing gets past him. A full rhino head with a gunmetal-grey hide, a thick straight front horn with a riveted steel cap on its tip, a small second horn, calm narrowed steel-blue eyes, a stern but kind look, a small scar across his snout. Short charcoal-grey wool on his shoulder hump and the back of his neck. Heavy riveted iron plate armour on his chest and shoulders: the plate over his shoulder hump is shaped like a castle rampart with small battlements along its top edge, and a round iron boss on his chest is carved with a rhino head. Under the plates a deep burgundy padded tunic with copper trim that ends above the knee, a wide belt with a square copper buckle, dark trousers, thick iron knee guards, square-toed iron boots. The gauntlets: two huge square gauntlets like portable iron walls — thick riveted steel slabs over the backs of his hands with copper edges and a small copper rhino emblem on each — big enough to cover his face when he raises them. Accent colours: gunmetal and deep burgundy with copper. Pose: a wide, low guard stance with both slab gauntlets raised side by side in front of his chest like a wall, his eyes peeking over the top, small sparks bouncing off the steel.
```

### แบบ 3 — ไททันผู้ทุบภูเขา
```
Design 3 — "Mountain-Breaker Titan". The wild brawler whose punches crack the earth like the fists of the giants. A full rhino head with a weathered stone-grey hide, a huge front horn with a chipped tip, a short second horn, fiery amber eyes, a wide roaring grin, glowing frost-blue rune scars across his snout and down his left arm (simple angular marks). A thick shaggy rust-red mane of wool over his shoulder hump that runs down his back, rust-red wool on his forearms. A bare grey chest crossed by one thick leather strap with a carved bone toggle, crimson cloth wraps on his upper arms, dark leather bracers under the gauntlets, a short kilt of dark-brown mammoth hide with bone toggles and a rust-red fur trim above the knee, fur leg wraps tied with leather cords, sturdy hide boots with iron toe caps. The gauntlets: two enormous boulder gauntlets — rough dark-stone fists bound with iron bands and short chains, deep cracks glowing frost blue, as if carved out of a mountain. Accent colours: rust red and stone grey with glowing frost blue. Pose: leaning forward with a roar, one boulder fist raised high above his head ready to smash down, the other clenched at his side, small rocks floating up around him.
```

### แบบ 4 — สาวแรดนักชก
```
Design 4 — "Glacier Brawler Girl". This time the hero is a girl: a young Norse rhino brawler, strong and cheerful, who stands in front of her friends. All the rules above apply to her. A cute rhino face with a soft grey hide, a long pale front horn with a frost-blue ribbon tied around its base and a small second horn, big bright ice-blue eyes with long lashes, rosy cheeks, a confident grin. Thick chestnut-brown wool on her shoulder hump grows into two long, thick braids that fall over her shoulders, tied with copper rings. A fitted deep-blue tunic with white fur trim and silver knotwork, a short copper shoulder guard on her left shoulder, a wide belt with a round copper buckle, a pleated navy skirt above the knee over dark leggings, fur-topped boots. The gauntlets: two huge rounded steel gauntlets with copper knuckle plates and white fur cuffs, each bigger than her head. Accent colours: deep blue and steel with copper. Pose: flexing one arm with its huge gauntlet raised, the other fist on her hip, winking, her braids swinging. She stays big and sturdy like a strong heavyweight, never slim — and cute.
```

### แบบ 5 — แรดขนยาวโฉมใหม่ (แนบ `rhino_old_ref.jpg` ไปกับข้อความนี้)
```
Design 5 — "Woolly Rhino Reborn". The hero my game already has (the image attached to this message). Keep his idea — the big cream horn, the scar over his eye, his bright blue eyes, the fur around his shoulders, the red-and-orange Nordic tunic with the white snowflake banner, the steel gauntlets with snowflakes, the fur boots — but make him cool and strong. Give him two horns: the big cream front horn and a small second horn behind it, his head higher and fully visible above the fur. The fur becomes a short mantle on his shoulders and hump in warm caramel brown (not pink, not pale cream), so his big grey shoulders and thick arms show. A deeper outfit: a crimson tunic with burnt-orange and white Nordic zigzag trim, the white snowflake banner hanging from the belt, a dark leather harness across the chest with a round copper rhino-head badge, a wide belt with a copper buckle (no pouches). The gauntlets: bigger steel gauntlets with a carved snowflake on the back of each hand, thick fur cuffs and a copper knotwork band at the wrist. Dark trousers, fitted fur-topped leather boots (not big boots). Accent colours: crimson and burnt orange with steel and copper. Pose: both gauntlets clenched at his sides, chest out, a confident smirk, the fur and the banner blown by the snowy wind.
```

### พรอมต์ผสม (ตัวอย่าง — เปลี่ยนเลขกับส่วนได้)
```
Design 6 — a mix: the head and wool of design 1 with the outfit and colours of design 2, in the pose of design 3. Same rules and layout.
```

## เลือกแล้วทำอะไรต่อ
1. ส่งชีตที่เลือกมา → เขียนหัวข้อ 'เลือกแล้ว' ในไฟล์นี้ (หน้าตาตามที่วาด + พรอมต์ภาพยืน 5 มุมบนพื้นเขียว S SE E NE N ด้านข้างหันขวา ท่าเดียวกัน ขนาดเท่ากัน ถุงมือสองข้างทุกมุม กำหมัดหลวมๆ ข้างตัว)
2. ภาพตั้งต้น (`tools/dir8cut.py startv` size=900 feet .9 clean=0 · แรดตัวกว้าง เว้นที่ด้านข้างให้หมัดพุ่ง) + พรอมต์คลิป 20 อัน (`tools/clip_prompts.py` เพิ่มรายการ rhino) — ท่าที่เกมใช้:
   - **ท่าตี** = ทุบสองหมัดลงพื้นตรงหน้าแบบคลิปเดิม · หมัดชุด (Iron Fist Combo, Titan Combo …) เล่นเฉพาะเฟรม 'โดน−3 … โดน+1' ซ้ำต่อหมัด · ท่าทุบพื้น (`rhSlam`) เล่นท่าบัฟถึงจุดสูงสุด ค้าง แล้วต่อด้วยท่าตีตั้งแต่เฟรมโดน → เฟรมโดนต้องเป็นหมัดลงถึงพื้นพอดี
   - **ท่าบัฟ** = ย่อตัวรวบหมัดก่อน แล้วชูสองหมัดเหนือหัว คำราม ค้างไว้ราว 1 วิ · Rhino Charge ใช้ 3 เฟรมแรก (ย่อตัว) ก่อนพุ่ง แล้ววิ่งด้วยท่าเดินเร่ง 3.2 เท่า
3. คลิปมา → `tools/cliphero.py` → **เขียนทับ `assets_rhino.js`** (prefix RH เดิม ใช้กับแรดตัวเดียว) คงเวลาเฟรมเดิม:
   - ท่าตี 12 เฟรม
     - S = 50, 50, 50, 50, 50, 50, 160, 73, 146, 146, 109, 110 (โดนเฟรม 6 = 300 ms)
     - SE = 84, 56, 56, 56, 56, 50, 50, 160, 84, 169, 84, 110 (เฟรม 7 = 408 ms)
     - E = 94, 50, 94, 71, 50, 142, 50, 160, 71, 71, 71, 110 (เฟรม 7 = 551 ms)
     - NE = 50, 50, 50, 160, 50, 50, 50, 56, 180, 50, 50, 110 (เฟรม 3 = 150 ms)
     - N ตอนนี้ไม่มีคลิป (ใช้ภาพ NE) → คลิป N ใหม่ใช้เวลาของ NE
   - ท่าบัฟ 12 เฟรม จุดสูงสุดเฟรม 7 ค้าง 480 ms
     - S = 65, 65, 65, 130, 65, 50, 65, 480, 227, 65, 97, 50 (ถึงจุดสูงสุด 505 ms)
     - SE = 75, 75, 75, 113, 50, 50, 75, 480, 188, 75, 50, 50 (513 ms)
     - E = 90, 50, 50, 50, 90, 90, 90, 480, 226, 50, 90, 60 (510 ms)
     - NE = 50, 50, 50, 50, 79, 79, 79, 480, 50, 276, 158, 53 (437 ms) · N ใช้เวลาของ NE
   - เดิน 8 × 100 ms (E สลับ 110 / 90) · ยืน 12 เฟรม 2.4 วิ · โดนตี 7 เฟรม 550 ms (ทำจากท่ายืน)
   - ตัวยืน S สูงบนจอเท่าเดิม (`CHAR_SCALE.rhino` .96 วัดใหม่) · จุดถุงมือทุกเฟรมของท่าตีกับท่าบัฟ (`sockets` attack + buff)
4. ตามมา: หน้า HUD (`window.HUD_FACE`, แทน `RH_PORTRAIT` เดิม) + ภาพหน้าเลือกตัว + ท่านั่ง (`hero_sit.js`)
5. ทีหลัง: ไอคอน 53 + ex_ 11 + ผังสกิล 4 ภาพ + ภาพเอฟเฟกต์ที่มีถุงมือ / ตัวแรดเดิม (r01 r02, colossus-spirit, worldbreaker) + ภาพหน้าโหลด ld1 ld7 ld8 (เขียนพรอมต์ให้ตอนลุคนิ่งแล้ว)

## เลือกแล้ว: แบบ 1 ไททันธารน้ำแข็ง (2026-11-24 20:56)
- เจ้าของส่งชีต + "เอาอันนี้ภาพซ้ายเอาไปใส่หน้าเลือกตัว" → ชีตเก็บที่ `assets/heroes/rhino/sheet_glacier_titan.webp` (1536×1024 พื้นครีม)
- ภาพใหญ่ด้านซ้าย: ตัดพื้นครีม + เงาพื้นสีแทนออกด้วย `tools/bigpose_cut.py` (ไล่จากขอบภาพ หยุดที่เส้นขอบตัว · `pockets=0` เพราะไฮไลต์งากับฟันเป็นสีครีมเกือบเท่าพื้น ถ้าเจาะแอ่งครีมงาจะเป็นรู · ประกายของภาพท่าสู้ข้างๆ ไม่ติดมา) → `assets/heroes/rhino/bigpose_glacier_titan.webp` (689×979 พื้นใส) → หน้าเลือกตัว `assets/heroes/rhino/select.webp` (`tools/select_cut.py` สเกลเดียวกับตัวอื่น ตัวกว้างจึงชนกรอบด้านสูง 935 ของ 960 · `char_create.js` SELV rhino 2 = กันแคชภาพเก่า) · ภาพเลือกตัวเดิม (ลุคเก่า) อยู่ในประวัติ git
- ในเกมตอนนี้: หน้าเลือกตัวเป็นลุคใหม่แล้ว แต่ตัวในเกม หน้า HUD (`RH_PORTRAIT`) ไอคอน ผังสกิล ยังเป็นลุคเดิมจนกว่าคลิป 20 ตัวจะมา

**หน้าตาตามที่วาดออกมา** (ใช้ในพรอมต์ต่อๆ ไปทุกตัว):
- **หัว:** แรดเต็มตัว ผิวเทาอุ่น หัวยาว · งาหน้ายาวโค้งสีงาช้าง รัดห่วงเหล็กเข้มสลักลายซิกแซกสีเงิน 2 ห่วง · งาที่สองสั้นอยู่หลังงาแรก · หูเล็กตั้ง สีเทา ในหูชมพูเทา · ตาฟ้าน้ำแข็งเล็กดุ คิ้วหนาเข้ม · ลายสงครามสีฟ้าเป็นบั้งซ้อน 2 ขีดบนแก้มทั้งสองข้าง
- **ขน:** แผงขนแกะยาวสีน้ำตาลเกาลัดอมแดง ฟูยุ่ง คลุมหัว คอ หนอกไหล่ แล้วห้อยลงหลังถึงเอวเหมือนผ้าคลุม · ขนเกาลัดฟูที่ต้นแขน · ขนเกาลัดพันหน้าแข้งเหนือสนับแข้ง · หางเส้นเล็กสีเทา ปลายพู่ขนเกาลัด
- **อก / เอว:** อกเทา สายหนังเข้มไขว้เป็นกากบาท หมุดทองแดง เหรียญทองแดงกลมสลักหัวแรดกลางอก · เข็มขัดหนังเข้ม หัวเข็มขัดทองแดง**สี่เหลี่ยม** · กระโปรงทูนิกสีน้ำเงินธารน้ำแข็งเหนือเข่า ขอบลายซิกแซกทองแดง ชายหน้าห้อยต่ำกว่านิดหน่อย
- **ไหล่:** **บ่าขวา** = ผ้าคลุมไหล่สั้นสีน้ำเงินธารน้ำแข็ง ขอบขนขาว · **บ่าซ้าย** = เกราะบ่าเหล็กเข้มเหลี่ยม ฝังผลึกน้ำแข็งสีฟ้า
- **ถุงมือ:** ถุงมือเหล็กเข้มยักษ์ทั้งสองข้าง ใหญ่เกือบเท่าหัว · แถบรัดทองแดงหมุดทองแดงที่แขน · ข้อนิ้วเป็นแผ่นเหล็กแหลม + ผลึกน้ำแข็งเหลี่ยมสีฟ้าทุกข้อ · ขนเกาลัดที่ข้อศอก
- **ขา:** ต้นขาเทา · ขนเกาลัดพันแข้ง · สนับแข้งเหล็กเข้มรัดสายทองแดง · บูทหุ้มเหล็กหนัก หัวมนใหญ่ หมุดทองแดง
- **สี:** น้ำตาลเกาลัด + เทา + น้ำเงินธารน้ำแข็ง + ทองแดง + เหล็กเข้ม + ฟ้าน้ำแข็ง + ขาว (ขอบขน) + งาช้าง · ไม่มีสีเขียวเลย (นับในภาพใหญ่แล้ว 0 จุด · ผลึกน้ำแข็ง ≈ RGB 167, 212, 245 ฟ้ามากกว่าเขียว · ผ้าน้ำเงิน ≈ 64, 83, 136) → ตัดพื้นเขียวได้ปลอดภัย

**บนชีตต้องระวัง** (ใส่ไว้ในพรอมต์ข้างล่างแล้ว):
- ภาพใหญ่ยิ้มเห็นฟัน + ท่าสู้อ้าปากคำราม → ภาพยืนปากปิด สีหน้ามั่นใจ (ภาพหน้าตรงบนชีตปากปิดอยู่แล้ว)
- ห่วงที่งา: ภาพใหญ่มี 2 ห่วง ภาพหมุนรอบตัวเหลือห่วงเดียว → พรอมต์ใช้ **2 ห่วง** ตามภาพใหญ่ (= ภาพหน้าเลือกตัว)
- ภาพใหญ่ชนหมัดกันหน้าอก น้ำแข็งแตกกระจาย → ภาพยืนให้หมัดห้อยข้างตัว ไม่มีเอฟเฟกต์
- ภาพหลังบนชีตมีผลึกฟ้าโผล่ที่บ่าขวาด้วย (ไม่ตรงกับภาพหน้า) → พรอมต์บอกฝั่งของเกราะบ่า / ผ้าน้ำเงินทุกมุม (มุมเฉียงหลังหันขวา = เห็นข้างขวาของตัว → ผ้าน้ำเงินอยู่บ่าใกล้ทางขวาภาพ เกราะบ่าอยู่บ่าไกลทางซ้าย)
- ท่าสู้มีกำแพงเหล็ก หินแตก น้ำแข็งพุ่ง ประกายไฟ → ภาพยืนห้ามเอฟเฟกต์ (ใส่ด้วยโค้ดในเกม)
- ถุงมือใหญ่ แผงขนฟู ตัวกว้างมาก → สั่งให้อยู่ในกรอบหมด มีพื้นเขียวเหลือรอบตัว
- หัวเข็มขัด: พรอมต์ออกแบบสั่งกลม แต่วาดออกมาสี่เหลี่ยม → ใช้สี่เหลี่ยมตามภาพ · รอยบิ่นที่หูตามพรอมต์ออกแบบไม่ได้วาด → ไม่ใส่

### ขั้น 1 — ภาพยืน 5 มุม ภาพละมุม พื้นเขียว · ✓ มาแล้ว 2026-11-24 21:48
เจ้าของส่ง 5 ภาพ (ไม่มีข้อความ) → `assets/heroes/rhino/view_S|SE|E|NE|N.webp` (1254² หันขวาทุกภาพ ตัวสูง 1197–1209 px ต่างกัน 1 %) · ตรงตามพรอมต์: ไม่มีสีเขียวบนตัว (จุดเขียวในตัวเป็นช่องพื้นหลังจริง) · ผ้าคลุมไหล่ / เกราะบ่าอยู่ฝั่งถูกทุกมุม · งาหน้ามีห่วง 2 วงทุกมุม · ยิ้มมั่นใจปากปิด · มุมเฉียงหลังไม่เห็นตา เห็นข้างจมูก + รูจมูก + งา · มุมหลังแผงขนคลุมหลังถึงเข็มขัด หางพู่ห้อยกลาง · พรอมต์ข้างล่างเก็บไว้ใช้ซ่อมภาพ
วิธีใช้:
1. ส่งต่อในแชต ChatGPT เดิมที่เจนชีตนี้ (มันจำตัวได้) แนบชีตไปกับพรอมต์ 0 อีกครั้ง · ถ้าเปิดแชตใหม่ แนบชีต + ภาพปกแคมป์ไฟ (`keyart_campfire_ld5.jpg`)
2. ส่งพรอมต์ 0 → รอมันตอบ ready
3. ส่งภาพ 1–5 ทีละข้อความ (ข้อความละ 1 ภาพ)
4. ครบแล้วส่ง 5 ภาพมาให้ผม

ทำไมแยกภาพละมุม: ภาพใหญ่ = รายละเอียดชัดในคลิป (480p) · ทุกภาพท่ายืนเดียวกัน ขนาดเท่ากัน · บอกว่าเกราะบ่า ผ้าน้ำเงิน หาง ต้องอยู่ฝั่งไหนของภาพ · มุมไหนหันซ้ายมาไม่ต้องแก้ ผมกลับด้านให้

แก้ภาพ (ต่อท้ายแล้วส่ง):
- หันผิดทาง → `Redo picture 2: he must face the RIGHT side of the picture.`
- มุมหลังเห็นหน้า → `Redo picture 4: turn him further away, we must not see his eyes or his face.`
- ขนาดไม่เท่ากัน → `Redo picture 3: draw him the same size as in picture 1.`
- มีหลายตัว → `Redo picture 1: only ONE rhino in the picture, nothing else.`
- เกราะบ่ากับผ้าน้ำเงินสลับข้าง (มุมหน้า) → `Redo picture 1: the blue cloth with the white fur must be on the shoulder on the LEFT side of the picture and the iron pauldron with the ice crystal on the RIGHT side.`
- ถุงมือเล็กลง / หายไปข้างหนึ่ง → `Redo picture 3: keep both huge gauntlets exactly as big as on the sheet; the near one must be fully visible.`
- งาเหลือห่วงเดียว → `Redo picture 2: the long front horn has TWO dark-iron rings with silver zigzag runes, as in the big pose on the sheet.`
- มีเอฟเฟกต์ติดมา → `Redo picture 2: no frost, no ice shards, no glow, no rocks, no sparkles — just the rhino standing.`
- ยิ้มเห็นฟัน / คำราม → `Redo picture 1: his mouth closed, a calm, confident look.`
- งา / แผงขน / ถุงมือล้นกรอบ → `Redo picture 3: draw him a little smaller so both horns, his whole mane and both gauntlets fit inside the picture.`
- แก้แค่บางส่วน → ใช้แปรงเลือกเฉพาะจุดใน ChatGPT (สั่งแก้ทั้งภาพ มันจะวาดใหม่หมด)

#### พรอมต์ 0 — กติกา (ส่งครั้งเดียว พร้อมแนบชีต)
```
Next I need this same hero — the woolly rhino warrior on the attached sheet — drawn standing in 5 directions for my game's animation, ONE picture per message. Do not draw anything yet: reply only "ready", then draw one picture each time I send a direction.

Every picture:
- ONE rhino alone in a square picture on a plain flat pure green background (#00FF00): no gradient, no floor, no shadow under him, no other views, no text, no logo, no watermark.
- exactly the same character and drawing style as the sheet, nothing added and nothing left out: friendly hand-painted chibi cartoon, thick clean dark-brown outlines, flat cel shading with 2–3 tones. A huge, heavy woolly rhino with warm grey skin and a long rhino head: a long curved ivory front horn with TWO dark-iron rings carved with silver zigzag runes, a short ivory second horn just behind it, small upright grey ears with pinkish-grey insides, small fierce frost-blue eyes under heavy dark brows, and frost-blue war paint — two stacked chevron stripes — on each cheek. A thick shaggy dark chestnut-brown wool mane covers the top of his head, his neck and the hump of his shoulders and hangs down his back to the waist like a cape; shaggy chestnut fur on his upper arms. Dark leather harness straps cross in an X over his grey chest, with copper rivets and a round copper medallion carved with a rhino head in the middle. On his RIGHT shoulder a short deep glacier-blue cloth capelet with a white fur trim; on his LEFT shoulder a big angular dark-iron pauldron with a pale ice-blue crystal set in it. A dark leather belt with a square copper buckle. A deep glacier-blue tunic skirt that ends above the knee, with an angular copper zigzag border. On BOTH hands huge dark-iron gauntlets, almost as big as his head, with wide copper bands and copper rivets around the forearms, iron spike plates over the knuckles and a blocky pale ice-blue crystal on every knuckle. Chestnut fur wraps on his shins above dark-iron greaves with copper straps, and heavy iron-shod boots with big rounded toe caps and copper rivets. A thin grey tail with a chestnut fur tuft at its tip.
- no weapon and no shield: his two gauntlets are his weapons, and both are visible in every picture.
- the same standing pose in every picture: standing tall and heavy in a firm, wide stance, feet about shoulder-width apart, both huge gauntlets hanging at his sides with the fists loosely closed and the crystal knuckles facing forward; a calm, confident look with his mouth closed (no grin, no roar).
- the same size in every picture: from the tip of his front horn to the soles of his boots he fills about three quarters of the picture's height, his feet near the bottom with a small margin; both horns, his whole mane, both gauntlets and his tail inside the picture with green space all round.
- no green anywhere on him: the blues are glacier blue and pale ice blue. The crystals look exactly as on the sheet but give off no light around them. No frost burst, no ice shards, no glow, no rocks, no sparkles, no motion lines, no effects.
```

#### ภาพ 1 — หน้าตรง
```
Picture 1 — FRONT view: he faces straight toward us, like the front view on the sheet. The blue capelet with its white fur trim is on the shoulder on the LEFT side of the picture, and the dark-iron pauldron with the ice crystal on the shoulder on the RIGHT side of the picture. His long front horn points up in the middle of his face with the two dark-iron rings on it. Both huge gauntlets hang at his sides, one on each side of the picture, the crystal knuckles toward us.
```

#### ภาพ 2 — เฉียงหน้า หันขวา
```
Picture 2 — FRONT THREE-QUARTER view: he is turned toward the RIGHT side of the picture, facing down and to the right, like the big pose on the sheet but standing calmly. We see his face with his horns pointing to the right and mostly his right side: the blue capelet with its white fur trim on his near shoulder, on the LEFT side of the picture, and the dark-iron pauldron with the ice crystal on his far shoulder, on the right. His near gauntlet hangs at his side on the left of the picture; his far gauntlet hangs on the right, partly behind his body. His tail hangs out behind him on the left side of the picture.
```

#### ภาพ 3 — ข้าง หันขวา
```
Picture 3 — SIDE view facing RIGHT, like the side view on the sheet: his horns point to the right edge of the picture and we see his right side — one ear, one eye, the blue war paint on that cheek, both horns with the two dark-iron rings on the front horn, and the blue capelet with its white fur trim on his near shoulder; his shaggy mane hangs down his back on the left. His near gauntlet hangs at his side, fully visible; his far gauntlet is mostly hidden behind his body. His tail hangs down behind him on the left side of the picture.
```

#### ภาพ 4 — เฉียงหลัง หันขวา
```
Picture 4 — BACK THREE-QUARTER view: he is turned away from us, facing up and to the RIGHT. We see mostly his back: his shaggy chestnut mane hanging down his back to the waist, the back of his head with both ears, and the tips of his horns pointing to the right; of his face only the edge of his snout on the right — not his eyes and not his face. The blue capelet with its white fur trim is on his near shoulder, on the RIGHT side of the picture; the dark-iron pauldron with the ice crystal shows on his far shoulder, on the left side, partly hidden by his mane. His near gauntlet hangs on the right side of the picture, his far gauntlet on the left, partly behind his body. His tail hangs down behind him.
```

#### ภาพ 5 — หลัง
```
Picture 5 — BACK view: his back faces us, like the back view on the sheet: the back of his head with both ears and the tips of his horns, his shaggy chestnut mane hanging down his back to the waist, the back of the harness and the belt, and the back of the blue tunic skirt; no face. The dark-iron pauldron with the ice crystal is on the shoulder on the LEFT side of the picture and the blue capelet with its white fur trim on the shoulder on the RIGHT side. Both huge gauntlets hang at his sides, one on each side of the picture. His tail hangs down behind him.
```

### ขั้น 2 — ภาพตั้งต้น + คลิปท่า 20 ตัว · ภาพตั้งต้นส่งแล้ว 2026-11-24 → รอคลิป
ภาพ 5 มุมมาแล้ว → ตัดภาพตั้งต้น `rhino_1_S.png … rhino_5_N.png` (`tools/dir8cut.py startv`, คำสั่งอยู่ใน `RHINO_CLIP_PROMPTS_TH.md`) ส่งพร้อม `RHINO_CLIP_PROMPTS_TH.md` (คลิป 20 ตัว ยืน · เดิน · ทุบสองหมัด · ชูสองหมัด × 5 ทิศ สร้างจาก `python3 tools/clip_prompts.py rhino`)

### ขั้น 3 เป็นต้นไป
3. **สไปร์ทจากคลิป** — `cliphero.py` → เขียนทับ `assets_rhino.js` (prefix RH เดิม ใช้กับแรดตัวเดียว) · เวลาเฟรมเท่าเดิมทุกทิศ (ตารางอยู่ในหัวข้อ 'เลือกแล้วทำอะไรต่อ' ข้างบน + ท้าย `RHINO_CLIP_PROMPTS_TH.md`) · ได้คลิปหันหลัง N ครั้งแรก · ตัวยืนสูงบนจอเท่าเดิม (วัด `CHAR_SCALE.rhino` ใหม่)
4. **ของที่ผูกกับสไปร์ท** — จุดถุงมือทุกเฟรมของท่าทุบกับท่าชู (sockets) · หน้า HUD (ตัดหัวจาก view_S ผ่าน window.HUD_FACE — `RH_PORTRAIT` เดิมหายไปตอนเขียนทับ atlas) · ท่านั่ง (`hero_sit.js`)
5. **ทีหลัง** — ไอคอน 53 + ex_ 11 + ผังสกิล 4 ภาพ + ภาพเอฟเฟกต์ที่มีถุงมือ / ตัวแรดเดิม (r01 r02, colossus-spirit, worldbreaker) + ภาพหน้าโหลด ld1 ld7 ld8
