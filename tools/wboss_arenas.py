"""World-boss arenas (owner 2026-11-22: 'แมพเฉพาะสำหรับสู้กับบอสแต่ละตัวเข้าธีมกัน') — one tool builds everything:

  python3 -I tools/wboss_arenas.py            cut the props sheets + write maps/wboss-arenas.js
  python3 -I tools/wboss_arenas.py preview    + preview pictures of every layout in /tmp/wboss_pv (floor + pieces + walk mask + collision)

Inputs  assets/bosses/world/arena/<arena>_props.png   the owner's props sheets (3x2 on green; Mayawee on magenta)
        maps/wboss/<arena>_floor.webp                  the owner's floor pictures (1536x1024)
Outputs maps/wboss/<piece>.webp                        cut pieces (kept at the sheet's resolution, ~1.7x their size in game)
        maps/wboss-arenas.js                           VK_CAT pieces + 8 VK_MAPS configs (loaded after maps/capital-maps.js)

Layout below is written in FLOOR-PICTURE pixels (1536x1024); the game map is the picture x1.5 = 2304x1536 map px.
Pieces: h = height in map px, ay = foot (0..1 of the height), collision in units of the piece width w
(c=number circle · c=[rx,ry] ellipse · cs=[[dx,dy,r],...] circles · none = walk-through), sw = sway, nc = no shadow.
Walk area: union of 'walk' shapes minus 'block' shapes minus 'lines' (thick polylines) — E(cx,cy,rx,ry) / Pg(points).
To move something: edit the numbers here, run the tool, reload the game (?map=wbKhepra … or the guild master's menu)."""
import json, os, sys
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as nd

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
S = 1.5
W, H = 1536, 1024

# ---------------------------------------------------------------- props sheets → pieces
SHEETS = {
 'khepra':    (['khepra_obelisk', 'khepra_obelisk_broken', 'khepra_scarab', 'khepra_columns', 'khepra_rock', 'khepra_standard'], None, 1),
 'puijantra': (['puijantra_lantern', 'puijantra_toro_dark', 'puijantra_pampas', 'puijantra_dango', 'puijantra_moonrock', 'puijantra_arch'], None, 1),
 'burumba':   (['burumba_palisade', 'burumba_tower', 'burumba_ghostgate', 'burumba_flag', 'burumba_barricade', 'burumba_rack'], None, 1),
 'mayawee':   (['mayawee_bud', 'mayawee_bud_burst', 'mayawee_bud_drained', 'mayawee_pillar', 'mayawee_statue', 'mayawee_fern'], None, 0),
 'brontara':  (['brontara_rod0', 'brontara_rod1', 'brontara_rod2', 'brontara_spire', 'brontara_tree', 'brontara_cloud'], None, 1),
 'lumina':    (['lumina_lantern', 'lumina_arch', 'lumina_pillar', 'lumina_cloud', 'lumina_shard', 'lumina_shard_crack'], None, 1),
 'urtok':     (['urtok_bear', 'urtok_owlwolf', 'urtok_boulders', 'camp_tent', 'camp_stone', 'camp_stall'],
               [(0, 0, 690, 345), (690, 0, 1536, 345), (380, 330, 1200, 545), (0, 480, 610, 1024), (610, 500, 960, 1024), (960, 500, 1536, 1024)], 1),
}

