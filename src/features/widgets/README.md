# widgets

The canvas that hosts every widget, and the widgets themselves. Each widget is a small app with its own data, settings and sizes.

## What is here

- `widgets.tsx` is the canvas and `widgets.context.tsx` its state.
- `registry.tsx` registers every widget. It is the one root file beyond the usual list: it hosts sub features, and it cannot live in `constants.ts` without every widget importing a file that imports every widget.
- `types.ts`, `constants.ts`, `date.context.tsx`, `currency.context.tsx` hold what several widgets share.
- `components/`, `hooks/` and `utils/` hold the platform: the container, the layout engine, migration, the VIP resolver, `WidgetError` and `WidgetEmpty`.
- Each widget is a sub feature with a `<name>.widget.tsx` entry: `bookmark`, `calendar`, `clock`, `combo-widget`, `dot-calendar`, `google-calendar`, `habit`, `mood-tracker`, `network`, `news`, `notes`, `pet`, `photo`, `search`, `todos`, `tools`, `transparent-clock`, `weather`, `wigi-arz`, `yadkar`.
- The canvas's own sub features take the plain `<name>.tsx`: `catalog/` (adding a widget), `widget-settings/`, `presets/`.

## Rules

- Each widget owns a `README.md` at its root, written for someone about to change it: files, runtime model, data and storage keys, settings, states, paid tiers, invariants, design decisions, open questions. `pet/README.md` is the model. When you finish work on a widget, rewrite its README from the code you just read. `docs.test.ts` fails when a README names a file that is gone.
- **Never animate a container-query sized element.** Widgets size themselves in `cqh` and `cqw` (`w-[22cqh]`, `text-[13cqh]`). `transition-all` on one of those restarts a transition on width, height, padding and font size at every resize, and the browser re-lays out the subtree each frame. Use `transition-ui`, or name the one property (`transition-[stroke-dashoffset]`). `design-system.test.ts` rejects `transition-all`.
- **`containerType: 'size'` on a widget container is load bearing.** Removing it collapses type and spacing, because `cqh` and `cqw` resolve against that container.
- **Loading, error, empty and signed out are four different screens.** Draw the error with `WidgetError` (the widget's own sentence and a retry; `compact` for a small cell) and the empty state with `WidgetEmpty` (illustration or icon, title, description, at most one action). A file named `*-empty.tsx` or `*-error.tsx` that draws its own markup fails the design test.
- Prefer per-source errors where a widget has several: one dead RSS feed must not blank the other two. Never show an error over data you already have; a slightly stale price beats an error message.
- **Anything read back from storage is untrusted.** Put a `normalize-*` helper in the feature's `utils/`, give it a test, and route every read through it. `yadkar`, `tools`, `combo-widget` and `transparent-clock` have one; copy the nearest.
- **A setting needs a writer and a reader.** If you find one with only a half, say so and ask.
- **Premium gating has two independent paths.** `allowedSizes[].isVipOnly` locks a widget already on the canvas. The add and edit modal checks the variant's flag and skips the size check for any widget that declares variants. A widget with both variants and a premium size needs `isVipOnly` in both places. They are not duplicates.
- Storage keys, widget ids and analytics names are data. Never rename the strings.

## Design decisions (do not "fix")

- Canvas collision is push down only, with no compaction. Gaps between widgets are deliberate and survive a move. The earlier backtracking solver froze the extension for 112 seconds on one drag. Compaction exists behind an option and is off.
- `voice-search-portal.tsx` starts the microphone in a mount effect. Never make it always mounted.

## Adding a widget

1. Make `<name>/` with `<name>.widget.tsx`.
2. Register it in `registry.tsx` with its id, sizes and settings. The id is data.
3. Draw all four states with `WidgetError` and `WidgetEmpty`.
4. Write a `normalize-*` helper for anything stored.
5. Write the widget's `README.md`.

## Mistakes that happened

- `transition-all` was found on `cq*` sized elements in eleven widgets and made drags stall.
- A failed request drew the empty state, so a network problem read as "you have no tasks".
- A disabled query left a signed out user on a skeleton that never resolved.
- Notes had a premium model that could be picked for free and then rendered locked, because `isVipOnly` was missing on the variant.

## Known and not fixed

`registry.tsx` and the canvas hooks import each other in a loop: the registry imports every widget, a widget imports `widgets.context.tsx`, the context imports `use-widget-drag`, `use-widget-operations` and `widget-layout-helpers`, and those import the registry. It works because they read `WIDGET_DEFINITIONS` only inside functions. Reading it at the top level of one of those files would run before it exists, and `tsc` would not notice. Passing the registry in from the provider would remove the loop.

## Tests

Pure modules only: `__tests__/` covers the layout engine, push down, migration, size choice and zoned time; each widget covers its own maths and `normalize-*` helpers.
