import { describe, expect, it } from 'bun:test'
import jalaliMoment from 'jalali-moment'
import { DAYS_IN_WEEK } from '@/common/constants/weekdays'
import { getWeekDays } from '../utils/week-days'
import { isSameJalaliDay, toIsoDateKey } from '@widget/calendar/utils/jalali-date'

function day(iso: string) {
	return jalaliMoment(iso, 'YYYY-MM-DD').locale('fa')
}

describe('getWeekDays', () => {
	it('returns seven consecutive days', () => {
		const week = getWeekDays(day('2026-09-14'))

		expect(week).toHaveLength(DAYS_IN_WEEK)
		for (let i = 1; i < week.length; i++) {
			expect(week[i].diff(week[i - 1], 'days')).toBe(1)
		}
	})

	it('starts the week on Saturday for any day inside it', () => {
		for (let offset = 0; offset < DAYS_IN_WEEK; offset++) {
			const week = getWeekDays(day('2026-09-12').add(offset, 'days'))

			expect(week[0].day()).toBe(6)
		}
	})

	it('gives every day of a week the same seven days', () => {
		const fromSaturday = getWeekDays(day('2026-09-12')).map(toIsoDateKey)

		for (let offset = 1; offset < DAYS_IN_WEEK; offset++) {
			const fromOtherDay = getWeekDays(day('2026-09-12').add(offset, 'days')).map(
				toIsoDateKey
			)

			expect(fromOtherDay).toEqual(fromSaturday)
		}
	})

	it('contains the reference day itself', () => {
		const reference = day('2026-09-14')
		const keys = getWeekDays(reference).map(toIsoDateKey)

		expect(keys).toContain(toIsoDateKey(reference))
	})

	it('does not mutate the date it is given', () => {
		const reference = day('2026-09-14')
		const before = toIsoDateKey(reference)

		getWeekDays(reference)

		expect(toIsoDateKey(reference)).toBe(before)
	})
})

describe('toIsoDateKey', () => {
	it('formats in gregorian latin digits so it can key a map', () => {
		expect(toIsoDateKey(day('2026-09-14'))).toBe('2026-09-14')
	})
})

describe('isSameJalaliDay', () => {
	it('matches the same day', () => {
		expect(isSameJalaliDay(day('2026-09-14'), day('2026-09-14'))).toBe(true)
	})

	it('separates neighbouring days', () => {
		expect(isSameJalaliDay(day('2026-09-14'), day('2026-09-15'))).toBe(false)
	})
})
