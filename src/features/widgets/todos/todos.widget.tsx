import { t } from '@/common/i18n'
import { type ReactNode, useEffect, useRef, useState } from 'react'
import Analytics from '@/analytics'
import { PopoverMenuItem } from '@/components/ui'
import { useAuth } from '@/context/auth.context'
import { useGeneralSetting } from '@/context/general-setting.context'
import {
	WidgetHeader,
	WidgetHeaderButton,
} from '@/features/widgets/components/widget-header'
import { useWidgetMenuActions } from '@/features/widgets/widget-menu.context'
import { Icon } from '@/icons'
import { useGetTags } from '@/services/todo/get-tags.hook'
import { useGetTodos } from '@/services/todo/get-todos.hook'
import type { Todo } from '@/services/todo/todo.interface'
import type { WidgetSize } from '../utils/layout-engine/types'
import { TodoFilterChips, TodoFilterMenu } from './components/todo-filter-menu'
import { TodoFormModal } from './components/todo-form-modal'
import { UNFILTERED_TAGS } from './constants'
import { useTodoFilters } from './hooks/use-todo-filters'
import { sortTodos } from './utils/sort-todos'
import { todoSummary } from './utils/todo-summary'
import { TodoCompactRow } from './variants/todo-2x1'
import { Todo2x3 } from './variants/todo-2x3'
import { TodoBoard } from './variants/todo-4x3'
import { callEvent } from '@/common/utils/call-event'

const BOARD_PAGE_SIZE = 10
const LIST_PAGE_SIZE = 5

interface TodosLayoutProps {
	size?: WidgetSize
	tabs?: ReactNode
}

