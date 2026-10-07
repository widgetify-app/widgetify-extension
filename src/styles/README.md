# Design tokens

Every colour in the app is a name declared in `tokens.css`. The names sit inside
`@theme`, so one line makes Tailwind generate every prefix for it — `bg-`,
`text-`, `border-`, `ring-`, `outline-`, `from-`, `to-`, `via-`, `divide-`,
`fill-`, `stroke-`, `shadow-` — and every variant (`hover:`, `focus:`,
`group-hover:`) works, because they are real utilities rather than plain rules.
Only the classes a file actually uses reach the stylesheet.

`__tests__/design-system.test.ts` fails the build on a colour class whose name
is not declared in `tokens.css` (or by the theme itself, see below), on a
Tailwind palette name (`bg-blue-500`), on an opacity modifier (`bg-fill/50`), on
a raw daisyUI base class (`bg-base-200`) and on a hex literal in a class.

## Rules, and the test that holds each

Themes are chosen by a `data-theme` attribute on `<html>`, never by the OS, and a
theme can be fetched from a CDN at runtime. **The set of themes is open ended, so
no code may assume what a token contains**: not its lightness, not its hue, not
whether it is opaque. Every rule below follows from that.

| Rule | Test (`design-system.test.ts`) |
|---|---|
| Colour classes use names `tokens.css` declares | "names only colours that tokens.css or the theme declare" |
| No Tailwind palette colour (`bg-blue-500`) | "never uses a Tailwind palette colour" |
| No opacity modifier on a colour (`bg-fill/50`) | "never puts an opacity modifier on a colour utility" |
| No hex and no numeric `rgba()` in a class | "never writes a colour literal into a class", "never writes a numeric rgb() or rgba() into a class" |
| `white` and `black` only where they depict something | "are written only where they depict something" |
| No `dark:` or `light:` variants | "never uses the OS-keyed dark:/light: variants" |
| Text, radius, z-index and shadow come from their scales | "sizes text from the scale", "rounds corners from the radius scale", "puts page-wide layers on a named z-index", "uses only the four shadow steps elevation.css defines" |
| Transitions use `transition-ui` or name a property, on the duration steps | "never transitions every property", "times transitions from the duration steps" |
| Every class compiles to CSS | "are only ones that compile to CSS" |
| Stylesheets have one role, themes are only variables | "every stylesheet has one role", "themes" |
| No `oklch()` or `color-mix()` (Chrome 109) | "stylesheets stay parseable on Chrome 109" |

## Chrome or content

Decide which of two kinds a colour is before you write it.

**Chrome** is the interface: surfaces, text, borders, states, emphasis. It must
come from a token, because it has to survive a theme nobody has written yet. A
literal colour in chrome is a bug even when it looks right today.

**Content** carries its own meaning and would be wrong to re-theme: artwork, an
illustrated object, a palette the user picks from, a colour taken from an image,
a fill handed to an API that cannot take a class. Hardcode it where it is drawn.

When the same non-token colour appears in more than a couple of places it is
neither: it is a missing token. See "Adding a colour".

## Pairs, opacity and imagery

- **Tokens come in pairs.** A surface token has a content token that is the only
  safe foreground on it (`bg-brand` with `text-on-brand`). When you add or edit a
  theme, compute the WCAG ratio for every opaque pair: nothing below 3:1, and
  anything under 4.5:1 needs a reason. A token with alpha cannot be scored alone.
  A low ratio that can only be fixed by changing the brand colour is not yours to
  fix; record it.
- **Never put an opacity modifier on a surface token.** Tailwind compiles `/N` to
  a `color-mix` against transparent, which multiplies whatever alpha the token
  already has, so the element vanishes in the themes that define translucent
  surfaces. To tint, dilute the content token instead: that is what `fill`,
  `fill-2` and `fill-3` are.
- **Anything drawn over an image is its own context.** The theme says nothing about
  the pixels behind it. Use the `image-*` and `scrim-*` names below.
- **Check the built CSS, not the markup.** A class that does not exist compiles to
  nothing and nothing complains.

```
npm run build
grep -o '<the-class>[^{]*{[^}]*}' .output/chrome-mv3/assets/newtab-*.css
```

No output means it compiled to nothing. The compiler merges selectors that share a
declaration, so match loosely.

## Which file owns what

