import gmailIcon from '@/assets/gmail.svg'
import GoogleCalendar from '@/assets/google-calendar.png'
import GoogleMeet from '@/assets/google-meet.png'
import { Button } from '@/components/button/button'
import { useGeneralSetting } from '@/context/general-setting.context'
import { useGetWigiPadData } from '@/services/hooks/extension/getWigiPadData.hook'
import moment from 'jalali-moment'

import { FiBell } from 'react-icons/fi'
import { NotificationItem } from './components/notification-item'

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
	const hasNotifications =
		notification?.upcomingCalendarEvents && notification?.emailMessages
	if (!notification || !hasNotifications)
		return (
			<div
				className={
					'flex-1 flex flex-col items-center justify-center gap-y-1.5 px-5 py-10'
				}
			>
				<div
					className={
						'flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-base-300/70 border-base/70'
					}
				>
					<FiBell className="text-content" size={24} />
				</div>
				<p className="mt-1 text-center text-content">
					اعلانی برای نمایش وجود ندارد.
				</p>
				<p className="text-center text-[.65rem] text-content opacity-75">
					اعلان های ایمیل و تقویم گوگل و ... را میتونی ببینی.
				</p>
			</div>
		)

	return (
		<>
			<div className="flex flex-col gap-2">
				{notification?.upcomingCalendarEvents?.map((event) => (
					<div key={event.id} className="relative">
						<NotificationItem
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
				{notification?.emailMessages?.map((email) => (
					<NotificationItem
						title={email.sender}
						subTitle={email.subject}
						description={email.snippet}
						key={email.id}
						icon={gmailIcon}
						link="https://mail.google.com/mail/u/0/#inbox"
					/>
				))}
			</div>
		</>
	)
}
