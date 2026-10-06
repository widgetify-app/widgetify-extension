# Mood tracker widget

Log today's mood in one click: sad, tired, okay or great. 1x1 and 2x1. Needs an account; a signed-out click opens the sign-in prompt.

## Files

| Path | Holds |
|---|---|
| `mood-tracker.widget.tsx` | Entry. Today's mood (with an optimistic value while saving), the save, the share action in the menu and the share modal. |
| `variants/mood-tracker-2x1.tsx` | A small header («امروز چه حسی داری؟», or «حال امروز» and «ثبت شد») with the ⋯, then four labelled tiles. |
| `variants/mood-tracker-1x1.tsx` | Today's mood or «حس امروزت؟», its picture, and a strip of four small buttons. |
| `constants.ts` | The colours of a selected tile. |
| `components/mood-share-modal.tsx`, `utils/render-mood-share-canvas.ts` | The monthly share image. |

## Data

`useGetMoods` for the last seven days, `useUpsertMoodLog` to save. Clicking the logged mood again removes it. The toasts say «حالت ثبت شد» and «حالت پاک شد». The mood list and pictures are shared with the calendar and the navbar (`src/common/constants/moods.ts`).

## Menu

«اشتراک‌گذاری ماه» opens the share modal. The ⋯ sits in the 2x1 header and floats at 1x1; the widget's old menu of its own is gone. There are no settings.

## Design decisions

- A selected tile is tinted in its mood's colour with a thin ring of the same colour. The design uses a softer ring; the theme tokens have no half-strength version of these colours, so the ring is the full colour.
- The okay mood is brand coloured, as in the design. It was the secondary colour.
- The share modal is laid out like the task and habit modals: a plain title, the image, then "کپی تصویر" and "دانلود تصویر". The image is portrait, so the modal stays `md` and the preview is capped at 60vh. A failed report shows an error with a retry; it used to show an empty canvas whose download was blank.

## Not checked on screen

Both sizes at every density (the 2x1 tiles are tight at the smallest), each selected mood in light and dark, the ⋯ in the 2x1 header, the share item, the share modal's preview and its error state.
