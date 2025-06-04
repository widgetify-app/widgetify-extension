import { useDate } from '@/context/date.context'
import { useGetEvents } from '@/services/hooks/date/getEvents.hook'
import { combineAndSortEvents } from '../../tools/events/utils'
export function DateDisplay() {
	const { today, todayIsHoliday } = useDate()
	const { data: events } = useGetEvents()

	const sortedEvents = combineAndSortEvents(events, today.clone(), [])

	const isHoliday = sortedEvents.some((event) => event.isHoliday) || todayIsHoliday
	return (
		<div className="relative flex flex-col items-center justify-center p-1 overflow-hidden text-center border border-b-0 border-l-0 rounded bg-content border-content">
			{isHoliday && (
				<div className="absolute w-20 px-2 py-1 text-xs text-white transform -rotate-45 shadow-md right-16 top-2 bg-error">
					تعطیل
				</div>
			)}
			<div className="font-semibold text-content">
				{today.locale('fa').format('dddd')}
			</div>
			<div className={'text-5xl text-content font-bold'}>{today.jDate()}</div>
			<div className={'flex flex-col  text-content text-center'}>
				<div className="flex gap-0.5">
					<div className="font-medium">{today.locale('fa').format('jMMMM')}</div>
					<div className="font-medium">{today.locale('fa').jYear()}</div>
				</div>
			</div>
		</div>
	)
}
