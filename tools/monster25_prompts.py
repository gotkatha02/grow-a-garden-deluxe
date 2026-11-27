"""2.5D monster sheets (owner 2026-11-27: the heroes went 2.5D like Ragnarok 3, the maps go iso → the monsters are redrawn in the
same 2.5D look, zone by zone, Viking first). Every monster keeps its current design (the painted sheet in monster-sprites.js);
only the rendering changes. Same 5-row sheet as before, so tools/monsheet2.py (mode W) cuts it.

usage:
  python3 tools/monster25_prompts.py doc                    -> MONSTER25_PROMPTS_TH.md (every box, grouped by ChatGPT chat)
  python3 tools/monster25_prompts.py single viking 1-5      -> print those boxes as Markdown (writes nothing)
  python3 tools/monster25_prompts.py boards OUTDIR          -> numbered boards of the current monsters, one per chat
                                                               (monster25_board_<land><chat>.jpg; sent to the owner, not kept in the repo)
  python3 -I tools/monster25_prompts.py cut <n | sprite name> <sheet.png> [A|W]
                                                            -> assets/monsters/<file>25.webp + its line in monster25.js (2026-11-27)
The owner attaches per chat: the board of that chat + style_ref_wolf25.jpg (= assets/heroes/wolf/view25_SE.webp) and, once the
first one is approved, his own finished 2.5D monster sheet (the boxes say so).
cut: tools/monsheet2.py layout A (the prompt's own rows: frames split at the green gaps) is the default — the 2.5D sheets have
clean gaps and no loose effects, and W (frames from the dark outlines) cut a bat's far wing off into the frame before it.
Specks under 60 px and small pieces far from the body are dropped, the drawn contact shadows stay (like the flat sheets). The on-map height h and the
options (fly, sw) are copied from the flat sheet's S() line in monster-sprites.js ('walk' is not: that is the flat walk strip).
monster-sprites.js uses monster25.js instead of the flat sheets unless the link has ?mon25=0."""
import os, re, sys
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) + '/'

# walk rows (same wording as tools/monster_prompts.py, plus 'g' for seals)
W = {'2': "TWO LEGS — walking in place, legs MUST alternate: 1) LEFT leg forward and planted, 2) passing pose with the RIGHT leg lifted, 3) RIGHT leg forward and planted, 4) passing pose with the LEFT leg lifted. Frames 1 and 3 clearly show a different leg in front; arms swing opposite to the legs.",
     '4': "FOUR LEGS — trotting in place, diagonal pairs MUST alternate: 1) front-LEFT + back-RIGHT legs reach forward, 2) passing pose, legs under the body, 3) front-RIGHT + back-LEFT legs reach forward, 4) passing pose. Frames 1 and 3 clearly show different legs in front; the tail swings.",
     '6': "MANY LEGS — the legs move in two alternating groups: 1) group A reaches forward, 2) passing pose, 3) group B reaches forward, 4) passing pose. Frames 1 and 3 clearly differ.",
     'f': "FLOATING (no legs touching the ground) — 1) high, leaning forward, 2) middle, trailing parts swept back, 3) low, 4) middle, trailing parts swinging the other way. Nothing touches the ground.",
     'w': "FLYING — hovering in place: 1) wings up, 2) wings half down, 3) wings fully down, 4) wings half up; the body bobs a little, feet tucked.",
     'h': "HOPPING — 1) crouched low, 2) pushing off, 3) highest point in the air, 4) landing squashed.",
     'g': "SEAL-LIKE — humping forward in place on its belly: 1) the front of the body lifted on the flippers, 2) the back arched, tail end pulled forward, 3) the front lands flat with the flippers out, 4) the body stretched long."}
WN = {'2': 'TWO LEGS', '4': 'FOUR LEGS', '6': 'MANY LEGS', 'f': 'FLOATING', 'w': 'FLYING', 'h': 'HOPPING', 'g': 'SEAL-LIKE'}

