import { useDate } from '@/context/date.context'
import { useGetEvents } from '@/services/hooks/date/getEvents.hook'
import { combineAndSortEvents } from '../../tools/events/utils'
export function DateDisplay() {
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
		<div
			className={
				'relative flex flex-col items-center justify-center gap-0.5 p-1 overflow-hidden text-center transition-all duration-500'
			}
		>
			{isHoliday && (
				<>
					<div className="absolute px-2 py-1 text-xs text-white transform rotate-45 shadow-xl -right-10 w-28 top-1 bg-error">
						<div className="relative z-10 font-semibold tracking-wide">
							تعطیل
						</div>
						<div className="absolute inset-0 opacity-50 bg-error/80 blur-sm" />
					</div>
					<div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-error/5 via-transparent to-error/10" />
					<div className="absolute w-2 h-2 rounded-full top-1 left-1 bg-error/30 animate-pulse" />
					<div className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-error/20 rounded-full animate-pulse delay-300" />{' '}
				</>
			)}

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
		</div>
	)
}
