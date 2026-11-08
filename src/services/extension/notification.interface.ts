export interface NotificationItem {
	id?: string
	title: string
	description?: string
	link?: string
	icon?: string
	closeable: boolean | null
	titleDecoration?: string
	groupCount?: number
	source?: 'inbox' | 'broadcast'
	createdAt?: string
}

export interface DialogNotificationItem {
	id: string
	title: string
	dialogTitle: string | null
	description: string
	media: string
	link: string
	buttonColor: string
	buttonLabel: string
}

export interface IslandNotificationItem {
	id: string
	title: string
	description?: string | null
	icon?: string | null
	link?: string | null
}

export interface NotificationsData {
	cards: NotificationItem[]
	dialog: DialogNotificationItem | null
	island: IslandNotificationItem | null
}

interface RawAction {
	link?: string | null
}

export interface RawInboxItem {
	id: string
	title: string
	body: string | null
	icon: string | null
	action: RawAction
	groupCount: number
	createdAt: string
	readAt: string | null
}

export interface RawBroadcast {
	id: string
	title: string
	body: string | null
	media: string | null
	action: RawAction
	dialog: Record<string, string> | null
	closeable: boolean
}

export interface RawSurfaces {
	inbox: RawBroadcast[]
	island: RawBroadcast | null
	dialog: RawBroadcast | null
}
