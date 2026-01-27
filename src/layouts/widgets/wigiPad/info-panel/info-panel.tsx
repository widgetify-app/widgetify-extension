import { useRef, useState } from 'react'
import { NotificationItem } from './components/ann-item'
import { useInfoPanelData } from './hooks/useInfoPanelData'
import { BirthdayTab } from './tabs/birthday/birthday-tab'
import { BsFillCalendar2WeekFill } from 'react-icons/bs'

export function InfoPanel() {
	const [activeSection, setActiveSection] = useState<string>('all')
	const data = useInfoPanelData()
	const tabContainerRef = useRef<HTMLDivElement>(null)
	const sections = [
		{ id: 'all', label: 'ویجی تب', icon: '📋' },
		{ id: 'birthdays', label: 'تولدها', icon: '🎂' },
	]

	const handleSectionClick = (
		sectionId: string,
		event: React.MouseEvent<HTMLButtonElement>
	) => {
		setActiveSection(sectionId)

		const button = event.currentTarget
		const container = tabContainerRef.current

		if (button && container) {
			const containerRect = container.getBoundingClientRect()
			const buttonRect = button.getBoundingClientRect()

			const scrollLeft =
				button.offsetLeft - containerRect.width / 2 + buttonRect.width / 2

			container.scrollTo({
				left: scrollLeft,
				behavior: 'smooth',
			})
		}
	}
	const renderContent = () => {
		switch (activeSection) {
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
			<div
				ref={tabContainerRef}
				className="py-1 flex lg:justify-start overflow-x-auto scrollbar-none gap-x-0.5"
			>
				{sections.map((section) => (
					<button
						key={section.id}
						onClick={(event) => handleSectionClick(section.id, event)}
						className={`flex items-center gap-1 px-2.5 py-1.5 text-[11px] leading-none font-medium whitespace-nowrap transition-colors cursor-pointer rounded-full ${
							activeSection === section.id
								? 'bg-primary text-white'
								: 'text-muted bg-base-300/70 border border-base-300/70'
						}
						 ${section.id === 'google-meetings' ? 'line-through' : ''}`}
					>
						<span>{section.icon}</span>
						<span>{section.label}</span>
					</button>
				))}
			</div>

			<div className="flex-1 p-2 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-base-300">
				{renderContent()}
			</div>
		</div>
	)
}
