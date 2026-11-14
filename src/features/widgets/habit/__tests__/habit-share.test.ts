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
	it('draws 26 weeks of 7 days, Saturday first', () => {
		const data = habitShareData(habit([]), TODAY)

		expect(data.weeks).toHaveLength(26)
		expect(data.weeks.every((week) => week.length === 7)).toBe(true)
		expect(data.weeks[25][0].isFuture).toBe(false)
		expect(data.weeks[25][1].isFuture).toBe(true)
	})

	it('counts the streak and the successful days', () => {
		const data = habitShareData(
			habit([
				[0, 4, true],
				[1, 4, true],
				[2, 4, true],
				[5, 4, true],
			]),
			TODAY
		)

		expect(data.streak).toBe(3)
		expect(data.doneDays).toBe(4)
	})

	it('shades a day by how much of the target was reached', () => {
		const data = habitShareData(
			habit([
				[0, 1, false],
				[1, 2, false],
				[2, 4, true],
				[3, 6, true],
			]),
			TODAY
		)

		const levels = data.weeks
			.flat()
			.filter((cell) => !cell.isFuture)
			.slice(-4)
			.map((cell) => cell.level)

		expect(levels).toEqual([4, 3, 2, 1])
	})
})
