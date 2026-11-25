"""Region prompt files for the monster art v2 (monster_prompts/NN_<land>.txt): the owner uploads one file to ChatGPT, it draws one 5-row sheet per reply. Data: tools/monster_prompt_data.py. usage: python3 tools/monster_prompts.py"""
import os
exec(open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'monster_prompt_data.py')).read())
W={'2':"TWO LEGS — walking in place, legs MUST alternate: 1) LEFT leg forward and planted, 2) passing pose with the RIGHT leg lifted, 3) RIGHT leg forward and planted, 4) passing pose with the LEFT leg lifted. Frames 1 and 3 clearly show a different leg in front; arms swing opposite to the legs.",
'4':"FOUR LEGS — trotting in place, diagonal pairs MUST alternate: 1) front-LEFT + back-RIGHT legs reach forward, 2) passing pose, legs under the body, 3) front-RIGHT + back-LEFT legs reach forward, 4) passing pose. Frames 1 and 3 clearly show different legs in front; tail swings.",
'6':"MANY LEGS (insects, spiders, crabs, octopus) — legs move in two alternating groups: 1) group A reaches forward, 2) passing pose, 3) group B reaches forward, 4) passing pose. Frames 1 and 3 clearly differ.",
'f':"FLOATING (ghosts, spirits, no legs) — 1) high, leaning forward, 2) middle, trailing parts swept back, 3) low, 4) middle, trailing parts swinging the other way. Nothing touches the ground.",
'w':"FLYING (birds, bats, winged things) — hovering in place: 1) wings up, 2) wings half down, 3) wings fully down, 4) wings half up; the body bobs a little, feet tucked.",
's':"SLITHERING (snakes, worms, tails instead of legs) — 1) body S-curve bending left, 2) straightening, 3) S-curve bending right, 4) straightening. Frames 1 and 3 clearly mirror each other.",
'h':"HOPPING (frogs, rabbits, slimes, one-legged things) — 1) crouched low, 2) pushing off, 3) highest point in the air, 4) landing squashed."}
WN={'2':'TWO LEGS','4':'FOUR LEGS','6':'MANY LEGS','f':'FLOATING','w':'FLYING','s':'SLITHERING','h':'HOPPING'}
ORDER=[('01','viking','Viking'),('02','capital','Capital'),('03','aztec','Aztec'),('04','greek','Greek'),('05','egypt','Egypt'),('06','japan','Japan'),('07','rift','Rift'),('08','sea','Sea')]
# One self-contained prompt per monster, to paste box by box in chat (owner 2026-11-25 08:09: the whole sea prompt .md attached to ChatGPT came out a mess).
# usage: python3 tools/monster_prompts.py single sea 1-11   (region key or file number, optional range) — prints Markdown, writes nothing.
SINGLE="""Make ONE sprite sheet of a monster for my 2D isometric fantasy MMORPG (Ragnarok Online feel). Copy the art style of the attached pictures: friendly hand-painted chibi cartoon, cute-but-dangerous, thick clean dark-brown outlines (not black), cel shading with 2–3 flat tones, soft light from the top-left, bright warm colours, clear readable silhouette. Not realistic, not painterly, not 3D. Chibi proportions (big head, short body) even for giants.
Monster: {name}{size} — {look}.
Sheet: ONE 1536×1024 image, 5 rows. The SAME monster in every frame — identical design, colours and size, never redesigned. Facing DOWN-RIGHT (south-east), isometric 3/4 view from about 30° above. Every frame in its own equal-size cell with empty space around it; feet (or lowest point) on the same baseline in each row; nothing cropped, nothing overlapping another frame.
Row 1 — IDLE, 4 frames: calm breathing — neutral, body rises slightly, neutral, body sinks slightly with a small detail moving.
Row 2 — WALK, 4 frames, {walk}
Row 3 — ATTACK, 5 frames: {attack} — 1) ready, 2) wind-up, 3) strike at full reach toward down-right, 4) follow-through, 5) back to ready.
Row 4 — HURT, 2 frames: 1) hit from the front, head and body jerk back, eyes squeezed shut, 2) recoiling, about to recover.
Row 5 — DEATH, 5 frames: 1) staggers back, 2) falling, 3) hits the ground, 4) lying still, 5) the same pose fading away. Cartoon, no blood.
{extra}Background: SOLID FLAT PURE GREEN (#00FF00), no gradient, no ground, no shadows. NEVER use green on the monster: anything that would normally be green is drawn teal, turquoise, blue, gold or autumn orange instead. No text, no row labels, no numbers, no borders, no motion lines, no dust or magic effects around it (small glows ON the body are fine)."""
SINGLE_X={'sea':"It is a sea creature, but draw NO water, waves, bubbles or sea floor around it — the game adds the water.\n"}
import sys
if len(sys.argv)>2 and sys.argv[1]=='single':
    key=next(k for n,k,t in ORDER if sys.argv[2] in (n,k))
    world,ms=L[key]
    a,b=1,len(ms)
    if len(sys.argv)>3: r=sys.argv[3].split('-'); a=int(r[0]); b=int(r[-1])
    for i,(n,th,mp,w,d,att) in enumerate(ms,1):
        if not a<=i<=b: continue
        size,_,look=d.partition(' — ')
        if not look: size,look='',d
        wk=W[w].split(' — ',1)[1]
        print(f"**#{i} {n}** · {th} ({mp})\n```\n"+SINGLE.format(name=n.upper(),size=f' ({size})' if size else '',look=look,walk=WN[w].lower()+': '+wk,
              attack=att,extra=SINGLE_X.get(key,''))+"\n```\n")
    sys.exit(0)
