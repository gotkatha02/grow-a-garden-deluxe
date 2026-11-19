# Prompt ภาพระบบเจมโทเท็ม (ใช้ร่วมทุกฮีโร่) — 2026-11-19

ส่งใน ChatGPT ทีละกล่อง · แนบ `totem_style_reference.png` + เจมหลักหมาป่าที่เจนแล้ว 1–2 เม็ด (ให้สไตล์ตรงกัน)
ผลลัพธ์ → กรอบ `assets/gems/board/frame.webp` · เจมแปรสภาพ `assets/gems/mut/<id>.webp` · เจมเสริม `assets/gems/support/<id>.webp`
แยกทรงให้ดูออกทันที: **เจมหลัก** = เจียระไนเต็ม มีภาพในเนื้อ · **แปรสภาพ** = เจียระไน + วงรูนเรืองรอบขอบ · **เสริม** = หินหลังเต่าผิวเรียบ แสงเดียวข้างใน

## 1) กรอบแผงแบบเรียบ
```
Redraw the gem-board frame much SIMPLER and SLIMMER, same art style (friendly hand-painted chibi cartoon, thick clean dark-brown outlines, cel shading with 2-3 flat tones, soft glow, not realistic, not 3D). Square 1536x1536.

A plain, thin, perfectly round ring of carved warm wood with a thin gold trim on its inner and outer edge. Ring thickness only about 7% of the image width. Along the ring, a subtle red-and-white zigzag band and a few small carved notches, like a slice of a totem pole bent into a circle.
At the very TOP only: one small carved wooden totem face (simple, friendly, not a specific animal) sitting on the ring, about the same height as the ring is thick x2. Nothing else: no wings, no side heads, no feathers, no crystals, no hanging ornaments.
The ring must be a true circle, centered, symmetrical left to right. The inside is completely EMPTY and transparent, the outside is transparent. No text, no letters, no logo, no watermark.
```

## 2) Worldstorm (เจมหลักหมาป่าเม็ดสุดท้าย)
```
Gem "Worldstorm": round dark indigo crystal; inside, a whole swirling storm with clouds, lightning and glowing runes spinning around the centre.
```

## 3) ข้อความแรกก่อนเจนเจมแปรสภาพ / เจมเสริม
```
Now I need smaller gems in the SAME style as the round gems you made (attached). Friendly hand-painted chibi cartoon, thick clean dark-brown outline around the stone, cel shading with 2-3 flat tones, glossy jewel highlights, soft cartoon glow. Not realistic, not 3D.
Two families:
- MUTATION gems: a round brilliant-cut faceted gem like the attached ones, but with a thin ring of small glowing rune notches all around the rim. Inside, ONE simple glowing idea, big and readable at small size (it will be shown at 40 px).
- SUPPORT gems: a smooth polished round dome stone (cabochon), no facets, one soft simple glow inside. Readable at 30 px.
Every image: one gem only, perfectly round, seen straight from the front, filling the image edge to edge, 1024x1024, transparent background outside the circle. No metal setting, no frame, no text, no letters, no logo, no watermark.
Reply OK and wait.
```

## 4) เจมแปรสภาพ 12 เม็ด (ได้อย่าง เสียอย่าง)
| id | ชื่อ | ผล |
|---|---|---|
| focus | รวมศูนย์ | ตัวแรก ×1.6 ตัวอื่น ×0.4 |
| spread | แตกกระจาย | ×0.75 แต่ระเบิดใส่รอบตัว |
| heavy | หนักหน่วง | ×1.5 คูลดาวน์ +4 SP +10 |
| rapid | รัวเร็ว | ×0.65 คูลดาวน์ ×0.6 |
| stack | สะสม | เก็บได้ 2 ครั้ง พลัง ×0.8 |
| fire | ไฟ | ×0.7 + ติดไฟ 4 วิ |
| ice | น้ำแข็ง | ×0.8 + ช้า · ครั้งที่ 4 แช่แข็ง |
| volt | สายฟ้า | ×0.8 + ชิ่ง 2 ตัว |
| guard | ป้องกัน | ×0.8 + โล่ |
| rage | คลั่ง | ×1.3 แต่รับดาเมจเพิ่ม |
| siphon | ดูดพลัง | ×0.85 + คืน SP |
| totem | เสาโทเท็ม | ปักเสาร่ายแทน 4 ครั้ง |

