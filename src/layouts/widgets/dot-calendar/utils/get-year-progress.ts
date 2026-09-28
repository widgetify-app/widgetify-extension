import jalaliMoment from 'jalali-moment'
import type { YearProgress } from '../types'

export function getYearProgress(today: jalaliMoment.Moment): YearProgress {
	const year = today.jYear()
	const totalDays = jalaliMoment.jIsLeapYear(year) ? 366 : 365
	const passedDays = today.jDayOfYear() - 1

	return {
		year,
		totalDays,
		passedDays,
		daysLeft: totalDays - passedDays,
	}
}
