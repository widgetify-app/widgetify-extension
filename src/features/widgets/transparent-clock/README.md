# Transparent clock widget

A frameless clock drawn straight on the wallpaper, in Persian or English, at 2x1, 2x2 or 4x2. The digits can be styled per widget, after the iPhone lock screen clock: shape, solid or glass, weight, size and colour.

## Files

| Path | Holds |
|---|---|
| `transparent-clock.widget.tsx` | Entry. Picks the language model, adds «شخصی‌سازی ساعت» to the menu and opens the style editor on the clock. |
| `variants/transparent-clock-persian.tsx`, `variants/transparent-clock-english.tsx` | Date text in each language. The English date line is `dir="ltr"`, so it reads weekday then date («Monday • October 19») inside the right-to-left page. |
| `components/transparent-clock-face.tsx`, `components/clock-digits.tsx` | Time and date, sized by the container, and ⋯. |
| `components/clock-style-editor.tsx` | The style editor: a spotlight on the clock and a bar at the bottom of the screen with three tabs. |
| `hooks/use-clock-style-draft.ts` | The style being edited: drawn on the clock at once, saved on «تموم شد», dropped on «لغو». |
| `utils/normalize-style.ts` | Reads the stored style and writes it back. Tested. |
| `utils/clock-paint.ts` | Turns a style into the digits' CSS. Pure and tested. |
| `utils/normalize-variant.ts` | Reads the stored model. Tested. |
| `../hooks/use-wallpaper-theme.ts` | Text colour and glow taken from the wallpaper. The canvas owns it, because the edit mode grid takes its colour from it too. |

## Style

The style is stored in the widget's `meta` next to `variant`, flat, so the server keeps it with the rest of the row:

| Key | Values | Default |
|---|---|---|
| `clockFace` | `classic`, `outline`, `stacked` | `classic` |
| `clockFinish` | `solid`, `glass` | `solid` |
| `clockWeight` | 100 to 900, in steps of 100 (the Vazir weights) | 900 |
| `clockScale` | 0.7 to 1.3, times the responsive size | 1 |
| `clockColor` | `wallpaper` or a six digit hex (a stored `rainbow` from before reads as `wallpaper`) | `wallpaper` |
| `clockGlassTint` | 0 to 100, the colour amount on glass: higher is more colour, lower lets more wallpaper through | 40 |
| `clockDatePosition` | `above`, `below`, `hidden` (the date line's place, by `order-first` on it, or no date line; screen readers still hear the date) | `below` |

The defaults draw the clock exactly as it was before the style existed, so a widget with nothing stored does not change. Every read goes through `normalizeTransparentClockStyle`; a value outside the list or range falls back or is clamped.

The shapes:

- `classic`: the face as it was.
- `outline`: a stroke and no fill.
- `stacked`: the hour above the minutes, no colon, lines at 0.86 and its own size (`min(40cqw, 34cqh)`, times the size setting), after the Samsung and Pixel stacked clocks. A one row cell has no room for two rows, so `resolveClockFace` draws it as `classic` at 2x1 (the registry passes the size in) and the editor disables its tile there; the stored value stays.

`tall` (stretched), `stencil` (a band cut through the digits) and `soft` (Samim, Arial Rounded) were built and dropped by the owner: they did not look good. A stored value of one of them reads as `classic`.

Glass is a translucent gradient clipped to the digits with a thin edge. Translucent colours are written as `hsla()` from the wallpaper's `inkHsl`, or `rgba()` from a hex or from `--color-base-content-rgb` with no wallpaper, because `color-mix()` is newer than Chrome 109. Glass and the outline move the glow from `text-shadow` to a `drop-shadow` filter, since a text shadow paints over a clipped background.

A picked hex also colours the date line. A rainbow colour was built and replaced by the free colour picker at the owner's request.

## Editing the style

Like the iPhone lock screen: ⋯ (or a right click) has «شخصی‌سازی ساعت», with the current shape and finish under it and a «جدید» badge. The badge is static, like the one in general settings; take it out in a later release. It dims the whole page except the clock (a spotlight: a box over the clock with a `box-shadow` of `--color-scrim` spread across the screen) and opens a bar at the bottom of the screen. The clock itself is the preview, on the real wallpaper, drawing the draft from `useClockStyleDraft`.

The bar shows one group at a time, so it stays small:

- «سبک»: the three shape tiles, and under them «تاریخ بالا» / «تاریخ پایین» / «بدون تاریخ».
- «ضخامت و اندازه»: the weight and size sliders.
- «رنگ»: everything about colour in one place, by the owner's choice: the solid or glass switch with «میزان رنگ» beside it on glass, then one row of swatches (wallpaper colour, nine presets) ending in `ColorPicker` for any colour. The picker's trigger is a round swatch showing a colour wheel, or the picked colour with the selection ring when it is not a preset. Its popup opens in the top layer after the editor, so it stacks above the bar, and it starts from the current colour.

The sliders run left to right (`dir="ltr"` around each): in the right-to-left page a native range runs from the right, and dragging right made the value smaller.

«تموم شد», or a click on the dimmed page, saves once through `updateWidgetSettings`. «لغو» or Escape drops the draft and the clock goes back to what is stored. The spotlight follows the clock on resize and scroll.

A modal (a fake preview beside the controls) and a `PopoverMenu` beside the clock (every control at once) were tried first and felt crowded.

## Pro

The shape, the date line, the finish and the colour («سبک» and «رنگ») are pro; weight and size are free.

- Without pro the editor opens on «ضخامت و اندازه», and «سبک» and «رنگ» carry the 💎 badge. A locked tab still shows its controls, faded and inert, under one line and «ارتقا به پرو», which drops the draft and opens the pro tab of settings (`openSettings`, `'vip'`), like the photo widget.
- The clock draws `toFreeClockStyle(style)` without pro: the default shape, finish, date position and colour with the stored weight and size. The pro values stay in `meta`, so they come back when pro does, the way a pro size on the canvas locks and unlocks.

Analytics: `transparent_clock_settings_opened` when the editor opens, `transparent_clock_style_saved` on save, `transparent_clock_vip_required` on «ارتقا به پرو».

## Layout and menu

No frame and no label, like the search 2x1: the clock is the content. The only control is ⋯, `placement="corner"` at the top left on hover, the same small bare button as the search 2x1 and the frameless clock models.

The face draws ⋯ with `tone="onColor"` inside a span in the wallpaper colour, so ⋯ stays readable whatever colour the digits take.

## Design decisions

- ⋯ used to be a dark glass chip, unlike every other ⋯. It is now bare, like the rest, and takes the clock's colour instead of a background to stay readable.
- No serif, slab or other faces: the extension ships only Vazir and Samim, and a new font for the Persian digits was left out.
- The iPhone's depth effect (the clock behind the wallpaper's subject) is left out: it needs the subject cut out of the wallpaper.

## Not checked on screen

Every shape, solid and glass, on a bright, a dark and a busy wallpaper and with no wallpaper, at 2x1, 2x2 and 4x2 and in both models. Size 130% in 2x1 may crowd the date line. The spotlight and the bar over every wallpaper and with none; the locked tabs signed out and signed in without pro; the swatch tooltips inside the top layer; the bar at 500px wide.
