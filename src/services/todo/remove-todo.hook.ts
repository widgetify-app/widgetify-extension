import { getMainClient } from '@/services/api'
import { useMutation } from '@tanstack/react-query'
import { todoKeys } from '@/services/todo/todo.keys'

export const useRemoveTodo = (id: string) => {
	return useMutation({
		mutationKey: todoKeys.remove(id),
		mutationFn: () => RemoveTodoApi(id),
	})
}

async function RemoveTodoApi(todoId: string) {
	const client = getMainClient()
	await client.delete(`/todos/${todoId}`)
}
