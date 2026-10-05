import { HabitFrequency, HabitUnit, type Habit } from '@/services/habit/habit.interface'

const unitLabels: Record<HabitUnit, string> = {
	[HabitUnit.TIMES]: 'دفعه',
	[HabitUnit.MINUTES]: 'دقیقه',
	[HabitUnit.HOURS]: 'ساعت',
	[HabitUnit.PAGES]: 'صفحه',
	[HabitUnit.GLASSES]: 'لیوان',
	[HabitUnit.CUSTOM]: '',
}

const comparisonLabels: Record<Habit['comparison'], string> = {
	AT_LEAST: 'حداقل',
	AT_MOST: 'حداکثر',
	EXACT: 'دقیقاً',
}

const frequencyLabels: Record<HabitFrequency, string> = {
	[HabitFrequency.DAILY]: 'روزانه',
	[HabitFrequency.WEEKLY]: 'هفته',
	[HabitFrequency.MONTHLY]: 'ماه',
}

export function getHabitUnitLabel(habit: Habit): string {
	if (habit.unit === HabitUnit.CUSTOM) {
		return habit.customUnit || ''
	}
	return unitLabels[habit.unit] || ''
}

export function formatHabitGoal(habit: Habit): string {
	const unitLabel = getHabitUnitLabel(habit)
	const base =
		`${comparisonLabels[habit.comparison]} ${habit.target} ${unitLabel}`.trim()

	if (habit.frequency === HabitFrequency.DAILY) {
		return `${base} در روز`
	}

	return `${base} · ${habit.progressThisPeriod.done} از ${habit.progressThisPeriod.required} بار در ${frequencyLabels[habit.frequency]}`
}

export function isHabitDoneToday(habit: Habit): boolean {
	return habit.today.isDone || habit.today.value >= (habit.target || 1)
}

export function formatHabitToday(habit: Habit): string {
	const target = habit.target || 1
	const unitLabel = getHabitUnitLabel(habit)

	if (isHabitDoneToday(habit)) {
		const amount = `${target} ${unitLabel}`.trim()
		return target === 1 ? 'انجام شد' : `${amount} · انجام شد`
	}
	if (habit.today.value === 0) return 'امروز هنوز نه'
	return `${habit.today.value} از ${target} ${unitLabel}`.trim()
}
