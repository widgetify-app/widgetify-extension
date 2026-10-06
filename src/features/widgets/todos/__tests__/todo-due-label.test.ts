import { describe, expect, it } from 'bun:test'
import moment from 'jalali-moment'
import { todoDueLabel } from '../utils/todo-due-label'

const now = moment('2026-10-01T09:00:00')

describe('todoDueLabel', () => {
	it('names today and tomorrow in words', () => {
		expect(todoDueLabel(moment('2026-10-01T23:00:00'), now)).toBe('امروز')
		expect(todoDueLabel(moment('2026-10-02T00:30:00'), now)).toBe('فردا')
	})

	it('writes any other day as a jalali day and month', () => {
		expect(todoDueLabel(moment('2026-10-04'), now)).toBe('12 مهر')
		expect(todoDueLabel(moment('2026-09-30'), now)).toBe('8 مهر')
	})

	it('leaves an unreadable date empty', () => {
		expect(todoDueLabel(moment('not a date', 'YYYY-MM-DD', true), now)).toBe('')
	})

	it('does not change the date it was given', () => {
		const due = moment('2026-10-04')
		todoDueLabel(due, now)
		expect(due.locale()).toBe(moment().locale())
	})
})
