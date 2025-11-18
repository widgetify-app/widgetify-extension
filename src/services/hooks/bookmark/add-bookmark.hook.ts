import { useMutation } from '@tanstack/react-query'
import { getMainClient } from '@/services/api'

export const useAddBookmark = () => {
	return useMutation({
		mutationKey: ['addBookmark'],
		mutationFn: async () => {
			const client = await getMainClient()
			await client.post(`/bookmarks`)
		},
	})
}
