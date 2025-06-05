import { useAuth } from '@/context/auth.context'
import { useGeneralSetting } from '@/context/general-setting.context'
import {
	filterGoogleEventsByDate,
	getCurrentDate,
} from '@/layouts/widgets/calendar/utils'
import { useGetGoogleCalendarEvents } from '@/services/hooks/date/getGoogleCalendarEvents.hook'
import { motion } from 'framer-motion'
import { FiCalendar } from 'react-icons/fi'

export function GoogleOverviewCard() {
	const { user, isAuthenticated } = useAuth()
	if (!isAuthenticated || !user) {
		return null
	}

	const { timezone } = useGeneralSetting()
	const today = getCurrentDate(timezone.value)

	const { data: googleEvents } = useGetGoogleCalendarEvents(
		isAuthenticated && (user?.connections?.includes('google') || false),
		today.clone().toDate(),
	)
	const todayEvents = filterGoogleEventsByDate(googleEvents, today)
	const upcomingEvents = todayEvents.filter((event) => {
		const now = new Date()
		const endTime = new Date(event.end.dateTime)
		return now < endTime
	})

	return (
		<motion.div
			className={'p-2 rounded-lg bg-content shadow-sm'}
			initial={{ opacity: 0, y: 5 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.5 }}
		>
			<div className="flex items-center gap-2">
				<FiCalendar
					className={upcomingEvents.length > 0 ? 'text-blue-500' : 'opacity-50'}
				/>
				<div className="flex-1">
					<p className="text-xs font-medium">جلسات امروز</p>
					<p className="text-xs opacity-75">
						{upcomingEvents.length > 0
							? `${upcomingEvents.length} جلسه باقی‌مانده`
							: todayEvents.length > 0
								? 'همه جلسات به پایان رسیده‌اند'
								: 'هیچ جلسه‌ای برای امروز ندارید'}
					</p>
				</div>
			</div>
			{upcomingEvents.length > 0 && (
				<div className="pr-6 mt-2 space-y-1">
					{upcomingEvents.slice(0, 1).map((event) => (
						<div key={event.id} className="flex items-center gap-1 text-xs">
							<span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
							<p className="flex-1 font-light truncate">{event.summary}</p>
						</div>
					))}
					{upcomingEvents.length > 1 && (
						<p className="text-xs italic opacity-75">
							و {upcomingEvents.length - 1} جلسه دیگر...
						</p>
					)}
				</div>
			)}
		</motion.div>
	)
}
