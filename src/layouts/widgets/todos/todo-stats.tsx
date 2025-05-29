import { useTodoStore } from '@/context/todo.context'

export function TodoStats() {
	const { todos } = useTodoStore()

	const calculateTodoStats = () => {
		const totalTodos = todos.length
		const completedTodos = todos.filter((todo) => todo.completed).length
		const completionRate = totalTodos
			? Math.round((completedTodos / totalTodos) * 100)
			: 0

		const priorityStats = {
			high: todos.filter((todo) => todo.priority === 'high').length,
			medium: todos.filter((todo) => todo.priority === 'medium').length,
			low: todos.filter((todo) => todo.priority === 'low').length,
		}

		const categoryCounts: Record<string, number> = {}
		// biome-ignore lint/complexity/noForEach: <explanation>
		todos.forEach((todo) => {
			if (todo.category) {
				categoryCounts[todo.category] = (categoryCounts[todo.category] || 0) + 1
			}
		})

		const topCategories = Object.entries(categoryCounts)
			.sort((a, b) => b[1] - a[1])
			.slice(0, 3)

		return {
			totalTodos,
			completedTodos,
			completionRate,
			priorityStats,
			topCategories,
		}
	}

	const getPriorityBarColors = () => {
		return {
			high: 'bg-red-500/60',
			medium: 'bg-yellow-500/60',
			low: 'bg-green-500/60',
		}
	}

	const priorityColors = getPriorityBarColors()
	const stats = calculateTodoStats()
	return (
		<div className={'p-2 mt-2  rounded-lg'}>
			<h4 className={'mb-1 text-sm font-medium text-content'}>آمار کلی</h4>

			<div className="flex flex-col gap-1">
				<div className={'p-1 rounded-lg border widget-item-border'}>
					<span className={'text-xs text-content'}>تکمیل شده</span>
					<div className="flex items-end justify-between">
						<span className={'text-lg text-content'}>{stats.completedTodos}</span>
						<span className={'text-xs text-content'}>از {stats.totalTodos}</span>
					</div>
					<div className={'h-1 mt-1 bg-base-300 rounded-full'}>
						<div
							className="h-1 bg-green-500 rounded-full"
							style={{ width: `${stats.completionRate}%` }}
						></div>
					</div>
				</div>

				<div className={'p-2 rounded-lg  border widget-item-border'}>
					<span className={'text-xs text-content'}>اولویت‌ها</span>
					<div className="flex justify-between mt-1">
						<div className="text-center">
							<div className="flex items-end h-8">
								<div
									className={`w-5 rounded-t ${priorityColors.high}`}
									style={{
										height: `${(stats.priorityStats.high / Math.max(1, stats.totalTodos)) * 100}%`,
									}}
								></div>
							</div>
							<span className={'text-xs text-content'}>زیاد</span>
						</div>
						<div className="text-center">
							<div className="flex items-end h-8">
								<div
									className={`w-5 rounded-t ${priorityColors.medium}`}
									style={{
										height: `${(stats.priorityStats.medium / Math.max(1, stats.totalTodos)) * 100}%`,
									}}
								></div>
							</div>
							<span className={'text-xs text-content'}>متوسط</span>
						</div>
						<div className="text-center">
							<div className="flex items-end h-8">
								<div
									className={`w-5 rounded-t ${priorityColors.low}`}
									style={{
										height: `${(stats.priorityStats.low / Math.max(1, stats.totalTodos)) * 100}%`,
									}}
								></div>
							</div>
							<span className={'text-xs text-content'}>کم</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
