# How to Add a New Theme

This guide explains how to add a new theme to Widgetify.

## Steps

### 1. Create Theme CSS File

Create a new CSS file in `src/styles/theme/` with your theme name (e.g., `newtheme.css`).

The file should define DaisyUI theme variables using the `@plugin "daisyui/theme"` directive. Example:

```css
@plugin "daisyui/theme" {
    name: "newtheme";
    --color-base-100: #your-color;
    --color-base-200: #your-color;
    --color-base-300: #your-color;
    --color-base-content: #your-color;
    --color-primary: var(--brand-primary);
    --color-primary-focus: #your-color;
    --color-primary-content: rgba(var(--brand-primary-rgb), 0.9);
    --color-secondary: var(--brand-secondary);
    --color-secondary-focus: #your-color;
    --color-secondary-content: #ffffff;
    --color-accent: #your-color;
    --color-accent-focus: #your-color;
    --color-accent-content: #ffffff;
    --color-error: #f7374f;
    --color-success: #34d399;
    --color-warning: #fbbf24;
    --color-warning-content: #ffb22c;
    --color-info: #60a5fa;
}
```

Reference existing theme files like `dark.css`, `light.css`, etc. for examples.

### 2. Import the Theme CSS

Add an import statement to `src/styles/theme-colors.css`:

```css
@import './theme/newtheme.css';
```

### 3. Add Theme to Enum

In `src/context/theme.context.tsx`, add your new theme to the `Theme` enum:

```typescript
export enum Theme {
    Light = 'light',
    Dark = 'dark',
    Glass = 'glass',
    Icy = 'icy',
    Zarna = 'zarna',
    NewTheme = 'newtheme',  // Add this line
}
```

### 4. Add Theme to Selector

In `src/layouts/setting/tabs/appearance/components/theme-selector.tsx`, add a new object to the `themes` array:

```typescript
{
    id: 'newtheme',
    name: 'نام تم جدید',  // Persian name for the theme
    icon: <YourIcon size={18} />,  // Import and use an appropriate icon
    buttonClass: 'your-button-styles',  // CSS classes for the theme button
    activeClass: 'ring-2 ring-blue-500',
},
```

Make sure to import any new icons from `react-icons`.

### 5. Test the Theme

- Build and run the application.
- Go to settings > appearance > theme selector.
- Select your new theme and verify it applies correctly.
- Check that the theme persists across sessions.

## Notes

- Theme names should be lowercase and match the CSS file name.
- Use the brand colors defined in `main.css` for primary and secondary colors where appropriate.
- Test on different components to ensure good contrast and readability.
- Consider accessibility when choosing colors.