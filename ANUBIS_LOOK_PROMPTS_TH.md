# อนูบิส (Anubis Jackal): ลุคใหม่ 5 แบบ (2026-11-24 20:58)

เจ้าของ: "ดีไซน์ อนูบิสใหม่ให้หน่อย" (ไม่ได้บอกแนว) → เปลี่ยน **ลุค** อย่างเดียว สกิลทั้งทรีเหมือนเดิม (ANUBIS_SKILLS_TH.md) · เขียนไว้หลายแนวให้เลือก:
- อนูบิสเต็มตัว 3 แบบ: แบบ 1 ครบสองสาย · แบบ 2 สาย A พายุลูกตุ้ม · แบบ 3 สาย B ผู้พิพากษา
- เทพนักรบแบบรูปปั้นคลาสสิก 1 แบบ (แบบ 4)
- ลุคเดิมแต่งให้เท่ 1 แบบ (แบบ 5)
- ไม่ได้ทำแบบผู้หญิงเต็มแบบ (บาสเต็ดเป็นสาวอียิปต์อยู่แล้ว ซ้ำกัน) · อยากได้ใช้ประโยคแก้ภาพข้างล่าง

ถ้าไม่ตรงใจ บอกแนวที่อยากได้มาได้เลย

## เปลี่ยนอนูบิสกระทบอะไรบ้าง (น้อย: ยังไม่มีสไปร์ทของตัวเอง)
- **สไปร์ท:** ยังใส่ร่างหมาป่าชั่วคราว (`assets.js`, `CHAR_SCALE.anubis` 1) → สไปร์ทใหม่เป็นไฟล์ใหม่ `assets_anubis.js` โหลดเฉพาะตอนเล่นอนูบิส (แบบบาสเต็ด `BST_ART`) · ตัวอื่นไม่โดน
- **ไม่มี** แฟชั่นติดตัว หน้ากากสี หน้า HUD ของตัวเอง (ตอนนี้ใช้หน้าหมาป่า) ท่านั่ง → ทำใหม่ทีเดียวตามลุคใหม่
- **ภาพวาดที่เป็นลุคเดิม:**
  - ภาพหน้าเลือกตัว `assets/heroes/anubis/select.webp`
  - ไอคอนสกิล 55 (`assets/icons/anubis`, ex_ 8) ราวสองในสามมีตัวอนูบิสเดิม · ที่เหลือเป็นลูกตุ้ม โซ่ ดวงอาทิตย์ ขนนก ตาชั่ง ประตู ใช้ต่อได้
  - พื้นหลังผังสกิล 4 ภาพ (`SKILL_BG_ALL.anubis`)
  - ภาพเอฟเฟกต์ 26 (`assets/fx/anubis`): เกือบทั้งหมดเป็นอาวุธ / สัญลักษณ์ → ใช้ต่อได้ถ้าอาวุธเหมือนเดิม · `anubis_head` กับ `avatar_aura` เป็นเทพหมาจิ้งจอกทองใส่ผ้าลายในเปลวม่วง (ร่างวิญญาณ ใช้ต่อได้ หรือเจนใหม่ให้เข้าลุค)
  - ภาพหน้าโหลด ld1 (ยืนกอดอกซ้ายสุด) · ld8 (นั่งเก้าอี้แดงหน้าเตาผิง)

**ถ้าเปลี่ยน ทำแบบนี้:**
- คลิป 20 อัน → `assets_anubis.js` คงเวลาเฟรมของ `assets.js` ทุกทิศ (= จังหวะโดนตอนนี้) → ดาเมจกับจังหวะไม่เปลี่ยน · ตัวสูงบนจอเท่าหมาป่า (วัด `CHAR_SCALE` ใหม่)
- งานที่ตามมา: หน้า HUD + ภาพหน้าเลือกตัว + ท่านั่ง
- ทีหลัง: ไอคอนที่มีตัว + ผังสกิล 4 ภาพ + ภาพหน้าโหลด ld1 ld8 (+ `anubis_head` / `avatar_aura` ถ้าอยากให้ตรงลุค)
- แบบ 5 ใกล้ลุคเดิมที่สุด ไอคอน ผังสกิล ภาพหน้าเลือกตัว ภาพหน้าโหลดเดิมยังพอเข้ากันได้นานสุด

## ทำไมลุคเดิมยังไม่เด่น (ภาพเทียบ: อนูบิสเดิม · บาสเต็ด · บอสฟาโรห์ · บอสเซท · บอสมัมมี่)
- **ชุดเหมือนบอส:** ผ้าคลุมหัวลายน้ำเงิน-ทอง + ผ้าลินินครีม + ผ้าห้อยน้ำเงินลายอังค์ = ชุดเดียวกับบาสเต็ดและบอสอียิปต์ทั้งแดน → ยืนในแผนที่อียิปต์แล้วดูเป็นพวกเดียวกับบอส
- **ขนน้ำตาลอมม่วง** ดูเป็นหมาธรรมดา · อนูบิสในตำนานเป็นหมาจิ้งจอก **ดำ** (สีดินดำริมแม่น้ำไนล์ = การเกิดใหม่)
- **รก:** ผ้าคลุมหัว + ผ้าพาดไหล่ + กระเป๋า + พู่ + ผ้าห้อย + ผ้าพันขา → ย่อเป็นสไปร์ทแล้วเป็นก้อน เงาไม่คม
- **หน้าบึ้ง กอดอก** ดูหงุดหงิด ไม่ใช่เทพผู้นำทางวิญญาณที่เท่และน่าเชื่อถือ
- ไม่มีอะไรบอกสาย A (หมุนลูกตุ้ม ทราย ดวงอาทิตย์ = ทอง) หรือสาย B (เกี่ยว ตัดสิน วิญญาณ = ม่วง) ทั้งที่ไอคอนกับเอฟเฟกต์ในเกมแบ่งสีทอง / ม่วงชัดอยู่แล้ว

