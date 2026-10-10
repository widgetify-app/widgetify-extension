# Todos widget

The signed-in user's tasks from the server. Four sizes: 2x1, 2x3, and two PRO sizes, the 4x3 board and the 2x6 panel.

## Files

| Path | Holds |
|---|---|
| `todos.widget.tsx` | Entry. Owns the query, filters, the header and the "reload" item of the widget menu. Picks the variant by size. The 2x1 adds and edits in the task form modal; its open state and its task are separate (`isFormOpen`, `formTodo`), so a closing modal keeps the task it showed instead of turning into «تسک جدید» mid-animation. Every other size adds and edits in the composer, through `editingTodo`. |
| `variants/todo-2x1.tsx` | Header, then one task: a check that works both ways, its due day and place («۲ از ۵»), and `CompactPager` to move through the list. Clicking the task opens the modal, where it can be edited or deleted. Starts on the first open task; finishing one moves to the next open one; the down arrow at the end loads the next page. |
| `variants/todo-2x3.tsx` | The list: header and `TodoListColumn`, which is `TodoListBody` (loading, error, empty, rows) with the composer under it. `TodoListProps` and `TodoListColumn` are shared with the board. |
| `variants/todo-4x3.tsx` | `TodoBoard`: `TodoListColumn` and `BoardSummary` (percent ring, done, pending, important). `layout="board"` (4x3) puts the summary beside the list; `layout="panel"` (2x6) stacks it above. Yadkar shows both, so two boards can share a page; the composer's input carries no fixed `id`. |
| `components/todo-check.tsx` | The round check every size uses: the priority ring, filled when done. A button with `aria-pressed` and a label naming the task. |
| `components/todo-item.tsx` | One row. `TodoCheck`, text, due label. Edit and delete replace the due label on row hover or focus. Clicking the text expands description, date, category and priority. |
| `components/todo-filter-menu.tsx` | `TodoFilterMenu`, the header filter button and its popover (time, label, order). `TodoFilterChips`, one chip for each filter that is on, beside the board's title; a chip's × turns its filter off. |
| `components/todo-form-modal.tsx` | The 2x1's modal: add, edit or delete a task with title, description, date, category and priority. |
| `components/todo-form-tools.tsx` | The date and category dropdowns, shared by the modal and the composer. The category one searches, creates a new label, clears the task's label, and removes a label from every task after a confirmation. |
| `components/expandable-todo-input.tsx` | The composer of the 2x3, the board and the panel. A faint "تسک جدید" row that grows into a card with description, date, category, priority and the save button. One input element lives through both states, so edit mode can fill it. It builds its request like the modal: an edit sends `category: ''` to clear a label. Its tool row wraps, and the save group keeps to the row's end with `ms-auto`, so a 2-column widget moves save to a second line instead of pushing it out of the card. Signed out, it still shows; saving opens the profile to sign in. |
| `components/todo-composer-tool.tsx` | The small pill used as every composer trigger. |
| `components/priority-dropdown.tsx` | The composer's priority picker. |
| `components/todo-empty.tsx` | `TodosEmpty`, through `WidgetEmpty`: «هنوز تسکی نداری» and a line that points at the composer below. |
| `components/todo-skeleton.tsx` | A row-shaped skeleton. |
| `utils/active-filters.ts` | Which filters are on, in the order time, label, order, each with its label. The filter button lights up from it and the board draws its chips from it. Tested. |
| `utils/todo-due-label.ts` | "امروز", "فردا" or the Jalali day and month. Tested. |
| `utils/todo-summary.ts` | The header info. Tested. |
| `utils/current-task-index.ts` | Which task the 2x1 shows and where it goes after one is finished. Tested. |
| `utils/tag-options.ts` | Label clean up, search and the «ساختن» suggestion. Tested. |
| `utils/parse-date.ts`, `utils/sort-todos.ts`, `utils/todo-due-date.ts` | Date parsing, client sort, due date payload. Tested. |
| `hooks/use-todo-filters.ts` | Date filter and sort, persisted; tag filter in memory. |

## Labels

A label is only the `category` text of a task; the server lists the ones in use and has no label of its own. A new label exists once a saved task carries it. Removing one clears it from every task that carries it, so it drops out of the list. Saving a task with a category refreshes the list, and a tag filter whose label is gone falls back to «همه».

## Data and storage

