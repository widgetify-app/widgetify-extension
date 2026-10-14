import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import ms from 'ms'
import { getMainClient } from '@/services/api'
import { currencyKeys } from '@/services/currency/currency.keys'
import type { FetchedCurrency } from '@/services/currency/get-currency-by-code.hook'

export const CURRENCY_HISTORY_RANGES = ['24h', '7d', '30d'] as const

export type CurrencyHistoryRange = (typeof CURRENCY_HISTORY_RANGES)[number]

const LOCKED_STATUSES = [401, 403]

export function isHistoryLocked(error: unknown): boolean {
	return (
		axios.isAxiosError(error) && LOCKED_STATUSES.includes(error.response?.status ?? 0)
	)
}

export const useGetCurrencyHistory = (
	currency: string,
	range: CurrencyHistoryRange,
	enabled: boolean
) => {
	return useQuery({
		queryKey: currencyKeys.history(currency, range),
		queryFn: async () => {
			const { data } = await getMainClient().get<FetchedCurrency>(
				`/currencies/${currency}`,
				{ params: { history: range } }
			)
			return data.priceHistory ?? []
		},
		enabled,
		retry: 0,
		staleTime: ms('5m'),
	})
}
