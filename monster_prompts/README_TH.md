# ไฟล์พรอมต์มอนสเตอร์แยกเขต (2026-11-21)

เจ้าของ: 'ทำรวมเป็นไฟล์ของแต่ละเขต ส่งให้ ChatGPT ทั้งไฟล์ แล้วให้มันเจนส่งมาทีละรูป'

**วิธีใช้:** แชทใหม่ใน ChatGPT → แนบไฟล์เขต (.txt) + รูปปกแคมป์ไฟ + รูปมอนที่วาดแล้ว 1 ตัว (ตัวอย่างสไตล์) → พิมพ์ `อ่านไฟล์ทั้งหมด แล้วเริ่มวาด #1` → มันวาดทีละรูป พิมพ์ `next` = ตัวถัดไป · `redo` = วาดตัวเดิมใหม่ · เลข = วาดตัวนั้น · ถ้าเริ่มเพี้ยน (สไตล์ / พื้นไม่เขียว / ขาไม่สลับ) พิมพ์ `re-read the rules in the file, then redo` · ส่งชีตกลับมาพร้อมเลข #

**08 Sea** = โซนทะเลห้าฝั่ง Lv 60–70 (ภาคขยายเพดาน 70 · ยังไม่มีในเกม — แมพ / เลเวลใน SEA_ZONE_TH.md · พรอมต์ภาพแมพ บอส NPC ใน SEA_ART_PROMPTS_TH.md) · ตัวที่อยู่ใต้น้ำวาดลอยว่ายกลางอากาศ เกมใส่น้ำเอง

แก้ดีไซน์: tools/monster_prompt_data.py แล้วรัน `python3 tools/monster_prompts.py` · ได้ชีตแล้วตัดด้วย tools/monsheet.py → MS ใน monster-sprites.js และลบชื่อออกจาก MAP ใน monster-catalog.js

