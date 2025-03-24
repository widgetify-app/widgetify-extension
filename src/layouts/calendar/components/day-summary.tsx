import { useTheme } from '@/context/theme.context'
import { useTodoStore } from '@/context/todo.context'
import { useGetEvents } from '@/services/getMethodHooks/getEvents.hook'
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
	const { theme } = useTheme()
	const { todos } = useTodoStore()
	const { data: events } = useGetEvents()
	const selectedDateStr = formatDateStr(selectedDate)

	const todosForSelectedDate = todos.filter((todo) => todo.date === selectedDateStr)

	const completedTodos = todosForSelectedDate.filter((todo) => todo.completed).length
	const totalTodos = todosForSelectedDate.length

	const shamsiEvents = events ? getShamsiEvents(events, selectedDate) : []
	const gregorianEvents = events ? getGregorianEvents(events, selectedDate) : []
	const hijriEvents = events ? getHijriEvents(events, selectedDate) : []
	const allEvents = [...shamsiEvents, ...gregorianEvents, ...hijriEvents]

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

	const getHolidayStyle = () => {
		return holidayEvents > 0 ? 'text-red-500' : getSubTextStyle()
	}

	return (
		<div
			className={`mt-1 overflow-hidden ${getContainerStyle()} rounded-tr-lg rounded-tl-lg`}
		>
			<div className="p-2">
				<h3 className={`text-sm font-medium mb-2 ${getTextStyle()} truncate`}>
					خلاصه روز {selectedDate.format('jD jMMMM')}
				</h3>

				<div className="grid grid-cols-2 gap-2">
					<motion.div
						whileHover={{ y: -2 }}
						whileTap={{ scale: 0.98 }}
						onClick={() => onTabClick('events')}
						className={`p-3 rounded-lg cursor-pointer transition-all ${getCardStyle()} flex items-start`}
					>
						<FiCalendar
							className={`mt-0.5 ml-2 flex-shrink-0 ${allEvents.length > 0 ? 'text-blue-500' : getSubTextStyle()}`}
						/>
						<div className="flex-1 min-w-0">
							{' '}
							<div className={`text-sm font-medium ${getTextStyle()} truncate`}>
								{allEvents.length} رویداد
							</div>
							<div className={`text-xs ${getHolidayStyle()} truncate`}>
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
						className={`p-3 rounded-lg cursor-pointer transition-all ${getCardStyle()} flex items-start`}
					>
						<FiClipboard
							className={`mt-0.5 ml-2 flex-shrink-0 ${totalTodos > 0 ? 'text-green-500' : getSubTextStyle()}`}
						/>
						<div className="flex-1 min-w-0">
							{' '}
							<div className={`text-sm font-medium ${getTextStyle()} truncate`}>
								{totalTodos} یادداشت
							</div>
							<div className={`text-xs ${getSubTextStyle()} truncate`}>
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
