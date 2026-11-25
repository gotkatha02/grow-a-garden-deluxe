# แรด (Woolly Rhino · Glacier Titan) — เอฟเฟกต์สกิล v3

เจ้าของสั่ง 2026-11-25: "ทำเอฟเฟคสกิลแรดใหม่ให้หน่อย มันพอมีเอฟเฟคเจนอยู่แล้ว อันไหนใช้ได้ก็ใช้ อันไหนไม่โอเคก็ส่งพรอมต์มาเจนใหม่"
(ต่อจากการเปลี่ยนลุคแรดเป็น Glacier Titan: ถุงมือเหล็กดำ แถบทองแดง ข้อนิ้วผลึกน้ำแข็ง แผงขนสีเกาลัด)

## ไฟล์
| ไฟล์ | หน้าที่ |
|---|---|
| `fxlib.js` | ชุดเครื่องมือเอฟเฟกต์กลาง (FXLIB) ตัวเดียวกับอนูบิส — โหลดเฉพาะ `?char=rhino` / `anubis` |
| `rhino_art.js` | ภาพเวกเตอร์ของแรด: `rxFist` ถุงมือ 4 แบบ (0 ของจริง · 1 วิญญาณน้ำแข็ง · 2 ทองแดงร้อน · 3 แดงแค้น), `rxStud` หมุดโมเมนตัม, `rxPlate` แผ่นโล่เหล็ก, `rxIce` ผลึกน้ำแข็ง, `rxFur` ขน, `RXART.seal('iron'\|'frost')` วงตราบนพื้น |
| `rhino_vfx.js` | ตัววางเอฟเฟกต์ทั้งหมด (window.RHV) — ภาพวาดเก่าที่ยังใช้ได้ + โค้ด VFX + ช่องรอภาพใหม่ `RXP` |
| `RHINO_FX3_PROMPTS_TH.md` | พรอมต์ภาพใหม่ 10 ภาพ (ส่งเจ้าของแล้ว) |

`?vfx3=0` = ลุคเก่า (char_rhino_fx.js + ส่วนแรดของ vfx_rework.js) · `?rhpic=0` = ไม่ใช้ภาพวาดเลย (โค้ดล้วน)

## หลักการ
- **ไม่แตะเกมเพลย์**: ห่อ `rhPunches / rhCharge / rhSlam / mkBasic / SKILLS[k].make` ด้วยการ "เพิ่ม event" อย่างเดียว · วัตถุที่มีผลเกม (GiantFist, IceMonolith, FortressZone, SteelWallObj, Bulwark) เก็บ update เดิม เปลี่ยนแค่ draw
- **จังหวะ**: หมัดทุกหมัดเกิดก่อนจังหวะโดน (`pre(a,T,lead,…)`) แล้วบินไปให้ข้อนิ้วถึงเป้า "พอดี" เฟรมที่ดาเมจเข้า · ทุบพื้น / ตกลงพื้น วาดบนเฟรมดาเมจ · ประกายโดน มาจาก `punchFx` (จุดเดียวกับดาเมจ)
- **ปิดลุคเก่าเฉพาะตอนโค้ดแรดทำงาน** (`mine()` = SKCTX / __ACTEV / ตัวจับเวลาของสกิล / RV.tk): Impact, GRing, Crack, GroundShatter, RockSpire, LightPillar, Ghost, Streak, WindArc, AirRing, RoarWave, SoundArcs, TauntLines, StancePlate, ShoulderPlates, FrostPlates, BuffEmitter, IronSeal, GuardPlate, BrushArc + emit กลม/ประกาย/ฝุ่น · HitCrescents / PuffDust ปิดตลอด · เก็บ DText, SheenSweep, FortressArt, CastBar
- วงร่ายสกิล (IronSeal สีฟ้า) → ตราเหล็ก 6 เหลี่ยมของแรด · วงทอง `#ffe9a8` ของสกิลเสริม ex_ → วงทองแดง + หมุด
- ภาพตั้ง (ภูเขาหิน, ชุดเกราะ, ป้อมน้ำแข็ง) วางไว้ **หลังตัว** หรือโปร่ง เพื่อไม่ให้บังฮีโร่

