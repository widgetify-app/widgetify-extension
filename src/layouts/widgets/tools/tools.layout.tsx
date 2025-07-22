import { motion } from 'framer-motion'
import type React from 'react'
import { useState } from 'react'
import { getFromStorage, setToStorage } from '@/common/storage'
import { useDate } from '@/context/date.context'
import { WidgetContainer } from '../widget-container'
import { TabNavigation } from './components/tab-navigation'
import { PomodoroTimer } from './pomodoro/pomodoro-timer'
import { ReligiousTime } from './religious/religious-time'

export enum ToolsTab {
	pomodoro = 'pomodoro',
	'religious-time' = 'religious-time',
}
export type ToolsTabType = keyof typeof ToolsTab

export const ToolsLayout: React.FC<any> = () => {
	const [activeTab, setActiveTab] = useState<ToolsTabType | null>(null)
	const { selectedDate } = useDate()

	const onTabClick = (tab: ToolsTabType) => {
		if (tab === activeTab) return
		setActiveTab(tab)
		setToStorage('toolsTab', tab)
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
		</WidgetContainer>
	)
}
