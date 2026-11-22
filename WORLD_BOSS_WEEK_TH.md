# บอสโลก 7 วัน — วันละตัว (ข้อเสนอ 2026-11-22)

เจ้าของ: *"ขอทำ world boss ให้ครบทุกตัวก่อน เอาอีก6ตัวให้ครบ7วัน ขอพร้อมเอาไปดีไซน์หน่อย"*
สถานะ: **ออกแบบ + พรอมต์รูปต้นแบบ · ยังไม่ได้สร้างในเกม**
- วันเสาร์ = เออร์ทอค (แบบเต็มใน WORLD_BOSS_TH.md รูปเข้าแล้ว)
- ไฟล์นี้ = ตารางสัปดาห์ กติกากลาง และอีก 6 ตัว

---

## 0. ตารางสัปดาห์
สีประจำวันแบบไทย · ดาวประจำวัน · ทุกตัวแบกเศษใหญ่ 1 ชิ้นของโทเท็มใหญ่ที่แตก

| วัน | สี | บอส | แบกเศษ | กลไกเด่น → ช่วงเปิด | โจทย์เจม | สายเด่น |
|---|---|---|---|---|---|---|
| อาทิตย์ | แดง | **เคปรา** ด้วงสุริยะ | มงกุฎสุริยะ | ยืนวงยันลูกอาทิตย์ที่กลิ้งมา → ด้วงหงายล้ม · ตอนตะวันเที่ยงหลบในเงาเสา | ไฟเติมแดด น้ำแข็งดับแดด | VIT · INT |
| จันทร์ | เหลือง | **ปุยจันทรา** กระต่ายจันทร์ | ไข่มุกจันทร์ | เก็บโมจิก่อนมันดูดกลับ · เดือนมืดฆ่าฝูงกระต่ายเล็กครบ → ตัวจริงหมดแรง | รวมศูนย์ ↔ กระจาย | DEX · INT |
| อังคาร | ชมพู | **บุรุมบา** ช้างกลองศึก | แถบนักรบ | ตั้งแนวโล่ขวางตอนมันพุ่งชน → ชนกำแพงคนจนมึน | ตั้งรับ ↔ เดือด | VIT · STR |
| พุธ | เขียว | **มายาวี** กิ้งก่าพันสี | ดวงตาคู่ | ตีดอกสีให้สาดโดนตัวที่ล่องหน → มองเห็น 15 วิ | ตุนชาร์จไว้ยิงตอนโผล่ | DEX · LUK |
| พฤหัส | ส้ม | **บรอนทารา** นกอัสนี | ยอดนกอัสนี | ปลุกเสาล่อฟ้าให้ดูดสายฟ้า ครบ 3 ยิงย้อน → นกร่วง | มันกินสายฟ้า ใช้เสาโทเท็ม | INT · DEX |
| ศุกร์ | ฟ้า | **ลูมินา** วาฬประกายพรึก | หัวใจดาว (ในท้อง) | ถูกกลืนไปทุบเศษในท้อง · ข้างนอกทำให้ไอพ่น → มึน | อยู่รอดเองในท้อง | VIT · AGI |
| เสาร์ | ม่วง | **เออร์ทอค** ผู้แบกโทเท็ม | ตอโทเท็ม + หัวใจ | ทุบขานับครั้ง → ล้มตะแคง หัวใจเปิด | ถี่ ↔ หนัก | STR · AGI |

- **ครบ 12 เจมแปรสภาพในสัปดาห์เดียว**: ถี่ หนัก รวมศูนย์ กระจาย ไฟ น้ำแข็ง ไฟฟ้า ตั้งรับ เดือด ดูดพลัง ชาร์จ เสาโทเท็ม → ทุกวันต้องแต่งสกิลใหม่ (จุดขายข้อ 2)
- แต่ละวันมีงานให้ทุกสาย แต่สายเด่นหมุนไปทุกวัน → ทุกบิลด์มีวันของตัวเอง (จุดขายข้อ 3)
- รูปร่างไม่ซ้ำกัน: กระดองเตี้ยกว้าง · ด้วงกลม + ลูกกลม · กระต่ายตั้งตรง + ค้อน · ช้างสูง + ป้อม · กิ้งก่าหางม้วน · นกกางปีก · วาฬยาวลอยฟ้า

## 1. เรื่องรวม
- โทเท็มใหญ่คือเสาค้ำฟ้า พอแตก เศษใหญ่ 7 ชิ้นปลิวไปตกคนละมุมโลก แต่ละชิ้นปลุกสัตว์ยักษ์ที่แก่กว่าห้าแดนขึ้นมา 1 ตัว
- เศษทำให้มันเจ็บและคลั่ง ทุกตัว**ไม่ได้ชั่วร้าย** ผู้เล่นไปช่วยให้มันสงบ แล้วได้ฝุ่นเศษเป็นวัตถุดิบเจม (ตรงกับเรื่องหลัก "แกะเจมจากเศษโทเท็ม")
- ฟ้าของแต่ละวันเป็นของดาวดวงหนึ่ง เศษประจำวันจึงตื่นแรงที่สุดในวันของตัวเอง

## 2. กติกากลาง (ใช้กับทั้ง 7 ตัว)
- **เวลา จำนวนคน แต้มผลงาน รางวัล ทางเซิร์ฟเวอร์** ตาม WORLD_BOSS_TH.md ข้อ 10–14:
  - เกิดวันละตัวตามวัน เวลา 12:30 และ 20:30
  - ศึก 20 นาที โกรธที่นาที 16
  - ปรับตามจำนวนคน N (ขั้นต่ำ 20 วิญญาณนักรบ AI เติมให้)
  - ดาเมจบอส = เลเวลคนที่โดน × k
  - รางวัลตามแต้มผลงาน ไม่มีโบนัสตีปิด
  - ท็อป 10 ของแต่ละงาน
  - วัตถุโบราณ 1/400 ต่อคนต่อรอบที่ชนะ + เศษวัตถุโบราณครบ 60 แลกได้
