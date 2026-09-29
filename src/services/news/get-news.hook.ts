import { useQuery } from '@tanstack/react-query'
import { getMainClient } from '@/services/api'
import { newsKeys } from '@/services/news/news.keys'

interface FetchedRssItem {
	title: string
	description: string
	link: string
	publishedAt: string
	image_url?: string
	source: {
		name: string
		url: string
	}
}

export const useGetRss = (url: string, sourceName: string) => {
	return useQuery<FetchedRssItem[]>({
		queryKey: newsKeys.rss(url, sourceName),
		queryFn: () => getRss(url, sourceName),
		retry: 1,
		enabled: !!url && !!sourceName,
	})
}

async function getRss(url: string, sourceName: string): Promise<FetchedRssItem[]> {
	const client = getMainClient()
	const { data } = await client.get<FetchedRssItem[]>('/news/rss', {
		params: { url, sourceName },
	})

	return data || []
}
