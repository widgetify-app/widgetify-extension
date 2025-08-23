import type { Friend } from '@/services/hooks/friends/friendService.hook'

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
	order?: number
	hasSharedFriends: boolean
	friends: Friend[]
	isManageable: boolean
}

export interface FolderPathItem {
	id: string
	title: string
}
