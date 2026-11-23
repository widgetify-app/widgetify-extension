import jalaliMoment from 'jalali-moment'
import { jalaliMonthDays } from '@/features/widgets/utils/jalali-month-days'
import type { Habit } from '@/services/habit/habit.interface'
import { habitDayReader, habitStats } from './habit-calendar'

export type ShareDayState = 'done' | 'open' | 'future'

export interface HabitShareData {
	month: ShareDayState[]
	monthLabel: string
	isCurrentMonth: boolean
	doneThisMonth: number
	daysSoFar: number
	streak: number
}

export function habitShareData(
	habit: Habit,
	todayKey: string,
	monthsBack = 0
): HabitShareData {
	const today = jalaliMoment(todayKey, 'YYYY-MM-DD', 'en')
	const selected = today.clone().jDate(1).subtract(monthsBack, 'jMonth')
	const days = jalaliMonthDays(selected.jYear(), selected.jMonth() + 1)
	const endKey = monthsBack === 0 ? todayKey : days[days.length - 1]
	const { outcomeOn } = habitDayReader(habit, todayKey)

	const month = days.map((key): ShareDayState => {
		if (key > todayKey) return 'future'
		return outcomeOn(key).isDone ? 'done' : 'open'
	})

	return {
		month,
		monthLabel: selected.clone().locale('fa').format('jMMMM jYYYY'),
		isCurrentMonth: monthsBack === 0,
		doneThisMonth: month.filter((state) => state === 'done').length,
		daysSoFar: monthsBack === 0 ? today.jDate() : days.length,
		streak: habitStats(habit, todayKey, endKey).currentStreak,
	}
}
