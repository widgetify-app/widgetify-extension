import moment from 'jalali-moment'
import { AiOutlineGoogle } from 'react-icons/ai'
import { FaGlobeAsia } from 'react-icons/fa'
import { FaMoon } from 'react-icons/fa6'
import type { FetchedAllEvents } from '@/services/hooks/date/getEvents.hook'
import {
	convertShamsiToHijri,
	filterGoogleEventsByDate,
	getGregorianEvents,
	getHijriEvents,
	getShamsiEvents,
} from '../../utils'
import { useDate } from '@/context/date.context'
import type { GoogleCalendarEvent } from '@/services/hooks/date/getGoogleCalendarEvents.hook'

export const CalendarDayDetails = (
	events: FetchedAllEvents,
	googleEvents: GoogleCalendarEvent[],
	eventIcon?: string
) => {
	const { selectedDate } = useDate()

	const todayShamsiEvents = getShamsiEvents(events, selectedDate)
	const todayHijriEvents = getHijriEvents(events, selectedDate)
	const todayGregorianEvents = getGregorianEvents(events, selectedDate)

	const isHoliday =
		selectedDate.day() === 5 ||
		todayShamsiEvents.some((event) => event.isHoliday) ||
		todayHijriEvents.some((event) => event.isHoliday)

	const dayEvent = [
		...todayShamsiEvents,
		...todayGregorianEvents,
		...todayHijriEvents,
	].sort((a) => (a.isHoliday ? -1 : 1))

	const hijri = convertShamsiToHijri(selectedDate)
	const gregorian = selectedDate.clone().doAsGregorian().format('YYYY MMMM DD')
	const jalali = selectedDate.format('jYYYY/jMM/jD')
	const jalaliDay = selectedDate.format('ddd')

	const dayGoogleEvents = filterGoogleEventsByDate(googleEvents, selectedDate)

	// is holiday style
	const holidayStyle = isHoliday
		? 'from-orange-600 to-red-700'
		: 'from-sky-500 to-blue-700'
	const headerStyle = `max-w-full py-1 px-3 rounded text-center text-white bg-gradient-to-r ${holidayStyle}`

	const infoStyle = 'text-base/80'
	const googleStyle = 'text-[#4285f4]'

	return (
		<div className="my-1 flex flex-col min-w-[250px] max-w-[250px] rounded-xl overflow-hidden">
			<div className={headerStyle}>
				<div
					className={`${holidayStyle} flex items-center justify-between gap-2`}
				>
					<div className="flex items-center gap-1">
						{eventIcon && (
							<img
								src={eventIcon}
								alt="مناسبت"
								className="object-cover w-6 h-6 transition-all rounded-full "
								onError={(e) => {
									e.currentTarget.style.display = 'none'
								}}
							/>
						)}
						<span className="text-sm truncate">{jalaliDay}</span>
					</div>

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
								{dayEvent.length} مناسبت
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
