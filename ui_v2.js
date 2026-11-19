/* =========================================================
   Aetherfall — UI v2 (code-drawn, one design system, Golden Forge colours)
   Frames, title bars, buttons, tabs, slots, rows and bars are CSS — not stretched pictures —
   so they stay sharp at every size and every window looks the same.
   Pictures are kept only for icons and a few decorations (portrait ring, level-up banner, AUTO button).
   Window bodies and cards are semi-transparent; title bars, buttons and highlights are solid.
   Fonts (bundled, OFL): Mitr = titles / labels / buttons · Prompt = numbers and body text.
   Change the tokens in :root and every window follows.
   ========================================================= */
(function(){
'use strict';
const F='assets/fonts/';
const W='html body.th-gold';                     // beats ui_skin.js (body.th-gold …)
const WIN=`${W} .ro,${W} #skw,${W} #panel,${W} #kfdlg,${W} #hldlg,${W} .ttw`;
const css=`
@font-face{font-family:'Mitr';src:url(${F}Mitr-Medium.ttf) format('truetype');font-weight:500;font-display:swap}
@font-face{font-family:'Mitr';src:url(${F}Mitr-SemiBold.ttf) format('truetype');font-weight:600;font-display:swap}
@font-face{font-family:'Prompt';src:url(${F}Prompt-Regular.ttf) format('truetype');font-weight:400;font-display:swap}
@font-face{font-family:'Prompt';src:url(${F}Prompt-Medium.ttf) format('truetype');font-weight:500;font-display:swap}

:root{
  /* Golden Forge palette (sampled from the generated theme art) */
  --v2-ink:#4a2a16; --v2-ink2:#8a5a36; --v2-line:rgba(201,137,83,.55); --v2-line2:#c98953;
  --v2-paper:linear-gradient(rgba(255,226,186,.94),rgba(238,190,140,.94)); --v2-card:rgba(255,250,238,.62); --v2-card2:rgba(255,250,238,.85); --v2-sunk:rgba(160,90,40,.12);
  --v2-red:#c8463c; --v2-red2:#9e3a2f; --v2-gold:#fae386; --v2-gold2:#f2bf4e; --v2-gold3:#c48a2e;
  --v2-green:#2e8a3a; --v2-brown:#9a4a3a; --v2-dark:rgba(44,22,12,.82);
  --v2-r:14px; --v2-r2:10px; --v2-pad:12px; --v2-gap:6px;
  --v2-title:600 15px/1 'Mitr',sans-serif; --v2-label:500 13px/1.2 'Mitr',sans-serif; --v2-num:500 14px/1.2 'Prompt',sans-serif; --v2-body:400 12px/1.5 'Prompt',sans-serif;
  --v2-shadow:0 10px 30px rgba(60,26,8,.4),0 0 0 3px rgba(255,214,140,.55) inset;
}

/* ================= WINDOWS ================= */
${WIN}{border:2px solid #8a4e24!important;border-image:none!important;border-radius:var(--v2-r)!important;background:var(--v2-paper)!important;
  backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);box-shadow:var(--v2-shadow)!important;filter:none!important;color:var(--v2-ink)!important;font:var(--v2-body)!important}
${W} .ro{padding:0!important;overflow:hidden}
${W} #skw,${W} #panel,${W} #kfdlg,${W} #hldlg{padding:var(--v2-pad)!important}
${W} .ro input,${W} .ro select,${W} #panel input,${W} #panel select,${W} #skw input,${W} #skw select{font:var(--v2-body)!important;color:var(--v2-ink)!important;background:var(--v2-card2)!important;border:1px solid var(--v2-line2)!important;border-radius:8px!important}

/* title bars */
${W} .ro .tb{position:relative!important;display:flex!important;align-items:center;justify-content:center;width:auto!important;max-width:none!important;min-width:0!important;
  height:40px!important;line-height:40px!important;margin:0!important;padding:0 44px!important;border:0!important;border-radius:0!important;
  background:linear-gradient(var(--v2-red),var(--v2-red2))!important;box-shadow:0 -2px 0 rgba(0,0,0,.15) inset,0 1px 0 rgba(255,220,160,.45) inset!important;border-bottom:2px solid var(--v2-gold2)!important;
  color:#fff3d6!important;font:var(--v2-title)!important;letter-spacing:.3px;text-shadow:0 1px 0 #5a1a10,0 0 3px rgba(90,26,16,.6)!important;filter:none!important}
${W} #panel h3,${W} #kfdlg .hd,${W} #hldlg .hd{margin:0 0 var(--v2-gap)!important;padding:8px 14px!important;border:0!important;border-radius:var(--v2-r2)!important;
  background:linear-gradient(var(--v2-red),var(--v2-red2))!important;box-shadow:0 -2px 0 rgba(0,0,0,.15) inset,0 0 0 1px var(--v2-gold3)!important;
  color:#fff3d6!important;font:var(--v2-title)!important;text-shadow:0 1px 0 #5a1a10!important}
${W} #kfdlg .hd small,${W} #panel h3 #spu{color:#ffe0b8!important;font:var(--v2-body)!important}
${W} #kfdlg .hd img{border:2px solid var(--v2-gold)!important;box-shadow:0 0 0 1px var(--v2-red2)!important}

/* close buttons */
${W} .ro .tb .x,${W} #skw .x,${W} .ttw .ttx{position:absolute!important;right:8px!important;top:8px!important;width:24px!important;height:24px!important;border-radius:50%!important;
  background:linear-gradient(#b4604a,var(--v2-brown))!important;border:2px solid var(--v2-gold)!important;box-shadow:0 1px 2px rgba(0,0,0,.3)!important;
  color:#fff!important;font:600 12px/18px 'Mitr',sans-serif!important;padding:0!important;text-align:center;filter:none!important}
${W} .ro .bd{padding:var(--v2-pad)!important;background:none!important;border:0!important}
${W} .ro .ft{display:flex;flex-wrap:wrap;align-items:center;gap:6px;padding:8px var(--v2-pad) 10px!important;border:0!important;border-top:1px solid var(--v2-line)!important;border-radius:0!important;
  background:var(--v2-sunk)!important;font:var(--v2-label)!important;color:var(--v2-ink)!important}
${W} .ro .ft:before{display:none!important}

/* ================= BUTTONS / TABS ================= */
${W} .rob,${W} .ttb{height:28px!important;line-height:26px!important;padding:0 14px!important;border:1px solid var(--v2-gold3)!important;border-image:none!important;border-radius:999px!important;
  background:linear-gradient(var(--v2-gold),var(--v2-gold2))!important;box-shadow:0 2px 0 var(--v2-gold3),0 1px 0 rgba(255,255,255,.6) inset!important;
  color:#5a3206!important;font:500 12.5px/26px 'Mitr',sans-serif!important;text-shadow:none!important;filter:none!important;cursor:pointer}
${W} .rob:active,${W} .ttb:active:not(:disabled){transform:translateY(1px)}
${W} .rob:disabled,${W} .ttb:disabled{background:var(--v2-sunk)!important;border-color:var(--v2-line2)!important;box-shadow:none!important;color:var(--v2-ink2)!important;opacity:.7}
${W} .ro-tabs,${W} .ix-tabs{gap:4px!important;margin-bottom:var(--v2-gap)!important}
${W} .ro-tabs button,${W} .ix-tabs button,${W} #hotbar .tabs button,${W} #skw .tt-ch button,${W} #skw .tt-tab,${W} #panel .seg button{height:28px!important;min-width:60px;padding:0 12px!important;border:1px solid var(--v2-line2)!important;border-radius:999px!important;
  background:var(--v2-card)!important;box-shadow:none!important;color:var(--v2-ink2)!important;font:500 12px/26px 'Mitr',sans-serif!important;text-shadow:none!important}
${W} .ro-tabs button.on,${W} .ix-tabs button.on,${W} #hotbar .tabs button.on,${W} #skw .tt-ch button.on,${W} #skw .tt-tab.on,${W} #panel .seg button.on{background:linear-gradient(var(--v2-red),var(--v2-red2))!important;border-color:var(--v2-gold3)!important;color:#fff3d6!important}

/* ================= ITEMS / EQUIP ================= */
${W} .ro-grid{gap:5px!important;background:none!important;border:0!important}
${W} .ro-grid .c{background:var(--v2-card)!important;border:1px solid var(--v2-line)!important;border-radius:9px!important;box-shadow:inset 0 2px 3px rgba(120,60,20,.12)!important;padding:4px!important;filter:none!important;opacity:1!important}
${W} .ro-grid .c:not([data-id]){background:rgba(255,250,238,.3)!important;border-style:dashed!important}
${W} .ro-grid .c[data-id]:hover{border-color:var(--v2-gold3)!important;box-shadow:0 0 0 2px var(--v2-gold2)!important}
${W} .ro-grid .c em{color:#fff!important;font:500 10px 'Prompt',sans-serif!important;text-shadow:0 0 2px #000,0 0 2px #000}
${W} .ro-eq .sl{background:var(--v2-card)!important;border:1px solid var(--v2-line)!important;border-radius:var(--v2-r2)!important;box-shadow:none!important}
${W} .ro-eq .sl:hover{border-color:var(--v2-gold3)!important;background:var(--v2-card2)!important}
${W} .ro-eq .sl:not(.empty) .ic{background:var(--v2-card2)!important;border:1px solid var(--v2-line)!important;border-radius:8px!important}
${W} .ro-eq .sl.empty .ic{background-color:transparent!important;opacity:.75}
${W} .ro-x,${W} .ix-box,${W} #skw .tt-top{background:var(--v2-card)!important;border:1px solid var(--v2-line)!important;border-radius:var(--v2-r2)!important;color:var(--v2-ink)!important}
${W} .ro-x b,${W} .ro .bd b{font-family:'Mitr',sans-serif;font-weight:500}

/* ================= STATUS ================= */
${W} #stw .ro-st{gap:0 var(--v2-pad)!important;align-items:start}
${W} #stw .ro-st .r{height:36px!important;padding:0 8px 0 6px!important;background:var(--v2-card)!important;border:1px solid var(--v2-line)!important;border-radius:var(--v2-r2)!important;box-shadow:0 1px 0 rgba(120,80,30,.08)!important;gap:6px}
${W} #stw .ro-st .r b{width:62px!important;font:var(--v2-label)!important;color:var(--v2-ink)!important}
${W} #stw .ro-st .r b:before{width:22px!important;height:22px!important}
${W} #stw .ro-st .r .v{font:var(--v2-num)!important;color:var(--v2-ink)!important;font-size:15px!important}
${W} #stw .ro-st .r .v span{font:500 13px 'Prompt',sans-serif!important;color:var(--v2-green)!important;margin-left:4px}
${W} #stw .ro-st .r .c{display:none!important}
${W} #stw .ro-st .r .up,${W} #stw .ro-st .r .dn{width:24px!important;height:24px!important;border-radius:50%!important;padding:0!important;position:relative;cursor:pointer;background-image:none!important;color:transparent!important;font-size:0!important}
${W} #stw .ro-st .r .up{background:linear-gradient(var(--v2-gold),var(--v2-gold2))!important;border:1px solid var(--v2-gold3)!important;box-shadow:0 2px 0 var(--v2-gold3)!important}
${W} #stw .ro-st .r .dn{background:var(--v2-card2)!important;border:1px solid var(--v2-line2)!important;box-shadow:0 2px 0 var(--v2-line2)!important;margin-right:0!important}
${W} #stw .ro-st .r .up:after,${W} #stw .ro-st .r .dn:after{content:''!important;display:block!important;position:absolute;left:50%;top:50%;width:10px;height:2.4px;margin:-1.2px 0 0 -5px;border:0!important;border-radius:2px;background:#6a3c0a}
${W} #stw .ro-st .r .up:before{content:'';position:absolute;left:50%;top:50%;width:2.4px;height:10px;margin:-5px 0 0 -1.2px;border-radius:2px;background:#6a3c0a}
${W} #stw .ro-st .r .dn:after{background:var(--v2-ink2)}
${W} #stw .ro-st .r .up:disabled,${W} #stw .ro-st .r .dn:disabled{opacity:.35;box-shadow:none!important;cursor:default}
${W} #stw .ro-st svg{background:var(--v2-card);border:1px solid var(--v2-line);border-radius:var(--v2-r2);padding:4px;box-sizing:content-box}
${W} #stw .ro-st svg text{font-family:'Mitr',sans-serif!important;font-weight:500!important;fill:var(--v2-ink2)!important}
${W} .ro-st .k{display:flex!important;align-items:center;justify-content:space-between;min-height:34px;padding:0 10px!important;background:var(--v2-card)!important;border:1px solid var(--v2-line)!important;border-radius:var(--v2-r2)!important}
${W} .ro-st .k span{font:var(--v2-label)!important;color:var(--v2-ink2)!important}
${W} .ro-st .k i{font:var(--v2-num)!important;font-style:normal!important;color:var(--v2-ink)!important}
${W} .ro-st .k.sp{background:linear-gradient(rgba(255,240,190,.85),rgba(250,214,110,.85))!important;border-color:var(--v2-gold2)!important}
${W} .ro-st .k.sp i{color:#a25a00!important;font-size:16px!important}

/* ================= SKILL WINDOW ================= */
${W} #skw .tt-col{background:var(--v2-card)!important;border:1px solid var(--v2-line)!important;border-radius:12px!important}
${W} #skw .tt-pn{border:1px solid var(--v2-line)!important;border-radius:12px!important;background:var(--v2-card)!important}
${W} #skw .tc{border-radius:10px!important;box-shadow:0 0 0 2px var(--v2-gold2),0 0 0 3px #5a2a10!important}
${W} #skw .tc.ult{box-shadow:0 0 0 2px var(--v2-gold),0 0 0 3px #5a2a10,0 0 10px 2px rgba(255,210,87,.8)!important}
${W} #skw,${W} #skw *{font-family:'Prompt',sans-serif}
${W} #skw b,${W} #skw h3,${W} #skw .th,${W} #skw button{font-family:'Mitr',sans-serif!important;font-weight:500}

/* ================= SETTINGS / NPC ================= */
${W} #panel *{border-color:var(--v2-line2)}
${W} #panel,${W} #panel label,${W} #panel #lvls>div{color:var(--v2-ink)!important}
${W} #panel small,${W} #panel .sub{color:var(--v2-ink2)!important}
${W} #kfdlg .tx,${W} #hldlg .tx{color:var(--v2-ink)!important;font:var(--v2-body)!important;font-size:13px!important}
${W} #kfdlg .bt button,${W} #hldlg .bt button{min-height:36px;padding:6px 16px!important;margin:3px 0!important;border:1px solid var(--v2-line2)!important;border-radius:var(--v2-r2)!important;
  background:var(--v2-card2)!important;box-shadow:0 2px 0 var(--v2-line2)!important;color:var(--v2-ink)!important;font:var(--v2-label)!important;text-align:left}
${W} #kfdlg .bt button:hover:not(:disabled),${W} #hldlg .bt button:hover:not(:disabled){background:linear-gradient(var(--v2-gold),var(--v2-gold2))!important;border-color:var(--v2-gold3)!important}

${W} #panel button:not(.seg button):not(.rob){min-width:22px;height:22px;padding:0 6px!important;border:1px solid var(--v2-gold3)!important;border-radius:7px!important;
  background:linear-gradient(var(--v2-gold),var(--v2-gold2))!important;color:#5a3206!important;font:600 12px/20px 'Mitr',sans-serif!important;box-shadow:0 1px 0 var(--v2-gold3)!important}
${W} #panel button:disabled{background:var(--v2-sunk)!important;border-color:var(--v2-line2)!important;color:var(--v2-ink2)!important;box-shadow:none!important}
${W} #panel,${W} #panel *{font-family:'Prompt',sans-serif}
${W} #panel b,${W} #panel h3,${W} #panel h3 *{font-family:'Mitr',sans-serif!important}

/* ================= HUD ================= */
${W} #top .info{border:2px solid #8a4e24!important;border-image:none!important;border-radius:var(--v2-r)!important;background:var(--v2-paper)!important;box-shadow:0 4px 12px rgba(60,26,8,.35)!important;filter:none!important;padding:6px 10px!important}
${W} #top .nm b{color:var(--v2-ink)!important;font:var(--v2-label)!important}
${W} #top .nm .cls{background:linear-gradient(var(--v2-gold),var(--v2-gold2))!important;border:1px solid var(--v2-gold3)!important;border-radius:999px!important;color:#5a3206!important;font:500 11px 'Mitr',sans-serif!important}
${W} #top .lvb{background:linear-gradient(var(--v2-gold),var(--v2-gold2))!important;border:2px solid #6a3a14!important;color:#4a1a00!important;font:600 11px 'Mitr',sans-serif!important;box-shadow:0 2px 0 #6a3a14!important}
${W} #top .gb em{background:linear-gradient(var(--v2-red),var(--v2-red2))!important;border:1px solid var(--v2-gold3)!important;border-radius:6px!important;color:#fff3d6!important;font:500 10px 'Mitr',sans-serif!important;text-shadow:none!important}
${W} #top .gb .tr{background:rgba(40,18,10,.75)!important;border:1px solid var(--v2-gold3)!important;box-shadow:inset 0 2px 3px rgba(0,0,0,.45)!important;border-radius:999px!important;overflow:hidden}
${W} #hpb{background:linear-gradient(#ff7a6a,#d8322e 55%,#a81e1e)!important;border-radius:999px!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.45)!important}
${W} #mpb{background:linear-gradient(#7ac8ff,#2f86e0 55%,#1d5fb0)!important;border-radius:999px!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.45)!important}
${W} #expb{background:linear-gradient(#fff0a0,var(--v2-gold2) 55%,var(--v2-gold3))!important;border-radius:999px!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.5)!important}
${W} #top .gb .tr b{color:#fff!important;font:500 10.5px 'Prompt',sans-serif!important;text-shadow:0 1px 0 #000,0 0 2px #000!important}
${W} #mm .mmf{border:2px solid #8a4e24!important;border-image:none!important;border-radius:var(--v2-r)!important;background:var(--v2-paper)!important;box-shadow:0 4px 12px rgba(60,26,8,.35)!important;padding:4px!important}
${W} #mm canvas{border-radius:10px!important}
${W} #mm .rib{background:linear-gradient(var(--v2-red),var(--v2-red2))!important;border:1px solid var(--v2-gold3)!important;border-radius:999px!important;padding:4px 14px!important;
  color:#fff3d6!important;font:500 11px 'Mitr',sans-serif!important;text-shadow:0 1px 0 #5a1a10!important;box-shadow:0 2px 6px rgba(0,0,0,.3)!important}
${W} #mm .crd{font:500 10px 'Prompt',sans-serif!important}
${W} .hbt{background:var(--v2-dark)!important;border:1px solid var(--v2-gold3)!important;border-radius:10px!important;box-shadow:inset 0 0 0 1px rgba(255,214,140,.25),0 2px 4px rgba(0,0,0,.3)!important}
${W} .hbt:after{display:none!important}
${W} .hbt .k{background:linear-gradient(var(--v2-red),var(--v2-red2))!important;border:1px solid var(--v2-gold)!important;border-radius:5px!important;color:#fff3d6!important;font:500 9px 'Mitr',sans-serif!important}
${W} #hotbar .tabs button{height:22px!important;min-width:44px;font-size:11px!important;line-height:20px!important}


/* ================= 12 Tails style windows (smith · refine · storage · shop) ================= */
${W} .ttw{padding:0 var(--v2-pad) var(--v2-pad)!important;font:var(--v2-body)!important}
${W} .ttw .tth{margin:0 calc(-1*var(--v2-pad)) var(--v2-pad)!important;height:40px!important;line-height:40px!important;border-radius:0!important;border:0!important;border-bottom:2px solid var(--v2-gold2)!important;
  background:linear-gradient(var(--v2-red),var(--v2-red2))!important;box-shadow:0 -2px 0 rgba(0,0,0,.15) inset!important;color:#fff3d6!important;font:var(--v2-title)!important;text-shadow:0 1px 0 #5a1a10!important}
${W} .ttw .ttx{width:24px!important;height:24px!important;top:8px!important;background-image:none!important;font-size:12px!important;line-height:18px!important}
${W} .ttp{background:var(--v2-card)!important;border:1px solid var(--v2-line)!important;border-radius:var(--v2-r2)!important;box-shadow:none!important}
${W} .ttp h4{font:var(--v2-label)!important;color:var(--v2-ink)!important}
${W} .tts{background:var(--v2-card2)!important;border:1px solid var(--v2-line2)!important;border-radius:10px!important;box-shadow:inset 0 2px 3px rgba(120,60,20,.12)!important;filter:none!important}
${W} .tts:hover{border-color:var(--v2-gold3)!important}
${W} .tts.sel{border-color:var(--v2-gold3)!important;box-shadow:0 0 0 2px var(--v2-gold2)!important}
${W} .tts em,${W} .tts i{font-family:'Prompt',sans-serif!important}
${W} .ttb.blue{background:linear-gradient(var(--v2-red),var(--v2-red2))!important;border-color:#6a2016!important;box-shadow:0 2px 0 #6a2016!important;color:#fff3d6!important}
${W} .ttb.sm{height:24px!important;line-height:22px!important;padding:0 10px!important;font-size:11.5px!important}
${W} .tttab{gap:4px!important}
${W} .tttab button{border:1px solid var(--v2-line2)!important;border-radius:var(--v2-r2)!important;background:var(--v2-card)!important;color:var(--v2-ink2)!important;font:500 12.5px 'Mitr',sans-serif!important;box-shadow:none!important}
${W} .tttab button.on{background:linear-gradient(var(--v2-red),var(--v2-red2))!important;border-color:var(--v2-gold3)!important;color:#fff3d6!important}
${W} .ttin{font:var(--v2-body)!important;color:var(--v2-ink)!important;border:1px solid var(--v2-line2)!important;background:var(--v2-card2)!important}
${W} .ttnote{font:var(--v2-body)!important;color:var(--v2-ink2)!important}
${W} #smw .topbar .ttnote{color:var(--v2-ink2)!important}${W} #smw .topbar .ttnote b{color:var(--v2-red2)!important}
${W} #smw .tchip{background:linear-gradient(var(--v2-red),var(--v2-red2))!important;border:1px solid var(--v2-gold3)!important;font:500 12px 'Mitr',sans-serif!important}
${W} #smw .zchip{font:500 12px 'Prompt',sans-serif!important}
${W} #smw .chip{font:500 11px 'Prompt',sans-serif!important;background:var(--v2-card2)!important;border:1px solid var(--v2-line2)!important;color:var(--v2-ink)!important}
${W} #smw .chip.g{border-color:var(--v2-gold3)!important;color:#8a5a14!important;background:rgba(255,240,190,.85)!important}
${W} #smw .grades button{font:500 11.5px 'Mitr',sans-serif!important;color:var(--v2-ink2)!important;background:var(--v2-card)!important;border:1px solid var(--v2-line2)!important}
${W} #smw .grades button.on{background:linear-gradient(var(--v2-gold),var(--v2-gold2))!important;border-color:var(--v2-gold3)!important;color:#5a3206!important}
${W} #smw .slots .s,${W} #smw .mats .lab,${W} #smw .bonus{font-family:'Prompt',sans-serif!important;color:var(--v2-ink2)!important}
${W} #smw .tlist div{font-family:'Prompt',sans-serif!important}
${W} #skw button:not(.x):not(.tc):not([class*=tt-]){font:500 12px 'Mitr',sans-serif!important}

/* ================= popups ================= */
${W} #deathov .ro .tb{filter:hue-rotate(250deg) saturate(.8)!important}
${W}.mob > .ro .tb .x{right:6px!important;top:8px!important}
`;
const st=document.createElement('style');st.id='ui-v2';st.textContent=css;document.head.appendChild(st);
})();
