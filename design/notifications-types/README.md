# Notification types

Every notification kind drawn once, in the extension panel (384px) and in the app list, plus a tab with the data each kind carries.

**Status:** the icons are approved by the owner and live on the CDN. The `avatar` field and the birthday cake beside the avatar are designed on the board and not built.

- `board.html`: the board, drawn by hand (not on the design canvas). Open it in a browser; the cake runs its animation there.
- `assets/`: `gift.webp`, `pro.webp`, `announcement.webp`, `birthday-cake-static.webp` and `birthday-cake.svg`. The same files are on `https://cdn.widgetify.ir/system/notifications/`.

## Rules the art follows

- Puffy: round shapes, a vertical gradient, a soft highlight, a faint shadow underneath.
- Only brand and `vip` colours. The yellow of `warning` is for state and never for decoration.
- The Pro icon is the official gem (the owner's SVG), in the `vip` indigo `#6366f1`.
- Static icons are WebP with a transparent background. The cake is the only animated one (SVG, still under `prefers-reduced-motion`).

## Data per kind

| Kind | Start of the card | Decoration |
|---|---|---|
| `birthday.self`, `birthday.self_gift` | the user's own avatar | the cake |
| `birthday.friend_reminder`, `birthday.congratulation` | the friend's avatar | the cake |
| `friend.request.received`, `friend.request.accepted`, `friend.request.rejected` | the other user's avatar | none |
| `friend.activity.new` | the friend's avatar; a grouped row stacks avatars | none |
| `reward.granted` | the gift icon | none |
| `vip.activated` | the Pro gem | none |
| `admin.message` | the announcement icon, or any URL | none |

## Open

- The `avatar` field (an image URL on each inbox item, filled by the API) and the client code that draws it and picks the decoration from `kind`.
- The emoji left in two birthday titles, and whether the gift and the plain birthday need different titles.
- The notification service seed does not hold the CDN icons yet; they are set only in the local service database.
