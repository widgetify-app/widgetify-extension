# Calendar widget

The Jalali calendar with holidays, events and the day's mood. 2x3 month view with a Google Calendar tab, 2x1 week (PRO), 1x1 today.

## Files

| Path | Holds |
|---|---|
| `calendar.widget.tsx` | Entry. Reads the display options from `meta`, picks the size, sets padding, and puts the options under «تنظیمات تقویم» in the menu («رویدادها و حال روز», «فقط رویدادها», «فقط حال روز» or «فقط تاریخ‌ها»; none at 1x1). |
| `calendar-setting.tsx` | The settings modal: two switches, events and moods, each beside a live preview of a day that gains or loses its dot or mood ring as you switch. At 1x1 it says the options show at 2x1 and 2x3. |
| `variants/calendar-2x3.tsx` | Tabs in the header, month arrows on hover, the month title with "برو به امروز", the month grid and the day popover. Adds "برو به امروز" to the widget menu while another month is open. |
| `variants/calendar-2x1.tsx` | This week, Saturday first. `WidgetHeader` with the month and year, then seven day tiles with the same event dot and mood ring as the month view. |
| `variants/calendar-1x1.tsx` | Today: the month in `WidgetCenteredHeader`, then the day and the weekday, red on a holiday. |
| `components/day/day.tsx` | One day of the month: a 28 px circle, filled on today, red on a holiday, ringed when selected, bordered with the mood colour, a dot for an event. |
| `components/day/day-details.tsx` | The popover of a day: date in three calendars, every event with a holiday tag, mood picker for the last seven days. It always shows everything; the display options only change the faces of the days. |
| `hooks/use-day-details-popup.ts` | Which day the popover belongs to. |
| `utils/day-marks.ts` | One day's marks, shared by both sizes: a holiday (Friday or an official holiday), an event dot (a Jalali event, or a Gregorian or Hijri one with an icon), the Jalali event count. Tested. |
| `utils/normalize-calendar-display.ts` | `meta.showEvents` and `meta.showMoods` read from storage; anything but `false` is on. Tested. |
| `utils/month-grid.ts` | Weeks of a month with the leading days of the previous one. Tested. |

The Google tab is `GoogleCalendarTab` from the Google Calendar widget; the calendar passes it the tabs so both share one header.

## Settings

Per widget, in `meta`: `showEvents` and `showMoods`, both on by default, so a calendar placed before the options existed shows what it always did. They apply to 2x1 and 2x3. A holiday stays red with events off: Fridays and official holidays are the calendar, not an event. Moods are still fetched with moods off, so the popover's picker shows the saved mood.

## Layout

- 2x3: `p-3 gap-2`, then `WidgetHeader` with the tabs and the month arrows, then the month title and the grid.
- 2x1: `px-3 py-2.5 gap-1.5`, then `WidgetHeader`, the frame of the tasks 2x1. The tiles get 42px of height at 96px cells and 34px at 88px; with the weekday letter at `leading-none` a tile needs 36. Every tile carries a 2px border, transparent without a mood, so a mood does not move its contents.
- 1x1: `px-3 py-2.5`, then `WidgetCenteredHeader` with the month. The day is `42cqh`, about 32px at 96px cells.

## Design decisions

- The tabs moved from the bottom of the widget into the header.
- The 2x1 had a short month row in small grey type and a smaller ⋯, and the 1x1 a ⋯ floating on glass, so neither looked like tasks beside them. Both now take the tasks frame and header. The 1x1 day shrank from about 38px to 32px to make room for the label row.
- A day with events shows a dot; the event icons that used to sit inside the day are gone. The popover still lists every event.
- The 2x1 shows the mood like the month view, as a border in the mood's colour, and follows the same event and holiday rule through `day-marks.ts`. It used to dot any Jalali or Hijri event and showed no mood.
- The mood picker shows the mood images only; each name is the button's label and tooltip.
- The popover titled a day «حس و حال امروز» when it fell on today's weekday, which happened to the same weekday last week, still inside the seven-day window. It now compares the date.
- «برو به امروز» from the menu did nothing, like every widget's own menu action. The fix is in `widget-context-menu.tsx`; see `src/features/widgets/README.md`.

## Not checked on screen

The grid at every density (six-week months are the tight case), the popover position near the widget edges, the mood border on a day at 2x3 and on a 2x1 tile (today's filled tile in particular), the settings modal and its previews, the 2x1 header and week at 88px cells (a window under 900px), the 1x1 number size and its month giving way to ⋯ on hover, and the Google tab with and without a connection.
