"""Map mini-bosses (owner 2026-11-23 'อยากได้มินิบอสในแมพ พวกนี้ไม่มีแมคคานิคอะไร ออกแบบและขอพร้อมหน้าตาหน่อย').
usage: python3 tools/miniboss_prompts.py
  -> miniboss_prompts/1_viking … 6_capital.txt  (ChatGPT files: one master picture per mini-boss, 'next' / 'redo' / number)
  -> MINI_BOSS_TH.md                            (Thai design doc: rules + every mini-boss, written from the same data)
One mini-boss on every field / dungeon map that has no boss (56): F1–F6, D1a, D2a, D2b of each land + the capital ring,
the catacombs and the rift. E1 / E2 / D2c keep their slots for the MVP / main bosses. Edit the data here and re-run."""
import os

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')

# map band (game levels, from MAP_ZONE) — the mini-boss is band top + 2, capped at 60
BAND = {'F1': (1, 6), 'F2': (1, 9), 'F5': (6, 12), 'F3': (8, 17), 'F6': (11, 17), 'F4': (15, 23), 'D1a': (21, 30), 'D2a': (55, 56), 'D2b': (56, 58),
        'egyD1a': (35, 44), 'cN': (15, 21), 'cE': (15, 21), 'cS': (15, 21), 'cW': (15, 21), 'cNE': (20, 27), 'cSW': (20, 27),
        'cata1': (27, 32), 'cata2': (32, 37), 'rift1': (55, 56), 'rift2': (56, 58), 'rift3': (58, 60)}

def lvl(mid):
    k = mid if mid in BAND else ('F1' if mid == 'snowpine' else mid[3:])
    return min(60, BAND[k][1] + 2), BAND[k]

