import type React from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import type { Todo } from '../layouts/calendar/interface/todo.interface'

interface TodoContextType {
	todos: Todo[]
	addTodo: (
		text: string,
		date: string,
		priority?: 'low' | 'medium' | 'high',
		dueTime?: string,
		category?: string,
		notes?: string,
	) => void
	removeTodo: (id: string) => void
	toggleTodo: (id: string) => void
	updateTodo: (id: string, updates: Partial<Omit<Todo, 'id'>>) => void
	clearCompleted: (date?: string) => void
}

const TodoContext = createContext<TodoContextType | undefined>(undefined)

export function TodoProvider({ children }: { children: React.ReactNode }) {
	const [todos, setTodos] = useState<Todo[]>(() => {
		const savedTodos = localStorage.getItem('todos')
		return savedTodos ? JSON.parse(savedTodos) : []
	})

	useEffect(() => {
		localStorage.setItem('todos', JSON.stringify(todos))
	}, [todos])

	const addTodo = (
		text: string,
		date: string,
		priority: 'low' | 'medium' | 'high' = 'medium',
		dueTime?: string,
		category?: string,
		notes?: string,
	) => {
		setTodos((prev) => [
			...prev,
			{
				id: uuidv4(),
				text,
				completed: false,
				date,
				priority,
				dueTime,
				category,
				notes,
			},
		])
	}

	const removeTodo = (id: string) => {
		setTodos((prev) => prev.filter((todo) => todo.id !== id))
	}

	const toggleTodo = (id: string) => {
		setTodos((prev) =>
			prev.map((todo) =>
				todo.id === id ? { ...todo, completed: !todo.completed } : todo,
			),
		)
	}

	const updateTodo = (id: string, updates: Partial<Omit<Todo, 'id'>>) => {
		setTodos((prev) =>
			prev.map((todo) => (todo.id === id ? { ...todo, ...updates } : todo)),
		)
	}

	const clearCompleted = (date?: string) => {
		setTodos((prev) =>
			prev.filter((todo) => !todo.completed || (date && todo.date !== date)),
		)
	}

	return (
		<TodoContext.Provider
			value={{ todos, addTodo, removeTodo, toggleTodo, updateTodo, clearCompleted }}
		>
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
