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
| **New branch per fix/feature** | Before editing, create a new branch off the current one (whatever it is) named for the task. Make the changes there, uncommitted. Stop after verification and let the owner test visually themselves. Only commit and open a PR when explicitly told to, in that order. |
| **Fix root causes, not symptoms** | Trace a bug to where it actually originates before writing anything. A patch that suppresses the visible symptom while the real bug stays in place gets rejected, even if it looks fixed. |
| **No opportunistic changes** | Touch only what the task requires. Do not refactor, rename, reformat, or "improve" code that isn't part of the task, even if it's adjacent to what you're editing. |

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

## Code quality

**Minimal, not clever.** Solve the problem with the least code that correctly does it. No speculative configurability, no handling for cases that cannot occur here, no code written "just in case."

**Root cause over patch.** When something is broken, find where it actually breaks and fix it there. Do not bolt a condition onto the symptom site while the real bug stays untouched elsewhere.

**Readable over impressive.** Prefer straightforward control flow and clear names over dense one-liners, deep nesting, or clever tricks. Someone new to this codebase should be able to follow the logic on the first read, without tracing it through three files.

**Small, single-purpose functions and components.** If a function does three unrelated things, split it. If a component is thick with unrelated concerns, it's probably several components.

**Extract shared code only when it's actually shared.** If a piece of logic or markup is used in two or more places, pull it into its own file. If it's used in exactly one place, leave it inline where it's used. Do not pre-emptively split out single-use code into a separate file "for organization" — that just adds indirection and files to jump between for no reason.

**Reuse before you write.** Check `src/components/ui`, `@/common/utils`, and the relevant feature folder for something that already does this before adding a new helper or duplicating logic.

**Small diffs.** Changes should be traceable to the task. Do not rename variables, reformat untouched code, or restructure files you weren't asked to touch — see "No opportunistic changes" above. This only applies to unprompted changes: if the owner explicitly asks for a rename, cleanup, or broader refactor, do it, scoped to what was asked.

**Flag it, don't silently fix it.** If while working you notice unrelated issues in code you touched or passed through — bad variable names, code that's harder to follow than it should be, logic that could be simplified — do not fix it as part of the current task. Mention it as a suggestion in your report instead. Only act on it if the owner then asks you to.

**Say when you're unsure.** If the correct fix depends on something you don't actually understand yet, investigate or ask — don't guess and ship a plausible-looking change. If the uncertainty is about a package (an API that seems to have changed, an unfamiliar option, behaviour that doesn't match what you'd expect), check that package's official docs for the exact version pinned in this repo before implementing, rather than assuming from general knowledge.

---

## Project structure

One structure, applied to everything. A new file that does not fit it means the
structure is being worked around, not extended.

### Layers

```
src/components/ui/                                  presentational primitives, no app knowledge
src/components/                                     cross cutting components that do know the app
src/common/ src/hooks/ src/context/ src/services/   non component globals
src/layouts/ src/pages/                             features
```

Imports point upward through that list and never downward. **Nothing at or above
`src/components/` may import from `src/layouts/**` or `src/pages/**`.** If it needs to,
it is not global: either it belongs inside that one feature, or the thing it reaches
for belongs further up.

### Where a new file goes

Count the places that will import it.

| Importers | Home |
|---|---|
| One file | Beside that file, or inline in it |
| One feature folder | That feature folder |
| Two or more sibling folders | Their nearest common parent |
| Two or more unrelated areas | The matching global layer |

Run the same count backwards before leaving something in a global folder. A global file
with a single consumer is misplaced, not reusable.

### Shape of a feature folder

Every feature folder looks like this, at every depth:

```
<feature>/
  <feature>.<role>.tsx      entry
  <feature>-setting.tsx     settings panel, when it has one
  <feature>.context.tsx     provider, when it has one
  types.ts constants.ts utils.ts
  components/               sub components of this feature
  variants/                 alternate renderers this feature registers
  hooks/ utils/             role folders, once there are two or more files
  __tests__/
  <sub-feature>/            only when it has its own entry file; same shape, recursively
```

**Sub components go in `components/`,** never a folder named after what they happen to
be. One level of nesting inside `components/` is fine for a named group of two or more
files.

**A role folder appears only once it holds two or more files.** One file means no folder:
it sits in the feature root under its own name. This covers `components/`, `hooks/`,
`utils/`, `variants/` and anything like them. It does not cover a folder that *is* the
unit — a feature, a sub feature, a UI primitive, a service domain — which may hold one
file.

**No folder name outside that list.** Not a second word for something already named
there, not a folder standing in for a single file's role.

**A folder's name matches its entry file's name,** plural or singular included.

### Naming

kebab-case for every file and folder. A file that exports no JSX is `.ts`, never `.tsx`.

