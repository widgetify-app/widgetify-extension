import { describe, expect, it } from 'bun:test'
import { EXIT_ANIMATION_MS } from '../use-delayed-unmount'

function isDefined(value: unknown): boolean {
	return value !== null && value !== undefined && value !== false
}

describe('EXIT_ANIMATION_MS', () => {
	it('outlasts the daisyUI modal transition of 300ms', () => {
		expect(EXIT_ANIMATION_MS).toBeGreaterThan(300)
	})
})

describe('the retain predicate', () => {
	it('treats real payloads as worth holding through the exit', () => {
		expect(isDefined({ id: 1 })).toBe(true)
		expect(isDefined('pomodoro')).toBe(true)
		expect(isDefined(0)).toBe(true)
		expect(isDefined('')).toBe(true)
	})

	it('treats the cleared states as released', () => {
		expect(isDefined(null)).toBe(false)
		expect(isDefined(undefined)).toBe(false)
		expect(isDefined(false)).toBe(false)
	})
})
