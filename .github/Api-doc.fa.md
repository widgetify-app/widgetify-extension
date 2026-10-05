# مستندات API

این فایل توضیح می‌دهد افزونه چطور با API ویجتیفای حرف می‌زند: چه درخواست‌هایی می‌فرستد و چه پاسخ‌هایی می‌خواند. مرجع اصلی خود کد است. هر بخش پوشه‌ی `src/services` را که آن درخواست‌ها را می‌فرستد نام می‌برد و شکل دقیق تایپ‌ها همان‌جاست.

> [!NOTE]
> اگر API مورد نیازتان هنوز وجود ندارد، از دیتای فیک استفاده کنید و موقع باز کردن PULL REQUEST این موضوع را بنویسید. API مورد نیاز ساخته می‌شود.

تیم بک‌اند یک Swagger برای کل API دارد، با مسیرهای ادمین. اگر لازمش دارید از یکی از نگه‌دارنده‌ها بخواهید. هرجا Swagger و افزونه با هم فرق دارند، این فایل از افزونه پیروی می‌کند. تفاوت‌ها آخر فایل آمده‌اند.

## نحوه‌ی خواندن این فایل

- `*` کنار یک فیلد یعنی آن فیلد اجباری است.
- ستون **توکن** وقتی `بله` است که درخواست به `Authorization: Bearer <token>` نیاز دارد. این ستون از Swagger می‌آید، با اصلاح مسیرهایی که واضح است روی کاربر واردشده کار می‌کنند: هر مسیر `@me` و `/auth/email/resend-verify`.
- **پاسخ** چیزی است که افزونه می‌خواند. پاسخی که به شکل `{ data: … }` نوشته شده بسته‌بندی‌شده است: بدنه `{ statusCode, success, message, data }` است و افزونه `data` را می‌خواند. بقیه‌ی پاسخ‌ها خودِ دیتا هستند.
- فیلدهای queryای که افزونه می‌فرستد نوشته شده‌اند، حتی اگر Swagger آن‌ها را نشناسد.
- درخواستی که چیزی برنمی‌گرداند معمولاً `{ data: null, message }` جواب می‌دهد و `message` کدی مثل `SUCCESS`، `CREATED` یا `UPDATED` است. جدول‌ها این پاسخ را خالی می‌گذارند.

## مبانی

**آدرس پایه.** `https://api.widgetify.ir`. افزونه برای عوض کردنش `VITE_API` را در `src/services/api.ts` می‌خواند.

**هدرهایی که کلاینت روی هر درخواست می‌فرستد:**

| هدر | مقدار |
|---|---|
| `client` | `widgetify-extension` |
| `version` | نسخه‌ی افزونه از manifest |
| `Authorization` | `Bearer <token>`، فقط وقتی کاربر وارد شده باشد |

**ورود.** `POST /auth/signin`، `POST /auth/oauth/google` و `POST /auth/otp/verify` توکن دسترسی را داخل `data` برمی‌گردانند. توکن refresh توی هدر پاسخ به اسم `refresh_token` می‌آید. افزونه این دو را با کلیدهای storage به اسم `auth_token` و `refresh_token` نگه می‌دارد.

**تمدید توکن.** روی خطای `401` کلاینت `POST /auth/refresh` را با `{ refresh_token }` صدا می‌زند، توکن جدید را از `data` برمی‌دارد و درخواست را یک بار تکرار می‌کند. اگر نشد، کاربر را خارج می‌کند. مسیرهای ورود این مرحله را رد می‌کنند.

**خطاها.** درخواست ناموفق `{ statusCode, success: false, message }` جواب می‌دهد. `message` کدی مثل `NOT_FOUND` است و افزونه با `translateError` در `src/common/utils/translate-error.ts` آن را به متن فارسی تبدیل می‌کند. درخواستی که فیلد نامعتبر دارد ممکن است `formValidation: [{ property, message }]` هم داشته باشد.

