import { useTheme } from '@/context/theme.context'
import { useTodoStore } from '@/context/todo.context'
import { useGetEvents } from '@/services/getMethodHooks/getEvents.hook'
import type React from 'react'
import { v4 as uuidv4 } from 'uuid'
import { type WidgetifyDate, formatDateStr } from '../utils'
import { DayItem } from './day/day'

const WEEKDAYS = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج']

interface CalendarGridProps {
	currentDate: WidgetifyDate
	selectedDate: WidgetifyDate
	setSelectedDate: (date: WidgetifyDate) => void
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
		<div className="grid grid-cols-7 px-1 text-center h-[50%] md:px-4">
			{WEEKDAYS.map((day) => (
				<div key={day} className={`text-sm ${getWeekdayHeaderStyle()}`}>
					{day}
				</div>
			))}

			{Array.from({ length: emptyDays }).map((_, i) => (
				<div key={`empty-${i}`} className="p-1" />
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