## กติกา (อยู่ในพรอมต์ 0 แล้ว)
- **หมาจิ้งจอกดำเงา:** ขนดำ ลงเงาเทาถ่านอมฟ้า (ห้ามน้ำตาล) ปากยาวเรียวแหลม จมูกดำ หูตั้งสูงแคบ คอเรียว หางพวงดำ เห็นหางทุกมุม · ตาทอง + ขีดอายไลเนอร์อียิปต์ที่หางตา · หน้านิ่ง มั่นใจ ห้ามบึ้ง ห้ามแยกเขี้ยว
- **หัวโล่งเสมอ:** หูสองข้าง ปาก ตาสองข้าง เห็นทุกมุม · ห้ามผ้าคลุมหัวทับหู ห้ามฮู้ด หมวก ปกสูง · ใส่ได้แค่ห่วงที่หูหรือแถบบางๆ → หมวกแฟชั่นใส่ได้ทีหลัง
- **ไม่ซ้ำบอสอียิปต์:** ห้ามผ้าคลุมหัวลายน้ำเงิน-ทองผืนใหญ่ ห้ามผ้าครีมพันทั้งตัว ห้ามผ้าห้อย / ชุดยาว · ไม่ซ้ำบาสเต็ด (เทอร์ควอยซ์ ผ้าครีม หนังสือลอย) ฮิปโป (ผ้าคลุมฟ้าเขียว กระบอง + โล่) หมาป่าลุคใหม่ (ขาว ผ้าคลุมแดง ขวาน)
- **อาวุธเดิมทุกแบบ:** ลูกตุ้มหนามบรอนซ์เข้ม หนามทอง อังค์ทองกลางลูก ใหญ่เท่าหัว + โซ่ทองหนา + อีกปลายเป็นตะขอเสี้ยวทอง · ยืนเฉยๆ = โซ่พันแขน ลูกตุ้มห้อยจากมือ ตะขอห้อยที่สะโพก → ภาพเอฟเฟกต์ 26 ภาพกับไอคอนที่เห็นอาวุธยังเข้ากัน
- **เงาเพรียวคม:** นักสู้คล่องตัว ไหล่แข็งแรงแต่ไม่บึก · ของห้อยน้อย · ชุดยาวไม่เกินเข่า · รองเท้าแตะ / ผ้าพันพอดีเท้า
- **หลังโล่ง:** ผ้าคลุมสั้นแค่สะบัก · ห้ามผ้าคลุมยาว ห้ามของบนหลัง → ปีก / ผ้าคลุมแฟชั่นใส่ได้ทีหลัง
- **ห้ามสีเขียว** (คลิปตัดพื้นเขียว) · **ห้ามตัวอักษร:** ลายอียิปต์เป็นสัญลักษณ์ (อังค์ ตา ขนนก ดวงอาทิตย์) ไม่ใช่แถวอักษรภาพ
- **มุมขวาล่างของชีต:** ท่าสู้ 2 ท่า ใช้ดูว่าลุคนี้เวลาสู้เท่ไหม และเป็นแบบให้ไอคอนกับผังสกิลทีหลัง · สีตามเอฟเฟกต์ในเกม
  - หมุนลูกตุ้มเป็นวงกว้างรอบตัว ทรายทองกับแสงแดดหมุนวน = สาย A Flail Dervish
  - เหวี่ยงตะขอไปเกี่ยวศัตรู โซ่ลุกเป็นไฟวิญญาณสีม่วง = สาย B Judge of the Dead

## วิธีใช้
1. เปิดแชต ChatGPT ใหม่
2. ส่งพรอมต์ 0 พร้อมแนบ 2 ภาพ (ส่งให้ในแชตแล้ว):
   - `keyart_campfire_ld5.jpg` = ภาพปกแคมป์ไฟ (`assets/loading/ld5.webp`) ใช้เป็นแบบลายเส้น · ภาพนี้ไม่มีอนูบิสเดิม · **อย่าใช้ ld1 ld8** เพราะมีอนูบิสเดิมอยู่ ChatGPT จะลอกลุคเดิมมา
   - `hero_ref_wukong.jpg` (`tools/ref/`) = ลิงหิมะ (ภาพหน้าเลือกตัว) บนพื้นครีม แบบสัดส่วนฮีโร่ชายตัวเพรียว หน้ามั่นใจ ไม่ให้ลอกชุด · ไม่ใช้มังกรเพราะยังไม่นิ่ง (เจ้าของบอกไม่ค่อยชอบดีไซน์ อาจเปลี่ยนเป็นสัตว์อื่น) · **อย่าแนบ `hero_ref_anubis.jpg` (ลุคเดิม) และบาสเต็ดตอนพรอมต์ 0**
3. รอให้มันตอบ ready
4. ส่งแบบ 1–5 ทีละข้อความ (ข้อความละ 1 ภาพ) · **แบบ 5 แนบ `hero_ref_anubis.jpg` (= อนูบิสลุคเดิมบนพื้นครีม, `tools/ref/`) ไปกับข้อความนั้นด้วย**
5. ชอบคนละส่วน → ใช้พรอมต์ผสม

ประโยคแก้ภาพ (ต่อท้ายแล้วส่ง):
- ดูเป็นหมาธรรมดา / หมาป่า → `Make him a real jackal: a long, slim, pointed snout, very tall narrow upright ears, a slender neck and glossy black fur.`
- ขนน้ำตาล / เทา → `His fur must be glossy black with cool charcoal-blue shading, never brown or grey.`
- ผ้าคลุมหัวบังหู → `Remove the headcloth: both tall ears, both eyes and his whole snout must stay fully visible (only rings on his ears or a thin band).`
- เหมือนบอส / บาสเต็ด → `He looks too much like the Egyptian bosses of my game: no blue-and-gold striped cloth, no cream bandages, no long apron; use only the outfit and colours of this design.`
- รก → `Simplify him: fewer straps, pouches, tassels and hanging cloths, a clean sharp silhouette.`
- หน้าบึ้ง / ดุ → `Give him a calm, confident, heroic look with a slight smile, never angry or grumpy.`
- อาวุธผิด → `Fix the weapon: a heavy dark-bronze spiked ball with gold spikes and a gold ankh on its face, on a thick gold chain that ends in a gold crescent hook.`
- ถือคทา / ไม้เท้า / โล่มา → `Remove the staff and the shield: his only weapon is the chain flail.`
- ผ้าคลุมยาว → `Shorten the cape so it ends at his shoulder blades; his back and tail stay clear.`
- มีสีเขียว → `Remove every green: use gold, violet, white or blue instead.`
- มีตัวอักษร → `Remove the writing: only simple symbols (ankh, eye, feather, sun), never rows of hieroglyphs or letters.`
- อยากได้แบบไหนเป็นผู้หญิง → `Make the hero a girl, with the same outfit idea and colours; she must not look like the cat priestess of my game (no turquoise, no cream veil, no book).`
- แก้แค่บางส่วน → ใช้แปรงเลือกเฉพาะจุดใน ChatGPT (สั่งแก้ทั้งภาพ มันจะวาดใหม่หมด)

