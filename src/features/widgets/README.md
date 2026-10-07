# widgets

The canvas that hosts every widget, and the widgets themselves. Each widget is a small app with its own data, settings and sizes.

## What is here

- `widgets.tsx` is the canvas and `widgets.context.tsx` its state.
- `registry.tsx` registers every widget. It is the one root file beyond the usual list: it hosts sub features, and it cannot live in `constants.ts` without every widget importing a file that imports every widget.
- `types.ts`, `constants.ts`, `date.context.tsx`, `currency.context.tsx` hold what several widgets share.
- `components/`, `hooks/` and `utils/` hold the platform: the container, the layout engine, migration, the VIP resolver, `WidgetError`, `WidgetEmpty`, `WidgetCompactEmpty`, `CompactPager` and `BoardSummary`.
- Each widget is a sub feature with a `<name>.widget.tsx` entry: `bookmark`, `calendar`, `clock`, `combo-widget`, `dot-calendar`, `google-calendar`, `habit`, `mood-tracker`, `network`, `news`, `notes`, `pet`, `photo`, `search`, `todos`, `tools`, `transparent-clock`, `weather`, `wigi-arz`, `yadkar`.
- The canvas's own sub features take the plain `<name>.tsx`: `catalog/` (adding a widget), `widget-settings/`, `presets/`.

## Hover controls and the widget menu

A widget at rest shows only its content. Its buttons and a ⋯ appear on hover or keyboard focus, and ⋯ opens the same menu as a right click.

Keyboard focus means `data-keyboard-focus` on the frame, set by `hooks/use-keyboard-focus-within.ts` when the focused element matches `:focus-visible`. It is not `:focus-within`: a mouse click focuses a button, and a closing modal or menu hands focus back to the button that opened it, which left the controls showing with no pointer on the widget. `:has(:focus-visible)` would say it in CSS, but Firefox 115 lacks `:has()`.