**Cache و Rate Limit.**
- هرکدوم از API ها دارای Cache و Rate Limit هستند.
- تعداد Rate Limit درحال حاضر private هست.
- Cache هر API به صورت رندوم بین 1 تا 10 دقیقه و 1 ساعت هست.
- افزونه برای درخواست‌های `GET` توی service worker هم cache خودش را دارد (`background/cache-config.ts`): stale-while-revalidate برای `/searchbox`، `/currencies`، `/weather` و `/contents`؛ اول شبکه، با ۳ ثانیه صبر، برای `/date/events`، `/news/rss` و `/extension/notifications`؛ و `/searchbox/suggest-search` هیچ‌وقت. فقط پاسخ‌های `200` نگه داشته می‌شوند، تا ۵۰ مورد برای ۲ روز.

## ورود

منبع: `src/services/auth/auth-service.hook.ts`

| مسیر | توکن | درخواست | پاسخ |
|---|---|---|---|
| `POST /auth/signin` | خیر | `{ email*, password* }` | `{ statusCode, message, data: accessToken, isNewUser? }` و هدر `refresh_token` |
| `POST /auth/oauth/google` | خیر | `{ token*, referralCode? }` | مثل `/auth/signin` |
| `POST /auth/otp` | خیر | `{ email }` یا `{ phone }` | `{ data: { ttl } }` یا `{ ttl }`: ثانیه‌هایی که باید صبر کرد تا کد تازه خواست. درخواستی که rate limit شده با پیام `OTP_RATE_LIMIT:<seconds>` رد می‌شود |
| `POST /auth/otp/verify` | خیر | `{ email }` یا `{ phone }`، و `code*` | مثل `/auth/signin` |
| `POST /auth/refresh` | خیر | `{ refresh_token* }` | `{ data: accessToken }` |
| `GET /auth/status` | خیر | | `{ data: { content?, type? } }` که `type` یا `warning` است یا `info`. اعلانی که توی صفحه‌ی ورود نشان داده می‌شود |
| `POST /auth/email/resend-verify` | بله | | یک پیام |

پاسخ ورود، با یک توکن ساختگی:

```json
{
  "statusCode": 200,
  "success": true,
  "message": null,
  "data": "<access token>",
  "isNewUser": false
}
```

## حساب و تنظیمات

منبع: `src/services/user`، `src/services/extension`، `src/services/profile`، `src/services/auth`

