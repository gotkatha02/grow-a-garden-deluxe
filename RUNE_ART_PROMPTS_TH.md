# ภาพระบบรูน — พรอมต์เจนภาพ (2026-11-23)

ตอนนี้ในเกมใช้ภาพวาดด้วยโค้ด (SVG ใน `rune_data.js`) เป็นตัวแทนก่อน — สัตว์วิญญาณ 6 ตัว · หินรูนวิญญาณ · รูนสลัก · ของใหม่ 13 ชิ้น · พื้นหลังวงเศษโทเท็ม
ได้ภาพจริงเมื่อไหร่ ผมจะตัด / วางแทนให้ (ไอคอนของ: `assets/items/<id>.png` + `icons.json` · สัตว์วิญญาณ: `assets/rune/spirit/<สัตว์>.webp` · พื้นหลังวง: `assets/rune/ring/bg.webp`)

**แนบทุกครั้ง**: ภาพคีย์อาร์ตกองไฟ (สไตล์) · ส่งทีละกล่อง ทีละรูป
**กติกาสไตล์** (ใส่ในทุกพรอมต์แล้ว): การ์ตูนชิบิลงสีมือ เส้นขอบน้ำตาลเข้มหนา ลงเงา 2–3 โทนแบบเซล แสงเรืองแบบการ์ตูน สดใส อบอุ่น — ไม่สมจริง ไม่ใช่ควันแบบภาพวาด ไม่ใช่ 3D · ไม่มีตัวหนังสือ / โลโก้ / ลายน้ำ

---

## 1. สัตว์วิญญาณ 6 ตัว (โผล่ตอนรูนทำงาน) — รูปละ 1 ตัว พื้นหลังโปร่งใส

ใช้ตอนรูนวิญญาณทำงาน: หมีโผล่หลังฮีโร่ตอนได้โล่ · นกฮูกเกาะเหนือหัวตอนพร้อม · หมาป่าวิญญาณวิ่งไปกัด · อินทรีโฉบลงมา · นกสายฟ้าฟาดสายฟ้า · วาฬเพชฌฆาตกระโดดเป็นคลื่น
ตัวสัตว์เป็น "วิญญาณ" กึ่งโปร่งแสงเรืองสีของสัตว์ แต่เส้นขอบยังชัด (อ่านออกบนพื้นหิมะ / ทราย)

```
A friendly hand-painted chibi cartoon SPIRIT ANIMAL for a fantasy action RPG, matching the attached campfire key art: thick clean dark-brown outlines, cel shading with 2–3 flat tones, soft cartoon glow, bright and warm. Not realistic, not painterly smoke, not 3D.
Subject: a heroic totem spirit BEAR, full body, rearing up on its hind legs with a protective roar, front paws raised like a shield. Its body is semi-translucent glowing amber-orange spirit light with darker amber fur strokes, carved totem patterns (zigzags, spirals) glowing faintly on its chest and shoulders, small floating wood-chip sparks around it.
ONE character only, centred, empty space on every side, flat base at the bottom (it stands on the ground), transparent PNG background. No text, no logo, no watermark, no ground shadow.
```

เปลี่ยนเฉพาะบรรทัด Subject ทีละตัว (ส่งทีละรูป):

```
Subject: a wise totem spirit OWL, full body, wings half open, perched in mid-air, huge round glowing moon-yellow eyes, ear tufts. Its body is semi-translucent glowing violet-lavender spirit light with deeper purple feather strokes, a crescent-moon totem mark on its chest, small floating star sparkles around it.
```
```
Subject: a fierce totem spirit WOLF, full body, running forward mid-leap with its jaws open, ready to bite. Its body is semi-translucent glowing pale frost-blue spirit light with darker blue fur strokes, carved rune marks glowing on its shoulders, a trail of small blue wisps behind its tail.
```
```
Subject: a proud totem spirit EAGLE, full body, diving down with wings swept back and talons forward. Its body is semi-translucent glowing golden spirit light, a white head with a sharp golden hooked beak, warm brown wing feathers with gold edges, a sun-disc totem mark on its chest.
```
```
Subject: a mighty totem THUNDERBIRD spirit, full body, front view, huge wings spread wide, crackling cartoon lightning bolts along the wing edges, a small crest on its head. Its body is semi-translucent glowing electric-blue spirit light with gold lightning totem marks, bright white-yellow zigzag sparks around it.
```
```
Subject: a playful totem spirit ORCA (killer whale), full body, leaping in an arc as if jumping out of a wave, side view. Its body is semi-translucent glowing deep-navy and white spirit light, a curling cartoon water wave and bubbles around its tail, a carved spiral totem mark on its side.
```

---

## 2. หินรูนวิญญาณ 6 แบบ (ไอคอน) — แผ่นเดียว 3×2 บนพื้นเขียว

ในเกมกรอบเกรด B / A / S (เขียว / ฟ้า / ทอง) วาดด้วยโค้ดรอบหิน → ภาพเป็นแค่ "หินกลมสลักหน้าสัตว์" 6 ลูก (หมี นกฮูก หมาป่า / อินทรี นกสายฟ้า วาฬ)

