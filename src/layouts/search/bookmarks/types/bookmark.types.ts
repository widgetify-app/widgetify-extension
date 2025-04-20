export type BookmarkType = 'BOOKMARK' | 'FOLDER'

export interface Bookmark {
	id: string
	title: string
	type: BookmarkType
	parentId: string | null
	isLocal: boolean
	onlineId: string | null
	url: string
	icon?: string
	pinned?: boolean
	customImage?: string
	customBackground?: string
	customTextColor?: string
	sticker?: string
}

export interface FolderPathItem {
	id: string
	title: string
}
