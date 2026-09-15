import type React from 'react'
import { ConfirmationModal } from '@/components/ui'
import type { useHabitActions } from '../hooks/use-habit-actions'
import { HabitDetailModal } from './habit-detail-modal'
import { HabitFormModal } from './habit-form-modal'

interface HabitModalsProps {
	actions: ReturnType<typeof useHabitActions>
}

export const HabitModals: React.FC<HabitModalsProps> = ({ actions }) => {
	const {
		showForm,
		editingHabit,
		detailHabitId,
		archiveConfirm,
		icons,
		colors,
		isArchiving,
		refetch,
		closeForm,
		openEditHabit,
		closeHabitDetail,
		confirmArchive,
		setArchiveConfirm,
	} = actions

	return (
		<>
			<HabitFormModal
				isOpen={showForm}
				habit={editingHabit}
				onClose={closeForm}
				onSaved={() => {
					closeForm()
					refetch()
				}}
				icons={icons}
				colors={colors}
			/>

			{detailHabitId && (
				<HabitDetailModal
					isOpen={!!detailHabitId}
					habitId={detailHabitId}
					onClose={closeHabitDetail}
					onEdit={openEditHabit}
					onArchive={() => setArchiveConfirm(detailHabitId)}
				/>
			)}

			<ConfirmationModal
				isOpen={!!archiveConfirm}
				onClose={() => setArchiveConfirm(null)}
				onConfirm={confirmArchive}
				variant="danger"
				title="حذف این عادت؟"
				message="این عادت و سابقه‌اش از لیست برداشته می‌شوند و راهی برای برگرداندنشان از داخل برنامه وجود ندارد."
				confirmText="بله، حذف کن"
				cancelText="انصراف"
				isLoading={isArchiving}
			/>
		</>
	)
}
