import { useRef } from 'react'
import { cn } from '@/common/utils/cn'
import { RequireAuth } from '@/components/auth/require-auth'
import { Button, Chip, type FilterOption, FilterTooltip, Tooltip } from '@/components/ui'
import { useHorizontalWheelScroll } from '@/hooks/use-horizontal-wheel-scroll'
import { Icon } from '@/icons'
import type { Todo } from '@/services/hooks/todo/todo.interface'
import { ExpandableTodoInput } from '../components/expandable-todo-input'
import { TodosEmpty } from '../components/todo-empty'
import { TodosError } from '../components/todo-error'
import { TodoItem } from '../components/todo-item'
import { DATE_FILTER_OPTIONS, SORT_OPTIONS } from '../constants'

interface TodoBoardProps {
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

export function TodoBoard({
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
}: TodoBoardProps) {
	const chipsRef = useRef<HTMLDivElement>(null)
	useHorizontalWheelScroll(chipsRef)

	const total = todos.length
	const completed = todos.filter((t) => t.completed).length
	const pending = total - completed
	const important = todos.filter((t) => !t.completed && t.priority === 'high').length
	const percent = total > 0 ? Math.round((completed / total) * 100) : 0
	const isAllDone = total > 0 && completed === total

	return (
		<div className="flex flex-col h-full gap-2" dir="rtl">
			<header className="flex items-center flex-none gap-2.5">
				<div className="w-20 shrink-0">
					<h3 className="text-sm font-bold leading-tight truncate text-content">
						تسک‌ها
					</h3>
					<p className="text-[10px] leading-tight truncate text-muted">
						{total > 0
							? `${completed} از ${total} انجام شده`
							: 'برنامه‌ی امروزت'}
					</p>
				</div>

				<div
					ref={chipsRef}
					className="flex items-center flex-1 min-w-0 gap-1.5 overflow-x-auto scrollbar-none"
				>
					{DATE_FILTER_OPTIONS.map((option) => (
						<Chip
							key={option.value}
							selected={dateFilter === option.value}
							onClick={() => onDateFilterChange(option.value)}
							className="px-2.5! py-1! text-[11px] shrink-0"
						>
							{option.label}
						</Chip>
					))}
				</div>

				<div className="flex items-center gap-0.5 shrink-0">
					<FilterTooltip
						icon={
							<Icon
								name="tags"
								size={13}
								aria-hidden="true"
								className={
									tagFilter && tagFilter !== '-all-'
										? 'text-primary!'
										: 'text-muted'
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
								size={13}
								aria-hidden="true"
								className={
									sort !== 'def' ? 'text-primary!' : 'text-muted'
								}
							/>
						}
						options={SORT_OPTIONS}
						value={sort}
						onChange={onSortChange}
						placeholder="ترتیب"
					/>
					<Tooltip content="بارگذاری مجدد">
						<Button
							size="sm"
							aria-label="بارگذاری مجدد"
							className="px-2 py-0! border-none! group rounded-xl shrink-0 active:scale-95 h-7!"
							onClick={onRefresh}
						>
							<Icon
								name="refresh"
								size={13}
								aria-hidden="true"
								className={cn(
									'text-content opacity-50 transition-opacity group-hover:opacity-100',
									isLoading && 'animate-spin'
								)}
							/>
						</Button>
					</Tooltip>
				</div>
			</header>

			<div className="flex flex-1 min-h-0 gap-2.5">
				<div
					aria-busy={isLoading}
					className="flex-1 min-w-0 overflow-y-auto scrollbar-none"
				>
					{isLoading ? (
						<div className="flex flex-col gap-1.5">
							{[...Array(4)].map((_, i) => (
								<BoardTodoSkeleton key={`board-skeleton-${i}`} />
							))}
						</div>
					) : isError ? (
						<TodosError onRetry={onRefresh} />
					) : total === 0 ? (
						<div className="flex h-full">
							<TodosEmpty />
						</div>
					) : (
						<div
							className={cn(
								'flex flex-col',
								blurMode ? 'blur-mode' : 'disabled-blur-mode'
							)}
						>
							<ul className="flex flex-col">
								{todos.map((todo) => (
									<li key={todo.id}>
										<TodoItem
											todo={todo}
											blurMode={blurMode}
											comfortable
											onUpdated={onUpdated}
											onEdit={onEdit}
										/>
									</li>
								))}
							</ul>

							{hasNextPage && (
								<div ref={loadMoreRef}>
									{isFetchingNextPage && (
										<div className="flex flex-col gap-1.5">
											{[...Array(2)].map((_, i) => (
												<BoardTodoSkeleton
													key={`board-next-skeleton-${i}`}
												/>
											))}
										</div>
									)}
								</div>
							)}
						</div>
					)}
				</div>

				<aside className="flex flex-col justify-center flex-none gap-2 pr-2.5 overflow-y-auto border-r w-26 border-subtle scrollbar-none">
					<div
						role="img"
						aria-label={`${percent} درصد تسک‌ها انجام شده`}
						className="relative flex items-center justify-center shrink-0"
					>
						<svg
							aria-hidden="true"
							className="-rotate-90 size-14 shrink-0"
							viewBox="0 0 36 36"
						>
							<path
								className="text-ghost"
								stroke="currentColor"
								strokeWidth="3.5"
								fill="none"
								d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
							/>
							<path
								className={cn(
									'transition-[stroke-dasharray] duration-700 ease-out',
									isAllDone ? 'text-success' : 'text-primary'
								)}
								stroke="currentColor"
								strokeWidth="3.5"
								strokeDasharray={`${percent}, 100`}
								strokeLinecap="round"
								fill="none"
								d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
							/>
						</svg>
						<div className="absolute inset-0 flex items-center justify-center">
							<span
								className={cn(
									'text-sm font-black leading-none tabular-nums',
									isAllDone ? 'text-success' : 'text-content'
								)}
							>
								{percent}٪
							</span>
						</div>
					</div>

					<dl className="flex flex-col gap-1 shrink-0">
						<StatRow
							label="انجام‌شده"
							value={completed}
							className="text-success"
						/>
						<StatRow
							label="در انتظار"
							value={pending}
							className="text-content"
						/>
						<StatRow label="مهم" value={important} className="text-error" />
					</dl>
				</aside>
			</div>

			<ExpandableTodoInput
				className="pt-0!"
				editTodo={editingTodo}
				isEdit={!!editingTodo}
				onClose={onCloseEditor}
				onUpdated={onUpdated}
			/>
		</div>
	)
}

function BoardTodoSkeleton() {
	return (
		<div
			aria-hidden="true"
			className="flex items-center justify-between gap-2 px-3 py-2 border rounded-xl border-subtle bg-subtle"
		>
			<div className="flex items-center flex-1 min-w-0 gap-2.5">
				<div className="rounded-md size-4.5 skeleton shrink-0" />
				<div className="flex flex-col flex-1 min-w-0 gap-1.5">
					<div className="w-2/3 h-3 rounded skeleton" />
					<div className="w-16 h-2 rounded skeleton" />
				</div>
			</div>
			<div className="rounded-md size-4 skeleton shrink-0" />
		</div>
	)
}

interface StatRowProps {
	label: string
	value: number
	className: string
}

function StatRow({ label, value, className }: StatRowProps) {
	return (
		<div className="flex items-center justify-between gap-1 px-2 py-0.5 rounded-lg bg-subtle">
			<dt className="text-[10px] font-medium truncate text-muted">{label}</dt>
			<dd className={cn('text-[11px] font-black tabular-nums', className)}>
				<data value={value}>{value}</data>
			</dd>
		</div>
	)
}
