import { useTheme } from '@/context/theme.context'
import { motion } from 'framer-motion'
import type React from 'react'
import { useEffect, useRef } from 'react'
import { FiCalendar, FiClipboard, FiSunrise, FiWatch } from 'react-icons/fi'
import { IoAnalyticsOutline } from 'react-icons/io5'
import type { TabType } from '../calendar'

interface TabNavigationProps {
	activeTab: TabType
	onTabClick: (tab: TabType) => void
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
	activeTab,
	onTabClick,
}) => {
	const { theme } = useTheme()
	const scrollContainerRef = useRef<HTMLDivElement>(null)

	const getTabContainerStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-gray-100/90 shadow-sm'
			case 'dark':
				return 'bg-neutral-800/80'
			default: // glass
				return 'bg-neutral-900/50'
		}
	}

	const getInactiveTabStyle = () => {
		switch (theme) {
			case 'light':
				return 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
			default:
				return 'text-gray-400 hover:text-gray-300 hover:bg-white/5'
		}
	}

	const getFadeGradientFrom = () => {
		switch (theme) {
			case 'light':
				return 'from-gray-100/90'
			case 'dark':
				return 'from-neutral-800/80'
			default: // glass
				return 'from-neutral-900/50'
		}
	}

	useEffect(() => {
		if (scrollContainerRef.current) {
			const activeTabElement = scrollContainerRef.current.querySelector(
				`[data-tab-id="${activeTab}"]`,
			)

			if (activeTabElement) {
				const containerWidth = scrollContainerRef.current.clientWidth
				const tabPosition = (activeTabElement as HTMLElement).offsetLeft
				const tabWidth = (activeTabElement as HTMLElement).offsetWidth

				scrollContainerRef.current.scrollLeft =
					tabPosition - containerWidth / 2 + tabWidth / 2
			}
		}
	}, [activeTab])

	const tabs = [
		{ id: 'events' as TabType, label: 'رویدادها', icon: FiCalendar },
		{ id: 'religious-time' as TabType, label: 'اوقات شرعی', icon: FiSunrise },
		{ id: 'todos' as TabType, label: 'یادداشت‌ها', icon: FiClipboard },
		{ id: 'todo-stats' as TabType, label: 'آمار', icon: IoAnalyticsOutline },
		{ id: 'pomodoro' as TabType, label: 'پومودورو', icon: FiWatch },
	]

	return (
		<div className={`relative rounded-lg ${getTabContainerStyle()}`}>
			<div
				ref={scrollContainerRef}
				className="flex items-center px-1 py-1 overflow-x-auto scrollbar-hide scroll-smooth"
				style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
			>
				<style>{`
					.scrollbar-hide::-webkit-scrollbar {
						display: none;
					}
					.scrollbar-hide {
						-ms-overflow-style: none; /* IE and Edge */
						scrollbar-width: none; /* Firefox */
					}
				`}</style>

				{tabs.map((tab) => (
					<motion.button
						key={tab.id}
						data-tab-id={tab.id}
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						onClick={() => onTabClick(tab.id)}
						className={`flex items-center gap-1.5 cursor-pointer px-3 py-0.5 text-xs font-medium rounded-md transition-all mx-1 flex-shrink-0 ${
							activeTab === tab.id
								? 'bg-blue-500 text-white shadow-sm'
								: getInactiveTabStyle()
						}`}
					>
						<tab.icon size={12} />
						{tab.label}
					</motion.button>
				))}
			</div>

			{/* Left fade indicator */}
			<div
				className={`absolute left-0 top-0 h-full w-4 bg-gradient-to-r ${getFadeGradientFrom()} to-transparent pointer-events-none`}
				style={{ opacity: 0.8 }}
			></div>

			{/* Right fade indicator */}
			<div
				className={`absolute right-0 top-0 h-full w-4 bg-gradient-to-l ${getFadeGradientFrom()} to-transparent pointer-events-none`}
				style={{ opacity: 0.8 }}
			></div>
		</div>
	)
}
