import { useMutation } from '@tanstack/react-query'
import { getMainClient } from '@/services/api'

export interface TodoReorderPayload {
	id: string
	order: number
}

export const useReorderTodos = () => {
	return useMutation({
		mutationKey: ['reorderTodos'],
		mutationFn: async (todos: TodoReorderPayload[]) => {
			return await ReorderTodosApi(todos)
		},
	})
}

export async function ReorderTodosApi(todos: TodoReorderPayload[]) {
	const client = await getMainClient()

	const response = await client.put('/todos/order', { todos })

	return response.data
}
