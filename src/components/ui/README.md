# components/ui

Presentational primitives. They know nothing about the app, the server or a feature. Import them from `@/components/ui`.

## What is here

| Need | Use |
|---|---|
| Action | `Button` (`variant`, `color`, `size`, `rounded`) |
| Selectable pill | `Chip` (`selected`, `size`: `md`, or `sm` for a soft filter pill) |
| Notice box | `Alert` (`tone`: danger, warning, info) |
| Loading | `Spinner` (`xs` to `2xl`, `tone`) |
| Dialog | `Modal`, `ConfirmationModal`. `stepAside` hides an open modal without closing it. Its content keeps its state while you look at the page behind it, as the store's try-on does |
| Hint on hover | `Tooltip`; `ClickableTooltip` when a click opens it and you hold `isOpen` |
| Form | `TextInput` (`variant="bare"` drops the field chrome for an input set inside a card of its own), `TextArea` (the same field, several lines), `SelectBox`, `ToggleSwitch`, `Slider`, `DatePicker`, `ColorPicker` |
| Menu | `Dropdown` with `DropdownItem` and `DropdownDivider`; `PopoverMenu` with `PopoverMenuItem` (an optional `description` adds a second line), `PopoverMenuHeader` and `PopoverMenuDivider`. `PopoverMenu` measures itself and opens above its anchor when there is no room below (`utils/menu-position.ts`); arrow keys move between its buttons and Escape returns focus to the trigger. A `Dropdown` closes on a click outside it, including a click elsewhere in the modal it sits in; it stays open only for a click in a layer opened above it (`use-dropdown.ts`). |
| Overlays | `BottomSheet`, `Portal`, `StackedToaster` |
| Small marks | `Badge`, `NewBadge` (a pulsing dot for something new), `VipBadge`, `FloatingBadge` (a sticker on a corner), `AvatarComponent`, `Kbd`, `ProgressRing` |
| Layout helpers | `SectionPanel` (an optional `action` sits at the end of its header), `TabNavigation`, `ItemSelector`, `ImageSlider` |
| Picking from a grid | `Tile`: a card with a picture on top and a title row (`bare` drops the row). `aspect` is `video`, `wide` or `short`; `selected` rings it; `actions` show on hover |
| A row that scrolls sideways | `ScrollRow`, with previous and next buttons that appear only when there is more to see |
| Nothing to show | `EmptyState`: an icon, a line, an optional second line and an optional action |

Look here before writing any UI. If a component other areas would reuse is missing, build it here, not inside a feature.

## Rules

- **Colours** come from tokens (`bg-surface-2`, `text-fg-muted`). `Button` takes `color` from the token names: `base`, `brand`, `danger`, `success`, `warning`, `vip`. `brand` is the app's main action. See `src/styles/README.md`.
- **Variants** live beside the component as `<component>.variants.ts` (cva). Extend those; do not pile classes at the call site. Class merging goes through `cn()` from `@/common/utils/cn`.
- **Radius** defaults to `xl`; every radius has a role in `src/styles/README.md`.
- **Semantic elements.** Use `button`, `a`, `label`, `nav`, `section` before `div` or `span`. Never put a `button` inside an `a`. Biome rejects a click handler on a static element.
- **Icon buttons** need an `aria-label`. A `Tooltip` is a hint for the mouse, never the only name.
- **A decorative icon** takes `aria-hidden`. `Spinner` announces itself as a status, so pass `aria-hidden` when the text beside it already says "loading".
- **Focus** uses `focus-visible:focus-ring`.
- **Loading** is `Spinner` only. `animate-spin` appears nowhere else.
- **No app knowledge.** A primitive never imports `@/services` and never reads a feature type.
- Tests: `architecture.test.ts` ("name each components/ui folder after its entry file") and `design-system.test.ts` ("spins only through Spinner or Icon spin").

## Modal

- Always right to left. `Modal` has no direction prop; it labels itself from `title` and its close button reads «بستن».
- Escape and the backdrop close it when `dismissible` allows. Focus moves into the dialog on open and returns on close.
- daisyUI already animates `.modal` in both directions, as a transition on the `open` attribute. `Modal` keeps its dialog in the page and sets or removes `open` from an effect; it does not call `showModal()`, so the dialog is not in the top layer and stacks by a z-index that grows with each open (`BASE_MODAL_Z_INDEX`). The children stay for `EXIT_ANIMATION_MS` after closing (`use-delayed-unmount.ts`), so the exit has something to fade.
- So keep a modal mounted and toggle `isOpen`. A modal mounted already open can get `open` before its first paint, because React runs the effects of a click's render before the browser paints; `@starting-style` covers `.modal` but not `.modal-box`, so the box skips its enter. A modal unmounted on close skips its exit. Keep what it shows until it opens again, too: clearing its data on close swaps the content while it fades out.
- Do not add an enter animation of your own.

## Writing the words

Persian, friendly, short. Talk to the person, not at them. Say what happened and what to do next.

| Instead of | Write |
|---|---|
| خطایی رخ داده است | یه مشکلی پیش اومد، دوباره امتحان کن |
| عملیات با موفقیت انجام شد | انجام شد |
| لطفاً جهت ادامه وارد شوید | برای ادامه وارد حسابت شو |
| داده‌ای یافت نشد | هنوز چیزی اینجا نیست |

No exclamation marks in errors. A button says the action («ذخیره»), not the situation («تایید نهایی اطلاعات»).

## Adding a component

1. Check this folder first.
2. Create `<name>/<name>.tsx`, and `<name>.variants.ts` if it has visual variants.
3. Export it from `index.ts`. This is one of the three barrels.
4. Use only tokens, `cn()` and `Icon`.
5. If it has logic worth testing, put it in a dependency free file and test that (`modal/animation-timing.ts`, `utils/anchored-position.ts`).

## Mistakes that happened

- A native `title` as a tooltip: invisible to keyboard users and a second style next to `Tooltip`.
- Hand-rolled spinners in about twenty places, each a slightly different size.
- `onClick` on a `div`: no keyboard, no role.
- A radius or shadow class that compiled to nothing (`rounded-md`, `shadow-xs`) and silently drew nothing.
