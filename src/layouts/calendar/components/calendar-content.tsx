import { motion } from 'framer-motion'
import type React from 'react'
import { useEffect, useState } from 'react'
import { useGetEvents } from '../../../services/getMethodHooks/getEvents.hook'
import type { TabType } from '../calendar'
import type { WidgetifyDate } from '../utils'
import { DaySlider } from './day-slider'
import { Events } from './events/event'
import { PomodoroTimer } from './pomodoro/pomodoro-timer'
import { TodoStats } from './todos/todo-stats'
import { Todos } from './todos/todos'
import { ReligiousTime } from './religious/religious-time'


interface CalendarContentProps {
	activeTab: TabType
	selectedDate: WidgetifyDate
	setSelectedDate: (date: WidgetifyDate) => void
	currentDate: WidgetifyDate
	setCurrentDate: (date: WidgetifyDate) => void
}

export const CalendarContent: React.FC<CalendarContentProps> = ({
	activeTab,
	selectedDate,
	setSelectedDate,
	setCurrentDate,
}) => {
	const { data: events } = useGetEvents()
	const [showSlider, setShowSlider] = useState(true)

	useEffect(() => {
		if (activeTab === 'pomodoro') {
			setShowSlider(false)
		} else {
			setShowSlider(true)
		}
	}, [activeTab])
	return (
		<>
			{showSlider ? (
				<div className="mb-4">
					<DaySlider currentDate={selectedDate} onDateChange={setSelectedDate} />
				</div>
			) : null}

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
			{activeTab === 'religious-time' && (
				<motion.div
					key="religious-time-view"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
				>
					<ReligiousTime
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

			{activeTab === 'pomodoro' && (
				<motion.div
					key="pomodoro-view"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
				>
					<PomodoroTimer />
				</motion.div>
			)}
		</>
	)
}
