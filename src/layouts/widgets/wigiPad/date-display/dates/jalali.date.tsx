import { useDate } from '@/context/date.context'
import { combineAndSortEvents } from '@/layouts/widgets/tools/events/utils'
import { useGetEvents } from '@/services/hooks/date/getEvents.hook'
import { HolidayBadge } from '../components/holiday.badge'

export function JalaliDate() {
	const { today, todayIsHoliday } = useDate()
	const { data: events } = useGetEvents()
	const eventsForCalendar = events || {
		gregorianEvents: [],
		hijriEvents: [],
		shamsiEvents: [],
	}
	const sortedEvents = combineAndSortEvents(eventsForCalendar, today.clone(), [])
	const isHoliday = sortedEvents.some((event) => event.isHoliday) || todayIsHoliday

	const textColor = 'text-content drop-shadow-md'
	const gregorianDate = today.clone().locale('en')

	const gFormatted = `${gregorianDate.format('YY')}/${gregorianDate.format('MM').slice(0, 3)}/${gregorianDate.format('DD')}`
	const jFormatted = `${today.format('YY')}/${today.format('MM').slice(0, 3)}/${today.format('DD')}`

	return (
		<>
			{isHoliday && <HolidayBadge />}
			<div className="flex flex-col items-center justify-center gap-4 mt-0.5">
				<span className={`text-base !leading-none ${textColor} mb-4`}>
					{today.locale('fa').format('dddd')}
				</span>
				<div
					className={`text-7xl font-bold leading-[1] h-[0.3em] flex items-center ${textColor}`}
				>
					{today.jDate()}
				</div>
				<div className="flex flex-col">
					<span
						className={`text-lg font-medium transition-all duration-200 ${textColor}`}
					>
						{today.locale('fa').format('MMMM YYYY')}
					</span>
					<div className={`text-xs opacity-90 ${textColor} px-0.5`} dir="ltr">
						<span>{gFormatted}</span>
						<span className="mx-1"></span>
						<span>{jFormatted}</span>
					</div>
				</div>
			</div>
		</>
	)
}
