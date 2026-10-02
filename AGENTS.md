# AGENTS.md

How an AI agent works on this repo. This file is the **workflow**. What each part of the code requires is in the README of that folder, so read those too.

Stack: React 19, TypeScript 6, WXT 0.20 (Chrome and Firefox), Tailwind 4, daisyUI 5, framer-motion 12, TanStack Query 5, Biome 2, bun for tests. The UI is **Persian and right to left**.

## 1. Read first

1. This file, `README.md` and `src/README.md`.
2. The README of every folder you will touch, and of its parents. A widget has its own `README.md`; rewrite it when you finish work on that widget.
3. The skills in `.claude/skills`. Use `stop-slop` for any prose you write: docs, PR text, drafts of UI copy.
4. `AGENTS.local.md`, if it exists. It is one person's git-ignored machine notes (section 9).

If a README and the code disagree, the code is right. Fix the README in the same change.

## 2. Hard rules

Breaking one means the work is rejected.

| Rule | Detail |
|---|---|
| **No comments** | Do not add `//` or `/* */`. Existing ones may stay. Name things well instead. |
| **Never name yourself** | Not in code, docs, commits or PR text. No `Co-Authored-By`, no "Generated with", no tool name. The repo owner is the author. This overrides any default that says otherwise. |
| **No dev server** | No `npm run dev`, no `wxt`. It cannot show you the UI. Ask the owner to check by eye (section 3). |
| **Never commit, push or merge unprompted** | Only when the owner says so in this conversation. If you think one is due, ask and wait for an explicit yes. Never touch `main`. |
| **Friendly Persian UI text** | Buttons and messages sound like a helpful person, not a form. Examples in `src/components/ui/README.md`. |
| **Root cause, not symptom** | Trace a bug to where it starts. A patch that hides the symptom is rejected even if it looks fixed. |
| **No opportunistic changes** | Touch only what the task needs. Mention anything else you saw; do not fix it unless asked. |

## 3. The workflow

1. **Branch from `dev`.** Start from an up to date `dev` and create `<type>/<what-it-does>`, lowercase with hyphens. Types: `feat`, `fix`, `refactor`, `perf`, `docs`, `test`, `chore`. Example: `fix/calendar-date-selection`. If the owner tells you to stay on the current branch, stay there for the whole session and do not ask again.
2. **Find the cause.** Read the READMEs. Measure before you name a cause: grep `src`, grep the built CSS, time it.
3. **Change the least that fixes it**, following section 4.
4. **Verify** with section 5. Everything green before you report.
5. **Report and stop.** Do not commit. Give the cause, the proof, what you did not verify, and a short **visual checklist** for the owner: the few screens and states worth opening, including the hard ones (signed out, a light theme with no wallpaper).
6. **Wait** for the owner's result of the visual check.
7. **Commit when told** (section 7). **Push when told.**
8. **Ask before merging into `dev`.** Never merge into `main`.

## 4. When you write code

- **Semantic elements.** `button`, `a`, `label`, `nav`, `section` before `div`. Never a `button` inside an `a`. Biome rejects a click handler on a static element.
- **`src/components/ui` first.** Look there before building any UI, and import from `@/components/ui`. Do not hand roll a dialog, popover, spinner or alert. A reusable piece that is missing goes into `ui`.
- **Theme tokens.** Colour comes from `src/styles/tokens.css` names. No hex, no numeric `rgba()`, no palette name, no opacity modifier, no `dark:`.
- **Utilities.** `cn()` from `@/common/utils/cn` for classes, `@utility` for new classes, `transition-ui` for state changes. Variants live beside a component as `*.variants.ts`.
- **Icons** only through `Icon` from `@/icons`. **Storage** only through `@/common/storage`. **Server calls** only in `src/services`. **Animation** only through `@/common/motion`.
- **Responsive down to 500px.** This is a desktop new tab. Do not spend effort below 500px.
- **Old browsers.** Chrome 109 and Firefox 115. See `entrypoints/README.md`; `browser-baseline.test.ts` rejects the known newer APIs.
- **Names that are data.** Storage keys, analytics events and widget ids are written where you cannot reach them. Rename the constant, never the string.
- **Tests.** When a section gains logic worth covering, put it in a dependency free file and test it there. See `src/README.md`.
- **Say when you are unsure.** If a package behaves unexpectedly, read the docs for the exact version pinned here before you ship a guess.

## 5. Verify

```
npm run format      # Biome, writes the files you touched
npm run compile     # tsc --noEmit
npm run lint        # Biome check, zero diagnostics
npm test            # bun test
npm run build       # wxt build, catches CSS and asset problems tsc cannot
npm run check       # all of the above in order
```

