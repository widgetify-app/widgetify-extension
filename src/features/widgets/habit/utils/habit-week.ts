const WEEKDAY_INITIALS = ['ی', 'د', 'س', 'چ', 'پ', 'ج', 'ش']

export function dayKey(date: string): string {
	return date.slice(0, 10)
}

export function weekdayInitial(date: string): string {
	const [year, month, day] = dayKey(date).split('-').map(Number)
	return WEEKDAY_INITIALS[new Date(year, month - 1, day).getDay()]
}
