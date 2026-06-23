import { useMutation } from '@tanstack/react-query'
import { getMainClient } from '@/services/api'
import type { CreateHabitInput } from './habit.interface'

export const useAddHabit = () => {
	return useMutation({
		mutationKey: ['addHabit'],
		mutationFn: async (input: CreateHabitInput) => {
			const client = await getMainClient()
			const response = await client.post('/widgets/habits', input)
			return response.data
		},
	})
}
