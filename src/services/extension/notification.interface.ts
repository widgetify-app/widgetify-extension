export type NotificationType = 'text' | 'url' | 'action' | 'page' | 'banner'

export enum NotificationGoTo {
	Explorer = 'explorer',
	Profile = 'openProfile',
	Settings = 'openSettings',
	WidgetCatalog = 'openWidgetCatalog',
	MiniApp = 'openMiniApp',
}

export interface NotificationItem {
	id?: string
	title: string
	description?: string
	link?: string
	icon?: string
	closeable: boolean | null
	type?: NotificationType
	goTo?: NotificationGoTo
	target?: string
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
	type: NotificationType
	target: string
	goTo: NotificationGoTo
	buttonColor: string
	buttonLabel: string
}

export interface IslandNotificationItem {
	id: string
	title: string
	description?: string | null
	icon?: string | null
	link?: string | null
	type?: NotificationType
	goTo?: string | null
	target?: string | null
}

export interface NotificationsData {
	cards: NotificationItem[]
	dialog: DialogNotificationItem | null
	island: IslandNotificationItem | null
}

interface RawAction {
	type: string
	goTo?: string | null
	target?: string | null
	url?: string | null
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
