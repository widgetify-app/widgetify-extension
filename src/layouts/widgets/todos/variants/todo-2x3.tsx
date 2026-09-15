import type React from 'react'
import { cn } from '@/common/utils/cn'
import { RequireAuth } from '@/components/auth/require-auth'
import {
	Button,
	type FilterOption,
	FilterTooltip,
	IconLoading,
	Tooltip,
} from '@/components/ui'
import { Icon } from '@/icons'
import type { Todo } from '@/services/hooks/todo/todo.interface'
import { ExpandableTodoInput } from '../components/expandable-todo-input'
import { TodosEmpty } from '../components/todo-empty'
import { TodosError } from '../components/todo-error'
import { TodoItem } from '../components/todo-item'
import { TodoSkeleton } from '../components/todo-skeleton'
import { DATE_FILTER_OPTIONS, SORT_OPTIONS, UNFILTERED_TAGS } from '../constants'

interface Todo2x3Props {
	todos: Todo[]
	isLoading: boolean
	isError: boolean
	isFetchingNextPage: boolean
	hasNextPage: boolean
	loadMoreRef: React.RefObject<HTMLDivElement | null>
	blurMode: boolean
	tagFilterOptions: FilterOption[]
	dateFilter: string
	sort: string
	tagFilter: string
	editingTodo: Todo | null
	onDateFilterChange: (value: string) => void
	onSortChange: (value: string) => void
	onTagFilterChange: (value: string) => void
	onRefresh: () => void
	onEdit: (todo: Todo) => void
	onUpdated: () => void
	onCloseEditor: () => void
}

export const Todo2x3: React.FC<Todo2x3Props> = ({
	todos,
	isLoading,
	isError,
	isFetchingNextPage,
	hasNextPage,
	loadMoreRef,
	blurMode,
	tagFilterOptions,
	dateFilter,
	sort,
	tagFilter,
	editingTodo,
	onDateFilterChange,
	onSortChange,
	onTagFilterChange,
	onRefresh,
	onEdit,
	onUpdated,
	onCloseEditor,
}) => {
	return (
		<>
			<header className="flex justify-between flex-none my-1">
				<nav
					className="flex flex-row items-center gap-1"
					aria-label="فیلتر تسک‌ها"
				>
					<FilterTooltip
						options={DATE_FILTER_OPTIONS}
						value={dateFilter}
						icon={
							<Icon
								name={
									dateFilter !== 'all'
										? 'outlineFilterList'
										: 'outlineFilterListOff'
								}
								size={10}
								className={
									dateFilter !== 'all' ? 'text-primary' : 'text-muted'
								}
								aria-hidden="true"
							/>
						}
						onChange={onDateFilterChange}
						placeholder="فیلتر"
						buttonClassName="truncate gap-1.5"
					/>
					<FilterTooltip
						icon={
							<Icon
								name="tags"
								size={10}
								className={
									UNFILTERED_TAGS.includes(tagFilter)
										? 'text-muted'
										: 'text-primary!'
								}
								aria-hidden="true"
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
								className={sort !== 'def' ? 'text-primary!' : 'text-muted'}
								aria-hidden="true"
							/>
						}
						options={SORT_OPTIONS}
						value={sort}
						onChange={onSortChange}
						placeholder="ترتیب"
						buttonClassName="truncate gap-2"
					/>
				</nav>

				<div className="flex items-center gap-1">
					{isLoading && <IconLoading />}
					<Tooltip content="بارگزاری مجدد">
						<Button
							size="sm"
							aria-label="بارگزاری مجدد"
							className="px-2 py-0! border-none! group rounded-xl shrink-0 active:scale-95 h-7!"
							onClick={onRefresh}
						>
							<Icon
								name="refresh"
								aria-hidden="true"
								className={cn(
									'text-content opacity-50 group-hover:opacity-100',
									isLoading && 'animate-spin'
								)}
							/>
						</Button>
					</Tooltip>
				</div>
			</header>

			<div className="mt-0.5 grow overflow-hidden">
				<div
					aria-busy={isLoading}
					className="h-full overflow-y-auto space-y-1.5 scrollbar-none"
				>
						{isLoading ? (
							<div className="flex flex-col gap-1">
								{[...Array(5)].map((_, i) => (
									<TodoSkeleton key={`todo-skeleton-${i}`} />
								))}
							</div>
						) : isError ? (
							<TodosError onRetry={onRefresh} />
						) : todos.length === 0 ? (
							<TodosEmpty />
						) : (
							<>
								<ul
									className={cn(
										'flex flex-col gap-0',
										blurMode ? 'blur-mode' : 'disabled-blur-mode'
									)}
								>
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
											<div className="flex flex-col gap-1">
												{[...Array(3)].map((_, i) => (
													<TodoSkeleton
														key={`todo-next-skeleton-${i}`}
													/>
												))}
											</div>
										)}
									</div>
								)}
							</>
						)}
				</div>
			</div>

			<ExpandableTodoInput
				editTodo={editingTodo}
				onClose={onCloseEditor}
				isEdit={!!editingTodo}
				onUpdated={onUpdated}
			/>
		</>
	)
}
