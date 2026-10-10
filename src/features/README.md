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
