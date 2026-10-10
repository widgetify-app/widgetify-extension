# Notes widget

Notes kept locally and synced for signed-in users. Four variants: a list (2x3), a sticky note (2x2, PRO), a notebook (4x3, PRO) and a panel (2x6, PRO).

## Files

| Path | Holds |
|---|---|
| `notes.widget.tsx` | Entry. Wraps `NotesProvider` and picks the variant with `resolveNotesVariant`. Takes `tabs` from yadkar. |
| `notes.context.tsx` | `NotesProvider`: local copy in storage, server sync, debounced saves, create and delete. |
| `variants/note-list.tsx` | The list and the editor. Owns the header, the reload action and the delete confirmation for a row or the open note. |
| `variants/note-board.tsx` | The notebook (also yadkar's notes tab at 4x3 and 2x6, with the tabs as its title), with the header, the reload action and the delete confirmation. Opens on the last note picked, or the first. `layout="board"` (4x3) puts the list on the start side and the open note beside it; `layout="panel"` (2x6) puts the list on top and the open note under it. |
| `variants/note-sticky.tsx` | One note on a coloured card. The header says «یادداشت», the widget's name, like every other widget; the note's own title is the first line of the card. Delete and new note in the header; on hover the colours and the pager lie over the bottom of the text. |
| `components/note-item.tsx` | One row: priority dot, title, one line of body, date. On hover or keyboard focus the date gives way to edit and delete; edit shows only when the list passes `onEdit`, since picking a row on the notebook already opens it. `isSelected` marks the notebook's open note. |
| `components/note-editor.tsx` | `NoteFields`, colour swatches and the save button. |
| `components/note-board-editor.tsx` | The notebook's open note. Saves as you type, like the sticky card, through `updateNote`. Its footer: colours, then the word count and the last edit («۴۲ کلمه · ۱۳ مهر», or «در حال ذخیره…»), then delete. Keyed by the note, so picking another one starts fresh. It focuses the title only for a note just made with +, never on load, so a new tab does not lose its address bar focus to an empty note. `placement` says where its divider goes: `side` on the board, `bottom` in the panel. |
| `components/note-fields.tsx` | The title line and the body, shared by the editor and the sticky card so both are spaced alike; `tone="onColor"` follows a coloured card. |
| `components/note-color-picker.tsx` | The four swatches: default, red, yellow, green. Used by the editor and the sticky card. The chosen one carries a check, like a done task. On a coloured card (`tone="onColor"`) every swatch has a thin ring in the card's text colour, so the swatch of the card's own colour still shows. |
| `components/note-empty.tsx`, `components/note-skeleton.tsx` | Empty and loading states. |
| `utils/resolve-notes-variant.ts` | Which variant a widget is: the stored `meta.variant` when it is one of the four, else the size (2x2 sticky, 4x3 notebook, 2x6 panel, anything else the list). Tested. |
| `utils/count-words.ts` | The notebook's word count. Tested. |
| `utils/normalize-notes.ts` | Every note that enters `NotesProvider`, from storage, another tab, the fetch or a save reply, passes through it: a `null` title or body becomes `''`, a `null` priority no colour, an entry without an id is dropped. Tested. |
| `constants.ts` | Sticky colours, priority colours, swatch order. |

## Layout

The same as tasks: the frame is `p-3 gap-2` (the sticky card draws its own), then a `h-7` header, then the body inset `px-2` from the header title.

- A list row is `p-2 gap-2.5 rounded-xl hover:bg-fill`; its dot sits in a 16px slot, the width of a task's check, so text starts where a task's does. The date and the hover buttons end at `pe-2`.
- The editor and the sticky card share `NoteFields` (`px-2`, a `h-6` bold title, the body below); their footers are `px-2` too.
- The notebook's body is two panes, `gap-3`: the list `w-52`, then the open note with `border-s border-line ps-3.5`, the same divider as the tasks board's summary. The note's fields drop their `px-2`, since the divider is their edge.
- The panel stacks the same two panes. The list takes what its rows need, up to `max-h-[40%]` of the body, and scrolls past that; the open note gets the rest, under a `border-t border-line pt-3` divider. With 12 notes at the usual 2x6 that is a 222px list and a 322px note; with 2 notes, a 94px list and a 450px note. The note keeps its fields' `px-2` and the footer starts at `ps-2`, so the colours line up with the title and delete sits on the end edge under the header's ⋯.
- The sticky footer is absolute at the frame's bottom padding, so the text runs to the bottom of the card. On hover `widget-control-fade` fades the strip under the footer, and the body's `pb-10 scroll-pb-10` lets the last line scroll, and the caret stay, above it.

## Data and storage

- Storage: `notes_data`, the whole list, watched so every notes widget stays in step.
- Widget `meta`: `variant` (`list`, `sticky`, `board` or `panel`; the values are data), and `activeNoteId` for the sticky note.
- A note's colour is its `priority` on the server (`low`, `medium`, `high`).
- The server can send a note with `body: null` though `FetchedNote` says `string`. The notebook trusted the type and crashed on `countWords(null)`; the other views happened to guard. `normalizeNotes` makes the type true at the door instead of each view guarding.

## Header and menu

| Where | Header on hover | Menu actions |
|---|---|---|
| List | "یادداشت جدید", ⋯ | به‌روز کن |
| Editor | "حذف این یادداشت", ⋯; the back button is always visible | به‌روز کن |
| Sticky | "حذف این یادداشت", "یادداشت جدید", ⋯ | به‌روز کن |
| Notebook and panel | "یادداشت جدید", ⋯; delete sits in the open note's footer | به‌روز کن |

The header shows "در حال ذخیره…" beside the title while a save runs, in both the editor and the sticky card, because the info slot hides on hover and while you type.

On a coloured sticky the header uses `tone="onColor"`, so its text and buttons follow the card's own text colour.

## Design decisions

- Everything a note needs is on the widget itself: new, delete and colours. The menu keeps only what is not, «به‌روز کن». Deleting always asks first: «این یادداشت حذف بشه؟» with «حذف» and «نه», the same as a task row, and ends with «یادداشت حذف شد» from `NotesProvider`, like tasks and habits. Without a `title` and `confirmText`, `ConfirmationModal` fell back to «تایید عملیات» and «تایید».
- A row no longer expands to show the whole body on hover; it crowded the list. Opening the note shows it. `note_toggle_expand` is no longer sent.
- The notebook is the list and the editor side by side, so a note opens without leaving the list and the list shows each edit as you type. It saves as you type, like the sticky card, instead of the list editor's save button: there is no screen to leave.
- The panel is the notebook turned upright, so it shares the notebook's code and behaviour: picking a row opens it below, and the note saves as you type. A list that opens a note in place, like the 2x3, would hide the list in the one size tall enough to show both.
- The panel caps the list at 40% so the open note always has room to write in, however many notes there are.
- The notebook gives `NoteFields` no title debounce. The body already saves on every keystroke and `updateNote` debounces the server call, so a debounced title could only lose the last keystrokes when the pane unmounts.
- The sticky footer lies over the text instead of reserving a row. A reserved row cut 30px off a short card for controls that show only on hover. The fade is a mask, not a background, because the default card is glass and no solid colour matches it.

## Known issue

Picking the default colour does not reach the server. `updateNote` sends `priority` only when it is set, so the server keeps the old colour and the save's reply, half a second later, puts it back on the card. This predates the redesign. The API doc lists `priority` as `low`, `medium` or `high` and says nothing about clearing it, so the fix waits on what the backend accepts (`null`, or an empty value).

## Not checked on screen

The sticky colours in every theme, the header on a coloured card, the pager and the fade under it, the caret at the end of a long sticky note, the editor footer, the yadkar notes tab, the notebook's two panes at the narrowest 4x3 (a window under 900px), its footer line and the delete button there. On the panel: the list cap with many notes, the divider and the note under it, the footer's colours, word count and delete at the narrowest canvas, and the panel's preview in the catalog.
