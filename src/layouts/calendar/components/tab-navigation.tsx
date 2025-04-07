import { useTheme } from '@/context/theme.context'
import { motion } from 'framer-motion'
import type React from 'react'
import { FiCalendar, FiClipboard, FiWatch, FiSunrise, FiChevronDown } from 'react-icons/fi'
import { IoAnalyticsOutline } from 'react-icons/io5'
import { useState } from 'react'
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
	const [showAllTabs, setShowAllTabs] = useState(false)

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

	const tabs = [
		{ id: 'events' as TabType, label: 'رویدادها', icon: FiCalendar },
		{ id: 'religious-time' as TabType, label: 'اوقات شرعی', icon: FiSunrise },
		{ id: 'todos' as TabType, label: 'یادداشت‌ها', icon: FiClipboard },
		{ id: 'todo-stats' as TabType, label: 'آمار', icon: IoAnalyticsOutline },
		{ id: 'pomodoro' as TabType, label: 'پومودورو', icon: FiWatch },
	]

	const toggleShowAllTabs = () => {
        setShowAllTabs(!showAllTabs)
    }

    const visibleTabs = showAllTabs ? tabs : tabs.slice(0, 4)

	return (
		<div className={`inline-flex relative w-full rounded-lg flex-wrap ${getTabContainerStyle()}`}>
			<div className="absolute flex justify-center items-center top-1 -left-1 cursor-pointer h-3 w-3 bg-blue-600 rounded-sm" onClick={toggleShowAllTabs}>
				<FiChevronDown size={10} className={`${showAllTabs ? 'rotate-180' : ''} duration-300 ease-in text-white`} />
			</div>
			{visibleTabs.map((tab) => (
				<motion.button
					key={tab.id}
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					onClick={() => onTabClick(tab.id)}
					className={`flex items-center gap-1 cursor-pointer px-3 py-1 text-xs font-medium rounded-md transition-all ${activeTab === tab.id
						? 'bg-blue-500 text-white shadow-sm'
						: getInactiveTabStyle()
						}`}
				>
					<tab.icon size={12} />
					<span>{tab.label}</span>
				</motion.button>
			))}
		</div>
	)
}
