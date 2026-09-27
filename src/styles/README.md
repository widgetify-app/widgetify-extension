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

## Which file owns what

| file | holds |
|---|---|
| `tokens.css` | the colour vocabulary. Nothing else declares a colour name. |
| `theme.css` | primitives: the palette ban, fonts, the small type steps, radius, motion, the page-wide layers, the vip brand colour. |
| `theme/<name>.css` | one theme's daisyUI values, plus its channel block. |
| `theme-colors.css` | the theme imports and the brand constants shared by every theme. |
| `utilities.css` | utilities `@theme` cannot generate: `transition-ui`, `focus-ring` and the `z-*` layers. |
| `elevation.css` | the shadow scale `shadow-sm` … `shadow-xl`, and its colour per theme. |
| `typography.css`, `legacy.css` | line heights; Chrome 109 fallbacks. |

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
by `theme.css`, under exactly those names, so `tokens.css` only adds their `on-`
and tint names. Redeclaring one there would make it refer to itself.

**Over imagery** — chrome drawn on a wallpaper or a photo follows no theme,
because the theme says nothing about the pixels behind it: `image-fg` (white) ·
`image-fill` (white 20) · `image-line` (white 30) · `scrim` (black 60) ·
`scrim-soft` (black 20). Text on a solid accent is never one of these: it is
that accent's `on-` pair.

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
invisible. They stay real Tailwind shadows, so they combine with `ring-*` on
the same element and take a colour: `shadow-md shadow-brand-fill-2` is a brand
glow. `shadow-xs`, `shadow-2xl` and `shadow-inner` compile to nothing, and a
test rejects them.

## Type

Text below `text-xs` has three steps: `text-2xs` 11px · `text-3xs` 10px ·
`text-4xs` 9px. Unlike `text-xs` and up they set no line height, so they inherit
it exactly as the pixel values they replaced did. A test rejects `text-[10px]`
and the other pixel sizes they cover. Widgets that scale with their container
keep `cqh`/`cqw` sizes.

## Radius

`rounded-xs` 2 · `sm` 4 · `lg` 8 · `xl` 12 · `2xl` 16 · `3xl` 24 ·
`full`, and `rounded-widget` for a widget's own frame so every widget can change
together. `rounded-md`, `rounded-4xl` and arbitrary radii are removed from the
scale and rejected by a test.

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
