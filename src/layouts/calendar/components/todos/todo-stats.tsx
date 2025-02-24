import { useMemo } from 'react'
import { useTodo } from '../../../../context/todo.context'

export function TodoStats() {
	const { todos } = useTodo()

	const stats = useMemo(() => {
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
	}, [todos])

	return (
		<div className="p-4 mt-4 bg-neutral-800/50 rounded-xl">
			<h4 className="mb-3 text-lg text-gray-300">آمار کلی</h4>

			<div className="grid grid-cols-2 gap-3">
				<div className="p-3 rounded-lg bg-neutral-700/30">
					<span className="text-xs text-gray-400">تکمیل شده</span>
					<div className="flex items-end justify-between">
						<span className="text-xl text-gray-200">{stats.completedTodos}</span>
						<span className="text-sm text-gray-400">از {stats.totalTodos}</span>
					</div>
					<div className="h-1 mt-2 bg-gray-700 rounded-full">
						<div
							className="h-1 bg-green-500 rounded-full"
							style={{ width: `${stats.completionRate}%` }}
						></div>
					</div>
				</div>

				<div className="p-3 rounded-lg bg-neutral-700/30">
					<span className="text-xs text-gray-400">اولویت‌ها</span>
					<div className="flex justify-between mt-2">
						<div className="text-center">
							<div className="flex items-end h-10">
								<div
									className="w-6 rounded-t bg-red-500/60"
									style={{
										height: `${(stats.priorityStats.high / Math.max(1, stats.totalTodos)) * 100}%`,
									}}
								></div>
							</div>
							<span className="text-xs text-gray-400">زیاد</span>
						</div>
						<div className="text-center">
							<div className="flex items-end h-10">
								<div
									className="w-6 rounded-t bg-yellow-500/60"
									style={{
										height: `${(stats.priorityStats.medium / Math.max(1, stats.totalTodos)) * 100}%`,
									}}
								></div>
							</div>
							<span className="text-xs text-gray-400">متوسط</span>
						</div>
						<div className="text-center">
							<div className="flex items-end h-10">
								<div
									className="w-6 rounded-t bg-green-500/60"
									style={{
										height: `${(stats.priorityStats.low / Math.max(1, stats.totalTodos)) * 100}%`,
									}}
								></div>
							</div>
							<span className="text-xs text-gray-400">کم</span>
						</div>
					</div>
				</div>
			</div>

			{stats.topCategories.length > 0 && (
				<div className="p-3 mt-3 rounded-lg bg-neutral-700/30">
					<span className="text-xs text-gray-400">دسته‌بندی‌های پرکاربرد</span>
					<div className="mt-2 space-y-2">
						{stats.topCategories.map(([category, count]) => (
							<div key={category} className="flex items-center justify-between">
								<span className="text-sm text-gray-300">{category}</span>
								<span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">
									{count}
								</span>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	)
}
