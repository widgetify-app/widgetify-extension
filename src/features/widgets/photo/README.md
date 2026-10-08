# Photo widget

One picture on the canvas: the user's own upload (PRO) or one from the Widgetify gallery. 1x1 (PRO), 2x1, 2x2 and 2x4.

## Files

| Path | Holds |
|---|---|
| `photo.widget.tsx` | Entry. The frame, the picture or the empty state, the upload, the gallery modal, the menu actions, and the glass ⋯ over a picture. |
| `constants.ts` | `PHOTO_PLACEHOLDER_SRC`, the sample picture the 2x2 empty frame shows. |
| `components/photo-empty-state.tsx` | No picture yet, or one that failed to load: the header «قاب عکس» and both sources at every size. |
| `utils/get-photo-file-error.ts` | Rejects a file that is not an image. Tested. |

## Data

The widget `meta` holds `imageSrc` and `isCustom` (true for an upload). An upload goes through `uploadWidgetMediaApi` and saves the returned URL. A custom picture follows blur mode.

## Menu

The picture itself does nothing on click. The shared menu has «عکس از دستگاه» (PRO badge for free users, who are sent to the PRO page), «انتخاب از گالری», and «برداشتن عکس» when there is one. All three are disabled during an upload. Those actions and upload failures each fire an analytics event name through `@/analytics`.

## Frame and states

- A picture fills the frame edge to edge with no surface under it, and the ⋯ is the dark glass button in its corner.
- An empty frame is a normal widget: the tasks frame (`px-3 py-2.5` at 1x1, `px-3 py-2.5 gap-1.5` at 2x1, `p-3 gap-2` above) and a header titled «قاب عکس» that holds the ⋯.
- Empty, 1x1 and 2x1: two tiles under the header, «از دستگاه» and «گالری». At 2x1 the device tile carries the PRO diamond for free users; 1x1 is PRO only, so it never needs one.
- Empty, 2x2 and 2x4: «یه عکس بذار اینجا» with «از دستگاه» and «گالری». 2x4 adds a line under the title. 2x2 swaps the icon and the title for the sample picture (`PHOTO_PLACEHOLDER_SRC`, cropped to fill the space between the header and the buttons), so the content still fits under the header at 80 px rows. The failed state keeps the alert icon at 2x2.
- Failed: the same screen, with «عکس باز نشد» as the 1x1 header's title, the 2x1 header's info, and the larger sizes' title.
- Uploading: a spinner over the frame with «دارم آپلودش می‌کنم…».

## Design decisions

- The small sizes used to open only the gallery. They now offer the device too, on the widget itself.
- The old sample picture was dropped for an icon. At 2x2 only, the picture is back as a placeholder, because the larger frame has room for it and a picture tells the user what the widget is for.

## Not checked on screen

Every size with and without a picture, the two tiles at 1x1 and 2x1 and the PRO diamond at 2x1 for a free account, the 2x2 empty state with the sample picture at the narrowest rows and with the image blocked, the glass ⋯ over bright and dark pictures, the failed state (point `imageSrc` at a dead URL), the upload overlay, blur mode on a custom picture.
