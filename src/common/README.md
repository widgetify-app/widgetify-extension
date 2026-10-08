# common

Shared code with no UI of its own, except `motion.tsx` and `toast.tsx`, which are the gateways to two libraries.

## What is here

| File or folder | Holds |
|---|---|
| `storage.ts` | The only door to browser storage |
| `constants/store-keys.ts` | `StorageKV`, the typed list of app wide storage keys |
| `utils/call-event.ts` | `callEvent` and `listenEvent`, typed messages between components |
| `motion.tsx` | `Motion`, `Presence`, `MotionPreferences`: the only door to framer-motion |
| `toast.tsx` | `showToast`: the only door to react-hot-toast |
| `utils/cn.ts` | `cn()`, class merging (clsx and tailwind-merge) |
| `utils/` | Small helpers: colour, dates, error translation, timeouts |
| `types/` | Shapes shared by many features (`*.interface.ts`) |

## Storage

- Everything goes through `getFromStorage`, `setToStorage` and the helpers in `storage.ts`. Nothing else touches `localStorage`, `browser.storage` or `chrome.storage`.
- Every key is typed on `StorageKV`. App wide keys are declared in `constants/store-keys.ts`. A key one feature owns is declared in that feature's `types.ts` by augmenting the interface:

```ts
declare module '@/common/constants/store-keys' {
	interface StorageKV {
		pets: PetSettings
	}
}
```

- A file that augments must stay a module (keep one `export`). Without it the `declare module` replaces the module instead of extending it.
- The one `localStorage` value is the Firefox favicon consent, read synchronously while rendering. Use `getFaviconConsent` and `setFaviconConsent`. Logout clears it with `clearLocalStorage`.
- Retired keys go into `DEPRECATED_STORAGE_KEYS` and `purgeDeprecatedStorageKeys` removes them.
- **Never trust what you read back.** An older version may have written something this one has never seen. Put a `normalize-*` helper in the feature's `utils/`, test it, and route every read through it. The bug is always a bare equality check that falls into the wrong branch instead of the default.

## Names that are data

Storage keys, analytics event names and widget ids live in places you do not control: a user's browser, a dashboard's history, a saved layout. Renaming one orphans everything recorded under the old name, and the build stays green. Rename the constant freely and leave the string alone. `data-names.test.ts` fails when one of them disappears.

## Events

`callEvent` and `listenEvent` are typed on the `EventName` interface. App wide events are declared in `utils/call-event.ts`, a feature's own events in its `types.ts`, the same way as storage keys.

## Analytics

Events go through `Analytics` from `@/analytics`. The user can turn it off in settings, and the function checks that before it sends. Event names are data, like storage keys. The first argument must be a string literal, and parameters must not carry personal or free-text data.

## Animation

- Use `Motion` and `Presence` from `@/common/motion`, never `framer-motion`. The wrappers are what make optimisation mode work.
- Optimisation mode has two independent paths. framer is handled by those wrappers. CSS transitions are handled by the `html.optimal-mode` class and one rule in `src/styles/base.css`. A new animation needs whichever path it belongs to. Keyframe animations keep running on purpose so spinners and the notification ping still work.

## Toasts

Toasts are always dark, in every theme. They are a transient layer over the page and not part of it, so their colours are written literally inside arbitrary value classes. Leave them. `toast.tsx` is the only file allowed numeric colours in classes, apart from the drop shadow of the pet hearts in `pet-hud.tsx`.

## Mistakes that happened

- The profile was invalidated as `['getUser']` after a purchase while every query cached it as `['userProfile']`, so the coin balance never refreshed. Keys come from one place now (see `src/services/README.md`).
- A bulk replace of `@/common/wallpaper.interface` also rewrote `@/common/activeWallpaper.interface`. Use word boundaries and assert the match count.
- Four weather settings were read and honoured while no screen could change them, and a pomodoro long break was stored and never applied. A setting needs both a writer and a reader. When you find half of one, say so and ask; wiring it and deleting it are both product decisions.

## Known and not fixed

`convertShamsiToHijri` in `utils/date-events.ts` counts days with an Iranian month table (30 days for Muharram 1445) but builds the date with moment-hijri, which uses the Umm al-Qura calendar (29 days there). A month that is longer in the table rolls over in the library, so the Hijri date repeats: 1402/05/26 and 1402/05/27 both come out as 1 Safar 1445. Which calendar is right is a product decision; `date-events.test.ts` only asserts what holds under both.

Importing moment-hijri also sets the global moment locale to `ar-sa`. Bun runs every test file in one process, so a test that imports `date-events.ts` must set the locale back to `en`, or the date tests of other files start failing.

## Tests

`src/common/__tests__/` covers the Firefox value sanitiser (`storage.test.ts`), error translation, colour helpers and the date conversions. Not tested, because they need the DOM or a browser: `play-alarm.ts`, `timeout.ts`, `call-event.ts`, `getCurrentDate`. `architecture.test.ts` holds the gateway rules ("touches browser storage only through common/storage", "reach framer-motion only through common/motion", "reach react-hot-toast only through common/toast and the toaster"). `data-names.test.ts` holds the names that are data.
