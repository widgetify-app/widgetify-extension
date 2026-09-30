# Pet widget

Agent reference for `src/features/widgets/pet/`. Read this before changing anything in the folder. Everything here was read from the code; the last section says what has and has not been checked on screen.

## Summary

A single sprite pet lives inside a fixed 2x1 widget cell. It follows a per-species state tree (walk to a wall, turn, walk back, sit, lie, run), chases and eats food the user drops with a click, and slowly gets hungry. Eight species: dog, cat, chicken, crab, frog, owl, sheep, hedgehog. Four built-in backgrounds: none, forest, autumn, beach. Dynamic backgrounds (like tehran) are uploaded via the admin panel and fetched from user inventory. Free tier, no server calls.

## File map

| Path | Responsibility |
|---|---|
| `pet.widget.tsx` | Entry. `PetProvider` > `WidgetContainer` > `PetScene`. `PetScene` paints the background image and sets `--pet-ground`. |
| `pet.context.tsx` | `PetProvider`: holds the persisted global settings, unsaved live edits and the widget `meta`, resolves them with `resolvePetSettings`, owns hunger and its persistence, listens to `updatedPetSettings`. |
| `pet-setting.tsx` | Settings panel in two modes (see Persistence): species picker, background picker, name input (`maxLength` 20). Also the only writer of global choices. |
| `types.ts` | `PetTypes`, `PetState`, `PetSequence`, `PetDimensions`, `PetFlight`, `PetHop`, `PetAnimations`, `PetSpeed`, background types, storage and event augmentation. |
| `constants.ts` | Icons and previews per species, Persian labels, `PET_BACKGROUNDS`, default names, hunger constants. |
| `hooks/use-base-pet-logic.ts` | The simulation loop, the scheduler and the painting of the pet. Only place that moves the pet. Returns `animationSrc`, `airborne`, `direction`, `showName`, `collectibles`. |
| `components/base-pet.tsx` | `BasePetContainer` and `CollectiblesRenderer`, both `memo`. Renders the pet, food, tooltip. No logic. |
| `components/pet-factory.tsx` | Picks the species component and renders `PetHud`. |
| `components/pet-item/pet-<species>.tsx` | One per species: animation map, dimensions, assets, wiring into the hook. |
| `components/pet-hud.tsx` | Five hearts. `filled = ceil(level / 20)`. |
| `utils/pet-sequence.ts` | State facts (pace, facing, hold time), `chooseNextState`, `hasReachedWall`. Pure. |
| `utils/species-sequences.ts` | `PET_SEQUENCES`: the state tree of every species. Pure data. |
| `utils/pet-hop.ts` | Frog hop arcs. Pure. |
| `utils/pet-flight.ts` | Owl flight: cruise altitude, bob, dive, landing. Pure. |
| `utils/pet-movement.ts` | `getMovementBounds`, `clampToBounds`, `stepWalk`, `frameScale`. Pure. |
| `utils/pet-schedule.ts` | `chooseTickMode`: whether the loop runs every frame, polls slowly, or stops. Pure. |
| `utils/get-pet-background.ts` | Background lookup with fallback to `none`. |
| `utils/resolve-pet-settings.ts` | `resolvePetSettings` and `mergePetMeta`: the single rule for which value the widget and the settings panel show. Pure. |
| `__tests__/` | `pet-sequence`, `pet-hop`, `pet-flight`, `pet-movement`, `pet-schedule`, `resolve-pet-settings` tests. |

Sprites live in `src/assets/animals/<species>/`, backgrounds in `src/assets/animals/backgrounds/`.

## Runtime model

`PetFactory` renders one species component. Each component calls `useBasePetLogic({ animations, dimensions, sequence, assets, isHungry, callbacks })` and passes the result to `BasePetContainer`. The animation map, dimensions and assets of a species are **module-level constants** (`DOG_ANIMATIONS`, `DOG_DIMENSIONS`, `DOG_ASSETS`), so they keep their identity across renders. The frog is the one exception: its food icon has a per-instance random colour, so its assets go through `useMemo`.