# (map id, map th, key, EN name, TH name, kin (map monster it leads), lore th, look en)
LANDS = [
 ('1_viking', 'VIKING', 'ไวกิ้ง', 'the Norse lands (snowy pine woods, fjords, rune moors, Viking ruins, dwarf mines, the wolf cult of Fenrir)', [
  ('snowpine', 'ป่าสนหิมะ', 'alphaSnowfang', 'Alpha Snowfang', 'สโนว์แฟง แม่หมาป่าหิมะ', 'Snow Pup',
   'แม่ของลูกหมาป่าหิมะทั้งป่า ไม่ชอบรังแกใคร แต่ใครตีลูกของนางก็เจอดี',
   "the mother of the snow pups — a big, very fluffy white she-wolf with ice-blue eyes, ice-blue ear tips and paws like her pups, frost-tipped fur, a carved wooden rune collar with a red wool tassel, a little crown of pinecones and icicles, one torn ear from old fights. Protective and proud, not evil."),
  ('vikF2', 'หุบเขี้ยวน้ำแข็ง', 'frostlingKing', 'Frostling King', 'ราชาฟรอสต์ลิง', 'Big Frostling',
   'ก้อนหิมะที่โตที่สุดในหุบ ตั้งตัวเป็นราชาของฟรอสต์ลิงตัวน้อย',
   "the king of the frostlings (fluffy white snow-yeti creatures): a huge round body of fluffy white snow-fur with stubby arms and legs, a crest of big blue ice crystals on its head and back, glowing blue eyes, a long beard of blue ice crystals, a crown of icicles, a white fur cape with a blue snowflake pattern, and a big ice-crystal club topped with a glowing snowflake."),
  ('vikF5', 'หมู่บ้านไวกิ้งร้าง', 'thatchChief', 'Thatch Troll Chieftain', 'หัวหน้าโทรลหลังคาฟาง', 'Thatch Troll',
   'โทรลที่รื้อหลังคาบ้านยาวทั้งหลังมาห่มตัว แล้วยึดหมู่บ้านร้างเป็นของตัวเอง',
   "a hulking troll with grey-brown warty skin and teal moss patches (never green), a huge pink nose and two tusks, a whole thatched roof of golden straw with a little stone chimney on its back like a shell, a broken wooden door as a shield, a ship's oar as a club, an iron chieftain's arm-ring, and a carved dragon-head from a longship tied to its shoulder as a trophy."),
  ('vikF3', 'ทุ่งหินรูน', 'elderRunestone', 'Elder Runestone', 'หินรูนผู้เฒ่า', 'Runestone Golem',
   'หินตั้งที่เก่าแก่ที่สุดในทุ่ง ตื่นขึ้นเมื่ออีกาของโอดินมาเกาะ',
   "an ancient tall golem built of grey standing stones carved with glowing ice-blue runes, frost-white lichen patches, a crown of five small standing stones on its head, a long beard of frost-white lichen, and a black raven perched on its shoulder. Slow, heavy and wise."),
  ('vikF6', 'ช่องเขาหมาป่า', 'avalancheKing', 'Avalanche Ram King', 'ราชาแกะเขาหิมะถล่ม', 'Avalanche Ram',
   'ทุกครั้งที่มันพุ่งชนหน้าผา หิมะจะถล่มลงมาทั้งช่องเขา',
   "a massive mountain ram with enormous spiral horns of clear blue ice crystal, a thick cream-white fleece with snow piled on its back, a grey face, a big brass bell on a leather collar, a bronze ring carved with a rune on one horn, little icicles in its beard, fierce yellow eyes, head lowered ready to charge."),
  ('vikF4', 'ฟยอร์ดน้ำแข็ง', 'narwhalJarl', 'Narwhal Jarl', 'จาร์ลนาร์วาล', 'Narwhal Raider',
   'หัวหน้าโจรทะเลแห่งฟยอร์ด งางาเดียวของมันเจาะเรือมาแล้วนับร้อยลำ',
   "a narwhal sea-raider chieftain standing on two flippers: a mottled blue-grey narwhal body with a long spiral ivory tusk, a horned Viking helmet, a fur-trimmed red sea cloak, a round shield painted with a wave, a boarding axe, gold arm rings, and barnacles on its back."),
  ('vikD1a', 'เหมืองคนแคระ ชั้น 1', 'grimbolt', 'Mad Foreman Grimbolt', 'กริมโบลต์ หัวหน้าคนงานเหมืองคลั่ง', 'Mad Dwarf Ghost',
   'ผีหัวหน้าคนงานที่ยังทวงหนี้ค่าแร่จากทุกคนที่เดินผ่าน ทั้งที่ตายไปร้อยปีแล้ว',
   "the ghost of a dwarf mine foreman: a stout dwarf with dusty brown skin and clothes, wild glowing yellow eyes, a long braided white beard full of ore dust, a dented iron mining helmet with a big lit candle on top, a giant double-headed pickaxe and a ledger of debts chained to his belt; below the waist his body ends in a short curled glowing golden ghost tail (painted solid, not see-through)."),
  ('vikD2a', 'ถ้ำเฟนเรียร์ ชั้น 1', 'gleipnirMatriarch', 'Gleipnir Matriarch', 'มารดาช่างทอเกลปเนียร์', 'Gleipnir Weaver',
   'แมงมุมแม่ที่ทอโซ่เวทเกลปเนียร์เส้นแรก — โซ่ที่ใช้มัดเฟนเรียร์',
   "a huge spider matriarch with a midnight-blue carapace etched with glowing silver runes, eight long legs ringed with silver bands, six ice-blue eyes under a crown of silver runes, a shining silver ribbon (the magic chain Gleipnir) streaming from its spinnerets, and a little spindle wound with silver thread on its back."),
  ('vikD2b', 'ถ้ำเฟนเรียร์ ชั้น 2', 'draugrJarl', 'Draugr Jarl', 'จาร์ลเดรากร์', 'Draugr',
   'จาร์ลผู้ฟื้นจากเรือฝังศพ ยังนำทัพคนตายไปรับใช้ลัทธิหมาป่า',
   "an undead Viking chieftain risen from a ship burial: tall and gaunt with grey-blue skin, glowing frost-blue eyes, a rusted gilded helmet with a face mask, a tattered blue cloak embroidered with a gold longship, rusted chainmail, a broad rune sword and a cracked round shield, chains and ship rivets hanging from his belt."),
 ]),
 ('2_aztec', 'AZTEC', 'แอซเท็ก', 'the Aztec lands (jungles, swamps, corn fields, ruined pyramids, sun temples)', [
  ('aztF1', 'ป่าหยก', 'leafcutterQueen', 'Leafcutter Ant Queen', 'ราชินีมดตัดใบ', 'Leafcutter Ant',
   'ราชินีของมดตัดใบ เดินทัพพร้อมกลีบดอกไม้ยักษ์ที่กางเป็นร่มกันแดด',
   "a big glossy rust-red ant queen with a huge head and strong mandibles, a gold Aztec crown plate and turquoise beads, a long striped abdomen, small folded wings, holding a giant yellow-and-orange autumn leaf over her head like a parasol (never green)."),
  ('aztF2', 'น้ำตกเซโนเต', 'tapirGuardian', 'Old Tapir Guardian', 'สมเสร็จผู้เฒ่า', 'Baby Tapir',
   'สมเสร็จแก่ที่เลี้ยงลูกสมเสร็จทั้งป่า หลังมันแบกรูปเคารพเทพข้าวโพดไว้เสมอ',
   "a big gentle old tapir with a dark-brown coat and a few faded cream stripes from its youth, a short flexible snout with a gold nose ring, a woven red-and-yellow blanket on its back with corn cobs and a little stone god idol tied on, sleepy wise eyes."),
  ('aztF5', 'ซากงูขนนก', 'macawCaptain', 'Macaw Raider Captain', 'กัปตันโจรมาคอว์', 'Macaw Raider',
   'กัปตันนกมาคอว์ที่ปล้นทองจากวิหาร แล้วหัวเราะเสียงดังลั่นป่า',
   "a big scarlet macaw bird-warrior standing on two legs: bright red, yellow and blue feathers, a tall Aztec feather headdress with a gold crest and turquoise discs, gold step-fret armour plates, a feather cape, a red cloth tied round its head like a pirate, an obsidian-edged blade in one claw and a bulging sack of stolen gold in the other, a cocky grin on its big hooked beak."),
  ('aztF3', 'ไร่ข้าวโพด', 'cornMother', 'Corn Mother', 'แม่ข้าวโพด', 'Corn Spirit',
   'วิญญาณแม่ของทุ่งข้าวโพด ใจดีกับชาวนา แต่ไม่ให้อภัยคนขโมยข้าว',
   "a tall spirit of the maize fields: her body is a golden ear of corn, long flowing hair of pale corn silk, a dress of dry cream corn husks, a crown of red, blue and yellow corn kernels, a staff wrapped in husks with a gold sun disc on top, glowing amber eyes. Motherly but fierce."),
  ('aztF6', 'ทางยกสูงกลางป่า', 'vineSnapperElder', 'Elder Vine Snapper', 'เถาวัลย์กินคนพันปี', 'Vine Snapper',
   'เถาวัลย์กินคนที่แก่ที่สุดในป่า เลื้อยพรางตัวในพุ่มไม้ กินเสือจากัวร์ไปแล้วสามตัว',
   "a giant plant-lizard, much bigger than its kin: a long red snapping snout full of sharp white teeth, a body of overlapping teal-blue leaves and coiled teal vines (never green) with crimson spots, thorny vine tail, a big gold Aztec headdress with turquoise discs and teal-blue leaf plumes, a gold ring around its neck, glowing yellow nectar dripping from its jaws."),
  ('aztF4', 'บึงชินัมปา', 'leechQueen', 'Bog Leech Queen', 'ราชินีปลิงบึง', 'Swamp Leech',
   'ปลิงยักษ์ใต้โคลน ดูดเลือดได้เป็นถัง แต่งตัวด้วยทองที่ได้จากนักผจญภัย',
   "a huge fat swamp leech queen: a teal-and-pink striped segmented body, a round pink sucker mouth ringed with tiny teeth, a big Aztec feather headdress with gold discs and turquoise beads, a red patterned blanket with gold trims draped over her back, gold rings along her body, mud dripping from her sides."),
  ('aztD1a', 'ถ้ำเทพค้างคาว ชั้น 1', 'glowwormMother', 'Firefly Queen', 'ราชินีหิ่งห้อยถ้ำ', 'Glowworm Swarm',
   'ราชินีของฝูงแมลงเรืองแสงทั้งถ้ำ แสงสีทองของนางล่อเหยื่อเข้ามาในความมืด',
   "a giant firefly queen of the bat-god cave: a dark purple bug body standing on thin legs, a big glowing golden abdomen, two long antennae each ending in a glowing lantern bulb, large amber wings (painted solid, not see-through), big round amber eyes, and a gold Aztec crown with turquoise discs."),
  ('aztD2a', 'พีระมิดสุริยะ ชั้น 1', 'obsidianHigh', 'High Obsidian Priest', 'มหานักบวชออบซิเดียน', 'Obsidian Priest',
   'นักบวชผู้มองอนาคตผ่านกระจกออบซิเดียน และเรียกพลังจากคริสตัลม่วงบนยอดคทา',
   "a tall high priest in long dark robes with gold trims: a polished black obsidian skull mask with glowing violet eyes, a huge headdress of purple and black feathers with a gold crest, gold ear spools, red body-paint stripes, a tall gold staff topped with a big violet obsidian crystal in one hand and a black obsidian mirror with a gold rim in the other."),
  ('aztD2b', 'พีระมิดสุริยะ ชั้น 2', 'sunSentinelPrime', 'Sun Sentinel Prime', 'จอมทหารเฝ้าสุริยะ', 'Sun Sentinel',
   'รูปปั้นยามคนแรกของพีระมิด ตื่นทุกครั้งที่ดวงอาทิตย์ตรงหัว',
   "a towering guard statue of carved yellow stone with gold inlay: a stern carved face under a tall helmet of carved stone feathers topped with a sun disc, glowing white-gold eyes, a turquoise mosaic chest plate, a big sun-disc shield on one arm and a huge stone longbow with a sun-ray arrow in the other hand."),
 ]),
 ('3_egypt', 'EGYPT', 'อียิปต์', 'the Egyptian lands (desert dunes, the Nile, oases, ruined temples, royal tombs)', [
  ('egyF1', 'โอเอซิสริมไนล์', 'scarabKing', 'Scarab Roller King', 'ราชาด้วงกลิ้ง', 'Scarab',
   'ด้วงที่กลิ้งลูกทรายทองลูกใหญ่ที่สุดในทะเลทราย ภูมิใจในลูกทรายของมันมาก',
   "a big glossy lapis-blue scarab beetle with gold edges, standing on its back legs behind a giant ball of shining golden sand that it rolls, a tiny gold sun-disc crown, a proud happy face."),
  ('egyF2', 'สามเหลี่ยมปาปิรัส', 'ibisElder', 'Sacred Ibis Elder', 'นกไอบิสผู้เฒ่า', 'Ibis',
   'นกอาลักษณ์ของวิหาร จดชื่อทุกคนที่ทำร้ายลูกฮิปโปริมแม่น้ำ',
   "a tall white ibis bird with black wing tips, a black head and a long curved black beak, standing upright like a temple scribe, a blue-and-gold collar, a reed pen in one wing and a papyrus scroll in the other, a little gold moon disc on its head."),
  ('egyF5', 'หุบผากษัตริย์', 'cobraKing', 'King Cobra of the Valley', 'ราชางูเห่าแห่งหุบผา', 'Cobra',
   'งูเห่าที่ฟาโรห์เคยยกเป็นเครื่องราง พอฟาโรห์ตายมันก็ตั้งตัวเป็นราชา',
   "a huge rearing cobra with golden-brown scales and a very wide hood marked with a big blue eye pattern and edged like a blue-and-gold striped pharaoh headdress, glowing ruby eyes, a gold bead collar, long fangs, its body coiled under it."),
  ('egyF3', 'เนินทรายทอง', 'fennecChief', 'Fennec Bandit Chief', 'หัวหน้าโจรเฟนเนก', 'Desert Fox',
   'จิ้งจอกหูโตหัวหน้าโจร ได้ยินเสียงเหรียญตกจากอีกฟากเนินทราย',
   "a sly fennec fox with enormous ears and cream fur, standing on two legs, a striped desert scarf over its mouth, a curved khopesh sword, a belt hung with stolen gold trinkets, and a pouch spilling scarab amulets."),
  ('egyF6', 'ถนนหินสุริยะ', 'vultureQueen', 'Vulture Queen', 'ราชินีแร้ง', 'Desert Vulture',
   'แร้งที่บินวนเหนือถนนหินสุริยะมาพันปี รอคนที่หลงทางกลางแดด',
   "a big vulture with dark brown wings spread wide, a bald pinkish head with a tall white feathered crown, a gold broad collar, gold caps on its talons, piercing red eyes. Regal and a little creepy."),
  ('egyF4', 'เหมืองหินแกรนิต', 'graniteColossus', 'Granite Colossus', 'ยักษ์หินแกรนิต', 'Granite Golem',
   'รูปปั้นยามที่ยังไม่เสร็จ ช่างแกะหนีไปก่อน มันเลยออกตามหาหน้าของตัวเอง',
   "a huge walking statue of red granite blocks: a pharaoh's guard with a striped stone headdress, a cracked body with gold-filled cracks and hieroglyph carvings, a stone was-sceptre staff, glowing gold eyes. Heavy and slow."),
  ('egyD1a', 'สุสานขุนนาง ชั้น 1', 'beetleQueen', 'Flesh Beetle Queen', 'ราชินีด้วงกินเนื้อ', 'Flesh Beetle',
   'ราชินีของด้วงที่กินผ้าพันศพ วางไข่ไว้ในโลงทุกใบของสุสาน',
   "a large dark-red armoured beetle queen with a gold scarab crown, huge snapping jaws, a swollen pale egg-sac abdomen, glowing amber eyes and gold-tipped legs. Creepy tomb vibe, still cartoon."),
  ('egyD2a', 'มหาพีระมิด ชั้น 1', 'mummyQueen', 'Mummy Queen', 'ราชินีมัมมี่', 'Royal Mummy',
   'ราชินีผู้ยังไม่ยอมให้ใครรบกวนการหลับของฟาโรห์',
   "a tall, elegant mummy queen wrapped in cream bandages with a gold death-mask face, a gold vulture crown with spread wings, a broad turquoise-and-gold collar, a long pleated linen gown, a crook and flail crossed over her chest, one eye glowing cyan."),
  ('egyD2b', 'มหาพีระมิด ชั้น 2', 'sekhmetLioness', 'Red Lioness of Sekhmet', 'สิงห์แดงแห่งเซคเมต', 'Sekhmet Lioness',
   'นางสิงห์ที่สืบสายเลือดจากเทพีเซคเมต ลมหายใจร้อนเหมือนลมทะเลทราย',
   "a huge fierce lioness on four legs: red-gold fur with red war paint, a red sun disc with a gold cobra on her head, gold armour bands on her legs, a broad gold collar, burning orange eyes, claws glowing like embers."),
 ]),
 ('4_greek', 'GREEK', 'กรีก', 'the Greek lands (olive hills, marble ruins, sea coasts, the cyclops cave, the labyrinth)', [
  ('grkF1', 'เนินมะกอก', 'goatKing', 'Mountain Goat King', 'ราชาแพะภูเขา', 'Mountain Goat',
   'แพะที่ปีนขึ้นยอดเขาโอลิมปัสได้ครึ่งทาง แล้วกลับลงมาเป็นราชาของเนินนี้',
   "a big shaggy white mountain goat with enormous curled horns, a gold laurel wreath, a bronze bell on a red cord, a long white beard, standing proudly with one hoof raised."),
  ('grkF2', 'หาดหินอ่อน', 'crabEmperor', 'Marble Crab Emperor', 'จักรพรรดิปูหินอ่อน', 'Marble Crab',
   'ปูที่ยึดหัวเสาวิหารพังมาเป็นบ้าน แล้วประกาศตัวเป็นจักรพรรดิแห่งชายหาด',
   "a huge crab with a white-and-grey marble shell, carrying a broken Greek column top on its back like a hermit crab's house, one giant claw and one small claw, gold meander bands on its legs, tiny gold laurel leaves on its eye-stalks."),
  ('grkF5', 'เกาะไซเรน', 'harpyQueen', 'Harpy Queen', 'ราชินีฮาร์ปี้', 'Harpy',
   'ราชินีของฮาร์ปี้ที่ขโมยทุกอย่างที่เป็นประกาย',
   "a harpy queen with a fierce woman's face, wild brown-and-white feather hair, big brown feathered wings for arms with violet tips, sharp yellow talons capped with bronze, a crown of black feathers, gold earrings, a bronze breastplate, and a stolen gold necklace clutched in her talons."),
  ('grkF3', 'ไร่องุ่นขั้นบันได', 'satyrChief', 'Satyr Piper Chief', 'หัวหน้าซาเทอร์นักเป่าปี่', 'Satyr',
   'ซาเทอร์ที่เป่าปี่จนทั้งป่าเต้นตาม แล้วฉวยโอกาสขโมยไวน์',
   "a stocky satyr with goat legs, curled ram horns and a wild beard, a crown of purple grapes and purple-gold grape leaves (never green), panpipes on a cord, a big wooden wine cup, a leopard-skin sash, a mischievous grin."),
  ('grkF6', 'ถนนวีรบุรุษ', 'erymanthianBoar', 'Great Erymanthian Boar', 'หมูป่าเอรีมันทอสยักษ์', 'Erymanthian Boar',
   'หมูป่าในตำนานที่เฮราคลีสเคยต้องไล่จับ ตัวนี้ยังจับไม่ได้',
   "a colossal boar with dark brown hide and a huge spiky golden-yellow mane along its head and back, gold armour bands with a Greek-key pattern, enormous ivory tusks capped with bronze, a scarred pink snout, old arrow shafts stuck in its hide, a torn hunting net hanging from it, angry red eyes."),
  ('grkF4', 'ตลาดเก่าร้าง', 'talosSentry', 'Bronze Talos Sentry', 'ยามสัมฤทธิ์ทาลอส', 'Bronze Automaton',
   'หุ่นสัมฤทธิ์รุ่นทดลองของช่างเฮฟเฟสตัส เดินตรวจตลาดร้างไม่เคยหยุด',
   "a tall bronze automaton giant made by Hephaestus: a smooth bronze helmeted face with glowing gold eyes under a tall blue horsehair crest and a gold laurel, riveted bronze plates, a big gear on its back, a blue cloth kilt, a single bronze nail on its ankle sealing a glowing gold vein, a round bronze shield and a short spear, gears visible at the joints."),
  ('grkD1a', 'ถ้ำไซคลอปส์ ชั้น 1', 'bellwether', 'Bellwether Ram', 'แกะจ่าฝูงยักษ์', 'Giant Ram',
   'แกะตัวโปรดของโพลีฟีมัส ตัวที่โอดิสเซียสเคยเกาะใต้ท้องหนีออกจากถ้ำ',
   "the cyclops's prize ram: a huge woolly cream-white ram with enormous brown curled horns banded with gold Greek-key rings, a blue-and-gold harness cloth, a big bronze bell on a leather collar, very long fleece hanging almost to the ground, a garland of red poppies, calm but strong eyes."),
  ('grkD2a', 'เขาวงกตไมนอส ชั้น 1', 'euryale', 'Euryale the Gorgon', 'ยูไรอาลี พี่สาวกอร์กอน', 'Little Medusa',
   'พี่สาวอมตะของเมดูซ่า เสียงร้องของนางทำให้หินร้าว',
   "an immortal gorgon sister: a tall woman with pale lilac skin, glowing yellow eyes and a howling open mouth, a crown of living teal-blue snakes for hair, big golden feathered wings, bronze clawed hands, a white chiton with a red sash and gold trims, a gold laurel among the snakes, a round bronze shield."),
  ('grkD2b', 'เขาวงกตไมนอส ชั้น 2', 'khalkotauros', 'Khalkotauros', 'วัวสัมฤทธิ์พ่นไฟ', 'Stone Bull',
   'วัวสัมฤทธิ์พ่นไฟแห่งโคลคิสที่หลงในเขาวงกตนานจนหินของกำแพงงอกขึ้นหุ้มตัว กระทิงหินทั้งเขาวงกตเลยยอมให้มันเป็นหัวหน้า',
   "a giant fire-breathing bull of grey labyrinth stone wrapped in riveted bronze armour plates engraved with gold maze patterns, orange fire glowing inside its mouth, eyes and the cracks of its chest, glowing orange vents on its back, huge bronze horns, dark iron hooves."),
 ]),
 ('5_japan', 'JAPAN', 'ญี่ปุ่น', 'the Japanese lands (sakura hills, rice fields, bamboo groves, hot springs, a pirate coast, a ninja cave, a haunted castle)', [
  ('jpnF1', 'หุบซากุระ', 'drumTanuki', 'Belly-Drum Tanuki', 'ทานุกิพุงกลอง', 'Tanuki',
   'ทานุกิแก่อารมณ์ดี ตีพุงเป็นจังหวะเรียกพวกพ้องมาเลี้ยงสาเก',
   "a big round tanuki with a huge belly it drums on, a straw kasa hat, a little sake bottle on a cord, a happy squinty face, a fluffy striped tail, and a big yellow leaf on its head (yellow, never green)."),
  ('jpnF2', 'นาข้าวขั้นบันได', 'kappaChampion', 'Kappa Sumo Champion', 'แชมป์ซูโม่กัปปะ', 'Kappa',
   'กัปปะที่ไม่เคยแพ้ใครในซูโม่ ขอแค่จานน้ำบนหัวอย่าหก',
   "a strong kappa wrestler with teal-blue skin (never green) and a turtle shell on its back, a water-filled dish on top of its head, a beak, webbed hands, a thick white sumo belt hung with paper zigzag streamers, a proud flexing pose."),
  ('jpnF5', 'ภูเขาศาลจิ้งจอก', 'greatTengu', 'Great Tengu', 'ไดเท็งงุ', 'Tengu',
   'เท็งงุจมูกยาวผู้คุมภูเขา สอนวิชาดาบให้คนที่ชนะมันได้เท่านั้น',
   "a big mountain tengu with a red face, a long nose, fierce eyes and a white beard, large black feathered wings, dark monk robes with a gold sash, a fan made of seven big feathers, one-tooth wooden geta sandals."),
  ('jpnF3', 'ป่าไผ่', 'pandaSensei', 'Red Panda Sensei', 'อาจารย์แพนด้าแดง', 'Red Panda',
   'อาจารย์ของนินจาฝึกหัดทั้งป่าไผ่ ตัวเล็กแต่ไม่เคยถอย',
   "an old red panda martial-arts master with rusty-red fur, a fluffy ringed tail, long white eyebrows and moustache, a faded blue gi with a black belt, a staff of pale golden dry bamboo, a calm but sharp stare."),
  ('jpnF6', 'ท่าเรือฮาคุเซ็น', 'octopusLord', 'Octopus Sea Lord', 'เจ้าทะเลหมึกยักษ์', 'Little Octopus',
   'หมึกยักษ์ที่ยึดเรือโจรสลัดวาโกะมาเป็นของตัวเอง ถือดาบได้แปดเล่ม',
   "a big red-orange octopus pirate lord with a Japanese captain's jinbaori coat, a hachimaki headband, a different weapon in several tentacles (a katana, an oar, a grappling hook), a scar over one eye, a big round head."),
  ('jpnF4', 'เนินออนเซ็น', 'capybaraMaster', 'Onsen Capybara Master', 'คาปิบาร่าเจ้าบ่อออนเซ็น', 'Onsen Capybara',
   'เจ้าของบ่อน้ำร้อนตัวจริง ใจเย็นมาก แต่ใครแย่งบ่อก็ไม่ปล่อยไว้',
   "a big calm capybara standing on its back legs, a folded white towel on its head with a yuzu fruit on top, a blue yukata, a wooden bucket in one paw, rosy warm cheeks, unbothered heavy-lidded eyes."),
  ('jpnD1a', 'ถ้ำนินจา ชั้น 1', 'toadSage', 'Great Toad Sage', 'คางคกเซียนผู้เฒ่า', 'Giant Toad',
   'คางคกเฒ่าที่เก็บคัมภีร์ลับของนินจาไว้บนหลัง ใครอยากได้ต้องชนะมันก่อน',
   "a huge warty toad with brown and ochre skin, a red bib collar with a gold bell, a stack of old scrolls tied on its back with rope, a straw raincoat cape, a long tongue, wise half-closed golden eyes."),
  ('jpnD2a', 'ปราสาทผีสิง ชั้น 1', 'hinaEmpress', 'Cursed Hina Empress', 'จักรพรรดินีตุ๊กตาสาป', 'Cursed Doll',
   'ตุ๊กตาจักรพรรดินีที่ถูกทิ้งไว้ในปราสาท รวบรวมตุ๊กตาต้องสาปเป็นราชสำนักของนาง',
   "a big creepy-cute hina doll empress with a cracked white porcelain face, long black hair, a gold crown with dangling ornaments, many layers of red, purple and gold kimono, a folding fan, loose puppet strings hanging from her sleeves, one glowing red eye."),
  ('jpnD2b', 'ปราสาทผีสิง ชั้น 2', 'nue', 'Nue', 'นูเอะ', 'Ghost Samurai',
   'ปีศาจผสมที่หลอกหลอนปราสาทยามเมฆดำ ร้องเหมือนนกในยามค่ำคืน',
   "the castle-haunting chimera yokai: a monkey's face with glowing yellow eyes, a stocky tanuki body, striped tiger legs with claws, and a long snake for a tail with its own head; dark storm-purple fur with lightning-yellow streaks in it."),
 ]),
 ('6_capital', 'CAPITAL', 'เมืองหลวง', "the lands around the capital (meadows, farms, rivers, old catacombs, and the Aether Rift where the sky is broken)", [
  ('cN', 'ทุ่งเหนือเมืองหลวง', 'windmane', 'Windmane Stallion', 'ม้าป่าแผงคอลม', 'Wild Horse',
   'ม้าที่หนีออกจากคอกหลวง ไม่มีใครขี่มันได้อีกเลย',
   "a big chestnut-brown wild stallion with a very long wind-tossed cream mane and tail, white socks on its legs, a white blaze on its face, light-blue eyes, a broken golden bridle hanging from its neck (it escaped the royal stables), rearing proudly."),
  ('cE', 'ทุ่งตะวันออก', 'stagMonarch', 'Golden Stag Monarch', 'ราชากวางเขาทอง', 'Golden Stag',
   'กวางที่นักล่าของพระราชาตามล่ามาสามรุ่น แต่ไม่เคยจับได้',
   "a huge noble stag with a golden-tan coat marked with pale swirls and a cream chest ruff, enormous shining golden antlers decorated with tiny white flowers, red ribbons and little bells, a royal blue cloth with a gold sun emblem draped over its back, calm proud eyes."),
  ('cS', 'ทุ่งใต้เมืองหลวง', 'beeQueen', 'Giant Bee Queen', 'ราชินีผึ้งยักษ์', 'Giant Bee',
   'ราชินีของรังผึ้งที่ใหญ่ที่สุดในแดน น้ำผึ้งของนางหวานจนพ่อค้าแย่งกันซื้อ',
   "a plump bee queen with golden-and-black striped fur, small pale-blue wings (painted solid), a crown made of honeycomb, a royal-jelly sceptre dripping gold honey, a fluffy collar, a long stinger."),
  ('cW', 'ทุ่งตะวันตก', 'hawkLord', 'Sky Lord Hawk', 'เจ้าเหยี่ยวฟ้า', 'Field Hawk',
   'เหยี่ยวล่าเหยื่อของพระราชาที่ไม่ยอมกลับคืนกรง',
   "a big brown-and-cream hawk with barred wing feathers that escaped the royal falconer: a leather falconry hood pushed up on its head, gold jesses on its legs, a royal blue-and-gold ribbon, wings half spread, a yellow hooked beak, fierce yellow eyes."),
  ('cNE', 'เนินกังหันลมเก่า', 'scarecrowCommander', 'Scarecrow Knight Commander', 'แม่ทัพอัศวินหุ่นไล่กา', 'Scarecrow Knight',
   'หุ่นไล่กาที่ใส่เกราะอัศวินที่ตายในทุ่ง แล้วตื่นขึ้นมาบัญชาการกองทัพหุ่นไล่กา',
   "a tall scarecrow knight commander: a carved pumpkin head with glowing orange eyes and a jagged grin under a big battered wide-brimmed straw hat with a broken red plume, a tattered blue scarf and cape, straw poking out of dented old knight armour, a big shield painted with a cross, a sickle-bladed lance, two black crows sitting on its shoulders."),
  ('cSW', 'ท่อส่งน้ำโบราณ', 'frogBoss', 'Frog Bandit Boss', 'หัวหน้ากบโจร', 'Frog Bandit',
   'หัวหน้ากบโจรที่เก็บค่าผ่านทางทุกช่องของท่อส่งน้ำโบราณ',
   "a fat frog bandit boss with blue-and-yellow skin (never green), a dark brown hooded cloak, a black bandit mask over the eyes, a red bandana, a gold tooth, a big saber, a belt of stolen coins and a bulging loot bag over one shoulder."),
  ('cata1', 'สุสานใต้เมืองหลวง ชั้น 1', 'ratKing', 'Sewer Rat King', 'ราชาหนูท่อ', 'Sewer Rat',
   'ราชาของหนูท่อทั้งเมือง สร้างบัลลังก์จากขยะที่คนทิ้งลงท่อ',
   "a fat grey-brown sewer rat king with a crown made of a bent tin can, a cape made from an old torn red flag, a sceptre made from a candlestick, a ring of rusty keys on his belt, glowing red eyes, a long pink tail with a bow tied on it."),
  ('cata2', 'สุสานใต้เมืองหลวง ชั้น 2', 'wraithLord', 'Wraith Knight Lord', 'ขุนอัศวินวิญญาณ', 'Wraith Knight',
   'อัศวินที่ตายเฝ้าสุสานหลวง ไฟวิญญาณสีม่วงยังลุกอยู่ในหมวกเกราะ',
   "a tall armoured wraith knight lord: black spiked plate armour with silver trims, a horned great helm with ghostly purple fire glowing inside, a skull on one shoulder, a tattered purple cloak, a huge dark greatsword with glowing purple runes, ghostly chains on the armour."),
  ('rift1', 'รอยแยกเอเธอร์ ชั้น 1', 'riftAlpha', 'Rift Hound Alpha', 'จ่าฝูงหมารอยแยก', 'Rift Hound',
   'หมาตัวแรกที่หลุดออกจากรอยแยกของท้องฟ้า มันได้กลิ่นพลังเอเธอร์จากไกลๆ',
   "a large hound of dark violet void fur with glowing violet cracks across its body, big crystal shards growing along its back, three glowing cyan eyes, dark paws with glowing violet claws, a collar of small crystal shards around its neck."),
  ('rift2', 'รอยแยกเอเธอร์ ชั้น 2', 'seraphPrime', 'Shard Seraph Prime', 'มหาเซราฟคริสตัล', 'Shard Seraph',
   'เทพผลึกที่เกิดจากเศษท้องฟ้าที่แตก มันพยายามประกอบท้องฟ้าคืนด้วยวิธีของมันเอง',
   "a tall angel-like being of pale crystal and white light, six wings made of sharp crystal shards, a featureless mask-like face with one glowing violet eye, a halo of small crystal shards close around its head, flowing robes of pale glowing white cloth."),
  ('rift3', 'รอยแยกเอเธอร์ ชั้น 3 · รังเอเธอร์เวิร์ม', 'aetherMatriarch', 'Aether Drake Matriarch', 'แม่มังกรเอเธอร์', 'Aether Drake',
   'แม่ของมังกรเอเธอร์ทั้งหมด ปีกของนางมีดาวอยู่ข้างใน',
   "a sleek wyvern dragon with dark blue scales, glowing cyan aether wings painted with tiny stars (solid, not see-through), a crown of white crystal horns, glowing cyan eyes, cyan crystal growths along its spine, a long whip tail with a big crystal tip."),
 ]),
]

