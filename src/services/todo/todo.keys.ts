export const todoKeys = {
	tags: ['getTags'] as const,
	lists: ['getTodos'] as const,
	list: (params: unknown) => ['getTodos', params] as const,
	add: ['addTodo'] as const,
	remove: (id: string) => ['removeTodo', id] as const,
	update: (todoId: string | null) => ['updateTodo', todoId] as const,
}
