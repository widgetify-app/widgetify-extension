export interface RssFeed {
	id: string
	name: string
	url: string
	enabled: boolean
}

export interface WigiNewsSetting {
	customFeeds: RssFeed[]
	useDefaultNews: boolean
}
