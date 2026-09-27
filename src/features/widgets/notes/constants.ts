import type { NotePriority, StickyColorTheme } from './types'

export const NOTE_PREVIEW_CHARACTER_LIMIT = 120

export const STICKY_COLOR_MAP: Record<string, StickyColorTheme> = {
	default: {
		bg: 'bg-surface-2 bg-glass',
		border: 'border-line',
		text: 'text-fg',
		headerBg: 'bg-fill-2',
		divider: 'border-line',
	},
	low: {
		bg: 'bg-success',
		border: 'border-[rgba(var(--color-success-content-rgb),0.2)]',
		text: 'text-on-success',
		headerBg: 'bg-[rgba(var(--color-success-content-rgb),0.1)]',
		divider: 'border-[rgba(var(--color-success-content-rgb),0.2)]',
	},
	medium: {
		bg: 'bg-warning',
		border: 'border-[rgba(var(--color-warning-content-rgb),0.2)]',
		text: 'text-on-warning',
		headerBg: 'bg-[rgba(var(--color-warning-content-rgb),0.1)]',
		divider: 'border-[rgba(var(--color-warning-content-rgb),0.2)]',
	},
	high: {
		bg: 'bg-danger',
		border: 'border-[rgba(var(--color-error-content-rgb),0.2)]',
		text: 'text-on-danger',
		headerBg: 'bg-[rgba(var(--color-error-content-rgb),0.1)]',
		divider: 'border-[rgba(var(--color-error-content-rgb),0.2)]',
	},
}

export const PRIORITY_BG_COLORS: Record<NotePriority, string> = {
	low: 'bg-success text-on-success',
	medium: 'bg-warning text-on-warning',
	high: 'bg-danger text-on-danger',
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
