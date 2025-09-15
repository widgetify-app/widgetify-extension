import { motion } from 'framer-motion'
import type React from 'react'
import { useEffect, useState } from 'react'
import Analytics from '@/analytics'
import { getFromStorage, setToStorage } from '@/common/storage'
import { useDate } from '@/context/date.context'
import { WidgetContainer } from '../widget-container'
import { TabNavigation } from './components/tab-navigation'
import { CurrencyConverter } from './currency/currency-converter'
import { PomodoroTimer } from './pomodoro/pomodoro-timer'
import { ReligiousTime } from './religious/religious-time'
import { TranslateComponent } from './translate/translate'

export enum ToolsTab {
	pomodoro = 'pomodoro',
	'religious-time' = 'religious-time',
	'currency-converter' = 'currency-converter',
	translate = 'translate',
}
export type ToolsTabType = keyof typeof ToolsTab

export const ToolsLayout: React.FC<any> = () => {
	const [activeTab, setActiveTab] = useState<ToolsTabType | null>(null)
	const { selectedDate } = useDate()

	const onTabClick = (tab: ToolsTabType) => {
		if (tab === activeTab) return
		setActiveTab(tab)
		setToStorage('toolsTab', tab)
		Analytics.event(`tools_tab_change_to_${tab}`)
	}

	useEffect(() => {
		async function load() {
			const tabFromStorage = await getFromStorage('toolsTab')
			if (!tabFromStorage) {
				setActiveTab('pomodoro')
			} else {
				ToolsTab[tabFromStorage]
					? setActiveTab(tabFromStorage)
					: setActiveTab('pomodoro')
			}
		}

		load()
	}, [])

	return (
		<WidgetContainer>
			<div>
				<TabNavigation
					activeTab={activeTab}
					onTabClick={onTabClick || (() => {})}
				/>
			</div>

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

			{activeTab === 'translate' && (
				<motion.div
					key="translate-view"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
				>
					<TranslateComponent />
				</motion.div>
			)}
		</WidgetContainer>
	)
}
