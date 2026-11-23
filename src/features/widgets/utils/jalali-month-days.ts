import jalaliMoment from 'jalali-moment'
import { toIsoDateKey } from './jalali-date'

export function jalaliMonthDays(year: number, month: number): string[] {
	const date = jalaliMoment(`${year}/${month}/1`, 'jYYYY/jM/jD')
	return Array.from({ length: date.jDaysInMonth() }, (_, index) =>
		toIsoDateKey(date.clone().add(index, 'day'))
	)
}
