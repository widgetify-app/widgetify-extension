import { useDate } from '@/context/date.context'
import { combineAndSortEvents } from '@/layouts/widgets/tools/events/utils'
import { useGetEvents } from '@/services/hooks/date/getEvents.hook'
import { HolidayBadge } from '../components/holiday.badge'

export function JalaliDate() {
	const { today, todayIsHoliday } = useDate()
	const { data: events } = useGetEvents()
	const sortedEvents = combineAndSortEvents(events, today.clone(), [])
	const isHoliday = sortedEvents.some((event) => event.isHoliday) || todayIsHoliday
	const isDayTime = today.hour() >= 6 && today.hour() < 18

	const textColor = isHoliday
		? 'text-error drop-shadow-md'
		: isDayTime
			? 'text-content drop-shadow-md'
			: 'text-primary drop-shadow-sm'

	const gregorianDate = today.locale('en')

	const gFormatted = `${gregorianDate.format('YY')}/${gregorianDate.format('MMMM').slice(0, 3)}/${gregorianDate.format('DD')}`

	return (
		<>
			{isHoliday && <HolidayBadge />}
			<div className="flex flex-col items-center justify-center gap-4">
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
					<span className={`text-xs !leading-none ${textColor}`} dir="ltr">
						{gFormatted}
					</span>
				</div>
			</div>
		</>
	)
}
