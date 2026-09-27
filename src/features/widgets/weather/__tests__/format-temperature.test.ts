import { describe, expect, it } from 'bun:test'
import { formatTemperature } from '../utils/format-temperature'

describe('formatTemperature', () => {
	it('rounds to a whole degree', () => {
		expect(formatTemperature(21.4, 'metric').value).toBe(21)
		expect(formatTemperature(21.6, 'metric').value).toBe(22)
	})

	it('returns the symbol for each supported unit', () => {
		expect(formatTemperature(0, 'metric').symbol).toBe('°C')
		expect(formatTemperature(0, 'imperial').symbol).toBe('°F')
		expect(formatTemperature(0, 'standard').symbol).toBe('K')
	})

	it('falls back to celsius when the unit is missing', () => {
		expect(formatTemperature(0, null).symbol).toBe('°C')
		expect(formatTemperature(0, undefined).symbol).toBe('°C')
	})

	it('never renders NaN when the reading is missing', () => {
		expect(formatTemperature(undefined, 'metric').value).toBe(0)
		expect(formatTemperature(null, 'metric').value).toBe(0)
	})

	it('keeps negative readings intact', () => {
		expect(formatTemperature(-7.5, 'metric').value).toBe(-7)
		expect(formatTemperature(-8.5, 'metric').value).toBe(-8)
	})
})
