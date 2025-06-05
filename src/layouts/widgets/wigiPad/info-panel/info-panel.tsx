import { useRef, useState } from 'react'
import {
	BirthdayItem,
	CurrencyItem,
	EventItem,
	GoogleMeetingItem,
	NotificationItem,
} from './components'
import { useInfoPanelData } from './hooks/useInfoPanelData'

export function InfoPanel() {
	const [activeSection, setActiveSection] = useState<string>('all')
	const data = useInfoPanelData()
	const tabContainerRef = useRef<HTMLDivElement>(null)

	const sections = [
		{ id: 'all', label: 'همه', icon: '📋' },
		{ id: 'meetings', label: 'جلسات', icon: '📹' },
		{ id: 'currency', label: 'نرخ ارز', icon: '💰' },
		{ id: 'birthdays', label: 'تولدها', icon: '🎂' },
		{ id: 'holidays', label: 'مناسبت‌ها', icon: '🎉' },
	]

	const handleSectionClick = (
		sectionId: string,
		event: React.MouseEvent<HTMLButtonElement>,
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
				return (
					<div className="space-y-2">
						{data.birthdays.length > 0 ? (
							data.birthdays.map((birthday) => (
								<BirthdayItem key={birthday.id} birthday={birthday} />
							))
						) : (
							<div className="py-8 text-center opacity-50 text-base-content">
								<div className="mb-2 text-2xl">🎂</div>
								<p className="text-sm">هیچ تولدی امروز نیست</p>
							</div>
						)}
					</div>
				)
			case 'notifications':
				return (
					<div className="space-y-2">
						{data.notifications.map((notification) => (
							<NotificationItem key={notification.id} notification={notification} />
						))}
					</div>
				)
			case 'holidays':
				return (
					<div className="space-y-2">
						{data.holidays.map((holiday) => (
							<EventItem key={holiday.id} event={holiday} />
						))}
					</div>
				)
			case 'currency':
				return (
					<div className="space-y-2">
						{data.currencyRates.map((rate) => (
							<CurrencyItem key={rate.id} currency={rate} />
						))}
					</div>
				)
			case 'meetings':
				return (
					<div className="space-y-2">
						{data.googleMeetings.map((meeting) => (
							<GoogleMeetingItem key={meeting.id} meeting={meeting} />
						))}
					</div>
				)
			default:
				return (
					<div className="space-y-3">
						{/* Today's birthdays */}
						{data.birthdays.slice(0, 1).map((birthday) => (
							<BirthdayItem key={birthday.id} birthday={birthday} />
						))}

						{/* Latest notifications */}
						{data.notifications.slice(0, 1).map((notification) => (
							<NotificationItem key={notification.id} notification={notification} />
						))}

						{/* Today's holidays */}
						{data.holidays
							.filter((h) => h.isToday)
							.map((holiday) => (
								<EventItem key={holiday.id} event={holiday} />
							))}

						{/* Currency rates */}
						{data.currencyRates.slice(0, 2).map((rate) => (
							<CurrencyItem key={rate.id} currency={rate} />
						))}

						{/* Upcoming meetings */}
						{data.googleMeetings.slice(0, 1).map((meeting) => (
							<GoogleMeetingItem key={meeting.id} meeting={meeting} />
						))}
					</div>
				)
		}
	}

	return (
		<div className="flex flex-col h-full overflow-hidden border border-t rounded bg-content border-content">
			{/* Header with tabs */}
			<div
				ref={tabContainerRef}
				className="flex overflow-x-auto border-b scrollbar-none border-base-300 bg-base-200"
			>
				{sections.map((section) => (
					<button
						key={section.id}
						onClick={(event) => handleSectionClick(section.id, event)}
						className={`flex items-center gap-1 px-3 py-0.5 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
							activeSection === section.id
								? 'bg-primary text-white'
								: 'text-muted hover:bg-base-300'
						}`}
					>
						<span>{section.icon}</span>
						<span>{section.label}</span>
					</button>
				))}
			</div>

			{/* Scrollable content */}
			<div className="flex-1 p-3 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-base-300">
				{renderContent()}
			</div>
		</div>
	)
}
