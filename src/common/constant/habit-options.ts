export const HABIT_UNIT_OPTIONS = [
	{ value: 'TIMES', label: 'دفعه' },
	{ value: 'MINUTES', label: 'دقیقه' },
	{ value: 'HOURS', label: 'ساعت' },
	{ value: 'PAGES', label: 'صفحه' },
	{ value: 'GLASSES', label: 'لیوان' },
	{ value: 'CUSTOM', label: 'دلخواه' },
]

export const HABIT_COMPARISON_OPTIONS = [
	{ value: 'AT_LEAST', label: 'حداقل' },
	{ value: 'AT_MOST', label: 'حداکثر' },
	{ value: 'EXACT', label: 'دقیقا' },
]

export const HABIT_FREQUENCY_OPTIONS = [
	{ value: 'DAILY', label: 'روزانه' },
	{ value: 'WEEKLY', label: 'هفتگی' },
	{ value: 'MONTHLY', label: 'ماهانه' },
]

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