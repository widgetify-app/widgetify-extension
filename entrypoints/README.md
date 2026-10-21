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
- Firefox opens its home page (`about:home`), not the new tab page, when it starts and on the Home button, so `chrome_url_overrides.newtab` alone left the first tab on Firefox Home. The Firefox manifest also sets `chrome_settings_overrides.homepage` to `newtab.html` (only for Firefox, in `wxt.config.ts`); Firefox asks the user to keep or undo that change. Chrome opens the new tab page on start by default and does not get the key.
- Firefox has no Google sign-in. `auth-form.tsx` renders the Google button and its «یا» divider only when `import.meta.env.FIREFOX` is false, so the Firefox build drops the code, and its manifest asks for no `identity` permission. Chrome keeps `identity` as an optional permission for that button.
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
- `chunkSizeWarningLimit` is 2000. The extension loads from disk, so size only costs parse time, and `newtab.js` (about 1.5 MB) is mostly the widgets, which the first paint needs. A chunk past 2000 kB is a real change worth a look.

## What can break a published build

Source file names do not reach the extension. A rename that only moves files produces a byte identical bundle. Four things genuinely can break it:

- **Storage key strings.** Changing one orphans every user's saved data. The file holding the keys may be renamed; the strings inside may not.
- **`entrypoints/`.** WXT derives the manifest from it.
- **The manifest:** version, permissions, `gecko.id`, `chrome_url_overrides`.
- **A dynamic `import()` built from a template literal.** `tsc` cannot follow it and the build still succeeds. Grep for a backtick right after `import(` before a bulk rename. There are none today.

To show a refactor changed nothing, record the size and hash of `.output/chrome-mv3/background.js` and `chunks/` before and after. Two builds of the same tree can differ: identical pet sprites are emitted once, under whichever name Vite keeps. Normalise names, and build the baseline twice to confirm it matches itself.

## background

`entrypoints/background.ts` starts the background worker from `background/`. `events.ts` wires the install and toolbar click listeners, `cache.ts` registers the Workbox routes (`cache-config.ts` lists the paths for each strategy; a request sent with `cache: 'reload'`, an explicit refresh, takes a network first route registered before the others; ordinary API requests from `src/services/api.ts` use `cache: 'no-cache'` and stay on their strategy), `wallpaper-cache.ts` keeps the active wallpaper cached, `catalog-media-cache.ts` keeps the explorer's catalog images within a budget, `cache-names.ts` names the caches and `utils.ts` prunes them. It imports from `src/common` and never from React or `@/components`.

### Caches stay small

Every cache has a cap, and none stores an opaque response. Chrome counts each opaque (`no-cors`) response as about 7 MB against the quota, whatever its real size, so a cache of small icons can look like gigabytes. The old `images-cache-v1` (every image, up to 300 entries, `statuses: [0, 200]`) grew past 600 MB this way. Routes for `cdn.widgetify.ir` and the catalog bucket rewrite a `no-cors` request to `cors`, since both servers send `Access-Control-Allow-Origin`.

Catalog media (`https://s3-abyss.atlantiscloud.ir/widgetify-contents/catalog/`, the explorer's icons and banners) is cache first in `wgf-catalog-media-v<version>`:

| Limit | Value | Why |
|---|---|---|
| Entries | 300 | The explorer shows a few dozen icons; 300 covers every page of it several times over |
| Total | 20 MB | A fifth of the 100 MB budget in `utils.ts`; a catalog icon is about 9 kB, so the entry cap bites long before this one |
| One file | 2 MB | A larger file is served but not stored |
| Age | 14 days | A replaced image shows up within two weeks |

`catalog-media-cache.ts` stamps each stored response with its time and size (`x-wgf-stored-at`, `x-wgf-bytes`), refuses an opaque or non 200 response, and after each store removes what `selectMediaToEvict` in `media-cache-budget.ts` picks: expired entries first, then the oldest until both caps hold. The same trim runs when the worker starts. If the CORS fetch fails, the handler falls back to the original request, which the image can still use but nothing stores.

Cache names are `wgf-<base>-v<version>`, with the bases in `src/common/types/sw-events.interface.ts`. Settings > General > Storage reads the same names to show the user what each cache holds; a new cache needs a base there and a category in `src/features/setting/general/utils/storage-usage.ts`, or it shows up as leftovers from older versions.

Old cache names are listed in `LEGACY_CACHES` and deleted on start and on activate, with every `wgf-` cache from an earlier version. Firefox runs the background as a page (MV2), which gets no `fetch` events, so none of these routes run there and images use the browser's HTTP cache.

## Mistakes that happened

- `strict_min_version` was `142.0`, which excluded Firefox on Windows 7 while the documented baseline said it was supported.
- Users on Firefox reported that Widgetify was missing until they opened another tab. The first tab after a start was Firefox Home: the extension overrode the new tab page but not the home page. Checked in Firefox 115.43 ESR: without the homepage key the start tab is `about:home`, with it `newtab.html`.
- `images-cache-v1` and `cross-origin-cache-v1` stored opaque responses and passed 600 MB. Removing their routes did not delete them; they stayed on disk until they were added to `LEGACY_CACHES`.

## Tests

`browser-baseline.test.ts` for the version rules. `background/__tests__/media-cache-budget.test.ts` for the catalog media eviction (age, entry cap, byte cap, oldest first). Nothing builds the extension in a test, so run `npm run build` yourself and grep `.output/chrome-mv3/assets/newtab-*.css` when a styling claim needs proof.
