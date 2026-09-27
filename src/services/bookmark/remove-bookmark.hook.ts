import { useMutation } from '@tanstack/react-query'
import { getMainClient } from '@/services/api'
import { bookmarkKeys } from '@/services/bookmark/bookmark.keys'

export const useRemoveBookmark = () => {
	return useMutation({
		mutationKey: bookmarkKeys.remove,
		mutationFn: async (bookmarkId: string) => {
			const client = getMainClient()
			await client.delete(`/bookmarks/${bookmarkId}`)
		},
	})
}
