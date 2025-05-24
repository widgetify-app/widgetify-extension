import { useAuth } from '@/context/auth.context'
import { useTodoStore } from '@/context/todo.context'
import { useGetEvents } from '@/services/hooks/date/getEvents.hook'
import { useGetGoogleCalendarEvents } from '@/services/hooks/date/getGoogleCalendarEvents.hook'
import type React from 'react'
import { FiCalendar, FiClipboard } from 'react-icons/fi'
import { type WidgetifyDate, formatDateStr } from '../utils'
import { getGregorianEvents, getHijriEvents, getShamsiEvents } from '../utils'

interface DaySummaryProps {
	selectedDate: WidgetifyDate
}

export const DaySummary: React.FC<DaySummaryProps> = ({ selectedDate }) => {
	const { user } = useAuth()
	const { todos } = useTodoStore()
	const { data: events } = useGetEvents()

	const startOfMonth = selectedDate.clone().startOf('jMonth').toDate()
	const endOfMonth = selectedDate.clone().endOf('jMonth').toDate()

	const { data: googleEvents } = useGetGoogleCalendarEvents(
		user?.connections?.includes('google') || false,
		startOfMonth,
		endOfMonth,
	)

	const selectedDateStr = formatDateStr(selectedDate)

	const googleEventsForSelectedDate = googleEvents.filter((event) => {
		if (!event || !event.start || !event.start.dateTime) {
			return false
		}

		const eventDateStr = event.start.dateTime.split('T')[0]
		const dateStr = selectedDate.clone().locale('en').format('YYYY-MM-DD')
		return eventDateStr === dateStr
	})

	const googleEventCount = googleEventsForSelectedDate.length

	const todosForSelectedDate = todos.filter((todo) => todo.date === selectedDateStr)

	const completedTodos = todosForSelectedDate.filter((todo) => todo.completed).length
	const totalTodos = todosForSelectedDate.length

	const shamsiEvents = events ? getShamsiEvents(events, selectedDate) : []
	const gregorianEvents = events ? getGregorianEvents(events, selectedDate) : []
	const hijriEvents = events ? getHijriEvents(events, selectedDate) : []
	const allEvents = [...shamsiEvents, ...gregorianEvents, ...hijriEvents]
	const totalEventsCount = allEvents.length + googleEventCount

	const holidayEvents = allEvents.filter((event) => event.isHoliday).length

	return (
		<div className={'overflow-hidden bg-base-200/80 rounded-lg'}>
			<div className="px-2 pt-1 pb-2">
				<h3 className={'text-xs text-center font-medium mb-1 widget-tem-text truncate'}>
					خلاصه روز {selectedDate.format('jD jMMMM')}
				</h3>

				<div className="grid grid-cols-2 gap-1">
					<div
						className={
							'p-1 rounded-lg cursor-pointer bg-base-100 flex items-center opacity-80 hover:opacity-100 transition-all duration-200'
						}
					>
						<FiCalendar
							className={`text-base ml-2 flex-shrink-0 ${totalEventsCount > 0 ? 'text-blue-500' : 'text-gray-400'}`}
						/>
						<div className="flex-1 min-w-0">
							{' '}
							<div className={'text-xs font-medium widget-item-text truncate'}>
								{totalEventsCount} رویداد
							</div>
							<div className={'text-[.50rem] widget-item-sub-text truncate'}>
								{googleEventCount > 0 && `${googleEventCount} رویداد گوگل • `}
								{holidayEvents > 0 ? `${holidayEvents} رویداد تعطیل` : 'بدون تعطیلی'}
							</div>
						</div>
					</div>

					{/* Todos card */}
					<div
						className={
							'p-1 rounded-lg cursor-pointer bg-base-100 flex items-center opacity-80 hover:opacity-100 transition-all duration-200'
						}
					>
						<FiClipboard
							className={`text-base ml-2 flex-shrink-0 ${totalTodos > 0 ? 'text-green-500' : 'text-gray-400'}`}
						/>
						<div className="flex-1 min-w-0">
							{' '}
							<div className={'text-xs font-medium widget-item-text truncate'}>
								{totalTodos} وظیفه
							</div>
							<div className={'text-[.50rem] widget-item-sub-text truncate'}>
								{totalTodos > 0
									? `${completedTodos} از ${totalTodos} تکمیل شده`
									: 'بدون وظیفه'}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
