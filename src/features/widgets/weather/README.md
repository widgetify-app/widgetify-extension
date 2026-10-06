# Weather widget

The weather in the user's city, at 1x1 (PRO), 2x1, 2x2 (PRO) and 2x3. Display only: there is no button on the widget.

## Files

| Path | Holds |
|---|---|
| `weather.widget.tsx` | Entry. Fetches, picks the size, sets the frame, gives the menu the city and draws the error under a header. |
| `variants/weather-2x3.tsx` | City header with the update time as info, temperature, condition, high and low, wind, humidity and cloud, five hours of forecast. |
| `variants/weather-2x2.tsx` | City header with the condition as info, temperature, high and low, four hours of forecast. |
| `variants/weather-2x1.tsx` | City header with the condition as info; the icon and temperature at the start of the row, wind and humidity at its end. |
| `variants/weather-1x1.tsx` | The city in `WidgetCenteredHeader`; the icon and temperature centred, the condition under them. |
| `components/weather-reading.tsx` | `WeatherIcon` and `Temperature`, each with a skeleton while the first reply is on its way. |
| `components/forecast.tsx` | The hourly forecast row. |
| `weather-setting.tsx` | Settings: the city picker (`src/components/select-city.tsx`, shared with the account and general settings). |
| `hooks/use-weather-settings.ts` | `weatherSettings` from storage; only the temperature unit is read. |
| `utils/` | Temperature formatting, the high and low range, wind, humidity and cloud as shown, the city name without "شهرستان". Tested. |

## Data

`GET /weather/current` through `useGetWeatherByLatLon`. The city comes from the account, so changing it is the city picker in settings. The reply has no "feels like" temperature, so the design's "حس ۲۴°" is not shown.

## Frame

The tasks frame: `px-3 py-2.5` at 1x1, `px-3 py-2.5 gap-1.5` at 2x1, `p-3 gap-2` above. Every size has a header with the ⋯, the error included («نتونستیم آب و هوا رو بیاریم», the compact form in a one-row cell).

## Menu

Settings comes first, with the city under it ("شهر: تهران"). No actions of its own.

## Design decisions

- High and low are shown only when they round to two different numbers. The current reading often sends the same value for both, which is why the 2x1 fills its end with wind and humidity instead.
- The 1x1 and 2x1 laid everything against the start edge and left the other half empty. The 1x1 is now centred under the shared 1x1 header; the 2x1 puts the reading at one end and two metrics at the other.
- At 1x1 the condition line is `shrink-0` and the icon and temperature take `min(34cqh, 100cqh - 46px)`: the 28px header, the 2px gap and the 16px line come first. On 88px and shorter rows the reading plus the line did not fit, and the line, the only item allowed to shrink (`truncate` drops its minimum height to 0), was squashed to 15, 10 and 4px with its letters cut off.
- The metric unit shows as a bare "°".
- The status banner image and the `temp_description` line of the old 2x3 are gone; the design has neither.
- 2x2 now sits in the normal widget frame instead of its own glass card.

## Not checked on screen

Every size in light and dark, the 1x1 and 2x1 at the narrowest rows, the skeletons on a slow connection, the error state at each size, the city picker's new wording in the account and general settings too.