## 5 แบบ

| แบบ | ลุค | สีตัด | ท่าภาพใหญ่ | ผูกกับ |
|---|---|---|---|---|
| 1 สนธยา (Dusk and Dawn) | แบ่งครึ่งตัว: ฝั่งลูกตุ้ม = กลางวัน (บ่าจานสุริยะทองมีหนาม) · ฝั่งตะขอ = กลางคืน (ผ้าคลุมครึ่งตัวซับในเป็นท้องฟ้าดาวม่วง) · ตาทองข้าง ม่วงข้าง · ปลอกคอทองมีจานสุริยะ · เข็มขัดหัวครึ่งดวงอาทิตย์ครึ่งจันทร์ | ทอง + ม่วง แบ่งกลาง | ขึงโซ่ขวางตัวด้วยสองมือ พร้อมเหวี่ยง | ครบสองสาย · สีตรงกับเอฟเฟกต์ / ไอคอนที่มีอยู่ (A ทอง, B ม่วง) · เทพผู้พาวิญญาณผ่านคืนแห่งดูอัตไปสู่รุ่งเช้า |
| 2 พายุลูกตุ้ม (Flail Dervish) | นักสู้ทะเลทรายตัวเบา แขนกุด · ผ้าคาดหัวสีอำพันใต้หู หางผ้ายาวปลิว · ปลอกคอทองจานสุริยะเล็ก · ผ้าพันแขนขาวห่วงทอง · ผ้าคาดเอวอำพันกว้างบนผ้านุ่งขาวขอบทอง | อำพัน + ทอง + ขาว | หมุนตัวบนเท้าข้างเดียว โซ่เป็นวงกลมรอบตัว ทรายทองวนที่เท้า | สาย A (แรงเหวี่ยง หมุน กวาด ดวงอาทิตย์รา พายุทราย) |
| 3 ผู้พิพากษาแห่งความตาย (Judge of the Dead) | ขนดำเหลือบม่วง ตาทองเรืองม่วงจาง · ขนนกมาอัตสีขาวเหน็บหลังหู · ผ้าคลุมสั้นถึงสะบัก ซับในเป็นท้องฟ้าดาวม่วง · เข็มกลัดตาชั่งทอง · เข็มขัดทองอัญมณีรูปหัวใจแดง · ตะขอเรืองม่วงจาง | ม่วง + ทอง | ยืนตัดสิน ชูโซ่ให้ตะขอห้อยระดับไหล่ ลูกตุ้มห้อยต่ำ | สาย B (เกี่ยว ตรึง บาป ตาชั่ง หัวใจ ประตูเงา) |
| 4 ผู้เฝ้าประตูดูอัต (Warden of the Duat) | เทพนักรบแบบรูปปั้นในวิหาร: เกราะแผ่นดำเคลือบเงาขอบทอง · อกทองมีอังค์ · บ่าทองสลักหัวหมาจิ้งจอก · ห่วงทองปลายหู · ปลอกคอทองลูกปัดทองดำ แดงนิดๆ · ผ้านุ่งลินินขาวจีบเหนือเข่า | ทอง + ขาว | เหวี่ยงลูกตุ้มวนเหนือหัว อีกมือชี้ไปข้างหน้า | สาย C (ชื่อเดียวกัน) · อ่านออกทันทีว่าเป็นเทพอนูบิส |
| 5 อนูบิสโฉมใหม่ (Anubis Reborn) | ลุคเดิมแต่งให้เท่: ขนดำ (ไม่น้ำตาล) · ผ้าลายน้ำเงิน-ทองหดสั้นอยู่หลังหัว หูโผล่เต็ม + แถบทองบางที่หน้าผาก · ผ้าครีมกลายเป็นผ้าคลุมไหล่สั้นสีขาวขอบทอง เข็มกลัดอังค์เดิม · ผ้านุ่งกรมแผงอังค์ทองเหนือเข่า · ไม่มีกระเป๋า พู่ ผ้าห้อย · ผ้าพันแค่หน้าแข้ง · หน้ามั่นใจ ไม่กอดอก | กรม + ทอง + ขาว | โซ่พันแขน ลูกตุ้มห้อย อีกมือแบไปข้างหน้า ยิ้มมั่นใจ | ไอคอน ผังสกิล ภาพหน้าเลือกตัว ภาพหน้าโหลดเดิมยังพอเข้ากันได้ (แต่ยังมีผ้าลายแบบบอสอยู่บ้าง) |

แนะนำ:
- **แบบ 1** เห็นตัวก็รู้ว่ามีสองสาย และสีตรงกับเอฟเฟกต์ / ไอคอนที่มีอยู่แล้ว (สาย A พื้นทอง สาย B พื้นม่วง)
- **แบบ 4** เท่แบบปลอดภัย ดูเป็นเทพอนูบิสทันที
- **แบบ 5** ประหยัดสุด
- ชื่อในหน้าเลือกตัว "Anubis Jackal · Flail Knight" ใช้ได้ทุกแบบ

