# Aetherfall — พรอมต์สไปรต์มอนสเตอร์ (ทีละตัว)

ท่าทาง: **IDLE 4 · WALK 4 (ขาสลับซ้าย-ขวา) · ATTACK 5 · HURT 2 · DEATH 5 เฟรม** · มุมหน้า (SE) + มุมหลัง (NE) — ทิศอื่นเกมกลับภาพเอง

## วิธีใช้กับ ChatGPT
1 มอน = 1 แชทใหม่ ส่งตามลำดับ:
1. **SETUP** (ด้านล่าง) + แนบรูปฮีโร่ 1 รูป (เช่น `aetherfall-handoff/assets/sprites/idle/SE/00.png`)
2. **REF** ของมอน → เลือกรูปที่ชอบ เซฟเก็บ
3. **IDLE → WALK → ATTACK → HURT → DEATH** (ถ้าหน้าตาเริ่มเพี้ยน แนบรูป REF ซ้ำ)
4. ส่ง **BACK VIEW** แล้วสั่ง IDLE–DEATH ซ้ำ → ได้มุมหลัง
- ทุกตัวมี **จุดสังเกตที่ขา/เท้าซ้ายข้างเดียว** ใช้เช็กว่าขาสลับจริง ถ้าไม่สลับ ส่ง **FIX WALK**

### SETUP (ใช้เหมือนกันทุกตัว)
```
I am making 2D sprite sheets for my game's monsters. The attached image is my hero character — copy its art style EXACTLY for every image in this chat: chibi anime game sprite in Ragnarok Online style, hand-painted look, clean thick dark-brown outline (not black), soft cel shading with 2–3 tones, warm slightly desaturated pastel palette, soft light from the top-left, cute-but-dangerous readable silhouette.

Rules for EVERY sprite sheet I ask for in this chat:
- All frames in ONE horizontal row, equal-width cells, on a wide 1536x1024 canvas.
- Identical character design, size and scale in every frame. Never redesign the character.
- Feet / ground contact on the same baseline in every frame; character centered in each cell with padding; nothing cropped.
- View: isometric 3/4, camera about 30° above the ground, character facing down-right (south-east) — unless I say otherwise.
- Transparent background. No ground shadow, no text, no labels, no frame borders, no motion lines, no big glow effects (the game adds VFX).
Reply "OK" and wait for my monster description.
```

### BACK VIEW
```
From now on, draw every sheet from BEHIND: isometric 3/4 view facing up-right (north-east), moving away from the viewer. We see the back; the face is mostly hidden. Left and right legs are still the character's own left and right. Now redo the IDLE sheet.
```

### FIX WALK
```
The legs are not alternating. Redraw the walk: in frame 1 the marked LEFT leg is forward, in frame 3 the RIGHT leg is forward, and frames 2 and 4 are passing poses with the other leg lifted. The marked leg must clearly switch from front to back.
```

---

## #1 Pinecone Sprite · ภูตลูกสน
**แมพ:** ป่าสนหิมะ Snow Pine Woods (เมืองไวกิ้ง ติดเมือง) · Lv 1–4 · ขนาด S · มอนอ่อน ไม่ตีก่อน
**ดีไซน์:** ไม่ใช่สัตว์ — เป็น **ภูตที่อาศัยในลูกสนเก่า** ตัวเป็นลูกสนเคลือบน้ำค้างแข็ง เกล็ดลูกสนกาง-หุบเหมือนหายใจ ใบหน้าเป็นช่องมืดระหว่างเกล็ดมีตาเรืองแสงฟ้าสองจุด สวม "หมวก" เป็นกองหิมะมีใบสนเสียบ แขนเป็นกิ่งไม้เล็ก ถือก้านสนเป็นไม้เท้าจิ๋ว ขาเป็นกิ่งไม้สองขา · **จุดสังเกต: ไหมพรมสีแดงพันขาซ้าย** · โจมตีด้วยการ **กางเกล็ดแล้วพ่นละอองเกสรน้ำแข็ง** · ตายแล้วเหลือ **เมล็ดที่งอกเป็นต้นสนจิ๋วเรืองแสง** (น่ารัก ไม่โหด)

**REF**
```
Monster: "Pinecone Sprite" — a small forest spirit living inside an old frosty pinecone, knee-high to the hero. Its whole body is a plump pinecone dusted with frost; the scales slowly open and close like breathing. Its face is a dark hollow between the scales with two glowing ice-blue eyes and a tiny curious mouth. A little cap of snow with two pine needles stuck in it sits on top. Two thin twig arms; the right one holds a tiny pine-sprig walking stick. Two short twig legs; a red wool yarn wrapped around its LEFT leg only. Not an animal — a cute woodland spirit.
Make a reference sheet: 2 full-body views side by side, same size — (1) facing down-right (south-east), (2) from behind facing up-right (north-east).
```
**IDLE**
```
IDLE loop, 4 frames: 1) standing, scales closed, 2) scales open slightly (breathing in), eyes glow a little brighter, 3) standing, scales closed, 4) scales open slightly, the snow cap wobbles and a few snowflakes fall off.
```
**WALK**
```
WALK cycle, 4 frames, a bouncy little toddle. The legs MUST alternate, the stick arm swings opposite:
1) LEFT leg (red yarn) steps forward and is planted, right leg behind, body tilts left.
2) passing: legs under the body, RIGHT leg lifted and bent, body bobs up.
3) RIGHT leg steps forward and is planted, left leg (red yarn) behind, body tilts right.
4) passing: legs under the body, LEFT leg (red yarn) lifted and bent, body bobs up.
```
**ATTACK**
```
ATTACK (frost pollen burst), 5 frames: 1) hunches down, scales pull tight, eyes narrow, 2) holds the crouch, scales trembling, a faint blue glow between them (wind-up hold), 3) springs up and flares ALL its scales wide open, blasting a small puff of pale-blue frosty pollen toward lower-right (impact), 4) scales still open, pollen puff fading, 5) scales close back, back to standing.
```
**HURT**
```
HURT, 2 frames: 1) knocked back from a hit, scales flared out in shock, eyes squeezed shut, snow cap tilted, a few scales and snowflakes flying off, 2) recovering, leaning back, one eye open, scales half closed.
```
**DEATH**
```
DEATH, 5 frames: 1) staggers, eyes flicker, 2) scales start falling off one by one, 3) the body crumbles into a pile of loose scales, the eye glow fades, 4) only a small glowing seed remains on top of the scale pile, 5) a tiny glowing pine sapling sprouts from the seed, surrounded by the scattered scales and the red yarn. Cute, not gory.
```

---

### ตัวถัดไป (แนะนำลำดับ — แมพติดเมือง/ทางผ่านที่ผู้เล่นทุกคนเจอก่อน)
ป่าสนหิมะ: Frostling · Snow Pup → หุบเขี้ยวน้ำแข็ง vikF2: Snow Wolf Cub · Big Frostling · Icicle Bat → แล้วไล่เมืองอื่นแมพ F1/F2 ต่อ