| مسیر | توکن | درخواست | پاسخ |
|---|---|---|---|
| `GET /extension/@me` | بله | | پروفایل، پایین‌تر ببینید |
| `GET /extension/@me/sync` | بله | | `{ wallpaper, theme, browserTitle, font, ui }` |
| `PATCH /extension/@me` | بله | JSON، هرکدام از `timeZone`، `theme`، `font`، `wallpaperId`، `pet`، `petName`. افزونه امروز فقط `timeZone` را می‌فرستد | چیزی که افزونه بخواند ندارد |
| `PUT /extension/@me/theme` | بله | `{ theme* }` | |
| `PUT /extension/@me/ui` | بله | `{ ui* }`: `SIMPLE`، `ADVANCED` یا `CUSTOM` | |
| `PUT /extension/@me/browser-title` | بله | `{ browserTitleId* }` | |
| `PUT /extension/@me/font` | بله | `{ font* }` | |
| `PUT /extension/@me/search-engine` | بله | `{ search_engine* }`: `zarebin`، `bertina`، `google`، `bing` یا `duckduckgo` | |
| `PUT /extension/@me/search-search-autocomplete` | بله | `{ isActive*: boolean }`. اسم مسیر واقعاً `search-search-autocomplete` است | |
| `PATCH /users/@me` | بله | فرم multipart، هرکدام از `name`، `gender` (`MALE`، `FEMALE`، `OTHER`)، `birthdate` (تاریخ میلادی)، `occupationId`، `interestIds[]` (یک مقدار خالی همه را پاک می‌کند)، `avatar` (فایل)، `avatarKey` (شناسه‌ی یک آواتار گالری) | |
| `PUT /users/@me/username` | بله | `{ username* }` | |
| `PUT /users/@me/city` | بله | `{ cityId* }` | |
| `PUT /users/@me/change-phone` | بله | `{ phone* }` | `{ message }` |
| `PUT /users/@me/change-phone/verify` | بله | `{ phone*, code* }` | `{ message }` |
| `PUT /users/@me/change-email` | بله | `{ email* }` | `{ message }` |
| `PUT /users/@me/change-email/verify` | بله | `{ email*, code* }` | `{ message }` |
| `POST /users/@me/complete-wizard` | بله | `{ occupationId*, interestsIds*: string[], referralSource*, referralCode? }`. `referralSource` یکی از `social`، `youtube`، `friends` یا `search_other` است | |
| `GET /profile-meta` | بله | `type`: `OCCUPATION` یا `INTEREST` | `[{ id, type, title, slug, isActive, order, createdAt }]` |
| `GET /extension/emojis` | بله | | `{ emojis: [{ key }], storageUrl }`. آدرس هر ایموجی `storageUrl/key` است |
| `GET /extension/@me/ip` | بله | | `{ ip, country, countryIcon, city, isp }` |
| `GET /` | خیر | | هرچیزی. ویجت شبکه زمانش را می‌سنجد تا پینگ را نشان بدهد |
| `POST /users/@me/upload/search` | بله | فرم multipart با `image` (فایل) | `{ url }` |
| `GET /extension/notifications` | بله | | `{ data: { widgetifyCard: [], dialog } }`، ببینید `src/services/extension/get-notifications.hook.ts` |
| `PUT /notifications/{id}/seen` | بله | | |

**پروفایل.** `GET /extension/@me` یک `UserProfile` برمی‌گرداند (`src/services/user/user-service.hook.ts`). فیلدهای اصلی: `name`، `avatar`، `username?`، `email?`، `phone?`، `verified`، `isVip?`، `vipExpiresAt?`، `coins`، `gender`، `birthDate`، `timeZone`، `font`، `theme?`، `wallpaper`، `city?` (`{ id, name }`)، `occupation`، `interests`، `connections` (شناسه‌ی پلتفرم‌ها)، `friendshipStats` (`{ accepted, pending }`)، `badges`، `isProfileCompleted`، `hasTodayMood`، `searchAutocompleteEnabled` و `isBirthdayToday`.

## اتصال‌ها، جایزه‌ها و فعالیت

منبع: `src/services/user`، `src/services/date`

| مسیر | توکن | درخواست | پاسخ |
|---|---|---|---|
| `POST /google/connect` | بله | | `{ url }`. بازش کنید تا کاربر گوگل را وصل کند. `google` تنها پلتفرم است |
| `POST /google/disconnect` | بله | | |
| `GET /google/events` | بله | `start`، `end`: تاریخ، با URL encode | `{ events: [] }`، رویدادهای Google Calendar. `GoogleCalendarEvent` را در `src/services/date/get-google-calendar-events.hook.ts` ببینید |
| `GET /users/@me/rewards` | بله | `page`، `limit` | `{ code, tasks, referrals, totalPages, totalCount }`. هر task این است: `{ task, reward_coin, isDone, icon, button? }` و هر referral این: `{ name, avatar, username }` |
| `GET /users/@me/rewards/code` | بله | | `{ referralCode }` |

## دوستان و فعالیت‌ها

منبع: `src/services/friends`، `src/services/user`

