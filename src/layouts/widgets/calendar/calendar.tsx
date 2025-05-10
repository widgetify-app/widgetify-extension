import { useDate } from '@/context/date.context'
import type React from 'react'
import { useEffect, useState } from 'react'
import { WidgetContainer } from '../widget-container'
import { CalendarGrid } from './components/calendar-grid'
import { CalendarHeader } from './components/calendar-header'
import { DaySummary } from './components/day-summary'

export type TabType = 'events' | 'todos' | 'pomodoro' | 'religious-time'

const CalendarLayout: React.FC<any> = () => {
	const { currentDate, selectedDate, setCurrentDate, setSelectedDate, goToToday } =
		useDate()
	const [isDrawerOpen, setIsDrawerOpen] = useState<boolean | null>(null)

	useEffect(() => {
		setIsDrawerOpen(true)
	}, [])

	if (isDrawerOpen === null) return <></>

	return (
		<WidgetContainer
			className={
				'flex flex-col overflow-hidden md:flex-1 min-w-64 max-w-64 md:w-7/12 transition-all duration-300'
			}
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
				<DaySummary selectedDate={selectedDate} />
			</div>
		</WidgetContainer>
	)
}

export default CalendarLayout
