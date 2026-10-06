# entrypoints, background, manifest

How the extension is built and which browsers it must run in. WXT turns this folder and `wxt.config.ts` into the manifest.

## Browsers

The extension must run on the oldest browsers Windows 7 can still install, because some companies run it.

| Browser | Minimum | Why |
|---|---|---|
| Chrome | 109 | The last version for Windows 7, 8 and 8.1 |
| Firefox | 115 ESR | The last version for Windows 7, 8 and 8.1 |

What follows from that:

- No API or CSS feature that starts after those versions. `src/__tests__/browser-baseline.test.ts` rejects the known ones in `src` (`toSorted`, `Object.groupBy`, `Promise.withResolvers`, `:has(`, the `popover` attribute and others). A property that only changes looks and is ignored where missing, like `text-balance`, may stay. The stylesheet tests reject `oklch()` and `color-mix()` in our own CSS.
- `src/styles/legacy.css` holds the Chrome 109 fallbacks for what daisyUI writes. The built stylesheet still carries daisyUI's own `oklch()`, `color-mix()` and `:has()`, which an old browser drops, so `legacy.css` restores the one that mattered: the modal scrim. Tailwind's own `@property` fallback covers Firefox below 128.
- On every Firefox the extension asks for data consent itself, in `src/pages/home/components/step-firefox-consent.tsx`. Firefox 140 and later has a built-in prompt too (`data_collection_permissions`); older versions ignore that key.
- Firefox below 139 has no `tabGroups` permission. The code guards the missing API, and `general-setting.context.tsx` treats a permission check that throws as "not granted".
- `strict_min_version` in `wxt.config.ts` must match the table above. The baseline test reads it.

## Permissions

Ask only for a permission the code calls, or the Chrome Web Store rejects the release ("Use of Permissions"). It rejected 2.0.5 for an unused `tabs`. Creating and grouping tabs need no permission; `tabs` only unlocks reading a tab's `url`, `title` and `favIconUrl`, which nothing here does. Grouping needs `tabGroups`. `bookmarks` is used by the bookmark import and the search bookmark list, both behind the switch in Privacy settings, so tell the reviewer where to find them.

A test can show that a newer API is absent. It cannot show that the build runs on those browsers. Open the build once in Chrome 109 and Firefox 115 (a Windows 7 machine or a VM) before a release.

**Firefox lint.** Mozilla's linter checks the Firefox manifest the way the add-on store does:

```bash
npm run build:firefox
npx web-ext@10.7.0 lint --source-dir .output/firefox-mv2
```

On 2026-10-01 it reported no errors, two warnings (`data_collection_permissions` only works from Firefox 140) and two notices (the `tabGroups` permission only exists from Firefox 139). All four are expected with a minimum of 115. Any new error means a manifest change broke old Firefox.

## Build

| Command | Does |
|---|---|
| `npm run build` | Chrome build into `.output/chrome-mv3` |
| `npm run build:firefox` | Firefox build into `.output/firefox-mv2` |
| `npm run zip`, `npm run zip:firefox` | Store packages |

- Terser drops `console.log`, `console.info` and `console.debug` from the bundle, and strips comments.
- For Firefox, a plugin rewrites `.innerHTML =` in React DOM so the AMO validator accepts it.
- `sourcemap` is off. Grepping the built output for a source file name finds nothing.

## What can break a published build

Source file names do not reach the extension. A rename that only moves files produces a byte identical bundle. Four things genuinely can break it:

- **Storage key strings.** Changing one orphans every user's saved data. The file holding the keys may be renamed; the strings inside may not.
- **`entrypoints/`.** WXT derives the manifest from it.
- **The manifest:** version, permissions, `gecko.id`, `chrome_url_overrides`.
- **A dynamic `import()` built from a template literal.** `tsc` cannot follow it and the build still succeeds. Grep for a backtick right after `import(` before a bulk rename. There are none today.

To show a refactor changed nothing, record the size and hash of `.output/chrome-mv3/background.js` and `chunks/` before and after. Two builds of the same tree can differ: identical pet sprites are emitted once, under whichever name Vite keeps. Normalise names, and build the baseline twice to confirm it matches itself.

## background

`entrypoints/background.ts` starts the background worker from `background/`. `events.ts` wires the install and toolbar click listeners, `cache.ts` registers the Workbox routes (`cache-config.ts` lists the paths for each strategy; a request sent with `cache: 'no-cache'`, an explicit refresh, takes a network first route registered before the others), `wallpaper-cache.ts` keeps the active wallpaper cached, `cache-names.ts` names the caches and `utils.ts` prunes them. It imports from `src/common` and never from React or `@/components`.

## Mistakes that happened

- `strict_min_version` was `142.0`, which excluded Firefox on Windows 7 while the documented baseline said it was supported.

## Tests

`browser-baseline.test.ts` for the version rules. Nothing builds the extension in a test, so run `npm run build` yourself and grep `.output/chrome-mv3/assets/newtab-*.css` when a styling claim needs proof.