| مسیر | توکن | درخواست | پاسخ |
|---|---|---|---|
| `GET /friends` | بله | `status`: `PENDING` یا `ACCEPTED`، `page`، `limit` | `{ data: { friends, totalPages } }`. هر دوست `{ id, user, sendByMe, status }` است |
| `POST /friends/requests` | بله | `{ username* }` | `{ data: null, message }` |
| `PUT /friends/requests/{id}` | بله | `{ state* }`: `accepted` یا `rejected` | `{ data: null, message }` |
| `DELETE /friends/{id}` | بله | | `{ data: null, message }` |
| `GET /friends/activities/beta` | بله | | `{ data: { activities, currentUser, attachments: { reactions, templates } } }` |
| `GET /friends/activities/beta/{id}/reactions` | بله | | `{ data: { reactions, currentUser, isOwnedActivity } }` |
| `PUT /friends/activities/beta/{id}/reactions` | بله | `{ reaction* }`: `CRYING`، `HEART_BLUE`، `LIKE`، `DIS_LIKE`، `LAUGH` یا `FIRE` | |
| `PUT /users/@me/activities/beta` | بله | `{ content*, time*: number }` | |
| `DELETE /users/@me/activities/{id}` | بله | | |

## والپیپرها

منبع: `src/services/wallpapers`

| مسیر | توکن | درخواست | پاسخ |
|---|---|---|---|
| `GET /wallpapers` | خیر | `page`، `limit`، `categoryId`، `market`، `random`، `type` (`IMAGE` یا `VIDEO`). `market=true` والپیپرهای فروشگاه را می‌آورد. `random=true` یکی تصادفی برمی‌دارد؛ افزونه اولین مورد را می‌خواند | `{ wallpapers: [], totalPages }` |
| `GET /wallpapers/categories` | خیر | | `{ categories: [], totalPages }` |
| `GET /wallpapers/config` | خیر | | `{ data: { maxUploadSizeFree, maxUploadSizeVip } }`، به مگابایت |
| `GET /wallpapers/{id}/preview` | خیر | | `{ data: { previewUrl } }` |
| `PUT /wallpapers/@me` | بله | `{ wallpaperId }`. مقدار `null` والپیپر را برمی‌دارد | `{ data: Wallpaper }` |
| `POST /wallpapers/@me/custom` | بله | فرم multipart با `file` | `{ data: Wallpaper }` |
| `DELETE /wallpapers/@me/custom` | بله | | |

هر والپیپر این است: `{ id, name, type, src, previewSrc, previewVideoSrc?, isCustom?, source?, gradient?, categoryId?, coin?, isOwned?, extensionUI? }`. `type` یکی از `IMAGE`، `VIDEO` یا `GRADIENT` است. هر دسته‌بندی این است: `{ id, name, slug, createdAt, updatedAt, hasNewContent, wallpapers? }`. شکل‌ها در `src/common/types/wallpaper.interface.ts` هستند.

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

## آب‌وهوا، شهرها، تاریخ و ارز

منبع: `src/services/weather`، `src/services/cities`، `src/services/date`، `src/services/timezone`، `src/services/currency`

| مسیر | توکن | درخواست | پاسخ |
|---|---|---|---|
| `GET /weather/current` | بله | `addForecast=true`. افزونه مختصات نمی‌فرستد و بعد از `PUT /users/@me/city` این cache را پاک می‌کند، پس شهر از حساب کاربر می‌آید | `{ city, weather, forecast }`، پایین‌تر ببینید |
| `GET /cities/list` | بله | | `[{ city, cityId }]` |
| `GET /date/events` | خیر | | `{ shamsiEvents, gregorianEvents, hijriEvents }` |
| `GET /date/timezones` | خیر | | `[{ label, value, offset }]` |
| `GET /date/owghat` | بله | `day*`، `month*`، `lat`، `lan` (طول جغرافیایی؛ Swagger اسمش را `long` گذاشته) | `{ azan_sobh, tolu_aftab, azan_zohr, ghorub_aftab, azan_maghreb, nimeshab, month, day }`. زمان‌ها متن هستند، مثل `04:34` |
| `GET /currencies/supported-list` | خیر | | `[{ key, type, country?, label: { fa, en }, changePercentage }]`. `type` یکی از `coin`، `crypto` یا `currency` است |
| `GET /currencies/{code}` | خیر | `code` همان `key` توی لیست است | `{ name: { fa, en }, icon, price, rialPrice, changePercentage, priceHistory, type, url, useDollar, isPartnerShip, partnershipLogo }`. `priceHistory` این است: `[{ price, createdAt }]` |

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

