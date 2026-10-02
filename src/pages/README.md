# pages

The screens the new tab can show, and the shell that switches between them.

## What is here

| Path | Holds |
|---|---|
| `root.tsx` | The shell. It switches pages from `page.context.tsx` |
| `home/home.page.tsx` | The widget canvas, the welcome flow and the product tour |
| `explorer/explorer.page.tsx` | The explorer |
| `mini-apps/mini-apps.page.tsx` | Mini apps |
| `hooks/use-wallpaper-apply.ts` | The shell's own hook: puts the wallpaper on the page |

## Rules

- `src/pages/` holds page folders and `root.tsx`, with the shell's role folders beside it. A routed page is `<name>.page.tsx` directly under its folder.
- A page composes features. Logic belongs in a feature, not here.
- Nothing at or above `src/components/` imports from a page.
- A page reaches a feature only through its public files (see `src/README.md`).

## Mistakes that happened

- The tour's joyride used English button labels. Persian labels are passed through `locale` in `home.page.tsx`.

## Tests

None. Pages are composition and are checked on screen.
