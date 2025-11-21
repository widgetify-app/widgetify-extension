import { useMutation } from '@tanstack/react-query'
import { getMainClient } from '@/services/api'
import type { Bookmark, BookmarkType } from '@/layouts/bookmark/types/bookmark.types'

export interface BookmarkUpdatePayload {
	id: string
	title: string
	type: BookmarkType
	url: string | null
	sticker: string | null
	parentId: string | null
	order: number | null
	customTextColor: string | null
	customBackground: string | null
	icon: File | null
}

export const useUpdateBookmark = () => {
	return useMutation({
		mutationKey: ['updateBookmark'],
		mutationFn: async (input: BookmarkUpdatePayload): Promise<Bookmark> => {
			const client = await getMainClient()

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
