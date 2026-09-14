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

**A green build is not proof that nothing changed.** To show a refactor left behaviour alone, record the byte size and content hash of `.output/chrome-mv3/background.js` and the chunks under `.output/chrome-mv3/chunks/` before the change, then rebuild and compare. The hash is derived from the content, so an unchanged hash means the emitted code is identical. A deliberate change should move those numbers by an amount you can explain — inlining one nine line component moved a chunk by exactly 38 bytes.

---

## Renaming and the published extension

Source file names do not reach the published extension. Everything under `src/` is bundled
and minified into `background.js` and a couple of chunks, `sourcemap` is off in
`wxt.config.ts`, and grepping the built output for any source file name returns nothing. A
rename that only moves files and rewrites imports produces a byte identical bundle, down to
the content hash in the chunk filename.

Four things genuinely can break a published build, and none of them is a file name:

- **Storage key values.** Changing a key string orphans every existing user's data. The
  file holding the keys may be renamed freely; the strings inside it may not.
- **`entrypoints/`.** WXT derives the manifest from that directory, so renaming anything in
  it changes the manifest.
- **The manifest** — version, permissions, `gecko.id`, `chrome_url_overrides`.
- **A dynamic import built from a template literal.** This is the only one a rename can
  break silently: `tsc` cannot follow it and the build still succeeds. Grep for a backtick
  immediately after `import(` before any bulk rename. There are none in this repo today.

When someone asks whether a rename is safe to ship, answer with those four and with a
bundle comparison, not with reassurance.

---

## Code quality

**Minimal, not clever.** Solve the problem with the least code that correctly does it. No speculative configurability, no handling for cases that cannot occur here, no code written "just in case."

**Root cause over patch.** When something is broken, find where it actually breaks and fix it there. Do not bolt a condition onto the symptom site while the real bug stays untouched elsewhere.

**Readable over impressive.** Prefer straightforward control flow and clear names over dense one-liners, deep nesting, or clever tricks. Someone new to this codebase should be able to follow the logic on the first read, without tracing it through three files.

**Small, single-purpose functions and components.** If a function does three unrelated things, split it. If a component is thick with unrelated concerns, it's probably several components.

**Extract shared code only when it's actually shared.** If a piece of logic or markup is used in two or more places, pull it into its own file. If it's used in exactly one place, leave it inline where it's used. Do not pre-emptively split out single-use code into a separate file "for organization" — that just adds indirection and files to jump between for no reason.

Two things override that, and only these two. A single-use piece large enough that inlining it would bury its consumer stays in its own file — a hundred lines of markup or drawing code does not belong in the middle of a component. Pure logic worth a test also stays in its own dependency free module, because that is the only way it can be tested here (see Testing). Both are judgments about whether the consumer gets worse, not about tidiness, so say which one you are invoking.

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

Two questions, in this order. **Which feature owns it** — count the places that will
import it:

| Importers | Owner |
|---|---|
| One file, or one feature folder | That feature folder |
| Two or more sibling folders | Their nearest common parent |
| Two or more unrelated areas | The matching global layer |

Run the same count backwards before leaving something in a global folder. A global file
with a single consumer is misplaced, not reusable.

**Then which folder inside that owner** — that is settled by the file's role, under
"Shape of a feature folder" below, and never by the import count. A helper used once and
a helper used ten times both live in `utils/`. The count decides ownership; the role
decides placement.

### Shape of a feature folder

Every feature folder looks like this, at every depth:

```
<feature>/
  <feature>.<role>.tsx      entry
  <feature>-setting.tsx     settings panel, when it has one
  <feature>.context.tsx     provider, when it has one
  types.ts constants.ts     this feature's own types and constants, flat
  components/               sub components of this feature
  variants/                 alternate renderers this feature registers
  hooks/ utils/             role folders, whenever the feature has files of that kind
  __tests__/
  <sub-feature>/            only when it has its own entry file; same shape, recursively
```

**Sub components go in `components/`,** never a folder named after what they happen to
be. One level of nesting inside `components/` is fine for a named group that belongs to
one sub feature.

**Every file sits in the folder for its role,** whether the feature has one of them or
twenty. A helper goes in `utils/`, a hook in `hooks/`, a sub component in `components/`,
an alternate renderer in `variants/`. A role folder with a single file is correct and
expected; a role folder that would be empty is simply absent. The point is that any
feature folder can be read without opening it, and that the same kind of file is always
found in the same place.

**Types and constants are the exception: inside a feature they stay flat** as `types.ts`
and `constants.ts` in the feature root, because they describe the feature itself rather
than being a collection of like things. They take a folder only in the global layer,
where many unrelated features' shapes and values live side by side.

