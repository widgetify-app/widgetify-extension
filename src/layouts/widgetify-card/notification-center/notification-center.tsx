import { NotificationCardItem } from './components/notification-item'
import { listenEvent } from '@/common/utils/call-event'
import { getWithExpiry, setToStorage, setWithExpiry } from '@/common/storage'
import type { ReactNode } from 'react'
import {
	type NotificationItem,
	useGetNotifications,
} from '@/services/hooks/extension/getNotifications.hook'
import Analytics from '@/analytics'
import { useAuth } from '@/context/auth.context'
import { DailyMoodNotification } from '../daily-mood'
import { ProfileProgressNotification } from '../profile-progress'

export function NotificationCenter() {
	const { user, isAuthenticated, isLoadingUser, profilePercentage } = useAuth()
	const { data: fetchedNotifications, dataUpdatedAt } = useGetNotifications({
		enabled: true,
	})

	const [notifications, setNotifications] = useState<NotificationItem[]>([])
	const [pushed, setPushed] = useState<{ id: string; node: ReactNode }[]>([])

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
					node: <DailyMoodNotification />,
				})
			}

			if (
				user?.progressbar?.length &&
				!user.isProfileCompleted &&
				profilePercentage > 0
			) {
				addToNodes({
					id: 'update_profile',
					node: <ProfileProgressNotification />,
				})
			} else {
				try {
					document.getElementById('update_profile')?.remove()
				} catch {}
			}
		}
	}, [isAuthenticated, user])

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

	useEffect(() => {
		async function handle() {
			const validNotifications: NotificationItem[] = []

			for (const item of fetchedNotifications?.widgetifyCard || []) {
				if (item.id) {
					const cacheItem = await getWithExpiry(
						`removed_notification_${item.id}`
					)

					if (!cacheItem) {
						if (notifications.findIndex((f) => f.id === item.id) === -1)
							validNotifications.push(item)
					}
				}
			}
			setNotifications([...validNotifications])
		}

		handle()
	}, [dataUpdatedAt])

	const onClose = async (e: any, id: string, ttl = 1200) => {
		e.preventDefault()
		await setWithExpiry(`removed_notification_${id}`, 'true', ttl)

		const filtered = notifications.filter((f) => f.id !== id)
		setNotifications([...filtered])
		Analytics.event('notifications_close')
	}

	return (
		<div className="flex flex-col gap-1">
			{notifications?.map((item, index) => (
				<NotificationCardItem
					id={item.id}
					closeable={item.closeable}
					key={index}
					title={item.title}
					description={item.description}
					link={item.link}
					onClose={(e) => onClose(e, item.id || '', item.ttl)}
					icon={item.icon}
					goTo={item.goTo}
					target={item.target}
					type={item.type}
					titleDecoration={item.titleDecoration}
				/>
			))}

			{pushed.map((f) => f.node)}
		</div>
	)
}
