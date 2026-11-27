"""Motion-clip prompts (image-to-video) for one hero: 5 directions x 4 actions = 20 complete copy-paste prompts,
written to <HERO>_CLIP_PROMPTS_TH.md (never edit that file by hand: change this script and run it again).
usage: python3 tools/clip_prompts.py sheep [print]      (print = only the 20 prompts, for pasting into the chat)
       python3 tools/clip_prompts.py cat25 poses [print] (extra-pose VIDEO prompts + a still sit prompt -> <HERO>_POSE_CLIP_PROMPTS_TH.md,
                                                         for heroes with a POSES entry, see POSES below)
       python3 tools/clip_prompts.py cat25 sheets [print] (the same extra poses as ChatGPT PICTURE sheets + the sit prompt
                                                          -> <HERO>_POSE_PROMPTS_TH.md, for heroes with a SHEETS entry)

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

LOOK = ("Keep the exact look of the picture: hand-painted chibi cartoon, thick dark-brown outlines, flat cel shading — "
        "not realistic, not 3D.")

def tail(P, pos, weapon, nofx=None, inframe=None, look=None, stay=None):
    return ((look or LOOK) + " The background stays plain flat green for the whole clip. The camera never moves or zooms. "
            + (stay or f"{P} stays in the middle of the frame at the same size and never turns to another direction; ")
            + (inframe or f"{pos} whole body and the whole {weapon} stay inside the frame.") + " " + (nofx or NOFX))

# Extra-pose VIDEOS (owner 2026-11-27, cat 2.5D: 'ขอพร้อมทำพวกท่าพิเศษด้วย จะทำเป็นวีดีโอ ยกเว้นท่านั่ง จะทำเป็นรูป'):
# POSES[hero] = {'title', 'header', 'clips': {key: {n, th, use, prio, frames, text, [d face keep stay nofx inframe fmt]}},
# 'still': {n, th, use, prio, attach, box, fixes}, 'footer'} → `python3 tools/clip_prompts.py <hero> poses [print]` writes
# <HERO>_POSE_PROMPTS_TH.md. A clip uses ONE view (default SE: the hero's own standing picture is the first frame) and the
# hero's look / face / keep / no-effect lines; a clip may replace any of them (a roar opens the mouth, a thrown hat leaves).
POSES = {}

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
- **คลิปครบ 20 อันมาแล้ว 2026-11-24 22:05 → ใส่เกมแล้ว** (`assets_jaguar.js` สร้างจาก `tools/clips/jaguar_plan.json` — ทุกการเลือกเฟรมเขียนไว้ใน `_note` ของไฟล์นั้น): อัปโหลด 1000001249–1268 มาเป็น buff, attack, walk, idle ต่อทิศ SE, S, E, NE, N · เวลาเฟรม attack / buff / walk / hurt = atlas เดิมทุกทิศ (เช็กแล้ว: 35 แอ็กชัน × 8 ทิศ ลำดับเฟรม + เวลา event เท่าเดิมทุกอัน, จังหวะโดนของ 26 สกิลเท่าเดิมเมื่อปิดการตีพลาดแบบสุ่ม) · คลิปทุกทิศมีเอฟเฟกต์ที่โมเดลแอบใส่ (รอยฟัน แสงขาว กากบาท ประกาย) → ท่าตีกระโดดจากท่าง้างไปท่าจบตรงเฟรมโดน · ชูมีด S / N ใช้เฟรมตอนลดมีดเล่นถอยหลัง (ช่วงยกจริงมีรอยแดง / แสงขาวเหลือง) · ใบมีดสว่างขาวใน NE 7–8 ปรับให้ดำด้วยตัวเลือกใหม่ `deglow` · socket = ใบมีดจริง (head = ปลายมีด, grip = โคนมีดที่การ์ดทอง) ตัวเลือกใหม่ `blade` · CHAR_SCALE.jaguar 1.57 (เดิม .94) และ char_jaguar_fx.js ขยายจุดมีดตาม CHAR_SCALE (s2r) ให้รอยฟัน / แสงที่มีดตรงมีด · หน้า HUD `assets/heroes/jaguar/face.webp` · หน้าเลือกตัว = ภาพใหญ่ซ้ายของชีต (`tools/bigpose_cut.py` → `tools/select_cut.py`, SELV jaguar 2)
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
  back_face={'NE': "We see him mostly from behind: the back of his head with both pointed ears and the crimson cape with "
                   "its white fur edge; his head is turned to the right, so we see only the side of his face with one "
                   "ice-blue eye, the red scar and his muzzle, as in the picture; his face never turns toward us.",
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
1. **ภาพยืน 5 มุม** ✓ ครบแล้ว — 4 มุมมา 2026-11-24 20:50 (หลัง · ข้าง · เฉียงหน้า · หน้า) + มุมเฉียงหลังมา 20:57 ('ลืมรูปนึง') · 1254² พื้นเขียว หันขวา ถือขวานทุกมุม ไม่มีสีเขียวบนตัว → `assets/heroes/wolf/view_S|SE|E|NE|N.webp`
2. **ภาพตั้งต้น** ✓ ส่งครบ 5 ทิศแล้ว 2026-11-24 (`wolf_1_S` `wolf_2_SE` `wolf_3_E` `wolf_5_N` 20:50 · `wolf_4_NE` 20:57 สเกลเดียวกัน) — คำสั่งข้างล่าง · ไม่เก็บในรีโป สร้างใหม่ได้ทุกเมื่อ
3. **คลิป 20 ตัว** ✓ มาแล้ว 19 คลิป 2026-11-25 08:34 (ไม่มีคำพูด · 544×544 24 fps) — **ขาด 'ฟันขวาน' เฉียงหลัง (NE)** → ในเกมทิศนั้นยืมท่าฟันด้านข้าง (E) แบบที่หมาป่าเดิมทำมาตลอด · ใส่เกมแล้ว: `assets_wolf.js` (แผน `tools/clips/wolf_plan.json`, บันทึกใน CLAUDE.md หัวข้อ 'Wolf sprite BUILT') · ถ้าส่งคลิปฟัน NE มา: เพิ่มแถว NE ในแผน + `atkRemap:{}` โดยจังหวะฟันต้องเท่าแถว E (โดน 450 ms)

## ภาพตั้งต้น
- `wolf_<n>_<ทิศ>.png` 900×900 สี่เหลี่ยม แบบฮิปโป / จากัวร์ / มังกร · ขวานยาวเกือบเท่าตัว: ยกข้ามไหล่ตอนง้าง + ยื่นไปข้างหน้าตอนฟัน + ชูเหนือหัวตอนบัฟ → ต้องมีที่ว่างเหนือหัวและสองข้างมากกว่าตัวอื่น · เริ่มที่ ht ~480 (ในคลิป 480p ตัวสูง ~255 px) แล้วดูว่าที่ว่างพอไหม
```
V=assets/heroes/wolf; python3 -I tools/dir8cut.py startv <โฟลเดอร์> S=$V/view_S.webp SE=$V/view_SE.webp E=$V/view_E.webp NE=$V/view_NE.webp N=$V/view_N.webp size=900 feet=.9 ht=480 clean=0
```
→ start_<ทิศ>.png → ตั้งชื่อใหม่ wolf_1_S … wolf_5_N · ทุกทิศใช้สเกลของมุมหน้า (ใส่ S ก่อนเสมอ ตอนเพิ่ม NE ทีหลังก็รัน S + NE ด้วยกัน) · clean=0 = ไม่ทาจุดเขียวในตัว (ชุดไม่มีสีเขียวเลย · ช่องระหว่างด้ามขวานกับตัว ใต้แขน ระหว่างข้อโซ่ เป็นพื้นหลังจริง)
- ที่ตัดจริง (สเกล .392 ของภาพ 1254², ภาพยืน 5 มุมสูงต่างกัน ≤ 2 %): ตัวรวมขวานสูง 471–482 px · เหนือหัวว่าง .69–.72 เท่าตัว (ง้างขวานข้ามไหล่ได้) · ซ้าย .54–.59 · ขวา .52–.56 (เลยใบขวานที่ถืออยู่ไปอีก ฟันลงข้างหน้าพอดี) · ในคลิป 480p ~251–257 px
- ภาพยืนที่ได้: แผลเป็นมุมหน้าเป็นขีดเดียว แต่มุมเฉียงหน้า / ข้าง / เฉียงหลังวาดเป็นกากบาท (เล็กมาก ไม่ต้องแก้) · เปียห้อยหลังหูขวาตรงทุกมุม · มุมข้างถือขวานแล้ว · มุมเฉียงหลังหันหัวไปทางขวาจนเห็นข้างหน้า (ตาฟ้าข้างเดียว แผลเป็น ปาก) → พรอมต์คลิป NE เขียนตามภาพ ไม่สั่งให้ซ่อนตา · เศษโซ่ขาด 2 ชิ้นลอยใต้ข้อมือในมุมเฉียงหลัง ติดมาในภาพตั้งต้นด้วย

## วิธีใช้
แนบภาพตั้งต้นของทิศนั้น + วางพรอมต์ทีละตัว → 4 คลิปต่อทิศ (ยืน · เดิน · ฟันขวาน · ชูขวาน) · คลิปละ 3–5 วิ · ไม่ต้องทำทิศซ้าย (เกมกลับด้านเอง) · ส่งกลับเรียง S → SE → E → NE → N ทิศละ ยืน → เดิน → ฟัน → ชู (สลับได้ ดูเองว่าคลิปไหนเป็นท่าอะไร)

## กติกาที่อยู่ในทุกพรอมต์ (บทเรียนจากคลิปลิง / แอคโซลอเติล / มังกรลุคเดิม / แกะ / บาสเต็ด / ฮิปโป / จากัวร์)
- ประโยคบอกทิศขึ้นต้นทุกพรอมต์ กันโมเดลหมุนตัวหันหากล้อง (มุมหลังโดนบ่อย)
- ล็อกหน้า (ตาฟ้า คิ้วเข้ม แผลเป็นแดง ปากปิด สีหน้ามั่นใจ — บนชีตภาพใหญ่ยิ้มอ้าปาก ห้ามติดมา) ในมุมที่เห็นหน้า · มุมเฉียงหลัง NE: เห็นหลังเป็นหลัก หัวหันข้างเห็นตาฟ้าข้างเดียว แผลเป็น ปาก ตามภาพ แต่หน้าไม่หันมา · มุมหลัง N: เห็นแค่หลังหัว · สองมุมนี้ไม่มีกะพริบตา
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
 'rhino': dict(
  title='แรดขนยาว ลุคใหม่ (ไททันธารน้ำแข็ง · Glacier Titan)',
  who='the woolly rhino warrior in this picture', P='He', p='he', pos='his', weapon='gauntlets',
  face="Keep his face exactly as in the picture: the same small fierce frost-blue eyes under the same heavy brows, the same "
       "blue war paint on his cheeks, the same two ivory horns and the same calm, confident small smile, mouth closed.",
  back_face={'NE': "We see him mostly from behind: his shaggy chestnut mane hanging down his back and the back of his head "
                   "with both ears; of his face only the side of his snout with the nostril and his two horns pointing to "
                   "the right, as in the picture; his face never turns toward us.",
             'N': "We only see the back of his head with both ears and the tips of his horns, and his shaggy chestnut mane "
                  "hanging down his back, as in the picture; his face never turns toward us."},
  keep={d: ("His two ivory horns with the dark-iron rings, his shaggy chestnut mane, the X harness with the round copper "
            "rhino medallion, the blue capelet with the white fur trim, the dark-iron pauldron with the ice crystal, the "
            "blue tunic skirt with the copper zigzag border, the two huge dark-iron gauntlets with the ice-crystal knuckles, "
            "the fur-wrapped greaves, the iron-shod boots and his tufted tail stay exactly the same.") for d in ('S', 'SE', 'E')}
       | {d: ("His horns, his shaggy chestnut mane covering his back down to the belt, the blue capelet with the white fur "
              "trim, the dark-iron pauldron with the ice crystal, the back of the blue tunic skirt with the copper zigzag "
              "border, the two huge dark-iron gauntlets with the ice-crystal knuckles, the fur-wrapped greaves, the "
              "iron-shod boots and his tufted tail stay exactly the same.") for d in ('NE', 'N')},
  spos=dict.fromkeys(DIRS, 'hanging at his sides with the fists loosely closed'),
  blink=", his ears twitch once, and he blinks once",
  vis=" Both of his arms and gauntlets stay visible beside his body during the whole move.",
  fmt={'pvis': ('', " Both raised fists stay visible above his head while he holds the pose."),
       'chin': (', lifting his chin proudly', '')},
  inframe="his whole body, both gauntlets, both horns, his whole mane and his tail stay inside the frame.",
  nofx="No shadow, no flash, no glow, no sparkles, no particles, no smoke, no dust, no flying rocks, no cracks in the "
       "ground, no ice, no frost, no speed lines, no shockwave, no magic effects, no text. The ice crystals on his knuckles "
       "and his pauldron stay as drawn and never light up.",
  act={
   'idle': "Idle loop of {who}. {facing} He stands tall and heavy in a firm, wide stance, both huge gauntlets {spos}, and "
           "breathes slowly and deeply: his broad chest rises and falls, his shaggy mane stirs, the blue capelet and the hem "
           "of his skirt sway a little and his tufted tail swings slowly{blink}. The last frame matches the first frame so "
           "the clip loops.",
   'walk': "Walk loop of {who}. {facing} He walks in place, like on a treadmill, toward the way he is facing: heavy, "
           "powerful steps (about two steps per second) in his iron-shod boots, his big body rocking a little from side to "
           "side, both huge gauntlets swinging a little at his sides, his shaggy mane bouncing and his tail swaying behind "
           "him. He does not move across the frame and the ground does not move. The last frame matches the first frame so "
           "the clip loops.",
   'attack': "Double-fist overhead blow of {who}. {facing} He raises both huge gauntlets together high over his head in a "
             "short wind-up, then brings them down hard in front of him toward the way he is facing, bending forward, until "
             "both fists touch the ground just in front of his feet; he holds that pose for a moment, then straightens up, "
             "returns to his starting pose and stands still for the rest of the clip. The whole move takes about one "
             "second. His feet stay in place.{vis} The gauntlets stay exactly as drawn, and the air and the ground around "
             "his fists stay empty and plain green in every frame: nothing breaks and nothing flies up. Clean outlines in "
             "every frame, no motion blur.",
   'buff': "Power-up of {who}. {facing} He crouches a little and pulls both huge gauntlets together in front of his chest "
           "like a guard, gathering strength for a moment, then stands up tall and raises both fists high above his head, "
           "his chest out{chin}; he holds that pose still for about one second, then lowers his fists back to his sides, "
           "returns to his starting pose and stands still for the rest of the clip. His feet stay in place.{pvis} Clean "
           "outlines in every frame, no motion blur."},
  dirname={'S': 'หน้าตรง', 'SE': 'เฉียงหน้า หันขวา', 'E': 'ข้าง หันขวา', 'NE': 'เฉียงหลัง หันขวา', 'N': 'หลัง'},
  actname={'idle': 'ยืน (idle · วนลูป)',
           'walk': 'เดิน (walk · วนลูป · Rhino Charge / Glacier Charge ก็ใช้คลิปนี้เร่ง ×3.2 ตอนพุ่ง)',
           'attack': 'ทุบสองหมัด (attack · ตีปกติ + หมัดทุกท่า — หมัดชุดเล่นช่วงยกหมัด → หมัดถึงพื้นซ้ำเร็วๆ · ท่าทุบพื้นต่อจากท่าชูหมัดตรงเฟรมหมัดถึงพื้น)',
           'buff': 'ชูสองหมัด (buff · บัฟ ป้อม คำราม · Iron Guard ค้างเฟรมย่อตัวตั้งการ์ด · ท่าทุบพื้นใช้ช่วงยกหมัดขึ้นเหนือหัว)'},
  start='rhino_{n}_{d}.png',
  header="""เจ้าของเลือกแบบ 1 'ไททันธารน้ำแข็ง' 2026-11-24 20:56 ("เอาอันนี้ภาพซ้ายเอาไปใส่หน้าเลือกตัว") · ชีต `assets/heroes/rhino/sheet_glacier_titan.webp` · ภาพใหญ่ = หน้าเลือกตัวแล้ว · หน้าตา + พรอมต์ภาพยืน 5 มุม: `RHINO_LOOK_PROMPTS_TH.md` หัวข้อ 'เลือกแล้ว'

## ลำดับงาน
1. **ภาพยืน 5 มุม ✓** (2026-11-24 21:48 เจ้าของส่งมา 5 ภาพ ไม่มีข้อความ) → `assets/heroes/rhino/view_S|SE|E|NE|N.webp` · 1254² พื้นเขียว หันขวาทุกภาพ ตัวสูง 1197–1209 px (ต่างกัน 1 %) · ไม่มีสีเขียวบนตัว (จุดเขียวในตัว = ช่องพื้นหลังจริงระหว่างแขนกับตัว ระหว่างงากับหน้า ระหว่างหางกับขา) · ผ้าคลุมไหล่ / เกราะบ่าอยู่ฝั่งถูกทุกมุม (หน้า: ผ้าคลุมซ้ายภาพ · เฉียงหลัง: ผ้าคลุมขวาภาพ เกราะบ่าไกลซ้าย · หลัง: เกราะบ่าซ้าย ผ้าคลุมขวา) · มุมหน้างาใหญ่ชี้ขึ้นกลางหัวมีห่วง 2 วง · มุมเฉียงหลังเห็นข้างจมูก + รูจมูก + งาสองอัน ไม่เห็นตา · มุมหลังเห็นหูสองข้าง + ปลายงา แผงขนคลุมหลังถึงเข็มขัด
2. **ภาพตั้งต้น ✓** ส่งแล้ว 2026-11-24 → `rhino_1_S.png … rhino_5_N.png` (ไม่เก็บในรีโป สร้างใหม่ด้วยคำสั่งข้างล่างได้ทุกเมื่อ)
3. **คลิป 20 ตัว ✓** (2026-11-25 17:40 เจ้าของส่งมา 20 คลิป + 17:43 คลิปทุบสองหมัดหน้าตรงที่ขาด ไม่มีข้อความ · 480×480 24 fps พื้นเขียว ลำดับอัปโหลด buff, attack, walk, idle ต่อทิศ SE, S, E, NE, N · คลิป buff NE ซ้ำ 2 ไฟล์ ใช้ไฟล์แรก)
4. **สไปร้ในเกม ✓** `assets_rhino.js` (prefix RH เดิม โหลด `?v=2`) = `python3 -I tools/cliphero.py tools/clips/rhino_plan.json assets_rhino.js RH` · เวลาทุกเฟรม / contact / buff peak = atlas เดิมทุกทิศ (N ใช้เวลาของ NE เหมือนเดิม) → จังหวะโดน 36 ท่าเท่าเดิมทุกท่า (`tools/fxlab.py hits` เก่า / ใหม่) · cellScale 1.6217 = ความสูงตอนยืนเท่า atlas เดิม → CHAR_SCALE.rhino .96 เดิม · ซ็อกเก็ต = คริสตัลที่ข้อนิ้วถุงมือ (ทิศหลังที่ไม่เห็นหมัด = อ่านด้วยตา) · ท่ายืน: คลิปหลับตาตลอดช่วงที่ขยับ → ใช้ช่วงลืมตานิ่งๆ + ตัวเลือกใหม่ "breath" ของ cliphero (หายใจ 1 ครั้งต่อรอบ) · หน้า HUD = `assets/heroes/rhino/face.webp` (window.HUD_FACE)

## ภาพตั้งต้น
- `rhino_<n>_<ทิศ>.png` 900×900 สี่เหลี่ยม แบบฮิปโป / จากัวร์ / มังกร / หมาป่า · แรดตัวกว้างมาก (ถุงมือใหญ่ + แผงขน มุมหน้ากว้าง .9 เท่าของความสูง) และต้องมีที่ให้ชูสองหมัดเหนือหัว + ก้มทุบหมัดลงพื้นข้างหน้า → ht 480 · เท้าที่ 88 % (ไม่ใช่ 90 % แบบตัวอื่น: มุมหน้า 'พื้นหน้าเท้า' อยู่ต่ำกว่าเท้าในภาพ หมัดยักษ์ต้องมีที่ลง) · ผลที่วัดได้ (สเกล .400 ทุกทิศ): ตัวสูง 480–485 px = ~256–259 px ในคลิป 480p · เหนือหัวว่าง .64–.65 เท่าตัว · ซ้าย / ขวา S .48 / .47 · SE .53 / .52 · E .63 / .60 · NE .54 / .54 · N .50 / .49 · ใต้เท้า 108 px = .22 เท่าตัว
```
V=assets/heroes/rhino; python3 -I tools/dir8cut.py startv <โฟลเดอร์> S=$V/view_S.webp SE=$V/view_SE.webp E=$V/view_E.webp NE=$V/view_NE.webp N=$V/view_N.webp size=900 feet=.88 ht=480 clean=0
```
→ start_<ทิศ>.png → ตั้งชื่อใหม่ rhino_1_S … rhino_5_N · ทุกทิศใช้สเกลของมุมหน้า (ใส่ S ก่อนเสมอ) · clean=0 = ไม่ทาจุดเขียวในตัว (ชุดไม่มีสีเขียวเลย · ผลึกน้ำแข็ง ≈ RGB 167, 212, 245 ฟ้ามากกว่าเขียว · ช่องระหว่างแขนกับตัว ระหว่างขา เป็นพื้นหลังจริง)

## วิธีใช้
แนบภาพตั้งต้นของทิศนั้น + วางพรอมต์ทีละตัว → 4 คลิปต่อทิศ (ยืน · เดิน · ทุบสองหมัด · ชูสองหมัด) · คลิปละ 3–5 วิ · ไม่ต้องทำทิศซ้าย (เกมกลับด้านเอง) · ส่งกลับเรียง S → SE → E → NE → N ทิศละ ยืน → เดิน → ทุบ → ชู (สลับได้ ดูเองว่าคลิปไหนเป็นท่าอะไร)

## กติกาที่อยู่ในทุกพรอมต์ (บทเรียนจากคลิปลิง / แอคโซลอเติล / มังกรลุคเดิม / แกะ / บาสเต็ด / ฮิปโป / จากัวร์)
- ประโยคบอกทิศขึ้นต้นทุกพรอมต์ กันโมเดลหมุนตัวหันหากล้อง (มุมหลังโดนบ่อย)
- ล็อกหน้า (ตาฟ้าน้ำแข็งเล็กดุ คิ้วหนา ลายสงครามฟ้า งาสองอัน ยิ้มมั่นใจปากปิดแบบภาพ 5 มุม — บนชีตภาพใหญ่ยิ้มเห็นฟัน ท่าสู้อ้าปาก ห้ามติดมา) ในมุมที่เห็นหน้า · มุมหลัง (NE, N) ใช้ประโยค 'เห็นแค่หลังหัว หน้าไม่หันมา' แทน ไม่มีกะพริบตา
- ล็อกของติดตัว: ห่วงเหล็กที่งา · แผงขนเกาลัด · สายหนังไขว้ + เหรียญทองแดงหัวแรด · ผ้าคลุมไหล่น้ำเงินขอบขนขาว · เกราะบ่าฝังผลึก · กระโปรงน้ำเงินขอบซิกแซกทองแดง · ถุงมือยักษ์ข้อนิ้วผลึก · สนับแข้งพันขน · บูทหุ้มเหล็ก · หางพู่
- ไม่มีอาวุธ: หมัดห้อยข้างตัวทุกคลิป ยกเว้นตอนทุบ / ชู
- เดินอยู่กับที่แบบลู่วิ่ง ก้าวหนัก ~2 ก้าว/วิ ตัวโยกซ้ายขวานิดๆ
- ทุบสองหมัด = ยกสองหมัดเหนือหัว แล้วทุบลงข้างหน้าจนหมัดแตะพื้นหน้าเท้า ค้างนิดนึง ยืดตัว ยืนนิ่งจนจบคลิป — ท่าเดียวกันทุกทิศ · เกมเอา 4 เฟรมรอบจังหวะหมัดถึงพื้นมาเล่นซ้ำเร็วๆ เป็นหมัดรัว และท่าทุบพื้นต่อจากท่าชูหมัดตรงเฟรมหมัดถึงพื้น → ช่วงนี้ต้องคมชัดไม่เบลอ · **ไม่ใช้คำว่า attack / smash / slam ในพรอมต์** (คลิปแรกของจากัวร์: โมเดลวาดรอยฟัน แสงขาว ตัว X ทับท่า · แรดทุบพื้นเสี่ยงได้หินแตก ฝุ่น น้ำแข็งพุ่ง) + สั่งให้อากาศกับพื้นรอบหมัดเป็นพื้นเขียวเปล่าทุกเฟรม · มุมหลังสั่งให้แขนกับถุงมือยังเห็นข้างตัว
- ชูสองหมัด = ย่อตัวรวบสองหมัดไว้หน้าอกแบบตั้งการ์ด (เกมค้างเฟรมนี้เป็นท่า Iron Guard และตอนชาร์จ) แล้วยืดตัวชูสองหมัดเหนือหัว อกผาย ค้างนิ่ง ~1 วิ แล้ววางลง · ไม่คำราม (ปากเปิดจะชนกับล็อกหน้า)
- ห้ามเบลอ · ห้ามน้ำแข็ง หิน ฝุ่น แสง แบบในชีต (เอฟเฟกต์ใส่ด้วยโค้ดในเกม `char_rhino_fx.js` + index.html) · กล้องนิ่งไม่ซูม · พื้นเขียวตลอด · ตัว + ถุงมือ + งา + แผงขน + หางอยู่ในกรอบตลอด
- ไม่ระบุมือซ้าย / ขวาในพรอมต์คลิป (ภาพตั้งต้นบอกเองว่าอะไรอยู่ฝั่งไหน)""",
  footer="""## ตอนคลิปมาถึง (โน้ตสำหรับแชตที่ทำต่อ)
- ตัดด้วย `tools/cliphero.py` + แผนใหม่ `tools/clips/rhino_plan.json` (ดู `hippo_plan.json` / `bastet_plan.json`: loop ช่วงที่ลืมตา, เลือกเฟรมเลี่ยงฝุ่น / หิน / น้ำแข็ง / แสงที่โมเดลแอบใส่, flipDirs ถ้ามีคลิปหันผิดฝั่ง, perDir ถ้าคลิปบางทิศถ่ายมาเล็ก / ใหญ่กว่า, "unstreak") → **เขียนทับ `assets_rhino.js`** ด้วย prefix เดิม RH (index.html สลับ atlas ด้วย RH_ART อยู่แล้ว · atkRemap {}) · ใส่ ?v= ให้ assets_rhino.js ใน index.html (ตอนนี้ไม่มี) + แก้ขนาดในตาราง MB ของหน้าโหลด (ตอนนี้ 3.15) · atlas ลุคเดิมอยู่ในประวัติ git
- **เวลาเฟรมต้องเท่า atlas เดิมทุกทิศ** → จังหวะโดน / ปล่อยสกิลเท่าเดิม bench ไม่เปลี่ยน · เช็ก `python3 tools/fxlab.py hits rhino` ก่อน / หลัง:
  - attack 12 เฟรม · S [50,50,50,50,50,50,160,73,146,146,109,110] contact 6 (โดนที่ 300 ms) · SE [84,56,56,56,56,50,50,160,84,169,84,110] contact 7 (408) · E [94,50,94,71,50,142,50,160,71,71,71,110] contact 7 (551) · NE [50,50,50,160,50,50,50,56,180,50,50,110] contact 3 (150) · N: atlas เดิมไม่มีคลิปหันหลัง (ทุกท่าใช้ภาพ NE) → คลิป N ใหม่ใช้เวลาเฟรม + contact ของ NE · เฟรม contact = สองหมัดถึงพื้นพอดี · contact−3 … contact−1 = หมัดเหนือหัว → กำลังทุบลง · หลังจากนั้น = ค้าง + ยืดตัว + ยืน
  - buff 12 เฟรม peak 7 ค้าง 480 ms · S [65,65,65,130,65,50,65,480,227,65,97,50] (ถึง peak 505 ms) · SE [75,75,75,113,50,50,75,480,188,75,50,50] (513) · E [90,50,50,50,90,90,90,480,226,50,90,60] (510) · NE = N [50,50,50,50,79,79,79,480,50,276,158,53] (437) → เฟรม 0–2 = ย่อตัวรวบหมัดหน้าอก (เฟรม 2 = ท่าการ์ด) · 3–6 = ยืดตัวยกหมัด · 7 = ชูสุด · 8–11 = วางหมัดลง
  - walk 8 × 100 ms (E [110,90,90,110,110,90,90,110]) รอบละ 0.8 วิ · idle 12 เฟรม 2.4 วิ (S [190,190,250,190,190,220,190,190,190,190,220,190] · SE [210,180,210,210,180,210,210,180,210,210,180,210] · E [170,190,210,210,190,210,210,190,210,210,190,210] · NE = N 12 × 200) · hurt 7 เฟรม 550 ms (ทำจากเฟรมยืน)
- ใครใช้เฟรมไหน (index.html ส่วนแรด): mkRhBasic = ตีปกติ (หมัดสุดท้ายของชุด = ทั้งคลิป ×1.05, หมัดอื่นเล่นจาก contact−3 ×2.1) · rhPunches = Counter Punch, Armor Crusher, Crushing Counter, Revenge Fist, Heavy Knuckle, Double Hammer Fist, Rising Uppercut, Titan Combo, Meteor Knuckle, Bone Crusher, Breaker Rush, Avalanche Punch, Colossus Grip → หมัดกลางคอมโบเล่นเฟรม contact−2 … contact+1 เร็ว ×2.6–3.2, หมัดสุดท้ายเล่นจาก contact−3 (หมัดเดียว = จากเฟรมแรก) ถึงจบ, windHold ค้างเฟรม contact−3 · rhSlam = Iron Retribution, Fortress Quake, Earthshaker, Seismic Follow-up, Crushing Finale, Glacier Bulwark → buff 0 → peak ค้าง แล้วต่อ attack จาก contact · Skybreaker Fist / Worldbreaker Impact → buff ถึง peak แล้วต่อ attack จาก contact+1 (Worldbreaker ค้าง buff เฟรม 2 ก่อน 0.9 วิ) · Iron Guard ค้าง buff เฟรม 2 ทั้งท่า · Absolute Fortress ค้างเฟรม 2 แล้วชูต่อ · rhCharge (Rhino Charge, Glacier Charge) = buff 0–2 แล้ว walk ×3.2 · บัฟอื่น (Battle Roar, Iron Skin, Guardian Stance, Steel Wall, Shielding Pulse, Rhino Fortress, Ground Anchor, Immovable Colossus …) = buff ทั้งคลิป
- **socket ถุงมือ** (SPR_META.sockets attack + buff ใน atlas เดิม → index.html liveSocket → player.socket) → cliphero 'orb' จับผลึกน้ำแข็งฟ้าที่ข้อนิ้ว หรือ orbFix อ่านด้วยตาทุกเฟรมของท่าทุบ / ท่าชู
- วัด CHAR_SCALE.rhino ใหม่ (ตอนนี้ .96 = คลิปลุคเดิม) ให้ยืนสูงเท่าหมาป่า
- **หน้า HUD:** atlas เดิมมี `RH_PORTRAIT` (หน้าแรดลุคเดิม) — cliphero ไม่สร้าง → ตัดหัวจาก view_S เป็น `assets/heroes/rhino/face.webp` แล้วตั้ง window.HUD_FACE (แบบลิง / แกะ / ฮิปโป / บาสเต็ด) ไม่งั้นหน้า HUD จะกลับเป็นหน้า default
- `CHAR_FILTER.rhino` เป็น '' เมื่อมี RH_ART (ไม่ต้องแก้) · หน้าเลือกตัว = ภาพใหญ่ของชีตแล้ว (`select.webp`, SELV rhino 2)
- ยังเป็นลุคเก่า: ไอคอนสกิล 53 + ex_ 11, พื้นหลังผังสกิล 4 ภาพ, ภาพเอฟเฟกต์ที่มีถุงมือเดิม (`assets/fx/rhino` r01_jab, r02_heavy) / ตัวแรดเดิม (`assets/skill-vfx/rhino` colossus-spirit, worldbreaker), ภาพหน้าโหลด ld1 ld7 ld8 · ยังไม่มี: ท่านั่ง (hero_sit.js)"""),
 'anubis': dict(
  title='อนูบิส ลุคใหม่ (อนูบิสโฉมใหม่ · Anubis Reborn)',
  who='the black jackal warrior in this picture', P='He', p='he', pos='his', weapon='chain and spiked ball',
  face="Keep his face exactly as in the picture: the same narrow gold eyes with the gold kohl lines, the same thin gold "
       "band across his brow, the same black muzzle and the same calm, confident small smile, mouth closed.",
  back_face={'NE': "We see him mostly from behind: the back of his head with both tall ears, the striped headcloth covering "
                   "the back of his head and the white shoulder cape; of his face only the side of his muzzle and the tip of "
                   "one gold eye line on the right, as in the picture; his face never turns toward us.",
             'N': "We only see the back of his head with both tall ears, the striped headcloth covering the back of his "
                  "head and the white shoulder cape across his upper back, as in the picture; his face never turns toward us."},
  keep={d: ("His tall ears, the thin gold band across his brow, the deep-blue-and-gold striped headcloth, the white shoulder "
            "cape with its gold zigzag band and the round gold ankh brooch, the black top with its gold trim, the wide gold "
            "belt with its round buckle, the navy kilt with the gold ankh panel, the gold wrist cuffs, the linen shin wraps, "
            "the gold sandals, his big bushy black tail and the gold chain with the dark spiked ball and its gold ankh stay "
            "exactly the same.") for d in ('S', 'SE', 'E')}
       | {d: ("His tall ears, the striped headcloth, the white shoulder cape with its gold zigzag band, the gold belt, the "
              "back of the navy kilt, the gold wrist cuffs, the linen shin wraps, the gold sandals, his big bushy black tail "
              "and the gold chain with the dark spiked ball stay exactly the same.") for d in ('NE', 'N')},
  spos=dict.fromkeys(DIRS, 'wrapped around his fist at his side with the spiked ball hanging beside his leg'),
  blink=", and his tall ears twitch once; his eyes stay open for the whole clip",
  vis=" His swinging arm, the chain and the whole spiked ball stay visible beside his body during the whole swing.",
  fmt={'pvis': ('', " His raised fist and the dangling ball stay visible above his shoulder while he holds the pose."),
       'chin': (', lifting his chin proudly', '')},
  inframe="his whole body, both tall ears, the whole chain and spiked ball, and his whole tail stay inside the frame.",
  nofx="No shadow, no flash, no glow, no sparkles, no particles, no smoke, no sand, no dust, no light trails, no streaks "
       "of colour, no motion lines, no golden swirls, no purple fire, no magic effects, no symbols, no text.",
  act={
   'idle': "Idle loop of {who}. {facing} He stands tall in a relaxed, ready stance, the gold chain {spos}, his other hand "
           "loosely closed at his side, and breathes slowly: his chest rises and falls, the striped headcloth and the white "
           "shoulder cape stir a little, the spiked ball sways gently on its chain and his big bushy tail sways slowly"
           "{blink}. The last frame matches the first frame so the clip loops.",
   'walk': "Walk loop of {who}. {facing} He walks in place, like on a treadmill, toward the way he is facing: light, "
           "confident steps (about two steps per second) in his gold sandals, the spiked ball swinging a little on its "
           "chain from his fist beside his leg, his other arm swinging a little, the striped headcloth bouncing and his "
           "bushy tail swaying behind him. He does not move across the frame, he does not come closer to the "
           "camera or move away from it, and the ground does not move. The last frame matches the first frame so the clip "
           "loops.",
   'attack': "Flail swing of {who}. {facing} He swings his chain arm up and back so the spiked ball rises over his shoulder "
             "in a short wind-up, then swings it forward and down in one powerful diagonal arc toward the way he is facing, "
             "until his arm points forward and the ball is low in front of him at the end of its chain, just above the ground "
             "without touching it; he holds that pose "
             "for a moment, then lets the ball swing back to hang at his side, returns to his starting pose and stands still "
             "for the rest of the clip. The whole move takes about one second. His feet stay in place.{vis} The chain stays "
             "the same length and the ball stays exactly as drawn, and the air around them stays empty and plain green in "
             "every frame. Clean outlines in every frame, no motion blur.",
   'buff': "Power pose of {who}. {facing} He raises his chain fist high above his head so the spiked ball dangles on its "
           "chain beside his head, and opens his other hand palm up at his side, his chest out{chin}; he holds that pose "
           "still for about one second, then lowers his arm back to his side, returns to his starting pose and stands still "
           "for the rest of the clip. His feet stay in place.{pvis} The raised fist and the ball stay inside the frame. "
           "Clean outlines in every frame, no motion blur."},
  dirname={'S': 'หน้าตรง', 'SE': 'เฉียงหน้า หันขวา', 'E': 'ข้าง หันขวา', 'NE': 'เฉียงหลัง หันขวา', 'N': 'หลัง'},
  actname={'idle': 'ยืน (idle · วนลูป)', 'walk': 'เดิน (walk · วนลูป)',
           'attack': 'เหวี่ยงลูกตุ้ม (attack · ตีปกติ + สกิลเหวี่ยงทุกท่า — เกมเล่นแค่ช่วงง้าง 3 เฟรม → ลูกตุ้มลงตรงหน้า → 2 เฟรมหลัง)',
           'buff': 'ชูกำปั้น (buff · สกิลร่ายทุกท่า พุ่ง หมุน บัฟ อัลติ — เกมปล่อยสกิลที่เฟรมชูสุด)'},
  start='anubis_{n}_{d}.png',
  header="""เจ้าของเลือกแบบ 5 'อนูบิสโฉมใหม่' 2026-11-24 21:27 ("รูปซ้ายเอาไว้ทำ หน้าเลิอกตัวด้วย") · ชีต `assets/heroes/anubis/sheet_reborn.webp` · ภาพใหญ่ = หน้าเลือกตัวแล้ว · หน้าตา + พรอมต์ภาพยืน 5 มุม: `ANUBIS_LOOK_PROMPTS_TH.md` หัวข้อ 'เลือกแล้ว'

