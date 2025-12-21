# Converting Widgetify for Firefox Add-On

This guide explains how I converted the Widgetify Chrome extension to work with Firefox, what we fixed, and how to build and install it.

## Why This Was Needed

The extension was built for Chrome but uses WebExtensions APIs, which Firefox also supports. However, there were a few Chrome-specific features that needed adjustment. The main issue was that Chrome uses `chrome.*` APIs while Firefox uses `browser.*` APIs - they're similar but not identical.

## Why webextension-polyfill?

The extension uses `@wxt-dev/webextension-polyfill`, which is a wrapper that needs the actual `webextension-polyfill` package to work. This polyfill is crucial because:

1. **API Compatibility**: It provides a unified `browser.*` API that works across both Chrome and Firefox
2. **Promise Support**: Firefox's `browser.*` APIs return Promises, while Chrome's `chrome.*` APIs use callbacks - the polyfill normalizes this
3. **Cross-browser Code**: Instead of writing separate code for Chrome and Firefox, we can write once and it works everywhere

Without it, the build process fails because the polyfill module can't be resolved.

## What We Fixed

### 1. Tab Groups API (Chrome-only feature)

**Problem**: The bookmark feature tried to group tabs, but Firefox doesn't support tab groups.

**Fix**: Added a check before using tab groups in `src/layouts/bookmark/utils/tabManager.ts`:

```typescript
// Now checks if the API exists before using it
if (tabIds.length > 0 && browser.tabs.group && browser.tabGroups) {
    // Use tab groups (Chrome only)
} else {
    // Fallback behavior for Firefox
}
```

### 2. Invalid Manifest Field

**Problem**: The manifest had a `data_collection_permissions` field with an invalid format that Firefox rejected during installation.

**Fix**: Removed it from `wxt.config.ts`. This field is a newer Firefox requirement, but the format we used wasn't correct. For now, it's removed - if needed for AMO submission later, we'll add it back with the correct format.

### 3. Missing Dependency

**Problem**: The build failed because `webextension-polyfill` wasn't installed as a peer dependency.

**Fix**: Installed it explicitly:
```bash
npm install webextension-polyfill --legacy-peer-deps
```

## Quick Start

### 1. Install Dependencies

```bash
npm install --legacy-peer-deps
npm install webextension-polyfill --legacy-peer-deps
```

The `--legacy-peer-deps` flag is needed because `react-joyride` expects React 15-18, but the project uses React 19. This is safe - the extension works fine.

### 2. Build for Firefox

```bash
npm run build:firefox:clean
```

This creates the extension in `.output/firefox-mv2/`

### 3. Create ZIP Package

```bash
npm run zip:firefox
```

This creates `.output/widgetify-webapp-1.0.59-firefox.zip`

## Installing in Firefox

### Method 1: Unpacked Extension (Recommended)

This installs permanently without needing Mozilla's signature:

1. Open Firefox and go to `about:debugging`
2. Click **"This Firefox"** in the sidebar
3. Click **"Load Temporary Add-on..."**
4. Select: `.output/firefox-mv2/manifest.json`

The extension will stay installed (despite the "Temporary" label) until you manually remove it.

### Method 2: Development with Auto-reload

For development, use `web-ext`:

```bash
npm install --save-dev web-ext
npx web-ext run --source-dir .output/firefox-mv2 --firefox=/usr/bin/firefox
```

This launches Firefox with the extension and auto-reloads on file changes.

## Why "Install Add-on from File" Doesn't Work

Firefox requires all extensions to be signed by Mozilla for security. You can't install unsigned ZIP/XPI files through the normal "Install Add-on from file" option.

**Solutions:**
- Use the unpacked extension method (works great for local use)
- Submit to Mozilla Add-ons (AMO) for signing if you want public distribution

## Testing

### Lint the Extension

```bash
npx web-ext lint --source-dir .output/firefox-mv2
```

You should see 0 errors. Some warnings about `UNSAFE_VAR_ASSIGNMENT` are false positives - the code uses DOMPurify for sanitization.

### Test Installation

```bash
npx web-ext run --source-dir .output/firefox-mv2 --firefox=/usr/bin/firefox
```

## Files We Changed

1. **`src/layouts/bookmark/utils/tabManager.ts`** - Added Firefox compatibility check for tab groups
2. **`wxt.config.ts`** - Removed invalid manifest field
3. **`package.json`** - Added `webextension-polyfill` dependency

## Troubleshooting

**"webextension-polyfill not found"**
```bash
npm install webextension-polyfill --legacy-peer-deps
```

**"Extension is invalid - Unexpected property 'analytics'"**
```bash
rm -rf .output .wxt
npm run build:firefox:clean
```

**"Cannot install - not verified"**
- Use the unpacked extension method instead of "Install Add-on from file"
- Or submit to AMO for signing

**Build fails with peer dependency errors**
```bash
npm install --legacy-peer-deps
```

## Summary

The conversion was straightforward because the extension already used WebExtensions APIs. We just needed to:
1. Add a check for Chrome-only features (tab groups)
2. Fix the manifest format
3. Install the missing polyfill dependency

The extension now works perfectly in Firefox! For public distribution, you'll need to submit it to Mozilla Add-ons for review and signing.

