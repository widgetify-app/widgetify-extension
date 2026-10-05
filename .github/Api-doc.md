# API documentation

This file describes how the extension talks to the Widgetify API: the requests it sends and the replies it reads. The code is the source of truth. Every section names the folder in `src/services` that makes the calls, and the exact TypeScript shapes live there.

> [!NOTE]
> If the API you need does not exist yet, use fake data and say so in your pull request. The API will be created.

The backend team keeps a Swagger for the whole API, including the admin routes. Ask a maintainer if you need it. Where the Swagger and the app disagree, this file follows the app. The disagreements are listed at the end.

## How to read this file

- `*` after a field means the field is required.
- **Token** is `yes` when the request needs `Authorization: Bearer <token>`. It follows the Swagger, corrected for routes that plainly act on the signed in user: every `@me` route and `/auth/email/resend-verify`.
- **Reply** is what the app reads. A reply written as `{ data: … }` is wrapped: the body is `{ statusCode, success, message, data }` and the app reads `data`. Every other reply is the payload itself.
- Query fields the app sends are listed even when the Swagger does not know them.
- A request that returns nothing usually answers `{ data: null, message }`, where `message` is a code such as `SUCCESS`, `CREATED` or `UPDATED`. The tables leave that reply empty.

## Basics

**Base URL.** `https://api.widgetify.ir`. The extension reads `VITE_API` to override it in `src/services/api.ts`.

**Headers the client sends** on every request:

| Header | Value |
|---|---|
| `client` | `widgetify-extension` |
| `version` | the extension version from the manifest |
| `Authorization` | `Bearer <token>`, only when the user is signed in |

**Signing in.** `POST /auth/signin`, `POST /auth/oauth/google` and `POST /auth/otp/verify` answer with the access token in `data`. The refresh token arrives in the `refresh_token` response header. The app stores them under the storage keys `auth_token` and `refresh_token`.

**Refreshing.** On a `401` the client calls `POST /auth/refresh` with `{ refresh_token }`, takes the new access token from `data`, and repeats the request once. If that fails it logs the user out. The sign-in routes skip this step.

**Errors.** A failed request answers `{ statusCode, success: false, message }`. `message` is a code such as `NOT_FOUND`, and the app turns it into Persian text with `translateError` in `src/common/utils/translate-error.ts`. A request with invalid fields may also carry `formValidation: [{ property, message }]`.

**Cache and rate limit.**
- Each API has a cache and a rate limit.
- The rate limit count is private.
- Cache for each API is set randomly between 1 to 10 minutes and 1 hour.
- The extension adds its own cache for `GET` requests in the service worker (`background/cache-config.ts`): stale-while-revalidate for `/searchbox`, `/currencies`, `/weather` and `/contents`; network first, with a 3 second wait, for `/date/events`, `/news/rss` and `/extension/notifications`; never `/searchbox/suggest-search`. Only `200` replies are kept, 50 entries for 2 days.

## Sign in

Source: `src/services/auth/auth-service.hook.ts`

| Endpoint | Token | Request | Reply |
|---|---|---|---|
| `POST /auth/signin` | no | `{ email*, password* }` | `{ statusCode, message, data: accessToken, isNewUser? }` and the `refresh_token` header |
| `POST /auth/oauth/google` | no | `{ token*, referralCode? }` | same as `/auth/signin` |
| `POST /auth/otp` | no | `{ email }` or `{ phone }` | `{ data: { ttl } }` or `{ ttl }`: the seconds to wait before asking for another code. A rate limited request fails with the message `OTP_RATE_LIMIT:<seconds>` |
| `POST /auth/otp/verify` | no | `{ email }` or `{ phone }`, and `code*` | same as `/auth/signin` |
| `POST /auth/refresh` | no | `{ refresh_token* }` | `{ data: accessToken }` |
| `GET /auth/status` | no | | `{ data: { content?, type? } }`, where `type` is `warning` or `info`. A notice shown on the sign in screen |
| `POST /auth/email/resend-verify` | yes | | a message |

