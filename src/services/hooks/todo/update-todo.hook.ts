import { useMutation } from '@tanstack/react-query'
import { getMainClient } from '@/services/api'
import type { FetchedTodo, TodoPriority } from '@/services/hooks/todo/todo.interface'

export interface TodoUpdatePayload {
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
		mutationKey: ['updateTodo', todoId],
		mutationFn: async ({ id, input }: { id: string; input: TodoUpdatePayload }) => {
			return await UpdateTodoApi(id, input)
		},
	})
}

export async function UpdateTodoApi(id: string, input: TodoUpdatePayload) {
	const client = getMainClient()

	const response = await client.patch<{
		data: {
			todo: FetchedTodo
		}
	}>(`/todos/${id}`, input)

	return response.data.data.todo
}
