import { useAuth } from '@/context/auth.context'
import { useGeneralSetting } from '@/context/general-setting.context'
import { useTheme } from '@/context/theme.context'
import { useTodoStore } from '@/context/todo.context'
import { useGetDailyMessage } from '@/services/getMethodHooks/getDailyMessage.hook'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { FiClipboard, FiMessageCircle } from 'react-icons/fi'
import { formatDateStr, getCurrentDate } from '../calendar/utils'
import ClockComponent from './components/clock.component'
import { DogComponent } from './components/pet-dog.component'

export const WidgetifyLayout = () => {
	const { enablePets } = useGeneralSetting()
	const { themeUtils, theme } = useTheme()
	const { user, isAuthenticated } = useAuth()
	const { todos } = useTodoStore()
	const random = ['گوجه', 'هندونه 🍉', 'بلبل جان', 'باهوش 🧠']
	const [userName, setUserName] = useState<string>('')

	const { data: dailyMessage } = useGetDailyMessage()

	useEffect(() => {
		if (isAuthenticated && user && user.name) {
			setUserName(user.name)
		} else {
			setUserName(random[Math.floor(Math.random() * random.length)])
		}
	}, [isAuthenticated, user, random])

	// Get today's todos
	const today = getCurrentDate()
	const todayStr = formatDateStr(today)
	const todayTodos = todos.filter((todo) => todo.date === todayStr)
	const completedTodos = todayTodos.filter((todo) => todo.completed)
	const pendingTodos = todayTodos.filter((todo) => !todo.completed)

	const getContainerStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-gray-50/80'
			case 'dark':
				return 'bg-neutral-800/50'
			default: // glass
				return 'bg-black/20'
		}
	}

	return (
		<div
			className={`h-full p-3 ${themeUtils.getCardBackground()} rounded-2xl xl:max-h-96 h-80 w-full overflow-hidden`}
		>
			<div className="relative w-full h-full">
				{enablePets && <DogComponent />}

				<div className="relative z-10 flex flex-col items-center gap-2">
					<div
						className={`flex items-center justify-between w-full border-b ${themeUtils.getBorderColor()}`}
					>
						<div className="flex items-center gap-2">
							<p className="w-32 font-semibold truncate text-md">سلام {userName}! </p>
						</div>
						<ClockComponent />
					</div>

					{/* Daily Summary Content */}
					<div className="flex-1 w-full py-2 overflow-y-auto small-scrollbar">
						{/* Daily Message from API */}
						{dailyMessage?.content && (
							<motion.div
								className={`p-2 mb-3 rounded-lg ${getContainerStyle()} shadow-sm border-r-2 border-blue-400/50`}
								initial={{ opacity: 0, y: 5 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.2 }}
							>
								<div className="flex items-start gap-2">
									<FiMessageCircle className="mt-0.5 text-blue-400 flex-shrink-0" />
									<div className="flex-1">
										<p className="text-xs font-light leading-relaxed">
											{dailyMessage.content}
										</p>
									</div>
								</div>
							</motion.div>
						)}

						{/* Today's Summary */}
						<div className="space-y-3">
							{/* Todo Summary */}
							<motion.div
								className={`p-2 rounded-lg ${getContainerStyle()} shadow-sm`}
								initial={{ opacity: 0, y: 5 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.4 }}
							>
								<div className="flex items-center gap-2">
									<FiClipboard
										className={pendingTodos.length > 0 ? 'text-green-500' : 'opacity-50'}
									/>
									<div className="flex-1">
										<p className="text-xs font-medium">یادداشت‌های امروز</p>
										<p className="text-xs opacity-75">
											{pendingTodos.length > 0
												? `${completedTodos.length} از ${todayTodos.length} انجام شده`
												: todayTodos.length > 0
													? 'همه یادداشت‌ها انجام شده 👏'
													: 'هیچ یادداشتی برای امروز ندارید'}
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
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
