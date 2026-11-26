# เอฟเฟกต์สกิลฮิปโป v3 — Taweret's Guardian (โค้ด VFX + ภาพวาดที่เข้ากับลุคใหม่)

คำขอเจ้าของ 2026-11-25 22:29: "ทำเอฟเฟคสกิลฮิปโป … ของฮิปโปมันมีเอฟเฟคสกิลที่เจนมาค่อนข้างเยอะ เลือกใช้เอา หรือถ้าจะให้เจนใหม่ก็ส่งพร้อมมา"

ไฟล์: `hippo_art.js` (ภาพเวกเตอร์วาดด้วยโค้ด) · `hippo_vfx.js` (เอฟเฟกต์ทั้งหมด) · ทั้งคู่ใช้ชุดเครื่องมือ `fxlib.js` (โหลดเฉพาะตอนเล่นฮิปโป)
ลุคเดิมทั้งชุด = `?vfx3=0` · ตัวเลขเกมและจังหวะโดนทุกครั้งไม่เปลี่ยน (ตรวจแล้ว ดูท้ายไฟล์)

## แนวภาพ
- **สาย A "Taweret's Guardian"** — คทาสำริด + ทองของเทพีทาเวเรต + พื้นแตกใต้พุงที่ตกจากฟ้า (เศษหิน ฝุ่น รอยร้าว วงทอง)
- **สาย B "Nile Flood Priest"** — โคลน (ก้อนโคลนเงา หยดโคลน มงกุฎโคลนกระเซ็น คราบโคลนบนพื้น) + น้ำไนล์ (คลื่น น้ำพุ น้ำท่วม) + ดอกบัวชมพู
- **สาย C** ตามคอลัมน์ — Chomp = ปากฮิปโปงับ (ภาพหน้าตรง ขากรรไกรบน-ล่างงับเข้าหากัน) · Submerge = หู ตา จมูกฮิปโปโผล่เหนือโคลนลอยไปหาเป้า · Meteor = พุงลุกเป็นไฟ · โถฮาปิ
- สีของฮีโร่: ทอง + เขียวหัวเป็ดของผ้าคลุม (เงาตามตัวตอนกระโดดเปลี่ยนจากม่วงอ่อนเป็นเขียวหัวเป็ด) · ไม่มีจุดกลมๆ เศษทุกชิ้นมีรูป (โคลน หยดน้ำ กลีบบัว ก้อนหิน ชิ้นแตงโม เศษโถ)

## ภาพวาดที่เลือกใช้ต่อ (assets/fx/hippo)
| ภาพ | ใช้กับ | หมายเหตุ |
|---|---|---|
| h02 ลูกโคลน | Mud Ball | ลูกที่พุ่งไป หันตามทางบิน (เป็นกระสุน หมุนตามทางได้) |
| h03 บ่อโคลน | ทุกบ่อโคลน | ใหญ่ 2.15 เท่ารัศมี (เดิม 2.3) เด้งขึ้นตอนเกิด มีฟองโคลนผุดแตก |
| h05 / h06 คลื่น | Nile Wave / Wrath / คลื่น 8 ทิศของ ULT B | **ไม่หมุนภาพแล้ว** ใช้ตอนคลื่นวิ่งข้างจอ (กลับซ้ายขวาตามทาง) · ตอนวิ่งเข้าหา/ออกจากกล้องเป็นคลื่นโค้ด 3 มิติแทน มีจางผสมช่วงเฉียง |
| h07 น้ำพุ | Geyser · น้ำพุของ ULT B · โถฮาปิแตก | + ฐานน้ำกระเซ็น วงน้ำ ไอน้ำ ฝนหยดน้ำตกกลับ |
| h08 ดอกบัว | ดอกบัวบนบ่อ (Lotus Bloom) | ลอยขึ้นลง มีแสงชมพูใต้ดอก (ขึ้นบนหล่มทรายด้วย) |
| h09 บัวแตก | Lotus Storm | ย่อเหลือ 1.8 เท่ารัศมี + กลีบบัวปลิว วงชมพู ฟื้น HP |
| h11 แตงโม | Feast | ลอยเหนือหัว แล้วถูกงับ แตกเป็นชิ้นแตงโม + น้ำแดง + บวกเขียว |
| h12 วังวน | Gulp / Gobble Up | หมุนดูดหดเข้าปาก ขนาดพอดีตัว (เดิมใหญ่ทั้งจอ) + ลมดูดเข้าปาก |
| h15 โดมทาเวเรต | Taweret's Ward | ย่อตามขนาดฮีโร่ใหม่ · โดนตีแล้วโดมสว่างวาบ |
| h16 ออร่า | Behemoth Drop | ย่อตามขนาดฮีโร่ |
| h17 ทะเล | The Great Inundation | + กระแสน้ำวน คลื่นวง ประกายน้ำ คลื่นรอบตัวตอนว่ายในทะเล |
| h18 โถฮาปิ | Hapi's Jar | ตกจากฟ้าลงพื้นแล้วเด้ง อยู่ในชั้นเรียงลึก (เดินผ่านหน้า/หลังได้ถูก) · หมดเวลาโถแตกเป็นเศษน้ำเงินทอง |
| cat/k_crater พื้นแตก | ท่าทับใหญ่ (Sky Belly, Double Drop, Mountain Drop, Meteor, Behemoth) | ภาพพื้นแตกเป็นแผ่นหินของเจ้าของ (ไม่มีลาวา) |

