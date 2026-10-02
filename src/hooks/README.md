# hooks

React hooks used by two or more unrelated areas. Nothing else lives here.

## What is here

| File | Does |
|---|---|
| `use-infinite-scroll.ts` | Loads the next page when the end of a list is visible |
| `use-lazy-load.ts` | Runs a callback once an element scrolls into view |
| `use-preview-handler.ts` | Previews a market item, with a toast to undo it |

## Rules

- A hook is `use-<name>.ts`. `architecture.test.ts` ("keep only hooks in src/hooks") rejects any other file here.
- A hook used by one feature belongs in that feature's `hooks/`.
- A server state hook is not a local hook. It is `<name>.hook.ts` in `src/services/<domain>/`.
- Read props through a ref when the effect must not restart on every render. `src/features/widgets/pet/hooks/use-base-pet-logic.ts` does this with `propsRef`.

## Tests

Hooks cannot be rendered in a test here. Move the logic into a pure `utils/` file and test that.
