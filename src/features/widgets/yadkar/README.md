# Yadkar widget

Tasks, notes and habits in one widget: 2x3, and two PRO sizes, the 4x3 board and the 2x6 panel.

## Files

| Path | Holds |
|---|---|
| `yadkar.widget.tsx` | Entry. Builds the tabs and hands them, with the widget's size, to the active view as its header title. |
| `constants.ts` | The tab list and labels: «تسک», «یادداشت», «عادت». |
| `types.ts` | `YadkarTab` and the `yadkar_tab` storage key. |
| `utils/normalize-yadkar-tab.ts` | Reads the stored tab, maps `rabbit` to `habits`. Tested. |

## How it fits together

The tabs sit inside each view's own header, through the `tabs` prop of `TodosLayout`, `NotesLayout` and `HabitsContent`. So each tab keeps the hover buttons and menu actions of its standalone widget, and the summary gets shorter ("12 تسک" rather than "2 از 5 انجام شده").

Opening a note replaces the tabs with the editor's back button until you return to the list.

At 4x3 each view picks its own board from the size it is given: the tasks board with its composer and summary, the notebook, and the habits week with its summary. At 2x6 each picks its panel, the same board stacked: the summary or the list on top, then the rest. Yadkar adds nothing of its own, so a board or a panel looks the same here as in its own widget, only with the tabs as its title. Both sizes are PRO in `allowedSizes`, like the boards and panels of the three widgets.

The labels are singular to fit. The header keeps room for the widest set of hover buttons, and the tasks tab has three (+, filter, ⋯). With «تسک‌ها» and «عادت‌ها» at a usual 2x3 width, that cut the end off «عادت‌ها»; the singular labels free about 22px. The 2x6 is as wide as the 2x3, and its tasks tab has one button fewer, since the panel adds through its composer.

## Storage

`yadkar_tab` holds the last tab. The id is data.

## Not checked on screen

The three tabs at 2x3 on the tasks tab at the narrowest canvas (a window under 900px wide), the shorter summaries, switching tabs with a menu open, each board at 4x3 and each panel at 2x6 under the tabs, resizing between 2x3, 2x6 and 4x3, the 4x3 and 2x6 lock for a free account.
