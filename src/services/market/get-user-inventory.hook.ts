import { useQuery } from '@tanstack/react-query'
import { getMainClient } from '@/services/api'
import type { MarketQueryParams, UserInventoryResponse } from './market.interface'
import { marketKeys } from '@/services/market/market.keys'

export const useGetUserInventory = (enabled: boolean, params?: MarketQueryParams) => {
	return useQuery<UserInventoryResponse>({
		queryKey: marketKeys.inventory(params),
		queryFn: async () => getUserInventory(params),
		enabled,
	})
}

async function getUserInventory(
	params?: MarketQueryParams
): Promise<UserInventoryResponse> {
	const client = getMainClient()
	const searchParams = new URLSearchParams()

	if (params?.page) searchParams.append('page', params.page.toString())
	if (params?.limit) searchParams.append('limit', params.limit.toString())
	if (params?.type) searchParams.append('type', params.type)

	const { data } = await client.get(`/market/@me/inventory?${searchParams.toString()}`)
	return data
}
