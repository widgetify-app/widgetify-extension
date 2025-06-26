import { useDate } from '@/context/date.context'
import { useGetEvents } from '@/services/hooks/date/getEvents.hook'
import { combineAndSortEvents } from '../../tools/events/utils'
export function DateDisplay() {
	const { today, todayIsHoliday } = useDate()
	const { data: events } = useGetEvents()
	const sortedEvents = combineAndSortEvents(events, today.clone(), [])
	const isHoliday = sortedEvents.some((event) => event.isHoliday) || todayIsHoliday
	const isDayTime = today.hour() >= 6 && today.hour() < 18

	return (
		<div
			className={
				'relative flex flex-col items-center justify-center gap-0.5 p-1 overflow-hidden text-center transition-all duration-500'
			}
		>
			<span
				className={`text-base !leading-none ${
					isHoliday
						? 'text-error drop-shadow-md'
						: 'text-content drop-shadow-md'
				}`}
			>
				{today.locale('fa').format('dddd')}
			</span>
			<div
				className={`text-7xl text-center !leading-none font-sans font-bold transition-all duration-300 transform ${
					isHoliday
						? 'text-error drop-shadow-md'
						: isDayTime
							? 'text-content drop-shadow-md'
							: 'text-primary drop-shadow-sm'
				}`}
			>
				{today.jDate()}
			</div>
			<div className="text-lg font-medium transition-all duration-200">
				{today.locale('fa').format('MMMM')}
			</div>
		</div>
	)
}