`GET /date/events`. هر رویداد `{ isHoliday, title, day, month, icon }` است و `icon` یا آدرس است یا `null`.

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

## اخبار، اکسپلورر و جستجو

منبع: `src/services/news`، `src/services/content`، `src/services/trends`، `src/services/search`

| مسیر | توکن | درخواست | پاسخ |
|---|---|---|---|
| `GET /news/feeds` | خیر | | `[{ id, name, url, category? }]`. اگر درخواست خطا بدهد یا لیست خالی باشد افزونه از یک لیست داخلی استفاده می‌کند |
| `GET /news/rss` | خیر | `url*`، `sourceName*` | `[{ title, description, link, publishedAt, image_url?, source: { name, url } }]` |
| `GET /contents` | خیر | | `{ contents: [] }`، صفحه‌ی اکسپلورر. `FetchedContent` را در `src/services/content/get-content.hook.ts` ببینید |
| `GET /searchbox` | خیر | `region` (پیش‌فرض `IR`)، `limit` (پیش‌فرض `10`) | `{ search_engines, recommendedSites, explorer: { newBadge }, selected_engine }` |
| `GET /searchbox/suggest-search` | بله | `term*` | `{ data: { list: string[] } }`. افزونه شش مورد اول را نشان می‌دهد |

## بوکمارک‌ها

منبع: `src/services/bookmark`

| مسیر | توکن | درخواست | پاسخ |
|---|---|---|---|
| `GET /bookmarks/@me` | بله | `id`: شناسه‌ی یک پوشه. برای سطح اول نفرستید | لیستی از بوکمارک‌ها و پوشه‌ها. پوشه `children` دارد |
| `GET /bookmarks/suggestions` | خیر | | `[{ title, url, icon }]` |
| `POST /bookmarks` | بله | فرم multipart: `title*`، `type*` (`BOOKMARK` یا `FOLDER`)، `url`، `sticker`، `parentId`، `order`، `customTextColor`، `customBackground`، `widgetId`، `icon` (فایل یا متن). مقدارهای خالی فرستاده نمی‌شوند. افزونه فایل آیکونِ بزرگ‌تر از ۲۵۰ کیلوبایت را قبل از ارسال رد می‌کند | |
| `PATCH /bookmarks/{id}` | بله | فرم multipart: `title`، `url`، `sticker`، `customTextColor`، `customBackground`، `icon`، `isDeletedIcon`. محدودیت ۲۵۰ کیلوبایت آیکون اینجا هم هست | |
| `DELETE /bookmarks/{id}` | بله | | |
| `PUT /bookmarks/order` | بله | `{ folderId, bookmarks*: [{ id*, order }] }` | |
| `POST /bookmarks/import` | بله | `{ parentId?, widgetId?, items*: [{ title*, type*, url?, children? }] }`. پوشه‌ها با `children` تو در تو می‌شوند | `{ data: { message, importedCount, createdFolders } }` |

هر بوکمارک این است: `{ id, title, type, parentId, url, icon, customBackground, customTextColor, sticker, order, widgetId }`. `src/services/bookmark/bookmark.interface.ts` را ببینید.

## یادداشت‌ها، کارها و عادت‌ها

منبع: `src/services/note`، `src/services/todo`، `src/services/habit`

