# General settings tab

The «عمومی» tab of the settings dialog (`src/features/setting/general/general.tsx`) felt too crowded: five stacked sections, each with its own title and divider.

**Status:** option A approved by the owner (no divider lines anywhere) and built; rejected options B and C stay on the canvas.

## Board

| File | Shows |
|---|---|
| `board.html` | The approved option A: two small group titles, rows with no dividers, quiet storage block |

## Notes

- The push switch card stays. It only exists for a signed in user on Chrome or Edge, so every option must also look complete without it.
- City keeps opening the city modal and the time zone keeps its `SelectBox`; only their layout changes.
- Rows are 56px or taller. Cards use `surface-2` with a `surface-3` border and `rounded-2xl`, no shadow. Nothing overlaps content, so no glass check beyond the normal tab.
- Copy is a draft until approved: the shortened lite mode hint and the push hint. The «جدید» badge next to storage is dropped in the board.
- The tab title section named in the brief is no longer on this tab; it lives in Appearance.
- Privacy and shortcuts reuse option A (board sections «حریم خصوصی» and «میانبرها»), waiting for approval. Group titles «داده‌ها و آمار», «دسترسی به مرورگر» and «دیده شدن» are drafts. The hints on the board are shortened drafts of the catalog text.
- Appearance, wallpapers and about are not in this pass: they are built from the market pickers and cards, not rows.
