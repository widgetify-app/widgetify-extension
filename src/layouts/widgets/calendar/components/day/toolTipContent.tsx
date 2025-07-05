import type { FetchedEvent } from '@/services/hooks/date/getEvents.hook'
import type { GoogleCalendarEvent } from '@/services/hooks/date/getGoogleCalendarEvents.hook'
import moment from 'jalali-moment'
import { AiOutlineGoogle } from 'react-icons/ai'
import { FaGlobeAsia } from 'react-icons/fa'
import { FaMoon } from 'react-icons/fa6'
import {
	type WidgetifyDate,
	convertShamsiToHijri,
	filterGoogleEventsByDate,
} from '../../utils'

export const toolTipContent = (
	cellDate: WidgetifyDate,
	events: {
		todayShamsiEvents: FetchedEvent[]
		todayHijriEvents: FetchedEvent[]
		todayGregorianEvents: FetchedEvent[]
		googleEvents: GoogleCalendarEvent[]
	}
) => {
	const isHoliday =
		cellDate.day() === 5 ||
		events.todayShamsiEvents.some((event) => event.isHoliday) ||
		events.todayHijriEvents.some((event) => event.isHoliday)

	const dayEvent = [
		...events.todayShamsiEvents,
		...events.todayGregorianEvents,
		...events.todayHijriEvents,
	].sort((a) => (a.isHoliday ? -1 : 1))

	const hijri = convertShamsiToHijri(cellDate)
	const gregorian = cellDate.clone().doAsGregorian().format('YYYY MMMM DD')
	const jalali = cellDate.format('jYYYY/jMM/jD')
	const jalaliDay = cellDate.format('ddd')

	const dayGoogleEvents = events.googleEvents
		? filterGoogleEventsByDate(events.googleEvents, cellDate)
		: []

	// is holiday style
	const holidayStyle = isHoliday
		? 'from-orange-600 to-red-700'
		: 'from-sky-500 to-blue-700'
	const headerStyle = `max-w-full py-1 px-3 rounded-full text-center text-white bg-gradient-to-r ${holidayStyle}`

	const infoStyle = 'text-base/80'
	const googleStyle = 'text-[#4285f4]'

	return (
		<div className="my-1 flex flex-col min-w-[250px] max-w-[250px] rounded-xl overflow-hidden">
			<div className={headerStyle}>
				<div
					className={`${holidayStyle} flex items-center justify-between gap-2`}
				>
					<span className="text-sm truncate">{jalaliDay}</span>
					<span className="text-sm truncate">{jalali}</span>
				</div>
			</div>

			<div className="p-3 space-y-2.5">
				<div className="flex items-center gap-2">
					<FaMoon className="flex-shrink-0 text-amber-500" />
					<span className="text-sm font-medium rtl">
						{hijri.format('iD iMMMM iYYYY')}
					</span>
				</div>

				<div className="flex items-center gap-2">
					<FaGlobeAsia className="flex-shrink-0 text-blue-500" />
					<span className={`text-sm ${infoStyle}`}>{gregorian}</span>
				</div>

				{dayGoogleEvents.length > 0 && (
					<div className="flex items-start gap-2 pt-2 mt-2 border-t border-gray-200 dark:border-gray-700">
						<AiOutlineGoogle
							className={`mt-1 flex-shrink-0 ${googleStyle}`}
						/>
						<div className="flex-1">
							<div className={`text-sm font-medium ${googleStyle}`}>
								{dayGoogleEvents.length} تقویم گوگل
							</div>
							{dayGoogleEvents.map((event, index) => (
								<div
									key={index}
									className={`text-xs mt-1 whitespace-normal break-words ${infoStyle}`}
								>
									• {event.summary} - (
									{moment(event.start.dateTime).format('HH:mm')})
								</div>
							))}
						</div>
					</div>
				)}

				{dayEvent.length > 0 && (
					<div className="flex items-start gap-2 pt-2 mt-2 border-t border-gray-200 dark:border-gray-700">
						<div className="flex items-center justify-center flex-shrink-0 w-4 h-4 mt-1">
							<span className="block w-2 h-2 bg-blue-500 rounded-full"></span>
						</div>
						<div className="flex-1">
							<div className={`text-sm font-medium ${infoStyle}`}>
								{dayEvent.length} رویداد
							</div>
							{dayEvent.map((event, index) => (
								<div
									key={index}
									className={`text-xs mt-1 whitespace-normal break-words ${event.isHoliday ? 'text-red-500 dark:text-red-400' : infoStyle}`}
								>
									• {event.title} {event.isHoliday && '(تعطیل)'}
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
