import {
	CLOCK_SCALE_RANGE,
	CLOCK_WEIGHT_RANGE,
	DEFAULT_TRANSPARENT_CLOCK_STYLE,
	GLASS_TINT_RANGE,
	TRANSPARENT_CLOCK_FACES,
} from '../constants'
import type {
	TransparentClockColor,
	TransparentClockFace,
	TransparentClockFinish,
	TransparentClockStyle,
	TransparentClockStyleMeta,
} from '../types'

const HEX_COLOR = /^#[0-9a-f]{6}$/i

function clampNumber(
	value: unknown,
	range: { min: number; max: number },
	fallback: number
): number {
	if (typeof value !== 'number' || !Number.isFinite(value)) return fallback
	return Math.min(range.max, Math.max(range.min, value))
}

function normalizeColor(value: unknown): TransparentClockColor {
	if (typeof value === 'string' && HEX_COLOR.test(value)) {
		return value.toLowerCase() as TransparentClockColor
	}
	return DEFAULT_TRANSPARENT_CLOCK_STYLE.color
}

export function normalizeTransparentClockStyle(meta: unknown): TransparentClockStyle {
	const stored = (meta && typeof meta === 'object' ? meta : {}) as Record<
		string,
		unknown
	>
	const defaults = DEFAULT_TRANSPARENT_CLOCK_STYLE

	const weight = clampNumber(stored.clockWeight, CLOCK_WEIGHT_RANGE, defaults.weight)

	return {
		face: TRANSPARENT_CLOCK_FACES.includes(stored.clockFace as TransparentClockFace)
			? (stored.clockFace as TransparentClockFace)
			: defaults.face,
		finish:
			stored.clockFinish === 'glass' || stored.clockFinish === 'solid'
				? (stored.clockFinish as TransparentClockFinish)
				: defaults.finish,
		weight: Math.round(weight / CLOCK_WEIGHT_RANGE.step) * CLOCK_WEIGHT_RANGE.step,
		scale: clampNumber(stored.clockScale, CLOCK_SCALE_RANGE, defaults.scale),
		color: normalizeColor(stored.clockColor),
		glassTint: clampNumber(
			stored.clockGlassTint,
			GLASS_TINT_RANGE,
			defaults.glassTint
		),
		datePosition:
			stored.clockDatePosition === 'above' || stored.clockDatePosition === 'hidden'
				? stored.clockDatePosition
				: defaults.datePosition,
	}
}

export function transparentClockStyleToMeta(
	style: TransparentClockStyle
): TransparentClockStyleMeta {
	return {
		clockFace: style.face,
		clockFinish: style.finish,
		clockWeight: style.weight,
		clockScale: style.scale,
		clockColor: style.color,
		clockGlassTint: style.glassTint,
		clockDatePosition: style.datePosition,
	}
}

export function toFreeClockStyle(style: TransparentClockStyle): TransparentClockStyle {
	return {
		...DEFAULT_TRANSPARENT_CLOCK_STYLE,
		weight: style.weight,
		scale: style.scale,
	}
}

export function resolveClockFace(
	face: TransparentClockFace,
	size: { w: number; h: number }
): TransparentClockFace {
	return face === 'stacked' && size.h === 1 ? 'classic' : face
}
