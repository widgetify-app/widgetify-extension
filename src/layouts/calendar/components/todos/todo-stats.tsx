import { useMemo } from 'react'
import { useTheme } from '../../../../context/theme.context'
import { useTodoStore } from '../../../../context/todo.context'

export function TodoStats() {
	const { todos } = useTodoStore()
	const { theme } = useTheme()

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

	// Theme-specific styles
	const getContainerStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-gray-100/80'
			case 'dark':
				return 'bg-neutral-800/50'
			default: // glass
				return 'bg-black/30'
		}
	}

	const getHeaderStyle = () => {
		switch (theme) {
			case 'light':
				return 'text-gray-700'

			default:
				return 'text-gray-300'
		}
	}

	const getCardStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-white/70'
			case 'dark':
				return 'bg-neutral-700/30'
			default: // glass
				return 'bg-white/10'
		}
	}

	const getLabelStyle = () => {
		switch (theme) {
			case 'light':
				return 'text-gray-600'

			default:
				return 'text-gray-400'
		}
	}

	const getValueStyle = () => {
		switch (theme) {
			case 'light':
				return 'text-gray-800'

			default:
				return 'text-gray-200'
		}
	}

	const getProgressBarBgStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-gray-300'

			default:
				return 'bg-gray-700'
		}
	}

	const getCategoryCountStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-blue-100/60 text-blue-600'
			default:
				return 'bg-blue-500/20 text-blue-400'
		}
	}

	const getCategoryTextStyle = () => {
		switch (theme) {
			case 'light':
				return 'text-gray-700'

			default:
				return 'text-gray-300'
		}
	}

	const getPriorityBarColors = () => {
		switch (theme) {
			case 'light':
				return {
					high: 'bg-red-400/70',
					medium: 'bg-yellow-400/70',
					low: 'bg-green-400/70',
				}

			default:
				return {
					high: 'bg-red-500/60',
					medium: 'bg-yellow-500/60',
					low: 'bg-green-500/60',
				}
		}
	}

	const priorityColors = getPriorityBarColors()

	return (
		<div className={`p-4 mt-4 ${getContainerStyle()} rounded-xl`}>
			<h4 className={`mb-3 text-lg ${getHeaderStyle()}`}>آمار کلی</h4>

			<div className="grid grid-cols-2 gap-3">
				<div className={`p-3 rounded-lg ${getCardStyle()}`}>
					<span className={`text-xs ${getLabelStyle()}`}>تکمیل شده</span>
					<div className="flex items-end justify-between">
						<span className={`text-xl ${getValueStyle()}`}>{stats.completedTodos}</span>
						<span className={`text-sm ${getLabelStyle()}`}>از {stats.totalTodos}</span>
					</div>
					<div className={`h-1 mt-2 ${getProgressBarBgStyle()} rounded-full`}>
						<div
							className="h-1 bg-green-500 rounded-full"
							style={{ width: `${stats.completionRate}%` }}
						></div>
					</div>
				</div>

				<div className={`p-3 rounded-lg ${getCardStyle()}`}>
					<span className={`text-xs ${getLabelStyle()}`}>اولویت‌ها</span>
					<div className="flex justify-between mt-2">
						<div className="text-center">
							<div className="flex items-end h-10">
								<div
									className={`w-6 rounded-t ${priorityColors.high}`}
									style={{
										height: `${(stats.priorityStats.high / Math.max(1, stats.totalTodos)) * 100}%`,
									}}
								></div>
							</div>
							<span className={`text-xs ${getLabelStyle()}`}>زیاد</span>
						</div>
						<div className="text-center">
							<div className="flex items-end h-10">
								<div
									className={`w-6 rounded-t ${priorityColors.medium}`}
									style={{
										height: `${(stats.priorityStats.medium / Math.max(1, stats.totalTodos)) * 100}%`,
									}}
								></div>
							</div>
							<span className={`text-xs ${getLabelStyle()}`}>متوسط</span>
						</div>
						<div className="text-center">
							<div className="flex items-end h-10">
								<div
									className={`w-6 rounded-t ${priorityColors.low}`}
									style={{
										height: `${(stats.priorityStats.low / Math.max(1, stats.totalTodos)) * 100}%`,
									}}
								></div>
							</div>
							<span className={`text-xs ${getLabelStyle()}`}>کم</span>
						</div>
					</div>
				</div>
			</div>

			{stats.topCategories.length > 0 && (
				<div className={`p-3 mt-3 rounded-lg ${getCardStyle()}`}>
					<span className={`text-xs ${getLabelStyle()}`}>دسته‌بندی‌های پرکاربرد</span>
					<div className="mt-2 space-y-2">
						{stats.topCategories.map(([category, count]) => (
							<div key={category} className="flex items-center justify-between">
								<span className={`text-sm ${getCategoryTextStyle()}`}>{category}</span>
								<span
									className={`text-xs px-2 py-0.5 rounded-full ${getCategoryCountStyle()}`}
								>
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
