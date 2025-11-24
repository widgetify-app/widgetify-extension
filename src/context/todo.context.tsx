import type React from 'react'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { getFromStorage, setToStorage } from '@/common/storage'
import { callEvent, listenEvent } from '@/common/utils/call-event'
import { SyncTarget } from '@/layouts/navbar/sync/sync'
import type { Todo } from '@/layouts/widgets/calendar/interface/todo.interface'
import Analytics from '@/analytics'
import { useAuth } from './auth.context'
import { showToast } from '@/common/toast'

export enum TodoViewType {
	Day = 'day',
	Monthly = 'monthly',
	All = 'all',
}
export enum TodoPriority {
	Low = 'low',
	Medium = 'medium',
	High = 'high',
}
export interface TodoOptions {
	viewMode: TodoViewType
}
export interface AddTodoInput {
	text: string
	date: string
	priority?: TodoPriority
	category?: string
	notes?: string
}

interface TodoContextType {
	todos: Todo[]
	addTodo: (input: AddTodoInput) => void
	todoOptions: TodoOptions
	removeTodo: (id: string) => void
	toggleTodo: (id: string) => void
	updateTodo: (id: string, updates: Partial<Omit<Todo, 'id'>>) => void
	clearCompleted: (date?: string) => void
	updateOptions: (options: Partial<TodoOptions>) => void
	reorderTodos: (todos: Todo[]) => void
	showNewBadge: boolean
}

const TodoContext = createContext<TodoContextType | null>(null)

export function TodoProvider({ children }: { children: React.ReactNode }) {
	const { isAuthenticated } = useAuth()
	const [todos, setTodos] = useState<Todo[] | null>(null)
	const [todoOptions, setTodoOptions] = useState<TodoOptions>({
		viewMode: TodoViewType.All,
	})
	const [showNewBadge, setShowNewBadge] = useState<boolean>(false)

	const didLoadInitialOptions = useRef(false)

	useEffect(() => {
		async function load() {
			const [todos, todoOptions, seenTodoNewViewMode] = await Promise.all([
				getFromStorage('todos'),
				getFromStorage('todoOptions'),
				getFromStorage('seenTodoNewViewMode'),
			])

			if (!seenTodoNewViewMode) {
				setShowNewBadge(true)
			}

			const migratedTodos = (todos || []).map((todo: Todo, index: number) => ({
				...todo,
				order: todo.order !== undefined ? todo.order : index,
			}))

			setTodos(migratedTodos)
			if (todoOptions) {
				setTodoOptions(todoOptions)
			} else {
				setToStorage('todoOptions', {
					viewMode: TodoViewType.All,
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
		if (options.viewMode && showNewBadge) {
			setToStorage('seenTodoNewViewMode', true)
		}
		setTodoOptions((prev) => ({
			...prev,
			...options,
		}))
	}

	const addTodo = (input: AddTodoInput) => {
		if (!isAuthenticated) {
			showToast('برای اضافه کردن وظیفه باید وارد حساب کاربری شوید.', 'error')
			return
		}

		const old = todos || []
		const sameDateTodos = old.filter((t) => t.date === input.date)
		const maxOrder =
			sameDateTodos.length > 0
				? Math.max(...sameDateTodos.map((t) => t.order || 0))
				: 0

		setTodos([
			...old,
			{
				id: uuidv4(),
				text: input.text,
				completed: false,
				date: input.date,
				priority: input.priority || 'low',
				category: input.category || '',
				notes: input.notes || '',
				onlineId: null,
				order: maxOrder + 1,
			},
		])
		Analytics.event('todo_added')
		callEvent('startSync', SyncTarget.TODOS)
	}

	const removeTodo = async (id: string) => {
		const todo = todos?.find((todo) => todo.id === id)
		if (!todo) return

		setTodos((prev) => {
			if (!prev) return null
			return prev.filter((todo) => todo.id !== id)
		})

		if (todo?.onlineId && isAuthenticated) {
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
				todo.id === id ? { ...todo, completed: !todo.completed } : todo
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

	const reorderTodos = (newTodos: Todo[]) => {
		const todosWithOrder = newTodos.map((todo, index) => ({
			...todo,
			order: index,
		}))
		setTodos(todosWithOrder)
		callEvent('startSync', SyncTarget.TODOS)
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
				reorderTodos,
				showNewBadge,
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
