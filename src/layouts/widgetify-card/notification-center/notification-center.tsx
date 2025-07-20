import moment from 'jalali-moment'
import GoogleCalendar from '@/assets/google-calendar.png'
import GoogleMeet from '@/assets/google-meet.png'
import { Button } from '@/components/button/button'
import { useGeneralSetting } from '@/context/general-setting.context'
import { useGetWigiPadData } from '@/services/hooks/extension/getWigiPadData.hook'
import { NotificationCardItem } from './components/notification-item'

export function NotificationCenter() {
	const { selected_timezone: timezone } = useGeneralSetting()
	const { data: notification } = useGetWigiPadData({
		enabled: true,
		timezone: timezone.value,
	})

	const hasGoogleMeet = (event: any) => {
		return !!(
			event.platformLink?.includes('meet.google.com') ||
			event.htmlLink?.includes('meet.google.com') ||
			event.description?.includes('meet.google.com')
		)
	}

	return (
		<div className="flex flex-col gap-1">
			{notification?.widgetifyCardNotifications?.map((item, index) => (
				<NotificationCardItem
					key={index}
					title={item.title}
					subTitle={item.subTitle}
					description={item.description}
					link={item.link}
					icon={item.icon}
				/>
			))}
			{notification?.upcomingCalendarEvents?.map((event) => (
				<div key={event.id} className="relative">
					<NotificationCardItem
						title={event.title}
						subTitle={`
${moment(event.start).format('HH:mm')} - ${moment(event.end).format('HH:mm')}
                            `}
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
							<img
								src={GoogleMeet}
								alt="Gmail"
								className="w-[1.2rem] h-[1.2rem]"
							/>
						</Button>
					)}
				</div>
			))}
		</div>
	)
}
