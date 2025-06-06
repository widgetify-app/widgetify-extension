import CustomCheckbox from '@/components/checkbox'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { FiChevronDown, FiChevronUp, FiTrash2 } from 'react-icons/fi'
import type { Todo } from '../calendar/interface/todo.interface'

interface Prop {
	todo: Todo
	toggleTodo: (id: string) => void
	deleteTodo: (id: string) => void
	blurMode?: boolean
}

const translatedPriority = {
	low: 'کم',
	medium: 'متوسط',
	high: 'زیاد',
}

export function TodoItem({ todo, deleteTodo, toggleTodo, blurMode = false }: Prop) {
	const [expanded, setExpanded] = useState(false)

	const getBorderStyle = () => {
		switch (todo.priority) {
			case 'high':
				return 'border-error'
			case 'medium':
				return 'border-warning'
			case 'low':
				return 'border-success'
			default:
				return 'border-primary'
		}
	}

	const getPriorityColor = () => {
		switch (todo.priority) {
			case 'high':
				return 'bg-error text-error-content'
			case 'medium':
				return 'bg-warning text-warning-content'
			case 'low':
				return 'bg-success text-success-content'
			default:
				return 'bg-primary text-primary-content'
		}
	}

	return (
		<motion.div
			className={`overflow-hidden transition-all duration-200 rounded-lg border-r-2 ${getBorderStyle()} bg-content group ${blurMode ? 'blur-item' : ''}`}
			initial={{ opacity: 0, y: 5 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, height: 0 }}
			transition={{ duration: 0.2 }}
		>
			<div className={'flex items-center gap-1.5 pr-1.5 p-1.5'}>
				<div className="flex-shrink-0">
					<CustomCheckbox
						checked={todo.completed}
						onChange={() => toggleTodo(todo.id)}
					/>
				</div>

				<span
					onClick={() => toggleTodo(todo.id)}
					className={`flex-1 overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer text-xs ${todo.completed ? 'line-through text-content opacity-50' : 'text-content'}`}
				>
					{todo.text}
				</span>

				{/* Actions */}
				<div className="flex items-center">
					<button
						onClick={() => setExpanded(!expanded)}
						className={
							'p-0.5 rounded-full cursor-pointer hover:bg-gray-500/10 text-gray-400'
						}
					>
						{expanded ? (
							<FiChevronUp size={12} />
						) : (
							<FiChevronDown size={12} />
						)}
					</button>

					<button
						onClick={() => deleteTodo(todo.id)}
						className={
							'p-0.5 rounded-full cursor-pointer hover:bg-red-500/10 transition-opacity opacity-0 group-hover:opacity-100 text-red-400'
						}
					>
						<FiTrash2 size={12} />
					</button>
				</div>
			</div>

			<AnimatePresence>
				{expanded && (
					<motion.div
						className={'px-2 pb-1.5 text-[10px] text-content'}
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
							<span>{todo.date}</span>
						</div>

						{/* Notes */}
						{todo.notes && <p className="mt-0.5 font-light">{todo.notes}</p>}
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	)
}