The hook keeps the simulation in refs (`positionRef`, `directionRef`, `activeRef`, `hopRef`, `collectiblesRef`, `cruiseAltitudeRef`, `sizeRef`) and mirrors into React state only what changes what is rendered: `direction`, `petState`, `hopPhase`, `airborne`, `collectibles`, `showName`. It reads current props through `propsRef`, so the callbacks are stable and the loop never restarts.

**The position is not React state.** Every tick paints it straight onto the pet element (`paint`: `style.transform = translate3d(...)`, rounded to 0.01 px and skipped when unchanged). A React render happens only when something discrete changes: a new state, a hop phase, taking off or landing (`airborne`, height above 0.5), a turn, food added or eaten. `willChange: transform` keeps the pet on its own compositor layer, so moving it does no layout or paint.

**The container size is cached.** `sizeRef` is read once in a layout effect and refreshed by the `ResizeObserver`; `getBounds` is pure arithmetic on it. Nothing in the loop reads `offsetWidth`, `offsetHeight` or `getBoundingClientRect` (the only one is in `dropFood`, on a click).

**Scheduling** (`chooseTickMode` in `utils/pet-schedule.ts`, applied after every tick):

| Situation | Mode |
|---|---|
| Widget not intersecting the viewport (`IntersectionObserver`) | `stopped`: no frame, no timer |
| Pet in a still state, on the ground, no uneaten food | `idle`: `setTimeout` every `IDLE_POLL_MS = 100`, accumulating the elapsed time |
| Anything else (moving, in the air, food present) | `frame`: `requestAnimationFrame` |

`dropFood` calls `wakeRef.current()` so a click switches from `idle` to `frame` immediately. Becoming visible again resets the clock and restarts the loop. In `frame` mode a tick still runs only when at least `MIN_TICK_MS = 16` passed, and the step is capped at `MAX_TICK_MS = 250` so a backgrounded tab cannot produce a huge jump. Movement is scaled by `frameScale(elapsed)` (reference frame 16.67 ms, capped at 3), so speed is refresh-rate independent.

The container renders the sprite as `animationSrc` (a string, computed with `useMemo` in the hook). Every sprite a pet has used stays mounted as a hidden `<img>` so switching animation never flashes; a new one is added during render (no extra commit).

## State machine

Modelled on the vscode-pets sequence trees. States (`PetState`):

| State | Pace | Facing | Ends when |
|---|---|---|---|
| `sit-idle` | still | keeps current | hold time elapsed (3000-6000 ms) |
| `lie` | still | keeps current | hold time elapsed (5000-9000 ms) |
| `eat` | still | keeps current | hold time elapsed (1200-1800 ms) |
| `walk-right` / `run-right` | walk / run | right | reached the right wall, or 30 s safety limit |
| `walk-left` / `run-left` | walk / run | left | reached the left wall, or 30 s safety limit |
| `chase` | chase | toward food | food is gone (collected or removed) |

Every tick, in order:

1. `updateCollectibles`: falls food, detects collection. Collection enters `eat` and calls `onCollectibleCollection`.
2. If food is available and the state is neither `chase` nor `eat`, enter `chase` (interrupts everything, including sleeping and walking).
3. Advance the state's timer, move the pet according to its pace, and detect completion.
4. On completion, `chooseNextState(sequence, from, isHungry, random)` picks uniformly from the species' options for `from`. Duplicated entries are how weights are expressed. A missing entry falls back to `sit-idle`. A hungry pet is restricted to `sit-idle` / `lie` when the options contain any.
5. A finished `chase` with no food left goes to the options of `eat`.

`enterState(next, voluntary)` sets facing, picks a flight cruise altitude (owl, on walk or run), creates a fresh hop state (frog, on any moving state) and, when `voluntary`, calls `onLevelDownHungryState`. Entering `chase` and `eat` is not voluntary.

