import { useMutation } from '@tanstack/react-query'
import { getMainClient } from '@/services/api'
import type { BookmarkType } from '@/layouts/bookmark/types/bookmark.types'

export interface BulkImportBookmarkNode {
	title: string
	type: BookmarkType
	url?: string | null
	children?: BulkImportBookmarkNode[]
}

export interface BulkImportBookmarksPayload {
	parentId: string | null
	items: BulkImportBookmarkNode[]
}

export interface BulkImportBookmarksResult {
	message: string
	importedCount: number
	createdFolders: number
}

export const useImportBrowserBookmarks = () => {
	return useMutation({
		mutationKey: ['importBrowserBookmarks'],
		mutationFn: async (
			input: BulkImportBookmarksPayload
		): Promise<BulkImportBookmarksResult> => {
			return await ImportBrowserBookmarksApi(input)
		},
	})
}

export async function ImportBrowserBookmarksApi(
	input: BulkImportBookmarksPayload
): Promise<BulkImportBookmarksResult> {
	const client = getMainClient()

	const { data } = await client.post<{ data: BulkImportBookmarksResult }>(
		'/bookmarks/import',
		{
			parentId: input.parentId || undefined,
			items: input.items,
		}
	)

	return data.data
}
