import CustomCheckbox from '@/components/checkbox'
import { useTheme } from '@/context/theme.context'
import { useState } from 'react'
import { FiChevronDown, FiChevronUp, FiTrash2 } from 'react-icons/fi'
import type { Todo } from '../../interface/todo.interface'

interface Prop {
	todo: Todo
	toggleTodo: (id: string) => void
	deleteTodo: (id: string) => void
	blurMode?: boolean
	isPreview?: boolean
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
	blurMode = false,
	isPreview = false,
}: Prop) {
	const { theme } = useTheme()
	const [expanded, setExpanded] = useState(false)

	const getItemBackgroundStyle = () => {
		switch (theme) {
			case 'light':
				return isPreview ? 'bg-gray-100/70' : 'bg-gray-100/90'
			case 'dark':
				return isPreview ? 'bg-neutral-800/30' : 'bg-neutral-800/50'
			default: // glass
				return isPreview ? 'bg-neutral-800/20' : 'bg-neutral-800/30'
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

	const getDeleteButtonStyle = () => {
		switch (theme) {
			case 'light':
				return 'text-red-600 hover:text-red-700'
			default:
				return 'text-red-400 hover:text-red-300'
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
			<div className={`flex items-center gap-2 ${isPreview ? 'p-2' : 'p-3'}`}>
				<CustomCheckbox checked={todo.completed} onChange={() => toggleTodo(todo.id)} />

				<span
					onClick={() => toggleTodo(todo.id)}
					className={`flex-1 overflow-clip ${isPreview ? 'text-sm w-[160px]' : 'w-[180px]'} ${getTextStyle()}`}
				>
					{todo.text}
				</span>

				<div className="flex flex-col gap-1">
					{todo.category && !isPreview && (
						<span
							className={`text-xs px-2 py-0.5 rounded-full ${getCategoryBadgeStyle()}`}
						>
							{todo.category}
						</span>
					)}

					<span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor()}`}>
						{translatedPriority[todo.priority]}
					</span>
				</div>

				{!isPreview && (
					<button onClick={() => setExpanded(!expanded)} className={getButtonStyle()}>
						{expanded ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
					</button>
				)}

				<button
					onClick={() => deleteTodo(todo.id)}
					className={`transition-opacity opacity-0 group-hover:opacity-100 ${getDeleteButtonStyle()}`}
				>
					<FiTrash2 size={16} />
				</button>
			</div>

			{expanded && !isPreview && (
				<div className={`p-3 pt-0 border-t ${getExpandedAreaStyle()}`}>
					{todo.notes && (
						<p className={`mt-1 text-sm ${getNotesStyle()}`}>{todo.notes}</p>
					)}
				</div>
			)}
		</div>
	)
}
