import type React from 'react'
import { createContext, use, useContext, useEffect, useRef, useState } from 'react'
import { validate } from 'uuid'
import { getFromStorage, setToStorage } from '@/common/storage'
import { callEvent, listenEvent } from '@/common/utils/call-event'
import { SyncTarget } from '@/layouts/navbar/sync/sync'
import Analytics from '@/analytics'
import { useAuth } from './auth.context'
import { showToast } from '@/common/toast'
import { useAddTodo } from '@/services/hooks/todo/add-todo.hook'
import { safeAwait } from '@/services/api'
import { translateError } from '@/utils/translate-error'
import { useRemoveTodo } from '@/services/hooks/todo/remove-todo.hook'
import { useUpdateTodo } from '@/services/hooks/todo/update-todo.hook'
import { useGetTodos } from '@/services/hooks/todo/get-todos.hook'
import type { FetchedTodo, Todo } from '@/services/hooks/todo/todo.interface'

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
}

const TodoContext = createContext<TodoContextType | null>(null)

export function TodoProvider({ children }: { children: React.ReactNode }) {
	const { isAuthenticated } = useAuth()
	const [todos, setTodos] = useState<Todo[] | null>(null)
	const [todoOptions, setTodoOptions] = useState<TodoOptions>({
		viewMode: TodoViewType.All,
	})

	const { data: fetchedTodos, refetch } = useGetTodos(isAuthenticated)
	const { mutateAsync: addTodoAsync } = useAddTodo()
	const { mutateAsync: removeTodoAsync } = useRemoveTodo()
	const { mutateAsync: updateTodoAsync } = useUpdateTodo()

	const didLoadInitialOptions = useRef(false)

	useEffect(() => {
		async function load() {
			const [todos, todoOptions] = await Promise.all([
				getFromStorage('todos'),
				getFromStorage('todoOptions'),
			])

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
		if (!fetchedTodos || !fetchedTodos.length) return

		const mappedTodos = fetchedTodos.map((todo: FetchedTodo) => ({
			id: todo.id,
			text: todo.text,
			onlineId: todo.id,
			completed: todo.completed,
			date: todo.date,
			priority: todo.priority,
			category: todo.category,
			notes: todo.description,
			order: todo.order || 0,
		}))

		callEvent('todosChanged', mappedTodos)
	}, [fetchedTodos])

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

	const addTodo = async (input: AddTodoInput) => {
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

		// todo: post to server
		const [err, _] = await safeAwait(
			addTodoAsync({
				text: input.text,
				completed: false,
				date: input.date,
				priority: input.priority || TodoPriority.Low,
				category: input.category || '',
				order: maxOrder + 1,
				description: input.notes || '',
			})
		)
		if (err) {
			const content = translateError(err)
			if (typeof content === 'string') {
				showToast(content, 'error')
			} else {
				showToast(
					`${Object.keys(content)[0]}: ${Object.values(content)[0]}`,
					'error'
				)
			}
			return
		}

		refetch()
		Analytics.event('todo_added')
	}

	const removeTodo = async (id: string) => {
		if (!isAuthenticated) return
		const todo = todos?.find((todo) => todo.id === id)
		if (!todo) return

		const onlineId = todo.onlineId || todo.id
		if (validate(onlineId)) {
			return showToast(
				'این وظیفه هنوز همگام‌سازی نشده است و نمی‌توان آن را حذف کرد.',
				'error'
			)
		}
		const [err, _] = await safeAwait(removeTodoAsync(onlineId))
		if (err) {
			showToast(translateError(err) as string, 'error')
			return
		}

		refetch()
	}

	const toggleTodo = async (id: string) => {
		if (!isAuthenticated) return

		const current = todos?.find((todo) => todo.id === id || todo.onlineId === id)
		if (!current) return
		const onlineId = current.onlineId || current.id

		if (validate(onlineId)) {
			return showToast(
				'این وظیفه هنوز همگام‌سازی نشده است و نمی‌توان آن را تغییر داد.',
				'error'
			)
		}

		const [err, _] = await safeAwait(
			updateTodoAsync({
				id: onlineId,
				input: {
					completed: !current.completed,
				},
			})
		)

		if (err) {
			showToast(translateError(err) as string, 'error')
			return
		}

		refetch()
	}

	const updateTodo = async (id: string, updates: Partial<Omit<Todo, 'id'>>) => {
		if (!isAuthenticated) return

		const current = todos?.find((todo) => todo.id === id || todo.onlineId === id)
		if (!current) return
		const onlineId = current.onlineId || current.id
		if (validate(onlineId)) {
			return showToast(
				'این وظیفه هنوز همگام‌سازی نشده است و نمی‌توان آن را تغییر داد.',
				'error'
			)
		}

		const [err, _] = await safeAwait(
			updateTodoAsync({
				id: onlineId,
				input: {
					category: updates.category,
					completed: updates.completed,
					date: updates.date,
					description: updates.notes,
					priority: updates.priority as TodoPriority,
					text: updates.text,
					order: updates.order,
				},
			})
		)

		if (err) {
			showToast(translateError(err) as string, 'error')
			return
		}

		refetch()
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
