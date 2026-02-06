import type React from 'react'

interface TabItem<T> {
	id: T
	label: string
	icon?: React.ReactNode
}

interface TabNavigationProps<T> {
	tabs: TabItem<T>[]
	activeTab: T | null
	onTabClick: (tab: T) => void
	size?: 'small' | 'medium' | 'large'
	className?: string
	tabMode: 'advanced' | 'sample'
}

export const TabNavigation = <T,>({
	tabs,
	activeTab,
	onTabClick,
	size = 'medium',
	className = '',
	tabMode,
}: TabNavigationProps<T>) => {
	const sizeClasses = {
		small: 'py-1 px-2 text-[10px]',
		medium: 'py-2 px-1 text-xs',
		large: 'py-3 px-2 text-sm',
	}
	const buttonClass = (isActive: boolean) => {
		if (tabMode === 'sample') {
			return 'flex-1'
		}

		if (isActive) {
			return 'flex-2'
		} else return 'flex-1'
	}

	return (
		<div
			className={`flex items-center p-1 bg-base-300/40 rounded-2xl border border-base-content/5 ${className}`}
		>
			{tabs.map((tab) => {
				const isActive = activeTab === tab.id

				return (
					<button
						key={tab.id as unknown as string}
						type="button"
						onClick={() => onTabClick(tab.id)}
						className={`
                            ${buttonClass(isActive)} flex items-center justify-center gap-1 
                            cursor-pointer rounded-xl 
                            transition-all duration-200 
                            active:scale-95 z-10 
                            ${sizeClasses[size]}
                            ${
								isActive
									? 'bg-primary text-white shadow-md'
									: 'text-base-content/50 hover:text-base-content hover:bg-base-content/5 active:bg-base-content/10'
							}
                        `}
					>
						{tab.icon && (
							<span
								className={`transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}
							>
								{tab.icon}
							</span>
						)}

						{tabMode === 'sample' ? (
							<span
								className={`block font-semibold truncate transition-opacity ${isActive ? 'opacity-100' : 'opacity-80'}`}
							>
								{tab.label}
							</span>
						) : (
							isActive && (
								<span
									className={`block font-semibold truncate transition-opacity ${isActive ? 'opacity-100' : 'opacity-80'}`}
								>
									{tab.label}
								</span>
							)
						)}
					</button>
				)
			})}
		</div>
	)
}
