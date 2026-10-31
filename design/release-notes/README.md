# Release notes

The window that opens once after an update (`src/features/release-notes/release-notes.tsx`), drawn for the «آبنبات چوبی» release.

**Status:** approved and built. The owner picked "A + C": the hero of option A with a list whose items carry the small previews of option C.

## Board

| File | Shows |
|---|---|
| `boards/ReleaseNotes.dc.html` | A 768px window: the lollipop hero with «آپدیت تازه» and «آبنبات چوبی رسید» over it; five changes in two columns, each with a 64×44 preview of the feature; «بزن بریم» at the end |

## Notes

- The previews are small markup drawings of the feature (an avatar with the Pro ring, a widget row with «جدید», store items, a price curve, widget sizes), not pictures and not icon tiles.
- The window has no title row and no close button. The wait countdown on the button stays; Escape still closes it.
- The pets block of the autumn notes and its store button are gone, with the `release_notes_link_clicked` event.
- The currency line first named one subscription service by its brand. It now says «قیمت اشتراک سرویس‌ها», on the board and in the code, because the hygiene test rejects assistant and tool names in the repo.
- The copy comes from the list of changes since v2.0.1. Change it for the next release in `src/common/i18n/fa/release-notes.ts`.

## Art

`assets/lollipop.webp` comes from `art/lollipop.py`, a PhotoCraft script that uses the helpers in `../pro-tab/art/common.py`. See `../pro-tab/README.md` for how to run it. The right half stays empty for the title. The same file is in `src/assets/images/release-notes/`.