Sign in reply, with a made up token:

```json
{
  "statusCode": 200,
  "success": true,
  "message": null,
  "data": "<access token>",
  "isNewUser": false
}
```

## Account and settings

Source: `src/services/user`, `src/services/extension`, `src/services/profile`, `src/services/auth`

| Endpoint | Token | Request | Reply |
|---|---|---|---|
| `GET /extension/@me` | yes | | the profile, see below |
| `GET /extension/@me/sync` | yes | | `{ wallpaper, theme, browserTitle, font, ui }` |
| `PATCH /extension/@me` | yes | JSON, any of `timeZone`, `theme`, `font`, `wallpaperId`, `pet`, `petName`. The app only sends `timeZone` today | nothing the app reads |
| `PUT /extension/@me/theme` | yes | `{ theme* }` | |
| `PUT /extension/@me/ui` | yes | `{ ui* }`: `SIMPLE`, `ADVANCED` or `CUSTOM` | |
| `PUT /extension/@me/browser-title` | yes | `{ browserTitleId* }` | |
| `PUT /extension/@me/font` | yes | `{ font* }` | |
| `PUT /extension/@me/search-engine` | yes | `{ search_engine* }`: `zarebin`, `bertina`, `google`, `bing` or `duckduckgo` | |
| `PUT /extension/@me/search-search-autocomplete` | yes | `{ isActive*: boolean }`. The path really is spelled `search-search-autocomplete` | |
| `PATCH /users/@me` | yes | multipart form, any of `name`, `gender` (`MALE`, `FEMALE`, `OTHER`), `birthdate` (a Gregorian date), `occupationId`, `interestIds[]` (one empty value clears them), `avatar` (a file), `avatarKey` (the id of a gallery avatar) | |
| `PUT /users/@me/username` | yes | `{ username* }` | |
| `PUT /users/@me/city` | yes | `{ cityId* }` | |
| `PUT /users/@me/change-phone` | yes | `{ phone* }` | `{ message }` |
| `PUT /users/@me/change-phone/verify` | yes | `{ phone*, code* }` | `{ message }` |
| `PUT /users/@me/change-email` | yes | `{ email* }` | `{ message }` |
| `PUT /users/@me/change-email/verify` | yes | `{ email*, code* }` | `{ message }` |
| `POST /users/@me/complete-wizard` | yes | `{ occupationId*, interestsIds*: string[], referralSource*, referralCode? }`. `referralSource` is `social`, `youtube`, `friends` or `search_other` | |
| `GET /profile-meta` | yes | `type`: `OCCUPATION` or `INTEREST` | `[{ id, type, title, slug, isActive, order, createdAt }]` |
| `GET /extension/emojis` | yes | | `{ emojis: [{ key }], storageUrl }`. An emoji is `storageUrl/key` |
| `GET /extension/@me/ip` | yes | | `{ ip, country, countryIcon, city, isp }` |
| `GET /` | no | | anything. The network widget times it to show the ping |
| `POST /users/@me/upload/search` | yes | multipart form with `image` (a file) | `{ url }` |
| `GET /extension/notifications` | yes | | `{ data: { widgetifyCard: [], dialog } }`, see `src/services/extension/get-notifications.hook.ts` |
| `PUT /notifications/{id}/seen` | yes | | |

**The profile.** `GET /extension/@me` answers a `UserProfile` (`src/services/user/user-service.hook.ts`). The main fields: `name`, `avatar`, `username?`, `email?`, `phone?`, `verified`, `isVip?`, `vipExpiresAt?`, `coins`, `gender`, `birthDate`, `timeZone`, `font`, `theme?`, `wallpaper`, `city?` (`{ id, name }`), `occupation`, `interests`, `connections` (platform ids), `friendshipStats` (`{ accepted, pending }`), `badges`, `isProfileCompleted`, `hasTodayMood`, `searchAutocompleteEnabled` and `isBirthdayToday`.

## Connections, rewards and activity

