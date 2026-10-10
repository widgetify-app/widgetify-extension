import moment from 'jalali-moment'

const SATURDAY_FIRST = [6, 0, 1, 2, 3, 4, 5]

interface MonthCell {
	day: number | null
	isToday: boolean
	isFriday: boolean
}

export function jalaliMonthCells(now: Date): MonthCell[] {
	const today = moment(now)
	const offset = (today.clone().startOf('jMonth').day() + 1) % 7
	const length = today.jDaysInMonth()
	const count = Math.ceil((offset + length) / 7) * 7
	return Array.from({ length: count }, (_, index) => {
		const day = index - offset + 1
		const inMonth = day >= 1 && day <= length
		return {
			day: inMonth ? day : null,
			isToday: inMonth && day === today.jDate(),
			isFriday: index % 7 === 6,
		}
	})
}

export function jalaliWeekdayInitials(): string[] {
	const initials = moment.localeData('fa').weekdaysMin()
	return SATURDAY_FIRST.map((index) => initials[index])
}

export function jalaliDateParts(now: Date) {
	const part = (options: Intl.DateTimeFormatOptions) =>
		new Intl.DateTimeFormat('fa-IR', options).format(now)
	return {
		weekday: part({ weekday: 'long' }),
		day: part({ day: 'numeric' }),
		month: part({ month: 'long' }),
		year: part({ year: 'numeric' }),
	}
}
