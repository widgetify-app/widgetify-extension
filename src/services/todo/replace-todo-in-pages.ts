import type { FetchedTodo } from './todo.interface'

interface TodoPages<Page extends { todos: FetchedTodo[] }> {
	pages: Page[]
	pageParams: unknown[]
}

export function replaceTodoInPages<
	Page extends { todos: FetchedTodo[] },
	Data extends TodoPages<Page>,
>(data: Data | undefined, updated: FetchedTodo): Data | undefined {
	if (!data) return data

	let found = false
	const pages = data.pages.map((page) => {
		const index = page.todos.findIndex((todo) => todo.id === updated.id)
		if (index === -1) return page
		found = true
		const todos = [...page.todos]
		todos[index] = updated
		return { ...page, todos }
	})

	return found ? { ...data, pages } : data
}
