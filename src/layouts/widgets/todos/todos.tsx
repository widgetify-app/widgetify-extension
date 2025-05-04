import { getFromStorage, setToStorage } from '@/common/storage'
import { TextInput } from '@/components/text-input'
import { useDate } from '@/context/date.context'
import {
	getButtonStyles,
	getProgressBarBgStyle,
	getTextColor,
	useTheme,
} from '@/context/theme.context'
import { useTodoStore } from '@/context/todo.context'
import { useEffect, useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { FaChartSimple, FaPlus } from 'react-icons/fa6'
import { FiSettings } from 'react-icons/fi'
import { formatDateStr } from '../calendar/utils'
import { WidgetContainer } from '../widget-container'
import { TodoInput } from './todo-input'
import { TodoStats } from './todo-stats'
import { TodoItem } from './todo.item'

export function TodosLayout() {
	const { theme } = useTheme()
	const { selectedDate } = useDate()
	const { addTodo, todos, removeTodo, toggleTodo } = useTodoStore()
	const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
	const [sort, setSort] = useState<'priority' | 'time' | 'default'>('default')
	const [blurMode, setBlurMode] = useState<boolean>(false)
	const [showStats, setShowStats] = useState<boolean>(false)
	const [show, setShow] = useState(false)
	const [todoText, setTodoText] = useState('')
	const selectedDateStr = formatDateStr(selectedDate.clone())

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

	const handleAddQuickTodo = () => {
		if (todoText.trim()) {
			addTodo(todoText.trim(), selectedDateStr, 'medium')
			setTodoText('')
		}
	}

	let selectedDateTodos = todos
		.filter((todo) => todo.date === selectedDateStr || todo.pinned)
		.sort((a, b) => {
			if (a.pinned && !b.pinned) return -1
			if (!a.pinned && b.pinned) return 1
			return 0
		})

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
		pinned?: boolean,
	) => {
		addTodo(text, selectedDateStr, priority, category, notes, pinned)
		setTodoText('')
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
			<div className="flex flex-col h-full">
				<div className="flex-none">
					<div className="flex items-center justify-between mb-2">
						<h4 className={`text-xs font-medium ${getTextColor(theme)}`}>
							یادداشت‌های روز
						</h4>

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
						</div>
					</div>

					{showStats ? (
						<TodoStats />
					) : (
						<>
							{selectedDateTodos.length > 0 && (
								<div className="mb-2">
									<div
										className={`h-1 mb-1 rounded-full ${getProgressBarBgStyle(theme)}`}
									>
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
									onChange={(e) =>
										setSort(e.target.value as 'priority' | 'time' | 'default')
									}
									className={`${getSelectStyle()} text-[.65rem]`}
								>
									<option value="default">مرتب‌سازی: پیش‌فرض</option>
									<option value="priority">مرتب‌سازی: اولویت</option>
								</select>
							</div>
						</>
					)}
				</div>

				<div className="flex-grow overflow-hidden">
					{!showStats && (
						<div
							className={`pr-1 space-y-1 overflow-y-auto h-full  ${blurMode ? 'blur-mode' : ''}`}
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
					)}
				</div>

				{!showStats && (
					<div className="flex-none pt-2 mt-auto">
						<div className="flex items-center gap-1">
							<div className="relative flex-grow w-32">
								<TextInput
									value={todoText}
									onChange={setTodoText}
									placeholder="یادداشت جدید..."
									className="w-full py-2 text-sm rounded-md"
								/>
							</div>
							<div className="flex flex-row flex-shrink-0 gap-1">
								<button
									onClick={handleAddQuickTodo}
									disabled={!todoText.trim()}
									className={`flex items-center cursor-pointer justify-center p-2 rounded-lg  ${getButtonStyles(theme, true)} disabled:opacity-50`}
									title="افزودن یادداشت"
								>
									<FaPlus size={14} />
								</button>
								<button
									onClick={() => setShow(true)}
									className={`flex items-center cursor-pointer justify-center p-2 rounded-lg transition-colors  ${getButtonStyles(theme, blurMode)}`}
								>
									<FiSettings size={14} />
								</button>
							</div>
						</div>
					</div>
				)}
			</div>

			<TodoInput
				onAdd={handleAddTodo}
				onClose={() => setShow(false)}
				show={show}
				todoText={todoText}
			/>

			<style>{`
                .blur-mode {
                    filter: blur(5px);
                    pointer-events: none;
                }
            `}</style>
		</WidgetContainer>
	)
}
