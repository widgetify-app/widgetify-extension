import { useQuery } from '@tanstack/react-query'
import { getMainClient } from '@/services/api'
import { Habit } from './habit.interface'

interface GetHabitsResponse {
	items: Habit[]
	page: number
	limit: number
	total: number
}

export const useGetHabits = (enabled: boolean, archived = false) => {
	return useQuery<GetHabitsResponse>({
		queryKey: ['get-habits', archived],
		queryFn: () => getHabits(archived),
		retry: 0,
		enabled,
		initialData: {
			items: [],
			page: 1,
			limit: 20,
			total: 0,
		},
		refetchOnWindowFocus: false,
	})
}

async function getHabits(archived: boolean): Promise<GetHabitsResponse> {
	const client = await getMainClient()
	const { data } = await client.get<{ data: GetHabitsResponse }>('/widgets/habits', {
		params: { archived, limit: 50 },
	})
	return data.data
}
