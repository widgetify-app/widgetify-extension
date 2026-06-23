import { useMutation } from '@tanstack/react-query'
import { getMainClient } from '@/services/api'

export const useArchiveHabit = () => {
	return useMutation({
		mutationKey: ['archiveHabit'],
		mutationFn: async (id: string) => {
			const client = await getMainClient()
			const response = await client.delete(`/widgets/habits/${id}`)
			return response.data
		},
	})
}
