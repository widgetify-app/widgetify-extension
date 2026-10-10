import { t } from '@/common/i18n'
import { BoardSummary } from '@/features/widgets/components/board-summary'
import { ExpandableTodoInput } from '../components/expandable-todo-input'
import { type TodoListProps, TodoListBody } from './todo-2x3'

interface TodoBoardProps extends TodoListProps {
	layout?: 'board' | 'panel'
}

export function TodoBoard({ layout = 'board', ...props }: TodoBoardProps) {
	const { todos, isAuthenticated, isLoading, isError } = props

	const total = todos.length
	const completed = todos.filter((t) => t.completed).length
	const pending = total - completed
	const important = todos.filter((t) => !t.completed && t.priority === 'high').length
	const percent = total > 0 ? Math.round((completed / total) * 100) : 0
	const showStats = isAuthenticated && !isLoading && !isError && total > 0
	const isPanel = layout === 'panel'

	const list = (
		<div className="flex flex-col flex-1 min-w-0 min-h-0 gap-1.5">
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
	)

	const summary = showStats && (
		<BoardSummary
			placement={isPanel ? 'top' : 'side'}
			label={t('widgets.todos.variant4x3.summaryTitle')}
			percent={percent}
			percentLabel={t('widgets.todos.variant4x3.percentDone', {
				p0: percent,
			})}
			stats={[
				{ label: t('widgets.todos.filter.done'), value: completed },
				{ label: t('widgets.todos.filter.undone'), value: pending },
				{
					label: t('widgets.todos.priority.high'),
					value: important,
					className: 'text-danger',
				},
			]}
		/>
	)

	return (
		<>
			{props.header}
			{isPanel ? (
				<>
					{summary}
					{list}
				</>
			) : (
				<div className="flex flex-1 min-h-0 gap-3">
					{list}
					{summary}
				</div>
			)}
		</>
	)
}
