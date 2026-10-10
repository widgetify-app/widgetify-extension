# Habits widget

Daily, weekly and monthly habits with a one-click log. Sizes 2x1 and 2x3, and two PRO sizes, the 4x3 board and the 2x6 panel. Signed-in only.

## Files

| Path | Holds |
|---|---|
| `habit.widget.tsx` | Entry. `HabitsContent` owns the header, the menu and the modals for every size and picks the variant by `size`; yadkar uses it at 2x3, 2x6 and 4x3 with its tabs. `HabitsLayout` sets the frame padding. |
| `hooks/use-habit-actions.ts` | Query, modal state, delete, refresh. |
| `variants/habit-2x3.tsx` | The list and its four states. |
| `variants/habit-4x3.tsx` | The board: the list with this week, Saturday to Friday, per habit under a row of weekday letters, and `BoardSummary` with today's share done. `layout="board"` (4x3) puts the week at each row's end and the summary beside the list; `layout="panel"` (2x6) puts the summary on top and each habit's week under its title. Yadkar shows both. |
| `variants/habit-2x1.tsx` | One habit at a time, stepped with `CompactPager` like tasks 2x1. |
| `components/item/habit-item.tsx` | One row: log button, title, today's progress, then this week's squares from Saturday (6px, read through `habitWeek` like the board), or `trailing` in their place. With `below`, the row has two tiers: ring and title on top, `below` under the title, and no dots. |
| `components/item/habit-item-skeleton.tsx` | A loading row; `isStacked` draws the panel's two-tier row, so nothing jumps when the habits arrive. |
| `components/item/habit-week.tsx` | The board's days: `HabitWeek`, 16px cells filled by progress with a check on a done day and a fainter cell for a day still ahead, each with its date and value as a tooltip and for screen readers; `HabitWeekHeader`, the weekday letters above them with today's in brand colour. Both run right to left from Saturday, like a Persian calendar. With `isStretched` both fill the width they get: 16px tall cells, as wide as the column allows. |
| `components/item/habit-log-button.tsx` | The 32px ring that logs one step. Filled with the habit colour once today is done. Shared by both sizes. |
| `components/item/button-progress-ring.tsx`, `components/item/button-simple-progress-ring.tsx` | Segmented ring up to six steps, a plain ring above that. |
| `components/habit-empty.tsx` | `HabitEmpty` and `HabitSignedOut`. |
| `components/habit-modals.tsx` | The form and the detail modal. |
| `components/habit-detail-modal/` | The detail modal: goal, the three stats, the six-month chart, and delete, edit and share. |
| `components/habit-share-modal.tsx` | The share image with copy and download. |
| `utils/habit-goal.ts` | Goal text, today's text (`formatHabitToday`), `isHabitDoneToday`. Tested. |
| `utils/habit-week.ts` | `weekOf` (this week's dates from Saturday), `habitWeek` (each of those days for a habit: today from `habit.today`, the rest from `history` by date, later days marked ahead), `dayKey` and `weekdayInitial`. Tested. |
| `utils/habit-step.ts`, `utils/habit-stats.ts` | Log step size and the detail statistics (streak, best streak, successful days). Tested. |
| `utils/render-habit-share-canvas.ts` | Draws the share image at 1080×1350 (4:5), the size of the mood tracker's. The modal scales it down. |

## Layout

The same as tasks and notes. The frame is `p-3 gap-2` (`px-3 py-2.5 gap-1.5` at 2x1), then a `h-7` header.

- A 2x3 row is `px-2 gap-2.5 rounded-xl hover:bg-fill`, rows `gap-0.5` apart. The log ring is 32px where a task has its 16px check, because it carries the emoji and the step segments. The history ends at the row's `px-2`.
- The board's body is the list, `gap-3`, then `BoardSummary` (`w-37.5 border-s ps-3.5`), the same as the tasks board. The weekday row sits outside the scrolling list and is laid out like a row (`px-2 gap-2.5`, a flex-1 spacer), so each letter lines up over its column.
- The panel stacks the board: `BoardSummary` with `placement="top"` (a 60px ring, done and not done beside it, `border-b pb-3`), the weekday row, then the list. A row is two tiers, `px-2 pt-1 pb-2`: the ring and title as in any row, then the week under the title at `ps-10.5` (the ring's 32px and the 10px gap). The weekday row starts at `ps-12.5` and ends at `pe-2`, so its letters stretch over the same width as the cells. Measured: letters and cells line up within 0.1px at 184, 232 and 270px, and a cell is 14.6px wide at the narrowest canvas.
- The 2x1 row fills the body: ring, title, then "today · ۲ از ۴", then the pager. Which habit it shows is saved under `compactPager:habit` (`useCompactPagerState`) and survives a reload; if that habit is archived or deleted the row falls back to the first one and clears the saved id.
- A row lights up for keyboard focus only (`useKeyboardFocusWithin`), so clicking the ring does not leave it highlighted.

## Header and menu

- Always: the title (or the yadkar tabs) and "1 از 4 امروز".
- On hover: "عادت جدید" (signed in only) and ⋯.
- Menu actions in every size: «به‌روز کن».

## Detail modal

Built like the task modal: `size="lg"`, the habit's name as the modal title, then:

1. The emoji on a tint of the habit colour, the goal, and today's progress.
2. Three stats in one strip: «پشت‌سرهم» (the current streak), «بهترین رکورد» and «روزهای موفق», the same words as the share image.
3. "۶ ماه اخیر" with its legend, the day grid, and a line that names the hovered day or says how to log.
4. Delete on the start side, then edit and "اشتراک‌گذاری تصویر" as the main button. Delete asks in place, like a task.

The share modal is `md`, like the mood tracker's: the portrait image scaled to fit 60vh and centred, then "کپی تصویر" and "دانلود تصویر".

Both modals stay mounted and only toggle `isOpen`; the detail keeps its last habit id after closing (`isDetailOpen` is separate), and closing the form keeps `editingHabit`. Mounting the detail only while a habit was chosen skipped daisyUI's open and close animation, and clearing the habit on close turned the edit form into «عادت جدید» while it faded out. The share modal mounts once the habit has loaded, for the same reason.

Editing from the detail modal opens the form on top. Saving invalidates the habit's detail query in `useUpdateHabit`, so the detail modal shows the new name and goal as soon as the form closes.

## States

Loading, error and empty are separate screens. The board and the panel have a signed-out screen too (`HabitSignedOut`, «ورود»). The 2x1 and 2x3 show the empty state to a signed-out user; its «عادت جدید» opens the profile, where you sign in. The 2x1 draws its states with `WidgetCompactEmpty`, the same as tasks.

## Design decisions

- Adding is on the widget (the header's +), so the menu keeps only reload.
- Deleting asks in the detail modal, then shows «عادت حذف شد». Tasks and notes now end a delete the same way; the toast's sound is the confirmation.
- The 2x1 has a header and the tasks pager instead of a dot row and a floating ⋯. Its empty state's button reads «عادت جدید», like the 2x3's; it said «افزودن».
- The detail modal lost its title dropdown; edit and delete sit in the footer where the task modal has them.
- The success rate is gone. It divided the successful days by every day since the first log, which says little, least of all for a habit that is not daily.
- The form's subtitle «از یه الگو شروع کن یا خودت بساز» shows only when adding, since editing has no templates.
- The share modal was 4xl wide for an 800px image. It is now `md`, and the image is a 1080×1350 portrait like the mood tracker's, so it fits a story or a post.
- The board shows the calendar week, Saturday first, not the last seven days: a Persian reader expects the week to start on Saturday. Each day is found in `history` by its date, so the order the server sends does not matter; `dayKey` takes the first ten characters, which covers `2026-10-05` and a full timestamp alike. Days the history does not hold count as nothing logged. The 2x3 reads the same week through `habitWeek` and keeps its small 6px squares, Saturday on the right. It used to draw `history` in the server's order under `dir="ltr"`, so its week ran from the left.
- The board's summary counts today only (done and not done). A rate over several days would repeat the success rate's problem.
- The panel is the board turned upright, with the same states, summary and week. The week cannot sit at a row's end at 2 columns: 136px of cells would leave the title about 28px. Under the title it has the full text column, and the cells stretch so the week reaches the row's end at every canvas width.
- The analytics names `habit_quick_log` and `habit_quick_log_wide` are sent by the callers, so `data-names.test.ts` can find them.

## Not checked on screen

The rings and the emoji inside them, the 2x3's squares running from Saturday on the right, the 2x1 pager, the detail modal's strip and chart at 500px, the share preview's corners, every theme. On the board: the weekday letters over their columns, Saturday on the right, the cells ahead of today, the tooltips, the summary, and the narrowest 4x3 (a window under 900px), where the titles get short. On the panel: the two-tier rows and their hover, the stretched cells and the check inside them, the summary strip, the skeleton against the loaded rows.