**ไม่ใช้แล้วในลุคใหม่** (ยังอยู่ให้ `?vfx3=0`): h01 เศษโคลน, h04 ดาวโดนตี, h13 ควันเรอ (ภาพข้างถูกหมุน), h14 เกลียวหาว, cat/09 หลุมลาวา, cat/25 วงช็อก, cat/23 ฝุ่น, cat/22 ดาวตี

## ทีละสกิล (เห็นอะไร · จังหวะ)
| สกิล | ลุคใหม่ |
|---|---|
| ตีปกติ Hippo Combo | รอยคทาสำริดฟาดจากเหนือไหล่ลงพื้นด้านหน้า ปลายรอยถึงพื้นพอดีเฟรมโดน · ประกายสำริดที่เป้า + ฝุ่นตรงจุดคทากระทบ · ท่าปิดคอมโบ = ท่าทับเล็ก |
| Waddle Rush | รอยเท้าฮิปโปบนพื้น เส้นความเร็วสองข้าง ฝุ่นที่เท้า โดนชน = ประกายสำริด |
| Yawn Threat | ปากฮิปโปหน้าตรง (โปร่งแสง) อ้ากว้างช้าๆ แล้วหุบ · คลื่นเสียงชมพูวิ่งออกเป็นพัดตามรัศมีจริง 150 · พัดชมพูบนพื้น · เครื่องหมายโกรธ 💢 เด้งบนหัวศัตรูที่โดนยั่ว |
| Nap | วงฟ้าอ่อนใต้ตัว · Z ลอยขึ้นจากหัว · ฟองจมูกพองยุบ · ตื่นแล้วฟองแตก |
| Feast | ร่ายพลังเขียวที่คทา · แตงโม (ภาพ) ลอยเหนือหัว → งับ → ชิ้นแตงโมกระเด็น น้ำแดง บวกเขียว วงเขียว |
| Blood Sweat (ติดตัว) | ฟื้นทุก 5 วิ = หยดเหงื่อแดงไหล · ปัดดีบัฟ = หยดแดงกระจาย + วงแดง |
| Belly Flop (+Triple Flop) | เงาเขียวหัวเป็ดตามตัวตอนกระโดด (บางลง) · ลงพื้น = รอยร้าว วงฝุ่น วงสำริด ฝุ่น หินกระเด็น · บนบ่อโคลน = โคลนกระเซ็น |
| Gulp | ลมดูดเขียวหัวเป็ดพุ่งเข้าปากตลอดช่วงร่าย (ท่าอ้าปากของสไปร์ท) · ปล่อย = วังวน h12 หมุนหดเข้าปาก หินฝุ่นถูกดูด เส้นลากทองจากที่ศัตรูยืนมาถึงปาก · ระหว่างอม = ดาวหมุนบนหัว + วงทองใต้ตัว + "อม!" |
| Burp Cannon | ก้อนแก๊สครีมพุ่งเป็นพัด + เส้นลมขาว + วงที่ปาก · กระสุนเป็นลูกแก๊สหมุนทิ้งควันตามทาง (ไม่มีหยดน้ำแล้ว) |
| Bounce Slam | ลงพื้นแต่ละครั้ง = ท่าทับ · ระหว่างเด้ง = เส้นประโค้งเขียวหัวเป็ดจากจุดเดิมไปจุดใหม่ |
| Belly Bounce (ติดตัว) | ครบจำนวนโดนตี = วงชมพู + วงเขียวขยาย เส้นผลักไปหาคนตี |
| Taweret's Ward | วงทาเวเรต (ดอกบัว 16 กลีบ อังค์ 4 ทิศ ดวงอาทิตย์กลาง) ใต้ตัว วงทองหดเข้า อังค์ทองลอยขึ้น · โดม h15 · โดนตี = โดมวาบ + ประกายทองฝั่งที่โดน |
| Ground Pound | ท่าทับรอบตัว + รอยเท้า 2 ข้าง + วงฝุ่นที่ขอบรัศมีจริง 160 |
| Sky Belly | ระหว่างหายไปบนฟ้า = เงามืดใต้จุดตกโตขึ้นเรื่อยๆ + วงเส้นประทองรัศมีจริง · ก่อนถึงพื้น = เส้นความเร็วขาวตกลงมา · ลงพื้น = พื้นแตก k_crater + รอยร้าว วง ฝุ่น หิน แสงวาบ |
| Double Drop | ท่าทับใหญ่ซ้ำจุดเดิม + รอยร้าวเพิ่ม (พื้นแตกภาพวาดอีกชั้น) |
| Rolling Hippo | รอยหมุนเป็นวงล้อรอบตัว (ระนาบตั้ง ตามทิศกลิ้ง) ฝุ่นที่เท้า หินกระเด็นข้างหลัง รอยไถยาวบนพื้น · จบ = ท่าทับเล็ก |
| Mountain Drop | ตอนเผาความอิ่ม = เปลวไฟรอบตัว วงไฟ ถ่าน · บนฟ้า = เงาใหญ่ + วงเส้นประทอง · ก่อนตก = เส้นความเร็ว + หินร่วงจากฟ้า · ลงพื้น = พื้นแตกใหญ่ + แท่งหินแหลม 9 แท่งผุดรอบ + ฝุ่นตลบ + วงทอง |
| Behemoth Drop (ULT A) | ช่วงร่าย = วงทาเวเรตทองหมุนก่อตัวใต้ตัว + แสงทองดูดเข้า · ตอนโต = ท่าทับใหญ่ + เสาแสงทอง + วงทาเวเรต · แผ่นดินไหว 6 ครั้ง = วงฝุ่นหนัก + วงทอง + รอยร้าว + ฝุ่นที่ขอบ · ระหว่างยักษ์ = วงทาเวเรตจางๆ ใต้ตัว + ประกายทองลอย + ออร่า h16 · จบ "ทับยักษ์!" = พื้นแตกใหญ่ เสาแสงทองใหญ่ แท่งหิน 12 แท่ง |
| Mud Ball | ร่าย = ก้อนโคลนวนรอบปลายคทา · ลูกโคลน h02 พุ่ง หยดโคลนตามทาง · ถึง = มงกุฎโคลน คราบโคลนบนพื้น โคลนกระเด็น บ่อ h03 เด้งเกิด |
| Mud Wallow / Mud Splash | บ่อใหญ่ + วงโคลน + โคลนพุ่งขึ้นรอบตัว · Splash = มงกุฎโคลน 6 จุดรอบตัว โคลนกระเด็นออก |
| Nile Wave / Wrath of the Nile | คลื่นวิ่งข้างจอ = ภาพคลื่น h05 / h06 (ใหญ่ เป็นน้ำปนโคลน) · วิ่งเข้าหา/ออกจากกล้อง = คลื่นโค้ด 3 มิติ (สันคลื่นม้วน ฟองขาวบนสัน ฟองที่ฐาน ฟองไหลบนหลังคลื่น) · ทางที่ผ่านพื้นเปียกเป็นแถบ · ละอองน้ำจากสันตลอดทาง · ตอนออกตัวมีน้ำกระเซ็นที่ฮิปโป |
| Geyser | น้ำพุภาพ h07 + ฐานน้ำกระเซ็น วงน้ำตามรัศมี ไอน้ำ หยดน้ำตกกลับ (ในบ่อ = มีโคลนปน) |
| Hapi's Bounty | วงไนล์สีเขียวใต้ตัว หยดน้ำกับกลีบบัวหมุนขึ้นรอบตัว บวกเขียว · ระหว่างฟื้น = หยดน้ำ 3 เม็ดโคจร บวกลอยขึ้น (ยืนในโคลน = มีดอกบัวลอยด้วย) |
| Lotus Bloom / Lotus Storm | บัวผุดในบ่อ (วงชมพู กลีบบัวปลิว แสง) · กลีบที่ยิงเป็นกลีบบัวมีหางชมพู · Storm = ภาพ h09 + กลีบปลิว วงชมพู บวกเขียว |
| Quicksand Mire | วงทรายวนดูดเข้ากลางหมุนตลอด ขอบเส้นประ กลางมืด · เม็ดทรายวนเข้ากลาง ฝุ่นทรายพ่นเป็นระยะ · โดน = ฝุ่นทราย |
| The Great Inundation (ULT B) | ช่วงร่าย = วงไนล์ก่อตัว หยดน้ำวนขึ้น · ปล่อย = เสาน้ำพุ่งที่ตัว วงน้ำถึงขอบ 300 · พื้นทะเล h17 + กระแสน้ำวน คลื่นวงเล็กผุด ประกาย · น้ำพุใส่ศัตรูทุกวิ · จบ = คลื่น 8 ทิศ + เสาน้ำกลาง + วงน้ำใหญ่ |
| Chomp Chomp | ทุกครั้งที่งับ ปากฮิปโปหน้าตรงอ้าขึ้นก่อน แล้วงับปิดพอดีเฟรมโดน + ประกายขาว ปากสั่นนิดหน่อย |
| Gobble Up | ลมดูดตลอดช่วงร่าย · วังวน h12 ใหญ่กว่า Gulp + วงทองหดเข้า + เส้นลากทองจากศัตรูทุกตัวที่ถูกดูด |
| Submerge | ดำลง = โคลนกระเซ็น · ระหว่างหาย = หัวฮิปโป (หู ตา จมูก) โผล่เหนือโคลนลอยไปหาเป้าช้าๆ มีวงน้ำ + รอยคลื่น V ตามหลัง · ก่อนโผล่จมหาย · โผล่ = เสาโคลนพุ่ง มงกุฎโคลน คราบโคลน + ท่าทับเล็ก |
| Meteor Belly | ระหว่างกระโดด = ไฟลุกตามตัว + แสงไฟที่พุง · ลงพื้น = พื้นแตก + เปลวไฟรอบ วงไฟ ถ่าน · ครั้งที่ 3 (เผาความอิ่ม) = เสาไฟ + เปลวไฟมากขึ้น |
| Hapi's Jar | โถตกลงจากฟ้าเด้งกับพื้น น้ำกระเซ็น · วงไนล์หมุนช้า น้ำสีฟ้าในวง วงน้ำเล็กผุด · ยืนในวง = บวกลอย · หมดเวลา = โถแตกเป็นเศษน้ำเงินทอง + น้ำพุ h07 |
| ทุกท่าร่าย (buff) | ธาตุของสกิลรวมตัวที่ปลายคทาที่ชูขึ้น (ทอง / น้ำ / โคลน / ทราย / บัว / แก๊ส / เขียว) แล้ววาบตอนปล่อย |
| เกจความอิ่ม | แถบโค้งมน สีส้ม→ทอง ขีดทุก 20 · เต็มแล้วเรืองทอง · "อิ่ม N" มีขอบเข้ม |
| สกิลเสริม ex_ | วงทอง + อังค์ทองเล็ก |
| โล่ Taweret's Embrace | โล่ทอง 2 ใบโคจร + วงเส้นประทอง |

