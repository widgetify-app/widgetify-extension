import { useAuth } from '@/context/auth.context'
import { useTheme } from '@/context/theme.context'
import { useTodoStore } from '@/context/todo.context'
import { useGetEvents } from '@/services/getMethodHooks/getEvents.hook'
import { useGetGoogleCalendarEvents } from '@/services/getMethodHooks/getGoogleCalendarEvents.hook'
import { motion } from 'framer-motion'
import type React from 'react'
import { FiCalendar, FiChevronRight, FiClipboard } from 'react-icons/fi'
import type { TabType } from '../calendar'
import { type WidgetifyDate, formatDateStr } from '../utils'
import { getGregorianEvents, getHijriEvents, getShamsiEvents } from '../utils'

interface DaySummaryProps {
	selectedDate: WidgetifyDate
	onTabClick: (tab: TabType) => void
}

export const DaySummary: React.FC<DaySummaryProps> = ({ selectedDate, onTabClick }) => {
	const { isAuthenticated } = useAuth()
	const { theme } = useTheme()
	const { todos } = useTodoStore()
	const { data: events } = useGetEvents()

	const startOfMonth = selectedDate.clone().startOf('jMonth').toDate()
	const endOfMonth = selectedDate.clone().endOf('jMonth').toDate()

	const { data: googleEvents } = useGetGoogleCalendarEvents(
		isAuthenticated,
		startOfMonth,
		endOfMonth,
	)

	const selectedDateStr = formatDateStr(selectedDate)

	const googleEventsForSelectedDate = googleEvents.filter((event) => {
		if (!event || !event.start || !event.start.dateTime) {
			return false
		}

		const eventDateStr = event.start.dateTime.split('T')[0]
		const dateStr = selectedDate.clone().locale('en').format('YYYY-MM-DD')
		return eventDateStr === dateStr
	})

	const googleEventCount = googleEventsForSelectedDate.length

	const todosForSelectedDate = todos.filter((todo) => todo.date === selectedDateStr)

	const completedTodos = todosForSelectedDate.filter((todo) => todo.completed).length
	const totalTodos = todosForSelectedDate.length

	const shamsiEvents = events ? getShamsiEvents(events, selectedDate) : []
	const gregorianEvents = events ? getGregorianEvents(events, selectedDate) : []
	const hijriEvents = events ? getHijriEvents(events, selectedDate) : []
	const allEvents = [...shamsiEvents, ...gregorianEvents, ...hijriEvents]
	const totalEventsCount = allEvents.length + googleEventCount

	const holidayEvents = allEvents.filter((event) => event.isHoliday).length

	const getContainerStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-gray-100/70'
			case 'dark':
				return 'bg-neutral-800/50'
			default:
				return 'bg-neutral-900/50'
		}
	}

	const getTextStyle = () => {
		return theme === 'light' ? 'text-gray-700' : 'text-gray-300'
	}

	const getSubTextStyle = () => {
		return theme === 'light' ? 'text-gray-500' : 'text-gray-400'
	}

	const getCardStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-white/80 hover:bg-white'
			case 'dark':
				return 'bg-neutral-800/80 hover:bg-neutral-800'
			default:
				return 'bg-neutral-900/50 hover:bg-neutral-900'
		}
	}

	return (
		<div
			className={`mt-0.5 overflow-hidden ${getContainerStyle()} rounded-tr-lg rounded-tl-lg`}
		>
			<div className="p-2">
				<h3 className={`text-xs font-medium mb-0.5 ${getTextStyle()} truncate`}>
					خلاصه روز {selectedDate.format('jD jMMMM')}
				</h3>

				<div className="grid grid-cols-2 gap-2">
					<motion.div
						whileHover={{ y: -2 }}
						whileTap={{ scale: 0.98 }}
						onClick={() => onTabClick('events')}
						className={`p-1 rounded-lg cursor-pointer transition-all ${getCardStyle()} flex items-start`}
					>
						<FiCalendar
							className={`mt-0.5 ml-2 flex-shrink-0 ${totalEventsCount > 0 ? 'text-blue-500' : getSubTextStyle()}`}
						/>
						<div className="flex-1 min-w-0">
							{' '}
							<div className={`text-xs font-medium ${getTextStyle()} truncate`}>
								{totalEventsCount} رویداد
							</div>
							<div className={`text-[.50rem] ${getSubTextStyle()} truncate`}>
								{googleEventCount > 0 && `${googleEventCount} رویداد گوگل • `}
								{holidayEvents > 0 ? `${holidayEvents} رویداد تعطیل` : 'بدون تعطیلی'}
							</div>
						</div>
						<FiChevronRight
							className={`mr-auto flex-shrink-0 ${getSubTextStyle()}`}
							size={14}
						/>
					</motion.div>

					{/* Todos card */}
					<motion.div
						whileHover={{ y: -2 }}
						whileTap={{ scale: 0.98 }}
						onClick={() => onTabClick('todos')}
						className={`p-1 rounded-lg cursor-pointer transition-all ${getCardStyle()} flex items-start`}
					>
						<FiClipboard
							className={`mt-0.5 ml-2 flex-shrink-0 ${totalTodos > 0 ? 'text-green-500' : getSubTextStyle()}`}
						/>
						<div className="flex-1 min-w-0">
							{' '}
							<div className={`text-xs font-medium ${getTextStyle()} truncate`}>
								{totalTodos} یادداشت
							</div>
							<div className={`text-[.50rem] ${getSubTextStyle()} truncate`}>
								{totalTodos > 0
									? `${completedTodos} از ${totalTodos} انجام شده`
									: 'بدون یادداشت'}
							</div>
						</div>
						<FiChevronRight
							className={`mr-auto flex-shrink-0 ${getSubTextStyle()}`}
							size={14}
						/>
					</motion.div>
				</div>
			</div>
		</div>
	)
}
