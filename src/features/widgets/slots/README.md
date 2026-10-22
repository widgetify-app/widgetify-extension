# slots

Saved layouts. A user keeps up to six layouts and switches between them. Each layout holds its own widgets and its own look: theme, font, tab title and wallpaper. Slots 1 and 2 are free; slots 3 to 6 need Pro. You need an account to use any slot.

## Status: front end only

This branch has no backend for slots. Slot 1 is the server workspace `HOME`, and it syncs its widgets and its look with the account exactly as before. Slots 2 to 6 live in this browser only. While one of them is active, no widget request reaches the server, and theme, font, tab title and wallpaper changes stay local. Do not release this as it stands.

What that costs, until the backend lands:

- Logging out clears slots 2 to 6, because `clearStorage()` wipes all local storage. Another device never sees them.
- In slots 2 to 6 every widget has a local id, so a photo upload (`/user-widgets/{id}/media`) and a partner widget launch fail there. A second bookmarks widget starts with no bookmarks of its own.
- Buying a wallpaper with coins while slot 2 to 6 is active still calls `PUT /wallpapers/@me`, because that call is the purchase, and it also sets the account's wallpaper. Slot 1 picks that wallpaper up at the next sign in.
- A Pro user who uploads or removes a custom wallpaper changes the one custom wallpaper the account has, whichever slot is active. A slot still pointing at the old address can lose its picture.
- A free user's custom photo is a data URL of up to about 2.7 MB, and each slot that uses one keeps a copy in `widgetSlots`. `chrome.storage.local` holds 10 MB, so many such slots can fill it; a switch that cannot save says so with a toast and stays put.
- Only the client checks Pro (`useAuth().isVip`).
- Another tab that is already open follows a switch with its widgets, but keeps its theme, font, title and wallpaper until you open it again.

## Files

- `slots.tsx`: the layouts modal, mounted in `pages/root.tsx` and opened by `callEvent('openWidgetSlotsModal', 'slots' | 'presets')`. It has two tabs: the six slots, and the presets (`PresetLayoutList` from `../presets/presets.tsx`). The footer shows the shortcut.
- `components/slot-card.tsx`: one slot. Its preview draws the slot's widgets over its wallpaper. States: active, filled, empty (two buttons: «بساز» opens the empty layout in edit mode, «با قالب آماده» opens it and moves to the presets tab), locked and empty, locked with a layout kept.
- The state lives in the canvas platform, because the sync and the layout engine need it there:
  - `../hooks/use-slot-switcher.ts` holds the slot list, the switch, rename and clear, and exposes them through `useWidgetSlots()` from `widgets.context.tsx`.
  - `../hooks/use-slot-shortcuts.ts` listens for Ctrl or Cmd, Alt and a digit from 1 to 6 on the home page, and confirms a switch with a toast. The settings shortcuts tab lists it.
  - `../utils/slots/` holds the parts: `slot-access.ts` (which slots are free, which workspace talks to the server), `normalize-slots.ts`, `slot-list.ts` (the list operations and `lookChanges`), `slot-look.ts` (reads the live look and applies one), `slot-shortcut.ts` and `slot-store.ts`, the storage door.
- The edit toolbar has a quick switch (`../components/canvas-slot-menu.tsx`). The navbar layout menu and the canvas right-click menu open the modal.

## Runtime model

- The live keys hold the active slot: `storedWidgets` for the widgets; `theme`, `appearance.fontFamily`, `browserTitle` and `wallpaper` for the look. Nothing that draws them knows about slots.
- `widgetSlots` (an array, because the Firefox storage sanitiser strips numeric keys from objects) holds every slot's name, its last widgets and its look. The active slot's look there is `null` and its widgets are stale; read the active ones from the live keys and `savedLayout`.
- `activeWidgetSlot` belongs to this device. A new device starts on slot 1.
- A switch:
  1. flushes a pending `HOME` sync and waits for one in flight;
  2. reads the live look (`readCurrentLook`; a missing theme reads as light, a missing tab title as the page's own title);
  3. writes the outgoing widgets and look into `widgetSlots`, writes `activeWidgetSlot`;
  4. applies only the parts of the incoming look that differ (`lookChanges`): the `theme_change`, `font_change` and `browser_title_change` events with `sync: true`, which save locally and never call the server, and `applyStoredWallpaper` on the wallpaper context;
  5. loads the incoming widgets through `replaceLayout` with no server sync.
- A slot with no look of its own yet (a new one, or one saved before looks existed) keeps the live look, so a new slot starts with the current slot's look and no widgets. A change you make afterwards lands in the live keys, and the next switch stores it with the slot.
- `setActiveWorkspace` in `widgets.context.tsx` sets `setLookSyncedWithAccount(isServerWorkspace(...))`. The theme, appearance and wallpaper contexts, the market's tab title apply and `useSyncAccount` check it before they talk to the account.
- `triggerServerSync` reads the workspace from a ref when it schedules, and refuses any workspace that `isServerWorkspace` rejects. Every widget API call in `use-widget-operations.ts` checks `serverSyncEnabled`.
- `fetchAndReconcileWithServer` waits until the active slot is known. It runs only on `HOME` and drops its result if a switch happened meanwhile.
- Once the profile has loaded and says the user is not Pro, an active slot 3 to 6 sends the user back to slot 1 with a toast. The slot keeps its widgets and look and returns with Pro.

## What the backend needs

1. Accept `SLOT_2` to `SLOT_6` as `workspace` on `GET /user-widgets`, `POST /user-widgets` and `POST /user-widgets/sync`. `HOME` stays slot 1, so no user needs a migration. These strings are data.
2. Make `sync` replace only the rows of its own workspace. Ask first: does `sync` today delete rows that are missing from the payload, and does it look at the workspace when it does?
3. `GET /user-widgets/slots` returns `{ slots: [{ workspace, name, updatedAt, widgets, look }] }`, every slot in one call, for the previews and an instant switch.
4. A look per workspace: `{ theme, font, browserTitleId, wallpaperId }`, read in that list and written with `PUT /user-widgets/slots/{workspace}/look`. `HOME` keeps using `/extension/@me/sync` and the `PUT /extension/@me/...` routes.
5. Separate buying a wallpaper from setting it, or let the purchase take a workspace, so a purchase in slot 3 does not change slot 1.
6. `PUT /user-widgets/slots/{workspace}` with `{ name }`, trimmed, at most 24 characters, `null` for the default name.
7. `DELETE /user-widgets/slots/{workspace}`. A bookmark whose `widgetId` points at a deleted row should get `widgetId: null` and go back to the main list, not be deleted.
8. Answer a write to `SLOT_3` to `SLOT_6` from a user without Pro with `403 VIP_REQUIRED`. Reads stay open, so a lapsed subscription loses nothing.
9. Count `maxFreeWidgets` per workspace.
10. Serve `/user-widgets/{instanceId}/media` and `/launch` for rows in any workspace.

When it lands: make `isServerWorkspace` return true for every slot, back `slot-store.ts` and the look with `src/services/widgets` and a `slots` query key, keep `widgetSlots` as the offline cache, upload the local slots once, and add the endpoints to both API docs.

## Not built

- Copying a filled slot's widgets into another slot. A new slot always starts empty.
- The last-changed time on a card. `updatedAt` is stored but not shown.
