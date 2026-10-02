import { describe, expect, it } from 'bun:test'
import { isEmail, isEmpty, isLessThan, isNumber } from '../utils/validators'

describe('validators', () => {
	it('isEmpty ignores spaces', () => {
		expect(isEmpty('')).toBe(true)
		expect(isEmpty('   ')).toBe(true)
		expect(isEmpty(' a ')).toBe(false)
	})

	it('isEmail wants a name, an at sign and a domain with a dot', () => {
		expect(isEmail('a@b.co')).toBe(true)
		expect(isEmail('a@b')).toBe(false)
		expect(isEmail('a b@c.d')).toBe(false)
		expect(isEmail('@b.co')).toBe(false)
	})

	it('isNumber accepts only digits', () => {
		expect(isNumber('0912')).toBe(true)
		expect(isNumber('12a')).toBe(false)
		expect(isNumber('')).toBe(false)
		expect(isNumber('-1')).toBe(false)
	})

	it('isLessThan counts the length without the surrounding spaces', () => {
		expect(isLessThan(' ab ', 3)).toBe(true)
		expect(isLessThan('abc', 3)).toBe(false)
	})
})
