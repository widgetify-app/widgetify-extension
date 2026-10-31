# Design

Approved designs for UI work live here, one folder per feature. AGENTS.md section 2 requires one before you build any UI: you design the feature, the owner approves it, then you write code.

## A feature folder

| Path | Holds |
|---|---|
| `README.md` | The status, what the owner approved, the copy still to approve and the open questions |
| `boards/` | The approved artboards, one `.dc.html` file per screen or state |
| `assets/` | Every image the boards use, at 2x |
| `art/` | The scripts that draw those images, when a script made them |

## The boards

A board is a `.dc.html` file exported from the owner's design canvas. You read it as markup: layout, sizes, spacing, copy and token values are all in it. It needs the canvas runtime to render, so a browser shows it unstyled. The canvas link stays with the owner and is not written into the repo.

Image and font links in a board point at `assets/` and at `src/assets/fonts/vazir`.

## Rules

A board is a promise about the code. Anything it shows has to be something the code can draw with the project's own tokens and components. A board that only looks right on the canvas is rejected like code that only works on one machine.

### Colour

- Every chrome colour on a board is a token from `src/styles/tokens.css`, written as the value it has in the light theme (`src/styles/themes/light.css`). The ones a board needs most:

| Token | Light value | For |
|---|---|---|
| `surface` | `#fff` | a widget, the base layer |
| `surface-2` | `#f8fafc` | a modal, card, panel or input on it |
| `surface-3` | `#f1f5f9` | a raised control, and the border of surfaces |
| `fg-strong` | `#464647` | titles and numbers |
| `fg` / `fg-muted` / `fg-faint` | `#464647` at 90%, 70%, 50% | body, secondary, hints |
| `fill` / `fill-2` / `fill-3` | `#464647` at 5%, 10%, 20% | rest, hover or selected, pressed |
| `line` | `#464647` at 15% | every border and divider |
| `brand` | `#536dfe` | the one primary action, the selected state |
| `brand-fill` / `brand-fill-2` | brand at 10%, 20% | a brand tint |
| `danger` / `success` / `warning` | `#ff627d` / `#00d390` / `#fcb700` | state only, never decoration |

- A tint is a `*-fill` token, never a colour at a made-up opacity. If a board needs a colour that is not on this list, it is either content (see below) or a missing token. A missing token is the owner's call, not yours: ask before you draw it.
- Content keeps its own colours: artwork, a currency or site icon, a wallpaper, a palette the user picks from. Everything else is chrome.
- No gradients on chrome, no glows, no coloured shadows, no glass unless the component is glass in the code (`bg-glass-*`).
- Draw the light theme. Say in the feature README which states also need checking in a dark theme; the code must not assume either.

### Shape and depth

- Radius comes from the scale: `rounded-widget` (24px) for a widget or modal, `rounded-2xl` (16px), `rounded-xl` (12px) or `rounded-lg` (8px) inside it, `rounded-full` for pills and avatars.
- Shadows come from the four steps in `src/styles/elevation.css` (`sm`, `md`, `lg`, `xl`). A modal uses `lg`. Never invent a shadow.
- Spacing is on the 4px grid (Tailwind's spacing scale). Sizes are ones a Tailwind class can say; check an unusual one compiles before you rely on it.

### Type

- Vazirmatn FD from `src/assets/fonts/vazir`, so digits come out Persian. Use the weights the code uses: regular, medium, semibold, bold and black.
- Sizes come from the scale: `text-3xs` 10px, `text-2xs` 11px, `text-xs` 12px, `text-sm` 14px, `text-base` 16px, then `text-lg` and up. Nothing smaller than 10px.
- Copy follows `.agents/TYPOGRAPHY.md`: no tanween, no lone full stop at the end, Persian digits.

### Components

- Build from what `src/components/ui` already has: `Modal`, `Button`, `TabNavigation`, `TextInput`, `Coachmark`, `EmptyState`, `Chip`, `PopoverMenu` and the rest. Draw them at their real sizes and padding, read from their `*.variants.ts`. A modal `sm` is 384px wide, `md` 448px.
- If a board needs something `ui` does not have, say so in the README: it becomes a new `ui` component, built once.
- Controls are real controls: a button looks like `Button`, a field like `TextInput`. Aim for 32px or more for anything clickable; go smaller only where the matching `ui` component is smaller.
- Icons are the project's own, from `src/icons`, drawn the way that set draws them. No emoji anywhere, not in copy, badges or toasts.
- No icon in a tinted square next to a label and a value. That pattern is banned in the extension.
- Rows that hold inputs must fit at the narrowest width: give every field `min-width: 0` so it can shrink, and check the row at the component's real width.

### Copy

- Use the real copy. If the screen exists, take its text from `src/common/i18n`. New copy is a draft until the owner approves it, then it goes into the catalog.
- Use real data, or data shaped like it: a long name, a long price, an empty state. If the owner gives sample data, draw with that.

### Art

- Pictures are drawn with PhotoCraft from a script in the feature's `art/`, at 2x, on the brand blue with white UI, and without text unless the text is decorative. The script and the exported `.webp` both go in the folder.

## Keeping boards and code in sync

- A board is approved only when the owner says so. Build exactly what it shows. Something the code cannot do the same way is raised before you build, not decided quietly.
- When the owner changes the design, export the boards again and update the README. Never edit a board by hand to match the code.
- When the code has to differ from an approved board (the owner asked for a change while you built it, or a data case the board did not show), redraw the board on the canvas to match the code, export it, and note the difference in the feature README.
- When a board is redrawn with real data, add it next to the original instead of replacing it, so both the approved design and the built result are kept.
- Keep only the approved direction here. Rejected options stay on the canvas.

## Before you show a board

- Every colour is on the token table above, or is content.
- Every radius, shadow and text size is on its scale.
- Every component is one `ui` has, at its real size, or the README says it is new.
- The copy is real, or marked as a draft.
- Nothing overflows its container at the component's real width.
- No emoji, no icon tiles, no gradients on chrome.

## Folders

- [pro-tab](pro-tab/README.md): the Pro tab in settings
- [browser-bookmarks](browser-bookmarks/README.md): the browser bookmarks panel under the search box
- [bookmark-group-open](bookmark-group-open/README.md): the one-time group-open intro in the bookmark folder modal
- [onboarding](onboarding/README.md): the pictures for the welcome modal and the first-run tour
- [currency-chart](currency-chart/README.md): the currency modal, its price chart and converter
- [release-notes](release-notes/README.md): the «آبنبات چوبی» release notes window
