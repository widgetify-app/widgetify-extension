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
			role="group"
			className={cn(
				'flex items-center p-1 bg-raised rounded-2xl border border-subtle relative',
				className
			)}
		>
			{tabs.map((tab) => {
				const isActive = activeTab === tab.id
				const isLabelVisible = tabMode === 'simple' || isActive

				return (
					<button
						key={tab.id as any}
						onClick={() => onTabClick(tab.id)}
						aria-pressed={isActive}
						aria-label={isLabelVisible ? undefined : tab.label}
						className={cn(
							tabTriggerVariants({ size, tabMode, active: isActive }),
							'focus-visible:focus-ring',
							isActive && activeTextClass
						)}
						type="button"
					>
						{tab.icon && <span aria-hidden="true">{tab.icon}</span>}
						{isLabelVisible && (
							<span className="font-medium truncate">{tab.label}</span>
						)}

						{isActive && (
							<motion.div
								layoutId={`active-pill-${uniqueId}`}
								className={cn(
									'absolute inset-0 shadow-xs bg-raised rounded-xl -z-10',
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
