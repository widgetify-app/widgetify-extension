import { t } from '@/common/i18n'
export const HABIT_UNIT_OPTIONS = [
	{ value: 'TIMES', label: t('widgets.habit.unit.times') },
	{ value: 'MINUTES', label: t('widgets.habit.unit.minutes') },
	{ value: 'HOURS', label: t('widgets.habit.unit.hours') },
	{ value: 'PAGES', label: t('widgets.habit.unit.pages') },
	{ value: 'GLASSES', label: t('widgets.habit.unit.glasses') },
	{ value: 'CUSTOM', label: t('widgets.habit.unit.custom') },
]

export const HABIT_COMPARISON_OPTIONS = [
	{
		value: 'AT_LEAST',
		label: t('widgets.habit.form.goalAtLeast'),
	},
	{ value: 'AT_MOST', label: t('widgets.habit.unit.atMost') },
	{ value: 'EXACT', label: t('widgets.habit.unit.exactly') },
]

export const HABIT_FREQUENCY_OPTIONS = [
	{ value: 'DAILY', label: t('widgets.habit.unit.daily') },
	{ value: 'WEEKLY', label: t('widgets.habit.unit.weekly') },
	{ value: 'MONTHLY', label: t('widgets.habit.unit.monthly') },
]

export const DEFAULT_HABIT_COLOR = '#536dfe'

export const HABIT_COLOR_PRESETS = [
	'#ef4444',
	'#f97316',
	'#f59e0b',
	'#22c55e',
	'#06b6d4',
	'#3b82f6',
	'#8b5cf6',
	'#ec4899',
]

export const HABIT_EMOJI_PRESETS = [
	'🎯',
	'💧',
	'📖',
	'🏃',
	'🧘',
	'🥗',
	'😴',
	'✍️',
	'💪',
	'🚭',
]

export const HABIT_UNIT_STEP: Record<string, number> = {
	TIMES: 1,
	GLASSES: 1,
	PAGES: 1,
	MINUTES: 5,
	HOURS: 1,
	CUSTOM: 1,
}
