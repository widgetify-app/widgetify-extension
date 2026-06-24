import { useQuery } from '@tanstack/react-query'
import { getMainClient } from '@/services/api'
import type { Habit } from './habit.interface'

export const useGetHabitDetail = (habitId: string, enabled: boolean) => {
	return useQuery<Habit>({
		queryKey: ['get-habit-detail', habitId],
		queryFn: () => getHabitDetail(habitId),
		retry: 0,
		enabled: enabled && !!habitId,
		refetchOnWindowFocus: false,
	})
}

async function getHabitDetail(habitId: string): Promise<Habit> {
	const client = await getMainClient()
	const { data } = await client.get<{ data: Habit }>(`/widgets/habits/${habitId}`)
	return data.data
}