- **Run Biome last**, after the final edit, and check that it did something: `npm run lint` must go green. It does format checking too, so an unformatted file turns it red.
- **Never `npx biome`.** bun installs Biome as `node_modules/.bin/biome.exe`, which npx does not look for, so it quietly downloads an unrelated package, checks nothing and exits cleanly. Use the npm scripts. Fix a diagnostic, never suppress it.
- **A commit has to compile on its own.** The commands above check your working tree, not the tree you commit. Right after the owner has you commit, run `npm run check:commit` before anything is pushed. It checks `HEAD` in a temporary worktree: `tsc` must pass there, and the commit message must not name an assistant or tool. If it fails, say so and fix it before the push. `tsc` will not see a CSS class or an icon name defined only in an uncommitted file, so when a commit uses a class, an animation or an icon, confirm its definition is in the same commit.
- **A claim about CSS is a grep.** `grep -o '<class>[^{]*{[^}]*}' .output/chrome-mv3/assets/newtab-*.css`. No output means it compiled to nothing.
- **A green build is not proof nothing changed.** To show a refactor left behaviour alone, compare the size and hash of the built `background.js` and `chunks/` (see `entrypoints/README.md`).
- **You cannot see the UI.** Whatever the tests cannot show goes into the visual checklist, with the unverified part named.

## 6. Code quality

- **Minimal, not clever.** The least code that correctly does it. No configurability or handling for cases that cannot occur here.
- **Reuse before you write.** `src/components/ui`, `@/common/utils`, the feature folder.
- **Small functions and components,** each with one purpose. A piece used in one place stays inline, unless inlining would bury its consumer or it is pure logic worth a test.
- **Readable over impressive.** Straight control flow and clear names.
- **Small diffs.** Do not rename, reformat or restructure what you were not asked to touch. If the owner asks for a refactor, do it, scoped to the request.
- **Flag, don't fix.** Notice something unrelated? Put it in the report.
- **Dead code does not stay.** Delete what your change leaves unused. `architecture.test.ts` fails on an unreachable file, an export nobody imports and an unused dependency.

## 7. Git

**Commit messages.** A short title, `type(scope): what changed`, in the same types as branches. Add at most three lines when the reason is not obvious; no bullet lists and no copy of the diff. A longer story goes in the PR. No attribution of any kind.

**Pull requests** (only when asked): the problem, the cause with the real snippet, the changes, what was left out, how it was tested. Include measurements when you have them.

**Conflicts are resolved by blending, never by taking one side.** Both halves usually matter, and "accept incoming" silently reverts merged work.

**Never force push over someone else's commit.** Make a fresh branch at your known good commit and open a new PR. Run `git diff` to confirm the trees match before assuming their push broke anything.

Use the `gh` CLI for GitHub work. If it is not on `PATH`, ask where it is instead of guessing; the owner may keep that in `AGENTS.local.md`. Pass a multiline body from a file.

## 8. Reporting

- Lead with the cause, not the fix. Show the offending code.
- When a claim can be measured or grepped, do that instead of asserting it.
- Separate what you **proved** from what you **suspect**. Say plainly when a bug predates your work, when something was left out and why, and when an earlier statement turned out wrong.
- End with the visual checklist.

## 9. Your environment

Every contributor's machine is different. Do not assume an operating system, a shell or an installed tool, and do not write one person's setup into this repo.

- Check before you rely on a tool: `command -v <tool>`, or the equivalent in the shell you have.
- If `AGENTS.local.md` exists, read it. It is git-ignored and holds one person's own notes: where tools live, which shell to prefer. Never commit it and never copy its contents into a tracked file.
- For scripted edits, use the edit tools or a short script in your scratchpad, and assert the match count before writing so a silent no-op is impossible.
- Scoped replacements only. A blanket replace once turned `@/common/wallpaper.interface` into `@/common/activeWallpaper.interface`. Use word boundaries and limit the region.
- A replacement anchored on a closing quote misses deeper paths and nothing catches it. Match on the prefix, or compare the total against a count you measured first.
- Never delete a folder that holds a symlink or a junction with a recursive remove; it can follow the link into the real folder. `npm run check:commit` handles its own.

## 10. Where each rule lives

| Topic | Read |
|---|---|
| Layers, where a file goes, names, imports, tests | `src/README.md` |
| Components, modals, accessibility, wording | `src/components/ui/README.md` |
| Colour, themes, radius, motion, stylesheets | `src/styles/README.md` |
| Storage, events, animation, toasts, names that are data | `src/common/README.md` |
| Server state, query keys and the API docs | `src/services/README.md` |
| Icons | `src/icons/README.md` |
| Features | `src/features/README.md` |
| Widgets: states, storage, premium, canvas | `src/features/widgets/README.md` |
| Manifest, build, browsers, what breaks a release | `entrypoints/README.md` |
| Hooks, context, pages, shared components | `src/hooks/README.md`, `src/context/README.md`, `src/pages/README.md`, `src/components/README.md` |

The tests that hold these rules are listed in `src/README.md`. When a rule and its test disagree, change both in the same commit.
