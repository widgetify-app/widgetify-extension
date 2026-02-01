import moment from 'jalali-moment'
import GoogleCalendar from '@/assets/google-calendar.png'
import GoogleMeet from '@/assets/google-meet.png'
import { Button } from '@/components/button/button'
import Tooltip from '@/components/toolTip'
import type { NotificationItem } from '@/services/hooks/extension/getWigiPadData.hook'
import { NotificationCardItem } from './components/notification-item'
import { listenEvent } from '@/common/utils/call-event'
import { getWithExpiry, setToStorage, setWithExpiry } from '@/common/storage'
import type { ReactNode } from 'react'
import { useGetNotifications } from '@/services/hooks/extension/getNotifications.hook'

export function NotificationCenter() {
	const { data: fetchedNotifications } = useGetNotifications({
		enabled: true,
	})

	const [notifications, setNotifications] = useState<NotificationItem[]>([])
	const [pushed, setPushed] = useState<{ id: string; node: ReactNode }[]>([])
	const hasGoogleMeet = (event: any) => {
		return !!(
			event.platformLink?.includes('meet.google.com') ||
			event.htmlLink?.includes('meet.google.com') ||
			event.description?.includes('meet.google.com')
		)
	}

	useEffect(() => {
		const addEvent = listenEvent(
			'add_to_notifications',
			async (notif: { id: string; node: React.ReactNode }) => {
				const notifFromStorage = await getWithExpiry(
					`removed_notification_${notif.id}`
				)
				if (!notifFromStorage) {
					setPushed((prev: any) => {
						if (prev.some((item: NotificationItem) => item.id === notif.id)) {
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
				setNotifications((prev) => prev.filter((item) => item.id !== id))
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

			for (const item of fetchedNotifications?.data?.notifications || []) {
				if (item.id) {
					const cacheItem = await getWithExpiry(
						`removed_notification_${item.id}`
					)

					if (!cacheItem) {
						validNotifications.push(item)
					}
				} else {
					validNotifications.push(item)
				}
			}

			setNotifications([...validNotifications, ...notifications])
		}

		handle()
	}, [fetchedNotifications])

	const onClose = async (e: any, id: string, ttl = 1200) => {
		e.preventDefault()
		await setWithExpiry(`removed_notification_${id}`, 'true', ttl)

		const filtered = notifications.filter((f) => f.id !== id)
		setNotifications([...filtered])
	}

	return (
		<div className="flex flex-col gap-1">
			{fetchedNotifications?.data?.upcomingCalendarEvents?.map((event) => (
				<div key={event.id} className="relative">
					<NotificationCardItem
						title={event.title}
						subTitle={`
امروز، ${moment(event.start).format('HH:mm')} - ${moment(event.end).format('HH:mm')}
                            `}
						closeable={false}
						onClose={() => {}}
						description={event.location || ''}
						icon={GoogleCalendar}
						link={event.platformLink || event.htmlLink}
					/>
					{hasGoogleMeet(event) && (
						<Button
							className="absolute top-1 left-1 !p-0 w-7 h-7 text-center bg-transparent border-transparent hover:bg-base-content/5 hover:border-base-content/5 shadow-none active:scale-95"
							size="xs"
							isPrimary={false}
							rounded="full"
							onClick={() => {
								window.open(
									event.platformLink || event.htmlLink,
									'_blank'
								)
							}}
						>
							<Tooltip content="ورود به جلسه گوگل میت">
								<img
									src={GoogleMeet}
									alt="Gmail"
									className="w-[1.2rem] h-[1.2rem]"
								/>
							</Tooltip>
						</Button>
					)}
				</div>
			))}
			{notifications?.map((item, index) => (
				<NotificationCardItem
					id={item.id}
					closeable={item.closeable}
					key={index}
					title={item.title}
					subTitle={item.subTitle}
					description={item.description}
					link={item.link}
					onClose={(e) => onClose(e, item.id || '')}
					icon={item.icon}
					goTo={item.goTo}
					target={item.target}
					type={item.type}
				/>
			))}

			{pushed.map((f) => f.node)}
		</div>
	)
}
