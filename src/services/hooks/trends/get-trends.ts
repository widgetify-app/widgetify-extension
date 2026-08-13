import { useQuery } from '@tanstack/react-query'
import { getMainClient } from '@/services/api'

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
	title: string
	url: string | null
	icon: string
	priority: number
	subSites?: RecommendedSubSite[]
}
export interface EngineMeta {
	id: string
	label: string
	icon: any
	prefix: string
}
export interface SearchBoxResponse {
	search_engines: EngineMeta[]
	recommendedSites: RecommendedSite[]
	explorer: {
		newBadge: boolean
	}
	selected_engine: string
}

async function fetchSearchbox(region = 'IR', limit = 10): Promise<SearchBoxResponse> {
	const client = getMainClient()

	const response = await client.get<SearchBoxResponse>('/searchbox', {
		params: {
			region,
			limit,
		},
	})
	return response.data
}

export function useGetSearchboxData(
	options: {
		region?: string
		limit?: number
		refetchInterval?: number | null
		enabled?: boolean
	} = {}
) {
	const { region = 'IR', limit = 10, refetchInterval = null, enabled = true } = options
	return useQuery<SearchBoxResponse>({
		queryKey: ['getTrends', region, limit],
		queryFn: () => fetchSearchbox(region, limit),
		refetchInterval: refetchInterval || false,
		enabled,
	})
}
