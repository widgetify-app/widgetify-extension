import { useMutation } from '@tanstack/react-query'
import { getMainClient } from '@/services/api'
import type { TodoPriority } from '@/context/todo.context'

export interface TodoUpdatePayload {
	text?: string
	category?: string
	date?: string
	description?: string
	priority?: TodoPriority
	completed?: boolean
	order?: number
}

export const useUpdateTodo = () => {
	return useMutation({
		mutationKey: ['updateTodo'],
		mutationFn: async ({ id, input }: { id: string; input: TodoUpdatePayload }) => {
			return await UpdateTodoApi(id, input)
		},
	})
}

export async function UpdateTodoApi(id: string, input: TodoUpdatePayload) {
	const client = await getMainClient()

	const response = await client.patch<TodoUpdatePayload>(`/todos/${id}`, input)

	return response.data
}
