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
import { FiList } from 'react-icons/fi'
import { useDate } from '@/context/date.context'
import { type AddTodoInput, useTodoStore } from '@/context/todo.context'
import { WidgetContainer } from '../widget-container'
import { ExpandableTodoInput } from './expandable-todo-input'
import { SortableTodoItem } from './sortable-todo-item'
import { useAuth } from '@/context/auth.context'
import Analytics from '@/analytics'
import { AuthRequiredModal } from '@/components/auth/AuthRequiredModal'
import { IconLoading } from '@/components/loading/icon-loading'
import { parseTodoDate } from './tools/parse-date'
import { TabNavigation } from '@/components/tab-navigation'
import { HiOutlineCheckCircle, HiOutlineDocumentText } from 'react-icons/hi2'
import { FilterTooltip } from '@/components/filter-tooltip'
import { FaSortAmountDown, FaTags } from 'react-icons/fa'
import { useGetTags } from '@/services/hooks/todo/get-tags.hook'
import type { Todo } from '@/services/hooks/todo/todo.interface'
import { getFromStorage, setToStorage } from '@/common/storage'
import { MdOutlineFilterList, MdOutlineFilterListOff } from 'react-icons/md'
import { BlurModeButton } from '@/components/blur-mode/blur-mode.button'
import { useGeneralSetting } from '@/context/general-setting.context'

const filterOptions = [
	{ value: 'all', label: 'همه' },
	{ value: 'today', label: 'امروز' },
	{ value: 'thisMonth', label: 'این ماه' },
	{ value: 'done', label: 'تکمیل‌شده' },
	{ value: 'pending', label: 'در انتظار' },
]

