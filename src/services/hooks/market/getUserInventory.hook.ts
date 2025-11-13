import { useQuery } from '@tanstack/react-query'
import { getMainClient } from '@/services/api'
import type { MarketQueryParams, UserInventoryResponse } from './market.interface'

export const useGetUserInventory = (enabled: boolean, params?: MarketQueryParams) => {
	return useQuery<UserInventoryResponse>({
		queryKey: ['getUserInventory', params],
		queryFn: async () => getUserInventory(params),
		enabled,
		retry: 2,
		staleTime: 1000 * 60 * 5, // 5 minutes
		gcTime: 1000 * 60 * 10, // 10 minutes
	})
}

export async function getUserInventory(
	params?: MarketQueryParams
): Promise<UserInventoryResponse> {
	const client = await getMainClient()
	const searchParams = new URLSearchParams()

	if (params?.page) searchParams.append('page', params.page.toString())
	if (params?.limit) searchParams.append('limit', params.limit.toString())
	if (params?.type) searchParams.append('type', params.type)

	const { data } = await client.get(`/market/@me/inventory?${searchParams.toString()}`)
	return data
}
