import { type ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { StoreKey } from '../common/constant/store.key'
import { getFromStorage, setToStorage } from '../common/storage'
import type { Todo } from '../layouts/calendar/interface/todo.interface'

interface TodoContextType {
	todos: Todo[]
	addTodo: (text: string, date: string) => void
	removeTodo: (id: string) => void
	toggleTodo: (id: string) => void
	setTodos: (todos: Todo[]) => void
}

const TodoContext = createContext<TodoContextType | undefined>(undefined)
export function TodoProvider({ children }: { children: ReactNode }) {
	const [todos, setTodos] = useState<Todo[]>([])

	useEffect(() => {
		const todosFromStorage = getFromStorage(StoreKey.Todos)
		if (todosFromStorage) {
			setTodos(todosFromStorage as Todo[])
		}
	}, [])

	const addTodo = (text: string, date: string) => {
		const todoList = [
			...todos,
			{ id: Math.random().toString(36).slice(2), text, completed: false, date },
		]

		setTodos(todoList)

		setToStorage(StoreKey.Todos, todoList)
	}

	const removeTodo = (id: string) => {
		setTodos(todos.filter((todo) => todo.id !== id))
	}

	const toggleTodo = (id: string) => {
		setTodos(
			todos.map((todo) =>
				todo.id === id ? { ...todo, completed: !todo.completed } : todo,
			),
		)
	}

	return (
		<TodoContext.Provider value={{ todos, addTodo, removeTodo, toggleTodo, setTodos }}>
			{children}
		</TodoContext.Provider>
	)
}

export function useTodo() {
	const context = useContext(TodoContext)
	if (context === undefined) {
		throw new Error('useTodo must be used within a TodoProvider')
	}
	return context
}
