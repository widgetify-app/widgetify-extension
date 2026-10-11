# partner-widget

A widget whose page is built by Widgetify in the `widgetify-iframe` project and shown here in an iframe. A partner only supplies an API; the page, the theme and the token handshake are ours. The design is the partner iframe widgets design document in the monorepo docs folder (sections 6 and 7).

## What is here

- `partner-widget.widget.tsx` is the host. `PartnerWidget` looks its catalog entry up and draws `PartnerFrame`, which runs the lifecycle below.
- `hooks/use-color-scheme.ts` reads the theme's own `color-scheme` from the page (so a remote theme works too) and watches `data-theme` for changes.
- `hooks/use-in-viewport.ts` is an `IntersectionObserver` for the cell.
- `utils/protocol.ts` is the pure part of the handshake: message names, the answer to a frame, the frame address, the sandbox and `allow` lists, the launch time limit, the refresh limiter.
- `utils/host-state.ts` is the lifecycle as a reducer.
- `utils/frame-slots.ts` is the live frame limit.

What is shared with the rest of the canvas lives in `features/widgets`, not here: the catalog store, the definitions, the unavailable tile, the launch failure mapping, the access flow (`partner-access.context.tsx`).

## Lifecycle

`idle` (a skeleton) → `launching` (`POST /user-widgets/<instanceId>/launch`, once the cell is on screen) → `connecting` (the iframe is drawn and the host waits for `WIDGETIFY_APP_READY`, for `timeoutMs` or 8 seconds) → `ready`.

Other screens, each from one server answer: `error` (a retry button), `unavailable` (404), `needsSignIn` (401), `needsConsent` (403 `CONSENT_REQUIRED`) and `needsContact` (400 `PHONE_REQUIRED`, `EMAIL_REQUIRED`, `EMAIL_OR_PHONE_REQUIRED`). The last two run the access flow and launch again. `parked` is a frame that gave its slot away (see below); it comes back to `connecting` without a new launch, because the host keeps the token it already has.

## The frame

- Address: `widgetUrl` plus `mode=widget&client=EXTENSION&referrer=EXTENSION&theme&colorScheme&font&w&h&variant`. The frame is keyed on that address, so a change of theme, font, size or variant reloads it and the new look appears at once. After every reload the frame sends READY again and the host answers again.
- Messages (the same shape as the mini-app runner): the frame posts `WIDGETIFY_APP_READY`; the host answers `{ type: 'WIDGETIFY_AUTH', payload: { data, signature } }` to the widget's origin only. `WIDGETIFY_REFRESH_AUTH` asks for a new token; the host allows one every 10 seconds. A message counts only when `event.source` is that frame's window and `event.origin` equals the origin the server named. The launch answer's origin must equal the catalog entry's origin, or the launch is refused.
- `sandbox`: always `allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox`, plus `allow-modals`, `allow-downloads`, `allow-pointer-lock` or `allow-presentation` when the widget asks. Never `allow-top-navigation`, in any form. `allow-popups-to-escape-sandbox` is there because a page opened from the widget would otherwise keep the sandbox and could break.
- `allow` (permissions policy): only `fullscreen`, `clipboard-write`, `web-share`, `pointer-lock` and `gamepad`, and only when the widget asks.
- `referrerpolicy="no-referrer"`, and a `title` from the widget's name.
- Every partner tile, including the unavailable one, is a padded `WidgetContainer` with a `WidgetHeader` (the widget's title and the ⋯ menu, so removing it always works). The frame fills the space under the header, so the page sees a smaller area than the cell; `w` and `h` in the address stay the cell's size in grid units. While a frame is shown the menu has a reload action that remounts it.
- In edit mode `WidgetContainer` makes the content `inert`, so the frame cannot take the drag, the resize or the menu.

## Live frames

At most 6 frames are live at once (`MAX_LIVE_FRAMES` in `utils/frame-slots.ts`; the number is a starting value, to be measured on a low-end machine). A frame is mounted when its cell first enters the viewport. When a seventh asks for a slot, the least recently used frame that is not on screen is parked. A frame on screen is never parked.

## Rules

- The token is the only thing that goes through `postMessage`. Everything else is in the address.
- Never log, store or put the launch token anywhere but the component's state.
- A new sandbox or `allow` token is a security decision: change the lists in `utils/protocol.ts` and its test together.
- Text goes through `t()` (`widgets.partner.*` in `src/common/i18n/fa/widgets.ts`).

## Tests

`__tests__/protocol.test.ts` and `__tests__/host-state.test.ts` (the reducer and the slots). The pure rules that this widget shares with the canvas are tested in `features/widgets/__tests__`: `normalize-partner-catalog`, `partner-catalog-store`, `partner-definitions`, `partner-access`, `launch-failure`.
