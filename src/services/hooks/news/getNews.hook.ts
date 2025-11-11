import { useQuery } from '@tanstack/react-query'
import { getFromStorage, setToStorage } from '@/common/storage'
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
	const [initialData, setInitialData] = useState<any>(undefined)

	useEffect(() => {
		if (!url || !sourceName) return

		;(async () => {
			const stored = await getFromStorage('rssOptions')
			if (stored?.lastFetchedItems[url]) {
				setInitialData(stored.lastFetchedItems[url])
			}
		})()
	}, [url, sourceName])

	return useQuery<FetchedRssItem[]>({
		queryKey: ['getRss', url, sourceName],
		queryFn: async () => {
			const data = await getRss(url, sourceName)
			const stored = await getFromStorage('rssOptions')
			if (stored) {
				stored.lastFetchedItems = {
					...stored.lastFetchedItems,
					[url]: data,
				}
				await setToStorage('rssOptions', stored)
			}
			return data
		},
		enabled: !!url && !!sourceName,
		initialData,
	})
}
export async function getRss(url: string, sourceName: string): Promise<FetchedRssItem[]> {
	const client = await getMainClient()
	const { data } = await client.get<FetchedRssItem[]>(
		`/news/rss?url=${encodeURIComponent(url)}&sourceName=${encodeURIComponent(sourceName)}`
	)
	return data
}

export async function getNews(): Promise<FetchedRssItem[]> {
	const client = await getMainClient()
	const { data } = await client.get<FetchedRssItem[]>('/news')
	return data
}
