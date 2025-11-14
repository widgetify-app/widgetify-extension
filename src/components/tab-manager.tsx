import { type ReactNode, useEffect, useRef, useState } from 'react'
import Analytics from '@/analytics'

export interface TabItem {
	label: string
	value: string
	icon: ReactNode
	element: ReactNode
	isNew?: boolean
}

interface TabManagerProps {
	tabOwner: 'setting' | 'user' | 'widgets-settings'
	tabs: TabItem[]
	defaultTab?: string
	selectedTab?: string | null
	onTabChange?: (tabValue: string) => void
	direction?: 'rtl' | 'ltr'
	tabPosition?: 'top' | 'side'
}

export const TabManager = ({
	tabs,
	defaultTab,
	selectedTab,
	onTabChange,
	direction = 'rtl',
	tabOwner,
	tabPosition,
}: TabManagerProps) => {
	const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.value || '')
	const contentRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (selectedTab) {
			setActiveTab(selectedTab)
			Analytics.event(`${tabOwner}_select_tab`, {
				selected_tab: selectedTab,
			})
		}
	}, [selectedTab])

	useEffect(() => {
		if (contentRef.current) {
			contentRef.current.scrollTo({ top: 0, behavior: 'smooth' })
			Analytics.event(`${tabOwner}_tab_change_${activeTab}`)
		}
	}, [activeTab])

	const handleTabChange = (tabValue: string) => {
		setActiveTab(tabValue)
		if (onTabChange) {
			onTabChange(tabValue)
		}
	}

	const getTabButtonStyle = (isActive: boolean) => {
		return isActive ? 'text-primary bg-primary/15' : 'text-muted hover:bg-base-300'
	}

	const getTabIconStyle = (isActive: boolean) => {
		return isActive ? 'text-primary' : 'text-muted'
	}

	const headClass =
		tabPosition === 'top'
			? 'flex-col gap-1 h-[80vh]'
			: 'flex-col md:flex-row gap-4 h-[60vh]'
	const contentClass =
		tabPosition === 'top'
			? 'shrink-0 md:overflow-y-auto w-full'
			: 'md:flex-col md:w-48 shrink-0 md:overflow-y-auto'
	return (
		<div dir={direction} className={`flex ${headClass}  overflow-hidden`}>
			<div
				className={`flex w-full gap-2 p-2 overflow-x-auto rounded-lg ${contentClass}`}
			>
				{tabs.map(({ label, value, icon, isNew }) => (
					<button
						key={value}
						onClick={() => handleTabChange(value)}
						className={`relative flex items-center gap-3 px-4 py-3 rounded-full transition-all duration-200 ease-in-out justify-start cursor-pointer whitespace-nowrap active:scale-[0.98] ${getTabButtonStyle(activeTab === value)}`}
					>
						<span
							className={`relative ${getTabIconStyle(activeTab === value)}`}
						>
							{icon}
							{isNew && (
								<span className="absolute left-0 z-30 w-2 h-2 duration-200 rounded-full -bottom-1 bg-error animate-ping"></span>
							)}
						</span>
						<span className="text-sm">{label}</span>
					</button>
				))}
			</div>{' '}
			<div
				className="relative flex-1 overflow-x-hidden overflow-y-auto rounded-lg"
				ref={contentRef}
			>
				{tabs.map(({ value, element }) => (
					<div
						key={value}
						className={`absolute inset-0 p-1 rounded-lg transition-all duration-200 ease-in-out ${
							activeTab === value
								? 'opacity-100 translate-x-0 z-10'
								: 'opacity-0 translate-x-5 z-0 pointer-events-none'
						}`}
					>
						{activeTab === value && element}
					</div>
				))}
			</div>
		</div>
	)
}
