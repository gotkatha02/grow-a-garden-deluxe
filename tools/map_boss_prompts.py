"""Builds the ChatGPT prompt files for the 15 map bosses (owner 2026-11-23 'บอสประจำแมพ ขอพร้อมทำรูป').
usage: python3 tools/map_boss_prompts.py      -> boss_prompts/1_egypt.txt … 5_aztec.txt (one ChatGPT chat per file)
Each boss = BODY sheet (5 rows, same layout as the monster sheets, cut by tools/monsheet2.py) + MOVES sheet
(3 rows: signature move · power move · open window). Each land ends with a PROPS sheet (6 arena objects, 3×2).
Edit the texts here and re-run; MAP_BOSS_ART_PROMPTS_TH.md explains the files to the owner in Thai."""
import os

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')

RULES = """=== STYLE (copy the attached pictures) ===
Friendly hand-painted chibi cartoon, cute-but-dangerous, thick clean dark-brown outlines (not black), cel shading with 2–3 flat tones, soft light from the top-left, bright warm colours, clear readable silhouette. Not realistic, not painterly, not 3D. Chibi proportions (big head, short body) even for giants. Bosses are bigger and more detailed than normal monsters but the same style.

=== BACKGROUND (every picture) ===
SOLID FLAT PURE GREEN (#00FF00) — no gradient, no ground, no floor, no shadows, no scenery. NEVER use green on a boss or an object: anything that would normally be green (leaves, moss, jade, poison, gems) is drawn teal, turquoise, blue, gold or autumn orange instead.

=== SHEET TYPE 1 — BODY SHEET (1536×1024, 5 rows) ===
• The SAME boss in every frame: identical design, colours and size, never redesigned between frames.
• Facing DOWN-RIGHT (south-east), isometric 3/4 view from about 30° above. The whole boss in every frame, nothing cropped.
• Every frame in its own equal-size cell with empty space around it; feet (or lowest point) on the same baseline within each row; frames never touch or overlap.
• Row 1 — IDLE, 4 frames: proud calm breathing — neutral, body rises slightly, neutral, body sinks slightly with one detail moving (cloak, tail, flame, hair, banner).
• Row 2 — WALK, 4 frames: the walk type given in the entry (see WALK TYPES).
• Row 3 — ATTACK, 5 frames: the attack given in the entry — 1) ready, 2) wind-up, 3) strike at full reach toward down-right, 4) follow-through, 5) back to ready.
• Row 4 — HURT, 2 frames: 1) hit from the front — head and body jerk back, eyes squeezed shut, 2) recoiling, about to recover.
• Row 5 — DEATH, 5 frames: 1) staggers back, 2) falling, 3) hits the ground, 4) lying still, 5) the same pose fading away. Cartoon, no blood or gore.
• No motion lines, dust, sparks, smoke clouds, magic effects or loose objects floating around the boss — the game draws those. Small glows ON the body (eyes, runes, torch flames, ghost fire) are fine.

=== SHEET TYPE 2 — MOVES SHEET (1536×1024, 3 rows) ===
• The same boss as the BODY sheet you drew just before it: same design, colours, proportions and facing (down-right). Draw it at the same size as in the body sheet — the cells are taller here, so leave the extra space empty. Jumps and dives must stay inside their cell.
• Row 1 — SIGNATURE MOVE, 5 frames, as described in the entry.
• Row 2 — POWER MOVE, 5 frames, as described in the entry.
• Row 3 — OPEN WINDOW, 4 frames, as described in the entry: the moment the boss is beaten for a few seconds and wide open to attacks. Usually 1) falling into the pose, 2) and 3) a gentle loop (swaying one way, then the other), 4) getting back up. Dizzy stars or swirly eyes may sit ON the head.
• Same cell, baseline and no-effects rules as the body sheet.

=== SHEET TYPE 3 — PROPS SHEET (1536×1024, 6 objects) ===
• 6 separate objects in a 3×2 grid (3 columns, 2 rows), one per cell, each centred in its cell and as big as the cell allows with a little empty space around it.
• The same isometric 3/4 view from about 30° above as the bosses, so anything round on the ground looks like a wide flat ellipse.
• Things that stand on the ground: base at the bottom, no ground or floor under it and no cast shadow (the game adds shadows). Flying things: floating.
• No characters unless the entry asks for one, no text.

=== WALK TYPES ===
• TWO LEGS — walking in place, legs MUST alternate: 1) LEFT leg forward and planted, 2) passing pose with the RIGHT leg lifted, 3) RIGHT leg forward and planted, 4) passing pose with the LEFT leg lifted. Frames 1 and 3 clearly show a different leg in front; arms swing opposite to the legs.
• FOUR LEGS — trotting in place, diagonal pairs MUST alternate: 1) front-LEFT + back-RIGHT legs reach forward, 2) passing pose, legs under the body, 3) front-RIGHT + back-LEFT legs reach forward, 4) passing pose. Frames 1 and 3 clearly show different legs in front; tail swings.
• MANY LEGS (scorpions, spiders) — legs move in two alternating groups: 1) group A reaches forward, 2) passing pose, 3) group B reaches forward, 4) passing pose. Frames 1 and 3 clearly differ.
• GLIDING (a long dress or robe hides the feet) — 1) leaning forward, hem sweeping back, 2) middle, 3) upright, 4) middle, hem swaying the other way. The hem and hair move clearly between frames.
• ROLLING (a statue on wheels that never steps) — 1) level, 2) body tipping slightly forward, banners and crest streaming back, 3) level, 4) body tipping slightly back. The legs never move; only loose parts sway."""

