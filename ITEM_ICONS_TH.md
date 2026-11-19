# Aetherfall — รายการรูปไอเทมที่ต้องเจน

## วิธีใส่รูปเข้าเกม
1. เซฟรูปเป็น PNG พื้นหลังโปร่งใส ขนาดแนะนำ **128×128** ตั้งชื่อตามคอลัมน์ "ไฟล์" ด้านล่าง
2. วางในโฟลเดอร์ `assets/items/`
3. เปิด `assets/items/icons.json` แล้วเพิ่มชื่อ (ไม่ต้องมี .png) ลงไป เช่น `["hp1","hp2","m_vik_0_a"]`
4. รีโหลดเกม — ตัวไหนยังไม่มีรูป เกมใช้ไอคอนวาดด้วยโค้ดแทน (ไม่พัง)
(หรือส่งรูปมาให้ผม ผมใส่และอัปเดต icons.json ให้)

## พรอมต์กลาง (ส่งเป็นข้อความแรกใน ChatGPT ทุกแชท + แนบรูปฮีโร่ให้ก๊อปสไตล์)
```
I am making inventory item icons for my 2D RPG. Copy the art style of the attached character image: hand-painted chibi Ragnarok Online style, clean thick dark-brown outline (not black), soft cel shading with 2–3 tones, warm slightly desaturated palette, soft light from the top-left.
Rules for EVERY icon: one single object, centered, 3/4 view, fills about 80% of a square canvas, transparent background, no text, no frame, no shadow on the ground, readable at small size (32px).
When I send a list, draw ALL of them on one sheet in a grid with equal square cells and clear gaps, in the order given.
Reply OK and wait.
```
จากนั้นส่งทีละกลุ่ม เช่น `Draw these 6 icons: 1) small round glass potion bottle with bright red liquid ... 2) ...` แล้วตัดแต่ละช่องเป็นไฟล์ (หรือส่งชีตมาให้ผมตัด)

**จำนวนรวมที่จำเป็น ≈ 196 รูป** (กลุ่ม 1–4) · กลุ่ม 5 ไม่จำเป็น

---

## 1. ไอเทมใช้ (18 รูป) — ทำก่อน
| ไฟล์ | ชื่อ | ไทย | พรอมต์ (วัตถุ) |
|---|---|---|---|
| `hp1.png` | Red Potion | ยาแดง | small round glass potion bottle with bright red liquid, cork stopper |
| `hp2.png` | Orange Potion | ยาส้ม | medium glass potion bottle with orange liquid, cork |
| `hp3.png` | Yellow Potion | ยาเหลือง | tall glass potion bottle with glowing yellow liquid |
| `hp4.png` | White Potion | ยาขาว | elegant crystal potion bottle with milky white glowing liquid |
| `sp1.png` | Blue Herb | สมุนไพรฟ้า | bundle of fresh blue herb leaves tied with string |
| `sp2.png` | Blue Potion | ยาฟ้า | round glass potion bottle with deep blue liquid |
| `sp3.png` | Mana Elixir | ยาน้ำมานา | ornate flask with swirling violet mana liquid and sparkles |
| `elixir.png` | World Tree Dew | น้ำค้างต้นไม้โลก | small leaf-shaped vial holding a single glowing green dewdrop from a sacred tree |
| `food_atk.png` | Roast Boar | หมูป่าย่าง | roasted boar leg on a wooden plate |
| `food_def.png` | Iron Stew | สตูว์เหล็ก | bowl of thick stew with an iron spoon |
| `food_vit.png` | Hearty Soup | ซุปบำรุง | steaming bowl of hearty vegetable soup |
| `food_agi.png` | Wind Dumpling | เกี๊ยวสายลม | three green dumplings on a leaf with wind swirls |
| `food_tal.png` | Star Tea | ชาดวงดาว | cup of tea with tiny stars floating above |
| `food_cha.png` | Honey Cake | เค้กน้ำผึ้ง | slice of honey cake dripping golden honey |
| `manual.png` | Battle Manual | คู่มือการต่อสู้ | old leather-bound battle manual book with crossed swords on the cover |
| `ret.png` | Return Scroll | ม้วนกลับเมืองเกิด | rolled parchment scroll with a red wax seal and a house symbol |
| `capscroll.png` | Capital Scroll | ม้วนวาร์ปเมืองหลวง | rolled golden parchment scroll with a crown seal |
| `wing.png` | Fly Feather | ขนนกวาร์ป | single light-blue feather with a soft sparkle |

