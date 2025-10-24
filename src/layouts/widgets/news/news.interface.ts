export interface RssFeed {
	id: string
	name: string
	url: string
	enabled: boolean
}

export interface RssItem {
	title: string
	description: string
	link: string
	pubDate: string
	source: {
		name: string
		url: string
	}
	image_url?: string
}

export interface WigiNewsSetting {
	customFeeds: RssFeed[]
	useDefaultNews: boolean
	lastFetchedItems: Record<string, RssItem[]>
}
