import type { FetchedCurrency } from '@/services/currency/get-currency-by-code.hook'

const DOLLAR_PRICED_CODES = ['btc']

interface CurrencyPrice {
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

export function calculatePriceChange(code: string, currency: FetchedCurrency): number {
	if (!currency.changePercentage) return 0
	const { value } = getPrice(code, currency)
	if (!value || !Number.isFinite(value)) return 0
	return (currency.changePercentage / 100) * value
}
