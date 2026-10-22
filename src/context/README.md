# context

App wide React providers. One file per provider at the root: `<name>.context.tsx`.

## What is here

| Provider | Holds |
|---|---|
| `auth.context.tsx` | Who is signed in |
| `general-setting.context.tsx` | General settings, analytics and permission choices |
| `appearance.context.tsx` | Appearance choices |
| `theme.context.tsx` | The active theme, written to `data-theme` on `<html>` |
| `wallpaper.context.tsx` | The active wallpaper |
| `page.context.tsx` | Which page the shell shows |
| `utils/reduced-motion.ts` | Pure rule for reduced motion |

## Rules

- Only providers sit at the root. A context only one feature uses lives in that feature (`pet.context.tsx`, `bookmark.context.tsx`).
- A theme is chosen by the `data-theme` attribute, never by the OS. The set of themes is open ended, so no code may assume what a token contains.
- A provider reaches the server only through hooks and functions from `src/services`, never the API client itself.
- Theme, font, tab title and wallpaper belong to the active layout slot. Before a provider sends one of them to the account, it checks `isLookSyncedWithAccount()` from `@/common/utils/account-look`, which is false while slot 2 to 6 is active. A wallpaper that still has to be bought goes to the server either way, because buying it is that call. See `src/features/widgets/slots/README.md`.

## Tests

`context/__tests__/reduced-motion.test.ts` covers the pure rule. Providers are not rendered in tests.
