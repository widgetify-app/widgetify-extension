export const newsKeys = {
	rssAll: ['getRss'] as const,
	rss: (url: string, sourceName: string) => ['getRss', url, sourceName] as const,
	feeds: ['getAvailableRssFeeds'] as const,
}
