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

def tail(P, pos, weapon):
    return ("Keep the exact look of the picture: hand-painted chibi cartoon, thick dark-brown outlines, flat cel shading — "
            "not realistic, not 3D. The background stays plain flat green for the whole clip. The camera never moves or zooms. "
            f"{P} stays in the middle of the frame at the same size and never turns to another direction; {pos} whole body "
            f"and the whole {weapon} stay inside the frame. No shadow, no flash, no glow, no sparkles, no particles, no smoke, "
            "no magic effects, no text.")

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
}

def build(h, d, a):
    H = HEROES[h]; back = d in BACK
    txt = H['act'][a].format(who=H['who'], facing=facing(d, H['P'], H['p'], H['pos']), spos=H['spos'][d],
                             blink='' if back else H['blink'], vis=H['vis'] if back else '')
    face = H['back_face'][d] if back else H['face']
    return ' '.join([txt, face, H['keep'][d], tail(H['P'], H['pos'], H['weapon'])])

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
