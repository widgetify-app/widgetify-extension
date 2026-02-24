import { useState } from 'react'
import GoogleCalendar from '@/assets/google-calendar.png'
import emotions from '@/assets/emotions.png'
import { useDate } from '@/context/date.context'
import { WidgetContainer } from '../widget-container'
import { CalendarGrid } from './components/calendar-grid'
import { CalendarHeader } from './components/calendar-header'
import { GoogleCalendarView } from './components/google-calendar/google-calendar-view'
import { FcCalendar } from 'react-icons/fc'
import Analytics from '@/analytics'
import { TabNavigation } from '@/components/tab-navigation'
import { CompactMoodWidget } from './components/mood/mood-status'

interface CalendarTabSelectorProps {
	activeTab: string
	setActiveTab: (tab: string) => void
}

const CalendarTabSelector: React.FC<CalendarTabSelectorProps> = ({
	activeTab,
	setActiveTab,
}) => {
	return (
		<div className="p-1 mt-1 shrink-0">
			<TabNavigation
				activeTab={activeTab}
				onTabClick={(val) => setActiveTab(val)}
				tabs={[
					{
						id: 'calendar',
						label: 'تقویم',
						icon: (
							<FcCalendar
								size={18}
								className={`w-5 h-5 ${activeTab !== 'calendar' ? 'opacity-45' : ''}`}
							/>
						),
					},
					{
						id: 'google',
						label: 'گوگل‌کلندر',
						icon: (
							<img
								src={GoogleCalendar}
								alt="Google Calendar"
								className={`w-5 h-5 rounded-sm ${activeTab !== 'google' ? 'opacity-45' : ''}`}
							/>
						),
					},
					{
						id: 'mood',
						label: 'مود روزانه',
						icon: (
							<img
								src={emotions}
								alt="mood"
								className={`w-5 h-5 rounded-sm ${activeTab !== 'mood' ? 'opacity-45' : ''}`}
							/>
						),
					},
				]}
				size="small"
				tabMode="advanced"
			/>
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
		<WidgetContainer className="flex flex-col w-full overflow-hidden transition-all duration-300 md:flex-1">
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
				) : activeTab === 'google' ? (
					<GoogleCalendarView />
				) : (
					<CompactMoodWidget />
				)}
			</div>

			<CalendarTabSelector activeTab={activeTab} setActiveTab={onSetActiveTab} />
		</WidgetContainer>
	)
}

export default CalendarLayout
