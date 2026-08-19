import type { Todo } from '@/services/hooks/todo/todo.interface'
import { useUpdateTodo } from '@/services/hooks/todo/update-todo.hook'
import { Icon } from '@/src/icons'

interface TodoCompactRowProps {
	todos: Todo[]
	isLoading: boolean
	onRefresh: () => void
}

export function TodoCompactRow({ todos, isLoading, onRefresh }: TodoCompactRowProps) {
	const totalCount = todos.length
	const completedCount = todos.filter((t) => t.completed).length
	const nextPending = todos.find((t) => !t.completed) || todos[0]

	const { mutateAsync: updateTodo } = useUpdateTodo(nextPending?.id || null)

	const handleToggle = async (e: React.MouseEvent) => {
		e.stopPropagation()
		if (!nextPending) return
		await updateTodo({
			id: nextPending.id,
			input: { completed: !nextPending.completed },
		})
		onRefresh()
	}

	if (isLoading) {
		return (
			<div className="flex items-center justify-between h-full w-full px-3 py-2 select-none">
				<div className="flex items-center gap-2">
					<div className="w-5 h-5 rounded-md skeleton" />
					<div className="w-32 h-4 rounded skeleton" />
				</div>
				<div className="w-12 h-4 rounded skeleton" />
			</div>
		)
	}

	return (
		<div className="flex items-center justify-between h-full w-full px-3.5 py-2 select-none">
			<div className="flex items-center gap-2.5 overflow-hidden">
				{nextPending ? (
					<>
						<button
							type="button"
							onClick={handleToggle}
							className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 cursor-pointer ${
								nextPending.completed
									? 'bg-success/20 border-success text-success'
									: 'border-base-content/30 hover:border-primary'
							}`}
						>
							{nextPending.completed && (
								<Icon name="check" className="w-3.5 h-3.5" />
							)}
						</button>
						<span
							className={`text-xs font-medium truncate max-w-44 text-content ${
								nextPending.completed
									? 'line-through text-base-content/50'
									: ''
							}`}
						>
							{nextPending.text}
						</span>
					</>
				) : (
					<div className="flex items-center gap-1.5 text-xs text-muted">
						<Icon name="taskList" className="w-4 h-4 text-primary" />
						<span>همه تسک‌ها انجام شدند</span>
					</div>
				)}
			</div>

			<div className="flex items-center gap-2 text-xs shrink-0">
				<div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-base-200/50 text-base-content/70 border border-base-content/10 text-[11px]">
					<span className="text-success font-bold">{completedCount}</span>
					<span>/</span>
					<span>{totalCount}</span>
				</div>
			</div>
		</div>
	)
}
