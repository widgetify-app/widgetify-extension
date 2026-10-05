# Todos widget

The signed-in user's tasks from the server. Three sizes: 2x1, 2x3, and a 4x3 board for PRO.

## Files

| Path | Holds |
|---|---|
| `todos.widget.tsx` | Entry. Owns the query, filters, the header, the "reload" item of the widget menu and the task form modal for 2x1 and 2x3. Picks the variant by size. The modal's open state and its task are separate (`isFormOpen`, `formTodo`), so a closing modal keeps the task it showed instead of turning into «تسک جدید» mid-animation. The board's inline editor has its own `editingTodo`. |
| `variants/todo-2x1.tsx` | Header, then one task: a check that works both ways, its due day and place («۲ از ۵»), and `CompactPager` to move through the list. Clicking the task opens the modal, where it can be edited or deleted. Starts on the first open task; finishing one moves to the next open one; the down arrow at the end loads the next page. |
| `variants/todo-2x3.tsx` | The list: header and `TodoListBody` (signed out, loading, error, empty, rows). Adding and editing open the modal. `TodoListProps` is shared with the board. |
| `variants/todo-4x3.tsx` | The same list beside `BoardSummary`: percent ring, done, pending, important. Keeps the inline composer for adding and editing. |
| `components/todo-check.tsx` | The round check every size uses: the priority ring, filled when done. A button with `aria-pressed` and a label naming the task. |
| `components/todo-item.tsx` | One row. `TodoCheck`, text, due label. Edit and delete replace the due label on row hover or focus. Clicking the text expands description, date, category, priority and friends. |
| `components/todo-filter-menu.tsx` | `TodoFilterMenu`, the header filter button and its popover (time, label, order). `TodoFilterChip`, the active filter beside the title. |
| `components/todo-form-modal.tsx` | Add, edit or delete a task in a modal: title, description, date, category, priority, and friends when adding. Editing leaves the friends alone. A friend's task opens read only, with delete. |
| `components/todo-form-tools.tsx` | The date and category dropdowns, shared by the modal and the composer. The category one searches, creates a new label, clears the task's label, and removes a label from every task after a confirmation. |
| `components/expandable-todo-input.tsx` | The inline composer of the 4x3 board. A faint "تسک جدید" row that grows into a card with description, date, category, priority, friends and the save button. One input element lives through both states, so edit mode can fill it. It builds its request like the modal: an edit sends `category: ''` to clear a label and never sends `friendIds`. |
| `components/todo-composer-tool.tsx` | The small pill used as every composer trigger. |
| `components/priority-dropdown.tsx`, `components/select-friends.tsx` | Composer pickers. |
| `components/todo-empty.tsx` | `TodosEmpty` and `TodosSignedOut`, both through `WidgetEmpty`. |
| `components/todo-skeleton.tsx` | A row-shaped skeleton. |
| `utils/todo-due-label.ts` | "امروز", "فردا" or the Jalali day and month. Tested. |
| `utils/todo-summary.ts` | The header info. Tested. |
| `utils/current-task-index.ts` | Which task the 2x1 shows and where it goes after one is finished. Tested. |
| `utils/resolve-is-done.ts` | Done for the owner, or the user's own progress on a shared task. Tested. |
| `utils/tag-options.ts` | Label clean up, search and the «ساختن» suggestion. Tested. |
| `utils/parse-date.ts`, `utils/sort-todos.ts`, `utils/todo-due-date.ts` | Date parsing, client sort, due date payload. Tested. |
| `hooks/use-todo-filters.ts` | Date filter and sort, persisted; tag filter in memory. |

## Labels

A label is only the `category` text of a task; the server lists the ones in use and has no label of its own. A new label exists once a saved task carries it. Removing one clears it from each of the user's own tasks, so it drops out of the list; tasks shared by a friend keep theirs. Saving a task with a category refreshes the list, and a tag filter whose label is gone falls back to «همه».

## Data and storage

- Server: `useGetTodos` pages of 5 (10 on the board) with `totals` on every page. Writes go through the todo hooks in `src/services/todo`.
- Storage: `todoFilter` and `todoSort`. Old filter values pass through `LEGACY_DATE_FILTERS`.

## Layout

Every size is the same frame: `WidgetContainer` padding from the registry (`px-3 py-2.5 gap-1.5` at 2x1, `p-3 gap-2` otherwise), then `WidgetHeader`, then the body.

- A task is one row in every size: `px-2`, `gap-2.5`, `min-h-8.5`, `rounded-xl`, `hover:bg-fill`, a 16px `TodoCheck`, the text in `text-xs`. 2x1 shows one such row with a second line and the arrows beside it.
- The empty and signed-out states of 2x1 are `WidgetCompactEmpty`, shared with habits; the loading row starts at the same `px-2` as a task.
- Dropdown panels in the form set only their padding; `Dropdown` gives the surface, the radius and the shadow.

## Header and menu

- Always: the title (or the yadkar tabs) and the summary. The board also shows the active filter as a chip; the smaller sizes only fill the filter icon.
- On hover or keyboard focus: «تسک جدید» (2x1 and 2x3), the filter button and ⋯. The summary fades out so they take its place.
- Menu actions: "بارگذاری مجدد".
- The summary reads "2 از 5 انجام شده" only when every task is loaded and no filter is on. Otherwise it gives the server total, "12 تسک", because the done count of an unloaded page is unknown.

## States

Signed out, loading, error and empty are separate screens. Signed out hides the composer and the filter.

## Design decisions

- Reload lives in the menu only.
- Adding and editing take a modal at 2x1 and 2x3, where the growing composer took too much of the widget. The 4x3 board keeps the composer.
- The filter is one popover in every size. The board lost its row of date chips.
- Done tasks show no due label.
- The filter's options read «انجام‌شده», «انجام‌نشده» and «اول مهم‌ها», the board's column «انجام‌نشده», and a priority «کم‌اهمیت» everywhere. A category is called «برچسب» everywhere, as in the form.
- Deleting from a row asks «این تسک حذف بشه؟» with «حذف» and «نه», like notes; the modal asks in place.

## Not checked on screen

Everything visual: the hover reveal, the filter popover position, the task modal and its dropdowns over the modal, the 2x1 header with four buttons, the 2x1 arrows and edit and delete, the composer on the 4x3 board, the 4x3 summary column.