### พรอมต์ 0 — กติกา (ส่งครั้งเดียวต่อแชต พร้อมแนบ 2 ภาพ)
```
I will ask you for several character design sheets of ONE hero for my cute cartoon fantasy MMORPG (animal heroes from Norse, Greek, Egyptian, Japanese and Aztec myths). These rules apply to every sheet in this chat. Do not draw anything yet: reply only "ready", then draw ONE sheet each time I send a design.

Style: copy the first attached image (the game's key art) — friendly hand-painted chibi cartoon, thick clean dark-brown outlines (not black), cel shading with 2–3 flat tones, soft cartoon glow, bright and warm. Not realistic, not painterly, not 3D. The wolf and the cat in the first image and the monkey in the second image are other heroes of my game: match their proportions, outline weight, colouring and finish, but do NOT copy their designs.

The hero: Anubis, the jackal god of the Egyptian underworld who guides the dead through the Duat and weighs their hearts on the Scales of Ma'at — a chibi anthropomorphic jackal warrior who fights with a chain flail. One path makes him a flail dervish — whirling his spiked ball in wide circles, spinning like a desert whirlwind, leaping to smash the sand and calling down the sun of Ra (golden sand and sunlight). The other path makes him the judge of the dead — throwing the hook to drag a foe in, binding it in chains and crushing it with the judgment of the scales (violet soul fire). He must look COOL, dignified and heroic — a stylish god-warrior that players pick because he looks strong — while staying in the game's cartoon style (a hero, not a monster):
- a real JACKAL: glossy BLACK fur with cool charcoal-blue shading (never brown, never grey), a long slim pointed snout, a black nose, very tall narrow upright ears, a slender neck, a long bushy black tail visible in every view
- sharp gold eyes with thin Egyptian kohl lines at the corners; a calm, confident look — never angry, never grumpy, never snarling
- his ears, his snout and both eyes are always fully visible: no headcloth over his ears, no nemes, no hood, no helmet, no high collar — only rings on his ears or a thin band if the design gives them
- he must NOT look like the Egyptian bosses of my game: no big blue-and-gold striped headcloth, no cream bandage wraps all over the body, no long apron or robe. He must also look clearly different from my other heroes: an Egyptian cat priestess in turquoise and cream with a floating book, a round blue-grey hippo guardian with a teal cape, a mace and a shield, and a white wolf Viking with a crimson cape and a greataxe
- a lean, athletic, agile fighter with a sharp, readable silhouette: strong shoulders but not bulky, only a few dangling items; the outfit ends at or above the knee so his legs read clearly when he walks; sandals or foot wraps that fit his feet
- his back stays fairly clear: at most a short cape that ends at the shoulder blades — no long cape, nothing carried on his back
- his signature weapon, the SAME in every design: a heavy spiked ball of dark bronze with gold spikes and a gold ankh on its face, about the size of his head, on a thick gold chain; the other end of the chain is a gold crescent hook. Standing still, the chain is wrapped around his forearm, the spiked ball hangs from that hand and the hook hangs at his hip. No staff, no shield, no other weapon.
- no green anywhere on the character, and no letters or words anywhere — Egyptian marks are simple symbols (ankh, eye, feather, sun), never rows of hieroglyphs

Every sheet: ONE wide image 1536×1024 on a plain soft cream background. No text, no labels, no names, no logo, no watermark.
Layout: LEFT HALF — the hero large, full body, three-quarter front view, in the pose the design gives. TOP RIGHT — a small turnaround of the same hero standing neutral with the chain wrapped around his forearm and the spiked ball hanging from that hand: front, side facing right, back, all the same height. BOTTOM RIGHT — two small action poses of the same hero side by side: a flail spin, whirling the spiked ball in a wide circle around himself with a swirl of golden sand and sunlight; and a judgment hook, throwing the hook end of the chain forward to snag a foe, the chain burning with violet soul fire.
Keep the hero identical in every view of a sheet. Every design I send is a completely new look: reuse nothing from earlier sheets in this chat except the weapon.
```

### แบบ 1 — สนธยา
```
Design 1 — "Dusk and Dawn". Anubis guides the souls through the night of the underworld to the sunrise, so his look is split down the middle between day and night. Glossy black fur, gold kohl lines, one gold eye on the day side and one violet eye on the night side, a thin gold ring near the tip of each ear. A broad gold collar with a small sun disc in the middle. The flail side is the day: a gold sun-disc pauldron with short ray spikes, a gold bracer, and the spiked ball in that hand. The hook side is the night: a short black half-cape lined with a violet starry sky that covers only that shoulder and ends at the shoulder blades, a violet-and-gold bracer, and the gold hook in that hand. A short black kilt edged with gold above the knee, a belt that is half gold and half violet with a round buckle shaped half like the sun and half like the moon, gold anklets, black sandals with gold straps. Accent colours: gold and violet, split down the middle. Pose: holding the chain stretched taut between both hands across his body, ready to swing, the day side and the night side both facing the viewer, a calm, confident smile.
```

### แบบ 2 — พายุลูกตุ้ม
```
Design 2 — "Flail Dervish". The whirlwind of the desert: he spins his flail like a sandstorm under the sun of Ra. Glossy black fur, bold kohl lines with small gold dots under the eyes, a cocky grin. A deep amber-orange cloth band tied around his forehead below his ears, its two long tails flying behind him. Sleeveless and light: a gold collar with a small sun disc, white cloth wraps with gold rings on his forearms, a wide amber-orange sash wound around his waist over a short white kilt with a gold hem above the knee, gold anklets, simple sandals with amber straps; the hook end of the chain hangs from the sash. Accent colours: amber orange, gold and white. Pose: mid-spin on one foot, the chain whirling in a full circle around him with the spiked ball at its far edge, the headband tails flying and a curl of golden sand at his feet.
```

### แบบ 3 — ผู้พิพากษาแห่งความตาย
```
Design 3 — "Judge of the Dead". The judge who weighs the hearts of the dead against the feather of Ma'at. Black fur with a deep violet sheen; sharp gold eyes with a faint violet glow; a single white feather tucked behind one ear with a small gold ring. A short black cape that ends at his shoulder blades, lined with a deep violet night sky full of tiny gold stars, fastened at his chest by a gold brooch shaped like the Scales of Ma'at. A fitted black sleeveless tunic with gold trim, gold bracers, a gold belt with a heart-shaped red gem, a short black kilt with a violet hem above the knee, gold-capped black sandals with straps up the shin. The gold hook of his chain glows faint violet. Accent colours: violet and gold. Pose: the judge — standing tall, one arm raised holding the chain taut so the gold hook dangles at shoulder height, the spiked ball hanging low from the other hand, the cape lifting behind him, a calm, serious look.
```

