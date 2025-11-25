import { getMainClient } from '@/services/api'
import { useMutation } from '@tanstack/react-query'

export const useRemoveTodo = () => {
	return useMutation({
		mutationKey: ['removeTodo'],
		mutationFn: (todoId: string) => RemoveTodoApi(todoId),
	})
}

export async function RemoveTodoApi(todoId: string) {
	const client = await getMainClient()
	await client.delete(`/todos/${todoId}`)
}
