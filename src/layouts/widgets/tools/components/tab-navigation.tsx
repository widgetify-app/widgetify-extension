import { motion } from 'framer-motion'
import type React from 'react'
import { FiSunrise, FiWatch } from 'react-icons/fi'
import { TbArrowsRightLeft } from 'react-icons/tb'
import Tooltip from '@/components/toolTip'
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
		{ id: 'pomodoro' as ToolsTabType, icon: FiWatch, label: 'پومودورو' },
		{ id: 'religious-time' as ToolsTabType, icon: FiSunrise, label: 'اوقات شرعی' },
		{
			id: 'currency-converter' as ToolsTabType,
			icon: TbArrowsRightLeft,
			label: 'مبدل قیمت (بتا)',
		},
	]

	return (
		<div className="flex items-center justify-between gap-3 pb-1 mb-1">
			{tabs.map((tab) => (
				<div key={tab.id} className="relative">
					<Tooltip content={tab.label} position="top" delay={300}>
						<motion.button
							onClick={() => onTabClick(tab.id)}
							className={`relative w-8 h-8 flex items-center justify-center transition-colors rounded-full cursor-pointer z-10 ${getTabStyle(activeTab === tab.id)}`}
							whileTap={{ scale: 0.9 }}
						>
							<tab.icon size={16} className="w-4 h-4" />
						</motion.button>
					</Tooltip>

					{activeTab === tab.id && (
						<motion.div
							layoutId="tab-indicator"
							className={`absolute top-1/2 left-1/2 -translate-1/2 w-full h-full rounded-full ${getIndicatorColor()}`}
							initial={false}
							transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
						/>
					)}
				</div>
			))}
		</div>
	)
}