| مسیر | توکن | درخواست | پاسخ |
|---|---|---|---|
| `GET /notes` | بله | | `{ notes, total, totalPages }`. هر یادداشت `{ id, title, body, priority?, createdAt, updatedAt }` است. `body` ممکنه `null` برگرده و `title` و `priority` هم ممکنه؛ برنامه هر یادداشت رو از `normalizeNotes` (`src/features/widgets/notes/utils/normalize-notes.ts`) رد می‌کنه |
| `POST /notes` | بله | `{ title?, body?, id?, priority? }`. هم می‌سازد هم به‌روز می‌کند: برای ویرایش `id` بدهید. `priority` یکی از `low`، `medium` یا `high` است | یادداشت |
| `DELETE /notes/{id}` | بله | | |
| `GET /todos/v2/@me` | بله | `page`، `limit`، `isCompleted`، `dateFilter` (`today` یا `this_month`)، `category` | `{ todos, totalPages, totals }` |
| `GET /todos/@me/tags` | بله | | `string[]`، تگ‌هایی که کاربر استفاده کرده. مسیری برای حذف تگ نیست: اپ روی هر تسکِ خود کاربر که این تگ را دارد `PATCH /todos/{id}` با `category: ''` می‌فرستد (`src/services/todo/remove-tag.hook.ts`) |
| `POST /todos` | بله | `{ text*, date*, friendIds*: string[], category?, description?, priority?, completed?, order? }` | |
| `PATCH /todos/{id}` | بله | هرکدام از `text`، `category`، `date`، `description`، `priority`، `completed`، `order` | `{ data: { todo } }` |
| `DELETE /todos/{id}` | بله | | |
| `GET /widgets/habits` | بله | `archived`، `limit`، `page` | `{ data: { items, page, limit, total, icons, colors } }` |
| `GET /widgets/habits/{id}` | بله | | `{ data: Habit }` |
| `POST /widgets/habits` | بله | `{ title*, comparison*, unit*, target*, frequency*, emoji?, color?, customUnit?, frequencyCount? }` | |
| `PATCH /widgets/habits/{id}` | بله | هر فیلدِ بدنه‌ی ساخت، و `sort` | |
| `DELETE /widgets/habits/{id}` | بله | عادت را بایگانی می‌کند، پاک نمی‌شود | |
| `PUT /widgets/habits/{id}/progress` | بله | `{ date*, amount* }` | |

هر todo این است: `{ id, text, completed, date, priority, category, description, order, friends, owner, createdAt?, updatedAt? }`. برای عادت‌ها، `comparison` یکی از `AT_LEAST`، `AT_MOST` یا `EXACT` است، `unit` یکی از `TIMES`، `MINUTES`، `HOURS`، `PAGES`، `GLASSES` یا `CUSTOM`، و `frequency` یکی از `DAILY`، `WEEKLY` یا `MONTHLY`. شکل کامل در `src/services/todo/todo.interface.ts` و `src/services/habit/habit.interface.ts` است.

## پومودورو و حال‌وهوا

منبع: `src/services/pomodoro`، `src/services/mood-log`

| مسیر | توکن | درخواست | پاسخ |
|---|---|---|---|
| `POST /pomodoro/session` | بله | `{ duration*, mode*, startTime*, endTime*, status* }`. `mode` یکی از `WORK`، `SHORT_BREAK` یا `LONG_BREAK` است، `status` همیشه `COMPLETED` است و زمان‌ها تاریخ ISO هستند | |
| `GET /pomodoro/tops` | بله | `type`: `DAILY`، `WEEKLY`، `MONTHLY` یا `ALL_TIME` | `{ tops: [{ id, name, avatar, username, duration, rank, friendshipStatus, isSelf? }] }` |
| `PUT /users/@me/moods` | بله | `{ mood*, date* }`. `mood` یکی از `sad`، `normal`، `happy` یا `excited` است. `date` به شکل `YYYY-MM-DD` است، نه در آینده و حداکثر ۷ روز قبل | |
| `GET /users/@me/moods` | بله | `start`، `end`: به شکل `YYYY-MM-DD` | `{ moods: [{ mood, date }] }`. افزونه خودِ لیست (بدون `moods`) یا همین را داخل `data` هم می‌پذیرد |
| `GET /users/@me/moods/stats` | بله | | `{ logs, userName?, userAvatar?, currentJalaliYear?, currentJalaliMonth?, currentJalaliMonthName?, insightText?, badge? }`، یا همین داخل `data`. هر log می‌تواند حال `tired` هم داشته باشد |