`index.css` is the entry: `main.tsx` imports it and nothing else, and it imports
every other file. Each file holds one kind of thing, and the test rejects
anything else in it.

| file | holds |
|---|---|
| `primitives.css` | `@theme` values: the palette ban, fonts, the small type steps, the line heights, radius, motion, the page-wide layers, the vip colour. Plus the brand constants every theme builds its primary from. |
| `tokens.css` | the colour vocabulary. Nothing else declares a colour name. |
| `elevation.css` | the shadow scale `shadow-sm` … `shadow-xl`, and its default colour. |
| `animations.css` | every `@keyframes`. One that a class uses sits in `@theme` with its `--animate-*`, so it ships only while something uses it. |
| `themes/<name>.css` | one theme: its daisyUI block and one block of variables. No selectors. |
| `base.css` | element defaults, all inside `@layer base` so a utility always wins over them. |
| `utilities.css` | `@utility` only: `transition-ui`, `focus-ring`, the `z-*` layers, the glass family, `theme-scope` (see below), `scrollbar-none`, the blur-mode pair, `widget-control` / `widget-info`, which show and hide a widget's controls on hover, and `widget-control-fade`, which fades the content under a control laid over it (see `src/features/widgets/README.md`). |
| `legacy.css` | Chrome 109 fallbacks for what daisyUI writes. |

A class is only ever an `@utility`. A plain `.class {}` rule sits outside
Tailwind's layers, so it beats every utility on the element and takes no
variants: `hover:` on it compiles to nothing.

## The vocabulary

Names say what a colour is for, not where it sits on a ladder, so `bg-fg` and
`text-surface` would be nonsense rather than a different colour. Percentages
are of the theme's own colour.

**Text** — `fg-strong` 100 · `fg` 90 · `fg-muted` 70 · `fg-faint` 50 · `fg-ghost` 20.
`fg-ghost` is for decoration and inactive icons, never for text someone has to read.

**Surfaces** — what a thing sits on, all opaque except the veil.

| token | for |
|---|---|
| `surface` | a widget, a date picker, anything that is the base layer |
| `surface-2` | a panel, card, modal or input on top of it |
| `surface-3` | a raised control; also the border colour of surfaces |
| `surface-veil` | a translucent panel or badge over imagery. 80% of `surface`, multiplied into the theme's own alpha so glass and icy thin out instead of turning opaque. |

**Ink fills** — the foreground colour as a wash. They lighten on dark themes and
darken on light ones. `fill` 5 (rest) · `fill-2` 10 (hover, selected) · `fill-3` 20 (pressed).

**Line** — `line` 15. Every translucent border, ring, divider and SVG track.
There is one line on purpose: a 10% border next to a 15% one is noise, not
hierarchy.

**Brand** — `brand` · `on-brand` (the only foreground on `bg-brand`) ·
`brand-fill` 10 · `brand-fill-2` 20 · `brand-muted` 50 (the hover border,
progress bars) · `brand-hover` 90 (a solid brand button under the pointer).

**Status** — each has the solid colour and its `on-` pair, plus the tints the
app actually uses:

| | solid | on | fill 10 | fill-2 20 | hover 90 |
|---|---|---|---|---|---|
| `danger` | ✓ | ✓ | ✓ | ✓ | |
| `success` | ✓ | ✓ | ✓ | ✓ | |
| `warning` | ✓ | ✓ | ✓ | ✓ | |
| `info` | ✓ | ✓ | ✓ | ✓ | |
| `secondary` | ✓ | ✓ | ✓ | | |
| `vip` | ✓ | ✓ | ✓ | ✓ | ✓ |

`success`, `warning`, `info` and `secondary` are declared by daisyUI and `vip`
by `primitives.css`, under exactly those names, so `tokens.css` only adds their `on-`
and tint names. Redeclaring one there would make it refer to itself.

**Over imagery** — chrome drawn on a wallpaper or a photo follows no theme,
because the theme says nothing about the pixels behind it: `image-fg` (white) ·
`image-fg-muted` (white 75) · `image-fill` (white 20) · `image-line` (white 30) ·
`scrim-strong` (black 85) · `scrim` (black 60) · `scrim-soft` (black 20). Text on
a solid accent is never one of these: it is that accent's `on-` pair. A numeric
`rgba(0,0,0,…)` or `rgba(255,255,255,…)` in a class is rejected by a test, except in `toast.tsx` and
the pet hearts' drop shadow; take the nearest step above, or write it from a theme channel
(`rgba(var(--color-error-rgb),0.6)`).