```
Mutation gem "focus": golden yellow; inside, one single tiny point of white light with thin rays converging into it like a target.
```
```
Mutation gem "spread": orange; inside, a small bright core bursting outward into many sparks and expanding rings.
```
```
Mutation gem "heavy": dark red-brown; inside, one big heavy glowing boulder pressing down with a crack line under it.
```
```
Mutation gem "rapid": bright green; inside, three fast parallel speed streaks of light racing sideways.
```
```
Mutation gem "stack": pale lavender-blue; inside, two glowing layers of light stacked on top of each other like two charges.
```
```
Mutation gem "fire": flame orange-red; inside, a lively cartoon flame.
```
```
Mutation gem "ice": icy cyan; inside, one big six-point snowflake made of ice crystal.
```
```
Mutation gem "volt": sky blue; inside, a zigzag lightning bolt jumping between two small bright points.
```
```
Mutation gem "guard": silver-grey; inside, a glowing round shield shape of light.
```
```
Mutation gem "rage": crimson; inside, swirling angry red flames around a glowing fang.
```
```
Mutation gem "siphon": deep blue; inside, small glowing spirit droplets spiralling inward to the centre.
```
```
Mutation gem "totem": warm amber; inside, a tiny glowing carved totem pole of light.
```

## 5) เจมเสริม 12 เม็ด (ได้อย่างเดียว)
| id | ชื่อ | ผล |
|---|---|---|
| echo | เงาสะท้อน | ดาเมจซ้ำ ×0.35 หลัง 0.5 วิ |
| third | ครั้งที่ 3 | ทุกครั้งที่ 3 ×1.5 |
| force | พลัง | ทุกครั้งที่โดน +ATK/TAL×0.15 |
| splash | กระเซ็น | กระเซ็นใส่รอบตัว ×0.3 |
| chain | ชิ่ง | ชิ่งต่อ 2 ตัว ×0.3 |
| quick | เร่ง | คูลดาวน์ −1.5 วิ |
| thrift | ประหยัด | SP −6 |
| burn | เผา | Lv×1 ต่อวิ 3 วิ |
| frost | เยือกแข็ง | ทุกครั้งที่ 3 ช้า · ครั้งที่ 6 แช่แข็ง |
| pierce | เจาะเกราะ | ไม่สน DEF 20 |
| leech | ดูดเลือด | ฟื้น HP Lv×1 ต่อครั้ง |
| impact | กระแทก | ทุกครั้งที่ 5 มึน |

```
Support gem "echo": purple dome stone; inside, a soft glowing dot with a faint ghost copy beside it.
```
```
Support gem "third": orange-gold dome stone; inside, three small glowing dots in a triangle.
```
```
Support gem "force": red dome stone; inside, one strong bright glowing core.
```
```
Support gem "splash": amber dome stone; inside, a little burst splitting into small droplets.
```
```
Support gem "chain": light blue dome stone; inside, a short arc of light linking two dots.
```
```
Support gem "quick": mint green dome stone; inside, a quick swirling spiral of light.
```
```
Support gem "thrift": navy blue dome stone; inside, one calm glowing water drop.
```
```
Support gem "burn": orange-red dome stone; inside, a small glowing ember.
```
```
Support gem "frost": pale cyan dome stone; inside, a small soft snowflake glow.
```
```
Support gem "pierce": white-silver dome stone; inside, a thin sharp needle of light pointing up.
```
```
Support gem "leech": dark crimson dome stone; inside, a small glowing heart.
```
```
Support gem "impact": brown-gold dome stone; inside, small shock rings around a bright dot.
```

## 6) กรอบกลางใช้ทุกฮีโร่ (ไม่มีหน้าสัตว์) → `assets/gems/board/frame.webp`
เปิดภาพกรอบหมาป่าใน ChatGPT → ใช้แปรงเลือกเฉพาะหัวหมาป่า + ม้วนทองสองข้าง → วาง prompt (วงไม้เดิมต้องไม่เปลี่ยน โค้ดวัดวงกลมจากวงนี้)
```
Replace only the selected area with a small totem crest, no animal and no face: a short carved wooden totem cap with a red-and-white zigzag band, a pair of small carved wooden wings curling to each side, and one round glowing golden star gem set in its centre. About the same size as the old head, sitting on top of the ring, symmetrical left to right. Same friendly chibi cartoon style, thick clean dark-brown outline, cel shading with 2-3 flat tones, soft glow. Do not change the ring or anything else. Transparent background, no text.
```
