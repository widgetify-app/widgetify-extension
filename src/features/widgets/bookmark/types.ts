import type { BookmarkType } from '@/services/bookmark/bookmark.interface'

export interface FolderPathItem {
	id: string
	title: string
}

export interface BrowserImportNode {
	title: string
	type: BookmarkType
	url: string | null
	children?: BrowserImportNode[]
}
