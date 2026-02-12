import React, { useId } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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
	const uniqueId = useId()

	const sizeClasses = {
		small: 'py-1 px-2 text-[10px]',
		medium: 'py-2 px-2 text-[10px]',
		large: 'py-3 px-2 text-sm',
	}

	return (
		<div
			className={`flex items-center p-1 bg-base-300/40 rounded-2xl border border-base-content/5 relative ${className}`}
		>
			{tabs.map((tab) => {
				const isActive = activeTab === tab.id

				return (
					<button
						key={tab.id as any}
						onClick={() => onTabClick(tab.id)}
						className={`
                            relative flex items-center justify-center gap-1 
                            cursor-pointer rounded-xl z-10 
                            transition-colors duration-200
                            ${sizeClasses[size]}
                            ${tabMode === 'sample' || isActive ? 'flex-2' : 'flex-1'}
                            ${isActive ? 'text-white' : 'text-base-content/50 hover:bg-base-300 hover:text-white/80'}
                        `}
					>
						{tab.icon && <span>{tab.icon}</span>}
						{(tabMode === 'sample' || isActive) && (
							<span className="font-semibold truncate">{tab.label}</span>
						)}

						{isActive && (
							<motion.div
								layoutId={`active-pill-${uniqueId}`}
								className="absolute inset-0 shadow-md bg-primary/90 rounded-xl -z-10"
								transition={{
									type: 'spring',
									stiffness: 500,
									damping: 35,
									mass: 1,
								}}
							/>
						)}
					</button>
				)
			})}
		</div>
	)
}