# ---------------------------------------------------------------- pieces in game
P = {
 # Khepra — Sundial Sands
 'wbKhObelisk':   dict(f='khepra_obelisk', h=300, ay=.965, c=[.42, .16]),
 'wbKhObeliskB':  dict(f='khepra_obelisk_broken', h=236, ay=.955, c=[.36, .14]),
 'wbKhScarab':    dict(f='khepra_scarab', h=255, ay=.965, c=[.44, .16]),
 'wbKhColumns':   dict(f='khepra_columns', h=262, ay=.955, cs=[[-.23, -.04, .1], [.26, -.04, .1]]),
 'wbKhRock':      dict(f='khepra_rock', h=122, ay=.93, c=[.4, .12]),
 'wbKhStandard':  dict(f='khepra_standard', h=240, ay=.975, cs=[[0, -.02, .07]], sw=0),
 # Puijantra — Moonstone Terrace ('lantern' in a name = the map's fire glow, so the dark one is a 'toro')
 'wbPuLantern':   dict(f='puijantra_lantern', h=226, ay=.975, c=[.3, .12]),
 'wbPuToroDark':  dict(f='puijantra_toro_dark', h=226, ay=.975, c=[.3, .12]),
 'wbPuPampas':    dict(f='puijantra_pampas', h=150, ay=.95, sw=.9),
 'wbPuDango':     dict(f='puijantra_dango', h=162, ay=.955, c=[.36, .14]),
 'wbPuMoonRock':  dict(f='puijantra_moonrock', h=124, ay=.92, c=[.4, .13]),
 'wbPuArch':      dict(f='puijantra_arch', h=300, ay=.95, cs=[[-.29, -.05, .09], [.29, -.05, .09]]),
 # Burumba — War-Drum Battlefield
 'wbBuPalisade':  dict(f='burumba_palisade', h=150, ay=.93, c=[.46, .08]),
 'wbBuTower':     dict(f='burumba_tower', h=272, ay=.95, c=[.36, .14]),
 'wbBuGhostGate': dict(f='burumba_ghostgate', h=272, ay=.955, cs=[[-.37, -.04, .07], [.38, -.04, .07]]),
 'wbBuFlag':      dict(f='burumba_flag', h=250, ay=.975, cs=[[0, -.02, .07]], sw=0),
 'wbBuBarricade': dict(f='burumba_barricade', h=122, ay=.9, c=[.44, .12]),
 'wbBuRack':      dict(f='burumba_rack', h=150, ay=.93, c=[.44, .12]),
 # Mayawee — Garden of a Thousand Hues (bud states: the fight will swap them)
 'wbMaBud':       dict(f='mayawee_bud', h=172, ay=.9),
 'wbMaBudBurst':  dict(f='mayawee_bud_burst', h=193, ay=.9),
 'wbMaBudDrained': dict(f='mayawee_bud_drained', h=120, ay=.88),
 'wbMaPillar':    dict(f='mayawee_pillar', h=272, ay=.95, c=[.34, .12]),
 'wbMaStatue':    dict(f='mayawee_statue', h=225, ay=.955, c=[.42, .15]),
 'wbMaFern':      dict(f='mayawee_fern', h=172, ay=.93, sw=.5),
 # Brontara — Thunder Peak (rod states: asleep / awake / charged)
 'wbBrRod0':      dict(f='brontara_rod0', h=282, ay=.965, c=[.34, .12]),
 'wbBrRod1':      dict(f='brontara_rod1', h=282, ay=.965, c=[.34, .12]),
 'wbBrRod2':      dict(f='brontara_rod2', h=291, ay=.965, c=[.3, .11]),
 'wbBrSpire':     dict(f='brontara_spire', h=285, ay=.955, c=[.38, .14]),
 'wbBrTree':      dict(f='brontara_tree', h=232, ay=.95, cs=[[-.08, -.02, .06]], sw=.25),
 'wbBrCloud':     dict(f='brontara_cloud', h=150, ay=.8, nc=1),
 # Lumina — Cloud-Sea Bridge (+ the room inside her)
 'wbLuLantern':   dict(f='lumina_lantern', h=204, ay=.975, c=[.34, .13]),
 'wbLuArch':      dict(f='lumina_arch', h=262, ay=.95, cs=[[-.27, -.04, .08], [.25, -.04, .08]]),
 'wbLuPillar':    dict(f='lumina_pillar', h=234, ay=.975, c=[.36, .13]),
 'wbLuCloud':     dict(f='lumina_cloud', h=150, ay=.8, nc=1),
 'wbLuShard':     dict(f='lumina_shard', h=400, ay=.975, c=[.4, .14]),
 'wbLuShardCrack': dict(f='lumina_shard_crack', h=402, ay=.975, c=[.4, .14]),
 # Urtok — Totem Crater, and the guild camp every arena borrows
 'wbUrBear':      dict(f='urtok_bear', h=192, ay=.88, c=[.42, .12]),
 'wbUrOwlWolf':   dict(f='urtok_owlwolf', h=174, ay=.9, c=[.44, .12]),
 'wbUrBoulders':  dict(f='urtok_boulders', h=98, ay=.86, c=[.46, .1]),
 'wbCampTent':    dict(f='camp_tent', h=252, ay=.87, c=[.4, .15]),
 'wbCampStone':   dict(f='camp_stone', h=222, ay=.93, cs=[[-.26, -.03, .05], [.17, -.12, .15]]),
 'wbCampStall':   dict(f='camp_stall', h=192, ay=.93, c=[.42, .14]),
}
CAMP_CIRCLE = (.13, .0)   # the stone's glowing respawn circle, from its foot in units of w: the arena's way home stands on it

