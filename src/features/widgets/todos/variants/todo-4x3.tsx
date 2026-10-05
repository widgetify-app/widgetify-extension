import { cn } from '@/common/utils/cn'
import { ExpandableTodoInput } from '../components/expandable-todo-input'
import { type TodoListProps, TodoListBody } from './todo-2x3'

const RING_RADIUS = 15.9155

export function TodoBoard(props: TodoListProps) {
	const { todos, isAuthenticated, isLoading, isError } = props

	const total = todos.length
	const completed = todos.filter((t) => t.completed).length
	const pending = total - completed
	const important = todos.filter((t) => !t.completed && t.priority === 'high').length
	const percent = total > 0 ? Math.round((completed / total) * 100) : 0
	const showStats = isAuthenticated && !isLoading && !isError && total > 0

	return (
		<>
			{props.header}
			<div className="flex flex-1 min-h-0 gap-3">
				<div className="flex flex-col flex-1 min-w-0 gap-1.5">
					<TodoListBody {...props} />
					{isAuthenticated && (
						<ExpandableTodoInput
							editTodo={props.editingTodo}
							isEdit={!!props.editingTodo}
							onClose={props.onCloseEditor}
							onUpdated={props.onUpdated}
						/>
					)}
				</div>

				{showStats && (
					<aside
						aria-label="خلاصه‌ی تسک‌ها"
						className="flex flex-col flex-none gap-1 pt-1 border-s w-37.5 ps-3.5 border-line"
					>
						<div
							role="img"
							aria-label={`${percent} درصد تسک‌ها انجام شده`}
							className="relative grid self-center mt-1 mb-2.5 place-items-center size-19"
						>
							<svg
								aria-hidden="true"
								className="absolute inset-0 -rotate-90 size-full"
								viewBox="0 0 36 36"
							>
								<circle
									className="text-fill-2"
									stroke="currentColor"
									strokeWidth="3"
									fill="none"
									cx="18"
									cy="18"
									r={RING_RADIUS}
								/>
								<circle
									className="transition-[stroke-dasharray] duration-500 ease-out text-brand"
									stroke="currentColor"
									strokeWidth="3"
									strokeDasharray={`${percent}, 100`}
									strokeLinecap="round"
									fill="none"
									cx="18"
									cy="18"
									r={RING_RADIUS}
								/>
							</svg>
							<span className="relative text-base font-bold tabular-nums text-fg-strong">
								{percent}٪
							</span>
						</div>

						<dl className="flex flex-col">
							<StatRow label="انجام‌شده" value={completed} />
							<StatRow label="در انتظار" value={pending} />
							<StatRow
								label="مهم"
								value={important}
								className="text-danger"
							/>
						</dl>
					</aside>
				)}
			</div>
		</>
	)
}

interface StatRowProps {
	label: string
	value: number
	className?: string
}

function StatRow({ label, value, className }: StatRowProps) {
	return (
		<div className="flex items-center justify-between text-xs h-6.5 text-fg-muted">
			<dt>{label}</dt>
			<dd
				className={cn('text-sm font-bold tabular-nums text-fg-strong', className)}
			>
				<data value={value}>{value}</data>
			</dd>
		</div>
	)
}
