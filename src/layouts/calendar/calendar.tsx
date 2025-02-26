import { motion } from 'framer-motion'
import jalaliMoment from 'jalali-moment'
import { AnimatePresence } from 'motion/react'
import type React from 'react'
import { useState } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6'
import { TodoProvider, useTodoStore } from '../../context/todo.context'
import { useGetEvents } from '../../services/getMethodHooks/getEvents.hook'
import { DayItem } from './components/day'
import { Events } from './components/events/event'
import { TodoStats } from './components/todos/todo-stats'
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
	const today = jalaliMoment().locale('fa').utc().add(3.5, 'hours')
	const [currentDate, setCurrentDate] = useState(today)
	const [selectedDate, setSelectedDate] = useState(today.clone())

	const firstDayOfMonth = currentDate.clone().startOf('jMonth').day()
	const { data: events } = useGetEvents()
	const daysInMonth = currentDate.clone().endOf('jMonth').jDate()
	const emptyDays = (firstDayOfMonth + 1) % 7
	const selectedDateStr = formatDateStr(selectedDate)
	const { todos } = useTodoStore()

	const changeMonth = (delta: number) => {
		setCurrentDate((prev) => prev.clone().add(delta, 'jMonth'))
	}

	return (
		<div className="flex flex-col justify-center w-full gap-3 mb-1 md:flex-row" dir="rtl">
			{/* Calendar Grid */}
			<div className="w-full overflow-hidden md:flex-1 bg-neutral-900/70 backdrop-blur-sm rounded-xl">
				<div className="flex items-center justify-between p-3 md:p-4">
					<h3 className="text-lg font-medium text-gray-200 md:text-xl">
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

				<div className="grid grid-cols-7 px-3 text-center md:px-4">
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

				<div className="px-3 md:px-4 border-neutral-800/50">
					<Events events={events} currentDate={selectedDate} />
				</div>
			</div>

			{/* Tasks  */}
			<div className="w-full md:w-80 p-3 md:p-4 h-auto min-h-[16rem] md:h-[27rem] bg-neutral-900/70 backdrop-blur-sm rounded-xl">
				<h3 className="mb-3 text-lg font-medium text-gray-200 md:mb-4 md:text-xl">
					{PERSIAN_MONTHS[selectedDate.jMonth()]} {selectedDate.jDate()}
				</h3>

				<Todos currentDate={selectedDate} />
			</div>
		</div>
	)
}

const CalendarLayout = () => {
	const [activeTab, setActiveTab] = useState<'calendar' | 'stats'>('calendar')

	return (
		<section dir="rtl">
			<TodoProvider>
				<AnimatePresence mode="wait">
					{activeTab === 'calendar' ? (
						<motion.div
							key="calendar"
							className="min-h-[16rem] md:min-h-96 md:max-h-96"
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: 20 }}
							transition={{ duration: 0.3 }}
						>
							<PersianCalendar />
						</motion.div>
					) : (
						<motion.div
							key="stats"
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: 20 }}
							transition={{ duration: 0.3 }}
							className="w-full max-w-2xl p-3 md:p-4 mx-auto min-h-[16rem] md:min-h-96 md:max-h-96 bg-neutral-900/70 backdrop-blur-sm rounded-xl"
						>
							<h2 className="mb-3 text-lg font-medium text-gray-200 md:mb-4 md:text-xl">
								آمار و تحلیل یادداشت‌ها
							</h2>
							<TodoStats />
						</motion.div>
					)}
				</AnimatePresence>
			</TodoProvider>

			<motion.div
				className="relative justify-center hidden mb-3 md:mb-4 md:flex"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3, delay: 0.2 }}
			>
				<div className="absolute inline-flex p-1 left-3 bottom-[10rem] md:bottom-[20.9rem] bg-neutral-900/70 backdrop-blur-sm rounded-xl">
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={() => setActiveTab('calendar')}
						className={`px-3 md:px-4 py-2 rounded-lg transition-colors ${
							activeTab === 'calendar'
								? 'bg-blue-500 text-white'
								: 'text-gray-400 hover:text-gray-300'
						}`}
					>
						تقویم
					</motion.button>
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={() => setActiveTab('stats')}
						className={`px-3 md:px-4 py-2 rounded-lg transition-colors ${
							activeTab === 'stats'
								? 'bg-blue-500 text-white'
								: 'text-gray-400 hover:text-gray-300'
						}`}
					>
						آمار
					</motion.button>
				</div>
			</motion.div>
		</section>
	)
}

export default CalendarLayout
