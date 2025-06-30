import { useRef, useState } from 'react'
import { NotificationItem } from './components/notification-item'
import { useInfoPanelData } from './hooks/useInfoPanelData'
import { BirthdayTab } from './tabs/birthday/birthday-tab'
import { GoogleTab } from './tabs/google/google.tab'

export function InfoPanel() {
	const [activeSection, setActiveSection] = useState<string>('all')
	const data = useInfoPanelData()
	const tabContainerRef = useRef<HTMLDivElement>(null)

	const sections = [
		{ id: 'all', label: 'ویجی تب', icon: '📋' },
		{ id: 'birthdays', label: 'تولدها', icon: '🎂' },
		{
			id: 'google-meetings',
			label: 'گوگل کلندر',
			icon: '📅',
		},
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
				return <GoogleTab />
			case 'notifications':
				return (
					<div className="space-y-2">
						{data.notifications.map((notification, i) => (
							<NotificationItem key={i} notification={notification} />
						))}
					</div>
				)

			default:
				return (
					<div className="space-y-3">
						{data.notifications.map((notification, index) => (
							<NotificationItem key={index} notification={notification} />
						))}
					</div>
				)
		}
	}

	return (
		<div className="flex flex-col h-full overflow-hidden rounded-2xl">
			<div
				ref={tabContainerRef}
				className="p-[5px] flex lg:justify-between overflow-x-auto scrollbar-none gap-x-1"
			>
				{sections.map((section) => (
					<button
						key={section.id}
						onClick={(event) => handleSectionClick(section.id, event)}
						className={`flex items-center gap-1 px-2.5 py-[5px] text-[10.5px] leading-none font-medium whitespace-nowrap transition-colors cursor-pointer rounded-full ${
							activeSection === section.id
								? 'bg-primary text-secondary-content'
								: 'text-muted hover:bg-base-300'
						}`}
					>
						<span>{section.icon}</span>
						<span>{section.label}</span>
					</button>
				))}
			</div>

			<div className="flex-1 p-3 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-base-300">
				{renderContent()}
			</div>
		</div>
	)
}