| Role | Pattern |
|---|---|
| Widget entry | `<name>.widget.tsx` |
| Non widget area entry | `<name>.layout.tsx` |
| Routed page | `<name>.page.tsx` |
| Settings panel | `<name>-setting.tsx` |
| Context provider | `<name>.context.tsx` |
| Server state hook | `<verb>-<noun>.hook.ts` |
| Local React hook | `use-<name>.ts` |
| cva class variants | `<component>.variants.ts`, beside the component |
| Alternate size or display renderer | `variants/<name>-<WxH>.tsx` |
| Domain shape | `<name>.interface.ts`, or `types.ts` for a folder's own types |
| Constants | `constants.ts` |
| Helpers | `utils.ts`, or `utils/<name>.ts` once there are two or more |
| Test | `__tests__/<name>.test.ts` |

Take the suffix from that table rather than inventing one. `variants` is the single word
carrying two meanings, and they do not mix: as a file suffix it is cva classes beside a
component, as a folder it is the alternate renderers a feature registers.

### Before adding a file

1. Does it already exist? Check `src/components/ui`, `@/common/utils`, the feature folder.
2. Who imports it? Apply the table above. One consumer is not a reason for a new file.
3. A component? Then `components/` of the owning feature — or `src/components/ui`, but
   only for a generic primitive with no app knowledge that other areas would reuse.
4. Take the suffix from the naming table.
5. Would this create a role folder holding one file? Then do not create the folder.
6. Re-read the import direction rule before calling it done.

Documentation lives in this file, not in a README beside the code it describes. Nothing
keeps those in sync and they go stale without anyone noticing.

---

## Conventions

**Check `src/components/ui` first.** Before implementing any UI, look in `src/components/ui` for something that already covers it and import from `@/components/ui`. Do not hand roll a dialog or a popover. If the task genuinely needs a component that other parts of the app would reasonably reuse and it isn't in `src/components/ui` yet, build it there and use it from that location — don't leave a reusable component sitting in a feature folder.

**Responsiveness matters.** Every UI change should hold up across screen sizes, not just the one it was eyeballed at. Use the project's UI/UX skills, if available, to guide this.

**Semantic HTML and accessibility are not optional.** Use semantic tags (`button`, `nav`, `header`, `label`, etc.) instead of generic `div`/`span` where one fits, and take `aria-*` attributes, roles, and keyboard/focus behaviour seriously — not just for interactive elements borrowed from `src/components/ui`, but for anything new you build.

**Variants live beside the component** as `*.variants.ts` using `cva`. Extend those rather than piling classes at the call site. A folder named `variants/` is a different thing entirely — see the naming table above.

**Class merging** goes through `cn()` in `@/common/utils/cn` (clsx + tailwind-merge).

**Animation** uses `Motion` and `Presence` from `@/common/motion`, never raw `framer-motion`. The wrappers are what make optimisation mode work.

**Storage** goes through `@/common/storage`. Every key is typed in `src/common/constants/store.key.ts`. Deprecated keys get purged via `purgeDeprecatedStorageKeys`.

**Cross component messaging** uses `callEvent` / `listenEvent` from `@/common/utils/call-event`, typed in the same file.

**Icons** come from `Icon` in `@/icons`.

**Path aliases are declared one per folder** in `wxt.config.ts`, and `@` on its own resolves to the repo root, not to `src`. A folder with no alias there can only be reached as `@/src/<folder>` through WXT's generic `@/*` fallback. That spelling is a missing alias, not a convention — add the folder to the alias map instead of writing it.

**Analytics** via `@/analytics`.

---

## Testing

`bun test` only runs on **pure modules**. There is no React testing setup, so a hook or component cannot be rendered in a test.

When logic is worth covering, extract it into a dependency free module and test that. Precedents:

- `src/layouts/widgets/layout-engine/` — grid collision maths
- `src/layouts/widgets/pet/core/pet-movement.ts` — pet movement maths
- `src/common/utils/animation-timing.ts` — shared timing plus the retain predicate

A test file must not transitively import `@/services/api`; it reads `browser.runtime.getManifest()` at module scope and bun has no `browser` global. That is why timing constants live in their own module rather than next to the hook that uses them.

Prefer a test that would fail loudly on regression over one that restates the implementation. The layout engine has a timing budget test because the bug it guards was a 112 second freeze.

---

## Git and PR workflow

**Commit messages** state the problem, the actual cause with the offending code, then the fix. Wrap at ~76 characters. No bullet soup without a lead in.

**PR bodies** follow: Problem → Root cause with the real snippet → Changes → anything deliberately left out → Testing. Include measurements when you have them.

**gh CLI** lives at `C:\Program Files\GitHub CLI\gh.exe` and is not on PATH — this is where it's installed for the user `Shak`. Call it by full path, from PowerShell for anything with a multiline body.

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
