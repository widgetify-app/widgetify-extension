import {
	queryOptions,
	useIsFetching,
	useQueries,
	useQueryClient,
} from '@tanstack/react-query'
import { FRESH_REQUEST, getMainClient } from '@/services/api'
import { newsKeys } from '@/services/news/news.keys'

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

function rssQuery(url: string, sourceName: string) {
	return queryOptions({
		queryKey: newsKeys.rss(url, sourceName),
		queryFn: () => getRss(url, sourceName),
		retry: 1,
		enabled: !!url && !!sourceName,
	})
}

export function useGetRssFeeds(feeds: { url: string; name: string }[]) {
	return useQueries({
		queries: feeds.map((feed) => rssQuery(feed.url, feed.name)),
	})
}

export function useRefreshRssFeeds() {
	const queryClient = useQueryClient()
	const isRefreshing = useIsFetching({ queryKey: newsKeys.rssAll }) > 0

	const refresh = async () => {
		const shown = queryClient
			.getQueryCache()
			.findAll({ queryKey: newsKeys.rssAll, type: 'active' })

		await Promise.all(
			shown.map(({ queryKey }) => {
				const url = String(queryKey[1])
				const sourceName = String(queryKey[2])
				return queryClient
					.fetchQuery({
						queryKey: newsKeys.rss(url, sourceName),
						queryFn: () => getRss(url, sourceName, true),
						staleTime: 0,
					})
					.catch(() => undefined)
			})
		)
	}

	return { refresh, isRefreshing }
}

async function getRss(
	url: string,
	sourceName: string,
	fresh = false
): Promise<FetchedRssItem[]> {
	const client = getMainClient()
	const { data } = await client.get<FetchedRssItem[]>('/news/rss', {
		params: { url, sourceName },
		...(fresh ? FRESH_REQUEST : {}),
	})

	return data || []
}
