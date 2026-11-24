"""Motion-clip prompts (image-to-video) for one hero: 5 directions x 4 actions = 20 complete copy-paste prompts,
written to <HERO>_CLIP_PROMPTS_TH.md (never edit that file by hand: change this script and run it again).
usage: python3 tools/clip_prompts.py sheep [print]      (print = only the 20 prompts, for pasting into the chat)

The template carries the lessons of the earlier clip rounds (snow monkey, axolotl, dragon — NEW_HERO_CONCEPTS_TH.md
'คลิปท่า 20 ตัว'): a facing sentence first (models turn back views toward the camera), a face lock on the views that
show the face and a 'face never turns toward us' sentence on the back views instead, walk in place at ~2 steps a second,
the same strike in every direction ending in a still pose, no blur, no effects, locked camera, flat green.
A new hero = a new entry in HEROES."""
import sys, os

DIRS = ['S', 'SE', 'E', 'NE', 'N']
BACK = ('NE', 'N')

def facing(d, P, p, pos):
    return {'S': f"{P} faces straight toward the viewer (front view), exactly as in the picture.",
            'SE': f"{P} is seen in a three-quarter front view, facing down and to the right, exactly as in the picture.",
            'E': f"{P} is seen in a side view, facing right, exactly as in the picture.",
            'NE': f"{P} is seen in a three-quarter back view, facing away from us up and to the right, exactly as in the picture; "
                  f"we mostly see {pos} back and {p} never turns toward the viewer.",
            'N': f"{pos.capitalize()} back faces the viewer (back view), exactly as in the picture; {p} never turns toward the viewer."}[d]

NOFX = "No shadow, no flash, no glow, no sparkles, no particles, no smoke, no magic effects, no text."

def tail(P, pos, weapon, nofx=None, inframe=None):
    return ("Keep the exact look of the picture: hand-painted chibi cartoon, thick dark-brown outlines, flat cel shading — "
            "not realistic, not 3D. The background stays plain flat green for the whole clip. The camera never moves or zooms. "
            f"{P} stays in the middle of the frame at the same size and never turns to another direction; "
            + (inframe or f"{pos} whole body and the whole {weapon} stay inside the frame.") + " " + (nofx or NOFX))