### แบบ 4 — ผู้เฝ้าประตูดูอัต
```
Design 4 — "Warden of the Duat". The classic war god, like a living temple statue that guards the gate of the underworld. Glossy black fur, gold kohl lines and a thin gold ring near the tip of each ear. A broad gold collar with rows of gold and black beads and a few small carnelian beads. Fitted armour of black lacquered plates edged in gold: a gold chest plate with a small ankh, small gold pauldrons engraved with a jackal head, gold bracers and gold greaves. A crisp white pleated linen kilt above the knee with a gold belt and a short gold front panel. Black sandals with gold straps. Accent colours: gold and crisp white. Pose: whirling the spiked ball over his head so the chain draws a big loop in the air, his other hand pointing forward, a confident smile.
```

### แบบ 5 — อนูบิสโฉมใหม่ (แนบ `hero_ref_anubis.jpg` ไปกับข้อความนี้)
```
Design 5 — "Anubis Reborn". The hero my game already has (the image attached to this message). Keep his idea — the tall ears, the gold eyes, the blue-and-gold striped headcloth, the white linen with gold trim, the gold ankh brooch, the gold bracelets, the spiked ankh ball on its gold chain — but make him cool and clean. Glossy black fur (not brown). The striped headcloth becomes a short one worn low behind his head, so both tall ears stand completely free and the stripes only frame his neck, with a thin gold band across his brow. A calm, confident face instead of a grumpy one, his arms free (not crossed). The cream shawl becomes a short white linen shoulder cape with a gold border that ends at the shoulder blades, fastened by the gold ankh brooch. A fitted black sleeveless top, gold bracelets, a wide gold belt, a short navy kilt with one gold ankh panel above the knee (no pouches, no long apron, no tassels), linen wraps only on his shins, gold sandals. Accent colours: navy and gold with white. Pose: the chain wrapped around one forearm with the spiked ball hanging from that hand, the other hand open toward the viewer, a confident smile.
```

### พรอมต์ผสม (ตัวอย่าง — เปลี่ยนเลขกับส่วนได้)
```
Design 6 — a mix: the fur and face of design 3 with the outfit of design 1, in the pose of design 2. Same rules and layout.
```

## เลือกแล้วทำอะไรต่อ
1. ส่งชีตที่เลือกมา → เขียนหัวข้อ 'เลือกแล้ว' ในไฟล์นี้ (หน้าตาตามที่วาด + พรอมต์ภาพยืน 5 มุมบนพื้นเขียว S SE E NE N ด้านข้างหันขวา ท่าเดียวกัน ขนาดเท่ากัน โซ่พันแขน ลูกตุ้มห้อย ตะขอที่สะโพกทุกมุม บอกฝั่งของลูกตุ้ม / ตะขอในภาพทีละมุม) — ทำแล้ว: ชีตที่เลือกไม่มีตะขอในท่ายืน จึงไม่ใส่ (ดูหัวข้อ 'เลือกแล้ว' ท้ายไฟล์)
2. ภาพตั้งต้น (`tools/dir8cut.py startv` size=900 feet .9 clean=0 · เว้นที่ด้านข้างให้ลูกตุ้มเหวี่ยง) + พรอมต์คลิป 20 อัน (`tools/clip_prompts.py` เพิ่มรายการ anubis) — ท่าที่เกมใช้:
   - **ท่าตี** = เหวี่ยงลูกตุ้มเฉียงลงตรงหน้า · สกิลเหวี่ยง (`uSwingAct`) เล่นท่าตีตั้งแต่เฟรม 'โดน−3' → เฟรมโดนต้องเป็นลูกตุ้มกระแทกตรงหน้าพอดี
   - **ท่าบัฟ** = ชูลูกตุ้มขึ้นเหนือหัว (โซ่ห้อย) ค้างไว้ราว 1 วิ · สกิลร่าย (`uCast` → `buffAct`) ค้างที่จุดสูงสุด
3. คลิปมา → `tools/cliphero.py` → **ไฟล์ใหม่ `assets_anubis.js`** (prefix เช่น ANB, สลับเข้าแบบ `BST_ART` เฉพาะ `?char=anubis` · `assets.js` ไม่แตะ) คงเวลาเฟรมของ `assets.js` ทุกทิศ (ตอนนี้อนูบิสใช้เวลานี้อยู่):
   - ท่าตี 12 เฟรม 900 ms
     - S = 80, 50, 90, 50, 50, 50, 70, 200, 50, 50, 50, 110 (โดนเฟรม 6 = 370 ms)
     - SE = 50, 50, 190, 70, 90, 50, 50, 50, 50, 50, 90, 110 (เฟรม 4 = 360 ms)
     - E = 80, 50, 50, 100, 50, 120, 60, 120, 50, 50, 50, 120 (เฟรม 6 = 450 ms)
     - N = 110, 120, 50, 50, 70, 50, 120, 70, 50, 50, 50, 110 (เฟรม 6 = 450 ms)
     - NE ตอนนี้ใช้ท่าตีของ E (`atkRemap`) → คลิป NE ใหม่ใช้เวลาของ E
   - ท่าบัฟ 12 เฟรม 1.4 วิ จุดสูงสุดเฟรม 7: S 1,050 ms · E 510 · NE 460 · N 700 · SE มี 6 เฟรม 1.32 วิ จุดสูงสุดเฟรม 3 (660 ms)
   - เดิน 8 × 100 ms (E สลับ 110 / 90) · ยืน 12 เฟรม 2.4 วิ · โดนตี 7 เฟรม 550 ms
   - ตัวยืน S สูงบนจอเท่าหมาป่า (`CHAR_SCALE.anubis` วัดใหม่) · จุดลูกตุ้มทุกเฟรมของท่าตีกับท่าบัฟ (`sockets`) ถ้าหาได้
4. ตามมา: หน้า HUD (`window.HUD_FACE`) + ภาพหน้าเลือกตัว + ท่านั่ง (`hero_sit.js`)
5. ทีหลัง: ไอคอนที่มีตัวอนูบิส + ผังสกิล 4 ภาพ + ภาพหน้าโหลด ld1 ld8 (+ `anubis_head` / `avatar_aura` ถ้าอยากให้ตรงลุค) เขียนพรอมต์ให้ตอนลุคนิ่งแล้ว

