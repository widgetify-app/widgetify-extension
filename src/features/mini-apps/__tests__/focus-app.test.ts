import { describe, expect, it } from 'bun:test'
import { focusableAppId } from '../utils/focus-app'

describe('focusableAppId', () => {
	it('keeps a normal app id, trimmed', () => {
		expect(focusableAppId('app_123-abc')).toBe('app_123-abc')
		expect(focusableAppId('  8f2c1d3e-1111-4222-8333-944455556666 ')).toBe(
			'8f2c1d3e-1111-4222-8333-944455556666'
		)
		expect(focusableAppId('my.app')).toBe('my.app')
	})

	it('refuses anything that is not a string', () => {
		for (const value of [undefined, null, 3, {}, [], true]) {
			expect(focusableAppId(value)).toBeNull()
		}
	})

	it('refuses an empty id and one that is too long', () => {
		expect(focusableAppId('')).toBeNull()
		expect(focusableAppId('   ')).toBeNull()
		expect(focusableAppId('a'.repeat(101))).toBeNull()
		expect(focusableAppId('a'.repeat(100))).toBe('a'.repeat(100))
	})

	it('refuses characters an id never has, so nothing odd reaches a request path', () => {
		for (const value of [
			'a/b',
			'../x',
			'a b',
			'a?b=1',
			'a#b',
			'a%2Fb',
			'<script>',
			'a\nb',
		]) {
			expect(focusableAppId(value)).toBeNull()
		}
	})
})