export function TodosLayout({ size = { w: 2, h: 3 }, tabs }: TodosLayoutProps = {}) {
	const { isAuthenticated } = useAuth()
	const { blurMode } = useGeneralSetting()
	const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
	const [formTodo, setFormTodo] = useState<Todo | null>(null)
	const [isFormOpen, setIsFormOpen] = useState(false)
	const {
		dateFilter,
		sort,
		tagFilter,
		isReady,
		onDateFilterChange,
		onSortChange,
		onTagFilterChange,
	} = useTodoFilters()

	const observerRef = useRef<IntersectionObserver | null>(null)
	const loadMoreRef = useRef<HTMLDivElement | null>(null)

	const isCompact = size.w === 2 && size.h === 1
	const isBoard = size.w === 4 && size.h === 3
	const isPanel = size.w === 2 && size.h === 6

	const {
		data,
		isLoading,
		isError,
		isFetchingNextPage,
		hasNextPage,
		fetchNextPage,
		refetch,
	} = useGetTodos(isAuthenticated && isReady, {
		limit: isBoard || isPanel ? BOARD_PAGE_SIZE : LIST_PAGE_SIZE,
		dateFilter:
			dateFilter === 'today' || dateFilter === 'this_month'
				? dateFilter
				: undefined,
		isCompleted:
			dateFilter === 'done' ? true : dateFilter === 'pending' ? false : undefined,
		category: tagFilter && tagFilter !== '-all-' ? tagFilter : undefined,
	})
	const { data: fetchedTags } = useGetTags(isAuthenticated)

	useEffect(() => {
		if (!fetchedTags || UNFILTERED_TAGS.includes(tagFilter)) return
		if (!fetchedTags.includes(tagFilter)) onTagFilterChange('-all-')
	}, [fetchedTags, tagFilter, onTagFilterChange])

	const allTodos = data?.pages.flatMap((page) => page.todos) || []
	const sortedTodos = sortTodos(allTodos, sort)

	useEffect(() => {
		observerRef.current?.disconnect()

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

		return () => observerRef.current?.disconnect()
	}, [hasNextPage, isFetchingNextPage, fetchNextPage])

	const handleCloseTodoEditor = () => {
		setEditingTodo(null)
		Analytics.event('todo_edit_close')
	}

	const openEditTodo = (todo: Todo) => {
		if (isCompact) {
			setFormTodo(todo)
			setIsFormOpen(true)
		} else {
			setEditingTodo(todo)
		}
		Analytics.event('todo_edit_open')
	}

	const openCreateTodo = () => {
		setFormTodo(null)
		setIsFormOpen(true)
	}

	const closeTodoForm = () => {
		setIsFormOpen(false)
		if (formTodo) Analytics.event('todo_edit_close')
	}

	const onTodoChanged = () => {
		refetch()
		closeTodoForm()
	}

	const onRefresh = () => {
		if (!isAuthenticated) {
			callEvent('openProfile')
			return
		}
		refetch()
		Analytics.event('todo_refetch')
	}

	useWidgetMenuActions(
		<PopoverMenuItem
			icon={<Icon name="refresh" size={14} />}
			label={t('widgets.todos.widget.refresh')}
			onClick={onRefresh}
		/>
	)

	const tagFilterOptions = fetchedTags?.filter(Boolean).map((tag) => ({
		label: tag,
		value: tag,
	}))
	const tagOptions = tagFilterOptions?.length
		? [{ label: t('widgets.todos.filter.all'), value: '-all-' }, ...tagFilterOptions]
		: []

	const isWaiting = isLoading || (isAuthenticated && !isReady)
	const total = data?.pages[0]?.totals ?? allTodos.length
	const completedCount = allTodos.filter((todo) => todo.completed).length
	const hasTagFilter = !UNFILTERED_TAGS.includes(tagFilter)
	const info =
		isAuthenticated && !isWaiting && !isError
			? todoSummary({
					total,
					completed: completedCount,
					isPartial:
						Boolean(tabs) ||
						!!hasNextPage ||
						dateFilter !== 'all' ||
						hasTagFilter,
				})
			: undefined

	const header = (
		<WidgetHeader
			title={tabs ?? t('widgets.todos.widget.title')}
			badge={
				isBoard && (
					<TodoFilterChips
						dateFilter={dateFilter}
						sort={sort}
						tagFilter={tagFilter}
						onDateFilterChange={onDateFilterChange}
						onSortChange={onSortChange}
						onTagFilterChange={onTagFilterChange}
					/>
				)
			}
			info={info}
			actions={
				isAuthenticated && (
					<>
						{isCompact && (
							<WidgetHeaderButton
								label={t('widgets.todos.input.newTask')}
								icon="plus"
								onClick={openCreateTodo}
							/>
						)}
						<TodoFilterMenu
							dateFilter={dateFilter}
							sort={sort}
							tagFilter={tagFilter}
							tagOptions={tagOptions}
							onDateFilterChange={onDateFilterChange}
							onSortChange={onSortChange}
							onTagFilterChange={onTagFilterChange}
						/>
					</>
				)
			}
		/>
	)

	if (isCompact) {
		return (
			<>
				<TodoCompactRow
					header={header}
					todos={sortedTodos}
					total={total}
					isLoading={isWaiting}
					isError={isError}
					isAuthenticated={isAuthenticated}
					hasNextPage={!!hasNextPage}
					isFetchingNextPage={isFetchingNextPage}
					onLoadMore={fetchNextPage}
					onRefresh={onRefresh}
					onUpdated={refetch}
					onAdd={openCreateTodo}
					onOpen={openEditTodo}
				/>
				<TodoFormModal
					isOpen={isFormOpen}
					todo={formTodo}
					onClose={closeTodoForm}
					onChanged={onTodoChanged}
				/>
			</>
		)
	}

	const listProps = {
		header,
		todos: sortedTodos,
		isLoading: isWaiting,
		isError,
		isAuthenticated,
		isFetchingNextPage,
		hasNextPage: !!hasNextPage,
		loadMoreRef,
		blurMode,
		editingTodo,
		onRefresh,
		onEdit: openEditTodo,
		onUpdated: refetch,
		onCloseEditor: handleCloseTodoEditor,
	}

	if (isBoard) {
		return <TodoBoard {...listProps} />
	}

	if (isPanel) {
		return <TodoBoard {...listProps} layout="panel" />
	}

	return <Todo2x3 {...listProps} />
}
