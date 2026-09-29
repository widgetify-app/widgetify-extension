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

declare module '@/common/constants/store-keys' {
	interface StorageKV {
		rssOptions: WigiNewsSetting
	}
}

declare module '@/common/utils/call-event' {
	interface EventName {
		wigiNewsSettingsChanged: WigiNewsSetting
	}
}
