import { useMutation } from '@tanstack/react-query'
import { getMainClient } from '@/services/api'

export const useRemoveBookmark = () => {
	return useMutation({
		mutationKey: ['removeBookmark'],
		mutationFn: async (bookmarkId: string) => {
			const client = getMainClient()
			await client.delete(`/bookmarks/${bookmarkId}`)
		},
	})
}
