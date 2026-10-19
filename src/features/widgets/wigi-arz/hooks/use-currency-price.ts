import { useEffect, useState } from 'react'
import { getFromStorage, setToStorage } from '@/common/storage'
import {
	type FetchedCurrency,
	useGetCurrencyByCode,
} from '@/services/currency/get-currency-by-code.hook'
import { calculatePriceChange } from '../utils/get-price'

export function useCurrencyPrice(code: string) {
	const [currency, setCurrency] = useState<FetchedCurrency | null>(null)

	const { data, dataUpdatedAt, isError, refetch } = useGetCurrencyByCode(code, {
		refetchInterval: null,
	})

	useEffect(() => {
		async function loadCache() {
			if (!code) return
			const cached = await getFromStorage(`currency:${code}`)
			if (cached) setCurrency(cached)
		}

		loadCache()
	}, [code])

	useEffect(() => {
		if (!data || !code) return
		setCurrency(data)
		setToStorage(`currency:${code}`, data)
	}, [dataUpdatedAt, code, data])

	const priceChange = currency ? calculatePriceChange(code, currency) : 0

	return { currency, priceChange, hasFailed: isError && !currency, refetch }
}
