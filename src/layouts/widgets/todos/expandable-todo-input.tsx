import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState, useCallback } from 'react'
import { FiMessageSquare, FiPlus, FiTag, FiCalendar } from 'react-icons/fi'
import { Button } from '@/components/button/button'
import { TextInput } from '@/components/text-input'
import { type AddTodoInput, TodoPriority } from '@/context/todo.context'
import { useIsMutating } from '@tanstack/react-query'
import { IconLoading } from '@/components/loading/icon-loading'
import { ClickableTooltip } from '@/components/clickableTooltip'
import type jalaliMoment from 'jalali-moment'
import { DatePicker } from '@/components/date-picker/date-picker'
import { PRIORITY_OPTIONS } from '@/common/constant/priority_options'
import { PriorityButton } from '@/components/priority-options/priority-options'
import Analytics from '@/analytics'
import { Chip } from '@/components/chip.component'
import { useGetTags } from '@/services/hooks/todo/get-tags.hook'
import { useAuth } from '@/context/auth.context'

interface ExpandableTodoInputProps {
	todoText: string
	onChangeTodoText: (value: string) => void
	onAddTodo: (input: Omit<AddTodoInput, 'date'> & { date?: string }) => void
}

export function ExpandableTodoInput({
	todoText,
	onChangeTodoText,
	onAddTodo,
}: ExpandableTodoInputProps) {
	const { isAuthenticated } = useAuth()
	const [isExpanded, setIsExpanded] = useState(false)
	const [priority, setPriority] = useState<TodoPriority>(TodoPriority.Medium)
	const [category, setCategory] = useState('')
	const { data: fetchedTags } = useGetTags(isAuthenticated)
	const [notes, setNotes] = useState('')
	const [isTagTooltipOpen, setIsTagTooltipOpen] = useState(false)
	const [selectedDate, setSelectedDate] = useState<jalaliMoment.Moment | undefined>()
	const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
	const inputRef = useRef<HTMLInputElement | null>(null)
	const containerRef = useRef<HTMLDivElement>(null)
	const datePickerButtonRef = useRef<HTMLButtonElement>(null)
	const categoryInputRef = useRef<HTMLInputElement | null>(null)
	const isAdding = useIsMutating({ mutationKey: ['addTodo'] }) > 0

	const onSelectCategory = (tag: string) => {
		setCategory(tag)
		setIsTagTooltipOpen(false)
		Analytics.event('todo_category_select')
	}

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target as Node) &&
				isExpanded
			) {
				const isClickInsideDatePicker =
					event.target instanceof Element &&
					(event.target.closest('[data-date-picker]') ||
						event.target.closest('.fixed') ||
						event.target.closest('[role="tooltip"]'))

				if (!todoText.trim() && !isClickInsideDatePicker) {
					setIsExpanded(false)
				}
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [isExpanded, todoText])

	const handleInputFocus = useCallback(() => {
		setIsExpanded(true)
	}, [])

	const resetForm = useCallback(() => {
		onChangeTodoText('')
		setCategory('')
		setNotes('')
		setPriority(TodoPriority.Medium)
		setSelectedDate(undefined)
		setIsExpanded(false)
	}, [onChangeTodoText])

	const handleAddTodo = useCallback(() => {
		if (todoText.trim()) {
			onAddTodo({
				text: todoText.trim(),
				category: category.trim() || undefined,
				notes: notes.trim() || undefined,
				priority: priority,
				date: selectedDate?.add(3.5, 'hours').toISOString(),
			})
			resetForm()
		}
	}, [todoText, category, notes, priority, selectedDate, onAddTodo, resetForm])

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.key === 'Enter' && todoText.trim()) {
				handleAddTodo()
			}
		},
		[todoText, handleAddTodo]
	)

	const onClickOpenDatePicker = () => {
		setIsDatePickerOpen(!isDatePickerOpen)
		Analytics.event('todo_datepicker_open_click')
	}

	return (
		<div ref={containerRef} className="flex-none pt-3 mt-auto">
			<div className="overflow-hidden rounded-xl">
				<div className="flex items-center gap-1 p-2 rounded-xl bg-base-300">
					<div className="flex-grow w-full">
						<TextInput
							ref={inputRef}
							value={todoText}
							onChange={onChangeTodoText}
							placeholder="عنوان وظیفه جدید..."
							className="!h-6 !border-none !outline-none !shadow-none !ring-0 w-full p-0 text-sm !rounded-lg !bg-transparent"
							onFocus={handleInputFocus}
							onKeyDown={handleKeyDown}
							id="expandable-todo-input"
							debounce={false}
						/>
					</div>
					<Button
						onClick={handleAddTodo}
						disabled={!todoText.trim() || isAdding}
						loading={isAdding}
						loadingText={<IconLoading />}
						size="sm"
						isPrimary={true}
						rounded="lg"
						className="p-1.5 h-7 !bg-none"
					>
						<FiPlus size={16} />
					</Button>
				</div>

				<AnimatePresence>
					{isExpanded && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: 'auto' }}
							exit={{ opacity: 0, height: 0 }}
							transition={{ duration: 0.2 }}
						>
							<div className="px-2 py-3 space-y-3">
								<div className="flex items-center justify-between gap-2">
									<div className="flex items-center flex-1 gap-2 ">
										<div
											className="relative flex-shrink-0 text-center"
											onClick={() => onClickOpenDatePicker()}
										>
											<span className="absolute w-2 h-2 rounded-full -left-0.5 -bottom-0.5 bg-error animate-pulse"></span>
											<FiCalendar
												className="text-indigo-400"
												size={16}
											/>
										</div>
										<div className="flex-1">
											<button
												ref={datePickerButtonRef}
												onClick={() => onClickOpenDatePicker()}
												className="w-full  text-right px-2 py-1.5 min-h-8 text-xs  rounded-xl border border-base-300 hover:border-primary/50 transition-colors bg-content text-content opacity-75 cursor-pointer"
											>
												{selectedDate
													? selectedDate.format(
															'dddd، jD jMMMM jYYYY'
														)
													: 'انتخاب تاریخ'}
											</button>
											<ClickableTooltip
												triggerRef={datePickerButtonRef}
												isOpen={isDatePickerOpen}
												setIsOpen={setIsDatePickerOpen}
												content={
													<DatePicker
														onDateSelect={(date) => {
															setSelectedDate(date)
															setIsDatePickerOpen(false)
														}}
														selectedDate={selectedDate}
													/>
												}
												contentClassName="!p-0 !bg-transparent !border-none !shadow-none"
											/>
										</div>
									</div>

									<div className="flex items-center gap-1">
										{PRIORITY_OPTIONS.map((option) => (
											<PriorityButton
												key={option.value}
												option={option}
												isSelected={priority === option.value}
												onClick={() =>
													setPriority(
														option.value as TodoPriority
													)
												}
											/>
										))}
									</div>
								</div>

								<div className="space-y-2">
									<div className="flex items-center gap-3">
										<div className="flex-shrink-0 text-center">
											<FiTag
												className="text-indigo-400"
												size={16}
											/>
										</div>
										<TextInput
											ref={categoryInputRef}
											type="text"
											value={category}
											onChange={onSelectCategory}
											onFocus={() => setIsTagTooltipOpen(true)}
											placeholder="دسته‌بندی (مثال: شخصی، کاری)"
											className="text-xs placeholder:text-xs py-1.5"
											debounce={false}
										/>
										<ClickableTooltip
											triggerRef={categoryInputRef}
											isOpen={isTagTooltipOpen}
											setIsOpen={setIsTagTooltipOpen}
											content={
												<div className="flex flex-wrap gap-1 overflow-x-hidden overflow-y-auto max-w-48 max-h-32 scrollbar-none">
													{fetchedTags
														?.filter((tag) => tag.trim())
														?.map((tag) => (
															<Chip
																key={tag}
																selected={false}
																onClick={() => {
																	setCategory(tag)
																	setIsTagTooltipOpen(
																		false
																	)
																}}
																className="text-xs w-fit p-0! py-1! px-3!"
															>
																{tag}
															</Chip>
														))}
												</div>
											}
											position="top"
										/>
									</div>

									<div className="flex items-center gap-3">
										<div className="flex-shrink-0 text-center">
											<FiMessageSquare
												className="text-indigo-400"
												size={16}
											/>
										</div>
										<TextInput
											value={notes}
											onChange={setNotes}
											placeholder="یادداشت یا لینک (اختیاری)"
											className="text-xs placeholder:text-xs py-1.5"
											debounce={false}
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
