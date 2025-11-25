import { useMutation } from '@tanstack/react-query'
import { getMainClient } from '@/services/api'
import type { TodoPriority } from '@/context/todo.context'

export interface TodoCreationPayload {
	text: string
	category: string
	date: string
	description: string
	priority: TodoPriority
	completed: boolean
	order: number
}

export const useAddTodo = () => {
	return useMutation({
		mutationKey: ['addTodo'],
		mutationFn: async (input: TodoCreationPayload) => {
			return await AddTodoApi(input)
		},
	})
}

export async function AddTodoApi(input: TodoCreationPayload) {
	const client = await getMainClient()

	const response = await client.post<TodoCreationPayload>(`/todos`, input)

	return response.data
}
