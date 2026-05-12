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

	const gFormatted = gregorianDate.format('YY/MM/DD')
	const jFormatted = today.format('YY/MM/DD')

	return (
		<>
			{isHoliday && <HolidayBadge />}
			<div className="flex flex-col items-center justify-center gap-3.5 mt-0.5">
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
					<div className={`opacity-90 ${textColor}`} dir="ltr">
						<span className="text-[10px]">{gFormatted}</span>
						<span className="mx-1"></span>
						<span className="text-[10px]" dir="">
							{jFormatted}
						</span>
					</div>
				</div>
			</div>
		</>
	)
}
