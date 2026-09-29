import { useQuery } from '@tanstack/react-query'
import { getMainClient } from '@/services/api'
import { todoKeys } from '@/services/todo/todo.keys'

export const useGetTags = (enabled: boolean) => {
	return useQuery<string[]>({
		queryKey: todoKeys.tags,
		queryFn: async () => getTags(),
		staleTime: 5 * 60 * 1000, // 5 minutes
		enabled,
	})
}
async function getTags(): Promise<string[]> {
	const client = getMainClient()
	const { data } = await client.get<string[]>('/todos/@me/tags')
	return data
}
