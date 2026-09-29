import { useMutation } from '@tanstack/react-query'
import { getMainClient } from '@/services/api'
import type { BookmarkType } from '@/services/bookmark/bookmark.interface'
import { bookmarkKeys } from '@/services/bookmark/bookmark.keys'

export interface BulkImportBookmarkNode {
	title: string
	type: BookmarkType
	url?: string | null
	children?: BulkImportBookmarkNode[]
}

interface BulkImportBookmarksPayload {
	parentId: string | null
	items: BulkImportBookmarkNode[]
	widgetId?: string | null
}

interface BulkImportBookmarksResult {
	message: string
	importedCount: number
	createdFolders: number
}

export const useImportBrowserBookmarks = () => {
	return useMutation({
		mutationKey: bookmarkKeys.importBrowser,
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
			widgetId: input.widgetId || undefined,
		}
	)

	return data.data
}