## ภาพเก่า: ใช้ต่อ / เปลี่ยน
| ใช้ต่อ | ใช้ทำอะไร |
|---|---|
| r07_hit · r08_heavyhit | ประกายโดน (น้ำแข็ง / ทองแดง) |
| r09_break | BREAK (สตักเกอร์แตก) |
| r10_armorcrack | Armor Crusher · Bone Crusher |
| r11_pow | Perfect Guard · Unbreakable |
| r13_crack · r14_shockring · r15_erupt · r16_dust · r17_crater | ทุบพื้นสาย B, แผ่นดินแยก, ฝุ่นพุ่งตัว, หลุมยักษ์ |
| r18_spiritfist | หมัดยักษ์กระแทกพื้น (Skybreaker / Worldbreaker / Finale / Cataclysm) |
| r21_bubble | โดมโล่ (ตลอดที่มีโล่) · Shielding Pulse · Absolute |
| r22_pulse | คลื่นน้ำแข็งสาย A (Quake, Pulse, Retribution, Totem) |
| r23_anchor | Iron Anchor (บนพื้นตลอดบัฟ) |
| r24_ironskin | Iron Skin (และแทนวิญญาณยักษ์ Colossus ชั่วคราว) |
| r25_glacierwall | ตัดเป็นเสาน้ำแข็ง 3 ต้นของ Glacier Bulwark |
| r26_glacier · r28_iceburst · r29_trail | Glacier Charge · ระเบิดน้ำแข็ง · ฝุ่นตามหลังพุ่งชน |
| r27_bastion | Frozen Bastion · Last Bastion |
| r31_roar · r32_fury · r33_emblem · r34_sigil | Battle Roar · Fury · Fortress · Absolute |
| r20_wall · r35_spirit | ชั่วคราว จนกว่า rx_wall / rx_roar มา |
| absolute-fortress (FortressArt) | เกมเรียกเอง เก็บไว้ |

| เปลี่ยน (พรอมต์ใหม่) | เหตุผล |
|---|---|
| r01_jab → rx_jab · r02_heavy → rx_heavy · r03_hammer → rx_hammer · r04_uppercut → rx_upper · r05_meteor → rx_meteor · r36_revenge → rx_revenge | ถุงมือลุคเก่า (เหล็กเงิน + ขนครีม + เชือกทอง) |
| worldbreaker → rx_giant | หมัดยักษ์ลุคเก่า |
| r20_wall → rx_wall | กำแพงลุคเก่า (ยังใช้ชั่วคราว) |
| colossus-spirit → rx_titan · r35_spirit → rx_roar | ตัวแรดลุคเก่า |
| ไม่ใช้: r06_rush (ใช้หมัดเบาต่อกัน 4 หมัดแทน) · r19_guard (โค้ดวาดแผ่นโล่เอง) | |

ระหว่างรอ rx_*: หมัดวาดด้วย `rxFist` (โปร่งนิด + เรืองแสง = หมัดพลังที่ยิงออกไป ไม่ใช่แขนที่สอง)