- **สัญญาณภาษาเดียวกับบอสประจำแมพ** (MAP_BOSS_MECHANICS_TH.md ข้อ 2):
  - พื้นแดงเติมจนเต็ม = เดินออก
  - พื้นฟ้า ✓ = จุดปลอดภัย / จุดที่ต้องไปยืน
  - ของขอบทอง ◎ = ต้องตี (ออโต้ไม่ตีให้)
  - ม่วง = คำสาป
  - แถบร่ายทอง = ขัดได้ด้วยเกจ KO
  - ป้ายกลางจอ 1 บรรทัด
  - แสงทอง + นับถอยหลัง = **ช่วงเปิด** (DEF / MDEF = 0 ทุกฮิตเข้าแน่นอน)
- **กลไกเด่นตัวละ 1 อย่าง พาไปสู่ช่วงเปิด** + ท่าธรรมดา 3–4 ท่า · ไม่สุ่ม เป้าเลือกด้วยตัวนับ · ไม่มีเปอร์เซ็นต์
- **พักเปลี่ยนเฟส 6 วิ** ทุกตัว (บอสหยุดท่า) = เวลาพอสำหรับสลับหน้าเสาโทเท็ม (ต้องไม่ตีและไม่โดนตี 5 วิ)
- **เหรียญรวม "เกล็ดดาว"** ใช้กับบอสโลกทุกตัว (แทนเกล็ดเต่าเฒ่าของเออร์ทอค) · ร้านเดียวที่กิลด์มาสเตอร์
- **หีบประจำสัปดาห์**: ร่วมบอสโลกครบ 5 ตัวที่ไม่ซ้ำกันในสัปดาห์ → แร่ดาวตก 2 · หินโทเท็มดิบ 3 · เกล็ดดาว 30
- **ลาน**: เริ่มด้วยแมพแอ่งเดียว เปลี่ยนพื้นและของในลานตามวัน (ทรายนาฬิกาแดด · หินจันทร์ · สมรภูมิ · สวนดอกไม้ · ยอดผา · ทะเลเมฆ · แอ่งโทเท็ม) ค่อยแยกแมพทีหลังถ้าอยากได้
- **ขนาด**: กว้าง ~400 px ในเกมเท่าเออร์ทอค · ตัวที่บิน (นกอัสนี วาฬ) วาดลอยสูง ~120 px มีเงาบนพื้น · ลองขนาดด้วย `tools/fx/bossmock.py`
- **รูปต้นแบบ**: แชทใหม่ใน ChatGPT แนบรูปปกแคมป์ไฟ + รูปเออร์ทอค (assets/bosses/world/urtok.png) ให้สไตล์และขนาดเข้าชุด · ส่งพรอมต์ทีละตัว · กิ้งก่า (สีเขียว) ใช้พื้นแดงม่วง (magenta) ที่เหลือพื้นเขียว

---

## 3. อาทิตย์ — เคปรา ด้วงสุริยะ (Khepra, the Sun Scarab)
**ด้วงยักษ์กลิ้งดวงอาทิตย์ไปทั่วลาน ทั้งเซิฟต้องยันลูกอาทิตย์ให้หยุด และหลบในเงาเสาตอนมันยกดวงอาทิตย์ขึ้นฟ้า**
- เรื่อง: มงกุฎสุริยะบนยอดโทเท็มตกกลางทะเลทราย ด้วงเฒ่าคิดว่าดวงอาทิตย์ตกจากฟ้า จึงพยายามกลิ้งมันกลับขึ้นไป ยิ่งกลิ้งยิ่งร้อนจนทรายลุกเป็นไฟ
- หน้าตา: ด้วงสการับยักษ์ กระดองปีกแดงทับทิมลายรัศมีทอง หงอนหัวทองหยักเหมือนแสงอาทิตย์ ตาอำพันโต ขา 6 ข้างคาดทอง ดันลูกอาทิตย์ลูกโตเท่าตัว (ทรงกลมส้มทองลุกเป็นไฟ ข้างในเป็นแผ่นหินมงกุฎโทเท็ม)
- ลาน: ลานหินทรายแบบนาฬิกาแดด เสาโอเบลิสก์ 6 ต้นรอบลาน
- กลไก:
  1. **กลิ้งอาทิตย์**: ลูกอาทิตย์ ◎ กลิ้งตามเส้นแดงข้ามลาน แล้วเลี้ยวกลิ้งเส้นใหม่ · ความร้อน 0–100 เพิ่ม 1 ต่อวิที่กลิ้ง
  2. **ยันอาทิตย์**: บนเส้นมีวงฟ้า ✓ "วงยัน" · คนในวงตอนลูกมาถึง ≥ 3 + N/10 → ลูกหยุดเด้งกลับใส่ด้วง ด้วงหงายล้ม = **ช่วงเปิด 15 วิ** · คนไม่พอ → ทับทั้งเส้น (×12 + ล้ม) ความร้อน +15
  3. **ตะวันเที่ยง**: ทุก 120 วิ หรือความร้อนถึง 100 ด้วงยกลูกอาทิตย์เหนือหัว แถบร่ายทอง 4 วิ
     - ขัดได้ (เกจ KO หมด) → ลูกหล่นทับหัวตัวเอง มึน 8 วิ ความร้อนเหลือ 0
     - ไม่ขัด → แสงจ้าโดนทุกคนที่ไม่ได้อยู่ในเงาเสาโอเบลิสก์ (×14 + ไหม้) · เงาชี้ออกจากลูกอาทิตย์ จุดปลอดภัยจึงย้ายตามตำแหน่งดวงอาทิตย์
- **โจทย์เจม: ไฟเติมแดด น้ำแข็งดับแดด** — ท่าเจมไฟตีโดนลูกอาทิตย์ ความร้อน +2 ต่อฮิต · เจมน้ำแข็ง (และเสริมเย็น) −2
- งาน: VIT ยืนวงยัน · INT / DEX ยิงน้ำแข็งใส่ลูกอาทิตย์จากไกล · STR / AGI ตีท้องช่วงเปิด · LUK คริ · ฮีล ตอนแสงจ้าและไหม้
- ท่าธรรมดา:

