# Network widget

The connection: online or not, place and provider, IP and ping. 1x1 (PRO), 2x1 (PRO) and 2x3. Needs an account, because the IP comes from the server.

## Files

| Path | Holds |
|---|---|
| `network.widget.tsx` | Entry. Online state, fetching, the menu actions and the frame of each size. |
| `variants/network-2x3.tsx` | Header with the status as info and «به‌روز کن»; place and provider, IP with a copy button, ping with its quality. |
| `variants/network-2x1.tsx` | The same header; the flag, place and IP at the start of the row, the ping and its quality at the end. Clicking the IP copies it. |
| `variants/network-1x1.tsx` | `WidgetCenteredHeader` «شبکه»; the ping centred with its quality under it. |
| `components/network-parts.tsx` | `NetworkStatus`, `PingSignal` (word and bars), `CountryFlag`. |
| `components/network-loading-skeleton.tsx` | The 2x3 skeleton. |
| `types.ts` | `NetworkInfo` and the props every size takes. |
| `utils/` | Ping quality, the provider name without its legal form, the place line, copying the IP. Tested except the copy. |

## Data

`GET /extension/@me/ip` for the IP, place and provider, and a timed `GET /` for the ping (`src/services/network`). Nothing is stored.

## Frame

The tasks frame: `px-3 py-2.5` at 1x1, `px-3 py-2.5 gap-1.5` at 2x1, `p-3 gap-2` at 2x3. Every size has a header titled «شبکه» that holds the ⋯; the 1x1 is too narrow for «به‌روز کن» in its header, so it stays in the menu.

## States

Signed out, offline, loading, error and connected are separate screens at every size.

- Signed out: «وارد حسابت نشدی» with «ورود», as Google Calendar does at 1x1 and 2x1; the 2x3 keeps `RequireAuth` over a preview.
- Offline: «اینترنت قطعه». The widget fetches again by itself when the browser goes back online; «دوباره» («دوباره امتحان کن» at 2x3) re-reads the browser's online state.
- Error: «نتونستیم اطلاعات شبکه رو بیاریم», the compact form in a one-row cell.

## Menu

«کپی آدرس IP» (when there is one) and «به‌روز کن», hidden when signed out or offline. No settings.

## Design decisions

- The big "به‌روزرسانی شبکه" button is gone; remeasuring is the header button and the menu item, both «به‌روز کن» like every other widget that fetches again.
- Ping quality reads عالی, متوسط or ضعیف with four, two or one bars, and «معلوم نیست» without a reading.
- The 1x1 shows the quality word under the ping instead of the place: the header took the top line, and at that width the quality says more than a truncated city.

## Not checked on screen

Every state at every size, the flag image, a long provider name, the IP with blur mode on, going offline and back, the signed-out 1x1 and 2x1.