HOW = """=== HOW TO WORK WITH THIS FILE — READ EVERYTHING FIRST ===
• This file lists {n} pictures, numbered #1–#{n}. Draw ONE image per reply, in order, starting with #1.
• After each image write only "#<number> <name> done" and STOP. Wait for me.
  - "next" = draw the next number.   - "redo" = draw the same number again.   - a number (e.g. "4") = draw that number.
• Every boss has a MASTER PICTURE. Entries that start with "ATTACH" need it: I attach that picture in the same message as my command. Copy the boss exactly from it — same face, colours, outfit, weapon and markings — only the pose changes. If I forgot the picture, ask me for it instead of drawing.
• Some entries say "NOT in this picture": leave those things out — the game draws them separately.
• Before every image, re-read STYLE, BACKGROUND and the rules of that sheet type. Every image must follow them exactly.
• Never put text, numbers, labels, borders or speech bubbles inside an image."""

LANDS = [
 ('1_egypt', 'EGYPT', 'the Egyptian lands (salt lakes, sand, ruined temples, tombs)', [
  ('SALT SCORPION KING — BODY SHEET', 'ATTACH: the Salt Scorpion King master picture (egy1).', """
   Look: a huge scorpion made of rose-pink salt crystals — faceted pink crystal plates over a cream-white body, pink crystal spikes along its back, gold armour bands with lapis-blue stripes on its legs, tail and claws, a gold winged-scarab crown with a blue scarab on its head, four glowing orange-red eyes, white fangs, two big crystal pincers, and a gold stinger dripping orange venom.
   Walk: MANY LEGS, tail held high and swaying.
   Attack: a claw pinch — both pincers lunge forward and snap shut."""),
  ('SALT SCORPION KING — MOVES SHEET', '(No new picture: copy the body sheet you just drew.)', """
   Row 1 GREAT STING: 1) the tail rises high, 2) the tail coils far back over the body, venom glowing, 3) the stinger stabs straight forward toward down-right at full length, tail stretched out low, 4) held at full reach, 5) pulling the tail back.
   Row 2 BURROW AND BURST: 1) crouching flat, legs digging, 2) half sunk into a cracked ring of pink salt chunks, 3) only its back and raised tail above the salt ring, 4) bursting up out of a salt ring, legs spread, 5) landing back on its legs. (The salt ring at the cut line is part of these frames.)
   Row 3 OPEN WINDOW — TAIL STUCK: its stinger is stuck deep in a broken stump of pink salt crystal on the ground in front of it, the body lifted so its soft pale-pink belly plates show — 1) the stinger stuck, body jolted, 2) tugging hard, swirly eyes, legs scrabbling, 3) tugging the other way, 4) the tail pops free and the stump crumbles."""),
  ('SPHINX GUARDIAN — BODY SHEET', 'ATTACH: the Sphinx Guardian master picture (egy2).', """
   Look: a winged sphinx carved from sandstone — a lion body covered in faintly glowing gold hieroglyph carvings, a proud pharaoh face with glowing gold eyes and a blue eye-line mark, a blue-and-gold striped nemes headdress with a gold cobra crown, gold ankh earrings, a broad gold collar with a big blue gem and hanging blue-and-gold cloth, gold-and-blue leg bands, big feathered sandstone wings, and a lion tail with a gold band and a tuft.
   Walk: FOUR LEGS, wings folded.
   Attack: a paw swipe — one front paw sweeps across with claws out."""),
  ('SPHINX GUARDIAN — MOVES SHEET', '(No new picture: copy the body sheet you just drew.)', """
   Row 1 THE RIDDLE: 1) standing, 2) lowering its hind legs, 3) sitting up tall like a temple statue, chin high, 4) wings opening wide, eyes glowing bright gold, 5) holding the pose with wings fully open. (The game draws the riddle symbol above its head.)
   Row 2 POUNCE: 1) crouching low, 2) leaping up, 3) high in the air, front paws reaching forward, wings spread, 4) slamming down front paws first, 5) landing in a crouch.
   Row 3 OPEN WINDOW — THE BOW (the hero answered the riddle): 1) lowering its head, 2) head bowed low to the ground, front legs folded, eyes closed, wings lowered respectfully, 3) the same bow, breathing, 4) lifting its head back up."""),
  ('MUMMY VIZIER — BODY SHEET', 'ATTACH: the Mummy Vizier master picture (egy3).', """
   Look: a tall mummy priest wrapped in cream bandages with loose ends fluttering, one glowing cyan eye peeking through the wraps, a blue-and-gold striped nemes headdress with a gold cobra, a broad gold collar with a turquoise gem, a dark navy cape with a gold-patterned hem, a long navy-and-gold apron with a gold scarab, four small canopic jars hanging at the belt, a gold ankh staff with a glowing turquoise gem in one hand, and a rolled papyrus scroll with a glowing cyan Eye of Horus in the other hand.
   Walk: TWO LEGS — a slow shambling walk, bandage ends trailing behind.
   Attack: a bandage lash — flings a long loose bandage from his sleeve forward like a whip."""),
  ('MUMMY VIZIER — MOVES SHEET', '(No new picture: copy the body sheet you just drew.)', """
   Row 1 REWRAP RITUAL (he heals himself): 1) planting the ankh staff, 2) raising the staff high with both hands, 3) the ankh glowing bright turquoise, bandages lifting and floating around him like ribbons, 4) arms spread, head thrown back, bandages swirling, 5) holding the ritual pose. (The game draws the blue light beams from his jars.)
   Row 2 CURSE SCROLL: 1) unrolling the papyrus, 2) the Eye of Horus on it glowing cyan, 3) thrusting the open scroll forward, 4) holding it out, 5) rolling it back up.
   Row 3 OPEN WINDOW — BANDAGES ON FIRE: 1) small orange flames catch his bandages, 2) flailing, patting at the flames, 3) flailing the other way, smoke puffs on his body, 4) the flames go out, scorched bandages, recovering. (Flames only ON the bandages.)"""),
  ('EGYPT PROPS SHEET', '(No picture needed.)', """
   6 objects for the Egyptian boss arenas:
   (1) a pink salt-crystal pillar: a cluster of tall rose-pink faceted salt crystals growing out of a white salt crust, about 2.5 times as tall as wide;
   (2) the same salt pillar cracked and crumbling: broken top, cracks through it, chunks breaking off;
   (3) an alabaster canopic jar on a short stone pedestal, gold-and-blue painted collar band, its lid carved as a human head in a striped nemes (Imsety);
   (4) the same jar style with a baboon-head lid (Hapy);
   (5) the same jar style with a black jackal-head lid (Duamutef);
   (6) the same jar style with a falcon-head lid (Qebehsenuef).
   The four jars are the same size and shape; only the lid heads differ. A faint turquoise glow shines in the eyes of each lid."""),
 ]),
 ('2_viking', 'VIKING', 'the Norse lands (dark pine forests, glaciers, dwarf mines)', [
  ('HULDRA — BODY SHEET', 'ATTACH: the Huldra design sheet (vik1) — copy the big front views.', """
   Look: a forest spirit woman — long wavy brown hair full of autumn leaves, little twig antlers with white flowers and pale moss strands, soft fox-like ears, golden eyes with brown face markings, a long dress of layered autumn leaves (orange, red, gold, brown) over bark, a curled white horn hanging at her hip, and a lower body like a tree trunk with root feet. Her back is a hollow tree trunk with glowing orange mushrooms inside (seen only from behind).
   NOT in this picture: her cow tail. Draw her WITHOUT any tail — the game adds the tail separately, because it is the clue that shows which Huldra is the real one.
   Walk: GLIDING, the leafy hem fluttering.
   Attack: a branch whip — her arm stretches into a long leafy branch that whips forward."""),
  ('HULDRA — MOVES SHEET', '(No new picture: copy the body sheet you just drew.)', """
   Row 1 LEAF MIRAGE: 1) starting to spin, hair flying out, 2) spinning fast, her outline breaking into leaves, 3) half girl, half whirl of autumn leaves, 4) only a whirlwind of autumn leaves, 5) the leaves forming back into her, arms open.
   Row 2 LURE SONG: 1) a hand on her chest, eyes closed, 2) singing sweetly, head tilted, 3) one arm reaching out invitingly, 4) both arms open for an embrace, gentle smile, 5) leaning in with arms wide, eyes glowing orange. (The game draws the music notes.)
   Row 3 OPEN WINDOW — DIZZY: 1) stumbling, leaves falling from her hair, 2) hands on her head, swirly eyes, 3) swaying the other way, 4) shaking her head, recovering."""),
  ('JOTUN BRUTE — BODY SHEET', 'ATTACH: the Jotun design sheet (vik2) — copy the big front views and the club.', """
   Look: a huge frost giant — pale icy-blue skin with glowing pale-blue rune tattoos, a shaggy white fur mantle and a big white beard with little icicles, small fierce blue eyes, two little tusks, a bone-and-fang necklace, brown leather wraps on his arms and legs, a fur loincloth, big bare feet, and a giant stone club wrapped in rope with blue ice crystals growing on it.
   Walk: TWO LEGS — slow heavy stomps, the club resting on his shoulder.
   Attack: club smash — raises the club and smashes it down in front of him."""),
  ('JOTUN BRUTE — MOVES SHEET', '(No new picture: copy the body sheet you just drew.)', """
   Row 1 GLACIER SMASH: 1) gripping the club with both hands, 2) raising it high over his head, 3) frost crystals growing all over the club, body leaning back, 4) slamming it down with all his weight, 5) the club buried in the ground, a few cracked ice chunks right around its head.
   Row 2 FROST BREATH: 1) leaning back, chest swelling, 2) cheeks puffed, 3) leaning forward with the mouth wide open, blowing, 4) still blowing, 5) closing his mouth and wiping his beard. (The game draws the frost cone.)
   Row 3 OPEN WINDOW — KNEELING: 1) dropping to one knee, 2) kneeling, leaning on the club, head down, dazed, 3) the same, swaying, 4) pushing himself back up."""),
  ('DRAUGR FORGEMASTER — BODY SHEET', 'ATTACH: the Draugr design sheet (vik3) — copy the front views and the hammer.', """
   Look: an undead dwarf blacksmith — a dark iron horned helmet with a glowing lava crack and a skull-like dark face plate, glowing orange eyes, a long braided grey-white beard with gold rings, a heavy dark-brown fur mantle, iron shoulder and arm plates, a leather apron with a glowing orange rune, chains with smith's tools across his body, a small anvil strapped on his back, a wisp of smoke from the helmet top, and a big square hammer whose iron head is cracked with glowing orange lava lines.
   Walk: TWO LEGS — short heavy steps, the hammer on his shoulder.
   Attack: molten hammer smash — an overhead swing down, the lava cracks flaring."""),
  ('DRAUGR FORGEMASTER — MOVES SHEET', '(No new picture: copy the body sheet you just drew.)', """
   Row 1 FORGING (he hammers on a big anvil in front of him — do NOT draw that anvil, the game places it): 1) hammer raised high, 2) swinging down, 3) striking at waist height in front of him, lava cracks blazing, 4) bouncing back up, 5) hammer raised again.
   Row 2 CHAIN HOOK: 1) pulling the hooked chain off his shoulder, 2) swinging it in a circle over his head, 3) throwing it forward — arm stretched toward down-right, only the first part of the chain leaving his hand, 4) yanking it back hard, 5) catching the hook.
   Row 3 OPEN WINDOW — THE FORGE GOES OUT: 1) staggering, the fire in his eyes flickering, 2) slumped forward over his knees, hammer dropped beside him, eyes dim, 3) the same, a puff of smoke from the helmet, 4) shaking his head and getting up."""),
  ('VIKING PROPS SHEET', '(No picture needed.)', """
   6 objects for the Norse boss arenas:
   (1) Huldra's cow tail on its own: a long brown cow tail with an orange autumn-leaf tuft at its end, curving up in a lazy S shape, its root at the left end (the game swings it from the root);
   (2) a big rough boulder of blue glacier ice with snow on top, wider than tall, chest-high on a hero (heroes hide behind it);
   (3) one thick curved plate of clear blue ice armour, about the size of a shield, frosted rim and three small ice spikes (the game puts five of them on the giant);
   (4) a giant snowball with small stones and ice shards stuck in it;
   (5) a huge blacksmith's anvil on a square stone block, its top glowing orange-hot, a few dark iron rune marks on the side;
   (6) a big leather blacksmith's bellows on a wooden stand, a brass nozzle pointing left, iron studs."""),
 ]),
 ('3_greek', 'GREEK', 'the Greek lands (moonlit groves, a battlefield, the cyclops cave)', [
  ('HECATE — BODY SHEET', 'ATTACH: the Hecate master picture (grk1).', """
   Look: the triple-faced goddess of the crossroads — one calm front face with violet eyes and two more faces on the sides of her head (one smiling, one stern), long wavy silver-lavender hair, a gold crown of a crescent moon and stars with a thin gold halo ring, a deep purple robe with gold stars and a gold meander hem over a cream shawl, gold bracelets, a chain of old gold keys at her belt with a moon-phase clasp, and a gold torch with a violet flame in each hand.
   NOT in this picture: her two black hounds and the purple moths — draw her alone (the game adds the hounds).
   Walk: GLIDING, the robe sweeping.
   Attack: moon fire — swings one torch forward, its violet flame flaring."""),
  ('HECATE — MOVES SHEET', '(No new picture: copy the body sheet you just drew.)', """
   Row 1 THE CROSSROADS: 1) both torches lowered, eyes closed, 2) raising her right torch, 3) the right torch held high above her head, all three faces looking up at it, 4) holding it high with the flame blazing tall, the other torch lowered at her side, 5) the same pose, robe stirring.
   Row 2 THE KEY MOTH: 1) lifting a gold key from her belt chain, 2) blowing gently on it, 3) opening her hand palm-up toward down-right (the moth that flies off is drawn by the game), 4) palm held out, smiling, 5) lowering the hand.
   Row 3 OPEN WINDOW — OFF BALANCE: 1) stumbling backward, torches dipping, 2) wobbling, all three faces with swirly eyes, 3) wobbling the other way, 4) catching her balance."""),
  ('TROJAN COLOSSUS — BODY SHEET', 'ATTACH: the Trojan Colossus master picture (grk2).', """
   Look: a giant wooden war horse built of planks and gold-bolted bronze bands — a fierce wooden head with a bronze face plate, glowing gold eyes and a tall red horsehair crest, a red horsehair tail, ropes across the body, two round red-and-gold sun shields on its sides, a wooden fortress tower on its back with spears and red banners with a gold laurel, a closed belly hatch, and four stiff wooden legs.
   NOT in this picture: the wheels. Each leg ends in a short square axle block with a round bronze hub — the game adds the four wheels (they break off in the fight). Keep the four hubs at the same places in every frame.
   Walk: ROLLING.
   Attack: battering-ram charge — leaning back, then lunging forward head-down like a battering ram."""),
  ('TROJAN COLOSSUS — MOVES SHEET', '(No new picture: copy the body sheet you just drew.)', """
   Row 1 BELLY HATCH: 1) hatch closed, 2) the hatch cracking open, glowing eyes inside, 3) half open, 4) wide open as a ramp, the dark belly full of bronze helmets and spear points, 5) the same, wide open. (The soldiers that jump out are drawn by the game.)
   Row 2 ARROW VOLLEY: tiny bronze archers on the tower — 1) bows rising above the tower walls, 2) drawing, 3) loosing a volley up into the sky, banners whipping, 4) reaching for new arrows, 5) ducking back behind the walls.
   Row 3 OPEN WINDOW — TOPPLED: 1) tipping over onto its side, 2) lying on its side, the belly hatch hanging open toward the viewer, banners drooping, a few planks popped loose, 3) the same, rocking slightly, 4) heaving itself back upright. (Still no wheels — only the empty hubs.)"""),
  ('POLYPHEMUS — BODY SHEET', 'ATTACH: the Polyphemus master picture (grk3).', """
   Look: a cyclops shepherd giant — one huge amber eye, a wild brown mane with a gold laurel, a big brown beard and moustache, two tusks, pointed ears with a gold earring, a white fleece cloak with a cute sleepy sheep sitting on his shoulder, tan skin with a white meander tattoo on one arm, gold meander arm bands, a rope belt with a gold laurel medallion, two clay wine jars hanging from the belt, a fur loincloth with a cream meander-hem cloth, leather sandals, and a huge tree-trunk club tied with rope with a stone wedged in it.
   Walk: TWO LEGS — heavy stomps, the club on his shoulder.
   Attack: club sweep — swings the tree club in a wide sideways arc."""),
  ('POLYPHEMUS — MOVES SHEET', '(No new picture: copy the body sheet you just drew.)', """
   Row 1 "WHO'S THERE?!": 1) roaring with the mouth wide open, 2) one hand shading his eye, the eye glowing bright amber, 3) leaning and peering to the left, 4) peering to the right, 5) peering straight ahead, frowning. (The game draws the beam from his eye.)
   Row 2 BOULDER THROW: 1) bending to lift a big grey boulder, 2) lifting it overhead with both hands, 3) leaning back, 4) hurling it forward, the boulder just leaving his hands, 5) follow-through, hands empty.
   Row 3 OPEN WINDOW — DRUNK: 1) a hiccup, cheeks flushing red, 2) wobbling with a goofy grin, his single eye huge, wide open and swirly, 3) wobbling the other way, 4) shaking his head and frowning. (The open eye is his weak point — make it big and clear.)"""),
  ('GREEK PROPS SHEET', '(No picture needed.)', """
   6 objects for the Greek boss arenas:
   (1) Hecate's key moth: a big purple night moth with silver moon-phase marks on its wings, holding an old gold key in its legs, wings spread, flying;
   (2) one big spoked wooden war wheel with a bronze rim and a gold hub, standing upright, seen a little from the side;
   (3) the same wheel broken: snapped spokes, a cracked rim, splinters, falling apart;
   (4) a big grey cave boulder, rough and rounded, wider than tall, chest-high on a hero (heroes hide behind it);
   (5) a fluffy white cartoon sheep standing, round wool, black face and legs, sleepy happy eyes (one of Polyphemus's flock);
   (6) a tall clay Greek wine amphora with black meander bands and a cork, standing upright on its own small base."""),
 ]),
 ('4_japan', 'JAPAN', 'the Japanese lands (a spirit forest, a samurai battlefield, a ninja cave)', [
  ('JOROGUMO — BODY SHEET', 'ATTACH: the Jorogumo master picture (jpn1).', """
   Look: a beautiful spider woman — a pale face with six red eyes (two big, four small) and red lips, black hair in a geisha style with gold spider-web hairpins, red-and-gold tassels and purple wisteria, a purple kimono with gold web lines and pink sakura, a red obi with a gold spider brooch and red tassels; from the waist down a big black spider body with gold-striped legs ending in gold claws with red tassel rings, a round black abdomen with a red hourglass mark; she holds a purple paper umbrella with a web pattern.
   NOT in this picture: the hanging paper lanterns and loose webs — the game adds them.
   Walk: MANY LEGS, umbrella resting on her shoulder.
   Attack: leg stab — rears up and stabs twice with her two front legs."""),
  ('JOROGUMO — MOVES SHEET', '(No new picture: copy the body sheet you just drew.)', """
   Row 1 LEAP TO THE NEST AND DROP: 1) crouching low on all eight legs, 2) springing straight up, legs stretched down, 3) high in the air with legs tucked, 4) dropping back down legs-first, umbrella closed, 5) crash-landing with legs spread wide.
   Row 2 PARASOL GUARD: 1) holding the closed umbrella, 2) opening it in front of her, 3) the open umbrella held toward down-right like a shield, her face peeking over it, 4) spinning the umbrella, 5) closing it with a sly smile.
   Row 3 OPEN WINDOW — FALLEN AND BURNING: 1) fallen on her back with legs curled up, 2) small orange flames on her kimono hem and legs, swirly eyes, 3) the same, flailing, 4) rolling back onto her legs, patting out the flames."""),
  ('GASHADOKURO — BODY SHEET', 'ATTACH: the Gashadokuro master picture (jpn2).', """
   Look: a giant skeleton rising waist-up from a heap of bones, rocks and broken samurai armour — a red samurai helmet with a gold crescent crest and gold crest badge, red lacquer shoulder plates with gold badges, a red cord tied at the neck, blue ghost fire burning in the eye sockets and inside the rib cage, tattered purple sleeves, arrows stuck in its bones, a torn white war banner with a red sun on its back, a broken katana stuck in the heap.
   NOT in this picture: its hands. Its arms end at the wrists in blue ghost fire — the two giant bone hands are drawn separately (they fly free in the fight).
   It NEVER walks: the heap of bones stays at the bottom of every frame. Row 2 is a GHOST-FIRE ROAR instead of a walk, 4 frames: 1) leaning back, 2) jaw opening, 3) roaring, blue fire flaring in the eyes and chest, 4) closing the jaw.
   Attack (row 3): ghost-fire spit — leaning forward, blue fire gathering in the mouth, spitting a small blue fireball that is just leaving the jaw.
   Death (row 5): it crumbles into the heap — cracking, falling apart, the skull dropping, the skull resting on top of the heap, fading."""),
  ('GASHADOKURO — MOVES SHEET', '(No new picture: copy the body sheet you just drew.)', """
   Row 1 SKULL SLAM: 1) rearing back, 2) the whole upper body lunging down, 3) the skull slammed onto the ground in front of the heap, helmet knocked crooked, 4) lying there with the jaw slack and the eyes dim, 5) heaving back up.
   Row 2 THE BITE: 1) leaning forward, 2) the jaw opening wide, 3) chomp, 4) chewing, 5) leaning back. (The hand that brings a hero to its mouth is drawn by the game.)
   Row 3 OPEN WINDOW — SKULL DOWN: the skull resting on the ground in front of the heap — 1) eyes flickering, 2) jaw rattling, 3) the blue fire in its eyes dim and wobbly, 4) starting to lift."""),
  ('GASHADOKURO HANDS (props sheet type)', 'ATTACH: the Gashadokuro master picture (jpn2) again — copy its hands.', """
   6 poses of ONE giant bone RIGHT hand (big knuckles, long clawed bone fingers, a blue ghost-fire flame at the wrist instead of an arm), all seen from the same 3/4 view, all the same size:
   (1) hovering palm-down, fingers relaxed;
   (2) raised high with fingers spread wide, about to slap;
   (3) slapped flat on the ground, fingers splayed, a few cracked earth chunks right under the palm;
   (4) clenched in a grab, fingers closed around an empty space big enough to hold a small hero;
   (5) the hovering hand covered in extra bone armour and red samurai lacquer plates;
   (6) the hand crumbling apart into a falling heap of loose bones."""),
  ('JONIN SHADOW (TANUKI) — BODY SHEET', 'ATTACH: the Jonin Shadow master picture (jpn3).', """
   Look: a tanuki (raccoon dog) ninja master — a round fluffy face with a dark eye mask, fierce yellow eyes, red swirl paint on the cheeks, a big yellow leaf on his head, a dark purple ninja outfit with gold cloud patterns and a mesh shirt, a long red scarf flowing behind, a red rope belt with red tassels and gold bells, a brown pouch with shuriken, a katana on his back, a kunai in one hand and a round black smoke bomb with a lit fuse in the other, a big striped tanuki tail, straw sandals.
   NOT in this picture: the purple smoke clouds and falling leaves around him.
   Walk: TWO LEGS — a crouched sneaky run, the scarf streaming.
   Attack: throws three kunai — 1) ready, 2) arm drawn back with three kunai fanned between his fingers, 3) the throwing arm snapped forward, kunai just leaving, 4) follow-through, 5) ready."""),
  ('JONIN SHADOW (TANUKI) — MOVES SHEET', '(No new picture: copy the body sheet you just drew.)', """
   Row 1 SMOKE BOMB VANISH: 1) raising the smoke bomb, 2) slamming it at his feet, 3) curled into a ball holding the leaf over his head, 4) a tiny ball with the leaf on top, 5) only the leaf floating. (The game adds the smoke and turns him into an object in the room.)
   Row 2 IAI DASH: 1) a hand on the katana hilt, crouched low, 2) dashing forward with his body stretched and the scarf flying, 3) slashing across with the katana fully drawn, 4) stopped, katana held out, 5) sheathing the katana with a smirk.
   Row 3 OPEN WINDOW — FOUND YOU!: 1) popping out of hiding, startled, the leaf flying off, 2) fallen on his bottom with legs up and swirly eyes, 3) the same, rubbing his head, 4) scrambling back up."""),
  ('JAPAN PROPS SHEET', '(No picture needed.)', """
   6 objects for the Japanese boss arenas:
   (1) a tall Japanese paper lantern hanging from a wooden post with a short arm, round white-and-red paper with a sakura crest, glowing warm inside, a short silk thread tied to its top;
   (2) a cluster of silky white spider egg sacs stuck together with faint purple veins, wrapped in silk at the base;
   (3) a big spider nest of thick white silk strands shaped like a sagging hammock, with a few dry leaves caught in it, seen from below (it hangs high between treetops);
   (4) a wooden sake barrel with straw rope bands and a plain red paper label (no writing);
   (5) a glazed ceramic tanuki statue with a straw hat, a big belly and a sake bottle, grinning;
   (6) a grey stone garden lantern (tōrō) with a softly lit window.
   Objects 4–6 are ordinary room decorations — the ninja disguises himself as one of them, so they must look completely normal."""),
 ]),
 ('5_aztec', 'AZTEC', 'the Aztec lands (a cloud forest of pools, a sacrifice plaza, the bat-god cave)', [
  ('AHUIZOTL — BODY SHEET', 'ATTACH: the Ahuizotl master picture (azt1).', """
   Look: a water dog-otter beast — sleek dark-navy fur with light-blue water-swirl patterns, a gold Aztec plate headband with blue and white feathers, fierce yellow eyes, a snarling mouth with sharp white teeth and whiskers, a gold Aztec collar and gold leg bands, webbed paws with pink pads, and a long tail that ends in a black clawed hand with a gold band and a pink palm; water drips from its fur.
   Walk: FOUR LEGS, the tail-hand raised behind it like a scorpion's tail.
   Attack: a lunging bite."""),
  ('AHUIZOTL — MOVES SHEET', '(No new picture: copy the body sheet you just drew.)', """
   Row 1 DIVE: 1) crouching at the water's edge, 2) leaping in an arc, 3) nose-diving into a small round splash of blue water, 4) only the tail-hand sticking up out of the water ring, waving, 5) only the small water ring with ripples. (The water ring is part of these frames.)
   Row 2 BURST OUT: 1) its head bursting up through a water ring, 2) leaping out, water spraying off its fur, 3) in mid-air, shaking like a wet dog, 4) landing, 5) ready, dripping.
   Row 3 OPEN WINDOW — STRANDED ON LAND: 1) startled, looking around for water, 2) panicking with huge eyes and sweat drops, the tail-hand flailing, 3) panicking the other way, 4) calming down and snarling again."""),
  ('EAGLE WARLORD — BODY SHEET', 'ATTACH: the Eagle Warlord master picture (azt2).', """
   Look: an Aztec eagle warrior with an eagle's head — a hooked yellow beak, fierce gold eyes, a huge headdress of red, teal and white feathers with gold step-fret plates and a gold disc earring, a brown-and-cream feathered body, a gold sun-face pectoral, a red-white-and-gold woven waist cloth, a feather cape that spreads like wings, gold leg bands with turquoise, big yellow talons, a dark obsidian macuahuitl club-sword edged with stone blades and gold step patterns, and a round shield with a gold eagle head and red-and-gold rings.
   Walk: TWO LEGS — a proud march, the shield in front.
   Attack: two-beat slash — 1) ready, 2) wind-up, 3) first slash, 4) a second slash back across, 5) ready."""),
  ('EAGLE WARLORD — MOVES SHEET', '(No new picture: copy the body sheet you just drew.)', """
   Row 1 SKY DIVE: 1) crouching, the feather cape spreading like wings, 2) leaping up, 3) high in the air with wings spread wide, 4) diving down talons first, 5) crashing down, talons striking the ground.
   Row 2 SUN SHIELD: 1) raising the shield, 2) the shield held up in front, the gold eagle on it gleaming, peeking over it, 3) braced behind the shield, 4) bashing the shield forward in a counter, 5) back to ready.
   Row 3 OPEN WINDOW — TALONS STUCK: 1) talons stuck deep in a cracked patch of stone floor, his shield dropped on the ground beside him, 2) tugging and flapping, swirly eyes, 3) tugging the other way, 4) pulling free."""),
  ('CAMAZOTZ — BODY SHEET', 'ATTACH: the Camazotz master picture (azt3).', """
   Look: the death-bat god of the underworld — dark purple fur, huge red bat wings with gold step-fret patterns and bone claws, big ears, a pig-like leaf nose, glowing red eyes, sharp fangs, a gold headdress with red feathers, big gold ear spools, a gold necklace of fangs, a red-and-gold feathered waist cloth with a gold demon-face plate, gold arm bands and anklets, clawed feet, and an obsidian macuahuitl edged with spikes.
   NOT in this picture: the small bats and purple smoke around him.
   Walk: TWO LEGS — hunched, wings half folded like a cloak.
   Attack: beheading slash — a wide horizontal macuahuitl swing."""),
  ('CAMAZOTZ — MOVES SHEET', '(No new picture: copy the body sheet you just drew.)', """
   Row 1 SWOOP: 1) wings spread wide, 2) taking off, 3) gliding forward low and flat with wings stretched, 4) slashing as he swoops past, 5) pulling up, wings beating.
   Row 2 SCREECH: 1) wings folding in, head pulled back, 2) wings snapping open, 3) screeching with the mouth wide open and ears flat, wings spread wide, 4) still screeching, 5) closing the mouth. (The game draws the sound rings.)
   Row 3 OPEN WINDOW — BLINDED BY THE LIGHT: 1) falling to the ground, 2) sprawled, one wing over his eyes, swirly eyes, 3) the same with the other wing, 4) shaking his head and getting up."""),
  ('AZTEC PROPS SHEET', '(No picture needed.)', """
   6 objects for the Aztec boss arenas:
   (1) a carved Aztec dam stone: a squat block of grey-blue stone with a gold step-fret band and a carved water glyph, wet with water stains;
   (2) Ahuizotl's grabbing tail on its own: a long dark-navy tail with light-blue swirls rising from below and ending in a black clawed hand with a gold band, fingers closed in a grab around an empty space big enough to hold a small hero;
   (3) a tall Aztec stone pillar carved with a feathered serpent and step-fret patterns, a gold band at the top, about 3 times as tall as wide;
   (4) an Aztec stone brazier on a short stepped pedestal carved with a bat face, unlit, cold grey ash inside;
   (5) the same brazier lit, with a bright orange fire;
   (6) a small flying bat with red wings and purple fur, wings spread (one of Camazotz's swarm)."""),
 ]),
]

def build():
    out = os.path.join(ROOT, 'boss_prompts'); os.makedirs(out, exist_ok=True); tot = 0
    for fn, land, where, items in LANDS:
        n = len(items); tot += n
        lst = '\n'.join(f'  #{i+1} {t}' for i, (t, _, _) in enumerate(items))
        body = '\n\n'.join(f'#{i+1} {t}\n   {a}{tx.rstrip()}' for i, (t, a, tx) in enumerate(items))
        s = (f'MAP BOSS SPRITES — {land} ({n} pictures)\n'
             f'Game: Totem Legend, a 2D isometric fantasy MMORPG (Ragnarok Online feel). These are the area bosses of {where} and the objects of their arenas.\n\n'
             f'{HOW.format(n=n)}\n\n{RULES}\n\n=== PICTURES IN THIS FILE ===\n{lst}\n\n=== ENTRIES ===\n\n{body}\n')
        with open(os.path.join(out, fn + '.txt'), 'w', encoding='utf-8') as f: f.write(s)
        print(fn, n, 'pictures', len(s), 'chars')
    print('total', tot)

if __name__ == '__main__':
    build()