| ท่า | เมื่อไร | เตือน | ผล |
|---|---|---|---|
| เขาเกี่ยวโยน | ทุก 9 วิ ใส่คนหน้าหัว | กรวยแดง 1 วิ | ×10 + ลอย |
| มุดทราย | ทุก 25 วิ โผล่ใต้คนที่ทำดาเมจสูงสุด 10 วิล่าสุด | วงแดง 1 วิ | ×11 |
| สะเก็ดตะวัน | ทุกครั้งที่ลูกอาทิตย์เลี้ยว | วงแดงเล็ก 0.8 วิ รอบลูก | ×6 + ไหม้ |

- โกรธ (นาที 16): ลูกอาทิตย์แตกเป็น 2 ลูก กลิ้งพร้อมกัน
- ชนะ: ลูกอาทิตย์เย็นลงกลายเป็นมงกุฎโทเท็ม ด้วงก้มคำนับแล้วมุดทรายหลับ
- วัตถุโบราณ **ด้วงรุ่งอรุณ** (rule): ครั้งแรกที่จะตาย (ทุก 10 นาที) กลายเป็นด้วงทอง 3 วิ ไม่โดนดาเมจ แล้วฟื้นด้วย HP เลเวล × 20
- ของสะสม: ปีกแฟชั่น "ปีกด้วงสุริยะ" · ฉายา "ผู้ยันตะวัน"

## 4. จันทร์ — ปุยจันทรา กระต่ายจันทร์ (Puijantra, the Moon Rabbit)
**กระต่ายยักษ์ตำโมจิยาอายุวัฒนะ ทุกครั้งที่ตำ โมจิกระเด็นทั่วลาน ใครเก็บได้ได้กิน ถ้าปล่อยไว้มันดูดกลับไปฟื้นเลือด · ข้างขึ้นสู้ตัวใหญ่ ข้างแรมมันแตกเป็นฝูงกระต่ายเล็ก**
- เรื่อง: ไข่มุกจันทร์ของโทเท็มตกลงในครกของกระต่ายบนดวงจันทร์ มันตำเศษนั้นเป็นยาอายุวัฒนะหวังรักษาโลกที่แตก แต่แรงตำสะเทือนถึงแผ่นดิน
- หน้าตา: กระต่ายขนปุยสีเงินขาว หูยาวปลายทองอ่อน รอยจันทร์เสี้ยวทองบนหน้าผาก ตาง่วงสีทอง ใส่เสื้อกั๊กเทศกาลสีเหลืองลายจันทร์และเมฆ แบกค้อนไม้ยักษ์คาดทอง ข้างตัวมีครกหินเต็มไปด้วยโมจิเรืองแสงที่มีเศษคริสตัลระยิบ
- ลาน: ลานหินขาวลอยฟ้า หลุมอุกกาบาต โคมหิน 8 ต้น
- กลไก (ข้างขึ้นข้างแรม วนตามเวลา):
  1. **เต็มดวง** (90 วิ): ตำครกทุก 6 วิ → คลื่นวงแผ่ออก (มีช่อง ✓ หมุน) + โมจิ 6–10 ก้อนตกทั่วลาน
     - ใครเดินทับ = กิน: ฟื้น HP เลเวล × 3 + บัฟ "อิ่มจันทร์" ATK / MATK + เลเวล × 0.5 นาน 10 วิ ซ้อน 3
     - โมจิที่เหลือเกิน 8 วิ มันดูดกลับ ฟื้นเลือดก้อนละ เลเวล × 60
     - ขนจันทร์หนา: ท่าวงกว้างโดนมันได้ไม่เกิน เลเวล × 2 ต่อฮิต ท่าเป้าเดี่ยวเข้าเต็ม
  2. **ครึ่งเสี้ยว** (45 วิ): กระโดดข้ามลาน 3 ครั้ง (วงแดงตรงจุดลง 1 วิ ×12) แล้วทุบค้อนลง
  3. **เดือนมืด** (40 วิ): ลานมืด (สถานะมืด) แตกเป็นกระต่ายเล็ก 20 ตัว ◎ วิ่งวน HP น้อย หลบเก่ง
     - ฆ่าครบ 20 → ตัวจริงหมดแรงนอนแผ่ = **ช่วงเปิด 15 วิ**
     - ฆ่าไม่ทัน → กลับมาเต็มดวง ฟื้นเลือดตัวละ เลเวล × 60 ตามจำนวนที่รอด
  - ระหว่างเปลี่ยนเฟส มันนั่งมองฟ้า 6 วิ = เวลาสลับหน้าเสาโทเท็ม
- **โจทย์เจม: เต็มดวงรวมศูนย์ เดือนมืดกระจาย** → ตั้งหน้าเสาสองหน้า สลับตอนพักเปลี่ยนเฟส
- งาน: STR / AGI เป้าเดี่ยวช่วงเต็มดวง · INT ท่าวงกว้างเคลียร์ฝูง · DEX ตีโดนกระต่ายเล็ก (ต้องใช้ HIT) · ทุกคน เก็บโมจิ · VIT รับค้อน · ฮีล คลื่นตำ
- ท่าธรรมดา:

| ท่า | เมื่อไร | เตือน | ผล |
|---|---|---|---|
| ทุบค้อน | ทุก 10 วิ ใส่คนหน้าหัว | กรวยแดง 1 วิ | ×14 |
| หูฟาด | ทุก 15 วิ ถ้ามีคนข้างหลัง ≥ 3 | หูยก 1 วิ | ×8 + ผลัก |
| ลำแสงจันทร์ | ช่วงครึ่งเสี้ยว 1 ครั้ง | เส้นจากรอยจันทร์บนหน้าผาก 1.3 วิ แล้วกวาด 90° ช้าๆ | ×4 ทุก 0.5 วิ |