# (sprite name in the game, Thai, map, walk, background g / m, size, look, attack)
# look = the design as it is drawn now (checked against each monster's painted sheet 2026-11-27); bg 'm' = magenta because it has green on it
VIKING = [
 ('Snow Pup', 'ลูกหมาป่าหิมะ', 'snowpine', '4', 'g', 'tiny, the weakest monster of the game', "a chubby fluffy white wolf pup with big round shiny blue eyes, pale-blue ear tips, paws and tail tip, a soft clump of snow on top of its head, two tiny fangs", "a little pounce forward with a nip, mouth open"),
 ('Pinecone Sprite', 'ภูตลูกสน', 'snowpine', '2', 'm', 'small', "a walking brown pinecone with snow on its top scales and two small dark-green pine sprigs sticking up from it, a dark hollow face with two glowing teal eyes, short stubby brown legs with red-striped wrappings, holding a crooked twig staff with a tiny pinecone and a dry orange leaf", "jabs its twig staff forward with a small hop, a little teal spark at its tip"),
 ('Fang Hare', 'กระต่ายเขี้ยวน้ำแข็ง', 'vikF2', 'h', 'g', 'small', "a fluffy white hare with a soft pale-pink tint, long ears with pink insides and pale-blue tips, angry red eyes, two long ice-blue fangs, a small blue ribbon bow on its neck", "rears up on its hind legs and bites down with its two long ice fangs"),
 ('Big Frostling', 'ฟรอสต์ลิงใหญ่', 'vikF2', '2', 'g', 'medium', "a stocky furry snow creature with shaggy white fur, sharp pale-blue ice crystals growing from its head and shoulders, glowing blue eyes, small icy fangs, a brown leather belt, carrying a club of blue ice crystals on a short wooden handle", "swings its ice-crystal club over its head and smashes it down in front"),
 ('Icicle Bat', 'ค้างคาวหินย้อยน้ำแข็ง', 'vikF2', 'w', 'g', 'small', "a small fluffy lavender-white bat with big pointed ears, glowing cyan eyes, frosty pale-blue wings with icicle tips, a tiny red scarf", "dives forward and bites, mouth wide open"),
 ('Rune Wisp', 'ภูตหินรูน', 'vikF3', 'f', 'g', 'small', "a floating little spirit made of soft pale-teal flame with a cute round face and two glowing eyes, holding in front of it a round grey stone carved with one glowing teal rune mark (a simple angular mark, not a letter), three small grey pebbles floating around it, small teal flames for hands", "pushes its rune stone forward and flings a small teal flame ball (the ball just leaving its hand)"),
 ('Moor Wolf', 'หมาป่าทุ่ง', 'vikF3', '4', 'm', 'medium', "a shaggy brown wolf with patches of green moss growing on its back and shoulders, a cream muzzle, chest and paws, yellow eyes, a leather collar with small teal studs", "a lunging bite"),
 ('Runestone Golem', 'โกเลมหินรูน', 'vikF3', '2', 'm', 'large', "a hulking golem built from grey-brown stone blocks, green moss and a few small white flowers growing on its shoulders and head, a glowing teal rune mark carved on its chest stone (an angular mark, not a letter), small dark eyes in a block head, orange rope wound round one arm", "raises both stone fists and slams them down on the ground in front"),
 ('Ice Crab', 'ปูหิมะ', 'vikF4', '6', 'g', 'small', "an orange-red crab whose shell is covered in snow and spiky pale-blue ice crystals, one claw made of solid ice, small stalk eyes", "snaps its big ice claw forward"),
 ('Fjord Seal Spirit', 'ภูตแมวน้ำ', 'vikF4', 'g', 'g', 'small', "a seal made of clear light-blue sea water with white foam swirls on its body and tail, shiny dark eyes, a little brown rope knot on one flipper, a few water drops on its back", "rears up and spits a ball of water forward (the ball just leaving its mouth)"),
 ('Narwhal Raider', 'นาร์วาลจอมปล้น', 'vikF4', '2', 'g', 'medium', "a grey-blue narwhal standing upright like a little Viking: a long twisted ivory horn on its forehead coming out under a horned iron Viking helmet, a cream fur cape, a brown leather belt, a round wooden shield with an iron rim", "lowers its head and thrusts its long horn forward from behind its shield"),
 ('Hound of the Raiders', 'หมาล่าเนื้อ', 'vikF5', '4', 'g', 'medium', "a brown war hound wearing spiked brown leather armour plates with iron rivets on its back, red war-paint stripes on its face and legs, yellow eyes, a bandage on one leg", "a lunging bite"),
 ('Lost Villager', 'ผีชาวบ้าน', 'vikF5', 'f', 'g', 'medium', "the sad ghost of a grey cat villager: grey-and-white cat face with pointed ears, pale glowing teal eyes, a torn brown hooded cloak with patches, a faded red scarf, holding a rusty pitchfork and an old iron lantern with a teal flame, its lower body fading into pale teal mist", "pokes forward with its pitchfork"),
 ('Thatch Troll', 'โทรลหลังคาฟาง', 'vikF5', '2', 'm', 'large', "a big hunched olive-green troll with mottled skin, its back and head covered by a straw-thatched roof like a hut roof with a small brick chimney on top, a big round nose (darker olive, never pink), one small tusk, a bandaged arm, an iron shackle on one wrist, holding a broken wooden log as a club", "swings its log club down in front"),
 ('Pass Wolf', 'หมาป่าหิมะ', 'vikF6', '4', 'g', 'medium', "a lean grey-and-white mountain wolf with snow crusted in its shaggy fur, a darker blue-grey stripe along its back, a scar over one eye, amber eyes, a collar of bone beads", "a lunging bite"),
 ('Yeti Cub', 'ลูกเยติ', 'vikF6', '2', 'g', 'small', "a round fluffy cream-white yeti cub with a pale blue face, rosy cheeks, two little curved horns, blue-grey hands and feet, a red-and-white knitted scarf", "throws a snowball forward with both arms (the snowball just leaving its hands)"),
 ('Avalanche Ram', 'แกะเขาหิมะถล่ม', 'vikF6', '4', 'g', 'medium', "a woolly cream-white ram with snow piled on its back, big curled horns made of pale-blue ice crystal, a dark grey face, a brass bell on a red collar", "lowers its ice horns and charges forward"),
 ('Mad Dwarf Ghost', 'วิญญาณคนแคระ', 'vikD1a', 'f', 'g', 'medium', "the glowing ghost of a dwarf miner: a copper mining helmet with a lit candle on top, a big nose, a long white beard, brown work clothes, gripping a pickaxe, his legs fading into a pale golden-yellow wisp", "swings his pickaxe down in front"),
 ('Ore Golem', 'โกเลมแร่', 'vikD1a', '2', 'g', 'large', "a golem of dark grey rock studded with shiny gold ore nuggets, two wooden mine-cart wheels mounted on its shoulders, small glowing orange eyes, brown leather straps with buckles round its arms and waist", "punches forward with a gold-studded rock fist"),
 ('Lamp Beetle', 'ด้วงตะเกียง', 'vikD1a', '6', 'g', 'small', "a big dark-brown beetle with a curved horn, carrying on its back a brass mining-lantern cage that glows warm orange, copper bands on its legs", "lowers its head and rams forward with its horn"),
 ('Forge Golem', 'โกเลมเตาหลอม', 'vikD1b', '2', 'g', 'large', "a golem built like a blacksmith's forge: a brown iron-plated body with copper rivets, a chimney for a head puffing a little smoke, two small glowing orange eyes under it, a glowing fire grate in its chest, iron anvil blocks for fists, a padlock hanging at its hip", "raises both anvil fists and slams them down in front"),
 ('Ice Bat Pack', 'ค้างคาวน้ำแข็ง', 'vikD1b', 'w', 'g', 'small (three bats)', "a pack of THREE small dark-violet bats flying close together as one group, wings tipped with pale-blue ice, glowing blue eyes, little red tongues", "the three bats dive forward together and bite"),
 ('Runesmith Revenant', 'ช่างรูนอมตะ', 'vikD1b', '2', 'g', 'medium', "an undead badger blacksmith: a black-and-white badger face with glowing blue eyes, a dark fur beard, a torn brown leather apron over iron armour pieces, carrying on his shoulder a big iron war hammer whose head is carved with a glowing blue rune mark (an angular mark, not a letter)", "swings his rune hammer over his head and smashes it down"),
 ('Shadow Wolf', 'หมาป่าเงา', 'vikH1', '4', 'g', 'medium', "a black wolf made of thick dark smoke, glowing violet eyes and mouth, violet wisps curling off its fur and tail, its paws fading into smoke", "a fast lunging bite, its smoky body stretching"),
 ('Forest Witchling', 'แม่มดป่า', 'vikH1', '2', 'm', 'small', "a small hunched hedgehog forest witch: a back of spiky brown quills, a hooded cloak of moss-green and autumn-orange leaves, a long wooden mask-like face with glowing green eyes, holding an antler staff with a bone charm and a little gold bell tied on with red string", "shakes its antler staff forward and the bell rings, a small yellow-green glow at the bell"),
 ('Blackpine Treant', 'ต้นสนดำมีชีวิต', 'vikH1', '2', 'm', 'large', "a dark pine tree come alive: a crown of dark green pine needles dusted with snow with a few pinecones, a gnarled dark-brown bark body with an angry carved face glowing orange inside, long twisted branch arms, walking on its roots", "whips a long branch arm forward"),
 ('Young Yeti', 'เยติ', 'vikH2', '2', 'g', 'large', "a big shaggy white yeti with a blue-grey face, two curved pale-blue horns, frosty pale-blue fists and feet, a leather belt with a brown pouch", "raises both fists and pounds the ground in front"),
 ('Tundra Wolf', 'หมาป่าทุนดรา', 'vikH2', '4', 'g', 'medium', "a big pale grey-white wolf with cool blue-grey shading, a thick snow-crusted ruff round its neck, ice-blue eyes", "a lunging bite with a short puff of frost from its jaws"),
 ('Frost Mammoth Calf', 'ลูกช้างแมมมอธ', 'vikH2', '4', 'g', 'large', "a baby woolly mammoth with shaggy reddish-brown fur dusted with snow, small curved white tusks, a short trunk, blue cloth bands round its legs", "lowers its head and charges with its tusks"),
 ('Fenrir Spawn', 'ลูกเฟนเรียร์', 'vikD2a', '4', 'g', 'medium', "a dark navy-blue wolf with spiky fur, glowing ice-blue eyes and mouth, broken iron shackles round its legs with short chains", "a lunging bite, its mouth glowing"),
 ('Wolf Priest', 'นักบวชหมาป่า', 'vikD2a', '2', 'g', 'medium', "a hunched cultist in a purple robe with gold trim, wearing a pale wolf-skull hood with violet swirl marks over a dark shadowed face with glowing cyan eyes, a necklace of big fangs, holding a staff topped with a horned animal skull and a hanging pink crystal", "raises the skull staff and thrusts it forward, the crystal glowing"),
 ('Gleipnir Weaver', 'ช่างทอโซ่เกลปเนียร์', 'vikD2a', '6', 'g', 'medium', "a big cave spider with a rounded dark-blue body etched with glowing silver-blue rune marks (angular marks, not letters), eight legs ringed with pale silver bands and curved pale claws, small ice-blue eyes, a strand of silvery silk trailing from its back", "rears up and stabs down with its front legs"),
 ('Draugr Wolf', 'หมาป่าเดรากร์', 'vikD2b', '4', 'g', 'medium', "an undead half-skeleton wolf with tattered mauve-grey fur, exposed ribs with blue soul-fire glowing inside its chest, a bone tail, blue flames in its eye sockets, a rusty broken chain round its neck", "a lunging bite"),
 ('Draugr', 'เดรากร์', 'vikD2b', '2', 'g', 'medium', "an undead Viking warrior with blue-grey skin, a white beard, a dented iron helmet, rusty chainmail, a ragged brown fur cloak, glowing blue eyes, a notched sword and a cracked round wooden shield", "a sword slash"),
 ('Chain Wraith', 'วิญญาณโซ่', 'vikD2b', 'f', 'g', 'medium', "a floating hooded ghost in a tattered dark-blue cloak that fades into ragged tails (no legs), glowing ice-blue eyes in the dark hood, bony grey hands, wrapped in broken iron chains", "lashes a chain forward"),
 ('Fenrir Guard', 'องครักษ์เฟนเรียร์', 'vikD2c', '4', 'g', 'large', "a huge armoured black wolf with dark iron plates on its back and shoulders, a round shoulder plate with a glowing blue mark, a spiked iron collar, a mane of ice-blue flame, glowing ice-blue eyes, iron claw caps", "a claw swipe forward"),
 ('Wolf High Priest', 'มหานักบวชหมาป่า', 'vikD2c', '2', 'g', 'medium', "an old priest with a long grey beard and glowing violet eyes, wearing a big horned wolf-skull crown, a thick red cloak with a cream fur collar over purple robes with gold trim, gold rings and a gold medallion", "points a clawed hand forward, a small violet glow in the palm"),
 ('Fenrir Shade Hound', 'หมาเงาเฟนเรียร์', 'vikD2c', '4', 'g', 'medium', "a lean wolf made of dark violet-blue shadow smoke with glowing electric-blue veins, glowing blue eyes, a smoky mane and tail of drifting violet wisps, a gold bead chain round its neck", "a lunging bite"),
 ('Undying Viking', 'ไวกิ้งอมตะ', 'vikE1', '2', 'g', 'large', "a hulking undead Viking chieftain with grey-blue skin and glowing blue eyes, a horned iron helmet, a long dark brown-purple beard like seaweed, rusty armour crusted with barnacles, shells and a starfish, holding a huge two-handed axe with a big crescent blade", "swings his huge axe over his head and down"),
 ('Sea Ghost Wolf', 'หมาป่าวิญญาณทะเล', 'vikE1', '4', 'g', 'medium', "a see-through pale-teal ghost wolf made of sea water, a white wave-foam mane and tail curling like breaking waves, glowing white eyes, a few water drops", "a leaping bite"),
 ('Drowned Shieldmaiden', 'วาลคิรีจมน้ำ', 'vikE1', '2', 'g', 'medium', "a drowned shieldmaiden with pale blue-grey skin and glowing teal eyes, wet dark-blue braids, a dented iron helmet with white wings and a little red coral on it, a torn teal-blue tunic with barnacles, a round teal shield crusted with orange starfish and coral, a long spear", "a spear thrust from behind her shield"),
 ('Frost Giant', 'ยักษ์น้ำแข็ง', 'vikE2', '2', 'g', 'very large', "a towering blue-skinned frost giant with a white icicle beard, a horned helmet, shoulder plates of pale-blue ice crystal, white fur, a leather harness with a round iron buckle, a club made of a blue ice boulder on a wooden handle", "swings his ice-boulder club over his head and smashes it down"),
 ('Dark Valkyrie Wolf', 'หมาป่าวาลคิรีมืด', 'vikE2', '4', 'g', 'large', "a black wolf with two big dark-feathered wings folded on its back, a silver valkyrie helmet with small white wings, silver chest armour, glowing silver eyes", "leaps forward with its wings spread and bites"),
 ('Glacier Wyrmling', 'ลูกมังกรธารน้ำแข็ง', 'vikE2', '4', 'g', 'large', "a young four-legged ice dragon with pale-blue scales and a white belly, clear ice-crystal spikes along its back and tail, small frosty wings, big curious eyes", "a lunging bite with a claw swipe"),
]
LANDS = {'viking': ('ไวกิ้ง (โซนหิมะ)', VIKING)}
# ChatGPT chats per land: (label, first #, last #, Thai note)
CHATS = {'viking': [('1', 1, 5, 'ป่าสนหิมะ + หุบเขี้ยวน้ำแข็ง (มอนของแมพทดลอง isoField) · #1 = ภาพลองลุค'),
                    ('2', 6, 13, 'ทุ่งหินรูน · ฟยอร์ดน้ำแข็ง · หมู่บ้านไวกิ้งร้าง'),
                    ('3', 14, 21, 'หมู่บ้านไวกิ้งร้าง · ช่องเขาหมาป่า · เหมืองคนแคระ ชั้น 1–2'),
                    ('4', 22, 29, 'เหมืองคนแคระ ชั้น 2 · ป่าสนดำ · ทุ่งน้ำแข็งเหนือ'),
                    ('5', 30, 37, 'ถ้ำเฟนเรียร์ ชั้น 1–3'),
                    ('6', 38, 44, 'ถ้ำเฟนเรียร์ ชั้น 3 · สุสานเรือมังกร · ธารน้ำแข็งนิรันดร์')]}

