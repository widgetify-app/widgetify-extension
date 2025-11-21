export type BookmarkType = 'BOOKMARK' | 'FOLDER'

export interface Bookmark {
	id: string
	title: string
	type: BookmarkType
	parentId: string | null
	isLocal: boolean
	onlineId: string | null
	url: string | null
	icon: string | null
	customBackground: string | null
	customTextColor: string | null
	sticker: string | null
	order: number | null
}

export interface LocalBookmark extends Bookmark {
	file?: string // base64 encoded image
}

export interface FolderPathItem {
	id: string
	title: string
}
