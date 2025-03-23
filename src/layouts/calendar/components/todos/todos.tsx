import type jalaliMoment from 'jalali-moment'
import { useEffect, useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { getFromStorage, setToStorage } from '@/common/storage'
import { useTheme } from '@/context/theme.context'
import { useTodoStore } from '@/context/todo.context'
import { formatDateStr } from '../../utils'
import { TodoInput } from './todo-input'
import { TodoItem } from './todo.item'
import { FaPlus } from 'react-icons/fa6'

type TodoProp = {
	currentDate: jalaliMoment.Moment
}

export function Todos({ currentDate }: TodoProp) {
	const { theme } = useTheme()
	const { addTodo, todos, removeTodo, toggleTodo } = useTodoStore()
	const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
	const [sort, setSort] = useState<'priority' | 'time' | 'default'>('default')
	const [blurMode, setBlurMode] = useState<boolean>(false)
	const selectedDateStr = formatDateStr(currentDate.clone())
	const [showModal, setShowModal] = useState(false)

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
		<div>
			<div className="flex items-center justify-between mb-3">
				<h4 className={`text-lg sm:text-sm ${getHeaderStyle()}`}>یادداشت‌های روز</h4>

				<div className="flex gap-2">
					<button
						onClick={handleBlurModeToggle}
						className={`p-1.5 sm:p-1 rounded-full transition-colors cursor-pointer ${getBlurModeButtonStyle(blurMode)}`}
						title={blurMode ? 'نمایش یادداشت‌ها' : 'مخفی کردن یادداشت‌ها'}
					>
						{blurMode ? <FaEye size={14} /> : <FaEyeSlash size={14} />}
					</button>

					<button
						onClick={() => setShowModal(true)}
						className={`p-1.5 sm:p-1 rounded-full transition-colors cursor-pointer ${getBlurModeButtonStyle(false)}`}
						title="افزودن یادداشت"
					>
						<FaPlus size={14} />
					</button>
				</div>
			</div>

			{selectedDateTodos.length > 0 && (
				<div className="mb-4">
					<div
						className={`h-2 sm:h-1 mb-2 sm:mb-1 rounded-full ${getProgressBarBgStyle()}`}
					>
						<div
							className="h-2 sm:h-1 bg-green-500 rounded-full"
							style={{ width: `${stats.percentage}%` }}
						></div>
					</div>
					<div className={`flex justify-between text-xs ${getStatsTextStyle()}`}>
						<span>
							{stats.completed} از {stats.total} انجام شده
						</span>
						<span>{stats.percentage}%</span>
					</div>
				</div>
			)}

			<TodoInput
				onAdd={handleAddTodo}
				showModal={showModal}
				setShowModal={setShowModal}
			/>

			<div className="flex justify-between mb-3">
				<div className="flex gap-1 sm:gap-0.5 text-xs">
					<button
						onClick={() => setFilter('all')}
						className={`px-2 sm:px-1 py-1 cursor-pointer rounded ${getFilterButtonStyle(filter === 'all')}`}
					>
						همه
					</button>
					<button
						onClick={() => setFilter('active')}
						className={`px-2 py-1 sm:px-1 cursor-pointer rounded ${getFilterButtonStyle(filter === 'active')}`}
					>
						فعال
					</button>
					<button
						onClick={() => setFilter('completed')}
						className={`px-2 py-1 sm:px-1 cursor-pointer rounded ${getFilterButtonStyle(filter === 'completed')}`}
					>
						تکمیل شده
					</button>
				</div>

				<select
					value={sort}
					onChange={(e) => setSort(e.target.value as 'priority' | 'time' | 'default')}
					className={getSelectStyle()}
				>
					<option value="default">مرتب‌سازی: پیش‌فرض</option>
					<option value="priority">مرتب‌سازی: اولویت</option>
				</select>
			</div>

			<div
				className={`pr-1 space-y-2 overflow-y-auto max-h-48 ${blurMode ? 'blur-mode' : ''}`}
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
