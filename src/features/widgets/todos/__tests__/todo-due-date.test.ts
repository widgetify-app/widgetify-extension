import { describe, expect, it } from 'bun:test'
import jalaliMoment from 'jalali-moment'
import { parseTodoDate } from '../utils/parse-date'
import { toTodoDueDate } from '../utils/todo-due-date'

describe('toTodoDueDate', () => {
	it('keeps the day the user picked, even late at night', () => {
		const lateEvening = jalaliMoment('2026-09-14 23:30', 'YYYY-MM-DD HH:mm')

		expect(parseTodoDate(toTodoDueDate(lateEvening)).format('YYYY-MM-DD')).toBe(
			'2026-09-14'
		)
	})

	it('keeps the day the user picked, just after midnight', () => {
		const justAfterMidnight = jalaliMoment('2026-09-14 00:10', 'YYYY-MM-DD HH:mm')

		expect(parseTodoDate(toTodoDueDate(justAfterMidnight)).format('YYYY-MM-DD')).toBe(
			'2026-09-14'
		)
	})

	it('lands on midday so neither side of the date line rolls over', () => {
		const picked = jalaliMoment('2026-09-14 08:00', 'YYYY-MM-DD HH:mm')

		expect(parseTodoDate(toTodoDueDate(picked)).format('HH:mm')).toBe('12:00')
	})

	it('leaves the moment it was given alone', () => {
		const picked = jalaliMoment('2026-09-14 08:00', 'YYYY-MM-DD HH:mm')

		toTodoDueDate(picked)
		toTodoDueDate(picked)

		expect(picked.format('YYYY-MM-DD HH:mm')).toBe('2026-09-14 08:00')
	})
})
