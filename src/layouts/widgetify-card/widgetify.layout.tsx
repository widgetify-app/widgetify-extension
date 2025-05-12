import { useAuth } from '@/context/auth.context'
import { useGeneralSetting } from '@/context/general-setting.context'
import {
	getBorderColor,
	getWidgetItemBackground,
	useTheme,
} from '@/context/theme.context'
import { useTodoStore } from '@/context/todo.context'
import { useGetGoogleCalendarEvents } from '@/services/hooks/date/getGoogleCalendarEvents.hook'
import { useGetDailyMessage } from '@/services/hooks/getDailyMessage.hook'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { FiCalendar, FiClipboard, FiMessageCircle } from 'react-icons/fi'

import {
	filterGoogleEventsByDate,
	formatDateStr,
	getCurrentDate,
} from '../widgets/calendar/utils'
import { WidgetContainer } from '../widgets/widget-container'
import ClockComponent from './components/clock.component'
import { DogComponent } from './components/pet-dog.component'

export const WidgetifyLayout = () => {
	const { enablePets, timezone } = useGeneralSetting()
	const { theme } = useTheme()
	const { user, isAuthenticated } = useAuth()
	const { todos } = useTodoStore()
	const [userName, setUserName] = useState<string>('')

	const { data: dailyMessage } = useGetDailyMessage()

	const today = getCurrentDate(timezone)

	const { data: googleEvents } = useGetGoogleCalendarEvents(
		isAuthenticated && (user?.connections?.includes('google') || false),
		today.clone().toDate(),
	)

	useEffect(() => {
		if (isAuthenticated && user && user.name) {
			setUserName(user.name)
		}
	}, [isAuthenticated, user])

	const todayStr = formatDateStr(today)
	const todayTodos = todos.filter((todo) => todo.date === todayStr)
	const completedTodos = todayTodos.filter((todo) => todo.completed)
	const pendingTodos = todayTodos.filter((todo) => !todo.completed)

	const todayEvents = filterGoogleEventsByDate(googleEvents, today)
	const upcomingEvents = todayEvents.filter((event) => {
		const now = new Date()
		const endTime = new Date(event.end.dateTime)
		return now < endTime
	})

	return (
		<WidgetContainer className="overflow-hidden">
			<div className="relative w-full h-full">
				{enablePets && <DogComponent />}

				<div className="relative z-10 flex flex-col items-center gap-2">
					<div
						className={`flex items-center justify-between w-full border-b ${getBorderColor(theme)}`}
					>
						<div className="flex items-center gap-2">
							<p className="w-32 text-xs font-semibold truncate">سلام {userName}! </p>
						</div>
						<ClockComponent />
					</div>

					{/* Daily Summary Content */}
					<div className="flex-1 w-full py-2 overflow-y-auto small-scrollbar">
						{dailyMessage?.content && (
							<div
								className={`p-2 mb-3 rounded-lg ${getWidgetItemBackground(theme)} shadow-sm border-r-2 border-blue-400/50`}
							>
								<div className="flex items-start gap-2">
									{dailyMessage.isAi && (
										<FiMessageCircle className="mt-0.5 text-blue-400 flex-shrink-0" />
									)}
									<div className="flex-1">
										<div
											className="text-xs font-light leading-relaxed"
											// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
											dangerouslySetInnerHTML={{ __html: dailyMessage.content }}
										/>
									</div>
								</div>
							</div>
						)}

						<div className="space-y-3">
							<motion.div
								className={`p-2 rounded-lg ${getWidgetItemBackground(theme)} shadow-sm`}
								initial={{ opacity: 0, y: 5 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.4 }}
							>
								<div className="flex items-center gap-2">
									<FiClipboard
										className={pendingTodos.length > 0 ? 'text-green-500' : 'opacity-50'}
									/>
									<div className="flex-1">
										<p className="text-xs font-medium">وظایف امروز</p>
										<p className="text-xs opacity-75">
											{pendingTodos.length > 0
												? `${completedTodos.length} از ${todayTodos.length} وظیفه انجام شده`
												: todayTodos.length > 0
													? 'تمام وظایف امروز انجام شده 👏'
													: 'برای امروز وظیفه‌ای ثبت نشده است'}
										</p>
									</div>
								</div>

								{/* Show up to 1 pending todos */}
								{pendingTodos.length > 0 && (
									<div className="pr-6 mt-2 space-y-1">
										{pendingTodos.slice(0, 1).map((todo) => (
											<div key={todo.id} className="flex items-center gap-1 text-xs">
												<span
													className={`w-2 h-2 rounded-full inline-block ${
														todo.priority === 'high'
															? 'bg-red-500'
															: todo.priority === 'medium'
																? 'bg-yellow-500'
																: 'bg-green-500'
													}`}
												></span>
												<p className="flex-1 font-light truncate">{todo.text}</p>
											</div>
										))}
										{pendingTodos.length > 1 && (
											<p className="text-xs italic opacity-75">
												و {pendingTodos.length - 1} مورد دیگر...
											</p>
										)}
									</div>
								)}
							</motion.div>

							{/* Google Calendar Events Summary */}
							{user?.connections?.includes('google') && (
								<motion.div
									className={`p-2 rounded-lg ${getWidgetItemBackground(theme)} shadow-sm`}
									initial={{ opacity: 0, y: 5 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.5 }}
								>
									<div className="flex items-center gap-2">
										<FiCalendar
											className={
												upcomingEvents.length > 0 ? 'text-blue-500' : 'opacity-50'
											}
										/>
										<div className="flex-1">
											<p className="text-xs font-medium">جلسات امروز</p>
											<p className="text-xs opacity-75">
												{upcomingEvents.length > 0
													? `${upcomingEvents.length} جلسه باقی‌مانده`
													: todayEvents.length > 0
														? 'همه جلسات به پایان رسیده‌اند'
														: 'هیچ جلسه‌ای برای امروز ندارید'}
											</p>
										</div>
									</div>

									{/* Show up to 1 upcoming event */}
									{upcomingEvents.length > 0 && (
										<div className="pr-6 mt-2 space-y-1">
											{upcomingEvents.slice(0, 1).map((event) => (
												<div key={event.id} className="flex items-center gap-1 text-xs">
													<span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
													<p className="flex-1 font-light truncate">{event.summary}</p>
												</div>
											))}
											{upcomingEvents.length > 1 && (
												<p className="text-xs italic opacity-75">
													و {upcomingEvents.length - 1} جلسه دیگر...
												</p>
											)}
										</div>
									)}
								</motion.div>
							)}
						</div>
					</div>
				</div>
			</div>
		</WidgetContainer>
	)
}
