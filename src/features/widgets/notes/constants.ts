import type { NotePriority, StickyColorTheme } from './types'

export const STICKY_COLOR_MAP: Record<string, StickyColorTheme> = {
	default: { bg: 'bg-glass-surface', text: 'text-fg', onColor: false },
	low: { bg: 'bg-success', text: 'text-on-success', onColor: true },
	medium: { bg: 'bg-warning', text: 'text-on-warning', onColor: true },
	high: { bg: 'bg-danger', text: 'text-on-danger', onColor: true },
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
	{ value: 'high', ariaLabel: 'اولویت مهم', bgColor: PRIORITY_BG_COLORS.high },
	{ value: 'medium', ariaLabel: 'اولویت متوسط', bgColor: PRIORITY_BG_COLORS.medium },
	{ value: 'low', ariaLabel: 'اولویت کم‌اهمیت', bgColor: PRIORITY_BG_COLORS.low },
]
