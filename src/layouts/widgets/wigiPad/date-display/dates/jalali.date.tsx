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
	return (
		<>
			{isHoliday && <HolidayBadge />}
			<span className={`text-base !leading-none ${textColor}`}>
				{today.locale('fa').format('dddd')}
			</span>
			<div
				className={`text-7xl !leading-none font-sans font-bold transition-all duration-300 transform ${textColor}`}
			>
				{today.jDate()}
			</div>
			<div
				className={`text-lg font-medium transition-all duration-200 ${textColor}`}
			>
				{today.locale('fa').format('MMMM YYYY')}
			</div>
		</>
	)
}
