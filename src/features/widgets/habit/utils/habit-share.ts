import jalaliMoment from 'jalali-moment'
import { jalaliMonthDays } from '@/features/widgets/utils/jalali-month-days'
import type { Habit } from '@/services/habit/habit.interface'
import { habitDayReader, habitStats } from './habit-calendar'

export type ShareDayState = 'done' | 'open' | 'future'

export interface HabitShareData {
	month: ShareDayState[]
	doneThisMonth: number
	daysSoFar: number
	streak: number
}

export function habitShareData(habit: Habit, todayKey: string): HabitShareData {
	const today = jalaliMoment(todayKey, 'YYYY-MM-DD', 'en')
	const days = jalaliMonthDays(today.jYear(), today.jMonth() + 1)
	const { outcomeOn } = habitDayReader(habit, todayKey)

	const month = days.map((key): ShareDayState => {
		if (key > todayKey) return 'future'
		return outcomeOn(key).isDone ? 'done' : 'open'
	})

	return {
		month,
		doneThisMonth: month.filter((state) => state === 'done').length,
		daysSoFar: today.jDate(),
		streak: habitStats(habit, todayKey).currentStreak,
	}
}