**No folder name outside that list.** Not a second word for something already named
there, not a folder standing in for a single file's role.

**A feature or sub feature folder's name matches its entry file's name,** plural or
singular included: `habit/` holds `habit.widget.tsx`. This does not reach role folders or
a named group inside `components/` — those hold a set of files and have no entry to match.

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
| Helpers | `utils/<name>.ts`, named for what the helper does |
| Test | `__tests__/<name>.test.ts` |

Take the suffix from that table rather than inventing one. `variants` is the single word
carrying two meanings, and they do not mix: as a file suffix it is cva classes beside a
component, as a folder it is the alternate renderers a feature registers.

**A role word is part of the name, joined with a hyphen, never a dot.**
`holiday-badge.tsx`, not `holiday.badge.tsx`. `habit-item-skeleton.tsx`, not
`habit-item.skeleton.tsx`. Only the suffixes in the table above take a dot, and that list
is closed — `.item`, `.badge`, `.modal`, `.dropdown`, `.skeleton` and the rest are not
suffixes, they are the last word of the name.

### Before adding a file

1. Does it already exist? Check `src/components/ui`, `@/common/utils`, the feature folder.
2. Who owns it? Apply the table above. One consumer is rarely a reason for a new file —
   check the two exceptions in Code quality before deciding it is.
3. A component? Then `components/` of the owning feature — or `src/components/ui`, but
   only for a generic primitive with no app knowledge that other areas would reuse.
4. Take the suffix from the naming table.
5. Does the feature already have the role folder this file belongs in? Create it if
   not; a single file in it is fine.
6. Re-read the import direction rule before calling it done.

Documentation lives in this file, not in a README beside the code it describes. Nothing
keeps those in sync and they go stale without anyone noticing.

---

## Conventions

**Check `src/components/ui` first.** Before implementing any UI, look in `src/components/ui` for something that already covers it and import from `@/components/ui`. Do not hand roll a dialog or a popover. If the task genuinely needs a component that other parts of the app would reasonably reuse and it isn't in `src/components/ui` yet, build it there and use it from that location — don't leave a reusable component sitting in a feature folder.

**Import through a barrel, not past it.** Where a folder has an `index.ts` —
`@/components/ui`, `@/components/gallery` — import from the folder, never from the file
behind it. The one exception is a file inside that same folder importing a sibling:
`popover-menu.tsx` reaches `@/components/ui/portal/portal` directly because going through
its own barrel would be a circular import. A deep path from outside is drift; a deep path
from inside the barrel's own folder is deliberate, so leave it.

**Responsiveness matters, down to 500px wide.** This is a desktop browser extension: it renders in a new tab on a computer, never on a phone. 500px is the narrowest width worth supporting, so a layout that holds from 500px up is done — do not spend effort on narrower breakpoints or phone specific behaviour.

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

## Colour and theming

Themes are chosen by a `data-theme` attribute on `<html>`, never by OS preference, and a theme can also be fetched at runtime from a CDN. **The set of themes is open ended, so no code may assume what a token contains** — not its lightness, not its hue, not whether it is opaque.

That single constraint produces every rule below. They apply to any colour decision anywhere in the app, not just to the themes that happen to ship today.

### Colour belongs to a token, unless it depicts something

Before writing any colour, decide which of two kinds it is.

**Chrome** is the interface: surfaces, text, borders, states, emphasis. Chrome must come from a token, because it has to survive a theme nobody has written yet. A literal colour in chrome is a bug even when it looks right today.

**Content** is a colour that carries its own meaning and would be wrong to re-theme: a thing being depicted (artwork, an illustrated object), a palette the user picks a value out of, a colour derived from an image, or a fill handed to an API that cannot take a class. Content is correctly hardcoded, and converting it to a token breaks it.

When the same non-token colour appears in more than a couple of places, it is neither — it is a missing token. Name it once in the theme layer and point every site at that name.

### Tokens come in pairs, and the pair is the unit

Every surface token has a matching content token that is the only safe foreground on it. Use them together. Writing a literal foreground on a token background works until the token moves, and then it fails silently, because nothing in the build checks contrast.

**When you add or edit a theme, check every pair.** Convert both sides to relative luminance and compute the WCAG ratio: nothing below **3:1**, and anything under 4.5:1 needs a reason. Two things will mislead you when you do:

- **A token carrying alpha cannot be scored on its own.** It composites over whatever is behind it, so a naive reading pairs two near-identical values and reports a failure that does not exist. Score opaque pairs; judge translucent ones by eye.
- **A low ratio can be the brand rather than a defect.** If fixing it means changing the brand colour, it is not yours to fix — record it instead.

### Never put an opacity modifier on a surface token

