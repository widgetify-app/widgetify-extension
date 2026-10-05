import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getMainClient } from '@/services/api'
import type { UpdateHabitInput } from './habit.interface'
import { habitKeys } from '@/services/habit/habit.keys'

export const useUpdateHabit = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationKey: habitKeys.update,
		mutationFn: async ({ id, input }: { id: string; input: UpdateHabitInput }) => {
			const client = getMainClient()
			const response = await client.patch(`/widgets/habits/${id}`, input)
			return response.data
		},
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({ queryKey: habitKeys.detail(id) })
		},
	})
}
