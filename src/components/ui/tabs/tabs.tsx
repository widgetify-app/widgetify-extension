import type React from 'react'
import { useId } from 'react'
import { Motion as motion } from '@/common/motion'
import { cn } from '@/common/utils/cn'
import { tabTriggerVariants } from './tabs.variants'

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
	activeBgClass?: string
	activeTextClass?: string
	tabMode: 'advanced' | 'simple'
}

export const TabNavigation = <T,>({
	tabs,
	activeTab,
	onTabClick,
	size = 'medium',
	className = '',
	tabMode,
	activeBgClass,
	activeTextClass,
}: TabNavigationProps<T>) => {
	const uniqueId = useId()

	return (
		<div
			className={cn(
				'flex items-center p-1 bg-base-300/40 rounded-2xl border border-base-content/5 relative',
				className
			)}
		>
			{tabs.map((tab) => {
				const isActive = activeTab === tab.id

				return (
					<button
						key={tab.id as any}
						onClick={() => onTabClick(tab.id)}
						className={cn(
							tabTriggerVariants({ size, tabMode, active: isActive }),
							isActive && activeTextClass
						)}
						type="button"
					>
						{tab.icon && <span>{tab.icon}</span>}
						{(tabMode === 'simple' || isActive) && (
							<span className="font-medium truncate">{tab.label}</span>
						)}

						{isActive && (
							<motion.div
								layoutId={`active-pill-${uniqueId}`}
								className={cn(
									'absolute inset-0 shadow-md bg-base-200 rounded-xl -z-10',
									activeBgClass
								)}
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