# boss stand-ins: the master picture 400 map px wide in the middle (a preview until the real boss exists); flyers hover
BOSS_W = 400
FLY = {'brontara': 150, 'lumina': 150}

def E(cx, cy, rx, ry): return {'e': [cx, cy, rx, ry]}
def Pg(*pts): return {'p': [v for xy in pts for v in xy]}

A = {}
A['khepra'] = dict(shadow='#7a3c24', id='wbKhepra', name='ลานนาฬิกาแดด · เคปรา ด้วงสุริยะ', mood='desert', theme='desert', bounce='rgba(230,150,80,.16)',
  boss=(770, 470), start=(770, 905),
  walk=[E(770, 452, 765, 470), Pg((395, 845), (1160, 845), (1195, 1024), (370, 1024))],
  props=[('wbKhObeliskB', 769, 70), ('wbKhObelisk', 245, 240), ('wbKhObelisk', 1290, 244, 1), ('wbKhObelisk', 200, 622),
         ('wbKhObelisk', 1332, 622, 1), ('wbKhObeliskB', 767, 828, 1),
         ('wbKhStandard', 618, 872), ('wbKhStandard', 916, 872, 1),
         ('wbKhRock', 118, 122), ('wbKhRock', 1430, 112, 1), ('wbKhRock', 1460, 425, 1), ('wbKhRock', 70, 470),
         ('wbKhColumns', 140, 875), ('wbKhColumns', 1395, 880, 1), ('wbKhScarab', 75, 300), ('wbKhScarab', 1468, 650, 1),
         ('wbCampTent', 470, 1015), ('wbCampStone', 735, 1005), ('wbCampStall', 1060, 1015)])
A['puijantra'] = dict(shadow='#3a3060', id='wbPuijantra', name='ลานหินจันทร์ · ปุยจันทรา กระต่ายจันทร์', mood='moon', theme='japan', bounce='rgba(150,150,220,.16)',
  boss=(770, 470), start=(770, 895),
  walk=[E(770, 428, 712, 398), Pg((515, 828), (1018, 828), (1098, 1024), (432, 1024))],
  props=[('wbPuLantern', 645, 107), ('wbPuLantern', 895, 107, 1), ('wbPuLantern', 285, 241), ('wbPuLantern', 1240, 237, 1),
         ('wbPuLantern', 182, 489), ('wbPuLantern', 1355, 489, 1), ('wbPuToroDark', 387, 741), ('wbPuToroDark', 1140, 741, 1),
         ('wbPuArch', 770, 968), ('wbPuDango', 545, 900), ('wbPuMoonRock', 478, 1012), ('wbPuMoonRock', 1068, 1015, 1),
         ('wbPuPampas', 108, 300), ('wbPuPampas', 1432, 302, 1), ('wbPuPampas', 120, 600, 1), ('wbPuPampas', 1418, 600),
         ('wbCampStone', 985, 908)])
