import { describe, expect, it } from 'bun:test'
import { DEFAULT_TRANSPARENT_CLOCK_STYLE, TRANSPARENT_CLOCK_FACES } from '../constants'
import {
	normalizeTransparentClockStyle,
	resolveClockFace,
	toFreeClockStyle,
	transparentClockStyleToMeta,
} from '../utils/normalize-style'

describe('normalizeTransparentClockStyle', () => {
	it('draws the clock as before when nothing is stored', () => {
		expect(normalizeTransparentClockStyle(undefined)).toEqual(
			DEFAULT_TRANSPARENT_CLOCK_STYLE
		)
		expect(normalizeTransparentClockStyle({ variant: 'english' })).toEqual(
			DEFAULT_TRANSPARENT_CLOCK_STYLE
		)
		expect(normalizeTransparentClockStyle('nonsense')).toEqual(
			DEFAULT_TRANSPARENT_CLOCK_STYLE
		)
	})

	it('keeps every face the settings offer', () => {
		for (const face of TRANSPARENT_CLOCK_FACES) {
			expect(normalizeTransparentClockStyle({ clockFace: face }).face).toBe(face)
		}
	})

	it('rejects an unknown face and finish', () => {
		const style = normalizeTransparentClockStyle({
			clockFace: 'serif',
			clockFinish: 'chrome',
		})
		expect(style.face).toBe(DEFAULT_TRANSPARENT_CLOCK_STYLE.face)
		expect(style.finish).toBe(DEFAULT_TRANSPARENT_CLOCK_STYLE.finish)
	})

	it('snaps the weight to a real font weight inside 100 to 900', () => {
		expect(normalizeTransparentClockStyle({ clockWeight: 460 }).weight).toBe(500)
		expect(normalizeTransparentClockStyle({ clockWeight: 20 }).weight).toBe(100)
		expect(normalizeTransparentClockStyle({ clockWeight: 4000 }).weight).toBe(900)
		expect(normalizeTransparentClockStyle({ clockWeight: '700' }).weight).toBe(
			DEFAULT_TRANSPARENT_CLOCK_STYLE.weight
		)
	})

	it('clamps the scale and the glass intensity', () => {
		const low = normalizeTransparentClockStyle({
			clockScale: 0.1,
			clockGlassTint: -5,
		})
		expect(low.scale).toBe(0.7)
		expect(low.glassTint).toBe(0)

		const high = normalizeTransparentClockStyle({
			clockScale: 9,
			clockGlassTint: 400,
		})
		expect(high.scale).toBe(1.3)
		expect(high.glassTint).toBe(100)

		expect(normalizeTransparentClockStyle({ clockScale: Number.NaN }).scale).toBe(1)
	})

	it('accepts the wallpaper colour and a six digit hex only', () => {
		expect(normalizeTransparentClockStyle({ clockColor: 'rainbow' }).color).toBe(
			'wallpaper'
		)
		expect(normalizeTransparentClockStyle({ clockColor: '#3B82F6' }).color).toBe(
			'#3b82f6'
		)
		expect(normalizeTransparentClockStyle({ clockColor: 'red' }).color).toBe(
			'wallpaper'
		)
		expect(
			normalizeTransparentClockStyle({ clockColor: 'url(javascript:x)' }).color
		).toBe('wallpaper')
	})
})

describe('date position', () => {
	it('keeps the date below unless above is stored', () => {
		expect(normalizeTransparentClockStyle({}).datePosition).toBe('below')
		expect(
			normalizeTransparentClockStyle({ clockDatePosition: 'above' }).datePosition
		).toBe('above')
		expect(
			normalizeTransparentClockStyle({ clockDatePosition: 'left' }).datePosition
		).toBe('below')
	})

	it('can hide the date', () => {
		expect(
			normalizeTransparentClockStyle({ clockDatePosition: 'hidden' }).datePosition
		).toBe('hidden')
	})
})

describe('transparentClockStyleToMeta', () => {
	it('reads back as the same style', () => {
		const style = {
			face: 'outline',
			finish: 'glass',
			weight: 300,
			scale: 1.15,
			color: '#60a5fa',
			glassTint: 80,
			datePosition: 'above',
		} as const
		expect(
			normalizeTransparentClockStyle(transparentClockStyleToMeta(style))
		).toEqual(style)
	})
})

describe('toFreeClockStyle', () => {
	it('keeps weight and size and resets the pro parts', () => {
		const pro = {
			face: 'outline',
			finish: 'glass',
			weight: 300,
			scale: 1.2,
			color: '#f472b6',
			glassTint: 90,
			datePosition: 'above',
		} as const
		expect(toFreeClockStyle(pro)).toEqual({
			...DEFAULT_TRANSPARENT_CLOCK_STYLE,
			weight: 300,
			scale: 1.2,
		})
	})
})

describe('resolveClockFace', () => {
	it('draws the stacked face as classic in a one row cell', () => {
		expect(resolveClockFace('stacked', { w: 2, h: 1 })).toBe('classic')
		expect(resolveClockFace('stacked', { w: 4, h: 2 })).toBe('stacked')
	})

	it('passes the other faces through', () => {
		expect(resolveClockFace('outline', { w: 2, h: 1 })).toBe('outline')
	})
})
