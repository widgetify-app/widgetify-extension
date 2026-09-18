import type { NotePriority, StickyColorTheme } from './types'

export const NOTE_PREVIEW_CHARACTER_LIMIT = 120

export const STICKY_COLOR_MAP: Record<string, StickyColorTheme> = {
	default: {
		bg: 'bg-content bg-glass',
		border: 'border-subtle',
		text: 'text-content',
		headerBg: 'bg-raised',
		divider: 'border-subtle',
	},
	low: {
		bg: 'bg-success',
		border: 'border-success-subtle',
		text: 'text-success-content',
		headerBg: 'bg-success-subtle',
		divider: 'border-success-subtle',
	},
	medium: {
		bg: 'bg-warning',
		border: 'border-warning-subtle',
		text: 'text-warning-content',
		headerBg: 'bg-warning-subtle',
		divider: 'border-warning-subtle',
	},
	high: {
		bg: 'bg-error',
		border: 'border-danger-subtle',
		text: 'text-error-content',
		headerBg: 'bg-danger-subtle',
		divider: 'border-danger-subtle',
	},
}

export const PRIORITY_BG_COLORS: Record<NotePriority, string> = {
	low: 'bg-success text-success-content',
	medium: 'bg-warning text-warning-content',
	high: 'bg-error text-error-content',
}

export const PRIORITY_OPTIONS: {
	value: NotePriority
	ariaLabel: string
	bgColor: string
}[] = [
	{ value: 'low', ariaLabel: 'اولویت کم', bgColor: PRIORITY_BG_COLORS.low },
	{ value: 'medium', ariaLabel: 'اولویت متوسط', bgColor: PRIORITY_BG_COLORS.medium },
	{ value: 'high', ariaLabel: 'اولویت مهم', bgColor: PRIORITY_BG_COLORS.high },
]