- Server: `useGetTodos` pages of 5 (10 on the board and the panel) with `totals` on every page. Writes go through the todo hooks in `src/services/todo`.
- Storage: `todoFilter` and `todoSort`. Old filter values pass through `LEGACY_DATE_FILTERS`. The 2x1 also saves which task it shows under `compactPager:todos`, through `useCompactPagerState`; a saved task that is gone, or on a page that is not loaded, is dropped and the 2x1 starts on the first open task.
- «امروز» and «این ماه» go to the server as `dateFilter`; the server picks the dates. See "Known issue".

## Layout

Every size is the same frame: `WidgetContainer` padding from the registry (`px-3 py-2.5 gap-1.5` at 2x1, `p-3 gap-2` otherwise), then `WidgetHeader`, then the body.

- A task is one row in every size: `px-2`, `gap-2.5`, `min-h-8.5`, `rounded-xl`, `hover:bg-fill`, a 16px `TodoCheck`, the text in `text-xs`. 2x1 shows one such row with a second line and the arrows beside it.
- The empty state of 2x1 is `WidgetCompactEmpty`, shared with habits; the loading row starts at the same `px-2` as a task.
- The 2x3 is the list with the composer at its bottom, `gap-1.5` apart. The board puts `BoardSummary` beside that column (`w-37.5`, `border-s ps-3.5`). The panel is the same board stacked: the summary on top (`placement="top"`: a 60px ring, the three counts beside it, `border-b pb-3`), then the column. At 2 columns wide the 2x3 and the panel have 184 to 270px for content, depending on the canvas.
- The board's chips sit in a row that scrolls sideways when they outgrow the header, so they never run under the buttons.
- Dropdown panels in the form set only their padding; `Dropdown` gives the surface, the radius and the shadow.

## Header and menu

- Always: the title (or the yadkar tabs) and the summary. The board also shows a chip for each filter that is on: time, label and order. The other sizes only fill the filter icon.
- On hover or keyboard focus: «تسک جدید» (2x1 only; the other sizes add through the composer), the filter button and ⋯. The summary fades out so they take its place.
- Menu actions: «به‌روز کن».
- The summary reads "2 از 5 انجام شده" only when every task is loaded and no filter is on. Otherwise it gives the server total, "12 تسک", because the done count of an unloaded page is unknown.

## States

Loading, error and empty are separate screens. Only the 2x1 has a signed-out screen («تسک‌هات توی حسابته» with «ورود»). The other sizes show the empty state and the composer to a signed-out user, and saving opens the profile. Signed out hides the filter in every size.

## Design decisions

- Reload lives in the menu only.
- Every size but the 2x1 adds and edits in the composer, inside the widget. The 2x1 has room for one row, so it keeps the modal.
- The panel is the board turned upright, not a taller list: it shows the same summary, page size and composer, and what sits beside the list on the board sits above it.
- The filter is one popover in every size. The board lost its row of date chips, and its header shows every active filter as a chip; it used to show only the first, time before label, and never the order.
- Done tasks show no due label.
- The filter's options read «انجام‌شده», «انجام‌نشده» and «اول مهم‌ها», the board's column «انجام‌نشده», and a priority «کم‌اهمیت» everywhere. A category is called «برچسب» everywhere, as in the form.
- Deleting from a row asks «این تسک حذف بشه؟» with «حذف» and «نه», like notes; the modal asks in place. Either way a delete ends with «تسک حذف شد», like habits, and the toast's sound.
- Tasks have no friends. Sharing a task with friends was removed from the app and the backend: no picker, no avatars, no read-only task, and `POST /todos` takes no `friendIds`.

## Known issue

«این ماه» shows tasks from the start of the next Jalali month and drops the first days of this one. The app sends only `dateFilter=this_month` and does no date math of its own, so the server picks the range. The symptom fits a Gregorian month: on 18 Mehr 1405 that is October, 9 Mehr to 9 Aban, where the user expects 1 to 30 Mehr. The fix belongs in the backend, which should read `this_month` as the solar Hijri month in Tehran time, as `.github/Api-doc.md` now says.

## Not checked on screen

Everything visual: the hover reveal, the filter popover position, the 2x1 modal and its dropdowns over the modal, the 2x1 header with four buttons, the 2x1 arrows and edit and delete. The composer on the 2x3, the board and the panel: growing into its card, save wrapping to a second line, editing a row in it, and a signed-out user saving. The board's chips with three filters on, under yadkar's tabs, and at the narrowest 4x3. On the panel: the summary strip at the narrowest canvas and a long list scrolling under it.