## 2. เครื่องมือ / แร่ / ผลึก / หินออฟ (25 รูป)
| ไฟล์ | ชื่อ | ไทย | พรอมต์ (วัตถุ) |
|---|---|---|---|
| `ore1.png` | Refine Ore T1 | แร่ตีบวก ขั้น 1 | grey rough ore chunk with silver flecks |
| `ore2.png` | Refine Ore T2 | แร่ตีบวก ขั้น 2 | pale blue crystal ore chunk |
| `ore3.png` | Refine Ore T3 | แร่ตีบวก ขั้น 3 | purple crystal ore chunk |
| `ore4.png` | Refine Ore T4 | แร่ตีบวก ขั้น 4 | golden glowing crystal ore chunk |
| `drill.png` | Drill | สว่านเจาะรู | small hand drill tool with wooden handle and steel bit |
| `pliers.png` | Orb Pliers | คีมถอดหิน | blacksmith pliers |
| `guard.png` | Guard Stone | หินกันแตก | small glowing blue shield-shaped protection stone |
| `trait_vik.png` | Trait Crystal | ผลึกนิสัย ฟรอสต์เฮล์ม | ice-blue magic crystal shard with a carved Norse rune |
| `trait_azt.png` | Trait Crystal | ผลึกนิสัย โชชิตลัน | jade-green magic crystal shard with an Aztec sun glyph |
| `trait_grk.png` | Trait Crystal | ผลึกนิสัย ไอโอเนีย | pale gold marble-like crystal shard with a Greek laurel mark |
| `trait_egy.png` | Trait Crystal | ผลึกนิสัย เคเมท | amber-gold crystal shard with an Egyptian ankh mark |
| `trait_jpn.png` | Trait Crystal | ผลึกนิสัย ฮาคุเซ็น | sakura-pink crystal shard with a Japanese crest mark |
| `orb_atk.png` | ATK Orb | หินออฟ ATK | round polished red magic orb with a sword emblem |
| `orb_def.png` | DEF Orb | หินออฟ DEF | round polished steel-grey magic orb with a shield emblem |
| `orb_agi.png` | AGI Orb | หินออฟ AGI | round polished mint-green magic orb with a wind emblem |
| `orb_vit.png` | VIT Orb | หินออฟ VIT | round polished orange magic orb with a heart emblem |
| `orb_int.png` | INT Orb | หินออฟ INT | round polished blue magic orb with an eye emblem |
| `orb_cha.png` | CHA Orb | หินออฟ CHA | round polished pink magic orb with a star emblem |
| `orb_tal.png` | TAL Orb | หินออฟ TAL | round polished violet magic orb with a magic circle emblem |
| `orb_lck.png` | LCK Orb | หินออฟ LCK | round polished yellow magic orb with a clover emblem |

หินออฟ: ทำ **8 รูป** (`orb_<สเตตัส>.png`) พอ เกมใส่เลขขั้นให้เอง · ถ้าอยากให้แต่ละขั้นต่างกัน ทำเพิ่มเป็น `orb_atk_1.png` … `orb_lck_4.png` (32 รูป)

