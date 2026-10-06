import { describe, expect, it } from 'bun:test'
import { getTemperatureRange } from '../utils/temperature-range'

describe('getTemperatureRange', () => {
	it('gives the rounded high and low with the unit', () => {
		expect(getTemperatureRange(27.4, 14.6, 'metric')).toEqual({
			high: '27°',
			low: '15°',
		})
		expect(getTemperatureRange(80, 61, 'imperial')).toEqual({
			high: '80°F',
			low: '61°F',
		})
	})

	it('hides a range that rounds to one temperature', () => {
		expect(getTemperatureRange(18.79, 18.79, 'metric')).toBeNull()
		expect(getTemperatureRange(18.6, 19.4, 'metric')).toBeNull()
	})

	it('hides a range with a missing reading', () => {
		expect(getTemperatureRange(undefined, 15, 'metric')).toBeNull()
		expect(getTemperatureRange(27, undefined, 'metric')).toBeNull()
	})
})
