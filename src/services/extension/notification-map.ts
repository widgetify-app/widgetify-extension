import { t } from '@/common/i18n'
import type {
	DialogNotificationItem,
	IslandNotificationItem,
	NotificationItem,
	NotificationsData,
	RawBroadcast,
	RawInboxItem,
	RawSurfaces,
} from './notification.interface'

const DEFAULT_DIALOG_BUTTON_COLOR = '#dc9909'

function mapInboxItem(item: RawInboxItem): NotificationItem {
	return {
		id: item.id,
		title: item.title,
		description: item.body ?? undefined,
		icon: item.icon ?? undefined,
		link: item.action.link ?? undefined,
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
		link: broadcast.action.link ?? undefined,
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
		link: broadcast.action.link,
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
		link: broadcast.action.link ?? '',
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

export const MARK_ALL_BATCH = 100

interface MarkAllPlan {
	inbox: string[][]
	broadcasts: string[][]
}

function batches(ids: string[]): string[][] {
	const result: string[][] = []

	for (let start = 0; start < ids.length; start += MARK_ALL_BATCH) {
		result.push(ids.slice(start, start + MARK_ALL_BATCH))
	}

	return result
}

export function planMarkAll(cards: NotificationItem[]): MarkAllPlan {
	const closeable = cards.filter((card) => card.closeable && card.id)
	const idsOf = (source: 'inbox' | 'broadcast') =>
		closeable
			.filter((card) => (card.source === 'inbox') === (source === 'inbox'))
			.map((card) => card.id as string)

	return {
		inbox: batches(idsOf('inbox')),
		broadcasts: batches(idsOf('broadcast')),
	}
}