Each pet also gets a random speed multiplier `1 +/- 0.25`, fixed for the lifetime of the component (`speedVarianceRef`).

## Movement styles

Chosen by fields on `PetDimensions`. A pet has at most one of `hop` / `flight`.

- **Plain walk** (dog, cat, chicken, crab, sheep, hedgehog): `stepWalk` moves horizontally at `walkSpeed` or `runSpeed` times the variance and pulls any residual height down at `FALL_SPEED = 1.5`.
- **Hop** (`hop`, frog): `stepHop` alternates `crouch` (timer, still) and `air` (parabola: `y = 4 * height * p * (1 - p)`, `x` lerps to a clamped target). Hops never leave the bounds and a hop that would move less than 0.5 px stays crouched (that is how the pet rests against a wall). Running (`fast`) multiplies crouch time by 0.4, distance by 1.5, height by 1.2 and duration by 0.75. While chasing, the hop direction points at the food, the distance is capped at the remaining distance so it lands on the target, and arrival is within `HOP_ARRIVAL = 2` px. Animation: `run` while airborne, `idle` while crouching.
- **Flight** (`flight`, owl): `stepFlight` moves horizontally and eases height toward `cruiseAltitude + bob` at `climbRate`. Bob is a sine (`bobAmplitude`, `bobPeriodMs`). Still states descend at `landRate`. Chasing food dives with `stepDive`: the allowed height is capped by `distanceX * diveSlope` and falls at most `diveRate` per frame. Food can only be collected when height is at most `COLLECT_HEIGHT = 6`. Animation: `fly` whenever height is above 0.5, otherwise the state's usual animation.
- **Sidestep** (`sidestep`, crab): only affects rendering. The reported direction is always `1`, so the sprite never flips while it travels either way.

Chasing on plain pets is a straight line at `runSpeed`. `getMovementBounds` supplies `minX` (10), `maxX` (container width - sprite width - 10) and `maxY = max(0, min(maxHeight, container height - sprite height))`.

## Species

All: `width` 50, `size` 32 unless noted, sprites face right and are flipped with `scaleX(-1)`. Speeds are `PetSpeed` (SLOW 1, NORMAL 1.8, FAST 2.5, VERY_FAST 3.5).

| Species | Default name | walk / run speed | `maxHeight` | Style | Tree highlights |
|---|---|---|---|---|---|
| dog | آکیتا | NORMAL / VERY_FAST | 100 | plain | can `lie`; after a left trip goes to `sit-idle`, `lie`, `walk-right` or `run-right` |
| cat | زردآلو | SLOW / NORMAL | 100 | plain, `size` 25 | can `lie`; weighted toward walking; runs rarely |
| chicken | قدقدپور | SLOW / FAST | 100 | plain | no `lie` (no sit animation) |
| crab | چنگولی | SLOW / NORMAL | 80 | plain + sidestep | no `lie` |
| frog | قوری | SLOW / NORMAL | 80 | hop: distance 35-60, height 12-22, 450 ms, crouch 500-1200 ms | can `lie` after a left trip |
| sheep | میشا | SLOW / NORMAL | 100 | plain, `size` 32 | can `lie`; like the cat it walks far more than it runs; art from the owner's own drawing |
| hedgehog | تیغو | SLOW / NORMAL | 100 | plain, `size` 32 | curls into a ball for `lie` (the `lie` clip is a ball of spines with the eye and nose peeking out) and does so more often than the cat or sheep |
| owl | جغدو | 1.3 / 2.4 | 100 | flight: cruise 12-56, bob 3 over 900 ms, climb 0.9, land 0.7, dive 1.4, slope 0.5 | can `lie`; walk and run both use the `fly` clip |

The cat's `size: 25` predates this work and was left alone.

