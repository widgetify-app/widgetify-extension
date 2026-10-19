import { describe, expect, it } from 'bun:test'
import { DEFAULT_TRANSPARENT_CLOCK_STYLE } from '../constants'
import type { TransparentClockStyle } from '../types'
import {
	colorWithAlpha,
	getClockDigitsPaint,
	getGlassFillAlpha,
	hexToRgbChannels,
	resolveColorSource,
} from '../utils/clock-paint'

const WALLPAPER = { isDerivedFromWallpaper: true, inkHsl: '210, 40%, 96%' }
const NO_WALLPAPER = { isDerivedFromWallpaper: false, inkHsl: '210, 40%, 96%' }

function style(overrides: Partial<TransparentClockStyle>): TransparentClockStyle {
	return { ...DEFAULT_TRANSPARENT_CLOCK_STYLE, ...overrides }
}

describe('hexToRgbChannels', () => {
	it('reads a six digit hex', () => {
		expect(hexToRgbChannels('#3b82f6')).toBe('59, 130, 246')
	})
})

describe('resolveColorSource', () => {
	it('uses the wallpaper ink when the wallpaper sets the colour', () => {
		expect(resolveColorSource('wallpaper', WALLPAPER)).toEqual({
			kind: 'hsl',
			channels: '210, 40%, 96%',
		})
	})

	it('uses the theme text colour when there is no wallpaper', () => {
		expect(resolveColorSource('wallpaper', NO_WALLPAPER)).toEqual({
			kind: 'rgb',
			channels: 'var(--color-base-content-rgb)',
		})
	})

	it('uses a picked colour on any wallpaper', () => {
		expect(resolveColorSource('#ffffff', NO_WALLPAPER)).toEqual({
			kind: 'rgb',
			channels: '255, 255, 255',
		})
	})
})

describe('colorWithAlpha', () => {
	it('writes hsla and rgba', () => {
		expect(colorWithAlpha({ kind: 'hsl', channels: '1, 2%, 3%' }, 0.5)).toBe(
			'hsla(1, 2%, 3%, 0.5)'
		)
		expect(colorWithAlpha({ kind: 'rgb', channels: '1, 2, 3' }, 1.4)).toBe(
			'rgba(1, 2, 3, 1)'
		)
	})
})

describe('getGlassFillAlpha', () => {
	it('adds colour as the tint rises and never goes fully clear', () => {
		expect(getGlassFillAlpha(100)).toBeGreaterThan(getGlassFillAlpha(50))
		expect(getGlassFillAlpha(50)).toBeGreaterThan(getGlassFillAlpha(0))
		expect(getGlassFillAlpha(0)).toBeGreaterThan(0)
	})
})

describe('getClockDigitsPaint', () => {
	it('keeps the theme text class for the default clock with no wallpaper', () => {
		const paint = getClockDigitsPaint(style({}), NO_WALLPAPER, 'none')
		expect(paint.usesThemeText).toBe(true)
		expect(paint.style.color).toBeUndefined()
		expect(paint.style.fontWeight).toBe(900)
	})

	it('paints a solid picked colour with the wallpaper glow', () => {
		const paint = getClockDigitsPaint(
			style({ color: '#f472b6' }),
			WALLPAPER,
			'0 2px 6px black'
		)
		expect(paint.usesThemeText).toBe(false)
		expect(paint.style.color).toBe('#f472b6')
		expect(paint.style.textShadow).toBe('0 2px 6px black')
	})

	it('draws glass as a translucent fill with an edge', () => {
		const paint = getClockDigitsPaint(
			style({ finish: 'glass', glassTint: 0 }),
			WALLPAPER,
			'none'
		)
		expect(paint.style.color).toBe('transparent')
		expect(String(paint.style.backgroundImage)).toContain('hsla(210, 40%, 96%')
		expect(paint.style.WebkitTextStroke).toBeDefined()
		expect(paint.style.filter).toBeUndefined()
	})

	it('draws the outline face as a stroke with no fill', () => {
		const paint = getClockDigitsPaint(style({ face: 'outline' }), WALLPAPER, 'none')
		expect(paint.style.color).toBe('transparent')
		expect(paint.style.backgroundImage).toBeUndefined()
		expect(String(paint.style.WebkitTextStroke)).toContain('hsl(210, 40%, 96%)')
	})

	it('grows the digits with the size setting', () => {
		const paint = getClockDigitsPaint(style({ scale: 1.2 }), WALLPAPER, 'none')
		expect(String(paint.style.fontSize)).toContain('* 1.2)')
	})

	it('sizes the stacked face for two rows with tight lines', () => {
		const paint = getClockDigitsPaint(
			style({ face: 'stacked', scale: 1.1 }),
			WALLPAPER,
			'none'
		)
		expect(String(paint.style.fontSize)).toContain('34cqh')
		expect(String(paint.style.fontSize)).toContain('* 1.1)')
		expect(paint.style.lineHeight).toBe(0.86)
	})
})
