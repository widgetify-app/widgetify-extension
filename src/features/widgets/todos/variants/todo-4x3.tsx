import { BoardSummary } from '@/features/widgets/components/board-summary'
import { ExpandableTodoInput } from '../components/expandable-todo-input'
import { type TodoListProps, TodoListBody } from './todo-2x3'

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
					<BoardSummary
						label="خلاصه‌ی تسک‌ها"
						percent={percent}
						percentLabel={`${percent} درصد تسک‌ها انجام شده`}
						stats={[
							{ label: 'انجام‌شده', value: completed },
							{ label: 'انجام‌نشده', value: pending },
							{ label: 'مهم', value: important, className: 'text-danger' },
						]}
					/>
				)}
			</div>
		</>
	)
}
