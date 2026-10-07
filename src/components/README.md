# components

Components that know the app but belong to no single feature. Primitives with no app knowledge live in `ui/` (see `ui/README.md`).

## What is here

| Folder or file | Holds |
|---|---|
| `ui/` | Presentational primitives |
| `gallery/` | Wallpaper, photo and icon pickers, behind the `@/components/gallery` barrel |
| `auth/` | The "sign in first" modal |
| `user-coin.tsx`, `mood-image.tsx`, `select-city.tsx` | Small shared pieces |

## Rules

- A file lives here only while **two or more unrelated areas** import it. Used from one area, it moves to that area. `architecture.test.ts` counts a feature, a page, a group under `components/` or a global folder as one area ("keep a global file only while two areas use it").
- Nothing here imports `features/` or `pages/`, type imports included. If it needs to, it belongs inside that feature, or the thing it reaches for belongs higher up.
- Reach `gallery` only through `@/components/gallery`, and `ui` only through `@/components/ui`.
- Check `ui/` first. If you are writing a button, a modal or a spinner here, stop.
- Colours, radius and motion follow `src/styles/README.md`. Text on a wallpaper or a photo uses the `image-*` and `scrim-*` tokens, because the theme says nothing about the pixels behind it.

## Adding one

1. Count who imports it. One area: put it in that area's `components/`.
2. Two or more: put it here, in a folder when it has several files.
3. Add no barrel. The only barrels are `@/components/ui`, `@/components/gallery` and `@/icons`.

## Mistakes that happened

- A card used from one feature sat here for months and made that feature look shared.
- `gallery-photo-item.tsx` hand-wrote `rgba(0,0,0,0.4)` over a picture. Use `scrim` and the other `image-*` tokens.
- An icon-only button lost its `Tooltip` and kept only a `title`. Give it an `aria-label`.

## Tests

None render a component. Logic worth testing goes into a pure file next to the component and is tested there (`ui/image-slider/slider-utils.ts` has one).
