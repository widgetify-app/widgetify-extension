import type jalaliMoment from 'jalali-moment'

const DUE_HOUR = 12

export function toTodoDueDate(date: jalaliMoment.Moment): string {
	return date.clone().startOf('day').add(DUE_HOUR, 'hours').toISOString()
}
