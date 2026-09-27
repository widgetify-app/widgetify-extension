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
		border: 'border-[rgba(var(--color-success-content-rgb),0.2)]',
		text: 'text-ds-on-success',
		headerBg: 'bg-[rgba(var(--color-success-content-rgb),0.1)]',
		divider: 'border-[rgba(var(--color-success-content-rgb),0.2)]',
	},
	medium: {
		bg: 'bg-ds-warning',
		border: 'border-[rgba(var(--color-warning-content-rgb),0.2)]',
		text: 'text-ds-on-warning',
		headerBg: 'bg-[rgba(var(--color-warning-content-rgb),0.1)]',
		divider: 'border-[rgba(var(--color-warning-content-rgb),0.2)]',
	},
	high: {
		bg: 'bg-ds-danger',
		border: 'border-[rgba(var(--color-error-content-rgb),0.2)]',
		text: 'text-ds-on-danger',
		headerBg: 'bg-[rgba(var(--color-error-content-rgb),0.1)]',
		divider: 'border-[rgba(var(--color-error-content-rgb),0.2)]',
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
