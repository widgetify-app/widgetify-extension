# Design tokens

Every colour in the app comes from here. Nothing in `src` writes a colour
literal, a Tailwind palette name (`bg-blue-500`), an opacity modifier
(`bg-primary/20`) or a raw daisyUI base class (`bg-base-200`) — the tests in
`__tests__/design-system.test.ts` fail the build if any of those appear.

## Which file owns what

| file | holds |
|---|---|
| `theme.css` | primitives, accent tints, content colours, radius, motion, z-index. The only file allowed to write a raw colour. |
| `utilities.css` | the names `@theme` cannot express — anything whose meaning changes with the prefix, and anything that isn't a colour. |
| `theme/<name>.css` | one theme's daisyUI values, plus its channel block. |
| `theme/main.css` | brand constants shared by every theme. |
| `elevation.css` | the shadow ladder, heavier on dark themes. |
| `typography.css`, `legacy.css` | line heights; Chrome 109 fallbacks. |

## The one thing to know before writing a class

**The same adjective means different things in different families.** It is a
position on that family's ladder, not an opacity you can carry between them.

|          | text | ink tint | line | surface veil | accent |
|----------|------|----------|------|--------------|--------|
| `strong` | —    | 0.2      | 0.2  | **0.8**      | 0.5    |
| `bold`   | —    | —        | 0.4¹ | —            | 0.8    |
| `muted`  | 0.7  | —        | 0.15 | 0.6          | 0.2    |
| `subtle` | 0.5  | 0.05     | 0.1  | 0.4          | 0.1    |
| `faint`  | 0.4  | —        | 0.05 | 0.2          | —      |
| `ghost`  | 0.2  | —        | —    | —            | —      |
| `hover`  | —    | 0.1²     | —    | —            | 0.9    |

¹ `stroke-bold` only — a progress arc, not chrome.
² the utility is `bg-hovered`.

> **Watch out:** `bg-strong` and `bg-content-strong` are one word apart and mean
> opposite things. `bg-strong` is the *foreground* colour at 20% — a pressed
> state. `bg-content-strong` is the *surface* at 80% — a panel that lets a
> little wallpaper through. Same for `bg-subtle` (5% ink) vs
> `bg-content-subtle` (40% surface).

## The families

**Surfaces** — what a thing sits on. Three depths, five steps each. The veil
steps multiply into the surface's own alpha, so `glass` and `icy`, whose base
surfaces are already translucent, thin out from where they start instead of
jumping to opaque.

```
bg-widget   bg-content   bg-raised                      opaque
bg-*-strong bg-*-muted   bg-*-subtle   bg-*-faint       .8 / .6 / .4 / .2
```

Also `from-`/`to-`/`via-`, `border-content*`, `ring-`, `outline-`, `stroke-`,
`divide-` on the same three names.

**Text** — one ladder, loudest to quietest:
`text-strong` → `text-content` → `text-muted` → `text-subtle` → `text-faint` →
`text-ghost`.

**Ink tints** — the foreground colour used as a fill: `bg-subtle` (rest),
`bg-hovered` (hover), `bg-strong` (pressed). Gradient stops match:
`from-subtle`, `from-hovered`, `from-strong`, `to-strong`.

**Lines** — `border-faint` → `border-subtle` → `border-muted` →
`border-strong`; `ring-subtle`/`ring-strong`; `stroke-faint` →
`stroke-subtle` → `stroke-bold`.

> An SVG line is not text. `<circle fill="none">` with no `stroke` attribute
> paints nothing when you set `color` on it — use `stroke-*`, never `text-*`.

**Accents** — `brand`, `danger`, `success`, `warning`, `info`, `vip`,
`secondary`. Each gets `-subtle` `-muted` `-strong` `-bold` `-hover` on every
prefix Tailwind generates. `success`, `warning` and `danger` also carry
`-content-subtle` / `-content-muted`, for drawing on top of a solid accent
block where a tint of the block's own colour would be invisible.

**Over-image** — chrome drawn on the wallpaper. Follows no theme by design:
`text-over-image*`, `bg-over-image*`, `border-over-image*`, and the scrims.

**Not colours** — `elevation-sm|md|lg|xl`, `rounded-card`, `rounded-widget`,
`transition-ui`, `focus-ring`, `z-raised|sticky|drag|nav|backdrop|sheet|modal|popover|toast`.

## Two names for one colour

The base colour keeps daisyUI's name; the tints use the design-system name:

```
bg-primary   bg-brand-subtle   bg-brand-muted   bg-brand-strong
bg-error     bg-danger-subtle  bg-danger-muted  bg-danger-strong
```

`bg-brand` and `bg-danger` also exist and are aliases of the first column. Both
spellings are in the codebase (`primary-*` ~271 uses, `brand-*` ~185). This is
deliberate: daisyUI owns the base colours, we own the tints.

## Adding an accent

Four lines in the `ACCENTS` block of `theme.css` and nothing else — Tailwind
generates `bg-`, `text-`, `border-`, `ring-`, `outline-`, `from-`, `to-`,
`via-`, `divide-`, `fill-`, `stroke-` and `shadow-` from each:

```css
--color-mine-subtle: rgba(var(--color-mine-rgb), 0.1);
--color-mine-muted:  rgba(var(--color-mine-rgb), 0.2);
--color-mine-strong: rgba(var(--color-mine-rgb), 0.5);
--color-mine-bold:   rgba(var(--color-mine-rgb), 0.8);
```

The `--color-mine-rgb` triple goes in each theme's channel block — see below.

## Why the channel triples live outside the `@plugin` block

Every tint is `rgba(var(--color-x-rgb), a)` rather than an opacity modifier,
because `color-mix()` and `oklch()` both landed in Chrome 111 and Chrome 109 is
the last version Windows 7/8.1 can run.

That means the `-rgb` triples are load-bearing — and **daisyUI silently drops
any value containing a comma from its `@plugin "daisyui/theme"` block**. A
triple written inside it never reaches the stylesheet, every `rgba()` built on
it becomes invalid at computed-value time, and the declaration is dropped. The
property then falls back to an inherited value: a `border-subtle` asked for at
5% renders at *full* text colour, because the initial value of `border-color`
is `currentColor`.

So each theme declares them in a plain `[data-theme="…"]` rule after the block.
Three tests guard this: all themes must declare the same variables, all must
declare the full channel set, and none may put a channel back inside the
`@plugin` block.

## Shadows

`elevation-sm|md|lg|xl` follow the theme; Tailwind's stock `shadow-*` are black
at ~10% and are invisible on the dark surfaces. 148 raw `shadow-*` remain from
before the ladder existed — the test ratchets that number so it can only go
down. Prefer `elevation-*` in new code.
