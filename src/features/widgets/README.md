# widgets

The canvas that hosts every widget, and the widgets themselves. Each widget is a small app with its own data, settings and sizes.

## What is here

- `widgets.tsx` is the canvas and `widgets.context.tsx` its state.
- `registry.tsx` registers every widget. It is the one root file beyond the usual list: it hosts sub features, and it cannot live in `constants.ts` without every widget importing a file that imports every widget.
- `types.ts`, `constants.ts`, `date.context.tsx`, `currency.context.tsx` hold what several widgets share.
- `components/`, `hooks/` and `utils/` hold the platform: the container, the layout engine, migration, the VIP resolver, `WidgetError`, `WidgetEmpty`, `WidgetCompactEmpty` and `CompactPager`.
- Each widget is a sub feature with a `<name>.widget.tsx` entry: `bookmark`, `calendar`, `clock`, `combo-widget`, `dot-calendar`, `google-calendar`, `habit`, `mood-tracker`, `network`, `news`, `notes`, `pet`, `photo`, `search`, `todos`, `tools`, `transparent-clock`, `weather`, `wigi-arz`, `yadkar`.
- The canvas's own sub features take the plain `<name>.tsx`: `catalog/` (adding a widget), `widget-settings/`, `presets/`.

## Hover controls and the widget menu

A widget at rest shows only its content. Its buttons and a ⋯ appear on hover or keyboard focus, and ⋯ opens the same menu as a right click.

Keyboard focus means `data-keyboard-focus` on the frame, set by `hooks/use-keyboard-focus-within.ts` when the focused element matches `:focus-visible`. It is not `:focus-within`: a mouse click focuses a button, and a closing modal or menu hands focus back to the button that opened it, which left the controls showing with no pointer on the widget. `:has(:focus-visible)` would say it in CSS, but Firefox 115 lacks `:has()`.

