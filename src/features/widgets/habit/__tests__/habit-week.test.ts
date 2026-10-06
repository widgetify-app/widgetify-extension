import { describe, expect, it } from 'bun:test'
import { dayKey, habitWeek, weekdayInitial, weekOf } from '../utils/habit-week'

const MONDAY = '2026-10-05'
const WEEK = [
	'2026-10-03',
	'2026-10-04',
	'2026-10-05',
	'2026-10-06',
	'2026-10-07',
	'2026-10-08',
	'2026-10-09',
]

describe('dayKey', () => {
	it('keeps a plain date as it is', () => {
		expect(dayKey('2026-10-05')).toBe('2026-10-05')
	})

	it('drops the time from a full timestamp', () => {
		expect(dayKey('2026-10-05T00:00:00.000Z')).toBe('2026-10-05')
	})
})

describe('weekdayInitial', () => {
	it('names each day of a week from Saturday to Friday', () => {
		expect(WEEK.map(weekdayInitial)).toEqual(['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'])
	})
})

describe('weekOf', () => {
	it('starts the week on the Saturday before today', () => {
		expect(weekOf(MONDAY)).toEqual(WEEK)
	})

	it('starts on today when today is Saturday', () => {
		expect(weekOf('2026-10-03')).toEqual(WEEK)
	})

	it('still belongs to the same week on Friday', () => {
		expect(weekOf('2026-10-09')).toEqual(WEEK)
	})

	it('crosses a month and a year', () => {
		expect(weekOf('2027-01-01')).toEqual([
			'2026-12-26',
			'2026-12-27',
			'2026-12-28',
			'2026-12-29',
			'2026-12-30',
			'2026-12-31',
			'2027-01-01',
		])
	})
})

describe('habitWeek', () => {
	const habit = {
		target: 2,
		today: { date: MONDAY, value: 1, isDone: false },
		history: [
			{ date: '2026-10-04T00:00:00.000Z', value: 2, isDone: true },
			{ date: '2026-10-03', value: 1, isDone: false },
			{ date: MONDAY, value: 0, isDone: false },
		],
	}

	it('finds each day by its date, whatever order the history comes in', () => {
		const days = habitWeek(habit, WEEK, MONDAY)

		expect(days[0]).toMatchObject({ key: '2026-10-03', value: 1, isDone: false })
		expect(days[1]).toMatchObject({ key: '2026-10-04', value: 2, isDone: true })
	})

	it('takes today from the live value, not the history', () => {
		expect(habitWeek(habit, WEEK, MONDAY)[2]).toMatchObject({
			value: 1,
			isToday: true,
			isFuture: false,
		})
	})

	it('marks the days after today as not yet reached', () => {
		const days = habitWeek(habit, WEEK, MONDAY)

		expect(days.slice(3).every((day) => day.isFuture && day.value === 0)).toBe(true)
	})

	it('counts a day as done once it reaches the target', () => {
		const days = habitWeek(
			{ ...habit, history: [{ date: '2026-10-03', value: 2, isDone: false }] },
			WEEK,
			MONDAY
		)

		expect(days[0].isDone).toBe(true)
	})
})
