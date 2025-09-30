import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import { getMainClient } from '@/services/api'

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
	isSponsored: boolean
}

export interface PriceHistory {
	price: number
	createdAt: string
}

export const useGetCurrencyByCode = (
	currency: string,
	options: { refetchInterval: number | null }
) => {
	return useQuery<FetchedCurrency>({
		queryKey: [`currency-${currency}`],
		queryFn: async () => getSupportCurrencies(currency),
		retry: 0,
		refetchInterval: options.refetchInterval || false,
		staleTime: ms('1m'),
	})
}

async function getSupportCurrencies(currency: string): Promise<FetchedCurrency> {
	const client = await getMainClient()
	const { data } = await client.get<FetchedCurrency>(`/currencies/${currency}`)
	return data
}
