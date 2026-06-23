import { useMutation } from '@tanstack/react-query'
import { getMainClient } from '@/services/api'
import type { LogHabitProgressInput } from './habit.interface'

export const useLogHabitProgress = () => {
	return useMutation({
		mutationKey: ['logHabitProgress'],
		mutationFn: async ({
			id,
			input,
		}: {
			id: string
			input: LogHabitProgressInput
		}) => {
			const client = await getMainClient()
			const response = await client.put(`/widgets/habits/${id}/progress`, input)
			return response.data
		},
	})
}
