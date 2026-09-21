import { describe, expect, it } from 'bun:test'
import {
	clampSlideIndex,
	getNextSlideIndex,
	getPrevSlideIndex,
	resolveActiveSlideImage,
} from '../slider-utils'

describe('slider-utils', () => {
	it('increments index and wraps around to 0 on the last item', () => {
		expect(getNextSlideIndex(0, 3)).toBe(1)
		expect(getNextSlideIndex(1, 3)).toBe(2)
		expect(getNextSlideIndex(2, 3)).toBe(0)
	})

	it('handles single item count without advancing', () => {
		expect(getNextSlideIndex(0, 1)).toBe(0)
		expect(getPrevSlideIndex(0, 1)).toBe(0)
	})

	it('decrements index and wraps around to last item when at 0', () => {
		expect(getPrevSlideIndex(2, 3)).toBe(1)
		expect(getPrevSlideIndex(1, 3)).toBe(0)
		expect(getPrevSlideIndex(0, 3)).toBe(2)
	})

	it('clamps requested index into valid bounds', () => {
		expect(clampSlideIndex(-2, 5)).toBe(0)
		expect(clampSlideIndex(10, 5)).toBe(4)
		expect(clampSlideIndex(3, 5)).toBe(3)
		expect(clampSlideIndex(0, 0)).toBe(0)
	})

	it('resolves active slide image with bounds wrapping and fallback', () => {
		const images = [
			'https://example.com/1.png',
			'https://example.com/2.png',
			'https://example.com/3.png',
		]
		expect(resolveActiveSlideImage(images, 0)).toBe('https://example.com/1.png')
		expect(resolveActiveSlideImage(images, 1)).toBe('https://example.com/2.png')
		expect(resolveActiveSlideImage(images, 2)).toBe('https://example.com/3.png')
		expect(resolveActiveSlideImage([], 0, 'https://example.com/fallback.png')).toBe(
			'https://example.com/fallback.png'
		)
	})
})
