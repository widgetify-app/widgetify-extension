import { useTheme } from '@/context/theme.context'
import { TodoProvider } from '@/context/todo.context'
import type React from 'react'
import { useCallback, useState } from 'react'
import { CalendarContainer } from './components/calendar-container'
import { CalendarContent } from './components/calendar-content'
import { CalendarGrid } from './components/calendar-grid'
import { CalendarHeader } from './components/calendar-header'
import { DaySummary } from './components/day-summary'
import { TabNavigation } from './components/tab-navigation'
import { getCurrentDate } from './utils'

export type TabType = 'events' | 'todos' | 'todo-stats' | 'pomodoro' | 'religious-time'

const PersianCalendar: React.FC = () => {
	const { themeUtils } = useTheme()
	const today = getCurrentDate()
	const [currentDate, setCurrentDate] = useState(today)
	const [selectedDate, setSelectedDate] = useState(today.clone())
	const [activeTab, setActiveTab] = useState<TabType>('events')

	const handleTabClick = useCallback((tab: TabType) => {
		setActiveTab(tab)
	}, [])

	const goToToday = useCallback(() => {
		const realToday = getCurrentDate()
		setCurrentDate(realToday.clone())
		setSelectedDate(realToday.clone())
	}, [])

	return (
		<div
			className="flex flex-col justify-center w-full h-full gap-3 mb-1 sm:h-80 md:flex-row sm:"
			dir="rtl"
		>
			<CalendarContainer className="w-full overflow-hidden  md:w-7/12 md:flex-1">
				<CalendarHeader
					currentDate={currentDate}
					setCurrentDate={setCurrentDate}
					selectedDate={selectedDate}
					goToToday={goToToday}
				/>

				<CalendarGrid
					currentDate={currentDate}
					selectedDate={selectedDate}
					setSelectedDate={setSelectedDate}
				/>

				<div className={`px-4 mt-1 border-t ${themeUtils.getBorderColor()}`}>
					<div className="mt-1">
						<TabNavigation activeTab={activeTab} onTabClick={handleTabClick} />
					</div>

					<DaySummary selectedDate={selectedDate} onTabClick={handleTabClick} />
				</div>
			</CalendarContainer>

			<CalendarContainer className="w-full p-3 md:w-5/12 md:p-4">
				<CalendarContent
					activeTab={activeTab}
					selectedDate={selectedDate}
					setSelectedDate={setSelectedDate}
					currentDate={currentDate}
					setCurrentDate={setCurrentDate}
				/>
			</CalendarContainer>
		</div>
	)
}

const CalendarLayout = () => {
	return (
		<TodoProvider>
			<PersianCalendar />
		</TodoProvider>
	)
}

export default CalendarLayout
