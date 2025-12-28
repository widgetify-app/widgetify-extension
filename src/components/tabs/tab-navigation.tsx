import type React from 'react'

interface TabNavigationProps<Key> {
	tabs: { id: Key; label: string; icon?: React.ReactNode }[]
	activeTab: Key | null
	onTabClick: (tab: Key) => void
	className?: string
	activeTabClassName?: string
}

export const TabNavigation = <Key,>({
	tabs,
	activeTab,
	onTabClick,
	className = '',
	activeTabClassName,
}: TabNavigationProps<Key>) => {
	return (
		<div
			className={`flex items-center justify-around p-1 mb-2 text-xs font-medium bg-base-300 rounded-2xl text-content ${className}`}
		>
			{tabs.map((tab) => (
				<div
					key={tab.id as React.Key}
					onClick={() => onTabClick(tab.id)}
					className={`cursor-pointer  rounded-xl py-0.5 px-2 transition-colors ${
						activeTab === tab.id
							? 'bg-primary text-gray-200 ' + activeTabClassName
							: 'hover:bg-primary/10'
					}`}
				>
					{tab.icon && tab.icon}
					<span>{tab.label}</span>
				</div>
			))}
		</div>
	)
}
