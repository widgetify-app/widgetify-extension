# Onboarding

The pictures for the first run, from the welcome modal to the end of the tour (`src/pages/home/`).

**Status:** approved and built. Every step now has its own drawn picture instead of the old screenshot, CDN image and CDN video.

## Boards

| File | Shows |
|---|---|
| `boards/Welcome.dc.html` | The welcome modal in Chrome: the title, the "Keep It" picture, the line about it and «شروع کنیم» |
| `boards/FirefoxPrivacy.dc.html` | The Firefox privacy step: a shield picture on top of the two consent rows |
| `boards/Tour1Footer.dc.html` | Tour step 1: a new tab page with its footer, right-clicked, and a two-item menu with the first item selected |
| `boards/Tour2Widget.dc.html` | Tour step 2: a widget with a click effect and its menu |
| `boards/Tour3Layout.dc.html` | Tour step 3: the layout button and its menu |
| `boards/Tour4Profile.dc.html` | Tour step 4: the profile button and its menu |

Each picture is 2:1 and sits at the top of its modal or tooltip, at full width. The copy is the catalog copy, except that the "Keep It" line lost its emoji.

## Art

`assets/*.webp` come from `art/onboarding.py`, a PhotoCraft script that uses the helpers in `../pro-tab/art/common.py`. See `../pro-tab/README.md` for how to run it. The same files are in `src/assets/images/onboarding/`.
