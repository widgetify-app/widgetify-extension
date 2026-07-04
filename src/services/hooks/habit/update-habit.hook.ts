import { useMutation } from '@tanstack/react-query'
import { getMainClient } from '@/services/api'
import type { UpdateHabitInput } from './habit.interface'

export const useUpdateHabit = () => {
	return useMutation({
		mutationKey: ['updateHabit'],
		mutationFn: async ({ id, input }: { id: string; input: UpdateHabitInput }) => {
			const client = getMainClient()
			const response = await client.patch(`/widgets/habits/${id}`, input)
			return response.data
		},
	})
}