A['burumba'] = dict(shadow='#5a3020', id='wbBurumba', name='สมรภูมิกลองศึก · บุรุมบา ช้างกลองศึก', mood='dusk', theme='desert', bounce='rgba(220,130,70,.16)',
  boss=(770, 470), start=(770, 905),
  walk=[Pg((30, 30), (1506, 30), (1506, 1000), (30, 1000))],
  block=[E(70, 40, 120, 60), E(330, 22, 70, 30), E(1450, 55, 120, 70), E(1210, 20, 80, 26),
         E(115, 905, 105, 70), E(160, 828, 60, 32), E(1355, 912, 110, 62), E(1470, 800, 70, 45)],
  lines=[dict(w=46, p=[(640, 36), (575, 60), (470, 58), (400, 78), (330, 100), (255, 128), (185, 180), (120, 250), (88, 305), (85, 345)]),
         dict(w=46, p=[(880, 36), (950, 55), (1060, 55), (1170, 100), (1265, 140), (1340, 190), (1410, 250), (1442, 305), (1445, 345)]),
         dict(w=46, p=[(62, 470), (80, 540), (115, 610), (170, 670), (230, 712), (330, 760), (450, 792), (520, 810), (600, 822)]),
         dict(w=46, p=[(925, 822), (1000, 810), (1080, 792), (1180, 757), (1290, 722), (1360, 672), (1405, 620), (1440, 560), (1468, 478)])],
  props=[('wbBuPalisade', 470, 76), ('wbBuPalisade', 1066, 74, 1), ('wbBuPalisade', 268, 136),
         ('wbBuGhostGate', 72, 416), ('wbBuGhostGate', 1462, 416, 1), ('wbBuBarricade', 690, 60), ('wbBuBarricade', 840, 60, 1),
         ('wbBuFlag', 592, 838), ('wbBuFlag', 942, 838, 1), ('wbBuTower', 262, 905), ('wbBuTower', 1268, 905, 1),
         ('wbBuRack', 385, 990), ('wbBuRack', 1160, 992, 1),
         ('wbCampTent', 530, 1010), ('wbCampStone', 730, 1005), ('wbCampStall', 1005, 1010)])
A['mayawee'] = dict(shadow='#2c4a1c', id='wbMayawee', name='สวนวัดร้างหลากสี · มายาวี กิ้งก่าพันสี', mood='jungle', theme='jungle', bounce='rgba(120,160,60,.16)',
  boss=(770, 470), start=(770, 905),
  walk=[Pg((130, 150), (250, 70), (470, 40), (640, 18), (900, 18), (1060, 40), (1290, 70), (1410, 150), (1470, 260), (1480, 420),
           (1450, 560), (1395, 650), (1300, 735), (1050, 790), (1035, 845), (1110, 1024), (430, 1024), (500, 845), (470, 790),
           (230, 740), (150, 660), (95, 560), (70, 420), (85, 260))],
  block=[Pg((90, 200), (180, 210), (300, 250), (300, 330), (240, 440), (240, 520), (300, 600), (200, 610), (120, 580), (80, 420)),
         E(770, 90, 108, 58), E(350, 165, 108, 58), E(1185, 165, 108, 58), E(195, 390, 108, 58), E(1335, 390, 108, 58),
         E(305, 625, 108, 58), E(1230, 625, 108, 58)],
  props=[('wbMaBud', 770, 104), ('wbMaBud', 350, 179), ('wbMaBud', 1185, 179, 1), ('wbMaBud', 195, 404), ('wbMaBud', 1335, 404, 1),
         ('wbMaBud', 305, 639), ('wbMaBud', 1230, 639, 1),
         ('wbMaPillar', 205, 118), ('wbMaPillar', 1305, 112, 1), ('wbMaPillar', 150, 715), ('wbMaPillar', 1385, 712, 1),
         ('wbMaStatue', 482, 865), ('wbMaStatue', 1052, 865, 1),
         ('wbMaFern', 120, 935), ('wbMaFern', 1430, 940, 1), ('wbMaFern', 300, 1015, 1), ('wbMaFern', 1240, 1020),
         ('wbCampStone', 640, 1005), ('wbCampStall', 985, 1012)])
A['brontara'] = dict(shadow='#2a2a40', id='wbBrontara', name='ยอดผาอัสนี · บรอนทารา นกอัสนี', mood='dragon', theme='snow', bounce='rgba(150,160,200,.16)',
  boss=(770, 520), start=(770, 900),
  walk=[Pg((160, 210), (300, 120), (420, 70), (600, 32), (800, 22), (990, 30), (1150, 70), (1290, 120), (1400, 200), (1465, 300),
           (1490, 420), (1470, 530), (1400, 640), (1310, 730), (1180, 790), (1130, 860), (1150, 1024), (410, 1024), (420, 860),
           (330, 780), (200, 700), (110, 610), (60, 500), (60, 380), (90, 280))],
  props=[('wbBrRod0', 765, 108), ('wbBrRod0', 215, 338), ('wbBrRod0', 1325, 338, 1), ('wbBrRod0', 325, 658), ('wbBrRod0', 1205, 658, 1),
         ('wbBrSpire', 300, 140), ('wbBrSpire', 1440, 520, 1), ('wbBrTree', 120, 470), ('wbBrTree', 1260, 140, 1),
         ('wbBrCloud', 140, 1010), ('wbBrCloud', 1430, 1015, 1), ('wbBrCloud', 1500, 760, 1), ('wbBrCloud', 25, 760),
         ('wbCampTent', 525, 1010), ('wbCampStone', 735, 1005), ('wbCampStall', 1010, 1010)])
