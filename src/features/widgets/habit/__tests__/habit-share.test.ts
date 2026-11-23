import { describe, expect, it } from 'bun:test'
import { type Habit, HabitComparison } from '@/services/habit/habit.interface'
import { shiftDay } from '../utils/habit-calendar'
import { habitShareData } from '../utils/habit-share'

const TODAY = '2026-11-14'

function habit(
	marks: [number, number, boolean][],
	overrides: Partial<Habit> = {}
): Habit {
	const calendarData: Habit['calendarData'] = {}

	for (const [daysAgo, value, isDone] of marks) {
		const key = shiftDay(TODAY, -daysAgo)
		const month = key.slice(0, 7)

		calendarData[month] = { ...calendarData[month], [key]: { value, isDone } }
	}

	return {
		target: 4,
		comparison: HabitComparison.AT_LEAST,
		today: { date: '', value: 0, isDone: false },
		calendarData,
		...overrides,
	} as Habit
}

describe('habitShareData', () => {
	it('exports the preceding Jalali month with its own end-of-month streak', () => {
		const data = habitShareData(
			habit([
				[23, 4, true],
				[24, 4, true],
				[0, 4, true],
			]),
			TODAY,
			1
		)
		expect(data.month).toHaveLength(30)
		expect(data.daysSoFar).toBe(30)
		expect(data.month.slice(-2)).toEqual(['done', 'done'])
		expect(data.streak).toBe(2)
		expect(data.isCurrentMonth).toBe(false)
		expect(data.monthLabel).toContain('مهر')
	})

	it('shows each day of the current Jalali month and marks future days', () => {
		const data = habitShareData(habit([]), TODAY)

		expect(data.month).toHaveLength(30)
		expect(data.daysSoFar).toBe(23)
		expect(data.month.slice(21, 24)).toEqual(['open', 'open', 'future'])
		expect(data.streak).toBe(0)
	})

	it('counts the streak and the successful days', () => {
		const data = habitShareData(
			habit([
				[0, 4, true],
				[1, 4, true],
				[2, 4, true],
				[5, 4, true],
				[23, 4, true],
				[-1, 4, true],
			]),
			TODAY
		)

		expect(data.streak).toBe(3)
		expect(data.doneThisMonth).toBe(4)
	})

	it('marks only days that met the target or were flagged done', () => {
		const data = habitShareData(
			habit([
				[0, 1, false],
				[1, 2, false],
				[2, 4, true],
				[3, 6, true],
			]),
			TODAY
		)

		expect(data.month.slice(19, 23)).toEqual(['done', 'done', 'open', 'open'])
	})
})
