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
import { useGetUserMoodStatus } from '@/services/hooks/user/userService.hook'
import Tooltip from '@/components/toolTip'
import { useAuth } from '@/context/auth.context'
import { RequireAuth } from '@/components/auth/require-auth'

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

export const moodOptions = [
	{ value: 'sad', emoji: '😔', label: 'ناراحتم', colorClass: 'bg-error/20' },
	{ value: 'tired', emoji: '😴', label: 'خستم', colorClass: 'bg-warning/20' },
	{ value: 'happy', emoji: '🙂', label: 'اوکی‌ام', colorClass: 'bg-secondary/20' },
	{ value: 'excited', emoji: '😄', label: 'سرحالم', colorClass: 'bg-success/20' },
]

const getMoodOption = (value: string | null) => {
	if (!value) return null
	if (value === 'normal') value = 'tired'
	return moodOptions.find((m) => m.value === value) ?? null
}

function CompactMoodWidget() {
	const { isAuthenticated } = useAuth()
	const { data } = useGetUserMoodStatus(isAuthenticated)
	if (!isAuthenticated)
		return (
			<RequireAuth>
				<></>
			</RequireAuth>
		)

	if (!data)
		return (
			<div className="flex flex-col h-full gap-1 p-2">
				<div className="flex items-center justify-between">
					<span className="w-10 h-2 skeleton"></span>

					<div className="flex items-center gap-1">
						<span className="w-8 h-3 skeleton"></span>🔥
					</div>
				</div>

				<div className="grid grid-cols-7 gap-0.5 mt-2">
					{[...Array(30)].map((_, linkIdx) => (
						<div
							className="w-5 h-5 rounded-lg skeleton"
							key={`w-${linkIdx}`}
						></div>
					))}
				</div>

				<div className="flex flex-wrap gap-2 mt-auto text-xs">
					{moodOptions.map((opt) => (
						<div key={opt.value} className="flex items-center gap-1">
							<div className={`h-2 w-2 rounded ${opt.colorClass}`} />
							<span>{opt.label}</span>
						</div>
					))}
				</div>
			</div>
		)

	const { month, year, streak, days } = data

	return (
		<div className="flex flex-col h-full gap-1 p-2">
			<div className="flex items-center justify-between">
				<div className="font-semibold text-[12px]">
					{month} / {year}{' '}
					<span className="mr-1 text-white badge badge-primary badge-xs outline-2 outline-primary/20">
						آزمایشی
					</span>
				</div>
				<span>{streak} 🔥 </span>
			</div>

			<div className="grid grid-cols-7 gap-[2px] mt-2">
				{days.map((day: any, i: number) => {
					const moodOpt = getMoodOption(day.mood)
					return (
						<Tooltip
							content={moodOpt?.label || 'ثبت نشده'}
							key={`user-mood-${i}`}
						>
							<div
								title={`${day.date} - ${moodOpt?.label ?? 'ثبت نشده'}`}
								className={`
                h-5 w-5 rounded-lg flex items-center justify-center text-[10px]
                ${moodOpt ? `${moodOpt.colorClass}` : 'bg-base-content/5'}
              `}
							>
								{moodOpt?.emoji}
							</div>
						</Tooltip>
					)
				})}
			</div>

			<div className="flex flex-wrap gap-2 mt-auto text-xs">
				{moodOptions.map((opt) => (
					<div key={opt.value} className="flex items-center gap-1">
						<div className={`h-2 w-2 rounded ${opt.colorClass}`} />
						<span>{opt.label}</span>
					</div>
				))}
			</div>
		</div>
	)
}