Source: `src/services/user`, `src/services/date`

| Endpoint | Token | Request | Reply |
|---|---|---|---|
| `POST /google/connect` | yes | | `{ url }`. Open it to let the user connect Google. `google` is the only platform |
| `POST /google/disconnect` | yes | | |
| `GET /google/events` | yes | `start`, `end`: dates, URL encoded | `{ events: [] }`, Google Calendar events. See `GoogleCalendarEvent` in `src/services/date/get-google-calendar-events.hook.ts` |
| `GET /users/@me/rewards` | yes | `page`, `limit` | `{ code, tasks, referrals, totalPages, totalCount }`. A task is `{ task, reward_coin, isDone, icon, button? }` and a referral is `{ name, avatar, username }` |
| `GET /users/@me/rewards/code` | yes | | `{ referralCode }` |

## Friends and activities

Source: `src/services/friends`, `src/services/user`

| Endpoint | Token | Request | Reply |
|---|---|---|---|
| `GET /friends` | yes | `status`: `PENDING` or `ACCEPTED`, `page`, `limit` | `{ data: { friends, totalPages } }`. A friend is `{ id, user, sendByMe, status }` |
| `POST /friends/requests` | yes | `{ username* }` | `{ data: null, message }` |
| `PUT /friends/requests/{id}` | yes | `{ state* }`: `accepted` or `rejected` | `{ data: null, message }` |
| `DELETE /friends/{id}` | yes | | `{ data: null, message }` |
| `GET /friends/activities/beta` | yes | | `{ data: { activities, currentUser, attachments: { reactions, templates } } }` |
| `GET /friends/activities/beta/{id}/reactions` | yes | | `{ data: { reactions, currentUser, isOwnedActivity } }` |
| `PUT /friends/activities/beta/{id}/reactions` | yes | `{ reaction* }`: `CRYING`, `HEART_BLUE`, `LIKE`, `DIS_LIKE`, `LAUGH` or `FIRE` | |
| `PUT /users/@me/activities/beta` | yes | `{ content*, time*: number }` | |
| `DELETE /users/@me/activities/{id}` | yes | | |

## Wallpapers

Source: `src/services/wallpapers`

| Endpoint | Token | Request | Reply |
|---|---|---|---|
| `GET /wallpapers` | no | `page`, `limit`, `categoryId`, `market`, `random`, `type` (`IMAGE` or `VIDEO`). `market=true` lists the wallpapers sold in the market. `random=true` picks a random one; the app reads the first item | `{ wallpapers: [], totalPages }` |
| `GET /wallpapers/categories` | no | | `{ categories: [], totalPages }` |
| `GET /wallpapers/config` | no | | `{ data: { maxUploadSizeFree, maxUploadSizeVip } }`, in megabytes |
| `GET /wallpapers/{id}/preview` | no | | `{ data: { previewUrl } }` |
| `PUT /wallpapers/@me` | yes | `{ wallpaperId }`. `null` removes the wallpaper | `{ data: Wallpaper }` |
| `POST /wallpapers/@me/custom` | yes | multipart form with `file` | `{ data: Wallpaper }` |
| `DELETE /wallpapers/@me/custom` | yes | | |

A wallpaper is `{ id, name, type, src, previewSrc, previewVideoSrc?, isCustom?, source?, gradient?, categoryId?, coin?, isOwned?, extensionUI? }`. `type` is `IMAGE`, `VIDEO` or `GRADIENT`. A category is `{ id, name, slug, createdAt, updatedAt, hasNewContent, wallpapers? }`. The shapes are in `src/common/types/wallpaper.interface.ts`.

```json
{
  "wallpapers": [
    {
      "id": "67c20fb09985263793140b49",
      "name": "حاله های رنگی",
      "type": "IMAGE",
      "src": "https://storage.c2.liara.space/widgetify-ir/wallpapers/243ee1f4-3ce9-4120-9250-1d765572f926.jpeg",
      "previewSrc": "https://storage.c2.liara.space/widgetify-ir/wallpapers/243ee1f4-3ce9-4120-9250-1d765572f926.jpeg",
      "categoryId": "67c20f2e9985263793140b30"
    }
  ],
  "totalPages": 9
}
```

