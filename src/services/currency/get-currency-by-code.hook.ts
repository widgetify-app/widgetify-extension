import {
	queryOptions,
	useIsFetching,
	useQueries,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query'
import ms from 'ms'
import { FRESH_REQUEST, getMainClient } from '@/services/api'
import { currencyKeys } from '@/services/currency/currency.keys'

export interface FetchedCurrency {
	name: {
		fa: string
		en: string
	}
	icon: string
	price: number
	rialPrice: number
	changePercentage: number
	priceHistory: PriceHistory[]
	type: 'coin' | 'crypto' | 'currency'
	url: string | null
	useDollar: boolean
	isPartnerShip: boolean
	partnershipLogo: string
}

interface PriceHistory {
	price: number
	createdAt: string
}

function currencyByCodeQuery(currency: string, refetchInterval: number | null) {
	return queryOptions({
		queryKey: currencyKeys.byCode(currency),
		queryFn: async () => getCurrencyByCode(currency),
		retry: 0,
		refetchInterval: refetchInterval || false,
		staleTime: ms('1m'),
	})
}

export const useGetCurrencyByCode = (
	currency: string,
	options: { refetchInterval: number | null }
) => {
	return useQuery(currencyByCodeQuery(currency, options.refetchInterval))
}

export function useCurrenciesUpdatedAt(currencies: string[]) {
	return useQueries({
		queries: currencies.map((currency) => currencyByCodeQuery(currency, null)),
		combine: (results) =>
			Math.max(0, ...results.map((result) => result.dataUpdatedAt)),
	})
}

export function useRefreshCurrencies() {
	const queryClient = useQueryClient()
	const isRefreshing = useIsFetching({ queryKey: currencyKeys.byCodeAll }) > 0

	const refresh = async () => {
		const shown = queryClient
			.getQueryCache()
			.findAll({ queryKey: currencyKeys.byCodeAll, type: 'active' })

		await Promise.all(
			shown.map(({ queryKey }) => {
				const code = String(queryKey[1])
				return queryClient
					.fetchQuery({
						queryKey: currencyKeys.byCode(code),
						queryFn: () => getCurrencyByCode(code, true),
						staleTime: 0,
					})
					.catch(() => undefined)
			})
		)
	}

	return { refresh, isRefreshing }
}

async function getCurrencyByCode(
	currency: string,
	fresh = false
): Promise<FetchedCurrency> {
	const client = getMainClient()
	const { data } = await client.get<FetchedCurrency>(
		`/currencies/${currency}`,
		fresh ? FRESH_REQUEST : undefined
	)
	return data
}