## ทำงานยังไง (สำหรับแชทถัดไป)
- ห่อ `SKILLS[k].make` + `mkBasic` (เพิ่ม event ภาพอย่างเดียว ไม่ยุ่ง event เกม) · `pre(a, lead, f, T)` = เริ่มภาพก่อนเวลา T ให้จบพอดี (รอยคทา ปาก Chomp)
- ห่อ `hLand` (ภาพพื้นแตกตามชื่อสกิล `LANDX`; เกมยังสั่นจอ / หยุดเฟรม / แฟลชเหมือนเดิม), `hBehemothEnd`, `hSeaEnd`, `dashUpd` (เห็นทุกการกระโดด → `airFx`)
- แทน `hSplash` / `hDrops` / `hDust` (ภาพล้วน) · วาดใหม่ `HProj` / `HWave` / `HGround` / `HAura` / `HOverlay` (update ของเกมเดิมทุกตัว)
- `jgAfterHurt` ห่อ = ประกายโดนตามสกิล (`ELK`: น้ำ / โคลน / ทราย / บัว / แก๊ส / งับ / พุงเด้ง / ทับ / สำริด) · `jgAbsorb` ห่อ = พุงเด้ง โดมวาบ โล่
- `HCore.update` ห่อ = `watch()` คุมของค้าง (งีบ โล่ อม ยักษ์ ทะเล โถ ฟื้นฮาปิ บ่อโคลน) ให้อยู่ครบแม้เปลี่ยนแผนที่
- ปิดของเก่า: ภาพ HImg ที่ถูกแทน, HBit, GRing / Impact / Crack / StarCut และ emit กลมๆ ตอนโค้ดฮิปโปทำงาน · HitCrescents / PuffDust / Trail ปิดเสมอ · DText คงไว้
- คลื่นโค้ด 3 มิติ `waveWall` = โปรไฟล์คลื่น (หลัง → สัน → ปลายม้วน → หน้า) กวาดตามความกว้าง วาดเป็นตาข่ายสี่เหลี่ยมจากไกลมาใกล้ + ปิดหัวท้ายด้วยรูปโปรไฟล์
- ขนาดเอฟเฟกต์ตามตัวฮีโร่ = `BODY()` (72.5 × HERO_K × hSize: ใหญ่ขึ้นตามความอิ่ม / Behemoth)

