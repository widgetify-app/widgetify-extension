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
import { Button } from '@/components/button/button'
import Tooltip from '@/components/toolTip'
import { useDate } from '@/context/date.context'
import { useGeneralSetting } from '@/context/general-setting.context'
import { type AddTodoInput, TodoViewType, useTodoStore } from '@/context/todo.context'
import { formatDateStr } from '../calendar/utils'
import { WidgetContainer } from '../widget-container'
import { ExpandableTodoInput } from './expandable-todo-input'
import { SortableTodoItem } from './sortable-todo-item'
import { TodoStats } from './todo-stats'
import { useAuth } from '@/context/auth.context'
import { SelectBox } from '@/components/selectbox/selectbox'
import Analytics from '@/analytics'
import { AuthRequiredModal } from '@/components/auth/AuthRequiredModal'
import { IconLoading } from '@/components/loading/icon-loading'
import { parseTodoDate } from './tools/parse-date'

const viewModeOptions = [
	{ value: TodoViewType.Day, label: 'لیست امروز' },
	{ value: TodoViewType.Monthly, label: 'لیست ماهانه' },
	{ value: TodoViewType.All, label: 'همه وظایف' },
]

interface Prop {
	onChangeTab?: any
}

export function TodosLayout({ onChangeTab }: Prop) {
	const { selectedDate } = useDate()
	const { isAuthenticated } = useAuth()
	const { addTodo, todos, updateOptions, todoOptions, reorderTodos, isPending } =
		useTodoStore()
	const { blurMode } = useGeneralSetting()
	const [filter, setFilter] = useState<'active' | 'completed' | 'all'>('all')
	const [showStats, setShowStats] = useState<boolean>(false)
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

	const updateTodoFilter = (newFilter: 'active' | 'completed' | 'all') => {
		setFilter(newFilter)
		Analytics.event(`todo_filter_${newFilter}_click`)
	}

	let selectedDateTodos = todos
	if (todoOptions.viewMode === TodoViewType.Monthly) {
		const currentMonth = selectedDate.format('jMM')
		const currentYear = selectedDate.format('jYYYY')
		selectedDateTodos = todos.filter((todo) => {
			const todoDate = parseTodoDate(todo.date)
			return todoDate.format('jYYYY-jMM') === `${currentYear}-${currentMonth}`
		})
	} else if (todoOptions.viewMode === TodoViewType.Day) {
		selectedDateTodos = todos.filter((todo) => {
			const todoDate = parseTodoDate(todo.date)
			return todoDate.format('jYYYY-jMM-jDD') === selectedDateStr
		})
	}

	selectedDateTodos = selectedDateTodos.sort((a, b) => {
		if (a.completed !== b.completed) {
			return a.completed ? 1 : -1
		}
		return (a.order || 0) - (b.order || 0)
	})

	if (filter === 'active') {
		selectedDateTodos = selectedDateTodos.filter((todo) => !todo.completed)
	} else if (filter === 'completed') {
		selectedDateTodos = selectedDateTodos.filter((todo) => todo.completed)
	}

	const handleAddTodo = (todoInput: Omit<AddTodoInput, 'date'> & { date: string }) => {
		if (!isAuthenticated) {
			setShowAuthModal(true)
			return
		}

		addTodo({
			...todoInput,
			date: todoInput.date,
		})
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
						<div className="flex items-center justify-around p-1 text-xs font-medium bg-base-300 w-28 rounded-2xl text-content">
							<div className="bg-primary rounded-xl py-0.5 px-1 text-gray-200">
								<span>وظایف</span>
							</div>
							<div
								className="cursor-pointer hover:bg-primary/10 rounded-xl py-0.5 px-1"
								onClick={() => onChangeTab()}
							>
								یادداشت
							</div>
						</div>

						<div className="flex gap-1.5 items-center">
							{isPending ? <IconLoading /> : null}
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
									onClick={() => updateTodoFilter('all')}
									className={`px-1 rounded-xl border-none text-[10px] leading-none cursor-pointer active:scale-95 ${filter === 'all' ? 'bg-primary text-white' : 'text-muted bg-base-300'}`}
								>
									همه
								</button>
								<button
									onClick={() => updateTodoFilter('active')}
									className={`px-1 rounded-xl border-none text-[10px] leading-none cursor-pointer active:scale-95 ${filter === 'active' ? 'bg-primary text-white' : 'text-muted bg-base-300'}`}
								>
									فعال
								</button>
								<button
									onClick={() => updateTodoFilter('completed')}
									className={`px-1 rounded-xl border-none text-[10px] leading-none cursor-pointer active:scale-95 ${filter === 'completed' ? 'bg-primary text-white' : 'text-muted bg-base-300'}`}
								>
									تکمیل‌ها
								</button>
							</div>
							<div className="relative">
								<SelectBox
									options={viewModeOptions}
									value={todoOptions.viewMode}
									onChange={(value) =>
										handleChangeViewMode(value as TodoViewType)
									}
									className="!text-[10px] !w-[4.5rem] !px-2.5 rounded-xl !outline-none !border-none !shadow-none text-muted bg-base-300 cursor-pointer"
									optionClassName="text-content"
								/>
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
								className={`space-y-1.5 overflow-y-auto scrollbar-none h-full ${blurMode ? 'blur-mode' : 'disabled-blur-mode'}`}
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
				</div>
				{!showStats && <ExpandableTodoInput onAddTodo={handleAddTodo} />}
			</div>

			<AuthRequiredModal
				isOpen={showAuthModal}
				onClose={() => setShowAuthModal(false)}
				message="برای استفاده از وظایف، لطفاً وارد حساب کاربری خود شوید."
			/>
		</WidgetContainer>
	)
}
