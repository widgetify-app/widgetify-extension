import { CalendarHeader } from '../../widgets/calendar/components/calendar-header'
import { CalendarGrid } from '../../widgets/calendar/components/calendar-grid'
import { useDate } from '@/context/date.context'
import { FcCalendar } from 'react-icons/fc'
import { TabNavigation } from '@/components/tab-navigation'
import GoogleCalendar from '@/assets/google-calendar.png'
import emotions from '@/assets/emotions.png'
import Analytics from '@/analytics'
import { MdApps, MdAppsOutage, MdArrowUpward, MdSettings } from 'react-icons/md'
import { IoMdOptions } from 'react-icons/io'
import { GoogleCalendarView } from '@/layouts/widgets/calendar/components/google-calendar/google-calendar-view'
import { CompactMoodWidget } from '@/layouts/widgets/calendar/components/mood/mood-status'

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
				) : activeTab === 'google' ? (
					<GoogleCalendarView />
				) : (
					<CompactMoodWidget />
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
		<div className="shrink-0">
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
								className={`w-3 h-3 ${activeTab !== 'calendar' ? 'opacity-45' : ''}`}
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
								className={`w-3 h-3 rounded-sm ${activeTab !== 'google' ? 'opacity-45' : ''}`}
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
								className={`w-3 h-3 rounded-sm ${activeTab !== 'mood' ? 'opacity-45' : ''}`}
							/>
						),
					},
				]}
				size="small"
				tabMode="advanced"
				className="h-8 mb-2 bg-transparent! border-none w-60"
				activeBgClass="bg-transparent! border-t  border-base-content/10"
				activeTextClass="text-base-content!"
			/>
		</div>
	)
}
