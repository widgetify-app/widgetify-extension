import { type ReactNode, useEffect, useRef, useState } from 'react'
import Analytics from '@/analytics'
import { useAuth } from '@/context/auth.context'

export interface TabItem {
	parentName?: string
	needAuth?: boolean
	children?: {
		label: string
		value: string
		icon: ReactNode
		element: ReactNode
		isNew?: boolean
	}[]
}

interface TabManagerProps {
	tabOwner: 'setting' | 'user' | 'widgets-settings' | 'market'
	tabs: TabItem[]
	defaultTab?: string
	selectedTab?: string | null
	onTabChange?: (tabValue: string) => void
	direction?: 'rtl' | 'ltr'
	tabPosition?: 'top' | 'side'
	children?: ReactNode // for additional tab buttons at the end of aside (just pass the actual buttons)
}

export const TabManager = ({
	tabs,
	defaultTab,
	selectedTab,
	onTabChange,
	direction = 'rtl',
	tabOwner,
	tabPosition,
	children,
}: TabManagerProps) => {
	const { isAuthenticated } = useAuth()
	const [activeTab, setActiveTab] = useState(defaultTab || '')
	const contentRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (selectedTab) {
			setActiveTab(selectedTab)
			Analytics.event(`${tabOwner}_select_tab_${selectedTab}`)
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
			: 'flex-col md:flex-row gap-4 h-[80vh]'
	const contentClass =
		tabPosition === 'top'
			? 'shrink-0 md:overflow-y-auto w-full'
			: 'md:flex-col md:w-48 shrink-0 md:overflow-y-auto'
	return (
		<div dir={direction} className={`flex ${headClass}   overflow-hidden`}>
			<aside className="flex flex-row justify-between overflow-hidden sm:flex-col md:h-full">
				<div
					className={`flex  w-full md:h-full justify-between overflow-x-auto rounded-lg ${contentClass}`}
				>
					<div className="flex flex-row sm:flex-col sm:gap-4">
						{tabs
							.filter((f) => !f.needAuth || isAuthenticated)
							.map((group, idx) => (
								<div key={idx} className="flex flex-col gap-1">
									{group.parentName && (
										<div className="relative mx-4 my-2">
											<div className="h-px bg-base-300" />
											<span className="absolute right-0 px-2 text-xs font-medium -top-2 bg-base-100 text-muted">
												{group.parentName}
											</span>
										</div>
									)}

									{group.children?.map(
										({ label, value, icon, isNew }) => (
											<button
												key={value}
												onClick={() => handleTabChange(value)}
												className={`relative flex items-center gap-3 px-4 py-3 rounded-full transition-all duration-200 justify-start cursor-pointer whitespace-nowrap active:scale-[0.98] ${getTabButtonStyle(
													activeTab === value
												)}`}
											>
												<span
													className={`relative ${getTabIconStyle(
														activeTab === value
													)}`}
												>
													{icon}
													{isNew && (
														<span className="absolute left-0 z-30 w-2 h-2 rounded-full -bottom-1 bg-error animate-ping" />
													)}
												</span>
												<span className="text-sm">{label}</span>
											</button>
										)
									)}
								</div>
							))}
					</div>
					{children}
				</div>
			</aside>

			<div
				className="relative flex-1 overflow-x-hidden overflow-y-auto rounded-lg"
				ref={contentRef}
			>
				{tabs.flatMap((tab) =>
					tab.children?.map(({ value, element }) => (
						<div
							key={value}
							className={`absolute inset-0 p-1 rounded-lg transition-all duration-200 ${
								activeTab === value
									? 'opacity-100 translate-x-0 z-10'
									: 'opacity-0 translate-x-5 z-0 pointer-events-none'
							}`}
						>
							{activeTab === value && element}
						</div>
					))
				)}
			</div>
		</div>
	)
}