## ตรวจแล้ว
- เวลาโดนทุกสกิลเทียบลุคเก่า (`FXSEED=7` + โดนแน่นอน, egyF1): เท่ากันทุกสกิล · ต่างเฉพาะติ๊กหล่มทราย ซึ่งลุคเก่ากับลุคเก่าเองก็ต่างกันระหว่างรอบ (เฟสนาฬิกา 0.25 วิของ HCore) — ยิงซ้ำแล้วตรงกัน
- `tools/qa/herosweep.py hippo` ไม่มี error · `leak.py` คงที่ (13 → 12 → 13) · `lostev.py` 0 · `combo.py` ไม่มี error (ที่ขึ้น "ไม่โดนดัมมี่" = ท่าที่ลงช้ากว่าหน้าต่าง 0.8 วิของเครื่องตรวจ)
- ร่ายทุกสกิลไม่มีคำเตือนจากชั้นเอฟเฟกต์ · ดูบนทราย (egyF1) ครบทุกสกิล + คลื่น 4 ทิศ
- เวลาต่อเฟรม (egyF1, ร่าย 6 ท่าที่ค้างนาน: โคลน บ่อ หล่ม โถ Behemoth น้ำท่วม, software canvas ในเครื่องทดสอบ): ใหม่ 95.6 ms · เก่า 95.8–97.2 ms = เท่ากัน (ชิ้นเอฟเฟกต์ในฉาก 46 vs 93)
- คลิป: `DSF=1.5 MAP=egyF1 python3 tools/fx/hpclip.py basic|a|b|c` · ภาพเฟรม: `HERO=hippo DSF=2 MAP=egyF1 python3 tools/fx/strip.py TAG keys …`

