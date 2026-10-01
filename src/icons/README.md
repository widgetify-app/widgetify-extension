# icons

The only place icons are chosen. Import `Icon` from `@/icons` (one of the three barrels).

## What is here

| File | Holds |
|---|---|
| `icon.tsx` | `Icon`: `name`, `size`, `spin`, plus any SVG prop |
| `types.ts` | `IconName` and `IconSize` |
| `packs/default.tsx` | The map from a name to a drawing |

## Rules

- Nothing outside `packs/default.tsx` imports `react-icons`. Test: `design-system.test.ts` ("reaches react-icons only through Icon").
- Every icon comes from a `react-icons` family, or from an SVG drawn in the pack when no family has it (the diamond, and the solid home and compass, whose cut-outs need `evenodd`). The test "draws every icon from react-icons, or from an SVG drawn in the pack" holds this.
- `size` is one of `8, 10, 12, 14, 16, 20, 24, 32`. The `IconSize` type enforces it at compile time, so the scale cannot drift.
- A solid version of an outline icon is the same icon wrapped in `filled()`.
- A decorative icon is hidden from screen readers by default. Give it `aria-label` or `title` only when it carries meaning on its own.
- An icon that turns while something loads takes `spin`. `Spinner` from `@/components/ui` is for loading states.

## Adding an icon

1. Pick a name that says what it shows, not where it is used.
2. Import the drawing in `packs/default.tsx`. Prefer the `lu` (Lucide) family so the set stays consistent.
3. Add the name to `IconName` in `types.ts` and the entry to `defaultIcons`.
4. Use it as `<Icon name="…" size={16} />`.

## Mistakes that happened

- Seventeen react-icons families were imported straight from components, each a different weight. Now there is one door.
- A size such as `17` slipped in and nobody noticed. The type rejects it.

## Tests

`design-system.test.ts` ("icons") holds the source and gateway rules. Nothing renders an icon.
