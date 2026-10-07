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
| `components/price-change.tsx` | The change in percent with its arrow and colour. |
| `components/currency-modal.tsx` | Details and the converter. Each row keeps its own modal mounted and only toggles it, so it opens and closes with the animation. |
| `components/currency-empty.tsx` | The empty list: the coin icon, a line and «افزودن ارز». |
| `wigi-arz-setting.tsx` | Settings: choose the currencies. |
| `hooks/use-currency-price.ts` | One price, cached in storage under `currency:<code>`. |
| `utils/` | Price, change, the settings options and who owns a list. Tested. |

## Data

- A 2x3 widget placed on the canvas keeps its own list in `meta.currencies`. Without one it shows the shared `currencies` list from `CurrencyProvider`, which the combo widget uses too.
- `ownsCurrencyList` (`utils/owns-currency-list.ts`) decides which list a widget shows and which list the settings edit. The widget and the settings both call it, so they cannot disagree. It checks the widget id as well as the size. The settings used to decide by size alone, and the combo widget is 2x3 too: from the combo, every currency you picked went into the combo's own `meta.currencies`, which nothing reads, and the combo kept showing the shared default of USD, EUR and GRAM.
- The 1x1 model keeps its code in `meta.currencyCode`.
- The header time is the latest reply among the listed currencies, from `useCurrenciesUpdatedAt` in `src/services/currency`.
- «به‌روز کن» calls `useRefreshCurrencies`, which asks for every price on the page again with `FRESH_REQUEST`. The service worker answers `/currencies` stale-while-revalidate, so a plain `refetch()` got the cached price back and the new one only on the request after.

## Menu

Settings comes first, with "۶ ارز انتخاب شده" or "ارز: USD" under it, then «به‌روز کن» once there is a price to refresh. The add button in the header opens the same settings.

## Design decisions

- A rising price is red and a falling one green, as in the currency modal and the old colour setting's default. The design draws it the other way; this needs the owner's call.
- Dollar priced items say "دلار" under the name instead of the 💲 emoji.
- No fade at the bottom of the list: Tailwind's mask utilities are unprefixed, and Chrome 109 needs `-webkit-mask-image`.
- The 1x1 laid everything against the start edge, which left its other half empty. It is now centred under the shared 1x1 header, and its ⋯ is the header's instead of one floating on glass.
- The drag handle used to appear with `hidden group-hover:grid`, pushing the row's contents aside the moment the pointer arrived. Laid over the row's 8px start padding instead, the 12px grip still covered the edge of the currency icon, so it moved out into the margin.
- The empty list used an illustration. It is now the icon, title, line and button of every other empty list.

## Not checked on screen

The rows in the list and in the combo widget, the drag handle fading in and while dragging, the header time and «به‌روز می‌شه…», the 1x1 with a long price at the narrowest 1x1, the 1x1 empty and failed states, the empty list.