- โกรธ: เดือนมืดมีฝูง 30 ตัว ตำครกทุก 4 วิ
- ชนะ: โมจิก้อนสุดท้ายเรืองแสง กระต่ายแบ่งให้ทุกคนแล้วกระโดดกลับดวงจันทร์
- วัตถุโบราณ **ครกจันทร์** (act · คูล 45 วิ): วางครก โมจิ 4 ก้อนรอบตัว 15 วิ เราหรือเพื่อนกินได้ ฟื้น HP เลเวล × 10 และ SP เลเวล × 2
- ของสะสม: หมวกหูกระต่ายจันทร์ · ฉายา "นักกินโมจิ"

## 5. อังคาร — บุรุมบา ช้างกลองศึก (Burumba, the War-Drum Mammoth)
**ช้างแมมมอธแบกป้อมกลองศึก ตีกลองเรียกกองทัพวิญญาณไม่หยุด และพุ่งชนเป็นระยะ ทั้งเซิฟต้องตั้งกำแพงโล่ขวางให้มันชนจนมึน**
- เรื่อง: แถบนักรบของโทเท็มใหญ่ฝังเป็นหินหัวป้อมบนหลังช้าง วิญญาณนักรบห้าแดนในเศษนั้นตีกลองศึกไม่ยอมหยุด
- หน้าตา: แมมมอธขนฟูสีน้ำตาลอมชมพู ตาเล็กเรืองชมพู งาโค้งใหญ่ครอบทองแดงผูกริบบิ้นสงครามสีชมพู เกราะทองแดงที่หน้าผากและขา บนหลังมีป้อมไม้แกะสลัก ธงสงครามสีชมพู กลองศึกใหญ่ 4 ใบหน้ากลองลายก้นหอย มีวิญญาณมือกลองตัวเล็กสีฟ้าซีดตีอยู่
- ลาน: ทุ่งสมรภูมิ กำแพงล้อมพัง
- กลไก:
  1. **กลองศึก 4 ใบ** ◎ อยู่บนป้อม ตีได้จากไกล ≥ 150 เท่านั้น · ทุกจังหวะที่ 4 กองทัพวิญญาณ 1 แถวเดินเข้ามาจากขอบลาน มุ่งไปหาคนฮีลและคนยิงไกล · กลองแตก 1 ใบ = ทัพน้อยลง 1 แถว และความเดือด −1
  2. **พุ่งชน** (ทุก 75 วิ): ตะกุยดิน ทำเส้นแดงกว้าง 3 วิ แล้ววิ่งชน · มีแถบฟ้า ✓ "แนวโล่" ขวางเส้น
     - คนในแนว ≥ 3 + N/8 (คนที่มีโล่จากเจมตั้งรับนับเป็น 2) → ชนกำแพงคนจนมึน = **ช่วงเปิด 15 วิ** · คนในแนวโดน ×10 (หัก DEF)
     - คนไม่พอ → เหยียบทั้งเส้น ×18 + ล้ม และความเดือด +1 (ทุกท่า + เลเวล × 2)
  3. กลองแตก 2 ใบ → "ยืนหยัดครั้งสุดท้าย" กลองที่เหลือตีเร็วขึ้นเท่าตัว
- **โจทย์เจม: ตั้งรับ หรือ เดือด** — เจมตั้งรับนับเป็น 2 คนในแนวโล่ · เจมเดือดแรงขึ้นตอนโดนชนหรือโดนเหยียบ
- งาน: VIT แนวโล่ · STR / AGI ทัพวิญญาณ + ขาช่วงเปิด · INT / DEX ตีกลอง · LUK คริ · ฮีล หลังชน
- ท่าธรรมดา:

| ท่า | เมื่อไร | เตือน | ผล |
|---|---|---|---|
| งากวาด | ทุก 8 วิ | ครึ่งวงหน้าแดง 1 วิ | ×12 |
| งวงคว้า | ทุก 20 วิ คว้าคนที่ยืนหน้าสุดนานสุด | งวงชี้ 1 วิ | เหวี่ยงไปท้ายลาน · ◎ งวง ตีให้ปล่อย |
| กระทืบ | ทุก 14 วิ | วงแดงรอบตัว 1 วิ | ×9 |

- โกรธ: พุ่งชนทุก 40 วิ แนวโล่ต้องใช้คนเพิ่ม 2
- ชนะ: กลองใบสุดท้ายเงียบ วิญญาณนักรบคุกเข่า ช้างหมอบหลับ
- วัตถุโบราณ **กลองศึก** (act · คูล 60 วิ): ตีกลอง เราและเพื่อนในรัศมี 300 ได้ ATK / MATK + เลเวล × 1 นาน 12 วิ และเราไม่โดนผลัก / ล้ม 4 วิ
- ของสะสม: กลองสะพายหลัง (แฟชั่น) · ฉายา "กำแพงสงคราม"

## 6. พุธ — มายาวี กิ้งก่าพันสี (Mayawee, the Thousand-Hue Chameleon)
**กิ้งก่ายักษ์ล่องหนกลืนไปกับลาน โผล่แค่แวบตอนจู่โจม ทั้งเซิฟต้องสาดสีให้ติดตัวมันจนมองเห็น แล้วรุมระเบิดในเวลาสั้นๆ**
- เรื่อง: ดวงตาคู่ของโทเท็มใหญ่กลายเป็นตาของกิ้งก่าเฒ่า มันเห็นทุกสีบนโลกจนกลายเป็นสีอะไรก็ได้ และหลอกล่อผู้มาเยือนไม่รู้จบ
- หน้าตา: กิ้งก่าคาเมเลียนยักษ์ หงอนหัวทรงหมวก ตาทรงกรวยสองข้าง ลูกตาเป็นคริสตัลเรืองแสง (ฟ้าอมเขียวข้างหนึ่ง ทองอีกข้าง) มองคนละทาง หนังเขียวหยกลายมรกตและเขียวอ่อน จุดทอง สร้อยลูกปัดไม้แกะลายโทเท็ม หางม้วนก้นหอยใหญ่
- ลาน: สวนวัดร้าง ดอกไม้สีตูมใหญ่ 8 ดอก
- กลไก:
  1. **ล่องหน**: ทุก 40 วิ มันกลืนไปกับลาน เห็นแค่ประกายวูบวาบเคลื่อนไปมา ตีไม่โดน (ออโต้ตีไม่ได้)
  2. **สาดสี**: ดอกตูม ◎ ตีแตกแล้วสีระเบิดรัศมี 150 → ถ้ากิ้งก่าอยู่ในวง สีติดตัว มองเห็น 15 วิ = **ช่วงเปิด** · ดอกงอกใหม่ทีละดอกทุก 20 วิ
  3. **ตาสองข้าง**: ตาแต่ละข้างล็อก 1 คน (สองคนที่ทำดาเมจสูงสุดใน 10 วิ) เส้นเล็ง 2.5 วิ แล้วยิงลำแสง (เส้น ×13) · สองเส้นตัดกัน จุดตัดระเบิดเพิ่ม
  - **ลิ้นตวัด**: ดึงคนที่อยู่ไกลสุดนานสุด 5 วิ เข้าปาก (ถูกลาก) · ◎ ลิ้น ตีให้ปล่อย
