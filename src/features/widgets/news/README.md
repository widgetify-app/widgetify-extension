# News widget

Headlines from the default feed and the feeds the user turned on, at 2x3. The same list is the news tab of the combo widget.

## Files

| Path | Holds |
|---|---|
| `news.widget.tsx` | `NewsLayout` (the widget: header, menu summary and «به‌روز کن») and `NewsComboView` (the list under the combo's tabs). Both draw the header with the time the headlines last arrived as info, and «به‌روز می‌شه…» beside the title while a refresh runs. |
| `hooks/use-news-feeds.ts` | The enabled feeds, one query each. |
| `hooks/use-news-settings.ts` | `rssOptions` in storage: the default feed switch and the custom feeds. |
| `components/news-container.tsx` | The headlines of every feed in one list, newest first, then a row for each feed that failed. Skeletons before the first headline, `NewsEmpty` when no feed is on, and «فعلاً خبر تازه‌ای نیست» when the feeds answer with nothing. |
| `components/feed-error-row.tsx` | «نتونستیم «زومیت» رو بیاریم» with «دوباره امتحان کن», which refetches that feed. |
| `components/news-item.tsx` | One headline: picture, title, source and age. A task row's padding. |
| `news-setting.tsx` | Settings: the default feed and the feed catalog. |
| `utils/merge-headlines.ts` | One list from every feed, newest first, a headline two feeds share kept once. Tested. |
| `utils/time-ago.ts` | "۲۰ دقیقه پیش". Tested. |

## Data

Each feed is `GET /news/rss` with `url` and `sourceName`, through `useGetRssFeeds`. The default feed is sent as `DEFAULT` for both. A failing feed shows its own error row; the others stay.

«به‌روز کن» calls `useRefreshRssFeeds` from `src/services/news`. It asks for every feed on the page again with `FRESH_REQUEST`, which the service worker sends to the network instead of answering from its cache (see `.github/Api-doc.md`). A plain `refetch()` went through the worker's network-first route with its 3 second wait and could come back with the cached copy.

The server keeps its own copy of each feed for a while, so a refresh can still bring the same headlines; the header time moves either way.

## Menu

Settings first, with "۳ منبع روشنه" under it, then «به‌روز کن». Inside the combo neither appears; the combo has its own.

## Design decisions

- The headlines of all feeds are one list, newest first. Each feed used to keep its own block, in feed order, so a feed turned on in the settings landed under every default headline and read as if the setting did nothing.
- The header info is the time of the last fetch («به‌روز ۱۴:۳۰»), like the currency list. It used to be the age of the newest headline, which a refresh that brought the same headlines never changed.
- The age of a headline is computed when the list renders and does not tick on its own.

## Not checked on screen

Headlines with and without pictures, a long two line title, feeds mixing after a source is turned on, the error row under the headlines, both empty states, «به‌روز می‌شه…» beside the title, the header time after a refresh.