Animation mapping (`getAnimationForCurrentAction`): `lie` -> `sit` clip (falls back to `idle`), `eat` -> `swipe` clip (falls back to `idle`), `walk-*` -> `walk`, `run-*` and `chase` -> `run`, everything else `idle`. Hop and flight override as described above.

## Food and hunger

- Click anywhere in the pet area drops food at that x (`e.clientX - left`). A keyboard activation (`e.detail === 0`) drops it one sprite width beside the pet.
- At most `MAX_ACTIVE_PET_FOOD = 3` uneaten pieces. Food enters from below the floor and rises to `y = 0` (see Design decisions). It is only chase-able once it stops dropping (`y <= 5`).
- Collection: horizontal distance under half the sprite width, plus the height check for flyers.
- Eating adds `5`, `10` or `20` (`HUNGER_GAIN_STEPS`, random) to the level, capped at 100.
- Hunger level is 0-100 per species. It loses 1 per voluntary state entry, at most once per `HUNGER_TICK_MS = 40000`. A full pet therefore needs at least about 67 minutes of activity to reach 0.
- `isPetHungry` is true only at level 0. A hungry pet is limited to resting states (`sit-idle` / `lie`) by `chooseNextState`, and the tooltip shows the hungry message with a plate emoji permanently. Otherwise the tooltip shows the name on hover.

## Geometry

The widget is one fixed size (`allowedSizes: [{ w: 2, h: 1 }]`), so its height is the layout engine's cell height: 96, 88, 80 or 72 px depending on density. `BasePetContainer` is `absolute top-0 bottom-0` and `PetScene` passes `bottom-(--pet-ground)`, so the play area is the widget height minus the background's `groundOffsetPx`. It used to be a fixed 64 px strip (`h-16`), which capped flyers at 32 px of air. If you change the container, re-check the owl's `cruiseMax` (it is clamped to `maxY`, so it is safe at any height) and the tooltip placement.

The container is a `button` and the click handler is on it, so the whole play area is clickable.

## Backgrounds

`PET_BACKGROUNDS` in `constants.ts`, id type `PetBackgroundId`. All lossless WebP, drawn with `background-size: auto 100%`, bottom centred.

### Dimensions & Aspect Ratio Standard
- **Standard resolution for new backgrounds:** **`640 × 240 px`** (lossless WebP, animated 8fps or static).
- **Ratio rationale:** A 2×1 widget is `256 × 96 px` (at standard `lg` density, cellHeight 96, aspect ratio `8:3 = 2.666`). Under `background-size: auto 100%`, a 240 px tall background scales to 96 px height, yielding an exact rendered width of `640 * (96 / 240) = 256 px`. This ensures zero horizontal cropping on the container edges.
- **Architectural safe zone:** Keep critical boundary elements (pillars, hanging lanterns, edge furniture) within $x \in [14, 626]$ px so they remain clearly visible and unclipped by the widget container's rounded corners (`rounded-widget`).
- **Legacy assets:** Older panoramic outdoor nature strips used ~792 px width (`forest` 793×240, `autumn` 793×197, `beach` 792×242, `tehran` 792×240) where seamless horizontal cropping of repeating foliage/sky was acceptable, but architectural interiors must use 640×240.

| id | Label | `groundOffsetPx` | File |
|---|---|---|---|
| none | بدون محیط | 0 | - |
| forest | جنگل شب | 7 | `forest.webp` |
| autumn | پاییز | 3 | `autumn.webp` |
| beach | ساحل | 10 | `beach.webp` |

Additional backgrounds (e.g. Tehran) are served dynamically from the marketplace and user inventory.

## Persistence and settings

Two stores, one rule.

- **Global store**: storage key `pets` (`StorageKV`, type `PetSettings`): `petType`, `background`, and `petOptions[species] = { name, type, hungryState: { level, lastHungerTick } }`. It holds the hunger of every species and acts as the **default pet**. Never rename the key.
- **Widget meta**: each canvas widget instance has `meta` (`petType`, `petName`, `background`) inside the layout (`storedWidgets`, and the server layout for signed-in users). It is written with `updateWidgetSettings(instanceId, ...)`.