HEROES = {
 'sheep': dict(
  title='แกะขนทอง (Chrysie · Golden Fleece Sheep)',
  who='the little sheep priestess in this picture', P='She', p='she', pos='her', weapon='staff',
  face="Keep her face exactly as in the picture: the same big blue eyes and the same gentle smile, mouth closed.",
  back_face={'NE': "We see her mostly from behind: the back of her fluffy hair, her horns and only the edge of her face "
                   "with one eye, as in the picture; her face never turns toward us.",
             'N': "We only see the back of her fluffy hair and her two curled horns, as in the picture; "
                  "her face never turns toward us."},
  keep={'S': "Her curled golden horns, laurel tiara, earrings and purple cape stay exactly the same.",
        'SE': "Her curled golden horns, laurel tiara, earrings and purple cape stay exactly the same.",
        'E': "Her curled golden horns, laurel tiara, earrings and purple cape stay exactly the same.",
        'NE': "Her curled golden horns, laurel tiara and purple cape stay exactly the same.",
        'N': "Her curled golden horns and purple cape stay exactly the same."},
  spos={'S': 'beside her', 'SE': 'beside her', 'E': 'in front of her', 'NE': 'in front of her', 'N': 'beside her'},
  blink=", her earrings swing gently, and she blinks once",
  vis=" The staff stays visible beside her body during the whole swing.",
  act={
   'idle': "Idle loop of {who}. {facing} She stands in a relaxed pose holding her golden staff upright {spos}, the laurel "
           "wreath and blue orb at the top, and breathes slowly; her fluffy pale-pink woolly hair, her cape and the hem of "
           "her dress sway a little{blink}. The last frame matches the first frame so the clip loops.",
   'walk': "Walk loop of {who}. {facing} She walks in place, like on a treadmill, toward the way she is facing: light, "
           "bouncy little steps (about two steps per second), her golden staff held upright {spos} swinging a little with "
           "each step, her woolly hair bouncing and her cape swaying. She does not move across the frame and the ground "
           "does not move. The last frame matches the first frame so the clip loops.",
   'attack': "Attack of {who}. {facing} She grips her golden staff with both hands, pulls it back over her shoulder in a "
             "short wind-up, then swings it down in a fast diagonal arc in front of her toward the way she is facing, orb "
             "head first, holds the moment of the hit for an instant with the orb low in front of her, then returns to her "
             "starting pose and stands still for the rest of the clip. The whole strike takes about one second. Her feet "
             "stay in place.{vis} Clean outlines in every frame, no motion blur. The blue orb never lights up or glows.",
   'buff': "Spell cast of {who}. {facing} She raises her golden staff high above her head with both hands, the blue orb "
           "pointing to the sky, and holds that pose still for about one second, then lowers the staff back {spos}, "
           "returns to her starting pose and stands still for the rest of the clip. Her feet stay in place. Clean outlines "
           "in every frame, no motion blur. The blue orb never lights up or glows."},
  dirname={'S': 'หน้าตรง', 'SE': 'เฉียงหน้า (ภาพกลับด้าน)', 'E': 'ข้าง หันขวา', 'NE': 'เฉียงหลัง', 'N': 'หลัง'},
  actname={'idle': 'ยืน (idle · วนลูป)', 'walk': 'เดิน (walk · วนลูป)',
           'attack': 'ตี (attack · คอมโบไม้เท้าตีปกติ + ปล่อย Light Ball + สกิลที่ใช้ท่าตี)',
           'buff': 'ร่าย (buff · ฮีล / บัฟ / เพลง / อัลติ — เกมค้างเฟรมตอนชูไม้ไว้ตอนชาร์จ Light Ball)'},
  start={'idle': 'sheep_{n}_{d}_stand.png', 'walk': 'sheep_{n}_{d}_stand.png', 'buff': 'sheep_{n}_{d}_stand.png',
         'attack': 'sheep_{n}_{d}_attack.png'},
  header="""เจ้าของส่งภาพ 5 มุม 2026-11-23 20:45 (หน้า · ข้างหันขวา · หลัง · เฉียงหลังหันขวา · เฉียงหน้าหัน**ซ้าย**) + 'ขอพร้อมเจนวีดีโอท่าทางให้หน่อย'

## ภาพที่ได้
- `assets/heroes/sheep/view_S|E|N|NE|SW.webp` = ต้นฉบับบนพื้นเขียว ภาพละมุม (1199×1312) · ภาพเฉียงหน้าวาดหันซ้าย (SW) → กลับด้านเป็น SE ตอนทำภาพตั้งต้น
- หน้าตา: แกะสาวนักบวชกรีก เขาแกะทองม้วน ผมขนแกะฟูสีชมพูอ่อน ตาฟ้าโต มงกุฎใบลอเรลทองมีเพชรฟ้า ต่างหูเพชรฟ้า ชุดกรีกขาว–ม่วงอ่อน เข็มขัดพระอาทิตย์ทอง ผ้าคลุมม่วงขอบลายกรีกทอง หลังผ้าคลุมเป็นเสาไอโอนิก + ช่อลอเรล กำไลทอง รองเท้าสานทองมีเพชรฟ้า · ไม้เท้าทอง หัวเป็นช่อลอเรล + ลูกแก้วฟ้า ปลายล่างหัวแหลมทอง · ไม่มีสีเขียวเลย → ตัดพื้นเขียวได้สะอาด

## ภาพตั้งต้น ชุด 2 (2026-11-23 21:40) — ทิศละ 2 ภาพ
เจ้าของ 21:40 'เจนวีดีโอมาแล้วภาพมันคุณภาพแย่มาก' → แอปของเจ้าของทำคลิป 480p (คลิปลิง = 480×480) · ชุดแรก (900×900 ตัวสูง 450 = ครึ่งจอ, ส่งไปชื่อ sheep_1_S … sheep_5_N.png) ในคลิปตัวเธอสูงแค่ ~240 px ทั้งที่ชุดเต็มไปด้วยลายกรีก ใบลอเรล ต่างหู → รายละเอียดเละ · ชุด 2 ให้ตัวใหญ่ขึ้นในคลิปโดยใช้กรอบไม่สี่เหลี่ยม (แอปให้ 480 กับด้านสั้น):
- `sheep_<n>_<ทิศ>_stand.png` 1080×1920 แนวตั้ง ใช้กับ ยืน · เดิน · ร่าย — ตัวสูง 900 (ในคลิป ~400 px) เท้าที่ 90 % เหลือเหนือหัว 0.9 เท่าตัวให้ชูไม้ ข้างละ 0.25–0.3 เท่าตัว
- `sheep_<n>_<ทิศ>_attack.png` 1920×1080 แนวนอน ใช้กับ ตี — ตัวสูง 630 (ในคลิป ~280 px) เท้าที่ 93 % เหลือเหนือหัว 0.6 เท่าตัว ข้างละ 1.2 เท่าตัวให้เหวี่ยงไม้
```
V=assets/heroes/sheep; for m in "stand 1080x1920 .9 900" "attack 1920x1080 .93 630"; do set -- $m
python3 -I tools/dir8cut.py startv <โฟลเดอร์> S=$V/view_S.webp SE=$V/view_SW.webp:flip E=$V/view_E.webp NE=$V/view_NE.webp N=$V/view_N.webp size=$2 feet=$3 ht=$4 clean=0 suf=_$1; done
```
→ start_<ทิศ>_stand.png / start_<ทิศ>_attack.png ทุกทิศสเกลเดียวกันในชุดเดียวกัน · clean=0 = ไม่ทาจุดเขียวในตัว (แกะไม่มีสีเขียว จุดเขียวเล็กๆ ในตัวคือช่องว่างระหว่างใบลอเรล / มือกับไม้ ถ้าทาจะเป็นจุดดำ) · ถ้าแอปเลือกความละเอียดได้ 720p / 1080p ช่วยมากกว่านี้อีก

## วิธีใช้
แนบภาพตั้งต้นของทิศนั้น (ตี = ภาพ _attack แนวนอน · ยืน / เดิน / ร่าย = ภาพ _stand แนวตั้ง) + วางพรอมต์ทีละตัว → 4 คลิปต่อทิศ (ยืน · เดิน · ตี · ร่าย) · คลิปละ 3–5 วิ · ไม่ต้องทำทิศซ้าย (เกมกลับด้านเอง) · ส่งกลับเรียง S → SE → E → NE → N ทิศละ ยืน → เดิน → ตี → ร่าย (สลับได้ ดูเองว่าคลิปไหนเป็นท่าอะไร)

## กติกาที่อยู่ในทุกพรอมต์ (บทเรียนจากคลิปลิง / แอคโซลอเติล / มังกร)
- ประโยคบอกทิศขึ้นต้นทุกพรอมต์ กันโมเดลหมุนตัวหันหากล้อง (มุมหลังโดนบ่อย)
- ล็อกหน้า (ตาฟ้าโต ยิ้มอ่อน ปากปิด) ในมุมที่เห็นหน้า · มุมหลัง (NE, N) ใช้ประโยค 'เห็นแค่หลังหัว หน้าไม่หันมา' แทน — ใส่ประโยคล็อกหน้าในมุมหลังแล้วโมเดลจะหันหน้ามาหากล้อง · มุมหลังไม่มีกะพริบตา
- ล็อกของติดตัว: เขาแกะ มงกุฎ ต่างหู ผ้าคลุม · ไม้เท้าช่อลอเรล + ลูกแก้วฟ้าอยู่ข้างบน
- เดินอยู่กับที่แบบลู่วิ่ง ก้าวเร็ว ~2 ก้าว/วิ (คลิปเดินแอคโซลอเติลช้าจนไถลพื้น)
- ตี = ท่าเดียวกันทุกทิศ (จับไม้สองมือ ง้างข้ามไหล่ ฟาดเฉียงลงหน้าตัว หัวลูกแก้วนำ ค้างจังหวะโดนนิดนึง) แล้วยืนนิ่งจนจบคลิป · มุมหลังสั่งให้ไม้ยังเห็นข้างตัวตลอด (ไม่งั้นโดนตัวบัง)
- ร่าย = ชูไม้เหนือหัวสองมือ ลูกแก้วชี้ฟ้า ค้างนิ่ง ~1 วิ แล้วกลับท่าเดิม (เกมค้างเฟรมนี้ตอนชาร์จ Light Ball / ร่ายยาว)
- ห้ามเบลอ · ห้ามแสง ประกาย วงเวท ลูกแก้วเรืองแสง (เอฟเฟกต์ใส่ด้วยโค้ดในเกม) · กล้องนิ่งไม่ซูม (คลิป N ของแอคโซลอเติล / เดิน S ของมังกรเคยซูม) · พื้นเขียวตลอด · ตัว + ไม้อยู่ในกรอบตลอด
- ไม่ระบุมือที่ถือไม้ (ภาพ SE เป็นภาพกลับด้าน ไม้อยู่มืออีกข้าง) · ไม่พูดถึงสีทองของผม (ผมชมพูอ่อน — คำว่า golden fleece จะทำให้โมเดลระบายผมเป็นทอง)""",
  footer="""## ตอนคลิปมาถึง (โน้ตสำหรับแชตที่ทำต่อ)
- คลิปตีถ่ายจากกรอบแนวนอน ตัวเล็กกว่าคลิปอื่นในทิศเดียวกัน (630 / 900 ของภาพตั้งต้น) → ต้องสเกลต่อคลิป: วัดความสูงตัวในเฟรมแรกของทุกคลิป (= ท่ายืนตั้งต้นเดียวกัน) แล้วปรับให้เท่าคลิป idle ของทิศนั้น (cliphero ยังมีแค่ perDir — เพิ่มตัวเลือกต่อคลิปตอนตัด)
- ตัดด้วย `tools/cliphero.py` + แผน `tools/clips/sheep_plan.json` (ดู `tools/clips/wukong_plan.json` เป็นตัวอย่าง: flipDirs ถ้ามีคลิปหันผิดฝั่ง, perDir ถ้าคลิปบางทิศถ่ายมาเล็ก / ใหญ่กว่า, loop ถ้าช่วงต้นคลิปยืนขยับไม่วน) → assets_sheep.js ใหม่ (prefix SHE เดิม — SHE_ART ใน index.html สลับ atlas ให้อยู่แล้ว)
- เวลาเฟรมใช้ของสไปรต์ชั่วคราวเดิม (assets_sheep.js จาก statichero.py): idle 12 × 190 ms · walk 8 × 110 · attack 12 เฟรม [60 × 8, 70, 80, 90, 100] contact 8 · buff 12 × 80 peak 7 · hurt 7 × 70 → จังหวะโดน / ปล่อยสกิลเท่าเดิม bench ไม่เปลี่ยน (แบบลิง)
- sockets: ลูกแก้วฟ้าบนหัวไม้ (cliphero 'orb' แบบแอคโซลอเติล) → แก้ crook() / tip() ใน sheep_vfx.js ให้ใช้ตำแหน่งลูกแก้วแทนปลายไม้ข้อของสไปรต์ชั่วคราว (cell 306,204)
- วัด CHAR_SCALE.sheep ใหม่ (ตอนนี้ 1.54 = สไปรต์ชั่วคราว) ให้สูงเท่าหมาป่า · เช็ก hit times ด้วย tools/fxlab.py hits sheep ก่อน / หลัง (ต้องเท่าเดิม)
- ยังไม่มี: หน้า HUD / หน้าสร้างตัว (ตัดหัวจาก view_S ผ่าน window.HUD_FACE แบบลิง / มังกรอัศวินได้เลย), ไอคอนสกิล (assets/icons/sheep ยังไม่มี), พื้นหลังทรี 4 สาย, ท่านั่ง (hero_sit.js)"""),
 'bastet': dict(
  title='บาสเต็ด (Bastet Priestess · นักบวชแมวแห่งคำสาป)',
  who='the little cat priestess in this picture', P='She', p='she', pos='her', weapon='book',
  face="Keep her face exactly as in the picture: the same big amber cat eyes with the same calm, slightly sly look, "
       "the same little cat smile, mouth closed.",
  back_face={'NE': "We see her mostly from behind: the back of her head with the cream veil, her tall cat ears and only the "
                   "edge of her face with one eye, as in the picture; her face never turns toward us.",
             'N': "We only see the back of her head: her tall cat ears, the gold headband and the long cream veil with the "
                  "gold key pattern, as in the picture; her face never turns toward us."},
  keep={d: ("Her tall brown cat ears, the gold headband with its big turquoise gem, the gold tassel earrings, her long brown "
            "braids, her ringed brown cat tail and the dark-blue apron with the gold ankh stay exactly the same.")
        for d in ('S', 'SE', 'E')} | {d: ("Her tall brown cat ears, the gold headband, the long cream veil, her braids with "
            "gold tassels and her ringed brown cat tail stay exactly the same.") for d in ('NE', 'N')},
  spos={'S': 'just above her open palm', 'SE': 'just above her open palm', 'E': 'in front of her, just above her open palm',
        'NE': 'in front of her, just above her open palm', 'N': 'beside her shoulder'},
  blink=", and she blinks once",
  vis=" Her thrusting hand stays visible beside her head during the thrust.",
  fmt={'look': (', looking up at it', '')},
  nofx="The little blue flame over the open book is part of her design: it stays small and only flickers gently. Nothing "
       "else glows: no shadow, no flash, no sparkles, no particles, no smoke, no other magic effects, no text.",
  act={
   'idle': "Idle loop of {who}. {facing} She stands in a relaxed pose; a small open dark-blue book with a gold ankh on its "
           "cover floats {spos}, a little blue flame curling over its pages, and the book bobs gently up and down. She "
           "breathes slowly; her long braids, the gold tassels, her veil and the cloth of her skirt sway a little, her tail "
           "swishes slowly, her ears twitch once{blink}. The last frame matches the first frame so the clip loops.",
   'walk': "Walk loop of {who}. {facing} She walks in place, like on a treadmill, toward the way she is facing: light little "
           "steps (about two steps per second), the small open book floating {spos} and moving along with her, her braids "
           "and tassels bouncing, her tail and veil swaying. She does not move across the frame and the ground does not "
           "move. The last frame matches the first frame so the clip loops.",
   'attack': "Attack of {who}. {facing} The small open book stays floating {spos}. She pulls her free hand back beside her "
             "shoulder in a short wind-up, then thrusts it forward and a little upward toward the way she is facing, palm "
             "open and fingers spread like a cat's claw, holds that pose for an instant, then lowers her hand back to her "
             "starting pose and stands still for the rest of the clip. The whole move takes about one second. Her feet "
             "stay in place.{vis} Clean outlines in every frame, no motion blur.",
   'buff': "Spell cast of {who}. {facing} She lifts the open book high above her head on her open palm and raises her "
           "other hand beside it{look}, holds that pose still for about one second, then lowers the book back {spos}, "
           "returns to her starting pose and stands still for the rest of the clip. Her feet stay in place. The raised book "
           "stays inside the frame. Clean outlines in every frame, no motion blur."},
  dirname={'S': 'หน้าตรง', 'SE': 'เฉียงหน้า หันขวา', 'E': 'ข้าง หันขวา', 'NE': 'เฉียงหลัง หันขวา', 'N': 'หลัง'},
  actname={'idle': 'ยืน (idle · วนลูป)', 'walk': 'เดิน (walk · วนลูป)',
           'attack': 'ตี (attack · ตีปกติ = ปาหน้ากระดาษคำสาป + สกิลที่ใช้ท่าตี)',
           'buff': 'ร่าย (buff · คำสาป / เรียกผู้รับใช้ / บัฟ / อัลติ — เกมค้างเฟรมตอนชูหนังสือไว้ตอนร่ายยาว)'},
  start='bastet_{n}_{d}.png',
  header="""เจ้าของส่งภาพ 5 มุม 2026-11-24 11:56 (หน้า · เฉียงหน้าหันขวา · ข้างหันขวา · เฉียงหลังหันขวา · หลัง) + 'ขอพร้อมทำท่าทางหน่อย'

## ภาพที่ได้
- `assets/heroes/bastet/view_S|SE|E|NE|N.webp` = ต้นฉบับบนพื้นเขียว ภาพละมุม (1086×1448) · ทุกมุมหันขวาอยู่แล้ว ไม่ต้องกลับด้าน
- หน้าตา: แมวสาวนักบวชอียิปต์ หูแมวน้ำตาลตั้งสูง ตาอำพันโต ลายเสือที่แก้ม ยิ้มแบบแมว ผมน้ำตาลยาวถักเปียปลายพู่ทอง คาดผมทองมีเพชรเทอร์ควอยซ์ใหญ่ ต่างหูพู่ทอง ผ้าคลุมผมสีครีมขอบลายทอง ปลอกคอทอง เสื้อเกาะอกน้ำเงินเข้ม กำไลทอง กระโปรงครีมผ่าข้าง ผ้าห้อยหน้าสีน้ำเงินลายอังค์ทอง กำไลข้อเท้าทอง รองเท้าแตะ หางแมวน้ำตาลมีวงทอง · หนังสือเปิดปกน้ำเงินลายอังค์ทองลอยเหนือฝ่ามือ มีเปลวไฟสีฟ้าเล็กๆ เหนือหน้ากระดาษ (มุมหลัง: ลอยข้างไหล่) · ไม่มีสีเขียวในชุด (เพชรเป็นสีเทอร์ควอยซ์ฟ้า) → ตัดพื้นเขียวได้สะอาด
- มุมหน้าหนังสืออยู่มือซ้าย มุมหลังหนังสืออยู่ฝั่งขวา → พรอมต์ไม่ระบุมือซ้าย / ขวาเลย ใช้ 'มือที่รองหนังสือ' กับ 'มือว่าง'

## ภาพตั้งต้น (แนบภาพของทิศนั้นทุกคลิป)
- `bastet_<n>_<ทิศ>.png` 900×900 สี่เหลี่ยม (แบบเดียวกับที่ใช้ทำคลิปแกะได้) · ตัวสูง 540 = 60 % ของกรอบ (แกะ 50 %) → ในคลิป 480p ตัวสูง ~290 px (แกะ ~240) รายละเอียดชัดขึ้น · เท้าที่ 88 % เหลือเหนือหัว 0.40–0.48 เท่าตัวให้ชูหนังสือ ข้างละ ~0.45 เท่าตัวให้ผลักมือ
```
V=assets/heroes/bastet; python3 -I tools/dir8cut.py startv <โฟลเดอร์> S=$V/view_S.webp SE=$V/view_SE.webp E=$V/view_E.webp NE=$V/view_NE.webp N=$V/view_N.webp size=900 feet=.88 ht=540 clean=0
```
→ start_<ทิศ>.png ทุกทิศสเกลเดียวกัน (สเกลจากมุมหน้า) · clean=0 = ไม่ทาจุดเขียวในตัว (ช่องว่างระหว่างเปีย / แขนกับตัวเป็นพื้นหลังจริง) · ถ้าแอปเลือกความละเอียดได้ 720p ขึ้นไป ช่วยอีก

## วิธีใช้
แนบภาพตั้งต้นของทิศนั้น + วางพรอมต์ทีละตัว → 4 คลิปต่อทิศ (ยืน · เดิน · ตี · ร่าย) · คลิปละ 3–5 วิ · ไม่ต้องทำทิศซ้าย (เกมกลับด้านเอง) · ส่งกลับเรียง S → SE → E → NE → N ทิศละ ยืน → เดิน → ตี → ร่าย (สลับได้ ดูเองว่าคลิปไหนเป็นท่าอะไร)

## กติกาที่อยู่ในทุกพรอมต์ (บทเรียนจากคลิปลิง / แอคโซลอเติล / มังกร / แกะ)
- ประโยคบอกทิศขึ้นต้นทุกพรอมต์ กันโมเดลหมุนตัวหันหากล้อง (มุมหลังโดนบ่อย)
- ล็อกหน้า (ตาอำพันโต ยิ้มแมว ปากปิด) ในมุมที่เห็นหน้า · มุมหลัง (NE, N) ใช้ประโยค 'เห็นแค่หลังหัว หน้าไม่หันมา' แทน และไม่มีกะพริบตา / ไม่มีเงยหน้ามองหนังสือ
- ล็อกของติดตัว: หูแมว คาดผมเพชร ต่างหูพู่ เปีย หาง ผ้าห้อยลายอังค์ (มุมหลัง: ผ้าคลุมผม)
- หนังสือลอยอยู่ที่เดิมตลอด (เหนือฝ่ามือ / ข้างไหล่ในมุมหลัง) · เปลวไฟฟ้าเหนือหนังสือเป็นส่วนของดีไซน์ ให้เล็กเท่าเดิม ไหววูบนิดเดียว ห้ามแสงอื่น
- เดินอยู่กับที่แบบลู่วิ่ง ก้าวเร็ว ~2 ก้าว/วิ (คลิปเดินช้าจะไถลพื้น)
- ตี = ท่าเดียวกันทุกทิศ: ง้างมือว่างข้างไหล่ แล้วผลักฝ่ามือกางนิ้วเหมือนกรงเล็บแมวไปข้างหน้าเฉียงขึ้นนิดๆ ค้างจังหวะนิดนึง แล้วยืนนิ่งจนจบคลิป (หนังสือลอยที่เดิม) · มุมหลังสั่งให้มือที่ผลักยังเห็นข้างหัว (ไม่งั้นโดนตัวบัง)
- ร่าย = ชูหนังสือเหนือหัวบนฝ่ามือ อีกมือยกข้างๆ ค้างนิ่ง ~1 วิ แล้วกลับท่าเดิม (เกมค้างเฟรมนี้ตอนร่ายยาว)
- ห้ามเบลอ · ห้ามแสง ประกาย วงเวท (เอฟเฟกต์ใส่ด้วยโค้ดในเกม) · กล้องนิ่งไม่ซูม · พื้นเขียวตลอด · ตัว + หนังสืออยู่ในกรอบตลอด""",
  footer="""## คลิปมาแล้ว 2026-11-24 16:23 → ใส่เกมแล้ว ('ของบาสเตดเพิ่มเข้าเกมให้หน่อย')
- 20 คลิป (480×640 24 fps พื้นเขียว) มาเรียง ร่าย → ตี → เดิน → ยืน ทีละทิศ SE → S → E → NE → N · ทุกคลิปหันขวา สเกลเดียวกัน ไม่มีซูม
- `assets_bastet.js` (prefix BST, ~5.5 MB) = `python3 -I tools/cliphero.py tools/clips/bastet_plan.json assets_bastet.js BST` · โหลดเฉพาะ ?char=bastet · index.html BST_ART สลับ atlas เข้า (atkRemap {}) · `?bstart=0` = กลับไปร่างหมาป่าเดิม (ไว้เทียบ)
- จังหวะ: จำนวนเฟรม / เวลาเฟรม / contact / peak ของท่าตี + ร่าย = ของสไปรต์หมาป่าเดิมทุกทิศ (NE ใช้แถว E เพราะหมาป่าเดิมแมปท่าตี NE → E) → เวลา event ของทุกสกิล × 8 ทิศ เท่าเดิมทุกตัว · bench A 1,768 / 1,765 · B 1,993 / 1,992 (ใหม่ / เดิม)
- เฟรมเลี่ยงเอฟเฟกต์ที่โมเดลแอบใส่ (ตี: E 22–32 เส้นฟ้า, NE 26–30 แฟลช, N 25–33 วงแหวนฟ้า · ร่าย: E 17–26 รัศมีทอง) และตอนหลับตา (ยืน S 19–28, SE 7–12 / 51–55 / 103–108, E 14–36 · ร่าย S 7–11 / 57–60, SE 5–7 / 71–73, E 78–84 → ท่าลดหนังสือของ E ใช้เฟรมยกย้อนกลับ)
- sockets = เปลวไฟฟ้าเหนือหนังสือทุกท่า (orbAll + orbMask มีเกณฑ์สีแดงขั้นต่ำ 'r':70 กันเพชรเทอร์ควอยซ์) · ท่าตีตั้งแต่ง้างจนค้าง = ฝ่ามือ (orbFix อ่านด้วยตา) → หน้ากระดาษตีปกติเกิดที่มือแล้วพุ่งออกตอนผลัก
- bastet_vfx.js: ตีปกติใช้คลิปตีของเธอเอง (ไม่สลับเป็นคลิปร่ายแล้ว) · tip() / headZ() อ่าน socket ของเฟรมที่เห็นจริง (liveSocket ถูกห่อให้คูณ CHAR_SCALE รอบเท้า) · แสงขอบตัวตอนแอ็กชันเบาลง ×.45 (แบบมังกร / สิงโต)
- CHAR_SCALE.bastet 1.56 (สูงเท่าหมาป่า) · หน้า HUD = assets/heroes/bastet/face.webp (ตัดจาก view_S, window.HUD_FACE)
- ยังไม่มี: ไอคอนสกิล (ใช้โค้ด SVG), พื้นหลังทรี 4 สาย, ท่านั่ง (hero_sit.js)"""),
 'hippo': dict(
  title="ฮิปโป ลุคใหม่ (Hapi · องครักษ์ทาเวเรต · Taweret's Guardian)",
  who='the chubby little hippo guardian in this picture', P='He', p='he', pos='his', weapon='mace and the whole shield',
  face="Keep his face exactly as in the picture: the same big brown eyes under the same bold, determined brows, the same "
       "rosy cheeks, the two small rounded tusks and the same confident smile, mouth closed.",
  back_face={'NE': "We see him mostly from behind: the back of his round head with the gold headband and the two small horns, "
                   "one small round ear and only the edge of his cheek and snout, as in the picture; his face never turns "
                   "toward us.",
             'N': "We only see the back of his round head: his two small round ears, the two small horns and the back of the "
                  "gold headband, as in the picture; his face never turns toward us."},
  keep={d: ("His gold headband with the sun disc and the two small cream horns, the teal cape with the little gold clasp and "
            "its two tassels, the round bronze-and-teal shield on his forearm and the studded bronze mace stay exactly the same.")
        for d in ('S', 'SE', 'E')} | {d: ("His gold headband with the two small cream horns, the teal crocodile-tail cape with "
            "its row of cream spikes, the round shield on his forearm and the studded bronze mace stay exactly the same.")
            for d in ('NE', 'N')},
  spos=dict.fromkeys(DIRS, 'upright beside him'),
  blink=", his small round ears twitch once, and he blinks once",
  vis=" The mace stays visible beside his body during the whole swing.",
  nofx="No shadow, no flash, no glow, no sparkles, no dust, no particles, no smoke, no water, no magic effects, no text.",
  act={
   'idle': "Idle loop of {who}. {facing} He stands in a sturdy, relaxed pose, the studded mace held {spos} and the round "
           "shield on his other forearm, and breathes slowly: his round belly rises and falls with a soft bounce, his cheeks "
           "puff a little and the crocodile-tail cape sways gently{blink}. The last frame matches the first frame so the "
           "clip loops.",
   'walk': "Walk loop of {who}. {facing} He walks in place, like on a treadmill, toward the way he is facing: short, stubby, "
           "bouncy steps (about two steps per second) with a cute little waddle, his round body rocking gently from side to "
           "side and his belly bouncing with each step, the mace held {spos} and the shield moving with his arm, the "
           "crocodile-tail cape swinging behind him. He does not move across the frame and the ground does not move. The "
           "last frame matches the first frame so the clip loops.",
   'attack': "Attack of {who}. {facing} He lifts the studded mace back over his shoulder in a short wind-up, then swings it "
             "down in a fast, heavy diagonal smash in front of him toward the way he is facing, the round head of the mace "
             "first, holds the moment of the hit for an instant with the mace head low in front of him and his belly "
             "bouncing from the blow, then returns to his starting pose and stands still for the rest of the clip. The whole "
             "strike takes about one second. His feet stay in place and the shield stays on his other forearm.{vis} Clean "
             "outlines in every frame, no motion blur.",
   'buff': "Power-up of {who}. {facing} He raises the studded mace high above his head, the round head pointing to the sky, "
           "lifts the round shield up beside it and puffs out his chest and round belly proudly, holds that pose still for "
           "about one second, then lowers the mace back {spos}, returns to his starting pose and stands still for the rest "
           "of the clip. His feet stay in place. The raised mace stays inside the frame. Clean outlines in every frame, no "
           "motion blur."},
  dirname={'S': 'หน้าตรง', 'SE': 'เฉียงหน้า หันขวา', 'E': 'ข้าง หันขวา', 'NE': 'เฉียงหลัง หันขวา', 'N': 'หลัง'},
  actname={'idle': 'ยืน (idle · วนลูป)', 'walk': 'เดิน (walk · วนลูป · Waddle Rush ก็ใช้คลิปนี้)',
           'attack': 'ตี (attack · คอมโบกระบอง + จังหวะลงพื้นของท่ากระโดดทับทุกท่า + สกิลที่ใช้ท่าตี)',
           'buff': 'ชูกระบอง (buff · ตอนย่อ + ลอยกลางอากาศของท่ากระโดดทับ · กิน / หาว / เรอ · ร่ายโคลน น้ำ บัว · บัฟ · อัลติ)'},
  start='hippo_{n}_{d}.png',
  header="""เจ้าของเลือกแบบ 4 'องครักษ์ทาเวเรต' 2026-11-24 13:30 ("เอาตัวนี้ ขอพรอมต์ให้ทำแบบแยกท่าทางด้วย") · ชีต `assets/heroes/hippo/sheet_taweret.webp` · หน้าตา + พรอมต์ภาพยืน 5 มุม: `HIPPO_LOOK_PROMPTS_TH.md` หัวข้อ 'เลือกแล้ว'

## ลำดับงาน
1. **ภาพยืน 5 มุม** ✓ มาแล้ว 2026-11-24 13:53 (เจนจากพรอมต์ใน `HIPPO_LOOK_PROMPTS_TH.md`) → `assets/heroes/hippo/view_S|SE|E|NE|N.webp` (ต้นฉบับพื้นเขียว 1254×1254 ทุกมุมหันขวาแล้ว ไม่ต้องกลับด้าน) · มาพร้อมภาพท่าพิเศษ 2 ภาพ (`pose_jump.webp` กระโดดทับ · `pose_gulp.webp` ดูด) ใช้ในเกมเป็นสไปรต์ ไม่เกี่ยวกับคลิป
2. **ภาพตั้งต้น** ✓ ส่งแล้ว 2026-11-24 — ตัดจากภาพ 5 มุม (คำสั่งข้างล่าง) เป็น `hippo_1_S.png … hippo_5_N.png` (ไม่เก็บในรีโป สร้างใหม่ได้ทุกเมื่อ)
3. **คลิป 20 ตัว** ✓ มาแล้ว 2026-11-24 17:58 (เจ้าของส่ง 20 คลิป ไม่มีข้อความ) → ในเกมแล้ว 18:12 = สไปรต์จากคลิป (หัวข้อ 'สร้างแล้ว' ท้ายไฟล์)

## ภาพตั้งต้น
- `hippo_<n>_<ทิศ>.png` 900×900 สี่เหลี่ยม แบบบาสเต็ด · ตัวสูง 520 (58 % ของกรอบ) เท้าที่ 90 % → เหนือหัวว่าง 0.52–0.56 เท่าตัวไว้ชูกระบอง ข้างละ 0.38–0.50 เท่าตัวไว้เหวี่ยง → ในคลิป 480p ตัวสูง ~280 px (แกะ 240 · บาสเต็ด 290)
```
V=assets/heroes/hippo; python3 -I tools/dir8cut.py startv <โฟลเดอร์> S=$V/view_S.webp SE=$V/view_SE.webp E=$V/view_E.webp NE=$V/view_NE.webp N=$V/view_N.webp size=900 feet=.9 ht=520 clean=0
```
→ start_<ทิศ>.png → ตั้งชื่อใหม่ hippo_1_S … hippo_5_N · ทุกทิศใช้สเกลของมุมหน้า (ภาพ 5 มุมวาดตัวสูงต่างกันแค่ ≤ 3 % ใช้ได้เลย) · clean=0 = ไม่ทาจุดเขียวในตัว (ชุดไม่มีสีเขียว เขียวอมฟ้าบนชีต ≈ RGB 50,154,156 น้ำเงิน ≥ เขียว ไม่โดนตัด ช่องว่างระหว่างแขนกับตัวเป็นพื้นหลังจริง)

## วิธีใช้
แนบภาพตั้งต้นของทิศนั้น + วางพรอมต์ทีละตัว → 4 คลิปต่อทิศ (ยืน · เดิน · ตี · ชูกระบอง) · คลิปละ 3–5 วิ · ไม่ต้องทำทิศซ้าย (เกมกลับด้านเอง) · ส่งกลับเรียง S → SE → E → NE → N ทิศละ ยืน → เดิน → ตี → ชูกระบอง (สลับได้ ดูเองว่าคลิปไหนเป็นท่าอะไร)

## กติกาที่อยู่ในทุกพรอมต์ (บทเรียนจากคลิปลิง / แอคโซลอเติล / มังกร / แกะ)
- ประโยคบอกทิศขึ้นต้นทุกพรอมต์ กันโมเดลหมุนตัวหันหากล้อง (มุมหลังโดนบ่อย)
- ล็อกหน้า (ตาน้ำตาลโต แก้มแดง เขี้ยวมนสองซี่ ยิ้มมั่นใจ ปากปิด) ในมุมที่เห็นหน้า · มุมหลัง (NE, N) ใช้ประโยค 'เห็นแค่หลังหัว หน้าไม่หันมา' แทน และไม่มีกะพริบตา
- ล็อกของติดตัว: คาดผมจานสุริยะ + เขาครีม · ผ้าคลุม + เข็มกลัดทองพู่สองพู่ (มุมหลัง: ผ้าคลุมหางจระเข้หนามครีม) · โล่กลม · กระบองหัวปุ่ม
- เดินอยู่กับที่แบบลู่วิ่ง ก้าวสั้นป้อมเด้งๆ ต้วมเตี้ยม ~2 ก้าว/วิ ตัวโยกซ้ายขวานิดๆ พุงเด้งทุกก้าว (คลิปเดินช้าจะไถลพื้น)
- ตี = ท่าเดียวกันทุกทิศ: ง้างกระบองข้ามไหล่ แล้วทุบเฉียงลงหน้าตัวหัวกระบองนำ ค้างจังหวะโดนนิดนึง พุงเด้งตามแรง แล้วยืนนิ่งจนจบคลิป · โล่อยู่แขนอีกข้างตลอด · มุมหลังสั่งให้กระบองยังเห็นข้างตัวตลอด (ไม่งั้นโดนตัวบัง)
- ชูกระบอง = ชูกระบองเหนือหัว ยกโล่ขึ้นข้างๆ อกพุงยื่นภูมิใจ ค้างนิ่ง ~1 วิ แล้วกลับท่าเดิม — เกมค้างเฟรมนี้ตอนย่อตัว + ลอยกลางอากาศของท่ากระโดดทับ แล้วต่อด้วยท่าตีตอนลงพื้น = 'กระโดดชูกระบอง ลงมาทุบ'
- ห้ามเบลอ · ห้ามแสง ประกาย ฝุ่น น้ำ วงเวท (เอฟเฟกต์ใส่ด้วยโค้ดในเกม) · กล้องนิ่งไม่ซูม · พื้นเขียวตลอด · ตัว + กระบอง + โล่อยู่ในกรอบตลอด
- ไม่ระบุมือซ้าย / ขวาในพรอมต์คลิป (ภาพตั้งต้นบอกเองว่าอะไรอยู่มือไหน และมุมที่กลับด้านมาอาวุธจะสลับมือ)""",
  footer="""## สร้างแล้ว 2026-11-24 18:12 (โน้ตสำหรับแชตที่ทำต่อ)
- คลิปที่ได้: 480×480 24 fps พื้นเขียว 5.2 วิ (124 เฟรม) ทุกอัน · อัปโหลด 1000001224–1229 + 1235–1248 เรียง ร่าย · ตี · เดิน · ยืน ต่อทิศ SE → S → E → NE → N · หันขวาทุกคลิป สเกลเดียวกัน (ตัวสูงเฟรมแรก 275–283 px เท้าที่ y 431 ทุกคลิป) กล้องไม่ซูม
- `assets_hippo.js` (prefix HIP เดิม, 6.62 MB, ?v=3) สร้างด้วย `python3 -I tools/cliphero.py tools/clips/hippo_plan.json assets_hippo.js HIP` แล้วรัน `tools/sheet_state.py tools/clips/hippo_jump.json` + `hippo_gulp.json` ซ้ำ (ท่ากระโดดทับ / ท่าดูดกลับเข้า atlas ใหม่ สเกล .2 เดิมพอดี เพราะตัวยืนสูง 231 เท่าของเดิม 230) — **สร้าง atlas ใหม่เมื่อไหร่ต้องรัน 2 สเปกนี้ซ้ำทุกครั้ง**
- เวลาเฟรมตี / ชูกระบองเท่าสไปรต์ชั่วคราวเดิม: attack [60×8, 70, 80, 90, 100] contact 8 · buff 12 × 80 peak 7 → `tools/fxlab.py hits hippo` 12 สกิลเท่าเดิมหมด (Belly Flop ขยับ 1 เฟรมระหว่างรอบ = ตีพลาด / จังหวะชน ไม่เกี่ยวกับสไปรต์) · herosweep / lostev / combo / leak ไม่มี error
- เลือกเฟรม (เลขเฟรมนับจาก 0 ในแผน `tools/clips/hippo_plan.json` _note มีรายละเอียดครบ): ตี = ยืน → ง้างกระบอง → เฟรม 7 ง้างสุด / เริ่มเหวี่ยง → เฟรม 8 (จังหวะโดน) = เฟรมแรกที่กระบองกระแทกพื้นแบบสะอาด → ค้าง → ลุกกลับ · ข้ามเอฟเฟกต์ที่โมเดลแอบใส่: S โค้งแสง + วงขาวที่พื้น, SE โค้งขาวฟ้า, E โค้งส้ม + ฝุ่นขาว, NE โดมใส + ประกายเหลือง, N น้ำกระเซ็นฟ้าขาว (S / E ใช้ท่าง้างค้างเป็นเฟรม 7 เพราะเฟรมเหวี่ยงเป็นรอยเบลอทั้งหมด) · ชูกระบอง = ยืน → ย่อนิดๆ → ยก → เฟรม 7 = กระบองเหนือหัว + โล่ยก (ท่าที่ hSlam ค้างตอนย่อตัวก่อนกระโดด) → ค้าง → ลดลง → ยืน · NE ช่วงยกมีแสงระเบิดสีทองบัง (เฟรม 1–21) → ใช้ช่วงลดกระบอง 51–56 เล่นกลับหลังเป็นช่วงยก
- ยืน = ลูปพัก → หายใจ → พัก (S 4+63 · SE 2+64 · E 28+48 · NE 37+50 เลี่ยงเครื่องหมาย '!' สีเหลืองเฟรม 3–15 · N 26+49 → รอบละ 2.0–2.7 วิ) · เดิน = รอบละ 24 เฟรม (1 วิ, 2 ก้าว/วิ) S 22 เฟรม
- ใครใช้เฟรมไหน (char_hippo.js): ตีปกติ = attack ตั้งแต่ contact−3 · hSlam (Belly Flop, Bounce Slam, Sky Belly, Double Drop, Mountain Drop, Meteor Belly, ตัวจบคอมโบ) = ค้าง buff peak ตอนย่อ → ท่า 'jump' ตอนลอย → attack ตั้งแต่ contact ตอนลงพื้น · Chomp = attack 7–9 ซ้ำ · Gulp / Gobble Up = ท่า 'gulp' · hBurst + สกิลสาย B = buff · Waddle Rush = walk ×3 · Rolling Hippo / Submerge = ค้าง hurt เฟรม 2 (cliphero ทำ hurt จากเฟรมแรกของ idle)
- CHAR_SCALE.hippo 1.39 เท่าเดิม (ตัวยืนสูงเท่าเดิม) · หน้า HUD `face.webp` + ภาพหน้าเลือกตัว `select.webp` ตัดจากภาพยืน 5 มุมไว้แล้ว ใช้ต่อได้
- ยังเป็นลุคเก่า: ไอคอนสกิล 49 + สกิลเสริม 16, พื้นหลังทรี 4 ภาพ · ยังไม่มี: ท่านั่ง (hero_sit.js) · ภาพหน้าเลือกตัวแบบท่ามีชีวิตชีวา (พรอมต์อยู่ใน `HIPPO_LOOK_PROMPTS_TH.md`)"""),
 'jaguar': dict(
  title='เสือจากัวร์ ลุคใหม่ (นางระบำสุริยคราส · Eclipse Dancer)',
  who='the little jaguar dancer girl in this picture', P='She', p='she', pos='her', weapon='daggers',
  face="Keep her face exactly as in the picture: the same big golden-amber eyes, both open, the same small cat nose and "
       "the same sweet, confident smile, mouth closed.",
  back_face={'NE': "We see her mostly from behind: the back of her head with the high ponytail, one round ear, the sun-disc "
                   "ornament and only the edge of her cheek, as in the picture; her face never turns toward us.",
             'N': "We only see the back of her head: her long dark-chocolate hair falling down her back and the backs of "
                  "her two round spotted ears, as in the picture; her face never turns toward us."},
  keep={d: ("The gold sun-disc ornament on the side of her head with its little fan of scarlet and turquoise feathers and its "
            "gold bell pendant, her gold hoop earrings, the gold collar with its turquoise gem, the black crop top, the "
            "crimson-and-cream skirt with gold borders, the curved black obsidian daggers with gold crescent guards and her "
            "long spotted tail stay exactly the same.") for d in ('S', 'SE', 'E')}
       | {d: ("The gold sun-disc ornament with its feathers, her long dark-chocolate ponytail, the crimson-and-cream skirt "
              "with gold borders, the curved black obsidian daggers with gold crescent guards and her long spotted tail "
              "stay exactly the same.") for d in ('NE', 'N')},
  spos=dict.fromkeys(DIRS, 'low at her sides'),
  blink=", her round ears twitch once, and she blinks once",
  vis=" Both daggers stay visible beside her body during the whole move.",
  fmt={'chin': (', lifting her chin proudly', '')},
  inframe="her whole body, both daggers, all of her long hair and her tail stay inside the frame.",
  nofx="No shadow, no flash, no glow, no sparkles, no particles, no smoke, no light trails, no streaks of colour, no magic "
       "effects, no text.",
  act={
   'idle': "Idle loop of {who}. {facing} She stands light on her feet like a dancer, one obsidian dagger in each hand held "
           "{spos}, and breathes slowly; her long ponytail, the feathers of her headpiece, her skirt and the crimson sash "
           "sway a little and her tail swishes slowly from side to side{blink}. The last frame matches the first frame so "
           "the clip loops.",
   'walk': "Walk loop of {who}. {facing} She walks in place, like on a treadmill, toward the way she is facing: light, "
           "graceful dancer's steps on the balls of her feet (about two steps per second) with a small sway of her hips, the "
           "daggers held {spos} swinging a little with her arms, her ponytail and skirt bouncing and her tail swaying "
           "behind her. She does not move across the frame and the ground does not move. The last frame matches the first "
           "frame so the clip loops.",
   'attack': "Quick double-dagger swing of {who}. {facing} She lifts both daggers up above her head in a short wind-up, then "
             "swings both arms quickly down and forward toward the way she is facing until both arms reach straight out in "
             "front of her, the two daggers pointing ahead; she holds that pose for a moment, then lowers her arms, returns "
             "to her starting pose and stands still for the rest of the clip. The whole move takes about one second. Her feet "
             "stay in place.{vis} The daggers are plain black stone, and the air around them stays empty and plain green in "
             "every frame. Clean outlines in every frame, no motion blur.",
   'buff': "Spell cast of {who}. {facing} She raises one dagger high above her head, the blade pointing to the sky, and "
           "holds the other dagger low behind her{chin}; she holds that pose still for about one second, then lowers the "
           "raised dagger back down to her side, returns to her starting pose and stands still for the rest of the clip. Her feet "
           "stay in place. The raised dagger stays inside the frame. Clean outlines in every frame, no motion blur."},
  dirname={'S': 'หน้าตรง', 'SE': 'เฉียงหน้า หันขวา', 'E': 'ข้าง หันขวา', 'NE': 'เฉียงหลัง หันขวา', 'N': 'หลัง'},
  actname={'idle': 'ยืน (idle · วนลูป)', 'walk': 'เดิน (walk · วนลูป · Blood Chase ก็ใช้คลิปนี้)',
           'attack': 'ฟันมีดคู่ (attack · ตีปกติ + สกิลฟันมีดทั้งสาย A และ B + Jaguar Cyclone + จังหวะลงฟันของ Predator Drop)',
           'buff': 'ชูมีด (buff · บัฟ / เวท / อัลติ / ปัดป้อง + ตอนลอยของ Predator Drop — เกมค้างเฟรมชูมีดตอนร่ายยาว)'},
  start='jaguar_{n}_{d}.png',
  header="""เจ้าของเลือกแบบ 1 'นางระบำสุริยคราส' 2026-11-24 14:28 ("ชอบแบบนี้") · ชีต `assets/heroes/jaguar/sheet_eclipse_dancer.webp` · หน้าตา + พรอมต์ภาพยืน 5 มุม: `JAGUAR_LOOK_PROMPTS_TH.md` หัวข้อ 'เลือกแล้ว'

## ลำดับงาน
1. **ภาพยืน 5 มุม** ✓ มาแล้ว 2026-11-24 15:41 (เจ้าของส่ง 5 ภาพ 1254² พื้นเขียว หันขวาทุกภาพ มีดครบสองเล่ม ลืมตา ปากปิด ไม่มีตัวอักษร) → `assets/heroes/jaguar/view_S|SE|E|NE|N.webp`
2. **ภาพตั้งต้น** ✓ ส่งแล้ว 2026-11-24 — ตัดจากภาพ 5 มุม (คำสั่งข้างล่าง) เป็น `jaguar_1_S.png … jaguar_5_N.png` (ไม่เก็บในรีโป สร้างใหม่ได้ทุกเมื่อ)
3. **คลิป 20 ตัว** — พรอมต์ในไฟล์นี้ แนบภาพตั้งต้นของทิศนั้นทุกคลิป

## ภาพตั้งต้น
- `jaguar_<n>_<ทิศ>.png` 900×900 สี่เหลี่ยม แบบฮิปโป / บาสเต็ด · ตัวสูง ~520 (58 % ของกรอบ วัดจากยอดหางม้าถึงเท้า) เท้าที่ 90 % → เหนือหัวว่าง ~0.55 เท่าตัวไว้ชูมีด ข้างละ ~0.5 เท่าตัวไว้เหวี่ยงมีด → ในคลิป 480p ตัวสูง ~280 px · ผมเธอฟูยาว: ถ้ามุมข้างผมล้นกรอบให้ลด ht
```
V=assets/heroes/jaguar; python3 -I tools/dir8cut.py startv <โฟลเดอร์> S=$V/view_S.webp SE=$V/view_SE.webp E=$V/view_E.webp NE=$V/view_NE.webp N=$V/view_N.webp size=900 feet=.9 ht=520 clean=0
```
→ start_<ทิศ>.png → ตั้งชื่อใหม่ jaguar_1_S … jaguar_5_N · ทุกทิศใช้สเกลของมุมหน้า · clean=0 = ไม่ทาจุดเขียวในตัว (ช่องระหว่างแขน มีด ผม เป็นพื้นหลังจริง)
- ที่ตัดจริง (สเกล .438 ของภาพ 1254²): ตัวสูง 519–533 px · เหนือหัว (ยอดหางม้า) ว่าง .52–.56 เท่าตัว · ซ้าย / ขวา .47–.56 · ในคลิป 480p ~277–284 px · ผม หาง มีดสองเล่ม อยู่ในกรอบครบทุกทิศ
- สีเทอร์ควอยซ์บนชีต ≈ RGB 56,180,174 = เขียวเกินน้ำเงินนิดหน่อย (ฮิปโป 50,154,156 น้ำเงิน ≥ เขียว) → พรอมต์ภาพยืนสั่ง 'ฟ้าเทอร์ควอยซ์ น้ำเงินมากกว่าเขียวนิดๆ' · คีย์ของ cliphero ทนเขียวเกินได้ ~18 แล้ว despill ดันกลับเป็นฟ้า · ภาพยืนที่ได้: เทอร์ควอยซ์เฉลี่ย ≈ 20,193,195 (น้ำเงิน ≥ เขียว ผ่าน) · จุดในตัวที่คีย์จะทำให้โปร่ง 100–345 px จาก ~85–106k px ต่อภาพ (< 0.4 % ปลายขนนก / ขอบพลอย) → ไม่ต้องแก้ · ถ้าคลิปออกมาเขียวกว่านี้ (ขนนก พลอย ลูกปัด กำไล) ดูตอนตัด

## วิธีใช้
แนบภาพตั้งต้นของทิศนั้น + วางพรอมต์ทีละตัว → 4 คลิปต่อทิศ (ยืน · เดิน · ฟันมีดคู่ · ชูมีด) · คลิปละ 3–5 วิ · ไม่ต้องทำทิศซ้าย (เกมกลับด้านเอง) · ส่งกลับเรียง S → SE → E → NE → N ทิศละ ยืน → เดิน → ฟันมีดคู่ → ชูมีด (สลับได้ ดูเองว่าคลิปไหนเป็นท่าอะไร)

## กติกาที่อยู่ในทุกพรอมต์ (บทเรียนจากคลิปลิง / แอคโซลอเติล / มังกร / แกะ)
- ประโยคบอกทิศขึ้นต้นทุกพรอมต์ กันโมเดลหมุนตัวหันหากล้อง (มุมหลังโดนบ่อย)
- ล็อกหน้า (ตาทองอำพันโต ลืมทั้งสองข้าง จมูกแมว ยิ้มหวานมั่นใจ ปากปิด — บนชีตภาพใหญ่ขยิบตาอ้าปาก ห้ามติดมา) ในมุมที่เห็นหน้า · มุมหลัง (NE, N) ใช้ประโยค 'เห็นแค่หลังหัว หน้าไม่หันมา' แทน ไม่มีกะพริบตา ไม่มีเชิดคาง
- ล็อกของติดตัว: จานสุริยะทอง + พัดขนนกแดง / ฟ้า + กระดิ่งทอง · ต่างหูห่วงทอง · สร้อยคอทองพลอยเทอร์ควอยซ์ · เสื้อดำ · กระโปรงแดง–ครีมขอบทอง · มีดออบซิเดียนการ์ดเสี้ยวจันทร์ทอง · หางลายจุด
- เดินอยู่กับที่แบบลู่วิ่ง ก้าวเบาแบบนักเต้น ~2 ก้าว/วิ สะโพกส่ายนิดๆ (คลิปเดินช้าจะไถลพื้น)
- ฟันมีดคู่ = ท่าเดียวกันทุกทิศ: ยกมีดสองเล่มขึ้นเหนือหัว แล้วเหวี่ยงลงมาข้างหน้าจนแขนสองข้างเหยียดตรง มีดชี้ไปข้างหน้า ค้างนิดนึง แล้วยืนนิ่งจนจบคลิป · มุมหลังสั่งให้มีดยังเห็นข้างตัว (ไม่งั้นโดนตัวบัง)
- 2026-11-24 19:41 คลิปแรกที่ได้ (ตี SE) ทำจากพรอมต์เดิม 'Attack … slashes … in a fast X' → โมเดลวาดรอยโค้งแดง + แสงขาว + กากบาท X ใหญ่ทับตัวทั้งที่สั่งห้าม (คำว่า Attack / slash / X น่าจะดึงเอฟเฟกต์มา) → พรอมต์ตีใหม่ไม่มีคำพวกนี้ บอกแค่การเคลื่อนไหว ซึ่งเป็นท่าเดียวกับที่โมเดลทำในคลิป SE (ยกมีดเหนือหัว → เหวี่ยงไปข้างหน้า) · คลิป SE เดิมใช้ได้ ไม่ต้องทำใหม่ · ถ้าคลิปใหม่ยังมีเอฟเฟกต์ติดมาก็ส่งมาได้เลย เลือกเฟรมเลี่ยงเอาได้
- ชูมีด = ชูมีดเล่มหนึ่งเหนือหัว ใบชี้ฟ้า อีกเล่มลดต่ำไว้ข้างหลัง (มุมหน้าเชิดคางนิดๆ) ค้างนิ่ง ~1 วิ แล้วกลับท่าเดิม — เกมค้างเฟรมนี้ตอนร่ายยาว และตอนลอยของ Predator Drop ก่อนลงฟัน · บนชีตท่าเวทยกมือเปล่า แต่ในคลิปมีดต้องอยู่ในมือทั้งสองเล่มตลอด จึงชูมีดแทน
- ห้ามเบลอ · ห้ามรอยฟันสีแดง / แสงที่ใบมีด / ดวงอาทิตย์ดำ / ควันม่วงแบบในชีต (เอฟเฟกต์ใส่ด้วยโค้ดในเกม) · กล้องนิ่งไม่ซูม · พื้นเขียวตลอด · ตัว + มีดสองเล่ม + ผม + หางอยู่ในกรอบตลอด
- ไม่ระบุมือซ้าย / ขวาในพรอมต์คลิป (ภาพตั้งต้นบอกเองว่าอะไรอยู่ฝั่งไหน)""",
  footer="""## ตอนคลิปมาถึง (โน้ตสำหรับแชตที่ทำต่อ)
- คลิปตี SE (เจ้าของส่ง 2026-11-24 19:41, `…1000001250.mp4`, 480² 24 fps 124 เฟรม, พรอมต์เดิม): ยืน 0–8 · กางแขน 9–13 · ยกมีดเหนือหัว 14–21 (มีดเล่มหลังลากรอยโค้งแดง: 15–18 ลบได้ด้วยตัวเลือก `unstreak` ของ cliphero, 19–21 รอยทับผม ห้ามใช้) · เหวี่ยง 22–24 + รอยโค้งแดงขาว 22–35 · แสงขาว + กากบาท 36–46 · ท่าจบมีดชี้หน้า 47–59 (47–51 มีจุดประกายเล็ก คีย์ลบเอง) · กลับ 60–67 · ยืน 68+ → แถว SE 12 เฟรม = 9, 12, 16u, 18u, **47** (contact), 52, 56, 60, 62, 64, 66, 69 (u = `"unstreak":{"attack/SE":[16,18]}`) ตรวจด้วยภาพแล้ว · ท่าจบไม่มีเฟรมเหวี่ยงกลางทาง (ทุกเฟรมเหวี่ยงโดนรอยแดงทับ) → กระโดดจากท่ายกมีดไปท่าจบตรงจังหวะโดน แล้วให้เอฟเฟกต์ฟันของเกมเล่นตรงนั้น
- ตัดด้วย `tools/cliphero.py` + แผนใหม่ `tools/clips/jaguar_plan.json` (ดู `tools/clips/sheep_plan.json` / `wukong_plan.json`: loop ช่วงที่ลืมตา, เลือกเฟรมเลี่ยงแสง / รอยฟันที่โมเดลแอบใส่, flipDirs ถ้ามีคลิปหันผิดฝั่ง, perDir ถ้าคลิปบางทิศถ่ายมาเล็ก / ใหญ่กว่า) → เขียนทับ `assets_jaguar.js` ด้วย prefix เดิม JAG (index.html สลับ atlas ด้วย JAG_ART อยู่แล้ว atkRemap {}) · แก้ขนาดไฟล์ในตาราง MB ของหน้าโหลด + ใส่ ?v= ให้ assets_jaguar.js
- **เวลาเฟรมต้องเท่า atlas เดิมทุกทิศ** (ลุคเดิมจากคลิป) → จังหวะโดน / ปล่อยสกิลเท่าเดิม bench ไม่เปลี่ยน · เช็ก `python3 tools/fxlab.py hits jaguar` ก่อน / หลัง:
  - attack 12 เฟรม 900 ms · N [110,120,50,50,70,50,120,70,50,50,50,110] contact 6 (โดนที่ 450 ms) · NE = E [80,50,50,100,50,120,60,120,50,50,50,120] contact 6 (450) · SE [50,50,190,70,90,50,50,50,50,50,90,110] contact 4 (360) · S [80,50,90,50,50,50,70,200,50,50,50,110] contact 6 (370)
  - buff · N 12 เฟรม [130,50,50,50,50,110,260,450,60,50,50,90] peak 7 (700 ms) · NE [80,60,50,50,50,50,120,160,480,60,60,180] peak 7 (460) · E [70,50,50,50,50,70,170,580,50,50,50,160] peak 7 (510) · SE **6 เฟรม** × 220 peak 3 (660) · S [170,50,50,230,50,110,390,50,50,50,50,150] peak 7 (1,050)
  - walk 8 × 100 (E [110,90,90,110,110,90,90,110]) · idle 12 เฟรม 2.4 วิ · hurt 7 เฟรม 550 ms
- sockets: atlas เดิมมีตำแหน่งมีดจริงทุกเฟรม (head / grip ของท่าตี + ร่าย) · cliphero ทำ socket สังเคราะห์ → ทำ socket ปลายมีดใหม่ (orbFix / orbLerp อ่านด้วยตา หรือหาใบมีดดำ) แล้วเช็กว่ารอยฟัน / ประกายของ char_jaguar_fx.js ยังอยู่ที่มีด
- วัด CHAR_SCALE.jaguar ใหม่ (ตอนนี้ .94 = คลิปลุคเดิม) ให้ยืนสูงเท่าหมาป่า
- หน้า HUD = ตัดหัวจาก view_S ผ่าน window.HUD_FACE (แบบแกะ / ลิง / ฮิปโป) · หน้าเลือกตัว = `assets/heroes/jaguar/select.webp` ใหม่จาก view_SE (`tools/select_cut.py`; ตอนนี้เป็นลุคเดิม) · ชื่อในหน้าเลือกตัวยังเป็น 'Black Jaguar' (char_create.js) — เจ้าของจะเปลี่ยนเป็น 'Eclipse Jaguar' หรือไม่ ยังไม่ได้ถาม
- ยังเป็นลุคเก่า: ไอคอนสกิล 53 + สกิลเสริม 10, พื้นหลังผังสกิล 4 ภาพ, ภาพเอฟเฟกต์ 36 ภาพ · ยังไม่มี: ท่านั่ง (hero_sit.js)"""),
 'dragon': dict(
  title='มังกรคราม ลุคใหม่ (ปรมาจารย์ฝ่ามือสายฟ้า · Thunder Palm Sage)',
  who='the blue dragon martial artist in this picture', P='He', p='he', pos='his', weapon='fists',
  face="Keep his face exactly as in the picture: the same glowing golden eyes under the same heavy brows, the same long "
       "snout and the same fierce, confident look, mouth closed with only the tips of his fangs showing.",
  back_face={'NE': "We see him mostly from behind: the back of his head with the huge silver-white mane, the backs of the two "
                   "gold horns and only the edge of his snout with one eye and one whisker, as in the picture; his face never "
                   "turns toward us.",
             'N': "We only see the back of his head: his huge silver-white mane falling down his back and the backs of the "
                  "two gold horns, as in the picture; his face never turns toward us."},
  keep={d: ("His two gold lightning-bolt horns, his two long white whiskers, his huge silver-white mane, the dark-indigo "
            "sleeveless vest with gold trim, the red rope belt with its round gold clasp and two red tassels, the gold "
            "studded knuckle guards on both fists and his long blue tail with the white tuft stay exactly the same.")
        for d in ('S', 'SE', 'E')}
       | {d: ("His two gold lightning-bolt horns, the silver-white mane, the back of the dark-indigo vest, the red rope belt, "
              "the gold knuckle guards on both fists and his long blue tail with the white tuft stay exactly the same.")
          for d in ('NE', 'N')},
  spos=dict.fromkeys(DIRS, 'loosely clenched at his sides'),
  blink=", and he blinks once",
  vis=" His punching arm stays visible beside his body during the whole punch.",
  fmt={'pvis': ('', " His open palm stays visible beside his body while he holds the pose.")},
  inframe="his whole body, both fists, his whole mane, both horns, both whiskers and his whole tail stay inside the frame.",
  nofx="No shadow, no flash, no glow, no sparkles, no particles, no smoke, no water, no lightning, no clouds, no spirit "
       "dragon, no speed lines, no magic effects, no text.",
  act={
   'idle': "Idle loop of {who}. {facing} He stands in a firm, ready martial-arts stance, both fists {spos}, and breathes "
           "slowly: his chest rises and falls, his long mane and his two whiskers drift gently and the red tassels and his "
           "tail sway slowly{blink}. The last frame matches the first frame so the clip loops.",
   'walk': "Walk loop of {who}. {facing} He walks in place, like on a treadmill, toward the way he is facing: firm, springy "
           "steps (about two steps per second) in his wooden geta sandals, both fists {spos} swinging a little with his "
           "arms, his mane and whiskers bouncing, the red tassels swinging and his tail swaying behind him. He does not move "
           "across the frame and the ground does not move. The last frame matches the first frame so the clip loops.",
   'attack': "Attack of {who}. {facing} He pulls one fist back to his side in a short, quick wind-up, then shoots a fast, "
             "straight punch forward toward the way he is facing, his arm fully extended with the gold knuckle guard "
             "leading, holds the punch for an instant, then pulls the fist back, returns to his starting pose and stands "
             "still for the rest of the clip. The whole punch takes less than one second. His feet stay in place.{vis} "
             "Clean outlines in every frame, no motion blur.",
   'buff': "Power move of {who}. {facing} He bends his knees a little and draws both hands back to one hip, gathering "
           "strength, then thrusts one open palm forward toward the way he is facing, fingers pointing up, with his other "
           "hand pulled back to his hip in a fist; he holds that palm-strike pose still for about one second, then returns "
           "to his starting pose and stands still for the rest of the clip. His feet stay in place.{pvis} Clean outlines in "
           "every frame, no motion blur."},
  dirname={'S': 'หน้าตรง', 'SE': 'เฉียงหน้า หันขวา', 'E': 'ข้าง หันขวา', 'NE': 'เฉียงหลัง หันขวา', 'N': 'หลัง'},
  actname={'idle': 'ยืน (idle · วนลูป)', 'walk': 'เดิน (walk · วนลูป · ท่าพุ่ง Horn Rush / Riptide Step / Cloud Step ก็ใช้คลิปนี้เร่ง ×3.2)',
           'attack': 'ต่อย (attack · ตีปกติ + สกิลหมัด / ฝ่ามือทุกท่า — เกมเล่นช่วงง้าง → ยืดสุดซ้ำเร็วๆ เป็นหมัดรัว)',
           'buff': 'ผลักฝ่ามือ (buff · Heaven Push / คำราม / ร่ายน้ำวน ลมหายใจมังกร / บัฟ / อัลติ — เกมค้างเฟรมผลักสุดตอนท่ายาว)'},
  start='dragon_{n}_{d}.png',
  header="""เจ้าของเลือกแบบ 3 'ปรมาจารย์ฝ่ามือสายฟ้า' 2026-11-24 16:51 ("อันนี้เท่ แต่ติดตรงผ้าลายเสือ") แล้วส่งชีต v2 ที่ไม่มีผ้าลายเสือมา 17:10 · ชีต `assets/heroes/dragon/sheet_thunder_palm.webp` · หน้าตา + พรอมต์ภาพยืน 5 มุม: `DRAGON_LOOK_PROMPTS_TH.md` หัวข้อ 'เลือกแล้ว'

## ลำดับงาน
1. **ภาพยืน 5 มุม** ✓ มาแล้ว 2026-11-24 17:28 (เจ้าของส่ง 5 ภาพ 1254² พื้นเขียว เรียง หลัง · เฉียงหลัง · หน้า · เฉียงหน้า · ข้าง ไม่มีข้อความ · หันขวาทุกภาพ กำหมัดข้างตัว ปากปิดเห็นปลายเขี้ยว ไม่มีเอฟเฟกต์ หางอยู่ซ้ายภาพทุกมุม) → `assets/heroes/dragon/view_S|SE|E|NE|N.webp`
2. **ภาพตั้งต้น** ✓ ส่งแล้ว 2026-11-24 — ตัดจากภาพ 5 มุม (คำสั่งข้างล่าง) เป็น `dragon_1_S.png … dragon_5_N.png` (ไม่เก็บในรีโป สร้างใหม่ได้ทุกเมื่อ)
3. **คลิป 20 ตัว** — พรอมต์ในไฟล์นี้ แนบภาพตั้งต้นของทิศนั้นทุกคลิป

## ภาพตั้งต้น
- `dragon_<n>_<ทิศ>.png` 900×900 สี่เหลี่ยม แบบฮิปโป / จากัวร์ · ตัวสูง ~520 (58 % ของกรอบ วัดจากปลายเขาถึงพื้นรองเท้า) เท้าที่ 90 % → ในคลิป 480p ตัวสูง ~280 px · เขาสูง แผงคอฟู หางยาว และหมัดต้องยื่นสุดแขนได้: ถ้ามุมข้าง (หางข้างหลัง + หมัดข้างหน้า) ชิดขอบ ให้ลด ht
```
V=assets/heroes/dragon; python3 -I tools/dir8cut.py startv <โฟลเดอร์> S=$V/view_S.webp SE=$V/view_SE.webp E=$V/view_E.webp NE=$V/view_NE.webp N=$V/view_N.webp size=900 feet=.9 ht=520 clean=0
```
→ start_<ทิศ>.png → ตั้งชื่อใหม่ dragon_1_S … dragon_5_N · ทุกทิศใช้สเกลของมุมหน้า · clean=0 = ไม่ทาจุดเขียวในตัว (ชุดไม่มีสีเขียวเลย ช่องระหว่างแขน หนวด แผงคอ เป็นพื้นหลังจริง) · น้ำเงินบนชีต ≈ RGB 59,81,183 ตัดพื้นเขียวได้สะอาด
- ที่ตัดจริง (สเกล .430 ของภาพ 1254², ภาพ 5 มุมสูงต่างกันแค่ ≤ 1.3 %): ตัวสูง 520–527 px · เหนือปลายเขาว่าง .54–.56 เท่าตัว · ซ้าย .46–.52 · ขวา .54–.58 (หมัดยื่นสุดแขนยังอยู่ในกรอบ) · ในคลิป 480p ~277–281 px · แผงคอ เขา หนวด หาง อยู่ในกรอบครบทุกทิศ
- เขียวในภาพยืน: แอ่งเขียวใหญ่ที่ถูกล้อม (ระหว่างหางกับขา ใต้แขน ในวงหนวด) = พื้นหลังจริง ~93 % เป็นสีพื้นเป๊ะ · จุดเขียวเข้มเล็กๆ 15–155 px ข้างวงหนวด = พื้นหลังที่มองผ่านช่องแคบ · ตัวมังกรไม่มีสีเขียวเลย → ไม่ต้องแก้

## วิธีใช้
แนบภาพตั้งต้นของทิศนั้น + วางพรอมต์ทีละตัว → 4 คลิปต่อทิศ (ยืน · เดิน · ต่อย · ผลักฝ่ามือ) · คลิปละ 3–5 วิ · ไม่ต้องทำทิศซ้าย (เกมกลับด้านเอง) · ส่งกลับเรียง S → SE → E → NE → N ทิศละ ยืน → เดิน → ต่อย → ผลักฝ่ามือ (สลับได้ ดูเองว่าคลิปไหนเป็นท่าอะไร)

## กติกาที่อยู่ในทุกพรอมต์ (บทเรียนจากคลิปลิง / แอคโซลอเติล / มังกรลุคเดิม / แกะ)
- ประโยคบอกทิศขึ้นต้นทุกพรอมต์ กันโมเดลหมุนตัวหันหากล้อง (มุมหลังโดนบ่อย)
- ล็อกหน้า (ตาทองเรือง คิ้วหนา ปากยาว สีหน้าดุมั่นใจ ปากปิดเห็นแค่ปลายเขี้ยว — บนชีตภาพใหญ่อ้าปากคำราม ห้ามติดมา) ในมุมที่เห็นหน้า · มุมหลัง (NE, N) ใช้ประโยค 'เห็นแค่หลังหัว หน้าไม่หันมา' แทน ไม่มีกะพริบตา
- ล็อกของติดตัว: เขาทองรูปสายฟ้า · หนวดขาวสองเส้น · แผงคอขาวเงิน · เสื้อกั๊กครามขอบทอง · เชือกแดงหัวเข็มขัดทอง + พู่แดงสองพู่ · สนับมือทองปุ่มกลม · หางน้ำเงินปลายพู่ขาว
- ไม่มีอาวุธ: กำหมัดหลวมๆ ข้างตัวทุกคลิป ยกเว้นตอนต่อย / ผลักฝ่ามือ
- เดินอยู่กับที่แบบลู่วิ่ง ก้าวหนักแน่นเด้งๆ ~2 ก้าว/วิ (คลิปเดินช้าจะไถลพื้น · คลิปเดิน S ของมังกรลุคเดิมกล้องซูมเข้า — ห้ามซูม)
- ต่อย = หมัดตรงเร็ว ท่าเดียวกันทุกทิศ: ง้างหมัดข้างเอว พุ่งหมัดตรงยืดสุดแขน สนับมือทองนำ ค้างนิดนึง ดึงกลับ ยืนนิ่งจนจบคลิป — เกมเอา 4 เฟรมรอบจังหวะยืดสุด (ง้าง → พุ่ง → ยืดสุด → เริ่มดึงกลับ) มาเล่นซ้ำเร็วๆ เป็นหมัดรัว ช่วงนี้ต้องคมชัดไม่เบลอ · มุมหลังสั่งให้แขนที่ต่อยยังเห็นข้างตัว (ไม่งั้นโดนแผงคอ / ตัวบัง)
- ผลักฝ่ามือ = ย่อเข่านิดๆ ดึงมือสองข้างมาข้างเอว แล้วผลักฝ่ามือเปิดไปข้างหน้า นิ้วชี้ขึ้น อีกมือกำไว้ข้างเอว ค้างนิ่ง ~1 วิ แล้วกลับท่าเดิม — เกมใช้ทั้งคลิปกับฝ่ามือผลัก คำราม ร่าย บัฟ อัลติ และค้างเฟรมผลักสุดตอนท่ายาว (Calm Breath)
- ห้ามเบลอ · ห้ามน้ำวน สายฟ้า เมฆ มังกรปราณ แบบในชีต (เอฟเฟกต์ใส่ด้วยโค้ดในเกม `dragon_vfx.js`) · กล้องนิ่งไม่ซูม · พื้นเขียวตลอด · ตัว + หมัด + แผงคอ + เขา + หนวด + หางอยู่ในกรอบตลอด
- ไม่ระบุมือซ้าย / ขวาในพรอมต์คลิป (ภาพตั้งต้นบอกเองว่าอะไรอยู่ฝั่งไหน)""",
  footer="""## ตอนคลิปมาถึง (โน้ตสำหรับแชตที่ทำต่อ)
- ตัดด้วย `tools/cliphero.py` + แผนใหม่ `tools/clips/dragon_plan.json` (ดู `tools/clips/sheep_plan.json` / `wukong_plan.json`: loop ช่วงที่ลืมตา, เลือกเฟรมเลี่ยงแสง / น้ำ / สายฟ้าที่โมเดลแอบใส่, flipDirs ถ้ามีคลิปหันผิดฝั่ง, perDir ถ้าคลิปบางทิศถ่ายมาเล็ก / ใหญ่กว่า) → เขียนทับ `assets_dragon.js` ด้วย prefix เดิม DRG (index.html สลับ atlas ด้วย DRG_ART อยู่แล้ว atkRemap {}) · แก้ขนาดไฟล์ในตาราง MB ของหน้าโหลด + ใส่ ?v= ให้ assets_dragon.js · atlas ลุคเดิมอยู่ในประวัติ git
- **เวลาเฟรมต้องเท่า atlas เดิมทุกทิศ** → จังหวะโดน / ปล่อยสกิลเท่าเดิม bench ไม่เปลี่ยน · เช็ก `python3 tools/fxlab.py hits dragon` ก่อน / หลัง:
  - attack 12 เฟรม · S = E = NE [55,40,40,40,75×8] contact 2 (โดนที่ 95 ms ยาว 775) · SE [55×4,40×3,75×5] contact 5 (260 ms ยาว 715) · N [55,55,40,40,40,75×7] contact 3 (150 ms ยาว 755) → เฟรม contact = หมัดยืดสุด, ก่อนหน้า = ง้าง / กำลังพุ่ง, หลังจากนั้น = ค้าง + ดึงกลับ + ยืน
  - buff 12 × 70 ms · peak S 2 (140 ms) · SE 3 (210) · E 6 (420) · NE 5 (350) · N 5 (350) → เฟรม peak = ผลักฝ่ามือสุด, ก่อนหน้า = ดึงมือมาข้างเอว, หลังจากนั้น = ค้างท่า + กลับท่าเดิม
  - walk 8 เฟรม · S 125 · SE 135 · E 151 · NE 151 · N 146 ms ต่อเฟรม (รอบละ 1.0–1.2 วิ) · idle 12 เฟรม · S 94 · SE 167 · E 177 · NE 90 · N 132 ms · hurt 7 × 70
- ใครใช้เฟรมไหน (char_dragon.js): dPunches = ตีปกติ (Azure Fist / Dragon Chain / Dragon Tail Sweep) + Tide Jab, Hundred Waves, Whirlpool Hook, Tsunami Uppercut, Wind Palm, Thunder Seal Palm, Twin Dragon Palms, Abyssal Torrent → หมัดกลางคอมโบเล่นเฟรม contact−2 … contact+1 เร็ว ×3.2 หมัดสุดท้ายเล่นจาก contact−3 (หรือเฟรมแรก) ถึงจบ · Great Azure Torrent ค้างเฟรม contact · Komainu Guard + Ebb and Flow ค้าง buff เฟรม 2 · Calm Breath ค้าง buff peak · dBurst / buffAct (Lion's Roar, Heaven Push, Mirror Pond, Maelstrom, Dragon's Breath, Shishi Awakening, Storm Sovereign, Azure Dragon Descends) = buff ทั้งคลิป · dDash (Horn Rush, Riptide Step, Cloud Step) = walk ×3.2
- เอฟเฟกต์ไม่อ่าน socket: หมัดน้ำ / ฝ่ามือใน `dragon_vfx.js` ออกจาก hand() = 17 px หน้าตัว สูง z 38 คงที่ → ถ้าแขนตัวใหม่ยาว / ตัวสูงต่างจากเดิม ปรับ hand() ให้ตรงหมัดจริง (ดูช็อตตอนต่อย 5 ทิศ) · atlas เดิมมี socket ท่าตีแบบสังเคราะห์ (cliphero ทำให้เหมือนเดิม)
- วัด CHAR_SCALE.dragon ใหม่ (ตอนนี้ 1.64 = คลิปลุคเดิม) ให้ยืนสูงเท่าหมาป่า
- หน้า HUD = ตัดหัวจาก view_S ผ่าน window.HUD_FACE (แบบแกะ / ลิง / ฮิปโป — มังกรยังไม่มีเลย ใช้หน้า default) · หน้าเลือกตัว = `assets/heroes/dragon/select.webp` ใหม่ (`tools/select_cut.py`; ตอนนี้เป็นลุคเดิม) · คำโปรยหน้าเลือกตัว 'นักมวยมังกรสิงโต' (char_create.js) — ลุคใหม่ไม่มีสิงโตแล้ว เปลี่ยนเป็น 'นักมวยมังกร' ได้ถ้าเจ้าของโอเค
- ยังเป็นลุคเก่า: ไอคอนสกิล 56, พื้นหลังผังสกิล 4 ภาพ, ภาพเอฟเฟกต์วาด 26 ภาพ (ใช้แค่ ?vfx3=0) · ยังไม่มี: ท่านั่ง (hero_sit.js)"""),
 'wolf': dict(
  title="หมาป่าขาว ลุคใหม่ (ทายาทเฟนรีร์ · Fenrir's Heir)",
  who='the white wolf warrior in this picture', P='He', p='he', pos='his', weapon='greataxe',
  face="Keep his face exactly as in the picture: the same bright ice-blue eyes under the same strong brows, the same red "
       "scar over one brow, the same muzzle and the same calm, confident look, mouth closed.",
  back_face={'NE': "We see him mostly from behind: the back of his head with both pointed ears, the crimson cape with its "
                   "white fur edge and only the edge of his muzzle, as in the picture; his face never turns toward us.",
             'N': "We only see the back of his head with both pointed ears and the crimson cape with its white fur edge "
                  "across his back, as in the picture; his face never turns toward us."},
  keep={d: ("His crimson fur-lined cape with the cream fur collar, the dark-steel wolf-head pauldron, the deep-navy tunic "
            "with the silver knotwork band, the round silver belt buckle, the steel cuff with the broken chain, the leather "
            "bracers, the fur-cuffed boots, his huge bushy white tail and the greataxe with its silver blade carved with a "
            "wolf head stay exactly the same.") for d in ('S', 'SE', 'E')}
       | {d: ("His crimson cape with the white fur edge, the dark-steel wolf-head pauldron, the back of the navy tunic and "
              "the belt, the broken chain, the fur-cuffed boots, his huge bushy white tail and the greataxe with its silver "
              "blade stay exactly the same.") for d in ('NE', 'N')},
  spos=dict.fromkeys(DIRS, 'upright in his hand beside him, its end resting on the ground'),
  blink=", his ears twitch once, and he blinks once",
  vis=" His swinging arm and the whole axe stay visible beside his body during the whole swing.",
  fmt={'pvis': ('', " The raised axe stays visible above his head while he holds the pose."),
       'chin': (', lifting his chin proudly', '')},
  inframe="his whole body, the whole greataxe, both ears and his whole tail stay inside the frame.",
  nofx="No shadow, no flash, no glow, no sparkles, no particles, no smoke, no light trails, no streaks of colour, no red "
       "energy, no ice, no lightning, no runes in the air, no magic effects, no text.",
  act={
   'idle': "Idle loop of {who}. {facing} He stands tall in a firm, ready stance, the greataxe {spos}, his other fist "
           "clenched at his side with the broken chain hanging from its cuff, and breathes slowly: his chest rises and "
           "falls, the fur of his collar stirs, the broken chain and the cape sway a little and his big bushy tail sways "
           "slowly{blink}. The last frame matches the first frame so the clip loops.",
   'walk': "Walk loop of {who}. {facing} He walks in place, like on a treadmill, toward the way he is facing: firm, springy "
           "steps (about two steps per second) in his fur-cuffed boots, the greataxe carried upright in his hand beside "
           "him with its end just above the ground, his other arm swinging a little with the broken chain, his cape and "
           "his bushy tail bouncing behind him. He does not move across the frame and the ground does not move. The last "
           "frame matches the first frame so the clip loops.",
   'attack': "Overhead axe chop of {who}. {facing} He lifts the greataxe up and back over his shoulder in a short wind-up, "
             "then swings it down and forward toward the way he is facing in one powerful chop until the axe head is low "
             "in front of him; he holds that pose for a moment, then lifts the axe back up, returns to his starting pose "
             "and stands still for the rest of the clip. The whole move takes about one second. His feet stay in "
             "place.{vis} The axe stays exactly as drawn, and the air around it stays empty and plain green in every "
             "frame. Clean outlines in every frame, no motion blur.",
   'buff': "Battle pose of {who}. {facing} He grips the greataxe with both hands and raises it high above his head, holding "
           "the haft level like a bar with the blade at one end, his chest out{chin}; he holds that pose still for about "
           "one second, then lowers the axe back down to his side, returns to his starting pose and stands still for the "
           "rest of the clip. His feet stay in place.{pvis} The raised axe stays inside the frame. Clean outlines in "
           "every frame, no motion blur."},
  dirname={'S': 'หน้าตรง', 'SE': 'เฉียงหน้า หันขวา', 'E': 'ข้าง หันขวา', 'NE': 'เฉียงหลัง หันขวา', 'N': 'หลัง'},
  actname={'idle': 'ยืน (idle · วนลูป)', 'walk': 'เดิน (walk · วนลูป)',
           'attack': 'ฟันขวาน (attack · ตีปกติ + สกิลฟันขวานทุกท่า — เอฟเฟกต์ฟันวิ่งตามหัวขวานทุกเฟรม)',
           'buff': 'ชูขวาน (buff · บัฟ หอน ร่ายรูน พายุ อัลติ — เกมปล่อยสกิลที่เฟรมชูสุด)'},
  start='wolf_{n}_{d}.png',
  header="""เจ้าของเลือกแบบ 1 'ทายาทเฟนรีร์' 2026-11-24 20:28 ("เอาอันนี้ เก็บภาพซ้ายไว้ด้วย จะเอาไปทำภาพในหน้าเลือกตัวละคร") · ชีต `assets/heroes/wolf/sheet_fenrir_heir.webp` · ภาพใหญ่ = หน้าเลือกตัวแล้ว · หน้าตา + พรอมต์ภาพยืน 5 มุม: `WOLF_LOOK_PROMPTS_TH.md` หัวข้อ 'เลือกแล้ว'

## ลำดับงาน
1. **ภาพยืน 5 มุม** — เจนจากพรอมต์ใน `WOLF_LOOK_PROMPTS_TH.md` ขั้น 1 → เก็บเป็น `assets/heroes/wolf/view_S|SE|E|NE|N.webp`
2. **ภาพตั้งต้น** — ตัดจากภาพ 5 มุม (คำสั่งข้างล่าง) เป็น `wolf_1_S.png … wolf_5_N.png` (ไม่เก็บในรีโป สร้างใหม่ได้ทุกเมื่อ)
3. **คลิป 20 ตัว** — พรอมต์ในไฟล์นี้ แนบภาพตั้งต้นของทิศนั้นทุกคลิป

## ภาพตั้งต้น
- `wolf_<n>_<ทิศ>.png` 900×900 สี่เหลี่ยม แบบฮิปโป / จากัวร์ / มังกร · ขวานยาวเกือบเท่าตัว: ยกข้ามไหล่ตอนง้าง + ยื่นไปข้างหน้าตอนฟัน + ชูเหนือหัวตอนบัฟ → ต้องมีที่ว่างเหนือหัวและสองข้างมากกว่าตัวอื่น · เริ่มที่ ht ~480 (ในคลิป 480p ตัวสูง ~255 px) แล้วดูว่าที่ว่างพอไหม
```
V=assets/heroes/wolf; python3 -I tools/dir8cut.py startv <โฟลเดอร์> S=$V/view_S.webp SE=$V/view_SE.webp E=$V/view_E.webp NE=$V/view_NE.webp N=$V/view_N.webp size=900 feet=.9 ht=480 clean=0
```
→ start_<ทิศ>.png → ตั้งชื่อใหม่ wolf_1_S … wolf_5_N · ทุกทิศใช้สเกลของมุมหน้า · clean=0 = ไม่ทาจุดเขียวในตัว (ชุดไม่มีสีเขียวเลย นับบนชีตแล้ว 0 จุด · ช่องระหว่างด้ามขวาน แขน หาง เป็นพื้นหลังจริง)

## วิธีใช้
แนบภาพตั้งต้นของทิศนั้น + วางพรอมต์ทีละตัว → 4 คลิปต่อทิศ (ยืน · เดิน · ฟันขวาน · ชูขวาน) · คลิปละ 3–5 วิ · ไม่ต้องทำทิศซ้าย (เกมกลับด้านเอง) · ส่งกลับเรียง S → SE → E → NE → N ทิศละ ยืน → เดิน → ฟัน → ชู (สลับได้ ดูเองว่าคลิปไหนเป็นท่าอะไร)

## กติกาที่อยู่ในทุกพรอมต์ (บทเรียนจากคลิปลิง / แอคโซลอเติล / มังกรลุคเดิม / แกะ / บาสเต็ด / ฮิปโป / จากัวร์)
- ประโยคบอกทิศขึ้นต้นทุกพรอมต์ กันโมเดลหมุนตัวหันหากล้อง (มุมหลังโดนบ่อย)
- ล็อกหน้า (ตาฟ้า คิ้วเข้ม แผลเป็นแดง ปากปิด สีหน้ามั่นใจ — บนชีตภาพใหญ่ยิ้มอ้าปาก ห้ามติดมา) ในมุมที่เห็นหน้า · มุมหลัง (NE, N) ใช้ประโยค 'เห็นแค่หลังหัว หน้าไม่หันมา' แทน ไม่มีกะพริบตา
- ล็อกของติดตัว: ผ้าคลุมแดงบุขน ปลอกคอขนครีม · เกราะบ่าหัวหมาป่า · เสื้อกรมแถบลายปมเงิน · หัวเข็มขัดเงินกลม · กำไลโซ่ขาด · ปลอกแขนหนัง · บูทขอบขน · หางพวงขาว · ขวานใบเงินสลักหัวหมาป่า
- เดินอยู่กับที่แบบลู่วิ่ง ~2 ก้าว/วิ ถือขวานตั้งข้างตัว ปลายด้ามลอยเหนือพื้นนิดๆ
- ฟันขวาน = ยกขวานข้ามไหล่ แล้วฟันลงทแยงไปข้างหน้าจนหัวขวานต่ำอยู่หน้าตัว ค้างนิดนึง ยกกลับ ยืนนิ่งจนจบคลิป · **ไม่ใช้คำว่า attack / slash ในพรอมต์** (คลิปแรกของจากัวร์: โมเดลวาดรอยฟันสีแดง แสงขาว ตัว X ทับท่า) + สั่งให้อากาศรอบขวานเป็นพื้นเขียวเปล่าทุกเฟรม · มุมหลังสั่งให้แขนกับขวานยังเห็นข้างตัว
- ชูขวาน = จับขวานสองมือ ยกขึ้นเหนือหัว **ด้ามขนานพื้น** (ถ้าชี้ฟ้า ขวานยาวจะล้นกรอบ) ค้างนิ่ง ~1 วิ แล้ววางลงข้างตัว — เกมใช้ทั้งคลิปกับบัฟ หอน ร่ายรูน พายุ อัลติ
- ห้ามเบลอ · ห้ามแสงแดง น้ำแข็ง สายฟ้า รูนลอย แบบในชีต (เอฟเฟกต์ใส่ด้วยโค้ดในเกม `wolf_fx.js` / `wolf_vfx3.js`) · กล้องนิ่งไม่ซูม · พื้นเขียวตลอด · ตัว + ขวานทั้งเล่ม + หู + หางอยู่ในกรอบตลอด
- ไม่ระบุมือซ้าย / ขวาในพรอมต์คลิป (ภาพตั้งต้นบอกเองว่าขวาน / โซ่อยู่ฝั่งไหน)""",
  footer="""## ตอนคลิปมาถึง (โน้ตสำหรับแชตที่ทำต่อ)
- ตัดด้วย `tools/cliphero.py` + แผนใหม่ `tools/clips/wolf_plan.json` (ดู `hippo_plan.json` / `bastet_plan.json`: loop ช่วงที่ลืมตา, เลือกเฟรมเลี่ยงรอยฟัน / แสง / ฝุ่นที่โมเดลแอบใส่, flipDirs ถ้ามีคลิปหันผิดฝั่ง, perDir ถ้าคลิปบางทิศถ่ายมาเล็ก / ใหญ่กว่า, "unstreak" ลบรอยสีแดงไม่มีเส้นขอบ)
- **เขียนเป็นไฟล์ใหม่ `assets_wolf.js`** (prefix ใหม่ เช่น WLF + สลับเข้าใน index.html แบบ BST_ART / HIP_ART เฉพาะ `?char=wolf` + รายการ document.write + ตาราง MB ของหน้าโหลด) · **ห้ามเขียนทับ `assets.js`**: มันคือร่างชั่วคราวของจิ้งจอก อนูบิส สิงโต จระเข้ อีกา และ atlas ฐานที่ทุกตัวโหลด
- **เวลาเฟรมต้องเท่า `assets.js` ทุกทิศ** → จังหวะโดน / ปล่อยสกิลเท่าเดิม bench ไม่เปลี่ยน · เช็ก `python3 tools/fxlab.py hits wolf` ก่อน / หลัง:
  - attack 12 เฟรม 900 ms · S [80,50,90,50,50,50,70,200,50,50,50,110] contact 6 (โดนที่ 370 ms) · SE [50,50,190,70,90,50,50,50,50,50,90,110] contact 4 (360 ms) · E [80,50,50,100,50,120,60,120,50,50,50,120] contact 6 (450 ms) · N [110,120,50,50,70,50,120,70,50,50,50,110] contact 6 (450 ms) · NE: atlas เดิมให้เกมเล่นแถว E แทน (atkRemap NE→E) → คลิป NE ใหม่ใช้เวลาเฟรม + contact ของ E แล้วตั้ง atkRemap {} (แบบบาสเต็ด) · เฟรม contact = ใบขวานลงถึงจุดฟัน
  - buff 12 เฟรม 1.4 วิ peak 7 · S [170,50,50,230,50,110,390,50,50,50,50,150] (1,050 ms) · E [70,50,50,50,50,70,170,580,50,50,50,160] (510) · NE [80,60,50,50,50,50,120,160,480,60,60,180] (460) · N [130,50,50,50,50,110,260,450,60,50,50,90] (700) · SE 6 เฟรม [220×6] peak 3 (660) → เฟรม peak = ชูขวานสุด
  - walk 8 × 100 ms (E สลับ 110 / 90) รอบละ 0.8 วิ · idle 12 เฟรม 2.4 วิ · hurt 7 เฟรม 550 ms
- **ตำแหน่งหัวขวานทุกเฟรม** (SPR_META.sockets ของท่า attack + buff ใน atlas เดิม; index.html liveSocket → wolf_fx.js spriteSlash / W.slash / เส้นตามอาวุธ / รอยฟันโค้ดของ wolf_vfx3.js วิ่งตามหัวขวาน) → cliphero 'orb' จับเส้นรูนฟ้าที่คมขวาน หรือ orbFix อ่านด้วยตาทุกเฟรมของท่าตี / ท่าชู
- **ขนาด:** CHAR_SCALE ไม่มีรายการหมาป่า (= 1) และ CHAR_SCALE ของทุกตัววัดเทียบความสูงตอนยืนของหมาป่าเดิม (S idle 196 cell px ที่สเกล atlas .55) → atlas ใหม่ต้องได้ความสูงบนจอเท่าเดิม (เลือก height ของ cliphero ให้ idle S × สเกล META ≈ 108 หรือใส่ CHAR_SCALE.wolf)
- **แฟชั่น:** `FASHION.head` ใน `assets_fashion.js` = จุดหัวทุกเฟรมของ atlas เดิม (ไม่มีเครื่องมือสร้างในรีโป) → ต้องวัดจุดหัว / หลัง / มือใหม่ แล้วจูนหมวกวาด (PHAT ใน fashion_hats.js: sunfirecrown), หมวกโค้ด (ลอเรล มงกุฎเควทซัล หมวกเก่า Aetherfall), ปีก 12 แบบ (PWING จุดโคนปีก), ผ้าคลุม / ของหลัง, สกินขวาน (วาดทับขวานเดิม → ทำใหม่หรือเอาออก)
- **สีขน / สีชุดตอนสร้างตัว:** หน้ากาก `assets_fur.js` / `assets_cloth.js` / `assets_skin.js` ทำจาก atlas เดิม (`tools/dye/wolf_masks.py`) → ซ่อนแถบสี (window.HERO_DYE) จนกว่าจะทำหน้ากากใหม่ · เจ้าของเคยสั่งพักงานหน้ากากสีเพราะเสียเวลา — ถามก่อนทำ
- หน้า HUD = ตัดหัวจาก view_S ผ่าน window.HUD_FACE (หน้า default ของเกมยังเป็นหมาป่าเดิม ให้ตัวที่ยังไม่มีหน้าตัวเองใช้ต่อ) · หน้าเลือกตัว = ภาพใหญ่ของชีตแล้ว (`select.webp`, SELV wolf 2)
- ยังเป็นลุคเก่า: ไอคอนสกิล 63, พื้นหลังผังสกิล 4 ภาพ, ภาพหน้าโหลด 7 จาก 8 ภาพ · ยังไม่มี: ท่านั่ง (hero_sit.js) · ร่างโคลนทองของ Valhalla's Wrath ใช้สไปร์ทหมาป่าเอง → เปลี่ยนตามเอง"""),
}

