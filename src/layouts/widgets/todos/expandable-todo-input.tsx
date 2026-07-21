import { Motion as motion, Presence } from '@/common/motion'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Button } from '@/components/button/button'
import { TextInput } from '@/components/text-input'
import { IconLoading } from '@/components/loading/icon-loading'
import { ClickableTooltip } from '@/components/clickableTooltip'
import jalaliMoment from 'jalali-moment'
import Analytics from '@/analytics'
import { Chip } from '@/components/chip.component'
import { useGetTags } from '@/services/hooks/todo/get-tags.hook'
import { useAuth } from '@/context/auth.context'
import { useDate } from '@/context/date.context'
import { DatePicker } from '@/components/date-picker/date-picker'
import { PriorityDropdown } from './components/priority.dropdown'
import type { FetchedTodo, TodoPriority } from '@/services/hooks/todo/todo.interface'
import { type TodoCreationPayload, useAddTodo } from '@/services/hooks/todo/add-todo.hook'
import { useUpdateTodo } from '@/services/hooks/todo/update-todo.hook'
import { translateError } from '@/utils/translate-error'
import { showToast } from '@/common/toast'
import type { Friend } from '@/services/hooks/friends/friendService.hook'
import { TodoSelectFriends } from './components/select-friends.todo'
import { callEvent } from '@/common/utils/call-event'
import { twMerge } from 'tailwind-merge'
import { Icon } from '@/src/icons'
interface ExpandableTodoInputProps {
	editTodo?: FetchedTodo
	onClose: any
	isEdit: boolean
	onUpdated?: () => void
	className?: string
	transparentInput?: boolean
}
const getTodayJalaliMoment = () => jalaliMoment().locale('fa')
const formatJalaliDateForDisplay = (date: jalaliMoment.Moment) => date.format('jD jMMM')
export function ExpandableTodoInput({
	editTodo,
	onClose,
	isEdit,
	onUpdated,
	className,
	transparentInput,
}: ExpandableTodoInputProps) {
	const { isAuthenticated } = useAuth()
	const { mutateAsync: addTodoAsync, isPending: isCreatingTodo } = useAddTodo()
	const { mutateAsync: updateTodoAsync, isPending: isUpdatingTodo } = useUpdateTodo(
		editTodo?.id || null
	)
	const { today } = useDate()
	const [isExpanded, setIsExpanded] = useState(false)
	const [priority, setPriority] = useState<TodoPriority | undefined>(undefined)
	const [category, setCategory] = useState('')
	const { data: fetchedTags } = useGetTags(isAuthenticated && isExpanded)
	const [isTagTooltipOpen, setIsTagTooltipOpen] = useState(false)
	const [selectedDate, setSelectedDate] = useState<jalaliMoment.Moment>(today)
	const [showDatePicker, setShowDatePicker] = useState(false)

	const inputRef = useRef<HTMLInputElement | null>(null)
	const notesRef = useRef<HTMLTextAreaElement>(null)
	const containerRef = useRef<HTMLDivElement>(null)
	const dateButtonRef = useRef<HTMLButtonElement>(null)
	const categoryInputRef = useRef<HTMLInputElement | null>(null)
	const notesInputRef = useRef<HTMLInputElement | null>(null)
	const [selectedFriends, setSelectedFriends] = useState<Friend[]>([])

	const isPending = isCreatingTodo || isUpdatingTodo

	const handleTodoTextChange = useCallback((value: string) => {
		if (inputRef.current) inputRef.current.value = value
	}, [])

	useEffect(() => {
		if (isEdit && editTodo) {
			if (inputRef.current) {
				inputRef.current.value = editTodo.text || ''
			}

			setCategory(editTodo.category || '')
			setPriority(editTodo.priority)

			if (editTodo.date) {
				const parsedDate = jalaliMoment(
					editTodo.date,
					'dddd، jD jMMMM jYYYY'
				).locale('fa')
				if (!parsedDate.isValid()) {
					setSelectedDate(
						jalaliMoment(editTodo.date).isValid()
							? jalaliMoment(editTodo.date).locale('fa')
							: getTodayJalaliMoment()
					)
				} else {
					setSelectedDate(parsedDate)
				}
			}
			if (editTodo.friends && editTodo.friends.length > 0) {
				// Load friends if editing
				const friends: any[] = editTodo.friends.map((f) => ({
					user: {
						name: f.name,
						avatar: f.avatar,
						userId: null,
					},
					status: 'ACCEPTED' as const,
				}))
				setSelectedFriends(friends)
			}

			setIsExpanded(true)
			setTimeout(() => {
				if (notesRef.current) notesRef.current.value = editTodo.description || ''
			}, 2)
		} else {
			resetForm()
		}
	}, [editTodo])

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
			if (isEdit) return
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

				if (!inputRef.current?.value.trim() && !isClickInsideDatePicker) {
					setIsExpanded(false)
					resetForm()
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
		setSelectedFriends([])
	}, [today])

	const handleSave = useCallback(async () => {
		if (!isAuthenticated) {
			callEvent('openProfile')
			return
		}
		const text = inputRef.current?.value?.trim()
		if (text) {
			try {
				const payload: TodoCreationPayload = {
					text,
					category: category.trim() || undefined,
					description: notesRef.current?.value.trim(),
					priority: priority,
					date: selectedDate.add(3.5, 'hours').toISOString(),
					friendIds: selectedFriends.map((f) => f.id), // Add friend IDs
				}

				if (isEdit && editTodo?.id) {
					await updateTodoAsync({ id: editTodo.id, input: payload })
				} else {
					await addTodoAsync({ ...payload, completed: false, order: 0 })
				}

				resetForm()
				if (isEdit) {
					setIsExpanded(false)
				}
				onUpdated?.()
				onClose()
			} catch (error) {
				const errorContent = translateError(error)
				showToast(errorContent as string, 'error')
			}
		}
	}, [
		category,
		priority,
		selectedDate,
		resetForm,
		isEdit,
		isAuthenticated,
		selectedFriends,
	])

	const onCloseEdit = () => {
		resetForm()
		setIsExpanded(false)
		onClose()
	}

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.key === 'Enter' && inputRef?.current?.value.trim()) {
				handleSave()
			}
		},
		[handleSave]
	)

	return (
		<div ref={containerRef} className={twMerge('flex-none pt-3 mt-auto', className)}>
			<div
				className={`overflow-hidden transition-shadow ${isExpanded ? 'shadow-2xl' : ''} rounded-xl`}
			>
				<div className="flex items-center gap-1 p-2 border rounded-3xl bg-base-200 border-base-content/5">
					<div className="w-full grow">
						<TextInput
							ref={inputRef}
							defaultValue=""
							onChange={handleTodoTextChange}
							placeholder="عنوان تسک جدید..."
							className="h-6! border-none! outline-none! shadow-none! ring-0! w-full p-0 pr-1 text-sm bg-transparent! rounded-2xl focus:placeholder:text-base-content/20"
							onFocus={handleInputFocus}
							onKeyDown={handleKeyDown}
							id="expandable-todo-input"
							debounce={false}
						/>
					</div>
					<div className="flex items-center">
						{isEdit && (
							<Button
								onClick={() => onCloseEdit()}
								disabled={isPending}
								loading={isPending}
								size="sm"
								className="rounded-full px-0! w-8 btn-ghost"
							>
								<Icon name="close" size={12} className="" />
							</Button>
						)}
						<Button
							onClick={() => handleSave()}
							disabled={isPending}
							loading={isPending}
							loadingText={<IconLoading />}
							size="sm"
							isPrimary={true}
							className="rounded-full px-0! w-8"
						>
							{isEdit ? (
								<Icon name="save" size={16} />
							) : (
								<Icon name="plus" size={16} />
							)}
						</Button>
					</div>
				</div>

				<Presence mode="wait">
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
											className={twMerge(
												'w-full px-4 py-2 text-xs leading-relaxed transition-all outline-none resize-none rounded-2xl min-h-28 focus:placeholder:text-base-content/20 text-base-content/60',
												`${transparentInput ? 'bg-transparent!' : 'bg-base-200! focus:ring-primary'} border-none! shadow-none!`
											)}
										/>
									</div>
									<div className="flex pl-1 gap-0.5 overflow-x-auto">
										{!isEdit && isAuthenticated && (
											<TodoSelectFriends
												selectedFriends={selectedFriends}
												setSelectedFriends={(fList: Friend[]) => {
													setSelectedFriends(fList)
												}}
											/>
										)}
										<PriorityDropdown
											priority={priority}
											setPriority={setPriority}
										/>
										<Button
											size="sm"
											className={`p-2 border rounded-xl text-base-content/40 shrink-0 active:scale-95`}
											onClick={() => setShowDatePicker(true)}
											ref={dateButtonRef}
										>
											<Icon name="calendarDays" size={18} />
											<p className="truncate max-w-14 min-w-5">
												{selectedDate
													? formatJalaliDateForDisplay(
															selectedDate
														)
													: 'تاریخ انجامش'}
											</p>
										</Button>
										<Button
											size="sm"
											className={`p-2 border rounded-xl  text-[10px]  text-base-content/40 shrink-0 active:scale-95`}
											ref={categoryInputRef}
											onClick={() => setIsTagTooltipOpen(true)}
										>
											<Icon name="tags" size={16} />
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
													<Icon name="plus" size={18} />
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
															<Icon
																name="tags"
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
				</Presence>
			</div>
		</div>
	)
}
