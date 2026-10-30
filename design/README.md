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

- A design follows `src/styles/README.md`, like code: token colours, the radius, type and shadow scales, Vazirmatn, and no emoji.
- Persian copy in a board is a draft. It goes through `src/common/i18n` with the typography rules once the owner approves it.
- When the owner changes the design, export the boards again and update the README. Never edit a board by hand to match the code.
- Keep only the approved direction here. Rejected options stay on the canvas.

## Folders

- [pro-tab](pro-tab/README.md): the Pro tab in settings
