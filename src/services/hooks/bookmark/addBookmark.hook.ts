import {
	type UseMutationOptions,
	useMutation,
	useQueryClient,
} from '@tanstack/react-query'
import { getMainClient } from '@/services/api'
import type { FetchedBookmark } from './getBookmarks.hook'

export interface AddBookmarkParams {
	title: string
	url: string
	parentId?: string
	offlineId?: string
	type: 'BOOKMARK' | 'FOLDER'
	sticker?: string
	customTextColor?: string
	customBackground?: string
	order: number
	friendIds?: string[]
}

export const useAddBookmark = (
	options?: Partial<UseMutationOptions<FetchedBookmark, unknown, AddBookmarkParams>>
) => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: addBookmark,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['getBookmarks'] })
		},
		...options,
	})
}

export async function addBookmark(params: AddBookmarkParams): Promise<FetchedBookmark> {
	const client = await getMainClient()
	const response = await client.post<FetchedBookmark>('/bookmarks', params)
	return response.data
}
