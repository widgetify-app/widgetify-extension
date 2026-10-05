# Habits widget

Daily, weekly and monthly habits with a one-click log. Sizes 2x1 and 2x3. Signed-in only.

## Files

| Path | Holds |
|---|---|
| `habit.widget.tsx` | Entry. `HabitsContent` owns the header, the menu and the modals for both sizes; yadkar uses it with its tabs. `HabitsLayout` picks the size and the frame padding. |
| `hooks/use-habit-actions.ts` | Query, modal state, delete, refresh. |
| `variants/habit-2x3.tsx` | The list and its four states. |
| `variants/habit-2x1.tsx` | One habit at a time, stepped with `CompactPager` like tasks 2x1. |
| `components/item/habit-item.tsx` | One row: log button, title, today's progress, seven-day history. |
| `components/item/habit-log-button.tsx` | The 32px ring that logs one step. Filled with the habit colour once today is done. Shared by both sizes. |
| `components/item/button-progress-ring.tsx`, `components/item/button-simple-progress-ring.tsx` | Segmented ring up to six steps, a plain ring above that. |
| `components/habit-empty.tsx` | `HabitEmpty` and `HabitSignedOut`. |
| `components/habit-modals.tsx` | The form and the detail modal. |
| `components/habit-detail-modal/` | The detail modal: goal, the four stats, the six-month chart, and delete, edit and share. |
| `components/habit-share-modal.tsx` | The share image with copy and download. |
| `utils/habit-goal.ts` | Goal text, today's text (`formatHabitToday`), `isHabitDoneToday`. Tested. |
| `utils/habit-step.ts`, `utils/habit-stats.ts` | Log step size and the detail statistics (streak, best streak, successful days). Tested. |
| `utils/render-habit-share-canvas.ts` | Draws the share image at 800×520. The modal sets its display size. |

## Layout

The same as tasks and notes. The frame is `p-3 gap-2` (`px-3 py-2.5 gap-1.5` at 2x1), then a `h-7` header.

- A 2x3 row is `px-2 gap-2.5 rounded-xl hover:bg-fill`, rows `gap-0.5` apart. The log ring is 32px where a task has its 16px check, because it carries the emoji and the step segments. The history ends at the row's `px-2`.
- The 2x1 row fills the body: ring, title, then "today · ۲ از ۴", then the pager.
- A row lights up for keyboard focus only (`useKeyboardFocusWithin`), so clicking the ring does not leave it highlighted.

## Header and menu

- Always: the title (or the yadkar tabs) and "1 از 4 امروز".
- On hover: "عادت جدید" (signed in only) and ⋯.
- Menu actions in both sizes: "بارگذاری مجدد".

## Detail modal

Built like the task modal: `size="lg"`, the habit's name as the modal title, then:

1. The emoji on a tint of the habit colour, the goal, and today's progress.
2. Three stats in one strip: «پشت‌سرهم» (the current streak), «بهترین رکورد» and «روزهای موفق», the same words as the share image.
3. "۶ ماه اخیر" with its legend, the day grid, and a line that names the hovered day or says how to log.
4. Delete on the start side, then edit and "اشتراک‌گذاری تصویر" as the main button. Delete asks in place, like a task.

The share modal is also `lg`: the image at full width, then "کپی تصویر" and "دانلود تصویر".

Both modals stay mounted and only toggle `isOpen`; the detail keeps its last habit id after closing (`isDetailOpen` is separate), and closing the form keeps `editingHabit`. Mounting the detail only while a habit was chosen skipped daisyUI's open and close animation, and clearing the habit on close turned the edit form into «عادت جدید» while it faded out. The share modal mounts once the habit has loaded, for the same reason.

Editing from the detail modal opens the form on top. Saving invalidates the habit's detail query in `useUpdateHabit`, so the detail modal shows the new name and goal as soon as the form closes.

## States

Signed out, loading, error and empty are separate screens. The 2x1 draws them with `WidgetCompactEmpty`, the same as tasks.

## Design decisions

- Adding is on the widget (the header's +), so the menu keeps only reload.
- The 2x1 has a header and the tasks pager instead of a dot row and a floating ⋯.
- The detail modal lost its title dropdown; edit and delete sit in the footer where the task modal has them.
- The success rate is gone. It divided the successful days by every day since the first log, which says little, least of all for a habit that is not daily.
- The form's subtitle «از یه الگو شروع کن یا خودت بساز» shows only when adding, since editing has no templates.
- The share modal was 4xl wide for an 800px image. It is now as wide as the other modals and the image scales down.
- The analytics names `habit_quick_log` and `habit_quick_log_wide` are sent by the callers, so `data-names.test.ts` can find them.

## Not checked on screen

The rings and the emoji inside them, the history squares, the 2x1 pager, the detail modal's strip and chart at 500px, the share preview's corners, every theme.