| ไฟล์ | # | มอน | ชื่อไทย | แมพ | เดิน |
|---|---|---|---|---|---|
| 01 Viking | 1 | Snow Pup | ลูกหมาป่าหิมะ | snowpine | FOUR LEGS |
| 01 Viking | 2 | Pass Wolf | หมาป่าหิมะ | vikF6 | FOUR LEGS |
| 01 Viking | 3 | Shadow Wolf | หมาป่าเงา | vikH1 | FOUR LEGS |
| 01 Viking | 4 | Wolf Priest | นักบวชหมาป่า | vikD2a | TWO LEGS |
| 01 Viking | 5 | Gleipnir Weaver | ช่างทอโซ่เกลปเนียร์ | vikD2a | MANY LEGS |
| 01 Viking | 6 | Draugr Wolf | หมาป่าเดรากร์ | vikD2b | FOUR LEGS |
| 01 Viking | 7 | Draugr | เดรากร์ | vikD2b | TWO LEGS |
| 01 Viking | 8 | Chain Wraith | วิญญาณโซ่ | vikD2b | FLOATING |
| 01 Viking | 9 | Fenrir Guard | องครักษ์เฟนเรียร์ | vikD2c | FOUR LEGS |
| 01 Viking | 10 | Wolf High Priest | มหานักบวชหมาป่า | vikD2c | TWO LEGS |
| 01 Viking | 11 | Undying Viking | ไวกิ้งอมตะ | vikE1 | TWO LEGS |
| 01 Viking | 12 | Sea Ghost Wolf | หมาป่าวิญญาณทะเล | vikE1 | FOUR LEGS |
| 01 Viking | 13 | Drowned Shieldmaiden | วาลคิรีจมน้ำ | vikE1 | TWO LEGS |
| 01 Viking | 14 | Frost Giant | ยักษ์น้ำแข็ง | vikE2 | TWO LEGS |
| 01 Viking | 15 | Dark Valkyrie Wolf | หมาป่าวาลคิรีมืด | vikE2 | FOUR LEGS |
| 01 Viking | 16 | Glacier Wyrmling | ลูกมังกรธารน้ำแข็ง | vikE2 | FOUR LEGS |
| 02 Capital | 1 | Wild Horse | ม้าป่า | cN | FOUR LEGS |
| 02 Capital | 2 | Plains Wolf | หมาป่าทุ่ง | cN | FOUR LEGS |
| 02 Capital | 3 | Field Rabbit | กระต่ายทุ่ง | cN | HOPPING |
| 02 Capital | 4 | Field Hawk | เหยี่ยวทุ่ง | cW | FLYING |
| 02 Capital | 5 | Meadow Slime | สไลม์ทุ่ง | cW | HOPPING |
| 02 Capital | 6 | Dandelion Puff | ปุยแดนดิไลออน | cW | FLOATING |
| 02 Capital | 7 | Wild Bull | กระทิงป่า | cS | FOUR LEGS |
| 02 Capital | 8 | Giant Bee | ผึ้งยักษ์ | cS | FLYING |
| 02 Capital | 9 | Wild Rooster | ไก่ป่า | cS | TWO LEGS |
| 02 Capital | 10 | Golden Stag | กวางเขาทอง | cE | FOUR LEGS |
| 02 Capital | 11 | Wild Boar | หมูป่า | cE | FOUR LEGS |
| 02 Capital | 12 | Antler Beetle | ด้วงเขากวาง | cE | MANY LEGS |
| 02 Capital | 13 | Haunted Mill Spirit | ผีโรงสี | cNE | FLOATING |
| 02 Capital | 14 | Giant Crow | อีกายักษ์ | cNE | FLYING |
| 02 Capital | 15 | Scarecrow Knight | อัศวินหุ่นไล่กา | cNE | TWO LEGS |
| 02 Capital | 16 | Water Sprite | ภูตน้ำ | cSW | FLOATING |
| 02 Capital | 17 | Rusted Soldier | ทหารสนิม | cSW | TWO LEGS |
| 02 Capital | 18 | Frog Bandit | กบโจร | cSW | TWO LEGS |
| 02 Capital | 19 | Skeleton Soldier | โครงกระดูกทหาร | cata1 | TWO LEGS |
| 02 Capital | 20 | Sewer Rat | หนูท่อ | cata1 | FOUR LEGS |
| 02 Capital | 21 | Crypt Spider | แมงมุมสุสาน | cata1 | MANY LEGS |
| 02 Capital | 22 | Wraith Knight | อัศวินวิญญาณ | cata2 | TWO LEGS |
| 02 Capital | 23 | Bone Archer | นักธนูกระดูก | cata2 | TWO LEGS |
| 03 Aztec | 1 | Dart Frog | กบลูกดอก | aztF1 | HOPPING |
| 03 Aztec | 2 | Howler Monkey | ลิงหาง | aztF1 | TWO LEGS |
| 03 Aztec | 3 | Leafcutter Ant | มดตัดใบ | aztF1 | MANY LEGS |
| 03 Aztec | 4 | Wild Axolotl | แอกโซลอเติลป่า | aztF2 | FOUR LEGS |
| 03 Aztec | 5 | Quetzal | นกเควตซัล | aztF2 | FLYING |
| 03 Aztec | 6 | Baby Tapir | ลูกสมเสร็จ | aztF2 | FOUR LEGS |
| 03 Aztec | 7 | Maize Rat | หนูข้าวโพด | aztF3 | FOUR LEGS |
| 03 Aztec | 8 | Scarecrow God | หุ่นไล่กาเทพ | aztF3 | TWO LEGS |
| 03 Aztec | 9 | Corn Spirit | ภูตข้าวโพด | aztF3 | TWO LEGS |
| 03 Aztec | 10 | Young Crocodile | จระเข้หนุ่ม | aztF4 | FOUR LEGS |
| 03 Aztec | 11 | Giant Frog | กบยักษ์ | aztF4 | HOPPING |
| 03 Aztec | 12 | Swamp Leech | ปลิงหนองน้ำ | aztF4 | SLITHERING |
| 03 Aztec | 13 | Feathered Serpent | งูขนนก | aztF5 | SLITHERING |
| 03 Aztec | 14 | Stone Mask Warrior | นักรบหน้ากากหิน | aztF5 | TWO LEGS |
| 03 Aztec | 15 | Macaw Raider | นกมาคอว์จอมปล้น | aztF5 | FLYING |
| 03 Aztec | 16 | Black Jaguar | เสือจากัวร์ดำ | aztF6 | FOUR LEGS |
| 03 Aztec | 17 | Lost Priest | นักบวชหลงทาง | aztF6 | FLOATING |
| 03 Aztec | 18 | Vine Snapper | ดอกไม้กินคน | aztF6 | SLITHERING |
| 03 Aztec | 19 | Giant Bat | ค้างคาวยักษ์ | aztD1a | FLYING |
| 03 Aztec | 20 | Cave Spider | แมงมุมถ้ำ | aztD1a | MANY LEGS |
| 03 Aztec | 21 | Glowworm Swarm | ฝูงหนอนเรืองแสง | aztD1a | FLOATING |
| 03 Aztec | 22 | Stone Slave | ทาสหิน | aztD1b | TWO LEGS |
| 03 Aztec | 23 | Vampire Bat Pack | ฝูงค้างคาวแวมไพร์ | aztD1b | FLYING |
| 03 Aztec | 24 | Cave Shaman | หมอผีถ้ำ | aztD1b | TWO LEGS |
| 03 Aztec | 25 | Jaguar Warrior | นักรบจากัวร์ | aztH1 | TWO LEGS |
| 03 Aztec | 26 | Mist Spirit | ภูตหมอก | aztH1 | FLOATING |
| 03 Aztec | 27 | Dart Shaman | หมอผีลูกดอกพิษ | aztH1 | TWO LEGS |
| 03 Aztec | 28 | Eagle Warrior | นักรบอินทรี | aztH2 | TWO LEGS |
| 03 Aztec | 29 | Blood Priest | นักบวชเลือด | aztH2 | TWO LEGS |
| 03 Aztec | 30 | Rain Spirit | ภูตฝนตลาล็อก | aztH2 | FLOATING |
| 03 Aztec | 31 | Sun Priest | นักบวชสุริยะ | aztD2a | TWO LEGS |
| 03 Aztec | 32 | Golden Serpent | งูทอง | aztD2a | SLITHERING |
| 03 Aztec | 33 | Obsidian Priest | นักบวชออบซิเดียน | aztD2a | TWO LEGS |
| 03 Aztec | 34 | Jade Golem | โกเลมหยก | aztD2b | TWO LEGS |
| 03 Aztec | 35 | Temple Jaguar | จากัวร์วิหาร | aztD2b | FOUR LEGS |
| 03 Aztec | 36 | Sun Sentinel | ทหารเฝ้าสุริยะ | aztD2b | TWO LEGS |
| 03 Aztec | 37 | Sun Guardian | องครักษ์สุริยะ | aztD2c | TWO LEGS |
| 03 Aztec | 38 | Obsidian Jaguar | จากัวร์ออบซิเดียน | aztD2c | FOUR LEGS |
| 03 Aztec | 39 | Sunfeather Priestess | นักบวชหญิงขนนกสุริยะ | aztD2c | TWO LEGS |
| 03 Aztec | 40 | Golden Statue | รูปปั้นทองคำ | aztE1 | TWO LEGS |
| 03 Aztec | 41 | Jaguar King | ราชาจากัวร์ | aztE1 | FOUR LEGS |
| 03 Aztec | 42 | Jungle Titan | ยักษ์ป่าดงดิบ | aztE1 | TWO LEGS |
| 03 Aztec | 43 | Obsidian Golem | โกเลมออบซิเดียน | aztE2 | TWO LEGS |
| 03 Aztec | 44 | Fire Bird | นกไฟ | aztE2 | FLYING |
| 03 Aztec | 45 | Volcano Salamander | ซาลาแมนเดอร์ภูเขาไฟ | aztE2 | FOUR LEGS |
| 04 Greek | 1 | Mountain Goat | แพะภูเขา | grkF1 | FOUR LEGS |
| 04 Greek | 2 | Olive Sprite | ภูตต้นมะกอก | grkF1 | TWO LEGS |
| 04 Greek | 3 | Wild Lamb | ลูกแกะป่า | grkF1 | FOUR LEGS |
| 04 Greek | 4 | Marble Crab | ปูหินอ่อน | grkF2 | MANY LEGS |
| 04 Greek | 5 | Walking Statue | รูปปั้นเดินได้ | grkF2 | TWO LEGS |
| 04 Greek | 6 | Olive Beetle | ด้วงมะกอก | grkF2 | MANY LEGS |
| 04 Greek | 7 | Satyr | ซาเทอร์ | grkF3 | TWO LEGS |
| 04 Greek | 8 | Honey Bee | ผึ้งน้ำผึ้ง | grkF3 | FLYING |
| 04 Greek | 9 | Nymph | นางไม้ | grkF3 | TWO LEGS |
| 04 Greek | 10 | Cracked Soldier | ทหารหินแตก | grkF4 | TWO LEGS |
| 04 Greek | 11 | Philosopher Ghost | นักปรัชญาผี | grkF4 | FLOATING |
| 04 Greek | 12 | Bronze Automaton | หุ่นทองแดง | grkF4 | TWO LEGS |
| 04 Greek | 13 | Siren | ไซเรน | grkF5 | SLITHERING |
| 04 Greek | 14 | Harpy | ฮาร์ปี้ | grkF5 | FLYING |
| 04 Greek | 15 | Triton Scout | ไทรทันสอดแนม | grkF5 | TWO LEGS |
| 04 Greek | 16 | Young Centaur | เซนทอร์หนุ่ม | grkF6 | FOUR LEGS |
| 04 Greek | 17 | Black Wolf | หมาป่าดำ | grkF6 | FOUR LEGS |
| 04 Greek | 18 | Erymanthian Boar | หมูป่าเอรีมันทอส | grkF6 | FOUR LEGS |
| 04 Greek | 19 | Little Cyclops | ไซคลอปส์น้อย | grkD1a | TWO LEGS |
| 04 Greek | 20 | Giant Ram | แกะยักษ์ | grkD1a | FOUR LEGS |
| 04 Greek | 21 | Rock Lizard | กิ้งก่าหิน | grkD1a | FOUR LEGS |
| 04 Greek | 22 | Cave Bat | ค้างคาวถ้ำ | grkD1b | FLYING |
| 04 Greek | 23 | Cyclops | ไซคลอปส์ | grkD1b | TWO LEGS |
| 04 Greek | 24 | Cave Hound | หมาถ้ำ | grkD1b | FOUR LEGS |
| 04 Greek | 25 | Hecate Witch | แม่มดเฮคาที | grkH1 | TWO LEGS |
| 04 Greek | 26 | Little Cerberus | สุนัขสามหัวน้อย | grkH1 | FOUR LEGS |
| 04 Greek | 27 | Shade | เงาวิญญาณ | grkH1 | FLOATING |
| 04 Greek | 28 | Spartan Ghost | ทหารสปาร์ตันผี | grkH2 | TWO LEGS |
| 04 Greek | 29 | Amazon | อามาซอน | grkH2 | TWO LEGS |
| 04 Greek | 30 | Bronze Hoplite | ทหารโฮพไลต์ทองแดง | grkH2 | TWO LEGS |
| 04 Greek | 31 | Stone Bull | กระทิงหิน | grkD2a | FOUR LEGS |
| 04 Greek | 32 | Little Medusa | งูเมดูซ่าน้อย | grkD2a | SLITHERING |
| 04 Greek | 33 | Labyrinth Hound | หมาเขาวงกต | grkD2a | FOUR LEGS |
| 04 Greek | 34 | Lost One | ผู้หลงทาง | grkD2b | FLOATING |
| 04 Greek | 35 | Gorgon Shade | เงากอร์กอน | grkD2b | SLITHERING |
| 04 Greek | 36 | Labyrinth Guard | องครักษ์เขาวงกต | grkD2c | TWO LEGS |
| 04 Greek | 37 | Bronze Bull | กระทิงทองแดง | grkD2c | FOUR LEGS |
| 04 Greek | 38 | Minotaur Calf | ลูกมิโนทอร์ | grkD2c | TWO LEGS |
| 04 Greek | 39 | Cerberus | เคอร์เบอรัส | grkE1 | FOUR LEGS |
| 04 Greek | 40 | Styx Ghost | ผีแม่น้ำสติกซ์ | grkE1 | FLOATING |
| 04 Greek | 41 | Charon's Oarsman | ฝีพายของคาโรน | grkE1 | TWO LEGS |
| 04 Greek | 42 | Griffin | กริฟฟิน | grkE2 | FOUR LEGS |
| 04 Greek | 43 | Thunder Guard | องครักษ์สายฟ้า | grkE2 | TWO LEGS |
| 04 Greek | 44 | Storm Pegasus | เพกาซัสพายุ | grkE2 | FOUR LEGS |
| 05 Egypt | 1 | Little Scorpion | แมงป่องเล็ก | egyF1 | MANY LEGS |
| 05 Egypt | 2 | Scarab | ด้วงสคารับ | egyF1 | MANY LEGS |
| 05 Egypt | 3 | Sand Pup | ลูกหมาทะเลทราย | egyF1 | FOUR LEGS |
| 05 Egypt | 4 | Baby Hippo | ฮิปโปน้อย | egyF2 | FOUR LEGS |
| 05 Egypt | 5 | Ibis | นกไอบิส | egyF2 | TWO LEGS |
| 05 Egypt | 6 | Lotus Sprite | ภูตดอกบัว | egyF2 | FLOATING |
| 05 Egypt | 7 | Desert Fox | หมาจิ้งจอกทะเลทราย | egyF3 | FOUR LEGS |
| 05 Egypt | 8 | Little Mummy | มัมมี่น้อย | egyF3 | TWO LEGS |
| 05 Egypt | 9 | Dune Lizard | กิ้งก่าเนินทราย | egyF3 | FOUR LEGS |
| 05 Egypt | 10 | Ghost Slave | ทาสหินผี | egyF4 | FLOATING |
| 05 Egypt | 11 | Granite Golem | โกเลมแกรนิต | egyF4 | TWO LEGS |
| 05 Egypt | 12 | Sandstone Soldier | ทหารหินทราย | egyF4 | TWO LEGS |
| 05 Egypt | 13 | Mummy | มัมมี่ | egyF5 | TWO LEGS |
| 05 Egypt | 14 | Jackal Soldier | ทหารหัวจิ้งจอก | egyF5 | TWO LEGS |
| 05 Egypt | 15 | Cobra | งูเห่า | egyF5 | SLITHERING |
| 05 Egypt | 16 | Little Sphinx | สฟิงซ์น้อย | egyF6 | FOUR LEGS |
| 05 Egypt | 17 | Desert Vulture | แร้งทะเลทราย | egyF6 | FLYING |
| 05 Egypt | 18 | Camel Raider | โจรอูฐ | egyF6 | TWO LEGS |
| 05 Egypt | 19 | Noble Mummy | มัมมี่ขุนนาง | egyD1a | TWO LEGS |
| 05 Egypt | 20 | Flesh Beetle | ด้วงกินเนื้อ | egyD1a | MANY LEGS |
| 05 Egypt | 21 | Tomb Bat | ค้างคาวสุสาน | egyD1a | FLYING |
| 05 Egypt | 22 | Living Trap | กับดักมีชีวิต | egyD1b | HOPPING |
| 05 Egypt | 23 | Tomb Jackal | จิ้งจอกสุสาน | egyD1b | FOUR LEGS |
| 05 Egypt | 24 | Cursed Scribe | อาลักษณ์ต้องสาป | egyD1b | TWO LEGS |
| 05 Egypt | 25 | Ram Statue | รูปปั้นแกะ | egyH1 | FOUR LEGS |
| 05 Egypt | 26 | Dark Cat Priest | นักบวชแมวมืด | egyH1 | TWO LEGS |
| 05 Egypt | 27 | Sphinx Cat | แมวสฟิงซ์ | egyH1 | FOUR LEGS |
| 05 Egypt | 28 | Sand Worm | หนอนทราย | egyH2 | SLITHERING |
| 05 Egypt | 29 | Giant Scorpion | แมงป่องยักษ์ | egyH2 | MANY LEGS |
| 05 Egypt | 30 | Dust Djinn | จินน์ฝุ่น | egyH2 | FLOATING |
| 05 Egypt | 31 | Anubis Guard | องครักษ์อนูบิส | egyD2a | TWO LEGS |
| 05 Egypt | 32 | Royal Mummy | มัมมี่ราชวงศ์ | egyD2a | TWO LEGS |
| 05 Egypt | 33 | Canopic Spirit | วิญญาณโถคาโนปิก | egyD2a | FLOATING |
| 05 Egypt | 34 | Giant Scarab | สคารับยักษ์ | egyD2b | MANY LEGS |
| 05 Egypt | 35 | Sekhmet Lioness | สิงโตเซคเมต | egyD2b | FOUR LEGS |
| 05 Egypt | 36 | Pharaoh Guard | องครักษ์ฟาโรห์ | egyD2c | TWO LEGS |
| 05 Egypt | 37 | Golden Jackal | จิ้งจอกทอง | egyD2c | FOUR LEGS |
| 05 Egypt | 38 | Royal Embalmer | นักทำมัมมี่หลวง | egyD2c | TWO LEGS |
| 05 Egypt | 39 | Set Beast | สัตว์เซท | egyE1 | FOUR LEGS |
| 05 Egypt | 40 | Shadow Soldier | ทหารเงา | egyE1 | TWO LEGS |
| 05 Egypt | 41 | Ammit Devourer | อัมมิตผู้กลืนกิน | egyE1 | FOUR LEGS |
| 05 Egypt | 42 | Giant Sand Worm | หนอนทรายยักษ์ | egyE2 | SLITHERING |
| 05 Egypt | 43 | Djinn | จินน์ | egyE2 | FLOATING |
| 05 Egypt | 44 | Sun Barge Guardian | ผู้พิทักษ์เรือสุริยะ | egyE2 | TWO LEGS |
| 06 Japan | 1 | Tanuki | ทานุกิ | jpnF1 | TWO LEGS |
| 06 Japan | 2 | Petal Sprite | ภูตกลีบซากุระ | jpnF1 | FLOATING |
| 06 Japan | 3 | Mochi Rabbit | กระต่ายโมจิ | jpnF1 | HOPPING |
| 06 Japan | 4 | Kappa | กัปปะ | jpnF2 | TWO LEGS |
| 06 Japan | 5 | Walking Scarecrow | หุ่นฟางเดินได้ | jpnF2 | HOPPING |
| 06 Japan | 6 | Paper Lantern | โคมกระดาษ | jpnF2 | FLOATING |
| 06 Japan | 7 | Red Panda | แพนด้าแดง | jpnF3 | FOUR LEGS |
| 06 Japan | 8 | Ninja Trainee | นินจาฝึกหัด | jpnF3 | TWO LEGS |
| 06 Japan | 9 | Bamboo Sprite | ภูตไผ่ | jpnF3 | TWO LEGS |
| 06 Japan | 10 | Snow Monkey | ลิงหิมะ | jpnF4 | TWO LEGS |
| 06 Japan | 11 | Steam Spirit | ภูตไอน้ำ | jpnF4 | FLOATING |
| 06 Japan | 12 | Onsen Capybara | คาปิบาร่าออนเซ็น | jpnF4 | FOUR LEGS |
| 06 Japan | 13 | Kitsune | คิทสึเนะ | jpnF5 | FOUR LEGS |
| 06 Japan | 14 | Tengu | เท็งงุ | jpnF5 | TWO LEGS |
| 06 Japan | 15 | Kodama | โคดามะ | jpnF5 | TWO LEGS |
| 06 Japan | 16 | Wako Pirate | โจรสลัดวาโค | jpnF6 | TWO LEGS |
| 06 Japan | 17 | Little Octopus | ปลาหมึกน้อย | jpnF6 | MANY LEGS |
| 06 Japan | 18 | Umibozu Spawn | ลูกอุมิโบซุ | jpnF6 | FLOATING |
| 06 Japan | 19 | Shadow Ninja | นินจาเงา | jpnD1a | TWO LEGS |
| 06 Japan | 20 | Giant Toad | คางคกยักษ์ | jpnD1a | HOPPING |
| 06 Japan | 21 | Ninja Hound | สุนัขนินจา | jpnD1a | FOUR LEGS |
| 06 Japan | 22 | Kunai Trap | กับดักคุไน | jpnD1b | FLOATING |
| 06 Japan | 23 | Smoke Bomber | นินจาระเบิดควัน | jpnD1b | TWO LEGS |
| 06 Japan | 24 | Yurei | ยูเร | jpnH1 | FLOATING |
| 06 Japan | 25 | Spirit Wolf | หมาป่าวิญญาณ | jpnH1 | FOUR LEGS |
| 06 Japan | 26 | Rokurokubi | โรคุโรคุบิ | jpnH1 | TWO LEGS |
| 06 Japan | 27 | Ronin | ซามูไรไร้นาย | jpnH2 | TWO LEGS |
| 06 Japan | 28 | War Horse | ม้าศึก | jpnH2 | FOUR LEGS |
| 06 Japan | 29 | Ashigaru Ghost | ผีทหารอาชิการุ | jpnH2 | TWO LEGS |
| 06 Japan | 30 | Undead Ninja | นินจาอันเดด | jpnD2a | TWO LEGS |
| 06 Japan | 31 | Cursed Doll | ตุ๊กตาสาป | jpnD2a | HOPPING |
| 06 Japan | 32 | Onryo | วิญญาณอาฆาต | jpnD2a | FLOATING |
| 06 Japan | 33 | Ghost Samurai | ซามูไรผี | jpnD2b | TWO LEGS |
| 06 Japan | 34 | Bone Samurai | ซามูไรกระดูก | jpnD2b | TWO LEGS |
| 06 Japan | 35 | Shogun Guard | องครักษ์โชกุน | jpnD2c | TWO LEGS |
| 06 Japan | 36 | Shadow Hound | หมาเงา | jpnD2c | FOUR LEGS |
| 06 Japan | 37 | Hatamoto Wraith | วิญญาณองครักษ์ฮาตาโมโตะ | jpnD2c | FLOATING |
| 06 Japan | 38 | Oni | ยักษ์โอนิ | jpnE1 | TWO LEGS |
| 06 Japan | 39 | Demon Swordsman | นักดาบปีศาจ | jpnE1 | TWO LEGS |
| 06 Japan | 40 | Raijin Drummer | มือกลองไรจิน | jpnE1 | TWO LEGS |
| 06 Japan | 41 | Great Serpent | งูยักษ์ | jpnE2 | SLITHERING |
| 06 Japan | 42 | Thunder Dragon Priest | นักบวชมังกร | jpnE2 | TWO LEGS |
| 06 Japan | 43 | Storm Kirin | กิเลนพายุ | jpnE2 | FOUR LEGS |
| 07 Rift | 1 | Aether Wisp | ภูตเอเธอร์ | rift1 | FLOATING |
| 07 Rift | 2 | Rift Hound | หมารอยแยก | rift1 | FOUR LEGS |
| 07 Rift | 3 | Void Mote | ละอองความว่างเปล่า | rift1 | HOPPING |
| 07 Rift | 4 | Crystal Golem | โกเลมคริสตัล | rift2 | TWO LEGS |
| 07 Rift | 5 | Shard Seraph | เซราฟคริสตัล | rift2 | FLOATING |
| 07 Rift | 6 | Wyrm Spawn | ลูกเอเธอร์เวิร์ม | rift3 | FOUR LEGS |
| 07 Rift | 7 | Void Sentinel | ผู้เฝ้าความว่างเปล่า | rift3 | TWO LEGS |
| 07 Rift | 8 | Aether Drake | มังกรน้อยเอเธอร์ | rift3 | FLYING |
| 08 Sea | 1 | Goldshell Hermit Crab | ปูเสฉวนเปลือกทอง | seaF1 | MANY LEGS |
| 08 Sea | 2 | Coconut Crab Brute | ปูมะพร้าวยักษ์ | seaF1 | MANY LEGS |
| 08 Sea | 3 | Thief Gull | นกนางนวลจอมขโมย | seaF1 | FLYING |
| 08 Sea | 4 | Tidepool Starfish | ปลาดาวแอ่งน้ำลง | seaF1 | HOPPING |
| 08 Sea | 5 | Foam Sprite | ภูตฟองคลื่น | seaF2 | FLOATING |
| 08 Sea | 6 | Lagoon Ray | ปลากระเบนลากูน | seaF2 | FLYING |
| 08 Sea | 7 | Shellback Turtle | เต่ากระดองราก | seaF2 | FOUR LEGS |
| 08 Sea | 8 | Barnacle Golem | โกเลมเพรียง | seaF2 | TWO LEGS |
| 08 Sea | 9 | Net Wraith | วิญญาณตาข่ายของราน | seaF3 | FLOATING |
| 08 Sea | 10 | Barrel Mimic | ถังหลอก | seaF3 | HOPPING |
| 08 Sea | 11 | Drowned Oarsman | ฝีพายจมน้ำ | seaF3 | TWO LEGS |
| 08 Sea | 12 | Puffer Bomb | ปลาปักเป้าระเบิด | seaU1 | FLOATING |
| 08 Sea | 13 | Crystal Reef Shark | ฉลามแนวคริสตัล | seaU1 | FLOATING |
| 08 Sea | 14 | Spark Jelly | แมงกะพรุนไฟฟ้า | seaU1 | FLOATING |
| 08 Sea | 15 | Archerfish Sniper | ปลาเสือพ่นน้ำ | seaU1 | FLOATING |
| 08 Sea | 16 | Moray Eel | ปลาไหลมอเรย์ | seaU1 | SLITHERING |
| 08 Sea | 17 | Giant Clam Mimic | หอยมือเสือหลอก | seaU2 | HOPPING |
| 08 Sea | 18 | Kelp Lurker | ผีสาหร่ายทอง | seaU2 | FLOATING |
| 08 Sea | 19 | Swordfish Duelist | นักดาบปลากระโทงแทง | seaU2 | FLOATING |
| 08 Sea | 20 | Hippocampus | ฮิปโปแคมปัส | seaU2 | FLOATING |
| 08 Sea | 21 | Ladle Ghost | ผีถือทัพพี | seaD1a | FLOATING |
| 08 Sea | 22 | Onibi Squid | หมึกไฟผี | seaD1a | FLOATING |
| 08 Sea | 23 | Anchor Golem | โกเลมสมอเรือ | seaD1b | TWO LEGS |
| 08 Sea | 24 | Umibozu | อุมิโบซุ | seaD1b | FLOATING |
| 08 Sea | 25 | Atlantean Hoplite | ทหารหินแอตแลนติส | seaU3 | TWO LEGS |
| 08 Sea | 26 | Drowned Sphinx | สฟิงซ์จมน้ำ | seaU3 | FOUR LEGS |
| 08 Sea | 27 | Ningyo | นินเงียว | seaU3 | SLITHERING |
| 08 Sea | 28 | Wave Maiden | ธิดาคลื่นแห่งเอกีร์ | seaU3 | FLOATING |
| 08 Sea | 29 | Fourth-Sun Fishman | ชาวปลาแห่งตะวันที่สี่ | seaU3 | TWO LEGS |
| 08 Sea | 30 | Water Serpent | งูน้ำหยกฟ้า | seaH1 | SLITHERING |
| 08 Sea | 31 | Rain Frog Priest | นักบวชกบฝน | seaH1 | HOPPING |
| 08 Sea | 32 | Lantern Angler | ปลาตกเบ็ดโคมราก | seaD2a | FLOATING |
| 08 Sea | 33 | Giant Isopod | ไอโซพอดยักษ์ | seaD2a | MANY LEGS |
| 08 Sea | 34 | Gulper Eel | ปลาไหลปากกว้าง | seaD2b | SLITHERING |
| 08 Sea | 35 | Root Crystal Wisp | วิญญาณรากคริสตัล | seaD2b | FLOATING |
| 08 Sea | 36 | Abyss Squid | หมึกห้วงลึก | seaD2c | FLOATING |
| 08 Sea | 37 | Kraken Spawnling | ลูกคราเคน | seaD2c | MANY LEGS |
