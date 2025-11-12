import { useQuery } from '@tanstack/react-query'
import { getMainClient } from '@/services/api'

export type MarketItemType = 'BROWSER_TITLE' | 'FONT' | 'THEME' | string

export interface MarketItem {
	id: string
	name: string
	description: string
	type: MarketItemType
	price: number
	meta: Record<string, any>
	previewUrl: string | null
}

export interface MarketResponse {
	totalPages: number
	items: MarketItem[]
}

export interface MarketQueryParams {
	page?: number
	limit?: number
	type?: MarketItemType
}

export const useGetMarketItems = (params?: MarketQueryParams) => {
	return useQuery<MarketResponse>({
		queryKey: ['getMarketItems', params],
		queryFn: async () => getMarketItems(params),
		retry: 2,
		staleTime: 1000 * 60 * 5, // 5 minutes
		gcTime: 1000 * 60 * 10, // 10 minutes
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
