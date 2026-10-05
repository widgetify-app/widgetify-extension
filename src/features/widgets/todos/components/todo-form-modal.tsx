import jalaliMoment from 'jalali-moment'
import { useEffect, useState } from 'react'
import Analytics from '@/analytics'
import { showToast } from '@/common/toast'
import { translateError } from '@/common/utils/translate-error'
import { Button, Modal, TextArea, TextInput } from '@/components/ui'
import { useAuth } from '@/context/auth.context'
import { Icon } from '@/icons'
import { safeAwait } from '@/services/api'
import type { Friend } from '@/services/friends/friend-service.hook'
import { useAddTodo } from '@/services/todo/add-todo.hook'
import { useGetTags } from '@/services/todo/get-tags.hook'
import { useRemoveTodo } from '@/services/todo/remove-todo.hook'
import type { Todo, TodoPriority } from '@/services/todo/todo.interface'
import { useUpdateTodo } from '@/services/todo/update-todo.hook'
import { parseTodoDate } from '../utils/parse-date'
import { toTodoDueDate } from '../utils/todo-due-date'
import { PriorityDropdown } from './priority-dropdown'
import { TodoSelectFriends } from './select-friends'
import { TodoCategoryDropdown, TodoDateDropdown } from './todo-form-tools'

const today = () => jalaliMoment().locale('fa')

function initialDate(todo: Todo | null) {
	if (!todo?.date) return today()
	const parsed = parseTodoDate(todo.date)
	return parsed.isValid() ? parsed.locale('fa') : today()
}

interface TodoFormModalProps {
	isOpen: boolean
	todo: Todo | null
	onClose: () => void
	onChanged: () => void
}

export function TodoFormModal({ isOpen, todo, onClose, onChanged }: TodoFormModalProps) {
	const isEdit = Boolean(todo)
	const canEdit = !todo || Boolean(todo.owner?.isSelf)
	const { isAuthenticated } = useAuth()
	const { data: tags } = useGetTags(isAuthenticated && isOpen)
	const { mutateAsync: addTodo, isPending: isAdding } = useAddTodo()
	const { mutateAsync: updateTodo, isPending: isUpdating } = useUpdateTodo(
		todo?.id || null
	)
	const { mutateAsync: removeTodo, isPending: isRemoving } = useRemoveTodo(
		todo?.id || ''
	)
	const isPending = isAdding || isUpdating || isRemoving

	const [text, setText] = useState('')
	const [description, setDescription] = useState('')
	const [category, setCategory] = useState('')
	const [priority, setPriority] = useState<TodoPriority | undefined>(undefined)
	const [date, setDate] = useState(today)
	const [friends, setFriends] = useState<Friend[]>([])
	const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)

	useEffect(() => {
		if (!isOpen) return
		setText(todo?.text ?? '')
		setDescription(todo?.description ?? '')
		setCategory(todo?.category ?? '')
		setPriority(todo?.priority)
		setDate(initialDate(todo))
		setFriends([])
		setIsConfirmingDelete(false)
	}, [isOpen, todo])

	const handleSubmit = async () => {
		if (isPending || !canEdit) return
		const title = text.trim()
		if (!title) {
			showToast('یه عنوان برای تسک بنویس', 'error')
			return
		}

		const fields = {
			text: title,
			description: description.trim(),
			priority,
			date: toTodoDueDate(date),
		}

		const [error] = await safeAwait(
			todo
				? updateTodo({
						id: todo.id,
						input: { ...fields, category: category.trim() },
					})
				: addTodo({
						...fields,
						category: category.trim() || undefined,
						completed: false,
						order: 0,
						friendIds: friends.map((friend) => friend.id),
					})
		)

		if (error) {
			showToast(translateError(error) as string, 'error')
			return
		}

		onChanged()
	}

	const handleDelete = async () => {
		if (isPending) return
		const [error] = await safeAwait(removeTodo())
		if (error) {
			showToast(translateError(error) as string, 'error')
			return
		}

		Analytics.event('todo_removed')
		onChanged()
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size="lg"
			title={isEdit ? 'ویرایش تسک' : 'تسک جدید'}
			closeOnBackdropClick={false}
		>
			<div className="flex flex-col gap-3.5">
				{!canEdit && (
					<p className="px-3 py-2 rounded-xl bg-fill text-2xs text-fg-muted">
						این تسک رو یکی از دوستات ساخته؛ فقط خودش می‌تونه ویرایشش کنه.
					</p>
				)}

				<fieldset disabled={!canEdit} className="flex flex-col min-w-0 gap-3.5">
					<div className="flex flex-col gap-1.5">
						<label
							htmlFor="todo-form-title"
							className="text-xs text-fg-muted"
						>
							عنوان
						</label>
						<TextInput
							id="todo-form-title"
							value={text}
							onChange={setText}
							onKeyDown={(e) => {
								if (e.key === 'Enter') handleSubmit()
							}}
							placeholder="مثلا: خرید نون"
							debounce={false}
						/>
					</div>

					<div className="flex flex-col gap-1.5">
						<label
							htmlFor="todo-form-description"
							className="text-xs text-fg-muted"
						>
							توضیح
						</label>
						<TextArea
							id="todo-form-description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="توضیح یا لینک، اگه لازمه"
							rows={5}
						/>
					</div>

					<div className="flex flex-wrap items-center gap-1">
						<TodoDateDropdown date={date} onChange={setDate} />
						<TodoCategoryDropdown
							category={category}
							tags={tags}
							onChange={setCategory}
						/>
						<PriorityDropdown priority={priority} setPriority={setPriority} />
						{!isEdit && (
							<TodoSelectFriends
								selectedFriends={friends}
								setSelectedFriends={setFriends}
							/>
						)}
					</div>
				</fieldset>

				{isConfirmingDelete ? (
					<div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-danger-fill">
						<span className="flex-1 text-xs text-fg">
							این تسک برای همیشه حذف بشه؟
						</span>
						<Button
							size="sm"
							variant="ghost"
							rounded="lg"
							onClick={() => setIsConfirmingDelete(false)}
							disabled={isPending}
						>
							نه
						</Button>
						<Button
							size="sm"
							color="danger"
							rounded="lg"
							onClick={handleDelete}
							disabled={isPending}
						>
							{isRemoving ? 'در حال حذف...' : 'حذف'}
						</Button>
					</div>
				) : (
					<div className="flex items-center gap-1.5 pt-1">
						{isEdit && (
							<Button
								size="md"
								variant="ghost"
								color="danger"
								rounded="xl"
								onClick={() => setIsConfirmingDelete(true)}
								disabled={isPending}
								icon={<Icon name="trash" size={14} />}
							>
								حذف
							</Button>
						)}
						<Button
							size="md"
							rounded="xl"
							onClick={onClose}
							disabled={isPending}
							className="w-1/4 ms-auto"
						>
							انصراف
						</Button>
						{canEdit && (
							<Button
								color="brand"
								size="md"
								rounded="xl"
								onClick={handleSubmit}
								disabled={isPending}
								className="flex-1"
							>
								{isPending
									? 'در حال ذخیره...'
									: isEdit
										? 'ذخیره تغییرات'
										: 'افزودن تسک'}
							</Button>
						)}
					</div>
				)}
			</div>
		</Modal>
	)
}
