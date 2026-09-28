import { describe, expect, it } from 'bun:test'
import { DEFAULT_DOT_CALENDAR_VARIANT, DOT_CALENDAR_VARIANTS } from '../constants'
import { normalizeDotCalendarVariant } from '../utils/normalize-variant'

describe('normalizeDotCalendarVariant', () => {
	it('keeps every mode the widget offers', () => {
		for (const variant of DOT_CALENDAR_VARIANTS) {
			expect(normalizeDotCalendarVariant(variant)).toBe(variant)
		}
	})

	it('falls back to the year view when nothing is stored', () => {
		expect(normalizeDotCalendarVariant(undefined)).toBe(DEFAULT_DOT_CALENDAR_VARIANT)
		expect(normalizeDotCalendarVariant(null)).toBe(DEFAULT_DOT_CALENDAR_VARIANT)
	})

	it('rejects a value that is not a mode instead of trusting storage', () => {
		expect(normalizeDotCalendarVariant('Goal')).toBe(DEFAULT_DOT_CALENDAR_VARIANT)
	})
})