**Resolution rule** (`resolvePetSettings`, field by field): widget `meta` first, then the global store, then `BASE_PET_OPTIONS`. `meta.petName` applies to the active species only. A species value that the app does not know (corrupt or removed) falls back to the dog. Species missing from an older stored value get their defaults (this is how an older user gets the owl), and stored hunger is always kept. Both `PetProvider` and the settings panel use this function, so they cannot disagree.

**Two ways to open the settings panel**, same component, different `instanceId`:

| Opened from | `instanceId` | Saves to | Effect |
|---|---|---|---|
| The widget's own gear on the canvas | set | that widget's `meta` (name save debounced by `PET_NAME_SAVE_DEBOUNCE_MS = 500`) | changes only that widget |
| The widget catalog's settings button | none | the global store (immediately) | changes the default pet; every widget that has no `meta` value for a field follows it. Widgets with their own `meta` are unaffected |

Events: `updatedPetSettings` (`instanceId`, `petName`, `petType`, `background`). With an `instanceId` the provider of that instance applies it as an unsaved live edit (`live`), which is dropped as soon as the saved `meta` arrives. Without an `instanceId` it means "the global store changed": every provider re-reads storage. Only the settings panel writes global choices, so several widgets never overwrite each other. Hunger is the one thing providers write themselves: a read-modify-write that merges only `hungryState` into storage.

Rules worth knowing:

- The settings panel saves through one function that reads the latest values, and changing species cancels a pending name save; otherwise a stale name or species would be written back.
- Switching species sets the name to that species' stored or default name. The widget keeps one name, for the active species.
- Both places that render a widget must pass `meta`: the canvas (`WidgetSlot`) and the list view used when cells are too narrow (`widgets.tsx`). The list view used to omit it, which reset every pet to the default dog.
- `PET_NAME_SAVE_DEBOUNCE_MS`, `updateWidgetSettings` and the layout persistence are shared with other widgets. Do not special-case the pet there.
- Nothing pet-specific is sent to a server by the pet code. For signed-in users the widget layout, including `meta`, syncs through the generic widget sync, and the backend stores `meta` unchanged (size-limited and sanitised, not whitelisted).

## Accessibility

The container is a `button` labelled `غذا دادن به <name>`. Keyboard activation feeds. `PetHud` is `role="img"` with `سیری: N از 5`. Sprites and food are `aria-hidden`. The settings panel has an info tooltip with three tips (click to feed, hover for the name, max three foods).

## Sprite spec

- Animated WebP, faces right, transparent, 8 fps naming (`*_8fps.webp`). Existing species use their own frame sizes.
- Owl: 64x64, 8 frames of 125 ms (drawn at 32x32 and scaled 2x with nearest neighbour, which is exactly twice the size it is displayed at; it was 160x160 before, which decoded six times more pixels for the same picture), clips `owl_idle`, `owl_swipe`, `owl_lie`, `owl_fly`. Food is `owl-food.png` (24x24, like every species). Lossless WebP; identical consecutive frames collapse in the file but the total duration stays 1000 ms.
- `swipe` is the eating clip, not a greeting or attack. `sit` is the lying pose. Do not reuse them for other meanings.
- The owl art was drawn in Aseprite through a Lua script that lives outside the repo; the editable sources are not committed. Redrawing means starting from the exported WebPs or recreating the script.
- Sheep: 64x64, 8 frames of 125 ms per clip (`sheep_idle`, `sheep_walk`, `sheep_run`, `sheep_swipe`, `sheep_lie`), food `sheep-food.png` (a 24x24 canvas holding a 12x9 grass tuft with a flower, standing on the bottom row). It was built from the owner's own `sheep.aseprite` (32x32, 4 frames): the body, head and legs are that artist's pixels, and only the poses were added by moving parts of them (leg swing and knee step for walk and run, a lowered head with grass for eat, the body dropped to the ground for lie, the ground line at the bottom row). The editable source of the added poses is not in the repo.
- Food art is small and bottom-aligned inside its 24x24 canvas: the existing foods are 9-18 px tall, the sheep's is 9. The canvas size is the pickup and layout size (`collectibleSize`), not the size of the picture, so never fill the canvas, and draw the food at the same pixel scale as the pet (one art pixel per screen pixel for the sheep).
- Hedgehog: 64x64, 8 frames of 125 ms per clip (`hedgehog_idle`, `hedgehog_walk`, `hedgehog_run`, `hedgehog_swipe`, `hedgehog_lie`), food `hedgehog-food.png` (an 11x10 apple on the bottom of the 24x24 canvas). Drawn at 32x32 with a procedural spine dome (a radial stripe pattern, lighter tips and a jagged outline) plus a hand-placed face. `swipe` shows the snout on the ground with closed eyes, and `lie` shows a ball with blue "z" marks. The label shown in the picker is «جوجه‌تیغی». The drawing script is not in the repo.
- Every species needs `idle`, `walk`, `run`, and optionally `swipe`, `sit`, `fly`.

