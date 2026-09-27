import { useMutation } from '@tanstack/react-query'
import { getMainClient } from '@/services/api'
import { habitKeys } from '@/services/habit/habit.keys'

export const useArchiveHabit = () => {
	return useMutation({
		mutationKey: habitKeys.archive,
		mutationFn: async (id: string) => {
			const client = getMainClient()
			const response = await client.delete(`/widgets/habits/${id}`)
			return response.data
		},
	})
}
