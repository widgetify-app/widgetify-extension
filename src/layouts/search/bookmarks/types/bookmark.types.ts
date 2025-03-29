export type BookmarkType = 'BOOKMARK' | 'FOLDER'

export interface BaseBookmark {
	id: string
	title: string
	type: BookmarkType
	parentId: string | null
	isLocal: boolean
	isManageable: boolean
	customImage?: string
}

export interface BookmarkItem extends BaseBookmark {
	type: 'BOOKMARK'
	url: string
	icon: string
}

export interface FolderItem extends BaseBookmark {
	type: 'FOLDER'
}

export type Bookmark = BookmarkItem | FolderItem

export interface FolderPathItem {
	id: string
	title: string
}
