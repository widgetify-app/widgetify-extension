import { useAuth } from '@/context/auth.context'
import { motion } from 'framer-motion'
import type React from 'react'
import { useGetEvents } from '../../../services/getMethodHooks/getEvents.hook'
import { useGetGoogleCalendarEvents } from '../../../services/getMethodHooks/getGoogleCalendarEvents.hook'
import type { TabType } from '../calendar'
import type { WidgetifyDate } from '../utils'
import { Events } from './events/event'
import { PomodoroTimer } from './pomodoro/pomodoro-timer'
import { ReligiousTime } from './religious/religious-time'
import { TabNavigation } from './tab-navigation'
import { TodoStats } from './todos/todo-stats'
import { Todos } from './todos/todos'

interface CalendarContentProps {
	activeTab: TabType
	selectedDate: WidgetifyDate
	setSelectedDate: (date: WidgetifyDate) => void
	currentDate: WidgetifyDate
	setCurrentDate: (date: WidgetifyDate) => void
	onTabClick?: (tab: TabType) => void
}

export const CalendarContent: React.FC<CalendarContentProps> = ({
	activeTab,
	selectedDate,
	setCurrentDate,
	onTabClick,
}) => {
	const { data: events } = useGetEvents()
	const { user } = useAuth()

	const startOfMonth = selectedDate.clone().startOf('jMonth').toDate()
	const endOfMonth = selectedDate.clone().endOf('jMonth').toDate()

	const { data: googleEvents } = useGetGoogleCalendarEvents(
		user?.connections?.includes('google') || false,
		startOfMonth,
		endOfMonth,
	)

	return (
		<>
			<div className="mb-2">
				<TabNavigation activeTab={activeTab} onTabClick={onTabClick || (() => {})} />
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
						googleEvents={googleEvents || []}
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
