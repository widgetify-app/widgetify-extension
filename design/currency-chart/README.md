# Currency chart

The currency modal of the wigi-arz widget: its header, the price chart and the converter (`src/features/widgets/wigi-arz/components/`).

**Status:** approved and built. The owner picked "C · Time axis + converter" from nine boards on the design canvas.

## Why

The old chart jumped between two levels like a square wave. The history from price-track flips between two prices about 1.6% apart for hours at a time, and the chart let its axis shrink to ±1% of the price, so each flip filled the whole height. The line was also straight segments under a strong fill.

## Board

| File | Shows |
|---|---|
| `boards/TimeAxisConverter.dc.html` | The modal: a header with the icon, the name, the code with the update time and a small range control; the large price with its unit and the day's change; the chart from edge to edge with hour labels ending in «الان»; the converter as the footer |
| `boards/BuiltService.dc.html` | The modal as built, drawn with the real «اشتراک Claude» reply (a service, 30 days of history): no update time, the month range, the smoothed line rising over the range while the day's change is down 0.4%, and no converter because it is a service |

## What changed from the old modal

- The chart line follows a rolling average of the history, so a price that flips back and forth draws as one calm line. The tooltip still shows the real price at each point.
- The price axis never spans less than 8% of the price, so a small move stays small.
- The line is a smooth curve with a light fill and no gridlines. High, low and the range's change are no longer shown above the chart.
- The range control moved into the header, with short labels (روز، هفته، ماه). It shows only for pro users.
- The converter is always visible in the footer, with a swap button, instead of hidden behind an icon. It is still hidden for services.
- The board drew an update time next to the code («۲ دقیقه پیش»). The owner dropped it after seeing «همین الان» there every time the modal opened.
- The modal has no close button; the backdrop and Escape close it.
- Dollar prices say «دلار» after the price instead of the 💲 emoji.

The real fix for the flipping is in the price-track data source, which is not in this repository.
