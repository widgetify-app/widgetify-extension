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
		<div className="flex items-center p-1 text-xs font-medium bg-content rounded-2xl">
			{tabs.map((tab) => (
				<div
					key={tab.id}
					onClick={() => onTabClick(tab.id)}
					className={`flex-1 cursor-pointer text-center rounded-xl py-1.5 px-3 transition-all duration-200 ${
						activeTab === tab.id
							? 'bg-primary text-white'
							: 'text-content hover:bg-base-300'
					}`}
				>
					<span className="block truncate">{tab.label}</span>
				</div>
			))}
		</div>
	)
}
