import { useState } from 'react'
import { FiChevronDown, FiChevronUp, FiEdit, FiTrash2 } from 'react-icons/fi'
import CustomCheckbox from '../../../../components/checkbox'
import { useTheme } from '../../../../context/theme.context'
import type { Todo } from '../../interface/todo.interface'

interface Prop {
	todo: Todo
	toggleTodo: (id: string) => void
	deleteTodo: (id: string) => void
	updateTodo: (id: string, updates: Partial<Omit<Todo, 'id'>>) => void
	blurMode?: boolean
}

const translatedPriority = {
	low: 'کم',
	medium: 'متوسط',
	high: 'زیاد',
}

export function TodoItem({
	todo,
	deleteTodo,
	toggleTodo,
	updateTodo,
	blurMode = false,
}: Prop) {
	const { theme } = useTheme()
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

	const getItemBackgroundStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-gray-100/90'
			case 'dark':
				return 'bg-neutral-800/50'
			default: // glass
				return 'bg-neutral-800/30'
		}
	}

	const getTextStyle = () => {
		if (todo.completed) {
			switch (theme) {
				case 'light':
					return 'line-through text-gray-400'

				default:
					return 'line-through text-gray-500'
			}
		}

		switch (theme) {
			case 'light':
				return 'text-gray-600'

			default:
				return 'text-gray-300'
		}
	}

	const getCategoryBadgeStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-blue-100/50 text-blue-600'

			default:
				return 'bg-blue-500/20 text-blue-400'
		}
	}

	const getPriorityColor = () => {
		switch (todo.priority) {
			case 'high':
				return theme === 'light'
					? 'bg-red-100/50 text-red-600'
					: 'bg-red-500/20 text-red-400'
			case 'medium':
				return theme === 'light'
					? 'bg-yellow-100/50 text-yellow-600'
					: 'bg-yellow-500/20 text-yellow-400'
			case 'low':
				return theme === 'light'
					? 'bg-green-100/50 text-green-600'
					: 'bg-green-500/20 text-green-400'
			default:
				return theme === 'light'
					? 'bg-blue-100/50 text-blue-600'
					: 'bg-blue-500/20 text-blue-400'
		}
	}

	const getButtonStyle = () => {
		switch (theme) {
			case 'light':
				return 'text-gray-500 hover:text-gray-700'

			default:
				return 'text-gray-400 hover:text-gray-300'
		}
	}

	const getEditButtonStyle = () => {
		switch (theme) {
			case 'light':
				return 'text-blue-600 hover:text-blue-700'
			default:
				return 'text-blue-400 hover:text-blue-300'
		}
	}

	const getDeleteButtonStyle = () => {
		switch (theme) {
			case 'light':
				return 'text-red-600 hover:text-red-700'
			default:
				return 'text-red-400 hover:text-red-300'
		}
	}

	const getSaveButtonStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-blue-600 text-white hover:bg-blue-700'
			default:
				return 'bg-blue-500 text-white hover:bg-blue-600'
		}
	}

	const getExpandedAreaStyle = () => {
		switch (theme) {
			case 'light':
				return 'border-gray-300/30'
			case 'dark':
				return 'border-gray-700/30'
			default: // glass
				return 'border-gray-700/20'
		}
	}

	const getEditFieldStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-gray-200/80 text-gray-700'
			case 'dark':
				return 'bg-gray-700/40 text-gray-200'
			default: // glass
				return 'bg-gray-700/30 text-gray-200'
		}
	}

	const getLabelStyle = () => {
		switch (theme) {
			case 'light':
				return 'text-gray-600'

			default:
				return 'text-gray-400'
		}
	}

	const getNotesStyle = () => {
		switch (theme) {
			case 'light':
				return 'text-gray-600'

			default:
				return 'text-gray-400'
		}
	}

	return (
		<div
			className={`overflow-hidden transition-all duration-200 rounded-lg ${getItemBackgroundStyle()} group ${blurMode ? 'blur-item' : ''}`}
		>
			<div className="flex items-center gap-2 p-3">
				<CustomCheckbox checked={todo.completed} onChange={() => toggleTodo(todo.id)} />
				{!editing ? (
					<span
						onClick={() => toggleTodo(todo.id)}
						className={`flex-1 overflow-clip w-[180px] ${getTextStyle()}`}
					>
						{todo.text}
					</span>
				) : (
					<input
						type="text"
						value={text}
						onChange={(e) => setText(e.target.value)}
						className={`flex-1 px-2 py-1 rounded ${getEditFieldStyle()}`}
					/>
				)}

				<div className="flex flex-col gap-1">
					{todo.category && !editing && (
						<span
							className={`text-xs px-2 py-0.5 rounded-full ${getCategoryBadgeStyle()}`}
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

				<button onClick={() => setExpanded(!expanded)} className={getButtonStyle()}>
					{expanded ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
				</button>

				{!editing ? (
					<>
						<button
							onClick={handleEdit}
							className={`transition-opacity opacity-0 group-hover:opacity-100 ${getEditButtonStyle()}`}
						>
							<FiEdit size={16} />
						</button>
						<button
							onClick={() => deleteTodo(todo.id)}
							className={`transition-opacity opacity-0 group-hover:opacity-100 ${getDeleteButtonStyle()}`}
						>
							<FiTrash2 size={16} />
						</button>
					</>
				) : (
					<button
						onClick={handleSave}
						className={`px-2 py-1 text-xs rounded ${getSaveButtonStyle()}`}
					>
						ذخیره
					</button>
				)}
			</div>

			{expanded && (
				<div
					className={`p-3 pt-0 border-t ${getExpandedAreaStyle()} ${editing ? 'space-y-2' : ''}`}
				>
					{editing ? (
						<>
							<div className="flex items-center gap-2">
								<label className={`text-xs ${getLabelStyle()}`}>دسته‌بندی:</label>
								<input
									type="text"
									value={category}
									onChange={(e) => setCategory(e.target.value)}
									placeholder="مثال: کار، شخصی، ..."
									className={`flex-1 px-2 py-1 text-sm rounded ${getEditFieldStyle()}`}
								/>
							</div>

							<div className="flex items-center gap-2">
								<label className={`text-xs ${getLabelStyle()}`}>اولویت:</label>
								<select
									value={priority}
									onChange={(e) => setPriority(e.target.value as Todo['priority'])}
									className={`flex-1 px-2 py-1 text-sm rounded ${getEditFieldStyle()}`}
								>
									<option value="low">کم</option>
									<option value="medium">متوسط</option>
									<option value="high">زیاد</option>
								</select>
							</div>

							<div className="flex flex-col gap-1">
								<label className={`text-xs ${getLabelStyle()}`}>یادداشت:</label>
								<textarea
									value={notes}
									onChange={(e) => setNotes(e.target.value)}
									placeholder="جزئیات بیشتر..."
									className={`w-full px-2 py-1 text-sm rounded ${getEditFieldStyle()}`}
									rows={2}
								/>
							</div>
						</>
					) : (
						<>
							{todo.notes && (
								<p className={`mt-1 text-sm ${getNotesStyle()}`}>{todo.notes}</p>
							)}
						</>
					)}
				</div>
			)}
		</div>
	)
}
