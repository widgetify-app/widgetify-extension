import { useMutation } from '@tanstack/react-query'
import { getMainClient } from '@/services/api'
import type { LogHabitProgressInput } from './habit.interface'
import { habitKeys } from '@/services/habit/habit.keys'

export const useLogHabitProgress = () => {
	return useMutation({
		mutationKey: habitKeys.logProgress,
		mutationFn: async ({
			id,
			input,
		}: {
			id: string
			input: LogHabitProgressInput
		}) => {
			const client = getMainClient()
			const response = await client.put(`/widgets/habits/${id}/progress`, input)
			return response.data
		},
	})
}
