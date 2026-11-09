# Push notifications in the extension

Chrome and Edge only (Web Push through Firebase); Firefox gets nothing and shows none of this.

**Status:** approved by the owner and built (`src/features/push`), with one change: «بعدا» asks again after two days instead of never.

## Board

| File | Shows |
|---|---|
| `board.html` | P1 the ask island after sign in; P2 the settings card with its switch on; P2b the same card with the switch off after the browser permission was refused |

## Notes

- The island is a prompt, so it does not hide by itself: it stays until «روشن کن» or «بعدا» is pressed. «روشن کن» is the tap that asks for the browser permissions and registers the token. «بعدا» is remembered and the island comes back after two days; the switch in settings is always available.
- It shows for every signed in user on Chrome or Edge who has no push subscription from this browser, including people who already allowed notifications for the Pomodoro: nothing is stored about that, so they are asked once as well.
- The card sits in the general settings tab, built like the lite mode card (`SectionPanel`, hint and `ToggleSwitch`). It is hidden where push is not available (Firefox).
- Both overlap the wallpaper: the island is `bg-glass-surface-2` like the server island, check it in glass and icy over a busy wallpaper.
- The copy is a draft until approved. The island text is the text the owner chose for the app.
- Pomodoro users: a refusal by the browser (not «بعدا») stops the island for good.
