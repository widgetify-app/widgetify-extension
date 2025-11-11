import { GetRss } from '@/services/rss/rss.api'
import type { RssItem } from '../rss.interface'

export const fetchRssFeed = async (
	url: string,
	sourceName: string
): Promise<RssItem[]> => {
	try {
		const response = await GetRss(url, sourceName)
		return response
	} catch (_error) {
		return []
	}
}
