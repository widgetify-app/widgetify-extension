import type { FetchedCurrency } from '@/services/hooks/currency/get-currency-by-code.hook'

export const DOLLAR_PRICED_CODES = ['btc']

export interface CurrencyPrice {
	value: number
	isDollar: boolean
	formatted: string
}

export function getPrice(code: string, currency: FetchedCurrency): CurrencyPrice {
	const isDollar =
		DOLLAR_PRICED_CODES.includes(code.toLowerCase()) || Boolean(currency.useDollar)
	const value = isDollar ? currency.price : currency.rialPrice

	return {
		value,
		isDollar,
		formatted: typeof value === 'number' ? value.toLocaleString() : '-',
	}
}
