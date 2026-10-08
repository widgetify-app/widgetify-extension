import { t } from '@/common/i18n'
import type { CreateHabitInput } from '@/services/habit/habit.interface'
import {
	HabitComparison,
	HabitFrequency,
	HabitUnit,
} from '@/services/habit/habit.interface'

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
		label: t('widgets.habit.preset.waterGoal'),
		emoji: '💧',
		color: '#3b82f6',
		values: {
			title: t('widgets.habit.preset.waterTitle'),
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
		label: t('widgets.habit.preset.walkGoal'),
		emoji: '🏃',
		color: '#f97316',
		values: {
			title: t('widgets.habit.preset.walkTitle'),
			emoji: '🏃',
			color: '#f97316',
			comparison: HabitComparison.AT_LEAST,
			unit: HabitUnit.CUSTOM,
			customUnit: t('widgets.habit.preset.walkUnit'),
			target: 3,
			frequency: HabitFrequency.DAILY,
			frequencyCount: 1,
		},
	},
	{
		id: 'book',
		label: t('widgets.habit.preset.bookGoal'),
		emoji: '📖',
		color: '#06b6d4',
		values: {
			title: t('widgets.habit.preset.bookTitle'),
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
		label: t('widgets.habit.preset.meditationTitle'),
		emoji: '🧘',
		color: '#8b5cf6',
		values: {
			title: t('widgets.habit.preset.meditationDesc'),
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

interface EmojiCategory {
	id: string
	label: string
	emojis: string[]
}

export const HABIT_EMOJI_CATEGORIES: EmojiCategory[] = [
	{
		id: 'health',
		label: t('widgets.habit.preset.categoryHealth'),
		emojis: ['💧', '🥗', '💊', '😴', '🧘', '🦷', '🚭'],
	},
	{
		id: 'sport',
		label: t('widgets.habit.preset.categorySport'),
		emojis: ['🏃', '🚴', '🏋️', '🏊', '⚽', '🤸', '🧗'],
	},
	{
		id: 'study',
		label: t('widgets.habit.preset.categoryStudy'),
		emojis: ['📖', '✍️', '💻', '🎨', '🧠', '🎧', '🎯'],
	},
	{
		id: 'lifestyle',
		label: t('widgets.habit.preset.categoryLifestyle'),
		emojis: ['☕', '🍵', '🧹', '🪴', '🍎', '🚶', '✨'],
	},
]
