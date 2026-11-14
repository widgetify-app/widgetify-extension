import type { Habit } from '@/services/habit/habit.interface'
import { daysSinceSaturday, habitDayReader, habitStats, shiftDay } from './habit-calendar'

const SHARE_WEEKS = 26

interface ShareCell {
	level: number
	isFuture: boolean
}

export interface HabitShareData {
	weeks: ShareCell[][]
	streak: number
	doneDays: number
}

export function habitShareData(habit: Habit, todayKey: string): HabitShareData {
	const { outcomeOn } = habitDayReader(habit, todayKey)
	const first = shiftDay(todayKey, -daysSinceSaturday(todayKey) - (SHARE_WEEKS - 1) * 7)

	const weeks = Array.from({ length: SHARE_WEEKS }, (_, week) =>
		Array.from({ length: 7 }, (_, offset) => {
			const key = shiftDay(first, week * 7 + offset)

			return { level: outcomeOn(key).level, isFuture: key > todayKey }
		})
	)

	const stats = habitStats(habit, todayKey)

	return { weeks, streak: stats.currentStreak, doneDays: stats.totalCompleted }
}