def build(h, d, a):
    H = HEROES[h]; back = d in BACK
    ex = {k: (v[d] if isinstance(v, dict) else v[1 if back else 0]) for k, v in H.get('fmt', {}).items()}
    txt = H['act'][a].format(who=H['who'], facing=facing(d, H['P'], H['p'], H['pos']), spos=H['spos'][d],
                             blink='' if back else H['blink'], vis=H['vis'] if back else '', **ex)
    face = H['back_face'][d] if back else H['face']
    return ' '.join([txt, face, H['keep'][d], tail(H['P'], H['pos'], H['weapon'], H.get('nofx'), H.get('inframe'))])

def doc(h):
    H = HEROES[h]
    out = ['# %s — พรอมต์คลิปท่า 20 ตัว (image-to-video)' % H['title'], '',
           '_ไฟล์นี้สร้างจาก `python3 tools/clip_prompts.py %s` — แก้ข้อความที่สคริปต์แล้วรันใหม่ อย่าแก้ไฟล์นี้ตรงๆ_' % h, '',
           H['header'], '']
    for n, d in enumerate(DIRS, 1):
        st = H['start'] if isinstance(H['start'], dict) else dict.fromkeys(('idle', 'walk', 'attack', 'buff'), H['start'])
        files = list(dict.fromkeys(st[a].format(n=n, d=d) for a in ('idle', 'walk', 'attack', 'buff')))
        out += ['## %d. %s — %s · แนบ %s' % (n, d, H['dirname'][d], ' / '.join('`%s`' % f for f in files)), '']
        for a in ('idle', 'walk', 'attack', 'buff'):
            out += [H['actname'][a] + (' · แนบ `%s`' % st[a].format(n=n, d=d) if len(files) > 1 else ''), '```', build(h, d, a), '```', '']
    out += [H['footer'], '']
    return '\n'.join(out)

if __name__ == '__main__':
    h = sys.argv[1]
    if len(sys.argv) > 2 and sys.argv[2] == 'print':
        for d in DIRS:
            for a in ('idle', 'walk', 'attack', 'buff'):
                print('==', d, a, len(build(h, d, a))); print(build(h, d, a))
    else:
        root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        p = os.path.join(root, '%s_CLIP_PROMPTS_TH.md' % h.upper())
        open(p, 'w', encoding='utf-8').write(doc(h)); print('wrote', p)
