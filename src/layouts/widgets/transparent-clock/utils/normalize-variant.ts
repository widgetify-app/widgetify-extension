import {
	DEFAULT_TRANSPARENT_CLOCK_VARIANT,
	TRANSPARENT_CLOCK_VARIANTS,
} from '../constants'
import type { TransparentClockVariant } from '../types'

export function normalizeTransparentClockVariant(
	stored?: string | null
): TransparentClockVariant {
	if (!stored) return DEFAULT_TRANSPARENT_CLOCK_VARIANT

	return TRANSPARENT_CLOCK_VARIANTS.includes(stored as TransparentClockVariant)
		? (stored as TransparentClockVariant)
		: DEFAULT_TRANSPARENT_CLOCK_VARIANT
}
