import { useQuery } from '@tanstack/react-query'
import { getMainClient } from '@/services/api'
import type { MarketQueryParams, MarketResponse } from './market.interface'

export const useGetMarketItems = (enabled: boolean, params?: MarketQueryParams) => {
	return useQuery<MarketResponse>({
		queryKey: ['getMarketItems', params],
		queryFn: async () => getMarketItems(params),
		retry: 2,
		staleTime: 1000 * 60 * 5, // 5 minutes
		gcTime: 1000 * 60 * 10, // 10 minutes
		enabled,
	})
}

export async function getMarketItems(
	params?: MarketQueryParams
): Promise<MarketResponse> {
	const client = await getMainClient()
	const searchParams = new URLSearchParams()

	if (params?.page) searchParams.append('page', params.page.toString())
	if (params?.limit) searchParams.append('limit', params.limit.toString())
	if (params?.type) searchParams.append('type', params.type)

	const { data } = await client.get<MarketResponse>(
		`/market?${searchParams.toString()}`
	)
	return data
}
