import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Todo } from '../calendar/interface/todo.interface'
import { TodoItem } from './todo.item'

interface SortableTodoItemProps {
	todo: Todo
	toggleTodo: (id: string) => void
	deleteTodo: (id: string) => void
	blurMode?: boolean
	id: string
}

export function SortableTodoItem({
	todo,
	toggleTodo,
	deleteTodo,
	blurMode = false,
	id,
}: SortableTodoItemProps) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
		useSortable({
			id,
		})

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		zIndex: isDragging ? 10 : 1,
	}

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={`transition-transform duration-200 ${isDragging ? 'z-10' : ''}`}
		>
			<TodoItem
				todo={todo}
				toggleTodo={toggleTodo}
				deleteTodo={deleteTodo}
				blurMode={blurMode}
				isDragging={isDragging}
				dragHandle={{ ...attributes, ...listeners }}
			/>
		</div>
	)
}
