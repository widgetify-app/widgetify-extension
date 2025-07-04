import { useAuth } from '@/context/auth.context'
import { motion } from 'framer-motion'
import type React from 'react'

import { getFromStorage, setToStorage } from '@/common/storage'
import { useDate } from '@/context/date.context'
import { useGetEvents } from '@/services/hooks/date/getEvents.hook'
import { useGetGoogleCalendarEvents } from '@/services/hooks/date/getGoogleCalendarEvents.hook'
import { useState } from 'react'
import { WidgetContainer } from '../widget-container'
import { TabNavigation } from './components/tab-navigation'
import { Events } from './events/event'
import { PomodoroTimer } from './pomodoro/pomodoro-timer'
import { ReligiousTime } from './religious/religious-time'

export type TabType = 'events' | 'todos' | 'pomodoro' | 'religious-time'

export const ToolsLayout: React.FC<any> = () => {
	const [activeTab, setActiveTab] = useState<TabType | null>(null)
	const { selectedDate, setCurrentDate } = useDate()
	const { data: events } = useGetEvents()
	const { user } = useAuth()

	const startOfMonth = selectedDate.clone().startOf('jMonth').toDate()
	const endOfMonth = selectedDate.clone().endOf('jMonth').toDate()

	const { data: googleEvents } = useGetGoogleCalendarEvents(
		user?.connections?.includes('google') || false,
		startOfMonth,
		endOfMonth
	)

	const onTabClick = (tab: TabType) => {
		if (tab === activeTab) return
		setActiveTab(tab)
		setToStorage('toolsTab', tab)
	}

	useEffect(() => {
		async function load() {
			const tabFromStorage = await getFromStorage('toolsTab')
			if (!tabFromStorage) {
				setActiveTab('events')
			} else {
				setActiveTab(tabFromStorage)
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

			{activeTab === 'events' && (
				<motion.div
					key="events-view"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
				>
					<Events
						events={events || []}
						googleEvents={googleEvents || []}
						currentDate={selectedDate}
						onDateChange={setCurrentDate}
					/>
				</motion.div>
			)}

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
