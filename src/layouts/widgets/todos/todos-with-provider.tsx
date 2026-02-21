import { TodoProvider } from '@/context/todo.context'
import { TodosLayout } from './todos'

export function TodosWithProvider() {
	return (
		<TodoProvider>
			<TodosLayout />
		</TodoProvider>
	)
}
