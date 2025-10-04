import type React from 'react'
import { useDate } from '@/context/date.context'
import { WidgetContainer } from '../widget-container'
import { CalendarGrid } from './components/calendar-grid'
import { CalendarHeader } from './components/calendar-header'
import { DaySummary } from './components/day-summary'

const CalendarLayout: React.FC<any> = () => {
	const { currentDate, selectedDate, setCurrentDate, setSelectedDate, goToToday } =
		useDate()

	return (
		<WidgetContainer
			className={
				'flex flex-col overflow-hidden md:flex-1 w-full transition-all duration-300'
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

			<div className="flex-1 mt-2">
				<DaySummary selectedDate={selectedDate} />
			</div>
		</WidgetContainer>
	)
}

export default CalendarLayout
