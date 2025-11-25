import { useQuery } from '@tanstack/react-query'
import { getMainClient } from '@/services/api'
import type { FetchedTodo } from './todo.interface'

export const useGetTodos = (enabled: boolean) => {
	return useQuery<FetchedTodo[]>({
		queryKey: ['getTodos'],
		queryFn: async () => getTodos(),
		retry: 0,
		enabled,
		initialData: [],
	})
}
export async function getTodos(): Promise<FetchedTodo[]> {
	const client = await getMainClient()
	const { data } = await client.get<FetchedTodo[]>('/todos/@me')
	return data
}
