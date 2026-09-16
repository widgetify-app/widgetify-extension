import { describe, expect, it } from 'bun:test'
import { shouldReduceMotion } from '../reduced-motion'

describe('shouldReduceMotion', () => {
	it('returns false when both app setting and OS prefers-reduced-motion are false', () => {
		expect(shouldReduceMotion(false, false)).toBe(false)
	})

	it('returns true when user explicitly enables optimal mode, even if OS setting is false', () => {
		expect(shouldReduceMotion(true, false)).toBe(true)
	})

	it('returns true when OS prefers reduced motion, even if user app setting is false', () => {
		expect(shouldReduceMotion(false, true)).toBe(true)
	})

	it('returns true when both app setting and OS setting are enabled', () => {
		expect(shouldReduceMotion(true, true)).toBe(true)
	})

	it('handles undefined and null gracefully as falsy', () => {
		expect(shouldReduceMotion(undefined, undefined)).toBe(false)
		expect(shouldReduceMotion(null, null)).toBe(false)
		expect(shouldReduceMotion(null, true)).toBe(true)
		expect(shouldReduceMotion(true, null)).toBe(true)
	})
})
