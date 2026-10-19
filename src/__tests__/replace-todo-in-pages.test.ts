import { describe, expect, it } from 'bun:test'
import { replaceTodoInPages } from '@/services/todo/replace-todo-in-pages'
import { type FetchedTodo, TodoPriority } from '@/services/todo/todo.interface'

function todo(id: string, completed = false): FetchedTodo {
	return {
		id,
		text: id,
		completed,
		date: '2026-10-19',
		priority: TodoPriority.Medium,
		category: '',
		offlineId: null,
		description: '',
		order: 0,
	}
}

function cache(...pages: FetchedTodo[][]) {
	return {
		pageParams: pages.map((_, index) => index + 1),
		pages: pages.map((todos) => ({ todos, totalPages: pages.length, totals: 9 })),
	}
}

describe('replaceTodoInPages', () => {
	it('puts the updated todo in place of the cached one, on any page', () => {
		const before = cache([todo('a'), todo('b')], [todo('c')])
		const after = replaceTodoInPages(before, todo('c', true))

		expect(after?.pages[1].todos[0].completed).toBe(true)
		expect(after?.pages[0].todos.map((t) => t.id)).toEqual(['a', 'b'])
		expect(after?.pages[1].totals).toBe(9)
	})

	it('keeps the page objects it did not touch', () => {
		const before = cache([todo('a')], [todo('c')])
		const after = replaceTodoInPages(before, todo('c', true))

		expect(after?.pages[0]).toBe(before.pages[0])
		expect(after?.pageParams).toBe(before.pageParams)
	})

	it('returns the cache unchanged when the todo is not in it', () => {
		const before = cache([todo('a')])
		expect(replaceTodoInPages(before, todo('z', true))).toBe(before)
	})

	it('leaves an empty cache alone', () => {
		expect(replaceTodoInPages(undefined, todo('a'))).toBeUndefined()
	})
})