- `canvas-widget-outer.tsx` marks the frame with `data-widget`, `data-menu-open` and `data-editing`, holds the menu anchor and provides `WidgetMenuProvider` from `widget-menu.context.tsx`.
- `widget-context-menu.tsx` is that menu, in a fixed order: name and size, settings, the widget's own actions, size, style, move, duplicate, delete. A right click opens the same menu; the menu does not say so.
- The menu names the widget by `menuLabel` from the registry, or `label` without one: the header, and settings as "تنظیمات <name>". Set `menuLabel` when the catalog name is too long for the menu. A widget puts its current value under it with `useWidgetSettingsSummary('شهر: تهران')`. A widget whose settings belong to one model sets `hasSettings(meta)` in the registry, and the menu leaves «تنظیمات …» out when it returns false (the dot calendar's year model has nothing to set).
- `widget-settings/widget-settings.tsx` hosts every settings modal. It keeps the last request after closing and toggles only the open flag, so a modal fades out with its title and content; it used to clear the request and fade out empty.
- A widget adds its own actions with `useWidgetMenuActions(<PopoverMenuItem … />)`. The node renders inside the menu, outside the widget's providers, so pass closures and no component that reads a feature context. Any button click inside it closes the menu, in the next task (`setTimeout`). React runs capture and bubble handlers from two separate browser listeners and applies state in a microtask between them, so closing in the capture phase unmounted the menu before the button's own `onClick` ran: no widget action worked from the menu, «برو به امروز» and every reload included.
- `components/widget-header.tsx`: `WidgetHeader` (title or tabs, a badge, info that fades on hover, up to two actions, then ⋯), `WidgetHeaderButton`, `WidgetHeaderTabs` and `WidgetCenteredHeader`. A framed widget always has a header, a display one such as the clock included, titled with the widget's name. A frameless widget (the search 2x1, the flip, analog and transparent clocks) has no header or label and puts ⋯ in its corner.
- `WidgetCenteredHeader` heads a centred 1x1 (the calendar's today, Google Calendar's next event). Its label sits in the middle and fades on hover, and ⋯ appears at the row's end, the same button as in every other header. A 1x1 is too narrow for both: a centred label and ⋯ overlap there.
- `components/widget-menu-button.tsx`: the ⋯. A header renders it; a widget without a header renders `<WidgetMenuButton placement="floating" />` once. `compact` is the small bare ⋯, for a short top row or the end of a row of chips (search 4x1); `corner` is the same button at the top left of a frameless widget (search 2x1, the frameless clocks), and takes `tone="onColor"` where the widget draws its own colour (the transparent clock); `image` is a dark glass button for a frameless widget over the wallpaper. `tone="onColor"` makes header controls follow the text colour of a coloured card.
- The reveal is the `widget-control` and `widget-info` utilities in `src/styles/utilities.css`. Wrap a control in `widget-control` instead of toggling it in React; it reserves its space, so nothing moves.
- Where reserving that space costs the content too much (the sticky note's text), lay the control over the content and give the content `widget-control-fade`. It fades the bottom 40px on the same trigger, with a mask, so it works on glass and on a coloured card alike.
- A hidden `widget-info` must not take the pointer. It shares a grid cell with the controls, and an element below full opacity is painted above plain siblings, so without `pointer-events: none` the faded text sat on top of the buttons and only the strip below it took a click.
- Edit mode hides the controls and no longer opens the menu on right click.
- Every widget but bookmarks is on this system. Bookmarks have no ⋯ yet and keep their own tile menu. A new widget places its own ⋯ (a header, or one `WidgetMenuButton`) and puts its actions in the shared menu instead of a menu of its own.
- Tasks, notes, habits, yadkar, calendar, Google Calendar, tools, the dot calendar, the digital clocks, wigi-arz, news, the combo, network, weather and an empty photo frame share one frame: `p-3 gap-2`, or `px-3 py-2.5 gap-1.5` in a one-row cell, then `WidgetHeader`. A centred 1x1 takes `px-3 py-2.5` with no gap, since `WidgetCenteredHeader` leaves room under its label and a gap would cost the day number or the event title a line. The mood tracker keeps its own small header and tighter frame, by the owner's choice; a photo or a pet scene fills its frame and takes the `image` ⋯.
- A header that shows when its data last arrived uses `formatUpdatedAt(dataUpdatedAt)` from `utils/updated-at.ts` as its info ("به‌روز ۱۴:۳۰").
- A widget drawn inside another (wigi-arz and news inside combo-widget) takes the host's tabs as its header title and never calls `useWidgetSettingsSummary` or `useWidgetMenuActions`: those belong to the host.
- A 4x3 board (tasks, notes, habits) splits its body in two with `gap-3` and a `border-s border-line ps-3.5` divider before the second pane. Tasks and habits put `BoardSummary` there (a percent ring and a few counts); notes put the open note.
- A one-row list widget (tasks, habits 2x1) shows one item at a time and steps with `CompactPager`, the up and down pair at the row's end. The row's second line ends in "۲ از ۵".
- `WidgetBackButton` leads a sub-view's header (an open note, the pomodoro leaderboard). `PopoverMenuItem` takes a `description` for a second line, such as a setting's current value.

## Rules

- Each widget owns a `README.md` at its root, written for someone about to change it: files, runtime model, data and storage keys, settings, states, paid tiers, invariants, design decisions, open questions. `pet/README.md` is the model. When you finish work on a widget, rewrite its README from the code you just read. `docs.test.ts` fails when a README names a file that is gone.
- **Never animate a container-query sized element.** Widgets size themselves in `cqh` and `cqw` (`w-[22cqh]`, `text-[13cqh]`). `transition-all` on one of those restarts a transition on width, height, padding and font size at every resize, and the browser re-lays out the subtree each frame. Use `transition-ui`, or name the one property (`transition-[stroke-dashoffset]`). `design-system.test.ts` rejects `transition-all`.
- **`containerType: 'size'` on a widget container is load bearing.** Removing it collapses type and spacing, because `cqh` and `cqw` resolve against that container.
- **Loading, error, empty and signed out are four different screens.** Draw the error with `WidgetError` (the widget's own sentence and a retry; `compact` for a small cell) and the empty state with `WidgetEmpty` (icon, title, description, at most one action), or `WidgetCompactEmpty` in a one-row cell (icon, two lines, at most one button). A file named `*-empty.tsx` or `*-error.tsx` that draws its own markup fails the design test.
- **A widget's modal stays mounted and only toggles `isOpen`.** Keep what it shows (the task, the habit) until it opens again. Mounting it on open skips daisyUI's enter animation and unmounting kills the exit (see `src/components/ui/README.md`); clearing its data on close swaps the content while it fades out, so an edit form turned into a «new» form. Tasks and habits keep the open flag and the item in separate state.
- Every widget shares one voice: casual second person («یه», «رو», «بشه»), errors as «نتونستیم … رو بیاریم» with «دوباره امتحان کن», «به‌روز کن» in the menu to fetch again, «… جدید» on the add button of a header or an empty state, a delete asked as «این … حذف بشه؟» with «حذف» and «نه» and confirmed by the toast «… حذف شد», whose sound is part of the feedback, `…` for an ellipsis, and no full stop after a toast or an empty state's line. `WidgetError` holds the shared words: «دوباره امتحان کن» on its button, «نتونستیم بیاریمش» when `compact`. `RequireAuth` asks «اول وارد حسابت شو» with «ورود».
- Prefer per-source errors where a widget has several: one dead RSS feed must not blank the other two. Never show an error over data you already have; a slightly stale price beats an error message.
- **Anything read back from storage is untrusted.** Put a `normalize-*` helper in the feature's `utils/`, give it a test, and route every read through it. `yadkar`, `tools`, `combo-widget`, `transparent-clock` and `notes` have one; copy the nearest.
- **A setting needs a writer and a reader.** If you find one with only a half, say so and ask.
- **Premium gating has two independent paths.** `allowedSizes[].isVipOnly` locks a widget already on the canvas. The add and edit modal checks the variant's flag and skips the size check for any widget that declares variants. A widget with both variants and a premium size needs `isVipOnly` in both places. They are not duplicates.
- Storage keys, widget ids and analytics names are data. Never rename the strings.

## Design decisions (do not "fix")

- Canvas collision is push down only, with no compaction. Gaps between widgets are deliberate and survive a move. The earlier backtracking solver froze the extension for 112 seconds on one drag. Compaction exists behind an option and is off.
- The canvas is `MAX_CANVAS_ROWS` (12) rows deep at 8 columns, scaled by `8 / cols` on narrower grids (`row-cap.ts`). `resolveLayoutChange` refuses a move, resize, add or duplicate whose result reaches past it, or past the layout's current bottom when that is already lower, so an old layout that is too tall still works but cannot grow. The drag clamps to the same row. In edit mode the canvas shows every row up to the cap, so it does not shrink under a widget dragged upward.
- `voice-search-portal.tsx` starts the microphone in a mount effect. Never make it always mounted.
- Dragging a widget near the top or bottom of the page scrolls the page (`hooks/use-drag-auto-scroll.ts`; the speed rule is `utils/edge-scroll.ts`, tested). The drag offset adds how far the page has scrolled since the drag began, so the widget stays under the pointer while the page moves, wheel scrolling included. Before this, you carried a widget from low on the page to the top in steps: drop it at the top of the window, scroll, drag again.

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

Pure modules only: `__tests__/` covers the layout engine, push down, migration, size choice, zoned time and the drag's edge scrolling; each widget covers its own maths and `normalize-*` helpers.
