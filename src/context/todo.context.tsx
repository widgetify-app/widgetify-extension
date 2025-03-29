import { getFromStorage, setToStorage } from '@/common/storage'
import { EventName, callEvent } from '@/common/utils/call-event'
import type { Todo } from '@/layouts/calendar/interface/todo.interface'
import { SyncTarget } from '@/layouts/navbar/sync/sync'
import type React from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

interface TodoContextType {
	todos: Todo[]
	addTodo: (
		text: string,
		date: string,
		priority?: 'low' | 'medium' | 'high',
		category?: string,
		notes?: string,
	) => void
	removeTodo: (id: string) => void
	toggleTodo: (id: string) => void
	updateTodo: (id: string, updates: Partial<Omit<Todo, 'id'>>) => void
	clearCompleted: (date?: string) => void
}

const TodoContext = createContext<TodoContextType | null>(null)

export function TodoProvider({ children }: { children: React.ReactNode }) {
	const [todos, setTodos] = useState<Todo[] | null>(null)

	useEffect(() => {
		async function getTodos() {
			const todos = await getFromStorage('todos')

			setTodos(todos)
		}

		window.addEventListener('todosChanged', (eventData: any) => {
			const todos = eventData.detail
			if (todos) {
				const uniqueTodos = todos.reduce((acc: Todo[], todo: Todo) => {
					if (!acc.some((t) => t.id === todo.id)) {
						acc.push(todo)
					}
					return acc
				}, [])
				setTodos(uniqueTodos)
			}
		})

		getTodos()

		return () => {
			window.removeEventListener('todosChanged', () => {})
		}
	}, [])

	useEffect(() => {
		if (todos === null) return
		setToStorage('todos', todos)
	}, [todos])

	const addTodo = (
		text: string,
		date: string,
		priority: 'low' | 'medium' | 'high' = 'medium',
		category?: string,
		notes?: string,
	) => {
		const old = todos || []
		setTodos([
			...old,
			{
				id: uuidv4(),
				text,
				completed: false,
				date,
				priority,
				category,
				notes,
				onlineId: null,
			},
		])
		callEvent(EventName.startSync, SyncTarget.TODOS)
	}

	const removeTodo = async (id: string) => {
		const todo = todos?.find((todo) => todo.id === id)
		if (!todo) return

		setTodos((prev) => {
			if (!prev) return null
			return prev.filter((todo) => todo.id !== id)
		})

		if (todo?.onlineId) {
			const old = await getFromStorage('deletedTodos')
			const deletedTodos = old || []

			deletedTodos.push(todo)
			setToStorage('deletedTodos', deletedTodos)
			callEvent(EventName.startSync, SyncTarget.TODOS)
		}
	}

	const toggleTodo = (id: string) => {
		setTodos((prev) => {
			if (!prev) return null
			return prev.map((todo) =>
				todo.id === id ? { ...todo, completed: !todo.completed } : todo,
			)
		})
		callEvent(EventName.startSync, SyncTarget.TODOS)
	}

	const updateTodo = (id: string, updates: Partial<Omit<Todo, 'id'>>) => {
		setTodos((prev) => {
			if (!prev) return null
			return prev.map((todo) => (todo.id === id ? { ...todo, ...updates } : todo))
		})
		callEvent(EventName.startSync, SyncTarget.TODOS)
	}

	const clearCompleted = (date?: string) => {
		setTodos((prev) => {
			if (!prev) return null
			return prev.filter((todo) => !todo.completed || (date && todo.date !== date))
		})
	}

	return (
		<TodoContext.Provider
			value={{
				todos: todos || [],
				addTodo,
				removeTodo,
				toggleTodo,
				updateTodo,
				clearCompleted,
			}}
		>
			{children}
		</TodoContext.Provider>
	)
}

export function useTodoStore() {
	const context = useContext(TodoContext)
	if (!context) {
		throw new Error('useTodo must be used within a TodoProvider')
	}
	return context
}