## 3. วัตถุดิบ (100 รูป) — ใช้ชื่ออังกฤษเป็นพรอมต์ได้เลย เช่น "Frost Fur — a fluffy tuft of white fur with frost crystals"
| ไฟล์ | ชื่อ | ไทย | ระดับ |
|---|---|---|---|
| `m_vik_0_a.png` | Frost Fur | ขนน้ำแข็ง | 1 |
| `m_vik_0_b.png` | Pine Resin (rare) | ยางสน | 1 |
| `m_vik_1_a.png` | Wolf Hide | หนังหมาป่า | 2 |
| `m_vik_1_b.png` | Ice Crystal (rare) | ผลึกน้ำแข็ง | 2 |
| `m_vik_2_a.png` | Rune Pebble | หินรูน | 3 |
| `m_vik_2_b.png` | Moor Moss (rare) | มอสทุ่งรูน | 3 |
| `m_vik_3_a.png` | Seal Blubber | ไขแมวน้ำ | 4 |
| `m_vik_3_b.png` | Narwhal Horn (rare) | งานาร์วาล | 4 |
| `m_vik_4_a.png` | Troll Straw | ฟางโทรล | 5 |
| `m_vik_4_b.png` | Raider Iron (rare) | เหล็กโจรไวกิ้ง | 5 |
| `m_vik_5_a.png` | Dwarven Ore | แร่คนแคระ | 6 |
| `m_vik_5_b.png` | Forge Ember (rare) | ถ่านเตาหลอม | 6 |
| `m_vik_6_a.png` | Shadow Pelt | หนังเงา | 7 |
| `m_vik_6_b.png` | Witch Charm (rare) | เครื่องรางแม่มด | 7 |
| `m_vik_7_a.png` | Yeti Horn | เขาเยติ | 8 |
| `m_vik_7_b.png` | Mammoth Tusk (rare) | งาแมมมอธ | 8 |
| `m_vik_8_a.png` | Draugr Chain | โซ่เดรากร์ | 9 |
| `m_vik_8_b.png` | Glacier Heart (rare) | แก่นธารน้ำแข็ง | 9 |
| `m_vik_9_a.png` | Gleipnir Thread | ด้ายเกลปเนียร์ | 10 |
| `m_vik_9_b.png` | Fenrir Fang (rare) | เขี้ยวเฟนเรียร์ | 10 |
| `m_azt_0_a.png` | Jungle Leaf | ใบไม้ป่า | 1 |
| `m_azt_0_b.png` | Dart Frog Slime (rare) | เมือกกบลูกดอก | 1 |
| `m_azt_1_a.png` | Monkey Fur | ขนลิง | 2 |
| `m_azt_1_b.png` | Bright Feather (rare) | ขนนกสีสด | 2 |
| `m_azt_2_a.png` | Maize Husk | เปลือกข้าวโพด | 3 |
| `m_azt_2_b.png` | Cacao Bean (rare) | เมล็ดโกโก้ | 3 |
| `m_azt_3_a.png` | Croc Scale | เกล็ดจระเข้ | 4 |
| `m_azt_3_b.png` | Swamp Pearl (rare) | ไข่มุกหนองน้ำ | 4 |
| `m_azt_4_a.png` | Serpent Skin | หนังงู | 5 |
| `m_azt_4_b.png` | Stone Mask (rare) | หน้ากากหิน | 5 |
| `m_azt_5_a.png` | Bat Wing | ปีกค้างคาว | 6 |
| `m_azt_5_b.png` | Obsidian Shard (rare) | เศษออบซิเดียน | 6 |
| `m_azt_6_a.png` | Jaguar Pelt | หนังจากัวร์ | 7 |
| `m_azt_6_b.png` | Eagle Plume (rare) | ขนอินทรี | 7 |
| `m_azt_7_a.png` | Jade Chip | เศษหยก | 8 |
| `m_azt_7_b.png` | Sun Gold (rare) | ทองสุริยะ | 8 |
| `m_azt_8_a.png` | Temple Stone | หินวิหาร | 9 |
| `m_azt_8_b.png` | Quetzal Plume (rare) | ขนเควตซัล | 9 |
| `m_azt_9_a.png` | Sunstone | หินสุริยะ | 10 |
| `m_azt_9_b.png` | Blood Jade (rare) | หยกโลหิต | 10 |
| `m_grk_0_a.png` | Olive Branch | กิ่งมะกอก | 1 |
| `m_grk_0_b.png` | Goat Horn (rare) | เขาแพะ | 1 |
| `m_grk_1_a.png` | Marble Chip | เศษหินอ่อน | 2 |
| `m_grk_1_b.png` | Crab Shell (rare) | กระดองปูหินอ่อน | 2 |
| `m_grk_2_a.png` | Satyr Fur | ขนซาเทอร์ | 3 |
| `m_grk_2_b.png` | Honeycomb (rare) | รังผึ้ง | 3 |
| `m_grk_3_a.png` | Bronze Scrap | เศษทองแดง | 4 |
| `m_grk_3_b.png` | Philosopher Scroll (rare) | ม้วนคัมภีร์ปราชญ์ | 4 |
| `m_grk_4_a.png` | Siren Scale | เกล็ดไซเรน | 5 |
| `m_grk_4_b.png` | Harpy Talon (rare) | กรงเล็บฮาร์ปี้ | 5 |
| `m_grk_5_a.png` | Centaur Hair | ขนเซนทอร์ | 6 |
| `m_grk_5_b.png` | Cyclops Tooth (rare) | ฟันไซคลอปส์ | 6 |
| `m_grk_6_a.png` | Hecate Ash | เถ้าเฮคาที | 7 |
| `m_grk_6_b.png` | Cerberus Fang (rare) | เขี้ยวเคอร์เบอรัส | 7 |
| `m_grk_7_a.png` | Spartan Crest | พู่หมวกสปาร์ตัน | 8 |
| `m_grk_7_b.png` | Medusa Scale (rare) | เกล็ดเมดูซ่า | 8 |
| `m_grk_8_a.png` | Styx Water | น้ำสติกซ์ | 9 |
| `m_grk_8_b.png` | Minotaur Horn (rare) | เขามิโนทอร์ | 9 |
| `m_grk_9_a.png` | Griffin Feather | ขนกริฟฟิน | 10 |
| `m_grk_9_b.png` | Ambrosia (rare) | แอมโบรเซีย | 10 |
| `m_egy_0_a.png` | Desert Sand | ทรายทะเลทราย | 1 |
| `m_egy_0_b.png` | Scorpion Tail (rare) | หางแมงป่อง | 1 |
| `m_egy_1_a.png` | Linen Wrap | ผ้าลินิน | 2 |
| `m_egy_1_b.png` | Ibis Feather (rare) | ขนไอบิส | 2 |
| `m_egy_2_a.png` | Fox Fur | ขนจิ้งจอกทราย | 3 |
| `m_egy_2_b.png` | Scarab Shell (rare) | กระดองสคารับ | 3 |
| `m_egy_3_a.png` | Granite Chunk | ก้อนแกรนิต | 4 |
| `m_egy_3_b.png` | Papyrus (rare) | กระดาษปาปิรุส | 4 |
| `m_egy_4_a.png` | Mummy Cloth | ผ้ามัมมี่ | 5 |
| `m_egy_4_b.png` | Jackal Fang (rare) | เขี้ยวจิ้งจอก | 5 |
| `m_egy_5_a.png` | Vulture Plume | ขนแร้ง | 6 |
| `m_egy_5_b.png` | Embalming Oil (rare) | น้ำมันอาบศพ | 6 |
| `m_egy_6_a.png` | Tomb Dust | ฝุ่นสุสาน | 7 |
| `m_egy_6_b.png` | Canopic Jar (rare) | โถคาโนปิก | 7 |
| `m_egy_7_a.png` | Sand Worm Hide | หนังหนอนทราย | 8 |
| `m_egy_7_b.png` | Ankh Shard (rare) | เศษอังค์ | 8 |
| `m_egy_8_a.png` | Anubis Cloth | ผ้าอนูบิส | 9 |
| `m_egy_8_b.png` | Pharaoh Gold (rare) | ทองฟาโรห์ | 9 |
| `m_egy_9_a.png` | Djinn Smoke | ควันจินน์ | 10 |
| `m_egy_9_b.png` | Eye of Ra (rare) | ดวงตาแห่งรา | 10 |
| `m_jpn_0_a.png` | Sakura Petal | กลีบซากุระ | 1 |
| `m_jpn_0_b.png` | Tanuki Leaf (rare) | ใบไม้ทานุกิ | 1 |
| `m_jpn_1_a.png` | Rice Straw | ฟางข้าว | 2 |
| `m_jpn_1_b.png` | Kappa Plate (rare) | จานกัปปะ | 2 |
| `m_jpn_2_a.png` | Bamboo Strip | ซีกไผ่ | 3 |
| `m_jpn_2_b.png` | Panda Fur (rare) | ขนแพนด้าแดง | 3 |
| `m_jpn_3_a.png` | Onsen Stone | หินออนเซ็น | 4 |
| `m_jpn_3_b.png` | Steam Crystal (rare) | ผลึกไอน้ำ | 4 |
| `m_jpn_4_a.png` | Fox Tail | หางจิ้งจอก | 5 |
| `m_jpn_4_b.png` | Tengu Feather (rare) | ขนเท็งงุ | 5 |
| `m_jpn_5_a.png` | Pirate Rope | เชือกโจรสลัด | 6 |
| `m_jpn_5_b.png` | Ink Sac (rare) | ถุงหมึก | 6 |
| `m_jpn_6_a.png` | Shuriken | ดาวกระจาย | 7 |
| `m_jpn_6_b.png` | Toad Oil (rare) | น้ำมันคางคก | 7 |
| `m_jpn_7_a.png` | Spirit Talisman | ยันต์วิญญาณ | 8 |
| `m_jpn_7_b.png` | Ronin Steel (rare) | เหล็กโรนิน | 8 |
| `m_jpn_8_a.png` | Oni Horn | เขาโอนิ | 9 |
| `m_jpn_8_b.png` | Tamahagane (rare) | เหล็กทามาฮากาเนะ | 9 |
| `m_jpn_9_a.png` | Shogun Seal | ตราโชกุน | 10 |
| `m_jpn_9_b.png` | Raiju Spark (rare) | ประกายไรจู | 10 |

