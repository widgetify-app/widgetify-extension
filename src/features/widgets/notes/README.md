# Notes widget

Notes kept locally and synced for signed-in users. Two variants: a list (2x3) and a sticky note (2x2, PRO).

## Files

| Path | Holds |
|---|---|
| `notes.widget.tsx` | Entry. Wraps `NotesProvider` and picks the variant with `isStickyVariant`. Takes `tabs` from yadkar. |
| `notes.context.tsx` | `NotesProvider`: local copy in storage, server sync, debounced saves, create and delete. |
| `variants/note-list.tsx` | The list and the editor. Owns the header, the reload action and the delete confirmation for a row or the open note. |
| `variants/note-sticky.tsx` | One note on a coloured card. The header says «یادداشت», the widget's name, like every other widget; the note's own title is the first line of the card. Delete and new note in the header; on hover the colours and the pager lie over the bottom of the text. |
| `components/note-item.tsx` | One row: priority dot, title, one line of body, date. On hover or keyboard focus the date gives way to edit and delete. |
| `components/note-editor.tsx` | `NoteFields`, colour swatches and the save button. |
| `components/note-fields.tsx` | The title line and the body, shared by the editor and the sticky card so both are spaced alike; `tone="onColor"` follows a coloured card. |
| `components/note-color-picker.tsx` | The four swatches: default, red, yellow, green. Used by the editor and the sticky card. The chosen one carries a check, like a done task. On a coloured card (`tone="onColor"`) every swatch has a thin ring in the card's text colour, so the swatch of the card's own colour still shows. |
| `components/note-empty.tsx`, `components/note-skeleton.tsx` | Empty and loading states. |
| `utils/is-sticky-variant.ts` | Which variant a widget is. Tested. |
| `constants.ts` | Sticky colours, priority colours, swatch order. |

## Layout

The same as tasks: the frame is `p-3 gap-2` (the sticky card draws its own), then a `h-7` header, then the body inset `px-2` from the header title.

- A list row is `p-2 gap-2.5 rounded-xl hover:bg-fill`; its dot sits in a 16px slot, the width of a task's check, so text starts where a task's does. The date and the hover buttons end at `pe-2`.
- The editor and the sticky card share `NoteFields` (`px-2`, a `h-6` bold title, the body below); their footers are `px-2` too.
- The sticky footer is absolute at the frame's bottom padding, so the text runs to the bottom of the card. On hover `widget-control-fade` fades the strip under the footer, and the body's `pb-10 scroll-pb-10` lets the last line scroll, and the caret stay, above it.

## Data and storage

- Storage: `notes_data`, the whole list, watched so every notes widget stays in step.
- Widget `meta`: `variant`, and `activeNoteId` for the sticky note.
- A note's colour is its `priority` on the server (`low`, `medium`, `high`).

## Header and menu

| Where | Header on hover | Menu actions |
|---|---|---|
| List | "یادداشت جدید", ⋯ | بارگذاری مجدد |
| Editor | "حذف این یادداشت", ⋯; the back button is always visible | بارگذاری مجدد |
| Sticky | "حذف این یادداشت", "یادداشت جدید", ⋯ | بارگذاری مجدد |

The header shows "در حال ذخیره…" beside the title while a save runs, in both the editor and the sticky card, because the info slot hides on hover and while you type.

On a coloured sticky the header uses `tone="onColor"`, so its text and buttons follow the card's own text colour.

## Design decisions

- Everything a note needs is on the widget itself: new, delete and colours. The menu keeps only what is not, reload. Deleting always asks first: «این یادداشت حذف بشه؟» with «حذف» and «نه», the same as a task row. Without a `title` and `confirmText`, `ConfirmationModal` fell back to «تایید عملیات» and «تایید».
- A row no longer expands to show the whole body on hover; it crowded the list. Opening the note shows it. `note_toggle_expand` is no longer sent.
- The sticky footer lies over the text instead of reserving a row. A reserved row cut 30px off a short card for controls that show only on hover. The fade is a mask, not a background, because the default card is glass and no solid colour matches it.

## Known issue

Picking the default colour does not reach the server. `updateNote` sends `priority` only when it is set, so the server keeps the old colour and the save's reply, half a second later, puts it back on the card. This predates the redesign. The API doc lists `priority` as `low`, `medium` or `high` and says nothing about clearing it, so the fix waits on what the backend accepts (`null`, or an empty value).

## Not checked on screen

The sticky colours in every theme, the header on a coloured card, the pager and the fade under it, the caret at the end of a long sticky note, the editor footer, the yadkar notes tab.