KIN_TH = {"Snow Pup": "ลูกหมาป่าหิมะ", "Big Frostling": "ฟรอสต์ลิงใหญ่", "Thatch Troll": "โทรลหลังคาฟาง", "Runestone Golem": "โกเลมหินรูน", "Avalanche Ram": "แกะเขาหิมะถล่ม", "Narwhal Raider": "นาร์วาลจอมปล้น", "Mad Dwarf Ghost": "วิญญาณคนแคระ", "Gleipnir Weaver": "ช่างทอโซ่เกลปเนียร์", "Draugr": "เดรากร์", "Leafcutter Ant": "มดตัดใบ", "Baby Tapir": "ลูกสมเสร็จ", "Macaw Raider": "นกมาคอว์จอมปล้น", "Corn Spirit": "ภูตข้าวโพด", "Vine Snapper": "ดอกไม้กินคน", "Swamp Leech": "ปลิงหนองน้ำ", "Glowworm Swarm": "ฝูงหนอนเรืองแสง", "Obsidian Priest": "นักบวชออบซิเดียน", "Sun Sentinel": "ทหารเฝ้าสุริยะ", "Scarab": "ด้วงสคารับ", "Ibis": "นกไอบิส", "Cobra": "งูเห่า", "Desert Fox": "หมาจิ้งจอกทะเลทราย", "Desert Vulture": "แร้งทะเลทราย", "Granite Golem": "โกเลมแกรนิต", "Flesh Beetle": "ด้วงกินเนื้อ", "Royal Mummy": "มัมมี่ราชวงศ์", "Sekhmet Lioness": "สิงโตเซคเมต", "Mountain Goat": "แพะภูเขา", "Marble Crab": "ปูหินอ่อน", "Harpy": "ฮาร์ปี้", "Satyr": "ซาเทอร์", "Erymanthian Boar": "หมูป่าเอรีมันทอส", "Bronze Automaton": "หุ่นทองแดง", "Giant Ram": "แกะยักษ์", "Little Medusa": "งูเมดูซ่าน้อย", "Stone Bull": "กระทิงหิน", "Tanuki": "ทานุกิ", "Kappa": "กัปปะ", "Tengu": "เท็งงุ", "Red Panda": "แพนด้าแดง", "Little Octopus": "ปลาหมึกน้อย", "Onsen Capybara": "คาปิบาร่าออนเซ็น", "Giant Toad": "คางคกยักษ์", "Cursed Doll": "ตุ๊กตาสาป", "Ghost Samurai": "ซามูไรผี", "Wild Horse": "ม้าป่า", "Golden Stag": "กวางเขาทอง", "Giant Bee": "ผึ้งยักษ์", "Field Hawk": "เหยี่ยวทุ่ง", "Scarecrow Knight": "อัศวินหุ่นไล่กา", "Frog Bandit": "กบโจร", "Sewer Rat": "หนูท่อ", "Wraith Knight": "อัศวินวิญญาณ", "Rift Hound": "หมารอยแยก", "Shard Seraph": "เซราฟคริสตัล", "Aether Drake": "มังกรน้อยเอเธอร์"}   # Thai names of the kin (VK_MONS th)

