# Wigi-arz widget

Live prices of currencies, gold, coins and crypto. Two models: a list at 2x3 and one currency at 1x1 (PRO). The list rows are also drawn inside the combo widget.

## Files

| Path | Holds |
|---|---|
| `wigi-arz.widget.tsx` | Entry. Decides whose list to show, sets the frame, gives the menu its summary and «به‌روز کن». `WigiArzComboView` is the list inside the combo widget, under the combo's tabs. |
| `variants/wigi-arz-2x3.tsx` | Header «ویجی ارز» with the update time as info, «به‌روز می‌شه…» beside the title while a refresh runs, and an add button; then the list or the empty state. Inside the combo the title is the combo's tabs and there is no add button. |
| `variants/wigi-arz-1x1.tsx` | One currency, centred like the other 1x1 widgets: `WidgetCenteredHeader` with the flag and the code, then the price, sized to fit, over the unit and the change. «انتخاب ارز» when none is set, «نتونستیم قیمت رو بیاریم» with «دوباره» when the price fails. |
| `components/currency-list.tsx`, `components/sortable-currency-box.tsx` | Drag to reorder. |
| `components/currency-box.tsx` | One row, padded like a task row: icon, code, name, price and change. The drag handle sits outside the row, in the card's margin beside it, and fades in on hover; the list reaches into that margin (`-ms-2.5 ps-2.5`) so its `overflow-x-hidden` does not clip the handle. |
| `components/price-change.tsx` | The change with its arrow and colour: in percent by default, or as an amount when `amount` is given (the list rows and the modal show the amount; the 1x1 and the chart header show the percent). Draws nothing when the percent rounds to zero, so a row never says «۰٪». |
| `components/currency-modal.tsx` | Details, the price chart and the converter. Each row keeps its own modal mounted and only toggles it, so it opens and closes with the animation. |
| `components/currency-history.tsx` | The chart section of the modal: range tabs (یک روز، یک هفته، یک ماه), then the chart, a skeleton while loading, a retry on failure, or «هنوز داده‌ی کافی برای نمودار جمع نشده» when the server has fewer than two points. Only fetches while the modal is open. |
| `components/price-chart.tsx` | The SVG area chart: highest and lowest price and the change over the range above it, the first and last time below. Moving the pointer over it shows the nearest point with its price and time. Always `dir="ltr"`, time runs left to right. |
| `components/currency-empty.tsx` | The empty list: the coin icon, a line and «افزودن ارز». |
| `wigi-arz-setting.tsx` | Settings: the colour of a price change (top), then choose the currencies. |
| `hooks/use-currency-color-mode.ts` | The colour mode, read from storage key `currencyColorMode` into a small shared store, so every row, the modal and the chart agree and a change shows at once (`saveCurrencyColorMode` writes it; `watchStorage` carries it across tabs). |
| `utils/currency-color-mode.ts` | `normalizeCurrencyColorMode` (anything but `reverse` reads as `normal`) and `getChangeColorClass`. Tested. |
| `hooks/use-currency-price.ts` | One price, cached in storage under `currency:<code>`. |
| `utils/build-price-chart.ts` | Turns `priceHistory` into the chart: sorted points, line and area paths, min, max and the change from the first price to the last. Tested. |
| `utils/` | Price, change, the settings options and who owns a list. Tested. |

## Data

- A 2x3 widget placed on the canvas keeps its own list in `meta.currencies`. Without one it shows the shared `currencies` list from `CurrencyProvider`, which the combo widget uses too.
- `ownsCurrencyList` (`utils/owns-currency-list.ts`) decides which list a widget shows and which list the settings edit. The widget and the settings both call it, so they cannot disagree. It checks the widget id as well as the size. The settings used to decide by size alone, and the combo widget is 2x3 too: from the combo, every currency you picked went into the combo's own `meta.currencies`, which nothing reads, and the combo kept showing the shared default of USD, EUR and GRAM.
- The 1x1 model keeps its code in `meta.currencyCode`.
- The header time is the latest reply among the listed currencies, from `useCurrenciesUpdatedAt` in `src/services/currency`.
- «به‌روز کن» calls `useRefreshCurrencies`, which asks for every price on the page again with `FRESH_REQUEST`. The service worker answers `/currencies` stale-while-revalidate, so a plain `refetch()` got the cached price back and the new one only on the request after.

## History chart

- Pro only. The server answers `?history=` only for a signed-in VIP (401 without a token, 403 `VIP_REQUIRED`). The modal asks `useAuth().isVip` first and, for anyone else, shows a locked card instead of the chart: «ورود به حساب» (opens the profile) when signed out, «دیدن اشتراک پرو» (opens the VIP settings) otherwise; the button also closes the modal. It draws the same card when the server still answers 401 or 403 (`isHistoryLocked`), so a VIP that ended since the profile was cached does not see a broken chart. The query does not run for a non-VIP.
- Data: `useGetCurrencyHistory` in `src/services/currency` asks `/currencies/<code>?history=24h|7d|30d` and keeps `priceHistory`. The API sends `[]` without `history`, so the list rows never ask for it. The service worker caches each range apart (the key is the full URL).
- Units: history `price` is in the same unit as the API's `price`: rial for currencies and coins, dollars for crypto. The chart shows what the modal shows, so `toDisplayValue` divides rial by 10 and leaves dollars (`getPrice(...).isDollar` decides).
- Colour: follows the colour mode, like `PriceChange`; a range that rounds to 0.0 is neutral.
- The server only started recording history on 2026-10-13, so a short range can have one point. One point or none draws nothing and shows the empty line.

## Menu

Settings comes first, with "۶ ارز انتخاب شده" or "ارز: USD" under it, then «به‌روز کن» once there is a price to refresh. The add button in the header opens the same settings.

## Design decisions

- The colour of a change is a setting, one for every wigi-arz view (the lists, the 1x1, the combo, the modal and the chart): «معمولی» paints a rising price red and a falling one green, «معکوس» the other way. «معمولی» is the default, and what the widget did before the setting. The design draws it the other way; this needs the owner's call.
- Dollar priced items say "دلار" under the name instead of the 💲 emoji.
- No fade at the bottom of the list: Tailwind's mask utilities are unprefixed, and Chrome 109 needs `-webkit-mask-image`.
- The 1x1 laid everything against the start edge, which left its other half empty. It is now centred under the shared 1x1 header, and its ⋯ is the header's instead of one floating on glass.
- The drag handle used to appear with `hidden group-hover:grid`, pushing the row's contents aside the moment the pointer arrived. Laid over the row's 8px start padding instead, the 12px grip still covered the edge of the currency icon, so it moved out into the margin.
- The empty list used an illustration. It is now the icon, title, line and button of every other empty list.

## Not checked on screen

The chart in the modal: the locked card signed out and signed in without pro, its two buttons, the three ranges, the skeleton, the failed and the empty states, the tooltip near both edges, touch, the line colour in a light and a dark theme, and the gradient under the line.

The rows in the list and in the combo widget, the drag handle fading in and while dragging, the header time and «به‌روز می‌شه…», the 1x1 with a long price at the narrowest 1x1, the 1x1 empty and failed states, the empty list.