Tailwind compiles `/N` to a `color-mix` against transparent, which **multiplies** whatever alpha the token already has. A theme is free to define its surfaces as translucent, and some do. The same class then lands anywhere between its nominal value and near zero depending on the theme, so an element styled this way disappears in exactly the themes where it mattered.

To tint a surface, dilute the **content** token instead. A content token is near opaque in any sane theme and contrasts its own background by definition, so one class behaves the same everywhere: a light wash on dark themes, a dark wash on light ones.

### Anything drawn over an image is its own context

The app renders over a user supplied wallpaper, and individual surfaces may carry their own artwork. Chrome floating on unknown pixels cannot borrow lightness from the theme, because the theme says nothing about what is behind it. Use a token pair that is dark-surface-plus-light-foreground in every theme, and rely on it rather than on the surface tokens, which may be transparent or may invert.

### Never use the OS-keyed variants

`dark:` and `light:` key off `prefers-color-scheme`, which is unrelated to `data-theme`. They fire for a user whose OS disagrees with the theme they chose. Grep for them rather than assuming one is load bearing: none belong in `src`, so every hit is something to remove.

### Prefer the project's semantic class over the raw utility

`src/index.css` defines short names for the combinations this app actually uses — its surfaces, its body and muted text, its border, its widget radius. Use those rather than the underlying utility. They are the single place a decision like "what is a muted foreground" can be changed, and a raw utility at a call site opts that site out of any future change. When a combination you need has no name yet, add one there rather than inventing a new opacity step inline.

### Verifying

A theme is an attribute and a class is text, so both claims are checkable and neither should be asserted from memory:

```
npm run build
grep -o '<the-class>[^{]*{[^}]*}' .output/chrome-mv3/assets/newtab-*.css
```

No output means the class compiled to nothing. Note that the compiler merges selectors that share a declaration, so match loosely — an exact `.class{` anchor can miss a rule that is present. To read what a token actually resolves to, pull the theme's block out of the same file.

### Known debt

Four shapes of debt exist in bulk. Do not treat them as fixed; do not sweep them inside an unrelated task; never add to them. Counts move every time work lands, so measure rather than quote a number from here:

```
grep -rnoE '(bg|text|border|shadow|ring|from|to|via)-[a-z-]+/[0-9]+' src | wc -l
```

That is a starting point, not an answer: it counts every opacity modifier, and the ones on content tokens are the prescribed way to tint. Narrow it to the token you are actually chasing before reporting a figure.

- **Opacity modifiers on surface tokens.** Not swept because a theme that defines a surface translucent *means* it to be faint, so most sites read as thin rather than broken, and a blanket rewrite would change every theme to repair the handful that break. Fix them when you are already in the file.
- **Hardcoded colours**, in five shapes: `white`/`black` classes, numbered palette classes, raw hex literals, `rgb()`/`rgba()` literals, and arbitrary-value classes. Counting only classes in `.tsx` misses more than half of it — scan `.ts` and raw literals too. A meaningful share of them are content by the test above and must stay as they are; the rest are chrome.
- **Theme stylesheets carrying rules for class names that no longer exist.** A theme file outlives the markup it was written against, so a selector living there is not evidence the class is still used. Grep `src` before trusting one.
- **The semantic class and its raw equivalent both in wide use for the same thing.** New code uses the semantic one.

---

## Testing

`bun test` only runs on **pure modules**. There is no React testing setup, so a hook or component cannot be rendered in a test.

When logic is worth covering, extract it into a dependency free module and test that. Precedents:

- `src/layouts/widgets/layout-engine/` — grid collision maths
- `src/layouts/widgets/pet/utils/pet-movement.ts` — pet movement maths
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
- A replacement anchored on the closing quote misses deeper paths, and nothing catches it. Replacing `'@/src/icons'` left `'@/src/icons/types'` behind; the old path still resolved, so `tsc`, biome, the tests and the build all stayed green with one file unconverted. Match on the prefix, or assert the total count against a number you measured first and let the script refuse to write when it disagrees.

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

**Toasts are deliberately always dark**, in every theme. They are a transient layer over the page rather than part of it, so they do not follow the theme tokens and their colours are written literally. The literals sit inside Tailwind arbitrary-value classes, which the class scanner only sees as static text, so they cannot be lifted into constants. Leave them.

**Pet food rises from below the floor** rather than dropping from above. This was changed once and reverted on request.

---

## Reporting

Lead with the cause, not the fix. Show the offending code. When a claim can be measured or grepped, do that instead of asserting it.

Say plainly when a bug predates the current work, when something was left out and why, and when an earlier statement turns out to be wrong. Several fixes in this session were only correct because a wrong first answer got corrected rather than defended.
