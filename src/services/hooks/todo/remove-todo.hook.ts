import { getMainClient } from '@/services/api'
import { useMutation } from '@tanstack/react-query'

export const useRemoveTodo = (id: string) => {
	return useMutation({
		mutationKey: ['removeTodo', id],
		mutationFn: () => RemoveTodoApi(id),
	})
}

export async function RemoveTodoApi(todoId: string) {
	const client = await getMainClient()
	await client.delete(`/todos/${todoId}`)
}
