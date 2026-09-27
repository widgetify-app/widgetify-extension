import { describe, expect, it } from 'bun:test'
import type { Todo } from '@/services/hooks/todo/todo.interface'
import { sortTodos } from '../utils/sort-todos'

function todo(id: string, order: number, priority?: string): Todo {
	return { id, order, priority, text: id, completed: false } as unknown as Todo
}

const TODOS = [
	todo('a', 3, 'low'),
	todo('b', 1, 'high'),
	todo('c', 2, 'medium'),
	todo('d', 0, 'high'),
]

const ids = (list: Todo[]) => list.map((t) => t.id)

describe('sortTodos', () => {
	it('falls back to the stored order', () => {
		expect(ids(sortTodos(TODOS, 'def'))).toEqual(['d', 'b', 'c', 'a'])
		expect(ids(sortTodos(TODOS, 'anything-else'))).toEqual(['d', 'b', 'c', 'a'])
	})

	it('lifts the chosen priority to the top', () => {
		expect(ids(sortTodos(TODOS, 'high'))).toEqual(['d', 'b', 'c', 'a'])
		expect(ids(sortTodos(TODOS, 'medium'))).toEqual(['c', 'd', 'b', 'a'])
		expect(ids(sortTodos(TODOS, 'low'))).toEqual(['a', 'd', 'b', 'c'])
	})

	it('keeps the stored order inside each half', () => {
		const many = [
			todo('a', 5, 'high'),
			todo('b', 1, 'low'),
			todo('c', 2, 'high'),
			todo('d', 0, 'low'),
		]

		expect(ids(sortTodos(many, 'high'))).toEqual(['c', 'a', 'd', 'b'])
	})

	it('is a consistent comparator, so the result does not depend on input order', () => {
		const shuffled = [TODOS[2], TODOS[0], TODOS[3], TODOS[1]]

		expect(ids(sortTodos(shuffled, 'high'))).toEqual(ids(sortTodos(TODOS, 'high')))
	})

	it('treats a missing priority as lowest, without throwing', () => {
		const withMissing = [todo('a', 1), todo('b', 0, 'high')]

		expect(ids(sortTodos(withMissing, 'high'))).toEqual(['b', 'a'])
	})

	it('does not mutate the array it is given', () => {
		const input = [...TODOS]
		sortTodos(input, 'high')

		expect(ids(input)).toEqual(['a', 'b', 'c', 'd'])
	})
})
