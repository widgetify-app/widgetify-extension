import { useQuery } from '@tanstack/react-query'
import { getMainClient } from '../../api'

export interface TrendItem {
	title: string
	searchCount: string
	relatedTerms: string[]
}

async function fetchTrends(region = 'IR', limit = 10): Promise<TrendItem[]> {
	const client = await getMainClient()

	const response = await client.get<TrendItem[]>('/google/trends', {
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
		initialData: [],
		enabled,
	})
}
