# Clock widget

A clock in four models: digital (2x1), flip (2x1, PRO), vertical digital (1x1) and analog (1x1, PRO). Display only.

## Files

| Path | Holds |
|---|---|
| `clock.widget.tsx` | Entry. Picks the model, frames the digital ones, and puts ⋯ in the corner of the frameless ones. |
| `variants/clock-2x1.tsx` | `WidgetHeader` «ساعت» with the city as info, then the time large and the date at the row's end. |
| `variants/clock-1x1.tsx` | `WidgetCenteredHeader` «ساعت», then hours above minutes. |
| `variants/clock-flip.tsx`, `variants/clock-analog.tsx` | Frameless models over the wallpaper. |
| `utils/get-timezone-label.ts` | The city of the time zone. Tested. |
| `types.ts` | The old `clock` storage key, still declared because it is data. |

## Layout

The digital models are framed like tasks. The 2x1 takes `px-3 py-2.5 gap-1.5` and a `h-7` header, so the time is `42cqh` (about 32px at 96px cells) with the date on its baseline, both inset `px-2`. The 1x1 takes `px-3 py-2.5` and the centred header of the calendar's 1x1; hours and minutes are `28cqh`.

The flip and analog models have no frame and no label, like the search 2x1. Their ⋯ is `placement="corner"`, the small bare button at the top left, which lands in the empty corner around the flip cards and the round face.

## Menu

⋯ appears on hover: in the header of the digital models, in the corner of the frameless ones. The menu has no actions of its own.

## Design decisions

- The vertical model used to put hours and minutes side by side; it now stacks them, as its name says.
- The digital 2x1 had no title: the city sat in a chip that ⋯ replaced on hover. The header now reads «ساعت», like «تسک‌ها», and the city is its info. The vertical model's ⋯ floated on glass, and the frameless ones sat on a dark glass chip; every ⋯ is now the same bare button.
- The time zone label is Persian («آسیا / تهران»), so the city came out with a leading space. `getTimeZoneLabel` trims it, and turns every underscore of a Latin name into a space, not only the first.

## Not checked on screen

Every model at every density, the 1x1 digits under the header, the corner ⋯ over light and dark wallpapers and how close it comes to the flip cards on a narrow 2x1.
