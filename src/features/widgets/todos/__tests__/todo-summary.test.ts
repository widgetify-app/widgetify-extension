import { describe, expect, it } from 'bun:test'
import { todoSummary } from '../utils/todo-summary'

describe('todoSummary', () => {
	it('counts done tasks when every task is on screen', () => {
		expect(todoSummary({ total: 5, completed: 2, isPartial: false })).toBe(
			'2 از 5 انجام شده'
		)
	})

	it('gives only the total when some tasks are not loaded or filtered out', () => {
		expect(todoSummary({ total: 12, completed: 2, isPartial: true })).toBe('12 تسک')
	})

	it('says nothing when there are no tasks', () => {
		expect(todoSummary({ total: 0, completed: 0, isPartial: false })).toBe('')
	})
})
