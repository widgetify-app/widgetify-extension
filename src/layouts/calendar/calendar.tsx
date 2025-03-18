import { AnimatePresence, motion } from 'framer-motion'
import jalaliMoment from 'jalali-moment'
import type React from 'react'
import { useCallback, useState } from 'react'
import { useTheme } from '@/context/theme.context'
import { TodoProvider } from '@/context/todo.context'
import { CalendarContainer } from './components/calendar-container'
import { CalendarContent } from './components/calendar-content'
import { CalendarGrid } from './components/calendar-grid'
import { CalendarHeader } from './components/calendar-header'
import { DaySummary } from './components/day-summary'
import { TabNavigation } from './components/tab-navigation'

export type TabType = 'events' | 'todos' | 'todo-stats' | 'pomodoro'

const PersianCalendar: React.FC = () => {
	const { themeUtils } = useTheme()
	const today = jalaliMoment().locale('fa').utc().add(3.5, 'hours')
	const [currentDate, setCurrentDate] = useState(today)
	const [selectedDate, setSelectedDate] = useState(today.clone())
	const [activeTab, setActiveTab] = useState<TabType>('events')

	const handleTabClick = useCallback((tab: TabType) => {
		setActiveTab(tab)
	}, [])

	const goToToday = useCallback(() => {
		const realToday = jalaliMoment().locale('fa').utc().add(3.5, 'hours')
		setCurrentDate(realToday.clone())
		setSelectedDate(realToday.clone())
	}, [])

	return (
		<div className="flex flex-col justify-center w-full gap-3 mb-1 md:flex-row" dir="rtl">
			<CalendarContainer className="w-full overflow-hidden md:flex-1">
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

				<div className={`px-3 md:px-4 mt-2 border-t ${themeUtils.getBorderColor()}`}>
					<div className="mt-2">
						<TabNavigation activeTab={activeTab} onTabClick={handleTabClick} />
					</div>

					<DaySummary selectedDate={selectedDate} onTabClick={handleTabClick} />
				</div>
			</CalendarContainer>

			<CalendarContainer className="w-full md:w-80 p-3 md:p-4 h-auto min-h-[16rem] md:h-[27rem]">
				<AnimatePresence mode="wait">
					<CalendarContent
						activeTab={activeTab}
						selectedDate={selectedDate}
						setSelectedDate={setSelectedDate}
						currentDate={currentDate}
						setCurrentDate={setCurrentDate}
					/>
				</AnimatePresence>
			</CalendarContainer>
		</div>
	)
}

const CalendarLayout = () => {
	return (
		<section dir="rtl">
			<TodoProvider>
				<motion.div
					key="calendar"
					className="min-h-[16rem] md:min-h-96 md:max-h-[38rem]"
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					exit={{ opacity: 0, x: 20 }}
					transition={{ duration: 0.3 }}
				>
					<PersianCalendar />
				</motion.div>
			</TodoProvider>
		</section>
	)
}

export default CalendarLayout
