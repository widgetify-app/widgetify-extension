import { describe, expect, it } from 'bun:test'
import { formatChangeAmount, getPriceChange } from '../utils/get-price-change'

describe('getPriceChange', () => {
	it('gives the direction and the size of the change to one decimal', () => {
		expect(getPriceChange(0.62)).toEqual({ direction: 'up', percent: '۰٫۶٪' })
		expect(getPriceChange(-1.84)).toEqual({ direction: 'down', percent: '۱٫۸٪' })
		expect(getPriceChange(3)).toEqual({ direction: 'up', percent: '۳٪' })
	})

	it('calls a change that rounds to zero flat', () => {
		expect(getPriceChange(0)).toEqual({ direction: 'flat', percent: '۰٪' })
		expect(getPriceChange(-0.04)).toEqual({ direction: 'flat', percent: '۰٪' })
	})

	it('treats a missing change as flat', () => {
		expect(getPriceChange(undefined).direction).toBe('flat')
		expect(getPriceChange(null).direction).toBe('flat')
		expect(getPriceChange(Number.NaN).direction).toBe('flat')
	})
})

describe('formatChangeAmount', () => {
	it('rounds to a whole number, drops the sign and groups digits', () => {
		expect(formatChangeAmount(1234567.4)).toBe((1234567).toLocaleString())
		expect(formatChangeAmount(-2619.6)).toBe((2620).toLocaleString())
		expect(formatChangeAmount(0)).toBe('0')
	})

	it('keeps two decimals under 10, so a small change in dollars is not shown as zero', () => {
		expect(formatChangeAmount(0.17)).toBe((0.17).toLocaleString())
		expect(formatChangeAmount(-1.234)).toBe((1.23).toLocaleString())
		expect(formatChangeAmount(9.996)).toBe((10).toLocaleString())
		expect(formatChangeAmount(10.4)).toBe('10')
	})
})
