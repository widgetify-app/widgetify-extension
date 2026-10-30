# Browser bookmarks

The redesign of the «بوکمارک‌های مرورگر» chip under the search box (`src/features/widgets/search/components/bookmark/`).

**Status:** approved and built. The owner picked the first-run card from direction B1 and the two-pane panel from direction B3.

## Why

The old popover was hard to use:
- It opened on the browser's root folders, so every visit started with a click into the bookmarks bar.
- It had no search, and no path beyond a back button.
- It sorted items by date added instead of the order you keep in the browser.
- It was 288px wide, so long titles were cut off.
- It forgot your folder when it closed.

## Boards

| File | Shows |
|---|---|
| `boards/FirstRun.dc.html` | Before the permission: a faded preview of the list, one title, one line, «اجازه بده» and «فعلا نه» |
| `boards/Panel.dc.html` | The panel: search on top, the folder tree on one side, the open folder's sites as tiles with its path above |
| `boards/PanelSearch.dc.html` | Typing replaces the tiles with results from every folder, each with its folder path and address |
| `boards/PanelEmpty.dc.html` | A folder with nothing in it |

The panel is 620px wide and anchors under the chip.

## Behaviour

- Folders and sites keep the browser's own order.
- The panel opens on the bookmarks bar, then remembers the folder you last opened while the tab stays open.
- A site opens in a new tab.
- Search matches titles and addresses in every folder.

## Not drawn

The dark and glass themes. The boards use the light theme's tokens.
