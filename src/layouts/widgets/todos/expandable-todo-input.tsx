import Analytics from '@/analytics'
import { Button } from '@/components/button/button'
import { TextInput } from '@/components/text-input'
import Tooltip from '@/components/toolTip'
import { type AddTodoInput, TodoPriority } from '@/context/todo.context'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { FiFlag, FiMessageSquare, FiPlus, FiTag } from 'react-icons/fi'

interface ExpandableTodoInputProps {
	todoText: string
	onChangeTodoText: (value: string) => void
	onAddTodo: (input: Omit<AddTodoInput, 'date'>) => void
}

const PrIORITY_OPTIONS = [
	{
		value: 'low',
		ariaLabel: 'اولویت کم',
		bgColor: 'bg-green-500',
		hoverBgColor: 'hover:bg-green-600',
	},
	{
		value: 'medium',
		ariaLabel: 'اولویت متوسط',
		bgColor: 'bg-yellow-400',
		hoverBgColor: 'hover:bg-yellow-400',
	},
	{
		value: 'high',
		ariaLabel: 'اولویت زیاد',
		bgColor: 'bg-red-500',
		hoverBgColor: 'hover:bg-red-500',
	},
]

export function ExpandableTodoInput({
	todoText,
	onChangeTodoText,
	onAddTodo,
}: ExpandableTodoInputProps) {
	const [isExpanded, setIsExpanded] = useState(false)
	const [priority, setPriority] = useState<TodoPriority>(TodoPriority.Medium)
	const [category, setCategory] = useState('')
	const [notes, setNotes] = useState('')
	const inputRef = useRef<HTMLInputElement | null>(null)
	const containerRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target as Node) &&
				isExpanded
			) {
				if (!todoText.trim()) {
					setIsExpanded(false)
				}
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [isExpanded, todoText])

	const handleInputFocus = () => {
		setIsExpanded(true)
	}

	const handleAddTodo = () => {
		if (todoText.trim()) {
			onAddTodo({
				text: todoText.trim(),
				category: category.trim() || undefined,
				notes: notes.trim() || undefined,
				priority: priority,
			})
			Analytics.featureUsed('todo_added')
			resetForm()
		}
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' && todoText.trim()) {
			handleAddTodo()
		}
	}

	const resetForm = () => {
		onChangeTodoText('')
		setCategory('')
		setNotes('')
		setPriority(TodoPriority.Medium)
		setIsExpanded(false)
	}

	return (
		<div ref={containerRef} className="flex-none pt-2 mt-auto">
			<div
				className={`rounded-lg overflow-hidden  ${
					isExpanded ? 'border border-content' : ''
				}`}
			>
				<div className="flex items-center gap-1 p-2">
					<div className="flex-grow w-full">
						<TextInput
							ref={inputRef}
							value={todoText}
							onChange={onChangeTodoText}
							placeholder="عنوان وظیفه جدید..."
							className="w-full py-1.5 text-sm !rounded-lg"
							onFocus={handleInputFocus}
							onKeyDown={handleKeyDown}
							id="expandable-todo-input"
						/>
					</div>{' '}
					<div className="flex flex-col items-center flex-shrink-0  gap-0.5">
						<Button
							onClick={handleAddTodo}
							disabled={!todoText.trim()}
							size="md"
							isPrimary={true}
							rounded="md"
							className="p-2"
						>
							<FiPlus size={16} />
						</Button>
					</div>
				</div>

				<AnimatePresence>
					{isExpanded && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: 'auto' }}
							exit={{ opacity: 0, height: 0 }}
							transition={{ duration: 0.2 }}
						>
							<div className="px-3 pb-3 space-y-3">
								<div>
									<label
										className={
											'block mb-1 text-xs font-medium text-content'
										}
									>
										اولویت
									</label>
									<div className="flex items-center gap-3">
										{PrIORITY_OPTIONS.map(
											({
												value,
												ariaLabel,
												bgColor,
												hoverBgColor,
											}) => (
												<Tooltip content={ariaLabel} key={value}>
													<button
														key={value}
														type="button"
														onClick={() =>
															setPriority(
																value as TodoPriority
															)
														}
														className={`
													flex items-center justify-center w-4 h-4 rounded-full
													transition-all duration-150 cursor-pointer 
													${bgColor} ${hoverBgColor}
													${priority === value ? 'ring-2  ring-offset-0  ring-primary' : ''}
												`}
													>
														{priority === value && (
															<FiFlag
																size={8}
																className="text-white"
															/>
														)}
													</button>
												</Tooltip>
											)
										)}
									</div>
								</div>{' '}
								<div className="mt-2 space-y-2">
									<div className="flex items-center gap-2">
										<div className="flex-shrink-0 w-5 text-center">
											<FiTag className="text-indigo-400" />
										</div>
										<TextInput
											type="text"
											value={category}
											onChange={(value) => setCategory(value)}
											placeholder="دسته‌بندی (مثال: شخصی، کاری)"
											className="text-xs py-1.5"
										/>
									</div>

									<div className="flex items-start gap-2">
										<div className="flex-shrink-0 w-5 mt-2 text-center">
											<FiMessageSquare className="text-indigo-400" />
										</div>
										<TextInput
											value={notes}
											onChange={(value) => setNotes(value)}
											placeholder="یادداشت یا توضیحات تکمیلی..."
											className="text-xs py-1.5"
										/>
									</div>
								</div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	)
}
