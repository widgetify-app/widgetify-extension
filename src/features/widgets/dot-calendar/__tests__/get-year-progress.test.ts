import { describe, expect, it } from 'bun:test'
import jalaliMoment from 'jalali-moment'
import { getYearProgress } from '../utils/get-year-progress'

function jalaliDay(value: string) {
	return jalaliMoment.from(value, 'fa', 'YYYY/MM/DD').locale('fa')
}

describe('getYearProgress', () => {
	it('starts the year with no passed days and the whole year left', () => {
		const progress = getYearProgress(jalaliDay('1404/01/01'))

		expect(progress.year).toBe(1404)
		expect(progress.passedDays).toBe(0)
		expect(progress.daysLeft).toBe(progress.totalDays)
	})

	it('counts the 31 day first half and 30 day second half of the year', () => {
		expect(getYearProgress(jalaliDay('1404/02/01')).passedDays).toBe(31)
		expect(getYearProgress(jalaliDay('1404/07/01')).passedDays).toBe(186)
	})

	it('leaves exactly one day on the last day of the year', () => {
		const progress = getYearProgress(jalaliDay('1404/12/29'))

		expect(progress.daysLeft).toBe(progress.totalDays - progress.passedDays)
		expect(progress.passedDays).toBe(progress.totalDays - 1)
	})

	it('uses 366 days in a leap year and 365 otherwise', () => {
		expect(getYearProgress(jalaliDay('1403/01/01')).totalDays).toBe(366)
		expect(getYearProgress(jalaliDay('1404/01/01')).totalDays).toBe(365)
	})
})
