# How to add a theme

Read [`../README.md`](../README.md) first — it explains what the tokens are and
why the channel block exists. This file is just the checklist.

A theme is two blocks in one file: the daisyUI values, and the channel triples
those values are decomposed into. **Both are required.** A theme with only the
first one compiles, passes type-checking, renders — and has no working colour
layer, because every `text-muted`, `border-subtle` and accent tint in the app
resolves to nothing. See the README for why.

## 1. Create `src/styles/theme/<name>.css`

Copy `dark.css` and change the values. Every variable it declares must be
present, in both blocks — `design-system.test.ts` compares all themes against
each other and fails on any that is missing one.

```css
@plugin "daisyui/theme" {
	name: "<name>";
	color-scheme: "dark"; /* or "light" - native controls follow this */
	--color-base-100: #171717;
	--color-base-200: #1a1a1a;
	--color-base-300: #232323;
	--color-base-content: #f9fafb;
	--color-primary: var(--brand-primary);
	--color-primary-content: #fff;
	--color-secondary: var(--brand-secondary);
	--color-secondary-content: #171717;
	--color-accent: #f59e0b;
	--color-accent-content: #271b06;
	--color-neutral: #09090b;
	--color-neutral-content: #e4e4e7;
	--color-info: #60a5fa;
	--color-info-content: #042e49;
	--color-success: #34d399;
	--color-success-content: #004c39;
	--color-warning: #fbbf24;
	--color-warning-content: #271b06;
	--color-error: #f7374f;
	--color-error-content: #4d0218;
	--radius-selector: 0.5rem;
	--radius-field: 0.25rem;
	--radius-box: 0.5rem;
	--size-selector: 0.25rem;
	--size-field: 0.25rem;
	--border: 1px;
	--depth: 1;
	--noise: 0;
}

/* Outside the block on purpose - daisyUI drops comma-containing values. */
[data-theme="<name>"] {
	/* the alpha each surface already carries; 1 if the hex above is opaque */
	--color-base-100-a: 1;
	--color-base-200-a: 1;
	--color-base-300-a: 1;
	/* the rgb channels of every colour a tint is built from */
	--color-base-100-rgb: 23, 23, 23;
	--color-base-200-rgb: 26, 26, 26;
	--color-base-300-rgb: 35, 35, 35;
	--color-base-content-rgb: 249, 250, 251;
	--color-primary-rgb: 83, 109, 254;
	--color-secondary-rgb: 124, 141, 240;
	--color-error-rgb: 247, 55, 79;
	--color-success-rgb: 52, 211, 153;
	--color-warning-rgb: 251, 191, 36;
	--color-info-rgb: 96, 165, 250;
	--color-success-content-rgb: 0, 76, 57;
	--color-warning-content-rgb: 39, 27, 6;
	--color-error-content-rgb: 77, 2, 24;
}
```

Rules for the values:

- **Write hex or `rgba()`, never `oklch()` or `color-mix()`.** Both landed in
  Chrome 111; Chrome 109 is the last version Windows 7/8.1 can run, and a
  colour those browsers cannot parse is dropped entirely. A test enforces this.
- **The `-rgb` triples must match the colours above them.** Nothing checks the
  arithmetic, only that they exist.
- **If a surface is translucent** (see `glass.css`, `icy.css`), put its base
  alpha in `--color-base-N-a` and the underlying channels in
  `--color-base-N-rgb`. The veil utilities multiply into it, so
  `bg-content-subtle` thins your surface further rather than making it opaque.

## 2. Import it

Add to `src/styles/theme-colors.css`:

```css
@import "./theme/<name>.css";
```

## 3. Register it

`src/context/theme.context.tsx` — add to the enum, and to `freeThemes` if it
should not be VIP-gated:

```ts
export enum Theme {
	Light = 'light',
	Dark = 'dark',
	Glass = 'glass',
	Icy = 'icy',
	Zarna = 'zarna',
	esteghlal = 'esteghlal',
	NewTheme = 'newtheme',
}
```

`src/layouts/setting/tabs/appearance/components/theme-selector.tsx` — add an
entry. The shape is `{ id, name, description? }`; the id must match the CSS
`name`:

```ts
{ id: 'newtheme', name: 'نام تم', description: 'توضیح کوتاه' },
```

## 4. Check it

```bash
bun test && npm run build
```

`design-system.test.ts` catches the mistakes that are invisible in the browser:
a missing variable, a channel left inside the `@plugin` block, a missing
`color-scheme`, an `oklch()` that silently drops on old Chrome.

Then load the extension and switch to the theme. Look at a modal, a widget
panel over a wallpaper, a disabled control, and a progress ring — those exercise
the surface veils, the ink tints and the stroke ladder respectively.

Do not style the selector button with a palette colour (`ring-blue-500` and
friends) — the tests reject those. Use a token.