## Adding a species

1. Add the value to `PetTypes` and to the `PetSpecies` union in `types.ts`.
2. Add sprites under `src/assets/animals/<species>/` and a food PNG (24x24).
3. Add icon, preview, Persian label and a `BASE_PET_OPTIONS` entry (default name, `hungryState.level: 100`) in `constants.ts`.
4. Add its tree to `PET_SEQUENCES` in `utils/species-sequences.ts`. Only reference `lie` if the species has a `sit` clip. Follow the tree rules below.
5. Create `components/pet-item/pet-<species>.tsx` from the nearest existing one, and add the `switch` case in `pet-factory.tsx`.
6. Run `npm test`; `pet-sequence.test.ts` checks every tree automatically.

Tree rules enforced by the tests: only real states, every reachable state has a next step, `walk-right` / `run-right` lead only to left-facing states, a left trip can end in `sit-idle`, `eat` leads to a moving state, `chase` leads to exactly `['eat']`, and a random walk through the tree visits at least five states.

## Tuning knobs

| Want | Change |
|---|---|
| Pet pacing | walk and run speeds in the species file |
| How long it rests | `HOLD_MS` in `utils/pet-sequence.ts` |
| How often it runs, lies, sits | duplicate or remove entries in its tree |
| Speed spread between pets | `SPEED_VARIANCE` in the hook |
| Hop feel | the frog's `hop` block |
| Flight feel and ceiling | the owl's `flight` block |
| Hunger pace | `HUNGER_TICK_MS`, `HUNGER_GAIN_STEPS` |
| Food limit | `MAX_ACTIVE_PET_FOOD` |

## Performance

Measured with a throwaway harness that mounted the real `PetProvider` and species component in a plain page, replaced the animation clock, timers and `IntersectionObserver` with a fake clock, ran a fixed number of frames with a seeded `Math.random`, and counted work. The harness itself costs about 1.45 ms per simulated second (message-channel flushing), which is subtracted where noted. It measures JavaScript, React and DOM-write cost, not compositing or paint.

| 60 Hz, 60 simulated seconds | React commits/s | Layout-property reads/s | Loop callbacks/s | Cost above harness floor |
|---|---|---|---|---|
| Dog before | 37.0 | 194 | 60 | 1.69 ms/s |
| Dog after | 0.3 | 0.03 | 40 frame + 3 timer | 0.56 ms/s |
| Owl before / after | 30.7 / 0.3 | 177 / 0.03 | 60 / 40 + 3 | 1.6 / 0.8 ms/s |
| Frog before / after | 16.7 / 3.4 | 204 / 0.03 | 60 / 44 + 2 | 1.2 / 0.6 ms/s |
| Owl at 144 Hz before / after | 42.4 / 0.3 | 180 / 0 | 144 / 115 + 2 | 3.4 / 2.1 ms/s |

