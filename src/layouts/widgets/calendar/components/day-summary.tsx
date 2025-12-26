import type React from 'react'
import { FiCalendar } from 'react-icons/fi'
import { useAuth } from '@/context/auth.context'
import { useGetEvents } from '@/services/hooks/date/getEvents.hook'
import { useGetGoogleCalendarEvents } from '@/services/hooks/date/getGoogleCalendarEvents.hook'
import {
	getGregorianEvents,
	getHijriEvents,
	getShamsiEvents,
	type WidgetifyDate,
} from '../utils'

interface DaySummaryProps {
	selectedDate: WidgetifyDate
}

export const DaySummary: React.FC<DaySummaryProps> = ({ selectedDate }) => {
	const { user } = useAuth()
	const { data: events } = useGetEvents()

	const startOfMonth = selectedDate.clone().startOf('jMonth').toDate()
	const endOfMonth = selectedDate.clone().endOf('jMonth').toDate()

	const { data: googleEvents = [] } = useGetGoogleCalendarEvents(
		user?.connections?.includes('google') || false,
		startOfMonth,
		endOfMonth
	)

	const googleEventsForSelectedDate = googleEvents.filter((event) => {
		if (!event || !event.start || !event.start.dateTime) {
			return false
		}

		const eventDateStr = event.start.dateTime.split('T')[0]
		const dateStr = selectedDate.clone().locale('en').format('YYYY-MM-DD')
		return eventDateStr === dateStr
	})

	const googleEventCount = googleEventsForSelectedDate.length

	const shamsiEvents = events ? getShamsiEvents(events, selectedDate) : []
	const gregorianEvents = events ? getGregorianEvents(events, selectedDate) : []
	const hijriEvents = events ? getHijriEvents(events, selectedDate) : []
	const allEvents = [...shamsiEvents, ...gregorianEvents, ...hijriEvents]
	const totalEventsCount = allEvents.length + googleEventCount

	const holidayEvents = allEvents.filter((event) => event.isHoliday).length

	return (
		<div className={'overflow-hidden border border-content rounded-xl'}>
			<div className="p-0.5">
				<div className="grid grid-cols-1 gap-1.5">
					<div
						className={
							'p-1 rounded-lg cursor-pointer bg-base-300 flex items-center opacity-80 hover:opacity-100 transition-all duration-200'
						}
					>
						<FiCalendar
							className={`text-base ml-2 flex-shrink-0 ${totalEventsCount > 0 ? 'text-blue-500' : 'text-gray-400'}`}
						/>
						<div className="min-w-0 flex-">
							<div className={'text-xs font-medium text-content truncate'}>
								<span>{totalEventsCount}</span> مناسبت
							</div>
							<div
								className={'text-[.50rem] widget-item-sub-text truncate'}
							>
								{googleEventCount > 0 &&
									`${googleEventCount} رویداد گوگل • `}
								{holidayEvents > 0
									? `${holidayEvents} مناسبت تعطیل`
									: 'بدون تعطیلی'}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
