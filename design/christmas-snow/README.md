# Christmas snow in the navbar

Snow falls inside the bottom bar for everyone while the server says it is on. It is not a theme and it has no setting: we turn it on and off from the server.

**Status:** built (`src/features/navbar/components/navbar-snow.tsx`), not committed yet. The board was redrawn to match the code: the flake colour is `fg-faint` in every theme.

## Board

| File | Shows |
|---|---|
| `board.html` | S1 the bar with snow over a dark wallpaper (glass, icy, dark); S2 the same bar in the light theme; S3 the logo with its decoration |
| `assets/logo-decoration.webp` | The decoration, 144 by 144 px, transparent, shown at 48 px around the 32 px logo |
| `art/gen.py` | The PhotoCraft script that draws it (see its docstring) |

## What the owner decided

- Not a theme: no new entry in the theme list and no Christmas colours.
- Only the navbar: the snow is clipped to the bar and never reaches the widgets.
- No settings and no switch for the user. The server turns it on and off, so there is no season logic in the extension.

## Notes

- Renderer: our own, about 100 lines (`navbar-snow.tsx`, `snow-field.ts`, `snow-sprites.ts` in `src/features/navbar`). One canvas inside the bar, `pointer-events-none`, clipped by the bar's `overflow-hidden` and rounded corners. The flakes are two pre-drawn image sprites (a six-arm flake and a dot) coloured from the theme.
- The bar already slides away when the owner closes it (`navbarVisible`). The snow must not render while the bar is closed, and must stop when the tab is hidden (the library uses `requestAnimationFrame`, which the browser pauses).
- CPU is the real cost, and it is a per-frame cost, not a per-flake one. The library `react-snowfall` has no frame cap and cost about 5.6 points of main-thread time; our own loop capped at 30 fps costs about 1.6 (web clone, dev server, 3 interleaved runs). So the snow runs at 30 fps with 16 flakes, no wind, slow speed, and no canvas at all when the server flag is off or when optimal mode or reduced motion is on.
- The flag: the API already has the same kind of server switch for the mobile app card, a code constant returned in `GET /extension/@me` (`mobilePromoReleased`). The snow flag follows that pattern, so it needs a small API change first, with its test.
- It overlaps the glass bar, so check it in glass and icy over a busy wallpaper. Flakes are decoration, so they are content: white on glass, icy and dark; the colour is `fg-faint` read from the active theme, so it is light on dark themes and grey on the light theme.
- Analytics: none. The snow is not a user action.

## The decoration

- One static picture around the logo: a Santa hat on its top left rim, a holly sprig with berries at the bottom left, three small sparkles. The logo itself is not redrawn.
- Drawn with PhotoCraft in the soft style of `bell.svg` (chubby rounded shapes, white gloss, highlight spots). The shipped file is `src/assets/images/christmas/logo-decoration.webp` (4.4 KB), the same file as `assets/logo-decoration.webp`.
- Shown by `LogoDecoration` inside the logo link, at 150% of the logo so it scales on small screens. It follows the same server flag as the snow, but it is static, so it does not stop for optimal mode or reduced motion, and it is only visible while the bar is open.
- Its colours are the picture's own (content), not tokens.

## Built

- The switch: `christmasSnow` in `GET /extension/@me` (`UserProfile.christmasSnow`), a code constant in the API (`false` until the owner sets it). Signed out users never get it.
- `src/features/navbar/utils/snow-rule.ts` decides (switch on, signed in, bar open, not in optimal mode or reduced motion) and has a test.
- The canvas sits in the bar, behind its content (`-z-10` in an `isolate` bar), clipped to the bar's corners, 16 flakes, no wind.
- Idle cost measured in the web clone (dev server, glass theme, default widgets, headless Chrome): own renderer at 30 fps adds about 1.6 points of main-thread busy time (107 against 90 ms per second); the library version added about 5.6. It runs only while the bar is open.
