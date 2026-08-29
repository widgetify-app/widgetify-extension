import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { NotificationCardItem } from './components/notification-item'
import { listenEvent } from '@/common/utils/call-event'
import { getWithExpiry, setToStorage, setWithExpiry } from '@/common/storage'
import {
	type NotificationItem,
	useGetNotifications,
	useNotifyAsSeen,
} from '@/services/hooks/extension/get-notifications.hook'
import Analytics from '@/analytics'
import { useAuth } from '@/context/auth.context'
import { DailyMoodNotification } from '../daily-mood'
import { ProfileProgressNotification } from '../profile-progress'
import { safeAwait } from '@/services/api'

const localIds = ['notificationMood', 'update_profile']
interface Prop {
	hasBorder?: boolean
}

export function NotificationCenter({ hasBorder }: Prop = { hasBorder: true }) {
	const { user, isAuthenticated, isLoadingUser, profilePercentage } = useAuth()
	const { data: fetchedNotifications } = useGetNotifications()
	const { mutateAsync: notifyAsSeen } = useNotifyAsSeen()

	const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set())
	const [pushed, setPushed] = useState<{ id: string; node: ReactNode }[]>([])

	const notifications = useMemo(() => {
		const items = fetchedNotifications?.widgetifyCard || []
		return items.filter((item) => item.id && !dismissedIds.has(item.id))
	}, [fetchedNotifications?.widgetifyCard, dismissedIds])

	const addToNodes = async (notif: { id: string; node: React.ReactNode }) => {
		const notifFromStorage = await getWithExpiry(`removed_notification_${notif.id}`)
		if (!notifFromStorage) {
			setPushed((prev: any) => {
				if (
					prev.some(
						(item: { id: string; node: ReactNode }) => item.id === notif.id
					)
				) {
					return prev
				}
				return [...prev, notif]
			})
		}
	}

	useEffect(() => {
		if (isAuthenticated && !isLoadingUser) {
			if (user?.hasTodayMood === false && !user?.inCache) {
				addToNodes({
					id: 'notificationMood',
					node: (
						<DailyMoodNotification
							className={`${hasBorder ? '' : 'border-none!'}`}
						/>
					),
				})
			}

			if (
				user?.progressbar?.length &&
				!user.isProfileCompleted &&
				profilePercentage > 0
			) {
				addToNodes({
					id: 'update_profile',
					node: (
						<ProfileProgressNotification
							className={`${hasBorder ? '' : 'border-none!'}`}
						/>
					),
				})
			} else {
				try {
					document.getElementById('update_profile')?.remove()
				} catch {}
			}
		}
	}, [isAuthenticated, user, hasBorder])

	useEffect(() => {
		const addEvent = listenEvent(
			'add_to_notifications',
			async (notif: { id: string; node: React.ReactNode }) => {
				const notifFromStorage = await getWithExpiry(
					`removed_notification_${notif.id}`
				)
				if (!notifFromStorage) {
					setPushed((prev: any) => {
						if (
							prev.some(
								(item: { id: string; node: ReactNode }) =>
									item.id === notif.id
							)
						) {
							return prev
						}
						return [...prev, notif]
					})
				}
			}
		)

		const removeEvent = listenEvent(
			'remove_from_notifications',
			async ({ id, ttl }) => {
				setPushed((prev) => prev.filter((item) => item.id !== id))
				if (ttl) {
					await setWithExpiry(`removed_notification_${id}`, 'true', ttl)
				} else {
					await setToStorage(`removed_notification_${id}`, 'true')
				}
			}
		)

		return () => {
			addEvent()
			removeEvent()
		}
	}, [])

	const onClose = async (e: any, id: string, ttl = 1200) => {
		e.preventDefault()
		setDismissedIds((prev) => new Set([...prev, id]))
		Analytics.event('notifications_close')

		if (!localIds.includes(id)) {
			await safeAwait(notifyAsSeen(id))
		} else {
			await setWithExpiry(`removed_notification_${id}`, 'true', ttl)
		}
	}

	return (
		<div className="flex flex-col gap-1">
			{notifications.map((item, index) => (
				<NotificationCardItem
					notification={item}
					className={`${hasBorder ? '' : 'border-none!'}`}
					key={item.id || `no-${index}`}
					onClose={(e) => onClose(e, item.id || '', item.ttl)}
				/>
			))}

			{pushed.map((f) => f.node)}
		</div>
	)
}
