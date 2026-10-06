# Dot calendar widget

A day counter, called «روزشمار» in its menu. Two models: the days of the Jalali year, and a countdown to a goal (PRO). At 2x2 every day is a dot; at 2x1 the widget writes the days left as a number over a thin bar.

## Files

| Path | Holds |
|---|---|
| `dot-calendar.widget.tsx` | Entry. Normalises `meta`, picks the model and the size, sets the frame, opens the settings, and gives the widget menu the goal summary. Re-exports `normalizeDotCalendarMeta` for the registry. |
| `dot-calendar-setting.tsx` | The goal's settings modal: its name and its day, with a line that counts the days left or says which days you can pick. |
| `variants/dot-calendar-year.tsx` | «روزهای سال» in the header. At 2x2 the dots, with the days left as info; at 2x1 `DaysLeftCount` («۲۰۰ روز مونده تا ۱۴۰۶»), with the year as info. |
| `variants/dot-calendar-goal.tsx` | «روزشمار هدف» in the header. At 2x2 the days left as info, the goal's name and «تا ۲۰ خرداد» on a line under the header, then the dots; at 2x1 the date as info and `DaysLeftCount` ending in the goal's name («۷۴ روز مونده تا کنکور»). Without a goal, `WidgetEmpty` (icon, title, button) or `WidgetCompactEmpty` at 2x1; «رسیدی به روز هدفت» from the goal day on. |
| `components/dot-grid.tsx` | The dots, sized to the space left. Passed days solid, today ringed, the rest faint. |
| `components/days-left-count.tsx` | The 2x1 body: the days left large, «روز مونده تا …», and a bar filled by the share of days gone. |
| `utils/` | Grid layout, year and goal progress, allowed goal dates, the variant and `normalizeDotCalendarMeta`. Tested. |

## Sizes and models

| | 2x2 | 2x1 |
|---|---|---|
| Year | «روزهای سال» | «روزهای سال (عددی)» |
| Goal (PRO) | «روزشمار هدف» | «روزشمار هدف (عددی)» |

`meta.variant` holds the model and the size picks the view, so resizing from the menu keeps the goal. The catalog lists the four as variants, each model's two sizes side by side, because it shows no size picker for a widget with variants; the 2x1 two share `meta.variant` with the 2x2 two, and the catalog's edit mode matches the model and the size before the model alone.

## Data

Everything lives in the widget `meta`: `variant`, `goalTitle`, `goalStartDate`, `goalEndDate`. `normalizeDotCalendarMeta` reads it: a field of the wrong type is dropped, the title trimmed.

Picking a goal day stores today as its start, so the dots run from the day the goal was set.

## Layout

The tasks frame: `p-3 gap-2` at 2x2, `px-3 py-2.5 gap-1.5` at 2x1, then `WidgetHeader` titled with the model's name, as tasks are titled «تسک‌ها». The body is inset `px-2`, like a task row.

## Menu and settings

Only the goal model has settings (`hasSettings` in the registry), first in the menu as «تنظیمات روزشمار» with the goal under it («هدف: کنکور · ۲۰ خرداد», or «هنوز هدفی نداری»). The year model has nothing to set and shows no settings item. The goal's empty state opens the same modal from «تعیین هدف».

## Design decisions

- The settings used to hold both models behind tabs, with only an explanation for the year. The model is picked in «تغییر مدل و استایل», which checks PRO; the tabs let a free account turn its widget into a locked goal.
- The goal counted the goal day as a day left: «۱ روز مانده» on the goal day, «۲ روز» the day before it, and «رسیدی» a day late. `daysLeft` now counts the days until the goal day, so the day before reads «۱ روز مونده» and the goal day itself is reached. The year still counts today, so the last day of the year reads «۱ روز مونده», a day before Nowruz.
- The header used to carry the year («سال ۱۴۰۵») or the goal's name. It now names the widget like every other header, and the year or the goal moved into the info and the body.
- The empty goal at 2x2 lost its button off the bottom. `WidgetEmpty` is `h-full`; placed straight in the frame, it asked for the frame's full height beside the header, and with the two-line description its content needed about 170px where 140 were left. It now sits in a `flex-1 min-h-0` wrapper, without the description, and needs 126px.
- The words follow the tasks voice: «روز مونده», «هنوز هدفی نداری», «یه هدف و روزش رو بده».

## Not checked on screen

The dots after the header took space, today's ring, the reached line, the empty goal state, the 2x1 number and bar for both models with a long goal name, the 2x1 empty and reached states, the 2x2 empty goal at 88px and 80px cells, the settings modal at `md` width with the date picker, and a free account's goal at 2x1.