## ยังไม่ได้ทำ
- เอฟเฟกต์ของสกิลเสริม ex_ แยกแต่ละอัน (ตอนนี้วงทอง + อังค์)
- เช็กบนมือถือ · คำตัดสินของเจ้าของ
- ~~ภาพใหม่ที่เสนอ (ไม่บังคับ)~~ → ✓ ภาพเทพทั้งสองใส่เกมแล้ว 2026-11-26 (หัวข้อท้ายไฟล์)

## ภาพใหม่ (ไม่บังคับ) — ส่งพรอมต์ในแชท 2026-11-26
ตอนนี้อัลติทั้งสองใช้โค้ด + ภาพเดิมได้ครบแล้ว สองภาพนี้เพิ่ม 'ช่วงเทพมาช่วย' ให้อัลติ
แนบทุกครั้ง (แชต ChatGPT เดียวกัน): ภาพปกแคมป์ไฟ `assets/loading/ld5.webp` (สไตล์) + ชีตฮิปโป `assets/heroes/hippo/sheet_taweret.webp` (สี / ลาย) · ภาพ 2 แนบโถ `assets/fx/hippo/h18_jar.webp` เพิ่ม
พื้นหลังโปร่งใส ไม่มีแสงรอบตัว (โค้ดใส่แสงทอง / ฟ้าเอง แบบหัวอนูบิส) · ถ้าออกมาเป็นลายตารางหมากรุก ตัดด้วย `tools/checker_key.py`