## เลือกแล้ว: แบบ 5 อนูบิสโฉมใหม่ (2026-11-24 21:27)
- เจ้าของส่งชีต + "รูปซ้ายเอาไว้ทำ หน้าเลิอกตัวด้วย" → ชีตเก็บที่ `assets/heroes/anubis/sheet_reborn.webp` (1536×1024 พื้นครีม)
- ภาพใหญ่ด้านซ้าย: ตัดพื้นครีม + เงาพื้นสีแทนออกด้วย `tools/bigpose_cut.py` + ตัวเลือกใหม่ `pockbox=60,470,300,640` = เจาะเฉพาะแอ่งครีมในกรอบนี้ (ช่องในห่วงโซ่ + ช่องระหว่างแขนกับตัว) · ผ้าคลุมไหล่ขาว ผ้าซับในกระโปรง ผ้าพันแข้ง ตาขาว เป็นสีครีมเกือบเท่าพื้น ถ้าเจาะแบบปกติ (`pockets=1`) ผ้าคลุมไหล่จะเป็นรู · `xmax=530` กันฝุ่นทรายของท่าสู้ข้างๆ ติดมา → `assets/heroes/anubis/bigpose_reborn.webp` (664×1002 พื้นใส) → หน้าเลือกตัว `assets/heroes/anubis/select.webp` (`tools/select_cut.py` สเกลเดียวกับตัวอื่น สูงชนกรอบ 935 ของ 960 · `char_create.js` SELV anubis 2 = กันแคชภาพเก่า) · ภาพเลือกตัวเดิม (ลุคเก่า) อยู่ในประวัติ git
- ในเกมตอนนี้: หน้าเลือกตัวเป็นลุคใหม่แล้ว แต่ตัวในเกมยังเป็นร่างหมาป่า (`assets.js`) และไอคอน ผังสกิล ภาพเอฟเฟกต์หัวอนูบิส ยังเป็นลุคเดิม จนกว่าคลิป 20 ตัวจะมา

**หน้าตาตามที่วาดออกมา** (ใช้ในพรอมต์ต่อๆ ไปทุกตัว):
- **หัว:** หมาจิ้งจอกดำเงา (เงาม่วงเข้ม ไม่ใช่น้ำตาล) หูสูงแหลมมาก ในหูชมพูหม่น · ตาทองเรียวรูม่านตาดำ เส้นอายไลเนอร์ทองลากไปด้านหลัง + ขีดทองเล็กใต้ตา · จมูกดำ · ยิ้มมั่นใจปากปิด · คาดหน้าผากทองเส้นบาง (มีจุดแหลมเล็กตรงกลาง)
- **ผ้าโพกลายทาง** น้ำเงินเข้มสลับทอง ใส่ต่ำหลังหัว: มุมหน้า = แถบลาย 2 แถบห้อยข้างคอสองข้าง · มุมหลัง = คลุมท้ายทอยทั้งแผ่นลงถึงผ้าคลุมไหล่ · หูทั้งสองตั้งพ้นผ้าทุกมุม
- **ผ้าคลุมไหล่** ลินินขาวสั้นคลุมสองบ่า ขอบทอง + แถบลายซิกแซกทอง · กลัดที่คอด้วยเข็มกลัดทองกลม (ขอบทอง กลางสีเข้ม อังค์ทอง) มีจี้ทองแหลมเล็กห้อยใต้
- **ตัว:** เสื้อดำแนบตัวไม่มีแขน เส้นขลิบทองลงด้านหน้า · แขนดำเปลือย กำไลทองกว้างที่ข้อมือทั้งสองข้าง · มือดำ · เข็มขัดทองกว้าง หัวเข็มขัดทองกลม
- **กระโปรง** สั้นสีกรม ขอบทอง แผงหน้าสีกรมยาวปลายแหลม ขอบทอง อังค์ทองกลางแผง · ผ้าลินินขาวโผล่ด้านข้าง
- **ขา:** ขาดำ ผ้าลินินพันแข้ง กำไลข้อเท้าทอง รองเท้าสานทองบนเท้าดำ · หางพวงดำเงาใหญ่
- **อาวุธ:** **มือขวา**ทุกมุม = โซ่ทองหนาพันกำปั้นหลายรอบ ห้อยลงเป็นสองเส้นถึงลูกตุ้มเหล็กสีน้ำตาลเข้ม (≈ RGB 83, 47, 46) หนามทอง 8 อัน อังค์ทองด้านหน้า · ลูกตุ้มห้อยราวเข่า
- **สี:** ดำ + ทอง + กรม / น้ำเงินเข้ม + ขาว (ผ้า) + ชมพูหม่น (ในหู) + น้ำตาลเข้ม (ลูกตุ้ม) · ไม่มีสีเขียวเลย (นับทั้งชีต 0 จุด · สีฟ้า / กรมทุกจุดน้ำเงินมากกว่าเขียว: แถบผ้า ≈ 44, 45, 92 · กระโปรง ≈ 57, 52, 92) → ตัดพื้นเขียวได้ปลอดภัย

**บนชีตต้องระวัง** (ใส่ไว้ในพรอมต์ข้างล่างแล้ว):
- ภาพใหญ่แบมือซ้ายยื่นมาหาคนดู → ภาพยืนให้มือซ้ายกำหลวมๆ ข้างตัว (โซ่ยังพันมือขวา ลูกตุ้มห้อยข้างขา แบบภาพหมุนรอบตัว)
- ตะขอเกี่ยวทอง (สาย B) มีแค่ในท่าสู้ขวาล่าง → ภาพยืนไม่ใส่ตะขอ (เกมวาดตะขอเองตอนเกี่ยว: `UThrow` + ภาพ `soul_hook`)
- ท่าสู้มีวงทองหมุน ฝุ่นทราย ไฟม่วง → ภาพยืนห้ามเอฟเฟกต์ (ใส่ด้วยโค้ด / ภาพในเกม)
- ผ้าโพกวาดสองแบบตามมุม (หน้า = แถบห้อยข้างคอ · หลัง = คลุมท้ายทอย) → พรอมต์บอกทั้งสองอย่าง ไม่ให้กลายเป็นผ้าคลุมหัวทั้งหัว
- หูสูงมาก + ลูกตุ้มห้อย + หางพวงใหญ่ → สั่งให้อยู่ในกรอบหมด มีพื้นเขียวเหลือรอบตัว
- พรอมต์ออกแบบบอก 'ลูกตุ้มบรอนซ์เข้ม' + 'โซ่พันแขน' แต่วาดเป็นเหล็กสีน้ำตาลเข้ม + โซ่พันกำปั้น → ใช้ตามภาพ

