import { useState } from 'react'
import { useDate } from '@/context/date.context'
import { WidgetContainer } from '../widget-container'
import { CalendarGrid } from './components/calendar-grid'
import { CalendarHeader } from './components/calendar-header'
import { GoogleCalendarView } from './components/google-calendar/google-calendar-view'
import { CalendarCompactRow } from './variants/calendar-2x1'
import { CalendarWideFull } from './variants/calendar-4x2'
import Analytics from '@/analytics'
import { Icon } from '@/src/icons'
import type { WidgetSize } from '../layout-engine/types'

interface CalendarTabSelectorProps {
	activeTab: string
	setActiveTab: (tab: string) => void
}

const CalendarTabSelector: React.FC<CalendarTabSelectorProps> = ({
	activeTab,
	setActiveTab,
}) => {
	return (
		<div className="flex items-center w-full gap-1 p-1 transition-all duration-200 ease-in-out bg-muted rounded-xl">
			<button
				onClick={() => setActiveTab('calendar')}
				className={`flex cursor-pointer items-center justify-center gap-1 flex-1 text-sm rounded-lg transition-all duration-200 px-2 py-1
					${
						activeTab === 'calendar'
							? 'bg-background text-content shadow-xs'
							: 'text-base-content/60 hover:text-base-content'
					}`}
			>
				<Icon name="calendar" size={12} />
				<span>تقویم</span>
			</button>

			<button
				onClick={() => setActiveTab('google')}
				className={`flex cursor-pointer items-center justify-center gap-1 flex-1 text-sm rounded-lg transition-all duration-200 px-2 py-1
					${
						activeTab === 'google'
							? 'bg-background text-content shadow-xs'
							: 'text-base-content/60 hover:text-base-content'
					}`}
			>
				<Icon name="googleCalendar" size={12} />
				<span>گوگل‌کلندر</span>
			</button>
		</div>
	)
}

interface CalendarLayoutProps {
	size?: WidgetSize
}

export const CalendarLayout: React.FC<CalendarLayoutProps> = ({
	size = { w: 2, h: 2 },
}) => {
	const {
		currentDate,
		selectedDate,
		setCurrentDate,
		setSelectedDate,
		goToToday,
	} = useDate()
	const [activeTab, setActiveTab] = useState<string>('calendar')

	const onSetActiveTab = (tab: string) => {
		setActiveTab(tab)
		Analytics.event(`calendar_tab_switch_to_${tab}`)
	}

	if (size.w === 2 && size.h === 1) {
		return (
			<WidgetContainer>
				<CalendarCompactRow />
			</WidgetContainer>
		)
	}

	if (size.w >= 4 && size.h >= 2) {
		return (
			<WidgetContainer>
				<CalendarWideFull />
			</WidgetContainer>
		)
	}

	return (
		<WidgetContainer className="flex flex-col md:flex-1">
			<div className="flex flex-col flex-1 overflow-hidden">
				{activeTab === 'calendar' ? (
					<>
						<CalendarHeader
							currentDate={currentDate}
							selectedDate={selectedDate}
							setCurrentDate={setCurrentDate}
							goToToday={goToToday}
						/>
						<div className="h-full">
							<CalendarGrid
								currentDate={currentDate}
								selectedDate={selectedDate}
								setSelectedDate={setSelectedDate}
							/>
						</div>
					</>
				) : (
					<GoogleCalendarView />
				)}
			</div>
			<div className="flex-none">
				<CalendarTabSelector
					activeTab={activeTab}
					setActiveTab={onSetActiveTab}
				/>
			</div>
		</WidgetContainer>
	)
}

export default CalendarLayout
