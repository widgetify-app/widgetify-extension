import type React from 'react'
import { type ReactNode, useEffect, useState } from 'react'
import Analytics from '@/analytics'
import { getFromStorage, setToStorage } from '@/common/storage'
import { Modal } from '@/components/ui'
import { useDate } from '@/features/widgets/date.context'
import type { WidgetSize } from '../utils/layout-engine/types'
import { WidgetContainer } from '../components/widget-container'
import { WidgetHeaderTabs } from '../components/widget-header'
import { DEFAULT_TOOLS_TAB, TOOLS_TAB_TITLES, TOOLS_TABS } from './constants'
import { CurrencyConverter } from './components/currency-converter'
import { PomodoroTimer } from './pomodoro/pomodoro'
import { ReligiousTime } from './components/religious-time'
import type { ToolsTabType } from './types'
import { normalizeToolsTab } from './utils/normalize-tools-tab'
import { ToolsCompactRow } from './variants/tools-2x1'

interface ToolsLayoutProps {
	size?: WidgetSize
}

export const ToolsLayout: React.FC<ToolsLayoutProps> = ({ size = { w: 2, h: 3 } }) => {
	const [activeTab, setActiveTab] = useState<ToolsTabType>(DEFAULT_TOOLS_TAB)
	const [modalTool, setModalTool] = useState<ToolsTabType>(DEFAULT_TOOLS_TAB)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const { selectedDate } = useDate()

	const onTabClick = (tab: ToolsTabType) => {
		if (tab === activeTab) return
		setActiveTab(tab)
		setToStorage('toolsTab', tab)
		Analytics.event(`tools_tab_change_to_${tab}`)
	}

	const onCompactToolClick = (tab: ToolsTabType) => {
		setModalTool(tab)
		setIsModalOpen(true)
		Analytics.event(`tools_compact_open_${tab}`)
	}

	useEffect(() => {
		async function load() {
			const tabFromStorage = await getFromStorage('toolsTab')
			setActiveTab(normalizeToolsTab(tabFromStorage))
		}

		load()
	}, [])

	const renderTool = (tab: ToolsTabType, tabs?: ReactNode) => {
		switch (tab) {
			case 'religious-time':
				return <ReligiousTime currentDate={selectedDate} tabs={tabs} />
			case 'pomodoro':
				return <PomodoroTimer tabs={tabs} />
			case 'currency-converter':
				return <CurrencyConverter tabs={tabs} />
		}
	}

	if (size.w === 2 && size.h === 1) {
		return (
			<>
				<WidgetContainer contentClassName="px-3 py-2.5 gap-1.5">
					<ToolsCompactRow
						currentDate={selectedDate}
						onSelectTab={onCompactToolClick}
					/>
				</WidgetContainer>

				<Modal
					isOpen={isModalOpen}
					onClose={() => setIsModalOpen(false)}
					title={TOOLS_TAB_TITLES[modalTool]}
					size={modalTool === 'pomodoro' ? 'lg' : 'md'}
				>
					<div className="flex flex-col gap-2 h-80">
						{renderTool(modalTool)}
					</div>
				</Modal>
			</>
		)
	}

	const tabs = (
		<WidgetHeaderTabs
			label="ابزارها"
			tabs={TOOLS_TABS}
			activeTab={activeTab}
			onChange={onTabClick}
		/>
	)

	return (
		<WidgetContainer contentClassName="p-3">
			<section aria-label="ابزارها" className="flex flex-col flex-1 min-h-0 gap-2">
				{renderTool(activeTab, tabs)}
			</section>
		</WidgetContainer>
	)
}