LEAD = {'nue': 'the yokai that rules the haunted castle'}   # header text when 'leader of its map\'s <kin> monsters' does not fit

PASSIVE = {'snowpine', 'vikF2', 'aztF1', 'aztF2', 'egyF1', 'egyF2', 'grkF1', 'grkF2', 'jpnF1', 'jpnF2'}   # beginner maps: never attacks first

HOW = """=== HOW TO WORK WITH THIS FILE — READ EVERYTHING FIRST ===
• This file lists {n} mini-bosses, numbered #1–#{n}. Draw ONE picture per reply, in order, starting with #1.
• After each picture write only "#<number> <name> done" and STOP. Wait for me.
  - "next" = draw the next number.   - "redo" = draw the same number again.   - a number (e.g. "4") = draw that number.
• Before every picture, re-read STYLE and PICTURE RULES. Every picture must follow them exactly.
• Never put text, numbers, labels, borders or speech bubbles inside a picture."""

RULES = """=== STYLE (copy the attached pictures) ===
Friendly hand-painted chibi cartoon, cute-but-dangerous, thick clean dark-brown outlines (not black), cel shading with 2–3 flat tones, soft light from the top-left, bright warm colours, clear readable silhouette. Not realistic, not painterly, not 3D. Chibi proportions (big head, short body) even for giants.

=== PICTURE RULES (every picture) ===
• ONE mini-boss per picture, square 1024×1024, the whole body inside the picture with empty space on every side, nothing cropped.
• Isometric 3/4 view from about 30° above, facing DOWN-RIGHT (south-east), a proud ready-to-fight pose with its weapon, horns or claws ready.
• A mini-boss is the LEADER of the monsters of its map: bigger and heavier than them, with one clear leader mark (a crown, a helmet, battle scars, a cape or trophies) and one strong colour accent. Big readable shapes — it must still read clearly when shown small in the game.
• Background: SOLID FLAT PURE GREEN (#00FF00) — no gradient, no ground, no floor, no shadow, no scenery. NEVER use green on the mini-boss: anything that would normally be green (leaves, moss, jade, frogs, kappa skin) is drawn teal, turquoise, blue, gold, purple or autumn orange instead.
• No effects floating around it (no smoke clouds, sparkles, motion lines, flying leaves). Small glows ON the body (eyes, runes, lanterns, embers) are fine.
• Paint everything SOLID — no see-through or half-transparent parts (ghosts, wings, robes, fire and glows are drawn opaque), because the green behind would show through them."""

