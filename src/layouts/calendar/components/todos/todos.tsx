import type jalaliMoment from 'jalali-moment'

import { useTodo } from '../../../../context/todo.context'
import { formatDateStr } from '../../utils'
import { TodoInput } from './todo-input'
import { TodoItem } from './todo.item'

type TodoProp = {
	currentDate: jalaliMoment.Moment
}
export function Todos({ currentDate }: TodoProp) {
	const { addTodo, todos, removeTodo, toggleTodo } = useTodo()
	const selectedDateStr = formatDateStr(currentDate.clone())
	const selectedDateTodos = todos.filter((todo) => todo.date === selectedDateStr)

	return (
		<div>
			<h4 className="mb-3 text-lg text-gray-300">یادداشت‌های روز</h4>
			<TodoInput onAdd={(text) => addTodo(text, selectedDateStr)} />
			<div className="space-y-2 overflow-y-auto max-h-52">
				{selectedDateTodos.map((todo) => (
					<TodoItem
						key={todo.id}
						todo={todo}
						deleteTodo={() => removeTodo(todo.id)}
						toggleTodo={() => toggleTodo(todo.id)}
					/>
				))}
			</div>
		</div>
	)
}
