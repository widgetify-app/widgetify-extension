import { Motion as motion } from '@/common/motion'
import React, { useEffect, useState } from 'react'
import Analytics from '@/analytics'
import { getFromStorage, setToStorage } from '@/common/storage'
import { useDate } from '@/context/date.context'
import { WidgetContainer } from '../widget-container'
import { Modal, TabNavigation } from '@/components/ui'
import {
	MdOutlineCurrencyExchange,
	MdOutlineMosque,
	MdOutlineTimer,
} from 'react-icons/md'
import { ToolsCompactRow } from './variants/tools-2x1'
import type { WidgetSize } from '../layout-engine/types'
import { ReligiousTime } from './religious/religious-time'
import { PomodoroTimer } from './pomodoro/pomodoro-timer'
import { CurrencyConverter } from './currency/currency-converter'

const tabs = [
	{
		id: 'pomodoro' as ToolsTabType,
		label: 'پومودورو',
		icon: <MdOutlineTimer size={14} />,
	},
	{
		id: 'religious-time' as ToolsTabType,
		label: 'اوقات شرعی',
		icon: <MdOutlineMosque size={14} />,
	},
	{
		id: 'currency-converter' as ToolsTabType,
		label: 'تبدیل',
		icon: <MdOutlineCurrencyExchange size={14} />,
	},
]

export enum ToolsTab {
	pomodoro = 'pomodoro',
	'religious-time' = 'religious-time',
	'currency-converter' = 'currency-converter',
}
export type ToolsTabType = keyof typeof ToolsTab

interface ToolsLayoutProps {
	size?: WidgetSize
}

export const ToolsLayout: React.FC<ToolsLayoutProps> = ({ size = { w: 2, h: 3 } }) => {
	const [activeTab, setActiveTab] = useState<ToolsTabType>('pomodoro')
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
			if (tabFromStorage && ToolsTab[tabFromStorage]) {
				setActiveTab(tabFromStorage)
			}
		}

		load()
	}, [])

	if (size.w === 2 && size.h === 1) {
		return (
			<>
				<WidgetContainer>
					<ToolsCompactRow onSelectTab={onCompactToolClick} />
				</WidgetContainer>

				<Modal
					isOpen={!!activeModalTool}
					onClose={() => setActiveModalTool(null)}
					title={
						activeModalTool === 'pomodoro'
							? 'تایمر پومودورو'
							: activeModalTool === 'religious-time'
								? 'اوقات شرعی'
								: 'تبدیل ارز'
					}
					size="md"
					direction="rtl"
				>
					{activeModalTool === 'religious-time' && (
						<ReligiousTime currentDate={selectedDate} />
					)}
					{activeModalTool === 'pomodoro' && <PomodoroTimer />}
					{activeModalTool === 'currency-converter' && <CurrencyConverter />}
				</Modal>
			</>
		)
	}

	return (
		<WidgetContainer>
			<TabNavigation
				tabMode="advanced"
				activeTab={activeTab}
				onTabClick={onTabClick}
				tabs={tabs}
				size="small"
				className="w-full border-none"
			/>

			{activeTab === 'religious-time' && (
				<motion.div
					key="religious-time-view"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
				>
					<ReligiousTime currentDate={selectedDate} />
				</motion.div>
			)}

			{activeTab === 'pomodoro' && (
				<motion.div
					key="pomodoro-view"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
				>
					<PomodoroTimer />
				</motion.div>
			)}

			{activeTab === 'currency-converter' && (
				<motion.div
					key="currency-converter-view"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
				>
					<CurrencyConverter />
				</motion.div>
			)}
		</WidgetContainer>
	)
}
