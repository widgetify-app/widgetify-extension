import type React from 'react'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { validate } from 'uuid'
import { getFromStorage, setToStorage } from '@/common/storage'
import { callEvent, listenEvent } from '@/common/utils/call-event'
import Analytics from '@/analytics'
import { useAuth } from './auth.context'
import { showToast } from '@/common/toast'
import { useAddTodo } from '@/services/hooks/todo/add-todo.hook'
import { safeAwait } from '@/services/api'
import { translateError } from '@/utils/translate-error'
import { useReorderTodos } from '@/services/hooks/todo/reorder-todo.hook'
import { useUpdateTodo } from '@/services/hooks/todo/update-todo.hook'
import { useGetTodos } from '@/services/hooks/todo/get-todos.hook'
import type { FetchedTodo, Todo } from '@/services/hooks/todo/todo.interface'
import { playAlarm } from '@/common/playAlarm'

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
	setTodos: (todos: Todo[]) => void
	addTodo: (input: AddTodoInput) => void
	todoOptions: TodoOptions
	refetchTodos: any
	toggleTodo: (id: string) => void
	updateTodo: (id: string, updates: Partial<Omit<Todo, 'id'>>) => void
	clearCompleted: (date?: string) => void
	updateOptions: (options: Partial<TodoOptions>) => void
	reorderTodos: (todos: Todo[]) => Promise<void>
	isPending: boolean
}

const TodoContext = createContext<TodoContextType | null>(null)

export function TodoProvider({ children }: { children: React.ReactNode }) {
	const { isAuthenticated } = useAuth()
	const [todos, setTodos] = useState<Todo[] | null>(null)
	const [todoOptions, setTodoOptions] = useState<TodoOptions>({
		viewMode: TodoViewType.All,
	})

	const { data: fetchedTodos, refetch, isPending } = useGetTodos(isAuthenticated)
	const { mutateAsync: addTodoAsync, isPending: isAdding } = useAddTodo()
	const { mutateAsync: updateTodoAsync, isPending: isUpdating } = useUpdateTodo()
	const { mutateAsync: reorderTodosAsync } = useReorderTodos()

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
		if (!fetchedTodos) return
		if (!fetchedTodos.length) return

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

	const toggleTodo = async (id: string) => {
		if (!isAuthenticated) return console.log('Not authenticated, toggle aborted')

		const current = todos?.find((todo) => todo.id === id || todo.onlineId === id)
		if (!current) return console.log('Todo not found, toggle aborted')
		const onlineId = current.onlineId || current.id

		if (validate(onlineId)) {
			return showToast(
				'این وظیفه هنوز همگام‌سازی نشده است و نمی‌توان آن را تغییر داد.',
				'error'
			)
		}
		const isCompleted = !current.completed
		const [err, _] = await safeAwait(
			updateTodoAsync({
				id: onlineId,
				input: {
					completed: isCompleted,
				},
			})
		)

		if (err) {
			showToast(translateError(err) as string, 'error')
			return
		}
		refetch()
		Analytics.event('todo_toggled')
		if (isCompleted) playAlarm('done_todo')
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
		Analytics.event('todo_updated')
	}

	const clearCompleted = (date?: string) => {
		setTodos((prev) => {
			if (!prev) return null
			return prev.filter((todo) => !todo.completed || (date && todo.date !== date))
		})
	}

	const reorderTodos = async (reorderedTodos: Todo[]) => {
		if (!isAuthenticated || !todos) return

		const todosWithNewOrder = reorderedTodos.map((todo, index) => ({
			...todo,
			order: index,
		}))

		const updatedAllTodos = todos.map((todo) => {
			const updated = todosWithNewOrder.find((t) => t.id === todo.id)
			return updated || todo
		})

		setTodos(updatedAllTodos)

		const changedTodos = todosWithNewOrder.filter((todo) => {
			const oldTodo = todos.find((t) => t.id === todo.id)
			return oldTodo && (oldTodo.order || 0) !== todo.order
		})

		const reorderData = changedTodos.map((todo) => ({
			id: todo.onlineId || todo.id,
			order: todo.order,
		}))

		if (reorderData.length === 0) return
		const [err, _] = await safeAwait(reorderTodosAsync(reorderData))
		if (err) {
			showToast(translateError(err) as string, 'error')
			return
		}

		Analytics.event('todo_reorder')
	}

	return (
		<TodoContext.Provider
			value={{
				todos: todos || [],
				setTodos,
				addTodo,
				toggleTodo,
				updateTodo,
				clearCompleted,
				updateOptions,
				todoOptions,
				reorderTodos,
				refetchTodos: refetch,
				isPending: isPending || isAdding || isUpdating,
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
