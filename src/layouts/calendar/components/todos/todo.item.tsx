import { useState } from 'react'
import { FiChevronDown, FiChevronUp, FiEdit, FiTrash2 } from 'react-icons/fi'
import { CustomCheckbox } from '../../../../components/checkbox'
import type { Todo } from '../../interface/todo.interface'

interface Prop {
	todo: Todo
	toggleTodo: (id: string) => void
	deleteTodo: (id: string) => void
	updateTodo: (id: string, updates: Partial<Omit<Todo, 'id'>>) => void
}

const translatedPriority = {
	low: 'کم',
	medium: 'متوسط',
	high: 'زیاد',
}

export function TodoItem({ todo, deleteTodo, toggleTodo, updateTodo }: Prop) {
	const [expanded, setExpanded] = useState(false)
	const [editing, setEditing] = useState(false)
	const [text, setText] = useState(todo.text)
	const [notes, setNotes] = useState(todo.notes || '')
	const [priority, setPriority] = useState(todo.priority)
	const [category, setCategory] = useState(todo.category || '')

	const handleEdit = () => {
		setEditing(true)
		setExpanded(true)
	}

	const handleSave = () => {
		updateTodo(todo.id, {
			text,
			notes,
			priority,
			category,
		})
		setEditing(false)
	}

	const getPriorityColor = () => {
		switch (todo.priority) {
			case 'high':
				return 'bg-red-500/20 text-red-400'
			case 'medium':
				return 'bg-yellow-500/20 text-yellow-400'
			case 'low':
				return 'bg-green-500/20 text-green-400'
			default:
				return 'bg-blue-500/20 text-blue-400'
		}
	}

	return (
		<div className="overflow-hidden transition-all duration-200 rounded-lg bg-gray-300/80 dark:bg-neutral-800/50 group">
			<div className="flex items-center gap-2 p-3">
				<CustomCheckbox checked={todo.completed} onChange={() => toggleTodo(todo.id)} />
				{!editing ? (
					<span
						onClick={() => toggleTodo(todo.id)}
						className={`flex-1 text-gray-600 dark:text-gray-300 overflow-clip w-[180px] ${todo.completed ? 'line-through text-gray-400' : ''}`}
					>
						{todo.text}
					</span>
				) : (
					<input
						type="text"
						value={text}
						onChange={(e) => setText(e.target.value)}
						className="flex-1 px-2 py-1 text-gray-200 rounded bg-gray-700/40"
					/>
				)}

				{/* {todo.dueTime && !editing && (
					<span className="flex items-center gap-1 text-xs text-gray-400">
						<FiClock size={10} />
						{todo.dueTime}
					</span>
				)} */}

				<div className="flex flex-col gap-1">
					{todo.category && !editing && (
						<span
							className={'text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400'}
						>
							{todo.category}
						</span>
					)}

					{!editing && (
						<span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor()}`}>
							{translatedPriority[todo.priority]}
						</span>
					)}
				</div>

				<button
					onClick={() => setExpanded(!expanded)}
					className="text-gray-400 hover:text-gray-300"
				>
					{expanded ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
				</button>

				{!editing ? (
					<>
						<button
							onClick={handleEdit}
							className="text-blue-400 transition-opacity opacity-0 group-hover:opacity-100 hover:text-blue-300"
						>
							<FiEdit size={16} />
						</button>
						<button
							onClick={() => deleteTodo(todo.id)}
							className="text-red-400 transition-opacity opacity-0 group-hover:opacity-100 hover:text-red-300"
						>
							<FiTrash2 size={16} />
						</button>
					</>
				) : (
					<button
						onClick={handleSave}
						className="px-2 py-1 text-xs text-white bg-blue-500 rounded hover:bg-blue-600"
					>
						ذخیره
					</button>
				)}
			</div>

			{expanded && (
				<div
					className={`p-3 pt-0 border-t border-gray-700/30 ${editing ? 'space-y-2' : ''}`}
				>
					{editing ? (
						<>
							<div className="flex items-center gap-2">
								<label className="text-xs text-gray-400">دسته‌بندی:</label>
								<input
									type="text"
									value={category}
									onChange={(e) => setCategory(e.target.value)}
									placeholder="مثال: کار، شخصی، ..."
									className="flex-1 px-2 py-1 text-sm text-gray-200 rounded bg-gray-700/40"
								/>
							</div>

							<div className="flex items-center gap-2">
								<label className="text-xs text-gray-400">اولویت:</label>
								<select
									value={priority}
									onChange={(e) => setPriority(e.target.value as Todo['priority'])}
									className="flex-1 px-2 py-1 text-sm text-gray-200 rounded bg-gray-700/40"
								>
									<option value="low">کم</option>
									<option value="medium">متوسط</option>
									<option value="high">زیاد</option>
								</select>
							</div>

							<div className="flex flex-col gap-1">
								<label className="text-xs text-gray-400">یادداشت:</label>
								<textarea
									value={notes}
									onChange={(e) => setNotes(e.target.value)}
									placeholder="جزئیات بیشتر..."
									className="w-full px-2 py-1 text-sm text-gray-200 rounded bg-gray-700/40"
									rows={2}
								/>
							</div>
						</>
					) : (
						<>
							{todo.notes && <p className="mt-1 text-sm text-gray-400">{todo.notes}</p>}
						</>
					)}
				</div>
			)}
		</div>
	)
}
