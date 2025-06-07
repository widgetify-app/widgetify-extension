import { type ReactNode, useEffect, useRef, useState } from 'react'

export interface TabItem {
	label: string
	value: string
	icon: ReactNode
	element: ReactNode
}

interface TabManagerProps {
	tabs: TabItem[]
	defaultTab?: string
	selectedTab?: string | null
	onTabChange?: (tabValue: string) => void
	direction?: 'rtl' | 'ltr'
}

export const TabManager = ({
	tabs,
	defaultTab,
	selectedTab,
	onTabChange,
	direction = 'rtl',
}: TabManagerProps) => {
	const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.value || '')
	const contentRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (selectedTab) {
			setActiveTab(selectedTab)
		}
	}, [selectedTab])

	useEffect(() => {
		if (contentRef.current) {
			contentRef.current.scrollTo({ top: 0, behavior: 'smooth' })
		}
	}, [activeTab])

	const handleTabChange = (tabValue: string) => {
		setActiveTab(tabValue)
		if (onTabChange) {
			onTabChange(tabValue)
		}
	}

	const getTabButtonStyle = (isActive: boolean) => {
		return isActive
			? 'text-primary-content bg-primary/10'
			: 'text-muted hover:bg-primary/5 hover:text-primary/80'
	}

	const getTabIconStyle = () => {
		return 'text-content'
	}
	return (
		<div
			dir={direction}
			className="flex flex-col md:flex-row h-[60vh] overflow-hidden gap-4"
		>
			<div className="flex w-full gap-2 p-2 overflow-x-auto rounded-lg md:flex-col md:w-48 shrink-0 md:overflow-y-auto tab-content-container">
				{tabs.map(({ label, value, icon }) => (
					<button
						key={value}
						onClick={() => handleTabChange(value)}
						className={`relative flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ease-in-out justify-start cursor-pointer whitespace-nowrap hover:scale-[1.02] active:scale-[0.98] ${getTabButtonStyle(activeTab === value)}`}
					>
						<span className={getTabIconStyle()}>{icon}</span>
						<span className="text-sm">{label}</span>
					</button>
				))}
			</div>{' '}
			<div className="relative flex-1 overflow-auto rounded-lg" ref={contentRef}>
				{tabs.map(({ value, element }) => (
					<div
						key={value}
						className={`absolute inset-0 p-4 rounded-lg transition-all duration-200 ease-in-out ${
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
