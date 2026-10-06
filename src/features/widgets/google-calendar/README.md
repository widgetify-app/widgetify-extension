# Google Calendar widget

The user's Google Calendar events. Three 2x3 models (schedule, timeline, upcoming), a 2x1 bar and a 1x1 summary. Needs a signed-in user with a Google connection.

## Files

| Path | Holds |
|---|---|
| `google-calendar.widget.tsx` | Entry. Picks the model by size and `meta.variant`, sets padding, adds «به‌روز کن» to the widget menu, the same words as tasks, notes and habits. Re-exports `GoogleCalendarTab` for the calendar widget. |
| `hooks/use-google-calendar-schedule.ts` | Selected day, the week around it, the week's events, error and refetch, opening an event. |
| `variants/google-calendar-schedule.tsx` | Week strip and the selected day's events. Week arrows on hover. |
| `variants/google-calendar-timeline.tsx` | One day on a 24-hour grid, 36 px per hour, with a now line. Scrolls to now, or to the first event. Day arrows on hover. |
| `variants/google-calendar-agenda.tsx` | Upcoming events of the loaded week, grouped by day. Only ⋯ on hover. |
| `variants/google-calendar-2x1.tsx` | `WidgetHeader` «تقویم گوگل» with the day's count as its info («۳ برنامه»), the same words as the schedule's day row, then the event happening now, or the next one, in one row built like a task's: times, dot, title, then the location or the length. Its end holds a countdown, the minutes or hours until it starts («۲۵ / دقیقه تا شروع», «۱:۳۰ / ساعت تا شروع»), or for an event in progress «ورود» when it has a meeting link and the time left when it does not. A bar under the row fills as the event runs. A day with nothing left shows `WidgetCompactEmpty` with no button. |
| `variants/google-calendar-1x1.tsx` | The same event, centred like the calendar's 1x1: `WidgetCenteredHeader` with «جلسه‌ی بعدی», or «۱۵ دقیقه مونده» in brand colour for an event in progress, then the start time large and the title in up to two lines. |
| `components/google-calendar-event-row.tsx` | One event row: times, dot, title, location or time left, and "ورود" for a meeting in progress. Lights up on hover and on keyboard focus, like a task row. |
| `components/google-calendar-event-list.tsx` | Loading, error and empty around any event list. |
| `components/google-calendar-row-skeleton.tsx` | A row-shaped skeleton. |
| `components/google-calendar-week-strip.tsx` | Seven day buttons; today filled, Friday red. |
| `../components/today-chip.tsx` | "برو به امروز", beside the title only when another day is open. Shared with the calendar widget. |
| `components/google-calendar-empty.tsx` | Empty state through `WidgetEmpty`. |
| `components/google-calendar-auth.tsx` | Not connected and signed out, in every size: `WidgetEmpty` at 2x3, `WidgetCompactEmpty` under the header at 2x1, a line and a button under `WidgetCenteredHeader` at 1x1. |
| `components/google-calendar-tab.tsx` | Today's events as the Google tab of the calendar widget, under the calendar's tabs. |
| `utils/classify-event.ts` | Now, past, times, duration, minutes left, minutes until the start, `countdownParts` (a number and its unit for the 2x1) and `currentOrNextEvent` (the event the 2x1 and 1x1 show). Tested. |
| `utils/timeline-layout.ts` | Minutes from midnight, and side-by-side lanes for overlapping events. Tested. |
| `utils/day-range.ts`, `utils/week-days.ts` | Query range and the week around a day. Tested. |

## States

Loading, error ("نتونستیم برنامه‌هات رو بیاریم" with retry), empty, not connected and signed out are separate screens. The header and ⋯ stay on every one of them.

## Layout

The tasks frame: `p-3 gap-2` at 2x3 and `px-3 py-2.5 gap-1.5` at 2x1, then `WidgetHeader`. The 1x1 takes `px-3 py-2.5` and `WidgetCenteredHeader`. The 2x1 row is `px-2 gap-2.5 rounded-xl min-h-8.5`, a task row's recipe, and lights up on hover when it opens something.

## Design decisions

- The 2x1 had no title and its ⋯ floated on glass, so it looked unlike tasks beside it. It now has the tasks header, and its empty and signed-out states are the tasks 2x1's `WidgetCompactEmpty`.
- The 1x1 label read «الان · ۱۵ دقیقه مونده». At the header's type size that overflows a 1x1, so an event in progress shows «۱۵ دقیقه مونده» alone, in brand colour. An empty 1x1 says «برنامه‌ای نداری», second person like the other empty states, instead of «بدون برنامه».
- The API gives events no colour, so every dot uses the brand colour; the event in progress gets the solid one.
- The timeline places events by the browser's clock, the same clock the times are printed with.
- The 2x1 and 1x1 skip all-day events when they pick the next event.
- The old timeline list with attendee initials is gone; the grid replaced it.
- The 2x1 used to read «بعدی · ۱۵ دقیقه», where 15 minutes was the event's length but read as the wait. The wait now has its own place at the end, and the line under the title gives the location or the length.
- The countdown splits number and unit so «۱:۳۰» stays narrow; «۱ ساعت و ۳۰ دقیقه» would squeeze the title.
- An all-day event reads «تمام روز» everywhere; the row used to say «همه‌روز».

## Not checked on screen

The grid at every density, overlapping events, the scroll on open, the now line, the week strip in every theme, the calendar widget's Google tab, the 2x1 countdown with a long title and with hours, the 2x1 header with its count, the centred 1x1 with a two-line title, its label giving way to ⋯ on hover, and both small sizes at 88px cells (a window under 900px), where an event in progress pushes its bar into the bottom padding.