## Weather, cities, date and currency

Source: `src/services/weather`, `src/services/cities`, `src/services/date`, `src/services/timezone`, `src/services/currency`

| Endpoint | Token | Request | Reply |
|---|---|---|---|
| `GET /weather/current` | yes | `addForecast=true`. The app sends no coordinates, and it clears this cache after `PUT /users/@me/city`, so the city comes from the account | `{ city, weather, forecast }`, see below |
| `GET /cities/list` | yes | | `[{ city, cityId }]` |
| `GET /date/events` | no | | `{ shamsiEvents, gregorianEvents, hijriEvents }` |
| `GET /date/timezones` | no | | `[{ label, value, offset }]` |
| `GET /date/owghat` | yes | `day*`, `month*`, `lat`, `lan` (the longitude; the Swagger calls it `long`) | `{ azan_sobh, tolu_aftab, azan_zohr, ghorub_aftab, azan_maghreb, nimeshab, month, day }`. The times are text such as `04:34` |
| `GET /currencies/supported-list` | no | | `[{ key, type, country?, label: { fa, en }, changePercentage }]`. `type` is `coin`, `crypto` or `currency` |
| `GET /currencies/{code}` | no | `code` is the `key` from the list | `{ name: { fa, en }, icon, price, rialPrice, changePercentage, priceHistory, type, url, useDollar, isPartnerShip, partnershipLogo }`. `priceHistory` is `[{ price, createdAt }]` |

```json
{
  "city": { "fa": "تهران", "en": "Tehran" },
  "weather": {
    "statusBanner": null,
    "label": "ابرهای متراکم، خورشید رو می‌پوشونن!",
    "icon": {
      "url": "https://storage.c2.liara.space/widgetify-ir/weather/04n.png",
      "width": 64,
      "height": 64
    },
    "description": { "text": "پوشیده از ابر", "emoji": "☁️" },
    "temperature": {
      "clouds": 93,
      "humidity": 59,
      "pressure": 1014,
      "temp": 18.79,
      "temp_description": "شب رویایی 🌠",
      "temp_max": 18.79,
      "temp_min": 18.79,
      "wind_speed": 0.94,
      "wind_deg": 210,
      "wind_gus": 1.5
    },
    "airPollution": { "aqi": 2, "components": {} }
  },
  "forecast": [
    {
      "temp": 18.57,
      "icon": "https://storage.c2.liara.space/widgetify-ir/weather/04n.svg",
      "date": "2025-03-09 18:00:00",
      "description": null
    }
  ]
}
```

`GET /date/events`. Each event is `{ isHoliday, title, day, month, icon }`; `icon` is a URL or `null`.

```json
{
  "shamsiEvents": [
    { "isHoliday": true, "title": "آغاز نوروز", "day": 1, "month": 1, "icon": null }
  ],
  "gregorianEvents": [
    { "isHoliday": false, "title": "📱 معرفی اولین آیفون", "day": 9, "month": 1, "icon": null }
  ],
  "hijriEvents": [
    { "isHoliday": true, "title": "تعطیل به مناسبت عید سعید فطر", "day": 2, "month": 10, "icon": null }
  ]
}
```

`GET /date/timezones`:

```json
[
  { "label": "آسیا / تهران", "value": "Asia/Tehran", "offset": "+03:30" }
]
```

## News, explorer and search

Source: `src/services/news`, `src/services/content`, `src/services/trends`, `src/services/search`

