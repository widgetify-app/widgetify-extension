import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getMainClient } from '@/services/api'
import type { FetchedTodo } from '@/services/todo/todo.interface'
import { todoKeys } from '@/services/todo/todo.keys'

const TAGGED_PAGE_SIZE = 50

export const useRemoveTag = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (tag: string) => removeTagFromTodos(tag),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: todoKeys.tags })
			queryClient.invalidateQueries({ queryKey: todoKeys.lists })
		},
	})
}

async function removeTagFromTodos(tag: string): Promise<number> {
	const client = getMainClient()
	const tagged: FetchedTodo[] = []

	for (let page = 1; ; page++) {
		const { data } = await client.get<{ todos: FetchedTodo[]; totalPages: number }>(
			'/todos/v2/@me',
			{ params: { page, limit: TAGGED_PAGE_SIZE, category: tag } }
		)
		tagged.push(...data.todos)
		if (page >= data.totalPages) break
	}

	const own = tagged.filter((todo) => todo.owner?.isSelf)
	for (const todo of own) {
		await client.patch(`/todos/${todo.id}`, { category: '' })
	}

	return own.length
}