A['lumina'] = dict(shadow='#7a5a8a', id='wbLumina', name='สะพานทะเลเมฆ · ลูมินา วาฬประกายพรึก', mood='sun', theme='greek', bounce='rgba(240,170,170,.16)',
  boss=(770, 470), start=(790, 855),
  walk=[E(768, 398, 515, 278), Pg((235, 272), (250, 318), (150, 320), (150, 270)), E(88, 274, 80, 46),
        Pg((1300, 272), (1290, 320), (1390, 318), (1390, 270)), E(1450, 274, 80, 46),
        Pg((688, 640), (852, 640), (852, 820), (688, 820)), E(770, 872, 150, 70)],
  props=[('wbLuPillar', 88, 286), ('wbLuPillar', 1450, 286, 1), ('wbLuLantern', 640, 686), ('wbLuLantern', 900, 686, 1),
         ('wbLuArch', 770, 812),
         ('wbLuCloud', 330, 790), ('wbLuCloud', 1210, 800, 1), ('wbLuCloud', 470, 1010, 1), ('wbLuCloud', 1080, 1020),
         ('wbCampStone', 668, 918)])
A['stomach'] = dict(shadow='#6a5a9a', id='wbLuminaIn', name='ในท้องลูมินา', mood='dream', theme='greek', bounce='rgba(170,150,230,.16)',
  boss=None, start=(770, 920), out=('wbLumina', (770, 985)),
  walk=[E(770, 515, 690, 330), Pg((560, 830), (990, 830), (1000, 1024), (545, 1024))],
  block=[E(330, 245, 115, 62), E(1150, 235, 140, 62), E(250, 620, 140, 60), E(1320, 625, 130, 58)],
  props=[('wbLuShard', 770, 505)])
A['urtok'] = dict(shadow='#4a2a50', id='wbUrtok', name='แอ่งโทเท็มแตก · เออร์ทอค เต่าแบกโทเท็ม', mood='dusk', theme='capital', bounce='rgba(200,140,200,.16)',
  boss=(770, 470), start=(770, 915),
  walk=[Pg((170, 250), (330, 150), (420, 130), (1030, 130), (1140, 150), (1300, 230), (1390, 330), (1400, 470), (1340, 560),
           (1330, 690), (1180, 760), (1060, 840), (1080, 1024), (390, 1024), (420, 860), (330, 790), (190, 720), (140, 600),
           (150, 420))],
  block=[E(120, 330, 45, 26), E(85, 525, 45, 26), E(1340, 268, 40, 24), E(1415, 480, 50, 30), E(1335, 635, 32, 22),
         E(1210, 735, 42, 26), E(1405, 715, 45, 30)],
  props=[('wbUrBear', 300, 760), ('wbUrOwlWolf', 1180, 210, 1),
         ('wbCampTent', 515, 1010), ('wbCampStone', 735, 1005), ('wbCampStall', 1015, 1010)])
ORDER = ['khepra', 'puijantra', 'burumba', 'mayawee', 'brontara', 'lumina', 'stomach', 'urtok']


