import { describe, expect, it } from 'bun:test'
import { parseTodoDate } from '../utils/parse-date'

describe('parseTodoDate', () => {
	it('reads an iso timestamp as gregorian', () => {
		expect(parseTodoDate('2026-09-14T10:00:00Z').isValid()).toBe(true)
	})

	it('reads a plain gregorian date', () => {
		const parsed = parseTodoDate('2026-09-14')

		expect(parsed.isValid()).toBe(true)
		expect(parsed.format('YYYY-MM-DD')).toBe('2026-09-14')
	})

	it('reads a jalali date that does not start with 20', () => {
		const parsed = parseTodoDate('1405-06-23')

		expect(parsed.isValid()).toBe(true)
		expect(parsed.format('jYYYY-jMM-jDD')).toBe('1405-06-23')
	})

	it('keeps the two calendars apart rather than mixing them up', () => {
		expect(parseTodoDate('2026-09-14').format('YYYY')).toBe('2026')
		expect(parseTodoDate('1405-06-23').format('jYYYY')).toBe('1405')
	})
})