- **โจทย์เจม: ตุนไว้ยิงตอนมันโผล่** → เจมชาร์จ (ตุนการใช้สกิล) + เสริมเร่งคูล
- งาน: DEX / INT ตีดอกสีจากไกล (ดอกหลบเก่ง ต้องใช้ HIT) · STR / AGI / LUK ระเบิดช่วงเห็นตัว · ทุกคน ช่วยตีลิ้น · ฮีล ลำแสงตา
- ท่าธรรมดา:

| ท่า | เมื่อไร | เตือน | ผล |
|---|---|---|---|
| หางม้วนฟาด | ทุก 12 วิ ถ้ามีคนข้างหลัง ≥ 3 | หางคลาย 1 วิ | ×10 + ผลัก |
| ใบหงอนบิน | ทุก 9 วิ | พัด 5 เส้น 1 วิ | ×6 ต่อเส้น |
| กินสี | ดอกสีแตกแต่ไม่โดนมัน 3 ครั้งติด | ป้ายกลางจอ | มันกินสีนั้น ฟื้นเลือด เลเวล × 120 |

- โกรธ: ล่องหนนานขึ้น ดอกงอกช้าลงเท่าตัว
- ชนะ: สีหลุดหมด กิ้งก่ากลับเป็นสีหยกเดิม ตาสองข้างค่อยๆ หลับ
- วัตถุโบราณ **สลับร่าง** (act · คูล 20 วิ): สลับที่กับเพื่อนหรือมอนในระยะ 400 — พาเพื่อนออกจากท่าบอส หรือดึงมอนไกลมาหา
- ของสะสม: ชุดแฟชั่นเปลี่ยนสีตามแมพ · ฉายา "ตาทิพย์"

## 7. พฤหัสบดี — บรอนทารา นกอัสนี (Brontara, the Thunderbird)
**นกอัสนียอดเสาโทเท็มบินวนบนฟ้า ฟาดสายฟ้าลงมาไม่หยุด ทั้งเซิฟต้องปลุกเสาล่อฟ้าให้ดูดสายฟ้า แล้วยิงย้อนขึ้นไปจนมันร่วง**
- เรื่อง: นกอัสนีบนยอดสุดของโทเท็มใหญ่ฟื้นขึ้นมาตอนเสาหัก มันบินตามหาเสาที่เหลือ และพาพายุไปทุกที่
- หน้าตา: นกอัสนียักษ์แบบเสาโทเท็ม จะงอยปากงองุ้มสีทอง ตาเรืองขาวฟ้า ปีกกางสูง ขนสีส้มทองแดงเขียนลายโทเท็ม (วงรี รูปตัวยู เส้นน้ำตาลแดงและดำ) ขนท้องสีเทาเหมือนเมฆพายุ แผ่นหน้ากากไม้แกะบนอก กรงเล็บทอง สายฟ้าขาวฟ้าแลบตามขอบปีกและหาง ลอยกลางอากาศ
- ลาน: ยอดผาเหนือเมฆ เสาล่อฟ้า 5 ต้นรอบขอบ ◎
- กลไก:
  1. **บนฟ้า**: บินวน ตีได้แค่ท่ายิงไกล / เวทที่ห่าง ≥ 150 · ฟาดสายฟ้าเป็นวงแดงใส่ 5 คนที่ยืนนิ่งนานสุด
  2. **ปลุกเสา**: ยืนในวงฟ้า ✓ ของเสา 3 คน 4 วิ → เสาตั้งขึ้นเรือง
     - สายฟ้าที่ลงใกล้เสาที่ตื่น (รัศมี 200) ถูกเสาดูด คนแถวนั้นไม่โดน เสาชาร์จ +1
     - ครบ 3 → เสายิงสายฟ้าย้อนขึ้นฟ้า นกร่วงลงพื้น = **ช่วงเปิด 18 วิ** (ตีใกล้ได้)
  3. **ขึ้นบินอีกครั้ง**: ตบปีก "ฟ้าคำราม" วงใหญ่รอบตัว ×12 + ผลัก
  - **ตาพายุ**: วงม่วงบนตัวคนหนึ่ง 4 วิ แล้วผ่าสายฟ้าใหญ่ → วิ่งไปหาเสาที่ตื่น เสาดูดให้
- **โจทย์เจม: มันกินสายฟ้า** — ท่าเจมไฟฟ้าที่โดนมันกลับเติมพายุ (สายฟ้าลงถี่ขึ้น) · เจมเสาโทเท็มปักเสาเล็กที่ดูดสายฟ้าได้ 1 ครั้ง → ถอดไฟฟ้า ใส่เสาโทเท็ม
- งาน: INT / DEX ตีตอนบนฟ้า · STR / AGI / LUK ช่วงร่วง · ทุกคน ปลุกเสา · VIT ยืนคุมคนปลุกเสา (นกดิ่งใส่เสาที่กำลังปลุก) · ฮีล
- ท่าธรรมดา:

| ท่า | เมื่อไร | เตือน | ผล |
|---|---|---|---|
| ดิ่งกรงเล็บ | ทุกครั้งที่มีคนปลุกเสา | เส้นพุ่ง 1.3 วิ ไปที่เสานั้น | ×14 |
| ลมปีก | ทุก 20 วิ | เส้นกว้าง 1.3 วิ | ผลักไปขอบ ขอบมีกำแพงพายุ ×4 ต่อวิ |
| ขนนกฟ้า | ทุก 12 วิ | แถววงแดงเล็ก 0.8 วิ | ×7 |

- โกรธ: ฟาดสายฟ้าใส่ 8 คน เสาต้องใช้ 4 คนปลุก
- ชนะ: นกลงเกาะยอดเสาล่อฟ้า กลายเป็นรูปสลักนกอัสนีบนยอดเสา หลับไป
- วัตถุโบราณ **เสาล่ออัสนี** (act · คูล 45 วิ): ปักเสาเล็ก 10 วิ ฟาดมอนที่ใกล้ที่สุดทุกวิ (ดาเมจ เลเวล × 3) และดูดกระสุน / สายฟ้าบอสลูกแรกที่พุ่งใส่เพื่อนในรัศมี 150
- ของสะสม: ปีกแฟชั่น "ปีกนกอัสนี" · ฉายา "ผู้ล่อฟ้า"

## 8. ศุกร์ — ลูมินา วาฬประกายพรึก (Lumina, the Morning-Star Sky Whale)
**วาฬยักษ์ว่ายบนฟ้า กลืนเศษโทเท็มลงท้อง มันสูดคนเข้าปากเป็นกลุ่ม คนข้างในต้องทุบเศษในท้อง คนข้างนอกต้องทำให้มันไอพ่นทุกคนออกมา**
- เรื่อง: เศษหัวใจดาวของโทเท็มตกลงทะเลเมฆ วาฬฟ้าเผลอกลืนลงไป เศษนั้นค่อยๆ เป็นพิษในท้อง ทุกเช้ามืดมันร้องเพลงเศร้าก้องฟ้า (ประกายพรึก = ดาวศุกร์ตอนเช้า)
- หน้าตา: วาฬฟ้ายักษ์ ตาโตอ่อนโยนมีประกายรูปดาว ตัวสีฟ้าอ่อน ท้องขาวเป็นร่อง ลายดาวและกลุ่มดาวสีทองบนหลัง ครีบยาวเหมือนปีกขอบทอง บนหลังมีเกาะลอยเล็กๆ ศาลขาวทองกับต้นไม้ดอกขาวชมพู มีเมฆพันหาง เศษคริสตัลเรืองผ่านท้อง
- ลาน: สะพานหินลอยกลางทะเลเมฆ
- กลไก:
  1. **สูดกลืน** (ทุก 70 วิ): อ้าปากสูดลม 4 วิ (ถูกดึง เดินสวนออกได้) · คนที่อยู่ในกรวยหน้าปากตอนจบถูกกลืน ย้ายเข้า **"ในท้องวาฬ"** (ห้องเล็กแยก)
     - ข้างใน: ทุบเศษโทเท็ม ◎ = HP หลักของบอส · กรดในท้อง ×1 ต่อวิ · ฮีลจากข้างนอกเข้าไม่ถึง · 25 วิแล้วถูกพ่นออก
  2. **ไอพ่น**: คนข้างนอกตีจุดใต้ท้อง ◎ ให้เกจ KO หมด → วาฬไอ พ่นทุกคนออกก่อนเวลา + มึน 12 วิ = **ช่วงเปิด**
  3. **เพลงวาฬ** (ทุก 45 วิ): คลื่นเสียง 3 วงแผ่ออก มีช่อง ✓ · ไข่มุกเพลง 4 ลูก ◎ ลอยรอบตัว ลูกที่เหลือตอนเพลงจบ ฟื้นเลือดวาฬลูกละ เลเวล × 120
  - **ผุดจากเมฆ**: ดำลงทะเลเมฆแล้วผุดขึ้นที่วงแดงใหญ่ (เตือน 3 วิ ×16 + ลอย)
- **โจทย์เจม: อยู่รอดเองในท้องวาฬ** → เสริมดูดเลือด / แปรสภาพดูดพลัง (และตั้งรับ)
- งาน: STR / AGI / LUK ข้างใน (ทุบเศษ) · VIT ข้างใน (ทนกรด) · INT / DEX ข้างนอก (ไข่มุก + จุดใต้ท้อง) · ฮีล ข้างนอกหลังผุดจากเมฆ
- ท่าธรรมดา:

| ท่า | เมื่อไร | เตือน | ผล |
|---|---|---|---|
| หางฟาด | ทุก 10 วิ ถ้ามีคนข้างหลัง ≥ 3 | หางยก 1.2 วิ | ×12 |
| ครีบปัด | ทุก 13 วิ | ครึ่งวงข้างลำตัว 1 วิ | ×9 + ผลัก |
| ฝนดาว | ทุก 18 วิ | วงแดงเล็ก 0.8 วิ ทั่วลาน | ×6 |

- โกรธ: กลืนทุก 45 วิ กรดแรงขึ้นเท่าตัว
- ชนะ: วาฬไอเศษโทเท็มออกมา เศษแตกเป็นฝนดาว วาฬร้องเพลงแห่งรุ่งอรุณแล้วว่ายหายไปกับแสงเช้า
- วัตถุโบราณ **เพลงวาฬ** (act · คูล 60 วิ): ร้องเพลง 5 วิ เราและเพื่อนในรัศมี 300 ฟื้น HP เลเวล × 4 และ SP เลเวล × 1 ทุกวิ และหลุดจากช้า / ติดราก / ถูกดึง
- ของสะสม: ลูกโป่งวาฬลอยตามตัว (แฟชั่น) · ฉายา "ผู้กลับจากท้องวาฬ"