**Navbar** — `nav` · `nav-hover` for the navbar's buttons, `nav-idle` ·
`nav-idle-hover` for its inactive tabs. They default to `fg-faint` → `fg-strong`
and `fg-ghost` → `fg-faint`; `light` points all four one step darker, because
its navbar is near white.

A theme may point any name in `tokens.css` somewhere else from its own variable
block, as `light` does for the navbar. The default stays in `tokens.css`, so a
theme that says nothing gets it.

## Glass

Glass and icy frost the surfaces that float over the wallpaper.
`bg-glass-<token>` is that token in every theme that sets no glass, and the
theme's glass tint and blur in one that does: `bg-glass-surface-2` is a panel,
`bg-glass-surface` a widget. Give every state background on the same surface the
same family (`hover:bg-glass-surface-3`), or glass themes swap the frost for the
plain token on hover. `backdrop-glass` is the blur alone, for a surface whose
children draw the background, and `bg-glass-modal` is the modal's heavier one.

A theme opts in with four variables: `--glass-bg` and `--glass-filter`, and
`--glass-modal-bg` and `--glass-modal-filter`. Leave out any of them and that
part falls back to the plain token.

## Showing another theme inside the page

The store and the appearance settings draw a small picture of a theme that is
not the active one. An element with `data-theme="<name>"` gets that theme's
daisyUI variables, but Tailwind resolved the tokens above on `<html>`, so
`bg-surface` inside it still paints the active theme. `theme-scope` declares the
tokens the picture uses again on the element, and they resolve against the theme
it names. When a picture starts using another token, add that token to the list.
A theme from the CDN has no CSS on the page until you activate it, so the store
fetches it and scopes its root rules to that one `data-theme`
(`features/market/utils/theme-css.ts`).

## Adding a colour

Work down the list and stop at the first match.

1. **A token already covers the role.** Use it, even if the value you had in
   mind is a few percent off. A 12% border is `line`.
2. **The colour depicts something** — a medal, an avatar, a picked colour.
   Hardcode it where it is drawn and add the file to `paintsContent` in the test.
3. **Only one component needs it.** Write it inline from the theme channels,
   never as a hex: `border-[rgba(var(--color-error-rgb),0.5)]`.
4. **It repeats across areas.** Add one line to `tokens.css`, built from a theme
   variable (`var(--color-…)` or `rgba(var(--color-…-rgb), a)`). The test rejects
   anything else outside the over-imagery names.

A hover or selected state must land on a different token from its rest state,
or it silently stops doing anything. The usual steps: `fill` → `fill-2`,
`line` → `brand-muted`, `brand-fill` → `brand-fill-2`, `surface-3` → `line`.

## Why the channel triples live outside the `@plugin` block

Every tint is `rgba(var(--color-x-rgb), a)` rather than an opacity modifier,
because `color-mix()` and `oklch()` both landed in Chrome 111 and Chrome 109 is
the last version Windows 7/8.1 can run.

That means the `-rgb` triples are load-bearing — and **daisyUI silently drops
any value containing a comma from its `@plugin "daisyui/theme"` block**. A
triple written inside it never reaches the stylesheet, every `rgba()` built on
it becomes invalid at computed-value time, and the declaration is dropped. The
property then falls back to an inherited value: a `border-line` asked for at
15% renders at *full* text colour, because the initial value of `border-color`
is `currentColor`.

So each theme declares them in a plain `[data-theme="…"]` rule after the block.
Three tests guard this: all themes must declare the same variables, all must
declare the full channel set, and none may put a channel back inside the
`@plugin` block.

## Shadows

`shadow-sm`, `shadow-md`, `shadow-lg` and `shadow-xl` are the only steps.
`elevation.css` replaces Tailwind's scale with them, so the class names are the
familiar ones but the values follow the theme: a light wash on light themes and
a much heavier one on dark themes, where Tailwind's stock 10% black is
invisible. Each theme sets its own four `--elevation-*-color`; `elevation.css`
holds the light default for a theme that sets none. They stay real Tailwind shadows, so they combine with `ring-*` on
the same element and take a colour: `shadow-md shadow-brand-fill-2` is a brand
glow. `shadow-xs`, `shadow-2xl` and `shadow-inner` compile to nothing, and a
test rejects them.

## Line height

