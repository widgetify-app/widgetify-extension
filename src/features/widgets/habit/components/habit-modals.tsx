import type { useHabitActions } from '../hooks/use-habit-actions'
import { HabitDetailModal } from './habit-detail-modal/habit-detail-modal'
import { HabitFormModal } from './habit-form-modal/habit-form-modal'

interface HabitModalsProps {
	actions: ReturnType<typeof useHabitActions>
}

export function HabitModals({ actions }: HabitModalsProps) {
	const {
		showForm,
		editingHabit,
		detailHabitId,
		isDetailOpen,
		icons,
		colors,
		isArchiving,
		refetch,
		closeForm,
		openEditHabit,
		closeHabitDetail,
		archiveHabit,
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

			<HabitDetailModal
				isOpen={isDetailOpen}
				habitId={detailHabitId}
				onClose={closeHabitDetail}
				onEdit={openEditHabit}
				onDelete={() => {
					if (detailHabitId) archiveHabit(detailHabitId)
				}}
				isDeleting={isArchiving}
			/>
		</>
	)
}
