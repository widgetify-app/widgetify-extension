import { t } from '@/common/i18n'
import type {
	DialogNotificationItem,
	IslandNotificationItem,
	NotificationGoTo,
	NotificationItem,
	NotificationType,
	NotificationsData,
	RawBroadcast,
	RawInboxItem,
	RawSurfaces,
} from './notification.interface'

const DEFAULT_DIALOG_BUTTON_COLOR = '#dc9909'
const DIALOG_ACTION_TYPES = ['page', 'action']

function cardType(type: string): NotificationType {
	return (type === 'banner' ? 'text' : type) as NotificationType
}

function mapInboxItem(item: RawInboxItem): NotificationItem {
	return {
		id: item.id,
		title: item.title,
		description: item.body ?? undefined,
		icon: item.icon ?? undefined,
		link: item.action.url ?? undefined,
		type: cardType(item.action.type),
		goTo: (item.action.goTo ?? undefined) as NotificationGoTo | undefined,
		target: item.action.target ?? undefined,
		closeable: true,
		groupCount: item.groupCount,
		source: 'inbox',
		createdAt: item.createdAt,
	}
}

function mapBroadcastCard(broadcast: RawBroadcast): NotificationItem {
	return {
		id: broadcast.id,
		title: broadcast.title,
		description: broadcast.body ?? undefined,
		icon: broadcast.media ?? undefined,
		link: broadcast.action.url ?? undefined,
		type: cardType(broadcast.action.type),
		goTo: (broadcast.action.goTo ?? undefined) as NotificationGoTo | undefined,
		target: broadcast.action.target ?? undefined,
		closeable: broadcast.closeable,
		source: 'broadcast',
	}
}

function mapIsland(broadcast: RawBroadcast): IslandNotificationItem {
	return {
		id: broadcast.id,
		title: broadcast.title,
		description: broadcast.body,
		icon: broadcast.media,
		link: broadcast.action.url,
		type: cardType(broadcast.action.type),
		goTo: broadcast.action.goTo,
		target: broadcast.action.target,
	}
}

function mapDialog(broadcast: RawBroadcast): DialogNotificationItem {
	const settings = broadcast.dialog ?? {}

	return {
		id: broadcast.id,
		title: broadcast.title,
		dialogTitle: settings.dialogTitle || null,
		description: broadcast.body ?? '',
		media: broadcast.media ?? '',
		link: broadcast.action.url ?? '',
		type: DIALOG_ACTION_TYPES.includes(broadcast.action.type)
			? (broadcast.action.type as NotificationType)
			: 'url',
		target: broadcast.action.target ?? '',
		goTo: (broadcast.action.goTo ?? '') as NotificationGoTo,
		buttonColor: settings.buttonColor || DEFAULT_DIALOG_BUTTON_COLOR,
		buttonLabel: settings.buttonLabel || t('navbar.notifications.dialogButton'),
	}
}

export function buildNotifications(
	inbox: RawInboxItem[],
	surfaces: RawSurfaces,
	dismissedIds: ReadonlySet<string> = new Set()
): NotificationsData {
	const notDismissed = (id: string) => !dismissedIds.has(id)

	return {
		cards: [
			...inbox.filter((item) => item.readAt === null).map(mapInboxItem),
			...surfaces.inbox
				.filter((broadcast) => notDismissed(broadcast.id))
				.map(mapBroadcastCard),
		],
		dialog:
			surfaces.dialog && notDismissed(surfaces.dialog.id)
				? mapDialog(surfaces.dialog)
				: null,
		island:
			surfaces.island && notDismissed(surfaces.island.id)
				? mapIsland(surfaces.island)
				: null,
	}
}
