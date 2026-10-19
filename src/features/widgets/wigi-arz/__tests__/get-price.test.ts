import { describe, expect, it } from 'bun:test'
import type { FetchedCurrency } from '@/services/currency/get-currency-by-code.hook'
import { calculatePriceChange, getPrice } from '../utils/get-price'

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

describe('calculatePriceChange', () => {
	it('uses dollar price for bitcoin instead of rial price', () => {
		const btc = currency({
			price: 83380,
			rialPrice: 21921435800,
			changePercentage: 0.06,
		})

		expect(calculatePriceChange('BTC', btc)).toBeCloseTo(50.028)
		expect(calculatePriceChange('btc', btc)).toBeCloseTo(50.028)
	})

	it('uses rial price for ordinary currencies', () => {
		const usd = currency({
			price: 1,
			rialPrice: 950000,
			changePercentage: 0.06,
		})

		expect(calculatePriceChange('USD', usd)).toBe(570)
	})

	it('uses dollar price when useDollar flag is true', () => {
		const eth = currency({
			price: 3000,
			rialPrice: 3000000000,
			changePercentage: 2,
			useDollar: true,
		})

		expect(calculatePriceChange('ETH', eth)).toBe(60)
	})

	it('returns 0 when changePercentage is missing or zero', () => {
		expect(calculatePriceChange('BTC', currency({ changePercentage: 0 }))).toBe(0)
		expect(
			calculatePriceChange(
				'BTC',
				currency({ changePercentage: undefined as unknown as number })
			)
		).toBe(0)
	})

	it('preserves negative price change', () => {
		const btc = currency({
			price: 80000,
			rialPrice: 20000000000,
			changePercentage: -1.5,
		})

		expect(calculatePriceChange('BTC', btc)).toBe(-1200)
	})
})
