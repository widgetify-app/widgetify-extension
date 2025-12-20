import { useState, useRef, useEffect, useCallback } from 'react'
import { FiMessageSquare, FiTag, FiCalendar } from 'react-icons/fi'
import { TextInput } from '@/components/text-input'
import { Button } from '@/components/button/button'
import type { TodoPriority } from '@/context/todo.context'
import type { Todo } from '@/services/hooks/todo/todo.interface'
import Modal from '@/components/modal'
import { PRIORITY_OPTIONS } from '@/common/constant/priority_options'
import { PriorityButton } from '@/components/priority-options/priority-options'
import { ClickableTooltip } from '@/components/clickableTooltip'
import { DatePicker } from '@/components/date-picker/date-picker'
import type jalaliMoment from 'jalali-moment'
import { parseTodoDate } from './tools/parse-date'
import { showToast } from '@/common/toast'
import { useUpdateTodo } from '@/services/hooks/todo/update-todo.hook'
import { safeAwait } from '@/services/api'
import { translateError } from '@/utils/translate-error'
import { useQueryClient } from '@tanstack/react-query'
import Analytics from '@/analytics'

interface EditTodoModalProps {
	todo: Todo
	isOpen: boolean
	onClose: () => void
}

export function EditTodoModal({ todo, isOpen, onClose }: EditTodoModalProps) {
	const queryClient = useQueryClient()

	const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
	const [selectedDate, setSelectedDate] = useState<jalaliMoment.Moment | undefined>(
		todo.date ? parseTodoDate(todo.date) : undefined
	)
	const { mutateAsync, isPending } = useUpdateTodo()
	const datePickerButtonRef = useRef<HTMLButtonElement>(null)

	const [text, setText] = useState(todo.text)
	const [notes, setNotes] = useState(todo.notes || '')
	const [category, setCategory] = useState(todo.category || '')
	const [priority, setPriority] = useState<TodoPriority>(todo.priority as TodoPriority)

	useEffect(() => {
		setText(todo.text)
		setNotes(todo.notes || '')
		setCategory(todo.category || '')
		setPriority(todo.priority as TodoPriority)
		setSelectedDate(todo.date ? parseTodoDate(todo.date) : undefined)
		Analytics.event('todo_edit_opened')
	}, [todo])

	const handleTextChange = useCallback((value: string) => {
		setText(value)
	}, [])

	const handleNotesChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setNotes(e.target.value)
	}, [])

	const handleCategoryChange = useCallback((value: string) => {
		setCategory(value)
	}, [])

	const handlePriorityChange = useCallback((newPriority: TodoPriority) => {
		setPriority(newPriority)
	}, [])

	const handleDateSelect = useCallback((date: jalaliMoment.Moment) => {
		setSelectedDate(date)
		setIsDatePickerOpen(false)
	}, [])

	const handleSave = useCallback(async () => {
		if (!text.trim()) {
			showToast('متن وظیفه نمی‌تواند خالی باشد', 'error')
			return
		}

		const input = {
			text,
			notes,
			category,
			priority,
			date: selectedDate?.add(3.5, 'hours').toISOString(),
		}

		const [err, _] = await safeAwait(
			mutateAsync({
				id: todo.onlineId || todo.id,
				input,
			})
		)

		if (err) {
			showToast(translateError(err) as any, 'error')
			return
		}
		showToast('وظیفه با موفقیت ویرایش شد', 'success')
		onClose()
		queryClient.invalidateQueries({ queryKey: ['getTodos'] })
	}, [text, notes, category, priority, selectedDate, onClose])

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="ویرایش وظیفه"
			size="md"
			direction="rtl"
		>
			<div className="p-1 space-y-2">
				<div className="space-y-2">
					<TextInput
						value={text}
						onChange={handleTextChange}
						placeholder="متن وظیفه را وارد کنید"
						className="text-sm"
						debounce={false}
					/>
				</div>

				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="relative flex-shrink-0 text-center">
							<span className="absolute w-2 h-2 rounded-full -left-0.5 -bottom-0.5 bg-error animate-pulse"></span>
							<FiCalendar className="text-indigo-400" size={14} />
						</div>
						<button
							ref={datePickerButtonRef}
							onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
							className="min-w-full text-right px-2 py-1.5 min-h-8 text-xs rounded-xl border border-base-300 hover:border-primary/50 transition-colors bg-content text-content opacity-75 cursor-pointer"
						>
							{selectedDate
								? selectedDate.locale('fa').format('dddd، jD jMMMM')
								: 'انتخاب تاریخ'}
						</button>
						<ClickableTooltip
							triggerRef={datePickerButtonRef}
							isOpen={isDatePickerOpen}
							setIsOpen={setIsDatePickerOpen}
							content={
								<DatePicker
									onDateSelect={handleDateSelect}
									selectedDate={selectedDate}
								/>
							}
							contentClassName="!p-0 !bg-transparent !border-none !shadow-none"
						/>
					</div>
					<div className="flex items-center gap-1">
						{PRIORITY_OPTIONS.map((option) => (
							<PriorityButton
								key={option.value}
								option={option}
								isSelected={priority === option.value}
								onClick={() =>
									handlePriorityChange(option.value as TodoPriority)
								}
							/>
						))}
					</div>
				</div>

				<div className="flex items-center gap-3">
					<div className="flex-shrink-0 text-center">
						<FiTag className="text-indigo-400" size={14} />
					</div>
					<TextInput
						value={category}
						onChange={handleCategoryChange}
						placeholder="دسته‌بندی (مثال: شخصی، کاری)"
						className="text-xs placeholder:text-xs py-1.5"
						debounce={false}
					/>
				</div>

				<div className="flex items-center gap-2">
					<div className="flex-shrink-0 text-center">
						<FiMessageSquare className="text-indigo-400" size={14} />
					</div>
					<textarea
						value={notes}
						onChange={handleNotesChange}
						placeholder="یادداشت یا لینک (اختیاری)"
						className="w-full px-4 py-2 mt-2 text-base font-light leading-relaxed transition-all border-none outline-none resize-none bg-content min-h-48 focus:ring-1 focus:ring-primary/30 rounded-xl text-muted "
					/>
				</div>

				{/* Action Buttons */}
				<div className="flex items-center justify-end gap-2 pt-4">
					<Button
						onClick={onClose}
						size="md"
						disabled={isPending}
						className={
							'btn btn-circle !bg-base-300 hover:!bg-error/10 text-muted hover:!text-error px-10 border-none shadow-none !rounded-2xl transition-colors duration-300 ease-in-out'
						}
					>
						لغو
					</Button>
					<Button
						onClick={handleSave}
						disabled={!text?.trim() || isPending}
						size="md"
						isPrimary={true}
						loading={isPending}
						className={
							'btn btn-circle !w-fit px-8 border-none shadow-none text-secondary !rounded-2xl transition-colors duration-300 ease-in-out'
						}
					>
						ذخیره
					</Button>
				</div>
			</div>
		</Modal>
	)
}
