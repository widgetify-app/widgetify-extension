import jalaliMoment from 'jalali-moment'
import type { FetchedAllEvents } from '../../../services/getMethodHooks/getEvents.hook'
import type { Todo } from '../interface/todo.interface'
import { formatDateStr, getHijriEvents, getShamsiEvents } from '../utils'
interface DayItemProps {
	day: number
	currentDate: jalaliMoment.Moment
	events: FetchedAllEvents
	todos: Todo[]
	selectedDateStr: string
	setSelectedDate: (date: jalaliMoment.Moment) => void
}
export function DayItem({
	day,
	currentDate,
	events,
	todos,
	selectedDateStr,
	setSelectedDate,
}: DayItemProps) {
	const cellDate = currentDate.clone().jDate(day)

	const dateStr = formatDateStr(cellDate)

	const todayShamsiEvent = getShamsiEvents(events, cellDate)
	const todayHijriEvent = getHijriEvents(events, cellDate)

	const hasEvent = todayShamsiEvent.length || todayHijriEvent.length

	const hasTodo = todos.some((todo) => todo.date === dateStr)

	const isSelected = selectedDateStr === dateStr

	const isHoliday =
		cellDate.day() === 5 ||
		todayShamsiEvent.some((event) => event.isHoliday) ||
		todayHijriEvent.some((event) => event.isHoliday)

	return (
		<button
			key={day}
			onClick={() => setSelectedDate(cellDate)}
			className={`
					relative p-2 rounded-lg text-sm transition-colors
					${isHoliday ? 'text-red-400' : 'text-gray-600 dark:text-gray-300'}
					${isSelected ? 'bg-blue-500/20' : 'hover:bg-gray-700/50'}
					${todayShamsiEvent || hasTodo ? 'font-bold' : ''}
					${isToday(cellDate) ? 'ring-2 ring-blue-500' : ''}
				`}
		>
			{day}
			<div className="absolute flex gap-1 -translate-x-1/2 bottom-1 left-1/2">
				{hasEvent ? <span className="w-1 h-1 bg-blue-500 rounded-full" /> : null}
				{hasTodo ? <span className="w-1 h-1 bg-green-500 rounded-full" /> : null}
			</div>
		</button>
	)
}

const isToday = (date: jalaliMoment.Moment) => {
	const today = jalaliMoment()
	return (
		date.jDate() === today.jDate() &&
		date.jMonth() === today.jMonth() &&
		date.jYear() === today.jYear()
	)
}