| # | ไฟล์ | สกิล | วางในเกม (ตอนต่อโค้ด) |
|---|---|---|---|
| 1 | hp_taweret | Behemoth Drop (อัลติ A) | เริ่มร่าย (.05) ผุดจากพื้นหลังตัวฮีโร่ ยกอุ้งตีนค้าง → จังหวะ tP (ตัวยักษ์ลงพื้น) ตบลง + แสงทองวาบ แล้วจางหายเข้าตัว · `hBehemothEnd` (ทับยักษ์ตอนจบ) ผุดอีกครั้งสั้น ๆ · สูง ~2 เท่าฮีโร่ยักษ์ แสงทองรอบขอบ (`halo` แบบ anubis_vfx.js) ขอบล่างจางลงพื้น |
| 2 | hp_hapi | The Great Inundation (อัลติ B) | ผุดจากน้ำฝั่งไกลของวง (หลังฮีโร่บนจอ) ตอนเริ่มร่าย → tP เอียงโถ น้ำโค้ด 2 สาย (Gush / ริบบิ้น) ไหลจากปากโถลงทะเล ~1.5 วิ แล้วจมกลับ · `hSeaEnd` ผุดอีกครั้งเทแรงตอนคลื่นยักษ์ · ต้องวัดตำแหน่งปากโถในภาพตอนตัด |

### 1 · hp_taweret — วิญญาณเทพีทาเวเรต
```
Friendly hand-painted chibi cartoon game effect matching the attached campfire key art: thick clean dark-brown outlines, cel shading with 2–3 flat tones, soft cartoon glow, bright and warm. Not realistic, not painterly smoke, not 3D. ONE single effect only, centered, transparent PNG background, generous empty space on every side, no text, no logo, no watermark.
Effect object: the giant guardian spirit of Taweret, the Egyptian mother goddess who protects the hippo hero in the attached character sheet. The hero himself is NOT in the picture. Only her upper body from the waist up: a mighty but kind hippo goddess standing upright, blue-grey hippo skin, a cream muzzle and a big round cream belly, small round ears with pink insides, rosy cheeks, two small rounded cream tusks, warm brown eyes and a proud protective smile. On her head a gold crown: a gold sun disc between two curved cream horns, with two tall straight gold plumes behind it. A long black Egyptian wig falls behind her shoulders, with gold bands at the ends. A wide gold collar with turquoise and lapis-blue beads on her chest. Her arms end in big golden lion paws, both raised high above her head with the paws open, as if about to slam the ground. A teal crocodile-scale cape with a row of cream spikes hangs from her shoulders down her back. A wide gold belt at her waist; the bottom edge of the figure is the straight bottom edge of this belt. Solid and opaque with a crisp outline: no legs, no ground, no flames, no smoke, no sparkles, no glow halo around her.
Palette: blue-grey, cream, gold, teal, turquoise, lapis blue, black.
VIEW: seen from the front, facing the viewer, upright, the straight belt edge at the bottom. Tall portrait image.
```

