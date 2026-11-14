import { describe, expect, it } from 'bun:test'
import { type Habit, HabitComparison } from '@/services/habit/habit.interface'
import { habitDayReader, habitStats, shiftDay } from '../utils/habit-calendar'

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

describe('habitStats', () => {
	it('does not cap a streak at the six months the chart shows', () => {
		const marks: [number, number, boolean][] = Array.from(
			{ length: 300 },
			(_, daysAgo) => [daysAgo, 4, true]
		)

		const stats = habitStats(habit(marks), TODAY)

		expect(stats.currentStreak).toBe(300)
		expect(stats.longestStreak).toBe(300)
	})

	it('finds the best run before the chart window', () => {
		const marks: [number, number, boolean][] = [
			...Array.from({ length: 10 }, (_, i): [number, number, boolean] => [
				300 + i,
				4,
				true,
			]),
			[0, 4, true],
		]

		expect(habitStats(habit(marks), TODAY).longestStreak).toBe(10)
	})

	it('reads today from the habit when the calendar has no mark', () => {
		const stats = habitStats(
			habit([[1, 4, true]], {
				today: { date: TODAY, value: 4, isDone: true },
			}),
			TODAY
		)

		expect(stats.currentStreak).toBe(2)
	})

	it('keeps the streak while today is still open', () => {
		const stats = habitStats(
			habit([
				[1, 4, true],
				[2, 4, true],
			]),
			TODAY
		)

		expect(stats.currentStreak).toBe(2)
	})
})

describe('habitDayReader', () => {
	it('treats a zero target as a goal of one', () => {
		const { outcomeOn } = habitDayReader(habit([[1, 1, false]], { target: 0 }), TODAY)

		expect(outcomeOn(shiftDay(TODAY, -1)).isDone).toBe(true)
	})

	it('ignores a today value that belongs to another date', () => {
		const { outcomeOn } = habitDayReader(
			habit([], { today: { date: '2026-11-13', value: 4, isDone: true } }),
			TODAY
		)

		expect(outcomeOn(TODAY).value).toBe(0)
	})

	it('does not count at-most days before the first log as kept', () => {
		const { outcomeOn } = habitDayReader(
			habit(
				[
					[10, 0, true],
					[2, 1, true],
				],
				{ comparison: HabitComparison.AT_MOST }
			),
			TODAY
		)

		expect(outcomeOn(shiftDay(TODAY, -10)).isDone).toBe(false)
		expect(outcomeOn(shiftDay(TODAY, -2)).isDone).toBe(true)
		expect(outcomeOn(shiftDay(TODAY, -2)).level).toBe(3)
	})
})
