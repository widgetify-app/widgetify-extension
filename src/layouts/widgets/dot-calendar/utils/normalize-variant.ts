import { DEFAULT_DOT_CALENDAR_VARIANT, DOT_CALENDAR_VARIANTS } from '../constants'
import type { DotCalendarVariant } from '../types'

export function normalizeDotCalendarVariant(stored?: string | null): DotCalendarVariant {
	if (!stored) return DEFAULT_DOT_CALENDAR_VARIANT

	return DOT_CALENDAR_VARIANTS.includes(stored as DotCalendarVariant)
		? (stored as DotCalendarVariant)
		: DEFAULT_DOT_CALENDAR_VARIANT
}
