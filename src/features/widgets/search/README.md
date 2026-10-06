# Search widget

The search box. 4x1, and a 2x1 for PRO. No header. The 4x1 is a card with the box and a row of chips; the 2x1 has no card, so the box is the widget.

## Files

| Path | Holds |
|---|---|
| `search.widget.tsx` | Entry and the 4x1: engine, input, image and voice search, clear and submit while typing, then the bookmarks row with ⋯ at its end. `SearchLayout` gives the 4x1 the widget card and the 2x1 a `WidgetContainer` without a background, with `<WidgetMenuButton placement="corner" />`. |
| `variants/search-2x1.tsx` | Engine, input, one search or clear button. |
| `components/search-box-parts.tsx` | The box and input classes (each size adds the box's background) and `SearchBoxButton`. |
| `components/engine-selector.tsx` | Engine dropdown. |
| `components/bookmark/browser-bookmark.tsx` | "کاوش", "بوکمارک‌های مرورگر" and the recommended sites. |
| `components/search-history-portal.tsx`, `components/suggestions.tsx` | History and suggestions under the box. |
| `components/image/`, `components/voice/` | Image and voice search buttons and portals. |
| `hooks/use-search-history.ts`, `utils/normalize-search-history.ts` | History, normalised on read. Tested. |

## Layout

- 4x1: the widget card (`p-2`), the box on `bg-fill`, then the chips and site icons on `bg-fill`.
- 2x1: no card. The box carries the widget surface itself (`bg-glass-surface`) and sits in the middle of the cell.

## Menu

⋯ is the small bare button, on hover only, never inside the box: `compact` at the end of the 4x1's chips row, and `corner` at the 2x1's top left, where the cell is empty above the box. The row keeps ⋯'s width free at rest, so the chips do not move. The menu has only size, move and delete.

## Design decisions

- The 2x1 dropped its card: around one box it drew a box inside a box. The 4x1 keeps it, since it holds the chips too.
- ⋯ used to sit at the end of the box after a divider. It moved out of the box so the box holds only search controls. At the 4x1's top left it lay over the box, which fills the card's corner, so there it ends the chips row.
- The 2x1 still sits in `WidgetContainer`, for the edit-mode lock and the container size.
- `voice-search-portal.tsx` starts the microphone in a mount effect. Never make it always mounted.

## Not checked on screen

The box at rest, focused and while typing; the 2x1 on a light and a dark wallpaper and with no wallpaper, and its ⋯ at 88px and 80px cells (a window under 900px and 640px); the 4x1's ⋯ at the end of a full chips row; the suggestions width.
