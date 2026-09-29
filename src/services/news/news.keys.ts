export const newsKeys = {
	rss: (url: string, sourceName: string) => ['getRss', url, sourceName] as const,
	feeds: ['getAvailableRssFeeds'] as const,
}
