import gmailIcon from '@/assets/gmail.svg'
import GoogleCalendar from '@/assets/googleCalendar.png'
import { Button } from '@/components/button/button'
import { useGeneralSetting } from '@/context/general-setting.context'
import { useGetWigiPadData } from '@/services/hooks/extension/getWigiPadData.hook'
import moment from 'jalali-moment'
import { SiGooglemeet } from 'react-icons/si'

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

	if (!notification) return null

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
								className="absolute top-2 left-2 !p-0 w-6 h-6 text-center"
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
								<SiGooglemeet size={14} />
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
