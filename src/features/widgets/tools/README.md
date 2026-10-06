# Tools widget

Pomodoro, prayer times and a currency converter. 2x3 with tabs in the header; 2x1 (PRO) with three live tiles, each opening its tool in a modal.

## Files

| Path | Holds |
|---|---|
| `tools.widget.tsx` | Entry. Tabs, the stored tab, the 2x1 modal. Passes the tabs to the active tool; a tool rendered without tabs is inside the modal. The modal keeps the last tool it opened (`modalTool`, separate from `isModalOpen`), so its title and content stay while it closes; the pomodoro opens it `lg`, the other two `md`. |
| `components/tool-header.tsx` | `WidgetHeader` in the widget; in the modal, a plain row of the same parts, because hover controls and ⋯ do not exist there. |
| `pomodoro/pomodoro.tsx` | Timer, mode switch, dial, controls, the leaderboard view. In the widget the settings open from "تنظیمات تایمر" in the menu, with the current times under it; in the 2x1 modal the dial is larger and the settings sit beside it, with the leaderboard link under them. Re-exports the pomodoro types. |
| `pomodoro/components/timer-display.tsx`, `pomodoro/components/control-button.tsx` | The dial and the round buttons. |
| `pomodoro/components/settings-form.tsx` | The settings: work and break steppers and the alarm switch, in one grouped panel. Changes apply at once. Shared by the modal below and the 2x1 modal. |
| `pomodoro/components/settings-panel.tsx` | The settings modal of the 2x3: a line saying changes apply at once, then the form. |
| `pomodoro/top-users/` | Leaderboard list and rows. |
| `components/religious-time.tsx` | Six times, the next one highlighted with the time left, and the zikr of the day. |
| `components/currency-converter.tsx` | Two amount fields, swap, and the price of the source currency. |
| `variants/tools-2x1.tsx` | A short «ابزارها» row with the ⋯, like the calendar's 2x1, then three tiles: «پومودورو» with the time left, the next time by its full name («اذان ظهر», «طلوع آفتاب») and «تبدیل ارز» with the pair the converter opens with («EUR ⇄ USD», from `CONVERTER_DEFAULT_PAIR`). |
| `hooks/use-religious-times.ts` | Prayer times for the user's city, or Tehran. Shared by the tab and the 2x1 tile. |
| `hooks/use-pomodoro-glance.ts` | Reads the stored session and settings, ticks while the timer runs. |
| `utils/next-prayer.ts`, `utils/pomodoro-time.ts`, `utils/normalize-tools-tab.ts` | Tested helpers. `stepDuration` moves a stepper by whole steps and snaps an odd stored value onto them. |

## Storage

`toolsTab`, `pomodoro_session`, `pomodoro_settings`. The ids are data.

## Header and menu

| Tab | On hover | Info | Menu actions |
|---|---|---|---|
| Pomodoro | جدول برترین‌ها | none | تنظیمات تایمر, with the current times |
| Leaderboard | back button and title replace the tabs | none | تنظیمات تایمر |
| Prayer times | none | city | none |
| Converter | none | none | none |

In the 2x1 modal the settings are on screen, because the widget menu sits behind the modal.

## Design decisions

- The pomodoro's own ⋯ ("شخصی سازی") is gone; its settings moved into the widget menu.
- The settings are steppers and a switch instead of number fields that only took a value inside the range and a checkbox, and they apply as you change them. The old "ذخیره و بستن" reset the timer on every close, changed or not.
- Changing the current mode's length stops the timer and starts it from the new length, in state and in storage alike. It used to write a stopped session while the timer kept running on screen, so the 2x1 tile and the widget disagreed. Changing the other mode's length leaves the running timer alone.
- The 2x1 tiles used to fill the widget, and the floating ⋯ covered the converter. The short top row gives the ⋯ its own place.
- The prayer tile used the short name («ظهر»), which read as the time of day. It shows the full name; «اذان» alone would be wrong for sunrise and midnight.
- The converter tile is named for the tool, «تبدیل ارز», and shows no price: the converter is general, and one currency's price said nothing about it. It shows the pair the converter opens with, from the same constant the converter starts from, so the two cannot drift.
- `Checkbox` left `components/ui`: the old settings were its last user.
- The converter dropped the reverse-rate box and the target currency's toman price.
- The zikr shows the day's name instead of its meaning.

## Not checked on screen

The dial and buttons, the mode switch, the leaderboard, the highlighted prayer, the converter fields and selects, the 2x1 top row and tiles, the pomodoro modal with the settings beside the larger dial (and at a 500px window), the steppers, the notification modal, and whether the 2x1 tile follows a running pomodoro.
