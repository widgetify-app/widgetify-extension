import type React from 'react'
import { useEffect, useState } from 'react'
import Analytics from '@/analytics'
import { Motion as motion } from '@/common/motion'
import { getFromStorage, setToStorage } from '@/common/storage'
import { Modal, TabNavigation } from '@/components/ui'
import { useDate } from '@/context/date.context'
import { Icon } from '@/icons'
import type { WidgetSize } from '../layout-engine/types'
import { WidgetContainer } from '../widget-container'
import { DEFAULT_TOOLS_TAB, TOOLS_TAB_TITLES, TOOLS_TABS } from './constants'
import { CurrencyConverter } from './currency/currency-converter'
import { PomodoroTimer } from './pomodoro/pomodoro-timer'
import { ReligiousTime } from './religious/religious-time'
import type { ToolsTabType } from './types'
import { normalizeToolsTab } from './utils/normalize-tools-tab'
import { ToolsCompactRow } from './variants/tools-2x1'

const navigationTabs = TOOLS_TABS.map((tab) => ({
	id: tab.id,
	label: tab.label,
	icon: <Icon name={tab.icon} size={14} aria-hidden="true" />,
}))

interface ToolsLayoutProps {
	size?: WidgetSize
}

export const ToolsLayout: React.FC<ToolsLayoutProps> = ({ size = { w: 2, h: 3 } }) => {
	const [activeTab, setActiveTab] = useState<ToolsTabType>(DEFAULT_TOOLS_TAB)
	const [activeModalTool, setActiveModalTool] = useState<ToolsTabType | null>(null)
	const { selectedDate } = useDate()

	const onTabClick = (tab: ToolsTabType) => {
		if (tab === activeTab) return
		setActiveTab(tab)
		setToStorage('toolsTab', tab)
		Analytics.event(`tools_tab_change_to_${tab}`)
	}

	const onCompactToolClick = (tab: ToolsTabType) => {
		setActiveModalTool(tab)
		Analytics.event(`tools_compact_open_${tab}`)
	}

	useEffect(() => {
		async function load() {
			const tabFromStorage = await getFromStorage('toolsTab')
			setActiveTab(normalizeToolsTab(tabFromStorage))
		}

		load()
	}, [])

	const renderTool = (tab: ToolsTabType) => {
		switch (tab) {
			case 'religious-time':
				return <ReligiousTime currentDate={selectedDate} />
			case 'pomodoro':
				return <PomodoroTimer />
			case 'currency-converter':
				return <CurrencyConverter />
		}
	}

	if (size.w === 2 && size.h === 1) {
		return (
			<>
				<WidgetContainer>
					<ToolsCompactRow onSelectTab={onCompactToolClick} />
				</WidgetContainer>

				<Modal
					isOpen={!!activeModalTool}
					onClose={() => setActiveModalTool(null)}
					title={activeModalTool ? TOOLS_TAB_TITLES[activeModalTool] : ''}
					size="md"
					direction="rtl"
				>
					{activeModalTool && renderTool(activeModalTool)}
				</Modal>
			</>
		)
	}

	return (
		<WidgetContainer>
			<section aria-label="ابزارها" className="flex flex-col h-full">
				<TabNavigation
					tabMode="advanced"
					activeTab={activeTab}
					onTabClick={onTabClick}
					tabs={navigationTabs}
					size="small"
					className="flex-none w-full border-none"
				/>

				<motion.div
					key={activeTab}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="min-h-0 grow"
				>
					{renderTool(activeTab)}
				</motion.div>
			</section>
		</WidgetContainer>
	)
}
