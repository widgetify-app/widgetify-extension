import { describe, expect, it } from 'bun:test'
import { getPriceChange } from '../utils/get-price-change'

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
