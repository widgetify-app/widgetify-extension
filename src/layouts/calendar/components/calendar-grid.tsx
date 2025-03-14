import type jalaliMoment from 'jalali-moment'
import type React from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useTheme } from '../../../context/theme.context'
import { useTodoStore } from '../../../context/todo.context'
import { useGetEvents } from '../../../services/getMethodHooks/getEvents.hook'
import { formatDateStr } from '../utils'
import { DayItem } from './day'

const WEEKDAYS = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج']

interface CalendarGridProps {
	currentDate: jalaliMoment.Moment
	selectedDate: jalaliMoment.Moment
	setSelectedDate: (date: jalaliMoment.Moment) => void
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
	currentDate,
	selectedDate,
	setSelectedDate,
}) => {
	const { theme } = useTheme()
	const { data: events } = useGetEvents()
	const { todos } = useTodoStore()

	const firstDayOfMonth = currentDate.clone().startOf('jMonth').day()
	const daysInMonth = currentDate.clone().endOf('jMonth').jDate()
	const emptyDays = (firstDayOfMonth + 1) % 7
	const selectedDateStr = formatDateStr(selectedDate)

	const getWeekdayHeaderStyle = () => {
		return theme === 'light' ? 'text-gray-500' : 'text-gray-400'
	}

	return (
		<div className="grid grid-cols-7 px-3 text-center md:px-4">
			{WEEKDAYS.map((day) => (
				<div key={day} className={`py-2 text-sm ${getWeekdayHeaderStyle()}`}>
					{day}
				</div>
			))}

			{Array.from({ length: emptyDays }).map((_, i) => (
				<div key={`empty-${i}`} className="p-2" />
			))}

			{Array.from({ length: daysInMonth }, (_, i) => (
				<DayItem
					key={uuidv4()}
					currentDate={currentDate}
					day={i + 1}
					events={events}
					selectedDateStr={selectedDateStr}
					setSelectedDate={setSelectedDate}
					todos={todos}
				/>
			))}
		</div>
	)
}
