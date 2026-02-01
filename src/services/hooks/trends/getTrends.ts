import { useQuery } from '@tanstack/react-query'
import { getFromStorage } from '@/common/storage'
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
	} = {}
) {
	const [initialData, setInitialData] = useState<any>(undefined)

	useEffect(() => {
		;(async () => {
			const stored = await getFromStorage('recommended_sites')
			if (stored?.length) {
				setInitialData({
					recommendedSites: stored,
					trends: [],
				})
			}
		})()
	}, [])

	const { region = 'IR', limit = 10, refetchInterval = null, enabled = true } = options
	return useQuery<SearchBoxResponse>({
		queryKey: ['getTrends', region, limit],
		queryFn: () => fetchTrends(region, limit),
		refetchInterval: refetchInterval || false,
		enabled,
		initialData,
	})
}
