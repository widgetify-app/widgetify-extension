# src

How the code is laid out. Every rule here has a test in `src/__tests__/architecture.test.ts`, so a misplaced file fails `npm test` and the failure names the rule.

## Layers

```
components/ui/                     presentational primitives, no app knowledge
components/                        shared components that know the app
common/ hooks/ context/ services/  non component globals
features/ pages/                   features, and the pages that compose them
```

- Imports point **up** the list, never down. Type imports count.
- Nothing at or above `components/` imports from `features/` or `pages/`.
- `components/ui` never imports `services/`. A primitive does not fetch.
- A feature reaches another feature only through its entry file, its settings panel or a `*.context.tsx`. If a sibling needs an internal piece, the owner re-exports it or the piece moves to the common parent.

## Where a new file goes

Ask two questions in this order.

1. **Who owns it?** Count the places that import it.

| Importers | Owner |
|---|---|
| One file or one feature folder | That feature folder |
| Two or more sibling folders | Their nearest common parent |
| Two or more unrelated areas | The matching global layer |

A global file used from one area is misplaced. `services/` is the exception: everything that talks to the server lives there.

2. **Which folder inside the owner?** The file's role decides, never the count: `components/`, `variants/`, `hooks/`, `utils/`, `__tests__/`. A helper used once and a helper used ten times both live in `utils/`.

Before you add a file:

1. Does it already exist? Check `components/ui`, `@/common/utils` and the feature folder.
2. Who owns it? Apply the table. One consumer is rarely a reason for a new file; inline it.
3. A component? It goes in the owner's `components/`, or in `components/ui` if it is a generic primitive others would reuse.
4. Take the suffix from the table below.
5. Create the role folder if the feature does not have it yet; a folder with one file is fine.
6. Run `npm test`. The architecture test names the rule a misplaced file breaks.

Single use code stays inline unless two things hold it back: a piece large enough that inlining buries its consumer, or pure logic worth a test. Say which one you are invoking.

## Shape of a feature folder

```
<feature>/
  <feature>.tsx             entry (.widget.tsx for a widget, .page.tsx for a page)
  <feature>-setting.tsx     settings panel, when it has one
  <name>.context.tsx        provider, when it has one
  types.ts constants.ts     flat, this feature's own
  components/ hooks/ utils/ variants/ __tests__/
  <sub-feature>/            only with its own entry, same shape
```

- Nothing else sits at the root. No index file, no second component.
- The feature folder and its entry file share a name.
- `components/` and `utils/` may hold one level of named group. `hooks/`, `variants/` and `__tests__/` never nest.
- A hook is `use-<name>.ts` and lives in `hooks/`.

## Names

kebab-case everywhere. A file is a tsx file exactly when it contains JSX. A role word is joined with a hyphen (holiday-badge, not holiday.badge). Only these suffixes take a dot:

| Suffix | Role |
|---|---|
| `.widget.tsx`, `.page.tsx` | entry of a widget or a routed page |
| `.context.tsx` | provider |
| `.hook.ts` | server state hook, only in `services/<domain>/` |
| `.keys.ts` | query keys of one domain |
| `.interface.ts` | shape from the server or a global shape |
| `.variants.ts` | cva classes beside a `components/ui` component |
| `.test.ts` | test, inside `__tests__/` |

## Imports

- One alias per top level folder, declared in `wxt.config.ts`: `@/common`, `@/components`, `@/context`, `@/hooks`, `@/icons`, `@/services`, `@/styles`, `@/assets`, `@/features`, `@/pages`, `@/analytics`.
- A relative import stays inside the feature, page or top level folder it starts in.
- Exactly three barrels: `@/components/ui`, `@/components/gallery`, `@/icons`. Import from the folder, never the file behind it.

## Tests

`bun test` runs pure modules only. There is no React test setup, so a hook or component cannot be rendered.

- Put logic worth covering in a dependency free module and test that. Precedents: `features/widgets/utils/layout-engine/`, `features/widgets/pet/utils/pet-food.ts`, `components/ui/modal/animation-timing.ts`.
- A test must not import `@/services/api`. It reads the manifest at load and bun has no `browser`.
- Prefer a test that fails loudly on the bug that happened over one that restates the code.

| Test file | Holds |
|---|---|
| `src/__tests__/architecture.test.ts` | layers, folder shape, names, imports, dead code, server state, gateways |
| `src/styles/__tests__/design-system.test.ts` | colour, radius, text, motion, stylesheets, themes, icons |
| `src/__tests__/docs.test.ts` | every section has a README, no README names a file that is gone, the API docs list the endpoints the app calls |
| `src/__tests__/hygiene.test.ts` | no assistant names, no new comments, no stray `console.log` |
| `src/__tests__/data-names.test.ts` | storage keys, analytics events and widget ids keep their names |
| `src/__tests__/browser-baseline.test.ts` | nothing newer than Chrome 109 and Firefox 115 |

What no test can show: how a screen looks, whether Persian copy sounds friendly, whether the pet loop moves the same. Those are the owner's visual check.

## Section guides

Each folder with its own README owns the rules for that part.

| Section | README |
|---|---|
| UI primitives | `components/ui/README.md` |
| Shared components | `components/README.md` |
| Storage, events, motion, toast | `common/README.md` |
| Hooks, context | `hooks/README.md`, `context/README.md` |
| Server state | `services/README.md` |
| Icons | `icons/README.md` |
| Colour, themes, stylesheets | `styles/README.md` |
| Features | `features/README.md` |
| Widgets | `features/widgets/README.md` |
| Pages | `pages/README.md` |
| Manifest, build, browsers | `../entrypoints/README.md` |
