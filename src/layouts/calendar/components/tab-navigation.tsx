import { useTheme } from '@/context/theme.context'
import { motion } from 'framer-motion'
import type React from 'react'
import { FiCalendar, FiClipboard, FiWatch } from 'react-icons/fi'
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
		{ id: 'todos' as TabType, label: 'یادداشت‌ها', icon: FiClipboard },
		{ id: 'todo-stats' as TabType, label: 'آمار', icon: IoAnalyticsOutline },
		{ id: 'pomodoro' as TabType, label: 'پومودورو', icon: FiWatch },
	]

	return (
		<div className={`inline-flex rounded-lg ${getTabContainerStyle()}`}>
			{tabs.map((tab) => (
				<motion.button
					key={tab.id}
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					onClick={() => onTabClick(tab.id)}
					className={`flex items-center gap-1 cursor-pointer px-3 py-1 text-xs font-medium rounded-md transition-all ${
						activeTab === tab.id
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
