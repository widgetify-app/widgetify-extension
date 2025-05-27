import { getFromStorage, setToStorage } from '@/common/storage'
import { callEvent, listenEvent } from '@/common/utils/call-event'
import { SyncTarget } from '@/layouts/navbar/sync/sync'
import type { Todo } from '@/layouts/widgets/calendar/interface/todo.interface'
import type React from 'react'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

export enum TodoViewType {
	Day = 'day',
	Monthly = 'monthly',
}
export interface TodoOptions {
	blurMode: boolean
	viewMode: TodoViewType
}

interface TodoContextType {
	todos: Todo[]
	addTodo: (
		text: string,
		date: string,
		priority?: 'low' | 'medium' | 'high',
		category?: string,
		notes?: string,
	) => void
	todoOptions: TodoOptions
	removeTodo: (id: string) => void
	toggleTodo: (id: string) => void
	updateTodo: (id: string, updates: Partial<Omit<Todo, 'id'>>) => void
	clearCompleted: (date?: string) => void
	updateOptions: (options: Partial<TodoOptions>) => void
}

const TodoContext = createContext<TodoContextType | null>(null)

export function TodoProvider({ children }: { children: React.ReactNode }) {
	const [todos, setTodos] = useState<Todo[] | null>(null)
	const [todoOptions, setTodoOptions] = useState<TodoOptions>({
		blurMode: false,
		viewMode: TodoViewType.Day,
	})

	const didLoadInitialOptions = useRef(false)

	useEffect(() => {
		async function load() {
			const todos = await getFromStorage('todos')
			const todoOptions = await getFromStorage('todoOptions')
			setTodos(todos || [])
			if (todoOptions) {
				setTodoOptions(todoOptions)
			} else {
				setToStorage('todoOptions', {
					blurMode: false,
					viewMode: TodoViewType.Day,
				})
			}

			didLoadInitialOptions.current = true
		}

		const todosChangedEvent = listenEvent('todosChanged', (todoList: Todo[]) => {
			if (todoList) {
				const uniqueTodos = todoList.reduce((acc: Todo[], todo: Todo) => {
					if (!acc.some((t) => t.id === todo.id)) {
						acc.push(todo)
					}
					return acc
				}, [])
				setTodos(uniqueTodos)
			}
		})

		load()

		return () => {
			todosChangedEvent()
		}
	}, [])

	useEffect(() => {
		if (todos === null) return
		setToStorage('todos', todos)
	}, [todos])

	useEffect(() => {
		if (!didLoadInitialOptions.current) return

		setToStorage('todoOptions', todoOptions)
	}, [todoOptions])

	function updateOptions(options: Partial<TodoOptions>) {
		setTodoOptions((prev) => ({
			...prev,
			...options,
		}))
	}

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
		callEvent('startSync', SyncTarget.TODOS)
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
			callEvent('startSync', SyncTarget.TODOS)
		}
	}

	const toggleTodo = (id: string) => {
		setTodos((prev) => {
			if (!prev) return null
			return prev.map((todo) =>
				todo.id === id ? { ...todo, completed: !todo.completed } : todo,
			)
		})
		callEvent('startSync', SyncTarget.TODOS)
	}

	const updateTodo = (id: string, updates: Partial<Omit<Todo, 'id'>>) => {
		setTodos((prev) => {
			if (!prev) return null
			return prev.map((todo) => (todo.id === id ? { ...todo, ...updates } : todo))
		})
		callEvent('startSync', SyncTarget.TODOS)
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
				updateOptions,
				todoOptions,
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
