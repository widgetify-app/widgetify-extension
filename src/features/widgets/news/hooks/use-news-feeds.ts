import { t } from '@/common/i18n'
import { useGetRssFeeds } from '@/services/news/get-news.hook'
import type { RssFeed } from '../types'
import { useNewsSettings } from './use-news-settings'

const DEFAULT_FEED: RssFeed = {
	id: 'default',
	enabled: true,
	name: 'DEFAULT',
	url: 'DEFAULT',
}

export type NewsFeedEntry = ReturnType<typeof useNewsFeeds>['entries'][number]

export function useNewsFeeds() {
	const { settings } = useNewsSettings()
	const enabledFeeds = settings.customFeeds.filter((feed) => feed.enabled)
	const feeds = settings.useDefaultNews ? [DEFAULT_FEED, ...enabledFeeds] : enabledFeeds
	const results = useGetRssFeeds(feeds)

	const entries = feeds.map((feed, index) => ({
		feed,
		label: feed.id === DEFAULT_FEED.id ? t('widgets.news.defaultFeed') : feed.name,
		result: results[index],
	}))

	return { entries }
}