## ลำดับงาน
1. **ภาพยืน 5 มุม ✓** (2026-11-24 21:58 เจ้าของส่งมา 5 ภาพ ไม่มีข้อความ) → `assets/heroes/anubis/view_S|SE|E|NE|N.webp` · 1254² พื้นเขียว หันขวาทุกภาพ ตัวสูง 1173–1196 px (ต่างกัน 2 %) · ไม่มีสีเขียวบนตัว (จุดเขียวอ่อนๆ = ขอบเส้นที่ติดพื้นหลัง · ช่องเขียวในตัว = รูห่วงโซ่ / ระหว่างแขนกับตัว เป็นพื้นหลังจริง) · กำปั้นพันโซ่อยู่ฝั่งถูกทุกมุม (หน้า / เฉียงหน้า: ซ้ายภาพ · ข้าง: ฝั่งใกล้ · เฉียงหลัง / หลัง: ขวาภาพ) ลูกตุ้มห้อยระดับเข่า มือว่างกำหลวมๆ · มุมเฉียงหลังเห็นข้างปากด้านขวา + ปลายเส้นตาทองนิดเดียว · มุมหลังเห็นหูสองข้าง ผ้าโพกคลุมหลังหัวลงมาถึงผ้าคลุมไหล่ · ไม่มีตะขอ ไม่มีเอฟเฟกต์
2. **ภาพตั้งต้น ✓** ส่งแล้ว 2026-11-24 → `anubis_1_S.png … anubis_5_N.png` (ไม่เก็บในรีโป สร้างใหม่ด้วยคำสั่งข้างล่างได้ทุกเมื่อ)
3. **คลิป 20 ตัว** — รอคลิป · พรอมต์ในไฟล์นี้ แนบภาพตั้งต้นของทิศนั้นทุกคลิป · 2026-11-25 19:14 เจ้าของขอพรอมต์อีกรอบ ('ขอพร้อมทำอนิเมชั่นอนูบิส') → ภาพตั้งต้นทำใหม่ (คำสั่งเดิม ตัวเลขเดิม) + พรอมต์ 20 กล่องส่งในแชท ทิศละข้อความ · ปรับตามบทเรียนแรด / หมาป่า: ยืนลืมตาตลอด · เดินไม่เข้าหากล้อง · ลูกตุ้มหยุดเหนือพื้น · ห้ามเส้นความเร็ว / สัญลักษณ์

## ภาพตั้งต้น
- `anubis_<n>_<ทิศ>.png` 900×900 สี่เหลี่ยม แบบฮิปโป / จากัวร์ / หมาป่า / แรด · หูสูงมาก + ต้องมีที่ให้เหวี่ยงลูกตุ้มข้ามไหล่ ฟาดไปข้างหน้า และชูกำปั้นเหนือหัว (ลูกตุ้มห้อยข้างหัว) → ht 480 · เท้าที่ 88 % แบบแรด (มุมหน้า 'ต่ำตรงหน้า' อยู่ต่ำกว่าเท้าในภาพ ลูกตุ้มต้องมีที่ลง) · ผลที่วัดได้ (สเกล .404 ทุกทิศ): ตัวสูง 475–483 px = ~253–258 px ในคลิป 480p · เหนือหูว่าง .64–.67 เท่าตัว · ซ้าย / ขวา S .62 / .70 · SE .65 / .69 · E .69 / .73 · NE .70 / .64 · N .69 / .65 · ใต้เท้า 107–108 px = .22 เท่าตัว
```
V=assets/heroes/anubis; python3 -I tools/dir8cut.py startv <โฟลเดอร์> S=$V/view_S.webp SE=$V/view_SE.webp E=$V/view_E.webp NE=$V/view_NE.webp N=$V/view_N.webp size=900 feet=.88 ht=480 clean=0
```
→ start_<ทิศ>.png → ตั้งชื่อใหม่ anubis_1_S … anubis_5_N · ทุกทิศใช้สเกลของมุมหน้า (ใส่ S ก่อนเสมอ) · clean=0 = ไม่ทาจุดเขียวในตัว (ชุดไม่มีสีเขียวเลย · แถบผ้า / กระโปรงน้ำเงินมากกว่าเขียวทุกจุด · ช่องในห่วงโซ่ ระหว่างแขนกับตัว ระหว่างขา เป็นพื้นหลังจริง)

## วิธีใช้
แนบภาพตั้งต้นของทิศนั้น + วางพรอมต์ทีละตัว → 4 คลิปต่อทิศ (ยืน · เดิน · เหวี่ยงลูกตุ้ม · ชูกำปั้น) · คลิปละ 3–5 วิ · ไม่ต้องทำทิศซ้าย (เกมกลับด้านเอง) · ส่งกลับเรียง S → SE → E → NE → N ทิศละ ยืน → เดิน → เหวี่ยง → ชู (สลับได้ ดูเองว่าคลิปไหนเป็นท่าอะไร)

## กติกาที่อยู่ในทุกพรอมต์ (บทเรียนจากคลิปลิง / แอคโซลอเติล / มังกรลุคเดิม / แกะ / บาสเต็ด / ฮิปโป / จากัวร์ / หมาป่า / แรด)
- ประโยคบอกทิศขึ้นต้นทุกพรอมต์ กันโมเดลหมุนตัวหันหากล้อง (มุมหลังโดนบ่อย)
- ล็อกหน้า (ตาทองเส้นอายไลเนอร์ทอง คาดหน้าผากทอง ปากดำ ยิ้มปากปิด สีหน้ามั่นใจ) ในมุมที่เห็นหน้า · มุมหลัง (NE, N) ใช้ประโยค 'เห็นแค่หลังหัว หน้าไม่หันมา' แทน
- ท่ายืนมุมหน้า: **ลืมตาตลอดคลิป** แทน 'กะพริบตา 1 ครั้ง' (คลิปยืนของแรดหลับตาตลอดช่วงที่ขยับ · หมาป่า / จากัวร์ / บาสเต็ด / แกะ หลับตาเป็นช่วงยาว ต้องตัดทิ้ง)
- ล็อกของติดตัว: หูสูงตั้งพ้นผ้า · ผ้าโพกลายทางน้ำเงินทอง · ผ้าคลุมไหล่ขาวแถบซิกแซกทอง · เข็มกลัดอังค์ทองกลม · เสื้อดำขลิบทอง · เข็มขัดทองหัวกลม · กระโปรงกรมแผงอังค์ · กำไลทอง · ผ้าพันแข้ง · รองเท้าทอง · หางพวงดำ · โซ่ทองพันกำปั้น + ลูกตุ้มหนามอังค์
- เดินอยู่กับที่แบบลู่วิ่ง ~2 ก้าว/วิ ลูกตุ้มแกว่งนิดๆ ข้างขา · **ไม่เดินเข้าหา / ออกจากกล้อง** (คลิปเดินหน้าตรงของหมาป่าเดินเข้าหากล้องจนตัวโตขึ้น 1.4 เท่า)
- เหวี่ยงลูกตุ้ม = เหวี่ยงแขนขึ้นไปข้างหลังให้ลูกตุ้มข้ามไหล่ แล้วฟาดลงทแยงไปข้างหน้าจนแขนชี้ไปข้างหน้า ลูกตุ้มอยู่ต่ำตรงหน้าสุดปลายโซ่ **เหนือพื้น ไม่แตะพื้น** (แรด / ฮิปโป: อาวุธกระทบพื้น → โมเดลใส่น้ำแข็ง ฝุ่น แสงขาวที่พื้นเอง) ค้างนิดนึง ปล่อยกลับมาห้อยข้างตัว ยืนนิ่งจนจบคลิป · **ไม่ใช้คำว่า attack / slash / smash ในพรอมต์** (คลิปแรกของจากัวร์: โมเดลวาดรอยฟัน แสงขาว ตัว X ทับท่า) + สั่งให้อากาศรอบลูกตุ้มเป็นพื้นเขียวเปล่าทุกเฟรม · โซ่ยาวเท่าเดิม · มุมหลังสั่งให้แขน โซ่ ลูกตุ้มยังเห็นข้างตัว
- ชูกำปั้น = ชูกำปั้นที่พันโซ่ขึ้นเหนือหัว ลูกตุ้มห้อยข้างหัว อีกมือแบหงายข้างตัว อกผาย ค้างนิ่ง ~1 วิ แล้ววางลง — เกมใช้ทั้งคลิปกับสกิลร่ายทุกท่า
- ห้ามเบลอ · ห้ามเส้นความเร็ว / สัญลักษณ์ (คลิปยืน NE ของฮิปโปมีเส้น '!' สีเหลือง) · ห้ามวงทอง ฝุ่นทราย ไฟม่วง แบบในชีต (เอฟเฟกต์ใส่ในเกม: `char_anubis.js` + ภาพวาด `char_anubis_fx.js`) · กล้องนิ่งไม่ซูม · พื้นเขียวตลอด · ตัว + หู + โซ่ + ลูกตุ้ม + หางอยู่ในกรอบตลอด
- ไม่ระบุมือซ้าย / ขวาในพรอมต์คลิป (ภาพตั้งต้นบอกเองว่าโซ่อยู่ฝั่งไหน)""",
  footer="""## ตอนคลิปมาถึง (โน้ตสำหรับแชตที่ทำต่อ)
- ตัดด้วย `tools/cliphero.py` + แผนใหม่ `tools/clips/anubis_plan.json` (ดู `hippo_plan.json` / `bastet_plan.json`: loop ช่วงที่ลืมตา, เลือกเฟรมเลี่ยงรอยวง / ฝุ่น / แสงที่โมเดลแอบใส่, flipDirs ถ้ามีคลิปหันผิดฝั่ง, perDir ถ้าคลิปบางทิศถ่ายมาเล็ก / ใหญ่กว่า, "unstreak")
- **เขียนเป็นไฟล์ใหม่ `assets_anubis.js`** (prefix ใหม่ เช่น ANB + สลับเข้าใน index.html แบบ BST_ART เฉพาะ `?char=anubis` + รายการ document.write + ตาราง MB ของหน้าโหลด) · **ห้ามเขียนทับ `assets.js`**: มันคือหมาป่า + ร่างชั่วคราวของจิ้งจอก สิงโต จระเข้ อีกา (และอนูบิสตอนนี้)
- **เวลาเฟรมต้องเท่า `assets.js` ทุกทิศ** (อนูบิสถูก bench กับเวลานี้) → จังหวะโดน / ปล่อยสกิลเท่าเดิม · เช็ก `python3 tools/fxlab.py hits anubis` ก่อน / หลัง:
  - attack 12 เฟรม 900 ms · S [80,50,90,50,50,50,70,200,50,50,50,110] contact 6 (โดนที่ 370 ms) · SE [50,50,190,70,90,50,50,50,50,50,90,110] contact 4 (360 ms) · E [80,50,50,100,50,120,60,120,50,50,50,120] contact 6 (450 ms) · N [110,120,50,50,70,50,120,70,50,50,50,110] contact 6 (450 ms) · NE: atlas เดิมให้เกมเล่นแถว E แทน (atkRemap NE→E) → คลิป NE ใหม่ใช้เวลาเฟรม + contact ของ E แล้วตั้ง atkRemap {} (แบบบาสเต็ด) · เฟรม contact = ลูกตุ้มลงต่ำตรงหน้า แขนชี้ไปข้างหน้า · contact−3 … contact−1 = ลูกตุ้มข้ามไหล่ → กำลังฟาดลง (ช่วงนี้ต้องคม ไม่เบลอ)
  - buff 12 เฟรม 1.4 วิ peak 7 · S [170,50,50,230,50,110,390,50,50,50,50,150] (1,050 ms) · E [70,50,50,50,50,70,170,580,50,50,50,160] (510) · NE [80,60,50,50,50,50,120,160,480,60,60,180] (460) · N [130,50,50,50,50,110,260,450,60,50,50,90] (700) · SE 6 เฟรม [220×6] peak 3 (660) → เฟรม peak = ชูกำปั้นสุด
  - walk 8 × 100 ms (E สลับ 110 / 90) รอบละ 0.8 วิ · idle 12 เฟรม 2.4 วิ · hurt 7 เฟรม 550 ms