Behaviour was checked in the same harness: with the widget reported off screen there were zero callbacks, timers and DOM writes and the pet did not move, and it resumed on becoming visible; a click still made the dog run to the food, eat it for about 1.5 s and carry on.

What this does not show: the remaining commits are real visual changes (sprite swaps, hop phases, turns); at 144 Hz about three quarters of the frame callbacks are cheap no-ops that wait for the 16 ms gate; compositing, paint and image decode were not measured; nothing was measured on a real extension page or on a slow device.

## Tests

`bun test` covers only the pure modules: state facts, hold times, wall detection, `chooseNextState` (including hunger), all eight species trees, hop arcs (landing on the floor, bounds, direction, chase without overshoot, wall behaviour, running vs walking), flight maths, movement bounds, the tick-mode rule, and settings resolution. It does not render `use-base-pet-logic.ts` or any component; there is no React test setup in this repo. `architecture.test.ts` allows one `<feature>.md` at a feature root, added for this file.

## Invariants

- Only `use-base-pet-logic.ts` writes the pet position. Species files only configure.
- The pet position never goes into React state, and nothing in the tick reads layout (`offsetWidth`, `offsetHeight`, `getBoundingClientRect`). Use `paint` and `sizeRef`. Putting either back turns every tick into a React commit or a forced layout.
- Per-species configuration objects live at module level. Building them inside the component defeats `memo` on `BasePetContainer` and re-creates the animation lookup on every render.
- The loop must stop when the widget is off screen and must not run per frame while the pet rests. Anything that needs to react to a user action while resting must call `wakeRef.current()` (as `dropFood` does), or it will wait up to `IDLE_POLL_MS`.
- Species trees are data in `species-sequences.ts`; do not encode behaviour by adding branches to the hook.
- `swipe` = eating. Do not play it while idle.
- No wall climbing. It was removed because there is no climb art and the pet floated. Do not reintroduce it without dedicated sprites.
- Pets never leave `[minX, maxX]` or go below `y = 0`; hops and flight clamp to the bounds.
- A walking sprite's legs stay under its body in every frame, including the widest stride. The sheep's four legs stand at columns 6, 11, 15 and 19 of its 32-column frame because its belly line spans columns 5-23.
- A `chase` must always be able to end: it ends when food disappears, and the food falls out of the list two seconds after collection.
- Pure modules stay dependency-free so they remain testable (no asset imports, no `@/services/api`).
- Storage key `pets`, widget id and species ids are data. Never rename the strings.
- A widget's own `meta` always beats the global default, and a widget without `meta` always follows it. Do not read only one of the two.
- Only the settings panel writes global choices; providers write only hunger.
- Any code that renders a widget node must pass `meta`.

## Design decisions (do not "fix")

- Food rises from below the floor instead of falling from above. Changed once, then reverted on request.
- The crab always faces right, including when travelling left.
- Pets walk all the way to a wall before turning; they do not stop at random points. That is the vscode-pets model.
- A hungry pet stays resting until fed; it does not roam.
- Chicken and crab never lie down (no clip).
- The owl must descend to eat, and lands to sit or lie.
- The whole play area is clickable, not just the strip near the floor.

## Open questions (owner decisions)

- Bring back pointer reactions (dog approaches, cat stalks and pounces, chicken, crab and frog flee, owl watches)? They were built, then removed to follow vscode-pets more closely.
- Bring back wall climbing, if climb sprites are drawn?
- Draw a resting pose for the chicken and crab so they can lie?
- Whole-area click target: confirm it does not interfere with dragging or resizing in edit mode.
- The catalog's pet settings now mean "default pet for widgets that have no choice of their own". Confirm that is the intended meaning, or remove that entry point so pet settings are only reachable from a widget's own gear.
- Switching species replaces the custom name. Should the widget remember one name per species? That needs a `meta` shape decision.
- Old widgets whose `meta` was saved when it was broken keep whatever it holds; nothing migrates them.
- `frog/ghoori_walk_fast_8fps.webp` is no longer used by any component, because wall climbing was removed from the frog and it was the climb clip. The architecture test "assets are each used by a component or a stylesheet" flags it. Delete it, or add it to `spritesKeptForUnplayedAnimations` like the other spare clips. *Needs a decision*.

