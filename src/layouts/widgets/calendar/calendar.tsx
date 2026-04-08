import { useState } from 'react'
import { useDate } from '@/context/date.context'
import { WidgetContainer } from '../widget-container'
import { CalendarGrid } from './components/calendar-grid'
import { CalendarHeader } from './components/calendar-header'
import { GoogleCalendarView } from './components/google-calendar/google-calendar-view'
import Analytics from '@/analytics'
import { BiCalendar, BiLogoGoogle } from 'react-icons/bi'

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
				<BiCalendar size={12} />
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
				<BiLogoGoogle size={12} />
				<span>گوگل‌کلندر</span>
			</button>
		</div>
	)
}

const CalendarLayout: React.FC = () => {
	const { currentDate, selectedDate, setCurrentDate, setSelectedDate, goToToday } =
		useDate()
	const [activeTab, setActiveTab] = useState<string>('calendar')

	const onSetActiveTab = (tab: string) => {
		setActiveTab(tab)
		Analytics.event(`calendar_tab_switch_to_${tab}`)
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
