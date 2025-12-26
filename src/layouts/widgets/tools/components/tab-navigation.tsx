import type React from 'react'
import type { ToolsTabType } from '../tools.layout'

interface TabNavigationProps {
	activeTab: ToolsTabType | null
	onTabClick: (tab: ToolsTabType) => void
}

const tabs = [
	{ id: 'pomodoro' as ToolsTabType, label: 'پومودورو' },
	{ id: 'religious-time' as ToolsTabType, label: 'اوقات شرعی' },
	{ id: 'currency-converter' as ToolsTabType, label: 'مبدل قیمت' },
]
export const TabNavigation: React.FC<TabNavigationProps> = ({
	activeTab,
	onTabClick,
}) => {
	return (
		<div className="flex items-center justify-around p-1 mb-2 text-xs font-medium bg-base-300 rounded-2xl text-content">
			{tabs.map((tab) => (
				<div
					key={tab.id}
					onClick={() => onTabClick(tab.id)}
					className={`cursor-pointer  rounded-xl py-0.5 px-2 transition-colors ${
						activeTab === tab.id
							? 'bg-primary text-gray-200'
							: 'hover:bg-primary/10'
					}`}
				>
					<span>{tab.label}</span>
				</div>
			))}
		</div>
	)
}
