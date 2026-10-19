---
name: widget-spotlight-editor
description: How to let people customise a widget's look in place, with a live preview, in the Widgetify extension. Use this whenever a widget needs appearance settings (style, colour, size, weight, font, finish) that the user should see change on the widget itself, whenever someone asks for "customisation like the iPhone lock screen", or when a settings modal or popover for a widget feels crowded or hides the widget. Prefer it over a settings modal or a PopoverMenu for anything visual.
---

# Widget spotlight editor

The pattern for editing how a widget looks while you watch the real widget change. The page dims except the widget (a spotlight), and a short bar at the bottom of the screen holds the controls, one group at a time. It copies the iPhone lock screen clock editor.

The working reference is the transparent clock: `src/features/widgets/transparent-clock/` (`components/clock-style-editor.tsx`, `hooks/use-clock-style-draft.ts`, `utils/normalize-style.ts`, `utils/clock-paint.ts`). Read it before building another one.

## Why not a modal or a popover

Both were built and tried by the owner first, and both felt crowded:

- **Modal**: covers the widget and shows a fake preview on a plain box, without the wallpaper the widget really sits on.
- **PopoverMenu beside the widget**: shows every control at once, so the panel competes with the widget; it also ran off screen and had to measure itself again when it grew.

The spotlight keeps the real widget as the preview, and the tabs keep the bar small. Visual settings belong here; settings that are data (a goal date, a city, an RSS feed) still belong in the widget settings modal.

## The pieces

1. **Style in `meta`, flat, with a normaliser.** Store each setting as its own key in the widget's `meta` (`clockFace`, `clockWeight`, …) next to `variant`. Write `normalize<Widget>Style(meta)` that clamps numbers, rejects unknown values and falls back to defaults that draw the widget exactly as before the feature, and a `…StyleToMeta(style)` that writes it back. Test both, including a round trip.
2. **Pure paint function.** Turn the style into CSS in a dependency-free util (`getClockDigitsPaint`) and test it. Remember the browser floor (Chrome 109, Firefox 115): no `color-mix()`, so build translucent colours as `hsla()`/`rgba()` from channels (`inkHsl` from `use-wallpaper-theme.ts`, or `--color-base-content-rgb`).
3. **Draft hook.** `use<Widget>StyleDraft(instanceId, meta)` holds `draft | null`. `style = draft ?? stored`; `start()` copies the stored style, `update()` changes the draft, `save()` writes once through `updateWidgetSettings(instanceId, { ...meta, ...toMeta(draft) })` and clears it, `cancel()` clears it. Saving once matters: `updateWidgetSettings` also calls the server, so writing on every slider move floods it. Use `useOptionalFreeWidgets()` so the widget still renders in previews outside the canvas provider.
4. **The widget draws `draft.style`.** That is the whole live preview. Wrap the content in a `div` with a ref (`w-full h-full`) to measure for the spotlight.
5. **Open it from the widget menu.** `useWidgetMenuActions(<PopoverMenuItem icon={<Icon name="brush" …/>} label=… description={summary} onClick={openEditor} />)`. Put the current style in `description`. Do not set `settingsTab` for this.
6. **The editor component** (`components/<widget>-style-editor.tsx`), in `<Portal topLayer>` (its host has `pointer-events: none`, so give children `pointer-events-auto`), with `Presence` and `Motion` from `@/common/motion`:
   - Spotlight: a full screen layer whose click saves, holding a box over the widget's rect (padded 8px, `rounded-widget`) with `boxShadow: '0 0 0 200vmax var(--color-scrim)'`. Measure the rect in a layout effect and again on `resize` and on `scroll` (capture).
   - Bar: `fixed inset-x-0 bottom-4 mx-auto w-[min(36rem,calc(100vw-2rem))]`, `bg-glass-surface-2 border border-line rounded-2xl shadow-xl p-3`, `role="dialog"`. Header row: «لغو» (ghost button), `TabNavigation` with the groups, «تموم شد» (solid brand button). Body: `min-h-20`, only the active tab's controls.
   - Escape cancels. A click on the dimmed page saves.
7. **Keep each tab to one or two rows.** Tiles for discrete choices (render a small sample in each option with the same paint function), short sliders with the label and value on the left, one row of round swatches. Wrap each slider in `dir="ltr"`: in the right-to-left page a native range runs from the right and the owner read it as reversed. Name a slider for what grows when you drag it right («میزان رنگ», not «شفافیت»). Keep everything about one subject in one tab (finish, colour amount and colour all live in «رنگ»). End the swatch row with `ColorPicker` (pass `className`/`style` to make its trigger a round swatch, a colour wheel until a custom colour is picked): its popup opens in the top layer after the editor, so it stacks above the bar. Inside a `PopoverMenu` it does not work, because the popover counts a click in the picker as outside and closes.

## Pro gating

If some groups are pro (the clock: «سبک» and «رنگ» are pro, «ضخامت و اندازه» is free):

- Pass `isVip` from `useAuth()` to the editor. Give locked tabs `icon: <VipBadge size="xs" iconOnly />` and open the editor on the first free tab.
- A locked tab still shows its controls, `inert` with `opacity-40`, under a small card with one line and an «ارتقا به پرو» button (`color="vip"`). The button sends `<widget>_vip_required`, cancels the draft and calls `callEvent('openSettings', 'vip')`.
- At render, draw a free version of the style without pro (`toFreeClockStyle`: defaults for the pro parts, stored values for the free ones). Keep the pro values in `meta` so they return with pro. Test that function.

## Checklist

- Copy in `src/common/i18n/fa/widgets.ts`, following `.agents/TYPOGRAPHY.md`. Labels for enum values go through a `Record<Value, MessageKey>` map, never a template-built key (`i18n.test.ts` rejects it).
- Analytics in `ANALYTICS_EVENTS` (`src/__tests__/data-names.test.ts`): `<widget>_settings_opened`, `<widget>_style_saved`, and `<widget>_vip_required` when gated.
- Watch the repo tests that bite here: a bare `rounded` string anywhere, even as a data value (design test), exports nobody imports (`architecture.test.ts`), and importing another feature's internals (also architecture).
- Show the owner the options early and expect some to be cut: three of the clock's five shapes were dropped after a look on screen.
- Rewrite the widget's README: the style keys and defaults, the editor, the pro rules, and what was not checked on screen.
- `npm run check`, then grep the built CSS (`.output/chrome-mv3/assets/*.css`) for any new arbitrary classes. You cannot see the UI; give the owner a visual checklist: every option on a bright, a dark and no wallpaper, each widget size, signed out and without pro.
