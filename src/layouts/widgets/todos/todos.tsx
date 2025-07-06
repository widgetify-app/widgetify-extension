import { Button } from '@/components/button/button'
import { useDate } from '@/context/date.context'
import { type AddTodoInput, TodoViewType, useTodoStore } from '@/context/todo.context'
import { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { FaChartSimple } from 'react-icons/fa6'
import { formatDateStr } from '../calendar/utils'
import { WidgetContainer } from '../widget-container'
import { ExpandableTodoInput } from './expandable-todo-input'
import { TodoStats } from './todo-stats'
import { TodoItem } from './todo.item'
import { FiList } from 'react-icons/fi'
export function TodosLayout() {
	const { selectedDate, isToday } = useDate()
	const { addTodo, todos, removeTodo, toggleTodo, updateOptions, todoOptions } =
		useTodoStore()
	const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')

	const [showStats, setShowStats] = useState<boolean>(false)
	const [todoText, setTodoText] = useState('')
	const selectedDateStr = formatDateStr(selectedDate.clone())

	const handleBlurModeToggle = () => {
		const newBlurMode = !todoOptions.blurMode
		updateOptions({ blurMode: newBlurMode })
	}

	const handleChangeViewMode = (viewMode: TodoViewType) => {
		updateOptions({ viewMode })
	}

	let selectedDateTodos = todos.filter((todo) => todo.date === selectedDateStr)

	if (todoOptions.viewMode === 'monthly') {
		const currentMonth = selectedDate.format('jMM')
		selectedDateTodos = todos.filter((todo) => {
			return todo.date.startsWith(`${selectedDate.year()}-${currentMonth}`)
		})
	}

	if (filter === 'active') {
		selectedDateTodos = selectedDateTodos.filter((todo) => !todo.completed)
	} else if (filter === 'completed') {
		selectedDateTodos = selectedDateTodos.filter((todo) => todo.completed)
	}

	const handleAddTodo = (todoInput: Omit<AddTodoInput, 'date'>) => {
		addTodo({
			...todoInput,
			date: selectedDateStr,
		})
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
						<h4
							className={
								'text-xs font-medium flex items-center text-content'
							}
						>
							<span>وظایف</span>
							<span className="mr-1 font-semibold">
								{todoOptions.viewMode === TodoViewType.Monthly
									? `${selectedDate.format('jMMMM')} ماه`
									: isToday(selectedDate)
										? ' امروز'
										: ` ${selectedDate.format('jD jMMMM')}`}
							</span>
						</h4>

						<div className="flex gap-1.5">
							<Button
								onClick={() => setShowStats(!showStats)}
								size="xs"
								className={`h-7 w-7 text-xs font-medium rounded-[0.55rem] transition-colors border-none shadow-none ${showStats ? 'bg-primary text-white' : 'text-muted hover:bg-base-300'}`}
							>
								<FaChartSimple size={12} />
							</Button>
							<Button
								onClick={handleBlurModeToggle}
								size="xs"
								className={`h-7 w-7 text-xs font-medium rounded-[0.55rem] transition-colors border-none shadow-none ${todoOptions.blurMode ? 'bg-primary text-white' : 'text-muted hover:bg-base-300'}`}
							>
								{todoOptions.blurMode ? (
									<FaEye size={12} />
								) : (
									<FaEyeSlash size={12} />
								)}
							</Button>
						</div>
					</div>

					{showStats ? (
						<TodoStats />
					) : (
						<>
							<div className="flex justify-between mb-2">
								<div className="flex gap-0.5">
									<button
										onClick={() => setFilter('all')}
										className={`px-2 py-0.5 rounded-full border-none text-[10px] leading-none cursor-pointer active:scale-95 ${filter === 'all' ? 'bg-primary text-white' : 'text-muted bg-base-300'}`}
									>
										همه
									</button>
									<button
										onClick={() => setFilter('active')}
										className={`px-2 py-0.5 rounded-full border-none text-[10px] leading-none cursor-pointer active:scale-95 ${filter === 'active' ? 'bg-primary text-white' : 'text-muted bg-base-300'}`}
									>
										فعال
									</button>
									<button
										onClick={() => setFilter('completed')}
										className={`px-2 py-0.5 rounded-full border-none text-[10px] leading-none cursor-pointer active:scale-95 ${filter === 'completed' ? 'bg-primary text-white' : 'text-muted bg-base-300'}`}
									>
										تکمیل شده
									</button>
								</div>
								<select
									value={todoOptions.viewMode}
									onChange={(e) =>
										handleChangeViewMode(
											e.target.value as TodoViewType
										)
									}
									className={
										'select select-xs text-[10px] w-[5.5rem] !px-2.5 rounded-xl !outline-none !border-none !shadow-none text-muted bg-base-300 cursor-pointer'
									}
									style={{
										backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
										backgroundPosition: 'left 0.5rem center',
										backgroundRepeat: 'no-repeat',
										backgroundSize: '1.3em 1.3em',
										paddingLeft: '3rem',
									}}
								>
									<option
										value={TodoViewType.Day}
										className="text-content"
									>
										لیست امروز
									</option>
									<option
										value={TodoViewType.Monthly}
										className="text-content"
									>
										لیست ماهانه
									</option>
								</select>
							</div>
						</>
					)}
				</div>
				<div className="mt-0.5 flex-grow overflow-hidden">
					{!showStats && (
						<div
							className={`space-y-1.5 overflow-y-auto h-full ${todoOptions.blurMode ? 'blur-mode' : ''}`}
						>
							{selectedDateTodos.length > 0 ? (
								<>
									{selectedDateTodos.map((todo) => (
										<TodoItem
											key={todo.id}
											todo={todo}
											deleteTodo={removeTodo}
											toggleTodo={toggleTodo}
											blurMode={todoOptions.blurMode}
										/>
									))}
								</>
							) : (
								<div
									className={
										'flex-1 flex flex-col items-center justify-center gap-y-1 px-5 py-8'
									}
								>
									<div
										className={
											'mt-1 flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-base-300'
										}
									>
										<FiList className="text-content" size={24} />
									</div>
									<p className="text-center text-content">
										وظیفه‌ای برای این روز وجود ندارد.
									</p>
									<p className="text-center text-[.65rem] text-content opacity-75">
										یک وظیفه جدید اضافه کنید.
									</p>
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
