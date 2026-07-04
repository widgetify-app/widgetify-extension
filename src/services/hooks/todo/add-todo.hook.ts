import { useIsMutating, useMutation } from '@tanstack/react-query'
import { getMainClient } from '@/services/api'
import type { TodoPriority } from '@/services/hooks/todo/todo.interface'

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
		mutationKey: ['addTodo'],
		mutationFn: async (input: TodoCreationPayload) => {
			return await AddTodoApi(input)
		},
	})
}

export const useAddTodoState = () => {
	const isAdding = useIsMutating({ mutationKey: ['addTodo'] }) > 0

	return {
		isPending: isAdding,
	}
}

export async function AddTodoApi(input: TodoCreationPayload) {
	const client = getMainClient()

	const response = await client.post<TodoCreationPayload>(`/todos`, input)

	return response.data
}