BG = {'g': ("Background: SOLID FLAT PURE GREEN (#00FF00) — no gradient, no ground, no cast shadow. NEVER use green on the monster: "
            "anything that would be green is drawn teal, turquoise, blue or gold instead."),
      'm': ("Background: SOLID FLAT PURE MAGENTA (#FF00FF) — no gradient, no ground, no cast shadow. NEVER use magenta, pink or "
            "purple on the monster (its greens stay green).")}

BOX = """Make ONE sprite sheet of a monster for my 2.5D fantasy MMORPG (Ragnarok 3 style).

THE MONSTER: #{n} {name} on the attached board of my current monsters (attached here or earlier in this chat) — {size} — {look}. Keep its design exactly: the same creature, shape, proportions, colours, clothes, weapon and details as on the board. Only the rendering changes.

LOOK: render it exactly like my attached 2.5D hero picture — a stylized 3D game character painted by hand: solid rounded 3D volume, soft toon shading in 2–3 tones that follows the forms, one warm key light from the upper left, a soft cool rim light on the shadow side, thin clean dark-brown outlines, matte painted textures (fur, stone, wood, iron, ice). Cute-but-dangerous chibi proportions (big head, short body) like the board. Not a flat 2D cartoon, no thick outlines, not photorealistic, not glossy plastic, not pixel art. If one of my finished 2.5D monster sheets is attached too, match its look, size in the frame and sheet layout.

CAMERA: the same game camera as the hero — about 30 degrees from above, three-quarter view, the monster facing DOWN-RIGHT (south-east) in every frame.

SHEET: ONE 1536×1024 image, 5 rows. The SAME monster in every frame — identical design, colours and size, never redesigned between frames. Every frame in its own equal-size cell with empty space around it; feet (or lowest point) on the same baseline within a row; nothing cropped, nothing overlapping another frame.
Row 1 — IDLE, 4 frames: calm breathing — neutral, body rises slightly, neutral, body sinks slightly with one small detail moving (ear, tail, cloak, flame).
Row 2 — WALK, 4 frames, {walk}
Row 3 — ATTACK, 5 frames: {attack} — 1) ready, 2) wind-up, 3) strike at full reach toward down-right, 4) follow-through, 5) back to ready.
Row 4 — HURT, 2 frames: 1) hit from the front, head and body jerk back, eyes squeezed shut, 2) recoiling, about to recover.
Row 5 — DEATH, 5 frames: 1) staggers back, 2) falling, 3) hits the ground, 4) lying still, 5) exactly the same lying pose as frame 4 (the game fades it out itself — do not draw it see-through). Cartoon, no blood.

{bg} No text, no labels, no numbers, no borders, no motion lines, no dust, no magic effects floating around it (small glows ON the body are fine)."""


