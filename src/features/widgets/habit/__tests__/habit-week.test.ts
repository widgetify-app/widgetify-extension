import { describe, expect, it } from 'bun:test'
import { dayKey, weekdayInitial } from '../utils/habit-week'

describe('dayKey', () => {
	it('keeps a plain date as it is', () => {
		expect(dayKey('2026-10-05')).toBe('2026-10-05')
	})

	it('drops the time from a full timestamp', () => {
		expect(dayKey('2026-10-05T00:00:00.000Z')).toBe('2026-10-05')
	})
})

describe('weekdayInitial', () => {
	it('names each day of a week from Saturday to Friday', () => {
		const week = [
			'2026-10-03',
			'2026-10-04',
			'2026-10-05',
			'2026-10-06',
			'2026-10-07',
			'2026-10-08',
			'2026-10-09',
		]
		expect(week.map(weekdayInitial)).toEqual(['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'])
	})

	it('reads the calendar date of a timestamp, whatever the time zone', () => {
		expect(weekdayInitial('2026-10-05T23:30:00.000Z')).toBe('د')
	})
})
