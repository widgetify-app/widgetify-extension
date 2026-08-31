import { useState } from 'react'
import Analytics from '@/analytics'
import { autoFormatErrorToast, showToast } from '@/common/toast'
import { Button, ConfirmationModal, MODAL_EXIT_MS } from '@/components/ui'
import { useDelayedUnmount, useLastDefined } from '@/hooks/use-delayed-unmount'
import { Tooltip } from '@/components/ui'
import { useAuth } from '@/context/auth.context'
import { useGeneralSetting } from '@/context/general-setting.context'
import { getCurrentDate } from '@/layouts/widgets/calendar/utils'
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
import { HabitCompactSquare } from './variants/habit-1x1'
import { HabitCompactWide } from './variants/habit-2x1'
import type { WidgetSize } from '../layout-engine/types'

export function HabitsContent() {
	const { isAuthenticated } = useAuth()
	const { selected_timezone: timezone, blurMode } = useGeneralSetting()
	const today = getCurrentDate(timezone.value)

	const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
	const [detailHabitId, setDetailHabitId] = useState<string | null>(null)
	const lastDetailHabitId = useLastDefined(detailHabitId)
	const shouldMountDetail = useDelayedUnmount(!!detailHabitId, MODAL_EXIT_MS)
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
						<Tooltip content="عادت جدید">
							<Button
								variant="primary"
								rounded="xl"
								size="sm"
								className="h-7! gap-1 px-2.5! text-xs shrink-0"
								onClick={handleAddHabit}
							>
								<Icon name="plus" className="w-3.5 h-3.5" />
								<span>جدید</span>
							</Button>
						</Tooltip>
					</div>

					<div className="flex items-center gap-1">
						<Tooltip content="بارگذاری مجدد">
							<Button
								size="sm"
								className="px-2 py-0! border-none! group rounded-xl text-base-content/40 shrink-0 active:scale-95 h-7!"
								onClick={onRefresh}
							>
								<Icon
									name="refresh"
									className={`text-content opacity-50 group-hover:opacity-100 ${isWaiting ? 'animate-spin' : ''}`}
								/>
							</Button>
						</Tooltip>
					</div>
				</div>
			</div>

			<div className="mt-1 grow overflow-hidden">
				<div className="space-y-1.5 overflow-y-auto scrollbar-none h-full">
					{isLoading ? (
						<div className="flex flex-col gap-1.5">
							{[...Array(3)].map((_, i) => (
								<HabitItemSkeleton key={i} />
							))}
						</div>
					) : isEmpty ? (
						<HabitEmpty />
					) : (
						<div
							className={`flex flex-col gap-1.5 ${blurMode ? 'blur-mode' : 'disabled-blur-mode'}`}
						>
							{data?.items?.map((habit) => (
								<HabitItem
									key={habit.id}
									habit={habit}
									today={today}
									onChanged={() => refetch()}
									onViewDetails={() => {
										setDetailHabitId(habit.id)
										Analytics.event('habit_open_detail_model')
									}}
								/>
							))}
						</div>
					)}
				</div>
			</div>

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

			{shouldMountDetail && (
				<HabitDetailModal
					isOpen={!!detailHabitId}
					habitId={lastDetailHabitId}
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

interface HabitsLayoutProps {
	size?: WidgetSize
}

export function HabitsLayout({ size = { w: 2, h: 2 } }: HabitsLayoutProps = {}) {
	const { isAuthenticated } = useAuth()
	const { selected_timezone: timezone } = useGeneralSetting()
	const { data, isLoading, refetch } = useGetHabits(isAuthenticated)
	const { mutateAsync: archiveHabit, isPending: isArchiving } = useArchiveHabit()

	const [showForm, setShowForm] = useState(false)
	const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
	const [detailHabitId, setDetailHabitId] = useState<string | null>(null)
	const lastDetailHabitId = useLastDefined(detailHabitId)
	const shouldMountDetail = useDelayedUnmount(!!detailHabitId, MODAL_EXIT_MS)
	const [archiveConfirm, setArchiveConfirm] = useState<string | null>(null)

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

	const handleCloseForm = () => {
		setShowForm(false)
		setEditingHabit(null)
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
		showToast('عادت حذف شد', 'success')
		Analytics.event('habit_archived')
		refetch()
	}

	const handleCloseDetailModal = () => {
		setDetailHabitId(null)
		refetch()
		Analytics.event('habit_close_detail_model')
	}

	if (size.w === 1 && size.h === 1) {
		return (
			<WidgetContainer>
				<HabitCompactSquare
					habits={data?.items || []}
					isLoading={isLoading}
					onAddHabit={handleAddHabit}
				/>
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
			</WidgetContainer>
		)
	}

	if (size.w === 2 && size.h === 1) {
		return (
			<WidgetContainer>
				<HabitCompactWide
					habits={data?.items || []}
					isLoading={isLoading}
					today={getCurrentDate(timezone.value)}
					onChanged={() => refetch()}
					onAddHabit={handleAddHabit}
					onViewDetails={(id) => {
						setDetailHabitId(id)
						Analytics.event('habit_open_detail_model')
					}}
				/>
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
				{shouldMountDetail && (
					<HabitDetailModal
						isOpen={!!detailHabitId}
						habitId={lastDetailHabitId}
						onClose={handleCloseDetailModal}
						onEdit={handleEditHabit}
						onArchive={() => setArchiveConfirm(detailHabitId)}
					/>
				)}
				<ConfirmationModal
					isOpen={!!archiveConfirm}
					onClose={() => setArchiveConfirm(null)}
					onConfirm={handleConfirmArchive}
					variant="danger"
					title="بایگانی عادت؟"
					message="از بایگانی کردن این عادت اطمینان داری؟"
					confirmText="بله، بایگانی کن"
					cancelText="انصراف"
					isLoading={isArchiving}
				/>
			</WidgetContainer>
		)
	}

	return (
		<WidgetContainer>
			<HabitsContent />
		</WidgetContainer>
	)
}
