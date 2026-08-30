import { describe, expect, it } from 'bun:test'
import {
	EXIT_ANIMATION_MS,
	isRetainableValue,
} from '@/common/utils/animation-timing'

describe('EXIT_ANIMATION_MS', () => {
	it('outlasts the daisyUI modal transition of 300ms', () => {
		expect(EXIT_ANIMATION_MS).toBeGreaterThan(300)
	})
})

describe('isRetainableValue', () => {
	it('holds real payloads through the exit animation', () => {
		expect(isRetainableValue({ id: 1 })).toBe(true)
		expect(isRetainableValue('pomodoro')).toBe(true)
	})

	it('holds falsy values that are still real content', () => {
		expect(isRetainableValue(0)).toBe(true)
		expect(isRetainableValue('')).toBe(true)
	})

	it('releases the cleared states', () => {
		expect(isRetainableValue(null)).toBe(false)
		expect(isRetainableValue(undefined)).toBe(false)
		expect(isRetainableValue(false)).toBe(false)
	})
})
