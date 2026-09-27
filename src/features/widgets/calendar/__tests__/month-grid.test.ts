import { describe, expect, it } from 'bun:test'
import { DAYS_IN_WEEK } from '@/common/constants/weekdays'
import { buildMonthGrid, WEEKS_IN_GRID } from '../utils/month-grid'

const LEADING_RANGE = [0, 1, 2, 3, 4, 5, 6]
const MONTH_LENGTHS = [29, 30, 31]

describe('buildMonthGrid', () => {
	it('always fills six weeks so the widget height never shifts between months', () => {
		for (const leading of LEADING_RANGE) {
			for (const daysInMonth of MONTH_LENGTHS) {
				const weeks = buildMonthGrid(leading, daysInMonth, 30)

				expect(weeks).toHaveLength(WEEKS_IN_GRID)
				expect(weeks.flat()).toHaveLength(WEEKS_IN_GRID * DAYS_IN_WEEK)
			}
		}
	})

	it('gives every row exactly seven cells', () => {
		for (const leading of LEADING_RANGE) {
			for (const daysInMonth of MONTH_LENGTHS) {
				for (const week of buildMonthGrid(leading, daysInMonth, 30)) {
					expect(week).toHaveLength(DAYS_IN_WEEK)
				}
			}
		}
	})

	it('lists every day of the month exactly once, in order', () => {
		const weeks = buildMonthGrid(3, 30, 31)
		const inMonth = weeks.flat().filter((cell) => cell.inMonth)

		expect(inMonth.map((cell) => cell.day)).toEqual(
			Array.from({ length: 30 }, (_, i) => i + 1)
		)
	})

	it('ends the leading run on the last day of the previous month', () => {
		const leading = buildMonthGrid(3, 30, 31).flat().slice(0, 3)

		expect(leading.map((cell) => cell.day)).toEqual([29, 30, 31])
		expect(leading.every((cell) => !cell.inMonth)).toBe(true)
	})

	it('starts the trailing run at the first day of the next month', () => {
		const trailing = buildMonthGrid(1, 31, 30)
			.flat()
			.slice(1 + 31)

		expect(trailing.map((cell) => cell.day)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
		expect(trailing.every((cell) => !cell.inMonth)).toBe(true)
	})

	it('puts the first day of the month in the column the month starts on', () => {
		for (const leading of LEADING_RANGE) {
			const firstWeek = buildMonthGrid(leading, 31, 30)[0]

			expect(firstWeek[leading]).toEqual({ day: 1, inMonth: true })
		}
	})
})