# ---------------------------------------------------------------- keyer (same as the boss pictures: flat green / magenta)
def key_sheet(path, glob):
    im = np.asarray(Image.open(path).convert('RGB')).astype(np.float32)
    h, w, _ = im.shape
    ring = np.concatenate([im[:8].reshape(-1, 3), im[-8:].reshape(-1, 3), im[:, :8].reshape(-1, 3), im[:, -8:].reshape(-1, 3)])
    B = np.median(ring, 0)
    green = B[1] > max(B[0], B[2])
    key = (lambda x: x[..., 1] - np.maximum(x[..., 0], x[..., 2])) if green else (lambda x: np.minimum(x[..., 0], x[..., 2]) - x[..., 1])
    d = key(im); dB = float(key(B[None, None, :])[0, 0]); LO, HI = 22.0, dB * .82
    soft = d > LO; lab, n = nd.label(soft)
    edge = np.zeros_like(soft); edge[0, :] = edge[-1, :] = edge[:, 0] = edge[:, -1] = True
    seeds = set(np.unique(lab[edge & soft]).tolist())
    pure = d > dB * .7; pl, pn = nd.label(pure)
    if pn:
        sz = nd.sum(pure, pl, range(1, pn + 1)); big = np.isin(pl, [i + 1 for i, s in enumerate(sz) if s >= 60])
        seeds |= set(np.unique(lab[big]).tolist())
    mid = d > dB * .45; cnt = nd.sum(mid, lab, range(1, n + 1)) if n else []
    seeds |= {i + 1 for i, c in enumerate(cnt) if c >= 3}; seeds.discard(0)
    R = np.isin(lab, sorted(seeds)); a = np.ones((h, w), np.float32)
    a[R] = np.clip(1 - (d[R] - LO) / (HI - LO), 0, 1)
    F = im.copy(); m = R & (a > .01) & (a < 1); aa = a[m][:, None]
    F[m] = np.clip((im[m] - (1 - aa) * B) / aa, 0, 255)
    if green:
        mx = np.maximum(F[..., 0], F[..., 2]); F[..., 1] = np.where(R | bool(glob), np.minimum(F[..., 1], mx + 8), F[..., 1])
    else:
        s = np.minimum(F[..., 0], F[..., 2]) - F[..., 1] - 8; s = np.where((R | bool(glob)) & (s > 0), s, 0); F[..., 0] -= s; F[..., 2] -= s
    al = a > .04; cl, cn = nd.label(al)
    if cn:
        cs = nd.sum(al, cl, range(1, cn + 1)); a = np.where(np.isin(cl, [i + 1 for i, s in enumerate(cs) if s >= 40]), a, 0)
    return np.dstack([F, a * 255]).clip(0, 255).astype(np.uint8)


