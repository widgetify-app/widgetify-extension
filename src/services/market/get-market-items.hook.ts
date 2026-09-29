import { useQuery } from '@tanstack/react-query'
import { getMainClient } from '@/services/api'
import type { MarketQueryParams, MarketResponse } from './market.interface'
import { marketKeys } from '@/services/market/market.keys'

export const useGetMarketItems = (enabled: boolean, params?: MarketQueryParams) => {
	return useQuery<MarketResponse>({
		queryKey: marketKeys.items(params),
		queryFn: async () => getMarketItems(params),
		retry: 2,
		enabled,
	})
}

async function getMarketItems(params?: MarketQueryParams): Promise<MarketResponse> {
	const client = getMainClient()
	const searchParams = new URLSearchParams()

	if (params?.page) searchParams.append('page', params.page.toString())
	if (params?.limit) searchParams.append('limit', params.limit.toString())
	if (params?.type) searchParams.append('type', params.type)

	const { data } = await client.get<MarketResponse>(
		`/market?${searchParams.toString()}`
	)
	return data
}
