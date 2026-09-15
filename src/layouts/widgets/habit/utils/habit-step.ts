import { HABIT_UNIT_STEP } from '@/common/constants/habit-options'
import {
	HabitComparison,
	type Habit,
} from '@/services/hooks/habit/habit.interface'

export interface HabitStep {
	amount: number
	blockedMessage?: string
}

export function resolveHabitStep(habit: Habit, currentValue: number): HabitStep {
	const target = habit.target || 1
	const amount = HABIT_UNIT_STEP[habit.unit] || 1

	if (currentValue + amount <= target) {
		return { amount }
	}

	if (habit.comparison === HabitComparison.AT_MOST) {
		return {
			amount: 0,
			blockedMessage: `مقدار فعلی به حداکثر هدف (${target}) رسیده است.`,
		}
	}

	if (habit.comparison === HabitComparison.EXACT) {
		return { amount: 0 }
	}

	return { amount }
}
