import type { CreateHabitInput } from '@/services/hooks/habit/habit.interface'
import {
	HabitComparison,
	HabitFrequency,
	HabitUnit,
} from '@/services/hooks/habit/habit.interface'

export interface HabitPresetItem {
	id: string
	label: string
	emoji: string
	color: string
	values: CreateHabitInput
}

export const HABIT_QUICK_PRESETS: HabitPresetItem[] = [
	{
		id: 'water',
		label: '۸ لیوان آب',
		emoji: '💧',
		color: '#3b82f6',
		values: {
			title: 'نوشیدن آب',
			emoji: '💧',
			color: '#3b82f6',
			comparison: HabitComparison.AT_LEAST,
			unit: HabitUnit.GLASSES,
			target: 8,
			frequency: HabitFrequency.DAILY,
			frequencyCount: 1,
		},
	},
	{
		id: 'walk',
		label: '۳ کیلومتر پیاده‌روی',
		emoji: '🏃',
		color: '#f97316',
		values: {
			title: 'پیاده‌روی',
			emoji: '🏃',
			color: '#f97316',
			comparison: HabitComparison.AT_LEAST,
			unit: HabitUnit.CUSTOM,
			customUnit: 'کیلومتر',
			target: 3,
			frequency: HabitFrequency.DAILY,
			frequencyCount: 1,
		},
	},
	{
		id: 'book',
		label: '۲۰ صفحه کتاب',
		emoji: '📖',
		color: '#06b6d4',
		values: {
			title: 'مطالعه کتاب',
			emoji: '📖',
			color: '#06b6d4',
			comparison: HabitComparison.AT_LEAST,
			unit: HabitUnit.PAGES,
			target: 20,
			frequency: HabitFrequency.DAILY,
			frequencyCount: 1,
		},
	},
	{
		id: 'meditation',
		label: 'مدیتیشن',
		emoji: '🧘',
		color: '#8b5cf6',
		values: {
			title: 'مدیتیشن و تنفس',
			emoji: '🧘',
			color: '#8b5cf6',
			comparison: HabitComparison.AT_LEAST,
			unit: HabitUnit.MINUTES,
			target: 15,
			frequency: HabitFrequency.DAILY,
			frequencyCount: 1,
		},
	},
]

export interface EmojiCategory {
	id: string
	label: string
	emojis: string[]
}

export const HABIT_EMOJI_CATEGORIES: EmojiCategory[] = [
	{
		id: 'health',
		label: 'سلامتی',
		emojis: ['💧', '🥗', '💊', '😴', '🧘', '🦷', '🚭'],
	},
	{
		id: 'sport',
		label: 'ورزش',
		emojis: ['🏃', '🚴', '🏋️', '🏊', '⚽', '🤸', '🧗'],
	},
	{
		id: 'study',
		label: 'مطالعه',
		emojis: ['📖', '✍️', '💻', '🎨', '🧠', '🎧', '🎯'],
	},
	{
		id: 'lifestyle',
		label: 'سبک زندگی',
		emojis: ['☕', '🍵', '🧹', '🪴', '🍎', '🚶', '✨'],
	},
]