OUT=os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),'monster_prompts');os.makedirs(OUT,exist_ok=True)
idx=[]
for num,key,title in ORDER:
    world,ms=L[key]
    used=sorted(set(m[3] for m in ms),key=lambda c:'24f6wsh'.index(c))
    t=f"""MONSTER SPRITE SHEETS — {title.upper()} ({len(ms)} monsters)
Game: Totem Legend, a 2D isometric fantasy MMORPG (Ragnarok Online feel). This region: {world}.

=== HOW TO WORK WITH THIS FILE — READ EVERYTHING FIRST ===
• This file lists {len(ms)} monsters. For each monster you draw ONE sprite-sheet image.
• Draw ONE image per reply, in list order, starting with #1.
• After each image write only "#<number> <name> done" and STOP. Wait for me.
  - "next" = draw the next monster.   - "redo" = draw the same monster again.   - a number (e.g. "12") = draw that monster.
• Before every image, re-read the STYLE, SHEET and WALK rules below. Every image must follow them exactly.
• Never put text, numbers or labels inside the image.

=== STYLE (copy the attached pictures) ===
Friendly hand-painted chibi cartoon, cute-but-dangerous, thick clean dark-brown outlines (not black), cel shading with 2–3 flat tones, soft light from the top-left, bright warm colours, clear readable silhouette. Not realistic, not painterly, not 3D. Chibi proportions (big head, short body) even for giants.

=== SHEET (the same for every monster) ===
• ONE 1536×1024 image, 5 rows. The SAME monster in every frame: identical design, colours and size, never redesigned between frames.
• Facing DOWN-RIGHT (south-east), isometric 3/4 view from about 30° above.
• Every frame in its own equal-size cell with empty space around it; feet (or lowest point) on the same baseline within each row; nothing cropped, nothing overlapping another frame.
• Row 1 — IDLE, 4 frames: calm breathing — neutral, body rises slightly, neutral, body sinks slightly with one small detail moving (ear, tail, cloak, flame).
• Row 2 — WALK, 4 frames: use the walk type given for the monster (see WALK TYPES).
• Row 3 — ATTACK, 5 frames: the monster's own attack given in its entry — 1) ready, 2) wind-up, 3) strike at full reach toward down-right, 4) follow-through, 5) back to ready.
• Row 4 — HURT, 2 frames: 1) hit from the front — head and body jerk back, eyes squeezed shut, 2) recoiling, about to recover.
• Row 5 — DEATH, 5 frames: 1) staggers back, 2) falling, 3) hits the ground, 4) lying still, 5) the same pose fading away. Cartoon, no blood or gore.
• Background: SOLID FLAT PURE GREEN (#00FF00) — no gradient, no ground, no shadows. NEVER use green on the monster: anything that would normally be green (leaves, skin, slime, jade, moss) is drawn teal, turquoise, blue, gold or autumn orange instead.
• No text, no row labels, no numbers, no borders, no motion lines, no dust, no magic effects floating around the monster (small glows ON the body are fine).

=== WALK TYPES ===
""" + "\n".join("• "+W[c] for c in used) + "\n\n=== MONSTERS ===\n"
    for i,(n,th,mp,w,d,a) in enumerate(ms,1):
        t+=f"\n#{i} {n.upper()}\n   Walk: {WN[w]}\n   Look: {d}.\n   Attack: {a}.\n"
        idx.append((num,title,i,n,th,mp,WN[w]))
    t+="\n(End of list. Start with #1 when I say so.)\n"
    open(f'{OUT}/{num}_{key}.txt','w').write(t)
open('/tmp/mon_idx.json','w').write(__import__('json').dumps(idx,ensure_ascii=False))
