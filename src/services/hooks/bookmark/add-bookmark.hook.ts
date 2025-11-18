import { useMutation } from '@tanstack/react-query'
import { getMainClient } from '@/services/api'
import type { Bookmark, BookmarkType } from '@/layouts/bookmark/types/bookmark.types'

export interface BookmarkCreationPayload {
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

export const useAddBookmark = () => {
	return useMutation({
		mutationKey: ['addBookmark'],
		mutationFn: async (input: BookmarkCreationPayload) => {
			const client = await getMainClient()

			const formData = new FormData()

			Object.entries(input).forEach(([key, value]) => {
				if (value !== undefined && value !== null) {
					formData.append(key, value as any)
				}
			})

			const response = await client.post<Bookmark>(`/bookmarks`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			})

			return response.data
		},
	})
}
