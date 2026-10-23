# features

One folder per product feature. Widgets are features too and live in `widgets/` (see `widgets/README.md`).

## What is here

`explorer`, `friends`, `market`, `mini-apps`, `navbar`, `release-notes`, `setting`, `widgets`. `src/features/` holds only feature folders, nothing loose.

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

## Notifications that open a mini-app

A notification (the navbar card or the home dialog) can open one mini-app. In the panel the item is `type` action, `goTo` `openMiniApp` and `target` the mini-app's `appId`. The click calls `callEvent('openMiniApp', appId)`; `pages/root.tsx` moves to the mini-apps page and hands the id to `MiniAppsLayout` (`focusAppId`), which runs the app in the page, brings its window forward when it already runs in one, and scrolls its card into view. An id that is not shaped like an app id (`mini-apps/utils/focus-app.ts`, letters, digits, `_`, `.` and `-`, at most 100) is ignored, and an id with no app shows the runner's own error. An extension from before this event shows a card that does nothing, so publish such a notification after the release has rolled out.

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
