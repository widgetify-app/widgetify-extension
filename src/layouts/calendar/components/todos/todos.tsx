import type jalaliMoment from 'jalali-moment'
import { useState } from 'react'
import { useTodoStore } from '../../../../context/todo.context'
import { formatDateStr } from '../../utils'
import { TodoInput } from './todo-input'
import { TodoItem } from './todo.item'

type TodoProp = {
	currentDate: jalaliMoment.Moment
}

export function Todos({ currentDate }: TodoProp) {
	const { addTodo, todos, removeTodo, toggleTodo, updateTodo } = useTodoStore()
	const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
	const [sort, setSort] = useState<'priority' | 'time' | 'default'>('default')
	const selectedDateStr = formatDateStr(currentDate.clone())

	let selectedDateTodos = todos.filter((todo) => todo.date === selectedDateStr)

	if (filter === 'active') {
		selectedDateTodos = selectedDateTodos.filter((todo) => !todo.completed)
	} else if (filter === 'completed') {
		selectedDateTodos = selectedDateTodos.filter((todo) => todo.completed)
	}

	if (sort === 'priority') {
		const priorityValues = { high: 3, medium: 2, low: 1 }
		selectedDateTodos = [...selectedDateTodos].sort(
			(a, b) => priorityValues[b.priority] - priorityValues[a.priority],
		)
	}

	const handleAddTodo = (
		text: string,
		priority: 'low' | 'medium' | 'high',
		category?: string,
		notes?: string,
	) => {
		addTodo(text, selectedDateStr, priority, category, notes)
	}

	const getCompletionStats = () => {
		const total = selectedDateTodos.length
		const completed = selectedDateTodos.filter((todo) => todo.completed).length
		const percentage = total ? Math.round((completed / total) * 100) : 0
		return { total, completed, percentage }
	}

	const stats = getCompletionStats()

	return (
		<div>
			<h4 className="mb-3 text-lg text-gray-300">یادداشت‌های روز</h4>

			{selectedDateTodos.length > 0 && (
				<div className="mb-4">
					<div className="h-2 mb-2 bg-gray-700 rounded-full">
						<div
							className="h-2 bg-green-500 rounded-full"
							style={{ width: `${stats.percentage}%` }}
						></div>
					</div>
					<div className="flex justify-between text-xs text-gray-400">
						<span>
							{stats.completed} از {stats.total} انجام شده
						</span>
						<span>{stats.percentage}%</span>
					</div>
				</div>
			)}

			<TodoInput onAdd={handleAddTodo} />

			<div className="flex justify-between mb-3">
				<div className="flex gap-1 text-xs">
					<button
						onClick={() => setFilter('all')}
						className={`px-2 py-1 rounded ${filter === 'all' ? 'bg-blue-500/20 text-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
					>
						همه
					</button>
					<button
						onClick={() => setFilter('active')}
						className={`px-2 py-1 rounded ${filter === 'active' ? 'bg-blue-500/20 text-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
					>
						فعال
					</button>
					<button
						onClick={() => setFilter('completed')}
						className={`px-2 py-1 rounded ${filter === 'completed' ? 'bg-blue-500/20 text-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
					>
						تکمیل شده
					</button>
				</div>

				<select
					value={sort}
					onChange={(e) => setSort(e.target.value as 'priority' | 'time' | 'default')}
					className="text-xs text-gray-400 bg-transparent border-none focus:ring-0"
				>
					<option value="default">مرتب‌سازی: پیش‌فرض</option>
					<option value="priority">مرتب‌سازی: اولویت</option>
					<option value="time">مرتب‌سازی: زمان</option>
				</select>
			</div>

			<div className="pr-1 space-y-2 overflow-y-auto max-h-48">
				{selectedDateTodos.length > 0 ? (
					selectedDateTodos.map((todo) => (
						<TodoItem
							key={todo.id}
							todo={todo}
							deleteTodo={removeTodo}
							toggleTodo={toggleTodo}
							updateTodo={updateTodo}
						/>
					))
				) : (
					<div className="py-6 text-center text-gray-500">
						<p>یادداشتی برای امروز ندارید.</p>
						<p className="text-sm">یک یادداشت جدید اضافه کنید!</p>
					</div>
				)}
			</div>
		</div>
	)
}