## 4. ของคราฟต์ (55 รูป · 1 รูปต่อเมืองต่อชิ้น ใช้ทุกระดับ)
สไตล์เมือง: **vik** = Viking/Norse fur, iron and runes · **azt** = Aztec feathers, jade and obsidian · **grk** = Ancient Greek bronze and marble · **egy** = Ancient Egyptian gold, lapis and linen · **jpn** = Feudal Japanese lacquer, silk and steel

| ไฟล์ | อะไร |
|---|---|
| `eq_<เมือง>_armor.png` | body armor ในสไตล์เมืองนั้น (5 รูป: eq_vik_armor, eq_azt_armor, eq_grk_armor, eq_egy_armor, eq_jpn_armor) |
| `eq_<เมือง>_top.png` | helmet (5 รูป) |
| `eq_<เมือง>_garment.png` | cloak (5 รูป) |
| `eq_<เมือง>_shoes.png` | pair of boots (5 รูป) |
| `eq_<เมือง>_acc.png` | charm amulet (5 รูป) |
| `wp_<เมือง>_wolf.png` | two-handed greataxe (5 รูป) |
| `wp_<เมือง>_rhino.png` | pair of fist knuckles (5 รูป) |
| `wp_<เมือง>_owl.png` | crossbow (5 รูป) |
| `wp_<เมือง>_jaguar.png` | pair of curved daggers (5 รูป) |
| `wp_<เมือง>_croc.png` | spear (5 รูป) |
| `wp_<เมือง>_axolotl.png` | pair of magic bracelets (5 รูป) |