- ใครใช้เฟรมไหน (`char_anubis.js`): `uSwingAct` = ตีปกติ (Chain Flail ชุด + Chain Frenzy), Ankh Sweep, Chain Lasso, Soul Hook, Heart Crush, Final Judgment, Scale Breaker → เล่น attack ตั้งแต่ contact−3 ถึง contact+2 เร็ว ×1–1.7 × aspd() ดาเมจที่ contact · `uCast` → buffAct = ที่เหลือทั้งหมด (Jackal Lunge, Linen Wraps, Embalming Rite, Standard of Ra, Sandstorm Spin, Meteor Ankh, Duat Cyclone, Chain Guard, Wheel of Ra, Binding Chains, Jackal Pounce, Underworld Gate, Hall of Two Truths, Dust Devil, Rite of Rebirth, Avatar of Anubis, Ra's Wrath, Anubis Verdict) → buff ถึง peak = ปล่อยสกิล · ท่าหมุน (Sandstorm Spin, Wheel of Ra) วาดโซ่ + ลูกตุ้มหมุนรอบตัวด้วยโค้ด (uChain / uBall) ตัวไม่หมุน
- **socket:** โค้ดอนูบิสไม่อ่าน socket ตอนนี้ (ไม่จำเป็นต้องทำ) · ถ้าอยากให้เอฟเฟกต์ออกจากลูกตุ้มจริง → cliphero 'orb' จับอังค์ทอง / ลูกตุ้ม หรือ orbFix อ่านด้วยตา
- **ขนาด:** CHAR_SCALE.anubis ตอนนี้ 1 (ร่างหมาป่า) · CHAR_SCALE ของทุกตัววัดเทียบความสูงตอนยืนของหมาป่า (S idle 196 cell px ที่สเกล atlas .55) → วัดใหม่ให้ยืนสูงเท่าหมาป่า (หูสูงนับรวม)
- **หน้า HUD:** ตอนนี้ใช้หน้า default (หมาป่า) → ตัดหัวจาก view_S เป็น `assets/heroes/anubis/face.webp` แล้วตั้ง window.HUD_FACE ใน installAnubis (แบบลิง / แกะ / ฮิปโป / บาสเต็ด)
- อนูบิสไม่มี CHAR_FILTER (ไม่ต้องแก้) · หน้าเลือกตัว = ภาพใหญ่ของชีตแล้ว (`select.webp`, SELV anubis 2)
- ยังเป็นลุคเก่า: ไอคอนสกิลที่มีตัวอนูบิส (~2 ใน 3 ของ 55 + ex_ 8), พื้นหลังผังสกิล 4 ภาพ, ภาพเอฟเฟกต์ `anubis_head` / `avatar_aura` (เทพหมาจิ้งจอกทองโพกผ้าลายทาง ยังพอเข้ากัน), ภาพหน้าโหลด ld1 ld8 · ยังไม่มี: ท่านั่ง (hero_sit.js)"""),
 'owl': dict(
  title='นกฮูกหิมะ ลุคใหม่ (นกฮูกหิมะโฉมใหม่ · Snowy Owl Reborn)',
  who='the snowy owl crossbowman in this picture', P='He', p='he', pos='his', weapon='crossbow',
  face="Keep his face exactly as in the picture: the same big round golden-orange eyes under the same sharp feathered "
       "brows, the same small grey hooked beak and the same focused, determined look.",
  back_face={'NE': "We see him mostly from behind: the back of his head with its slate-blue spots and two feather tufts, "
                   "the cream fur collar and his folded white wings; of his face only the edge of his face and the tip of "
                   "his beak on the right, as in the picture; his head never turns around toward us like a real owl's.",
             'N': "We only see the back of his head with its slate-blue spots and both feather tufts, the cream fur "
                  "collar, the blue shoulder cape and his folded white wings, as in the picture; his head never turns "
                  "around toward us like a real owl's."},
  keep={d: ("His crown of spiky white feathers with the two tall tufts and the slate-blue spots, the cream fur collar, the "
            "blue scarf, the royal-blue shoulder cape with its cream zigzag pattern, the round snowflake brooch with its two "
            "little white feathers, the brown leather jerkin with its chest strap, the brown gloves with cream fur cuffs, "
            "the wide belt with its big square silver buckle, the brown pouches, the blue snowflake banner, the tall brown "
            "boots with cream fur cuffs and silver buckles, his folded white wings and the wooden crossbow with its blue "
            "cord and big blue crystal point stay exactly the same.") for d in ('S', 'SE', 'E')}
       | {d: ("His crown of spiky white feathers with the slate-blue spots, the cream fur collar, the royal-blue shoulder "
              "cape with its cream zigzag pattern, his folded white wings, the tall brown boots with cream fur cuffs and the "
              "wooden crossbow stay exactly the same.") for d in ('NE', 'N')},
  spos=dict.fromkeys(DIRS, 'low in front of his waist'),
  blink=", the two little feathers under his brooch sway, and he blinks once",
  vis=" The ends of the crossbow's bow arms stay visible beside his head while he aims.",
  fmt={'pvis': (" His spread wings and the raised crossbow stay inside the frame.",
                " His raised crossbow and his spread wings stay visible and inside the frame while he holds the pose.")},
  inframe="his whole body, both feather tufts, his whole wings and the whole crossbow stay inside the frame.",
  nofx="No shadow, no flash, no glow, no sparkles, no particles, no smoke, no snow, no frost, no ice crystals, no moon, "
       "no stars, no bolt or arrow, no light trails, no streaks of colour, no magic effects, no text.",
  act={
   'idle': "Idle loop of {who}. {facing} He stands in a relaxed, ready stance holding his wooden crossbow {spos} with both "
           "hands, and breathes slowly: his chest feathers rise and fall, the feather tufts on his head and the tips of his "
           "folded wings stir a little{blink}. The last frame matches the first frame so the clip loops.",
   'walk': "Walk loop of {who}. {facing} He walks in place, like on a treadmill, toward the way he is facing: short, steady "
           "steps (about two steps per second) in his big boots, the crossbow held {spos} with both hands bobbing a little "
           "with each step, his folded wings and the blue banner swaying. He does not move across the frame and the ground "
           "does not move. The last frame matches the first frame so the clip loops.",
   'attack': "Crossbow aim of {who}. {facing} He lifts his crossbow with both hands up to his shoulder and aims along it "
             "toward the way he is facing, holds that aim perfectly still for a moment, then the crossbow jerks back a "
             "little in one small recoil, he holds the aim still for an instant again, then lowers the crossbow to hold it {spos} "
             "again, returns to his starting pose and stands still for the rest of the clip. The whole move takes about one and a "
             "half seconds. His feet stay in place.{vis} Nothing leaves the crossbow: it keeps its size and shape, and the "
             "air in front of it stays empty and plain green in every frame. Clean outlines in every frame, no motion blur.",
   'buff': "Power pose of {who}. {facing} He crouches down a little, then rises tall, opens his folded white wings wide on "
           "both sides of his body and lifts his crossbow high above his head with both hands; he holds that pose still for "
           "about one second with his wings spread, then folds his wings back down, lowers the crossbow to hold it {spos} again, "
           "returns to his starting pose and stands still for the rest of the clip. His feet stay on the ground.{pvis} Clean outlines in every frame, no motion blur."},
  dirname={'S': 'หน้าตรง', 'SE': 'เฉียงหน้า หันขวา', 'E': 'ข้าง หันขวา', 'NE': 'เฉียงหลัง หันขวา', 'N': 'หลัง'},
  actname={'idle': 'ยืน (idle · วนลูป)', 'walk': 'เดิน (walk · วนลูป)',
           'attack': 'เล็งหน้าไม้ (attack · ยิงปกติ + สกิลยิงทุกท่า — เกมค้างเฟรมเล็งนิ่งตอนเล็ง และเฟรมสะบัดตอนยิงแต่ละนัด)',
           'buff': 'กางปีกชูหน้าไม้ (buff · บัฟ กระโดด ล่องหน อัลติ — เกมใช้เฟรมย่อตัว เฟรมกำลังลอย และเฟรมชูสุด)'},
  start='owl_{n}_{d}.png',
  header="""เจ้าของเลือกแบบ 5 'นกฮูกหิมะโฉมใหม่' 2026-11-24 22:25 ("ทำภาพซ้ายเป็นภาพตอนเลือกตัวให้หน่อย") · ชีต `assets/heroes/owl/sheet_reborn.webp` · ภาพใหญ่ = หน้าเลือกตัวแล้ว · หน้าตา + พรอมต์ภาพยืน 5 มุม: `OWL_LOOK_PROMPTS_TH.md` หัวข้อ 'เลือกแล้ว'

## ลำดับงาน
1. **ภาพยืน 5 มุม** — รอภาพ (พรอมต์ใน `OWL_LOOK_PROMPTS_TH.md` ขั้น 1) → `assets/heroes/owl/view_S|SE|E|NE|N.webp`
2. **ภาพตั้งต้น** — ตัดเมื่อภาพยืนมา (คำสั่งข้างล่าง) → `owl_1_S.png … owl_5_N.png` (ไม่เก็บในรีโป)
3. **คลิป 20 ตัว** — พรอมต์ในไฟล์นี้ (เขียนรอไว้ตามแบบที่สั่ง: ตอนภาพยืนมา ปรับประโยคหน้า / มุมหลังให้ตรงภาพจริงแล้วรันใหม่) แนบภาพตั้งต้นของทิศนั้นทุกคลิป

## ภาพตั้งต้น (แผน)
- `owl_<n>_<ทิศ>.png` 900×900 สี่เหลี่ยม แบบฮิปโป / จากัวร์ / หมาป่า / แรด / อนูบิส · ต้องมีที่ให้กางปีกออกสองข้าง ชูหน้าไม้เหนือหัว และยกหน้าไม้ประทับไหล่เล็ง → ตัวเล็กกว่าตัวอื่นนิดนึง (ht ~450) · เท้าที่ 90 % · วัดที่ว่างจริงตอนภาพมา
```
V=assets/heroes/owl; python3 -I tools/dir8cut.py startv <โฟลเดอร์> S=$V/view_S.webp SE=$V/view_SE.webp E=$V/view_E.webp NE=$V/view_NE.webp N=$V/view_N.webp size=900 feet=.9 ht=450 clean=0
```
→ start_<ทิศ>.png → ตั้งชื่อใหม่ owl_1_S … owl_5_N · ทุกทิศใช้สเกลของมุมหน้า (ใส่ S ก่อนเสมอ) · clean=0 = ไม่ทาจุดเขียวในตัว (ชุดไม่มีสีเขียว: ฟ้า / น้ำเงินทุกจุดน้ำเงินมากกว่าเขียว · ช่องระหว่างแขน ตัว หน้าไม้ ปีก ขา เป็นพื้นหลังจริง)

## วิธีใช้
แนบภาพตั้งต้นของทิศนั้น + วางพรอมต์ทีละตัว → 4 คลิปต่อทิศ (ยืน · เดิน · เล็งหน้าไม้ · กางปีกชูหน้าไม้) · คลิปละ 3–5 วิ · ไม่ต้องทำทิศซ้าย (เกมกลับด้านเอง) · ส่งกลับเรียง S → SE → E → NE → N ทิศละ ยืน → เดิน → เล็ง → กางปีก (สลับได้ ดูเองว่าคลิปไหนเป็นท่าอะไร)

## กติกาที่อยู่ในทุกพรอมต์ (บทเรียนจากคลิปลิง / แอคโซลอเติล / มังกรลุคเดิม / แกะ / บาสเต็ด / ฮิปโป / จากัวร์)
- ประโยคบอกทิศขึ้นต้นทุกพรอมต์ กันโมเดลหมุนตัวหันหากล้อง (มุมหลังโดนบ่อย) · นกฮูกหมุนหัวได้รอบ → มุมหลังสั่งเพิ่มว่าหัวไม่หันกลับมาหาคนดูแบบนกฮูกจริง
- ล็อกหน้า (ตากลมทองส้ม คิ้วขนแหลม จะงอยปากเทา สีหน้ามุ่งมั่น) ในมุมที่เห็นหน้า · มุมหลัง (NE, N) ใช้ประโยค 'เห็นแค่หลังหัว' แทน ไม่มีกะพริบตา
- ล็อกของติดตัว: แผงขนแหลม + จุกขนสองข้าง + จุดฟ้าอมม่วง · ปลอกคอขนครีม · ผ้าพันคอน้ำเงิน · ผ้าคลุมไหล่น้ำเงินลายซิกแซกครีม · เข็มกลัดเกล็ดหิมะ + ขนนกเล็ก 2 เส้น · เสื้อหนัง + สายพาดอก · ถุงมือขอบขนครีม · เข็มขัดหัวเงินสี่เหลี่ยม · กระเป๋า · ธงเกล็ดหิมะ · บูตขอบขนครีมหัวเข็มขัดเงิน · ปีกพับ · หน้าไม้ไม้เชือกน้ำเงินหัวคริสตัล
- เดินอยู่กับที่แบบลู่วิ่ง ~2 ก้าว/วิ หน้าไม้ในมือขยับนิดๆ ปีกกับธงแกว่ง
- เล็งหน้าไม้ = ยกหน้าไม้ประทับไหล่ เล็งนิ่ง → สะบัดถอยนิดเดียว 1 ครั้ง → เล็งนิ่งอีกนิด → ลดลง ยืนนิ่งจนจบคลิป · **ไม่ใช้คำว่า attack / shoot / fire ในพรอมต์** (คลิปแรกของจากัวร์: คำว่า attack ทำให้โมเดลวาดรอยฟัน แสงขาว ตัว X ทับท่า) + สั่งว่าไม่มีอะไรออกจากหน้าไม้ อากาศหน้าหน้าไม้เป็นพื้นเขียวเปล่าทุกเฟรม (ลูกดอกเกมวาดเอง) · มุมหลังสั่งให้ปลายคันศรยังเห็นข้างหัว
- กางปีกชูหน้าไม้ = ย่อตัวนิดนึง → ยืดตัวขึ้น กางปีกออกกว้างสองข้าง ชูหน้าไม้เหนือหัวด้วยสองมือ ค้างนิ่ง ~1 วิ → หุบปีก ลดหน้าไม้ · เท้าติดพื้น (ถ้าบอก 'กระโดด' โมเดลจะพาตัวหลุดกรอบ) — เกมใช้ทั้งคลิปกับสกิลบัฟ / กระโดด / อัลติ
- ห้ามเบลอ · ห้ามจันทร์เสี้ยว ดาว หิมะ ผลึกน้ำแข็ง แบบท่าสู้ในชีต (เอฟเฟกต์ใส่ในเกม: `char_owl.js` + ภาพ `char_owl_fx.js`) · กล้องนิ่งไม่ซูม · พื้นเขียวตลอด · ตัว + จุกขน + ปีก + หน้าไม้อยู่ในกรอบตลอด
- ไม่ระบุมือซ้าย / ขวาในพรอมต์คลิป (ภาพตั้งต้นบอกเองว่าเข็มกลัด / หน้าไม้อยู่ฝั่งไหน)""",
  footer="""## ตอนคลิปมาถึง (โน้ตสำหรับแชตที่ทำต่อ)
- ตัดด้วย `tools/cliphero.py` + แผนใหม่ `tools/clips/owl_plan.json` (ดู `hippo_plan.json` / `bastet_plan.json`: loop ช่วงที่ลืมตา, เลือกเฟรมเลี่ยงแสง / ประกาย / ลูกดอกที่โมเดลแอบใส่, flipDirs ถ้ามีคลิปหันผิดฝั่ง, perDir ถ้าคลิปบางทิศถ่ายมาเล็ก / ใหญ่กว่า, "unstreak")
- **เขียนทับ `assets_owl.js`** (prefix OW เดิม ใช้กับนกฮูกตัวเดียว · index.html สลับเข้าด้วย OW_ART อยู่แล้ว · atkRemap {} = ทุกทิศใช้ท่าตีของตัวเอง) · อัปเดตขนาดไฟล์ในตาราง MB ของหน้าโหลด + เพิ่ม ?v ให้ assets_owl.js ใน index.html (ตอนนี้ไม่มี ?v)
- **เวลาเฟรมต้องเท่าเดิมทุกทิศ** (นกฮูกถูก bench กับเวลานี้) → เช็ก `python3 tools/fxlab.py hits owl` ก่อน / หลัง:
  - attack 12 เฟรม contact 8 ทุกทิศ · S [50,50,50,50,50,50,50,121,160,180,121,110] (โดนที่ 471 ms) · SE [69,50,50,69,69,69,69,69,160,104,104,110] (514) · E [85,50,50,50,50,50,50,50,160,171,128,110] (435) · NE [69,50,50,69,69,50,50,69,160,173,104,110] (476) · N [72,72,50,50,50,50,50,72,160,143,143,110] (466)
  - **เฟรมที่เกมใช้จริงในท่าตี** (`owShotAction`): เฟรม 6 (contact−2) = เล็งนิ่งประทับไหล่ → ค้างตลอดเวลาเล็งของสกิล · เฟรม 7 (contact−1) = สะบัดตอนยิง → ค้างทุกนัด (ตีปกติ + Piercing, Aimed Shot, Deadeye, Hunter's Mark, Heavy Bolt, Armor Drill, Ricochet, Flurry, Snow Snare, Circling Hunt) · จังหวะยิงมาจากเวลาเล็งของสกิลเอง ไม่ขึ้นกับเวลาเฟรมข้างบน · Silent Execution เล่นต่อตั้งแต่เฟรม 8 จนจบ → เฟรม 8–11 = ลดหน้าไม้ลงสวยๆ · เฟรม 0–5 = ยกหน้าไม้ขึ้น (ไม่ค่อยได้เห็น)
  - buff 12 เฟรม peak 7 ค้าง 480 ms · S [76,76,76,76,76,76,76,480,189,76,76,50] (ถึง peak 532 ms) · SE [50,50,79,79,79,79,79,480,158,79,79,52] (495) · E [50,50,90,90,90,90,90,480,181,90,50,60] (550) · NE [82,50,82,82,82,82,82,480,165,124,50,55] (542) · N [79,50,79,79,79,79,79,480,158,118,79,53] (524)
  - **เฟรมที่เกมใช้จริงในท่าบัฟ**: เฟรม 1 = ย่อตัว (ค้างตอน Wing Hop, Snow Veil, Skyfall ตอนกระโดดขึ้น · Snow Tent ค้างตลอดเวลาพัก) · เฟรม 3 = กำลังยืดตัว ปีกเริ่มกาง (ค้างตอน Skyfall ลอยกลางอากาศ 0.42 วิ, Feather Flash — เกมยกตัวด้วย player.z เอง) · เฟรม 7 = กางปีกชูหน้าไม้สุด (บัฟ + อัลติทั้งหมด + Silent Execution ค้างท่านี้ตอนเล็ง) → เลือกเฟรม 1 / 3 / 7 จากคลิปให้ดี
  - walk 8 × 100 ms (E สลับ 110 / 90) · idle 12 เฟรม 2.4 วิ · hurt 7 เฟรม 550 ms (ทำจากท่ายืน)
- **socket:** `sockets` attack + buff (head / grip) ใช้แค่ประกายตอนร่าย · ลูกดอกออกจาก `owMuzzle` (จุดคงที่ 14 px หน้าตัว สูง 30 × CHAR_SCALE) ไม่อ่าน socket · cliphero 'orb' จับคริสตัลฟ้าหัวหน้าไม้ได้ถ้าอยากให้ประกายตรงหัวหน้าไม้
- **ขนาด:** CHAR_SCALE.owl ตอนนี้ .97 · วัดใหม่ให้ยืนสูงเท่าหมาป่า (จุกขนนับรวม)
- **หน้า HUD:** ตอนนี้ใช้ `OW_PORTRAIT` ที่ฝังใน `assets_owl.js` เดิม (หายไปเมื่อเขียน atlas ใหม่ถ้าไม่ใส่) → ตัดหัวจาก view_S เป็น `assets/heroes/owl/face.webp` แล้วตั้ง window.HUD_FACE ใน installOwl (แบบลิง / แกะ / ฮิปโป / บาสเต็ด) · CHAR_FILTER ของนกฮูกเป็น '' อยู่แล้วเมื่อมี OW_ART
- หน้าเลือกตัว = ภาพใหญ่ของชีตแล้ว (`select.webp`, SELV owl 2)
- ยังเป็นลุคเก่า: ไอคอนสกิล 48 (+ ex_ 7 เป็นโค้ด), พื้นหลังผังสกิล 4 ภาพ, ภาพหน้าโหลด ld1 ld4 ld8 · ภาพเอฟเฟกต์ 36 ภาพไม่มีตัวนกฮูก ใช้ต่อได้ · ยังไม่มี: ท่านั่ง (hero_sit.js)"""),
 'croc': dict(
  title='จระเข้ ลุคใหม่ (นักล่าแห่งทะเลสาบ · Lake Predator)',
  who='the crocodile warrior in this picture', P='He', p='he', pos='his', weapon='harpoon',
  face="Keep his face exactly as in the picture: the same small fierce amber-gold eyes under the same heavy brow ridges, "
       "the same red scar across his snout and the same confident toothy grin with his jaws closed.",
  back_face={'NE': "We see him mostly from behind: the back of his head and the row of orange-gold spikes running down his "
                   "neck and back; of his face only the side of his long snout on the right, as in the picture; his face "
                   "never turns toward us.",
             'N': "We only see the back of his head and the row of orange-gold spikes running down his neck, his back and "
                  "his tail, as in the picture; his face never turns toward us."},
  keep={d: ("His fang necklace with the gold caps, the torn red sash with its cream stepped pattern, the thick rope belt "
            "with the netted gourd, the dark brown loincloth flap with its orange zigzag border, the navy-blue arm and leg "
            "wraps with their gold bands, the gold armbands, the orange-gold spikes along his back and tail, his long tail "
            "and the harpoon with its black-violet barbed obsidian head, its rope coil and its gold bands stay exactly the "
            "same.") for d in ('S', 'SE', 'E')}
       | {d: ("The torn red sash with its cream stepped pattern, the thick rope belt, the navy-blue arm and leg wraps with "
              "their gold bands, the gold armbands, the row of orange-gold spikes down his back and tail, his long tail and "
              "the harpoon with its black-violet barbed obsidian head, its rope coil and its gold bands stay exactly the "
              "same.") for d in ('NE', 'N')},
  spos=dict.fromkeys(DIRS, 'upright in one hand beside him, its gold end resting on the ground'),
  blink="; his eyes stay open for the whole clip",
  vis=" His arms and the whole harpoon stay visible beside his body during the whole thrust.",
  fmt={'pvis': ('', " His raised arms and the whole harpoon stay visible above his shoulders while he holds the pose."),
       'chin': (', lifting his chin proudly', '')},
  inframe="his whole body, his whole tail and the whole harpoon, from its obsidian head to its gold end, stay inside the frame.",
  nofx="No shadow, no flash, no glow, no sparkles, no particles, no smoke, no water, no splashes, no drops, no dust, no "
       "light trails, no streaks of colour, no motion lines, no magic effects, no symbols, no text.",
  act={
   'idle': "Idle loop of {who}. {facing} He stands in a heavy, relaxed, ready stance, the harpoon {spos}, his other hand a "
           "loose fist at his side, and breathes slowly: his big chest rises and falls, the torn red sash and the fang "
           "necklace stir a little, the rope coil on the harpoon sways and his long tail sways slowly on the ground{blink}. "
           "The last frame matches the first frame so the clip loops.",
   'walk': "Walk loop of {who}. {facing} He walks in place, like on a treadmill, toward the way he is facing: heavy, steady "
           "steps (about two steps per second) on his big clawed feet, the harpoon held upright in one hand beside him with "
           "its gold end just above the ground, bobbing a little with each step, his other arm swinging a little, the red "
           "sash swaying and his long, heavy tail swinging from side to side behind him. He does not move across the frame, "
           "he does not come closer to the camera or move away from it, and the ground does not move. The last frame "
           "matches the first frame so the clip loops.",
   'attack': "Harpoon thrust of {who}. {facing} He grips the harpoon with both hands and pulls it back beside his body in a "
             "short wind-up, the obsidian head pointing toward the way he is facing; then he steps into it and drives the "
             "harpoon straight forward toward the way he is facing in one powerful thrust, until his arms are fully "
             "stretched and the obsidian head is far in front of him at chest height; he holds that pose for a moment, then "
             "pulls the harpoon back, returns to his starting pose holding it upright beside him and stands still for the "
             "rest of the clip. The whole move takes about one second. His back foot stays in place.{vis} The harpoon stays "
             "straight and the same length, its head stays exactly as drawn, and the air around it stays empty and plain "
             "green in every frame. Clean outlines in every frame, no motion blur.",
   'buff': "Power pose of {who}. {facing} He plants his feet wide and raises the harpoon high above his shoulder with both "
           "hands, like a hunter ready to strike, the obsidian head pointing forward and up toward the way he is facing, his "
           "chest puffed out{chin}; he holds that pose still for about one second — he does not throw the harpoon — then "
           "lowers it, returns to his starting pose holding it upright beside him and stands still for the rest of the clip. "
           "His feet stay in place.{pvis} The raised harpoon and its rope coil stay inside the frame. Clean outlines in "
           "every frame, no motion blur."},
  dirname={'S': 'หน้าตรง', 'SE': 'เฉียงหน้า หันขวา', 'E': 'ข้าง หันขวา', 'NE': 'เฉียงหลัง หันขวา', 'N': 'หลัง'},
  actname={'idle': 'ยืน (idle · วนลูป)',
           'walk': 'เดิน (walk · วนลูป · เกมใช้ตอน Body Crush / Low Ambush / ถอยตั้งท่า Sunpiercer ด้วย)',
           'attack': 'แทงฉมวก (attack · ตีปกติ + สกิลแทงทุกท่า + สกิลงับ — เกมเล่นช่วงง้าง → แทงสุดแขน (เฟรมโดน) ซ้ำตอนแทงรัว)',
           'buff': 'ชูฉมวก (buff · สกิลร่าย บัฟ Tail Sweep Obsidian Rain อัลติ — เกมปล่อยสกิลที่เฟรมชูสุด)'},
  start='croc_{n}_{d}.png',
  header="""เจ้าของส่งชีตแบบ 3 'นักล่าแห่งทะเลสาบ' 2026-11-25 19:27 (ภาพเดียว ไม่มีข้อความ → ถือว่าเลือกแบบนี้) · ชีต `assets/heroes/croc/sheet_lake_predator.webp` · ภาพใหญ่ = หน้าเลือกตัวแล้ว · หน้าตา + พรอมต์ภาพยืน 5 มุม: `CROC_LOOK_PROMPTS_TH.md` หัวข้อ 'เลือกแล้ว'

## ลำดับงาน
1. **ภาพยืน 5 มุม** — พรอมต์ส่งในแชตแล้ว 2026-11-25 · รอภาพ → `assets/heroes/croc/view_S|SE|E|NE|N.webp`
2. **ภาพตั้งต้น** — ทำจากภาพยืนด้วยคำสั่งข้างล่าง แล้วส่งให้เจ้าของ
3. **คลิป 20 ตัว** — พรอมต์ในไฟล์นี้ แนบภาพตั้งต้นของทิศนั้นทุกคลิป

## ภาพตั้งต้น
- `croc_<n>_<ทิศ>.png` **1200×900 แนวนอน (4:3)** ไม่ใช่สี่เหลี่ยมจัตุรัส: ฉมวกยาวกว่าตัว ตอนแทงสุดแขนในมุมข้างปลายฉมวกพุ่งไปข้างหน้าเกือบ 1.3 เท่าความสูงตัว → ภาพ 900² แคบไป (บาสเต็ดเคยใช้ 480×640 แนวตั้ง เครื่องมือของเจ้าของเก็บสัดส่วนตามภาพ) · ht นับรวมฉมวกที่ตั้งข้างตัว (ฉมวกสูงกว่าหัวราว 1/3 ตัว) → ตัวจระเข้สูงราว 390 px = ~208 px ในคลิป 480p (แบบหมาป่าที่ขวานสูงกว่าหัว) · เท้าที่ 88 % แบบแรด / อนูบิส · **ตัวเลขนี้เป็นแผน วัดใหม่ตอนภาพยืนมาถึง** (สูงพอให้ชูฉมวกเหนือไหล่ กว้างพอให้แทงสุดแขนในมุมข้าง)
```
V=assets/heroes/croc; python3 -I tools/dir8cut.py startv <โฟลเดอร์> S=$V/view_S.webp SE=$V/view_SE.webp E=$V/view_E.webp NE=$V/view_NE.webp N=$V/view_N.webp size=1200x900 feet=.88 ht=520 clean=0
```
→ start_<ทิศ>.png → ตั้งชื่อใหม่ croc_1_S … croc_5_N · ทุกทิศใช้สเกลของมุมหน้า (ใส่ S ก่อนเสมอ) · clean=0 = ไม่ทาจุดเขียวในตัว (ชุดไม่มีสีเขียวเลย: ผ้าพันน้ำเงิน ≈ RGB 57, 63, 100 · ใบออบซิเดียน ≈ 75, 56, 73 · ช่องในห่วงเชือก ระหว่างแขนกับตัว ระหว่างขา เป็นพื้นหลังจริง)

## วิธีใช้
แนบภาพตั้งต้นของทิศนั้น + วางพรอมต์ทีละตัว → 4 คลิปต่อทิศ (ยืน · เดิน · แทงฉมวก · ชูฉมวก) · คลิปละ 3–5 วิ · ไม่ต้องทำทิศซ้าย (เกมกลับด้านเอง) · ส่งกลับเรียง S → SE → E → NE → N ทิศละ ยืน → เดิน → แทง → ชู (สลับได้ ดูเองว่าคลิปไหนเป็นท่าอะไร)

## กติกาที่อยู่ในทุกพรอมต์ (บทเรียนจากคลิปลิง / แอคโซลอเติล / มังกรลุคเดิม / แกะ / บาสเต็ด / ฮิปโป / จากัวร์ / หมาป่า / แรด)
- ประโยคบอกทิศขึ้นต้นทุกพรอมต์ กันโมเดลหมุนตัวหันหากล้อง (มุมหลังโดนบ่อย)
- ล็อกหน้า (ตาอำพัน สันคิ้วหนา แผลเป็นบนจมูก ยิ้มเห็นฟันแต่หุบปาก) ในมุมที่เห็นหน้า · มุมหลัง (NE, N) ใช้ประโยค 'เห็นแค่หลังหัวกับแนวหนาม หน้าไม่หันมา' แทน
- ท่ายืนมุมหน้า: **ลืมตาตลอดคลิป** (คลิปยืนของแรดหลับตาตลอดช่วงที่ขยับ · หมาป่า / จากัวร์ / บาสเต็ด / แกะ หลับตาเป็นช่วงยาว ต้องตัดทิ้ง)
- ล็อกของติดตัว: สร้อยเขี้ยวครอบทอง · ผ้าแดงลายขั้นบันได · เข็มขัดเชือก + น้ำเต้าในตาข่าย · ผ้าเตี่ยวน้ำตาลขอบซิกแซก · ผ้าพันแขนขาน้ำเงินกรม + แถบทอง · ปลอกแขนทอง · หนามส้มทองตามหลังกับหาง · หางยาว · ฉมวกหัวออบซิเดียนมีเงี่ยง เชือกขด แถบทอง
- เดินอยู่กับที่แบบลู่วิ่ง ~2 ก้าว/วิ ฉมวกตั้งในมือ ปลายด้ามลอยเหนือพื้น หางส่ายตาม · **ไม่เดินเข้าหา / ออกจากกล้อง** (คลิปเดินหน้าตรงของหมาป่าเดินเข้าหากล้องจนตัวโตขึ้น 1.4 เท่า)
- แทงฉมวก = จับสองมือ ดึงไปข้างตัว (ง้าง) แล้วก้าวพุ่งแทงตรงไปข้างหน้าจนแขนเหยียดสุด หัวฉมวกไกลสุดระดับอก (= เฟรมโดน) ค้างนิด ดึงกลับ ยืนนิ่งจนจบคลิป · ฉมวกตรง ยาวเท่าเดิม · **ไม่ใช้คำว่า attack / stab / strike ในพรอมต์** (คลิปแรกของจากัวร์: โมเดลวาดรอยฟัน แสงขาว ตัว X ทับท่า) + สั่งให้อากาศรอบฉมวกเป็นพื้นเขียวเปล่าทุกเฟรม · มุมหลังสั่งให้แขนกับฉมวกยังเห็นข้างตัว
- ชูฉมวก = ยืนกางขา ชูฉมวกสองมือเหนือไหล่แบบนักล่าเตรียมพุ่ง หัวฉมวกชี้ไปข้างหน้าเฉียงขึ้น อกผาย ค้างนิ่ง ~1 วิ (ไม่ขว้างออกไป) แล้ววางลง — เกมใช้ทั้งคลิปกับสกิลร่ายทุกท่า + Tail Sweep (เล่นเร็ว 2.2 เท่า หางเป็นภาพโค้ด) + Obsidian Rain (เล่นถึงจุดชูสุดตอนกระโดด แล้วต่อเฟรมแทงตอนปักลงพื้น)
- ห้ามเบลอ · ห้ามเส้นความเร็ว / สัญลักษณ์ (คลิปยืน NE ของฮิปโปมีเส้น '!' สีเหลือง) · ห้ามน้ำกระเซ็น น้ำหยด ประกาย แบบในชีต (เอฟเฟกต์ใส่ในเกม: `croc_art.js` + `croc_vfx3.js`) · กล้องนิ่งไม่ซูม · พื้นเขียวตลอด · ตัว + หาง + ฉมวกทั้งด้ามอยู่ในกรอบตลอด
- ไม่ระบุมือซ้าย / ขวาในพรอมต์คลิป (ภาพตั้งต้นบอกเองว่าฉมวกอยู่ฝั่งไหน)""",
  footer="""## ตอนคลิปมาถึง (โน้ตสำหรับแชตที่ทำต่อ)
- ตัดด้วย `tools/cliphero.py` + แผนใหม่ `tools/clips/croc_plan.json` (ดู `rhino_plan.json` / `bastet_plan.json`: loop ช่วงที่ลืมตา, เลือกเฟรมเลี่ยงรอยฟัน / น้ำ / แสงที่โมเดลแอบใส่, flipDirs ถ้ามีคลิปหันผิดฝั่ง, perDir ถ้าคลิปบางทิศถ่ายมาเล็ก / ใหญ่กว่า, "unstreak", "breath" ถ้าต้องใช้ช่วงยืนนิ่ง)
- **เขียนเป็นไฟล์ใหม่ `assets_croc.js`** (prefix ใหม่ เช่น CRK → CRK_SPR_META / CRK_SPR_ATLAS · อย่าใช้ CRC = ตารางสีของจระเข้ในโค้ด) + สลับเข้าใน index.html แบบ BST_ART เฉพาะ `?char=croc` (เช่น `?crkart=0` = ร่างเก่า) + รายการ document.write + ตาราง MB ของหน้าโหลด · **ห้ามเขียนทับ `assets.js`**: มันคือร่างชั่วคราวของจิ้งจอก อนูบิส สิงโต อีกา (และจระเข้ตอนนี้) + หมาป่าเก่า (`?wlfart=0`)
- **เวลาเฟรมต้องเท่า `assets.js` ทุกทิศ** (จระเข้ถูก bench กับเวลานี้) → จังหวะโดน / ปล่อยสกิลเท่าเดิม · เช็ก `python3 tools/fxlab.py hits croc` ก่อน / หลัง:
  - attack 12 เฟรม 900 ms · S [80,50,90,50,50,50,70,200,50,50,50,110] contact 6 (โดนที่ 370 ms) · SE [50,50,190,70,90,50,50,50,50,50,90,110] contact 4 (360 ms) · E [80,50,50,100,50,120,60,120,50,50,50,120] contact 6 (450 ms) · N [110,120,50,50,70,50,120,70,50,50,50,110] contact 6 (450 ms) · NE: atlas เดิมให้เกมเล่นแถว E แทน (atkRemap NE→E) → คลิป NE ใหม่ใช้เวลาเฟรม + contact ของ E แล้วตั้ง atkRemap {} (แบบบาสเต็ด)
  - **เฟรมที่เกมใช้จริงในท่าตี** (`crStrike` ใน index.html): เฟรม contact = แทงสุดแขน หัวฉมวกไกลสุด (ดาเมจ) · contact−3 = ง้างฉมวกไปข้างตัว (ค้าง 260 ms ตอน Temple Execution, 700 ms ตอน Sunpiercer ชาร์จแสงทอง, 60 ms ตอน Spear Thrust) · แทงรัว (Serpent Thrust ฯลฯ) เล่น contact−2 … contact+1 ซ้ำเร็ว 2.6 เท่า → แทงต้องเป็นเส้นตรงชัด ไม่เบลอ · งับ (Snap, Crushing Bite, Savage Jaw, Jaw Lock, Ripping Bite) ใช้คลิปเดียวกัน (ปากจระเข้ที่งับเป็นภาพโค้ด `JawSnap` ที่ตัวศัตรู) · Obsidian Rain ค้าง contact 120 ms ตอนปักลงพื้นหลังกระโดด · Death Roll = contact−1 → contact แล้ววนเฟรมแรกของท่าเดิน / ท่าโดนตี 8 ทิศ (`rollSeq`) แล้วค้าง contact 180 ms
  - buff 12 เฟรม 1.4 วิ peak 7 · S [170,50,50,230,50,110,390,50,50,50,50,150] (1,050 ms) · E [70,50,50,50,50,70,170,580,50,50,50,160] (510) · NE [80,60,50,50,50,50,120,160,480,60,60,180] (460) · N [130,50,50,50,50,110,260,450,60,50,50,90] (700) · SE 6 เฟรม [220×6] peak 3 (660) → เฟรม peak = ชูฉมวกสุด · Awakening ค้าง peak 600 ms
  - walk 8 × 100 ms (E สลับ 110 / 90) รอบละ 0.8 วิ · idle 12 เฟรม 2.4 วิ · hurt 7 เฟรม 550 ms · walk ใช้ตอน Body Crush (พุ่งชน), Low Ambush, Sunpiercer (เฟรม 0–3 ตอนถอยตั้งท่า)
- **socket:** `sockets` attack + buff ใส่ไว้ที่หัวฉมวก (cliphero 'orb' จับหัวออบซิเดียนม่วงดำ หรือ orbFix อ่านด้วยตา) · เอฟเฟกต์หอก v3 (`croc_vfx3.js` Lance / SpearLine) คำนวณจากตัวฮีโร่ + ทิศ ไม่ได้อ่านจุดนี้ ประกายตอนชาร์จ Sunpiercer ใช้ `spearTip()` (ระยะคงที่หน้าตัว)
- **ขนาด:** `CHAR_SCALE.croc` ตอนนี้ 1 (ร่างหมาป่า) · ทุกตัววัดเทียบความสูงตอนยืนของหมาป่าเก่า (S idle 196 cell px ที่สเกล atlas .55) ไม่นับฉมวก → แล้ว `HERO_SIZE.croc` .882 คูณต่อเอง (ตัวใหญ่กลุ่มเดียวกับแรด)
- **สีย้อม:** `CHAR_FILTER.croc` (ย้อมร่างหมาป่าเป็นเขียวเทา) → ตั้ง '' เมื่อมีร่างใหม่ (แบบ BST_ART / OW_ART)
- **หน้า HUD:** ตอนนี้ใช้หน้า default (หมาป่า) → ตัดหัวจาก view_S เป็น `assets/heroes/croc/face.webp` แล้วตั้ง window.HUD_FACE ใน installCroc (แบบลิง / แกะ / ฮิปโป / บาสเต็ด / แรด)
- **ปากจระเข้ในเอฟเฟกต์:** `croc_art.js` สกินธรรมดา 'n' ยังเป็นจานสีเขียว → เปลี่ยนเป็นน้ำตาลโคลน / ครีมแทน ให้ตรงตัวใหม่ (สกิน g ทอง / i เหล็ก คงไว้)
- หน้าเลือกตัว = ภาพใหญ่ของชีตแล้ว (`select.webp`, SELV croc 2)
- ยังเป็นลุคเก่า: ไอคอนสกิล 49 (+ ex_ 18 เป็นโค้ด), พื้นหลังผังสกิล 4 ภาพ (`SKILL_BG_ALL.croc` 012–015), ภาพหน้าโหลด ld1 ld2 ld8 · ยังไม่มี: ท่านั่ง (hero_sit.js)"""),
}

# Wolf 2.5D (owner 2026-11-26 'แบบเกมแรคนารอค3'): the same Fenrir's Heir as 'wolf', drawn by ChatGPT as a toon-shaded
# 3D game model seen from above. Built from the 'wolf' entry; `look` replaces the shared 'chibi … not 3D' sentence.
HEROES['wolf25'] = dict(HEROES['wolf'],
  title="หมาป่าขาว 2.5D (ทายาทเฟนรีร์ แบบโมเดล 3D มองจากด้านบน · Fenrir's Heir 2.5D)",
  look="Keep the exact look of the picture: a stylized 3D game model with soft toon shading and clean dark-brown outlines, "
       "the same colours and the same fur, cloth, leather and steel textures — not photorealistic and not a flat drawing. "
       "The camera keeps looking down at him from above at the same angle as in the picture.",
  keep={d: ("His thick mane of white fur, the braid with its silver rings, the crimson fur-lined cape with the cream fur collar "
            "and the round silver brooch, the dark-steel wolf-head pauldron, the deep-navy tunic with the silver knotwork band, "
            "the round silver belt buckle, the chain wrapped round his forearm, the leather bracers, the fur-cuffed boots, "
            "his huge bushy white tail and the greataxe with its silver blade and dark-iron wolf head stay exactly the same.")
        for d in ('S', 'SE')}
       # E (08:22 view): only his near side shows — no pauldron, brooch or chain (they are on his far side)
       | {'E': ("His thick mane of white fur, the braid with its silver ring, the crimson fur-lined cape with the cream fur "
                "collar over his shoulder, the deep-navy tunic with the silver knotwork panel, the belt with its round silver "
                "buckle, the leather bracer, the fur-cuffed boots, his huge bushy white tail and the greataxe with its silver "
                "blade and dark-iron wolf head stay exactly the same.")}
       | {d: ("His thick mane of white fur, the braid with its silver rings, the crimson cape with the cream fur collar, the "
              "dark-steel wolf-head pauldron, the back of the navy tunic and the belt, the chain wrapped round his forearm, "
              "the fur-cuffed boots, his huge bushy white tail and the greataxe with its silver blade stay exactly the same.")
          for d in ('NE', 'N')},
  # the side view hides his far arm (chain) and shows the axe held out in front of him, not beside him
  spos=dict(HEROES['wolf']['spos'], E='upright in his hand in front of him, its end resting on the ground'),
  fmt=dict(HEROES['wolf']['fmt'],
           oarm={d: ('his other arm out of sight behind his body, as in the picture' if d == 'E' else
                     'his other fist clenched at his side with the chain wrapped round his forearm') for d in DIRS},
           sway={d: ('the cape sways a little' if d == 'E' else 'the loose end of the chain and the cape sway a little')
                 for d in DIRS},
           carry={d: ('in front of him' if d == 'E' else 'beside him') for d in DIRS},
           warm={d: ('his other arm swinging a little, mostly hidden behind his body' if d == 'E' else
                     'his other arm swinging a little with the chain') for d in DIRS}),
  blink=", and his ears twitch once; his eyes stay open for the whole clip",
  nofx="No shadow, no flash, no glow, no sparkles, no particles, no smoke, no snow, no dust, no light trails, no streaks of "
       "colour, no motion lines, no red energy, no ice, no lightning, no runes in the air, no magic effects, no symbols, no "
       "text; the ice-blue pattern on the axe blade never lights up.",
  act=dict(HEROES['wolf']['act'],
   idle="Idle loop of {who}. {facing} He stands tall in a firm, ready stance, the greataxe {spos}, {oarm}, and breathes "
        "slowly: his chest rises and falls, the fur of his mane and collar stirs, {sway} and his big bushy tail sways "
        "slowly{blink}. The last frame matches the first frame so the clip loops.",
   walk="Walk loop of {who}. {facing} He walks in place, like on a treadmill, toward the way he is facing: firm, springy "
        "steps (about two steps per second) in his fur-cuffed boots, the greataxe carried upright in his hand {carry} "
        "with its end just above the ground, {warm}, his cape and his bushy tail bouncing behind him. He does not move across the frame, he does not come closer to the camera or move away from "
        "it, and the ground does not move. The last frame matches the first frame so the clip loops.",
   attack="Overhead axe chop of {who}. {facing} He lifts the greataxe up and back over his shoulder in a short wind-up, "
          "then swings it down and forward toward the way he is facing in one powerful chop until the axe head is low in "
          "front of him, just above the ground without touching it; he holds that pose for a moment, then lifts the axe "
          "back up, returns to his starting pose and stands still for the rest of the clip. The whole move takes about one "
          "second. His feet stay in place.{vis} The axe stays exactly as drawn — the same long greataxe in every frame, it "
          "never gets shorter, bends or changes shape — and the air around it stays empty and plain green in every frame. "
          "Clean outlines in every frame, no motion blur.",
   buff=HEROES['wolf']['act']['buff'].replace(
          "The raised axe stays inside the frame.",
          "The raised axe stays inside the frame and keeps its full length and shape in every frame — it never gets "
          "shorter, bends or changes.")),
  start='wolf25_{n}_{d}.png',
  header="""เจ้าของ 2026-11-26 07:39 "อยากลองปรับสไปร้หมาป่าใหม่ให้เป้นแบบ2.5d แบบเกมแรคนารอค3" → 07:47 "รูปหมาป่าใช้แบบเก่าก่อนไม่ใช่จิบิ" → 08:01 ส่งรูปทดสอบมุมเฉียงหน้ามา + "ขอพร้อมมุมอื่นและอยากให้มีพื้นที่สีเขียวเพิ่มเพื่อเอาไปทำวีดีโอ" · ตัวเดียวกับหมาป่าในเกมตอนนี้ (ทายาทเฟนรีร์ตัวโต) แต่เรนเดอร์เหมือนโมเดล 3D ลงเงาการ์ตูน เส้นขอบแบบวาดมือ มองจากด้านบน · หน้าตา + พรอมต์ภาพยืน: `WOLF_LOOK_PROMPTS_TH.md` หัวข้อ 'ลอง 2.5D แบบ Ragnarok 3' · คลิปลุคเดิมอยู่ที่ `WOLF_CLIP_PROMPTS_TH.md` (ห้ามใช้กับภาพ 2.5D: ประโยคลุคของมันสั่ง 'not 3D')

## ลำดับงาน
1. **ภาพยืน 5 มุม (2.5D)** — ✓ ครบ 2026-11-26 08:22 (เจ้าของส่ง S · E · NE · N + SE ชุดใหม่มาพร้อมกัน: 1254² พื้นเขียว ตัวสูง 58–62 % ของภาพ ทุกมุมหันขวา ไม่มีสีเขียวบนตัว — จุดเขียวในตัวคือช่องในห่วงโซ่ / ใต้แขน / ระหว่างขา = พื้นหลังจริง · ขนปลายพู่ข้างด้ามขวานในมุม S ติดเขียวจางๆ ไม่กี่จุด cliphero ดึงเขียวออกเองตอนตัด) → `assets/heroes/wolf/view25_<ทิศ>.webp` · รูปทดสอบ SE (08:01 ตัวเต็มกรอบ 96 %) เก็บเป็น `view25_SE_test.webp`
2. **ภาพตั้งต้น** — ✓ ครบ 5 ทิศ ส่งแล้ว 08:30 (SE ทำใหม่จากภาพ SE ชุดใหม่ให้เข้าชุดกับอีก 4 มุม · ภาพ SE แรกที่ส่ง 08:10 ทำจากรูปทดสอบ ตัวสูงเท่ากัน ใช้แทนกันได้)
3. **คลิป 20 ตัว** — รอ · ในเกมยังไม่เปลี่ยนอะไร (ร่างที่เล่นอยู่ = `assets_wolf.js` ลุคเดิม)

## ภาพตั้งต้น
- `wolf25_<n>_<ทิศ>.png` 1024×1024 · ตัวสูง 490 px = ~48 % ของภาพ (เจ้าของขอที่ว่างเพิ่ม): เหนือหัวว่าง .84 เท่าตัวทุกมุม · ซ้าย .64–.68 · ขวา .60–.63 (รูปทดสอบ SE .70 / .65) — ลุคเดิมใช้ 900² ht 480 = .69 / .59 / .54 · ในคลิป 480p ตัวสูง ~230 px (544p ~260)
- ภาพจาก ChatGPT แต่ละมุมขนาดไม่เท่ากัน (รูปทดสอบตัวเต็มกรอบ · มุมอื่นสั่งให้ตัวสูงแค่ครึ่งภาพ) → **รันทีละมุม** ทุกมุมได้ตัวสูง 490 px เท่ากัน (startv ตั้งสเกลจากภาพแรกของคำสั่ง):
```
V=assets/heroes/wolf; for d in S SE E NE N; do python3 -I tools/dir8cut.py startv <โฟลเดอร์> $d=$V/view25_$d.webp size=1024 feet=.88 ht=490 clean=0; done
```
→ start_<ทิศ>.png → ตั้งชื่อใหม่ wolf25_1_S … wolf25_5_N · clean=0 (ชุดไม่มีสีเขียว) · 'ht' วัดจากปลายหูถึงพื้นรองเท้า (หรือยอดขวานถ้าสูงกว่าหู)

## วิธีใช้
แนบภาพตั้งต้นของทิศนั้น + วางพรอมต์ทีละตัว → 4 คลิปต่อทิศ (ยืน · เดิน · ฟันขวาน · ชูขวาน) · คลิปละ 3–5 วิ · ไม่ต้องทำทิศซ้าย (เกมกลับด้านเอง) · ส่งกลับเรียง S → SE → E → NE → N ทิศละ ยืน → เดิน → ฟัน → ชู (สลับได้ ดูเองว่าคลิปไหนเป็นท่าอะไร) · ทำทิศ SE ก่อนได้เลย ไม่ต้องรอภาพมุมอื่น

## กติกาที่อยู่ในทุกพรอมต์ (ต่อจากหมาป่าลุคเดิม + บทเรียนแรด / อนูบิส)
- **ประโยคลุค 2.5D** (คีย์ `look` ของสคริปต์) แทนประโยค 'chibi … not 3D' ของตัวอื่น: โมเดล 3D ลงเงาการ์ตูน เส้นขอบน้ำตาลเข้ม สีและพื้นผิว (ขน ผ้า หนัง เหล็ก) เดิม ไม่สมจริง ไม่แบน + กล้องมองลงจากด้านบนมุมเดิมตลอดคลิป
- ยืน: ตาเปิดตลอดคลิป ไม่กะพริบ (คลิปแรดหลับตาตอนขยับ · คลิปหมาป่าเดิมช่วงหลับตาต้องตัดทิ้ง) · เดิน: ไม่เดินเข้าหา / ถอยห่างกล้อง (คลิป S หมาป่าเดิมเดินเข้ากล้อง ×1.4) · ฟัน: หัวขวานหยุดเหนือพื้นไม่แตะ (คลิปเดิมฟันลงพื้นแล้วมีน้ำแข็ง / แสงขาว / ดาวแตกติดมา) · ลายรูนฟ้าบนใบขวานห้ามสว่างขึ้น · ห้ามหิมะ ฝุ่น เส้นความเร็ว สัญลักษณ์
- โซ่: ภาพ 2.5D วาดเป็นโซ่พันรอบแขนท่อนล่างซ้าย ปลายขาดห้อยลงมา (ไม่ใช่กำไลเหล็ก) → พรอมต์เขียนตามภาพ
- มุมข้าง E (ภาพ 08:22): เห็นแค่ซีกขวาของตัว — แขนซ้าย โซ่ บ่าเกราะหัวหมาป่า เข็มกลัด อยู่ฝั่งไกล ภาพไม่เห็น → พรอมต์ E ไม่สั่งให้คงของพวกนี้ และบอกว่าแขนอีกข้างอยู่หลังตัว (กันโมเดลวาดเพิ่มผิดข้าง) · ขวานถืออยู่ข้างหน้าตัว ไม่ใช่ข้างตัว (คีย์ fmt oarm / sway / carry / warm + spos E)
- มุมหลัง NE / N: เปียกับห่วงเงินยังเห็นข้างหัว → อยู่ในรายการของที่ต้องคง
- เหมือนหมาป่าเดิม: ประโยคบอกทิศขึ้นต้น · ล็อกหน้า / ของติดตัว · ไม่ใช้คำ attack / slash · ฟัน = ยกข้ามไหล่แล้วฟันลงทแยงไปข้างหน้า · ชูขวานสองมือ **ด้ามขนานพื้น** ค้าง ~1 วิ · ไม่ระบุมือซ้าย / ขวา (ภาพตั้งต้นบอกเอง)""",
  footer="""## ✓ คลิปเข้าเกมแล้ว (2026-11-26 11:44)
- `assets_wolf25.js` = `python3 -I tools/cliphero.py tools/clips/wolf25_plan.json assets_wolf25.js WLF` แล้ว `python3 -I tools/headtrack.py assets_wolf25.js WLF_ tools/clips/wolf25_head.json` — หมาป่าค่าเริ่มต้นในเกม · `?wlf25=0` = ร่างแบนเดิม · เวลาเฟรมทุกแถวเท่าร่างแบน (เวลาโดนตีเท่าเดิม) · คลิปฟัน NE ของจริงมาแล้ว → ไม่ยืมแถว E
- ท่าเสริม (กระโดด หอน ชาร์จ พุ่ง การ์ด หมุน นั่ง): `WOLF25_POSE_PROMPTS_TH.md` หัวข้อ 'สร้างแล้ว'

## ตอนคลิปมาถึง (โน้ตสำหรับแชตที่ทำต่อ)
- แผนใหม่ `tools/clips/wolf25_plan.json` คัดลอกจาก `wolf_plan.json` (เวลาเฟรมทุกแถวคัดมาจาก `assets.js` แล้ว: attack contact S 6 · SE 4 · E 6 · N 6 · buff peak 7 / SE 6 เฟรม peak 3 · walk 100 ms · idle 200 ms · hurt 550 ms) → ดาเมจ / จังหวะเท่าเดิม เช็ก `python3 tools/fxlab.py hits wolf` ก่อน / หลัง · เลือกเฟรมเลี่ยงช่วงหลับตา / เอฟเฟกต์ที่โมเดลแอบใส่แบบรอบก่อน ("frames", "breath", "unstreak")
- ภาพมองจากด้านบน: เท้าหดนิดหน่อย ตัวดูเตี้ยกว่ามุมสายตา → ตั้ง cellScale ใหม่ให้ตัวยืน idle S บนจอสูงเท่าร่างปัจจุบัน (HERO_SIZE.wolf ไม่ต้องแก้)
- เขียนเป็นไฟล์แยก (เช่น `assets_wolf25.js` prefix W25) + สวิตช์ URL ให้เจ้าของเทียบกับร่างปัจจุบันในเกมก่อนตัดสินใจสลับ · แล้วรัน `tools/headtrack.py` (จุดหัวให้ปีกแฟชั่น) · ตำแหน่งหัวขวาน: cliphero "axe" หาก้อนฟ้าบนใบขวาน (ใบ 2.5D มีลายปมฟ้าใหญ่กว่าเดิม เช็กให้จับกลางใบทุกเฟรม · "axeFix" ช่วยเฟรมเบลอ)
- ถ้าขาดคลิปฟันมุมเฉียงหลัง (NE) แบบรอบก่อน → ยืมแถว E (atkRemap NE→E) เหมือนเดิม
- หน้า HUD / ภาพหน้าเลือกตัว: ตัดจากภาพ 2.5D ได้ถ้าเจ้าของเลือกใช้ลุคนี้""")

# Jaguar 2.5D (owner 2026-11-26 09:49 'อยากอัพเกรดดีไซน์เป็น2.5d แบบ ragnarok3 อันนี้ตัวอย่างของหมาป่าที่ทำมาแล้ว'): the same
# Eclipse Dancer as 'jaguar', drawn as a toon-shaded 3D game model seen from above like 'wolf25'. Built from the 'jaguar'
# entry; `look` replaces the shared 'chibi … not 3D' sentence; eyes open / no walking toward the camera / no symbols
# (lessons of the rhino, wolf and hippo clips). Re-check face / back lines against the 2.5D views when they come.
HEROES['jaguar25'] = dict(HEROES['jaguar'],
  title='เสือจากัวร์ 2.5D (นางระบำสุริยคราส แบบโมเดล 3D มองจากด้านบน · Eclipse Dancer 2.5D)',
  who='the jaguar dancer in this picture',
  look="Keep the exact look of the picture: a stylized 3D game model with soft toon shading and clean dark-brown outlines, "
       "the same colours and the same fur, hair, cloth, gold and obsidian textures — not photorealistic and not a flat "
       "drawing. The camera keeps looking down at her from above at the same angle as in the picture.",
  keep=dict(HEROES['jaguar']['keep'],
            **{d: ("The gold sun-disc ornament with its feathers and bell, her long dark-chocolate ponytail, the big crimson "
                   "bow of her sash, the crimson-and-cream skirt with gold borders, the curved black obsidian daggers with "
                   "gold crescent guards and her long spotted tail stay exactly the same.") for d in ('NE', 'N')}),
  blink=", and her round ears twitch once; her eyes stay open for the whole clip",
  nofx="No shadow, no flash, no glow, no sparkles, no particles, no smoke, no dust, no light trails, no streaks of colour, "
       "no motion lines, no magic effects, no symbols, no text.",
  act=dict(HEROES['jaguar']['act'],
   walk="Walk loop of {who}. {facing} She walks in place, like on a treadmill, toward the way she is facing: light, "
        "graceful dancer's steps on the balls of her feet (about two steps per second) with a small sway of her hips, the "
        "daggers held {spos} swinging a little with her arms, her ponytail and skirt bouncing and her tail swaying behind "
        "her. She does not move across the frame, she does not come closer to the camera or move away from it, and the "
        "ground does not move. The last frame matches the first frame so the clip loops.",
   buff="Proud dagger pose of {who}. {facing} She raises one dagger high above her head, the blade pointing to the sky, "
        "and holds the other dagger low behind her{chin}; she holds that pose still for about one second, then lowers the "
        "raised dagger back down to her side, returns to her starting pose and stands still for the rest of the clip. Her "
        "feet stay in place. The raised dagger stays inside the frame. The daggers are plain black stone, and the air "
        "around them stays empty and plain green in every frame. Clean outlines in every frame, no motion blur."),
  start='jaguar25_{n}_{d}.png',
  header="""เจ้าของ 2026-11-26 09:49 ส่งภาพตั้งต้นหมาป่า 2.5D 5 ทิศ + "อยากอัพเกรดดีไซน์เป็น2.5d แบบ ragnarok3 อันนี้ตัวอย่างของหมาป่าที่ทำมาแล้ว" → ทำจากัวร์ทางเดียวกับหมาป่า (ภาพ → คลิป) · ตัวเดียวกับจากัวร์ในเกมตอนนี้ (นางระบำสุริยคราส) แต่เรนเดอร์เหมือนโมเดล 3D ลงเงาการ์ตูน เส้นขอบแบบวาดมือ มองจากด้านบน มุมกล้อง / แสงเดียวกับหมาป่า 2.5D · หน้าตา + พรอมต์ภาพยืน: `JAGUAR_LOOK_PROMPTS_TH.md` หัวข้อ '2.5D แบบ Ragnarok 3' · คลิปลุคเดิมอยู่ที่ `JAGUAR_CLIP_PROMPTS_TH.md` (ห้ามใช้กับภาพ 2.5D: ประโยคลุคของมันสั่ง 'not 3D')

## ลำดับงาน
1. **ภาพยืน 5 มุม (2.5D)** — ส่งพรอมต์แล้ว 2026-11-26 (กล่อง 1 มุม SE เป็นรูปทดสอบ แนบรูปหมาป่า 2.5D เป็นตัวอย่างลุค · กล่อง 2–5 แนบรูป SE ที่ได้) → รอภาพ → เก็บเป็น `assets/heroes/jaguar/view25_<ทิศ>.webp`
2. **ภาพตั้งต้น** — ตัดจากภาพ 5 มุม (คำสั่งข้างล่าง) เป็น `jaguar25_1_S.png … jaguar25_5_N.png` (ไม่เก็บในรีโป)
3. **คลิป 20 ตัว** — พรอมต์ในไฟล์นี้ แนบภาพตั้งต้นของทิศนั้นทุกคลิป · ส่งในแชตแล้ว 2026-11-26 11:14 (เจ้าของถาม 'ขอพร้อมทำวีดีโอต่อหรือใข้พร้อมเดิมได้' → พรอมต์เดิมใช้ไม่ได้ เพราะสั่ง 'not 3D') ก่อนภาพ 2.5D มาถึงผม: ประโยคหน้า / ด้านหลังมาจากคลิปลุคเดิมที่ใช้ได้แล้ว (พรอมต์ภาพ 2.5D สั่งให้หันตัว วางมีด เครื่องประดับ ผม หาง ตามภาพยืนลุคเดิม) → ภาพมุมไหนต่างไป (เช่นมุมเฉียงหลังเห็นตา) แก้ประโยคมุมนั้นแล้วส่งใหม่ · ถ้าเจ้าของไม่ส่งภาพมาตัด ใช้ภาพ 2.5D ตรงๆ ได้เมื่อตัวสูงไม่เกินครึ่งภาพ (ขนาดตัวที่ต่างกันแต่ละมุมแก้ทีหลังด้วย cliphero `perDir`)

## ภาพตั้งต้น (แผน — วัดจริงตอนภาพมา)
- `jaguar25_<n>_<ทิศ>.png` 1024×1024 แบบหมาป่า 2.5D · ตัวสูง ~490 px (~48 % ของภาพ วัดจากยอดหางม้าถึงเท้า) เท้าที่ 88 % · ภาพจาก ChatGPT แต่ละมุมขนาดไม่เท่ากัน → **รันทีละมุม** ทุกมุมได้ตัวสูงเท่ากัน · ผมเธอฟูยาว ถ้ามุมข้างผมล้นกรอบให้ลด ht
```
V=assets/heroes/jaguar; for d in S SE E NE N; do python3 -I tools/dir8cut.py startv <โฟลเดอร์> $d=$V/view25_$d.webp size=1024 feet=.88 ht=490 clean=0; done
```
→ start_<ทิศ>.png → ตั้งชื่อใหม่ jaguar25_1_S … jaguar25_5_N · clean=0 (ช่องระหว่างแขน มีด ผม เป็นพื้นหลังจริง) · เช็กสีเทอร์ควอยซ์ (ต้องน้ำเงิน ≥ เขียว แบบภาพยืนลุคเดิม 20,193,195)

## วิธีใช้
แนบภาพตั้งต้นของทิศนั้น + วางพรอมต์ทีละตัว → 4 คลิปต่อทิศ (ยืน · เดิน · ฟันมีดคู่ · ชูมีด) · คลิปละ 3–5 วิ · ไม่ต้องทำทิศซ้าย (เกมกลับด้านเอง) · ส่งกลับเรียง S → SE → E → NE → N ทิศละ ยืน → เดิน → ฟัน → ชู (สลับได้)

## กติกาที่อยู่ในทุกพรอมต์ (ต่อจากจากัวร์ลุคเดิม + บทเรียนหมาป่า 2.5D / แรด / ฮิปโป)
- **ประโยคลุค 2.5D** (คีย์ `look`) แทนประโยค 'chibi … not 3D': โมเดล 3D ลงเงาการ์ตูน เส้นขอบน้ำตาลเข้ม สีและพื้นผิว (ขน ผม ผ้า ทอง ออบซิเดียน) เดิม ไม่สมจริง ไม่แบน + กล้องมองลงจากด้านบนมุมเดิมตลอดคลิป
- ยืน: ตาเปิดตลอดคลิป ไม่กะพริบ (คลิปแรดหลับตาตอนขยับ) · เดิน: ไม่เดินเข้าหา / ถอยห่างกล้อง (คลิป S หมาป่าเดินเข้ากล้อง ×1.4) · ห้ามเส้นความเร็ว ฝุ่น สัญลักษณ์ (คลิปฮิปโปมีเส้น '!' เหลือง)
- มุมหลัง NE / N: โบว์ผ้าคาดแดงใหญ่ด้านหลังเอว (เห็นในภาพยืนลุคเดิม) อยู่ในรายการของที่ต้องคง
- ชูมีด: ชื่อท่า 'Proud dagger pose' (ไม่ใช้ 'Spell cast' ของลุคเดิม) + 'มีดเป็นหินดำ อากาศรอบมีดว่าง พื้นเขียว' เหมือนท่าฟัน เพราะคลิปชูมีดลุคเดิมมุม S / N มีโค้งแสงแดง / ขาวเหลืองติดมาตอนยกมีด (ต้องใช้เฟรมลดมีดเล่นกลับ)
- เหมือนจากัวร์ลุคเดิม: ประโยคบอกทิศขึ้นต้น · ล็อกหน้า / ของติดตัว · ฟันมีดคู่ = ยกมีดสองเล่มเหนือหัวแล้วเหวี่ยงลงไปข้างหน้า ไม่ใช้คำ attack / slash / X (ดึงเอฟเฟกต์มา) · ชูมีดเล่มเดียวเหนือหัว อีกเล่มลดต่ำไว้ข้างหลัง ค้าง ~1 วิ · ไม่ระบุมือซ้าย / ขวา""",
  footer="""## ตอนคลิปมาถึง (โน้ตสำหรับแชตที่ทำต่อ)
- แผนใหม่ `tools/clips/jaguar25_plan.json` คัดลอกจาก `jaguar_plan.json` (เวลาเฟรมทุกแถว = atlas ตอนนี้: attack contact 6 / SE 4 · buff peak 7 / SE 6 เฟรม × 220 peak 3 · walk 8 × 100 E 110/90 · idle 12 เฟรม 2.4 วิ · hurt 7 เฟรม 550 ms (`stateDur`)) → ดาเมจ / จังหวะเท่าเดิม เช็ก `python3 tools/fxlab.py hits jaguar` ก่อน / หลัง (FXSEED + o.sure) · socket ใบมีด = ตัวเลือก `blade` (สีม่วงดำ ยาวบาง: เช็กว่าเงาโมเดล 3D ไม่ทำให้จับผิด) · `deglow` / `unstreak` / `frames` / `breath` ตามคลิป
- เขียนเป็นไฟล์แยก (เช่น `assets_jaguar25.js` prefix J25) + สวิตช์ URL เทียบกับร่างปัจจุบันก่อนเจ้าของตัดสินใจสลับ · ภาพมองจากด้านบน เท้าหดนิดหน่อย → ตั้ง cellScale / CHAR_SCALE ให้ตัวยืน idle S บนจอสูงเท่าร่างปัจจุบัน · char_jaguar_fx.js ขยายจุดมีดตาม CHAR_SCALE (s2r) อยู่แล้ว
- **ท่าพิเศษ** (`jaguar_pose.js`: pounce dash guard roar cast throw spin) อยู่ใน atlas ปัจจุบัน → atlas ใหม่ที่ยังไม่มีท่าเหล่านี้ jaguar_pose.js ปิดตัวเอง (เช็ก SPR_META.states.pounce / spin) = กลับไปใช้เฟรมคลิป · จะได้ท่าคืนต้องวาด 8 แผ่นใหม่ในลุค 2.5D (แนบแผ่นเดิม `assets/heroes/jaguar/poses/<ท่า>.webp` + รูป 2.5D, ตำแหน่งท่าเดิม) แล้วรัน spec `tools/clips/jaguar_<ท่า>.json` กับ atlas ใหม่ (แก้ js / prefix / scale / anchors) · ท่านั่ง (`assets/sit/jaguar_*`, hero_sit.js) ยังเป็นลุคแบน ต้องทำใหม่ด้วย
- หน้า HUD / ภาพหน้าเลือกตัว: ตัดจากภาพ 2.5D ได้ถ้าเจ้าของเลือกใช้ลุคนี้""")

# Rhino 2.5D (owner 2026-11-26 'ขอพร้อมดีไซน์แรดเป็นแบบ2.5d' → SE picture → 'พร้อมเคลื่อนไหวใช้อันเดิมได้เลยไหม'): the same Glacier
# Titan as 'rhino', drawn as a toon-shaded 3D game model seen from above like 'wolf25' / 'jaguar25'. Built from the 'rhino'
# entry by text replacement (mane = rust-orange as drawn in view25_SE) + `look`; eyes open, no walking toward the camera,
# fists stop just above the ground (the flat clips baked ice bursts / flashes into the blow), no symbols.
def _r25(v):
    if isinstance(v, str): return v.replace('shaggy chestnut mane', 'shaggy rust-orange mane')
    if isinstance(v, dict): return {k: _r25(x) for k, x in v.items()}
    return v
HEROES['rhino25'] = dict(_r25(HEROES['rhino']),
  title='แรดขนยาว 2.5D (ไททันธารน้ำแข็ง แบบโมเดล 3D มองจากด้านบน · Glacier Titan 2.5D)',
  look="Keep the exact look of the picture: a stylized 3D game model with soft toon shading and clean dark-brown outlines, "
       "the same colours and the same hide, wool, iron, copper, cloth and ice textures — not photorealistic and not a flat "
       "drawing. The camera keeps looking down at him from above at the same angle as in the picture.",
  blink=", and his ears twitch once; his eyes stay open for the whole clip",
  nofx=HEROES['rhino']['nofx'].replace('no speed lines,', 'no speed lines, no motion lines, no symbols,'),
  act=dict(HEROES['rhino']['act'],
   walk=HEROES['rhino']['act']['walk'].replace("He does not move across the frame and the ground",
        "He does not move across the frame, he does not come closer to the camera or move away from it, and the ground"),
   attack=HEROES['rhino']['act']['attack'].replace("until both fists touch the ground just in front of his feet",
        "until both fists stop just above the ground in front of his feet, without touching it")),
  start='rhino25_{n}_{d}.png',
  header="""เจ้าของ 2026-11-26 ขอแรดแบบ 2.5D (ทางเดียวกับหมาป่า / จากัวร์: ภาพ → คลิป) · ภาพ SE มาแล้ว `assets/heroes/rhino/view25_SE.webp` (แผงขนออกส้มสนิม) · พรอมต์ภาพอีก 4 มุมส่งแล้ว · เจ้าของถาม 'พร้อมเคลื่อนไหวใช้อันเดิมได้เลยไหม' → ไม่ได้ (ชุดเดิมสั่ง 'chibi … not 3D') ใช้ไฟล์นี้ · หน้าตา + พรอมต์ภาพ: `RHINO_LOOK_PROMPTS_TH.md` หัวข้อ '2.5D แบบ Ragnarok 3'

## ภาพตั้งต้น
- `rhino25_<n>_<ทิศ>.png` 1024×1024 · ตัวสูง ~490 px เท้าที่ 88 % · **รันทีละมุม** ให้ทุกมุมตัวสูงเท่ากัน (ภาพจาก ChatGPT ขนาดไม่เท่ากัน)
```
V=assets/heroes/rhino; for d in S SE E NE N; do python3 -I tools/dir8cut.py startv <โฟลเดอร์> $d=$V/view25_$d.webp size=1024 feet=.88 ht=490 clean=0; done
```

## ต่างจากชุดเดิม
- ประโยคลุค 2.5D (คีย์ `look`) + กล้องมองลงจากด้านบนมุมเดิม · แผงขน 'rust-orange' ตามภาพ 2.5D
- ยืน: ตาเปิดตลอดคลิป (คลิปเดิมหลับตาตอนขยับ) · เดิน: ไม่เข้าหา / ถอยห่างกล้อง · ทุบ: หมัดหยุดเหนือพื้นนิดเดียว ไม่แตะพื้น (คลิปเดิมมีน้ำแข็งแตก / แสงขาวติดมา) · ห้ามเส้นความเร็ว / สัญลักษณ์""",
  footer="""## ตอนคลิปมาถึง
- `tools/clips/rhino25_plan.json` คัดลอกจาก `rhino_plan.json` (เวลาเฟรม / contact / buff peak เดิมทุกทิศ) → ไฟล์แยก (เช่น `assets_rhino25.js`) + สวิตช์ URL เทียบกับร่างปัจจุบัน · เช็ก `tools/fxlab.py hits rhino` ก่อน / หลัง · ซ็อกเก็ต = คริสตัลข้อนิ้ว · cellScale ให้ idle S สูงเท่าเดิม
- รูปหมัด rx_* ของเอฟเฟกต์ v3 เป็นลุคแบน""")

# Ronin Cat 2.5D = Nekomata Wanderer (owner 2026-11-26 19:58 picked design 4 'ออกแบบเป็น 2.5d' → 20:22 his 5 standing views
# + 'ขอพร้อมทำวีดีโอหน่อย เอาแค่พร้อมนะ รูปที่ส่งให้ยังไม่ต้องเอาไปทำอะไร'). There is no flat 'cat' entry, so this one is
# complete. He attaches his own 2.5D views as the first frames (no start frames cut); every view sentence below follows those
# pictures (where the mask, the hilt, the hat and BOTH tails are). Lessons kept: 2.5D look, eyes open, no walking toward the
# camera, no attack / slash words, plain green air round the blade, the sheet's wind lines / petals / fire never drawn.
HEROES['cat25'] = dict(
  title='แมวโรนิน 2.5D (เนโกะมาตะพเนจร แบบโมเดล 3D มองจากด้านบน · Nekomata Wanderer 2.5D)',
  who='the two-tailed cat swordsman in this picture', P='He', p='he', pos='his', weapon='katana',
  look="Keep the exact look of the picture: a stylized 3D game model with soft toon shading and clean dark-brown outlines, "
       "the same colours and the same fur, straw, cloth, rope and lacquer textures — not photorealistic and not a flat "
       "drawing. The camera keeps looking down at him from above at the same angle as in the picture.",
  face="Keep his face exactly as in the picture: the same half-closed golden-yellow eyes with the small red marks at their "
       "outer corners, the same white blaze down his grey tabby face, the same small pink nose and whiskers and the same "
       "calm, sly little smile, mouth closed.",
  back_face={'NE': "We see him mostly from behind: the back of his head with both pointed ears and his shaggy grey mane, and "
                   "only the edge of one cheek with its whiskers, as in the picture; his face never turns toward us.",
             'N': "We only see the back of his head with both pointed ears and his shaggy grey mane above the big straw hat, "
                  "as in the picture; his face never turns toward us."},
  keep={d: (f"He has two tails in every frame, and they never merge into one; in the picture they are {w}. His two fluffy grey "
            "tails with dark rings and pale lavender tips, the golden straw cloak with the thick red rope bow and red tassels "
            "at his chest, the red collar with its gold bell, the plum-purple kimono with lavender cloud swirls, the dark "
            "hakama, the white leg wraps and straw sandals, the white fox mask hanging at his hip, the big round straw hat on "
            "his back and the black-sheathed katana with its gold paw-print guard and two little gold bells stay exactly the "
            "same.") for d, w in (('S', 'one beside each leg'), ('SE', 'both behind him'))}
       | {'E': ("He has two tails in every frame, and they never merge into one; in the picture they are both behind him. His two "
                "fluffy grey tails with dark rings and pale lavender tips, the golden straw cloak over his shoulder, the red "
                "rope and gold bell at his neck, the plum-purple kimono sleeve with lavender cloud swirls, the dark hakama, the "
                "white leg wraps and straw sandals, the white fox mask at his hip, the big straw hat seen edge-on on his back "
                "and the katana with its black sheath, gold paw-print guard and two little gold bells stay exactly the same."),
          'NE': ("He has two tails in every frame, and they never merge into one; in the picture they both hang below the "
                 "straw hat. The big round straw hat on his back with its red knot, two red tassels and two white paper "
                 "strips, the golden straw cloak, his two fluffy grey tails with pale lavender tips, the plum kimono sleeve, "
                 "the dark hakama, the white leg wraps, the straw sandals and the hilt of the katana sticking out in front of "
                 "him stay exactly the same."),
          'N': ("He has two tails in every frame, and they never merge into one; in the picture they both hang between his "
                "legs. The big round straw hat covering his upper back with its red knot, two red tassels and two white paper "
                "strips, the golden straw cloak, his two fluffy grey tails with pale lavender tips, the dark hakama, the "
                "white leg wraps and the straw sandals stay exactly the same.")},
  spos={'S': 'one paw resting on the sheathed katana at his hip, right at its gold guard, and his other paw relaxed at his side',
        'SE': 'one paw resting on the sheathed katana at his hip, right at its gold guard, and his other paw relaxed at his side',
        'E': 'the hilt of the sheathed katana pointing forward at his hip, his near paw relaxed in front of him and his other '
             'paw out of sight behind his body',
        'NE': 'the hilt of the sheathed katana sticking out in front of him and his near paw relaxed at his side',
        'N': 'his paws and the sheathed katana out of sight in front of him'},
  blink=", and his ears twitch once; his eyes stay open for the whole clip",
  vis=" His sword arm and the whole blade stay visible beside his body and above his shoulder during the whole move.",
  fmt={'wpaw': {'S': 'one paw keeping the sheathed katana steady at his hip and his other arm swinging a little',
                'SE': 'one paw keeping the sheathed katana steady at his hip and his other arm swinging a little',
                'E': 'the sheathed katana steady at his hip and his near arm swinging a little',
                'NE': 'his arms swinging a little at his sides', 'N': 'his arms swinging a little at his sides'},
       'dpaw': {'S': 'His free paw reaches across his body and grips the hilt while the other paw holds the sheath just '
                     'under the guard.',
                'SE': 'His free paw reaches across his body and grips the hilt while the other paw holds the sheath just '
                      'under the guard.',
                'E': 'His near paw reaches forward and grips the hilt of the sword at his hip.',
                'NE': 'He reaches across his body to the hilt in front of him.',
                'N': 'He reaches across his body to the hilt in front of him.'},
       'bpaw': {'S': 'One paw grips the hilt of his sheathed katana and the other holds the sheath just under the guard',
                'SE': 'One paw grips the hilt of his sheathed katana and the other holds the sheath just under the guard',
                'E': 'His near paw grips the hilt of the sheathed katana at his hip',
                'NE': 'His paws grip the sheathed katana in front of him',
                'N': 'His paws grip the sheathed katana in front of him'},
       'aend': {'S': 'until his arm is raised high and the blade points straight up above his head',
                'SE': 'until his arm is stretched up and forward and the blade points high and forward',
                'E': 'until his arm is stretched up and forward and the blade points high and forward',
                'NE': 'until his arm is raised high and the blade points up above his shoulder',
                'N': 'until his arm is raised high and the blade points up above his shoulder'},
       'focus': {'S': ', narrows his eyes in focus', 'SE': ', narrows his eyes in focus', 'E': ', narrows his eyes in focus',
                 'NE': '', 'N': ''},
       'tvis': {'S': ' Both raised tails show behind his shoulders, one on each side, while he holds the pose.',
                'SE': ' Both raised tails stay visible behind him while he holds the pose.',
                'E': ' Both raised tails stay visible behind him while he holds the pose.',
                'NE': ' Both raised tails stay visible beside the straw hat while he holds the pose.',
                'N': ' Both raised tails stay visible beside the straw hat while he holds the pose.'}},
  inframe="his whole body, both ears, both tails, the whole straw hat and the whole katana stay inside the frame.",
  nofx="No shadow, no flash, no glow, no sparkles, no particles, no smoke, no dust, no light trails, no streaks of colour, no "
       "motion lines, no wind lines, no cherry petals, no fire, no ghost flames, no magic effects, no symbols, no text; the "
       "gold bells and the gold guard never glow.",
  act={
   'idle': "Idle loop of {who}. {facing} He stands in a calm, ready stance, {spos}, and breathes slowly: his chest rises "
           "and falls, his shaggy mane and the straw cloak stir a little, the little bells sway and his two tails sway "
           "slowly and gently{blink}. The last frame matches the first frame so the clip loops.",
   'walk': "Walk loop of {who}. {facing} He walks in place, like on a treadmill, toward the way he is facing: light, quick, "
           "cat-like steps (about two steps per second) in his straw sandals, {wpaw}, the straw cloak bouncing, the little "
           "bells swinging and his two tails swaying; the big straw hat stays on his back. He does not move across the "
           "frame, he does not come closer to the camera or move away from it, and the ground does not move. The last frame "
           "matches the first frame so the clip loops.",
   'attack': "Quick sword draw of {who}. {facing} {dpaw} He bends his knees a little and leans forward in a short wind-up, "
             "then in one fast move pulls the katana out of its sheath and sweeps the blade forward and up in a rising "
             "diagonal arc toward the way he is facing, {aend}; he holds that pose for a moment, flicks the blade down once at his side, slides it back into the "
             "sheath at his hip, returns to his starting pose and stands still for the rest of the clip. The draw and the "
             "sweep are very fast; the whole move, putting the sword away included, takes less than two seconds. His feet "
             "stay in place.{vis} The katana keeps its full length and shape in every frame, the sheath stays at his hip, "
             "the blade is plain bright steel that never glows, and the air around it stays empty and plain green in every "
             "frame. Clean outlines in every frame, no motion blur.",
   'buff': "Focus pose of {who}. {facing} {bpaw}, he bends his knees a little and settles into a steady stance{focus}, and "
           "his two tails rise up behind him and spread apart into a V; he holds that pose still for about one second, then "
           "his tails sink back down, he lets go of the hilt, straightens up into his starting pose and stays still for the "
           "rest of the clip. The katana stays in its sheath at his hip for the whole clip. His feet stay in place.{tvis} "
           "Clean outlines in every frame, no motion blur."},
  dirname={'S': 'หน้าตรง', 'SE': 'เฉียงหน้า หันขวา', 'E': 'ข้าง หันขวา', 'NE': 'เฉียงหลัง หันขวา', 'N': 'หลัง'},
  actname={'idle': 'ยืน (idle · วนลูป)', 'walk': 'เดิน (walk · วนลูป)',
           'attack': 'ชักดาบฟัน (attack · ตีปกติ + สกิลฟันทุกท่า — เกมวาดเส้นฟันตามคลิปนี้)',
           'buff': 'ท่ารวมสมาธิ (buff · Ki Gather, Feline Focus, Sakura Dance, Gale Counter, Oni Roar, Ashura Mask, Kasa Throw, '
                   'Shadow Dance, Mountain Stance … — เกมปล่อยสกิลที่เฟรมค้าง)'},
  start='ภาพยืน 2.5D มุม {d} ที่ได้จาก ChatGPT',
  header="""เจ้าของ 2026-11-26 19:58 เลือกแบบ 4 'เนโกะมาตะพเนจร' + "ออกแบบเป็น 2.5d" → 20:22 ส่งภาพยืน 2.5D ครบ 5 มุม + "ขอพร้อมทำวีดีโอหน่อย เอาแค่พร้อมนะ รูปที่ส่งให้ยังไม่ต้องเอาไปทำอะไร" → ไฟล์นี้ = พรอมต์คลิป 20 ตัวอย่างเดียว · ไม่ได้ตัดภาพตั้งต้น ไม่ได้เก็บภาพยืนไว้ใน repo (ตามที่เจ้าของสั่ง) · เจ้าของแนบภาพยืนของทิศนั้นเป็นเฟรมแรกเอง · หน้าตา + พรอมต์ภาพยืน: `CAT_LOOK_PROMPTS_TH.md` หัวข้อสุดท้าย · ไม่มีชุดคลิปลุคแบนของตัวนี้ (คลิปเดิมเป็นแมวขาวสวมงอบ)

## ภาพยืน 2.5D ที่เป็นเฟรมแรก (มาแล้ว 20:22)
- 1254² พื้นเขียว ตัวสูง ~60 % ของภาพ (ปลายหูถึงรองเท้า) ทุกมุมหันขวา ไม่มีสีเขียวบนตัว · ที่ว่างเหนือหัว ~0.5 เท่าตัว (หมาป่า 2.5D .84) → ถ้าดาบตอนชักฟัน หรือหางตอนชูขึ้น หลุดขอบภาพ: ย่อภาพก่อนทำคลิป (`tools/dir8cut.py startv <โฟลเดอร์> <ทิศ>=<ภาพ> size=1024 feet=.88 ht=490 clean=0` ทีละมุม แบบหมาป่า 2.5D)
- ตามที่วาด: **S** หน้ากากซ้ายของภาพ ด้ามดาบขวา อุ้งเท้าแตะกระบัง หางโผล่ข้างขาข้างละหาง ขอบงอบโผล่หลังไหล่ · **SE** หางสองหางหลังตัวทางซ้ายของภาพ (บน + ล่าง) งอบโผล่ซ้าย · **E** งอบเห็นเป็นวงรีด้านข้าง หน้ากากอยู่หน้าตัว ด้ามชี้หน้าเฉียงขึ้น เห็นแขนข้างใกล้ · **NE** งอบเต็มวง หางห้อยใต้งอบไปทางซ้าย เห็นขอบแก้มกับหนวด ด้ามดาบโผล่ขวา · **N** งอบคลุมหลังบน หางห้อยระหว่างขาปลายม้วนไปขวา ไม่เห็นหน้า หน้ากาก ดาบ

## วิธีใช้
แนบภาพยืน 2.5D ของทิศนั้น + วางพรอมต์ทีละตัว → 4 คลิปต่อทิศ (ยืน · เดิน · ชักดาบฟัน · ท่ารวมสมาธิ) · คลิปละ 3–5 วิ · ไม่ต้องทำทิศซ้าย (เกมกลับด้านเอง) · ส่งกลับเรียง S → SE → E → NE → N ทิศละ ยืน → เดิน → ฟัน → บัฟ (สลับได้)

## กติกาที่อยู่ในทุกพรอมต์
- **ลุค 2.5D** (คีย์ `look`): โมเดล 3D ลงเงาการ์ตูน เส้นขอบน้ำตาลเข้ม สีและพื้นผิว (ขน ฟาง ผ้า เชือก ฝักเคลือบ) เดิม ไม่สมจริง ไม่แบน + กล้องมองลงจากด้านบนมุมเดิมตลอดคลิป
- **หางสองหางทุกเฟรม ห้ามรวมเป็นหางเดียว** + บอกตำแหน่งหางตามภาพของแต่ละมุม · หน้ากากอยู่ที่สะโพก งอบอยู่ที่หลังตลอด
- ยืน: ตาเปิดตลอดคลิป (คลิปแรดหลับตาตอนขยับ) · เดิน: ไม่เข้าหา / ถอยห่างกล้อง (คลิป S หมาป่าเดินเข้ากล้อง) · ห้ามเส้นลม กลีบซากุระ ไฟ เปลวผี (ท่าสู้ในชีตมีเส้นลมฟ้า กลีบ อสูรไฟ — โมเดลอาจวาดเพิ่มเอง) · กระดิ่ง / กระบังทองไม่เรือง
- **ชักดาบฟัน** = อุ้งที่ว่างเอื้อมไปจับด้าม อีกอุ้งจับฝัก ย่อเข่านิด → ชักดาบออกจากฝักแล้วกวาดขึ้นเฉียงไปข้างหน้าเร็วๆ จนแขนเหยียด ปลายดาบชี้สูง (= เฟรมโดน) ค้างนิดนึง → สะบัดดาบลงหนึ่งที เสียบกลับเข้าฝัก กลับท่าเดิม · ไม่ใช้คำ attack / slash / strike (คลิปแมวเดิมมีโค้งฟันขาวติดมาในมุม SE / E และแสงดาวแตกในมุม N) · ดาบยาวเท่าเดิมทุกเฟรม ใบเหล็กไม่เรือง อากาศรอบดาบเป็นพื้นเขียวเปล่า · มุมหลังสั่งให้แขนกับใบดาบโผล่ข้างตัว / เหนือไหล่
- **ท่ารวมสมาธิ** (บัฟ) = อุ้งหนึ่งจับด้าม อีกอุ้งจับฝัก ดาบอยู่ในฝักตลอด ย่อเข่านิด หรี่ตา **หางสองหางชูขึ้นแยกเป็นรูปตัว V** ค้าง ~1 วิ (เกมค้างเฟรมนี้ตอนร่าย) แล้วกลับท่าเดิม · คลิปบัฟของแมวเดิมเป็นท่าย่อตัวจับดาบ · แผนในไฟล์ลุค ("ถือดาบทั้งฝักแนวนอนหน้าเอว") เปลี่ยนเป็นท่านี้ เพราะต้องดึงดาบทั้งฝักออกจากผ้าคาดแล้วเสียบคืน โมเดลวิดีโอมักทำเพี้ยน และหางตัว V คือจุดเด่นเนโกะมาตะ
- ไม่ระบุมือซ้าย / ขวา (ใช้ 'อุ้งที่ว่าง' / 'อุ้งที่จับฝัก' / 'อุ้งข้างใกล้')""",
  footer="""## ตอนคลิปมาถึง (โน้ตสำหรับแชตที่ทำต่อ)
- แผน `tools/clips/cat25_plan.json` → ไฟล์แยก `assets_cat25.js` (prefix CAT แบบ jaguar25 / wolf25 — โหลดไฟล์เดียว) + สวิตช์ URL เช่น `?cat25=0` ในบรรทัดโหลดของ index.html (`CAT_ART` เช็กแค่ `CAT_SPR_META`) · **เวลาเฟรมเท่า `assets_cat.js` ทุกแถว** (`stateDur` + dur ของแถวตี / บัฟ): ตี 14 เฟรม S 55×6 · 40×3 · 75×5 (โดนเฟรม 7) · ทิศอื่น 55×4 · 40×3 · 75×7 (โดนเฟรม 5) · บัฟ 12 × 70 ms จุดค้างเฟรม 6 · โดนตี 7 × 70 · เดิน 8 เฟรม S 120 SE 135 E 161 NE 125 N 156 ms · ยืน 12 เฟรม S 139 SE 56 E 212 NE 205 N 167 ms → เช็ก `python3 tools/fxlab.py hits cat` ก่อน / หลัง (FXSEED + o.sure)
- เฟรมตี: เฟรม 3 (`KT_DRAWF` ใน char_cat.js) = ดาบเพิ่งออกจากฝัก — ท่าชาร์จแทนเฟรมก่อนหน้านี้ · เฟรมโดน = แขนเหยียด ปลายดาบชี้สูง · เลี่ยงเฟรมที่โมเดลแอบใส่เส้น / แสง (`frames`, `unstreak`, `deglow`) · ซ็อกเก็ตท่าตี = ปลายดาบ (head) + ด้าม (grip) แบบตัวเลือก `blade` ของจากัวร์ (ใบเหล็กสว่าง ต้องตั้งสีใหม่) หรือ `orbFix` อ่านด้วยตา
- **ท่าชาร์จ** (state `charge`) มาจากแผ่นแมวขาวลุคเดิม → atlas ใหม่ยังไม่มี = `ktChgDir` ปิดตัวเอง (เช็ก `SPR_META.states.charge`) กลับไปค้างเฟรมคลิป · แผ่นท่าชาร์จ 2.5D ทำทีหลังแบบแผ่นท่าเสริมหมาป่า / จากัวร์
- **จุดหัว:** `cat_mask.js` ตาราง `HAT` (กลางงอบบนหัวทุกเฟรม) ใช้วางหน้ากากตอนสวม (Ashura Mask) + ปีกแฟชั่น (`cat_wings.js`) → หัวใหม่ไม่มีงอบ ต้องจับจุดหัวใหม่ด้วย `tools/headtrack.py` (+ `cat25_head.json`) · ภาพหน้ากากบนหน้า `mask8_*` ตัดจากแมวเดิม → ทำใหม่ หรือให้โค้ดวาง `mask_white` ที่จุดหน้า
- `CHAR_SCALE.cat` 1.59 → ตั้ง cellScale ให้ idle S สูงเท่าเดิม · หน้า HUD ตัดจากคลิปยืน S (`window.HUD_FACE`) · ท่านั่ง `assets/sit/cat_*` ยังเป็นแมวเดิม · `cat_vfx.js` `hand()` / `CHG_HILT` ตั้งตามท่าชาร์จเดิม
- **คลิปมาแล้ว 2026-11-27 09:32** (20 คลิป อัปโหลด 1000001485–1509) → `assets_cat25.js` = ตัวหลักของแมว (`?cat25=0` = แมวขาวลุคเก่า) · สร้างใหม่: `python3 -I tools/cliphero.py tools/clips/cat25_plan.json assets_cat25.js CAT` → ท่าเสริม 10 state ด้วย sheet_state → `python3 -I tools/headtrack.py assets_cat25.js CAT_ tools/clips/cat25_head.json` (ต้องทำตามลำดับนี้: cliphero เขียนทั้งไฟล์ใหม่) · รายละเอียด + ตารางท่า: `CAT25_POSE_PROMPTS_TH.md` 'สร้างแล้ว'""")
# Ronin Cat 2.5D extra poses (owner 2026-11-27 08:09 'ขอพร้อมทำพวกท่าพิเศษด้วย จะทำเป็นวีดีโอ ยกเว้นท่านั่ง จะทำเป็นรูป'):
# 9 one-view clips from his own SE standing picture (the first frame, like the 20 clips) + one ChatGPT sit sheet of 8 views.
# Which skill borrows which frame today was read from char_cat.js (see the header). Words that made earlier video models paint
# effects (attack / slash / strike / slam / smash) are not used; every clip holds its key pose still so the game can loop it.
_C25 = HEROES['cat25']
_K25 = _C25['keep']['SE']
_SWORD25 = ("The katana keeps its full length and shape in every frame, the sheath stays at his hip, the blade is plain bright "
            "steel that never glows, and the air around it stays empty and plain green in every frame.")
_CLEAN25 = "Clean outlines in every frame, no motion blur."
def _rep25(s, a, b):
    assert a in s, a
    return s.replace(a, b)
POSES['cat25'] = dict(
  title='แมวโรนิน 2.5D (เนโกะมาตะพเนจร) — ท่าพิเศษ: คลิปวิดีโอ 9 ท่า + ภาพท่านั่ง 8 มุม',
  header="""**เวอร์ชันวิดีโอ (เก็บไว้):** 09:06 เจ้าของเปลี่ยนเป็น "ขอพร้อมทำรูปดีกว่า" → ใช้ภาพแผ่นท่าใน `CAT25_POSE_PROMPTS_TH.md` (`python3 tools/clip_prompts.py cat25 sheets`) แทน · ไฟล์นี้เก็บไว้เผื่อกลับไปทำเป็นวิดีโอ

เจ้าของ 2026-11-27 08:09 "ขอพร้อมทำพวกท่าพิเศษด้วย จะทำเป็นวีดีโอ ยกเว้นท่านั่ง จะทำเป็นรูป" (หลังได้พรอมต์คลิป 20 ตัวใน `CAT25_CLIP_PROMPTS_TH.md`) → ไฟล์นี้ = พรอมต์คลิปท่าพิเศษ 9 ท่า (วิดีโอ ทำแบบเดียวกับคลิป 20 ตัว) + พรอมต์ภาพท่านั่ง 8 มุม (ChatGPT) · ภาพยืน 2.5D ของเจ้าของยังไม่อยู่ใน repo (ตามที่สั่ง) — เจ้าของแนบเอง

## ทำไมต้องมีท่าพิเศษ
คลิป 20 ตัวให้แค่ 5 ชุดท่า: ยืน · เดิน · ชักดาบตวัดขึ้น (attack) · ท่ารวมสมาธิ (buff) · โดนตี (ทำจากท่ายืน) — สกิลแมวที่ไม่ใช่การชักดาบตวัดขึ้นจึงต้องยืมท่าพวกนี้ (อ่านจาก `char_cat.js`):
- ท่าชาร์จก่อนฟัน (state `charge`) มาจากแผ่นแมวขาวลุคเดิม → แอตลาส 2.5D ไม่มี = Mountain Cleave · Sky Drop · Final Cleave · Oni Executioner · Avalanche Rush กลับไปค้างเฟรมคลิปแทน
- Sky Drop · Earthfall: กระโดดข้ามไปฟันเป้า (ตัวลอยสูง 90 / 60) แต่ภาพยังเป็นท่าชักดาบตวัดขึ้นกลางอากาศ
- Cat Step · Mirage Step · ช่วงวิ่งของ Avalanche Rush: เล่นแถวเดินเร็ว ×3
- Nekomata Roll: เล่นแถว "โดนตี" ×1.6 ตลอดช่วงกลิ้ง
- Grinding Wheel: วนเฟรมโดนของท่าชักดาบ 8 ทิศ 3 รอบ
- Kasa Throw · Oni Roar · Ashura Mask ใช้ท่ารวมสมาธิท่าเดียวกับ Ki Gather · Feline Focus · Sakura Dance · Gale Counter · Petal Fall · Shadow Dance · Mountain Stance
- ทุกท่าฟันทั้งสายลม (A) และสายอสูร (B) = ท่าชักดาบตวัดขึ้นท่าเดียว — Mountain Cleave · Quake Slash · Final Cleave · Oni Executioner ของสายอสูรก็ตวัดขึ้น
- ยังไม่มีท่านั่งของร่างใหม่ (`assets/sit/cat_*` เป็นแมวขาวเดิม)

## วิธีใช้
- **คลิป 9 ท่า:** แนบ**ภาพยืน 2.5D มุมเฉียงหน้า (SE) = รูปที่ 1** ที่ส่งมาเมื่อ 2026-11-26 20:22 เป็นเฟรมแรก แล้ววางพรอมต์ทีละตัว · คลิปละ 3–5 วิ · ทำมุมเดียวพอ: เกมกลับด้านเองตอนหันซ้าย (SW / W) · ตอนหันขึ้น (N / NE / NW) ใช้เฟรมจากคลิป 20 ตัวต่อ แบบท่าเสริมของหมาป่ากับจากัวร์ · ท่าหมุน ⑤ หมุนครบรอบในคลิปเดียว ได้ภาพทุกด้าน
- **ท่านั่ง ⑩:** เป็นภาพ ไม่ใช่คลิป → แชต ChatGPT ใหม่ แนบภาพยืน 2.5D ทั้ง 5 มุม แล้ววางกล่อง ⑩
- ได้ท่าไหนส่งมาท่านั้น ไม่ต้องรอครบ (ใส่เกมทีละท่าได้)

## ที่ว่างในเฟรม
ภาพเฉียงหน้า: ตัวสูง ~60 % ของภาพ ที่ว่างเหนือหัว ~0.5 เท่าตัว → ② กระโดดฟัน · ⑤ หมุนดาบ · ⑧ ฟันลงจากเหนือหัว ดาบขึ้นสูง / ยื่นออกข้าง อาจหลุดขอบ · พรอมต์สั่งกระโดดต่ำ (เท้าลอยแค่ ¼ ความสูงตัว — ในเกมความสูงตอนลอยมาจากโค้ด ไม่ได้มาจากคลิป) และสั่งให้ทุกอย่างอยู่ในเฟรม · ถ้ายังหลุด: ส่งภาพเฉียงหน้ามา ผมทำภาพตั้งต้นที่ย่อตัวลงให้ (`python3 -I tools/dir8cut.py startv <โฟลเดอร์> SE=<ภาพ> size=1024 feet=.86 ht=430 clean=0`)

## กติกาที่อยู่ในทุกพรอมต์คลิป
- ลุค 2.5D · หน้า · หางสองหาง · ของที่ต้องคงไว้ · ห้ามเอฟเฟกต์ = ชุดเดียวกับคลิป 20 ตัว (คีย์ `look` / `face` / `keep` / `nofx` ของ `cat25`) · กล้องนิ่ง พื้นเขียวเรียบ ไม่หันไปทิศอื่น (ยกเว้นท่าหมุน)
- ไม่ใช้คำ attack / slash / strike / slam / smash (คลิปแมวเดิมติดรอยฟันขาว / แสงดาวแตกมา) · ดาบยาวเท่าเดิม ใบเหล็กไม่เรือง อากาศรอบดาบเป็นพื้นเขียวเปล่า · พื้นไม่แตก ไม่มีฝุ่น หิน ไฟ (ชีตออกแบบมีอสูรไฟกับเส้นลม — โมเดลอาจวาดเพิ่มเอง)
- ท่าที่ต้องค้าง (ชาร์จ · ลงพื้น · คำราม · ฟันลง · สวมหน้ากาก) สั่งค้างนิ่งให้ชัด เพราะเกมดึงเฟรมช่วงค้างไปเล่นวน / ค้างไว้
- ต่างจากคลิป 20 ตัว: คำราม = อ้าปาก (แทนประโยคปิดปาก) · สวมหน้ากาก = หน้ากากย้ายจากสะโพกขึ้นหน้า · ขว้างงอบ = งอบหลุดออกนอกเฟรม · หมุน = หันครบรอบแล้วกลับมาทางเดิม · กลิ้ง / กระโดด = เคลื่อนนิดเดียวแล้วอยู่ในเฟรม
- ไม่ระบุมือซ้าย / ขวา (ใช้ 'อุ้งที่ว่าง' / 'อุ้งที่จับฝัก' / 'อุ้งที่ห้อยข้างตัว')""",
  clipsHead='## คลิปวิดีโอ 9 ท่า · แนบภาพยืน 2.5D มุมเฉียงหน้า (SE = รูปที่ 1) เป็นเฟรมแรกทุกคลิป · วางพรอมต์ทีละตัว',
  clips={
   'charge': dict(n='①', th='ท่าชาร์จ (ย่อตัวเตรียมชักดาบ)', prio='สำคัญ',
     use='Mountain Cleave · Sky Drop · Final Cleave · Oni Executioner · Avalanche Rush (ช่วงชาร์จทั้งหมด)',
     frames='ยืน → ย่อลง 4 เฟรม → ท่าค้าง 3 เฟรม (ขยับนิดเดียว เล่นวนระหว่างชาร์จ) — ลำดับเดียวกับท่าชาร์จเดิม',
     text="Iai stance of {who}. {facing} {dpaw} He spreads his feet wide and sinks into a deep, low ready stance: knees "
          "bent, body leaning forward, head low, his narrowed eyes fixed straight ahead, the katana still in its sheath at "
          "his hip and ready to be drawn, his two tails stretched out low behind him. He holds this stance very still for "
          "about two seconds — only his breathing, his mane, the straw cloak and the tips of his tails move a little — then "
          "he rises back into his starting pose and stands still for the rest of the clip. The katana stays in its sheath "
          "for the whole clip, and his feet stay planted after he spreads them. " + _CLEAN25),
   'jump': dict(n='②', th='ท่ากระโดดฟันลง', prio='สำคัญ', use='Sky Drop · Earthfall',
     frames='ย่อ → ถีบตัว → ลอยชูดาบเหนือหัว → ฟันลงขณะตก → ลงพื้นดาบชี้พื้น (= จังหวะโดน) → ค้าง',
     text="Jumping sword cut of {who}. {facing} {dpaw} He crouches low, then springs straight up a short way — his feet "
          "leave the ground by only about a quarter of his height — drawing the katana as he rises and lifting it high above "
          "his head with both paws at the top of the jump, the straw cloak and both tails flaring out behind him. He comes "
          "down on the same spot and lands in a deep crouch, swinging the blade straight down in front of him as he lands, "
          "so it ends pointing down at the ground just in front of his feet, its tip just above the ground without touching "
          "it. He holds that landing pose for a moment, then stands up, slides the katana back into the sheath at his hip, "
          "returns to his starting pose and stands still for the rest of the clip. The jump and the cut are quick; the whole "
          "move, putting the sword away included, takes about two seconds. Nothing appears on the ground when he lands: no "
          "cracks, no rocks, no dust. " + _SWORD25 + " " + _CLEAN25,
     stay="He jumps straight up and comes down on the same spot, stays in the middle of the frame at the same size and "
          "never turns to another direction; "),
   'dash': dict(n='③', th='ท่าพุ่งต่ำ', prio='สำคัญ', use='Cat Step · Mirage Step · ช่วงวิ่งของ Avalanche Rush',
     frames='ก้าววิ่งก้มต่ำ 4 เฟรม (เล่นวนระหว่างพุ่ง) → เบรกไถล',
     text="Low dash of {who}. {facing} He breaks into a low, fast sprint on the spot, like on a treadmill, toward the way "
          "he is facing: body leaning far forward and head low, one paw keeping the sheathed katana steady at his hip and the "
          "other arm swept back, quick long strides in his straw sandals, the straw cloak, his mane and both tails streaming "
          "straight out behind him. After about one second he skids to a stop with one foot braced forward and his body still "
          "low, then straightens up into his starting pose and stands still for the rest of the clip. He does not move "
          "across the frame, he does not come closer to the camera or move away from it, and the ground does not move. The "
          "katana stays in its sheath at his hip and the straw hat stays on his back for the whole clip. " + _CLEAN25),
   'roll': dict(n='④', th='ท่าม้วนกลิ้ง', prio='สำคัญ', use='Nekomata Roll (ตอนนี้เล่นท่าโดนตีแทน)',
     frames='ย่อ → ม้วนเป็นลูกบอล 3–4 เฟรม → ลุกขึ้นหมอบ',
     text="Forward roll of {who}. {facing} He crouches, tucks into a tight round ball — head, paws and knees tucked in, "
          "both tails wrapped around him — and does one quick forward somersault toward the way he is facing, rolling only "
          "a short way, then uncurls and springs up into a low crouch with one paw touching the ground. He holds that crouch "
          "for a moment, then stands up into his starting pose and stands still for the rest of the clip. The roll is quick "
          "and smooth. The katana stays in its sheath at his hip and the straw hat stays on his back for the whole clip. "
          + _CLEAN25,
     stay="He rolls only a short way, stays near the middle of the frame at the same size and never turns to another "
          "direction; "),
   'spin': dict(n='⑤', th='ท่าหมุนดาบรอบตัว', prio='ดี', use='Grinding Wheel',
     frames='มุมต่างๆ ระหว่างหมุน (หน้า · เฉียง · ข้าง · หลัง) ดาบยื่นออกข้างตัวทุกมุม — แทนการวนเฟรมฟัน 8 ทิศ',
     text="Spinning sword turn of {who}. {facing} He draws the katana and holds it straight out to one side at waist "
          "height with the blade level, then spins around on the spot one full turn, steadily, keeping the blade level and "
          "stretched out, so that during the turn we see him from every side, including his back with the big straw hat and "
          "both tails; he stops facing exactly the same way as at the start. He holds the sword out for a moment, then slides "
          "it back into the sheath at his hip, returns to his starting pose and stands still for the rest of the clip. The "
          "turn takes about one and a half seconds and his feet stay on the same spot. " + _SWORD25 + " " + _CLEAN25,
     stay="He stays on the same spot in the middle of the frame at the same size; apart from the one full turn he never "
          "turns to another direction; "),
   'throw': dict(n='⑥', th='ท่าขว้างงอบ', prio='ดี', use='Kasa Throw',
     frames='เอื้อมจับงอบ → ดึงออก → ง้างข้ามตัว → สะบัดขว้าง (= จังหวะงอบออกจากมือ) → ค้างท่าขว้าง',
     text="Straw hat throw of {who}. {facing} He reaches up over his shoulder with one paw, takes the big round straw hat "
          "off his back, swings it across his body and flings it forward flat, like a spinning disc, toward the way he is "
          "facing with a quick flick of his arm; the hat spins away and quickly flies out of the frame. He holds his throwing "
          "pose for a moment, arm stretched forward, then lowers his arm, returns to his starting pose and stands still for "
          "the rest of the clip, now without the hat. His feet stay in place and the katana stays in its sheath at his hip "
          "for the whole clip. " + _CLEAN25,
     keep=_rep25(_K25, ", the big round straw hat on his back and the black-sheathed katana with its gold paw-print guard and "
                       "two little gold bells stay exactly the same.",
                 " and the black-sheathed katana with its gold paw-print guard and two little gold bells stay exactly the "
                 "same; the big round straw hat keeps its shape, its red knot, red tassels and white paper strips until it "
                 "leaves the frame."),
     inframe="his whole body, both ears, both tails and the whole katana stay inside the frame, and the straw hat stays "
             "inside the frame until he throws it."),
   'roar': dict(n='⑦', th='ท่าคำราม', prio='ดี', use='Oni Roar',
     frames='เริ่ม → อ้าปาก → คำรามเต็ม (ค้าง = จังหวะบัฟติด) → หุบปาก',
     text="Roar of {who}. {facing} He plants his feet wide, leans forward a little, pulls both arms down and back with "
          "his paws clenched, opens his mouth wide and roars toward the way he is facing; his ears flatten back, his mane and "
          "the straw cloak blow back, and his two tails stand straight up behind him with their fur puffed out. He holds the "
          "roar for about one second, then closes his mouth, relaxes, returns to his starting pose and stands still for the "
          "rest of the clip. His feet stay planted and the katana stays in its sheath at his hip for the whole clip. No sound "
          "waves, no rings and no lines around his mouth. " + _CLEAN25,
     face="Keep his face as in the picture: the same golden-yellow eyes with the small red marks at their outer corners, "
          "the same white blaze down his grey tabby face and the same small pink nose and whiskers; while he roars his eyes "
          "open wide and his mouth opens wide, showing small sharp fangs, and afterwards his calm, sly little smile comes "
          "back with his mouth closed."),
   'chop': dict(n='⑧', th='ท่าฟันลงจากเหนือหัว', prio='ดี',
     use='Mountain Cleave · Quake Slash · Final Cleave · Oni Executioner — สายอสูรได้ท่าฟันหนักของตัวเอง แยกจากท่าชักดาบตวัดขึ้นของสายลม',
     frames='ชักดาบ → ยกเหนือหัว (ท่าง้าง) → ฟันลง → ดาบชี้พื้น (= จังหวะโดน) → ค้าง',
     text="Overhead sword cut of {who}. {facing} {dpaw} He draws the katana and in one smooth move lifts it high above "
          "his head with both paws on the hilt, the blade pointing back over his head as he leans back a little; then he "
          "bends his knees into a low, wide stance and swings the blade straight down in front of him in one heavy cut, so it "
          "ends pointing down in front of his feet, its tip just above the ground without touching it. He holds that low pose "
          "for a moment, then straightens up, slides the katana back into the sheath at his hip, returns to his starting pose "
          "and stands still for the rest of the clip. The whole move, putting the sword away included, takes about two "
          "seconds, and his feet stay in place. Nothing appears on the ground: no cracks, no rocks, no dust, no fire. "
          + _SWORD25 + " " + _CLEAN25),
   'mask': dict(n='⑨', th='ท่าสวมหน้ากาก', prio='เสริม', use='Ashura Mask',
     frames='จับหน้ากาก → ยกขึ้น → แนบหน้า (= จังหวะบัฟติด) → ยืนสวมหน้ากาก · หลังจากนั้นหน้ากากบนหน้าตลอดบัฟยังวาดด้วยโค้ด (`cat_mask.js`)',
     text="Fox-mask pose of {who}. {facing} With the paw that hangs at his side he unhooks the white fox mask from his "
          "hip, lifts it up in front of him and presses it onto his face so it covers his face; as it goes on, he straightens "
          "up proudly and his two tails rise behind him. He holds still wearing the mask for about one second, then lowers "
          "his paw and stands still, still wearing the mask, for the rest of the clip. His feet stay in place and the katana "
          "stays in its sheath at his hip for the whole clip. The mask is plain white with red markings and never glows. "
          + _CLEAN25,
     face="At the start his face is exactly as in the picture: the same half-closed golden-yellow eyes with the small red "
          "marks at their outer corners, the same white blaze down his grey tabby face, the same small pink nose and whiskers "
          "and the same calm, sly little smile, mouth closed; once the mask is on, only the white fox mask shows where his "
          "face was, with his ears and grey mane around it.",
     keep=_rep25(_rep25(_K25, "the white fox mask hanging at his hip, ", ""), "stay exactly the same.",
                 "stay exactly the same, and the white fox mask with its red markings, red cord and red tassel keeps exactly "
                 "its shape and colours as it moves from his hip to his face.")),
  },
  clipFix="""ถ้าคลิปออกมาไม่ดี (เติมประโยคท้ายพรอมต์แล้วทำใหม่):
- มีเส้นฟัน / แสง / ฝุ่น / ไฟโผล่ → `Absolutely no effects of any kind: only the cat on plain flat green.`
- ตัวใหญ่ขึ้น / เดินเข้าหากล้อง → `He never gets bigger in the frame and never comes closer to the camera.`
- หางรวมเป็นหางเดียว → `He has two separate tails in every single frame.`
- ดาบสั้นลง / งอ / หาย → `The katana keeps its full length and stays straight in every frame.`
- ดาบ / หาง / งอบหลุดขอบ → ส่งภาพเฉียงหน้ามา ผมทำภาพตั้งต้นที่ย่อตัวลงให้""",
  still=dict(n='⑩', th='ท่านั่งพัก (ภาพ 8 มุม · ChatGPT ไม่ใช่คลิป)', prio='เสริม',
    use='นั่งพัก (ปุ่ม Insert / 🧘) + สถานะนั่งพัก ×2',
    head='## ภาพท่านั่ง (ChatGPT · ไม่ใช่คลิป)',
    attach='แชต ChatGPT ใหม่ · แนบภาพยืน 2.5D ทั้ง 5 มุม (รูปที่ 1–5 ที่ส่งมาเมื่อ 2026-11-26 20:22) แล้ววางกล่องนี้ · '
           'ไม่แนบภาพหน้าโหลดหรือชีตออกแบบ 2D (มันจะดึงกลับเป็นภาพวาดแบน) · ห้ามแนบไฟล์ .md นี้ให้ ChatGPT',
    box="""2.5D game sprite sheet — the two-tailed cat swordsman sitting down to rest, the same pose seen from 8 directions.
Use the attached pictures: they show him standing, seen from five sides, exactly as he looks and how he is rendered — copy his look and the rendering exactly, but not the standing pose.
Style: the same 2.5D look as the attached pictures — a stylized 3D game model with solid volume and depth, rendered with a toon shader that imitates hand-drawn art: clean dark-brown hand-drawn-looking outlines, soft cel shading in 2–3 tones that follows the 3D forms, one warm key light from the upper left with a soft cool shadow side, a thin bright rim light along the edges, matte painted textures (soft fur in clumps, dry layered straw, woven cloth, glossy black lacquer, gold with soft painted highlights). Not photorealistic, not glossy plastic, not a flat 2D drawing. Keep his chibi proportions exactly as in the pictures: a big head and a compact body about three heads tall.
Camera: the same as in the attached pictures — looking down at him from about 30 degrees above, with no perspective distortion.
His look (nothing added and nothing left out): a nekomata, a cat swordsman with two tails. A grey tabby cat: soft silver-grey fur with a slight lilac tint and darker grey stripes on his forehead, cheeks, arms and tails; a white blaze between his eyes, a white muzzle and chin and white paws; a small coral-pink nose and whiskers; half-closed golden-yellow cat eyes with slit pupils and a short red stroke at the outer corner of each eye; two big pointed cat ears, dark grey outside, pink inside with white fur tufts; a shaggy, spiky grey mane with a side-swept fringe. TWO long fluffy tails that grow from one base: grey with darker grey rings and soft pale lavender tips (not glowing). A red collar with a round gold bell. A golden straw mino rain cloak of shaggy layered straw (warm golden yellow, never greenish) over his shoulders and down his back, tied across his chest with a thick twisted red rope in a bow with red tassels. Under it a deep plum-purple kimono with wide sleeves and pale lavender cloud swirls, a white collar, a dark sash with a twisted red cord, wide black hakama trousers to mid-calf, white bandage wraps on his shins, and white cat feet in straw sandals with black straps. ONE katana: a black lacquered sheath, a black hilt wrap with red diamonds and a gold end cap, a round black guard with a gold rim and a gold paw print, and two small gold bells on red cords hanging under the guard. A white fox mask with red markings on a red cord, a red tassel under it. On his back a big round woven straw kasa hat on a red cord, with a red ornamental knot and two red tassels in its middle and two blank white paper strips hanging from its rim (nothing written on them); it never sits on his head.
Pose (the same in all 8 pictures): he sits cross-legged on the ground with his back straight and both paws resting on his knees; the sheathed katana stays tucked in his sash on his LEFT hip with its hilt pointing forward, the white fox mask hangs at his RIGHT hip, the big straw hat stays on his back, and his two tails curl around his sides and lie on the ground in front of his crossed legs — two separate tails, both always visible; a calm, content face with his usual half-closed golden eyes and a small smile, mouth closed.
Layout: landscape 1536×1024, 8 pictures in 2 rows of 4, read left to right, top row first. Each picture sits in its own eighth of the picture, the cat the same size in every picture, his whole body (ears, both tails, the whole straw hat and the sword hilt) inside his own area with clear empty space around it — pictures never touch or overlap.
Pictures:
1. Front view, facing us.
2. Front three-quarter view, turned toward the lower right.
3. Side view, facing right.
4. Back three-quarter view, turned toward the upper right.
5. Back view: we see the big straw hat on his back and both tails.
6. Back three-quarter view, turned toward the upper left.
7. Side view, facing left.
8. Front three-quarter view, turned toward the lower left.
Background: flat solid pure green #00FF00 everywhere, no gradient, no floor, no shadow under him.
No effects at all: no glow, no cherry petals, no wind lines, no fire, no sparkles, no dust, no symbols, no text, no numbers, no frame borders — only the cat. No green anywhere on him: the straw is warm golden yellow, the kimono plum purple, the tail tips pale lavender. The bells and the gold do not glow.""",
    fixes="""แก้รูป (ส่งต่อท้ายในแชตเดิม):
- เหลือหางเดียว → `Redo: he must have TWO separate tails in every picture, both visible.`
- ตัวแบนเหมือนภาพวาด → `Redo: make him look like the attached 2.5D pictures — a 3D game model with rounded volume and soft 3D shading, clean hand-drawn outlines.`
- ภาพชนกัน / หลุดกรอบ → `Redo: draw him smaller so each picture, including the straw hat and both tails, fits inside its own area with green space around it.`
- งอบขึ้นไปอยู่บนหัว → `Redo: the straw hat stays on his back, never on his head.`
- ดาบ / หน้ากากสลับข้าง → `Redo: the katana is on his LEFT hip and the fox mask on his RIGHT hip, in every picture.`
- มุมซ้ำ / ไม่ครบ 8 → `Redo: 8 different directions in this order: front, front three-quarter right, side right, back three-quarter right, back, back three-quarter left, side left, front three-quarter left.`
- ฟางออกเขียว → `Redo: the straw is warm golden yellow, not greenish.`
- แก้บางภาพ → ใช้แปรงเลือกเฉพาะภาพนั้นใน ChatGPT (สั่งแก้ทั้งภาพ มันจะวาดใหม่หมด)"""),
  footer="""## ตอนคลิปมาถึง (โน้ตสำหรับแชตที่ทำต่อ)
1. รอแอตลาส 2.5D จากคลิป 20 ตัวก่อน (ท้าย `CAT25_CLIP_PROMPTS_TH.md`) — ท่าพิเศษต้องใช้ cell / pivot / สเกลเดียวกับแอตลาสนั้น
2. ตัดคลิปเป็น state: ตอนนี้ `tools/sheet_state.py` รับแค่แผ่นภาพ → เพิ่มทางรับวิดีโอ (เช่น `"video":"<คลิป>.mp4","pick":[เฟรม 0-based]` คีย์พื้นเขียวแบบ cliphero) หรือเรียงเฟรมที่เลือกเป็นแผ่นแล้วใช้ทางเดิม · สเกล: ทุกคลิปเริ่มจากภาพยืน SE เดียวกับคลิปยืน SE → วัดความสูงตัวในเฟรมแรกเทียบ idle SE ของแอตลาส = สเกลเดียวทุกท่า · เฟรมลอยกลางอากาศ anchor ที่เท้าข้างต่ำสุด (เกมยกตัวด้วย player.z) · `store` = cellScale ของแอตลาส · `tone` ถ้าวิดีโอคมกว่าคลิป
   - state + เฟรมที่เลือก: `charge` 8 (0 ยืน · 1–4 ย่อลง · 5–7 ค้าง = ลำดับเดียวกับ state เดิม → `ktChargeSeq` ใช้ได้เลย) · `jump` 6–7 · `dash` 5 · `roll` 5 · `spin` 8 มุม (d ตามทิศที่เห็นในเฟรม) · `throw` 5 · `roar` 4 · `chop` 6 · `mask` 4 · socket ปลายดาบ / ด้ามทุกเฟรมของ `jump` `spin` `chop` (ให้เส้นฟันตาม — ตัวเลือก `sockets` ของ sheet_state)
3. ผูกท่าในไฟล์ใหม่ `cat_pose.js` (แบบ `jaguar_pose.js` / `wolf_pose.js`): เปลี่ยนแค่เฟรมที่โชว์ — ความยาว เวลาโดน event ทุกตัวเท่าเดิม · ท่ามุมเดียวใช้เฉพาะตอนหันลง / ข้าง (S SE E SW W) · `?catpose=0` = ท่าเดิม
   - ชาร์จ: state `charge` ใหม่แทนตัวเดิม (`ktChgDir` เช็ก `SPR_META.states.charge` อยู่แล้ว)
   - กระโดด: Sky Drop (ช่วงลอย .28 วิก่อน windup = เฟรมลอย · contact = เฟรมลงพื้น) · Earthfall (ลอยตลอดช่วง wind-up)
   - พุ่ง: Cat Step · Mirage Step (`ktDash` ตัวเลือก `st` จาก 'walk' → 'dash') · ช่วงวิ่งของ Avalanche Rush
   - กลิ้ง: Nekomata Roll (`ktDash` `st` จาก 'hurt' → 'roll')
   - หมุน: Grinding Wheel (แทนเฟรมโดน 8 ทิศที่วนอยู่ — 3 รอบหมุนตาม DIR8 อยู่แล้ว)
   - ขว้าง / คำราม / หน้ากาก: Kasa Throw · Oni Roar · Ashura Mask (`buffAct`: เฟรมปล่อย / ค้าง = จุด peak เดิม) · หน้ากากที่ค้างบนหน้าตลอดบัฟต้องจับจุดหัวใหม่ก่อน (ท้าย `CAT25_CLIP_PROMPTS_TH.md`)
   - ฟันลง: Mountain Cleave · Quake Slash · Final Cleave · Oni Executioner (แทนเฟรมท่าตีทีละช่อง เวลาเท่าเดิม · ท่าชาร์จยังแทนเฟรมก่อน `KT_DRAWF`) + เส้นฟันใน `cat_vfx.js` (KArc) เปลี่ยนเป็นรูป 'down' สำหรับ 4 สกิลนี้
4. ท่านั่ง: โหมด `pics` ของ sheet_state (แบบ `jaguar25_sit.json` / `wolf25_sit.json`) → `assets/sit/cat25_<8 ทิศ>.webp` + รายการ cat ใน `hero_sit.js` (เลือกตามแอตลาสที่โหลด)
5. เช็ก: make() ทุกสกิลที่เปลี่ยน × 8 ทิศ (ความยาว / windup / event เท่ากับ `?catpose=0`) · `tools/fxlab.py hits cat` (FXSEED + sure hits) · herosweep / lostev / combo / leak""")
# ---- Picture pose sheets (owner 2026-11-27 09:06 'ขอพร้อมทำรูปดีกว่า': the cat's extra poses as ChatGPT pictures instead of
# videos, like the wolf / jaguar 2.5D pose sheets that tools/sheet_state.py cuts straight into atlas states). One box per sheet,
# every box self-contained; the style / camera / look / background lines are the sit box's own lines (the sit box went out
# first, so every sheet describes him the same way). Lessons of the wolf's axe round: the weapon described part by part as one
# rigid object, the figure drawn small enough that the weapon fits ('never shorten it'), where the weapon is in every frame.
# `python3 tools/clip_prompts.py cat25 sheets [print]` writes <HERO>_POSE_PROMPTS_TH.md (print = only the boxes).
SHEETS = {}
_SIT25 = POSES['cat25']['still']['box'].split('\n')
def _line25(p):
    return next(l for l in _SIT25 if l.startswith(p))
_STY25, _CAM25, _LOOK25, _BG25 = _line25('Style:'), _line25('Camera:'), _line25('His look'), _line25('Background:')
_USE25 = ("Use the attached pictures: the 2.5D picture of him in a front three-quarter view (turned toward the lower right) "
          "shows exactly how he looks and how he is rendered; if more pictures of him are attached, they show him from other "
          "sides. Copy his look and the rendering exactly, but not the standing pose.")
_USE25ALL = ("Use the attached pictures: they show him from several sides, exactly as he looks and how he is rendered from "
             "each side — copy his look and the rendering exactly, but not the standing pose.")
_KAT25 = ("His katana: the one katana described above, with a long, slightly curved single-edged blade of plain grey steel — "
          "the whole sword is about as long as he is tall. It is one rigid object that never changes from frame to frame: "
          "always the same length and shape, never shorter, never bent, never a second sword. Its black lacquered sheath "
          "always stays tucked through his sash on his LEFT hip; when the sword is drawn, the empty sheath stays there. When "
          "he holds the drawn sword in both paws, his right paw grips the hilt just below the guard and his left paw grips it "
          "next to the gold end cap.")
_KAT25S = ("His katana: the one katana described above — the whole sword is about as long as he is tall — stays in its black "
           "lacquered sheath, tucked through his sash on his LEFT hip with the hilt pointing forward, in every frame; he "
           "never draws it in this sheet. It is one rigid object: never shorter, never bent, never a second sword.")
_VIEW25 = ("View: every frame shows him from the same front three-quarter view as the 2.5D picture — body and face turned "
           "toward the lower right of the picture.")
_NOFX25 = ("No effects at all: no slash trails, motion lines, speed lines, glow, sparkles, dust, cracks, impact bursts, "
           "cherry petals, wind lines, fire, ghost flames, oni spirits, symbols, text, numbers or frame borders — only the "
           "cat, his katana and what he carries; show the movement with the pose alone. The blade is plain steel and the "
           "bells and the gold never glow. No green anywhere on him: the straw is warm golden yellow, the kimono plum "
           "purple, the tail tips pale lavender.")
_GRID25 = {'2x4': ("%d frames in 2 rows of 4, read left to right, top row first. Each frame sits in its own eighth of "
                   "the picture"),
           '2x3': ("%d frames in 2 rows of 3, read left to right, top row first. Each frame sits in its own sixth of the "
                   "picture"),
           '2x2': ("%d frames in a 2×2 grid read like a book (top-left, top-right, bottom-left, bottom-right). Each frame "
                   "sits in its own quarter of the picture")}
def _rules25(hat=True, mask=True):
    r = ["He has TWO separate tails in every frame, both always visible; they never merge into one tail."]
    if hat:
        r.append("The big straw hat stays on his back in every frame, never on his head.")
    if mask:
        r.append("The white fox mask hangs at his RIGHT hip in every frame.")
    return ' '.join(r)
def _box25(what, n, grid, pct, frames, rules, after='', view=_VIEW25, use=_USE25, sword=False):
    """sword=True: he draws the katana in this sheet (drawn-sword paragraph + 'never shorten it to fit'); else it stays sheathed."""
    fit = ", so the whole katana fits in every pose — never shorten the katana to make it fit" if sword else ""
    lay = ("Layout: landscape 1536×1024, " + _GRID25[grid] % n + ", the cat the same size in every frame — when he "
           "crouches he gets lower, never bigger — his whole body (both ears, both tails, the whole straw hat, the whole "
           "katana and his feet) inside his own frame with clear empty green space around it; frames never touch or "
           "overlap. Draw him small: standing up straight he would be only about %d%% of a frame's height%s." % (pct, fit))
    L = ["2.5D game sprite sheet — the two-tailed cat swordsman's %s." % what, use, _STY25, _CAM25, _LOOK25,
         _KAT25 if sword else _KAT25S, rules,
         view, lay, 'Frames:'] + ['%d. %s' % (i + 1, f) for i, f in enumerate(frames)]
    if after:
        L.append(after)
    return '\n'.join(L + [_BG25, _NOFX25])
_SH25 = {}
_SH25['charge'] = dict(n='①', th='ท่าชาร์จ (8 เฟรม)', prio='สำคัญ',
  use='Mountain Cleave · Sky Drop · Final Cleave · Oni Executioner · Avalanche Rush (ช่วงชาร์จ)',
  frames='1 ยืน → 2–5 ย่อลง → 6–8 ท่าค้าง (เล่นวนระหว่างชาร์จ) — ลำดับเดียวกับแผ่นชาร์จแมวขาวเดิม `charge_sheet.webp` → โค้ดเดิมใช้ได้เลย',
  box=_box25("iai charge stance (the low ready crouch he holds before drawing his sword), 8 frames", 8, '2x4', 55, [
    "Standing calm as in the 2.5D picture: his left paw resting on the sheath just under the guard, his right paw relaxed "
    "at his side, both tails behind him.",
    "His right paw reaches across his body to the hilt, his body starts turning toward the lower right, his feet still "
    "close together.",
    "He steps his front foot forward toward the lower right, knees starting to bend, his right paw gripping the hilt, his "
    "left paw holding the sheath with the thumb against the guard.",
    "Sinking lower: knees bent, body leaning forward, head lowering, eyes narrowing.",
    "Deep iai stance: a very low, wide stance — front knee bent deep over the front foot, back leg stretched out behind — "
    "upper body leaning forward, head low, his half-closed golden eyes sharp and fixed on the lower right; his right paw "
    "on the hilt ready to draw, his left paw holding the sheath; both tails stretched out low behind him.",
    "The same deep stance, almost identical — only his tails, his mane and the straw cloak moved very slightly, as if he "
    "is breathing and gathering power.",
    "The same deep stance again with another very small change.",
    "The same deep stance again, almost identical to frame 6, so frames 6 to 8 can loop."],
    _rules25()))
_SH25['jump'] = dict(n='②', th='ท่ากระโดดฟันลง (6 เฟรม)', prio='สำคัญ', use='Sky Drop · Earthfall',
  frames='1 ย่อ → 2 ถีบตัว → 3–4 ลอย (ไล่ตามช่วงลอยจริง เกมยกตัวเอง) → 5 ลงพื้นดาบชี้พื้น (= จังหวะโดน) → 6 ลุก',
  box=_box25("leaping downward cut, 6 frames", 6, '2x3', 40, [
    "Crouch to spring: knees bent deep, body low and leaning forward, the katana already drawn and held low behind his "
    "right side in both paws with the blade pointing back, eyes on the target to the lower right.",
    "Take-off: legs pushing off the ground, body rising and leaning forward, the katana swinging up past his right "
    "shoulder in both paws.",
    "Rising: in the air with his knees tucked up, both paws above his head, the katana raised high above him pointing up "
    "and back.",
    "Top of the leap: body arched back, both paws above his head, the katana swung back over his head with the blade "
    "pointing down behind his back, ready to cut; both tails, the straw cloak and his mane streaming upward.",
    "Landing cut: landed in a deep crouch, one knee down and one foot planted, both paws low in front of him, the katana "
    "brought all the way down in front of him toward the lower right with its tip just above the ground (not touching "
    "it), head low, both tails thrown forward.",
    "Rising from the cut: still crouched, starting to stand up, the katana held low in front of him in both paws."],
    _rules25(), "Frames 2 to 4 are in the air (feet off the ground); draw them the same size as the other frames. The "
    "empty sheath stays at his left hip.", sword=True))
_SH25['dash'] = dict(n='③', th='ท่าพุ่งต่ำ (4 เฟรม)', prio='สำคัญ', use='Cat Step · Mirage Step · ช่วงวิ่งของ Avalanche Rush',
  frames='1–3 วนเป็นจังหวะวิ่งระหว่างพุ่ง → 4 เบรกไถลตอนถึง',
  box=_box25("low sprinting dash, 4 frames", 4, '2x2', 50, [
    "Pushing off: body leaning far forward and low, his front leg reaching forward toward the lower right and his back "
    "leg pushing off behind, his right paw on the hilt and his left paw holding the sheath steady, head forward, eyes "
    "fixed ahead, both tails streaming straight out behind him, the straw cloak flying back.",
    "Mid-stride: both feet off the ground in a long, low stride, body flat and low, tails and cloak streaming back.",
    "The other leg forward, the same low lean, tails streaming back.",
    "Sliding stop: feet planted wide and skidding, knees bent, body coming upright and turned a little, his right paw on "
    "the hilt, ready to draw."],
    _rules25(), "Frames 1 to 3 are one running stride; frame 4 is where he stops."))
_SH25['roll'] = dict(n='④', th='ท่าม้วนกลิ้ง (4 เฟรม)', prio='สำคัญ', use='Nekomata Roll (ตอนนี้เล่นท่าโดนตีแทน)',
  frames='1 พุ่งตัว → 2–3 ม้วนเป็นลูกบอล → 4 ลุกขึ้นหมอบ (ไล่ตามช่วงกลิ้ง)',
  box=_box25("quick forward roll, 4 frames", 4, '2x2', 50, [
    "Diving into the roll: crouched low, head tucking in, both paws holding the sheathed sword close to his body, body "
    "tipping forward toward the lower right.",
    "Rolling: curled into a tight round ball on his shoulder — head tucked under, knees pulled up to his chest, both tails "
    "and the straw cloak wrapped round the ball, the straw hat pressed flat against his back.",
    "Halfway over: the same tight ball turned upside down, his sandals on top and his back underneath.",
    "Out of the roll: up in a low crouch on both feet, facing the lower right again, his right paw on the hilt, ready."],
    _rules25()))
_SH25['spin'] = dict(n='⑤', th='ท่าหมุนดาบรอบตัว (4 ด้าน = หมุน 1 รอบ)', prio='ดี', use='Grinding Wheel',
  frames='4 ด้านวนตามทิศที่หมุน (แทนการวนเฟรมฟัน 8 ทิศ) · แผ่นนี้แนบภาพยืนครบ 5 มุม',
  box=_box25("spinning sword wheel, 4 frames = one full turn in place", 4, '2x2', 45, [
    "Front view, facing us: the blade points out to the left of the picture.",
    "Side view, facing the right of the picture: his sword arm reaches toward us and the blade points toward the lower "
    "left of the picture.",
    "Back view: we see the big straw hat on his back and both tails; the blade points out to the right of the picture.",
    "Side view, facing the left of the picture: his sword arm reaches away from us and the blade points toward the upper "
    "right of the picture, partly behind his body."],
    _rules25(),
    view=("View: the four frames are one full turn in place, all from the same camera; in every frame his feet stay on the "
          "same spot, his right arm is stretched straight out to his right side at waist height holding the drawn katana "
          "level and pointing outward like the spoke of a wheel, his left paw holds the empty sheath at his hip, and he "
          "leans a little into the spin with his straw cloak, both tails and his mane flaring out."),
    use=_USE25ALL, sword=True))
_SH25['throw'] = dict(n='⑥', th='ท่าขว้างงอบ (4 เฟรม)', prio='ดี', use='Kasa Throw',
  frames='1–2 ก่อนปล่อย → 3 = จังหวะงอบออกจากมือ → 4 ค้าง · งอบที่บินออกไปเกมวาดเอง (ตัดภาพงอบจากเฟรม 3 ได้)',
  box=_box25("straw hat throw, 4 frames", 4, '2x2', 50, [
    "Reaching back: his right paw reaches up over his right shoulder and grips the rim of the big straw hat on his back, "
    "his left paw on the sheath, body starting to twist.",
    "Wind-up: the hat pulled off his back and swung across his body to his left side at chest height, held flat by its "
    "rim like a flying disc, body twisted away, weight on his back foot.",
    "Throw: his right arm whipped forward toward the lower right, the hat just leaving his paw and flying flat, body "
    "leaning forward, weight on his front foot.",
    "Follow-through: his right arm stretched out forward toward the lower right with the paw open, eyes following the "
    "throw; the hat is gone — it is not in this frame at all and not on his back."],
    _rules25(hat=False),
    "The hat is on his back only in frame 1; in frames 2 and 3 it is in his paw; in frame 4 there is no hat anywhere."))
_SH25['roar'] = dict(n='⑦', th='ท่าคำราม (4 เฟรม)', prio='ดี', use='Oni Roar',
  frames='1 → วน 2–3 (= ช่วงคำราม) → 4',
  box=_box25("oni war roar, 4 frames", 4, '2x2', 50, [
    "Drawing breath: chest swelling, shoulders up, head tilted back a little, mouth closed, paws clenched at his sides "
    "(his left paw on the sheath).",
    "Roar: leaning forward with his head thrust toward the lower right, mouth wide open showing his fangs, eyes wide and "
    "fierce, ears laid back, his mane, fur and both tails bristling up, paws spread wide with claws out.",
    "The same roar a moment later, almost identical — his mane, the straw cloak and both tails swayed the other way — so "
    "frames 2 and 3 can loop.",
    "Ending: mouth closing, standing tall again and breathing out, his face calming back to his usual sly look, paws back "
    "at his sides."],
    _rules25()))
_SH25['chop'] = dict(n='⑧', th='ท่าฟันลงจากเหนือหัว (6 เฟรม)', prio='ดี',
  use='Mountain Cleave · Quake Slash · Final Cleave · Oni Executioner — สายอสูรได้ท่าฟันหนักของตัวเอง แยกจากท่าชักดาบตวัดขึ้นของสายลม',
  frames='1–4 ก่อนโดน → 5 ดาบชี้พื้น (= จังหวะโดน) → 6 เก็บดาบ · สกิลที่ชาร์จ: ท่าชาร์จ ① มาก่อนแล้วต่อเฟรม 2',
  box=_box25("overhead downward cut, 6 frames", 6, '2x3', 40, [
    "Drawing: his right paw pulls the katana out of the sheath on his left hip, the blade sweeping up across his body.",
    "Raised: both paws on the hilt, the katana held high above his head with the blade pointing up and back, body "
    "stretched tall, weight on his back foot, eyes on the target to the lower right.",
    "Cut begins: the blade starting to come down above his head, his front foot stepping forward toward the lower right.",
    "Cutting down: the katana swinging down in front of him at chest height, both arms reaching forward, body lunging.",
    "End of the cut: a deep lunge toward the lower right, front knee bent, both paws low in front of him at knee height, "
    "the katana brought all the way down with its tip just above the ground in front of him (not touching it), head "
    "low, both tails thrown forward.",
    "Recovering: rising from the lunge and sliding the blade back into the sheath on his left hip."],
    _rules25(), "The empty sheath stays at his left hip while the sword is out.", sword=True))
_SH25['mask'] = dict(n='⑨', th='ท่าสวมหน้ากาก (4 เฟรม)', prio='เสริม', use='Ashura Mask',
  frames='1 → 2 → 3 แนบหน้า (= จังหวะบัฟติด) → 4 ค้าง · เฟรม 4 = ต้นแบบหน้ากากที่ค้างบนหน้าตลอดบัฟ',
  box=_box25("mask move: putting the white fox mask on his face, 4 frames", 4, '2x2', 50, [
    "His right paw lifts the white fox mask off his right hip by its red cord, eyes on the mask.",
    "Raising the mask up in front of his face, its fox face turned away from him toward the lower right.",
    "Pressing the mask onto his face with his right paw: the white fox mask now covers his whole face, his ears and mane "
    "showing around it.",
    "Wearing the mask: the white fox mask over his face with its red markings, its red cord tied behind his head, his "
    "right paw lowered to his side, standing tall and still, his left paw on the sheath."],
    _rules25(mask=False), "From frame 3 on the mask is on his face and no longer at his hip."))
SHEETS['cat25'] = dict(
  title='แมวโรนิน 2.5D (เนโกะมาตะพเนจร) — ภาพแผ่นท่าเสริม 9 แผ่น + ภาพท่านั่ง 8 มุม',
  header="""เจ้าของ 2026-11-27 08:09 ขอพรอมต์ท่าพิเศษเป็นวิดีโอ (เก็บไว้ที่ `CAT25_POSE_CLIP_PROMPTS_TH.md`) → 09:06 "ขอพร้อมทำรูปดีกว่า" → ไฟล์นี้ = ท่าเดิมทั้ง 9 ท่า แต่เป็นภาพแผ่นท่าจาก ChatGPT แบบท่าเสริม 2.5D ของหมาป่ากับจากัวร์ (`tools/sheet_state.py` ตัดแผ่นเข้าแอตลาสได้ตรงๆ ไม่ต้องมีทางรับวิดีโอ) + ท่านั่ง ⑩ กล่องเดิมที่ส่งไปแล้ว · ภาพยืน 2.5D ของเจ้าของยังไม่อยู่ใน repo (ตามที่สั่ง) — เจ้าของแนบเอง

## ทำไมต้องมีท่าเสริม
คลิป 20 ตัวให้แค่ 5 ชุดท่า: ยืน · เดิน · ชักดาบตวัดขึ้น (attack) · ท่ารวมสมาธิ (buff) · โดนตี — สกิลที่ไม่ใช่การชักดาบตวัดขึ้นต้องยืมท่าพวกนี้ (อ่านจาก `char_cat.js`): ท่าชาร์จก่อนฟันมาจากแผ่นแมวขาวลุคเดิม (แอตลาส 2.5D ไม่มี) · Sky Drop / Earthfall กระโดดลอยแต่ภาพเป็นท่าชักดาบ · Cat Step / Mirage Step / ช่วงวิ่งของ Avalanche Rush เล่นแถวเดินเร็ว ×3 · Nekomata Roll เล่นท่าโดนตี · Grinding Wheel วนเฟรมฟัน 8 ทิศ · Kasa Throw / Oni Roar / Ashura Mask ใช้ท่ารวมสมาธิท่าเดียวกับบัฟทั้งหมด · ท่าฟันของสายอสูร = ท่าชักดาบตวัดขึ้นเหมือนสายลม

## วิธีใช้
- เปิดแชต ChatGPT ใหม่ 1 แชต · ทุกกล่องแนบ**รูปที่ 1** (ภาพยืน 2.5D เฉียงหน้า หันไปทางขวาล่าง ที่ส่งมาเมื่อ 2026-11-26 20:22) · แนบครบ 5 มุมด้วยก็ได้ (ช่วยให้เห็นด้านหลัง) — **กล่อง ⑤ ต้องแนบครบ 5 มุม**
- วางกล่องทีละกล่อง ได้รูปแล้วค่อยวางกล่องต่อไป · ทำ ①–④ ก่อน (สกิลพวกนี้ยืมท่าผิดชัดที่สุด)
- ไม่แนบชีตออกแบบ 2D หรือภาพหน้าโหลด (มันจะดึงกลับเป็นภาพวาดแบน) · ห้ามแนบไฟล์ .md นี้ให้ ChatGPT
- มุมเดียวพอ (เฉียงหน้า หันขวาล่าง): เกมกลับด้านเองตอนหันซ้าย · ตอนหันขึ้นใช้เฟรมจากคลิป 20 ตัวต่อ · ท่าหมุน ⑤ มี 4 ด้านในแผ่นเดียว · ท่านั่ง ⑩ 8 มุม
- ได้แผ่นไหนส่งมาแผ่นนั้น ไม่ต้องรอครบ

## กติกาในทุกกล่อง
- ลุค / กล้อง / หน้าตาทั้งตัว / พื้นเขียว = บรรทัดเดียวกับกล่องท่านั่งที่ส่งไปก่อน (สคริปต์ดึงจากกล่องนั้น) → ทุกแผ่นบอกหน้าตาเหมือนกันทุกคำ
- ดาบบอกเป็นชิ้นเดียวแข็ง ยาวเท่าตัว ห้ามหด ห้ามงอ ห้ามมีสองเล่ม · ฝักอยู่สะโพกซ้ายตลอดแม้ชักดาบออก (บทเรียนรอบขวานหมาป่า)
- ขนาดตัวในแผ่น: ยืนตรงสูง ~55 % ของช่อง (แผ่น 8 เฟรม ดาบอยู่ในฝัก) · ~40 % (แผ่น 6 เฟรมที่ชักดาบชูสูง) · ~45–50 % (แผ่น 4 เฟรม) — ตัวเท่ากันทุกเฟรม ย่อตัวแล้วเตี้ยลงแต่ไม่ใหญ่ขึ้น
- หางสองหางทุกเฟรม · งอบอยู่หลัง (ยกเว้นแผ่นขว้าง) · หน้ากากที่สะโพกขวา (ยกเว้นแผ่นสวมหน้ากาก) · ไม่มีเอฟเฟกต์ ไม่มีเงา ไม่มีตัวหนังสือ กรอบ หรือตัวเลข""",
  boxes=_SH25,
  fixes="""แก้รูป (ส่งต่อท้ายในแชตเดิม):
- เหลือหางเดียว → `Redo: he must have TWO separate tails in every frame, both visible.`
- ตัวแบนเหมือนภาพวาด → `Redo: make him look like the attached 2.5D picture — a 3D game model with rounded volume and soft 3D shading, clean hand-drawn outlines.`
- เฟรมชนกัน / หลุดกรอบ → `Redo: draw him smaller so each frame, including the whole katana, the straw hat and both tails, fits inside its own area with green space around it.`
- ตัวโตไม่เท่ากัน → `Redo: draw him the same size in every frame; when he crouches he gets lower, not bigger.`
- ดาบสั้น / งอ / มีสองเล่ม → `Redo: one katana in every frame, always the same full length and shape as in the picture — draw him smaller if it does not fit.`
- งอบขึ้นไปอยู่บนหัว → `Redo: the straw hat stays on his back, never on his head.`
- ฝักดาบ / หน้ากากสลับข้าง → `Redo: the sheath is on his LEFT hip and the fox mask on his RIGHT hip, in every frame.`
- หันผิดทาง (ไม่ใช่แผ่น ⑤) → `Redo: every frame faces the lower right, the same view as the attached 2.5D picture.`
- จำนวน / ลำดับเฟรมผิด → `Redo: exactly the frames listed, in that order, in the grid described.`
- มีเอฟเฟกต์ (แสง เส้นฟัน ฝุ่น ไฟ) → `Redo: remove every effect — only the cat on flat green.`
- ฟางออกเขียว → `Redo: the straw is warm golden yellow, not greenish.`
- แก้แค่บางเฟรม → ใช้แปรงเลือกเฉพาะเฟรมนั้นใน ChatGPT (สั่งแก้ทั้งภาพ มันจะวาดใหม่หมด)""",
  sit=dict(POSES['cat25']['still'], th='ท่านั่งพัก (ภาพ 8 มุม)', head='## ภาพท่านั่ง (กล่องเดิมที่ส่งไปแล้ว ถ้าทำแล้วข้ามได้)'),
  footer="""## พอได้รูปแล้วทำต่อยังไง (โน้ตสำหรับแชตที่ทำต่อ)
1. รอแอตลาส 2.5D จากคลิป 20 ตัวก่อน (ท้าย `CAT25_CLIP_PROMPTS_TH.md`) — ท่าเสริมต้องใช้ cell / pivot / สเกลเดียวกับแอตลาสนั้น · เก็บแผ่นดิบไว้ที่ `assets/heroes/cat/poses25/<ท่า>.webp` ได้ตั้งแต่ได้รูป
2. ตัดแต่ละแผ่นเป็น state: `python3 -I tools/sheet_state.py tools/clips/cat25_<ท่า>.json [preview.png]` (แบบ `jaguar25_<ท่า>.json` / `wolf25_<ท่า>.json`) · rows / cols ตามแผ่น · scale = เทมเพลตหัว (หน้า + หู) เทียบ idle SE ของแอตลาส · anchor กลางเท้า เฟรมลอย (② 2–4 · ③ 2 · ④ 2–3) ใช้สะโพกเหนือเท้าต่ำสุด (เกมยกตัวด้วย player.z) · `store` = cellScale ของแอตลาส · `clean` / `erase` / `tone` ตามต้องการ · `sockets` + `sheet_coords` = ปลายดาบ / ด้ามทุกเฟรมของ jump / spin / chop (อ่านด้วยตา แบบ `wolf25_dance.json`) ให้เส้นฟันตาม
   - state: `charge` 8 (0 ยืน · 1–4 ย่อลง · 5–7 ค้าง = ลำดับเดียวกับแผ่นเดิม → `ktChargeSeq` ใช้ได้เลย) · `jump` 6 · `dash` 4 · `roll` 4 · `spin` 4 (มุม S E N W) · `throw` 4 · `roar` 4 · `chop` 6 · `mask` 4
   - งอบที่บินออกไป: ตัดงอบจากเฟรม 3 ของ ⑥ แทนรูป `18_kasa` เดิม (งอบแมวขาวลุคเก่า) · หน้ากากที่ค้างบนหน้าตลอดบัฟ: เฟรม 4 ของ ⑨ เป็นต้นแบบ (ต้องจับจุดหัวต่อเฟรมแบบ `tools/headtrack.py` ก่อน — `cat_mask.js` จับจากงอบบนหัวของแมวขาวเดิม)
3. ผูกท่าในไฟล์ใหม่ `cat_pose.js` (แบบ `jaguar_pose.js` / `wolf_pose.js`): เปลี่ยนแค่เฟรมที่โชว์ — ความยาว เวลาโดน event ทุกตัวเท่าเดิม · ท่ามุมเดียวใช้ตอนหัน S SE E SW W · `?catpose=0` = ท่าเดิม
   - ชาร์จ: state `charge` ใหม่แทนตัวเดิม (`ktChgDir` เช็ก `SPR_META.states.charge` อยู่แล้ว)
   - กระโดด: Sky Drop (ช่วงลอย .28 วิก่อน windup = เฟรม 2–4 · contact = เฟรม 5) · Earthfall (ลอยตลอดช่วง wind-up)
   - พุ่ง: Cat Step · Mirage Step (`ktDash` `st` 'walk' → 'dash' วน 1-2-3-2 แล้วเฟรม 4 ตอนถึง) · ช่วงวิ่งของ Avalanche Rush
   - กลิ้ง: Nekomata Roll (`ktDash` `st` 'hurt' → 'roll')
   - หมุน: Grinding Wheel (4 ด้านตามทิศที่หมุน แทนเฟรมฟัน 8 ทิศ — 3 รอบหมุนตาม DIR8 อยู่แล้ว)
   - ขว้าง / คำราม / หน้ากาก: Kasa Throw (เฟรม 3 = ตอนปล่อยงอบ tP×.6) · Oni Roar · Ashura Mask (`buffAct`: เฟรมค้าง = จุด peak เดิม)
   - ฟันลง: Mountain Cleave · Quake Slash · Final Cleave · Oni Executioner (แทนเฟรมท่าตีทีละช่อง เวลาเท่าเดิม · contact = เฟรม 5 · ท่าชาร์จยังแทนเฟรมก่อน `KT_DRAWF`) + เส้นฟันใน `cat_vfx.js` (KArc) เป็นรูป 'down' สำหรับ 4 สกิลนี้
4. ท่านั่ง: โหมด `pics` ของ sheet_state (แบบ `jaguar25_sit.json` / `wolf25_sit.json`) → `assets/sit/cat25_<8 ทิศ>.webp` + รายการ cat ใน `hero_sit.js` (เลือกตามแอตลาสที่โหลด)
5. เช็ก: make() ทุกสกิลที่เปลี่ยน × 8 ทิศ (ความยาว / windup / event เท่ากับ `?catpose=0`) · `tools/fxlab.py hits cat` (FXSEED + sure hits) · herosweep / lostev / combo / leak

## สร้างแล้ว (2026-11-27)
- **ได้มา:** 8 แผ่นตามกล่อง ① ชาร์จ ② กระโดด ③ พุ่ง ④ กลิ้ง ⑤ หมุน ⑥ ขว้างงอบ ⑦ คำราม ⑧ ฟันลง + 2 แผ่นที่เจ้าของทำเอง (โดนตี 4 มุม · ล้ม KO 4 มุม) · ⑨ หน้ากากไม่ได้ทำ — เจ้าของ 2026-11-26 19:40 'แฟชั่นยังไม่ต้องทำ ไม่ต้องทำหน้ากากตอนอัลติด้วย' · ⑩ ท่านั่งมาทีหลัง (2026-11-27 10:56 'ท่านั่ง')
- **ไฟล์:** ภาพดิบ `assets/heroes/cat/poses25/<ท่า>.webp` · spec `tools/clips/cat25_<charge|jump|dash|roll|spin|throw|roar|chop|hurt|ko>.json` (scale = ขนาดหัวเทียบ idle SE, จุดยึดเท้า / สะโพกตอนลอย, erase = สายฟ้า ดาว วงหมุน และงอบที่บินออกไปในเฟรม 3 ของท่าขว้าง เพราะเกมวาดงอบบินเอง) → `python3 -I tools/sheet_state.py tools/clips/cat25_<ท่า>.json [preview.png]` ลงใน `assets_cat25.js` แล้วรัน headtrack ปิดท้าย
- **ใหม่ใน sheet_state.py:** `"views"` = แถวของแต่ละทิศสร้างจากเฟรมของแผ่น (โดนตี / KO: S กับ SE ใช้ภาพหน้า, E / NE / N ภาพของมุมนั้น) · `"nudge"` = ขยับกล่องแต่ละเฟรม (โดนตีถอยหลังทีละนิดตามทิศ)
- **ผูกท่า `cat_pose.js`** (เปลี่ยนแค่เฟรม ความยาว / windup / event / contact เท่าเดิม · ท่ามุมเดียวใช้เมื่อหันหน้า S SE E SW W · ทิศหลังใช้เฟรมคลิป · `?catpose=0` = เฟรมคลิปล้วน):

| ท่า | สกิล |
|---|---|
| charge | ท่าชาร์จเดิมของ char_cat.js (Mountain Cleave · Sky Drop · Final Cleave · Oni Executioner · Avalanche Rush) — state ใหม่ลำดับเฟรมเดียวกัน ใช้ได้เลย |
| jump | Sky Drop (ลอย .28 วิสุดท้ายก่อน windup แล้วลงท่าลงพื้น) · Earthfall (ลอยตลอดช่วง wind-up) |
| dash | Cat Step · Mirage Step (เงาร่างใช้ท่าเดียวกัน) · ช่วงวิ่งของ Avalanche Rush |
| roll | Nekomata Roll (ทุกทิศ) |
| spin | Grinding Wheel (4 ด้านหมุนตามเข็มนาฬิกา 3 รอบ ทุกทิศ) |
| throw | Kasa Throw (เฟรม 3 = ตอนปล่อยงอบ) |
| roar | Oni Roar · Ashura Mask (ไม่มีหน้ากากบนหน้า) |
| chop | Mountain Cleave · Quake Slash · Final Cleave · Oni Executioner (ต่อจากท่าชาร์จ · contact = เฟรม 5 · เส้นดาบเป็นแบบฟันลง `_ktShape` 'down') · ท้าย Avalanche Rush |
| hurt | ท่าโดนตีทุกครั้ง (แถว hurt เดิม 7 เฟรม) |
| ko | ตอนตายในโหมดเล่น (#deathov ขึ้นและไม่มี action) |

- **ท่านั่ง ⑩ (10:56):** ChatGPT วาดไม่ตรงลำดับที่สั่ง — แผ่นจริง = SE, S, SE ซ้ำ, E / NE, N, NW, W และไม่มีมุมเฉียงหน้าซ้าย (SW) → spec `tools/clips/cat25_sit.json` (โหมด `pics`, names ตามลำดับแผ่น · SW = ภาพที่ 3 พลิกซ้ายขวา ด้วยตัวเลือกใหม่ `"mirror": ["SW"]` — ท่ายืน SW ของเกมก็พลิกจาก SE เหมือนกัน) → `assets/sit/cat25_<8 ทิศ>.webp` · k .41 = ขนาดหัวเทียบ idle (S .415 · SE .40 / .405 · E .405) · cx = ตำแหน่งหัวตอนยืนของทิศเดียวกัน (หัวไม่กระโดดตอนนั่ง / ลุก) · fy = ขอบล่างของขาที่ขัดสมาธิ (หางวางข้าง / หลังต่ำกว่านั้นได้) · `hero_sit.js` รายการ cat เมื่อ `window.CAT25` (`?cat25=0` = รูปนั่งแมวขาวเดิม) · สถานะนั่งพักเป็นของ char_cat.js เอง · เช็กแล้ว: ยืน / นั่ง 8 ทิศในเกม (jpnF1) ขนาดหัวเท่ากัน สถานะนั่งพักขึ้น ไม่มี error · `jaguar25_sit` / `wolf25_sit` ตัดใหม่ได้ไฟล์เดิมทุกไบต์
- **อื่น ๆ:** หน้า HUD `assets/heroes/cat/face25.webp` · `cat_vfx.js` จุดอุ้งมือบนด้ามตอนชาร์จ (`CHG_HILT`) + `leadOf` อ่าน `a._ctT` · ปีกแฟชั่นเดิมยังใส่ได้ (รากปีกย้ายมาที่หลัง ตามจุดหัวใหม่) · หน้ากากตอนอัลติปิด (`MASK25` ใน cat_mask.js — ภูตอสูรไฟยังเล่นด้านหลัง)
- **เช็กแล้ว:** make() 31 สกิล + ตีปกติ × 8 ทิศ เท่ากับ `?catpose=0` ทุกค่า · `tools/fxlab.py hits` ทุกสกิลเท่ากับ `?cat25=0` (FXSEED 7 + sure hits) · ตีปกติ 4.5 วิ + ทุกปุ่มสกิลเวลาเกมเท่ากัน · herosweep / lostev / combo / leak สะอาด · play1 (สร้างแมวใหม่ → jpnT → jpnF1 ฆ่ามอน) · PC + มือถือ 844×390
- **ยังไม่ได้:** ท่าเสริมมุมหลัง (N NE NW) · ไอคอน / ภาพพื้นหลังต้นสกิล / ภาพเอฟเฟกต์วาด (ยังเป็นแมวขาวลุคเก่า)""")
# Nine-Tail Miko 2.5D (owner 2026-11-26 20:24 'ขอพร้อมทำสไปร้2.5d' + his look-5 sheet 'Nine-Tail Miko Reborn'): her FIRST own
# sprite (until now she wears the wolf placeholder assets.js) → no flat 'kitsune' entry; written straight for the 2.5D look
# with every lesson of the wolf / jaguar / rhino / anubis rounds: eyes open in idles, no walking toward the camera, the staff
# cast says no attack / slash words and keeps the air round the orb empty, no glow round the pink orb, no symbols; the nine
# tails keep their number (video models merge / add tails); hands not named (the start frame shows which hand holds the staff).
# 2026-11-26 20:48 her 5 standing views came + 'ขอพร้อมอย่างเดียว รูปที่ส่งไม่ต้องทำไร' → he attaches his own views as the first
# frames (like cat25): she fills 65-67 % of the 1254² picture with ~0.33 body of room above → the buff lifts the staff only
# until the orb is a little above her ear tips, the thrust keeps the elbows a little bent; face / back lines read off the views.
HEROES['kitsune25'] = dict(
  title='จิ้งจอกเก้าหาง 2.5D (มิโกะเก้าหางโฉมใหม่ แบบโมเดล 3D มองจากด้านบน · Nine-Tail Miko Reborn 2.5D)',
  who='the nine-tailed fox shrine maiden in this picture', P='She', p='she', pos='her', weapon='staff',
  face="Keep her face exactly as in the picture: the same big amber-red eyes with the sharp red eyeliner, the same three red "
       "stripe marks on each cheek and the same serious, focused look with her brows drawn slightly together, small mouth "
       "closed.",
  back_face={'NE': "We see her mostly from behind: the back of her head with her long white hair, both fox ears from behind, "
                   "the twisted red rope loop and the red flower with its gold bell and red tassels at the back of her head, "
                   "and her nine tails fanned out over her back like a big open flower; of her face only the edge of her "
                   "cheek on the right shows, as in the picture; her face never turns toward us.",
             'N': "We only see the back of her head with her long white hair, the backs of both fox ears, the twisted red "
                  "rope loop and the red flower with its gold bell and red tassels at the back of her head, and her nine "
                  "tails fanned out over her whole back like a big open flower with only her white socks and geta showing "
                  "below them, as in the picture; her face never turns toward us."},
  keep={d: ("Her big white fox ears with crimson tips, the red flower with its gold bell and red tassels, the twisted red "
            "rope in her hair, the white kimono top and the wide white sleeves with red cherry blossoms, the dark-red sash "
            "with its gold cord knot, big gold bell and gold tassel, the two white paper charms, the short white-and-red "
            "skirt with its pointed front panel, the white socks, the red-strapped black geta, her nine white tails with "
            "crimson tips and the gold staff with its little torii top, pink orb, small red flowers and white paper "
            "streamers stay exactly the same.") for d in ('S', 'SE', 'E')}
       | {d: ("Her big white fox ears with crimson tips, the red flower with its gold bell and red tassels, the twisted red "
              "rope in her hair, her long white hair, her nine white tails with crimson tips, the wide white sleeve with a red "
              "cherry blossom on the arm that holds the staff, the red-strapped black geta and the gold staff with its little "
              "torii top, pink orb, small red flowers and white paper streamers stay exactly the same.") for d in ('NE', 'N')},
  spos={'S': 'beside her', 'SE': 'beside her', 'E': 'a little in front of her', 'NE': 'beside her', 'N': 'beside her'},
  blink=", and her big fox ears twitch once; her eyes stay open for the whole clip",
  vis=" The staff stays visible beside her body and above her tails during the whole move.",
  fmt={'pvis': ('', " The raised staff stays visible beside her head while she holds the pose.")},
  inframe="her whole body, both fox ears, all nine tails and the whole staff stay inside the frame.",
  nofx="No shadow, no flash, no glow, no light around the orb, no sparkles, no particles, no smoke, no flames, no foxfire, "
       "no moonlight, no petals, no light trails, no streaks of colour, no motion lines, no magic effects, no symbols, "
       "no text.",
  look="Keep the exact look of the picture: a stylized 3D game model with soft toon shading and clean dark-brown outlines, "
       "the same colours and the same fur, hair, silk, paper, lacquer, glass and gold textures — not photorealistic and not "
       "a flat drawing. The camera keeps looking down at her from above at the same angle as in the picture.",
  act={
   'idle': "Idle loop of {who}. {facing} She stands gracefully holding her staff upright {spos}, the pink orb at the top, "
           "her other hand relaxed at her side, and breathes slowly: her nine fluffy tails sway slowly in a soft wave one "
           "after another, and her long white hair, the red tassels and the little bells stir a little{blink}. All nine "
           "tails stay attached behind her and keep their number. The last frame matches the first frame so the clip loops.",
   'walk': "Walk loop of {who}. {facing} She walks in place, like on a treadmill, toward the way she is facing: light, "
           "graceful little steps (about two steps per second) in her tall geta, her staff held upright {spos} bobbing a "
           "little with each step, her nine tails bouncing and swaying behind her, her hair and wide sleeves swaying. All "
           "nine tails stay attached behind her and keep their number. She does not move across the frame, she does not "
           "come closer to the camera or move away from it, and the ground does not move. The last frame matches the first "
           "frame so the clip loops.",
   'attack': "Staff cast of {who}. {facing} She takes her staff in both hands, pulls it back beside her shoulder in a short "
             "wind-up, then thrusts it forward toward the way she is facing so the staff points forward and a little up, "
             "the orb farthest forward, like aiming a wand, her elbows still a little bent; she holds that pose for a "
             "moment, then brings the staff back upright {spos}, returns to her starting pose and stands still for the "
             "rest of the clip. The whole move takes about one second. She does not step forward: her feet stay in place "
             "and her tails follow the move.{vis} The staff keeps its full length and shape, and the air around the orb "
             "stays empty and plain green in every frame. Clean outlines in every frame, no motion blur.",
   'buff': "Prayer cast of {who}. {facing} She lifts her staff straight up with the hand that holds it until the pink orb "
           "is a little above the tips of her ears, no higher, the staff still upright, and raises her other hand open in "
           "front of her chest like a prayer, her nine tails spreading a little wider behind her; she holds that pose "
           "still for about one second, then lowers the staff back {spos}, returns to her starting pose and stands still "
           "for the rest of the clip. Her feet stay in place.{pvis} The top of the staff stays inside the frame. Clean "
           "outlines in every frame, no motion blur."},
  dirname={'S': 'หน้าตรง', 'SE': 'เฉียงหน้า หันขวา', 'E': 'ข้าง หันขวา', 'NE': 'เฉียงหลัง หันขวา', 'N': 'หลัง'},
  actname={'idle': 'ยืน (idle · วนลูป)', 'walk': 'เดิน (walk · วนลูป)',
           'attack': 'ยื่นไม้เท้าร่าย (attack · ตีปกติ — เกมเล่นแค่ช่วงง้าง 3 เฟรม → ยื่นสุด → 2 เฟรมหลัง)',
           'buff': 'ชูไม้เท้าอธิษฐาน (buff · สกิลร่ายทุกท่า — เกมปล่อยสกิลที่เฟรมชูสุด)'},
  start='ภาพยืน 2.5D มุม {d} ที่ได้จาก ChatGPT',
  header="""เจ้าของเลือกแบบ 5 'มิโกะเก้าหางโฉมใหม่' 2026-11-26 20:24 ('ขอพร้อมทำสไปร้2.5d' + ชีต `assets/heroes/kitsune/sheet_reborn.webp`) → ภาพใหญ่ = หน้าเลือกตัวแล้ว (`select.webp`, SELV kitsune 2) → 20:48 ส่งภาพยืน 2.5D ครบ 5 มุม + "ขอพร้อมทำอนิเมขั่นขยับ ขอพร้อมอย่างเดียว รูปที่ส่งไม่ต้องทำไร" → ไฟล์นี้ = พรอมต์คลิป 20 ตัวอย่างเดียว · ไม่ได้ตัดภาพตั้งต้น ไม่ได้เก็บภาพยืนไว้ใน repo (ตามที่เจ้าของสั่ง แบบแมว 2.5D) · เจ้าของแนบภาพยืนของทิศนั้นเป็นเฟรมแรกเอง · หน้าตา + พรอมต์ภาพยืน: `KITSUNE_LOOK_PROMPTS_TH.md` หัวข้อ 'เลือกแล้ว: แบบ 5' · เป็นสไปรต์ตัวแรกของเธอเอง (ตอนนี้ในเกมยังใส่ร่างหมาป่า `assets.js`) · ไม่มีชุดคลิปลุคแบนของตัวนี้

## ภาพยืน 2.5D ที่เป็นเฟรมแรก (มาแล้ว 20:48)
- 1254² พื้นเขียว ตัวสูง 65–67 % ของภาพ (ปลายหูถึงพื้นเกี๊ยะ ~815–845 px) ทุกมุมหันขวา ไม่มีสีเขียวบนตัว · ไม้เท้าตั้งตรงสูงเท่าตัว (ยอดเสมอปลายหู) · ที่ว่างเหนือหัว 262–297 px = 0.31–0.36 เท่าตัว (หมาป่า 2.5D .84 · แมว 2.5D ~.5) · ซ้าย / ขวา 298–354 px · ใต้เท้า 141–152 px → ท่าชูไม้เท้าเขียนให้ชูแค่ **ลูกแก้วเลยปลายหูนิดเดียว** (ชูสุดแขนแล้วยอดไม้เท้าหลุดขอบบน) · ท่ายื่นไม้เท้า: ไม่ก้าว ข้อศอกงอนิด (มุมข้าง ไม้เท้าอยู่หน้าตัว ที่ว่างข้างหน้า ~350 px) · ถ้าคลิปไหนยังหลุดขอบภาพ: ย่อภาพก่อนทำคลิป (`python3 -I tools/dir8cut.py startv <โฟลเดอร์> <ทิศ>=<ภาพ> size=1024 feet=.88 ht=460 clean=0` ทีละมุม)
- ตามที่วาด: **S** ไม้เท้าซ้ายของภาพ (มือขวาของเธอ) ลูกแก้วสูงระดับหน้า มืออีกข้างห้อยข้างตัว ดอกไม้แดง + กระดิ่งซ้ายของภาพ หาง 9 หางแผ่สองข้าง หน้าจริงจัง คิ้วขมวดนิด · **SE** แบบเดียวกัน ตัวหันขวาล่าง · **E** ไม้เท้าตั้งหน้าตัว (ขวาของภาพ) มือข้างไกลถือระดับอก แขนข้างใกล้ห้อยข้างตัว หางแผ่หลังตัว (ซ้ายของภาพ) ห่วงเชือกแดง + ดอกไม้ท้ายทอย · **NE** ไม้เท้าขวาของภาพ หางแผ่คลุมหลังเหมือนดอกไม้บาน เห็นขอบแก้มนิดเดียวทางขวา ห่วงเชือก + ดอกไม้ท้ายทอยขวา · **N** ไม้เท้าขวาของภาพ หางคลุมหลังทั้งหมด โผล่แค่ถุงเท้า + เกี๊ยะ ห่วงเชือก + ดอกไม้ท้ายทอยขวา ไม่เห็นหน้า

## วิธีใช้
แนบภาพยืน 2.5D ของทิศนั้น + วางพรอมต์ทีละตัว → 4 คลิปต่อทิศ (ยืน · เดิน · ยื่นไม้เท้า · ชูไม้เท้า) · คลิปละ 3–5 วิ · ไม่ต้องทำทิศซ้าย (เกมกลับด้านเอง) · ส่งกลับเรียง S → SE → E → NE → N ทิศละ ยืน → เดิน → ยื่น → ชู (สลับได้)

## กติกาที่อยู่ในทุกพรอมต์ (บทเรียนจากคลิปหมาป่า / จากัวร์ / แรด / อนูบิส / ฮิปโป / บาสเต็ด / แกะ / ลิง)
- ประโยคบอกทิศขึ้นต้นทุกพรอมต์ กันโมเดลหมุนตัวหันหากล้อง · มุมหลัง (NE, N) 'เห็นแค่หลังหัว หน้าไม่หันมา' + บอกว่าเห็นอะไรตามภาพจริง (ห่วงเชือก ดอกไม้ หางบานเหมือนดอกไม้ ขอบแก้มใน NE)
- ประโยคลุค 2.5D (คีย์ `look`) + กล้องมองลงจากด้านบนมุมเดิม · **ห้ามใช้ชุดพรอมต์แบนกับภาพ 2.5D**
- ยืน: **ลืมตาตลอดคลิป** · เดิน: **ไม่เข้าหา / ถอยห่างกล้อง** · **หาง 9 หางติดอยู่ข้างหลังและจำนวนเท่าเดิม** (โมเดลวิดีโอชอบรวม / เพิ่มหาง)
- ยื่นไม้เท้า: ไม่ใช้คำ attack / slash / strike · อากาศรอบลูกแก้วเป็นพื้นเขียวเปล่าทุกเฟรม · ไม้เท้ายาวเท่าเดิม · ไม่ก้าว ข้อศอกงอนิด · มุมหลังสั่งให้ไม้เท้ายังเห็นข้างตัวเหนือหาง
- ชูไม้เท้า = ยกไม้เท้าตั้งตรงด้วยมือที่ถือ **จนลูกแก้วเลยปลายหูนิดเดียว ไม่สูงกว่านั้น** อีกมือแบหน้าอกแบบอธิษฐาน ค้าง ~1 วิ (เกมค้างเฟรมชูสุดตอนร่ายนาน) · ยอดไม้เท้าอยู่ในภาพ
- ห้ามแสงรอบลูกแก้ว ห้ามไฟจิ้งจอก แสงจันทร์ กลีบดอกไม้ เส้นความเร็ว สัญลักษณ์ (เอฟเฟกต์ใส่ในเกม: `kitsune_vfx.js`) · ไม่ระบุมือซ้าย / ขวา (ภาพตั้งต้นบอกเองว่าไม้เท้าอยู่มือไหน)""",
  footer="""## ตอนคลิปมาถึง (โน้ตสำหรับแชตที่ทำต่อ)
- ตัดด้วย `tools/cliphero.py` + แผนใหม่ `tools/clips/kitsune25_plan.json` (ดู `wolf25_plan.json` / `jaguar25_plan.json`: frames ช่วงลืมตา, เลี่ยงเฟรมที่โมเดลแอบใส่แสง / รอยวง, perDir, scaleFix, breath)
- **ไฟล์ใหม่ `assets_kitsune.js`** (prefix ใหม่ เช่น KIT) สลับใน index.html แบบ BST_ART เฉพาะ `?char=kitsune` + รายการ document.write + ตาราง MB หน้าโหลด · **ห้ามเขียนทับ `assets.js`** (หมาป่าเก่า + ร่างชั่วคราวของสิงโต จระเข้ อีกา อนูบิส)
- **เวลาเฟรมต้องเท่า `assets.js` ทุกทิศ** (เธอถูก bench กับเวลานี้) → เช็ก `python3 tools/fxlab.py hits kitsune` ก่อน / หลัง (FXSEED + o.sure):
  - attack 12 เฟรม 900 ms · S [80,50,90,50,50,50,70,200,50,50,50,110] contact 6 (370 ms) · SE [50,50,190,70,90,50,50,50,50,50,90,110] contact 4 (360) · E [80,50,50,100,50,120,60,120,50,50,50,120] contact 6 (450) · N [110,120,50,50,70,50,120,70,50,50,50,110] contact 6 (450) · NE: atlas เดิมเล่นแถว E (atkRemap NE→E) → คลิป NE ใช้เวลา + contact ของ E แล้วตั้ง atkRemap {} · เฟรม contact = ไม้เท้ายื่นสุด ลูกแก้วอยู่หน้าสุด
  - buff 12 เฟรม 1.4 วิ peak 7 · S [170,50,50,230,50,110,390,50,50,50,50,150] (1,050 ms) · E [70,50,50,50,50,70,170,580,50,50,50,160] (510) · NE [80,60,50,50,50,50,120,160,480,60,60,180] (460) · N [130,50,50,50,50,110,260,450,60,50,50,90] (700) · SE 6 เฟรม [220×6] peak 3 (660) → เฟรม peak = ชูไม้เท้าสุด
  - walk 8 × 100 ms (E สลับ 110 / 90) · idle 12 เฟรม 2.4 วิ · hurt 7 เฟรม 550 ms
- ใครใช้เฟรมไหน (`char_kitsune.js`): `kStaff` = ตีปกติเท่านั้น → attack ตั้งแต่ contact−3 ถึง contact+2 · **ตอนนี้ KIV (`kitsune_vfx.js` v3) สลับตีปกติไปเล่นคลิป buff** (เพราะท่าตีของร่างหมาป่าคือฟันขวาน) → atlas ใหม่มีท่ายื่นไม้เท้าแล้ว ให้ปิดการสลับเฉพาะ atlas ของเธอ (แบบ OWN ใน `bastet_vfx.js`) · `kCast` → buffAct = สกิลทุกท่า → buff ถึง peak = ปล่อยสกิล
- **socket:** `kitsune_vfx.js` tip() / KIV.staffStart / KIV.from อ่าน `player.socket.w` → ไฟจิ้งจอกออกจากหัวไม้เท้า → ทุกเฟรมต้องมี socket = ลูกแก้วชมพู (cliphero orbAll: ตัวจับลูกแก้วหาสีฟ้าเป็นค่าเริ่ม ต้องตั้ง orbMask ให้จับสีชมพู หรือ orbFix อ่านด้วยตา) + liveSocket ขยายตาม CHAR_SCALE (แบบ bastet_vfx.js)
- **ขนาด:** CHAR_SCALE.kitsune ตอนนี้ 1 (ร่างหมาป่า) → วัดใหม่ให้ยืนสูงเท่ามาตรฐาน · HERO_SIZE.kitsune .869 ตั้งตอนเป็นร่างหมาป่า → ถามเจ้าของ (เครื่องปรับขนาด) ว่าเด็กชิบิหาง 9 หางควรสูงเท่าไร
- **ขนาดในคลิป:** ภาพยืนตัวสูง ~66 % ของภาพ → คลิป 544² ตัวสูง ~360 px (ชัดกว่าคลิปรุ่นก่อน ~280) · คลิปชูไม้เท้า ยอดไม้เท้าอาจชิดขอบบน → ดูก่อนตัด (`topFade` ถ้าโดนขอบ)
- **หน้า HUD:** ภาพยืนไม่ได้เก็บใน repo (เจ้าของสั่ง) → ตัดหัวจากเฟรมแรกของคลิปยืน S เป็น `assets/heroes/kitsune/face25.webp` + window.HUD_FACE ใน installKitsune
- `kitsune_art.js` 'tails' (พัดหางครีมปลายชมพู) → ย้อมเป็นขาวปลายแดงเข้มให้เข้ากับหางจริง
- ยังเป็นลุคเก่า: ไอคอน 56, พื้นหลังผังสกิล 032–035, ภาพหน้าโหลด ld1 ld2 ld7 ld8 · ยังไม่มี: ท่านั่ง, ท่าพิเศษ (แบบจากัวร์ / หมาป่า)""")

# Bastet 2.5D = Daughter of Ra (owner 2026-11-26 20:57 picked design 4 of BASTET_LOOK_PROMPTS_TH.md + 'ขอพร้อมเป็น2.5d';
# 21:42 his 5 standing views in the 2.5D look + 'ขอพร้อมทำอนิเมชั่นหน่อยรูปที่ส่งให้ยังไม่ต้องเอาไปทำไร' = prompts only, his
# views are the first frames, not stored in the repo). A complete entry: the flat 'bastet' entry describes her old look
# (braids, veil, dark-blue book). Re-read against his views: book on her left palm (S / SE picture-right at shoulder height,
# E in front of her at chin height on the far hand, NE / N picture-left), the other hand relaxed at her side, the cobra
# peeks out at the right of the disc in NE, only the edge of her right cheek in NE. Lessons kept: 2.5D look, eyes open,
# no walking toward the camera, no attack / claw-slash words, plain green air round the hand, no rings / halos (the first
# Bastet clips baked blue streaks, a flash, a cyan ring and a gold halo), the book flame small and solid, the sun disc never
# shining, the sheet's curse eye / ankhs / locusts / mummies / soul wisps never drawn. Cast: a chibi arm cannot lift the book
# above the disc, so the book floats up off her palm to the disc's height, beside it.
HEROES['bastet25'] = dict(
  title='บาสเทต 2.5D (ธิดาแห่งรา แบบโมเดล 3D มองจากด้านบน · Daughter of Ra 2.5D)',
  who='the little white cat priestess in this picture', P='She', p='she', pos='her', weapon='book',
  look="Keep the exact look of the picture: a stylized 3D game model with soft toon shading and clean dark-brown outlines, "
       "the same colours and the same fur, hair, linen, silk, paper, gemstone and gold textures — not photorealistic and not "
       "a flat drawing. The camera keeps looking down at her from above at the same angle as in the picture.",
  face="Keep her face exactly as in the picture: the same big golden-amber eyes with the bold black winged eyeliner, the "
       "same two short red stripes on each cheek, the same small pink nose and the same calm, proud little cat smile, mouth "
       "closed; her eyes stay open the whole time.",
  back_face={'NE': "We see her mostly from behind: the back of her head with the full curtain of white hair locks and their "
                   "gold beads, both cat ears from behind and the back of the gold sun disc above her head, with the small "
                   "gold cobra peeking out at its right side; of her face only the edge of her right cheek with a red stripe "
                   "shows, as in the picture; her face never turns toward us.",
             'N': "We only see the back of her head with the full curtain of white hair locks down to her waist and their "
                  "gold beads, the backs of both cat ears and the back of the gold sun disc above her head, as in the "
                  "picture; her face never turns toward us."},
  keep={d: ("The gold sun disc with the small gold cobra on top of her head, her big white cat ears with golden tips, her "
            "white hair locks with gold beads, the gold winged collar with its red gem and the gold ankh, the white pleated "
            "dress with its gold hem, the scarlet sash with the big gold sistrum charm and the long scarlet sash ends, the "
            "gold cuffs, anklets and sandals, her white tail with its golden tip and the small gold book with the winged sun "
            "on its cover stay exactly the same.") for d in ('S', 'SE', 'E')}
       | {d: ("The gold sun disc on top of her head, her big white cat ears with golden tips, the curtain of white hair locks "
              "with gold beads, the round gold clasp and short scarlet panel at the back of her sash, the long scarlet sash "
              "ends, the gold anklets and sandals, her white tail with its golden tip and the small gold book stay exactly "
              "the same.") for d in ('NE', 'N')},
  spos={'S': 'just above her open palm beside her shoulder', 'SE': 'just above her open palm beside her shoulder',
        'E': 'in front of her, just above her open palm', 'NE': 'just above her open palm beside her head',
        'N': 'just above her open palm beside her shoulder'},
  blink=", and her ears twitch once",
  vis=" Her thrusting hand stays visible beside her head during the thrust.",
  fmt={'look': (', looking up at the book', ''),
       'hand': {'S': 'held out to the side palm up', 'SE': 'held out to the side palm up',
                'E': 'held out in front of her palm up', 'NE': 'held out to the side palm up',
                'N': 'held out to the side palm up'},
       'thr': {'S': 'forward and a little upward toward the way she is facing',
               'SE': 'forward and a little upward toward the way she is facing',
               'E': 'straight forward at chest height, just below the floating book',
               'NE': 'forward and a little upward toward the way she is facing',
               'N': 'forward and a little upward toward the way she is facing'},
       'bup': {'S': 'straight up beside her head', 'SE': 'straight up beside her head',
               'E': 'up in front of her, above her head', 'NE': 'straight up beside her head',
               'N': 'straight up beside her head'},
       'bhov': {'S': 'level with the sun disc on her head, off to the side so it never covers her face or the disc',
                'SE': 'level with the sun disc on her head, off to the side so it never covers her face or the disc',
                'E': 'level with the sun disc on her head, a little ahead of her face, never covering her face or the disc',
                'NE': 'level with the sun disc on her head, off to the side so it is never hidden behind her head',
                'N': 'level with the sun disc on her head, off to the side so it is never hidden behind her head'},
       'oth': {'S': 'beside her head on the other side, palm forward', 'SE': 'beside her head on the other side, palm forward',
               'E': 'beside her shoulder, palm forward', 'NE': 'beside her head on the other side',
               'N': 'beside her head on the other side'}},
  inframe="her whole body, the sun disc on her head, both ears, her tail and the floating book stay inside the frame.",
  nofx="The little blue flame over the open book is part of her design: it stays small and solid and only flickers gently. "
       "Nothing else glows: no shadow, no flash, no rings or halos, no light around the book or the sun disc, no sparkles, "
       "no particles, no smoke, no curse symbols, no locusts, no soul wisps, no light trails, no streaks of colour, no motion "
       "lines, no magic effects, no symbols, no text.",
  act={
   'idle': "Idle loop of {who}. {facing} She stands gracefully, one hand {hand}; the small open gold book floats {spos}, "
           "the little blue flame curling over its pages, and the book bobs gently up and down. Her other hand rests relaxed "
           "at her side. She breathes slowly; her white hair locks and their gold beads, the long scarlet sash ends and the "
           "hem of her dress sway a little, her tail swishes slowly{blink}. The last frame matches the first frame so the "
           "clip loops.",
   'walk': "Walk loop of {who}. {facing} She walks in place, like on a treadmill, toward the way she is facing: light, "
           "graceful little steps (about two steps per second), the small open book floating {spos} and moving along with "
           "her, her hair locks and gold beads bouncing, her tail and the long sash ends swaying. She does not move across "
           "the frame, she does not come closer to the camera or move away from it, and the ground does not move. The last "
           "frame matches the first frame so the clip loops.",
   'attack': "Palm thrust of {who}. {facing} The small open book stays floating {spos}. She pulls her free hand back beside "
             "her shoulder in a short wind-up, then thrusts it {thr}, palm open and fingers spread like a cat's paw, holds "
             "that pose for an instant, then lowers her hand back to her starting pose and stands still for the rest of the "
             "clip. The whole move takes about one second. She does not step forward: her feet stay in place. Her thrusting "
             "hand never touches the floating book.{vis} The air around her hand stays empty and plain green in every frame. "
             "Clean outlines in every frame, no motion blur.",
   'buff': "Spell cast of {who}. {facing} She raises the hand that holds the book {bup}, and the open book floats up off her "
           "palm until it hovers {bhov}; at the same time she lifts her other hand open {oth}{look}. She holds that pose "
           "still for about one second, then lowers both hands while the book floats back down {spos}, returns to her "
           "starting pose and stands still for the rest of the clip. Her feet stay in place. The raised book, its little "
           "flame and the sun disc stay inside the frame. Clean outlines in every frame, no motion blur."},
  dirname={'S': 'หน้าตรง', 'SE': 'เฉียงหน้า หันขวา', 'E': 'ข้าง หันขวา', 'NE': 'เฉียงหลัง หันขวา', 'N': 'หลัง'},
  actname={'idle': 'ยืน (idle · วนลูป)', 'walk': 'เดิน (walk · วนลูป)',
           'attack': 'ผลักฝ่ามือ (attack · ตีปกติ = ปาหน้ากระดาษคำสาป + สกิลที่ใช้ท่าตี — เฟรมยื่นสุด = ปล่อย)',
           'buff': 'ชูคัมภีร์ร่าย (buff · คำสาป / เรียกผู้รับใช้ / บัฟ / อัลติ — เกมค้างเฟรมชูสุดตอนร่ายนาน)'},
  start='ภาพยืน 2.5D มุม {d} ที่ได้จาก ChatGPT',
  header="""เจ้าของเลือกแบบ 4 'ธิดาแห่งรา' 2026-11-26 20:57 (ชีต `assets/heroes/bastet/sheet_daughter_of_ra.webp` + 'ขอพร้อมเป็น2.5d') → ภาพใหญ่ = หน้าเลือกตัวแล้ว (`select.webp`, SELV bastet 2) → 21:42 ส่งภาพยืน 2.5D ครบ 5 มุม + "ขอพร้อมทำอนิเมชั่นหน่อยรูปที่ส่งให้ยังไม่ค้องเอาไปทำไร" → ไฟล์นี้ = พรอมต์คลิป 20 ตัวอย่างเดียว · ไม่ได้ตัดภาพตั้งต้น ไม่ได้เก็บภาพยืนไว้ใน repo (ตามที่เจ้าของสั่ง แบบแมว / จิ้งจอก 2.5D) · เจ้าของแนบภาพยืนของทิศนั้นเป็นเฟรมแรกเอง · หน้าตา + พรอมต์ภาพยืน: `BASTET_LOOK_PROMPTS_TH.md` หัวข้อ 'เลือกแล้ว: แบบ 4' · **ห้ามใช้ `BASTET_CLIP_PROMPTS_TH.md` (ชุดแบน ลุคเก่า) กับภาพ 2.5D**

## ภาพยืน 2.5D ที่เป็นเฟรมแรก (มาแล้ว 21:42)
- 1254² พื้นเขียว ตัวสูง 58–63 % ของภาพ (ปลายจานสุริยะถึงพื้นรองเท้า ~730–795 px) ทุกมุมหันขวา ไม่มีสีเขียวบนตัว · ที่ว่างเหนือหัว 326–374 px = 0.41–0.51 เท่าตัว · ซ้าย 336–397 · ขวา 341–444 · ใต้เท้า 135–184 px → ท่าร่าย: ให้คัมภีร์ **ลอยขึ้นจากฝ่ามือถึงระดับจานสุริยะ อยู่ข้างจาน** (แขนชิบิสั้น ยกตรงสุดแขนมือยังแค่ระดับหู — เขียนว่า 'สูงกว่าจาน' โมเดลจะยืดแขน) · ท่าตี: ไม่ก้าว มือไม่โดนคัมภีร์ · ถ้าคลิปไหนหลุดขอบภาพ: ย่อภาพก่อนทำคลิป (`python3 -I tools/dir8cut.py startv <โฟลเดอร์> <ทิศ>=<ภาพ> size=1024 feet=.88 ht=460 clean=0` ทีละมุม)
- ตามที่วาด: **S** คัมภีร์ขวาของภาพบนฝ่ามือซ้ายระดับไหล่ มือขวาพักที่สะโพกข้างหาง (ซ้ายของภาพ) หางม้วนขึ้นซ้ายของภาพ มองกล้อง ยิ้มมั่นใจ มีเงาจางใต้เท้า · **SE** แบบเดียวกัน ตัวหันขวาล่าง ตาเหลือบมองคัมภีร์ · **E** คัมภีร์ลอยหน้าตัวระดับคางบนมือข้างไกล มองคัมภีร์ แขนข้างใกล้ห้อยข้างตัว ซิสตรัมห้อยหน้า ผม หาง ชายผ้าอยู่หลังตัว (ซ้ายของภาพ) · **NE** คัมภีร์ซ้ายของภาพระดับหัว เห็นเต็ม งูเห่าโผล่ขวาของจาน เห็นขอบแก้มขวามีขีดแดงนิดเดียว มือขวาห้อยขวาของภาพข้างหาง · **N** คัมภีร์ซ้ายของภาพ จานจากด้านหลัง ม่านผมยาวถึงเหนือผ้าคาดเอว ปลายลูกปัดทอง หัวเข็มขัดทองกลม + แผ่นแดงปลายแหลมทองด้านหลัง ชายผ้ายาวซ้ายของภาพ หางม้วนขวาของภาพ ไม่เห็นหน้า

## วิธีใช้
แนบภาพยืน 2.5D ของทิศนั้น + วางพรอมต์ทีละตัว → 4 คลิปต่อทิศ (ยืน · เดิน · ผลักฝ่ามือ · ชูคัมภีร์) · คลิปละ 3–5 วิ · ไม่ต้องทำทิศซ้าย (เกมกลับด้านเอง) · ส่งกลับเรียง S → SE → E → NE → N ทิศละ ยืน → เดิน → ผลัก → ชู (สลับได้)

## กติกาที่อยู่ในทุกพรอมต์ (บทเรียนจากคลิปหมาป่า / จากัวร์ / แรด / อนูบิส / ฮิปโป / บาสเต็ดชุดแรก / แกะ / ลิง / จิ้งจอก)
- ประโยคบอกทิศขึ้นต้นทุกพรอมต์ · มุมหลัง (NE, N) 'เห็นแค่หลังหัว หน้าไม่หันมา' + สิ่งที่เห็นตามภาพจริง (ม่านผมปลายลูกปัดทอง หู หลังจานสุริยะ งูเห่าโผล่ + ขอบแก้มขวาใน NE หัวเข็มขัดทองด้านหลัง)
- ประโยคลุค 2.5D (คีย์ `look`) + กล้องมองลงจากด้านบนมุมเดิม
- **ลืมตาตลอด** อยู่ในประโยคหน้า (คลิปบาสเต็ดชุดแรกหลับตาหลายช่วงทั้งท่ายืนและท่าร่าย) · เดิน: **ไม่เข้าหา / ถอยห่างกล้อง**
- ตี = ผลักฝ่ามือว่างไปหน้าเฉียงขึ้น กางนิ้วแบบอุ้งเท้าแมว ค้างนิด แล้วยืนนิ่ง · **มุมข้าง (E) ผลักตรงระดับอกใต้คัมภีร์** (คัมภีร์ลอยหน้าหน้าเธอ) · มือไม่โดนคัมภีร์ · ไม่ก้าว · ไม่ใช้คำ attack / claw / strike · อากาศรอบมือเป็นเขียวเรียบ
- ร่าย = ยกมือที่ถือคัมภีร์ขึ้นข้างหัว (E: ขึ้นหน้าตัวเหนือหัว) คัมภีร์ลอยขึ้นจากฝ่ามือถึงระดับจานสุริยะ อยู่ข้างจาน ไม่บังหน้า / ไม่บังจาน (มุมหลัง: ไม่หลบหลังหัว) อีกมือแบขึ้นข้างหัวอีกฝั่ง มองคัมภีร์ ค้าง ~1 วิ (เกมค้างเฟรมชูสุดตอนร่ายนาน) · คัมภีร์ ไฟ และจานอยู่ในภาพ
- เปลวไฟฟ้าบนคัมภีร์เล็ก ทึบ ไหวนิดเดียว · จานสุริยะไม่ส่องแสง · **ห้ามวงแหวน / รัศมี / แฟลช** (คลิปชุดแรก: ตีมุม E มีเส้นฟ้า, NE แฟลช, N วงแหวนฟ้า · ร่ายมุม E รัศมีทอง) · ห้ามตาคำสาป อังค์ม่วง ตั๊กแตน มัมมี่ ดวงวิญญาณ เส้นความเร็ว สัญลักษณ์ (มีในชีตท่าร่าย — เอฟเฟกต์ใส่ในเกม: `bastet_vfx.js`) · ไม่ระบุมือซ้าย / ขวาในตัวคำสั่งท่า (ภาพตั้งต้นบอกเองว่าคัมภีร์อยู่มือไหน)""",
  footer="""## ตอนคลิปมาถึง (โน้ตสำหรับแชตที่ทำต่อ)
- `tools/clips/bastet25_plan.json` จาก `bastet_plan.json` (เวลาเฟรม / contact / peak เดิมทุกทิศ = ของร่างหมาป่าที่เธอถูก bench ไว้ · atkRemap {}) → **ไฟล์ใหม่ `assets_bastet25.js`** (prefix BST เดิม — โหลดทีละไฟล์) + สวิตช์ `window.BST25` / `?bst25=0` (แบบ JG25 / WLF25) · ตาราง MB หน้าโหลด · เช็ก `python3 tools/fxlab.py hits bastet` ก่อน / หลัง (FXSEED + o.sure)
  - attack 12 เฟรม 900 ms · S [80,50,90,50,50,50,70,200,50,50,50,110] contact 6 (370 ms) · SE [50,50,190,70,90,50,50,50,50,50,90,110] contact 4 (360) · E และ NE [80,50,50,100,50,120,60,120,50,50,50,120] contact 6 (450) · N [110,120,50,50,70,50,120,70,50,50,50,110] contact 6 (450) · เฟรม contact = มือยื่นสุด
  - buff 12 เฟรม 1.4 วิ peak 7 · S [170,50,50,230,50,110,390,50,50,50,50,150] (1,050 ms) · E [70,50,50,50,50,70,170,580,50,50,50,160] (510) · NE [80,60,50,50,50,50,120,160,480,60,60,180] (460) · N [130,50,50,50,50,110,260,450,60,50,50,90] (700) · SE 6 เฟรม [220×6] peak 3 (660) · เฟรม peak = คัมภีร์ลอยสูงสุดระดับจาน
  - walk 8 เฟรมตามจังหวะคลิป (ชุดแรก S 125 · SE 146 · E 151 · NE 156 · N 130 ms) · idle 12 เฟรม · hurt 7 × 70 ms
- **socket:** ไฟบนคัมภีร์ทุกท่า (orbAll) — ไฟใหม่สีฟ้าอมเขียว R ต่ำ (ในภาพยืน: B ≥ 200, R < 140 · ชุดแรก R 80–140 → orbMask มี 'r':70) → วัด orbMask ใหม่ ไม่งั้นจับไม่เจอ · ท่าตีตั้งแต่ง้างจนค้าง = ฝ่ามือ (orbFix อ่านด้วยตา) · `bastet_vfx.js` OWN = ใช้คลิปตีของเธอเอง (ไม่สลับเป็นคลิปร่าย) อยู่แล้ว
- **ขนาด:** วัด `CHAR_SCALE.bastet` ใหม่ (ตอนนี้ 1.56) จากความสูง**ถึงปลายหู ไม่รวมจานสุริยะ** (จานสูงอีก ~15 %) ไม่งั้นตัวจะเล็กลง · `HERO_SIZE.bastet` .724 คงไว้ · `bastet_vfx.js` headZ() = ขอบบนของภาพยืน S + 6 → ตอนนี้จะเป็นปลายจาน → ปรับให้วงวิญญาณ / ของบนหัวอยู่เหนือจานพอดี
- **ขนาดในคลิป:** ภาพยืนตัวสูง ~60 % ของภาพ → คลิป 544² ตัวสูง ~325 px · คลิปร่าย คัมภีร์ + ไฟอาจชิดขอบบน → ดูก่อนตัด (`topFade` ถ้าโดนขอบ) · ภาพ S มีเงาจางใต้เท้า → ถ้าคลิปมีเงาด้วย ตัดออกตอนคีย์
- **หน้า HUD:** ภาพยืนไม่ได้เก็บใน repo (เจ้าของสั่ง) → ตัดหัวจากเฟรมแรกของคลิปยืน S เป็น `assets/heroes/bastet/face25.webp` + window.HUD_FACE (ร่างเก่าใช้ face.webp)
- ยังไม่มี: ท่าเสริมมุมเดียว (แบบจากัวร์ / หมาป่า), ท่านั่ง 8 มุม, ไอคอนสกิล (โค้ด SVG), พื้นหลังผังสกิล · ภาพหน้าโหลด ld1 ld8 ยังเป็นลุคเก่า""")

# Golden Sheep 2.5D = Golden Sheep Reborn (owner 2026-11-26 22:13 picked design 5 of SHEEP_LOOK_PROMPTS_TH.md and asked for the
# standing views per direction; 22:30 his 5 views in the 2.5D look + 'ขอพร้อมทำอนิเมชั่น รูปยังไม่ต้องทำไร' = prompts only, his
# views are the first frames, not stored in the repo, like cat25 / kitsune25 / bastet25). A complete entry: the flat 'sheep'
# entry describes her old look (long hair, long cape) and its start frames. Re-read against his views: the staff in her right
# hand (S / SE picture-left, E upright in front of her with the orb just in front of her face, NE / N picture-right), the other
# hand relaxed at her side (out of sight in E and NE), NO face at all in NE (only the hair, both horns, the back of the tiara
# and one drooping ear). Lessons kept: 2.5D look, eyes open (her old idle clips kept her eyes shut for long stretches), no
# walking toward the camera, 'Staff swing' without attack words with the orb stopping at knee height and the air round the
# staff empty (the old swings baked swooshes, impact bursts and sparks in every direction), 'Staff raise' instead of 'Spell
# cast' (the old raise clips flashed; the second half of the E one was one long flash), the orb never lighting up or turning
# white (the old clips needed orbPale), a chibi arm lifting the staff only as far as it reaches ('above her head' makes video
# models stretch the arms).
HEROES['sheep25'] = dict(
  title='แกะขนทอง 2.5D (แกะทองโฉมใหม่ แบบโมเดล 3D มองจากด้านบน · Golden Sheep Reborn 2.5D)',
  who='the little sheep priestess in this picture', P='She', p='she', pos='her', weapon='staff',
  look="Keep the exact look of the picture: a stylized 3D game model with soft toon shading and clean dark-brown outlines, "
       "the same colours and the same curly wool, skin, linen, cloth, leather, glass and gold textures — not photorealistic "
       "and not a flat drawing. The camera keeps looking down at her from above at the same angle as in the picture.",
  face="Keep her face exactly as in the picture: the same big blue eyes, the same rosy cheeks and the same gentle little "
       "smile, mouth closed; her eyes stay open the whole time.",
  back_face={'NE': "We see her from behind: the back of her curly pale-pink hair, both golden ram horns from behind, the back "
                   "of her gold laurel tiara and one soft sheep ear hanging down at the right, as in the picture; no part of "
                   "her face shows and her face never turns toward us.",
             'N': "We only see the back of her curly pale-pink hair, both golden ram horns from behind, the back of her gold "
                  "laurel tiara with its small gold point on top and her two soft sheep ears sticking out at the sides, as in "
                  "the picture; her face never turns toward us."},
  keep={d: ("Her big curled golden ram horns, the gold laurel tiara with its blue diamond, her soft pale-pink sheep ears with "
            "the blue diamond earrings, her curly pale-pink hair down to her shoulders, the white drape over her dark purple "
            "top, the gold arm bands and stacked bracelets, the brown belt with its round gold sun buckle, the short white "
            "skirt with the pointed purple-and-gold front panel, the purple cape with its gold key-pattern border, the gold "
            "ankle cuffs with blue diamonds, the brown sandals and the staff with its brown shaft, gold bands, gold point at "
            "the bottom and gold laurel wreath round the deep-blue orb stay exactly the same.") for d in ('S', 'SE')}
       | {'E': ("Her big curled golden ram horn, the gold laurel tiara with its blue diamond, her soft pale-pink sheep ear with "
                "its blue diamond earring, her curly pale-pink hair down to her shoulders, the white drape over her dark purple "
                "top, the gold arm band and stacked bracelets, the brown belt with its gold sun buckle, the short white skirt, "
                "the purple cape with the gold column on its back and its gold key-pattern border, the gold ankle cuff with its "
                "blue diamond, the brown sandals and the staff with its brown shaft, gold bands, gold point at the bottom and "
                "gold laurel wreath round the deep-blue orb stay exactly the same.")}
       | {d: ("Her big curled golden ram horns, the back of her gold laurel tiara, her soft pale-pink sheep ears, her curly "
              "pale-pink hair down to her shoulders, the purple cape with the gold Ionic column between two gold laurel "
              "branches and its gold key-pattern border, the gold arm bands and bracelets, the gold ankle cuffs, the brown "
              "sandals and the staff with its brown shaft, gold bands, gold point at the bottom and gold laurel wreath round "
              "the deep-blue orb stay exactly the same.") for d in ('NE', 'N')},
  spos={'S': 'beside her', 'SE': 'beside her', 'E': 'in front of her, the orb just in front of her face', 'NE': 'beside her',
        'N': 'beside her'},
  blink=", her earrings swing gently and her soft sheep ears flick once",
  vis=" The staff stays visible beside her body during the whole swing, never hidden behind her.",
  fmt={'oarm': {'S': 'her other hand relaxed at her side', 'SE': 'her other hand relaxed at her side',
                'E': 'her other arm out of sight behind her body, as in the picture',
                'NE': 'her other arm out of sight under her cape, as in the picture',
                'N': 'her other arm hanging relaxed at her side'},
       'warm': {'S': 'her other arm swinging a little', 'SE': 'her other arm swinging a little',
                'E': 'her other arm out of sight behind her body', 'NE': 'her other arm out of sight under her cape',
                'N': 'her other arm swinging a little at her side'},
       'bup': {'S': 'beside her head', 'SE': 'beside her head', 'E': 'in front of her', 'NE': 'beside her head',
               'N': 'beside her head'},
       'wsep': {'S': '', 'SE': '', 'E': ',', 'NE': '', 'N': ''},
       'look': (', looking up at the orb', ''),
       'pvis': ('', " The raised staff stays visible beside her head while she holds the pose.")},
  inframe="her whole body, both horns and the whole staff stay inside the frame.",
  nofx="No shadow, no flash, no glow, no light around the orb, no sparkles, no particles, no smoke, no wool tufts, no "
       "feathers, no music notes, no rings or halos, no light trails, no streaks of colour, no motion lines, no magic effects, "
       "no symbols, no text; the blue orb stays a plain deep-blue glass ball and never lights up or turns white.",
  act={
   'idle': "Idle loop of {who}. {facing} She stands in a relaxed pose holding her staff upright {spos}, {oarm}, and breathes "
           "slowly: her curly pale-pink hair, her cape and the hem of her skirt sway a little{blink}. The last frame matches "
           "the first frame so the clip loops.",
   'walk': "Walk loop of {who}. {facing} She walks in place, like on a treadmill, toward the way she is facing: light, bouncy "
           "little steps (about two steps per second) in her sandals, her staff held upright {spos}{wsep} bobbing a little "
           "with each step, {warm}, her curly hair bouncing and her cape swaying. She does not move across the frame, she does "
           "not come closer to the camera or move away from it, and the ground does not move. The last frame matches the "
           "first frame so the clip loops.",
   'attack': "Staff swing of {who}. {facing} She grips her staff with both hands, lifts it back over her shoulder in a short "
             "wind-up, then swings it down and forward in a fast diagonal arc toward the way she is facing, the orb end "
             "leading, until the orb is low in front of her at about knee height, never touching the ground; she holds that "
             "pose for an instant, then brings the staff back upright {spos}, returns to her starting pose and stands still "
             "for the rest of the clip. The whole swing takes about one second. She does not step forward: her feet stay in "
             "place.{vis} The staff keeps its full length and shape in every frame, and the air around it stays empty and "
             "plain green in every frame. Clean outlines in every frame, no motion blur.",
   'buff': "Staff raise of {who}. {facing} She takes her staff in both hands and lifts it straight up {bup} as far as her "
           "arms reach, no higher, the staff still upright, so the blue orb rises above her horns and points to the "
           "sky{look}; she holds that pose still for about one second, then lowers the staff back {spos}, returns to her "
           "starting pose and stands still for the rest of the clip. Her feet stay in place.{pvis} The whole staff stays "
           "inside the frame and keeps its full length and shape. Clean outlines in every frame, no motion blur."},
  dirname={'S': 'หน้าตรง', 'SE': 'เฉียงหน้า หันขวา', 'E': 'ข้าง หันขวา', 'NE': 'เฉียงหลัง หันขวา', 'N': 'หลัง'},
  actname={'idle': 'ยืน (idle · วนลูป)', 'walk': 'เดิน (walk · วนลูป — Woolly Hop เล่นเฟรมเดินเร็ว 3 เท่า)',
           'attack': 'เหวี่ยงไม้เท้า (attack · ตีปกติ Crook Combo + Light Ball + Chariot — เฟรมลูกแก้วต่ำหน้าตัว = โดน)',
           'buff': 'ชูไม้เท้า (buff · ฮีล / บัฟ / เพลง / อัลติ — เกมค้างเฟรมชูสุดตอนชาร์จ Light Ball)'},
  start='ภาพยืน 2.5D มุม {d} ที่ได้จาก ChatGPT',
  header="""เจ้าของเลือกแบบ 5 'แกะทองโฉมใหม่' 2026-11-26 22:13 (ขอพรอมต์ภาพยืนทีละทิศ) → 22:30 ส่งภาพยืน 2.5D ครบ 5 มุม + "ขอพร้อมทำอนิเมชั่น รูปยังไม่ต้องทำไร" → ไฟล์นี้ = พรอมต์คลิป 20 ตัวอย่างเดียว · ไม่ได้ตัดภาพตั้งต้น ไม่ได้เก็บภาพยืนไว้ใน repo (ตามที่เจ้าของสั่ง แบบแมว / จิ้งจอก / บาสเทต 2.5D) · เจ้าของแนบภาพยืนของทิศนั้นเป็นเฟรมแรกเอง · หน้าตา + พรอมต์ภาพยืน: `SHEEP_LOOK_PROMPTS_TH.md` หัวข้อ 'เลือกแล้ว: แบบ 5' · **ห้ามใช้ `SHEEP_CLIP_PROMPTS_TH.md` (ชุดแบน ลุคเก่า สั่ง 'not 3D') กับภาพ 2.5D**

## ภาพยืน 2.5D ที่เป็นเฟรมแรก (มาแล้ว 22:30)
- 1254² พื้นเขียว ตัวสูง 55–57 % ของภาพ (ปลายเขาถึงพื้นรองเท้า 685–710 px) ทุกมุมหันขวา ไม่มีสีเขียวบนตัว (จุดเขียวในตัว = ช่องระหว่างไม้เท้ากับตัว / ใต้แขน = พื้นหลังจริง) · ที่ว่างเหนือหัว 353–365 px = 0.50–0.53 เท่าตัว · ซ้าย 345–435 · ขวา 355–435 · ใต้เท้า 188–216 px · ยอดไม้เท้าต่ำกว่าปลายเขา ~0.1 เท่าตัว → ท่าชูไม้เท้าเขียนให้ยก **สุดแขนเท่าที่ถึง ไม่สูงกว่านั้น** (แขนชิบิยกตรงสุดได้แค่ระดับหน้าผาก ลูกแก้วจะเลยเขาขึ้นไป ~0.2 เท่าตัว ยังเหลือที่ว่าง) · ถ้าคลิปไหนหลุดขอบภาพ: ย่อภาพก่อนทำคลิป (`python3 -I tools/dir8cut.py startv <โฟลเดอร์> <ทิศ>=<ภาพ> size=1024 feet=.88 ht=460 clean=0` ทีละมุม)
- ตามที่วาด: **S** ไม้เท้าซ้ายของภาพ (มือขวาของเธอ) มือจับระดับอก ลูกแก้วระดับหน้าข้างหัว มืออีกข้างห้อยข้างตัว (ขวาของภาพ) ผ้าคลุมโผล่สองข้างขอบลายกุญแจทอง ยิ้มอ่อน · **SE** แบบเดียวกัน ตัวหันขวาล่าง · **E** ไม้เท้าตั้งหน้าตัว มือข้างใกล้จับระดับอก ลูกแก้ว + ช่อลอเรลอยู่หน้าใบหน้าพอดี (ใบลอเรลแทบแตะจมูก) แขนอีกข้างมองไม่เห็น ผ้าคลุมหลังตัว (ซ้ายของภาพ) เห็นเสาไอโอนิกทอง · **NE** ไม้เท้าขวาของภาพ มือจับระดับไหล่ ลูกแก้วระดับเขา เห็นหลังผมหยิก เขาสองข้างจากด้านหลัง หลังมงกุฎลอเรล หูแกะห้อยทางขวาข้างเดียว **ไม่เห็นหน้าเลย** แขนอีกข้างถูกผ้าคลุมบัง กระโปรงขาวโผล่ขวาของภาพ · **N** ไม้เท้าขวาของภาพ มือจับเหนือไหล่นิด เขาสองข้าง หลังมงกุฎมียอดทองเล็ก หูแกะยื่นสองข้าง แขนอีกข้างห้อยข้างตัว (ซ้ายของภาพ) ผ้าคลุมเสาไอโอนิก + ช่อลอเรล + ขอบลายกุญแจทอง ยาวเหนือเข่า

## วิธีใช้
แนบภาพยืน 2.5D ของทิศนั้น + วางพรอมต์ทีละตัว → 4 คลิปต่อทิศ (ยืน · เดิน · เหวี่ยงไม้เท้า · ชูไม้เท้า) · คลิปละ 3–5 วิ · ไม่ต้องทำทิศซ้าย (เกมกลับด้านเอง) · ส่งกลับเรียง S → SE → E → NE → N ทิศละ ยืน → เดิน → เหวี่ยง → ชู (สลับได้)

## กติกาที่อยู่ในทุกพรอมต์ (บทเรียนจากคลิปแกะชุดแรก + หมาป่า / จากัวร์ / แรด / แมว / จิ้งจอก / บาสเทต 2.5D)
- ประโยคบอกทิศขึ้นต้นทุกพรอมต์ · มุมหลัง (NE, N) 'หน้าไม่หันมา' + สิ่งที่เห็นตามภาพจริง (หลังผมหยิก เขาสองข้าง หลังมงกุฎ หูแกะ) · NE เขียนว่า **ไม่เห็นหน้าเลย** ตามภาพ (บาสเทต / จิ้งจอกยังเห็นขอบแก้ม แกะไม่เห็น)
- ประโยคลุค 2.5D (คีย์ `look`) + กล้องมองลงจากด้านบนมุมเดิม
- **ลืมตาตลอด** อยู่ในประโยคหน้า (คลิปยืนชุดแรกหลับตาเป็นช่วงยาว ต้องเลือกช่วงวนลูปหลบ) · เดิน: **ไม่เข้าหา / ถอยห่างกล้อง**
- เหวี่ยงไม้เท้า: ชื่อท่า 'Staff swing' ไม่ใช้คำ attack / strike · ยกข้ามไหล่แล้วฟาดเฉียงลงไปข้างหน้า หัวลูกแก้วนำ ลูกแก้วหยุดต่ำหน้าตัว **ระดับเข่า ไม่แตะพื้น** ค้างนิด แล้วกลับท่ายืน · อากาศรอบไม้เท้าเป็นเขียวเปล่า (คลิปตีชุดแรกมีโค้งลม ระเบิดกระแทก ประกายติดมาทุกทิศ) · ไม่ก้าว · ไม้เท้ายาวเท่าเดิม · มุมหลังสั่งให้ไม้เท้าเห็นข้างตัวตลอด
- ชูไม้เท้า: ชื่อท่า 'Staff raise' (ไม่ใช้ 'Spell cast' — คลิปร่ายชุดแรกมีแฟลช มุม E ครึ่งหลังเป็นแฟลชทั้งช่วง) · สองมือยกไม้เท้าตั้งตรง **สุดแขนเท่าที่ถึง ไม่สูงกว่านั้น** ลูกแก้วเลยเขาชี้ฟ้า (เขียนว่า 'เหนือหัว' โมเดลจะยืดแขน) · มุมหน้ามองลูกแก้ว · ค้าง ~1 วิ (เกมค้างเฟรมชูสุดตอนชาร์จ Light Ball / ร่าย) · มุมหลังสั่งให้ไม้เท้าเห็นข้างหัว
- ลูกแก้วเป็นแก้วน้ำเงินเข้มเรียบๆ **ไม่สว่าง ไม่กลายเป็นสีขาว** (คลิปชุดแรกลูกแก้วเรืองขาวหลังเหวี่ยงและตอนชูสุด → ตอนตัดต้องใช้ orbPale) · ห้ามปุยขน ขนนก ตัวโน้ต วงแหวน รัศมี เส้นความเร็ว สัญลักษณ์ (เอฟเฟกต์ใส่ในเกม: `sheep_vfx.js`) · ไม่ระบุมือซ้าย / ขวาในตัวคำสั่งท่า (ภาพตั้งต้นบอกเองว่าไม้เท้าอยู่มือไหน)""",
  footer="""## ตอนคลิปมาถึง (โน้ตสำหรับแชตที่ทำต่อ)
- `tools/clips/sheep25_plan.json` จาก `sheep_plan.json` (เวลาเฟรม / contact / peak เดิมทุกทิศ) → **ไฟล์ใหม่ `assets_sheep25.js`** (prefix SHE เดิม — โหลดทีละไฟล์) + สวิตช์ `window.SHE25` / `?she25=0` (แบบ JG25 / RH25) + ตาราง MB หน้าโหลด · เช็ก `python3 tools/fxlab.py hits sheep` ก่อน / หลัง (FXSEED + o.sure)
  - attack 12 เฟรม [60×8, 70, 80, 90, 100] contact 8 (480 ms) ทุกทิศ · เฟรม contact = ลูกแก้วต่ำหน้าตัว
  - buff 12 × 80 ms peak 7 ทุกทิศ · เฟรม peak = ชูไม้เท้าสุด
  - walk 8 เฟรม S 146 · SE / E / NE 125 · N 151 ms · idle 12 เฟรม S 118 · SE 125 · E 170 · NE 83 · N 62 ms · hurt 7 × 70 ms (`stateDur`)
- ใครใช้เฟรมไหน (`char_sheep.js`): ตีปกติ Crook Combo (`sSwing`) = attack ตั้งแต่ contact−3 ถึงจบ เร็ว 1.6 × ASPD · Light Ball = ค้างเฟรม peak ของ buff ตลอดชาร์จ แล้วต่อ attack จาก contact (ฟาดปล่อย) · Chariot = contact−1 … contact+1 ซ้ำเร็ว 2 เท่า · Woolly Hop = walk เร็ว 3 เท่า · ฮีล / บัฟ / เพลง / อัลติที่เหลือ (`sBurst` → buffAct) = buff ถึง peak = ปล่อยสกิล
- **socket:** ลูกแก้วน้ำเงินทุกเฟรม (cliphero orbAll) → `sheep_vfx.js` crook() / tip() / headZ · ลูกแก้วสีเดิม orbMask เดิมน่าจะใช้ได้ (`{b 140, br 70, bg 40, g 0, min 90}`) แต่ลูกแก้ว 2.5D มีไฮไลต์ขาว + เงาแบบโมเดล → เช็กทุกแถว · orbFix ตรงที่เหวี่ยงแล้วเบลอ / โดนตัวบัง · orbLerp
- **ขนาด:** `CHAR_SCALE.sheep` 1.57 → ตั้ง cellScale ให้ idle S สูงเท่าเดิม (วัดถึงปลายเขา ไม่รวมยอดไม้เท้า) · `HERO_SIZE.sheep` .598 คงไว้
- **ขนาดในคลิป:** ภาพยืนตัวสูง ~56 % ของภาพ → คลิป 544² ตัวสูง ~305 px · ท่าเหวี่ยงมุมข้าง ไม้เท้าอาจยื่นใกล้ขอบขวา → ดูก่อนตัด
- **หน้า HUD:** ภาพยืนไม่ได้เก็บใน repo (เจ้าของสั่ง) → ตัดหัวจากเฟรมแรกของคลิปยืน S เป็น `assets/heroes/sheep/face25.webp` + window.HUD_FACE ใน installSheep (ร่างเก่าใช้ face.webp) · ภาพหน้าเลือกตัว `select.webp` + `portrait.webp` ยังเป็นลุคเก่า (แบบ 5 ไม่มีชีต) → ตัดจากเฟรมแรกของคลิปยืน SE หรือขอภาพใหญ่จากเจ้าของ
- ยังไม่มี: ท่าเสริมมุมเดียว (แบบจากัวร์ / หมาป่า), ท่านั่ง 8 มุม, ไอคอนสกิล, พื้นหลังผังสกิล · ภาพหน้าโหลด ld1 ld4 ld8 ยังเป็นลุคเก่า""")

def build(h, d, a):
    H = HEROES[h]; back = d in BACK
    ex = {k: (v[d] if isinstance(v, dict) else v[1 if back else 0]) for k, v in H.get('fmt', {}).items()}
    txt = H['act'][a].format(who=H['who'], facing=facing(d, H['P'], H['p'], H['pos']), spos=H['spos'][d],
                             blink='' if back else H['blink'], vis=H['vis'] if back else '', **ex)
    face = H['back_face'][d] if back else H['face']
    return ' '.join([txt, face, H['keep'][d], tail(H['P'], H['pos'], H['weapon'], H.get('nofx'), H.get('inframe'), H.get('look'))])

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

def pbuild(h, k):
    """One extra-pose clip prompt: the hero's face / keep / look / no-effect lines unless the clip replaces them."""
    H, X = HEROES[h], POSES[h]['clips'][k]; d = X.get('d', 'SE'); back = d in BACK
    ex = {kk: (v[d] if isinstance(v, dict) else v[1 if back else 0]) for kk, v in H.get('fmt', {}).items()}
    ex.update(X.get('fmt', {}))
    txt = X['text'].format(who=H['who'], facing=facing(d, H['P'], H['p'], H['pos']), spos=H['spos'][d], **ex)
    face = X.get('face') or (H['back_face'][d] if back else H['face'])
    return ' '.join([txt, face, X.get('keep') or H['keep'][d],
                     tail(H['P'], H['pos'], H['weapon'], X.get('nofx') or H.get('nofx'), X.get('inframe') or H.get('inframe'),
                          H.get('look'), X.get('stay'))])

def pdoc(h):
    P = POSES[h]; C = P['clips']; S = P.get('still')
    rows = [(c['n'], c['th'], c['use'], c['prio']) for c in C.values()] + ([(S['n'], S['th'], S['use'], S['prio'])] if S else [])
    out = ['# %s' % P['title'], '',
           '_ไฟล์นี้สร้างจาก `python3 tools/clip_prompts.py %s poses` — แก้ข้อความที่สคริปต์แล้วรันใหม่ อย่าแก้ไฟล์นี้ตรงๆ_' % h, '',
           P['header'], '', '## ลำดับ', '', '| # | ท่า | ใช้กับ | ความสำคัญ |', '|---|---|---|---|']
    out += ['| %s | %s | %s | %s |' % r for r in rows]
    out += ['', P['clipsHead'], '']
    for k, c in C.items():
        out += ['### %s %s' % (c['n'], c['th']), 'ใช้กับ %s · เกมใช้เฟรม: %s' % (c['use'], c['frames']), '', '```', pbuild(h, k), '```', '']
    if P.get('clipFix'):
        out += [P['clipFix'], '']
    if S:
        out += [S['head'], '', '### %s %s' % (S['n'], S['th']), 'ใช้กับ %s · %s' % (S['use'], S['attach']), '', '```', S['box'], '```', '',
                S['fixes'], '']
    out += [P['footer'], '']
    return '\n'.join(out)

def sdoc(h):
    P = SHEETS[h]; B = P['boxes']; S = P.get('sit')
    rows = [(b['n'], b['th'], b['use'], b['prio']) for b in B.values()] + ([(S['n'], S['th'], S['use'], S['prio'])] if S else [])
    out = ['# %s' % P['title'], '',
           '_ไฟล์นี้สร้างจาก `python3 tools/clip_prompts.py %s sheets` — แก้ข้อความที่สคริปต์แล้วรันใหม่ อย่าแก้ไฟล์นี้ตรงๆ_' % h, '',
           P['header'], '', '## ลำดับ', '', '| # | แผ่น | ใช้กับ | ความสำคัญ |', '|---|---|---|---|']
    out += ['| %s | %s | %s | %s |' % r for r in rows]
    out += ['', '## กล่องพรอมต์ (ภาษาอังกฤษ วางทีละกล่อง · แนบรูปที่ 1 ทุกกล่อง)', '']
    for k, b in B.items():
        out += ['### %s %s' % (b['n'], b['th']), 'ใช้กับ %s · เกมใช้เฟรม: %s' % (b['use'], b['frames']), '', '```', b['box'], '```', '']
    out += [P['fixes'], '']
    if S:
        out += [S['head'], '', '### %s %s' % (S['n'], S['th']), 'ใช้กับ %s · %s' % (S['use'], S['attach']), '', '```', S['box'], '```', '',
                S['fixes'], '']
    out += [P['footer'], '']
    return '\n'.join(out)

if __name__ == '__main__':
    h = sys.argv[1]
    if len(sys.argv) > 2 and sys.argv[2] == 'sheets':
        if len(sys.argv) > 3 and sys.argv[3] == 'print':
            for k, b in SHEETS[h]['boxes'].items():
                print('==', k, len(b['box'])); print(b['box'])
        else:
            root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            p = os.path.join(root, '%s_POSE_PROMPTS_TH.md' % h.upper())
            open(p, 'w', encoding='utf-8').write(sdoc(h)); print('wrote', p)
    elif len(sys.argv) > 2 and sys.argv[2] == 'poses':
        if len(sys.argv) > 3 and sys.argv[3] == 'print':
            for k in POSES[h]['clips']:
                print('==', k, len(pbuild(h, k))); print(pbuild(h, k))
            if POSES[h].get('still'):
                print('== still', len(POSES[h]['still']['box'])); print(POSES[h]['still']['box'])
        else:
            root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            p = os.path.join(root, '%s_POSE_CLIP_PROMPTS_TH.md' % h.upper())
            open(p, 'w', encoding='utf-8').write(pdoc(h)); print('wrote', p)
    elif len(sys.argv) > 2 and sys.argv[2] == 'print':
        for d in DIRS:
            for a in ('idle', 'walk', 'attack', 'buff'):
                print('==', d, a, len(build(h, d, a))); print(build(h, d, a))
    else:
        root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        p = os.path.join(root, '%s_CLIP_PROMPTS_TH.md' % h.upper())
        open(p, 'w', encoding='utf-8').write(doc(h)); print('wrote', p)
