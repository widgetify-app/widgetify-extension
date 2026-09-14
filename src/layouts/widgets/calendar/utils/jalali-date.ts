import type jalaliMoment from 'jalali-moment'

export function toIsoDateKey(date: jalaliMoment.Moment): string {
	return date.clone().locale('en').format('YYYY-MM-DD')
}

export function isSameJalaliDay(
	a: jalaliMoment.Moment,
	b: jalaliMoment.Moment
): boolean {
	return a.jDate() === b.jDate() && a.jMonth() === b.jMonth() && a.jYear() === b.jYear()
}