def split(rgba, names, boxes):
    h, w = rgba.shape[:2]
    if boxes is None:
        boxes = [(c * w // 3, r * h // 2, (c + 1) * w // 3, (r + 1) * h // 2) for r in range(2) for c in range(3)]
    al = rgba[..., 3] > 15; lab, n = nd.label(al, structure=np.ones((3, 3)))
    own = {}
    for i, (cy, cx) in enumerate(nd.center_of_mass(al, lab, range(1, n + 1))):
        for bi, (x0, y0, x1, y1) in enumerate(boxes):
            if x0 <= cx < x1 and y0 <= cy < y1: own[i + 1] = bi; break
    out = {}
    for bi, nm in enumerate(names):
        m = np.isin(lab, [k for k, v in own.items() if v == bi]); ys, xs = np.nonzero(m)
        y0, y1, x0, x1 = max(0, ys.min() - 3), min(h, ys.max() + 4), max(0, xs.min() - 3), min(w, xs.max() + 4)
        c = rgba[y0:y1, x0:x1].copy(); c[..., 3] = np.where(m[y0:y1, x0:x1], c[..., 3], 0)
        out[nm] = Image.fromarray(c, 'RGBA')
    return out


# ---------------------------------------------------------------- game data
def r1(v): return round(v, 1)

def cat_entries(sizes):
    cat = {}
    for n, d in P.items():
        iw, ih = sizes[d['f']]; h = d['h']; w = h * iw / ih
        e = {'w': r1(w), 'h': r1(h), 'd': 'wboss', 'f': d['f'], 'ay': d['ay'], 't': 'prop', 'cap': 'unique', 'sw': d.get('sw', 0)}
        if 'c' in d: e['c'] = d['c']
        if 'cs' in d: e['cs'] = d['cs']
        if d.get('nc'): e['nc'] = 1
        cat[n] = e
    for k in A:
        cat[floor_name(k)] = {'t': 'tex', 'd': 'wboss', 'f': k + '_floor'}
    for k in A:
        if not A[k].get('boss'): continue
        iw, ih = Image.open(f'{ROOT}/assets/bosses/world/{k}_cut.webp').size
        w = BOSS_W; h = w * ih / iw; lift = FLY.get(k, 0)
        e = {'w': w, 'h': r1(h), 'd': '../assets/bosses/world', 'f': k + '_cut', 'ay': round(.94 + lift / h, 3), 't': 'prop', 'cap': 'unique', 'sw': 0}
        if lift: e['nc'] = 1
        else: e['c'] = [.33, .12]
        cat['wbBoss' + k.capitalize()] = e
    cat['wbFlyShadow'] = {'w': 320, 'h': 96, 'd': 'wboss', 'f': 'fly_shadow', 'ay': .5, 't': 'flat', 'cap': 'unique'}
    return cat

def floor_name(k): return 'wb' + k.capitalize() + 'Floor'

def scale_shape(s):
    if 'e' in s: return {'e': [r1(v * S) for v in s['e']]}
    return {'p': [r1(v * S) for v in s['p']]}

def config(k, seed):
    a = A[k]; c = {'name': a['name'], 'lv': 'บอสโลก', 'seed': seed, 'W': int(W * S), 'H': int(H * S), 'mood': a['mood'], 'theme': a['theme'],
                   'ground': floor_name(k), 'groundImg': {'n': floor_name(k), 'r': [0, 0, int(W * S), int(H * S)]},
                   'mons': False, 'clean': 1, 'noDetails': 1, 'colorMatch': 0, 'lit': 1, 'bounce': a['bounce'], 'noCritters': 1, 'shadowCol': a['shadow'], 'mirror': 1,
                   'camZoom': .8, 'camZoomMob': .7, 'wb': k}
    c['walk'] = [scale_shape(s) for s in a['walk']]
    if a.get('block'): c['block'] = [scale_shape(s) for s in a['block']]
    if a.get('lines'): c['blockLines'] = [{'w': r1(L['w'] * S), 'p': [r1(v * S) for xy in L['p'] for v in xy]} for L in a['lines']]
    land = []
    for p in a['props']:
        e = {'n': p[0], 'x': r1(p[1] * S), 'y': r1(p[2] * S)}
        if len(p) > 3 and p[3]: e['flip'] = 1
        land.append(e)
    if a.get('boss'):
        bx, by = a['boss']; land.append({'n': 'wbBoss' + k.capitalize(), 'x': r1(bx * S), 'y': r1(by * S), 'preview': 1})
        if k in FLY: land.append({'n': 'wbFlyShadow', 'x': r1(bx * S), 'y': r1(by * S), 'preview': 1})
    c['land'] = land
    c['start'] = [r1(a['start'][0] * S), r1(a['start'][1] * S)]
    # the way home: on the camp stone's respawn circle (the stomach room leads back out to Lumina's bridge)
    stone = next((p for p in a['props'] if p[0] == 'wbCampStone'), None)
    if a.get('out'):
        to, (wx, wy) = a['out']; c['warps'] = [{'id': 'out', 'x': r1(wx * S), 'y': r1(wy * S), 'to': to, 'at': 'home', 'label': 'ออกจากท้องวาฬ'}]
    elif stone:
        iw, ih = Image.open(f'{ROOT}/maps/wboss/{P["wbCampStone"]["f"]}.webp').size
        sw_ = P['wbCampStone']['h'] * iw / ih
        c['warps'] = [{'id': 'home', 'x': r1(stone[1] * S + CAMP_CIRCLE[0] * sw_), 'y': r1(stone[2] * S + CAMP_CIRCLE[1] * sw_ + 6), 'to': 'capT', 'at': 'toS', 'label': 'กลับเมืองหลวง'}]
    return c


def fly_shadow():
    w, h = 320, 96; yy, xx = np.mgrid[0:h, 0:w]
    r = np.sqrt(((xx - w / 2 + .5) / (w / 2)) ** 2 + ((yy - h / 2 + .5) / (h / 2)) ** 2)
    a = np.clip(1 - r, 0, 1) ** .9 * 175
    im = np.zeros((h, w, 4), np.uint8); im[..., 0] = 26; im[..., 1] = 20; im[..., 2] = 34; im[..., 3] = a.astype(np.uint8)
    Image.fromarray(im, 'RGBA').save(f'{ROOT}/maps/wboss/fly_shadow.webp', quality=90)


def build():
    os.makedirs(f'{ROOT}/maps/wboss', exist_ok=True)
    sizes = {}
    for k, (names, boxes, glob) in SHEETS.items():
        rgba = key_sheet(f'{ROOT}/assets/bosses/world/arena/{k}_props.png', glob)
        for nm, im in split(rgba, names, boxes).items():
            im.save(f'{ROOT}/maps/wboss/{nm}.webp', quality=90, method=6); sizes[nm] = im.size
    fly_shadow()
    cat = cat_entries(sizes)
    maps = {A[k]['id']: config(k, 9100 + i) for i, k in enumerate(ORDER)}
    js = ('/* =====================================================================\n'
          '   WORLD-BOSS ARENAS (owner 2026-11-22) — one themed arena per world boss + the room inside Lumina.\n'
          '   GENERATED by tools/wboss_arenas.py from the owner\'s floor + props pictures: edit the layout there and re-run,\n'
          '   do not edit this file by hand. Layout rules: WORLD_BOSS_ARENA_TH.md.\n'
          '   land entries with preview:1 = the boss picture standing in the middle until the real fight exists (drop them then).\n'
          '   ===================================================================== */\n'
          '(function(){\n'
          'Object.assign(window.VK_CAT,' + json.dumps(cat, ensure_ascii=False, separators=(',', ':')) + ');\n'
          'const WB=' + json.dumps(maps, ensure_ascii=False, separators=(',', ':')) + ';\n'
          'window.VK_MAPS=Object.assign(window.VK_MAPS||{},WB);\n'
          'window.WB_ARENAS=' + json.dumps([A[k]['id'] for k in ORDER]) + ';\n'
          '})();\n')
    open(f'{ROOT}/maps/wboss-arenas.js', 'w').write(js)
    print('pieces', len(sizes), '· maps', len(maps), '· js', len(js), 'bytes')


# ---------------------------------------------------------------- preview (layout check without the game)
def preview(outdir='/tmp/wboss_pv'):
    os.makedirs(outdir, exist_ok=True)
    yy, xx = np.mgrid[0:H, 0:W] + .5
    def shape(s):
        if 'e' in s: cx, cy, rx, ry = s['e']; return ((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2 <= 1
        m = Image.new('L', (W, H), 0); ImageDraw.Draw(m).polygon(list(zip(s['p'][::2], s['p'][1::2])), fill=255); return np.asarray(m) > 0
    for k in ORDER:
        a = A[k]; fl = Image.open(f'{ROOT}/maps/wboss/{k}_floor.webp').convert('RGBA')
        walk = np.zeros((H, W), bool)
        for s in a['walk']: walk |= shape(s)
        for s in a.get('block', []): walk &= ~shape(s)
        m = Image.new('L', (W, H), 0); d = ImageDraw.Draw(m)
        for L in a.get('lines', []):
            r = L['w'] / 2; d.line(L['p'], fill=255, width=int(L['w']))
            for x, y in L['p']: d.ellipse([x - r, y - r, x + r, y + r], fill=255)
        walk &= ~(np.asarray(m) > 0)
        red = np.zeros((H, W, 4), np.uint8); red[..., 0] = 255; red[..., 3] = np.where(walk, 0, 80)
        fl.alpha_composite(Image.fromarray(red, 'RGBA'))
        items = sorted(a['props'] + ([('BOSS',) + tuple(a['boss'])] if a.get('boss') else []), key=lambda p: p[2])
        for p in items:
            if p[0] == 'BOSS':
                im = Image.open(f'{ROOT}/assets/bosses/world/{k}_cut.webp').convert('RGBA'); w = BOSS_W / S; h = w * im.height / im.width; lf = FLY.get(k, 0) / S
                fl.alpha_composite(im.resize((int(w), int(h)), Image.LANCZOS), (int(p[1] - w / 2), int(p[2] - lf - h * .94))); continue
            d0 = P[p[0]]; im = Image.open(f'{ROOT}/maps/wboss/{d0["f"]}.webp').convert('RGBA')
            h = d0['h'] / S; w = h * im.width / im.height; im = im.resize((max(1, int(w)), max(1, int(h))), Image.LANCZOS)
            if len(p) > 3 and p[3]: im = im.transpose(Image.FLIP_LEFT_RIGHT)
            fl.alpha_composite(im, (int(p[1] - w / 2), int(p[2] - d0['ay'] * h)))
        fl.convert('RGB').save(f'{outdir}/{k}.jpg', quality=86)
    print('preview →', outdir)


if __name__ == '__main__':
    build()
    if 'preview' in sys.argv[1:]: preview()
