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

const WEEKDAYS = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه']

export const PersianCalendar: React.FC = () => {
	const today = jalaliMoment()
	const [currentDate, setCurrentDate] = useState(today)
	const [selectedDate, setSelectedDate] = useState(today.clone())

	const firstDayOfMonth = currentDate.clone().startOf('jMonth').day()

	const { data: events } = useGetEvents()

	const daysInMonth = currentDate.clone().endOf('jMonth').jDate()

	const emptyDays = (firstDayOfMonth + 1) % 7

	const changeMonth = (delta: number) => {
		setCurrentDate((prev) => prev.clone().add(delta, 'jMonth'))
	}

	const selectedDateStr = formatDateStr(selectedDate)

	const { todos } = useTodo()
	return (
		<div className="grid gap-4 md:grid-cols-5" dir="rtl">
			<div className="p-4 md:col-span-3 bg-gradient-to-br from-neutral-100 to-neutral-50 dark:from-neutral-800 dark:to-neutral-900 rounded-xl backdrop-blur-sm lg:h-96">
				<div className="flex items-center justify-between mb-4">
					<h3 className="text-xl font-medium text-gray-500 dark:text-gray-100">
						{PERSIAN_MONTHS[currentDate.jMonth()]} {currentDate.jYear()}
					</h3>
					<div className="flex gap-2">
						<button
							onClick={() => changeMonth(-1)}
							className="flex flex-row-reverse items-center gap-1 p-2 text-gray-500 rounded-lg dark:text-gray-200 hover:text-gray-200 hover:bg-gray-700/50"
						>
							ماه قبل
							<FaChevronRight />
						</button>
						<button
							onClick={() => changeMonth(1)}
							className="flex flex-row-reverse items-center gap-1 p-2 text-gray-500 rounded-lg dark:text-gray-200 hover:text-gray-200 hover:bg-gray-700/50"
						>
							<FaChevronLeft />
							ماه بعد
						</button>
					</div>
				</div>

				<div className="grid grid-cols-7 gap-2">
					{WEEKDAYS.map((day) => (
						<div
							key={day}
							className="py-2 text-xs text-center text-gray-500 dark:text-gray-200"
						>
							{day}
						</div>
					))}

					{Array.from({ length: emptyDays }).map((_, i) => (
						<div key={`empty-${i}`} className="p-2" />
					))}

					{Array.from({ length: daysInMonth }, (_, i) => {
						return (
							<DayItem
								currentDate={currentDate}
								day={i + 1}
								events={events}
								selectedDateStr={selectedDateStr}
								setSelectedDate={setSelectedDate}
								todos={todos}
								key={i + 1}
							/>
						)
					})}
				</div>
			</div>

			<div className="p-4 md:col-span-2 bg-gradient-to-br from-neutral-100 to-neutral-50 dark:from-neutral-800 dark:to-neutral-900 rounded-xl backdrop-blur-sm">
				<h3 className="mb-4 text-xl font-medium text-gray-500 dark:text-gray-100">
					{PERSIAN_MONTHS[selectedDate.jMonth()]} {selectedDate.jDate()}
				</h3>

				{/* todos */}
				<Todos currentDate={selectedDate} />

				{/* events */}
				<Events events={events} currentDate={selectedDate} />
			</div>
		</div>
	)
}

const CalendarLayout = () => {
	return (
		<section className="p-2 mx-1 overflow-y-auto  rounded lg:mx-4 max-h-[calc(100vh-4rem)]">
			<div className="flex items-center justify-between w-full px-1 mb-4">
				<h2 className="text-lg font-semibold dark:text-gray-200 font-[balooTamma]">
					📅 Calender
				</h2>
				<div
					className="text-xs text-gray-400 font-[balooTamma] font-semibold flex items-center gap-1
                      hover:text-gray-300 cursor-pointer"
				>
					<span>-</span>
				</div>
			</div>
			<TodoProvider>
				<PersianCalendar />
			</TodoProvider>
		</section>
	)
}

export default CalendarLayout
