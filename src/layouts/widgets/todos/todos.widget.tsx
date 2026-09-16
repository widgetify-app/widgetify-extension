import { useEffect, useRef, useState } from 'react'
import Analytics from '@/analytics'
import { useAuth } from '@/context/auth.context'
import { useGeneralSetting } from '@/context/general-setting.context'
import { useGetTags } from '@/services/hooks/todo/get-tags.hook'
import { useGetTodos } from '@/services/hooks/todo/get-todos.hook'
import type { Todo } from '@/services/hooks/todo/todo.interface'
import type { WidgetSize } from '../layout-engine/types'
import { useTodoFilters } from './hooks/use-todo-filters'
import { sortTodos } from './utils/sort-todos'
import { TodoCompactRow } from './variants/todo-2x1'
import { Todo2x3 } from './variants/todo-2x3'
import { TodoBoard } from './variants/todo-4x3'
import { callEvent } from '@/common/utils/call-event'

const BOARD_PAGE_SIZE = 10
const LIST_PAGE_SIZE = 5

interface TodosLayoutProps {
	size?: WidgetSize
}

export function TodosLayout({ size = { w: 2, h: 3 } }: TodosLayoutProps = {}) {
	const { isAuthenticated } = useAuth()
	const { blurMode } = useGeneralSetting()
	const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
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

	const isBoard = size.w === 4 && size.h === 3

	const {
		data,
		isLoading,
		isError,
		isFetchingNextPage,
		hasNextPage,
		fetchNextPage,
		refetch,
	} = useGetTodos(isAuthenticated && isReady, {
		limit: isBoard ? BOARD_PAGE_SIZE : LIST_PAGE_SIZE,
		dateFilter:
			dateFilter === 'today' || dateFilter === 'this_month'
				? dateFilter
				: undefined,
		isCompleted:
			dateFilter === 'done' ? true : dateFilter === 'pending' ? false : undefined,
		category: tagFilter && tagFilter !== '-all-' ? tagFilter : undefined,
	})
	const { data: fetchedTags } = useGetTags(isAuthenticated)

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
		setEditingTodo(todo)
		Analytics.event('todo_edit_open')
	}

	const onRefresh = () => {
		if (!isAuthenticated) {
			callEvent('openProfile')
			return
		}
		refetch()
		Analytics.event('todo_refetch')
	}

	const tagFilterOptions = fetchedTags?.filter(Boolean).map((tag) => ({
		label: tag,
		value: tag,
	}))
	const tagOptions = tagFilterOptions?.length
		? [{ label: 'همه', value: '-all-' }, ...tagFilterOptions]
		: []

	const sharedProps = {
		todos: sortedTodos,
		isLoading: isLoading || (isAuthenticated && !isReady),
		isError,
		isAuthenticated,
		onRefresh,
	}

	if (size.w === 2 && size.h === 1) {
		return <TodoCompactRow {...sharedProps} />
	}

	const listProps = {
		...sharedProps,
		isFetchingNextPage,
		hasNextPage: !!hasNextPage,
		loadMoreRef,
		blurMode,
		tagFilterOptions: tagOptions,
		dateFilter,
		sort,
		tagFilter,
		editingTodo,
		onDateFilterChange,
		onSortChange,
		onTagFilterChange,
		onEdit: openEditTodo,
		onUpdated: refetch,
		onCloseEditor: handleCloseTodoEditor,
	}

	if (isBoard) {
		return <TodoBoard {...listProps} />
	}

	return <Todo2x3 {...listProps} />
}