| Endpoint | Token | Request | Reply |
|---|---|---|---|
| `GET /news/feeds` | no | | `[{ id, name, url, category? }]`. The app uses a built in list when the call fails or the list is empty |
| `GET /news/rss` | no | `url*`, `sourceName*` | `[{ title, description, link, publishedAt, image_url?, source: { name, url } }]` |
| `GET /contents` | no | | `{ contents: [] }`, the explorer page. See `FetchedContent` in `src/services/content/get-content.hook.ts` |
| `GET /searchbox` | no | `region` (default `IR`), `limit` (default `10`) | `{ search_engines, recommendedSites, explorer: { newBadge }, selected_engine }` |
| `GET /searchbox/suggest-search` | yes | `term*` | `{ data: { list: string[] } }`. The app shows the first six |

## Bookmarks

Source: `src/services/bookmark`

| Endpoint | Token | Request | Reply |
|---|---|---|---|
| `GET /bookmarks/@me` | yes | `id`: a folder id. Leave it out for the top level | a list of bookmarks and folders. A folder has `children` |
| `GET /bookmarks/suggestions` | no | | `[{ title, url, icon }]` |
| `POST /bookmarks` | yes | multipart form: `title*`, `type*` (`BOOKMARK` or `FOLDER`), `url`, `sticker`, `parentId`, `order`, `customTextColor`, `customBackground`, `widgetId`, `icon` (a file or a string). Empty values are left out. The app refuses an icon file over 250 KB before it sends it | |
| `PATCH /bookmarks/{id}` | yes | multipart form: `title`, `url`, `sticker`, `customTextColor`, `customBackground`, `icon`, `isDeletedIcon`. The 250 KB icon limit applies here too | |
| `DELETE /bookmarks/{id}` | yes | | |
| `PUT /bookmarks/order` | yes | `{ folderId, bookmarks*: [{ id*, order }] }` | |
| `POST /bookmarks/import` | yes | `{ parentId?, widgetId?, items*: [{ title*, type*, url?, children? }] }`. Folders nest through `children` | `{ data: { message, importedCount, createdFolders } }` |

A bookmark is `{ id, title, type, parentId, url, icon, customBackground, customTextColor, sticker, order, widgetId }`. See `src/services/bookmark/bookmark.interface.ts`.

## Notes, todos and habits

Source: `src/services/note`, `src/services/todo`, `src/services/habit`

| Endpoint | Token | Request | Reply |
|---|---|---|---|
| `GET /notes` | yes | | `{ notes, total, totalPages }`. A note is `{ id, title, body, priority?, createdAt, updatedAt }` |
| `POST /notes` | yes | `{ title?, body?, id?, priority? }`. It is an upsert: pass `id` to update a note. `priority` is `low`, `medium` or `high` | the note |
| `DELETE /notes/{id}` | yes | | |
| `GET /todos/v2/@me` | yes | `page`, `limit`, `isCompleted`, `dateFilter` (`today` or `this_month`), `category` | `{ todos, totalPages, totals }` |
| `GET /todos/@me/tags` | yes | | `string[]`, the tags the user has used. There is no route to delete one: the app clears `category` with `PATCH /todos/{id}` and `category: ''` on each of the user's own tasks that carry it (`src/services/todo/remove-tag.hook.ts`) |
| `POST /todos` | yes | `{ text*, date*, friendIds*: string[], category?, description?, priority?, completed?, order? }` | |
| `PATCH /todos/{id}` | yes | any of `text`, `category`, `date`, `description`, `priority`, `completed`, `order` | `{ data: { todo } }` |
| `DELETE /todos/{id}` | yes | | |
| `GET /widgets/habits` | yes | `archived`, `limit`, `page` | `{ data: { items, page, limit, total, icons, colors } }` |
| `GET /widgets/habits/{id}` | yes | | `{ data: Habit }` |
| `POST /widgets/habits` | yes | `{ title*, comparison*, unit*, target*, frequency*, emoji?, color?, customUnit?, frequencyCount? }` | |
| `PATCH /widgets/habits/{id}` | yes | any field of the create body, and `sort` | |
| `DELETE /widgets/habits/{id}` | yes | Archives the habit. It is not deleted | |
| `PUT /widgets/habits/{id}/progress` | yes | `{ date*, amount* }` | |