def kin_pics():
    """names of monsters that have a painted sheet (monster-sprites.js) = kin that appear on the kin boards (tools/miniboss_boards.py)"""
    import re
    src = open(os.path.join(ROOT, 'monster-sprites.js'), encoding='utf-8').read()
    return {m[2] for m in re.finditer(r"""(['"])([^'"]+)\1\s*:\s*S\('""", src)}

BOARD_RULE = "• The KIN BOARD only shows what the kin look like. Draw the mini-boss alone in its own new pose — never copy the board's labels, frames or white background."

def build():
    out = os.path.join(ROOT, 'miniboss_prompts'); os.makedirs(out, exist_ok=True)
    tot = 0; rows = []; pics = kin_pics()
    for fn, land, land_th, where, items in LANDS:
        n = len(items); tot += n
        lst = '\n'.join(f'  #{i+1} {e[3]}' for i, e in enumerate(items))
        ent = []
        for i, (mid, mth, key, en, th, kin, lore, look) in enumerate(items):
            lv, band = lvl(mid)
            kp = (f'\n   Kin: shown on the kin board as #{i+1} — keep its species, colours and main features (but no green), make it bigger, older and more decorated.' if kin in pics else '')
            ent.append(f'#{i+1} {en.upper()} — {LEAD.get(key, "leader of its map\'s "+kin+" monsters")} (map Lv {band[0]}–{band[1]}, mini-boss Lv {lv})\n   Look: {look}' + kp)
            rows.append((land_th, mid, mth, key, en, th, kin, lv, band, mid in PASSIVE, lore))
        nb = [i + 1 for i, e in enumerate(items) if e[5] in pics]
        s = (f'MINI-BOSS MASTER PICTURES — {land} ({n} pictures)\n'
             f'Game: Totem Legend, a 2D isometric fantasy MMORPG (Ragnarok Online feel). Every field and dungeon map of {where} gets one MINI-BOSS: '
             f'the leader of that map\'s monsters — bigger, prouder and more decorated than its kin, with no special powers.\n'
             + ('Attached: the campfire key art (the art style to copy) and the KIN BOARD (a white sheet with the monsters these mini-bosses lead, '
                f'labelled with the same #numbers as below: ' + ', '.join(f'#{k}' for k in nb) + ').\n\n' if nb else
                'Attached: the campfire key art (the art style to copy).\n\n')
             + f'{HOW.format(n=n)}\n\n{RULES}' + ('\n' + BOARD_RULE if nb else '') + f'\n\n=== MINI-BOSSES IN THIS FILE ===\n{lst}\n\n=== ENTRIES ===\n\n' + '\n\n'.join(ent) + '\n')
        with open(os.path.join(out, fn + '.txt'), 'w', encoding='utf-8') as f: f.write(s)
        print(fn, n, 'mini-bosses', len(s), 'chars')
    doc(rows, tot)
    print('total', tot)