### 2 · hp_hapi — เทพฮาปิเทน้ำไนล์
```
Friendly hand-painted chibi cartoon game effect matching the attached campfire key art: thick clean dark-brown outlines, cel shading with 2–3 flat tones, soft cartoon glow, bright and warm. Not realistic, not painterly smoke, not 3D. ONE single effect only, centered, transparent PNG background, generous empty space on every side, no text, no logo, no watermark.
Effect object: the giant spirit of Hapi, the jolly Egyptian god of the Nile flood, who answers the hippo hero in the attached character sheet. The hero himself is NOT in the picture. Only his upper body from the waist up: a big friendly plump god with a huge round belly and a cheerful laughing face, sky-blue skin, a short curled black beard, a black Egyptian wig with gold bands. On his head a crown of blue lotus flowers and gold papyrus fans. A wide gold collar with turquoise beads. His arms are held out to the left and right, and in each hand he holds a big round Nile water jar like the attached jar picture (lapis-blue body, gold rim and bands, a gold winged ankh and a white lotus on the side), but without its bird handles. Both jars are tipped outward, their mouths pointing down and away from his body, as if pouring, but NO water comes out (the game adds the water). The bottom edge of the figure is the straight top edge of his white linen waist wrap with a gold border. Solid and opaque with a crisp outline: no water, no splashes, no ground, no flames, no sparkles, no glow halo around him.
Palette: sky blue, gold, lapis blue, turquoise, white linen, black, blue lotus.
VIEW: seen from the front, facing the viewer, upright, the straight waist edge at the bottom. Square image.
```

## ภาพเทพ — ใส่เกมแล้ว (2026-11-26)

เจ้าของส่งภาพ 2 ภาพ 06:09 (PNG โปร่งใสจริง) → `python3 -I tools/fx/hippo_pics.py TAWERET.png HAPI.png [preview=PNG]`
- ตัดขอบ + เผื่อ 6 px ย่อ 0.5 → `assets/fx/hippo/hp_taweret.webp` (570×664, ~96 KB) · `hp_hapi.webp` (624×610, ~90 KB)
- เครื่องมือพิมพ์ตาราง `GOD` (หน่วยพิกเซลของภาพที่ย่อแล้ว) → คัดลอกไว้ใน hippo_vfx.js หัวข้อ 7b
  - taweret.foot = กลางเข็มขัดเหนือขอบล่าง = เส้นพื้นที่เธอผุดขึ้นมา
  - hapi.foot = เส้นน้ำพาดผ้านุ่งช่วงเอว (ต่ำกว่านี้อยู่ใต้น้ำ) · jarL / jarR = ปากโถช่วงล่างกลาง (หาใหม่ทุกครั้งด้วยการเติมสีน้ำตาลเข้มในปากโถ) · jw = ความกว้างปากโถ
- ภาพเทพไม่โดนสีเจมธาตุ (`__gt '-'`) · สายน้ำ / แสง / ฝุ่นรอบ ๆ ยังเปลี่ยนสีตามเจม
- `?hppic=0` = ไม่มีภาพเทพ (หน้าตา v3 ก่อนหน้านี้)

**Behemoth Drop — ทาเวเรต** (`taweret()` สูง 170 วาดหลังแถวฮีโร่ ตามตัวฮีโร่)
- เริ่มร่าย: ผุดขึ้นจากพื้นหลังตัว (ตัดที่เส้นพื้น + แอ่งแสงทองกลบรอยตัด ฝุ่นรอบฐาน) ใช้เวลา min(0.45, ×0.7 ของเวลาร่าย) ยกอุ้งตีนค้าง หายใจ / โยกเบา ๆ
- จังหวะ tP (ฮิปโปกลายร่างยักษ์ลงพื้น): ตบลง (ยุบ + โน้มลง + วาบทอง + วงทองที่ฐาน) → 0.6 วิ ย่อลงหาตัวฮีโร่ จางหาย แสงทองไหลเข้าตัว
- เสาแสงทองเดิมของ v3 ไม่วาดเมื่อมีภาพเธอ (เคยบังเธอ)
- ตอนบัฟจะหมด (เหลือ 0.42 วิ): ผุดกลับมาเร็ว ๆ → ตบลงพร้อมท่าทับยักษ์ตอนจบ (ตอนบัฟหมดจริง) → จมกลับลงพื้น

