import { useAuth } from '@/context/auth.context'
import { motion } from 'framer-motion'
import type React from 'react'

import { useDate } from '@/context/date.context'
import { useGetEvents } from '@/services/hooks/date/getEvents.hook'
import { useGetGoogleCalendarEvents } from '@/services/hooks/date/getGoogleCalendarEvents.hook'
import { useState } from 'react'
import type { TabType } from '../calendar/calendar'
import { WidgetContainer } from '../widget-container'
import { TabNavigation } from './components/tab-navigation'
import { Events } from './events/event'
import { PomodoroTimer } from './pomodoro/pomodoro-timer'
import { ReligiousTime } from './religious/religious-time'

export const ToolsLayout: React.FC<any> = () => {
	const [activeTab, setActiveTab] = useState<TabType>('events')
	const { selectedDate, setCurrentDate } = useDate()
	const { data: events } = useGetEvents()
	const { user } = useAuth()

	const startOfMonth = selectedDate.clone().startOf('jMonth').toDate()
	const endOfMonth = selectedDate.clone().endOf('jMonth').toDate()

	const { data: googleEvents } = useGetGoogleCalendarEvents(
		user?.connections?.includes('google') || false,
		startOfMonth,
		endOfMonth,
	)

	const onTabClick = (tab: TabType) => {
		setActiveTab(tab)
	}

	return (
		<WidgetContainer>
			<div className="mb-2">
				<TabNavigation activeTab={activeTab} onTabClick={onTabClick || (() => {})} />
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