A todo is `{ id, text, completed, date, priority, category, description, order, friends, owner, createdAt?, updatedAt? }`. For a habit, `comparison` is `AT_LEAST`, `AT_MOST` or `EXACT`, `unit` is `TIMES`, `MINUTES`, `HOURS`, `PAGES`, `GLASSES` or `CUSTOM`, and `frequency` is `DAILY`, `WEEKLY` or `MONTHLY`. The full shapes are in `src/services/todo/todo.interface.ts` and `src/services/habit/habit.interface.ts`.

## Pomodoro and mood

Source: `src/services/pomodoro`, `src/services/mood-log`

| Endpoint | Token | Request | Reply |
|---|---|---|---|
| `POST /pomodoro/session` | yes | `{ duration*, mode*, startTime*, endTime*, status* }`. `mode` is `WORK`, `SHORT_BREAK` or `LONG_BREAK`, `status` is always `COMPLETED`, the times are ISO dates | |
| `GET /pomodoro/tops` | yes | `type`: `DAILY`, `WEEKLY`, `MONTHLY` or `ALL_TIME` | `{ tops: [{ id, name, avatar, username, duration, rank, friendshipStatus, isSelf? }] }` |
| `PUT /users/@me/moods` | yes | `{ mood*, date* }`. `mood` is `sad`, `normal`, `happy` or `excited`. `date` is `YYYY-MM-DD`, not in the future and at most 7 days back | |
| `GET /users/@me/moods` | yes | `start`, `end`: `YYYY-MM-DD` | `{ moods: [{ mood, date }] }`. The app also accepts a bare list, or the same inside `data` |
| `GET /users/@me/moods/stats` | yes | | `{ logs, userName?, userAvatar?, currentJalaliYear?, currentJalaliMonth?, currentJalaliMonthName?, insightText?, badge? }`, or the same inside `data`. A log can also have the mood `tired` |

## Market, gallery and mini apps

Source: `src/services/market`, `src/services/gallery`, `src/services/mini-apps`

| Endpoint | Token | Request | Reply |
|---|---|---|---|
| `GET /market` | yes | `page`, `limit`, `type` | `{ items, totalPages, total? }` |
| `GET /market/@me/inventory` | yes | `page`, `limit`, `type` | `{ fonts, browser_titles, themes, pets?, pet_backgrounds?, pagination: { totalPages, total } }` |
| `POST /market/purchase` | yes | `{ itemId* }` | `{ success, message, remainingCoins }` |
| `GET /market/packages/coins` | yes | `page`, `limit` | `{ data: { packages, totalPages, currentPage, totalCount } }`. A package is `{ id, price, title, description, coin }` |
| `POST /market/packages/coins/purchase` | yes | `{ packageId* }` | `{ data: { url } }`. The app sends the user to `url` to pay |
| `GET /market/packages/vip` | yes | | `{ data: { packages } }`. A plan is `{ id, title, price, days, isActive, isClaimed?, order?, meta?, createdAt?, updatedAt? }` |
| `POST /market/packages/vip/purchase` | yes | `{ packageId* }` | `{ data: { url?, isFree?, activated?, days? } }`. The app also accepts the same fields without `data`. A `url` sends the user to pay |
| `GET /gallery` | no | `page`, `limit`, `type`, `category`. `type` is `PHOTO_FRAME`, `BOOKMARK_ICON` or `AVATAR` | `{ data: { assets, pagination: { page, limit, total, totalPages } } }` |
| `GET /gallery/categories` | no | `type` | `{ data: { categories: string[] } }` |
| `POST /gallery/{id}/purchase` | yes | | `{ data: { success, asset } }` |
| `GET /mini-apps/beta/list` | yes | `page`, `limit` | `{ data: { miniApps, totalPages, totals } }` |
| `GET /mini-apps/beta/app-id/{appId}` | yes | | `{ data: MiniApp }`, which also has `isLaunchedByUser` |
| `POST /mini-apps/beta/launch` | yes | `{ appId* }` | `{ data: { launchUrl, origin, data, signature } }` |

