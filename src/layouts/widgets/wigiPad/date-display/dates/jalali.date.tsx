import { useDate } from '@/context/date.context'
import { combineAndSortEvents } from '@/layouts/widgets/tools/events/utils'
import { useGetEvents } from '@/services/hooks/date/getEvents.hook'
import { HolidayBadge } from '../components/holiday.badge'
import { hijriMonthNames } from '@/layouts/widgets/calendar/utils'
import { useGetWeatherByLatLon } from '@/services/hooks/weather/getWeatherByLatLon'
import { SimpleWeather } from '../../weather/simple-weather'

export function JalaliDate() {
	const { today, todayIsHoliday, getHijriDate } = useDate()
	const { data: events } = useGetEvents()
	const eventsForCalendar = events || {
		gregorianEvents: [],
		hijriEvents: [],
		shamsiEvents: [],
	}
	const sortedEvents = combineAndSortEvents(eventsForCalendar, today.clone(), [])
	const isHoliday = sortedEvents.some((event) => event.isHoliday) || todayIsHoliday

	const textColor = 'text-content drop-shadow-md'

	const gregorianShort = today.doAsGregorian().format('D MMM')

	const hijriRaw = getHijriDate(today)
	const [_, hijriMonth, hijriDate] = hijriRaw.split('/')
	const hijriMonthName = hijriMonthNames[Number(hijriMonth) - 1] || hijriMonth
	const { data: weather } = useGetWeatherByLatLon(false)

	return (
		<>
			{isHoliday && <HolidayBadge />}
			<div className="relative flex flex-col items-center justify-center gap-3.5 mt-0.5">
				<span className={`text-base !leading-none ${textColor} mb-4`}>
					{today.locale('fa').format('dddd')}
				</span>
				<div
					className={`text-6xl font-bold leading-[1] h-[0.3em] flex items-center ${textColor}`}
				>
					{today.jDate()}
				</div>
				<div className="flex flex-col">
					<div
						className={`text-lg font-medium transition-all duration-200 ${textColor}`}
					>
						{today.locale('fa').format('MMMM')}{' '}
						<span className="text-sm">
							{today.locale('fa').format('YYYY')}
						</span>
					</div>
					<span className={`text-[10px]  text-base-content/70`}>
						{gregorianShort} <span className="mx-1 opacity-50">·</span>
						{hijriDate} {hijriMonthName}
					</span>
					<SimpleWeather weather={weather} hasBanner={false} />
				</div>
			</div>
		</>
	)
}
