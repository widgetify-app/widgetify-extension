import { useMutation } from '@tanstack/react-query'
import { getMainClient } from '@/services/api'
import type { BookmarkType } from '@/services/hooks/bookmark/bookmark.interface'

export interface BulkImportBookmarkNode {
	title: string
	type: BookmarkType
	url?: string | null
	children?: BulkImportBookmarkNode[]
}

interface BulkImportBookmarksPayload {
	parentId: string | null
	items: BulkImportBookmarkNode[]
}

interface BulkImportBookmarksResult {
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

async function ImportBrowserBookmarksApi(
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
