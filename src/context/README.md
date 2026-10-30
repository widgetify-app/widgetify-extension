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
| `feature-intro.context.tsx` | Which one-time feature intros the user has seen. `useFeatureIntro(id)` gives `isUnseen` and `dismiss` |
| `utils/reduced-motion.ts` | Pure rule for reduced motion |
| `utils/feature-intros.ts` | Reading and adding seen intro ids. Tested |

## Rules

- Only providers sit at the root. A context only one feature uses lives in that feature (`pet.context.tsx`, `bookmark.context.tsx`).
- A theme is chosen by the `data-theme` attribute, never by the OS. The set of themes is open ended, so no code may assume what a token contains.
- A provider reaches the server only through hooks and functions from `src/services`, never the API client itself.

## Feature intros

A feature introduces itself once with `useFeatureIntro(id)` and the `Coachmark` from `@/components/ui`. Show it while `isUnseen` is true and call `dismiss` when the user is done.

- Add the intro's id to `FEATURE_INTRO_IDS`. The ids are data: once shipped, an id never changes, or everyone sees the intro again.
- The provider keeps the seen ids on the device under `seenFeatureIntros`, through `deviceStore`. Moving them to the server means a second store with the same `load` and `save`, and no change in any feature.
- The provider sends `feature_intro_dismissed`. A feature sends `feature_intro_shown` and any step events itself, each with the intro `id`.
- `bookmark-group-open` is the first: the bookmark folder modal shows it the first time a folder opens.

## Tests

`context/__tests__/reduced-motion.test.ts` and `context/__tests__/feature-intros.test.ts` cover the pure rules. Providers are not rendered in tests.
