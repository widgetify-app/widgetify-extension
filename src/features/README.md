# features

One folder per product feature. Widgets are features too and live in `widgets/` (see `widgets/README.md`).

## What is here

`explorer`, `friends`, `market`, `mini-apps`, `mobile-promo`, `navbar`, `push`, `release-notes`, `setting`, `widgets`. `src/features/` holds only feature folders, nothing loose.

## Rules

- The shape of a feature folder and its names are in `src/README.md`. The architecture test names the rule a misplaced file breaks.
- **A feature reaches another only through its public files:** the entry (and what it re-exports), the settings panel and `*.context.tsx`. Example: `friends.tsx` exports `FriendsDirectView` for the navbar.
- **Settings panels** are `<feature>-setting.tsx` at the feature root and are public.
- **Contexts** are `<name>.context.tsx` at the feature root and are public.
- Server calls go through `src/services`. A feature never calls the API client.
- A feature's own storage keys and events are declared in its `types.ts` (see `src/common/README.md`).
- UI is built from `@/components/ui`. Text is Persian, right to left, and friendly (see `src/components/ui/README.md`). A feature's copy goes in its area file under `src/common/i18n/fa/`, not in the feature folder.
- Do not animate a container-query sized element, and draw loading, error and empty states distinctly (see `widgets/README.md`; the same defects appear outside widgets).

## Adding a feature

1. Make `<feature>/` with `<feature>.tsx` as the entry.
2. Add role folders only when you have a file of that role.
3. Count importers before you put anything in a shared layer.
4. Run `npm test`. The architecture test says what is wrong, in words.

## Mistakes that happened

- `google-calendar` imported fifteen files from `calendar/utils`. The shared code moved to the common parent.
- A shared file sat in a global folder with one user, which hid who owned it.
- A deep import into another feature broke when that feature reorganised.

## Tests

Feature logic is tested where it is pure, in `<feature>/__tests__/`. Rules about where files go are in `architecture.test.ts`.

## Friends: the profile card

