import { useMutation } from '@tanstack/react-query'
import { getMainClient } from '@/services/api'
import type { TodoPriority } from '@/services/todo/todo.interface'
import { todoKeys } from '@/services/todo/todo.keys'

export interface TodoCreationPayload {
	text: string
	date: string
	category?: string
	description?: string
	priority?: TodoPriority
	completed?: boolean
	order?: number
	friendIds: string[]
}

export const useAddTodo = () => {
	return useMutation({
		mutationKey: todoKeys.add,
		mutationFn: async (input: TodoCreationPayload) => {
			return await AddTodoApi(input)
		},
	})
}

async function AddTodoApi(input: TodoCreationPayload) {
	const client = getMainClient()

	const response = await client.post<TodoCreationPayload>(`/todos`, input)

	return response.data
}
