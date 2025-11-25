import {
	closestCenter,
	DndContext,
	type DragEndEvent,
	PointerSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core'
import {
	arrayMove,
	SortableContext,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useState } from 'react'
import { FaChartSimple } from 'react-icons/fa6'
import { FiList } from 'react-icons/fi'
import { IoMdHelp } from 'react-icons/io'
import { Button } from '@/components/button/button'
import Tooltip from '@/components/toolTip'
import { useDate } from '@/context/date.context'
import { useGeneralSetting } from '@/context/general-setting.context'
import { type AddTodoInput, TodoViewType, useTodoStore } from '@/context/todo.context'
import { formatDateStr } from '../calendar/utils'
import { WidgetContainer } from '../widget-container'
import { ExpandableTodoInput } from './expandable-todo-input'
import { TodoHelpModal } from './help-modal'
import { SortableTodoItem } from './sortable-todo-item'
import { TodoStats } from './todo-stats'
import { useAuth } from '@/context/auth.context'
import { AuthRequiredModal } from '@/components/auth/AuthRequiredModal'

export function TodosLayout() {
	const { selectedDate, isToday } = useDate()
	const { isAuthenticated } = useAuth()
	const { addTodo, todos, updateOptions, todoOptions, reorderTodos } = useTodoStore()
	const { blurMode } = useGeneralSetting()
	const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
	const [showHelpModal, setShowHelpModal] = useState<boolean>(false)
	const [showStats, setShowStats] = useState<boolean>(false)
	const [todoText, setTodoText] = useState('')
	const selectedDateStr = formatDateStr(selectedDate.clone())
	const [showAuthModal, setShowAuthModal] = useState<boolean>(false)

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 5,
			},
		})
	)

	const handleChangeViewMode = (viewMode: TodoViewType) => {
		updateOptions({ viewMode })
	}

	let selectedDateTodos = todos.filter((todo) => todo.date === selectedDateStr)

	if (todoOptions.viewMode === TodoViewType.Monthly) {
		const currentMonth = selectedDate.format('jMM')
		selectedDateTodos = todos.filter((todo) => {
			return todo.date.startsWith(`${selectedDate.year()}-${currentMonth}`)
		})
	} else if (todoOptions.viewMode === TodoViewType.All) {
		selectedDateTodos = todos
	}

	selectedDateTodos = selectedDateTodos.sort((a, b) => (a.order || 0) - (b.order || 0))

	if (filter === 'active') {
		selectedDateTodos = selectedDateTodos.filter((todo) => !todo.completed)
	} else if (filter === 'completed') {
		selectedDateTodos = selectedDateTodos.filter((todo) => todo.completed)
	}

	const handleAddTodo = (todoInput: Omit<AddTodoInput, 'date'>) => {
		if (!isAuthenticated) {
			setShowAuthModal(true)
			return
		}

		addTodo({
			...todoInput,
			date: selectedDateStr,
		})
		setTodoText('')
	}

	const handleDragEnd = (event: DragEndEvent) => {
		if (!isAuthenticated) {
			setShowAuthModal(true)
			return
		}

		const { active, over } = event

		if (!over || active.id === over.id) {
			return
		}

		const activeIndex = selectedDateTodos.findIndex((todo) => todo.id === active.id)
		const overIndex = selectedDateTodos.findIndex((todo) => todo.id === over.id)

		if (activeIndex !== -1 && overIndex !== -1) {
			const reorderedTodos = arrayMove(selectedDateTodos, activeIndex, overIndex)

			reorderTodos(reorderedTodos)
		}
	}

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
									: todoOptions.viewMode === TodoViewType.All
										? ''
										: isToday(selectedDate)
											? ' امروز'
											: ` ${selectedDate.format('jD jMMMM')}`}
							</span>
						</h4>

						<div className="flex gap-1.5">
							<Tooltip content={'آموزش'}>
								<Button
									onClick={() => setShowHelpModal(true)}
									size="xs"
									className={`h-7 w-7 text-xs font-medium rounded-[0.55rem] transition-colors border-none shadow-none text-muted hover:bg-base-300`}
								>
									<IoMdHelp size={12} />
								</Button>
							</Tooltip>
							<Tooltip content={showStats ? 'بازگشت به لیست' : 'آمار'}>
								<Button
									onClick={() => setShowStats(!showStats)}
									size="xs"
									className={`h-7 w-7 text-xs font-medium rounded-[0.55rem] transition-colors border-none shadow-none ${showStats ? 'bg-primary text-white' : 'text-muted hover:bg-base-300'}`}
								>
									<FaChartSimple size={12} />
								</Button>
							</Tooltip>
						</div>
					</div>

					{showStats ? (
						<TodoStats />
					) : (
						<div className="flex justify-between mb-2">
							<div className="flex gap-0.5">
								<button
									onClick={() => setFilter('all')}
									className={`px-1.5 py-0.5 rounded-full border-none text-[10px] leading-none cursor-pointer active:scale-95 ${filter === 'all' ? 'bg-primary text-white' : 'text-muted bg-base-300'}`}
								>
									همه
								</button>
								<button
									onClick={() => setFilter('active')}
									className={`px-1.5 py-0.5 rounded-full border-none text-[10px] leading-none cursor-pointer active:scale-95 ${filter === 'active' ? 'bg-primary text-white' : 'text-muted bg-base-300'}`}
								>
									فعال
								</button>
								<button
									onClick={() => setFilter('completed')}
									className={`px-1.5 py-0.5 rounded-full border-none text-[10px] leading-none cursor-pointer active:scale-95 ${filter === 'completed' ? 'bg-primary text-white' : 'text-muted bg-base-300'}`}
								>
									تکمیل شده
								</button>
							</div>
							<div className="relative">
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
									<option
										value={TodoViewType.All}
										className="text-content"
									>
										همه وظایف
									</option>
								</select>
							</div>
						</div>
					)}
				</div>
				<div className="mt-0.5 flex-grow overflow-hidden">
					{!showStats && (
						<DndContext
							sensors={sensors}
							collisionDetection={closestCenter}
							onDragEnd={handleDragEnd}
						>
							<div
								className={`space-y-1.5 overflow-y-auto h-full ${blurMode ? 'blur-mode' : 'disabled-blur-mode'}`}
							>
								{selectedDateTodos.length > 0 ? (
									<SortableContext
										items={selectedDateTodos.map((todo) => todo.id)}
										strategy={verticalListSortingStrategy}
									>
										{selectedDateTodos.map((todo) => (
											<SortableTodoItem
												key={todo.id}
												todo={todo}
												blurMode={blurMode}
											/>
										))}
									</SortableContext>
								) : (
									<div
										className={
											'flex-1 flex flex-col items-center justify-center gap-y-1.5 px-5 py-8'
										}
									>
										<div
											className={
												'flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-base-300/70 border-base/70'
											}
										>
											<FiList className="text-content" size={24} />
										</div>
										<p className="mt-1 text-center text-content">
											وظیفه‌ای برای این روز وجود ندارد.
										</p>
										<p className="text-center text-[.65rem] text-content opacity-75">
											یک وظیفه جدید اضافه کنید.
										</p>
									</div>
								)}
							</div>
						</DndContext>
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

			<AuthRequiredModal
				isOpen={showAuthModal}
				onClose={() => setShowAuthModal(false)}
				message="برای استفاده از وظایف، لطفاً وارد حساب کاربری خود شوید."
			/>
			<TodoHelpModal show={showHelpModal} onClose={() => setShowHelpModal(false)} />
		</WidgetContainer>
	)
}
