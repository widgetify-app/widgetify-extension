# How to Add a New Theme

## 1. Create the theme file

Create `src/styles/theme/<name>.css`. **Declare every variable in the template below.**
A variable you leave out does not fall back to something sensible — daisyUI emits its
built-in light theme for `:where(:root)` as well as `[data-theme="light"]`, so an omitted
variable silently resolves to the *light* theme's value. On a dark theme that is a bug
nothing will warn you about.

```css
@plugin "daisyui/theme" {
    name: "<name>";
    color-scheme: "dark";
    --color-base-100: ...;
    --color-base-200: ...;
    --color-base-300: ...;
    --color-base-content: ...;
    --color-primary: var(--brand-primary);
    --color-primary-content: ...;
    --color-secondary: var(--brand-secondary);
    --color-secondary-content: ...;
    --color-accent: ...;
    --color-accent-content: ...;
    --color-neutral: ...;
    --color-neutral-content: ...;
    --color-info: ...;
    --color-info-content: ...;
    --color-success: ...;
    --color-success-content: ...;
    --color-warning: ...;
    --color-warning-content: ...;
    --color-error: ...;
    --color-error-content: ...;
    --radius-selector: 0.5rem;
    --radius-field: 0.25rem;
    --radius-box: 0.5rem;
    --size-selector: 0.25rem;
    --size-field: 0.25rem;
    --border: 1px;
    --depth: 1;
    --noise: 0;
}
```

Copy `light.css` or `dark.css` and change the values — they both carry the full set.

`--color-primary-focus`, `--color-secondary-focus` and `--color-accent-focus` are daisyUI 4
names. daisyUI 5 has no such tokens and nothing in this repo reads them. Do not add them.

## 2. What you do NOT declare

The semantic tokens in `src/styles/tokens/` — `--surface-*`, `--text-*`, `--border-*` and
the rest — derive from the variables above, so your theme gets all of them for free. Only
override one in a `[data-theme="<name>"]` block when the derivation is genuinely wrong for
your theme, and say why.

## 3. Register the theme

- `src/styles/theme-colors.css` — add `@import './theme/<name>.css';` above the tokens import.
- `src/context/theme.context.tsx` — add it to the `Theme` enum, and to `freeThemes` if it is not paid.
- `src/layouts/setting/tabs/appearance/components/theme-selector.tsx` — add an entry to `themes`.

## 4. Check it

Every surface token has one safe foreground. Convert each pair to relative luminance and
compute the WCAG ratio: nothing below **3:1**, and anything under 4.5:1 needs a reason. A
token carrying alpha cannot be scored on its own — it composites over whatever is behind
it — so score the opaque pairs and judge the translucent ones by eye.

Then prove the theme declares what you think it does, against the build rather than the
source:

```
npm run build
grep -o 'data-theme=<name>[^{]*{[^}]*}' .output/chrome-mv3/assets/newtab-*.css
```

Parity with the other themes is mechanical: parse the six files and assert the declared
key sets are identical.
