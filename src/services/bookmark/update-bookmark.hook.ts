import { useMutation } from '@tanstack/react-query'
import { getMainClient } from '@/services/api'
import type { Bookmark } from '@/services/bookmark/bookmark.interface'
import { bookmarkKeys } from '@/services/bookmark/bookmark.keys'

interface BookmarkUpdatePayload {
	id: string
	title: string
	url: string | null
	sticker: string | null
	customTextColor: string | null
	customBackground: string | null
	icon: File | string | null
	isDeletedIcon: boolean
}

export const useUpdateBookmark = () => {
	return useMutation({
		mutationKey: bookmarkKeys.update,
		mutationFn: async (input: BookmarkUpdatePayload): Promise<Bookmark> => {
			const client = getMainClient()

			const formData = new FormData()

			Object.entries(input).forEach(([key, value]) => {
				if (value !== undefined) {
					formData.append(key, value as any)
				}
			})
			const response = await client.patch<Bookmark>(
				`/bookmarks/${input.id}`,
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				}
			)

			return response.data
		},
	})
}
