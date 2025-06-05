import { GetRss } from '@/services/rss/rss.api'
import type { RssItem } from '../news.interface'

export const fetchRssFeed = async (
	url: string,
	sourceName: string,
): Promise<RssItem[]> => {
	try {
		const response = await GetRss(url, sourceName)
		return response
	} catch (error) {
		console.error('Error fetching RSS feed:', error)
		return []
	}
}