## فروشگاه، گالری و مینی‌اپ‌ها

منبع: `src/services/market`، `src/services/gallery`، `src/services/mini-apps`

| مسیر | توکن | درخواست | پاسخ |
|---|---|---|---|
| `GET /market` | بله | `page`، `limit`، `type` | `{ items, totalPages, total? }` |
| `GET /market/@me/inventory` | بله | `page`، `limit`، `type` | `{ fonts, browser_titles, themes, pets?, pet_backgrounds?, pagination: { totalPages, total } }` |
| `POST /market/purchase` | بله | `{ itemId* }` | `{ success, message, remainingCoins }` |
| `GET /market/packages/coins` | بله | `page`، `limit` | `{ data: { packages, totalPages, currentPage, totalCount } }`. هر پکیج `{ id, price, title, description, coin }` است |
| `POST /market/packages/coins/purchase` | بله | `{ packageId* }` | `{ data: { url } }`. افزونه کاربر را برای پرداخت به `url` می‌برد |
| `GET /market/packages/vip` | بله | | `{ data: { packages } }`. هر پلن `{ id, title, price, days, isActive, isClaimed?, order?, meta?, createdAt?, updatedAt? }` است |
| `POST /market/packages/vip/purchase` | بله | `{ packageId* }` | `{ data: { url?, isFree?, activated?, days? } }`. افزونه همین فیلدها را بدون `data` هم می‌پذیرد. اگر `url` باشد کاربر را برای پرداخت به آن می‌برد |
| `GET /gallery` | خیر | `page`، `limit`، `type`، `category`. `type` یکی از `PHOTO_FRAME`، `BOOKMARK_ICON` یا `AVATAR` است | `{ data: { assets, pagination: { page, limit, total, totalPages } } }` |
| `GET /gallery/categories` | خیر | `type` | `{ data: { categories: string[] } }` |
| `POST /gallery/{id}/purchase` | بله | | `{ data: { success, asset } }` |
| `GET /mini-apps/beta/list` | بله | `page`، `limit` | `{ data: { miniApps, totalPages, totals } }` |
| `GET /mini-apps/beta/app-id/{appId}` | بله | | `{ data: MiniApp }` که `isLaunchedByUser` هم دارد |
| `POST /mini-apps/beta/launch` | بله | `{ appId* }` | `{ data: { launchUrl, origin, data, signature } }` |

`type` فروشگاه یکی از `BROWSER_TITLE`، `FONT`، `THEME`، `PET`، `PET_BACKGROUND` یا `wallpapers` است. شکل‌ها در `src/services/market`، `src/services/gallery/get-gallery-assets.hook.ts` و `src/services/mini-apps/mini-apps.interface.ts` هستند.

## ویجت‌های روی بوم

منبع: `src/services/widgets`

| مسیر | توکن | درخواست | پاسخ |
|---|---|---|---|
| `GET /user-widgets` | بله | `workspace`: `HOME` | `{ widgets, catalog? }` |
| `POST /user-widgets` | بله | `{ widgetKey*, ui?, workspace?, col?, row?, width?, height?, order?, meta?, disabled? }` | ویجت |
| `PUT /user-widgets/{instanceId}` | بله | هرکدام از `col`، `row`، `width`، `height`، `order`، `meta`، `disabled` | ویجت |
| `DELETE /user-widgets/{instanceId}` | بله | | `{ success, message? }` |
| `POST /user-widgets/sync` | بله | `{ workspace?, widgets*: [{ widgetKey*, instanceId?, col?, row?, width?, height?, order?, meta?, disabled? }] }` | `{ widgets }` |
| `POST /user-widgets/{instanceId}/media` | بله | فرم multipart با `file`. فقط VIP | `{ url }` |
| `GET /user-widgets/catalog` | خیر | | `{ config?: { maxFreeWidgets, featuredWidgetKeys }, widgets }` |

