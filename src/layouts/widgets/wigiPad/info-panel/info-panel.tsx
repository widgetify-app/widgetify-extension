import { useRef, useState } from 'react'
import { NotificationItem } from './components/ann-item'
import { useInfoPanelData } from './hooks/useInfoPanelData'
import { BirthdayTab } from './tabs/birthday/birthday-tab'
import { BsFillCalendar2WeekFill } from 'react-icons/bs'
import { TabNavigation } from '@/components/tab-navigation'
import { InfoWeather } from './infoWeather'

const sections = [
	{ id: 'all', label: 'ویجی تب', icon: '📋' },
	{ id: 'weather', label: 'آب و هوا', icon: '⛅' },
	{ id: 'birthdays', label: 'تولدها', icon: '🎂' },
]
export function InfoPanel() {
	const [activeSection, setActiveSection] = useState<string>('all')
	const data = useInfoPanelData()
	const tabContainerRef = useRef<HTMLDivElement>(null)

	const renderContent = () => {
		switch (activeSection) {
			case 'weather':
				return <InfoWeather />
			case 'birthdays':
				return <BirthdayTab birthdays={data.birthdays} />
			case 'google-meetings':
				return (
					<div className="flex flex-col items-center py-1.5 text-center text-muted">
						<BsFillCalendar2WeekFill className="mb-2 text-2xl" />
						<p className="text-xs font-bold leading-normal max-w-44">
							این قسمت رو به ویجت تقویم انتقال دادیم 🪄
						</p>
					</div>
				)

			default:
				return (
					<div className="space-y-1">
						{data.notifications.map((notification, index) => (
							<NotificationItem key={index} notification={notification} />
						))}
					</div>
				)
		}
	}

	return (
		<div className="flex flex-col h-full overflow-hidden">
			<div className="flex-1 p-0.5 space-y-1 overflow-y-auto scrollbar-none">
				{renderContent()}
			</div>

			<div
				ref={tabContainerRef}
				className="py-1 flex lg:justify-start overflow-x-auto scrollbar-none gap-x-0.5 border-t border-base-content/5 bg-base-200/20"
			>
				<TabNavigation
					activeTab={activeSection}
					onTabClick={(tab) => setActiveSection(tab)}
					tabs={sections}
					size="small"
					className="m-0! py-0.5! border-none! flex-nowrap w-full"
				/>
			</div>
		</div>
	)
}
