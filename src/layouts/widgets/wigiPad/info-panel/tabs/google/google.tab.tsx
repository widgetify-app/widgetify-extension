import { LuLockKeyhole } from 'react-icons/lu'
import { MdEvent } from 'react-icons/md'
import { useAuth } from '@/context/auth.context'
import { useDate } from '@/context/date.context'
import { useGeneralSetting } from '@/context/general-setting.context'
import { useGetGoogleCalendarEvents } from '@/services/hooks/date/getGoogleCalendarEvents.hook'
import { GoogleMeetingItem } from './google-meeting-item'

const LoadingSkeleton = () => (
	<div className="space-y-2">
		{[...Array(3)].map((_, index) => (
			<div key={index} className="p-2 rounded-lg bg-content animate-pulse">
				<div className="flex items-center gap-3">
					<div className="w-5 h-5 bg-gray-300 rounded"></div>
					<div className="flex-1 space-y-2">
						<div className="w-3/4 h-4 bg-gray-300 rounded"></div>
						<div className="w-1/2 h-3 bg-gray-300 rounded"></div>
						<div className="w-2/3 h-3 bg-gray-300 rounded"></div>
					</div>
				</div>
			</div>
		))}
	</div>
)

export function GoogleTab() {
	const { today } = useDate()
	const { isAuthenticated } = useAuth()
	const { blurMode } = useGeneralSetting()
	const { data: googleEvents, isLoading } = useGetGoogleCalendarEvents(
		isAuthenticated,
		today.clone().toDate(),
		today.clone().add(30, 'day').toDate()
	)

	const GoogleEventsContent = () => (
		<div className={`space-y-2 ${blurMode ? 'blur-mode' : 'disabled-blur-mode'}`}>
			{!isAuthenticated ? (
				<div className="flex flex-col items-center py-1.5 text-center text-muted">
					<LuLockKeyhole className="mb-2 text-3xl" />
					<p className="text-xs leading-normal max-w-44">
						برای مشاهده رویدادهای گوگل، لطفاً وارد حساب کاربری خود شوید.
					</p>
				</div>
			) : isLoading ? (
				<LoadingSkeleton />
			) : googleEvents && googleEvents.length > 0 ? (
				googleEvents.map((event) => (
					<GoogleMeetingItem key={event.id} meeting={event} />
				))
			) : (
				<div
					className={
						'flex-1 flex flex-col items-center justify-center gap-y-1.5 px-5 py-1'
					}
				>
					<div
						className={
							'flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-base-300/70 border-base/70'
						}
					>
						<MdEvent className="text-content" size={24} />
					</div>
					<p className="mt-1 text-center text-content">
						هیچ رویداد گوگل امروز نیست
					</p>
				</div>
			)}
		</div>
	)

	return <GoogleEventsContent />
}
