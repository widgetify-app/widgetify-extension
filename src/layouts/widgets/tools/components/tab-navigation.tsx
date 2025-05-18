import Tooltip from '@/components/toolTip'
import { useTheme } from '@/context/theme.context'
import { motion } from 'framer-motion'
import type React from 'react'
import { FiCalendar, FiSunrise, FiWatch } from 'react-icons/fi'
import type { TabType } from '../../calendar/calendar'

interface TabNavigationProps {
	activeTab: TabType
	onTabClick: (tab: TabType) => void
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
	activeTab,
	onTabClick,
}) => {
	const getTabStyle = (isActive: boolean) => {
		if (isActive) {
			return 'text-primary/80'
		}

		return 'text-base-content/70 hover:text-primary/80'
	}

	const getIndicatorColor = () => {
		return 'bg-blue-500'
	}

	const tabs = [
		{ id: 'events' as TabType, icon: FiCalendar, label: 'مناسبت‌ها' },
		{ id: 'religious-time' as TabType, icon: FiSunrise, label: 'اوقات شرعی' },
		{ id: 'pomodoro' as TabType, icon: FiWatch, label: 'پومودورو' },
	]

	return (
		<div className="flex items-center justify-between pb-1 mb-1 border-b widget-item-border">
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
