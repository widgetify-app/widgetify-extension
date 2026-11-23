import { type Habit, HabitComparison } from '@/services/habit/habit.interface'
import { dayKey } from './habit-week'
import { computeHabitStats } from './habit-stats'

type HabitLevel = 0 | 1 | 2 | 3 | 4

interface Mark {
	value: number
	isDone: boolean
}

interface HabitDayOutcome {
	value: number
	isDone: boolean
	level: HabitLevel
}

const FAR_FUTURE = '9999-12-31'
const DAY_MS = 86_400_000

function toUtc(key: string): number {
	const [year, month, day] = key.split('-').map(Number)

	return Date.UTC(year, month - 1, day)
}

function fromUtc(time: number): string {
	return new Date(time).toISOString().slice(0, 10)
}

export function shiftDay(key: string, days: number): string {
	return fromUtc(toUtc(key) + days * DAY_MS)
}

function habitGoal(habit: Habit): number {
	return Math.max(habit.target, 1)
}

function marksOf(habit: Habit): Record<string, Mark> {
	const marks: Record<string, Mark> = {}

	for (const month of Object.values(habit.calendarData ?? {})) {
		Object.assign(marks, month)
	}

	return marks
}

function isTodayCurrent(habit: Habit, todayKey: string): boolean {
	const date = dayKey(habit.today.date)

	return date === todayKey || date === ''
}

function todayValue(habit: Habit, todayKey: string): number {
	return isTodayCurrent(habit, todayKey) ? habit.today.value : 0
}

function loggingStart(habit: Habit, marks: Record<string, Mark>, todayKey: string) {
	let start = todayValue(habit, todayKey) > 0 ? todayKey : FAR_FUTURE

	for (const [key, mark] of Object.entries(marks)) {
		if (mark.value > 0 && key < start) start = key
	}

	return start
}

function levelOf(habit: Habit, value: number, isDone: boolean): HabitLevel {
	if (habit.comparison === HabitComparison.AT_MOST) return isDone ? 3 : 0

	if (value <= 0) return 0

	const share = value / habitGoal(habit)

	if (share >= 1.5) return 4
	if (share >= 1) return 3
	if (share >= 0.5) return 2

	return 1
}

export function habitDayReader(habit: Habit, todayKey: string) {
	const marks = marksOf(habit)
	const start = loggingStart(habit, marks, todayKey)
	const goal = habitGoal(habit)

	function outcomeOn(key: string): HabitDayOutcome {
		const mark = marks[key]
		const isToday = key === todayKey
		const value = mark?.value ?? (isToday ? todayValue(habit, todayKey) : 0)

		const flaggedDone = mark
			? mark.isDone
			: isToday && isTodayCurrent(habit, todayKey) && habit.today.isDone

		let isDone = flaggedDone || value >= goal

		if (habit.comparison === HabitComparison.AT_MOST) {
			isDone = flaggedDone && key >= start
		}

		return { value, isDone, level: levelOf(habit, value, isDone) }
	}

	return { outcomeOn, marks }
}

export function habitStats(habit: Habit, todayKey: string) {
	const { outcomeOn, marks } = habitDayReader(habit, todayKey)
	let first = todayKey

	for (const key of Object.keys(marks)) {
		if (key < first) first = key
	}

	const days: { isDone: boolean }[] = []

	for (let key = first; key <= todayKey; key = shiftDay(key, 1)) {
		days.push({ isDone: outcomeOn(key).isDone })
	}

	return computeHabitStats(days)
}
