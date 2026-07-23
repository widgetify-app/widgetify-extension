import Modal from '@/components/modal'
import { useGetHabitDetail } from '@/services/hooks/habit/get-habit-detail.hook'
import { HabitCalendar } from './habit-calendar-heatmap'
import { useAuth } from '@/context/auth.context'
import { formatHabitGoal } from '../utils'
import { Button } from '@/components/button/button'
import { Dropdown } from '@/components/dropdown'
import type { Habit } from '@/services/hooks/habit/habit.interface'
import { callEvent } from '@/common/utils/call-event'
import { Icon } from '@/src/icons'

interface ModalProps {
	isOpen: boolean
	habitId: string | null
	onClose: () => void
	onEdit: (habit: Habit) => void
	onArchive: () => void
}

export function HabitDetailModal({
	isOpen,
	habitId,
	onClose,
	onArchive,
	onEdit,
}: ModalProps) {
	const { isAuthenticated } = useAuth()
	const onClickEdit = () => {
		if (habit) {
			callEvent('closeAllDropdowns')
			onEdit(habit)
		}
	}

	const onClickArchive = () => {
		if (habit) {
			callEvent('closeAllDropdowns')
			onArchive()
		}
	}

	const {
		data: habit,
		isLoading,
		error,
	} = useGetHabitDetail(habitId || '', isOpen && isAuthenticated)

	const color = habit?.color || '#3b82f6'

	const title =
		isLoading || !habit ? (
			<div className="flex items-center gap-2">
				<div className="rounded-lg w-7 h-7 skeleton" />
				<div className="flex flex-col flex-1 gap-2">
					<div className="h-4 rounded w-28 skeleton" />
					<div className="w-16 h-3 rounded skeleton" />
				</div>
			</div>
		) : (
			<div className="flex items-center gap-2">
				<div
					className="flex items-center justify-center rounded-lg w-7 h-7 shrink-0"
					style={{
						backgroundColor: `${color}22`,
					}}
				>
					{habit.emoji || '🎯'}
				</div>

				<div className="flex-1 min-w-0">
					<div className="flex items-center text-xs text-content gap-x-1">
						<p className="font-medium truncate ">{habit.title}</p>
						<Dropdown
							trigger={
								<Button
									size="xs"
									className="text-xs border-none py-1! rounded-xl"
								>
									<Icon
										name="menuOption"
										size={15}
										strokeWidth={0.35}
									/>
								</Button>
							}
						>
							<div className="flex flex-col p-2 border bg-base-200 border-base-300 rounded-2xl">
								<button
									className={`w-full px-3 py-1 flex items-center gap-x-2.25 cursor-pointer rounded-lg transition-colors duration-200 text-content hover:text-content/90 hover:bg-base-300/70!`}
									onClick={onClickEdit}
								>
									<Icon name="pen" size={13} />
									<span className="font-medium">ویرایش</span>
								</button>

								<button
									className={`w-full px-3 py-1 flex items-center gap-x-2.5 cursor-pointer rounded-lg transition-colors duration-200 text-error hover:text-error/90 hover:bg-error/10!`}
									onClick={onClickArchive}
								>
									<Icon name="archive" size={14} />
									<span className="font-medium">بایگانی</span>
								</button>
							</div>
						</Dropdown>
					</div>
					<p className="text-[10px] truncate text-muted">
						{formatHabitGoal(habit)}
					</p>
				</div>
			</div>
		)

	return (
		<Modal isOpen={isOpen} onClose={onClose} direction="rtl" size="md" title={title}>
			{isLoading ? (
				<div className="p-2">
					<div className="w-full h-85 rounded-2xl skeleton" />
				</div>
			) : error ? (
				<div className="flex flex-col items-center justify-center py-16 text-center">
					<p className="text-sm font-medium text-content">
						خطا در دریافت اطلاعات
					</p>
					<p className="mt-1 text-xs text-muted">
						لطفا چند لحظه دیگر دوباره تلاش کنید.
					</p>
				</div>
			) : !habit ? (
				<div className="flex flex-col items-center justify-center py-16 text-center">
					<div className="mb-2 text-3xl">📭</div>
					<p className="text-sm text-muted">اطلاعات این عادت پیدا نشد.</p>
				</div>
			) : (
				<div className="">
					<div className="p-2">
						<HabitCalendar habit={habit} color={color} />
					</div>
				</div>
			)}
		</Modal>
	)
}
