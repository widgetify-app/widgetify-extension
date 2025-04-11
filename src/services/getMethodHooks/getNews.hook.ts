import { useQuery } from '@tanstack/react-query'
import { getMainClient } from '../api'

export interface NewsSource {
	name: string
	url: string
}

export interface NewsItem {
	title: string
	description: string
	source: NewsSource
	publishedAt: string
}

export interface NewsResponse {
	platform: {
		name: string
		url: string
	}
	news: NewsItem[]
	updatedAt: string
}

export const useGetNews = (enabled: boolean) => {
	return useQuery<NewsResponse>({
		queryKey: ['getNews'],
		queryFn: async () => getNews(),
		retry: 1,
		enabled: enabled,
		initialData: {
			platform: {
				name: '',
				url: '',
			},
			news: [],
			updatedAt: '',
		},
	})
}

export async function getNews(): Promise<NewsResponse> {
	const client = await getMainClient()
	const { data } = await client.get<NewsResponse>('/news')
	return data
}
