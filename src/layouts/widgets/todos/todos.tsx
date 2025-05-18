import { getFromStorage, setToStorage } from '@/common/storage'
import { Button } from '@/components/button/button'
import { useDate } from '@/context/date.context'

import { useTodoStore } from '@/context/todo.context'
import { useEffect, useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { FaChartSimple } from 'react-icons/fa6'
import { formatDateStr } from '../calendar/utils'
import { WidgetContainer } from '../widget-container'
import { ExpandableTodoInput } from './expandable-todo-input'
import { TodoStats } from './todo-stats'
import { TodoItem } from './todo.item'

export function TodosLayout() {
	const { selectedDate, isToday } = useDate()
	const { addTodo, todos, removeTodo, toggleTodo } = useTodoStore()
	const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
	const [sort, setSort] = useState<'priority' | 'time' | 'default'>('default')
	const [blurMode, setBlurMode] = useState<boolean>(false)
	const [showStats, setShowStats] = useState<boolean>(false)
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
		setTodoText('')
	}

	const getCompletionStats = () => {
		const total = selectedDateTodos.length
		const completed = selectedDateTodos.filter((todo) => todo.completed).length
		const percentage = total ? Math.round((completed / total) * 100) : 0
		return { total, completed, percentage }
	}

	const stats = getCompletionStats()

	return (
		<WidgetContainer>
			<div className="flex flex-col h-full">
				<div className="flex-none">
					<div className="flex items-center justify-between mb-2">
						<h4 className={'text-xs font-medium flex items-center widget-item-text'}>
							<span>وظایف</span>
							<span className="mr-1 font-semibold">
								{isToday(selectedDate) ? ' امروز' : ` ${selectedDate.format('jD jMMMM')}`}
							</span>
						</h4>

						<div className="flex gap-1">
							<Button size="xs" onClick={handleBlurModeToggle} isPrimary={blurMode}>
								{blurMode ? <FaEye size={12} /> : <FaEyeSlash size={12} />}
							</Button>
							<Button
								size="xs"
								onClick={() => setShowStats(!showStats)}
								isPrimary={showStats}
							>
								<FaChartSimple size={12} />
							</Button>
						</div>
					</div>

					{showStats ? (
						<TodoStats />
					) : (
						<>
							{selectedDateTodos.length > 0 && (
								<div className="mb-2">
									<div className={'h-1 mb-1 rounded-full bg-base-200'}>
										<div
											className="h-1 bg-green-500 rounded-full"
											style={{ width: `${stats.percentage}%` }}
										></div>
									</div>
									<div className={'flex justify-between text-[.65rem] widget-item-text'}>
										<span>
											{stats.completed} از {stats.total} تکمیل شده
										</span>
										<span>{stats.percentage}%</span>
									</div>
								</div>
							)}

							<div className="flex justify-between mb-2">
								<div className="flex gap-0.5 text-[.55rem]">
									<Button
										onClick={() => setFilter('all')}
										className={`px-1 py-0.5 text-[.55rem]  ${filter === 'all' ? 'btn-soft' : 'btn-ghost'}`}
										rounded="sm"
										size="xs"
									>
										همه
									</Button>
									<Button
										onClick={() => setFilter('active')}
										className={`px-1 py-0.5 text-[.55rem] ${filter === 'active' ? 'btn-soft' : 'btn-ghost'}`}
										rounded="sm"
										size="xs"
									>
										فعال
									</Button>
									<Button
										onClick={() => setFilter('completed')}
										className={`px-1 py-0.5 text-[.55rem] ${filter === 'completed' ? 'btn-soft' : 'btn-ghost'}`}
										rounded="sm"
										size="xs"
									>
										تکمیل شده
									</Button>
								</div>

								<select
									value={sort}
									onChange={(e) =>
										setSort(e.target.value as 'priority' | 'time' | 'default')
									}
									className={'text-primary text-[.65rem]'}
								>
									<option value="default">پیش‌فرض</option>
									<option value="priority">اولویت</option>
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
									<p className="text-xs">وظیفه‌ای برای این روز وجود ندارد.</p>
									<p className="text-[.65rem]">یک وظیفه جدید اضافه کنید.</p>
								</div>
							)}
						</div>
					)}
				</div>{' '}
				{!showStats && (
					<ExpandableTodoInput
						todoText={todoText}
						onChangeTodoText={setTodoText}
						onAddTodo={handleAddTodo}
					/>
				)}
			</div>

			<style>{`
                .blur-mode {
                    filter: blur(5px);
                    pointer-events: none;
                }
            `}</style>
		</WidgetContainer>
	)
}
