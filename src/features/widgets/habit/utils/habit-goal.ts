import { t } from '@/common/i18n'
import { HabitFrequency, HabitUnit, type Habit } from '@/services/habit/habit.interface'

const unitLabels: Record<HabitUnit, string> = {
	[HabitUnit.TIMES]: t('widgets.habit.unit.times'),
	[HabitUnit.MINUTES]: t('widgets.habit.unit.minutes'),
	[HabitUnit.HOURS]: t('widgets.habit.unit.hours'),
	[HabitUnit.PAGES]: t('widgets.habit.unit.pages'),
	[HabitUnit.GLASSES]: t('widgets.habit.unit.glasses'),
	[HabitUnit.CUSTOM]: '',
}

const comparisonLabels: Record<Habit['comparison'], string> = {
	AT_LEAST: t('widgets.habit.form.goalAtLeast'),
	AT_MOST: t('widgets.habit.unit.atMost'),
	EXACT: t('widgets.habit.unit.exactly'),
}

const frequencyLabels: Record<HabitFrequency, string> = {
	[HabitFrequency.DAILY]: t('widgets.habit.unit.daily'),
	[HabitFrequency.WEEKLY]: t('widgets.habit.goal.week'),
	[HabitFrequency.MONTHLY]: t('widgets.habit.goal.month'),
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
		return t('widgets.habit.goal.perDay', { p0: base })
	}

	return t('widgets.habit.goal.progressInPeriod', {
		p0: base,
		p1: habit.progressThisPeriod.done,
		p2: habit.progressThisPeriod.required,
		p3: frequencyLabels[habit.frequency],
	})
}

export function isHabitDoneToday(habit: Habit): boolean {
	return habit.today.isDone || habit.today.value >= (habit.target || 1)
}

export function formatHabitToday(habit: Habit): string {
	const target = habit.target || 1
	const unitLabel = getHabitUnitLabel(habit)

	if (isHabitDoneToday(habit)) {
		const amount = `${target} ${unitLabel}`.trim()
		return target === 1
			? t('widgets.habit.detail.chart.done')
			: t('widgets.habit.goal.done', { p0: amount })
	}
	if (habit.today.value === 0) return t('widgets.habit.goal.notToday')
	return t('widgets.habit.item.progressOf', {
		p0: habit.today.value,
		p1: target,
		p2: unitLabel,
	}).trim()
}