The market `type` is one of `BROWSER_TITLE`, `FONT`, `THEME`, `PET`, `PET_BACKGROUND` or `wallpapers`. The shapes are in `src/services/market`, `src/services/gallery/get-gallery-assets.hook.ts` and `src/services/mini-apps/mini-apps.interface.ts`.

## Widgets on the canvas

Source: `src/services/widgets`

| Endpoint | Token | Request | Reply |
|---|---|---|---|
| `GET /user-widgets` | yes | `workspace`: `HOME` | `{ widgets, catalog? }` |
| `POST /user-widgets` | yes | `{ widgetKey*, ui?, workspace?, col?, row?, width?, height?, order?, meta?, disabled? }` | the widget |
| `PUT /user-widgets/{instanceId}` | yes | any of `col`, `row`, `width`, `height`, `order`, `meta`, `disabled` | the widget |
| `DELETE /user-widgets/{instanceId}` | yes | | `{ success, message? }` |
| `POST /user-widgets/sync` | yes | `{ workspace?, widgets*: [{ widgetKey*, instanceId?, col?, row?, width?, height?, order?, meta?, disabled? }] }` | `{ widgets }` |
| `POST /user-widgets/{instanceId}/media` | yes | multipart form with `file`. VIP only | `{ url }` |
| `GET /user-widgets/catalog` | no | | `{ config?: { maxFreeWidgets, featuredWidgetKeys }, widgets }` |

A widget is `{ instanceId, widgetKey, ui, workspace, col, row, width, height, order, meta?, disabled, createdAt, updatedAt }`. A catalog item is `{ widgetKey, label, emoji, category, isVipOnly?, isNew?, allowedSizes, defaultSize, variants?, canDuplicate }`. See `src/services/widgets/widget-sync.hook.ts` and `src/services/widgets/widget-catalog.hook.ts`. A `widgetKey` is data: never rename one.

## Where the Swagger and the app differ

The app wins, so this file follows it. The backend team can use this list to correct the Swagger, or to fix the app if the Swagger is the right one.

| Endpoint | The app | The Swagger |
|---|---|---|
| `PATCH /extension/@me` | calls it | has no such route |
| `GET /bookmarks/@me` | `id` is optional | `id` is required |
| `GET /searchbox` | sends `region` and `limit` | declares no query |
| `GET /news/rss` | sends `url` and `sourceName` | declares no query |
| `GET /todos/v2/@me` | also sends `dateFilter` and `category` | declares `page`, `limit`, `isCompleted` only |
| `GET /pomodoro/tops` | sends `type` | declares no query |
| `GET /market/packages/coins` | sends `page` and `limit` | declares no query |
| `GET /date/owghat` | sends `lat` and `lan` | declares `lat` and `long`. If the Swagger is right, the longitude never reaches the server |
| `GET /weather/current` | sends only `addForecast` | requires `useAI` and `addForecast`, and lists `lat`, `lon`, `count` |
| `GET /users/@me/moods/stats` | sends no query | declares `year` and `month` |
| `GET /user-widgets`, `POST /user-widgets/sync` | send `workspace` | also declare `ui` |
| `POST /pomodoro/session` | sends `status` and a fixed list of `mode` values | `mode` is a plain string and there is no `status` |
| `PATCH /users/@me` | also sends `birthdate` and `occupationId`, and `interestIds[]` is optional | lists neither, and `interestIds` is required |
| `POST /auth/otp`, `POST /auth/otp/verify` | send `email` or `phone` | both are required |
| `POST /users/@me/complete-wizard` | `referralCode` is optional | `referralCode` is required |
| `PUT /friends/activities/beta/{id}/reactions` | sends `{ reaction }` | declares no body |
| `PUT /users/@me/moods` | sends `sad`, `normal`, `happy` or `excited` | also lists `tired` |
| Reply shapes | the shapes above | mostly undeclared, and a few examples differ: `POST /bookmarks/import` is shown without `data` |