Any user shown in the friends sheet (a friend or a request in the list, a friend's status bubble, a person under the reactions) opens a profile card, and so does a row of the pomodoro leaderboard, through `ProfileCardTrigger`, which `friends.tsx` re-exports. It is a `PopoverMenu`, so it rises above the sheet and above a modal. The data is `GET /friends/users/{username}/card` (`useGetFriendCard`, keyed under `['friends']`, so every friend mutation refreshes an open card); the contract and the chosen design are in the workspace's `docs/friends/`. A stranger sees only what introduces the person; a friend, and you on your own card, also see the status, Pro badge, wallpaper banner, friendship length, city, Jalali birthday, member since and collection. Removing a friend is confirmed inside the card, because a modal would count as a click outside the popover. Labels are in `friends/utils/profile-card.ts` (tested).

The sheet also shows «شاید بشناسیشون» between the statuses and the list (`friends/components/friend-suggestions.tsx`, `GET /friends/suggestions`): each card opens the profile card, «افزودن» sends a request and drops the person (the server leaves out anyone with a pair row), and «نه» is kept on the device under the storage key `friendSuggestionsDismissed`. The reason line comes from `friends/utils/suggestion-reason.ts` (tested): mutual friends, then a shared interest, then the city. A user with no friends yet sees «اولین درخواستت سکه داره 🪙». The settings friends tab starts with «حالت مخفی» (`GET` and `PUT /friends/privacy`): a hidden user is never suggested, and a request by username still works.

Statuses: your own status says who reacted («سارا و ۲ نفر دیگه واکنش دادن»; names from the reactions route, only when there are reactions), and a friend's status you have not seen carries a dot for that open (seen ids are kept on the device under `seenFriendActivities`, the newest 200). Both rules are in `friends/utils/activity-seen.ts` (tested). On a friend's birthday (`isBirthdayToday` in `GET /friends`) their row shows 🎂 and «🎂 تبریک», and so does their card; it calls `POST /friends/users/{username}/congratulate`, once a day per friend. Statuses expire on their own (1, 4 or 24 hours, kept by the content service).

## Notifications that open a mini-app

A notification, island or dialog opens one mini-app with the link `/mini-apps/<appId>` (see Notification links in `common/README.md`). The click calls `callEvent('openMiniApp', appId)`; `pages/root.tsx` moves to the mini-apps page and hands the id to `MiniAppsLayout` (`focusAppId`), which runs the app in the page, brings its window forward when it already runs in one, and scrolls its card into view. An id that is not shaped like an app id (`mini-apps/utils/focus-app.ts`, letters, digits, `_`, `.` and `-`, at most 100) is ignored, and an id with no app shows the runner's own error.

## Settings: storage

`setting/general/components/storage-usage.tsx` is a `SectionPanel` like the other General sections, kept small: the total, a bar split by what the space holds, how much can be freed, and a soft danger button that clears the cache after a confirmation. Each colour in the bar is a button: clicking it opens a `ClickableTooltip` with that part's name, size and reason, the way a phone's storage screen does. A segment is at least `min-w-1.5` wide so a small one can still be clicked. It replaced a panel that listed every row at once and took too much of the tab. The segments use status colours and ink fills only (app files `fill-3`, the browser's extra `danger-fill-2`, your data `secondary`), never a text token as a background.

| Row | Comes from | Cleared by the button |
|---|---|---|
| Wallpaper, explorer images, online data, fonts and icons | Each `wgf-` cache, grouped by its base name | Yes |
| Leftovers from older versions | Any cache name the app no longer uses, such as `images-cache-v1` | Yes |
| Counted by the browser | `navigator.storage.estimate()` minus the measured cache files. Mostly the padding Chrome adds for opaque responses | Yes, it goes with the caches |
| App files | The Workbox precache | No |
| Your data | The size of `browser.storage.local` as JSON: settings, widgets, notes | No |

- `setting/general/utils/storage-usage.ts` is pure: it groups cache names, adds the rows up, sorts them and picks a unit. `setting/general/__tests__/storage-usage.test.ts` covers it.
- `setting/general/hooks/use-storage-usage.ts` measures on mount, deletes the clearable caches and measures again; the toast reports the difference.
- A cache file is counted by its `content-length`, or by reading its body when the header is missing. An opaque response reads as 0 bytes, which is why the browser row exists.
- On Firefox the browser row is skipped: the background there has no service worker, and `browser.storage.local` lives inside the same origin quota, so the estimate would count your data twice.
- The cache names come from `src/common/types/sw-events.interface.ts`, shared with `background/cache-names.ts`. A new cache needs a category here, or it shows as leftovers.

## Push (`push/`)

Push notifications in Chrome and Edge, none on Firefox. Design: `design/push/`.

- `push/push.tsx` is `PushHost`, mounted in the navbar. Once push is allowed here and wanted, it gets a Firebase token (`getToken` with the VAPID key and the registration of the extension's own service worker, `firebase/messaging` loaded on demand) and sends `PUT /v2/push/subscriptions` (platform `EXTENSION`). It reads `?pushTap=&pushLink=` when a notification click opened the page (marks it read, opens the link), and shows the ask island (`push/components/push-ask.tsx`). `push/push-setting.tsx` is the switch card in the general settings tab.
- «روشن کن» on the island is the tap that requests the notification permission, which is all it needs (no manifest permission). «بعدا» asks again after two days (`push/utils/push-ask.ts`, `pushAskedAt`). A refusal by the browser stops the island, the card stays. Everyone who has not turned push on is asked, including people who allowed notifications for the Pomodoro, because nothing about that is stored.
- The notification service sends an `EXTENSION` token the same data only web message as a PWA. `background/push.ts` handles the `push` event, draws it with `registration.showNotification`, and a click opens `newtab.html?pushTap=<id>&pushLink=<link>`. `chrome.gcm` is not used: its registration for our sender answers `UNKNOWN_ERROR`.
- The build needs `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_APP_ID`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_SENDER_ID` and `VITE_VAPID_KEY` (public values of the Firebase web app, in `.env.example`). Without them push is off.
- `push/utils/push.ts` is the only door to the token and the permission. Sign out calls `forgetPushSubscription` first (3 seconds at most). The install id is `installationId()` in `src/common/utils/installation-id.ts`.
- Tests: `push/__tests__/push-ask.test.ts`, `push/__tests__/cold-tap.test.ts`, `background/__tests__/push-notification.test.ts`.

## Mobile promo: the download card

A card with a QR code that asks signed in people to install the mobile version (the Android app or its PWA). The design is `design/mobile-promo/`. The entry is `src/features/mobile-promo/mobile-promo.tsx` (`MobilePromo`, mounted by the navbar), with `src/features/mobile-promo/components/mobile-promo-card.tsx`, `src/features/mobile-promo/components/qr-code.tsx` and, in `utils/`, `src/features/mobile-promo/utils/show-rule.ts`, `src/features/mobile-promo/utils/qr.ts` and `src/features/mobile-promo/utils/mobile-promo-url.ts`.

- It shows only to a signed in person whose profile says `mobileV2.linked` is false. The Android app and the PWA count the same, so either one hides it for good. A profile without `mobileV2` (an older server or an old cache) counts as not linked.
- It hides while any modal is open (an open `dialog`, found by `src/features/mobile-promo/hooks/use-modal-open.ts` and `src/features/mobile-promo/utils/modal-open.ts`) and comes back when the last one closes. `mobile_promo_shown` is sent once per page load, not on every return.
- It waits 2 days after the person closes it (`MOBILE_PROMO_COOLDOWN_MS`). The close time is saved as `mobilePromoClosedAt`. Nothing is saved when it is only shown, and a close time in the future counts as never closed.
- The QR code opens `https://widgetify.ir/apps`, drawn with `qrcode-generator` at the highest error correction, always black on a white tile with a 4 module quiet zone, in every theme, or phones cannot read it.
- The picture is content, not chrome: `src/assets/images/mobile-promo/phones.webp`, three screens of the v2 app with fake data. How it is made is in `design/mobile-promo/README.md`.
- Events: `mobile_promo_shown` and `mobile_promo_closed`. Tests: `mobile-promo/__tests__/` (the show rule, and the QR matrix).
