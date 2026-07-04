import { useState } from 'react'
import { ExpandableTodoInput } from './expandable-todo-input'
import { useAuth } from '@/context/auth.context'
import Analytics from '@/analytics'
import { IconLoading } from '@/components/loading/icon-loading'
import { FilterTooltip } from '@/components/filter-tooltip'
import { useGetTags } from '@/services/hooks/todo/get-tags.hook'
import type { Todo } from '@/services/hooks/todo/todo.interface'
import { getFromStorage, setToStorage } from '@/common/storage'
import { useGeneralSetting } from '@/context/general-setting.context'
import { Button } from '@/components/button/button'
import Tooltip from '@/components/toolTip'
import { useGetTodos } from '@/services/hooks/todo/get-todos.hook'
import { TodoItem } from './todo.item'
import { Icon } from '@/src/icons'

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

export function TodosLayout() {
	const { isAuthenticated } = useAuth()
	const { blurMode } = useGeneralSetting()
	const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
	const [dateFilter, setDateFilter] = useState<string>('all')
	const [sort, setSort] = useState<string>('def')
	const [tagFilter, setTagFilter] = useState<string>('')

	const observerRef = useRef<IntersectionObserver | null>(null)
	const loadMoreRef = useRef<HTMLDivElement | null>(null)

	const getServerFilters = () => {
		const filters: any = {
			limit: 5,
		}

		if (dateFilter === 'today') {
			filters.dateFilter = 'today'
		} else if (dateFilter === 'this_month') {
			filters.dateFilter = 'this_month'
		} else if (dateFilter === 'done') {
			filters.isCompleted = true
		} else if (dateFilter === 'pending') {
			filters.isCompleted = false
		}

		if (tagFilter && tagFilter !== '-all-') {
			filters.category = tagFilter
		}

		return filters
	}

	const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, refetch } =
		useGetTodos(isAuthenticated, getServerFilters())
	const { data: fetchedTags } = useGetTags(isAuthenticated)

	const allTodos = data?.pages.flatMap((page) => page.todos) || []

	const sortedTodos = [...allTodos].sort((a, b) => {
		switch (sort) {
			case 'def':
				return a.order - b.order
			case 'pending-first':
				if (a.completed === b.completed) return a.order - b.order
				return a.completed ? 1 : -1
			case 'done-first':
				if (a.completed === b.completed) return a.order - b.order
				return a.completed ? -1 : 1
			case 'high':
				return b.priority === 'high' ? 1 : a.priority === 'high' ? -1 : 0
			case 'medium':
				return b.priority === 'medium' ? 1 : a.priority === 'medium' ? -1 : 0
			case 'low':
				return b.priority === 'low' ? 1 : a.priority === 'low' ? -1 : 0
			default:
				return a.order - b.order
		}
	})

	useEffect(() => {
		if (observerRef.current) {
			observerRef.current.disconnect()
		}

		observerRef.current = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
					fetchNextPage()
				}
			},
			{ threshold: 0.1 }
		)

		if (loadMoreRef.current) {
			observerRef.current.observe(loadMoreRef.current)
		}

		return () => {
			if (observerRef.current) {
				observerRef.current.disconnect()
			}
		}
	}, [hasNextPage, isFetchingNextPage, fetchNextPage])

	const handleCloseTodoEditor = () => {
		setEditingTodo(null)
		Analytics.event('todo_edit_close')
	}

	const onDateFilterChange = (value: string) => {
		setDateFilter(value)
		Analytics.event(`todo_select_date_${value}_filter`)
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

	const openEditTodo = (todo: Todo) => {
		setEditingTodo(todo)
		Analytics.event('todo_edit_open')
	}

	const onRefresh = () => {
		refetch()
		Analytics.event(`todo_refetch`)
	}

	return (
		<>
			<div className="flex-none">
				<div className="flex justify-between my-1">
					<div className="flex gap-0.5">
						<div className="flex flex-row items-center gap-1">
							<FilterTooltip
								options={filterOptions}
								value={dateFilter}
								icon={
									dateFilter !== 'all' ? (
										<Icon
											name="outlineFilterList"
											size={10}
											className="text-primary"
										/>
									) : (
										<Icon
											name="outlineFilterListOff"
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
									<Icon
										name="tags"
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
									<Icon
										name="sortDown"
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
					<div className="flex items-center gap-1">
						{isLoading ? <IconLoading /> : null}
						<Tooltip content="بارگزاری مجدد">
							<Button
								size="sm"
								className={`px-2 py-0! border-none! rounded-xl text-base-content/40 shrink-0 active:scale-95 h-7!`}
								onClick={onRefresh}
							>
								<Icon
									name="refresh"
									className={`text-content opacity-50 hover:opacity-100 ${isLoading ? 'animate-spin' : ''}`}
								/>
							</Button>
						</Tooltip>
					</div>
				</div>
			</div>
			<div className="mt-0.5 grow overflow-hidden">
				<div
					className={`space-y-1.5 overflow-y-auto scrollbar-none h-full ${blurMode ? 'blur-mode' : 'disabled-blur-mode'}`}
				>
					{isLoading ? (
						<div className="flex flex-col gap-1">
							{[...Array(5)].map((_, i) => (
								<TodoSkeleton key={i} />
							))}
						</div>
					) : sortedTodos.length === 0 ? (
						<TodosEmpty />
					) : (
						<div className="flex flex-col gap-0">
							{sortedTodos.map((todo) => (
								<TodoItem
									blurMode={blurMode}
									key={todo.id}
									todo={todo}
									onUpdated={() => refetch()}
									onEdit={(t: any) => openEditTodo(t)}
								/>
							))}

							{hasNextPage && (
								<div ref={loadMoreRef} className="">
									{isFetchingNextPage && (
										<div className="flex flex-col gap-1">
											{[...Array(3)].map((_, i) => (
												<TodoSkeleton key={i} />
											))}
										</div>
									)}
								</div>
							)}
						</div>
					)}
				</div>
			</div>
			{
				<ExpandableTodoInput
					editTodo={editingTodo as any}
					onClose={() => handleCloseTodoEditor()}
					isEdit={!!editingTodo}
					onUpdated={refetch}
				/>
			}
		</>
	)
}

function TodosEmpty() {
	return (
		<div
			className={
				'flex-1 flex flex-col items-center justify-center gap-y-1.5 px-5 py-8'
			}
		>
			<div className="flex items-center justify-center w-12 h-12">
				<img
					src="https://cdn.widgetify.ir/system/no-items.png"
					alt="بدون عادت"
					className="object-contain w-48 h-auto select-none"
				/>
			</div>
			<p className="mt-1 font-bold text-center text-content">
				هیچ تسکی برای نمایش وجود ندارد
			</p>
			<p className="text-center text-[.65rem] text-content opacity-75">
				یک تسک جدید اضافه کنید یا فیلترها را تغییر دهید
			</p>
		</div>
	)
}

export function TodoSkeleton() {
	return (
		<div className="flex flex-row justify-between gap-1 p-1 overflow-hidden border rounded-lg shadow-sm border-content bg-glass bg-base-300/30">
			<div className="flex items-center gap-1">
				<div className="w-5 h-5 rounded-md skeleton shrink-0"></div>
				<div className="w-32 h-5 skeleton"></div>
			</div>
			<div className="w-5 h-5 rounded-md skeleton shrink-0"></div>
		</div>
	)
}