def box(land, n):
    name, th, mp, w, bg, size, look, att = LANDS[land][1][n - 1]
    return BOX.format(n=n, name=name.upper(), size=size, look=look, walk=WN[w].lower() + ': ' + W[w].split(' — ', 1)[1],
                      attack=att, bg=BG[bg])


def chat_of(land, n):
    return next(c for c in CHATS[land] if c[1] <= n <= c[2])


# ---------- boards: first idle frame + one attack frame of each current monster, labelled #n ----------
def sheets():
    src = open(R + 'monster-sprites.js', encoding='utf-8').read()
    have = {m[2]: (m[3], int(m[4]), int(m[5]), 0) for m in re.finditer(r"""(['"])([^'"]+)\1\s*:\s*S\('([^']+)',(\d+),(\d+)""", src)}
    have['Fenrir Shade Hound'] = ('shadeHound_idle', 176, 146, 1)    # video-clip monster: idle strip, 8 columns
    return have


def frames(f, cw, ch, clip):
    from PIL import Image
    im = Image.open(R + 'assets/monsters/' + f + '.webp').convert('RGBA')
    def cell(c, r):
        x = im.crop((c * cw, r * ch, (c + 1) * cw, (r + 1) * ch)); bb = x.getbbox(); return x.crop(bb) if bb else x
    if clip:
        a = Image.open(R + 'assets/monsters/shadeHound_attack.webp').convert('RGBA')
        x = a.crop((244 * 3, 0, 244 * 4, 227)); bb = x.getbbox()   # 4th attack frame
        return cell(0, 0), (x.crop(bb) if bb else x)
    return cell(0, 0), cell(2, 2)


