import { describe, expect, it } from 'bun:test'
import {
	type Habit,
	HabitComparison,
	HabitFrequency,
	HabitUnit,
} from '@/services/habit/habit.interface'
import { resolveHabitStep } from '../utils/habit-step'

function habit(overrides: Partial<Habit>): Habit {
	return {
		id: '1',
		title: 'Walk',
		emoji: null,
		color: null,
		target: 10,
		comparison: HabitComparison.AT_LEAST,
		unit: HabitUnit.MINUTES,
		customUnit: null,
		frequency: HabitFrequency.DAILY,
		frequencyCount: 1,
		sort: 0,
		archivedAt: null,
		today: { date: '2026-01-01', value: 0, isDone: false },
		history: [],
		calendarData: {},
		progressThisPeriod: { done: 0, required: 1 },
		...overrides,
	}
}

describe('resolveHabitStep', () => {
	it('steps by the unit while the target is not reached', () => {
		expect(resolveHabitStep(habit({}), 0)).toEqual({ amount: 5 })
		expect(resolveHabitStep(habit({ unit: HabitUnit.TIMES }), 3)).toEqual({
			amount: 1,
		})
	})

	it('lets an at-least goal go past the target', () => {
		expect(resolveHabitStep(habit({}), 8)).toEqual({ amount: 5 })
	})

	it('stops an at-most goal at the target and says why', () => {
		const step = resolveHabitStep(habit({ comparison: HabitComparison.AT_MOST }), 8)
		expect(step.amount).toBe(0)
		expect(step.blockedMessage).toBe('به سقف هدفت (10) رسیدی')
	})

	it('stops an exact goal at the target without a message', () => {
		expect(resolveHabitStep(habit({ comparison: HabitComparison.EXACT }), 8)).toEqual(
			{
				amount: 0,
			}
		)
	})

	it('lets an at-most goal reach the target exactly', () => {
		expect(
			resolveHabitStep(habit({ comparison: HabitComparison.AT_MOST }), 5)
		).toEqual({ amount: 5 })
	})

	it('steps by one for a unit it does not know', () => {
		expect(
			resolveHabitStep(habit({ unit: 'WEEKS' as HabitUnit, target: 10 }), 0)
		).toEqual({ amount: 1 })
	})

	it('stops an at-most goal with no target after one', () => {
		const step = resolveHabitStep(
			habit({
				target: 0,
				unit: HabitUnit.TIMES,
				comparison: HabitComparison.AT_MOST,
			}),
			1
		)
		expect(step.amount).toBe(0)
		expect(step.blockedMessage).toBe('به سقف هدفت (1) رسیدی')
	})

	it('treats a missing target as one', () => {
		expect(resolveHabitStep(habit({ target: 0, unit: HabitUnit.TIMES }), 0)).toEqual({
			amount: 1,
		})
	})
})
