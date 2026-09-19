import type { NotePriority, StickyColorTheme } from './types'

export const NOTE_PREVIEW_CHARACTER_LIMIT = 120

export const STICKY_COLOR_MAP: Record<string, StickyColorTheme> = {
	default: {
		bg: 'bg-content bg-glass',
		border: 'border-subtle',
		text: 'text-content',
		headerBg: 'bg-hovered',
		divider: 'border-subtle',
	},
	low: {
		bg: 'bg-success',
		border: 'border-success-content-muted',
		text: 'text-success-content',
		headerBg: 'bg-success-content-subtle',
		divider: 'border-success-content-muted',
	},
	medium: {
		bg: 'bg-warning',
		border: 'border-warning-content-muted',
		text: 'text-warning-content',
		headerBg: 'bg-warning-content-subtle',
		divider: 'border-warning-content-muted',
	},
	high: {
		bg: 'bg-error',
		border: 'border-danger-content-muted',
		text: 'text-error-content',
		headerBg: 'bg-danger-content-subtle',
		divider: 'border-danger-content-muted',
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