### ขั้น 1 — ภาพยืน 5 มุม ภาพละมุม พื้นเขียว · ✓ มาแล้ว 2026-11-24 21:58
ได้ภาพครบ 5 มุม (ไม่มีข้อความ) → `assets/heroes/anubis/view_S|SE|E|NE|N.webp` · 1254² พื้นเขียว หันขวาทุกภาพ ตัวสูงเท่ากัน (ต่างกัน 2 %) · ไม่มีสีเขียวบนตัว · กำปั้นพันโซ่อยู่ฝั่งที่สั่งทุกมุม ลูกตุ้มห้อยระดับเข่า มือว่างกำหลวมๆ · ไม่มีตะขอ ไม่มีเอฟเฟกต์ · มุมเฉียงหลังเห็นข้างปาก + ปลายเส้นตาทองนิดเดียว (พรอมต์คลิปบอกตามนี้) · มุมหลังเห็นแค่หูสองข้าง ผ้าโพก ผ้าคลุมไหล่ · ข้างล่างเก็บไว้ถ้าจะเจนใหม่

วิธีใช้:
1. ส่งต่อในแชต ChatGPT เดิมที่เจนชีตนี้ (มันจำตัวได้) แนบชีตไปกับพรอมต์ 0 อีกครั้ง · ถ้าเปิดแชตใหม่ แนบชีต + ภาพปกแคมป์ไฟ (`keyart_campfire_ld5.jpg`)
2. ส่งพรอมต์ 0 → รอมันตอบ ready
3. ส่งภาพ 1–5 ทีละข้อความ (ข้อความละ 1 ภาพ)
4. ครบแล้วส่ง 5 ภาพมาให้ผม

ทำไมแยกภาพละมุม: ภาพใหญ่ = รายละเอียดชัดในคลิป (480p) · ทุกภาพท่ายืนเดียวกัน ขนาดเท่ากัน · บอกว่าโซ่ ลูกตุ้ม หาง ต้องอยู่ฝั่งไหนของภาพ · มุมไหนหันซ้ายมาไม่ต้องแก้ ผมกลับด้านให้

แก้ภาพ (ต่อท้ายแล้วส่ง):
- หันผิดทาง → `Redo picture 2: he must face the RIGHT side of the picture.`
- มุมหลังเห็นหน้า → `Redo picture 4: turn him further away, we must not see his eyes or his face.`
- ขนาดไม่เท่ากัน → `Redo picture 3: draw him the same size as in picture 1.`
- มีหลายตัว → `Redo picture 1: only ONE jackal in the picture, nothing else.`
- โซ่ / ลูกตุ้มย้ายไปอีกมือ (มุมหน้า) → `Redo picture 1: the gold chain and the spiked ball must be in the hand on the LEFT side of the picture, and his other hand on the RIGHT side is empty and loosely closed.`
- ลูกตุ้มหาย / โซ่ขาด → `Redo picture 3: keep the gold chain wrapped around his fist and the dark spiked ball with the gold ankh hanging from it, exactly as on the sheet.`
- มีตะขอโผล่มา → `Redo picture 2: no golden hook — only the chain and the spiked ball.`
- ผ้าโพกคลุมทั้งหัว / หูหาย → `Redo picture 1: the striped headcloth is worn low behind his head; both tall ears stand completely free above it.`
- มีเอฟเฟกต์ติดมา → `Redo picture 2: no golden swirls, no sand, no purple fire, no glow, no sparkles — just the jackal standing.`
- อ้าปาก / เห็นฟัน → `Redo picture 1: his mouth closed, a calm, confident small smile.`
- หู / ลูกตุ้ม / หางล้นกรอบ → `Redo picture 3: draw him a little smaller so his whole ears, the whole spiked ball and his whole tail fit inside the picture.`
- แก้แค่บางส่วน → ใช้แปรงเลือกเฉพาะจุดใน ChatGPT (สั่งแก้ทั้งภาพ มันจะวาดใหม่หมด)

#### พรอมต์ 0 — กติกา (ส่งครั้งเดียว พร้อมแนบชีต)
```
Next I need this same hero — the black jackal warrior on the attached sheet — drawn standing in 5 directions for my game's animation, ONE picture per message. Do not draw anything yet: reply only "ready", then draw one picture each time I send a direction.

Every picture:
- ONE jackal alone in a square picture on a plain flat pure green background (#00FF00): no gradient, no floor, no shadow under him, no other views, no text, no logo, no watermark.
- exactly the same character and drawing style as the sheet, nothing added and nothing left out: friendly hand-painted chibi cartoon, thick clean dark-brown outlines, flat cel shading with 2–3 tones. A slim, athletic black jackal with glossy black fur (dark plum-black shading, not brown), two very tall pointed ears with dusty-pink insides, narrow gold eyes with gold kohl lines that sweep back and a small gold mark under each eye, a black nose and a calm, confident small smile with his mouth closed. A thin gold band across his brow. A short deep-blue-and-gold striped headcloth worn low at the back of his head: from the front two striped flaps hang down beside his neck, from behind it covers the back of his head down to his shoulders, and both tall ears always stand completely free above it. A short white linen shoulder cape over both shoulders with a gold border and a gold zigzag band, fastened at his throat by a round gold brooch with a dark centre and a gold ankh, with a small gold point hanging under it. A fitted black sleeveless top with thin gold trim lines down the front. Bare black arms with wide gold cuffs on both wrists. A wide gold belt with a round gold buckle. A short navy kilt with gold borders and one long navy front panel with a gold border, a gold ankh and a pointed end; white linen shows at the sides of the kilt. White linen wraps on his shins, gold ankle bands and gold sandals on his black feet. A big bushy black tail.
- his weapon, always in his RIGHT hand: a thick gold chain wrapped several times around his fist, with two short strands hanging down to a dark brown iron spiked ball with eight gold spikes and a gold ankh on its front. No golden hook, no other weapon, no shield.
- the same standing pose in every picture: standing tall in a relaxed, ready stance, feet about shoulder-width apart, his right fist with the chain at his side so the spiked ball hangs beside his leg at about knee height, his other hand empty and loosely closed at his other side.
- the same size in every picture: from the tips of his ears to the soles of his feet he fills about three quarters of the picture's height, his feet near the bottom with a small margin; his whole ears, the whole chain and spiked ball and his whole tail inside the picture with green space all round.
- no green anywhere on him: the blues are deep blue and navy. No golden swirls, no sand, no dust, no purple fire, no glow, no sparkles, no motion lines, no effects.
```

