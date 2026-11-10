# Mobile v2 download card

A card with a QR code for signed-in people who have not linked the mobile version (the Android app or its PWA) to their account.

**Status:** approved by the owner on 2026-11-10 and built (`src/features/mobile-promo`).

## Board

| File | Shows |
|---|---|
| `board.html` | M1 the card in place over a wallpaper, above the bottom bar; M2 the card with its measurements; M3 the card in the dark theme |

## Notes

- **Where:** bottom of the new tab page, above the bottom bar, on the start side (right in RTL). The push ask island sits at the top, so the two never meet.
- **Who sees it:** signed in, and `mobileV2.linked` is false on the profile. The app and the PWA count the same, so either one hides it for good. People with the old app, or none, still see it.
- **Modals:** while any modal is open the card is hidden, and it comes back when the modal closes.
- **When it returns:** it comes back 2 days after the person closes it. The close time is stored; nothing is stored when it is only shown.
- **Picture:** three real screens of the v2 app (habits, today, friends) in phone frames, fanned and cut off by the bottom of the picture, 328 by 200. Everything on the screens is fake and cute data. It is made with PhotoCraft (`assets/phones.webp`, 2x, transparent, so the brand tint behind it follows the theme; the scripts and the fake data are in `art/`). The picture is content, so it keeps its own colours in every theme.
- **Link:** under the text, a small brand coloured link with the external link icon, «بدون اسکن، بازش کن», opens `https://widgetify.ir/apps` in a new tab for people who cannot scan (on the same computer, for example).
- **Close:** a round 32px button on the picture, top end. There is no button: the card's job is to be scanned, and the link is the other way in.
- **QR:** drawn locally from `https://widgetify.ir/apps` with high error correction, 33 modules, 124px. It always sits on a white tile with a 4 module quiet zone, in every theme, or phones will not read it.
- **Surface:** `bg-glass-modal`, `rounded-widget`, `shadow-xl`, over the wallpaper. Check it in glass and icy over a busy wallpaper.
- **Width:** 352px (`w-88`). Fits down to the 500px minimum.
- The copy is a draft until approved. Title: «ویجتیفای تو گوشیت هم باشه». Line: «کد رو با دوربین گوشیت اسکن کن و نسخه موبایل رو نصب کن، هرچی اینجا داری اونجا هم هست».

## Open questions

- `https://widgetify.ir/apps` has to exist before the card ships.
- Position: bottom start as drawn, or somewhere else (for example the top, like the push island, if the two never show together).

## How the picture is made

`assets/phones.webp` (656 by 400, 2x of a 328 by 200 picture, transparent) shows three screens of the v2 app in phone frames. Every name, task, habit and status on them is fake data from `art/mock-demo.html`.

1. Start the v2 app on its own port with the fake session and fake server replies. In `widgetify-mobile-v2`: `node scripts/mock-dev.mjs <path to>/mock-demo.html 5199`. The mock is injected by the script, so the shared `index.html` stays clean.
2. Capture each screen with Chrome at 500 by 935 and a device scale of 2 (`--headless=new --hide-scrollbars --force-device-scale-factor=2 --window-size=500,935 --virtual-time-budget=9000 --screenshot=raw-<name>.png "http://localhost:5199/#/today"`; the other two are `#/yadkar?tab=habits` and `#/friends`), then crop the centred 864 px column to `shots/screen-<name>.png`.
3. Set `PROMO_WORK` to the working folder (it holds `shots/` and `out/`), then run `python make_phones.py today habits friends` (a phone frame per screen, with PhotoCraft) and `python make_hero.py` (the three phones fanned, with sparkles). `convert` the PNG to WebP at quality 86.