## 9. วัตถุโบราณบอสโลก 7 ชิ้น (ช่อง WB · ชุดนี้เน้นช่วยเพื่อน)
| บอส | วัตถุโบราณ | ชนิด | พลัง |
|---|---|---|---|
| เคปรา | ด้วงรุ่งอรุณ | rule | ครั้งแรกที่จะตาย (ทุก 10 นาที) เป็นด้วงทอง 3 วิ แล้วฟื้น HP เลเวล × 20 |
| ปุยจันทรา | ครกจันทร์ | act 45 วิ | โมจิ 4 ก้อน เราหรือเพื่อนกิน ฟื้น HP เลเวล × 10 · SP เลเวล × 2 |
| บุรุมบา | กลองศึก | act 60 วิ | เรา + เพื่อนใน 300: ATK / MATK + เลเวล × 1 นาน 12 วิ · เราไม่โดนผลัก 4 วิ |
| มายาวี | สลับร่าง | act 20 วิ | สลับที่กับเพื่อนหรือมอนในระยะ 400 |
| บรอนทารา | เสาล่ออัสนี | act 45 วิ | เสา 10 วิ ฟาดมอนใกล้สุดทุกวิ เลเวล × 3 · ดูดกระสุนบอสลูกแรกที่พุ่งใส่เพื่อนใน 150 |
| ลูมินา | เพลงวาฬ | act 60 วิ | เรา + เพื่อนใน 300 ฟื้น HP เลเวล × 4 · SP เลเวล × 1 ต่อวิ 5 วิ · หลุดช้า / ราก / ดึง |
| เออร์ทอค | กระดองโทเท็ม | act 60 วิ | กระดองรัศมี 150 นาน 5 วิ ทุกคนข้างในโดนไม่เกิน เลเวล × 3 ต่อครั้ง ไม่โดนผลัก |

- ไม่ซ้ำกับ 30 ชิ้นเดิม (เช็กแล้ว: มีล่องหน · ย้อนเวลา · คว้ามอน แต่ไม่มีฟื้นตอนตาย สลับที่ แจกโมจิ บัฟกลุ่ม ฮีลกลุ่ม)

## 10. พรอมต์รูปต้นแบบ (ส่งให้ ChatGPT ทีละตัว · แนบรูปปกแคมป์ไฟ + รูปเออร์ทอค)

**อาทิตย์ — เคปรา**
```
Boss master design for my 2D isometric fantasy MMORPG (Ragnarok Online feel). Copy the art style of the attached pictures exactly: friendly hand-painted chibi cartoon, cute-but-dangerous, thick clean dark-brown outlines (not black), cel shading with 2–3 flat tones, soft light from the top-left, bright warm colours, clear readable silhouette. Not realistic, not painterly, not 3D. The attached giant tortoise is another world boss of the same set: match its style and level of detail.
Draw ONE colossal world boss alone on a 1024×1024 image: full body, isometric 3/4 view from about 30° above, facing DOWN-RIGHT (south-east), filling about 85% of the image with clear empty space on every side.
KHEPRA, THE SUN SCARAB — a colossal sacred scarab beetle that pushes a sun, proud and fierce but not evil. Chibi proportions: big round head with large shiny amber eyes, a serrated gold head crest shaped like sun rays, short antennae with gold tips. Glossy ruby-red wing shell engraved with gold sun-ray lines and simple totem patterns, gold rim; six sturdy legs with gold bands, the two front legs pressed against the sun. Next to it, as tall as its body: a blazing sun orb — a glowing gold-orange sphere with a carved stone sun disk (a piece of a broken totem crown) inside it and rings of cartoon flame around it. Red and gold dominate.
Background: SOLID FLAT PURE GREEN (#00FF00), no gradient, no ground, no shadow. Never use green on the boss (no green or iridescent green shell). No text, no labels, no frames, no effects floating around it — glow only ON the body and the sun orb.
```

**จันทร์ — ปุยจันทรา**
```
Boss master design for my 2D isometric fantasy MMORPG (Ragnarok Online feel). Copy the art style of the attached pictures exactly: friendly hand-painted chibi cartoon, cute-but-dangerous, thick clean dark-brown outlines (not black), cel shading with 2–3 flat tones, soft light from the top-left, bright warm colours, clear readable silhouette. Not realistic, not painterly, not 3D. The attached giant tortoise is another world boss of the same set: match its style and level of detail.
Draw ONE colossal world boss alone on a 1024×1024 image: full body, isometric 3/4 view from about 30° above, facing DOWN-RIGHT (south-east), filling about 85% of the image with clear empty space on every side.
PUIJANTRA, THE MOON RABBIT — a colossal fluffy moon rabbit that pounds the elixir of the moon, calm and stern but not evil. Chibi proportions: huge round fluffy head, very long ears with pale-gold tips, big sleepy golden eyes, a pale-gold crescent moon mark on its forehead, soft silver-white fur with lavender shading. It wears a short yellow festival vest with moon and cloud patterns. A giant wooden mallet with gold bands rests on its shoulder. In front of it stands a big round stone mortar filled with glowing pale-gold rice cakes, small crystal shards glittering in them. Silver-white and yellow dominate.
Background: SOLID FLAT PURE GREEN (#00FF00), no gradient, no ground, no shadow. Never use green on the boss. No text, no labels, no frames, no effects floating around it — glow only ON the body, the moon mark and the rice cakes.
```

**อังคาร — บุรุมบา**
```
Boss master design for my 2D isometric fantasy MMORPG (Ragnarok Online feel). Copy the art style of the attached pictures exactly: friendly hand-painted chibi cartoon, cute-but-dangerous, thick clean dark-brown outlines (not black), cel shading with 2–3 flat tones, soft light from the top-left, bright warm colours, clear readable silhouette. Not realistic, not painterly, not 3D. The attached giant tortoise is another world boss of the same set: match its style and level of detail.
Draw ONE colossal world boss alone on a 1024×1024 image: full body, isometric 3/4 view from about 30° above, facing DOWN-RIGHT (south-east), filling about 85% of the image with clear empty space on every side.
BURUMBA, THE WAR-DRUM MAMMOTH — a colossal armoured war mammoth, furious but noble, not evil. Chibi proportions: big head with small fierce eyes glowing rose-pink, a shaggy rose-brown woolly coat, a thick trunk, two huge curved tusks capped with bronze and tied with pink war ribbons, bronze armour plates on its forehead and legs. On its back stands a carved wooden war fortress (a small tower) with pink war banners and four big round war drums with spiral-painted drum heads, beaten by small ghostly pale-blue spirit drummers. Rose-pink, brown and bronze dominate.
Background: SOLID FLAT PURE GREEN (#00FF00), no gradient, no ground, no shadow. Never use green on the boss. No text, no labels, no frames, no effects floating around it — glow only ON the body, the eyes and the spirit drummers.
```

