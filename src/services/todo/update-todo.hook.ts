import { useMutation } from '@tanstack/react-query'
import { getMainClient } from '@/services/api'
import type { FetchedTodo, TodoPriority } from '@/services/todo/todo.interface'
import { todoKeys } from '@/services/todo/todo.keys'

interface TodoUpdatePayload {
	text?: string
	category?: string
	date?: string
	description?: string
	priority?: TodoPriority
	completed?: boolean
	order?: number
}

export const useUpdateTodo = (todoId: string | null) => {
	return useMutation({
		mutationKey: todoKeys.update(todoId),
		mutationFn: async ({ id, input }: { id: string; input: TodoUpdatePayload }) => {
			return await UpdateTodoApi(id, input)
		},
	})
}

async function UpdateTodoApi(id: string, input: TodoUpdatePayload) {
	const client = getMainClient()

	const response = await client.patch<{
		data: {
			todo: FetchedTodo
		}
	}>(`/todos/${id}`, input)

	return response.data.data.todo
}
