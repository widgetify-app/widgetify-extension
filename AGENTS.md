# AGENTS.md

Working agreement for AI agents on this repo. Read this before touching anything.

---

## Hard rules

These are not preferences. Breaking them means the work gets rejected.

| Rule | Detail |
|---|---|
| **No comments in code** | Do not add `//` or `/* */`. Existing comments may stay. Name things well instead. |
| **Never mention the assistant** | Not in code, not in commit messages, not in PR titles or bodies. No `Co-Authored-By`, no "Generated with", no tool names. Commits are authored by the repo owner. |
| **Never run the dev server** | No `npm run dev`, no `wxt`. Visual checks are the owner's job. Give them a checklist instead. |
| **Never commit unprompted** | Implement, verify, then stop and report. Commit and open a PR only when explicitly told to. |

---

## Stack

React 19 · TypeScript 6 · WXT 0.20 (browser extension, Chrome + Firefox) · Tailwind 4 · daisyUI 5 · framer-motion 12 · TanStack Query 5 · Biome 2 · bun (tests only)

UI text is **Persian and RTL**. Match the surrounding tone; do not switch to English strings.

---

## Verification

Run all four before reporting anything as done:

```
npm run compile      # tsc --noEmit
npm test             # bun test
npx biome check src
npm run build        # wxt build, catches CSS and asset issues tsc cannot
```

Checking the built CSS at `.output/chrome-mv3/assets/newtab-*.css` is often the fastest way to prove a styling claim. Use it — several bugs in this repo were classes that compile to nothing.

---

## Conventions

**Use the existing primitives.** `src/components/ui` exports Modal, ConfirmationModal, Dropdown, BottomSheet, Portal, Button, Input, Select, Toggle, Checkbox, Tabs, Tooltip, ContextMenu, DatePicker, ColorPicker, Pagination, Loading, Avatar, Badge, Chip, ItemSelector, SectionPanel. Import from `@/components/ui`. Do not hand roll a dialog or a popover.

**Variants live beside the component** as `*.variants.ts` using `cva`. Extend those rather than piling classes at the call site.

**Class merging** goes through `cn()` in `@/common/utils/cn` (clsx + tailwind-merge).

**Animation** uses `Motion` and `Presence` from `@/common/motion`, never raw `framer-motion`. The wrappers are what make optimisation mode work.

**Storage** goes through `@/common/storage`. Every key is typed in `src/common/constant/store.key.ts`. Deprecated keys get purged via `purgeDeprecatedStorageKeys`.

**Cross component messaging** uses `callEvent` / `listenEvent` from `@/common/utils/call-event`, typed in the same file.

**Icons** come from `Icon` in `@/src/icons`.

**Analytics** via `@/analytics`.

---

## Testing

`bun test` only runs on **pure modules**. There is no React testing setup, so a hook or component cannot be rendered in a test.

When logic is worth covering, extract it into a dependency free module and test that. Precedents:

- `src/layouts/widgets/layout-engine/` — grid collision maths
- `src/layouts/widgetify-card/pets/core/pet-movement.ts` — pet movement maths
- `src/common/utils/animation-timing.ts` — shared timing plus the retain predicate

A test file must not transitively import `@/services/api`; it reads `browser.runtime.getManifest()` at module scope and bun has no `browser` global. That is why timing constants live in their own module rather than next to the hook that uses them.

Prefer a test that would fail loudly on regression over one that restates the implementation. The layout engine has a timing budget test because the bug it guards was a 112 second freeze.

---

## Git and PR workflow

**Commit messages** state the problem, the actual cause with the offending code, then the fix. Wrap at ~76 characters. No bullet soup without a lead in.

**PR bodies** follow: Problem → Root cause with the real snippet → Changes → anything deliberately left out → Testing. Include measurements when you have them.

**gh CLI** lives at `C:\Program Files\GitHub CLI\gh.exe` and is not on PATH. Call it by full path, from PowerShell for anything with a multiline body.

**Conflicts are resolved by blending, never by taking one side.** Every conflict in this session needed both halves. "Accept incoming" would have silently reverted merged work.

**Do not force push over someone else's commit.** If a colleague pushed to your branch, create a fresh branch at your known good commit and open a new PR. Confirm with `git diff` that the tree is identical before assuming their push broke something; a `git pull` merge often resolves to the same tree.

---

## Tooling notes for this machine

- Windows. Bash and PowerShell are both available and take their own syntax.
- The Bash tool's heredocs choke on some TSX. Use a Python heredoc with exact string replacement, or the file writing tool. Assert the match count before replacing so a silent no-op is impossible.
- Scoped replacements only. A blanket string replace once rewrote import paths (`@/common/wallpaper.interface` became `@/common/activeWallpaper.interface`). Use word boundaries and limit the region.

---

## Do not break these

Deliberate solutions that look wrong until you know why. Changing them reintroduces a fixed bug.

**daisyUI already animates modals, in both directions.** `.modal` transitions `visibility` with `allow-discrete`, and `@starting-style` covers the enter. Do not add your own enter animation on top; several earlier attempts did exactly that and none of them worked, because the real problem was elsewhere. Two consequences:
- The dialog must stay mounted and only toggle `open`. Unmounting it kills the exit.
- `@starting-style` covers `.modal` but **not** `.modal-box`. A dialog that mounts already open skips the slide up, which is why `Modal` renders closed for one frame via `open={isOpen && isMounted}`. That line looks pointless. It is not.

**Optimisation mode has two independent paths.** framer is handled by the `Motion` and `Presence` wrappers; CSS transitions are handled by the `html.optimal-mode` class and one rule in `index.css`. A new animation needs whichever path it belongs to. Keyframe animations are deliberately left running so spinners and the notification ping still work.

**`voice-search.portal.tsx` starts the microphone in a mount effect.** Never convert it to always mounted, however tempting it is for animation consistency.

**`containerType: 'size'`** on widget containers looks like dead config. There are no `@container` queries anywhere, so it is inert, not a hot spot. Removing it can change intrinsic sizing. Leave it unless you verify visually.

---

## Design decisions

Intentional behaviour. Not bugs, do not "fix" them.

**Widget canvas collision is push down only, with no compaction.** Gaps between widgets are deliberate and must survive a move. The previous backtracking solver froze the extension for 112 seconds on a single drag; do not reintroduce one. Compaction exists behind an option and is off.

**Pet food rises from below the floor** rather than dropping from above. This was changed once and reverted on request.


---

## Reporting

Lead with the cause, not the fix. Show the offending code. When a claim can be measured or grepped, do that instead of asserting it.

Say plainly when a bug predates the current work, when something was left out and why, and when an earlier statement turns out to be wrong. Several fixes in this session were only correct because a wrong first answer got corrected rather than defended.
