import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState, useCallback } from 'react'
import { Button } from '@/components/button/button'
import { TextInput } from '@/components/text-input'
import { type AddTodoInput, TodoPriority } from '@/context/todo.context'
import { useIsMutating } from '@tanstack/react-query'
import { IconLoading } from '@/components/loading/icon-loading'
import { ClickableTooltip } from '@/components/clickableTooltip'
import type jalaliMoment from 'jalali-moment'
import Analytics from '@/analytics'
import { Chip } from '@/components/chip.component'
import { useGetTags } from '@/services/hooks/todo/get-tags.hook'
import { useAuth } from '@/context/auth.context'
import { useDate } from '@/context/date.context'
import { IoCalendarOutline, IoPricetagOutline, IoAddOutline } from 'react-icons/io5'
import { DatePicker } from '@/components/date-picker/date-picker'
import { PriorityDropdown } from './components/priority.dropdown'
import { FiPlus } from 'react-icons/fi'
interface ExpandableTodoInputProps {
	onAddTodo: (input: Omit<AddTodoInput, 'date'> & { date: string }) => void
}

export function ExpandableTodoInput({ onAddTodo }: ExpandableTodoInputProps) {
	const { isAuthenticated } = useAuth()
	const { today } = useDate()
	const [isExpanded, setIsExpanded] = useState(false)
	const [priority, setPriority] = useState<TodoPriority | undefined>(undefined)
	const [category, setCategory] = useState('')
	const { data: fetchedTags } = useGetTags(isAuthenticated && isExpanded)
	const [isTagTooltipOpen, setIsTagTooltipOpen] = useState(false)
	const [selectedDate, setSelectedDate] = useState<jalaliMoment.Moment>(today)
	const [showDatePicker, setShowDatePicker] = useState(false)

	const inputRef = useRef<HTMLInputElement | null>(null)
	const todoTextRef = useRef<string>('')
	const notesRef = useRef<HTMLTextAreaElement>(null)
	const containerRef = useRef<HTMLDivElement>(null)
	const dateButtonRef = useRef<HTMLButtonElement>(null)
	const categoryInputRef = useRef<HTMLInputElement | null>(null)
	const notesInputRef = useRef<HTMLInputElement | null>(null)

	const isAdding = useIsMutating({ mutationKey: ['addTodo'] }) > 0

	const handleTodoTextChange = useCallback((value: string) => {
		todoTextRef.current = value
	}, [])

	const onSelectCategory = (v: string) => {
		setCategory(v)
		setIsTagTooltipOpen(false)
		Analytics.event('todo_category_select')
	}

	const handleNotesChange = useCallback((value: string) => {
		if (notesRef.current) notesRef.current.value = value
	}, [])

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

				if (!todoTextRef.current.trim() && !isClickInsideDatePicker) {
					setIsExpanded(false)
				}
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [isExpanded])

	const handleInputFocus = useCallback(() => {
		setIsExpanded(true)
	}, [])

	const resetForm = useCallback(() => {
		todoTextRef.current = ''
		if (notesRef.current) notesRef.current.value = ''
		if (inputRef.current) {
			inputRef.current.value = ''
		}
		if (notesInputRef.current) {
			notesInputRef.current.value = ''
		}
		setIsTagTooltipOpen(false)
		setCategory('')
		setPriority(undefined)
		setSelectedDate(today.clone())
		setIsExpanded(false)
	}, [today])

	const handleAddTodo = useCallback(() => {
		const text = todoTextRef.current.trim()
		if (text) {
			onAddTodo({
				text,
				category: category.trim() || undefined,
				notes: notesRef.current?.value.trim() || undefined,
				priority: priority,
				date: selectedDate.toISOString(),
			})
			resetForm()
		}
	}, [category, priority, selectedDate, onAddTodo, resetForm])

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.key === 'Enter' && todoTextRef.current.trim()) {
				handleAddTodo()
			}
		},
		[handleAddTodo]
	)

	return (
		<div ref={containerRef} className="flex-none pt-3 mt-auto">
			<div
				className={`overflow-hidden transition-shadow ${isExpanded ? 'shadow-2xl' : ''} rounded-xl`}
			>
				<div className="flex items-center gap-1 p-2 border rounded-3xl bg-base-200 border-base-content/5">
					<div className="flex-grow w-full">
						<TextInput
							ref={inputRef}
							defaultValue=""
							onChange={handleTodoTextChange}
							placeholder="عنوان وظیفه جدید..."
							className="!h-6 !border-none !outline-none !shadow-none !ring-0 w-full p-0 pr-1 text-sm !bg-transparent rounded-2xl focus:placeholder:text-base-content/20"
							onFocus={handleInputFocus}
							onKeyDown={handleKeyDown}
							id="expandable-todo-input"
							debounce={false}
						/>
					</div>
					<Button
						onClick={handleAddTodo}
						disabled={isAdding}
						loading={isAdding}
						loadingText={<IconLoading />}
						size="sm"
						isPrimary={true}
						className="rounded-full px-0! w-8"
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
							<div className="px-2 py-2">
								<div className="flex flex-col gap-1">
									<div>
										<textarea
											ref={notesRef}
											onChange={(e) =>
												handleNotesChange(e.target.value)
											}
											placeholder="توضیحات بیشتر یا لینک اضافه کنید..."
											className="w-full px-4 py-2 text-xs leading-relaxed transition-all outline-none resize-none rounded-2xl min-h-28 focus:placeholder:text-base-content/20 text-base-content/60"
										/>
									</div>
									<div className="flex gap-1">
										<Button
											size="sm"
											className={`p-2 border rounded-xl text-base-content/40 shrink-0 active:scale-95`}
											onClick={() => setShowDatePicker(true)}
											ref={dateButtonRef}
										>
											<IoCalendarOutline size={18} />
										</Button>
										<PriorityDropdown
											priority={priority}
											setPriority={setPriority}
										/>
										<Button
											size="sm"
											className={`p-2 border rounded-xl  text-[10px]  text-muted shrink-0 active:scale-95`}
											ref={categoryInputRef}
											onClick={() => setIsTagTooltipOpen(true)}
										>
											<IoPricetagOutline
												size={16}
												className="text-base-content/40 "
											/>
											<p className="truncate max-w-14 min-w-5">
												{category || 'دسته‌بندی'}
											</p>
										</Button>
									</div>
								</div>
								<ClickableTooltip
									isOpen={isTagTooltipOpen}
									triggerRef={categoryInputRef}
									position="top"
									contentClassName={`!p-2 !max-w-none`}
									setIsOpen={setIsTagTooltipOpen}
									content={
										<div className="flex flex-col w-56 gap-2">
											<div className="flex flex-row items-center gap-1 border-b-2 border-content">
												<TextInput
													value={category}
													onChange={(val) => setCategory(val)}
													placeholder="مثلا: کارهای خونه"
												/>
												<Button
													size="xs"
													isPrimary={true}
													className="rounded-full p-0! w-8 h-8"
													onClick={() =>
														setIsTagTooltipOpen(false)
													}
												>
													<IoAddOutline size={18} />
												</Button>
											</div>
											<div className="flex flex-wrap w-full gap-1 overflow-x-hidden overflow-y-auto max-h-32 scrollbar-none">
												{fetchedTags
													?.filter((tag) => tag.trim())
													?.map((tag) => (
														<Chip
															key={tag}
															selected={false}
															onClick={() =>
																onSelectCategory(tag)
															}
															className="flex gap-1 text-xs px-2! py-1!e"
														>
															<IoPricetagOutline
																size={16}
																className="text-base-content/40"
															/>
															{tag}
														</Chip>
													))}
											</div>
										</div>
									}
								/>
								<ClickableTooltip
									triggerRef={dateButtonRef}
									isOpen={showDatePicker}
									setIsOpen={setShowDatePicker}
									position="top"
									contentClassName="!p-1 !max-w-none shadow-2xl border border-base-200 rounded-3xl"
									content={
										<DatePicker
											selectedDate={selectedDate}
											onDateSelect={(date) => {
												setSelectedDate(date)
												setShowDatePicker(false)
											}}
										/>
									}
								/>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	)
}