## Verification status

Confirmed by reading the code and by automated checks (`npm run compile`, `npm test`, `npm run lint`, `npm run build`; the 7 remaining `npm test` failures are pre-existing and unrelated to this folder): tree validity, pure movement maths, types, lint, bundle build.

Not yet checked on screen: that the pet still looks the same and moves as smoothly (especially on a 144 Hz display and after the widget scrolls back into view), the owl clips at 64x64 next to the others, the WebP backgrounds; saving, refreshing and reloading a changed pet or name through both settings entry points, for signed-out and signed-in users, and in the narrow list view; the actual look and pacing of each species, hop and flight feel, owl altitude at each density, the tooltip position with the taller container, click behaviour in edit mode, the Tehran background against every sprite, and the sprites themselves at 32 px. All numeric tuning values are first guesses.

## Change history (why things look the way they do)

1. The five original species walked and bounced at fixed speeds with random rest timers.
2. Owl added: sprites, food, flight physics. Tehran background added.
3. Per-species physics, then a needs, time-of-day and pointer-reaction system, were tried and replaced: the result still read as random, and the wall climb left the cat floating for lack of art.
4. Current design: vscode-pets style sequence trees plus three movement styles (hop, flight, sidestep). Pointer reactions, energy, climbing and stop-and-go stride were removed.
5. The container was widened from a 64 px strip to the full widget height.
6. The chicken briefly used `swipe` (eating) as a pause pose; removed.
7. Owl ear tufts reshaped: they stuck straight up and read as horns, and the head crown was a single pointed pixel. They are now short, tilted outward, with a darker outer and lighter inner feather, on a flattened crown. All four owl clips were re-exported.
8. User report: a changed pet or name showed in settings but the widget stayed, or reset to the dog named Akita after a refresh. Root cause: two settings entry points and two stores. The catalog's entry saved only to the global store while every canvas widget read only its own `meta` (falling back to a hard-coded dog), and the narrow list view dropped `meta` altogether. Also fixed: a debounced name save could restore a stale species, and every widget wrote the whole global object on a change. Fix: one resolution rule (`resolvePetSettings`), the settings panel as the only global writer, providers write only hunger, `meta` passed in the list view.
9. Performance pass. Root causes, measured: the position lived in React state, so every movement tick was a full React commit (30-40 per second, more on high refresh rate displays); the container size was read from the DOM about 190 times per second, even when the pet sat still; and the loop woke on every frame regardless. Now: the position is painted directly on the element, the size is cached from the `ResizeObserver`, the loop drops to a 100 ms poll while the pet rests on the ground and stops when the widget is off screen, species configuration is hoisted so `BasePetContainer` can be `memo`, sprite loading no longer costs a second commit, the owl clips are 64x64 and the three older backgrounds are lossless WebP (about 14% smaller, identical pixels).
10. Sheep added («میشا»): a seventh species from the owner's own pixel art, with a walk/run cycle whose legs bend at a knee step, a grazing pose for eating, and a lying pose. Its tree is the cat's shape (mostly walking, some lying).
11. Sheep fixes after review: the legs were moved under the belly (the owner's original spacing put the last leg outside the body), and the food was redrawn much smaller (it filled the whole 24x24 canvas and was drawn at twice the pet's pixel scale).
12. Hedgehog added («تیغو», picker label «جوجه‌تیغی»): an eighth species, small and slow, that rests curled into a ball. Its tree is the sheep's shape with `lie` weighted higher.
