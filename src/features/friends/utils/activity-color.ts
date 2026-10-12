import type { CSSProperties } from 'react'

export const ACTIVITY_COLORS: readonly string[] = [
	'#bfdbfe',
	'#bbf7d0',
	'#fef08a',
	'#fbcfe8',
	'#ddd6fe',
	'#e2e8f0',
	'#ff6fae',
	'#ef4444',
	'#f97316',
	'#84cc16',
	'#14b8a6',
	'#4f46e5',
	'#a16207',
]

const HEX_COLOR = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i

const DARK_INK = '#1f2937'
const LIGHT_INK = '#ffffff'
const LIGHT_BACKGROUND_LUMINANCE = 0.55

function luminanceOf([red, green, blue]: number[]) {
	return (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255
}

export function activityStyle(
	color: string | null | undefined
): CSSProperties | undefined {
	const match = typeof color === 'string' ? HEX_COLOR.exec(color) : null
	if (!match) return undefined

	const channels = match.slice(1).map((part) => Number.parseInt(part, 16))

	return {
		backgroundColor: color as string,
		color: luminanceOf(channels) > LIGHT_BACKGROUND_LUMINANCE ? DARK_INK : LIGHT_INK,
	}
}
