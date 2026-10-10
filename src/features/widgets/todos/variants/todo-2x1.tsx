import { t } from '@/common/i18n'
import jalaliMoment from 'jalali-moment'
import type { ReactNode } from 'react'
import Analytics from '@/analytics'
import { showToast } from '@/common/toast'
import { callEvent } from '@/common/utils/call-event'
import { cn } from '@/common/utils/cn'
import { playAlarm } from '@/common/utils/play-alarm'
import { translateError } from '@/common/utils/translate-error'
import { useGeneralSetting } from '@/context/general-setting.context'
import { safeAwait } from '@/services/api'
import type { Todo } from '@/services/todo/todo.interface'
import { useUpdateTodo } from '@/services/todo/update-todo.hook'
import { CompactPager } from '@/features/widgets/components/compact-pager'
import { useCompactPagerState } from '@/features/widgets/hooks/use-compact-pager-state'
import { WidgetCompactEmpty } from '@/features/widgets/components/widget-compact-empty'
import { WidgetError } from '@/features/widgets/components/widget-error'
import { TodoCheck } from '../components/todo-check'
import { currentTaskIndex, nextOpenTaskId } from '../utils/current-task-index'
import { parseTodoDate } from '../utils/parse-date'
import { todoDueLabel } from '../utils/todo-due-label'

interface TodoCompactRowProps {
	header: ReactNode
	todos: Todo[]
	total: number
	isLoading: boolean
	isError: boolean
	isAuthenticated: boolean
	hasNextPage: boolean
	isFetchingNextPage: boolean
	onLoadMore: () => void
	onRefresh: () => void
	onUpdated: () => void
	onAdd: () => void
	onOpen: (todo: Todo) => void
}

export function TodoCompactRow(props: TodoCompactRowProps) {
	return (
		<>
			{props.header}
			<div className="flex-1 min-h-0">
				<TodoCompactContent {...props} />
			</div>
		</>
	)
}

function TodoCompactContent({
	todos,
	total,
	isLoading,
	isError,
	isAuthenticated,
	hasNextPage,
	isFetchingNextPage,
	onLoadMore,
	onRefresh,
	onUpdated,
	onAdd,
	onOpen,
}: TodoCompactRowProps) {
	const { blurMode } = useGeneralSetting()
	const {
		currentId,
		select: selectTodo,
		isHydrated,
	} = useCompactPagerState({
		storageKey: 'todos',
		ids: todos.map((todo) => todo.id),
		isReady: isAuthenticated && !isLoading && !isError,
	})

	const index = currentTaskIndex(todos, currentId)
	const current = todos[index] as Todo | undefined

	const { mutateAsync: updateTodo, isPending } = useUpdateTodo(current?.id || null)

	if (!isAuthenticated) {
		return (
			<WidgetCompactEmpty
				icon="user"
				title={t('widgets.todos.variant2x1.authTitle')}
				description={t('widgets.todos.variant2x1.authHint')}
				action={{
					label: t('widgets.todos.variant2x1.authCta'),
					onClick: () => callEvent('openProfile'),
				}}
			/>
		)
	}

	if (isLoading || !isHydrated) {
		return (
			<div aria-hidden="true" className="flex items-center h-full gap-2.5 px-2">
				<div className="rounded-full size-4 skeleton shrink-0" />
				<div className="flex flex-col flex-1 gap-1.5">
					<div className="w-3/4 h-3 rounded-sm skeleton" />
					<div className="w-1/2 h-2 rounded-sm skeleton" />
				</div>
			</div>
		)
	}

	if (isError) {
		return (
			<WidgetError
				message={t('widgets.todos.variant2x1.loadError')}
				compact
				onRetry={onRefresh}
			/>
		)
	}

	if (!current) {
		return (
			<WidgetCompactEmpty
				icon="check"
				title={t('widgets.todos.empty.title')}
				description={t('widgets.todos.variant2x1.emptyHint')}
				action={{
					label: t('widgets.todos.input.newTask'),
					onClick: onAdd,
				}}
			/>
		)
	}

	const isDone = current.completed
	const isTemp = current.id.startsWith('temp-')
	const isLast = index === todos.length - 1

	const handleToggle = async () => {
		if (isPending || isTemp) return
		const completed = !isDone

		const [error] = await safeAwait(
			updateTodo({ id: current.id, input: { completed } })
		)
		if (error) {
			showToast(translateError(error) as string, 'error')
			return
		}

		if (completed) {
			playAlarm('success')
			const nextId = nextOpenTaskId(todos, index)
			if (nextId) selectTodo(nextId)
		}
		Analytics.event('todo_toggle_complete')
		onUpdated()
	}

	const openCurrent = () => {
		if (isTemp) {
			showToast(t('widgets.todos.item.notSavedYet'), 'error')
			return
		}
		onOpen(current)
	}

	const goNext = () => {
		if (!isLast) selectTodo(todos[index + 1].id)
		else if (hasNextPage) onLoadMore()
	}

	const dueLabel = isDone
		? null
		: todoDueLabel(parseTodoDate(current.date), jalaliMoment())
	const subtitle = [
		dueLabel,
		t('widgets.todos.variant2x1.progressOf', {
			p0: index + 1,
			p1: Math.max(total, todos.length),
		}),
	]
		.filter(Boolean)
		.join(' · ')

	return (
		<div className="flex items-center h-full gap-1">
			<div
				className={cn(
					'flex items-center flex-1 min-w-0 gap-2.5 px-2 rounded-xl min-h-8.5 transition-ui hover:bg-fill',
					blurMode ? 'blur-mode' : 'disabled-blur-mode'
				)}
			>
				<TodoCheck
					text={current.text}
					isDone={isDone}
					priority={current.priority}
					disabled={isPending || isTemp}
					onToggle={handleToggle}
				/>
				<button
					type="button"
					onClick={openCurrent}
					className="flex flex-col flex-1 min-w-0 py-1 rounded-lg cursor-pointer text-start leading-control focus-visible:focus-ring"
				>
					<span
						title={current.text}
						className={cn(
							'text-xs font-medium truncate',
							isDone
								? 'text-fg-faint line-through decoration-fg-ghost'
								: 'text-fg'
						)}
					>
						{current.text}
					</span>
					<span className="truncate text-3xs text-fg-faint">{subtitle}</span>
				</button>
			</div>

			<CompactPager
				previousLabel={t('widgets.todos.variant2x1.prev')}
				nextLabel={t('widgets.todos.variant2x1.next')}
				onPrevious={() => selectTodo(todos[index - 1].id)}
				onNext={goNext}
				isPreviousDisabled={index === 0}
				isNextDisabled={(isLast && !hasNextPage) || isFetchingNextPage}
			/>
		</div>
	)
}
