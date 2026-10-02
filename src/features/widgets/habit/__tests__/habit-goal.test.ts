import { describe, expect, it } from 'bun:test'
import {
	type Habit,
	HabitComparison,
	HabitFrequency,
	HabitUnit,
} from '@/services/habit/habit.interface'
import { formatHabitGoal, getHabitUnitLabel } from '../utils/habit-goal'

function habit(overrides: Partial<Habit> = {}): Habit {
	return {
		id: '1',
		title: 'Read',
		emoji: null,
		color: null,
		target: 5,
		comparison: HabitComparison.AT_LEAST,
		unit: HabitUnit.PAGES,
		customUnit: null,
		frequency: HabitFrequency.DAILY,
		frequencyCount: 1,
		sort: 0,
		archivedAt: null,
		today: { date: '2026-01-01', value: 0, isDone: false },
		history: [],
		calendarData: {},
		progressThisPeriod: { done: 2, required: 3 },
		...overrides,
	}
}

describe('getHabitUnitLabel', () => {
	it('names the built in units in Persian', () => {
		expect(getHabitUnitLabel(habit({ unit: HabitUnit.PAGES }))).toBe('صفحه')
		expect(getHabitUnitLabel(habit({ unit: HabitUnit.GLASSES }))).toBe('لیوان')
	})

	it('uses the name the user typed for a custom unit, or nothing', () => {
		expect(
			getHabitUnitLabel(habit({ unit: HabitUnit.CUSTOM, customUnit: 'کیلومتر' }))
		).toBe('کیلومتر')
		expect(
			getHabitUnitLabel(habit({ unit: HabitUnit.CUSTOM, customUnit: null }))
		).toBe('')
	})
})

describe('formatHabitGoal', () => {
	it('says a daily goal with the comparison, the amount and the unit', () => {
		expect(formatHabitGoal(habit())).toBe('حداقل 5 صفحه در روز')
		expect(formatHabitGoal(habit({ comparison: HabitComparison.AT_MOST }))).toBe(
			'حداکثر 5 صفحه در روز'
		)
		expect(formatHabitGoal(habit({ comparison: HabitComparison.EXACT }))).toBe(
			'دقیقا 5 صفحه در روز'
		)
	})

	it('adds the progress of the period for a weekly or monthly goal', () => {
		expect(formatHabitGoal(habit({ frequency: HabitFrequency.WEEKLY }))).toBe(
			'حداقل 5 صفحه · 2 از 3 بار در هفته'
		)
		expect(formatHabitGoal(habit({ frequency: HabitFrequency.MONTHLY }))).toBe(
			'حداقل 5 صفحه · 2 از 3 بار در ماه'
		)
	})

	it('leaves no trailing space when the unit is empty', () => {
		expect(formatHabitGoal(habit({ unit: HabitUnit.CUSTOM, customUnit: null }))).toBe(
			'حداقل 5 در روز'
		)
	})
})
