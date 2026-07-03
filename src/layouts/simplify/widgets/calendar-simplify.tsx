import { CalendarHeader } from '../../widgets/calendar/components/calendar-header'
import { CalendarGrid } from '../../widgets/calendar/components/calendar-grid'
import { useDate } from '@/context/date.context'
import Analytics from '@/analytics'
import { GoogleCalendarView } from '@/layouts/widgets/calendar/components/google-calendar/google-calendar-view'
import { Icon } from '@/src/icons'

export function SimplifyCalendar() {
	const { currentDate, selectedDate, setCurrentDate, setSelectedDate, goToToday } =
		useDate()
	const [activeTab, setActiveTab] = useState<string>('calendar')

	const onSetActiveTab = (tab: string) => {
		setActiveTab(tab)
		Analytics.event(`calendar_tab_switch_to_${tab}`)
	}

	return (
		<div className="flex flex-col flex-1 mt-1 overflow-hidden">
			<div className="min-h-59 max-h-59">
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
			<div className="flex items-center w-full cursor-pointer h-7 rounded-2xl">
				<CalendarTabSelector
					activeTab={activeTab}
					setActiveTab={onSetActiveTab}
				/>
			</div>
		</div>
	)
}

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
