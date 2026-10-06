import type { DotCalendarOptions } from '../types'
import { normalizeDotCalendarVariant } from './normalize-variant'

function asString(value: unknown): string | undefined {
	return typeof value === 'string' ? value : undefined
}

export function normalizeDotCalendarMeta(meta: unknown): DotCalendarOptions {
	const stored = (meta && typeof meta === 'object' ? meta : {}) as Record<
		string,
		unknown
	>

	return {
		variant: normalizeDotCalendarVariant(asString(stored.variant)),
		goalTitle: asString(stored.goalTitle)?.trim() ?? '',
		goalStartDate: asString(stored.goalStartDate),
		goalEndDate: asString(stored.goalEndDate),
	}
}
