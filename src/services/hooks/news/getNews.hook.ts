import { useQuery } from '@tanstack/react-query'
import { getMainClient } from '@/services/api'

export interface NewsSource {
	name: string
	url: string
}

export interface FetchedRssItem {
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

export const useGetNews = (enabled: boolean) => {
	return useQuery<FetchedRssItem[]>({
		queryKey: ['getNews'],
		queryFn: async () => getNews(),
		retry: 1,
		enabled: enabled,
		initialData: [],
	})
}

export const useGetRss = (url: string, sourceName: string) => {
	return useQuery<FetchedRssItem[]>({
		queryKey: ['getRss', url, sourceName],
		queryFn: () => getRss(url, sourceName),
		enabled: !!url && !!sourceName,
	})
}
export async function getRss(url: string, sourceName: string): Promise<FetchedRssItem[]> {
	const client = await getMainClient()
	const { data } = await client.get<FetchedRssItem[]>(
		`/news/rss?url=${encodeURIComponent(url)}&sourceName=${encodeURIComponent(sourceName)}`
	)
	return data || []
}

export async function getNews(): Promise<FetchedRssItem[]> {
	const client = await getMainClient()
	const { data } = await client.get<FetchedRssItem[]>('/news')
	return data
}
