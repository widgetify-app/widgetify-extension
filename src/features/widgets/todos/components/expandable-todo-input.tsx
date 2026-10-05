import { useEffect, useRef, useState, useCallback } from 'react'
import { TextInput } from '@/components/ui'
import { Button, Spinner } from '@/components/ui'
import jalaliMoment from 'jalali-moment'
import { useGetTags } from '@/services/todo/get-tags.hook'
import { useAuth } from '@/context/auth.context'
import { PriorityDropdown } from './priority-dropdown'
import type { Todo, TodoPriority } from '@/services/todo/todo.interface'
import { type TodoCreationPayload, useAddTodo } from '@/services/todo/add-todo.hook'
import { useUpdateTodo } from '@/services/todo/update-todo.hook'
import { translateError } from '@/common/utils/translate-error'
import { showToast } from '@/common/toast'
import type { Friend } from '@/services/friends/friend-service.hook'
import { TodoSelectFriends } from './select-friends'
import { callEvent } from '@/common/utils/call-event'
import { cn } from '@/common/utils/cn'
import { Icon } from '@/icons'
import { toTodoDueDate } from '../utils/todo-due-date'
import { TodoCategoryDropdown, TodoDateDropdown } from './todo-form-tools'
interface ExpandableTodoInputProps {
	editTodo?: Todo | null
	onClose: () => void
	isEdit: boolean
	onUpdated?: () => void
}
const getTodayJalaliMoment = () => jalaliMoment().locale('fa')
export function ExpandableTodoInput({
	editTodo,
	onClose,
	isEdit,
	onUpdated,
}: ExpandableTodoInputProps) {
	const { isAuthenticated } = useAuth()
	const { mutateAsync: addTodoAsync, isPending: isCreatingTodo } = useAddTodo()
	const { mutateAsync: updateTodoAsync, isPending: isUpdatingTodo } = useUpdateTodo(
		editTodo?.id || null
	)
	const [isExpanded, setIsExpanded] = useState(false)
	const [priority, setPriority] = useState<TodoPriority | undefined>(undefined)
	const [category, setCategory] = useState('')
	const { data: fetchedTags } = useGetTags(isAuthenticated && isExpanded)
	const [selectedDate, setSelectedDate] = useState<jalaliMoment.Moment>(
		getTodayJalaliMoment()
	)

	const inputRef = useRef<HTMLInputElement | null>(null)
	const notesRef = useRef<HTMLTextAreaElement>(null)
	const containerRef = useRef<HTMLDivElement>(null)
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
				setSelectedFriends(
					editTodo.friends.map(
						(f) =>
							({
								user: {
									name: f.name,
									avatar: f.avatar,
									userId: null,
								},
								status: 'ACCEPTED',
							}) as unknown as Friend
					)
				)
			}

			setIsExpanded(true)
			setTimeout(() => {
				if (notesRef.current) notesRef.current.value = editTodo.description || ''
			}, 2)
		} else {
			resetForm()
		}
	}, [editTodo])

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
		setCategory('')
		setPriority(undefined)
		setSelectedDate(getTodayJalaliMoment())
		setIsExpanded(false)
		setSelectedFriends([])
	}, [])

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
					date: toTodoDueDate(selectedDate),
					friendIds: selectedFriends.map((f) => f.id),
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
		<div
			ref={containerRef}
			className={cn(
				'flex flex-col flex-none',
				isExpanded &&
					'gap-2 p-2.5 shadow-lg rounded-2xl bg-surface-2 ring-[1.5px] ring-inset ring-brand-muted'
			)}
		>
			<div
				className={cn(
					'flex items-center gap-2',
					!isExpanded &&
						'px-2.5 h-8.5 rounded-xl text-fg-faint transition-ui hover:bg-fill focus-within:bg-fill'
				)}
			>
				{!isExpanded && <Icon name="plus" size={14} aria-hidden="true" />}
				<TextInput
					ref={inputRef}
					defaultValue=""
					onChange={handleTodoTextChange}
					placeholder="تسک جدید"
					aria-label="عنوان تسک جدید"
					variant="bare"
					className={cn(
						'text-xs',
						isExpanded ? 'h-6 font-semibold text-fg-strong' : 'font-medium'
					)}
					onFocus={handleInputFocus}
					onKeyDown={handleKeyDown}
					id="expandable-todo-input"
					debounce={false}
				/>
			</div>
			{isExpanded && (
				<>
					<textarea
						ref={notesRef}
						onChange={(e) => handleNotesChange(e.target.value)}
						placeholder="توضیح یا لینک، اگه لازمه"
						rows={2}
						className="w-full p-0 leading-relaxed bg-transparent outline-none resize-none text-2xs text-fg-muted placeholder:text-fg-faint"
					/>
					<div className="flex items-center gap-1">
						<TodoDateDropdown
							date={selectedDate}
							onChange={setSelectedDate}
						/>
						<TodoCategoryDropdown
							category={category}
							tags={fetchedTags}
							onChange={setCategory}
						/>

						<PriorityDropdown priority={priority} setPriority={setPriority} />

						{!isEdit && isAuthenticated && (
							<TodoSelectFriends
								selectedFriends={selectedFriends}
								setSelectedFriends={(fList: Friend[]) => {
									setSelectedFriends(fList)
								}}
							/>
						)}

						<span className="flex-1" />

						{isEdit && (
							<Button
								onClick={() => onCloseEdit()}
								disabled={isPending}
								size="xs"
								variant="ghost"
								rounded="lg"
							>
								انصراف
							</Button>
						)}
						<Button
							onClick={() => handleSave()}
							disabled={isPending}
							loading={isPending}
							loadingText={<Spinner size="sm" tone="current" />}
							size="xs"
							color="brand"
							rounded="lg"
						>
							{isEdit ? 'ذخیره' : 'افزودن'}
						</Button>
					</div>
				</>
			)}
		</div>
	)
}
