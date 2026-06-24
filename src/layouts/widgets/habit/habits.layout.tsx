import { useState } from 'react'
import { MdRefresh } from 'react-icons/md'
import Analytics from '@/analytics'
import { autoFormatErrorToast, showToast } from '@/common/toast'
import { Button } from '@/components/button/button'
import { ConfirmationModal } from '@/components/modal/confirmation-modal'
import Tooltip from '@/components/toolTip'
import { useAuth } from '@/context/auth.context'
import { useDate } from '@/context/date.context'
import { useGeneralSetting } from '@/context/general-setting.context'
import { safeAwait } from '@/services/api'
import { useArchiveHabit } from '@/services/hooks/habit/archive-habit.hook'
import { useGetHabits } from '@/services/hooks/habit/get-habits.hook'
import type { Habit } from '@/services/hooks/habit/habit.interface'
import { WidgetContainer } from '../widget-container'
import { HabitDetailModal } from './components/habit-detail.modal'
import { HabitFormModal } from './components/habit-form.modal'
import { HabitItem } from './components/habit.item'
import { BiPlus } from 'react-icons/bi'

export function HabitsContent() {
	const { isAuthenticated } = useAuth()
	const { today } = useDate()
	const { blurMode } = useGeneralSetting()

	const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
	const [detailHabitId, setDetailHabitId] = useState<string | null>(null)
	const [showForm, setShowForm] = useState(false)
	const [archiveConfirm, setArchiveConfirm] = useState<string | null>(null)

	const { data, isLoading, refetch, isRefetching } = useGetHabits(isAuthenticated)
	const { mutateAsync: archiveHabit, isPending: isArchiving } = useArchiveHabit()

	const handleCloseForm = () => {
		setShowForm(false)
		setEditingHabit(null)
	}

	const handleAddHabit = () => {
		setEditingHabit(null)
		setShowForm(true)
		Analytics.event('habit_form_opened')
	}

	const handleEditHabit = (habit: Habit) => {
		setEditingHabit(habit)
		setShowForm(true)
		Analytics.event('habit_edit_opened')
	}

	const handleConfirmArchive = async () => {
		if (!archiveConfirm || isArchiving) return

		const [error] = await safeAwait(archiveHabit(archiveConfirm))

		if (error) {
			autoFormatErrorToast(error)
			return
		}

		setArchiveConfirm(null)
		showToast('عادت حذف شد.', 'success')
		Analytics.event('habit_archived')
		refetch()
	}

	const onRefresh = () => {
		refetch()
		Analytics.event('habit_refetch')
	}

	const onCloseDetailModal = () => {
		setDetailHabitId(null)
		refetch()
		Analytics.event('habit_close_detail_model')
	}

	const isWaiting = isLoading || isRefetching

	return (
		<>
			<div className="flex-none">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-1">
						<h2 className="text-sm font-semibold text-content">عادت‌ها</h2>
						{/* <span className="px-1.5 py-0.5 text-[10px] font-medium rounded-full bg-primary/15 text-primary/90">
							آزمایشی
						</span> */}
					</div>

					<div className="flex items-center gap-1">
						<Tooltip content="بارگذاری مجدد">
							<Button
								size="sm"
								className="px-2 py-0! border-none! rounded-xl text-base-content/40 shrink-0 active:scale-95 h-7!"
								onClick={onRefresh}
								disabled={isWaiting}
							>
								<MdRefresh
									className={`text-content opacity-50 hover:opacity-100 ${
										isWaiting ? 'animate-spin' : ''
									}`}
								/>
							</Button>
						</Tooltip>
					</div>
				</div>
			</div>

			<div className="mt-0.5 grow overflow-hidden pb-2">
				<div
					className={`space-y-1.5 overflow-y-auto scrollbar-none h-full ${blurMode ? 'blur-mode' : 'disabled-blur-mode'}`}
				>
					{isLoading ? (
						<div className="flex flex-col gap-1.5">
							{[...Array(3)].map((_, i) => (
								<div
									key={i}
									className="h-16 rounded-lg bg-base-300/30 animate-pulse"
								/>
							))}
						</div>
					) : data?.items?.length === 0 ? (
						<div className="flex flex-col items-center justify-center h-full gap-2 px-4">
							<div className="flex items-center justify-center w-12 h-12 rounded-full bg-base-300/70">
								<span className="text-lg">🎯</span>
							</div>
							<p className="font-bold text-center text-content">
								هیچ عادتی برای نمایش وجود ندارد
							</p>
							<p className="text-[.65rem] text-center text-content opacity-75">
								یک عادت جدید اضافه کن تا شروع کنی
							</p>
						</div>
					) : (
						<div className="flex flex-col gap-1">
							{data?.items?.map((habit) => (
								<HabitItem
									key={habit.id}
									habit={habit}
									today={today}
									onChanged={refetch}
									onEdit={() => handleEditHabit(habit)}
									onArchive={() => setArchiveConfirm(habit.id)}
									onViewDetails={() => setDetailHabitId(habit.id)}
								/>
							))}
						</div>
					)}
				</div>
			</div>

			<Button
				size="sm"
				onClick={handleAddHabit}
				className="px-2 py-0! border-none! rounded-xl text-base-content/40 shrink-0 active:scale-95 h-7!"
			>
				<BiPlus className="w-4 h-4" />
				افزودن
			</Button>

			<HabitFormModal
				isOpen={showForm}
				habit={editingHabit}
				onClose={handleCloseForm}
				onSaved={() => {
					handleCloseForm()
					refetch()
				}}
				icons={data?.icons || []}
				colors={data?.colors || []}
			/>

			<HabitDetailModal
				isOpen={!!detailHabitId}
				habitId={detailHabitId}
				onClose={() => onCloseDetailModal()}
			/>

			<ConfirmationModal
				isOpen={!!archiveConfirm}
				onClose={() => setArchiveConfirm(null)}
				onConfirm={handleConfirmArchive}
				variant="danger"
				title="آرشیو عادت"
				message="آیا از آرشیو این عادت اطمینان داری؟"
				confirmText="آرشیو"
				cancelText="انصراف"
				isLoading={isArchiving}
			/>
		</>
	)
}

export function HabitsLayout() {
	return (
		<WidgetContainer>
			<HabitsContent />
		</WidgetContainer>
	)
}
