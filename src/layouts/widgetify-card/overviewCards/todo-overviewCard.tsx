import { motion } from 'framer-motion'
import { FiClipboard } from 'react-icons/fi'
import { useGeneralSetting } from '@/context/general-setting.context'
import { TodoViewType, useTodoStore } from '@/context/todo.context'
import { formatDateStr, getCurrentDate } from '@/layouts/widgets/calendar/utils'

export function TodoOverviewCard() {
	const { selected_timezone: timezone, blurMode } = useGeneralSetting()

	const { todos, todoOptions } = useTodoStore()
	const today = getCurrentDate(timezone.value)

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
			className={
				'p-1 rounded-lg bg-base-300/70 hover:bg-base-300 border border-base-300/70 active:scale-98'
			}
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
					{blurMode ? (
						<p className="text-[10px] opacity-75">حالت مخفی فعال است.</p>
					) : (
						<p className="text-[10px] opacity-75">
							{pendingTodos.length > 0
								? `${completedTodos.length} از ${todayTodos.length} وظیفه تکمیل شده`
								: todayTodos.length > 0
									? `تمام وظایف ${getTodoLabel('short')} تکمیل شده‌اند 👏`
									: `هیچ وظیفه‌ای برای ${getTodoLabel('short')} تعریف نشده است`}
						</p>
					)}
				</div>
			</div>
		</motion.div>
	)
}
