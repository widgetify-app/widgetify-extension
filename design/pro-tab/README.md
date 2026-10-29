# Pro tab

The redesign of the settings tab «ویجتیفای پرو» (`src/features/setting/vip/vip.tsx`).

**Status:** approved and built. The owner picked direction A + D (a showcase hero with benefit cards) and asked for it to be implemented. The code is in `src/features/setting/vip/`.

## Boards

| File | Shows |
|---|---|
| `boards/ProBlend.dc.html` | The tab at rest: hero, four benefit cards, four plans, the payment bar |
| `boards/ProBlendDetail.dc.html` | The tab with the details window open on the widgets page |
| `boards/ProPrototype.dc.html` | The working prototype: cards open the window on their page, arrows and dots move between pages, plans can be selected |

## The tab

1. **Hero.** `assets/hero-pro.webp` with the Pro icon, the Pro badge, a headline and one line of text. No dark overlay.
2. **Benefit cards.** Four cards that overlap the bottom of the hero by 64px, all the same height. Each card has a small picture, a title, two reserved lines of text and a «جزئیات» link pinned to the bottom. A click opens the details window on that card's page.
3. **Plans.** Every plan in one row: the free trial first, then monthly, three months and a year. The selected plan has a brand ring, and the plan the server marks gets the «محبوب» badge. Each paid plan shows its monthly cost or its saving against monthly.
4. **Payment bar.** The amount, the renewal line and «فعال‌سازی پرو». The amount follows the selected plan.

The free trial has no separate link. It is one of the plans.

## The details window

A one-feature-per-page window, like Telegram Premium:

- a 520px window
- a 320px picture on `assets/stage.webp`
- one title and one line
- dots with previous and next buttons
- a full-width «فعال‌سازی پرو» button

| Page | Picture |
|---|---|
| Layout | three clocks for three cities, two weather widgets |
| Widgets | example widgets in several sizes and styles, without naming them |
| Wallpaper | a fan of three new tabs on `assets/wallpaper.webp` with only a search box, and a card that says «عکس، گیف و ویدیو تا ۴۰ مگابایت» |
| Gallery | one «رایگان با پرو» badge over three tiles: avatar, bookmark icon, photo widget picture |
| Small extras | a preset layout, a mini app open in its own window |

Owner decisions this design must keep:

- Every widget in a picture is white, never glass.
- Pictures carry the message, and text stays short.
- No feature list names the Pro widgets, because that list changes.
- The Pro hero art appears only in the hero, never as a wallpaper.

## Facts from the code

The window shows only what the code gates today:

- `isVipOnly` sizes in `src/features/widgets/registry.tsx`
- Pro presets
- transparent clock styles
- the photo widget
- currency history
- opening a mini app in its own window
- the upload size
- `accessVip` gallery assets, free with Pro

The gallery opens in three places: profile avatars, bookmark icons and photo widget pictures.

The upload limit is 40MB for Pro and 2MB for free by default, and the server config can change it (`use-wallpaper-upload.ts`). Read the number from that config; never write it into the copy.

## Still open

- New copy needs the owner's approval: the headline, the card texts, the window titles and lines.
- The renewal line «یک بار پرداخت می‌کنی و خودکار تمدید نمیشه» assumes a one-time bank payment with no renewal, so the build leaves it out until the backend confirms it.
- The button uses `brand`. Today's code uses `vip` for it.
- The Pro badge stays `vip`, as `VipBadge` draws it.
- Only the light theme is drawn. Check that the dark and glass themes hold up, with every colour taken from a token.
- The art still needs a final pass; the files in `assets/` are drafts.

## Art

`art/` holds the PhotoCraft scripts that draw `stage.webp`, `hero-pro.webp` and `wallpaper.webp`.

1. Set `PHOTOCRAFT_RECIPE_RUNNER` to the recipe runner script.
2. Run a script, for example `python stage.py`. It writes a PNG next to itself.
3. Convert the PNG to WebP into `assets/`.

`hero_pro.py` also needs Pillow. It upscales `assets/pro-icon.png` before placing it.
