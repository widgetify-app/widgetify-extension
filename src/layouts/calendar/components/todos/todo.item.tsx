import CustomCheckbox from '@/components/checkbox'
import { useTheme } from '@/context/theme.context'
import { AnimatePresence, motion } from 'framer-motion'
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

	const getBorderStyle = () => {
		switch (todo.priority) {
			case 'high':
				return theme === 'light' ? 'border-red-300' : 'border-red-900/50'
			case 'medium':
				return theme === 'light' ? 'border-yellow-300' : 'border-yellow-900/50'
			case 'low':
				return theme === 'light' ? 'border-green-300' : 'border-green-900/50'
			default:
				return theme === 'light' ? 'border-blue-300' : 'border-blue-900/50'
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

	return (
		<motion.div
			className={`overflow-hidden transition-all duration-200 rounded-lg border-r-2 ${getBorderStyle()} ${getItemBackgroundStyle()} group ${blurMode ? 'blur-item' : ''}`}
			initial={{ opacity: 0, y: 5 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, height: 0 }}
			transition={{ duration: 0.2 }}
		>
			<div className={`flex items-center gap-2 pr-2 ${isPreview ? 'p-1.5' : 'p-2'}`}>
				<div className="flex-shrink-0">
					<CustomCheckbox checked={todo.completed} onChange={() => toggleTodo(todo.id)} />
				</div>

				<span
					onClick={() => toggleTodo(todo.id)}
					className={`flex-1 overflow-hidden text-ellipsis ${isPreview ? 'whitespace-nowrap' : 'whitespace-nowrap'} cursor-pointer ${
						isPreview ? 'text-xs' : 'text-sm'
					} ${getTextStyle()}`}
				>
					{todo.text}
				</span>

				{/* Actions */}
				<div className="flex items-center">
					<button
						onClick={() => setExpanded(!expanded)}
						className={`p-1 rounded-full cursor-pointer hover:bg-gray-500/10 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}
					>
						{expanded ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
					</button>

					<button
						onClick={() => deleteTodo(todo.id)}
						className={`p-1 rounded-full cursor-pointer hover:bg-red-500/10 transition-opacity opacity-0 group-hover:opacity-100 ${
							theme === 'light' ? 'text-red-500' : 'text-red-400'
						}`}
					>
						<FiTrash2 size={14} />
					</button>
				</div>
			</div>

			<AnimatePresence>
				{expanded && !isPreview && (
					<motion.div
						className={`px-3 pb-2 text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: 'auto' }}
						exit={{ opacity: 0, height: 0 }}
					>
						<p className="mt-1 mb-2 break-words">{todo.text}</p>

						<div className="flex items-center gap-2 mt-1 mb-2">
							{todo.category && (
								<span
									className={`text-xs px-1.5 py-0.5 rounded-full ${getPriorityColor()}`}
								>
									{todo.category}
								</span>
							)}
							<span
								className={`text-xs px-1.5 py-0.5 rounded-full ${getPriorityColor()}`}
							>
								{translatedPriority[todo.priority]}
							</span>
						</div>

						{/* Notes */}
						{todo.notes && <p className="mt-1 font-light">{todo.notes}</p>}
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	)
}