**The Great Inundation — ฮาปิ** (`hapi()` กว้าง 176 ยืนในน้ำหลังฮีโร่ 40 px)
- เริ่มร่าย: เสาน้ำพุ่งข้างหลัง (ไม่บังตัว) + แอ่งน้ำใต้ตัว → ผุดขึ้นจากน้ำ (ตัดที่เส้นน้ำ ฟองขาวรอบเอว: ครึ่งหลังวาดก่อนตัว ครึ่งหน้าวาดทับ + วงระลอก)
- ก่อน tP 0.18 วิ: เทน้ำจากโถทั้งสอง (`pourRibbon`: ขอบน้ำเงินเข้ม เนื้อฟ้าไล่สี แถบขาวไหลลง ฟองตรงจุดตก) + มงกุฎน้ำ / วงระลอก / หยดน้ำตรงจุดตก → น้ำท่วมของเกมเกิดตรงนั้นพอดี
- เทต่อ 1.5 วิ หัวเราะโยกตัว แล้วจมกลับลงน้ำ
- ตอนน้ำท่วมจะหมด (เหลือ 0.45 วิ): ผุดกลับมาที่กลางวง เทแรง (สายหนาขึ้น มงกุฎถี่ขึ้น) → **คลื่นยักษ์ตอนจบเปลี่ยนเป็นคลื่นวงกลมวงเดียว** (`ringWave`)
  - คลื่น 8 ลูกของ `hSeaEnd` เป็นแค่ภาพ (mult 0 + hits มีศัตรูครบแล้ว ไม่ทำดาเมจ) ดาเมจจริงคือทุกตัวในรัศมีโดนพร้อมกัน → วงกลมเต็มวงตรงกับเกมกว่า
  - คลื่น 8 ลูกยังวิ่งอยู่ (ไม่ได้แตะเกม) แต่ไม่วาด · วงคลื่นขยายเร็วเท่าคลื่น (560 px/วิ ถึงขอบวง)
  - ครึ่งไกลวาดหลังสิ่งที่อยู่ในวง ครึ่งใกล้วาดหน้า · ผิวคลื่นไล่สีฟ้าอ่อนถึงน้ำเงินเข้มทีละช่อง + แถบสีอ่อนตามแนวคลื่น + เชือกฟองขาวขอบน้ำเงินเข้มบนสัน (ก้อนฟองขนาดต่าง ๆ) + ฟองที่ฐานด้านหน้า + ละอองน้ำ
  - เสาน้ำเดิมกลางวงไม่วาดเมื่อมีภาพฮาปิ

**ชื่อท่าลอยเหนือมงกุฎเทพ** (BEHEMOTH · GREAT INUNDATION · ทับยักษ์! · คลื่นยักษ์! · ชื่อสกิลตอนกด) — ยก z เป็น 198 ไม่ทับหน้าเทพ

**ตรวจแล้ว**
- เวลาโดน: `tools/fxlab.py hits` ของ haBehemoth / hbSea / hcJar / haWard เท่ากันทั้งมีภาพและ `?hppic=0` (FXSEED=7 + โดนแน่นอน)
- herosweep ฮิปโป 0 error · ไม่มีคำเตือนจากชั้นเอฟเฟกต์ (warnchk) · leak คงที่
- ภาพเฟรม: `HERO=hippo DSF=1.5 MAP=egyF1 python3 tools/fx/strip.py TAG haBehemoth,hbSea dy=-100 h=420 scale=1` · ตอนจบ: ตัดเวลาบัฟ / น้ำท่วมให้เหลือ 0.75 วิ แล้วจับภาพ
- คลิป: `DSF=1.5 MAP=egyF1 python3 tools/fx/hpclip.py gods` (อัลติทั้งสอง + ตอนจบทั้งสอง)

