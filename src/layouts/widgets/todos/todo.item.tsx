import CustomCheckbox from '@/components/checkbox'
import { getTextColor, getWidgetItemBackground, useTheme } from '@/context/theme.context'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { FiChevronDown, FiChevronUp, FiTrash2 } from 'react-icons/fi'
import type { Todo } from '../calendar/interface/todo.interface'

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

	const getTextStyle = () => {
		if (todo.completed) {
			return `line-through ${getTextColor(theme)} opacity-50`
		}
		return getTextColor(theme)
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
			className={`overflow-hidden transition-all duration-200 rounded-lg border-r-2 ${getBorderStyle()} ${getWidgetItemBackground(theme)} group ${blurMode ? 'blur-item' : ''}`}
			initial={{ opacity: 0, y: 5 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, height: 0 }}
			transition={{ duration: 0.2 }}
		>
			<div className={`flex items-center gap-1.5 pr-1.5 ${isPreview ? 'p-1' : 'p-1.5'}`}>
				<div className="flex-shrink-0">
					<CustomCheckbox checked={todo.completed} onChange={() => toggleTodo(todo.id)} />
				</div>

				<span
					onClick={() => toggleTodo(todo.id)}
					className={`flex-1 overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer ${
						isPreview ? 'text-[10px]' : 'text-xs'
					} ${getTextStyle()}`}
				>
					{todo.text}
				</span>

				{/* Actions */}
				<div className="flex items-center">
					<button
						onClick={() => setExpanded(!expanded)}
						className={`p-0.5 rounded-full cursor-pointer hover:bg-gray-500/10 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}
					>
						{expanded ? <FiChevronUp size={12} /> : <FiChevronDown size={12} />}
					</button>

					<button
						onClick={() => deleteTodo(todo.id)}
						className={`p-0.5 rounded-full cursor-pointer hover:bg-red-500/10 transition-opacity opacity-0 group-hover:opacity-100 ${
							theme === 'light' ? 'text-red-500' : 'text-red-400'
						}`}
					>
						<FiTrash2 size={12} />
					</button>
				</div>
			</div>

			<AnimatePresence>
				{expanded && !isPreview && (
					<motion.div
						className={`px-2 pb-1.5 text-[10px] ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: 'auto' }}
						exit={{ opacity: 0, height: 0 }}
					>
						<p className="mt-0.5 mb-1 break-words">{todo.text}</p>

						<div className="flex items-center gap-1.5 mt-0.5 mb-1">
							{todo.category && (
								<span
									className={`text-[10px] px-1 py-0.25 rounded-full ${getPriorityColor()}`}
								>
									{todo.category}
								</span>
							)}
							<span
								className={`text-[10px] px-1 py-0.25 rounded-full ${getPriorityColor()}`}
							>
								{translatedPriority[todo.priority]}
							</span>
						</div>

						{/* Notes */}
						{todo.notes && <p className="mt-0.5 font-light">{todo.notes}</p>}
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	)
}
