import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion'
import { type ReactNode, useEffect, useState } from 'react'

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

	useEffect(() => {
		if (selectedTab) {
			setActiveTab(selectedTab)
		}
	}, [selectedTab])

	const handleTabChange = (tabValue: string) => {
		setActiveTab(tabValue)
		if (onTabChange) {
			onTabChange(tabValue)
		}
	}

	const getTabButtonStyle = (isActive: boolean) => {
		return isActive ? 'text-primary/80 bg-primary/10' : 'text-muted'
	}

	const getTabIconStyle = () => {
		return 'text-content'
	}

	return (
		<div
			dir={direction}
			className="flex flex-col md:flex-row h-[60vh] overflow-hidden gap-4"
		>
			<LazyMotion features={domAnimation}>
				<div className="flex w-full gap-2 p-2 overflow-x-auto rounded-lg md:flex-col md:w-48 shrink-0 md:overflow-y-auto">
					{tabs.map(({ label, value, icon }) => (
						<m.button
							key={value}
							onClick={() => handleTabChange(value)}
							className={`relative flex items-center gap-3 px-4 py-3 rounded-lg transition-colors justify-start cursor-pointer whitespace-nowrap ${getTabButtonStyle(activeTab === value)}`}
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
						>
							<span className={getTabIconStyle()}>{icon}</span>
							<span className="text-sm">{label}</span>
						</m.button>
					))}
				</div>

				<div className="relative flex-1 overflow-auto rounded-lg">
					<AnimatePresence mode="wait">
						{tabs.map(
							({ value, element }) =>
								activeTab === value && (
									<m.div
										key={value}
										className="absolute inset-0 p-4 rounded-lg"
										initial={{ opacity: 0, x: 20 }}
										animate={{ opacity: 1, x: 0 }}
										exit={{ opacity: 0, x: -20 }}
										transition={{ duration: 0.2 }}
									>
										{element}
									</m.div>
								),
						)}
					</AnimatePresence>
				</div>
			</LazyMotion>
		</div>
	)
}
