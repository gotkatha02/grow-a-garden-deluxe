# Aetherfall — ออกแบบมอนสเตอร์ประจำแมพ (ฉบับร่าง)

สถานะ: **เสร็จแล้ว: โซนไวกิ้ง (15 แมพ)** · ยังไม่ทำ: Capital, Aztec, Egypt, Greek, Japan

## Prompt กลางสำหรับ ChatGPT (ใช้กับทุกตัว — แค่แทน [DESCRIPTION])
```
2D game sprite sheet of a monster for an isometric Ragnarok-Online-style action RPG.
Hand-painted cute-but-dangerous cartoon style, soft shading, thick dark outline, chibi proportions.
Character: [DESCRIPTION]
Sheet layout: 5 rows = directions S, SE, E, NE, N (SW/W/NW will be mirrored in-game).
Columns: idle (4 frames), walk (6 frames), attack (6 frames, clear wind-up then strike), hurt (2), death (4).
Each frame in an equal-size cell, same scale, feet on the same baseline (pivot at feet), centred.
Fully transparent background, no ground shadow, no text, no frame borders, consistent palette across frames.
```
ถ้า GPT ทำทั้งชีตไม่ไหว: ให้ขอทีละท่า (เช่น "only the walk cycle, 6 frames, direction SE") แล้วเรากลับ (mirror) เอง

---
## โซนไวกิ้ง

