import { motion } from 'framer-motion'
import React, { Suspense, useEffect, useState } from 'react'
import Analytics from '@/analytics'
import { getFromStorage, setToStorage } from '@/common/storage'
import { useDate } from '@/context/date.context'
import { WidgetContainer } from '../widget-container'
import { TabNavigation } from '../../../components/tabs/tab-navigation'

const ReligiousTime = React.lazy(() =>
	import('./religious/religious-time').then((module) => ({
		default: module.ReligiousTime,
	}))
)
const PomodoroTimer = React.lazy(() =>
	import('./pomodoro/pomodoro-timer').then((module) => ({
		default: module.PomodoroTimer,
	}))
)
const CurrencyConverter = React.lazy(() =>
	import('./currency/currency-converter').then((module) => ({
		default: module.CurrencyConverter,
	}))
)

const tabs = [
	{ id: 'pomodoro' as ToolsTabType, label: 'پومودورو' },
	{ id: 'religious-time' as ToolsTabType, label: 'اوقات شرعی' },
	{ id: 'currency-converter' as ToolsTabType, label: 'مبدل قیمت' },
]

export enum ToolsTab {
	pomodoro = 'pomodoro',
	'religious-time' = 'religious-time',
	'currency-converter' = 'currency-converter',
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
					tabs={tabs}
					activeTab={activeTab}
					onTabClick={onTabClick || (() => {})}
				/>
			</div>

			<Suspense>
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
			</Suspense>
		</WidgetContainer>
	)
}