`html` and `body` use `leading-body` (1.5625, Vazirmatn's own box; `base.css`
explains why it is stated at all). Headings and controls use `leading-control`
(1.4), set through `--tw-leading`: Tailwind's `text-*` sizes read that variable
before their own line height, so `text-sm` on a button keeps 1.4, while an
explicit `leading-*` still wins. `leading-tight` is 1.25 and `leading-relaxed`
1.75.

## Scrollbars

Every scrollbar is thin, with a `fg-ghost` thumb on a clear track. Set once in
`base.css`, through `scrollbar-color` for current browsers and
`::-webkit-scrollbar` for Chrome before 121. `scrollbar-none` hides one.

## Type

Text below `text-xs` has three steps: `text-2xs` 11px · `text-3xs` 10px ·
`text-4xs` 9px. Unlike `text-xs` and up they set no line height, so they inherit
it exactly as the pixel values they replaced did. From `text-xs` up it is
Tailwind's scale. A test rejects any size written in `px`, `rem` or `em`
(`text-[13px]`); pick the nearest step instead. Widgets that scale with their
container keep `cqh`/`cqw` sizes.

## Radius

Each step has a role. Pick it by what the element is, not by what looks close:

| step | px | for |
|---|---|---|
| `rounded-xs` | 2 | hairline marks |
| `rounded-sm` | 4 | thin bars, small marks |
| `rounded-lg` | 8 | anything 32px or smaller: icon buttons, badges, tags, tooltips |
| `rounded-xl` | 12 | controls: buttons, inputs, list and menu rows |
| `rounded-2xl` | 16 | cards, panels, popovers, dropdowns |
| `rounded-widget` | 24 | a widget's frame, modals, the navbar, the bottom sheet |
| `rounded-full` | | pills, avatars, day cells, dots |

`components/ui` follows the table, and `Button` defaults to `xl`. Code outside
it predates the table and is not yet held to it. `rounded-md`, `rounded-3xl`,
`rounded-4xl`, bare `rounded` and arbitrary radii are rejected by a test.

## Motion

`transition-ui` is the transition for a state change: colours, borders, outline,
shadow, opacity, filters, and `scale`, `rotate` and `translate`, which is what
Tailwind 4's `scale-*`, `rotate-*` and `translate-*` write (not `transform`).
It runs 150ms on `ease-standard`; add `duration-*` to slow it down.

When an element animates its size or position, name the properties:
`transition-[width]`, `transition-[stroke-dashoffset]`. `transition-all` is
rejected by a test, because it also animates layout nobody meant to animate.

Durations come from five steps: `150` for a hover or press, `200` and `300` for
panels and reveals, `500` for a slow entrance, `1000` for progress that ticks
once a second. A test rejects any other.

## Layers

Stacking inside a component uses plain `z-10`, `z-20` and so on.
Anything that floats over the whole page takes a named layer:

| layer | value | for |
|---|---|---|
| `z-float` | 50 | the bottom sheet, the navbar handle |
| `z-nav` | 60 | the navbar |
| `z-toolbar` | 70 | the canvas edit toolbar |
| `z-popover` | 9999 | tooltips, context menus, select lists |
| `z-dropdown` | 99999 | dropdowns, popover menus, the colour picker |

Modals (from 1000, twenty per open modal) and toasts stack themselves in
JavaScript and are not on this list. A portal that sets its z-index inline reads
the same value with `zIndex: 'var(--z-dropdown)'`. A test rejects arbitrary
page-wide values like `z-[9999]`.

## Known and not fixed

Measured on 2026-10-01 with the WCAG ratio on the opaque themes. `glass` and `icy` are left out because their tokens carry alpha.

- **Content on its colour** (`on-brand` on `brand` and the like) is 3:1 or better everywhere. Under 4.5: `on-brand` on `brand` is 4.2 in `light` and `dark`; `on-danger` on `danger` is 4.2 in `dark`. Only a different brand or status colour fixes these.
- **A colour used as text on `surface`** is weaker, because it was chosen as a fill. In `light`, `text-danger` is 2.9, `text-success` 2.0, `text-warning` 1.8 and `text-info` 2.2, and the app writes them 88 times. `text-secondary` (5 uses) is 1.2 in `zarna`. `text-brand` (151 uses) is 4.2 to 4.3 in `light` and `dark`. A darker text tone per status would fix the first group; that is a design choice.
