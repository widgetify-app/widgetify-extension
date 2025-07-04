import Tooltip from '@/components/toolTip'
import { motion } from 'framer-motion'
import type React from 'react'
import { FiCalendar, FiSunrise, FiWatch } from 'react-icons/fi'
import type { ToolsTabType } from '../tools.layout'

interface TabNavigationProps {
	activeTab: ToolsTabType | null
	onTabClick: (tab: ToolsTabType) => void
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
	activeTab,
	onTabClick,
}) => {
	const getTabStyle = (isActive: boolean) => {
		if (isActive) {
			return 'text-white'
		}

		return 'text-base-content/70 hover:bg-base-300'
	}

	const getIndicatorColor = () => {
		return 'bg-primary'
	}

	const tabs = [
		{ id: 'events' as ToolsTabType, icon: FiCalendar, label: 'مناسبت‌ها' },
		{ id: 'religious-time' as ToolsTabType, icon: FiSunrise, label: 'اوقات شرعی' },
		{ id: 'pomodoro' as ToolsTabType, icon: FiWatch, label: 'پومودورو' },
	]

	return (
		<div className="flex items-center justify-between pb-1 mb-1">
			{tabs.map((tab) => (
				<div key={tab.id} className="relative">
					<Tooltip content={tab.label} position="top" delay={300}>
						<motion.button
							onClick={() => onTabClick(tab.id)}
							className={`relative w-7 h-7 flex items-center justify-center transition-colors rounded-[0.55rem] cursor-pointer z-10 ${getTabStyle(activeTab === tab.id)}`}
							whileTap={{ scale: 0.9 }}
						>
							<tab.icon size={16} className="w-4 h-4" />
						</motion.button>
					</Tooltip>

					{activeTab === tab.id && (
						<motion.div
							layoutId="tab-indicator"
							className={`absolute top-1/2 left-1/2 -translate-1/2 w-full h-full rounded-[0.55rem] ${getIndicatorColor()}`}
							initial={false}
							transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
						/>
					)}
				</div>
			))}
		</div>
	)
}
