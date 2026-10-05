import type { Habit } from '@/services/habit/habit.interface'

const WEEKDAY_INITIALS = ['ی', 'د', 'س', 'چ', 'پ', 'ج', 'ش']
const SATURDAY = 6

interface HabitWeekDay {
	key: string
	value: number
	isDone: boolean
	isToday: boolean
	isFuture: boolean
}

export function dayKey(date: string): string {
	return date.slice(0, 10)
}

function toDate(key: string): Date {
	const [year, month, day] = dayKey(key).split('-').map(Number)
	return new Date(year, month - 1, day)
}

function toKey(date: Date): string {
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const day = String(date.getDate()).padStart(2, '0')
	return `${date.getFullYear()}-${month}-${day}`
}

export function weekdayInitial(key: string): string {
	return WEEKDAY_INITIALS[toDate(key).getDay()]
}

export function weekOf(todayKey: string): string[] {
	const today = toDate(todayKey)
	const sinceSaturday = (today.getDay() - SATURDAY + 7) % 7
	return Array.from({ length: 7 }, (_, index) =>
		toKey(
			new Date(
				today.getFullYear(),
				today.getMonth(),
				today.getDate() - sinceSaturday + index
			)
		)
	)
}

export function habitWeek(
	habit: Pick<Habit, 'target' | 'today' | 'history'>,
	week: string[],
	todayKey: string
): HabitWeekDay[] {
	const target = habit.target || 1
	const byDay = new Map(habit.history.map((day) => [dayKey(day.date), day]))

	return week.map((key) => {
		const day = key === todayKey ? habit.today : byDay.get(key)
		const value = day?.value ?? 0
		return {
			key,
			value,
			isDone: Boolean(day?.isDone) || value >= target,
			isToday: key === todayKey,
			isFuture: key > todayKey,
		}
	})
}