```
A friendly hand-painted chibi cartoon game ICON SHEET for a fantasy RPG, matching the attached campfire key art: thick clean dark-brown outlines, cel shading with 2–3 flat tones, soft cartoon glow, bright and warm. Not realistic, not 3D.
A 3 by 2 grid of six separate round RUNE STONES on a flat pure green (#00FF00) background, each stone a perfect circle with lots of empty green space around it, nothing touching.
Each stone is smooth grey-brown river stone with a glowing carved animal face in the middle: row 1 = a bear head (amber glow), an owl face with big eyes (violet glow), a wolf head (frost-blue glow); row 2 = an eagle head in profile (golden glow), a thunderbird with spread wings and a lightning bolt (electric-blue glow), an orca leaping (navy and white glow).
Same size and style for all six. No text, no numbers, no frames, no logo, no watermark.
```

---

## 3. รูนสลัก 3 สี (ไอคอน) — แผ่นเดียว 3×1 บนพื้นเขียว

ในเกมตัวย่อสเตตัส (STR, ATK, VIT …) เขียนทับด้วยโค้ด → ภาพเป็นหินเหลี่ยมเปล่า 3 สี

```
A friendly hand-painted chibi cartoon game ICON SHEET for a fantasy RPG, matching the attached campfire key art: thick clean dark-brown outlines, cel shading with 2–3 flat tones, soft cartoon glow. Not realistic, not 3D.
Three separate faceted hexagonal CARVED RUNE GEMS in one row on a flat pure green (#00FF00) background, lots of empty space around each, nothing touching: a fiery RED gem, a cool SKY-BLUE gem, a warm GOLDEN-YELLOW gem. Each gem has a simple carved border groove and an empty smooth centre (no symbol), a shiny highlight on the top facet.
No text, no symbols, no logo, no watermark.
```

---

## 4. ของใหม่ 12 ชิ้น (ไอคอน) — แผ่น 4×3 บนพื้นเขียว

ลำดับช่อง (ซ้าย→ขวา บน→ล่าง) = id ไฟล์ตอนตัด:
| แถว | 1 | 2 | 3 | 4 |
|---|---|---|---|---|
| 1 | rsap ยางวิญญาณ | rmedal เหรียญโทเท็มทอง | rdew น้ำค้างราก | rfeather ขนนกหมอผี |
| 2 | rstone0 หินรูนดิบ B | rstone1 หินรูนดิบ A | rstone2 หินรูนดิบ S | rbag ถุงรูนสลัก |
| 3 | sdust ผงวิญญาณ | rg1 เจมสกิลราก ขั้น 1 | rg2 ขั้น 2 | rg3 ขั้น 3 |

(rg4 ขั้น 4 = ใช้ภาพ rg3 ย้อมทองก่อน หรือเจนแยกทีหลัง)

```
A friendly hand-painted chibi cartoon game ITEM ICON SHEET for a fantasy RPG with a totem theme, matching the attached campfire key art: thick clean dark-brown outlines, cel shading with 2–3 flat tones, soft cartoon glow, bright and warm. Not realistic, not 3D.
A 4 by 3 grid of twelve separate items on a flat pure green (#00FF00) background, each centred in its cell with lots of empty space, nothing touching:
row 1: a glowing drop of green tree sap with a tiny root curl; a gold coin stamped with a smiling totem face; a small glass flask of shimmering blue dew with a wooden cork; a long orange-and-cream shaman feather with small beads tied to it.
row 2: a rough grey raw rune stone with a glowing GREEN crack; a rough raw rune stone with a glowing BLUE crack; a rough raw rune stone with a glowing GOLD crack and tiny sparkles; a small brown leather pouch tied with string, a red-blue-gold glint peeking out.
row 3: a little heap of glittering lavender spirit dust; a pale tan gem with a carved tree-root pattern inside; a teal gem with a carved root pattern; a violet gem with a carved root pattern and a soft glow.
No text, no numbers, no logo, no watermark.
```

---

## 5. พื้นหลังหน้าวงเศษโทเท็ม — แนวนอน 1:1

ตอโทเท็มยักษ์ตรงกลาง + เศษใหญ่ 6 ชิ้นลอยเป็นวง (ช่องใหญ่) — ในเกมวางช่องด้วยโค้ดทับภาพ จึงให้วาด "เศษ" ไว้ในตำแหน่งนาฬิกา 12 / 2 / 4 / 6 / 8 / 10 โดยแต่ละเศษมีหลุมกลมว่างตรงกลาง

```
A friendly hand-painted chibi cartoon GAME MENU BACKGROUND for a fantasy RPG, matching the attached campfire key art: thick clean dark-brown outlines, cel shading with 2–3 flat tones, soft cartoon glow. Not realistic, not 3D. Square 1:1.
Top-down night view: in the exact centre the cut-off stump of a GIANT ANCIENT TOTEM POLE (carved wood rings, a glowing golden crack across its top). Around it, six large floating SHARDS of the broken totem form a perfect circle at the 12, 2, 4, 6, 8 and 10 o'clock positions, each shard a carved painted wooden fragment with an EMPTY ROUND HOLE in its middle (sockets), soft violet magic light between them, faint dotted circle of light linking them, a smaller inner dotted circle closer to the stump.
Deep purple-blue starry night sky background with a few twinkling stars, darker at the edges. Keep the space between the shards fairly plain (small rune stones will be placed there by the game).
No characters, no text, no logo, no watermark.
```
