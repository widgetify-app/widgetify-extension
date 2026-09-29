import { useMutation } from '@tanstack/react-query'
import { getMainClient } from '@/services/api'
import type { CreateHabitInput } from './habit.interface'
import { habitKeys } from '@/services/habit/habit.keys'

export const useAddHabit = () => {
	return useMutation({
		mutationKey: habitKeys.add,
		mutationFn: async (input: CreateHabitInput) => {
			const client = getMainClient()
			const response = await client.post('/widgets/habits', input)
			return response.data
		},
	})
}
