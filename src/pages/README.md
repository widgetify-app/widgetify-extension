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
| `hooks/use-block-browser-context-menu.ts` | The shell's own hook: turns off the browser's right-click menu on the whole page |
| `utils/block-browser-context-menu.ts` | The listener behind that hook |

## Rules

- `src/pages/` holds page folders and `root.tsx`, with the shell's role folders beside it. A routed page is `<name>.page.tsx` directly under its folder.
- A page composes features. Logic belongs in a feature, not here.
- Nothing at or above `src/components/` imports from a page.
- A page reaches a feature only through its public files (see `src/README.md`).
- **The browser's own right-click menu is off on the whole page.** The shell blocks it in the capture phase, so a modal that stops propagation cannot let it through. A feature that wants a menu draws its own on `onContextMenu`; it needs no `preventDefault` to hide the browser's. An iframe (explorer content, mini apps) is another document, so the browser menu still shows inside it.

## Mistakes that happened

- The tour's joyride used English button labels. Persian labels are passed through `locale` in `home.page.tsx`.

## Tests

`__tests__/block-browser-context-menu.test.ts` covers the listener. The rest is composition and is checked on screen.
