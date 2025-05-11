import { getMainClient } from '@/services/api'
import { useQuery } from '@tanstack/react-query'

export interface TrendItem {
	title: string
	searchCount: string
}

export interface RecommendedSubSite {
	name: string
	url: string | null
	icon: string
	priority: number
}

export interface RecommendedSite {
	name: string
	url: string | null
	icon: string
	priority: number
	subSites?: RecommendedSubSite[]
}

export interface SearchBoxResponse {
	trends: TrendItem[]
	recommendedSites: RecommendedSite[]
}

async function fetchTrends(region = 'IR', limit = 10): Promise<SearchBoxResponse> {
	const client = await getMainClient()

	const response = await client.get<SearchBoxResponse>('/extension/searchbox', {
		params: {
			region,
			limit,
		},
	})
	return response.data
}

export function useGetTrends(
	options: {
		region?: string
		limit?: number
		refetchInterval?: number | null
		enabled?: boolean
	} = {},
) {
	const { region = 'IR', limit = 10, refetchInterval = null, enabled = true } = options

	return useQuery({
		queryKey: ['getTrends', region, limit],
		queryFn: () => fetchTrends(region, limit),
		refetchInterval: refetchInterval || false,
		enabled,
	})
}
