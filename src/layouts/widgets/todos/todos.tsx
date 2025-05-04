import { getFromStorage, setToStorage } from '@/common/storage'
import { useDate } from '@/context/date.context'
import {
	getButtonStyles,
	getContainerBackground,
	getProgressBarBgStyle,
	getTextColor,
	useTheme,
} from '@/context/theme.context'
import { useTodoStore } from '@/context/todo.context'
import { useEffect, useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { FaChartSimple, FaPlus } from 'react-icons/fa6'
import { formatDateStr } from '../calendar/utils'
import { WidgetContainer } from '../widget-container'
import { TodoInput } from './todo-input'
import { TodoStats } from './todo-stats'
import { TodoItem } from './todo.item'

export function TodosLayout() {
	const { theme } = useTheme()
	const { currentDate } = useDate()
	const { addTodo, todos, removeTodo, toggleTodo } = useTodoStore()
	const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
	const [sort, setSort] = useState<'priority' | 'time' | 'default'>('default')
	const [blurMode, setBlurMode] = useState<boolean>(false)
	const [showStats, setShowStats] = useState<boolean>(false)
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

	const stats = getCompletionStats()

	return (
		<WidgetContainer>
			<div className="flex items-center justify-between mb-2">
				<h4 className={`text-xs font-medium ${getTextColor(theme)}`}>یادداشت‌های روز</h4>

				<div className="flex gap-1">
					<button
						onClick={handleBlurModeToggle}
						className={`flex items-center justify-center rounded-full transition-colors cursor-pointer ${getButtonStyles(theme, blurMode)} !px-1  !py-1`}
						title={blurMode ? 'نمایش یادداشت‌ها' : 'مخفی کردن یادداشت‌ها'}
					>
						{blurMode ? <FaEye size={12} /> : <FaEyeSlash size={12} />}
					</button>
					<button
						onClick={() => setShowStats(!showStats)}
						className={`flex items-center justify-center rounded-full transition-colors cursor-pointer ${getButtonStyles(theme, showStats)} !px-1  !py-1`}
						title={showStats ? 'مخفی کردن آمار' : 'نمایش آمار'}
					>
						<FaChartSimple size={12} />
					</button>
					<button
						onClick={() => setShow(true)}
						className={`flex items-center cursor-pointer justify-center gap-1 px-1.5 py-0.5 rounded-lg transition-all duration-200 shadow-sm hover:shadow ${getButtonStyles(theme, true)} !px-1.5 !py-0.5`}
						title="افزودن یادداشت جدید"
					>
						<FaPlus className="w-2 h-2" />
						<span className="text-xs font-medium">یادداشت جدید</span>
					</button>
				</div>
			</div>

			{showStats ? (
				<TodoStats />
			) : (
				<>
					{selectedDateTodos.length > 0 && (
						<div className="mb-2">
							<div className={`h-1 mb-1 rounded-full ${getProgressBarBgStyle(theme)}`}>
								<div
									className="h-1 bg-green-500 rounded-full"
									style={{ width: `${stats.percentage}%` }}
								></div>
							</div>
							<div
								className={`flex justify-between text-[.65rem] ${getTextColor(theme)}`}
							>
								<span>
									{stats.completed} از {stats.total} انجام شده
								</span>
								<span>{stats.percentage}%</span>
							</div>
						</div>
					)}

					<TodoInput onAdd={handleAddTodo} onClose={() => setShow(false)} show={show} />

					<div className="flex justify-between mb-2">
						<div className="flex gap-0.5 text-[.65rem]">
							<button
								onClick={() => setFilter('all')}
								className={`px-1 py-0.5 cursor-pointer rounded ${getFilterButtonStyle(filter === 'all')}`}
							>
								همه
							</button>
							<button
								onClick={() => setFilter('active')}
								className={`px-1 py-0.5 cursor-pointer rounded ${getFilterButtonStyle(filter === 'active')}`}
							>
								فعال
							</button>
							<button
								onClick={() => setFilter('completed')}
								className={`px-1 py-0.5 cursor-pointer rounded ${getFilterButtonStyle(filter === 'completed')}`}
							>
								تکمیل شده
							</button>
						</div>

						<select
							value={sort}
							onChange={(e) => setSort(e.target.value as 'priority' | 'time' | 'default')}
							className={`${getSelectStyle()} text-[.65rem]`}
						>
							<option value="default">مرتب‌سازی: پیش‌فرض</option>
							<option value="priority">مرتب‌سازی: اولویت</option>
						</select>
					</div>

					<div
						className={`pr-1 space-y-1 overflow-y-auto max-h-36 ${blurMode ? 'blur-mode' : ''}`}
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
							<div className={'py-4 text-center'}>
								<p className="text-xs">یادداشتی برای این روز ندارید.</p>
								<p className="text-[.65rem]">یک یادداشت جدید اضافه کنید!</p>
							</div>
						)}
					</div>
				</>
			)}

			<style>{`
                .blur-mode {
                    filter: blur(5px);
                    pointer-events: none;
                }
            `}</style>
		</WidgetContainer>
	)
}