**พุธ — มายาวี** (พื้นแดงม่วง เพราะตัวเป็นสีเขียว)
```
Boss master design for my 2D isometric fantasy MMORPG (Ragnarok Online feel). Copy the art style of the attached pictures exactly: friendly hand-painted chibi cartoon, cute-but-dangerous, thick clean dark-brown outlines (not black), cel shading with 2–3 flat tones, soft light from the top-left, bright warm colours, clear readable silhouette. Not realistic, not painterly, not 3D. The attached giant tortoise is another world boss of the same set: match its style and level of detail.
Draw ONE colossal world boss alone on a 1024×1024 image: full body, isometric 3/4 view from about 30° above, facing DOWN-RIGHT (south-east), filling about 85% of the image with clear empty space on every side.
MAYAWEE, THE THOUSAND-HUE CHAMELEON — a colossal trickster chameleon, sly and playful-menacing but not evil. Chibi proportions: big head with a tall helmet-like casque, two big cone-shaped eye turrets holding glowing crystal eyeballs (one teal, one gold) looking in different directions, a wide sly grin. Jade-green skin with emerald and lime stripes and small gold spots, a frilly jade crest along its back, a collar of carved wooden totem beads, four gripping feet with gold claws, a big spiral-curled tail. Jade and emerald green dominate.
Background: SOLID FLAT PURE MAGENTA (#FF00FF), no gradient, no ground, no shadow. Never use pink, purple or magenta on the boss. No text, no labels, no frames, no effects floating around it — glow only ON the body and the crystal eyes.
```

**พฤหัสบดี — บรอนทารา**
```
Boss master design for my 2D isometric fantasy MMORPG (Ragnarok Online feel). Copy the art style of the attached pictures exactly: friendly hand-painted chibi cartoon, cute-but-dangerous, thick clean dark-brown outlines (not black), cel shading with 2–3 flat tones, soft light from the top-left, bright warm colours, clear readable silhouette. Not realistic, not painterly, not 3D. The attached giant tortoise is another world boss of the same set: match its style and level of detail.
Draw ONE colossal world boss alone on a 1024×1024 image: full body, isometric 3/4 view from about 30° above, facing DOWN-RIGHT (south-east), filling about 85% of the image with clear empty space on every side.
BRONTARA, THE THUNDERBIRD — the thunderbird from the top of a giant totem pole, come alive, proud and stormy but not evil. Chibi proportions: big head with a hooked gold beak, fierce eyes glowing blue-white, a short feather crest. Huge wings spread wide and raised, orange, gold and copper feathers painted with bold totem-pole style shapes (ovals and U-shapes in red-brown and black lines), storm-grey cloud-like feathers on its belly, carved wooden totem-mask plates on its chest, gold talons. Blue-white lightning crackles along the wing edges and tail feathers. It hovers in the air with talons hanging, whole body visible. Orange and gold dominate.
Background: SOLID FLAT PURE GREEN (#00FF00), no gradient, no ground, no shadow. Never use green on the boss (no green lightning). No text, no labels, no frames, no effects floating around it — glow only ON the body and its lightning.
```

**ศุกร์ — ลูมินา**
```
Boss master design for my 2D isometric fantasy MMORPG (Ragnarok Online feel). Copy the art style of the attached pictures exactly: friendly hand-painted chibi cartoon, cute-but-dangerous, thick clean dark-brown outlines (not black), cel shading with 2–3 flat tones, soft light from the top-left, bright warm colours, clear readable silhouette. Not realistic, not painterly, not 3D. The attached giant tortoise is another world boss of the same set: match its style and level of detail.
Draw ONE colossal world boss alone on a 1024×1024 image: full body, isometric 3/4 view from about 30° above, facing DOWN-RIGHT (south-east), filling about 85% of the image with clear empty space on every side.
LUMINA, THE MORNING-STAR SKY WHALE — a colossal whale that swims through the sky, gentle and sad, hurt but not evil. Chibi proportions: big round head, large gentle eyes with star-shaped highlights, a small soft mouth. Light sky-blue body with a white grooved belly, gold star and constellation patterns on its back, long wing-like flippers with gold trim. On its back floats a tiny island with a white-and-gold shrine and pink-white blossom trees (no green leaves). A crystal shard glows softly through its belly. Wisps of white cloud curl around its tail. It floats in the air, whole body visible. Light blue and white dominate.
Background: SOLID FLAT PURE GREEN (#00FF00), no gradient, no ground, no shadow. Never use green on the boss. No text, no labels, no frames, no effects floating around it — glow only ON the body, the stars and the belly shard.
```

## 11. ขั้นต่อไป
1. รูปต้นแบบ 6 ตัว → เก็บที่ assets/bosses/world/<ชื่อ>.png + ตัดพื้น + ลองขนาดในแมพ (`tools/fx/bossmock.py`)
2. วิดีโอท่าทางทีละตัวแบบเออร์ทอค (WORLD_BOSS_TH.md ข้อ 18)
3. สร้างในเกม (ทางออฟไลน์ก่อน ตามที่ตกลง) เริ่มที่เออร์ทอค ระบบกลาง (ตารางเวลา N แต้ม รางวัล วิญญาณนักรบ) ใช้ร่วมทุกตัว แล้วเพิ่มทีละวัน

## 12. คำถามถึงเจ้าของ
1. ชื่อ / คอนเซปทั้ง 6 ตัวโอเคไหม (อยากเปลี่ยนตัวไหน)
2. ลานเดียวเปลี่ยนของตามวัน หรืออยากได้ 7 ลานแยก
3. สีประจำวันแบบไทยตามตารางนี้ใช้เลยไหม
