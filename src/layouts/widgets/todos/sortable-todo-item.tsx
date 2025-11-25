import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { TodoItem } from './todo.item'
import type { Todo } from '@/services/hooks/todo/todo.interface'

interface SortableTodoItemProps {
	todo: Todo
	blurMode?: boolean
}

export function SortableTodoItem({ todo, blurMode = false }: SortableTodoItemProps) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
		useSortable({
			id: todo.id,
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
				blurMode={blurMode}
				isDragging={isDragging}
				dragHandle={{ ...attributes, ...listeners }}
			/>
		</div>
	)
}
