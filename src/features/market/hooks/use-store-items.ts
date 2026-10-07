import { useMemo } from 'react'
import { useGetMarketItems } from '@/services/market/get-market-items.hook'
import { MARKET_ITEMS_LIMIT } from '../constants'
import type { StoreItem } from '../types'
import { marketItemToStoreItem } from '../utils/store-item'

export function useStoreItems() {
	const { data, isLoading, isError, refetch } = useGetMarketItems(true, {
		limit: MARKET_ITEMS_LIMIT,
	})

	const items = useMemo(
		() =>
			(data?.items ?? [])
				.map(marketItemToStoreItem)
				.filter((item): item is StoreItem => item !== null),
		[data]
	)

	return { items, isLoading, isError, refetch }
}
