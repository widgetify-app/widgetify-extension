import { useEffect, useState } from 'react'
import { getFromStorage, setToStorage } from '@/common/storage'
import {
	type FetchedCurrency,
	useGetCurrencyByCode,
} from '@/services/hooks/currency/get-currency-by-code.hook'

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

	const priceChange =
		currency?.changePercentage && currency?.rialPrice
			? (currency.changePercentage / 100) * currency.rialPrice
			: 0

	return { currency, priceChange, hasFailed: isError && !currency, refetch }
}
