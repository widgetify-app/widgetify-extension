# Google Calendar widget

The user's Google Calendar events. Three 2x3 models (schedule, timeline, upcoming), a 2x1 bar and a 1x1 summary. Needs a signed-in user with a Google connection.

## Files

| Path | Holds |
|---|---|
| `google-calendar.widget.tsx` | Entry. Picks the model by size and `meta.variant`, sets padding, adds "به‌روزرسانی رویدادها" to the widget menu. Re-exports `GoogleCalendarTab` for the calendar widget. |
| `hooks/use-google-calendar-schedule.ts` | Selected day, the week around it, the week's events, error and refetch, opening an event. |
| `variants/google-calendar-schedule.tsx` | Week strip and the selected day's events. Week arrows on hover. |
| `variants/google-calendar-timeline.tsx` | One day on a 24-hour grid, 36 px per hour, with a now line. Scrolls to now, or to the first event. Day arrows on hover. |
| `variants/google-calendar-agenda.tsx` | Upcoming events of the loaded week, grouped by day. Only ⋯ on hover. |
| `variants/google-calendar-2x1.tsx`, `variants/google-calendar-1x1.tsx` | The event happening now, or the next one. ⋯ floats. |
| `components/google-calendar-event-row.tsx` | One event row: times, dot, title, location or time left, and "ورود" for a meeting in progress. |
| `components/google-calendar-event-list.tsx` | Loading, error and empty around any event list. |
| `components/google-calendar-row-skeleton.tsx` | A row-shaped skeleton. |
| `components/google-calendar-week-strip.tsx` | Seven day buttons; today filled, Friday red. |
| `../components/today-chip.tsx` | "برو به امروز", beside the title only when another day is open. Shared with the calendar widget. |
| `components/google-calendar-empty.tsx` | Empty state through `WidgetEmpty`. |
| `components/google-calendar-auth.tsx` | Not connected and signed out, in every size. |
| `components/google-calendar-tab.tsx` | Today's events as the Google tab of the calendar widget, under the calendar's tabs. |
| `utils/classify-event.ts` | Now, past, times, duration, minutes left. Tested. |
| `utils/timeline-layout.ts` | Minutes from midnight, and side-by-side lanes for overlapping events. Tested. |
| `utils/day-range.ts`, `utils/week-days.ts` | Query range and the week around a day. Tested. |

## States

Loading, error ("برنامه‌هات دریافت نشدند" with retry), empty, not connected and signed out are separate screens. The header and ⋯ stay on every one of them.

## Design decisions

- The API gives events no colour, so every dot uses the brand colour; the event in progress gets the solid one.
- The timeline places events by the browser's clock, the same clock the times are printed with.
- The 2x1 and 1x1 skip all-day events when they pick the next event.
- The old timeline list with attendee initials is gone; the grid replaced it.

## Not checked on screen

The grid at every density, overlapping events, the scroll on open, the now line, the week strip in every theme, and the calendar widget's Google tab.
