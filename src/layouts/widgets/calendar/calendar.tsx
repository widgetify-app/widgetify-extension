import { useDate } from '@/context/date.context'
import { useTheme } from '@/context/theme.context'
import type React from 'react'
import { useEffect, useState } from 'react'
import { CalendarContainer } from './components/calendar-container'
import { CalendarGrid } from './components/calendar-grid'
import { CalendarHeader } from './components/calendar-header'
import { DaySummary } from './components/day-summary'

export type TabType = 'events' | 'todos' | 'pomodoro' | 'religious-time'

const CalendarLayout: React.FC<any> = () => {
	const { theme } = useTheme()
	const { currentDate, selectedDate, setCurrentDate, setSelectedDate, goToToday } =
		useDate()
	const [isDrawerOpen, setIsDrawerOpen] = useState<boolean | null>(null)

	const handleTabClick = (tab: TabType) => {
		setIsDrawerOpen(true)
	}

	useEffect(() => {
		setIsDrawerOpen(true)
	}, [])

	if (isDrawerOpen === null) return <></>

	return (
		<div
			className={
				'transition-all duration-300 flex flex-col justify-start w-full min-h-80 max-h-80 gap-3 mb-1  md:flex-row'
			}
			dir="rtl"
		>
			<CalendarContainer
				className={
					'flex flex-col overflow-hidden md:flex-1 min-w-64 max-w-64 md:w-7/12 transition-all duration-300'
				}
				theme={theme}
			>
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

				<div className="flex-1">
					<DaySummary selectedDate={selectedDate} onTabClick={handleTabClick} />
				</div>
			</CalendarContainer>
		</div>
	)
}

export default CalendarLayout
