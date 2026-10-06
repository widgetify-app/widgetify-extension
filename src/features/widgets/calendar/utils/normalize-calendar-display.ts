import type { CalendarDisplay } from '../types'

export function normalizeCalendarDisplay(stored: unknown): CalendarDisplay {
	const meta =
		stored && typeof stored === 'object' ? (stored as Record<string, unknown>) : {}
	return {
		showEvents: meta.showEvents !== false,
		showMoods: meta.showMoods !== false,
	}
}
