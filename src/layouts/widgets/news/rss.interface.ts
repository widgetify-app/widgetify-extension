import type { FetchedRssItem } from '@/services/hooks/news/getNews.hook'

export interface RssFeed {
	id: string
	name: string
	url: string
	enabled: boolean
}

export interface WigiNewsSetting {
	customFeeds: RssFeed[]
	useDefaultNews: boolean
	lastFetchedItems: Record<string, FetchedRssItem[]>
}
