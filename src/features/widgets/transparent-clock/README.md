# Transparent clock widget

A frameless clock drawn straight on the wallpaper, in Persian or English, at 2x1, 2x2 or 4x2.

## Files

| Path | Holds |
|---|---|
| `transparent-clock.widget.tsx` | Entry. Picks the language model. |
| `variants/transparent-clock-persian.tsx`, `variants/transparent-clock-english.tsx` | Date text in each language. |
| `components/transparent-clock-face.tsx`, `components/clock-digits.tsx` | Time and date, sized by the container, and ⋯. |
| `../hooks/use-wallpaper-theme.ts` | Text colour and glow taken from the wallpaper. The canvas owns it, because the edit mode grid takes its colour from it too. |
| `utils/normalize-variant.ts` | Reads the stored model. Tested. |

## Layout and menu

No frame and no label, like the search 2x1: the clock is the content. The only control is ⋯, `placement="corner"` at the top left on hover, the same small bare button as the search 2x1 and the frameless clock models.

The face draws ⋯ with `tone="onColor"` inside a span in the clock's own colour, so ⋯ follows the wallpaper colour the digits use. A theme colour would vanish on some wallpapers, which is why the face, and not the entry, holds it: the face already reads the wallpaper theme.

## Design decisions

- ⋯ used to be a dark glass chip, unlike every other ⋯. It is now bare, like the rest, and takes the clock's colour instead of a background to stay readable.

## Not checked on screen

The ⋯ over bright and busy wallpapers and with no wallpaper, at each size, and in the English model.
