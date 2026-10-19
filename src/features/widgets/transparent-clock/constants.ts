import type { MessageKey } from '@/common/i18n'
import type {
	TransparentClockFace,
	TransparentClockFinish,
	TransparentClockStyle,
	TransparentClockVariant,
} from './types'

export const DEFAULT_TRANSPARENT_CLOCK_VARIANT: TransparentClockVariant = 'persian'

export const TRANSPARENT_CLOCK_VARIANTS: TransparentClockVariant[] = [
	'persian',
	'english',
]

export const TRANSPARENT_CLOCK_FACES: TransparentClockFace[] = [
	'classic',
	'outline',
	'stacked',
]

export const CLOCK_WEIGHT_RANGE = { min: 100, max: 900, step: 100 }
export const CLOCK_SCALE_RANGE = { min: 0.7, max: 1.3, step: 0.05 }
export const GLASS_TINT_RANGE = { min: 0, max: 100, step: 5 }

export const CLOCK_COLOR_PRESETS = [
	'#ffffff',
	'#f87171',
	'#fb923c',
	'#facc15',
	'#4ade80',
	'#22d3ee',
	'#60a5fa',
	'#a78bfa',
	'#f472b6',
] as const

export const DEFAULT_TRANSPARENT_CLOCK_STYLE: TransparentClockStyle = {
	face: 'classic',
	finish: 'solid',
	weight: 900,
	scale: 1,
	color: 'wallpaper',
	glassTint: 40,
	datePosition: 'below',
}

export const CLOCK_FACE_LABELS: Record<TransparentClockFace, MessageKey> = {
	classic: 'widgets.transparentClock.face.classic',
	outline: 'widgets.transparentClock.face.outline',
	stacked: 'widgets.transparentClock.face.stacked',
}

export const CLOCK_FINISH_LABELS: Record<TransparentClockFinish, MessageKey> = {
	solid: 'widgets.transparentClock.finish.solid',
	glass: 'widgets.transparentClock.finish.glass',
}
