import type { NotePriority, StickyColorTheme } from './types'

export const NOTE_PREVIEW_CHARACTER_LIMIT = 120

export const STICKY_COLOR_MAP: Record<string, StickyColorTheme> = {
	default: {
		bg: 'bg-ds-surface-2 bg-glass',
		border: 'border-ds-line',
		text: 'text-ds-fg',
		headerBg: 'bg-ds-fill-2',
		divider: 'border-ds-line',
	},
	low: {
		bg: 'bg-ds-success',
		border: 'border-success-content-muted',
		text: 'text-ds-on-success',
		headerBg: 'bg-success-content-subtle',
		divider: 'border-success-content-muted',
	},
	medium: {
		bg: 'bg-ds-warning',
		border: 'border-warning-content-muted',
		text: 'text-ds-on-warning',
		headerBg: 'bg-warning-content-subtle',
		divider: 'border-warning-content-muted',
	},
	high: {
		bg: 'bg-ds-danger',
		border: 'border-danger-content-muted',
		text: 'text-ds-on-danger',
		headerBg: 'bg-danger-content-subtle',
		divider: 'border-danger-content-muted',
	},
}

export const PRIORITY_BG_COLORS: Record<NotePriority, string> = {
	low: 'bg-ds-success text-ds-on-success',
	medium: 'bg-ds-warning text-ds-on-warning',
	high: 'bg-ds-danger text-ds-on-danger',
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