const sortOptions = [
	{ value: 'def', label: 'پیشفرض' },
	{ value: 'high', label: 'مهم' },
	{ value: 'medium', label: 'متوسط' },
	{ value: 'low', label: 'کم اهمیت' },
]
const TagList = ['', '-all-']
interface Prop {
	onChangeTab?: any
}
export function TodosLayout({ onChangeTab }: Prop) {
	const { today } = useDate()
	const { isAuthenticated } = useAuth()
	const { blurMode } = useGeneralSetting()

	const { addTodo, todos, reorderTodos, isPending } = useTodoStore()
	const [dateFilter, setDateFilter] = useState<string>('all')
	const [sort, setSort] = useState<string>('def')
	const [tagFilter, setTagFilter] = useState<string>('')
	const { data: fetchedTags } = useGetTags(isAuthenticated)

	const [showAuthModal, setShowAuthModal] = useState<boolean>(false)

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 5,
			},
		})
	)

	const isToday = (todoDate: string) => {
		const todoMoment = parseTodoDate(todoDate)

		return (
			todoMoment.isValid() &&
			todoMoment.format('YYYY-MM-DD') === today.doAsGregorian().format('YYYY-MM-DD')
		)
	}

	const isThisMonth = (todoDate: string) => {
		const todoMoment = parseTodoDate(todoDate)

		return (
			todoMoment.isValid() &&
			todoMoment.jYear() === today.doAsGregorian().jYear() &&
			todoMoment.jMonth() === today.doAsGregorian().jMonth()
		)
	}

	let selectedDateTodos = todos

	selectedDateTodos = selectedDateTodos.sort((a, b) => {
		switch (sort) {
			case 'def':
				return (a.order || 0) - (b.order || 0)
			case 'high':
				return b.priority === 'high' ? 1 : a.priority === 'high' ? -1 : 0
			case 'medium':
				return b.priority === 'medium' ? 1 : a.priority === 'medium' ? -1 : 0
			case 'low':
				return b.priority === 'low' ? 1 : a.priority === 'low' ? -1 : 0
			default:
				return (a.order || 0) - (b.order || 0)
		}
	})

	const filterTodos = (todos: Todo[]) => {
		let result: Todo[] = []
		switch (dateFilter) {
			case 'today':
				result = todos.filter((todo) => todo.date && isToday(todo.date))
				break
			case 'thisMonth':
				result = todos.filter((todo) => todo.date && isThisMonth(todo.date))
				break
			case 'done':
				result = todos.filter((t) => t.completed)
				break
			case 'pending':
				result = todos.filter((t) => !t.completed)
				break
			default:
				result = todos
		}

		if (tagFilter && tagFilter !== '-all-') {
			result = result.filter((f) => f.category === tagFilter)
		}

		return result
	}

	selectedDateTodos = filterTodos(selectedDateTodos)

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

	const onDateFilterChange = (value: string) => {
		setDateFilter(value)
		Analytics.event(`todo_filter_${value}_click`)
		setToStorage('todoFilter', value)
	}

	const onSortChange = (value: string) => {
		setSort(value)
		Analytics.event(`todo_select_sort_${value}`)
		setToStorage('todoSort', value)
	}

	const onTagFilterChange = (value: string) => {
		setTagFilter(value)
		Analytics.event(`todo_tag_change`)
	}

	const tagFilterOptions =
		fetchedTags
			?.filter((t) => t)
			?.map((t) => ({
				label: t,
				value: t,
			})) || []
	if (tagFilterOptions.length) {
		tagFilterOptions.unshift({
			label: 'همه',
			value: '-all-',
		})
	}

	useEffect(() => {
		async function load() {
			const [todoFilter, todoSort] = await Promise.all([
				getFromStorage('todoFilter'),
				getFromStorage('todoSort'),
			])
			if (todoFilter) setDateFilter(todoFilter)
			if (todoSort) setSort(todoSort)
		}

		load()
	}, [])

	return (
		<WidgetContainer>
			<div className="flex flex-col h-full">
				<div className="flex-none">
					<TabNavigation
						activeTab="todos"
						onTabClick={onChangeTab}
						tabs={[
							{
								id: 'todos',
								label: 'وظایف',
								icon: <HiOutlineCheckCircle size={14} />,
							},
							{
								id: 'notes',
								label: 'یادداشت',
								icon: <HiOutlineDocumentText size={14} />,
							},
						]}
						size="small"
						className="w-full"
					/>

					<div className="flex justify-between my-1">
						<div className="flex gap-0.5">
							<div className="flex flex-row items-center gap-1">
								<FilterTooltip
									options={filterOptions}
									value={dateFilter}
									icon={
										dateFilter !== 'all' ? (
											<MdOutlineFilterList
												size={10}
												className="text-primary"
											/>
										) : (
											<MdOutlineFilterListOff
												size={10}
												className="text-muted"
											/>
										)
									}
									onChange={onDateFilterChange}
									placeholder="فیلتر"
									buttonClassName={`truncate gap-1.5`}
								/>
								<FilterTooltip
									icon={
										<FaTags
											size={10}
											className={
												TagList.includes(tagFilter)
													? 'text-muted'
													: 'text-primary!'
											}
										/>
									}
									options={tagFilterOptions}
									value={tagFilter || '-all-'}
									onChange={onTagFilterChange}
									placeholder="دسته‌بندی"
								/>
								<FilterTooltip
									icon={
										<FaSortAmountDown
											size={10}
											className={
												sort !== 'def'
													? 'text-primary!'
													: 'text-muted'
											}
										/>
									}
									options={sortOptions}
									value={sort}
									onChange={onSortChange}
									placeholder="ترتیب"
									buttonClassName="truncate gap-2"
								/>
							</div>
						</div>
						<div className="flex items-center gap-1 px-1">
							{isPending ? <IconLoading /> : null}
							<BlurModeButton />
						</div>
					</div>
				</div>
				<div className="mt-0.5 flex-grow overflow-hidden">
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
				</div>
				{<ExpandableTodoInput onAddTodo={handleAddTodo} />}
			</div>

			<AuthRequiredModal
				isOpen={showAuthModal}
				onClose={() => setShowAuthModal(false)}
				message="برای استفاده از وظایف، لطفاً وارد حساب کاربری خود شوید."
			/>
		</WidgetContainer>
	)
}