| แมพ | Lv | มอนสเตอร์ (EN / TH) | Lv มอน | ขนาด | ดีไซน์ + [DESCRIPTION] สำหรับ prompt |
|---|---|---|---|---|---|
| snowpine ป่าสนหิมะ | 1–8 | Frostling / ฟรอสต์ลิง | 1–6 | S | (มีสไปร์แล้ว) |
| | | Snow Pup / ลูกหมาป่าหิมะ | 3–8 | S | (มีโมเดลแล้ว) |
| | | Pinecone Sprite / ภูตลูกสน | 2–7 | S | `a tiny round pinecone creature with frosty scales, stubby legs, two glowing blue eyes, a sprig of pine needles on top, hops and headbutts` |
| vikF2 หุบเขี้ยวน้ำแข็ง | 4–12 | Fang Hare / กระต่ายเขี้ยวน้ำแข็ง | 4–10 | S | `a fluffy white snow hare with two long ice-crystal fangs, frosty blue ear tips, kicks with powerful hind legs` |
| | | Big Frostling / ฟรอสต์ลิงใหญ่ | 6–12 | M | `a chubby ice-goblin made of packed snow and blue ice shards, carrying an icicle club, frost breath puffs` |
| | | Icicle Bat / ค้างคาวหินย้อยน้ำแข็ง | 8–12 | S | `a small pale-blue bat with translucent icicle wings, hanging frost drips, dives and bites` |
| vikF3 ทุ่งหินรูน | 10–18 | Rune Wisp / ภูตหินรูน | 10–16 | S | `a floating teal flame wisp orbiting a small stone carved with a glowing Norse rune, trailing sparks` |
| | | Moor Wolf / หมาป่าทุ่ง | 12–18 | M | `a grey-brown heath wolf with shaggy mane, mossy fur patches, rune-scratched collar, lunging bite` |
| | | Runestone Golem / โกเลมหินรูน | 14–18 | L | `a squat mossy standing-stone golem with glowing teal runes on its chest, boulder fists, slow ground slam` |
| vikF4 ฟยอร์ดน้ำแข็ง | 14–22 | Ice Crab / ปูหิมะ | 14–20 | S | `an orange-red crab with a shell crusted in ice, one oversized frozen claw, sideways scuttle, pinch attack` |
| | | Fjord Seal Spirit / ภูตแมวน้ำ | 16–22 | M | `a ghostly pale-blue seal spirit with a sea-foam mane and glowing eyes, slides on belly, water-bubble spit` |
| | | Narwhal Raider / นาร์วาลจอมปล้น | 18–22 | M | `an upright narwhal warrior wearing a tiny horned helmet and fur cape, its spiral tusk used as a spear` |
| vikF5 หมู่บ้านไวกิ้งร้าง | 18–26 | Raider Hound / หมาล่าเนื้อ | 18–24 | M | `a lean scarred war-hound in leather barding with iron studs, red war paint, snarling charge` |
| | | Lost Villager / ผีชาวบ้าน | 20–26 | M | `a translucent grey ghost of a Viking villager holding a lantern and a rusty pitchfork, tattered clothes` |
| | | Thatch Troll / โทรลหลังคาฟาง | 22–26 | L | `a hunched moss-green troll with a burnt straw roof on its back like a shell, swings a broken beam` |
| vikF6 ช่องเขาหมาป่า | 22–30 | Pass Wolf / หมาป่าหิมะ | 22–28 | M | (snowwolf โมเดลเดิม) |
| | | Yeti Cub / ลูกเยติ | 24–30 | M | `a round fluffy white baby yeti with blue face and big feet, throws snowballs, belly-flop attack` |
| | | Avalanche Ram / แกะเขาหิมะถล่ม | 26–30 | M | `a mountain ram with huge curled ice horns, frost-matted wool, charging headbutt with snow burst` |
| vikD1a เหมืองคนแคระ 1 | 28–36 | Mad Dwarf Ghost / วิญญาณคนแคระ | 28–34 | S | `a ghostly golden-glowing dwarf miner with a braided beard, helmet candle, swinging a spectral pickaxe` |
| | | Ore Golem / โกเลมแร่ | 30–36 | L | `a stocky golem of dark rock studded with glittering iron and gold ore veins, mine-cart wheel shoulders` |
| | | Lamp Beetle / ด้วงตะเกียง | 28–33 | S | `a beetle with a glowing amber lantern abdomen and coal-black shell, rams with its horn` |
| vikD1b เหมืองคนแคระ 2 | 36–44 | Forge Golem / โกเลมเตาหลอม | 36–44 | L | `an iron furnace golem with a molten orange belly window, chimney head puffing smoke, anvil fists` |
| | | Ice Bat Pack / ค้างคาวน้ำแข็ง | 38–44 | S | `a swarm of three small dark-blue bats with frosted wing tips flying as one cluster` |
| | | Runesmith Revenant / ช่างรูนอมตะ | 40–44 | M | `an undead dwarf smith with a soot-black beard, glowing rune hammer, leather apron, blue eye flames` |
| vikH1 ป่าสนดำ | 46–56 | Shadow Wolf / หมาป่าเงา | 46–54 | M | `a black smoke-bodied wolf with glowing violet eyes, wisps trailing from its fur, phasing lunge` |
| | | Forest Witchling / แม่มดป่า | 48–56 | M | `a small hunched witch with a bark mask, moss cloak, antler staff with a hanging bone charm, green curse magic` |
| | | Blackpine Treant / ต้นสนดำมีชีวิต | 50–56 | L | `a twisted black pine treant with a carved angry face, root legs, branch claws dripping dark sap` |
| vikH2 ทุ่งน้ำแข็งเหนือ | 52–64 | Young Yeti / เยติ | 52–60 | L | `an adult white yeti with icy blue horns, frost-crusted fists, roar and ground pound` |
| | | Tundra Wolf / หมาป่าทุนดรา | 54–64 | M | `a large white-and-grey tundra wolf with thick frost-tipped fur, ice breath` |
| | | Frost Mammoth Calf / ลูกช้างแมมมอธ | 56–64 | L | `a woolly baby mammoth with frosted brown fur, short ice tusks, stomps and trunk swipe` |
| vikD2a ถ้ำเฟนเรียร์ 1 | 58–66 | Fenrir Spawn / ลูกเฟนเรียร์ | 58–64 | M | `a dark-blue wolf pup with chain shackles on its legs, glowing ice-blue eyes and mouth` |
| | | Wolf Priest / นักบวชหมาป่า | 60–66 | M | `a robed cultist wearing a wolf-skull hood, purple robes, bone staff casting violet frost runes` |
| vikD2b ถ้ำเฟนเรียร์ 2 | 66–73 | Draugr / เดรากร์ | 66–73 | M | `an undead Viking warrior with blue-grey rotting skin, rusted chainmail, glowing blue eyes, notched sword and round shield` |
| | | Draugr Wolf / หมาป่าเดรากร์ | 66–73 | M | `a skeletal undead wolf with exposed ribs, tattered grey fur, blue soul-fire in its chest` |
| | | Chain Wraith / วิญญาณโซ่ | 68–73 | M | `a floating hooded wraith wrapped in broken iron chains (Gleipnir fragments), swings chains as whips` |
| vikD2c บัลลังก์เฟนเรียร์ | 73–80 | Fenrir Guard / องครักษ์เฟนเรียร์ | 73–80 | L | `a huge armored black wolf with iron plates and spiked collar, ice-blue mane flames` |
| | | Wolf High Priest / มหานักบวชหมาป่า | 74–80 | M | `a tall priest in crimson-and-violet robes, wolf-skull crown, floating rune circles around hands` |
| | | **BOSS** Fenrir's Shadow / เงาเฟนเรียร์ | 80 | XL | `a colossal shadow wolf of black smoke and starlight, broken chains on its neck, ice-blue eyes, roaring` |
| vikE1 สุสานเรือมังกร | 76–86 | Undying Viking / ไวกิ้งอมตะ | 76–84 | L | `a hulking undead Viking chieftain with a horned helmet, barnacles on armor, seaweed beard, huge two-handed axe` |
| | | Sea Ghost Wolf / หมาป่าวิญญาณทะเล | 78–86 | M | `a translucent sea-green ghost wolf with wave-foam fur and dripping water` |
| | | Drowned Shieldmaiden / วาลคิรีจมน้ำ | 80–86 | M | `a pale drowned shieldmaiden with wet braids, coral-encrusted shield and spear, eerie teal glow` |
| vikE2 ธารน้ำแข็งนิรันดร์ | 84–94 | Frost Giant / ยักษ์น้ำแข็ง | 84–94 | XL | `a towering blue-skinned Jotun giant with an icicle beard, glacier armor plates, carrying an ice boulder club` |
| | | Dark Valkyrie Wolf / หมาป่าวาลคิรีมืด | 86–94 | L | `a black winged wolf with dark feathered wings and a silver valkyrie helm` |
| | | Glacier Wyrmling / ลูกมังกรธารน้ำแข็ง | 88–94 | L | `a young ice dragon with crystal spikes along its back, frosty breath, small wings` |

ขนาด: S ≈ sc .8 · M ≈ 1.0 · L ≈ 1.25 · XL ≈ 1.5+ (ค่า `sc` ใน VK_MONS)
