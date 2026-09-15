import { describe, expect, it } from 'bun:test'
import { getBestAllowedSizeForColumns } from '../placement'
import type { WidgetSize } from '../types'

const CALENDAR_SIZES: WidgetSize[] = [
	{ w: 1, h: 1 },
	{ w: 2, h: 1 },
	{ w: 2, h: 3 },
]
const CALENDAR_DEFAULT: WidgetSize = { w: 2, h: 3 }

describe('getBestAllowedSizeForColumns', () => {
	it('keeps a size that is still allowed and still fits', () => {
		const size = getBestAllowedSizeForColumns(
			CALENDAR_SIZES,
			{ w: 2, h: 1 },
			8,
			CALENDAR_DEFAULT
		)

		expect(size).toEqual({ w: 2, h: 1 })
	})

	it('falls back to the default size when the stored size was removed', () => {
		const size = getBestAllowedSizeForColumns(
			CALENDAR_SIZES,
			{ w: 2, h: 2 },
			8,
			CALENDAR_DEFAULT
		)

		expect(size).toEqual(CALENDAR_DEFAULT)
	})

	it('prefers the default over a numerically closer size', () => {
		const nearest = getBestAllowedSizeForColumns(CALENDAR_SIZES, { w: 2, h: 2 }, 8)

		expect(nearest).toEqual({ w: 2, h: 1 })
		expect(
			getBestAllowedSizeForColumns(
				CALENDAR_SIZES,
				{ w: 2, h: 2 },
				8,
				CALENDAR_DEFAULT
			)
		).toEqual(CALENDAR_DEFAULT)
	})

	it('ignores a default that does not fit the column count', () => {
		const size = getBestAllowedSizeForColumns(
			CALENDAR_SIZES,
			{ w: 2, h: 2 },
			1,
			CALENDAR_DEFAULT
		)

		expect(size).toEqual({ w: 1, h: 1 })
	})

	it('ignores a default that is not in the allowed list', () => {
		const size = getBestAllowedSizeForColumns(CALENDAR_SIZES, { w: 2, h: 2 }, 8, {
			w: 4,
			h: 4,
		})

		expect(size).toEqual({ w: 2, h: 1 })
	})

	it('behaves exactly as before when no default is passed', () => {
		expect(getBestAllowedSizeForColumns(CALENDAR_SIZES, { w: 1, h: 1 }, 8)).toEqual({
			w: 1,
			h: 1,
		})
		expect(getBestAllowedSizeForColumns(CALENDAR_SIZES, { w: 8, h: 3 }, 8)).toEqual({
			w: 2,
			h: 3,
		})
	})
})
