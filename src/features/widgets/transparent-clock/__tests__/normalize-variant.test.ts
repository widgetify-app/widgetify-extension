import { describe, expect, it } from 'bun:test'
import {
	DEFAULT_TRANSPARENT_CLOCK_VARIANT,
	TRANSPARENT_CLOCK_VARIANTS,
} from '../constants'
import { normalizeTransparentClockVariant } from '../utils/normalize-variant'

describe('normalizeTransparentClockVariant', () => {
	it('keeps every model the widget actually offers', () => {
		for (const variant of TRANSPARENT_CLOCK_VARIANTS) {
			expect(normalizeTransparentClockVariant(variant)).toBe(variant)
		}
	})

	it('falls back to the default when nothing is stored', () => {
		expect(normalizeTransparentClockVariant(undefined)).toBe(
			DEFAULT_TRANSPARENT_CLOCK_VARIANT
		)
		expect(normalizeTransparentClockVariant(null)).toBe(
			DEFAULT_TRANSPARENT_CLOCK_VARIANT
		)
	})

	it('rejects a value that is not a model instead of trusting storage', () => {
		expect(normalizeTransparentClockVariant('nonsense')).toBe(
			DEFAULT_TRANSPARENT_CLOCK_VARIANT
		)
		expect(normalizeTransparentClockVariant('English')).toBe(
			DEFAULT_TRANSPARENT_CLOCK_VARIANT
		)
	})
})
