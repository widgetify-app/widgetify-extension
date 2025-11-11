import type { RssItem } from '@/layouts/widgets/news/rss.interface'
import { getMainClient } from '../api'

export async function GetRss(url: string, sourceName: string): Promise<RssItem[]> {
	const api = await getMainClient()
	const result = await api.get('/rss', {
		params: {
			url: url,
			sourceName,
		},
	})
	return result.data
}
