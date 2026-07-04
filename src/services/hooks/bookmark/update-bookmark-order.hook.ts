import { useMutation } from '@tanstack/react-query'
import { getMainClient } from '@/services/api'

export interface BookmarkOrderUpdatePayload {
	folderId: string | null
	bookmarks: { id: string; order: number | null }[]
}

export const useUpdateBookmarkOrder = () => {
	return useMutation({
		mutationKey: ['updateBookmarkOrder'],
		mutationFn: async (input: BookmarkOrderUpdatePayload): Promise<void> => {
			const client = getMainClient()

			await client.put('/bookmarks/order', input)
		},
		retry: 2,
	})
}
