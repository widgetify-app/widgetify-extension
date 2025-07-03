import CustomCheckbox from '@/components/checkbox'
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
				return '!border-error'
			case 'medium':
				return '!border-warning'
			case 'low':
				return '!border-success'
			default:
				return '!border-primary'
		}
	}

	const getPriorityColor = () => {
		switch (todo.priority) {
			case 'high':
				return 'bg-error/10 text-error'
			case 'medium':
				return 'bg-warning/10 text-warning'
			case 'low':
				return 'bg-success/10 text-success'
			default:
				return 'bg-primary text-primary-content'
		}
	}
	return (
		<div
			className={`overflow-hidden rounded-lg transition delay-150 duration-300 ease-in-out bg-content group ${blurMode ? 'blur-item' : ''}`}
		>
			<div className={'flex items-center gap-1.5 pr-1.5 p-1.5'}>
				<div className="flex-shrink-0">
					<CustomCheckbox
						checked={todo.completed}
						onChange={() => toggleTodo(todo.id)}
						className={`!border ${getBorderStyle()}`}
					/>
				</div>

				<span
					onClick={() => toggleTodo(todo.id)}
					className={`flex-1 overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer text-xs ${todo.completed ? 'line-through text-content opacity-50' : 'text-content'}`}
				>
					{todo.text}
				</span>

				{/* Actions */}
				<div className="flex items-center gap-x-1">
					<button
						onClick={() => deleteTodo(todo.id)}
						className={
							'p-1 rounded-full cursor-pointer hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all duration-200 delay-100 group-hover:select-none text-red-400'
						}
					>
						<FiTrash2 size={13} />
					</button>

					<button
						onClick={() => setExpanded(!expanded)}
						className={
							'p-1 rounded-full cursor-pointer hover:bg-gray-500/10 text-gray-400'
						}
					>
						<FiChevronDown
							size={14}
							className={`${expanded ? 'rotate-0' : 'rotate-180'} transition-transform duration-300`}
						/>
					</button>
				</div>
			</div>{' '}
			{expanded && (
				<div className={'px-2 pb-1.5 text-[10px] text-content transition-all'}>
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
				</div>
			)}
		</div>
	)
}
