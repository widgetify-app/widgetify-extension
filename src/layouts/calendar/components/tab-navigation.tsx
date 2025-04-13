import Tooltip from '@/components/toolTip'
import { useTheme } from '@/context/theme.context'
import { motion } from 'framer-motion'
import type React from 'react'
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

	const getTabStyle = (isActive: boolean) => {
		if (isActive) {
			return 'text-blue-500'
		}
		return theme === 'light' ? 'text-gray-500' : 'text-gray-400'
	}

	const getIndicatorColor = () => {
		return theme === 'light' ? 'bg-blue-500' : 'bg-blue-600'
	}

	const tabs = [
		{ id: 'events' as TabType, icon: FiCalendar, label: 'رویدادها' },
		{ id: 'religious-time' as TabType, icon: FiSunrise, label: 'اوقات شرعی' },
		{ id: 'todos' as TabType, icon: FiClipboard, label: 'یادداشت‌ها' },
		{ id: 'todo-stats' as TabType, icon: IoAnalyticsOutline, label: 'آمار' },
		{ id: 'pomodoro' as TabType, icon: FiWatch, label: 'پومودورو' },
	]

	return (
		<div
			className="flex items-center justify-between pb-1 mb-1 border-b"
			style={{
				borderColor: theme === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)',
			}}
		>
			{tabs.map((tab) => (
				<div key={tab.id} className="relative">
					<Tooltip content={tab.label} position="top" delay={300}>
						<motion.button
							onClick={() => onTabClick(tab.id)}
							className={`p-0.5 transition-colors cursor-pointer ${getTabStyle(activeTab === tab.id)}`}
							whileTap={{ scale: 0.9 }}
						>
							<tab.icon size={18} />
						</motion.button>
					</Tooltip>

					{activeTab === tab.id && (
						<motion.div
							layoutId="tab-indicator"
							className={`absolute bottom-0 left-0 right-0 h-0.5 ${getIndicatorColor()}`}
							initial={false}
							transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
						/>
					)}
				</div>
			))}
		</div>
	)
}
