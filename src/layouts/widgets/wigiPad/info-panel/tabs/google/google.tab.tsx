import { useAuth } from '@/context/auth.context'
import { useDate } from '@/context/date.context'
import { useGetGoogleCalendarEvents } from '@/services/hooks/date/getGoogleCalendarEvents.hook'
import { LuLockKeyhole } from 'react-icons/lu'
import { MdEvent } from 'react-icons/md'
import { GoogleMeetingItem } from './google-meeting-item'

export function GoogleTab() {
	const { today } = useDate()
	const { isAuthenticated } = useAuth()
	const { data: googleEvents, isLoading } = useGetGoogleCalendarEvents(
		isAuthenticated,
		today.clone().toDate(),
		today.clone().add(1, 'day').toDate()
	)
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

	const GoogleEventsContent = () => (
		<div className="space-y-2">
			{!isAuthenticated ? (
				<div className="flex flex-col items-center py-1 text-center text-muted">
					<LuLockKeyhole className="mb-2 text-2xl" />
					<p className="text-sm">
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
				<div className="py-8 text-center text-muted">
					<MdEvent className="mx-auto mb-2 text-2xl text-gray-500" />
					<p className="text-sm">هیچ رویداد گوگل امروز نیست</p>
				</div>
			)}
		</div>
	)

	return <GoogleEventsContent />
}
