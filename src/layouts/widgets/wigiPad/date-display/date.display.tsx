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
				'relative flex flex-col items-center justify-center gap-2 p-1 overflow-hidden text-center border border-b-0 border-l-0 rounded border-content bg-content transition-all duration-500'
			}
		>
			{isHoliday && (
				<>
					<div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-error/5 via-transparent to-error/10" />
					<div className="absolute w-20 px-2 py-1 text-xs text-white transform -rotate-45 shadow-xl right-16 top-2 bg-error animate-pulse">
						<div className="relative z-10 font-semibold tracking-wide">
							تعطیل
						</div>
						<div className="absolute inset-0 opacity-50 bg-error/80 blur-sm" />
					</div>
					<div className="absolute w-2 h-2 rounded-full top-1 left-1 bg-error/30 animate-pulse" />
					<div className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-error/20 rounded-full animate-pulse delay-300" />{' '}
				</>
			)}

			{!isHoliday && isDayTime && (
				<>
					<div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-yellow-500/3 via-transparent to-orange-500/5" />
					<div className="absolute w-1 h-1 rounded-full top-1 right-1 bg-yellow-400/40 animate-pulse" />
					<div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-orange-400/30 rounded-full animate-pulse delay-500" />
				</>
			)}

			{/* Night time */}
			{!isHoliday && !isDayTime && (
				<>
					<div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-blue-500/3 via-transparent to-purple-500/5" />
					<div className="absolute top-2 left-3 w-0.5 h-0.5 bg-blue-300/30 rounded-full animate-pulse" />
					<div className="absolute bottom-3 right-3 w-0.5 h-0.5 bg-purple-300/25 rounded-full animate-pulse delay-1000" />
				</>
			)}

			<div
				className={`font-semibold transition-all duration-300 ${
					isHoliday
						? 'text-error drop-shadow-sm'
						: isDayTime
							? 'text-content drop-shadow-md'
							: 'text-primary drop-shadow-sm'
				}`}
			>
				{today.locale('fa').format('dddd')}
			</div>
			<div
				className={`text-5xl font-bold transition-all duration-300 hover:scale-105 transform ${
					isHoliday
						? 'text-error drop-shadow-md'
						: isDayTime
							? 'text-content drop-shadow-md'
							: 'text-primary drop-shadow-sm'
				}`}
			>
				{today.jDate()}
			</div>
			<div
				className={`flex flex-col text-center transition-all duration-300 ${
					isHoliday
						? 'text-error drop-shadow-sm'
						: isDayTime
							? 'text-content drop-shadow-md'
							: 'text-primary drop-shadow-sm'
				}`}
			>
				<div className="flex gap-0.5 hover:gap-1 transition-all duration-200">
					<div className="font-medium transition-all duration-200 hover:font-semibold">
						{today.locale('fa').format('jMMMM')}
					</div>
					<div className="font-medium transition-all duration-200 hover:font-semibold">
						{today.locale('fa').jYear()}
					</div>
				</div>
			</div>
		</div>
	)
}
