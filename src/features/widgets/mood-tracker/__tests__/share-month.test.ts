import { describe, expect, it } from 'bun:test'
import { currentJalaliMonth, shiftJalaliMonth } from '../utils/share-month'

describe('shiftJalaliMonth', () => {
	it('steps back inside a year', () => {
		expect(shiftJalaliMonth({ year: 1405, month: 8 }, -3)).toEqual({
			year: 1405,
			month: 5,
		})
	})

	it('crosses into the year before', () => {
		expect(shiftJalaliMonth({ year: 1405, month: 2 }, -3)).toEqual({
			year: 1404,
			month: 11,
		})
	})

	it('crosses into the next year', () => {
		expect(shiftJalaliMonth({ year: 1404, month: 12 }, 1)).toEqual({
			year: 1405,
			month: 1,
		})
	})
})

describe('currentJalaliMonth', () => {
	it('reads the Jalali month in Tehran', () => {
		expect(currentJalaliMonth(new Date('2026-10-24T12:00:00Z'))).toEqual({
			year: 1405,
			month: 8,
		})
	})
})
