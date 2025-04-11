import type { GoogleCalendarEvent } from '@/services/getMethodHooks/getGoogleCalendarEvents.hook'
import moment from 'jalali-moment'
import { AiOutlineGoogle } from 'react-icons/ai'
import { FaCalendarAlt, FaGlobeAsia } from 'react-icons/fa'
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
) => {
	const hijri = convertShamsiToHijri(cellDate)
	const gregorian = cellDate.clone().doAsGregorian().format('YYYY MMMM DD')
	const jalali = cellDate.format('jYYYY/jMM/jD ddd')

	const dayGoogleEvents = googleEvents
		? filterGoogleEventsByDate(googleEvents, cellDate)
		: []

	const headerStyle =
		'max-w-full p-1 text-center text-white bg-gradient-to-r from-blue-500 to-indigo-600'

	const adBackgroundStyle =
		theme === 'light'
			? 'bg-gradient-to-r from-blue-50 via-indigo-50 to-violet-50'
			: theme === 'dark'
				? 'bg-gradient-to-r from-blue-900/20 via-indigo-900/20 to-violet-900/20'
				: 'bg-black/20 backdrop-blur-sm'

	const brandStyle = theme === 'light' ? 'text-indigo-600' : 'text-indigo-400'
	const infoStyle = theme === 'light' ? 'text-gray-600' : 'text-gray-400'
	const googleStyle = theme === 'light' ? 'text-[#4285f4]' : 'text-[#8ab4f8]'

	return (
		<div className="flex flex-col min-w-[200px] rounded-md overflow-hidden">
			<div className={headerStyle}>
				<div className="flex items-center justify-center gap-2">
					<FaCalendarAlt className="text-white/80" />
					<span className="text-sm font-bold truncate">{jalali}</span>
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

			<div className="mt-2 border-t border-gray-200 dark:border-gray-700">
				<div
					className={`px-3 py-2.5 text-xs text-center rounded-b-md ${adBackgroundStyle}`}
				>
					<span className={`font-semibold ${brandStyle}`}>ویجتی‌فای</span>
					<span className={`font-light ${infoStyle}`}>
						{' '}
						| این فیچر به پیشنهاد شما ایجاد شده است.
					</span>
				</div>
			</div>
		</div>
	)
}
