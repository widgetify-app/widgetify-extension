import { describe, expect, it } from 'bun:test'
import type { FetchedCurrency } from '@/services/hooks/currency/get-currency-by-code.hook'
import { getPrice } from '../utils/get-price'

function currency(overrides: Partial<FetchedCurrency> = {}): FetchedCurrency {
	return {
		price: 12,
		rialPrice: 950000,
		useDollar: false,
		...overrides,
	} as FetchedCurrency
}

describe('getPrice', () => {
	it('uses the rial price for an ordinary currency', () => {
		const { value, isDollar } = getPrice('USD', currency())

		expect(value).toBe(950000)
		expect(isDollar).toBe(false)
	})

	it('always prices bitcoin in dollars, whatever the flag says', () => {
		expect(getPrice('BTC', currency()).isDollar).toBe(true)
		expect(getPrice('btc', currency()).isDollar).toBe(true)
		expect(getPrice('BTC', currency()).value).toBe(12)
	})

	it('honours the useDollar flag for other codes', () => {
		const { value, isDollar } = getPrice('ETH', currency({ useDollar: true }))

		expect(isDollar).toBe(true)
		expect(value).toBe(12)
	})

	it('groups digits so prices stay readable', () => {
		expect(getPrice('USD', currency({ rialPrice: 1234567 })).formatted).toBe(
			(1234567).toLocaleString()
		)
	})

	it('falls back to a dash instead of printing undefined', () => {
		const missing = getPrice(
			'USD',
			currency({ rialPrice: undefined as unknown as number })
		)

		expect(missing.formatted).toBe('-')
	})
})
