import { type ReactNode, useState } from 'react'
import GoogleCalendar from '@/assets/google-calendar.png'
import { useDate } from '@/context/date.context'
import { WidgetContainer } from '../widget-container'
import { CalendarGrid } from './components/calendar-grid'
import { CalendarHeader } from './components/calendar-header'
import { GoogleCalendarView } from './components/google-calendar/google-calendar-view'
import { FcCalendar } from 'react-icons/fc' // استفاده از لوگوی رنگی گوگل برای جلوه بهتر
import Analytics from '@/analytics'

interface TabItem {
	label: string
	value: string
	icon?: ReactNode
}

interface CalendarTabSelectorProps {
	tabs: TabItem[]
	activeTab: string
	setActiveTab: (tab: string) => void
}

const CalendarTabSelector: React.FC<CalendarTabSelectorProps> = ({
	tabs,
	activeTab,
	setActiveTab,
}) => {
	return (
		<div className="p-1 mt-1 shrink-0">
			<div
				role="tablist"
				className="flex w-full gap-2 p-1.5 bg-base-200/50 rounded-2xl border border-base-300/30"
			>
				{tabs.map((tab) => (
					<button
						key={tab.value}
						onClick={() => setActiveTab(tab.value)}
						className={`flex-1 flex items-center justify-center gap-2 h-9 rounded-xl text-[11px] cursor-pointer font-bold transition-all duration-200 ${
							activeTab === tab.value
								? 'bg-base-100/30 text-primary-content border border-base-300 shadow-md scale-[1.02]'
								: 'text-base-content border border-transparent opacity-60 hover:opacity-100 hover:bg-base-100/50'
						}`}
					>
						{tab.icon}
						{tab.label}
					</button>
				))}
			</div>
		</div>
	)
}

const tabs = [
	{
		label: 'تقویم',
		value: 'calendar',
		icon: <FcCalendar size={18} />,
	},
	{
		label: 'گوگل‌کلندر',
		value: 'google',
		icon: (
			<img
				src={GoogleCalendar}
				alt="Google Calendar"
				className="w-5 h-5 rounded-sm"
			/>
		),
	},
]
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
				) : (
					<GoogleCalendarView />
				)}
			</div>

			<CalendarTabSelector
				tabs={tabs}
				activeTab={activeTab}
				setActiveTab={onSetActiveTab}
			/>
		</WidgetContainer>
	)
}

export default CalendarLayout