هر ویجت این است: `{ instanceId, widgetKey, ui, workspace, col, row, width, height, order, meta?, disabled, createdAt, updatedAt }`. هر آیتم کاتالوگ این است: `{ widgetKey, label, emoji, category, isVipOnly?, isNew?, allowedSizes, defaultSize, variants?, canDuplicate }`. `src/services/widgets/widget-sync.hook.ts` و `src/services/widgets/widget-catalog.hook.ts` را ببینید. `widgetKey` یک داده است: اسمش را هیچ‌وقت عوض نکنید.

## تفاوت Swagger و افزونه

افزونه برنده است، پس این فایل از آن پیروی می‌کند. تیم بک‌اند می‌تواند از این لیست برای اصلاح Swagger استفاده کند، یا اگر Swagger درست است افزونه را درست کند.

| مسیر | افزونه | Swagger |
|---|---|---|
| `PATCH /extension/@me` | صدایش می‌زند | چنین مسیری ندارد |
| `GET /bookmarks/@me` | `id` اختیاری است | `id` اجباری است |
| `GET /searchbox` | `region` و `limit` را می‌فرستد | هیچ query ای اعلام نکرده |
| `GET /news/rss` | `url` و `sourceName` را می‌فرستد | هیچ query ای اعلام نکرده |
| `GET /todos/v2/@me` | `dateFilter` و `category` را هم می‌فرستد | فقط `page`، `limit` و `isCompleted` را اعلام کرده |
| `GET /pomodoro/tops` | `type` را می‌فرستد | هیچ query ای اعلام نکرده |
| `GET /market/packages/coins` | `page` و `limit` را می‌فرستد | هیچ query ای اعلام نکرده |
| `GET /date/owghat` | `lat` و `lan` را می‌فرستد | `lat` و `long` را اعلام کرده. اگر Swagger درست باشد طول جغرافیایی هیچ‌وقت به سرور نمی‌رسد |
| `GET /weather/current` | فقط `addForecast` را می‌فرستد | `useAI` و `addForecast` را اجباری کرده و `lat`، `lon` و `count` را هم دارد |
| `GET /users/@me/moods/stats` | query نمی‌فرستد | `year` و `month` را اعلام کرده |
| `GET /user-widgets`، `POST /user-widgets/sync` | `workspace` را می‌فرستند | `ui` را هم اعلام کرده |
| `POST /pomodoro/session` | `status` و فهرست ثابتی از `mode` را می‌فرستد | `mode` یک متن ساده است و `status` ندارد |
| `PATCH /users/@me` | `birthdate` و `occupationId` را هم می‌فرستد و `interestIds[]` اختیاری است | هیچ‌کدام را ندارد و `interestIds` اجباری است |
| `POST /auth/otp`، `POST /auth/otp/verify` | `email` یا `phone` را می‌فرستند | هر دو اجباری‌اند |
| `POST /users/@me/complete-wizard` | `referralCode` اختیاری است | `referralCode` اجباری است |
| `PUT /friends/activities/beta/{id}/reactions` | `{ reaction }` می‌فرستد | بدنه‌ای اعلام نکرده |
| `PUT /users/@me/moods` | `sad`، `normal`، `happy` یا `excited` می‌فرستد | `tired` را هم دارد |
| شکل پاسخ‌ها | همان شکل‌های بالا | بیشترشان اعلام نشده و چند مثال فرق دارند: `POST /bookmarks/import` بدون `data` نشان داده شده |
