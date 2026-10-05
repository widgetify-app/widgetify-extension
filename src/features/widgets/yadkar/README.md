# Yadkar widget

Tasks, notes and habits in one 2x3 widget.

## Files

| Path | Holds |
|---|---|
| `yadkar.widget.tsx` | Entry. Builds the tabs and hands them to the active view as its header title. |
| `constants.ts` | The tab list and labels: «تسک», «یادداشت», «عادت». |
| `types.ts` | `YadkarTab` and the `yadkar_tab` storage key. |
| `utils/normalize-yadkar-tab.ts` | Reads the stored tab, maps `rabbit` to `habits`. Tested. |

## How it fits together

The tabs sit inside each view's own header, through the `tabs` prop of `TodosLayout`, `NotesLayout` and `HabitsContent`. So each tab keeps the hover buttons and menu actions of its standalone widget, and the summary gets shorter ("12 تسک" rather than "2 از 5 انجام شده").

Opening a note replaces the tabs with the editor's back button until you return to the list.

The labels are singular to fit. The header keeps room for the widest set of hover buttons, and the tasks tab has three (+, filter, ⋯). With «تسک‌ها» and «عادت‌ها» at a usual 2x3 width, that cut the end off «عادت‌ها»; the singular labels free about 22px.

## Storage

`yadkar_tab` holds the last tab. The id is data.

## Not checked on screen

The three tabs at 2x3 on the tasks tab at the narrowest canvas (a window under 900px wide), the shorter summaries, switching tabs with a menu open.
