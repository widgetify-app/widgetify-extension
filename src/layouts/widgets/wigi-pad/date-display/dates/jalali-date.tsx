import { useGeneralSetting } from '@/context/general-setting.context'
import { combineAndSortEvents } from '@widget/calendar/utils/combine-events'
import { useGetEvents } from '@/services/hooks/date/get-events.hook'
import { convertShamsiToHijri, getCurrentDate, hijriMonthNames } from '@widget/calendar/utils/date-events'
import { useGetWeatherByLatLon } from '@/services/hooks/weather/get-weather-by-lat-lon.hook'
import { InlineWeather } from '../../weather/simple-weather'

export function JalaliDate() {
	const { selected_timezone: timezone } = useGeneralSetting()
	const today = getCurrentDate(timezone.value)
	const { data: events } = useGetEvents()
	const eventsForCalendar = events || {
		gregorianEvents: [],
		hijriEvents: [],
		shamsiEvents: [],
	}
	const sortedEvents = combineAndSortEvents(eventsForCalendar, today.clone(), [])
	const todayIsHoliday = today.day() === 5
	const isHoliday = sortedEvents.some((event) => event.isHoliday) || todayIsHoliday

	const textColor = 'text-content drop-shadow-md'

	const gregorianShort = today.doAsGregorian().format('D MMM')

	const hijriDate = convertShamsiToHijri(today)
	const hijriRaw = `${hijriDate.iYear()}/${hijriDate.iMonth() + 1}/${hijriDate.iDate()}`
	const [_, hijriMonth, hijriDateDay] = hijriRaw.split('/')
	const hijriMonthName = hijriMonthNames[Number(hijriMonth) - 1] || hijriMonth
	const { data: weather } = useGetWeatherByLatLon(false)

	return (
		<>
			{isHoliday && (
				<div className="absolute px-1 py-0.5 text-xs transform rotate-45 shadow-xl text-white -right-10 w-28 top-1 bg-error/80">
					<div className="relative z-10 font-normal text-[10px] tracking-wide">
						تعطیل
					</div>
				</div>
			)}
			<div className="relative flex flex-col items-center justify-center gap-3.5 mt-0.5">
				<span className={`text-base !leading-none ${textColor} mb-4`}>
					{today.locale('fa').format('dddd')}
				</span>
				<div
					className={`text-5xl font-bold leading-[1] h-[0.3em] flex items-center ${textColor}`}
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
						{hijriDateDay} {hijriMonthName}
					</span>
					<InlineWeather weather={weather} hasBanner={false} />
				</div>
			</div>
		</>
	)
}
