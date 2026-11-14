# The web clone

The extension's UI served as a plain Vite page, with a mocked `browser` object. It has no `wxt`, no manifest and no service worker. This folder holds the recipe and the scaffold files. The running clone lives in a folder outside the repo and keeps no copy of the source: its `src` and `node_modules` are links to this repo, so every change shows up in the clone at once.

## What it can and cannot test

| Can | Cannot |
|---|---|
| Layout, themes (light, dark, glass, icy, zarna), widgets, modals, dropdowns, animation, idle CPU in a page | Sign in, the real API (`api.widgetify.ir` calls run unauthenticated), push, the background service worker, other tabs |

`browser.storage` is faked in `web/mock-browser.js` and lives in the page's `localStorage` under `mock_ext_storage_v1`.

## Use it

Start the server once (it keeps running):

```bash
cd <clone folder>
./node_modules/.bin/vite
```

Open `http://127.0.0.1:5188/?reset&theme=<light|dark|glass|icy|zarna>`.

- `?reset` clears the faked storage and re-seeds it (theme, wallpaper, welcome flags). Leave it out to keep your state.
- `theme` picks the theme at seeding time.
- `web/tuner.js` adds a tuner panel for the glass and icy themes (sliders, a Result button that copies the CSS variables). Remove its `<script>` from `index.html` when measuring performance or screenshots.
- The port is fixed to 5188 (`strictPort`). Stop a stale server by its exact PID (`netstat -ano`), never by process name.

## Build it from scratch

You need the repo with `node_modules` installed (`bun install`).

1. Make a folder anywhere outside the repo, for example `web-clone/`, and copy `scaffold/` from this folder into it (`vite.config.ts`, `auto-imports.ts`, `index.html`, `web/mock-browser.js`, `web/tuner.js`).
2. Link the repo in. On Windows use junctions in PowerShell; on macOS and Linux use `ln -s`:

   ```powershell
   New-Item -ItemType Junction -Path src -Target <repo>\src
   New-Item -ItemType Junction -Path node_modules -Target <repo>\node_modules
   ```

3. Copy `<repo>\public` and `<repo>\package.json` into the folder (the working clone has both; the page loads `public/icons`).
4. Run the command in "Use it".

Never delete the folder with a recursive remove while the junctions are in it: it can follow them into the real repo. Remove the two links first (`(Get-Item src).Delete()`), then the folder.

## Keeping it working

- The clone builds with its own `vite.config.ts` (aliases, `unimport` for the auto imports WXT normally adds, `import.meta.env.FIREFOX` fixed to false). When the repo adds a new alias or an auto import, add it to `scaffold/` and to the clone.
- A new `browser.*` API the page calls needs a stub in `web/mock-browser.js`.