- `canvas-widget-outer.tsx` marks the frame with `data-widget`, `data-menu-open` and `data-editing`, holds the menu anchor and provides `WidgetMenuProvider` from `widget-menu.context.tsx`.
- `widget-context-menu.tsx` is that menu, in a fixed order: name and size, settings, the widget's own actions, size, style, move, duplicate, delete. A right click opens the same menu; the menu does not say so.
- The menu names the widget by `menuLabel` from the registry, or `label` without one: the header, and settings as "تنظیمات <name>". Set `menuLabel` when the catalog name is too long for the menu.
- A widget adds its own actions with `useWidgetMenuActions(<PopoverMenuItem … />)`. The node renders inside the menu, outside the widget's providers, so pass closures and no component that reads a feature context. Any button click inside it closes the menu.
- `components/widget-header.tsx`: `WidgetHeader` (title or tabs, a badge, info that fades on hover, up to two actions, then ⋯), `WidgetHeaderButton` and `WidgetHeaderTabs`. A working widget always has a header; a display widget never does.
- `components/widget-menu-button.tsx`: the ⋯. A header renders it; a widget without a header renders `<WidgetMenuButton placement="floating" />` once. `compact` fits a short top row, `corner` sits outside the frame on a widget without one (bookmarks), `image` is a dark glass button for a frameless widget over the wallpaper. `tone="onColor"` makes header controls follow the text colour of a coloured card.
- The reveal is the `widget-control` and `widget-info` utilities in `src/styles/utilities.css`. Wrap a control in `widget-control` instead of toggling it in React; it reserves its space, so nothing moves.
- Where reserving that space costs the content too much (the sticky note's text), lay the control over the content and give the content `widget-control-fade`. It fades the bottom 40px on the same trigger, with a mask, so it works on glass and on a coloured card alike.
- A hidden `widget-info` must not take the pointer. It shares a grid cell with the controls, and an element below full opacity is painted above plain siblings, so without `pointer-events: none` the faded text sat on top of the buttons and only the strip below it took a click.
- Edit mode hides the controls and no longer opens the menu on right click.
- Migrated so far: todos, notes, habits, yadkar. The other widgets still show their old buttons and have no ⋯ yet. A migrated widget places its own ⋯ (a header, or one `WidgetMenuButton`) and puts its actions in the shared menu instead of a menu of its own.
- A one-row list widget (tasks, habits 2x1) shows one item at a time and steps with `CompactPager`, the up and down pair at the row's end. The row's second line ends in "۲ از ۵".
- `WidgetBackButton` leads a sub-view's header (an open note). `PopoverMenuItem` takes a `description` for a second line.

## Rules

- Each widget owns a `README.md` at its root, written for someone about to change it: files, runtime model, data and storage keys, settings, states, paid tiers, invariants, design decisions, open questions. `pet/README.md` is the model. When you finish work on a widget, rewrite its README from the code you just read. `docs.test.ts` fails when a README names a file that is gone.
- **Never animate a container-query sized element.** Widgets size themselves in `cqh` and `cqw` (`w-[22cqh]`, `text-[13cqh]`). `transition-all` on one of those restarts a transition on width, height, padding and font size at every resize, and the browser re-lays out the subtree each frame. Use `transition-ui`, or name the one property (`transition-[stroke-dashoffset]`). `design-system.test.ts` rejects `transition-all`.
- **`containerType: 'size'` on a widget container is load bearing.** Removing it collapses type and spacing, because `cqh` and `cqw` resolve against that container.
- **Loading, error, empty and signed out are four different screens.** Draw the error with `WidgetError` (the widget's own sentence and a retry; `compact` for a small cell) and the empty state with `WidgetEmpty` (illustration or icon, title, description, at most one action), or `WidgetCompactEmpty` in a one-row cell (icon, two lines, one button). A file named `*-empty.tsx` or `*-error.tsx` that draws its own markup fails the design test.
- **A widget's modal stays mounted and only toggles `isOpen`.** Keep what it shows (the task, the habit) until it opens again. Mounting it on open skips daisyUI's enter animation and unmounting kills the exit (see `src/components/ui/README.md`); clearing its data on close swaps the content while it fades out, so an edit form turned into a «new» form. Tasks and habits keep the open flag and the item in separate state.
- The productivity widgets (tasks, notes, habits, yadkar) share one voice: casual second person («یه», «رو», «بشه»), errors as «نتونستیم … رو بیاریم», a delete asked as «این … حذف بشه؟» with «حذف» and «نه», `…` for an ellipsis and no full stop after a toast.
- Prefer per-source errors where a widget has several: one dead RSS feed must not blank the other two. Never show an error over data you already have; a slightly stale price beats an error message.
- **Anything read back from storage is untrusted.** Put a `normalize-*` helper in the feature's `utils/`, give it a test, and route every read through it. `yadkar`, `tools`, `combo-widget` and `transparent-clock` have one; copy the nearest.
- **A setting needs a writer and a reader.** If you find one with only a half, say so and ask.
- **Premium gating has two independent paths.** `allowedSizes[].isVipOnly` locks a widget already on the canvas. The add and edit modal checks the variant's flag and skips the size check for any widget that declares variants. A widget with both variants and a premium size needs `isVipOnly` in both places. They are not duplicates.
- Storage keys, widget ids and analytics names are data. Never rename the strings.

## Design decisions (do not "fix")

- Canvas collision is push down only, with no compaction. Gaps between widgets are deliberate and survive a move. The earlier backtracking solver froze the extension for 112 seconds on one drag. Compaction exists behind an option and is off.
- The canvas is `MAX_CANVAS_ROWS` (12) rows deep at 8 columns, scaled by `8 / cols` on narrower grids (`row-cap.ts`). `resolveLayoutChange` refuses a move, resize, add or duplicate whose result reaches past it, or past the layout's current bottom when that is already lower, so an old layout that is too tall still works but cannot grow. The drag clamps to the same row. In edit mode the canvas shows every row up to the cap, so it does not shrink under a widget dragged upward.
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
