import jalaliMoment from 'jalali-moment'
import type React from 'react'
import { useState } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6'
import { TodoProvider, useTodo } from '../../context/todo.context'
import { useGetEvents } from '../../services/getMethodHooks/getEvents.hook'
import { DayItem } from './components/day'
import { Events } from './components/events/event'
import { Todos } from './components/todos/todos'
import { formatDateStr } from './utils'

const PERSIAN_MONTHS = [
	'فروردین',
	'اردیبهشت',
	'خرداد',
	'تیر',
	'مرداد',
	'شهریور',
	'مهر',
	'آبان',
	'آذر',
	'دی',
	'بهمن',
	'اسفند',
]

const WEEKDAYS = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج']

export const PersianCalendar: React.FC = () => {
	const today = jalaliMoment()
	const [currentDate, setCurrentDate] = useState(today)
	const [selectedDate, setSelectedDate] = useState(today.clone())

	const firstDayOfMonth = currentDate.clone().startOf('jMonth').day()
	const { data: events } = useGetEvents()
	const daysInMonth = currentDate.clone().endOf('jMonth').jDate()
	const emptyDays = (firstDayOfMonth + 1) % 7
	const selectedDateStr = formatDateStr(selectedDate)
	const { todos } = useTodo()

	const changeMonth = (delta: number) => {
		setCurrentDate((prev) => prev.clone().add(delta, 'jMonth'))
	}

	return (
		<div className="flex gap-1 mb-1 lg:gap-2" dir="rtl">
			{/* Calendar Grid */}
			<div className="w-[22rem] overflow-hidden bg-neutral-900/70 backdrop-blur-sm rounded-xl">
				<div className="flex items-center justify-between p-4">
					<h3 className="text-xl font-medium text-gray-200">
						{PERSIAN_MONTHS[currentDate.jMonth()]} {currentDate.jYear()}
					</h3>
					<div className="flex gap-1">
						<button
							onClick={() => changeMonth(-1)}
							className="flex items-center gap-1 px-2 py-1 text-sm text-gray-300 rounded-lg hover:bg-neutral-800/50"
						>
							<FaChevronRight size={12} />
							<span>ماه قبل</span>
						</button>
						<button
							onClick={() => changeMonth(1)}
							className="flex items-center gap-1 px-2 py-1 text-sm text-gray-300 rounded-lg hover:bg-neutral-800/50"
						>
							<span>ماه بعد</span>
							<FaChevronLeft size={12} />
						</button>
					</div>
				</div>

				<div className="grid grid-cols-7 px-4 text-center">
					{WEEKDAYS.map((day) => (
						<div key={day} className="py-2 text-sm text-gray-400">
							{day}
						</div>
					))}

					{Array.from({ length: emptyDays }).map((_, i) => (
						<div key={`empty-${i}`} className="p-2" />
					))}

					{Array.from({ length: daysInMonth }, (_, i) => (
						<DayItem
							currentDate={currentDate}
							day={i + 1}
							events={events}
							selectedDateStr={selectedDateStr}
							setSelectedDate={setSelectedDate}
							todos={todos}
							key={i + 1}
						/>
					))}
				</div>

				<div className="p-4 pb-2 overflow-y-auto border-neutral-800/50 max-h-40 min-h-40">
					<Events events={events} currentDate={selectedDate} />
				</div>
			</div>

			{/* Tasks & Events Panel */}
			<div className="p-4 w-72 bg-neutral-900/70 backdrop-blur-sm rounded-xl">
				<h3 className="mb-4 text-xl font-medium text-gray-200">
					{PERSIAN_MONTHS[selectedDate.jMonth()]} {selectedDate.jDate()}
				</h3>

				<Todos currentDate={selectedDate} />
			</div>
		</div>
	)
}
const CalendarLayout = () => {
	return (
		<section className="w-full" dir="rtl">
			<TodoProvider>
				<PersianCalendar />
			</TodoProvider>
		</section>
	)
}

export default CalendarLayout
