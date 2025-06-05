import { useDate } from '@/context/date.context'
import { useGetEvents } from '@/services/hooks/date/getEvents.hook'
import { combineAndSortEvents } from '../../tools/events/utils'
export function DateDisplay() {
	const { today, todayIsHoliday } = useDate()
	const { data: events } = useGetEvents()

	const sortedEvents = combineAndSortEvents(events, today.clone(), [])

	const isHoliday = sortedEvents.some((event) => event.isHoliday) || todayIsHoliday
	return (
		<div
			className={
				'relative flex flex-col items-center justify-center gap-2 p-1 overflow-hidden text-center border border-b-0 border-l-0 rounded border-content bg-content transition-all duration-500'
			}
		>
			{isHoliday && (
				<>
					<div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-error/5 via-transparent to-error/10" />

					<div className="absolute w-20 px-2 py-1 text-xs text-white transform -rotate-45 shadow-xl right-16 top-2 bg-error animate-pulse">
						<div className="relative z-10 font-semibold tracking-wide">تعطیل</div>
						<div className="absolute inset-0 opacity-50 bg-error/80 blur-sm" />
					</div>

					<div className="absolute w-2 h-2 rounded-full top-1 left-1 bg-error/30 animate-pulse" />
					<div className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-error/20 rounded-full animate-pulse delay-300" />
				</>
			)}
			<div
				className={`font-semibold transition-all duration-300 ${
					isHoliday ? 'text-error drop-shadow-sm' : 'text-content'
				}`}
			>
				{today.locale('fa').format('dddd')}
			</div>
			<div
				className={`text-5xl font-bold transition-all duration-300 ${
					isHoliday ? 'text-error drop-shadow-md' : 'text-content'
				}`}
			>
				{today.jDate()}
			</div>
			<div
				className={`flex flex-col text-center transition-all duration-300 ${
					isHoliday ? 'text-error drop-shadow-sm' : 'text-content'
				}`}
			>
				<div className="flex gap-0.5">
					<div className="font-medium">{today.locale('fa').format('jMMMM')}</div>
					<div className="font-medium">{today.locale('fa').jYear()}</div>
				</div>
			</div>
		</div>
	)
}