def board(land, chat, path):
    from PIL import Image, ImageDraw, ImageFont
    F = ImageFont.truetype(R + 'assets/fonts/Prompt-Medium.ttf', 26)
    lab, a, b, _ = chat; items = list(range(a, b + 1)); have = sheets()
    cols = 4 if len(items) > 4 else len(items); rows = (len(items) + cols - 1) // cols
    CW, CH, TOP, GAP = 440, 250, 44, 12
    sh = Image.new('RGB', (CW * cols + GAP * (cols - 1), (CH + TOP) * rows + GAP * (rows - 1)), (255, 255, 255)); d = ImageDraw.Draw(sh)
    for j, n in enumerate(items):
        name = LANDS[land][1][n - 1][0]; f, cw, ch, clip = have[name]
        x0 = (j % cols) * (CW + GAP); y0 = (j // cols) * (CH + TOP + GAP)
        ims = frames(f, cw, ch, clip)
        k = min((CW * .5 - 10) / max(i.width for i in ims), (CH - 14) / max(i.height for i in ims), 1.6)
        for i, im in enumerate(ims):
            im = im.resize((max(1, int(im.width * k)), max(1, int(im.height * k))), Image.LANCZOS)
            sh.paste(im, (x0 + i * CW // 2 + (CW // 2 - im.width) // 2, y0 + TOP + CH - 8 - im.height), im)
        d.rectangle([x0, y0, x0 + CW - 1, y0 + TOP - 6], fill=(40, 28, 20)); d.text((x0 + 10, y0 + 5), f'#{n} {name.upper()}', fill=(255, 226, 150), font=F)
    sh.save(path, quality=88); print(os.path.basename(path), sh.size, len(items))


# ---------- the Thai doc ----------
def doc(land='viking'):
    title, ms = LANDS[land]
    t = [f"""# มอน 2.5D — {title}

เจ้าของ 2026-11-27 06:14 'ได้' (ต่อจาก ISO_MAP_TH.md §13: ฮีโร่ 2.5D แล้ว แมพเป็น iso แล้ว → มอนต้อง 2.5D ด้วย ทำทีละโซน ไวกิ้งก่อน)
ไฟล์นี้สร้างด้วย `python3 tools/monster25_prompts.py doc` — แก้ข้อความ / ข้อมูลมอนในไฟล์นั้น ไม่แก้ .md ตรงๆ

## หลัก
- มอนทุกตัว **คงดีไซน์เดิม** (ภาพในเกมตอนนี้) เปลี่ยนแค่การเรนเดอร์ให้เหมือนฮีโร่ 2.5D: มิติ 3D นุ่ม แรเงา 2–3 โทน แสงอุ่นซ้ายบน ขอบแสงเย็น เส้นขอบบาง สัดส่วนชิบิ
- แผ่นเดิม 5 แถว (ยืน 4 · เดิน 4 · โจมตี 5 · โดนตี 2 · ตาย 5) หันขวาล่าง → ตัดด้วย `tools/monster25_prompts.py cut` (ข้างล่าง)
- ตายเฟรม 5 = ท่าเดียวกับเฟรม 4 (เดิม ChatGPT วาดโปร่งใสแล้วสีเพี้ยนเป็นเขียวขี้ม้า เกมจางเองได้)
- พื้นเขียว ยกเว้นตัวที่มีสีเขียวบนตัว (มอส ใบไม้ ผิวโทรล ใบสน) = พื้นบานเย็น

## ทำยังไง
1. ChatGPT แชตใหม่ต่อกลุ่ม (ด้านล่าง) · แนบ 2 รูป: **บอร์ดของกลุ่มนั้น** (`monster25_board_{land}<กลุ่ม>.jpg` — ภาพมอนตอนนี้ ใส่เลข #) + **`style_ref_wolf25.jpg`** (ฮีโร่ 2.5D = ลุค)
2. ส่งกล่องทีละกล่อง ได้แผ่นแล้วค่อยส่งกล่องถัดไปในแชตเดิม
3. **ลองลุคก่อน: กลุ่ม 1 กล่อง #1 แล้วส่งรูปให้ผมดู** — ผ่านแล้วค่อยทำตัวอื่น · ตั้งแต่กลุ่ม 2 แนบแผ่น 2.5D ที่ผ่านแล้ว 1 แผ่นเป็นรูปที่ 3 ด้วย (กล่องบอกให้ทำลุค / ขนาดในช่องตามนั้น)
4. รูปเสร็จ → ส่งมาทั้งแผ่น ผมตัดเข้าเกมเอง

## ตอนรูปมา
- ตัดด้วย `python3 -I tools/monster25_prompts.py cut <เลข> <แผ่น.png>` → `assets/monsters/<ไฟล์>25.webp` + บรรทัดใน `monster25.js` (สร้างเอง ไม่แก้มือ) · ขนาดในเกม (h) / บิน / เงา ลอกจากแผ่นเดิม · เกมใช้แผ่น 2.5D แทนแผ่นเดิมชื่อเดียวกันเลย · `?mon25=0` = กลับไปแผ่นเดิม (ไว้เทียบ)
- โหมดตัด = A (ช่องว่างสีพื้นระหว่างเฟรม) ไม่ใช่ W: แผ่น 2.5D ห่างกันชัด ไม่มีเอฟเฟกต์ลอย และโหมด W ตัดปีกไกลของค้างคาวไปติดเฟรมก่อนหน้า · เศษจุดเล็กโดนลบ เงาที่วาดใต้เท้าเก็บไว้ (เหมือนแผ่นเดิม)
- ตัวที่เข้าเกมแล้วมี ✓ ในตารางรายชื่อ
- หมาเงาเฟนเรียร์ (#38) ตอนนี้เป็นคลิปวิดีโอ (CLIPS.shadeHound) → แผ่น 2.5D แทนคลิปได้ หรือทำคลิปใหม่จากภาพยืน 2.5D (เลือกทีหลัง)
- บอสประจำแมพ / บอสโลก / มินิบอส ไม่อยู่ในไฟล์นี้ (บอสรอวิดีโอทีละท่าตามที่เจ้าของบอก)

## ประโยคแก้ (ต่อท้ายส่งในแชตเดิม)
- แบนเหมือนเดิม → `Redo: make it look like a 3D game character — stronger rounded volume and soft 3D shading, thinner outlines, keep the same design.`
- เหมือนจริง / มันวาว → `Redo: less realistic — matte painted textures, simple soft toon shading, clean thin outlines.`
- ดีไซน์เปลี่ยน → `Redo: keep the monster exactly like #<เลข> on the board — same shape, colours and details; only the rendering is 3D.`
- หันผิดทาง → `Redo: every frame faces down-right (south-east), seen from about 30 degrees above.`
- แถวไม่ครบ / ปนกัน → `Redo with exactly 5 rows: 4 idle, 4 walk, 5 attack, 2 hurt, 5 death frames, each frame in its own cell.`
- ตายเฟรมสุดท้ายโปร่ง → `Redo the last death frame as the same solid lying pose as frame 4.`

## รายชื่อ ({len(ms)} ตัว)
| # | มอน (✓ = เข้าเกมแล้ว) | ไทย | แมพ | เดิน | พื้น | กลุ่ม |
|---|---|---|---|---|---|---|"""]
    done = table()
    for i, (n, th, mp, w, bg, *_ ) in enumerate(ms, 1):
        t.append(f"| {i} | {n}{' ✓' if n in done else ''} | {th} | {mp} | {WN[w]} | {'บานเย็น' if bg == 'm' else 'เขียว'} | {chat_of(land, i)[0]} |")
    for lab, a, b, note in CHATS[land]:
        t.append(f"\n## กลุ่ม {lab} · #{a}–#{b} · {note}\nแนบ: `monster25_board_{land}{lab}.jpg` + `style_ref_wolf25.jpg`" +
                 ("" if lab == '1' else " + แผ่น 2.5D ที่ผ่านแล้ว 1 แผ่น") + "\n")
        for n in range(a, b + 1):
            nm, th, mp = ms[n - 1][:3]
            t.append(f"**#{n} {nm}** · {th} ({mp})\n```\n{box(land, n)}\n```\n")
    open(R + 'MONSTER25_PROMPTS_TH.md', 'w', encoding='utf-8').write('\n'.join(t) + '\n')
    print('MONSTER25_PROMPTS_TH.md', len(ms), 'monsters')


# ---------- cut: a finished 2.5D sheet -> assets/monsters/<file>25.webp + monster25.js ----------
def flat_entry(name):
    src = open(R + 'monster-sprites.js', encoding='utf-8').read()
    m = re.search(r"""(['"])%s\1\s*:\s*S\('([^']+)',(\d+),(\d+),(\d+),(\d+),(\d+),(\d+)(?:,\{([^}]*)\})?\)""" % re.escape(name), src)
    if not m: raise SystemExit('no flat S() line for ' + name)
    o = {}
    for kv in (m.group(9) or '').split(','):
        if ':' in kv:
            k, v = kv.split(':', 1); v = v.strip(); o[k.strip()] = float(v) if '.' in v else int(v)
    o.pop('walk', None)
    return m.group(2), int(m.group(8)), o


def table():
    f = R + 'monster25.js'
    if not os.path.exists(f): return {}
    import json
    t = open(f, encoding='utf-8').read(); i = t.index('window.MS25=') + len('window.MS25=')
    return json.loads(t[i:t.rindex(';')])


def write_table(T):
    import json
    body = ',\n'.join('  ' + json.dumps(k) + ':' + json.dumps(v, separators=(',', ':')) for k, v in T.items())
    open(R + 'monster25.js', 'w', encoding='utf-8').write(
        '/* GENERATED by tools/monster25_prompts.py cut — 2.5D monster sheets (MONSTER25_PROMPTS_TH.md); do not edit by hand.\n'
        '   monster-sprites.js uses these instead of the flat sheet of the same name unless the link has ?mon25=0.\n'
        '   file cw ch px py ref = the sheet (tools/monsheet2.py), h + options = copied from the flat sheet. */\n'
        'window.MS25={\n' + body + '\n};\n')


def cut(key, src, layout='A'):
    import json, subprocess, tempfile, shutil
    import numpy as np
    from PIL import Image
    from scipy import ndimage as nd
    ms = LANDS['viking'][1]
    name = ms[int(key) - 1][0] if key.isdigit() else key
    flat, h, o = flat_entry(name); file = flat + '25'
    tmp = tempfile.mkdtemp()
    r = subprocess.run([sys.executable, '-I', R + 'tools/monsheet2.py', src, tmp + '/' + file, layout], capture_output=True, text=True)
    if r.returncode: raise SystemExit(r.stderr)
    meta = json.loads(r.stdout.strip().splitlines()[-1]); cw, ch = meta['cw'], meta['ch']
    print(name, 'rows', meta['rows'], file=sys.stderr)
    im = np.asarray(Image.open(tmp + '/' + file + '.webp').convert('RGBA')).copy(); drop = 0
    for rr in range(5):
        for c in range(5):
            cell = im[rr * ch:(rr + 1) * ch, c * cw:(c + 1) * cw]; m = cell[..., 3] > 20
            lab, n = nd.label(m, structure=np.ones((3, 3)))
            if n < 2: continue
            sz = nd.sum(m, lab, range(1, n + 1)); big = int(np.argmax(sz)) + 1; near = nd.binary_dilation(lab == big, iterations=12)
            for i, v in enumerate(sz):
                if i + 1 != big and (v < 60 or v < .015 * sz.max() and not (near & (lab == i + 1)).any()):
                    cell[lab == i + 1] = 0; drop += 1
    if drop: print('dropped', drop, 'stray specks', file=sys.stderr)
    Image.fromarray(im, 'RGBA').save(R + 'assets/monsters/' + file + '.webp', quality=92, method=6)
    shutil.copy(tmp + '/' + file + '_preview.png', '/tmp/' + file + '_preview.png'); shutil.rmtree(tmp)
    T = table(); T[name] = dict(file=file, cw=cw, ch=ch, px=meta['px'], py=meta['py'], ref=meta['ref'], h=h, **o)
    order = [m[0] for m in ms]; T = dict(sorted(T.items(), key=lambda kv: order.index(kv[0]) if kv[0] in order else 999))
    write_table(T); print(name, '->', 'assets/monsters/' + file + '.webp', T[name])


if __name__ == '__main__':
    a = sys.argv[1:]
    if not a or a[0] == 'doc':
        doc()
    elif a[0] == 'single':
        land = a[1]; lo, hi = 1, len(LANDS[land][1])
        if len(a) > 2: r = a[2].split('-'); lo, hi = int(r[0]), int(r[-1])
        for n in range(lo, hi + 1):
            nm, th, mp = LANDS[land][1][n - 1][:3]
            print(f"**#{n} {nm}** · {th} ({mp})\n```\n{box(land, n)}\n```\n")
    elif a[0] == 'cut':
        cut(a[1], a[2], a[3] if len(a) > 3 else 'A')
    elif a[0] == 'boards':
        out = a[1] if len(a) > 1 else '/tmp'; os.makedirs(out, exist_ok=True)
        for land in LANDS:
            for c in CHATS[land]: board(land, c, os.path.join(out, f'monster25_board_{land}{c[0]}.jpg'))
