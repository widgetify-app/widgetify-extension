import { DAYS_IN_WEEK } from '@/common/constants/weekdays'

export const WEEKS_IN_GRID = 6

export interface MonthGridCell {
	day: number
	inMonth: boolean
}

export function buildMonthGrid(
	leadingDays: number,
	daysInMonth: number,
	daysInPrevMonth: number
): MonthGridCell[][] {
	const cells: MonthGridCell[] = []

	for (let i = 0; i < leadingDays; i++) {
		cells.push({ day: daysInPrevMonth - leadingDays + 1 + i, inMonth: false })
	}

	for (let day = 1; day <= daysInMonth; day++) {
		cells.push({ day, inMonth: true })
	}

	const trailingDays = DAYS_IN_WEEK * WEEKS_IN_GRID - cells.length
	for (let i = 1; i <= trailingDays; i++) {
		cells.push({ day: i, inMonth: false })
	}

	const weeks: MonthGridCell[][] = []
	for (let start = 0; start < cells.length; start += DAYS_IN_WEEK) {
		weeks.push(cells.slice(start, start + DAYS_IN_WEEK))
	}

	return weeks
}
