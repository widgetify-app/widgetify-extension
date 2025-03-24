import { getFromStorage, setToStorage } from '@/common/storage'
import { useTheme } from '@/context/theme.context'
import { useTodoStore } from '@/context/todo.context'
import { useEffect, useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { FaPlus } from 'react-icons/fa6'
import { type WidgetifyDate, formatDateStr } from '../../utils'
import { TodoInput } from './todo-input'
import { TodoItem } from './todo.item'

type TodoProp = {
	currentDate: WidgetifyDate
}

export function Todos({ currentDate }: TodoProp) {
	const { theme } = useTheme()
	const { addTodo, todos, removeTodo, toggleTodo } = useTodoStore()
	const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
	const [sort, setSort] = useState<'priority' | 'time' | 'default'>('default')
	const [blurMode, setBlurMode] = useState<boolean>(false)
	const [show, setShow] = useState(false)
	const selectedDateStr = formatDateStr(currentDate.clone())

	useEffect(() => {
		async function loadBlurMode() {
			try {
				const savedBlurMode = await getFromStorage('todoBlurMode')
				if (savedBlurMode !== null) {
					setBlurMode(savedBlurMode)
				}
			} catch (error) {
				console.error('Error loading blur mode:', error)
			}
		}

		loadBlurMode()
	}, [])

	const handleBlurModeToggle = () => {
		const newBlurMode = !blurMode
		setBlurMode(newBlurMode)
		setToStorage('todoBlurMode', newBlurMode)
	}

	let selectedDateTodos = todos.filter((todo) => todo.date === selectedDateStr)

	if (filter === 'active') {
		selectedDateTodos = selectedDateTodos.filter((todo) => !todo.completed)
	} else if (filter === 'completed') {
		selectedDateTodos = selectedDateTodos.filter((todo) => todo.completed)
	}

	if (sort === 'priority') {
		const priorityValues = { high: 3, medium: 2, low: 1 }
		selectedDateTodos = [...selectedDateTodos].sort(
			(a, b) => priorityValues[b.priority] - priorityValues[a.priority],
		)
	}

	const handleAddTodo = (
		text: string,
		priority: 'low' | 'medium' | 'high',
		category?: string,
		notes?: string,
	) => {
		addTodo(text, selectedDateStr, priority, category, notes)
	}

	const getCompletionStats = () => {
		const total = selectedDateTodos.length
		const completed = selectedDateTodos.filter((todo) => todo.completed).length
		const percentage = total ? Math.round((completed / total) * 100) : 0
		return { total, completed, percentage }
	}

	// Theme-specific styles
	const getHeaderStyle = () => {
		switch (theme) {
			case 'light':
				return 'text-gray-700'
			default:
				return 'text-gray-300'
		}
	}

	const getBlurModeButtonStyle = (isActive: boolean) => {
		if (isActive) {
			return 'bg-blue-600 text-white'
		}

		switch (theme) {
			case 'light':
				return 'bg-gray-300/70 text-gray-600 hover:text-gray-800 hover:bg-gray-300'
			case 'dark':
				return 'bg-gray-700/50 text-gray-400 hover:text-gray-300 hover:bg-gray-700'
			default: // glass
				return 'bg-gray-700/30 text-gray-400 hover:text-gray-300 hover:bg-gray-700/50'
		}
	}

	const getProgressBarBgStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-gray-300'
			case 'dark':
				return 'bg-gray-700'
			default: // glass
				return 'bg-gray-700/50'
		}
	}

	const getStatsTextStyle = () => {
		switch (theme) {
			case 'light':
				return 'text-gray-600'
			default:
				return 'text-gray-400'
		}
	}

	const getFilterButtonStyle = (isActive: boolean) => {
		if (isActive) {
			switch (theme) {
				case 'light':
					return 'bg-blue-100 text-blue-700'
				default:
					return 'bg-blue-500/20 text-blue-400'
			}
		}

		switch (theme) {
			case 'light':
				return 'text-gray-600 hover:text-gray-800'
			default:
				return 'text-gray-400 hover:text-gray-300'
		}
	}

	const getSelectStyle = () => {
		switch (theme) {
			case 'light':
				return 'text-gray-700 bg-transparent border-none focus:ring-0'
			default:
				return 'text-gray-400 bg-transparent border-none focus:ring-0'
		}
	}

	const getEmptyStateStyle = () => {
		switch (theme) {
			case 'light':
				return 'text-gray-500'
			default:
				return 'text-gray-500'
		}
	}

	const stats = getCompletionStats()

	return (
		<div className="max-w-64">
			<div className="flex items-center justify-between mb-3">
				<h4 className={`text-sm ${getHeaderStyle()}`}>یادداشت‌های روز</h4>

				<div className="flex space-x-2">
					<button
						onClick={handleBlurModeToggle}
						className={`flex items-center justify-center xl:p-1.5 p-1 rounded-full transition-colors cursor-pointer ${getBlurModeButtonStyle(blurMode)}`}
						title={blurMode ? 'نمایش یادداشت‌ها' : 'مخفی کردن یادداشت‌ها'}
					>
						{blurMode ? (
							<FaEye className="xl:w-3 xl:h-3" />
						) : (
							<FaEyeSlash className="xl:w-3 xl:h-3" />
						)}
					</button>
					<button
						onClick={() => setShow(true)}
						className={`flex items-center justify-center gap-1.5 px-2 py-1 cursor-pointer rounded-lg transition-all duration-200 shadow-sm hover:shadow
                        ${
													theme === 'light'
														? 'bg-blue-500 hover:bg-blue-600 text-white'
														: 'bg-blue-600/80 hover:bg-blue-500/90 text-white'
												}
    `}
						title="افزودن یادداشت جدید"
					>
						<FaPlus className="xl:w-3 xl:h-3 w-2.5 h-2.5" />
						<span className="text-xs font-medium">یادداشت جدید</span>
					</button>
				</div>
			</div>

			{selectedDateTodos.length > 0 && (
				<div className="mb-4">
					<div className={`xl:h-2 h-1 mb-2 rounded-full ${getProgressBarBgStyle()}`}>
						<div
							className="h-1 bg-green-500 rounded-full xl:h-2"
							style={{ width: `${stats.percentage}%` }}
						></div>
					</div>
					<div
						className={`flex justify-between text-[.65rem] xl:text-xs ${getStatsTextStyle()}`}
					>
						<span>
							{stats.completed} از {stats.total} انجام شده
						</span>
						<span>{stats.percentage}%</span>
					</div>
				</div>
			)}

			<TodoInput onAdd={handleAddTodo} onClose={() => setShow(false)} show={show} />

			<div className="flex justify-between mb-3">
				<div className="flex gap-1 xl:text-xs text-[.65rem]">
					<button
						onClick={() => setFilter('all')}
						className={`px-1 xl:px-2 py-1 cursor-pointer rounded ${getFilterButtonStyle(filter === 'all')}`}
					>
						همه
					</button>
					<button
						onClick={() => setFilter('active')}
						className={`px-1 xl:px-2 py-1 cursor-pointer rounded ${getFilterButtonStyle(filter === 'active')}`}
					>
						فعال
					</button>
					<button
						onClick={() => setFilter('completed')}
						className={`px-1 xl:px-2 py-1 cursor-pointer rounded ${getFilterButtonStyle(filter === 'completed')}`}
					>
						تکمیل شده
					</button>
				</div>

				<select
					value={sort}
					onChange={(e) => setSort(e.target.value as 'priority' | 'time' | 'default')}
					className={`${getSelectStyle()} xl:text-xs text-[.65rem]`}
				>
					<option value="default">مرتب‌سازی: پیش‌فرض</option>
					<option value="priority">مرتب‌سازی: اولویت</option>
				</select>
			</div>

			<div
				className={`pr-1 space-y-2 overflow-y-auto max-h-32 xl:max-h-52 ${blurMode ? 'blur-mode' : ''}`}
			>
				{selectedDateTodos.length > 0 ? (
					<>
						{selectedDateTodos.map((todo) => (
							<TodoItem
								key={todo.id}
								todo={todo}
								deleteTodo={removeTodo}
								toggleTodo={toggleTodo}
								blurMode={blurMode}
							/>
						))}
					</>
				) : (
					<div className={`py-6 text-center ${getEmptyStateStyle()}`}>
						<p>یادداشتی برای این روز ندارید.</p>
						<p className="text-sm">یک یادداشت جدید اضافه کنید!</p>
					</div>
				)}
			</div>

			<style>{`
                .blur-mode {
                    filter: blur(5px);
                    pointer-events: none;
                }
            `}</style>
		</div>
	)
}