#### ภาพ 1 — หน้าตรง
```
Picture 1 — FRONT view: he faces straight toward us, like the front view on the sheet. His right fist with the gold chain wrapped around it is on the LEFT side of the picture, with the spiked ball hanging beside his leg at about knee height; his empty, loosely closed hand is on the RIGHT side of the picture. Both tall ears stand straight up, the two striped flaps of the headcloth hang beside his neck, and the round gold ankh brooch sits at his throat.
```

#### ภาพ 2 — เฉียงหน้า หันขวา
```
Picture 2 — FRONT THREE-QUARTER view: he is turned toward the RIGHT side of the picture, facing down and to the right, like the big pose on the sheet but standing calmly with both arms down. We see his face with his muzzle pointing to the right and mostly his right side: his right fist with the gold chain is his near hand, on the LEFT side of the picture, with the spiked ball hanging beside his near leg; his empty far hand hangs on the right, partly behind his body. His bushy tail shows behind him on the left side of the picture.
```

#### ภาพ 3 — ข้าง หันขวา
```
Picture 3 — SIDE view facing RIGHT, like the side view on the sheet: his muzzle points to the right edge of the picture and we see his right side — the near tall ear with its pink inside and the far ear just behind it, one gold eye with its gold kohl line, the striped headcloth hanging at the back of his head and the white shoulder cape. His near right fist with the gold chain hangs at his side, with the spiked ball hanging below it by his knee, fully visible; his far hand is hidden behind his body. His bushy tail hangs out behind him on the left side of the picture.
```

#### ภาพ 4 — เฉียงหลัง หันขวา
```
Picture 4 — BACK THREE-QUARTER view: he is turned away from us, facing up and to the RIGHT. We see mostly his back: the back of his head with both tall ears, the striped headcloth covering the back of his head down to his shoulders, the white shoulder cape with its gold zigzag band across his upper back, and his bushy tail; of his face only the edge of his muzzle on the right — not his eyes and not his face. His right fist with the gold chain is his near hand, on the RIGHT side of the picture, with the spiked ball hanging beside his leg; his empty far hand is on the left, partly behind his body.
```

#### ภาพ 5 — หลัง
```
Picture 5 — BACK view: his back faces us, like the back view on the sheet: the back of his head with both tall ears, the striped headcloth covering the back of his head down to the white shoulder cape, the cape with its gold zigzag band across his upper back, the back of the gold belt and of the navy kilt, and his bushy tail hanging down in the middle; no face. His right fist with the gold chain is on the RIGHT side of the picture, with the spiked ball hanging beside his leg; his empty hand is on the LEFT side.
```

### ขั้น 2 — ภาพตั้งต้น + คลิปท่า 20 ตัว · ภาพตั้งต้นส่งแล้ว 2026-11-24 (เท้าที่ 88 % แบบแรด) · รอคลิป
ภาพ 5 มุมมาแล้ว → ตัดภาพตั้งต้น `anubis_1_S.png … anubis_5_N.png` (`tools/dir8cut.py startv`, คำสั่งอยู่ใน `ANUBIS_CLIP_PROMPTS_TH.md`) ส่งพร้อม `ANUBIS_CLIP_PROMPTS_TH.md` (คลิป 20 ตัว ยืน · เดิน · เหวี่ยงลูกตุ้ม · ชูกำปั้น × 5 ทิศ สร้างจาก `python3 tools/clip_prompts.py anubis`)

### ขั้น 3 เป็นต้นไป
3. **สไปร์ทจากคลิป** — `cliphero.py` → **ไฟล์ใหม่ `assets_anubis.js`** (prefix ใหม่ สลับเข้าแบบ `BST_ART` เฉพาะ `?char=anubis` · `assets.js` ไม่แตะ: ยังเป็นร่างของจิ้งจอก สิงโต จระเข้ อีกา) · เวลาเฟรมเท่า `assets.js` ทุกทิศ (ตารางอยู่ในหัวข้อ 'เลือกแล้วทำอะไรต่อ' ข้างบน + ท้าย `ANUBIS_CLIP_PROMPTS_TH.md`) · ตัวยืนสูงบนจอเท่าหมาป่า (วัด `CHAR_SCALE.anubis` ใหม่)
4. **ของที่ผูกกับสไปร์ท** — หน้า HUD (ตัดหัวจาก view_S ผ่าน window.HUD_FACE) · ท่านั่ง (`hero_sit.js`) · จุดลูกตุ้มทุกเฟรมของท่าเหวี่ยงกับท่าชู (sockets) ถ้าจะให้เอฟเฟกต์วิ่งตามลูกตุ้ม (ตอนนี้โค้ดอนูบิสไม่อ่าน socket)
5. **ทีหลัง** — ไอคอนที่มีตัวอนูบิส (~2 ใน 3 ของ 55 + ex_ 8) + ผังสกิล 4 ภาพ + ภาพเอฟเฟกต์ `anubis_head` / `avatar_aura` (เทพหมาจิ้งจอกทองโพกผ้าลายทาง ยังพอเข้ากับลุคใหม่) + ภาพหน้าโหลด ld1 ld8
