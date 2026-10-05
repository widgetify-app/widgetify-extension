import type React from 'react'
import type { ReactNode } from 'react'
import type { Todo } from '@/services/todo/todo.interface'
import { TodosEmpty, TodosSignedOut } from '../components/todo-empty'
import { TodoItem } from '../components/todo-item'
import { TodoSkeleton } from '../components/todo-skeleton'
import { WidgetError } from '@/features/widgets/components/widget-error'

export interface TodoListProps {
	header: ReactNode
	todos: Todo[]
	isLoading: boolean
	isError: boolean
	isAuthenticated: boolean
	isFetchingNextPage: boolean
	hasNextPage: boolean
	loadMoreRef: React.RefObject<HTMLDivElement | null>
	blurMode: boolean
	editingTodo: Todo | null
	onRefresh: () => void
	onEdit: (todo: Todo) => void
	onUpdated: () => void
	onCloseEditor: () => void
	onAdd?: () => void
}

export const Todo2x3: React.FC<TodoListProps> = (props) => {
	return (
		<>
			{props.header}
			<TodoListBody {...props} />
		</>
	)
}

export function TodoListBody({
	todos,
	isLoading,
	isError,
	isAuthenticated,
	isFetchingNextPage,
	hasNextPage,
	loadMoreRef,
	blurMode,
	onRefresh,
	onEdit,
	onUpdated,
	onAdd,
}: TodoListProps) {
	if (!isAuthenticated) return <TodosSignedOut />

	return (
		<div
			aria-busy={isLoading}
			className="flex-1 min-h-0 overflow-y-auto scrollbar-none"
		>
			{isLoading ? (
				<div className="flex flex-col gap-0.5">
					{[...Array(5)].map((_, i) => (
						<TodoSkeleton key={`todo-skeleton-${i}`} />
					))}
				</div>
			) : isError ? (
				<WidgetError message="نتونستیم تسک‌ها رو بیاریم" onRetry={onRefresh} />
			) : todos.length === 0 ? (
				<TodosEmpty onAdd={onAdd} />
			) : (
				<>
					<ul className="flex flex-col gap-0.5">
						{todos.map((todo) => (
							<li key={todo.id}>
								<TodoItem
									blurMode={blurMode}
									todo={todo}
									onUpdated={onUpdated}
									onEdit={onEdit}
								/>
							</li>
						))}
					</ul>

					{hasNextPage && (
						<div ref={loadMoreRef}>
							{isFetchingNextPage && (
								<div className="flex flex-col gap-0.5">
									{[...Array(3)].map((_, i) => (
										<TodoSkeleton key={`todo-next-skeleton-${i}`} />
									))}
								</div>
							)}
						</div>
					)}
				</>
			)}
		</div>
	)
}
