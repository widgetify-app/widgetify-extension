import type { GoogleCalendarEvent } from '@/services/getMethodHooks/getGoogleCalendarEvents.hook'
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
	theme: string,
	googleEvents?: GoogleCalendarEvent[],
	isHoliday?: boolean,
) => {
	const hijri = convertShamsiToHijri(cellDate)
	const gregorian = cellDate.clone().doAsGregorian().format('YYYY MMMM DD')
	const jalali = cellDate.format('jYYYY/jMM/jD')
	const jalaliDay = cellDate.format('ddd')

	const dayGoogleEvents = googleEvents
		? filterGoogleEventsByDate(googleEvents, cellDate)
		: []

	// is holiday style
	const holidayStyle = isHoliday
		? 'from-orange-600 to-red-700'
		: 'from-sky-500 to-blue-700'
	const headerStyle = `max-w-full py-1 px-3 rounded-lg text-center text-white bg-gradient-to-r ${holidayStyle}`

	const infoStyle = theme === 'light' ? 'text-gray-600' : 'text-gray-400'
	const googleStyle = theme === 'light' ? 'text-[#4285f4]' : 'text-[#8ab4f8]'

	return (
		<div className="flex flex-col min-w-[200px] rounded-lg overflow-hidden">
			<div className={headerStyle}>
				<div className="flex items-center justify-between gap-2 ${holidayStyle}">
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
						<AiOutlineGoogle className={`mt-1 flex-shrink-0 ${googleStyle}`} />
						<div className="flex-1">
							<div className={`text-sm font-medium ${googleStyle}`}>
								{dayGoogleEvents.length} تقویم گوگل
							</div>
							{dayGoogleEvents.slice(0, 2).map((event, index) => (
								<div key={index} className={`text-xs mt-1 truncate ${infoStyle}`}>
									• {event.summary} - ({moment(event.start.dateTime).format('HH:mm')})
								</div>
							))}
							{dayGoogleEvents.length > 2 && (
								<div className={`text-xs mt-1 ${infoStyle}`}>...</div>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
