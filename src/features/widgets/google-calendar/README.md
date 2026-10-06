# Google Calendar widget

The user's Google Calendar events. Three 2x3 models (schedule, timeline, upcoming), a 2x1 bar and a 1x1 summary. Needs a signed-in user with a Google connection.

## Files

| Path | Holds |
|---|---|
| `google-calendar.widget.tsx` | Entry. Picks the model by size and `meta.variant`, sets padding, adds "بارگذاری مجدد" to the widget menu, the same words as every other widget. Re-exports `GoogleCalendarTab` for the calendar widget. |
| `hooks/use-google-calendar-schedule.ts` | Selected day, the week around it, the week's events, error and refetch, opening an event. |
| `variants/google-calendar-schedule.tsx` | Week strip and the selected day's events. Week arrows on hover. |
| `variants/google-calendar-timeline.tsx` | One day on a 24-hour grid, 36 px per hour, with a now line. Scrolls to now, or to the first event. Day arrows on hover. |
| `variants/google-calendar-agenda.tsx` | Upcoming events of the loaded week, grouped by day. Only ⋯ on hover. |
| `variants/google-calendar-2x1.tsx` | The event happening now, or the next one: times, dot, title, then the location or the length. Its end holds a countdown, the minutes or hours until it starts («۲۵ / دقیقه تا شروع», «۱:۳۰ / ساعت تا شروع»), or for an event in progress «ورود» when it has a meeting link and the time left when it does not. A bar under it fills as the event runs. ⋯ floats. |
| `variants/google-calendar-1x1.tsx` | The same event, centred like the calendar's 1x1: the label, the start time large, the title. ⋯ floats. |
| `components/google-calendar-event-row.tsx` | One event row: times, dot, title, location or time left, and "ورود" for a meeting in progress. Lights up on hover and on keyboard focus, like a task row. |
| `components/google-calendar-event-list.tsx` | Loading, error and empty around any event list. |
| `components/google-calendar-row-skeleton.tsx` | A row-shaped skeleton. |
| `components/google-calendar-week-strip.tsx` | Seven day buttons; today filled, Friday red. |
| `../components/today-chip.tsx` | "برو به امروز", beside the title only when another day is open. Shared with the calendar widget. |
| `components/google-calendar-empty.tsx` | Empty state through `WidgetEmpty`. |
| `components/google-calendar-auth.tsx` | Not connected and signed out, in every size. |
| `components/google-calendar-tab.tsx` | Today's events as the Google tab of the calendar widget, under the calendar's tabs. |
| `utils/classify-event.ts` | Now, past, times, duration, minutes left, minutes until the start, and `countdownParts` (a number and its unit for the 2x1). Tested. |
| `utils/timeline-layout.ts` | Minutes from midnight, and side-by-side lanes for overlapping events. Tested. |
| `utils/day-range.ts`, `utils/week-days.ts` | Query range and the week around a day. Tested. |

## States

Loading, error ("نتونستیم برنامه‌هات رو بیاریم" with retry), empty, not connected and signed out are separate screens. The header and ⋯ stay on every one of them.

## Design decisions

- The API gives events no colour, so every dot uses the brand colour; the event in progress gets the solid one.
- The timeline places events by the browser's clock, the same clock the times are printed with.
- The 2x1 and 1x1 skip all-day events when they pick the next event.
- The old timeline list with attendee initials is gone; the grid replaced it.
- The 2x1 used to read «بعدی · ۱۵ دقیقه», where 15 minutes was the event's length but read as the wait. The wait now has its own place at the end, and the line under the title gives the location or the length.
- The countdown splits number and unit so «۱:۳۰» stays narrow; «۱ ساعت و ۳۰ دقیقه» would squeeze the title.
- An all-day event reads «تمام روز» everywhere; the row used to say «همه‌روز».

## Not checked on screen

The grid at every density, overlapping events, the scroll on open, the now line, the week strip in every theme, the calendar widget's Google tab, the 2x1 countdown with a long title and with hours, and the centred 1x1 with a two-line title.
