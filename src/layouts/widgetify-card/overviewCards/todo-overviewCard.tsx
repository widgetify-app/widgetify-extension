import { useGeneralSetting } from '@/context/general-setting.context'
import { TodoViewType, useTodoStore } from '@/context/todo.context'
import { formatDateStr, getCurrentDate } from '@/layouts/widgets/calendar/utils'
import { motion } from 'framer-motion'
import { FiClipboard } from 'react-icons/fi'

export function TodoOverviewCard() {
	const { timezone } = useGeneralSetting()

	const { todos, todoOptions } = useTodoStore()
	const today = getCurrentDate(timezone)

	const todayStr = formatDateStr(today)
	const todayTodos = todos.filter((todo) => {
		if (todoOptions.viewMode === TodoViewType.Day) {
			return todo.date === todayStr
		}
		const month = today.format('jMM')
		return todo.date.startsWith(`${today.year()}-${month}`)
	})
	const completedTodos = todayTodos.filter((todo) => todo.completed)
	const pendingTodos = todayTodos.filter((todo) => !todo.completed)

	const getTodoLabel = (mode: 'full' | 'short') => {
		if (mode === 'full') {
			return todoOptions.viewMode === TodoViewType.Day
				? 'وظایف امروز'
				: `وظایف ${today.format('jMMMM')} ماه`
		}

		return todoOptions.viewMode === TodoViewType.Day
			? 'امروز'
			: `${today.format('jMMMM')} ماه`
	}

	return (
		<motion.div
			className={'p-1 rounded-lg bg-content shadow-sm'}
			initial={{ opacity: 0, y: 5 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.4 }}
		>
			<div className="flex items-center gap-2">
				<FiClipboard
					className={pendingTodos.length > 0 ? 'text-green-500' : 'opacity-50'}
				/>
				<div className="flex-1">
					<p className="text-xs font-medium">{getTodoLabel('full')}</p>
					{todoOptions.blurMode ? (
						<p className="text-xs opacity-75">حالت مخفی فعال است.</p>
					) : (
						<p className="text-xs opacity-75">
							{pendingTodos.length > 0
								? `${completedTodos.length} از ${todayTodos.length} وظیفه تکمیل شده`
								: todayTodos.length > 0
									? `تمام وظایف ${getTodoLabel('short')} تکمیل شده‌اند 👏`
									: `هیچ وظیفه‌ای برای ${getTodoLabel('short')} تعریف نشده است`}
						</p>
					)}
				</div>
			</div>

			{/* Show up to 1 pending todos */}
			{pendingTodos.length > 0 && !todoOptions.blurMode && (
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
	)
}
