import { motion } from 'framer-motion'
import type jalaliMoment from 'jalali-moment'
import type React from 'react'
import { useGetEvents } from '../../../services/getMethodHooks/getEvents.hook'
import type { TabType } from '../calendar'
import { DaySlider } from './day-slider'
import { Events } from './events/event'
import { TodoStats } from './todos/todo-stats'
import { Todos } from './todos/todos'

interface CalendarContentProps {
	activeTab: TabType
	selectedDate: jalaliMoment.Moment
	setSelectedDate: (date: jalaliMoment.Moment) => void
	currentDate: jalaliMoment.Moment
	setCurrentDate: (date: jalaliMoment.Moment) => void
}

export const CalendarContent: React.FC<CalendarContentProps> = ({
	activeTab,
	selectedDate,
	setSelectedDate,
	setCurrentDate,
}) => {
	const { data: events } = useGetEvents()

	return (
		<>
			<div className="mb-4">
				<DaySlider currentDate={selectedDate} onDateChange={setSelectedDate} />
			</div>

			{activeTab === 'events' && (
				<motion.div
					key="events-view"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
				>
					<Events
						events={events || []}
						currentDate={selectedDate}
						onDateChange={setCurrentDate}
					/>
				</motion.div>
			)}

			{activeTab === 'todos' && (
				<motion.div
					key="todos-view"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
				>
					<Todos currentDate={selectedDate} />
				</motion.div>
			)}

			{activeTab === 'todo-stats' && (
				<motion.div
					key="todo-stats-view"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
				>
					<TodoStats />
				</motion.div>
			)}
		</>
	)
}