ตัวอย่าง: `wp_jpn_wolf.png` = "two-handed greataxe in Feudal Japanese lacquer, silk and steel style"

## 5. ของเริ่มต้น/ทดสอบ (ไม่จำเป็น)
`eq_greataxe` · `eq_cleaver` · `eq_hatchet` · `eq_buckler` · `eq_wolfhelm` · `eq_vikinghelm` · `eq_visor` · `eq_fangmask` · `eq_mail` · `eq_cape` · `eq_boots` · `eq_ringFury` · `eq_ringSwift` · `eq_ringPrec` · `eq_clipLuck` · `eq_nordicCrossbow` · `eq_whiteNightBow` · `eq_obsidianDaggers` · `eq_sunDaggers` · `eq_ironGauntlets` · `eq_titanKnuckles` · `eq_jadeBracelets` · `eq_tideBracelets` · `eq_obsidianSpear` · `eq_templeSpear`

---

## ไอเทมใช้ — ค่าในเกม
| ไอเทม | ผล | Lv | ราคา | หาได้ |
|---|---|---|---|---|
| ยาแดง / ส้ม / เหลือง / ขาว | HP +150 / 450 / 1,000 / 1,800 | 1 / 20 / 45 / 70 | 25 / 120 / 450 / 1,100z | ร้าน · มอนดรอป 3% |
| สมุนไพรฟ้า / ยาฟ้า / ยาน้ำมานา | SP +50 / 150 / 300 | 1 / 30 / 60 | 60 / 300 / 900z | ร้าน · มอนดรอป 1.5% |
| น้ำค้างต้นไม้โลก | HP + SP เต็ม | 1 | – | ดันเจี้ยน 0.2% |
| อาหาร 6 แบบ | ATK/DEF/VIT/AGI/TAL/CHA +5 (+2 ทุก 10 เลเวล) 10 นาที · ใช้ได้ทีละ 1 | 1 | 1,500z | ร้าน · มอนดรอป 0.5% |
| คู่มือการต่อสู้ | EXP +50% 30 นาที | 1 | 20,000z | เมืองหลวง |
| ม้วนกลับเมืองเกิด / ม้วนวาร์ปเมืองหลวง / ขนนกวาร์ป | วาร์ปกลับบ้าน / ไปเมืองหลวง / จุดสุ่มในแมพ | 1 | 300 / 800 / 60z | ร้าน |
- ใช้: ดับเบิลคลิกในแท็บ Item · **F** = ยา HP ที่เหมาะที่สุด · **V** = ยา SP · ยาคูลดาวน์ 0.6 วิ
- ตัวละครใหม่ได้ ยาแดง 20 · สมุนไพรฟ้า 10 · ม้วนกลับเมือง 2 · ขนนกวาร์ป 5
