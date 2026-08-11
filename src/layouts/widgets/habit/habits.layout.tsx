import { useState } from 'react'
import Analytics from '@/analytics'
import { autoFormatErrorToast, showToast } from '@/common/toast'
import { Button } from '@/components/button/button'
import { ConfirmationModal } from '@/components/modal/confirmation-modal'
import Tooltip from '@/components/tool-tip'
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
import { HabitItem } from './components/item/habit.item'
import { callEvent } from '@/common/utils/call-event'
import { HabitItemSkeleton } from './components/item/habit-item.skeleton'
import { Icon } from '@/src/icons'
import { HabitEmpty } from './components/habit-empty'

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
		if (!isAuthenticated) {
			callEvent('openProfile')
			return
		}
		setEditingHabit(null)
		setShowForm(true)
		Analytics.event('habit_form_opened')
	}

	const handleEditHabit = (habit: Habit) => {
		if (!isAuthenticated) {
			callEvent('openProfile')
			return
		}

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
		setDetailHabitId(null)
		showToast('عادت حذف شد.', 'success')
		Analytics.event('habit_archived')
		refetch()
	}

	const onRefresh = () => {
		if (!isAuthenticated) {
			callEvent('openProfile')
			return
		}

		refetch()
		Analytics.event('habit_refetch')
	}

	const onCloseDetailModal = () => {
		setDetailHabitId(null)
		refetch()
		Analytics.event('habit_close_detail_model')
	}

	const isWaiting = isLoading || isRefetching
	const isEmpty = (!isLoading && data?.items?.length === 0) || !isAuthenticated
	return (
		<div className="flex flex-col h-full">
			<div className="flex-none">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-1">
						<h2 className="text-sm font-semibold text-content">عادت‌ها</h2>
					</div>

					<div className="flex items-center gap-1">
						<Tooltip content="بارگذاری مجدد">
							<Button
								size="sm"
								className="px-2 py-0! border-none! rounded-xl text-base-content/40 shrink-0 active:scale-95 h-7!"
								onClick={onRefresh}
								disabled={isWaiting}
							>
								<Icon
									name="refresh"
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
				<div className="space-y-1.5 overflow-y-auto scrollbar-none h-full">
					{isLoading ? (
						<div className="flex flex-col gap-1.5">
							{[...Array(4)].map((_, i) => (
								<HabitItemSkeleton key={`skeleton-${i}`} />
							))}
						</div>
					) : isEmpty ? (
						<HabitEmpty />
					) : (
						<div
							className={`flex flex-col gap-1 ${blurMode ? 'blur-mode' : 'disabled-blur-mode'}`}
						>
							{data?.items?.map((habit) => (
								<HabitItem
									key={habit.id}
									habit={habit}
									today={today}
									onChanged={refetch}
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
				className="px-2 py-0!  w-full border-none! rounded-xl text-base-content/40 shrink-0 active:scale-95 h-7!"
			>
				<Icon name="plus" className="w-4 h-4" />
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

			{!!detailHabitId && (
				<HabitDetailModal
					isOpen={true}
					habitId={detailHabitId}
					onClose={() => onCloseDetailModal()}
					onEdit={(habit) => handleEditHabit(habit)}
					onArchive={() => setArchiveConfirm(detailHabitId)}
				/>
			)}

			<ConfirmationModal
				isOpen={!!archiveConfirm}
				onClose={() => setArchiveConfirm(null)}
				onConfirm={handleConfirmArchive}
				variant="danger"
				title="بایگانی عادت؟"
				message={`از بایگانی کردن این عادت اطمینان داری؟`}
				confirmText="بله، بایگانی کن"
				cancelText="انصراف"
				isLoading={isArchiving}
			/>
		</div>
	)
}

export function HabitsLayout() {
	return (
		<WidgetContainer>
			<HabitsContent />
		</WidgetContainer>
	)
}