def doc(rows, tot):
    L = []
    for land_th in ['ไวกิ้ง', 'แอซเท็ก', 'อียิปต์', 'กรีก', 'ญี่ปุ่น', 'เมืองหลวง']:
        rs = [r for r in rows if r[0] == land_th]; fn = {'ไวกิ้ง': '1_viking', 'แอซเท็ก': '2_aztec', 'อียิปต์': '3_egypt', 'กรีก': '4_greek', 'ญี่ปุ่น': '5_japan', 'เมืองหลวง': '6_capital'}[land_th]
        L.append(f'\n### {land_th} — `miniboss_prompts/{fn}.txt`\n\n| # | แมพ | มินิบอส | หัวหน้าของ | Lv | นิสัย | เรื่องย่อ |\n|---|---|---|---|---|---|---|')
        for i, (lt, mid, mth, key, en, th, kin, lv, band, pas, lore) in enumerate(rs):
            L.append(f'| {i+1} | {mth} ({mid}, Lv {band[0]}–{band[1]}) | **{th}** · {en} | {KIN_TH.get(kin, kin)} | {lv} | {"ไม่ตีก่อน" if pas else "ตีก่อน"} | {lore} |')
    T = '\n'.join(L)
    md = f"""# มินิบอสในแมพ — ออกแบบ + พรอมต์หน้าตา (2026-11-23)

เจ้าของ: *"อยากได้มินิบอสในแมพ พวกนี้ไม่มีแมคคานิคอะไร ออกแบบและขอพร้อมหน้าตาหน่อย"*
(ไฟล์นี้สร้างจาก `tools/miniboss_prompts.py` — แก้ข้อมูลในสคริปต์แล้วรันใหม่ อย่าแก้ไฟล์นี้ตรงๆ)

---

## 1. มินิบอสคืออะไร
- **หัวหน้าฝูง**ของมอนในแมพนั้น — ตัวใหญ่ แข็งกว่า มีชื่อและหน้าตาของตัวเอง แบบมินิบอสใน RO
- **ไม่มีแมคคานิค**: ไม่มีวงเตือน ไม่มีของทอง ไม่มีช่วงเปิด — สู้เหมือนมอนธรรมดา แค่อึดและแรงกว่า
- ใช้ท่าพิเศษของฝูงตัวเอง (สถานะทุกครั้งที่ 4 ที่ตีโดน จาก monsters.js) เหมือนลูกฝูง
- **{tot} ตัว = แมพละ 1 ตัว** ทุกแมพทุ่งและดันเจี้ยนที่ยังไม่มีบอส
  - แต่ละแดน 9 แมพ: F1–F6 · D1a · D2a · D2b
  - รอบเมืองหลวง 11 แมพ: ทุ่ง 6 · สุสานใต้ดิน 2 · รอยแยก 3
  - แมพบอสประจำแมพ (D1b / H1 / H2) และแมพที่เก็บไว้ให้บอส MVP / บอสใหญ่ (D2c / E1 / E2) ไม่มีมินิบอส

## 2. กติกา (ตั้งต้น — ปรับได้)

| เรื่อง | ค่า |
|---|---|
| เลเวล | เลเวลสูงสุดของแมพ + 2 (ไม่เกิน 60) |
| นิสัย | แมพเริ่มเกม (F1 / F2) **ไม่ตีก่อน** · แมพอื่นตีก่อนเมื่อเห็น |
| เลือด | มอนเลเวลเดียวกัน ×4 (ทุ่ง) · ×5 (ดันเจี้ยน) → ฮีโร่เลเวลเท่ากันใส่ชุดตามเลเวล ตีราว 1 นาที |
| แรงตี | ×1.4 ของมอนเลเวลเดียวกัน (ยืนแลกเฉยๆ ตายราว 11–16 ทีที่โดน) |
| DEF / MDEF | ×1.3 · หลบ (FLEE) เท่ามอนปกติ |
| ขนาด | ใหญ่กว่าลูกฝูง ราว 1.5 เท่า |
| ลูกน้อง | เกิดพร้อมลูกฝูง 2 ตัว (ลูกน้องไม่เกิดใหม่ตามมัน) |
| เกิดใหม่ | ทุ่ง 10 นาที · ดันเจี้ยน 15 นาที · รอยแยก 20 นาที (โหมดทดสอบ 1 นาที) · จุดเกิดสุ่มทั้งแมพ ไม่ใกล้ประตูวาร์ป · เวลานับเป็นของโลก (แบบบอสประจำแมพ: ทุกฮีโร่ใช้นาฬิกาเดียวกัน รีโหลดไม่รีเซ็ต) |
| หน้าตาในเกม | ชื่อสีทอง + มงกุฎเงินหน้าชื่อ · วงแสงจางๆ ใต้เท้า · มงกุฎบนมินิแมพ · แผงแผนที่โลก (W) บอกชื่อและเวลาเกิดใหม่ |

**ของดรอป** (ไม่ให้ของในเกมเฟ้อ: แต่ละตัวเกิดใหม่ทุก 10–20 นาที ได้ไม่เกินชั่วโมงละ 3–6 ตัวต่อแมพ)
- ของพิเศษของฝูงตัวเอง (หินตีบวกอาวุธ / หินตีบวกชุด / หินออฟ ตามตารางดรอป) **ได้แน่ 1 ชิ้น** — 11 ฝูงที่ไม่มีของพิเศษ (มดตัดใบ ลูกสมเสร็จ ภูตข้าวโพด ปลิงหนองน้ำ ฝูงหนอนเรืองแสง แร้งทะเลทราย แพนด้าแดง ปลาหมึกน้อย คาปิบาร่าออนเซ็น ตุ๊กตาสาป เหยี่ยวทุ่ง) ได้หินออฟตามสเตตัสเด่นของมินิบอสแทน
- วัตถุดิบของแมพ ×3 · EXP ×8 · zeny ×5 ของมอนธรรมดา (ของพิเศษที่ได้แน่ ปกติต้องล่าราว 12–40 ตัวถึงจะได้)
- หินโทเท็มขั้นของแมพ 10 %
- ไม่ดรอปเจมแปรสภาพ / เจมเสริม (ยังเป็นของบอสอย่างเดียว)

## 3. รายชื่อ {tot} ตัว
{T}

## 4. รูปหน้าตา
- พรอมต์อยู่ใน `miniboss_prompts/` แดนละไฟล์ (6 ไฟล์) แบบเดียวกับไฟล์พรอมต์มอนสเตอร์: เขียนกติกาครั้งเดียวด้านบน แล้วตามด้วยรายการ `#1 #2 …`
- **1 ตัว = 1 รูป** สี่เหลี่ยมจัตุรัส พื้นเขียว หันขวาล่าง ท่ายืนพร้อมสู้ — เป็นรูปต้นแบบไว้ทำวิดีโอท่าทาง (เหมือนบอส) หรือชีตท่าทางต่อภายหลัง
- วิธีใช้
  1. แชทใหม่ใน ChatGPT แนบไฟล์ของแดน + รูปคีย์อาร์ตกองไฟ + **บอร์ดลูกฝูง**ของแดนนั้น (`miniboss_kin_<แดน>.jpg` = รูปมอนที่มินิบอสแต่ละตัวคุม ติดเลขตรงกับในไฟล์ — ให้มินิบอสเป็นสัตว์ชนิดเดียวกับลูกฝูง แค่ใหญ่และแต่งเต็มกว่า)
     - มีบอร์ด: ไวกิ้ง แอซเท็ก กรีก เมืองหลวง · อียิปต์ / ญี่ปุ่นยังไม่มีรูปมอนวาดใหม่ → ใช้คำบรรยายในไฟล์อย่างเดียว
     - สร้างบอร์ดใหม่ได้ด้วย `python3 tools/miniboss_boards.py <โฟลเดอร์>` (หยิบรูปมอนที่มีในเกมตอนนั้น — บอร์ดไม่เก็บในรีโป)
  2. พิมพ์ `อ่านไฟล์ทั้งหมด แล้ววาด #1`
  3. ได้รูปแล้วพิมพ์ `next` · `redo` = วาดข้อเดิมใหม่ · ใส่เลข = วาดข้อนั้น · ถ้าเริ่มเพี้ยน พิมพ์ `re-read the rules in the file, then redo`
  4. ส่งรูปกลับมาพร้อมบอกแดนและเลข เช่น "ไวกิ้ง #3"
- ห้ามสีเขียวบนตัว (พื้นเขียวจะตัดไม่ออก) — ใบไม้ / มอส / หยก / กบ / คัปปะ เขียนให้เป็นสีฟ้าอมเขียว ทอง ม่วง หรือส้มไว้แล้วในพรอมต์

## 5. ใส่เกม (ทำเมื่อเจ้าของบอก)
- ไฟล์ใหม่ `mini_bosses.js` (โหลดต่อจาก map_bosses.js): ตาราง {tot} ตัว · เกิด / เกิดใหม่ (นาฬิกาโลก `BOSS_T`) · สเตตัส · ลูกน้อง 2 ตัว · ของดรอป · ชื่อ + มงกุฎ · มินิแมพ / แผนที่โลก
- ระหว่างรอรูป: ใช้ร่างของลูกฝูงขยาย 1.5 เท่า + แต่งสีให้ต่าง (แบบบอสประจำแมพตัวแทน) — เล่นได้ทันที
- รูปมาแล้ว: ตัดพื้นเขียว → ทำท่าทาง (วิดีโอต่อท่า หรือชีต 5 แถวแบบมอน) → `monster-sprites.js`
"""
    with open(os.path.join(ROOT, 'MINI_BOSS_TH.md'), 'w', encoding='utf-8') as f: f.write(md)

if __name__ == '__main__':
    build()