## ต่อสกิล
| สกิล | สิ่งที่เห็น |
|---|---|
| ตีปกติ | หมัดวิญญาณน้ำแข็งพุ่งจากมือถึงเป้าตรงจังหวะ, หมัดท้ายทองแดง · ประกาย r07 / r08 |
| Rhino Charge | ฝุ่นพุ่ง r16, ทางฝุ่น r29 ตามตัว, คลื่นหัวหน้า, ฝุ่นข้างทาง, จบด้วยฝุ่น + วงเหล็ก |
| Glacier Charge (C) | ลิ่มน้ำแข็ง r26 นำหน้า + ผลึกโคจร, หนามน้ำแข็งที่ศัตรูโดนชน, จบด้วย r28 + พื้นน้ำค้างแข็ง |
| Iron Guard | แผ่นโล่เหล็ก 3 แผ่นตั้งหน้าตัว (ขอบทองช่วง Perfect) · โดนกัน = ประกายเหล็ก, Perfect = r11 ทอง |
| Counter / Heavy Knuckle / Crusher / Bone | ไฟทองแดง (หรือน้ำแข็ง) รวมที่มือช่วงง้าง → หมัดหนักถึงเป้าตรงจังหวะ · Crusher / Bone: r10 + เกล็ดเหล็ก (+ รอยแยก) |
| Crushing Counter | ถุงมือวิญญาณยักษ์บนแขน + หมัดวิญญาณ + คลื่นเสี้ยวน้ำแข็ง 3 ชั้น · Reflection: r22 เพิ่ม |
| Battle Roar | หัววิญญาณคำราม (r35 → rx_roar) หลังตัว + r31 + วงคลื่น + ฝุ่นพุ่งออก · ระหว่างบัฟมีประกายทองแดงเป็นระยะ |
| Iron Skin | r24 หลังตัว + แผ่นเหล็กบินเข้าตัว + ประกายเหล็กตลอดบัฟ |
| Guardian Stance | ตราเหล็ก 6 เหลี่ยมบนพื้น + แผ่นโล่ 2 แผ่นหน้าตัวตลอดบัฟ · Frozen Bastion: r27 โปร่ง + หนามน้ำแข็ง |
| Steel Wall | กำแพง (r20 → rx_wall) โผล่จากพื้นหน้าตัว กระพริบเมื่อกันได้ |
| Shielding Pulse | r22 กว้าง + โดม r21 + วงคลื่น + ฝุ่นพุ่งออก |
| Revenge Fist | วงวนสีแดงที่มือตลอดช่วงง้าง → หมัดแค้นแดง + วงแดง |
| Rhino Fortress | ตราทอง r33 เหนือหัว + วงป้อมแผ่นโล่ 10 แผ่นรอบตัวตลอดบัฟ + เครื่องหมาย ! + เส้นยั่วยุไปหาศัตรู |
| Iron Anchor | r23 สมอ + โซ่บนพื้นตลอดบัฟ + รอยแยกเหล็ก |
| Quake / Retribution / Glacier Bulwark | ทุบพื้นน้ำแข็ง (r22 + r14 + หนามน้ำแข็ง) · Retribution มีแผ่นเหล็กกระเด็น · Bulwark: เสาน้ำแข็งตัดจาก r25 งอกจากพื้น, มีรอยร้าวก่อนแตก, แตกเป็นเกล็ด |
| Immovable Colossus | วิญญาณยักษ์ (r24 → rx_titan) หลังตัว + วงตราน้ำแข็ง + หมอกน้ำแข็งตลอดบัฟ |
| Absolute Fortress | วงตรา r34 + โดมช่วงกัน → ทุบ: r22 + หนามน้ำแข็ง 18 อัน + หลุม r17 + แผ่นเหล็กกระเด็น + 6 คลื่นตามหลัง |
| Double Hammer | หมัดคู่ทุบลงจากด้านบน + เส้นไขว้ทองแดง + รอยแยก |
| Rising Uppercut | หมัดเสย + เสาแสงพุ่งขึ้น + หินลอย |
| Titan Combo | หมัด หมัด ทุบคู่ + r13 + r15 |
| Meteor Knuckle | ไฟแดงรวมที่มือ + เงาตามพุ่ง + หมัดอุกกาบาต + วงแดง + r14 |
| Breaker Rush | เงาตามตัวสีทองแดง + 4 หมัดสลับซ้ายขวา |
| Earth Shaker / Seismic / Crushing Finale | ทุบพื้นทองแดง (r13 + r14 + r15 หลังตัว + หิน) · Avalanche Chain: คลื่นที่ 2 · Seismic: r15 8 จุดรอบจุดแผ่นดินไหว · Finale: หมัดยักษ์ตกตรงเฟรมดาเมจ + หลุม r17 |
| Avalanche Punch | หมัดวิญญาณน้ำแข็งรัว + หิมะปลิว |
| Fury | r32 + เปลวไฟแดงหลังตัวตลอดบัฟ + ประกายไฟจากมือ |
| Skybreaker | ฝุ่นตอนกระโดด + เงา/วงที่จุดตก + หมัดยักษ์ + หลุม r17 |
| Worldbreaker | หินลอยรอบตัวตอนชาร์จ, รอยแยกโตขึ้น, ถุงมือยักษ์ทองแดงบนแขน, เงาที่จุดตก, หลุมยักษ์ + r15 สามจุด + 5 คลื่น · Cataclysm: หมัดวิญญาณน้ำแข็งตกอีกครั้ง |
| Colossus Grip (C) | ถุงมือยักษ์บนแขน → ขากรรไกรพลังทองแดงจับศัตรู → ตกกระแทกพื้นเป็นหลุม |
| Ironblood Pact (C) | กระแสแดง + น้ำแข็งไหลเข้ามือ, วงคู่ · ระหว่างบัฟมีประกายจากมือ |
| เกจ | หมุดทองแดงเหนือหัว = Momentum · แถบสตักเกอร์ใต้ศัตรู (ทองแดง, ขาวน้ำเงินตอนภูมิคุ้มกัน) · โดม r21 = โล่ · วง 6 เหลี่ยมใต้เท้า = Super Armor |
| Unbreakable / Last Bastion / Earth Fracture | r11 สั้นๆ · r27 + วง · รอยแยก + ระเบิดหินตามหลัง 0.35 วิ |

## ตรวจแล้ว
- เวลาดาเมจทุกสกิล (ตีปกติ + 35 สกิล) เท่าลุคเก่าทุกตัวเลข (`FXSEED=7 FXINIT=…sure… tools/fxlab.py hits rhino … [q=vfx3=0]`)
- `tools/qa/herosweep.py rhino` ไม่มี error · smoke ทุกสกิลไม่มี warning (work/rhfx/py/smoke.py)
- ภาพ strip ทุกกลุ่มบนแมพหิมะ (tools/fx/strip.py, work/rhfx/out)

## ยังไม่ทำ
- ภาพใหม่ 10 ภาพ (รอเจ้าของ) → ตัด, ใส่ชื่อใน `RXP`, วัดจุดข้อนิ้ว `RXA`
- เอฟเฟกต์ของสกิลเสริม ex_ (ตอนนี้ = วงทองแดง + หมุด)
- เช็กบนมือถือ, คำตัดสินของเจ้าของ
